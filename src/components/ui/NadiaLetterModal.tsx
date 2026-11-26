import React, { useMemo, useState } from 'react';
import { Feather, Heart, MailOpen, Music, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import { buildNadiaFinalLetter } from '../../data/pulangSongAndLetter';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

const LETTER_RESPONSES = [
  {
    id: 'resp_front_row',
    label: '"Terima kasih sudah tetap duduk di barisan paling depan, Nad."',
    whisper: 'Aku melipat surat ini rapi dan menyimpannya di saku kemeja—tepat di samping pick gitar lamaku.',
    effects: { kejujuranDiri: 2, kehadiranKeluarga: 2 },
  },
  {
    id: 'resp_home_now',
    label: '"Aku sudah pulang, Nad—dan kali ini aku tidak pergi ke mana-mana lagi."',
    whisper: 'Untuk pertama kalinya setelah sekian lama, kata "rumah" tidak lagi terdengar seperti tanggung jawab yang berat, melainkan pelukan.',
    effects: { kehadiranKeluarga: 3, kejujuranDiri: 1 },
  },
  {
    id: 'resp_tomorrow_kira',
    label: '"Besok pagi kita bikin perahu kertas & ajarin Kira naik sepeda bareng."',
    whisper: 'Aku mengambil pena di meja makan dan menuliskan balasan kecil itu di sudut kertas surat Nadia sebelum menyelipkannya di dekat gelas tehnya.',
    effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
  },
] as const;

/**
 * Modal Surat Tulisan Tangan Nadia di Meja Makan Jl. Melati No. 14.
 * Isi paragrafnya berubah secara dinamis mengikuti pilihan cerita, kilas balik, & ending pemain.
 */
export const NadiaLetterModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isNadiaLetterOpen);
  const setOpen = useGameStore((s) => s.setNadiaLetterOpen);
  const setGuitarOpen = useGameStore((s) => s.setGuitarOpen);
  const chapter = useGameStore((s) => s.chapter);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const activeEnding = useGameStore((s) => s.activeEnding);
  const emotions = useGameStore((s) => s.emotions);
  const flags = useGameStore((s) => s.flags);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const applyEffect = useGameStore((s) => s.applyEffect);
  const showToast = useGameStore((s) => s.showToast);

  const [unfolded, setUnfolded] = useState(false);
  const [chosenWhisper, setChosenWhisper] = useState<string | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  const letter = useMemo(
    () =>
      buildNadiaFinalLetter({
        chapter,
        timeOfDay,
        activeEnding,
        emotions,
        flags,
        sideQuests,
        discoveredEasterEggs,
      }),
    [chapter, timeOfDay, activeEnding, emotions, flags, sideQuests, discoveredEasterEggs],
  );

  if (!isOpen) return null;

  const alreadySaved = flags.includes('read_nadia_table_letter');

  const handleClose = () => {
    voiceManager.stop();
    setIsReadingAloud(false);
    setUnfolded(false);
    setChosenWhisper(null);
    setOpen(false);
  };

  const handleUnfold = () => {
    sfxEngine.play('page');
    setUnfolded(true);
  };

  const handleToggleVoice = () => {
    if (isReadingAloud) {
      voiceManager.stop();
      setIsReadingAloud(false);
      return;
    }
    setIsReadingAloud(true);
    voiceManager.speak('nadia_table_letter', 'nadia', letter.voiceSummary);
  };

  const handleChooseResponse = (resp: (typeof LETTER_RESPONSES)[number]) => {
    sfxEngine.playMemoryChime();
    setChosenWhisper(resp.whisper);
    if (!alreadySaved) {
      applyEffect({
        ...resp.effects,
        setFlags: ['read_nadia_table_letter'],
        journalEntry: {
          id: 'je_nadia_table_letter',
          title: 'Sepucuk Surat Nadia di Meja Makan',
          body: `Di atas meja makan Jl. Melati No. 14, aku membaca surat tulisan tangan Nadia yang ia tinggalkan untukku. Dalam hati aku membalas: ${resp.label}`,
          chapter,
        },
      });
      showToast('Surat Nadia tersimpan hangat dalam catatan harian Damar.');
    } else {
      showToast('Balasan hatimu terucap pelan di ruang makan Jl. Melati.');
    }
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[10000] flex items-center justify-center bg-[#09080c]/88 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4 md:p-6'
        }`}
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-2xl border border-amber-300/30 bg-[#1a1410] text-[#2f241c] shadow-[0_30px_85px_rgba(0,0,0,0.85)] animate-fadeIn ${
            compact ? 'max-w-3xl' : 'max-w-2xl'
          }`}
        >
          {/* Header Kayu Meja Makan */}
          <div className={`flex shrink-0 items-center justify-between border-b border-amber-200/15 bg-[#231913] text-warm-50 ${compact ? 'px-4 py-2' : 'px-6 py-3.5'}`}>
            <div className="flex items-center gap-2.5">
              <MailOpen className="h-4 w-4 text-amber-300" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300/80">
                  {letter.moodLabel}
                </p>
                <h2 className={`font-serif text-warm-50 ${compact ? 'text-sm' : 'text-base'}`}>
                  Sepucuk Surat di Meja Makan
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unfolded && (
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/35 bg-amber-400/15 px-3 py-1 text-[11px] font-medium text-amber-100 transition hover:bg-amber-400/25"
                >
                  {isReadingAloud ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isReadingAloud ? 'Hentikan Suara' : 'Dengar Suara Nadia'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1.5 text-warm-200/70 hover:bg-white/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Konten Amplop Terlipat ATAU Lembar Surat Kertas Krem Hangat */}
          <div className={`flex-1 overflow-y-auto subtle-scroll ${compact ? 'p-3.5' : 'p-6 md:p-8'}`}>
            {!unfolded ? (
              <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border-2 border-[#d4c2a3] bg-gradient-to-b from-[#f7efe0] to-[#ecdec4] p-7 text-center shadow-xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#a84e3d]/40 bg-[#9b4434] text-[#fdf6ea] shadow-md">
                  <Heart className="h-6 w-6 fill-current" />
                </div>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8a6f55]">
                  {letter.dateLine}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-medium text-[#2c2017]">
                  Untuk Mas Damar
                </h3>
                <p className="mt-2 font-serif text-xs italic leading-relaxed text-[#6b5542]">
                  Amplop krem beraroma bunga melati ini diletakkan rapi di samping gelas teh hangat di meja makan. Isinya ditulis khusus untuk perjalananmu hari ini.
                </p>
                <button
                  type="button"
                  onClick={handleUnfold}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7c3d2b] px-6 py-2.5 text-xs font-semibold text-[#fdf8f0] shadow-lg transition hover:bg-[#964b36]"
                >
                  <MailOpen className="h-4 w-4" />
                  <span>Buka Lipatan Surat Nadia</span>
                </button>
              </div>
            ) : (
              <div
                className={`relative mx-auto rounded-xl border border-[#d6c4a5] bg-[#faf3e5] shadow-inner animate-fadeIn ${
                  compact ? 'p-4' : 'p-6 md:p-8'
                }`}
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(transparent, transparent 27px, rgba(168, 145, 115, 0.14) 28px)',
                }}
              >
                {/* Watermark bunga melati halus di pojok kanan atas kertas */}
                <svg
                  viewBox="0 0 80 80"
                  className="pointer-events-none absolute right-4 top-4 h-16 w-16 opacity-20"
                  fill="none"
                  stroke="#9b6e49"
                  strokeWidth="1.4"
                >
                  <circle cx="40" cy="40" r="5" />
                  <ellipse cx="40" cy="24" rx="6" ry="10" />
                  <ellipse cx="40" cy="56" rx="6" ry="10" />
                  <ellipse cx="24" cy="40" rx="10" ry="6" />
                  <ellipse cx="56" cy="40" rx="10" ry="6" />
                </svg>

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8d745a]">
                  {letter.dateLine}
                </p>
                <h3 className="mt-2 font-serif text-xl font-medium italic text-[#2c1f16]">
                  {letter.salutation}
                </h3>

                <div className={`mt-4 space-y-3.5 font-serif leading-relaxed text-[#3a2c22] ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
                  {letter.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#d8c7ab] pt-3.5">
                  <p className="font-serif text-sm font-medium italic text-[#6d3929]">
                    {letter.signature}
                  </p>
                  <p className="mt-1.5 font-serif text-xs italic text-[#7a624c]">
                    {letter.postscript}
                  </p>
                </div>

                {/* Balasan Dalam Hati Damar */}
                <div className="mt-5 rounded-xl border border-[#d6c2a2] bg-[#f1e5ce]/85 p-3.5">
                  {chosenWhisper ? (
                    <div className="space-y-2 animate-fadeIn">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#7c3d2b]">
                        <Sparkles className="h-3.5 w-3.5" /> Bisikan Hati Damar
                      </p>
                      <p className="font-serif text-xs italic leading-relaxed text-[#3a2a1e]">
                        “{chosenWhisper}”
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#7c4d32]">
                        <Feather className="h-3.5 w-3.5" /> Balas dalam Hati / Tulis di Sudut Surat:
                      </p>
                      <div className="space-y-1.5">
                        {LETTER_RESPONSES.map((resp) => (
                          <button
                            key={resp.id}
                            type="button"
                            onClick={() => handleChooseResponse(resp)}
                            className="w-full rounded-lg border border-[#cfb895] bg-[#faf4e8] px-3 py-2 text-left font-serif text-xs text-[#3b2b20] transition hover:border-[#8e4631] hover:bg-[#fffaf0]"
                          >
                            {resp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Lanjut ke Konser Mini Track 4 */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      voiceManager.stop();
                      setUnfolded(false);
                      setChosenWhisper(null);
                      setOpen(false);
                      sfxEngine.playGuitarChord(0);
                      setGuitarOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#8e4631]/40 bg-[#7c3d2b]/10 px-4 py-2 text-xs font-semibold text-[#6e311f] transition hover:bg-[#7c3d2b] hover:text-[#fdf8f0]"
                  >
                    <Music className="h-3.5 w-3.5" />
                    <span>Mainkan Konser Mini "Track 4 — Pulang"</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full bg-[#382a20] px-5 py-2 text-xs font-semibold text-[#faf3e5] transition hover:bg-[#4c392c]"
                  >
                    Lipat &amp; Simpan Surat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
