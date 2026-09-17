import { ShieldCheck, RotateCcw } from 'lucide-react';

interface ChatInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onScanAndSend: () => void;
  isScanning: boolean;
  onResetPrompt: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  prompt,
  setPrompt,
  onScanAndSend,
  isScanning,
  onResetPrompt,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <label htmlFor="prompt-input" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Employee Prompt Input
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetPrompt}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            title="Reset to default hackathon demo prompt"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Load Demo Prompt</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isScanning}
          rows={3}
          placeholder="Paste or type employee prompt containing questions, project names, or code..."
          className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none font-sans leading-relaxed transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>PrivAI Guard will inspect deterministic patterns, NER entities, and dictionaries.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onScanAndSend}
            disabled={isScanning || !prompt.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-950/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-900/40 cursor-pointer"
          >
            {isScanning ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Inspecting Gateway...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Scan & Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
