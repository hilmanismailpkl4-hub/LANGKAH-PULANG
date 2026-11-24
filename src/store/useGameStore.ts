import { create } from 'zustand';
import { musicEngine } from '../audio/musicEngine';
import { sfxEngine } from '../audio/sfxEngine';
import { spatialAmbientEngine } from '../audio/spatialAmbientEngine';
import { voiceManager } from '../audio/voiceManager';
import { ALL_DIALOGUES } from '../data/dialogues';
import { EASTER_EGGS } from '../data/easterEggs';
import {
  CULINARY_MENU_ITEMS,
  CULINARY_SPOTS,
  CulinarySpotId,
  HeldDrinkVisual,
} from '../data/culinaryMenu';
import { DAMAR_OUTFIT_BY_ID, DamarOutfitId } from '../data/damarOutfits';
import { evaluateEnding } from '../data/endings';
import {
  CASUAL_FAMILY_BANTERS,
  EVENT_FAMILY_BANTERS,
  FamilyBanterLine,
} from '../data/familyWalkBanter';
import { RADIO_STATIONS } from '../data/phoneContent';
import { getLocationAtPosition } from '../data/worldLocations';
import {
  createFreshSaveSlot,
  deleteSlotData,
  GRAPHICS_PRESETS,
  loadGlobalUnlockedEndings,
  loadLocalSettings,
  loadLocalSlots,
  recordGlobalUnlockedEnding,
  saveLocalSettings,
  saveSlotData,
  syncAndLoadAllSlots,
} from '../services/saveManager';
import {
  ChapterNumber,
  CustomWaypoint,
  DialogueChoice,
  DialogueEffect,
  DialogueScript,
  EmotionMetrics,
  EndingId,
  GameSettings,
  GraphicsQuality,
  JournalEntry,
  LocationId,
  PhoneMessage,
  PlayerNote,
  PlayerPhoto,
  RadioStationId,
  SaveSlotData,
  ScreenMode,
  SideQuestProgress,
  TimeOfDay,
} from '../types/game';
import { playerRuntime, resetCompanionsToHome, resetScooterToHome, setRuntimePosition } from './playerRuntime';

interface ToastNotice {
  id: number;
  text: string;
}

export interface ActiveFamilyBanter {
  id: number;
  speaker: 'nadia' | 'kira' | 'damar';
  text: string;
}

interface GameStoreState {
  screen: ScreenMode;
  transitionChapter: ChapterNumber;
  slots: Record<string, SaveSlotData>;
  activeSlotId: string | null;
  journalName: string;
  playTimeSeconds: number;

  // Story & World State
  chapter: ChapterNumber;
  timeOfDay: TimeOfDay;
  mainStepId: string;
  currentLocation: LocationId;
  emotions: EmotionMetrics;
  flags: string[];
  sideQuests: Record<string, SideQuestProgress>;
  discoveredEasterEggs: string[];
  journalEntries: JournalEntry[];
  unlockedEndings: EndingId[];
  activeEnding: EndingId | null;

  // Dialogue & UI Overlays
  activeDialogue: DialogueScript | null;
  activeNodeId: string | null;
  isMapJournalOpen: boolean;
  mapJournalTab: 'map' | 'quests' | 'journal';
  isPauseOpen: boolean;
  interactPrompt: { label: string; sublabel?: string } | null;
  phoneMessage: PhoneMessage | null;
  toast: ToastNotice | null;
  cloudUserEmail: string | null;
  lastSaveStatus: string | null;

  // Settings & Bonus Features
  settings: GameSettings;
  isQuickGraphicsOpen: boolean;
  titlePreviewTime: TimeOfDay;
  customWaypoint: CustomWaypoint | null;
  isPhotoMode: boolean;
  isSitting: boolean;
  isFlyingKite: boolean;
  isRidingScooter: boolean;
  isGuitarOpen: boolean;
  isBagOpen: boolean;
  umbrellaForcedOff: boolean;
  isFamilyWalkActive: boolean;
  familyBanter: ActiveFamilyBanter | null;
  activeCulinarySpot: CulinarySpotId | null;
  heldDrink: { type: HeldDrinkVisual; isHot: boolean; label: string } | null;
  isWardrobeOpen: boolean;
  damarOutfitId: DamarOutfitId;
  livingRoomTvChannel: 0 | 1 | 2 | 3;
  catFed: boolean;
  paperBoatsLaunched: number;

  // Smartphone Interaktif Damar ([H])
  isPhoneOpen: boolean;
  phoneApp: 'home' | 'chat' | 'calls' | 'gallery' | 'radio' | 'notes' | 'weather';
  phoneThreadId: string | null;
  repliedPhonePrompts: Record<string, string>;
  readPhoneThreads: string[];
  playerNotes: PlayerNote[];
  playerPhotos: PlayerPhoto[];
  radioStation: RadioStationId;
  radioPaused: boolean;
  stepCount: number;

  // Actions
  initApp: () => Promise<void>;
  setQuickGraphicsOpen: (open: boolean) => void;
  setTitlePreviewTime: (time: TimeOfDay) => void;
  applyGraphicsPreset: (quality: GraphicsQuality) => void;
  setCustomWaypoint: (wp: CustomWaypoint | null) => void;
  setPhotoMode: (active: boolean) => void;
  setSitting: (sitting: boolean) => void;
  setFlyingKite: (flying: boolean) => void;
  setRidingScooter: (riding: boolean) => void;
  setGuitarOpen: (open: boolean) => void;
  setBagOpen: (open: boolean) => void;
  toggleUmbrella: () => void;
  setFreeTimeOfDay: (time: TimeOfDay) => void;
  toggleFamilyWalk: () => void;
  playFamilyBanter: (lines: FamilyBanterLine[], voiceKey?: string) => void;
  triggerCasualFamilyChat: () => void;
  clearFamilyBanter: () => void;
  openCulinarySpot: (spot: CulinarySpotId | null) => void;
  orderCulinaryItem: (itemId: string) => void;
  clearHeldDrink: () => void;
  setWardrobeOpen: (open: boolean) => void;
  setDamarOutfit: (outfitId: DamarOutfitId) => void;
  cycleLivingRoomTv: () => void;
  markCatFed: () => void;
  incrementPaperBoats: () => void;
  openPhone: (app?: 'home' | 'chat' | 'calls' | 'gallery' | 'radio' | 'notes' | 'weather', threadId?: string) => void;
  closePhone: () => void;
  replyToPhonePrompt: (promptId: string, optionId: string, effects?: DialogueEffect) => void;
  markPhoneThreadRead: (threadId: string) => void;
  addPlayerNote: (text: string) => void;
  deletePlayerNote: (id: string) => void;
  addPlayerPhoto: (photo: PlayerPhoto) => void;
  setRadioStation: (station: RadioStationId) => void;
  setRadioPaused: (paused: boolean) => void;
  incrementStepCount: () => void;
  setCloudUserEmail: (email: string | null) => void;
  refreshSlotsFromCloud: () => Promise<void>;
  startNewSlot: (slotId: string, journalName: string) => Promise<void>;
  loadSlot: (slotId: string) => void;
  deleteSlot: (slotId: string) => Promise<void>;
  saveCurrentGame: (silent?: boolean) => Promise<void>;
  returnToTitle: () => void;

  // Runtime updates
  setCurrentLocation: (loc: LocationId) => void;
  setInteractPrompt: (prompt: { label: string; sublabel?: string } | null) => void;
  tickPlayTime: () => void;

  // Story & Dialogue Actions
  startDialogue: (dialogueId: string) => void;
  advanceDialogue: () => void;
  chooseDialogueOption: (choice: DialogueChoice) => void;
  closeDialogue: () => void;
  discoverEasterEgg: (easterEggId: string) => void;
  applyEffect: (effect?: DialogueEffect) => void;
  finishChapterTransition: () => void;

  // UI Toggles
  toggleMapJournal: (tab?: 'map' | 'quests' | 'journal') => void;
  closeMapJournal: () => void;
  setPauseOpen: (open: boolean) => void;
  dismissPhoneMessage: () => void;
  showToast: (text: string) => void;
  updateSettings: (partial: Partial<GameSettings>) => void;
}

let toastCounter = 0;
let banterTimers: number[] = [];
let drinkTimer: number | null = null;
let casualBanterCursor = 0;

function clearBanterTimers() {
  banterTimers.forEach((id) => window.clearTimeout(id));
  banterTimers = [];
}

function applyAudioSettings(settings: GameSettings) {
  musicEngine.setVolume(settings.musicVolume);
  sfxEngine.setVolume(settings.sfxVolume);
  spatialAmbientEngine.setVolume(settings.sfxVolume);
  voiceManager.setVolume(settings.voiceVolume);
  voiceManager.setEnabled(settings.voiceEnabled);
}

export const useGameStore = create<GameStoreState>((set, get) => {
  const initialSettings = loadLocalSettings();
  applyAudioSettings(initialSettings);

  return {
    screen: 'title',
    transitionChapter: 1,
    slots: loadLocalSlots(),
    activeSlotId: null,
    journalName: 'Catatan Langkahku',
    playTimeSeconds: 0,

    chapter: 1,
    timeOfDay: 'morning',
    mainStepId: 'ch1_1_sarapan',
    currentLocation: 'rumah_damar',
    emotions: { kejujuranDiri: 0, kehadiranKeluarga: 0, ambisiPelarian: 0 },
    flags: [],
    sideQuests: {},
    discoveredEasterEggs: [],
    journalEntries: [],
    unlockedEndings: loadGlobalUnlockedEndings(),
    activeEnding: null,

    activeDialogue: null,
    activeNodeId: null,
    isMapJournalOpen: false,
    mapJournalTab: 'map',
    isPauseOpen: false,
    interactPrompt: null,
    phoneMessage: null,
    toast: null,
    cloudUserEmail: null,
    lastSaveStatus: null,

    settings: initialSettings,
    isQuickGraphicsOpen: false,
    titlePreviewTime: 'sunset',
    customWaypoint: null,
    isPhotoMode: false,
    isSitting: false,
    isFlyingKite: false,
    isRidingScooter: false,
    isGuitarOpen: false,
    isBagOpen: false,
    umbrellaForcedOff: false,
    isFamilyWalkActive: false,
    familyBanter: null,
    activeCulinarySpot: null,
    heldDrink: null,
    isWardrobeOpen: false,
    damarOutfitId: 'office',
    livingRoomTvChannel: 1,
    catFed: false,
    paperBoatsLaunched: 0,

    isPhoneOpen: false,
    phoneApp: 'home',
    phoneThreadId: null,
    repliedPhonePrompts: {},
    readPhoneThreads: [],
    playerNotes: [
      {
        id: 'note_init_1',
        text: 'Jangan lupa beli cat air warna biru untuk Kira sebelum pulang.',
        createdAt: '07:30',
      },
    ],
    playerPhotos: [],
    radioStation: 'auto',
    radioPaused: false,
    stepCount: 0,

    initApp: async () => {
      const merged = await syncAndLoadAllSlots();
      set({
        slots: merged,
        unlockedEndings: loadGlobalUnlockedEndings(),
      });
    },

    setQuickGraphicsOpen: (open) => {
      if (open && document.pointerLockElement) document.exitPointerLock();
      set({ isQuickGraphicsOpen: open });
    },

    setTitlePreviewTime: (time) => set({ titlePreviewTime: time }),

    applyGraphicsPreset: (quality) => {
      const preset = GRAPHICS_PRESETS[quality];
      get().updateSettings(preset);
    },

    setCustomWaypoint: (wp) => {
      set({ customWaypoint: wp });
      if (wp) {
        get().showToast(`Penanda GPS dipasang menuju: ${wp.label}`);
      }
    },

    setPhotoMode: (active) => {
      if (active && document.pointerLockElement) document.exitPointerLock();
      set({ isPhotoMode: active, isMapJournalOpen: false, isPauseOpen: false, isQuickGraphicsOpen: false });
    },

    setSitting: (sitting) => set({ isSitting: sitting }),

    setFlyingKite: (flying) => {
      if (flying) {
        sfxEngine.play('chime');
        playerRuntime.kiteHeight = Math.max(playerRuntime.kiteHeight, 6.5);
        playerRuntime.kitePullBoost = 1.0;
      }
      set({ isFlyingKite: flying });
    },

    setRidingScooter: (riding) => {
      if (!riding) {
        sfxEngine.setScooterEngine(false, 0);
      }
      set({ isRidingScooter: riding });
    },

    setGuitarOpen: (open) => {
      if (open && document.pointerLockElement) document.exitPointerLock();
      set({
        isGuitarOpen: open,
        isBagOpen: false,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isPhoneOpen: false,
        isQuickGraphicsOpen: false,
      });
    },

    setBagOpen: (open) => {
      const s = get();
      if (open && (s.screen !== 'playing' || s.activeDialogue)) return;
      if (open && document.pointerLockElement) document.exitPointerLock();
      if (open) sfxEngine.play('page');
      set({
        isBagOpen: open,
        isGuitarOpen: false,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isPhoneOpen: false,
        isQuickGraphicsOpen: false,
        isPhotoMode: false,
      });
    },

    toggleUmbrella: () => {
      const next = !get().umbrellaForcedOff;
      sfxEngine.play('switch');
      set({ umbrellaForcedOff: next });
      get().showToast(next ? 'Payung hujan dilipat.' : 'Payung bening dibuka.');
    },

    setFreeTimeOfDay: (time) => {
      sfxEngine.play('switch');
      const loc = getLocationAtPosition(playerRuntime.position);
      musicEngine.setContext(loc.musicMood, time);
      set({ timeOfDay: time });
      const labels: Record<TimeOfDay, string> = {
        morning: 'Pagi Cerah',
        sunset: 'Senja Keemasan',
        rain_dusk: 'Sore Berhujan (Payung aktif otomatis!)',
        night: 'Malam Tenang',
      };
      get().showToast(`Suasana kota diubah ke: ${labels[time]}`);
    },

    clearFamilyBanter: () => {
      clearBanterTimers();
      set({ familyBanter: null });
    },

    playFamilyBanter: (lines, voiceKey = 'fw') => {
      const s = get();
      if (s.screen !== 'playing' || s.activeDialogue || lines.length === 0) return;
      clearBanterTimers();

      let delayMs = 0;
      lines.forEach((line, idx) => {
        const showTimer = window.setTimeout(() => {
          const cur = get();
          if (cur.screen !== 'playing' || cur.activeDialogue) return;
          set({
            familyBanter: {
              id: Date.now() + idx,
              speaker: line.speaker,
              text: line.text,
            },
          });
          voiceManager.speak(`${voiceKey}_${idx}`, line.speaker, line.text);
        }, delayMs);
        banterTimers.push(showTimer);

        // Estimasi durasi baca natural per baris (3.6 - 5.2 detik)
        const readDuration = Math.min(5400, Math.max(3600, line.text.length * 52 + 1200));
        delayMs += readDuration;
      });

      const endTimer = window.setTimeout(() => {
        set({ familyBanter: null });
      }, delayMs + 450);
      banterTimers.push(endTimer);
    },

    toggleFamilyWalk: () => {
      const s = get();
      if (s.screen !== 'playing' || s.activeDialogue) return;
      if (s.isRidingScooter) {
        s.showToast('Parkir motor skuter dulu [E] sebelum mengajak Nadia & Kira jalan santai.');
        return;
      }

      const nextActive = !s.isFamilyWalkActive;
      sfxEngine.play(nextActive ? 'chime' : 'switch');

      if (nextActive) {
        const [px, py, pz] = playerRuntime.position;
        const nearHome = py < 5 && Math.hypot(px - -18.5, pz - 66) < 15;
        if (!nearHome) {
          // Nadia & Kira menyusul tepat di sisi Damar secara mulus
          playerRuntime.companions.snapPending = true;
        }
        set({ isFamilyWalkActive: true });

        if (!s.flags.includes('first_family_walk')) {
          s.applyEffect({
            kehadiranKeluarga: 2,
            setFlags: ['first_family_walk'],
            journalEntry: {
              id: 'je_family_walk',
              title: 'Jalan Sore Bersama Nadia & Kira',
              body: 'Hari ini aku mengajak Nadia dan Kira berjalan santai menyusuri sudut-sudut kota. Tidak ada rapat, tidak ada ponsel berdering—hanya langkah kaki kami bertiga yang sejajar.',
              chapter: s.chapter,
            },
          });
        }
        s.showToast('Nadia & Kira ikut berjalan bersamamu! Tekan [T] untuk ngobrol santai atau [G] antar pulang.');
        s.playFamilyBanter(
          nearHome ? EVENT_FAMILY_BANTERS.walk_start_home : EVENT_FAMILY_BANTERS.walk_start_away,
          'fw_start',
        );
      } else {
        set({ isFamilyWalkActive: false });
        resetCompanionsToHome();
        s.showToast('Nadia & Kira kembali beristirahat di Rumah Jl. Melati No. 14.');
        s.playFamilyBanter(EVENT_FAMILY_BANTERS.walk_end, 'fw_end');
      }
    },

    triggerCasualFamilyChat: () => {
      const s = get();
      if (!s.isFamilyWalkActive || s.activeDialogue || s.screen !== 'playing') return;
      const lines = CASUAL_FAMILY_BANTERS[casualBanterCursor % CASUAL_FAMILY_BANTERS.length];
      casualBanterCursor += 1;
      sfxEngine.play('interact');
      s.playFamilyBanter(lines, `fw_casual_${casualBanterCursor}`);
    },

    openCulinarySpot: (spot) => {
      const s = get();
      if (spot && (s.screen !== 'playing' || s.activeDialogue)) return;
      if (spot && document.pointerLockElement) document.exitPointerLock();
      if (spot) sfxEngine.play('interact');
      set({
        activeCulinarySpot: spot,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isPhoneOpen: false,
        isBagOpen: false,
        isGuitarOpen: false,
        isQuickGraphicsOpen: false,
      });
    },

    clearHeldDrink: () => {
      if (drinkTimer) {
        window.clearTimeout(drinkTimer);
        drinkTimer = null;
      }
      set({ heldDrink: null });
    },

    orderCulinaryItem: (itemId) => {
      const s = get();
      const item = CULINARY_MENU_ITEMS.find((m) => m.id === itemId);
      if (!item) return;
      const spot = CULINARY_SPOTS[item.spot];

      sfxEngine.play(item.isHot ? 'coffee' : 'chime');

      // Dudukkan Damar di kursi / bangku kayu tempat kuliner + tampilkan hidangan hangat di meja & tangan
      playerRuntime.sitState = {
        active: true,
        label: spot.title,
        seatPos: [...spot.seatPos],
        lookAt: [...spot.lookAt],
        standPos: [...spot.standPos],
        seatYaw: spot.seatYaw,
        holdingCoffee: true,
        drinkVisual: item.drinkVisual,
        tablePropPos: [...spot.tablePropPos],
        tableIsHot: item.isHot,
      };

      if (drinkTimer) window.clearTimeout(drinkTimer);
      drinkTimer = window.setTimeout(() => {
        set({ heldDrink: null });
      }, 28000);

      set({
        activeCulinarySpot: null,
        isSitting: true,
        heldDrink: { type: item.drinkVisual, isHot: item.isHot, label: item.name },
      });

      // Tambah kehangatan emosi & catatan jurnal bila mentraktir keluarga pertama kali di tempat ini
      const flagKey = `culinary_${item.id}`;
      if (!s.flags.includes(flagKey)) {
        s.applyEffect({
          kehadiranKeluarga: item.isFamilyTreat ? 2 : 0,
          kejujuranDiri: item.isFamilyTreat ? 1 : 1,
          setFlags: [flagKey],
          journalEntry:
            item.journalTitle && item.journalBody
              ? {
                  id: `je_${flagKey}`,
                  title: item.journalTitle,
                  body: item.journalBody,
                  chapter: s.chapter,
                }
              : undefined,
        });
      }

      if (s.isFamilyWalkActive && item.familyReaction.length > 0) {
        s.playFamilyBanter(item.familyReaction, `fw_${item.id}`);
      }
      s.showToast(`${item.name}: "${item.tasteNote}" (Tekan WASD/E berdiri — gelas tetap dibawa sejenak!)`);
    },

    setWardrobeOpen: (open) => {
      const s = get();
      if (open && (s.screen !== 'playing' || s.activeDialogue)) return;
      if (open && document.pointerLockElement) document.exitPointerLock();
      if (open) sfxEngine.play('door');
      set({
        isWardrobeOpen: open,
        activeCulinarySpot: null,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isPhoneOpen: false,
        isBagOpen: false,
        isGuitarOpen: false,
        isQuickGraphicsOpen: false,
      });
    },

    setDamarOutfit: (outfitId) => {
      const outfit = DAMAR_OUTFIT_BY_ID[outfitId];
      if (!outfit) return;
      sfxEngine.play('chime');
      set({ damarOutfitId: outfitId, isWardrobeOpen: false });
      get().showToast(`Damar berganti mengenakan: ${outfit.name}`);
      get().playFamilyBanter([{ speaker: 'nadia', text: outfit.nadiaComment }], `fw_outfit_${outfitId}`);
    },

    cycleLivingRoomTv: () => {
      const next = (((get().livingRoomTvChannel + 1) % 4) as 0 | 1 | 2 | 3);
      sfxEngine.play('switch');
      set({ livingRoomTvChannel: next });
      const labels: Record<0 | 1 | 2 | 3, string> = {
        0: 'TV ruang tamu dimatikan—suasana rumah kembali hening.',
        1: 'Saluran 1: Kartun Sore Kesukaan Kira!',
        2: 'Saluran 2: Prakiraan Cuaca & Lalu Lintas Kota.',
        3: 'Saluran 3: Panggung Akustik Senja Nusantara.',
      };
      get().showToast(labels[next]);
      if (next === 1) {
        get().playFamilyBanter(
          [{ speaker: 'kira', text: 'Yeay! Kartun kesukaan Kira lagi tayang, Ayah!' }],
          'fw_tv_1',
        );
      } else if (next === 3) {
        get().playFamilyBanter(
          [{ speaker: 'nadia', text: 'Eh, acara musik akustik nih, Mas. Enak ya suasananya.' }],
          'fw_tv_3',
        );
      }
    },

    markCatFed: () => {
      const already = get().catFed;
      set({ catFed: true });
      if (!already) {
        get().applyEffect({ kehadiranKeluarga: 1, setFlags: ['fed_cat_sore'] });
      }
    },

    incrementPaperBoats: () => {
      const prev = get().paperBoatsLaunched;
      set({ paperBoatsLaunched: prev + 1 });
      if (prev === 0) {
        get().applyEffect({ kehadiranKeluarga: 1, setFlags: ['launched_paper_boat'] });
      }
    },

    openPhone: (app, threadId) => {
      const s = get();
      if (s.screen !== 'playing' || s.activeDialogue) return;
      if (document.pointerLockElement) document.exitPointerLock();
      sfxEngine.play('switch');
      set({
        isPhoneOpen: true,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isQuickGraphicsOpen: false,
        isPhotoMode: false,
        phoneApp: app ?? 'home',
        phoneThreadId: threadId ?? s.phoneThreadId,
      });
    },

    closePhone: () => {
      voiceManager.stop();
      set({ isPhoneOpen: false });
    },

    replyToPhonePrompt: (promptId, optionId, effects) => {
      set((s) => ({
        repliedPhonePrompts: { ...s.repliedPhonePrompts, [promptId]: optionId },
      }));
      if (effects) {
        get().applyEffect(effects);
      }
      void get().saveCurrentGame(true);
    },

    markPhoneThreadRead: (threadId) => {
      set((s) => ({
        readPhoneThreads: s.readPhoneThreads.includes(threadId)
          ? s.readPhoneThreads
          : [...s.readPhoneThreads, threadId],
      }));
    },

    addPlayerNote: (text) => {
      const clean = text.trim();
      if (!clean) return;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      set((s) => ({
        playerNotes: [{ id: `note_${Date.now()}`, text: clean, createdAt: timeStr }, ...s.playerNotes],
      }));
      void get().saveCurrentGame(true);
    },

    deletePlayerNote: (id) => {
      set((s) => ({
        playerNotes: s.playerNotes.filter((n) => n.id !== id),
      }));
      void get().saveCurrentGame(true);
    },

    addPlayerPhoto: (photo) => {
      set((s) => ({
        playerPhotos: [photo, ...s.playerPhotos].slice(0, 12),
      }));
    },

    setRadioStation: (station) => {
      set({ radioStation: station, radioPaused: false });
      musicEngine.setRadioPaused(false);
      if (station === 'auto') {
        musicEngine.setRadioOverride(null);
      } else {
        const found = RADIO_STATIONS.find((r) => r.id === station);
        musicEngine.setRadioOverride(found ? found.mood : null);
      }
    },

    setRadioPaused: (paused) => {
      set({ radioPaused: paused });
      musicEngine.setRadioPaused(paused);
    },

    incrementStepCount: () => {
      set((s) => ({ stepCount: s.stepCount + 1 }));
    },

    setCloudUserEmail: (email) => set({ cloudUserEmail: email }),

    refreshSlotsFromCloud: async () => {
      const merged = await syncAndLoadAllSlots();
      set({
        slots: merged,
        unlockedEndings: loadGlobalUnlockedEndings(),
      });
    },

    startNewSlot: async (slotId, journalName) => {
      const fresh = createFreshSaveSlot(slotId, journalName);
      await saveSlotData(fresh);
      clearBanterTimers();
      resetScooterToHome();
      resetCompanionsToHome();
      setRuntimePosition(fresh.playerPosition, fresh.playerRotation);
      musicEngine.start();
      musicEngine.setContext('home', 'morning');

      set((state) => ({
        slots: { ...state.slots, [slotId]: fresh },
        activeSlotId: slotId,
        journalName: fresh.journalName,
        playTimeSeconds: 0,
        chapter: 1,
        timeOfDay: 'morning',
        mainStepId: fresh.mainStepId,
        currentLocation: 'rumah_damar',
        emotions: { ...fresh.emotions },
        flags: [],
        sideQuests: {},
        discoveredEasterEggs: [],
        journalEntries: [...fresh.journalEntries],
        activeEnding: null,
        activeDialogue: null,
        activeNodeId: null,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isPhoneOpen: false,
        isFamilyWalkActive: false,
        familyBanter: null,
        repliedPhonePrompts: {},
        readPhoneThreads: [],
        playerNotes: [
          {
            id: 'note_init_1',
            text: 'Jangan lupa beli cat air warna biru untuk Kira sebelum pulang.',
            createdAt: '07:30',
          },
        ],
        stepCount: 0,
        transitionChapter: 1,
        screen: 'chapter_transition',
      }));
    },

    loadSlot: (slotId) => {
      const slot = get().slots[slotId];
      if (!slot) return;
      clearBanterTimers();
      resetScooterToHome();
      resetCompanionsToHome();
      setRuntimePosition(slot.playerPosition, slot.playerRotation);
      const loc = getLocationAtPosition(slot.playerPosition);
      musicEngine.start();
      musicEngine.setContext(loc.musicMood, slot.timeOfDay);

      set({
        activeSlotId: slot.slotId,
        journalName: slot.journalName,
        playTimeSeconds: slot.playTimeSeconds || 0,
        chapter: slot.chapter,
        timeOfDay: slot.timeOfDay,
        mainStepId: slot.mainStepId,
        currentLocation: loc.id,
        emotions: { ...slot.emotions },
        flags: [...slot.flags],
        sideQuests: { ...slot.sideQuests },
        discoveredEasterEggs: [...slot.discoveredEasterEggs],
        journalEntries: [...slot.journalEntries],
        unlockedEndings: Array.from(new Set([...get().unlockedEndings, ...(slot.unlockedEndings || [])])),
        activeEnding: null,
        activeDialogue: null,
        activeNodeId: null,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isPhoneOpen: false,
        isFamilyWalkActive: false,
        familyBanter: null,
        repliedPhonePrompts: slot.repliedPhonePrompts ?? {},
        readPhoneThreads: slot.readPhoneThreads ?? [],
        playerNotes: slot.playerNotes ?? [
          {
            id: 'note_init_1',
            text: 'Jangan lupa beli cat air warna biru untuk Kira sebelum pulang.',
            createdAt: '07:30',
          },
        ],
        stepCount: slot.stepCount ?? 0,
        screen: 'playing',
      });
    },

    deleteSlot: async (slotId) => {
      await deleteSlotData(slotId);
      set((state) => {
        const next = { ...state.slots };
        delete next[slotId];
        return { slots: next };
      });
    },

    saveCurrentGame: async (silent = false) => {
      const s = get();
      if (!s.activeSlotId) return;

      const payload: SaveSlotData = {
        slotId: s.activeSlotId,
        journalName: s.journalName,
        updatedAt: new Date().toISOString(),
        playTimeSeconds: s.playTimeSeconds,
        chapter: s.chapter,
        timeOfDay: s.timeOfDay,
        mainStepId: s.mainStepId,
        playerPosition: [...playerRuntime.position] as [number, number, number],
        playerRotation: playerRuntime.rotationY,
        emotions: { ...s.emotions },
        flags: [...s.flags],
        sideQuests: { ...s.sideQuests },
        discoveredEasterEggs: [...s.discoveredEasterEggs],
        journalEntries: [...s.journalEntries],
        unlockedEndings: [...s.unlockedEndings],
        completedEnding: s.activeEnding ?? undefined,
        repliedPhonePrompts: { ...s.repliedPhonePrompts },
        readPhoneThreads: [...s.readPhoneThreads],
        playerNotes: [...s.playerNotes],
        stepCount: s.stepCount,
      };

      const res = await saveSlotData(payload);
      set((state) => ({
        slots: { ...state.slots, [payload.slotId]: payload },
        lastSaveStatus: res.cloudSynced ? 'Tersimpan ke perangkat & awan' : 'Tersimpan di perangkat',
      }));
      if (!silent) {
        get().showToast(res.cloudSynced ? 'Progres tersimpan (Lokal & Cloud).' : 'Progres tersimpan di perangkat.');
      }
    },

    returnToTitle: () => {
      clearBanterTimers();
      resetCompanionsToHome();
      voiceManager.stop();
      musicEngine.setContext('title', 'sunset');
      set({
        screen: 'title',
        activeDialogue: null,
        activeNodeId: null,
        isMapJournalOpen: false,
        isPauseOpen: false,
        isFlyingKite: false,
        isFamilyWalkActive: false,
        familyBanter: null,
        activeCulinarySpot: null,
        heldDrink: null,
        isWardrobeOpen: false,
        interactPrompt: null,
      });
    },

    setCurrentLocation: (loc) => {
      if (get().currentLocation === loc) return;
      set({ currentLocation: loc });
    },

    setInteractPrompt: (prompt) => {
      const prev = get().interactPrompt;
      if (prev?.label === prompt?.label && prev?.sublabel === prompt?.sublabel) return;
      set({ interactPrompt: prompt });
    },

    tickPlayTime: () => {
      if (get().screen === 'playing' && !get().isPauseOpen) {
        set((s) => ({ playTimeSeconds: s.playTimeSeconds + 1 }));
      }
    },

    startDialogue: (dialogueId) => {
      const script = ALL_DIALOGUES[dialogueId];
      if (!script) return;
      const startNode = script.nodes[script.startNodeId];
      if (!startNode) return;

      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      clearBanterTimers();

      set({
        activeDialogue: script,
        activeNodeId: startNode.id,
        isMapJournalOpen: false,
        isPauseOpen: false,
        familyBanter: null,
      });

      if (startNode.onEnter) {
        get().applyEffect(startNode.onEnter);
      }

      voiceManager.speak(startNode.id, startNode.speaker, startNode.text);
    },

    advanceDialogue: () => {
      const { activeDialogue, activeNodeId } = get();
      if (!activeDialogue || !activeNodeId) return;
      const node = activeDialogue.nodes[activeNodeId];
      if (!node) return;
      // Jika ada pilihan, pemain harus klik salah satu pilihan
      if (node.choices && node.choices.length > 0) return;

      voiceManager.stop();
      if (node.onEnd) {
        get().applyEffect(node.onEnd);
      }

      if (node.nextNodeId && activeDialogue.nodes[node.nextNodeId]) {
        const nextNode = activeDialogue.nodes[node.nextNodeId];
        set({ activeNodeId: nextNode.id });
        if (nextNode.onEnter) {
          get().applyEffect(nextNode.onEnter);
        }
        voiceManager.speak(nextNode.id, nextNode.speaker, nextNode.text);
      } else {
        set({ activeDialogue: null, activeNodeId: null });
        void get().saveCurrentGame(true);
      }
    },

    chooseDialogueOption: (choice) => {
      const { activeDialogue, activeNodeId } = get();
      if (!activeDialogue || !activeNodeId) return;
      const currentNode = activeDialogue.nodes[activeNodeId];
      voiceManager.stop();
      sfxEngine.play('interact');

      if (currentNode?.onEnd) {
        get().applyEffect(currentNode.onEnd);
      }
      if (choice.effects) {
        get().applyEffect(choice.effects);
      }

      const nextNode = activeDialogue.nodes[choice.nextNodeId];
      if (nextNode) {
        set({ activeNodeId: nextNode.id });
        if (nextNode.onEnter) {
          get().applyEffect(nextNode.onEnter);
        }
        voiceManager.speak(nextNode.id, nextNode.speaker, nextNode.text);
      } else {
        set({ activeDialogue: null, activeNodeId: null });
        void get().saveCurrentGame(true);
      }
    },

    closeDialogue: () => {
      voiceManager.stop();
      set({ activeDialogue: null, activeNodeId: null });
    },

    discoverEasterEgg: (easterEggId) => {
      const def = EASTER_EGGS.find((e) => e.id === easterEggId);
      if (!def) return;
      const already = get().discoveredEasterEggs.includes(easterEggId);
      if (!already) {
        set((state) => ({
          discoveredEasterEggs: [...state.discoveredEasterEggs, easterEggId],
        }));
        get().showToast(`Fragmen Memori ditemukan (${get().discoveredEasterEggs.length}/${EASTER_EGGS.length}): ${def.title}`);
      }
      get().startDialogue(def.dialogueId);
    },

    applyEffect: (effect) => {
      if (!effect) return;
      if (effect.playSfx) {
        sfxEngine.play(effect.playSfx);
      }

      set((state) => {
        const nextEmotions = { ...state.emotions };
        if (effect.kejujuranDiri) nextEmotions.kejujuranDiri += effect.kejujuranDiri;
        if (effect.kehadiranKeluarga) nextEmotions.kehadiranKeluarga += effect.kehadiranKeluarga;
        if (effect.ambisiPelarian) nextEmotions.ambisiPelarian += effect.ambisiPelarian;

        const nextFlags = effect.setFlags
          ? Array.from(new Set([...state.flags, ...effect.setFlags]))
          : state.flags;

        const nextSideQuests = { ...state.sideQuests };
        if (effect.startSideQuest && !nextSideQuests[effect.startSideQuest]) {
          nextSideQuests[effect.startSideQuest] = { status: 'active', stage: 1 };
        }
        if (effect.advanceSideQuest) {
          nextSideQuests[effect.advanceSideQuest.questId] = {
            status: 'active',
            stage: effect.advanceSideQuest.stage,
          };
        }
        if (effect.completeSideQuest) {
          nextSideQuests[effect.completeSideQuest] = { status: 'completed', stage: 99 };
        }

        const nextJournal = [...state.journalEntries];
        if (effect.journalEntry && !nextJournal.some((j) => j.id === effect.journalEntry!.id)) {
          nextJournal.unshift({
            ...effect.journalEntry,
            timestamp: new Date().toISOString(),
          });
        }

        const nextTimeOfDay = effect.setTimeOfDay ?? state.timeOfDay;
        const nextMainStep = effect.advanceMainStep ?? state.mainStepId;

        return {
          emotions: nextEmotions,
          flags: nextFlags,
          sideQuests: nextSideQuests,
          journalEntries: nextJournal,
          timeOfDay: nextTimeOfDay,
          mainStepId: nextMainStep,
          phoneMessage: effect.phoneMessage ?? state.phoneMessage,
        };
      });

      if (effect.teleportPlayer) {
        setRuntimePosition(effect.teleportPlayer.pos, effect.teleportPlayer.rot);
      }

      if (effect.toast) {
        get().showToast(effect.toast);
      }

      if (effect.triggerChapterTransition) {
        const nextChap = effect.triggerChapterTransition;
        set({
          chapter: nextChap,
          transitionChapter: nextChap,
          activeDialogue: null,
          activeNodeId: null,
          screen: 'chapter_transition',
        });
        void get().saveCurrentGame(true);
      }

      if (effect.triggerEnding) {
        const cur = get();
        const endingId = evaluateEnding({
          emotions: cur.emotions,
          sideQuests: cur.sideQuests,
          discoveredEasterEggs: cur.discoveredEasterEggs,
          flags: cur.flags,
        });
        const allUnlocked = recordGlobalUnlockedEnding(endingId);
        voiceManager.stop();
        musicEngine.setContext('ending', 'night');
        set({
          activeDialogue: null,
          activeNodeId: null,
          activeEnding: endingId,
          unlockedEndings: allUnlocked,
          screen: 'ending',
        });
        void get().saveCurrentGame(true);
      }
    },

    finishChapterTransition: () => {
      set({ screen: 'playing' });
      const { timeOfDay, currentLocation } = get();
      const mood = getLocationAtPosition(playerRuntime.position).musicMood;
      musicEngine.setContext(mood, timeOfDay);
      void currentLocation;
    },

    toggleMapJournal: (tab) => {
      const s = get();
      if (s.screen !== 'playing' || s.activeDialogue) return;
      if (document.pointerLockElement) document.exitPointerLock();
      sfxEngine.play('page');
      if (s.isMapJournalOpen && (!tab || tab === s.mapJournalTab)) {
        set({ isMapJournalOpen: false });
      } else {
        set({
          isMapJournalOpen: true,
          isPauseOpen: false,
          mapJournalTab: tab ?? s.mapJournalTab,
        });
      }
    },

    closeMapJournal: () => set({ isMapJournalOpen: false }),

    setPauseOpen: (open) => {
      if (open && document.pointerLockElement) {
        document.exitPointerLock();
      }
      set({ isPauseOpen: open, isMapJournalOpen: false });
    },

    dismissPhoneMessage: () => set({ phoneMessage: null }),

    showToast: (text) => {
      const id = ++toastCounter;
      set({ toast: { id, text } });
      window.setTimeout(() => {
        if (get().toast?.id === id) {
          set({ toast: null });
        }
      }, 4200);
    },

    updateSettings: (partial) => {
      const next = { ...get().settings, ...partial };
      saveLocalSettings(next);
      applyAudioSettings(next);
      set({ settings: next });
    },
  };
});
