import React, { useState, useEffect } from 'react';
import { 
  History, 
  Play, 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  BrainCircuit, 
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';
import { Incident, ReplayData } from '../types.ts';

export const ReplayPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedId, setSelectedId] = useState<string>('INC-2026-001');
  const [replayData, setReplayData] = useState<ReplayData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch incidents list
  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.incidents?.length > 0) {
          setIncidents(data.incidents);
          setSelectedId(data.incidents[0].id);
        }
      })
      .catch(err => console.error('Error fetching incidents:', err));
  }, []);

  // Fetch specific replay data
  const loadReplay = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/replay/${id}`);
      const data = await res.json();
      if (data.success) {
        setReplayData(data);
      }
    } catch (err) {
      console.error('Error loading replay:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      loadReplay(selectedId);
    }
  }, [selectedId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              TIME-MACHINE REPLAY
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              INCIDENT REPLAY & HINDSIGHT ANALYSIS
            </h2>
            <p className="text-sm text-slate-300">
              Replay historical incident decisions step-by-step: Compare past agent state against present hindsight memory.
            </p>
          </div>

          {/* Dropdown Selector */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Incident:
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-4 py-2.5 bg-slate-950/90 border border-purple-500/40 rounded-xl text-xs font-mono font-bold text-purple-200 focus:outline-none focus:border-purple-400"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id}: {inc.alert.substring(0, 40)}... ({inc.dayOfWeek})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Replay Display */}
      {loading ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="text-xs font-mono text-purple-300">Loading Incident Time Machine Data...</div>
        </div>
      ) : replayData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Incident Meta Header */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono text-xs font-bold border border-purple-500/20">
                  {replayData.incident.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {replayData.incident.date} ({replayData.incident.dayOfWeek} at {replayData.incident.time})
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-semibold">
                  {replayData.incident.service}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                {replayData.incident.alert}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-400 font-medium">Outcome</div>
                <div className={`font-mono font-extrabold text-sm ${replayData.incident.outcome === 'WORKED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {replayData.incident.outcome} ({replayData.incident.resolutionTimeMinutes}m)
                </div>
              </div>
            </div>
          </div>

          {/* 4-Stage Time Machine Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stage 1: What the Agent Knew Then */}
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold rounded-bl-xl border-l border-b border-amber-500/20">
                STAGE 1
              </div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>1. What The Agent Knew Then</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Incoming Raw Alert</div>
                  <div className="font-mono text-amber-200">{replayData.replay.whatTheAgentKnewThen.alert}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Active Deployment</div>
                  <div className="font-mono text-slate-200">{replayData.replay.whatTheAgentKnewThen.deployment || 'N/A'}</div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
                  <span>Initial Confidence Score:</span>
                  <span className="font-mono font-bold text-amber-300">{replayData.replay.whatTheAgentKnewThen.initialConfidence}</span>
                </div>
              </div>
            </div>

            {/* Stage 2: What It Recommended */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold rounded-bl-xl border-l border-b border-cyan-500/20">
                STAGE 2
              </div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4" />
                <span>2. What It Recommended</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Hypothesized Root Cause</div>
                  <div className="font-mono text-cyan-200">{replayData.replay.whatItRecommended.rootCauseHypothesis}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Prescribed Fix Action</div>
                  <div className="font-mono text-cyan-100">{replayData.replay.whatItRecommended.recommendation}</div>
                </div>
              </div>
            </div>

            {/* Stage 3: What Actually Happened */}
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold rounded-bl-xl border-l border-b border-indigo-500/20">
                STAGE 3
              </div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                <span>3. What Actually Happened</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Execution Outcome:</span>
                  <span className={`font-mono font-bold text-sm ${replayData.replay.whatActuallyHappened.outcome === 'WORKED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {replayData.replay.whatActuallyHappened.outcome}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Telemetry & Metric Evidence</div>
                  <div className="font-mono text-slate-300">{replayData.replay.whatActuallyHappened.evidence}</div>
                </div>
              </div>
            </div>

            {/* Stage 4: What The Agent Knows Now */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold rounded-bl-xl border-l border-b border-emerald-500/20">
                STAGE 4
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>4. What The Agent Knows Now (Hindsight)</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-1">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                  <div className="text-emerald-400 font-bold text-[10px] uppercase">Retained Hindsight Lesson</div>
                  <div className="font-mono text-emerald-100">{replayData.replay.whatTheAgentKnowsNow.hindsightLesson}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold text-[10px] uppercase">Long-Term Prevention Rules</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans">
                    {replayData.replay.whatTheAgentKnowsNow.preventionActions?.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
