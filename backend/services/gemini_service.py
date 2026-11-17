import json
import httpx
from typing import List, Dict, Any, Optional
from backend.config import GEMINI_API_KEY, is_gemini_configured

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

SYSTEM_PROMPT = """You are the official Smart Campus Assistant for Aarambhathon 2.0.
Your sole job is to answer student questions based EXCLUSIVELY on the provided Official Campus Documents.

CRITICAL INSTRUCTIONS:
1. Sourced, Never Invented: You must write the answer strictly from the provided campus document text.
2. If the retrieved documents do not contain the answer, you MUST state: "The assistant cannot verify this information from the official campus documents."
3. Cite the Document Title and Clause Reference in your answer.
4. Keep the response concise, authoritative, professional, and clear.
5. Do NOT extrapolate or assume general university procedures from outside sources."""

async def generate_grounded_answer(query: str, retrieved_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Step 2: VERIFY & GENERATE
    Sends query + official evidence chunks to Google Gemini API
    """
    # 1. Format the evidence context
    evidence_context = ""
    for idx, doc in enumerate(retrieved_docs, start=1):
        evidence_context += f"\n--- DOCUMENT {idx} ---\n"
        evidence_context += f"Title: {doc.get('title')}\n"
        evidence_context += f"Code: {doc.get('code')}\n"
        evidence_context += f"Clause/Section: {doc.get('clause')}\n"
        evidence_context += f"Page: {doc.get('page_number', 'N/A')}\n"
        evidence_context += f"Content: {doc.get('content')}\n"

    # If Gemini API key is configured, invoke the official Gemini API
    if is_gemini_configured():
        try:
            prompt_content = f"{SYSTEM_PROMPT}\n\nOFFICIAL CAMPUS EVIDENCE:\n{evidence_context}\n\nSTUDENT QUESTION: {query}\n\nANSWER:"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt_content}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,  # Low temperature to eliminate hallucinations
                    "topK": 20,
                    "topP": 0.8,
                    "maxOutputTokens": 600
                }
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                    json=payload
                )

                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            generated_text = parts[0].get("text", "").strip()
                            return {
                                "answer": generated_text,
                                "model": "gemini-1.5-flash",
                                "source": "Google Gemini API (Grounded)"
                            }
                else:
                    print(f"Gemini API returned status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Error calling Gemini API: {e}")

    # Deterministic Institutional Fallback (Demo Mode / when API key is pending)
    if retrieved_docs:
        top_doc = retrieved_docs[0]
        fallback_answer = (
            f"According to {top_doc.get('source_type', 'Official Campus Document')} "
            f"({top_doc.get('code')}, {top_doc.get('clause')}): "
            f"{top_doc.get('summary')} {top_doc.get('content')}"
        )
        return {
            "answer": fallback_answer,
            "model": "deterministic-campus-grounded",
            "source": f"Institutional Ordinance ({top_doc.get('code')})"
        }

    return {
        "answer": "The assistant cannot verify this information from official campus documents.",
        "model": "grounded-verifier",
        "source": "Unverified"
    }
