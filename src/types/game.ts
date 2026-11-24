export type ChapterNumber = 1 | 2 | 3;

export type TimeOfDay = 'morning' | 'sunset' | 'rain_dusk' | 'night';

export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';

export type ShadowQuality = 'off' | 'soft' | 'sharp';

export type ParticleDensity = 'low' | 'medium' | 'high';

export type SurfaceType = 'wood' | 'asphalt' | 'grass';

export type EndingId = 'good' | 'bad' | 'true' | 'secret';

export type LocationId =
  | 'rumah_damar'
  | 'perumahan'
  | 'kedai_bima'
  | 'perkantoran'
  | 'taman_danau'
  | 'minimarket'
  | 'stasiun_tua'
  | 'jembatan_sungai'
  | 'toko_musik'
  | 'rooftop';

export type CharacterId =
  | 'damar'
  | 'damar_batin'
  | 'nadia'
  | 'kira'
  | 'bima'
  | 'pak_hendra'
  | 'pak_darman'
  | 'nenek_sari'
  | 'mas_raka'
  | 'mas_bagas'
  | 'mbak_lilis'
  | 'bu_wati'
  | 'narator';

export type SfxType =
  | 'door'
  | 'coffee'
  | 'phone'
  | 'page'
  | 'interact'
  | 'cat'
  | 'guitar'
  | 'chime'
  | 'switch';

export type EmotionTone =
  | 'hangat'
  | 'sedih'
  | 'ragu'
  | 'tegas'
  | 'lelah'
  | 'ceria'
  | 'haru'
  | 'tenang';

export interface EmotionMetrics {
  kejujuranDiri: number;
  kehadiranKeluarga: number;
  ambisiPelarian: number;
}

export interface PhoneMessage {
  id: string;
  sender: string;
  preview: string;
  timeLabel: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  chapter: ChapterNumber;
  timestamp: string;
}

export interface DialogueEffect {
  kejujuranDiri?: number;
  kehadiranKeluarga?: number;
  ambisiPelarian?: number;
  setFlags?: string[];
  startSideQuest?: string;
  advanceSideQuest?: { questId: string; stage: number };
  completeSideQuest?: string;
  advanceMainStep?: string;
  setTimeOfDay?: TimeOfDay;
  triggerChapterTransition?: ChapterNumber;
  triggerEnding?: boolean;
  teleportPlayer?: { pos: [number, number, number]; rot?: number };
  journalEntry?: { id: string; title: string; body: string; chapter: ChapterNumber };
  playSfx?: SfxType;
  phoneMessage?: PhoneMessage;
  toast?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  subtext?: string;
  nextNodeId: string;
  requiredFlag?: string;
  effects?: DialogueEffect;
}

export interface DialogueNode {
  id: string;
  speaker: CharacterId;
  text: string;
  emotion?: EmotionTone;
  nextNodeId?: string;
  choices?: DialogueChoice[];
  onEnter?: DialogueEffect;
  onEnd?: DialogueEffect;
}

export interface DialogueScript {
  id: string;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export interface MainObjectiveStep {
  id: string;
  chapter: ChapterNumber;
  title: string;
  description: string;
  targetLocation: LocationId;
  waypoint: [number, number, number];
  hint: string;
}

export interface SideQuestStage {
  stage: number;
  objective: string;
  targetPos: [number, number, number];
  location: LocationId;
}

export interface SideQuestDefinition {
  id: string;
  title: string;
  npcId: CharacterId;
  npcName: string;
  location: LocationId;
  availableFromChapter: ChapterNumber;
  summary: string;
  stages: SideQuestStage[];
  reflectionNote: string;
}

export interface SideQuestProgress {
  status: 'active' | 'completed';
  stage: number;
}

export type EasterEggVisual =
  | 'letter'
  | 'drawing'
  | 'cat'
  | 'poster'
  | 'guitar'
  | 'cassette'
  | 'graffiti'
  | 'radio'
  | 'paper_boat'
  | 'timetable'
  | 'sticky_note'
  | 'lock'
  | 'receipt'
  | 'bike'
  | 'rooftop_notebook';

export interface EasterEggDefinition {
  id: string;
  title: string;
  location: LocationId;
  position: [number, number, number];
  promptLabel: string;
  visualType: EasterEggVisual;
  dialogueId: string;
  memorySummary: string;
  isKeyMemory?: boolean;
}

export interface LocationInfo {
  id: LocationId;
  name: string;
  subtitle: string;
  center: [number, number, number];
  radius: number;
  mapX: number; // 0..100 percent for 2D map
  mapY: number; // 0..100 percent for 2D map
  musicMood: 'home' | 'cafe' | 'office' | 'park' | 'city' | 'rooftop';
}

export interface ColliderBox {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY?: number;
  maxY?: number;
}

export interface InteractableTarget {
  id: string;
  kind: 'npc' | 'easter_egg' | 'portal' | 'story_object';
  label: string;
  sublabel?: string;
  position: [number, number, number];
  distance: number;
  onInteract: () => void;
}

export interface SaveSlotData {
  slotId: string;
  journalName: string;
  updatedAt: string;
  playTimeSeconds: number;
  chapter: ChapterNumber;
  timeOfDay: TimeOfDay;
  mainStepId: string;
  playerPosition: [number, number, number];
  playerRotation: number;
  emotions: EmotionMetrics;
  flags: string[];
  sideQuests: Record<string, SideQuestProgress>;
  discoveredEasterEggs: string[];
  journalEntries: JournalEntry[];
  unlockedEndings: EndingId[];
  completedEnding?: EndingId;
}

export interface GameSettings {
  musicVolume: number;
  voiceVolume: number;
  sfxVolume: number;
  voiceEnabled: boolean;
  graphicsQuality: GraphicsQuality;
  resolutionScale: number; // 0.75..2.0
  shadowQuality: ShadowQuality;
  cinematicGlow: boolean;
  waterReflections: boolean;
  particleDensity: ParticleDensity;
  drawDistance: 'near' | 'medium' | 'far';
  exposure: number; // 0.85..1.35
  mouseSensitivity: number;
  showWaypoint: boolean;
  showSubtitles: boolean;
}

export interface EndingDefinition {
  id: EndingId;
  label: string;
  title: string;
  subtitle: string;
  accentColor: string;
  epilogueParagraphs: string[];
  finalQuote: string;
  unlockHint: string;
}

export type ScreenMode = 'title' | 'playing' | 'chapter_transition' | 'ending';
