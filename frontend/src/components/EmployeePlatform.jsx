import React, { useState } from 'react';
import { Users, UserPlus, Trash2, Database, Award, DollarSign, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function EmployeePlatform({ employees, onRefreshEmployees, onAskCopilot }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'Sales',
    salary: 140000,
    performance_score: 9.0,
    revenue_generated: 1200000,
    skills: 'Enterprise SaaS, Contract Closing',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    setSubmitting(true);
    setSyncStatus(null);

    try {
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        performance_score: Number(formData.performance_score),
        revenue_generated: Number(formData.revenue_generated),
        skills: skillsArray
      };

      const res = await axios.post('/api/employees', payload);
      setSyncStatus(`✅ ${formData.name} added & auto-embedded into Supabase pgvector KB!`);
      setShowAddModal(false);
      setFormData({
        name: '',
        role: '',
        department: 'Sales',
        salary: 140000,
        performance_score: 9.0,
        revenue_generated: 1200000,
        skills: 'Enterprise SaaS, Contract Closing',
        bio: ''
      });
      if (onRefreshEmployees) onRefreshEmployees();
    } catch (err) {
      console.error("Failed to add employee:", err);
      setSyncStatus(`❌ Error adding employee: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (empId, empName) => {
    if (!window.confirm(`Delete employee record for ${empName}?`)) return;
    try {
      await axios.delete(`/api/employees/${empId}`);
      if (onRefreshEmployees) onRefreshEmployees();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Top Banner: RAG Auto-Sync Information */}
      <div className="bb-panel" style={{ padding: '12px 16px', backgroundColor: '#090d16', borderColor: '#00ff87' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="#00ff87" className="glow-green" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#00ff87', display: 'flex', alignItems: 'center', gap: '8px' }}>
                INTEGRATED RAG VECTOR KNOWLEDGE FEED ACTIVE
                <span className="bb-badge bb-badge-green">AUTO-SYNC ON</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                All employee profiles, revenue targets, and skill matrices automatically generate 384-D vector embeddings into Supabase pgvector for Leroy AI Chatbot retrieval.
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bb-btn bb-btn-green"
          >
            <UserPlus size={14} />
            <span>ADD EMPLOYEE & AUTO-EMBED</span>
          </button>
        </div>

        {syncStatus && (
          <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '3px', backgroundColor: '#041d13', color: '#00ff87', fontSize: '11px' }}>
            {syncStatus}
          </div>
        )}
      </div>

      {/* Main Employee Table Panel */}
      <div className="bb-panel">
        <div className="bb-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={15} color="#ff9f0a" />
            <span>EMPLOYEE PLATFORM & REVENUE IMPACT DIRECTORY ({employees?.length || 0} MEMBERS)</span>
          </div>
          <span className="bb-badge bb-badge-gold">PGVECTOR INDEXED</span>
        </div>

        <div className="bb-panel-body" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Employee / Role</th>
                <th>Department</th>
                <th>Salary ($)</th>
                <th>Revenue Impact ($ ARR)</th>
                <th>Performance</th>
                <th>Skills & Vector Intel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(employees || []).map((emp) => {
                const roi = emp.salary > 0 ? (emp.revenue_generated / emp.salary).toFixed(1) : 'N/A';
                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{emp.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{emp.role}</div>
                    </td>
                    <td>
                      <span className="bb-badge bb-badge-cyan">{emp.department}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      ${(emp.salary || 0).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#00ff87', fontFamily: 'var(--font-mono)' }}>
                        ${(emp.revenue_generated || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '10px', color: '#ff9f0a' }}>
                        ROI Multiple: {roi}x
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff9f0a', fontWeight: 'bold' }}>
                        <Award size={13} />
                        <span>{emp.performance_score || 8.5} / 10</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '10px', color: '#94a3b8', maxWidth: '280px' }}>
                        {emp.skills && emp.skills.length > 0 ? emp.skills.join(', ') : 'SaaS Strategy'}
                      </div>
                      <div style={{ fontSize: '9px', color: '#00ff87', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <ShieldCheck size={10} />
                        <span>Vector Indexed in KB</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => onAskCopilot(`Evaluate ${emp.name}'s revenue performance in ${emp.department} department.`)}
                          className="bb-btn"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                          title="Ask Copilot about Employee"
                        >
                          <Sparkles size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          style={{
                            padding: '3px 6px',
                            borderRadius: '3px',
                            border: '1px solid #ff3b30',
                            backgroundColor: 'rgba(255, 59, 48, 0.1)',
                            color: '#ff3b30',
                            cursor: 'pointer'
                          }}
                          title="Delete Employee"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="bb-panel" style={{ width: '500px', maxWidth: '90%' }}>
            <div className="bb-panel-header">
              <span>➕ ADD EMPLOYEE & AUTO-EMBED INTO RAG KB</span>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#ff9f0a', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div className="bb-panel-body">
              <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bb-input"
                    placeholder="e.g. Rachel Vance"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Role Title</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="bb-input"
                      placeholder="e.g. Strategic Enterprise Rep"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="bb-input"
                    >
                      <option value="Sales">Sales</option>
                      <option value="Strategy & Ops">Strategy & Ops</option>
                      <option value="Customer Success">Customer Success</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Salary ($)</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="bb-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Generated Revenue ($)</label>
                    <input
                      type="number"
                      value={formData.revenue_generated}
                      onChange={(e) => setFormData({ ...formData, revenue_generated: e.target.value })}
                      className="bb-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8' }}>Rating (1-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={formData.performance_score}
                      onChange={(e) => setFormData({ ...formData, performance_score: e.target.value })}
                      className="bb-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Skills (comma separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="bb-input"
                    placeholder="Enterprise closing, Contract Negotiation, LangGraph"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8' }}>Background Bio & Achievements</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bb-input"
                    placeholder="Closed $1.5M ARR expansion across key accounts..."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="bb-btn" style={{ borderColor: '#64748b', color: '#94a3b8' }}>
                    CANCEL
                  </button>
                  <button type="submit" disabled={submitting} className="bb-btn bb-btn-green">
                    <CheckCircle2 size={14} />
                    <span>{submitting ? 'EMBEDDING VECTORS...' : 'SAVE & AUTO-EMBED'}</span>
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
