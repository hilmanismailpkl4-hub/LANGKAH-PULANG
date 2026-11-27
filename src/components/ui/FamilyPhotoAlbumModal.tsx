import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Camera, ChevronLeft, ChevronRight, Film, Heart, MapPin, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { MEMORY_PHOTOS, MemoryPhotoItem } from '../../data/phoneContent';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

interface AlbumPageItem {
  id: string;
  kind: 'memory' | 'capture';
  title: string;
  dateLabel: string;
  locationLabel: string;
  caption: string;
  theme?: MemoryPhotoItem['theme'];
  dataUrl?: string;
  flashbackDialogueId?: string;
  flashbackFlag?: string;
}

/**
 * Ilustrasi cetak hangat untuk 6 foto kenangan lama keluarga Damar di dalam buku album kertas.
 */
const AlbumMemoryArt: React.FC<{ theme: MemoryPhotoItem['theme'] }> = ({ theme }) => {
  if (theme === 'stage') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full object-cover">
        <defs>
          <linearGradient id="alb-st" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b38" />
            <stop offset="100%" stopColor="#693b32" />
          </linearGradient>
        </defs>
        <rect width="280" height="170" fill="url(#alb-st)" />
        <circle cx="80" cy="36" r="22" fill="#ffd27d" opacity="0.3" />
        <circle cx="204" cy="36" r="22" fill="#ffb86b" opacity="0.3" />
        <rect x="0" y="124" width="280" height="46" fill="#2b1c17" />
        <circle cx="116" cy="76" r="12" fill="#d9aa86" />
        <rect x="102" y="90" width="28" height="36" rx="7" fill="#486078" />
        <ellipse cx="126" cy="108" rx="16" ry="9" fill="#b87138" transform="rotate(-18 126 108)" />
        <circle cx="168" cy="80" r="11" fill="#cfa07b" />
        <rect x="155" y="92" width="26" height="34" rx="7" fill="#8f6b56" />
      </svg>
    );
  }
  if (theme === 'bridge') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full">
        <defs>
          <linearGradient id="alb-br" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c2a54" />
            <stop offset="58%" stopColor="#f08a58" />
            <stop offset="100%" stopColor="#264059" />
          </linearGradient>
        </defs>
        <rect width="280" height="170" fill="url(#alb-br)" />
        <circle cx="140" cy="82" r="26" fill="#ffe19e" opacity="0.88" />
        <rect x="0" y="108" width="280" height="7" fill="#2b313c" />
        <rect x="52" y="42" width="6" height="72" fill="#d4dbe3" />
        <rect x="222" y="42" width="6" height="72" fill="#d4dbe3" />
        <path d="M55 46 Q140 102 225 46" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        <rect x="128" y="92" width="24" height="22" rx="4" fill="#d9a14a" />
      </svg>
    );
  }
  if (theme === 'baby') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full">
        <rect width="280" height="170" fill="#f7ebdb" />
        <circle cx="140" cy="86" r="56" fill="#f3d4b6" opacity="0.55" />
        <circle cx="140" cy="78" r="24" fill="#e8be9c" />
        <ellipse cx="140" cy="126" rx="44" ry="26" fill="#f5c6c6" />
        <circle cx="132" cy="76" r="2.2" fill="#3b2f2a" />
        <circle cx="148" cy="76" r="2.2" fill="#3b2f2a" />
        <path d="M135 85 Q140 90 145 85" fill="none" stroke="#9e5d4f" strokeWidth="2" />
      </svg>
    );
  }
  if (theme === 'cafe') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full">
        <rect width="280" height="170" fill="#3b291f" />
        <rect x="26" y="24" width="228" height="122" rx="8" fill="#593c2a" />
        <circle cx="88" cy="48" r="7" fill="#ffdf94" />
        <circle cx="140" cy="54" r="7" fill="#ffdf94" />
        <circle cx="192" cy="48" r="7" fill="#ffdf94" />
        <rect x="86" y="102" width="32" height="32" rx="5" fill="#f2eadc" />
        <rect x="160" y="102" width="32" height="32" rx="5" fill="#f2eadc" />
        <rect x="64" y="132" width="152" height="10" rx="3" fill="#8c5c39" />
      </svg>
    );
  }
  if (theme === 'crayon') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full">
        <rect width="280" height="170" fill="#fcf7eb" />
        <circle cx="222" cy="40" r="22" fill="#f5c242" />
        <rect x="0" y="120" width="280" height="50" fill="#73b8de" />
        <polygon points="34,92 68,62 102,92" fill="#a84938" />
        <rect x="42" y="92" width="52" height="32" fill="#dc826b" />
        {[140, 174, 206].map((x, idx) => (
          <g key={x} stroke="#2e3540" strokeWidth="3" fill="none">
            <circle cx={x} cy={idx === 1 ? 94 : 80} r="8" />
            <line x1={x} y1={idx === 1 ? 102 : 88} x2={x} y2="122" />
          </g>
        ))}
      </svg>
    );
  }
  if (theme === 'dinner_quiet') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full">
        <defs>
          <radialGradient id="alb-din" cx="50%" cy="20%" r="75%">
            <stop offset="0%" stopColor="#f4c778" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#141116" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="280" height="170" fill="url(#alb-din)" />
        <line x1="140" y1="0" x2="140" y2="28" stroke="#3c3028" strokeWidth="2.5" />
        <polygon points="120,28 160,28 170,44 110,44" fill="#d49e52" />
        <ellipse cx="140" cy="44" rx="22" ry="5" fill="#ffe6a8" />
        <circle cx="48" cy="42" r="16" fill="#241c17" stroke="#8e775c" strokeWidth="2" />
        <line x1="48" y1="42" x2="40" y2="37" stroke="#f5e6cc" strokeWidth="2" />
        <line x1="48" y1="42" x2="58" y2="42" stroke="#f5e6cc" strokeWidth="1.6" />
        <rect x="0" y="114" width="280" height="56" fill="#3a271d" />
        <path d="M58 104 Q82 128 106 104 Z" fill="#ece2d4" />
        <ellipse cx="82" cy="104" rx="24" ry="5.5" fill="#d9b26a" />
        <polygon points="168,68 228,68 220,110 160,110" fill="#9bc2e6" stroke="#2c3442" strokeWidth="3" />
        <rect x="150" y="110" width="80" height="6" rx="2" fill="#3c4554" />
      </svg>
    );
  }
  if (theme === 'moving_boxes') {
    return (
      <svg viewBox="0 0 280 170" className="h-full w-full">
        <defs>
          <radialGradient id="alb-box19" cx="50%" cy="22%" r="75%">
            <stop offset="0%" stopColor="#ffe18c" stopOpacity="0.6" />
            <stop offset="58%" stopColor="#3e2d1f" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#1b1512" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="280" height="170" fill="url(#alb-box19)" />
        {/* Jendela berkoran dengan selotip kertas */}
        <rect x="28" y="30" width="56" height="60" rx="2" fill="#e2d6bf" stroke="#5b4938" strokeWidth="3" />
        <line x1="35" y1="42" x2="77" y2="42" stroke="#9e8f77" strokeWidth="1.8" />
        <line x1="35" y1="53" x2="74" y2="53" stroke="#9e8f77" strokeWidth="1.8" />
        <line x1="35" y1="66" x2="78" y2="66" stroke="#9e8f77" strokeWidth="1.8" />
        <rect x="23" y="26" width="14" height="5" fill="#f5e7af" transform="rotate(-22 30 28)" />
        <rect x="74" y="26" width="14" height="5" fill="#f5e7af" transform="rotate(24 81 28)" />
        {/* Bohlam 5 watt telanjang */}
        <path d="M140 0 Q144 15 140 30" stroke="#221b17" strokeWidth="2.4" fill="none" />
        <rect x="136.5" y="29" width="7" height="6" fill="#7d746a" />
        <circle cx="140" cy="41" r="8" fill="#fff4b5" />
        {/* Lantai keramik putih dingin */}
        <rect x="0" y="116" width="280" height="54" fill="#d2c8b6" />
        <line x1="0" y1="140" x2="280" y2="140" stroke="#b3a793" strokeWidth="1.2" />
        <line x1="72" y1="116" x2="50" y2="170" stroke="#b3a793" strokeWidth="1.2" />
        <line x1="140" y1="116" x2="140" y2="170" stroke="#b3a793" strokeWidth="1.2" />
        <line x1="208" y1="116" x2="230" y2="170" stroke="#b3a793" strokeWidth="1.2" />
        {/* Dua kardus buku pindahan */}
        <rect x="180" y="82" width="62" height="42" rx="2.5" fill="#b8844c" stroke="#7d552c" strokeWidth="1.8" />
        <rect x="190" y="56" width="44" height="26" rx="2.5" fill="#ca965c" stroke="#7d552c" strokeWidth="1.8" />
        <line x1="180" y1="95" x2="242" y2="95" stroke="#ead8b5" strokeWidth="3" />
        {/* Dua bungkus nasi goreng tek-tek & satu sendok plastik */}
        <polygon points="94,132 120,124 130,138 102,144" fill="#b97a45" />
        <polygon points="136,130 162,124 170,138 142,144" fill="#b97a45" />
        <line x1="124" y1="138" x2="142" y2="127" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="144" cy="126" rx="3.5" ry="2.3" fill="#ffffff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 170" className="h-full w-full">
      <rect width="280" height="170" fill="#131a2b" />
      <polygon points="84,82 140,46 196,82" fill="#7a4232" />
      <rect x="94" y="82" width="92" height="62" fill="#2d3442" />
      <rect x="108" y="96" width="26" height="22" rx="2" fill="#ffd27d" />
      <rect x="148" y="96" width="26" height="22" rx="2" fill="#ffbe5c" />
      <circle cx="52" cy="34" r="2" fill="#fff6d6" />
      <circle cx="226" cy="42" r="2" fill="#fff6d6" />
      <circle cx="190" cy="26" r="1.5" fill="#fff6d6" />
    </svg>
  );
};

/**
 * Buku Album Foto Keluarga Cetak Fisik di Meja Ruang Tamu Jl. Melati No. 14:
 * Membolak-balik halaman 2-sisi berisi foto kenangan lama & hasil jepretan Mode Foto [P]!
 */
export const FamilyPhotoAlbumModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isPhotoAlbumOpen);
  const setOpen = useGameStore((s) => s.setPhotoAlbumOpen);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const chapter = useGameStore((s) => s.chapter);
  const playerPhotos = useGameStore((s) => s.playerPhotos);
  const journalName = useGameStore((s) => s.journalName);
  const flags = useGameStore((s) => s.flags);
  const startDialogue = useGameStore((s) => s.startDialogue);
  const { isMobile, isCompactLandscape } = useMobileViewport();

  const [spreadIdx, setSpreadIdx] = useState(0);

  const pages = useMemo<AlbumPageItem[]>(() => {
    const captures: AlbumPageItem[] = playerPhotos.map((p) => ({
      id: p.id,
      kind: 'capture',
      title: p.locationName,
      dateLabel: p.timeLabel,
      locationLabel: p.locationName,
      caption: p.caption,
      dataUrl: p.dataUrl,
    }));
    const memories: AlbumPageItem[] = MEMORY_PHOTOS.filter((m) => m.chapterMin <= chapter).map((m) => ({
      id: m.id,
      kind: 'memory',
      title: m.title,
      dateLabel: m.dateLabel,
      locationLabel: m.locationLabel,
      caption: m.caption,
      theme: m.theme,
      flashbackDialogueId: m.flashbackDialogueId,
      flashbackFlag: m.flashbackFlag,
    }));
    return [...captures, ...memories];
  }, [playerPhotos, chapter]);

  const totalSpreads = Math.max(1, Math.ceil(pages.length / 2));
  const safeSpread = Math.min(spreadIdx, totalSpreads - 1);
  const leftItem = pages[safeSpread * 2] ?? null;
  const rightItem = pages[safeSpread * 2 + 1] ?? null;

  useEffect(() => {
    if (!isOpen) return;
    setSpreadIdx(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight') {
        setSpreadIdx((i) => {
          if (i + 1 < totalSpreads) {
            sfxEngine.play('page');
            return i + 1;
          }
          return i;
        });
      } else if (e.code === 'ArrowLeft') {
        setSpreadIdx((i) => {
          if (i > 0) {
            sfxEngine.play('page');
            return i - 1;
          }
          return i;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, totalSpreads]);

  if (!isOpen) return null;

  const compact = isMobile || isCompactLandscape;

  const renderPhotoCard = (item: AlbumPageItem | null, pageNum: number) => {
    if (!item) {
      return (
        <div
          className={`flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c9b99f] bg-[#f4ebda]/70 text-center ${
            compact ? 'p-3' : 'p-6'
          }`}
        >
          <Camera className={compact ? 'h-6 w-6 text-[#9c866d]' : 'h-8 w-8 text-[#9c866d]'} />
          <p className={`font-serif text-[#4d3f34] ${compact ? 'mt-1.5 text-sm' : 'mt-3 text-base'}`}>
            Halaman Kosong Menanti Kenangan
          </p>
          <p className={`mt-1 max-w-xs leading-relaxed text-[#7c6a58] ${compact ? 'text-[10.5px]' : 'text-xs'}`}>
            Ambil foto baru dengan Mode Foto agar langsung tertempel di album keluarga ini.
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setPhotoMode(true);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full bg-[#7a3e2c] font-semibold text-[#fdf8f0] transition hover:bg-[#914c37] ${
              compact ? 'mt-2.5 px-3 py-1.5 text-[11px]' : 'mt-4 px-4 py-2 text-xs'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>{compact ? 'Buka Mode Foto' : 'Buka Mode Foto [P]'}</span>
          </button>
          <span className="mt-auto pt-2 font-mono text-[10px] text-[#9b8974]">Hal. {pageNum}</span>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col justify-between">
        <div>
          {/* Label Jenis Foto */}
          <div
            className={`flex items-center justify-between font-semibold uppercase tracking-[0.16em] text-[#8a725a] ${
              compact ? 'mb-1.5 text-[9px]' : 'mb-2.5 text-[10px]'
            }`}
          >
            <span>{item.kind === 'capture' ? 'Jepretan Kamera' : 'Arsip Keluarga'}</span>
            <span>{item.dateLabel}</span>
          </div>

          {/* Foto Cetak dengan Sudut Penjepit Klasik (Photo Corners) */}
          <div className={`relative rounded-sm bg-[#fffdf9] shadow-md ring-1 ring-[#d8cab4] ${compact ? 'p-1.5' : 'p-2.5'}`}>
            <span className={`pointer-events-none absolute -top-1 -left-1 border-t-4 border-l-4 border-[#4d382c] ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`pointer-events-none absolute -top-1 -right-1 border-t-4 border-r-4 border-[#4d382c] ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`pointer-events-none absolute -bottom-1 -left-1 border-b-4 border-l-4 border-[#4d382c] ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`pointer-events-none absolute -bottom-1 -right-1 border-b-4 border-r-4 border-[#4d382c] ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />

            <div className={`w-full overflow-hidden rounded-[2px] bg-[#1e1b18] ${compact ? 'aspect-[16/9] max-h-[118px]' : 'aspect-[16/10]'}`}>
              {item.kind === 'capture' && item.dataUrl ? (
                <img src={item.dataUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <AlbumMemoryArt theme={item.theme ?? 'home_night'} />
              )}
            </div>
          </div>

          {/* Catatan Tangan di Bawah Foto */}
          <div className={`px-1 ${compact ? 'mt-2 space-y-0.5' : 'mt-4 space-y-1.5'}`}>
            <h3 className={`font-serif font-medium text-[#2c221b] ${compact ? 'text-sm leading-tight' : 'text-lg'}`}>
              {item.title}
            </h3>
            <p className={`flex items-center gap-1 text-[#7c6652] ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{item.locationLabel}</span>
            </p>
            <p className={`font-serif italic leading-snug text-[#4f4034] ${compact ? 'pt-0.5 text-[10.5px] line-clamp-2' : 'pt-1 text-xs leading-relaxed'}`}>
              "{item.caption}"
            </p>
            {item.flashbackDialogueId && (
              <button
                type="button"
                onClick={() => {
                  const fbId = item.flashbackDialogueId!;
                  setOpen(false);
                  startDialogue(fbId);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full bg-[#7a3e2c] font-semibold text-[#fdf8f0] shadow transition hover:bg-[#964f39] ${
                  compact ? 'mt-1.5 px-2.5 py-1 text-[10px]' : 'mt-2.5 px-3.5 py-1.5 text-[11px]'
                }`}
              >
                <Film className="h-3 w-3" />
                <span>
                  {item.flashbackFlag && flags.includes(item.flashbackFlag)
                    ? 'Putar Ulang Kilas Balik'
                    : 'Hidupkan Kilas Balik Sinematik'}
                </span>
              </button>
            )}
          </div>
        </div>

        <div
          className={`flex items-center justify-between border-t border-[#dfd1bc] text-[10px] text-[#8f7c66] ${
            compact ? 'mt-2 pt-1.5' : 'mt-4 pt-2.5'
          }`}
        >
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-[#b85a49]" /> Kel. Damar Pratama
          </span>
          <span className="font-mono">Hal. {pageNum}</span>
        </div>
      </div>
    );
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/85 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-2 border-[#7a4a33] bg-[#522d1f] shadow-2xl animate-fadeIn ${
            compact ? 'max-h-[95dvh] p-2' : 'max-h-[92vh] p-3 md:p-4'
          }`}
        >
          {/* Header Sampul Album */}
          <div className={`flex shrink-0 flex-wrap items-center justify-between gap-2 px-2 text-warm-50 ${compact ? 'mb-1.5' : 'mb-3'}`}>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 shrink-0 text-warm-300" />
              <div>
                <h2 className={`font-serif leading-tight ${compact ? 'text-sm' : 'text-lg'}`}>
                  Album Foto Keluarga · Jl. Melati No. 14
                </h2>
                <p className={`text-warm-200/70 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
                  {journalName} · {playerPhotos.length} foto kamera + {pages.length - playerPhotos.length} kenangan lama
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPhotoMode(true);
                }}
                className={`flex items-center gap-1.5 rounded-full border border-warm-300/35 bg-warm-400/15 text-warm-100 transition hover:bg-warm-400 hover:text-dusk-950 ${
                  compact ? 'px-2.5 py-1 text-[10.5px]' : 'px-3 py-1.5 text-xs'
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>{compact ? 'Mode Foto' : 'Tambah Foto [P]'}</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-warm-200/80 hover:bg-white/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Lembaran Kertas Album 2 Halaman (tetap 2 halaman terbuka berdampingan di layar HP mendatar!) */}
          <div
            className={`relative min-h-0 flex-1 overflow-y-auto subtle-scroll rounded-xl bg-[#f7efe0] shadow-inner ${
              compact
                ? 'grid grid-cols-2 gap-4 p-3'
                : 'grid grid-cols-1 gap-4 p-5 md:grid-cols-2 md:gap-8 md:p-7'
            }`}
          >
            {/* Bayangan Lipatan Tengah Buku */}
            <div
              className={`pointer-events-none absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#bfa88a]/35 to-transparent ${
                compact ? 'block' : 'hidden md:block'
              }`}
            />

            <div className={compact ? 'min-h-0' : 'min-h-[340px]'}>{renderPhotoCard(leftItem, safeSpread * 2 + 1)}</div>
            <div className={compact ? 'min-h-0' : 'min-h-[340px]'}>{renderPhotoCard(rightItem, safeSpread * 2 + 2)}</div>
          </div>

          {/* Navigasi Balik Halaman */}
          <div className={`flex shrink-0 items-center justify-between px-2 text-warm-100 ${compact ? 'mt-1.5 text-[11px]' : 'mt-3 text-xs'}`}>
            <button
              type="button"
              disabled={safeSpread === 0}
              onClick={() => {
                sfxEngine.play('page');
                setSpreadIdx((i) => Math.max(0, i - 1));
              }}
              className={`flex items-center gap-1 rounded-full border border-warm-200/25 bg-black/25 transition hover:bg-black/45 disabled:opacity-35 ${
                compact ? 'px-3 py-1' : 'px-4 py-2'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{compact ? 'Sebelumnya' : 'Halaman Sebelumnya'}</span>
            </button>

            <span className="font-serif italic text-warm-200/80">
              {compact
                ? `Lembar ${safeSpread + 1} / ${totalSpreads}`
                : `Lembar ${safeSpread + 1} dari ${totalSpreads} · Gunakan tombol panah kiri / kanan`}
            </span>

            <button
              type="button"
              disabled={safeSpread + 1 >= totalSpreads}
              onClick={() => {
                sfxEngine.play('page');
                setSpreadIdx((i) => Math.min(totalSpreads - 1, i + 1));
              }}
              className={`flex items-center gap-1 rounded-full border border-warm-200/25 bg-black/25 transition hover:bg-black/45 disabled:opacity-35 ${
                compact ? 'px-3 py-1' : 'px-4 py-2'
              }`}
            >
              <span>{compact ? 'Berikutnya' : 'Halaman Berikutnya'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
