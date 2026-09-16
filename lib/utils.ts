import { CycloneCategory, type UnitSystem } from "@/types/cyclone";
import { CATEGORY_CONFIG } from "./constants";

// ─── Classname Merge ─────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Category Utilities ──────────────────────────────────────────────────────

export function getCategoryFromWindSpeed(
  windSpeedKnots: number
): CycloneCategory {
  if (windSpeedKnots >= 137) return CycloneCategory.C5;
  if (windSpeedKnots >= 113) return CycloneCategory.C4;
  if (windSpeedKnots >= 96) return CycloneCategory.C3;
  if (windSpeedKnots >= 83) return CycloneCategory.C2;
  if (windSpeedKnots >= 64) return CycloneCategory.C1;
  if (windSpeedKnots >= 34) return CycloneCategory.TS;
  return CycloneCategory.TD;
}

export function getCategoryColor(category: CycloneCategory): string {
  return CATEGORY_CONFIG[category].color;
}

export function getCategoryLabel(category: CycloneCategory): string {
  return CATEGORY_CONFIG[category].label;
}

// ─── Coordinate Formatting ───────────────────────────────────────────────────

export function formatLatitude(lat: number): string {
  const dir = lat >= 0 ? "N" : "S";
  return `${Math.abs(lat).toFixed(1)}°${dir}`;
}

export function formatLongitude(lon: number): string {
  const dir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lon).toFixed(1)}°${dir}`;
}

export function formatCoordinates(lat: number, lon: number): string {
  return `${formatLatitude(lat)}, ${formatLongitude(lon)}`;
}

// ─── Unit Conversions ────────────────────────────────────────────────────────

export function knotsToKmh(knots: number): number {
  return Math.round(knots * 1.852);
}

export function knotsToMph(knots: number): number {
  return Math.round(knots * 1.15078);
}

export function formatWindSpeed(
  knots: number,
  system: UnitSystem = "nautical"
): string {
  switch (system) {
    case "metric":
      return `${knotsToKmh(knots)} km/h`;
    case "imperial":
      return `${knotsToMph(knots)} mph`;
    case "nautical":
    default:
      return `${knots} kt`;
  }
}

export function formatPressure(hPa: number): string {
  return `${hPa} hPa`;
}

// ─── Direction Formatting ────────────────────────────────────────────────────

export function degreesToCardinal(degrees: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatMovement(speed: number, direction: number): string {
  return `${degreesToCardinal(direction)} at ${speed} kt`;
}

// ─── Time Formatting ─────────────────────────────────────────────────────────

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

// ─── Confidence Formatting ───────────────────────────────────────────────────

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "#22c55e";
  if (confidence >= 0.6) return "#eab308";
  if (confidence >= 0.4) return "#f97316";
  return "#ef4444";
}
