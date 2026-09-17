import { useState, useEffect } from 'react';
import { X, ShieldPlus } from 'lucide-react';
import type { Policy, SensitivityLevel, PolicyAction } from '../../types/privacy';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (policy: Policy) => void;
  initialPolicy?: Policy | null;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPolicy,
}) => {
  const [termCategory, setTermCategory] = useState('');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('High');
  const [action, setAction] = useState<PolicyAction>('REDACT');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (initialPolicy) {
      setTermCategory(initialPolicy.termCategory);
      setSensitivity(initialPolicy.sensitivity);
      setAction(initialPolicy.action);
      setDescription(initialPolicy.description || '');
      setEnabled(initialPolicy.enabled);
    } else {
      setTermCategory('');
      setSensitivity('High');
      setAction('REDACT');
      setDescription('');
      setEnabled(true);
    }
  }, [initialPolicy, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termCategory.trim()) return;

    onSave({
      id: initialPolicy ? initialPolicy.id : `pol-${Date.now()}`,
      termCategory: termCategory.trim(),
      sensitivity,
      action,
      enabled,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShieldPlus className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-semibold text-slate-100">
              {initialPolicy ? 'Edit Privacy Policy Rule' : 'Add New Privacy Policy Rule'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Term / Category Name
            </label>
            <input
              type="text"
              required
              value={termCategory}
              onChange={(e) => setTermCategory(e.target.value)}
              placeholder="e.g. Project Titan, AWS Credentials, Social Security..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Sensitivity Level
              </label>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value as SensitivityLevel)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Gateway Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as PolicyAction)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
              >
                <option value="ALLOW">ALLOW</option>
                <option value="WARN">WARN</option>
                <option value="REDACT">REDACT</option>
                <option value="BLOCK">BLOCK</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Policy Scope
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of the detection rule or company data classification..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="policy-enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
            <label htmlFor="policy-enabled" className="text-xs text-slate-300">
              Policy Rule Enabled (Active in gateway inspection)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/40 transition-colors"
            >
              {initialPolicy ? 'Save Changes' : 'Create Policy Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
