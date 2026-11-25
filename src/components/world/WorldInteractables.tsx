import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CHARACTERS } from '../../data/characters';
import { KIRA_OUTFIT_BY_ID, KiraOutfitId, NADIA_OUTFIT_BY_ID, NadiaOutfitId } from '../../data/damarOutfits';
import { EASTER_EGGS } from '../../data/easterEggs';
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

  const companionUmbrella = isFamilyCompanion && timeOfDay === 'rain_dusk' && !compIndoors;
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

    // === AI PENGIKUT KELUARGA (NADIA & KIRA BERJALAN BERSAMA DAMAR) ===
    if (isFamilyCompanion && (npc.id === 'nadia' || npc.id === 'kira')) {
      const yaw = playerRuntime.rotationY;
      const fwdX = Math.sin(yaw);
      const fwdZ = Math.cos(yaw);
      const leftX = Math.cos(yaw);
      const leftZ = -Math.sin(yaw);
      const sideSign = npc.id === 'nadia' ? 1 : -1; // Nadia kiri, Kira kanan

      let desiredX: number;
      let desiredZ: number;

      if (store.isSitting && playerRuntime.sitState) {
        const sitYaw = playerRuntime.sitState.seatYaw;
        const sLeftX = Math.cos(sitYaw);
        const sLeftZ = -Math.sin(sitYaw);
        const sFwdX = Math.sin(sitYaw);
        const sFwdZ = Math.cos(sitYaw);
        desiredX = px + sLeftX * sideSign * 1.15 - sFwdX * 0.15;
        desiredZ = pz + sLeftZ * sideSign * 1.15 - sFwdZ * 0.15;
      } else if (store.isPhotoMode) {
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

      // Sinkron instan saat naik/turun lift Rooftop, memanggil dari jauh, atau tertinggal jauh
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
          } else if (store.isSitting && playerRuntime.sitState) {
            idleYaw = Math.atan2(
              playerRuntime.sitState.lookAt[0] - cx,
              playerRuntime.sitState.lookAt[2] - cz,
            );
          } else if (distToDamar < 3.4) {
            idleYaw = Math.atan2(px - cx, pz - cz);
          }
          let diff = idleYaw - currentYawRef.current;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          currentYawRef.current += diff * Math.min(1, dt * 5.5);
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

    // 1. Posisi root + bob langkah berjalan / napas alami
    if (rootRef.current) {
      const walkBob = isWalkingCompanion
        ? Math.abs(Math.sin(strideRef.current)) * (isChild ? 0.075 : 0.048)
        : 0;
      rootRef.current.position.set(myX, myY + walkBob, myZ);

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
        !isWalkingCompanion && isChild && isNear
          ? Math.abs(Math.sin(t * 5.2)) * 0.045
          : Math.sin(t * 2.1 + npc.pos[0]) * 0.012;
      torsoRef.current.position.y = 0.92 + bounce;
      torsoRef.current.rotation.x = isWalkingCompanion
        ? 0.06
        : isTalkingNow
          ? Math.sin(t * 3.5) * 0.045
          : 0;
    }

    // 2. Animasi kaki berjalan
    const legSwing = isWalkingCompanion ? Math.sin(strideRef.current) * (isChild ? 0.62 : 0.52) : 0;
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, legSwing, dt * 12);
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -legSwing, dt * 12);
    }

    // 3. Kontak mata — kepala menoleh ke kamera saat Mode Foto atau ke Damar saat dekat!
    if (headRef.current) {
      if (isFamilyCompanion && store.isPhotoMode) {
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

    // 4. Lengan: payung bening di tangan kiri saat hujan, lambaian ramah saat [F]/Mode Foto, & gestur bicara!
    if (rightArmRef.current && leftArmRef.current) {
      const holdUmb = companionUmbrellaRef.current;
      const shouldWave =
        damarWaving ||
        (isFamilyCompanion && store.isPhotoMode) ||
        (!isFamilyCompanion &&
          isNear &&
          !store.activeDialogue &&
          (isChild ||
            npc.id === 'bima' ||
            npc.id === 'bu_wati' ||
            npc.id === 'mbak_lilis' ||
            npc.id === 'pak_slamet' ||
            npc.id === 'bang_ari'));

      if (shouldWave) {
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
  }, [mainStepId, sideQuests, flags]);

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
      2.4,
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
