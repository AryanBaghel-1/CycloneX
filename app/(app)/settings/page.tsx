"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Settings as SettingsIcon, Monitor, Wind, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
  const [units, setUnits] = useState<"nautical" | "metric" | "imperial">("nautical");
  const [coordFormat, setCoordFormat] = useState<"decimal" | "dms">("decimal");
  const [notifications, setNotifications] = useState(true);

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <SettingsIcon className="h-5 w-5 text-amber-400" />
        <h1 className="text-lg font-bold text-[var(--text-primary)]">
          Settings
        </h1>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Unit Preferences */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="h-4 w-4 text-[var(--text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Unit System
            </h2>
          </div>
          <div className="flex gap-2">
            {(["nautical", "metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors border ${
                  units === u
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-white/[0.04]"
                }`}
              >
                {u === "nautical" && "Knots / hPa"}
                {u === "metric" && "km/h / hPa"}
                {u === "imperial" && "mph / inHg"}
              </button>
            ))}
          </div>
        </Card>

        {/* Coordinate Format */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-[var(--text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Coordinate Format
            </h2>
          </div>
          <div className="flex gap-2">
            {(["decimal", "dms"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setCoordFormat(f)}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors border ${
                  coordFormat === f
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-white/[0.04]"
                }`}
              >
                {f === "decimal" && "Decimal Degrees (18.4°N)"}
                {f === "dms" && "DMS (18° 24' 00\" N)"}
              </button>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[var(--text-muted)]" />
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Alert Notifications
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Receive push notifications for new cyclone alerts
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                notifications
                  ? "bg-amber-500/30"
                  : "bg-[var(--border-subtle)]"
              }`}
            >
              <div
                className={`absolute top-1 h-4 w-4 rounded-full transition-all ${
                  notifications
                    ? "left-6 bg-amber-400"
                    : "left-1 bg-[var(--text-muted)]"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Display */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-4 w-4 text-[var(--text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Display
            </h2>
          </div>
          <div className="space-y-3 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <span className="text-[var(--text-muted)]">Dark (Default)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Globe Quality</span>
              <span className="text-[var(--text-muted)]">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Animation Speed</span>
              <span className="text-[var(--text-muted)]">Normal</span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
