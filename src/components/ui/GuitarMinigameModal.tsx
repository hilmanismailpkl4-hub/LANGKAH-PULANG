import React, { useEffect, useRef, useState } from 'react';
import { Heart, MailOpen, Music, Pause, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { EVENT_FAMILY_BANTERS } from '../../data/familyWalkBanter';
import { CONCERT_CHORDS, TRACK4_CONCERT_BARS } from '../../data/pulangSongAndLetter';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

export const GuitarMinigameModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isGuitarOpen);
  const setOpen = useGameStore((s) => s.setGuitarOpen);
  const setNadiaLetterOpen = useGameStore((s) => s.setNadiaLetterOpen);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const activeEnding = useGameStore((s) => s.activeEnding);
  const flags = useGameStore((s) => s.flags);
  const applyEffect = useGameStore((s) => s.applyEffect);
  const showToast = useGameStore((s) => s.showToast);

  const isAtHome = currentLocation === 'rumah_damar' || Boolean(activeEnding);
  const venueTitle = activeEnding
    ? 'Konser Mini Ruang Tamu · "Track 4 — Pulang"'
    : currentLocation === 'rumah_damar'
      ? 'Konser Kecil Ruang Tamu · Jl. Melati No. 14'
      : currentLocation === 'taman_danau'
        ? 'Gitar Akustik Gazebo Taman Kota'
        : currentLocation === 'toko_musik'
          ? 'Gitar Mahoni Toko Musik "Nada Lama"'
          : 'Konser Akustik Kedai Kopi Sudut';

  const [mode, setMode] = useState<'concert' | 'free'>('concert');
  const [stepIdx, setStepIdx] = useState(0);
  const [completedSong, setCompletedSong] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [vibrating, setVibrating] = useState(false);
  const [lastPlayedIdx, setLastPlayedIdx] = useState<number | null>(null);
  const [notePulseId, setNotePulseId] = useState(0);
  const [activeReaction, setActiveReaction] = useState<{ speaker: string; text: string } | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  const stopAutoPlay = () => {
    setAutoPlay(false);
    if (autoTimerRef.current !== null) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopAutoPlay();
    }
    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [isOpen]);

  const finishConcert = () => {
    setCompletedSong(true);
    stopAutoPlay();
    sfxEngine.playTrack4Finale();

    const store = useGameStore.getState();
    const isNewConcert = !store.flags.includes('played_track4_concert');

    if (isAtHome) {
      if (!store.flags.includes('played_guitar_home') || isNewConcert) {
        applyEffect({
          kehadiranKeluarga: 3,
          kejujuranDiri: 2,
          setFlags: ['played_guitar_home', 'played_track4_concert'],
          journalEntry: {
            id: 'je_track4_concert_complete',
            title: 'Konser Mini: "Track 4 — Pulang" Selesai Ditulis',
            body: 'Untuk pertama kalinya sejak 2018, aku menuntaskan seluruh bait lagu "Track 4 — Pulang" dengan gitar mahoni di hadapan Nadia dan Kira. Tidak ada panggung besar—hanya mata Nadia yang berkaca-kaca dan tepuk tangan Kira yang membuat lagu ini akhirnya utuh.',
            chapter: store.chapter,
          },
        });
      }
      showToast('Lagu "Track 4 — Pulang" akhirnya selesai! Nadia & Kira bertepuk tangan hangat di dekatmu.');
      if (store.screen === 'playing') {
        store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_guitar, 'fw_guitar_home');
      }
    } else {
      if (!store.flags.includes('played_guitar_pulang') || isNewConcert) {
        applyEffect({
          kejujuranDiri: 2,
          kehadiranKeluarga: 1,
          setFlags: ['played_guitar_pulang', 'played_track4_concert'],
          journalEntry: {
            id: 'je_track4_concert_complete',
            title: 'Petikan Utuh "Track 4 — Pulang"',
            body: 'Seluruh dua belas bait lagu "Track 4 — Pulang" akhirnya mengalir utuh dari jari-jariku. Bima dan Mas Bagas tersenyum penuh haru—bait terakhir yang kucari sejak 2018 ternyata selalu menunggu di meja makan rumah sendiri.',
            chapter: store.chapter,
          },
        });
      }
      showToast('Bima: "Tuh kan, Mar... akhirnya Track 4 — Pulang selesai juga!"');
      if (store.isFamilyWalkActive && store.screen === 'playing') {
        store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_guitar, 'fw_guitar');
      }
    }
  };

  const playChord = (chordIdx: number, fromAuto = false) => {
    if (!fromAuto && autoPlay) {
      stopAutoPlay();
    }
    sfxEngine.playGuitarChord(chordIdx);
    setLastPlayedIdx(chordIdx);
    setVibrating(true);
    setNotePulseId((n) => n + 1);
    window.setTimeout(() => setVibrating(false), 360);

    if (mode === 'concert' && !completedSong) {
      const currentBar = TRACK4_CONCERT_BARS[stepIdx];
      if (currentBar && chordIdx === currentBar.chordIdx) {
        // Munculkan reaksi hangat Nadia / Kira / Bima / Mas Bagas pada bar kunci!
        const react = isAtHome ? currentBar.homeReaction : currentBar.awayReaction;
        if (react) {
          const speakerNames: Record<string, string> = {
            nadia: 'Nadia',
            kira: 'Kira',
            bima: 'Bima',
            mas_bagas: 'Mas Bagas',
          };
          setActiveReaction({ speaker: speakerNames[react.speaker] ?? react.speaker, text: react.text });
        }

        if (stepIdx + 1 >= TRACK4_CONCERT_BARS.length) {
          finishConcert();
        } else {
          setStepIdx((prev) => prev + 1);
        }
      }
    }
  };

  // Mode Putar Otomatis (Dengarkan Konser Baris demi Baris dengan Tempo Hangat)
  useEffect(() => {
    if (!isOpen || !autoPlay || mode !== 'concert' || completedSong) return;
    const bar = TRACK4_CONCERT_BARS[stepIdx];
    if (!bar) return;

    autoTimerRef.current = window.setTimeout(() => {
      playChord(bar.chordIdx, true);
    }, stepIdx === 0 ? 450 : 2550);

    return () => {
      if (autoTimerRef.current !== null) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [isOpen, autoPlay, mode, stepIdx, completedSong]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        playChord(parseInt(e.key, 10) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!isOpen) return null;

  const targetBar = mode === 'concert' && !completedSong ? TRACK4_CONCERT_BARS[stepIdx] : null;
  const targetChordIdx = targetBar ? targetBar.chordIdx : null;
  const sungBar =
    completedSong
      ? TRACK4_CONCERT_BARS[TRACK4_CONCERT_BARS.length - 1]
      : stepIdx > 0
        ? TRACK4_CONCERT_BARS[stepIdx - 1]
        : null;
  const prevBar =
    completedSong
      ? TRACK4_CONCERT_BARS[TRACK4_CONCERT_BARS.length - 2]
      : stepIdx > 1
        ? TRACK4_CONCERT_BARS[stepIdx - 2]
        : null;

  const hasDeepMemory = flags.includes('flashback_2020_done') || flags.includes('flashback_2018_done');

  const resetConcert = () => {
    stopAutoPlay();
    setStepIdx(0);
    setCompletedSong(false);
    setActiveReaction(null);
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#09080c]/88 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
      >
        <div
          className={`flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-2xl border border-amber-300/30 bg-gradient-to-b from-[#1a1412] to-dusk-950 text-warm-50 shadow-[0_28px_80px_rgba(0,0,0,0.85)] animate-fadeIn ${
            compact ? 'max-w-4xl' : 'max-w-2xl'
          }`}
        >
          {/* Header Konser Mini */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/15 bg-black/25 ${
              compact ? 'px-4 py-2' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 ${
                  compact ? 'h-8 w-8' : 'h-9 w-9'
                }`}
              >
                <Music className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h2 className={`font-serif text-amber-50 ${compact ? 'text-sm sm:text-base' : 'text-lg md:text-xl'}`}>
                  {venueTitle}
                </h2>
                {!compact && (
                  <p className="text-xs text-warm-200/65">
                    {isAtHome
                      ? 'Nadia & Kira duduk menyimak di ruang tamu · tekan [1–6] atau klik Putar Otomatis'
                      : 'Petik akor [1–6] mengikuti alur lirik "Track 4 — Pulang"'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {mode === 'concert' && !completedSong && (
                <button
                  type="button"
                  onClick={() => setAutoPlay((v) => !v)}
                  className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition ${
                    autoPlay
                      ? 'border-amber-300/70 bg-amber-400/25 text-amber-100'
                      : 'border-white/15 bg-white/5 text-warm-200 hover:border-amber-300/50 hover:text-amber-100'
                  }`}
                  title="Dengarkan Damar memetik otomatis baris demi baris"
                >
                  {autoPlay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{autoPlay ? 'Jeda' : 'Auto'}</span>
                </button>
              )}

              <div className="flex rounded-xl bg-dusk-950 p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('concert');
                    resetConcert();
                  }}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    mode === 'concert' ? 'bg-amber-400 font-semibold text-dusk-950' : 'text-warm-200/70'
                  }`}
                >
                  Track 4
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopAutoPlay();
                    setMode('free');
                  }}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    mode === 'free' ? 'bg-amber-400 font-semibold text-dusk-950' : 'text-warm-200/70'
                  }`}
                >
                  Bebas
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopAutoPlay();
                  setOpen(false);
                }}
                className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Badan Gitar Mahoni + Panggung Lirik Interaktif */}
          <div className={`overflow-y-auto subtle-scroll ${compact ? 'space-y-2.5 px-4 py-3' : 'space-y-4 px-6 pb-6 pt-5'}`}>
            <div className={compact ? 'grid grid-cols-12 items-stretch gap-3' : 'space-y-4'}>
              {/* Badan Gitar Mahoni dengan Kilau Senar & Not Melayang */}
              <div
                className={`relative overflow-hidden rounded-2xl border border-amber-300/25 bg-gradient-to-r from-[#362014] via-[#613922] to-[#362014] shadow-inner ${
                  compact ? 'col-span-5 flex flex-col justify-center px-4 py-3' : 'px-6 py-5'
                }`}
              >
                <div
                  className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-300/35 bg-[#190e09] shadow-inner ${
                    compact ? 'h-20 w-20' : 'h-28 w-28'
                  }`}
                />
                {/* Not musik halus memancar saat senar dipetik */}
                {notePulseId > 0 && vibrating && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-around text-amber-200/85 animate-pulse">
                    <span className="font-serif text-lg">♪</span>
                    <span className="font-serif text-xl">♫</span>
                    <span className="font-serif text-base">♪</span>
                  </div>
                )}

                <div className={`relative z-10 ${compact ? 'space-y-2' : 'space-y-2.5'}`}>
                  {[0, 1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`h-[1.5px] w-full rounded-full transition-all duration-150 ${
                        vibrating
                          ? 'scale-y-150 bg-amber-200 shadow-[0_0_12px_#ffdf9e]'
                          : 'bg-amber-200/50'
                      }`}
                      style={{
                        transform: vibrating ? `translateY(${(s % 2 === 0 ? 1 : -1) * 1.6}px)` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Panggung Lirik & Reaksi Nadia / Kira / Bima */}
              <div
                className={`flex flex-col justify-center rounded-2xl border border-amber-200/15 bg-black/35 text-center ${
                  compact ? 'col-span-7 px-3.5 py-2.5' : 'px-5 py-4'
                }`}
              >
                {mode === 'concert' && (
                  <>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-semibold uppercase tracking-[0.16em] text-amber-300/85">
                        {completedSong
                          ? 'Track 4 — Pulang (Selesai Ditulis)'
                          : targetBar?.section ?? 'Track 4 — Pulang'}
                      </span>
                      <span className="font-mono text-warm-200/60">
                        {completedSong ? 12 : stepIdx}/{TRACK4_CONCERT_BARS.length}
                      </span>
                    </div>

                    {/* Bar Progres 12 Ketukan */}
                    <div className="mb-2.5 flex items-center justify-center gap-1">
                      {TRACK4_CONCERT_BARS.map((b, idx) => (
                        <span
                          key={b.id}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            completedSong || idx < stepIdx
                              ? 'bg-amber-400'
                              : idx === stepIdx
                                ? 'animate-pulse bg-amber-200'
                                : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {mode === 'concert' ? (
                  <div className="space-y-1.5">
                    {prevBar && !compact && (
                      <p className="font-serif text-xs italic text-warm-200/40">“{prevBar.lyric}”</p>
                    )}
                    <p
                      className={`font-serif italic text-amber-50 ${
                        compact ? 'text-xs sm:text-sm' : 'text-base md:text-[17px]'
                      }`}
                    >
                      {sungBar
                        ? `“${sungBar.lyric}”`
                        : 'Petik akor yang menyala [1–6] atau tekan [Auto] untuk menghidupkan lagu "Track 4 — Pulang"...'}
                    </p>
                    {!completedSong && targetBar && (
                      <p className="text-[11px] text-amber-200/65">
                        Lirik berikutnya ({CONCERT_CHORDS[targetBar.chordIdx].name}):{' '}
                        <span className="italic opacity-90">{targetBar.lyric}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="font-serif text-sm italic text-warm-100">
                    {lastPlayedIdx !== null
                      ? `Akor ${CONCERT_CHORDS[lastPlayedIdx].name} (${CONCERT_CHORDS[lastPlayedIdx].mood}) bergetar lembut di udara...`
                      : isMobile
                        ? 'Ketuk tombol akor di bawah untuk memetik senar gitar.'
                        : 'Petik senar sesukamu dengan tombol [1] hingga [6].'}
                  </p>
                )}

                {/* Reaksi Live Nadia / Kira / Bima di Bawah Lirik */}
                {activeReaction && mode === 'concert' && (
                  <div className="mt-2.5 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-1.5 text-left text-[11px] text-rose-100/95 animate-fadeIn">
                    <span className="mr-1.5 inline-flex items-center gap-1 font-semibold text-rose-200">
                      <Heart className="h-3 w-3 fill-rose-300 text-rose-300" />
                      {activeReaction.speaker}:
                    </span>
                    <span className="italic">{activeReaction.text}</span>
                  </div>
                )}

                {/* Panel Penutup Setelah Konser Selesai */}
                {completedSong && mode === 'concert' && (
                  <div className="mt-3 space-y-2 border-t border-amber-200/15 pt-2.5 animate-fadeIn">
                    {hasDeepMemory && (
                      <p className="font-serif text-[11px] italic text-amber-200/85">
                        ✦ Dari lima senar panggung 2018 hingga hujan Agustus 2020—semuanya kini bermuara di ruang tamu ini.
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          stopAutoPlay();
                          setOpen(false);
                          setNadiaLetterOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-1.5 text-[11px] font-semibold text-dusk-950 shadow transition hover:bg-amber-300"
                      >
                        <MailOpen className="h-3.5 w-3.5" />
                        <span>Baca Surat Nadia di Meja Makan</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetConcert}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-300/35 px-3 py-1.5 text-[11px] text-amber-200 transition hover:bg-amber-400/15"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Mainkan Lagi</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 6 Tombol Akor */}
            <div className={`grid gap-2 ${compact ? 'grid-cols-6' : 'grid-cols-3 gap-2.5 sm:grid-cols-6'}`}>
              {CONCERT_CHORDS.map((ch) => {
                const isTarget = targetChordIdx === ch.idx;
                const isLast = lastPlayedIdx === ch.idx && vibrating;
                return (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => playChord(ch.idx)}
                    className={`relative flex flex-col items-center justify-center rounded-xl border transition active:scale-95 ${
                      compact ? 'py-2' : 'py-3'
                    } ${
                      isTarget
                        ? 'border-amber-300 bg-amber-400/25 text-amber-50 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                        : isLast
                          ? 'border-amber-200/70 bg-amber-400/15 text-warm-50'
                          : 'border-white/10 bg-dusk-900/75 text-warm-200 hover:border-amber-300/40 hover:bg-dusk-800/80'
                    }`}
                  >
                    {isTarget && (
                      <Sparkles className="absolute right-1.5 top-1.5 h-3 w-3 animate-pulse text-amber-300" />
                    )}
                    <span className="font-mono text-[10px] text-amber-300/80">[{ch.key}]</span>
                    <span className={`font-serif font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
                      {ch.name}
                    </span>
                    <span className="text-[9.5px] opacity-65">{ch.mood}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
