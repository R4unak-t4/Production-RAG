import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Database, Sparkles, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

export default function ChatbotPanel({ initialQuery, onClearQuery }) {
  const [messages, setMessages] = useState([
    {
      sender: 'leroy',
      text: "### ⚡ LEROY AI REVENUE & HUMAN CAPITAL COPILOT ONLINE\n\nI am connected to **Supabase pgvector Knowledge Base** and **Groq LLaMA-3.3 LLM Engine**.\n\nAsk me anything regarding:\n- 📈 **Revenue Optimization**: ARR/MRR acceleration, dynamic pricing, churn mitigation.\n- 👥 **Human Capital Intelligence**: Employee revenue impact, top sales contributors, skills pairing.\n- 📑 **Knowledge Base RAG**: Corporate strategy playbooks & vector indexed documentation.",
      execution_steps: [
        "[System] Initialized Leroy AI Copilot v2.4",
        "[Vector DB] Connected to Supabase pgvector store (384-D)",
        "[LLM Engine] Groq LLaMA-3.3-70B pipeline ready"
      ],
      retrieved_docs: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
      if (onClearQuery) onClearQuery();
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { query: textToSend });
      const data = res.data;

      const leroyMsg = {
        sender: 'leroy',
        text: data.response || "No response received from agent.",
        execution_steps: data.execution_steps || [],
        retrieved_docs: data.retrieved_docs || [],
        intent: data.intent || "GENERAL_RAG"
      };

      setMessages(prev => [...prev, leroyMsg]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages(prev => [...prev, {
        sender: 'leroy',
        text: `⚠️ **System Alert**: Failed to reach Leroy AI backend. (${err.message}). Ensure FastAPI engine is running on port 8000.`,
        execution_steps: ["❌ API connection error"],
        retrieved_docs: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Which employee drives highest revenue in Sales?",
    "How can we optimize ARR from $4.85M to $6.5M?",
    "What pricing model minimizes SaaS churn?",
    "Who should lead our new RAG enterprise rollout?"
  ];

  return (
    <div className="bb-panel" style={{ height: 'calc(100vh - 170px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="bb-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={16} color="#00f0ff" className="glow-cyan" />
          <span>LEROY AI LANGGRAPH EXECUTIVE COPILOT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="bb-badge bb-badge-cyan">GROQ LLaMA-3.3 70B</span>
          <span className="bb-badge bb-badge-green">PGVECTOR RAG</span>
        </div>
      </div>

      {/* Chat History Messages */}
      <div className="bb-panel-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            
            {/* Sender Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
              {msg.sender === 'user' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9f0a', fontWeight: 'bold' }}>
                  <User size={14} />
                  <span>EXECUTIVE USER</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f0ff', fontWeight: 'bold' }}>
                  <Bot size={14} />
                  <span>LEROY AI ENGINE</span>
                  {msg.intent && (
                    <span className="bb-badge bb-badge-gold" style={{ fontSize: '9px' }}>
                      INTENT: {msg.intent}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Message Bubble Container with Markdown Rendering */}
            <div className="bb-markdown" style={{
              backgroundColor: msg.sender === 'user' ? '#0f172a' : '#080c14',
              border: '1px solid',
              borderColor: msg.sender === 'user' ? '#1e293b' : '#101e36',
              borderRadius: '4px',
              padding: '12px 14px',
              color: '#e2e8f0',
              fontSize: '12px',
              lineHeight: '1.6'
            }}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>

            {/* LangGraph Trace & Vector KB Accordion (For Leroy Responses) */}
            {msg.sender === 'leroy' && (msg.execution_steps?.length > 0 || msg.retrieved_docs?.length > 0) && (
              <div style={{
                backgroundColor: '#05070c',
                border: '1px solid #162032',
                borderRadius: '3px',
                padding: '8px 10px',
                marginTop: '4px',
                fontSize: '11px',
                color: '#64748b'
              }}>
                {/* Execution Trace */}
                {msg.execution_steps?.length > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ color: '#00ff87', fontWeight: 'bold', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={11} />
                      <span>LANGGRAPH STATEGRAPH TRACE:</span>
                    </div>
                    {msg.execution_steps.map((step, sIdx) => (
                      <div key={sIdx} style={{ color: '#94a3b8', fontSize: '10px', fontFamily: 'var(--font-mono)', marginLeft: '14px' }}>
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                {/* Vector KB Matches */}
                {msg.retrieved_docs?.length > 0 && (
                  <div>
                    <div style={{ color: '#00f0ff', fontWeight: 'bold', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Database size={11} />
                      <span>RETRIEVED SUPABASE PGVECTOR CONTEXT ({msg.retrieved_docs.length} VECTORS):</span>
                    </div>
                    {msg.retrieved_docs.map((doc, dIdx) => (
                      <div key={dIdx} style={{ color: '#64748b', fontSize: '10px', marginLeft: '14px', marginTop: '2px' }}>
                        • <strong style={{ color: '#e2e8f0' }}>{doc.title}</strong> (Score: <span style={{ color: '#00ff87' }}>{doc.similarity || 0.92}</span>)
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#00f0ff' }}>
            <Cpu size={16} className="animate-spin glow-cyan" />
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
              LANGGRAPH ROUTER & GROQ LLM INFERRING...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Shortcuts */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#0a0e17',
        borderTop: '1px solid #1e2a3e',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
          PROMPT SHORTCUTS:
        </span>
        {quickPrompts.map((qp, qIdx) => (
          <button
            key={qIdx}
            onClick={() => handleSendMessage(qp)}
            style={{
              padding: '4px 8px',
              borderRadius: '3px',
              border: '1px solid #1e2a3e',
              backgroundColor: '#101726',
              color: '#94a3b8',
              fontSize: '10px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)'
            }}
            onMouseOver={(e) => { e.target.style.borderColor = '#00f0ff'; e.target.style.color = '#00f0ff'; }}
            onMouseOut={(e) => { e.target.style.borderColor = '#1e2a3e'; e.target.style.color = '#94a3b8'; }}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message Input Footer */}
      <div style={{ padding: '10px 14px', backgroundColor: '#0d121d', borderTop: '1px solid #1e2a3e' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Leroy AI about revenue optimization, employees, or strategy documents..."
            className="bb-input"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bb-btn bb-btn-cyan"
            style={{ padding: '8px 16px' }}
          >
            <Send size={14} />
            <span>SEND</span>
          </button>
        </form>
      </div>

    </div>
  );
}
