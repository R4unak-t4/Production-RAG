import React, { useState } from 'react';
import { Database, FileText, UploadCloud, Search, Tag, Cpu, Layers, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function KnowledgeBaseExplorer({ documents, onRefreshDocs, onAskCopilot }) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'revenue_strategy',
    content: '',
    source_type: 'strategy_doc'
  });
  const [uploading, setUploading] = useState(false);

  const filteredDocs = (documents || []).filter(doc => {
    const matchesCategory = filterCategory === 'ALL' || doc.category === filterCategory;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setUploading(true);
    try {
      await axios.post('/api/knowledge', formData);
      setShowUploadModal(false);
      setFormData({
        title: '',
        category: 'revenue_strategy',
        content: '',
        source_type: 'strategy_doc'
      });
      if (onRefreshDocs) onRefreshDocs();
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Error uploading document: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Control Header */}
      <div className="bb-panel" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Category Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>CATEGORIES:</span>
            {['ALL', 'revenue_strategy', 'employee_intel', 'pricing_policy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '3px',
                  border: '1px solid',
                  borderColor: filterCategory === cat ? '#a855f7' : '#1e2a3e',
                  backgroundColor: filterCategory === cat ? 'rgba(168, 85, 247, 0.15)' : '#0a0e17',
                  color: filterCategory === cat ? '#a855f7' : '#94a3b8',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="bb-btn"
            style={{ borderColor: '#a855f7', color: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
          >
            <UploadCloud size={14} />
            <span>INGEST NEW VECTOR DOC</span>
          </button>
        </div>

        {/* Vector Search Input */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={14} color="#64748b" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vector knowledge chunks e.g. 'pricing tier', 'Sarah Jenkins', 'annual expansion'..."
            className="bb-input"
          />
        </div>
      </div>

      {/* Vector Document Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '12px' }}>
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bb-panel" style={{ padding: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ fontWeight: '700', color: '#fff', fontSize: '13px' }}>
                {doc.title}
              </div>
              <span className={`bb-badge ${
                doc.category === 'revenue_strategy' ? 'bb-badge-gold' :
                doc.category === 'employee_intel' ? 'bb-badge-green' : 'bb-badge-cyan'
              }`}>
                {doc.category}
              </span>
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', lineHeight: '1.5', maxHeight: '100px', overflowY: 'auto' }}>
              {doc.content}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1e2a3e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cpu size={11} color="#a855f7" />
                <span>384-D Vector Indexed</span>
              </div>
              <button
                onClick={() => onAskCopilot(`Explain context and action items for vector doc '${doc.title}'`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00f0ff',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Sparkles size={11} />
                <span>QUERY IN COPILOT</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="bb-panel" style={{ width: '520px', maxWidth: '90%' }}>
            <div className="bb-panel-header">
              <span>📄 INGEST DOCUMENT INTO PGVECTOR KNOWLEDGE BASE</span>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: '#ff9f0a', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div className="bb-panel-body">
              <form onSubmit={handleUploadDocument} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Document Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bb-input"
                    placeholder="e.g. Q3 Enterprise Upsell Policy"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="bb-input"
                    >
                      <option value="revenue_strategy">revenue_strategy</option>
                      <option value="employee_intel">employee_intel</option>
                      <option value="pricing_policy">pricing_policy</option>
                      <option value="market_benchmarks">market_benchmarks</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Source Type</label>
                    <input
                      type="text"
                      value={formData.source_type}
                      onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                      className="bb-input"
                      placeholder="e.g. playbook, pdf, meeting_notes"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Document Content (Text Chunks for Vector Embedding)</label>
                  <textarea
                    rows={6}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bb-input"
                    placeholder="Paste strategy guidelines, pricing matrix details, or market benchmark notes..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowUploadModal(false)} className="bb-btn" style={{ borderColor: '#64748b', color: '#94a3b8' }}>
                    CANCEL
                  </button>
                  <button type="submit" disabled={uploading} className="bb-btn" style={{ borderColor: '#a855f7', color: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
                    <UploadCloud size={14} />
                    <span>{uploading ? 'GENERATING EMBEDDINGS...' : 'INGEST & EMBED VECTORS'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
