import React, { useState } from 'react';
import { Heart, Pin, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { FridgeNoteColor } from '../../types/game';
import { Portal } from './Portal';

const QUICK_MESSAGES = [
  'Sore ini aku pulang lebih awal, kita jajan martabak bareng di tepi sungai ya!',
  'Terima kasih sudah selalu menunggu dan menghangatkan rumah, Nad ❤️',
  'Besok Minggu kita main gitar sama kasih makan merpati di taman, Kira!',
];

const COLOR_STYLES: Record<
  FridgeNoteColor,
  { card: string; dot: string; label: string }
> = {
  yellow: {
    card: 'bg-[#fef3c7] border-[#f5d782] text-[#3b2f1e]',
    dot: 'bg-[#fbbf24]',
    label: 'Kuning Mentega',
  },
  pink: {
    card: 'bg-[#fce7f3] border-[#f6b8d9] text-[#3d2130]',
    dot: 'bg-[#f472b6]',
    label: 'Merah Muda',
  },
  mint: {
    card: 'bg-[#d1fae5] border-[#8ee5be] text-[#1c382c]',
    dot: 'bg-[#34d399]',
    label: 'Hijau Mint',
  },
  sky: {
    card: 'bg-[#e0f2fe] border-[#9fd4f8] text-[#1a3147]',
    dot: 'bg-[#38bdf8]',
    label: 'Biru Langit',
  },
};

const AUTHOR_META = {
  damar: { label: 'Damar (Ayah)', magnet: 'bg-blue-600' },
  nadia: { label: 'Nadia (Bunda)', magnet: 'bg-rose-500' },
  kira: { label: 'Kira', magnet: 'bg-amber-500' },
};

/**
 * Papan Catatan Magnet Pintu Kulkas Rumah Jl. Melati No. 14:
 * Damar dapat menempel pesan hangat yang tersimpan & langsung mendapat balasan catatan dari Nadia atau Kira.
 */
export const FridgeNotesModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isFridgeNotesOpen);
  const setOpen = useGameStore((s) => s.setFridgeNotesOpen);
  const fridgeNotes = useGameStore((s) => s.fridgeNotes);
  const addFridgeNote = useGameStore((s) => s.addFridgeNote);
  const deleteFridgeNote = useGameStore((s) => s.deleteFridgeNote);

  const [input, setInput] = useState('');
  const [selectedColor, setSelectedColor] = useState<FridgeNoteColor>('yellow');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = input.trim();
    if (!clean) return;
    addFridgeNote(clean, selectedColor);
    setInput('');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 backdrop-blur-md"
        onClick={() => setOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-300/30 bg-[#dde4ec] text-slate-900 shadow-2xl animate-fadeIn"
        >
          {/* Header Pintu Kulkas */}
          <div className="flex items-center justify-between border-b border-slate-300/80 bg-gradient-to-r from-[#cfd8e3] to-[#e4eaf1] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
                <Pin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Pintu Kulkas · Rumah Jl. Melati No. 14
                </p>
                <h2 className="font-serif text-xl font-semibold text-slate-800">
                  Papan Catatan Magnet Keluarga
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-900/10 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Permukaan Pintu Kulkas berisi Catatan Tempel */}
          <div className="flex-1 overflow-y-auto subtle-scroll p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {fridgeNotes.map((note) => {
                const style = COLOR_STYLES[note.color] ?? COLOR_STYLES.yellow;
                const author = AUTHOR_META[note.author];
                return (
                  <div
                    key={note.id}
                    style={{ transform: `rotate(${note.tiltDeg}deg)` }}
                    className={`relative flex min-h-[146px] flex-col justify-between rounded-sm border p-4 shadow-md transition hover:scale-[1.02] hover:shadow-lg ${style.card}`}
                  >
                    {/* Magnet Bulat di Tengah Atas */}
                    <span
                      className={`absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full shadow ring-2 ring-white/80 ${author.magnet}`}
                    />

                    <div className="flex items-center justify-between gap-2 pt-1 text-[10px] font-bold uppercase tracking-wider opacity-70">
                      <span>{author.label}</span>
                      <span>{note.createdAt}</span>
                    </div>

                    <p className="my-2.5 font-serif text-sm leading-relaxed">
                      "{note.text}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] opacity-60">
                      <span className="flex items-center gap-1">
                        <Heart className="h-2.5 w-2.5 fill-current" /> Jl. Melati 14
                      </span>
                      {note.author === 'damar' && (
                        <button
                          type="button"
                          onClick={() => deleteFridgeNote(note.id)}
                          className="rounded p-1 hover:bg-black/10"
                          title="Lepas catatan ini"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Tempel Catatan Baru dari Damar */}
          <div className="border-t border-slate-300/80 bg-[#edf2f7] p-4 md:px-6 md:py-4">
            {/* Template Cepat */}
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <Sparkles className="h-3 w-3 text-amber-500" /> Pesan Cepat:
              </span>
              {QUICK_MESSAGES.map((tpl, idx) => (
                <button
                  key={`tpl-${idx}`}
                  type="button"
                  onClick={() => setInput(tpl)}
                  className="max-w-[210px] truncate rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] text-slate-700 transition hover:border-amber-400 hover:bg-amber-50"
                >
                  {tpl}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <input
                type="text"
                maxLength={130}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pesan manis untuk Nadia & Kira di pintu kulkas..."
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
              />

              <div className="flex items-center justify-between gap-2.5 sm:justify-end">
                {/* Pilih Warna Kertas Sticky Note */}
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5">
                  {(['yellow', 'pink', 'mint', 'sky'] as FridgeNoteColor[]).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      title={COLOR_STYLES[col].label}
                      className={`h-5 w-5 rounded-full transition ${COLOR_STYLES[col].dot} ${
                        selectedColor === col ? 'ring-2 ring-slate-800 ring-offset-1 scale-110' : 'opacity-65 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#b8662f] px-4 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-[#9c5323] disabled:opacity-45"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Tempel di Kulkas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
};
