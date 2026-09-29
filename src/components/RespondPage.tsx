import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Layers, 
  AlertTriangle, 
  BrainCircuit, 
  FileText, 
  Check, 
  X,
  History,
  Activity
} from 'lucide-react';
import { Incident, AnalysisResult } from '../types.ts';

interface RespondPageProps {
  memoryOn: boolean;
  onOutcomeRecorded?: () => void;
}

export const RespondPage: React.FC<RespondPageProps> = ({ memoryOn, onOutcomeRecorded }) => {
  const [alertInput, setAlertInput] = useState('DB timeout rate increased after Friday deployment');
  const [loading, setLoading] = useState(false);
  const [outcomeLoading, setOutcomeLoading] = useState(false);
  const [result, setResult] = useState<{
    recalledMemories: Incident[];
    analysis: AnalysisResult;
    stats: any;
  } | null>(null);

  // Post-Mortem Modal State
  const [postMortem, setPostMortem] = useState<any | null>(null);
  const [showPostMortem, setShowPostMortem] = useState(false);

  const runIncidentResponse = async (queryText: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, memoryOn })
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          recalledMemories: data.recalledMemories || [],
          analysis: data.analysis,
          stats: data.stats
        });
      }
    } catch (err) {
      console.error('Respond analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runIncidentResponse('DB timeout rate increased after Friday deployment');
  }, [memoryOn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertInput.trim()) {
      runIncidentResponse(alertInput);
    }
  };

  // Handle WORKED / FAILED action buttons
  const handleRecordOutcome = async (outcomeType: 'WORKED' | 'FAILED') => {
    if (!result) return;
    setOutcomeLoading(true);
    try {
      const res = await fetch('/api/outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert: alertInput,
          rootCause: result.analysis.likely_root_cause,
          fix: result.analysis.recommendation,
          outcome: outcomeType,
          service: 'Payments Service'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPostMortem(data.incident.postMortem || {
          incidentSummary: `Incident: ${alertInput}. Outcome: ${outcomeType}`,
          rootCause: result.analysis.likely_root_cause,
          recommendedFix: result.analysis.recommendation,
          actualFix: result.analysis.recommendation,
          outcome: outcomeType,
          resolutionTime: outcomeType === 'WORKED' ? '12 minutes' : '35 minutes',
          whatWorked: outcomeType === 'WORKED' ? 'Scaled pool max_connections and cancelled blocking index lock.' : 'Fast triage and alert isolation.',
          whatFailed: outcomeType === 'WORKED' ? 'None' : 'Initial fix attempt did not release table locks.',
          whatWeLearned: `Stored into Hindsight memory bank. ${outcomeType === 'WORKED' ? 'Verified pattern works.' : 'Lesson stored to prevent repeating failed fix.'}`,
          futurePrevention: 'Enforce no-Friday-deploy policy and run migrations asynchronously.'
        });
        setShowPostMortem(true);
        if (onOutcomeRecorded) onOutcomeRecorded();
      }
    } catch (err) {
      console.error('Failed to record outcome:', err);
    } finally {
      setOutcomeLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-blue-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                INCIDENT RESPONSE & TRIAGE
              </span>
              <span className="text-xs text-slate-400">
                Memory Engine: <strong className={memoryOn ? 'text-cyan-400' : 'text-slate-400'}>{memoryOn ? 'ACTIVE (25 Records)' : 'OFF (Isolated Context)'}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              REAL-TIME INCIDENT SOLVER
            </h2>
            <p className="text-sm text-slate-300">
              Input active incident alerts. Hindsight recalls past incident fixes and Groq generates precise root cause diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAlertInput('DB timeout rate increased after Friday deployment');
                runIncidentResponse('DB timeout rate increased after Friday deployment');
              }}
              className="px-3 py-2 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Test Benchmark Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Alert Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-xl space-y-3">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          Active Production Alert String:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={alertInput}
              onChange={(e) => setAlertInput(e.target.value)}
              placeholder="e.g. DB timeout rate increased after Friday deployment"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Recalling Hindsight...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Diagnose Incident</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Incident Diagnostic Panel */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Resolution Card */}
          <div className="glass-panel-glow p-6 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    DIAGNOSTIC STATUS: RESOLVED
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Groq AI + Hindsight Recall
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {result.analysis.summary}
                </h3>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-center">
                  <div className="text-xs text-slate-400 font-medium">Confidence</div>
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

            {/* Core Diagnostics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Likely Root Cause */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Likely Root Cause</span>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed font-semibold">
                  {result.analysis.likely_root_cause}
                </p>
              </div>

              {/* Actionable Recommendation */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Recommended Fix Action</span>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed font-semibold">
                  {result.analysis.recommendation}
                </p>
              </div>
            </div>

            {/* Evidence & Reasoning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>Observed Metric Evidence</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {result.analysis.evidence}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Technical Reasoning</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {result.analysis.reasoning}
                </p>
              </div>
            </div>

            {/* Action Bar: WORKED / FAILED */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Execute Fix Action & Record Outcome into Memory:
                </h4>
                <p className="text-xs text-slate-400">
                  Recording the outcome updates Hindsight memory, stats engine, and memory timeline in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRecordOutcome('WORKED')}
                  disabled={outcomeLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>WORKED</span>
                </button>

                <button
                  onClick={() => handleRecordOutcome('FAILED')}
                  disabled={outcomeLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-rose-200" />
                  <span>FAILED</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recalled Similar Incidents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Hindsight Recalled Memory Matches ({result.recalledMemories.length})</span>
              </h3>
            </div>

            {result.recalledMemories.length === 0 ? (
              <div className="glass-panel p-6 rounded-xl text-center text-slate-400 text-xs">
                Memory Engine is OFF. Turn Memory ON in the top header to query Hindsight vector memories.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recalledMemories.map((inc) => (
                  <div key={inc.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
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
                      <strong className="text-emerald-400">Verified Fix:</strong> {inc.fix}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Outcome: <strong className={inc.outcome === 'WORKED' ? 'text-emerald-400' : 'text-rose-400'}>{inc.outcome}</strong></span>
                      <span>Success Rate: {inc.historicalSuccessRate || '94%'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Mortem Modal */}
      {showPostMortem && postMortem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-glow max-w-2xl w-full p-6 rounded-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  POST-MORTEM REPORT GENERATED
                </h3>
              </div>
              <button
                onClick={() => setShowPostMortem(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Incident Summary</div>
                <div className="text-slate-100 font-semibold">{postMortem.incidentSummary}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Recorded Outcome</div>
                  <div className={`font-mono font-bold text-sm ${postMortem.outcome === 'WORKED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {postMortem.outcome}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Resolution Time</div>
                  <div className="font-mono font-bold text-sm text-cyan-300">
                    {postMortem.resolutionTime}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Root Cause</div>
                <div className="text-slate-200 font-mono">{postMortem.rootCause}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Actual Fix Applied</div>
                <div className="text-slate-200 font-mono">{postMortem.actualFix}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <div className="text-emerald-400 font-bold uppercase text-[10px]">What Worked</div>
                  <div className="text-slate-200">{postMortem.whatWorked}</div>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 space-y-1">
                  <div className="text-rose-400 font-bold uppercase text-[10px]">What Failed</div>
                  <div className="text-slate-200">{postMortem.whatFailed}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 space-y-1">
                <div className="text-indigo-300 font-bold uppercase text-[10px]">What We Learned</div>
                <div className="text-slate-200">{postMortem.whatWeLearned}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPostMortem(false)}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20"
              >
                Close & Retain in Memory Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
