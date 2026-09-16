"use client";

import { useEffect, useRef } from "react";
import type { Cyclone } from "@/types/cyclone";
import { getCategoryColor } from "@/lib/utils";

interface CycloneMarkerProps {
  cyclone: Cyclone;
  viewer: InstanceType<typeof import("cesium").Viewer>;
  cesium: typeof import("cesium");
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}

export default function CycloneMarker({
  cyclone,
  viewer,
  cesium,
  isSelected,
  onSelect,
}: CycloneMarkerProps) {
  const entityRef = useRef<InstanceType<typeof import("cesium").Entity> | null>(null);
  const pulseEntityRef = useRef<InstanceType<typeof import("cesium").Entity> | null>(null);

  useEffect(() => {
    const { latitude, longitude } = cyclone.currentPosition;
    const color = getCategoryColor(cyclone.currentPosition.category);
    const cesiumColor = cesium.Color.fromCssColorString(color);

    // Outer pulse ring
    const pulseEntity = viewer.entities.add({
      position: cesium.Cartesian3.fromDegrees(longitude, latitude),
      ellipse: {
        semiMajorAxis: isSelected ? 120_000 : 80_000,
        semiMinorAxis: isSelected ? 120_000 : 80_000,
        material: cesiumColor.withAlpha(0.15),
        outline: true,
        outlineColor: cesiumColor.withAlpha(0.3),
        outlineWidth: 1,
        height: 0,
      },
    });

    // Core marker point
    const entity = viewer.entities.add({
      position: cesium.Cartesian3.fromDegrees(longitude, latitude),
      point: {
        pixelSize: isSelected ? 14 : 10,
        color: cesiumColor,
        outlineColor: cesiumColor.withAlpha(0.6),
        outlineWidth: isSelected ? 3 : 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: cyclone.name,
        font: "12px sans-serif",
        fillColor: cesium.Color.WHITE,
        outlineColor: cesium.Color.BLACK,
        outlineWidth: 2,
        style: cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new cesium.Cartesian2(0, -20),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: cesium.Color.fromCssColorString("#11141a").withAlpha(0.8),
        backgroundPadding: new cesium.Cartesian2(6, 4),
      },
      properties: {
        cycloneId: cyclone.id,
      },
    });

    entityRef.current = entity;
    pulseEntityRef.current = pulseEntity;

    return () => {
      if (viewer.isDestroyed()) return;
      if (viewer.entities.contains(entity)) {
        viewer.entities.remove(entity);
      }
      if (viewer.entities.contains(pulseEntity)) {
        viewer.entities.remove(pulseEntity);
      }
    };
  }, [cyclone, viewer, cesium, isSelected]);

  // Handle click on marker
  useEffect(() => {
    if (viewer.isDestroyed()) return;
    const handler = new cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(
      (event: { position: InstanceType<typeof import("cesium").Cartesian2> }) => {
        if (viewer.isDestroyed()) return;
        const picked = viewer.scene.pick(event.position);
        if (
          cesium.defined(picked) &&
          picked.id === entityRef.current
        ) {
          onSelect(cyclone.id);
        }
      },
      cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    return () => {
      if (!handler.isDestroyed()) handler.destroy();
    };
  }, [cyclone.id, viewer, cesium, onSelect]);

  return null; // Renders via Cesium entities, not React DOM
}
