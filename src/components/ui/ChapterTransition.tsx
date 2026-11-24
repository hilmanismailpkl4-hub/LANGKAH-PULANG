import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { ChapterNumber } from '../../types/game';
import { Portal } from './Portal';

const CHAPTER_META: Record<
  ChapterNumber,
  { numberLabel: string; title: string; subtitle: string; quote: string }
> = {
  1: {
    numberLabel: 'BAB I',
    title: 'Pagi yang Sama',
    subtitle: 'Retakan Sunyi',
    quote:
      '"Kadang kita tidak sadar kapan tepatnya hidup berubah menjadi sekadar daftar hal yang harus diselesaikan sebelum malam tiba."',
  },
  2: {
    numberLabel: 'BAB II',
    title: 'Hujan di Tengah Kota',
    subtitle: 'Persimpangan',
    quote:
      '"Tidak ada yang lebih melelahkan daripada terus berlari ke arah yang dianggap benar oleh semua orang, sambil perlahan menjauh dari rumah sendiri."',
  },
  3: {
    numberLabel: 'BAB III',
    title: 'Langkah Pulang',
    subtitle: 'Siapa Aku Sebenarnya',
    quote:
      '"Pada akhirnya, lampu kota paling terang sekalipun tidak pernah bisa menggantikan satu lampu meja makan yang menyala menunggumu pulang."',
  },
};

export const ChapterTransition: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const transitionChapter = useGameStore((s) => s.transitionChapter);
  const finishChapterTransition = useGameStore((s) => s.finishChapterTransition);

  useEffect(() => {
    if (screen !== 'chapter_transition') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        sfxEngine.play('interact');
        finishChapterTransition();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, finishChapterTransition]);

  if (screen !== 'chapter_transition') return null;

  const meta = CHAPTER_META[transitionChapter];

  return (
    <Portal>
      <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-dusk-950/96 p-8 text-center text-warm-50 backdrop-blur-lg">
        <div className="max-w-xl space-y-6 animate-fadeIn">
          <p className="text-xs font-semibold tracking-[0.35em] text-warm-300/90">
            {meta.numberLabel}
          </p>
          <div className="space-y-2">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-warm-50">
              {meta.title}
            </h1>
            <p className="font-serif italic text-lg text-warm-300/85">{meta.subtitle}</p>
          </div>
          <div className="mx-auto h-px w-20 bg-warm-300/35" />
          <p className="font-serif italic text-sm md:text-base leading-relaxed text-warm-100/75">
            {meta.quote}
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                sfxEngine.play('interact');
                finishChapterTransition();
              }}
              className="inline-flex items-center gap-2 rounded-full border border-warm-300/45 bg-warm-400/15 px-7 py-3 text-sm font-medium text-warm-100 transition hover:bg-warm-400 hover:text-dusk-950"
            >
              <span>Mulai {meta.numberLabel}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
