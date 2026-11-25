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
  koiFeedTimer: 0,
  koiFeedPoint: [-73.2, -24.6] as [number, number],
  pigeonFeedTimer: 0,
  pigeonFeedPoint: [-81.5, 12.2] as [number, number],
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
  playerRuntime.koiFeedTimer = 0;
  playerRuntime.pigeonFeedTimer = 0;
  playerRuntime.swingBoostTimer = 0;
  playerRuntime.kiteHeight = 0;
  playerRuntime.kitePullBoost = 0;
  playerRuntime.fishingPhase = 'idle';
  playerRuntime.fishingWaitTimer = 0;
  playerRuntime.fishingBiteTimer = 0;
  playerRuntime.fishingTugAnim = 0;
}
