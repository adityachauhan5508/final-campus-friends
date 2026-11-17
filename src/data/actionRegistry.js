// Action Registry defining the 4 action types: FORM, PORTAL, OFFICE, MAP
// Slide 8 & Prompt requirements

export const ACTION_REGISTRY = {
  // --- FORM ACTIONS ---
  'FORM-AC-02': {
    id: 'FORM-AC-02',
    type: 'FORM',
    title: 'Download Form AC-02 (Medical Leave Application)',
    description: 'Official application for condonation of lecture absence on medical grounds with CMO endorsement.',
    actionText: 'Open Form AC-02',
    formCode: 'Form AC-02',
    department: 'Academic Affairs',
    fileFormat: 'PDF Document (Pre-filled template)',
    requiredDocs: ['Doctor Certificate', 'Prescription Receipts', 'University CMO Endorsement']
  },
  'FORM-EX-03': {
    id: 'FORM-EX-03',
    type: 'FORM',
    title: 'Download Form EX-03 (Hall Ticket Discrepancy Correction)',
    description: 'Request for correction of student name, photograph, or enrolled subject codes on exam admit card.',
    actionText: 'Open Form EX-03',
    formCode: 'Form EX-03',
    department: 'Controller of Examinations',
    fileFormat: 'PDF Document',
    requiredDocs: ['Student ID Card Copy', 'Original Registration Slip']
  },
  'FORM-FN-04': {
    id: 'FORM-FN-04',
    type: 'FORM',
    title: 'Download Form FN-04 (Fee Refund & Adjustments)',
    description: 'Formal claim for excess tuition adjustment, semester withdrawal, or caution refund.',
    actionText: 'Open Form FN-04',
    formCode: 'Form FN-04',
    department: 'Finance Division',
    fileFormat: 'PDF Document',
    requiredDocs: ['Fee Payment Receipt', 'Bank Cancelled Cheque / Account Details']
  },
  'FORM-HS-03': {
    id: 'FORM-HS-03',
    type: 'FORM',
    title: 'Download Form HS-03 (Hostel Clearance & Appliance Permit)',
    description: 'Inspection and permit declaration form for student residential appliances.',
    actionText: 'Open Form HS-03',
    formCode: 'Form HS-03',
    department: 'Hostel Administration',
    fileFormat: 'PDF Document',
    requiredDocs: ['Hostel Allotment Slip', 'Appliance Specifications']
  },

  // --- PORTAL ACTIONS ---
  'PORTAL-EXAM': {
    id: 'PORTAL-EXAM',
    type: 'PORTAL',
    title: 'Launch Student Examination ERP Portal',
    description: 'Online examination portal for course registration, exam timetable, and digital admit cards.',
    actionText: 'Open Examination ERP',
    portalUrl: 'https://erp.campus.edu/student/examinations',
    loginRequired: true,
    features: ['Regular & Backlog Registration', 'Admit Card Generation', 'Grades & Re-evaluation']
  },
  'PORTAL-FEE': {
    id: 'PORTAL-FEE',
    type: 'PORTAL',
    title: 'Open University Fee Payment Gateway',
    description: 'Chanakya Administrative Tower integrated payment portal for semester tuition, dues, and receipts.',
    actionText: 'Open Payment Portal',
    portalUrl: 'https://fees.campus.edu/payments/sem4',
    loginRequired: true,
    features: ['UPI / Net Banking / Debit Card', 'Instant GST Receipts', 'Dues Clearance Status']
  },
  'PORTAL-HOSTEL': {
    id: 'PORTAL-HOSTEL',
    type: 'PORTAL',
    title: 'Access Tagore Hostel Resident Portal',
    description: 'Hostel student portal for night passes, mess rebates, maintenance tickets, and gate tracking.',
    actionText: 'Open Hostel Portal',
    portalUrl: 'https://hostel.campus.edu/student/portal',
    loginRequired: true,
    features: ['Night Out Pass Requests', 'Mess Rebate Application', 'Maintenance Ticket Tracking']
  },
  'PORTAL-ACAD': {
    id: 'PORTAL-ACAD',
    type: 'PORTAL',
    title: 'Open Student Academic & Attendance ERP',
    description: 'Live attendance percentage tracker, syllabus, course credits, and faculty timetables.',
    actionText: 'Open Academic Portal',
    portalUrl: 'https://academics.campus.edu/student/attendance',
    loginRequired: true,
    features: ['Subject-wise Attendance %', 'Medical Leave Upload', 'Elective Registration']
  },

  // --- OFFICE ACTIONS ---
  'OFFICE-COE': {
    id: 'OFFICE-COE',
    type: 'OFFICE',
    title: 'Controller of Examinations (CoE) Secretariat',
    description: 'In-person desk for examination grievances, hall ticket corrections, and confidential matters.',
    actionText: 'View Office Details',
    officeName: 'Office of the Controller of Examinations',
    location: 'Aryabhata Examination Center (AEC-01), Room 102',
    hours: 'Mon - Fri: 09:00 AM - 05:00 PM',
    contactPerson: 'Dr. S. K. Raman (Controller of Exams)',
    phone: '011-28004101 / Ext: 4101',
    email: 'coe@campus.edu'
  },
  'OFFICE-FINANCE': {
    id: 'OFFICE-FINANCE',
    type: 'OFFICE',
    title: 'Student Accounts & Finance Desk',
    description: 'Physical payment counter, bank challan submission, and fee refund verification.',
    actionText: 'View Finance Office',
    officeName: 'Central Accounts & Cashier Wing',
    location: 'Chanakya Administrative Tower (CAT-05), Room A-104',
    hours: 'Mon - Fri: 09:30 AM - 03:30 PM (Counters 1-4)',
    contactPerson: 'Mr. Arvind Verma (Accounts Officer)',
    phone: '011-28001102 / Ext: 1102',
    email: 'finance@campus.edu'
  },
  'OFFICE-WARDEN': {
    id: 'OFFICE-WARDEN',
    type: 'OFFICE',
    title: 'Chief Hostel Warden Secretariat',
    description: 'Hostel disciplinary committee, room allotment, appliance inspection, and security gate office.',
    actionText: 'View Warden Office',
    officeName: 'Chief Warden & Residential Life Desk',
    location: 'Tagore Student Residence (TRH-06), Ground Floor H-01',
    hours: 'Daily: 08:30 AM - 08:00 PM (Emergency: 24/7)',
    contactPerson: 'Prof. R. N. Mukherjee (Chief Warden)',
    phone: '011-28006001 / Ext: 6001',
    email: 'warden@campus.edu'
  },
  'OFFICE-DEAN-ACAD': {
    id: 'OFFICE-DEAN-ACAD',
    type: 'OFFICE',
    title: 'Office of the Dean of Academic Affairs',
    description: 'Authority for attendance condonation, medical leave validation, and course change petitions.',
    actionText: 'View Academic Dean Office',
    officeName: 'Dean of Academic Affairs Secretariat',
    location: 'Ramanujan Academic Block (RAB-02), Room 201',
    hours: 'Mon - Fri: 09:00 AM - 04:30 PM',
    contactPerson: 'Prof. Ananya Sen (Dean, Academics)',
    phone: '011-28002201 / Ext: 2201',
    email: 'dean.academics@campus.edu'
  },

  // --- MAP ACTIONS ---
  'MAP-ARYABHATA': {
    id: 'MAP-ARYABHATA',
    type: 'MAP',
    title: 'Locate on Campus Map: Aryabhata Examination Center',
    description: 'Highlight Aryabhata Examination Center (Building 1) on the offline campus plan.',
    actionText: 'Highlight on Campus Map',
    buildingId: 'b-aryabhata',
    buildingName: 'Aryabhata Examination Center',
    code: 'AEC-01',
    venuesInside: 'Halls 1-12, CoE Office, Hall Ticket Counter'
  },
  'MAP-RAMANUJAN': {
    id: 'MAP-RAMANUJAN',
    type: 'MAP',
    title: 'Locate on Campus Map: Ramanujan Academic Block',
    description: 'Highlight Ramanujan Academic Block (Building 2) on the offline campus plan.',
    actionText: 'Highlight on Campus Map',
    buildingId: 'b-ramanujan',
    buildingName: 'Ramanujan Academic Block',
    code: 'RAB-02',
    venuesInside: 'Lecture Theaters 101-405, Dean Academic Office'
  },
  'MAP-CHANAKYA': {
    id: 'MAP-CHANAKYA',
    type: 'MAP',
    title: 'Locate on Campus Map: Chanakya Administrative Tower',
    description: 'Highlight Chanakya Administrative Tower (Building 5) on the offline campus plan.',
    actionText: 'Highlight on Campus Map',
    buildingId: 'b-chanakya',
    buildingName: 'Chanakya Administrative Tower',
    code: 'CAT-05',
    venuesInside: 'Cashier Counters 1-6, Finance Office, Registrar'
  },
  'MAP-TAGORE': {
    id: 'MAP-TAGORE',
    type: 'MAP',
    title: 'Locate on Campus Map: Tagore Student Residence',
    description: 'Highlight Tagore Student Residence (Building 6) on the offline campus plan.',
    actionText: 'Highlight on Campus Map',
    buildingId: 'b-tagore',
    buildingName: 'Tagore Student Residence & Hostel Office',
    code: 'TRH-06',
    venuesInside: 'Chief Warden Office, Central Mess, Residence Halls'
  },
  'MAP-SARASWATI': {
    id: 'MAP-SARASWATI',
    type: 'MAP',
    title: 'Locate on Campus Map: Saraswati Central Library & Form Registry',
    description: 'Highlight Saraswati Central Library (Building 4) on the offline campus plan.',
    actionText: 'Highlight on Campus Map',
    buildingId: 'b-saraswati',
    buildingName: 'Saraswati Central Library & Form Registry',
    code: 'SCL-04',
    venuesInside: 'Form Registry Counter 1, Digital Reading Hall'
  },
  'MAP-VISVESVARAYA': {
    id: 'MAP-VISVESVARAYA',
    type: 'MAP',
    title: 'Locate on Campus Map: Visvesvaraya Engineering Complex',
    description: 'Highlight Visvesvaraya Engineering Complex (Building 3) on the offline campus plan.',
    actionText: 'Highlight on Campus Map',
    buildingId: 'b-visvesvaraya',
    buildingName: 'Visvesvaraya Engineering Complex',
    code: 'VEC-03',
    venuesInside: 'Computing Labs 1-4, Robotics & AI Lab, Tech Clubs'
  }
};
