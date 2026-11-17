// Sample Questions from Slide 3 and Prompt specifications
// Pre-verified with citations, evidence scoring, and actions

export const SAMPLE_QUESTIONS = [
  {
    id: 'sample-1',
    category: 'EXAMINATIONS',
    question: 'When is the deadline for exam registration?',
    matchedDocId: 'DOC-EXAM-01',
    confidenceScore: 98,
    answer: 'The official deadline for regular and backlog examination registration for the Autumn/Winter 2026 session is November 28, 2026 at 11:59 PM via the Student Examination ERP Portal. Registrations submitted between November 29 and December 3, 2026 incur a mandatory late fine of ₹1,000. No applications will be accepted after December 3, 2026.',
    citation: {
      docCode: 'ORD-EX-2026-V1',
      docTitle: 'University Examination Ordinance & Schedule 2026',
      clause: 'Section 4.2 - Registration Deadline & Eligibility',
      page: 'Page 12',
      excerpt: 'All regular and backlog examination registration forms for the Autumn/Winter 2026 session must be submitted through the Examination ERP Portal no later than November 28, 2026 at 11:59 PM. Submissions received between November 29 and December 3, 2026 shall incur a statutory late fee of ₹1,000.'
    },
    actionId: 'PORTAL-EXAM',
    isEscalated: false
  },
  {
    id: 'sample-2',
    category: 'EXAMINATIONS',
    question: 'Where is the Aryabhata Examination Center?',
    matchedDocId: 'DOC-EXAM-02',
    confidenceScore: 99,
    answer: 'The Aryabhata Examination Center (Building Code: AEC-01) is located on the North Campus Quadrangle, opposite the Central Garden and adjacent to the Ramanujan Academic Block. It houses main Examination Halls 1 through 12. Bags and electronic devices must be stored in the locker area in Ground Floor Room 104.',
    citation: {
      docCode: 'CIR-EX-2026-08',
      docTitle: 'Aryabhata Examination Center Venue & Seating Guidelines',
      clause: 'Section 2.1 - Center Location & Venue Allocation',
      page: 'Page 3',
      excerpt: 'The Aryabhata Examination Center is situated on the North Campus Quadrangle, opposite Central Garden and adjacent to the Ramanujan Academic Block (Building Code: AEC-01). All main written examinations are held in Halls 1 to 12 of this center.'
    },
    actionId: 'MAP-ARYABHATA',
    isEscalated: false
  },
  {
    id: 'sample-3',
    category: 'FEES',
    question: 'What is the fee payment deadline for Semester IV?',
    matchedDocId: 'DOC-FEES-01',
    confidenceScore: 96,
    answer: 'The fee payment deadline for Semester IV (Academic Year 2026) is December 15, 2026 at 05:00 PM. Payments must be processed through the Chanakya Finance Portal. Payments submitted between December 16 and December 24, 2026 incur a daily late fee of ₹100. Late submissions after December 24 require written sanction from the Finance Officer.',
    citation: {
      docCode: 'CIR-FIN-2026-04',
      docTitle: 'Semester IV & VI Tuition Fee Payment Schedule 2026',
      clause: 'Clause 3.1 - Payment Deadline & Installment Schedule',
      page: 'Page 2',
      excerpt: 'The official fee payment deadline for Semester IV (Academic Year 2026) is December 15, 2026 at 05:00 PM. Payments must be processed through the Chanakya Finance Portal using net banking, UPI, or Challan.'
    },
    actionId: 'PORTAL-FEE',
    isEscalated: false
  },
  {
    id: 'sample-4',
    category: 'LEAVE',
    question: 'How do I apply for medical leave?',
    matchedDocId: 'DOC-ACAD-02',
    confidenceScore: 97,
    answer: 'To apply for medical leave, submit Digital Form AC-02 (Medical Leave Application) via the Academic ERP portal within seven (7) working days of returning to campus. Attach a registered medical practitioner certificate, prescription receipts, and an endorsement from the University Chief Medical Officer. Deliver physical copies to Room 105, Ramanujan Academic Block.',
    citation: {
      docCode: 'REG-ACAD-2026-V2',
      docTitle: 'Medical Leave Application & Verification Procedure',
      clause: 'Regulation 8.4 - Medical Certificate Submission Window',
      page: 'Page 16',
      excerpt: 'To apply for medical leave, students must submit Digital Form AC-02 (Medical Leave Application) via the Academic ERP portal within seven (7) working days of returning to campus... Physical copies must be delivered to Room 105, Ramanujan Academic Block.'
    },
    actionId: 'FORM-AC-02',
    isEscalated: false
  },
  {
    id: 'sample-5',
    category: 'HOSTEL',
    question: 'Are electric kettles allowed in hostel rooms?',
    matchedDocId: 'DOC-HOSTEL-01',
    confidenceScore: 95,
    answer: 'No, electric kettles are strictly prohibited inside student hostel rooms due to fire-safety regulations and building electrical limits. Immersion coils, heaters, and cooking appliances are also banned. Students should use the dedicated hot water electric dispensers in the floor pantries. Unauthorized appliances carry a ₹2,500 confiscation fine.',
    citation: {
      docCode: 'BYL-HST-2026-V1',
      docTitle: 'Hostel Bylaws & Electrical Appliance Policy 2026',
      clause: 'Bylaw 14.3 - Prohibited Electrical Equipment in Rooms',
      page: 'Page 9',
      excerpt: 'Electric kettles, immersion heating coils, induction cooktops, room heaters, and cooking appliances of any wattage are strictly prohibited inside student hostel rooms due to building fire-safety regulations and electrical overload limits.'
    },
    actionId: 'OFFICE-WARDEN',
    isEscalated: false
  },
  {
    id: 'sample-6',
    category: 'ATTENDANCE',
    question: 'What is the minimum attendance requirement?',
    matchedDocId: 'DOC-ACAD-01',
    confidenceScore: 99,
    answer: 'Under Academic Regulation 7.1, students must maintain a minimum attendance of 75% in each registered course to be eligible to appear for semester examinations. Attendance between 65% and 74.9% may be condoned by the Dean of Academic Affairs exclusively on certified medical grounds or sports representation. Attendance below 65% results in strict debarment.',
    citation: {
      docCode: 'REG-ACAD-2026-V1',
      docTitle: 'Academic Regulations & Minimum Attendance Requirement',
      clause: 'Regulation 7.1 - Mandatory Attendance Floor & Condonation',
      page: 'Page 14',
      excerpt: 'Under Academic Regulation 7.1, students must maintain a minimum attendance of 75% in each registered course (theory and practical components counted separately) to be eligible to appear for end-semester examinations.'
    },
    actionId: 'PORTAL-ACAD',
    isEscalated: false
  }
];

// Low confidence sample queries to demonstrate the 75% floor escalation in demo mode
export const LOW_CONFIDENCE_DEMO_QUERIES = [
  {
    question: 'Can I bring my pet iguana to the physics lecture hall?',
    confidenceScore: 38,
    reason: 'Zero official policy found regarding reptiles in academic buildings. Retrieved sources discuss general laboratory safety and hostel hygiene, but do not contain reptile regulations.',
    category: 'General / Facilities'
  },
  {
    question: 'Is there a private helipad for student drones on top of the central library?',
    confidenceScore: 24,
    reason: 'Library documents govern book borrowing and reading room hours. No drone aviation or roof landing provisions exist in official ordinances.',
    category: 'Directory / Facilities'
  }
];
