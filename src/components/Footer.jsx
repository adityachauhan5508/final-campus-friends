import React from 'react';

export default function Footer({ setActivePage, onOpenStaffDashboard }) {
  return (
    <footer className="bg-campus-navy text-slate-300 border-t border-slate-800 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-campus-blue flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13.5l-7-3.18V17l7 3.5 7-3.5v-4.68l-7 3.18z"/>
                </svg>
              </div>
              <span className="font-bold text-white text-lg">Smart Campus Assistant</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              "Ask the campus. Get the official answer." Verified answers, source citations, 75% confidence floor, and direct action routing for university students.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px]">
                Aarambhathon 2.0
              </span>
              <span>•</span>
              <span>Theme: AI, Automation & Intelligent Systems</span>
            </div>
          </div>

          {/* Student Pages */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Student Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">
                  1. Home
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('assistant')} className="hover:text-white transition-colors">
                  2. Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('map')} className="hover:text-white transition-colors">
                  3. Campus Map
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('questions')} className="hover:text-white transition-colors">
                  4. My Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Staff & Governance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Staff & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenStaffDashboard} 
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Protected Staff Portal</span>
                  <span className="text-[10px]">→</span>
                </button>
              </li>
              <li className="text-slate-400">Answer-Once Knowledge Engine</li>
              <li className="text-slate-400">75% Confidence Floor Escalation</li>
              <li className="text-slate-400">33 Demo Campus Documents</li>
            </ul>
          </div>

        </div>

        {/* Demo Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            <span className="font-semibold text-slate-300">Demo Prototype Note:</span> Document references and building layouts are demonstrative representations for Aarambhathon 2.0 evaluation.
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            React + Vite + Tailwind + Python FastAPI + Gemini + Supabase
          </p>
        </div>

      </div>
    </footer>
  );
}
