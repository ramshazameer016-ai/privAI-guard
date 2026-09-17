import { ShieldAlert, User, Building2, FolderGit2, Key, Tag } from 'lucide-react';
import type { Detection } from '../../types/privacy';

interface DetectionListProps {
  detections: Detection[];
}

export const DetectionList: React.FC<DetectionListProps> = ({ detections }) => {
  const getEntityIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PERSON':
        return <User className="w-4 h-4 text-emerald-400" />;
      case 'ORGANIZATION':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'PROJECT':
        return <FolderGit2 className="w-4 h-4 text-purple-400" />;
      case 'API_KEY':
        return <Key className="w-4 h-4 text-rose-400" />;
      default:
        return <Tag className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEntityBadgeStyle = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PERSON':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
      case 'ORGANIZATION':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
      case 'PROJECT':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      case 'API_KEY':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Detected Sensitive Information
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-800/60">
          {detections.length} entities detected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {detections.map((det) => (
          <div
            key={det.id}
            className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${getEntityBadgeStyle(
                  det.entityType
                )}`}
              >
                {getEntityIcon(det.entityType)}
                {det.entityType.replace('_', ' ')}
              </span>

              <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Confidence: {(det.confidence * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Masked Preview:</span>
                <span className="font-mono font-semibold text-slate-200 tracking-wider">
                  {det.maskedPreview}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Assigned Token:</span>
                <span className="font-mono text-cyan-300 font-medium">
                  {det.placeholder}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
              <span>Source: {det.source || 'hybrid detection'}</span>
              <span className="text-emerald-500/80 font-medium">Raw value masked</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
