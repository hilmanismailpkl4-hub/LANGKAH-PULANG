import React, { useState } from 'react';
import { CheckCircle2, Heart, Shirt, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { DAMAR_OUTFITS, KIRA_OUTFITS, NADIA_OUTFITS } from '../../data/damarOutfits';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

type FamilyTab = 'damar' | 'nadia' | 'kira';

export const WardrobeModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isWardrobeOpen);
  const setOpen = useGameStore((s) => s.setWardrobeOpen);
  const damarOutfitId = useGameStore((s) => s.damarOutfitId);
  const nadiaOutfitId = useGameStore((s) => s.nadiaOutfitId);
  const kiraOutfitId = useGameStore((s) => s.kiraOutfitId);
  const setDamarOutfit = useGameStore((s) => s.setDamarOutfit);
  const setNadiaOutfit = useGameStore((s) => s.setNadiaOutfit);
  const setKiraOutfit = useGameStore((s) => s.setKiraOutfit);
  const { isMobile, isCompactLandscape } = useMobileViewport();

  const [tab, setTab] = useState<FamilyTab>('damar');

  if (!isOpen) return null;

  const compact = isMobile || isCompactLandscape;

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full flex-col overflow-hidden rounded-2xl border border-warm-300/30 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn ${
            compact ? 'max-h-[94dvh] max-w-4xl' : 'max-h-[90vh] max-w-2xl'
          }`}
        >
          {/* Header (+ Tab terintegrasi satu baris pada layar HP mendatar) */}
          <div
            className={`flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-warm-100/10 bg-dusk-950/60 ${
              compact ? 'px-4 py-2' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300 ${
                  compact ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                <Shirt className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </div>
              <div>
                {!compact && (
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-300/85">
                    Rumah Jl. Melati No. 14
                  </p>
                )}
                <h2 className={`font-serif text-warm-50 ${compact ? 'text-base leading-tight' : 'text-xl'}`}>
                  Lemari Pakaian Keluarga
                </h2>
                {!compact && (
                  <p className="text-[11px] text-warm-200/65">
                    Atur pakaian Damar, Nadia &amp; Kira — langsung berubah real-time di dunia 3D
                  </p>
                )}
              </div>
            </div>

            {compact && (
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: 'damar', label: 'Damar (4)' },
                    { id: 'nadia', label: 'Nadia (3)' },
                    { id: 'kira', label: 'Kira (3)' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sfxEngine.play('switch');
                      setTab(t.id);
                    }}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                      tab === t.id
                        ? 'bg-warm-400 font-semibold text-dusk-950 shadow'
                        : 'border border-warm-100/15 bg-dusk-900/75 text-warm-200 hover:border-warm-300/45'
                    }`}
                  >
                    {t.id !== 'damar' && <Heart className="h-2.5 w-2.5" />}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 3 Tab Anggota Keluarga (Baris terpisah khusus Desktop) */}
          {!compact && (
            <div className="flex shrink-0 items-center gap-2 border-b border-warm-100/10 bg-dusk-950/40 px-6 py-3">
              {(
                [
                  { id: 'damar', label: 'Damar (4 Gaya)' },
                  { id: 'nadia', label: 'Nadia (3 Gaya)' },
                  { id: 'kira', label: 'Kira (3 Gaya)' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sfxEngine.play('switch');
                    setTab(t.id);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                    tab === t.id
                      ? 'bg-warm-400 font-semibold text-dusk-950 shadow'
                      : 'border border-warm-100/15 bg-dusk-900/75 text-warm-200 hover:border-warm-300/45'
                  }`}
                >
                  {t.id !== 'damar' && <Heart className="h-3 w-3" />}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Daftar Gaya Pakaian sesuai Tab (2x2 untuk Damar, 3-kolom untuk Nadia & Kira di HP Landscape) */}
          <div
            className={`flex-1 overflow-y-auto subtle-scroll ${
              compact
                ? tab === 'damar'
                  ? 'grid grid-cols-2 gap-2.5 p-3'
                  : 'grid grid-cols-3 gap-2.5 p-3'
                : 'grid grid-cols-1 gap-3.5 p-5 sm:grid-cols-2'
            }`}
          >
            {tab === 'damar' &&
              DAMAR_OUTFITS.map((outfit) => {
                const active = damarOutfitId === outfit.id;
                return (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => setDamarOutfit(outfit.id)}
                    className={`flex flex-col justify-between rounded-2xl border text-left transition ${
                      compact ? 'p-2.5' : 'p-4'
                    } ${
                      active
                        ? 'border-warm-300 bg-warm-400/15 shadow-lg'
                        : 'border-warm-100/15 bg-dusk-950/65 hover:border-warm-300/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-lg border border-white/25 shadow-inner ${compact ? 'h-5 w-5' : 'h-7 w-7'}`}
                            style={{ backgroundColor: outfit.shirtColor }}
                          />
                          <span
                            className={`rounded-lg border border-white/20 shadow-inner ${compact ? 'h-5 w-4' : 'h-7 w-5'}`}
                            style={{ backgroundColor: outfit.pantsColor }}
                          />
                        </div>
                        {active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-warm-400 px-2 py-0.5 text-[9px] font-bold text-dusk-950">
                            <CheckCircle2 className="h-3 w-3" /> Dipakai
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-warm-300/80">
                            {compact ? 'Pakai' : 'Klik untuk pakai'}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-serif font-medium text-warm-50 ${compact ? 'mt-1.5 text-sm leading-tight' : 'mt-3 text-base'}`}>
                        {outfit.name}
                      </h3>
                      <p className={`text-warm-300/80 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{outfit.subtitle}</p>
                      <p className={`leading-relaxed text-warm-200/75 ${compact ? 'mt-1 text-[10.5px] line-clamp-2' : 'mt-2 text-xs'}`}>
                        {outfit.description}
                      </p>
                    </div>
                  </button>
                );
              })}

            {tab === 'nadia' &&
              NADIA_OUTFITS.map((outfit) => {
                const active = nadiaOutfitId === outfit.id;
                return (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => setNadiaOutfit(outfit.id)}
                    className={`flex flex-col justify-between rounded-2xl border text-left transition ${
                      compact ? 'p-3' : 'p-4'
                    } ${
                      active
                        ? 'border-rose-300 bg-rose-400/15 shadow-lg'
                        : 'border-warm-100/15 bg-dusk-950/65 hover:border-rose-300/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-lg border border-white/25 shadow-inner ${compact ? 'h-6 w-6' : 'h-7 w-7'}`}
                            style={{ backgroundColor: outfit.shirtColor }}
                          />
                          <span
                            className={`rounded-lg border border-white/20 shadow-inner ${compact ? 'h-6 w-4' : 'h-7 w-5'}`}
                            style={{ backgroundColor: outfit.pantsColor }}
                          />
                        </div>
                        {active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-300 px-2 py-0.5 text-[9px] font-bold text-dusk-950">
                            <CheckCircle2 className="h-3 w-3" /> Dipakai
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-rose-200/80">
                            {compact ? 'Pilih' : 'Pilih untuk Nadia'}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-serif font-medium text-warm-50 ${compact ? 'mt-2 text-sm leading-tight' : 'mt-3 text-base'}`}>
                        {outfit.name}
                      </h3>
                      <p className={`text-rose-200/80 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{outfit.subtitle}</p>
                      <p className={`leading-relaxed text-warm-200/75 ${compact ? 'mt-1.5 text-[11px] line-clamp-3' : 'mt-2 text-xs'}`}>
                        {outfit.description}
                      </p>
                    </div>
                  </button>
                );
              })}

            {tab === 'kira' &&
              KIRA_OUTFITS.map((outfit) => {
                const active = kiraOutfitId === outfit.id;
                return (
                  <button
                    key={outfit.id}
                    type="button"
                    onClick={() => setKiraOutfit(outfit.id)}
                    className={`flex flex-col justify-between rounded-2xl border text-left transition ${
                      compact ? 'p-3' : 'p-4'
                    } ${
                      active
                        ? 'border-amber-300 bg-amber-400/15 shadow-lg'
                        : 'border-warm-100/15 bg-dusk-950/65 hover:border-amber-300/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-lg border border-white/25 shadow-inner ${compact ? 'h-6 w-6' : 'h-7 w-7'}`}
                            style={{ backgroundColor: outfit.shirtColor }}
                          />
                          <span
                            className={`rounded-lg border border-white/20 shadow-inner ${compact ? 'h-6 w-4' : 'h-7 w-5'}`}
                            style={{ backgroundColor: outfit.pantsColor }}
                          />
                        </div>
                        {active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2 py-0.5 text-[9px] font-bold text-dusk-950">
                            <CheckCircle2 className="h-3 w-3" /> Dipakai
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-200/80">
                            {compact ? 'Pilih' : 'Pilih untuk Kira'}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-serif font-medium text-warm-50 ${compact ? 'mt-2 text-sm leading-tight' : 'mt-3 text-base'}`}>
                        {outfit.name}
                      </h3>
                      <p className={`text-amber-200/80 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{outfit.subtitle}</p>
                      <p className={`leading-relaxed text-warm-200/75 ${compact ? 'mt-1.5 text-[11px] line-clamp-3' : 'mt-2 text-xs'}`}>
                        {outfit.description}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>

          <div
            className={`flex shrink-0 items-center justify-between border-t border-warm-100/10 bg-dusk-950/50 ${
              compact ? 'px-4 py-2' : 'px-6 py-3'
            }`}
          >
            <span className="text-[10px] text-warm-200/60">
              {compact ? 'Pakaian langsung berubah real-time di dunia 3D' : ''}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={`rounded-xl bg-warm-400 font-semibold text-dusk-950 hover:bg-warm-300 ${
                compact ? 'px-4 py-1.5 text-[11px]' : 'px-5 py-2 text-xs'
              }`}
            >
              {compact ? 'Selesai & Lihat' : 'Tutup Lemari & Lihat Hasilnya'}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
