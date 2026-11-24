import React from 'react';
import { Camera, Download, Smartphone, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const TIME_LABELS = {
  morning: 'Pagi',
  sunset: 'Senja',
  rain_dusk: 'Sore Berhujan',
  night: 'Malam Tenang',
};

/**
 * Mode Foto Sinematik [P] — kamera bebas memutar/zoom, simpan ke Galeri HP Damar & unduh PNG.
 */
export const PhotoModeOverlay: React.FC = () => {
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const addPlayerPhoto = useGameStore((s) => s.addPlayerPhoto);
  const openPhone = useGameStore((s) => s.openPhone);
  const showToast = useGameStore((s) => s.showToast);

  if (!isPhotoMode) return null;

  const captureDataUrl = (downloadAlso: boolean) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      sfxEngine.play('chime');
      // Simpan thumbnail JPEG ringan ke Galeri HP Damar
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 640;
      thumbCanvas.height = 360;
      const ctx = thumbCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, 640, 360);
        const loc = LOCATION_BY_ID[currentLocation];
        addPlayerPhoto({
          id: `photo_${Date.now()}`,
          dataUrl: thumbCanvas.toDataURL('image/jpeg', 0.82),
          locationName: loc.name,
          timeLabel: TIME_LABELS[timeOfDay],
          caption: `Jepretan di ${loc.name} saat ${TIME_LABELS[timeOfDay].toLowerCase()}.`,
        });
      }

      if (downloadAlso) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `langkah-pulang-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        showToast('Foto disimpan ke Galeri HP Damar & diunduh (.PNG)!');
      } else {
        showToast('Foto tersimpan ke Galeri HP Damar!');
      }
    } catch {
      showToast('Gagal menyimpan foto dari browser ini.');
    }
  };

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9993] flex flex-col justify-between p-6 text-warm-50">
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

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => captureDataUrl(false)}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-warm-200/35 bg-dusk-950/85 px-5 py-3 text-xs font-medium text-warm-50 backdrop-blur-md transition hover:border-warm-300"
          >
            <Smartphone className="h-4 w-4 text-warm-300" />
            <span>Simpan ke Galeri HP</span>
          </button>
          <button
            type="button"
            onClick={() => captureDataUrl(true)}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-warm-400 px-6 py-3 text-sm font-semibold text-dusk-950 shadow-2xl transition hover:bg-warm-300"
          >
            <Download className="h-4 w-4" />
            <span>Simpan ke Galeri & Unduh (.PNG)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPhotoMode(false);
              openPhone('gallery');
            }}
            className="pointer-events-auto rounded-full border border-warm-100/20 bg-dusk-950/75 px-4 py-3 text-xs text-warm-200 hover:text-warm-50"
          >
            Lihat Galeri HP
          </button>
        </div>
      </div>
    </Portal>
  );
};
