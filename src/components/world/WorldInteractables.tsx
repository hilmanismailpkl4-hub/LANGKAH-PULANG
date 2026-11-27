import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { resolveDynamicNpcAmbient } from '../../data/characterEchoes';
import { CHARACTERS } from '../../data/characters';
import { KIRA_OUTFIT_BY_ID, KiraOutfitId, NADIA_OUTFIT_BY_ID, NadiaOutfitId } from '../../data/damarOutfits';
import { EASTER_EGGS } from '../../data/easterEggs';
import { EPILOGUE_MORNING_META, resolveEpilogueNpcDialogue } from '../../data/epilogueMorning';
import {
  EVENT_FAMILY_BANTERS,
  LOCATION_FAMILY_BANTERS,
  SPOT_FAMILY_BANTERS,
  WEATHER_FAMILY_BANTERS,
} from '../../data/familyWalkBanter';
import { ELEVATOR_PORTALS, isPositionSheltered, resolveCompanionMovement } from '../../data/worldLocations';
import { playerRuntime, setRuntimePosition } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { CharacterId, InteractableTarget, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';

interface NpcPlacement {
  id: CharacterId;
  pos: [number, number, number];
  rot: number;
  greeting: string;
}

const FEMALE_NPCS: CharacterId[] = ['nadia', 'nenek_sari', 'mbak_lilis', 'bu_wati'];

const NPC_PLACEMENTS: NpcPlacement[] = [
  { id: 'nadia', pos: [-16.2, 0.08, 66.2], rot: -0.9, greeting: 'Mas, sarapannya masih hangat...' },
  { id: 'kira', pos: [-18.7, 0.08, 65.0], rot: 0.4, greeting: 'Ayah! Lihat gambar Kira!' },
  { id: 'bima', pos: [-20.0, 0.08, 21.0], rot: Math.PI, greeting: 'Ngopi dulu sini, Mar!' },
  { id: 'pak_hendra', pos: [27.0, 0.08, -22.5], rot: 0, greeting: 'Damar, mari bicara sebentar.' },
  { id: 'pak_darman', pos: [76.2, 0.1, -4.0], rot: -Math.PI / 2, greeting: 'Eh, Nak Damar... mampir lihat buku?' },
  { id: 'nenek_sari', pos: [-68.0, 0, -18.0], rot: 0.6, greeting: 'Angin danaunya enak ya, Nak...' },
  { id: 'mas_raka', pos: [-48.0, 0.24, -5.0], rot: 0, greeting: 'Huh... angin jembatan dingin ya, Mas.' },
  { id: 'mas_bagas', pos: [-20.0, 0, -17.5], rot: 0, greeting: 'Lho, Damar! Lama nggak mampir!' },
  { id: 'mbak_lilis', pos: [24.0, 0, 15.8], rot: Math.PI, greeting: 'Selamat datang di Harmoni, Mas!' },
  { id: 'bu_wati', pos: [24.0, 0, 61.8], rot: Math.PI, greeting: 'Halo Nak Damar, jalan kaki santai?' },
  { id: 'pak_slamet', pos: [-12.8, 0, 40.2], rot: 0.4, greeting: 'Mari Mas Damar, wedang jahenya hangat!' },
  { id: 'bang_ari', pos: [79.5, 0.1, 4.5], rot: -Math.PI / 2, greeting: 'Mas Damar! Lagu lama kamu masih enak lho!' },
  { id: 'pak_budi', pos: [-67.5, 0, -37.0], rot: -Math.PI / 2, greeting: 'Sore yang tenang ya, Mas...' },
];

function createBubbleTexture(name: string, greeting: string, accent: string, tag?: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 148;
  const ctx = canvas.getContext('2d')!;

  // Latar kapsul hangat transparan
  ctx.fillStyle = 'rgba(14, 18, 28, 0.84)';
  const r = 24;
  ctx.beginPath();
  ctx.roundRect(14, 14, 484, 114, r);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Nama karakter
  ctx.fillStyle = accent;
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(tag ? `${name} · ${tag}` : name, 256, 56);

  // Sapaan singkat hangat
  ctx.fillStyle = '#f8f2e8';
  ctx.font = 'italic 23px Georgia, serif';
  ctx.fillText(`"${greeting}"`, 256, 98);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const NpcFigure: React.FC<{
  npc: NpcPlacement;
  highlight?: 'main' | 'side' | null;
  isFamilyCompanion?: boolean;
  timeOfDay: TimeOfDay;
  nadiaOutfitId?: NadiaOutfitId;
  kiraOutfitId?: KiraOutfitId;
}> = ({ npc, highlight, isFamilyCompanion = false, timeOfDay, nadiaOutfitId, kiraOutfitId }) => {
  const { camera } = useThree();
  const baseProfile = CHARACTERS[npc.id];
  const profile = useMemo(() => {
    if (npc.id === 'nadia' && nadiaOutfitId) {
      const o = NADIA_OUTFIT_BY_ID[nadiaOutfitId];
      if (o) {
        return {
          ...baseProfile,
          appearance: {
            ...baseProfile.appearance,
            shirtColor: o.shirtColor,
            pantsColor: o.pantsColor,
            accentProp: o.accentProp,
          },
        };
      }
    }
    if (npc.id === 'kira' && kiraOutfitId) {
      const o = KIRA_OUTFIT_BY_ID[kiraOutfitId];
      if (o) {
        return {
          ...baseProfile,
          appearance: {
            ...baseProfile.appearance,
            shirtColor: o.shirtColor,
            pantsColor: o.pantsColor,
            accentProp: o.accentProp,
          },
        };
      }
    }
    return baseProfile;
  }, [baseProfile, npc.id, nadiaOutfitId, kiraOutfitId]);
  const scale = profile.appearance.height / 1.74;
  const isChild = npc.id === 'kira';

  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const bubbleRef = useRef<THREE.Sprite>(null);

  const posRef = useRef<[number, number, number]>([...npc.pos]);
  const currentYawRef = useRef(npc.rot);
  const strideRef = useRef(isChild ? 1.1 : 0);
  const bubbleOpacityRef = useRef(0);
  const [compIndoors, setCompIndoors] = useState(true);
  const indoorsCheckRef = useRef(0);

  const isSittingStore = useGameStore((s) => s.isSitting);
  const companionSitting = isFamilyCompanion && isSittingStore;
  const companionUmbrella = isFamilyCompanion && timeOfDay === 'rain_dusk' && !compIndoors && !companionSitting;
  const companionUmbrellaRef = useRef(companionUmbrella);
  companionUmbrellaRef.current = companionUmbrella;

  const bubbleTex = useMemo(
    () =>
      createBubbleTexture(
        profile.name,
        npc.greeting,
        highlight === 'main' ? '#f6d17a' : highlight === 'side' ? '#8ec5a3' : profile.accentColor,
        highlight === 'main' ? 'Cerita' : highlight === 'side' ? 'Misi' : undefined,
      ),
    [profile.name, npc.greeting, profile.accentColor, highlight],
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;
    const store = useGameStore.getState();

    let isWalkingCompanion = false;
    let isSittingCompanion = false;

    // === AI PENGIKUT KELUARGA (NADIA & KIRA BERJALAN & DUDUK BARENG DAMAR!) ===
    if (isFamilyCompanion && (npc.id === 'nadia' || npc.id === 'kira')) {
      const yaw = playerRuntime.rotationY;
      const fwdX = Math.sin(yaw);
      const fwdZ = Math.cos(yaw);
      const leftX = Math.cos(yaw);
      const leftZ = -Math.sin(yaw);
      const sideSign = npc.id === 'nadia' ? 1 : -1; // Nadia kiri, Kira kanan

      if (store.isSitting && playerRuntime.sitState) {
        // Duduk rapi berdampingan di bangku/kursi bersama Damar (tanpa terhalang collider bangku!)
        isSittingCompanion = true;
        const sit = playerRuntime.sitState;
        const sitYaw = sit.seatYaw;
        const sLeftX = Math.cos(sitYaw);
        const sLeftZ = -Math.sin(sitYaw);
        const sideOffset = npc.id === 'nadia' ? 0.66 : 0.58;
        const seatX = sit.seatPos[0] + sLeftX * sideSign * sideOffset;
        const seatY = sit.seatPos[1];
        const seatZ = sit.seatPos[2] + sLeftZ * sideSign * sideOffset;

        const [cx, , cz] = posRef.current;
        if (Math.hypot(seatX - cx, seatZ - cz) > 3.5 || playerRuntime.companions.snapPending) {
          posRef.current = [seatX, seatY, seatZ];
        } else {
          posRef.current = [
            THREE.MathUtils.lerp(cx, seatX, Math.min(1, dt * 10)),
            seatY,
            THREE.MathUtils.lerp(cz, seatZ, Math.min(1, dt * 10)),
          ];
        }

        let diff = sitYaw - currentYawRef.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        currentYawRef.current += diff * Math.min(1, dt * 9);
      } else {
        let desiredX: number;
        let desiredZ: number;

        if (store.isPhotoMode) {
          // Berpose manis di sisi Damar menghadap kamera saat Mode Foto [P]!
          desiredX = px + leftX * sideSign * 1.05 + fwdX * 0.15;
          desiredZ = pz + leftZ * sideSign * 1.05 + fwdZ * 0.15;
        } else {
          const sideDist = npc.id === 'nadia' ? 1.32 : 1.2;
          const backDist = npc.id === 'nadia' ? 0.58 : 0.28;
          desiredX = px + leftX * sideSign * sideDist - fwdX * backDist;
          desiredZ = pz + leftZ * sideSign * sideDist - fwdZ * backDist;
        }

        const [cx, cy, cz] = posRef.current;
        const elevDiff = Math.abs(py - cy);
        const distToDamar = Math.hypot(px - cx, pz - cz);

        // Sinkron instan saat naik/turun lift Rooftop, bangun dari duduk, atau tertinggal jauh
        if (playerRuntime.companions.snapPending || elevDiff > 5.0 || distToDamar > 16.0) {
          const snapped = resolveCompanionMovement(
            px,
            py,
            pz,
            desiredX,
            desiredZ,
            isChild ? 0.28 : 0.34,
          );
          posRef.current = snapped;
          if (npc.id === 'kira') {
            playerRuntime.companions.snapPending = false;
          }
        } else {
          // Beri ruang jika Damar berjalan tepat ke arah mereka (anti macet di pintu!)
          if (distToDamar < 0.85 && distToDamar > 0.01) {
            const awayX = (cx - px) / distToDamar;
            const awayZ = (cz - pz) / distToDamar;
            desiredX += awayX * 0.45;
            desiredZ += awayZ * 0.45;
          }

          const toTargetX = desiredX - cx;
          const toTargetZ = desiredZ - cz;
          const distTarget = Math.hypot(toTargetX, toTargetZ);

          if (distTarget > 0.24) {
            isWalkingCompanion = true;
            const maxSpd = playerRuntime.isRunning ? 7.9 : 4.95;
            const spd = Math.min(maxSpd, 1.55 + distTarget * 2.25);
            const step = Math.min(distTarget, spd * dt);
            const nextX = cx + (toTargetX / distTarget) * step;
            const nextZ = cz + (toTargetZ / distTarget) * step;
            posRef.current = resolveCompanionMovement(
              cx,
              py,
              cz,
              nextX,
              nextZ,
              isChild ? 0.28 : 0.34,
            );
            strideRef.current += dt * (isChild ? 9.8 : 7.4) * Math.min(1.35, spd / 3.8);

            const walkYaw = Math.atan2(toTargetX, toTargetZ);
            let diff = walkYaw - currentYawRef.current;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            currentYawRef.current += diff * Math.min(1, dt * 9.5);
          } else {
            // Berhenti halus — hadap pemandangan / kamera / Damar
            let idleYaw = yaw;
            if (store.isPhotoMode) {
              idleYaw = Math.atan2(camera.position.x - cx, camera.position.z - cz);
            } else if (distToDamar < 3.4) {
              idleYaw = Math.atan2(px - cx, pz - cz);
            }
            let diff = idleYaw - currentYawRef.current;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            currentYawRef.current += diff * Math.min(1, dt * 5.5);
          }
        }
      }

      // Perbarui posisi runtime & kolisi real-time Nadia/Kira
      playerRuntime.companions[npc.id].pos = [...posRef.current];
      playerRuntime.companions[npc.id].yaw = currentYawRef.current;
      const colEntry = playerRuntime.npcColliders.find((c) => c.id === npc.id);
      if (colEntry) {
        colEntry.x = posRef.current[0];
        colEntry.z = posRef.current[2];
      }

      // Cek apakah pendamping berada di dalam ruangan / atap halte / kanopi stasiun untuk melipat payung!
      indoorsCheckRef.current += dt;
      if (indoorsCheckRef.current > 0.25) {
        indoorsCheckRef.current = 0;
        const [rx, ry, rz] = posRef.current;
        const shelteredNow = isPositionSheltered(rx, ry, rz);
        setCompIndoors((prev) => (prev === shelteredNow ? prev : shelteredNow));
      }
    } else {
      // Kembali ke titik asal di rumah saat tidak sedang jalan bersama
      posRef.current[0] = npc.pos[0];
      posRef.current[1] = npc.pos[1];
      posRef.current[2] = npc.pos[2];
      if (npc.id === 'nadia' || npc.id === 'kira') {
        playerRuntime.companions[npc.id].pos = [...npc.pos];
        const colEntry = playerRuntime.npcColliders.find((c) => c.id === npc.id);
        if (colEntry) {
          colEntry.x = npc.pos[0];
          colEntry.z = npc.pos[2];
        }
      }
    }

    const [myX, myY, myZ] = posRef.current;
    const dx = px - myX;
    const dz = pz - myZ;
    const dy = Math.abs(py - myY);
    const dist = dy > 4 ? 99 : Math.hypot(dx, dz);

    const isTalkingNow =
      (Boolean(store.activeDialogue) &&
        (playerRuntime.activeSpeakerId === npc.id ||
          (store.activeDialogue &&
            store.activeNodeId &&
            store.activeDialogue.nodes[store.activeNodeId]?.speaker === npc.id))) ||
      (isFamilyCompanion && store.familyBanter?.speaker === npc.id);

    const damarWaving = playerRuntime.damarWaveTimer > 0 && dist < 8.5;
    const isNear = dist < 5.6;
    const isVeryNear = dist < 4.2 || isTalkingNow || damarWaving;

    // 1. Posisi root + bob langkah berjalan / duduk bersama Damar / napas alami
    if (rootRef.current) {
      const sitDrop = isSittingCompanion ? -(isChild ? 0.02 : 0.18) : 0;
      const walkBob = isWalkingCompanion
        ? Math.abs(Math.sin(strideRef.current)) * (isChild ? 0.075 : 0.048)
        : 0;
      rootRef.current.position.set(myX, myY + sitDrop + walkBob, myZ);

      if (!isFamilyCompanion) {
        const desiredYaw = isVeryNear ? Math.atan2(dx, dz) : npc.rot;
        let diff = desiredYaw - currentYawRef.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        currentYawRef.current += diff * Math.min(1, dt * 5.5);
      }
      rootRef.current.rotation.y = currentYawRef.current;
    }

    if (torsoRef.current) {
      const bounce =
        !isWalkingCompanion && !isSittingCompanion && isChild && isNear
          ? Math.abs(Math.sin(t * 5.2)) * 0.045
          : Math.sin(t * 2.1 + npc.pos[0]) * 0.012;
      torsoRef.current.position.y = 0.92 + bounce;
      torsoRef.current.rotation.x = isSittingCompanion
        ? -0.03
        : isWalkingCompanion
          ? 0.06
          : isTalkingNow
            ? Math.sin(t * 3.5) * 0.045
            : 0;
    }

    // 2. Animasi kaki berjalan ATAU menekuk rapi saat duduk bersama Damar!
    const legSwing = isWalkingCompanion ? Math.sin(strideRef.current) * (isChild ? 0.62 : 0.52) : 0;
    if (isSittingCompanion) {
      const childSwing = isChild ? Math.sin(t * 3.1) * 0.16 : 0;
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, -1.35 + childSwing, dt * 12);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -1.35 - childSwing, dt * 12);
      }
    } else {
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, legSwing, dt * 12);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -legSwing, dt * 12);
      }
    }

    // 3. Kontak mata — kepala menoleh ke pemandangan saat duduk, ke kamera saat Mode Foto, atau ke Damar!
    if (headRef.current) {
      if (isSittingCompanion) {
        const softTurn = Math.sin(t * 0.75 + (isChild ? 1.5 : 0)) * 0.22;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, softTurn, dt * 4);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, isChild ? -0.08 : -0.02, dt * 5);
      } else if (isFamilyCompanion && store.isPhotoMode) {
        const angCam = Math.atan2(camera.position.x - myX, camera.position.z - myZ);
        let rel = angCam - currentYawRef.current;
        while (rel > Math.PI) rel -= Math.PI * 2;
        while (rel < -Math.PI) rel += Math.PI * 2;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, THREE.MathUtils.clamp(rel, -0.65, 0.65), dt * 7);
        headRef.current.rotation.x = isChild ? -0.14 : -0.04;
      } else if (dist < 7.5 || isTalkingNow) {
        const angleToPlayer = Math.atan2(dx, dz);
        let relHead = angleToPlayer - currentYawRef.current;
        while (relHead > Math.PI) relHead -= Math.PI * 2;
        while (relHead < -Math.PI) relHead += Math.PI * 2;
        const clamped = THREE.MathUtils.clamp(relHead, -0.75, 0.75);
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, clamped, dt * 7);
        headRef.current.rotation.x = isTalkingNow ? Math.sin(t * 4.2) * 0.08 : isChild ? -0.18 : 0;
      } else {
        const idleLook = Math.sin(t * 0.65 + npc.pos[2]) * 0.16;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, idleLook, dt * 3);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, dt * 4);
      }
    }

    // 4. Lengan: pangku santai saat duduk, payung bening saat hujan, lambaian ramah, & gestur bicara!
    if (rightArmRef.current && leftArmRef.current) {
      const holdUmb = companionUmbrellaRef.current;
      const shouldWave =
        !isSittingCompanion &&
        (damarWaving ||
          (isFamilyCompanion && store.isPhotoMode) ||
          (!isFamilyCompanion &&
            isNear &&
            !store.activeDialogue &&
            (isChild ||
              npc.id === 'bima' ||
              npc.id === 'bu_wati' ||
              npc.id === 'mbak_lilis' ||
              npc.id === 'pak_slamet' ||
              npc.id === 'bang_ari')));

      if (isSittingCompanion) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -0.42, dt * 10);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.06, dt * 8);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -0.42, dt * 10);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.06, dt * 8);
      } else if (shouldWave) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -2.35, dt * 8);
        rightArmRef.current.rotation.z = Math.sin(t * 10.5) * 0.28 + 0.32;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, holdUmb ? -1.28 : 0, dt * 8);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, holdUmb ? -0.06 : 0, dt * 8);
      } else if (isTalkingNow && !isWalkingCompanion) {
        rightArmRef.current.rotation.x = -0.55 + Math.sin(t * 4.6) * 0.28;
        rightArmRef.current.rotation.z = 0.12 + Math.cos(t * 3.8) * 0.1;
        leftArmRef.current.rotation.x = holdUmb ? -1.28 : -0.35 + Math.cos(t * 3.9) * 0.2;
        leftArmRef.current.rotation.z = holdUmb ? -0.06 : 0;
      } else {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, legSwing * 0.72, dt * 10);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, dt * 8);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
          leftArmRef.current.rotation.x,
          holdUmb ? -1.28 + Math.sin(t * 2.1) * 0.025 : -legSwing * 0.72,
          dt * 10,
        );
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, holdUmb ? -0.06 : 0, dt * 8);
      }
    }

    // 5. Penanda misi halus (sembunyikan saat sedang jalan santai bersama agar pemandangan rapi!)
    if (ringRef.current) {
      ringRef.current.visible = !isFamilyCompanion;
      ringRef.current.position.y = 2.15 * scale + Math.sin(t * 2.5) * 0.06;
      ringRef.current.rotation.y = t * 1.1;
    }

    // 6. Balon sapaan WebGL (sembunyikan saat Nadia & Kira sedang jalan bersama agar tidak mengganggu layar)
    if (bubbleRef.current) {
      const showBubble = !isFamilyCompanion && dist < 6.4 && !store.activeDialogue && store.screen === 'playing';
      const targetOp = showBubble ? 0.96 : 0;
      bubbleOpacityRef.current = THREE.MathUtils.lerp(bubbleOpacityRef.current, targetOp, dt * 7);
      const mat = bubbleRef.current.material as THREE.SpriteMaterial;
      mat.opacity = bubbleOpacityRef.current;
      bubbleRef.current.visible = bubbleOpacityRef.current > 0.02;
      bubbleRef.current.position.y = 2.55 * scale + Math.sin(t * 2.0) * 0.04;
    }
  });

  return (
    <group ref={rootRef} position={npc.pos} rotation={[0, npc.rot, 0]}>
      <HumanModel
        profile={profile}
        headRef={headRef}
        torsoRef={torsoRef}
        leftLegRef={leftLegRef}
        rightLegRef={rightLegRef}
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
        isChild={isChild}
        isFemale={FEMALE_NPCS.includes(npc.id)}
        holdingUmbrella={companionUmbrella}
      />

      {highlight && (
        <mesh ref={ringRef} position={[0, 2.15 * scale, 0]}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshStandardMaterial
            color={highlight === 'main' ? '#f6d17a' : '#8ec5a3'}
            emissive={highlight === 'main' ? '#e7a84a' : '#5ca378'}
            emissiveIntensity={2.0}
          />
        </mesh>
      )}

      {/* Balon Nama & Sapaan Interaktif 3D (murni WebGL, tidak pernah menutupi Portal UI!) */}
      <sprite ref={bubbleRef} position={[0, 2.55 * scale, 0]} scale={[2.35, 0.68, 1]}>
        <spriteMaterial map={bubbleTex} transparent opacity={0} depthTest={false} />
      </sprite>
    </group>
  );
};

export const WorldInteractables: React.FC = () => {
  const mainStepId = useGameStore((s) => s.mainStepId);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const flags = useGameStore((s) => s.flags);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const nadiaOutfitId = useGameStore((s) => s.nadiaOutfitId);
  const kiraOutfitId = useGameStore((s) => s.kiraOutfitId);
  const isEpilogueMode = useGameStore((s) => s.isEpilogueMode);
  const epilogueCompleted = useGameStore((s) => s.epilogueCompleted);
  const activeEnding = useGameStore((s) => s.activeEnding);

  const heardBantersRef = useRef<Set<string>>(new Set());
  const lastBanterTimeRef = useRef(0);
  const banterCheckTimerRef = useRef(0);
  const cassetteIdxRef = useRef(0);

  // Daftarkan kolisi tubuh NPC agar Damar tidak bisa menembus NPC
  useEffect(() => {
    playerRuntime.npcColliders = NPC_PLACEMENTS.map((n) => ({
      id: n.id,
      x: n.pos[0],
      z: n.pos[2],
      radius: n.id === 'kira' ? 0.34 : 0.44,
    }));
  }, []);

  // Bersihkan fokus kamera dialog saat percakapan selesai
  useEffect(() => {
    if (!activeDialogue) {
      playerRuntime.activeSpeakerPos = null;
      playerRuntime.activeSpeakerId = null;
    }
  }, [activeDialogue]);

  const resolveNpcInteraction = useMemo(() => {
    return (npcId: CharacterId): { dialogueId: string; highlight: 'main' | 'side' | null; sublabel: string } => {
      const store = useGameStore.getState();

      if (store.isEpilogueMode && store.activeEnding) {
        if ((npcId === 'nadia' || npcId === 'kira') && !store.epilogueCompleted) {
          return {
            dialogueId: EPILOGUE_MORNING_META[store.activeEnding].familyDialogueId,
            highlight: 'main',
            sublabel: 'Epilog · Pagi Setelah Pulang',
          };
        }
        const epNpc = resolveEpilogueNpcDialogue(npcId, store.activeEnding, store.epilogueCompleted);
        if (epNpc) {
          return {
            dialogueId: epNpc.dialogueId,
            highlight: npcId === 'nadia' || npcId === 'kira' ? null : 'side',
            sublabel: epNpc.sublabel,
          };
        }
      }

      if (npcId === 'nadia' || npcId === 'kira') {
        if (store.mainStepId === 'ch1_1_sarapan') {
          return { dialogueId: 'ch1_sarapan_main', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.mainStepId === 'ch3_2_kembali_ke_rumah') {
          return { dialogueId: 'ch3_meja_makan_finale', highlight: 'main', sublabel: 'Momen Penentu' };
        }
        if (npcId === 'kira' && store.flags.includes('has_gift_kira') && !store.flags.includes('gave_gift_kira')) {
          return { dialogueId: 'gift_kira_watercolor', highlight: 'side', sublabel: 'Berikan Hadiah!' };
        }
        if (npcId === 'nadia' && store.flags.includes('has_gift_nadia') && !store.flags.includes('gave_gift_nadia')) {
          return { dialogueId: 'gift_nadia_flower', highlight: 'side', sublabel: 'Berikan Hadiah!' };
        }
      }
      if (npcId === 'bima') {
        if (store.mainStepId === 'ch1_2_kedai_bima') {
          return { dialogueId: 'ch1_bima_main', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.mainStepId === 'ch2_3_kedai_hujan') {
          return { dialogueId: 'ch2_bima_hujan', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.sideQuests.sq_mas_raka?.status === 'active' && store.sideQuests.sq_mas_raka.stage === 1) {
          return { dialogueId: 'sq_helper_bima_coffee', highlight: 'side', sublabel: 'Misi Sampingan' };
        }
        if (store.sideQuests.sq_mas_bagas?.status === 'active' && store.sideQuests.sq_mas_bagas.stage === 1) {
          return { dialogueId: 'sq_helper_bima_key', highlight: 'side', sublabel: 'Misi Sampingan' };
        }
      }
      if (npcId === 'pak_hendra') {
        if (store.mainStepId === 'ch1_3_kantor_hendra') {
          return { dialogueId: 'ch1_hendra_main', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.mainStepId === 'ch2_1_persimpangan') {
          return { dialogueId: 'ch2_hendra_persimpangan', highlight: 'main', sublabel: 'Persimpangan' };
        }
      }
      if (npcId === 'mas_bagas') {
        if (store.mainStepId === 'ch1_4_benda_lama') {
          return { dialogueId: 'ch1_benda_lama_main', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.sideQuests.sq_bang_ari?.status === 'active' && store.sideQuests.sq_bang_ari.stage === 1) {
          return { dialogueId: 'sq_helper_bagas_capo', highlight: 'side', sublabel: 'Misi Sampingan' };
        }
        const sq = store.sideQuests.sq_mas_bagas;
        if (!sq) return { dialogueId: 'sq_mas_bagas_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_mas_bagas_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
      }

      if (npcId === 'pak_darman') {
        if (store.sideQuests.sq_mbak_lilis?.status === 'active' && store.sideQuests.sq_mbak_lilis.stage === 1) {
          return { dialogueId: 'sq_helper_darman_sketchbook', highlight: 'side', sublabel: 'Misi Sampingan' };
        }
        const sq = store.sideQuests.sq_pak_darman;
        if (!sq) return { dialogueId: 'sq_pak_darman_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_pak_darman_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_darman', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'nenek_sari') {
        const sq = store.sideQuests.sq_nenek_sari;
        if (!sq) return { dialogueId: 'sq_nenek_sari_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_nenek_sari_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_sari', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'mas_raka') {
        const sq = store.sideQuests.sq_mas_raka;
        if (!sq) return { dialogueId: 'sq_mas_raka_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_mas_raka_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_raka', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'mbak_lilis') {
        if (store.sideQuests.sq_nenek_sari?.status === 'active' && store.sideQuests.sq_nenek_sari.stage === 1) {
          return { dialogueId: 'sq_helper_lilis_tea', highlight: 'side', sublabel: 'Misi Sampingan' };
        }
        if (store.sideQuests.sq_pak_slamet?.status === 'active' && store.sideQuests.sq_pak_slamet.stage === 1) {
          return { dialogueId: 'sq_helper_lilis_ginger', highlight: 'side', sublabel: 'Misi Sampingan' };
        }
        const sq = store.sideQuests.sq_mbak_lilis;
        if (!sq) return { dialogueId: 'sq_mbak_lilis_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_mbak_lilis_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_lilis', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'bu_wati') {
        const sq = store.sideQuests.sq_bu_wati;
        if (!sq) return { dialogueId: 'sq_bu_wati_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_bu_wati_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_wati', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'pak_slamet') {
        const sq = store.sideQuests.sq_pak_slamet;
        if (!sq) return { dialogueId: 'sq_pak_slamet_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_pak_slamet_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_slamet', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'bang_ari') {
        const sq = store.sideQuests.sq_bang_ari;
        if (!sq) return { dialogueId: 'sq_bang_ari_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_bang_ari_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_ari', highlight: null, sublabel: 'Berbincang' };
      }

      if (npcId === 'pak_budi') {
        const sq = store.sideQuests.sq_pak_budi;
        if (!sq) return { dialogueId: 'sq_pak_budi_start', highlight: 'side', sublabel: 'Misi Warga' };
        if (sq.status === 'active' && sq.stage === 2) {
          return { dialogueId: 'sq_pak_budi_complete', highlight: 'side', sublabel: 'Selesaikan Misi' };
        }
        return { dialogueId: 'ambient_budi', highlight: null, sublabel: 'Berbincang' };
      }

      // Gema Pilihan & Ingatan Karakter: NPC utama mengingat apa yang sudah dialami/dipilih Damar!
      const dynamicEcho = resolveDynamicNpcAmbient(npcId, store.flags, store.repliedPhonePrompts);
      if (dynamicEcho) {
        return {
          dialogueId: dynamicEcho.dialogueId,
          highlight: null,
          sublabel: dynamicEcho.sublabel,
        };
      }

      const ambientMap: Partial<Record<CharacterId, string>> = {
        nadia: 'ambient_nadia',
        kira: 'ambient_kira',
        bima: 'ambient_bima',
        pak_hendra: 'ambient_hendra',
        mas_bagas: 'ambient_bagas',
      };
      return {
        dialogueId: ambientMap[npcId] ?? 'ambient_bima',
        highlight: null,
        sublabel: 'Berbincang',
      };
    };
  }, [mainStepId, sideQuests, flags, isEpilogueMode, epilogueCompleted, activeEnding]);

  useFrame((_, delta) => {
    const store = useGameStore.getState();

    // === PICU OBROLAN SPONTAN KELUARGA OTOMATIS SAAT MELINTASI LOKASI / CUACA BARU ===
    if (
      store.isFamilyWalkActive &&
      store.screen === 'playing' &&
      !store.activeDialogue &&
      !store.familyBanter &&
      !store.isPauseOpen &&
      !store.isMapJournalOpen &&
      !store.isPhoneOpen
    ) {
      banterCheckTimerRef.current += Math.min(delta, 0.05);
      if (banterCheckTimerRef.current > 1.4) {
        banterCheckTimerRef.current = 0;
        const now = Date.now();
        if (now - lastBanterTimeRef.current > 19000) {
          const [px, py, pz] = playerRuntime.position;

          // 1. Cek sudut spesial (Angkringan Pak Slamet / Kucing Sore)
          let picked: { id: string; lines: { speaker: 'nadia' | 'kira' | 'damar'; text: string }[] } | null = null;
          if (py < 6) {
            for (const sp of SPOT_FAMILY_BANTERS) {
              if (!heardBantersRef.current.has(sp.id) && Math.hypot(px - sp.x, pz - sp.z) <= sp.radius) {
                picked = { id: sp.id, lines: sp.lines };
                break;
              }
            }
          }

          // 2. Cek cuaca hujan / malam
          if (!picked) {
            const wList = WEATHER_FAMILY_BANTERS[store.timeOfDay];
            if (wList) {
              for (let i = 0; i < wList.length; i++) {
                const wid = `fw_weather_${store.timeOfDay}_${i}`;
                if (!heardBantersRef.current.has(wid)) {
                  picked = { id: wid, lines: wList[i] };
                  break;
                }
              }
            }
          }

          // 3. Cek obrolan lokasi kota saat ini
          if (!picked) {
            const locCandidate = LOCATION_FAMILY_BANTERS.find(
              (entry) => entry.location === store.currentLocation && !heardBantersRef.current.has(entry.id),
            );
            if (locCandidate) {
              picked = { id: locCandidate.id, lines: locCandidate.lines };
            }
          }

          if (picked) {
            heardBantersRef.current.add(picked.id);
            lastBanterTimeRef.current = now;
            store.playFamilyBanter(picked.lines, picked.id);
          }
        }
      }
    }

    if (
      store.screen !== 'playing' ||
      store.activeDialogue ||
      store.isMapJournalOpen ||
      store.isPauseOpen ||
      store.isQuickGraphicsOpen ||
      store.isPhotoMode ||
      store.isPhoneOpen ||
      store.isGuitarOpen ||
      store.isNadiaLetterOpen ||
      store.isBagOpen ||
      Boolean(store.activeCulinarySpot) ||
      store.isWardrobeOpen ||
      store.isLittleLibraryOpen ||
      store.isBookStallOpen ||
      store.isKitchenOpen ||
      store.isPhotoAlbumOpen ||
      store.isFridgeNotesOpen ||
      store.isNewsstandOpen ||
      store.isMailboxOpen ||
      store.isRtBoardOpen ||
      store.isTelescopeOpen ||
      store.isRidingScooter ||
      store.isRidingBicycle ||
      store.isSitting ||
      store.isFlyingKite ||
      store.isFishing
    ) {
      playerRuntime.nearestInteractable = null;
      store.setInteractPrompt(null);
      return;
    }

    const [px, py, pz] = playerRuntime.position;
    let best: InteractableTarget | null = null;
    const consider = (target: Omit<InteractableTarget, 'distance'>, maxDist: number) => {
      const dy = Math.abs(py - target.position[1]);
      if (dy > 4.0) return;
      const dist = Math.hypot(px - target.position[0], pz - target.position[2]);
      if (dist <= maxDist && (!best || dist < best.distance)) {
        best = { ...target, distance: dist };
      }
    };

    // === 1. NAIK MOTOR SKUTER DAMAR (di mana pun terparkir) ===
    consider(
      {
        id: 'ride_scooter',
        kind: 'portal',
        label: 'Naik Motor Skuter Damar',
        sublabel: 'WASD Kendarai · Spasi Klakson · E Parkir',
        position: playerRuntime.scooter.pos,
        onInteract: () => {
          if (store.isFamilyWalkActive) {
            sfxEngine.play('interact');
            store.showToast('Jalan kaki santai saja saat bersama Nadia & Kira (tekan [G] untuk antar pulang dulu).');
            return;
          }
          sfxEngine.play('switch');
          playerRuntime.scooter.isRiding = true;
          playerRuntime.scooter.speed = 0;
          store.setRidingScooter(true);
          store.showToast('Naik motor skuter! Gunakan WASD untuk melaju, Spasi klakson, E untuk parkir.');
        },
      },
      2.6,
    );

    // === 1B. NAIK SEPEDA KOTA KLASIK (di mana pun terparkir) ===
    consider(
      {
        id: 'ride_bicycle',
        kind: 'portal',
        label: 'Naik Sepeda Kota Klasik',
        sublabel: 'WASD Kayuh · Spasi Bel Kring-Kring · E Parkir',
        position: playerRuntime.bicycle.pos,
        onInteract: () => {
          if (store.isFamilyWalkActive) {
            sfxEngine.play('interact');
            store.showToast('Jalan kaki santai saja saat bersama Nadia & Kira (tekan [G] untuk antar pulang dulu).');
            return;
          }
          sfxEngine.playBicycleBell();
          playerRuntime.bicycle.isRiding = true;
          playerRuntime.bicycle.speed = 0;
          store.setRidingBicycle(true);
          store.showToast('Mengayuh sepeda kota! Gunakan WASD mengayuh, Spasi bel kring-kring, E untuk parkir.');
        },
      },
      2.5,
    );

    // === 2. MINI-AKTIVITAS 1: PETIK GITAR AKUSTIK DI KEDAI KOPI BIMA ===
    consider(
      {
        id: 'activity_guitar',
        kind: 'story_object',
        label: 'Petik Gitar Akustik ("Lagu Pulang")',
        sublabel: 'Mini-Aktivitas · Kedai Kopi Sudut',
        position: [-15.2, 0.08, 25.5],
        onInteract: () => {
          sfxEngine.playGuitarChord(0);
          store.setGuitarOpen(true);
        },
      },
      2.8,
    );

    // === 3. KULINER & NONGKRONG 1: KEDAI KOPI SUDUT BIMA ===
    consider(
      {
        id: 'activity_coffee',
        kind: 'story_object',
        label: 'Duduk & Pesan Kopi / Cokelat di Kedai Bima',
        sublabel: 'Kuliner & Nongkrong · Kedai Kopi Sudut',
        position: [-25.0, 0.08, 17.8],
        onInteract: () => {
          store.openCulinarySpot('cafe');
        },
      },
      2.5,
    );

    consider(
      {
        id: 'activity_pet_cafe_cat',
        kind: 'story_object',
        label: 'Elus Kucing "Moka" yang Tidur di Kursi Sudut',
        sublabel: 'Kedai Kopi Sudut Bima · Kucing Rumahan Jinak',
        position: [-14.95, 0.08, 17.6],
        onInteract: () => {
          sfxEngine.play('cat');
          playerRuntime.cafeCatHeartTimer = 4.6;
          if (!store.flags.includes('petted_cafe_cat_moka')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              setFlags: ['petted_cafe_cat_moka'],
              journalEntry: {
                id: 'je_cafe_cat_moka',
                title: 'Kucing "Moka" di Kursi Sudut Kedai Bima',
                body: 'Di kursi kayu sudut Kedai Kopi Sudut, kucing calico bernama Moka selalu tidur pulas melingkar. Begitu dielus pelan, dengkuran halusnya berpadu hangat dengan aroma kopi gula aren Bima.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_cafe_cat, 'fw_cafe_cat');
          }
          store.showToast('Moka mendengkur pelan penuh nyaman sambil tetap bergelung hangat di bantal kursi Bima.');
        },
      },
      2.2,
    );

    consider(
      {
        id: 'activity_read_cafe_chalkboard',
        kind: 'story_object',
        label: 'Baca Papan Menu Kapur & Pesan di Kedai Bima',
        sublabel: 'Dekat Bar Kasir · Racikan Manual & Roti Kayu Manis',
        position: [-16.45, 0.08, 20.55],
        onInteract: () => {
          store.openCulinarySpot('cafe');
        },
      },
      1.95,
    );

    consider(
      {
        id: 'activity_bakso_cart',
        kind: 'story_object',
        label: 'Pesan Bakso Malang & Mie Ayam Hangat Mas Agung',
        sublabel: 'Gerobak Bakso Keliling · Tepi Jl. Melati',
        position: [-25.6, 0, 48.8],
        onInteract: () => {
          sfxEngine.playBaksoClink(0.95);
          store.openCulinarySpot('bakso');
        },
      },
      3.1,
    );

    consider(
      {
        id: 'activity_sate_cart',
        kind: 'story_object',
        label: 'Pesan Sate Ayam Madura & Lontong Hangat Cak Mat',
        sublabel: 'Sudut Jl. Cempaka · Bara Arang & Bumbu Kacang',
        position: [12.1, 0, 29.8],
        onInteract: () => {
          sfxEngine.playCharcoalSizzle();
          store.openCulinarySpot('sate');
        },
      },
      3.1,
    );

    consider(
      {
        id: 'activity_dawet_cart',
        kind: 'story_object',
        label: 'Pesan Es Cendol Dawet Ayu Pak Darmo',
        sublabel: 'Plaza Menara Nusantara · Cendol Pandan & Gula Aren',
        position: [42.2, 0, -12.3],
        onInteract: () => {
          store.openCulinarySpot('dawet');
        },
      },
      3.0,
    );

    consider(
      {
        id: 'inspect_kota_senja_monument',
        kind: 'story_object',
        label: 'Baca Plakat Tugu Taman Bundar "Kota Senja"',
        sublabel: 'Persimpangan Utama Jl. Kenangan · Landmark Kota',
        position: [13.6, 0, -12.35],
        onInteract: () => {
          sfxEngine.play('chime');
          if (!store.flags.includes('read_kota_senja_monument')) {
            store.applyEffect({
              kejujuranDiri: 1,
              setFlags: ['read_kota_senja_monument'],
              journalEntry: {
                id: 'je_kota_senja_monument',
                title: 'Tugu Penanda di Jantung Kota Senja',
                body: 'Di taman bundar persimpangan Jl. Kenangan berdiri plakat bertuliskan "Kota Senja — Ruang Teduh untuk Melangkah Pulang". Di antara gedung tinggi dan gang perumahan, kota ini selalu memberi ruang bagi siapa pun yang ingin kembali menemukan dirinya.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_kota_senja_monument, 'fw_monument');
          }
          store.showToast('"KOTA SENJA — Ruang Teduh untuk Melangkah Pulang." Bunga-bunga taman bundar bergoyang pelan tertiup angin.');
        },
      },
      2.5,
    );

    consider(
      {
        id: 'activity_corner_warung',
        kind: 'story_object',
        label: 'Mampir Sapa Warung Sudut Bu Rina',
        sublabel: 'Tepi Utara Jl. Melati · Sembako, Kopi & Gorengan Sore',
        position: [18.8, 0, 42.2],
        onInteract: () => {
          sfxEngine.play('interact');
          if (!store.flags.includes('visited_warung_bu_rina')) {
            store.applyEffect({
              kejujuranDiri: 1,
              setFlags: ['visited_warung_bu_rina'],
              journalEntry: {
                id: 'je_warung_bu_rina',
                title: 'Lampu Hangat Warung Sudut Bu Rina',
                body: 'Setiap senja tiba, papan neon dan lampu teras Warung Bu Rina menyala hangat di sudut gang Perumahan Melati—seperti mercusuar kecil ramah yang menandakan rumah sudah tinggal beberapa langkah lagi.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_corner_warung, 'fw_corner_warung');
          }
          const lines = [
            'Bu Rina menyapa ramah: "Sore Mas Damar! Baru pulang? Gorengan tahu isi sama kopi renceng masih hangat lho!"',
            'Bu Rina tersenyum: "Tadi Mbak Nadia lewat belanja bumbu sop, titip salam buat Mas Damar katanya jangan lupa makan malam!"',
            'Bu Rina: "Kalau mendadak hujan deras, berteduh dulu di teras warung nggak apa-apa ya, Mas!"',
          ];
          store.showToast(lines[Math.floor(Date.now() / 1000) % lines.length]);
        },
      },
      2.65,
    );

    consider(
      {
        id: 'activity_melati_badminton',
        kind: 'story_object',
        label: 'Pukul & Rally Kok Bulu Tangkis di Lapangan Gang Melati',
        sublabel: 'Lapangan Bulu Tangkis RT · Perumahan Melati',
        position: [36.0, 0, 49.8],
        onInteract: () => {
          playerRuntime.badmintonRallyTimer = 7.4;
          sfxEngine.playBadmintonHit(1.0);
          if (!store.flags.includes('played_melati_badminton')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              kejujuranDiri: 1,
              setFlags: ['played_melati_badminton'],
              journalEntry: {
                id: 'je_melati_badminton',
                title: 'Tepokan Kok di Lapangan Bulu Tangkis Gang Melati',
                body: 'Bunyi "plok!" kok yang melambung melewati net di lapangan cat putih Gang Melati langsung membawa rasa ringan yang lama hilang. Keringat tipis sore ini terasa jauh lebih jujur daripada penat di ruang rapat.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_badminton, 'fw_badminton');
          }
          store.showToast('Plok! Kok bulu tangkis melambung seru melintasi net di Lapangan Gang Melati!');
        },
      },
      3.5,
    );

    consider(
      {
        id: 'activity_strike_kentongan',
        kind: 'story_object',
        label: 'Pukul Kentongan Bambu Pos Kamling ("Tok-Tok-Tok!")',
        sublabel: 'Pos Ronda RT 04 · Perumahan Melati',
        position: [25.75, 0, 55.05],
        onInteract: () => {
          playerRuntime.kentonganSwingTimer = 2.4;
          sfxEngine.playKentongan();
          if (!store.flags.includes('struck_melati_kentongan')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              kejujuranDiri: 1,
              setFlags: ['struck_melati_kentongan'],
              journalEntry: {
                id: 'je_melati_kentongan',
                title: 'Dentang Kentongan Bambu di Pos Kamling Melati',
                body: 'Suara "tok-tok-tok" kentongan bambu di Pos Ronda RT 04 menggema hangat di antara rumah-rumah Jl. Melati. Sebuah tanda sederhana bahwa lingkungan ini saling menjaga satu sama lain.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_kentongan, 'fw_kentongan');
          }
          store.showToast('Tok-tok... tok-tok-tok! Bunyi kentongan bambu Pos Kamling RT 04 menggema hangat di gang!');
        },
      },
      2.15,
    );

    consider(
      {
        id: 'sit_pos_kamling',
        kind: 'story_object',
        label: 'Duduk Ronda Santai & Lihat Papan Catur Pos Kamling',
        sublabel: 'Pos Kamling RT 04 · Kopi Termos & Papan Catur',
        position: [27.45, 0, 55.0],
        onInteract: () => {
          sfxEngine.play('coffee');
          playerRuntime.sitState = {
            active: true,
            label: 'Pos Kamling RT 04 Perumahan Melati',
            seatPos: [27.3, 0.48, 56.25],
            lookAt: [26.0, 1.4, 48.0],
            standPos: [27.45, 0, 54.85],
            seatYaw: Math.PI,
            holdingCoffee: true,
            drinkVisual: 'coffee',
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pos_kamling, 'fw_pos_kamling');
          }
          store.showToast('Duduk santai di bale-bale Pos Kamling sambil menikmati kopi hangat & papan catur... (WASD/E berdiri)');
        },
      },
      2.15,
    );

    if (store.timeOfDay !== 'rain_dusk') {
      consider(
        {
          id: 'activity_park_stretch',
          kind: 'story_object',
          label: 'Ikut Tarik Napas & Peregangan Bersama Warga Taman',
          sublabel: 'Kelompok Senam Santai · Rumput Taman Kota',
          position: [-83.5, 0, 36.1],
          onInteract: () => {
            sfxEngine.play('chime');
            if (!store.flags.includes('joined_park_stretch')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['joined_park_stretch'],
                journalEntry: {
                  id: 'je_park_stretch',
                  title: 'Peregangan Santai di Rumput Taman Kota',
                  body: 'Mengikuti gerakan perlahan warga di rumput Taman Kota—menarik napas dalam dan merentangkan bahu di udara terbuka—membuat pundak yang kaku seharian di depan laptop terasa kembali lentur.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_park_stretch, 'fw_park_stretch');
            }
            store.showToast('Tarik napas dalam, rentangkan bahu, lalu embuskan pelan—badan terasa jauh lebih segar!');
          },
        },
        3.0,
      );
    }

    consider(
      {
        id: 'inspect_signpost_park',
        kind: 'story_object',
        label: 'Baca Tiang Penunjuk Arah Taman & Danau Senja',
        sublabel: 'Gerbang Taman Kota · Buka Peta [M]',
        position: [-62.2, 0, -6.2],
        onInteract: () => {
          sfxEngine.play('page');
          store.toggleMapJournal('map');
          store.showToast('Membuka peta kota dari Tiang Penunjuk Arah Taman & Danau Senja.');
        },
      },
      2.6,
    );

    consider(
      {
        id: 'inspect_signpost_junction',
        kind: 'story_object',
        label: 'Baca Tiang Penunjuk Arah Jl. Kenangan & Jl. Melati',
        sublabel: 'Persimpangan Kedai Bima · Buka Peta [M]',
        position: [-10.4, 0, 10.8],
        onInteract: () => {
          sfxEngine.play('page');
          store.toggleMapJournal('map');
          store.showToast('Membuka peta kota dari Tiang Penunjuk Arah Persimpangan Jl. Kenangan.');
        },
      },
      2.6,
    );

    // === 3B. KULINER & NONGKRONG 2: BANGKU ANGKRINGAN PAK SLAMET ===
    consider(
      {
        id: 'activity_angkringan',
        kind: 'story_object',
        label: 'Duduk & Jajan di Angkringan Pak Slamet',
        sublabel: 'Kuliner & Nongkrong · Wedang Jahe & Sego Kucing',
        position: [-15.2, 0, 38.0],
        onInteract: () => {
          store.openCulinarySpot('angkringan');
        },
      },
      2.8,
    );

    // === 3C. KULINER & NONGKRONG 3: MEJA TERAS KIOS 24 JAM HARMONI ===
    consider(
      {
        id: 'activity_kios_terrace',
        kind: 'story_object',
        label: 'Duduk & Jajan di Teras Kios Harmoni',
        sublabel: 'Kuliner & Nongkrong · Teh Hangat & Es Krim',
        position: [20.5, 0, 15.1],
        onInteract: () => {
          store.openCulinarySpot('kios');
        },
      },
      2.3,
    );

    // === 3D. KULINER & NONGKRONG 4: GEROBAK MARTABAK MANIS & KACANG REBUS TEPI SUNGAI ===
    consider(
      {
        id: 'activity_martabak_stall',
        kind: 'story_object',
        label: 'Jajan Martabak Manis & Kacang Rebus Bang Udin',
        sublabel: 'Kuliner Tepi Sungai Lampion · Hangat Sore–Malam',
        position: [-35.6, 0, 23.4],
        onInteract: () => {
          store.openCulinarySpot('martabak');
        },
      },
      3.1,
    );

    consider(
      {
        id: 'activity_coconut_stall',
        kind: 'story_object',
        label: 'Pesan Es Kelapa Muda & Pisang Goreng Pak Hasan',
        sublabel: 'Tepi Taman Danau Senja · Segar di Bawah Payung',
        position: [-83.4, 0, -8.5],
        onInteract: () => {
          store.openCulinarySpot('coconut');
        },
      },
      3.0,
    );

    consider(
      {
        id: 'activity_bridge_locks_view',
        kind: 'story_object',
        label: 'Pandangi Barisan Gembok Kenangan & Lampu Jembatan',
        sublabel: 'Jembatan Tepi Sungai · Jl. Kenangan',
        position: [-48.0, 0.24, 5.5],
        onInteract: () => {
          sfxEngine.play('chime');
          if (!store.flags.includes('admired_bridge_locks')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              setFlags: ['admired_bridge_locks'],
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bridge_locks, 'fw_bridge_locks');
          }
          store.showToast(
            store.timeOfDay === 'morning'
              ? 'Deretan gembok kenangan warga berkilau tertimpa sinar pagi di sepanjang pagar jembatan.'
              : 'Lampu senar hangat di pagar jembatan memantul tenang di permukaan Sungai Kota bersama barisan gembok kenangan.',
          );
        },
      },
      2.2,
    );

    consider(
      {
        id: 'activity_river_angler_karno',
        kind: 'story_object',
        label: 'Sapa Pak Karno yang Memancing di Bantaran Sungai',
        sublabel: 'Tanggul Timur Utara Jembatan · Warga Santai',
        position: [-37.5, 0, -14.8],
        onInteract: () => {
          sfxEngine.play('interact');
          if (!store.flags.includes('greeted_river_angler')) {
            store.applyEffect({
              kejujuranDiri: 1,
              setFlags: ['greeted_river_angler'],
              journalEntry: {
                id: 'je_river_angler',
                title: 'Pemancing Sabar di Bantaran Sungai',
                body: 'Pak Karno duduk tenang di kursi lipatnya di pinggir Sungai Kota sambil menatap pelampung merah-putih. Katanya, memancing itu bukan soal cepat dapat ikan, melainkan melatih hati agar sanggup menunggu tanpa gelisah.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_river_angler, 'fw_river_angler');
          }
          const lines = [
            'Pak Karno tersenyum: "Wah, sore Mas Damar! Air sungainya lagi tenang, cocok buat menenangkan pikiran."',
            'Pak Karno: "Tadi sempat dapat ikan nila kecil, Mas—tapi kulepas lagi biar besar dulu. Yang penting duduk santainya!"',
            'Pak Karno: "Kalau kepala lagi penuh urusan kantor, duduk lima menit lihat pelampung naik-turun begini manjur lho, Mas."',
          ];
          store.showToast(lines[Math.floor(Date.now() / 1000) % lines.length]);
        },
      },
      2.6,
    );

    consider(
      {
        id: 'sit_riverside_lantern_bench',
        kind: 'story_object',
        label: 'Duduk Menatap Untaian Lampion Tepi Sungai',
        sublabel: 'Promenade Sungai Kota · Momen Tenang',
        position: [-37.3, 0, 20.5],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Promenade Lampion Tepi Sungai',
            seatPos: [-38.2, 0.14, 20.5],
            lookAt: [-48.0, 2.0, 20.5],
            standPos: [-36.6, 0, 20.5],
            seatYaw: -Math.PI / 2,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bench, 'fw_river_bench');
          }
          store.showToast('Duduk santai memandangi pantulan lampion di permukaan Sungai Kota... (WASD/E berdiri)');
        },
      },
      2.1,
    );

    // === 4. MINI-AKTIVITAS 3: BERI MAKAN KUCING ORANYE "SORE" ===
    consider(
      {
        id: 'activity_feed_cat',
        kind: 'story_object',
        label: store.catFed ? 'Elus & Beri Camilan Lagi untuk "Sore"' : 'Beri Makan Kucing Oranye "Sore"',
        sublabel: 'Mini-Aktivitas · Perumahan Melati',
        position: [10.3, 0, 56.9],
        onInteract: () => {
          sfxEngine.play('cat');
          playerRuntime.catHeartTimer = 4.2;
          store.markCatFed();
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_cat, 'fw_cat');
          }
          store.showToast('Sore makan lahap sambil mendengkur hangat di dekat kakimu!');
        },
      },
      2.3,
    );

    // === 5. MINI-AKTIVITAS 4: LIPAT & HANYUTKAN PERAHU KERTAS DI DANAU SENJA ===
    consider(
      {
        id: 'activity_paper_boat',
        kind: 'story_object',
        label: 'Lipat & Hanyutkan Perahu Kertas di Danau',
        sublabel: 'Mini-Aktivitas · Dermaga Danau Senja',
        position: [-76.8, 0.12, -28.0],
        onInteract: () => {
          sfxEngine.play('page');
          if (playerRuntime.paperBoats.length < 6) {
            playerRuntime.paperBoats.push({
              id: Date.now(),
              x: -77.6,
              z: -28.0 + (Math.random() - 0.5) * 1.4,
              vx: -0.95 - Math.random() * 0.55,
              vz: (Math.random() - 0.5) * 0.45,
              rotY: Math.random() * Math.PI * 2,
              bornAt: Date.now(),
            });
            store.incrementPaperBoats();
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_boat, 'fw_boat');
            }
            store.showToast('"Ini buat kamu, Kira... semoga doa kecil kita tidak pernah tenggelam."');
          } else {
            store.showToast('Enam perahu kertas sudah mengapung damai di permukaan Danau Senja.');
          }
        },
      },
      2.5,
    );

    // === 5B. TAMAN BERMAIN & AKTIVITAS KELUARGA BARU (AYUNAN, IKAN KOI & LAYANG-LAYANG) ===
    consider(
      {
        id: 'activity_playground_swing',
        kind: 'story_object',
        label: 'Ayunkan Ayunan Taman Bermain',
        sublabel: 'Taman Bermain · Selatan Taman Kota',
        position: [-81.8, 0, 21.8],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.swingBoostTimer = 7.5;
          if (!store.flags.includes('played_park_swing')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              setFlags: ['played_park_swing'],
              journalEntry: {
                id: 'je_park_swing',
                title: 'Tawa di Ayunan Taman Kota',
                body: 'Suara rantai ayunan yang berayun pelan di sore hari selalu membawa pulang perasaan masa kecil yang ringan—terlebih saat membayangkan Kira tertawa di atasnya.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_swing, 'fw_swing');
          }
          store.showToast('Ayunan taman berayun ceria mengikuti hembusan angin sore!');
        },
      },
      2.8,
    );

    consider(
      {
        id: 'sit_playground_bench',
        kind: 'story_object',
        label: 'Duduk Mengawasi Taman Bermain',
        sublabel: 'Taman Bermain Anak',
        position: [-83.7, 0, 24.3],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Taman Bermain Anak',
            seatPos: [-83.7, 0.14, 24.9],
            lookAt: [-80.2, 1.4, 21.2],
            standPos: [-83.7, 0, 23.8],
            seatYaw: Math.PI,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bench, 'fw_bench_play');
          }
          store.showToast('Duduk santai memandangi sudut taman bermain... (WASD/E berdiri)');
        },
      },
      2.5,
    );

    consider(
      {
        id: 'activity_feed_koi',
        kind: 'story_object',
        label: 'Tebar Pelet untuk Kawanan Ikan Koi',
        sublabel: 'Danau Senja · Dermaga Kayu',
        position: [-73.2, 0.12, -26.4],
        onInteract: () => {
          sfxEngine.play('chime');
          playerRuntime.koiFeedTimer = 9.5;
          playerRuntime.koiFeedPoint = [-73.2, -24.6];
          if (!store.flags.includes('fed_koi_lake')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              setFlags: ['fed_koi_lake'],
              journalEntry: {
                id: 'je_koi_lake',
                title: 'Kawanan Ikan Koi di Bawah Dermaga',
                body: 'Begitu pelet jatuh ke permukaan Danau Senja, sembilan ikan koi warna-warni langsung berenang berkerumun menimbulkan riak air yang menenangkan.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_koi, 'fw_koi');
          }
          store.showToast('Kawanan ikan koi oranye & emas langsung berenang menghampiri pelet!');
        },
      },
      2.5,
    );

    consider(
      {
        id: 'activity_lake_fishing',
        kind: 'story_object',
        label: 'Memancing Santai di Ujung Dermaga Danau',
        sublabel: 'Danau Senja · Catch & Release',
        position: [-76.0, 0.12, -29.3],
        onInteract: () => {
          store.setFishing(true);
          store.showToast('Melempar pelampung ke Danau Senja... tunggu pelampung mencelup lalu tekan [Spasi]!');
        },
      },
      2.4,
    );

    consider(
      {
        id: 'activity_gazebo_guitar',
        kind: 'story_object',
        label: 'Mainkan Gitar Akustik di Gazebo Panggung Taman',
        sublabel: 'Gazebo Taman Kota · Panggung Terbuka',
        position: [-67.5, 0.22, 20.4],
        onInteract: () => {
          sfxEngine.playGuitarChord(0);
          store.setGuitarOpen(true);
        },
      },
      2.6,
    );

    consider(
      {
        id: 'sit_gazebo_stage',
        kind: 'story_object',
        label: 'Duduk Santai Berteduh di Gazebo Taman',
        sublabel: 'Gazebo Panggung Akustik',
        position: [-69.1, 0.22, 18.6],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Gazebo Taman Kota',
            seatPos: [-69.0, 0.36, 19.6],
            lookAt: [-78.0, 1.4, 21.5],
            standPos: [-68.8, 0.22, 18.4],
            seatYaw: -Math.PI / 2,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bench, 'fw_gazebo');
          }
          store.showToast('Menikmati angin sore di bawah lampu Gazebo Panggung Taman... (WASD/E berdiri)');
        },
      },
      2.4,
    );

    consider(
      {
        id: 'activity_park_picnic',
        kind: 'story_object',
        label: store.isFamilyWalkActive
          ? 'Duduk Piknik Bertiga di Tikar Taman'
          : 'Duduk Santai di Tikar Piknik Taman',
        sublabel: 'Taman Kota · Teh Hangat, Semangka & Angin Sore',
        position: [-72.0, 0, 29.8],
        onInteract: () => {
          sfxEngine.play('coffee');
          playerRuntime.sitState = {
            active: true,
            label: 'Tikar Piknik Taman Kota',
            seatPos: [-72.2, 0.04, 30.05],
            lookAt: [-70.5, 1.4, 21.5],
            standPos: [-72.2, 0, 31.35],
            seatYaw: Math.PI,
            holdingCoffee: true,
            drinkVisual: 'tea',
          };
          store.setSitting(true);
          if (!store.flags.includes('sat_park_picnic')) {
            store.applyEffect({
              kehadiranKeluarga: 2,
              kejujuranDiri: 1,
              setFlags: ['sat_park_picnic'],
              journalEntry: {
                id: 'je_park_picnic',
                title: 'Piknik Sederhana di Rumput Taman Kota',
                body: 'Di atas tikar kotak-kotak merah di rumput Taman Kota, dengan termos teh hangat dan potongan semangka, rasanya seluruh kecemasan hari ini berhenti sejenak. Ternyata berlibur tidak selalu harus pergi jauh.',
                chapter: store.chapter,
              },
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_picnic, 'fw_picnic');
            store.showToast('Duduk piknik hangat bertiga bersama Nadia & Kira di rumput taman... (WASD/E berdiri)');
          } else {
            store.showToast('Duduk santai di tikar piknik Taman Kota... (Tekan [G] ajak Nadia & Kira ikut, atau WASD/E berdiri)');
          }
        },
      },
      2.8,
    );

    consider(
      {
        id: 'activity_park_fountain',
        kind: 'story_object',
        label: 'Lempar Koin Harapan di Air Mancur Taman',
        sublabel: 'Air Mancur Batu Mini · Pintu Masuk Taman Kota',
        position: [-65.5, 0, 10.5],
        onInteract: () => {
          sfxEngine.play('chime');
          if (!store.flags.includes('wished_park_fountain')) {
            store.applyEffect({
              kejujuranDiri: 1,
              setFlags: ['wished_park_fountain'],
            });
          }
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_fountain, 'fw_fountain');
          }
          const wishes = [
            'Koin jatuh berkilau ke air jernih—semoga langkah pulang hari ini selalu diberi ketenangan.',
            'Percikan air mancur terasa sejuk di wajah—satu harapan sederhana untuk kesehatan Nadia & Kira.',
            'Riak kecil meluas di permukaan kolam—mengingatkan bahwa perubahan besar selalu mulai dari langkah kecil.',
          ];
          store.showToast(wishes[Math.floor(Date.now() / 1000) % wishes.length]);
        },
      },
      3.3,
    );

    consider(
      {
        id: 'activity_darman_books',
        kind: 'story_object',
        label: 'Jelajahi Rak Buku Bekas Pak Darman',
        sublabel: 'Stasiun Senja · 4 Buku Pilihan',
        position: [75.8, 0.1, -1.2],
        onInteract: () => {
          store.setBookStallOpen(true);
        },
      },
      2.5,
    );

    consider(
      {
        id: 'activity_station_newsstand',
        kind: 'story_object',
        label: 'Baca Koran & Majalah di Kios Warta Senja',
        sublabel: 'Stasiun Senja · 4 Berita & Rubrik Kota Hari Ini',
        position: [77.05, 0.1, 8.8],
        onInteract: () => {
          store.setNewsstandOpen(true);
        },
      },
      2.6,
    );

    if (store.timeOfDay !== 'rain_dusk') {
      consider(
        {
          id: 'activity_riverside_busker',
          kind: 'story_object',
          label: 'Dengarkan & Beri Apresiasi untuk Mas Seno',
          sublabel: 'Pemusik Akustik Tepi Sungai · Petikan Gitar Sore',
          position: [-58.6, 0, 14.5],
          onInteract: () => {
            sfxEngine.playBuskerStrum(1, true);
            if (!store.flags.includes('appreciated_riverside_busker')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['appreciated_riverside_busker'],
                journalEntry: {
                  id: 'je_riverside_busker',
                  title: 'Petikan Gitar di Tepi Sungai Lampion',
                  body: 'Di sisi barat sungai, seorang pemusik jalanan bernama Mas Seno memetik gitar akustik di bawah untaian lampion. Melihatnya bermain dengan hati tenang mengingatkanku bahwa musik tidak pernah menuntut apa pun selain kejujuran.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_busker, 'fw_busker');
            }
            store.showToast('Mas Seno tersenyum hangat: "Terima kasih banyak, Mas! Semoga lagunya menemani langkah pulang."');
          },
        },
        3.0,
      );
    }

    consider(
      {
        id: 'activity_little_library',
        kind: 'story_object',
        label: 'Buka Kotak Buku Jalanan ("Taman Baca Mini")',
        sublabel: 'Taman Bunga · 5 Kisah Pendek Warga',
        position: [-72.5, 0, -7.2],
        onInteract: () => {
          store.setLittleLibraryOpen(true);
        },
      },
      2.5,
    );

    consider(
      {
        id: 'activity_fly_kite',
        kind: 'story_object',
        label: 'Terbangkan Layang-Layang di Langit Taman',
        sublabel: 'Aktivitas Sore · Lapangan Taman Kota',
        position: [-87.5, 0, 22.5],
        onInteract: () => {
          if (store.timeOfDay === 'rain_dusk') {
            sfxEngine.play('interact');
            store.showToast('Sedang hujan—kertas layangannya nanti basah! Ganti cuaca ke Pagi atau Senja di HP [H] dulu yuk.');
            return;
          }
          if (!store.flags.includes('flew_park_kite')) {
            store.applyEffect({
              kehadiranKeluarga: 1,
              kejujuranDiri: 1,
              setFlags: ['flew_park_kite'],
              journalEntry: {
                id: 'je_park_kite',
                title: 'Layang-Layang di Langit Sore',
                body: 'Sudah bertahun-tahun sejak terakhir kali aku mendongak ke langit bukan untuk mengecek cuaca lembur, melainkan untuk menarik benang layang-layang yang menari bebas tertiup angin.',
                chapter: store.chapter,
              },
            });
          }
          store.setFlyingKite(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_kite, 'fw_kite');
          }
          store.showToast('Layang-layang mengudara! Tekan [Spasi] tarik benang lebih tinggi, [P] foto, atau [WASD/E] selesai.');
        },
      },
      2.8,
    );

    // === INTERAKSI INTERIOR BARU: SUDUT KIRA, LEMARI, TV RUANG TAMU, HALTE BUS, NADA LAMA & KIOS HARMONI ===
    consider(
      {
        id: 'interior_damar_wardrobe',
        kind: 'story_object',
        label: 'Buka Lemari & Ganti Pakaian Damar',
        sublabel: 'Rumah Jl. Melati No. 14 · 4 Gaya Pakaian',
        position: [-25.4, 0.08, 69.25],
        onInteract: () => {
          store.setWardrobeOpen(true);
        },
      },
      2.4,
    );

    consider(
      {
        id: 'interior_living_tv',
        kind: 'story_object',
        label:
          store.livingRoomTvChannel === 0
            ? 'Nyalakan TV Ruang Tamu'
            : `Ganti Saluran / Matikan TV (Saluran ${store.livingRoomTvChannel})`,
        sublabel: 'Ruang Tamu · Rumah Jl. Melati No. 14',
        position: [-14.5, 0.08, 68.9],
        onInteract: () => {
          store.cycleLivingRoomTv();
        },
      },
      2.5,
    );

    consider(
      {
        id: 'sit_bus_stop',
        kind: 'story_object',
        label:
          store.timeOfDay === 'rain_dusk'
            ? 'Duduk Berteduh dari Hujan di Halte Bus'
            : 'Duduk Santai di Bangku Halte Jl. Kenangan',
        sublabel: 'Halte Bus Kota Modern',
        position: [21.1, 0, 10.3],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Halte Bus Jl. Kenangan',
            seatPos: [21.15, 0.14, 11.15],
            lookAt: [21.5, 1.3, 0],
            standPos: [21.15, 0, 10.0],
            seatYaw: Math.PI,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bus_stop, 'fw_bus_stop');
          }
          store.showToast(
            store.timeOfDay === 'rain_dusk'
              ? 'Berteduh adem di bawah atap Halte Jl. Kenangan sambil melihat hujan...'
              : 'Duduk santai di Halte Bus Jl. Kenangan melihat lalu lintas kota... (WASD/E berdiri)',
          );
        },
      },
      2.4,
    );

    consider(
      {
        id: 'bus_stop_route_board',
        kind: 'story_object',
        label: 'Baca Papan Peta Rute & Info Kota',
        sublabel: 'Halte Bus Jl. Kenangan · Buka Peta [M]',
        position: [23.6, 0, 10.6],
        onInteract: () => {
          sfxEngine.play('page');
          store.toggleMapJournal('map');
          store.showToast('Membuka peta rute & penunjuk kota dari Papan Halte Jl. Kenangan.');
        },
      },
      2.3,
    );

    consider(
      {
        id: 'interior_kira_desk',
        kind: 'story_object',
        label: 'Periksa Meja Gambar & Mainan Kira',
        sublabel: 'Sudut Kira · Rumah Jl. Melati No. 14',
        position: [-19.8, 0.08, 71.5],
        onInteract: () => {
          playerRuntime.activeSpeakerPos = [-19.8, 0.6, 72.4];
          store.startDialogue('interior_kira_drawing_table');
        },
      },
      2.1,
    );

    consider(
      {
        id: 'interior_kira_toy_train',
        kind: 'story_object',
        label: store.kiraToyTrainOn
          ? 'Hentikan Kereta Mainan Kayu Kira'
          : 'Nyalakan Kereta Mainan Kayu Kira ("Tut-Tut!")',
        sublabel: 'Karpet Sudut Kira · Rumah Jl. Melati No. 14',
        position: [-19.9, 0.08, 69.55],
        onInteract: () => {
          store.toggleKiraToyTrain();
        },
      },
      1.85,
    );

    consider(
      {
        id: 'interior_desk_laptop',
        kind: 'story_object',
        label: store.workLaptopClosed
          ? 'Buka Kembali Laptop & Lampu Meja Kerja'
          : 'Tutup Laptop Kantor & Matikan Lampu Kerja',
        sublabel: 'Meja Kerja Damar · Lepas Urusan Kantor Saat Pulang',
        position: [-23.85, 0.08, 71.15],
        onInteract: () => {
          store.toggleWorkLaptop();
        },
      },
      1.85,
    );

    consider(
      {
        id: 'interior_home_kitchen',
        kind: 'story_object',
        label: 'Masak & Seduh Hangat di Dapur Rumah',
        sublabel: 'Dapur Jl. Melati No. 14 · Teh Melati, Sup Ayam & Nasi Goreng',
        position: [-16.55, 0.08, 71.95],
        onInteract: () => {
          store.setKitchenOpen(true);
        },
      },
      1.95,
    );

    consider(
      {
        id: 'interior_kitchen_radio',
        kind: 'story_object',
        label:
          !store.radioPaused && store.radioStation !== 'auto'
            ? 'Ganti Saluran / Matikan Radio Kayu Dapur'
            : 'Nyalakan Radio Kayu Dapur',
        sublabel: 'Radio Retro · Musik Langsung di Rumah',
        position: [-18.08, 0.08, 71.95],
        onInteract: () => {
          store.cycleKitchenRadio();
        },
      },
      1.45,
    );

    consider(
      {
        id: 'interior_home_guitar',
        kind: 'story_object',
        label: 'Petik Gitar Akustik Bersama Nadia & Kira',
        sublabel: 'Ruang Tamu · Rumah Jl. Melati No. 14',
        position: [-23.45, 0.08, 63.25],
        onInteract: () => {
          sfxEngine.playGuitarChord(0);
          store.setGuitarOpen(true);
        },
      },
      2.2,
    );

    consider(
      {
        id: 'interior_photo_album',
        kind: 'story_object',
        label: 'Buka Buku Album Foto Keluarga',
        sublabel: 'Meja Ruang Tamu · Kenangan & Jepretan Mode Foto [P]',
        position: [-21.45, 0.08, 65.6],
        onInteract: () => {
          store.setPhotoAlbumOpen(true);
        },
      },
      2.1,
    );

    consider(
      {
        id: 'memory_flashback_melati_2019',
        kind: 'story_object',
        label: store.flags.includes('flashback_melati_2019_done')
          ? 'Putar Ulang Kilas Balik: Malam Pertama Pindahan (2019)'
          : 'Kenang Malam Pertama Pindahan Rumah (Kilas Balik 2019)',
        sublabel: 'Lantai Ruang Tamu · 12 November 2019',
        position: [-22.2, 0.08, 66.8],
        onInteract: () => {
          sfxEngine.play('chime');
          store.startDialogue('flashback_malam_pertama_melati');
        },
      },
      2.0,
    );

    consider(
      {
        id: 'interior_fridge_notes',
        kind: 'story_object',
        label: 'Buka Papan Catatan Magnet Kulkas',
        sublabel: 'Pintu Kulkas · Tulis & Baca Pesan Nadia & Kira',
        position: [-13.95, 0.08, 71.25],
        onInteract: () => {
          store.setFridgeNotesOpen(true);
        },
      },
      1.75,
    );

    consider(
      {
        id: 'activity_water_nadia_garden',
        kind: 'story_object',
        label: store.gardenWatered
          ? 'Siram Lagi Pot Tanaman Bunga Nadia'
          : 'Siram Pot Tanaman Bunga Nadia',
        sublabel: 'Halaman Rumah Jl. Melati No. 14 · Melati, Mawar & Matahari Mini',
        position: [-24.8, 0, 59.35],
        onInteract: () => {
          store.waterHomeGarden();
        },
      },
      2.45,
    );

    consider(
      {
        id: 'activity_home_mailbox',
        kind: 'story_object',
        label:
          store.readMailIds.length < 4
            ? 'Buka Kotak Surat Pagar (Ada Surat Baru)'
            : 'Periksa Kotak Surat Pagar Rumah',
        sublabel: 'Jl. Melati No. 14 · Kartu Pos Bandung, Bima, Pak RT & Bu Wati',
        position: [-16.9, 0, 53.0],
        onInteract: () => {
          store.setMailboxOpen(true);
        },
      },
      2.65,
    );

    consider(
      {
        id: 'activity_bread_vendor',
        kind: 'story_object',
        label: 'Beli Roti Hangat dari Gerobak Pak Joko',
        sublabel: 'Perumahan Melati · Roti Cokelat, Keju & Srikaya',
        position: [2.45, 0, 52.15],
        onInteract: () => {
          sfxEngine.playBreadVendorBell(0.95);
          store.openCulinarySpot('roti');
        },
      },
      2.9,
    );

    if (store.timeOfDay !== 'rain_dusk') {
      consider(
        {
          id: 'activity_feed_pigeons',
          kind: 'story_object',
          label: 'Tebar Remah Roti untuk Merpati Taman',
          sublabel: 'Kawanan Merpati Jinak · Taman Kota',
          position: [-81.5, 0, 12.2],
          onInteract: () => {
            sfxEngine.play('chime');
            playerRuntime.pigeonFeedTimer = 10.0;
            playerRuntime.pigeonFeedPoint = [-81.5, 12.2];
            if (!store.flags.includes('fed_park_pigeons')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                setFlags: ['fed_park_pigeons'],
                journalEntry: {
                  id: 'je_park_pigeons',
                  title: 'Kawanan Merpati di Rumput Taman',
                  body: 'Tujuh burung merpati jinak berkumpul mematuk remah roti di lapangan Taman Kota. Mereka melompat santai tanpa takut, seolah tahu sore ini bukan milik orang yang sedang terburu-buru.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pigeons, 'fw_pigeons');
            }
            store.showToast('Kawanan burung merpati taman berjalan ceria menghampiri remah roti!');
          },
        },
        3.2,
      );
    }

    consider(
      {
        id: 'interior_music_cassette',
        kind: 'story_object',
        label: 'Putar Kaset Lawas di Tape Deck "Nada Lama"',
        sublabel: 'Interior Toko Musik · Ganti Kaset Musik Live',
        position: [-25.1, 0.08, -25.4],
        onInteract: () => {
          const tapes: { station: 'langkah_kecil' | 'piano_hujan' | 'senja_fm'; title: string }[] = [
            { station: 'langkah_kecil', title: 'Kaset Demo "Langkah Kecil" (2018)' },
            { station: 'piano_hujan', title: 'Kaset Piano Hujan & Kopi' },
            { station: 'senja_fm', title: 'Kaset Akustik Senja Klasik' },
          ];
          const chosen = tapes[cassetteIdxRef.current % tapes.length];
          cassetteIdxRef.current += 1;
          sfxEngine.play('switch');
          store.setRadioStation(chosen.station);
          if (!store.flags.includes('visited_nada_lama_cassette')) {
            store.startDialogue('interior_music_cassette');
          } else {
            store.showToast(`Memutar ${chosen.title} di Tape Deck "Nada Lama"!`);
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.interior_music_cassette, 'fw_cassette');
            }
          }
        },
      },
      2.6,
    );

    consider(
      {
        id: 'interior_music_guitar',
        kind: 'story_object',
        label: 'Coba Petik Gitar Etalase "Nada Lama"',
        sublabel: 'Interior Toko Musik · Mini-Aktivitas Gitar',
        position: [-18.2, 0.08, -23.4],
        onInteract: () => {
          sfxEngine.playGuitarChord(0);
          store.setGuitarOpen(true);
        },
      },
      2.5,
    );

    consider(
      {
        id: 'interior_music_vinyl',
        kind: 'story_object',
        label: store.vinylPlaying
          ? 'Ganti Piringan Hitam / Hentikan Turntable'
          : 'Putar Piringan Hitam di Turntable "Nada Lama"',
        sublabel: 'Meja Kasir Toko Musik · Piringan Hitam Analog Live',
        position: [-18.95, 0.08, -27.25],
        onInteract: () => {
          store.cycleNadaLamaVinyl();
        },
      },
      2.2,
    );

    consider(
      {
        id: 'activity_kios_vending',
        kind: 'story_object',
        label: 'Ambil Minuman Kaleng Dingin di Mesin Teras',
        sublabel: 'Kios 24 Jam Harmoni · Chiller 24 Jam Bercahaya',
        position: [28.9, 0, 15.8],
        onInteract: () => {
          sfxEngine.play('switch');
          sfxEngine.play('coffee');
          const drinks = [
            'Klung! Sekaleng Teh Melati Dingin jatuh segar dari mesin chiller Kios 24 Jam Harmoni.',
            'Klung! Sekaleng Kopi Susu Gula Aren dingin siap menemani langkah sore di Jl. Kenangan.',
            'Klung! Sebotol Susu Stroberi dingin manis—pasti bikin Kira langsung tersenyum!',
          ];
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_kios_vending, 'fw_kios_vending');
          }
          store.showToast(drinks[Math.floor(Date.now() / 1000) % drinks.length]);
        },
      },
      2.2,
    );

    consider(
      {
        id: 'interior_kios_fridge',
        kind: 'story_object',
        label: 'Buka Lemari Es Minuman Kios Harmoni',
        sublabel: 'Interior Kios 24 Jam Harmoni',
        position: [24.5, 0.08, 26.2],
        onInteract: () => {
          store.startDialogue('interior_kios_fridge');
        },
      },
      2.6,
    );

    consider(
      {
        id: 'interior_kios_tea',
        kind: 'story_object',
        label: 'Seduh Teh Melati Hangat di Dispenser Kasir',
        sublabel: 'Interior Kios 24 Jam Harmoni',
        position: [28.0, 0.08, 23.4],
        onInteract: () => {
          store.startDialogue('interior_kios_tea');
        },
      },
      2.4,
    );

    // === HADIAH KEJUTAN UNTUK KELUARGA (MASUK KE TAS SELEMPANG [I]) ===
    if (!store.flags.includes('has_gift_kira')) {
      consider(
        {
          id: 'pickup_gift_kira',
          kind: 'story_object',
          label: 'Beli Es Krim Stroberi & Cat Air Biru (Hadiah Kira)',
          sublabel: 'Kios 24 Jam Harmoni · Masuk ke Tas [I]',
          position: [22.2, 0, 16.0],
          onInteract: () => {
            sfxEngine.play('chime');
            store.applyEffect({
              setFlags: ['has_gift_kira'],
              toast: 'Es Krim Stroberi & Cat Air Biru masuk ke Tas Selempang [I]! Bawa pulang untuk Kira.',
            });
          },
        },
        2.6,
      );
    }

    if (!store.flags.includes('has_gift_nadia')) {
      consider(
        {
          id: 'pickup_gift_nadia',
          kind: 'story_object',
          label: 'Petik Setangkai Bunga Melati Senja (Hadiah Nadia)',
          sublabel: 'Taman Kota · Masuk ke Tas [I]',
          position: [-65.8, 0, -11.5],
          onInteract: () => {
            sfxEngine.play('chime');
            store.applyEffect({
              setFlags: ['has_gift_nadia'],
              toast: 'Setangkai Bunga Melati masuk ke Tas Selempang [I]! Bawa pulang untuk Nadia.',
            });
          },
        },
        2.7,
      );
    }

      consider(
        {
          id: 'activity_siomay_mang_asep',
          kind: 'story_object',
          label: 'Pesan Siomay Bandung & Batagor Mang Asep',
          sublabel: 'Tepi Taman Kota · Kukus Hangat & Bumbu Kacang',
          position: [-79.0, 0, 11.4],
          onInteract: () => {
            store.openCulinarySpot('siomay');
          },
        },
        2.8,
      );

      consider(
        {
          id: 'activity_melati_projector_ctrl',
          kind: 'story_object',
          label: 'Putar / Ganti Film Proyektor Warga RT 04',
          sublabel: 'Perumahan Melati · Layar Nobar Malam (3 Film)',
          position: [16.2, 0, 58.35],
          onInteract: () => {
            store.cycleMelatiProjector();
          },
        },
        2.3,
      );

      consider(
        {
          id: 'sit_melati_projector_bench',
          kind: 'story_object',
          label: 'Duduk Nonton Layar Proyektor Warga',
          sublabel: 'Perumahan Melati · Bangku Nobar RT 04',
          position: [16.2, 0, 56.0],
          onInteract: () => {
            sfxEngine.play('interact');
            playerRuntime.sitState = {
              active: true,
              label: 'Layar Proyektor Warga RT 04 Melati',
              seatPos: [16.2, 0.14, 56.7],
              lookAt: [16.2, 1.78, 62.2],
              standPos: [16.2, 0, 55.6],
              seatYaw: 0,
            };
            store.setSitting(true);
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_melati_projector, 'fw_projector_sit');
            }
            store.showToast('Damar duduk santai di bangku nobar warga menghadap layar proyektor... (WASD/E berdiri)');
          },
        },
        2.3,
      );

      consider(
        {
          id: 'inspect_cafe_bike_rack',
          kind: 'story_object',
          label: 'Periksa Rak Parkir Sepeda Pengunjung Kafe',
          sublabel: 'Depan Kedai Kopi Bima · Komunitas Gowes Sore',
          position: [-23.6, 0, 10.2],
          onInteract: () => {
            sfxEngine.playBicycleBell();
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_cafe_bikes, 'fw_cafe_bikes');
            }
            store.showToast('Kring-kring! Dua sepeda pengunjung terparkir rapi di rak depan Kedai Bima—masih ada satu slot kosong untuk pesepeda sore.');
          },
        },
        2.4,
      );

      consider(
        {
          id: 'inspect_cafe_delivery_scooter',
          kind: 'story_object',
          label: 'Periksa Motor Kurir Kopi Sudut Express',
          sublabel: 'Depan Kedai Kopi Bima · Boks Termal Antar Kopi',
          position: [-16.2, 0, 10.0],
          onInteract: () => {
            sfxEngine.play('interact');
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_cafe_bikes, 'fw_cafe_delivery');
            }
            store.showToast('Boks termal “Kopi Sudut · Antar Hangat” terpasang rapi di belakang motor plat B 4128 KOP—siap mengantar kopi aren keliling kota.');
          },
        },
        2.4,
      );

      consider(
        {
          id: 'activity_porch_wind_chime',
          kind: 'story_object',
          label: 'Sentuh Lonceng Angin Bambu Teras',
          sublabel: 'Beranda Rumah Jl. Melati No. 14',
          position: [-18.4, 0.08, 60.8],
          onInteract: () => {
            playerRuntime.windChimeTimer = 3.6;
            sfxEngine.playBambooWindChime(1.0);
            if (!store.flags.includes('rang_porch_wind_chime')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['rang_porch_wind_chime'],
                journalEntry: {
                  id: 'je_porch_wind_chime',
                  title: 'Denting Lonceng Bambu di Beranda Rumah',
                  body: 'Setiap kali angin sore menyentuh lonceng bambu di samping pintu rumah Jl. Melati No. 14, suara kayunya yang hangat selalu mengingatkan bahwa aku sudah benar-benar sampai di rumah.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_wind_chime, 'fw_wind_chime');
            }
            store.showToast('Klotak-klotak... lima tabung bambu berdenting merdu tertiup angin beranda Rumah Jl. Melati.');
          },
        },
        2.2,
      );

      consider(
        {
          id: 'activity_river_sketch_artist',
          kind: 'story_object',
          label: 'Lihat Lukisan Sketsa Jembatan Mas Dimas',
          sublabel: 'Promenade Tepi Sungai · Pelukis Jalanan',
          position: [-36.6, 0, 12.6],
          onInteract: () => {
            sfxEngine.play('page');
            const lines = [
              'Mas Dimas: "Cahaya lampu Jembatan Lampion kalau dipantulkan ke air sungai nggak pernah sama tiap harinya, Mas."',
              'Mas Dimas: "Kadang orang cuma butuh berhenti lima menit buat lihat seindah apa kota yang tiap hari mereka lewati."',
              'Mas Dimas: "Kalau adik kecil di rumah suka gambar, mampir aja lagi nanti—saya kasih lihat cara campur warna senja!"',
            ];
            if (!store.flags.includes('met_river_sketch_artist')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['met_river_sketch_artist'],
                journalEntry: {
                  id: 'je_river_sketch_artist',
                  title: 'Pelukis Sketsa Jembatan di Tepi Sungai',
                  body: 'Di tepi promenade sungai, Mas Dimas dengan sabar melukis Jembatan Lampion di atas kanvas akrilik. Melihat kotaku dari sapuan kuasnya membuat perjalanan pulang terasa jauh lebih bermakna.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_river_artist, 'fw_river_artist');
            }
            store.showToast(lines[Math.floor(Date.now() / 1000) % lines.length]);
          },
        },
        2.6,
      );

      consider(
        {
          id: 'activity_station_tap_gate',
          kind: 'story_object',
          label: 'Tap Kartu Komuter di Gerbang Stasiun Senja',
          sublabel: 'Stasiun Senja · Gerbang KMT / E-Money',
          position: [74.6, 0.11, -7.6],
          onInteract: () => {
            playerRuntime.stationGateTimer = 3.2;
            sfxEngine.playStationTapBeep();
            if (!store.flags.includes('tapped_station_gate')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['tapped_station_gate'],
                journalEntry: {
                  id: 'je_station_tap_gate',
                  title: 'Bunyi Bip Gerbang Komuter Stasiun Senja',
                  body: 'Suara "bip-bip" gerbang kartu elektronik di Stasiun Senja begitu akrab di telingaku—dulu bunyi itu selalu menandai hari kerja yang tergesa, hari ini aku melewatinya tanpa terburu-buru.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_station_gate, 'fw_station_gate');
            }
            store.showToast('BIP-BIP! Kartu KMT terbaca — lampu LED menyala hijau dan pintu gerbang Stasiun Senja terbuka mulus.');
          },
        },
        2.5,
      );

      consider(
        {
          id: 'activity_pak_ujang_cobbler',
          kind: 'story_object',
          label: 'Semir Sepatu & Ngobrol dengan Pak Ujang',
          sublabel: 'Trotoar Jl. Cempaka · Sol Sepatu & Sandal',
          position: [9.7, 0, 21.8],
          onInteract: () => {
            sfxEngine.playShoeCobblerTap();
            const lines = [
              'Pak Ujang: "Sepatu kerja kalau rutin disemir dan dirawat solnya, dipakai bertahun-tahun tetap gagah, Mas Damar!"',
              'Pak Ujang: "Alhamdulillah, hari ini sudah tujuh pasang sepatu warga selesai dijahit rapi. Mau mampir duduk sebentar, Mas?"',
              'Pak Ujang: "Langkah kaki itu penting, Mas—sepatu nyaman bikin jalan pulang ke rumah makin terasa ringan."',
            ];
            if (!store.flags.includes('met_pak_ujang_cobbler')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['met_pak_ujang_cobbler'],
                journalEntry: {
                  id: 'je_pak_ujang_cobbler',
                  title: 'Sepatu Kerja yang Dirapikan Pak Ujang',
                  body: 'Di bawah payung teduh trotoar Jl. Cempaka, Pak Ujang merapikan dan menyemir sepatu kerjaku dengan sabar. Ia bilang sepatu yang dirawat baik membuat setiap langkah pulang terasa lebih ringan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pak_ujang, 'fw_pak_ujang');
            }
            store.showToast(lines[Math.floor(Date.now() / 1000) % lines.length]);
          },
        },
        2.6,
      );

      consider(
        {
          id: 'activity_gorengan_mbak_yuni',
          kind: 'story_object',
          label: 'Beli Gorengan Hangat Sore Mbak Yuni',
          sublabel: 'Trotoar Jl. Cempaka · Tahu Isi, Mendoan & Pisang Goreng',
          position: [-9.8, 0, 31.4],
          onInteract: () => {
            store.openCulinarySpot('gorengan');
          },
        },
        2.8,
      );

      consider(
        {
          id: 'activity_melati_pingpong',
          kind: 'story_object',
          label: 'Main Reli Ping-Pong Kompleks Melati',
          sublabel: 'Lapangan RT 04 · Tenis Meja Warga',
          position: [33.2, 0, 56.9],
          onInteract: () => {
            playerRuntime.pingPongRallyTimer = 6.5;
            sfxEngine.playPingPongRally();
            if (!store.flags.includes('played_melati_pingpong')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['played_melati_pingpong'],
                journalEntry: {
                  id: 'je_melati_pingpong',
                  title: 'Reli Ping-Pong Sore di Kompleks Melati',
                  body: 'Di dekat Pos Kamling RT 04, aku mencoba reli singkat di meja ping-pong warga. Bunyi "tik-tok" bola putih yang lincah memantul membawa kembali semangat ringan masa muda.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pingpong, 'fw_pingpong');
            }
            store.showToast('Tik-tok! Tik-tok! Bola putih memantul lincah melewati net di meja ping-pong Kompleks Melati!');
          },
        },
        2.7,
      );

      consider(
        {
          id: 'activity_pecel_lele_lamongan',
          kind: 'story_object',
          label: 'Pesan Pecel Lele & Ayam Kremes Lamongan',
          sublabel: 'Warung Tenda Sari Rasa · Tepi Jl. Kenangan',
          position: [44.05, 0, 10.65],
          onInteract: () => {
            store.openCulinarySpot('pecel_lele');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_kios_atm_booth',
          kind: 'story_object',
          label: 'Tarik Tunai di Bilik ATM 24 Jam Bank Senja',
          sublabel: 'Samping Kios 24 Jam Harmoni',
          position: [32.55, 0, 17.25],
          onInteract: () => {
            sfxEngine.playAtmBeepAndCash();
            if (!store.flags.includes('used_kios_atm_booth')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['used_kios_atm_booth'],
                journalEntry: {
                  id: 'je_kios_atm_booth',
                  title: 'Tarik Tunai Kecil untuk Jajan Keluarga',
                  body: 'Di bilik ATM 24 Jam sebelah Kios Harmoni, aku menarik uang tunai secukupnya untuk jajan kaki lima malam ini. Uang yang dihabiskan bersama keluarga tidak pernah terasa sia-sia.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_atm_booth, 'fw_atm_booth');
            }
            store.showToast('Bip-bip... krrrr! Uang tunai rapi di dompet—siap mentraktir keluarga jajan kaki lima di Kota Senja.');
          },
        },
        2.4,
      );

      consider(
        {
          id: 'activity_station_opang',
          kind: 'story_object',
          label: 'Sapa Bang Hendra di Pangkalan Ojek Stasiun',
          sublabel: 'Pintu Selatan Stasiun Senja · Opang Ramah',
          position: [76.5, 0, 17.85],
          onInteract: () => {
            sfxEngine.play('interact');
            const lines = [
              'Bang Hendra: "Sore, Mas Damar! Pulang jalan santai hari ini? Helm cadangan selalu siap kalau butuh antar ke Jl. Melati!"',
              'Bang Hendra: "Tadi kereta sore baru lewat, penumpang ramai banget. Alhamdulillah rezeki lancar hari ini, Mas."',
              'Bang Hendra: "Salam buat Mbak Nadia sama si kecil Kira di rumah ya, Mas! Hati-hati di jalan."',
            ];
            if (!store.flags.includes('met_station_opang')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['met_station_opang'],
                journalEntry: {
                  id: 'je_station_opang',
                  title: 'Sapaan Ramah Pangkalan Ojek Stasiun Senja',
                  body: 'Di sudut selatan Stasiun Senja, Bang Hendra dan rekan-rekan ojek pangkalan selalu menyapa hangat siapa pun yang melintas. Ternyata banyak sekali wajah ramah di kota ini yang dulu terlewat karena langkahku terlalu tergesa.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_station_opang, 'fw_station_opang');
            }
            store.showToast(lines[Math.floor(Date.now() / 1000) % lines.length]);
          },
        },
        2.6,
      );

      consider(
        {
          id: 'activity_park_balloon_vendor',
          kind: 'story_object',
          label: 'Belikan Balon Gas Warna-Warni untuk Kira',
          sublabel: 'Mang Dedi · Tepi Taman Bermain (Ganti Warna)',
          position: [-85.5, 0, 17.6],
          onInteract: () => {
            store.buyBalloonForKira();
          },
        },
        2.6,
      );

      consider(
        {
          id: 'activity_retro_payphone_pos',
          kind: 'story_object',
          label: 'Angkat Telepon Umum & Cek Bis Surat PT Pos',
          sublabel: 'Sudut Jl. Cempaka · Kenangan 90-an',
          position: [-8.6, 0, -15.0],
          onInteract: () => {
            sfxEngine.playRetroPayphoneDial();
            if (!store.flags.includes('used_retro_payphone_pos')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['used_retro_payphone_pos'],
                journalEntry: {
                  id: 'je_retro_payphone_pos',
                  title: 'Telepon Umum & Bis Surat Oranye Jl. Cempaka',
                  body: 'Aku mengangkat gagang telepon umum klasik di sudut Jl. Cempaka dan memandang bis surat oranye di sebelahnya. Rasanya begitu hangat mengingat masa ketika kabar rindu selalu disampaikan dengan sabar lewat koin dan perangko.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_retro_payphone, 'fw_retro_payphone');
            }
            store.showToast('Kling! Nada sambung telepon umum retro berbunyi hangat—di sampingnya bis surat oranye PT Pos berdiri setia.');
          },
        },
        2.5,
      );

      consider(
        {
          id: 'sit_park_garden_swing',
          kind: 'story_object',
          label: 'Duduk Berayun Santai di Ayunan Kayu Taman',
          sublabel: 'Tepi Danau Senja · Pergola Kayu Teduh',
          position: [-65.4, 0, -27.6],
          onInteract: () => {
            sfxEngine.play('interact');
            playerRuntime.gardenSwingTimer = 10;
            playerRuntime.sitState = {
              active: true,
              label: 'Ayunan Kayu Taman Danau Senja',
              seatPos: [-64.2, 0.24, -27.6],
              lookAt: [-78.0, 1.35, -27.6],
              standPos: [-65.5, 0, -27.6],
              seatYaw: -Math.PI / 2,
            };
            store.setSitting(true);
            if (!store.flags.includes('sat_park_garden_swing')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['sat_park_garden_swing'],
                journalEntry: {
                  id: 'je_park_garden_swing',
                  title: 'Berayun Pelan Menghadap Danau Senja',
                  body: 'Di kursi ayunan kayu beratap bougenville di tepi Taman Kota, aku duduk berayun pelan memandang dermaga dan riak air Danau Senja. Angin sore membawa pergi segala riuh yang tak perlu.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_garden_swing, 'fw_garden_swing');
            }
            store.showToast('Damar duduk berayun lembut menghadap Danau Senja... (Tekan WASD/E untuk berdiri)');
          },
        },
        2.5,
      );

      consider(
        {
          id: 'culinary_doger_toni',
          kind: 'story_object',
          label: 'Pesan Es Doger Segar Bang Toni',
          sublabel: 'Trotoar Jl. Cempaka Utara · Tape Ketan, Alpukat & Mutiara',
          position: [10.2, 0, -25.6],
          onInteract: () => {
            store.openCulinarySpot('doger');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_melati_chess',
          kind: 'story_object',
          label: 'Ikut 1 Langkah Catur Santai bersama Pak Yanto',
          sublabel: 'Meja Catur Pos Ronda RT 04 · Perumahan Melati',
          position: [22.4, 0, 56.8],
          onInteract: () => {
            sfxEngine.playChessTap();
            playerRuntime.chessMoveStep += 1;
            playerRuntime.chessMoveTimer = 4.4;
            const chessLines = [
              'Tok! Kuda putih melompat taktis — Pak Yanto: "Waduh, langkah kuda Mas Damar tajam banget! Pak Hendro, bantuin mikir dong!"',
              'Tok! Strategi rapi di tengah papan — Pak Hendro: "Nah ini baru lawan sepadan! Ngopi dulu, Mas, jangan buru-buru pulang!"',
              'Tok! Langkah pertahanan mantap — Pak Yanto: "Skak tipis nih! Sore-sore main catur bareng tetangga begini rasanya adem banget ya, Mas."',
              'Tok! Bidak putih membuka jalur baru — Pak Hendro: "Mantap Mas Damar! Kapan-kapan malam minggu kita tanding satu babak penuh di Pos Ronda!"',
            ];
            if (!store.flags.includes('played_melati_chess')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['played_melati_chess'],
                journalEntry: {
                  id: 'je_melati_chess',
                  title: 'Satu Langkah Catur di Samping Pos Ronda RT 04',
                  body: 'Di samping Pos Ronda RT 04 Melati, aku berhenti sejenak dan ikut menggerakkan satu bidak catur bersama Pak Yanto dan Pak Hendro. Bunyi "tok!" bidak kayu dan tawa akrab para tetangga mengingatkan bahwa rumah bukan hanya empat dinding, tapi juga lingkungan tempat kita saling menyapa.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_melati_chess, 'fw_melati_chess');
            }
            store.showToast(chessLines[playerRuntime.chessMoveStep % chessLines.length]);
          },
        },
        2.8,
      );

      consider(
        {
          id: 'activity_krl_led_board',
          kind: 'story_object',
          label: 'Cek Papan LED Jadwal Kedatangan KRL',
          sublabel: 'Peron Jalur 1 Stasiun Senja · Sinkron Real-Time',
          position: [84.4, 0.1, -2.2],
          onInteract: () => {
            sfxEngine.playKrlBoardChime();
            const phase = playerRuntime.trainPhase;
            let liveMsg = '';
            if (phase === 'boarding') {
              const rem = Math.max(1, Math.ceil(playerRuntime.trainDwellTimer));
              liveMsg = `Papan LED KRL: Kereta Jalur 1 sedang DI PERON (pintu terbuka) — berangkat dalam ±${rem} detik menuju Stasiun Kota Barat.`;
            } else if (phase === 'approaching') {
              const distM = Math.max(2, Math.round(Math.max(0, -4 - playerRuntime.trainZ)));
              const eta = Math.max(1, Math.ceil(distM / Math.max(4, playerRuntime.trainSpeed)));
              liveMsg = `Papan LED KRL: Rangkaian Jalur 1 MENDEKAT (${distM} meter lagi, tiba ±${eta} detik). Harap berdiri di belakang garis kuning!`;
            } else if (phase === 'departing') {
              liveMsg = 'Papan LED KRL: Kereta Jalur 1 baru saja BERANGKAT menuju Stasiun Kota Barat — rangkaian berikutnya segera bersiap.';
            } else {
              const waitSec = Math.max(1, Math.ceil(playerRuntime.trainDwellTimer + 7));
              liveMsg = `Papan LED KRL: Kereta Komuter berikutnya tiba dari Utara dalam ±${waitSec} detik (Tarif Rp 3.000 · 6 Gerbong).`;
            }
            if (!store.flags.includes('checked_krl_led_board')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['checked_krl_led_board'],
                journalEntry: {
                  id: 'je_krl_led_board',
                  title: 'Menatap Papan Jadwal KRL di Peron Stasiun Senja',
                  body: 'Di tengah peron Stasiun Senja, papan LED jadwal KRL berkedip menunjukkan jarak rangkaian yang mendekat dengan teliti. Dulu aku selalu terburu-buru mengejar setiap hitungan detik di layar itu—hari ini aku hanya berdiri tenang menikmati sore.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_krl_led_board, 'fw_krl_led_board');
            }
            store.showToast(liveMsg);
          },
        },
        3.0,
      );

      consider(
        {
          id: 'culinary_ketoprak_jaja',
          kind: 'story_object',
          label: 'Pesan Ketoprak Jakarta Ulek Cobek Bang Jaja',
          sublabel: 'Promenade Tepi Sungai · Ketupat, Tahu, Bumbu Kacang & Kerupuk',
          position: [-37.9, 0, 36.2],
          onInteract: () => {
            store.openCulinarySpot('ketoprak');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_danau_lotus_pond',
          kind: 'story_object',
          label: 'Amati Hamparan Bunga Teratai Mekar di Danau Senja',
          sublabel: 'Sudut Tenggara Danau · Teratai Merah Muda & Katak Kecil',
          position: [-73.2, 0, -12.6],
          onInteract: () => {
            sfxEngine.playLotusPondRipple();
            playerRuntime.lotusFrogHopTimer = 3.8;
            if (!store.flags.includes('admired_danau_lotus')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['admired_danau_lotus'],
                journalEntry: {
                  id: 'je_danau_lotus_pond',
                  title: 'Bunga Teratai yang Mekar Tenang di Danau Senja',
                  body: 'Di sudut tenggara Danau Senja, bunga-bunga teratai merah muda dan putih gading mengapung tenang di atas riak air, sementara seekor katak hijau kecil melompat dari satu daun ke daun lain. Keindahan ternyata tidak pernah tergesa-gesa.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_lotus_pond, 'fw_lotus_pond');
            }
            store.showToast('Plup! Seekor katak kecil melompat riang di antara daun & bunga teratai merah muda yang mengapung tenang.');
          },
        },
        3.2,
      );

      consider(
        {
          id: 'activity_plaza_weather_totem',
          kind: 'story_object',
          label: 'Cek Papan Cuaca & Kualitas Udara Kota Senja',
          sublabel: 'Plaza Menara Nusantara · Sensor Angin & Jam Digital',
          position: [24.4, 0, -14.1],
          onInteract: () => {
            sfxEngine.playKrlBoardChime();
            const weatherSummary: Record<string, string> = {
              morning: 'Info Plaza Nusantara: 26°C · Pagi Cerah Berembun · Angin 8 km/j · Kualitas Udara AQI 31 (Segar).',
              sunset: 'Info Plaza Nusantara: 29°C · Senja Hangat Keemasan · Angin 11 km/j · Kualitas Udara AQI 36 (Baik).',
              rain_dusk: 'Info Plaza Nusantara: 23°C · Sore Berhujan Sejuk · Angin 19 km/j · Kualitas Udara AQI 22 (Bersih). Siapkan payung [U]!',
              night: 'Info Plaza Nusantara: 24°C · Malam Tenang Berbintang · Angin 6 km/j · Kualitas Udara AQI 29 (Baik).',
            };
            if (!store.flags.includes('checked_plaza_weather_totem')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['checked_plaza_weather_totem'],
                journalEntry: {
                  id: 'je_plaza_weather_totem',
                  title: 'Berhenti Sejenak di Depan Papan Cuaca Plaza Nusantara',
                  body: 'Di depan Menara Nusantara, tugu layar digital menampilkan suhu kota, kecepatan angin, dan kualitas udara yang masih sejuk. Di bagian paling bawah tertulis pesan singkat yang membuatku tersenyum: "Berjalanlah pelan — kota ini menunggumu pulang."',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_plaza_weather_totem, 'fw_plaza_weather_totem');
            }
            store.showToast(weatherSummary[store.timeOfDay] ?? weatherSummary.sunset);
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_warkop_dadang',
          kind: 'story_object',
          label: 'Pesan Kopi Tubruk & Kue Pasar Mang Dadang',
          sublabel: 'Gerbang Barat Stasiun Senja · Klepon, Kue Lumpur & Lemper',
          position: [71.6, 0, -9.4],
          onInteract: () => {
            store.openCulinarySpot('warkop_stasiun');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_melati_birdcages',
          kind: 'story_object',
          label: 'Dengarkan Kicauan Burung di Teras Tetangga',
          sublabel: 'Jl. Melati · Sangkar Bambu Kenari & Cucak Ijo',
          position: [-0.3, 0, 63.6],
          onInteract: () => {
            sfxEngine.playBirdcageChirp();
            playerRuntime.birdcageChirpTimer = 4.6;
            if (!store.flags.includes('listened_melati_birds')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['listened_melati_birds'],
                journalEntry: {
                  id: 'je_melati_birdcages',
                  title: 'Kicauan Kenari di Beranda Tetangga Jl. Melati',
                  body: 'Di halaman rumah sebelah, dua sangkar burung kayu bergoyang pelan ditiup angin sementara burung kenari kuning berkicau merdu dari tangkringannya. Suara kecil yang selama ini menandai pagi di perumahan ternyata menenangkan sekali saat sungguh-sungguh didengarkan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_melati_birdcage, 'fw_melati_birdcage');
            }
            store.showToast('Cuit-cuit merdu! Burung kenari & cucak ijo melompat riang menyambut sapaanmu dari sangkar bambu.');
          },
        },
        3.0,
      );

      consider(
        {
          id: 'sit_nada_poster_bench',
          kind: 'story_object',
          label: 'Duduk Santai di Sudut Poster Konser Nada Lama',
          sublabel: 'Samping Toko Musik Nada Lama · Bangku Teduh & Poster Indie',
          position: [-10.9, 0, -24.6],
          onInteract: () => {
            sfxEngine.play('interact');
            playerRuntime.sitState = {
              active: true,
              label: 'Sudut Poster Konser Nada Lama',
              seatPos: [-11.8, 0.14, -24.6],
              lookAt: [4.0, 1.35, -24.6],
              standPos: [-10.5, 0, -24.6],
              seatYaw: Math.PI / 2,
            };
            store.setSitting(true);
            if (!store.flags.includes('sat_nada_poster_bench')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['sat_nada_poster_bench'],
                journalEntry: {
                  id: 'je_nada_poster_bench',
                  title: 'Bangku Teduh di Samping Poster Konser Nada Lama',
                  body: 'Di bawah pohon teduh samping Toko Musik Nada Lama, aku duduk sejenak membaca poster-poster konser akustik lama yang masih tertempel rapi. Musik dan kenangan muda itu rupanya tidak pernah hilang—ia hanya menungguku kembali berdamai dengannya.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_nada_poster_bench, 'fw_nada_poster_bench');
            }
            store.showToast('Damar duduk teduh di samping papan poster konser klasik Nada Lama... (Tekan WASD/E untuk berdiri)');
          },
        },
        2.7,
      );

      consider(
        {
          id: 'culinary_jasuke_roni',
          kind: 'story_object',
          label: 'Pesan Jasuke & Jagung Bakar Arang Bang Roni',
          sublabel: 'Tepi Taman Kota · Keju Parut, Susu & Bara Arang',
          position: [-74.2, 0, 17.8],
          onInteract: () => {
            store.openCulinarySpot('jasuke_taman');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_park_drinking_fountain',
          kind: 'story_object',
          label: 'Minum Air Segar dari Keran Siap Minum Taman',
          sublabel: 'Promenade Tepi Sungai · Pos Air Minum Taman Kota',
          position: [-58.4, 0, -13.2],
          onInteract: () => {
            sfxEngine.playWaterFountain();
            playerRuntime.fountainDrinkTimer = 4.2;
            if (!store.flags.includes('used_park_drinking_fountain')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['used_park_drinking_fountain'],
                journalEntry: {
                  id: 'je_park_drinking_fountain',
                  title: 'Tegukan Air Segar di Pos Air Minum Tepi Sungai',
                  body: 'Di promenade tepi sungai dekat Taman Kota, aku menekan keran air siap minum dan menyesap aliran air jernih yang melengkung lembut. Hal-hal sederhana yang dirawat bersama oleh warga membuat sebuah kota terasa layak disebut rumah.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_drinking_fountain, 'fw_drinking_fountain');
            }
            store.showToast('Ssshhh... Aliran air jernih melengkung segar dari keran taman! Dahaga perjalanan langsung hilang.');
          },
        },
        2.5,
      );

      consider(
        {
          id: 'sit_river_stone_bench',
          kind: 'story_object',
          label: 'Duduk Santai di Bangku Batu Alami Tepi Sungai',
          sublabel: 'Promenade Sungai Barat · Menghadap Aliran Sungai & Menara',
          position: [-58.6, 0, -15.4],
          onInteract: () => {
            sfxEngine.play('interact');
            playerRuntime.sitState = {
              active: true,
              label: 'Bangku Batu Tepi Sungai Kota',
              seatPos: [-57.8, 0.14, -15.4],
              lookAt: [-42.0, 1.35, -15.4],
              standPos: [-59.0, 0, -15.4],
              seatYaw: Math.PI / 2,
            };
            store.setSitting(true);
            if (!store.flags.includes('sat_river_stone_bench')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['sat_river_stone_bench'],
                journalEntry: {
                  id: 'je_river_stone_bench',
                  title: 'Duduk Tenang di Bangku Batu Tepi Sungai',
                  body: 'Aku duduk di bangku batu andesit yang sejuk di tepi barat Sungai Kota, memandang pantulan Menara Nusantara dan deretan lampion di permukaan air. Tidak ada rapat, tidak ada tenggat—hanya suara air mengalir perlahan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_river_stone_bench, 'fw_river_stone_bench');
            }
            store.showToast('Damar duduk santai di bangku batu menghadap aliran Sungai Kota... (Tekan WASD/E untuk berdiri)');
          },
        },
        2.7,
      );

      consider(
        {
          id: 'activity_park_wayfinder',
          kind: 'story_object',
          label: 'Baca Papan Penunjuk Arah Kayu Taman Kota',
          sublabel: 'Simpang Jalur Pejalan Kaki · Danau, Stasiun & Toko Musik',
          position: [-63.2, 0, 14.4],
          onInteract: () => {
            sfxEngine.play('chime');
            if (!store.flags.includes('read_park_wayfinder')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['read_park_wayfinder'],
                journalEntry: {
                  id: 'je_park_wayfinder',
                  title: 'Penunjuk Arah Kayu di Jalur Pejalan Kaki Taman',
                  body: 'Di persimpangan jalur pejalan kaki Taman Kota yang diterangi lampu taman hangat, papan panah kayu menunjuk rapi ke Danau Senja, Toko Musik Nada Lama, Stasiun Senja, dan sudut Jasuke Bang Roni. Semua jalan pulang ternyata selalu saling terhubung.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_park_wayfinder, 'fw_park_wayfinder');
            }
            store.showToast('Papan Arah Taman: ◀ Danau Senja (38m) · Toko Musik (55m) ▶ · Stasiun (140m) ▶ · ◀ Jasuke & Taman Bermain (15m).');
          },
        },
        2.8,
      );

      consider(
        {
          id: 'culinary_eskrim_eko',
          kind: 'story_object',
          label: 'Pesan Es Krim Keliling Mas Eko (+ Bel Melodi)',
          sublabel: 'Tepi Jl. Melati · Es Potong Roti Tawar & Cone Dua Rasa',
          position: [-5.1, 0, 52.5],
          onInteract: () => {
            sfxEngine.playIceCreamJingle();
            store.openCulinarySpot('eskrim_melati');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_mbak_sari_fruit',
          kind: 'story_object',
          label: 'Pilih & Timbang Buah Segar Lokal di Lapak Mbak Sari',
          sublabel: 'Dekat Perempatan Utama · Mangga, Jeruk, Pisang & Semangka',
          position: [11.2, 0, 14.8],
          onInteract: () => {
            sfxEngine.play('chime');
            playerRuntime.fruitScaleSwingTimer = 3.8;
            playerRuntime.fruitPurchaseStep += 1;
            const fruitLines = [
              'Mbak Sari menimbang 1 kg Mangga Harum Manis matang pohon: "Manis banget nih Mas, pas buat dibawa pulang ke Jl. Melati!"',
              'Mbak Sari memilihkan sekantong Jeruk Medan segar: "Segar-segar baru turun pagi tadi, Mas Damar! Anak pasti suka!"',
              'Mbak Sari membungkus potongan Semangka Merah manis: "Ini manis banget, Mas—dimakan dingin-dingin sore begini mantap!"',
              'Mbak Sari menimbang sesisir Pisang Raja kuning wangi: "Cocok buat sarapan besok pagi sama teh hangat, Mas!"',
            ];
            if (!store.flags.includes('visited_mbak_sari_fruit')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_mbak_sari_fruit'],
                journalEntry: {
                  id: 'je_mbak_sari_fruit',
                  title: 'Warna-Warni Lapak Buah Segar Mbak Sari',
                  body: 'Di bawah terpal biru-oranye dekat perempatan utama, aku berhenti memilih buah lokal segar di lapak Mbak Sari. Melihat mangga harum manis, jeruk medan, dan semangka merah ditimbang di timbangan gantung membuat perjalanan pulang terasa lebih hangat.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_mbak_sari_fruit, 'fw_mbak_sari_fruit');
            }
            store.showToast(fruitLines[playerRuntime.fruitPurchaseStep % fruitLines.length]);
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_melati_portal',
          kind: 'story_object',
          label: 'Periksa Portal Palang Pintu Masuk Jl. Melati',
          sublabel: 'Gerbang Perumahan RT 04 · Tamu Harap Lapor & Cermin Tikungan',
          position: [-10.8, 0, 50.8],
          onInteract: () => {
            sfxEngine.playPortalGateCreak();
            playerRuntime.melatiPortalTimer = 4.5;
            if (!store.flags.includes('inspected_melati_portal')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['inspected_melati_portal'],
                journalEntry: {
                  id: 'je_melati_portal',
                  title: 'Gerbang Portal Merah-Putih Jl. Melati RT 04',
                  body: 'Di pintu masuk perumahan, gerbang portal loreng putih-merah bertuliskan "Perumahan Jl. Melati — Tamu Harap Lapor" berdiri rapi lengkap dengan lampu suar kecil dan cermin cembung jalan. Setiap kali melewatinya saat senja, bahu yang seharian tegang akhirnya bisa turun perlahan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_melati_portal, 'fw_melati_portal');
            }
            store.showToast('Krek-klik! Palang portal Jl. Melati RT 04 bergerak mulus — papan gerbang: "Selamat Datang di Jl. Melati · Maks 20 km/j".');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_barber_rapi_jaya',
          kind: 'story_object',
          label: 'Rapikan Rambut & Ngobrol Santai di Pangkas Rambut "Rapi Jaya"',
          sublabel: 'Jl. Cempaka · Bang Darto & Lampu Barber Pole Berputar',
          position: [13.0, 0, 37.8],
          onInteract: () => {
            sfxEngine.playBarberSnip();
            playerRuntime.barberCutTimer = 4.2;
            if (!store.flags.includes('visited_barber_rapi_jaya')) {
              store.applyEffect({
                kejujuranDiri: 1,
                kehadiranKeluarga: 1,
                setFlags: ['visited_barber_rapi_jaya'],
                journalEntry: {
                  id: 'je_barber_rapi_jaya',
                  title: 'Potong Rambut Rapi & Obrolan Hangat di Rapi Jaya',
                  body: 'Di bawah lampu tabung merah-putih-biru Pangkas Rambut "Rapi Jaya", Bang Darto merapikan potongan rambutku sambil bercerita tentang kabar warga Jl. Cempaka. Kadang merawat diri sepuluh menit saja cukup membuat langkah terasa lebih ringan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_barber_rapi_jaya, 'fw_barber_rapi_jaya');
            }
            store.showToast('Krik-krik-cssht! Bang Darto merapikan rambut Damar hingga segar kembali — "Nah, langsung kelihatan cerah, Mas!"');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_bu_ningsih_plants',
          kind: 'story_object',
          label: 'Pilih Tanaman Hias & Pot Terakota di Lapak Bu Ningsih',
          sublabel: 'Tepi Taman Kota Selatan · Monstera, Lidah Mertua & Kaktus',
          position: [-67.2, 0, 33.1],
          onInteract: () => {
            sfxEngine.play('chime');
            playerRuntime.nurseryPickStep += 1;
            const plantLines = [
              'Bu Ningsih menunjukkan pot Monstera daun lebar: "Yang ini rimbun banget, Mas—taruh di teras Jl. Melati langsung adem!"',
              'Bu Ningsih memilihkan Lidah Mertua pot terakota: "Gampang dirawat, tahan panas, bikin udara ruang tamu makin segar!"',
              'Bu Ningsih mengangkat pot Kaktus Mini lucu: "Ini favorit anak-anak, Mas—cocok banget buat jendela kamar Kira!"',
              'Bu Ningsih merapikan Bougenville merah muda: "Kalau kena matahari pagi, bunganya mekar cerah terus sepanjang bulan!"',
            ];
            if (!store.flags.includes('visited_bu_ningsih_plants')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_bu_ningsih_plants'],
                journalEntry: {
                  id: 'je_bu_ningsih_plants',
                  title: 'Deretan Pot Terakota & Daun Hijau Lapak Bu Ningsih',
                  body: 'Di sudut selatan Taman Kota, rak kayu Bu Ningsih dipenuhi pot tanah liat berisi monstera, lidah mertua, kaktus mini, dan bougenville merah muda. Merawat sesuatu agar tumbuh pelan rupanya punya kesabaran yang sama dengan merawat keluarga.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bu_ningsih_plants, 'fw_bu_ningsih_plants');
            }
            store.showToast(plantLines[playerRuntime.nurseryPickStep % plantLines.length]);
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_pak_ahmad_gallon',
          kind: 'story_object',
          label: 'Pesan Antar Galon Air Isi Ulang di Depot Pak Ahmad',
          sublabel: 'Sudut Jl. Melati · Tirta Melati RO & Sepeda Antar Galon',
          position: [25.0, 0, 41.0],
          onInteract: () => {
            sfxEngine.playWaterFountain();
            playerRuntime.gallonRefillTimer = 4.2;
            if (!store.flags.includes('ordered_pak_ahmad_gallon')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['ordered_pak_ahmad_gallon'],
                journalEntry: {
                  id: 'je_pak_ahmad_gallon',
                  title: 'Depot Air Isi Ulang Tirta Melati & Sepeda Pak Ahmad',
                  body: 'Di seberang Pos Ronda RT 04, aku mampir memesan isi ulang galon air RO di depot Pak Ahmad. Pak Ahmad tertawa ramah sambil menyiapkan sepeda pengantarnya menuju Jl. Melati No. 14—kehidupan kompleks terasa begitu saling menjaga.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pak_ahmad_gallon, 'fw_pak_ahmad_gallon');
            }
            store.showToast('Ssshh... Galon RO higienis selesai disterilkan UV! Pak Ahmad: "Siap Mas Damar, sebentar lagi langsung saya antar ke Jl. Melati No. 14!"');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_danau_ducks',
          kind: 'story_object',
          label: 'Tabur Remah Roti untuk Kawanan Bebek Danau Senja',
          sublabel: 'Tepi Selatan Danau · 5 Ekor Bebek Berenang & Berkwek',
          position: [-82.4, 0, -12.1],
          onInteract: () => {
            sfxEngine.playDuckQuack();
            playerRuntime.duckFeedTimer = 7.0;
            if (!store.flags.includes('fed_danau_ducks')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['fed_danau_ducks'],
                journalEntry: {
                  id: 'je_danau_ducks',
                  title: 'Kawanan Bebek Riang di Danau Senja',
                  body: 'Di tepi selatan Danau Senja, aku menaburkan remah roti ke permukaan air. Lima ekor bebek langsung berenang riang mendekat sambil berkwek lembut—pagi di kota ini terasa begitu ramah dan hidup.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_danau_ducks, 'fw_danau_ducks');
            }
            store.showToast('Kwek-kwek! Lima bebek Danau Senja langsung berenang mendekat mematuk remah roti di air!');
          },
        },
        3.1,
      );

      consider(
        {
          id: 'activity_ibu_lela_flowers',
          kind: 'story_object',
          label: 'Pilih Buket Bunga Segar di Kios Ibu Lela',
          sublabel: 'Tepi Jalan Taman Danau · Melati, Mawar & Krisan Segar',
          position: [-89.8, 0, -7.4],
          onInteract: () => {
            sfxEngine.play('chime');
            playerRuntime.flowerBouquetStep += 1;
            const flowerLines = [
              'Ibu Lela merangkai buket Melati & Mawar Pink harum: "Buat Mbak Nadia di rumah ya, Mas? Wanginya awet sampai besok!"',
              'Ibu Lela memilihkan tangkai Krisan Kuning cerah: "Yang kuning ceria ini pasti bikin Kira senyum lebar, Mas Damar!"',
              'Ibu Lela mengikat buket Mawar Merah segar berembun: "Baru dipetik subuh tadi, Mas—cantik banget buat meja ruang tamu!"',
              'Ibu Lela menambahkan Bunga Matahari mini: "Biar rumah di Jl. Melati selalu terasa hangat kayak pagi hari, Mas!"',
            ];
            if (!store.flags.includes('visited_ibu_lela_flowers')) {
              store.applyEffect({
                kehadiranKeluarga: 2,
                kejujuranDiri: 1,
                setFlags: ['visited_ibu_lela_flowers'],
                journalEntry: {
                  id: 'je_ibu_lela_flowers',
                  title: 'Aroma Melati & Mawar di Kios Bunga Ibu Lela',
                  body: 'Di tepi jalan Taman Danau, ember-ember seng Ibu Lela dipenuhi melati putih, mawar merah muda, dan krisan kuning segar. Aku memilih seikat kecil untuk dibawa pulang—bukan karena ada perayaan khusus, melainkan karena Nadia dan Kira pantas dirayakan di hari biasa.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_ibu_lela_flowers, 'fw_ibu_lela_flowers');
            }
            store.showToast(flowerLines[playerRuntime.flowerBouquetStep % flowerLines.length]);
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_bubur_ujang',
          kind: 'story_object',
          label: 'Pesan Bubur Ayam Pagi Mang Ujang',
          sublabel: 'Seberang Jl. Melati · Kuah Kuning, Cakwe, Sate Puyuh & Kerupuk',
          position: [-22.2, 0, 39.8],
          onInteract: () => {
            store.openCulinarySpot('bubur_melati');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_mushola_al_ikhlas',
          kind: 'story_object',
          label: 'Rehat Teduh di Serambi Mushola "Al-Ikhlas"',
          sublabel: 'Perumahan Melati RT 04 · Dengarkan Gema Bedug & Tenangkan Hati',
          position: [44.5, 0, 61.8],
          onInteract: () => {
            sfxEngine.playSoftBedug();
            playerRuntime.bedugRingTimer = 4.2;
            if (!store.flags.includes('visited_mushola_al_ikhlas')) {
              store.applyEffect({
                kejujuranDiri: 2,
                kehadiranKeluarga: 1,
                setFlags: ['visited_mushola_al_ikhlas'],
                journalEntry: {
                  id: 'je_mushola_al_ikhlas',
                  title: 'Serambi Teduh Mushola Al-Ikhlas Perumahan Melati',
                  body: 'Di ujung timur Perumahan Melati, aku berdiri sejenak di serambi Mushola Al-Ikhlas di bawah lentera hangat. Gema lembut bedug sore dan sejuknya tempat wudhu batu alam membuat segala riuh pikiran ikut mereda.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_mushola_al_ikhlas, 'fw_mushola_al_ikhlas');
            }
            store.showToast('Dung... dung... Gema bedug lembut di serambi Mushola Al-Ikhlas menenangkan hati dan langkahmu.');
          },
        },
        3.2,
      );

      consider(
        {
          id: 'culinary_tehpoci_ridwan',
          kind: 'story_object',
          label: 'Pesan Es Teh Poci & Tahu Gejrot Kang Ridwan',
          sublabel: 'Plaza Menara Nusantara · Gula Batu & Cobek Tahu Pong',
          position: [32.8, 0, -12.6],
          onInteract: () => {
            store.openCulinarySpot('tehpoci_plaza');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_angkot_route_board',
          kind: 'story_object',
          label: 'Cek Papan Rute & Jadwal Trayek Angkot Jl. Kenangan',
          sublabel: 'Pos Cek Trayek · Koridor K-01, K-02 & Bus Trans Senja',
          position: [31.6, 0, 10.6],
          onInteract: () => {
            sfxEngine.playKrlBoardChime();
            if (!store.flags.includes('checked_angkot_route_board')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['checked_angkot_route_board'],
                journalEntry: {
                  id: 'je_angkot_route_board',
                  title: 'Papan Rute Angkot & Bus Trans Senja Jl. Kenangan',
                  body: 'Di pinggir Jl. Kenangan, papan trayek biru-kuning merinci jalur angkot K-01 menuju Stasiun & Taman Danau, K-02 menuju Perumahan Melati, serta koridor Bus Trans Senja. Kota yang mudah dijelajahi selalu terasa lebih bersahabat.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_angkot_route_board, 'fw_angkot_route_board');
            }
            store.showToast('Info Trayek Jl. Kenangan: K-01 (Stasiun–Taman, ±6 mnt) · K-02 (Jl. Melati–Cempaka, ±8 mnt) · Trans Senja (Rp 3.500).');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_putu_oding',
          kind: 'story_object',
          label: 'Pesan Kue Putu Bambu Hangat Mang Oding (+ Peluit Uap)',
          sublabel: 'Promenade Sungai Utara · Kue Putu Pandan, Klepon & Lupis',
          position: [-38.0, 0, -22.6],
          onInteract: () => {
            sfxEngine.playKuePutuWhistle();
            playerRuntime.putuWhistleTimer = 4.5;
            store.openCulinarySpot('putu_sungai');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_bengkel_mas_budi',
          kind: 'story_object',
          label: 'Cek Tekanan & Isi Angin Ban di Bengkel Mas Budi',
          sublabel: 'Pinggir Jl. Kenangan · Kompresor Angin Motor & Sepeda',
          position: [49.0, 0, -12.8],
          onInteract: () => {
            sfxEngine.playTireAirHiss();
            playerRuntime.tirePumpTimer = 4.0;
            if (!store.flags.includes('visited_bengkel_mas_budi')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['visited_bengkel_mas_budi'],
                journalEntry: {
                  id: 'je_bengkel_mas_budi',
                  title: 'Isi Angin & Obrolan Bengkel Pinggir Jalan Mas Budi',
                  body: 'Di bengkel tambal ban Mas Budi tepi Jl. Kenangan, suara desis angin kompresor kuning mengisi ban skuter dan sepeda hingga mantap lagi. Mas Budi bilang perjalanan jauh selalu butuh jeda untuk memeriksa ban—sama seperti hidup yang butuh jeda memeriksa hati.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bengkel_mas_budi, 'fw_bengkel_mas_budi');
            }
            store.showToast('Pssshh—tss! Tekanan ban motor skuter & sepeda kota kembali pas — Mas Budi: "Aman Mas, hati-hati di jalan!"');
          },
        },
        3.0,
      );

      consider(
        {
          id: 'activity_laundry_harum_melati',
          kind: 'story_object',
          label: 'Ambil Cucian Wangi di Laundry "Harum Melati"',
          sublabel: 'Tepi Jl. Melati · Cuci Setrika Uap Lavender Mbak Rini',
          position: [33.8, 0, 41.0],
          onInteract: () => {
            sfxEngine.play('chime');
            playerRuntime.laundrySpinTimer = 4.5;
            if (!store.flags.includes('visited_laundry_harum_melati')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_laundry_harum_melati'],
                journalEntry: {
                  id: 'je_laundry_harum_melati',
                  title: 'Wangi Lavender Cucian Rapi di Harum Melati',
                  body: 'Aku mampir ke Kios Laundry "Harum Melati" mengambil lipatan baju yang sudah disetrika rapi dan harum lavender. Hal kecil yang membantu meringankan pekerjaan Nadia di rumah selalu terasa sepadan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_laundry_harum_melati, 'fw_laundry_harum_melati');
            }
            store.showToast('Mbak Rini menyerahkan paket baju rapi wangi lavender: "Sudah licin dan wangi semua, Mas Damar—salam buat Mbak Nadia!"');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_cilok_dedi',
          kind: 'story_object',
          label: 'Pesan Cilok & Telur Gulung Hangat Mang Dedi',
          sublabel: 'Trotoar Jl. Kenangan Barat · Bumbu Kacang, Sosis & Cilor Sore',
          position: [-28.8, 0, -12.6],
          onInteract: () => {
            sfxEngine.playFryingSizzle();
            playerRuntime.cilokFryTimer = 4.5;
            store.openCulinarySpot('cilok_kenangan');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_city_bike_share',
          kind: 'story_object',
          label: 'Cek Stasiun Sepeda Sewa Kota ("Sepeda Senja")',
          sublabel: 'Plaza Menara Nusantara · 4/4 Unit Siap Gowes · Rp 3.000 / 30 Mnt',
          position: [19.8, 0, -13.0],
          onInteract: () => {
            sfxEngine.playBikeShareBell();
            playerRuntime.bikeShareRingTimer = 3.8;
            if (!store.flags.includes('checked_city_bike_share')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['checked_city_bike_share'],
                journalEntry: {
                  id: 'je_city_bike_share',
                  title: 'Stasiun Sepeda Sewa di Depan Menara Nusantara',
                  body: 'Tepat di pelataran Menara Nusantara kini berdiri deretan sepeda sewa kota bertanda "Sepeda Senja". Rasanya menyenangkan melihat kota yang dulu serba terburu-buru mulai memberi ruang bagi langkah dan kayuhan yang lebih pelan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_city_bike_share, 'fw_city_bike_share');
            }
            store.showToast('Kring-kring! Stasiun Sepeda Senja: 4/4 unit aktif (Rp 3.000/30 mnt). Sepeda kota pribadi Damar juga siap digowes di tepi Danau Senja!');
          },
        },
        3.2,
      );

      consider(
        {
          id: 'activity_pak_karto_watch',
          kind: 'story_object',
          label: 'Cek & Setel Jam Tangan di Lapak Pak Karto',
          sublabel: 'Halaman Stasiun Senja · Reparasi & Ganti Baterai Sejak 1994',
          position: [70.4, 0, 12.6],
          onInteract: () => {
            sfxEngine.playWatchTickChime();
            playerRuntime.watchRepairTimer = 4.4;
            if (!store.flags.includes('visited_pak_karto_watch')) {
              store.applyEffect({
                kejujuranDiri: 2,
                kehadiranKeluarga: 1,
                setFlags: ['visited_pak_karto_watch'],
                journalEntry: {
                  id: 'je_pak_karto_watch',
                  title: 'Detak Tenang di Lapak Jam Tangan Pak Karto',
                  body: 'Di halaman selatan Stasiun Senja, Pak Karto menunduk sabar di bawah lampu meja sorot memeriksa roda gigi jam tangan tua. Beliau tersenyum berkata, "Jam yang terlalu cepat bikin orang terburu-buru, Mas—yang penting detaknya pas sama langkah pulang."',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pak_karto_watch, 'fw_pak_karto_watch');
            }
            store.showToast('Tik-tok... ting! Pak Karto membersihkan kaca jam tanganmu: "Mesinnya sehat, Mas Damar—jangan lupa sisakan waktu buat orang di rumah ya."');
          },
        },
        3.0,
      );

      consider(
        {
          id: 'activity_pedal_duck_boats',
          kind: 'story_object',
          label: 'Lihat & Goyangkan Perahu Bebek Kayuh Tambat',
          sublabel: 'Dermaga Selatan Danau Senja · Angsa Putih & Bebek Kuning',
          position: [-92.8, 0, -11.9],
          onInteract: () => {
            sfxEngine.playPedalBoatSplash();
            playerRuntime.pedalBoatWaveTimer = 5.0;
            if (!store.flags.includes('visited_pedal_duck_boats')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_pedal_duck_boats'],
                journalEntry: {
                  id: 'je_pedal_duck_boats',
                  title: 'Perahu Bebek Kayuh di Dermaga Selatan Danau Senja',
                  body: 'Dua perahu bebek kayuh tertambat tenang di dermaga kayu tepi Danau Senja—satu angsa putih dan satu bebek kuning ceria. Melihat kincir kayuhnya memercikkan air danau membuat sore ini terasa seperti hari libur yang lama dinanti.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_pedal_duck_boats, 'fw_pedal_duck_boats');
            }
            store.showToast('Byur—byur! Kincir perahu bebek kayuh berputar pelan menciptakan riak jernih di tepi Danau Senja!');
          },
        },
        3.0,
      );

      consider(
        {
          id: 'culinary_bandrek_udin',
          kind: 'story_object',
          label: 'Pesan Bandrek & Bajigur Hangat Abah Udin',
          sublabel: 'Tepi Jl. Cempaka Utara · Jahe Merah Susu, Bajigur & Rebusan',
          position: [-9.8, 0, -35.2],
          onInteract: () => {
            sfxEngine.playWarmPourChime();
            playerRuntime.bandrekSteamTimer = 4.5;
            store.openCulinarySpot('bandrek_cempaka');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_park_hanging_lights',
          kind: 'story_object',
          label: 'Nyalakan Kilau Gelombang Lampu Taman Gantung',
          sublabel: 'Alun-Alun Taman Kota · 24 Bohlam Hangat Senja & Malam',
          position: [-85.4, 0, 10.6],
          onInteract: () => {
            sfxEngine.playFairyLightsChime();
            playerRuntime.parkLightsPulseTimer = 6.5;
            if (!store.flags.includes('lit_park_hanging_lights')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['lit_park_hanging_lights'],
                journalEntry: {
                  id: 'je_park_hanging_lights',
                  title: 'Kilau Lampu Gantung di Alun-Alun Taman Kota',
                  body: 'Di tengah Taman Kota, dua puluh empat bohlam kuning hangat menggantung bersilang di antara empat tiang besi tempa. Begitu menyala bergelombang menjelang malam, taman ini terasa seperti halaman rumah kedua bagi seluruh warga.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_park_hanging_lights, 'fw_park_hanging_lights');
            }
            store.showToast('Deretan lampu taman gantung berkilau keemasan bergelombang hangat menerangi Alun-Alun Taman Kota!');
          },
        },
        2.4,
      );

      consider(
        {
          id: 'sit_park_lights_bench',
          kind: 'story_object',
          label: 'Duduk Santai di Bawah Lampu Taman Gantung',
          sublabel: 'Alun-Alun Taman Kota · Momen Tenang',
          position: [-85.4, 0, 12.8],
          onInteract: () => {
            sfxEngine.play('interact');
            playerRuntime.sitState = {
              active: true,
              label: 'Alun-Alun Lampu Gantung Taman Kota',
              seatPos: [-85.4, 0.14, 12.0],
              lookAt: [-85.4, 2.4, 4.0],
              standPos: [-85.4, 0, 13.05],
              seatYaw: Math.PI,
            };
            store.setSitting(true);
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_park_hanging_lights, 'fw_bench_park_lights');
            }
            store.showToast('Duduk santai di bawah hangatnya deretan lampu gantung Taman Kota... (WASD/E berdiri)');
          },
        },
        2.0,
      );

      consider(
        {
          id: 'activity_ibu_tati_veggie',
          kind: 'story_object',
          label: 'Belanja Sayur Segar & Tempe di Gerobak Ibu Tati',
          sublabel: 'Gang Perumahan Melati · Bayam, Wortel, Tahu & Tempe Pagi',
          position: [43.2, 0, 52.0],
          onInteract: () => {
            sfxEngine.playMarketScaleClink();
            playerRuntime.veggieScaleTimer = 3.8;
            const baskets = [
              'Ibu Tati menimbang bayam segar, jagung manis & tempe daun: "Pas buat sayur bening hangat di rumah, Mas Damar!"',
              'Ibu Tati membungkus wortel oranye, tomat & tahu putih: "Nadia pasti senang Mas, bahan sop kesukaan Kira lengkap semua!"',
              'Ibu Tati tersenyum ramah: "Kangkung sama cabai merahnya baru petik subuh tadi, Mas—harganya tetap ramah tetangga!"',
            ];
            const msg = baskets[playerRuntime.veggiePurchaseStep % baskets.length];
            playerRuntime.veggiePurchaseStep += 1;
            if (!store.flags.includes('shopped_ibu_tati_veggie')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['shopped_ibu_tati_veggie'],
                journalEntry: {
                  id: 'je_ibu_tati_veggie',
                  title: 'Belanja Pagi di Gerobak Sayur Ibu Tati',
                  body: 'Di tepi Gang Perumahan Melati, aku mampir menimbang seikat bayam segar, wortel, dan tempe daun di gerobak Ibu Tati. Ternyata hal sederhana seperti membantu menyiapkan bahan dapur pulang ke rumah bisa membuat hari terasa begitu penuh.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_ibu_tati_veggie, 'fw_ibu_tati_veggie');
            }
            store.showToast(msg);
          },
        },
        3.0,
      );

      consider(
        {
          id: 'activity_sari_tailor',
          kind: 'story_object',
          label: 'Mampir Kios Penjahit & Permak "Sari Jahit"',
          sublabel: 'Tepi Jl. Melati Timur · Jahit Rapi, Permak Celana & Seragam',
          position: [42.2, 0, 41.0],
          onInteract: () => {
            sfxEngine.playSewingMachineWhir();
            playerRuntime.sewingMachineTimer = 4.6;
            if (!store.flags.includes('visited_sari_tailor')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_sari_tailor'],
                journalEntry: {
                  id: 'je_sari_tailor',
                  title: 'Derit Halus Mesin Jahit di Kios "Sari Jahit"',
                  body: 'Di deretan kios Jl. Melati Timur, Ibu Sari merapikan kancing kemeja kerja dan keliman seragam Kira dengan telaten. Mesin jahit hitam klasiknya berderit tenang—mengingatkan bahwa banyak hal yang robek masih selalu bisa dirapikan kembali.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_sari_tailor, 'fw_sari_tailor');
            }
            store.showToast('Trrrrr—krik! Ibu Sari tersenyum menyerahkan lipatan rapi: "Kancing kemeja & keliman baju Kira sudah beres, Mas Damar!"');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_rail_crossing_post',
          kind: 'story_object',
          label: 'Sapa Pak Maman & Cek Sinyal Pelintasan KA (JPL 04)',
          sublabel: 'Sisi Selatan Rel Stasiun Senja · Palang & Lampu Silang KRL',
          position: [84.4, 0, 19.2],
          onInteract: () => {
            sfxEngine.playRailCrossingBell();
            playerRuntime.railCrossingBellTimer = 5.2;
            const distRail = Math.round(Math.abs(playerRuntime.trainZ - 18));
            const krlInfo =
              playerRuntime.trainPhase === 'boarding'
                ? 'KRL sedang berhenti naik-turun penumpang di Peron Stasiun Senja.'
                : playerRuntime.trainPhase === 'approaching'
                  ? `KRL sedang mendekat (±${distRail} m lagi)! Lampu silang merah & palang aktif.`
                  : playerRuntime.trainPhase === 'departing'
                    ? `KRL baru saja melintas meninggalkan stasiun (±${distRail} m).`
                    : `Jalur rel terpantau aman (KRL terdekat ±${distRail} m).`;
            if (!store.flags.includes('visited_rail_crossing_post')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['visited_rail_crossing_post'],
                journalEntry: {
                  id: 'je_rail_crossing_post',
                  title: 'Penjaga Setia di Pos JPL 04 Stasiun Senja',
                  body: 'Di sisi selatan rel Stasiun Senja, Pak Maman berjaga penuh disiplin memastikan lampu silang merah dan palang pintu bekerja tepat waktu setiap KRL melintas. Dering "teng-teng-teng" pelintasan kereta selalu membawa nuansa sore kota yang tak tergantikan.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_rail_crossing_post, 'fw_rail_crossing_post');
            }
            store.showToast(`Teng-teng-teng! Pak Maman (JPL 04): "${krlInfo}"`);
          },
        },
        3.2,
      );

      consider(
        {
          id: 'activity_apotek_sehat_melati',
          kind: 'story_object',
          label: 'Mampir Apotek 24 Jam "Sehat Melati" (Mbak Nita)',
          sublabel: 'Seberang Jl. Melati Barat · Vitamin, Balsem Hangat & P3K Keluarga',
          position: [-30.2, 0, 41.0],
          onInteract: () => {
            sfxEngine.playPharmacyChime();
            playerRuntime.pharmacyPulseTimer = 4.2;
            if (!store.flags.includes('visited_apotek_sehat_melati')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_apotek_sehat_melati'],
                journalEntry: {
                  id: 'je_apotek_sehat_melati',
                  title: 'Lampu Hijau Tenang Apotek 24 Jam Sehat Melati',
                  body: 'Di seberang Jl. Melati Barat, palang hijau LED Apotek Sehat Melati selalu menyala tenang sepanjang malam. Aku mampir membeli vitamin C, minyak kayu putih, dan plester bergambar lucu untuk persediaan kotak P3K rumah.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_apotek_sehat_melati, 'fw_apotek_sehat_melati');
            }
            store.showToast('Mbak Nita menyerahkan kantong obat ramah: "Vitamin C, minyak kayu putih & plester lucu buat Kira sudah siap—sehat selalu ya, Mas!"');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_esteler_daud',
          kind: 'story_object',
          label: 'Pesan Es Teler Alpukat & Kelapa Muda Bang Daud',
          sublabel: 'Trotoar Jl. Kenangan · Alpukat Mentega, Nangka Harum & Es Serut',
          position: [-17.6, 0, -12.0],
          onInteract: () => {
            sfxEngine.playIceShaverCrunch();
            playerRuntime.estelerShaveTimer = 4.5;
            store.openCulinarySpot('esteler_plaza');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_toy_donation_box',
          kind: 'story_object',
          label: 'Buka Kotak Donasi Buku & Mainan Anak ("Berbagi Senja")',
          sublabel: 'Tepi Taman Bermain · Ambil Seperlunya, Titip Seikhlasnya',
          position: [-79.6, 0, 24.6],
          onInteract: () => {
            sfxEngine.playToyBoxChime();
            playerRuntime.toyBoxOpenTimer = 4.4;
            const moments = [
              'Pintu kotak terbuka hangat—kamu menitipkan buku dongeng bergambar agar bisa dibaca anak-anak lain di Taman Bermain!',
              'Di rak bawah tersusun rapi balok kayu warna-warni, truk mainan kuning & boneka kelinci kecil yang terawat bersih.',
              'Ada secarik catatan kecil di dalam kotak: "Terima kasih sudah berbagi cerita hari ini, semoga harimu ikut ceria!"',
            ];
            const msg = moments[playerRuntime.toyShareStep % moments.length];
            playerRuntime.toyShareStep += 1;
            if (!store.flags.includes('visited_toy_donation_box')) {
              store.applyEffect({
                kehadiranKeluarga: 2,
                kejujuranDiri: 1,
                setFlags: ['visited_toy_donation_box'],
                journalEntry: {
                  id: 'je_toy_donation_box',
                  title: 'Kotak Kecil Berbagi Buku & Mainan di Taman Bermain',
                  body: 'Di pinggir Taman Bermain Anak berdiri kotak kaca mungil bertuliskan "Ambil Seperlunya, Titip Seikhlasnya". Menitipkan buku cerita lama milik Kira di sana membuat kami merasa bagian dari kehangatan kota ini.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_toy_donation_box, 'fw_toy_donation_box');
            }
            store.showToast(msg);
          },
        },
        2.8,
      );

      consider(
        {
          id: 'activity_konter_berkah',
          kind: 'story_object',
          label: 'Isi Token Listrik & Paket Data di "Konter Berkah"',
          sublabel: 'Tepi Jl. Kenangan Timur · Pulsa, Kuota & Token PLN Mas Fajar',
          position: [49.6, 0, 11.6],
          onInteract: () => {
            sfxEngine.playKonterBeepChime();
            playerRuntime.konterPulseTimer = 4.2;
            if (!store.flags.includes('visited_konter_berkah')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_konter_berkah'],
                journalEntry: {
                  id: 'je_konter_berkah',
                  title: 'Isi Token Listrik & Kuota di Konter Berkah',
                  body: 'Di pinggir Jl. Kenangan Timur, aku mampir ke Konter Berkah milik Mas Fajar mengisi token listrik rumah Jl. Melati dan kuota ponsel Nadia. Lampu LED kios kecil yang terang itu selalu menjadi penolong paling cepat bagi warga sekitar.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_konter_berkah, 'fw_konter_berkah');
            }
            store.showToast('Bip-bip-tring! Mas Fajar menyerahkan struk: "Token PLN rumah Jl. Melati & kuota Mbak Nadia sudah masuk semua, Mas Damar!"');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_jamu_yem',
          kind: 'story_object',
          label: 'Pesan Jamu Beras Kencur & Kunyit Asam Mbak Yem',
          sublabel: 'Sepeda Jamu Tradisional · Tepi Sungai & Taman Kota',
          position: [-60.5, 0, 20.4],
          onInteract: () => {
            sfxEngine.playJamuPourChime();
            playerRuntime.jamuPourTimer = 4.2;
            store.openCulinarySpot('jamu_sepeda');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_lake_bird_scope',
          kind: 'story_object',
          label: 'Amati Burung & Baca Papan Flora Fauna Danau Senja',
          sublabel: 'Tepi Timur Laut Danau Senja · Teropong Pengamat Burung',
          position: [-67.6, 0, -32.8],
          onInteract: () => {
            sfxEngine.playBirdScopeChime();
            playerRuntime.birdScopeTimer = 5.0;
            const sightings = [
              'Lewat lensa teropong terlihat seekor burung kuntul putih anggun bertengger tenang di antara kelopak teratai Danau Senja!',
              'Teropong mengarah ke bawah dermaga kayu—kawanan ikan koi keemasan berenang memantulkan cahaya langit di permukaan air.',
              'Dua ekor capung biru melintas lincah di atas kawanan bebek air yang berenang riang menuju pesisir selatan danau.',
            ];
            const msg = sightings[playerRuntime.birdSpotStep % sightings.length];
            playerRuntime.birdSpotStep += 1;
            if (!store.flags.includes('used_lake_bird_scope')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['used_lake_bird_scope'],
                journalEntry: {
                  id: 'je_lake_bird_scope',
                  title: 'Pengamatan Burung & Flora Fauna di Tepi Danau Senja',
                  body: 'Dari teropong kuningan di tepi timur laut Danau Senja, aku melihat burung kuntul putih, bunga teratai, dan capung biru hidup berdampingan tepat di jantung kota. Sungguh tenang rasanya ketika alam masih diberi tempat untuk bernapas.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_lake_bird_scope, 'fw_lake_bird_scope');
            }
            store.showToast(msg);
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_pempek_ani',
          kind: 'story_object',
          label: 'Pesan Pempek Palembang & Es Kacang Merah Cek Ani',
          sublabel: 'Promenade Sungai Utara · Kapal Selam, Lenjer & Kuah Cuko',
          position: [-38.0, 0, -30.8],
          onInteract: () => {
            sfxEngine.playPempekFryChime();
            playerRuntime.pempekFryTimer = 4.5;
            store.openCulinarySpot('pempek_sungai');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_dapur_manis_bakery',
          kind: 'story_object',
          label: 'Beli Kue & Jajanan Tradisional di "Dapur Manis"',
          sublabel: 'Jl. Melati Timur · Bolu Kukus, Kue Lapis, Brownies & Risoles Ibu Dewi',
          position: [49.2, 0, 41.0],
          onInteract: () => {
            sfxEngine.playBakeryShopBell();
            playerRuntime.bakeryBellTimer = 4.4;
            const boxes = [
              'Ibu Dewi membungkus sekotak bolu kukus mekar & kue lapis pelangi: "Masih hangat baru turun dari kukusan, Mas Damar!"',
              'Ibu Dewi menyerahkan kotak risoles mayo & pastel renyah: "Pas banget buat teman teh sore bareng Mbak Nadia di teras!"',
              'Ibu Dewi tersenyum ramah: "Brownies cokelat lembut ini favoritnya Kira lho, Mas—salam manis buat di rumah ya!"',
            ];
            const msg = boxes[playerRuntime.bakeryBoxStep % boxes.length];
            playerRuntime.bakeryBoxStep += 1;
            if (!store.flags.includes('visited_dapur_manis_bakery')) {
              store.applyEffect({
                kehadiranKeluarga: 1,
                kejujuranDiri: 1,
                setFlags: ['visited_dapur_manis_bakery'],
                journalEntry: {
                  id: 'je_dapur_manis_bakery',
                  title: 'Aroma Bolu Kukus Hangat di Toko Kue Dapur Manis',
                  body: 'Di ujung deretan kios Jl. Melati Timur, lonceng kecil Toko Kue "Dapur Manis" menyambut dengan aroma bolu kukus pandan dan brownies hangat. Membawa pulang sekotak jajanan kecil selalu menjadi cara paling manis untuk menyapa rumah.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_dapur_manis_bakery, 'fw_dapur_manis_bakery');
            }
            store.showToast(msg);
          },
        },
        2.9,
      );

      consider(
        {
          id: 'activity_river_gauge_post',
          kind: 'story_object',
          label: 'Cek Papan Pengukur Tinggi Air & Sensor Cuaca Sungai',
          sublabel: 'Tepi Timur Laut Jembatan · Telemetri TMA & Anemometer',
          position: [-37.8, 0, -11.0],
          onInteract: () => {
            sfxEngine.playHydroSensorBeep();
            playerRuntime.hydroSensorTimer = 4.6;
            const isRainNow = store.timeOfDay === 'rain_dusk';
            if (!store.flags.includes('checked_river_gauge_post')) {
              store.applyEffect({
                kejujuranDiri: 1,
                setFlags: ['checked_river_gauge_post'],
                journalEntry: {
                  id: 'je_river_gauge_post',
                  title: 'Pos Pantau Tinggi Air & Cuaca Sungai Kota',
                  body: 'Di samping Jembatan Tepi Sungai berdiri papan penggaris tinggi muka air dan tiang sensor angin bertenaga surya. Kesiagaan kecil seperti ini membuat warga kota tetap merasa aman saat hujan senja turun.',
                  chapter: store.chapter,
                },
              });
            }
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_river_gauge_post, 'fw_river_gauge_post');
            }
            store.showToast(
              isRainNow
                ? 'Sensor Sungai Kota: TMA 112 cm (Waspada Hujan · Debit Mengalir Lancar · Angin 18 km/jam).'
                : 'Sensor Sungai Kota: TMA 68 cm (Status Aman Normal · Air Tenang · Angin 7 km/jam).',
            );
          },
        },
        2.9,
      );

      consider(
        {
          id: 'culinary_serabi_karso',
          kind: 'story_object',
          label: 'Pesan Serabi Solo & Kue Ape Hangat Mbah Karso',
          sublabel: 'Trotoar Jl. Cempaka Utara · Tungku Tanah Liat Sejak 1998',
          position: [10.0, 0, -34.2],
          onInteract: () => {
            sfxEngine.playSerabiSizzle();
            playerRuntime.serabiSizzleTimer = 4.5;
            store.openCulinarySpot('serabi_solo');
          },
        },
        2.9,
      );

      consider(
        {
          id: 'story_plaza_history_monument',
          kind: 'story_object',
          label: 'Amati Foto Lama 1996 — "Kota Senja Tempo Dulu"',
          sublabel: 'Adegan Cerita · Plaza Menara Nusantara (Kenangan Almarhum Bapak)',
          position: [28.2, 0, -13.3],
          onInteract: () => {
            sfxEngine.playMemoryChime();
            playerRuntime.historyGlowTimer = 6.0;
            playerRuntime.activeSpeakerPos = [28.2, 1.5, -14.8];
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_kota_tempo_dulu, 'fw_kota_tempo_dulu');
            }
            store.startDialogue('story_kota_tempo_dulu');
          },
        },
        3.0,
      );

      consider(
        {
          id: 'story_lake_butterfly_garden',
          kind: 'story_object',
          label: 'Duduk Hening di Sudut Taman Bunga Kupu-Kupu',
          sublabel: 'Adegan Cerita · Tepi Utara Danau Senja (Refleksi Nadia & Kira)',
          position: [-66.2, 0, -39.6],
          onInteract: () => {
            sfxEngine.playMemoryChime();
            playerRuntime.butterflyBurstTimer = 7.0;
            playerRuntime.activeSpeakerPos = [-66.2, 1.2, -41.8];
            if (store.isFamilyWalkActive) {
              store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_butterfly_garden, 'fw_butterfly_garden');
            }
            store.startDialogue('story_butterfly_garden');
          },
        },
        3.0,
      );

    consider(
      {
        id: 'portal_up',
        kind: 'portal',
        label: 'Naik Lift ke Rooftop Pemandangan Kota',
        sublabel: 'Menara Nusantara',
        position: ELEVATOR_PORTALS.lobbyPos,
        onInteract: () => {
          sfxEngine.play('door');
          setRuntimePosition([20.8, 22, -23.0], 0);
          store.showToast('Tiba di Rooftop Menara Nusantara');
        },
      },
      3.0,
    );

    consider(
      {
        id: 'activity_office_pantry',
        kind: 'story_object',
        label: 'Seduh Kopi / Teh / Cokelat di Pantry Lobi',
        sublabel: 'Menara Nusantara · Pantry Karyawan Gratis',
        position: [37.8, 0.08, -23.65],
        onInteract: () => {
          store.openCulinarySpot('office_pantry');
        },
      },
      2.5,
    );

    consider(
      {
        id: 'sit_office_window_lounge',
        kind: 'story_object',
        label: 'Duduk Merenung di Kursi Jendela Lobi',
        sublabel: 'Menara Nusantara · Menghadap Jl. Kenangan',
        position: [31.2, 0.08, -21.15],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Kursi Jendela Lobi Menara Nusantara',
            seatPos: [31.2, 0.16, -20.2],
            lookAt: [31.2, 1.4, -4.0],
            standPos: [31.2, 0.08, -21.2],
            seatYaw: 0,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_office_lounge, 'fw_office_lounge');
          }
          store.showToast('Duduk sejenak di tepi jendela lobi memandangi hiruk-pikuk Jl. Kenangan... (WASD/E berdiri)');
        },
      },
      2.2,
    );

    consider(
      {
        id: 'inspect_office_info_screen',
        kind: 'story_object',
        label: 'Periksa Layar Info Cuaca & Kota Digital',
        sublabel: 'Lobi Menara Nusantara · Info Cuaca & Lalu Lintas',
        position: [23.5, 0.08, -24.55],
        onInteract: () => {
          sfxEngine.play('switch');
          store.openPhone('weather');
          store.showToast('Menampilkan info cuaca & suasana kota dari Layar Digital Menara Nusantara.');
        },
      },
      2.3,
    );

    consider(
      {
        id: 'portal_down',
        kind: 'portal',
        label: 'Turun Lift ke Lobi Menara Nusantara',
        sublabel: 'Kembali ke Jalan Kota',
        position: ELEVATOR_PORTALS.rooftopPos,
        onInteract: () => {
          sfxEngine.play('door');
          setRuntimePosition([20.5, 0.08, -21.5], 0);
          store.showToast('Kembali ke Lobi Menara Nusantara');
        },
      },
      3.2,
    );

    // Bonus Upgrade: Duduk Reflektif di Bangku Taman Danau & Bangku Rooftop
    consider(
      {
        id: 'sit_park_bench',
        kind: 'story_object',
        label: 'Duduk Sebentar Menatap Danau Senja',
        sublabel: 'Momen Tenang',
        position: [-78.0, 0, -9.2],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Taman Kota & Danau Senja',
            seatPos: [-78.0, 0.14, -8.5],
            lookAt: [-84.0, 1.2, -28.0],
            standPos: [-78.0, 0, -9.6],
            seatYaw: Math.PI,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bench, 'fw_bench_park');
          }
          store.showToast('Damar duduk beristirahat sejenak... (Tekan WASD atau E untuk berdiri)');
        },
      },
      2.6,
    );

    consider(
      {
        id: 'sit_rooftop_bench',
        kind: 'story_object',
        label: 'Duduk Menikmati Panorama Kota',
        sublabel: 'Rooftop Menara Nusantara',
        position: [28.5, 22, -23.7],
        onInteract: () => {
          sfxEngine.play('interact');
          playerRuntime.sitState = {
            active: true,
            label: 'Rooftop Menara Nusantara',
            seatPos: [28.5, 22.14, -23.0],
            lookAt: [-12.0, 6.0, 48.0],
            standPos: [28.5, 22, -24.2],
            seatYaw: 0,
          };
          store.setSitting(true);
          if (store.isFamilyWalkActive) {
            store.playFamilyBanter(EVENT_FAMILY_BANTERS.activity_bench, 'fw_bench_roof');
          }
          store.showToast('Menatap lampu kota dari ketinggian... (Tekan WASD atau E untuk berdiri)');
        },
      },
      2.8,
    );

    consider(
      {
        id: 'activity_rooftop_telescope',
        kind: 'story_object',
        label: 'Intip Pemandangan Kota Lewat Teropong Koin (8× Zoom)',
        sublabel: 'Rooftop Menara Nusantara · Rumah Melati, Jembatan & Danau',
        position: [34.4, 22, -22.35],
        onInteract: () => {
          store.setTelescopeOpen(true);
        },
      },
      2.2,
    );

    consider(
      {
        id: 'activity_rt_bulletin_board',
        kind: 'story_object',
        label: 'Baca Papan Pengumuman Warga RT 04 Melati',
        sublabel: 'Perumahan Melati · Kerja Bakti, Posyandu & Info Warga',
        position: [8.8, 0, 51.3],
        onInteract: () => {
          store.setRtBoardOpen(true);
        },
      },
      2.6,
    );

    consider(
      {
        id: 'flashback_home_dining_table',
        kind: 'story_object',
        label: 'Renungkan Meja Makan Pukul 22.15 (Kilas Balik)',
        sublabel: store.flags.includes('flashback_dinner_done')
          ? 'Kilas Balik Sinematik · Sudah Dikenang'
          : 'Kilas Balik Memori · Enam Bulan Lalu',
        position: [-17.2, 0.08, 69.0],
        onInteract: () => {
          store.startDialogue('flashback_meja_makan_sunyi');
        },
      },
      2.2,
    );

    consider(
      {
        id: 'nadia_table_letter',
        kind: 'story_object',
        label: 'Baca Surat Tulisan Tangan Nadia di Meja Makan',
        sublabel: store.flags.includes('read_nadia_table_letter')
          ? 'Surat Pribadi untuk Damar · Tersimpan di Jurnal'
          : 'Amplop Krem di Meja Makan · Berubah Sesuai Pilihanmu',
        position: [-15.7, 0.08, 68.1],
        onInteract: () => {
          store.setNadiaLetterOpen(true);
        },
      },
      2.2,
    );

    if (store.mainStepId === 'ch2_2_hujan_jembatan') {
      consider(
        {
          id: 'story_bridge_call',
          kind: 'story_object',
          label: 'Angkat Telepon dari Nadia',
          sublabel: 'Cerita Utama — Bab 2',
          position: [-48, 0.24, 0.5],
          onInteract: () => store.startDialogue('ch2_jembatan_telepon'),
        },
        4.5,
      );
    }
    if (store.mainStepId === 'ch3_1_rooftop_malam') {
      consider(
        {
          id: 'story_rooftop_view',
          kind: 'story_object',
          label: 'Menatap Lampu Kota dari Tepi Rooftop',
          sublabel: 'Cerita Utama — Bab 3',
          position: [28.5, 22, -22.5],
          onInteract: () => store.startDialogue('ch3_rooftop_reflection'),
        },
        4.5,
      );
    }

    if (store.sideQuests.sq_pak_darman?.status === 'active' && store.sideQuests.sq_pak_darman.stage === 1) {
      consider(
        {
          id: 'sq_darman_bm',
          kind: 'story_object',
          label: 'Ambil Pembatas Buku Pak Darman',
          sublabel: 'Misi Sampingan',
          position: [-69.5, 0, -14.5],
          onInteract: () => store.startDialogue('sq_pak_darman_item'),
        },
        3.2,
      );
    }
    if (store.sideQuests.sq_bu_wati?.status === 'active' && store.sideQuests.sq_bu_wati.stage === 1) {
      consider(
        {
          id: 'sq_wati_sw',
          kind: 'story_object',
          label: 'Periksa Kotak Sakelar Lampu Teras',
          sublabel: 'Misi Sampingan',
          position: [21.5, 0, 62.5],
          onInteract: () => store.startDialogue('sq_bu_wati_switch'),
        },
        3.2,
      );
    }
    if (store.sideQuests.sq_pak_budi?.status === 'active' && store.sideQuests.sq_pak_budi.stage === 1) {
      consider(
        {
          id: 'sq_budi_sw',
          kind: 'story_object',
          label: 'Nyalakan Sakelar Lampu Dermaga Senja',
          sublabel: 'Misi Sampingan · Pak Budi',
          position: [-70.2, 0.12, -26.4],
          onInteract: () => store.startDialogue('sq_pak_budi_switch'),
        },
        3.2,
      );
    }

    for (const npc of NPC_PLACEMENTS) {
      const profile = CHARACTERS[npc.id];
      const resolved = resolveNpcInteraction(npc.id);
      const livePos: [number, number, number] =
        store.isFamilyWalkActive && (npc.id === 'nadia' || npc.id === 'kira')
          ? playerRuntime.companions[npc.id].pos
          : npc.pos;
      // Saat Nadia & Kira ikut jalan bersama, hanya jadikan prioritas [E] bila ada cerita utama / hadiah,
      // agar tidak menghalangi tombol [E] untuk NPC warga, lift, atau fragmen memori di depan Damar!
      if (
        store.isFamilyWalkActive &&
        (npc.id === 'nadia' || npc.id === 'kira') &&
        resolved.highlight === null
      ) {
        continue;
      }
      consider(
        {
          id: `npc_${npc.id}`,
          kind: 'npc',
          label: `Bicara dengan ${profile.name}`,
          sublabel: resolved.sublabel,
          position: livePos,
          onInteract: () => {
            playerRuntime.activeSpeakerPos = [...livePos];
            playerRuntime.activeSpeakerId = npc.id;
            store.startDialogue(resolved.dialogueId);
          },
        },
        3.6,
      );
    }

    for (const ee of EASTER_EGGS) {
      const found = store.discoveredEasterEggs.includes(ee.id);
      consider(
        {
          id: ee.id,
          kind: 'easter_egg',
          label: ee.promptLabel,
          sublabel: found ? 'Kenangan Tersimpan' : 'Fragmen Memori',
          position: ee.position,
          onInteract: () => {
            playerRuntime.activeSpeakerPos = [...ee.position];
            store.discoverEasterEgg(ee.id);
          },
        },
        2.9,
      );
    }

    playerRuntime.nearestInteractable = best;
    if (best) {
      const foundTarget = best as InteractableTarget;
      store.setInteractPrompt({ label: foundTarget.label, sublabel: foundTarget.sublabel });
    } else {
      store.setInteractPrompt(null);
    }
  });

  return (
    <group>
      {NPC_PLACEMENTS.map((npc) => {
        const res = resolveNpcInteraction(npc.id);
        const isComp = isFamilyWalkActive && (npc.id === 'nadia' || npc.id === 'kira');
        return (
          <NpcFigure
            key={npc.id}
            npc={npc}
            highlight={res.highlight}
            isFamilyCompanion={isComp}
            timeOfDay={timeOfDay}
            nadiaOutfitId={npc.id === 'nadia' ? nadiaOutfitId : undefined}
            kiraOutfitId={npc.id === 'kira' ? kiraOutfitId : undefined}
          />
        );
      })}

      {EASTER_EGGS.map((ee) => {
        const found = discoveredEasterEggs.includes(ee.id);
        const yBase = ee.position[1];
        return (
          <group key={ee.id} position={[ee.position[0], yBase, ee.position[2]]}>
            {ee.visualType !== 'cat' && (
              <mesh position={[0, 0.55, 0]} castShadow>
                {ee.visualType === 'guitar' ? (
                  <boxGeometry args={[0.32, 0.95, 0.14]} />
                ) : ee.visualType === 'radio' ? (
                  <boxGeometry args={[0.45, 0.3, 0.24]} />
                ) : ee.visualType === 'bike' ? (
                  <torusGeometry args={[0.35, 0.06, 8, 16]} />
                ) : (
                  <boxGeometry args={[0.34, 0.08, 0.26]} />
                )}
                <meshStandardMaterial
                  color={found ? '#b5a897' : '#f3cf8a'}
                  emissive={found ? '#000000' : '#e0a24a'}
                  emissiveIntensity={found ? 0 : 0.65}
                  roughness={0.65}
                />
              </mesh>
            )}
            {!found && (
              <mesh position={[0, 1.05, 0]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial color="#ffe4a3" transparent opacity={0.9} />
              </mesh>
            )}
          </group>
        );
      })}

      {sideQuests.sq_pak_darman?.status === 'active' && sideQuests.sq_pak_darman.stage === 1 && (
        <mesh position={[-69.5, 0.55, -14.5]}>
          <boxGeometry args={[0.25, 0.06, 0.45]} />
          <meshStandardMaterial color="#f5e6c8" emissive="#f0bd65" emissiveIntensity={1.6} />
        </mesh>
      )}

      {sideQuests.sq_bu_wati?.status === 'active' && sideQuests.sq_bu_wati.stage === 1 && (
        <mesh position={[21.5, 1.35, 62.5]}>
          <boxGeometry args={[0.32, 0.42, 0.18]} />
          <meshStandardMaterial color="#d9d5ce" emissive="#8ec5a3" emissiveIntensity={1.6} />
        </mesh>
      )}

      {sideQuests.sq_pak_budi?.status === 'active' && sideQuests.sq_pak_budi.stage === 1 && (
        <mesh position={[-70.2, 1.05, -26.4]}>
          <boxGeometry args={[0.3, 0.38, 0.2]} />
          <meshStandardMaterial color="#e6dec8" emissive="#f5c258" emissiveIntensity={1.8} />
        </mesh>
      )}

      {/* Visual Hadiah Keluarga di Kota sebelum Diambil */}
      {!flags.includes('has_gift_kira') && (
        <mesh position={[22.2, 0.85, 16.0]}>
          <boxGeometry args={[0.28, 0.24, 0.22]} />
          <meshStandardMaterial color="#f48ca3" emissive="#f48ca3" emissiveIntensity={1.2} />
        </mesh>
      )}
      {!flags.includes('has_gift_nadia') && (
        <mesh position={[-65.8, 0.52, -11.5]}>
          <dodecahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#fffaf0" emissive="#ffe599" emissiveIntensity={1.3} />
        </mesh>
      )}

      <mesh position={[ELEVATOR_PORTALS.lobbyPos[0], 1.4, ELEVATOR_PORTALS.lobbyPos[2] - 2.6]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#f6d17a" />
      </mesh>
      <mesh position={[ELEVATOR_PORTALS.rooftopPos[0], 23.4, ELEVATOR_PORTALS.rooftopPos[2] - 0.8]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#f6d17a" />
      </mesh>

      {/* Penanda Interaktif Halus di Interior Baru (Sudut Kira, Nada Lama & Kios Harmoni) */}
      <mesh position={[-19.8, 1.08, 72.3]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#ffe599" />
      </mesh>
      <mesh position={[-25.6, 1.72, -25.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffb85c" />
      </mesh>
      <mesh position={[24.5, 2.38, 26.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#93e5ff" />
      </mesh>
      <mesh position={[-73.2, 0.72, -26.2]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#ff9f5a" />
      </mesh>
      <mesh position={[-87.5, 1.35, 22.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f6c644" />
      </mesh>
      <mesh position={[-25.85, 1.65, 69.25]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#f3cf8a" />
      </mesh>
      <mesh position={[-13.85, 1.78, 68.9]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#93c5fd" />
      </mesh>
      <mesh position={[24.1, 2.35, 10.8]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-76.2, 1.52, -29.75]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>
      <mesh position={[-72.5, 2.78, -8.2]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#6ee7b7" />
      </mesh>
      <mesh position={[-67.2, 1.85, 20.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffb84d" />
      </mesh>
      <mesh position={[75.8, 1.52, -2.1]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[-25.0, 1.58, 60.85]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#86efac" />
      </mesh>
      <mesh position={[-16.9, 1.48, 53.72]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[-84.5, 1.55, -9.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#86efac" />
      </mesh>
      <mesh position={[-18.95, 1.66, -28.55]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[28.9, 2.24, 16.95]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>
      <mesh position={[-14.1, 1.08, 17.6]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial color="#fda4af" />
      </mesh>
      <mesh position={[-26.8, 1.85, 47.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[18.8, 2.08, 41.4]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[34.3, 1.05, 46.55]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-19.9, 0.56, 70.35]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-24.45, 1.32, 72.05]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#93c5fd" />
      </mesh>
      <mesh position={[13.4, 1.88, 29.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
      <mesh position={[25.78, 2.08, 55.62]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[42.8, 1.85, -13.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#86efac" />
      </mesh>
      <mesh position={[13.6, 2.55, -14.42]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[34.4, 23.74, -21.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[8.8, 2.52, 52.4]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#86efac" />
      </mesh>
      <mesh position={[-79.0, 1.88, 12.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[16.2, 1.32, 58.35]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-23.6, 1.35, 11.4]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-16.2, 1.56, 11.2]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-18.35, 2.38, 61.55]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-37.8, 1.88, 12.6]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[75.8, 1.25, -7.6]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
      <mesh position={[11.2, 1.38, 21.8]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-11.2, 1.88, 31.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
      <mesh position={[33.2, 1.18, 58.6]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>
      <mesh position={[44.05, 1.65, 11.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[32.55, 1.55, 17.85]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[76.5, 1.85, 19.15]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
      <mesh position={[-86.4, 2.35, 17.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fb7185" />
      </mesh>
      <mesh position={[-9.8, 1.88, -15.4]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
      <mesh position={[-64.2, 1.45, -27.6]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-74.2, 1.92, 16.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[-58.4, 1.56, -13.2]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-57.8, 0.92, -15.4]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>
      <mesh position={[-63.2, 2.74, 14.4]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-5.6, 1.85, 53.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh position={[12.0, 1.96, 14.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
      <mesh position={[-10.8, 1.56, 51.3]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#f87171" />
      </mesh>
      <mesh position={[13.52, 2.38, 36.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[-67.2, 2.25, 34.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
      <mesh position={[25.2, 2.15, 40.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-81.8, 1.56, -12.35]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-89.8, 1.95, -8.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh position={[-22.2, 1.92, 38.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[44.5, 2.25, 61.55]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
      <mesh position={[32.8, 1.92, -14.0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[31.6, 2.38, 11.4]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>
      <mesh position={[-36.6, 1.92, -22.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
      <mesh position={[49.2, 1.95, -13.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[33.8, 2.15, 40.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#c084fc" />
      </mesh>
      <mesh position={[-28.8, 1.92, -14.0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fb923c" />
      </mesh>
      <mesh position={[19.8, 2.05, -14.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#2dd4bf" />
      </mesh>
      <mesh position={[71.5, 1.98, 12.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[-92.8, 1.85, -12.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-11.2, 1.92, -35.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[-85.4, 1.65, 9.6]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#fde047" />
      </mesh>
      <mesh position={[43.2, 1.92, 53.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
      <mesh position={[42.2, 2.15, 40.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#2dd4bf" />
      </mesh>
      <mesh position={[86.2, 2.25, 19.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f87171" />
      </mesh>
      <mesh position={[-30.2, 2.25, 40.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh position={[-17.6, 1.92, -13.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#84cc16" />
      </mesh>
      <mesh position={[-79.6, 1.85, 25.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh position={[49.6, 2.22, 12.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-59.2, 1.92, 20.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[-68.8, 1.84, -32.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>
      <mesh position={[-36.6, 1.92, -30.8]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      <mesh position={[49.2, 2.15, 40.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh position={[-38.85, 2.38, -11.0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[11.4, 1.92, -34.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#86efac" />
      </mesh>
      <mesh position={[28.2, 2.36, -14.8]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[-66.2, 1.65, -40.35]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#f472b6" />
      </mesh>
      <mesh position={[-17.2, 1.15, 69.0]}>
        <sphereGeometry args={[0.085, 10, 10]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[-22.2, 0.36, 66.8]}>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshBasicMaterial color="#fde68a" />
      </mesh>
      {/* Amplop krem bersegel merah surat tulisan tangan Nadia di Meja Makan Jl. Melati */}
      <group position={[-15.7, 0.86, 68.1]} rotation={[0, -0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.018, 0.18]} />
          <meshStandardMaterial color="#f8efe0" emissive="#f6d17a" emissiveIntensity={0.28} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.008, 12]} />
          <meshStandardMaterial color="#b34438" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshBasicMaterial color="#fda4af" />
        </mesh>
      </group>

      {mainStepId === 'ch2_2_hujan_jembatan' && (
        <mesh position={[-48, 0.32, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 1.15, 24]} />
          <meshBasicMaterial color="#f6d17a" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      )}
      {mainStepId === 'ch3_1_rooftop_malam' && (
        <mesh position={[28.5, 22.08, -22.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.25, 24]} />
          <meshBasicMaterial color="#f6d17a" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};
