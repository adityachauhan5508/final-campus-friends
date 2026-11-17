# Phase 4 (Complete) + Phase 5 — Implementation Plan

## What's being built:
1. **Login-First**: App boots to login page, ALL routes blocked without auth
2. **Student persistent accounts**: Profile, history, announcements from Supabase
3. **Staff authorization system**: Role-based, admin-granted only
4. **KB Document Upload**: PDF + CSV only, with status workflow (Draft→Processing→Published)
5. **Priority retrieval**: Published staff docs > KB > escalation
6. **FAQ learning**: Staff can convert answers to published FAQs
7. **Enhanced Staff Inbox**: Full escalation management
8. **Backend protection**: JWT on every protected endpoint

## Files being created/modified:
- `src/App.jsx` — Login-first gate, full auth-aware routing
- `src/context/AuthContext.jsx` — Add `isDemoAuthenticated` demo login gate
- `src/pages/auth/AuthPages.jsx` — Login page as default entry
- `src/pages/HomePage.jsx` — Student dashboard with profile + history
- `src/pages/staff/KnowledgeBaseManager.jsx` — PDF/CSV upload with status
- `src/pages/staff/StaffInbox.jsx` — Full escalation inbox + FAQ conversion
- `src/services/queryEngine.js` — Priority retrieval (published docs first)
- `backend/routes/staff.py` — Document upload with PDF/CSV parsing
- `supabase/schema.sql` — faq_entries, document status workflow
