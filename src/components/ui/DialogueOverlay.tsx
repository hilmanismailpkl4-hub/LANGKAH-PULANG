import React, { useEffect, useState } from 'react';
import { ChevronRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';
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
  const updateSettings = useGameStore((s) => s.updateSettings);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  useEffect(() => {
    return voiceManager.onSpeakingChange(setIsSpeaking);
  }, []);

  const node = activeDialogue && activeNodeId ? activeDialogue.nodes[activeNodeId] : null;

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

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9995] flex flex-col justify-end bg-gradient-to-t from-dusk-950/88 via-dusk-950/20 to-transparent ${
          compact ? 'px-4 py-2.5' : 'p-4 md:p-8'
        }`}
      >
        <div className={`mx-auto w-full max-w-3xl animate-fadeIn ${compact ? 'space-y-1.5' : 'space-y-3'}`}>
          {/* Pilihan Dialog Bercabang (jika ada) */}
          {visibleChoices.length > 0 && (
            <div className={`space-y-1.5 pb-0.5 ${compact ? 'max-h-[42dvh] overflow-y-auto subtle-scroll' : ''}`}>
              {visibleChoices.map((choice, idx) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => chooseDialogueOption(choice)}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl border border-warm-200/25 bg-dusk-900/92 text-left shadow-lg backdrop-blur-md transition hover:border-warm-300/75 hover:bg-dusk-800/95 ${
                    compact ? 'px-3.5 py-2' : 'px-5 py-3.5'
                  }`}
                >
                  <div>
                    <p className={`font-medium text-warm-50 group-hover:text-warm-200 ${compact ? 'text-xs' : 'text-sm'}`}>
                      <span className="mr-2 text-xs text-warm-300/80">{idx + 1}.</span>
                      {choice.text}
                    </p>
                    {choice.subtext && (
                      <p className="mt-0.5 pl-4 text-[10px] italic text-warm-200/60">{choice.subtext}</p>
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
            className={`rounded-2xl border border-warm-100/15 bg-dusk-950/92 shadow-2xl backdrop-blur-xl ${
              compact ? 'px-4 py-3' : 'px-6 py-5'
            } ${
              visibleChoices.length === 0 ? 'cursor-pointer hover:border-warm-200/30' : ''
            }`}
          >
            {/* Header Nama Tokoh + Kontrol Suara */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {speaker.name && (
                  <span
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: speaker.accentColor }}
                  >
                    {speaker.name}
                  </span>
                )}
                {speaker.name && speaker.role && (
                  <span className="text-[11px] text-warm-200/45">· {speaker.role}</span>
                )}
                {isSpeaking && (
                  <span className="ml-1 flex items-end gap-0.5 h-3" title="Sedang berbicara">
                    <span className="w-0.5 h-2 bg-warm-300 animate-pulse" />
                    <span className="w-0.5 h-3 bg-warm-400 animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-warm-300 animate-pulse" />
                  </span>
                )}
              </div>

              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
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
                } ${isThought ? 'font-serif italic text-warm-100/90' : 'text-warm-50'}`}
              >
                {node.text}
              </p>
            )}

            {/* Footer Lanjut */}
            {visibleChoices.length === 0 && (
              <div className={`flex items-center justify-end gap-1.5 text-[11px] text-warm-300/75 ${compact ? 'mt-2' : 'mt-4'}`}>
                <span>{isMobile ? 'Ketuk kotak dialog untuk lanjut' : 'Klik atau tekan [Spasi] untuk lanjut'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
