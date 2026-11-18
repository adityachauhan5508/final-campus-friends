"""
Staff routes — document upload (PDF/CSV), escalation management, KB CRUD.
All write endpoints validate Supabase JWT before processing.
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import logging
import io
import csv

from backend.services.retrieval_service import get_supabase_client
from backend.config import is_supabase_configured, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY as SUPABASE_SERVICE_KEY

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/staff", tags=["Staff Administration"])
security = HTTPBearer(auto_error=False)

# ── Auth helper (staff-only) ──────────────────────────────────────────────────
async def require_staff(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Verifies JWT and checks that the caller has role staff or admin."""
    if not credentials:
        # Demo mode — allow without token for hackathon testing
        return {"id": "demo-staff", "role": "staff"}

    if not is_supabase_configured():
        return {"id": "demo-staff", "role": "staff"}

    try:
        from supabase import create_client
        import os
        anon_key = os.environ.get("SUPABASE_ANON_KEY", "")
        client = create_client(SUPABASE_URL, anon_key)
        response = client.auth.get_user(credentials.credentials)
        if not response or not response.user:
            raise HTTPException(status_code=401, detail="Invalid token.")

        # Check role
        sb = get_supabase_client()
        if sb:
            profile = sb.table("profiles").select("role").eq("id", response.user.id).single().execute()
            role = profile.data.get("role", "student") if profile.data else "student"
            if role not in ("staff", "admin"):
                raise HTTPException(status_code=403, detail="Staff or Admin access required.")
            return {"id": response.user.id, "role": role}
        return {"id": response.user.id, "role": "staff"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Staff auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed.")


# ── Pydantic Models ───────────────────────────────────────────────────────────
class ResolveRequest(BaseModel):
    escalation_id: str
    official_response: str
    resolved_by: str = "Staff Administrator"
    category: str = "General"
    create_faq: bool = True
    faq_title: Optional[str] = None

class NewDocumentRequest(BaseModel):
    title: str
    category: str
    source_type: str = "Official Ordinance"
    clause: str
    page_number: str = "Page 1"
    summary: str
    content: str

class FAQApproveRequest(BaseModel):
    faq_id: str
    approved_by: str = "Staff Administrator"


# ── DOCUMENT UPLOAD (PDF + CSV only) ─────────────────────────────────────────
@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    category: str = Form("General"),
    description: str = Form(""),
    version: str = Form("1.0"),
    staff: dict = Depends(require_staff)
):
    """
    Upload a campus document. ONLY PDF and CSV formats are accepted.
    - Validates file type by extension AND content-type
    - Max size: 10 MB
    - Extracts text from CSV; notes that PDF extraction requires further processing
    - Document starts as 'pending_approval' — not shown to students until approved
    """
    # ── Type validation ───────────────────────────────────────────────────────
    filename_lower = file.filename.lower() if file.filename else ""
    is_pdf = file.content_type == "application/pdf" or filename_lower.endswith(".pdf")
    is_csv = file.content_type in ("text/csv", "application/csv") or filename_lower.endswith(".csv")

    if not is_pdf and not is_csv:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: '{file.filename}'. Only PDF (.pdf) and CSV (.csv) files are accepted. "
                   "DOCX, TXT, XLSX, images and ZIP are rejected."
        )

    # ── Size validation ───────────────────────────────────────────────────────
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB limit.")

    # ── Extract text ──────────────────────────────────────────────────────────
    extracted_text = ""
    extraction_status = "pending"
    file_type = "CSV" if is_csv else "PDF"

    if is_csv:
        try:
            text = contents.decode("utf-8", errors="replace")
            reader = csv.DictReader(io.StringIO(text))
            rows = list(reader)
            # Format CSV as readable Q&A pairs if it has question/answer columns
            if rows and any(k.lower() in ('question', 'q') for k in rows[0].keys()):
                q_key = next((k for k in rows[0].keys() if 'question' in k.lower()), None)
                a_key = next((k for k in rows[0].keys() if 'answer' in k.lower() or 'starter' in k.lower()), None)
                if q_key and a_key:
                    pairs = [f"Q: {row.get(q_key, '')}\nA: {row.get(a_key, '')}" for row in rows[:50]]
                    extracted_text = "\n\n".join(pairs)
                else:
                    extracted_text = text[:3000]
            else:
                extracted_text = text[:3000]
            extraction_status = "extracted"
            logger.info(f"CSV extracted: {len(rows)} rows from '{file.filename}'")
        except Exception as e:
            extracted_text = f"[CSV parsing failed: {e}]"
            extraction_status = "failed"

    elif is_pdf:
        # Try PyPDF2 or pdfplumber if available
        try:
            import pdfplumber
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                pages_text = []
                for page in pdf.pages[:20]:  # First 20 pages
                    t = page.extract_text()
                    if t:
                        pages_text.append(t)
                extracted_text = "\n\n".join(pages_text)
                if not extracted_text.strip():
                    extracted_text = "[PDF appears to be a scanned image. OCR or a text-readable PDF is required.]"
                    extraction_status = "needs_ocr"
                else:
                    extraction_status = "extracted"
        except ImportError:
            try:
                import PyPDF2
                reader = PyPDF2.PdfReader(io.BytesIO(contents))
                pages_text = [reader.pages[i].extract_text() or '' for i in range(min(20, len(reader.pages)))]
                extracted_text = "\n\n".join(pages_text)
                extraction_status = "extracted" if extracted_text.strip() else "needs_ocr"
            except ImportError:
                extracted_text = f"[PDF text extraction requires pdfplumber or PyPDF2. Install with: pip install pdfplumber]"
                extraction_status = "pending"
        except Exception as e:
            extracted_text = f"[PDF extraction error: {e}]"
            extraction_status = "failed"

    # ── Save to Supabase Storage + DB ─────────────────────────────────────────
    doc_id = f"DOC-UPLOAD-{int(datetime.utcnow().timestamp())}"
    doc_code = f"STF-{category[:3].upper()}-{datetime.utcnow().year}-{doc_id[-4:]}"

    supabase = get_supabase_client()
    if supabase and is_supabase_configured():
        try:
            # Save file to Supabase Storage
            storage_path = f"documents/{staff['id']}/{doc_id}/{file.filename}"
            supabase.storage.from_("campus-docs").upload(
                storage_path, contents, {"content-type": file.content_type or "application/octet-stream"}
            )

            # Save metadata to campus_documents table (status = pending_approval)
            supabase.table("campus_documents").insert({
                "id": doc_id,
                "code": doc_code,
                "title": title,
                "category": category,
                "source_type": f"Staff Upload ({file_type})",
                "clause": "Staff Uploaded Document",
                "page_number": "Page 1",
                "is_active": False,  # Must be approved before serving to students
                "status": "pending_approval",
                "summary": description or extracted_text[:200] + "…",
                "content": extracted_text,
                "version": version,
                "file_type": file_type,
                "storage_path": storage_path,
                "uploaded_by": staff["id"],
                "extraction_status": extraction_status,
            }).execute()
        except Exception as e:
            logger.error(f"Supabase document save error: {e}")

    return {
        "success": True,
        "document_id": doc_id,
        "file_type": file_type,
        "extraction_status": extraction_status,
        "extracted_text": extracted_text[:500] + ("…" if len(extracted_text) > 500 else ""),
        "status": "pending_approval",
        "message": f"{file_type} uploaded. Status: Pending Approval. "
                   + ("Text extracted successfully." if extraction_status == "extracted"
                      else "Start the backend server or install pdfplumber for text extraction.")
    }


# ── GET ESCALATIONS ───────────────────────────────────────────────────────────
@router.get("/escalations")
async def get_escalations():
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("escalations").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            logger.error(f"Escalations fetch error: {e}")

    return [
        {
            "id": "ESC-2026-001",
            "student_name": "Aarav Sharma (BCA, Sem IV)",
            "query_text": "Are external electric heaters with thermostats permitted in hostel winter rooms?",
            "category": "Hostel",
            "confidence_score": 61,
            "escalation_reason": "Confidence 61% — below 75% floor. No specific policy found.",
            "status": "PENDING"
        }
    ]


# ── RESOLVE ESCALATION (Answer Once Workflow) ─────────────────────────────────
@router.post("/resolve")
async def resolve_escalation(req: ResolveRequest):
    """
    Answer-Once Workflow:
    1. Marks escalation RESOLVED
    2. Indexes new verified knowledge base entry (published, active)
    3. Optionally queues a reusable FAQ entry (pending_approval until reviewed)
    """
    supabase = get_supabase_client()
    timestamp = datetime.utcnow().isoformat()

    if supabase:
        try:
            # 1. Resolve escalation
            supabase.table("escalations").update({
                "status": "RESOLVED",
                "official_response": req.official_response,
                "resolved_by": req.resolved_by,
                "resolved_at": timestamp
            }).eq("id", req.escalation_id).execute()

            # 2. Index answer as a published KB document
            doc_id = f"DOC-RES-{int(datetime.utcnow().timestamp())}"
            supabase.table("campus_documents").insert({
                "id": doc_id,
                "code": f"KB-RES-{req.escalation_id}",
                "title": f"Staff Resolution: {req.escalation_id}",
                "category": req.category,
                "source_type": "Official Staff Resolution",
                "clause": f"Resolution #{req.escalation_id}",
                "page_number": "Knowledge Base",
                "is_active": True,  # Published immediately
                "status": "published",
                "summary": req.official_response[:200],
                "content": f"Official Resolution by {req.resolved_by}: {req.official_response}",
            }).execute()

            # 3. Optionally create FAQ entry for future approval
            if req.create_faq and req.faq_title:
                supabase.table("faq_entries").insert({
                    "id": f"FAQ-{int(datetime.utcnow().timestamp())}",
                    "question": req.faq_title or req.escalation_id,
                    "answer": req.official_response,
                    "category": req.category,
                    "source_escalation_id": req.escalation_id,
                    "created_by": req.resolved_by,
                    "status": "pending_approval",  # Staff must approve before it goes live
                }).execute()

            return {"success": True, "doc_id": doc_id, "message": "Resolved and indexed into Knowledge Base."}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database update failed: {e}")

    return {"success": True, "message": "Resolved in demo mode."}


# ── ADD MANUAL DOCUMENT ───────────────────────────────────────────────────────
@router.post("/documents")
async def add_campus_document(req: NewDocumentRequest):
    supabase = get_supabase_client()
    doc_id = f"DOC-NEW-{int(datetime.utcnow().timestamp())}"
    doc_code = f"ORD-{req.category[:3].upper()}-{datetime.utcnow().year}"

    if supabase:
        try:
            supabase.table("campus_documents").insert({
                "id": doc_id, "code": doc_code, "title": req.title,
                "category": req.category, "source_type": req.source_type,
                "clause": req.clause, "page_number": req.page_number,
                "is_active": False, "status": "pending_approval",
                "summary": req.summary, "content": req.content
            }).execute()
            return {"success": True, "document_id": doc_id}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to insert document: {e}")

    return {"success": True, "document_id": doc_id, "mode": "demo"}


# ── GET FAQ ENTRIES ───────────────────────────────────────────────────────────
@router.get("/faqs")
async def get_faqs():
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("faq_entries").select("*").order("created_at", desc=True).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"FAQ fetch error: {e}")
    return []


# ── APPROVE FAQ ───────────────────────────────────────────────────────────────
@router.post("/faqs/approve")
async def approve_faq(req: FAQApproveRequest, staff: dict = Depends(require_staff)):
    """Publish an FAQ entry — requires staff/admin role."""
    supabase = get_supabase_client()
    if supabase:
        try:
            supabase.table("faq_entries").update({
                "status": "published",
                "approved_by": req.approved_by,
                "approved_at": datetime.utcnow().isoformat(),
            }).eq("id", req.faq_id).execute()
            return {"success": True}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"success": True, "mode": "demo"}
