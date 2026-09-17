import { Layers } from 'lucide-react';
import type { DashboardMetrics } from '../../types/privacy';

interface EntityBreakdownProps {
  breakdown: DashboardMetrics['entityTypeBreakdown'];
}

export const EntityBreakdown: React.FC<EntityBreakdownProps> = ({ breakdown }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Entity Type Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            7 Active Categories
          </span>
        </div>

        <div className="space-y-3">
          {breakdown.map((item) => (
            <div key={item.type} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">
                  {item.type.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400">{item.count}</span>
                  <span className="font-mono font-semibold text-purple-400 w-9 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
        Aggregated across all employee prompts processed by PrivAI Guard.
      </div>
    </div>
  );
};
