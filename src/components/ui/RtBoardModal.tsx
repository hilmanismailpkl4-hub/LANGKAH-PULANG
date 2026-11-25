import React from 'react';
import { ClipboardList, MapPin, Pin, X } from 'lucide-react';
import { RT_BOARD_NOTICES } from '../../data/rooftopAndRtData';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

/**
 * Modal Papan Pengumuman RT 04 / RW 02 Perumahan Melati:
 * Menampilkan 5 selebaran & catatan ramah warga yang ditempel di papan gabus RT.
 */
export const RtBoardModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isRtBoardOpen);
  const setOpen = useGameStore((s) => s.setRtBoardOpen);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/84 p-4 backdrop-blur-md"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-4 border-[#6e472b] bg-[#c79d6e] text-[#282018] shadow-2xl animate-fadeIn"
        >
          {/* Header Papan Pengumuman RT */}
          <div className="flex items-center justify-between border-b-2 border-[#59371e] bg-gradient-to-r from-[#14532d] to-[#1e6a3d] px-6 py-4 text-[#fefce8]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/40 bg-[#0d381e] text-amber-300">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                  Papan Pengumuman Resmi · Perumahan Melati
                </p>
                <h2 className="font-serif text-xl font-bold text-[#fffbeb]">
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

          {/* Permukaan Papan Gabus Berisi 5 Selebaran Tertempel */}
          <div className="flex-1 overflow-y-auto subtle-scroll p-5 md:p-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {RT_BOARD_NOTICES.map((notice) => (
                <article
                  key={notice.id}
                  style={{
                    backgroundColor: notice.paperColor,
                    transform: `rotate(${notice.tiltDeg}deg)`,
                  }}
                  className="relative flex flex-col justify-between rounded-sm border border-black/15 p-5 shadow-lg transition hover:scale-[1.015] hover:shadow-xl"
                >
                  {/* Pin Paku Payung Warna-Warni di Tengah Atas */}
                  <span
                    style={{ backgroundColor: notice.pinColor }}
                    className="absolute -top-2.5 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full shadow-md ring-2 ring-white/85"
                  >
                    <Pin className="h-2.5 w-2.5 text-white" />
                  </span>

                  <div>
                    <div className="flex items-center justify-between gap-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      <span>{notice.category}</span>
                      <span>{notice.dateLabel}</span>
                    </div>
                    <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug text-slate-900">
                      {notice.title}
                    </h3>
                    <p className="mt-2.5 whitespace-pre-line text-xs leading-relaxed text-slate-800">
                      {notice.body}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-2.5 text-[10.5px] text-slate-600">
                    <span className="font-semibold">— {notice.author}</span>
                    <span className="italic">{notice.footer}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#7a5233] bg-[#b58a5c] px-6 py-2.5 text-[11px] font-medium text-[#2c1d10]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Gang Utama Perumahan Melati · RT 04 / RW 02
            </span>
            <span>Tekan [Esc] untuk menutup papan</span>
          </div>
        </div>
      </div>
    </Portal>
  );
};
