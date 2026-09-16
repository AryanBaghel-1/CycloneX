import { CycloneCategory, AlertSeverity, type ActiveLayers } from "@/types/cyclone";

// ─── Cyclone Category Configuration ──────────────────────────────────────────

export interface CategoryConfig {
  label: string;
  shortLabel: string;
  minWind: number; // knots
  maxWind: number; // knots
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}

export const CATEGORY_CONFIG: Record<CycloneCategory, CategoryConfig> = {
  [CycloneCategory.TD]: {
    label: "Tropical Depression",
    shortLabel: "TD",
    minWind: 0,
    maxWind: 33,
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.15)",
    borderColor: "rgba(100, 116, 139, 0.4)",
    glowColor: "rgba(100, 116, 139, 0.2)",
  },
  [CycloneCategory.TS]: {
    label: "Tropical Storm",
    shortLabel: "TS",
    minWind: 34,
    maxWind: 63,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "rgba(59, 130, 246, 0.4)",
    glowColor: "rgba(59, 130, 246, 0.2)",
  },
  [CycloneCategory.C1]: {
    label: "Category 1",
    shortLabel: "C1",
    minWind: 64,
    maxWind: 82,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.4)",
    glowColor: "rgba(34, 197, 94, 0.2)",
  },
  [CycloneCategory.C2]: {
    label: "Category 2",
    shortLabel: "C2",
    minWind: 83,
    maxWind: 95,
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    borderColor: "rgba(234, 179, 8, 0.4)",
    glowColor: "rgba(234, 179, 8, 0.2)",
  },
  [CycloneCategory.C3]: {
    label: "Category 3",
    shortLabel: "C3",
    minWind: 96,
    maxWind: 112,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    borderColor: "rgba(249, 115, 22, 0.4)",
    glowColor: "rgba(249, 115, 22, 0.2)",
  },
  [CycloneCategory.C4]: {
    label: "Category 4",
    shortLabel: "C4",
    minWind: 113,
    maxWind: 136,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    glowColor: "rgba(239, 68, 68, 0.2)",
  },
  [CycloneCategory.C5]: {
    label: "Category 5",
    shortLabel: "C5",
    minWind: 137,
    maxWind: 999,
    color: "#f43f5e",
    bgColor: "rgba(244, 63, 94, 0.15)",
    borderColor: "rgba(244, 63, 94, 0.4)",
    glowColor: "rgba(244, 63, 94, 0.2)",
  },
};

// ─── Alert Severity Configuration ────────────────────────────────────────────

export const ALERT_SEVERITY_CONFIG: Record<
  AlertSeverity,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  [AlertSeverity.INFORMATION]: {
    label: "Information",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    icon: "info",
  },
  [AlertSeverity.WATCH]: {
    label: "Watch",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.15)",
    icon: "eye",
  },
  [AlertSeverity.WARNING]: {
    label: "Warning",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    icon: "alert-triangle",
  },
  [AlertSeverity.EMERGENCY]: {
    label: "Emergency",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    icon: "alert-octagon",
  },
};

// ─── Routes ──────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  CYCLONES: "/cyclones",
  CYCLONE_DETAIL: (id: string) => `/cyclones/${id}`,
  ALERTS: "/alerts",
  ANALYSIS: "/analysis",
  HISTORY: "/history",
  SETTINGS: "/settings",
  ABOUT: "/about",
} as const;

// ─── Default Layers ──────────────────────────────────────────────────────────

export const DEFAULT_LAYERS: ActiveLayers = {
  satellite: true,
  wind: false,
  pressure: false,
  radar: false,
  infrared: false,
};

// ─── Cesium Defaults ─────────────────────────────────────────────────────────

export const CESIUM_DEFAULTS = {
  DEFAULT_CAMERA: {
    longitude: 90.0,
    latitude: 15.0,
    height: 8_000_000,
  },
  ANIMATION: false,
  TIMELINE: false,
  BASE_LAYER_PICKER: false,
  GEOCODER: false,
  HOME_BUTTON: false,
  NAVIGATION_HELP_BUTTON: false,
  SCENE_MODE_PICKER: false,
  SELECTION_INDICATOR: false,
  INFO_BOX: false,
  FULLSCREEN_BUTTON: false,
} as const;

// ─── Basin Labels ────────────────────────────────────────────────────────────

export const BASIN_LABELS: Record<string, string> = {
  NA: "North Atlantic",
  EP: "Eastern Pacific",
  WP: "Western Pacific",
  NI: "North Indian",
  SI: "South Indian",
  SP: "South Pacific",
  SA: "South Atlantic",
};

// ─── Time Formats ────────────────────────────────────────────────────────────

export const FORECAST_HOURS = [12, 24, 36, 48, 72, 96, 120] as const;
