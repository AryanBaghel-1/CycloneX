"use client";

import { useState, useRef, useCallback } from "react";
import type { SatelliteAnalysisResult } from "@/types/cyclone";
import { analyzeSatelliteImage } from "@/lib/api";
import { getCategoryLabel, getCategoryColor, formatConfidence } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/Loading";
import {
  ScanSearch,
  Upload,
  ImagePlus,
  X,
  Wind,
  Gauge,
  Target,
  ShieldCheck,
  Cpu,
  Clock,
  RotateCcw,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AnalysisState = "idle" | "uploading" | "processing" | "done" | "error";

export default function AnalysisPage() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SatelliteAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── File handling ─────────────────────────────────────────────────────────

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, TIFF).");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError("File must be under 50 MB.");
      return;
    }

    setFile(f);
    setError(null);
    setResult(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  // ─── Analysis ──────────────────────────────────────────────────────────────

  const runAnalysis = useCallback(async () => {
    if (!file) return;
    setState("processing");
    setError(null);

    try {
      const analysisResult = await analyzeSatelliteImage(file);
      setResult(analysisResult);
      setState("done");
    } catch {
      setError("Analysis failed. Please try again.");
      setState("error");
    }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setState("idle");
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <PageContainer className="pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <ScanSearch className="h-5 w-5 text-amber-400" />
            <h1 className="text-lg font-bold text-[var(--text-primary)]">
              Satellite Image Analysis
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Upload a satellite image to detect cyclone structure and estimate intensity
          </p>
        </div>
        {(state === "done" || file) && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            New Analysis
          </button>
        )}
      </div>

      {/* Upload Section */}
      {state !== "done" && (
        <Card className="p-0 mb-6 overflow-hidden">
          {!file ? (
            /* ─── Drop Zone ─────────────────────────────────────────── */
            <div
              className={cn(
                "upload-dropzone",
                dragActive && "drag-active"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <ImagePlus className="h-7 w-7 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                    Drop satellite image here
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    or click to browse — PNG, JPG, TIFF up to 50 MB
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/25 px-4 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/15 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  Select File
                </button>
              </div>
            </div>
          ) : (
            /* ─── Preview + Analyze Button ────────────────────────── */
            <div className="p-5">
              <div className="flex items-start gap-5">
                {/* Thumbnail */}
                <div className="relative shrink-0 h-28 w-28 rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                  {preview && (
                    <img
                      src={preview}
                      alt="Uploaded satellite image"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {state !== "processing" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reset();
                      }}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white/80 hover:bg-black/80 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* File info + action */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate mb-0.5">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mb-4">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type || "image"}
                  </p>

                  {state === "processing" ? (
                    <div className="flex items-center gap-3 animate-analysis-pulse rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                      <LoadingSpinner size="sm" />
                      <div>
                        <p className="text-xs font-medium text-amber-400">
                          Analyzing satellite imagery…
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          Detecting cyclone structure & estimating intensity
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={runAnalysis}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-amber-900/30 hover:from-amber-500 hover:to-orange-500 transition-all duration-200"
                    >
                      <Cpu className="h-3.5 w-3.5" />
                      Run Analysis
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-4 mb-6 border-red-500/20">
          <p className="text-xs text-red-400">{error}</p>
        </Card>
      )}

      {/* ─── Results ──────────────────────────────────────────────────────── */}
      {result && state === "done" && (
        <div className="space-y-6 animate-fade-in">
          {/* Result Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Original */}
            <Card className="p-0 result-image-card">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Original Upload
                </p>
              </div>
              <div className="relative aspect-square bg-black/20 flex items-center justify-center">
                <img
                  src={result.originalImageUrl}
                  alt="Original satellite image"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </Card>

            {/* Cropped Cyclone */}
            <Card className="p-0 result-image-card" glow="amber">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-amber-400" />
                  <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                    Detected Cyclone
                  </p>
                </div>
              </div>
              <div className="relative aspect-square bg-black/40 flex items-center justify-center p-4">
                <img
                  src={result.croppedImageUrl}
                  alt="Cropped cyclone region"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </Card>

            {/* Heatmap */}
            <Card className="p-0 result-image-card" glow="extreme">
              <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3 text-rose-400" />
                  <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
                    Intensity Heatmap
                  </p>
                </div>
              </div>
              <div className="relative aspect-square bg-black/40 flex items-center justify-center p-4">
                <img
                  src={result.heatmapImageUrl}
                  alt="Intensity heatmap overlay"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {/* Legend */}
              <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
                <div className="heatmap-legend-bar mb-2" />
                <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                  <span>Extreme</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Analysis Metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Estimated Parameters */}
            <Card className="p-5">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                Estimated Parameters
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Category
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(result.estimatedCategory) }}
                    />
                    <span
                      className="text-lg font-bold"
                      style={{ color: getCategoryColor(result.estimatedCategory) }}
                    >
                      {result.estimatedCategory}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {getCategoryLabel(result.estimatedCategory)}
                  </p>
                </div>

                {/* Wind Speed */}
                <div className="rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Max Wind
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)] font-mono">
                    {result.estimatedWindSpeed}
                    <span className="text-xs text-[var(--text-muted)] ml-1">kt</span>
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    ≈ {Math.round(result.estimatedWindSpeed * 1.852)} km/h
                  </p>
                </div>

                {/* Pressure */}
                <div className="rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Central Pressure
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)] font-mono">
                    {result.estimatedPressure}
                    <span className="text-xs text-[var(--text-muted)] ml-1">hPa</span>
                  </p>
                </div>

                {/* Eye Diameter */}
                <div className="rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      Eye Diameter
                    </span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text-primary)] font-mono">
                    {result.eyeDiameter}
                    <span className="text-xs text-[var(--text-muted)] ml-1">km</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Model Info + Confidence */}
            <Card className="p-5">
              <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                Model Information
              </h2>
              <div className="space-y-4">
                {/* Confidence gauge */}
                <div className="rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                        Confidence
                      </span>
                    </div>
                    <span
                      className="text-sm font-bold font-mono"
                      style={{
                        color:
                          result.confidence >= 0.8
                            ? "#22c55e"
                            : result.confidence >= 0.6
                            ? "#eab308"
                            : "#ef4444",
                      }}
                    >
                      {formatConfidence(result.confidence)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${result.confidence * 100}%`,
                        background:
                          result.confidence >= 0.8
                            ? "linear-gradient(90deg, #22c55e, #4ade80)"
                            : result.confidence >= 0.6
                            ? "linear-gradient(90deg, #eab308, #facc15)"
                            : "linear-gradient(90deg, #ef4444, #f87171)",
                      }}
                    />
                  </div>
                </div>

                {/* Model details */}
                <div className="space-y-3">
                  <DetailRow
                    icon={Cpu}
                    label="Model"
                    value={result.modelInfo.modelName}
                  />
                  <DetailRow
                    icon={ShieldCheck}
                    label="Version"
                    value={`v${result.modelInfo.modelVersion}`}
                  />
                  <DetailRow
                    icon={Target}
                    label="Historical Accuracy"
                    value={formatConfidence(result.modelInfo.accuracy)}
                  />
                  <DetailRow
                    icon={Clock}
                    label="Analyzed At"
                    value={new Date(result.analyzedAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

// ─── Helper Components ───────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      </div>
      <span className="text-xs font-medium text-[var(--text-primary)] font-mono">
        {value}
      </span>
    </div>
  );
}
