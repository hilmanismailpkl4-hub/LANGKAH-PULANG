import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CHARACTERS } from '../../data/characters';
import { EASTER_EGGS } from '../../data/easterEggs';
import { ELEVATOR_PORTALS } from '../../data/worldLocations';
import { playerRuntime, setRuntimePosition } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { CharacterId, InteractableTarget } from '../../types/game';
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
}> = ({ npc, highlight }) => {
  const profile = CHARACTERS[npc.id];
  const scale = profile.appearance.height / 1.74;
  const isChild = npc.id === 'kira';

  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const bubbleRef = useRef<THREE.Sprite>(null);

  const currentYawRef = useRef(npc.rot);
  const bubbleOpacityRef = useRef(0);

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

    const dx = px - npc.pos[0];
    const dz = pz - npc.pos[2];
    const dy = Math.abs(py - npc.pos[1]);
    const dist = dy > 4 ? 99 : Math.hypot(dx, dz);

    const isTalkingNow =
      Boolean(store.activeDialogue) &&
      (playerRuntime.activeSpeakerId === npc.id ||
        (store.activeDialogue &&
          store.activeNodeId &&
          store.activeDialogue.nodes[store.activeNodeId]?.speaker === npc.id));

    const damarWaving = playerRuntime.damarWaveTimer > 0 && dist < 8.0;
    const isNear = dist < 5.6;
    const isVeryNear = dist < 4.2 || isTalkingNow || damarWaving;

    // 1. Napas alami & gestur tubuh
    if (torsoRef.current) {
      const bounce = isChild && isNear ? Math.abs(Math.sin(t * 5.2)) * 0.045 : Math.sin(t * 2.1 + npc.pos[0]) * 0.012;
      torsoRef.current.position.y = 0.92 + bounce;
      torsoRef.current.rotation.x = isTalkingNow ? Math.sin(t * 3.5) * 0.045 : 0;
    }

    // 2. Badan menoleh halus ke arah Damar saat dekat / berbicara
    if (rootRef.current) {
      const desiredYaw = isVeryNear ? Math.atan2(dx, dz) : npc.rot;
      let diff = desiredYaw - currentYawRef.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentYawRef.current += diff * Math.min(1, dt * 5.5);
      rootRef.current.rotation.y = currentYawRef.current;
    }

    // 3. Kontak mata — kepala menoleh ke arah Damar dari jarak 7.5 meter!
    if (headRef.current) {
      if (dist < 7.5 || isTalkingNow) {
        const angleToPlayer = Math.atan2(dx, dz);
        let relHead = angleToPlayer - currentYawRef.current;
        while (relHead > Math.PI) relHead -= Math.PI * 2;
        while (relHead < -Math.PI) relHead += Math.PI * 2;
        const clamped = THREE.MathUtils.clamp(relHead, -0.75, 0.75);
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, clamped, dt * 7);
        headRef.current.rotation.x = isTalkingNow
          ? Math.sin(t * 4.2) * 0.08
          : isChild
            ? -0.18
            : 0;
      } else {
        const idleLook = Math.sin(t * 0.65 + npc.pos[2]) * 0.16;
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, idleLook, dt * 3);
        headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, dt * 4);
      }
    }

    // 4. Lengan melambai hangat saat disapa [F] atau didekati, dan gestur tangan saat bicara!
    if (rightArmRef.current && leftArmRef.current) {
      if (damarWaving || (isNear && !store.activeDialogue && (isChild || npc.id === 'bima' || npc.id === 'bu_wati' || npc.id === 'mbak_lilis'))) {
        // Angkat tangan kanan & lambaikan ramah!
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -2.35, dt * 8);
        rightArmRef.current.rotation.z = Math.sin(t * 10.5) * 0.28 + 0.32;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, dt * 6);
      } else if (isTalkingNow) {
        // Gestur percakapan realistis
        rightArmRef.current.rotation.x = -0.55 + Math.sin(t * 4.6) * 0.28;
        rightArmRef.current.rotation.z = 0.12 + Math.cos(t * 3.8) * 0.1;
        leftArmRef.current.rotation.x = -0.35 + Math.cos(t * 3.9) * 0.2;
      } else {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, dt * 6);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, dt * 6);
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, dt * 6);
      }
    }

    // 5. Penanda misi halus
    if (ringRef.current) {
      ringRef.current.position.y = 2.15 * scale + Math.sin(t * 2.5) * 0.06;
      ringRef.current.rotation.y = t * 1.1;
    }

    // 6. Balon sapaan WebGL muncul halus saat Damar mendekat (hilang saat dialog fullscreen terbuka)
    if (bubbleRef.current) {
      const showBubble = dist < 6.4 && !store.activeDialogue && store.screen === 'playing';
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
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
        isChild={isChild}
        isFemale={FEMALE_NPCS.includes(npc.id)}
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

  useFrame(() => {
    const store = useGameStore.getState();
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
      store.isRidingScooter ||
      store.isSitting
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
          sfxEngine.play('switch');
          playerRuntime.scooter.isRiding = true;
          playerRuntime.scooter.speed = 0;
          store.setRidingScooter(true);
          store.showToast('Naik motor skuter! Gunakan WASD untuk melaju, Spasi klakson, E untuk parkir.');
        },
      },
      2.6,
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

    // === 3. MINI-AKTIVITAS 2: MINUM KOPI HANGAT DI TERAS KAFE ===
    consider(
      {
        id: 'activity_coffee',
        kind: 'story_object',
        label: 'Duduk & Nikmati Kopi Hangat',
        sublabel: 'Mini-Aktivitas · Kedai Kopi Sudut',
        position: [-25.0, 0.08, 17.8],
        onInteract: () => {
          sfxEngine.play('coffee');
          playerRuntime.sitState = {
            active: true,
            label: 'Kedai Kopi Sudut',
            seatPos: [-25.0, 0.16, 18.45],
            lookAt: [-20.0, 1.4, 21.0],
            standPos: [-24.0, 0.08, 18.5],
            seatYaw: Math.PI,
            holdingCoffee: true,
          };
          store.setSitting(true);
          if (!store.flags.includes('enjoyed_bima_coffee')) {
            store.applyEffect({ kejujuranDiri: 1, setFlags: ['enjoyed_bima_coffee'] });
          }
          store.showToast('"Pahitnya pas... sepuluh menit tenang tanpa lihat jam tangan." (Tekan WASD/E berdiri)');
        },
      },
      2.4,
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
            store.showToast('"Ini buat kamu, Kira... semoga doa kecil kita tidak pernah tenggelam."');
          } else {
            store.showToast('Enam perahu kertas sudah mengapung damai di permukaan Danau Senja.');
          }
        },
      },
      2.5,
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

    for (const npc of NPC_PLACEMENTS) {
      const profile = CHARACTERS[npc.id];
      const resolved = resolveNpcInteraction(npc.id);
      consider(
        {
          id: `npc_${npc.id}`,
          kind: 'npc',
          label: `Bicara dengan ${profile.name}`,
          sublabel: resolved.sublabel,
          position: npc.pos,
          onInteract: () => {
            playerRuntime.activeSpeakerPos = [...npc.pos];
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
        return <NpcFigure key={npc.id} npc={npc} highlight={res.highlight} />;
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
