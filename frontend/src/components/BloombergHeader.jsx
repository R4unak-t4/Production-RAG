import React, { useState } from 'react';
import { Terminal, RefreshCw, Command, BarChart3, Bot, Users, Database, Sparkles } from 'lucide-react';

export default function BloombergHeader({ activeTab, setActiveTab, onExecuteCommand, onReseedData }) {
  const [commandInput, setCommandInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commandInput.trim()) {
      onExecuteCommand(commandInput);
      setCommandInput('');
    }
  };

  return (
    <header style={{
      backgroundColor: '#0d121d',
      borderBottom: '1px solid #1e2a3e',
      padding: '10px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* Top Row: Title + Quick Commands */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 159, 10, 0.15)',
            border: '1px solid #ff9f0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff9f0a'
          }}>
            <Terminal size={18} className="glow-amber" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '0.08em', color: '#ff9f0a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              LEROY AI <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '2px', backgroundColor: 'rgba(0,240,255,0.15)', color: '#00f0ff', border: '1px solid #00f0ff' }}>v2.4 PRO</span>
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              REVENUE OPTIMIZATION & HUMAN CAPITAL VECTOR TERMINAL
            </div>
          </div>
        </div>

        {/* Bloomberg Navigation F-Key Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('revenue')}
            style={{
              padding: '6px 12px',
              borderRadius: '3px',
              border: '1px solid',
              borderColor: activeTab === 'revenue' ? '#ff9f0a' : '#1e2a3e',
              backgroundColor: activeTab === 'revenue' ? 'rgba(255, 159, 10, 0.15)' : '#0a0e17',
              color: activeTab === 'revenue' ? '#ff9f0a' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BarChart3 size={13} />
            <span>[F1] REVENUE</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '6px 12px',
              borderRadius: '3px',
              border: '1px solid',
              borderColor: activeTab === 'chat' ? '#00f0ff' : '#1e2a3e',
              backgroundColor: activeTab === 'chat' ? 'rgba(0, 240, 255, 0.15)' : '#0a0e17',
              color: activeTab === 'chat' ? '#00f0ff' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Bot size={13} />
            <span>[F2] LEROY COPILOT</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            style={{
              padding: '6px 12px',
              borderRadius: '3px',
              border: '1px solid',
              borderColor: activeTab === 'employees' ? '#00ff87' : '#1e2a3e',
              backgroundColor: activeTab === 'employees' ? 'rgba(0, 255, 135, 0.15)' : '#0a0e17',
              color: activeTab === 'employees' ? '#00ff87' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={13} />
            <span>[F3] EMPLOYEES</span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            style={{
              padding: '6px 12px',
              borderRadius: '3px',
              border: '1px solid',
              borderColor: activeTab === 'knowledge' ? '#a855f7' : '#1e2a3e',
              backgroundColor: activeTab === 'knowledge' ? 'rgba(168, 85, 247, 0.15)' : '#0a0e17',
              color: activeTab === 'knowledge' ? '#a855f7' : '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Database size={13} />
            <span>[F4] VECTOR KB</span>
          </button>

          <button
            onClick={onReseedData}
            title="Reset to Demo Data"
            style={{
              padding: '6px 10px',
              borderRadius: '3px',
              border: '1px solid #1e2a3e',
              backgroundColor: '#0a0e17',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Bottom Command Prompt Bar */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          backgroundColor: '#07090e',
          border: '1px solid #1e2a3e',
          borderRadius: '3px',
          padding: '4px 10px',
          color: '#ff9f0a',
          fontWeight: 'bold',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap'
        }}>
          <Command size={12} />
          <span>RUN &gt;</span>
        </div>

        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type executive query or command e.g. 'OPT > REVENUE_BOOST', 'Who generates highest ARR?', 'How to lower churn?'"
          className="bb-input"
          style={{ flex: 1 }}
        />

        <button type="submit" className="bb-btn">
          <Sparkles size={13} />
          <span>EXECUTE</span>
        </button>
      </form>
    </header>
  );
}
