import { InteractableTarget } from '../types/game';

/**
 * Runtime mutable state di luar React state agar pergerakan 3D 60 FPS ringan tanpa re-render berlebihan.
 */
export const playerRuntime = {
  position: [-19.5, 0.08, 67.5] as [number, number, number],
  rotationY: Math.PI,
  cameraYaw: Math.PI,
  cameraPitch: 0.28,
  isMoving: false,
  isRunning: false,
  teleportPending: null as { pos: [number, number, number]; rot?: number } | null,
  nearestInteractable: null as InteractableTarget | null,
};

export function setRuntimePosition(pos: [number, number, number], rot?: number) {
  playerRuntime.position = [pos[0], pos[1], pos[2]];
  if (typeof rot === 'number') {
    playerRuntime.rotationY = rot;
    playerRuntime.cameraYaw = rot;
  }
  playerRuntime.teleportPending = { pos: [pos[0], pos[1], pos[2]], rot };
}
