import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import { LITTLE_LIBRARY_BOOKS } from '../../data/lakeAndBooks';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

export const LittleLibraryModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isLittleLibraryOpen);
  const setOpen = useGameStore((s) => s.setLittleLibraryOpen);
  const [selectedId, setSelectedId] = useState(LITTLE_LIBRARY_BOOKS[0].id);

  if (!isOpen) return null;

  const book = LITTLE_LIBRARY_BOOKS.find((b) => b.id === selectedId) ?? LITTLE_LIBRARY_BOOKS[0];

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
          className="flex h-[94dvh] sm:h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-warm-300/25 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-warm-100/10 bg-dusk-950/60 px-4 py-2.5 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/85">
                  Taman Kota & Danau Senja
                </p>
                <h2 className="font-serif text-xl text-warm-50">Kotak Buku Jalanan — Taman Baca Mini</h2>
                <p className="text-[11px] text-warm-200/65">
                  5 catatan & cerita pendek titipan warga kota untuk menemani sore yang tenang
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

          {/* 2 Kolom: Rak Buku Kiri + Halaman Baca Kanan */}
          <div className="grid min-h-0 flex-1 grid-cols-12 overflow-hidden">
            {/* Rak 5 Buku */}
            <div className="col-span-5 min-h-0 space-y-2 overflow-y-auto subtle-scroll border-r border-warm-100/10 p-3 sm:p-4">
              {LITTLE_LIBRARY_BOOKS.map((item) => {
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
                        ? 'border-warm-300/60 bg-warm-400/15'
                        : 'border-warm-100/10 bg-dusk-950/60 hover:border-warm-200/30'
                    }`}
                  >
                    <div
                      className="mt-0.5 flex h-11 w-8 shrink-0 items-center justify-center rounded-md border border-white/15 shadow"
                      style={{ backgroundColor: item.coverColor }}
                    >
                      <span className="h-5 w-1 rounded-full" style={{ backgroundColor: item.accentColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm font-medium text-warm-50 leading-snug">{item.title}</p>
                      <p className="mt-0.5 text-[10px] text-warm-300/80">{item.authorLabel}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-warm-200/65">{item.excerpt}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Halaman Baca Cerita */}
            <div className="col-span-7 flex min-h-0 flex-col justify-between overflow-y-auto subtle-scroll p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-warm-100/10 pb-4">
                  <div>
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${book.coverColor}88`, color: book.accentColor }}
                    >
                      {book.authorLabel}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-warm-50">{book.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => voiceManager.speak(`lib_${book.id}`, 'damar_batin', book.body)}
                    className="flex items-center gap-1.5 rounded-xl border border-warm-300/35 bg-warm-400/15 px-3 py-1.5 text-xs text-warm-100 hover:bg-warm-400/25"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-warm-300" />
                    <span>Dengarkan</span>
                  </button>
                </div>

                {/* Lembar Kertas Baca Hangat */}
                <div className="rounded-2xl border border-warm-200/15 bg-[#1b1917]/80 p-5 shadow-inner">
                  <p className="font-serif text-sm md:text-base leading-[1.85] text-warm-100/95">
                    "{book.body}"
                  </p>
                </div>

                {/* Refleksi Batin Damar */}
                <div className="rounded-xl border border-emerald-300/20 bg-emerald-950/20 p-4">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" /> Batin Damar
                  </span>
                  <p className="mt-1.5 font-serif italic text-sm text-warm-100/90">
                    "{book.damarReflection}"
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[11px] text-warm-200/55">
                Buku dikembalikan rapi ke kotak kayu agar warga berikutnya juga bisa membacanya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
