import React, { useEffect, useState } from 'react';
import { CheckCircle2, Mail, MailOpen, Sparkles, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { HOME_MAILBOX_LETTERS } from '../../data/homeMailboxData';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const KIND_BADGE: Record<
  'postcard' | 'letter' | 'invitation' | 'notice',
  { label: string; style: string }
> = {
  postcard: { label: 'Kartu Pos', style: 'bg-emerald-800/12 text-emerald-900 border-emerald-700/25' },
  invitation: { label: 'Undangan', style: 'bg-amber-800/12 text-amber-950 border-amber-700/25' },
  notice: { label: 'Info RT', style: 'bg-sky-800/12 text-sky-950 border-sky-700/25' },
  letter: { label: 'Surat Tetangga', style: 'bg-rose-800/12 text-rose-950 border-rose-700/25' },
};

/**
 * Modal Kotak Surat Pagar Rumah Jl. Melati No. 14:
 * Membaca kartu pos & surat hangat dari keluarga di Bandung, Bima, Pak RT 04, dan Bu Wati.
 */
export const MailboxModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isMailboxOpen);
  const setOpen = useGameStore((s) => s.setMailboxOpen);
  const readMailIds = useGameStore((s) => s.readMailIds);
  const markMailRead = useGameStore((s) => s.markMailRead);

  const [selectedId, setSelectedId] = useState(HOME_MAILBOX_LETTERS[0].id);

  useEffect(() => {
    if (isOpen) {
      markMailRead(selectedId);
    }
  }, [isOpen, selectedId, markMailRead]);

  if (!isOpen) return null;

  const activeLetter =
    HOME_MAILBOX_LETTERS.find((m) => m.id === selectedId) ?? HOME_MAILBOX_LETTERS[0];
  const unreadCount = HOME_MAILBOX_LETTERS.filter((m) => !readMailIds.includes(m.id)).length;
  const kindInfo = KIND_BADGE[activeLetter.kind];

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/84 p-4 backdrop-blur-md"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#c9bba3] bg-[#efe7d8] text-[#28211b] shadow-2xl animate-fadeIn"
        >
          {/* Header Kotak Surat Pagar */}
          <div className="flex items-center justify-between border-b border-[#b9a88d] bg-gradient-to-r from-[#1f4d3a] to-[#275c46] px-6 py-4 text-[#faf5ea]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8c97e]/40 bg-[#153628] text-[#f0cf82]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#cbe4d6]">
                  Kotak Surat Pagar · Jl. Melati No. 14
                </p>
                <h2 className="font-serif text-xl font-semibold text-[#fff9ed]">
                  Surat &amp; Kartu Pos Keluarga Pratama
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#e8c97e]/35 bg-[#153628]/80 px-3 py-1 text-[11px] font-medium text-[#f4dea8] sm:inline-flex">
                {unreadCount > 0 ? `${unreadCount} surat belum dibaca` : 'Semua surat sudah dibaca'}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-[#d7ebe0] hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Isi Kotak Surat: Daftar Amplop Kiri + Lembar Surat Terbuka Kanan */}
          <div className="grid flex-1 grid-cols-1 overflow-y-auto subtle-scroll md:grid-cols-12">
            {/* Daftar 4 Surat */}
            <div className="border-b border-[#d4c7b0] bg-[#e6dcc9] p-4 md:col-span-4 md:border-r md:border-b-0">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6a5b4a]">
                Tumpukan Surat ({HOME_MAILBOX_LETTERS.length})
              </p>
              <div className="space-y-2.5">
                {HOME_MAILBOX_LETTERS.map((letter) => {
                  const selected = letter.id === activeLetter.id;
                  const isRead = readMailIds.includes(letter.id);
                  const badge = KIND_BADGE[letter.kind];
                  return (
                    <button
                      key={letter.id}
                      type="button"
                      onClick={() => {
                        sfxEngine.play('page');
                        setSelectedId(letter.id);
                        markMailRead(letter.id);
                      }}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        selected
                          ? 'border-[#1f4d3a] bg-[#fdfaf2] shadow-sm'
                          : 'border-[#c8baa1]/75 bg-[#f4ede0]/75 hover:bg-[#fdfaf2]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge.style}`}
                        >
                          {badge.label}
                        </span>
                        {isRead ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700/75" />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                        )}
                      </div>
                      <p className="mt-1.5 text-xs font-bold text-[#1f3d2f]">{letter.senderName}</p>
                      <p className="mt-0.5 line-clamp-2 font-serif text-sm font-medium leading-snug text-[#2c241d]">
                        {letter.subject}
                      </p>
                      <p className="mt-1 text-[10px] text-[#756554]">{letter.dateLabel}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Area Baca Lembar Surat / Kartu Pos */}
            <div className="p-5 md:col-span-8 md:p-7">
              <div
                style={{ backgroundColor: activeLetter.paperTint }}
                className="relative rounded-xl border border-[#cfc1a8] p-5 shadow-md md:p-7"
              >
                {/* Prangko & Cap Pos di Sudut Kanan Atas */}
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-dashed border-[#c7b89c] pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${kindInfo.style}`}
                      >
                        <MailOpen className="h-3 w-3" />
                        {kindInfo.label}
                      </span>
                      <span className="text-[11px] font-medium text-[#70604f]">
                        {activeLetter.dateLabel}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-[#1f1914] md:text-2xl">
                      {activeLetter.subject}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#5e5041]">
                      Dari: <span className="font-semibold text-[#2a221b]">{activeLetter.senderName}</span> ·{' '}
                      {activeLetter.senderOrigin}
                    </p>
                  </div>

                  {/* Prangko Pos Bergaya Indonesia */}
                  <div
                    style={{ borderColor: activeLetter.stampColor }}
                    className="hidden shrink-0 flex-col items-center justify-center rounded border-2 border-dashed bg-white/85 px-2.5 py-2 text-center shadow-sm sm:flex"
                  >
                    <span
                      style={{ backgroundColor: activeLetter.stampColor }}
                      className="rounded px-2 py-0.5 text-[9px] font-bold tracking-wider text-white"
                    >
                      {activeLetter.stampTitle}
                    </span>
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-[#6b5d4d]">
                      Jl. Melati 14
                    </span>
                  </div>
                </div>

                {/* Isi Surat */}
                <p className="font-serif text-sm font-semibold text-[#2d241c]">
                  {activeLetter.greeting}
                </p>

                <div className="mt-3 space-y-3 font-serif text-[14.5px] leading-relaxed text-[#322921]">
                  {activeLetter.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <p className="mt-5 whitespace-pre-line font-serif text-sm font-semibold italic text-[#3b2f24]">
                  {activeLetter.signOff}
                </p>
              </div>

              {/* Catatan Batin Damar */}
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#cbbba0] bg-[#e6dbc7]/80 px-4 py-3 text-xs leading-relaxed text-[#463a2e]">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#9c5a24]" />
                <p className="italic">"{activeLetter.damarReflection}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
