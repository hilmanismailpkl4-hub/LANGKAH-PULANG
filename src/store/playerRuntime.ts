import { HeldDrinkVisual } from '../data/culinaryMenu';
import { InteractableTarget } from '../types/game';

export interface DynamicCarBox {
  id: number;
  x: number;
  z: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface DynamicCircleObstacle {
  id: string;
  x: number;
  z: number;
  radius: number;
}

export interface SitSpotState {
  active: boolean;
  label: string;
  seatPos: [number, number, number];
  lookAt: [number, number, number];
  standPos: [number, number, number];
  seatYaw: number;
  holdingCoffee?: boolean;
  drinkVisual?: HeldDrinkVisual;
  tablePropPos?: [number, number, number];
  tableIsHot?: boolean;
}

export interface ScooterRuntimeState {
  pos: [number, number, number];
  yaw: number;
  speed: number;
  steer: number;
  roll: number;
  wheelAngle: number;
  isRiding: boolean;
  isBraking: boolean;
}

export interface BicycleRuntimeState {
  pos: [number, number, number];
  yaw: number;
  speed: number;
  steer: number;
  roll: number;
  wheelAngle: number;
  pedalAngle: number;
  isRiding: boolean;
}

export interface FloatingPaperBoat {
  id: number;
  x: number;
  z: number;
  vx: number;
  vz: number;
  rotY: number;
  bornAt: number;
}

export function getTrafficSignalState(elapsedSec: number): {
  ns: 'green' | 'yellow' | 'red';
  ew: 'green' | 'yellow' | 'red';
} {
  const t = ((elapsedSec % 19) + 19) % 19;
  if (t < 7.5) return { ns: 'green', ew: 'red' };
  if (t < 9.5) return { ns: 'yellow', ew: 'red' };
  if (t < 17.0) return { ns: 'red', ew: 'green' };
  return { ns: 'red', ew: 'yellow' };
}

/**
 * Helper hemat CPU ultra-ringan (zero allocation) untuk komponen 3D:
 * Memangkas eksekusi animasi useFrame pada properti yang jauh dari Damar
 * atau membatasi laju update di mode Hemat HP / HP Kentang (60 FPS).
 */
export function shouldSkipPerfFrame(
  worldX: number,
  worldZ: number,
  activeRadius = 52,
  allowHalfRate = true,
): boolean {
  const perf = playerRuntime.perf;
  const dx = playerRuntime.position[0] - worldX;
  const dz = playerRuntime.position[2] - worldZ;
  const distSq = dx * dx + dz * dz;

  if (perf.isPotato) {
    const r = activeRadius * 0.78;
    if (distSq > r * r) return true;
    if (allowHalfRate && (perf.frameIndex & 1) === 1) return true;
    return false;
  }

  if (perf.isLowPerf) {
    if (distSq > activeRadius * activeRadius) return true;
    if (allowHalfRate && distSq > 22 * 22 && (perf.frameIndex & 1) === 1) return true;
    return false;
  }

  const farR = activeRadius * 1.45;
  return distSq > farR * farR;
}

export const playerRuntime = {
  position: [-19.5, 0.08, 67.5] as [number, number, number],
  rotationY: Math.PI,
  cameraYaw: Math.PI,
  cameraPitch: 0.28,
  isMoving: false,
  isRunning: false,
  moveSpeed: 0,
  damarWaveTimer: 0,
  teleportPending: null as { pos: [number, number, number]; rot?: number } | null,
  nearestInteractable: null as InteractableTarget | null,
  activeSpeakerPos: null as [number, number, number] | null,
  activeSpeakerId: null as string | null,
  dynamicCarBoxes: [] as DynamicCarBox[],
  npcColliders: [] as DynamicCircleObstacle[],
  walkerColliders: [] as DynamicCircleObstacle[],
  sitState: null as SitSpotState | null,

  // Skuter Damar (berawal parkir rapi di halaman depan rumah)
  scooter: {
    pos: [-15.2, 0.04, 57.5] as [number, number, number],
    yaw: -0.45,
    speed: 0,
    steer: 0,
    roll: 0,
    wheelAngle: 0,
    isRiding: false,
    isBraking: false,
  } as ScooterRuntimeState,

  // Sepeda Kota Klasik (terparkir rapi di tepi Taman Kota & Danau Senja)
  bicycle: {
    pos: [-68.8, 0.02, -8.5] as [number, number, number],
    yaw: 0.7,
    speed: 0,
    steer: 0,
    roll: 0,
    wheelAngle: 0,
    pedalAngle: 0,
    isRiding: false,
  } as BicycleRuntimeState,

  // Aktivitas santai: perahu kertas di danau, kucing Sore, ikan koi, ayunan & layang-layang
  paperBoats: [] as FloatingPaperBoat[],
  catHeartTimer: 0,
  cafeCatHeartTimer: 0,
  koiFeedTimer: 0,
  koiFeedPoint: [-73.2, -24.6] as [number, number],
  pigeonFeedTimer: 0,
  pigeonFeedPoint: [-81.5, 12.2] as [number, number],
  gardenWaterTimer: 0,
  badmintonRallyTimer: 0,
  kentonganSwingTimer: 0,
  windChimeTimer: 0,
  stationGateTimer: 0,
  pingPongRallyTimer: 0,
  chessMoveTimer: 0,
  chessMoveStep: 0,
  lotusFrogHopTimer: 0,
  birdcageChirpTimer: 0,
  fountainDrinkTimer: 0,
  melatiPortalTimer: 0,
  fruitScaleSwingTimer: 0,
  fruitPurchaseStep: 0,
  barberCutTimer: 0,
  nurseryPickStep: 0,
  gallonRefillTimer: 0,
  duckFeedTimer: 0,
  flowerBouquetStep: 0,
  bedugRingTimer: 0,
  putuWhistleTimer: 0,
  tirePumpTimer: 0,
  laundrySpinTimer: 0,
  cilokFryTimer: 0,
  bikeShareRingTimer: 0,
  watchRepairTimer: 0,
  pedalBoatWaveTimer: 0,
  bandrekSteamTimer: 0,
  parkLightsPulseTimer: 0,
  veggieScaleTimer: 0,
  veggiePurchaseStep: 0,
  sewingMachineTimer: 0,
  railCrossingBellTimer: 0,
  pharmacyPulseTimer: 0,
  estelerShaveTimer: 0,
  toyBoxOpenTimer: 0,
  toyShareStep: 0,
  gardenSwingTimer: 0,
  swingBoostTimer: 0,
  kiteHeight: 0,
  kitePullBoost: 0,
  fishingPhase: 'idle' as 'idle' | 'waiting' | 'bite',
  fishingWaitTimer: 0,
  fishingBiteTimer: 0,
  fishingTugAnim: 0,
  trainZ: -80,
  trainSpeed: 12,
  trainAtPlatform: false,
  trainPhase: 'approaching' as 'approaching' | 'boarding' | 'departing' | 'away',
  trainDwellTimer: 0,

  // Input kontrol sentuh layar HP (Virtual Joystick kiri + tombol Lari)
  touchInput: {
    moveX: 0,
    moveZ: 0,
    sprint: false,
  },

  // Telemetri & throttle performa 3D real-time (tanpa React re-render per frame!)
  perf: {
    fps: 60,
    frameMs: 16.6,
    drawCalls: 0,
    triangles: 0,
    culledProps: 0,
    totalProps: 0,
    activeLights: 0,
    totalLights: 0,
    cullRadius: 58,
    frameIndex: 0,
    isPotato: false,
    isLowPerf: false,
    sceneReady: false,
  },

  // Posisi real-time Nadia & Kira (tetap akurat baik di rumah maupun saat jalan sore bersama!)
  companions: {
    nadia: { pos: [-16.2, 0.08, 66.2] as [number, number, number], yaw: -0.9 },
    kira: { pos: [-18.7, 0.08, 65.0] as [number, number, number], yaw: 0.4 },
    snapPending: false,
  },
};

export function setRuntimePosition(pos: [number, number, number], rot?: number) {
  playerRuntime.position = [pos[0], pos[1], pos[2]];
  if (typeof rot === 'number') {
    playerRuntime.rotationY = rot;
    playerRuntime.cameraYaw = rot;
  }
  playerRuntime.sitState = null;
  playerRuntime.scooter.isRiding = false;
  playerRuntime.scooter.speed = 0;
  playerRuntime.bicycle.isRiding = false;
  playerRuntime.bicycle.speed = 0;
  playerRuntime.touchInput.moveX = 0;
  playerRuntime.touchInput.moveZ = 0;
  playerRuntime.teleportPending = { pos: [pos[0], pos[1], pos[2]], rot };
  playerRuntime.companions.snapPending = true;
}

export function resetCompanionsToHome() {
  playerRuntime.companions.nadia = { pos: [-16.2, 0.08, 66.2], yaw: -0.9 };
  playerRuntime.companions.kira = { pos: [-18.7, 0.08, 65.0], yaw: 0.4 };
  playerRuntime.companions.snapPending = false;
}

export function resetScooterToHome() {
  playerRuntime.scooter = {
    pos: [-15.2, 0.04, 57.5],
    yaw: -0.45,
    speed: 0,
    steer: 0,
    roll: 0,
    wheelAngle: 0,
    isRiding: false,
    isBraking: false,
  };
  playerRuntime.bicycle = {
    pos: [-68.8, 0.02, -8.5],
    yaw: 0.7,
    speed: 0,
    steer: 0,
    roll: 0,
    wheelAngle: 0,
    pedalAngle: 0,
    isRiding: false,
  };
  playerRuntime.paperBoats = [];
  playerRuntime.catHeartTimer = 0;
  playerRuntime.cafeCatHeartTimer = 0;
  playerRuntime.koiFeedTimer = 0;
  playerRuntime.pigeonFeedTimer = 0;
  playerRuntime.gardenWaterTimer = 0;
  playerRuntime.badmintonRallyTimer = 0;
  playerRuntime.kentonganSwingTimer = 0;
  playerRuntime.windChimeTimer = 0;
  playerRuntime.stationGateTimer = 0;
  playerRuntime.pingPongRallyTimer = 0;
  playerRuntime.chessMoveTimer = 0;
  playerRuntime.chessMoveStep = 0;
  playerRuntime.lotusFrogHopTimer = 0;
  playerRuntime.birdcageChirpTimer = 0;
  playerRuntime.fountainDrinkTimer = 0;
  playerRuntime.melatiPortalTimer = 0;
  playerRuntime.fruitScaleSwingTimer = 0;
  playerRuntime.fruitPurchaseStep = 0;
  playerRuntime.barberCutTimer = 0;
  playerRuntime.nurseryPickStep = 0;
  playerRuntime.gallonRefillTimer = 0;
  playerRuntime.duckFeedTimer = 0;
  playerRuntime.flowerBouquetStep = 0;
  playerRuntime.bedugRingTimer = 0;
  playerRuntime.putuWhistleTimer = 0;
  playerRuntime.tirePumpTimer = 0;
  playerRuntime.laundrySpinTimer = 0;
  playerRuntime.cilokFryTimer = 0;
  playerRuntime.bikeShareRingTimer = 0;
  playerRuntime.watchRepairTimer = 0;
  playerRuntime.pedalBoatWaveTimer = 0;
  playerRuntime.bandrekSteamTimer = 0;
  playerRuntime.parkLightsPulseTimer = 0;
  playerRuntime.veggieScaleTimer = 0;
  playerRuntime.veggiePurchaseStep = 0;
  playerRuntime.sewingMachineTimer = 0;
  playerRuntime.railCrossingBellTimer = 0;
  playerRuntime.pharmacyPulseTimer = 0;
  playerRuntime.estelerShaveTimer = 0;
  playerRuntime.toyBoxOpenTimer = 0;
  playerRuntime.toyShareStep = 0;
  playerRuntime.gardenSwingTimer = 0;
  playerRuntime.swingBoostTimer = 0;
  playerRuntime.kiteHeight = 0;
  playerRuntime.kitePullBoost = 0;
  playerRuntime.fishingPhase = 'idle';
  playerRuntime.fishingWaitTimer = 0;
  playerRuntime.fishingBiteTimer = 0;
  playerRuntime.fishingTugAnim = 0;
}
