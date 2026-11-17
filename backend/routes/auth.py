"""
Auth routes for Smart Campus Assistant backend.
All endpoints verify identity from the Supabase JWT — never from client-provided user_id.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import os
import io
import logging

from config import SUPABASE_URL, SUPABASE_SERVICE_KEY, is_supabase_configured

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer(auto_error=False)

# ── Helper: get verified user from JWT ────────────────────────────────────────
async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """
    Extract and verify the caller's user ID from Supabase JWT.
    Returns the user dict from Supabase Auth or raises 401.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="No authentication token provided.")

    if not is_supabase_configured():
        # Demo mode: return a fake user so the app still works without Supabase
        return {"id": "demo-user-001", "email": "demo@campus.edu", "role": "student"}

    try:
        from supabase import create_client
        # Use the anon-key client + the user's JWT to call auth.getUser()
        # The service key client is used for admin ops only
        anon_key = os.environ.get("SUPABASE_ANON_KEY", "")
        client = create_client(SUPABASE_URL, anon_key)
        response = client.auth.get_user(credentials.credentials)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token.")
        user = response.user
        return {"id": user.id, "email": user.email}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(status_code=401, detail="Token verification failed.")


# ── Pydantic models ───────────────────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    full_name:         Optional[str] = None
    phone:             Optional[str] = None
    student_id:        Optional[str] = None
    department:        Optional[str] = None
    course:            Optional[str] = None
    academic_year:     Optional[str] = None
    date_of_birth:     Optional[str] = None
    notification_preferences: Optional[dict] = None
    privacy_settings:  Optional[dict] = None


# ── GET /api/auth/profile ─────────────────────────────────────────────────────
@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    """Return the current user's profile from the profiles table."""
    if not is_supabase_configured():
        return {"id": user["id"], "email": user["email"], "role": "student", "demo": True}

    try:
        from supabase import create_client
        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        result = client.table("profiles").select("*").eq("id", user["id"]).single().execute()
        return result.data
    except Exception as e:
        logger.error(f"Profile fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile.")


# ── PATCH /api/auth/profile ───────────────────────────────────────────────────
@router.patch("/profile")
async def update_profile(update: ProfileUpdate, user: dict = Depends(get_current_user)):
    """Update profile fields. Only updates the authenticated user's own record."""
    if not is_supabase_configured():
        return {"success": True, "demo": True}

    try:
        from supabase import create_client
        from datetime import datetime, timezone
        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        # Build update dict — skip None values
        fields = {k: v for k, v in update.dict().items() if v is not None}
        fields["updated_at"] = datetime.now(timezone.utc).isoformat()

        result = client.table("profiles").update(fields).eq("id", user["id"]).execute()
        return {"success": True, "data": result.data}
    except Exception as e:
        logger.error(f"Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile.")


# ── PATCH /api/auth/profile/avatar ────────────────────────────────────────────
@router.patch("/profile/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Upload or change the authenticated user's avatar.
    Backend enforces:
    - File type must be image/jpeg, image/png, or image/webp
    - File size must be ≤ 2 MB
    - Storage path must start with the authenticated user's ID (never another user's)
    """
    # Type validation
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed.")

    # Size validation — read and check
    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 2 MB.")

    if not is_supabase_configured():
        return {"success": True, "url": None, "demo": True}

    try:
        from supabase import create_client
        from datetime import datetime, timezone

        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        # Build a user-scoped path — backend enforces the prefix
        ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "jpg"
        storage_path = f"avatars/{user['id']}/avatar.{ext}"

        # Remove existing avatars for this user (all extensions)
        for old_ext in ["jpg", "jpeg", "png", "webp"]:
            try:
                client.storage.from_("avatars").remove([f"avatars/{user['id']}/avatar.{old_ext}"])
            except Exception:
                pass  # File may not exist

        # Upload
        client.storage.from_("avatars").upload(
            storage_path,
            contents,
            {"content-type": file.content_type, "upsert": "true"}
        )

        # Get public URL
        url_response = client.storage.from_("avatars").get_public_url(storage_path)
        public_url = url_response if isinstance(url_response, str) else str(url_response)

        # Persist to profile
        client.table("profiles").update({
            "profile_picture_url": public_url,
            "profile_picture_path": storage_path,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", user["id"]).execute()

        return {"success": True, "url": public_url, "path": storage_path}
    except Exception as e:
        logger.error(f"Avatar upload error: {e}")
        raise HTTPException(status_code=500, detail="Avatar upload failed.")


# ── DELETE /api/auth/profile/avatar ──────────────────────────────────────────
@router.delete("/profile/avatar")
async def remove_avatar(user: dict = Depends(get_current_user)):
    """Remove the authenticated user's avatar from storage and clear the profile record."""
    if not is_supabase_configured():
        return {"success": True, "demo": True}

    try:
        from supabase import create_client
        from datetime import datetime, timezone

        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        # Fetch current path
        profile = client.table("profiles").select("profile_picture_path").eq("id", user["id"]).single().execute()
        path = profile.data.get("profile_picture_path") if profile.data else None

        if path:
            try:
                client.storage.from_("avatars").remove([path])
            except Exception:
                pass  # Ignore if file already gone

        # Clear profile columns
        client.table("profiles").update({
            "profile_picture_url": None,
            "profile_picture_path": None,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", user["id"]).execute()

        return {"success": True}
    except Exception as e:
        logger.error(f"Avatar remove error: {e}")
        raise HTTPException(status_code=500, detail="Avatar removal failed.")


# ── POST /api/auth/delete-account ─────────────────────────────────────────────
@router.post("/delete-account")
async def delete_account(user: dict = Depends(get_current_user)):
    """
    Request account deletion. Anonymises the profile and removes auth record.
    In production: schedule for GDPR-compliant deletion with 30-day grace period.
    """
    if not is_supabase_configured():
        return {"success": True, "demo": True, "message": "Demo: account deletion simulated."}

    try:
        from supabase import create_client
        from datetime import datetime, timezone

        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        # Anonymise profile
        client.table("profiles").update({
            "full_name": "[Deleted User]",
            "phone": None,
            "student_id": None,
            "department": None,
            "profile_picture_url": None,
            "profile_picture_path": None,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", user["id"]).execute()

        # Delete from Supabase Auth (requires service role)
        client.auth.admin.delete_user(user["id"])

        return {"success": True, "message": "Account deleted and data anonymised."}
    except Exception as e:
        logger.error(f"Account deletion error: {e}")
        raise HTTPException(status_code=500, detail="Account deletion failed.")
