import React, { useState } from 'react';

export default function ActionCard({ action, onNavigateToMap }) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showOfficeModal, setShowOfficeModal] = useState(false);

  if (!action) return null;

  const handleActionClick = () => {
    if (action.type === 'MAP') {
      if (onNavigateToMap) {
        onNavigateToMap(action.buildingId);
      }
    } else if (action.type === 'FORM') {
      setShowFormModal(true);
    } else if (action.type === 'PORTAL') {
      // In demo mode, show simulated portal redirect or open link
      window.open(action.portalUrl || '#', '_blank', 'noopener,noreferrer');
    } else if (action.type === 'OFFICE') {
      setShowOfficeModal(true);
    }
  };

  const getActionBadge = () => {
    switch (action.type) {
      case 'FORM':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Digital Form Action',
          icon: (
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
      case 'PORTAL':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Student Portal Link',
          icon: (
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )
        };
      case 'OFFICE':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          label: 'Campus Office Contact',
          icon: (
            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        };
      case 'MAP':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Campus Map Navigation',
          icon: (
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        };
    }
  };

  const badge = getActionBadge();

  return (
    <>
      <div className="mt-4 border border-campus-border rounded-xl p-4 bg-white shadow-sm hover:border-campus-blue/60 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                {badge.icon}
                {badge.label}
              </span>
              <span className="text-xs text-campus-muted font-mono font-medium">
                STEP 3: ACT
              </span>
            </div>
            <h4 className="font-semibold text-campus-navy text-base">
              {action.title}
            </h4>
            <p className="text-xs text-campus-muted mt-0.5 max-w-xl">
              {action.description}
            </p>
          </div>

          <button
            onClick={handleActionClick}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all whitespace-nowrap ${
              action.type === 'MAP'
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : action.type === 'FORM'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : action.type === 'PORTAL'
                ? 'bg-campus-blue hover:bg-campus-blue-hover text-white'
                : 'bg-campus-navy hover:bg-campus-navy-light text-white'
            }`}
          >
            {badge.icon}
            <span>{action.actionText || 'Proceed to Action'}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form Preview Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-campus-border">
            <div className="flex items-start justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {action.formCode || 'DIGITAL FORM'}
                </span>
                <h3 className="text-lg font-bold text-campus-navy mt-1">{action.title}</h3>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-campus-muted mb-4">{action.description}</p>

            <div className="bg-slate-50 border rounded-lg p-3.5 mb-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Issuing Department:</span>
                <span className="font-semibold text-slate-800">{action.department || 'Academic Affairs'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registry Format:</span>
                <span className="font-semibold text-slate-800">{action.fileFormat || 'Official PDF Form'}</span>
              </div>
              {action.requiredDocs && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1">Required Enclosures:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {action.requiredDocs.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Demo Action: ${action.title} downloaded. In production, this pulls the official PDF from Supabase Storage.`);
                  setShowFormModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Official Form PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Office Modal */}
      {showOfficeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-campus-border">
            <div className="flex items-start justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                  OFFICIAL CAMPUS DESK
                </span>
                <h3 className="text-lg font-bold text-campus-navy mt-1">{action.officeName || action.title}</h3>
              </div>
              <button
                onClick={() => setShowOfficeModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400">📍 Location:</span>
                <span className="font-semibold">{action.location || 'Central Administrative Tower'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400">🕒 Timings:</span>
                <span className="font-medium">{action.hours || 'Mon - Fri: 09:00 AM - 05:00 PM'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400">👤 Official In-Charge:</span>
                <span className="font-medium">{action.contactPerson || 'Administrative Officer'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400">📞 Phone / Ext:</span>
                <span className="font-mono font-bold text-campus-blue">{action.phone || 'Ext: 1100'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400">✉️ Email:</span>
                <span className="font-mono text-campus-blue">{action.email || 'office@campus.edu'}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOfficeModal(false)}
                className="px-4 py-2 bg-campus-navy text-white text-sm font-semibold rounded-lg hover:bg-campus-navy-light shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
