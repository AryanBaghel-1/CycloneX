"use client";

import { useEffect, useRef } from "react";
import type { CycloneTrackPoint } from "@/types/cyclone";
import { getCategoryColor } from "@/lib/utils";

interface CycloneTrackProps {
  track: CycloneTrackPoint[];
  viewer: InstanceType<typeof import("cesium").Viewer>;
  cesium: typeof import("cesium");
}

export default function CycloneTrack({
  track,
  viewer,
  cesium,
}: CycloneTrackProps) {
  const entitiesRef = useRef<InstanceType<typeof import("cesium").Entity>[]>([]);

  useEffect(() => {
    const entities: InstanceType<typeof import("cesium").Entity>[] = [];

    if (track.length < 2) return;

    // Draw polyline segments — color each segment by the category at that point
    for (let i = 0; i < track.length - 1; i++) {
      const from = track[i];
      const to = track[i + 1];
      const color = getCategoryColor(to.category);

      const entity = viewer.entities.add({
        polyline: {
          positions: cesium.Cartesian3.fromDegreesArray([
            from.longitude,
            from.latitude,
            to.longitude,
            to.latitude,
          ]),
          width: 2.5,
          material: cesium.Color.fromCssColorString(color).withAlpha(0.8),
          clampToGround: true,
        },
      });
      entities.push(entity);
    }

    // Add small dots at each track point
    for (const point of track) {
      const color = getCategoryColor(point.category);
      const entity = viewer.entities.add({
        position: cesium.Cartesian3.fromDegrees(
          point.longitude,
          point.latitude
        ),
        point: {
          pixelSize: 5,
          color: cesium.Color.fromCssColorString(color).withAlpha(0.9),
          outlineColor: cesium.Color.BLACK.withAlpha(0.4),
          outlineWidth: 1,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
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
  }, [track, viewer, cesium]);

  return null;
}
