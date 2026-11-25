import { EndingId, GameSettings, GraphicsQuality, SaveSlotData } from '../types/game';
import { detectIsMobileDevice } from '../utils/mobileUtils';
import { deleteCloudSave, fetchCloudSaves, pushCloudSave } from './supabase';

const SLOTS_STORAGE_KEY = 'langkah_pulang_slots_v1';
const SETTINGS_STORAGE_KEY = 'langkah_pulang_settings_v1';
const ENDINGS_STORAGE_KEY = 'langkah_pulang_endings_v1';
const MOBILE_OPT_FLAG_KEY = 'langkah_pulang_mobile_opt_v1';

export const GRAPHICS_PRESETS: Record<
  GraphicsQuality,
  Pick<
    GameSettings,
    | 'graphicsQuality'
    | 'resolutionScale'
    | 'shadowQuality'
    | 'cinematicGlow'
    | 'bloomIntensity'
    | 'waterReflections'
    | 'particleDensity'
    | 'drawDistance'
    | 'districtCulling'
  >
> = {
  potato: {
    graphicsQuality: 'potato',
    resolutionScale: 0.62,
    shadowQuality: 'off',
    cinematicGlow: false,
    bloomIntensity: 0,
    waterReflections: false,
    particleDensity: 'low',
    drawDistance: 'near',
    districtCulling: true,
  },
  low: {
    graphicsQuality: 'low',
    resolutionScale: 0.78,
    shadowQuality: 'off',
    cinematicGlow: false,
    bloomIntensity: 0,
    waterReflections: false,
    particleDensity: 'low',
    drawDistance: 'near',
    districtCulling: true,
  },
  medium: {
    graphicsQuality: 'medium',
    resolutionScale: 1.2,
    shadowQuality: 'soft',
    cinematicGlow: true,
    bloomIntensity: 0.45,
    waterReflections: true,
    particleDensity: 'medium',
    drawDistance: 'medium',
    districtCulling: false,
  },
  high: {
    graphicsQuality: 'high',
    resolutionScale: 1.5,
    shadowQuality: 'sharp',
    cinematicGlow: true,
    bloomIntensity: 0.72,
    waterReflections: true,
    particleDensity: 'high',
    drawDistance: 'far',
    districtCulling: false,
  },
  ultra: {
    graphicsQuality: 'ultra',
    resolutionScale: 2.0,
    shadowQuality: 'sharp',
    cinematicGlow: true,
    bloomIntensity: 0.95,
    waterReflections: true,
    particleDensity: 'high',
    drawDistance: 'far',
    districtCulling: false,
  },
};

export const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.55,
  voiceVolume: 0.88,
  sfxVolume: 0.72,
  voiceEnabled: true,
  ...GRAPHICS_PRESETS.high,
  showFps: false,
  exposure: 1.08,
  mouseSensitivity: 1.0,
  showWaypoint: true,
  showSubtitles: true,
  showMinimap: true,
};

export function loadLocalSettings(): GameSettings {
  const isMobile = detectIsMobileDevice();
  const baseDefaults: GameSettings = isMobile
    ? {
        ...DEFAULT_SETTINGS,
        ...GRAPHICS_PRESETS.low,
        resolutionScale: 0.78,
        exposure: 1.12,
      }
    : { ...DEFAULT_SETTINGS };

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      if (isMobile) {
        localStorage.setItem(MOBILE_OPT_FLAG_KEY, '1');
      }
      return baseDefaults;
    }
    const parsed = JSON.parse(raw);
    const merged: GameSettings = { ...baseDefaults, ...parsed };
    if (typeof parsed.districtCulling !== 'boolean') {
      merged.districtCulling =
        isMobile || merged.graphicsQuality === 'low' || merged.graphicsQuality === 'potato';
    }
    if (typeof parsed.showFps !== 'boolean') {
      merged.showFps = false;
    }

    // Migrasi otomatis satu kali untuk pemain HP lama agar langsung ringan & bebas lag
    if (isMobile && !localStorage.getItem(MOBILE_OPT_FLAG_KEY)) {
      localStorage.setItem(MOBILE_OPT_FLAG_KEY, '1');
      if (merged.graphicsQuality === 'high' || merged.graphicsQuality === 'ultra') {
        const optimized: GameSettings = {
          ...merged,
          ...GRAPHICS_PRESETS.low,
          resolutionScale: 0.78,
          exposure: 1.12,
        };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(optimized));
        return optimized;
      }
    }

    return merged;
  } catch {
    return baseDefaults;
  }
}

export function saveLocalSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Abaikan kuota storage penuh
  }
}

export function loadGlobalUnlockedEndings(): EndingId[] {
  try {
    const raw = localStorage.getItem(ENDINGS_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function recordGlobalUnlockedEnding(endingId: EndingId): EndingId[] {
  const existing = loadGlobalUnlockedEndings();
  if (!existing.includes(endingId)) {
    existing.push(endingId);
    try {
      localStorage.setItem(ENDINGS_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // Abaikan
    }
  }
  return existing;
}

export function loadLocalSlots(): Record<string, SaveSlotData> {
  try {
    const raw = localStorage.getItem(SLOTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveSlotData(slot: SaveSlotData): Promise<{ localOk: boolean; cloudSynced: boolean }> {
  let localOk = false;
  try {
    const all = loadLocalSlots();
    all[slot.slotId] = slot;
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(all));
    localOk = true;
  } catch {
    localOk = false;
  }

  const cloudSynced = await pushCloudSave(slot);
  return { localOk, cloudSynced };
}

export async function deleteSlotData(slotId: string): Promise<void> {
  try {
    const all = loadLocalSlots();
    delete all[slotId];
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Abaikan
  }
  await deleteCloudSave(slotId);
}

/**
 * Menggabungkan save lokal dan cloud dengan memilih timestamp terbaru per slot.
 */
export async function syncAndLoadAllSlots(): Promise<Record<string, SaveSlotData>> {
  const local = loadLocalSlots();
  const cloudList = await fetchCloudSaves();

  if (cloudList.length === 0) return local;

  const merged: Record<string, SaveSlotData> = { ...local };
  for (const cloudSlot of cloudList) {
    const existing = merged[cloudSlot.slotId];
    if (!existing || new Date(cloudSlot.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
      merged[cloudSlot.slotId] = cloudSlot;
    }
    cloudSlot.unlockedEndings?.forEach((e) => recordGlobalUnlockedEnding(e));
  }

  try {
    localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Abaikan
  }

  return merged;
}

export function createFreshSaveSlot(slotId: string, journalName: string): SaveSlotData {
  const cleanName = journalName.trim() || 'Catatan Langkahku';
  const now = new Date().toISOString();
  return {
    slotId,
    journalName: cleanName,
    updatedAt: now,
    playTimeSeconds: 0,
    chapter: 1,
    timeOfDay: 'morning',
    mainStepId: 'ch1_1_sarapan',
    playerPosition: [-19.5, 0.08, 67.5],
    playerRotation: Math.PI,
    emotions: {
      kejujuranDiri: 0,
      kehadiranKeluarga: 0,
      ambisiPelarian: 0,
    },
    flags: [],
    sideQuests: {},
    discoveredEasterEggs: [],
    journalEntries: [
      {
        id: 'je_prologue',
        title: 'Catatan Awal — Jl. Melati No. 14',
        body: 'Pagi kembali datang. Aroma kopi Nadia dan tawa kecil Kira terdengar dari meja makan. Entah sejak kapan aku merasa hariku berjalan terlalu cepat, tapi hari ini aku ingin mencoba berjalan dengan lebih sadar.',
        chapter: 1,
        timestamp: now,
      },
    ],
    unlockedEndings: loadGlobalUnlockedEndings(),
  };
}
