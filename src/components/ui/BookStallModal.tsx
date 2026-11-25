import React, { useState } from 'react';
import { BookMarked, BookmarkPlus, Volume2, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import { DARMAN_STALL_BOOKS } from '../../data/lakeAndBooks';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

export const BookStallModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isBookStallOpen);
  const setOpen = useGameStore((s) => s.setBookStallOpen);
  const flags = useGameStore((s) => s.flags);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const applyEffect = useGameStore((s) => s.applyEffect);
  const playFamilyBanter = useGameStore((s) => s.playFamilyBanter);
  const showToast = useGameStore((s) => s.showToast);

  const [selectedId, setSelectedId] = useState(DARMAN_STALL_BOOKS[0].id);

  if (!isOpen) return null;

  const book = DARMAN_STALL_BOOKS.find((b) => b.id === selectedId) ?? DARMAN_STALL_BOOKS[0];
  const savedFlag = `saved_darman_${book.id}`;
  const isSaved = flags.includes(savedFlag);

  const handleSaveQuote = () => {
    sfxEngine.play('chime');
    if (!isSaved) {
      applyEffect({
        kejujuranDiri: 1,
        kehadiranKeluarga: book.kiraReaction ? 1 : 0,
        setFlags: [savedFlag],
        journalEntry: {
          id: `je_${book.id}`,
          title: `Kutipan Buku: ${book.title}`,
          body: `"${book.passage}" — dicatat dari lapak buku bekas Pak Darman di Stasiun Senja.`,
          chapter: useGameStore.getState().chapter,
        },
      });
    }
    showToast(`Kutipan "${book.title}" disimpan ke Catatan Harian!`);
    if (isFamilyWalkActive && book.kiraReaction) {
      playFamilyBanter([{ speaker: 'kira', text: book.kiraReaction }], `fw_${book.id}`);
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 backdrop-blur-md"
        onClick={() => {
          voiceManager.stop();
          setOpen(false);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex h-[94dvh] sm:h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-amber-300/25 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-warm-100/10 bg-dusk-950/65 px-4 py-2.5 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                <BookMarked className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/85">
                  Peron Stasiun Kereta Tua Senja
                </p>
                <h2 className="font-serif text-xl text-warm-50">Lapak Buku Bekas Pak Darman</h2>
                <p className="text-[11px] text-warm-200/65">
                  4 buku pilihan dengan kertas menguning yang masih menyimpan cerita hangat
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                voiceManager.stop();
                setOpen(false);
              }}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Rak Kiri & Detail Buku Kanan */}
          <div className="grid min-h-0 flex-1 grid-cols-12 overflow-hidden">
            <div className="col-span-5 min-h-0 space-y-2 overflow-y-auto subtle-scroll border-r border-warm-100/10 p-3 sm:p-4">
              {DARMAN_STALL_BOOKS.map((item) => {
                const active = item.id === book.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      voiceManager.stop();
                      sfxEngine.play('page');
                      setSelectedId(item.id);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                      active
                        ? 'border-amber-300/60 bg-amber-400/15'
                        : 'border-warm-100/10 bg-dusk-950/60 hover:border-warm-200/30'
                    }`}
                  >
                    <div
                      className="mt-0.5 flex h-12 w-8 shrink-0 items-center justify-center rounded border border-white/15 shadow"
                      style={{ backgroundColor: item.coverColor }}
                    >
                      <span className="h-6 w-1 rounded-full" style={{ backgroundColor: item.accentColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm font-medium text-warm-50 leading-snug">{item.title}</p>
                      <p className="mt-0.5 text-[10px] text-amber-300/80">{item.genreLabel}</p>
                      <p className="text-[10px] text-warm-200/55">{item.yearLabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="col-span-7 flex min-h-0 flex-col justify-between overflow-y-auto subtle-scroll p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-warm-100/10 pb-4">
                  <div>
                    <span className="text-[11px] font-medium text-amber-300/90">
                      {book.genreLabel} · {book.yearLabel}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-warm-50">{book.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => voiceManager.speak(`darman_${book.id}`, 'pak_darman', book.passage)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-300/35 bg-amber-400/15 px-3 py-1.5 text-xs text-warm-100 hover:bg-amber-400/25"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-amber-300" />
                    <span>Dengarkan</span>
                  </button>
                </div>

                {/* Catatan Pak Darman */}
                <div className="rounded-xl border border-amber-300/20 bg-amber-950/20 p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Kata Pak Darman
                  </p>
                  <p className="mt-1 font-serif italic text-xs leading-relaxed text-warm-100/90">
                    "{book.darmanNote}"
                  </p>
                </div>

                {/* Kutipan Halaman Buku */}
                <div className="rounded-2xl border border-warm-200/15 bg-[#1c1916]/85 p-5 shadow-inner">
                  <p className="font-serif text-sm md:text-base leading-[1.85] text-warm-100/95">
                    "{book.passage}"
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-warm-100/10 pt-4">
                <span className="text-[11px] text-warm-200/55">
                  {isSaved ? 'Kutipan sudah tersimpan di Catatan Harian.' : 'Simpan kutipan favoritmu ke Catatan Harian.'}
                </span>
                <button
                  type="button"
                  onClick={handleSaveQuote}
                  className="flex items-center gap-2 rounded-xl bg-warm-400 px-4 py-2 text-xs font-semibold text-dusk-950 hover:bg-warm-300"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" />
                  <span>{isSaved ? 'Sudah Dicatat di Jurnal' : 'Catat Kutipan ke Jurnal'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
