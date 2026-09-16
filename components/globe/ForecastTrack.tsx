"use client";

import { useEffect, useRef } from "react";
import type { ForecastPoint } from "@/types/cyclone";
import { getCategoryColor } from "@/lib/utils";

interface ForecastTrackProps {
  forecast: ForecastPoint[];
  viewer: InstanceType<typeof import("cesium").Viewer>;
  cesium: typeof import("cesium");
}

export default function ForecastTrack({
  forecast,
  viewer,
  cesium,
}: ForecastTrackProps) {
  const entitiesRef = useRef<InstanceType<typeof import("cesium").Entity>[]>([]);

  useEffect(() => {
    const entities: InstanceType<typeof import("cesium").Entity>[] = [];

    if (forecast.length < 2) return;

    // Draw dashed-style forecast polyline (Cesium supports dash via PolylineDashMaterialProperty)
    for (let i = 0; i < forecast.length - 1; i++) {
      const from = forecast[i];
      const to = forecast[i + 1];
      const color = getCategoryColor(to.category);

      const entity = viewer.entities.add({
        polyline: {
          positions: cesium.Cartesian3.fromDegreesArray([
            from.longitude,
            from.latitude,
            to.longitude,
            to.latitude,
          ]),
          width: 2,
          material: new cesium.PolylineDashMaterialProperty({
            color: cesium.Color.fromCssColorString(color).withAlpha(0.7),
            dashLength: 12,
            dashPattern: 255,
          }),
          clampToGround: true,
        },
      });
      entities.push(entity);
    }

    // Forecast point markers with hour labels
    for (const point of forecast) {
      const color = getCategoryColor(point.category);

      const entity = viewer.entities.add({
        position: cesium.Cartesian3.fromDegrees(
          point.longitude,
          point.latitude
        ),
        point: {
          pixelSize: 7,
          color: cesium.Color.fromCssColorString(color).withAlpha(0.8),
          outlineColor: cesium.Color.WHITE.withAlpha(0.5),
          outlineWidth: 1,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: `${point.forecastHour}h`,
          font: "10px monospace",
          fillColor: cesium.Color.WHITE.withAlpha(0.8),
          outlineColor: cesium.Color.BLACK,
          outlineWidth: 2,
          style: cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: cesium.VerticalOrigin.TOP,
          pixelOffset: new cesium.Cartesian2(0, 12),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scale: 0.9,
        },
      });
      entities.push(entity);
    }

    entitiesRef.current = entities;

    return () => {
      if (viewer.isDestroyed()) return;
      for (const entity of entities) {
        if (viewer.entities.contains(entity)) {
          viewer.entities.remove(entity);
        }
      }
    };
  }, [forecast, viewer, cesium]);

  return null;
}
