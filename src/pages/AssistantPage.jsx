import React, { useState, useEffect, useRef } from 'react';
import ConfidenceBadge from '../components/ConfidenceBadge';
import SourceCitation from '../components/SourceCitation';
import ActionCard from '../components/ActionCard';
import { SAMPLE_QUESTIONS, LOW_CONFIDENCE_DEMO_QUERIES } from '../data/sampleQuestions';
import { processCampusQuery, CONFIDENCE_FLOOR } from '../services/queryEngine';
import { addQuestionToHistory, addEscalation, getStoredDocuments } from '../services/storage';

export default function AssistantPage({ initialQuery, onNavigateToMap, onRefreshEscalationsCount }) {
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(null); // 'retrieving' | 'verifying' | 'acting'
  const [historySaved, setHistorySaved] = useState(false);
  const inputRef = useRef(null);

  // Auto-run if initialQuery is passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInputQuery(initialQuery);
      handleExecuteQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleExecuteQuery = (queryText) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    setIsProcessing(true);
    setCurrentResponse(null);
    setHistorySaved(false);

    // Step 1: RETRIEVE animation
    setProcessingStep('retrieving');
    setTimeout(() => {
      // Step 2: VERIFY animation
      setProcessingStep('verifying');
      setTimeout(() => {
        // Step 3: ACT and finalize
        setProcessingStep('acting');
        setTimeout(() => {
          try {
            const allDocs = getStoredDocuments();
            const result = processCampusQuery(q, allDocs);
            setCurrentResponse({
              query: q,
              ...result,
              timestamp: new Date().toISOString()
            });

            // Save to Student Question History
            const historyItem = {
              id: `hist-${Date.now()}`,
              question: q,
              submittedAt: new Date().toISOString(),
              status: result.status === 'VERIFIED' ? 'ANSWERED' : 'ESCALATED',
              confidenceScore: result.confidenceScore,
              answer: result.answer,
              citation: result.citation || null,
              actionId: result.action?.id || null,
              category: result.citation?.docCategory || 'Campus Query',
              escalationReason: result.escalationReason || null
            };
            addQuestionToHistory(historyItem);

            // If below 75% floor -> Escalate to Staff Inbox!
            if (!result.isAboveFloor) {
              const escalationItem = {
                id: `ESC-${Date.now().toString().slice(-5)}`,
                studentId: 'STU-2026-8812',
                studentName: 'Aarav Sharma (B.Tech CSE, Sem IV)',
                question: q,
                submittedAt: new Date().toISOString(),
                confidenceScore: result.confidenceScore,
                category: result.citation?.docCategory || 'Unclassified / Policy Gap',
                retrievedWeakMatches: (result.retrievedPassages || []).map(p => ({
                  docTitle: p.title,
                  clause: p.clause,
                  relevanceScore: p.relevanceScore,
                  snippet: p.summary
                })),
                escalationReason: result.escalationReason,
                status: 'PENDING',
                officialResponse: '',
                resolvedBy: '',
                resolvedAt: null
              };
              addEscalation(escalationItem);
              if (onRefreshEscalationsCount) onRefreshEscalationsCount();
            }

            setHistorySaved(true);
          } catch (err) {
            console.error('Query processing error:', err);
          } finally {
            setIsProcessing(false);
            setProcessingStep(null);
          }
        }, 350);
      }, 350);
    }, 350);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleExecuteQuery(inputQuery);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Assistant Header */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-campus-blue text-xs font-semibold mb-2 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-campus-blue"></span>
              Verified Question-Answering System
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-navy">
              Campus AI Query Assistant
            </h1>
            <p className="text-sm text-campus-muted mt-1">
              Official campus answers strictly sourced from indexed university documents.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-campus-navy text-xs font-mono font-semibold border border-slate-200">
              Floor: {CONFIDENCE_FLOOR}% Confidence
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="mt-6">
          <div className="relative flex items-center shadow-sm rounded-xl border border-campus-border bg-slate-50/50 focus-within:bg-white focus-within:border-campus-blue focus-within:ring-2 focus-within:ring-campus-blue/20 transition-all p-2">
            <div className="pl-2 text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. When is the exam deadline? Are electric kettles allowed?)"
              className="w-full px-3 py-2.5 text-sm sm:text-base text-campus-text bg-transparent placeholder-slate-400 focus:outline-hidden"
              disabled={isProcessing}
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 mr-2 text-sm"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="px-5 py-2.5 rounded-lg bg-campus-blue hover:bg-campus-blue-hover disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 shrink-0"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Submit Question</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Questions Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quick Verified Questions:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((sq) => (
              <button
                key={sq.id}
                onClick={() => {
                  setInputQuery(sq.question);
                  handleExecuteQuery(sq.question);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-campus-blue-light hover:text-campus-blue border border-slate-200 text-slate-700 transition-colors text-left"
              >
                {sq.question}
              </button>
            ))}
          </div>

          {/* Test Low Confidence Question Pill */}
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
            <span className="font-semibold shrink-0">Demo Escalation Trigger:</span>
            <button
              onClick={() => {
                const q = LOW_CONFIDENCE_DEMO_QUERIES[0].question;
                setInputQuery(q);
                handleExecuteQuery(q);
              }}
              className="underline hover:text-amber-900 text-left font-medium"
            >
              "Can I bring my pet iguana to the physics lecture hall?" (Simulates &lt;75% floor escalation)
            </button>
          </div>
        </div>
      </div>

      {/* 3-Step Live Processing Indicator */}
      {isProcessing && (
        <div className="bg-white border border-campus-border rounded-2xl p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-campus-blue uppercase">
              Executing Sourced Verification Pipeline
            </span>
            <span className="text-xs text-campus-muted font-mono">Real-time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              processingStep === 'retrieving' ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-200' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Matching Campus KB...</span>
            </div>

            <div className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              processingStep === 'verifying' ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Scoring Evidence &gt;= 75%...</span>
            </div>

            <div className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              processingStep === 'acting' ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-200' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <span>Resolving Action...</span>
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {currentResponse && !isProcessing && (
        <div className="bg-white border border-campus-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
          
          {/* Top Status & Confidence Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-campus-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                Question Status:
              </span>
              {currentResponse.isAboveFloor ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  VERIFIED OFFICIAL ANSWER
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  ESCALATED TO STAFF INBOX
                </span>
              )}
            </div>

            {/* Confidence Badge */}
            <ConfidenceBadge
              score={currentResponse.confidenceScore}
              isAboveFloor={currentResponse.isAboveFloor}
              showLabel={true}
            />
          </div>

          {/* Student Question */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-xs text-campus-muted font-semibold uppercase tracking-wider mb-1">
              Student Query
            </div>
            <div className="text-base font-semibold text-campus-navy">
              “{currentResponse.query}”
            </div>
          </div>

          {/* Answer Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-campus-blue"></span>
              <h3 className="text-xs font-bold text-campus-navy uppercase tracking-wider">
                {currentResponse.isAboveFloor ? 'Official Institutional Answer' : 'Assistant Verification Notice'}
              </h3>
            </div>
            
            <p className={`text-base leading-relaxed p-4 rounded-xl border ${
              currentResponse.isAboveFloor 
                ? 'bg-blue-50/40 text-campus-text border-blue-100/80' 
                : 'bg-amber-50/60 text-amber-900 border-amber-200'
            }`}>
              {currentResponse.answer}
            </p>
          </div>

          {/* If Escalated: Explanation & Escalation Log Context */}
          {!currentResponse.isAboveFloor && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-sm text-amber-800">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Institutional 75% Confidence Floor Rule:</span>
              </div>
              <p>
                {currentResponse.escalationReason}
              </p>
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-700 font-mono">
                <span>Logged to Staff Inbox with Student Context</span>
                <span>Status: PENDING OFFICIAL REVIEW</span>
              </div>
            </div>
          )}

          {/* Source Document Citations (Only shown when citations exist) */}
          {currentResponse.citation && (
            <div>
              <h3 className="text-xs font-bold text-campus-navy uppercase tracking-wider">
                STEP 2: VERIFIED SOURCE CITATION
              </h3>
              <SourceCitation citation={currentResponse.citation} />
            </div>
          )}

          {/* STEP 3: Action Card */}
          {currentResponse.action && (
            <div>
              <ActionCard
                action={currentResponse.action}
                onNavigateToMap={onNavigateToMap}
              />
            </div>
          )}

          {/* Saved in My Questions Notification */}
          {historySaved && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Automatically saved to your Question History (Page 4)
              </span>
              <button
                onClick={() => {
                  setCurrentResponse(null);
                  setInputQuery('');
                  inputRef.current?.focus();
                }}
                className="text-campus-blue hover:underline font-semibold"
              >
                Ask Another Question →
              </button>
            </div>
          )}

        </div>
      )}

      {/* Helpful Campus Process Guide Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-600">
        <h4 className="font-bold text-campus-navy uppercase tracking-wider mb-2">
          How this Assistant Guarantees Accuracy
        </h4>
        <p className="leading-relaxed">
          Unlike general AI models, the Smart Campus Assistant answers exclusively from verified institutional campus documents (ordinances, circulars, bylaws, and directories). If evidence relevance scores below 75%, answers are never invented—they are routed to university staff.
        </p>
      </div>

    </div>
  );
}
