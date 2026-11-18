import os
from dotenv import load_dotenv

# Load .env file - check both backend/.env and project root .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()  # fallback to cwd .env

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
# Support both naming conventions for the service role key
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "") or os.getenv("SUPABASE_SERVICE_KEY", "")
SUPABASE_SERVICE_KEY = SUPABASE_SERVICE_ROLE_KEY  # alias for legacy imports
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "") or os.getenv("VITE_SUPABASE_ANON_KEY", "")

CONFIDENCE_FLOOR = 75

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"  # Allows Vercel preview & production deployments
]

def is_gemini_configured() -> bool:
    return bool(GEMINI_API_KEY and GEMINI_API_KEY != "your-gemini-api-key" and not GEMINI_API_KEY.startswith("placeholder"))

def is_supabase_configured() -> bool:
    """Returns True when real Supabase credentials are present (not placeholder values)."""
    valid_url = bool(
        SUPABASE_URL
        and SUPABASE_URL != "https://your-project.supabase.co"
        and not SUPABASE_URL.startswith("https://your-")
        and "supabase.co" in SUPABASE_URL
    )
    # Configured if we have a real anon key OR a real service role key
    valid_key = bool(
        (SUPABASE_ANON_KEY and SUPABASE_ANON_KEY.startswith("eyJ"))
        or (SUPABASE_SERVICE_ROLE_KEY and SUPABASE_SERVICE_ROLE_KEY.startswith("eyJ"))
    )
    return valid_url and valid_key
