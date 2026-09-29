import React from 'react';
import { 
  ShieldAlert, 
  BrainCircuit, 
  Cpu, 
  Activity, 
  Database, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  History, 
  BarChart3, 
  Radio
} from 'lucide-react';
import { SystemStatus } from '../types.ts';

interface NavbarProps {
  activeTab: 'prevent' | 'respond' | 'replay' | 'timeline' | 'stats';
  setActiveTab: (tab: 'prevent' | 'respond' | 'replay' | 'timeline' | 'stats') => void;
  memoryOn: boolean;
  setMemoryOn: (val: boolean) => void;
  systemStatus: SystemStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  memoryOn,
  setMemoryOn,
  systemStatus,
}) => {
  const isHindsightConnected = systemStatus?.hindsight?.connected ?? false;
  const isGroqConnected = systemStatus?.groq?.connected ?? false;
  const memoryCount = systemStatus?.memoryCount ?? 25;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner Status Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 border-b border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Status 1: Hindsight */}
          <div className="flex items-center gap-1.5" title={systemStatus?.hindsight?.reason || 'Hindsight Status'}>
            <BrainCircuit className={`w-3.5 h-3.5 ${isHindsightConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-slate-300 font-medium">Hindsight:</span>
            {isHindsightConnected ? (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                Connected
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold" title={systemStatus?.hindsight?.reason}>
                Offline ({systemStatus?.hindsight?.reason?.includes('API_KEY') ? 'Key Unset / Local Engine' : 'Offline'})
              </span>
            )}
          </div>

          {/* Status 2: Groq */}
          <div className="flex items-center gap-1.5" title={systemStatus?.groq?.reason || 'Groq Status'}>
            <Cpu className={`w-3.5 h-3.5 ${isGroqConnected ? 'text-cyan-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="text-slate-300 font-medium">Groq AI:</span>
            {isGroqConnected ? (
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-semibold">
                Connected
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold" title={systemStatus?.groq?.reason}>
                Offline ({systemStatus?.groq?.reason?.includes('API_KEY') ? 'Key Unset / Local Engine' : 'Offline'})
              </span>
            )}
          </div>

          {/* Status 3: Stats Engine */}
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium">Stats Engine:</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-semibold">
              Ready
            </span>
          </div>

          {/* Status 4: Memory Records Count */}
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300 font-medium">Memory Records:</span>
            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono font-semibold">
              {memoryCount}
            </span>
          </div>
        </div>

        {/* Right side controls: Mode & Memory Switch */}
        <div className="flex items-center gap-4">
          {/* Mode Indicator */}
          <div className="flex items-center gap-1.5">
            <Radio className={`w-3.5 h-3.5 ${isHindsightConnected && isGroqConnected ? 'text-emerald-400' : 'text-purple-400'}`} />
            <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider ${
              isHindsightConnected && isGroqConnected
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              {isHindsightConnected && isGroqConnected ? 'LIVE MODE' : 'DEMO MODE'}
            </span>
          </div>

          {/* REAL Memory ON / OFF Switch */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Memory Engine:</span>
            <button
              onClick={() => setMemoryOn(!memoryOn)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                memoryOn
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
              title="Toggle real server-side Hindsight memory recall on or off"
            >
              {memoryOn ? (
                <>
                  <ToggleRight className="w-4 h-4 text-cyan-200" />
                  <span>MEMORY ON</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-slate-400" />
                  <span>MEMORY OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 text-cyan-400 shadow-inner">
            <ShieldAlert className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              INCIDENT MEMORY GUARD
            </h1>
            <p className="text-xs font-medium text-slate-400 tracking-wide">
              “Prevent Before Respond. Remember Every Incident. Learn From Every Outcome.”
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab('prevent')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'prevent'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>PREVENT</span>
          </button>

          <button
            onClick={() => setActiveTab('respond')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'respond'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>RESPOND</span>
          </button>

          <button
            onClick={() => setActiveTab('replay')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'replay'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>REPLAY</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>TIMELINE</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>STATS</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
