import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Compass, Film, Heart, Home, MessageCircle, Sparkles } from 'lucide-react';
import { buildEndingJourneyRecap } from '../../data/characterEchoes';
import { EASTER_EGGS } from '../../data/easterEggs';
import { ENDINGS } from '../../data/endings';
import { SIDE_QUESTS } from '../../data/sideQuests';
import { useGameStore } from '../../store/useGameStore';
import { EndingId } from '../../types/game';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

/**
 * 4 Ilustrasi Epilog Sinematik Widescreen (16:7) yang dirancang khusus
 * untuk merepresentasikan suasana emosional tiap akhir cerita LANGKAH PULANG.
 */
const EndingArtwork: React.FC<{ endingId: EndingId }> = ({ endingId }) => {
  if (endingId === 'secret') {
    // "Lagu yang Belum Selesai" — Ruang tamu hangat, gitar mahoni, Nadia & Kira, nada musik keemasan
    return (
      <svg viewBox="0 0 640 260" className="h-full w-full object-cover">
        <defs>
          <radialGradient id="secGlow" cx="50%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#ffdfa0" stopOpacity="0.58" />
            <stop offset="55%" stopColor="#854b2c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#171110" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="640" height="260" fill="#1a120f" />
        <rect width="640" height="260" fill="url(#secGlow)" />
        {/* Jendela senja keemasan di latar belakang */}
        <rect x="64" y="34" width="124" height="106" rx="4" fill="#2c243c" stroke="#5c3c28" strokeWidth="5" />
        <rect x="69" y="39" width="114" height="96" fill="#d98952" opacity="0.42" />
        <line x1="126" y1="34" x2="126" y2="140" stroke="#5c3c28" strokeWidth="4" />
        <line x1="64" y1="88" x2="188" y2="88" stroke="#5c3c28" strokeWidth="4" />
        {/* Lampu meja hangat di sisi kanan */}
        <polygon points="512,92 556,92 568,128 500,128" fill="#f7ca72" opacity="0.92" />
        <rect x="530" y="128" width="8" height="44" fill="#5e3e29" />
        <ellipse cx="534" cy="172" rx="22" ry="6" fill="#462d1e" />
        {/* Lantai kayu hangat */}
        <rect x="0" y="176" width="640" height="84" fill="#2d1c14" />
        <ellipse cx="320" cy="214" rx="185" ry="26" fill="#5a3622" opacity="0.45" />
        {/* Siluet Damar duduk memetik gitar mahoni */}
        <circle cx="298" cy="128" r="17" fill="#d9a682" />
        <path d="M276 148 Q298 142 320 148 L328 206 L268 206 Z" fill="#42586e" />
        {/* Gitar mahoni bercahaya */}
        <ellipse cx="316" cy="176" rx="26" ry="17" fill="#b86b35" stroke="#f6d17a" strokeWidth="1.8" transform="rotate(-14 316 176)" />
        <circle cx="316" cy="176" r="5" fill="#2c160b" />
        <line x1="336" y1="168" x2="380" y2="152" stroke="#d89b62" strokeWidth="4.5" strokeLinecap="round" />
        {/* Siluet Nadia bersandar hangat di sisi kiri */}
        <circle cx="246" cy="138" r="15" fill="#e2b494" />
        <path d="M226 156 Q246 150 268 158 L272 206 L220 206 Z" fill="#c47a6a" />
        {/* Siluet Kira kecil duduk bersila menepuk tangan di kanan */}
        <circle cx="386" cy="158" r="12" fill="#e6be9e" />
        <path d="M372 172 Q386 168 400 172 L404 208 L368 208 Z" fill="#e9b949" />
        {/* Not musik & debu cahaya hangat melayang */}
        <g fill="#ffe29a" opacity="0.88">
          <text x="348" y="114" fontSize="22" fontFamily="Georgia, serif">♪</text>
          <text x="382" y="92" fontSize="18" fontFamily="Georgia, serif">♫</text>
          <text x="268" y="96" fontSize="15" fontFamily="Georgia, serif">♪</text>
          <circle cx="305" cy="76" r="2.2" />
          <circle cx="424" cy="116" r="2" />
          <circle cx="222" cy="108" r="1.8" />
          <circle cx="468" cy="74" r="2.4" />
        </g>
        <text x="320" y="242" textAnchor="middle" fill="#f6d17a" opacity="0.72" fontSize="11" letterSpacing="3" fontFamily="Georgia, serif">
          TRACK 4 — PULANG (SELESAI DITULIS)
        </text>
      </svg>
    );
  }

  if (endingId === 'true') {
    // "Cahaya di Meja Makan" — Jendela kuning rumah Jl. Melati menyala di malam berbintang, kunang-kunang hangat
    return (
      <svg viewBox="0 0 640 260" className="h-full w-full object-cover">
        <defs>
          <linearGradient id="trueSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#11182c" />
            <stop offset="65%" stopColor="#262c47" />
            <stop offset="100%" stopColor="#1b1c26" />
          </linearGradient>
          <radialGradient id="winGlow" cx="50%" cy="56%" r="48%">
            <stop offset="0%" stopColor="#ffcf75" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffcf75" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="640" height="260" fill="url(#trueSky)" />
        {/* Bintang malam */}
        {[72, 148, 210, 448, 512, 578, 96, 540].map((x, i) => (
          <circle key={x} cx={x} cy={24 + (i % 4) * 18} r={i % 2 === 0 ? 1.8 : 1.2} fill="#fff4d2" opacity="0.85" />
        ))}
        {/* Halo cahaya hangat dari jendela rumah */}
        <circle cx="320" cy="148" r="150" fill="url(#winGlow)" />
        {/* Siluet rumah Jl. Melati No. 14 */}
        <polygon points="175,112 320,44 465,112" fill="#4f2d24" />
        <rect x="200" y="112" width="240" height="114" fill="#232836" />
        {/* Jendela ruang makan besar menyala emas hangat */}
        <rect x="252" y="128" width="136" height="72" rx="4" fill="#ffd885" stroke="#5e3f2b" strokeWidth="4" />
        {/* Siluet 3 figur berkumpul di meja makan dalam jendela */}
        <circle cx="288" cy="164" r="9" fill="#5e3622" />
        <path d="M276 174 L300 174 L304 198 L272 198 Z" fill="#5e3622" />
        <circle cx="320" cy="171" r="7" fill="#6b3e26" />
        <path d="M311 179 L329 179 L331 198 L309 198 Z" fill="#6b3e26" />
        <circle cx="352" cy="165" r="8.5" fill="#5e3622" />
        <path d="M340 175 L364 175 L368 198 L336 198 Z" fill="#5e3622" />
        <line x1="320" y1="128" x2="320" y2="200" stroke="#5e3f2b" strokeWidth="2.5" opacity="0.7" />
        {/* Halaman & jalan malam */}
        <rect x="0" y="220" width="640" height="40" fill="#141821" />
        {/* Kunang-kunang hangat di pekarangan */}
        <circle cx="155" cy="186" r="3" fill="#ffe18c" opacity="0.85" />
        <circle cx="486" cy="174" r="2.6" fill="#ffe18c" opacity="0.78" />
        <circle cx="520" cy="198" r="2.2" fill="#ffd26e" opacity="0.65" />
        <text x="320" y="246" textAnchor="middle" fill="#e7b87d" opacity="0.75" fontSize="11" letterSpacing="3" fontFamily="Georgia, serif">
          JL. MELATI NO. 14 · LAMPU MEJA MAKAN MENYALA
        </text>
      </svg>
    );
  }

  if (endingId === 'good') {
    // "Pulang ke Diri Sendiri" — Senja tenang di Jembatan & Danau Senja, pantulan air hangat, burung pulang
    return (
      <svg viewBox="0 0 640 260" className="h-full w-full object-cover">
        <defs>
          <linearGradient id="goodSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3044" />
            <stop offset="48%" stopColor="#c77a58" />
            <stop offset="72%" stopColor="#f2c480" />
            <stop offset="100%" stopColor="#203b48" />
          </linearGradient>
        </defs>
        <rect width="640" height="260" fill="url(#goodSky)" />
        {/* Matahari senja rendah */}
        <circle cx="320" cy="142" r="44" fill="#ffe4a3" opacity="0.9" />
        {/* Siluet pepohonan tepi danau */}
        <path d="M0 164 Q80 120 165 162 Q235 144 270 164 L0 164 Z" fill="#1e2d35" />
        <path d="M380 164 Q455 128 530 156 Q590 132 640 162 L640 164 Z" fill="#1e2d35" />
        {/* Jembatan lengkung sederhana */}
        <rect x="0" y="156" width="640" height="7" fill="#232c36" />
        <path d="M120 156 Q320 96 520 156" fill="none" stroke="#dce4ec" strokeWidth="2.5" opacity="0.75" />
        <line x1="210" y1="126" x2="210" y2="156" stroke="#dce4ec" strokeWidth="2" opacity="0.65" />
        <line x1="430" y1="126" x2="430" y2="156" stroke="#dce4ec" strokeWidth="2" opacity="0.65" />
        {/* Permukaan air danau & pantulan matahari */}
        <rect x="0" y="163" width="640" height="97" fill="#1b3442" />
        <ellipse cx="320" cy="186" rx="68" ry="6" fill="#ffd98a" opacity="0.55" />
        <ellipse cx="320" cy="204" rx="44" ry="4" fill="#ffd98a" opacity="0.38" />
        <ellipse cx="320" cy="220" rx="24" ry="3" fill="#ffd98a" opacity="0.25" />
        {/* Burung senja terbang pulang */}
        <path d="M220 74 Q227 68 234 74 Q241 68 248 74" fill="none" stroke="#2c2938" strokeWidth="2" />
        <path d="M266 60 Q271 56 276 60 Q281 56 286 60" fill="none" stroke="#2c2938" strokeWidth="1.8" />
        <text x="320" y="246" textAnchor="middle" fill="#a8d5bc" opacity="0.82" fontSize="11" letterSpacing="3" fontFamily="Georgia, serif">
          SENJA DI TEPI DANAU · LANGKAH YANG TENANG
        </text>
      </svg>
    );
  }

  // "Bayangan di Kaca Kantor" (Bad Ending) — Jendela kaca lantai 18 dingin, rintik hujan, siluet sendiri
  return (
    <svg viewBox="0 0 640 260" className="h-full w-full object-cover">
      <defs>
        <linearGradient id="badSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a101c" />
          <stop offset="65%" stopColor="#162235" />
          <stop offset="100%" stopColor="#0d131f" />
        </linearGradient>
      </defs>
      <rect width="640" height="260" fill="url(#badSky)" />
      {/* Siluet gedung pencakar langit kota dingin */}
      {[36, 98, 168, 250, 360, 442, 514, 574].map((x, idx) => (
        <rect
          key={x}
          x={x}
          y={76 + (idx % 3) * 28}
          width={44 + (idx % 2) * 16}
          height={145}
          fill="#0f1726"
        />
      ))}
      {/* Bokeh lampu kota jauh */}
      {[70, 130, 195, 290, 405, 480, 540, 590].map((x, idx) => (
        <circle
          key={x}
          cx={x}
          cy={124 + (idx % 4) * 20}
          r={idx % 3 === 0 ? 4.5 : 2.5}
          fill={idx % 2 === 0 ? '#7fa7cc' : '#c9b48a'}
          opacity="0.32"
        />
      ))}
      {/* Garis bingkai kaca kantor lantai 18 */}
      <line x1="210" y1="0" x2="210" y2="260" stroke="#243247" strokeWidth="4" />
      <line x1="430" y1="0" x2="430" y2="260" stroke="#243247" strokeWidth="4" />
      {/* Pantulan samar Damar berdasi berdiri sendirian menghadap kaca */}
      <circle cx="320" cy="116" r="18" fill="#8ba3be" opacity="0.28" />
      <path d="M292 140 Q320 132 348 140 L356 225 L284 225 Z" fill="#8ba3be" opacity="0.22" />
      <polygon points="317,140 323,140 325,180 320,188 315,180" fill="#b8cee6" opacity="0.28" />
      {/* Jejak rintik hujan di kaca */}
      {[120, 185, 260, 375, 455, 535].map((x, idx) => (
        <line
          key={x}
          x1={x}
          y1={36 + idx * 14}
          x2={x - 4}
          y2={64 + idx * 14}
          stroke="#9ec0e0"
          strokeWidth="1.2"
          opacity="0.34"
        />
      ))}
      <text x="320" y="246" textAnchor="middle" fill="#8ba3be" opacity="0.72" fontSize="11" letterSpacing="3" fontFamily="Georgia, serif">
        MENARA NUSANTARA · LANTAI 18 · PUKUL 22.40
      </text>
    </svg>
  );
};

const TONE_CARD_STYLE = {
  gold: 'border-amber-300/30 bg-amber-500/10 text-amber-100',
  rose: 'border-rose-300/30 bg-rose-500/10 text-rose-100',
  sky: 'border-sky-300/30 bg-sky-500/10 text-sky-100',
  slate: 'border-slate-300/25 bg-slate-500/10 text-slate-200',
};

export const EndingScreen: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const activeEnding = useGameStore((s) => s.activeEnding);
  const journalName = useGameStore((s) => s.journalName);
  const playTimeSeconds = useGameStore((s) => s.playTimeSeconds);
  const emotions = useGameStore((s) => s.emotions);
  const flags = useGameStore((s) => s.flags);
  const repliedPhonePrompts = useGameStore((s) => s.repliedPhonePrompts);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const unlockedEndings = useGameStore((s) => s.unlockedEndings);
  const returnToTitle = useGameStore((s) => s.returnToTitle);
  const finishChapterTransition = useGameStore((s) => s.finishChapterTransition);

  const [revealedCount, setRevealedCount] = useState(1);
  const [selectedHintEnding, setSelectedHintEnding] = useState<EndingId | null>(null);
  const { isCompactLandscape } = useMobileViewport();

  useEffect(() => {
    if (screen !== 'ending') return;
    setRevealedCount(1);
    setSelectedHintEnding(null);
    const id = window.setInterval(() => {
      setRevealedCount((c) => Math.min(c + 1, 5));
    }, 2600);
    return () => window.clearInterval(id);
  }, [screen, activeEnding]);

  const recap = useMemo(() => {
    if (!activeEnding) return null;
    return buildEndingJourneyRecap({
      endingId: activeEnding,
      emotions,
      flags,
      sideQuests,
      discoveredEasterEggs,
      repliedPhonePrompts,
    });
  }, [activeEnding, emotions, flags, sideQuests, discoveredEasterEggs, repliedPhonePrompts]);

  if (screen !== 'ending' || !activeEnding || !recap) return null;

  const def = ENDINGS[activeEnding];
  const completedSide = Object.values(sideQuests).filter((s) => s.status === 'completed').length;
  const mins = Math.max(1, Math.round(playTimeSeconds / 60));

  const totalHeart = Math.max(
    1,
    emotions.kejujuranDiri + emotions.kehadiranKeluarga + emotions.ambisiPelarian,
  );
  const honestyPct = Math.min(100, Math.round((emotions.kejujuranDiri / totalHeart) * 100));
  const familyPct = Math.min(100, Math.round((emotions.kehadiranKeluarga / totalHeart) * 100));
  const ambitionPct = Math.min(100, Math.round((emotions.ambisiPelarian / totalHeart) * 100));

  const bgGradientByEnding: Record<EndingId, string> = {
    secret: 'from-[#1c130d] via-[#120e14] to-[#0b0d14]',
    true: 'from-[#1a1512] via-[#101320] to-[#090d16]',
    good: 'from-[#121c22] via-[#101520] to-[#0a0f18]',
    bad: 'from-[#0b101b] via-[#0e1522] to-[#080c14]',
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9999] overflow-y-auto subtle-scroll bg-gradient-to-b ${bgGradientByEnding[activeEnding]} text-warm-50 backdrop-blur-xl ${
          isCompactLandscape ? 'px-4 py-6' : 'px-5 py-10 md:px-8 md:py-12'
        }`}
      >
        <div className="mx-auto max-w-3xl space-y-7 animate-fadeIn">
          {/* Header Ending */}
          <div className="space-y-2.5 text-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-warm-200/25 bg-black/25 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: def.accentColor }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {def.label}
            </span>
            <h1 className="font-serif text-3xl font-medium text-warm-50 md:text-5xl">
              {def.title}
            </h1>
            <p className="mx-auto max-w-xl text-sm text-warm-200/75">{def.subtitle}</p>
          </div>

          {/* Bingkai Ilustrasi Epilog Sinematik Widescreen */}
          <div className="overflow-hidden rounded-2xl border border-warm-200/20 bg-black/50 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
            <div className="aspect-[16/7] w-full">
              <EndingArtwork endingId={activeEnding} />
            </div>
          </div>

          {/* Paragraf Epilog Sinematik */}
          <div className="mx-auto max-w-2xl space-y-5 font-serif text-base leading-relaxed text-warm-100/92 md:text-lg">
            {def.epilogueParagraphs.slice(0, revealedCount).map((p, idx) => (
              <p key={idx} className="animate-fadeIn">
                {p}
              </p>
            ))}
          </div>

          {revealedCount < def.epilogueParagraphs.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setRevealedCount(5)}
                className="text-xs text-warm-300/75 underline transition hover:text-warm-100"
              >
                Tampilkan seluruh epilog
              </button>
            </div>
          )}

          {/* Kutipan Penutup, Jejak Hati Damar & Koleksi Akhir Cerita */}
          {revealedCount >= def.epilogueParagraphs.length && (
            <div className="space-y-6 pt-2 animate-fadeIn">
              <blockquote
                className="rounded-2xl border border-warm-200/20 bg-black/30 p-6 text-center font-serif text-base italic shadow-lg md:text-lg"
                style={{ color: def.accentColor }}
              >
                {def.finalQuote}
              </blockquote>

              {/* === JEJAK HATI & GEMA PILIHAN DAMAR === */}
              <div className="space-y-4 rounded-2xl border border-warm-200/15 bg-dusk-900/65 p-5 shadow-xl">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-300/80">
                      Jejak Hati &amp; Gema Pilihanmu
                    </p>
                    <h2 className="mt-1 font-serif text-xl text-warm-50">{recap.archetypeTitle}</h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-warm-200/75">{recap.archetypeNote}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-warm-200/75">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2.5 py-1">
                      <Film className="h-3.5 w-3.5 text-amber-300" />
                      {recap.flashbacksSeen}/3 Kilas Balik
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2.5 py-1">
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                      {recap.phoneRepliesSent} Pesan
                    </span>
                  </div>
                </div>

                {/* Kompas Emosi Organik */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Kejujuran Diri', pct: honestyPct, bar: 'bg-amber-400/85' },
                    { label: 'Kehadiran Rumah', pct: familyPct, bar: 'bg-rose-400/85' },
                    { label: 'Beban & Pelarian', pct: ambitionPct, bar: 'bg-slate-400/80' },
                  ].map((axis) => (
                    <div key={axis.label} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-warm-200/80">{axis.label}</span>
                        <span className="font-mono text-warm-100">{axis.pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${axis.bar}`} style={{ width: `${axis.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kartu Momen Personal yang Membentuk Ending Ini */}
                {recap.echoCards.length > 0 && (
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-warm-300/75">
                      <Heart className="h-3 w-3 text-rose-300" />
                      Momen yang Dikenang Karakter dari Perjalananmu
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {recap.echoCards.map((card) => (
                        <div
                          key={card.id}
                          className={`rounded-xl border px-3.5 py-2.5 ${TONE_CARD_STYLE[card.tone]}`}
                        >
                          <p className="text-xs font-semibold">{card.label}</p>
                          <p className="mt-1 text-[11px] leading-relaxed opacity-85">{card.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistik Ringkas Perjalanan */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-warm-100/10 bg-dusk-900/55 p-4 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-warm-200/55">Waktu Bermain</p>
                  <p className="mt-1 font-serif text-lg text-warm-50">{mins} menit</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-warm-200/55">Kisah Warga</p>
                  <p className="mt-1 font-serif text-lg text-warm-50">
                    {completedSide} / {SIDE_QUESTS.length}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-warm-200/55">Fragmen Memori</p>
                  <p className="mt-1 font-serif text-lg text-warm-50">
                    {discoveredEasterEggs.length} / {EASTER_EGGS.length}
                  </p>
                </div>
              </div>

              {/* Koleksi 4 Ending + Petunjuk Halus untuk Ending yang Masih Terkunci */}
              <div className="rounded-2xl border border-warm-100/10 bg-dusk-900/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-warm-200/85">
                    <BookOpen className="h-3.5 w-3.5 text-warm-300" />
                    Akhir Cerita Terbuka ({unlockedEndings.length}/4) · Arsip: {journalName}
                  </p>
                  <span className="text-[10px] text-warm-200/55">Klik kartu terkunci untuk petunjuk</span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(['good', 'true', 'bad', 'secret'] as EndingId[]).map((eid) => {
                    const e = ENDINGS[eid];
                    const has = unlockedEndings.includes(eid);
                    const isCurrent = eid === activeEnding;
                    return (
                      <button
                        key={eid}
                        type="button"
                        onClick={() => setSelectedHintEnding((cur) => (cur === eid ? null : eid))}
                        className={`rounded-xl border px-3 py-2 text-center text-xs transition ${
                          isCurrent
                            ? 'border-amber-300/70 bg-amber-400/15 text-amber-50 shadow'
                            : has
                              ? 'border-warm-300/35 bg-warm-400/10 text-warm-100 hover:border-warm-300/60'
                              : 'border-warm-100/10 bg-dusk-950/50 text-warm-200/45 hover:border-warm-200/25'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-wider opacity-75">{e.label}</p>
                        <p className="mt-0.5 truncate font-serif">{has ? e.title : 'Terkunci'}</p>
                      </button>
                    );
                  })}
                </div>
                {selectedHintEnding && (
                  <p className="mt-3 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-[11px] leading-relaxed text-warm-200/80 animate-fadeIn">
                    <strong className="text-warm-100">{ENDINGS[selectedHintEnding].label}:</strong>{' '}
                    {ENDINGS[selectedHintEnding].unlockHint}
                  </p>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => finishChapterTransition()}
                  className="flex items-center gap-2 rounded-xl border border-warm-300/40 bg-dusk-900 px-5 py-3 text-sm text-warm-100 transition hover:bg-dusk-800"
                >
                  <Compass className="h-4 w-4 text-warm-300" />
                  <span>Lanjut Jelajah Kota Malam</span>
                </button>
                <button
                  type="button"
                  onClick={() => returnToTitle()}
                  className="flex items-center gap-2 rounded-xl bg-warm-400 px-6 py-3 text-sm font-semibold text-dusk-950 transition hover:bg-warm-300"
                >
                  <Home className="h-4 w-4" />
                  <span>Kembali ke Layar Judul</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};
