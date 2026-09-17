import { PieChart } from 'lucide-react';
import type { DashboardMetrics } from '../../types/privacy';

interface RiskDistributionProps {
  distribution: DashboardMetrics['riskDistribution'];
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ distribution }) => {
  const total = distribution.low + distribution.medium + distribution.high;
  const lowPct = Math.round((distribution.low / total) * 100);
  const medPct = Math.round((distribution.medium / total) * 100);
  const highPct = Math.round((distribution.high / total) * 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Prompt Risk Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Scans: {total}
          </span>
        </div>

        {/* Stacked bar visualization */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-950 mb-4 border border-slate-800">
          <div
            style={{ width: `${lowPct}%` }}
            className="bg-emerald-500 hover:opacity-90 transition-all"
            title={`Low Risk: ${distribution.low} (${lowPct}%)`}
          />
          <div
            style={{ width: `${medPct}%` }}
            className="bg-amber-500 hover:opacity-90 transition-all"
            title={`Medium Risk: ${distribution.medium} (${medPct}%)`}
          />
          <div
            style={{ width: `${highPct}%` }}
            className="bg-rose-500 hover:opacity-90 transition-all"
            title={`High Risk: ${distribution.high} (${highPct}%)`}
          />
        </div>

        {/* Legend / Breakdown cards */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-slate-200">Low Risk</span>
              <span className="text-[10px] text-slate-500">(Score 0-30)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-300 font-medium">{distribution.low}</span>
              <span className="font-mono text-emerald-400 font-bold w-10 text-right">{lowPct}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="font-semibold text-slate-200">Medium Risk</span>
              <span className="text-[10px] text-slate-500">(Score 31-70)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-300 font-medium">{distribution.medium}</span>
              <span className="font-mono text-amber-400 font-bold w-10 text-right">{medPct}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="font-semibold text-slate-200">High Risk</span>
              <span className="text-[10px] text-slate-500">(Score 71-100)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-300 font-medium">{distribution.high}</span>
              <span className="font-mono text-rose-400 font-bold w-10 text-right">{highPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
        Based on deterministic pattern matches and NER confidence scoring.
      </div>
    </div>
  );
};
