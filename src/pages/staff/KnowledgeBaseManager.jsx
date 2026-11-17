import React, { useState } from 'react';

export default function KnowledgeBaseManager({ documents, onToggleActive, onAddDocument }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);

  // Form state for adding new doc
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Examinations');
  const [newSourceType, setNewSourceType] = useState('Official Ordinance');
  const [newClause, setNewClause] = useState('');
  const [newPage, setNewPage] = useState('Page 1');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.code.toLowerCase().includes(q) ||
      doc.clause.toLowerCase().includes(q) ||
      (doc.keywords && doc.keywords.some(k => k.toLowerCase().includes(q)))
    );
  });

  const handleAddNewDocSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDoc = {
      id: `DOC-CUSTOM-${Date.now()}`,
      code: `MAN-${newCategory.slice(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      category: newCategory,
      sourceType: newSourceType,
      uploadDate: new Date().toISOString().split('T')[0],
      clause: newClause || 'Section 1.1 - General Policy',
      pageNumber: newPage || 'Page 1',
      buildingId: 'b-chanakya',
      isActive: true,
      summary: newSummary || newContent.slice(0, 140) + '...',
      content: newContent.trim(),
      keywords: newTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    };

    onAddDocument(newDoc);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewClause('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="bg-white p-6 rounded-2xl border border-campus-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              KNOWLEDGE REPOSITORY
            </span>
            <span className="text-xs text-slate-400">Section 5 & 6 Requirements</span>
          </div>
          <h2 className="text-xl font-bold text-campus-navy">
            Institutional Document & Ordinance Manager
          </h2>
          <p className="text-xs text-campus-muted mt-1 max-w-xl">
            Manage verified source documents, examination ordinances, fee circulars, and hostel bylaws that power AI answer retrieval.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-campus-blue">
              {documents.length}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Total Documents
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-campus-blue hover:bg-campus-blue-hover text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Campus Document</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-campus-border shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, code, clause or keyword..."
            className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-campus-blue"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'Examinations', 'Fees', 'Hostel', 'Academics', 'Directory'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-campus-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Records Table */}
      <div className="bg-white border border-campus-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-campus-border text-[11px] font-bold text-campus-navy uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Clause / Section</th>
                <th className="py-3 px-4">Source Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Title & Code */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-campus-navy text-xs">
                      {doc.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {doc.code} · {doc.uploadDate}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.category === 'Examinations' ? 'bg-blue-100 text-blue-800' :
                      doc.category === 'Fees' ? 'bg-amber-100 text-amber-800' :
                      doc.category === 'Hostel' ? 'bg-purple-100 text-purple-800' :
                      doc.category === 'Academics' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {doc.category}
                    </span>
                  </td>

                  {/* Clause */}
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <div>{doc.clause}</div>
                    <div className="text-[10px] text-slate-400">{doc.pageNumber}</div>
                  </td>

                  {/* Source Type */}
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {doc.sourceType}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleActive(doc.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        doc.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {doc.isActive ? 'Active in KB' : 'Disabled'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="text-campus-blue hover:underline font-semibold"
                    >
                      Inspect Excerpt →
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Excerpt Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-campus-border">
            <div className="flex items-start justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-campus-blue rounded">
                  {selectedDocForPreview.code}
                </span>
                <h3 className="text-base font-bold text-campus-navy mt-1">
                  {selectedDocForPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 pb-2 border-b">
                <span>Clause: <strong className="text-slate-800">{selectedDocForPreview.clause}</strong></span>
                <span>Page: <strong className="text-slate-800">{selectedDocForPreview.pageNumber}</strong></span>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Document Summary:</span>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedDocForPreview.summary}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Full Ingested Text Excerpt:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed max-h-48 overflow-y-auto font-mono text-[11px]">
                  {selectedDocForPreview.content}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 bg-campus-navy text-white text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-campus-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  NEW REPOSITORY ENTRY
                </span>
                <h3 className="text-base font-bold text-campus-navy mt-1">
                  Ingest Official Campus Document
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewDocSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Revised Winter Break Schedule 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="Examinations">Examinations</option>
                    <option value="Fees">Fees & Finance</option>
                    <option value="Hostel">Hostel & Residence</option>
                    <option value="Academics">Academics</option>
                    <option value="Directory">Directory & Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Type:</label>
                  <input
                    type="text"
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value)}
                    placeholder="e.g. Official Ordinance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clause / Section:</label>
                  <input
                    type="text"
                    value={newClause}
                    onChange={(e) => setNewClause(e.target.value)}
                    placeholder="e.g. Clause 3.2 - Winter Recess"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Page Reference:</label>
                  <input
                    type="text"
                    value={newPage}
                    onChange={(e) => setNewPage(e.target.value)}
                    placeholder="e.g. Page 4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Summary:</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Concise summary for AI retrieval matching"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Document Content / Ordinance Text:</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste official document paragraphs here..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-800 font-mono text-[11px]"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Ingest & Activate in Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
