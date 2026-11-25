import React, { useEffect, useMemo, useState } from 'react';
import { Cloud, Compass, Home, KeyRound, Loader2 } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const CITY_TIPS = [
  'Tekan [G] kapan saja di kota untuk mengajak Nadia & Kira berjalan santai bersama.',
  'Saat sore dan malam, untaian lampion kertas di tepi sungai dan gerobak martabak Bang Udin menyala hangat.',
  'Sepeda kota klasik terparkir di tepi Taman Danau — tekan [Spasi] untuk membunyikan bel kring-kring.',
  'Tekan [P] untuk Mode Foto sinematik lengkap dengan 5 filter film hangat & bingkai Polaroid / 35mm.',
  'Buka ponsel Damar [H] untuk mengganti suasana waktu (Pagi, Senja, Hujan, Malam) dan memutar radio kota.',
  'Mampir ke Gazebo Taman Kota atau Kedai Kopi Bima untuk memetik gitar akustik di sore hari.',
];

const LOGIN_QUOTES = [
  '"Menyimpan jejak langkah agar selalu bisa kembali kapan pun rindu."',
  '"Lampu rumah di Jl. Melati No. 14 tetap menyala menunggumu pulang."',
  '"Setiap catatan perjalanan terjaga hangat di perangkat dan awan."',
];

const EMBER_DOTS = [
  { left: '12%', top: '28%', size: 4, delay: '0s', duration: '4.6s' },
  { left: '24%', top: '62%', size: 3, delay: '1.1s', duration: '5.4s' },
  { left: '36%', top: '22%', size: 5, delay: '0.6s', duration: '6.1s' },
  { left: '52%', top: '34%', size: 3, delay: '2.0s', duration: '4.9s' },
  { left: '66%', top: '24%', size: 4, delay: '0.4s', duration: '5.8s' },
  { left: '78%', top: '58%', size: 4, delay: '1.7s', duration: '4.5s' },
  { left: '86%', top: '30%', size: 3, delay: '2.4s', duration: '5.2s' },
  { left: '44%', top: '68%', size: 3, delay: '1.4s', duration: '6.0s' },
];

/**
 * Layar Loading Sinematik Bernuansa Senja Indonesia:
 * Tampil mulus saat login / daftar & sinkronisasi akun awan, inisialisasi awal,
 * serta transisi memasuki dunia 3D kota Langkah Pulang.
 */
export const LoadingScreenOverlay: React.FC = () => {
  const loadingOverlay = useGameStore((s) => s.loadingOverlay);
  const [rendered, setRendered] = useState(loadingOverlay.visible);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (loadingOverlay.visible) {
      setRendered(true);
      setTipIndex(Math.floor(Math.random() * CITY_TIPS.length));
      return;
    }
    const timer = window.setTimeout(() => {
      setRendered(false);
    }, 520);
    return () => window.clearTimeout(timer);
  }, [loadingOverlay.visible]);

  useEffect(() => {
    if (!loadingOverlay.visible) return;
    const interval = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % CITY_TIPS.length);
    }, 3600);
    return () => window.clearInterval(interval);
  }, [loadingOverlay.visible]);

  const modeBadge = useMemo(() => {
    switch (loadingOverlay.mode) {
      case 'login':
        return { label: 'Masuk & Sinkronisasi Akun', Icon: KeyRound };
      case 'register':
        return { label: 'Mendaftarkan Akun Cloud', Icon: Cloud };
      case 'enter_world':
        return { label: 'Menyiapkan Dunia Kota 3D', Icon: Compass };
      default:
        return { label: 'Langkah Pulang · Steps Home', Icon: Home };
    }
  }, [loadingOverlay.mode]);

  if (!rendered) return null;

  const isAuthMode = loadingOverlay.mode === 'login' || loadingOverlay.mode === 'register';
  const clampedProgress = Math.max(4, Math.min(100, Math.round(loadingOverlay.progress)));
  const footerNote = isAuthMode
    ? LOGIN_QUOTES[tipIndex % LOGIN_QUOTES.length]
    : CITY_TIPS[tipIndex % CITY_TIPS.length];
  const BadgeIcon = modeBadge.Icon;

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0b0e17] via-[#151824] to-[#23191d] px-6 py-8 md:px-14 md:py-12 text-warm-50 transition-opacity duration-500 ${
          loadingOverlay.visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Pendar Langit Senja & Partikel Hangat Mengambang */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 60%, rgba(232, 146, 74, 0.22) 0%, rgba(168, 86, 58, 0.1) 34%, transparent 66%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {EMBER_DOTS.map((dot, idx) => (
            <span
              key={`em-${idx}`}
              className="animate-float-ember absolute rounded-full bg-warm-300/80 blur-[0.5px]"
              style={{
                left: dot.left,
                top: dot.top,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            />
          ))}
        </div>

        {/* Bar Atas: Identitas Game & Lencana Status Ringan */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-warm-200/75">
            <span className="h-2 w-2 rounded-full bg-warm-400 animate-gentlePulse" />
            <span>LANGKAH PULANG · STEPS HOME</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-warm-300/25 bg-dusk-950/60 px-3.5 py-1.5 text-[11px] font-medium text-warm-200 backdrop-blur-md">
            <BadgeIcon className="h-3.5 w-3.5 text-warm-300" />
            <span>{modeBadge.label}</span>
          </div>
        </div>

        {/* Bagian Tengah: Ilustrasi Siluet Kota Senja Indonesia + Progres Loading */}
        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          {/* Siluet Vektor Cakrawala Kota (Menara Nusantara, Jembatan Lampion, Rumah Jl. Melati & Kereta Senja) */}
          <div className="relative mb-6 w-full max-w-xl overflow-hidden rounded-2xl border border-warm-200/15 bg-gradient-to-b from-[#161b2c]/85 via-[#251f2d]/80 to-[#14141c]/95 px-4 pt-6 pb-2 shadow-2xl backdrop-blur-md">
            <svg viewBox="0 0 640 165" className="w-full h-auto" aria-hidden="true">
              <defs>
                <radialGradient id="duskSun" cx="50%" cy="62%" r="48%">
                  <stop offset="0%" stopColor="#ffcb7a" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="#e58749" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#e58749" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="riverGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1b2638" />
                  <stop offset="50%" stopColor="#5e3e34" />
                  <stop offset="100%" stopColor="#192334" />
                </linearGradient>
              </defs>

              {/* Matahari Senja Lembut di Cakrawala */}
              <circle cx="320" cy="108" r="68" fill="url(#duskSun)" />
              <circle cx="320" cy="106" r="24" fill="#ffe2a8" opacity="0.88" />

              {/* Bintang Tipis Langit Atas */}
              {[
                [72, 24],
                [148, 34],
                [230, 18],
                [425, 22],
                [512, 32],
                [574, 20],
              ].map(([sx, sy], i) => (
                <circle key={`st-${i}`} cx={sx} cy={sy} r="1.4" fill="#ffe9bd" opacity="0.65" />
              ))}

              {/* Siluet Bukit & Gedung Jauh */}
              <path
                d="M0 132 Q80 98 165 118 T340 115 T520 105 T640 124 L640 144 L0 144 Z"
                fill="#171a26"
                opacity="0.85"
              />

              {/* Menara Nusantara (Kiri) */}
              <rect x="64" y="42" width="46" height="94" rx="2" fill="#121622" />
              <rect x="116" y="64" width="32" height="72" rx="2" fill="#151926" />
              {[52, 66, 80, 94, 108].map((wy, ri) => (
                <g key={`mw-${ri}`}>
                  <rect x="72" y={wy} width="8" height="4" rx="1" fill="#f7c873" opacity={ri % 2 === 0 ? '0.85' : '0.45'} />
                  <rect x="86" y={wy} width="8" height="4" rx="1" fill="#f7c873" opacity={ri === 1 ? '0.9' : '0.35'} />
                  <rect x="98" y={wy} width="6" height="4" rx="1" fill="#f7c873" opacity="0.6" />
                </g>
              ))}

              {/* Jembatan Gantung & Untaian Lampion Tepi Sungai (Tengah) */}
              <rect x="242" y="72" width="5" height="64" fill="#232838" />
              <rect x="388" y="72" width="5" height="64" fill="#232838" />
              <path d="M196 122 Q244 74 244 74 Q316 116 390 74 Q420 110 448 122" fill="none" stroke="#394054" strokeWidth="1.8" />
              {/* Titik Lampion Hangat Sepanjang Jembatan */}
              {[258, 282, 306, 330, 354, 376].map((lx, li) => (
                <g key={`ll-${li}`}>
                  <circle cx={lx} cy={112 + Math.sin(li * 0.9) * 3} r="5.5" fill="#ffb84d" opacity="0.22" />
                  <circle cx={lx} cy={112 + Math.sin(li * 0.9) * 3} r="2.2" fill="#ffd98a" />
                </g>
              ))}

              {/* Rumah Keluarga Damar Jl. Melati No. 14 (Kanan) — Jendela Kuning Menyala Hangat */}
              <g transform="translate(476, 84)">
                <polygon points="0,24 38,0 76,24" fill="#261c22" />
                <rect x="6" y="24" width="64" height="28" fill="#161822" />
                {/* Jendela Ruang Makan Menyala Hangat */}
                <rect x="16" y="31" width="16" height="12" rx="1.5" fill="#ffd27d" />
                <rect x="44" y="31" width="16" height="12" rx="1.5" fill="#ffbe5c" opacity="0.92" />
                {/* Pohon Rindang Samping Rumah */}
                <circle cx="-10" cy="30" r="14" fill="#131922" />
                <circle cx="84" cy="34" r="12" fill="#131922" />
              </g>

              {/* Jalur Rel & Kereta Komuter Senja Melintas Halus */}
              <rect x="0" y="135" width="640" height="4" fill="#222634" />
              <g className="animate-train-glide">
                <rect x="0" y="121" width="52" height="13" rx="3" fill="#2a3346" />
                <rect x="55" y="121" width="52" height="13" rx="3" fill="#2a3346" />
                <rect x="110" y="121" width="56" height="13" rx="3" fill="#2f394e" />
                {/* Jendela Kereta Bercahaya Hangat */}
                {[8, 22, 36, 63, 77, 91, 118, 132, 146].map((wx, wi) => (
                  <rect key={`tw-${wi}`} x={wx} y="125" width="9" height="4.5" rx="1" fill="#ffe19e" opacity="0.92" />
                ))}
                {/* Lampu Depan Kereta */}
                <circle cx="166" cy="129" r="2.2" fill="#fff3c4" />
              </g>

              {/* Permukaan Sungai dengan Refleksi Senja */}
              <rect x="0" y="139" width="640" height="26" fill="url(#riverGlow)" opacity="0.88" />
              <line x1="252" y1="147" x2="384" y2="147" stroke="#ffcb7a" strokeWidth="1.2" opacity="0.32" strokeDasharray="10 8" />
              <line x1="278" y1="154" x2="362" y2="154" stroke="#ffb35c" strokeWidth="1" opacity="0.25" strokeDasharray="6 10" />
            </svg>
          </div>

          {/* Judul & Email Akun (jika sedang login/daftar) */}
          <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-warm-50">
            {loadingOverlay.title}
          </h2>
          <p className="mt-1.5 max-w-lg text-xs md:text-sm text-warm-200/75">
            {loadingOverlay.subtitle}
          </p>

          {loadingOverlay.userEmail && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-warm-300/30 bg-warm-400/12 px-3.5 py-1 text-xs text-warm-200">
              <Cloud className="h-3.5 w-3.5 text-warm-300" />
              <span>{loadingOverlay.userEmail}</span>
            </div>
          )}

          {/* Bilah Progres Halus & Status Tahapan */}
          <div className="mt-6 w-full max-w-md space-y-2.5">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-warm-100/12">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-warm-500 via-warm-300 to-amber-200 transition-all duration-300 ease-out"
                style={{ width: `${clampedProgress}%` }}
              >
                <div className="animate-shimmer-bar absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-warm-200/70">
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-warm-300" />
                <span>{loadingOverlay.stageLabel}</span>
              </span>
              <span className="font-mono font-semibold text-warm-300">{clampedProgress}%</span>
            </div>
          </div>
        </div>

        {/* Bar Bawah: Catatan Hangat / Petunjuk Kota */}
        <div className="relative z-10 mx-auto max-w-xl border-t border-warm-100/10 pt-4 text-center">
          <p className="font-serif italic text-xs md:text-sm leading-relaxed text-warm-200/75">
            {footerNote}
          </p>
        </div>
      </div>
    </Portal>
  );
};
