import type { Cyclone } from "@/types/cyclone";
import { CategoryBadge } from "@/components/ui/Badge";
import { getCategoryColor, formatRelativeTime } from "@/lib/utils";
import { BASIN_LABELS } from "@/lib/constants";

interface CycloneHeaderProps {
  cyclone: Cyclone;
}

export default function CycloneHeader({ cyclone }: CycloneHeaderProps) {
  const color = getCategoryColor(cyclone.currentPosition.category);

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="h-3 w-3 rounded-full animate-thermal-pulse"
            style={{ backgroundColor: color }}
          />
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            {cyclone.name}
          </h1>
          <CategoryBadge category={cyclone.currentPosition.category} showLabel />
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] ml-6">
          <span className="font-mono">{cyclone.id}</span>
          <span>·</span>
          <span>{BASIN_LABELS[cyclone.basin] ?? cyclone.basin}</span>
          <span>·</span>
          <span>{cyclone.source}</span>
          <span>·</span>
          <span>{cyclone.advisoryNumber}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          Last Updated
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {formatRelativeTime(cyclone.lastUpdated)}
        </div>
      </div>
    </div>
  );
}
