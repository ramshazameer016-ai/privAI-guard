import type {
  ScanResult,
  ScanStage,
  DashboardMetrics,
} from '../types/privacy';

/**
 * Frontend API Client
 *
 * Secure Chat:
 * Uses the real FastAPI privacy gateway.
 *
 * Dashboard:
 * Uses the real FastAPI backend.
 *
 * Company Policies:
 * Uses the current client-side policy configuration.
 * Backend policy synchronization is not yet enabled.
 *
 * No raw sensitive information is logged or persisted here.
 */

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Run the Secure Chat privacy gateway pipeline.
 *
 * Despite the historical function name, this now calls
 * the real FastAPI privacy gateway at /api/chat.
 */
export async function runMockScanPipeline(
  prompt: string,
  onStageUpdate: (
    stageId: ScanStage['id'],
    status: 'active' | 'completed'
  ) => void
): Promise<ScanResult> {
  // ---------------------------------------------------------
  // STEP 1 — DETECTION
  // ---------------------------------------------------------

  onStageUpdate('detecting', 'active');

  const response = await fetch(
    'https://privai-guard-api.onrender.com/api/chat',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
      }),
    }
  );

  onStageUpdate('detecting', 'completed');

  if (!response.ok) {
    throw new Error(
      `Privacy gateway request failed (${response.status}).`
    );
  }

  const data = await response.json();

  // ---------------------------------------------------------
  // STEP 2 — RISK SCORING
  // ---------------------------------------------------------

  onStageUpdate('scoring', 'active');

  await delay(150);

  onStageUpdate('scoring', 'completed');

  // ---------------------------------------------------------
  // STEP 3 — REDACTION
  // ---------------------------------------------------------

  onStageUpdate('redacting', 'active');

  await delay(150);

  onStageUpdate('redacting', 'completed');

  // ---------------------------------------------------------
  // STEP 4 — EXTERNAL AI REQUEST
  // ---------------------------------------------------------

  onStageUpdate('sending', 'active');

  await delay(150);

  onStageUpdate('sending', 'completed');

  // ---------------------------------------------------------
  // STEP 5 — REHYDRATION
  // ---------------------------------------------------------

  onStageUpdate('rehydrating', 'active');

  await delay(150);

  onStageUpdate('rehydrating', 'completed');

  // ---------------------------------------------------------
  // AUTHORITATIVE BACKEND MAPPINGS
  // ---------------------------------------------------------
  //
  // The backend creates the actual placeholder mapping.
  // The frontend must NOT invent placeholder numbers.
  //

  const mappings: Record<string, string> =
    data.mappings ?? {};

  // ---------------------------------------------------------
  // DETECTION DATA
  // ---------------------------------------------------------

  const detections = (data.detections ?? []).map(
    (detection: any, index: number) => {
      // Find the exact backend-generated placeholder
      // corresponding to this detected value.

      const placeholder = Object.keys(mappings).find(
        (token) => mappings[token] === detection.text
      );

      // IMPORTANT:
      // Never invent a placeholder on the frontend.
      // If the backend does not provide an authoritative
      // mapping, fail closed.

      if (!placeholder) {
        throw new Error(
          'Gateway returned a detection without an authoritative placeholder mapping.'
        );
      }

      return {
        id: `${detection.entity_type}-${index + 1}`,

        entityType: detection.entity_type,

        placeholder,

        maskedPreview: detection.text
          ? `${detection.text.slice(0, 2)}***`
          : '***',

        confidence: detection.confidence,

        source:
          detection.source === 'regex'
            ? 'deterministic'
            : detection.source === 'dictionary'
              ? 'dictionary'
              : 'ner',
      };
    }
  );

  // ---------------------------------------------------------
  // RISK LEVEL
  // ---------------------------------------------------------

  const riskLevel =
    data.risk_level === 'NONE'
      ? 'LOW'
      : data.risk_level === 'MEDIUM'
        ? 'MEDIUM'
        : data.risk_level === 'HIGH'
          ? 'HIGH'
          : 'CRITICAL';

  // ---------------------------------------------------------
  // REDACTION COUNT
  // ---------------------------------------------------------
  //
  // The backend mapping is authoritative.
  // Every mapping represents one detected sensitive value
  // that was replaced before the external AI request.
  //

  const redactionCount =
    Object.keys(mappings).length;

  // ---------------------------------------------------------
  // RETURN FRONTEND RESULT
  // ---------------------------------------------------------

  return {
    originalPrompt: prompt,

    sanitizedPrompt:
      data.sanitized_text ?? '',

    detections,

    risk: {
      score: data.risk_score ?? 0,
      level: riskLevel,
      breakdown: [],
    },

    redaction: {
      redactionsPerformed:
        redactionCount,

      mappings: detections.map(
        (detection: any) => ({
          entityType:
            detection.entityType,

          placeholder:
            detection.placeholder,

          maskedPreview:
            detection.maskedPreview,
        })
      ),
    },

    // -------------------------------------------------------
    // IMPORTANT RESPONSE SEPARATION
    // -------------------------------------------------------
    //
    // rawAiResponse:
    // Exact response received from external AI.
    // It should contain placeholders.
    //
    // rehydratedResponse:
    // Final response after the gateway restores
    // the original values locally.
    //

    rawAiResponse:
      data.raw_ai_response ?? '',

    rehydratedResponse:
      data.response ?? '',

    timestamp:
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),

    policyAction:
      data.action,
  };
}

/**
 * Fetch real dashboard data from the FastAPI backend.
 *
 * Backend endpoints:
 * GET /api/dashboard/summary
 * GET /api/dashboard/history
 *
 * Only privacy-safe audit metadata is returned.
 */
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const summaryResponse = await fetch(
    'https://privai-guard-api.onrender.com/api/dashboard/summary'
  );

  if (!summaryResponse.ok) {
    throw new Error(
      'Failed to fetch dashboard summary.'
    );
  }

  const summary =
    await summaryResponse.json();

  const historyResponse = await fetch(
    'https://privai-guard-api.onrender.com/api/dashboard/history'
  );

  if (!historyResponse.ok) {
    throw new Error(
      'Failed to fetch dashboard history.'
    );
  }

  const historyData =
    await historyResponse.json();

  const totalDetections =
    summary.total_detections;

  const entityCounts =
    summary.entity_counts;

  const totalEntityTypes =
    Object.values(entityCounts).reduce(
      (sum: number, count: unknown) =>
        sum + Number(count),
      0
    );

  const entityTypeBreakdown =
    Object.entries(entityCounts).map(
      ([type, count]) => ({
        type,

        count:
          Number(count),

        percentage:
          totalEntityTypes > 0
            ? Math.round(
                (Number(count) /
                  totalEntityTypes) *
                  100
              )
            : 0,
      })
    );

  return {
    promptsScanned:
      summary.total_prompts_scanned,

    entitiesDetected:
      totalDetections,

    redactionsPerformed:
      summary.total_redactions,

    blockedRequests:
      summary.blocked_requests,

    riskDistribution: {
      low:
        summary.risk_counts.LOW,

      medium:
        summary.risk_counts.MEDIUM,

      high:
        summary.risk_counts.HIGH,
    },

    entityTypeBreakdown,

    recentScans:
      historyData.records.map(
        (record: any) => ({
          timestamp:
            record.timestamp,

          action:
            record.action,

          riskScore:
            record.risk_score,

          riskLevel:
            record.risk_level,

          detectionCount:
            record.detection_count,

          entityTypes:
            record.entity_types,

          redactionCount:
            record.redaction_count,
        })
      ),
  };
}