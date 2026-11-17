from typing import List, Dict, Any
from backend.config import is_supabase_configured, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
from backend.services.confidence_scorer import calculate_evidence_score

# Seed documents fallback in Python if database is initializing
FALLBACK_CAMPUS_DOCS = [
    {
        "id": "DOC-EXAM-01",
        "code": "ORD-EX-2026-V1",
        "title": "University Examination Ordinance & Schedule 2026",
        "category": "Examinations",
        "source_type": "Official Ordinance",
        "clause": "Section 4.2 - Registration Deadline & Eligibility",
        "page_number": "Page 12",
        "building_id": "b-aryabhata",
        "is_active": True,
        "summary": "Rules governing end-semester examination registration timelines, prerequisite credits, and admit card issuance.",
        "content": "All regular and backlog examination registration forms for the Autumn/Winter 2026 session must be submitted through the Examination ERP Portal no later than November 28, 2026 at 11:59 PM. Submissions received between November 29 and December 3, 2026 shall incur a statutory late fee of ₹1,000. No applications will be entertained under any circumstances after December 3, 2026. Hall tickets will be released exclusively to students who have cleared all tuition dues and possess attendance above the 75% threshold.",
        "keywords": ["deadline", "exam registration", "examination date", "registration deadline", "last date", "hall ticket"]
    },
    {
        "id": "DOC-EXAM-02",
        "code": "CIR-EX-2026-08",
        "title": "Aryabhata Examination Center Venue & Seating Guidelines",
        "category": "Examinations",
        "source_type": "Campus Circular",
        "clause": "Section 2.1 - Center Location & Venue Allocation",
        "page_number": "Page 3",
        "building_id": "b-aryabhata",
        "is_active": True,
        "summary": "Physical location of Aryabhata Examination Center and guidelines for examination day arrival.",
        "content": "The Aryabhata Examination Center is situated on the North Campus Quadrangle, opposite Central Garden and adjacent to the Ramanujan Academic Block (Building Code: AEC-01). All main written examinations are held in Halls 1 to 12 of this center. Candidates must report at least 30 minutes prior to scheduled commencement. Bags and electronic devices must be deposited in the secure locker area in AEC Ground Floor Room 104.",
        "keywords": ["aryabhata", "examination center", "where is", "exam hall", "center location", "exam venue"]
    },
    {
        "id": "DOC-FEES-01",
        "code": "CIR-FIN-2026-04",
        "title": "Semester IV & VI Tuition Fee Payment Schedule 2026",
        "category": "Fees",
        "source_type": "Finance Circular",
        "clause": "Clause 3.1 - Payment Deadline & Installment Schedule",
        "page_number": "Page 2",
        "building_id": "b-chanakya",
        "is_active": True,
        "summary": "Payment deadline for Semester IV academic fees and late penalty charges.",
        "content": "The official fee payment deadline for Semester IV (Academic Year 2026) is December 15, 2026 at 05:00 PM. Payments must be processed through the Chanakya Finance Portal using net banking, UPI, or Challan. Payments made between December 16 and December 24, 2026 will incur a daily late fine of ₹100. Late submissions after December 24 require written sanction from the Finance Officer at Chanakya Administrative Tower, Room A-104.",
        "keywords": ["fee payment deadline", "semester iv fee", "tuition fees", "last date fee", "late fine"]
    },
    {
        "id": "DOC-HOSTEL-01",
        "code": "BYL-HST-2026-V1",
        "title": "Hostel Bylaws & Electrical Appliance Policy 2026",
        "category": "Hostel",
        "source_type": "Hostel Bylaws",
        "clause": "Bylaw 14.3 - Prohibited Electrical Equipment in Rooms",
        "page_number": "Page 9",
        "building_id": "b-tagore",
        "is_active": True,
        "summary": "Rules regarding permissible electrical appliances, kettles, heaters, and safety hazards.",
        "content": "Electric kettles, immersion heating coils, induction cooktops, room heaters, and cooking appliances of any wattage are strictly prohibited inside student hostel rooms due to building fire-safety regulations and electrical overload limits. Students requiring hot water must utilize the dedicated electric dispensers located in hostel pantry corridors on each floor. Confiscation of unauthorized appliances carries a mandatory fine of ₹2,500 for the first offense and disciplinary probation for recurring violations. Laptops, personal fans, and mobile chargers under 100W are permitted.",
        "keywords": ["electric kettles", "kettle", "appliances", "hostel room", "induction", "heater", "cooking hostel"]
    },
    {
        "id": "DOC-ACAD-01",
        "code": "REG-ACAD-2026-V1",
        "title": "Academic Regulations & Minimum Attendance Requirement",
        "category": "Academics",
        "source_type": "Academic Regulation",
        "clause": "Regulation 7.1 - Mandatory Attendance Floor & Condonation",
        "page_number": "Page 14",
        "building_id": "b-ramanujan",
        "is_active": True,
        "summary": "Defines the mandatory 75% attendance threshold, condonation limits, and exam debarment.",
        "content": "Under Academic Regulation 7.1, students must maintain a minimum attendance of 75% in each registered course (theory and practical components counted separately) to be eligible to appear for end-semester examinations. Attendance between 65% and 74.9% may be condoned by the Dean of Academic Affairs exclusively on certified medical grounds or approved university-level sports/cultural representation. Students with attendance below 65% are strictly debarred and receive an 'FA' (Failure due to Attendance) grade requiring course repetition in the subsequent academic year.",
        "keywords": ["minimum attendance", "attendance requirement", "attendance percentage", "condonation", "debar", "75% attendance"]
    },
    {
        "id": "DOC-ACAD-02",
        "code": "REG-ACAD-2026-V2",
        "title": "Medical Leave Application & Verification Procedure",
        "category": "Academics",
        "source_type": "Academic Regulation",
        "clause": "Regulation 8.4 - Medical Certificate Submission Window",
        "page_number": "Page 16",
        "building_id": "b-ramanujan",
        "is_active": True,
        "summary": "Step-by-step instructions for submitting medical leave certificates within 7 working days.",
        "content": "To apply for medical leave, students must submit Digital Form AC-02 (Medical Leave Application) via the Academic ERP portal within seven (7) working days of returning to campus. The application must include: (1) a certified medical certificate signed by a registered medical practitioner, (2) prescription receipts, and (3) fitness certificate endorsed by the University Chief Medical Officer at the Campus Health Center. Physical copies must be delivered to Room 105, Ramanujan Academic Block for official attendance adjustment.",
        "keywords": ["apply medical leave", "medical certificate", "sick leave", "doctor certificate", "medical condonation"]
    }
]

def get_supabase_client():
    if not is_supabase_configured():
        return None
    try:
        from supabase import create_client
        key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
        return create_client(SUPABASE_URL, key)
    except Exception as e:
        print(f"Warning: Could not initialize Supabase client: {e}")
        return None

def retrieve_campus_evidence(query: str) -> List[Dict[str, Any]]:
    """
    Step 1: RETRIEVE
    Queries Supabase or fallback documents for relevant passages
    """
    supabase = get_supabase_client()
    docs = []

    if supabase:
        try:
            res = supabase.table("campus_documents").select("*").eq("is_active", True).execute()
            if res.data:
                docs = res.data
        except Exception as e:
            print(f"Supabase query error: {e}, falling back to local documents.")
            docs = FALLBACK_CAMPUS_DOCS
    else:
        docs = FALLBACK_CAMPUS_DOCS

    scored = []
    for d in docs:
        score = calculate_evidence_score(query, d)
        if score > 20:
            doc_copy = dict(d)
            doc_copy["relevance_score"] = score
            scored.append(doc_copy)

    scored.sort(key=lambda x: x["relevance_score"], reverse=True)
    return scored[:4]
