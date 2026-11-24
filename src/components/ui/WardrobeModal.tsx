import React from 'react';
import { CheckCircle2, Shirt, X } from 'lucide-react';
import { DAMAR_OUTFITS } from '../../data/damarOutfits';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

export const WardrobeModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isWardrobeOpen);
  const setOpen = useGameStore((s) => s.setWardrobeOpen);
  const currentOutfitId = useGameStore((s) => s.damarOutfitId);
  const setDamarOutfit = useGameStore((s) => s.setDamarOutfit);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 backdrop-blur-md"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-warm-300/30 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-100/10 bg-dusk-950/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-300/85">
                  Rumah Jl. Melati No. 14
                </p>
                <h2 className="font-serif text-xl text-warm-50">Lemari Pakaian Damar</h2>
                <p className="text-[11px] text-warm-200/65">
                  Pilih gaya pakaian harian Damar — langsung berubah pada karakter 3D
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Grid 4 Pakaian Realistis */}
          <div className="grid grid-cols-1 gap-3.5 p-5 sm:grid-cols-2">
            {DAMAR_OUTFITS.map((outfit) => {
              const active = currentOutfitId === outfit.id;
              return (
                <button
                  key={outfit.id}
                  type="button"
                  onClick={() => setDamarOutfit(outfit.id)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-warm-300 bg-warm-400/15 shadow-lg'
                      : 'border-warm-100/15 bg-dusk-950/65 hover:border-warm-300/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {/* Swatch Warna Atasan & Celana */}
                      <div className="flex items-center gap-2">
                        <span
                          className="h-7 w-7 rounded-lg border border-white/25 shadow-inner"
                          style={{ backgroundColor: outfit.shirtColor }}
                          title="Warna Atasan"
                        />
                        <span
                          className="h-7 w-5 rounded-lg border border-white/20 shadow-inner"
                          style={{ backgroundColor: outfit.pantsColor }}
                          title="Warna Celana"
                        />
                      </div>
                      {active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warm-400 px-2.5 py-0.5 text-[10px] font-bold text-dusk-950">
                          <CheckCircle2 className="h-3 w-3" /> Dipakai
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-warm-300/80">Klik untuk pakai</span>
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-base font-medium text-warm-50">{outfit.name}</h3>
                    <p className="text-[11px] text-warm-300/80">{outfit.subtitle}</p>
                    <p className="mt-2 text-xs leading-relaxed text-warm-200/75">{outfit.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Portal>
  );
};
