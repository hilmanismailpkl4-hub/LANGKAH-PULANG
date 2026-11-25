import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { FridgeNoteColor, GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';

interface NeighborhoodMorningAndFridgeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const PAK_JOKO_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Pak Joko',
  role: 'Penjual Roti Keliling Pagi',
  accentColor: '#60a5fa',
  voice: { pitch: 0.94, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#f1f5f9',
    pantsColor: '#2c3d55',
    skinColor: '#cfa17d',
    hairColor: '#262321',
    accentProp: 'vest',
  },
};

const NOTE_HEX: Record<FridgeNoteColor, string> = {
  yellow: '#fde68a',
  pink: '#fbcfe8',
  mint: '#a7f3d0',
  sky: '#bae6fd',
};

function createBreadCartSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 144;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 144);

  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(0, 0, 512, 42);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 42, 512, 8);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ROTI HANGAT · SARI MELATI', 256, 22);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.fillText('PAK JOKO KELILING', 256, 86);

  ctx.fillStyle = '#b45309';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('COKELAT · KEJU · SRIKAYA PANDAN', 256, 122);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const GARMENTS = [
  { offset: -1.85, w: 0.44, h: 0.54, col: '#f8fafc' },
  { offset: -1.12, w: 0.46, h: 0.58, col: '#60a5fa' },
  { offset: -0.38, w: 0.38, h: 0.48, col: '#f59e0b' },
  { offset: 0.34, w: 0.48, h: 0.62, col: '#475569' },
  { offset: 1.08, w: 0.42, h: 0.52, col: '#f472b6' },
  { offset: 1.78, w: 0.46, h: 0.55, col: '#6ee7b7' },
];

const ClotheslineSet: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  isRain: boolean;
  phaseOffset: number;
}> = ({ position, rotationY = 0, isRain, phaseOffset }) => {
  const clothRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    if (isRain) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < clothRefs.current.length; i++) {
      const grp = clothRefs.current[i];
      if (!grp) continue;
      grp.rotation.x = Math.sin(t * 2.1 + phaseOffset + i * 0.65) * 0.18 + 0.08;
      grp.rotation.z = Math.cos(t * 1.4 + phaseOffset + i * 0.9) * 0.05;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Dua Tiang Jemuran Besi Galvanis */}
      <mesh position={[-2.4, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.04, 2.3, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh position={[2.4, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.04, 2.3, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.42} />
      </mesh>
      {/* Tali Jemuran */}
      <mesh position={[0, 2.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 4.8, 6]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.85} />
      </mesh>

      {/* Pakaian Warna-Warni Berkibar Halus (otomatis diangkat saat hujan!) */}
      {!isRain &&
        GARMENTS.map((g, idx) => (
          <group
            key={`cl-${idx}`}
            ref={(el) => {
              clothRefs.current[idx] = el;
            }}
            position={[g.offset, 2.16, 0]}
          >
            {/* Penjepit Kayu Mungil */}
            <mesh position={[-g.w * 0.32, 0.02, 0]}>
              <boxGeometry args={[0.028, 0.055, 0.028]} />
              <meshStandardMaterial color="#b47b44" roughness={0.8} />
            </mesh>
            <mesh position={[g.w * 0.32, 0.02, 0]}>
              <boxGeometry args={[0.028, 0.055, 0.028]} />
              <meshStandardMaterial color="#b47b44" roughness={0.8} />
            </mesh>
            {/* Kain Pakaian */}
            <mesh position={[0, -g.h * 0.5, 0]} castShadow>
              <boxGeometry args={[g.w, g.h, 0.025]} />
              <meshStandardMaterial color={g.col} roughness={0.88} />
            </mesh>
          </group>
        ))}
    </group>
  );
};

/**
 * 1. Gerobak Sepeda Roti Hangat Keliling Pak Joko di Gang Perumahan Melati (+ melodi bel roti berkala)
 * 2. Tali Jemuran Perumahan Berkibar Halus Tertiup Angin (diangkat saat hujan!) + Pot Bunga Gerbang
 * 3. Catatan Magnet Warna-Warni 3D Menempel Langsung di Pintu Kulkas Rumah Jl. Melati No. 14
 */
export const NeighborhoodMorningAndFridge: React.FC<NeighborhoodMorningAndFridgeProps> = ({
  timeOfDay,
  settings,
}) => {
  const fridgeNotes = useGameStore((s) => s.fridgeNotes);
  const breadSignTex = useMemo(() => createBreadCartSignTexture(), []);
  const jokoHeadRef = useRef<THREE.Group>(null);
  const jokoRightArmRef = useRef<THREE.Group>(null);
  const lastBellRef = useRef(0);

  const isRain = timeOfDay === 'rain_dusk';
  const isEveningOrNight = timeOfDay !== 'morning';
  const showBreadCart = true;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    if (showBreadCart) {
      const dist = py > 4 ? 99 : Math.hypot(px - 2.8, pz - 53.2);
      if (jokoHeadRef.current) {
        jokoHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.35;
      }
      if (jokoRightArmRef.current) {
        // Lambaian ramah saat Damar berjalan mendekat di Gang Melati
        jokoRightArmRef.current.rotation.x = dist < 7.5 ? -2.1 + Math.sin(t * 8.5) * 0.2 : -0.35;
        jokoRightArmRef.current.rotation.z = dist < 7.5 ? 0.32 + Math.cos(t * 8.5) * 0.16 : 0;
      }

      // Bunyi bel roti keliling lembut tiap ~18 detik saat Damar melintas di Perumahan Melati
      if (dist < 22 && useGameStore.getState().screen === 'playing') {
        const nowMs = Date.now();
        if (nowMs - lastBellRef.current > 18500) {
          lastBellRef.current = nowMs;
          sfxEngine.playBreadVendorBell(Math.max(0.22, 1 - dist / 24));
        }
      }
    }
  });

  // Maksimal 6 catatan tempel terlihat langsung secara 3D di pintu kulkas rumah
  const visibleNotes = fridgeNotes.slice(0, 6);

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK SEPEDA ROTI HANGAT KELILING PAK JOKO ([2.8, 0, 53.2])     */}
      {/* ==================================================================== */}
      {showBreadCart && (
        <group position={[2.8, 0, 53.2]}>
          {/* Kotak Etalase Roti Putih-Biru di Depan Sepeda */}
          <mesh position={[-0.25, 0.82, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.18, 0.68, 0.86]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.55} />
          </mesh>
          {/* Lis Biru Tua & Kuning Khas Gerobak Roti */}
          <mesh position={[-0.25, 0.56, 0]}>
            <boxGeometry args={[1.2, 0.18, 0.88]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.5} />
          </mesh>
          {/* Bagian Kaca Etalase Atas + Barisan Roti Panggang Warna-Warni */}
          <mesh position={[-0.25, 1.32, 0]}>
            <boxGeometry args={[1.14, 0.34, 0.82]} />
            <meshPhysicalMaterial
              color="#eaf5ff"
              transparent
              opacity={0.36}
              roughness={0.1}
              metalness={0.05}
              clearcoat={0.8}
            />
          </mesh>
          {[-0.58, -0.34, -0.1, 0.14].map((rx, ri) => (
            <group key={`loaf-${ri}`} position={[rx, 1.24, 0]}>
              <mesh position={[0, 0, -0.16]} castShadow>
                <boxGeometry args={[0.18, 0.12, 0.24]} />
                <meshStandardMaterial color={['#d48c3f', '#c27432', '#6b4226', '#deb259'][ri]} roughness={0.78} />
              </mesh>
              <mesh position={[0, 0, 0.16]} castShadow>
                <boxGeometry args={[0.18, 0.12, 0.24]} />
                <meshStandardMaterial color={['#639c58', '#d48c3f', '#deb259', '#c27432'][ri]} roughness={0.78} />
              </mesh>
            </group>
          ))}
          {/* Atap Kotak Roti & Spanduk Depan-Belakang */}
          <mesh position={[-0.25, 1.52, 0]} castShadow>
            <boxGeometry args={[1.24, 0.08, 0.92]} />
            <meshStandardMaterial color="#1e40af" roughness={0.55} />
          </mesh>
          <mesh position={[-0.25, 0.94, -0.445]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.12, 0.34]} />
            <meshStandardMaterial
              map={breadSignTex}
              emissiveMap={breadSignTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
            />
          </mesh>
          <mesh position={[-0.25, 0.94, 0.445]}>
            <planeGeometry args={[1.12, 0.34]} />
            <meshStandardMaterial
              map={breadSignTex}
              emissiveMap={breadSignTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
            />
          </mesh>

          {/* Dua Roda Depan Kiri & Kanan + Roda Belakang Sepeda */}
          {[
            [-0.45, 0.33, 0.48],
            [-0.45, 0.33, -0.48],
            [0.98, 0.33, 0],
          ].map(([wx, wy, wz], wi) => (
            <mesh key={`bw-${wi}`} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.33, 0.33, 0.07, 16]} />
              <meshStandardMaterial color="#1f2329" roughness={0.85} />
            </mesh>
          ))}
          {/* Rangka Sepeda Belakang + Setang + Sadel */}
          <mesh position={[0.62, 0.65, 0]} rotation={[0, 0, 0.28]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.45} roughness={0.4} />
          </mesh>
          <mesh position={[0.45, 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.52, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0.88, 0.92, 0]}>
            <boxGeometry args={[0.26, 0.07, 0.16]} />
            <meshStandardMaterial color="#2b211b" roughness={0.75} />
          </mesh>

          {/* Payung Peneduh Kecil di Atas Gerobak saat Hujan */}
          {isRain && (
            <group position={[0.15, 2.05, 0]}>
              <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
                <meshStandardMaterial color="#cbd5e1" />
              </mesh>
              <mesh>
                <coneGeometry args={[1.15, 0.36, 12]} />
                <meshStandardMaterial color="#2563eb" roughness={0.7} />
              </mesh>
            </group>
          )}

          {/* Pak Joko Berdiri Ramah di Samping Gerobak */}
          <group position={[0.52, 0, 0.65]} rotation={[0, Math.PI, 0]}>
            <HumanModel
              profile={PAK_JOKO_PROFILE}
              headRef={jokoHeadRef}
              rightArmRef={jokoRightArmRef}
            />
          </group>
        </group>
      )}

      {/* ==================================================================== */}
      {/* 2. TALI JEMURAN PERUMAHAN MELATI BERKIBAR HALUS + POT GERBANG        */}
      {/* ==================================================================== */}
      {settings.graphicsQuality !== 'low' && (
        <>
          {/* Jemuran Samping Rumah Keluarga Damar */}
          <ClotheslineSet position={[-29.2, 0, 65.2]} rotationY={Math.PI / 2} isRain={isRain} phaseOffset={0.4} />
          {/* Jemuran Halaman Samping Tetangga Perumahan Melati */}
          <ClotheslineSet position={[7.5, 0, 69.2]} rotationY={Math.PI / 2} isRain={isRain} phaseOffset={2.1} />

          {/* Dua Pot Tanaman Terakota Hangat di Kiri & Kanan Gerbang Jl. Melati No. 14 */}
          {[-21.85, -18.15].map((gx, gi) => (
            <group key={`gpot-${gi}`} position={[gx, 0, 54.45]}>
              <mesh position={[0, 0.22, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.16, 0.44, 12]} />
                <meshStandardMaterial color="#a8553a" roughness={0.85} />
              </mesh>
              <mesh position={[0, 0.54, 0]} castShadow>
                <dodecahedronGeometry args={[0.28, 1]} />
                <meshStandardMaterial color="#3f7344" roughness={0.84} />
              </mesh>
              <mesh position={[0.08, 0.68, 0.06]}>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color="#fff8e8" roughness={0.55} />
              </mesh>
              <mesh position={[-0.09, 0.64, -0.05]}>
                <sphereGeometry args={[0.065, 8, 8]} />
                <meshStandardMaterial color="#f5b841" roughness={0.55} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {/* ==================================================================== */}
      {/* 3. CATATAN MAGNET WARNA-WARNI 3D DI PINTU KULKAS RUMAH DAMAR         */}
      {/* ==================================================================== */}
      <group position={[-14.5, 0.08, 71.87]}>
        {visibleNotes.map((note, idx) => {
          const colIdx = idx % 3;
          const rowIdx = Math.floor(idx / 3);
          const nx = -0.32 + colIdx * 0.31;
          const ny = 0.94 - rowIdx * 0.26;
          return (
            <group
              key={note.id}
              position={[nx, ny, 0]}
              rotation={[0, Math.PI, (note.tiltDeg * Math.PI) / 180]}
            >
              {/* Kertas Sticky Note Pastel */}
              <mesh>
                <planeGeometry args={[0.21, 0.19]} />
                <meshStandardMaterial color={NOTE_HEX[note.color]} roughness={0.82} />
              </mesh>
              {/* Magnet Bulat Warna di Bagian Atas Kertas */}
              <mesh position={[0, 0.072, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.014, 10]} />
                <meshStandardMaterial
                  color={note.author === 'nadia' ? '#e11d48' : note.author === 'kira' ? '#f59e0b' : '#2563eb'}
                  roughness={0.35}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
