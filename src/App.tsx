import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { PreventPage } from './components/PreventPage.tsx';
import { RespondPage } from './components/RespondPage.tsx';
import { ReplayPage } from './components/ReplayPage.tsx';
import { TimelinePage } from './components/TimelinePage.tsx';
import { StatsPage } from './components/StatsPage.tsx';
import { SystemStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'prevent' | 'respond' | 'replay' | 'timeline' | 'stats'>('prevent');
  const [memoryOn, setMemoryOn] = useState<boolean>(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Fetch status from server backend
  const fetchStatus = () => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus(data);
      })
      .catch((err) => console.error('Failed to fetch system status:', err));
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Command Center Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        memoryOn={memoryOn}
        setMemoryOn={setMemoryOn}
        systemStatus={systemStatus}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'prevent' && <PreventPage memoryOn={memoryOn} />}
        {activeTab === 'respond' && (
          <RespondPage
            memoryOn={memoryOn}
            onOutcomeRecorded={fetchStatus}
          />
        )}
        {activeTab === 'replay' && <ReplayPage />}
        {activeTab === 'timeline' && <TimelinePage />}
        {activeTab === 'stats' && <StatsPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        INCIDENT MEMORY GUARD &bull; PREVENT BEFORE RESPOND &bull; POWERED BY HINDSIGHT VECTOR BANK & GROQ AI
      </footer>
    </div>
  );
}
