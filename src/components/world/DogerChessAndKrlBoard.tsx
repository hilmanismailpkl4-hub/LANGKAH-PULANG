import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface DogerChessAndKrlBoardProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const BANG_TONI_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Bang Toni',
  role: 'Penjual Es Doger Segar',
  accentColor: '#f472b6',
  voice: { pitch: 1.0, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#f43f5e',
    pantsColor: '#1f2937',
    skinColor: '#cfa07a',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

const PAK_YANTO_PROFILE: CharacterProfile = {
  id: 'pak_budi',
  name: 'Pak Yanto',
  role: 'Warga RT 04 Melati (Pecatur)',
  accentColor: '#fbbf24',
  voice: { pitch: 0.92, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.68,
    shirtColor: '#4b6b53',
    pantsColor: '#2d323c',
    skinColor: '#c99770',
    hairColor: '#3f3f46',
    accentProp: 'vest',
  },
};

const PAK_HENDRO_PROFILE: CharacterProfile = {
  id: 'pak_darman',
  name: 'Pak Hendro',
  role: 'Warga RT 04 Melati (Pecatur)',
  accentColor: '#60a5fa',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.7,
    shirtColor: '#d4a373',
    pantsColor: '#272c36',
    skinColor: '#d1a17b',
    hairColor: '#272320',
  },
};

function createDogerBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#be185d');
  grad.addColorStop(0.5, '#db2777');
  grad.addColorStop(1, '#9d174d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fff1f2';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ES DOGER SEGAR', 320, 54);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('BANG TONI · KHAS CIREBON & BANDUNG', 320, 96);

  ctx.fillStyle = '#9d174d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('TAPE KETAN · ALPUKAT · MUTIARA · SUSU · Rp 10.000', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createChessBoardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  // Bingkai kayu jati tua
  ctx.fillStyle = '#5c3820';
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = '#d4a373';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, 476, 476);

  // Papan catur 8x8 kontras krem hangat & cokelat mahoni
  const pad = 32;
  const cell = (512 - pad * 2) / 8;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#f6ebd4' : '#6c4427';
      ctx.fillRect(pad + col * cell, pad + row * cell, cell, cell);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const TIME_CLOCK_LABEL: Record<TimeOfDay, string> = {
  morning: '07:42 WIB',
  sunset: '17:38 WIB',
  rain_dusk: '18:14 WIB',
  night: '20:46 WIB',
};

function drawKrlLedScreen(
  ctx: CanvasRenderingContext2D,
  timeOfDay: TimeOfDay,
  phase: 'approaching' | 'boarding' | 'departing' | 'away',
  trainZ: number,
  trainSpeed: number,
  dwellTimer: number,
  pulseOn: boolean,
) {
  const W = 768;
  const H = 288;

  // Latar LED hitam pekat kebiruan khas PIDS KRL Commuter Line
  ctx.fillStyle = '#090f1a';
  ctx.fillRect(0, 0, W, H);

  // Garis tepi LED halus
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 6;
  ctx.strokeRect(5, 5, W - 10, H - 10);

  // Header Merah-Oranye khas KRL Commuter Indonesia
  const headerGrad = ctx.createLinearGradient(0, 0, W, 0);
  headerGrad.addColorStop(0, '#991b1b');
  headerGrad.addColorStop(0.65, '#c2410c');
  headerGrad.addColorStop(1, '#7c2d12');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(10, 10, W - 20, 58);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('KRL COMMUTER · STASIUN SENJA', 28, 39);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(TIME_CLOCK_LABEL[timeOfDay], W - 28, 39);

  // Baris Info Jalur & Tujuan
  ctx.fillStyle = '#111c2e';
  ctx.fillRect(20, 80, W - 40, 44);
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('JALUR 1  |  LIN KOTA SENJA – STASIUN BARAT (6 GERBONG)', 34, 102);

  // Panel Status Utama Live Real-Time
  let statusText = '';
  let subText = '';
  let badgeCol = '#fbbf24';
  let barRatio = 0;

  if (phase === 'boarding') {
    badgeCol = '#34d399';
    const remSec = Math.max(1, Math.ceil(dwellTimer));
    statusText = pulseOn ? '● KERETA DI PERON — PINTU TERBUKA' : '○ KERETA DI PERON — SILAKAN NAIK';
    subText = `Berangkat dlm ±${remSec} dtk · Perhatikan celah peron & barang bawaan`;
    barRatio = 1;
  } else if (phase === 'approaching') {
    badgeCol = '#fbbf24';
    const distM = Math.max(2, Math.round(Math.max(0, -4 - trainZ)));
    const etaSec = Math.max(1, Math.ceil(distM / Math.max(4, trainSpeed)));
    statusText = `▶ KRL MENDEKAT · ${distM} METER (±${etaSec} dtk)`;
    subText = 'Harap berdiri di belakang garis kuning pengaman peron';
    barRatio = Math.max(0.08, Math.min(0.96, 1 - distM / 122));
  } else if (phase === 'departing') {
    badgeCol = '#38bdf8';
    const outM = Math.max(4, Math.round(Math.max(0, trainZ + 4)));
    statusText = `➜ KERETA BERANGKAT (${outM}m DARI PERON)`;
    subText = 'Menuju Stasiun Kota Barat · Kereta berikutnya segera meluncur';
    barRatio = 0.08;
  } else {
    badgeCol = '#f59e0b';
    const waitSec = Math.max(1, Math.ceil(dwellTimer + 7));
    statusText = `◷ KERETA BERIKUTNYA · ±${waitSec} DETIK`;
    subText = 'Rangkaian sedang bersiap masuk dari arah Utara Stasiun Senja';
    barRatio = 0.05;
  }

  // Bingkai status LED menyala
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(20, 134, W - 40, 96);
  ctx.strokeStyle = badgeCol;
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 134, W - 40, 96);

  ctx.fillStyle = badgeCol;
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(statusText, 36, 166);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 18px sans-serif';
  ctx.fillText(subText, 36, 198);

  // Bilah visual posisi pendekatan kereta di bawah teks status
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(36, 214, W - 72, 8);
  ctx.fillStyle = badgeCol;
  ctx.fillRect(36, 214, Math.round((W - 72) * barRatio), 8);

  // Footer Running Info
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(10, H - 44, W - 20, 34);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'TARIF Rp 3.000 · TAP KARTU DI GERBANG UTAMA · DAHULUKAN PENUMPANG TURUN',
    W / 2,
    H - 27,
  );
}

// Koordinat statis bidak catur 3D di atas papan 0.72 x 0.72 (local XZ)
const STATIC_CHESS_PIECES: { x: number; z: number; white: boolean; tall?: boolean }[] = [
  { x: -0.26, z: -0.26, white: false, tall: true },
  { x: -0.1, z: -0.26, white: false, tall: true },
  { x: 0.12, z: -0.24, white: false, tall: true },
  { x: 0.25, z: -0.18, white: false },
  { x: -0.18, z: -0.12, white: false },
  { x: 0.02, z: -0.09, white: false },
  { x: 0.18, z: -0.04, white: false },
  { x: -0.25, z: 0.25, white: true, tall: true },
  { x: -0.06, z: 0.26, white: true, tall: true },
  { x: 0.14, z: 0.24, white: true, tall: true },
  { x: -0.2, z: 0.14, white: true },
  { x: -0.02, z: 0.12, white: true },
  { x: 0.16, z: 0.15, white: true },
  { x: 0.26, z: 0.06, white: true },
];

// 4 petak tujuan untuk bidak Kuda Putih yang melompat saat Damar ikut 1 langkah catur!
const ACTIVE_PIECE_SQUARES: [number, number][] = [
  [-0.08, 0.04],
  [0.08, -0.06],
  [-0.14, -0.08],
  [0.12, 0.08],
];

/**
 * Opsi 2 — Kehidupan Sore Kompleks & Stasiun:
 * 1. Gerobak Es Doger Segar Bang Toni ([11.6, 0, -25.6]) di trotoar timur Jl. Cempaka Utara
 * 2. Meja Catur Warga Pos Ronda RT 04 Melati ([23.3, 0, 56.8]) bersama Pak Yanto & Pak Hendro
 * 3. Papan LED Jadwal Kedatangan KRL Real-Time di Peron Stasiun Senja ([84.4, 0, -2.2])
 */
export const DogerChessAndKrlBoard: React.FC<DogerChessAndKrlBoardProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const dogerBannerTex = useMemo(() => createDogerBannerTexture(), []);
  const chessBoardTex = useMemo(() => createChessBoardTexture(), []);

  // Kanvas dinamis papan LED KRL Real-Time (di-update berkala ~3x/detik saat Damar dekat Stasiun)
  const krlLedCanvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 288;
    const ctx = c.getContext('2d')!;
    drawKrlLedScreen(ctx, 'morning', 'approaching', -80, 12, 0, true);
    return { canvas: c, ctx };
  }, []);

  const krlLedTex = useMemo(() => {
    const t = new THREE.CanvasTexture(krlLedCanvas.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [krlLedCanvas]);

  useEffect(() => {
    return () => {
      dogerBannerTex.dispose();
      chessBoardTex.dispose();
      krlLedTex.dispose();
    };
  }, [dogerBannerTex, chessBoardTex, krlLedTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const toniHeadRef = useRef<THREE.Group>(null);
  const toniRightArmRef = useRef<THREE.Group>(null);
  const yantoHeadRef = useRef<THREE.Group>(null);
  const yantoRightArmRef = useRef<THREE.Group>(null);
  const hendroHeadRef = useRef<THREE.Group>(null);
  const activeChessPieceRef = useRef<THREE.Group>(null);
  const chessPrevPosRef = useRef<[number, number]>([...ACTIVE_PIECE_SQUARES[0]]);
  const chessAnimRef = useRef(0);
  const lastStepSeenRef = useRef(0);

  const ledBeaconGreenRef = useRef<THREE.MeshStandardMaterial>(null);
  const ledBeaconAmberRef = useRef<THREE.MeshStandardMaterial>(null);
  const ledBeaconCyanRef = useRef<THREE.MeshStandardMaterial>(null);
  const lastLedDrawRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Bang Toni Es Doger (mengerok es doger & menyapa hangat)
    if (!shouldSkipPerfFrame(11.6, -25.6, 46)) {
      const distToni = py > 4 ? 99 : Math.hypot(px - 11.6, pz - -25.6);
      if (toniHeadRef.current) {
        toniHeadRef.current.rotation.y = Math.sin(t * 0.95) * 0.24;
      }
      if (toniRightArmRef.current) {
        toniRightArmRef.current.rotation.x =
          distToni < 5.5
            ? -1.65 + Math.sin(t * 5.8) * 0.28
            : -0.78 + Math.sin(t * 3.1) * 0.22;
      }
    }

    // 2. Animasi Meja Catur Pos Ronda RT 04 (Pak Yanto, Pak Hendro & bidak catur melompat "tok!")
    if (playerRuntime.chessMoveTimer > 0) {
      playerRuntime.chessMoveTimer = Math.max(0, playerRuntime.chessMoveTimer - dt);
    }
    if (!shouldSkipPerfFrame(23.3, 56.8, 46)) {
      const step = playerRuntime.chessMoveStep;
      const targetIdx = step % ACTIVE_PIECE_SQUARES.length;
      const targetSq = ACTIVE_PIECE_SQUARES[targetIdx];

      if (step !== lastStepSeenRef.current) {
        const prevIdx = (lastStepSeenRef.current + ACTIVE_PIECE_SQUARES.length) % ACTIVE_PIECE_SQUARES.length;
        chessPrevPosRef.current = [...ACTIVE_PIECE_SQUARES[prevIdx]];
        chessAnimRef.current = 0;
        lastStepSeenRef.current = step;
      }

      if (chessAnimRef.current < 1) {
        chessAnimRef.current = Math.min(1, chessAnimRef.current + dt * 2.2);
      }

      if (activeChessPieceRef.current) {
        const u = chessAnimRef.current;
        const ease = u * u * (3 - 2 * u);
        const cx = THREE.MathUtils.lerp(chessPrevPosRef.current[0], targetSq[0], ease);
        const cz = THREE.MathUtils.lerp(chessPrevPosRef.current[1], targetSq[1], ease);
        const hopY = Math.sin(u * Math.PI) * 0.14;
        activeChessPieceRef.current.position.set(cx, 0.77 + hopY, cz);
      }

      const reacting = playerRuntime.chessMoveTimer > 0;
      if (yantoHeadRef.current) {
        yantoHeadRef.current.rotation.x = reacting ? 0.24 + Math.sin(t * 7.2) * 0.12 : 0.34 + Math.sin(t * 1.1) * 0.04;
        yantoHeadRef.current.rotation.y = Math.sin(t * 0.8) * 0.14;
      }
      if (yantoRightArmRef.current) {
        yantoRightArmRef.current.rotation.x = reacting
          ? -1.25 + Math.sin(t * 6.0) * 0.22
          : -0.68 + Math.sin(t * 1.3) * 0.06;
      }
      if (hendroHeadRef.current) {
        hendroHeadRef.current.rotation.x = reacting ? 0.22 + Math.cos(t * 6.5) * 0.1 : 0.36 + Math.cos(t * 0.9) * 0.04;
      }
    }

    // 3. Papan LED Jadwal Kedatangan KRL Real-Time Stasiun Senja (refresh ~3x/detik saat dekat!)
    if (!shouldSkipPerfFrame(84.4, -2.2, 54, false)) {
      if (t - lastLedDrawRef.current >= 0.34) {
        lastLedDrawRef.current = t;
        const pulseOn = Math.floor(t * 2) % 2 === 0;
        drawKrlLedScreen(
          krlLedCanvas.ctx,
          timeOfDay,
          playerRuntime.trainPhase,
          playerRuntime.trainZ,
          playerRuntime.trainSpeed,
          playerRuntime.trainDwellTimer,
          pulseOn,
        );
        krlLedTex.needsUpdate = true;

        const phase = playerRuntime.trainPhase;
        if (ledBeaconGreenRef.current) {
          ledBeaconGreenRef.current.emissiveIntensity = phase === 'boarding' ? (pulseOn ? 3.2 : 1.4) : 0.15;
        }
        if (ledBeaconAmberRef.current) {
          ledBeaconAmberRef.current.emissiveIntensity =
            phase === 'approaching' || phase === 'away' ? (pulseOn ? 3.0 : 1.3) : 0.15;
        }
        if (ledBeaconCyanRef.current) {
          ledBeaconCyanRef.current.emissiveIntensity = phase === 'departing' ? (pulseOn ? 3.0 : 1.4) : 0.15;
        }
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK ES DOGER SEGAR BANG TONI ([11.6, 0, -25.6])               */}
      {/* ==================================================================== */}
      <group position={[11.6, 0, -25.6]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Rangka & Bodi Gerobak Merah Muda – Krem Klasik */}
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.02, 0.84, 0.98]} />
          <meshStandardMaterial color="#db2777" roughness={0.62} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[2.12, 0.07, 1.08]} />
          <meshStandardMaterial color="#fff1f2" roughness={0.5} />
        </mesh>

        {/* Spanduk Depan "ES DOGER SEGAR · BANG TONI" */}
        <mesh position={[0, 0.64, 0.505]}>
          <planeGeometry args={[1.9, 0.56]} />
          <meshStandardMaterial
            map={dogerBannerTex}
            emissiveMap={dogerBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
          />
        </mesh>

        {/* Tong Stainless Besar Es Doger + Tutup Bulat & Es Merah Muda */}
        <group position={[-0.48, 1.36, 0.02]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.31, 0.29, 0.58, 18]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.24} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.05, 16]} />
            <meshStandardMaterial color="#f9a8d4" roughness={0.45} />
          </mesh>
          {/* Gayung / Sendok Kerok Logam di Tepi Tong */}
          <mesh position={[0.14, 0.38, 0.08]} rotation={[0.25, 0, -0.35]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* 4 Toples Kaca Topping (Tape Ketan, Alpukat, Mutiara Pink, Roti Tawar) */}
        {[
          { x: 0.14, col: '#4d7c0f' },
          { x: 0.38, col: '#84cc16' },
          { x: 0.62, col: '#f43f5e' },
          { x: 0.84, col: '#fef3c7' },
        ].map((jar, ji) => (
          <group key={`dj-${ji}`} position={[jar.x, 1.22, 0.18]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.085, 0.082, 0.24, 12]} />
              <meshStandardMaterial color="#e2f2ff" transparent opacity={0.46} roughness={0.14} />
            </mesh>
            <mesh position={[0, -0.025, 0]}>
              <cylinderGeometry args={[0.072, 0.07, 0.16, 10]} />
              <meshStandardMaterial color={jar.col} roughness={0.58} />
            </mesh>
            <mesh position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.032, 12]} />
              <meshStandardMaterial color="#ec4899" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Kaleng Susu Kental Manis & Tumpukan Gelas */}
        <mesh position={[0.56, 1.19, -0.22]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.15, 10]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>
        <mesh position={[0.78, 1.23, -0.22]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.24, 10]} />
          <meshStandardMaterial color="#fce7f3" transparent opacity={0.75} roughness={0.3} />
        </mesh>

        {/* 2 Roda Gerobak Besar + Kaki Penyangga */}
        {[-0.68, 0.68].map((wx, wi) => (
          <group key={`dw-${wi}`} position={[wx, 0.28, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.07, 16]} />
              <meshStandardMaterial color="#1f2937" roughness={0.86} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.17, 0.17, 0.078, 12]} />
              <meshStandardMaterial color="#fda4af" metalness={0.35} roughness={0.45} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.78, 0.14, -0.36]}>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
          <meshStandardMaterial color="#374151" roughness={0.8} />
        </mesh>
        <mesh position={[0.78, 0.14, -0.36]}>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
          <meshStandardMaterial color="#374151" roughness={0.8} />
        </mesh>

        {/* Payung Tenda Belang Pink-Putih Penahan Panas & Hujan */}
        <mesh position={[0.05, 1.78, -0.15]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 2.9, -0.15]} castShadow>
          <coneGeometry args={[1.62, 0.44, 10]} />
          <meshStandardMaterial color="#ec4899" roughness={0.65} />
        </mesh>
        <mesh position={[0.05, 2.91, -0.15]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.63, 0.44, 5]} />
          <meshStandardMaterial color="#fff1f2" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Gerobak Sore & Malam */}
        <mesh position={[0, 2.38, 0.18]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.18]} scale={[1.6, 1.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd080"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight
            position={[0, 2.2, 0.35]}
            color="#ffd185"
            intensity={isDarkNight ? 9.5 : 6.0}
            distance={11}
            decay={2}
          />
        )}

        {/* Bang Toni Ramah Berdiri di Belakang Gerobak */}
        <group position={[0.1, 0, -1.08]}>
          <HumanModel
            profile={BANG_TONI_PROFILE}
            headRef={toniHeadRef}
            rightArmRef={toniRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan di Depan Gerobak (menghadap ke gerobak) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.48, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5f3a" roughness={0.78} />
          </mesh>
          {[-0.56, 0.56].map((lx, li) => (
            <mesh key={`dbl-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.09, 0.42, 0.36]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. MEJA CATUR WARGA POS RONDA RT 04 MELATI ([23.3, 0, 56.8])         */}
      {/* ==================================================================== */}
      <group position={[23.3, 0, 56.8]}>
        {/* Alas Paving / Tikar Ringan di Bawah Meja Catur */}
        <mesh position={[0, 0.015, 0]} receiveShadow>
          <boxGeometry args={[2.55, 0.03, 2.55]} />
          <meshStandardMaterial map={textures.paving} roughness={0.9} />
        </mesh>

        {/* Meja Kayu Jati Warga */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.08, 0.07, 1.08]} />
          <meshStandardMaterial color="#7a4f2d" roughness={0.74} />
        </mesh>
        {[
          [-0.44, 0.36, -0.44],
          [0.44, 0.36, -0.44],
          [-0.44, 0.36, 0.44],
          [0.44, 0.36, 0.44],
        ].map(([lx, ly, lz], li) => (
          <mesh key={`ctl-${li}`} position={[lx, ly, lz]} castShadow>
            <boxGeometry args={[0.08, 0.72, 0.08]} />
            <meshStandardMaterial color="#54351e" roughness={0.84} />
          </mesh>
        ))}

        {/* Papan Catur 8x8 HD di Atas Meja */}
        <mesh position={[0, 0.76, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.68, 0.68]} />
          <meshStandardMaterial map={chessBoardTex} roughness={0.55} />
        </mesh>

        {/* 14 Bidak Catur Hitam-Putih 3D */}
        {STATIC_CHESS_PIECES.map((p, pi) => (
          <group key={`cp-${pi}`} position={[p.x, 0.76, p.z]}>
            <mesh position={[0, p.tall ? 0.05 : 0.032, 0]} castShadow>
              <cylinderGeometry args={[p.tall ? 0.015 : 0.013, 0.022, p.tall ? 0.095 : 0.062, 8]} />
              <meshStandardMaterial
                color={p.white ? '#f8f0dc' : '#241f1c'}
                roughness={0.42}
                metalness={0.08}
              />
            </mesh>
            <mesh position={[0, p.tall ? 0.105 : 0.07, 0]}>
              <sphereGeometry args={[p.tall ? 0.017 : 0.014, 8, 8]} />
              <meshStandardMaterial color={p.white ? '#fff8e7' : '#1b1817'} roughness={0.38} />
            </mesh>
          </group>
        ))}

        {/* Bidak Kuda Putih Interaktif yang Melompat Maju Saat Damar Ikut 1 Langkah! */}
        <group ref={activeChessPieceRef} position={[ACTIVE_PIECE_SQUARES[0][0], 0.77, ACTIVE_PIECE_SQUARES[0][1]]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.024, 0.1, 8]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={0.22} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.11, 0.008]} rotation={[0.35, 0, 0]}>
            <boxGeometry args={[0.024, 0.038, 0.034]} />
            <meshStandardMaterial color="#fffbeb" emissive="#f59e0b" emissiveIntensity={0.24} roughness={0.35} />
          </mesh>
        </group>

        {/* 2 Gelas Kopi Hitam & Piring Pisang Goreng Teman Main Catur */}
        {[
          [0.42, 0.81, -0.34],
          [-0.42, 0.81, 0.34],
        ].map(([mx, my, mz], mi) => (
          <mesh key={`cmg-${mi}`} position={[mx, my, mz]} castShadow>
            <cylinderGeometry args={[0.042, 0.036, 0.095, 10]} />
            <meshStandardMaterial color={mi === 0 ? '#f5efe6' : '#d97706'} roughness={0.45} />
          </mesh>
        ))}
        <mesh position={[0.42, 0.77, 0.36]}>
          <cylinderGeometry args={[0.095, 0.075, 0.022, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.45} />
        </mesh>
        <mesh position={[0.42, 0.79, 0.36]} rotation={[0, 0.4, 0]}>
          <capsuleGeometry args={[0.02, 0.065, 5, 8]} />
          <meshStandardMaterial color="#c97a2b" roughness={0.78} />
        </mesh>

        {/* 2 Bangku Kayu + Pak Yanto (Selatan) & Pak Hendro (Utara) Bermain Santai */}
        {[0.88, -0.88].map((sz, si) => (
          <group key={`cst-${si}`} position={[0, 0, sz]}>
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.56, 0.065, 0.36]} />
              <meshStandardMaterial color="#7d5232" roughness={0.8} />
            </mesh>
            {[-0.2, 0.2].map((lx, li) => (
              <mesh key={`csl-${li}`} position={[lx, 0.21, 0]} castShadow>
                <boxGeometry args={[0.07, 0.42, 0.28]} />
                <meshStandardMaterial color="#4f331d" roughness={0.85} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Pak Yanto (Duduk di sisi Selatan menghadap Utara ke papan catur) */}
        <group position={[0, -0.34, 0.88]} rotation={[0, Math.PI, 0]}>
          <HumanModel
            profile={PAK_YANTO_PROFILE}
            headRef={yantoHeadRef}
            rightArmRef={yantoRightArmRef}
          />
        </group>
        {/* Pak Hendro (Duduk di sisi Utara menghadap Selatan) */}
        <group position={[0, -0.34, -0.88]}>
          <HumanModel
            profile={PAK_HENDRO_PROFILE}
            headRef={hendroHeadRef}
          />
        </group>

        {/* Tiang Lampu Taman Hangat di Sudut Meja Catur (Menyala Sore–Malam) */}
        <group position={[-1.08, 0, -1.08]}>
          <mesh position={[0, 1.38, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.055, 2.76, 8]} />
            <meshStandardMaterial color="#272e3b" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0.28, 2.66, 0.28]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.78, 8]} />
            <meshStandardMaterial color="#272e3b" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0.52, 2.54, 0.52]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial
              color="#fff6d6"
              emissive="#ffbe55"
              emissiveIntensity={isEveningOrNight ? 2.6 : 0.15}
            />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. PAPAN LED JADWAL KEDATANGAN KRL REAL-TIME STASIUN SENJA           */}
      {/*    ([84.4, 0.1, -2.2], Ganda Sisi Menghadap Peron Utara & Selatan)   */}
      {/* ==================================================================== */}
      <group position={[84.4, 0.1, -2.2]} userData={{ noCull: true }}>
        {/* Tiang Penyangga Baja Modern KRL + Umpak Beton */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.24, 0.36, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.62, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.1, 3.04, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.35} />
        </mesh>
        {/* Lengan Penopang Atas Papan LED */}
        <mesh position={[0, 2.72, 0]} castShadow>
          <boxGeometry args={[2.32, 0.08, 0.12]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.38} />
        </mesh>

        {/* Boks Casing Papan LED Digital KRL (2.42m x 0.94m x 0.22m) */}
        <group position={[0, 2.98, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.46, 0.96, 0.22]} />
            <meshStandardMaterial color="#0f172a" metalness={0.55} roughness={0.35} />
          </mesh>
          {/* Lis Merah khas Commuter Line di Sisi Atas */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2.5, 0.055, 0.26]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.45} />
          </mesh>

          {/* Layar LED Depan (+Z menghadap Peron Selatan) */}
          <mesh position={[0, 0, 0.116]}>
            <planeGeometry args={[2.32, 0.86]} />
            <meshStandardMaterial
              map={krlLedTex}
              emissiveMap={krlLedTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 1.12 : 0.78}
              roughness={0.18}
            />
          </mesh>
          {/* Layar LED Belakang (-Z menghadap Peron Utara & Gerbang Tap) */}
          <mesh position={[0, 0, -0.116]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[2.32, 0.86]} />
            <meshStandardMaterial
              map={krlLedTex}
              emissiveMap={krlLedTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 1.12 : 0.78}
              roughness={0.18}
            />
          </mesh>

          {/* 3 Lampu Indikator Status LED Real-Time di Atas Papan (Hijau / Kuning / Biru) */}
          <mesh position={[-0.36, 0.58, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial
              ref={ledBeaconGreenRef}
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[0, 0.58, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial
              ref={ledBeaconAmberRef}
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.6}
            />
          </mesh>
          <mesh position={[0.36, 0.58, 0]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial
              ref={ledBeaconCyanRef}
              color="#38bdf8"
              emissive="#0ea5e9"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
