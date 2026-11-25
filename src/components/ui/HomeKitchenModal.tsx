import React from 'react';
import { Clock, Flame, Heart, Soup, UtensilsCrossed, X } from 'lucide-react';
import { HOME_KITCHEN_RECIPES } from '../../data/homeKitchenRecipes';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

/**
 * Modal Memasak & Menyeduh Hangat di Dapur Rumah Jl. Melati No. 14.
 */
export const HomeKitchenModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isKitchenOpen);
  const setKitchenOpen = useGameStore((s) => s.setKitchenOpen);
  const cookHomeRecipe = useGameStore((s) => s.cookHomeRecipe);
  const homeStoveLit = useGameStore((s) => s.homeStoveLit);
  const { isMobile, isCompactLandscape } = useMobileViewport();

  if (!isOpen) return null;

  const compact = isMobile || isCompactLandscape;

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
        onClick={() => setKitchenOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full flex-col overflow-hidden rounded-2xl border border-warm-300/30 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn ${
            compact ? 'max-h-[94dvh] max-w-4xl' : 'max-h-[90vh] max-w-xl'
          }`}
        >
          {/* Header Dapur Rumah */}
          <div
            className={`flex shrink-0 items-center justify-between border-b border-warm-100/10 bg-dusk-950/60 ${
              compact ? 'px-4 py-2.5' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 ${
                  compact ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                <Soup className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </div>
              <div>
                {!compact && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-300/85">
                    Dapur Rumah · Jl. Melati No. 14
                  </p>
                )}
                <h2 className={`font-serif text-warm-50 ${compact ? 'text-base leading-tight' : 'text-xl'}`}>
                  Masak &amp; Seduh Hangat Bersama Nadia
                </h2>
                <p className={`text-warm-200/65 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
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

          {/* 3 Resep Rumahan Hangat: sejajar 3 kolom di layar mendatar HP */}
          <div
            className={`flex-1 overflow-y-auto subtle-scroll ${
              compact ? 'grid grid-cols-3 gap-2.5 p-3' : 'space-y-3 p-5'
            }`}
          >
            {HOME_KITCHEN_RECIPES.map((recipe) => (
              <div
                key={recipe.id}
                className={`flex flex-col justify-between rounded-2xl border border-warm-100/15 bg-dusk-950/65 transition hover:border-warm-300/45 ${
                  compact ? 'p-3' : 'p-4'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className={`font-serif font-medium text-warm-50 ${compact ? 'text-sm leading-tight' : 'text-base'}`}>
                          {recipe.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-medium text-amber-200">
                          <Flame className="h-2.5 w-2.5" /> {recipe.category}
                        </span>
                      </div>
                    </div>
                    {!compact && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-warm-400/15 px-2.5 py-1 text-[11px] font-medium text-warm-200">
                        <Clock className="h-3 w-3" /> {recipe.cookTimeLabel}
                      </span>
                    )}
                  </div>
                  {compact && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-warm-400/15 px-1.5 py-0.5 text-[9px] font-medium text-warm-200">
                      <Clock className="h-2.5 w-2.5" /> {recipe.cookTimeLabel}
                    </span>
                  )}
                  <p className={`leading-relaxed text-warm-200/75 ${compact ? 'mt-1.5 text-[11px] line-clamp-3' : 'mt-1 text-xs'}`}>
                    {recipe.description}
                  </p>
                </div>

                <div className={compact ? 'mt-2.5' : 'mt-3 flex justify-end'}>
                  <button
                    type="button"
                    onClick={() => cookHomeRecipe(recipe.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl bg-warm-400 font-semibold text-dusk-950 transition hover:bg-warm-300 ${
                      compact ? 'w-full px-2.5 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
                    }`}
                  >
                    <UtensilsCrossed className="h-3.5 w-3.5 shrink-0" />
                    <span>{compact ? 'Masak Hangat' : 'Masak & Hidangkan Hangat'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`flex shrink-0 items-center justify-center gap-1.5 border-t border-warm-100/10 bg-dusk-950/50 text-center text-warm-200/65 ${
              compact ? 'px-4 py-1.5 text-[10px]' : 'px-6 py-3 text-[11px]'
            }`}
          >
            <Heart className="h-3 w-3 shrink-0 text-rose-300" />
            <span>Kompor &amp; uap panci dapur menyala langsung di dalam rumah saat selesai memasak.</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
