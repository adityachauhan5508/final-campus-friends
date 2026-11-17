// 6 Demo Campus Buildings as specified in the original PPT (Slide 14)
export const CAMPUS_BUILDINGS = [
  {
    id: 'b-aryabhata',
    number: 1,
    name: 'Aryabhata Examination Center',
    code: 'AEC-01',
    category: 'Examinations',
    shortDescription: 'Primary university examination complex, hall ticket verification, and confidential exam halls.',
    fullDescription: 'Houses Examination Halls 1 through 12, Controller of Examinations (CoE) executive chambers, evaluation wings, and student grievance verification desks.',
    venues: [
      'Aryabhata Examination Center',
      'Examination Hall 1 (Ground Floor)',
      'Examination Hall 2 (Ground Floor)',
      'Examination Hall 3 (First Floor)',
      'Confidential Evaluation Wing',
      'Hall Ticket Correction Counter'
    ],
    offices: [
      { name: 'Controller of Examinations (CoE)', room: 'Room 102', contact: 'coe@campus.edu / Ext: 4101' },
      { name: 'Examination Grievance Desk', room: 'Counter 3', contact: 'examhelp@campus.edu / Ext: 4105' }
    ],
    timings: 'Mon - Sat: 08:30 AM - 05:30 PM (Exam days: 07:30 AM - 07:00 PM)',
    svg: {
      x: 80,
      y: 70,
      width: 220,
      height: 150,
      color: '#2563EB',
      roofColor: '#1D4ED8'
    }
  },
  {
    id: 'b-ramanujan',
    number: 2,
    name: 'Ramanujan Academic Block',
    code: 'RAB-02',
    category: 'Academics',
    shortDescription: 'Main lecture complex, faculty departments, and Dean of Academic Affairs office.',
    fullDescription: 'Central academic building containing high-capacity tiered lecture theaters (LH 101 to LH 405), seminar halls, and department academic offices.',
    venues: [
      'Lecture Hall 101-108 (Ground Floor)',
      'Lecture Hall 201-208 (First Floor)',
      'Ramanujan Main Auditorium',
      'Academic Affairs Committee Room'
    ],
    offices: [
      { name: 'Dean of Academic Affairs', room: 'Room 201', contact: 'dean.academics@campus.edu / Ext: 2201' },
      { name: 'Attendance & Medical Leave Cell', room: 'Room 105', contact: 'attendance@campus.edu / Ext: 2210' }
    ],
    timings: 'Mon - Fri: 08:00 AM - 06:30 PM',
    svg: {
      x: 360,
      y: 60,
      width: 240,
      height: 160,
      color: '#0EA5E9',
      roofColor: '#0284C7'
    }
  },
  {
    id: 'b-visvesvaraya',
    number: 3,
    name: 'Visvesvaraya Engineering Complex',
    code: 'VEC-03',
    category: 'Labs & Tech',
    shortDescription: 'Computing laboratories, AI research facility, and student tech club workshops.',
    fullDescription: 'State-of-the-art engineering laboratories, high-performance computing clusters, hardware testing labs, and robotics project workshops.',
    venues: [
      'Central Computing Laboratory 1 & 2',
      'AI & Machine Learning Research Center',
      'Maker Space & Prototyping Workshop',
      'Electronics & IoT System Lab'
    ],
    offices: [
      { name: 'Head of Laboratories', room: 'Room V-110', contact: 'labs@campus.edu / Ext: 3301' },
      { name: 'Student Technical Society Desk', room: 'Room V-015', contact: 'techclubs@campus.edu / Ext: 3315' }
    ],
    timings: 'Mon - Sat: 08:00 AM - 08:30 PM',
    svg: {
      x: 660,
      y: 70,
      width: 220,
      height: 150,
      color: '#6366F1',
      roofColor: '#4F46E5'
    }
  },
  {
    id: 'b-saraswati',
    number: 4,
    name: 'Saraswati Central Library & Form Registry',
    code: 'SCL-04',
    category: 'Directory & Forms',
    shortDescription: 'Digital form repository, thesis archives, reference stacks, and student study lounges.',
    fullDescription: 'Houses over 120,000 physical volumes, digital knowledge terminals, physical submission desk for the Digital Form Registry, and reading lounges.',
    venues: [
      'Digital Form Registry Help Desk (Ground Floor)',
      'Main Reading Hall (First Floor)',
      'Digital Reference & E-Journal Wing',
      'Archives & Circular Repository'
    ],
    offices: [
      { name: 'Digital Form Helpdesk & Registry', room: 'Counter 1-2', contact: 'forms@campus.edu / Ext: 5120' },
      { name: 'University Chief Librarian', room: 'Room L-101', contact: 'library@campus.edu / Ext: 5101' }
    ],
    timings: 'Mon - Sun: 07:30 AM - 10:30 PM',
    svg: {
      x: 80,
      y: 280,
      width: 220,
      height: 160,
      color: '#10B981',
      roofColor: '#059669'
    }
  },
  {
    id: 'b-chanakya',
    number: 5,
    name: 'Chanakya Administrative Tower',
    code: 'CAT-05',
    category: 'Fees & Admin',
    shortDescription: 'University finance division, cashier desks, registrar, and scholarship verification.',
    fullDescription: 'The administrative heart of the campus. Handles student fee collection, scholarship disbursal, fee receipt validation, refund processing, and official transcripts.',
    venues: [
      'Student Cashier Counters 1-6',
      'Scholarship & Financial Aid Cell',
      'Office of the Registrar',
      'Student Verification Wing'
    ],
    offices: [
      { name: 'Finance & Accounts Officer', room: 'Room A-104', contact: 'finance@campus.edu / Ext: 1102' },
      { name: 'Cashier & Payment Helpdesk', room: 'Counter 4', contact: 'feepayments@campus.edu / Ext: 1109' }
    ],
    timings: 'Mon - Fri: 09:00 AM - 05:00 PM (Cashier closes at 03:30 PM)',
    svg: {
      x: 360,
      y: 280,
      width: 240,
      height: 160,
      color: '#F59E0B',
      roofColor: '#D97706'
    }
  },
  {
    id: 'b-tagore',
    number: 6,
    name: 'Tagore Student Residence & Hostel Office',
    code: 'TRH-06',
    category: 'Hostel',
    shortDescription: 'Hostel warden headquarters, mess management, appliance clearance, and residence halls.',
    fullDescription: 'Supervises residential student services, student room allotments, mess council operations, night curfew permissions, and appliance security clearances.',
    venues: [
      'Chief Warden Secretariat',
      'Hostel Appliance Verification Desk',
      'Central Dining Hall & Mess Office',
      'Visitor Reception & Check-in'
    ],
    offices: [
      { name: 'Chief Hostel Warden', room: 'Room H-01', contact: 'warden@campus.edu / Ext: 6001' },
      { name: 'Hostel Caretaker & Appliance Desk', room: 'Reception Counter', contact: 'hosteloffice@campus.edu / Ext: 6010' }
    ],
    timings: 'Office: 08:30 AM - 08:00 PM | Resident Desk: 24/7',
    svg: {
      x: 660,
      y: 280,
      width: 220,
      height: 160,
      color: '#8B5CF6',
      roofColor: '#7C3AED'
    }
  }
];
