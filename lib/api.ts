import {
  type Cyclone,
  type CycloneAlert,
  type AIPrediction,
  type CycloneListResponse,
  type CycloneDetailResponse,
  type AlertListResponse,
  type SatelliteAnalysisResult,
  CycloneCategory,
} from "@/types/cyclone";
import { MOCK_CYCLONES, MOCK_ALERTS, MOCK_AI_PREDICTIONS } from "./mock-data";

// ─── Simulate network latency in development ────────────────────────────────

function delay(ms: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Cyclone Endpoints ───────────────────────────────────────────────────────

export async function getCyclones(): Promise<CycloneListResponse> {
  await delay();
  return {
    cyclones: MOCK_CYCLONES,
    totalCount: MOCK_CYCLONES.length,
    lastUpdated: new Date().toISOString(),
  };
}

export async function getCycloneById(
  id: string
): Promise<CycloneDetailResponse | null> {
  await delay();
  const cyclone = MOCK_CYCLONES.find((c) => c.id === id);
  if (!cyclone) return null;

  const predictions = MOCK_AI_PREDICTIONS.filter(
    (p) => p.cycloneId === id
  );

  return { cyclone, predictions };
}

export async function getActiveCyclones(): Promise<Cyclone[]> {
  await delay();
  return MOCK_CYCLONES.filter((c) => c.status === "ACTIVE");
}

// ─── Alert Endpoints ─────────────────────────────────────────────────────────

export async function getAlerts(): Promise<AlertListResponse> {
  await delay();
  return {
    alerts: MOCK_ALERTS,
    totalCount: MOCK_ALERTS.length,
  };
}

export async function getAlertsByCyclone(
  cycloneId: string
): Promise<CycloneAlert[]> {
  await delay();
  return MOCK_ALERTS.filter((a) => a.cycloneId === cycloneId);
}

// ─── AI Prediction Endpoints ─────────────────────────────────────────────────

export async function getAIPredictions(
  cycloneId: string
): Promise<AIPrediction[]> {
  await delay();
  return MOCK_AI_PREDICTIONS.filter((p) => p.cycloneId === cycloneId);
}

export async function getAllPredictions(): Promise<AIPrediction[]> {
  await delay();
  return MOCK_AI_PREDICTIONS;
}

// ─── Satellite Image Analysis ────────────────────────────────────────────────

/**
 * Mock satellite analysis — reads the uploaded image, generates a center-crop
 * and a radial heatmap overlay using canvas. Swap this for a real model API
 * call when the backend is ready.
 */
export async function analyzeSatelliteImage(
  file: File
): Promise<SatelliteAnalysisResult> {
  // Simulate model processing time
  await delay(2500);

  const originalImageUrl = await readFileAsDataUrl(file);
  const img = await loadImage(originalImageUrl);

  const croppedImageUrl = generateCroppedImage(img);
  const heatmapImageUrl = generateHeatmapOverlay(img);

  // Randomised mock meteorological data
  const windSpeed = Math.floor(Math.random() * 120) + 35; // 35-155 kt
  const category = getCategoryFromWind(windSpeed);

  return {
    id: `SAT-${Date.now()}`,
    originalImageUrl,
    croppedImageUrl,
    heatmapImageUrl,
    estimatedCategory: category,
    estimatedWindSpeed: windSpeed,
    estimatedPressure: Math.floor(1013 - windSpeed * 0.6 + Math.random() * 10),
    eyeDiameter: Math.floor(20 + Math.random() * 60),
    confidence: parseFloat((0.65 + Math.random() * 0.3).toFixed(2)),
    modelInfo: {
      modelId: "cyclone-intensity-v1",
      modelVersion: "1.0.0",
      modelName: "CycloneNet Intensity Estimator",
      lastTrained: "2025-08-01T00:00:00Z",
      accuracy: 0.87,
    },
    analyzedAt: new Date().toISOString(),
  };
}

// ─── Canvas helpers (client-side only) ────────────────────────────────────────

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function generateCroppedImage(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  const size = Math.min(img.width, img.height) * 0.6;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Center-crop
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

  // Circular mask with soft edge
  ctx.globalCompositeOperation = "destination-in";
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, size * 0.35,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.85, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add a subtle ring border
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toDataURL("image/png");
}

function generateHeatmapOverlay(img: HTMLImageElement): string {
  const canvas = document.createElement("canvas");
  const size = Math.min(img.width, img.height) * 0.6;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Draw the center-cropped source as background
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

  // Darken it slightly
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, size, size);

  // Radial heatmap gradient overlay (eye → outer bands)
  const heatmap = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  heatmap.addColorStop(0, "rgba(244, 63, 94, 0.75)");   // extreme red — eye
  heatmap.addColorStop(0.15, "rgba(239, 68, 68, 0.6)");  // severe red
  heatmap.addColorStop(0.3, "rgba(249, 115, 22, 0.5)");  // orange
  heatmap.addColorStop(0.5, "rgba(234, 179, 8, 0.4)");   // yellow
  heatmap.addColorStop(0.7, "rgba(34, 197, 94, 0.3)");   // green
  heatmap.addColorStop(0.9, "rgba(59, 130, 246, 0.2)");  // blue
  heatmap.addColorStop(1, "rgba(59, 130, 246, 0)");       // transparent

  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = heatmap;
  ctx.fillRect(0, 0, size, size);

  // Eye marker
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label
  ctx.font = `bold ${Math.max(12, size * 0.035)}px monospace`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textAlign = "center";
  ctx.fillText("EYE", size / 2, size / 2 + size * 0.13);

  // Circular fade-out
  ctx.globalCompositeOperation = "destination-in";
  const mask = ctx.createRadialGradient(
    size / 2, size / 2, size * 0.35,
    size / 2, size / 2, size / 2
  );
  mask.addColorStop(0, "rgba(255,255,255,1)");
  mask.addColorStop(0.85, "rgba(255,255,255,1)");
  mask.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, size, size);

  return canvas.toDataURL("image/png");
}

function getCategoryFromWind(knots: number): CycloneCategory {
  if (knots >= 137) return CycloneCategory.C5;
  if (knots >= 113) return CycloneCategory.C4;
  if (knots >= 96) return CycloneCategory.C3;
  if (knots >= 83) return CycloneCategory.C2;
  if (knots >= 64) return CycloneCategory.C1;
  if (knots >= 34) return CycloneCategory.TS;
  return CycloneCategory.TD;
}

