import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  glow?: "amber" | "extreme" | null;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  elevated = false,
  glow = null,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        elevated ? "surface-card-elevated" : "surface-card",
        glow === "amber" && "glow-amber",
        glow === "extreme" && "glow-extreme",
        onClick && "cursor-pointer hover:border-[var(--border-prominent)] transition-all duration-150",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
