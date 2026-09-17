import { CheckCircle2, Loader2, Circle, ShieldCheck } from 'lucide-react';
import type { ScanStage } from '../../types/privacy';

interface ScanPipelineProps {
  stages: ScanStage[];
  isScanning: boolean;
  isComplete: boolean;
}

export const ScanPipeline: React.FC<ScanPipelineProps> = ({
  stages,
  isScanning,
  isComplete,
}) => {
  if (!isScanning && !isComplete) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100 tracking-wide">
            Privacy Gateway Inspection Pipeline
          </h3>
        </div>
        <div>
          {isComplete ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Privacy scan complete
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Scanning in progress...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {stages.map((stage, index) => {
          const isActive = stage.status === 'active';
          const isDone = stage.status === 'completed';

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                  : isDone
                  ? 'bg-slate-800/50 border-emerald-900/60'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-medium text-slate-400">
                  STEP 0{index + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div>
                <p className={`text-xs font-semibold ${
                  isActive ? 'text-cyan-200' : isDone ? 'text-emerald-300' : 'text-slate-400'
                }`}>
                  {stage.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
