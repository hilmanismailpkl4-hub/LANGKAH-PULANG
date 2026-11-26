import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface SerabiHistoryAndButterflyGardenProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MBAH_KARSO_PROFILE: CharacterProfile = {
  id: 'pak_darman',
  name: 'Mbah Karso',
  role: 'Penjual Serabi Solo & Kue Ape Sejak 1998',
  accentColor: '#4ade80',
  voice: { pitch: 0.86, rate: 0.92, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.64,
    shirtColor: '#3f6212',
    pantsColor: '#292524',
    skinColor: '#c6936c',
    hairColor: '#a8a29e',
    accentProp: 'vest',
  },
};

function createSerabiBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#365314');
  grad.addColorStop(0.5, '#4d7c0f');
  grad.addColorStop(1, '#78350f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SERABI SOLO & KUE APE', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('MBAH KARSO · TUNGKU TANAH LIAT · SEJAK 1998', 320, 96);

  ctx.fillStyle = '#365314';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('SANTAN ASLI · COKELAT · PANDAN NANGKA · GULUNG DAUN PISANG', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createHistoryBoardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 420;
  const ctx = c.getContext('2d')!;

  // Latar arsip sepia hangat bergaya galeri sejarah kota
  ctx.fillStyle = '#29221c';
  ctx.fillRect(0, 0, 640, 420);
  ctx.strokeStyle = '#d9a866';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, 628, 408);

  // Header judul emas
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOTA SENJA TEMPO DULU (1996)', 320, 44);

  ctx.fillStyle = '#d6c7b2';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillText('Arsip Foto Kenangan Warga · Plaza Menara Nusantara', 320, 74);

  // 3 Bingkai Foto Sepia Historis
  const photos = [
    { x: 26, title: 'Jembatan Kayu 1996', note: 'Tepi Sungai Lama' },
    { x: 224, title: 'Stasiun Senja 1996', note: 'Peron Awal KRL' },
    { x: 422, title: 'Menara Nusantara', note: 'Pembangunan 1998' },
  ];

  photos.forEach((p, idx) => {
    ctx.fillStyle = '#efe5d1';
    ctx.fillRect(p.x, 102, 192, 206);
    // Area gambar sepia bergaya siluet foto lama
    const sg = ctx.createLinearGradient(0, 112, 0, 248);
    sg.addColorStop(0, '#c2a680');
    sg.addColorStop(0.55, '#8c6d4a');
    sg.addColorStop(1, '#4a3520');
    ctx.fillStyle = sg;
    ctx.fillRect(p.x + 10, 112, 172, 132);

    // Siluet berbeda per foto
    ctx.fillStyle = '#2d1e12';
    if (idx === 0) {
      // Jembatan kayu + siluet ayah & anak kecil di sisi kiri!
      ctx.fillRect(p.x + 10, 206, 172, 10);
      ctx.fillRect(p.x + 42, 172, 8, 44);
      ctx.fillRect(p.x + 142, 172, 8, 44);
      // Siluet Bapak & Damar kecil bergandengan
      ctx.fillRect(p.x + 24, 184, 9, 24);
      ctx.beginPath();
      ctx.arc(p.x + 28, 178, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(p.x + 38, 194, 6, 14);
      ctx.beginPath();
      ctx.arc(p.x + 41, 190, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (idx === 1) {
      // Atap Stasiun Tua & gerbong klasik
      ctx.beginPath();
      ctx.moveTo(p.x + 18, 186);
      ctx.lineTo(p.x + 96, 148);
      ctx.lineTo(p.x + 174, 186);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(p.x + 30, 186, 132, 34);
    } else {
      // Menara Nusantara sedang dibangun setengah tinggi + crane
      ctx.fillRect(p.x + 64, 144, 64, 90);
      ctx.fillRect(p.x + 92, 118, 6, 30);
      ctx.fillRect(p.x + 56, 122, 86, 5);
    }

    ctx.fillStyle = '#29221c';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.title, p.x + 96, 268);
    ctx.fillStyle = '#574636';
    ctx.font = 'italic 14px sans-serif';
    ctx.fillText(p.note, p.x + 96, 290);
  });

  // Kutipan bawah
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillText('"Kota boleh tumbuh setinggi langit, namun rumah tetap tempat kita pulang."', 320, 348);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('Tekan [E] · Amati Foto Lama 1996 (Adegan Cerita)', 320, 384);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createButterflySignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 448;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#3f2a1d';
  ctx.fillRect(0, 0, 448, 160);
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 7;
  ctx.strokeRect(7, 7, 434, 146);

  ctx.fillStyle = '#fbcfe8';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAMAN BUNGA KUPU-KUPU', 224, 48);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'italic 19px Georgia, serif';
  ctx.fillText('Berhenti sejenak & biarkan sayap hinggap', 224, 92);

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('Tekan [E] · Momen Refleksi Cerita', 224, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface ButterflySpec {
  phase: number;
  radius: number;
  baseY: number;
  speed: number;
  color: string;
}

const GARDEN_BUTTERFLIES: ButterflySpec[] = [
  { phase: 0.0, radius: 1.05, baseY: 1.02, speed: 0.85, color: '#facc15' },
  { phase: 0.85, radius: 0.72, baseY: 1.18, speed: 1.02, color: '#38bdf8' },
  { phase: 1.7, radius: 1.24, baseY: 0.94, speed: 0.76, color: '#fb923c' },
  { phase: 2.55, radius: 0.88, baseY: 1.32, speed: 0.95, color: '#f472b6' },
  { phase: 3.4, radius: 1.15, baseY: 1.12, speed: 0.82, color: '#fde047' },
  { phase: 4.25, radius: 0.65, baseY: 1.42, speed: 1.1, color: '#c084fc' },
  { phase: 5.1, radius: 1.3, baseY: 1.04, speed: 0.72, color: '#fb7185' },
  { phase: 5.8, radius: 0.92, baseY: 1.26, speed: 0.9, color: '#4ade80' },
];

/**
 * Opsi 3 (Story-Driven) — Serabi Hangat, Papan Sejarah Kota & Taman Kupu-Kupu:
 * 1. Lapak Serabi Solo Tungku Tanah Liat & Kue Ape Mbah Karso ([11.4, 0, -34.2], hadap -X)
 * 2. Tugu Papan Sejarah & Foto Lama "Kota Senja Tempo Dulu" ([28.2, 0, -14.8]) — Adegan Cerita Bercabang!
 * 3. Sudut Taman Bunga Kupu-Kupu Tepi Danau Senja ([-66.2, 0, -41.8]) — 8 Kupu-Kupu + Adegan Cerita Bercabang!
 */
export const SerabiHistoryAndButterflyGarden: React.FC<SerabiHistoryAndButterflyGardenProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const serabiBannerTex = useMemo(() => createSerabiBannerTexture(), []);
  const historyBoardTex = useMemo(() => createHistoryBoardTexture(), []);
  const butterflySignTex = useMemo(() => createButterflySignTexture(), []);

  useEffect(() => {
    return () => {
      serabiBannerTex.dispose();
      historyBoardTex.dispose();
      butterflySignTex.dispose();
    };
  }, [serabiBannerTex, historyBoardTex, butterflySignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const karsoHeadRef = useRef<THREE.Group>(null);
  const karsoRightArmRef = useRef<THREE.Group>(null);
  const serabiEmberMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const serabiSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  const historySpotMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const butterflyRefs = useRef<(THREE.Group | null)[]>([]);
  const wingLeftRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wingRightRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Lapak Serabi Solo & Kue Ape Mbah Karso (bara tungku & uap santan!)
    if (playerRuntime.serabiSizzleTimer > 0) {
      playerRuntime.serabiSizzleTimer = Math.max(0, playerRuntime.serabiSizzleTimer - dt);
    }
    if (!shouldSkipPerfFrame(11.4, -34.2, 50)) {
      const distKarso = py > 4 ? 99 : Math.hypot(px - 11.4, pz - -34.2);
      const sizzling = playerRuntime.serabiSizzleTimer > 0;
      if (karsoHeadRef.current) {
        karsoHeadRef.current.rotation.y = Math.sin(t * 0.82) * 0.22;
      }
      if (karsoRightArmRef.current) {
        karsoRightArmRef.current.rotation.x =
          distKarso < 5.5
            ? -1.52 + Math.sin(t * 4.8) * 0.22
            : -0.78 + Math.sin(t * 2.2) * 0.14;
      }
      if (serabiEmberMatRef.current) {
        serabiEmberMatRef.current.emissiveIntensity =
          (isEveningOrNight ? 2.0 : 1.1) + Math.sin(t * 4.5) * 0.35;
      }
      if (!playerRuntime.perf.isPotato) {
        const riseRate = sizzling ? 1.05 : 0.54;
        for (let i = 0; i < 4; i++) {
          const m = serabiSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * riseRate + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * (sizzling ? 0.78 : 0.5);
          m.position.x = Math.sin(t * 2.2 + i * 1.9) * 0.045 * p;
          const s = (sizzling ? 0.62 : 0.45) + p * 1.12;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * (sizzling ? 0.36 : 0.22);
        }
      }
    }

    // 2. Tugu Sejarah Kota Senja Tempo Dulu (lampu galeri berpijar lembut!)
    if (playerRuntime.historyGlowTimer > 0) {
      playerRuntime.historyGlowTimer = Math.max(0, playerRuntime.historyGlowTimer - dt);
    }
    if (!shouldSkipPerfFrame(28.2, -14.8, 52)) {
      if (historySpotMatRef.current) {
        const active = playerRuntime.historyGlowTimer > 0;
        historySpotMatRef.current.emissiveIntensity = active
          ? 2.9
          : isEveningOrNight
            ? 2.2
            : 0.45;
      }
    }

    // 3. Sudut Taman Bunga Kupu-Kupu (8 kupu-kupu mengepak & menari di atas bunga!)
    if (playerRuntime.butterflyBurstTimer > 0) {
      playerRuntime.butterflyBurstTimer = Math.max(0, playerRuntime.butterflyBurstTimer - dt);
    }
    if (!shouldSkipPerfFrame(-66.2, -41.8, 52)) {
      const burst = playerRuntime.butterflyBurstTimer > 0;
      for (let i = 0; i < GARDEN_BUTTERFLIES.length; i++) {
        const b = GARDEN_BUTTERFLIES[i];
        const grp = butterflyRefs.current[i];
        if (!grp) continue;
        const ang = t * b.speed * (burst ? 1.65 : 1.0) + b.phase;
        const r = b.radius * (burst ? 1.18 : 1.0) + Math.sin(t * 1.8 + i) * 0.16;
        const nx = Math.cos(ang) * r;
        const nz = Math.sin(ang) * r;
        const ny = b.baseY + (burst ? 0.42 : 0) + Math.sin(t * 2.6 + b.phase) * 0.22;
        grp.position.set(nx, ny, nz);
        grp.rotation.y = -ang;

        const flap = Math.sin(t * (burst ? 16.0 : 10.5) + i * 1.3) * 0.85;
        const wl = wingLeftRefs.current[i];
        const wr = wingRightRefs.current[i];
        if (wl) wl.rotation.z = flap;
        if (wr) wr.rotation.z = -flap;
      }
    }
  });

  const flowerClusters = useMemo(
    () => [
      { x: -0.75, z: -0.45, col: '#facc15' },
      { x: 0.68, z: -0.52, col: '#ec4899' },
      { x: -0.58, z: 0.56, col: '#a855f7' },
      { x: 0.62, z: 0.48, col: '#f97316' },
      { x: 0.0, z: -0.78, col: '#f43f5e' },
      { x: 0.04, z: 0.12, col: '#fde047' },
      { x: -0.92, z: 0.12, col: '#f472b6' },
      { x: 0.94, z: -0.05, col: '#fb923c' },
    ],
    [],
  );

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. LAPAK SERABI SOLO & KUE APE MBAH KARSO ([11.4, 0, -34.2], -X)     */}
      {/* ==================================================================== */}
      <group position={[11.4, 0, -34.2]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Badan Gerobak Kayu Jawa Hijau-Cokelat Klasik */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#3f6212" roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#8c5a34" roughness={0.72} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`srw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#fde047" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "SERABI SOLO & KUE APE · MBAH KARSO" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={serabiBannerTex}
            emissiveMap={serabiBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.14}
          />
        </mesh>

        {/* Deretan 4 Tungku Wajan Tanah Liat Serabi Mengepul (Kiri & Tengah Counter) */}
        <group position={[-0.36, 1.08, 0.02]}>
          {/* Kotak Tungku Bara Arang */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[1.16, 0.16, 0.56]} />
            <meshStandardMaterial color="#57534e" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.165, 0]}>
            <boxGeometry args={[1.04, 0.02, 0.44]} />
            <meshStandardMaterial
              ref={serabiEmberMatRef}
              color="#7c2d12"
              emissive="#ff5a1f"
              emissiveIntensity={1.6}
            />
          </mesh>
          {/* 4 Wajan Tanah Liat + Adonan Serabi Santan & Kue Ape Pandan */}
          {[-0.38, -0.12, 0.14, 0.4].map((wx, wi) => (
            <group key={`cwk-${wi}`} position={[wx, 0.21, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.115, 0.085, 0.08, 12]} />
                <meshStandardMaterial color="#9a3412" roughness={0.86} />
              </mesh>
              <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.098, 12]} />
                <meshStandardMaterial color={wi % 2 === 0 ? '#fef3c7' : '#86efac'} roughness={0.62} />
              </mesh>
            </group>
          ))}
          {/* Kepulan Uap Santan Panggang */}
          <group position={[0, 0.3, 0]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`srst-${si}`}
                ref={(el) => {
                  serabiSteamRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.052, 8, 8]} />
                <meshBasicMaterial color="#fffbeb" transparent opacity={0.22} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Tumpukan Daun Pisang & Besek Bambu Kemasan Serabi (Kanan Counter) */}
        <group position={[0.66, 1.18, 0.04]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.16, 0.36]} />
            <meshStandardMaterial color="#d6b27d" roughness={0.86} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.38, 0.05, 0.32]} />
            <meshStandardMaterial color="#15803d" roughness={0.76} />
          </mesh>
        </group>

        {/* Payung Kanopi Hijau-Cokelat Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#3f6212" roughness={0.68} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Lapak Serabi */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.7 : 0.14}
          />
        </mesh>

        {/* Mbah Karso Ramah di Belakang Gerobak (world [12.42, 0, -34.2]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={MBAH_KARSO_PROFILE}
            headRef={karsoHeadRef}
            rightArmRef={karsoRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [9.55, 0, -34.2]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`srb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. TUGU PAPAN SEJARAH "KOTA SENJA TEMPO DULU" ([28.2, 0, -14.8])     */}
      {/* ==================================================================== */}
      <group position={[28.2, 0, -14.8]}>
        {/* Pedestal Batu Marmer & Perunggu Galeri Terbuka */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.76, 0.44, 0.72]} />
          <meshStandardMaterial color="#475569" roughness={0.72} />
        </mesh>
        {[-0.76, 0.76].map((px, pi) => (
          <mesh key={`hmp-${pi}`} position={[px, 1.32, 0]} castShadow>
            <boxGeometry args={[0.14, 2.02, 0.18]} />
            <meshStandardMaterial color="#292524" metalness={0.55} roughness={0.38} />
          </mesh>
        ))}

        {/* Bingkai Galeri Foto Sepia 1996 + Kaca Pelindung */}
        <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 1.12, 0.14]} />
          <meshStandardMaterial color="#451a03" roughness={0.62} />
        </mesh>
        <mesh position={[0, 1.48, 0.078]}>
          <planeGeometry args={[1.44, 0.98]} />
          <meshStandardMaterial
            map={historyBoardTex}
            emissiveMap={historyBoardTex}
            emissive="#fef3c7"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.14}
          />
        </mesh>

        {/* Lampu Galeri Sorot Emas di Puncak Bingkai */}
        <mesh position={[0, 2.18, 0.18]}>
          <boxGeometry args={[1.18, 0.07, 0.16]} />
          <meshStandardMaterial color="#292524" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[0, 2.13, 0.22]}>
          <boxGeometry args={[1.04, 0.035, 0.06]} />
          <meshStandardMaterial
            ref={historySpotMatRef}
            color="#fffbeb"
            emissive="#fbbf24"
            emissiveIntensity={isEveningOrNight ? 2.2 : 0.45}
          />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 3. SUDUT TAMAN BUNGA KUPU-KUPU DANAU SENJA ([-66.2, 0, -41.8])       */}
      {/* ==================================================================== */}
      <group position={[-66.2, 0, -41.8]}>
        {/* Taman Bunga Melingkar Berpinggir Batu Alam */}
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.48, 1.56, 0.32, 20]} />
          <meshStandardMaterial color="#78716c" roughness={0.92} />
        </mesh>
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[1.34, 1.34, 0.08, 18]} />
          <meshStandardMaterial color="#3f2a1d" roughness={0.95} />
        </mesh>

        {/* Rimbun Semak & 8 Rumpun Bunga Warna-Warni Mekar */}
        {flowerClusters.map((fl, fi) => (
          <group key={`bfl-${fi}`} position={[fl.x, 0.44, fl.z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.26, 8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.86} />
            </mesh>
            <mesh position={[0.06, 0.16, 0.04]}>
              <sphereGeometry args={[0.11, 8, 8]} />
              <meshStandardMaterial color={fl.col} roughness={0.62} />
            </mesh>
            <mesh position={[-0.08, 0.14, -0.05]}>
              <sphereGeometry args={[0.095, 8, 8]} />
              <meshStandardMaterial color={fl.col} roughness={0.62} />
            </mesh>
          </group>
        ))}

        {/* Papan Kayu Kecil "TAMAN BUNGA KUPU-KUPU" di Sisi Selatan */}
        <group position={[0, 0, 1.46]}>
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.055, 1.24, 8]} />
            <meshStandardMaterial color="#4a3121" roughness={0.88} />
          </mesh>
          <mesh position={[0, 1.18, 0]} castShadow>
            <boxGeometry args={[1.08, 0.42, 0.06]} />
            <meshStandardMaterial color="#3b2618" roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.18, 0.036]}>
            <planeGeometry args={[1.0, 0.34]} />
            <meshStandardMaterial
              map={butterflySignTex}
              emissiveMap={butterflySignTex}
              emissive="#fbcfe8"
              emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
            />
          </mesh>
        </group>

        {/* 8 Kupu-Kupu 3D Warna-Warni Mengepak di Atas Rumpun Bunga */}
        {GARDEN_BUTTERFLIES.map((b, bi) => (
          <group
            key={`gbf-${bi}`}
            ref={(el) => {
              butterflyRefs.current[bi] = el;
            }}
            position={[Math.cos(b.phase) * b.radius, b.baseY, Math.sin(b.phase) * b.radius]}
          >
            <mesh
              ref={(el) => {
                wingLeftRefs.current[bi] = el;
              }}
              position={[-0.055, 0, 0]}
            >
              <boxGeometry args={[0.11, 0.008, 0.12]} />
              <meshStandardMaterial
                color={b.color}
                emissive={b.color}
                emissiveIntensity={isDarkNight ? 0.8 : 0.25}
              />
            </mesh>
            <mesh
              ref={(el) => {
                wingRightRefs.current[bi] = el;
              }}
              position={[0.055, 0, 0]}
            >
              <boxGeometry args={[0.11, 0.008, 0.12]} />
              <meshStandardMaterial
                color={b.color}
                emissive={b.color}
                emissiveIntensity={isDarkNight ? 0.8 : 0.25}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

