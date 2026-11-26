import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface NeighborhoodIceCreamFruitAndPortalProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MAS_EKO_ESKRIM_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mas Eko',
  role: 'Penjual Es Krim Keliling Jl. Melati',
  accentColor: '#38bdf8',
  voice: { pitch: 1.02, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.7,
    shirtColor: '#0284c7',
    pantsColor: '#1e293b',
    skinColor: '#cf9e77',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

const MBAK_SARI_BUAH_PROFILE: CharacterProfile = {
  id: 'mbak_lilis',
  name: 'Mbak Sari',
  role: 'Penjual Buah Segar Lokal',
  accentColor: '#fb923c',
  voice: { pitch: 1.08, rate: 1.0, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.62,
    shirtColor: '#ea580c',
    pantsColor: '#1e293b',
    skinColor: '#d9ac88',
    hairColor: '#231b17',
    accentProp: 'apron',
  },
};

function createIceCreamBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 176);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.5, '#38bdf8');
  grad.addColorStop(1, '#f472b6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 176);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 160);

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(14, 118, 484, 44);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ES KRIM KELILING', 256, 52);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('MAS EKO · BEL MELODI SORE', 256, 94);

  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('ES POTONG ROTI · CONE STROBERI · COKELAT · VANILA', 256, 140);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createFruitStallBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.55, '#1d4ed8');
  grad.addColorStop(1, '#ea580c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LAPAK BUAH SEGAR', 320, 52);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('MBAK SARI · PILIHAN LOKAL HARIAN', 320, 96);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('MANGGA HARUM MANIS · JERUK MEDAN · PISANG RAJA · SEMANGKA', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createMelatiPortalSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(0, 0, 768, 176);

  // Bingkai loreng merah-putih khas gerbang RT perumahan Indonesia
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 768, 22);
  ctx.fillRect(0, 154, 768, 22);
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 22, 756, 132);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PERUMAHAN JL. MELATI · RT 04', 384, 68);

  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('TAMU HARAP LAPOR  ·  KECEPATAN MAKS 20 KM/J', 384, 118);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 2 — Warna-Warni Sore Kompleks:
 * 1. Gerobak Es Krim Keliling Mas Eko + Bel Melodi ([-5.6, 0, 53.3]) di Tepi Jl. Melati
 * 2. Lapak Buah Segar Mbak Sari ([12.4, 0, 14.8]) di Sudut Tenggara Perempatan Utama
 * 3. Portal Palang Pintu Masuk Jl. Melati ([-10.8, 0, 48.0]) lengkap dengan Papan Nama, Lampu Suar & Cermin Cembung
 */
export const NeighborhoodIceCreamFruitAndPortal: React.FC<NeighborhoodIceCreamFruitAndPortalProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const iceCreamBannerTex = useMemo(() => createIceCreamBannerTexture(), []);
  const fruitBannerTex = useMemo(() => createFruitStallBannerTexture(), []);
  const portalSignTex = useMemo(() => createMelatiPortalSignTexture(), []);

  useEffect(() => {
    return () => {
      iceCreamBannerTex.dispose();
      fruitBannerTex.dispose();
      portalSignTex.dispose();
    };
  }, [iceCreamBannerTex, fruitBannerTex, portalSignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const ekoHeadRef = useRef<THREE.Group>(null);
  const ekoRightArmRef = useRef<THREE.Group>(null);
  const sariHeadRef = useRef<THREE.Group>(null);
  const sariRightArmRef = useRef<THREE.Group>(null);
  const fruitScaleRef = useRef<THREE.Group>(null);
  const portalArmRef = useRef<THREE.Group>(null);
  const beaconMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const beaconSpriteRef = useRef<THREE.Sprite>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Mas Eko Es Krim Keliling (sapaan ramah & memencet bel sepeda!)
    if (!shouldSkipPerfFrame(-5.6, 53.3, 46)) {
      const distEko = py > 4 ? 99 : Math.hypot(px - -5.6, pz - 53.3);
      if (ekoHeadRef.current) {
        ekoHeadRef.current.rotation.y = Math.sin(t * 1.05) * 0.24;
      }
      if (ekoRightArmRef.current) {
        ekoRightArmRef.current.rotation.x =
          distEko < 5.5
            ? -1.65 + Math.sin(t * 5.6) * 0.25
            : -0.72 + Math.sin(t * 2.2) * 0.14;
      }
    }

    // 2. Animasi Mbak Sari & Timbangan Gantung Lapak Buah Segar
    if (playerRuntime.fruitScaleSwingTimer > 0) {
      playerRuntime.fruitScaleSwingTimer = Math.max(0, playerRuntime.fruitScaleSwingTimer - dt);
    }
    if (!shouldSkipPerfFrame(12.4, 14.8, 46)) {
      const distSari = py > 4 ? 99 : Math.hypot(px - 12.4, pz - 14.8);
      if (sariHeadRef.current) {
        sariHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.22;
      }
      if (sariRightArmRef.current) {
        sariRightArmRef.current.rotation.x =
          distSari < 5.5
            ? -1.55 + Math.sin(t * 4.8) * 0.2
            : -0.68 + Math.sin(t * 2.0) * 0.12;
      }
      if (fruitScaleRef.current) {
        const boost = playerRuntime.fruitScaleSwingTimer > 0 ? 0.16 : 0.032;
        fruitScaleRef.current.rotation.z = Math.sin(t * (boost > 0.1 ? 4.8 : 1.6)) * boost;
      }
    }

    // 3. Animasi Palang Portal Pintu Masuk Jl. Melati & Lampu Suar Malam
    if (playerRuntime.melatiPortalTimer > 0) {
      playerRuntime.melatiPortalTimer = Math.max(0, playerRuntime.melatiPortalTimer - dt);
    }
    if (!shouldSkipPerfFrame(-10.8, 48.0, 52)) {
      if (portalArmRef.current) {
        // Posisi normal terangkat terbuka lebar (74° ke atas agar jalan bebas 100%);
        // Saat diuji [E], palang turun lembut separuh jalan lalu kembali terangkat!
        const pTimer = playerRuntime.melatiPortalTimer;
        const dip = pTimer > 0 ? Math.sin((pTimer / 4.5) * Math.PI) * 0.82 : 0;
        const targetAngle = 1.28 - dip;
        portalArmRef.current.rotation.x = THREE.MathUtils.lerp(portalArmRef.current.rotation.x, targetAngle, dt * 5.2);
      }
      const pulse = 0.55 + 0.45 * Math.sin(t * 3.6);
      if (beaconMatRef.current) {
        beaconMatRef.current.emissiveIntensity = isEveningOrNight ? 1.4 + pulse * 1.8 : 0.15;
      }
      if (beaconSpriteRef.current) {
        beaconSpriteRef.current.visible = isEveningOrNight && settings.cinematicGlow;
        (beaconSpriteRef.current.material as THREE.SpriteMaterial).opacity =
          (isDarkNight ? 0.58 : 0.36) * pulse;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK ES KRIM KELILING MAS EKO + BEL MELODI ([-5.6, 0, 53.3])   */}
      {/* ==================================================================== */}
      <group position={[-5.6, 0, 53.3]} rotation={[0, Math.PI, 0]}>
        {/* Boks Freezer Es Krim Biru Langit - Pink Pastel */}
        <mesh position={[0, 0.64, 0.16]} castShadow receiveShadow>
          <boxGeometry args={[1.22, 0.72, 0.86]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.42} />
        </mesh>
        {/* Lis Bawah Pink Ceria & Tutup Atas Stainless */}
        <mesh position={[0, 0.32, 0.16]} castShadow>
          <boxGeometry args={[1.26, 0.12, 0.9]} />
          <meshStandardMaterial color="#f472b6" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.02, 0.16]} castShadow>
          <boxGeometry args={[1.26, 0.06, 0.9]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.68} roughness={0.22} />
        </mesh>
        {/* 2 Tutup Bulat Freezer Es Krim Stainless */}
        {[-0.28, 0.28].map((lx, li) => (
          <mesh key={`iclid-${li}`} position={[lx, 1.07, 0.14]} castShadow>
            <cylinderGeometry args={[0.18, 0.19, 0.05, 14]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.78} roughness={0.18} />
          </mesh>
        ))}

        {/* Tabung Cone Renyah, Kotak Roti Tawar & Celupan Cokelat di Counter */}
        <mesh position={[-0.48, 1.24, 0.44]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.38, 12]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.45} />
        </mesh>
        <mesh position={[0.46, 1.15, 0.42]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.2]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.65} />
        </mesh>

        {/* Spanduk Depan HD "ES KRIM KELILING · MAS EKO" (Menghadap Jl. Melati) */}
        <mesh position={[0, 0.68, 0.605]}>
          <planeGeometry args={[1.14, 0.44]} />
          <meshStandardMaterial
            map={iceCreamBannerTex}
            emissiveMap={iceCreamBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.6 : 0.12}
          />
        </mesh>

        {/* 2 Roda Sepeda Gerobak Besar Kiri & Kanan */}
        {[-0.68, 0.68].map((wx, wi) => (
          <group key={`icw-${wi}`} position={[wx, 0.34, 0.16]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.31, 0.042, 8, 18]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.08, 10]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* Rangka Sepeda Belakang + Stang + Bel Melodi Krom + Sadel */}
        <mesh position={[0, 0.68, -0.44]} rotation={[0.45, 0, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.72, 8]} />
          <meshStandardMaterial color="#0369a1" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.96, -0.34]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.62, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.22} />
        </mesh>
        {/* Bel Melodi Es Krim Berkilau di Stang Kanan */}
        <mesh position={[-0.22, 1.01, -0.34]}>
          <sphereGeometry args={[0.042, 10, 8]} />
          <meshStandardMaterial color="#facc15" metalness={0.85} roughness={0.18} />
        </mesh>
        {/* Sadel Sepeda */}
        <mesh position={[0, 0.88, -0.68]} castShadow>
          <boxGeometry args={[0.16, 0.07, 0.24]} />
          <meshStandardMaterial color="#27272a" roughness={0.8} />
        </mesh>

        {/* Payung Kanopi Pastel Pink-Biru Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 1.72, 0.1]} castShadow>
          <cylinderGeometry args={[0.036, 0.04, 2.08, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.74, 0.1]} castShadow>
          <coneGeometry args={[1.38, 0.38, 10]} />
          <meshStandardMaterial color="#f472b6" roughness={0.62} />
        </mesh>
        <mesh position={[0, 2.75, 0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.39, 0.38, 5]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.62} />
        </mesh>

        {/* Bohlam Hangat Gerobak Es Krim Malam */}
        <mesh position={[0, 2.26, 0.32]}>
          <sphereGeometry args={[0.062, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffd27a"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.1}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.26, 0.32]} scale={[1.5, 1.5, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffe09e"
              transparent
              opacity={isDarkNight ? 0.56 : 0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Mas Eko Ramah Berdiri di Sisi Belakang Gerobak (world [-5.6, 0, 54.32]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={MAS_EKO_ESKRIM_PROFILE}
            headRef={ekoHeadRef}
            rightArmRef={ekoRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pastel Mungil di Sisi Timur Gerobak (world [-3.85, 0, 53.25]) */}
        <group position={[-1.75, 0, 0.05]}>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.92, 0.07, 0.44]} />
            <meshStandardMaterial color="#bae6fd" roughness={0.72} />
          </mesh>
          {[-0.34, 0.34].map((bx, bi) => (
            <mesh key={`icb-${bi}`} position={[bx, 0.2, 0]} castShadow>
              <boxGeometry args={[0.08, 0.4, 0.36]} />
              <meshStandardMaterial color="#0369a1" roughness={0.78} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. LAPAK BUAH SEGAR MBAK SARI ([12.4, 0, 14.8], menghadap -X)        */}
      {/* ==================================================================== */}
      <group position={[12.4, 0, 14.8]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Meja Rak Kayu Bertingkat Penuh Buah Lokal */}
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.86, 1.18]} />
          <meshStandardMaterial color="#784c2a" roughness={0.82} />
        </mesh>
        {/* Lapisan Atas Rak Miring Halus ke Depan */}
        <mesh position={[0, 0.94, 0.04]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[2.52, 0.08, 1.24]} />
          <meshStandardMaterial color="#9c663a" roughness={0.78} />
        </mesh>

        {/* Spanduk Depan HD "LAPAK BUAH SEGAR · MBAK SARI" */}
        <mesh position={[0, 0.54, 0.61]}>
          <planeGeometry args={[2.32, 0.6]} />
          <meshStandardMaterial
            map={fruitBannerTex}
            emissiveMap={fruitBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.56 : 0.12}
          />
        </mesh>

        {/* 5 KERANJANG BUAH LOKAL PENUH WARNA */}
        {/* Keranjang 1: Mangga Harum Manis (Hijau-Kuning) */}
        <group position={[-0.92, 1.04, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.16, 0.52]} />
            <meshStandardMaterial color="#b4834c" roughness={0.88} />
          </mesh>
          {[-0.1, 0.08, -0.02, 0.11].map((mx, mi) => (
            <mesh key={`mng-${mi}`} position={[mx, 0.1, (mi - 1.5) * 0.1]} rotation={[0.3, mi * 0.8, 0.5]} castShadow>
              <capsuleGeometry args={[0.055, 0.075, 5, 8]} />
              <meshStandardMaterial color={mi % 2 === 0 ? '#65a30d' : '#eab308'} roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Keranjang 2: Jeruk Medan Segar (Oranye Cerah) */}
        <group position={[-0.45, 1.04, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.16, 0.52]} />
            <meshStandardMaterial color="#b4834c" roughness={0.88} />
          </mesh>
          {[
            [-0.1, 0.1, -0.1],
            [0.08, 0.1, -0.08],
            [-0.08, 0.1, 0.1],
            [0.09, 0.1, 0.1],
            [0, 0.18, 0],
          ].map(([ox, oy, oz], oi) => (
            <mesh key={`org-${oi}`} position={[ox, oy, oz]} castShadow>
              <sphereGeometry args={[0.068, 10, 8]} />
              <meshStandardMaterial color="#f97316" roughness={0.48} />
            </mesh>
          ))}
        </group>

        {/* Keranjang 3: Sisir Pisang Raja Kuning Matang */}
        <group position={[0.02, 1.04, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.16, 0.52]} />
            <meshStandardMaterial color="#b4834c" roughness={0.88} />
          </mesh>
          {[-0.08, 0.04, 0.12].map((pz, pi) => (
            <mesh key={`ban-${pi}`} position={[0, 0.14, pz]} rotation={[0.2, 0.1, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.11, 0.032, 6, 12, Math.PI * 0.85]} />
              <meshStandardMaterial color="#facc15" roughness={0.55} />
            </mesh>
          ))}
        </group>

        {/* Keranjang 4: Semangka Segar Utuh & Belahan Merah Cerah */}
        <group position={[0.5, 1.04, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.46, 0.16, 0.54]} />
            <meshStandardMaterial color="#b4834c" roughness={0.88} />
          </mesh>
          <mesh position={[-0.1, 0.15, -0.08]} castShadow>
            <sphereGeometry args={[0.125, 12, 10]} />
            <meshStandardMaterial color="#15803d" roughness={0.48} />
          </mesh>
          <mesh position={[0.1, 0.15, 0.08]} castShadow>
            <sphereGeometry args={[0.12, 12, 10]} />
            <meshStandardMaterial color="#166534" roughness={0.48} />
          </mesh>
          {/* Belahan Semangka Merah Menggoda */}
          <mesh position={[-0.06, 0.16, 0.14]} rotation={[0.55, 0.3, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.04, 12, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#ef4444" roughness={0.42} />
          </mesh>
        </group>

        {/* Keranjang 5: Apel Malang Merah & Salak */}
        <group position={[0.96, 1.04, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.16, 0.52]} />
            <meshStandardMaterial color="#b4834c" roughness={0.88} />
          </mesh>
          {[
            [-0.08, 0.11, -0.08],
            [0.08, 0.11, -0.06],
            [-0.06, 0.11, 0.1],
            [0.08, 0.11, 0.08],
            [0, 0.18, 0.01],
          ].map(([ax, ay, az], ai) => (
            <mesh key={`apl-${ai}`} position={[ax, ay, az]} castShadow>
              <sphereGeometry args={[0.058, 9, 8]} />
              <meshStandardMaterial color={ai % 2 === 0 ? '#dc2626' : '#854d0e'} roughness={0.45} />
            </mesh>
          ))}
        </group>

        {/* 4 Tiang Rangka & Terpal Atap Biru-Oranye Teduh (Melindungi dari Hujan) */}
        {[
          [-1.22, -0.62],
          [1.22, -0.62],
          [-1.22, 0.62],
          [1.22, 0.62],
        ].map(([px, pz], pi) => (
          <mesh key={`fp-${pi}`} position={[px, 1.38, pz]} castShadow>
            <cylinderGeometry args={[0.032, 0.036, 2.74, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.45} />
          </mesh>
        ))}
        {/* Terpal Biru Utama + Lis Oranye Khas Lapak Buah Indonesia */}
        <mesh position={[0, 2.78, 0]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.86, 0.06, 1.88]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.72} />
        </mesh>
        <mesh position={[0, 2.66, 0.94]}>
          <boxGeometry args={[2.86, 0.22, 0.04]} />
          <meshStandardMaterial color="#ea580c" roughness={0.7} />
        </mesh>

        {/* Timbangan Gantung Kuningan Mengayun Halus di Balok Depan */}
        <group ref={fruitScaleRef} position={[-0.78, 2.52, 0.56]}>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.36, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Dial Timbangan Bundar */}
          <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 14]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} />
          </mesh>
          <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.122, 0.016, 6, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Wadah Piringan Timbangan */}
          <mesh position={[0, -0.68, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.11, 0.08, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.65} roughness={0.32} />
          </mesh>
        </group>

        {/* Bohlam Hangat Lapak Buah */}
        <mesh position={[0.25, 2.48, 0.25]}>
          <sphereGeometry args={[0.072, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.7 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0.25, 2.48, 0.25]} scale={[1.7, 1.7, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd285"
              transparent
              opacity={isDarkNight ? 0.58 : 0.42}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Mbak Sari Ramah di Belakang Lapak (world [13.65, 0, 14.8]) */}
        <group position={[0, 0, -1.25]}>
          <HumanModel
            profile={MBAK_SARI_BUAH_PROFILE}
            headRef={sariHeadRef}
            rightArmRef={sariRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. PORTAL PALANG PINTU MASUK JL. MELATI ([-10.8, 0, 48.0])           */}
      {/* ==================================================================== */}
      <group position={[-10.8, 0, 48.0]}>
        {/* 2 Pilar Gerbang Portal Kokoh Loreng Putih-Merah (z = -3.7 & z = +3.7; jalan 7,4m terbuka!) */}
        {[-3.7, 3.7].map((pz, pi) => (
          <group key={`ppil-${pi}`} position={[0, 0, pz]}>
            {/* Umpak Beton Bawah */}
            <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.56, 0.48, 0.56]} />
              <meshStandardMaterial color="#e5e7eb" roughness={0.85} />
            </mesh>
            {/* Tiang Besi Loreng Putih-Merah 5 Segmen */}
            {[0, 1, 2, 3, 4].map((si) => (
              <mesh key={`pseg-${pi}-${si}`} position={[0, 0.8 + si * 0.66, 0]} castShadow>
                <cylinderGeometry args={[0.13, 0.14, 0.66, 12]} />
                <meshStandardMaterial
                  color={si % 2 === 0 ? '#dc2626' : '#f8fafc'}
                  roughness={0.48}
                  metalness={0.25}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Balok Lengkung Atas Portal (y = 3.85m — 100% bebas dilewati pejalan kaki, sepeda & motor!) */}
        <mesh position={[0, 3.92, 0]} castShadow>
          <boxGeometry args={[0.24, 0.24, 7.65]} />
          <meshStandardMaterial color="#dc2626" metalness={0.35} roughness={0.45} />
        </mesh>

        {/* Papan Nama Gerbang HD Dua Sisi "PERUMAHAN JL. MELATI · RT 04 · TAMU HARAP LAPOR" */}
        <group position={[0, 3.68, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.96, 4.4]} />
            <meshStandardMaterial color="#991b1b" roughness={0.6} />
          </mesh>
          {/* Sisi Timur (Dilihat saat pulang dari Kota masuk Jl. Melati) */}
          <mesh position={[0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[4.28, 0.88]} />
            <meshStandardMaterial
              map={portalSignTex}
              emissiveMap={portalSignTex}
              emissive="#fff3d6"
              emissiveIntensity={isEveningOrNight ? 0.58 : 0.1}
            />
          </mesh>
          {/* Sisi Barat (Dilihat saat keluar dari Rumah Damar) */}
          <mesh position={[-0.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[4.28, 0.88]} />
            <meshStandardMaterial
              map={portalSignTex}
              emissiveMap={portalSignTex}
              emissive="#fff3d6"
              emissiveIntensity={isEveningOrNight ? 0.58 : 0.1}
            />
          </mesh>
        </group>

        {/* Palang Portal Besi Loreng Merah-Putih Berengsel di Pilar Selatan (Terangkat Terbuka!) */}
        <group position={[0, 1.08, 3.52]}>
          {/* Kotak Mekanisme Engsel & Tiang Penumpu */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.32, 0.34, 0.28]} />
            <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.4} />
          </mesh>
          <group ref={portalArmRef} rotation={[1.28, 0, 0]}>
            {/* Lengan Palang 6 Segmen Loreng Merah-Putih Menjulur ke Utara (-Z lokal) */}
            {[0, 1, 2, 3, 4, 5].map((bi) => (
              <mesh key={`bar-${bi}`} position={[0, 0, -0.45 - bi * 0.65]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.048, 0.048, 0.65, 10]} />
                <meshStandardMaterial
                  color={bi % 2 === 0 ? '#ef4444' : '#ffffff'}
                  roughness={0.42}
                  metalness={0.28}
                />
              </mesh>
            ))}
            {/* Beban Pengimbang (Counterweight) di Ujung Belakang Palang */}
            <mesh position={[0, 0, 0.42]} castShadow>
              <boxGeometry args={[0.24, 0.24, 0.34]} />
              <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.55} />
            </mesh>
          </group>
        </group>

        {/* Lampu Suar Oranye Berkedip Halus di Puncak Pilar Selatan */}
        <mesh position={[0, 4.18, 3.7]}>
          <cylinderGeometry args={[0.09, 0.11, 0.22, 12]} />
          <meshStandardMaterial
            ref={beaconMatRef}
            color="#fb923c"
            emissive="#f97316"
            emissiveIntensity={isEveningOrNight ? 2.2 : 0.15}
            roughness={0.25}
          />
        </mesh>
        <sprite
          ref={beaconSpriteRef}
          position={[0, 4.18, 3.7]}
          scale={[1.8, 1.8, 1]}
          visible={isEveningOrNight && settings.cinematicGlow}
        >
          <spriteMaterial
            map={textures.glowSprite}
            color="#fb923c"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {/* Cermin Cembung Jalan (Convex Traffic Mirror) Oranye di Pilar Utara */}
        <group position={[0.28, 2.45, -3.7]} rotation={[0.14, 0.68, 0]}>
          {/* Batang Penyangga Cermin */}
          <mesh position={[-0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Bingkai Tudung Oranye Khas Cermin Tikungan */}
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.1, 20]} />
            <meshStandardMaterial color="#ea580c" roughness={0.45} />
          </mesh>
          {/* Permukaan Kaca Cermin Cembung Mengilap */}
          <mesh position={[0.04, 0, 0]} scale={[0.35, 1, 1]}>
            <sphereGeometry args={[0.36, 16, 12, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.94} roughness={0.08} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
