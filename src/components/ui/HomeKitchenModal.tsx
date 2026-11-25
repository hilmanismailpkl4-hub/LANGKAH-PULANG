import React from 'react';
import { Clock, Flame, Heart, Soup, UtensilsCrossed, X } from 'lucide-react';
import { HOME_KITCHEN_RECIPES } from '../../data/homeKitchenRecipes';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

/**
 * Modal Memasak & Menyeduh Hangat di Dapur Rumah Jl. Melati No. 14.
 */
export const HomeKitchenModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isKitchenOpen);
  const setKitchenOpen = useGameStore((s) => s.setKitchenOpen);
  const cookHomeRecipe = useGameStore((s) => s.cookHomeRecipe);
  const homeStoveLit = useGameStore((s) => s.homeStoveLit);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 backdrop-blur-md"
        onClick={() => setKitchenOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-warm-300/30 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn"
        >
          {/* Header Dapur Rumah */}
          <div className="flex items-center justify-between border-b border-warm-100/10 bg-dusk-950/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                <Soup className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-300/85">
                  Dapur Rumah · Jl. Melati No. 14
                </p>
                <h2 className="font-serif text-xl text-warm-50">Masak & Seduh Hangat Bersama Nadia</h2>
                <p className="text-[11px] text-warm-200/65">
                  {homeStoveLit
                    ? 'Kompor sedang hangat menyala—panci sup mengepul pelan di dapur.'
                    : 'Pilih hidangan rumahan sederhana untuk dinikmati bersama keluarga.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setKitchenOpen(false)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 3 Resep Rumahan Hangat */}
          <div className="space-y-3 p-5">
            {HOME_KITCHEN_RECIPES.map((recipe) => (
              <div
                key={recipe.id}
                className="rounded-2xl border border-warm-100/15 bg-dusk-950/65 p-4 transition hover:border-warm-300/45"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-base font-medium text-warm-50">{recipe.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                        <Flame className="h-3 w-3" /> {recipe.category}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-warm-200/75">{recipe.description}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-warm-400/15 px-2.5 py-1 text-[11px] font-medium text-warm-200">
                    <Clock className="h-3 w-3" /> {recipe.cookTimeLabel}
                  </span>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => cookHomeRecipe(recipe.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-warm-400 px-4 py-2 text-xs font-semibold text-dusk-950 transition hover:bg-warm-300"
                  >
                    <UtensilsCrossed className="h-3.5 w-3.5" />
                    <span>Masak & Hidangkan Hangat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 border-t border-warm-100/10 bg-dusk-950/50 px-6 py-3 text-center text-[11px] text-warm-200/65">
            <Heart className="h-3.5 w-3.5 text-rose-300" />
            <span>Kompor dan uap panci dapur akan menyala langsung di dalam rumah saat kamu selesai memasak.</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
