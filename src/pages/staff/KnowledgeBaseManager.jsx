import React, { useState, useRef } from 'react';

// Document status workflow
const STATUS_CONFIG = {
  draft:            { label: 'Draft',            color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400' },
  processing:       { label: 'Processing',       color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500 animate-pulse' },
  pending_approval: { label: 'Pending Approval', color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  published:        { label: 'Published',        color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  archived:         { label: 'Archived',         color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400' },
  failed:           { label: 'Failed',           color: 'bg-red-100 text-red-700',       dot: 'bg-red-500' },
};

const ALLOWED_TYPES = {
  'application/pdf': 'PDF',
  'text/csv':        'CSV',
  'text/plain':      null, // rejected
};

const CATEGORIES = ['Academics', 'Examinations', 'Fees', 'Hostel', 'Facilities', 'Events', 'Clubs', 'IT Support', 'General'];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

export default function KnowledgeBaseManager({ documents, onToggleActive, onAddDocument }) {
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus]     = useState('ALL');
  const [showUploadModal, setShowUploadModal]   = useState(false);
  const [showManualModal, setShowManualModal]   = useState(false);
  const [previewDoc, setPreviewDoc]             = useState(null);

  // Upload modal state
  const [uploadFile, setUploadFile]       = useState(null);
  const [uploadTitle, setUploadTitle]     = useState('');
  const [uploadCategory, setUploadCategory] = useState('General');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadVersion, setUploadVersion] = useState('1.0');
  const [uploading, setUploading]         = useState(false);
  const [uploadError, setUploadError]     = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileRef = useRef(null);

  // Manual entry modal state
  const [newTitle, setNewTitle]       = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newSourceType, setNewSourceType] = useState('Official Ordinance');
  const [newClause, setNewClause]     = useState('');
  const [newSummary, setNewSummary]   = useState('');
  const [newContent, setNewContent]   = useState('');

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && (doc.status || 'published') !== selectedStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(q) ||
      doc.code?.toLowerCase().includes(q) ||
      doc.category?.toLowerCase().includes(q)
    );
  });

  // ── File selection & validation ──────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploadSuccess('');

    // Validate type
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');

    if (!isPDF && !isCSV) {
      setUploadError(`❌ Unsupported file type: "${file.name}". Only PDF and CSV files are accepted. DOCX, TXT, XLSX, images and ZIP are rejected.`);
      setUploadFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('❌ File exceeds 10 MB limit. Please upload a smaller file.');
      setUploadFile(null);
      return;
    }

    setUploadFile(file);
    // Auto-fill title from filename
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.(pdf|csv)$/i, '').replace(/[-_]/g, ' '));
    }
  };

  // ── Upload submit ─────────────────────────────────────────────────────────
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) { setUploadError('Please select a PDF or CSV file.'); return; }
    if (!uploadTitle.trim()) { setUploadError('Document title is required.'); return; }

    setUploading(true);
    setUploadError('');

    try {
      // 1. Try backend upload endpoint (if FastAPI is running)
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle.trim());
      formData.append('category', uploadCategory);
      formData.append('description', uploadDescription);
      formData.append('version', uploadVersion);

      let backendSuccess = false;
      let extractedContent = '';

      try {
        const res = await fetch('http://localhost:8000/api/staff/upload-document', {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          extractedContent = data.extracted_text || '';
          backendSuccess = true;
        }
      } catch {
        // Backend not running — fall through to local parsing
      }

      // 2. Local CSV parsing (frontend fallback)
      if (!backendSuccess && uploadFile.type === 'text/csv' || uploadFile.name.endsWith('.csv')) {
        try {
          const text = await uploadFile.text();
          extractedContent = `[CSV Data]\n${text.slice(0, 2000)}`;
        } catch {}
      }

      // 3. For PDFs without backend — note that text extraction requires the backend
      if (!backendSuccess && (uploadFile.type === 'application/pdf' || uploadFile.name.endsWith('.pdf'))) {
        extractedContent = `[PDF document - text extraction requires backend service. File: ${uploadFile.name}]`;
      }

      // 4. Build doc object — start as draft
      const fileType = uploadFile.name.endsWith('.csv') ? 'CSV' : 'PDF';
      const newDoc = {
        id: `DOC-UPLOAD-${Date.now()}`,
        code: `STF-${uploadCategory.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: uploadTitle.trim(),
        category: uploadCategory,
        sourceType: `Staff Upload (${fileType})`,
        uploadDate: new Date().toISOString().split('T')[0],
        clause: 'Staff Uploaded Document',
        pageNumber: 'Page 1',
        buildingId: null,
        isActive: false, // must be approved before active
        status: backendSuccess ? 'pending_approval' : 'draft',
        version: uploadVersion,
        description: uploadDescription,
        fileType,
        summary: uploadDescription || `${fileType} document uploaded by staff. ${extractedContent ? 'Text extracted.' : 'Awaiting text extraction.'}`,
        content: extractedContent,
        keywords: uploadTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3),
        uploadedBy: 'Staff Member',
      };

      onAddDocument(newDoc);
      setUploadSuccess(`✅ "${uploadTitle}" uploaded as ${newDoc.status === 'pending_approval' ? 'Pending Approval' : 'Draft'}. ${!backendSuccess ? 'Start the backend server for full text extraction.' : 'Text extracted successfully.'}`);
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setUploadVersion('1.0');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Manual entry submit ───────────────────────────────────────────────────
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    const newDoc = {
      id: `DOC-MANUAL-${Date.now()}`,
      code: `MAN-${newCategory.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      category: newCategory,
      sourceType: newSourceType,
      uploadDate: new Date().toISOString().split('T')[0],
      clause: newClause || 'Section 1 — General',
      pageNumber: 'Page 1',
      buildingId: null,
      isActive: false,
      status: 'pending_approval',
      version: '1.0',
      summary: newSummary || newContent.slice(0, 140) + '…',
      content: newContent.trim(),
      keywords: newTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3),
      uploadedBy: 'Staff Member',
    };
    onAddDocument(newDoc);
    setShowManualModal(false);
    setNewTitle(''); setNewCategory('General'); setNewSourceType('Official Ordinance');
    setNewClause(''); setNewSummary(''); setNewContent('');
  };

  // ── Approve document (publish) ────────────────────────────────────────────
  const handleApprove = (docId) => {
    // This would normally call backend; here we update local status
    const docs = JSON.parse(localStorage.getItem('sca_documents') || '[]');
    const updated = docs.map(d => d.id === docId ? { ...d, status: 'published', isActive: true } : d);
    localStorage.setItem('sca_documents', JSON.stringify(updated));
    // Notify parent — toggle active acts as approve for now
    onToggleActive(docId);
  };

  const totalDocs     = documents.length;
  const publishedDocs = documents.filter(d => d.isActive || d.status === 'published').length;
  const pendingDocs   = documents.filter(d => d.status === 'pending_approval').length;
  const draftDocs     = documents.filter(d => d.status === 'draft' || (!d.status && !d.isActive)).length;

  return (
    <div className="p-6 space-y-6">

      {/* Header + Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-navy">Knowledge Base Manager</h2>
          <p className="text-sm text-campus-muted">Manage campus documents that power the AI Assistant.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowManualModal(true); setShowUploadModal(false); }}
            className="px-4 py-2 rounded-lg border border-campus-border text-sm font-semibold text-campus-navy hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Manual Entry
          </button>
          <button
            onClick={() => { setShowUploadModal(true); setShowManualModal(false); setUploadError(''); setUploadSuccess(''); }}
            className="px-4 py-2 rounded-lg bg-campus-blue hover:bg-blue-700 text-sm font-semibold text-white transition-colors shadow-xs flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload PDF / CSV
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Docs',   value: totalDocs,     color: 'text-campus-navy' },
          { label: 'Published',    value: publishedDocs, color: 'text-emerald-600' },
          { label: 'Pending Review', value: pendingDocs, color: 'text-amber-600'   },
          { label: 'Drafts',       value: draftDocs,     color: 'text-slate-500'   },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-campus-border p-4 text-center shadow-xs">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-campus-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>📋 Document Priority:</strong> Only <strong>Published</strong> documents are used by the AI Assistant to answer student questions.
        Drafts and pending documents are excluded from retrieval until approved by an authorized staff member.
        Staff-uploaded documents take <strong>priority</strong> over default knowledge base entries.
      </div>

      {/* Upload PDF/CSV Modal */}
      {showUploadModal && (
        <div className="bg-white rounded-xl border border-campus-border shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-campus-navy">Upload Campus Document</h3>
            <button onClick={() => setShowUploadModal(false)} className="text-campus-muted hover:text-campus-navy">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              {uploadSuccess}
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* File Drop Zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                uploadFile ? 'border-campus-blue bg-campus-blue-light' : 'border-campus-border hover:border-campus-blue hover:bg-slate-50'
              }`}
            >
              <input ref={fileRef} type="file" accept=".pdf,.csv" onChange={handleFileSelect} className="hidden" />
              {uploadFile ? (
                <div>
                  <div className="text-campus-blue font-semibold text-sm">{uploadFile.name}</div>
                  <div className="text-campus-muted text-xs mt-1">
                    {uploadFile.name.endsWith('.pdf') ? '📄 PDF Document' : '📊 CSV Spreadsheet'} ·
                    {' '}{(uploadFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              ) : (
                <div>
                  <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm font-semibold text-campus-navy">Click to select a file</p>
                  <p className="text-xs text-campus-muted mt-1">
                    <span className="text-emerald-600 font-medium">✓ PDF</span> and <span className="text-emerald-600 font-medium">✓ CSV</span> only · Max 10 MB
                  </p>
                  <p className="text-xs text-red-500 mt-0.5">✗ DOCX, TXT, XLSX, images and ZIP are rejected</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Examination Ordinance 2024"
                  className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Notes</label>
              <textarea
                value={uploadDescription}
                onChange={e => setUploadDescription(e.target.value)}
                placeholder="Brief description of the document content and applicability…"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Version</label>
              <input
                type="text"
                value={uploadVersion}
                onChange={e => setUploadVersion(e.target.value)}
                placeholder="1.0"
                className="w-32 px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <strong>Workflow:</strong> Uploaded documents start as <strong>Pending Approval</strong>.
              A staff member with approval rights must review and publish before the AI Assistant can use them.
              <strong> Never</strong> publish unreviewed documents automatically.
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading || !uploadFile}
                className="px-5 py-2 rounded-lg bg-campus-blue hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                {uploading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                {uploading ? 'Uploading…' : 'Upload Document'}
              </button>
              <button
                type="button"
                onClick={() => { setShowUploadModal(false); setUploadFile(null); setUploadError(''); setUploadSuccess(''); }}
                className="px-5 py-2 rounded-lg border border-campus-border text-sm font-semibold text-campus-muted hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="bg-white rounded-xl border border-campus-border shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-campus-navy">Manual Knowledge Entry</h3>
            <button onClick={() => setShowManualModal(false)} className="text-campus-muted hover:text-campus-navy">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Policy or document title"
                  className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Source Type</label>
                <select value={newSourceType} onChange={e => setNewSourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue">
                  <option>Official Ordinance</option><option>Academic Circular</option><option>Staff Notice</option>
                  <option>FAQ Entry</option><option>Administrative Policy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Section / Clause</label>
                <input type="text" value={newClause} onChange={e => setNewClause(e.target.value)} placeholder="e.g. Section 4.2"
                  className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Summary</label>
              <input type="text" value={newSummary} onChange={e => setNewSummary(e.target.value)} placeholder="One-line summary for citation display"
                className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Content *</label>
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} required rows={5}
                placeholder="Full verified content that the AI will use to answer student questions…"
                className="w-full px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2 rounded-lg bg-campus-blue hover:bg-blue-700 text-white font-semibold text-sm transition-colors">
                Submit for Approval
              </button>
              <button type="button" onClick={() => setShowManualModal(false)}
                className="px-5 py-2 rounded-lg border border-campus-border text-sm font-semibold text-campus-muted hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-campus-border p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documents…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue"
            />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue">
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-campus-border text-sm focus:outline-none focus:ring-2 focus:ring-campus-blue/20 focus:border-campus-blue">
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <p className="text-xs text-campus-muted mt-2">{filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''} shown</p>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-xl border border-campus-border shadow-xs overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📂</div>
            <p className="text-campus-muted text-sm">No documents match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-campus-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-campus-border">
                {filteredDocs.map(doc => {
                  const docStatus = doc.status || (doc.isActive ? 'published' : 'draft');
                  const isPublished = doc.isActive || docStatus === 'published';
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <span className="text-lg flex-shrink-0">
                            {doc.fileType === 'PDF' ? '📄' : doc.fileType === 'CSV' ? '📊' : '📝'}
                          </span>
                          <div>
                            <p className="font-semibold text-campus-navy text-sm leading-tight">{doc.title}</p>
                            <p className="text-campus-muted text-xs">{doc.code}</p>
                            {doc.uploadedBy && <p className="text-slate-400 text-xs">by {doc.uploadedBy}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-campus-blue-light text-campus-blue font-medium">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={docStatus} />
                      </td>
                      <td className="px-4 py-3 text-xs text-campus-muted whitespace-nowrap">{doc.uploadDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="text-xs px-2 py-1 rounded border border-campus-border text-campus-muted hover:text-campus-navy hover:bg-slate-50 transition-colors"
                          >
                            Preview
                          </button>
                          {!isPublished && (
                            <button
                              onClick={() => handleApprove(doc.id)}
                              className="text-xs px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold transition-colors"
                            >
                              Approve & Publish
                            </button>
                          )}
                          {isPublished && (
                            <button
                              onClick={() => onToggleActive(doc.id)}
                              className="text-xs px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold transition-colors"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-campus-border">
              <div>
                <h3 className="font-bold text-campus-navy">{previewDoc.title}</h3>
                <p className="text-xs text-campus-muted mt-0.5">{previewDoc.code} · {previewDoc.category}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-campus-muted hover:text-campus-navy ml-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-3 text-xs">
                <StatusBadge status={previewDoc.status || (previewDoc.isActive ? 'published' : 'draft')} />
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600">{previewDoc.sourceType}</span>
                {previewDoc.version && <span className="px-2 py-1 rounded bg-blue-50 text-campus-blue">v{previewDoc.version}</span>}
              </div>
              {previewDoc.summary && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Summary</p>
                  <p className="text-sm text-campus-text">{previewDoc.summary}</p>
                </div>
              )}
              {previewDoc.content && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Content Preview</p>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm text-campus-text font-mono text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {previewDoc.content.slice(0, 1000)}{previewDoc.content.length > 1000 ? '…' : ''}
                  </div>
                </div>
              )}
              {!previewDoc.content && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  ⚠️ No text content extracted yet. Start the backend server to enable PDF/CSV text extraction.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
