"use client";

import { useState, useEffect } from "react";
import type { Cyclone } from "@/types/cyclone";
import { getCyclones } from "@/lib/api";
import CycloneCard from "@/components/cyclone/CycloneCard";
import PageContainer from "@/components/layout/PageContainer";
import { LoadingScreen } from "@/components/ui/Loading";
import { Search, Filter, Radar } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function CyclonesPage() {
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const response = await getCyclones();
      setCyclones(response.cyclones);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = cyclones.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen label="Loading cyclones..." />;
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radar className="h-5 w-5 text-amber-400" />
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Cyclones
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            All tracked cyclone systems — {cyclones.length} total
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search cyclones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500/30 transition-colors"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((cyclone) => (
          <Link key={cyclone.id} href={ROUTES.CYCLONE_DETAIL(cyclone.id)}>
            <CycloneCard cyclone={cyclone} />
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Radar className="h-8 w-8 text-[var(--text-muted)] mb-3" />
          <p className="text-sm text-[var(--text-muted)]">
            No cyclones match your search.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
