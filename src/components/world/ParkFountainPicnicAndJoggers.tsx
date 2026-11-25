import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';

interface ParkFountainPicnicAndJoggersProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

interface JoggerConfig {
  id: string;
  waypoints: [number, number][];
  speed: number;
  initialProgress: number;
  isFemale: boolean;
  profile: CharacterProfile;
}

const JOGGER_CONFIGS: JoggerConfig[] = [
  {
    // Pelari 1: Putaran penuh Taman Kota Selatan (melewati Air Mancur, Gazebo & Taman Bermain)
    id: 'jog_park_loop',
    waypoints: [
      [-61.5, 8.2],
      [-61.5, 42.2],
      [-92.2, 42.2],
      [-92.2, 8.2],
    ],
    speed: 3.15,
    initialProgress: 0.12,
    isFemale: false,
    profile: {
      id: 'mas_raka',
      name: 'Pelari Taman',
      role: 'Warga Jogging',
      accentColor: '#38bdf8',
      voice: { pitch: 1, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: {
        height: 1.74,
        shirtColor: '#2563eb',
        pantsColor: '#1e293b',
        skinColor: '#d4a37f',
        hairColor: '#1f1c1a',
      },
    },
  },
  {
    // Pelari 2: Lari santai melintasi Jembatan Tepi Sungai (Taman Kota <-> Kedai Kopi)
    id: 'jog_bridge',
    waypoints: [
      [-64.0, -5.4],
      [-31.0, -5.4],
    ],
    speed: 2.85,
    initialProgress: 0.45,
    isFemale: true,
    profile: {
      id: 'mbak_lilis',
      name: 'Pelari Jembatan',
      role: 'Warga Jogging',
      accentColor: '#f472b6',
      voice: { pitch: 1, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: {
        height: 1.63,
        shirtColor: '#e16b79',
        pantsColor: '#262b36',
        skinColor: '#dfb392',
        hairColor: '#241c18',
      },
    },
  },
  {
    // Pelari 3: Lari santai pagi/sore di tepi Jl. Melati Perumahan
    id: 'jog_melati',
    waypoints: [
      [-33.0, 42.5],
      [34.0, 42.5],
    ],
    speed: 2.95,
    initialProgress: 0.68,
    isFemale: false,
    profile: {
      id: 'bima',
      name: 'Pelari Perumahan',
      role: 'Warga Jogging',
      accentColor: '#34d399',
      voice: { pitch: 1, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: {
        height: 1.72,
        shirtColor: '#2f9e7a',
        pantsColor: '#272c35',
        skinColor: '#c99772',
        hairColor: '#211c19',
      },
    },
  },
];

function createPicnicPlaidTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#fcf6e8';
  ctx.fillRect(0, 0, 256, 256);

  // Kotak-kotak gingham merah bata hangat khas tikar piknik keluarga
  ctx.fillStyle = 'rgba(196, 77, 63, 0.36)';
  for (let i = 0; i < 256; i += 32) {
    ctx.fillRect(i, 0, 16, 256);
    ctx.fillRect(0, i, 256, 16);
  }
  ctx.fillStyle = 'rgba(166, 52, 41, 0.42)';
  for (let x = 0; x < 256; x += 32) {
    for (let y = 0; y < 256; y += 32) {
      ctx.fillRect(x, y, 16, 16);
    }
  }
  // Bingkai jahitan krem di tepi tikar
  ctx.strokeStyle = '#efe3cc';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Pelari santai (warga jogging pagi/sore) dengan animasi lari atletis & melambat sopan saat dekat Damar.
 */
const AnimatedJogger: React.FC<{ cfg: JoggerConfig }> = ({ cfg }) => {
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Hitung total panjang lintasan (loop tertutup bila >= 3 titik, bolak-balik bila 2 titik)
  const pathMeta = useMemo(() => {
    const pts = cfg.waypoints;
    const closed = pts.length >= 3;
    const segs: { x0: number; z0: number; x1: number; z1: number; len: number }[] = [];
    let total = 0;
    const count = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < count; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ x0: a[0], z0: a[1], x1: b[0], z1: b[1], len });
      total += len;
    }
    return { segs, total, closed };
  }, [cfg.waypoints]);

  const progressRef = useRef(cfg.initialProgress * pathMeta.total);
  const dirRef = useRef<1 | -1>(1);
  const strideRef = useRef(cfg.initialProgress * 12);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!rootRef.current) return;

    // Cari posisi & arah saat ini di lintasan
    let rem = progressRef.current;
    let segIdx = 0;
    for (let i = 0; i < pathMeta.segs.length; i++) {
      if (rem <= pathMeta.segs[i].len || i === pathMeta.segs.length - 1) {
        segIdx = i;
        break;
      }
      rem -= pathMeta.segs[i].len;
    }
    const seg = pathMeta.segs[segIdx];
    const u = Math.max(0, Math.min(1, rem / Math.max(0.01, seg.len)));
    const curX = THREE.MathUtils.lerp(seg.x0, seg.x1, u);
    const curZ = THREE.MathUtils.lerp(seg.z0, seg.z1, u);

    const [px, py, pz] = playerRuntime.position;
    const distToPlayer = py > 3 ? 99 : Math.hypot(px - curX, pz - curZ);
    const shouldSlow = distToPlayer < 1.9;
    const activeSpd = shouldSlow ? 0 : cfg.speed;

    if (activeSpd > 0) {
      if (pathMeta.closed) {
        progressRef.current = (progressRef.current + activeSpd * dt) % pathMeta.total;
      } else {
        progressRef.current += activeSpd * dt * dirRef.current;
        if (progressRef.current >= pathMeta.total) {
          progressRef.current = pathMeta.total;
          dirRef.current = -1;
        } else if (progressRef.current <= 0) {
          progressRef.current = 0;
          dirRef.current = 1;
        }
      }
      strideRef.current += dt * 11.8;
    }

    const dx = (seg.x1 - seg.x0) * (pathMeta.closed ? 1 : dirRef.current);
    const dz = (seg.z1 - seg.z0) * (pathMeta.closed ? 1 : dirRef.current);
    const yaw = Math.atan2(dx, dz);

    // Elevasi halus saat melintasi Jembatan Tepi Sungai
    const onBridge = curX >= -57 && curX <= -39 && curZ >= -7 && curZ <= 7;
    const baseY = onBridge ? 0.24 : 0;
    const jogBob = activeSpd > 0 ? Math.abs(Math.sin(strideRef.current)) * 0.088 : 0;

    rootRef.current.position.set(curX, baseY + jogBob, curZ);
    rootRef.current.rotation.y = yaw;

    const swing = activeSpd > 0 ? Math.sin(strideRef.current) * 0.85 : 0;
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.92;
      torsoRef.current.rotation.x = activeSpd > 0 ? 0.14 : 0;
    }
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -0.65 - swing * 0.72;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -0.65 + swing * 0.72;
  });

  return (
    <group ref={rootRef} userData={{ noCull: true }}>
      <HumanModel
        profile={cfg.profile}
        torsoRef={torsoRef}
        leftLegRef={leftLegRef}
        rightLegRef={rightLegRef}
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
        isFemale={cfg.isFemale}
      />
    </group>
  );
};

/**
 * 1. Air Mancur Batu Mini Taman Kota ([-65.5, 0, 10.5]) lengkap dengan lengkungan semburan air & lampu kolam malam
 * 2. Tikar Piknik Keluarga di Rumput Taman Kota ([-72.0, 0, 29.8]) lengkap dengan keranjang rotan, termos & buah
 * 3. 3 Warga Jogging Pagi & Sore menyusuri Taman Kota, Jembatan Tepi Sungai & Jl. Melati
 */
export const ParkFountainPicnicAndJoggers: React.FC<ParkFountainPicnicAndJoggersProps> = ({
  timeOfDay,
  settings,
}) => {
  const plaidTex = useMemo(() => createPicnicPlaidTexture(), []);
  const dropletRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rippleRef = useRef<THREE.Mesh>(null);
  const topJetRef = useRef<THREE.Mesh>(null);

  const isEveningOrNight = timeOfDay !== 'morning';
  const showJoggers = timeOfDay === 'morning' || timeOfDay === 'sunset';

  // 16 titik percikan air melengkung dari puncak air mancur turun ke kolam batu
  const waterDrops = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        angle: ((i % 8) / 8) * Math.PI * 2,
        phase: (i / 16) + (i >= 8 ? 0.5 : 0),
        spread: i < 8 ? 0.85 : 0.52,
        peakY: i < 8 ? 1.85 : 2.15,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (shouldSkipPerfFrame(-65.5, 10.5, 42)) return;
    const t = clock.getElapsedTime();

    // Animasi percikan lengkung air mancur mini
    for (let i = 0; i < waterDrops.length; i++) {
      const m = dropletRefs.current[i];
      if (!m) continue;
      const d = waterDrops[i];
      const p = ((t * 1.35 + d.phase) % 1 + 1) % 1;
      const r = p * d.spread;
      // Kurva parabola alami mulai dari nozzle (y = 1.48) lalu jatuh ke kolam (y = 0.42)
      const y = 1.48 + (d.peakY - 1.48) * Math.sin(p * Math.PI) - p * p * 1.06;
      m.position.set(Math.cos(d.angle) * r, Math.max(0.4, y), Math.sin(d.angle) * r);
      const s = 0.75 + Math.sin(p * Math.PI) * 0.55;
      m.scale.set(s, s * 1.35, s);
    }

    if (topJetRef.current) {
      topJetRef.current.scale.set(1, 0.88 + Math.sin(t * 12) * 0.14, 1);
    }

    if (rippleRef.current) {
      const rp = ((t * 0.75) % 1 + 1) % 1;
      const sc = 0.45 + rp * 1.1;
      rippleRef.current.scale.set(sc, sc, 1);
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - rp) * 0.48;
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. AIR MANCUR BATU MINI TAMAN KOTA ([-65.5, 0, 10.5])                */}
      {/* ==================================================================== */}
      <group position={[-65.5, 0, 10.5]}>
        {/* Dinding Kolam Batu Andesit Bundar */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.62, 1.72, 0.56, 20]} />
          <meshStandardMaterial color="#7a7772" roughness={0.88} />
        </mesh>
        {/* Bibir Atas Batu Halus */}
        <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[1.55, 0.12, 10, 24]} />
          <meshStandardMaterial color="#96918a" roughness={0.78} />
        </mesh>
        {/* Permukaan Air Kolam Jernih + Riak */}
        <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.45, 20]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#2d637d' : '#4ca3c2'}
            roughness={0.14}
            metalness={0.35}
            transparent
            opacity={0.88}
          />
        </mesh>
        <mesh ref={rippleRef} position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.72, 0.8, 24]} />
          <meshBasicMaterial color="#e0f6ff" transparent opacity={0.45} depthWrite={false} />
        </mesh>

        {/* Pilar Batu Tengah & Mangkuk Bertingkat */}
        <mesh position={[0, 0.78, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.34, 0.82, 14]} />
          <meshStandardMaterial color="#87837c" roughness={0.84} />
        </mesh>
        <mesh position={[0, 1.18, 0]} castShadow>
          <cylinderGeometry args={[0.56, 0.24, 0.2, 16]} />
          <meshStandardMaterial color="#96918a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.38, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.14, 0.26, 12]} />
          <meshStandardMaterial color="#7a7772" roughness={0.82} />
        </mesh>

        {/* Pancuran Vertikal Tengah + 16 Percikan Air Melengkung */}
        <mesh ref={topJetRef} position={[0, 1.72, 0]}>
          <cylinderGeometry args={[0.045, 0.08, 0.48, 8]} />
          <meshBasicMaterial color="#e6f7ff" transparent opacity={0.72} depthWrite={false} />
        </mesh>
        {waterDrops.map((_, idx) => (
          <mesh
            key={`fdrop-${idx}`}
            ref={(el) => {
              dropletRefs.current[idx] = el;
            }}
            position={[0, 1.5, 0]}
          >
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshBasicMaterial color="#dcf4ff" transparent opacity={0.82} depthWrite={false} />
          </mesh>
        ))}

        {/* Lampu Kolam Air Mancur Hangat Menyala Saat Senja & Malam */}
        {isEveningOrNight && (
          <>
            {[0, 1, 2, 3].map((li) => {
              const a = (li * Math.PI) / 2 + 0.4;
              return (
                <mesh key={`fl-${li}`} position={[Math.cos(a) * 1.15, 0.46, Math.sin(a) * 1.15]}>
                  <sphereGeometry args={[0.065, 8, 8]} />
                  <meshStandardMaterial color="#ffefc2" emissive="#ffb954" emissiveIntensity={2.8} />
                </mesh>
              );
            })}
            {settings.cinematicGlow && (
              <pointLight position={[0, 1.15, 0]} color="#ffd28a" intensity={10} distance={14} decay={1.7} />
            )}
          </>
        )}
      </group>

      {/* ==================================================================== */}
      {/* 2. TIKAR PIKNIK KELUARGA DI RUMPUT TAMAN KOTA ([-72.0, 0, 29.8])     */}
      {/* ==================================================================== */}
      <group position={[-72.0, 0, 29.8]} rotation={[0, 0.18, 0]}>
        {/* Tikar Gingham Kotak-Kotak Merah-Krem */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <boxGeometry args={[2.75, 0.028, 2.25]} />
          <meshStandardMaterial map={plaidTex} roughness={0.92} />
        </mesh>

        {/* Keranjang Piknik Rotan di Pojok Kanan Belakang */}
        <group position={[0.92, 0.04, -0.68]} rotation={[0, -0.35, 0]}>
          <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.56, 0.34, 0.38]} />
            <meshStandardMaterial color="#b37f4b" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.6, 0.05, 0.42]} />
            <meshStandardMaterial color="#9c6b3b" roughness={0.85} />
          </mesh>
          {/* Gagang Keranjang */}
          <mesh position={[0, 0.44, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.18, 0.022, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#875a2e" roughness={0.85} />
          </mesh>
        </group>

        {/* Termos Teh Hangat, Piring Buah Semangka & 3 Cangkir Piknik */}
        <group position={[0.25, 0.04, -0.45]}>
          {/* Termos Merah Klasik */}
          <mesh position={[-0.38, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.32, 12]} />
            <meshStandardMaterial color="#c94b3c" roughness={0.35} metalness={0.2} />
          </mesh>
          <mesh position={[-0.38, 0.33, 0]}>
            <cylinderGeometry args={[0.055, 0.062, 0.06, 12]} />
            <meshStandardMaterial color="#f5efe6" roughness={0.3} />
          </mesh>
          {/* Piring Buah Semangka & Kue */}
          <mesh position={[0.05, 0.02, 0.08]} castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.035, 16]} />
            <meshStandardMaterial color="#faf5eb" roughness={0.32} />
          </mesh>
          <mesh position={[0.02, 0.055, 0.08]} rotation={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.035, 3]} />
            <meshStandardMaterial color="#e85858" roughness={0.65} />
          </mesh>
          <mesh position={[0.12, 0.055, 0.05]} rotation={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.035, 3]} />
            <meshStandardMaterial color="#e85858" roughness={0.65} />
          </mesh>
          {/* 3 Cangkir Warna Pastel (Ayah, Bunda, Kira) */}
          {[
            [-0.14, 0.28, '#60a5fa'],
            [0.28, 0.24, '#f472b6'],
            [0.36, -0.04, '#fbbf24'],
          ].map(([mx, mz, col], mi) => (
            <mesh key={`pmug-${mi}`} position={[mx as number, 0.055, mz as number]} castShadow>
              <cylinderGeometry args={[0.045, 0.04, 0.095, 10]} />
              <meshStandardMaterial color={col as string} roughness={0.38} />
            </mesh>
          ))}
        </group>

        {/* Dua Bantal Duduk Lembut di Sisi Kiri Tikar */}
        <mesh position={[-0.92, 0.09, 0.45]} rotation={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.48, 0.12, 0.46]} />
          <meshStandardMaterial color="#e8c88c" roughness={0.92} />
        </mesh>
        <mesh position={[-0.95, 0.09, -0.25]} rotation={[0, -0.18, 0]} castShadow>
          <boxGeometry args={[0.46, 0.12, 0.46]} />
          <meshStandardMaterial color="#9ec2b2" roughness={0.92} />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 3. WARGA JOGGING PAGI & SORE (TAMAN KOTA, JEMBATAN & JL. MELATI)     */}
      {/* ==================================================================== */}
      {showJoggers && JOGGER_CONFIGS.map((cfg) => <AnimatedJogger key={cfg.id} cfg={cfg} />)}
    </group>
  );
};
