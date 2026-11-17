-- ====================================================================
-- SMART CAMPUS ASSISTANT - SEED DATA SCRIPT (Aarambhathon 2.0)
-- 6 Buildings, 4 Action Types, 33 Verified Campus Documents, Seed Data
-- ====================================================================

-- 1. SEED CAMPUS BUILDINGS (Slide 14)
INSERT INTO public.campus_buildings (id, number, name, code, category, short_description, full_description, venues, offices, timings, svg_layout)
VALUES
(
  'b-aryabhata', 1, 'Aryabhata Examination Center', 'AEC-01', 'Examinations',
  'Primary university examination complex, hall ticket verification, and confidential exam halls.',
  'Houses Examination Halls 1 through 12, Controller of Examinations (CoE) executive chambers, evaluation wings, and student grievance verification desks.',
  '["Aryabhata Examination Center", "Examination Hall 1 (Ground Floor)", "Examination Hall 2 (Ground Floor)", "Examination Hall 3 (First Floor)", "Confidential Evaluation Wing", "Hall Ticket Correction Counter"]'::jsonb,
  '[{"name": "Controller of Examinations (CoE)", "room": "Room 102", "contact": "coe@campus.edu / Ext: 4101"}, {"name": "Examination Grievance Desk", "room": "Counter 3", "contact": "examhelp@campus.edu / Ext: 4105"}]'::jsonb,
  'Mon - Sat: 08:30 AM - 05:30 PM (Exam days: 07:30 AM - 07:00 PM)',
  '{"x": 80, "y": 70, "width": 220, "height": 150, "color": "#2563EB", "roofColor": "#1D4ED8"}'::jsonb
),
(
  'b-ramanujan', 2, 'Ramanujan Academic Block', 'RAB-02', 'Academics',
  'Main lecture complex, faculty departments, and Dean of Academic Affairs office.',
  'Central academic building containing high-capacity tiered lecture theaters (LH 101 to LH 405), seminar halls, and department academic offices.',
  '["Lecture Hall 101-108 (Ground Floor)", "Lecture Hall 201-208 (First Floor)", "Ramanujan Main Auditorium", "Academic Affairs Committee Room"]'::jsonb,
  '[{"name": "Dean of Academic Affairs", "room": "Room 201", "contact": "dean.academics@campus.edu / Ext: 2201"}, {"name": "Attendance & Medical Leave Cell", "room": "Room 105", "contact": "attendance@campus.edu / Ext: 2210"}]'::jsonb,
  'Mon - Fri: 08:00 AM - 06:30 PM',
  '{"x": 360, "y": 60, "width": 240, "height": 160, "color": "#0EA5E9", "roofColor": "#0284C7"}'::jsonb
),
(
  'b-visvesvaraya', 3, 'Visvesvaraya Engineering Complex', 'VEC-03', 'Labs & Tech',
  'Computing laboratories, AI research facility, and student tech club workshops.',
  'State-of-the-art engineering laboratories, high-performance computing clusters, hardware testing labs, and robotics project workshops.',
  '["Central Computing Laboratory 1 & 2", "AI & Machine Learning Research Center", "Maker Space & Prototyping Workshop", "Electronics & IoT System Lab"]'::jsonb,
  '[{"name": "Head of Laboratories", "room": "Room V-110", "contact": "labs@campus.edu / Ext: 3301"}, {"name": "Student Technical Society Desk", "room": "Room V-015", "contact": "techclubs@campus.edu / Ext: 3315"}]'::jsonb,
  'Mon - Sat: 08:00 AM - 08:30 PM',
  '{"x": 660, "y": 70, "width": 220, "height": 150, "color": "#6366F1", "roofColor": "#4F46E5"}'::jsonb
),
(
  'b-saraswati', 4, 'Saraswati Central Library & Form Registry', 'SCL-04', 'Directory & Forms',
  'Digital form repository, thesis archives, reference stacks, and student study lounges.',
  'Houses over 120,000 physical volumes, digital knowledge terminals, physical submission desk for the Digital Form Registry, and reading lounges.',
  '["Digital Form Registry Help Desk (Ground Floor)", "Main Reading Hall (First Floor)", "Digital Reference & E-Journal Wing", "Archives & Circular Repository"]'::jsonb,
  '[{"name": "Digital Form Helpdesk & Registry", "room": "Counter 1-2", "contact": "forms@campus.edu / Ext: 5120"}, {"name": "University Chief Librarian", "room": "Room L-101", "contact": "library@campus.edu / Ext: 5101"}]'::jsonb,
  'Mon - Sun: 07:30 AM - 10:30 PM',
  '{"x": 80, "y": 280, "width": 220, "height": 160, "color": "#10B981", "roofColor": "#059669"}'::jsonb
),
(
  'b-chanakya', 5, 'Chanakya Administrative Tower', 'CAT-05', 'Fees & Admin',
  'University finance division, cashier desks, registrar, and scholarship verification.',
  'The administrative heart of the campus. Handles student fee collection, scholarship disbursal, fee receipt validation, refund processing, and official transcripts.',
  '["Student Cashier Counters 1-6", "Scholarship & Financial Aid Cell", "Office of the Registrar", "Student Verification Wing"]'::jsonb,
  '[{"name": "Finance & Accounts Officer", "room": "Room A-104", "contact": "finance@campus.edu / Ext: 1102"}, {"name": "Cashier & Payment Helpdesk", "room": "Counter 4", "contact": "feepayments@campus.edu / Ext: 1109"}]'::jsonb,
  'Mon - Fri: 09:00 AM - 05:00 PM (Cashier closes at 03:30 PM)',
  '{"x": 360, "y": 280, "width": 240, "height": 160, "color": "#F59E0B", "roofColor": "#D97706"}'::jsonb
),
(
  'b-tagore', 6, 'Tagore Student Residence & Hostel Office', 'TRH-06', 'Hostel',
  'Hostel warden headquarters, mess management, appliance clearance, and residence halls.',
  'Supervises residential student services, student room allotments, mess council operations, night curfew permissions, and appliance security clearances.',
  '["Chief Warden Secretariat", "Hostel Appliance Verification Desk", "Central Dining Hall & Mess Office", "Visitor Reception & Check-in"]'::jsonb,
  '[{"name": "Chief Hostel Warden", "room": "Room H-01", "contact": "warden@campus.edu / Ext: 6001"}, {"name": "Hostel Caretaker & Appliance Desk", "room": "Reception Counter", "contact": "hosteloffice@campus.edu / Ext: 6010"}]'::jsonb,
  'Office: 08:30 AM - 08:00 PM | Resident Desk: 24/7',
  '{"x": 660, "y": 280, "width": 220, "height": 160, "color": "#8B5CF6", "roofColor": "#7C3AED"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED ACTION REGISTRY (Slide 8)
INSERT INTO public.action_registry (id, action_type, title, description, action_text, metadata)
VALUES
('FORM-AC-02', 'FORM', 'Download Form AC-02 (Medical Leave Application)', 'Official application for condonation of lecture absence on medical grounds with CMO endorsement.', 'Open Form AC-02', '{"formCode": "Form AC-02", "department": "Academic Affairs", "fileFormat": "PDF Document"}'::jsonb),
('FORM-EX-03', 'FORM', 'Download Form EX-03 (Hall Ticket Discrepancy Correction)', 'Request for correction of student name, photograph, or enrolled subject codes on exam admit card.', 'Open Form EX-03', '{"formCode": "Form EX-03", "department": "Controller of Examinations", "fileFormat": "PDF Document"}'::jsonb),
('FORM-FN-04', 'FORM', 'Download Form FN-04 (Fee Refund & Adjustments)', 'Formal claim for excess tuition adjustment, semester withdrawal, or caution refund.', 'Open Form FN-04', '{"formCode": "Form FN-04", "department": "Finance Division", "fileFormat": "PDF Document"}'::jsonb),
('PORTAL-EXAM', 'PORTAL', 'Launch Student Examination ERP Portal', 'Online examination portal for course registration, exam timetable, and digital admit cards.', 'Open Examination ERP', '{"portalUrl": "https://erp.campus.edu/student/examinations"}'::jsonb),
('PORTAL-FEE', 'PORTAL', 'Open University Fee Payment Gateway', 'Chanakya Administrative Tower integrated payment portal for semester tuition, dues, and receipts.', 'Open Payment Portal', '{"portalUrl": "https://fees.campus.edu/payments/sem4"}'::jsonb),
('PORTAL-ACAD', 'PORTAL', 'Open Student Academic & Attendance ERP', 'Live attendance percentage tracker, syllabus, course credits, and faculty timetables.', 'Open Academic Portal', '{"portalUrl": "https://academics.campus.edu/student/attendance"}'::jsonb),
('PORTAL-HOSTEL', 'PORTAL', 'Access Tagore Hostel Resident Portal', 'Hostel student portal for night passes, mess rebates, maintenance tickets, and gate tracking.', 'Open Hostel Portal', '{"portalUrl": "https://hostel.campus.edu/student/portal"}'::jsonb),
('OFFICE-WARDEN', 'OFFICE', 'Chief Hostel Warden Secretariat', 'Hostel disciplinary committee, room allotment, appliance inspection, and security gate office.', 'View Warden Office', '{"location": "Tagore Residence H-01", "phone": "Ext: 6001", "email": "warden@campus.edu"}'::jsonb),
('OFFICE-COE', 'OFFICE', 'Controller of Examinations (CoE) Secretariat', 'In-person desk for examination grievances, hall ticket corrections, and confidential matters.', 'View Office Details', '{"location": "Aryabhata Center Room 102", "phone": "Ext: 4101", "email": "coe@campus.edu"}'::jsonb),
('MAP-ARYABHATA', 'MAP', 'Locate on Campus Map: Aryabhata Examination Center', 'Highlight Aryabhata Examination Center (Building 1) on the offline campus plan.', 'Highlight on Campus Map', '{"buildingId": "b-aryabhata", "code": "AEC-01"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED KEY CAMPUS DOCUMENTS (Slide 6 & 9)
INSERT INTO public.campus_documents (id, code, title, category, source_type, upload_date, clause, page_number, building_id, is_active, summary, content, keywords)
VALUES
(
  'DOC-EXAM-01', 'ORD-EX-2026-V1', 'University Examination Ordinance & Schedule 2026', 'Examinations', 'Official Ordinance', '2026-10-15',
  'Section 4.2 - Registration Deadline & Eligibility', 'Page 12', 'b-aryabhata', true,
  'Rules governing end-semester examination registration timelines, prerequisite credits, and admit card issuance.',
  'All regular and backlog examination registration forms for the Autumn/Winter 2026 session must be submitted through the Examination ERP Portal no later than November 28, 2026 at 11:59 PM. Submissions received between November 29 and December 3, 2026 shall incur a statutory late fee of ₹1,000. No applications will be entertained under any circumstances after December 3, 2026. Hall tickets will be released exclusively to students who have cleared all tuition dues and possess attendance above the 75% threshold.',
  ARRAY['deadline', 'exam registration', 'examination date', 'registration deadline', 'last date', 'hall ticket']
),
(
  'DOC-EXAM-02', 'CIR-EX-2026-08', 'Aryabhata Examination Center Venue & Seating Guidelines', 'Examinations', 'Campus Circular', '2026-10-20',
  'Section 2.1 - Center Location & Venue Allocation', 'Page 3', 'b-aryabhata', true,
  'Physical location of Aryabhata Examination Center and guidelines for examination day arrival.',
  'The Aryabhata Examination Center is situated on the North Campus Quadrangle, opposite Central Garden and adjacent to the Ramanujan Academic Block (Building Code: AEC-01). All main written examinations are held in Halls 1 to 12 of this center. Candidates must report at least 30 minutes prior to scheduled commencement. Bags and electronic devices must be deposited in the secure locker area in AEC Ground Floor Room 104.',
  ARRAY['aryabhata', 'examination center', 'where is', 'exam hall', 'center location', 'exam venue']
),
(
  'DOC-FEES-01', 'CIR-FIN-2026-04', 'Semester IV & VI Tuition Fee Payment Schedule 2026', 'Fees', 'Finance Circular', '2026-10-01',
  'Clause 3.1 - Payment Deadline & Installment Schedule', 'Page 2', 'b-chanakya', true,
  'Payment deadline for Semester IV academic fees and late penalty charges.',
  'The official fee payment deadline for Semester IV (Academic Year 2026) is December 15, 2026 at 05:00 PM. Payments must be processed through the Chanakya Finance Portal using net banking, UPI, or Challan. Payments made between December 16 and December 24, 2026 will incur a daily late fine of ₹100. Late submissions after December 24 require written sanction from the Finance Officer at Chanakya Administrative Tower, Room A-104.',
  ARRAY['fee payment deadline', 'semester iv fee', 'tuition fees', 'last date fee', 'late fine']
),
(
  'DOC-HOSTEL-01', 'BYL-HST-2026-V1', 'Hostel Bylaws & Electrical Appliance Policy 2026', 'Hostel', 'Hostel Bylaws', '2026-07-28',
  'Bylaw 14.3 - Prohibited Electrical Equipment in Rooms', 'Page 9', 'b-tagore', true,
  'Rules regarding permissible electrical appliances, kettles, heaters, and safety hazards.',
  'Electric kettles, immersion heating coils, induction cooktops, room heaters, and cooking appliances of any wattage are strictly prohibited inside student hostel rooms due to building fire-safety regulations and electrical overload limits. Students requiring hot water must utilize the dedicated electric dispensers located in hostel pantry corridors on each floor. Confiscation of unauthorized appliances carries a mandatory fine of ₹2,500 for the first offense and disciplinary probation for recurring violations. Laptops, personal fans, and mobile chargers under 100W are permitted.',
  ARRAY['electric kettles', 'kettle', 'appliances', 'hostel room', 'induction', 'heater', 'cooking hostel']
),
(
  'DOC-ACAD-01', 'REG-ACAD-2026-V1', 'Academic Regulations & Minimum Attendance Requirement', 'Academics', 'Academic Regulation', '2026-08-10',
  'Regulation 7.1 - Mandatory Attendance Floor & Condonation', 'Page 14', 'b-ramanujan', true,
  'Defines the mandatory 75% attendance threshold, condonation limits, and exam debarment.',
  'Under Academic Regulation 7.1, students must maintain a minimum attendance of 75% in each registered course (theory and practical components counted separately) to be eligible to appear for end-semester examinations. Attendance between 65% and 74.9% may be condoned by the Dean of Academic Affairs exclusively on certified medical grounds or approved university-level sports/cultural representation. Students with attendance below 65% are strictly debarred and receive an "FA" (Failure due to Attendance) grade requiring course repetition in the subsequent academic year.',
  ARRAY['minimum attendance', 'attendance requirement', 'attendance percentage', 'condonation', 'debar', '75% attendance']
),
(
  'DOC-ACAD-02', 'REG-ACAD-2026-V2', 'Medical Leave Application & Verification Procedure', 'Academics', 'Academic Regulation', '2026-08-12',
  'Regulation 8.4 - Medical Certificate Submission Window', 'Page 16', 'b-ramanujan', true,
  'Step-by-step instructions for submitting medical leave certificates within 7 working days.',
  'To apply for medical leave, students must submit Digital Form AC-02 (Medical Leave Application) via the Academic ERP portal within seven (7) working days of returning to campus. The application must include: (1) a certified medical certificate signed by a registered medical practitioner, (2) prescription receipts, and (3) fitness certificate endorsed by the University Chief Medical Officer at the Campus Health Center. Physical copies must be delivered to Room 105, Ramanujan Academic Block for official attendance adjustment.',
  ARRAY['apply medical leave', 'medical certificate', 'sick leave', 'doctor certificate', 'medical condonation']
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED INITIAL ESCALATIONS FOR STAFF INBOX (Slide 12-13)
INSERT INTO public.escalations (id, student_name, query_text, category, confidence_score, escalation_reason, status, retrieved_weak_matches)
VALUES
(
  'ESC-2026-001', 'Aarav Sharma (B.Tech CSE, Sem IV)',
  'Are external electric heaters with thermostats permitted in hostel winter rooms?',
  'Hostel', 61,
  'Confidence 61% (below 75% floor). Student inquired specifically about thermostat medical exemptions which are not explicitly defined in the standard bylaw clause.',
  'PENDING',
  '[{"docTitle": "Hostel Bylaws & Electrical Appliance Policy 2026", "clause": "Bylaw 14.3", "relevanceScore": 61}]'::jsonb
),
(
  'ESC-2026-002', 'Priya Nair (B.Des, Sem II)',
  'Can student design teams access 3D printers after 09:00 PM for national hackathon prep?',
  'Academics / Labs', 54,
  'Confidence 54% (below 75% floor). Overtime lab access policies for external hackathons require Dean of Student Affairs special permit.',
  'PENDING',
  '[{"docTitle": "Technical & Cultural Student Clubs Charter 2026", "clause": "Section 4.1", "relevanceScore": 54}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- ADDITIONAL SEED: FAQ Starter Data (from smart_campus_faq_starter.csv)
-- ====================================================================
INSERT INTO public.faq_entries (id, question, answer, category, status, created_by) VALUES
('FAQ-SEED-001', 'Where can I find the academic calendar?',
 'Check the latest academic calendar published by the university or department. Confirm semester dates, holidays, registration windows and examination periods from the current official calendar.',
 'Academics', 'pending_approval', 'System'),
('FAQ-SEED-002', 'Where can I find the examination timetable?',
 'Check the latest examination notice on the official university portal or examination office notice board. Verify programme, semester, subject and date.',
 'Examinations', 'pending_approval', 'System'),
('FAQ-SEED-003', 'Where can I check my fee payment status?',
 'Check the fee or payment section of the official student portal. Keep the transaction reference and receipt. If the portal does not update, contact the accounts office.',
 'Fees', 'pending_approval', 'System'),
('FAQ-SEED-004', 'How can I apply for hostel accommodation?',
 'Check the official hostel admission notice or contact the hostel office. Availability, eligibility, fees, documents and dates depend on current rules.',
 'Hostel', 'pending_approval', 'System'),
('FAQ-SEED-005', 'Where can I find the campus map?',
 'Open the Campus Map section of the Smart Campus Assistant. If a building or room is not listed, contact the campus help desk or relevant department.',
 'Facilities', 'pending_approval', 'System'),
('FAQ-SEED-006', 'What if I cannot log in to the student portal?',
 'Use the official password reset option if available. If the problem continues, contact the university IT help desk. Never share your password or one-time code.',
 'IT Support', 'pending_approval', 'System'),
('FAQ-SEED-007', 'How do I apply for leave?',
 'Use the university''s approved leave process and submit required supporting documents. The correct form, approving authority and deadline depend on current institutional rules.',
 'Academics', 'pending_approval', 'System'),
('FAQ-SEED-008', 'What if my question is not covered here?',
 'Submit it through the Smart Campus Assistant. If approved campus information does not provide a reliable answer, the system will forward it to authorized staff.',
 'General', 'published', 'System')
ON CONFLICT (id) DO NOTHING;
