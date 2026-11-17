import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")

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
    return bool(SUPABASE_URL and SUPABASE_URL != "https://your-project.supabase.co" and (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY))
