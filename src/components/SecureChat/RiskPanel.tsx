import { AlertOctagon, Info } from 'lucide-react';
import type { RiskResult } from '../../types/privacy';

interface RiskPanelProps {
  risk: RiskResult;
}

export const RiskPanel: React.FC<RiskPanelProps> = ({ risk }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bg: 'bg-rose-950/60',
          border: 'border-rose-800/60',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          progress: 'bg-rose-500',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/60',
          border: 'border-amber-800/60',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          progress: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-emerald-950/60',
          border: 'border-emerald-800/60',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          progress: 'bg-emerald-500',
        };
    }
  };

  const colors = getRiskColor(risk.level);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Risk Assessment
            </h3>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
            Risk Level: {risk.level}
          </span>
        </div>

        {/* Score dial/bar */}
        <div className="mb-5 p-4 rounded-lg bg-slate-950/80 border border-slate-800">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-slate-400">Calculated Risk Score</span>
            <span className="text-2xl font-bold font-mono text-slate-100">
              {risk.score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.progress} transition-all duration-500`}
              style={{ width: `${Math.min(risk.score, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Breakdown table */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Risk Score Breakdown
          </h4>
          <div className="space-y-2">
            {risk.breakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-slate-950/50 border border-slate-800/60 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-200">{item.category}</span>
                  {item.description && (
                    <span className="text-[10px] text-slate-500">{item.description}</span>
                  )}
                </div>
                <span className="font-mono font-bold text-rose-400">
                  +{item.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400" />
          Gateway Risk Scoring
        </span>
        <span className="font-mono font-bold text-slate-300">
          Total: {risk.score}
        </span>
      </div>
    </div>
  );
};
