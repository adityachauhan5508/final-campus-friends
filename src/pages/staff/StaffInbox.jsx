import React, { useState } from 'react';
import ConfidenceBadge from '../../components/ConfidenceBadge';

export default function StaffInbox({ escalations, onResolveEscalation }) {
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [officialResponse, setOfficialResponse]     = useState('');
  const [staffCategory, setStaffCategory]           = useState('General');
  const [staffName, setStaffName]                   = useState('Dr. S. K. Raman (CoE)');
  const [isResolving, setIsResolving]               = useState(false);
  const [filterStatus, setFilterStatus]             = useState('ALL');
  // FAQ conversion
  const [createFAQ, setCreateFAQ] = useState(true);
  const [faqTitle, setFaqTitle]   = useState('');

  const filteredEscalations = escalations.filter((esc) => {
    if (filterStatus === 'ALL') return true;
    return esc.status === filterStatus;
  });

  const handleOpenResolveModal = (esc) => {
    setSelectedEscalation(esc);
    setOfficialResponse(esc.officialResponse || '');
    setStaffCategory(esc.category || 'General');
    setCreateFAQ(true);
    setFaqTitle(esc.question || '');
  };

  const handleSubmitResolution = (e) => {
    e.preventDefault();
    if (!officialResponse.trim() || !selectedEscalation) return;
    setIsResolving(true);
    setTimeout(() => {
      onResolveEscalation(selectedEscalation.id, officialResponse.trim(), staffName);

      // Optionally save FAQ for later approval
      if (createFAQ && faqTitle.trim()) {
        try {
          const faqs = JSON.parse(localStorage.getItem('sca_faqs') || '[]');
          faqs.push({
            id: `FAQ-${Date.now()}`,
            question: faqTitle.trim(),
            answer: officialResponse.trim(),
            category: staffCategory,
            source: `Staff Resolution by ${staffName}`,
            escalationId: selectedEscalation.id,
            status: 'pending_approval',
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem('sca_faqs', JSON.stringify(faqs));
        } catch {}
      }

      setIsResolving(false);
      setSelectedEscalation(null);
      setOfficialResponse('');
      setFaqTitle('');
    }, 400);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return isoString; }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-campus-navy to-campus-navy-light text-white p-6 rounded-2xl shadow-sm border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                PPT SLIDE 13 WORKFLOW
              </span>
              <span className="text-xs text-slate-300">Answer Once Knowledge Base Evolution</span>
            </div>
            <h2 className="text-xl font-bold">Staff Escalation Inbox</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Questions that scored below the 75% confidence floor are queued here. When you answer a question once,
              it is automatically indexed as an official campus document so subsequent students receive instant cited answers.
              You can also optionally create a reusable FAQ entry for approval.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-extrabold text-amber-400">
                {escalations.filter(e => e.status === 'PENDING').length}
              </div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                Pending Review
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-campus-border shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
          {['ALL', 'PENDING', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === status
                  ? 'bg-campus-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status} ({status === 'ALL' ? escalations.length : escalations.filter(e => e.status === status).length})
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredEscalations.length} escalations
        </span>
      </div>

      {/* Escalation Cards List */}
      <div className="space-y-4">
        {filteredEscalations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-campus-border text-slate-500">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-campus-navy">Inbox Clear!</div>
            <p className="text-xs text-slate-400 mt-1">No escalations matching the current filter.</p>
          </div>
        ) : (
          filteredEscalations.map((esc) => {
            const isPending = esc.status === 'PENDING';
            return (
              <div
                key={esc.id}
                className={`bg-white border rounded-2xl p-6 shadow-xs transition-all ${
                  isPending ? 'border-amber-200/80 hover:border-amber-400' : 'border-campus-border opacity-90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-slate-500">{esc.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {esc.status}
                    </span>
                    <span className="text-xs text-slate-400">· {formatDate(esc.submittedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ConfidenceBadge score={esc.confidenceScore} isAboveFloor={false} size="sm" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>Student: <strong className="text-slate-800">{esc.studentName || 'Anonymous Student'}</strong></span>
                    <span>·</span>
                    <span>Category: <strong className="text-slate-800">{esc.category}</strong></span>
                  </div>
                  <h3 className="text-base font-bold text-campus-navy">"{esc.question}"</h3>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <span className="font-bold block">Why it was escalated (&lt; 75% Floor):</span>
                  <p>{esc.escalationReason}</p>
                </div>

                {esc.retrievedWeakMatches && esc.retrievedWeakMatches.length > 0 && (
                  <div className="mt-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-500 block mb-1">
                      System's Closest Partial Matches (Below 75% threshold):
                    </span>
                    <div className="space-y-1">
                      {esc.retrievedWeakMatches.map((match, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center text-[11px]">
                          <span><strong>{match.docTitle}</strong> ({match.clause})</span>
                          <span className="font-mono text-slate-500">{match.relevanceScore}% match</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {esc.status === 'RESOLVED' && esc.officialResponse && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-campus-navy mb-1">
                      <span>✓ Official Verified Response:</span>
                      <span className="text-[11px] text-slate-500">By {esc.resolvedBy} on {formatDate(esc.resolvedAt)}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{esc.officialResponse}</p>
                    <div className="mt-2 text-[11px] text-emerald-700 font-medium">
                      ✓ This answer has been indexed into the campus knowledge base as reusable official guidance.
                    </div>
                  </div>
                )}

                {isPending && (
                  <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleOpenResolveModal(esc)}
                      className="px-5 py-2 rounded-xl bg-campus-blue hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Answer Once &amp; Resolve Escalation</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Answer Once Resolution Modal */}
      {selectedEscalation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-campus-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-campus-blue rounded">
                  ANSWER ONCE WORKFLOW · {selectedEscalation.id}
                </span>
                <h3 className="text-lg font-bold text-campus-navy mt-1">
                  Resolve Escalation &amp; Update Knowledge Base
                </h3>
              </div>
              <button
                onClick={() => setSelectedEscalation(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitResolution} className="space-y-4 text-xs">

              {/* Question overview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Student Question:</span>
                <p className="text-sm font-bold text-campus-navy">"{selectedEscalation.question}"</p>
                <div className="mt-2 text-[11px] text-slate-500">
                  Asked by: {selectedEscalation.studentName} · Reason: {selectedEscalation.escalationReason}
                </div>
              </div>

              {/* Staff details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff In-Charge / Title:</label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={e => setStaffName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">KB Document Category:</label>
                  <select
                    value={staffCategory}
                    onChange={e => setStaffCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
                  >
                    {['Examinations', 'Fees', 'Hostel', 'Academics', 'Facilities', 'Events', 'Clubs', 'General'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Official Answer */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Verified Answer (Will be permanently saved in the Campus Knowledge Base):
                </label>
                <textarea
                  rows={5}
                  value={officialResponse}
                  onChange={e => setOfficialResponse(e.target.value)}
                  placeholder="Provide the exact institutional rule, timeline, room number, or procedure to resolve this inquiry…"
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm focus:border-campus-blue focus:ring-2 focus:ring-campus-blue/20"
                  required
                />
              </div>

              {/* Info box */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-slate-600 text-[11px] space-y-1">
                <span className="font-bold text-campus-navy block">What happens when you click Submit:</span>
                <div>1. The student's history status changes from <em>Escalated</em> to <em>Resolved</em>.</div>
                <div>2. A new verified knowledge base entry is indexed with your official statement.</div>
                <div>3. Future students asking this same question receive an instant, cited answer!</div>
              </div>

              {/* FAQ Conversion Option */}
              <div className="border border-campus-border rounded-xl p-4 bg-slate-50/60">
                <label className="flex items-center gap-2.5 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={createFAQ}
                    onChange={e => setCreateFAQ(e.target.checked)}
                    className="w-4 h-4 text-campus-blue"
                  />
                  <span className="text-xs font-bold text-campus-navy">
                    Also create a reusable FAQ entry (requires approval before publishing)
                  </span>
                </label>
                {createFAQ && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">FAQ Question Title:</label>
                    <input
                      type="text"
                      value={faqTitle}
                      onChange={e => setFaqTitle(e.target.value)}
                      placeholder="Concise, searchable question for the FAQ…"
                      className="w-full px-3 py-2 rounded-lg border border-campus-border text-xs focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                    />
                    <p className="text-[11px] text-campus-muted mt-1.5">
                      This FAQ will be saved as <strong>Pending Approval</strong>. It won't reach students until a reviewer publishes it.
                      Once approved, it prevents repeated escalations for the same question.
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedEscalation(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResolving || !officialResponse.trim()}
                  className="px-5 py-2 bg-campus-blue hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-60"
                >
                  {isResolving ? 'Publishing & Indexing…' : '✓ Resolve & Add to Knowledge Base'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
