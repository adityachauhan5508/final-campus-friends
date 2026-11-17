import { CAMPUS_DOCUMENTS } from '../data/campusDocuments';
import { INITIAL_STUDENT_HISTORY, INITIAL_STAFF_ESCALATIONS } from '../data/initialHistory';

const STORAGE_KEYS = {
  DOCUMENTS: 'sca_campus_documents_v1',
  HISTORY: 'sca_student_history_v1',
  ESCALATIONS: 'sca_staff_escalations_v1',
};

// Initialize or load documents
export function getStoredDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(CAMPUS_DOCUMENTS));
      return CAMPUS_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load documents from storage', e);
    return CAMPUS_DOCUMENTS;
  }
}

// Save documents
export function saveDocuments(docs) {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save documents to storage', e);
  }
}

// Add newly verified document to knowledge base (Answer Once workflow)
export function addVerifiedDocumentToKB(newDoc) {
  const currentDocs = getStoredDocuments();
  const updated = [newDoc, ...currentDocs];
  saveDocuments(updated);
  return updated;
}

// Get student question history
export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_STUDENT_HISTORY));
      return INITIAL_STUDENT_HISTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history from storage', e);
    return INITIAL_STUDENT_HISTORY;
  }
}

// Add new question to history
export function addQuestionToHistory(historyItem) {
  const currentHistory = getStoredHistory();
  const updated = [historyItem, ...currentHistory];
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history', e);
  }
  return updated;
}

// Get staff escalations
export function getStoredEscalations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ESCALATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(INITIAL_STAFF_ESCALATIONS));
      return INITIAL_STAFF_ESCALATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load escalations from storage', e);
    return INITIAL_STAFF_ESCALATIONS;
  }
}

// Add new escalation to staff inbox
export function addEscalation(escalationItem) {
  const current = getStoredEscalations();
  const updated = [escalationItem, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save escalation', e);
  }
  return updated;
}

// Resolve escalation (Answer Once workflow)
export function resolveEscalation(escalationId, officialAnswer, resolvedByName = 'Staff Administrator') {
  const escalations = getStoredEscalations();
  const target = escalations.find(e => e.id === escalationId);
  if (!target) return null;

  target.status = 'RESOLVED';
  target.officialResponse = officialAnswer;
  target.resolvedBy = resolvedByName;
  target.resolvedAt = new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(escalations));
  } catch (e) {
    console.error('Failed to update escalation', e);
  }

  // Also update matching student question in history if present
  const history = getStoredHistory();
  const matchedHist = history.find(h => h.question.trim().toLowerCase() === target.question.trim().toLowerCase());
  if (matchedHist) {
    matchedHist.status = 'RESOLVED';
    matchedHist.answer = `Official Staff Resolution: ${officialAnswer}`;
    matchedHist.resolvedBy = resolvedByName;
    matchedHist.resolvedAt = target.resolvedAt;
    matchedHist.citation = {
      docCode: `RES-${target.id}`,
      docTitle: `Official Staff Verified Resolution (${target.category})`,
      clause: 'Direct Staff Resolution # ' + target.id,
      page: 'Knowledge Base Addendum'
    };
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to update student history', e);
    }
  }

  // Add into Knowledge Base so subsequent queries get verified instant answers!
  const newKBDoc = {
    id: `DOC-RES-${Date.now()}`,
    code: `KB-RES-${target.id}`,
    title: `Staff Resolution: ${target.question.slice(0, 50)}...`,
    category: target.category || 'General',
    sourceType: 'Official Staff Resolution',
    uploadDate: new Date().toISOString().split('T')[0],
    clause: `Staff Resolution Ref #${target.id}`,
    pageNumber: 'Knowledge Base Entry',
    buildingId: 'b-chanakya',
    isActive: true,
    summary: officialAnswer,
    content: `Question: ${target.question}. Official Institutional Answer: ${officialAnswer} (Endorsed by ${resolvedByName} on ${new Date().toLocaleDateString()}).`,
    keywords: target.question.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  };

  addVerifiedDocumentToKB(newKBDoc);

  return { target, newKBDoc };
}

// Reset demo data to factory defaults
export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
  localStorage.removeItem(STORAGE_KEYS.ESCALATIONS);
  return {
    documents: CAMPUS_DOCUMENTS,
    history: INITIAL_STUDENT_HISTORY,
    escalations: INITIAL_STAFF_ESCALATIONS
  };
}
