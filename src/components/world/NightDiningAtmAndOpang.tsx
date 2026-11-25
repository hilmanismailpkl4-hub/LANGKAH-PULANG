import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface NightDiningAtmAndOpangProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MAS_EKO_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mas Eko',
  role: 'Penjual Pecel Lele Lamongan',
  accentColor: '#facc15',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#f8fafc',
    pantsColor: '#1f2937',
    skinColor: '#cfa07a',
    hairColor: '#1d1a18',
    accentProp: 'apron',
  },
};

const BANG_HENDRA_PROFILE: CharacterProfile = {
  id: 'pak_budi',
  name: 'Bang Hendra',
  role: 'Pengemudi Ojek Pangkalan Stasiun',
  accentColor: '#22c55e',
  voice: { pitch: 0.92, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#166534',
    pantsColor: '#27303f',
    skinColor: '#c99771',
    hairColor: '#1f1c1a',
    accentProp: 'vest',
  },
};

function createLamonganBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 256;
  const ctx = c.getContext('2d')!;

  // Spanduk kain lukis tangan khas Warung Pecel Lele Lamongan (kuning-oranye-merah-biru terang!)
  const bg = ctx.createLinearGradient(0, 0, 768, 256);
  bg.addColorStop(0, '#facc15');
  bg.addColorStop(0.5, '#fde047');
  bg.addColorStop(1, '#fb923c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 768, 256);

  // Bingkai merah-biru tegas khas spanduk kaki lima Lamongan
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 748, 236);
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 5;
  ctx.strokeRect(22, 22, 724, 212);

  // Strip bawah merah bertuliskan menu
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(24, 184, 720, 48);

  // Ilustrasi sederhana ikan lele goreng di sisi kiri
  ctx.fillStyle = '#1e3a8a';
  ctx.beginPath();
  ctx.ellipse(98, 104, 48, 20, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(46, 112);
  ctx.lineTo(28, 92);
  ctx.lineTo(34, 128);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(128, 96, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Ilustrasi ayam goreng & sambal di sisi kanan
  ctx.fillStyle = '#9a3412';
  ctx.beginPath();
  ctx.ellipse(668, 104, 42, 24, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(645, 134, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.ellipse(684, 136, 18, 8, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Teks Utama Tegas Khas Lamongan
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PECEL LELE', 384, 78);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('LAMONGAN “SARI RASA” · MAS EKO', 384, 138);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('LELE GORENG · AYAM KREMES · TAHU TEMPE · NASI UDUK · SAMBAL TERASI', 384, 208);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createCheckeredClothTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fefefe';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#dc2626';
  for (let y = 0; y < 256; y += 32) {
    for (let x = 0; x < 256; x += 32) {
      if (((x + y) / 32) % 2 === 0) {
        ctx.fillRect(x, y, 32, 32);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1.5);
  return tex;
}

function createAtmHeaderTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0f2d5e';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 108, 512, 20);
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ATM TUNAI 24 JAM', 256, 48);

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('BANK SENJA · TARIK TUNAI & QRIS', 256, 86);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createAtmScreenTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, 192);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 192);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BANK SENJA', 128, 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('SELAMAT DATANG', 128, 72);
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText('Silakan Masukkan Kartu', 128, 98);

  ctx.fillStyle = '#22c55e';
  ctx.fillRect(46, 124, 164, 34);
  ctx.fillStyle = '#052e16';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('TARIK TUNAI CEPAT', 128, 146);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createOpangSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 7;
  ctx.strokeRect(7, 7, 498, 114);
  ctx.fillStyle = '#fefce8';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PANGKALAN OJEK STASIUN', 256, 48);
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('OPANG SENJA · RAMAH · AMAN · ANTAR CEPAT', 256, 92);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createOpangPlateTexture(plate: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 192;
  c.height = 72;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 192, 72);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 184, 64);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(plate, 96, 36);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const LamonganSteam: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 4; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = (((t * 0.54 + i * 0.25) % 1) + 1) % 1;
      m.position.y = p * 0.78;
      m.position.x = Math.sin(t * 2.0 + i * 1.6) * 0.08 * p;
      m.position.z = Math.cos(t * 1.7 + i * 1.9) * 0.07 * p;
      const s = 0.45 + p * 1.35;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.34;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`ls-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshBasicMaterial color="#fff9ed" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Motor ojek pangkalan realistis terparkir rapi dengan helm penumpang tergantung di spion.
 */
const ParkedOpangBike: React.FC<{
  position: [number, number, number];
  rotationY: number;
  bodyColor: string;
  helmetColor: string;
  plateTex: THREE.CanvasTexture;
  isLit: boolean;
}> = ({ position, rotationY, bodyColor, helmetColor, plateTex, isLit }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.85, 1.78]} />
      <meshBasicMaterial color="#090b10" transparent opacity={0.38} depthWrite={false} />
    </mesh>
    <group rotation={[0, 0, 0.08]}>
      {/* Roda Depan & Belakang */}
      {[-0.56, 0.56].map((wz, wi) => (
        <group key={`obw-${wi}`} position={[0, 0.27, wz]}>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.23, 0.068, 8, 16]} />
            <meshStandardMaterial color="#181b20" roughness={0.86} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.72} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Bodi Motor Bebek/Matic Harian Indonesia */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[0.38, 0.14, 0.92]} />
        <meshStandardMaterial color="#1f2937" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.56, -0.34]} castShadow>
        <boxGeometry args={[0.42, 0.3, 0.78]} />
        <meshStandardMaterial color={bodyColor} metalness={0.35} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.64, 0.5]} rotation={[-0.22, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.56, 0.22]} />
        <meshStandardMaterial color={bodyColor} metalness={0.35} roughness={0.38} />
      </mesh>
      {/* Jok Hitam Panjang */}
      <mesh position={[0, 0.74, -0.18]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.72]} />
        <meshStandardMaterial color="#18181b" roughness={0.82} />
      </mesh>
      {/* Setang, Lampu Depan & Spion */}
      <mesh position={[0, 0.95, 0.42]} castShadow>
        <boxGeometry args={[0.56, 0.1, 0.15]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.95, 0.51]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial
          color="#fff9db"
          emissive="#ffe29a"
          emissiveIntensity={isLit ? 0.45 : 0.08}
        />
      </mesh>
      {/* Helm Penumpang Menggantung di Sisi Kanan Setang */}
      <group position={[0.31, 1.02, 0.44]} rotation={[0.2, -0.4, 0.32]}>
        <mesh castShadow>
          <sphereGeometry args={[0.13, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.68]} />
          <meshStandardMaterial color={helmetColor} roughness={0.35} />
        </mesh>
      </group>
      {/* Plat Nomor & Reflektor Belakang */}
      <mesh position={[0, 0.45, -0.76]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.24, 0.09]} />
        <meshStandardMaterial map={plateTex} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.62, -0.75]}>
        <boxGeometry args={[0.16, 0.075, 0.03]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#ef4444"
          emissiveIntensity={isLit ? 1.4 : 0.25}
        />
      </mesh>
    </group>
  </group>
);

/**
 * Opsi 3 — Detail Kota Modern & Kuliner Malam:
 * 1. Warung Tenda Pecel Lele Lamongan "Sari Rasa Mas Eko" ([43.2, 0, 12.0]) — spanduk lukis, wajan & kuliner [E]
 * 2. Bilik ATM 24 Jam "BANK SENJA" ([32.55, 0, 18.8]) di samping Kios 24 Jam Harmoni — layar menyala & SFX tarik tunai [E]
 * 3. Pangkalan Ojek Ramah Sudut Stasiun Senja ([76.5, 0, 19.8]) — kanopi, 2 motor ojek berhelm & Bang Hendra [E]
 */
export const NightDiningAtmAndOpang: React.FC<NightDiningAtmAndOpangProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const lamonganBannerTex = useMemo(() => createLamonganBannerTexture(), []);
  const clothTex = useMemo(() => createCheckeredClothTexture(), []);
  const atmHeaderTex = useMemo(() => createAtmHeaderTexture(), []);
  const atmScreenTex = useMemo(() => createAtmScreenTexture(), []);
  const opangSignTex = useMemo(() => createOpangSignTexture(), []);
  const plate1Tex = useMemo(() => createOpangPlateTexture('B 6214 OJK'), []);
  const plate2Tex = useMemo(() => createOpangPlateTexture('B 5890 SNJ'), []);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';

  const ekoHeadRef = useRef<THREE.Group>(null);
  const ekoRightArmRef = useRef<THREE.Group>(null);
  const hendraHeadRef = useRef<THREE.Group>(null);
  const hendraRightArmRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Mas Eko menggoreng lele & ayam kremes di Warung Tenda Lamongan
    const distEko = py > 4 ? 99 : Math.hypot(px - 43.2, pz - 12.0);
    if (ekoHeadRef.current) {
      ekoHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.22;
    }
    if (ekoRightArmRef.current) {
      ekoRightArmRef.current.rotation.x =
        distEko < 6.5 ? -1.45 + Math.sin(t * 6.2) * 0.2 : -0.72 + Math.sin(t * 2.0) * 0.1;
    }

    // 2. Animasi Bang Hendra menyapa ramah penumpang Stasiun Senja
    const distOpang = py > 4 ? 99 : Math.hypot(px - 76.5, pz - 19.2);
    if (hendraHeadRef.current) {
      hendraHeadRef.current.rotation.y = Math.sin(t * 0.8) * 0.26;
    }
    if (hendraRightArmRef.current) {
      hendraRightArmRef.current.rotation.x =
        distOpang < 6.5 ? -2.05 + Math.sin(t * 7.5) * 0.18 : -0.25 + Math.sin(t * 1.2) * 0.05;
      hendraRightArmRef.current.rotation.z = distOpang < 6.5 ? 0.3 + Math.cos(t * 7.5) * 0.1 : 0;
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. WARUNG TENDA PECEL LELE LAMONGAN "SARI RASA" ([43.2, 0, 12.0])    */}
      {/* ==================================================================== */}
      <group position={[43.2, 0, 12.0]}>
        {/* 4 Tiang Rangka Besi Tenda Kaki Lima */}
        {[
          [-2.2, 1.3, -1.35],
          [2.2, 1.3, -1.35],
          [-2.2, 1.3, 1.35],
          [2.2, 1.3, 1.35],
        ].map(([tx, ty, tz], ti) => (
          <mesh key={`ltp-${ti}`} position={[tx, ty, tz]} castShadow>
            <cylinderGeometry args={[0.032, 0.036, 2.6, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}

        {/* Atap Terpal Biru Lebar Miring Khas Tenda Pecel Lele Indonesia */}
        <mesh position={[0, 2.64, -0.68]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[4.72, 0.07, 1.62]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.78} />
        </mesh>
        <mesh position={[0, 2.64, 0.68]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[4.72, 0.07, 1.62]} />
          <meshStandardMaterial color="#1e40af" roughness={0.78} />
        </mesh>

        {/* Kain Spanduk Lukis Lamongan di Bagian Atas Depan (-Z), Sisi Kiri (-X) & Belakang (+Z) */}
        <mesh position={[0, 2.18, -1.36]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.42, 0.72]} />
          <meshStandardMaterial
            map={lamonganBannerTex}
            emissiveMap={lamonganBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[-2.21, 1.48, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.68, 1.35]} />
          <meshStandardMaterial
            map={lamonganBannerTex}
            emissiveMap={lamonganBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.48 : 0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 1.45, 1.36]}>
          <planeGeometry args={[4.4, 1.45]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>

        {/* Gerobak Masak, Etalase Ayam/Lele & Wajan Besar di Sisi Kiri Tenda (local [-1.55, 0, 0.5]) */}
        <group position={[-1.55, 0, 0.5]}>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.32, 0.96, 1.05]} />
            <meshStandardMaterial color="#784f2d" roughness={0.78} />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[1.4, 0.07, 1.12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.55} roughness={0.35} />
          </mesh>
          {/* Etalase Kaca Ayam Kuning & Lele Siap Goreng */}
          <mesh position={[-0.25, 1.34, -0.05]} castShadow>
            <boxGeometry args={[0.68, 0.56, 0.72]} />
            <meshStandardMaterial color="#fffbeb" transparent opacity={0.3} roughness={0.14} />
          </mesh>
          {[-0.4, -0.25, -0.1].map((fx, fi) => (
            <mesh key={`lf-${fi}`} position={[fx, 1.12, -0.05]}>
              <capsuleGeometry args={[0.045, 0.14, 5, 8]} />
              <meshStandardMaterial color={fi === 1 ? '#ca8a04' : '#9a5422'} roughness={0.7} />
            </mesh>
          ))}
          {/* Wajan Penggorengan Panas + Uap Harum */}
          <mesh position={[0.38, 1.14, 0.06]} castShadow>
            <sphereGeometry args={[0.28, 14, 8, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45]} />
            <meshStandardMaterial color="#1f2329" metalness={0.65} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          <LamonganSteam position={[0.38, 1.2, 0.06]} />
        </group>

        {/* Mas Eko Berdiri di Belakang Gerobak Masak (local [-1.55, 0, 1.48] -> world [41.65, 0, 13.48]) */}
        <group position={[-1.55, 0, 1.48]} rotation={[0, Math.PI, 0]}>
          <HumanModel
            profile={MAS_EKO_PROFILE}
            headRef={ekoHeadRef}
            rightArmRef={ekoRightArmRef}
          />
        </group>

        {/* Meja Makan Panjang Bertaplak Kotak-Kotak Merah-Putih + Cobek Sambal & Bangku Kayu */}
        <group position={[0.85, 0, 0.2]}>
          <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.52, 0.08, 0.84]} />
            <meshStandardMaterial map={clothTex} roughness={0.75} />
          </mesh>
          {[-1.08, 1.08].map((lx, li) => (
            <mesh key={`ltl-${li}`} position={[lx, 0.39, 0]} castShadow>
              <boxGeometry args={[0.1, 0.78, 0.68]} />
              <meshStandardMaterial color="#5c3d24" roughness={0.85} />
            </mesh>
          ))}
          {/* Cobek Batu Sambal Terasi, Teko Air, Kotak Tisu & Botol Kecap */}
          <mesh position={[-0.65, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.13, 0.07, 14]} />
            <meshStandardMaterial color="#475569" roughness={0.85} />
          </mesh>
          <mesh position={[-0.65, 0.89, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.12, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.55} />
          </mesh>
          <mesh position={[0.42, 0.92, -0.08]}>
            <cylinderGeometry args={[0.075, 0.085, 0.22, 10]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.7} roughness={0.2} />
          </mesh>
          <mesh position={[0.78, 0.89, 0.05]}>
            <boxGeometry args={[0.2, 0.12, 0.14]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
          <mesh position={[-0.22, 0.91, 0.1]}>
            <cylinderGeometry args={[0.035, 0.04, 0.2, 8]} />
            <meshStandardMaterial color="#2b1b12" roughness={0.35} />
          </mesh>
        </group>

        {/* Bangku Panjang Kayu Pengunjung (local [0.85, 0, -0.82] -> world [44.05, 0, 11.18]) */}
        <group position={[0.85, 0, -0.82]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.45, 0.09, 0.44]} />
            <meshStandardMaterial map={textures.woodFloor} color="#9e7147" roughness={0.78} />
          </mesh>
          {[-1.02, 0, 1.02].map((blx, bli) => (
            <mesh key={`lbl-${bli}`} position={[blx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.36]} />
              <meshStandardMaterial color="#5c3d24" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {/* 2 Lampu Bohlam Terang Khas Warung Tenda Malam */}
        {[-1.1, 0.95].map((bx, bi) => (
          <group key={`lbulb-${bi}`} position={[bx, 2.38, -0.1]}>
            <mesh>
              <sphereGeometry args={[0.095, 10, 10]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fff9db' : '#e2e8f0'}
                emissive={isEveningOrNight ? '#ffe08a' : '#000000'}
                emissiveIntensity={isEveningOrNight ? 2.8 : 0}
              />
            </mesh>
            {isEveningOrNight && settings.cinematicGlow && (
              <sprite scale={[1.6, 1.6, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffe49e"
                  transparent
                  opacity={0.72}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        ))}
        {isEveningOrNight && (
          <pointLight position={[0.2, 2.25, -0.2]} color="#ffe1a3" intensity={15} distance={14} decay={1.7} />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 2. BILIK ATM 24 JAM "BANK SENJA" — SAMPING KIOS HARMONI ([32.55,0,18.8]) */}
      {/* ==================================================================== */}
      <group position={[32.55, 0, 18.8]}>
        {/* Lantai Keramik Bilik ATM */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[1.68, 0.08, 1.66]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        {/* Dinding Belakang & Sisi Kiri Menempel Rapi ke Kios Harmoni */}
        <mesh position={[0, 1.32, 0.78]} castShadow receiveShadow>
          <boxGeometry args={[1.68, 2.56, 0.1]} />
          <meshStandardMaterial color="#0f2d5e" roughness={0.45} />
        </mesh>
        <mesh position={[-0.79, 1.32, 0]} castShadow>
          <boxGeometry args={[0.1, 2.56, 1.62]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.45} />
        </mesh>
        {/* Dinding Kaca Samping Kanan & Bingkai Aluminium */}
        <mesh position={[0.79, 1.32, 0]}>
          <boxGeometry args={[0.06, 2.32, 1.48]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.34} roughness={0.12} metalness={0.25} />
        </mesh>
        <mesh position={[0.79, 1.32, -0.78]} castShadow>
          <boxGeometry args={[0.1, 2.56, 0.1]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.72} roughness={0.28} />
        </mesh>
        <mesh position={[-0.79, 1.32, -0.78]} castShadow>
          <boxGeometry args={[0.1, 2.56, 0.1]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.72} roughness={0.28} />
        </mesh>

        {/* Atap Neon Box "ATM TUNAI 24 JAM · BANK SENJA" Menghadap Utara (-Z) */}
        <mesh position={[0, 2.66, 0]} castShadow>
          <boxGeometry args={[1.76, 0.44, 1.74]} />
          <meshStandardMaterial color="#0f2d5e" roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.66, -0.88]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.64, 0.38]} />
          <meshStandardMaterial
            map={atmHeaderTex}
            emissiveMap={atmHeaderTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 1.15 : 0.25}
          />
        </mesh>

        {/* Mesin ATM Detail di Dalam Bilik */}
        <group position={[0, 0.08, 0.32]}>
          <mesh position={[0, 0.84, 0]} castShadow>
            <boxGeometry args={[0.82, 1.68, 0.64]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.55} roughness={0.32} />
          </mesh>
          <mesh position={[0, 1.24, -0.325]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.58, 0.44]} />
            <meshStandardMaterial
              map={atmScreenTex}
              emissiveMap={atmScreenTex}
              emissive="#7dd3fc"
              emissiveIntensity={isDarkNight ? 1.45 : 0.85}
            />
          </mesh>
          {/* Meja Keypad Logam & Slot Kartu Menyala Hijau */}
          <mesh position={[0, 0.9, -0.38]} rotation={[0.35, 0, 0]}>
            <boxGeometry args={[0.46, 0.08, 0.24]} />
            <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0.28, 1.05, -0.33]}>
            <boxGeometry args={[0.1, 0.04, 0.03]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.2} />
          </mesh>
          {/* Celah Keluar Uang Tunai */}
          <mesh position={[-0.1, 0.74, -0.33]}>
            <boxGeometry args={[0.34, 0.055, 0.03]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
        </group>

        {/* Lampu Neon Interior Bilik ATM Bercahaya Lembut Malam */}
        <mesh position={[0, 2.42, -0.1]}>
          <boxGeometry args={[0.92, 0.05, 0.24]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#bae6fd" emissiveIntensity={isEveningOrNight ? 2.4 : 0.4} />
        </mesh>
        {isEveningOrNight && (
          <pointLight position={[0, 2.2, -0.35]} color="#d8f0ff" intensity={8.5} distance={9} decay={2} />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 3. PANGKALAN OJEK RAMAH SUDUT STASIUN SENJA ([76.5, 0, 19.8])        */}
      {/* ==================================================================== */}
      <group position={[76.5, 0, 19.8]}>
        {/* Alas Paving Pangkalan */}
        <mesh position={[0, 0.02, -0.35]} receiveShadow>
          <boxGeometry args={[4.4, 0.04, 3.2]} />
          <meshStandardMaterial map={textures.paving} roughness={0.88} />
        </mesh>

        {/* 4 Tiang Kayu & Atap Seng Gelombang Miring Penahan Panas & Hujan */}
        {[
          [-1.85, 1.24, -0.9],
          [1.85, 1.24, -0.9],
          [-1.85, 1.15, 0.9],
          [1.85, 1.15, 0.9],
        ].map(([px, py, pz], pi) => (
          <mesh key={`opp-${pi}`} position={[px, py, pz]} castShadow>
            <boxGeometry args={[0.11, pi < 2 ? 2.48 : 2.3, 0.11]} />
            <meshStandardMaterial color="#4e3522" roughness={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 2.46, 0]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[4.25, 0.08, 2.45]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.55} />
        </mesh>

        {/* Papan Nama "PANGKALAN OJEK STASIUN SENJA" Menghadap Utara (-Z) */}
        <mesh position={[0, 2.24, -0.98]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.35, 0.54]} />
          <meshStandardMaterial
            map={opangSignTex}
            emissiveMap={opangSignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
          />
        </mesh>

        {/* Bangku Kayu Panjang Penunggu Ojek + Termos Kopi & Jas Hujan Lipat */}
        <group position={[0, 0, 0.42]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.55, 0.1, 0.54]} />
            <meshStandardMaterial map={textures.woodFloor} color="#8c623d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.82, 0.24]} castShadow>
            <boxGeometry args={[2.55, 0.28, 0.08]} />
            <meshStandardMaterial color="#6e4b30" roughness={0.82} />
          </mesh>
          {[-1.08, 0, 1.08].map((blx, bli) => (
            <mesh key={`opl-${bli}`} position={[blx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.12, 0.44, 0.44]} />
              <meshStandardMaterial color="#4a311e" roughness={0.86} />
            </mesh>
          ))}
          {/* Termos Kopi & Jas Hujan Biru Lipat di Ujung Bangku */}
          <mesh position={[0.96, 0.64, -0.05]} castShadow>
            <cylinderGeometry args={[0.068, 0.074, 0.28, 12]} />
            <meshStandardMaterial color="#16a34a" roughness={0.45} />
          </mesh>
          <mesh position={[-0.95, 0.54, 0.02]} castShadow>
            <boxGeometry args={[0.32, 0.1, 0.26]} />
            <meshStandardMaterial color="#2563eb" roughness={0.78} />
          </mesh>
        </group>

        {/* Bohlam Kuning Hangat Pangkalan Malam */}
        <mesh position={[0, 2.26, -0.15]}>
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff3c4' : '#e2e8f0'}
            emissive={isEveningOrNight ? '#ffbe55' : '#000000'}
            emissiveIntensity={isEveningOrNight ? 2.5 : 0}
          />
        </mesh>
        {isEveningOrNight && (
          <pointLight position={[0, 2.1, -0.35]} color="#ffcf80" intensity={10} distance={11} decay={1.8} />
        )}

        {/* 2 Motor Ojek Pangkalan Parkir Rapi Mengapit Pangkalan */}
        <ParkedOpangBike
          position={[-1.35, 0.02, -0.95]}
          rotationY={Math.PI + 0.22}
          bodyColor="#1e3a5f"
          helmetColor="#22c55e"
          plateTex={plate1Tex}
          isLit={isEveningOrNight}
        />
        <ParkedOpangBike
          position={[1.4, 0.02, -0.85]}
          rotationY={Math.PI - 0.25}
          bodyColor="#7f1d1d"
          helmetColor="#facc15"
          plateTex={plate2Tex}
          isLit={isEveningOrNight}
        />

        {/* Bang Hendra Berdiri Ramah Menyambut Penumpang Stasiun Senja (Menghadap Utara -Z) */}
        <group position={[0, 0, -0.65]} rotation={[0, Math.PI, 0]}>
          <HumanModel
            profile={BANG_HENDRA_PROFILE}
            headRef={hendraHeadRef}
            rightArmRef={hendraRightArmRef}
          />
        </group>
      </group>
    </group>
  );
};
