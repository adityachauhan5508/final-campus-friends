import { processCampusQuery } from './queryEngine';
import { getStoredDocuments } from './storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Check if the Python FastAPI backend is currently running and healthy
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      return await res.json();
    }
    return { status: 'offline', framework: 'Frontend Standalone Engine' };
  } catch {
    return { status: 'offline', framework: 'Frontend Standalone Engine' };
  }
}

/**
 * Execute query through FastAPI + Gemini if available, or seamless deterministic fallback
 */
export async function executeCampusQuery(queryText, studentName = 'Aarav Sharma') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout for network call

    const res = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryText,
        student_id: 'STU-2026-8812',
        student_name: studentName
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        sourceEngine: data.model_used ? `Python FastAPI + ${data.model_used}` : 'Python FastAPI'
      };
    }
  } catch {
    // If backend is offline or timed out, seamlessly fall back to local engine
  }

  // Fallback to verified local engine
  const docs = getStoredDocuments();
  const localResult = processCampusQuery(queryText, docs);
  return {
    ...localResult,
    sourceEngine: 'Standalone Verified Engine (Client Fallback)'
  };
}
