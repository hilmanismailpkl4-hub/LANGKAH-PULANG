import React from 'react';
import { ChevronLeft, ChevronRight, Compass, Eye, X } from 'lucide-react';
import { ROOFTOP_TELESCOPE_TARGETS } from '../../data/rooftopAndRtData';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

/**
 * Overlay Teropong Koin Optik di Rooftop Menara Nusantara:
 * Menampilkan vignette lensa binokular, pengukur arah, dan 4 target zoom pemandangan kota nyata.
 */
export const TelescopeOverlay: React.FC = () => {
  const isOpen = useGameStore((s) => s.isTelescopeOpen);
  const targetIdx = useGameStore((s) => s.telescopeTargetIdx);
  const setOpen = useGameStore((s) => s.setTelescopeOpen);
  const setTargetIdx = useGameStore((s) => s.setTelescopeTargetIdx);

  if (!isOpen) return null;

  const total = ROOFTOP_TELESCOPE_TARGETS.length;
  const current = ROOFTOP_TELESCOPE_TARGETS[targetIdx % total] ?? ROOFTOP_TELESCOPE_TARGETS[0];

  const handlePrev = () => setTargetIdx((targetIdx - 1 + total) % total);
  const handleNext = () => setTargetIdx((targetIdx + 1) % total);

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9994] select-none overflow-hidden animate-fadeIn">
        {/* Vignette Lensa Teropong Optik */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 42%, rgba(7, 10, 16, 0.58) 64%, rgba(5, 7, 12, 0.96) 80%)',
          }}
        />

        {/* Garis Bidik Halus (Reticle Optik) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-44 w-44 rounded-full border border-warm-200/35">
            <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-warm-200/45" />
            <span className="absolute bottom-0 left-1/2 h-5 w-px -translate-x-1/2 bg-warm-200/45" />
            <span className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-warm-200/45" />
            <span className="absolute right-0 top-1/2 h-px w-5 -translate-y-1/2 bg-warm-200/45" />
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/80" />
          </div>
        </div>

        {/* Bar Atas: Info Optik & Tombol Keluar */}
        <div className="pointer-events-auto absolute inset-x-0 top-5 flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5 rounded-full border border-warm-200/25 bg-dusk-950/75 px-4 py-2 text-xs text-warm-100 backdrop-blur-md">
            <Eye className="h-4 w-4 text-amber-300" />
            <span className="font-semibold tracking-wider uppercase">Teropong Rooftop Menara Nusantara</span>
            <span className="text-warm-300/60">·</span>
            <span className="font-mono text-[11px] text-amber-200">{current.bearingLabel}</span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/25 bg-dusk-950/80 px-4 py-2 text-xs font-semibold text-warm-100 backdrop-blur-md transition hover:bg-warm-400 hover:text-dusk-950"
          >
            <X className="h-4 w-4" />
            <span>Lepas Teropong [Esc / E]</span>
          </button>
        </div>

        {/* Panel Bawah: Deskripsi Landmark & Navigasi 4 Arah */}
        <div className="pointer-events-auto absolute inset-x-0 bottom-6 mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4">
          <div className="w-full rounded-2xl border border-warm-200/25 bg-dusk-950/82 p-4 text-center text-warm-50 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-xl border border-warm-200/20 bg-white/5 p-2 text-warm-100 transition hover:bg-warm-400 hover:text-dusk-950"
                title="Target sebelumnya [A / ←]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex-1">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/90">
                  <Compass className="h-3.5 w-3.5" /> {current.subtitle}
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-semibold text-warm-50 md:text-xl">
                  {current.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-warm-200/85 italic">
                  "{current.caption}"
                </p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl border border-warm-200/20 bg-white/5 p-2 text-warm-100 transition hover:bg-warm-400 hover:text-dusk-950"
                title="Target berikutnya [D / →]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Pemilih Cepat 4 Arah */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 border-t border-warm-100/10 pt-3">
              {ROOFTOP_TELESCOPE_TARGETS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTargetIdx(idx)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    idx === targetIdx % total
                      ? 'bg-amber-400 text-dusk-950 shadow'
                      : 'border border-warm-200/20 bg-white/5 text-warm-200/80 hover:bg-white/15'
                  }`}
                >
                  {idx + 1}. {item.name.split('·')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
