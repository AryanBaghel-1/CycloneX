import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function LoadingSpinner({ className, size = "md" }: LoadingProps) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-[var(--border-subtle)] border-t-amber-400",
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingScreen({ label = "Loading..." }: LoadingProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 min-h-[300px]">
      <LoadingSpinner size="lg" />
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[var(--bg-surface-elevated)]",
        className
      )}
    />
  );
}
