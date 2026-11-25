import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GraphicsQuality } from '../../types/game';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

const QUALITY_SHORT: Record<GraphicsQuality, string> = {
  potato: 'HP Kentang',
  low: 'Hemat HP',
  medium: 'Sedang',
  high: 'Tinggi',
  ultra: 'Ultra',
};

interface FpsSnapshot {
  fps: number;
  frameMs: number;
  drawCalls: number;
  culledProps: number;
  totalProps: number;
  activeLights: number;
  totalLights: number;
}

/**
 * Indikator FPS & Performa 3D super-ringan (hanya aktif jika toggle Indikator FPS dinyalakan).
 * Membaca telemetri dari playerRuntime.perf setiap 450ms agar tidak memicu re-render React tiap frame.
 */
export const FpsOverlay: React.FC = () => {
  const showFps = useGameStore((s) => s.settings.showFps);
  const graphicsQuality = useGameStore((s) => s.settings.graphicsQuality);
  const districtCulling = useGameStore((s) => s.settings.districtCulling);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const isQuickGraphicsOpen = useGameStore((s) => s.isQuickGraphicsOpen);
  const screen = useGameStore((s) => s.screen);
  const { isMobile, isCompactLandscape } = useMobileViewport();

  const [snap, setSnap] = useState<FpsSnapshot>(() => ({
    fps: playerRuntime.perf.fps,
    frameMs: playerRuntime.perf.frameMs,
    drawCalls: playerRuntime.perf.drawCalls,
    culledProps: playerRuntime.perf.culledProps,
    totalProps: playerRuntime.perf.totalProps,
    activeLights: playerRuntime.perf.activeLights,
    totalLights: playerRuntime.perf.totalLights,
  }));

  useEffect(() => {
    if (!showFps || isPhotoMode) return;
    const sync = () => {
      const p = playerRuntime.perf;
      setSnap({
        fps: p.fps,
        frameMs: p.frameMs,
        drawCalls: p.drawCalls,
        culledProps: p.culledProps,
        totalProps: p.totalProps,
        activeLights: p.activeLights,
        totalLights: p.totalLights,
      });
    };
    sync();
    const id = window.setInterval(sync, 450);
    return () => window.clearInterval(id);
  }, [showFps, isPhotoMode]);

  if (!showFps || isPhotoMode) return null;

  const compact = isMobile || isCompactLandscape;
  const fpsColor =
    snap.fps >= 50
      ? 'text-emerald-300'
      : snap.fps >= 32
        ? 'text-amber-300'
        : 'text-rose-300';
  const dotColor =
    snap.fps >= 50
      ? 'bg-emerald-400'
      : snap.fps >= 32
        ? 'bg-amber-400'
        : 'bg-rose-400';

  const positionClass = compact
    ? 'top-1.5 left-1/2 -translate-x-1/2'
    : isQuickGraphicsOpen || screen === 'title'
      ? 'bottom-4 left-5'
      : 'bottom-5 right-6';

  return (
    <Portal>
      <div
        className={`pointer-events-none fixed z-[9995] flex items-center gap-2 rounded-full border border-warm-200/20 bg-dusk-950/82 font-mono text-warm-100 shadow-lg backdrop-blur-md ${
          compact ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'
        } ${positionClass}`}
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
        <Activity className={`h-3 w-3 shrink-0 ${fpsColor}`} />
        <span className={`font-bold tabular-nums ${fpsColor}`}>{snap.fps} FPS</span>
        <span className="text-warm-200/55 tabular-nums">{snap.frameMs.toFixed(1)}ms</span>
        <span className="text-warm-200/30">·</span>
        <span className="text-warm-300/90">{QUALITY_SHORT[graphicsQuality]}</span>
        {!compact && (
          <>
            <span className="text-warm-200/30">·</span>
            <span className="text-warm-200/75 tabular-nums">Draw {snap.drawCalls}</span>
          </>
        )}
        {districtCulling && snap.totalProps > 0 && (
          <>
            <span className="text-warm-200/30">·</span>
            <span className="text-cyan-300/90 tabular-nums">
              Cull {snap.culledProps}/{snap.totalProps}
            </span>
          </>
        )}
      </div>
    </Portal>
  );
};
