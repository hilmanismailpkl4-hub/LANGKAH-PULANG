import React from 'react';
import { Camera, Download, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

/**
 * Bonus Upgrade: Mode Foto Sinematik [P] — kamera bebas memutar/zoom + simpan screenshot PNG.
 */
export const PhotoModeOverlay: React.FC = () => {
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const showToast = useGameStore((s) => s.showToast);

  if (!isPhotoMode) return null;

  const handleCapture = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      sfxEngine.play('chime');
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `langkah-pulang-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Foto sinematik berhasil disimpan!');
    } catch {
      showToast('Gagal menyimpan foto dari browser ini.');
    }
  };

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9993] flex flex-col justify-between p-6 text-warm-50">
        {/* Garis bingkai kamera tipis */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 rounded-full border border-warm-200/25 bg-dusk-950/70 px-4 py-1.5 text-xs backdrop-blur-md">
            <Camera className="h-3.5 w-3.5 text-warm-300" />
            <span>Mode Foto · Geser Mouse untuk Putar · Scroll untuk Zoom</span>
          </div>

          <button
            type="button"
            onClick={() => setPhotoMode(false)}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-warm-200/25 bg-dusk-950/80 px-3.5 py-1.5 text-xs text-warm-100 backdrop-blur-md hover:border-warm-300/60"
          >
            <X className="h-3.5 w-3.5" />
            <span>Keluar [P / Esc]</span>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleCapture}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-warm-400 px-6 py-3 text-sm font-semibold text-dusk-950 shadow-2xl transition hover:bg-warm-300"
          >
            <Download className="h-4 w-4" />
            <span>Ambil & Simpan Foto (.PNG)</span>
          </button>
        </div>
      </div>
    </Portal>
  );
};
