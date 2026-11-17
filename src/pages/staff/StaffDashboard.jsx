import React from 'react';
import StaffInbox from './StaffInbox';
import KnowledgeBaseManager from './KnowledgeBaseManager';
import StaffAnalytics from './StaffAnalytics';

export default function StaffDashboard({
  staffTab,
  setStaffTab,
  documents,
  escalations,
  history,
  onResolveEscalation,
  onToggleActiveDocument,
  onAddDocument
}) {
  const pendingCount = escalations.filter(e => e.status === 'PENDING').length;
  const resolvedCount = escalations.filter(e => e.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Tab Content Rendering */}
      {staffTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-campus-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-campus-blue text-xs font-semibold mb-2 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-campus-blue"></span>
                Official University Administrative Console
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-navy">
                Staff Governance & Verification Hub
              </h1>
              <p className="text-sm text-campus-muted mt-1 max-w-xl">
                Supervise automated query answering, review low-confidence student inquiries, and evolve campus knowledge through the Answer-Once pipeline.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStaffTab('inbox')}
                className="px-5 py-2.5 rounded-xl bg-campus-blue hover:bg-campus-blue-hover text-white text-xs font-semibold shadow-xs flex items-center gap-2"
              >
                <span>Open Staff Inbox</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-campus-navy font-bold text-[10px]">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setStaffTab('kb')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-campus-navy text-xs font-semibold shadow-xs"
              >
                Manage KB Documents
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Campus Documents</span>
              <div className="text-3xl font-extrabold text-campus-navy mt-1">{documents.length}</div>
              <span className="text-xs text-campus-blue font-medium mt-0.5 block">Active in retrieval engine</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
              <span className="text-xs text-slate-400 uppercase font-semibold">Pending Escalations</span>
              <div className="text-3xl font-extrabold text-amber-500 mt-1">{pendingCount}</div>
              <span className="text-xs text-amber-700 font-medium mt-0.5 block">&lt; 75% Confidence floor</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
              <span className="text-xs text-slate-400 uppercase font-semibold">Staff Resolved Once</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</div>
              <span className="text-xs text-emerald-700 font-medium mt-0.5 block">Indexed into official KB</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-campus-border shadow-xs">
              <span className="text-xs text-slate-400 uppercase font-semibold">Verification Floor</span>
              <div className="text-3xl font-extrabold text-campus-navy mt-1">75%</div>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Institutional safeguard</span>
            </div>

          </div>

          {/* The Answer Once Explainer Box */}
          <div className="bg-gradient-to-r from-campus-navy to-campus-navy-light text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 font-mono text-xs font-bold">
                CORE INNOVATION
              </span>
              <h2 className="text-lg font-bold">The Answer-Once Workflow (Slide 13)</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
              When an inquiry cannot be answered with 75% institutional confidence, the system never makes a guess. The student’s wording is logged, context is packaged, and routed here. A staff member provides the official answer once—and it is instantly indexed so all future students receive a verified, cited instant response.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="font-bold text-amber-300">1. Student Inquires</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Falls below 75% floor</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="font-bold text-blue-300">2. Staff Inbox</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Routed with evidence context</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="font-bold text-emerald-300">3. Answer Once</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Staff writes verified policy</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="font-bold text-purple-300">4. Reusable KB</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Instant cited answers thereafter</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {staffTab === 'inbox' && (
        <StaffInbox
          escalations={escalations}
          onResolveEscalation={onResolveEscalation}
        />
      )}

      {staffTab === 'kb' && (
        <KnowledgeBaseManager
          documents={documents}
          onToggleActive={onToggleActiveDocument}
          onAddDocument={onAddDocument}
        />
      )}

      {staffTab === 'analytics' && (
        <StaffAnalytics
          history={history}
          escalations={escalations}
          documents={documents}
        />
      )}

    </div>
  );
}
