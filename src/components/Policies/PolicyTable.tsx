import { Sliders, Plus, Edit2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import type { Policy, SensitivityLevel, PolicyAction } from '../../types/privacy';

interface PolicyTableProps {
  policies: Policy[];
  onToggleStatus: (id: string) => void;
  onChangeAction: (id: string, action: PolicyAction) => void;
  onChangeSensitivity: (id: string, sensitivity: SensitivityLevel) => void;
  onEditPolicy: (policy: Policy) => void;
  onOpenAddModal: () => void;
}

export const PolicyTable: React.FC<PolicyTableProps> = ({
  policies,
  onToggleStatus,
  onChangeAction,
  onChangeSensitivity,
  onEditPolicy,
  onOpenAddModal,
}) => {
  const getSensitivityBadge = (level: SensitivityLevel) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-950/70 text-rose-300 border-rose-800/80';
      case 'High':
        return 'bg-orange-950/70 text-orange-300 border-orange-800/80';
      case 'Medium':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/80';
      case 'Low':
      default:
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';
    }
  };

  const getActionBadge = (action: PolicyAction) => {
    switch (action) {
      case 'BLOCK':
        return 'border-rose-500 text-rose-400 bg-rose-950/50';
      case 'REDACT':
        return 'border-cyan-500 text-cyan-400 bg-cyan-950/50';
      case 'WARN':
        return 'border-amber-500 text-amber-400 bg-amber-950/50';
      case 'ALLOW':
      default:
        return 'border-emerald-500 text-emerald-400 bg-emerald-950/50';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Company Data Privacy Policies
            </h3>
            <p className="text-xs text-slate-400">
              Configure sensitive term triggers, severity classifications, and enforcement actions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-950/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Policy</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-semibold">
              <th className="py-2.5 px-3">Term / Category</th>
              <th className="py-2.5 px-3">Sensitivity</th>
              <th className="py-2.5 px-3">Enforcement Action</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {policies.map((policy) => (
              <tr
                key={policy.id}
                className={`hover:bg-slate-800/30 transition-colors ${
                  !policy.enabled ? 'opacity-50' : ''
                }`}
              >
                {/* Term / Category */}
                <td className="py-3 px-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">
                      {policy.termCategory}
                    </span>
                    {policy.description && (
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {policy.description}
                      </span>
                    )}
                  </div>
                </td>

                {/* Sensitivity selector */}
                <td className="py-3 px-3">
                  <select
                    value={policy.sensitivity}
                    onChange={(e) =>
                      onChangeSensitivity(policy.id, e.target.value as SensitivityLevel)
                    }
                    className={`text-[11px] font-semibold px-2 py-1 rounded-md border bg-slate-950 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer ${getSensitivityBadge(
                      policy.sensitivity
                    )}`}
                  >
                    <option value="Low" className="bg-slate-900 text-emerald-300">Low</option>
                    <option value="Medium" className="bg-slate-900 text-amber-300">Medium</option>
                    <option value="High" className="bg-slate-900 text-orange-300">High</option>
                    <option value="Critical" className="bg-slate-900 text-rose-300">Critical</option>
                  </select>
                </td>

                {/* Action selector */}
                <td className="py-3 px-3">
                  <select
                    value={policy.action}
                    onChange={(e) =>
                      onChangeAction(policy.id, e.target.value as PolicyAction)
                    }
                    className={`font-mono text-[11px] font-bold px-2 py-1 rounded-md border bg-slate-950 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer ${getActionBadge(
                      policy.action
                    )}`}
                  >
                    <option value="ALLOW" className="bg-slate-900 text-emerald-300">ALLOW</option>
                    <option value="WARN" className="bg-slate-900 text-amber-300">WARN</option>
                    <option value="REDACT" className="bg-slate-900 text-cyan-300">REDACT</option>
                    <option value="BLOCK" className="bg-slate-900 text-rose-300">BLOCK</option>
                  </select>
                </td>

                {/* Status Toggle */}
                <td className="py-3 px-3">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(policy.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                      policy.enabled
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {policy.enabled ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Controls */}
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onEditPolicy(policy)}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-xs transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>Client-side policy controls: Changes are held in browser state.</span>
        </span>
        <span className="font-mono text-slate-400">{policies.length} Active Rules</span>
      </div>
    </div>
  );
};
