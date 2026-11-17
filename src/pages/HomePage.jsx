import React, { useState } from 'react';
import { SAMPLE_QUESTIONS } from '../data/sampleQuestions';

export default function HomePage({ onSelectQuestion, onNavigateToAssistant, onNavigateToMap }) {
  const [queryInput, setQueryInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryInput.trim()) {
      onSelectQuestion(queryInput.trim());
    } else {
      onNavigateToAssistant();
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-campus-blue-light/50 via-white to-campus-bg pt-12 pb-16 border-b border-campus-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-campus-blue text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-campus-blue animate-pulse"></span>
            Aarambhathon 2.0 · Smart Campus Query & Action Assistant
          </div>

          {/* Main Headline (Exact requirement from prompt) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-campus-navy tracking-tight leading-tight">
            Ask the campus. <br className="hidden sm:block" />
            <span className="text-campus-blue">Get the official answer.</span>
          </h1>

          {/* Supporting Description */}
          <p className="mt-5 text-lg sm:text-xl text-campus-muted max-w-2xl mx-auto leading-relaxed">
            Find verified answers to campus questions, discover the right office or form, and locate important university buildings — all in one place.
          </p>

          {/* Prominent Question Input / Search Area */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-campus-blue/20 hover:border-campus-blue focus-within:border-campus-blue transition-all p-2">
              <div className="pl-3 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask a question about exams, hostel rules, fees, forms..."
                className="w-full px-4 py-3 text-base text-campus-text bg-transparent placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-campus-blue hover:bg-campus-blue-hover text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
              >
                <span>Ask Assistant</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Quick Category Hints */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs text-campus-muted">
            <span className="font-semibold text-slate-500">Popular topics:</span>
            {['Exam Deadlines', 'Aryabhata Center', 'Fee Installments', 'Medical Leave', 'Hostel Appliances', '75% Attendance'].map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {tag}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* Demo Statistics Grid (Clearly labelled demo data) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-campus-border p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="text-sm font-bold text-campus-navy uppercase tracking-wider">
                System Status & Verified Knowledge Base
              </h3>
            </div>
            <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Demo Campus Data
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-campus-navy">33</div>
              <div className="text-xs sm:text-sm font-semibold text-campus-blue mt-1">Indexed Documents</div>
              <div className="text-[11px] text-campus-muted mt-0.5">Ordinances, circulars & registries</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-campus-navy">6</div>
              <div className="text-xs sm:text-sm font-semibold text-campus-blue mt-1">Mapped Buildings</div>
              <div className="text-[11px] text-campus-muted mt-0.5">Offline interactive campus plan</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-campus-navy">75%</div>
              <div className="text-xs sm:text-sm font-semibold text-campus-blue mt-1">Confidence Floor</div>
              <div className="text-[11px] text-campus-muted mt-0.5">Zero guesses · Low scores escalate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-campus-navy">4</div>
              <div className="text-xs sm:text-sm font-semibold text-campus-blue mt-1">Student Pages</div>
              <div className="text-[11px] text-campus-muted mt-0.5">Home, Assistant, Map, Questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Question Cards Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-campus-navy text-xs font-bold uppercase tracking-wider mb-2">
            What Students Can Ask
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-campus-navy">
            Try one of these sample questions
          </h2>
          <p className="text-sm text-campus-muted mt-1">
            Click any question card to open the Assistant and receive a cited, verified answer with direct actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_QUESTIONS.map((sq) => (
            <div
              key={sq.id}
              onClick={() => onSelectQuestion(sq.question)}
              className="group cursor-pointer bg-white rounded-xl border border-campus-border p-5 shadow-xs hover:shadow-md hover:border-campus-blue transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                    sq.category === 'EXAMINATIONS' ? 'bg-blue-100 text-blue-800' :
                    sq.category === 'FEES' ? 'bg-amber-100 text-amber-800' :
                    sq.category === 'LEAVE' ? 'bg-emerald-100 text-emerald-800' :
                    sq.category === 'HOSTEL' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {sq.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {sq.confidenceScore}% match
                  </span>
                </div>
                <h3 className="font-semibold text-campus-navy text-base group-hover:text-campus-blue transition-colors leading-snug">
                  “{sq.question}”
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-campus-muted">
                <span className="truncate max-w-[190px]">{sq.citation.docTitle}</span>
                <span className="font-semibold text-campus-blue group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Ask →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The 3-Step Architecture Section (Slide 5: RETRIEVE -> VERIFY -> ACT) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-campus-navy text-white rounded-2xl p-8 sm:p-10 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest">
              Institutional Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Retrieval, Verification, then Action
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Sourced, never invented. Confidence shown up front. Escalated, not dropped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: RETRIEVE */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 font-bold font-mono text-sm flex items-center justify-center mb-4 border border-blue-400/30">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">RETRIEVE</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Matches the student's question against official campus handbooks, examination ordinances, fee circulars, and the digital form registry.
              </p>
              <div className="mt-4 text-[11px] font-mono text-blue-200">
                ✓ 33 campus documents indexed
              </div>
            </div>

            {/* Step 2: VERIFY */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold font-mono text-sm flex items-center justify-center mb-4 border border-emerald-400/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">VERIFY</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates answers strictly from matched documents and calculates confidence. If below the 75% floor, nothing is guessed—it is sent to staff.
              </p>
              <div className="mt-4 text-[11px] font-mono text-emerald-200">
                ✓ Strict 75% Confidence Floor
              </div>
            </div>

            {/* Step 3: ACT */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-mono text-sm flex items-center justify-center mb-4 border border-amber-400/30">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ACT</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides direct, actionable resolution: opens the exact digital form, links to the student portal, displays the office contact, or lights up the venue on the map.
              </p>
              <div className="mt-4 text-[11px] font-mono text-amber-200">
                ✓ FORM · PORTAL · OFFICE · MAP
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Offline Campus Map Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-campus-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-campus-blue uppercase tracking-wider bg-campus-blue-light px-2.5 py-1 rounded">
              Page 3 Feature
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-campus-navy">
              Explore the Offline Drawn Campus Map
            </h3>
            <p className="text-sm text-campus-muted max-w-xl">
              Locate examination centers, academic blocks, finance desks, and hostel offices without depending on external map APIs. Questions about where to go automatically highlight the building!
            </p>
          </div>
          <button
            onClick={onNavigateToMap}
            className="px-6 py-3 rounded-xl bg-campus-navy hover:bg-campus-navy-light text-white font-semibold text-sm shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
          >
            <span>Open Campus Map</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
        </div>
      </section>

    </div>
  );
}
