"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Cyclone, AIPrediction } from "@/types/cyclone";
import { getCyclones, getAIPredictions } from "@/lib/api";
import CycloneCard from "@/components/cyclone/CycloneCard";
import CycloneStats from "@/components/cyclone/CycloneStats";
import CycloneHeader from "@/components/cyclone/CycloneHeader";
import ForecastPanel from "@/components/cyclone/ForecastPanel";
import { LoadingScreen } from "@/components/ui/Loading";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

// Dynamic import for CesiumJS globe — SSR disabled
const CycloneGlobe = dynamic(
  () => import("@/components/globe/CycloneGlobe"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-subtle)] border-t-amber-400" />
          <span className="text-xs text-[var(--text-muted)] tracking-wide">
            LOADING GLOBE
          </span>
        </div>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cyclones
  useEffect(() => {
    async function load() {
      const response = await getCyclones();
      setCyclones(response.cyclones);
      setLoading(false);
    }
    load();
  }, []);

  // Load AI prediction when a cyclone is selected
  useEffect(() => {
    if (!selectedId) {
      setPrediction(null);
      return;
    }
    async function loadPrediction() {
      const predictions = await getAIPredictions(selectedId!);
      setPrediction(predictions[0] ?? null);
    }
    loadPrediction();
  }, [selectedId]);

  const selectedCyclone = cyclones.find((c) => c.id === selectedId) ?? null;

  if (loading) {
    return <LoadingScreen label="Loading cyclone data..." />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Globe — full window background */}
      <div className="absolute inset-0 z-0">
        <CycloneGlobe
          cyclones={cyclones}
          selectedCycloneId={selectedId}
          onSelectCyclone={setSelectedId}
        />
      </div>

      {/* Left sidebar panel — cyclone list (floating overlay) */}
      <div className="absolute top-3 left-3 bottom-3 z-10 flex w-[300px] flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Active Cyclones
            </h2>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
              {cyclones.length} systems tracked
            </p>
          </div>
        </div>

        {/* Cyclone list */}
        <div className="flex-1 overflow-auto p-3 space-y-2">
          {cyclones.map((cyclone) => (
            <CycloneCard
              key={cyclone.id}
              cyclone={cyclone}
              isSelected={cyclone.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      {/* Right detail panel — shown when cyclone is selected (floating overlay) */}
      {selectedCyclone && (
        <div className="absolute top-3 right-3 bottom-3 z-20 w-[360px] flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-xl shadow-2xl shadow-black/40 animate-fade-in">
          {/* Close + View Detail */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Cyclone Detail
            </span>
            <div className="flex items-center gap-1">
              <Link
                href={ROUTES.CYCLONE_DETAIL(selectedCyclone.id)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-amber-400 hover:bg-amber-500/10 transition-colors"
              >
                Full Analysis
                <ChevronRight className="h-3 w-3" />
              </Link>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-white/[0.06] hover:text-[var(--text-secondary)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            <CycloneHeader cyclone={selectedCyclone} />
            <CycloneStats cyclone={selectedCyclone} />
            <ForecastPanel
              forecast={selectedCyclone.forecast}
              prediction={prediction}
            />
          </div>
        </div>
      )}
    </div>
  );
}
