import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute – wraps content that requires authentication.
 * If not authenticated, renders the fallback (defaults to a simple prompt).
 * This is a logical guard component, not a React Router route.
 */
export default function ProtectedRoute({ children, onNavigateToLogin, fallback }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-campus-blue mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-campus-muted text-sm">Verifying your session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) return fallback;
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-campus-bg">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-full bg-campus-blue-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-campus-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-campus-navy mb-2">Sign in required</h2>
          <p className="text-campus-muted text-sm mb-5">
            You need to be signed in to access this page.
          </p>
          <button
            onClick={onNavigateToLogin}
            className="px-6 py-2.5 rounded-lg bg-campus-blue hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return children;
}
