import { NavLink } from 'react-router-dom';
import { MessageSquare, BarChart3, Sliders, ShieldCheck } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Secure Chat - Primary Experience */}
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`
              }
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Secure Chat</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Primary
              </span>
            </NavLink>

            {/* Security Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`
              }
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Security Dashboard</span>
            </NavLink>

            {/* Company Policies */}
            <NavLink
              to="/policies"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`
              }
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Company Policies</span>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center text-xs text-slate-400 gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Raw Prompts Sent To External AI</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
