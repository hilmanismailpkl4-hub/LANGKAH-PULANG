import { useEffect, useState } from 'react';

/**
 * Mendeteksi perangkat ponsel / tablet layar sentuh secara akurat (Android, iOS, iPadOS).
 */
export function detectIsMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0;
  const uaMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent || '');
  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  return uaMobile || (hasTouch && (coarse || shortSide <= 900));
}

export interface MobileViewportState {
  isMobile: boolean;
  isPortrait: boolean;
  isCompactLandscape: boolean;
  isFullscreen: boolean;
  width: number;
  height: number;
}

function readViewportState(): MobileViewportState {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isPortrait: false,
      isCompactLandscape: false,
      isFullscreen: false,
      width: 1280,
      height: 720,
    };
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = detectIsMobileDevice();
  const isPortrait = height > width * 1.02;
  const isCompactLandscape = !isPortrait && (height <= 540 || isMobile);
  const isFullscreen = Boolean(
    document.fullscreenElement ||
      (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement,
  );
  return { isMobile, isPortrait, isCompactLandscape, isFullscreen, width, height };
}

/**
 * Hook reaktif memantau orientasi layar (Portrait vs Landscape), mode compact HP, dan status Fullscreen.
 */
export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>(() => readViewportState());

  useEffect(() => {
    const update = () => setState(readViewportState());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, []);

  return state;
}

/**
 * Meminta layar penuh dan mencoba mengunci orientasi Landscape (didukung Android Chrome/Edge/Brave).
 */
export async function requestLandscapeFullscreen(): Promise<void> {
  try {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    }
  } catch {
    // Beberapa browser iOS Safari tidak mendukung Fullscreen API standar — tetap lanjut normal
  }

  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: 'landscape' | 'landscape-primary') => Promise<void>;
    };
    if (orientation?.lock) {
      await orientation.lock('landscape');
    }
  } catch {
    // Orientasi mungkin belum diizinkan terkunci di browser tertentu
  }
}

export async function toggleFullscreenLandscape(): Promise<void> {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await requestLandscapeFullscreen();
    }
  } catch {
    // Abaikan jika browser membatasi fullscreen
  }
}
