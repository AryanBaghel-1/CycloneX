"use client";

import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Wind,
  Gauge,
  Satellite,
  Radio,
  ScanLine,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ActiveLayers } from "@/types/cyclone";

interface GlobeControlsProps {
  activeLayers: ActiveLayers;
  onToggleLayer: (layer: keyof ActiveLayers) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const LAYER_OPTIONS: {
  key: keyof ActiveLayers;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "satellite", label: "Satellite", icon: Satellite },
  { key: "wind", label: "Wind", icon: Wind },
  { key: "pressure", label: "Pressure", icon: Gauge },
  { key: "radar", label: "Radar", icon: Radio },
  { key: "infrared", label: "Infrared", icon: ScanLine },
];

export default function GlobeControls({
  activeLayers,
  onToggleLayer,
  onZoomIn,
  onZoomOut,
  onResetView,
}: GlobeControlsProps) {
  const [showLayers, setShowLayers] = useState(false);

  return (
    <>
      {/* Zoom + Reset controls — bottom right */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors backdrop-blur-sm"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onZoomOut}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors backdrop-blur-sm"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onResetView}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors backdrop-blur-sm"
          title="Reset View"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Layer toggle — top right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-sm transition-colors",
            showLayers
              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
              : "bg-[var(--bg-surface)]/90 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
          )}
          title="Layers"
        >
          <Layers className="h-3.5 w-3.5" />
        </button>

        {/* Layer dropdown */}
        {showLayers && (
          <div className="absolute top-10 right-0 w-44 rounded-lg bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] backdrop-blur-md p-1.5 animate-fade-in">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Map Layers
            </div>
            {LAYER_OPTIONS.map((layer) => {
              const active = activeLayers[layer.key];
              return (
                <button
                  key={layer.key}
                  onClick={() => onToggleLayer(layer.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-[var(--text-secondary)] hover:bg-white/[0.04]"
                  )}
                >
                  <layer.icon className="h-3.5 w-3.5" />
                  <span>{layer.label}</span>
                  <div
                    className={cn(
                      "ml-auto h-2 w-2 rounded-full",
                      active ? "bg-amber-400" : "bg-[var(--border-subtle)]"
                    )}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
