export type SensitivityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PolicyAction = 'ALLOW' | 'WARN' | 'REDACT' | 'BLOCK';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Detection {
  id: string;
  entityType: 'PERSON' | 'ORGANIZATION' | 'PROJECT' | 'API_KEY' | 'EMAIL' | 'PHONE' | 'CREDIT_CARD' | 'IP_ADDRESS' | string;
  placeholder: string;
  maskedPreview: string;
  confidence: number;
  source?: 'deterministic' | 'ner' | 'dictionary';
}

export interface RiskBreakdownItem {
  category: string;
  points: number;
  description?: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  breakdown: RiskBreakdownItem[];
}

export interface RedactionMapping {
  entityType: string;
  placeholder: string;
  maskedPreview?: string;
}

export interface RedactionResult {
  redactionsPerformed: number;
  mappings: RedactionMapping[];
}

export type ScanStageId = 'detecting' | 'scoring' | 'redacting' | 'sending' | 'rehydrating';
export type StageStatus = 'pending' | 'active' | 'completed';

export interface ScanStage {
  id: ScanStageId;
  label: string;
  description: string;
  status: StageStatus;
}

export interface ScanResult {
  originalPrompt: string;
  sanitizedPrompt: string;
  detections: Detection[];
  risk: RiskResult;
  redaction: RedactionResult;
  rawAiResponse: string;
  rehydratedResponse: string;
  timestamp: string;
  policyAction: PolicyAction;
}

export interface Policy {
  id: string;
  termCategory: string;
  sensitivity: SensitivityLevel;
  action: PolicyAction;
  enabled: boolean;
  description?: string;
}

export interface ScanHistoryItem {
  id: string;
  time: string;
  entityCount: number;
  riskLevel: RiskLevel;
  action: PolicyAction;
  llmProvider: string;
}

export interface DashboardMetrics {
  promptsScanned: number;
  entitiesDetected: number;
  redactionsPerformed: number;
  blockedRequests: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  entityTypeBreakdown: {
    type: string;
    count: number;
    percentage: number;
  }[];
  recentScans: ScanHistoryItem[];
}
