import React, { useEffect, useState } from 'react';
import { ChevronRight, Film, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { voiceManager } from '../../audio/voiceManager';
import { CHARACTERS } from '../../data/characters';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

export const DialogueOverlay: React.FC = () => {
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const activeNodeId = useGameStore((s) => s.activeNodeId);
  const flags = useGameStore((s) => s.flags);
  const settings = useGameStore((s) => s.settings);
  const advanceDialogue = useGameStore((s) => s.advanceDialogue);
  const chooseDialogueOption = useGameStore((s) => s.chooseDialogueOption);
  const closeDialogue = useGameStore((s) => s.closeDialogue);
  const updateSettings = useGameStore((s) => s.updateSettings);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  useEffect(() => {
    return voiceManager.onSpeakingChange(setIsSpeaking);
  }, []);

  const node = activeDialogue && activeNodeId ? activeDialogue.nodes[activeNodeId] : null;
  const flashback = activeDialogue?.flashback ?? null;

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (node.choices && node.choices.length > 0) return;
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
        e.preventDefault();
        advanceDialogue();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node, advanceDialogue]);

  if (!node) return null;

  const speaker = CHARACTERS[node.speaker] ?? CHARACTERS.damar;
  const isThought = node.speaker === 'damar_batin' || node.speaker === 'narator';
  const visibleChoices = (node.choices || []).filter(
    (c) => !c.requiredFlag || flags.includes(c.requiredFlag),
  );

  // Suasana warna sinematik untuk Mode Kilas Balik Memori
  const flashbackBackdropStyle: React.CSSProperties | undefined = flashback
    ? flashback.mood === 'rain_melancholy'
      ? {
          backdropFilter: 'sepia(0.36) saturate(0.72) contrast(1.06) brightness(0.76)',
          background:
            'radial-gradient(circle at 50% 28%, rgba(112, 148, 184, 0.24) 0%, rgba(16, 22, 34, 0.68) 62%, rgba(8, 10, 16, 0.9) 100%)',
        }
      : flashback.mood === 'quiet_night'
        ? {
            backdropFilter: 'sepia(0.48) contrast(1.1) brightness(0.72)',
            background:
              'radial-gradient(circle at 50% 22%, rgba(235, 178, 96, 0.22) 0%, rgba(24, 18, 16, 0.72) 58%, rgba(8, 7, 10, 0.92) 100%)',
          }
        : {
            backdropFilter: 'sepia(0.68) contrast(1.06) brightness(0.82)',
            background:
              'radial-gradient(circle at 50% 24%, rgba(248, 196, 113, 0.28) 0%, rgba(52, 32, 20, 0.56) 62%, rgba(14, 10, 8, 0.88) 100%)',
          }
    : undefined;

  const showCenteredBanner = Boolean(flashback) && !(compact && visibleChoices.length > 0);

  return (
    <Portal>
      <div
        style={flashbackBackdropStyle}
        className={`fixed inset-0 z-[9995] flex flex-col justify-between transition-all duration-700 ${
          flashback
            ? ''
            : `justify-end bg-gradient-to-t from-dusk-950/88 via-dusk-950/20 to-transparent ${
                compact ? 'px-4 py-2.5' : 'p-4 md:p-8'
              }`
        }`}
      >
        {/* === LETTERBOX ATAS KHUSUS KILAS BALIK SINEMATIK === */}
        {flashback && (
          <div
            className={`flex shrink-0 items-center justify-between border-b border-amber-200/15 bg-black/92 px-4 text-amber-100/90 md:px-8 ${
              compact ? 'h-8' : 'h-11 md:h-12'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/35 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                <Film className="h-3 w-3" />
                Kilas Balik
              </span>
              <span className="truncate font-mono text-[11px] tracking-[0.14em] text-amber-100/85">
                {flashback.yearLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden truncate text-[11px] italic text-amber-200/65 sm:inline">
                {flashback.locationLabel}
              </span>
              <button
                type="button"
                onClick={closeDialogue}
                title="Kembali ke Masa Kini"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] text-amber-100/75 transition hover:border-amber-300/45 hover:bg-white/10 hover:text-amber-50"
              >
                <X className="h-3 w-3" />
                <span className="hidden sm:inline">Kembali ke Masa Kini</span>
              </button>
            </div>
          </div>
        )}

        {/* === KARTU JUDUL & EPIGRAF MEMORI DI TENGAH LAYAR === */}
        {showCenteredBanner && flashback && (
          <div className={`pointer-events-none flex flex-1 flex-col items-center justify-center px-6 text-center animate-fadeIn ${compact ? 'py-1' : 'py-4'}`}>
            <div className="max-w-xl space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-300/80">
                {flashback.locationLabel}
              </p>
              <h2
                className={`font-serif font-medium tracking-wide text-amber-50 drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)] ${
                  compact ? 'text-lg' : 'text-2xl md:text-3xl'
                }`}
              >
                {flashback.title}
              </h2>
              {flashback.epigraph && !compact && (
                <p className="mx-auto max-w-lg font-serif text-xs italic leading-relaxed text-amber-100/80 md:text-sm">
                  “{flashback.epigraph}”
                </p>
              )}
              <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
          </div>
        )}

        {/* === KONTAINER PILIHAN + KOTAK SUBTITLE === */}
        <div
          className={`mx-auto w-full max-w-3xl animate-fadeIn ${
            flashback ? (compact ? 'px-4 pb-2 space-y-1.5' : 'px-4 pb-5 md:px-8 space-y-3') : compact ? 'space-y-1.5' : 'space-y-3'
          }`}
        >
          {/* Pilihan Dialog Bercabang (jika ada) */}
          {visibleChoices.length > 0 && (
            <div className={`space-y-1.5 pb-0.5 ${compact ? 'max-h-[42dvh] overflow-y-auto subtle-scroll' : ''}`}>
              {visibleChoices.map((choice, idx) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => chooseDialogueOption(choice)}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl border text-left shadow-lg backdrop-blur-md transition ${
                    flashback
                      ? 'border-amber-300/35 bg-[#1b140f]/92 hover:border-amber-300/85 hover:bg-[#2a1f16]/95'
                      : 'border-warm-200/25 bg-dusk-900/92 hover:border-warm-300/75 hover:bg-dusk-800/95'
                  } ${compact ? 'px-3.5 py-2' : 'px-5 py-3.5'}`}
                >
                  <div>
                    <p
                      className={`font-medium ${
                        flashback ? 'text-amber-50 group-hover:text-amber-200' : 'text-warm-50 group-hover:text-warm-200'
                      } ${compact ? 'text-xs' : 'text-sm'}`}
                    >
                      <span className="mr-2 text-xs text-warm-300/80">{idx + 1}.</span>
                      {choice.text}
                    </p>
                    {choice.subtext && (
                      <p className="mt-0.5 pl-4 text-[10px] italic text-warm-200/65">{choice.subtext}</p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-warm-300/60 transition group-hover:translate-x-0.5 group-hover:text-warm-300" />
                </button>
              ))}
            </div>
          )}

          {/* Kotak Subtitle Sinematik */}
          <div
            onClick={() => {
              if (visibleChoices.length === 0) advanceDialogue();
            }}
            className={`rounded-2xl border shadow-2xl backdrop-blur-xl ${
              flashback
                ? 'border-amber-300/30 bg-[#140f0c]/94 hover:border-amber-200/50'
                : 'border-warm-100/15 bg-dusk-950/92 hover:border-warm-200/30'
            } ${compact ? 'px-4 py-3' : 'px-6 py-5'} ${visibleChoices.length === 0 ? 'cursor-pointer' : ''}`}
          >
            {/* Header Nama Tokoh + Kontrol Suara */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {speaker.name && (
                  <span
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: flashback && isThought ? '#f6d17a' : speaker.accentColor }}
                  >
                    {speaker.name}
                  </span>
                )}
                {speaker.name && speaker.role && (
                  <span className="text-[11px] text-warm-200/50">· {speaker.role}</span>
                )}
                {isSpeaking && (
                  <span className="ml-1 flex h-3 items-end gap-0.5" title="Sedang berbicara">
                    <span className="h-2 w-0.5 animate-pulse bg-warm-300" />
                    <span className="h-3 w-0.5 animate-pulse bg-warm-400" />
                    <span className="h-1.5 w-0.5 animate-pulse bg-warm-300" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  title="Putar ulang suara baris ini"
                  onClick={() => voiceManager.speak(node.id, node.speaker, node.text)}
                  className="rounded-lg p-1.5 text-warm-200/60 hover:bg-warm-100/10 hover:text-warm-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title={settings.voiceEnabled ? 'Bisukan suara dialog' : 'Aktifkan suara dialog'}
                  onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
                  className="rounded-lg p-1.5 text-warm-200/60 hover:bg-warm-100/10 hover:text-warm-100"
                >
                  {settings.voiceEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5 text-warm-300/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Teks Dialog */}
            {settings.showSubtitles && (
              <p
                className={`leading-relaxed ${
                  compact ? 'mt-1.5 text-sm' : 'mt-2.5 text-base md:text-[17px]'
                } ${
                  isThought
                    ? flashback
                      ? 'font-serif italic text-amber-100/95'
                      : 'font-serif italic text-warm-100/90'
                    : flashback
                      ? 'text-amber-50'
                      : 'text-warm-50'
                }`}
              >
                {node.text}
              </p>
            )}

            {/* Footer Lanjut */}
            {visibleChoices.length === 0 && (
              <div
                className={`flex items-center justify-end gap-1.5 text-[11px] ${
                  flashback ? 'text-amber-300/85' : 'text-warm-300/75'
                } ${compact ? 'mt-2' : 'mt-4'}`}
              >
                <span>{isMobile ? 'Ketuk kotak dialog untuk lanjut' : 'Klik atau tekan [Spasi] untuk lanjut'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>

        {/* === LETTERBOX BAWAH KHUSUS KILAS BALIK SINEMATIK === */}
        {flashback && (
          <div
            className={`flex shrink-0 items-center justify-center border-t border-amber-200/10 bg-black/92 px-4 text-[10px] tracking-[0.2em] text-amber-200/45 uppercase ${
              compact ? 'h-5' : 'h-8 md:h-9'
            }`}
          >
            LANGKAH PULANG · ARSIP MEMORI DAMAR PRATAMA
          </div>
        )}
      </div>
    </Portal>
  );
};
