import React from 'react';
import { Coffee, Droplets, Flame, Heart, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import { CULINARY_MENU_ITEMS, CULINARY_SPOTS } from '../../data/culinaryMenu';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

export const CulinaryModal: React.FC = () => {
  const activeSpot = useGameStore((s) => s.activeCulinarySpot);
  const openCulinarySpot = useGameStore((s) => s.openCulinarySpot);
  const orderCulinaryItem = useGameStore((s) => s.orderCulinaryItem);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const toggleFamilyWalk = useGameStore((s) => s.toggleFamilyWalk);

  if (!activeSpot) return null;

  const spotInfo = CULINARY_SPOTS[activeSpot];
  const items = CULINARY_MENU_ITEMS.filter((item) => item.spot === activeSpot);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 backdrop-blur-md"
        onClick={() => openCulinarySpot(null)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-warm-300/30 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-100/10 bg-dusk-950/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300">
                {activeSpot === 'cafe' || activeSpot === 'office_pantry' ? (
                  <Coffee className="h-5 w-5" />
                ) : activeSpot === 'martabak' || activeSpot === 'bakso' || activeSpot === 'sate' ? (
                  <Flame className="h-5 w-5" />
                ) : activeSpot === 'coconut' || activeSpot === 'dawet' ? (
                  <Droplets className="h-5 w-5" />
                ) : (
                  <UtensilsCrossed className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-300/85">
                  Menu Jajan & Nongkrong · {spotInfo.hostName}
                </p>
                <h2 className="font-serif text-xl text-warm-50">{spotInfo.title}</h2>
                <p className="text-[11px] text-warm-200/65">{spotInfo.subtitle}</p>
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

          {/* Daftar Menu Autentik */}
          <div className="space-y-3 p-5">
            {items.map((item) => {
              const isTreat = Boolean(item.isFamilyTreat);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 transition ${
                    isTreat
                      ? 'border-rose-300/40 bg-rose-950/25'
                      : 'border-warm-100/15 bg-dusk-950/65 hover:border-warm-300/45'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-base font-medium text-warm-50">{item.name}</h3>
                        {item.isHot ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                            <Flame className="h-3 w-3" /> Hangat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                            <Droplets className="h-3 w-3" /> Segar Dingin
                          </span>
                        )}
                        {isTreat && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/25 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                            <Heart className="h-3 w-3 fill-rose-300" /> Spesial Keluarga
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-warm-200/75">{item.tagline}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-warm-400/15 px-2.5 py-1 text-xs font-semibold text-warm-200">
                      {item.priceLabel}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
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
                        className="flex items-center gap-2 rounded-xl bg-rose-400 px-4 py-2 text-xs font-semibold text-dusk-950 transition hover:bg-rose-300"
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                        <span>Panggil Nadia & Kira + Traktir di Sini</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => orderCulinaryItem(item.id)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                          isTreat
                            ? 'bg-rose-400 text-dusk-950 hover:bg-rose-300'
                            : 'bg-warm-400 text-dusk-950 hover:bg-warm-300'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{isTreat ? 'Pesan & Nikmati Bertiga' : 'Pesan & Duduk Santai'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-warm-100/10 bg-dusk-950/50 px-6 py-3 text-center text-[11px] text-warm-200/60">
            Damar akan duduk santai menikmati hidangan hangat—minuman & jajanan juga bisa dibawa berjalan setelah berdiri!
          </div>
        </div>
      </div>
    </Portal>
  );
};
