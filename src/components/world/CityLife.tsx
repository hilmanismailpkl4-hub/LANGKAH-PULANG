import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CharacterProfile } from '../../data/characters';
import { getTrafficSignalState, playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface CityLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

type TrafficVehicleType = 'sedan' | 'angkot' | 'box_truck' | 'city_bus';

interface TrafficCar {
  id: number;
  type: TrafficVehicleType;
  axis: 'x' | 'z';
  lane: number;
  dir: 1 | -1;
  pos: number;
  min: number;
  max: number;
  maxSpeed: number;
  currentSpeed: number;
  wheelAngle: number;
  lastHornAt: number;
  color: string;
  accentColor?: string;
  busStopTimer?: number;
  busStopCooldown?: number;
}

function createBusRouteTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0d1520';
  ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 88);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 34px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TRANS SENJA · KORIDOR 1', 256, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface PedestrianConfig {
  id: string;
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  speed: number;
  initialProgress: number;
  isFemale: boolean;
  profile: CharacterProfile;
}

const PEDESTRIAN_CONFIGS: PedestrianConfig[] = [
  {
    id: 'w_1',
    x0: -30,
    z0: 7.8,
    x1: 35,
    z1: 7.8,
    speed: 1.55,
    initialProgress: 0.15,
    isFemale: false,
    profile: {
      id: 'damar',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: { height: 1.72, shirtColor: '#58728a', pantsColor: '#2a3038', skinColor: '#d9ab86', hairColor: '#1f1c1b', accentProp: 'backpack' },
    },
  },
  {
    id: 'w_2',
    x0: 35,
    z0: -7.8,
    x1: -28,
    z1: -7.8,
    speed: 1.4,
    initialProgress: 0.42,
    isFemale: true,
    profile: {
      id: 'nadia',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: { height: 1.61, shirtColor: '#c7826f', pantsColor: '#373540', skinColor: '#e2b798', hairColor: '#261d19', accentProp: 'cardigan' },
    },
  },
  {
    id: 'w_3',
    x0: -7.8,
    z0: 14,
    x1: -7.8,
    z1: 42,
    speed: 1.45,
    initialProgress: 0.62,
    isFemale: false,
    profile: {
      id: 'bima',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: { height: 1.75, shirtColor: '#6f8769', pantsColor: '#2f2d2a', skinColor: '#cfa07c', hairColor: '#221c18', accentProp: 'vest' },
    },
  },
  {
    id: 'w_4',
    x0: -64,
    z0: -38,
    x1: -64,
    z1: -10,
    speed: 1.3,
    initialProgress: 0.28,
    isFemale: true,
    profile: {
      id: 'mbak_lilis',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: { height: 1.62, shirtColor: '#d4a36a', pantsColor: '#2f3540', skinColor: '#ddb08e', hairColor: '#2b201b', accentProp: 'scarf' },
    },
  },
  {
    id: 'w_5',
    x0: 7.8,
    z0: -12,
    x1: 7.8,
    z1: -42,
    speed: 1.5,
    initialProgress: 0.5,
    isFemale: false,
    profile: {
      id: 'pak_hendra',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: { height: 1.73, shirtColor: '#dfe5ec', pantsColor: '#222833', skinColor: '#d3a582', hairColor: '#242120', accentProp: 'tie' },
    },
  },
  {
    id: 'w_6',
    x0: -32,
    z0: 43.2,
    x1: 28,
    z1: 43.2,
    speed: 1.35,
    initialProgress: 0.72,
    isFemale: true,
    profile: {
      id: 'bu_wati',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: { height: 1.6, shirtColor: '#7b949c', pantsColor: '#36333d', skinColor: '#dcb08f', hairColor: '#211917', accentProp: 'backpack' },
    },
  },
  {
    id: 'w_7',
    x0: 58.3,
    z0: -34,
    x1: 58.3,
    z1: 22,
    speed: 1.38,
    initialProgress: 0.34,
    isFemale: true,
    profile: {
      id: 'nadia',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: { height: 1.63, shirtColor: '#d9778c', pantsColor: '#293241', skinColor: '#e0b394', hairColor: '#1e1815', accentProp: 'scarf' },
    },
  },
  {
    id: 'w_8',
    x0: -63,
    z0: 46.8,
    x1: -33,
    z1: 46.8,
    speed: 1.32,
    initialProgress: 0.55,
    isFemale: false,
    profile: {
      id: 'pak_darman',
      name: 'Warga',
      role: '',
      accentColor: '#fff',
      voice: { pitch: 1, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: { height: 1.69, shirtColor: '#6d8a63', pantsColor: '#332e2a', skinColor: '#cca07a', hairColor: '#3a3532', accentProp: 'vest' },
    },
  },
];

/**
 * Pejalan kaki warga kota lengkap dengan wajah, rambut, aksesori, kontak mata & langkah alami.
 */
const AnimatedPedestrian: React.FC<{
  cfg: PedestrianConfig;
  index: number;
  isRain: boolean;
  positionsOut: React.MutableRefObject<{ id: string; x: number; z: number; radius: number }[]>;
}> = ({ cfg, index, isRain, positionsOut }) => {
  const rootRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);

  const stateRef = useRef({
    progress: cfg.initialProgress,
    dir: 1 as 1 | -1,
    stride: index * 1.4,
    yaw: Math.atan2(cfg.x1 - cfg.x0, cfg.z1 - cfg.z0),
  });

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const s = stateRef.current;
    const [px, py, pz] = playerRuntime.position;
    const onGround = py < 10;

    const pathLen = Math.max(1, Math.hypot(cfg.x1 - cfg.x0, cfg.z1 - cfg.z0));
    const curX = THREE.MathUtils.lerp(cfg.x0, cfg.x1, s.progress);
    const curZ = THREE.MathUtils.lerp(cfg.z0, cfg.z1, s.progress);

    const distToPlayer = onGround ? Math.hypot(px - curX, pz - curZ) : 99;
    const paused = distToPlayer < 2.2;

    if (!paused) {
      s.progress += (s.dir * cfg.speed * dt) / pathLen;
      if (s.progress >= 1) {
        s.progress = 1;
        s.dir = -1;
      } else if (s.progress <= 0) {
        s.progress = 0;
        s.dir = 1;
      }
      s.stride += dt * 7.2;
    }

    const nx = THREE.MathUtils.lerp(cfg.x0, cfg.x1, s.progress);
    const nz = THREE.MathUtils.lerp(cfg.z0, cfg.z1, s.progress);

    positionsOut.current[index] = { id: cfg.id, x: nx, z: nz, radius: 0.42 };

    // Hemat CPU/GPU pada mode HP Kentang & Hemat HP: sembunyikan & skip animasi anggota tubuh pejalan kaki yang sangat jauh
    const farHideDist = playerRuntime.perf.isPotato ? 44 : playerRuntime.perf.isLowPerf ? 62 : 120;
    if (rootRef.current) {
      const shouldShow = distToPlayer <= farHideDist;
      rootRef.current.visible = shouldShow;
      if (!shouldShow) return;

      const bob = paused ? Math.sin(t * 2.1 + index) * 0.01 : Math.abs(Math.sin(s.stride)) * 0.048;
      rootRef.current.position.set(nx, bob, nz);

      const targetYaw = paused
        ? Math.atan2(px - nx, pz - nz)
        : Math.atan2((cfg.x1 - cfg.x0) * s.dir, (cfg.z1 - cfg.z0) * s.dir);
      let diff = targetYaw - s.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      s.yaw += diff * Math.min(1, dt * 6.5);
      rootRef.current.rotation.y = s.yaw;
    }

    const swing = paused ? 0 : Math.sin(s.stride) * 0.44;
    if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, swing, dt * 12);
    if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -swing, dt * 12);
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(
        leftArmRef.current.rotation.x,
        isRain ? -1.28 : -swing * 0.72,
        dt * 12,
      );
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, isRain ? -0.06 : 0, dt * 10);
    }

    // Balas lambaian ramah jika Damar menekan [F] di dekat pejalan kaki!
    if (rightArmRef.current) {
      if (playerRuntime.damarWaveTimer > 0 && distToPlayer < 7.5) {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -2.3, dt * 9);
        rightArmRef.current.rotation.z = Math.sin(t * 10) * 0.25 + 0.3;
      } else {
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, swing * 0.72, dt * 12);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, dt * 10);
      }
    }

    if (headRef.current) {
      if (distToPlayer < 6.0) {
        const ang = Math.atan2(px - nx, pz - nz);
        let rel = ang - s.yaw;
        while (rel > Math.PI) rel -= Math.PI * 2;
        while (rel < -Math.PI) rel += Math.PI * 2;
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          THREE.MathUtils.clamp(rel, -0.7, 0.7),
          dt * 6,
        );
      } else {
        headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, dt * 4);
      }
    }
  });

  return (
    <group ref={rootRef} position={[cfg.x0, 0, cfg.z0]}>
      <HumanModel
        profile={cfg.profile}
        leftLegRef={leftLegRef}
        rightLegRef={rightLegRef}
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
        headRef={headRef}
        torsoRef={torsoRef}
        isFemale={cfg.isFemale}
        holdingUmbrella={isRain}
      />
    </group>
  );
};

/**
 * Bonus Upgrade: Kawanan burung melintas di langit pagi/senja + percikan air hujan di aspal.
 */
const CityBirds: React.FC<{ visible: boolean }> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);
  const birds = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        radius: 26 + (i % 3) * 14,
        speed: 0.22 + (i % 4) * 0.04,
        height: 22 + (i % 3) * 4.5,
        phase: i * 0.9,
        centerX: -35 + (i % 2) * 38,
        centerZ: -12 + (i % 3) * 14,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!visible || !groupRef.current) return;
    const t = clock.getElapsedTime();
    birds.forEach((b, i) => {
      const node = groupRef.current!.children[i];
      if (!node) return;
      const a = t * b.speed + b.phase;
      const x = b.centerX + Math.cos(a) * b.radius;
      const z = b.centerZ + Math.sin(a) * b.radius;
      const y = b.height + Math.sin(t * 1.4 + b.phase) * 1.2;
      node.position.set(x, y, z);
      node.rotation.y = -a;
      const flap = Math.sin(t * 7.5 + b.phase) * 0.55;
      if (node.children[0]) node.children[0].rotation.z = flap;
      if (node.children[1]) node.children[1].rotation.z = -flap;
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {birds.map((_, i) => (
        <group key={`bird-${i}`}>
          <mesh position={[-0.22, 0, 0]}>
            <boxGeometry args={[0.45, 0.04, 0.16]} />
            <meshBasicMaterial color="#2a2d36" />
          </mesh>
          <mesh position={[0.22, 0, 0]}>
            <boxGeometry args={[0.45, 0.04, 0.16]} />
            <meshBasicMaterial color="#2a2d36" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const HeronVFlock: React.FC<{ visible: boolean }> = ({ visible }) => {
  const flockRef = useRef<THREE.Group>(null);
  const offsets: [number, number, number][] = [
    [0, 0, 0],
    [-1.8, 0.15, -1.9],
    [1.8, 0.15, -1.9],
    [-3.6, 0.3, -3.8],
    [3.6, 0.3, -3.8],
  ];

  useFrame(({ clock }) => {
    if (!visible || !flockRef.current) return;
    const t = clock.getElapsedTime();
    const cycle = (t * 0.042) % 1;
    const fx = THREE.MathUtils.lerp(-92, -62, cycle);
    const fz = THREE.MathUtils.lerp(-58, 78, cycle);
    const fy = 28.5 + Math.sin(t * 0.8) * 1.1;
    flockRef.current.position.set(fx, fy, fz);
    flockRef.current.rotation.y = Math.atan2(30, 136);

    flockRef.current.children.forEach((bird, idx) => {
      const flap = Math.sin(t * 5.2 - idx * 0.55) * 0.52;
      if (bird.children[0]) bird.children[0].rotation.z = flap;
      if (bird.children[1]) bird.children[1].rotation.z = -flap;
    });
  });

  if (!visible) return null;

  return (
    <group ref={flockRef}>
      {offsets.map(([ox, oy, oz], idx) => (
        <group key={`heron-${idx}`} position={[ox, oy, oz]}>
          <mesh position={[-0.32, 0, 0]}>
            <boxGeometry args={[0.64, 0.04, 0.2]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.32, 0, 0]}>
            <boxGeometry args={[0.64, 0.04, 0.2]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const RainGroundSplashes: React.FC<{ active: boolean }> = ({ active }) => {
  const groupRef = useRef<THREE.Group>(null);
  const splashes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        ox: (Math.random() - 0.5) * 26,
        oz: (Math.random() - 0.5) * 26,
        phase: (i / 18) * 1.0,
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!active || !groupRef.current) return;
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;
    splashes.forEach((s, i) => {
      const m = groupRef.current!.children[i] as THREE.Mesh;
      if (!m) return;
      const life = (t * 1.8 + s.phase) % 1;
      const scale = 0.25 + life * 1.15;
      m.position.set(px + s.ox, py + 0.06, pz + s.oz);
      m.scale.set(scale, scale, 1);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - life) * 0.35;
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {splashes.map((_, i) => (
        <mesh key={`spl-${i}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.14, 0.18, 12]} />
          <meshBasicMaterial color="#d2e4fa" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

export const CityLife: React.FC<CityLifeProps> = ({ timeOfDay, settings }) => {
  const isLit = timeOfDay !== 'morning';
  const textures = useMemo(() => getProceduralTextures(), []);
  const busRouteTex = useMemo(() => createBusRouteTexture(), []);
  const carsGroupRef = useRef<THREE.Group>(null);
  const brakeMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const brakeHaloRefs = useRef<(THREE.Sprite | null)[]>([]);
  const wheelRefs = useRef<THREE.Group[][]>([]);
  const trainRef = useRef<THREE.Group>(null);
  const trainDoorLRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trainDoorRRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trainStateRef = useRef({
    z: -110,
    speed: 14.0,
    phase: 'approaching' as 'approaching' | 'boarding' | 'departing' | 'away',
    dwellTimer: 0,
    doorOpen: 0,
    arriveBellPlayed: false,
    departBellPlayed: false,
  });
  const walkerPositionsRef = useRef<{ id: string; x: number; z: number; radius: number }[]>([]);
  const catTailRef = useRef<THREE.Mesh>(null);
  const catHeadRef = useRef<THREE.Group>(null);

  const cars = useMemo<TrafficCar[]>(
    () => [
      // Angkot Biru-Kuning khas Indonesia di Jl. Kenangan (Timur)
      { id: 0, type: 'angkot', axis: 'x', lane: 2.7, dir: 1, pos: -72, min: -92, max: 56, maxSpeed: 8.1, currentSpeed: 8.1, wheelAngle: 0, lastHornAt: -10, color: '#247bb5', accentColor: '#f5c242' },
      // Sedan Kota Biru Tua di Jl. Kenangan (Barat)
      { id: 1, type: 'sedan', axis: 'x', lane: -2.7, dir: -1, pos: 42, min: -92, max: 56, maxSpeed: 8.4, currentSpeed: 8.4, wheelAngle: 0, lastHornAt: -10, color: '#3b536b' },
      // Mobil Box Pengiriman Kota di Jl. Kenangan (Timur)
      { id: 2, type: 'box_truck', axis: 'x', lane: 2.7, dir: 1, pos: 36, min: -92, max: 56, maxSpeed: 7.4, currentSpeed: 7.4, wheelAngle: 0, lastHornAt: -10, color: '#e38b34', accentColor: '#eef2f6' },
      // Angkot Biru Toska-Kuning di Jl. Cempaka (Selatan)
      { id: 3, type: 'angkot', axis: 'z', lane: 2.7, dir: 1, pos: -46, min: -58, max: 42, maxSpeed: 7.6, currentSpeed: 7.6, wheelAngle: 0, lastHornAt: -10, color: '#1f8a9c', accentColor: '#f5c242' },
      // Sedan Krem Hangat di Jl. Cempaka (Utara)
      { id: 4, type: 'sedan', axis: 'z', lane: -2.7, dir: -1, pos: 28, min: -58, max: 42, maxSpeed: 8.2, currentSpeed: 8.2, wheelAngle: 0, lastHornAt: -10, color: '#baa07b' },
      // Mobil Box Logistik Stasiun di Jl. Stasiun Timur
      { id: 5, type: 'box_truck', axis: 'z', lane: 64 + 2.2, dir: 1, pos: -48, min: -58, max: 54, maxSpeed: 7.6, currentSpeed: 7.6, wheelAngle: 0, lastHornAt: -10, color: '#355c7d', accentColor: '#f4f6f9' },
      // Angkot Hijau-Kuning Trayek Stasiun Timur menuju Utara
      { id: 8, type: 'angkot', axis: 'z', lane: 64 - 2.2, dir: -1, pos: 38, min: -58, max: 54, maxSpeed: 7.5, currentSpeed: 7.5, wheelAngle: 0, lastHornAt: -10, color: '#2b7a5b', accentColor: '#f5c242' },
      // Angkot Biru-Kuning arah Barat menuju Jembatan & Taman Kota
      { id: 6, type: 'angkot', axis: 'x', lane: -2.7, dir: -1, pos: -22, min: -92, max: 56, maxSpeed: 8.0, currentSpeed: 8.0, wheelAngle: 0, lastHornAt: -10, color: '#2980b9', accentColor: '#f5c242' },
      // Bus Kota Modern "Trans Senja" melintas Jl. Kenangan & berhenti sejenak di Halte Jl. Kenangan!
      {
        id: 7,
        type: 'city_bus',
        axis: 'x',
        lane: 2.7,
        dir: 1,
        pos: -26,
        min: -92,
        max: 56,
        maxSpeed: 6.8,
        currentSpeed: 6.8,
        wheelAngle: 0,
        lastHornAt: -10,
        color: '#1d568f',
        accentColor: '#f5b82e',
        busStopTimer: 0,
        busStopCooldown: 0,
      },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const signal = getTrafficSignalState(t);
    const [px, py, pz] = playerRuntime.position;
    const playerOnGround = py < 10;

    // Sinkronkan kolisi seluruh pejalan kaki ke playerRuntime
    playerRuntime.walkerColliders = walkerPositionsRef.current.filter(Boolean);

    // === 1. AI MOBIL BERHENTI HALUS & KOLISI SOLID ===
    if (carsGroupRef.current) {
      const nextBoxes: typeof playerRuntime.dynamicCarBoxes = [];

      cars.forEach((car, i) => {
        const carX = car.axis === 'x' ? car.pos : car.lane;
        const carZ = car.axis === 'x' ? car.lane : car.pos;

        let shouldStop = false;
        let blockedByPlayer = false;

        if (playerOnGround) {
          const forwardDist = car.axis === 'x' ? (px - carX) * car.dir : (pz - carZ) * car.dir;
          const lateralDist = car.axis === 'x' ? Math.abs(pz - carZ) : Math.abs(px - carX);
          if (forwardDist > -1.4 && forwardDist < 9.5 && lateralDist < 2.45) {
            shouldStop = true;
            blockedByPlayer = forwardDist > 1.2;
          }
          // Berhenti sopan juga bila Nadia/Kira sedang menyeberang di depan kendaraan
          for (const comp of [playerRuntime.companions.nadia.pos, playerRuntime.companions.kira.pos]) {
            if (comp[1] > 10) continue;
            const cFwd = car.axis === 'x' ? (comp[0] - carX) * car.dir : (comp[2] - carZ) * car.dir;
            const cLat = car.axis === 'x' ? Math.abs(comp[2] - carZ) : Math.abs(comp[0] - carX);
            if (cFwd > 0.5 && cFwd < 8.5 && cLat < 2.25) {
              shouldStop = true;
            }
          }
        }

        // Berhenti sopan memberi jalan jika ada pejalan kaki di jalur depan kendaraan
        for (const w of playerRuntime.walkerColliders) {
          const wFwd = car.axis === 'x' ? (w.x - carX) * car.dir : (w.z - carZ) * car.dir;
          const wLat = car.axis === 'x' ? Math.abs(w.z - carZ) : Math.abs(w.x - carX);
          if (wFwd > 0.8 && wFwd < 8.0 && wLat < 2.15) {
            shouldStop = true;
          }
        }

        const isMainCrossroadCar =
          (car.axis === 'x' && Math.abs(car.lane) < 6) ||
          (car.axis === 'z' && Math.abs(car.lane) < 6);
        if (isMainCrossroadCar) {
          const myLight = car.axis === 'x' ? signal.ew : signal.ns;
          const distToStopLine = car.dir === 1 ? -8.6 - car.pos : car.pos - 8.6;
          if (myLight !== 'green' && distToStopLine >= -0.4 && distToStopLine < 5.5) {
            shouldStop = true;
          }
        }

        for (const other of cars) {
          if (other.id === car.id) continue;
          if (other.axis === car.axis && Math.abs(other.lane - car.lane) < 1.2) {
            const ahead = (other.pos - car.pos) * car.dir;
            const minFollow = other.type === 'city_bus' || car.type === 'city_bus' ? 11.6 : 8.5;
            if (ahead > 0 && ahead < minFollow) shouldStop = true;
          }
          if (other.axis !== car.axis && Math.abs(other.lane) < 6 && Math.abs(car.lane) < 6) {
            const otherInCenter = Math.abs(other.pos) < 7.8;
            const approachCenter = car.dir === 1 ? -8.4 - car.pos : car.pos - 8.4;
            if (otherInCenter && approachCenter >= -0.5 && approachCenter < 4.8) shouldStop = true;
          }
        }

        // Bus Kota Trans Senja berhenti sejenak naik-turun penumpang tepat di depan Halte Bus Jl. Kenangan (x ≈ 21.4)
        if (car.type === 'city_bus') {
          if ((car.busStopCooldown ?? 0) > 0) {
            car.busStopCooldown = Math.max(0, (car.busStopCooldown ?? 0) - dt);
          }
          if ((car.busStopTimer ?? 0) > 0) {
            car.busStopTimer = Math.max(0, (car.busStopTimer ?? 0) - dt);
            shouldStop = true;
            if (car.busStopTimer <= 0) {
              car.busStopCooldown = 14.0;
            }
          } else if ((car.busStopCooldown ?? 0) <= 0 && car.pos >= 19.6 && car.pos <= 22.0) {
            car.busStopTimer = 4.6;
            shouldStop = true;
            if (playerOnGround && Math.hypot(px - 21.4, pz - 9.0) < 16) {
              sfxEngine.play('switch');
            }
          }
        }

        if (blockedByPlayer && car.currentSpeed > 3.2 && t - car.lastHornAt > 6.5) {
          car.lastHornAt = t;
          sfxEngine.play('horn');
        }

        const targetSpeed = shouldStop ? 0 : car.maxSpeed;
        const accelRate = shouldStop ? 13.5 : 4.2;
        if (car.currentSpeed > targetSpeed) {
          car.currentSpeed = Math.max(targetSpeed, car.currentSpeed - accelRate * dt);
        } else {
          car.currentSpeed = Math.min(targetSpeed, car.currentSpeed + accelRate * dt);
        }

        car.pos += car.dir * car.currentSpeed * dt;
        if (car.dir === 1 && car.pos > car.max) car.pos = car.min;
        if (car.dir === -1 && car.pos < car.min) car.pos = car.max;

        car.wheelAngle += (car.currentSpeed * dt) / 0.3;

        const nextX = car.axis === 'x' ? car.pos : car.lane;
        const nextZ = car.axis === 'x' ? car.lane : car.pos;
        const y = car.axis === 'x' && car.pos > -57 && car.pos < -39 ? 0.28 : 0.04;

        const mesh = carsGroupRef.current!.children[i];
        if (mesh) {
          mesh.position.set(nextX, y, nextZ);
          mesh.rotation.y =
            car.axis === 'x'
              ? car.dir === 1
                ? Math.PI / 2
                : -Math.PI / 2
              : car.dir === 1
                ? 0
                : Math.PI;
        }

        const brakeMat = brakeMatRefs.current[i];
        const braking = shouldStop || car.currentSpeed < car.maxSpeed * 0.55;
        if (brakeMat) {
          brakeMat.emissiveIntensity = braking ? 6.5 : isLit ? 1.8 : 0.35;
          brakeMat.color.set(braking ? '#ff2a1f' : '#cc2922');
        }
        const brakeHalo = brakeHaloRefs.current[i];
        if (brakeHalo) {
          brakeHalo.visible = braking && settings.cinematicGlow;
          const hMat = brakeHalo.material as THREE.SpriteMaterial;
          hMat.opacity = braking ? (isLit ? 0.92 : 0.72) : 0;
        }

        const carWheels = wheelRefs.current[i];
        if (carWheels) {
          for (const w of carWheels) {
            if (w) w.rotation.x = car.wheelAngle;
          }
        }

        const halfLen =
          car.type === 'city_bus'
            ? 3.72
            : car.type === 'box_truck'
              ? 2.58
              : car.type === 'angkot'
                ? 2.18
                : 2.12;
        const halfWid = car.type === 'city_bus' ? 1.24 : car.type === 'box_truck' ? 1.12 : 1.05;
        const halfX = car.axis === 'x' ? halfLen : halfWid;
        const halfZ = car.axis === 'x' ? halfWid : halfLen;
        nextBoxes.push({
          id: car.id,
          x: nextX,
          z: nextZ,
          minX: nextX - halfX,
          maxX: nextX + halfX,
          minZ: nextZ - halfZ,
          maxZ: nextZ + halfZ,
        });
      });

      playerRuntime.dynamicCarBoxes = nextBoxes;
    }

    // === 2. KERETA KOMUTER STASIUN SENJA (MELAMBAT, BERHENTI DI PERON + BEL + PINTU GESER!) ===
    if (trainRef.current) {
      const tr = trainStateRef.current;
      const stopZ = -4.0;
      const distPlayerToStation = Math.hypot(px - 84, pz - stopZ);
      const nearStation = py < 12 && distPlayerToStation < 58;
      const bellGain = Math.max(0.22, 1 - distPlayerToStation / 62);

      if (tr.phase === 'approaching') {
        const distToStop = stopZ - tr.z;
        if (!tr.arriveBellPlayed && distToStop < 38) {
          tr.arriveBellPlayed = true;
          if (nearStation) sfxEngine.playStationBell('arrive', bellGain);
        }
        // Pengereman halus menjelang peron Stasiun Senja
        const desiredSpd = distToStop > 40 ? 14.5 : Math.max(0.65, Math.sqrt(Math.max(0, distToStop) * 5.2));
        tr.speed = THREE.MathUtils.lerp(tr.speed, desiredSpd, Math.min(1, dt * 4.5));
        tr.z += tr.speed * dt;

        if (tr.z >= stopZ) {
          tr.z = stopZ;
          tr.speed = 0;
          tr.phase = 'boarding';
          tr.dwellTimer = 7.6;
          tr.departBellPlayed = false;
        }
      } else if (tr.phase === 'boarding') {
        tr.speed = 0;
        tr.dwellTimer -= dt;

        // Buka pintu geser selama naik-turun penumpang, tutup saat bel keberangkatan berbunyi
        if (tr.dwellTimer > 2.0) {
          tr.doorOpen = THREE.MathUtils.lerp(tr.doorOpen, 1, Math.min(1, dt * 3.8));
        } else {
          if (!tr.departBellPlayed) {
            tr.departBellPlayed = true;
            if (nearStation) sfxEngine.playStationBell('depart', bellGain);
          }
          tr.doorOpen = THREE.MathUtils.lerp(tr.doorOpen, 0, Math.min(1, dt * 4.2));
        }

        if (tr.dwellTimer <= 0) {
          tr.doorOpen = 0;
          tr.phase = 'departing';
        }
      } else if (tr.phase === 'departing') {
        tr.speed = Math.min(16.2, tr.speed + 4.4 * dt);
        tr.z += tr.speed * dt;
        if (tr.z > 132) {
          tr.phase = 'away';
          tr.dwellTimer = 4.2;
          tr.speed = 0;
        }
      } else {
        tr.dwellTimer -= dt;
        if (tr.dwellTimer <= 0) {
          tr.z = -126;
          tr.speed = 14.5;
          tr.phase = 'approaching';
          tr.arriveBellPlayed = false;
          tr.departBellPlayed = false;
        }
      }

      // Animasi 6 pasang pintu geser di sisi peron kereta
      const slide = tr.doorOpen * 0.56;
      for (let di = 0; di < 6; di++) {
        const dL = trainDoorLRefs.current[di];
        const dR = trainDoorRRefs.current[di];
        const baseZ = di % 2 === 0 ? -2.9 : 2.9;
        if (dL) dL.position.z = baseZ - 0.34 - slide;
        if (dR) dR.position.z = baseZ + 0.34 + slide;
      }

      trainRef.current.position.set(94.3, 1.35, tr.z);
      playerRuntime.trainZ = tr.z;
      playerRuntime.trainSpeed = tr.speed;
      playerRuntime.trainAtPlatform = tr.phase === 'boarding';
      playerRuntime.trainPhase = tr.phase;
      playerRuntime.trainDwellTimer = tr.dwellTimer;
    }

    // === 3. KUCING ORANYE "SORE" ===
    const catDist = Math.hypot(px - 9.5, pz - 56.5);
    if (catTailRef.current) {
      const wagSpeed = catDist < 4.5 ? 6.5 : 2.5;
      catTailRef.current.rotation.z = Math.sin(t * wagSpeed) * (catDist < 4.5 ? 0.55 : 0.3);
    }
    if (catHeadRef.current) {
      if (catDist < 5.5) {
        const ang = Math.atan2(px - 9.5, pz - 56.5) + 0.6;
        catHeadRef.current.rotation.y = THREE.MathUtils.clamp(Math.sin(ang) * 0.7, -0.7, 0.7);
      } else {
        catHeadRef.current.rotation.y *= 0.95;
      }
    }
  });

  return (
    <group>
      {/* Variasi Kendaraan Kota Indonesia: Angkot Biru-Kuning, Mobil Box & Sedan + Lampu Rem Realistis */}
      <group ref={carsGroupRef}>
        {cars.map((car, i) => {
          if (!wheelRefs.current[i]) wheelRefs.current[i] = [];
          const isAngkot = car.type === 'angkot';
          const isTruck = car.type === 'box_truck';
          const isBus = car.type === 'city_bus';
          const wheelZFront = isBus ? 2.18 : isTruck ? 1.62 : 1.28;
          const wheelZRear = isBus ? -2.18 : isTruck ? -1.48 : -1.28;
          const wheelX = isBus ? 1.08 : 0.92;
          const wheelRadius = isBus ? 0.36 : 0.3;
          const headZ = isBus ? 3.62 : isTruck ? 2.48 : isAngkot ? 2.08 : 2.05;
          const tailZ = isBus ? -3.64 : isTruck ? -2.54 : isAngkot ? -2.1 : -2.04;
          const tailY = isBus ? 0.72 : isTruck ? 0.62 : isAngkot ? 0.68 : 0.58;

          return (
            <group key={`car-${i}`}>
              {/* Bayangan kontak lembut di aspal */}
              <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[isBus ? 2.55 : isTruck ? 2.3 : 2.1, isBus ? 7.45 : isTruck ? 5.2 : 4.35]} />
                <meshBasicMaterial color="#090b0f" transparent opacity={0.44} depthWrite={false} />
              </mesh>

              {/* === BENTUK 1: ANGKOT BIRU-KUNING KHAS INDONESIA === */}
              {isAngkot && (
                <group>
                  {/* Bodi Bawah Biru */}
                  <mesh position={[0, 0.62, 0]} castShadow>
                    <boxGeometry args={[1.82, 0.72, 4.15]} />
                    <meshStandardMaterial color={car.color} roughness={0.34} metalness={0.32} />
                  </mesh>
                  {/* Strip Kuning Ikonik Memanjang di Sisi & Depan */}
                  <mesh position={[0, 0.96, 0]}>
                    <boxGeometry args={[1.85, 0.16, 4.18]} />
                    <meshStandardMaterial color={car.accentColor ?? '#f5c242'} roughness={0.4} />
                  </mesh>
                  {/* Kabin Atas & Kaca Penumpang Lebar */}
                  <mesh position={[0, 1.38, -0.05]} castShadow>
                    <boxGeometry args={[1.76, 0.72, 3.85]} />
                    <meshStandardMaterial color="#1f2937" roughness={0.16} metalness={0.55} />
                  </mesh>
                  {/* Atap Angkot Biru-Kuning + Papan Trayek Bercahaya */}
                  <mesh position={[0, 1.78, -0.06]} castShadow>
                    <boxGeometry args={[1.78, 0.12, 3.88]} />
                    <meshStandardMaterial color={car.color} roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 1.9, 1.38]}>
                    <boxGeometry args={[0.92, 0.16, 0.22]} />
                    <meshStandardMaterial
                      color="#fff3b0"
                      emissive="#ffd166"
                      emissiveIntensity={isLit ? 1.8 : 0.25}
                    />
                  </mesh>
                  {/* Bemper Depan & Belakang */}
                  <mesh position={[0, 0.34, 2.1]}>
                    <boxGeometry args={[1.84, 0.18, 0.12]} />
                    <meshStandardMaterial color="#20242b" roughness={0.75} />
                  </mesh>
                  <mesh position={[0, 0.34, -2.1]}>
                    <boxGeometry args={[1.84, 0.18, 0.12]} />
                    <meshStandardMaterial color="#20242b" roughness={0.75} />
                  </mesh>
                </group>
              )}

              {/* === BENTUK 2: MOBIL BOX PENGIRIMAN KOTA === */}
              {isTruck && (
                <group>
                  {/* Sasis Bawah Baja */}
                  <mesh position={[0, 0.42, 0]} castShadow>
                    <boxGeometry args={[1.9, 0.22, 4.9]} />
                    <meshStandardMaterial color="#232830" roughness={0.75} />
                  </mesh>
                  {/* Kabin Pengemudi Depan */}
                  <mesh position={[0, 1.08, 1.62]} castShadow>
                    <boxGeometry args={[1.92, 1.22, 1.65]} />
                    <meshStandardMaterial color={car.color} roughness={0.35} metalness={0.35} />
                  </mesh>
                  {/* Kaca Depan Kabin */}
                  <mesh position={[0, 1.28, 2.46]}>
                    <planeGeometry args={[1.68, 0.62]} />
                    <meshStandardMaterial color="#1b2636" roughness={0.12} metalness={0.7} />
                  </mesh>
                  {/* Boks Kargo Belakang Putih Bersih */}
                  <mesh position={[0, 1.46, -0.82]} castShadow>
                    <boxGeometry args={[2.06, 1.92, 3.35]} />
                    <meshStandardMaterial color={car.accentColor ?? '#eef2f6'} roughness={0.48} metalness={0.18} />
                  </mesh>
                  {/* Strip Logistik Warna di Sisi Boks */}
                  <mesh position={[0, 1.22, -0.82]}>
                    <boxGeometry args={[2.1, 0.28, 3.2]} />
                    <meshStandardMaterial color={car.color} roughness={0.45} />
                  </mesh>
                  {/* Strip Reflektor Keselamatan Belakang */}
                  <mesh position={[0, 0.85, -2.51]}>
                    <boxGeometry args={[1.76, 0.1, 0.04]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={isLit ? 1.2 : 0.15} />
                  </mesh>
                </group>
              )}

              {/* === BENTUK 3: BUS KOTA MODERN ("TRANS SENJA") === */}
              {isBus && (
                <group>
                  {/* Bodi Bawah Biru Royal & Putih Bersih */}
                  <mesh position={[0, 0.82, 0]} castShadow>
                    <boxGeometry args={[2.22, 1.02, 7.2]} />
                    <meshStandardMaterial color={car.color} roughness={0.3} metalness={0.32} />
                  </mesh>
                  {/* Strip Kuning Hangat Memanjang di Kedua Sisi */}
                  <mesh position={[0, 1.24, 0]}>
                    <boxGeometry args={[2.26, 0.16, 7.22]} />
                    <meshStandardMaterial color={car.accentColor ?? '#f5b82e'} roughness={0.4} />
                  </mesh>
                  {/* Kabin Atas Putih & Jendela Penumpang Bercahaya Hangat saat Malam */}
                  <mesh position={[0, 1.88, 0]} castShadow>
                    <boxGeometry args={[2.18, 1.12, 7.12]} />
                    <meshStandardMaterial color="#eef2f6" roughness={0.35} metalness={0.18} />
                  </mesh>
                  {/* Deretan 5 Jendela Kiri & Kanan */}
                  {[-2.35, -1.18, 0, 1.18, 2.35].map((wz, wi) => (
                    <React.Fragment key={`bw-${wi}`}>
                      <mesh position={[1.1, 1.86, wz]} rotation={[0, Math.PI / 2, 0]}>
                        <planeGeometry args={[1.02, 0.82]} />
                        <meshStandardMaterial
                          color={isLit ? '#ffe9b8' : '#243447'}
                          emissive={isLit ? '#ffca78' : '#000000'}
                          emissiveIntensity={isLit ? 0.95 : 0}
                          roughness={0.15}
                          metalness={0.45}
                        />
                      </mesh>
                      <mesh position={[-1.1, 1.86, wz]} rotation={[0, -Math.PI / 2, 0]}>
                        <planeGeometry args={[1.02, 0.82]} />
                        <meshStandardMaterial
                          color={isLit ? '#ffe9b8' : '#243447'}
                          emissive={isLit ? '#ffca78' : '#000000'}
                          emissiveIntensity={isLit ? 0.95 : 0}
                          roughness={0.15}
                          metalness={0.45}
                        />
                      </mesh>
                    </React.Fragment>
                  ))}
                  {/* Kaca Depan Panoramik & Papan LED Rute "TRANS SENJA · KORIDOR 1" */}
                  <mesh position={[0, 1.72, 3.57]}>
                    <planeGeometry args={[1.92, 1.05]} />
                    <meshStandardMaterial color="#182433" roughness={0.12} metalness={0.68} />
                  </mesh>
                  <mesh position={[0, 2.34, 3.58]}>
                    <planeGeometry args={[1.65, 0.28]} />
                    <meshStandardMaterial
                      map={busRouteTex}
                      emissiveMap={busRouteTex}
                      emissive="#ffffff"
                      emissiveIntensity={isLit ? 1.3 : 0.45}
                    />
                  </mesh>
                  {/* Unit AC Atap Bus */}
                  <mesh position={[0, 2.58, -0.2]} castShadow>
                    <boxGeometry args={[1.45, 0.28, 3.4]} />
                    <meshStandardMaterial color="#dce3ec" roughness={0.45} />
                  </mesh>
                  {/* Pintu Lipat Penumpang Sisi Kiri (menghadap Halte) */}
                  <mesh position={[-1.11, 1.28, 1.65]} rotation={[0, -Math.PI / 2, 0]}>
                    <planeGeometry args={[0.92, 1.88]} />
                    <meshStandardMaterial color="#1f2937" roughness={0.25} metalness={0.5} />
                  </mesh>
                </group>
              )}

              {/* === BENTUK 4: SEDAN MODERN === */}
              {!isAngkot && !isTruck && !isBus && (
                <group>
                  <mesh position={[0, 0.56, 0]} castShadow>
                    <boxGeometry args={[1.88, 0.58, 4.05]} />
                    <meshStandardMaterial color={car.color} roughness={0.28} metalness={0.45} />
                  </mesh>
                  <mesh position={[0, 1.05, -0.18]} castShadow>
                    <boxGeometry args={[1.56, 0.52, 2.05]} />
                    <meshStandardMaterial color="#1d2530" roughness={0.14} metalness={0.65} />
                  </mesh>
                </group>
              )}

              {/* 4 Roda Berputar */}
              {[
                [-wheelX, wheelRadius, wheelZFront],
                [wheelX, wheelRadius, wheelZFront],
                [-wheelX, wheelRadius, wheelZRear],
                [wheelX, wheelRadius, wheelZRear],
              ].map(([wx, wy, wz], wi) => (
                <group
                  key={`w-${wi}`}
                  ref={(el) => {
                    if (el) wheelRefs.current[i][wi] = el;
                  }}
                  position={[wx, wy, wz]}
                >
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[wheelRadius, wheelRadius, 0.24, 12]} />
                    <meshStandardMaterial color="#1b1e23" roughness={0.85} />
                  </mesh>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[wheelRadius * 0.54, wheelRadius * 0.54, 0.26, 8]} />
                    <meshStandardMaterial color="#9ea6b2" metalness={0.7} roughness={0.3} />
                  </mesh>
                </group>
              ))}

              {/* Lampu Depan + Pendaran */}
              {[-0.68, 0.68].map((hx, hi) => (
                <group key={`hl-${hi}`} position={[hx, isBus ? 0.72 : isTruck ? 0.72 : 0.58, headZ]}>
                  <mesh>
                    <boxGeometry args={[0.38, 0.16, 0.05]} />
                    <meshStandardMaterial
                      color="#fff8de"
                      emissive="#ffebad"
                      emissiveIntensity={isLit ? 3.2 : 0.2}
                    />
                  </mesh>
                  {isLit && settings.cinematicGlow && (
                    <sprite position={[0, 0, 0.15]} scale={[1.6, 1.6, 1]}>
                      <spriteMaterial
                        map={textures.glowSprite}
                        color="#ffe8a3"
                        transparent
                        opacity={0.7}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                      />
                    </sprite>
                  )}
                </group>
              ))}

              {/* Lampu Rem Belakang Realistis (Menyala Terang Merah + Halo Glow Saat Mengerem!) */}
              <mesh position={[0, tailY, tailZ]}>
                <boxGeometry args={[isBus ? 1.98 : isTruck ? 1.76 : 1.56, 0.17, 0.06]} />
                <meshStandardMaterial
                  ref={(el) => {
                    brakeMatRefs.current[i] = el;
                  }}
                  color="#ff3d33"
                  emissive="#ff2a1f"
                  emissiveIntensity={isLit ? 1.8 : 0.35}
                />
              </mesh>
              <sprite
                ref={(el) => {
                  brakeHaloRefs.current[i] = el;
                }}
                position={[0, tailY, tailZ - 0.14]}
                scale={[2.9, 1.35, 1]}
                visible={false}
              >
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ff2e24"
                  transparent
                  opacity={0}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            </group>
          );
        })}
      </group>

      {/* Kereta Komuter KRL Indonesia (3 Gerbong, Lampu Depan/Belakang, & Pintu Geser Peron) */}
      <group ref={trainRef} position={[94.3, 1.35, -110]}>
        {[-13, 0, 13].map((cz, idx) => (
          <group key={`coach-${idx}`} position={[0, 0, cz]}>
            {/* Badan Gerbong Putih-Silver + Garis Merah Khas KRL */}
            <mesh castShadow>
              <boxGeometry args={[2.75, 2.55, 12.2]} />
              <meshStandardMaterial color="#e0dcd2" roughness={0.35} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.58, 0]}>
              <boxGeometry args={[2.79, 0.48, 12.26]} />
              <meshStandardMaterial color="#b24438" roughness={0.4} />
            </mesh>
            {/* Jendela Gerbong Bercahaya Hangat */}
            <mesh position={[-1.39, 0.36, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[10.5, 0.86]} />
              <meshStandardMaterial
                color="#ffebb8"
                emissive="#ffc266"
                emissiveIntensity={isLit ? 2.1 : 0.18}
                roughness={0.2}
              />
            </mesh>

            {/* 2 Pasang Pintu Geser Otomatis Sisi Peron (X = -1.40) + Rongga Kabin Hangat */}
            {[-2.9, 2.9].map((doorZ, dSub) => {
              const slotIdx = idx * 2 + dSub;
              return (
                <group key={`tdoor-${slotIdx}`}>
                  {/* Bukaan Kabin Dalam Bercahaya saat Pintu Terbuka */}
                  <mesh position={[-1.392, -0.08, doorZ]} rotation={[0, -Math.PI / 2, 0]}>
                    <planeGeometry args={[1.3, 1.92]} />
                    <meshStandardMaterial
                      color="#ffe8b8"
                      emissive="#ffca75"
                      emissiveIntensity={isLit ? 1.85 : 0.55}
                    />
                  </mesh>
                  {/* Daun Pintu Kiri */}
                  <mesh
                    ref={(el) => {
                      trainDoorLRefs.current[slotIdx] = el;
                    }}
                    position={[-1.405, -0.08, doorZ - 0.34]}
                  >
                    <boxGeometry args={[0.04, 1.94, 0.66]} />
                    <meshStandardMaterial color="#cbd2db" metalness={0.45} roughness={0.35} />
                  </mesh>
                  {/* Daun Pintu Kanan */}
                  <mesh
                    ref={(el) => {
                      trainDoorRRefs.current[slotIdx] = el;
                    }}
                    position={[-1.405, -0.08, doorZ + 0.34]}
                  >
                    <boxGeometry args={[0.04, 1.94, 0.66]} />
                    <meshStandardMaterial color="#cbd2db" metalness={0.45} roughness={0.35} />
                  </mesh>
                </group>
              );
            })}

            {/* Lampu Depan Kabin Masinis (Gerbong Paling Depan +Z) */}
            {idx === 2 && (
              <>
                {[-0.72, 0.72].map((hx, hi) => (
                  <mesh key={`thl-${hi}`} position={[hx, -0.42, 6.13]}>
                    <circleGeometry args={[0.2, 10]} />
                    <meshStandardMaterial color="#fff8de" emissive="#ffe599" emissiveIntensity={3.5} />
                  </mesh>
                ))}
                {isLit && settings.cinematicGlow && (
                  <sprite position={[0, -0.35, 6.3]} scale={[4.2, 3.0, 1]}>
                    <spriteMaterial
                      map={textures.glowSprite}
                      color="#ffe8a8"
                      transparent
                      opacity={0.75}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                    />
                  </sprite>
                )}
              </>
            )}

            {/* Lampu Merah Ekor Kereta (Gerbong Paling Belakang -Z) */}
            {idx === 0 &&
              [-0.78, 0.78].map((rx, ri) => (
                <mesh key={`ttl-${ri}`} position={[rx, -0.45, -6.13]} rotation={[0, Math.PI, 0]}>
                  <circleGeometry args={[0.16, 10]} />
                  <meshStandardMaterial color="#ff473d" emissive="#ff2a1f" emissiveIntensity={3.0} />
                </mesh>
              ))}
          </group>
        ))}
      </group>

      {/* 6 Pejalan Kaki Trotoar Lengkap Berwajah, Berambut, Payung Hujan & Responsif */}
      {PEDESTRIAN_CONFIGS.map((cfg, idx) => (
        <AnimatedPedestrian
          key={cfg.id}
          cfg={cfg}
          index={idx}
          isRain={timeOfDay === 'rain_dusk'}
          positionsOut={walkerPositionsRef}
        />
      ))}

      {/* Kucing Oranye "Sore" */}
      <group position={[9.5, 0.18, 56.5]} rotation={[0, -0.6, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.13, 0.32, 6, 10]} />
          <meshStandardMaterial color="#db883d" roughness={0.88} />
        </mesh>
        <group ref={catHeadRef} position={[0, 0.15, 0.25]}>
          <mesh castShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#e3944a" roughness={0.88} />
          </mesh>
          <mesh position={[-0.07, 0.12, 0.01]}>
            <coneGeometry args={[0.045, 0.09, 6]} />
            <meshStandardMaterial color="#d98236" />
          </mesh>
          <mesh position={[0.07, 0.12, 0.01]}>
            <coneGeometry args={[0.045, 0.09, 6]} />
            <meshStandardMaterial color="#d98236" />
          </mesh>
        </group>
        <mesh ref={catTailRef} position={[0, 0.16, -0.26]} rotation={[0.6, 0, 0]}>
          <capsuleGeometry args={[0.03, 0.28, 6, 8]} />
          <meshStandardMaterial color="#c9742c" />
        </mesh>
      </group>

      {/* Bonus Suasana Hidup: Burung Kota, Kawanan Bangau Formasi-V & Percikan Hujan */}
      <CityBirds visible={settings.graphicsQuality !== 'potato' && (timeOfDay === 'morning' || timeOfDay === 'sunset')} />
      <HeronVFlock visible={settings.graphicsQuality !== 'potato' && (timeOfDay === 'morning' || timeOfDay === 'sunset')} />
      <RainGroundSplashes active={settings.graphicsQuality !== 'potato' && timeOfDay === 'rain_dusk' && settings.particleDensity !== 'low'} />
    </group>
  );
};
