import { useState, useEffect } from 'react';
import { MetricsGrid } from '../components/Dashboard/MetricsGrid';
import { RiskDistribution } from '../components/Dashboard/RiskDistribution';
import { EntityBreakdown } from '../components/Dashboard/EntityBreakdown';
import { ScanHistoryTable } from '../components/Dashboard/ScanHistoryTable';
import { fetchDashboardMetrics } from '../api/client';
import type { DashboardMetrics } from '../types/privacy';
import { BarChart3 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics().then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
          <span>Loading privacy gateway telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              AI Privacy Gateway Security Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Real-time audit metadata, threat mitigation metrics, and entity redaction intelligence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300">
            Audit Scope: Gateway Telemetry Only
          </span>
        </div>
      </div>

      {/* High-Level Privacy Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* Risk Distribution & Entity Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistribution distribution={metrics.riskDistribution} />
        <EntityBreakdown breakdown={metrics.entityTypeBreakdown} />
      </div>

      {/* Recent Scan History (Metadata only) */}
      <ScanHistoryTable scans={metrics.recentScans} />
    </div>
  );
};
