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

interface ArtisticAndStationDetailsProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MAS_DIMAS_PROFILE: CharacterProfile = {
  id: 'bang_ari',
  name: 'Mas Dimas',
  role: 'Pelukis Sketsa Tepi Sungai',
  accentColor: '#f59e0b',
  voice: { pitch: 0.97, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.73,
    shirtColor: '#c48f36',
    pantsColor: '#2d3748',
    skinColor: '#d4a37d',
    hairColor: '#221d1a',
    accentProp: 'apron',
  },
};

function createBridgePaintingTexture(timeOfDay: TimeOfDay): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 360;
  const ctx = c.getContext('2d')!;

  // Kanvas cat minyak/akrilik lukisan Jembatan Lampion & Sungai Kota sesuai nuansa langit
  const sky = ctx.createLinearGradient(0, 0, 0, 215);
  if (timeOfDay === 'morning') {
    sky.addColorStop(0, '#4f93c6');
    sky.addColorStop(0.6, '#9fd0e6');
    sky.addColorStop(1, '#f7e6c4');
  } else if (timeOfDay === 'night') {
    sky.addColorStop(0, '#0f1b33');
    sky.addColorStop(0.65, '#1e3252');
    sky.addColorStop(1, '#4c465c');
  } else if (timeOfDay === 'rain_dusk') {
    sky.addColorStop(0, '#2a374b');
    sky.addColorStop(0.6, '#586778');
    sky.addColorStop(1, '#c48f6e');
  } else {
    sky.addColorStop(0, '#3e2d52');
    sky.addColorStop(0.5, '#c45b42');
    sky.addColorStop(1, '#f5ba67');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 220);

  // Matahari atau bulan lembut
  ctx.fillStyle = timeOfDay === 'night' ? '#fef3c7' : '#ffe49e';
  ctx.beginPath();
  ctx.arc(370, 96, timeOfDay === 'night' ? 22 : 36, 0, Math.PI * 2);
  ctx.fill();

  // Sapuan kuas awan impresionis
  ctx.fillStyle = timeOfDay === 'night' ? 'rgba(180,200,235,0.16)' : 'rgba(255,244,218,0.42)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.ellipse(70 + i * 78, 66 + (i % 2) * 26, 48, 12, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // Permukaan sungai berkilau memantulkan warna langit
  const water = ctx.createLinearGradient(0, 215, 0, 360);
  water.addColorStop(0, timeOfDay === 'morning' ? '#367591' : timeOfDay === 'night' ? '#13233b' : '#85585c');
  water.addColorStop(1, timeOfDay === 'morning' ? '#1d4d66' : '#1b2434');
  ctx.fillStyle = water;
  ctx.fillRect(0, 215, 512, 145);

  // Pantulan cahaya vertikal emas di permukaan sungai
  for (let r = 0; r < 14; r++) {
    ctx.fillStyle =
      timeOfDay === 'morning' ? 'rgba(255,250,230,0.28)' : 'rgba(255,204,112,0.45)';
    const rx = 68 + r * 28;
    const ry = 232 + (r % 3) * 24;
    ctx.fillRect(rx, ry, 18 + (r % 4) * 6, 5);
  }

  // Siluet pepohonan taman di tepi seberang
  ctx.fillStyle = timeOfDay === 'morning' ? '#2e5d42' : '#1f2c2b';
  for (let t = 0; t < 8; t++) {
    ctx.beginPath();
    ctx.arc(28 + t * 66, 206, 28 + (t % 3) * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Jembatan Gantung & Kabel Baja Ikonic Kota Senja
  ctx.fillStyle = '#2b303a';
  ctx.fillRect(0, 202, 512, 18);
  ctx.fillStyle = '#d4dae2';
  ctx.fillRect(118, 96, 16, 120);
  ctx.fillRect(366, 96, 16, 120);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  [0, 1, 2].forEach((cIdx) => {
    ctx.beginPath();
    ctx.moveTo(126, 108 + cIdx * 16);
    ctx.lineTo(44 + cIdx * 18, 202);
    ctx.moveTo(126, 108 + cIdx * 16);
    ctx.lineTo(222 - cIdx * 18, 202);
    ctx.moveTo(374, 108 + cIdx * 16);
    ctx.lineTo(278 + cIdx * 18, 202);
    ctx.moveTo(374, 108 + cIdx * 16);
    ctx.lineTo(468 - cIdx * 18, 202);
    ctx.stroke();
  });

  // Deretan lampu senar kuning hangat di pagar jembatan
  if (timeOfDay !== 'morning') {
    for (let l = 0; l < 13; l++) {
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(24 + l * 38, 198, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Tanda tangan kecil pelukis di pojok kanan bawah
  ctx.fillStyle = 'rgba(255, 245, 224, 0.85)';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText('— Dimas, Kota Senja', 492, 342);

  // Garis tepi kanvas kain
  ctx.strokeStyle = '#efe5d1';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 352);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createGateArchTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0f294a';
  ctx.fillRect(0, 0, 640, 128);
  // Strip merah-oranye khas KRL Commuter Indonesia
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(0, 0, 640, 14);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, 112, 640, 16);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GERBANG TAP KARTU · KRL KOMUTER', 320, 52);

  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('TEMPELKAN KMT / E-MONEY · STASIUN SENJA', 320, 90);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createTapPadTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(64, 54, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#7dd3fc';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAP', 64, 54);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('KMT / CARD', 64, 106);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const BAMBOO_TUBES = [
  { angle: 0, len: 0.44, col: '#caa062' },
  { angle: (Math.PI * 2) / 5, len: 0.52, col: '#bf9254' },
  { angle: (Math.PI * 4) / 5, len: 0.48, col: '#cfa76a' },
  { angle: (Math.PI * 6) / 5, len: 0.39, col: '#b88b4d' },
  { angle: (Math.PI * 8) / 5, len: 0.34, col: '#d4ae72' },
];

/**
 * Opsi 2 — Sentuhan Artistik & Detail Stasiun:
 * 1. Lonceng Angin Bambu Teras Rumah Jl. Melati No. 14 ([-18.35, 3.22, 61.55]) — berayun & berdenting merdu
 * 2. Pelukis Sketsa Tepi Sungai Mas Dimas ([-37.8, 0, 12.6]) — easel lukisan Jembatan Lampion & sapuan kuas hidup
 * 3. Gerbang Tap Kartu Komuter Stasiun Senja ([75.8, 0.11, -7.6]) — 2 lajur otomatis terbuka + lampu LED hijau + bunyi "bip-bip!"
 */
export const ArtisticAndStationDetails: React.FC<ArtisticAndStationDetailsProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const paintingTex = useMemo(() => createBridgePaintingTexture(timeOfDay), [timeOfDay]);
  const gateArchTex = useMemo(() => createGateArchTexture(), []);
  const tapPadTex = useMemo(() => createTapPadTexture(), []);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';

  // Refs Lonceng Angin Bambu
  const chimeRootRef = useRef<THREE.Group>(null);
  const tubeRefs = useRef<(THREE.Group | null)[]>([]);
  const strikerRef = useRef<THREE.Group>(null);
  const lastBreezeChimeRef = useRef(0);

  // Refs Pelukis Mas Dimas
  const dimasHeadRef = useRef<THREE.Group>(null);
  const dimasRightArmRef = useRef<THREE.Group>(null);
  const dimasLeftArmRef = useRef<THREE.Group>(null);

  // Refs Gerbang Tap Kartu Stasiun Senja (2 lajur: Utara z=-8.38, Selatan z=-6.82)
  const flapNLRef = useRef<THREE.Mesh>(null);
  const flapNRRef = useRef<THREE.Mesh>(null);
  const flapSLRef = useRef<THREE.Mesh>(null);
  const flapSRRef = useRef<THREE.Mesh>(null);
  const ledMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const gateOpenRef = useRef(0);
  const wasInGateZoneRef = useRef(false);
  const lastGateBeepRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // === 1. ANIMASI LONCENG ANGIN BAMBU TERAS RUMAH ===
    if (playerRuntime.windChimeTimer > 0) {
      playerRuntime.windChimeTimer = Math.max(0, playerRuntime.windChimeTimer - dt);
    }
    const chimeBoost = Math.min(1, playerRuntime.windChimeTimer / 3.4);
    const breeze = (isRain ? 0.14 : 0.055) + chimeBoost * 0.24;

    if (chimeRootRef.current) {
      chimeRootRef.current.rotation.z = Math.sin(t * 2.1) * breeze * 0.65;
      chimeRootRef.current.rotation.x = Math.cos(t * 1.65) * breeze * 0.45;
    }
    BAMBOO_TUBES.forEach((_, idx) => {
      const grp = tubeRefs.current[idx];
      if (!grp) return;
      grp.rotation.z = Math.sin(t * (2.8 + idx * 0.45) + idx * 1.2) * breeze * 1.15;
      grp.rotation.x = Math.cos(t * (2.3 + idx * 0.35) + idx) * breeze * 0.85;
    });
    if (strikerRef.current) {
      strikerRef.current.rotation.z = Math.sin(t * 3.2 + 0.5) * breeze * 1.5;
      strikerRef.current.rotation.x = Math.cos(t * 2.7) * breeze * 1.1;
    }

    // Denting angin alami lembut sesekali saat Damar santai di beranda depan rumah
    const distPorch = py > 4 ? 99 : Math.hypot(px - -18.35, pz - 61.2);
    if (distPorch < 5.6 && useGameStore.getState().screen === 'playing') {
      const nowMs = Date.now();
      const interval = isRain ? 13000 : 23000;
      if (nowMs - lastBreezeChimeRef.current > interval && playerRuntime.windChimeTimer <= 0) {
        lastBreezeChimeRef.current = nowMs;
        sfxEngine.playBambooWindChime(isRain ? 0.48 : 0.32);
      }
    }

    // === 2. ANIMASI PELUKIS SKETSA TEPI SUNGAI (MAS DIMAS) ===
    if (dimasHeadRef.current) {
      // Sesekali menoleh melihat Jembatan Lampion lalu kembali fokus ke kanvas
      dimasHeadRef.current.rotation.y = Math.sin(t * 0.55) * 0.22;
      dimasHeadRef.current.rotation.x = -0.05 + Math.cos(t * 0.55) * 0.08;
    }
    if (dimasRightArmRef.current) {
      // Gerakan kuas halus melukis goresan demi goresan di atas kanvas
      dimasRightArmRef.current.rotation.x = -1.18 + Math.sin(t * 2.9) * 0.14;
      dimasRightArmRef.current.rotation.z = -0.14 + Math.cos(t * 2.1) * 0.12;
    }
    if (dimasLeftArmRef.current) {
      // Tangan kiri memegang palet cat kayu dengan stabil
      dimasLeftArmRef.current.rotation.x = -0.92 + Math.sin(t * 1.1) * 0.03;
      dimasLeftArmRef.current.rotation.z = 0.28;
    }

    // === 3. GERBANG TAP KARTU KOMUTER STASIUN SENJA (AUTO-OPEN + BIP-BIP!) ===
    if (playerRuntime.stationGateTimer > 0) {
      playerRuntime.stationGateTimer = Math.max(0, playerRuntime.stationGateTimer - dt);
    }
    const inGateZone =
      py < 4 && Math.abs(px - 75.8) < 1.55 && pz > -9.2 && pz < -6.0;

    if (inGateZone && !wasInGateZoneRef.current && useGameStore.getState().screen === 'playing') {
      const nowMs = Date.now();
      if (nowMs - lastGateBeepRef.current > 2400) {
        lastGateBeepRef.current = nowMs;
        playerRuntime.stationGateTimer = 2.6;
        sfxEngine.playStationTapBeep();
      }
    }
    wasInGateZoneRef.current = inGateZone;

    const shouldOpen = inGateZone || playerRuntime.stationGateTimer > 0;
    gateOpenRef.current = THREE.MathUtils.lerp(gateOpenRef.current, shouldOpen ? 1 : 0, dt * 10);
    const open = gateOpenRef.current;

    // Retraksi mulus daun pintu akrilik ke dalam badan boks gate saat terbuka!
    const flapScale = Math.max(0.08, 1 - open * 0.92);
    const shift = open * 0.26;
    if (flapNLRef.current) {
      flapNLRef.current.scale.z = flapScale;
      flapNLRef.current.position.z = -1.12 - shift;
    }
    if (flapNRRef.current) {
      flapNRRef.current.scale.z = flapScale;
      flapNRRef.current.position.z = -0.43 + shift;
    }
    if (flapSLRef.current) {
      flapSLRef.current.scale.z = flapScale;
      flapSLRef.current.position.z = 0.43 - shift;
    }
    if (flapSRRef.current) {
      flapSRRef.current.scale.z = flapScale;
      flapSRRef.current.position.z = 1.12 + shift;
    }

    // Lampu LED hijau terang berkilau saat gerbang terbuka / tap kartu berhasil
    const ledIntensity = shouldOpen ? 3.8 : isEveningOrNight ? 1.8 : 1.0;
    const ledHex = shouldOpen ? '#4ade80' : '#22c55e';
    for (let i = 0; i < 3; i++) {
      const m = ledMatRefs.current[i];
      if (!m) continue;
      m.color.set(ledHex);
      m.emissive.set(ledHex);
      m.emissiveIntensity = ledIntensity;
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. LONCENG ANGIN BAMBU TERAS RUMAH JL. MELATI ([-18.35, 3.22, 61.55])*/}
      {/* ==================================================================== */}
      <group position={[-18.35, 3.22, 61.55]}>
        {/* Braket Kayu Berukir Menempel di Lis Pintu Teras */}
        <mesh position={[0, 0, 0.14]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.36]} />
          <meshStandardMaterial color="#4e3422" roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.06, 0.24]} rotation={[0.7, 0, 0]}>
          <boxGeometry args={[0.055, 0.055, 0.22]} />
          <meshStandardMaterial color="#4e3422" roughness={0.78} />
        </mesh>

        {/* Kelompok Lonceng Berayun Lembut di Ujung Braket */}
        <group ref={chimeRootRef} position={[0, -0.04, -0.02]}>
          {/* Tali Gantung Atas & Tudung Batok Kelapa / Kayu */}
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
            <meshStandardMaterial color="#3b2f26" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.13, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.72} />
          </mesh>

          {/* 5 Tabung Bambu Berongga Bertala Pentatonis */}
          {BAMBOO_TUBES.map((tube, idx) => {
            const r = 0.088;
            const tx = Math.cos(tube.angle) * r;
            const tz = Math.sin(tube.angle) * r;
            return (
              <group
                key={`bt-${idx}`}
                ref={(el) => {
                  tubeRefs.current[idx] = el;
                }}
                position={[tx, -0.23, tz]}
              >
                {/* Tali Benang Tipis */}
                <mesh position={[0, -0.06, 0]}>
                  <cylinderGeometry args={[0.004, 0.004, 0.12, 5]} />
                  <meshStandardMaterial color="#d6c5ab" roughness={0.9} />
                </mesh>
                {/* Batang Tabung Bambu */}
                <mesh position={[0, -0.12 - tube.len / 2, 0]} castShadow>
                  <cylinderGeometry args={[0.017, 0.019, tube.len, 10]} />
                  <meshStandardMaterial color={tube.col} roughness={0.68} />
                </mesh>
                {/* Ruas Gelap Bambu */}
                <mesh position={[0, -0.12 - tube.len * 0.42, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.014, 10]} />
                  <meshStandardMaterial color="#78532a" roughness={0.82} />
                </mesh>
              </group>
            );
          })}

          {/* Pemukul Kayu Tengah & Layar Penangkap Angin Rotan */}
          <group ref={strikerRef} position={[0, -0.23, 0]}>
            <mesh position={[0, -0.42, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.84, 5]} />
              <meshStandardMaterial color="#d6c5ab" roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.44, 0]} castShadow>
              <cylinderGeometry args={[0.048, 0.048, 0.025, 12]} />
              <meshStandardMaterial color="#6e472b" roughness={0.75} />
            </mesh>
            <mesh position={[0, -0.88, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.1, 0.16, 0.014]} />
              <meshStandardMaterial color="#9c6a3b" roughness={0.78} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. PELUKIS SKETSA TEPI SUNGAI — MAS DIMAS ([-37.8, 0, 12.6])         */}
      {/* ==================================================================== */}
      <group position={[-37.8, 0, 12.6]} rotation={[0, -2.35, 0]}>
        {/* Kuda-Kuda Lukis Kayu Tripod (Artist Easel) Menghadap Pelukis */}
        <group position={[0, 0, 0.72]}>
          {/* 2 Kaki Depan + 1 Kaki Penopang Belakang */}
          <mesh position={[-0.3, 0.86, -0.06]} rotation={[0.1, 0, -0.15]} castShadow>
            <boxGeometry args={[0.055, 1.78, 0.055]} />
            <meshStandardMaterial color="#6e4a2d" roughness={0.8} />
          </mesh>
          <mesh position={[0.3, 0.86, -0.06]} rotation={[0.1, 0, 0.15]} castShadow>
            <boxGeometry args={[0.055, 1.78, 0.055]} />
            <meshStandardMaterial color="#6e4a2d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.84, 0.36]} rotation={[-0.38, 0, 0]} castShadow>
            <boxGeometry args={[0.055, 1.78, 0.055]} />
            <meshStandardMaterial color="#5c3d24" roughness={0.82} />
          </mesh>
          {/* Rak Kayu Penyangga Kanvas */}
          <mesh position={[0, 0.94, -0.14]} castShadow>
            <boxGeometry args={[0.88, 0.06, 0.12]} />
            <meshStandardMaterial color="#7a5333" roughness={0.75} />
          </mesh>
          {/* Kanvas Bingkai Kayu + Lukisan Jembatan Lampion & Sungai */}
          <group position={[0, 1.28, -0.1]} rotation={[-0.1, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.84, 0.62, 0.04]} />
              <meshStandardMaterial color="#f5efe6" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, -0.024]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.8, 0.57]} />
              <meshStandardMaterial
                map={paintingTex}
                emissiveMap={paintingTex}
                emissive="#fff6e0"
                emissiveIntensity={isEveningOrNight ? 0.25 : 0.04}
                roughness={0.78}
              />
            </mesh>
            {/* Lampu Jepit Kecil Hangat di Puncak Kanvas (Menyala Saat Senja-Malam) */}
            <mesh position={[0, 0.34, -0.08]} rotation={[0.45, 0, 0]}>
              <coneGeometry args={[0.065, 0.1, 10]} />
              <meshStandardMaterial color="#2b2d34" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.31, -0.1]}>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#ffefc4' : '#cbd5e1'}
                emissive={isEveningOrNight ? '#ffbe55' : '#000000'}
                emissiveIntensity={isEveningOrNight ? 2.6 : 0}
              />
            </mesh>
          </group>
          {isEveningOrNight && (
            <pointLight position={[0, 1.55, -0.4]} color="#ffd080" intensity={4.5} distance={6} decay={2} />
          )}
        </group>

        {/* Bangku Lipat & Kotak Cat Kayu di Sisi Kanan Pelukis */}
        <group position={[0.66, 0, 0.22]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.44, 0.06, 0.4]} />
            <meshStandardMaterial color="#7c5335" roughness={0.78} />
          </mesh>
          {[
            [-0.17, 0.22, -0.15],
            [0.17, 0.22, -0.15],
            [-0.17, 0.22, 0.15],
            [0.17, 0.22, 0.15],
          ].map(([lx, ly, lz], li) => (
            <mesh key={`asl-${li}`} position={[lx, ly, lz]} castShadow>
              <cylinderGeometry args={[0.02, 0.022, 0.44, 6]} />
              <meshStandardMaterial color="#4a311e" roughness={0.85} />
            </mesh>
          ))}
          {/* Kotak Cat + Gelas Air Kuas + 3 Tube Cat Warna-Warni */}
          <mesh position={[-0.06, 0.51, 0]} castShadow>
            <boxGeometry args={[0.24, 0.08, 0.26]} />
            <meshStandardMaterial color="#9c6a3b" roughness={0.72} />
          </mesh>
          <mesh position={[0.13, 0.54, -0.05]}>
            <cylinderGeometry args={[0.042, 0.038, 0.14, 10]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.62} roughness={0.18} />
          </mesh>
          {['#dc2626', '#f59e0b', '#2563eb'].map((col, ci) => (
            <mesh key={`pt-${ci}`} position={[-0.06 + (ci - 1) * 0.06, 0.56, 0.04]} rotation={[0, 0.4 * ci, Math.PI / 2]}>
              <cylinderGeometry args={[0.012, 0.015, 0.09, 6]} />
              <meshStandardMaterial color={col} roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Mas Dimas Berdiri Melukis (Menghadap Kanvas di +Z) */}
        <group position={[0, 0, -0.12]}>
          <HumanModel
            profile={MAS_DIMAS_PROFILE}
            headRef={dimasHeadRef}
            leftArmRef={dimasLeftArmRef}
            rightArmRef={dimasRightArmRef}
          />
          {/* Topi Baret Pelukis Klasik + Palet Cat & Kuas di Tangan */}
          <mesh position={[0, 1.72, -0.02]} rotation={[-0.12, 0, 0.16]} castShadow>
            <cylinderGeometry args={[0.145, 0.125, 0.055, 14]} />
            <meshStandardMaterial color="#374151" roughness={0.88} />
          </mesh>
          {/* Palet Cat Kayu di Sisi Tangan Kiri */}
          <group position={[-0.3, 1.1, 0.34]} rotation={[0.35, 0.3, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.016, 14]} />
              <meshStandardMaterial color="#c99a62" roughness={0.75} />
            </mesh>
            {[
              [-0.06, 0.012, 0.04, '#ef4444'],
              [0.02, 0.012, 0.08, '#facc15'],
              [0.08, 0.012, 0.02, '#3b82f6'],
              [-0.04, 0.012, -0.06, '#f8fafc'],
            ].map(([bx, by, bz, col], bi) => (
              <mesh key={`pb-${bi}`} position={[bx as number, by as number, bz as number]}>
                <sphereGeometry args={[0.022, 6, 6]} />
                <meshStandardMaterial color={col as string} roughness={0.4} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. GERBANG TAP KARTU KOMUTER STASIUN SENJA ([75.8, 0.11, -7.6])      */}
      {/* ==================================================================== */}
      <group position={[75.8, 0.11, -7.6]}>
        {/* 3 Boks Pedestal Gate Stainless-Steel (Membentuk 2 Lajur Lega: z=-0.775 & z=+0.775) */}
        {([-1.55, 0, 1.55] as number[]).map((gz, gi) => (
          <group key={`kg-${gi}`} position={[0, 0, gz]}>
            {/* Badan Stainless Steel Modern */}
            <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.14, 0.96, 0.24]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.72} roughness={0.28} />
            </mesh>
            {/* Panel Samping Biru Tua Komuter */}
            <mesh position={[0, 0.48, 0.125]}>
              <boxGeometry args={[1.0, 0.72, 0.015]} />
              <meshStandardMaterial color="#1e3a5f" roughness={0.45} />
            </mesh>
            <mesh position={[0, 0.48, -0.125]}>
              <boxGeometry args={[1.0, 0.72, 0.015]} />
              <meshStandardMaterial color="#1e3a5f" roughness={0.45} />
            </mesh>
            {/* Tutup Atas Kaca Gelap + Pad Pembaca Kartu Tap KMT */}
            <mesh position={[0, 0.97, 0]} castShadow>
              <boxGeometry args={[1.18, 0.04, 0.26]} />
              <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.25} />
            </mesh>
            <mesh position={[-0.36, 0.995, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
              <planeGeometry args={[0.2, 0.2]} />
              <meshStandardMaterial
                map={tapPadTex}
                emissiveMap={tapPadTex}
                emissive="#38bdf8"
                emissiveIntensity={0.65}
              />
            </mesh>
            <mesh position={[0.36, 0.995, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
              <planeGeometry args={[0.2, 0.2]} />
              <meshStandardMaterial
                map={tapPadTex}
                emissiveMap={tapPadTex}
                emissive="#38bdf8"
                emissiveIntensity={0.65}
              />
            </mesh>

            {/* Lampu LED Status Hijau Depan (-X) & Belakang (+X) */}
            <mesh position={[-0.58, 0.82, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.075, 12]} />
              <meshStandardMaterial
                ref={(el) => {
                  ledMatRefs.current[gi] = el;
                }}
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={1.6}
              />
            </mesh>
            <mesh position={[0.58, 0.82, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.075, 12]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={1.6}
              />
            </mesh>
          </group>
        ))}

        {/* 4 Daun Pintu Flap Akrilik Merah-Bening Otomatis di Kedua Lajur */}
        <mesh ref={flapNLRef} position={[0, 0.56, -1.12]}>
          <boxGeometry args={[0.04, 0.62, 0.56]} />
          <meshStandardMaterial color="#f87171" transparent opacity={0.56} roughness={0.14} metalness={0.2} />
        </mesh>
        <mesh ref={flapNRRef} position={[0, 0.56, -0.43]}>
          <boxGeometry args={[0.04, 0.62, 0.56]} />
          <meshStandardMaterial color="#f87171" transparent opacity={0.56} roughness={0.14} metalness={0.2} />
        </mesh>
        <mesh ref={flapSLRef} position={[0, 0.56, 0.43]}>
          <boxGeometry args={[0.04, 0.62, 0.56]} />
          <meshStandardMaterial color="#f87171" transparent opacity={0.56} roughness={0.14} metalness={0.2} />
        </mesh>
        <mesh ref={flapSRRef} position={[0, 0.56, 1.12]}>
          <boxGeometry args={[0.04, 0.62, 0.56]} />
          <meshStandardMaterial color="#f87171" transparent opacity={0.56} roughness={0.14} metalness={0.2} />
        </mesh>

        {/* Gapura Atas Papan Petunjuk "GERBANG TAP KARTU · KRL KOMUTER" */}
        {[-1.55, 1.55].map((pz, pi) => (
          <mesh key={`gp-${pi}`} position={[0, 1.85, pz]} castShadow>
            <cylinderGeometry args={[0.042, 0.048, 1.78, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 2.78, 0]} castShadow>
          <boxGeometry args={[0.24, 0.68, 3.36]} />
          <meshStandardMaterial color="#0f294a" roughness={0.45} />
        </mesh>
        {/* Papan Signage Dua Arah (Menghadap Jalan -X & Peron +X) */}
        <mesh position={[-0.13, 2.78, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3.22, 0.62]} />
          <meshStandardMaterial
            map={gateArchTex}
            emissiveMap={gateArchTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.14}
          />
        </mesh>
        <mesh position={[0.13, 2.78, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.22, 0.62]} />
          <meshStandardMaterial
            map={gateArchTex}
            emissiveMap={gateArchTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.14}
          />
        </mesh>

        {/* Garis Kuning Pengarah Lajur di Lantai Peron */}
        {[-0.78, 0.78].map((lz, li) => (
          <mesh key={`gl-${li}`} position={[0, 0.02, lz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.8, 0.22]} />
            <meshStandardMaterial color="#eab308" roughness={0.85} />
          </mesh>
        ))}

        {/* Halo Hijau Halus di Atas Gate saat Malam */}
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[-0.65, 0.85, 0]} scale={[0.9, 0.9, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#4ade80"
              transparent
              opacity={0.55}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
      </group>
    </group>
  );
};
