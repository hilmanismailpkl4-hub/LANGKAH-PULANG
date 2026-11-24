import { InteractableTarget } from '../types/game';

export interface DynamicCarBox {
  id: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface DynamicNpcCircle {
  id: string;
  x: number;
  z: number;
  radius: number;
}

/**
 * Siklus lampu lalu lintas terpadu (dipakai bersama oleh tiang lampu lalu lintas & AI mobil):
 * 0..7.5s = Utara-Selatan HIJAU (Timur-Barat MERAH)
 * 7.5..9.5s = KUNING transisi (semua melambat/berhenti)
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
 * Runtime mutable state di luar React state agar pergerakan 3D, kolisi mobil/NPC,
 * animasi interaksi, dan kamera dialog berjalan mulus 60 FPS tanpa re-render berlebihan.
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
  npcColliders: [] as DynamicNpcCircle[],
};

export function setRuntimePosition(pos: [number, number, number], rot?: number) {
  playerRuntime.position = [pos[0], pos[1], pos[2]];
  if (typeof rot === 'number') {
    playerRuntime.rotationY = rot;
    playerRuntime.cameraYaw = rot;
  }
  playerRuntime.teleportPending = { pos: [pos[0], pos[1], pos[2]], rot };
}
