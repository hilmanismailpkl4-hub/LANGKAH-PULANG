import React, { useState } from 'react';
import { Camera, Download, Frame, Grid3X3, Palette, Smartphone, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { EVENT_FAMILY_BANTERS } from '../../data/familyWalkBanter';
import {
  PHOTO_FILTER_BY_ID,
  PHOTO_FILTER_PRESETS,
  PHOTO_FRAME_PRESETS,
  PhotoFilterPreset,
  PhotoFrameId,
} from '../../data/photoFilters';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const TIME_LABELS = {
  morning: 'Pagi Cerah',
  sunset: 'Senja',
  rain_dusk: 'Sore Berhujan',
  night: 'Malam Tenang',
};

function drawCover(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const srcRatio = src.width / Math.max(1, src.height);
  const dstRatio = dw / Math.max(1, dh);
  let sx = 0;
  let sy = 0;
  let sw = src.width;
  let sh = src.height;

  if (srcRatio > dstRatio) {
    sw = src.height * dstRatio;
    sx = (src.width - sw) * 0.5;
  } else {
    sh = src.width / dstRatio;
    sy = (src.height - sh) * 0.5;
  }
  ctx.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh);
}

/**
 * Merender foto akhir dengan filter film, vignet hangat, dan bingkai Polaroid / Film 35mm opsional
 * agar hasil di Galeri HP Damar dan file unduhan .PNG identik dengan pratinjau layar.
 */
function composeFramedPhoto(
  sourceCanvas: HTMLCanvasElement,
  outW: number,
  outH: number,
  filter: PhotoFilterPreset,
  frameId: PhotoFrameId,
  locationName: string,
  timeLabel: string,
  isFamilyWalk: boolean,
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = outW;
  out.height = outH;
  const ctx = out.getContext('2d');
  if (!ctx) return out;

  const paintPhotoInto = (rx: number, ry: number, rw: number, rh: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rx, ry, rw, rh);
    ctx.clip();

    ctx.filter = filter.cssFilter;
    drawCover(ctx, sourceCanvas, rx, ry, rw, rh);
    ctx.filter = 'none';

    if (filter.tintColor) {
      ctx.fillStyle = filter.tintColor;
      ctx.fillRect(rx, ry, rw, rh);
    }

    if (filter.vignetteOpacity > 0) {
      const cx = rx + rw * 0.5;
      const cy = ry + rh * 0.5;
      const rad = Math.hypot(rw * 0.5, rh * 0.5);
      const vig = ctx.createRadialGradient(cx, cy, rad * 0.45, cx, cy, rad * 1.04);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, `rgba(10, 8, 12, ${filter.vignetteOpacity})`);
      ctx.fillStyle = vig;
      ctx.fillRect(rx, ry, rw, rh);
    }
    ctx.restore();
  };

  if (frameId === 'polaroid') {
    // Kertas Polaroid krem hangat + ruang catatan di bagian bawah
    ctx.fillStyle = '#f6f0e4';
    ctx.fillRect(0, 0, outW, outH);

    // Garis tepi kertas tipis
    ctx.strokeStyle = 'rgba(130, 112, 92, 0.28)';
    ctx.lineWidth = Math.max(2, outW * 0.003);
    ctx.strokeRect(0, 0, outW, outH);

    const padX = Math.round(outW * 0.055);
    const padTop = Math.round(outH * 0.068);
    const padBottom = Math.round(outH * 0.22);
    const imgW = outW - padX * 2;
    const imgH = outH - padTop - padBottom;

    paintPhotoInto(padX, padTop, imgW, imgH);

    // Bingkai tipis sekitar area gambar
    ctx.strokeStyle = 'rgba(40, 32, 24, 0.16)';
    ctx.lineWidth = Math.max(1.5, outW * 0.0018);
    ctx.strokeRect(padX, padTop, imgW, imgH);

    // Catatan tangan bergaya serif di margin bawah Polaroid
    const captionY = padTop + imgH + padBottom * 0.46;
    ctx.fillStyle = '#2d2621';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `italic ${Math.round(outH * 0.044)}px Georgia, serif`;
    ctx.fillText(`${locationName}  ·  ${timeLabel}`, outW * 0.5, captionY);

    ctx.fillStyle = '#756657';
    ctx.font = `${Math.round(outH * 0.025)}px sans-serif`;
    ctx.fillText(
      isFamilyWalk ? 'Damar, Nadia & Kira — Langkah Pulang' : 'Catatan Langkah Pulang',
      outW * 0.5,
      captionY + outH * 0.052,
    );
  } else if (frameId === 'film35mm') {
    // Strip Film 35mm Hitam Matte dengan Lubang Sproket & Stempel Tanggal Oranye
    ctx.fillStyle = '#111216';
    ctx.fillRect(0, 0, outW, outH);

    const stripH = Math.round(outH * 0.115);
    const sidePad = Math.round(outW * 0.028);
    const imgW = outW - sidePad * 2;
    const imgH = outH - stripH * 2;

    paintPhotoInto(sidePad, stripH, imgW, imgH);

    // Garis frame tipis film analog
    ctx.strokeStyle = 'rgba(245, 194, 108, 0.25)';
    ctx.lineWidth = Math.max(1.5, outW * 0.0016);
    ctx.strokeRect(sidePad, stripH, imgW, imgH);

    // Lubang sproket film di strip atas & bawah
    const holeCount = 12;
    const holeW = outW * 0.036;
    const holeH = stripH * 0.44;
    const holeRadius = Math.max(2, holeH * 0.22);
    ctx.fillStyle = '#e7dfd1';
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < holeCount; i++) {
      const hx = ((i + 0.5) / holeCount) * outW - holeW * 0.5;
      const topY = (stripH - holeH) * 0.5;
      const botY = outH - stripH + (stripH - holeH) * 0.5;
      ctx.beginPath();
      ctx.roundRect(hx, topY, holeW, holeH, holeRadius);
      ctx.roundRect(hx, botY, holeW, holeH, holeRadius);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Kode gulungan film di pojok kiri atas
    ctx.fillStyle = 'rgba(245, 185, 92, 0.72)';
    ctx.font = `bold ${Math.round(outH * 0.023)}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`LP 400 · ${filter.label.toUpperCase()}`, sidePad + 6, stripH * 0.5);

    // Stempel oranye analog di sudut kanan bawah foto
    ctx.fillStyle = 'rgba(255, 152, 66, 0.92)';
    ctx.font = `bold ${Math.round(outH * 0.028)}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(
      `${locationName.toUpperCase()} · ${timeLabel.toUpperCase()}`,
      sidePad + imgW - Math.round(outW * 0.022),
      stripH + imgH - Math.round(outH * 0.038),
    );
  } else {
    paintPhotoInto(0, 0, outW, outH);
  }

  return out;
}

/**
 * Mode Foto Sinematik [P] — kamera bebas memutar/zoom, 5 filter film hangat real-time,
 * 3 bingkai foto opsional (Tanpa Bingkai / Polaroid / Film 35mm), simpan Galeri HP & unduh PNG.
 */
export const PhotoModeOverlay: React.FC = () => {
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const photoFilter = useGameStore((s) => s.photoFilter);
  const setPhotoFilter = useGameStore((s) => s.setPhotoFilter);
  const photoFrame = useGameStore((s) => s.photoFrame);
  const setPhotoFrame = useGameStore((s) => s.setPhotoFrame);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const addPlayerPhoto = useGameStore((s) => s.addPlayerPhoto);
  const openPhone = useGameStore((s) => s.openPhone);
  const showToast = useGameStore((s) => s.showToast);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const playFamilyBanter = useGameStore((s) => s.playFamilyBanter);

  const [showGrid, setShowGrid] = useState(false);

  if (!isPhotoMode) return null;

  const activeFilter = PHOTO_FILTER_BY_ID[photoFilter];
  const loc = LOCATION_BY_ID[currentLocation];
  const timeLabel = TIME_LABELS[timeOfDay];

  const captureDataUrl = (downloadAlso: boolean) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    try {
      sfxEngine.play('chime');

      // 1. Thumbnail JPEG ringan untuk Galeri HP Damar (sudah menyatu dengan filter & bingkai!)
      const thumbCanvas = composeFramedPhoto(
        canvas,
        720,
        photoFrame === 'polaroid' ? 540 : 405,
        activeFilter,
        photoFrame,
        loc.name,
        timeLabel,
        isFamilyWalkActive,
      );

      const filterSuffix = photoFilter !== 'natural' ? ` · ${activeFilter.label}` : '';
      addPlayerPhoto({
        id: `photo_${Date.now()}`,
        dataUrl: thumbCanvas.toDataURL('image/jpeg', 0.86),
        locationName: loc.name,
        timeLabel: `${timeLabel}${filterSuffix}`,
        caption: isFamilyWalkActive
          ? `Foto keluarga hangat bersama Nadia & Kira di ${loc.name} saat ${timeLabel.toLowerCase()}.`
          : `Jepretan di ${loc.name} saat ${timeLabel.toLowerCase()}.`,
      });

      if (isFamilyWalkActive) {
        playFamilyBanter(EVENT_FAMILY_BANTERS.activity_photo, 'fw_photo');
      }

      // 2. Unduh PNG resolusi tinggi lengkap dengan filter film & bingkai foto
      if (downloadAlso) {
        const hiW = Math.max(1280, Math.min(1920, canvas.width || 1600));
        const hiH = photoFrame === 'polaroid' ? Math.round(hiW * 0.75) : Math.round((hiW * 9) / 16);
        const hiCanvas = composeFramedPhoto(
          canvas,
          hiW,
          hiH,
          activeFilter,
          photoFrame,
          loc.name,
          timeLabel,
          isFamilyWalkActive,
        );
        const dataUrl = hiCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `langkah-pulang-${photoFilter}-${Date.now()}.png`;
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
      {/* Pratinjau Langsung Grid Rule-of-Thirds */}
      {showGrid && (
        <div className="pointer-events-none fixed inset-0 z-[9991]">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-warm-100/20" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-warm-100/20" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-warm-100/20" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-warm-100/20" />
        </div>
      )}

      {/* Pratinjau Bingkai Foto Opsional Live (pointer-events-none agar drag & zoom tetap 100% mulus!) */}
      {photoFrame === 'polaroid' && (
        <div className="pointer-events-none fixed inset-x-6 top-16 bottom-32 z-[9992] flex items-center justify-center">
          <div className="relative h-full w-full max-w-5xl rounded-md border-[14px] border-b-[72px] border-[#f6f0e4]/95 shadow-[0_0_0_9999px_rgba(8,10,16,0.42),inset_0_0_0_1px_rgba(40,32,24,0.18)]">
            <div className="absolute -bottom-[62px] left-0 right-0 flex flex-col items-center justify-center text-center">
              <p className="font-serif text-sm italic text-[#2d2621]">
                {loc.name} · {timeLabel}
              </p>
              <p className="text-[10px] tracking-wide text-[#756657]">
                {isFamilyWalkActive ? 'Damar, Nadia & Kira — Langkah Pulang' : 'Catatan Langkah Pulang'}
              </p>
            </div>
          </div>
        </div>
      )}

      {photoFrame === 'film35mm' && (
        <div className="pointer-events-none fixed inset-0 z-[9992] flex flex-col justify-between">
          <div className="flex h-12 items-center justify-between border-b border-amber-300/20 bg-[#111216]/92 px-6">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-amber-300/75">
              LP 400 · {activeFilter.label.toUpperCase()}
            </span>
            <div className="hidden items-center gap-4 sm:flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={`sp-t-${i}`} className="h-4 w-7 rounded-[3px] bg-warm-100/20" />
              ))}
            </div>
            <span className="font-mono text-[10px] text-amber-300/65">35MM</span>
          </div>

          <div className="relative flex-1 mx-4 border-x border-amber-300/15">
            <span className="absolute bottom-24 right-4 font-mono text-xs font-bold tracking-wider text-orange-400/95 drop-shadow">
              {loc.name.toUpperCase()} · {timeLabel.toUpperCase()}
            </span>
          </div>

          <div className="flex h-12 items-center justify-center gap-4 border-t border-amber-300/20 bg-[#111216]/92 px-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={`sp-b-${i}`} className="h-4 w-7 rounded-[3px] bg-warm-100/20" />
            ))}
          </div>
        </div>
      )}

      {/* Kontrol Kamera Mode Foto */}
      <div className="pointer-events-none fixed inset-0 z-[9993] flex flex-col justify-between p-5 text-warm-50">
        {/* Bar Atas */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-warm-200/25 bg-dusk-950/75 px-4 py-1.5 text-xs backdrop-blur-md">
              <Camera className="h-3.5 w-3.5 text-warm-300" />
              <span>Mode Foto · Geser Mouse Putar · Scroll Zoom</span>
            </div>
            {isFamilyWalkActive && (
              <div className="rounded-full border border-rose-300/40 bg-rose-950/80 px-3.5 py-1.5 text-xs text-rose-100 backdrop-blur-md">
                Nadia & Kira sedang berpose ceria ke arah kamera!
              </div>
            )}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sfxEngine.play('switch');
                setShowGrid((v) => !v);
              }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs backdrop-blur-md transition ${
                showGrid
                  ? 'border-warm-300 bg-warm-400/25 text-warm-100'
                  : 'border-warm-200/25 bg-dusk-950/80 text-warm-200 hover:border-warm-300/60'
              }`}
              title="Garis Bantu Komposisi 3x3"
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid 3×3</span>
            </button>
            <button
              type="button"
              onClick={() => setPhotoMode(false)}
              className="flex items-center gap-1.5 rounded-full border border-warm-200/25 bg-dusk-950/85 px-3.5 py-1.5 text-xs text-warm-100 backdrop-blur-md hover:border-warm-300/60"
            >
              <X className="h-3.5 w-3.5" />
              <span>Keluar [P / Esc]</span>
            </button>
          </div>
        </div>

        {/* Panel Bawah: Pilihan Filter Film, Bingkai Foto & Tombol Jepret */}
        <div className="flex flex-col items-center gap-2.5">
          {/* Bar Pilihan Filter & Bingkai */}
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-warm-200/20 bg-dusk-950/82 px-3.5 py-2 backdrop-blur-md shadow-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-warm-300/80">
                <Palette className="h-3 w-3" /> Filter:
              </span>
              {PHOTO_FILTER_PRESETS.map((preset) => {
                const active = photoFilter === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPhotoFilter(preset.id)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                      active
                        ? 'bg-warm-400 text-dusk-950 shadow'
                        : 'bg-dusk-900/80 text-warm-200/80 hover:bg-dusk-800 hover:text-warm-50'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${preset.swatchClass}`} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="hidden h-4 w-px bg-warm-100/15 md:inline-block" />

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-warm-300/80">
                <Frame className="h-3 w-3" /> Bingkai:
              </span>
              {PHOTO_FRAME_PRESETS.map((fr) => {
                const active = photoFrame === fr.id;
                return (
                  <button
                    key={fr.id}
                    type="button"
                    onClick={() => setPhotoFrame(fr.id)}
                    title={fr.description}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                      active
                        ? 'bg-amber-300 text-dusk-950 shadow'
                        : 'bg-dusk-900/80 text-warm-200/80 hover:bg-dusk-800 hover:text-warm-50'
                    }`}
                  >
                    {fr.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tombol Simpan & Unduh */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => captureDataUrl(false)}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-warm-200/35 bg-dusk-950/88 px-5 py-2.5 text-xs font-medium text-warm-50 backdrop-blur-md transition hover:border-warm-300"
            >
              <Smartphone className="h-4 w-4 text-warm-300" />
              <span>Simpan ke Galeri HP</span>
            </button>
            <button
              type="button"
              onClick={() => captureDataUrl(true)}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-warm-400 px-6 py-2.5 text-sm font-semibold text-dusk-950 shadow-2xl transition hover:bg-warm-300"
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
              className="pointer-events-auto rounded-full border border-warm-100/20 bg-dusk-950/80 px-4 py-2.5 text-xs text-warm-200 hover:text-warm-50"
            >
              Lihat Galeri HP
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
