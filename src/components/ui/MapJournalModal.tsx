import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Feather,
  Film,
  GitBranch,
  Heart,
  Map as MapIcon,
  Navigation,
  Play,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { EASTER_EGGS } from '../../data/easterEggs';
import { SIDE_QUESTS } from '../../data/sideQuests';
import {
  buildStoryTimeline,
  classifyJournalSketch,
  getJournalMoodNote,
  JOURNAL_FLASHBACK_REELS,
  JournalSketchKind,
} from '../../data/storyJournal';
import { LOCATION_BY_ID, WORLD_LOCATIONS } from '../../data/worldLocations';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { LocationId } from '../../types/game';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

/**
 * Sketsa tinta tangan mungil (hand-drawn vintage diary ink art) untuk menghidupkan
 * setiap lembar catatan harian Damar Pratama.
 */
const JournalInkSketch: React.FC<{ kind: JournalSketchKind }> = ({ kind }) => {
  const stroke = '#e7b87d';
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-300/25 bg-[#1b1612]/90 shadow-inner">
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {kind === 'guitar' && (
          <>
            <ellipse cx="18" cy="31" rx="8" ry="6.5" transform="rotate(-35 18 31)" fill="rgba(231,184,125,0.12)" />
            <circle cx="18" cy="31" r="2.2" />
            <line x1="23" y1="26" x2="36" y2="12" />
            <line x1="34" y1="10" x2="39" y2="14" />
            <path d="M29 9 Q31 6 33 8" opacity="0.7" />
          </>
        )}
        {kind === 'coffee' && (
          <>
            <path d="M12 20 H30 V31 C30 35 26 37 21 37 C16 37 12 35 12 31 Z" fill="rgba(231,184,125,0.12)" />
            <path d="M30 22 H34 C36 22 36 29 34 29 H30" />
            <line x1="10" y1="39" x2="33" y2="39" />
            <path d="M17 15 Q19 12 17 9" opacity="0.8" />
            <path d="M24 15 Q26 12 24 9" opacity="0.8" />
          </>
        )}
        {kind === 'rain' && (
          <>
            <path d="M12 25 C12 20 16 17 20 18 C22 14 29 14 31 18 C35 18 37 21 36 25 Z" fill="rgba(147,197,253,0.14)" stroke="#93c5fd" />
            <line x1="17" y1="30" x2="15" y2="36" stroke="#93c5fd" />
            <line x1="24" y1="30" x2="22" y2="37" stroke="#93c5fd" />
            <line x1="31" y1="30" x2="29" y2="36" stroke="#93c5fd" />
          </>
        )}
        {kind === 'star' && (
          <>
            <polygon
              points="24,9 28.2,18.2 38,19.4 30.8,26 32.6,36 24,31 15.4,36 17.2,26 10,19.4 19.8,18.2"
              fill="rgba(246,209,122,0.18)"
              stroke="#f6d17a"
            />
            <circle cx="37" cy="12" r="1.4" fill="#f6d17a" stroke="none" />
          </>
        )}
        {kind === 'lake' && (
          <>
            <polygon points="15,27 33,27 29,33 19,33" fill="rgba(231,184,125,0.14)" />
            <polygon points="24,14 24,27 31,27" fill="rgba(231,184,125,0.1)" />
            <path d="M9 36 Q16 33 24 36 T39 36" stroke="#7dd3fc" />
          </>
        )}
        {kind === 'office' && (
          <>
            <rect x="14" y="10" width="20" height="29" rx="1.5" fill="rgba(148,163,184,0.12)" stroke="#94a3b8" />
            <line x1="19" y1="16" x2="22" y2="16" stroke="#94a3b8" />
            <line x1="26" y1="16" x2="29" y2="16" stroke="#94a3b8" />
            <line x1="19" y1="22" x2="22" y2="22" stroke="#94a3b8" />
            <line x1="26" y1="22" x2="29" y2="22" stroke="#94a3b8" />
            <line x1="19" y1="28" x2="22" y2="28" stroke="#f6d17a" />
            <line x1="26" y1="28" x2="29" y2="28" stroke="#94a3b8" />
          </>
        )}
        {kind === 'photo' && (
          <>
            <rect x="10" y="13" width="28" height="22" rx="2.5" fill="rgba(231,184,125,0.12)" />
            <circle cx="19" cy="21" r="2.6" />
            <path d="M12 32 L21 24 L27 29 L31 25 L36 32" />
          </>
        )}
        {kind === 'home' && (
          <>
            <path d="M10 23 L24 11 L38 23" />
            <rect x="14" y="23" width="20" height="15" rx="1" fill="rgba(231,184,125,0.12)" />
            <rect x="20" y="28" width="8" height="10" fill="rgba(246,209,122,0.3)" />
          </>
        )}
      </svg>
    </div>
  );
};

// Konversi koordinat dunia 3D (x: -112..102, z: -68..92) ke viewBox SVG 800x600
function toSvg(x: number, z: number): { sx: number; sy: number } {
  const sx = ((x + 112) / 214) * 800;
  const sy = ((z + 68) / 160) * 600;
  return { sx, sy };
}

export const MapJournalModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isMapJournalOpen);
  const tab = useGameStore((s) => s.mapJournalTab);
  const toggleMapJournal = useGameStore((s) => s.toggleMapJournal);
  const closeMapJournal = useGameStore((s) => s.closeMapJournal);
  const journalName = useGameStore((s) => s.journalName);
  const chapter = useGameStore((s) => s.chapter);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const mainStepId = useGameStore((s) => s.mainStepId);
  const emotions = useGameStore((s) => s.emotions);
  const flags = useGameStore((s) => s.flags);
  const repliedPhonePrompts = useGameStore((s) => s.repliedPhonePrompts);
  const activeEnding = useGameStore((s) => s.activeEnding);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const journalEntries = useGameStore((s) => s.journalEntries);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const customWaypoint = useGameStore((s) => s.customWaypoint);
  const setCustomWaypoint = useGameStore((s) => s.setCustomWaypoint);
  const startDialogue = useGameStore((s) => s.startDialogue);
  const openChapterCardPreview = useGameStore((s) => s.openChapterCardPreview);

  const [selectedLocId, setSelectedLocId] = useState<LocationId>(currentLocation);
  const [zoom, setZoom] = useState(1);
  const [filterMode, setFilterMode] = useState<'all' | 'quests' | 'memories'>('all');
  const [journalSubTab, setJournalSubTab] = useState<'diary' | 'timeline' | 'flashbacks' | 'memories'>('diary');
  const [memoryFilter, setMemoryFilter] = useState<'all' | 'found' | 'missing'>('all');
  const [livePos, setLivePos] = useState({
    x: playerRuntime.position[0],
    z: playerRuntime.position[2],
    yaw: playerRuntime.cameraYaw,
  });
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  const storyTimeline = useMemo(
    () =>
      buildStoryTimeline({
        chapter,
        mainStepId,
        flags,
        repliedPhonePrompts,
        activeEnding,
      }),
    [chapter, mainStepId, flags, repliedPhonePrompts, activeEnding],
  );

  const heartMoodNote = useMemo(
    () =>
      getJournalMoodNote({
        chapter,
        timeOfDay,
        emotions,
        sideQuests,
        flags,
      }),
    [chapter, timeOfDay, emotions, sideQuests, flags],
  );

  const flashbacksSeenCount = JOURNAL_FLASHBACK_REELS.filter((r) => flags.includes(r.flag)).length;
  const totalHeart = Math.max(
    1,
    emotions.kejujuranDiri + emotions.kehadiranKeluarga + emotions.ambisiPelarian,
  );
  const honestyPct = Math.round((emotions.kejujuranDiri / totalHeart) * 100);
  const familyPct = Math.round((emotions.kehadiranKeluarga / totalHeart) * 100);
  const ambitionPct = Math.round((emotions.ambisiPelarian / totalHeart) * 100);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedLocId(currentLocation);
    setLivePos({
      x: playerRuntime.position[0],
      z: playerRuntime.position[2],
      yaw: playerRuntime.cameraYaw,
    });
  }, [isOpen, currentLocation]);

  if (!isOpen) return null;

  const mainStep = MAIN_STEP_BY_ID[mainStepId];
  const playerSvg = toSvg(livePos.x, livePos.z);
  const mainSvg = mainStep ? toSvg(mainStep.waypoint[0], mainStep.waypoint[2]) : null;
  const customSvg = customWaypoint
    ? toSvg(customWaypoint.position[0], customWaypoint.position[2])
    : null;

  const selectedLoc = LOCATION_BY_ID[selectedLocId] ?? LOCATION_BY_ID.rumah_damar;
  const locEasterEggs = EASTER_EGGS.filter((e) => e.location === selectedLoc.id);
  const locFoundCount = locEasterEggs.filter((e) => discoveredEasterEggs.includes(e.id)).length;
  const completedSideCount = Object.values(sideQuests).filter((q) => q.status === 'completed').length;
  const distToSelected = Math.round(
    Math.hypot(livePos.x - selectedLoc.center[0], livePos.z - selectedLoc.center[2]),
  );

  // Hitung arah hadap kerucut pandang kamera di SVG
  const fwdX = -Math.sin(livePos.yaw);
  const fwdZ = -Math.cos(livePos.yaw);
  const headingDeg = (Math.atan2(fwdX, -fwdZ) * 180) / Math.PI;

  const isCustomAtSelected = customWaypoint?.label === selectedLoc.name;

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/84 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4 md:p-7'
        }`}
      >
        <div
          className={`flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-warm-200/20 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn ${
            compact ? 'h-[94dvh]' : 'h-[88vh]'
          }`}
        >
          {/* Header & Tab */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 border-b border-warm-100/10 ${
              compact ? 'px-4 py-2' : 'px-6 py-4 gap-4'
            }`}
          >
            <div>
              {!compact && (
                <p className="text-[11px] uppercase tracking-[0.2em] text-warm-300/80">
                  Bab {chapter} · {journalName}
                </p>
              )}
              <h2 className={`font-serif text-warm-50 ${compact ? 'text-sm' : 'text-xl'}`}>
                {compact ? `Bab ${chapter} · Peta & Catatan` : 'Peta Kota & Catatan Perjalanan'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: 'map', label: compact ? 'Peta' : 'Peta Kota', icon: MapIcon },
                  {
                    id: 'quests',
                    label: compact ? `Misi (${completedSideCount}/${SIDE_QUESTS.length})` : `Misi (${completedSideCount}/${SIDE_QUESTS.length})`,
                    icon: Compass,
                  },
                  {
                    id: 'journal',
                    label: compact
                      ? `Catatan (${discoveredEasterEggs.length}/${EASTER_EGGS.length})`
                      : `Catatan & Memori (${discoveredEasterEggs.length}/${EASTER_EGGS.length})`,
                    icon: BookOpen,
                  },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleMapJournal(id)}
                  className={`flex items-center gap-1.5 rounded-xl font-medium transition ${
                    compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3.5 py-2 text-xs'
                  } ${
                    tab === id
                      ? 'bg-warm-400 text-dusk-950'
                      : 'border border-warm-100/15 bg-dusk-950/60 text-warm-200 hover:border-warm-300/40'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={closeMapJournal}
                className="ml-1 rounded-xl p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Konten Utama */}
          <div className={`flex-1 ${tab === 'map' && compact ? 'overflow-hidden p-2.5' : compact ? 'overflow-y-auto subtle-scroll p-3' : 'overflow-y-auto subtle-scroll p-5 md:p-6'}`}>
            {/* === TAB 1: PETA KOTA MODERN SVG === */}
            {tab === 'map' && (
              <div className={`grid h-full ${compact ? 'grid-cols-12 gap-2.5' : 'grid-cols-1 gap-5 lg:grid-cols-12'}`}>
                {/* Kanvas Peta Vektor Modern */}
                <div
                  className={`relative flex flex-col overflow-hidden rounded-2xl border border-warm-200/20 bg-[#101622] ${
                    compact ? 'col-span-7 min-h-0' : 'min-h-[420px] lg:col-span-8'
                  }`}
                >
                  {/* Toolbar atas peta */}
                  <div
                    className={`z-20 flex flex-wrap items-center justify-between gap-2 border-b border-warm-100/10 bg-dusk-950/85 text-[11px] ${
                      compact ? 'px-2.5 py-1.5' : 'px-4 py-2.5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {(
                        [
                          { id: 'all', label: 'Semua' },
                          { id: 'quests', label: 'Fokus Misi' },
                          { id: 'memories', label: 'Fragmen Memori' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFilterMode(f.id)}
                          className={`rounded-lg px-2.5 py-1 transition ${
                            filterMode === f.id
                              ? 'bg-warm-400 font-semibold text-dusk-950'
                              : 'bg-dusk-900 text-warm-200/75 hover:text-warm-50'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                        className="rounded-lg border border-warm-100/15 bg-dusk-900 p-1.5 text-warm-200 hover:border-warm-300/45"
                        title="Perkecil Peta"
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[40px] text-center text-warm-200/75">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoom((z) => Math.min(1.75, +(z + 0.25).toFixed(2)))}
                        className="rounded-lg border border-warm-100/15 bg-dusk-900 p-1.5 text-warm-200 hover:border-warm-300/45"
                        title="Perbesar Peta"
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Viewport SVG Peta */}
                  <div className="relative flex-1 overflow-auto subtle-scroll bg-[#0f1520]">
                    <svg
                      viewBox="0 0 800 600"
                      className={`h-full w-full transition-transform duration-200 origin-center ${
                        compact ? '' : 'min-h-[380px]'
                      }`}
                      style={{ transform: `scale(${zoom})` }}
                    >
                      <defs>
                        <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="rgba(148,163,184,0.06)"
                            strokeWidth="1"
                          />
                        </pattern>
                        <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#163a59" />
                          <stop offset="50%" stopColor="#21557d" />
                          <stop offset="100%" stopColor="#163a59" />
                        </linearGradient>
                        <radialGradient id="lakeGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#26648f" />
                          <stop offset="100%" stopColor="#163d5c" />
                        </radialGradient>
                        <linearGradient id="viewCone" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
                          <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                        </linearGradient>
                      </defs>

                      {/* Latar & Grid */}
                      <rect width="800" height="600" fill="#121a26" />
                      <rect width="800" height="600" fill="url(#mapGrid)" />

                      {/* Zona Hijau Taman Kota & Perumahan */}
                      <rect x="20" y="32" width="185" height="390" rx="22" fill="#182b24" opacity="0.88" />
                      {/* Area Taman Bermain & Lapangan Layangan */}
                      <rect
                        x={toSvg(-89, 17).sx}
                        y={toSvg(-89, 17).sy}
                        width={toSvg(-74, 17).sx - toSvg(-89, 17).sx}
                        height={toSvg(-89, 28).sy - toSvg(-89, 17).sy}
                        rx="6"
                        fill="#3b3629"
                        stroke="#d8c39b"
                        strokeOpacity="0.4"
                        strokeWidth="1"
                      />
                      <text
                        x={toSvg(-81.5, 22.8).sx}
                        y={toSvg(-81.5, 22.8).sy + 2}
                        fill="rgba(246,209,122,0.7)"
                        fontSize="7.5"
                        textAnchor="middle"
                      >
                        TAMAN BERMAIN
                      </text>
                      {/* Penanda Air Mancur Mini & Tikar Piknik Keluarga di Taman Kota */}
                      {(() => {
                        const fp = toSvg(-65.5, 10.5);
                        const pp = toSvg(-72.0, 29.8);
                        return (
                          <>
                            <g transform={`translate(${fp.sx}, ${fp.sy})`}>
                              <circle r="5" fill="#38bdf8" fillOpacity="0.28" stroke="#7dd3fc" strokeWidth="1" />
                              <circle r="2" fill="#e0f2fe" />
                            </g>
                            <g transform={`translate(${pp.sx}, ${pp.sy})`}>
                              <rect x="-5" y="-4" width="10" height="8" rx="1.5" fill="#dc6b5a" stroke="#fef3c7" strokeWidth="1" />
                              <text y="12" fill="rgba(254,226,226,0.78)" fontSize="6.8" textAnchor="middle">
                                PIKNIK
                              </text>
                            </g>
                          </>
                        );
                      })()}
                      <rect x="275" y="425" width="320" height="150" rx="18" fill="#182621" opacity="0.72" />

                      {/* Area Beton Pusat Kota */}
                      <rect x="285" y="52" width="355" height="360" rx="14" fill="#192231" opacity="0.8" />

                      {/* Danau Senja + Dermaga Kayu */}
                      <ellipse cx={toSvg(-84, -28).sx} cy={toSvg(-84, -28).sy} rx="55" ry="56" fill="url(#lakeGrad)" stroke="#3574a3" strokeWidth="1.5" />
                      <rect
                        x={toSvg(-77.5, -30.2).sx}
                        y={toSvg(-77.5, -30.2).sy}
                        width="34"
                        height="16"
                        rx="2"
                        fill="#8b623f"
                      />

                      {/* Sungai Kota */}
                      <rect
                        x={toSvg(-56, -68).sx}
                        y="0"
                        width={toSvg(-40, -68).sx - toSvg(-56, -68).sx}
                        height="600"
                        fill="url(#riverGrad)"
                      />

                      {/* Sorotan Untaian Lampion Tepi Sungai & Gerobak Martabak */}
                      {[-24, -14, 14, 24, 34].map((lz) => {
                        const lEast = toSvg(-39.75, lz);
                        const lWest = toSvg(-56.25, lz);
                        return (
                          <g key={`map-ln-${lz}`} opacity="0.72">
                            <line
                              x1={lWest.sx}
                              y1={lWest.sy}
                              x2={lEast.sx}
                              y2={lEast.sy}
                              stroke="#fbbf24"
                              strokeWidth="1.2"
                              strokeDasharray="3 4"
                            />
                            <circle cx={lEast.sx} cy={lEast.sy} r="2.2" fill="#fb923c" />
                            <circle cx={lWest.sx} cy={lWest.sy} r="2.2" fill="#fb923c" />
                          </g>
                        );
                      })}
                      {(() => {
                        const mb = toSvg(-36.6, 23.8);
                        return (
                          <g transform={`translate(${mb.sx}, ${mb.sy})`}>
                            <circle r="7.5" fill="rgba(251, 146, 60, 0.25)" />
                            <circle r="3.6" fill="#fb923c" stroke="#fff7ed" strokeWidth="1.2" />
                            <text
                              x="9"
                              y="3"
                              fill="rgba(253, 186, 116, 0.9)"
                              fontSize="7.5"
                              fontWeight="600"
                            >
                              MARTABAK & LAMPION
                            </text>
                          </g>
                        );
                      })()}

                      {/* Rel Kereta Stasiun Timur */}
                      <line
                        x1={toSvg(94.3, -68).sx}
                        y1="0"
                        x2={toSvg(94.3, 92).sx}
                        y2="600"
                        stroke="#64748b"
                        strokeWidth="4"
                        strokeDasharray="6 6"
                      />

                      {/* Jaringan Jalan Aspal Utama */}
                      {/* Jl. Kenangan (Barat-Timur) */}
                      <rect
                        x={toSvg(-98, -5.6).sx}
                        y={toSvg(-98, -5.6).sy}
                        width={toSvg(86, -5.6).sx - toSvg(-98, -5.6).sx}
                        height="40"
                        fill="#262f3f"
                      />
                      <line
                        x1={toSvg(-96, 0).sx}
                        y1={toSvg(0, 0).sy}
                        x2={toSvg(82, 0).sx}
                        y2={toSvg(0, 0).sy}
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1.5"
                        strokeDasharray="10 10"
                      />
                      {/* Jl. Cempaka (Utara-Selatan) */}
                      <rect
                        x={toSvg(-5.6, -62).sx}
                        y={toSvg(-5.6, -62).sy}
                        width="40"
                        height={toSvg(0, 82).sy - toSvg(0, -62).sy}
                        fill="#262f3f"
                      />
                      <line
                        x1={toSvg(0, -60).sx}
                        y1={toSvg(0, -60).sy}
                        x2={toSvg(0, 78).sx}
                        y2={toSvg(0, 78).sy}
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1.5"
                        strokeDasharray="10 10"
                      />
                      {/* Jl. Melati Perumahan */}
                      <rect
                        x={toSvg(-74, 44.2).sx}
                        y={toSvg(-74, 44.2).sy}
                        width={toSvg(50, 44.2).sx - toSvg(-74, 44.2).sx}
                        height="26"
                        fill="#2a3345"
                      />
                      {/* Jl. Stasiun Timur */}
                      <rect
                        x={toSvg(59.3, -60).sx}
                        y={toSvg(59.3, -60).sy}
                        width="32"
                        height={toSvg(64, 64).sy - toSvg(64, -60).sy}
                        fill="#262f3f"
                      />

                      {/* Sorotan Jembatan Gantung & Jembatan Selatan */}
                      <rect
                        x={toSvg(-58, -6.8).sx}
                        y={toSvg(-58, -6.8).sy}
                        width={toSvg(-38, -6.8).sx - toSvg(-58, -6.8).sx}
                        height="48"
                        rx="3"
                        fill="#374559"
                        stroke="#e7b87d"
                        strokeOpacity="0.45"
                        strokeWidth="1.5"
                      />
                      <rect
                        x={toSvg(-57.5, 44.2).sx}
                        y={toSvg(-57.5, 44.2).sy}
                        width={toSvg(-38.5, 44.2).sx - toSvg(-57.5, 44.2).sx}
                        height="26"
                        rx="2"
                        fill="#3d4959"
                      />

                      {/* Jejak Blok Bangunan Top-Down */}
                      {[
                        { x: -27, z: 62, w: 14, d: 12, col: '#9c5a46' }, // Rumah Damar
                        { x: -28, z: 14, w: 16, d: 13.5, col: '#7d563c' }, // Kedai Bima
                        { x: 17.5, z: 17.5, w: 14, d: 11, col: '#2e7d6c' }, // Kios Harmoni
                        { x: -29.5, z: -31.5, w: 15, d: 12, col: '#8a4c3e' }, // Nada Lama
                        { x: 16.5, z: -43.5, w: 25, d: 24, col: '#3a5575' }, // Menara Nusantara
                        { x: 73, z: -24, w: 15, d: 38, col: '#5c4b44' }, // Stasiun
                        { x: 10, z: 65, w: 11, d: 12, col: '#4e5866' },
                        { x: 25, z: 65, w: 12, d: 12, col: '#5b524d' },
                        { x: -6, z: 66, w: 11, d: 11, col: '#57534e' },
                        { x: 46, z: -44, w: 10, d: 22, col: '#313d4f' },
                        { x: 38, z: 16, w: 16, d: 18, col: '#353d4a' },
                      ].map((b, i) => {
                        const p1 = toSvg(b.x, b.z);
                        const p2 = toSvg(b.x + b.w, b.z + b.d);
                        return (
                          <rect
                            key={`bld-${i}`}
                            x={p1.sx}
                            y={p1.sy}
                            width={p2.sx - p1.sx}
                            height={p2.sy - p1.sy}
                            rx="3"
                            fill={b.col}
                            stroke="rgba(255,255,255,0.18)"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Nama Jalan Rapi */}
                      <text x={toSvg(-24, 0).sx} y={toSvg(0, 0).sy + 4} fill="rgba(255,255,255,0.42)" fontSize="9.5" letterSpacing="2" textAnchor="middle">
                        JL. KENANGAN
                      </text>
                      <text x={toSvg(30, 0).sx} y={toSvg(0, 0).sy + 4} fill="rgba(255,255,255,0.42)" fontSize="9.5" letterSpacing="2" textAnchor="middle">
                        JL. KENANGAN
                      </text>
                      <text
                        x={toSvg(0, 26).sx}
                        y={toSvg(0, 26).sy}
                        fill="rgba(255,255,255,0.4)"
                        fontSize="9"
                        letterSpacing="2"
                        textAnchor="middle"
                        transform={`rotate(-90 ${toSvg(0, 26).sx} ${toSvg(0, 26).sy})`}
                      >
                        JL. CEMPAKA
                      </text>
                      <text x={toSvg(-2, 48).sx} y={toSvg(-2, 48).sy + 3} fill="rgba(255,255,255,0.42)" fontSize="9" letterSpacing="2" textAnchor="middle">
                        JL. MELATI
                      </text>

                      {/* Garis Rute Putus-Putus menuju Custom GPS atau Misi Utama */}
                      {customSvg && (
                        <line
                          x1={playerSvg.sx}
                          y1={playerSvg.sy}
                          x2={customSvg.sx}
                          y2={customSvg.sy}
                          stroke="#5ad6e6"
                          strokeWidth="2.2"
                          strokeDasharray="6 6"
                          opacity="0.75"
                        />
                      )}
                      {mainSvg && !customSvg && (
                        <line
                          x1={playerSvg.sx}
                          y1={playerSvg.sy}
                          x2={mainSvg.sx}
                          y2={mainSvg.sy}
                          stroke="#f6d17a"
                          strokeWidth="1.8"
                          strokeDasharray="5 6"
                          opacity="0.55"
                        />
                      )}

                      {/* Titik Fragmen Memori yang Sudah Ditemukan (Filter Memori / Semua) */}
                      {(filterMode === 'all' || filterMode === 'memories') &&
                        EASTER_EGGS.map((ee) => {
                          const found = discoveredEasterEggs.includes(ee.id);
                          if (!found && filterMode !== 'memories') return null;
                          const p = toSvg(ee.position[0], ee.position[2]);
                          return (
                            <circle
                              key={`ee-${ee.id}`}
                              cx={p.sx}
                              cy={p.sy}
                              r={found ? 3.5 : 3}
                              fill={found ? '#f6d17a' : 'rgba(246, 209, 122, 0.32)'}
                              stroke={found ? '#ffffff' : '#f6d17a'}
                              strokeWidth="0.9"
                            />
                          );
                        })}

                      {/* Pin 10 Landmark Kota Interaktif */}
                      {WORLD_LOCATIONS.map((loc) => {
                        const pos =
                          loc.id === 'rooftop'
                            ? toSvg(32, -46)
                            : toSvg(loc.center[0], loc.center[2]);
                        const isSelected = selectedLoc.id === loc.id;
                        const isCurrent = currentLocation === loc.id;
                        return (
                          <g
                            key={loc.id}
                            transform={`translate(${pos.sx}, ${pos.sy})`}
                            className="cursor-pointer"
                            onClick={() => {
                              sfxEngine.play('interact');
                              setSelectedLocId(loc.id);
                            }}
                          >
                            <circle
                              r={isSelected ? 12 : 8.5}
                              fill={isSelected ? '#dc9950' : isCurrent ? '#38bdf8' : '#1e293b'}
                              stroke={isSelected ? '#fff5e4' : '#e7b87d'}
                              strokeWidth={isSelected ? 2.5 : 1.5}
                            />
                            <circle r={isSelected ? 4 : 2.8} fill="#fff" />
                            <rect
                              x="-54"
                              y="12"
                              width="108"
                              height="18"
                              rx="5"
                              fill="rgba(10, 14, 22, 0.85)"
                            />
                            <text
                              y="24"
                              fill={isSelected ? '#f9ecd9' : '#cbd5e1'}
                              fontSize="9.5"
                              fontWeight={isSelected ? '700' : '500'}
                              textAnchor="middle"
                            >
                              {loc.name.replace('Rumah Keluarga ', 'Rumah ').replace(' Menara Nusantara', '')}
                            </text>
                          </g>
                        );
                      })}

                      {/* Penanda Misi Utama (Emas) */}
                      {mainSvg && (filterMode === 'all' || filterMode === 'quests') && (
                        <g transform={`translate(${mainSvg.sx}, ${mainSvg.sy})`}>
                          <circle r="14" fill="rgba(245, 198, 92, 0.25)" />
                          <circle r="6" fill="#f5c249" stroke="#ffffff" strokeWidth="2" />
                        </g>
                      )}

                      {/* Penanda Misi Sampingan Aktif (Hijau) */}
                      {(filterMode === 'all' || filterMode === 'quests') &&
                        SIDE_QUESTS.map((sq) => {
                          const prog = Object.prototype.hasOwnProperty.call(sideQuests, sq.id)
                            ? sideQuests[sq.id]
                            : undefined;
                          if (!prog || prog.status !== 'active') return null;
                          const stageObj = sq.stages.find((st) => st.stage === prog.stage);
                          if (!stageObj) return null;
                          const p = toSvg(stageObj.targetPos[0], stageObj.targetPos[2]);
                          return (
                            <circle
                              key={sq.id}
                              cx={p.sx}
                              cy={p.sy}
                              r="5.5"
                              fill="#34d399"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          );
                        })}

                      {/* Penanda Custom GPS (Biru Toska) */}
                      {customSvg && (
                        <g transform={`translate(${customSvg.sx}, ${customSvg.sy})`}>
                          <circle r="13" fill="rgba(90, 214, 230, 0.25)" />
                          <polygon points="0,-9 6,6 0,2 -6,6" fill="#5ad6e6" stroke="#fff" strokeWidth="1.2" />
                        </g>
                      )}

                      {/* Penanda Motor Skuter & Sepeda Kota Damar */}
                      {(() => {
                        const scP = toSvg(playerRuntime.scooter.pos[0], playerRuntime.scooter.pos[2]);
                        const bkP = toSvg(playerRuntime.bicycle.pos[0], playerRuntime.bicycle.pos[2]);
                        return (
                          <>
                            <g transform={`translate(${scP.sx}, ${scP.sy})`}>
                              <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#a78bfa" stroke="#fff" strokeWidth="1.4" />
                            </g>
                            <g transform={`translate(${bkP.sx}, ${bkP.sy})`}>
                              <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#34d399" stroke="#fff" strokeWidth="1.4" />
                            </g>
                          </>
                        );
                      })()}

                      {/* Posisi Damar & Kerucut Arah Pandang Kamera Real-Time */}
                      <g transform={`translate(${playerSvg.sx}, ${playerSvg.sy})`}>
                        <g transform={`rotate(${headingDeg})`}>
                          <polygon points="0,0 -18,-38 18,-38" fill="url(#viewCone)" />
                        </g>
                        <circle r="7" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
                      </g>
                    </svg>
                  </div>

                  {/* Legenda Peta Modern */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-100/10 bg-dusk-950/85 px-4 py-2 text-[10px] text-warm-200/75">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Posisi Damar
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Cerita Utama
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Misi Warga Aktif
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /> Penanda GPS Kustom
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-violet-400" /> Motor Skuter
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Sepeda Kota
                      </span>
                    </div>
                    <span className="text-warm-300/70">Klik titik lokasi untuk detail & pasang GPS</span>
                  </div>
                </div>

                {/* Panel Detail Lokasi & Pasang GPS */}
                <div
                  className={`flex flex-col justify-between rounded-2xl border border-warm-200/15 bg-dusk-950/75 ${
                    compact ? 'col-span-5 overflow-y-auto subtle-scroll p-3' : 'p-5 lg:col-span-4'
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-warm-300">
                          Wilayah Terpilih
                        </span>
                        <span className="rounded-full bg-warm-400/15 px-2.5 py-0.5 text-[11px] font-medium text-warm-200">
                          {distToSelected} m dari Damar
                        </span>
                      </div>
                      <h3 className="mt-1 font-serif text-xl text-warm-50">{selectedLoc.name}</h3>
                      <p className="text-xs text-warm-200/70">{selectedLoc.subtitle}</p>
                    </div>

                    {/* Tombol Pasang / Hapus Penanda GPS */}
                    <button
                      type="button"
                      onClick={() => {
                        sfxEngine.play('switch');
                        if (isCustomAtSelected) {
                          setCustomWaypoint(null);
                        } else {
                          setCustomWaypoint({
                            label: selectedLoc.name,
                            position: [...selectedLoc.center],
                          });
                        }
                      }}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${
                        isCustomAtSelected
                          ? 'border border-cyan-400/45 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30'
                          : 'bg-cyan-400 text-dusk-950 hover:bg-cyan-300'
                      }`}
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>
                        {isCustomAtSelected ? 'Hapus Penanda GPS' : 'Pasang Penanda Arah GPS'}
                      </span>
                    </button>

                    <div className="rounded-xl border border-warm-100/10 bg-dusk-900/75 p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-warm-200/75">Fragmen Memori Zona Ini</span>
                        <span className="font-semibold text-warm-300">
                          {locFoundCount} / {locEasterEggs.length}
                        </span>
                      </div>
                      {locEasterEggs.length > 0 && (
                        <ul className="mt-2.5 space-y-1.5 text-xs">
                          {locEasterEggs.map((ee) => {
                            const found = discoveredEasterEggs.includes(ee.id);
                            return (
                              <li
                                key={ee.id}
                                className={`flex items-center gap-2 ${
                                  found ? 'text-warm-100' : 'text-warm-200/45 italic'
                                }`}
                              >
                                <Sparkles className="h-3 w-3 shrink-0 text-warm-400/80" />
                                <span>{found ? ee.title : 'Kenangan tersembunyi belum ditemukan'}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    {mainStep && (
                      <div className="rounded-xl border border-warm-300/25 bg-warm-400/10 p-3.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                          Tujuan Cerita Utama
                        </p>
                        <p className="mt-1 text-sm font-medium text-warm-50">{mainStep.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-warm-200/75">
                          {mainStep.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-[11px] italic text-warm-200/55">
                    Penanda GPS akan memunculkan sinar pandu berwarna biru-toska di kota & kompas atas.
                  </p>
                </div>
              </div>
            )}

            {/* === TAB 2: DAFTAR MISI === */}
            {tab === 'quests' && (
              <div className="space-y-6">
                {mainStep && (
                  <div className="rounded-2xl border border-warm-300/35 bg-warm-400/10 p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-warm-300">
                      Alur Utama · Bab {chapter}
                    </span>
                    <h3 className="mt-1 font-serif text-xl text-warm-50">{mainStep.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-warm-100/85">
                      {mainStep.description}
                    </p>
                    <p className="mt-2 text-xs text-warm-300/90">Petunjuk: {mainStep.hint}</p>
                  </div>
                )}

                <div>
                  <h3 className="mb-3 font-serif text-lg text-warm-100">
                    Kisah Warga Kota ({completedSideCount}/{SIDE_QUESTS.length} Selesai)
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {SIDE_QUESTS.map((sq) => {
                      const prog = Object.prototype.hasOwnProperty.call(sideQuests, sq.id)
                        ? sideQuests[sq.id]
                        : undefined;
                      const status: 'active' | 'completed' | 'undiscovered' = prog
                        ? prog.status
                        : 'undiscovered';
                      const stageInfo =
                        prog && status === 'active'
                          ? sq.stages.find((s) => s.stage === prog.stage)
                          : null;
                      const locName = LOCATION_BY_ID[sq.location].name;

                      return (
                        <div
                          key={sq.id}
                          className={`rounded-xl border p-4 ${
                            status === 'completed'
                              ? 'border-emerald-400/30 bg-emerald-950/20'
                              : status === 'active'
                                ? 'border-warm-300/35 bg-dusk-950/75'
                                : 'border-warm-100/10 bg-dusk-950/45'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif text-base text-warm-50">{sq.title}</h4>
                              <p className="text-[11px] text-warm-200/60">
                                {sq.npcName} · {locName}
                              </p>
                            </div>
                            {status === 'completed' ? (
                              <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                                <CheckCircle2 className="h-3 w-3" /> Selesai
                              </span>
                            ) : status === 'active' ? (
                              <span className="rounded-full bg-warm-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-warm-300">
                                Berlangsung
                              </span>
                            ) : (
                              <span className="rounded-full bg-warm-100/10 px-2.5 py-0.5 text-[10px] text-warm-200/55">
                                Belum Ditemui
                              </span>
                            )}
                          </div>

                          <p className="mt-2.5 text-xs leading-relaxed text-warm-100/75">
                            {status === 'undiscovered'
                              ? `Temui ${sq.npcName} di sekitar ${locName} untuk mendengarkan ceritanya.`
                              : sq.summary}
                          </p>

                          {stageInfo && (
                            <p className="mt-2 rounded-lg bg-warm-400/10 px-3 py-1.5 text-xs text-warm-200">
                              Langkah berikutnya: {stageInfo.objective}
                            </p>
                          )}

                          {status === 'completed' && (
                            <p className="mt-2.5 border-l-2 border-emerald-400/40 pl-3 font-serif text-xs italic text-emerald-200/85">
                              "{sq.reflectionNote}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* === TAB 3: JURNAL BATIN BERILUSTRASI, PETA CABANG & KILAS BALIK === */}
            {tab === 'journal' && (
              <div className="space-y-4">
                {/* Bar Sub-Tab Penanda Buku Harian Damar */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300/20 bg-dusk-950/75 p-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: 'diary', label: `Buku Harian (${journalEntries.length})`, icon: Feather },
                        { id: 'timeline', label: 'Peta Cabang Cerita', icon: GitBranch },
                        { id: 'flashbacks', label: `Kilas Balik (${flashbacksSeenCount}/${JOURNAL_FLASHBACK_REELS.length})`, icon: Film },
                        {
                          id: 'memories',
                          label: `Fragmen Memori (${discoveredEasterEggs.length}/${EASTER_EGGS.length})`,
                          icon: Heart,
                        },
                      ] as const
                    ).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          sfxEngine.play('page');
                          setJournalSubTab(id);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                          journalSubTab === id
                            ? 'bg-amber-400/90 font-semibold text-dusk-950 shadow'
                            : 'text-warm-200/80 hover:bg-white/5 hover:text-warm-50'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  {!compact && (
                    <span className="px-2 font-serif text-xs italic text-amber-200/70">
                      “{journalName}”
                    </span>
                  )}
                </div>

                {/* === SUBTAB 3A: BUKU HARIAN BERILUSTRASI & PERKEMBANGAN HATI === */}
                {journalSubTab === 'diary' && (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    {/* Kolom Kiri (4/12): Perkembangan Hati Damar dari Pagi hingga Malam */}
                    <div className="space-y-3.5 lg:col-span-4">
                      <div className="rounded-2xl border border-amber-300/25 bg-gradient-to-b from-[#201914]/95 to-dusk-950/90 p-4 shadow-lg">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/85">
                          {heartMoodNote.phaseLabel}
                        </p>
                        <h3 className="mt-1 font-serif text-lg text-amber-50">
                          {heartMoodNote.headline}
                        </h3>
                        <p className="mt-2 font-serif text-xs italic leading-relaxed text-warm-100/85">
                          “{heartMoodNote.body}”
                        </p>

                        {/* Kompas Perkembangan Hati Organik */}
                        <div className="mt-4 space-y-2.5 border-t border-amber-200/15 pt-3.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300/75">
                            Arah Hati Damar Hari Ini
                          </p>
                          {[
                            { label: 'Kejujuran pada Diri', pct: honestyPct, bar: 'bg-amber-400/85' },
                            { label: 'Kehadiran untuk Rumah', pct: familyPct, bar: 'bg-rose-400/85' },
                            { label: 'Beban & Pelarian', pct: ambitionPct, bar: 'bg-slate-400/80' },
                          ].map((axis) => (
                            <div key={axis.label}>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-warm-200/80">{axis.label}</span>
                                <span className="font-mono text-warm-100">{axis.pct}%</span>
                              </div>
                              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${axis.bar}`}
                                  style={{ width: `${axis.pct}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pintasan Cepat Peta Cabang & Kilas Balik */}
                      <div className="rounded-2xl border border-warm-100/10 bg-dusk-950/65 p-3.5 text-xs">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                          Ringkasan Arsip Cerita
                        </p>
                        <div className="mt-2.5 grid grid-cols-2 gap-2 text-center">
                          <button
                            type="button"
                            onClick={() => setJournalSubTab('flashbacks')}
                            className="rounded-xl border border-amber-300/25 bg-amber-500/10 p-2.5 transition hover:border-amber-300/60"
                          >
                            <p className="font-serif text-lg text-amber-200">{flashbacksSeenCount}/{JOURNAL_FLASHBACK_REELS.length}</p>
                            <p className="text-[10px] text-warm-200/75">Kilas Balik</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setJournalSubTab('timeline')}
                            className="rounded-xl border border-sky-300/25 bg-sky-500/10 p-2.5 transition hover:border-sky-300/60"
                          >
                            <p className="font-serif text-lg text-sky-200">
                              {storyTimeline.echoBadges.length}
                            </p>
                            <p className="text-[10px] text-warm-200/75">Gema Pilihan</p>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Kolom Kanan (8/12): Lembaran Catatan Harian Berilustrasi Sketsa Tinta */}
                    <div className="space-y-3 lg:col-span-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-amber-300" />
                          <h3 className="font-serif text-lg text-warm-50">
                            Lembar Catatan {journalName}
                          </h3>
                        </div>
                        <span className="text-[11px] text-warm-200/55">
                          Terbaru di atas · {journalEntries.length} catatan
                        </span>
                      </div>

                      <div className="space-y-3">
                        {journalEntries.map((entry) => {
                          const sketchKind = classifyJournalSketch(entry.id, entry.title);
                          return (
                            <div
                              key={entry.id}
                              className="flex items-start gap-3.5 rounded-2xl border border-amber-200/15 bg-gradient-to-r from-[#17151c]/95 to-dusk-950/85 p-4 shadow-sm transition hover:border-amber-300/35"
                            >
                              <JournalInkSketch kind={sketchKind} />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <h4 className="font-serif text-base font-medium text-amber-100">
                                    {entry.title}
                                  </h4>
                                  <span className="rounded-full border border-warm-200/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-warm-200/65">
                                    Bab {entry.chapter}
                                  </span>
                                </div>
                                <p className="mt-1.5 font-serif text-[13px] leading-relaxed text-warm-100/85">
                                  {entry.body}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* === SUBTAB 3B: PETA CABANG CERITA (GARIS WAKTU KEPUTUSAN BAB 1-3) === */}
                {journalSubTab === 'timeline' && (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    <div className="space-y-4 lg:col-span-8">
                      <div>
                        <h3 className="font-serif text-lg text-warm-50">
                          Garis Waktu &amp; Cabang Keputusan Damar
                        </h3>
                        <p className="text-xs text-warm-200/65">
                          Setiap simpul mencatat langkah nyata dan arah cabang yang telah kamu pilih dari pagi hingga malam.
                        </p>
                      </div>

                      <div className="relative space-y-3 pl-6 before:absolute before:bottom-3 before:left-[9px] before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400/70 before:via-sky-400/40 before:to-warm-200/15">
                        {storyTimeline.nodes.map((node) => {
                          const isDone = node.status === 'done';
                          const isCur = node.status === 'current';
                          const badgeTone =
                            node.tone === 'gold'
                              ? 'border-amber-300/40 bg-amber-500/15 text-amber-100'
                              : node.tone === 'rose'
                                ? 'border-rose-300/40 bg-rose-500/15 text-rose-100'
                                : node.tone === 'sky'
                                  ? 'border-sky-300/40 bg-sky-500/15 text-sky-100'
                                  : 'border-slate-300/35 bg-slate-500/15 text-slate-200';

                          return (
                            <div
                              key={node.id}
                              className={`relative rounded-2xl border p-3.5 transition ${
                                isCur
                                  ? 'border-amber-300/60 bg-amber-400/10 shadow-md'
                                  : isDone
                                    ? 'border-warm-200/15 bg-dusk-950/80'
                                    : 'border-white/5 bg-dusk-950/35 opacity-60'
                              }`}
                            >
                              {/* Titik Simpul Timeline */}
                              <span
                                className={`absolute -left-[22px] top-4 h-3.5 w-3.5 rounded-full border-2 ${
                                  isCur
                                    ? 'animate-pulse border-amber-200 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                                    : isDone
                                      ? 'border-amber-300 bg-amber-400/80'
                                      : 'border-warm-200/30 bg-dusk-900'
                                }`}
                              />

                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-warm-300/75">
                                    {node.timeStamp}
                                  </span>
                                  <h4 className="font-serif text-sm font-medium text-warm-50">
                                    {node.status === 'upcoming' ? 'Simpul Cerita Mendatang' : node.title}
                                  </h4>
                                </div>
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                    isCur
                                      ? 'bg-amber-400 text-dusk-950'
                                      : isDone
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-white/5 text-warm-200/50'
                                  }`}
                                >
                                  {isCur ? 'Sedang Berlangsung' : isDone ? 'Tercatat' : 'Belum Tiba'}
                                </span>
                              </div>

                              {isDone && node.chosenBranchLabel && (
                                <div className={`mt-2.5 rounded-xl border px-3 py-2 ${badgeTone}`}>
                                  <p className="text-[11px] font-semibold">
                                    ↳ {node.chosenBranchLabel}
                                  </p>
                                  {node.chosenOutcomeNote && (
                                    <p className="mt-0.5 text-[11px] leading-relaxed opacity-85">
                                      {node.chosenOutcomeNote}
                                    </p>
                                  )}
                                </div>
                              )}

                              {isCur && mainStep && (
                                <p className="mt-2 text-xs leading-relaxed text-amber-100/85">
                                  {mainStep.description}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Panel Kanan (4/12): Cabang Gema Spesial yang Aktif */}
                    <div className="space-y-3 lg:col-span-4">
                      <div className="rounded-2xl border border-amber-300/25 bg-dusk-950/75 p-4">
                        <div className="flex items-center gap-2 text-amber-300">
                          <Sparkles className="h-4 w-4" />
                          <h4 className="font-serif text-base text-warm-50">
                            Gema Pilihan yang Aktif
                          </h4>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-warm-200/65">
                          Tindakan dan balasan kecilmu di kota ini diingat oleh Nadia, Kira, Bima, Pak Hendra, dan Mas Bagas hingga akhir cerita.
                        </p>

                        {storyTimeline.echoBadges.length === 0 ? (
                          <div className="mt-3 rounded-xl border border-dashed border-white/15 bg-black/20 p-3.5 text-xs italic text-warm-200/60">
                            Belum ada gema spesial yang tercatat. Coba hidupkan Kilas Balik Memori, balas pesan di HP, atau temukan foto arsip kota 1996!
                          </div>
                        ) : (
                          <div className="mt-3 space-y-2.5">
                            {storyTimeline.echoBadges.map((eb) => (
                              <div
                                key={eb.id}
                                className={`rounded-xl border p-3 ${
                                  eb.tone === 'gold'
                                    ? 'border-amber-300/35 bg-amber-500/10 text-amber-100'
                                    : eb.tone === 'rose'
                                      ? 'border-rose-300/35 bg-rose-500/10 text-rose-100'
                                      : 'border-sky-300/35 bg-sky-500/10 text-sky-100'
                                }`}
                              >
                                <p className="text-xs font-semibold">{eb.title}</p>
                                <p className="mt-1 text-[11px] leading-relaxed opacity-85">{eb.detail}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* === SUBTAB 3C: ARSIP 4 KILAS BALIK MEMORI SINEMATIK (PUTAR ULANG KAPAN SAJA) === */}
                {journalSubTab === 'flashbacks' && (
                  <div className="space-y-4">
                    {/* Panel Prolog Mimpi Pukul 05.45 & Lembar Kartu Sastra Pembuka Bab */}
                    <div className="rounded-2xl border border-indigo-300/30 bg-gradient-to-r from-[#181b34]/95 via-[#171625]/95 to-dusk-950 p-4 shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="max-w-xl">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-300">
                            <Sparkles className="h-3 w-3" />
                            Prolog &amp; Monolog Pembuka Bab
                          </span>
                          <h4 className="mt-1 font-serif text-base text-warm-50 md:text-lg">
                            Mimpi Pukul 05.45 &amp; Kartu Sastra Dinamis
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-warm-200/75">
                            Hidupkan kembali sekuens mimpi sebelum subuh atau baca ulang monolog batin pembuka Bab yang menyesuaikan pilihanmu.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              closeMapJournal();
                              startDialogue('prologue_mimpi_0545');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-400/90 px-3.5 py-2 text-xs font-semibold text-dusk-950 shadow transition hover:bg-indigo-300"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>Prolog 05.45</span>
                          </button>

                          {([1, 2, 3] as const).map((chapNum) => {
                            const unlocked = chapter >= chapNum || Boolean(activeEnding);
                            return (
                              <button
                                key={chapNum}
                                type="button"
                                disabled={!unlocked}
                                onClick={() => openChapterCardPreview(chapNum)}
                                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                                  unlocked
                                    ? 'border-amber-300/35 bg-amber-400/10 text-amber-100 hover:border-amber-300/75 hover:bg-amber-400/20'
                                    : 'cursor-not-allowed border-white/10 bg-white/5 text-warm-300/35'
                                }`}
                              >
                                Bab {chapNum === 1 ? 'I' : chapNum === 2 ? 'II' : 'III'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Kartu Khusus Rekaman Suara Keluarga: Pita Tua di Balik Radio Dapur (16 Nov 1997) */}
                    <div className="rounded-2xl border border-amber-300/35 bg-gradient-to-r from-[#2c1e15]/95 via-[#1e1612]/95 to-dusk-950 p-4 shadow-lg">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300">
                              REKAMAN PITA C-60 · 16 NOVEMBER 1997
                            </span>
                            {flags.includes('played_father_cassette_1997') && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                <CheckCircle2 className="h-3 w-3" /> Terkenang
                              </span>
                            )}
                          </div>
                          <h4 className="mt-1 font-serif text-base text-amber-50 md:text-lg">
                            Pita Tua di Balik Radio Dapur (Suara Almarhum Bapak)
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-warm-200/80">
                            {flags.includes('played_father_cassette_1997')
                              ? 'Rekaman suara almarhum Bapak saat mengajari Damar usia tujuh tahun memetik akor gitar pertama—dan bisikan rahasia di ujung pita yang baru tersambung setelah 29 tahun.'
                              : flags.includes('has_father_cassette_1997')
                                ? 'Kaset C-60 titipan Bapak dari kaleng tua Pak Darman sudah ada di Tas Selempang [I]. Bawa pulang ke Radio Kayu Dapur Rumah Jl. Melati No. 14 untuk memutarnya.'
                                : 'Periksa tutup dek kaset di balik Radio Kayu Dapur rumah atau temui Pak Darman di Stasiun Kereta Tua Senja untuk menelusuri kaset tahun 1997 milik Bapak.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {flags.includes('played_father_cassette_1997') ? (
                            <button
                              type="button"
                              onClick={() => {
                                closeMapJournal();
                                startDialogue('flashback_kaset_bapak_1997');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400/95 px-3.5 py-2 text-xs font-semibold text-dusk-950 shadow transition hover:bg-amber-300"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>Putar Ulang Pita 1997</span>
                            </button>
                          ) : flags.includes('has_father_cassette_1997') ? (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomWaypoint({
                                  label: 'Radio Kayu Dapur (Putar Kaset Bapak 1997)',
                                  position: [-17.42, 0.08, 71.95],
                                });
                                closeMapJournal();
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-dusk-950 shadow transition hover:bg-cyan-300"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              <span>GPS ke Radio Dapur</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomWaypoint({
                                  label: 'Lapak Pak Darman (Stasiun Senja)',
                                  position: [75.2, 0.1, -3.2],
                                });
                                closeMapJournal();
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/40 bg-amber-400/15 px-3.5 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/25"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              <span>GPS ke Stasiun Senja</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg text-warm-50">
                          Gulungan Kilas Balik Memori ({flashbacksSeenCount}/{JOURNAL_FLASHBACK_REELS.length})
                        </h3>
                        <p className="text-xs text-warm-200/65">
                          Hidupkan atau putar ulang 4 malam penting yang membentuk siapa Damar hari ini.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {JOURNAL_FLASHBACK_REELS.map((reel, idx) => {
                        const seen = flags.includes(reel.flag);
                        const cardBg =
                          reel.mood === 'warm_sepia'
                            ? 'from-[#2e1e14] via-[#1c1410] to-dusk-950'
                            : reel.mood === 'rain_melancholy'
                              ? 'from-[#162233] via-[#141a26] to-dusk-950'
                              : 'from-[#231918] via-[#14131c] to-dusk-950';

                        return (
                          <div
                            key={reel.id}
                            className={`flex flex-col justify-between rounded-2xl border bg-gradient-to-b ${cardBg} p-4 shadow-lg ${
                              seen ? 'border-amber-300/45' : 'border-white/15'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10px] tracking-[0.16em] text-amber-300">
                                  REEL 0{idx + 1} · {reel.yearLabel}
                                </span>
                                {seen && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                    <CheckCircle2 className="h-3 w-3" /> Terkenang
                                  </span>
                                )}
                              </div>
                              <h4 className="mt-2 font-serif text-lg text-amber-50">{reel.title}</h4>
                              <p className="mt-0.5 text-[11px] text-amber-200/65">{reel.locationLabel}</p>
                              <p className="mt-3 font-serif text-xs italic leading-relaxed text-warm-100/85">
                                “{reel.epigraph}”
                              </p>
                              <p className="mt-3 text-[10.5px] text-warm-200/55">{reel.worldHint}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                closeMapJournal();
                                startDialogue(reel.dialogueId);
                              }}
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400/90 px-4 py-2.5 text-xs font-semibold text-dusk-950 shadow transition hover:bg-amber-300"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" />
                              <span>{seen ? 'Putar Ulang Kilas Balik' : 'Hidupkan Kilas Balik'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* === SUBTAB 3D: FRAGMEN MEMORI KOTA (20 KEPINGAN MASA LALU) === */}
                {journalSubTab === 'memories' && (
                  <div className="space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-amber-300" />
                        <h3 className="font-serif text-lg text-warm-50">
                          Fragmen Memori Kota ({discoveredEasterEggs.length}/{EASTER_EGGS.length})
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 rounded-xl bg-dusk-950/80 p-1 text-[11px]">
                        {(
                          [
                            { id: 'all', label: 'Semua' },
                            { id: 'found', label: 'Ditemukan' },
                            { id: 'missing', label: 'Belum Ditemukan' },
                          ] as const
                        ).map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setMemoryFilter(f.id)}
                            className={`rounded-lg px-2.5 py-1 transition ${
                              memoryFilter === f.id
                                ? 'bg-warm-400 font-semibold text-dusk-950'
                                : 'text-warm-200/70 hover:text-warm-50'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {EASTER_EGGS.filter((ee) => {
                        const found = discoveredEasterEggs.includes(ee.id);
                        if (memoryFilter === 'found') return found;
                        if (memoryFilter === 'missing') return !found;
                        return true;
                      }).map((ee) => {
                        const found = discoveredEasterEggs.includes(ee.id);
                        const locInfo = LOCATION_BY_ID[ee.location];
                        return (
                          <div
                            key={ee.id}
                            className={`rounded-xl border p-3.5 transition ${
                              found
                                ? 'border-warm-300/35 bg-dusk-950/80'
                                : 'border-warm-100/10 bg-dusk-950/45'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-serif text-sm font-medium text-warm-100">
                                  {found ? ee.title : 'Fragmen Belum Ditemukan'}
                                </span>
                                <p className="text-[10px] text-warm-300/70">{locInfo.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  sfxEngine.play('switch');
                                  setSelectedLocId(ee.location);
                                  setFilterMode('memories');
                                  toggleMapJournal('map');
                                }}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-warm-200/80 hover:border-warm-300/45 hover:text-warm-50"
                                title="Lihat wilayah ini di Peta Kota"
                              >
                                <MapIcon className="h-3 w-3" />
                                Peta
                              </button>
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-warm-200/75">
                              {found
                                ? ee.memorySummary
                                : `Telusuri sudut-sudut di sekitar ${locInfo.name} untuk menemukan kenangan kecil yang tertinggal.`}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
