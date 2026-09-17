import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { SecureChatPage } from './pages/SecureChatPage';
import { DashboardPage } from './pages/DashboardPage';
import PoliciesPage from './pages/PoliciesPage';
import { Shield, Lock } from 'lucide-react';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Persistent Top Header */}
        <Header />

        {/* Persistent Navigation Bar */}
        <Navigation />

        {/* Main Content Viewport */}
        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/chat" element={<SecureChatPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </main>

        {/* Persistent Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              <span className="font-semibold text-slate-400">PrivAI Guard</span>
              <span>— AI Privacy Gateway</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 text-center sm:text-right">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>PrivAI Guard is designed to prevent successfully detected sensitive values from being sent to the external AI.</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
