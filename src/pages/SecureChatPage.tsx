

import { useState } from 'react';
import { ChatInput } from '../components/SecureChat/ChatInput';
import { ScanPipeline } from '../components/SecureChat/ScanPipeline';
import { PromptComparison } from '../components/SecureChat/PromptComparison';
import { DetectionList } from '../components/SecureChat/DetectionList';
import { RiskPanel } from '../components/SecureChat/RiskPanel';
import { RedactionPanel } from '../components/SecureChat/RedactionPanel';
import { ResponseComparison } from '../components/SecureChat/ResponseComparison';
import { DEFAULT_DEMO_PROMPT, INITIAL_SCAN_STAGES } from '../mock/mockScan';
import { runMockScanPipeline } from '../api/client';
import type { ScanStage, ScanResult } from '../types/privacy';
import { Info, ShieldCheck } from 'lucide-react';

export const SecureChatPage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(DEFAULT_DEMO_PROMPT);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [stages, setStages] = useState<ScanStage[]>(INITIAL_SCAN_STAGES);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleStageUpdate = (
    stageId: ScanStage['id'],
    status: 'active' | 'completed'
  ) => {
    setStages((prevStages) =>
      prevStages.map((stage) => {
        if (stage.id === stageId) {
          return { ...stage, status };
        }
        return stage;
      })
    );
  };

  const handleScanAndSend = async () => {
    if (!prompt.trim() || isScanning) return;

    setStages(
      INITIAL_SCAN_STAGES.map((s) => ({
        ...s,
        status: 'pending',
      }))
    );

    setIsScanning(true);
    setIsComplete(false);

    try {
      const result = await runMockScanPipeline(
        prompt,
        handleStageUpdate
      );

      setScanResult(result);
      setIsComplete(true);
    } catch (err) {
      console.error('Scan pipeline error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleResetPrompt = () => {
    setPrompt(DEFAULT_DEMO_PROMPT);
    setIsScanning(false);
    setIsComplete(false);
    setScanResult(null);

    setStages(
      INITIAL_SCAN_STAGES.map((s) => ({
        ...s,
        status: 'pending',
      }))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/30 border border-cyan-900/40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-100">
              Interactive AI Privacy Gateway
            </h2>

            <p className="text-xs text-slate-400">
              Test how PrivAI Guard intercepts sensitive prompt data,
              applies reversible tokens, and protects corporate IP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
            Live Privacy Gateway
          </span>
        </div>
      </div>

      {/* 1. Prompt Input Section */}
      <ChatInput
        prompt={prompt}
        setPrompt={setPrompt}
        onScanAndSend={handleScanAndSend}
        isScanning={isScanning}
        onResetPrompt={handleResetPrompt}
      />

      {/* 2. Inspection Pipeline Progress */}
      <ScanPipeline
        stages={stages}
        isScanning={isScanning}
        isComplete={isComplete}
      />

      {/* 3. Results Section */}
      {scanResult && isComplete && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Original Prompt vs Sanitized Prompt */}
          <PromptComparison
            originalPrompt={scanResult.originalPrompt}
            sanitizedPrompt={scanResult.sanitizedPrompt}
          />

          {/* Detections, Risk, and Redaction Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RiskPanel risk={scanResult.risk} />
            </div>

            <div className="lg:col-span-2">
              <DetectionList
                detections={scanResult.detections}
              />
            </div>
          </div>

          {/* Redaction Mapping Panel */}
          <RedactionPanel
            redaction={scanResult.redaction}
          />

          {/* Response Comparison */}
          <ResponseComparison
            rawAiResponse={scanResult.rawAiResponse}
            rehydratedResponse={scanResult.rehydratedResponse}
          />
        </div>
      )}

      {/* Honest Security Disclaimer Notice */}
      <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />

        <div>
          <span className="font-semibold text-slate-300">
            Gateway Security Notice:{' '}
          </span>

          PrivAI Guard is designed to prevent successfully detected
          sensitive values from being sent to the external AI.
          Detected sensitive values are replaced with scoped
          placeholders before the sanitized prompt is sent to the
          external AI provider.
        </div>
      </div>
    </div>
  );
};