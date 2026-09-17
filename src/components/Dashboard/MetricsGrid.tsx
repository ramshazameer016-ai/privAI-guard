import { ScanText, ShieldAlert, FileCode, Ban } from 'lucide-react';
import type { DashboardMetrics } from '../../types/privacy';

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Prompts Scanned',
      value: metrics.promptsScanned,
      change: '+14% vs yesterday',
      icon: <ScanText className="w-5 h-5 text-cyan-400" />,
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
    },
    {
      label: 'Entities Detected',
      value: metrics.entitiesDetected,
      change: 'Avg 2.7 / prompt',
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    },
    {
      label: 'Redactions Performed',
      value: metrics.redactionsPerformed,
      change: '83.8% tokenized',
      icon: <FileCode className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    },
    {
      label: 'Blocked Requests',
      value: metrics.blockedRequests,
      change: 'Critical secrets isolated',
      icon: <Ban className="w-5 h-5 text-rose-400" />,
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {card.label}
            </span>
            <div className={`p-2 rounded-lg border ${card.badgeColor}`}>
              {card.icon}
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold font-mono text-slate-100 mb-1">
              {card.value}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {card.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
