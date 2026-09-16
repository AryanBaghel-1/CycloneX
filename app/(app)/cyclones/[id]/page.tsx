"use client";

import { useState, useEffect, use } from "react";
import type { Cyclone, AIPrediction } from "@/types/cyclone";
import { getCycloneById } from "@/lib/api";
import CycloneHeader from "@/components/cyclone/CycloneHeader";
import CycloneStats from "@/components/cyclone/CycloneStats";
import ForecastPanel from "@/components/cyclone/ForecastPanel";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/Loading";
import { ArrowLeft, Globe } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import dynamic from "next/dynamic";

const CycloneGlobe = dynamic(
  () => import("@/components/globe/CycloneGlobe"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[var(--bg-primary)] rounded-lg">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border-subtle)] border-t-amber-400" />
      </div>
    ),
  }
);

export default function CycloneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [cyclone, setCyclone] = useState<Cyclone | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await getCycloneById(id);
      if (!response) {
        setNotFound(true);
      } else {
        setCyclone(response.cyclone);
        setPrediction(response.predictions[0] ?? null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return <LoadingScreen label="Loading cyclone data..." />;
  }

  if (notFound || !cyclone) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-sm text-[var(--text-muted)]">Cyclone not found.</p>
          <Link
            href={ROUTES.CYCLONES}
            className="flex items-center gap-1.5 text-sm text-amber-400 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Cyclones
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-6">
      {/* Back link */}
      <Link
        href={ROUTES.CYCLONES}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-4"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Cyclones
      </Link>

      {/* Header */}
      <Card className="p-5 mb-4">
        <CycloneHeader cyclone={cyclone} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — Stats + Forecast */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Current Conditions
            </h2>
            <CycloneStats cyclone={cyclone} />
          </Card>

          <Card className="p-4">
            <ForecastPanel
              forecast={cyclone.forecast}
              prediction={prediction}
            />
          </Card>
        </div>

        {/* Right column — Mini Globe */}
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden h-[500px] lg:h-full">
            <div className="relative h-full min-h-[400px]">
              <CycloneGlobe
                cyclones={[cyclone]}
                selectedCycloneId={cyclone.id}
                onSelectCyclone={() => {}}
              />
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
