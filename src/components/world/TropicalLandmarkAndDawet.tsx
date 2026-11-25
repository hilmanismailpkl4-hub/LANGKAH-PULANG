import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface TropicalLandmarkAndDawetProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const PAK_DARMO_PROFILE: CharacterProfile = {
  id: 'pak_darman',
  name: 'Pak Darmo',
  role: 'Penjual Es Dawet Ayu',
  accentColor: '#34d399',
  voice: { pitch: 0.94, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#2d6a4f',
    pantsColor: '#2b3240',
    skinColor: '#c99771',
    hairColor: '#3b3733',
    accentProp: 'apron',
  },
};

interface DragonflySeed {
  homeX: number;
  homeY: number;
  homeZ: number;
  radius: number;
  phase: number;
  bodyCol: string;
}

const DRAGONFLY_SEEDS: DragonflySeed[] = [
  { homeX: -72.0, homeY: 0.75, homeZ: -25.2, radius: 2.1, phase: 0.3, bodyCol: '#06b6d4' },
  { homeX: -75.5, homeY: 0.85, homeZ: -26.8, radius: 1.9, phase: 1.4, bodyCol: '#10b981' },
  { homeX: -77.2, homeY: 0.72, homeZ: -29.2, radius: 2.2, phase: 2.6, bodyCol: '#38bdf8' },
  { homeX: -71.5, homeY: 0.9, homeZ: -30.5, radius: 1.8, phase: 3.7, bodyCol: '#f59e0b' },
  { homeX: -69.2, homeY: 0.82, homeZ: -27.5, radius: 2.0, phase: 4.9, bodyCol: '#14b8a6' },
  { homeX: -78.5, homeY: 0.78, homeZ: -13.2, radius: 2.1, phase: 0.8, bodyCol: '#22d3ee' },
  { homeX: -83.2, homeY: 0.88, homeZ: -12.6, radius: 1.9, phase: 2.1, bodyCol: '#34d399' },
  { homeX: -74.0, homeY: 0.76, homeZ: -13.0, radius: 2.2, phase: 3.3, bodyCol: '#0ea5e9' },
  { homeX: -67.5, homeY: 0.84, homeZ: -23.0, radius: 1.7, phase: 4.4, bodyCol: '#eab308' },
  { homeX: -65.5, homeY: 1.05, homeZ: 10.5, radius: 2.4, phase: 1.1, bodyCol: '#06b6d4' },
  { homeX: -64.2, homeY: 0.92, homeZ: 12.2, radius: 1.9, phase: 2.9, bodyCol: '#10b981' },
  { homeX: -86.5, homeY: 0.8, homeZ: -14.2, radius: 2.0, phase: 5.2, bodyCol: '#38bdf8' },
];

function createDawetBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(0.5, '#166534');
  grad.addColorStop(1, '#15803d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#fef9c3';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ES DAWET AYU', 320, 56);

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('PAK DARMO · ASLI BANJARNEGARA', 320, 98);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('CENDOL PANDAN · GULA AREN · NANGKA SEGAR', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createMonumentPlaqueTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 224;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#1b2430';
  ctx.fillRect(0, 0, 512, 224);

  ctx.strokeStyle = '#e0b363';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 492, 204);

  ctx.strokeStyle = 'rgba(224, 179, 99, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, 468, 180);

  ctx.fillStyle = '#f5d48e';
  ctx.font = 'bold 48px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOTA SENJA', 256, 86);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('Ruang Teduh untuk Melangkah Pulang', 256, 138);

  ctx.fillStyle = '#c9a059';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('JL. KENANGAN · TAMAN DANAU · PERUMAHAN MELATI', 256, 178);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Sentuhan Tropis & Landmark Kota:
 * 1. Gerobak Es Cendol Dawet Ayu Pak Darmo ([42.8, 0, -13.6]) — gentong tanah liat, ornamen wayang mini & payung teduh
 * 2. Taman Bundar Mini & Tugu Penanda "KOTA SENJA" ([13.6, 0, -14.8]) — bunga warna-warni & lampu sorot malam
 * 3. 12 Capung Berkilau Melayang & Meluncur Cepat di Tepi Danau Senja & Air Mancur Taman (pagi & sore cerah)
 */
export const TropicalLandmarkAndDawet: React.FC<TropicalLandmarkAndDawetProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const dawetBannerTex = useMemo(() => createDawetBannerTexture(), []);
  const plaqueTex = useMemo(() => createMonumentPlaqueTexture(), []);

  const darmoHeadRef = useRef<THREE.Group>(null);
  const darmoRightArmRef = useRef<THREE.Group>(null);
  const dfRefs = useRef<(THREE.Group | null)[]>([]);
  const dfWingLRefs = useRef<(THREE.Mesh | null)[]>([]);
  const dfWingRRefs = useRef<(THREE.Mesh | null)[]>([]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';
  const showDragonflies = timeOfDay === 'morning' || timeOfDay === 'sunset';
  const dfCount =
    settings.particleDensity === 'low' ? 6 : settings.particleDensity === 'medium' ? 9 : DRAGONFLY_SEEDS.length;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Sapaan ramah Pak Darmo saat Damar berjalan di Plaza Menara Nusantara
    const distDarmo = py > 4 ? 99 : Math.hypot(px - 42.8, pz - -13.6);
    if (darmoHeadRef.current) {
      darmoHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.25;
    }
    if (darmoRightArmRef.current) {
      darmoRightArmRef.current.rotation.x = distDarmo < 6.5 ? -2.0 + Math.sin(t * 7.5) * 0.18 : -0.45;
      darmoRightArmRef.current.rotation.z = distDarmo < 6.5 ? 0.28 + Math.cos(t * 7.5) * 0.12 : 0;
    }

    // 2. Animasi Capung Realistis (melayang diam sejenak -> meluncur cepat -> berhenti melayang lagi!)
    if (showDragonflies) {
      for (let i = 0; i < dfCount; i++) {
        const s = DRAGONFLY_SEEDS[i];
        const grp = dfRefs.current[i];
        if (!grp) continue;
        if (shouldSkipPerfFrame(s.homeX, s.homeZ, 38)) continue;

        // Siklus 4.8 detik: 0..2.8 melayang tenang, 2.8..4.8 meluncur cepat ke titik baru
        const cycle = t * 0.45 + s.phase;
        const step = Math.floor(cycle);
        const frac = cycle - step;
        // Easing halus agar capung berhenti diam lalu melesat cepat seperti aslinya
        const dart = frac < 0.62 ? 0 : Math.pow((frac - 0.62) / 0.38, 2);
        const angle = (step + dart) * 1.45 + s.phase;

        const x = s.homeX + Math.cos(angle) * s.radius;
        const z = s.homeZ + Math.sin(angle * 0.9) * s.radius;
        const y = s.homeY + Math.sin(t * 3.2 + s.phase) * 0.08 + (dart > 0 ? Math.sin(dart * Math.PI) * 0.28 : 0);

        grp.position.set(x, y, z);
        grp.rotation.y = -angle;

        const wingBuzz = Math.sin(t * 42 + i * 2.1) * 0.48;
        const wL = dfWingLRefs.current[i];
        const wR = dfWingRRefs.current[i];
        if (wL) wL.rotation.z = wingBuzz;
        if (wR) wR.rotation.z = -wingBuzz;
      }
    }
  });

  const monumentFlowers = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return {
          x: Math.cos(a) * 1.32,
          z: Math.sin(a) * 1.32,
          col: ['#e85d75', '#f5b82e', '#fff8e7', '#f97316'][i % 4],
        };
      }),
    [],
  );

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK ES CENDOL DAWET AYU PAK DARMO ([42.8, 0, -13.6])          */}
      {/* ==================================================================== */}
      <group position={[42.8, 0, -13.6]}>
        {/* Badan Gerobak Kayu Hijau-Krem */}
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.84, 0.96]} />
          <meshStandardMaterial color="#1f633e" roughness={0.72} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[2.12, 0.07, 1.06]} />
          <meshStandardMaterial color="#b0814c" roughness={0.68} />
        </mesh>

        {/* Spanduk Depan "ES DAWET AYU · PAK DARMO" */}
        <mesh position={[0, 0.64, 0.49]}>
          <planeGeometry args={[1.88, 0.56]} />
          <meshStandardMaterial
            map={dawetBannerTex}
            emissiveMap={dawetBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.1}
          />
        </mesh>

        {/* Dua Gentong Tanah Liat Terakota Khas Dawet Ayu (Cendol Hijau & Gula Aren) */}
        <group position={[-0.52, 1.32, 0.04]}>
          <mesh castShadow>
            <sphereGeometry args={[0.27, 14, 12]} />
            <meshStandardMaterial color="#a85538" roughness={0.84} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.17, 0.19, 0.08, 14]} />
            <meshStandardMaterial color="#8f452c" roughness={0.86} />
          </mesh>
          <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 12]} />
            <meshStandardMaterial color="#48a856" roughness={0.4} />
          </mesh>
        </group>

        <group position={[0.18, 1.32, 0.04]}>
          <mesh castShadow>
            <sphereGeometry args={[0.25, 14, 12]} />
            <meshStandardMaterial color="#9e4d32" roughness={0.84} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.155, 0.17, 0.08, 14]} />
            <meshStandardMaterial color="#823c25" roughness={0.86} />
          </mesh>
          <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.135, 12]} />
            <meshStandardMaterial color="#6e3614" roughness={0.35} />
          </mesh>
        </group>

        {/* Botol Sirup Gula Aren & Tumpukan Gelas Kaca di Kanan */}
        <mesh position={[0.72, 1.24, 0.12]} castShadow>
          <cylinderGeometry args={[0.045, 0.05, 0.28, 10]} />
          <meshStandardMaterial color="#59280e" roughness={0.25} />
        </mesh>
        <mesh position={[0.72, 1.22, -0.14]} castShadow>
          <cylinderGeometry args={[0.055, 0.045, 0.24, 10]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.78} roughness={0.15} />
        </mesh>

        {/* Dua Tiang Kayu + Ornamen Mini Semar & Gareng Khas Dawet Ayu Banjarnegara */}
        {[-0.92, 0.92].map((tx, ti) => (
          <group key={`dw-top-${ti}`} position={[tx, 1.56, 0.36]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.026, 0.028, 1.0, 8]} />
              <meshStandardMaterial color="#593a21" roughness={0.78} />
            </mesh>
            {/* Ornamen Kayu Bulat Mini Khas Puncak Gerobak Dawet Ayu */}
            <mesh position={[0, 0.56, 0]} castShadow>
              <sphereGeometry args={[0.085, 10, 10]} />
              <meshStandardMaterial color={ti === 0 ? '#f59e0b' : '#f8fafc'} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.67, 0]}>
              <coneGeometry args={[0.065, 0.1, 8]} />
              <meshStandardMaterial color="#1f2937" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Payung Tenda Besar Hijau-Oranye Menaungi Gerobak + Bohlam Hangat */}
        <mesh position={[0, 1.5, -0.14]} castShadow>
          <cylinderGeometry args={[0.042, 0.05, 2.95, 8]} />
          <meshStandardMaterial color="#593e28" roughness={0.76} />
        </mesh>
        <mesh position={[0, 2.95, -0.14]} castShadow>
          <coneGeometry args={[2.05, 0.62, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.74} />
        </mesh>
        <mesh position={[0, 2.52, 0.2]}>
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshStandardMaterial
            color="#fff2c6"
            emissive="#ffb84d"
            emissiveIntensity={isEveningOrNight ? 3.0 : 0.25}
          />
        </mesh>
        {isEveningOrNight && (
          <pointLight position={[0, 2.38, 0.35]} color="#ffc872" intensity={10} distance={14} decay={1.8} />
        )}

        {/* 2 Roda Gerobak */}
        {[-0.5, 0.5].map((rz, ri) => (
          <mesh key={`drw-${ri}`} position={[-0.3, 0.32, rz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.075, 16]} />
            <meshStandardMaterial color="#1f2329" roughness={0.85} />
          </mesh>
        ))}

        {/* Pak Darmo Berdiri Ramah di Belakang Gerobak */}
        <group position={[0, 0, -1.08]} rotation={[0, 0, 0]}>
          <HumanModel
            profile={PAK_DARMO_PROFILE}
            headRef={darmoHeadRef}
            rightArmRef={darmoRightArmRef}
          />
        </group>

        {/* Bangku Kayu Santai di Sisi Kiri Gerobak */}
        <group position={[-2.4, 0, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.09, 0.46]} />
            <meshStandardMaterial color="#875d39" roughness={0.8} />
          </mesh>
          {[-0.54, 0.54].map((bx, bi) => (
            <mesh key={`dbl-${bi}`} position={[bx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.09, 0.42, 0.38]} />
              <meshStandardMaterial color="#4f3520" roughness={0.86} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. TAMAN BUNDAR MINI & TUGU PENANDA "KOTA SENJA" ([13.6, 0, -14.8])  */}
      {/* ==================================================================== */}
      <group position={[13.6, 0, -14.8]}>
        {/* Cincin Batu Alam Taman Bundar Bertingkat */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.86, 1.96, 0.44, 24]} />
          <meshStandardMaterial color="#6e7680" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.43, 0]} receiveShadow>
          <cylinderGeometry args={[1.68, 1.68, 0.06, 24]} />
          <meshStandardMaterial color="#3c6b3f" roughness={0.92} />
        </mesh>

        {/* 12 Rumpun Bunga Tropis Warna-Warni Mengelilingi Tugu */}
        {monumentFlowers.map((fl, fi) => (
          <group key={`mfl-${fi}`} position={[fl.x, 0.46, fl.z]}>
            <mesh position={[0, 0.14, 0]} castShadow>
              <dodecahedronGeometry args={[0.24, 1]} />
              <meshStandardMaterial color="#366b3c" roughness={0.86} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={fl.col} roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Alas Pedestal & Pilar Tugu Modern Tropis "KOTA SENJA" */}
        <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.92, 0.46, 12]} />
          <meshStandardMaterial color="#49525e" roughness={0.72} />
        </mesh>
        <mesh position={[0, 2.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.88, 2.45, 0.56]} />
          <meshStandardMaterial map={textures.stucco} color="#e8decb" roughness={0.78} />
        </mesh>
        {/* Aksen Lis Emas & Terakota di Samping Tugu */}
        <mesh position={[-0.48, 2.05, 0]} castShadow>
          <boxGeometry args={[0.1, 2.5, 0.62]} />
          <meshStandardMaterial color="#a85538" roughness={0.68} />
        </mesh>
        <mesh position={[0.48, 2.05, 0]} castShadow>
          <boxGeometry args={[0.1, 2.5, 0.62]} />
          <meshStandardMaterial color="#a85538" roughness={0.68} />
        </mesh>
        {/* Mahkota Matahari Senja Kuningan di Puncak Tugu */}
        <mesh position={[0, 3.55, 0]} castShadow>
          <torusGeometry args={[0.38, 0.065, 10, 24]} />
          <meshStandardMaterial
            color="#e5b85c"
            emissive={isEveningOrNight ? '#f59e0b' : '#000000'}
            emissiveIntensity={isDarkNight ? 1.15 : isEveningOrNight ? 0.65 : 0}
            metalness={0.72}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 3.55, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial
            color="#ffe599"
            emissive="#ffae42"
            emissiveIntensity={isDarkNight ? 2.4 : isEveningOrNight ? 1.4 : 0.15}
          />
        </mesh>

        {/* Plakat 2 Sisi "KOTA SENJA · Ruang Teduh untuk Melangkah Pulang" */}
        <mesh position={[0, 2.05, 0.3]}>
          <planeGeometry args={[1.45, 0.64]} />
          <meshStandardMaterial
            map={plaqueTex}
            emissiveMap={plaqueTex}
            emissive="#ffe2a3"
            emissiveIntensity={isDarkNight ? 1.15 : isEveningOrNight ? 0.72 : 0.08}
          />
        </mesh>
        <mesh position={[0, 2.05, -0.3]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.45, 0.64]} />
          <meshStandardMaterial
            map={plaqueTex}
            emissiveMap={plaqueTex}
            emissive="#ffe2a3"
            emissiveIntensity={isDarkNight ? 1.15 : isEveningOrNight ? 0.72 : 0.08}
          />
        </mesh>

        {/* 4 Lampu Sorot Taman Bawah (Uplights) Menyala Keemasan saat Senja–Malam */}
        {[
          [0, 0.52, 0.92],
          [0, 0.52, -0.92],
          [0.92, 0.52, 0],
          [-0.92, 0.52, 0],
        ].map(([ux, uy, uz], ui) => (
          <mesh key={`upl-${ui}`} position={[ux, uy, uz]}>
            <cylinderGeometry args={[0.075, 0.09, 0.12, 8]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fff0c2' : '#475569'}
              emissive={isEveningOrNight ? '#ffba52' : '#000000'}
              emissiveIntensity={isDarkNight ? 2.8 : isEveningOrNight ? 1.8 : 0}
            />
          </mesh>
        ))}
        {isEveningOrNight && (
          <pointLight
            position={[0, 2.6, 0.95]}
            color="#ffcb78"
            intensity={isDarkNight ? 11 : 7}
            distance={14}
            decay={1.8}
          />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 3. 12 CAPUNG BERKILAU MELAYANG DI TEPI DANAU SENJA & AIR MANCUR      */}
      {/* ==================================================================== */}
      {showDragonflies &&
        DRAGONFLY_SEEDS.slice(0, dfCount).map((seed, idx) => (
          <group
            key={`dfly-${idx}`}
            ref={(el) => {
              dfRefs.current[idx] = el;
            }}
            position={[seed.homeX, seed.homeY, seed.homeZ]}
          >
            {/* Tubuh Ramping Panjang Berkilau Metalik */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.005, 0.14, 6]} />
              <meshStandardMaterial color={seed.bodyCol} metalness={0.7} roughness={0.25} />
            </mesh>
            {/* Sayap Kiri & Kanan Transparan Bergetar Cepat */}
            <mesh
              ref={(el) => {
                dfWingLRefs.current[idx] = el;
              }}
              position={[-0.065, 0.008, 0.02]}
            >
              <boxGeometry args={[0.12, 0.004, 0.032]} />
              <meshBasicMaterial color="#e0f7ff" transparent opacity={0.62} />
            </mesh>
            <mesh
              ref={(el) => {
                dfWingRRefs.current[idx] = el;
              }}
              position={[0.065, 0.008, 0.02]}
            >
              <boxGeometry args={[0.12, 0.004, 0.032]} />
              <meshBasicMaterial color="#e0f7ff" transparent opacity={0.62} />
            </mesh>
          </group>
        ))}
    </group>
  );
};
