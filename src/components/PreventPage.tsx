import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  BrainCircuit,
  History
} from 'lucide-react';
import { Incident, AnalysisResult } from '../types.ts';

interface PreventPageProps {
  memoryOn: boolean;
}

export const PreventPage: React.FC<PreventPageProps> = ({ memoryOn }) => {
  const [deploymentInput, setDeploymentInput] = useState('Deploy Payments v2.8 on Friday at 8 PM');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    similarIncidents: Incident[];
    analysis: AnalysisResult;
  } | null>(null);

  // Perform prevention analysis
  const runPreventionAnalysis = async (queryText: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/prevent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, memoryOn })
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          similarIncidents: data.similarIncidents || [],
          analysis: data.analysis
        });
      }
    } catch (err) {
      console.error('Prevent analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial test case on mount
  useEffect(() => {
    runPreventionAnalysis('Deploy Payments v2.8 on Friday at 8 PM');
  }, [memoryOn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deploymentInput.trim()) {
      runPreventionAnalysis(deploymentInput);
    }
  };

  const getRiskBadgeColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-cyan-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                DEFAULT DEFENSE MODE
              </span>
              <span className="text-xs text-slate-400">
                Memory Engine: <strong className={memoryOn ? 'text-cyan-400' : 'text-slate-400'}>{memoryOn ? 'ACTIVE (25 Records)' : 'OFF (Context Limited)'}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              PREVENT BEFORE RESPOND
            </h2>
            <p className="text-sm text-slate-300">
              Evaluate deployment proposals against historical Hindsight incident memory to surface potential risk signals before release.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDeploymentInput('Deploy Payments v2.8 on Friday at 8 PM');
                runPreventionAnalysis('Deploy Payments v2.8 on Friday at 8 PM');
              }}
              className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Benchmark Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-xl space-y-3">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Proposed Deployment or Change Proposal:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={deploymentInput}
              onChange={(e) => setDeploymentInput(e.target.value)}
              placeholder="e.g. Deploy Payments v2.8 on Friday at 8 PM"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Risk Signal...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Evaluate Risk Signal</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Risk Card */}
          <div className={`glass-panel p-6 rounded-2xl border ${getRiskBadgeColor(result.analysis.risk_level)} space-y-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Evaluated Historical Risk Signal
                  </span>
                  <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold border ${getRiskBadgeColor(result.analysis.risk_level)}`}>
                    RISK LEVEL: {result.analysis.risk_level}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {result.analysis.summary}
                </h3>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-medium">Pattern Confidence</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">
                    {result.analysis.confidence}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-medium">Historical Success Rate</div>
                  <div className="text-xl font-extrabold text-cyan-400 font-mono">
                    {result.analysis.historical_success_rate}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Potential Root Cause */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Potential Risk & Root Cause</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.analysis.likely_root_cause}
                </p>
              </div>

              {/* Observed Deployment Pattern & Evidence */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <History className="w-4 h-4" />
                  <span>Similar Historical Pattern & Evidence</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {result.analysis.evidence}
                </p>
              </div>
            </div>

            {/* Technical Reasoning */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4" />
                <span>Technical Reasoning & Hindsight Correlation</span>
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">
                {result.analysis.reasoning}
              </p>
            </div>

            {/* Prevention Actions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recommended Prevention Actions</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.analysis.prevention_actions?.map((action, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-snug">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Similar Incidents Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Recalled Similar Historical Incidents ({result.similarIncidents.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Query: "DB timeouts after Friday deployments"</span>
            </div>

            {result.similarIncidents.length === 0 ? (
              <div className="glass-panel p-6 rounded-xl text-center text-slate-400 text-xs">
                No similar historical memories returned (Memory engine is currently OFF or no matches found).
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.similarIncidents.map((inc) => (
                  <div key={inc.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/20">
                        {inc.id}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {inc.dayOfWeek} {inc.time} • {inc.service}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {inc.alert}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      <strong className="text-amber-300">Root Cause:</strong> {inc.rootCause}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Fix: {inc.fix.substring(0, 45)}...</span>
                      <span className={`font-mono font-bold ${inc.outcome === 'WORKED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {inc.outcome} ({inc.resolutionTimeMinutes}m)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
