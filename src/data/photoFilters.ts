export type PhotoFilterId = 'natural' | 'senja_35mm' | 'film_retro' | 'malam_lampion' | 'monokrom';

export type PhotoFrameId = 'none' | 'polaroid' | 'film35mm';

export interface PhotoFilterPreset {
  id: PhotoFilterId;
  label: string;
  cssFilter: string;
  tintColor: string | null;
  vignetteOpacity: number;
  swatchClass: string;
}

export interface PhotoFramePreset {
  id: PhotoFrameId;
  label: string;
  description: string;
}

export const PHOTO_FILTER_PRESETS: PhotoFilterPreset[] = [
  {
    id: 'natural',
    label: 'Asli',
    cssFilter: 'none',
    tintColor: null,
    vignetteOpacity: 0.14,
    swatchClass: 'from-sky-300 to-amber-200',
  },
  {
    id: 'senja_35mm',
    label: 'Senja 35mm',
    cssFilter: 'contrast(1.08) saturate(1.24) sepia(0.24) brightness(1.03)',
    tintColor: 'rgba(255, 174, 86, 0.11)',
    vignetteOpacity: 0.34,
    swatchClass: 'from-amber-400 to-orange-600',
  },
  {
    id: 'film_retro',
    label: 'Film Retro',
    cssFilter: 'contrast(1.06) saturate(1.14) hue-rotate(-7deg) sepia(0.14) brightness(1.02)',
    tintColor: 'rgba(130, 198, 178, 0.08)',
    vignetteOpacity: 0.28,
    swatchClass: 'from-emerald-400 to-amber-300',
  },
  {
    id: 'malam_lampion',
    label: 'Malam Lampion',
    cssFilter: 'contrast(1.16) saturate(1.32) sepia(0.16) brightness(1.02)',
    tintColor: 'rgba(255, 138, 61, 0.12)',
    vignetteOpacity: 0.42,
    swatchClass: 'from-rose-500 to-amber-400',
  },
  {
    id: 'monokrom',
    label: 'Monokrom',
    cssFilter: 'grayscale(1) contrast(1.2) brightness(1.04)',
    tintColor: 'rgba(235, 226, 212, 0.05)',
    vignetteOpacity: 0.38,
    swatchClass: 'from-zinc-200 to-zinc-700',
  },
];

export const PHOTO_FILTER_BY_ID: Record<PhotoFilterId, PhotoFilterPreset> = PHOTO_FILTER_PRESETS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<PhotoFilterId, PhotoFilterPreset>,
);

export const PHOTO_FRAME_PRESETS: PhotoFramePreset[] = [
  { id: 'none', label: 'Tanpa Bingkai', description: 'Layar penuh sinematik' },
  { id: 'polaroid', label: 'Polaroid Klasik', description: 'Bingkai kertas hangat & catatan lokasi' },
  { id: 'film35mm', label: 'Film 35mm', description: 'Strip film analog dengan lubang sproket' },
];
