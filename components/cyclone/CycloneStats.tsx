"use client";

import type { Cyclone } from "@/types/cyclone";
import {
  formatWindSpeed,
  formatPressure,
  formatMovement,
  formatCoordinates,
} from "@/lib/utils";
import {
  Wind,
  Gauge,
  Compass,
  MapPin,
  ArrowDown,
  TrendingDown,
} from "lucide-react";

interface CycloneStatsProps {
  cyclone: Cyclone;
}

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  accent?: string;
}

function StatItem({ icon: Icon, label, value, subValue, accent }: StatItemProps) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--bg-primary)]/50">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor: accent ? `${accent}15` : "rgba(255,255,255,0.04)",
          borderColor: accent ? `${accent}30` : "var(--border-subtle)",
        }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: accent || "var(--text-muted)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="text-sm font-semibold text-[var(--text-primary)] font-mono">
          {value}
        </div>
        {subValue && (
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CycloneStats({ cyclone }: CycloneStatsProps) {
  const pos = cyclone.currentPosition;
  const wind = cyclone.windData;
  const pressure = cyclone.pressureData;

  return (
    <div className="grid grid-cols-2 gap-2">
      <StatItem
        icon={Wind}
        label="Max Sustained Wind"
        value={formatWindSpeed(wind.maxSustainedWind)}
        subValue={`Gusts: ${formatWindSpeed(wind.gustSpeed)}`}
        accent="#f59e0b"
      />
      <StatItem
        icon={Gauge}
        label="Central Pressure"
        value={formatPressure(pressure.centralPressure)}
        subValue={`Tendency: ${pressure.pressureTendency > 0 ? "+" : ""}${pressure.pressureTendency} hPa/hr`}
        accent="#3b82f6"
      />
      <StatItem
        icon={Compass}
        label="Movement"
        value={formatMovement(pos.movementSpeed, pos.movementDirection)}
      />
      <StatItem
        icon={MapPin}
        label="Position"
        value={formatCoordinates(pos.latitude, pos.longitude)}
      />
    </div>
  );
}
