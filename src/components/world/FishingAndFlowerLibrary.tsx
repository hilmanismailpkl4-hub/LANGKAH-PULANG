import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';

interface FishingAndFlowerLibraryProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createBookBoxSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#2d4f3c';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#e7c27d';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 112);
  ctx.fillStyle = '#fff5de';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('TAMAN BACA MINI', 256, 62);
  ctx.fillStyle = '#f5cf82';
  ctx.font = '600 20px sans-serif';
  ctx.fillText('AMBIL · BACA · KEMBALIKAN', 256, 98);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 1. Memancing Santai di Ujung Dermaga Danau Senja (joran, tali 3D, pelampung & riak tarikan ikan)
 * 2. Taman Bunga Berwarna-Warni berkupu-kupu & Kotak Buku Jalanan ("Taman Baca Mini") di Taman Kota
 */
export const FishingAndFlowerLibrary: React.FC<FishingAndFlowerLibraryProps> = ({
  timeOfDay,
  settings,
}) => {
  const isFishing = useGameStore((s) => s.isFishing);
  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';
  const signTex = useMemo(() => createBookBoxSignTexture(), []);

  const activeRodRef = useRef<THREE.Group>(null);
  const bobberRef = useRef<THREE.Group>(null);
  const lineMeshRef = useRef<THREE.Mesh>(null);
  const biteRippleRef = useRef<THREE.Mesh>(null);
  const butterflyRefs = useRef<(THREE.Group | null)[]>([]);
  const wingLRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wingRRefs = useRef<(THREE.Mesh | null)[]>([]);

  const tmpStart = useMemo(() => new THREE.Vector3(), []);
  const tmpEnd = useMemo(() => new THREE.Vector3(), []);
  const tmpMid = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);
  const tmpUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const store = useGameStore.getState();

    // === 1. LOGIKA & ANIMASI MEMANCING SANTAI DI DANAU SENJA ===
    if (playerRuntime.fishingTugAnim > 0) {
      playerRuntime.fishingTugAnim = Math.max(0, playerRuntime.fishingTugAnim - dt * 1.8);
    }

    if (store.isFishing) {
      if (playerRuntime.fishingPhase === 'waiting') {
        playerRuntime.fishingWaitTimer -= dt;
        if (playerRuntime.fishingWaitTimer <= 0) {
          playerRuntime.fishingPhase = 'bite';
          playerRuntime.fishingBiteTimer = 3.8;
          store.setFishingBiteReady(true);
        }
      } else if (playerRuntime.fishingPhase === 'bite') {
        playerRuntime.fishingBiteTimer -= dt;
        if (playerRuntime.fishingBiteTimer <= 0) {
          playerRuntime.fishingPhase = 'waiting';
          playerRuntime.fishingWaitTimer = 3.2 + Math.random() * 2.5;
          store.setFishingBiteReady(false);
        }
      }

      const biting = playerRuntime.fishingPhase === 'bite';
      const [px, py, pz] = playerRuntime.position;
      const rodYaw = Math.atan2(-2.5, -4.2);

      // Posisi pangkal joran di tangan kanan Damar
      if (activeRodRef.current) {
        activeRodRef.current.visible = true;
        activeRodRef.current.position.set(px - 0.16, py + 1.24, pz - 0.22);
        activeRodRef.current.rotation.set(
          0.32 - playerRuntime.fishingTugAnim * 0.52 + (biting ? Math.sin(t * 14) * 0.05 : Math.sin(t * 1.8) * 0.015),
          rodYaw,
          0,
        );
      }

      // Titik ujung joran di udara
      const tipX = px - 1.55;
      const tipY = py + 2.55 + playerRuntime.fishingTugAnim * 0.85 - (biting ? Math.abs(Math.sin(t * 14)) * 0.15 : 0);
      const tipZ = pz - 2.35;

      // Pelampung merah-putih di air danau
      const bobX = -78.8 + Math.sin(t * 0.7) * 0.18;
      const bobY = biting
        ? -0.22 + Math.sin(t * 18) * 0.09
        : -0.11 + Math.sin(t * 2.4) * 0.025;
      const bobZ = -33.4 + Math.cos(t * 0.6) * 0.16;

      if (bobberRef.current) {
        bobberRef.current.visible = true;
        bobberRef.current.position.set(bobX, bobY, bobZ);
      }

      // Tali pancing 3D dari ujung joran ke pelampung
      if (lineMeshRef.current) {
        lineMeshRef.current.visible = true;
        tmpStart.set(tipX, tipY, tipZ);
        tmpEnd.set(bobX, bobY + 0.08, bobZ);
        tmpMid.addVectors(tmpStart, tmpEnd).multiplyScalar(0.5);
        tmpDir.subVectors(tmpEnd, tmpStart);
        const len = Math.max(0.1, tmpDir.length());
        tmpDir.divideScalar(len);
        tmpQuat.setFromUnitVectors(tmpUp, tmpDir);
        lineMeshRef.current.position.copy(tmpMid);
        lineMeshRef.current.quaternion.copy(tmpQuat);
        lineMeshRef.current.scale.set(1, len, 1);
      }

      if (biteRippleRef.current) {
        biteRippleRef.current.visible = biting;
        if (biting) {
          const p = ((t * 1.6) % 1 + 1) % 1;
          const s = 0.4 + p * 2.8;
          biteRippleRef.current.position.set(bobX, -0.1, bobZ);
          biteRippleRef.current.scale.set(s, s, 1);
          const mat = biteRippleRef.current.material as THREE.MeshBasicMaterial;
          mat.opacity = (1 - p) * 0.72;
        }
      }
    } else {
      if (activeRodRef.current) activeRodRef.current.visible = false;
      if (bobberRef.current) bobberRef.current.visible = false;
      if (lineMeshRef.current) lineMeshRef.current.visible = false;
      if (biteRippleRef.current) biteRippleRef.current.visible = false;
    }

    // === 2. ANIMASI 4 KUPU-KUPU DI TAMAN BUNGA & KOTAK BUKU ===
    if (!isRain) {
      for (let i = 0; i < 4; i++) {
        const bf = butterflyRefs.current[i];
        if (!bf) continue;
        const ang = t * (0.85 + i * 0.16) + i * 1.6;
        const sideX = i < 2 ? -74.0 : -71.0;
        bf.position.set(
          sideX + Math.cos(ang) * 0.85,
          0.92 + Math.sin(t * 2.8 + i) * 0.28,
          -8.2 + Math.sin(ang * 1.2) * 0.75,
        );
        bf.rotation.y = -ang;
        const flap = Math.sin(t * 17 + i * 2) * 0.75;
        if (wingLRefs.current[i]) wingLRefs.current[i]!.rotation.z = flap;
        if (wingRRefs.current[i]) wingRRefs.current[i]!.rotation.z = -flap;
      }
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. PERALATAN MEMANCING DI UJUNG DERMAGA DANAU SENJA               */}
      {/* ================================================================= */}
      {/* Joran bersandar + ember kecil saat tidak sedang dipakai */}
      <group position={[-76.2, 0.12, -29.82]}>
        {!isFishing && (
          <mesh position={[0, 1.05, 0.08]} rotation={[0.18, 0, -0.12]} castShadow>
            <cylinderGeometry args={[0.014, 0.032, 2.35, 8]} />
            <meshStandardMaterial color="#8c5f34" roughness={0.75} />
          </mesh>
        )}
        {/* Ember Pancing Biru Kecil */}
        <mesh position={[0.38, 0.18, 0.18]} castShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.34, 12]} />
          <meshStandardMaterial color="#3b82c4" roughness={0.48} />
        </mesh>
      </group>

      {/* Joran Pancing Aktif di Tangan Damar */}
      <group ref={activeRodRef} visible={false}>
        <mesh position={[0, 1.32, 0]} rotation={[0.42, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.03, 2.8, 8]} />
          <meshStandardMaterial color="#966638" roughness={0.72} />
        </mesh>
        {/* Reel Pancing Perak */}
        <mesh position={[0, 0.25, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.07, 10]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.28} />
        </mesh>
      </group>

      {/* Tali Pancing 3D & Pelampung Merah-Putih */}
      <mesh ref={lineMeshRef} visible={false}>
        <cylinderGeometry args={[0.005, 0.005, 1, 6]} />
        <meshBasicMaterial color="#eef6ff" transparent opacity={0.72} />
      </mesh>
      <group ref={bobberRef} visible={false}>
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.35} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.058, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      </group>
      <mesh ref={biteRippleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.18, 0.25, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} depthWrite={false} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. KOTAK BUKU JALANAN ("TAMAN BACA MINI") & TAMAN BUNGA           */}
      {/* ================================================================= */}
      <group position={[-72.5, 0, -8.2]}>
        {/* Tiang Kayu Penyangga Kotak Buku */}
        <mesh position={[0, 0.56, 0]} castShadow>
          <boxGeometry args={[0.16, 1.12, 0.16]} />
          <meshStandardMaterial color="#5e3e26" roughness={0.85} />
        </mesh>
        {/* Rumah Buku Kayu Hangat */}
        <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.78, 0.62]} />
          <meshStandardMaterial color="#875b3a" roughness={0.78} />
        </mesh>
        {/* Rak Isi 6 Buku Mini Warna-Warni di Balik Kaca */}
        {[-0.28, -0.17, -0.06, 0.05, 0.16, 0.27].map((bx, bi) => (
          <mesh key={`lb-${bi}`} position={[bx, 1.46, 0.16]}>
            <boxGeometry args={[0.085, 0.34, 0.24]} />
            <meshStandardMaterial
              color={['#364d6b', '#b85038', '#3c7a67', '#d99e46', '#7c4e82', '#d96b6b'][bi]}
              roughness={0.7}
            />
          </mesh>
        ))}
        {/* Pintu Kaca Bening Depan */}
        <mesh position={[0, 1.48, 0.32]}>
          <planeGeometry args={[0.78, 0.62]} />
          <meshStandardMaterial color="#e0f2ff" transparent opacity={0.32} roughness={0.1} metalness={0.2} />
        </mesh>
        {/* Atap Segitiga Hijau Pinus */}
        <mesh position={[0, 2.08, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.82, 0.55, 4]} />
          <meshStandardMaterial color="#2f5944" roughness={0.8} />
        </mesh>
        {/* Papan Nama Kecil "TAMAN BACA MINI" */}
        <mesh position={[0, 2.48, 0.04]}>
          <boxGeometry args={[1.05, 0.28, 0.06]} />
          <meshStandardMaterial color="#3c2a1e" />
        </mesh>
        <mesh position={[0, 2.48, 0.08]}>
          <planeGeometry args={[0.98, 0.24]} />
          <meshStandardMaterial
            map={signTex}
            emissiveMap={signTex}
            emissive="#ffebba"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.1}
          />
        </mesh>
        {/* Lampu Kuning Kecil Hangat di Dalam Kotak Buku */}
        <mesh position={[0, 1.78, 0.18]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial
            color="#fff0bd"
            emissive="#ffba52"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.35}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <pointLight position={[0, 1.65, 0.45]} color="#ffcb7a" intensity={7} distance={9} decay={1.8} />
        )}

        {/* 2 Petak Taman Bunga Warna-Warni Kiri & Kanan Kotak Buku */}
        {[-1.55, 1.55].map((fx, fi) => (
          <group key={`flw-${fi}`} position={[fx, 0, 0]}>
            {/* Bingkai Batu Taman Rendah */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
              <boxGeometry args={[1.85, 0.2, 1.45]} />
              <meshStandardMaterial color="#7d7870" roughness={0.92} />
            </mesh>
            <mesh position={[0, 0.21, 0]} receiveShadow>
              <boxGeometry args={[1.62, 0.06, 1.22]} />
              <meshStandardMaterial color="#4a3829" roughness={0.95} />
            </mesh>
            {/* Rumpun Daun & Kelopak Warna-Warni */}
            {[
              [-0.48, 0.38, -0.28, '#e8688c'],
              [0.0, 0.42, -0.22, '#fffaf0'],
              [0.48, 0.38, -0.28, '#f5c249'],
              [-0.42, 0.4, 0.26, '#a78bfa'],
              [0.12, 0.44, 0.28, '#f28482'],
              [0.52, 0.38, 0.22, '#fffaf0'],
            ].map(([bx, by, bz, col], bi) => (
              <group key={`bl-${bi}`} position={[bx as number, by as number, bz as number]}>
                <mesh castShadow>
                  <dodecahedronGeometry args={[0.24, 0]} />
                  <meshStandardMaterial color="#3c7344" roughness={0.86} />
                </mesh>
                <mesh position={[0, 0.15, 0]}>
                  <dodecahedronGeometry args={[0.14, 0]} />
                  <meshStandardMaterial color={col as string} roughness={0.68} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* 4 Kupu-Kupu Kecil Terbang Lembut di Atas Taman Bunga (saat tidak hujan) */}
      {!isRain &&
        [0, 1, 2, 3].map((i) => (
          <group
            key={`bf-${i}`}
            ref={(el) => {
              butterflyRefs.current[i] = el;
            }}
            position={[-72.5, 1.0, -8.2]}
          >
            <mesh
              ref={(el) => {
                wingLRefs.current[i] = el;
              }}
              position={[-0.04, 0, 0]}
            >
              <boxGeometry args={[0.075, 0.008, 0.06]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#fde047' : '#fff7ed'}
                emissive={i % 2 === 0 ? '#facc15' : '#fde68a'}
                emissiveIntensity={0.4}
              />
            </mesh>
            <mesh
              ref={(el) => {
                wingRRefs.current[i] = el;
              }}
              position={[0.04, 0, 0]}
            >
              <boxGeometry args={[0.075, 0.008, 0.06]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#fde047' : '#fff7ed'}
                emissive={i % 2 === 0 ? '#facc15' : '#fde68a'}
                emissiveIntensity={0.4}
              />
            </mesh>
          </group>
        ))}
    </group>
  );
};
