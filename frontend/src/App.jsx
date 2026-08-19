import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TopTickerBar from './components/TopTickerBar';
import BloombergHeader from './components/BloombergHeader';
import RevenueDashboard from './components/RevenueDashboard';
import ChatbotPanel from './components/ChatbotPanel';
import EmployeePlatform from './components/EmployeePlatform';
import KnowledgeBaseExplorer from './components/KnowledgeBaseExplorer';

export default function App() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [healthData, setHealthData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [copilotQuery, setCopilotQuery] = useState('');

  const fetchHealth = async () => {
    try {
      const res = await axios.get('/api/health');
      setHealthData(res.data);
    } catch (e) {
      console.warn("Health check failed:", e);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await axios.get('/api/revenue');
      setRevenueData(res.data);
    } catch (e) {
      console.warn("Revenue fetch failed:", e);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('/api/employees');
      setEmployees(res.data.employees || []);
    } catch (e) {
      console.warn("Employee fetch failed:", e);
    }
  };

  const fetchKnowledge = async () => {
    try {
      const res = await axios.get('/api/knowledge');
      setDocuments(res.data.documents || []);
    } catch (e) {
      console.warn("Knowledge fetch failed:", e);
    }
  };

  const loadAllData = () => {
    fetchHealth();
    fetchRevenue();
    fetchEmployees();
    fetchKnowledge();
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteCommand = (cmdText) => {
    setCopilotQuery(cmdText);
    setActiveTab('chat');
  };

  const handleAskCopilot = (queryText) => {
    setCopilotQuery(queryText);
    setActiveTab('chat');
  };

  const handleReseedData = async () => {
    if (window.confirm("Reseed baseline enterprise revenue & employee data?")) {
      try {
        await axios.post('/api/seed');
        loadAllData();
      } catch (e) {
        console.error("Reseed failed:", e);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07090e', color: '#e2e8f0' }}>
      
      {/* 1. Bloomberg Top Ticker Marquee */}
      <TopTickerBar
        healthData={healthData}
        revenueSummary={revenueData?.summary}
      />

      {/* 2. Bloomberg Header & Command Prompt */}
      <BloombergHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExecuteCommand={handleExecuteCommand}
        onReseedData={handleReseedData}
      />

      {/* 3. Main Screen Viewport */}
      <main style={{ padding: '16px', maxWidth: '1600px', margin: '0 auto' }}>
        {activeTab === 'revenue' && (
          <RevenueDashboard
            revenueData={revenueData}
            employeesData={employees}
            onAskCopilot={handleAskCopilot}
          />
        )}

        {activeTab === 'chat' && (
          <ChatbotPanel
            initialQuery={copilotQuery}
            onClearQuery={() => setCopilotQuery('')}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeePlatform
            employees={employees}
            onRefreshEmployees={fetchEmployees}
            onAskCopilot={handleAskCopilot}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBaseExplorer
            documents={documents}
            onRefreshDocs={fetchKnowledge}
            onAskCopilot={handleAskCopilot}
          />
        )}
      </main>

    </div>
  );
}
