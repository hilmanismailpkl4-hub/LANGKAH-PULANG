import React from 'react';
import { ClipboardList, MapPin, Pin, X } from 'lucide-react';
import { RT_BOARD_NOTICES } from '../../data/rooftopAndRtData';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

/**
 * Modal Papan Pengumuman RT 04 / RW 02 Perumahan Melati:
 * Menampilkan 5 selebaran & catatan ramah warga yang ditempel di papan gabus RT.
 */
export const RtBoardModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isRtBoardOpen);
  const setOpen = useGameStore((s) => s.setRtBoardOpen);
  const { isMobile, isCompactLandscape } = useMobileViewport();

  if (!isOpen) return null;

  const compact = isMobile || isCompactLandscape;

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/84 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-4 border-[#6e472b] bg-[#c79d6e] text-[#282018] shadow-2xl animate-fadeIn ${
            compact ? 'max-h-[94dvh]' : 'max-h-[88vh]'
          }`}
        >
          {/* Header Papan Pengumuman RT */}
          <div
            className={`flex shrink-0 items-center justify-between border-b-2 border-[#59371e] bg-gradient-to-r from-[#14532d] to-[#1e6a3d] text-[#fefce8] ${
              compact ? 'px-4 py-2' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl border border-amber-300/40 bg-[#0d381e] text-amber-300 ${
                  compact ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                <ClipboardList className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </div>
              <div>
                {!compact && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                    Papan Pengumuman Resmi · Perumahan Melati
                  </p>
                )}
                <h2 className={`font-serif font-bold text-[#fffbeb] ${compact ? 'text-base leading-tight' : 'text-xl'}`}>
                  Info Warga RT 04 / RW 02 Melati
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-emerald-100 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Permukaan Papan Gabus Berisi 5 Selebaran Tertempel (selalu 2 kolom rapi di layar HP mendatar!) */}
          <div className={`min-h-0 flex-1 overflow-y-auto subtle-scroll ${compact ? 'p-3.5' : 'p-5 md:p-6'}`}>
            <div className={compact ? 'grid grid-cols-2 gap-3.5' : 'grid grid-cols-1 gap-5 md:grid-cols-2'}>
              {RT_BOARD_NOTICES.map((notice) => (
                <article
                  key={notice.id}
                  style={{
                    backgroundColor: notice.paperColor,
                    transform: `rotate(${compact ? notice.tiltDeg * 0.65 : notice.tiltDeg}deg)`,
                  }}
                  className={`relative flex flex-col justify-between rounded-sm border border-black/15 shadow-lg transition hover:scale-[1.015] hover:shadow-xl ${
                    compact ? 'p-3' : 'p-5'
                  }`}
                >
                  {/* Pin Paku Payung Warna-Warni di Tengah Atas */}
                  <span
                    style={{ backgroundColor: notice.pinColor }}
                    className={`absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full shadow-md ring-2 ring-white/85 ${
                      compact ? '-top-2 h-4 w-4' : '-top-2.5 h-5 w-5'
                    }`}
                  >
                    <Pin className={compact ? 'h-2 w-2 text-white' : 'h-2.5 w-2.5 text-white'} />
                  </span>

                  <div>
                    <div
                      className={`flex items-center justify-between gap-2 pt-1 font-bold uppercase tracking-wider text-slate-600 ${
                        compact ? 'text-[9px]' : 'text-[10px]'
                      }`}
                    >
                      <span>{notice.category}</span>
                      <span>{notice.dateLabel}</span>
                    </div>
                    <h3
                      className={`font-serif font-bold leading-snug text-slate-900 ${
                        compact ? 'mt-1 text-sm' : 'mt-1.5 text-lg'
                      }`}
                    >
                      {notice.title}
                    </h3>
                    <p
                      className={`whitespace-pre-line leading-relaxed text-slate-800 ${
                        compact ? 'mt-1.5 text-[11px]' : 'mt-2.5 text-xs'
                      }`}
                    >
                      {notice.body}
                    </p>
                  </div>

                  <div
                    className={`flex flex-wrap items-center justify-between gap-1.5 border-t border-black/10 text-slate-600 ${
                      compact ? 'mt-2.5 pt-1.5 text-[9.5px]' : 'mt-4 pt-2.5 text-[10.5px]'
                    }`}
                  >
                    <span className="font-semibold">— {notice.author}</span>
                    <span className="italic">{notice.footer}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`flex shrink-0 items-center justify-between border-t border-[#7a5233] bg-[#b58a5c] font-medium text-[#2c1d10] ${
              compact ? 'px-4 py-1.5 text-[10px]' : 'px-6 py-2.5 text-[11px]'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Gang Utama Perumahan Melati · RT 04 / RW 02
            </span>
            <span>{compact ? 'Ketuk luar area untuk menutup' : 'Tekan [Esc] untuk menutup papan'}</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
