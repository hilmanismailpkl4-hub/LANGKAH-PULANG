import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface VeggieTailorAndRailCrossingProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const IBU_TATI_PROFILE: CharacterProfile = {
  id: 'bu_wati',
  name: 'Ibu Tati',
  role: 'Penjual Sayur Keliling Gang Melati',
  accentColor: '#22c55e',
  voice: { pitch: 1.05, rate: 1.0, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.6,
    shirtColor: '#16a34a',
    pantsColor: '#1f2937',
    skinColor: '#cfa07b',
    hairColor: '#241b17',
    accentProp: 'apron',
  },
};

const IBU_SARI_PROFILE: CharacterProfile = {
  id: 'mbak_lilis',
  name: 'Ibu Sari',
  role: 'Penjahit & Permak "Sari Jahit" Jl. Melati',
  accentColor: '#14b8a6',
  voice: { pitch: 1.06, rate: 0.98, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.61,
    shirtColor: '#0f766e',
    pantsColor: '#1e293b',
    skinColor: '#d9ac89',
    hairColor: '#29211d',
    accentProp: 'cardigan',
  },
};

const PAK_MAMAN_PROFILE: CharacterProfile = {
  id: 'pak_budi',
  name: 'Pak Maman',
  role: 'Petugas Penjaga Pintu Pelintasan JPL 04 Senja',
  accentColor: '#ef4444',
  voice: { pitch: 0.92, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#1e3a8a',
    pantsColor: '#0f172a',
    skinColor: '#c6936c',
    hairColor: '#262321',
    accentProp: 'vest',
  },
};

function createVeggieBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(0.5, '#16a34a');
  grad.addColorStop(1, '#65a30d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#f0fdf4';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SAYUR SEGAR IBU TATI', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('KELILING PAGI · KOMPLEKS JL. MELATI', 320, 96);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('BAYAM · WORTEL · TOMAT · TEMPE · TAHU · BUMBU DAPUR', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createTailorSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#134e4a');
  grad.addColorStop(0.55, '#0f766e');
  grad.addColorStop(1, '#0d9488');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PENJAHIT "SARI JAHIT"', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('PERMAK LEVIS · SERAGAM · KEBAYA · RAPI & CEPAT', 320, 96);

  ctx.fillStyle = '#134e4a';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('POTONG CELANA · GANTI RESLETING · JAHIT BATIK KELUARGA', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createRailHutSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(0, 0, 512, 176);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 512, 22);
  ctx.fillRect(0, 154, 512, 22);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 26, 496, 124);

  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POS JPL 04 SENJA', 256, 68);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('AWAS KERETA API · DAHULUKAN KRL', 256, 118);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 2 — Kehidupan Pagi Kompleks & Pelintasan Kereta:
 * 1. Gerobak Sayur Keliling Ibu Tati ([43.2, 0, 53.4]) di Gang Perumahan Melati
 * 2. Kios Penjahit & Permak "Sari Jahit" ([42.2, 0, 39.2]) di Deretan Kios Jl. Melati Timur
 * 3. Pos Penjaga & Palang Peringatan Rel KA "JPL 04 Senja" ([86.2, 0, 19.8] & [87.6, 0, 17.5]) — Sinkron Real-Time KRL!
 */
export const VeggieTailorAndRailCrossing: React.FC<VeggieTailorAndRailCrossingProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const veggieBannerTex = useMemo(() => createVeggieBannerTexture(), []);
  const tailorSignTex = useMemo(() => createTailorSignTexture(), []);
  const railHutSignTex = useMemo(() => createRailHutSignTexture(), []);

  useEffect(() => {
    return () => {
      veggieBannerTex.dispose();
      tailorSignTex.dispose();
      railHutSignTex.dispose();
    };
  }, [veggieBannerTex, tailorSignTex, railHutSignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const tatiHeadRef = useRef<THREE.Group>(null);
  const tatiRightArmRef = useRef<THREE.Group>(null);
  const veggieScaleRef = useRef<THREE.Group>(null);

  const sariHeadRef = useRef<THREE.Group>(null);
  const sariRightArmRef = useRef<THREE.Group>(null);
  const sewingWheelRef = useRef<THREE.Mesh>(null);
  const sewingNeedleRef = useRef<THREE.Mesh>(null);

  const mamanHeadRef = useRef<THREE.Group>(null);
  const mamanRightArmRef = useRef<THREE.Group>(null);
  const crossingArmRef = useRef<THREE.Group>(null);
  const lampLMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const lampRMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const lampLGlowRef = useRef<THREE.Sprite>(null);
  const lampRGlowRef = useRef<THREE.Sprite>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Gerobak Sayur Keliling Ibu Tati (timbangan kuningan bergoyang saat menimbang!)
    if (playerRuntime.veggieScaleTimer > 0) {
      playerRuntime.veggieScaleTimer = Math.max(0, playerRuntime.veggieScaleTimer - dt);
    }
    if (!shouldSkipPerfFrame(43.2, 53.4, 50)) {
      const distTati = py > 4 ? 99 : Math.hypot(px - 43.2, pz - 53.4);
      if (tatiHeadRef.current) {
        tatiHeadRef.current.rotation.y = Math.sin(t * 0.92) * 0.24;
      }
      if (tatiRightArmRef.current) {
        tatiRightArmRef.current.rotation.x =
          distTati < 5.5
            ? -1.56 + Math.sin(t * 5.0) * 0.22
            : -0.68 + Math.sin(t * 1.9) * 0.12;
      }
      if (veggieScaleRef.current) {
        const weighing = playerRuntime.veggieScaleTimer > 0;
        veggieScaleRef.current.rotation.z = weighing
          ? Math.sin(t * 7.5) * 0.26 * Math.min(1, playerRuntime.veggieScaleTimer / 1.8)
          : Math.sin(t * 1.4) * 0.035;
      }
    }

    // 2. Kios Penjahit & Permak "Sari Jahit" (roda & jarum mesin jahit bergerak halus!)
    if (playerRuntime.sewingMachineTimer > 0) {
      playerRuntime.sewingMachineTimer = Math.max(0, playerRuntime.sewingMachineTimer - dt);
    }
    if (!shouldSkipPerfFrame(42.2, 39.2, 50)) {
      const distSari = py > 4 ? 99 : Math.hypot(px - 40.35, pz - 40.2);
      const sewingFast = playerRuntime.sewingMachineTimer > 0;
      if (sariHeadRef.current) {
        sariHeadRef.current.rotation.y = Math.sin(t * 0.88) * 0.22;
      }
      if (sariRightArmRef.current) {
        sariRightArmRef.current.rotation.x =
          distSari < 5.5
            ? -1.55 + Math.sin(t * 5.0) * 0.22
            : -0.52 + Math.sin(t * 1.6) * 0.1;
      }
      if (sewingWheelRef.current) {
        sewingWheelRef.current.rotation.x += dt * (sewingFast ? 14.0 : 3.4);
      }
      if (sewingNeedleRef.current) {
        sewingNeedleRef.current.position.y = 0.22 + Math.sin(t * (sewingFast ? 28.0 : 7.5)) * 0.025;
      }
    }

    // 3. Pos & Palang Peringatan Rel KA "JPL 04 Senja" (SINKRON REAL-TIME dengan posisi KRL!)
    if (playerRuntime.railCrossingBellTimer > 0) {
      playerRuntime.railCrossingBellTimer = Math.max(0, playerRuntime.railCrossingBellTimer - dt);
    }
    if (!shouldSkipPerfFrame(86.2, 19.0, 62)) {
      const distMaman = py > 4 ? 99 : Math.hypot(px - 84.85, pz - 20.3);
      const trainNear =
        Math.abs(playerRuntime.trainZ - 18) < 42 ||
        playerRuntime.trainPhase === 'approaching' ||
        playerRuntime.trainPhase === 'departing';
      const warningActive = trainNear || playerRuntime.railCrossingBellTimer > 0;

      if (mamanHeadRef.current) {
        mamanHeadRef.current.rotation.y = warningActive ? -0.35 : Math.sin(t * 0.8) * 0.22;
      }
      if (mamanRightArmRef.current) {
        mamanRightArmRef.current.rotation.x =
          warningActive || distMaman < 5.2
            ? -1.62 + Math.sin(t * 4.6) * 0.2
            : -0.45 + Math.sin(t * 1.4) * 0.08;
      }

      // Palang pintu merah-putih turun mulus saat KRL melintas atau tombol uji ditekan!
      if (crossingArmRef.current) {
        const targetAngle = warningActive ? 0.0 : 1.36;
        crossingArmRef.current.rotation.z = THREE.MathUtils.lerp(
          crossingArmRef.current.rotation.z,
          targetAngle,
          Math.min(1, dt * 3.4),
        );
      }

      // 2 Lampu merah silang Andreas berkedip bergantian secara realistis!
      const blinkLeft = warningActive && Math.floor(t * 3.2) % 2 === 0;
      const blinkRight = warningActive && !blinkLeft;
      if (lampLMatRef.current) {
        lampLMatRef.current.emissiveIntensity = blinkLeft ? 3.2 : 0.14;
      }
      if (lampRMatRef.current) {
        lampRMatRef.current.emissiveIntensity = blinkRight ? 3.2 : 0.14;
      }
      if (lampLGlowRef.current) {
        lampLGlowRef.current.visible = blinkLeft && settings.cinematicGlow && !playerRuntime.perf.isPotato;
      }
      if (lampRGlowRef.current) {
        lampRGlowRef.current.visible = blinkRight && settings.cinematicGlow && !playerRuntime.perf.isPotato;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK SAYUR KELILING IBU TATI ([43.2, 0, 53.4], hadap -Z)       */}
      {/* ==================================================================== */}
      <group position={[43.2, 0, 53.4]} rotation={[0, Math.PI, 0]}>
        {/* Badan Gerobak Kayu Hijau Segar */}
        <mesh position={[0, 0.56, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.84, 0.96]} />
          <meshStandardMaterial color="#15803d" roughness={0.76} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#8c5a34" roughness={0.72} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`vw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#86efac" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "SAYUR SEGAR IBU TATI" */}
        <mesh position={[0, 0.6, 0.495]}>
          <planeGeometry args={[1.96, 0.54]} />
          <meshStandardMaterial
            map={veggieBannerTex}
            emissiveMap={veggieBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
          />
        </mesh>

        {/* 4 Petak Sayuran Segar, Wortel, Tomat, Terong, Tahu & Tempe di Atas Gerobak */}
        <group position={[0, 1.14, 0.02]}>
          {/* Petak 1: Ikat Bayam & Kangkung Hijau Segar */}
          <mesh position={[-0.72, 0.02, 0]} castShadow>
            <boxGeometry args={[0.46, 0.14, 0.68]} />
            <meshStandardMaterial color="#166534" roughness={0.85} />
          </mesh>
          {[-0.82, -0.62].map((vx, vi) => (
            <mesh key={`spn-${vi}`} position={[vx, 0.12, (vi - 0.5) * 0.14]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#22c55e" roughness={0.82} />
            </mesh>
          ))}

          {/* Petak 2: Wortel Oranye & Tomat Merah Segar */}
          <mesh position={[-0.22, 0.02, 0]} castShadow>
            <boxGeometry args={[0.44, 0.14, 0.68]} />
            <meshStandardMaterial color="#78350f" roughness={0.84} />
          </mesh>
          <mesh position={[-0.28, 0.12, -0.12]} rotation={[0, 0.3, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.16, 5, 8]} />
            <meshStandardMaterial color="#f97316" roughness={0.62} />
          </mesh>
          <mesh position={[-0.16, 0.12, 0.12]}>
            <sphereGeometry args={[0.085, 8, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.45} />
          </mesh>

          {/* Petak 3: Terong Ungu & Jagung Manis */}
          <mesh position={[0.26, 0.02, 0]} castShadow>
            <boxGeometry args={[0.44, 0.14, 0.68]} />
            <meshStandardMaterial color="#78350f" roughness={0.84} />
          </mesh>
          <mesh position={[0.22, 0.12, -0.1]} rotation={[0.2, 0.4, Math.PI / 2]}>
            <capsuleGeometry args={[0.048, 0.15, 5, 8]} />
            <meshStandardMaterial color="#7e22ce" roughness={0.42} />
          </mesh>
          <mesh position={[0.32, 0.12, 0.14]} rotation={[0, -0.2, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.15, 5, 8]} />
            <meshStandardMaterial color="#facc15" roughness={0.58} />
          </mesh>

          {/* Petak 4: Nampan Tahu Putih & Tempe Bungkus Daun */}
          <mesh position={[0.74, 0.02, 0]} castShadow>
            <boxGeometry args={[0.44, 0.14, 0.68]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.65} />
          </mesh>
          <mesh position={[0.72, 0.12, -0.12]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.55} />
          </mesh>
          <mesh position={[0.74, 0.12, 0.14]}>
            <boxGeometry args={[0.22, 0.08, 0.24]} />
            <meshStandardMaterial color="#4d7c0f" roughness={0.78} />
          </mesh>
        </group>

        {/* Rangka Gantungan Bumbu & Timbangan Kuningan Berayun */}
        {[-0.96, 0.96].map((tx, ti) => (
          <mesh key={`vgp-${ti}`} position={[tx, 1.56, 0.36]}>
            <cylinderGeometry args={[0.022, 0.024, 1.04, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 2.06, 0.36]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 1.98, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.4} />
        </mesh>
        {/* Deretan Kantong Bumbu Gantung Warna-Warni */}
        {[-0.65, -0.35, -0.05, 0.25].map((bx, bi) => (
          <mesh key={`spb-${bi}`} position={[bx, 1.88, 0.36]}>
            <boxGeometry args={[0.14, 0.2, 0.06]} />
            <meshStandardMaterial
              color={['#ef4444', '#facc15', '#f8fafc', '#fb923c'][bi]}
              transparent
              opacity={0.86}
              roughness={0.45}
            />
          </mesh>
        ))}
        {/* Timbangan Gantung Kuningan Berayun saat Berbelanja */}
        <group ref={veggieScaleRef} position={[0.64, 2.04, 0.36]}>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.34, 6]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.16, 0.11, 0.06, 12]} />
            <meshStandardMaterial color="#eab308" metalness={0.68} roughness={0.32} />
          </mesh>
        </group>

        {/* Payung Kanopi Hijau-Krem Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.02, 1.82, -0.12]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.02, 2.94, -0.12]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#16a34a" roughness={0.65} />
        </mesh>
        <mesh position={[0.02, 2.95, -0.12]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.65} />
        </mesh>

        {/* Ibu Tati Ramah di Belakang Gerobak (world [43.2, 0, 54.42]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={IBU_TATI_PROFILE}
            headRef={tatiHeadRef}
            rightArmRef={tatiRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. KIOS PENJAHIT & PERMAK "SARI JAHIT" ([42.2, 0, 39.2], hadap +Z)   */}
      {/* ==================================================================== */}
      <group position={[42.2, 0, 39.2]}>
        {/* Badan Kios Krem-Toska Rapi */}
        <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.88, 1.82]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.48, 0.02]}>
          <boxGeometry args={[3.08, 0.96, 1.84]} />
          <meshStandardMaterial color="#0f766e" roughness={0.64} />
        </mesh>
        {/* Atap Kanopi Toska-Krem Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 2.86, 0.56]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[3.32, 0.14, 2.95]} />
          <meshStandardMaterial color="#134e4a" roughness={0.62} />
        </mesh>

        {/* Spanduk Depan HD "PENJAHIT 'SARI JAHIT'" */}
        <mesh position={[0, 2.52, 0.94]}>
          <planeGeometry args={[2.86, 0.64]} />
          <meshStandardMaterial
            map={tailorSignTex}
            emissiveMap={tailorSignTex}
            emissive="#fef3c7"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.12}
          />
        </mesh>

        {/* Etalase Kaca Lebar + Mesin Jahit Klasik Berputar + Manekin Batik & Rak Benang Warna-Warni! */}
        <group position={[0.25, 1.4, 0.84]}>
          <mesh position={[0, 0, -0.14]}>
            <boxGeometry args={[2.16, 1.24, 0.34]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fef3c7' : '#f0fdfa'}
              emissive="#fde68a"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
            />
          </mesh>

          {/* Mesin Jahit Hitam-Emas Klasik di Atas Meja Kayu (Kiri Etalase) */}
          <group position={[-0.56, -0.44, -0.02]}>
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.74, 0.07, 0.28]} />
              <meshStandardMaterial color="#78350f" roughness={0.72} />
            </mesh>
            {/* Badan Mesin Jahit Hitam Mengilap */}
            <mesh position={[0.14, 0.22, 0]}>
              <boxGeometry args={[0.14, 0.28, 0.14]} />
              <meshStandardMaterial color="#18181b" metalness={0.55} roughness={0.3} />
            </mesh>
            <mesh position={[-0.04, 0.32, 0]}>
              <boxGeometry args={[0.42, 0.1, 0.12]} />
              <meshStandardMaterial color="#18181b" metalness={0.55} roughness={0.3} />
            </mesh>
            {/* Roda Pemutar Mesin Jahit Berputar */}
            <mesh ref={sewingWheelRef} position={[0.24, 0.26, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.095, 0.018, 8, 14]} />
              <meshStandardMaterial color="#eab308" metalness={0.75} roughness={0.25} />
            </mesh>
            {/* Jarum Mesin Jahit Naik-Turun */}
            <mesh ref={sewingNeedleRef} position={[-0.2, 0.22, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Lembaran Kain Sedang Dijahit */}
            <mesh position={[-0.14, 0.1, 0]}>
              <boxGeometry args={[0.3, 0.03, 0.22]} />
              <meshStandardMaterial color="#2563eb" roughness={0.78} />
            </mesh>
          </group>

          {/* Manekin Busana Batik Hangat (Tengah Etalase) */}
          <group position={[0.14, -0.14, -0.04]}>
            <mesh position={[0, -0.34, 0]}>
              <cylinderGeometry args={[0.025, 0.03, 0.36, 8]} />
              <meshStandardMaterial color="#334155" metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.04, 0]}>
              <capsuleGeometry args={[0.14, 0.32, 6, 10]} />
              <meshStandardMaterial color="#b45309" roughness={0.76} />
            </mesh>
            <mesh position={[0, -0.18, 0]}>
              <coneGeometry args={[0.21, 0.32, 10]} />
              <meshStandardMaterial color="#d97706" roughness={0.78} />
            </mesh>
          </group>

          {/* Rak Gulungan Benang & Tumpukan Kain Warna-Warni (Kanan Etalase) */}
          <group position={[0.72, -0.02, -0.06]}>
            {[
              { y: 0.28, col: '#ef4444' },
              { y: 0.12, col: '#facc15' },
              { y: -0.04, col: '#38bdf8' },
              { y: -0.22, col: '#f472b6' },
              { y: -0.38, col: '#22c55e' },
            ].map((sp, si) => (
              <mesh key={`thsp-${si}`} position={[0, sp.y, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 0.36, 10]} />
                <meshStandardMaterial color={sp.col} roughness={0.68} />
              </mesh>
            ))}
          </group>

          {/* Kaca Depan Bening */}
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[2.18, 1.26]} />
            <meshStandardMaterial color="#ccfbf1" transparent opacity={0.22} roughness={0.1} />
          </mesh>
        </group>

        {/* Ibu Sari Ramah di Sisi Barat Kios (world [40.35, 0, 40.2]) */}
        <group position={[-1.85, 0, 1.0]}>
          <HumanModel
            profile={IBU_SARI_PROFILE}
            headRef={sariHeadRef}
            rightArmRef={sariRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. POS PENJAGA & PALANG PERINGATAN REL KA "JPL 04 SENJA"             */}
      {/*    Pos: [86.2, 0, 19.8] (-X) · Tiang Sinyal & Palang: [87.6, 0, 17.5]*/}
      {/* ==================================================================== */}
      <group>
        {/* Pos Penjaga Pintu Pelintasan KA (Gaya KAI Krem-Merah) */}
        <group position={[86.2, 0, 19.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 1.38, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.18, 2.76, 1.88]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.72} />
          </mesh>
          {/* Lis Merah-Biru Khas Pos Pelintasan Kereta */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[2.22, 0.84, 1.92]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.68} />
          </mesh>
          {/* Jendela Pengawas Kaca Depan & Samping */}
          <mesh position={[0, 1.62, 0.955]}>
            <planeGeometry args={[1.48, 0.88]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fde68a' : '#bae6fd'}
              emissive="#fbbf24"
              emissiveIntensity={isEveningOrNight ? 0.72 : 0.08}
              roughness={0.18}
            />
          </mesh>
          {/* Atap Pelana Seng Melindungi dari Hujan */}
          <mesh position={[0, 2.86, 0.22]} rotation={[0.12, 0, 0]} castShadow>
            <boxGeometry args={[2.56, 0.14, 2.68]} />
            <meshStandardMaterial color="#991b1b" roughness={0.62} />
          </mesh>
          {/* Papan Nama HD "POS JPL 04 SENJA · AWAS KERETA API" */}
          <mesh position={[0, 2.42, 0.96]}>
            <planeGeometry args={[1.92, 0.56]} />
            <meshStandardMaterial
              map={railHutSignTex}
              emissiveMap={railHutSignTex}
              emissive="#fef08a"
              emissiveIntensity={isEveningOrNight ? 0.62 : 0.12}
            />
          </mesh>
          {/* Lonceng Besi Pelintasan di Bawah Teritisan */}
          <mesh position={[0.78, 2.48, 1.06]}>
            <sphereGeometry args={[0.11, 10, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.22} />
          </mesh>
        </group>

        {/* Pak Maman Petugas Penjaga Rel di Samping Pos (world [84.85, 0, 20.3]) */}
        <group position={[84.85, 0, 20.3]} rotation={[0, -Math.PI / 2, 0]}>
          <HumanModel
            profile={PAK_MAMAN_PROFILE}
            headRef={mamanHeadRef}
            rightArmRef={mamanRightArmRef}
          />
        </group>

        {/* Tiang Sinyal Silang Andreas (X), 2 Lampu Merah Berkedip & Palang Mekanis ([87.6, 0, 17.5]) */}
        <group position={[87.6, 0, 17.5]}>
          {/* Pondasi & Kotak Motor Penggerak Palang */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.52, 0.9, 0.52]} />
            <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.42} />
          </mesh>
          {/* Tiang Utama Belang Hitam-Putih */}
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.085, 3.8, 10]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
          </mesh>
          {[1.1, 1.7, 2.3, 2.9].map((sy, si) => (
            <mesh key={`rsb-${si}`} position={[0, sy, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.26, 10]} />
              <meshStandardMaterial color="#18181b" roughness={0.6} />
            </mesh>
          ))}

          {/* Rambu Silang Andreas Merah-Putih (X) Menghadap Barat (-X) */}
          <group position={[-0.12, 3.32, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
              <boxGeometry args={[1.05, 0.16, 0.05]} />
              <meshStandardMaterial color="#dc2626" roughness={0.45} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
              <boxGeometry args={[1.05, 0.16, 0.05]} />
              <meshStandardMaterial color="#dc2626" roughness={0.45} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.008]}>
              <boxGeometry args={[0.88, 0.08, 0.045]} />
              <meshStandardMaterial color="#ffffff" roughness={0.45} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0, 0.008]}>
              <boxGeometry args={[0.88, 0.08, 0.045]} />
              <meshStandardMaterial color="#ffffff" roughness={0.45} />
            </mesh>
          </group>

          {/* 2 Lampu Peringatan Merah Berkedip Bergantian (Menghadap Barat -X) */}
          <group position={[-0.14, 2.52, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.92, 0.1, 0.1]} />
              <meshStandardMaterial color="#18181b" metalness={0.5} />
            </mesh>
            {/* Lampu Kiri */}
            <group position={[-0.34, 0, 0.08]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.08, 14]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0, 0, 0.045]}>
                <sphereGeometry args={[0.11, 10, 10]} />
                <meshStandardMaterial
                  ref={lampLMatRef}
                  color="#ef4444"
                  emissive="#ff1e1e"
                  emissiveIntensity={0.2}
                />
              </mesh>
              <sprite ref={lampLGlowRef} position={[0, 0, 0.16]} scale={[1.6, 1.6, 1]} visible={false}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ff3b3b"
                  transparent
                  opacity={isDarkNight ? 0.85 : 0.68}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            </group>
            {/* Lampu Kanan */}
            <group position={[0.34, 0, 0.08]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.08, 14]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0, 0, 0.045]}>
                <sphereGeometry args={[0.11, 10, 10]} />
                <meshStandardMaterial
                  ref={lampRMatRef}
                  color="#ef4444"
                  emissive="#ff1e1e"
                  emissiveIntensity={0.2}
                />
              </mesh>
              <sprite ref={lampRGlowRef} position={[0, 0, 0.16]} scale={[1.6, 1.6, 1]} visible={false}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ff3b3b"
                  transparent
                  opacity={isDarkNight ? 0.85 : 0.68}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            </group>
          </group>

          {/* Lengan Palang Pintu Merah-Putih Mekanis (Memanjang ke Utara -Z saat Turun!) */}
          <group position={[0, 0.96, 0]} rotation={[0, Math.PI / 2, 0]}>
            <group ref={crossingArmRef} rotation={[0, 0, 1.36]}>
              {/* Beban Penyeimbang Belakang */}
              <mesh position={[-0.45, 0, 0]} castShadow>
                <boxGeometry args={[0.42, 0.24, 0.24]} />
                <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Batang Palang Belang Merah-Putih (3.2m) */}
              {[0, 1, 2, 3, 4, 5].map((bi) => (
                <mesh key={`garm-${bi}`} position={[0.3 + bi * 0.52, 0, 0]} castShadow>
                  <boxGeometry args={[0.52, 0.1, 0.07]} />
                  <meshStandardMaterial color={bi % 2 === 0 ? '#dc2626' : '#f8fafc'} roughness={0.42} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
