import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StaffNavbar from './components/StaffNavbar';
import Footer from './components/Footer';

// Student Pages (The 4 core pages from PPT)
import HomePage from './pages/HomePage';
import AssistantPage from './pages/AssistantPage';
import CampusMapPage from './pages/CampusMapPage';
import MyQuestionsPage from './pages/MyQuestionsPage';

// Protected Staff Dashboard
import StaffDashboard from './pages/staff/StaffDashboard';

// State and storage services
import {
  getStoredDocuments,
  saveDocuments,
  getStoredHistory,
  getStoredEscalations,
  resolveEscalation as executeResolveEscalation,
  resetDemoData
} from './services/storage';

export default function App() {
  // Navigation State
  // Mode: 'student' | 'staff'
  const [viewMode, setViewMode] = useState('student');
  
  // Student active page: 'home' | 'assistant' | 'map' | 'questions' (Strictly 4 pages from PPT)
  const [activeStudentPage, setActiveStudentPage] = useState('home');

  // Staff active sub-tab: 'overview' | 'inbox' | 'kb' | 'analytics'
  const [staffTab, setStaffTab] = useState('overview');

  // Data State
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [escalations, setEscalations] = useState([]);

  // Cross-page parameters
  const [assistantInitialQuery, setAssistantInitialQuery] = useState('');
  const [targetBuildingId, setTargetBuildingId] = useState(null);

  // Load stored state on mount
  useEffect(() => {
    setDocuments(getStoredDocuments());
    setHistory(getStoredHistory());
    setEscalations(getStoredEscalations());
  }, []);

  const refreshData = () => {
    setDocuments(getStoredDocuments());
    setHistory(getStoredHistory());
    setEscalations(getStoredEscalations());
  };

  // Student Navigation Actions
  const handleSelectQuestion = (queryText) => {
    setAssistantInitialQuery(queryText);
    setActiveStudentPage('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMap = (buildingId) => {
    setTargetBuildingId(buildingId);
    setActiveStudentPage('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAboutBuilding = (queryText) => {
    setAssistantInitialQuery(queryText);
    setActiveStudentPage('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Staff Resolution Action (Answer Once workflow)
  const handleResolveEscalation = (escId, answer, staffName) => {
    executeResolveEscalation(escId, answer, staffName);
    refreshData();
  };

  const handleToggleActiveDocument = (docId) => {
    const updated = documents.map(d => {
      if (d.id === docId) {
        return { ...d, isActive: !d.isActive };
      }
      return d;
    });
    setDocuments(updated);
    saveDocuments(updated);
  };

  const handleAddDocument = (newDoc) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveDocuments(updated);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all demo documents, questions, and staff escalations to Aarambhathon initial state?')) {
      const reset = resetDemoData();
      setDocuments(reset.documents);
      setHistory(reset.history);
      setEscalations(reset.escalations);
    }
  };

  const pendingEscalationsCount = escalations.filter(e => e.status === 'PENDING').length;

  return (
    <div className="min-h-screen flex flex-col bg-campus-bg text-campus-text">
      
      {/* Top Demo Notification Pill Banner */}
      <div className="bg-campus-navy-dark text-slate-300 text-[11px] py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <strong>Aarambhathon 2.0 Official Project:</strong> Smart Campus Assistant (33 Indexed Docs · 6 Buildings · 75% Confidence Floor)
        </span>
        <button
          onClick={handleResetDemo}
          className="text-slate-400 hover:text-white underline text-[10px] ml-2"
          title="Reset demo data to default state"
        >
          Reset Demo State
        </button>
      </div>

      {/* Conditional Header: Student Navigation vs Staff Navbar */}
      {viewMode === 'student' ? (
        <Navbar
          activePage={activeStudentPage}
          setActivePage={setActiveStudentPage}
          onOpenStaffDashboard={() => setViewMode('staff')}
          pendingEscalationsCount={pendingEscalationsCount}
        />
      ) : (
        <StaffNavbar
          staffTab={staffTab}
          setStaffTab={setStaffTab}
          onExitToStudent={() => setViewMode('student')}
          pendingEscalationsCount={pendingEscalationsCount}
        />
      )}

      {/* Main Content Area */}
      <main className="grow">
        {viewMode === 'student' ? (
          <>
            {activeStudentPage === 'home' && (
              <HomePage
                onSelectQuestion={handleSelectQuestion}
                onNavigateToAssistant={() => setActiveStudentPage('assistant')}
                onNavigateToMap={() => setActiveStudentPage('map')}
              />
            )}

            {activeStudentPage === 'assistant' && (
              <AssistantPage
                initialQuery={assistantInitialQuery}
                onNavigateToMap={handleNavigateToMap}
                onRefreshEscalationsCount={refreshData}
              />
            )}

            {activeStudentPage === 'map' && (
              <CampusMapPage
                targetBuildingId={targetBuildingId}
                onAskAboutBuilding={handleAskAboutBuilding}
              />
            )}

            {activeStudentPage === 'questions' && (
              <MyQuestionsPage
                history={history}
                onAskNewQuestion={() => {
                  setAssistantInitialQuery('');
                  setActiveStudentPage('assistant');
                }}
                onNavigateToMap={handleNavigateToMap}
              />
            )}
          </>
        ) : (
          <StaffDashboard
            staffTab={staffTab}
            setStaffTab={setStaffTab}
            documents={documents}
            escalations={escalations}
            history={history}
            onResolveEscalation={handleResolveEscalation}
            onToggleActiveDocument={handleToggleActiveDocument}
            onAddDocument={handleAddDocument}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActivePage={(page) => {
          setViewMode('student');
          setActiveStudentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStaffDashboard={() => {
          setViewMode('staff');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
