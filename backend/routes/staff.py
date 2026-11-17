from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.services.retrieval_service import get_supabase_client
from datetime import datetime

router = APIRouter(prefix="/api/staff", tags=["Staff Administration"])

class ResolveRequest(BaseModel):
    escalation_id: str
    official_response: str
    resolved_by: str = "Staff Administrator"
    category: str = "Examinations"

class NewDocumentRequest(BaseModel):
    title: str
    category: str
    source_type: str = "Official Ordinance"
    clause: str
    page_number: str = "Page 1"
    summary: str
    content: str

@router.get("/escalations")
async def get_escalations():
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("escalations").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase escalations read error: {e}")
    
    return [
        {
            "id": "ESC-2026-001",
            "student_name": "Aarav Sharma (B.Tech CSE, Sem IV)",
            "query_text": "Are external electric heaters with thermostats permitted in hostel winter rooms?",
            "category": "Hostel",
            "confidence_score": 61,
            "escalation_reason": "Confidence 61% (below 75% floor). Inquired specifically about thermostat medical exemptions.",
            "status": "PENDING"
        }
    ]

@router.post("/resolve")
async def resolve_escalation(req: ResolveRequest):
    """
    Answer-Once Workflow (Slide 13):
    1. Updates escalation to RESOLVED
    2. Inserts new verified record into campus_documents so all future queries are cited instantly!
    """
    supabase = get_supabase_client()
    timestamp = datetime.utcnow().isoformat()

    if supabase:
        try:
            # 1. Update escalation record
            supabase.table("escalations").update({
                "status": "RESOLVED",
                "official_response": req.official_response,
                "resolved_by": req.resolved_by,
                "resolved_at": timestamp
            }).eq("id", req.escalation_id).execute()

            # 2. Add into campus_documents (Answer Once)
            doc_id = f"DOC-RES-{int(datetime.utcnow().timestamp())}"
            supabase.table("campus_documents").insert({
                "id": doc_id,
                "code": f"KB-RES-{req.escalation_id}",
                "title": f"Staff Resolution: Escalation #{req.escalation_id}",
                "category": req.category,
                "source_type": "Official Staff Resolution",
                "clause": f"Resolution Ref #{req.escalation_id}",
                "page_number": "Knowledge Base Entry",
                "is_active": True,
                "summary": req.official_response[:200],
                "content": f"Official Resolution by {req.resolved_by}: {req.official_response}"
            }).execute()

            return {
                "success": True,
                "message": "Escalation resolved and indexed into Knowledge Base via Answer-Once workflow.",
                "doc_id": doc_id
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database update failed: {e}")

    return {
        "success": True,
        "message": "Resolved in demo memory mode."
    }

@router.post("/documents")
async def add_campus_document(req: NewDocumentRequest):
    supabase = get_supabase_client()
    doc_id = f"DOC-NEW-{int(datetime.utcnow().timestamp())}"
    doc_code = f"ORD-{req.category[:3].upper()}-2026"

    if supabase:
        try:
            supabase.table("campus_documents").insert({
                "id": doc_id,
                "code": doc_code,
                "title": req.title,
                "category": req.category,
                "source_type": req.source_type,
                "clause": req.clause,
                "page_number": req.page_number,
                "is_active": True,
                "summary": req.summary,
                "content": req.content
            }).execute()

            return {"success": True, "document_id": doc_id}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to insert document: {e}")

    return {"success": True, "document_id": doc_id, "mode": "demo"}
