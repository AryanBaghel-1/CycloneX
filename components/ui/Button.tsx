import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50",
  secondary:
    "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-prominent)] hover:bg-white/[0.06] hover:text-[var(--text-primary)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-white/[0.04] hover:text-[var(--text-primary)]",
  danger:
    "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2.5 py-1 text-xs gap-1.5",
  md: "px-3.5 py-1.5 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-150 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
