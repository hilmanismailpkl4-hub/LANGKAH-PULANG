import React, { useEffect, useState } from 'react';
import { Compass, Home, Sparkles } from 'lucide-react';
import { EASTER_EGGS } from '../../data/easterEggs';
import { ENDINGS } from '../../data/endings';
import { SIDE_QUESTS } from '../../data/sideQuests';
import { useGameStore } from '../../store/useGameStore';
import { EndingId } from '../../types/game';
import { Portal } from './Portal';

export const EndingScreen: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const activeEnding = useGameStore((s) => s.activeEnding);
  const journalName = useGameStore((s) => s.journalName);
  const playTimeSeconds = useGameStore((s) => s.playTimeSeconds);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const unlockedEndings = useGameStore((s) => s.unlockedEndings);
  const returnToTitle = useGameStore((s) => s.returnToTitle);
  const finishChapterTransition = useGameStore((s) => s.finishChapterTransition);

  const [revealedCount, setRevealedCount] = useState(1);

  useEffect(() => {
    if (screen !== 'ending') return;
    setRevealedCount(1);
    const id = window.setInterval(() => {
      setRevealedCount((c) => Math.min(c + 1, 5));
    }, 2800);
    return () => window.clearInterval(id);
  }, [screen, activeEnding]);

  if (screen !== 'ending' || !activeEnding) return null;

  const def = ENDINGS[activeEnding];
  const completedSide = Object.values(sideQuests).filter((s) => s.status === 'completed').length;
  const mins = Math.max(1, Math.round(playTimeSeconds / 60));

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] overflow-y-auto subtle-scroll bg-dusk-950/97 px-6 py-12 text-warm-50 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl space-y-8 animate-fadeIn">
          {/* Header Ending */}
          <div className="text-center space-y-2.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/25 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: def.accentColor }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {def.label}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-warm-50">
              {def.title}
            </h1>
            <p className="text-sm text-warm-200/75">{def.subtitle}</p>
          </div>

          <div className="mx-auto h-px w-24 bg-warm-200/25" />

          {/* Paragraf Epilog Sinematik */}
          <div className="space-y-5 font-serif text-base md:text-lg leading-relaxed text-warm-100/90">
            {def.epilogueParagraphs.slice(0, revealedCount).map((p, idx) => (
              <p key={idx} className="animate-fadeIn">
                {p}
              </p>
            ))}
          </div>

          {revealedCount < def.epilogueParagraphs.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setRevealedCount(5)}
                className="text-xs text-warm-300/70 underline hover:text-warm-100"
              >
                Tampilkan seluruh epilog
              </button>
            </div>
          )}

          {/* Kutipan Penutup & Rangkuman Perjalanan */}
          {revealedCount >= def.epilogueParagraphs.length && (
            <div className="space-y-6 pt-4 animate-fadeIn">
              <blockquote
                className="rounded-2xl border border-warm-200/20 bg-dusk-900/70 p-6 text-center font-serif italic text-base md:text-lg"
                style={{ color: def.accentColor }}
              >
                {def.finalQuote}
              </blockquote>

              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-warm-100/10 bg-dusk-900/60 p-4 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-warm-200/55">Waktu Bermain</p>
                  <p className="mt-1 font-serif text-lg text-warm-50">{mins} menit</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-warm-200/55">Kisah Warga</p>
                  <p className="mt-1 font-serif text-lg text-warm-50">
                    {completedSide} / {SIDE_QUESTS.length}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-warm-200/55">Fragmen Memori</p>
                  <p className="mt-1 font-serif text-lg text-warm-50">
                    {discoveredEasterEggs.length} / {EASTER_EGGS.length}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-warm-100/10 bg-dusk-900/50 p-4">
                <p className="text-xs font-medium text-warm-200/80">
                  Akhir Cerita Terbuka ({unlockedEndings.length}/4) · Arsip: {journalName}
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(['good', 'true', 'bad', 'secret'] as EndingId[]).map((eid) => {
                    const e = ENDINGS[eid];
                    const has = unlockedEndings.includes(eid);
                    return (
                      <div
                        key={eid}
                        className={`rounded-xl border px-3 py-2 text-center text-xs ${
                          has
                            ? 'border-warm-300/35 bg-warm-400/10 text-warm-100'
                            : 'border-warm-100/10 bg-dusk-950/50 text-warm-200/40'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-wider opacity-75">{e.label}</p>
                        <p className="mt-0.5 truncate font-serif">{has ? e.title : 'Terkunci'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => finishChapterTransition()}
                  className="flex items-center gap-2 rounded-xl border border-warm-300/40 bg-dusk-900 px-5 py-3 text-sm text-warm-100 transition hover:bg-dusk-800"
                >
                  <Compass className="h-4 w-4 text-warm-300" />
                  <span>Lanjut Jelajah Kota Malam</span>
                </button>
                <button
                  type="button"
                  onClick={() => returnToTitle()}
                  className="flex items-center gap-2 rounded-xl bg-warm-400 px-6 py-3 text-sm font-semibold text-dusk-950 transition hover:bg-warm-300"
                >
                  <Home className="h-4 w-4" />
                  <span>Kembali ke Layar Judul</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};
