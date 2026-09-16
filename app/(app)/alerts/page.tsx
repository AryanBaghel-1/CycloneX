"use client";

import { useState, useEffect } from "react";
import type { CycloneAlert } from "@/types/cyclone";
import { getAlerts } from "@/lib/api";
import AlertCard from "@/components/alerts/AlertCard";
import PageContainer from "@/components/layout/PageContainer";
import { LoadingScreen } from "@/components/ui/Loading";
import { AlertTriangle, Bell } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<CycloneAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await getAlerts();
      setAlerts(response.alerts);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <LoadingScreen label="Loading alerts..." />;
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Alerts & Warnings
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {alerts.length} active alerts
          </p>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3 max-w-3xl">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      {/* Empty state */}
      {alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="h-8 w-8 text-[var(--text-muted)] mb-3" />
          <p className="text-sm text-[var(--text-muted)]">
            No active alerts at this time.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
