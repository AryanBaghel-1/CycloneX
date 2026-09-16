// ─── Enums ────────────────────────────────────────────────────────────────────

export enum CycloneCategory {
  TD = "TD", // Tropical Depression
  TS = "TS", // Tropical Storm
  C1 = "C1", // Category 1
  C2 = "C2", // Category 2
  C3 = "C3", // Category 3
  C4 = "C4", // Category 4
  C5 = "C5", // Category 5
}

export enum CycloneStatus {
  ACTIVE = "ACTIVE",
  DISSIPATED = "DISSIPATED",
  POST_TROPICAL = "POST_TROPICAL",
  SUBTROPICAL = "SUBTROPICAL",
}

export enum AlertSeverity {
  INFORMATION = "INFORMATION",
  WATCH = "WATCH",
  WARNING = "WARNING",
  EMERGENCY = "EMERGENCY",
}

export enum BasinCode {
  NA = "NA", // North Atlantic
  EP = "EP", // Eastern Pacific
  WP = "WP", // Western Pacific
  NI = "NI", // North Indian
  SI = "SI", // South Indian
  SP = "SP", // South Pacific
  SA = "SA", // South Atlantic
}

// ─── Core Position ────────────────────────────────────────────────────────────

export interface GeoCoordinate {
  latitude: number; // decimal degrees, -90 to 90
  longitude: number; // decimal degrees, -180 to 180
}

export interface CyclonePosition extends GeoCoordinate {
  timestamp: string; // ISO 8601
  windSpeed: number; // knots
  pressure: number; // hPa / mbar
  category: CycloneCategory;
  movementSpeed: number; // knots
  movementDirection: number; // degrees (0-360, meteorological)
}

// ─── Track Points ─────────────────────────────────────────────────────────────

export interface CycloneTrackPoint extends GeoCoordinate {
  timestamp: string;
  windSpeed: number;
  pressure: number;
  category: CycloneCategory;
}

export interface ForecastPoint extends GeoCoordinate {
  forecastHour: number; // hours from now (e.g. 12, 24, 48, 72, 96, 120)
  timestamp: string; // projected timestamp
  windSpeed: number;
  pressure: number;
  category: CycloneCategory;
  confidence: number; // 0.0 - 1.0
}

export interface ForecastConePoint extends GeoCoordinate {
  forecastHour: number;
}

export interface ForecastCone {
  centerLine: ForecastPoint[];
  conePolygon: ForecastConePoint[]; // ordered polygon vertices
  generatedAt: string;
}

// ─── Wind & Pressure ──────────────────────────────────────────────────────────

export interface WindRadii {
  ne: number; // nautical miles
  se: number;
  sw: number;
  nw: number;
}

export interface WindData {
  maxSustainedWind: number; // knots
  gustSpeed: number; // knots
  windRadii34kt: WindRadii;
  windRadii50kt: WindRadii;
  windRadii64kt: WindRadii;
  timestamp: string;
}

export interface PressureData {
  centralPressure: number; // hPa
  outerPressure: number; // hPa
  pressureTendency: number; // hPa/hr (negative = deepening)
  timestamp: string;
}

// ─── Cyclone Entity ───────────────────────────────────────────────────────────

export interface Cyclone {
  id: string; // stable identifier, e.g. "AL052025"
  name: string; // e.g. "TYPHOON HAIYAN"
  basin: BasinCode;
  season: number; // e.g. 2025
  status: CycloneStatus;
  currentPosition: CyclonePosition;
  track: CycloneTrackPoint[]; // historical observed track
  forecast: ForecastPoint[]; // official forecast points
  forecastCone: ForecastCone | null;
  windData: WindData;
  pressureData: PressureData;
  formationDate: string; // ISO 8601
  lastUpdated: string; // ISO 8601
  advisoryNumber: string; // e.g. "Advisory 14"
  source: string; // e.g. "JTWC", "NHC", "IMD"
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface CycloneAlert {
  id: string;
  cycloneId: string;
  cycloneName: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  affectedAreas: string[];
  issuedAt: string;
  expiresAt: string;
  source: string;
}

// ─── AI / ML Prediction ──────────────────────────────────────────────────────

export interface PredictionPoint extends GeoCoordinate {
  forecastHour: number;
  timestamp: string;
  predictedWindSpeed: number;
  predictedPressure: number;
  predictedCategory: CycloneCategory;
  confidence: number; // 0.0 - 1.0
  upperBoundWind: number;
  lowerBoundWind: number;
}

export interface ModelInfo {
  modelId: string; // e.g. "cyclone-transformer-v2"
  modelVersion: string; // e.g. "2.1.0"
  modelName: string; // e.g. "CycloneNet Transformer"
  lastTrained: string; // ISO 8601
  accuracy: number; // historical accuracy metric 0.0 - 1.0
}

export interface AIPrediction {
  id: string;
  cycloneId: string;
  model: ModelInfo;
  predictedTrack: PredictionPoint[];
  predictedLandfall: GeoCoordinate | null;
  predictedLandfallTime: string | null;
  predictedPeakIntensity: number; // knots
  predictedPeakCategory: CycloneCategory;
  overallConfidence: number; // 0.0 - 1.0
  generatedAt: string;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface CycloneListResponse {
  cyclones: Cyclone[];
  totalCount: number;
  lastUpdated: string;
}

export interface CycloneDetailResponse {
  cyclone: Cyclone;
  predictions: AIPrediction[];
}

export interface AlertListResponse {
  alerts: CycloneAlert[];
  totalCount: number;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type MapLayerType =
  | "satellite"
  | "wind"
  | "pressure"
  | "radar"
  | "infrared";

export interface ActiveLayers {
  satellite: boolean;
  wind: boolean;
  pressure: boolean;
  radar: boolean;
  infrared: boolean;
}

// ─── Satellite Image Analysis ────────────────────────────────────────────────

export interface SatelliteAnalysisResult {
  id: string;
  originalImageUrl: string;       // data URL of the uploaded image
  croppedImageUrl: string;        // cropped cyclone region
  heatmapImageUrl: string;        // intensity heatmap overlay
  estimatedCategory: CycloneCategory;
  estimatedWindSpeed: number;     // knots
  estimatedPressure: number;      // hPa
  eyeDiameter: number;            // km
  confidence: number;             // 0.0 - 1.0
  modelInfo: ModelInfo;
  analyzedAt: string;             // ISO 8601
}

export type UnitSystem = "metric" | "imperial" | "nautical";

