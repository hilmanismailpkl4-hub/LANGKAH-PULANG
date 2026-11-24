import React, { useEffect, useState } from 'react';
import { Music, RotateCcw, Sparkles, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const CHORDS = [
  { key: '1', name: 'Dmaj7', mood: 'Hangat', idx: 0 },
  { key: '2', name: 'Bm7', mood: 'Reflektif', idx: 1 },
  { key: '3', name: 'Gmaj7', mood: 'Lembut', idx: 2 },
  { key: '4', name: 'A6', mood: 'Harapan', idx: 3 },
  { key: '5', name: 'Em7', mood: 'Rindu', idx: 4 },
  { key: '6', name: 'Dadd9', mood: 'Pulang', idx: 5 },
];

const SONG_SEQUENCE: { chordIdx: number; lyric: string }[] = [
  { chordIdx: 0, lyric: '"Lampu jalan kota mulai menyala satu per satu..."' },
  { chordIdx: 1, lyric: '"Sepatu lelah melangkah menyusuri senja yang sama..."' },
  { chordIdx: 2, lyric: '"Dulu aku kira dewasa berarti tak boleh lelah..."' },
  { chordIdx: 3, lyric: '"Sampai lupa ada dua pasang mata yang selalu menunggu..."' },
  { chordIdx: 4, lyric: '"Di balik jendela kuning Jl. Melati nomor empat belas..."' },
  { chordIdx: 2, lyric: '"Tak ada panggung megah yang mampu menggantikan..."' },
  { chordIdx: 3, lyric: '"Tawa kecil Kira dan hangatnya meja makan kita..."' },
  { chordIdx: 5, lyric: '"Akhirnya aku mengerti... inilah laguku untuk pulang."' },
];

export const GuitarMinigameModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isGuitarOpen);
  const setOpen = useGameStore((s) => s.setGuitarOpen);
  const flags = useGameStore((s) => s.flags);
  const applyEffect = useGameStore((s) => s.applyEffect);
  const showToast = useGameStore((s) => s.showToast);

  const [mode, setMode] = useState<'guided' | 'free'>('guided');
  const [stepIdx, setStepIdx] = useState(0);
  const [completedSong, setCompletedSong] = useState(false);
  const [vibrating, setVibrating] = useState(false);
  const [lastPlayedIdx, setLastPlayedIdx] = useState<number | null>(null);

  const playChord = (chordIdx: number) => {
    sfxEngine.playGuitarChord(chordIdx);
    setLastPlayedIdx(chordIdx);
    setVibrating(true);
    window.setTimeout(() => setVibrating(false), 360);

    if (mode === 'guided' && !completedSong) {
      const expected = SONG_SEQUENCE[stepIdx]?.chordIdx;
      if (chordIdx === expected) {
        if (stepIdx + 1 >= SONG_SEQUENCE.length) {
          setCompletedSong(true);
          sfxEngine.play('chime');
          if (!flags.includes('played_guitar_pulang')) {
            applyEffect({
              kejujuranDiri: 2,
              setFlags: ['played_guitar_pulang'],
              journalEntry: {
                id: 'je_guitar_cafe',
                title: 'Petikan Gitar di Kedai Bima',
                body: 'Untuk pertama kalinya setelah enam tahun, jariku kembali memetik senar gitar akustik di Kedai Kopi Sudut. Bima tersenyum dari balik meja bar sambil berkata bahwa tanganku ternyata tidak pernah lupa lagu "Pulang".',
                chapter: useGameStore.getState().chapter,
              },
            });
          }
          showToast('Bima: "Tuh kan, jarimu nggak pernah lupa nadanya, Mar..."');
        } else {
          setStepIdx((prev) => prev + 1);
        }
      }
    }
  };

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

  const targetChordIdx = mode === 'guided' && !completedSong ? SONG_SEQUENCE[stepIdx]?.chordIdx : null;
  const activeLyric = completedSong
    ? SONG_SEQUENCE[SONG_SEQUENCE.length - 1].lyric
    : stepIdx > 0
      ? SONG_SEQUENCE[stepIdx - 1].lyric
      : 'Tekan tombol [1]–[6] atau klik akor yang berkilau untuk memainkan lagu "Pulang"...';

  return (
    <Portal>
      <div className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/84 p-4 backdrop-blur-md">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-warm-300/25 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-100/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300">
                <Music className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-warm-50">Gitar Akustik Kedai Sudut</h2>
                <p className="text-xs text-warm-200/65">
                  Gunakan tombol keyboard <strong>1–6</strong> atau klik akor di bawah
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl bg-dusk-950 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('guided');
                    setStepIdx(0);
                    setCompletedSong(false);
                  }}
                  className={`rounded-lg px-3 py-1 transition ${
                    mode === 'guided' ? 'bg-warm-400 font-semibold text-dusk-950' : 'text-warm-200/70'
                  }`}
                >
                  Lagu "Pulang"
                </button>
                <button
                  type="button"
                  onClick={() => setMode('free')}
                  className={`rounded-lg px-3 py-1 transition ${
                    mode === 'free' ? 'bg-warm-400 font-semibold text-dusk-950' : 'text-warm-200/70'
                  }`}
                >
                  Petik Bebas
                </button>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Badan Gitar Visual + 6 Senar Bergetar */}
          <div className="px-6 pt-5 pb-6 space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-warm-300/20 bg-gradient-to-r from-[#3a2417] via-[#593722] to-[#3a2417] px-6 py-6 shadow-inner">
              {/* Lubang suara gitar */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-warm-300/35 bg-[#1b100a] shadow-inner" />

              {/* 6 Senar Akustik */}
              <div className="relative z-10 space-y-2.5">
                {[0, 1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-[1.5px] w-full rounded-full transition-all duration-150 ${
                      vibrating
                        ? 'bg-warm-200 shadow-[0_0_10px_#ffdf9e] scale-y-150'
                        : 'bg-warm-200/55'
                    }`}
                    style={{
                      transform: vibrating
                        ? `translateY(${(s % 2 === 0 ? 1 : -1) * 1.5}px)`
                        : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Lirik & Progres Lagu "Pulang" */}
            <div className="rounded-xl border border-warm-100/10 bg-dusk-950/70 px-5 py-4 text-center">
              {mode === 'guided' && (
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  {SONG_SEQUENCE.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-6 rounded-full transition ${
                        completedSong || idx < stepIdx
                          ? 'bg-warm-400'
                          : idx === stepIdx
                            ? 'bg-warm-200 animate-pulse'
                            : 'bg-warm-100/15'
                      }`}
                    />
                  ))}
                </div>
              )}
              <p className="font-serif italic text-sm md:text-base text-warm-100">
                {mode === 'guided'
                  ? activeLyric
                  : lastPlayedIdx !== null
                    ? `Akor ${CHORDS[lastPlayedIdx].name} (${CHORDS[lastPlayedIdx].mood}) bergetar lembut di ruang kedai...`
                    : 'Petik senar sesukamu dengan tombol [1] hingga [6].'}
              </p>

              {completedSong && mode === 'guided' && (
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-warm-300 animate-fadeIn">
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles className="h-3.5 w-3.5" /> Bait lagu "Pulang" selesai dimainkan!
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStepIdx(0);
                      setCompletedSong(false);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-warm-300/30 px-2.5 py-1 text-[11px] hover:bg-warm-400/15"
                  >
                    <RotateCcw className="h-3 w-3" /> Mainkan Lagi
                  </button>
                </div>
              )}
            </div>

            {/* 6 Tombol Akor */}
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {CHORDS.map((ch) => {
                const isTarget = targetChordIdx === ch.idx;
                const isLast = lastPlayedIdx === ch.idx && vibrating;
                return (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => playChord(ch.idx)}
                    className={`flex flex-col items-center rounded-xl border px-3 py-3 transition ${
                      isTarget
                        ? 'border-warm-300 bg-warm-400 text-dusk-950 shadow-lg shadow-warm-400/30 scale-[1.03]'
                        : isLast
                          ? 'border-warm-200 bg-warm-400/30 text-warm-50'
                          : 'border-warm-100/15 bg-dusk-950/75 text-warm-100 hover:border-warm-300/50 hover:bg-dusk-800'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold ${
                        isTarget ? 'text-dusk-900' : 'text-warm-300/80'
                      }`}
                    >
                      [{ch.key}]
                    </span>
                    <span className="mt-1 font-serif text-base font-semibold">{ch.name}</span>
                    <span
                      className={`mt-0.5 text-[10px] ${
                        isTarget ? 'text-dusk-950/80' : 'text-warm-200/55'
                      }`}
                    >
                      {ch.mood}
                    </span>
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
