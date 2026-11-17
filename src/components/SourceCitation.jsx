import React, { useState } from 'react';

export default function SourceCitation({ citation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citation) return null;

  return (
    <div className="mt-4 bg-slate-50 border border-campus-border rounded-lg p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-campus-blue-light text-campus-blue rounded-md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <div>
            <div className="font-semibold text-campus-navy text-xs tracking-wide uppercase">
              Official Campus Document
            </div>
            <div className="font-medium text-campus-text">
              {citation.docTitle}
            </div>
          </div>
        </div>

        {citation.page && (
          <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-slate-200 text-campus-muted rounded">
            {citation.page}
          </span>
        )}
      </div>

      <div className="mt-2 text-xs text-campus-muted flex items-center gap-2">
        <span className="font-semibold text-slate-700">Clause:</span>
        <span className="bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800">{citation.clause}</span>
        {citation.docCode && (
          <span className="text-slate-400">({citation.docCode})</span>
        )}
      </div>

      {citation.excerpt && (
        <div className="mt-2.5 pt-2 border-t border-slate-200/70">
          <div className="text-xs text-slate-600 italic">
            "{citation.excerpt}"
          </div>
        </div>
      )}
    </div>
  );
}
