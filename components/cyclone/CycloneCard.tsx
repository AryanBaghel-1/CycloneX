"use client";

import type { Cyclone } from "@/types/cyclone";
import { CategoryBadge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { getCategoryColor, formatCoordinates, formatWindSpeed, formatPressure } from "@/lib/utils";
import { BASIN_LABELS } from "@/lib/constants";
import { Wind, Gauge, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CycloneCardProps {
  cyclone: Cyclone;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  compact?: boolean;
}

export default function CycloneCard({
  cyclone,
  isSelected = false,
  onSelect,
  compact = false,
}: CycloneCardProps) {
  const pos = cyclone.currentPosition;
  const color = getCategoryColor(pos.category);

  return (
    <Card
      className={cn(
        "p-3 transition-all duration-200",
        isSelected && "border-amber-500/30 bg-amber-500/[0.04]",
        onSelect && "cursor-pointer"
      )}
      onClick={() => onSelect?.(cyclone.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className="h-2 w-2 rounded-full shrink-0 animate-thermal-pulse"
              style={{ backgroundColor: color }}
            />
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {cyclone.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span>{cyclone.id}</span>
            <span>·</span>
            <span>{BASIN_LABELS[cyclone.basin] ?? cyclone.basin}</span>
          </div>
        </div>
        <CategoryBadge category={pos.category} />
      </div>

      {/* Stats Grid */}
      {!compact && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Wind className="h-3 w-3 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)] font-mono">
              {formatWindSpeed(pos.windSpeed)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Gauge className="h-3 w-3 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)] font-mono">
              {formatPressure(pos.pressure)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs col-span-2">
            <MapPin className="h-3 w-3 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)] font-mono">
              {formatCoordinates(pos.latitude, pos.longitude)}
            </span>
          </div>
        </div>
      )}

      {/* Source + Advisory */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)]">
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          {cyclone.source} · {cyclone.advisoryNumber}
        </span>
        {onSelect && (
          <ArrowUpRight className="h-3 w-3 text-[var(--text-muted)]" />
        )}
      </div>
    </Card>
  );
}
