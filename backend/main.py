import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import CORS_ORIGINS, is_gemini_configured, is_supabase_configured
from backend.routes.query import router as query_router
from backend.routes.staff import router as staff_router

app = FastAPI(
    title="Smart Campus Assistant API",
    description="Official FastAPI Backend with Supabase PostgreSQL & Google Gemini Integration for Aarambhathon 2.0",
    version="2.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(query_router)
app.include_router(staff_router)

@app.get("/")
async def root():
    return {
        "project": "Smart Campus Assistant",
        "competition": "Aarambhathon 2.0",
        "tagline": "Ask the campus. Get the official answer.",
        "docs_url": "/docs",
        "health_url": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "framework": "FastAPI",
        "gemini_api_connected": is_gemini_configured(),
        "supabase_connected": is_supabase_configured(),
        "confidence_floor": 75,
        "mode": "Live Production" if (is_gemini_configured() and is_supabase_configured()) else "Hybrid Demo Mode"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
