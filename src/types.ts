export interface Incident {
  id: string;
  date: string;
  dayOfWeek: string;
  time: string;
  service: string;
  alert: string;
  deployment?: string;
  rootCause: string;
  fix: string;
  outcome: 'WORKED' | 'FAILED';
  resolutionTimeMinutes: number;
  historicalSuccessRate?: string;
  tags: string[];
  summary: string;
  evidence: string;
  reasoning: string;
  preventionActions: string[];
  postMortem?: {
    incidentSummary: string;
    rootCause: string;
    recommendedFix: string;
    actualFix: string;
    outcome: string;
    resolutionTime: string;
    whatWorked: string;
    whatFailed: string;
    whatWeLearned: string;
    futurePrevention: string;
  };
}

export interface AnalysisResult {
  summary: string;
  likely_root_cause: string;
  confidence: string;
  recommendation: string;
  evidence: string;
  historical_success_rate: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
  prevention_actions: string[];
}

export interface SystemStatus {
  hindsight: { connected: boolean; reason: string };
  groq: { connected: boolean; reason: string };
  stats: { status: string; count: number };
  memoryCount: number;
}

export interface FixStat {
  category: string;
  total: number;
  worked: number;
  successRate: string;
}

export interface DeployCorrelation {
  fridayIncidentRate: string;
  fridayCount: number;
  totalDeploymentsAnalyzed: number;
  riskMultiplier: string;
  peakRiskWindow: string;
  primaryRiskFactor: string;
}

export interface AlertBehavior {
  totalRecords: number;
  workedRecords: number;
  failedRecords: number;
  overallSuccessRate: string;
  avgResolutionTimeMinutes: number;
}

export interface ReplayData {
  incident: Incident;
  replay: {
    whatTheAgentKnewThen: {
      alert: string;
      deployment?: string;
      recalledMemoriesCount: number;
      initialConfidence: string;
    };
    whatItRecommended: {
      recommendation: string;
      rootCauseHypothesis: string;
    };
    whatActuallyHappened: {
      outcome: 'WORKED' | 'FAILED';
      resolutionTimeMinutes: number;
      evidence: string;
    };
    whatTheAgentKnowsNow: {
      hindsightLesson: string;
      preventionActions: string[];
    };
  };
}
