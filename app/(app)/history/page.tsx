"use client";

import { useState, useEffect } from "react";
import type { Cyclone } from "@/types/cyclone";
import { getCyclones } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import { CategoryBadge } from "@/components/ui/Badge";
import { LoadingScreen } from "@/components/ui/Loading";
import { History, Calendar, TrendingUp, Activity } from "lucide-react";
import { BASIN_LABELS } from "@/lib/constants";
import { formatWindSpeed, formatPressure, formatCoordinates } from "@/lib/utils";

export default function HistoryPage() {
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(2025);

  useEffect(() => {
    async function load() {
      const response = await getCyclones();
      setCyclones(response.cyclones);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <LoadingScreen label="Loading historical data..." />;
  }

  const seasonCyclones = cyclones.filter((c) => c.season === selectedSeason);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="h-5 w-5 text-amber-400" />
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Historical Analysis
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Browse past cyclone seasons and historical data
          </p>
        </div>
      </div>

      {/* Season selector */}
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        <span className="text-xs text-[var(--text-muted)]">Season:</span>
        {[2025, 2024, 2023].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedSeason(year)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              selectedSeason === year
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "text-[var(--text-secondary)] hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Season Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Total Systems
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {seasonCyclones.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Peak Intensity
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {seasonCyclones.length > 0
              ? formatWindSpeed(
                  Math.max(...seasonCyclones.map((c) => c.currentPosition.windSpeed))
                )
              : "—"}
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Active Basins
            </span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-mono">
            {new Set(seasonCyclones.map((c) => c.basin)).size}
          </div>
        </Card>
      </div>

      {/* Cyclone table */}
      <Card className="overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
              <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Basin
              </th>
              <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Max Wind
              </th>
              <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Min Pressure
              </th>
              <th className="text-left px-4 py-2.5 text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {seasonCyclones.map((cyclone) => (
              <tr
                key={cyclone.id}
                className="border-b border-[var(--border-subtle)] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-[var(--text-primary)]">
                    {cyclone.name}
                  </div>
                  <div className="text-[var(--text-muted)] font-mono">
                    {cyclone.id}
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {BASIN_LABELS[cyclone.basin] ?? cyclone.basin}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge
                    category={cyclone.currentPosition.category}
                    showLabel
                  />
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] font-mono">
                  {formatWindSpeed(cyclone.currentPosition.windSpeed)}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] font-mono">
                  {formatPressure(cyclone.pressureData.centralPressure)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        cyclone.status === "ACTIVE"
                          ? "bg-emerald-400"
                          : "bg-[var(--text-muted)]"
                      }`}
                    />
                    <span className="text-[var(--text-secondary)] capitalize">
                      {cyclone.status.toLowerCase().replace("_", " ")}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {seasonCyclones.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <History className="h-6 w-6 text-[var(--text-muted)] mb-2" />
            <p className="text-xs text-[var(--text-muted)]">
              No historical data for this season.
            </p>
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
