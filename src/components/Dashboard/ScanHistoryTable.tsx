import { History, Lock } from 'lucide-react';
import type { ScanHistoryItem } from '../../types/privacy';

interface ScanHistoryTableProps {
  scans: ScanHistoryItem[];
}

export const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({ scans }) => {
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BLOCK':
        return 'bg-rose-950/70 text-rose-300 border-rose-800/80';
      case 'REDACT':
        return 'bg-cyan-950/70 text-cyan-300 border-cyan-800/80';
      case 'WARN':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      case 'ALLOW':
      default:
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return 'text-rose-400 font-semibold';
      case 'MEDIUM':
        return 'text-amber-400 font-semibold';
      default:
        return 'text-emerald-400 font-semibold';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Recent Gateway Scan History
          </h3>
        </div>
        
        {/* Visual Notice required by Section 14 */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
          <Lock className="w-3 h-3 text-cyan-400" />
          <span>Dashboard data contains security metadata only. Sensitive prompt values are not displayed.</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-semibold">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Entity Count</th>
              <th className="py-2.5 px-3">Risk Level</th>
              <th className="py-2.5 px-3">Enforced Action</th>
              <th className="py-2.5 px-3">LLM Provider</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {scans.map((scan) => (
              <tr
                key={scan.id}
                className="hover:bg-slate-800/40 transition-colors font-mono"
              >
                <td className="py-3 px-3 text-slate-300 font-medium">
                  {scan.time}
                </td>
                <td className="py-3 px-3 text-slate-200">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-950 border border-slate-800">
                    {scan.entityCount}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={getRiskBadge(scan.riskLevel)}>
                    {scan.riskLevel}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${getActionBadge(
                      scan.action
                    )}`}
                  >
                    {scan.action}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans">
                  {scan.llmProvider}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
        <span>Displaying latest 8 prompt audit events</span>
        <span className="font-mono text-slate-400">
  Privacy-safe gateway audit metadata
</span>
      </div>
    </div>
  );
};
