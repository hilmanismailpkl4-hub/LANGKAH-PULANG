import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface CafeAndNightStreetLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MAS_AGUNG_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mas Agung',
  role: 'Penjual Bakso Malang Keliling',
  accentColor: '#fbbf24',
  voice: { pitch: 0.98, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#e2e8f0',
    pantsColor: '#293240',
    skinColor: '#cfa17a',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

function createChalkboardMenuTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  // Papan tulis kapur gelap bertekstur debu kapur halus
  ctx.fillStyle = '#1e2421';
  ctx.fillRect(0, 0, 384, 512);
  ctx.strokeStyle = '#d9ccb2';
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, 356, 484);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('KOPI SUDUT BIMA', 192, 62);

  ctx.fillStyle = '#f5b963';
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillText('~ Menu Racikan Hari Ini ~', 192, 92);

  ctx.strokeStyle = 'rgba(245, 222, 179, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(42, 112);
  ctx.lineTo(342, 112);
  ctx.stroke();

  const items: [string, string][] = [
    ['Kopi Gula Aren', '18K'],
    ['V60 Manual Brew', '20K'],
    ['Cokelat Hangat', '22K'],
    ['Teh Chamomile', '16K'],
    ['Roti Kayu Manis', '16K'],
    ['Es Kopi Susu Senja', '19K'],
  ];

  ctx.textAlign = 'left';
  ctx.font = 'bold 21px sans-serif';
  items.forEach(([name, price], i) => {
    const y = 158 + i * 44;
    ctx.fillStyle = '#f5f0e4';
    ctx.fillText(name, 38, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fcd34d';
    ctx.fillText(price, 346, y);
    ctx.textAlign = 'left';
  });

  ctx.strokeStyle = 'rgba(245, 222, 179, 0.35)';
  ctx.beginPath();
  ctx.moveTo(42, 420);
  ctx.lineTo(342, 420);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#cbd5c0';
  ctx.font = 'italic 17px Georgia, serif';
  ctx.fillText('"Pelan-pelan saja,', 192, 452);
  ctx.fillText('sore masih panjang."', 192, 476);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createBaksoBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#9a2822');
  grad.addColorStop(0.5, '#b8322a');
  grad.addColorStop(1, '#8c221d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BAKSO MALANG', 320, 56);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 25px sans-serif';
  ctx.fillText('MAS AGUNG · KELILING MALAM', 320, 98);

  ctx.fillStyle = '#7f1d1d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('BAKSO URAT · MIE AYAM · PANGSIT GORENG', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createWarungSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 640, 160);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 114, 640, 46);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 7;
  ctx.strokeRect(7, 7, 626, 146);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WARUNG BU RINA', 320, 54);

  ctx.fillStyle = '#bbf7d0';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('SUDUT PERUMAHAN MELATI · BUKA SORE–MALAM', 320, 94);

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('SEMBAKO · KOPI SEDUH · GORENGAN · PULSA', 320, 138);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createWarungNeonOpenTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1a1423';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 240, 112);
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BUKA', 128, 52);
  ctx.fillStyle = '#5eead4';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('KOPI & SNACK', 128, 96);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const BaksoSteam: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 4; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = ((t * 0.54 + i * 0.25) % 1 + 1) % 1;
      m.position.y = p * 0.68;
      m.position.x = Math.sin(t * 2.0 + i * 1.7) * 0.07 * p;
      m.position.z = Math.cos(t * 1.6 + i * 1.9) * 0.06 * p;
      const s = 0.45 + p * 1.25;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.34;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`bs-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshBasicMaterial color="#fff9f0" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Suasana Kafe & Jalan Malam:
 * 1. Kucing rumahan "Moka" bergelung tidur pulas di kursi sudut Kedai Kopi Bima + Papan Menu Kapur Tulis Tangan
 * 2. Gerobak Bakso Malang Keliling Mas Agung di tepi Jl. Melati + suara ketukan mangkuk "ting-ting-ting!"
 * 3. Warung Sudut Perumahan Melati ("Warung Bu Rina") dengan papan & lampu neon hangat otomatis saat senja–malam
 */
export const CafeAndNightStreetLife: React.FC<CafeAndNightStreetLifeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const chalkboardTex = useMemo(() => createChalkboardMenuTexture(), []);
  const baksoBannerTex = useMemo(() => createBaksoBannerTexture(), []);
  const warungSignTex = useMemo(() => createWarungSignTexture(), []);
  const warungOpenTex = useMemo(() => createWarungNeonOpenTexture(), []);

  const catBodyRef = useRef<THREE.Group>(null);
  const catTailRef = useRef<THREE.Mesh>(null);
  const catHeartRef = useRef<THREE.Group>(null);
  const agungHeadRef = useRef<THREE.Group>(null);
  const agungRightArmRef = useRef<THREE.Group>(null);
  const lastClinkRef = useRef(0);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';
  const isRain = timeOfDay === 'rain_dusk';

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi napas lembut & ekor kucing "Moka" di kursi sudut Kedai Kopi Bima
    if (playerRuntime.cafeCatHeartTimer > 0) {
      playerRuntime.cafeCatHeartTimer = Math.max(0, playerRuntime.cafeCatHeartTimer - dt);
    }
    const beingPetted = playerRuntime.cafeCatHeartTimer > 0;

    if (catBodyRef.current) {
      const breath = 1 + Math.sin(t * (beingPetted ? 4.6 : 1.9)) * (beingPetted ? 0.05 : 0.032);
      catBodyRef.current.scale.set(1, breath, 1);
    }
    if (catTailRef.current) {
      catTailRef.current.rotation.y = Math.sin(t * (beingPetted ? 4.5 : 1.1)) * (beingPetted ? 0.25 : 0.08);
    }
    if (catHeartRef.current) {
      catHeartRef.current.visible = beingPetted;
      if (beingPetted) {
        catHeartRef.current.position.y = 0.85 + Math.sin(t * 4.5) * 0.07;
        catHeartRef.current.rotation.y = t * 2.2;
      }
    }

    // 2. Animasi Mas Agung mengetuk mangkuk bakso & bunyi "ting-ting-ting!" berkala
    const distBakso = py > 4 ? 99 : Math.hypot(px - -35.2, pz - 53.6);
    if (agungHeadRef.current) {
      agungHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.3;
    }
    if (agungRightArmRef.current) {
      agungRightArmRef.current.rotation.x =
        distBakso < 8.0 ? -1.15 + Math.sin(t * 9.5) * 0.16 : -0.5 + Math.sin(t * 1.8) * 0.08;
    }

    if (distBakso < 23 && useGameStore.getState().screen === 'playing') {
      const nowMs = Date.now();
      const interval = isEveningOrNight ? 15500 : 24000;
      if (nowMs - lastClinkRef.current > interval) {
        lastClinkRef.current = nowMs;
        sfxEngine.playBaksoClink(Math.max(0.2, 1 - distBakso / 25));
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1A. KUCING RUMAHAN "MOKA" BERGELUNG TIDUR DI KURSI SUDUT KEDAI BIMA  */}
      {/* ==================================================================== */}
      <group position={[-14.1, 0.08, 17.6]} rotation={[0, -0.68, 0]}>
        {/* Kursi Santai Kayu & Bantal Rajut Hangat */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.78, 0.12, 0.74]} />
          <meshStandardMaterial color="#8c623d" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.82, -0.32]} rotation={[-0.14, 0, 0]} castShadow>
          <boxGeometry args={[0.78, 0.72, 0.1]} />
          <meshStandardMaterial color="#7a5332" roughness={0.78} />
        </mesh>
        {/* Sandaran Tangan Kiri & Kanan */}
        {[-0.36, 0.36].map((ax, ai) => (
          <mesh key={`arm-${ai}`} position={[ax, 0.58, -0.02]} castShadow>
            <boxGeometry args={[0.07, 0.28, 0.68]} />
            <meshStandardMaterial color="#6e4a2c" roughness={0.78} />
          </mesh>
        ))}
        {/* 4 Kaki Kursi */}
        {[
          [-0.32, 0.2, 0.28],
          [0.32, 0.2, 0.28],
          [-0.32, 0.2, -0.28],
          [0.32, 0.2, -0.28],
        ].map(([lx, ly, lz], li) => (
          <mesh key={`cl-${li}`} position={[lx, ly, lz]} castShadow>
            <cylinderGeometry args={[0.032, 0.028, 0.4, 8]} />
            <meshStandardMaterial color="#593a21" roughness={0.82} />
          </mesh>
        ))}
        {/* Bantal Duduk Krem Lembut */}
        <mesh position={[0, 0.51, 0.02]} castShadow>
          <boxGeometry args={[0.66, 0.09, 0.62]} />
          <meshStandardMaterial color="#eadbc3" roughness={0.92} />
        </mesh>

        {/* Kucing Calico "Moka" Bergelung Tidur Pulas */}
        <group ref={catBodyRef} position={[0, 0.58, 0.03]}>
          {/* Badan Bulat Bergelung Krem-Moka */}
          <mesh scale={[1.15, 0.68, 0.98]} castShadow>
            <sphereGeometry args={[0.19, 14, 12]} />
            <meshStandardMaterial color="#d8b998" roughness={0.88} />
          </mesh>
          {/* Corak Belang Cokelat Kopi di Punggung */}
          <mesh position={[-0.06, 0.06, -0.04]} scale={[1.1, 0.7, 0.9]}>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial color="#6b452a" roughness={0.9} />
          </mesh>
          <mesh position={[0.08, 0.04, 0.05]} scale={[0.9, 0.65, 0.85]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#3b2b22" roughness={0.9} />
          </mesh>
          {/* Kepala Kucing Menyandar Nyaman + 2 Telinga Mungil */}
          <group position={[0.14, 0.05, 0.09]}>
            <mesh castShadow>
              <sphereGeometry args={[0.105, 12, 10]} />
              <meshStandardMaterial color="#e3c8ab" roughness={0.86} />
            </mesh>
            <mesh position={[-0.055, 0.095, -0.01]} rotation={[0, 0, 0.25]}>
              <coneGeometry args={[0.036, 0.075, 4]} />
              <meshStandardMaterial color="#6b452a" roughness={0.85} />
            </mesh>
            <mesh position={[0.055, 0.095, -0.01]} rotation={[0, 0, -0.25]}>
              <coneGeometry args={[0.036, 0.075, 4]} />
              <meshStandardMaterial color="#3b2b22" roughness={0.85} />
            </mesh>
            {/* Hidung Merah Muda Mungil */}
            <mesh position={[0.02, -0.005, 0.1]}>
              <sphereGeometry args={[0.016, 6, 6]} />
              <meshStandardMaterial color="#e88a96" roughness={0.6} />
            </mesh>
          </group>
          {/* Ekor Melingkar Halus */}
          <mesh ref={catTailRef} position={[-0.02, -0.01, 0.19]} rotation={[Math.PI / 2, 0, 0.2]}>
            <torusGeometry args={[0.14, 0.026, 8, 16, Math.PI * 0.92]} />
            <meshStandardMaterial color="#6b452a" roughness={0.88} />
          </mesh>
        </group>

        {/* Ikon Hati Hangat Melayang Saat Moka Dielus [E] */}
        <group ref={catHeartRef} position={[0, 0.88, 0.05]} visible={false}>
          <mesh>
            <octahedronGeometry args={[0.075, 0]} />
            <meshStandardMaterial color="#fb7185" emissive="#f43f5e" emissiveIntensity={2.2} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 1B. PAPAN MENU KAPUR TULIS TANGAN KAYU A-FRAME DI DEKAT KASIR BIMA   */}
      {/* ==================================================================== */}
      <group position={[-16.45, 0.08, 21.65]} rotation={[0, 0.15, 0]}>
        {/* Sisi Depan A-Frame Menghadap Pengunjung (-Z) */}
        <group position={[0, 0.62, -0.18]} rotation={[0.18, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.74, 1.18, 0.055]} />
            <meshStandardMaterial color="#5c3d28" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0.02, -0.032]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.64, 0.96]} />
            <meshStandardMaterial map={chalkboardTex} roughness={0.88} />
          </mesh>
        </group>
        {/* Sisi Belakang Penopang A-Frame */}
        <group position={[0, 0.62, 0.18]} rotation={[-0.18, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.74, 1.18, 0.055]} />
            <meshStandardMaterial color="#4f3320" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. GEROBAK BAKSO MALANG KELILING MAS AGUNG (TEPI SELATAN JL. MELATI)  */}
      {/* ==================================================================== */}
      <group position={[-35.2, 0, 53.6]}>
        {/* Badan Kayu Gerobak Bakso Biru-Krem */}
        <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.05, 0.86, 0.92]} />
          <meshStandardMaterial color="#1d5b79" roughness={0.62} />
        </mesh>
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[2.14, 0.07, 1.0]} />
          <meshStandardMaterial color="#c4955e" roughness={0.68} />
        </mesh>

        {/* Spanduk Depan & Belakang "BAKSO MALANG · MAS AGUNG" */}
        <mesh position={[0, 0.7, 0.47]}>
          <planeGeometry args={[1.92, 0.56]} />
          <meshStandardMaterial
            map={baksoBannerTex}
            emissiveMap={baksoBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.1}
          />
        </mesh>
        <mesh position={[0, 0.7, -0.47]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.92, 0.56]} />
          <meshStandardMaterial
            map={baksoBannerTex}
            emissiveMap={baksoBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.1}
          />
        </mesh>

        {/* Etalase Kaca Kiri Berisi Mangkuk Ayam Jago, Mi & Tahu */}
        <mesh position={[-0.42, 1.48, 0]}>
          <boxGeometry args={[1.05, 0.64, 0.78]} />
          <meshPhysicalMaterial
            color="#eef7ff"
            transparent
            opacity={0.34}
            roughness={0.12}
            metalness={0.08}
            clearcoat={0.85}
          />
        </mesh>
        {/* Tumpukan Mangkuk Porselen Putih-Merah + Mi Kuning + Bakso */}
        {[-0.72, -0.46].map((mx, mi) => (
          <group key={`bowl-st-${mi}`} position={[mx, 1.24, 0.08]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.07, 0.16, 12]} />
              <meshStandardMaterial color="#faf8f5" roughness={0.32} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.102, 0.102, 0.025, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.14, 1.24, 0.05]} castShadow>
          <boxGeometry args={[0.32, 0.14, 0.34]} />
          <meshStandardMaterial color="#f2c94c" roughness={0.78} />
        </mesh>

        {/* Dandang Kuah Kaldu Stainless Kanan + Uap Panas Mengepul! */}
        <mesh position={[0.56, 1.38, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.48, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.24} />
        </mesh>
        <mesh position={[0.56, 1.63, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.03, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.22} />
        </mesh>
        <BaksoSteam position={[0.56, 1.68, 0]} />

        {/* Botol Kecap Manis & Saus Sambal di Atas Etalase */}
        <mesh position={[-0.2, 1.9, 0.15]}>
          <cylinderGeometry args={[0.032, 0.036, 0.2, 8]} />
          <meshStandardMaterial color="#271a14" roughness={0.3} />
        </mesh>
        <mesh position={[-0.32, 1.9, 0.15]}>
          <cylinderGeometry args={[0.032, 0.036, 0.2, 8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>

        {/* 4 Tiang & Atap Seng Gerobak + Bohlam Kuning Hangat */}
        {[
          [-0.96, 1.65, 0.42],
          [0.96, 1.65, 0.42],
          [-0.96, 1.65, -0.42],
          [0.96, 1.65, -0.42],
        ].map(([tx, ty, tz], ti) => (
          <mesh key={`bt-${ti}`} position={[tx, ty, tz]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.25, 6]} />
            <meshStandardMaterial color="#4a3322" roughness={0.75} />
          </mesh>
        ))}
        <mesh position={[0, 2.3, 0]} castShadow>
          <boxGeometry args={[2.32, 0.1, 1.28]} />
          <meshStandardMaterial color="#9a2822" roughness={0.68} />
        </mesh>
        <mesh position={[0, 2.15, 0.12]}>
          <sphereGeometry args={[0.095, 10, 10]} />
          <meshStandardMaterial
            color="#fff2c6"
            emissive="#ffb84d"
            emissiveIntensity={isEveningOrNight ? 3.2 : 0.45}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.15, 0.12]} scale={[2.4, 2.4, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc76b"
              transparent
              opacity={0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight position={[0, 2.05, 0.55]} color="#ffbe63" intensity={12} distance={15} decay={1.8} />
        )}

        {/* Dua Roda Dorong Karet + Kaki Penyangga */}
        {[-0.48, 0.48].map((rz, ri) => (
          <mesh key={`brw-${ri}`} position={[-0.45, 0.34, rz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.08, 16]} />
            <meshStandardMaterial color="#1f2329" roughness={0.85} />
          </mesh>
        ))}
        <mesh position={[0.78, 0.22, 0.38]}>
          <cylinderGeometry args={[0.028, 0.028, 0.44, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.78, 0.22, -0.38]}>
          <cylinderGeometry args={[0.028, 0.028, 0.44, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Mas Agung Berdiri Ramah di Belakang Gerobak */}
        <group position={[0, 0, -1.0]} rotation={[0, 0, 0]}>
          <HumanModel
            profile={MAS_AGUNG_PROFILE}
            headRef={agungHeadRef}
            rightArmRef={agungRightArmRef}
          />
        </group>

        {/* Bangku Kayu Panjang Samping Gerobak untuk Duduk Makan Bakso Hangat */}
        <group position={[2.2, 0, 0]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.09, 0.46]} />
            <meshStandardMaterial color="#7d5333" roughness={0.82} />
          </mesh>
          {[-0.56, 0.56].map((bx, bi) => (
            <mesh key={`bbl-${bi}`} position={[bx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.4]} />
              <meshStandardMaterial color="#4f331e" roughness={0.88} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. WARUNG SUDUT PERUMAHAN MELATI ("WARUNG BU RINA") + NEON MALAM     */}
      {/*    Kavling halaman Perumahan Melati ([-34.8, 0, 60.2], menghadap Jl. Melati!) */}
      {/* ==================================================================== */}
      <group position={[-34.8, 0, 60.2]} rotation={[0, Math.PI, 0]}>
        {/* Bangunan Warung Krem-Hijau Mint Khas Perumahan Indonesia */}
        <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 3.1, 3.0]} />
          <meshStandardMaterial map={textures.stucco} color="#e5efe6" roughness={0.85} />
        </mesh>
        {/* Lis Bawah Hijau Tua Warung */}
        <mesh position={[0, 0.48, 0.02]}>
          <boxGeometry args={[4.46, 0.96, 3.04]} />
          <meshStandardMaterial color="#276749" roughness={0.8} />
        </mesh>
        {/* Atap Miring + Teritisan Kanopi Depan (Selatan +Z, Area Teduh Hujan!) */}
        <mesh position={[0, 3.22, 0.42]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[4.95, 0.16, 4.45]} />
          <meshStandardMaterial color="#7c3d2d" roughness={0.78} />
        </mesh>
        {/* 2 Tiang Penyangga Teras Depan */}
        {[-2.1, 2.1].map((tx, ti) => (
          <mesh key={`wt-${ti}`} position={[tx, 1.5, 2.35]} castShadow>
            <cylinderGeometry args={[0.055, 0.06, 3.0, 8]} />
            <meshStandardMaterial color="#2f4f3e" roughness={0.7} />
          </mesh>
        ))}

        {/* Etalase Kaca Warung Terbuka + Toples Kerupuk & Rentengan Kopi Sachet */}
        <mesh position={[-0.65, 1.48, 1.52]}>
          <boxGeometry args={[2.15, 1.12, 0.48]} />
          <meshStandardMaterial
            color="#fef9e7"
            emissive="#ffd68a"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.1}
            roughness={0.3}
          />
        </mesh>
        {/* 3 Toples Kerupuk & Jajanan Warna-Warni di Meja Etalase */}
        {[-1.35, -0.82, -0.28].map((jx, ji) => (
          <mesh key={`jar-${ji}`} position={[jx, 1.18, 1.66]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.28, 10]} />
            <meshStandardMaterial
              color={['#fef3c7', '#fde68a', '#fed7aa'][ji]}
              roughness={0.35}
              transparent
              opacity={0.86}
            />
          </mesh>
        ))}
        {/* Rentengan Kopi & Minuman Sachet Warna-Warni Bergantung di Atas Etalase */}
        {[-1.45, -1.05, -0.65, -0.25, 0.15].map((sx, si) => (
          <mesh key={`sach-${si}`} position={[sx, 2.18, 1.72]}>
            <boxGeometry args={[0.2, 0.48, 0.04]} />
            <meshStandardMaterial
              color={['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#a855f7'][si]}
              roughness={0.6}
            />
          </mesh>
        ))}
        {/* Dua Galon Air Mineral Biru di Samping Kanan Warung */}
        {[1.15, 1.58].map((gx, gi) => (
          <mesh key={`gal-${gi}`} position={[gx, 0.34, 1.75]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.46, 12]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.22} transparent opacity={0.82} />
          </mesh>
        ))}

        {/* Papan Nama Utama Bercahaya "WARUNG BU RINA" (Otomatis Menyala saat Senja–Malam!) */}
        <mesh position={[0, 3.05, 2.52]}>
          <boxGeometry args={[4.15, 0.92, 0.14]} />
          <meshStandardMaterial color="#133a22" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.05, 2.6]}>
          <planeGeometry args={[4.02, 0.84]} />
          <meshStandardMaterial
            map={warungSignTex}
            emissiveMap={warungSignTex}
            emissive="#ffffff"
            emissiveIntensity={isDarkNight ? 1.45 : isEveningOrNight ? 1.05 : 0.14}
          />
        </mesh>

        {/* Papan Neon Gantung "BUKA · KOPI & SNACK" di Sisi Kiri Teras */}
        <group position={[-2.18, 2.28, 2.38]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.78, 0.42, 0.08]} />
            <meshStandardMaterial color="#1a1423" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[0.74, 0.38]} />
            <meshStandardMaterial
              map={warungOpenTex}
              emissiveMap={warungOpenTex}
              emissive="#ffffff"
              emissiveIntensity={isDarkNight ? 1.75 : isEveningOrNight ? 1.2 : 0.18}
            />
          </mesh>
          <mesh position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.74, 0.38]} />
            <meshStandardMaterial
              map={warungOpenTex}
              emissiveMap={warungOpenTex}
              emissive="#ffffff"
              emissiveIntensity={isDarkNight ? 1.75 : isEveningOrNight ? 1.2 : 0.18}
            />
          </mesh>
        </group>

        {/* Lampu Neon Panjang Teras Warung + Pendaran Hangat ke Sudut Gang Malam */}
        <mesh position={[0, 2.75, 2.15]}>
          <boxGeometry args={[2.8, 0.07, 0.07]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff8e0' : '#d6dce2'}
            emissive={isEveningOrNight ? '#ffd27a' : '#000000'}
            emissiveIntensity={isDarkNight ? 3.2 : isEveningOrNight ? 2.1 : 0}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.72, 2.25]} scale={[3.4, 2.0, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd07b"
              transparent
              opacity={isDarkNight ? 0.62 : 0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight
            position={[0, 2.55, 2.45]}
            color="#ffd185"
            intensity={isDarkNight ? 13 : 8.5}
            distance={16}
            decay={1.7}
          />
        )}

        {/* Payung Tambahan Melindungi Etalase saat Hujan Sore */}
        {isRain && (
          <mesh position={[0, 2.65, 2.55]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[4.4, 0.04, 0.65]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.6} transparent opacity={0.85} />
          </mesh>
        )}
      </group>
    </group>
  );
};
