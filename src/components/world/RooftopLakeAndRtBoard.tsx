import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ROOFTOP_TELESCOPE_TARGETS } from '../../data/rooftopAndRtData';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface RooftopLakeAndRtBoardProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createRtBoardHeaderTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 84);
  ctx.fillStyle = '#fefce8';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAPAN PENGUMUMAN RT 04', 256, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createRtBoardCorkTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext('2d')!;

  // Papan gabus hangat
  ctx.fillStyle = '#b98d5e';
  ctx.fillRect(0, 0, 512, 320);

  // 4 selebaran kertas warna-warni tertempel rapi
  const papers = [
    { x: 24, y: 24, w: 215, h: 126, col: '#fef9c3', pin: '#dc2626', title: 'KERJA BAKTI' },
    { x: 268, y: 28, w: 215, h: 122, col: '#fce7f3', pin: '#2563eb', title: 'POSYANDU RT 04' },
    { x: 30, y: 170, w: 210, h: 124, col: '#e0f2fe', pin: '#16a34a', title: 'JADWAL RONDA' },
    { x: 264, y: 168, w: 218, h: 126, col: '#dcfce7', pin: '#d97706', title: 'INFO WARGA' },
  ];

  papers.forEach((p) => {
    ctx.fillStyle = p.col;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, p.y, p.w, p.h);

    ctx.fillStyle = p.pin;
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + 12, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.title, p.x + p.w / 2, p.y + 42);

    ctx.fillStyle = 'rgba(31,41,55,0.45)';
    for (let ly = 0; ly < 4; ly++) {
      ctx.fillRect(p.x + 18, p.y + 62 + ly * 13, p.w - 36 - (ly === 3 ? 45 : 0), 5);
    }
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface SampanBoatProps {
  position: [number, number, number];
  baseYaw: number;
  phase: number;
  isLit: boolean;
  glow: boolean;
  withMooringPost?: boolean;
}

/**
 * Sampan kayu tradisional mengayun pelan mengikuti riak air Danau Senja,
 * lengkap dengan 2 bangku papan, dayung kayu & lentera haluan hangat malam.
 */
const WoodenSampanBoat: React.FC<SampanBoatProps> = ({
  position,
  baseYaw,
  phase,
  isLit,
  glow,
  withMooringPost = false,
}) => {
  const boatRef = useRef<THREE.Group>(null);
  const textures = useMemo(() => getProceduralTextures(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!boatRef.current) return;
    boatRef.current.position.y = Math.sin(t * 1.45 + phase) * 0.045;
    boatRef.current.rotation.z = Math.sin(t * 1.15 + phase * 1.3) * 0.055;
    boatRef.current.rotation.x = Math.cos(t * 0.95 + phase) * 0.032;
    boatRef.current.rotation.y = baseYaw + Math.sin(t * 0.55 + phase) * 0.04;
  });

  return (
    <group position={position}>
      {/* Tiang Pancang Tambat Kayu di Air (Khusus Sampan Dekat Dermaga) */}
      {withMooringPost && (
        <mesh position={[1.75, 0.35, 0.55]} castShadow>
          <cylinderGeometry args={[0.075, 0.09, 1.45, 8]} />
          <meshStandardMaterial color="#4a3322" roughness={0.9} />
        </mesh>
      )}

      <group ref={boatRef} rotation={[0, baseYaw, 0]}>
        {/* Lunas & Dasar Lambung Kayu Sampan */}
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.18, 2.75]} />
          <meshStandardMaterial color="#6e472b" roughness={0.82} />
        </mesh>
        {/* Dinding Samping Kiri & Kanan */}
        <mesh position={[-0.54, 0.34, 0]} rotation={[0, 0, 0.18]} castShadow>
          <boxGeometry args={[0.1, 0.44, 2.75]} />
          <meshStandardMaterial color="#805434" roughness={0.8} />
        </mesh>
        <mesh position={[0.54, 0.34, 0]} rotation={[0, 0, -0.18]} castShadow>
          <boxGeometry args={[0.1, 0.44, 2.75]} />
          <meshStandardMaterial color="#805434" roughness={0.8} />
        </mesh>
        {/* Haluan & Buritan Meruncing Melengkung Khas Sampan */}
        <mesh position={[0, 0.36, 1.56]} rotation={[-0.38, 0, 0]} castShadow>
          <coneGeometry args={[0.62, 0.72, 4]} />
          <meshStandardMaterial color="#754c2e" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.36, -1.56]} rotation={[0.38, 0, 0]} castShadow>
          <coneGeometry args={[0.62, 0.72, 4]} />
          <meshStandardMaterial color="#754c2e" roughness={0.82} />
        </mesh>
        {/* Strip Cat Biru-Krem Tradisional di Bibir Sampan */}
        <mesh position={[-0.58, 0.53, 0]}>
          <boxGeometry args={[0.04, 0.07, 2.65]} />
          <meshStandardMaterial color="#2b6cb0" roughness={0.65} />
        </mesh>
        <mesh position={[0.58, 0.53, 0]}>
          <boxGeometry args={[0.04, 0.07, 2.65]} />
          <meshStandardMaterial color="#2b6cb0" roughness={0.65} />
        </mesh>
        {/* Dua Bangku Dayung Melintang */}
        {[-0.55, 0.45].map((bz, bi) => (
          <mesh key={`sb-${bi}`} position={[0, 0.36, bz]} castShadow>
            <boxGeometry args={[1.02, 0.07, 0.28]} />
            <meshStandardMaterial color="#9e6d43" roughness={0.78} />
          </mesh>
        ))}
        {/* Dayung Kayu Terletak Miring di Dalam Sampan */}
        <group position={[0.15, 0.42, 0.05]} rotation={[0.08, 0.25, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.85, 6]} />
            <meshStandardMaterial color="#c4955e" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0, -0.92]}>
            <boxGeometry args={[0.16, 0.02, 0.42]} />
            <meshStandardMaterial color="#b08048" roughness={0.78} />
          </mesh>
        </group>

        {/* Lentera Haluan Kecil Hangat yang Menyala saat Senja–Malam */}
        <group position={[0, 0.62, 1.48]}>
          <mesh>
            <cylinderGeometry args={[0.065, 0.075, 0.16, 8]} />
            <meshStandardMaterial
              color={isLit ? '#fff1c2' : '#94a3b8'}
              emissive={isLit ? '#ffb347' : '#000000'}
              emissiveIntensity={isLit ? 2.6 : 0}
            />
          </mesh>
          {isLit && glow && (
            <sprite scale={[1.6, 1.6, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffc76b"
                transparent
                opacity={0.62}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      </group>
    </group>
  );
};

/**
 * Panorama Rooftop & Sudut Warga:
 * 1. Teropong Koin Optik di Rooftop Menara Nusantara ([34.4, 22, -21.45]) — kepala teropong berputar ke arah target aktif!
 * 2. 2 Sampan Kayu Tradisional mengayun lembut mengikuti riak Danau Senja
 * 3. Papan Pengumuman RT 04 Perumahan Melati ([8.8, 0, 52.4]) berkaca pelindung & atap genteng miring
 */
export const RooftopLakeAndRtBoard: React.FC<RooftopLakeAndRtBoardProps> = ({
  timeOfDay,
  settings,
}) => {
  const isTelescopeOpen = useGameStore((s) => s.isTelescopeOpen);
  const telescopeTargetIdx = useGameStore((s) => s.telescopeTargetIdx);

  const rtHeaderTex = useMemo(() => createRtBoardHeaderTexture(), []);
  const rtCorkTex = useMemo(() => createRtBoardCorkTexture(), []);
  const telescopeHeadRef = useRef<THREE.Group>(null);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!telescopeHeadRef.current) return;
    const target =
      ROOFTOP_TELESCOPE_TARGETS[telescopeTargetIdx % ROOFTOP_TELESCOPE_TARGETS.length] ??
      ROOFTOP_TELESCOPE_TARGETS[0];
    const desiredYaw = isTelescopeOpen
      ? Math.atan2(target.lookAt[0] - 34.4, target.lookAt[2] - -21.45)
      : -0.45;
    let diff = desiredYaw - telescopeHeadRef.current.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    telescopeHeadRef.current.rotation.y += diff * Math.min(1, dt * 5);
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. TEROPONG KOIN OPTIK ROOFTOP MENARA NUSANTARA ([34.4, 22, -21.45]) */}
      {/* ==================================================================== */}
      <group position={[34.4, 22, -21.45]}>
        {/* Alas Bulat Besi Cor & Tiang Penopang Teropong */}
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.32, 0.12, 14]} />
          <meshStandardMaterial color="#27313d" metalness={0.65} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.105, 1.24, 12]} />
          <meshStandardMaterial color="#364150" metalness={0.68} roughness={0.35} />
        </mesh>
        {/* Kotak Koin Kuningan di Tengah Tiang */}
        <mesh position={[0, 0.92, -0.09]} castShadow>
          <boxGeometry args={[0.16, 0.22, 0.12]} />
          <meshStandardMaterial color="#c89d4e" metalness={0.72} roughness={0.3} />
        </mesh>

        {/* Kepala Binokular Teropong Kembar (Berputar Mengikuti Target Zoom!) */}
        <group ref={telescopeHeadRef} position={[0, 1.44, 0]} rotation={[0, -0.45, 0]}>
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#27313d" metalness={0.7} roughness={0.32} />
          </mesh>
          {/* Dua Tabung Lensa Binokular Perak-Kuningan */}
          {[-0.085, 0.085].map((ox, oi) => (
            <group key={`tlen-${oi}`} position={[ox, 0.04, 0.04]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.062, 0.048, 0.56, 14]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.22} />
              </mesh>
              {/* Cincin Lensa Kuningan Depan & Kaca Lensa Biru */}
              <mesh position={[0, 0, 0.285]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.068, 0.068, 0.04, 14]} />
                <meshStandardMaterial color="#d4a653" metalness={0.8} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.308]}>
                <circleGeometry args={[0.056, 12]} />
                <meshStandardMaterial color="#38bdf8" metalness={0.85} roughness={0.1} />
              </mesh>
            </group>
          ))}
          {/* Pegangan Samping */}
          <mesh position={[0, 0.02, -0.14]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.34, 8]} />
            <meshStandardMaterial color="#1f2937" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. DUA SAMPAN KAYU TRADISIONAL DI PERMUKAAN DANAU SENJA              */}
      {/* ==================================================================== */}
      <WoodenSampanBoat
        position={[-79.8, 0.02, -33.8]}
        baseYaw={0.62}
        phase={0.4}
        isLit={isEveningOrNight}
        glow={settings.cinematicGlow}
        withMooringPost
      />
      <WoodenSampanBoat
        position={[-87.5, 0.02, -20.5]}
        baseYaw={-0.78}
        phase={2.5}
        isLit={isEveningOrNight}
        glow={settings.cinematicGlow}
      />

      {/* ==================================================================== */}
      {/* 3. PAPAN PENGUMUMAN RT 04 PERUMAHAN MELATI ([8.8, 0, 52.4])          */}
      {/* ==================================================================== */}
      <group position={[8.8, 0, 52.4]}>
        {/* Dua Tiang Kayu Kokoh */}
        {[-0.82, 0.82].map((tx, ti) => (
          <mesh key={`rtp-${ti}`} position={[tx, 1.12, 0]} castShadow>
            <boxGeometry args={[0.1, 2.24, 0.1]} />
            <meshStandardMaterial color="#593a21" roughness={0.82} />
          </mesh>
        ))}
        {/* Kotak Papan Pengumuman + Papan Gabus Berisi 4 Selebaran Warna-Warni */}
        <mesh position={[0, 1.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.76, 1.18, 0.14]} />
          <meshStandardMaterial color="#6e472b" roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.42, -0.075]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.6, 0.96]} />
          <meshStandardMaterial map={rtCorkTex} roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.42, 0.075]}>
          <planeGeometry args={[1.6, 0.96]} />
          <meshStandardMaterial map={rtCorkTex} roughness={0.78} />
        </mesh>
        {/* Papan Judul Atas "PAPAN PENGUMUMAN RT 04" */}
        <mesh position={[0, 2.02, -0.08]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.62, 0.28]} />
          <meshStandardMaterial
            map={rtHeaderTex}
            emissiveMap={rtHeaderTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.52 : 0.06}
          />
        </mesh>
        <mesh position={[0, 2.02, 0.08]}>
          <planeGeometry args={[1.62, 0.28]} />
          <meshStandardMaterial
            map={rtHeaderTex}
            emissiveMap={rtHeaderTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.52 : 0.06}
          />
        </mesh>
        {/* Atap Kecil Genteng Miring Anti-Hujan + Lampu Hangat Atas */}
        <mesh position={[0, 2.34, 0]} castShadow>
          <boxGeometry args={[2.08, 0.12, 0.64]} />
          <meshStandardMaterial color="#874532" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.22, -0.22]}>
          <boxGeometry args={[0.92, 0.045, 0.05]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff2c2' : '#cbd5e1'}
            emissive={isEveningOrNight ? '#ffba52' : '#000000'}
            emissiveIntensity={isDarkNight ? 2.8 : isEveningOrNight ? 1.8 : 0}
          />
        </mesh>
      </group>
    </group>
  );
};
