import { Bot, RefreshCw, Sparkles, CheckCircle2, ArrowDown } from 'lucide-react';

interface ResponseComparisonProps {
  rawAiResponse: string;
  rehydratedResponse: string;
}

export const ResponseComparison: React.FC<ResponseComparisonProps> = ({
  rawAiResponse,
  rehydratedResponse,
}) => {
  // Helper to render placeholders in the raw response
  const renderHighlightedPlaceholders = (text: string) => {
    const parts = text.split(/(\[[A-Z_]+_\d+\])/g);
    return parts.map((part, index) => {
      if (/^\[[A-Z_]+_\d+\]$/.test(part)) {
        return (
          <span
            key={index}
            className="inline-block font-mono text-xs px-1.5 py-0.5 my-0.5 mx-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-600/50 font-semibold"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <h3 className="text-sm font-semibold text-slate-100">
            LLM Response & Gateway Rehydration
          </h3>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
          Live external response & gateway rehydration
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Panel 1: Raw AI Response with Placeholders */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                AI Response with Placeholders
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Raw External Model Output
            </span>
          </div>
          <div className="font-mono text-sm leading-relaxed text-slate-300 bg-slate-900/80 p-3.5 rounded-md border border-slate-800/80">
            {renderHighlightedPlaceholders(rawAiResponse)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            The external LLM only generated text referencing tokenized placeholders. No real identities or secrets were ever sent to it.
          </p>
        </div>

        {/* Transition indicator */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-cyan-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span className="font-medium">Gateway Rehydration Engine (Restoring local entity mapping)</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

        {/* Panel 2: Final Response After Rehydration */}
        <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Final Response After Rehydration
              </h4>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              Delivered to Employee
            </span>
          </div>
          <div className="text-sm font-medium leading-relaxed text-slate-100 bg-slate-950/70 p-3.5 rounded-md border border-emerald-900/40">
            {rehydratedResponse}
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-2">
            Seamless employee experience: original terms are restored safely on return without exposing them upstream.
          </p>
        </div>
      </div>
    </div>
  );
};
