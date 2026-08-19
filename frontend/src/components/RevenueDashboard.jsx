import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Calculator, PieChart, ShieldAlert } from 'lucide-react';

export default function RevenueDashboard({ revenueData, employeesData, onAskCopilot }) {
  const summary = revenueData?.summary || {
    arr: 4850000,
    mrr: 404166,
    churn_rate: 1.8,
    net_retention: 118.5,
    cac: 8500,
    ltv: 125000
  };

  // Pricing Simulator Local State
  const [stdPrice, setStdPrice] = useState(99);
  const [proPrice, setProPrice] = useState(249);
  const [entPrice, setEntPrice] = useState(499);
  const [expansionRate, setExpansionRate] = useState(15); // %

  const simulatedARRDelta = Math.round(
    (summary.arr * (expansionRate / 100)) + 
    ((proPrice - 199) * 1200) + 
    ((entPrice - 399) * 350)
  );
  const simulatedNewARR = summary.arr + simulatedARRDelta;

  // Chart Data Preparation
  const historicalData = [
    { period: '2025-Q1', arr: 3100000, mrr: 258333, churn: 2.8 },
    { period: '2025-Q2', arr: 3600000, mrr: 300000, churn: 2.4 },
    { period: '2025-Q3', arr: 3950000, mrr: 329166, churn: 2.1 },
    { period: '2025-Q4', arr: 4200000, mrr: 350000, churn: 2.0 },
    { period: '2026-Q1', arr: 4500000, mrr: 375000, churn: 1.9 },
    { period: '2026-Q2 Current', arr: summary.arr, mrr: summary.mrr, churn: summary.churn_rate },
  ];

  const employeeContributions = (employeesData || [])
    .map(e => ({
      name: e.name.split(' ')[0],
      fullName: e.name,
      department: e.department,
      revenue: e.revenue_generated || 0,
      salary: e.salary || 100000,
      roi: e.salary > 0 ? ((e.revenue_generated || 0) / e.salary).toFixed(1) : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* 1. TOP METRICS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        
        {/* ARR Card */}
        <div className="bb-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>ANNUAL RECURRING (ARR)</span>
            <DollarSign size={13} color="#00ff87" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#00ff87', marginTop: '4px' }}>
            ${(summary.arr / 1000000).toFixed(2)}M
          </div>
          <div style={{ fontSize: '10px', color: '#00ff87', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ArrowUpRight size={12} />
            <span>+15.4% YoY Target</span>
          </div>
        </div>

        {/* MRR Card */}
        <div className="bb-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>MONTHLY RECURRING (MRR)</span>
            <TrendingUp size={13} color="#00f0ff" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#00f0ff', marginTop: '4px' }}>
            ${(summary.mrr / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: '10px', color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ArrowUpRight size={12} />
            <span>+2.8% MoM Acceleration</span>
          </div>
        </div>

        {/* NRR Card */}
        <div className="bb-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>NET RETENTION (NRR)</span>
            <ArrowUpRight size={13} color="#ff9f0a" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#ff9f0a', marginTop: '4px' }}>
            {summary.net_retention}%
          </div>
          <div style={{ fontSize: '10px', color: '#ff9f0a', marginTop: '4px' }}>
            Expansion Velocity: High
          </div>
        </div>

        {/* Churn Card */}
        <div className="bb-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>GROSS REVENUE CHURN</span>
            <ShieldAlert size={13} color="#ff3b30" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#ff9f0a', marginTop: '4px' }}>
            {summary.churn_rate}%
          </div>
          <div style={{ fontSize: '10px', color: '#00ff87', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <ArrowDownRight size={12} />
            <span>Target: &lt; 2.0% (Achieved)</span>
          </div>
        </div>

        {/* LTV/CAC Card */}
        <div className="bb-panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
            <span>LTV / CAC MULTIPLE</span>
            <PieChart size={13} color="#a855f7" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>
            {(summary.ltv / summary.cac).toFixed(1)}x
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
            CAC: ${summary.cac} | LTV: ${summary.ltv.toLocaleString()}
          </div>
        </div>

      </div>

      {/* 2. MAIN CHARTS & SIMULATOR GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '14px' }}>
        
        {/* ARR Trajectory Chart Panel */}
        <div className="bb-panel">
          <div className="bb-panel-header">
            <span>📊 ARR GROWTH TELEMETRY (FY25 - FY26)</span>
            <span className="bb-badge bb-badge-green">REALTIME ENGINE</span>
          </div>
          <div className="bb-panel-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff87" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00ff87" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3e" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d121d', borderColor: '#ff9f0a', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`$${(val/1000000).toFixed(2)}M`, 'ARR']}
                />
                <Area type="monotone" dataKey="arr" stroke="#00ff87" strokeWidth={2} fillOpacity={1} fill="url(#colorArr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Revenue Contribution Chart Panel */}
        <div className="bb-panel">
          <div className="bb-panel-header">
            <span>👥 REVENUE GENERATED BY EMPLOYEE ($ ARR)</span>
            <button
              onClick={() => onAskCopilot("Which employee generates highest revenue and how can we optimize team alignment?")}
              className="bb-btn bb-btn-cyan"
              style={{ padding: '2px 8px', fontSize: '10px' }}
            >
              ANALYZE VIA LEROY
            </button>
          </div>
          <div className="bb-panel-body" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeContributions} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3e" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d121d', borderColor: '#00f0ff', color: '#fff', fontSize: '12px' }}
                  formatter={(val, name, item) => [`$${val.toLocaleString()}`, `Revenue (${item.payload.department})`]}
                />
                <Bar dataKey="revenue" radius={[3, 3, 0, 0]}>
                  {employeeContributions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ff9f0a' : index === 1 ? '#00f0ff' : '#00ff87'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. INTERACTIVE PRICING & EXPANSION SIMULATOR */}
      <div className="bb-panel">
        <div className="bb-panel-header">
          <span>⚡ INTERACTIVE LEROY REVENUE SIMULATOR (PRICING & UPSELL OPTIMIZER)</span>
          <span className="bb-badge bb-badge-gold">SCENARIO PLANNER</span>
        </div>
        <div className="bb-panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Standard Seat Price / mo</span>
                <span style={{ color: '#ff9f0a', fontWeight: 'bold' }}>${stdPrice}</span>
              </div>
              <input
                type="range"
                min="49"
                max="149"
                value={stdPrice}
                onChange={(e) => setStdPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ff9f0a', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Pro Seat Price (Vector RAG) / mo</span>
                <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>${proPrice}</span>
              </div>
              <input
                type="range"
                min="199"
                max="399"
                value={proPrice}
                onChange={(e) => setProPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00f0ff', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Enterprise Custom Seat / mo</span>
                <span style={{ color: '#00ff87', fontWeight: 'bold' }}>${entPrice}</span>
              </div>
              <input
                type="range"
                min="399"
                max="899"
                value={entPrice}
                onChange={(e) => setEntPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00ff87', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                <span>Target Expansion Upsell %</span>
                <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{expansionRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={expansionRate}
                onChange={(e) => setExpansionRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Simulation Output Card */}
          <div style={{
            backgroundColor: '#07090e',
            border: '1px solid #1e2a3e',
            borderRadius: '4px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                SIMULATED PROJECTED ARR
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: simulatedARRDelta >= 0 ? '#00ff87' : '#ff3b30', marginTop: '4px' }}>
                ${(simulatedNewARR / 1000000).toFixed(2)}M
              </div>
              <div style={{ fontSize: '12px', color: '#ff9f0a', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={14} />
                <span>Incremental Delta: +${simulatedARRDelta.toLocaleString()} ARR</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e2a3e', fontSize: '11px', color: '#94a3b8' }}>
              <div>• Pro RAG seat adoption yields <strong>+${((proPrice - 199) * 1200 * 12).toLocaleString()}</strong> annualized.</div>
              <div>• Target NRR post-simulation: <strong>{(summary.net_retention + (expansionRate * 0.4)).toFixed(1)}%</strong></div>
            </div>

            <button
              onClick={() => onAskCopilot(`How can Sarah Jenkins and sales team execute this pricing strategy to reach $${(simulatedNewARR/1000000).toFixed(2)}M ARR?`)}
              className="bb-btn"
              style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
            >
              <Calculator size={14} />
              <span>SEND STRATEGY TO LEROY COPILOT</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
