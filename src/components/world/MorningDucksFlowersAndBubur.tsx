import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface MorningDucksFlowersAndBuburProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const IBU_LELA_PROFILE: CharacterProfile = {
  id: 'bu_wati',
  name: 'Ibu Lela',
  role: 'Penjual Bunga Segar Tepi Taman',
  accentColor: '#f472b6',
  voice: { pitch: 1.06, rate: 0.98, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.61,
    shirtColor: '#9d4edd',
    pantsColor: '#2c2f3a',
    skinColor: '#d9ac89',
    hairColor: '#251d1a',
    accentProp: 'apron',
  },
};

const MANG_UJANG_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mang Ujang',
  role: 'Penjual Bubur Ayam Pagi Jl. Melati',
  accentColor: '#facc15',
  voice: { pitch: 0.94, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#fef3c7',
    pantsColor: '#27303f',
    skinColor: '#c99770',
    hairColor: '#24201e',
    accentProp: 'apron',
  },
};

interface DuckSpec {
  phase: number;
  rx: number;
  rz: number;
  speed: number;
  scale: number;
  bodyColor: string;
  headColor: string;
  wingColor: string;
  feedOffset: [number, number];
}

const LAKE_DUCKS: DuckSpec[] = [
  {
    phase: 0.0,
    rx: 3.4,
    rz: 2.1,
    speed: 0.34,
    scale: 1.08,
    bodyColor: '#f8fafc',
    headColor: '#f8fafc',
    wingColor: '#e2e8f0',
    feedOffset: [0, 0],
  },
  {
    phase: 1.25,
    rx: 3.8,
    rz: 2.4,
    speed: 0.31,
    scale: 1.04,
    bodyColor: '#d6c7b2',
    headColor: '#166534',
    wingColor: '#8d6e53',
    feedOffset: [-0.85, -0.35],
  },
  {
    phase: 2.5,
    rx: 2.8,
    rz: 1.75,
    speed: 0.38,
    scale: 0.82,
    bodyColor: '#fde047',
    headColor: '#facc15',
    wingColor: '#eab308',
    feedOffset: [0.78, -0.22],
  },
  {
    phase: 3.8,
    rx: 3.2,
    rz: 2.0,
    speed: 0.36,
    scale: 0.86,
    bodyColor: '#f5f0e1',
    headColor: '#f5f0e1',
    wingColor: '#d6cbb8',
    feedOffset: [-0.42, -0.82],
  },
  {
    phase: 5.1,
    rx: 2.5,
    rz: 1.55,
    speed: 0.4,
    scale: 0.78,
    bodyColor: '#fef08a',
    headColor: '#fde047',
    wingColor: '#d97706',
    feedOffset: [0.48, -0.78],
  },
];

function createDuckSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#3f2a1d';
  ctx.fillRect(0, 0, 384, 176);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 368, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BEBEK DANAU SENJA', 192, 58);

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Tabur Remah Roti · Tekan [E]', 192, 114);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createFlowerBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#831843');
  grad.addColorStop(0.5, '#be185d');
  grad.addColorStop(1, '#15803d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fff1f2';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KIOS BUNGA SEGAR', 320, 52);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('IBU LELA · TEPI JALAN TAMAN DANAU', 320, 96);

  ctx.fillStyle = '#831843';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('MELATI WANGI · MAWAR MERAH · KRISAN KUNING · BUKET KELUARGA', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createBuburBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#ca8a04');
  grad.addColorStop(0.5, '#eab308');
  grad.addColorStop(1, '#15803d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BUBUR AYAM PAGI', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('MANG UJANG · DEPAN KOMPLEKS JL. MELATI', 320, 96);

  ctx.fillStyle = '#713f12';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KUAH KUNING · AYAM SUWIR · CAKWE · SATE PUYUH · KERUPUK RENYAH', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 1 — Suasana Pagi & Danau Lebih Hidup:
 * 1. Kawanan 5 Bebek Danau Senja ([-83.2, -0.11, -18.2]) + Papan Beri Makan Remah Roti ([-81.8, 0, -12.35])
 * 2. Kios Bunga Segar Ibu Lela ([-89.8, 0, -8.8]) di Tepi Jalan Taman Danau
 * 3. Gerobak Bubur Ayam Pagi Mang Ujang ([-22.2, 0, 38.4]) di Seberang Jl. Melati No. 14
 */
export const MorningDucksFlowersAndBubur: React.FC<MorningDucksFlowersAndBuburProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const duckSignTex = useMemo(() => createDuckSignTexture(), []);
  const flowerBannerTex = useMemo(() => createFlowerBannerTexture(), []);
  const buburBannerTex = useMemo(() => createBuburBannerTexture(), []);

  useEffect(() => {
    return () => {
      duckSignTex.dispose();
      flowerBannerTex.dispose();
      buburBannerTex.dispose();
    };
  }, [duckSignTex, flowerBannerTex, buburBannerTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const duckRefs = useRef<(THREE.Group | null)[]>([]);
  const duckHeadRefs = useRef<(THREE.Group | null)[]>([]);
  const duckRippleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const duckPosRef = useRef<[number, number][]>(
    LAKE_DUCKS.map((d) => [-83.2 + Math.cos(d.phase) * d.rx, -18.2 + Math.sin(d.phase) * d.rz]),
  );
  const crumbGroupRef = useRef<THREE.Group>(null);

  const lelaHeadRef = useRef<THREE.Group>(null);
  const lelaRightArmRef = useRef<THREE.Group>(null);
  const ujangHeadRef = useRef<THREE.Group>(null);
  const ujangRightArmRef = useRef<THREE.Group>(null);
  const buburSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Kawanan 5 Bebek Berenang Melingkar / Mendekati Remah Roti di Danau Senja
    if (playerRuntime.duckFeedTimer > 0) {
      playerRuntime.duckFeedTimer = Math.max(0, playerRuntime.duckFeedTimer - dt);
    }
    if (!shouldSkipPerfFrame(-83.2, -18.2, 54)) {
      const feeding = playerRuntime.duckFeedTimer > 0;
      if (crumbGroupRef.current) {
        crumbGroupRef.current.visible = feeding;
        if (feeding) {
          crumbGroupRef.current.position.y = -0.115 + Math.sin(t * 3.2) * 0.012;
        }
      }

      for (let i = 0; i < LAKE_DUCKS.length; i++) {
        const spec = LAKE_DUCKS[i];
        const grp = duckRefs.current[i];
        if (!grp) continue;

        const ang = t * spec.speed + spec.phase;
        const targetX = feeding ? -82.6 + spec.feedOffset[0] + Math.sin(t * 1.6 + i) * 0.2 : -83.2 + Math.cos(ang) * spec.rx;
        const targetZ = feeding ? -14.2 + spec.feedOffset[1] + Math.cos(t * 1.4 + i) * 0.2 : -18.2 + Math.sin(ang) * spec.rz;

        const cur = duckPosRef.current[i];
        const lerpRate = Math.min(1, dt * (feeding ? 1.85 : 2.2));
        const nx = THREE.MathUtils.lerp(cur[0], targetX, lerpRate);
        const nz = THREE.MathUtils.lerp(cur[1], targetZ, lerpRate);
        const dx = nx - cur[0];
        const dz = nz - cur[1];
        cur[0] = nx;
        cur[1] = nz;

        const bob = Math.sin(t * 3.1 + spec.phase) * 0.018;
        grp.position.set(nx, -0.09 + bob, nz);
        if (Math.hypot(dx, dz) > 0.0005) {
          const desiredYaw = Math.atan2(dx, dz);
          let diff = desiredYaw - grp.rotation.y;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          grp.rotation.y += diff * Math.min(1, dt * 6);
        }

        const head = duckHeadRefs.current[i];
        if (head) {
          // Mengangguk riang mematuk remah roti saat diberi makan!
          head.rotation.x = feeding
            ? 0.25 + Math.max(0, Math.sin(t * 7.5 + i * 1.4)) * 0.45
            : Math.sin(t * 2.1 + spec.phase) * 0.12;
        }

        const rip = duckRippleRefs.current[i];
        if (rip && !playerRuntime.perf.isPotato) {
          const rp = ((t * 0.65 + i * 0.2) % 1 + 1) % 1;
          const sc = 0.65 + rp * 1.85;
          rip.scale.set(sc, sc, 1);
          (rip.material as THREE.MeshBasicMaterial).opacity = (1 - rp) * 0.34;
        }
      }
    }

    // 2. Animasi Ibu Lela Kios Bunga Segar
    if (!shouldSkipPerfFrame(-89.8, -8.8, 46)) {
      const distLela = py > 4 ? 99 : Math.hypot(px - -89.8, pz - -8.8);
      if (lelaHeadRef.current) {
        lelaHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.24;
      }
      if (lelaRightArmRef.current) {
        lelaRightArmRef.current.rotation.x =
          distLela < 5.5
            ? -1.55 + Math.sin(t * 5.0) * 0.22
            : -0.68 + Math.sin(t * 1.8) * 0.12;
      }
    }

    // 3. Animasi Mang Ujang Bubur Ayam & Uap Panci Bubur Hangat
    if (!shouldSkipPerfFrame(-22.2, 38.4, 48)) {
      const distUjang = py > 4 ? 99 : Math.hypot(px - -22.2, pz - 38.4);
      if (ujangHeadRef.current) {
        ujangHeadRef.current.rotation.y = Math.sin(t * 0.95) * 0.24;
      }
      if (ujangRightArmRef.current) {
        ujangRightArmRef.current.rotation.x =
          distUjang < 5.5
            ? -1.58 + Math.sin(t * 5.2) * 0.22
            : -0.78 + Math.sin(t * 2.3) * 0.16;
      }
      if (!playerRuntime.perf.isPotato) {
        for (let i = 0; i < 4; i++) {
          const m = buburSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * 0.48 + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * 0.56;
          m.position.x = Math.sin(t * 1.9 + i * 1.8) * 0.055 * p;
          const s = 0.5 + p * 1.25;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.28;
        }
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. KAWANAN 5 BEBEK DANAU SENJA + PAPAN REMAH ROTI                    */}
      {/* ==================================================================== */}
      {LAKE_DUCKS.map((d, idx) => (
        <group
          key={`duck-${idx}`}
          ref={(el) => {
            duckRefs.current[idx] = el;
          }}
          position={[duckPosRef.current[idx][0], -0.09, duckPosRef.current[idx][1]]}
          scale={d.scale}
        >
          {/* Tubuh Bebek Bulat Mengapung */}
          <mesh position={[0, 0.08, 0]} scale={[0.92, 0.78, 1.35]} castShadow>
            <sphereGeometry args={[0.17, 12, 10]} />
            <meshStandardMaterial color={d.bodyColor} roughness={0.78} />
          </mesh>
          {/* Sayap Kiri & Kanan */}
          {[-0.14, 0.14].map((wx, wi) => (
            <mesh key={`dw-${idx}-${wi}`} position={[wx, 0.1, -0.02]} scale={[0.35, 0.6, 1.15]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={d.wingColor} roughness={0.82} />
            </mesh>
          ))}
          {/* Ekor Mungil Terangkat */}
          <mesh position={[0, 0.14, -0.22]} rotation={[-0.65, 0, 0]}>
            <coneGeometry args={[0.065, 0.14, 6]} />
            <meshStandardMaterial color={d.wingColor} roughness={0.8} />
          </mesh>
          {/* Leher, Kepala & Paruh Oranye (Bergerak Mengangguk!) */}
          <group
            ref={(el) => {
              duckHeadRefs.current[idx] = el;
            }}
            position={[0, 0.17, 0.15]}
          >
            <mesh position={[0, 0.07, 0.01]} castShadow>
              <cylinderGeometry args={[0.052, 0.068, 0.14, 8]} />
              <meshStandardMaterial color={d.headColor} roughness={0.74} />
            </mesh>
            <mesh position={[0, 0.16, 0.03]} castShadow>
              <sphereGeometry args={[0.082, 10, 8]} />
              <meshStandardMaterial color={d.headColor} roughness={0.74} />
            </mesh>
            {/* Mata Mungil Hitam */}
            <mesh position={[-0.055, 0.18, 0.075]}>
              <sphereGeometry args={[0.013, 6, 6]} />
              <meshStandardMaterial color="#111827" roughness={0.2} />
            </mesh>
            <mesh position={[0.055, 0.18, 0.075]}>
              <sphereGeometry args={[0.013, 6, 6]} />
              <meshStandardMaterial color="#111827" roughness={0.2} />
            </mesh>
            {/* Paruh Pipih Oranye Cerah */}
            <mesh position={[0, 0.145, 0.125]} scale={[1.15, 0.45, 1.35]}>
              <sphereGeometry args={[0.045, 8, 6]} />
              <meshStandardMaterial color="#f97316" roughness={0.45} />
            </mesh>
          </group>
          {/* Riak Air Halus di Sekeliling Bebek */}
          <mesh
            ref={(el) => {
              duckRippleRefs.current[idx] = el;
            }}
            position={[0, 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.18, 0.23, 16]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.28} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* Remah Roti Mengapung di Air saat Damar Memberi Makan Bebek [E] */}
      <group ref={crumbGroupRef} position={[-82.6, -0.11, -14.1]} visible={false}>
        {[
          [-0.28, 0, 0.12],
          [0.24, 0, -0.14],
          [-0.08, 0, -0.25],
          [0.18, 0, 0.18],
          [-0.36, 0, -0.18],
          [0.02, 0, 0.04],
        ].map(([cx, cy, cz], ci) => (
          <mesh key={`crmb-${ci}`} position={[cx, cy, cz]}>
            <dodecahedronGeometry args={[0.042, 0]} />
            <meshStandardMaterial color="#fde68a" roughness={0.88} />
          </mesh>
        ))}
      </group>

      {/* Papan Kayu Mini Penanda Spot Bebek Danau Senja ([-81.8, 0, -12.35]) */}
      <group position={[-81.8, 0, -12.35]}>
        <mesh position={[0, 0.68, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 1.36, 8]} />
          <meshStandardMaterial color="#593c26" roughness={0.84} />
        </mesh>
        <mesh position={[0, 1.24, 0]} castShadow>
          <boxGeometry args={[0.82, 0.38, 0.05]} />
          <meshStandardMaterial color="#3f2a1d" roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.24, 0.03]}>
          <planeGeometry args={[0.76, 0.34]} />
          <meshStandardMaterial
            map={duckSignTex}
            emissiveMap={duckSignTex}
            emissive="#fef3c7"
            emissiveIntensity={isEveningOrNight ? 0.45 : 0.08}
          />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 2. KIOS BUNGA SEGAR IBU LELA ([-89.8, 0, -8.8], hadap +Z)            */}
      {/* ==================================================================== */}
      <group position={[-89.8, 0, -8.8]}>
        {/* Meja Kayu Hijau Sage & Krem Kios Bunga */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.32, 0.9, 1.08]} />
          <meshStandardMaterial color="#3f7344" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.96, 0]} castShadow>
          <boxGeometry args={[2.4, 0.07, 1.16]} />
          <meshStandardMaterial color="#f5ebd6" roughness={0.72} />
        </mesh>

        {/* Spanduk Depan HD "KIOS BUNGA SEGAR · IBU LELA" */}
        <mesh position={[0, 0.54, 0.555]}>
          <planeGeometry args={[2.18, 0.58]} />
          <meshStandardMaterial
            map={flowerBannerTex}
            emissiveMap={flowerBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
          />
        </mesh>

        {/* 6 Ember Seng Penuh Bunga Potong Segar Warna-Warni (Melati, Mawar, Krisan & Matahari) */}
        {[
          { x: -0.9, z: 0.14, bloom: '#f8fafc', alt: '#fef3c7' }, // Melati Putih
          { x: -0.54, z: -0.1, bloom: '#e11d48', alt: '#fb7185' }, // Mawar Merah
          { x: -0.18, z: 0.14, bloom: '#f472b6', alt: '#fbcfe8' }, // Mawar Pink
          { x: 0.18, z: -0.1, bloom: '#facc15', alt: '#fde047' }, // Krisan Kuning
          { x: 0.54, z: 0.14, bloom: '#a855f7', alt: '#d8b4fe' }, // Krisan Ungu
          { x: 0.9, z: -0.1, bloom: '#f59e0b', alt: '#fef08a' }, // Bunga Matahari Mini
        ].map((fl, fi) => (
          <group key={`flb-${fi}`} position={[fl.x, 1.0, fl.z]}>
            {/* Ember Seng Perak */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.11, 0.3, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.62} roughness={0.32} />
            </mesh>
            {/* Dedaunan Hijau Segar */}
            <mesh position={[0, 0.32, 0]} castShadow>
              <sphereGeometry args={[0.16, 10, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.8} />
            </mesh>
            {/* Kuntum Bunga Mekar Berwarna Cerah */}
            {[
              [-0.07, 0.44, 0.05],
              [0.07, 0.45, -0.04],
              [0, 0.49, 0],
              [-0.05, 0.41, -0.07],
              [0.06, 0.42, 0.07],
            ].map(([bx, by, bz], bi) => (
              <mesh key={`blm-${fi}-${bi}`} position={[bx, by, bz]}>
                <sphereGeometry args={[0.062, 8, 8]} />
                <meshStandardMaterial color={bi % 2 === 0 ? fl.bloom : fl.alt} roughness={0.55} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Payung Kanopi Merah Muda-Krem Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 1.78, -0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.9, -0.1]} castShadow>
          <coneGeometry args={[1.65, 0.44, 10]} />
          <meshStandardMaterial color="#be185d" roughness={0.65} />
        </mesh>
        <mesh position={[0, 2.91, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.66, 0.44, 5]} />
          <meshStandardMaterial color="#fbcfe8" roughness={0.65} />
        </mesh>

        {/* Bohlam Hangat Kios Bunga */}
        <mesh position={[0, 2.38, 0.2]}>
          <sphereGeometry args={[0.068, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.1}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.2]} scale={[1.6, 1.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.55 : 0.38}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Ibu Lela Ramah di Belakang Lapak Bunga (world [-89.8, 0, -9.95]) */}
        <group position={[0, 0, -1.15]}>
          <HumanModel
            profile={IBU_LELA_PROFILE}
            headRef={lelaHeadRef}
            rightArmRef={lelaRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. GEROBAK BUBUR AYAM PAGI MANG UJANG ([-22.2, 0, 38.4], hadap +Z)   */}
      {/* ==================================================================== */}
      <group position={[-22.2, 0, 38.4]}>
        {/* Badan Gerobak Kayu Kuning-Cokelat Khas Bubur Ayam Pagi */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.72} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#a67443" roughness={0.68} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`bw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#fef08a" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "BUBUR AYAM PAGI · MANG UJANG" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={buburBannerTex}
            emissiveMap={buburBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
          />
        </mesh>

        {/* Panci Besar Stainless Bubur Ayam Mengepul (Sisi Kiri Counter) */}
        <group position={[-0.56, 1.1, -0.02]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.22, 0.36, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.365, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.21, 14]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.45} />
          </mesh>
          {/* Kepulan Uap Bubur Hangat Pagi */}
          <group position={[0, 0.4, 0]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`bst-${si}`}
                ref={(el) => {
                  buburSteamRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#fffaf0" transparent opacity={0.22} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Etalase Kaca Topping (Ayam Suwir, Cakwe, Kacang Kedelai, Sate Telur Puyuh) */}
        <group position={[0.18, 1.32, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.88, 0.44, 0.44]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.36} roughness={0.14} />
          </mesh>
          {/* Mangkuk Ayam Suwir & Cakwe Keemasan */}
          <mesh position={[-0.22, -0.14, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.08, 12]} />
            <meshStandardMaterial color="#d97706" roughness={0.72} />
          </mesh>
          <mesh position={[0.18, -0.14, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.08, 12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.72} />
          </mesh>
        </group>

        {/* Toples Besar Kerupuk Kuning Ikonik di Sisi Kanan Counter */}
        <group position={[0.78, 1.32, 0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.14, 0.44, 14]} />
            <meshStandardMaterial color="#fef08a" transparent opacity={0.68} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.155, 0.155, 0.05, 14]} />
            <meshStandardMaterial color="#dc2626" roughness={0.45} />
          </mesh>
        </group>

        {/* Payung Kanopi Kuning-Hijau Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#eab308" roughness={0.65} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#15803d" roughness={0.65} />
        </mesh>

        {/* Bohlam Hangat Gerobak Bubur */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.7 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.22]} scale={[1.65, 1.65, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.58 : 0.42}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Mang Ujang Ramah di Belakang Gerobak (world [-22.2, 0, 37.38]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={MANG_UJANG_PROFILE}
            headRef={ujangHeadRef}
            rightArmRef={ujangRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [-22.2, 0, 40.25]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`bb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
