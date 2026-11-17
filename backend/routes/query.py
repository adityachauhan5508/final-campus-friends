from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.services.retrieval_service import retrieve_campus_evidence, FALLBACK_CAMPUS_DOCS, get_supabase_client
from backend.services.confidence_scorer import evaluate_retrieval, CONFIDENCE_FLOOR
from backend.services.gemini_service import generate_grounded_answer
from backend.config import is_gemini_configured, is_supabase_configured

router = APIRouter(prefix="/api", tags=["Campus Query"])

class QueryRequest(BaseModel):
    query: str
    student_id: Optional[str] = "STU-2026-8812"
    student_name: Optional[str] = "Aarav Sharma"

class QueryResponse(BaseModel):
    status: str
    confidence_score: int
    is_above_floor: bool
    answer: str
    citation: Optional[Dict[str, Any]] = None
    action: Optional[Dict[str, Any]] = None
    retrieved_passages: List[Dict[str, Any]] = []
    escalated: bool
    escalation_reason: Optional[str] = None
    model_used: Optional[str] = None

def resolve_backend_action(query: str, doc: Dict[str, Any]) -> Dict[str, Any]:
    q = query.lower()
    # Map
    if any(k in q for k in ["where is", "location", "center", "hall", "reach", "building"]):
        if "aryabhata" in q or "exam" in q:
            return {
                "id": "MAP-ARYABHATA",
                "type": "MAP",
                "title": "Locate on Campus Map: Aryabhata Examination Center",
                "description": "Highlight Aryabhata Examination Center (Building 1) on the offline campus plan.",
                "actionText": "Highlight on Campus Map",
                "buildingId": "b-aryabhata",
                "code": "AEC-01"
            }
        if "ramanujan" in q:
            return {
                "id": "MAP-RAMANUJAN",
                "type": "MAP",
                "title": "Locate on Campus Map: Ramanujan Academic Block",
                "description": "Highlight Ramanujan Academic Block (Building 2) on the offline campus plan.",
                "actionText": "Highlight on Campus Map",
                "buildingId": "b-ramanujan",
                "code": "RAB-02"
            }
        return {
            "id": "MAP-ARYABHATA",
            "type": "MAP",
            "title": "Locate on Campus Map: Aryabhata Examination Center",
            "actionText": "Highlight on Campus Map",
            "buildingId": "b-aryabhata"
        }
    
    # Form
    if any(k in q for k in ["leave", "medical", "apply", "form", "certificate"]):
        return {
            "id": "FORM-AC-02",
            "type": "FORM",
            "title": "Download Form AC-02 (Medical Leave Application)",
            "description": "Official application for condonation of lecture absence on medical grounds.",
            "actionText": "Open Form AC-02",
            "formCode": "Form AC-02"
        }

    # Portal
    if "fee" in q or "pay" in q or "tuition" in q:
        return {
            "id": "PORTAL-FEE",
            "type": "PORTAL",
            "title": "Open University Fee Payment Gateway",
            "description": "Chanakya Administrative Tower integrated payment portal for semester tuition.",
            "actionText": "Open Payment Portal",
            "portalUrl": "https://fees.campus.edu/payments/sem4"
        }

    if "exam" in q or "registration" in q:
        return {
            "id": "PORTAL-EXAM",
            "type": "PORTAL",
            "title": "Launch Student Examination ERP Portal",
            "description": "Online examination portal for course registration and admit cards.",
            "actionText": "Open Examination ERP",
            "portalUrl": "https://erp.campus.edu/student/examinations"
        }

    # Default Office
    return {
        "id": "OFFICE-COE",
        "type": "OFFICE",
        "title": "Controller of Examinations (CoE) Secretariat",
        "description": "In-person desk for examination grievances, hall ticket corrections, and confidential matters.",
        "actionText": "View Office Details",
        "location": "Aryabhata Examination Center (AEC-01), Room 102",
        "phone": "Ext: 4101",
        "email": "coe@campus.edu"
    }

@router.post("/query", response_model=QueryResponse)
async def process_student_query(req: QueryRequest):
    query_text = req.query.strip()
    if not query_text:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # Step 1: RETRIEVE
    retrieved_docs = retrieve_campus_evidence(query_text)

    # Step 2: VERIFY & SCORE
    score, is_above_floor, top_doc, reason = evaluate_retrieval(query_text, retrieved_docs)

    supabase = get_supabase_client()

    # IF ABOVE 75% FLOOR -> Verified Answering via Gemini
    if is_above_floor and top_doc:
        gemini_result = await generate_grounded_answer(query_text, retrieved_docs)
        action = resolve_backend_action(query_text, top_doc)

        citation = {
            "docCode": top_doc.get("code"),
            "docTitle": top_doc.get("title"),
            "clause": top_doc.get("clause"),
            "page": top_doc.get("page_number", "Page 1"),
            "excerpt": top_doc.get("content", "")[:220] + "..."
        }

        # Record into Supabase if configured
        if supabase:
            try:
                q_id = f"q-{hash(query_text) % 1000000}"
                supabase.table("questions").insert({
                    "id": q_id,
                    "student_name": req.student_name,
                    "query_text": query_text,
                    "category": top_doc.get("category", "General"),
                    "status": "ANSWERED",
                    "confidence_score": score,
                    "is_above_floor": True,
                    "matched_doc_id": top_doc.get("id")
                }).execute()

                supabase.table("answers").insert({
                    "question_id": q_id,
                    "answer_text": gemini_result["answer"],
                    "confidence_score": score,
                    "doc_code": citation["docCode"],
                    "doc_title": citation["docTitle"],
                    "clause": citation["clause"],
                    "page_number": citation["page"],
                    "excerpt": citation["excerpt"],
                    "action_id": action.get("id")
                }).execute()
            except Exception as e:
                print(f"Supabase logging warning: {e}")

        return QueryResponse(
            status="VERIFIED",
            confidence_score=score,
            is_above_floor=True,
            answer=gemini_result["answer"],
            citation=citation,
            action=action,
            retrieved_passages=retrieved_docs,
            escalated=False,
            model_used=gemini_result.get("model")
        )

    # IF BELOW 75% FLOOR -> Escalate to Staff Inbox
    action = resolve_backend_action(query_text, top_doc or {})
    escalation_reason = reason or "Confidence score fell below 75% threshold."
    escalated_answer = (
        "The assistant cannot verify this information with sufficient institutional confidence "
        f"(scored {score}%, below the 75% confidence floor). In accordance with university policy, "
        "this question has not been guessed—it has been automatically logged and routed to the "
        "Staff Inbox for official verification."
    )

    if supabase:
        try:
            esc_id = f"ESC-{hash(query_text) % 100000}"
            supabase.table("escalations").insert({
                "id": esc_id,
                "student_name": req.student_name,
                "query_text": query_text,
                "category": top_doc.get("category", "General") if top_doc else "Unclassified",
                "confidence_score": score,
                "retrieved_weak_matches": [{"docTitle": d.get("title"), "clause": d.get("clause"), "score": d.get("relevance_score")} for d in retrieved_docs],
                "escalation_reason": escalation_reason,
                "status": "PENDING"
            }).execute()
        except Exception as e:
            print(f"Supabase escalation insert warning: {e}")

    return QueryResponse(
        status="ESCALATED",
        confidence_score=score,
        is_above_floor=False,
        answer=escalated_answer,
        action=action,
        retrieved_passages=retrieved_docs,
        escalated=True,
        escalation_reason=escalation_reason,
        model_used="institution-safety-floor"
    )

@router.get("/documents")
async def get_campus_documents():
    supabase = get_supabase_client()
    if supabase:
        try:
            res = supabase.table("campus_documents").select("*").eq("is_active", True).execute()
            if res.data:
                return res.data
        except Exception:
            pass
    return FALLBACK_CAMPUS_DOCS
