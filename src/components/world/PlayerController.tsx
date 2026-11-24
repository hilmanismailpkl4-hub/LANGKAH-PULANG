import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { musicEngine } from '../../audio/musicEngine';
import { sfxEngine } from '../../audio/sfxEngine';
import { CHARACTERS } from '../../data/characters';
import { getLocationAtPosition, getSurfaceAtPosition, resolvePlayerMovement } from '../../data/worldLocations';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { HumanModel } from './HumanModel';

export const PlayerController: React.FC = () => {
  const { camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const keysRef = useRef<Record<string, boolean>>({});
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(5.2);
  const strideTimerRef = useRef(0);
  const lastStepHalfRef = useRef(0);
  const locCheckTimerRef = useRef(0);

  const lookTargetVec = useRef(new THREE.Vector3());
  const camDesiredVec = useRef(new THREE.Vector3());

  useEffect(() => {
    const dom = gl.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const code = e.code;
      keysRef.current[code] = true;

      const state = useGameStore.getState();
      if (state.screen !== 'playing') return;

      if (code === 'KeyE' && !state.activeDialogue && !state.isMapJournalOpen && !state.isPauseOpen && !state.isQuickGraphicsOpen) {
        if (playerRuntime.nearestInteractable) {
          e.preventDefault();
          playerRuntime.nearestInteractable.onInteract();
        }
      } else if ((code === 'Tab' || code === 'KeyM') && !state.activeDialogue && !state.isPauseOpen && !state.isQuickGraphicsOpen) {
        e.preventDefault();
        state.toggleMapJournal(code === 'KeyM' ? 'map' : 'quests');
      } else if (code === 'KeyJ' && !state.activeDialogue && !state.isPauseOpen && !state.isQuickGraphicsOpen) {
        e.preventDefault();
        state.toggleMapJournal('journal');
      } else if (code === 'Escape') {
        if (state.isQuickGraphicsOpen) {
          state.setQuickGraphicsOpen(false);
        } else if (state.isMapJournalOpen) {
          state.closeMapJournal();
        } else if (!state.activeDialogue) {
          state.setPauseOpen(!state.isPauseOpen);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      const state = useGameStore.getState();
      if (state.screen !== 'playing' || state.activeDialogue || state.isMapJournalOpen || state.isPauseOpen || state.isQuickGraphicsOpen) return;
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const state = useGameStore.getState();
      if (state.screen !== 'playing' || state.activeDialogue || state.isMapJournalOpen || state.isPauseOpen || state.isQuickGraphicsOpen) return;

      const sens = 0.0042 * state.settings.mouseSensitivity;
      if (document.pointerLockElement === dom) {
        playerRuntime.cameraYaw -= e.movementX * sens;
        playerRuntime.cameraPitch = THREE.MathUtils.clamp(
          playerRuntime.cameraPitch + e.movementY * sens * 0.8,
          0.08,
          0.88,
        );
      } else if (isDraggingRef.current) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        playerRuntime.cameraYaw -= dx * sens * 1.15;
        playerRuntime.cameraPitch = THREE.MathUtils.clamp(
          playerRuntime.cameraPitch + dy * sens * 0.9,
          0.08,
          0.88,
        );
      }
    };

    const onDoubleClick = () => {
      const state = useGameStore.getState();
      if (state.screen !== 'playing' || state.activeDialogue || state.isMapJournalOpen || state.isPauseOpen || state.isQuickGraphicsOpen) return;
      if (!document.pointerLockElement && dom.requestPointerLock) {
        dom.requestPointerLock();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const state = useGameStore.getState();
      if (state.screen !== 'playing' || state.activeDialogue || state.isMapJournalOpen || state.isPauseOpen || state.isQuickGraphicsOpen) return;
      zoomRef.current = THREE.MathUtils.clamp(zoomRef.current + e.deltaY * 0.0035, 3.2, 9.2);
    };

    const onBlur = () => {
      keysRef.current = {};
      isDraggingRef.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('blur', onBlur);
    dom.addEventListener('mousedown', onMouseDown);
    dom.addEventListener('dblclick', onDoubleClick);
    dom.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('blur', onBlur);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('dblclick', onDoubleClick);
      dom.removeEventListener('wheel', onWheel);
    };
  }, [gl]);

  useFrame((stateClock, delta) => {
    const dt = Math.min(delta, 0.05);
    const store = useGameStore.getState();

    if (playerRuntime.teleportPending) {
      playerRuntime.position = [...playerRuntime.teleportPending.pos];
      if (typeof playerRuntime.teleportPending.rot === 'number') {
        playerRuntime.rotationY = playerRuntime.teleportPending.rot;
      }
      playerRuntime.teleportPending = null;
    }

    const canControl =
      store.screen === 'playing' &&
      !store.activeDialogue &&
      !store.isMapJournalOpen &&
      !store.isPauseOpen &&
      !store.isQuickGraphicsOpen;

    if (store.screen === 'title') {
      const t = stateClock.clock.getElapsedTime() * 0.1;
      camera.position.set(Math.sin(t) * 46 - 12, 16 + Math.sin(t * 0.65) * 3.5, Math.cos(t) * 46 + 4);
      camera.lookAt(-18, 4.5, 4);
      return;
    }

    let moveX = 0;
    let moveZ = 0;
    const keys = keysRef.current;

    if (canControl) {
      if (keys['KeyW'] || keys['ArrowUp']) moveZ -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) moveZ += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) moveX += 1;
    }

    const isMoving = moveX !== 0 || moveZ !== 0;
    const isRunning = isMoving && Boolean(keys['ShiftLeft'] || keys['ShiftRight']);
    playerRuntime.isMoving = isMoving;
    playerRuntime.isRunning = isRunning;

    const [curX, curY, curZ] = playerRuntime.position;

    if (isMoving) {
      const len = Math.hypot(moveX, moveZ);
      const nx = moveX / len;
      const nz = moveZ / len;

      const yaw = playerRuntime.cameraYaw;
      const forwardX = -Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);
      const rightX = Math.cos(yaw);
      const rightZ = -Math.sin(yaw);

      const worldDx = forwardX * -nz + rightX * nx;
      const worldDz = forwardZ * -nz + rightZ * nx;

      const speed = isRunning ? 8.2 : 4.6;
      const [rx, ry, rz] = resolvePlayerMovement(
        curX,
        curY,
        curZ,
        curX + worldDx * speed * dt,
        curZ + worldDz * speed * dt,
      );
      playerRuntime.position = [rx, ry, rz];

      const targetRot = Math.atan2(worldDx, worldDz);
      let diff = targetRot - playerRuntime.rotationY;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      playerRuntime.rotationY += diff * Math.min(1, dt * 11);

      const freq = isRunning ? 10.5 : 7.2;
      strideTimerRef.current += dt * freq;
      const halfCycle = Math.floor(strideTimerRef.current / Math.PI);
      if (halfCycle !== lastStepHalfRef.current) {
        lastStepHalfRef.current = halfCycle;
        const surf = getSurfaceAtPosition(rx, ry, rz);
        sfxEngine.playFootstep(surf, isRunning);
      }
    } else {
      strideTimerRef.current = 0;
    }

    if (groupRef.current) {
      const [px, py, pz] = playerRuntime.position;
      const bob = isMoving
        ? Math.abs(Math.sin(strideTimerRef.current)) * 0.055
        : Math.sin(stateClock.clock.getElapsedTime() * 2.0) * 0.012;
      groupRef.current.position.set(px, py + bob, pz);
      groupRef.current.rotation.y = playerRuntime.rotationY;

      const swing = isMoving ? Math.sin(strideTimerRef.current) * (isRunning ? 0.62 : 0.38) : 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.72;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.72;
    }

    const [px, py, pz] = playerRuntime.position;
    const isIndoors =
      (px >= -27 && px <= -13 && pz >= 62 && pz <= 74) ||
      (px >= -28 && px <= -12 && pz >= 14 && pz <= 27);
    const desiredDist = isIndoors ? Math.min(zoomRef.current, 3.6) : zoomRef.current;

    const pitch = playerRuntime.cameraPitch;
    const yaw = playerRuntime.cameraYaw;

    const camOffsetX = Math.sin(yaw) * Math.cos(pitch) * desiredDist;
    const camOffsetY = Math.sin(pitch) * desiredDist + 1.75;
    const camOffsetZ = Math.cos(yaw) * Math.cos(pitch) * desiredDist;

    camDesiredVec.current.set(px + camOffsetX, py + camOffsetY, pz + camOffsetZ);
    camera.position.lerp(camDesiredVec.current, Math.min(1, dt * 9));

    lookTargetVec.current.set(px, py + 1.48, pz);
    camera.lookAt(lookTargetVec.current);

    locCheckTimerRef.current += dt;
    if (locCheckTimerRef.current > 0.35) {
      locCheckTimerRef.current = 0;
      const loc = getLocationAtPosition(playerRuntime.position);
      if (loc.id !== store.currentLocation) {
        store.setCurrentLocation(loc.id);
        musicEngine.setContext(loc.musicMood, store.timeOfDay);
      }
    }
  });

  return (
    <group ref={groupRef} position={[-19.5, 0.08, 67.5]}>
      <HumanModel
        profile={CHARACTERS.damar}
        leftLegRef={leftLegRef}
        rightLegRef={rightLegRef}
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
      />
    </group>
  );
};
