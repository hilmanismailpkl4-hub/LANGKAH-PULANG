import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Feather, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import { buildChapterLiteraryCard, ChapterLiteraryCardData } from '../../data/prologueAndChapters';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

/**
 * Ilustrasi sketsa tinta garis halus untuk tiap Bab (Kopi & Perahu Kertas / Payung Jembatan Hujan / Lampu Meja Makan Malam).
 */
const ChapterInkVignette: React.FC<{ theme: ChapterLiteraryCardData['accentTheme']; compact: boolean }> = ({
  theme,
  compact,
}) => {
  const sizeClass = compact ? 'h-14 w-36' : 'h-20 w-48';

  if (theme === 'dawn_gold') {
    return (
      <svg viewBox="0 0 220 84" className={`mx-auto ${sizeClass} opacity-90`}>
        <line x1="20" y1="68" x2="200" y2="68" stroke="#fbbf24" strokeOpacity="0.4" strokeWidth="1.2" />
        {/* Cangkir kopi pagi hangat */}
        <rect x="64" y="42" width="26" height="24" rx="4" fill="none" stroke="#fde68a" strokeWidth="1.8" />
        <path d="M90 47 C97 47 97 59 90 59" fill="none" stroke="#fde68a" strokeWidth="1.6" />
        <path d="M72 36 Q70 28 74 22 M80 35 Q78 26 82 19" fill="none" stroke="#fcd34d" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
        {/* Perahu kertas biru buatan Kira */}
        <polygon points="118,66 158,66 168,54 108,54" fill="rgba(125,211,252,0.16)" stroke="#93c5fd" strokeWidth="1.6" />
        <polygon points="138,34 150,54 126,54" fill="rgba(186,230,253,0.22)" stroke="#bae6fd" strokeWidth="1.5" />
      </svg>
    );
  }

  if (theme === 'rain_slate') {
    return (
      <svg viewBox="0 0 220 84" className={`mx-auto ${sizeClass} opacity-90`}>
        {/* Garis hujan miring */}
        {[38, 66, 96, 128, 158, 184].map((x, idx) => (
          <line
            key={x}
            x1={x}
            y1={10 + (idx % 2) * 8}
            x2={x - 7}
            y2={26 + (idx % 2) * 8}
            stroke="#93c5fd"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
        ))}
        {/* Lengkungan Jembatan Sungai & Riak Air */}
        <path d="M24 64 Q110 44 196 64" fill="none" stroke="#cbd5e1" strokeOpacity="0.55" strokeWidth="1.6" />
        <path d="M56 73 Q110 69 164 73" fill="none" stroke="#7dd3fc" strokeOpacity="0.4" strokeWidth="1.2" />
        {/* Payung terbuka di tengah jembatan */}
        <path d="M92 44 Q110 26 128 44 Z" fill="rgba(147,197,253,0.2)" stroke="#e2e8f0" strokeWidth="1.7" />
        <line x1="110" y1="44" x2="110" y2="57" stroke="#e2e8f0" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 84" className={`mx-auto ${sizeClass} opacity-95`}>
      {/* Bintang malam & siluet gedung jauh */}
      <circle cx="48" cy="20" r="1.3" fill="#fef3c7" opacity="0.7" />
      <circle cx="174" cy="18" r="1.5" fill="#fef3c7" opacity="0.75" />
      <circle cx="152" cy="30" r="1.1" fill="#fef3c7" opacity="0.55" />
      {/* Lampu gantung ruang makan yang menyala hangat */}
      <line x1="110" y1="4" x2="110" y2="26" stroke="#fde68a" strokeOpacity="0.65" strokeWidth="1.5" />
      <polygon points="94,26 126,26 134,38 86,38" fill="rgba(251,191,36,0.25)" stroke="#fbbf24" strokeWidth="1.7" />
      <ellipse cx="110" cy="39" rx="14" ry="3.5" fill="#fef08a" opacity="0.85" />
      {/* Meja makan kayu di bawah pendar cahaya */}
      <line x1="68" y1="68" x2="152" y2="68" stroke="#fcd34d" strokeOpacity="0.65" strokeWidth="2" />
      <path d="M84 39 L68 68 M136 39 L152 68" stroke="#fbbf24" strokeOpacity="0.16" strokeWidth="1.2" />
    </svg>
  );
};

export const ChapterTransition: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const transitionChapter = useGameStore((s) => s.transitionChapter);
  const isTransitionPreview = useGameStore((s) => s.isTransitionPreview);
  const flags = useGameStore((s) => s.flags);
  const emotions = useGameStore((s) => s.emotions);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const repliedPhonePrompts = useGameStore((s) => s.repliedPhonePrompts);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const finishChapterTransition = useGameStore((s) => s.finishChapterTransition);

  const [revealedAll, setRevealedAll] = useState(false);
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  const card = useMemo(
    () =>
      buildChapterLiteraryCard({
        chapter: transitionChapter,
        flags,
        emotions,
        sideQuests,
        repliedPhonePrompts,
      }),
    [transitionChapter, flags, emotions, sideQuests, repliedPhonePrompts],
  );

  // Putar denting pembuka & narasi batin lembut saat kartu bab terbuka
  useEffect(() => {
    if (screen !== 'chapter_transition') return;
    setRevealedAll(false);
    sfxEngine.playMemoryChime();

    const timer = window.setTimeout(() => {
      setRevealedAll(true);
    }, 950);

    const fullSpeech = `${card.numberLabel}. ${card.title}. ${card.monologueParagraphs[0]} ${card.monologueParagraphs[1]}`;
    voiceManager.speak(`chapter_card_${card.chapter}`, 'damar_batin', fullSpeech);

    return () => {
      window.clearTimeout(timer);
      voiceManager.stop();
    };
  }, [screen, card]);

  useEffect(() => {
    if (screen !== 'chapter_transition') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
        e.preventDefault();
        if (!revealedAll && e.code !== 'Escape') {
          setRevealedAll(true);
          return;
        }
        sfxEngine.play('interact');
        finishChapterTransition();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, revealedAll, finishChapterTransition]);

  if (screen !== 'chapter_transition') return null;

  const backdropGradient =
    card.accentTheme === 'dawn_gold'
      ? 'radial-gradient(circle at 50% 18%, rgba(245, 188, 96, 0.24) 0%, rgba(28, 22, 18, 0.94) 56%, rgba(10, 10, 14, 0.99) 100%)'
      : card.accentTheme === 'rain_slate'
        ? 'radial-gradient(circle at 50% 18%, rgba(116, 158, 204, 0.24) 0%, rgba(18, 26, 38, 0.95) 56%, rgba(9, 12, 20, 0.99) 100%)'
        : 'radial-gradient(circle at 50% 20%, rgba(238, 178, 92, 0.22) 0%, rgba(15, 19, 34, 0.95) 56%, rgba(7, 9, 16, 0.99) 100%)';

  const accentBadgeClass =
    card.accentTheme === 'rain_slate'
      ? 'border-sky-300/35 bg-sky-400/10 text-sky-200'
      : 'border-amber-300/35 bg-amber-400/10 text-amber-200';

  return (
    <Portal>
      <div
        style={{ background: backdropGradient }}
        className={`fixed inset-0 z-[9998] flex flex-col justify-between overflow-y-auto text-warm-50 backdrop-blur-xl subtle-scroll ${
          compact ? 'px-4 py-3' : 'px-6 py-7 md:px-12 md:py-10'
        }`}
      >
        {/* Bar Atas: Penanda Waktu Kota & Tombol Suara */}
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2 overflow-hidden">
            <Feather className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span className="truncate font-mono text-[10px] tracking-[0.18em] text-warm-200/80 md:text-[11px]">
              {card.timeWeatherLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] text-warm-200/80 transition hover:border-warm-300/50 hover:text-warm-50"
          >
            {settings.voiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-amber-300" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{settings.voiceEnabled ? 'Suara Batin Aktif' : 'Suara Batin Mati'}</span>
          </button>
        </div>

        {/* Konten Tengah: Judul Sastra, Sketsa Tinta & Monolog Batin Dinamis Damar */}
        <div className={`mx-auto my-auto w-full max-w-2xl text-center animate-fadeIn ${compact ? 'space-y-2.5 py-2' : 'space-y-5 py-4'}`}>
          <div className="space-y-1.5">
            <p className="font-mono text-xs font-semibold tracking-[0.42em] text-amber-300/90">
              {card.numberLabel}
            </p>
            <h1
              className={`font-serif font-medium tracking-wide text-warm-50 drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)] ${
                compact ? 'text-2xl' : 'text-4xl md:text-5xl'
              }`}
            >
              {card.title}
            </h1>
            <p className={`font-serif italic text-warm-200/80 ${compact ? 'text-xs' : 'text-base md:text-lg'}`}>
              {card.subtitle}
            </p>
          </div>

          <ChapterInkVignette theme={card.accentTheme} compact={compact} />

          {/* Kutipan Epigraf Sastra */}
          <blockquote className="mx-auto max-w-xl border-y border-white/10 py-2.5 px-3">
            <p className={`font-serif italic leading-relaxed text-amber-100/85 ${compact ? 'text-xs' : 'text-sm md:text-[15px]'}`}>
              “{card.epigraph}”
            </p>
            {!compact && (
              <footer className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-warm-300/60">
                — {card.epigraphSource}
              </footer>
            )}
          </blockquote>

          {/* Lembar Monolog Batin Personal (Menyesuaikan Pilihan Pemain!) */}
          <div
            onClick={() => !revealedAll && setRevealedAll(true)}
            className={`rounded-2xl border border-white/12 bg-black/35 text-left shadow-2xl transition-all duration-700 ${
              compact ? 'p-3.5 space-y-2' : 'p-5 md:p-6 space-y-3.5'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/85">
                <Sparkles className="h-3 w-3" />
                Suara Batin Damar
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {card.echoChips.map((chip) => (
                  <span
                    key={chip}
                    className={`rounded-full border px-2.5 py-0.5 text-[9.5px] font-medium ${accentBadgeClass}`}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <p className={`font-serif leading-relaxed text-warm-100/92 ${compact ? 'text-xs' : 'text-sm md:text-[15px]'}`}>
              {card.monologueParagraphs[0]}
            </p>

            <p
              className={`font-serif leading-relaxed text-warm-100/88 transition-all duration-700 ${
                compact ? 'text-xs' : 'text-sm md:text-[15px]'
              } ${revealedAll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'}`}
            >
              {card.monologueParagraphs[1]}
            </p>
          </div>
        </div>

        {/* Bar Bawah: Tombol Melangkah Masuk Bab */}
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={() => {
              sfxEngine.play('interact');
              finishChapterTransition();
            }}
            className={`group inline-flex items-center gap-2.5 rounded-full border border-amber-300/55 bg-amber-400/90 font-semibold text-dusk-950 shadow-[0_0_28px_rgba(251,191,36,0.28)] transition hover:bg-amber-300 ${
              compact ? 'px-6 py-2 text-xs' : 'px-8 py-3 text-sm'
            }`}
          >
            <span>
              {isTransitionPreview ? 'Kembali ke Permainan' : `Melangkah ke ${card.numberLabel}`}
            </span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          {!compact && (
            <span className="text-[11px] text-warm-300/55">
              Tekan [Spasi] atau [Enter] untuk melanjutkan
            </span>
          )}
        </div>
      </div>
    </Portal>
  );
};
