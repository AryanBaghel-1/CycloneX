import type { CycloneAlert } from "@/types/cyclone";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ALERT_SEVERITY_CONFIG } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";
import {
  Info,
  Eye,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

const SEVERITY_ICONS: Record<string, React.ElementType> = {
  info: Info,
  eye: Eye,
  "alert-triangle": AlertTriangle,
  "alert-octagon": AlertOctagon,
};

interface AlertCardProps {
  alert: CycloneAlert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const config = ALERT_SEVERITY_CONFIG[alert.severity];
  const Icon = SEVERITY_ICONS[config.icon] || Info;

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: config.bgColor,
            border: `1px solid ${config.color}33`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color: config.color }} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {alert.title}
            </h3>
            <Badge color={config.color} bgColor={config.bgColor}>
              {config.label}
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
            {alert.message}
          </p>

          {/* Affected areas */}
          <div className="flex flex-wrap gap-1 mb-2">
            {alert.affectedAreas.map((area) => (
              <span
                key={area}
                className="inline-block rounded-md bg-white/[0.04] border border-[var(--border-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]"
              >
                {area}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)]">
            <span>{cycloneName(alert)}</span>
            <span>·</span>
            <span>{alert.source}</span>
            <span>·</span>
            <span>Issued {formatRelativeTime(alert.issuedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function cycloneName(alert: CycloneAlert): string {
  return alert.cycloneName;
}
