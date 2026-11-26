import React from 'react';
import { Coffee, Droplets, Flame, Heart, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import { CULINARY_MENU_ITEMS, CULINARY_SPOTS } from '../../data/culinaryMenu';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

export const CulinaryModal: React.FC = () => {
  const activeSpot = useGameStore((s) => s.activeCulinarySpot);
  const openCulinarySpot = useGameStore((s) => s.openCulinarySpot);
  const orderCulinaryItem = useGameStore((s) => s.orderCulinaryItem);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const toggleFamilyWalk = useGameStore((s) => s.toggleFamilyWalk);
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  if (!activeSpot) return null;

  const spotInfo = CULINARY_SPOTS[activeSpot];
  const items = CULINARY_MENU_ITEMS.filter((item) => item.spot === activeSpot);

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
        onClick={() => openCulinarySpot(null)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-2xl border border-warm-300/30 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn ${
            compact ? 'max-w-4xl' : 'max-w-xl'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between border-b border-warm-100/10 bg-dusk-950/60 ${
              compact ? 'px-4 py-2.5' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300 ${
                  compact ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                {activeSpot === 'cafe' || activeSpot === 'office_pantry' ? (
                  <Coffee className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : activeSpot === 'martabak' ||
                  activeSpot === 'bakso' ||
                  activeSpot === 'sate' ||
                  activeSpot === 'siomay' ||
                  activeSpot === 'gorengan' ||
                  activeSpot === 'pecel_lele' ||
                  activeSpot === 'ketoprak' ? (
                  <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : activeSpot === 'coconut' || activeSpot === 'dawet' || activeSpot === 'doger' ? (
                  <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-warm-300/85">
                  Menu Jajan &amp; Nongkrong · {spotInfo.hostName}
                </p>
                <h2 className={`font-serif text-warm-50 ${compact ? 'text-base leading-tight' : 'text-xl'}`}>
                  {spotInfo.title}
                </h2>
                {!compact && <p className="text-[11px] text-warm-200/65">{spotInfo.subtitle}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => openCulinarySpot(null)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Daftar Menu Autentik — 3 Kolom Mendatar pada Landscape HP agar Semua Terlihat Sekaligus! */}
          <div
            className={`flex-1 overflow-y-auto subtle-scroll ${
              compact ? 'grid grid-cols-3 gap-2.5 p-3' : 'space-y-3 p-5'
            }`}
          >
            {items.map((item) => {
              const isTreat = Boolean(item.isFamilyTreat);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-2xl border transition ${
                    compact ? 'p-3' : 'p-4'
                  } ${
                    isTreat
                      ? 'border-rose-300/40 bg-rose-950/25'
                      : 'border-warm-100/15 bg-dusk-950/65 hover:border-warm-300/45'
                  }`}
                >
                  <div className={`flex ${compact ? 'flex-col gap-1.5' : 'items-start justify-between gap-3'}`}>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className={`font-serif font-medium text-warm-50 ${compact ? 'text-xs leading-snug' : 'text-base'}`}>
                          {item.name}
                        </h3>
                        {item.isHot ? (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-medium text-amber-200">
                            <Flame className="h-2.5 w-2.5" /> Hangat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[9px] font-medium text-sky-200">
                            <Droplets className="h-2.5 w-2.5" /> Dingin
                          </span>
                        )}
                        {isTreat && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-500/25 px-1.5 py-0.5 text-[9px] font-semibold text-rose-200">
                            <Heart className="h-2.5 w-2.5 fill-rose-300" /> Keluarga
                          </span>
                        )}
                      </div>
                      <p className={`leading-relaxed text-warm-200/75 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                        {item.tagline}
                      </p>
                    </div>
                    <span className="w-fit shrink-0 rounded-lg bg-warm-400/15 px-2 py-0.5 text-[11px] font-semibold text-warm-200">
                      {item.priceLabel}
                    </span>
                  </div>

                  <div className={`flex flex-wrap items-center justify-end gap-2 ${compact ? 'mt-2.5' : 'mt-3'}`}>
                    {isTreat && !isFamilyWalkActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          openCulinarySpot(null);
                          toggleFamilyWalk();
                          window.setTimeout(() => {
                            useGameStore.getState().orderCulinaryItem(item.id);
                          }, 120);
                        }}
                        className={`flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-400 font-semibold text-dusk-950 transition hover:bg-rose-300 ${
                          compact ? 'px-2.5 py-1.5 text-[10px]' : 'w-auto px-4 py-2 text-xs'
                        }`}
                      >
                        <Heart className="h-3 w-3 fill-current" />
                        <span>{compact ? 'Panggil & Traktir' : 'Panggil Nadia & Kira + Traktir di Sini'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => orderCulinaryItem(item.id)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl font-semibold transition ${
                          compact ? 'w-full px-2.5 py-1.5 text-[10px]' : 'px-4 py-2 text-xs'
                        } ${
                          isTreat
                            ? 'bg-rose-400 text-dusk-950 hover:bg-rose-300'
                            : 'bg-warm-400 text-dusk-950 hover:bg-warm-300'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{isTreat ? 'Nikmati Bertiga' : 'Pesan & Duduk'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {!compact && (
            <div className="border-t border-warm-100/10 bg-dusk-950/50 px-6 py-3 text-center text-[11px] text-warm-200/60">
              Damar akan duduk santai menikmati hidangan hangat—minuman &amp; jajanan juga bisa dibawa berjalan setelah berdiri!
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};
