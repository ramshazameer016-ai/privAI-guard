import { EyeOff, FileText, ShieldCheck } from 'lucide-react';

interface PromptComparisonProps {
  originalPrompt: string;
  sanitizedPrompt: string;
}

export const PromptComparison: React.FC<PromptComparisonProps> = ({
  originalPrompt,
  sanitizedPrompt,
}) => {
  const hasSensitiveInformation =
    originalPrompt !== sanitizedPrompt;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />

          <h3 className="text-sm font-semibold text-slate-100">
            Prompt Inspection & Sanitization
          </h3>
        </div>

        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
          Live gateway inspection
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Original Prompt
              </h4>
            </div>

            {hasSensitiveInformation && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
                <EyeOff className="w-3 h-3" />
                Contains detected sensitive information
              </span>
            )}

            {!hasSensitiveInformation && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" />
                No sensitive information detected
              </span>
            )}
          </div>

          <div className="font-mono text-sm leading-relaxed text-slate-200 bg-slate-950/70 p-3.5 rounded-md border border-slate-800/80 min-h-[100px] whitespace-pre-wrap">
            {originalPrompt}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />

              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Sanitized Prompt Sent to AI
              </h4>
            </div>

            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/60">
              Gateway-sanitized payload
            </span>
          </div>

          <div className="font-mono text-sm leading-relaxed text-slate-200 bg-slate-950/70 p-3.5 rounded-md border border-cyan-900/50 min-h-[100px] whitespace-pre-wrap">
            {sanitizedPrompt}
          </div>

          <p className="text-[11px] text-slate-500 mt-2">
            Only the gateway-sanitized prompt is forwarded to the external
            AI provider.
          </p>
        </div>
      </div>
    </div>
  );
};