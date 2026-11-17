import React, { useState } from 'react';
import ConfidenceBadge from '../components/ConfidenceBadge';
import SourceCitation from '../components/SourceCitation';
import ActionCard from '../components/ActionCard';
import { ACTION_REGISTRY } from '../data/actionRegistry';

export default function MyQuestionsPage({ history, onAskNewQuestion, onNavigateToMap }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ANSWERED') return item.status === 'ANSWERED';
    if (activeFilter === 'ESCALATED') return item.status === 'ESCALATED';
    if (activeFilter === 'RESOLVED') return item.status === 'RESOLVED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ANSWERED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Verified Answer
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Waiting for Staff Review
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Resolved by Staff
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-campus-blue text-xs font-semibold mb-2 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-campus-blue"></span>
              Private Student History · Student ID: STU-2026-8812
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-navy">
              My Campus Questions
            </h1>
            <p className="text-sm text-campus-muted mt-1">
              Review your past questions, check staff escalation updates, and access saved official citations.
            </p>
          </div>

          <button
            onClick={onAskNewQuestion}
            className="px-5 py-2.5 rounded-xl bg-campus-blue hover:bg-campus-blue-hover text-white text-xs font-semibold shadow-xs flex items-center gap-2 self-start sm:self-center transition-all"
          >
            <span>Ask a New Question</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-2">Filter by Status:</span>
          {[
            { id: 'ALL', label: `All Queries (${history.length})` },
            { id: 'ANSWERED', label: `Verified Instant (${history.filter(h => h.status === 'ANSWERED').length})` },
            { id: 'ESCALATED', label: `Waiting for Staff (${history.filter(h => h.status === 'ESCALATED').length})` },
            { id: 'RESOLVED', label: `Staff Resolved (${history.filter(h => h.status === 'RESOLVED').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === tab.id
                  ? 'bg-campus-navy text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        // Professional Empty State (Required by prompt)
        <div className="bg-white border border-campus-border rounded-2xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-campus-blue flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-campus-navy mb-1">
            No campus questions found
          </h3>
          <p className="text-sm text-campus-muted max-w-sm mx-auto mb-6">
            You haven’t asked any questions matching the current filter. Ask your first official question to get verified institutional answers.
          </p>
          <button
            onClick={onAskNewQuestion}
            className="px-6 py-2.5 rounded-xl bg-campus-blue hover:bg-campus-blue-hover text-white text-sm font-semibold shadow-xs"
          >
            Ask Your First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-campus-border rounded-2xl p-5 sm:p-6 shadow-xs hover:border-campus-blue/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  <span className="text-xs text-slate-400 font-mono">
                    {formatDate(item.submittedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.confidenceScore && (
                    <ConfidenceBadge
                      score={item.confidenceScore}
                      size="sm"
                    />
                  )}
                  <button
                    onClick={() => setSelectedQuestion(selectedQuestion?.id === item.id ? null : item)}
                    className="text-xs font-semibold text-campus-blue hover:underline ml-2"
                  >
                    {selectedQuestion?.id === item.id ? 'Hide Details ▲' : 'View Full Details ▼'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="mt-3">
                <h3 className="text-base font-bold text-campus-navy">
                  “{item.question}”
                </h3>
                
                {/* Short preview of answer */}
                <p className="text-xs text-campus-muted mt-1.5 line-clamp-2">
                  {item.answer}
                </p>
              </div>

              {/* Expanded Details Drawer */}
              {selectedQuestion?.id === item.id && (
                <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-4 animate-fade-in">
                  
                  {/* Full Answer */}
                  <div>
                    <h4 className="text-xs font-bold text-campus-navy uppercase tracking-wider mb-1">
                      {item.status === 'RESOLVED' ? 'Official Staff Resolution' : 'Assistant Response'}
                    </h4>
                    <p className={`text-sm p-4 rounded-xl border leading-relaxed ${
                      item.status === 'RESOLVED'
                        ? 'bg-blue-50/50 text-blue-950 border-blue-200'
                        : item.status === 'ESCALATED'
                        ? 'bg-amber-50/70 text-amber-900 border-amber-200'
                        : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}>
                      {item.answer}
                    </p>
                  </div>

                  {/* If Resolved by Staff */}
                  {item.resolvedBy && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between">
                      <span className="font-semibold">Resolved by: {item.resolvedBy}</span>
                      <span className="font-mono text-[11px] text-emerald-700">{formatDate(item.resolvedAt)}</span>
                    </div>
                  )}

                  {/* If Escalated and Pending */}
                  {item.status === 'ESCALATED' && item.escalationReason && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
                      <div className="font-bold mb-1">Escalation Reason:</div>
                      <p>{item.escalationReason}</p>
                    </div>
                  )}

                  {/* Citation */}
                  {item.citation && (
                    <div>
                      <h4 className="text-xs font-bold text-campus-navy uppercase tracking-wider mb-1">
                        Source Reference
                      </h4>
                      <SourceCitation citation={item.citation} />
                    </div>
                  )}

                  {/* Action */}
                  {item.actionId && ACTION_REGISTRY[item.actionId] && (
                    <div>
                      <ActionCard
                        action={ACTION_REGISTRY[item.actionId]}
                        onNavigateToMap={onNavigateToMap}
                      />
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
