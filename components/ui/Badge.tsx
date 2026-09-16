import { cn } from "@/lib/utils";
import { CycloneCategory } from "@/types/cyclone";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  bgColor?: string;
}

export function Badge({ children, className, color, bgColor }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide border",
        className
      )}
      style={{
        color: color || "var(--text-secondary)",
        backgroundColor: bgColor || "rgba(255,255,255,0.05)",
        borderColor: color ? `${color}33` : "var(--border-subtle)",
      }}
    >
      {children}
    </span>
  );
}

interface CategoryBadgeProps {
  category: CycloneCategory;
  className?: string;
  showLabel?: boolean;
}

export function CategoryBadge({
  category,
  className,
  showLabel = false,
}: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  return (
    <Badge
      color={config.color}
      bgColor={config.bgColor}
      className={className}
    >
      {showLabel ? config.label : config.shortLabel}
    </Badge>
  );
}
