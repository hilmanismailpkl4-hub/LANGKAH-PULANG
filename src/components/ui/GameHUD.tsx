import React, { useEffect, useState } from 'react';
import { BookOpen, Compass, Map as MapIcon, Menu, Sliders } from 'lucide-react';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const TIME_LABELS = {
  morning: 'Pagi',
  sunset: 'Senja',
  rain_dusk: 'Sore Berhujan',
  night: 'Malam Tenang',
};

export const GameHUD: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const chapter = useGameStore((s) => s.chapter);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const mainStepId = useGameStore((s) => s.mainStepId);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const isMapJournalOpen = useGameStore((s) => s.isMapJournalOpen);
  const isPauseOpen = useGameStore((s) => s.isPauseOpen);
  const interactPrompt = useGameStore((s) => s.interactPrompt);
  const toast = useGameStore((s) => s.toast);
  const showWaypoint = useGameStore((s) => s.settings.showWaypoint);
  const toggleMapJournal = useGameStore((s) => s.toggleMapJournal);
  const setPauseOpen = useGameStore((s) => s.setPauseOpen);
  const setQuickGraphicsOpen = useGameStore((s) => s.setQuickGraphicsOpen);
  const isQuickGraphicsOpen = useGameStore((s) => s.isQuickGraphicsOpen);

  const [compassState, setCompassState] = useState({ offsetPercent: 50, distance: 0, cardinal: 'U' });

  const step = MAIN_STEP_BY_ID[mainStepId];
  const locInfo = LOCATION_BY_ID[currentLocation];

  useEffect(() => {
    if (screen !== 'playing') return;
    const id = window.setInterval(() => {
      const [px, , pz] = playerRuntime.position;
      // Sudut pandang kamera depan
      const camYaw = playerRuntime.cameraYaw;
      const forwardX = -Math.sin(camYaw);
      const forwardZ = -Math.cos(camYaw);
      const headingDeg = ((Math.atan2(forwardX, -forwardZ) * 180) / Math.PI + 360) % 360;
      const cardinals = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
      const cardinal = cardinals[Math.round(headingDeg / 45) % 8];

      if (step) {
        const dx = step.waypoint[0] - px;
        const dz = step.waypoint[2] - pz;
        const dist = Math.round(Math.hypot(dx, dz));
        const targetAngle = Math.atan2(dx, -dz);
        const camAngle = Math.atan2(forwardX, -forwardZ);
        let rel = targetAngle - camAngle;
        while (rel > Math.PI) rel -= Math.PI * 2;
        while (rel < -Math.PI) rel += Math.PI * 2;
        const clamped = Math.max(-1.2, Math.min(1.2, rel));
        const offsetPercent = 50 + (clamped / 1.2) * 44;
        setCompassState({ offsetPercent, distance: dist, cardinal });
      } else {
        setCompassState({ offsetPercent: 50, distance: 0, cardinal });
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [screen, step]);

  if (screen !== 'playing' || activeDialogue || isMapJournalOpen || isPauseOpen || isQuickGraphicsOpen) return null;

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9990] flex flex-col justify-between p-5 md:p-7 text-warm-50">
        {/* === BARIS ATAS === */}
        <div className="flex items-start justify-between gap-4">
          {/* Kiri Atas: Objektif Misi Utama Minimalis */}
          <div className="max-w-xs rounded-2xl border border-warm-100/15 bg-dusk-950/65 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-warm-300/90">
              <span>Bab {chapter}</span>
              <span className="text-warm-200/40">•</span>
              <span>{TIME_LABELS[timeOfDay]}</span>
            </div>
            {step && (
              <>
                <p className="mt-1 font-serif text-sm text-warm-50">{step.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-warm-200/70">{step.hint}</p>
              </>
            )}
          </div>

          {/* Tengah Atas: Kompas Halus Penunjuk Arah Misi */}
          {showWaypoint && step && (
            <div className="hidden md:flex flex-col items-center gap-1.5">
              <div className="relative h-8 w-64 overflow-hidden rounded-full border border-warm-100/15 bg-dusk-950/60 px-4 backdrop-blur-md">
                <div className="flex h-full items-center justify-between text-[10px] tracking-widest text-warm-200/45">
                  <span>B</span>
                  <span className="font-semibold text-warm-100/80">{compassState.cardinal}</span>
                  <span>T</span>
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100"
                  style={{ left: `${compassState.offsetPercent}%` }}
                >
                  <div className="flex items-center gap-1 rounded-full bg-warm-400/95 px-2 py-0.5 text-[10px] font-bold text-dusk-950 shadow">
                    <Compass className="h-2.5 w-2.5" />
                    <span>{compassState.distance}m</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kanan Atas: Lokasi Saat Ini & Pintasan Ringkas */}
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="rounded-2xl border border-warm-100/15 bg-dusk-950/65 px-4 py-2.5 text-right backdrop-blur-md">
              <p className="font-serif text-sm text-warm-50">{locInfo.name}</p>
              <p className="text-[11px] text-warm-200/65">{locInfo.subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => toggleMapJournal('map')}
                className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
              >
                <MapIcon className="h-3.5 w-3.5 text-warm-300" />
                <span>Peta [M]</span>
              </button>
              <button
                type="button"
                onClick={() => toggleMapJournal('journal')}
                className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
              >
                <BookOpen className="h-3.5 w-3.5 text-warm-300" />
                <span>Catatan [Tab]</span>
              </button>
              <button
                type="button"
                onClick={() => setQuickGraphicsOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
              >
                <Sliders className="h-3.5 w-3.5 text-warm-300" />
                <span>Grafis</span>
              </button>
              <button
                type="button"
                onClick={() => setPauseOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
              >
                <Menu className="h-3.5 w-3.5 text-warm-300" />
                <span>[Esc]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifikasi Toast Halus */}
        {toast && (
          <div className="fixed left-1/2 top-20 -translate-x-1/2 animate-fadeIn">
            <div className="rounded-full border border-warm-300/35 bg-dusk-950/88 px-5 py-2 text-xs text-warm-100 shadow-xl backdrop-blur-md">
              {toast.text}
            </div>
          </div>
        )}

        {/* === BARIS BAWAH: PROMPT INTERAKSI [E] & KONTROL RINGKAS === */}
        <div className="flex flex-col items-center gap-3">
          {interactPrompt && (
            <div className="pointer-events-auto animate-fadeIn">
              <button
                type="button"
                onClick={() => playerRuntime.nearestInteractable?.onInteract()}
                className="flex items-center gap-3 rounded-full border border-warm-300/45 bg-dusk-950/85 px-5 py-2.5 shadow-xl backdrop-blur-md transition hover:bg-dusk-900"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-warm-400 text-xs font-bold text-dusk-950">
                  E
                </span>
                <div className="text-left">
                  <p className="text-sm font-medium text-warm-50">{interactPrompt.label}</p>
                  {interactPrompt.sublabel && (
                    <p className="text-[10px] uppercase tracking-wider text-warm-300/85">
                      {interactPrompt.sublabel}
                    </p>
                  )}
                </div>
              </button>
            </div>
          )}

          <div className="flex w-full items-center justify-between text-[11px] text-warm-200/55">
            <span>WASD Jalan · Shift Cepat · F Sapa Warga · Drag/Klik 2x Kamera · Scroll Zoom</span>
            <span>Bebas menjelajah setiap sudut kota kapan saja</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
