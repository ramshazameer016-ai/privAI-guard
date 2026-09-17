import { FileCode, ArrowRight, Lock } from 'lucide-react';
import type { RedactionResult } from '../../types/privacy';

interface RedactionPanelProps {
  redaction: RedactionResult;
}

export const RedactionPanel: React.FC<RedactionPanelProps> = ({ redaction }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Redaction & Token Mapping
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
            Redactions performed: {redaction.redactionsPerformed}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Entity values are replaced with reversible scoped surrogate tokens before leaving the gateway perimeter.
        </p>

        {/* Mappings */}
        <div className="space-y-2">
          {redaction.mappings.map((map, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">
                  {map.entityType.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {map.placeholder}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5 text-emerald-400/90">
          <Lock className="w-3 h-3" />
          Mapping held in transient memory only
        </span>
        <span className="font-mono text-slate-400">Reversible token schema</span>
      </div>
    </div>
  );
};
