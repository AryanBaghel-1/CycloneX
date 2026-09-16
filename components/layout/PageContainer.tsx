import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** If true, removes default padding — useful for full-bleed content like the globe */
  fullBleed?: boolean;
}

export default function PageContainer({
  children,
  className,
  fullBleed = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "min-h-full w-full",
        !fullBleed && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
