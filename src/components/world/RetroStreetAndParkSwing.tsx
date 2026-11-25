import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface RetroStreetAndParkSwingProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MANG_DEDI_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mang Dedi',
  role: 'Penjual Balon Gas Warna-Warni',
  accentColor: '#f43f5e',
  voice: { pitch: 1.0, rate: 1.02, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#38bdf8',
    pantsColor: '#293241',
    skinColor: '#d1a17b',
    hairColor: '#231e1b',
    accentProp: 'vest',
  },
};

const VENDOR_BALLOONS: {
  x: number;
  y: number;
  z: number;
  r: number;
  col: string;
  phase: number;
  foil?: boolean;
}[] = [
  { x: -0.28, y: 2.86, z: 0.14, r: 0.21, col: '#f43f5e', phase: 0.2 },
  { x: 0.22, y: 2.94, z: 0.2, r: 0.22, col: '#facc15', phase: 1.1 },
  { x: -0.05, y: 3.12, z: -0.08, r: 0.23, col: '#38bdf8', phase: 2.0 },
  { x: 0.34, y: 2.74, z: -0.14, r: 0.2, col: '#34d399', phase: 2.8 },
  { x: -0.35, y: 2.66, z: -0.18, r: 0.2, col: '#a855f7', phase: 3.6 },
  { x: 0.06, y: 2.76, z: 0.32, r: 0.2, col: '#fb923c', phase: 4.3 },
  { x: -0.16, y: 2.98, z: -0.28, r: 0.21, col: '#f472b6', phase: 5.0 },
  { x: 0.26, y: 3.08, z: -0.24, r: 0.19, col: '#60a5fa', phase: 0.7 },
  { x: -0.22, y: 3.24, z: 0.08, r: 0.19, col: '#fde047', phase: 1.8, foil: true },
  { x: 0.14, y: 3.3, z: 0.02, r: 0.19, col: '#fb7185', phase: 3.1, foil: true },
  { x: -0.02, y: 2.64, z: -0.34, r: 0.19, col: '#2dd4bf', phase: 4.7 },
];

function createBalloonSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 176;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(0, 0, 384, 176);
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 368, 160);
  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BALON GAS', 192, 54);
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('MANG DEDI · WARNA-WARNI', 192, 98);
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Rp 5.000 · BISA TERBANG!', 192, 138);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createPayphoneHeaderTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(0, 0, 512, 16);
  ctx.fillRect(0, 112, 512, 16);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TELEPON UMUM', 256, 52);
  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('KOIN & KARTU · KLASIK KOTA SENJA', 256, 92);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createPosBoxTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, 26, 216, 108);
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 5;
  ctx.strokeRect(20, 26, 216, 108);

  ctx.fillStyle = '#ea580c';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POS', 128, 66);
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('INDONESIA', 128, 104);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('BIS SURAT', 128, 174);
  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('PENGAMBILAN 16.00 WIB', 128, 212);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Balon gas ceria yang melayang & mengayun alami mengikuti langkah Kira ke seluruh Kota Senja!
 */
const KiraFloatingBalloon: React.FC<{ color: string }> = ({ color }) => {
  const grpRef = useRef<THREE.Group>(null);
  const curPosRef = useRef(new THREE.Vector3(-18.7, 0.08, 65.0));

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const walking = useGameStore.getState().isFamilyWalkActive;
    const [kx, ky, kz] = walking ? playerRuntime.companions.kira.pos : [-18.7, 0.08, 65.0];

    // Ikuti posisi Kira dengan sedikit inersia elastis agar terasa seperti balon gas sungguhan
    const dx = curPosRef.current.x - kx;
    const dy = curPosRef.current.y - ky;
    const dz = curPosRef.current.z - kz;
    if (dx * dx + dy * dy + dz * dz > 64) {
      curPosRef.current.set(kx, ky, kz);
    } else {
      curPosRef.current.x = THREE.MathUtils.lerp(curPosRef.current.x, kx, Math.min(1, dt * 6));
      curPosRef.current.y = THREE.MathUtils.lerp(curPosRef.current.y, ky, Math.min(1, dt * 8));
      curPosRef.current.z = THREE.MathUtils.lerp(curPosRef.current.z, kz, Math.min(1, dt * 6));
    }

    if (grpRef.current) {
      const swayX = Math.sin(t * 2.4) * 0.12;
      const swayZ = Math.cos(t * 1.9) * 0.1;
      grpRef.current.position.set(
        curPosRef.current.x + 0.28 + swayX,
        curPosRef.current.y + 0.85,
        curPosRef.current.z + 0.1 + swayZ,
      );
      grpRef.current.rotation.z = -swayX * 0.65;
      grpRef.current.rotation.x = swayZ * 0.55;
    }
  });

  return (
    <group ref={grpRef} position={[-18.4, 0.9, 65.1]} userData={{ noCull: true }}>
      {/* Tali Balon Putih Tipis */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.16, 5]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      {/* Simpul & Badan Balon Gas Mengilap */}
      <mesh position={[0, 1.18, 0]}>
        <coneGeometry args={[0.032, 0.055, 8]} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.4, 0]} scale={[1, 1.18, 1]} castShadow>
        <sphereGeometry args={[0.21, 16, 14]} />
        <meshStandardMaterial
          color={color}
          roughness={0.18}
          metalness={0.14}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
};

/**
 * Opsi 2 — Nuansa Jalanan & Taman Klasik:
 * 1. Tukang Balon Gas Warna-Warni Mang Dedi ([-86.4, 0, 17.6]) + Balon Melayang Mengikuti Kira!
 * 2. Boks Telepon Umum Biru-Perak & Bis Surat Oranye Klasik PT Pos Retro ([-9.8, 0, -15.4])
 * 3. Kursi Ayunan Kayu Santai Taman Kota Menghadap Danau Senja ([-64.2, 0, -27.6])
 */
export const RetroStreetAndParkSwing: React.FC<RetroStreetAndParkSwingProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const balloonSignTex = useMemo(() => createBalloonSignTexture(), []);
  const payphoneHeaderTex = useMemo(() => createPayphoneHeaderTexture(), []);
  const posBoxTex = useMemo(() => createPosBoxTexture(), []);
  const kiraBalloonColor = useGameStore((s) => s.kiraBalloonColor);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';

  const dediHeadRef = useRef<THREE.Group>(null);
  const dediRightArmRef = useRef<THREE.Group>(null);
  const balloonRefs = useRef<(THREE.Group | null)[]>([]);
  const gardenSwingSeatRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Mang Dedi & 11 Balon Gas Mengayun Ceria
    if (!shouldSkipPerfFrame(-86.4, 17.6, 48)) {
      const distDedi = py > 4 ? 99 : Math.hypot(px - -86.4, pz - 17.6);
      if (dediHeadRef.current) {
        dediHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.25;
      }
      if (dediRightArmRef.current) {
        dediRightArmRef.current.rotation.x =
          distDedi < 6.0 ? -1.85 + Math.sin(t * 6.5) * 0.2 : -0.95;
      }
      const windMult = isRain ? 1.8 : 1.0;
      VENDOR_BALLOONS.forEach((b, i) => {
        const grp = balloonRefs.current[i];
        if (!grp) return;
        grp.position.x = b.x + Math.sin(t * 2.1 + b.phase) * 0.075 * windMult;
        grp.position.y = b.y + Math.cos(t * 1.8 + b.phase) * 0.05;
        grp.position.z = b.z + Math.cos(t * 1.6 + b.phase * 1.2) * 0.065 * windMult;
        grp.rotation.z = Math.sin(t * 1.9 + b.phase) * 0.14 * windMult;
      });
    }

    // 2. Animasi Kursi Ayunan Kayu Taman Berayun Tenang
    if (playerRuntime.gardenSwingTimer > 0) {
      playerRuntime.gardenSwingTimer = Math.max(0, playerRuntime.gardenSwingTimer - dt);
    }
    if (!shouldSkipPerfFrame(-64.2, -27.6, 45) && gardenSwingSeatRef.current) {
      const sittingHere =
        useGameStore.getState().isSitting &&
        playerRuntime.sitState?.label === 'Ayunan Kayu Taman Danau Senja';
      const amp = sittingHere ? 0.17 : playerRuntime.gardenSwingTimer > 0 ? 0.14 : 0.045;
      gardenSwingSeatRef.current.rotation.x = Math.sin(t * 1.65) * amp;
    }
  });

  return (
    <group>
      {/* Balon Gas Ceria Mengikuti Langkah Kira Jika Sudah Dibelikan! */}
      {kiraBalloonColor && <KiraFloatingBalloon color={kiraBalloonColor} />}

      {/* ==================================================================== */}
      {/* 1. TUKANG BALON GAS WARNA-WARNI — MANG DEDI ([-86.4, 0, 17.6])       */}
      {/* ==================================================================== */}
      <group position={[-86.4, 0, 17.6]} rotation={[0, 1.15, 0]}>
        {/* Mang Dedi Ramah Memegang Tongkat Rangkaian Balon */}
        <HumanModel
          profile={MANG_DEDI_PROFILE}
          headRef={dediHeadRef}
          rightArmRef={dediRightArmRef}
        />

        {/* Tongkat Bambu Penyangga & 11 Balon Gas Warna-Warni Bergoyang */}
        <group position={[0.32, 0, 0.25]}>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 2.3, 8]} />
            <meshStandardMaterial color="#b48a54" roughness={0.82} />
          </mesh>
          {VENDOR_BALLOONS.map((b, i) => (
            <group
              key={`vb-${i}`}
              ref={(el) => {
                balloonRefs.current[i] = el;
              }}
              position={[b.x, b.y, b.z]}
            >
              {/* Tali Balon ke Puncak Tongkat */}
              <mesh position={[-b.x * 0.45, -(b.y - 2.25) * 0.5, -b.z * 0.45]}>
                <cylinderGeometry args={[0.004, 0.004, Math.max(0.35, b.y - 2.15), 5]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.85} />
              </mesh>
              {b.foil ? (
                <mesh castShadow>
                  <octahedronGeometry args={[b.r * 1.12, 0]} />
                  <meshStandardMaterial
                    color={b.col}
                    metalness={0.62}
                    roughness={0.2}
                    emissive={b.col}
                    emissiveIntensity={0.18}
                  />
                </mesh>
              ) : (
                <mesh scale={[1, 1.16, 1]} castShadow>
                  <sphereGeometry args={[b.r, 14, 12]} />
                  <meshStandardMaterial
                    color={b.col}
                    roughness={0.2}
                    metalness={0.12}
                    emissive={b.col}
                    emissiveIntensity={0.14}
                  />
                </mesh>
              )}
            </group>
          ))}
        </group>

        {/* Tabung Gas Kecil & Papan Harga Balon di Sisi Kiri Mang Dedi */}
        <group position={[-0.55, 0, 0.15]}>
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.15, 0.72, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.45} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.76, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.12, 8]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.75} roughness={0.28} />
          </mesh>
          {/* Papan Harga Kecil Bersandar */}
          <mesh position={[0.18, 0.28, 0.24]} rotation={[-0.24, 0.2, 0]} castShadow>
            <boxGeometry args={[0.62, 0.34, 0.04]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
          <mesh position={[0.18, 0.28, 0.264]} rotation={[-0.24, 0.2, 0]}>
            <planeGeometry args={[0.58, 0.3]} />
            <meshStandardMaterial map={balloonSignTex} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. BOKS TELEPON UMUM & BIS SURAT ORANYE PT POS ([-9.8, 0, -15.4])    */}
      {/* ==================================================================== */}
      <group position={[-9.8, 0, -15.4]} rotation={[0, Math.PI / 2, 0]}>
        {/* 2A. Boks Telepon Umum Koin Biru-Perak Klasik Indonesia */}
        <group position={[0, 0, 0]}>
          {/* Pondasi Beton & Lantai Boks */}
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[0.96, 0.1, 0.96]} />
            <meshStandardMaterial color="#475569" roughness={0.82} />
          </mesh>
          {/* 4 Tiang Rangka Aluminium Perak */}
          {[
            [-0.42, 1.18, -0.42],
            [0.42, 1.18, -0.42],
            [-0.42, 1.18, 0.42],
            [0.42, 1.18, 0.42],
          ].map(([px, py, pz], pi) => (
            <mesh key={`pt-${pi}`} position={[px, py, pz]} castShadow>
              <boxGeometry args={[0.07, 2.26, 0.07]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.28} />
            </mesh>
          ))}
          {/* Panel Bawah Biru Telkom & Dinding Kaca Samping/Belakang */}
          <mesh position={[0, 0.48, -0.42]} castShadow>
            <boxGeometry args={[0.84, 0.86, 0.05]} />
            <meshStandardMaterial color="#0369a1" roughness={0.45} />
          </mesh>
          <mesh position={[-0.42, 0.48, 0]} castShadow>
            <boxGeometry args={[0.05, 0.86, 0.84]} />
            <meshStandardMaterial color="#0369a1" roughness={0.45} />
          </mesh>
          <mesh position={[0.42, 0.48, 0]} castShadow>
            <boxGeometry args={[0.05, 0.86, 0.84]} />
            <meshStandardMaterial color="#0369a1" roughness={0.45} />
          </mesh>
          {/* Panel Kaca Akrilik Bening Atas */}
          <mesh position={[0, 1.48, -0.42]}>
            <boxGeometry args={[0.78, 1.12, 0.03]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.34} roughness={0.14} />
          </mesh>
          <mesh position={[-0.42, 1.48, 0]}>
            <boxGeometry args={[0.03, 1.12, 0.78]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.34} roughness={0.14} />
          </mesh>
          <mesh position={[0.42, 1.48, 0]}>
            <boxGeometry args={[0.03, 1.12, 0.78]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.34} roughness={0.14} />
          </mesh>

          {/* Atap Header "TELEPON UMUM" Menyala Lembut Malam */}
          <mesh position={[0, 2.34, 0]} castShadow>
            <boxGeometry args={[0.98, 0.34, 0.98]} />
            <meshStandardMaterial color="#0369a1" roughness={0.42} />
          </mesh>
          <mesh position={[0, 2.34, 0.495]}>
            <planeGeometry args={[0.88, 0.26]} />
            <meshStandardMaterial
              map={payphoneHeaderTex}
              emissiveMap={payphoneHeaderTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.95 : 0.16}
            />
          </mesh>

          {/* Unit Pesawat Telepon Koin + Gagang Hitam & Meja Kecil di Dalam */}
          <group position={[0, 1.38, -0.3]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.46, 0.18]} />
              <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.32} />
            </mesh>
            {/* Tombol Angka & Celah Koin */}
            <mesh position={[0.04, 0.02, 0.095]}>
              <boxGeometry args={[0.16, 0.18, 0.02]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} />
            </mesh>
            {/* Gagang Telepon Hitam Klasik */}
            <mesh position={[-0.1, 0.04, 0.11]} castShadow>
              <capsuleGeometry args={[0.028, 0.24, 6, 8]} />
              <meshStandardMaterial color="#111827" roughness={0.45} />
            </mesh>
            {/* Rak Tulis Kecil di Bawah Telepon */}
            <mesh position={[0, -0.34, 0.14]} castShadow>
              <boxGeometry args={[0.56, 0.04, 0.26]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.65} roughness={0.35} />
            </mesh>
          </group>

          {/* Lampu Plafon Boks Telepon Hangat Malam */}
          {isEveningOrNight && (
            <>
              <mesh position={[0, 2.15, 0]}>
                <boxGeometry args={[0.42, 0.04, 0.24]} />
                <meshStandardMaterial color="#fff9db" emissive="#ffe08a" emissiveIntensity={2.4} />
              </mesh>
              <pointLight position={[0, 2.0, 0.1]} color="#ffe4a8" intensity={6.5} distance={7} decay={2} />
            </>
          )}
        </group>

        {/* 2B. Bis Surat Oranye Klasik PT Pos Indonesia di Samping Kanan (local [-1.05, 0, 0] -> world [-9.8, 0, -14.35]) */}
        <group position={[-1.05, 0, 0]}>
          {/* Tiang & Badan Silinder Oranye Khas PT Pos Indonesia */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.3, 0.28, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 1.24, 18]} />
            <meshStandardMaterial color="#ea580c" roughness={0.42} metalness={0.22} />
          </mesh>
          {/* Kubah Tutup Atas Bulat & Ring Penahan Hujan */}
          <mesh position={[0, 1.52, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.28, 0.08, 18]} />
            <meshStandardMaterial color="#c2410c" roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.56, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <meshStandardMaterial color="#ea580c" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Mulut Celah Surat Berpenutup Hitam Menghadap Jl. Cempaka (+Z lokal -> +X dunia) */}
          <mesh position={[0, 1.28, 0.25]} castShadow>
            <boxGeometry args={[0.26, 0.08, 0.08]} />
            <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Plakat "POS INDONESIA · BIS SURAT" */}
          <mesh position={[0, 0.9, 0.252]}>
            <planeGeometry args={[0.34, 0.36]} />
            <meshStandardMaterial map={posBoxTex} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. KURSI AYUNAN KAYU SANTAI TAMAN KOTA ([-64.2, 0, -27.6])           */}
      {/* ==================================================================== */}
      <group position={[-64.2, 0, -27.6]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Alas Paving Alami di Bawah Ayunan */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[2.65, 0.04, 1.78]} />
          <meshStandardMaterial map={textures.paving} roughness={0.9} />
        </mesh>

        {/* Rangka Kayu Jati A-Frame Kiri & Kanan */}
        {[-1.12, 1.12].map((ax, ai) => (
          <group key={`saf-${ai}`} position={[ax, 0, 0]}>
            <mesh position={[0, 1.15, -0.36]} rotation={[0.24, 0, 0]} castShadow>
              <boxGeometry args={[0.11, 2.38, 0.11]} />
              <meshStandardMaterial color="#6e472b" roughness={0.78} />
            </mesh>
            <mesh position={[0, 1.15, 0.36]} rotation={[-0.24, 0, 0]} castShadow>
              <boxGeometry args={[0.11, 2.38, 0.11]} />
              <meshStandardMaterial color="#6e472b" roughness={0.78} />
            </mesh>
            {/* Palang Penguat Tengah */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <boxGeometry args={[0.09, 0.09, 1.02]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.82} />
            </mesh>
          </group>
        ))}

        {/* Balok Gantung Atas & Kanopi Kisi Kayu Peneduh + Rambat Bunga Bougenville */}
        <mesh position={[0, 2.24, 0]} castShadow>
          <boxGeometry args={[2.52, 0.12, 0.14]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.78} />
        </mesh>
        <mesh position={[0, 2.38, 0]} castShadow>
          <boxGeometry args={[2.66, 0.08, 1.48]} />
          <meshStandardMaterial map={textures.woodSlat} color="#7c5335" roughness={0.8} />
        </mesh>
        {/* Rambat Daun Hijau & Bunga Merah Muda Hangat di Puncak Pergola */}
        {[
          [-1.08, 2.32, 0.56, '#2d6a4f'],
          [-0.95, 2.42, 0.45, '#e85d75'],
          [1.06, 2.32, -0.52, '#2d6a4f'],
          [0.92, 2.42, -0.44, '#f472b6'],
        ].map(([fx, fy, fz, col], fi) => (
          <mesh key={`vine-${fi}`} position={[fx as number, fy as number, fz as number]}>
            <dodecahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color={col as string} roughness={0.85} />
          </mesh>
        ))}

        {/* 5 Lampu Peri Hangat di Balok Pergola (Menyala Saat Senja–Malam) */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((lx, li) => (
          <group key={`swl-${li}`} position={[lx, 2.15, 0.48]}>
            <mesh>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fff3c4' : '#cbd5e1'}
                emissive={isEveningOrNight ? '#ffb84d' : '#000000'}
                emissiveIntensity={isEveningOrNight ? 2.6 : 0}
              />
            </mesh>
            {isEveningOrNight && settings.cinematicGlow && li % 2 === 0 && (
              <sprite scale={[0.9, 0.9, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffd27a"
                  transparent
                  opacity={0.62}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        ))}
        {isEveningOrNight && (
          <pointLight position={[0, 2.0, 0.2]} color="#ffd080" intensity={7} distance={9} decay={1.9} />
        )}

        {/* Kursi Bangku Ayunan Tergantung Rantai (Pivot di Balok Atas y=2.22 agar Berayun Natural!) */}
        <group ref={gardenSwingSeatRef} position={[0, 2.22, 0]}>
          {/* 4 Rantai Baja Penggantung */}
          {[
            [-0.78, -0.82, -0.22],
            [0.78, -0.82, -0.22],
            [-0.78, -0.82, 0.24],
            [0.78, -0.82, 0.24],
          ].map(([cx, cy, cz], ci) => (
            <mesh key={`ch-${ci}`} position={[cx, cy, cz]}>
              <cylinderGeometry args={[0.012, 0.012, 1.62, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.28} />
            </mesh>
          ))}

          {/* Dudukan, Sandaran & Sandaran Lengan Kayu Jati Hangat */}
          <mesh position={[0, -1.64, 0.02]} castShadow receiveShadow>
            <boxGeometry args={[1.64, 0.08, 0.56]} />
            <meshStandardMaterial map={textures.woodFloor} color="#9c6a3b" roughness={0.72} />
          </mesh>
          <mesh position={[0, -1.3, -0.26]} rotation={[-0.18, 0, 0]} castShadow>
            <boxGeometry args={[1.64, 0.62, 0.07]} />
            <meshStandardMaterial map={textures.woodSlat} color="#8c5d34" roughness={0.75} />
          </mesh>
          {[-0.8, 0.8].map((armX, ai) => (
            <mesh key={`swa-${ai}`} position={[armX, -1.44, 0.02]} castShadow>
              <boxGeometry args={[0.07, 0.07, 0.56]} />
              <meshStandardMaterial color="#6e472b" roughness={0.78} />
            </mesh>
          ))}
          {/* 2 Bantal Duduk & Bantal Sandaran Krem-Terakota */}
          <mesh position={[-0.42, -1.56, 0.03]} castShadow>
            <boxGeometry args={[0.68, 0.08, 0.46]} />
            <meshStandardMaterial color="#f3e5cc" roughness={0.9} />
          </mesh>
          <mesh position={[0.42, -1.56, 0.03]} castShadow>
            <boxGeometry args={[0.68, 0.08, 0.46]} />
            <meshStandardMaterial color="#e07a5f" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
