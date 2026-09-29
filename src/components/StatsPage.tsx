import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';
import { FixStat, DeployCorrelation, AlertBehavior } from '../types.ts';

export const StatsPage: React.FC = () => {
  const [fixStats, setFixStats] = useState<FixStat[]>([]);
  const [deployCorrelation, setDeployCorrelation] = useState<DeployCorrelation | null>(null);
  const [alertBehavior, setAlertBehavior] = useState<AlertBehavior | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFixStats(data.fix_stats || []);
          setDeployCorrelation(data.deploy_correlation || null);
          setAlertBehavior(data.alert_behavior || null);
        }
      })
      .catch(err => console.error('Error fetching stats engine:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-xs font-mono text-indigo-300">Computing Incident Statistics Engine...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              REAL STATS ENGINE
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              HISTORICAL INCIDENT & DEPLOYMENT ANALYTICS
            </h2>
            <p className="text-sm text-slate-300">
              Calculated dynamically from the live 25+ incident dataset. Analyzes deployment correlations and fix success rates.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold">
            Status: READY (Deterministic Dataset)
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      {alertBehavior && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Incident Memories</div>
            <div className="text-3xl font-extrabold text-white font-mono">{alertBehavior.totalRecords}</div>
            <div className="text-[11px] text-slate-400">Indexed in vector bank</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overall Fix Success Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">{alertBehavior.overallSuccessRate}</div>
            <div className="text-[11px] text-emerald-400/80 font-mono">{alertBehavior.workedRecords} Worked / {alertBehavior.failedRecords} Failed</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Resolution Time</div>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">{alertBehavior.avgResolutionTimeMinutes} min</div>
            <div className="text-[11px] text-slate-400">Mean time to recovery</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Friday Deployment Risk Rate</div>
            <div className="text-3xl font-extrabold text-rose-400 font-mono">{deployCorrelation?.fridayIncidentRate}</div>
            <div className="text-[11px] text-rose-400/80 font-mono">{deployCorrelation?.riskMultiplier} elevated incident risk</div>
          </div>
        </div>
      )}

      {/* Friday Deployment Risk Correlation Card */}
      {deployCorrelation && (
        <div className="glass-panel-danger p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-extrabold uppercase tracking-wider">
                DEPLOYMENT TIMING CORRELATION MATRIX (deploy_correlation)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/30">
              HIGH RISK SIGNAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Peak Risk Window</div>
              <div className="text-white text-sm font-bold">{deployCorrelation.peakRiskWindow}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Friday Incidents Analyzed</div>
              <div className="text-amber-300 text-sm font-bold">{deployCorrelation.fridayCount} of {deployCorrelation.totalDeploymentsAnalyzed} Total Incidents</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-slate-400 font-bold uppercase text-[10px]">Primary Root Risk Factor</div>
              <div className="text-slate-200 text-xs font-sans">{deployCorrelation.primaryRiskFactor}</div>
            </div>
          </div>
        </div>
      )}

      {/* Fix Statistics Breakdown by Service Category */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-blue-400">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">
              SERVICE RESOLUTION SUCCESS RATES (fix_stats)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Dynamic Aggregation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fixStats.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{item.category}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                  {item.successRate} Success
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: item.successRate }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Total: {item.total}</span>
                <span className="text-emerald-400 font-bold">{item.worked} Worked</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
