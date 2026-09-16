"use client";

import "cesium/Build/Cesium/Widgets/widgets.css";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Cyclone } from "@/types/cyclone";
import { CESIUM_DEFAULTS } from "@/lib/constants";
import CycloneMarker from "./CycloneMarker";
import CycloneTrack from "./CycloneTrack";
import ForecastTrack from "./ForecastTrack";
import ForecastCone from "./ForecastCone";
import GlobeControls from "./GlobeControls";
import type { ActiveLayers } from "@/types/cyclone";
import { DEFAULT_LAYERS } from "@/lib/constants";

// Cesium types — imported at runtime only (client-side)
let Cesium: typeof import("cesium");
let CesiumViewer: typeof import("cesium").Viewer;

interface CycloneGlobeProps {
  cyclones: Cyclone[];
  selectedCycloneId: string | null;
  onSelectCyclone: (id: string | null) => void;
}

export default function CycloneGlobe({
  cyclones,
  selectedCycloneId,
  onSelectCyclone,
}: CycloneGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<InstanceType<typeof CesiumViewer> | null>(null);
  const [ready, setReady] = useState(false);
  const [activeLayers, setActiveLayers] = useState<ActiveLayers>(DEFAULT_LAYERS);

  const selectedCyclone = cyclones.find((c) => c.id === selectedCycloneId) ?? null;

  // Initialize Cesium Viewer
  useEffect(() => {
    let viewer: InstanceType<typeof CesiumViewer> | null = null;
    let destroyed = false;

    async function init() {
      Cesium = await import("cesium");

      // Set the token
      const token = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
      if (token) {
        Cesium.Ion.defaultAccessToken = token;
      }

      if (!containerRef.current || destroyed) return;

      // Create viewer — when token is set, Cesium automatically loads Ion world imagery
      viewer = new Cesium.Viewer(containerRef.current, {
        animation: CESIUM_DEFAULTS.ANIMATION,
        timeline: CESIUM_DEFAULTS.TIMELINE,
        baseLayerPicker: CESIUM_DEFAULTS.BASE_LAYER_PICKER,
        geocoder: CESIUM_DEFAULTS.GEOCODER,
        homeButton: CESIUM_DEFAULTS.HOME_BUTTON,
        navigationHelpButton: CESIUM_DEFAULTS.NAVIGATION_HELP_BUTTON,
        sceneModePicker: CESIUM_DEFAULTS.SCENE_MODE_PICKER,
        selectionIndicator: CESIUM_DEFAULTS.SELECTION_INDICATOR,
        infoBox: CESIUM_DEFAULTS.INFO_BOX,
        fullscreenButton: CESIUM_DEFAULTS.FULLSCREEN_BUTTON,
        // Performance: only re-render when the scene changes
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        msaaSamples: 1,
      });

      // ─── Performance optimizations ──────────────────────────────────
      const scene = viewer.scene;

      // Use FXAA instead of expensive MSAA
      scene.postProcessStages.fxaa.enabled = true;

      // Match device pixel ratio for crisp visuals without GPU waste
      viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.5);

      // Reduce tile loading overhead during camera moves
      viewer.scene.globe.preloadSiblings = false;
      viewer.scene.globe.maximumScreenSpaceError = 2; // default is 2, keep crisp

      // Scene styling
      scene.backgroundColor = Cesium.Color.fromCssColorString("#0a0e17");

      if (scene.globe) {
        scene.globe.enableLighting = false;
        scene.globe.showGroundAtmosphere = false;
        scene.globe.baseColor = Cesium.Color.fromCssColorString("#1a2332");
      }

      // Disable atmosphere rendering for better perf
      scene.skyAtmosphere.show = false;
      scene.fog.enabled = false;

      // Initial camera — closer to earth so globe fills the screen
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          CESIUM_DEFAULTS.DEFAULT_CAMERA.longitude,
          CESIUM_DEFAULTS.DEFAULT_CAMERA.latitude,
          CESIUM_DEFAULTS.DEFAULT_CAMERA.height
        ),
      });

      viewerRef.current = viewer;
      setReady(true);
    }

    init();

    return () => {
      destroyed = true;
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
      viewerRef.current = null;
      setReady(false);
    };
  }, []);

  // Fly to selected cyclone
  useEffect(() => {
    if (!viewerRef.current || !selectedCyclone || !Cesium) return;

    const pos = selectedCyclone.currentPosition;
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        pos.longitude,
        pos.latitude,
        4_000_000
      ),
      duration: 1.5,
    });
  }, [selectedCycloneId, selectedCyclone]);

  const handleToggleLayer = useCallback((layer: keyof ActiveLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  return (
    <div className="globe-container">
      <div ref={containerRef} className="absolute inset-0" />

      {ready && viewerRef.current && Cesium && (
        <>
          {/* Render cyclone markers */}
          {cyclones.map((cyclone) => (
            <CycloneMarker
              key={cyclone.id}
              cyclone={cyclone}
              viewer={viewerRef.current!}
              cesium={Cesium}
              isSelected={cyclone.id === selectedCycloneId}
              onSelect={onSelectCyclone}
            />
          ))}

          {/* Render selected cyclone's tracks */}
          {selectedCyclone && (
            <>
              <CycloneTrack
                track={selectedCyclone.track}
                viewer={viewerRef.current!}
                cesium={Cesium}
              />
              <ForecastTrack
                forecast={selectedCyclone.forecast}
                viewer={viewerRef.current!}
                cesium={Cesium}
              />
              {selectedCyclone.forecastCone && (
                <ForecastCone
                  cone={selectedCyclone.forecastCone}
                  viewer={viewerRef.current!}
                  cesium={Cesium}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Globe Controls Overlay */}
      <GlobeControls
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
        onZoomIn={() => {
          if (viewerRef.current && Cesium) {
            const camera = viewerRef.current.camera;
            const currentHeight = camera.positionCartographic.height;
            const targetHeight = currentHeight * 0.5;
            camera.flyTo({
              destination: Cesium.Cartesian3.fromRadians(
                camera.positionCartographic.longitude,
                camera.positionCartographic.latitude,
                targetHeight
              ),
              orientation: {
                heading: camera.heading,
                pitch: camera.pitch,
                roll: camera.roll,
              },
              duration: 0.5,
            });
          }
        }}
        onZoomOut={() => {
          if (viewerRef.current && Cesium) {
            const camera = viewerRef.current.camera;
            const currentHeight = camera.positionCartographic.height;
            const targetHeight = Math.min(currentHeight * 2, 30_000_000);
            camera.flyTo({
              destination: Cesium.Cartesian3.fromRadians(
                camera.positionCartographic.longitude,
                camera.positionCartographic.latitude,
                targetHeight
              ),
              orientation: {
                heading: camera.heading,
                pitch: camera.pitch,
                roll: camera.roll,
              },
              duration: 0.5,
            });
          }
        }}
        onResetView={() => {
          if (viewerRef.current && Cesium) {
            viewerRef.current.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                CESIUM_DEFAULTS.DEFAULT_CAMERA.longitude,
                CESIUM_DEFAULTS.DEFAULT_CAMERA.latitude,
                CESIUM_DEFAULTS.DEFAULT_CAMERA.height
              ),
              duration: 1.5,
            });
          }
        }}
      />

      {/* Loading overlay */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-subtle)] border-t-amber-400" />
            <span className="text-xs text-[var(--text-muted)] tracking-wide">
              INITIALIZING GLOBE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
