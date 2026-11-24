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
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const keysRef = useRef<Record<string, boolean>>({});
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(5.2);
  const velocityRef = useRef({ x: 0, z: 0 });
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

      if (
        code === 'KeyE' &&
        !state.activeDialogue &&
        !state.isMapJournalOpen &&
        !state.isPauseOpen &&
        !state.isQuickGraphicsOpen
      ) {
        if (playerRuntime.nearestInteractable) {
          e.preventDefault();
          playerRuntime.nearestInteractable.onInteract();
        }
      } else if (
        code === 'KeyF' &&
        !state.activeDialogue &&
        !state.isMapJournalOpen &&
        !state.isPauseOpen &&
        !state.isQuickGraphicsOpen
      ) {
        // Damar melambaikan tangan menyapa warga sekitar!
        playerRuntime.damarWaveTimer = 1.65;
        sfxEngine.play('interact');
        state.showToast('Damar melambaikan tangan menyapa sekitar.');
      } else if (
        (code === 'Tab' || code === 'KeyM') &&
        !state.activeDialogue &&
        !state.isPauseOpen &&
        !state.isQuickGraphicsOpen
      ) {
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
      if (
        state.screen !== 'playing' ||
        state.activeDialogue ||
        state.isMapJournalOpen ||
        state.isPauseOpen ||
        state.isQuickGraphicsOpen
      )
        return;
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const state = useGameStore.getState();
      if (
        state.screen !== 'playing' ||
        state.activeDialogue ||
        state.isMapJournalOpen ||
        state.isPauseOpen ||
        state.isQuickGraphicsOpen
      )
        return;

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
      if (
        state.screen !== 'playing' ||
        state.activeDialogue ||
        state.isMapJournalOpen ||
        state.isPauseOpen ||
        state.isQuickGraphicsOpen
      )
        return;
      if (!document.pointerLockElement && dom.requestPointerLock) {
        dom.requestPointerLock();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const state = useGameStore.getState();
      if (
        state.screen !== 'playing' ||
        state.activeDialogue ||
        state.isMapJournalOpen ||
        state.isPauseOpen ||
        state.isQuickGraphicsOpen
      )
        return;
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
    const t = stateClock.clock.getElapsedTime();
    const store = useGameStore.getState();

    if (playerRuntime.teleportPending) {
      playerRuntime.position = [...playerRuntime.teleportPending.pos];
      if (typeof playerRuntime.teleportPending.rot === 'number') {
        playerRuntime.rotationY = playerRuntime.teleportPending.rot;
      }
      velocityRef.current = { x: 0, z: 0 };
      playerRuntime.teleportPending = null;
    }

    if (playerRuntime.damarWaveTimer > 0) {
      playerRuntime.damarWaveTimer = Math.max(0, playerRuntime.damarWaveTimer - dt);
    }

    const canControl =
      store.screen === 'playing' &&
      !store.activeDialogue &&
      !store.isMapJournalOpen &&
      !store.isPauseOpen &&
      !store.isQuickGraphicsOpen;

    if (store.screen === 'title') {
      const orbit = t * 0.1;
      camera.position.set(Math.sin(orbit) * 46 - 12, 16 + Math.sin(orbit * 0.65) * 3.5, Math.cos(orbit) * 46 + 4);
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

    const hasInput = moveX !== 0 || moveZ !== 0;
    const isRunning = hasInput && Boolean(keys['ShiftLeft'] || keys['ShiftRight']);

    let desiredVx = 0;
    let desiredVz = 0;
    if (hasInput) {
      const len = Math.hypot(moveX, moveZ);
      const nx = moveX / len;
      const nz = moveZ / len;
      const yaw = playerRuntime.cameraYaw;
      const forwardX = -Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);
      const rightX = Math.cos(yaw);
      const rightZ = -Math.sin(yaw);
      const maxSpd = isRunning ? 8.0 : 4.5;
      desiredVx = (forwardX * -nz + rightX * nx) * maxSpd;
      desiredVz = (forwardZ * -nz + rightZ * nx) * maxSpd;
    }

    // Inersia gerak halus (akselerasi & deselerasi natural)
    const blend = Math.min(1, dt * (hasInput ? 11 : 14));
    velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, desiredVx, blend);
    velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, desiredVz, blend);

    const speedMag = Math.hypot(velocityRef.current.x, velocityRef.current.z);
    const isMoving = speedMag > 0.25;
    playerRuntime.isMoving = isMoving;
    playerRuntime.isRunning = isRunning && isMoving;
    playerRuntime.moveSpeed = speedMag;

    const [curX, curY, curZ] = playerRuntime.position;
    // Selalu jalankan resolvePlayerMovement agar mobil yang berhenti atau NPC tetap menjaga jarak fisik!
    const [rx, ry, rz] = resolvePlayerMovement(
      curX,
      curY,
      curZ,
      curX + velocityRef.current.x * dt,
      curZ + velocityRef.current.z * dt,
    );
    playerRuntime.position = [rx, ry, rz];

    if (isMoving) {
      const targetRot = Math.atan2(velocityRef.current.x, velocityRef.current.z);
      let diff = targetRot - playerRuntime.rotationY;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      playerRuntime.rotationY += diff * Math.min(1, dt * 11);

      const freq = isRunning ? 10.2 : 7.0;
      strideTimerRef.current += dt * freq * Math.min(1.2, speedMag / 4.2);
      const halfCycle = Math.floor(strideTimerRef.current / Math.PI);
      if (halfCycle !== lastStepHalfRef.current) {
        lastStepHalfRef.current = halfCycle;
        const surf = getSurfaceAtPosition(rx, ry, rz);
        sfxEngine.playFootstep(surf, isRunning);
      }
    } else {
      strideTimerRef.current = 0;
      // Saat berbicara dengan NPC, badan Damar menghadap lembut ke lawan bicara
      if (store.activeDialogue && playerRuntime.activeSpeakerPos) {
        const sp = playerRuntime.activeSpeakerPos;
        const faceYaw = Math.atan2(sp[0] - rx, sp[2] - rz);
        let diff = faceYaw - playerRuntime.rotationY;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        playerRuntime.rotationY += diff * Math.min(1, dt * 7);
      }
    }

    // === ANIMASI EKSPRESIF TUBUH, LENGAN & KEPALA DAMAR ===
    if (groupRef.current) {
      const [px, py, pz] = playerRuntime.position;
      const bob = isMoving
        ? Math.abs(Math.sin(strideTimerRef.current)) * 0.055
        : Math.sin(t * 2.0) * 0.012;
      groupRef.current.position.set(px, py + bob, pz);
      groupRef.current.rotation.y = playerRuntime.rotationY;

      const swing = isMoving ? Math.sin(strideTimerRef.current) * Math.min(0.65, speedMag * 0.085) : 0;
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, swing, dt * 14);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -swing, dt * 14);

      if (torsoRef.current) {
        // Condong halus ke depan saat berjalan cepat
        const lean = isMoving ? (isRunning ? 0.12 : 0.045) : 0;
        torsoRef.current.rotation.x = THREE.MathUtils.lerp(torsoRef.current.rotation.x, lean, dt * 8);
      }

      if (leftArmRef.current && rightArmRef.current) {
        const damarSpeaking =
          store.activeDialogue &&
          store.activeNodeId &&
          store.activeDialogue.nodes[store.activeNodeId]?.speaker === 'damar';

        if (playerRuntime.damarWaveTimer > 0) {
          // Damar melambaikan tangan ramah [F]
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -2.4, dt * 10);
          rightArmRef.current.rotation.z = Math.sin(t * 11) * 0.3 + 0.35;
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -swing * 0.6, dt * 10);
        } else if (damarSpeaking) {
          rightArmRef.current.rotation.x = -0.45 + Math.sin(t * 4.4) * 0.22;
          rightArmRef.current.rotation.z = 0.1;
          leftArmRef.current.rotation.x = -0.25 + Math.cos(t * 3.8) * 0.16;
        } else {
          leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -swing * 0.72, dt * 12);
          rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, swing * 0.72, dt * 12);
          rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, dt * 10);
        }
      }

      // Kepala Damar menoleh halus ke objek/NPC terdekat atau lawan bicara
      if (headRef.current) {
        const focusPos =
          store.activeDialogue && playerRuntime.activeSpeakerPos
            ? playerRuntime.activeSpeakerPos
            : playerRuntime.nearestInteractable?.position ?? null;
        if (focusPos) {
          const ang = Math.atan2(focusPos[0] - px, focusPos[2] - pz);
          let rel = ang - playerRuntime.rotationY;
          while (rel > Math.PI) rel -= Math.PI * 2;
          while (rel < -Math.PI) rel += Math.PI * 2;
          headRef.current.rotation.y = THREE.MathUtils.lerp(
            headRef.current.rotation.y,
            THREE.MathUtils.clamp(rel, -0.68, 0.68),
            dt * 7,
          );
        } else {
          const subtleScan = !isMoving ? Math.sin(t * 0.6) * 0.14 : 0;
          headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, subtleScan, dt * 4);
        }
      }
    }

    // === KAMERA THIRD-PERSON + KAMERA DIALOG SINEMATIK ===
    const [px, py, pz] = playerRuntime.position;

    if (store.activeDialogue && playerRuntime.activeSpeakerPos) {
      // Framing sinematik dua tokoh (over-the-shoulder lembut)
      const [sx, sy, sz] = playerRuntime.activeSpeakerPos;
      const midX = (px + sx) * 0.5;
      const midY = Math.max(py, sy) + 1.45;
      const midZ = (pz + sz) * 0.5;
      const dx = sx - px;
      const dz = sz - pz;
      const dist = Math.max(0.8, Math.hypot(dx, dz));
      // Ambil sudut miring dari samping kanan belakang Damar
      const sideX = -dz / dist;
      const sideZ = dx / dist;
      const camX = px - (dx / dist) * 1.9 + sideX * 1.85;
      const camY = py + 1.95;
      const camZ = pz - (dz / dist) * 1.9 + sideZ * 1.85;

      camDesiredVec.current.set(camX, camY, camZ);
      camera.position.lerp(camDesiredVec.current, Math.min(1, dt * 4.5));
      lookTargetVec.current.lerp(new THREE.Vector3(midX, midY, midZ), Math.min(1, dt * 5.5));
      camera.lookAt(lookTargetVec.current);
    } else {
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
    }

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
        headRef={headRef}
        torsoRef={torsoRef}
      />
    </group>
  );
};
