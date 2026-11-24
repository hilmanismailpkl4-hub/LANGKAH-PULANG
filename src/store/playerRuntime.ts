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
}

/**
 * Siklus lampu lalu lintas terpadu (dipakai bersama oleh tiang lampu lalu lintas & AI mobil):
 * 0..7.5s = Utara-Selatan HIJAU (Timur-Barat MERAH)
 * 7.5..9.5s = KUNING transisi
 * 9.5..17s = Timur-Barat HIJAU (Utara-Selatan MERAH)
 * 17..19s = KUNING transisi
 */
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
 * Runtime mutable state 60 FPS untuk fisika solid, mobil, pejalan kaki, duduk reflektif, dan mini-map.
 */
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
};

export function setRuntimePosition(pos: [number, number, number], rot?: number) {
  playerRuntime.position = [pos[0], pos[1], pos[2]];
  if (typeof rot === 'number') {
    playerRuntime.rotationY = rot;
    playerRuntime.cameraYaw = rot;
  }
  playerRuntime.sitState = null;
  playerRuntime.teleportPending = { pos: [pos[0], pos[1], pos[2]], rot };
}
