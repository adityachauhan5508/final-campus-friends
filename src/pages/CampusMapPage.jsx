import React, { useState, useEffect } from 'react';
import { CAMPUS_BUILDINGS } from '../data/campusBuildings';

export default function CampusMapPage({ targetBuildingId, onAskAboutBuilding }) {
  const [selectedBuildingId, setSelectedBuildingId] = useState(targetBuildingId || 'b-aryabhata');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    if (targetBuildingId) {
      setSelectedBuildingId(targetBuildingId);
      const bldg = CAMPUS_BUILDINGS.find(b => b.id === targetBuildingId);
      if (bldg) {
        setSearchQuery(bldg.name);
      }
    }
  }, [targetBuildingId]);

  const selectedBuilding = CAMPUS_BUILDINGS.find(b => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];

  // Search filter matching building name, code, venues, and offices
  const filteredBuildings = CAMPUS_BUILDINGS.filter(bldg => {
    if (filterCategory !== 'ALL' && bldg.category !== filterCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      bldg.name.toLowerCase().includes(q) ||
      bldg.code.toLowerCase().includes(q) ||
      bldg.venues.some(v => v.toLowerCase().includes(q)) ||
      bldg.offices.some(o => o.name.toLowerCase().includes(q) || o.room.toLowerCase().includes(q))
    );
  });

  const handleSelectBuilding = (bldgId) => {
    setSelectedBuildingId(bldgId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-campus-border rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-campus-blue text-xs font-semibold mb-2 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-campus-blue"></span>
              Offline Campus Plan · 6 Mapped University Blocks
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-campus-navy">
              Campus Venue & Architectural Map
            </h1>
            <p className="text-sm text-campus-muted mt-1">
              Zero external API dependencies. Fully interactive, offline SVG university plan with venue locator.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Demo Campus Layout
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by venue name, hall number, or department (e.g. Aryabhata, Cashier, Computing Lab)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-campus-border rounded-xl focus:bg-white focus:border-campus-blue focus:ring-2 focus:ring-campus-blue/20 transition-all text-campus-text placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'Examinations', 'Academics', 'Labs & Tech', 'Fees & Admin', 'Hostel', 'Directory & Forms'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-campus-blue text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map + Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Drawn Map Area (8 Columns on desktop) */}
        <div className="lg:col-span-8 bg-white border border-campus-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          
          <div className="flex items-center justify-between mb-3 text-xs text-campus-muted">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Interactive Campus Plan (Click any building to inspect)
            </span>
            <span className="font-mono text-slate-400">Scale: 1 : 500 (Campus Grid)</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-16/10 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 960 500"
              className="w-full h-full select-none"
              style={{ touchAction: 'manipulation' }}
            >
              <defs>
                {/* Grass pattern */}
                <pattern id="lawnPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#f0fdf4" />
                  <circle cx="10" cy="10" r="1.5" fill="#dcfce7" />
                </pattern>
                {/* Pathway pattern */}
                <pattern id="pathPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#e2e8f0" />
                  <line x1="0" y1="5" x2="10" y2="5" stroke="#cbd5e1" strokeWidth="0.5" />
                </pattern>
                {/* Drop shadow filter for buildings */}
                <filter id="shadow" x="-5%" y="-5%" width="115%" height="115%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Base Campus Grounds */}
              <rect width="960" height="500" fill="url(#lawnPattern)" />

              {/* Campus Boundary Roadways & Pathways */}
              {/* Outer boundary */}
              <rect x="20" y="20" width="920" height="460" rx="16" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
              
              {/* Main Avenue Roads */}
              {/* Horizontal Central Boulevard */}
              <rect x="20" y="235" width="920" height="30" fill="url(#pathPattern)" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="30" y1="250" x2="930" y2="250" stroke="#ffffff" strokeWidth="2" strokeDasharray="12 10" />

              {/* Vertical Cross Avenues */}
              <rect x="310" y="20" width="30" height="460" fill="url(#pathPattern)" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="610" y="20" width="30" height="460" fill="url(#pathPattern)" stroke="#cbd5e1" strokeWidth="1" />

              {/* Central Garden Plaza & University Fountain */}
              <circle cx="480" cy="250" r="32" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
              <circle cx="480" cy="250" r="16" fill="#38bdf8" />
              <circle cx="480" cy="250" r="6" fill="#ffffff" />
              <text x="480" y="295" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1" letterSpacing="0.5">
                CENTRAL PLAZA
              </text>

              {/* North Campus & South Campus Gate Markers */}
              <rect x="440" y="10" width="80" height="15" rx="3" fill="#142B4A" />
              <text x="480" y="21" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">NORTH GATE</text>

              <rect x="440" y="475" width="80" height="15" rx="3" fill="#142B4A" />
              <text x="480" y="486" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">MAIN SOUTH GATE</text>

              {/* Render the 6 Campus Buildings */}
              {CAMPUS_BUILDINGS.map((bldg) => {
                const isSelected = selectedBuildingId === bldg.id;
                const isMatched = filteredBuildings.some(fb => fb.id === bldg.id);
                const { x, y, width, height, color, roofColor } = bldg.svg;

                return (
                  <g
                    key={bldg.id}
                    onClick={() => handleSelectBuilding(bldg.id)}
                    className="cursor-pointer transition-all duration-200"
                    style={{ opacity: isMatched ? 1 : 0.35 }}
                  >
                    {/* Pulsing Highlight ring when selected */}
                    {isSelected && (
                      <rect
                        x={x - 8}
                        y={y - 8}
                        width={width + 16}
                        height={height + 16}
                        rx="14"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="3.5"
                        className="map-highlight"
                      />
                    )}

                    {/* Building Body */}
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx="10"
                      fill="#FFFFFF"
                      stroke={isSelected ? '#2563EB' : '#94A3B8'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      filter="url(#shadow)"
                    />

                    {/* Architectural Roof Band */}
                    <path
                      d={`M ${x} ${y + 32} L ${x} ${y + 10} Q ${x} ${y} ${x + 10} ${y} L ${x + width - 10} ${y} Q ${x + width} ${y} ${x + width} ${y + 10} L ${x + width} ${y + 32} Z`}
                      fill={isSelected ? roofColor : '#334155'}
                    />

                    {/* Building Number Badge */}
                    <circle
                      cx={x + 22}
                      cy={y + 16}
                      r="10"
                      fill="#FFFFFF"
                      stroke={isSelected ? '#2563EB' : '#475569'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={x + 22}
                      y={y + 20}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#1E293B"
                    >
                      {bldg.number}
                    </text>

                    {/* Building Code on Roof */}
                    <text
                      x={x + 40}
                      y={y + 20}
                      fontSize="11"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      letterSpacing="0.5"
                    >
                      {bldg.code}
                    </text>

                    {/* Building Title Inside */}
                    <text
                      x={x + width / 2}
                      y={y + 55}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#0F172A"
                    >
                      {bldg.name.length > 24 ? bldg.name.slice(0, 22) + '...' : bldg.name}
                    </text>

                    {/* Sub-label Category */}
                    <rect
                      x={x + width / 2 - 45}
                      y={y + 68}
                      width="90"
                      height="18"
                      rx="4"
                      fill={isSelected ? '#EFF6FF' : '#F1F5F9'}
                      stroke={isSelected ? '#BFDBFE' : '#E2E8F0'}
                      strokeWidth="1"
                    />
                    <text
                      x={x + width / 2}
                      y={y + 81}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={isSelected ? '#1D4ED8' : '#64748B'}
                    >
                      {bldg.category}
                    </text>

                    {/* Architectural Windows / Pillars */}
                    <g opacity="0.6">
                      <rect x={x + 20} y={y + 98} width="16" height="22" rx="2" fill="#E2E8F0" />
                      <rect x={x + 45} y={y + 98} width="16" height="22" rx="2" fill="#E2E8F0" />
                      <rect x={x + 70} y={y + 98} width="16" height="22" rx="2" fill="#E2E8F0" />
                      {width > 200 && (
                        <>
                          <rect x={x + 130} y={y + 98} width="16" height="22" rx="2" fill="#E2E8F0" />
                          <rect x={x + 155} y={y + 98} width="16" height="22" rx="2" fill="#E2E8F0" />
                          <rect x={x + 180} y={y + 98} width="16" height="22" rx="2" fill="#E2E8F0" />
                        </>
                      )}
                      {/* Main Entry Door */}
                      <rect
                        x={x + width / 2 - 12}
                        y={y + 96}
                        width="24"
                        height="26"
                        rx="2"
                        fill={isSelected ? '#2563EB' : '#475569'}
                      />
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Building Selector Pills below map */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-400 self-center mr-1">
              Quick Focus:
            </span>
            {CAMPUS_BUILDINGS.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelectBuilding(b.id)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedBuildingId === b.id
                    ? 'bg-campus-blue text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {b.number}. {b.name.split(' ')[0]}
              </button>
            ))}
          </div>

        </div>

        {/* Selected Building Details Sidebar (4 Columns on desktop) */}
        <div className="lg:col-span-4 bg-white border border-campus-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Building Identification */}
            <div className="pb-4 border-b border-campus-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  BUILDING {selectedBuilding.number} · {selectedBuilding.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {selectedBuilding.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-campus-navy mt-2">
                {selectedBuilding.name}
              </h2>
              <p className="text-xs text-campus-muted mt-1 leading-relaxed">
                {selectedBuilding.fullDescription}
              </p>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
              <span className="text-base">🕒</span>
              <div>
                <span className="font-semibold block text-slate-900">Access Hours:</span>
                <span>{selectedBuilding.timings}</span>
              </div>
            </div>

            {/* Key Venues Inside */}
            <div>
              <h3 className="text-xs font-bold text-campus-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>📍</span> Key Venues & Halls ({selectedBuilding.venues.length})
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedBuilding.venues.map((venue, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-campus-blue shrink-0"></span>
                    <span className="font-medium">{venue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Offices & Contact Persons */}
            <div>
              <h3 className="text-xs font-bold text-campus-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🏢</span> Located Offices & Helpdesks
              </h3>
              <div className="space-y-2">
                {selectedBuilding.offices.map((office, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="font-bold text-campus-navy">{office.name}</div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>{office.room}</span>
                      <span className="font-mono text-campus-blue">{office.contact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Query CTA */}
          <div className="mt-6 pt-4 border-t border-campus-border">
            <button
              onClick={() => {
                if (onAskAboutBuilding) {
                  onAskAboutBuilding(`Where is ${selectedBuilding.name} and what are the office hours?`);
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-campus-navy hover:bg-campus-navy-light text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Ask Assistant About This Building</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
