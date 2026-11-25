import React, { useState } from 'react';
import { Maximize2, RotateCw, Smartphone } from 'lucide-react';
import { requestLandscapeFullscreen, useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

/**
 * Overlay ramah khusus pengguna HP saat layar masih dalam posisi Portrait (tegak):
 * mengarahkan pemain memutar HP ke posisi Landscape (mendatar) + tombol Layar Penuh satu ketukan.
 */
export const MobileLandscapeOverlay: React.FC = () => {
  const { isMobile, isPortrait } = useMobileViewport();
  const [bypassPortrait, setBypassPortrait] = useState(false);

  if (!isMobile || !isPortrait || bypassPortrait) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[10050] flex flex-col items-center justify-center bg-dusk-950/96 px-7 text-center text-warm-50 backdrop-blur-xl">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-warm-300/35 bg-dusk-900/90 shadow-2xl">
          <Smartphone className="h-11 w-11 text-warm-300 transition-transform duration-700 -rotate-90 animate-pulse" />
          <RotateCw className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-warm-400 p-1 text-dusk-950 shadow-lg" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-warm-300/90">
          LANGKAH PULANG · Versi HP
        </p>
        <h2 className="mt-2 font-serif text-2xl font-medium text-warm-50">
          Putar HP ke Posisi Landscape
        </h2>
        <p className="mt-3 max-w-xs text-xs leading-relaxed text-warm-200/75">
          Tampilan mendatar (<em>landscape</em>) memberi sudut pandang Kota Senja lebih luas serta
          posisi joystick &amp; tombol sentuh yang nyaman dan ringan tanpa lag.
        </p>

        <button
          type="button"
          onClick={() => {
            void requestLandscapeFullscreen();
          }}
          className="mt-6 flex items-center gap-2.5 rounded-xl bg-warm-400 px-6 py-3.5 text-sm font-semibold text-dusk-950 shadow-lg shadow-warm-500/20 active:scale-95"
        >
          <Maximize2 className="h-4 w-4" />
          <span>Masuk Layar Penuh Landscape</span>
        </button>

        <button
          type="button"
          onClick={() => setBypassPortrait(true)}
          className="mt-4 text-[11px] text-warm-200/55 underline underline-offset-4 hover:text-warm-100"
        >
          Tetap lanjut di posisi tegak (portrait)
        </button>
      </div>
    </Portal>
  );
};
