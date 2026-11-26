import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface BarberNurseryAndGallonDepotProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const BANG_DARTO_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Bang Darto',
  role: 'Tukang Cukur Pangkas Rambut Rapi Jaya',
  accentColor: '#ef4444',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#f8fafc',
    pantsColor: '#1f2937',
    skinColor: '#c99872',
    hairColor: '#1e1b19',
    accentProp: 'apron',
  },
};

const BU_NINGSIH_PROFILE: CharacterProfile = {
  id: 'bu_wati',
  name: 'Bu Ningsih',
  role: 'Penjual Tanaman Hias & Pot Terakota',
  accentColor: '#22c55e',
  voice: { pitch: 1.04, rate: 0.98, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.6,
    shirtColor: '#15803d',
    pantsColor: '#3f352e',
    skinColor: '#d4a683',
    hairColor: '#261e1a',
    accentProp: 'apron',
  },
};

const PAK_AHMAD_PROFILE: CharacterProfile = {
  id: 'pak_budi',
  name: 'Pak Ahmad',
  role: 'Pemilik Depot Galon Tirta Melati',
  accentColor: '#0ea5e9',
  voice: { pitch: 0.92, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#0284c7',
    pantsColor: '#27303f',
    skinColor: '#ca9871',
    hairColor: '#2b2826',
    accentProp: 'vest',
  },
};

function createBarberPoleTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  // Garis spiral diagonal merah-putih-biru klasik pangkas rambut
  const stripeW = 36;
  for (let x = -256; x < 512; x += stripeW * 4) {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeW, 0);
    ctx.lineTo(x + stripeW + 256, 256);
    ctx.lineTo(x + 256, 256);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    ctx.moveTo(x + stripeW * 2, 0);
    ctx.lineTo(x + stripeW * 3, 0);
    ctx.lineTo(x + stripeW * 3 + 256, 256);
    ctx.lineTo(x + stripeW * 2 + 256, 256);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function createBarberSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 640, 176);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 640, 14);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(0, 162, 640, 14);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 20, 620, 136);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PANGKAS RAMBUT "RAPI JAYA"', 320, 64);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('CUKUR KLASIK · RAPI · PIJAT KEPALA · BANG DARTO', 320, 118);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createNurserySignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(0.55, '#166534');
  grad.addColorStop(1, '#9a3412');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TANAMAN HIAS & POT TERAKOTA', 320, 52);

  ctx.fillStyle = '#bbf7d0';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('BU NINGSIH · TEPI TAMAN KOTA', 320, 96);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('MONSTERA · LIDAH MERTUA · KAKTUS MINI · BOUGENVILLE · PUPUK', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createGallonDepotSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#0369a1');
  grad.addColorStop(0.5, '#0284c7');
  grad.addColorStop(1, '#0ea5e9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DEPOT AIR ISI ULANG RO', 320, 52);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('TIRTA MELATI · PAK AHMAD · ANTAR GRATIS', 320, 96);

  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('GALON 19L HIGIENIS · STERILISASI UV & OZON · SIAP ANTAR KOMPLEKS', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Model 3D Galon Air Mineral Biru Bening 19L realistis.
 */
const WaterGallon19L: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.2, 0]} castShadow>
      <cylinderGeometry args={[0.135, 0.135, 0.36, 12]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} roughness={0.18} metalness={0.1} />
    </mesh>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.045, 0.125, 0.08, 12]} />
      <meshStandardMaterial color="#7dd3fc" transparent opacity={0.82} roughness={0.18} />
    </mesh>
    <mesh position={[0, 0.46, 0]}>
      <cylinderGeometry args={[0.038, 0.038, 0.05, 10]} />
      <meshStandardMaterial color="#ffffff" roughness={0.45} />
    </mesh>
  </group>
);

/**
 * Opsi 3 — Kehidupan Kompleks & Kerajinan Warga:
 * 1. Kios Pangkas Rambut Klasik "Rapi Jaya" ([14.8, 0, 37.8]) + Barber Pole Berputar di Tepi Jl. Cempaka
 * 2. Lapak Tanaman Hias & Pot Terakota Bu Ningsih ([-67.2, 0, 34.6]) di Tepi Taman Kota Selatan
 * 3. Agen Galon Air & Isi Ulang Pak Ahmad ([25.2, 0, 39.2]) di Sudut Perumahan Melati
 */
export const BarberNurseryAndGallonDepot: React.FC<BarberNurseryAndGallonDepotProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const barberPoleTex = useMemo(() => createBarberPoleTexture(), []);
  const barberSignTex = useMemo(() => createBarberSignTexture(), []);
  const nurserySignTex = useMemo(() => createNurserySignTexture(), []);
  const depotSignTex = useMemo(() => createGallonDepotSignTexture(), []);

  useEffect(() => {
    return () => {
      barberPoleTex.dispose();
      barberSignTex.dispose();
      nurserySignTex.dispose();
      depotSignTex.dispose();
    };
  }, [barberPoleTex, barberSignTex, nurserySignTex, depotSignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const barberPoleRef = useRef<THREE.Mesh>(null);
  const dartoHeadRef = useRef<THREE.Group>(null);
  const dartoRightArmRef = useRef<THREE.Group>(null);
  const ningsihHeadRef = useRef<THREE.Group>(null);
  const ningsihRightArmRef = useRef<THREE.Group>(null);
  const hangingPotLRef = useRef<THREE.Group>(null);
  const hangingPotRRef = useRef<THREE.Group>(null);
  const ahmadHeadRef = useRef<THREE.Group>(null);
  const ahmadRightArmRef = useRef<THREE.Group>(null);
  const uvTubeMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Barber Pole Berputar Halus & Animasi Bang Darto
    if (playerRuntime.barberCutTimer > 0) {
      playerRuntime.barberCutTimer = Math.max(0, playerRuntime.barberCutTimer - dt);
    }
    if (!shouldSkipPerfFrame(14.8, 37.8, 52)) {
      if (barberPoleRef.current) {
        const spinSpeed = playerRuntime.barberCutTimer > 0 ? 4.2 : 1.75;
        barberPoleRef.current.rotation.y += dt * spinSpeed;
      }
      const distDarto = py > 4 ? 99 : Math.hypot(px - 13.32, pz - 38.65);
      if (dartoHeadRef.current) {
        dartoHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.22;
      }
      if (dartoRightArmRef.current) {
        dartoRightArmRef.current.rotation.x =
          playerRuntime.barberCutTimer > 0
            ? -1.25 + Math.sin(t * 9.5) * 0.2
            : distDarto < 5.5
              ? -1.55 + Math.sin(t * 5.0) * 0.22
              : -0.35 + Math.sin(t * 1.4) * 0.08;
      }
    }

    // 2. Lapak Tanaman Bu Ningsih (Pot Gantung Mengayun Pelan)
    if (!shouldSkipPerfFrame(-67.2, 34.6, 46)) {
      const distNingsih = py > 4 ? 99 : Math.hypot(px - -67.2, pz - 34.6);
      if (ningsihHeadRef.current) {
        ningsihHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.24;
      }
      if (ningsihRightArmRef.current) {
        ningsihRightArmRef.current.rotation.x =
          distNingsih < 5.5
            ? -1.52 + Math.sin(t * 4.8) * 0.2
            : -0.65 + Math.sin(t * 1.8) * 0.12;
      }
      if (hangingPotLRef.current) {
        hangingPotLRef.current.rotation.z = Math.sin(t * 1.35) * 0.055;
      }
      if (hangingPotRRef.current) {
        hangingPotRRef.current.rotation.z = Math.cos(t * 1.2 + 0.8) * 0.055;
      }
    }

    // 3. Depot Galon Isi Ulang Pak Ahmad (Lampu UV Biru & Sapaan Ramah)
    if (playerRuntime.gallonRefillTimer > 0) {
      playerRuntime.gallonRefillTimer = Math.max(0, playerRuntime.gallonRefillTimer - dt);
    }
    if (!shouldSkipPerfFrame(25.2, 39.2, 50)) {
      const distAhmad = py > 4 ? 99 : Math.hypot(px - 23.35, pz - 40.15);
      if (ahmadHeadRef.current) {
        ahmadHeadRef.current.rotation.y = Math.sin(t * 0.92) * 0.22;
      }
      if (ahmadRightArmRef.current) {
        ahmadRightArmRef.current.rotation.x =
          distAhmad < 5.5
            ? -1.6 + Math.sin(t * 5.2) * 0.24
            : -0.52 + Math.sin(t * 1.6) * 0.1;
      }
      if (uvTubeMatRef.current) {
        const refilling = playerRuntime.gallonRefillTimer > 0;
        uvTubeMatRef.current.emissiveIntensity = refilling
          ? 2.8 + Math.sin(t * 14) * 0.65
          : isEveningOrNight
            ? 2.0
            : 1.1;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. KIOS PANGKAS RAMBUT KLASIK "RAPI JAYA" ([14.8, 0, 37.8], -X)      */}
      {/* ==================================================================== */}
      <group position={[14.8, 0, 37.8]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Badan Kios Klasik Hijau Botol & Krem Hangat */}
        <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.96, 2.08]} />
          <meshStandardMaterial color="#f5ebd6" roughness={0.82} />
        </mesh>
        {/* Lis Bawah Dinding Hijau Botol Khas Pangkas Rambut */}
        <mesh position={[0, 0.56, 0.02]} castShadow>
          <boxGeometry args={[3.08, 1.12, 2.1]} />
          <meshStandardMaterial color="#166534" roughness={0.78} />
        </mesh>
        {/* Atap Genteng Miring Gelap */}
        <mesh position={[0, 3.12, 0]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[3.35, 0.26, 2.45]} />
          <meshStandardMaterial color="#3f2b22" roughness={0.86} />
        </mesh>

        {/* Papan Nama Depan HD "PANGKAS RAMBUT RAPI JAYA" */}
        <mesh position={[0, 2.72, 1.07]}>
          <planeGeometry args={[2.86, 0.68]} />
          <meshStandardMaterial
            map={barberSignTex}
            emissiveMap={barberSignTex}
            emissive="#fff6dc"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.12}
          />
        </mesh>

        {/* Kanopi Depan Teduh Hijau-Putih (Melindungi dari Hujan) */}
        <mesh position={[0, 2.28, 1.56]} rotation={[0.24, 0, 0]} castShadow>
          <boxGeometry args={[3.14, 0.08, 1.12]} />
          <meshStandardMaterial color="#15803d" roughness={0.68} />
        </mesh>

        {/* Etalase Kaca Besar + Interior Mini (Kursi Cukur Merah Marun & Cermin Lebar) */}
        <group position={[-0.45, 1.56, 0.96]}>
          {/* Ceruk Dalam Kios Hangat */}
          <mesh position={[0, 0, -0.14]}>
            <boxGeometry args={[1.68, 1.12, 0.34]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fef0c7' : '#e7dcc5'}
              emissive="#ffca72"
              emissiveIntensity={isEveningOrNight ? 0.65 : 0.06}
              roughness={0.8}
            />
          </mesh>
          {/* Cermin Dinding Pangkas Rambut */}
          <mesh position={[0, 0.1, -0.29]}>
            <planeGeometry args={[1.28, 0.72]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.08} />
          </mesh>
          {/* Kursi Cukur Klasik Merah Marun */}
          <mesh position={[0, -0.34, -0.08]}>
            <boxGeometry args={[0.52, 0.24, 0.32]} />
            <meshStandardMaterial color="#991b1b" roughness={0.48} />
          </mesh>
          <mesh position={[0, -0.06, -0.2]}>
            <boxGeometry args={[0.48, 0.42, 0.1]} />
            <meshStandardMaterial color="#991b1b" roughness={0.48} />
          </mesh>
          {/* Kaca Depan Jendela Bening */}
          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[1.72, 1.16]} />
            <meshStandardMaterial color="#dbeafe" transparent opacity={0.28} roughness={0.1} metalness={0.2} />
          </mesh>
        </group>

        {/* Pintu Kayu Kios di Sisi Kanan */}
        <mesh position={[0.92, 1.12, 1.055]}>
          <boxGeometry args={[0.78, 2.04, 0.06]} />
          <meshStandardMaterial color="#5c3a24" roughness={0.78} />
        </mesh>

        {/* LAMPU TABUNG BARBER POLE BERPUTAR MERAH-PUTIH-BIRU (Sisi Kiri Pintu) */}
        <group position={[-1.35, 1.65, 1.28]}>
          {/* Braket Dinding Krom */}
          <mesh position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.24, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Tutup Krom Atas & Bawah */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.13, 0.1, 14]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.18} />
          </mesh>
          <mesh position={[0, -0.44, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.09, 0.1, 14]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.18} />
          </mesh>
          {/* Tabung Spiral Merah-Putih-Biru Berputar Real-Time! */}
          <mesh ref={barberPoleRef} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.78, 18]} />
            <meshStandardMaterial
              map={barberPoleTex}
              emissiveMap={barberPoleTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.95 : 0.22}
              roughness={0.22}
            />
          </mesh>
          {/* Kubah Bohlam Puncak Barber Pole */}
          <mesh position={[0, 0.56, 0]}>
            <sphereGeometry args={[0.095, 12, 10]} />
            <meshStandardMaterial
              color="#fff9db"
              emissive="#ffd67a"
              emissiveIntensity={isEveningOrNight ? 2.6 : 0.2}
            />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && (
            <sprite position={[0, 0.2, 0]} scale={[1.6, 2.2, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffd8b8"
                transparent
                opacity={isDarkNight ? 0.54 : 0.36}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>

        {/* Bang Darto Berdiri Ramah Menyambut Pelanggan (world [13.32, 0, 38.65]) */}
        <group position={[0.85, 0, 1.48]}>
          <HumanModel
            profile={BANG_DARTO_PROFILE}
            headRef={dartoHeadRef}
            rightArmRef={dartoRightArmRef}
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. LAPAK TANAMAN HIAS & POT TERAKOTA BU NINGSIH ([-67.2, 0, 34.6])   */}
      {/* ==================================================================== */}
      <group position={[-67.2, 0, 34.6]} rotation={[0, Math.PI, 0]}>
        {/* Rak Tangga Kayu 3 Tingkat Penuh Pot Tanah Liat Terakota */}
        <mesh position={[0, 0.28, 0.28]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 0.56, 0.44]} />
          <meshStandardMaterial color="#7a4e2c" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.54, -0.06]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 1.08, 0.38]} />
          <meshStandardMaterial color="#6b4224" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.78, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 1.54, 0.34]} />
          <meshStandardMaterial color="#5c381f" roughness={0.86} />
        </mesh>

        {/* Spanduk Depan HD "TANAMAN HIAS & POT TERAKOTA · BU NINGSIH" */}
        <mesh position={[0, 0.3, 0.515]}>
          <planeGeometry args={[2.4, 0.5]} />
          <meshStandardMaterial
            map={nurserySignTex}
            emissiveMap={nurserySignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.52 : 0.1}
          />
        </mesh>

        {/* Baris Depan (y = 0.56): Kaktus Mini & Pot Terakota Lucu */}
        {[-0.95, -0.48, 0, 0.48, 0.95].map((px, pi) => (
          <group key={`cact-${pi}`} position={[px, 0.56, 0.28]}>
            <mesh position={[0, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.085, 0.2, 10]} />
              <meshStandardMaterial color={pi % 2 === 0 ? '#c2643a' : '#d47a4d'} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.28, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.16, 6, 8]} />
              <meshStandardMaterial color={pi % 2 === 0 ? '#22c55e' : '#16a34a'} roughness={0.72} />
            </mesh>
          </group>
        ))}

        {/* Baris Tengah (y = 1.08): Monstera Daun Lebar & Bougenville Berbunga Pink */}
        {[-0.85, -0.28, 0.28, 0.85].map((px, pi) => (
          <group key={`monst-${pi}`} position={[px, 1.08, -0.06]}>
            <mesh position={[0, 0.13, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.105, 0.26, 10]} />
              <meshStandardMaterial color="#b4532a" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.36, 0]} castShadow>
              <icosahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial color={pi % 2 === 0 ? '#15803d' : '#166534'} roughness={0.8} />
            </mesh>
            {pi % 2 === 1 && (
              <mesh position={[0.08, 0.48, 0.06]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial color="#ec4899" roughness={0.68} />
              </mesh>
            )}
          </group>
        ))}

        {/* Baris Atas (y = 1.54): Lidah Mertua (Sansevieria) Tegak Elegan */}
        {[-0.8, 0, 0.8].map((px, pi) => (
          <group key={`sanse-${pi}`} position={[px, 1.54, -0.4]}>
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.1, 0.24, 10]} />
              <meshStandardMaterial color="#c96b40" roughness={0.85} />
            </mesh>
            {[-0.05, 0, 0.05].map((bx, bi) => (
              <mesh key={`bld-${pi}-${bi}`} position={[bx, 0.42, (bi - 1) * 0.03]} rotation={[0, bi * 0.4, (bi - 1) * 0.08]}>
                <boxGeometry args={[0.045, 0.46, 0.014]} />
                <meshStandardMaterial color={bi === 1 ? '#4ade80' : '#166534'} roughness={0.72} />
              </mesh>
            ))}
          </group>
        ))}

        {/* 2 Karung Pupuk Organik & Gembor Penyiram Hijau di Sisi Lapak */}
        <mesh position={[-1.48, 0.24, 0.15]} castShadow>
          <cylinderGeometry args={[0.22, 0.25, 0.48, 10]} />
          <meshStandardMaterial color="#d6c5a3" roughness={0.92} />
        </mesh>
        <mesh position={[1.48, 0.16, 0.22]} castShadow>
          <cylinderGeometry args={[0.12, 0.13, 0.28, 10]} />
          <meshStandardMaterial color="#22c55e" roughness={0.5} />
        </mesh>

        {/* Rangka Kayu Kanopi Teduh + 2 Pot Gantung Sirih Gading Mengayun */}
        {[
          [-1.32, -0.58],
          [1.32, -0.58],
          [-1.32, 0.55],
          [1.32, 0.55],
        ].map(([cx, cz], ci) => (
          <mesh key={`np-${ci}`} position={[cx, 1.38, cz]} castShadow>
            <cylinderGeometry args={[0.035, 0.04, 2.74, 8]} />
            <meshStandardMaterial color="#593c26" roughness={0.84} />
          </mesh>
        ))}
        <mesh position={[0, 2.76, 0]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.05, 0.06, 1.72]} />
          <meshStandardMaterial color="#166534" roughness={0.74} />
        </mesh>

        {/* 2 Pot Gantung Sirih Gading */}
        {[
          { ref: hangingPotLRef, x: -0.95 },
          { ref: hangingPotRRef, x: 0.95 },
        ].map((hp, hi) => (
          <group key={`hpot-${hi}`} ref={hp.ref} position={[hp.x, 2.68, 0.52]}>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
              <meshStandardMaterial color="#a88b67" roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.44, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.08, 0.16, 10]} />
              <meshStandardMaterial color="#c2643a" roughness={0.84} />
            </mesh>
            <mesh position={[0, -0.52, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#4ade80" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Bohlam Hangat Lapak Tanaman */}
        <mesh position={[0, 2.52, 0.25]}>
          <sphereGeometry args={[0.068, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.1}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.52, 0.25]} scale={[1.6, 1.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.52 : 0.36}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Bu Ningsih Ramah di Belakang Lapak (world [-67.2, 0, 35.85]) */}
        <group position={[0, 0, -1.25]}>
          <HumanModel
            profile={BU_NINGSIH_PROFILE}
            headRef={ningsihHeadRef}
            rightArmRef={ningsihRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. AGEN GALON AIR & ISI ULANG PAK AHMAD ([25.2, 0, 39.2], +Z)        */}
      {/* ==================================================================== */}
      <group position={[25.2, 0, 39.2]}>
        {/* Kios Depot Air Minum Isi Ulang RO Biru-Putih Bersih */}
        <mesh position={[0, 1.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.82, 2.76, 1.66]} />
          <meshStandardMaterial color="#f0f9ff" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.45, 0.02]}>
          <boxGeometry args={[2.86, 0.9, 1.68]} />
          <meshStandardMaterial color="#0284c7" roughness={0.55} />
        </mesh>
        {/* Atap Kanopi Biru-Putih Melindungi Pembeli dari Hujan */}
        <mesh position={[0, 2.84, 0.56]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[3.22, 0.14, 2.76]} />
          <meshStandardMaterial color="#0369a1" roughness={0.58} />
        </mesh>

        {/* Spanduk Atas HD "DEPOT AIR ISI ULANG RO · TIRTA MELATI · PAK AHMAD" */}
        <mesh position={[0, 2.48, 0.86]}>
          <planeGeometry args={[2.72, 0.62]} />
          <meshStandardMaterial
            map={depotSignTex}
            emissiveMap={depotSignTex}
            emissive="#e0f2fe"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.12}
          />
        </mesh>

        {/* Etalase Kaca Pengisian Galon RO + Lampu Sterilisasi UV Biru */}
        <group position={[0.25, 1.46, 0.78]}>
          <mesh position={[0, 0, -0.1]}>
            <boxGeometry args={[1.56, 1.12, 0.28]} />
            <meshStandardMaterial color="#0c4a6e" roughness={0.4} />
          </mesh>
          {/* Tabung Lampu UV Biru Sterilisasi */}
          <mesh position={[0, 0.44, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 1.32, 10]} />
            <meshStandardMaterial
              ref={uvTubeMatRef}
              color="#7dd3fc"
              emissive="#38bdf8"
              emissiveIntensity={isEveningOrNight ? 2.0 : 1.1}
            />
          </mesh>
          {/* 2 Galon di Dalam Ruang Pengisian */}
          <WaterGallon19L position={[-0.36, -0.42, -0.02]} scale={0.92} />
          <WaterGallon19L position={[0.36, -0.42, -0.02]} scale={0.92} />
          {/* Kaca Depan Bening */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[1.58, 1.14]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
          </mesh>
        </group>

        {/* Tumpukan Rapi 8 Galon Air Mineral Biru 19L di Rak Depan-Kiri */}
        {[-1.12, -0.8, -0.48, -0.16].map((gx, gi) => (
          <group key={`gal-col-${gi}`}>
            <WaterGallon19L position={[gx, 0, 1.06]} />
            {gi < 3 && <WaterGallon19L position={[gx + 0.16, 0.48, 1.06]} />}
          </group>
        ))}

        {/* Sepeda Pengantar Galon Pak Ahmad dengan Rak Besi Belakang di Sisi Timur (world [27.45, 0, 39.55]) */}
        <group position={[2.25, 0, 0.35]}>
          {/* 2 Roda Sepeda */}
          {[-0.48, 0.48].map((bz, bi) => (
            <mesh key={`gbw-${bi}`} position={[0, 0.34, bz]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.32, 0.04, 8, 16]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
          ))}
          {/* Rangka Sepeda Biru Tua + Stang + Sadel */}
          <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.96, 8]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.96, 0.42]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.56, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.86, -0.08]}>
            <boxGeometry args={[0.16, 0.06, 0.24]} />
            <meshStandardMaterial color="#27272a" roughness={0.82} />
          </mesh>
          {/* Rak Besi Boncengan Galon Kiri & Kanan berisi 2 Galon 19L! */}
          <mesh position={[0, 0.52, -0.45]} castShadow>
            <boxGeometry args={[0.78, 0.06, 0.42]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.45} />
          </mesh>
          <WaterGallon19L position={[-0.24, 0.55, -0.45]} scale={0.92} />
          <WaterGallon19L position={[0.24, 0.55, -0.45]} scale={0.92} />
        </group>

        {/* Pak Ahmad Ramah Berdiri di Sisi Barat Depot (world [23.35, 0, 40.15]) */}
        <group position={[-1.85, 0, 0.95]}>
          <HumanModel
            profile={PAK_AHMAD_PROFILE}
            headRef={ahmadHeadRef}
            rightArmRef={ahmadRightArmRef}
          />
        </group>
      </group>
    </group>
  );
};
