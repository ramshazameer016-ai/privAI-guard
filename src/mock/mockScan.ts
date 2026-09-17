import type { ScanResult, ScanStage } from '../types/privacy';

export const DEFAULT_DEMO_PROMPT = 
  "Hi, I'm John Smith from Acme Corp. Please help me debug Project Phoenix. My API key is sk-test-123456.";

export const DEFAULT_SCAN_RESULT: ScanResult = {
  originalPrompt: DEFAULT_DEMO_PROMPT,
  sanitizedPrompt: 
    "Hi, I'm [PERSON_001] from [ORG_001]. Please help me debug [PROJECT_001]. My API key is [API_KEY_001].",
  detections: [
    {
      id: 'det-1',
      entityType: 'PERSON',
      placeholder: '[PERSON_001]',
      maskedPreview: 'J*** S****',
      confidence: 0.98,
      source: 'ner',
    },
    {
      id: 'det-2',
      entityType: 'ORGANIZATION',
      placeholder: '[ORG_001]',
      maskedPreview: 'A*** C***',
      confidence: 0.96,
      source: 'ner',
    },
    {
      id: 'det-3',
      entityType: 'PROJECT',
      placeholder: '[PROJECT_001]',
      maskedPreview: 'P****** P*******',
      confidence: 0.95,
      source: 'dictionary',
    },
    {
      id: 'det-4',
      entityType: 'API_KEY',
      placeholder: '[API_KEY_001]',
      maskedPreview: 's**************',
      confidence: 0.99,
      source: 'deterministic',
    },
  ],
  risk: {
    score: 87,
    level: 'HIGH',
    breakdown: [
      { category: 'API Key', points: 40, description: 'Direct credential / secret detected' },
      { category: 'Project Information', points: 20, description: 'Confidential project designation' },
      { category: 'Personal Identity', points: 15, description: 'Full employee identity (PII)' },
      { category: 'Organization Information', points: 12, description: 'Internal corporate association' },
    ],
  },
  redaction: {
    redactionsPerformed: 4,
    mappings: [
      { entityType: 'PERSON', placeholder: '[PERSON_001]' },
      { entityType: 'ORGANIZATION', placeholder: '[ORG_001]' },
      { entityType: 'PROJECT', placeholder: '[PROJECT_001]' },
      { entityType: 'API_KEY', placeholder: '[API_KEY_001]' },
    ],
  },
  rawAiResponse: 
    "[PERSON_001] from [ORG_001] can debug [PROJECT_001]. The API key [API_KEY_001] should not be exposed.",
  rehydratedResponse: 
    "John Smith from Acme Corp can debug Project Phoenix. The API key sk-test-123456 should not be exposed.",
  timestamp: 'Just now',
  policyAction: 'REDACT',
};

export const INITIAL_SCAN_STAGES: ScanStage[] = [
  {
    id: 'detecting',
    label: 'Detecting sensitive information',
    description: 'Scanning deterministic patterns, NER models, and company dictionary',
    status: 'pending',
  },
  {
    id: 'scoring',
    label: 'Calculating risk',
    description: 'Evaluating sensitivity exposure and threat weighting',
    status: 'pending',
  },
  {
    id: 'redacting',
    label: 'Redacting detected information',
    description: 'Replacing sensitive entities with reversible scoped tokens',
    status: 'pending',
  },
  {
    id: 'sending',
    label: 'Sending sanitized prompt',
    description: 'Transmitting sanitized prompt to external AI provider ',
    status: 'pending',
  },
  {
    id: 'rehydrating',
    label: 'Rehydrating response',
    description: 'Safely restoring original entities into returned response',
    status: 'pending',
  },
];
