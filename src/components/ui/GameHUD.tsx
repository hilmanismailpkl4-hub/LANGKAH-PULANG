import React, { useEffect, useState } from 'react';
import {
  Backpack,
  BookOpen,
  Camera,
  Compass,
  Heart,
  Map as MapIcon,
  Maximize2,
  Menu,
  MessageSquareHeart,
  Minimize2,
  Navigation,
  RefreshCw,
  Sliders,
  Smartphone,
  Sparkles,
  Sunrise,
  Umbrella,
} from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { EPILOGUE_MORNING_META } from '../../data/epilogueMorning';
import { PHONE_THREADS } from '../../data/phoneContent';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { toggleFullscreenLandscape, useMobileViewport } from '../../utils/mobileUtils';
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
  bikeX: number;
  bikeZ: number;
  bikeKmh: number;
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
  const isZenMode = useGameStore((s) => s.isZenMode);
  const setZenMode = useGameStore((s) => s.setZenMode);
  const autoTimeCycle = useGameStore((s) => s.autoTimeCycle);
  const toggleAutoTimeCycle = useGameStore((s) => s.toggleAutoTimeCycle);
  const quickCycleTimeOfDay = useGameStore((s) => s.quickCycleTimeOfDay);
  const isPhoneOpen = useGameStore((s) => s.isPhoneOpen);
  const isGuitarOpen = useGameStore((s) => s.isGuitarOpen);
  const isNadiaLetterOpen = useGameStore((s) => s.isNadiaLetterOpen);
  const isEpilogueMode = useGameStore((s) => s.isEpilogueMode);
  const epilogueCompleted = useGameStore((s) => s.epilogueCompleted);
  const activeEnding = useGameStore((s) => s.activeEnding);
  const exitEpilogueToEnding = useGameStore((s) => s.exitEpilogueToEnding);
  const isBagOpen = useGameStore((s) => s.isBagOpen);
  const activeCulinarySpot = useGameStore((s) => s.activeCulinarySpot);
  const isWardrobeOpen = useGameStore((s) => s.isWardrobeOpen);
  const isLittleLibraryOpen = useGameStore((s) => s.isLittleLibraryOpen);
  const isBookStallOpen = useGameStore((s) => s.isBookStallOpen);
  const isKitchenOpen = useGameStore((s) => s.isKitchenOpen);
  const isPhotoAlbumOpen = useGameStore((s) => s.isPhotoAlbumOpen);
  const isFridgeNotesOpen = useGameStore((s) => s.isFridgeNotesOpen);
  const isNewsstandOpen = useGameStore((s) => s.isNewsstandOpen);
  const isMailboxOpen = useGameStore((s) => s.isMailboxOpen);
  const isRtBoardOpen = useGameStore((s) => s.isRtBoardOpen);
  const isTelescopeOpen = useGameStore((s) => s.isTelescopeOpen);
  const { isMobile, isCompactLandscape, isFullscreen } = useMobileViewport();
  const heldDrink = useGameStore((s) => s.heldDrink);
  const isRidingScooter = useGameStore((s) => s.isRidingScooter);
  const isRidingBicycle = useGameStore((s) => s.isRidingBicycle);
  const setBagOpen = useGameStore((s) => s.setBagOpen);
  const umbrellaForcedOff = useGameStore((s) => s.umbrellaForcedOff);
  const toggleUmbrella = useGameStore((s) => s.toggleUmbrella);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const familyBanter = useGameStore((s) => s.familyBanter);
  const toggleFamilyWalk = useGameStore((s) => s.toggleFamilyWalk);
  const triggerCasualFamilyChat = useGameStore((s) => s.triggerCasualFamilyChat);
  const isSitting = useGameStore((s) => s.isSitting);
  const isFlyingKite = useGameStore((s) => s.isFlyingKite);
  const isFishing = useGameStore((s) => s.isFishing);
  const fishingBiteReady = useGameStore((s) => s.fishingBiteReady);
  const reelFishingCatch = useGameStore((s) => s.reelFishingCatch);
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
    bikeX: -68.8,
    bikeZ: -8.5,
    bikeKmh: 0,
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
        bikeX: playerRuntime.bicycle.pos[0],
        bikeZ: playerRuntime.bicycle.pos[2],
        bikeKmh: Math.round(Math.abs(playerRuntime.bicycle.speed) * 3.0),
        cars: playerRuntime.dynamicCarBoxes.map((c) => ({ x: c.x, z: c.z })),
        npcs: playerRuntime.npcColliders.map((n) => ({ x: n.x, z: n.z })),
      });
    }, isMobile ? 190 : 100);
    return () => window.clearInterval(id);
  }, [screen, step, customWaypoint, isMobile]);

  if (
    screen !== 'playing' ||
    activeDialogue ||
    isMapJournalOpen ||
    isPauseOpen ||
    isQuickGraphicsOpen ||
    isPhotoMode ||
    isZenMode ||
    isPhoneOpen ||
    isGuitarOpen ||
    isNadiaLetterOpen ||
    isBagOpen ||
    Boolean(activeCulinarySpot) ||
    isWardrobeOpen ||
    isLittleLibraryOpen ||
    isBookStallOpen ||
    isKitchenOpen ||
    isPhotoAlbumOpen ||
    isFridgeNotesOpen ||
    isNewsstandOpen ||
    isMailboxOpen ||
    isRtBoardOpen ||
    isTelescopeOpen
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

  const compact = isMobile || isCompactLandscape;

  const renderRadarButton = (sizeClass: string) => (
    <button
      type="button"
      onClick={() => toggleMapJournal('map')}
      title="Klik untuk membuka Peta Kota penuh [M]"
      className={`pointer-events-auto relative shrink-0 overflow-hidden rounded-full border-2 border-warm-200/30 bg-[#0e1522]/90 shadow-2xl backdrop-blur-md transition hover:border-warm-300/65 ${sizeClass}`}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full">
        {/* Danau Senja & Lembah Sawah Hijau di Radar Mini */}
        <rect
          x={toRadar(-98, 0).rx}
          y={toRadar(0, -43).ry}
          width={28 * radarScale}
          height={30 * radarScale}
          rx="4"
          fill="#1b4d6e"
          opacity="0.88"
        />
        <rect
          x={toRadar(-91, 0).rx}
          y={toRadar(0, 50).ry}
          width={28 * radarScale}
          height={26 * radarScale}
          rx="3"
          fill="#2d5a3b"
          opacity="0.82"
        />
        <rect
          x={toRadar(-56, 0).rx}
          y={-20}
          width={16 * radarScale}
          height={160}
          fill="#1d4d73"
          opacity="0.85"
        />
        <rect x={-20} y={toRadar(0, -5.6).ry} width={160} height={11.2 * radarScale} fill="#2d3748" />
        <rect x={toRadar(-5.6, 0).rx} y={-20} width={11.2 * radarScale} height={160} fill="#2d3748" />
        <rect x={toRadar(59.3, 0).rx} y={-20} width={9.4 * radarScale} height={160} fill="#2d3748" />
        <rect x={-20} y={toRadar(0, 44.2).ry} width={160} height={7.6 * radarScale} fill="#333e52" />

        {miniMap.cars.map((c, idx) => {
          const p = toRadar(c.x, c.z);
          return <circle key={`mc-${idx}`} cx={p.rx} cy={p.ry} r="2.2" fill="#f87171" />;
        })}

        {miniMap.npcs.map((n, idx) => {
          const p = toRadar(n.x, n.z);
          const isFamDot = isFamilyWalkActive && (idx === 0 || idx === 1);
          return (
            <circle
              key={`mn-${idx}`}
              cx={p.rx}
              cy={p.ry}
              r={isFamDot ? '3.1' : '2.5'}
              fill={isFamDot ? '#f472b6' : '#86efac'}
              stroke={isFamDot ? '#ffffff' : 'none'}
              strokeWidth={isFamDot ? '0.8' : '0'}
            />
          );
        })}

        {!isRidingScooter && (() => {
          const sp = toRadar(miniMap.scooterX, miniMap.scooterZ);
          return <rect x={sp.rx - 2.5} y={sp.ry - 2.5} width="5" height="5" rx="1" fill="#a78bfa" stroke="#fff" strokeWidth="0.8" />;
        })()}
        {!isRidingBicycle && (() => {
          const bp = toRadar(miniMap.bikeX, miniMap.bikeZ);
          return <rect x={bp.rx - 2.5} y={bp.ry - 2.5} width="5" height="5" rx="1" fill="#34d399" stroke="#fff" strokeWidth="0.8" />;
        })()}

        {showWaypoint && step && (() => {
          const p = toRadar(step.waypoint[0], step.waypoint[2]);
          const dx = p.rx - 60;
          const dy = p.ry - 60;
          const len = Math.hypot(dx, dy);
          const clampedX = len > 52 ? 60 + (dx / len) * 52 : p.rx;
          const clampedY = len > 52 ? 60 + (dy / len) * 52 : p.ry;
          return <circle cx={clampedX} cy={clampedY} r="4" fill="#f5c249" stroke="#fff" strokeWidth="1" />;
        })()}

        {customWaypoint && (() => {
          const p = toRadar(customWaypoint.position[0], customWaypoint.position[2]);
          const dx = p.rx - 60;
          const dy = p.ry - 60;
          const len = Math.hypot(dx, dy);
          const clampedX = len > 52 ? 60 + (dx / len) * 52 : p.rx;
          const clampedY = len > 52 ? 60 + (dy / len) * 52 : p.ry;
          return <circle cx={clampedX} cy={clampedY} r="3.8" fill="#5ad6e6" stroke="#fff" strokeWidth="1" />;
        })()}

        <g transform={`translate(60, 60) rotate(${miniMap.headingDeg})`}>
          <polygon points="0,0 -11,-24 11,-24" fill="rgba(56, 189, 248, 0.35)" />
        </g>
        <circle cx="60" cy="60" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
      <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold text-warm-200/75">
        U
      </span>
    </button>
  );

  return (
    <Portal>
      <div
        className={`pointer-events-none fixed inset-0 z-[9990] flex flex-col justify-between text-warm-50 ${
          compact ? 'p-2.5' : 'p-5 md:p-7'
        }`}
        style={
          compact
            ? {
                paddingLeft: 'max(10px, env(safe-area-inset-left))',
                paddingRight: 'max(10px, env(safe-area-inset-right))',
                paddingTop: 'max(8px, env(safe-area-inset-top))',
                paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
              }
            : undefined
        }
      >
        {/* === BARIS ATAS === */}
        <div className="flex items-start justify-between gap-2">
          {/* Kiri Atas: Radar Mini (pada mode HP Landscape agar bawah-kiri lega untuk Joystick) + Objektif Misi */}
          <div className="flex items-start gap-2">
            {compact && showMinimap && renderRadarButton('h-[64px] w-[64px]')}

            {isEpilogueMode && activeEnding ? (
              <div
                className={`pointer-events-auto rounded-2xl border border-amber-300/45 bg-[#1b140d]/85 backdrop-blur-md shadow-lg ${
                  compact ? 'max-w-[215px] px-3 py-1.5' : 'max-w-xs px-4 py-3'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-300">
                  <span className="inline-flex items-center gap-1">
                    <Sunrise className="h-3 w-3" />
                    Epilog Playable
                  </span>
                  <button
                    type="button"
                    onClick={exitEpilogueToEnding}
                    className="rounded-full border border-amber-300/35 bg-amber-400/15 px-2 py-0.5 text-[9px] text-amber-100 hover:bg-amber-400/30"
                  >
                    Layar Ending
                  </button>
                </div>
                <p className={`mt-0.5 font-serif text-amber-50 ${compact ? 'text-xs leading-tight' : 'text-sm'}`}>
                  {EPILOGUE_MORNING_META[activeEnding].title.replace('Epilog · ', '')}
                </p>
                {!compact && (
                  <p className="mt-0.5 text-[11px] leading-snug text-amber-100/80">
                    {epilogueCompleted
                      ? 'Epilog selesai — kamu bebas menikmati pagi Kota Senja atau kembali ke Layar Ending.'
                      : EPILOGUE_MORNING_META[activeEnding].objectiveText}
                  </p>
                )}
              </div>
            ) : (
              <div
                className={`rounded-2xl border border-warm-100/15 bg-dusk-950/65 backdrop-blur-md ${
                  compact ? 'max-w-[195px] px-3 py-1.5' : 'max-w-xs px-4 py-3'
                }`}
              >
                <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-warm-300/90">
                  <span>Bab {chapter}</span>
                  <span className="text-warm-200/40">•</span>
                  <button
                    type="button"
                    onClick={quickCycleTimeOfDay}
                    title="Klik untuk mengganti suasana waktu/cuaca kota"
                    className="rounded-full border border-warm-200/20 bg-warm-400/10 px-1.5 py-0.5 text-warm-200 transition hover:border-warm-300/50 hover:bg-warm-400/25"
                  >
                    {TIME_LABELS[timeOfDay]}
                  </button>
                  <button
                    type="button"
                    onClick={toggleAutoTimeCycle}
                    title="Aktifkan/Matikan Siklus Waktu & Pelangi Otomatis"
                    className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 transition ${
                      autoTimeCycle
                        ? 'border-emerald-300/60 bg-emerald-500/20 text-emerald-200'
                        : 'border-warm-200/15 bg-dusk-900/60 text-warm-200/60 hover:text-warm-100'
                    }`}
                  >
                    <RefreshCw className={`h-2.5 w-2.5 ${autoTimeCycle ? 'animate-spin' : ''}`} />
                    {!compact && <span>Auto</span>}
                  </button>
                </div>
                {step && (
                  <>
                    <p className={`mt-0.5 font-serif text-warm-50 ${compact ? 'text-xs leading-tight' : 'text-sm'}`}>
                      {step.title}
                    </p>
                    {!compact && (
                      <p className="mt-0.5 text-[11px] leading-snug text-warm-200/70">{step.hint}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Tengah Atas: Kompas Penunjuk Misi Utama + Custom GPS */}
          {(showWaypoint || customWaypoint) && (
            <div className={`${compact ? 'hidden lg:flex' : 'hidden md:flex'} flex-col items-center gap-1.5`}>
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
          <div className={`pointer-events-auto flex flex-col items-end ${compact ? 'gap-1.5' : 'gap-2'}`}>
            <div
              className={`rounded-2xl border border-warm-100/15 bg-dusk-950/65 text-right backdrop-blur-md ${
                compact ? 'px-3 py-1.5' : 'px-4 py-2.5'
              }`}
            >
              <p className={`font-serif text-warm-50 ${compact ? 'text-xs leading-tight' : 'text-sm'}`}>
                {locInfo.name}
              </p>
              {!compact && <p className="text-[11px] text-warm-200/65">{locInfo.subtitle}</p>}
            </div>
            <div className="flex flex-wrap justify-end items-center gap-1">
              <button
                type="button"
                onClick={() => openPhone('home')}
                className={`relative flex items-center gap-1 rounded-xl border border-warm-300/35 bg-dusk-950/75 font-medium text-warm-100 backdrop-blur-md transition hover:border-warm-300/70 ${
                  compact ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Buka Ponsel Damar"
              >
                <Smartphone className="h-3.5 w-3.5 text-warm-300" />
                <span>{compact ? 'HP' : 'HP [H]'}</span>
                {unreadPhoneCount > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadPhoneCount}
                  </span>
                )}
              </button>
              {!isRidingScooter && !isRidingBicycle && (
                <button
                  type="button"
                  onClick={toggleFamilyWalk}
                  className={`flex items-center gap-1 rounded-xl border font-medium backdrop-blur-md transition ${
                    compact ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-1.5 text-[11px]'
                  } ${
                    isFamilyWalkActive
                      ? 'border-rose-300/60 bg-rose-950/75 text-rose-100 hover:border-rose-300'
                      : 'border-warm-100/15 bg-dusk-950/70 text-warm-100 hover:border-rose-300/50'
                  }`}
                  title={isFamilyWalkActive ? 'Antar Nadia & Kira kembali ke rumah' : 'Ajak Nadia & Kira jalan sore bersama'}
                >
                  <Heart className={`h-3.5 w-3.5 ${isFamilyWalkActive ? 'fill-rose-300 text-rose-300' : 'text-rose-300'}`} />
                  <span>
                    {compact
                      ? isFamilyWalkActive
                        ? 'Keluarga'
                        : 'Ajak'
                      : isFamilyWalkActive
                        ? 'Jalan Bersama [G]'
                        : 'Ajak Keluarga [G]'}
                  </span>
                </button>
              )}
              {!compact && isFamilyWalkActive && !isRidingScooter && !isRidingBicycle && (
                <button
                  type="button"
                  onClick={triggerCasualFamilyChat}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-300/35 bg-dusk-950/75 px-3 py-1.5 text-[11px] text-rose-100 backdrop-blur-md transition hover:border-rose-300/75"
                  title="Ajak Nadia & Kira ngobrol santai sambil jalan"
                >
                  <MessageSquareHeart className="h-3.5 w-3.5 text-rose-300" />
                  <span>Ngobrol [T]</span>
                </button>
              )}
              {!compact && timeOfDay === 'rain_dusk' && !isRidingScooter && !isRidingBicycle && (
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
                className={`flex items-center gap-1 rounded-xl border border-warm-100/15 bg-dusk-950/70 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45 ${
                  compact ? 'p-1.5' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Buka Tas Selempang Damar"
              >
                <Backpack className="h-3.5 w-3.5 text-warm-300" />
                {!compact && <span>Tas [I]</span>}
              </button>
              <button
                type="button"
                onClick={() => toggleMapJournal('map')}
                className={`flex items-center gap-1 rounded-xl border border-warm-100/15 bg-dusk-950/70 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45 ${
                  compact ? 'p-1.5' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Peta Kota"
              >
                <MapIcon className="h-3.5 w-3.5 text-warm-300" />
                {!compact && <span>Peta [M]</span>}
              </button>
              {!compact && (
                <button
                  type="button"
                  onClick={() => toggleMapJournal('journal')}
                  className="flex items-center gap-1.5 rounded-xl border border-warm-100/15 bg-dusk-950/70 px-3 py-1.5 text-[11px] text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
                >
                  <BookOpen className="h-3.5 w-3.5 text-warm-300" />
                  <span>Catatan [Tab]</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setZenMode(true)}
                className={`flex items-center gap-1 rounded-xl border border-warm-100/15 bg-dusk-950/70 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45 ${
                  compact ? 'p-1.5' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Mode Renungan Sinematik [Z] (Sembunyikan HUD)"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                {!compact && <span>[Z]</span>}
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode(true)}
                className={`flex items-center gap-1 rounded-xl border border-warm-100/15 bg-dusk-950/70 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45 ${
                  compact ? 'p-1.5' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Mode Foto Sinematik"
              >
                <Camera className="h-3.5 w-3.5 text-warm-300" />
                {!compact && <span>[P]</span>}
              </button>
              <button
                type="button"
                onClick={() => setQuickGraphicsOpen(true)}
                className={`flex items-center gap-1 rounded-xl border border-warm-100/15 bg-dusk-950/70 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45 ${
                  compact ? 'p-1.5' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Pengaturan Grafis & Anti-Lag"
              >
                <Sliders className="h-3.5 w-3.5 text-warm-300" />
                {!compact && <span>Grafis</span>}
              </button>
              {isMobile && (
                <button
                  type="button"
                  onClick={() => {
                    void toggleFullscreenLandscape();
                  }}
                  className="flex items-center justify-center rounded-xl border border-warm-100/15 bg-dusk-950/70 p-1.5 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45"
                  title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh Landscape'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-3.5 w-3.5 text-warm-300" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5 text-warm-300" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setPauseOpen(true)}
                className={`flex items-center gap-1 rounded-xl border border-warm-100/15 bg-dusk-950/70 text-warm-100 backdrop-blur-md transition hover:border-warm-300/45 ${
                  compact ? 'p-1.5' : 'px-3 py-1.5 text-[11px]'
                }`}
                title="Menu & Jeda"
              >
                <Menu className="h-3.5 w-3.5 text-warm-300" />
                {!compact && <span>[Esc]</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Notifikasi Toast */}
        {toast && (
          <div className={`fixed left-1/2 -translate-x-1/2 animate-fadeIn ${compact ? 'top-14 max-w-[72vw]' : 'top-20'}`}>
            <div className="rounded-full border border-warm-300/35 bg-dusk-950/88 px-4 py-1.5 text-center text-[11px] text-warm-100 shadow-xl backdrop-blur-md">
              {toast.text}
            </div>
          </div>
        )}

        {/* === BARIS BAWAH: MINI-MAP RADAR (Desktop) + PROMPT [E] + KONTROL === */}
        <div className="flex items-end justify-between gap-4">
          {/* Kiri Bawah: Mini-Map Radar Real-Time (Khusus Desktop — pada HP pindah ke kiri atas agar joystick lega!) */}
          {!compact && showMinimap ? renderRadarButton('h-[124px] w-[124px]') : <div />}

          {/* Tengah Bawah: Obrolan Spontan Keluarga + Speedometer / Prompt [E] / Status Duduk */}
          <div className={`flex flex-1 flex-col items-center gap-2 ${compact ? 'px-28 pb-1' : ''}`}>
            {familyBanter && (
              <div
                key={familyBanter.id}
                className={`rounded-2xl border border-rose-200/30 bg-dusk-950/86 text-center shadow-2xl backdrop-blur-md animate-fadeIn ${
                  compact ? 'max-w-md px-3.5 py-2' : 'max-w-xl px-5 py-3'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CHARACTERS[familyBanter.speaker].accentColor }}
                  />
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: CHARACTERS[familyBanter.speaker].accentColor }}
                  >
                    {CHARACTERS[familyBanter.speaker].name}
                  </span>
                </div>
                <p className={`mt-0.5 font-serif italic leading-snug text-warm-50 ${compact ? 'text-xs' : 'text-sm'}`}>
                  "{familyBanter.text}"
                </p>
              </div>
            )}

            {isRidingScooter && (
              <div className="flex items-center gap-3 rounded-full border border-warm-300/45 bg-dusk-950/88 px-4 py-1.5 shadow-2xl backdrop-blur-md animate-fadeIn">
                <div className="flex items-baseline gap-1">
                  <span className={`font-serif font-semibold text-warm-300 ${compact ? 'text-lg' : 'text-2xl'}`}>
                    {miniMap.scooterKmh}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-warm-200/70">km/j</span>
                </div>
                {!compact && (
                  <>
                    <div className="h-5 w-px bg-warm-100/20" />
                    <span className="text-xs text-warm-100">
                      <strong className="text-warm-300">WASD</strong> Kendarai ·{' '}
                      <strong className="text-warm-300">Spasi</strong> Klakson ·{' '}
                      <strong className="text-warm-300">E</strong> Parkir & Turun
                    </span>
                  </>
                )}
              </div>
            )}

            {isRidingBicycle && (
              <div className="flex items-center gap-3 rounded-full border border-emerald-300/45 bg-dusk-950/88 px-4 py-1.5 shadow-2xl backdrop-blur-md animate-fadeIn">
                <div className="flex items-baseline gap-1">
                  <span className={`font-serif font-semibold text-emerald-300 ${compact ? 'text-lg' : 'text-2xl'}`}>
                    {miniMap.bikeKmh}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-warm-200/70">km/j</span>
                </div>
                {!compact && (
                  <>
                    <div className="h-5 w-px bg-warm-100/20" />
                    <span className="text-xs text-warm-100">
                      <strong className="text-emerald-300">WASD</strong> Kayuh ·{' '}
                      <strong className="text-emerald-300">Spasi</strong> Bel Kring-Kring ·{' '}
                      <strong className="text-emerald-300">E</strong> Parkir & Turun
                    </span>
                  </>
                )}
              </div>
            )}

            {!isRidingScooter && !isRidingBicycle && isFishing && (
              <div className="pointer-events-auto animate-fadeIn">
                {fishingBiteReady ? (
                  <button
                    type="button"
                    onClick={reelFishingCatch}
                    className="rounded-full border border-emerald-300 bg-emerald-500/90 px-5 py-2 text-xs font-bold text-dusk-950 shadow-2xl animate-pulse hover:bg-emerald-400"
                  >
                    {compact ? 'Ada Tarikan! Ketuk Tarik Kail!' : 'Ada Tarikan Halus di Pelampung! Tekan [Spasi] atau Klik Sekarang!'}
                  </button>
                ) : (
                  <div className="rounded-full border border-sky-300/45 bg-dusk-950/88 px-4 py-1.5 text-[11px] text-warm-100 shadow-2xl backdrop-blur-md">
                    {compact
                      ? 'Memancing di Danau Senja · Menunggu tarikan...'
                      : 'Memancing Santai di Danau Senja · Menunggu pelampung mencelup... · [P] Foto · [WASD / E] Selesai'}
                  </div>
                )}
              </div>
            )}

            {!isRidingScooter && !isRidingBicycle && !isFishing && isFlyingKite && (
              <div className="rounded-full border border-amber-300/50 bg-dusk-950/88 px-4 py-1.5 text-[11px] text-warm-100 shadow-2xl backdrop-blur-md animate-fadeIn">
                {compact
                  ? 'Layang-Layang Mengudara · Ketuk Tarik Layangan di kanan!'
                  : 'Layang-Layang Mengudara · Tekan [Spasi] Tarik Lebih Tinggi · [P] Foto · [WASD / E] Gulung Benang'}
              </div>
            )}

            {!isRidingScooter && !isRidingBicycle && !isFishing && !isFlyingKite && isSitting && (
              <div className="rounded-full border border-warm-300/40 bg-dusk-950/85 px-4 py-1.5 text-[11px] text-warm-100 shadow-xl backdrop-blur-md animate-fadeIn">
                {heldDrink ? `Menikmati ${heldDrink.label}` : 'Damar sedang beristirahat tenang'} ·{' '}
                {compact ? 'Geser joystick atau ketuk Berdiri' : 'Tekan [WASD / E] berdiri · [P] Foto'}
              </div>
            )}

            {!isRidingScooter && !isRidingBicycle && !isFishing && !isFlyingKite && !isSitting && interactPrompt && (
              <div className="pointer-events-auto animate-fadeIn">
                <button
                  type="button"
                  onClick={() => playerRuntime.nearestInteractable?.onInteract()}
                  className={`flex items-center gap-2.5 rounded-full border border-warm-300/45 bg-dusk-950/85 shadow-xl backdrop-blur-md transition hover:bg-dusk-900 ${
                    compact ? 'px-3.5 py-1.5' : 'px-5 py-2.5'
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-warm-400 text-xs font-bold text-dusk-950">
                    {compact ? '✦' : 'E'}
                  </span>
                  <div className="text-left">
                    <p className={`font-medium text-warm-50 ${compact ? 'text-xs' : 'text-sm'}`}>
                      {interactPrompt.label}
                    </p>
                    {interactPrompt.sublabel && (
                      <p className="text-[9px] uppercase tracking-wider text-warm-300/85">
                        {interactPrompt.sublabel}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            )}

            {!isMobile && (
              <p className="text-[11px] text-warm-200/55">
                WASD Jalan · G {isFamilyWalkActive ? 'Antar Pulang' : 'Ajak Keluarga'} · {isFamilyWalkActive ? 'T Ngobrol · ' : ''}H Ponsel · I Tas · {timeOfDay === 'rain_dusk' ? 'U Payung · ' : ''}F Sapa · P Foto · M Peta
              </p>
            )}
          </div>

          {!compact && <div className="hidden md:block w-[124px]" />}
        </div>
      </div>
    </Portal>
  );
};
