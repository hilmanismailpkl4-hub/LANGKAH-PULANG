import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Camera, ChevronLeft, ChevronRight, Heart, MapPin, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { MEMORY_PHOTOS, MemoryPhotoItem } from '../../data/phoneContent';
import { useGameStore } from '../../store/useGameStore';
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

  const renderPhotoCard = (item: AlbumPageItem | null, pageNum: number) => {
    if (!item) {
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#c9b99f] bg-[#f4ebda]/70 p-6 text-center">
          <Camera className="h-8 w-8 text-[#9c866d]" />
          <p className="mt-3 font-serif text-base text-[#4d3f34]">Halaman Kosong Menanti Kenangan</p>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#7c6a58]">
            Ambil foto baru dengan Mode Foto [P] (beserta filter film & bingkai Polaroid) agar langsung tertempel di album keluarga ini.
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setPhotoMode(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#7a3e2c] px-4 py-2 text-xs font-semibold text-[#fdf8f0] transition hover:bg-[#914c37]"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Buka Mode Foto [P]</span>
          </button>
          <span className="mt-auto pt-4 font-mono text-[10px] text-[#9b8974]">Hal. {pageNum}</span>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col justify-between">
        <div>
          {/* Label Jenis Foto */}
          <div className="mb-2.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a725a]">
            <span>{item.kind === 'capture' ? 'Jepretan Kamera Damar' : 'Arsip Foto Keluarga'}</span>
            <span>{item.dateLabel}</span>
          </div>

          {/* Foto Cetak dengan Sudut Penjepit Klasik (Photo Corners) */}
          <div className="relative rounded-sm bg-[#fffdf9] p-2.5 shadow-md ring-1 ring-[#d8cab4]">
            <span className="pointer-events-none absolute -top-1 -left-1 h-4 w-4 border-t-4 border-l-4 border-[#4d382c]" />
            <span className="pointer-events-none absolute -top-1 -right-1 h-4 w-4 border-t-4 border-r-4 border-[#4d382c]" />
            <span className="pointer-events-none absolute -bottom-1 -left-1 h-4 w-4 border-b-4 border-l-4 border-[#4d382c]" />
            <span className="pointer-events-none absolute -bottom-1 -right-1 h-4 w-4 border-b-4 border-r-4 border-[#4d382c]" />

            <div className="aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-[#1e1b18]">
              {item.kind === 'capture' && item.dataUrl ? (
                <img src={item.dataUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <AlbumMemoryArt theme={item.theme ?? 'home_night'} />
              )}
            </div>
          </div>

          {/* Catatan Tangan di Bawah Foto */}
          <div className="mt-4 space-y-1.5 px-1">
            <h3 className="font-serif text-lg font-medium text-[#2c221b]">{item.title}</h3>
            <p className="flex items-center gap-1 text-[11px] text-[#7c6652]">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>{item.locationLabel}</span>
            </p>
            <p className="pt-1 font-serif italic text-xs leading-relaxed text-[#4f4034]">
              "{item.caption}"
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#dfd1bc] pt-2.5 text-[10px] text-[#8f7c66]">
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
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/85 p-4 backdrop-blur-md"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl overflow-hidden rounded-2xl border-2 border-[#7a4a33] bg-[#522d1f] p-3 md:p-4 shadow-2xl animate-fadeIn"
        >
          {/* Header Sampul Album */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-warm-50">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-warm-300" />
              <div>
                <h2 className="font-serif text-lg leading-tight">Album Foto Keluarga · Jl. Melati No. 14</h2>
                <p className="text-[11px] text-warm-200/70">
                  {journalName} · {playerPhotos.length} foto kamera + {pages.length - playerPhotos.length} kenangan lama
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPhotoMode(true);
                }}
                className="flex items-center gap-1.5 rounded-full border border-warm-300/35 bg-warm-400/15 px-3 py-1.5 text-xs text-warm-100 transition hover:bg-warm-400 hover:text-dusk-950"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Tambah Foto [P]</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-warm-200/80 hover:bg-white/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Lembaran Kertas Album 2 Halaman */}
          <div className="relative grid grid-cols-1 gap-4 rounded-xl bg-[#f7efe0] p-5 shadow-inner md:grid-cols-2 md:gap-8 md:p-7">
            {/* Bayangan Lipatan Tengah Buku */}
            <div className="pointer-events-none hidden md:block absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#bfa88a]/35 to-transparent" />

            <div className="min-h-[340px]">{renderPhotoCard(leftItem, safeSpread * 2 + 1)}</div>
            <div className="min-h-[340px]">{renderPhotoCard(rightItem, safeSpread * 2 + 2)}</div>
          </div>

          {/* Navigasi Balik Halaman */}
          <div className="mt-3 flex items-center justify-between px-2 text-xs text-warm-100">
            <button
              type="button"
              disabled={safeSpread === 0}
              onClick={() => {
                sfxEngine.play('page');
                setSpreadIdx((i) => Math.max(0, i - 1));
              }}
              className="flex items-center gap-1.5 rounded-full border border-warm-200/25 bg-black/25 px-4 py-2 transition hover:bg-black/45 disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Halaman Sebelumnya</span>
            </button>

            <span className="font-serif italic text-warm-200/80">
              Lembar {safeSpread + 1} dari {totalSpreads} · Gunakan tombol panah kiri / kanan
            </span>

            <button
              type="button"
              disabled={safeSpread + 1 >= totalSpreads}
              onClick={() => {
                sfxEngine.play('page');
                setSpreadIdx((i) => Math.min(totalSpreads - 1, i + 1));
              }}
              className="flex items-center gap-1.5 rounded-full border border-warm-200/25 bg-black/25 px-4 py-2 transition hover:bg-black/45 disabled:opacity-35"
            >
              <span>Halaman Berikutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
