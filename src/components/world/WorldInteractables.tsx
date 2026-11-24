import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CHARACTERS } from '../../data/characters';
import { EASTER_EGGS } from '../../data/easterEggs';
import { ELEVATOR_PORTALS } from '../../data/worldLocations';
import { playerRuntime, setRuntimePosition } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { CharacterId, InteractableTarget } from '../../types/game';

interface NpcPlacement {
  id: CharacterId;
  pos: [number, number, number];
  rot: number;
}

const NPC_PLACEMENTS: NpcPlacement[] = [
  { id: 'nadia', pos: [-16.2, 0.08, 66.2], rot: -0.9 },
  { id: 'kira', pos: [-18.7, 0.08, 65.0], rot: 0.4 },
  { id: 'bima', pos: [-20.0, 0.08, 21.0], rot: Math.PI },
  { id: 'pak_hendra', pos: [27.0, 0.08, -22.5], rot: 0 },
  { id: 'pak_darman', pos: [76.2, 0.1, -4.0], rot: -Math.PI / 2 },
  { id: 'nenek_sari', pos: [-68.0, 0, -18.0], rot: 0.6 },
  { id: 'mas_raka', pos: [-48.0, 0.24, -5.0], rot: 0 },
  { id: 'mas_bagas', pos: [-20.0, 0, -17.5], rot: 0 },
  { id: 'mbak_lilis', pos: [24.0, 0, 15.8], rot: Math.PI },
  { id: 'bu_wati', pos: [24.0, 0, 61.8], rot: Math.PI },
];

const NpcFigure: React.FC<{
  id: CharacterId;
  position: [number, number, number];
  rotation: number;
  highlight?: 'main' | 'side' | null;
}> = ({ id, position, rotation, highlight }) => {
  const profile = CHARACTERS[id];
  const scale = profile.appearance.height / 1.74;
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      ringRef.current.position.y = 2.08 * scale + Math.sin(t * 2.5) * 0.07;
      ringRef.current.rotation.y = t * 1.1;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <group scale={scale}>
        {/* Kaki */}
        <mesh position={[-0.12, 0.42, 0]} castShadow>
          <boxGeometry args={[0.17, 0.82, 0.19]} />
          <meshStandardMaterial color={profile.appearance.pantsColor} roughness={0.88} />
        </mesh>
        <mesh position={[0.12, 0.42, 0]} castShadow>
          <boxGeometry args={[0.17, 0.82, 0.19]} />
          <meshStandardMaterial color={profile.appearance.pantsColor} roughness={0.88} />
        </mesh>
        {/* Tubuh */}
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[0.46, 0.66, 0.26]} />
          <meshStandardMaterial color={profile.appearance.shirtColor} roughness={0.82} />
        </mesh>
        {/* Lengan */}
        <mesh position={[-0.3, 1.08, 0]} castShadow>
          <boxGeometry args={[0.13, 0.54, 0.15]} />
          <meshStandardMaterial color={profile.appearance.shirtColor} roughness={0.82} />
        </mesh>
        <mesh position={[0.3, 1.08, 0]} castShadow>
          <boxGeometry args={[0.13, 0.54, 0.15]} />
          <meshStandardMaterial color={profile.appearance.shirtColor} roughness={0.82} />
        </mesh>
        {/* Kepala & Rambut */}
        <mesh position={[0, 1.62, 0]} castShadow>
          <sphereGeometry args={[0.19, 12, 12]} />
          <meshStandardMaterial color={profile.appearance.skinColor} roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.71, -0.02]}>
          <sphereGeometry args={[0.195, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={profile.appearance.hairColor} roughness={0.9} />
        </mesh>
      </group>

      {/* Penanda halus di atas kepala jika NPC punya cerita utama atau misi sampingan */}
      {highlight && (
        <mesh ref={ringRef} position={[0, 2.08 * scale, 0]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial
            color={highlight === 'main' ? '#f6d17a' : '#8ec5a3'}
            emissive={highlight === 'main' ? '#e7a84a' : '#5ca378'}
            emissiveIntensity={1.6}
          />
        </mesh>
      )}
    </group>
  );
};

export const WorldInteractables: React.FC = () => {
  const mainStepId = useGameStore((s) => s.mainStepId);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const flags = useGameStore((s) => s.flags);

  // Tentukan dialog yang tepat saat berbicara dengan setiap NPC
  const resolveNpcInteraction = useMemo(() => {
    return (npcId: CharacterId): { dialogueId: string; highlight: 'main' | 'side' | null; sublabel: string } => {
      const store = useGameStore.getState();

      // 1. Prioritas Cerita Utama
      if (npcId === 'nadia' || npcId === 'kira') {
        if (store.mainStepId === 'ch1_1_sarapan') {
          return { dialogueId: 'ch1_sarapan_main', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.mainStepId === 'ch3_2_kembali_ke_rumah') {
          return { dialogueId: 'ch3_meja_makan_finale', highlight: 'main', sublabel: 'Momen Penentu' };
        }
      }
      if (npcId === 'bima') {
        if (store.mainStepId === 'ch1_2_kedai_bima') {
          return { dialogueId: 'ch1_bima_main', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        if (store.mainStepId === 'ch2_3_kedai_hujan') {
          return { dialogueId: 'ch2_bima_hujan', highlight: 'main', sublabel: 'Cerita Utama' };
        }
        // Helper misi sampingan
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

      // 2. Misi Sampingan Warga Kota
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

  // Deteksi interaksi terdekat setiap frame (ringan)
  useFrame(() => {
    const store = useGameStore.getState();
    if (store.screen !== 'playing' || store.activeDialogue || store.isMapJournalOpen || store.isPauseOpen) {
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

    // 1. Lift Menara Nusantara <-> Rooftop
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

    // 2. Momen Cerita Utama khusus Lokasi (Jembatan Bab 2 & Rooftop Bab 3)
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

    // 3. Objek Misi Sampingan
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

    // 4. NPC
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
          onInteract: () => store.startDialogue(resolved.dialogueId),
        },
        3.3,
      );
    }

    // 5. 15 Easter Egg Kenangan
    for (const ee of EASTER_EGGS) {
      const found = store.discoveredEasterEggs.includes(ee.id);
      consider(
        {
          id: ee.id,
          kind: 'easter_egg',
          label: ee.promptLabel,
          sublabel: found ? 'Kenangan Tersimpan' : 'Fragmen Memori',
          position: ee.position,
          onInteract: () => store.discoverEasterEgg(ee.id),
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
      {/* NPC 3D */}
      {NPC_PLACEMENTS.map((npc) => {
        const res = resolveNpcInteraction(npc.id);
        return (
          <NpcFigure
            key={npc.id}
            id={npc.id}
            position={npc.pos}
            rotation={npc.rot}
            highlight={res.highlight}
          />
        );
      })}

      {/* 15 Objek Visual Easter Egg di Seluruh Kota */}
      {EASTER_EGGS.map((ee) => {
        const found = discoveredEasterEggs.includes(ee.id);
        const yBase = ee.position[1];
        return (
          <group key={ee.id} position={[ee.position[0], yBase, ee.position[2]]}>
            {/* Visual objek minimalis yang selaras dengan dunia nyata */}
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
                  emissiveIntensity={found ? 0 : 0.45}
                  roughness={0.65}
                />
              </mesh>
            )}
            {/* Pendar halus partikel memori jika belum ditemukan */}
            {!found && (
              <mesh position={[0, 1.05, 0]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshBasicMaterial color="#ffe4a3" transparent opacity={0.85} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Objek Misi Sampingan: Pembatas Buku Pak Darman */}
      {sideQuests.sq_pak_darman?.status === 'active' && sideQuests.sq_pak_darman.stage === 1 && (
        <mesh position={[-69.5, 0.55, -14.5]}>
          <boxGeometry args={[0.25, 0.06, 0.45]} />
          <meshStandardMaterial color="#f5e6c8" emissive="#f0bd65" emissiveIntensity={1.1} />
        </mesh>
      )}

      {/* Objek Misi Sampingan: Kotak Sakelar Bu Wati */}
      {sideQuests.sq_bu_wati?.status === 'active' && sideQuests.sq_bu_wati.stage === 1 && (
        <mesh position={[21.5, 1.35, 62.5]}>
          <boxGeometry args={[0.32, 0.42, 0.18]} />
          <meshStandardMaterial color="#d9d5ce" emissive="#8ec5a3" emissiveIntensity={1.2} />
        </mesh>
      )}

      {/* Titik Interaksi Lift Rooftop (Lobi & Rooftop) */}
      <mesh position={[ELEVATOR_PORTALS.lobbyPos[0], 1.4, ELEVATOR_PORTALS.lobbyPos[2] - 2.6]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#f6d17a" />
      </mesh>
      <mesh position={[ELEVATOR_PORTALS.rooftopPos[0], 23.4, ELEVATOR_PORTALS.rooftopPos[2] - 0.8]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#f6d17a" />
      </mesh>

      {/* Lingkaran Panduan Cerita Jembatan & Rooftop */}
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
