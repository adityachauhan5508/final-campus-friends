// Initial student history records demonstrating the 3 status states:
// 1. Answered (Confidence >= 75%)
// 2. Questions waiting for staff (Escalated < 75%)
// 3. Resolved escalations (Staff Answer Once workflow completed)

export const INITIAL_STUDENT_HISTORY = [
  {
    id: 'hist-001',
    question: 'When is the deadline for exam registration?',
    submittedAt: '2026-11-16T10:14:00Z',
    status: 'ANSWERED', // ANSWERED | ESCALATED | RESOLVED
    confidenceScore: 98,
    answer: 'The official deadline for regular and backlog examination registration for the Autumn/Winter 2026 session is November 28, 2026 at 11:59 PM via the Student Examination ERP Portal. Late fine of ₹1,000 applies from Nov 29 to Dec 3, 2026.',
    citation: {
      docCode: 'ORD-EX-2026-V1',
      docTitle: 'University Examination Ordinance & Schedule 2026',
      clause: 'Section 4.2 - Registration Deadline & Eligibility',
      page: 'Page 12'
    },
    actionId: 'PORTAL-EXAM',
    category: 'Examinations'
  },
  {
    id: 'hist-002',
    question: 'Can day-scholar students use the hostel mess during exam weeks?',
    submittedAt: '2026-11-15T14:32:00Z',
    status: 'RESOLVED',
    confidenceScore: 88,
    answer: 'Official Staff Resolution: Yes, day scholars may purchase temporary meal coupons for lunch and dinner at the Tagore Central Dining Mess cash counter for ₹80 per meal during official examination weeks (November 25 - December 18). University student ID is mandatory.',
    citation: {
      docCode: 'BYL-HST-2026-V2-ADD',
      docTitle: 'Staff Resolution: Day-Scholar Examination Mess Access Addendum',
      clause: 'Resolution Ref #ESC-1049',
      page: 'Executive Order'
    },
    actionId: 'OFFICE-WARDEN',
    category: 'Hostel',
    resolvedBy: 'Prof. R. N. Mukherjee (Chief Warden)',
    resolvedAt: '2026-11-15T17:45:00Z'
  },
  {
    id: 'hist-003',
    question: 'Are external electric heaters with thermostats permitted in hostel winter rooms?',
    submittedAt: '2026-11-17T09:05:00Z',
    status: 'ESCALATED',
    confidenceScore: 61,
    answer: 'This question has been automatically escalated to the Chief Hostel Warden and Electrical Safety Committee because retrieved evidence did not meet the 75% confidence floor. An official staff response will appear here once verified.',
    escalationReason: 'Retrieved Hostel Bylaw 14.3 prohibits heating coils and general appliances over 100W, but does not explicitly address medical thermostat waivers. Forwarded to Warden Secretariat for formal determination.',
    category: 'Hostel',
    actionId: 'OFFICE-WARDEN'
  }
];

export const INITIAL_STAFF_ESCALATIONS = [
  {
    id: 'ESC-2026-001',
    studentId: 'STU-2026-8812',
    studentName: 'Aarav Sharma (B.Tech CSE, Sem IV)',
    question: 'Are external electric heaters with thermostats permitted in hostel winter rooms?',
    submittedAt: '2026-11-17T09:05:00Z',
    confidenceScore: 61,
    category: 'Hostel',
    retrievedWeakMatches: [
      {
        docTitle: 'Hostel Bylaws & Electrical Appliance Policy 2026',
        clause: 'Bylaw 14.3',
        relevanceScore: 61,
        snippet: 'Electric kettles, immersion heating coils, induction cooktops, room heaters, and cooking appliances of any wattage are strictly prohibited...'
      }
    ],
    escalationReason: 'Confidence 61% (below 75% floor). Student inquired specifically about thermostat medical exemptions which are not explicitly defined in the standard bylaw clause.',
    status: 'PENDING', // PENDING | RESOLVED
    officialResponse: '',
    resolvedBy: '',
    resolvedAt: null
  },
  {
    id: 'ESC-2026-002',
    studentId: 'STU-2026-4409',
    studentName: 'Priya Nair (B.Des, Sem II)',
    question: 'Can student design teams access 3D printers after 09:00 PM for national hackathon prep?',
    submittedAt: '2026-11-16T18:20:00Z',
    confidenceScore: 54,
    category: 'Academics / Labs',
    retrievedWeakMatches: [
      {
        docTitle: 'Technical & Cultural Student Clubs Charter 2026',
        clause: 'Section 4.1',
        relevanceScore: 54,
        snippet: 'Club rooms and maker facilities are located on the second floor of Visvesvaraya Engineering Complex... Standard hours 08:00 AM - 08:30 PM.'
      }
    ],
    escalationReason: 'Confidence 54% (below 75% floor). Overtime lab access policies for external hackathons require Dean of Student Affairs special permit.',
    status: 'PENDING',
    officialResponse: '',
    resolvedBy: '',
    resolvedAt: null
  }
];
