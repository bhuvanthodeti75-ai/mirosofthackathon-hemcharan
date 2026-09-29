import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle, 
  XCircle, 
  FileText,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Incident } from '../types.ts';

export const TimelinePage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const loadIncidents = () => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIncidents(data.incidents || []);
        }
      })
      .catch(err => console.error('Error loading timeline incidents:', err));
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const filteredIncidents = incidents.filter(inc => {
    const matchesQuery = searchQuery === '' || 
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.alert.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.rootCause.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = filterTag === 'ALL' ||
      (filterTag === 'WORKED' && inc.outcome === 'WORKED') ||
      (filterTag === 'FAILED' && inc.outcome === 'FAILED') ||
      (filterTag === 'FRIDAY' && inc.dayOfWeek?.toLowerCase() === 'friday');

    return matchesQuery && matchesTag;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-orange-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              MEMORY TIMELINE & AUDIT TRAIL
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              LIVE HINDSIGHT MEMORY FEED ({incidents.length} RECORDS)
            </h2>
            <p className="text-sm text-slate-300">
              Chronological log of retained incident outcomes, root causes, and verified fixes stored in Hindsight memory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadIncidents}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold transition-all"
            >
              Refresh Timeline Feed
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory timeline..."
            className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter:</span>
          {['ALL', 'WORKED', 'FAILED', 'FRIDAY'].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterTag === tag
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="glass-panel p-8 rounded-xl text-center text-slate-400 text-xs">
            No incident memories match the selected filter criteria.
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-xs font-bold border border-amber-500/20">
                    {inc.id}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {inc.date} ({inc.dayOfWeek} at {inc.time})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium">
                    {inc.service}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                    inc.outcome === 'WORKED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {inc.outcome} ({inc.resolutionTimeMinutes}m)
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {inc.alert}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  <strong className="text-slate-400 uppercase font-bold text-[10px]">Root Cause:</strong> {inc.rootCause}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  <strong className="text-slate-400 uppercase font-bold text-[10px]">Fix Applied:</strong> {inc.fix}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {inc.tags?.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="text-amber-400/80 group-hover:text-amber-300 font-bold flex items-center gap-1">
                  View Full Memory & Post-Mortem &rarr;
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel-glow max-w-2xl w-full p-6 rounded-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-amber-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  MEMORY RECORD {selectedIncident.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Alert String</div>
                <div className="text-white font-bold">{selectedIncident.alert}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Service & Time</div>
                  <div className="text-slate-200">{selectedIncident.service} ({selectedIncident.dayOfWeek})</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Outcome Status</div>
                  <div className={`font-mono font-bold ${selectedIncident.outcome === 'WORKED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedIncident.outcome} ({selectedIncident.resolutionTimeMinutes} mins)
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Root Cause</div>
                <div className="text-slate-200">{selectedIncident.rootCause}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Verified Resolution Fix</div>
                <div className="text-slate-200">{selectedIncident.fix}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Telemetry Evidence</div>
                <div className="text-slate-300">{selectedIncident.evidence}</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 space-y-1">
                <div className="text-amber-400 font-bold uppercase text-[10px]">Prevention Actions</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans">
                  {selectedIncident.preventionActions?.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
