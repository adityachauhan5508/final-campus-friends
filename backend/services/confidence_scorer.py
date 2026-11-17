import re
from typing import List, Dict, Any, Tuple

CONFIDENCE_FLOOR = 75

STOP_WORDS = {
    'the', 'and', 'for', 'are', 'what', 'when', 'where', 'how', 'who', 
    'with', 'from', 'this', 'that', 'can', 'does', 'will', 'is', 'a', 'an', 'in', 'on', 'at'
}

def tokenize(text: str) -> List[str]:
    if not text:
        return []
    clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    return [w for w in clean.split() if len(w) > 2 and w not in STOP_WORDS]

def calculate_evidence_score(query: str, doc: Dict[str, Any]) -> int:
    """
    Application-side Evidence Scoring Algorithm (Master Prompt Section 2 & 9)
    Evaluates:
    1. Lexical Token Overlap (40%)
    2. Clause & Keyword Specificity (35%)
    3. Document Type Authority (25%)
    """
    query_tokens = tokenize(query)
    if not query_tokens:
        return 0

    doc_text = f"{doc.get('title', '')} {doc.get('clause', '')} {doc.get('summary', '')}"
    doc_tokens = set(tokenize(doc_text))
    content_tokens = set(tokenize(doc.get('content', '')[:600]))
    all_doc_tokens = doc_tokens.union(content_tokens)

    # 1. Overlap Score
    matched = [t for t in query_tokens if t in all_doc_tokens]
    overlap_ratio = len(matched) / len(query_tokens)
    overlap_score = overlap_ratio * 40.0

    # 2. Keyword & Clause Exact Matches
    keyword_score = 0.0
    query_lower = query.lower()
    keywords = doc.get('keywords', []) or []
    for kw in keywords:
        if kw.lower() in query_lower:
            keyword_score += 25.0
            break

    # 3. Source Authority Bonus
    source_type = doc.get('source_type', '')
    authority_bonus = 15.0
    if 'Ordinance' in source_type or 'Regulation' in source_type:
        authority_bonus = 20.0
    elif 'Bylaw' in source_type:
        authority_bonus = 18.0

    total_score = min(99, int(round(overlap_score + keyword_score + authority_bonus)))
    return total_score

def evaluate_retrieval(query: str, retrieved_docs: List[Dict[str, Any]]) -> Tuple[int, bool, Dict[str, Any], str]:
    """
    Evaluates top retrieved match against the 75% Confidence Floor.
    Returns: (score, is_above_floor, top_doc, reason)
    """
    if not retrieved_docs:
        return (20, False, {}, "No matching campus document passages found in knowledge base.")

    top_doc = retrieved_docs[0]
    score = top_doc.get("relevance_score", 0)
    is_above = score >= CONFIDENCE_FLOOR
    
    reason = None
    if not is_above:
        reason = f"Closest retrieved match scored {score}%, which is below the mandatory 75% institutional verification floor."

    return (score, is_above, top_doc, reason)
