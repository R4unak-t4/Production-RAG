import React from 'react';
import { Activity, ShieldCheck, Zap, Database, TrendingUp, Cpu } from 'lucide-react';

export default function TopTickerBar({ healthData, revenueSummary }) {
  const arr = revenueSummary?.arr ? `$${(revenueSummary.arr / 1000000).toFixed(2)}M` : '$4.85M';
  const mrr = revenueSummary?.mrr ? `$${(revenueSummary.mrr / 1000).toFixed(1)}K` : '$404.1K';
  const churn = revenueSummary?.churn_rate ? `${revenueSummary.churn_rate}%` : '1.8%';
  const nrr = revenueSummary?.net_retention ? `${revenueSummary.net_retention}%` : '118.5%';

  return (
    <div style={{
      backgroundColor: '#0a0e17',
      borderBottom: '1px solid #1e2a3e',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      color: '#94a3b8'
    }}>
      {/* Fixed Status Badge */}
      <div style={{
        padding: '0 12px',
        height: '100%',
        backgroundColor: '#101726',
        borderRight: '1px solid #1e2a3e',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#ff9f0a',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        zIndex: 2
      }}>
        <Activity size={13} className="glow-amber" />
        <span>LEROY MARKET TICKER</span>
      </div>

      {/* Marquee Container */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div className="ticker-marquee" style={{ gap: '30px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748b' }}>ARR TELEMETRY:</span>
            <span style={{ color: '#00ff87', fontWeight: 'bold' }}>{arr}</span>
            <span style={{ color: '#00ff87', fontSize: '10px' }}>▲ +15.4%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748b' }}>MRR RUN-RATE:</span>
            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>{mrr}</span>
            <span style={{ color: '#00f0ff', fontSize: '10px' }}>▲ +2.8%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748b' }}>GROSS CHURN:</span>
            <span style={{ color: '#ff9f0a', fontWeight: 'bold' }}>{churn}</span>
            <span style={{ color: '#00ff87', fontSize: '10px' }}>▼ -0.5%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748b' }}>NET RETENTION (NRR):</span>
            <span style={{ color: '#00ff87', fontWeight: 'bold' }}>{nrr}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={12} color="#00f0ff" />
            <span style={{ color: '#64748b' }}>VECTOR ENGINE:</span>
            <span style={{ color: '#00f0ff' }}>Supabase pgvector (384-D)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={12} color="#ff9f0a" />
            <span style={{ color: '#64748b' }}>LLM INFERENCE:</span>
            <span style={{ color: '#ff9f0a' }}>Groq LLaMA-3.3-70B</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={12} color="#00ff87" />
            <span style={{ color: '#64748b' }}>LATENCY:</span>
            <span style={{ color: '#00ff87' }}>18ms</span>
          </div>

          {/* Repeat for seamless continuous loop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748b' }}>ARR TELEMETRY:</span>
            <span style={{ color: '#00ff87', fontWeight: 'bold' }}>{arr}</span>
            <span style={{ color: '#00ff87', fontSize: '10px' }}>▲ +15.4%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748b' }}>MRR RUN-RATE:</span>
            <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>{mrr}</span>
          </div>
        </div>
      </div>

      {/* Connection Indicator */}
      <div style={{
        padding: '0 12px',
        height: '100%',
        backgroundColor: '#101726',
        borderLeft: '1px solid #1e2a3e',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        zIndex: 2
      }}>
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: healthData?.status === 'ONLINE' ? '#00ff87' : '#ff9f0a',
          boxShadow: healthData?.status === 'ONLINE' ? '0 0 6px #00ff87' : '0 0 6px #ff9f0a'
        }} />
        <span style={{ color: '#e2e8f0', fontWeight: '600' }}>
          {healthData?.active_db || 'PGVECTOR ACTIVE'}
        </span>
      </div>
    </div>
  );
}
