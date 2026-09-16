"use client";

import { useEffect, useRef } from "react";
import type { ForecastCone as ForecastConeType } from "@/types/cyclone";

interface ForecastConeProps {
  cone: ForecastConeType;
  viewer: InstanceType<typeof import("cesium").Viewer>;
  cesium: typeof import("cesium");
}

export default function ForecastCone({
  cone,
  viewer,
  cesium,
}: ForecastConeProps) {
  const entityRef = useRef<InstanceType<typeof import("cesium").Entity> | null>(null);

  useEffect(() => {
    if (cone.conePolygon.length < 3) return;

    // Build positions array from polygon points
    const positions = cone.conePolygon.map((p) =>
      cesium.Cartesian3.fromDegrees(p.longitude, p.latitude)
    );

    const entity = viewer.entities.add({
      polygon: {
        hierarchy: new cesium.PolygonHierarchy(positions),
        material: cesium.Color.fromCssColorString("#f59e0b").withAlpha(0.08),
        outline: true,
        outlineColor: cesium.Color.fromCssColorString("#f59e0b").withAlpha(0.3),
        outlineWidth: 1,
        height: 0,
      },
    });

    entityRef.current = entity;

    return () => {
      if (viewer.isDestroyed()) return;
      if (viewer.entities.contains(entity)) {
        viewer.entities.remove(entity);
      }
    };
  }, [cone, viewer, cesium]);

  return null;
}
