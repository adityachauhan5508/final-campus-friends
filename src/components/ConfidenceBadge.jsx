import React from 'react';

export default function ConfidenceBadge({ score, isAboveFloor = true, showLabel = true, size = 'md' }) {
  const meetsFloor = score >= 75;

  let colorClasses = '';
  let statusText = '';
  let iconSvg = null;

  if (meetsFloor && score >= 88) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    statusText = 'Verified High Confidence';
    iconSvg = (
      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  } else if (meetsFloor) {
    colorClasses = 'bg-blue-50 text-blue-800 border-blue-200';
    statusText = 'Verified Institutional Match';
    iconSvg = (
      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    statusText = 'Below 75% Floor · Escalated';
    iconSvg = (
      <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses} shadow-sm`}>
      {iconSvg}
      <span>{score}%</span>
      {showLabel && <span className="opacity-80">· {statusText}</span>}
    </div>
  );
}
