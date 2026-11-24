import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Compass, Heart, Map as MapIcon, MapPin, Sparkles, X } from 'lucide-react';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { EASTER_EGGS } from '../../data/easterEggs';
import { SIDE_QUESTS } from '../../data/sideQuests';
import { LOCATION_BY_ID, WORLD_LOCATIONS, worldToMapPercent } from '../../data/worldLocations';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { LocationId } from '../../types/game';
import { Portal } from './Portal';

export const MapJournalModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isMapJournalOpen);
  const tab = useGameStore((s) => s.mapJournalTab);
  const toggleMapJournal = useGameStore((s) => s.toggleMapJournal);
  const closeMapJournal = useGameStore((s) => s.closeMapJournal);
  const journalName = useGameStore((s) => s.journalName);
  const chapter = useGameStore((s) => s.chapter);
  const mainStepId = useGameStore((s) => s.mainStepId);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const journalEntries = useGameStore((s) => s.journalEntries);
  const currentLocation = useGameStore((s) => s.currentLocation);

  const [selectedLocId, setSelectedLocId] = useState<LocationId>(currentLocation);

  if (!isOpen) return null;

  const mainStep = MAIN_STEP_BY_ID[mainStepId];
  const playerMap = worldToMapPercent(playerRuntime.position[0], playerRuntime.position[2]);
  const mainMap = mainStep
    ? worldToMapPercent(mainStep.waypoint[0], mainStep.waypoint[2])
    : null;

  const selectedLoc = LOCATION_BY_ID[selectedLocId] ?? LOCATION_BY_ID.rumah_damar;
  const locEasterEggs = EASTER_EGGS.filter((e) => e.location === selectedLoc.id);
  const locFoundCount = locEasterEggs.filter((e) => discoveredEasterEggs.includes(e.id)).length;
  const completedSideCount = Object.values(sideQuests).filter((q) => q.status === 'completed').length;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 md:p-8 backdrop-blur-md">
        <div className="flex h-[84vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-warm-200/20 bg-dusk-900/95 text-warm-50 shadow-2xl animate-fadeIn">
          {/* Header & Tab */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-warm-100/10 px-6 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-warm-300/80">
                Bab {chapter} · {journalName}
              </p>
              <h2 className="font-serif text-xl text-warm-50">Peta Kota & Catatan Perjalanan</h2>
            </div>

            <div className="flex items-center gap-2">
              {(
                [
                  { id: 'map', label: 'Peta Kota', icon: MapIcon },
                  { id: 'quests', label: `Misi (${completedSideCount}/${SIDE_QUESTS.length})`, icon: Compass },
                  {
                    id: 'journal',
                    label: `Catatan & Memori (${discoveredEasterEggs.length}/${EASTER_EGGS.length})`,
                    icon: BookOpen,
                  },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleMapJournal(id)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
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
                className="ml-2 rounded-xl p-2 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Konten Utama */}
          <div className="flex-1 overflow-y-auto subtle-scroll p-6">
            {/* === TAB 1: PETA KOTA INTERAKTIF === */}
            {tab === 'map' && (
              <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Kanvas Peta 2D */}
                <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-warm-200/15 bg-[#161c26] lg:col-span-2">
                  {/* Sungai & Danau */}
                  <div
                    className="absolute bg-[#24435c]/75"
                    style={{ left: '26%', top: '0%', width: '7.5%', height: '100%' }}
                  />
                  <div
                    className="absolute rounded-full bg-[#274c69]/80"
                    style={{ left: '7%', top: '16%', width: '14%', height: '20%' }}
                  />
                  {/* Jalan Utama */}
                  <div
                    className="absolute bg-warm-100/15"
                    style={{ left: '6%', top: '41%', width: '80%', height: '4.5%' }}
                  />
                  <div
                    className="absolute bg-warm-100/15"
                    style={{ left: '50.5%', top: '4%', width: '4.2%', height: '82%' }}
                  />
                  <div
                    className="absolute bg-warm-100/12"
                    style={{ left: '16%', top: '71%', width: '56%', height: '3.2%' }}
                  />
                  <div
                    className="absolute bg-warm-100/12"
                    style={{ left: '81%', top: '8%', width: '3.6%', height: '76%' }}
                  />

                  {/* Pin 10 Lokasi Kota */}
                  {WORLD_LOCATIONS.map((loc) => {
                    const pos =
                      loc.id === 'rooftop'
                        ? { left: 66, top: 14 }
                        : worldToMapPercent(loc.center[0], loc.center[2]);
                    const isSelected = selectedLoc.id === loc.id;
                    const isCurrent = currentLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocId(loc.id)}
                        style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                        className={`group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition ${
                          isSelected ? 'z-20 scale-105' : 'z-10 hover:z-20'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border shadow-md ${
                            isSelected
                              ? 'border-warm-200 bg-warm-400 text-dusk-950'
                              : isCurrent
                                ? 'border-sky-300 bg-sky-500/85 text-white'
                                : 'border-warm-200/35 bg-dusk-900/90 text-warm-200'
                          }`}
                        >
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                        <span className="mt-1 whitespace-nowrap rounded bg-dusk-950/85 px-1.5 py-0.5 text-[10px] text-warm-100 shadow">
                          {loc.name.replace('Rumah Keluarga ', 'Rumah ')}
                        </span>
                      </button>
                    );
                  })}

                  {/* Penanda Misi Utama */}
                  {mainMap && (
                    <div
                      style={{ left: `${mainMap.left}%`, top: `${mainMap.top}%` }}
                      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
                      title="Tujuan Misi Utama"
                    >
                      <span className="flex h-4 w-4 animate-ping rounded-full bg-amber-300/75" />
                      <span className="absolute inset-0 rounded-full border-2 border-white bg-amber-400" />
                    </div>
                  )}

                  {/* Penanda Misi Sampingan Aktif */}
                  {SIDE_QUESTS.map((sq) => {
                    const prog = sideQuests[sq.id];
                    if (!prog || prog.status !== 'active') return null;
                    const stageObj = sq.stages.find((st) => st.stage === prog.stage);
                    if (!stageObj) return null;
                    const p = worldToMapPercent(stageObj.targetPos[0], stageObj.targetPos[2]);
                    return (
                      <div
                        key={sq.id}
                        style={{ left: `${p.left}%`, top: `${p.top}%` }}
                        className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
                        title={`Misi Sampingan: ${sq.title}`}
                      >
                        <span className="block h-3 w-3 rounded-full border border-white bg-emerald-400 shadow" />
                      </div>
                    );
                  })}

                  {/* Posisi Damar Saat Ini */}
                  <div
                    style={{ left: `${playerMap.left}%`, top: `${playerMap.top}%` }}
                    className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-sky-400 shadow-lg" />
                  </div>

                  {/* Legenda Peta */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-xl border border-warm-100/10 bg-dusk-950/80 px-3 py-1.5 text-[10px] text-warm-200/80">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Posisi Damar
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Cerita Utama
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Misi Warga Aktif
                    </span>
                  </div>
                </div>

                {/* Panel Info Lokasi Terpilih */}
                <div className="flex flex-col justify-between rounded-2xl border border-warm-200/15 bg-dusk-950/65 p-5">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-warm-300">
                        Detail Wilayah
                      </span>
                      <h3 className="mt-1 font-serif text-lg text-warm-50">{selectedLoc.name}</h3>
                      <p className="text-xs text-warm-200/70">{selectedLoc.subtitle}</p>
                    </div>

                    <div className="rounded-xl border border-warm-100/10 bg-dusk-900/70 p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-warm-200/75">Fragmen Memori di Zona Ini</span>
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
                    Tip: Kamu bisa berjalan bebas ke sudut kota mana saja kapan pun sebelum melanjutkan cerita utama.
                  </p>
                </div>
              </div>
            )}

            {/* === TAB 2: DAFTAR MISI UTAMA & SAMPINGAN === */}
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
                  <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
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

            {/* === TAB 3: CATATAN HARIAN & 15 FRAGMEN MEMORI (EASTER EGG) === */}
            {tab === 'journal' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Kolom Kiri: Catatan Harian Damar */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-warm-300" />
                    <h3 className="font-serif text-lg text-warm-50">{journalName}</h3>
                  </div>
                  <div className="space-y-3">
                    {journalEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-warm-200/15 bg-dusk-950/65 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-sm font-medium text-warm-200">
                            {entry.title}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-warm-200/45">
                            Bab {entry.chapter}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-warm-100/80">{entry.body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kolom Kanan: 15 Fragmen Memori / Easter Egg */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-warm-300" />
                      <h3 className="font-serif text-lg text-warm-50">
                        Fragmen Memori ({discoveredEasterEggs.length}/{EASTER_EGGS.length})
                      </h3>
                    </div>
                    <span className="text-[11px] text-warm-300/80">Membuka Rahasia Masa Lalu</span>
                  </div>
                  <div className="space-y-2.5">
                    {EASTER_EGGS.map((ee) => {
                      const found = discoveredEasterEggs.includes(ee.id);
                      const locName = LOCATION_BY_ID[ee.location].name;
                      return (
                        <div
                          key={ee.id}
                          className={`rounded-xl border p-3.5 ${
                            found
                              ? 'border-warm-300/30 bg-dusk-950/75'
                              : 'border-warm-100/10 bg-dusk-950/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-serif text-sm text-warm-100">
                              {found ? ee.title : 'Fragmen Belum Ditemukan'}
                            </span>
                            <span className="text-[10px] text-warm-200/50">{locName}</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-warm-200/70">
                            {found
                              ? ee.memorySummary
                              : `Telusuri sudut-sudut di sekitar ${locName} untuk menemukan kenangan kecil yang tertinggal.`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
