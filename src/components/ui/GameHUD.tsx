import React, { useEffect, useState } from 'react';
import { Backpack, BookOpen, Camera, Compass, Map as MapIcon, Menu, Navigation, Sliders, Smartphone, Umbrella } from 'lucide-react';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { PHONE_THREADS } from '../../data/phoneContent';
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

interface MiniMapState {
  px: number;
  pz: number;
  headingDeg: number;
  scooterX: number;
  scooterZ: number;
  scooterKmh: number;
  cars: { x: number; z: number }[];
  npcs: { x: number; z: number }[];
}

export const GameHUD: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const chapter = useGameStore((s) => s.chapter);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const mainStepId = useGameStore((s) => s.mainStepId);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const isMapJournalOpen = useGameStore((s) => s.isMapJournalOpen);
  const isPauseOpen = useGameStore((s) => s.isPauseOpen);
  const isQuickGraphicsOpen = useGameStore((s) => s.isQuickGraphicsOpen);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const isPhoneOpen = useGameStore((s) => s.isPhoneOpen);
  const isGuitarOpen = useGameStore((s) => s.isGuitarOpen);
  const isBagOpen = useGameStore((s) => s.isBagOpen);
  const isRidingScooter = useGameStore((s) => s.isRidingScooter);
  const setBagOpen = useGameStore((s) => s.setBagOpen);
  const umbrellaForcedOff = useGameStore((s) => s.umbrellaForcedOff);
  const toggleUmbrella = useGameStore((s) => s.toggleUmbrella);
  const isSitting = useGameStore((s) => s.isSitting);
  const repliedPhonePrompts = useGameStore((s) => s.repliedPhonePrompts);
  const openPhone = useGameStore((s) => s.openPhone);
  const interactPrompt = useGameStore((s) => s.interactPrompt);
  const toast = useGameStore((s) => s.toast);
  const customWaypoint = useGameStore((s) => s.customWaypoint);
  const showWaypoint = useGameStore((s) => s.settings.showWaypoint);
  const showMinimap = useGameStore((s) => s.settings.showMinimap);
  const toggleMapJournal = useGameStore((s) => s.toggleMapJournal);
  const setPauseOpen = useGameStore((s) => s.setPauseOpen);
  const setQuickGraphicsOpen = useGameStore((s) => s.setQuickGraphicsOpen);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);

  const [compassState, setCompassState] = useState({
    offsetPercent: 50,
    distance: 0,
    customOffsetPercent: 50,
    customDistance: 0,
    cardinal: 'U',
  });
  const [miniMap, setMiniMap] = useState<MiniMapState>({
    px: -19.5,
    pz: 67.5,
    headingDeg: 0,
    scooterX: -15.2,
    scooterZ: 57.5,
    scooterKmh: 0,
    cars: [],
    npcs: [],
  });

  const step = MAIN_STEP_BY_ID[mainStepId];
  const locInfo = LOCATION_BY_ID[currentLocation];

  useEffect(() => {
    if (screen !== 'playing') return;
    const id = window.setInterval(() => {
      const [px, , pz] = playerRuntime.position;
      const camYaw = playerRuntime.cameraYaw;
      const forwardX = -Math.sin(camYaw);
      const forwardZ = -Math.cos(camYaw);
      const headingDeg = ((Math.atan2(forwardX, -forwardZ) * 180) / Math.PI + 360) % 360;
      const cardinals = ['U', 'TL', 'T', 'TG', 'S', 'BD', 'B', 'BL'];
      const cardinal = cardinals[Math.round(headingDeg / 45) % 8];

      const calcMarker = (tx: number, tz: number) => {
        const dx = tx - px;
        const dz = tz - pz;
        const dist = Math.round(Math.hypot(dx, dz));
        const targetAngle = Math.atan2(dx, -dz);
        const camAngle = Math.atan2(forwardX, -forwardZ);
        let rel = targetAngle - camAngle;
        while (rel > Math.PI) rel -= Math.PI * 2;
        while (rel < -Math.PI) rel += Math.PI * 2;
        const clamped = Math.max(-1.2, Math.min(1.2, rel));
        return { offset: 50 + (clamped / 1.2) * 44, dist };
      };

      const mainM = step ? calcMarker(step.waypoint[0], step.waypoint[2]) : { offset: 50, dist: 0 };
      const customM = customWaypoint
        ? calcMarker(customWaypoint.position[0], customWaypoint.position[2])
        : { offset: 50, dist: 0 };

      setCompassState({
        offsetPercent: mainM.offset,
        distance: mainM.dist,
        customOffsetPercent: customM.offset,
        customDistance: customM.dist,
        cardinal,
      });

      setMiniMap({
        px,
        pz,
        headingDeg,
        scooterX: playerRuntime.scooter.pos[0],
        scooterZ: playerRuntime.scooter.pos[2],
        scooterKmh: Math.round(Math.abs(playerRuntime.scooter.speed) * 3.1),
        cars: playerRuntime.dynamicCarBoxes.map((c) => ({ x: c.x, z: c.z })),
        npcs: playerRuntime.npcColliders.map((n) => ({ x: n.x, z: n.z })),
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [screen, step, customWaypoint]);

  if (
    screen !== 'playing' ||
    activeDialogue ||
    isMapJournalOpen ||
    isPauseOpen ||
    isQuickGraphicsOpen ||
    isPhotoMode ||
    isPhoneOpen ||
    isGuitarOpen ||
    isBagOpen
  ) {
    return null;
  }

  const unreadPhoneCount = PHONE_THREADS.reduce(
    (sum, th) =>
      sum + th.prompts.filter((p) => p.chapterMin <= chapter && !repliedPhonePrompts[p.id]).length,
    0,
  );

  // Skala Mini-Map Radar: radius 48 meter di sekitar Damar -> 120px diameter
  const radarScale = 1.25;
  const toRadar = (wx: number, wz: number) => ({
    rx: 60 + (wx - miniMap.px) * radarScale,
    ry: 60 + (wz - miniMap.pz) * radarScale,
  });

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9990] flex flex-col justify-between p-5 md:p-7 text-warm-50">
        {/* === BARIS ATAS === */}
        <div className="flex items-start justify-between gap-4">
          {/* Kiri Atas: Objektif Misi Utama */}
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

          {/* Tengah Atas: Kompas Penunjuk Misi Utama + Custom GPS */}
          {(showWaypoint || customWaypoint) && (
            <div className="hidden md:flex flex-col items-center gap-1.5">
              <div className="relative h-8 w-72 overflow-hidden rounded-full border border-warm-100/15 bg-dusk-950/65 px-4 backdrop-blur-md">
                <div className="flex h-full items-center justify-between text-[10px] tracking-widest text-warm-200/45">
                  <span>B</span>
                  <span className="font-semibold text-warm-100/80">{compassState.cardinal}</span>
                  <span>T</span>
                </div>
                {showWaypoint && step && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100"
                    style={{ left: `${compassState.offsetPercent}%` }}
                  >
                    <div className="flex items-center gap-1 rounded-full bg-warm-400/95 px-2 py-0.5 text-[10px] font-bold text-dusk-950 shadow">
                      <Compass className="h-2.5 w-2.5" />
                      <span>{compassState.distance}m</span>
                    </div>
                  </div>
                )}
                {customWaypoint && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100"
                    style={{ left: `${compassState.customOffsetPercent}%` }}
                  >
                    <div className="flex items-center gap-1 rounded-full bg-cyan-400/95 px-2 py-0.5 text-[10px] font-bold text-dusk-950 shadow">
                      <Navigation className="h-2.5 w-2.5" />
                      <span>{compassState.customDistance}m</span>
                    </div>
                  </div>
                )}
              </div>
              {customWaypoint && (
                <span className="text-[10px] text-cyan-300/90">GPS: {customWaypoint.label}</span>
              )}
            </div>
          )}

          {/* Kanan Atas: Lokasi & Pintasan */}
          <div className="pointer-events-auto flex flex-col items-end gap-2">
            <div className="rounded-2xl border border-warm-100/15 bg-dusk-950/65 px-4 py-2.5 text-right backdrop-blur-md">
              <p className="font-serif text-sm text-warm-50">{locInfo.name}</p>
              <p className="text-[11px] text-warm-200/65">{locInfo.subtitle}</p>
            </div>
            <div className="flex flex-wrap justify-end items-center gap-1.5">
              <button
                type="button"
                onClick={() => openPhone('home')}
                className="relative flex items-center gap-1.5 rounded-xl border border-warm-300/35 bg-dusk-950/75 px-3 py-1.5 text-[11px] font-medium text-warm-100 backdrop-blur-md transition hover:border-warm-300/70"
                title="Buka Ponsel Damar"
              >
                <Smartphone className="h-3.5 w-3.5 text-warm-300" />
                <span>HP [H]</span>
                {unreadPhoneCount > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadPhoneCount}
                  </span>
                )}
              </button>
              {timeOfDay === 'rain_dusk' && !isRidingScooter && (
                <button
                  type="button"
                  onClick={toggleUmbrella}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] backdrop-blur-md transition ${
                    umbrellaForcedOff
                      ? 'border-warm-100/15 bg-dusk-950/70 text-warm-200/75 hover:border-sky-300/45'
                      : 'border-sky-300/50 bg-sky-950/75 text-sky-100 hover:border-sky-300'
                  }`}
                  title="Buka / Lipat Payung Hujan Bening"
                >
                  <Umbrella className="h-3.5 w-3.5 text-sky-300" />
                  <span>{umbrellaForcedOff ? 'Payung [U]' : 'Payung Aktif [U]'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setBagOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
                title="Buka Tas Selempang Damar"
              >
                <Backpack className="h-3.5 w-3.5 text-warm-300" />
                <span>Tas [I]</span>
              </button>
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
                onClick={() => setPhotoMode(true)}
                className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
                title="Mode Foto Sinematik"
              >
                <Camera className="h-3.5 w-3.5 text-warm-300" />
                <span>[P]</span>
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

        {/* Notifikasi Toast */}
        {toast && (
          <div className="fixed left-1/2 top-20 -translate-x-1/2 animate-fadeIn">
            <div className="rounded-full border border-warm-300/35 bg-dusk-950/88 px-5 py-2 text-xs text-warm-100 shadow-xl backdrop-blur-md">
              {toast.text}
            </div>
          </div>
        )}

        {/* === BARIS BAWAH: MINI-MAP RADAR + PROMPT [E] + KONTROL === */}
        <div className="flex items-end justify-between gap-4">
          {/* Kiri Bawah: Bonus Mini-Map Radar Real-Time */}
          {showMinimap ? (
            <button
              type="button"
              onClick={() => toggleMapJournal('map')}
              title="Klik untuk membuka Peta Kota penuh [M]"
              className="pointer-events-auto relative h-[124px] w-[124px] shrink-0 overflow-hidden rounded-full border-2 border-warm-200/30 bg-[#0e1522]/90 shadow-2xl backdrop-blur-md transition hover:border-warm-300/65"
            >
              <svg viewBox="0 0 120 120" className="h-full w-full">
                {/* Sungai */}
                <rect
                  x={toRadar(-56, 0).rx}
                  y={-20}
                  width={16 * radarScale}
                  height={160}
                  fill="#1d4d73"
                  opacity="0.85"
                />
                {/* Jalan Utama Jl. Kenangan & Jl. Cempaka & Jl. Melati */}
                <rect x={-20} y={toRadar(0, -5.6).ry} width={160} height={11.2 * radarScale} fill="#2d3748" />
                <rect x={toRadar(-5.6, 0).rx} y={-20} width={11.2 * radarScale} height={160} fill="#2d3748" />
                <rect x={-20} y={toRadar(0, 44.2).ry} width={160} height={7.6 * radarScale} fill="#333e52" />

                {/* Mobil Real-Time */}
                {miniMap.cars.map((c, idx) => {
                  const p = toRadar(c.x, c.z);
                  return <circle key={`mc-${idx}`} cx={p.rx} cy={p.ry} r="2.2" fill="#f87171" />;
                })}

                {/* NPC Sekitar */}
                {miniMap.npcs.map((n, idx) => {
                  const p = toRadar(n.x, n.z);
                  return <circle key={`mn-${idx}`} cx={p.rx} cy={p.ry} r="2.5" fill="#86efac" />;
                })}

                {/* Posisi Skuter Terparkir */}
                {!isRidingScooter && (() => {
                  const sp = toRadar(miniMap.scooterX, miniMap.scooterZ);
                  return <rect x={sp.rx - 2.5} y={sp.ry - 2.5} width="5" height="5" rx="1" fill="#a78bfa" stroke="#fff" strokeWidth="0.8" />;
                })()}

                {/* Penanda Misi Utama */}
                {showWaypoint && step && (() => {
                  const p = toRadar(step.waypoint[0], step.waypoint[2]);
                  const dx = p.rx - 60;
                  const dy = p.ry - 60;
                  const len = Math.hypot(dx, dy);
                  const clampedX = len > 52 ? 60 + (dx / len) * 52 : p.rx;
                  const clampedY = len > 52 ? 60 + (dy / len) * 52 : p.ry;
                  return <circle cx={clampedX} cy={clampedY} r="4" fill="#f5c249" stroke="#fff" strokeWidth="1" />;
                })()}

                {/* Penanda Custom GPS */}
                {customWaypoint && (() => {
                  const p = toRadar(customWaypoint.position[0], customWaypoint.position[2]);
                  const dx = p.rx - 60;
                  const dy = p.ry - 60;
                  const len = Math.hypot(dx, dy);
                  const clampedX = len > 52 ? 60 + (dx / len) * 52 : p.rx;
                  const clampedY = len > 52 ? 60 + (dy / len) * 52 : p.ry;
                  return <circle cx={clampedX} cy={clampedY} r="3.8" fill="#5ad6e6" stroke="#fff" strokeWidth="1" />;
                })()}

                {/* Posisi Damar & Arah Pandang di Tengah Radar */}
                <g transform={`translate(60, 60) rotate(${miniMap.headingDeg})`}>
                  <polygon points="0,0 -11,-24 11,-24" fill="rgba(56, 189, 248, 0.35)" />
                </g>
                <circle cx="60" cy="60" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-bold text-warm-200/75">
                U
              </span>
            </button>
          ) : (
            <div />
          )}

          {/* Tengah Bawah: Speedometer Skuter / Prompt Interaksi [E] / Status Duduk */}
          <div className="flex flex-1 flex-col items-center gap-2.5">
            {isRidingScooter && (
              <div className="flex items-center gap-4 rounded-full border border-warm-300/45 bg-dusk-950/88 px-6 py-2.5 shadow-2xl backdrop-blur-md animate-fadeIn">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-2xl font-semibold text-warm-300">
                    {miniMap.scooterKmh}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-warm-200/70">km/j</span>
                </div>
                <div className="h-5 w-px bg-warm-100/20" />
                <span className="text-xs text-warm-100">
                  <strong className="text-warm-300">WASD</strong> Kendarai ·{' '}
                  <strong className="text-warm-300">Spasi</strong> Klakson ·{' '}
                  <strong className="text-warm-300">E</strong> Parkir & Turun
                </span>
              </div>
            )}

            {!isRidingScooter && isSitting && (
              <div className="rounded-full border border-warm-300/40 bg-dusk-950/85 px-5 py-2 text-xs text-warm-100 shadow-xl backdrop-blur-md animate-fadeIn">
                Damar sedang beristirahat tenang · Tekan <strong className="text-warm-300">[WASD]</strong> atau{' '}
                <strong className="text-warm-300">[E]</strong> untuk berdiri
              </div>
            )}

            {!isRidingScooter && !isSitting && interactPrompt && (
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

            <p className="text-[11px] text-warm-200/55">
              WASD Jalan · H Ponsel · I Tas · {timeOfDay === 'rain_dusk' ? 'U Payung · ' : ''}F Sapa · P Foto · M Peta
            </p>
          </div>

          <div className="hidden md:block w-[124px]" />
        </div>
      </div>
    </Portal>
  );
};
