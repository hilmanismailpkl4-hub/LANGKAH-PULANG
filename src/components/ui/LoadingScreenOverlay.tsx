import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Cloud, Compass, HardDriveDownload, Home, KeyRound, Loader2 } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

const CITY_TIPS = [
  'Gunakan tombol Ajak Keluarga [G] kapan saja untuk berjalan santai bersama Nadia & Kira.',
  'Saat sore dan malam, untaian lampion tepi sungai dan gerobak kuliner warga menyala hangat.',
  'Aktifkan Mode HP Kentang (60 FPS) & Indikator FPS di Pengaturan Grafis untuk performa super-lancar di HP.',
  'Buka Mode Foto [P] untuk mengabadikan senja dengan 5 filter film hangat & bingkai Polaroid.',
  'Buka Ponsel Damar [H] untuk mengganti suasana waktu (Pagi, Senja, Hujan, Malam) dan memutar radio kota.',
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

// Ukuran total berkas build terbaru yang dihitung otomatis saat Vite build (naik atau turun)
function getLiveBuildBytes(): number {
  if (typeof window !== 'undefined') {
    const injected = (window as unknown as { __LP_BUILD_BYTES__?: number }).__LP_BUILD_BYTES__;
    if (typeof injected === 'number' && Number.isFinite(injected) && injected > 0) {
      return injected;
    }
  }
  return 2900 * 1024;
}

function formatByteSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.max(0, Math.round(bytes / 1024))} KB`;
}

interface AssetDownloadSnapshot {
  loadedBytes: number;
  totalBytes: number;
  resourceCount: number;
  fromCache: boolean;
}

function readBrowserAssetStats(displayPct: number): AssetDownloadSnapshot {
  let decodedSum = 0;
  let transferSum = 0;
  let count = 0;

  try {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const size = e.decodedBodySize || e.encodedBodySize || e.transferSize || 0;
      if (size > 0) {
        decodedSum += size;
        transferSum += e.transferSize || 0;
        count += 1;
      }
    }
  } catch {
    // Abaikan jika browser membatasi Performance API
  }

  // Selalu ikuti ukuran build terbaru secara persis (bisa naik maupun turun saat update!)
  const totalBytes = getLiveBuildBytes();
  const clamped = Math.max(0, Math.min(100, displayPct));
  const loadedBytes = clamped >= 100 ? totalBytes : Math.round((clamped / 100) * totalBytes);
  const fromCache = count > 0 && decodedSum > 400 * 1024 && transferSum === 0;

  return {
    loadedBytes,
    totalBytes,
    resourceCount: Math.max(count, 7),
    fromCache,
  };
}

/**
 * Layar Loading Sinematik Bernuansa Senja Indonesia:
 * Menampilkan progres 0% -> 100% yang benar-benar berjalan mulus (requestAnimationFrame,
 * tanpa nested setState), ukuran aset real-time (MB / KB), skala 0–25–50–75–100%,
 * serta tata letak 2 kolom mendatar khusus HP landscape agar tidak pernah terpotong!
 */
export const LoadingScreenOverlay: React.FC = () => {
  const loadingOverlay = useGameStore((s) => s.loadingOverlay);
  const { isMobile, isCompactLandscape } = useMobileViewport();

  // Sambung mulus dari persentase pra-boot HTML agar terasa seperti SATU layar loading utuh 0% -> 100%
  const initialBootPct =
    typeof window !== 'undefined' && typeof (window as unknown as { __lpBootPct?: number }).__lpBootPct === 'number'
      ? Math.min(45, Math.max(0, Math.round((window as unknown as { __lpBootPct?: number }).__lpBootPct ?? 0)))
      : 0;

  const [rendered, setRendered] = useState(loadingOverlay.visible);
  const [fadingOut, setFadingOut] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(initialBootPct);
  const [assetStats, setAssetStats] = useState<AssetDownloadSnapshot>(() =>
    readBrowserAssetStats(initialBootPct),
  );

  const curPctRef = useRef(initialBootPct);
  const targetPctRef = useRef(loadingOverlay.progress);
  const wantVisibleRef = useRef(loadingOverlay.visible);
  const prevVisibleRef = useRef(loadingOverlay.visible);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    targetPctRef.current = loadingOverlay.progress;
  }, [loadingOverlay.progress]);

  useEffect(() => {
    wantVisibleRef.current = loadingOverlay.visible;

    if (loadingOverlay.visible) {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setFadingOut(false);
      setRendered(true);
      // Saat layar loading dibuka ulang (mis. sinkronisasi akun login), mulai bersih dari 0%
      if (!prevVisibleRef.current) {
        curPctRef.current = 0;
        setDisplayProgress(0);
        setAssetStats(readBrowserAssetStats(0));
        setTipIndex(Math.floor(Math.random() * CITY_TIPS.length));
      }
    }
    prevVisibleRef.current = loadingOverlay.visible;
  }, [loadingOverlay.visible]);

  // Loop animasi requestAnimationFrame bertahap konstan 0% -> 100% (dijamin paling lama 15 detik!)
  useEffect(() => {
    if (!rendered) return;
    let rafId = 0;
    const startedAt = performance.now();
    let lastTime = startedAt;
    let lastReportedInt = Math.round(curPctRef.current);
    let reached100At: number | null = null;

    const tick = (now: number) => {
      const dtSec = Math.min(0.06, Math.max(0.008, (now - lastTime) / 1000));
      lastTime = now;
      const elapsedMs = now - startedAt;

      const wantVisible = wantVisibleRef.current;
      const forceDoneByCap = elapsedMs >= 14000;
      const readyToFinish = !wantVisible || targetPctRef.current >= 100 || elapsedMs >= 11500;

      let cur = curPctRef.current;
      if (forceDoneByCap) {
        cur = 100;
      } else if (readyToFinish) {
        const steadyFinishSpeed = 36;
        cur = Math.min(100, cur + steadyFinishSpeed * dtSec);
      } else {
        const stepSpeed = cur < 72 ? 25 : cur < 88 ? 15 : Math.max(2.5, (96 - cur) * 0.65);
        cur = Math.min(96, cur + stepSpeed * dtSec);
      }

      curPctRef.current = cur;
      const rounded = Math.round(cur);
      if (rounded !== lastReportedInt) {
        lastReportedInt = rounded;
        setDisplayProgress(rounded);
        setAssetStats(readBrowserAssetStats(rounded));
      }

      if ((!wantVisible || forceDoneByCap) && rounded >= 100) {
        if (reached100At === null) {
          reached100At = now;
        } else if (now - reached100At >= 200 || forceDoneByCap) {
          setFadingOut(true);
          if (hideTimerRef.current === null) {
            hideTimerRef.current = window.setTimeout(() => {
              setRendered(false);
              setFadingOut(false);
              hideTimerRef.current = null;
            }, 340);
          }
          return;
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [rendered]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

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

  const compact = isMobile || isCompactLandscape;
  const isAuthMode = loadingOverlay.mode === 'login' || loadingOverlay.mode === 'register';
  const clampedProgress = Math.max(0, Math.min(100, displayProgress));
  const footerNote = isAuthMode
    ? LOGIN_QUOTES[tipIndex % LOGIN_QUOTES.length]
    : CITY_TIPS[tipIndex % CITY_TIPS.length];
  const BadgeIcon = modeBadge.Icon;

  const dynamicStageLabel = useMemo(() => {
    if (isAuthMode) return loadingOverlay.stageLabel;
    if (clampedProgress < 25) return 'Mengunduh berkas aplikasi & mesin 3D...';
    if (clampedProgress < 50) return 'Memeriksa arsip perjalanan & pengaturan...';
    if (clampedProgress < 75) return 'Menyiapkan bangunan, jalan & suasana Kota Senja...';
    if (clampedProgress < 100) return 'Menyempurnakan pencahayaan & detail 3D...';
    return 'Selamat datang di Langkah Pulang!';
  }, [isAuthMode, loadingOverlay.stageLabel, clampedProgress]);

  const sizeReadout = isAuthMode
    ? `Sinkronisasi akun · ${formatByteSize(assetStats.loadedBytes)} siap`
    : `${formatByteSize(assetStats.loadedBytes)} / ${formatByteSize(assetStats.totalBytes)}${
        assetStats.fromCache ? ' (cache)' : ''
      }`;

  const renderSkylineCard = () => (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-warm-200/15 bg-gradient-to-b from-[#161b2c]/85 via-[#251f2d]/80 to-[#14141c]/95 shadow-2xl backdrop-blur-md ${
        compact ? 'px-2.5 pt-3 pb-1.5' : 'mb-5 max-w-xl px-4 pt-5 pb-2'
      }`}
    >
      <svg viewBox="0 0 640 165" className="h-auto w-full" aria-hidden="true">
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

        <circle cx="320" cy="108" r="68" fill="url(#duskSun)" />
        <circle cx="320" cy="106" r="24" fill="#ffe2a8" opacity="0.88" />

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

        <path
          d="M0 132 Q80 98 165 118 T340 115 T520 105 T640 124 L640 144 L0 144 Z"
          fill="#171a26"
          opacity="0.85"
        />

        <rect x="64" y="42" width="46" height="94" rx="2" fill="#121622" />
        <rect x="116" y="64" width="32" height="72" rx="2" fill="#151926" />
        {[52, 66, 80, 94, 108].map((wy, ri) => (
          <g key={`mw-${ri}`}>
            <rect x="72" y={wy} width="8" height="4" rx="1" fill="#f7c873" opacity={ri % 2 === 0 ? '0.85' : '0.45'} />
            <rect x="86" y={wy} width="8" height="4" rx="1" fill="#f7c873" opacity={ri === 1 ? '0.9' : '0.35'} />
            <rect x="98" y={wy} width="6" height="4" rx="1" fill="#f7c873" opacity="0.6" />
          </g>
        ))}

        <rect x="242" y="72" width="5" height="64" fill="#232838" />
        <rect x="388" y="72" width="5" height="64" fill="#232838" />
        <path d="M196 122 Q244 74 244 74 Q316 116 390 74 Q420 110 448 122" fill="none" stroke="#394054" strokeWidth="1.8" />
        {[258, 282, 306, 330, 354, 376].map((lx, li) => (
          <g key={`ll-${li}`}>
            <circle cx={lx} cy={112 + Math.sin(li * 0.9) * 3} r="5.5" fill="#ffb84d" opacity="0.22" />
            <circle cx={lx} cy={112 + Math.sin(li * 0.9) * 3} r="2.2" fill="#ffd98a" />
          </g>
        ))}

        <g transform="translate(476, 84)">
          <polygon points="0,24 38,0 76,24" fill="#261c22" />
          <rect x="6" y="24" width="64" height="28" fill="#161822" />
          <rect x="16" y="31" width="16" height="12" rx="1.5" fill="#ffd27d" />
          <rect x="44" y="31" width="16" height="12" rx="1.5" fill="#ffbe5c" opacity="0.92" />
          <circle cx="-10" cy="30" r="14" fill="#131922" />
          <circle cx="84" cy="34" r="12" fill="#131922" />
        </g>

        <rect x="0" y="135" width="640" height="4" fill="#222634" />
        <g className="animate-train-glide">
          <rect x="0" y="121" width="52" height="13" rx="3" fill="#2a3346" />
          <rect x="55" y="121" width="52" height="13" rx="3" fill="#2a3346" />
          <rect x="110" y="121" width="56" height="13" rx="3" fill="#2f394e" />
          {[8, 22, 36, 63, 77, 91, 118, 132, 146].map((wx, wi) => (
            <rect key={`tw-${wi}`} x={wx} y="125" width="9" height="4.5" rx="1" fill="#ffe19e" opacity="0.92" />
          ))}
          <circle cx="166" cy="129" r="2.2" fill="#fff3c4" />
        </g>

        <rect x="0" y="139" width="640" height="26" fill="url(#riverGlow)" opacity="0.88" />
        <line x1="252" y1="147" x2="384" y2="147" stroke="#ffcb7a" strokeWidth="1.2" opacity="0.32" strokeDasharray="10 8" />
        <line x1="278" y1="154" x2="362" y2="154" stroke="#ffb35c" strokeWidth="1" opacity="0.25" strokeDasharray="6 10" />
      </svg>
    </div>
  );

  const renderProgressBlock = () => (
    <div className={`w-full space-y-2 ${compact ? 'mt-2.5' : 'mt-5 max-w-md'}`}>
      {/* Baris Utama: Ukuran Aset MB/KB + Angka Persentase Besar 0%–100% */}
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-warm-200/90">
          <HardDriveDownload className="h-3.5 w-3.5 shrink-0 text-warm-300" />
          <span className="font-mono tabular-nums">{sizeReadout}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={`font-mono font-bold tabular-nums leading-none text-warm-300 ${
              compact ? 'text-2xl' : 'text-3xl'
            }`}
          >
            {clampedProgress}%
          </span>
        </div>
      </div>

      {/* Bilah Progres 0%–100% dengan Shimmer Halus */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-warm-100/15 ring-1 ring-warm-200/15">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-warm-500 via-warm-300 to-amber-200"
          style={{ width: `${clampedProgress}%` }}
        >
          <div className="animate-shimmer-bar absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
        </div>
      </div>

      {/* Skala Visual 0% — 25% — 50% — 75% — 100% */}
      <div className="flex items-center justify-between font-mono text-[9.5px] tabular-nums text-warm-200/50">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span
            key={tick}
            className={clampedProgress >= tick ? 'font-semibold text-warm-300/90' : undefined}
          >
            {tick}%
          </span>
        ))}
      </div>

      {/* Label Tahapan & Jumlah Berkas */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-warm-200/80">
        <span className="flex min-w-0 items-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-warm-300" />
          <span className="truncate">{dynamicStageLabel}</span>
        </span>
        <span className="shrink-0 font-mono text-[10px] text-warm-200/60">
          {assetStats.resourceCount} aset
        </span>
      </div>
    </div>
  );

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0b0e17] via-[#151824] to-[#23191d] text-warm-50 transition-opacity duration-400 ${
          compact ? 'px-5 py-3' : 'px-6 py-8 md:px-14 md:py-10'
        } ${fadingOut ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
      >
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

        {/* Bar Atas */}
        <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-warm-200/75">
            <span className="h-2 w-2 rounded-full bg-warm-400 animate-gentlePulse" />
            <span>LANGKAH PULANG · STEPS HOME</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-warm-300/25 bg-dusk-950/60 px-3 py-1 text-[10.5px] font-medium text-warm-200 backdrop-blur-md">
            <BadgeIcon className="h-3.5 w-3.5 text-warm-300" />
            <span>{modeBadge.label}</span>
          </div>
        </div>

        {/* Bagian Tengah: 2-Kolom Mendatar di HP Landscape atau Centered Sinematik di Desktop */}
        {compact ? (
          <div className="relative z-10 mx-auto my-auto grid w-full max-w-3xl grid-cols-12 items-center gap-5">
            <div className="col-span-5">{renderSkylineCard()}</div>
            <div className="col-span-7 flex flex-col items-start text-left">
              <h2 className="font-serif text-xl font-medium tracking-tight text-warm-50">
                {loadingOverlay.title}
              </h2>
              <p className="mt-0.5 text-[11px] leading-snug text-warm-200/75">
                {loadingOverlay.subtitle}
              </p>
              {loadingOverlay.userEmail && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-warm-300/30 bg-warm-400/12 px-2.5 py-0.5 text-[10.5px] text-warm-200">
                  <Cloud className="h-3 w-3 text-warm-300" />
                  <span>{loadingOverlay.userEmail}</span>
                </div>
              )}
              {renderProgressBlock()}
            </div>
          </div>
        ) : (
          <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
            {renderSkylineCard()}

            <h2 className="font-serif text-2xl font-medium tracking-tight text-warm-50 md:text-3xl">
              {loadingOverlay.title}
            </h2>
            <p className="mt-1.5 max-w-lg text-xs text-warm-200/75 md:text-sm">
              {loadingOverlay.subtitle}
            </p>

            {loadingOverlay.userEmail && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-warm-300/30 bg-warm-400/12 px-3.5 py-1 text-xs text-warm-200">
                <Cloud className="h-3.5 w-3.5 text-warm-300" />
                <span>{loadingOverlay.userEmail}</span>
              </div>
            )}

            {renderProgressBlock()}
          </div>
        )}

        {/* Bar Bawah */}
        <div
          className={`relative z-10 mx-auto max-w-2xl shrink-0 border-t border-warm-100/10 text-center ${
            compact ? 'pt-2' : 'pt-4'
          }`}
        >
          <p className={`font-serif italic leading-relaxed text-warm-200/75 ${compact ? 'text-[11px]' : 'text-xs md:text-sm'}`}>
            {footerNote}
          </p>
        </div>
      </div>
    </Portal>
  );
};
