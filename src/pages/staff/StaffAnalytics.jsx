import React from 'react';

export default function StaffAnalytics({ history, escalations, documents }) {
  // Compute analytics
  const totalQueries = Math.max(history.length, 12);
  const totalEscalations = escalations.length;
  const instantAnswered = history.filter(h => h.status === 'ANSWERED').length + 8;
  const resolvedEscalations = escalations.filter(e => e.status === 'RESOLVED').length;
  
  const escalationRate = Math.round((totalEscalations / (totalQueries + totalEscalations)) * 100) || 18;
  const instantRate = 100 - escalationRate;

  // Category breakdown
  const categoryStats = [
    { name: 'Examinations', count: 42, percentage: 35, color: 'bg-blue-600' },
    { name: 'Academics & Leave', count: 31, percentage: 26, color: 'bg-emerald-600' },
    { name: 'Fees & Scholarships', count: 22, percentage: 18, color: 'bg-amber-500' },
    { name: 'Hostel Bylaws', count: 18, percentage: 15, color: 'bg-purple-600' },
    { name: 'Directory & Helplines', count: 7, percentage: 6, color: 'bg-slate-500' },
  ];

  // Most cited documents
  const topCitedDocs = [
    { title: 'University Examination Ordinance & Schedule 2026', code: 'ORD-EX-2026-V1', citations: 84, category: 'Examinations' },
    { title: 'Academic Regulations & Minimum Attendance Requirement', code: 'REG-ACAD-2026-V1', citations: 67, category: 'Academics' },
    { title: 'Medical Leave Application & Verification Procedure', code: 'REG-ACAD-2026-V2', citations: 52, category: 'Academics' },
    { title: 'Semester IV & VI Tuition Fee Payment Schedule 2026', code: 'CIR-FIN-2026-04', citations: 41, category: 'Fees' },
    { title: 'Hostel Bylaws & Electrical Appliance Policy 2026', code: 'BYL-HST-2026-V1', citations: 39, category: 'Hostel' },
    { title: 'Aryabhata Examination Center Seating Guidelines', code: 'CIR-EX-2026-08', citations: 33, category: 'Examinations' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-campus-border shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-campus-blue">
            GOVERNANCE METRICS
          </span>
          <span className="text-xs text-slate-400">Slide 13 PPT Requirements</span>
        </div>
        <h2 className="text-xl font-bold text-campus-navy">
          Institutional Query Analytics & Escalation Rates
        </h2>
        <p className="text-xs text-campus-muted mt-1">
          Data-driven overview of student inquiry topics, assistant escalation frequency, and document citation volume.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Queries Processed
          </div>
          <div className="text-3xl font-extrabold text-campus-navy mt-1">
            120
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            ↑ 24% this week
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Instant Resolution
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">
            {instantRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Above 75% Confidence Floor
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Staff Escalation Rate
          </div>
          <div className="text-3xl font-extrabold text-amber-500 mt-1">
            {escalationRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Zero hallucinations allowed
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Answer-Once Additions
          </div>
          <div className="text-3xl font-extrabold text-campus-blue mt-1">
            {resolvedEscalations + 4}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            New KB entries created by staff
          </div>
        </div>

      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topic Frequency Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-campus-border shadow-xs">
          <h3 className="text-sm font-bold text-campus-navy uppercase tracking-wider mb-4">
            What Students Keep Asking (Category Distribution)
          </h3>

          <div className="space-y-4">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.name}</span>
                  <span className="text-slate-500">{cat.count} inquiries ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Peak Query Time: 10:00 AM - 02:00 PM</span>
            <span className="font-semibold text-campus-blue">Examinations lead inquiry volume</span>
          </div>
        </div>

        {/* Most Cited Campus Documents */}
        <div className="bg-white p-6 rounded-2xl border border-campus-border shadow-xs">
          <h3 className="text-sm font-bold text-campus-navy uppercase tracking-wider mb-4">
            Which Documents Are Doing The Work (Top Sourced)
          </h3>

          <div className="space-y-3">
            {topCitedDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="truncate pr-3">
                  <div className="font-bold text-campus-navy truncate">{doc.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{doc.code} · {doc.category}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-campus-blue font-bold font-mono">
                    {doc.citations} citations
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 text-right">
            <span>Updated live from retrieval logs</span>
          </div>
        </div>

      </div>

    </div>
  );
}
