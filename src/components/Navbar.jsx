import React, { useState } from 'react';

export default function Navbar({ activePage, setActivePage, onOpenStaffDashboard, pendingEscalationsCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exactly the 4 required primary student destinations (Section 3 of Master Prompt)
  const navItems = [
    { id: 'home', label: 'Home', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'assistant', label: 'Assistant', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )},
    { id: 'map', label: 'Campus Map', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )},
    { id: 'questions', label: 'My Questions', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-campus-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & University Product Name on the Left */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-campus-navy flex items-center justify-center text-white shadow-xs group-hover:bg-campus-blue transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2zm0 13.5l-7-3.18V17l7 3.5 7-3.5v-4.68l-7 3.18z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-campus-navy text-lg tracking-tight group-hover:text-campus-blue transition-colors">
                    Smart Campus
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-campus-blue-light text-campus-blue font-bold font-mono">
                    2.0
                  </span>
                </div>
                <p className="text-[11px] text-campus-muted font-medium leading-none">
                  Aarambhathon 2.0 Official Query Assistant
                </p>
              </div>
            </button>
          </div>

          {/* Desktop 4-Page Primary Student Navigation Bar */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-campus-blue bg-campus-blue-light/70 shadow-xs'
                      : 'text-campus-muted hover:text-campus-navy hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-campus-blue' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-campus-blue rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Student Profile & Protected Staff Access */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Student ID badge */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-campus-border text-xs text-campus-text">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium text-slate-700">Aarav S.</span>
              <span className="text-slate-400">· Sem IV</span>
            </div>

            {/* Separate Protected Staff Dashboard Access */}
            <button
              onClick={onOpenStaffDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-campus-navy hover:bg-campus-navy-light text-white transition-all shadow-xs relative"
              title="Open protected Staff Administration Dashboard"
            >
              <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Staff Portal</span>
              {pendingEscalationsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {pendingEscalationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center sm:hidden gap-2">
            <button
              onClick={onOpenStaffDashboard}
              className="p-1.5 rounded-md text-xs font-semibold bg-campus-navy text-white flex items-center gap-1"
            >
              <span className="text-[11px]">Staff</span>
              {pendingEscalationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-campus-muted hover:text-campus-navy hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-campus-border bg-white px-4 pt-2 pb-4 space-y-1 animate-fade-in shadow-lg">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Student Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-campus-blue bg-campus-blue-light'
                    : 'text-campus-text hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-campus-blue' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-3 mt-2 border-t border-campus-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Aarav S. (Sem IV)</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStaffDashboard();
              }}
              className="text-xs font-semibold text-campus-blue hover:underline"
            >
              Staff Dashboard →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
