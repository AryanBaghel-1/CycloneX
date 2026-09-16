"use client";

import type { ForecastPoint, AIPrediction } from "@/types/cyclone";
import { CategoryBadge, Badge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import {
  formatWindSpeed,
  formatPressure,
  formatConfidence,
  getConfidenceColor,
  getCategoryColor,
} from "@/lib/utils";
import { Clock, Brain, TrendingUp, Target } from "lucide-react";

interface ForecastPanelProps {
  forecast: ForecastPoint[];
  prediction?: AIPrediction | null;
}

export default function ForecastPanel({
  forecast,
  prediction = null,
}: ForecastPanelProps) {
  return (
    <div className="space-y-4">
      {/* Official Forecast */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Official Forecast
          </h3>
        </div>

        <div className="space-y-1">
          {forecast.map((point) => (
            <div
              key={point.forecastHour}
              className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-[var(--bg-primary)]/50 text-xs"
            >
              <div className="w-10 text-[var(--text-muted)] font-mono shrink-0">
                +{point.forecastHour}h
              </div>
              <CategoryBadge category={point.category} />
              <div className="flex-1 flex items-center gap-3 text-[var(--text-secondary)] font-mono">
                <span>{formatWindSpeed(point.windSpeed)}</span>
                <span className="text-[var(--text-muted)]">·</span>
                <span>{formatPressure(point.pressure)}</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: getConfidenceColor(point.confidence) }}
                />
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {formatConfidence(point.confidence)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Prediction Section */}
      {prediction && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Brain className="h-3.5 w-3.5 text-purple-400" />
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              AI Prediction
            </h3>
            <Badge color="#a855f7" bgColor="rgba(168, 85, 247, 0.1)">
              {prediction.model.modelName} v{prediction.model.modelVersion}
            </Badge>
          </div>

          {/* Overall confidence */}
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-purple-500/[0.05] border border-purple-500/10 mb-2 text-xs">
            <Target className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-[var(--text-secondary)]">Overall Confidence</span>
            <span
              className="ml-auto font-mono font-semibold"
              style={{ color: getConfidenceColor(prediction.overallConfidence) }}
            >
              {formatConfidence(prediction.overallConfidence)}
            </span>
          </div>

          {/* Peak prediction */}
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-purple-500/[0.05] border border-purple-500/10 mb-2 text-xs">
            <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-[var(--text-secondary)]">Predicted Peak</span>
            <div className="ml-auto flex items-center gap-2">
              <CategoryBadge category={prediction.predictedPeakCategory} />
              <span className="font-mono text-[var(--text-primary)]">
                {formatWindSpeed(prediction.predictedPeakIntensity)}
              </span>
            </div>
          </div>

          {/* Predicted track */}
          <div className="space-y-1">
            {prediction.predictedTrack.map((point) => (
              <div
                key={point.forecastHour}
                className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-[var(--bg-primary)]/50 text-xs"
              >
                <div className="w-10 text-purple-400/60 font-mono shrink-0">
                  +{point.forecastHour}h
                </div>
                <CategoryBadge category={point.predictedCategory} />
                <div className="flex-1 flex items-center gap-3 text-[var(--text-secondary)] font-mono">
                  <span>{formatWindSpeed(point.predictedWindSpeed)}</span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span>{formatPressure(point.predictedPressure)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: getConfidenceColor(point.confidence) }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {formatConfidence(point.confidence)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Landfall prediction */}
          {prediction.predictedLandfall && (
            <div className="mt-2 px-2.5 py-2 rounded-lg bg-red-500/[0.05] border border-red-500/10 text-xs">
              <span className="text-red-400 font-semibold">⚠ Predicted Landfall</span>
              <span className="text-[var(--text-secondary)] ml-2">
                {prediction.predictedLandfall.latitude.toFixed(1)}°N,{" "}
                {prediction.predictedLandfall.longitude.toFixed(1)}°E
              </span>
            </div>
          )}
        </div>
      )}

      {/* Placeholder when no AI prediction available */}
      {!prediction && (
        <div className="px-3 py-4 rounded-lg border border-dashed border-[var(--border-subtle)] text-center">
          <Brain className="h-5 w-5 text-[var(--text-muted)] mx-auto mb-2" />
          <p className="text-xs text-[var(--text-muted)]">
            AI prediction data will be available when the prediction service is connected.
          </p>
        </div>
      )}
    </div>
  );
}
