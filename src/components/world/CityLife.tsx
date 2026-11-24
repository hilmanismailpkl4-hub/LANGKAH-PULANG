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

interface TrafficCar {
  id: number;
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
];

/**
 * Pejalan kaki warga kota lengkap dengan wajah, rambut, aksesori, kontak mata & langkah alami.
 */
const AnimatedPedestrian: React.FC<{
  cfg: PedestrianConfig;
  index: number;
  positionsOut: React.MutableRefObject<{ id: string; x: number; z: number; radius: number }[]>;
}> = ({ cfg, index, positionsOut }) => {
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

    if (rootRef.current) {
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
    if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, -swing * 0.72, dt * 12);

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
  const carsGroupRef = useRef<THREE.Group>(null);
  const brakeMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const wheelRefs = useRef<THREE.Group[][]>([]);
  const trainRef = useRef<THREE.Group>(null);
  const walkerPositionsRef = useRef<{ id: string; x: number; z: number; radius: number }[]>([]);
  const catTailRef = useRef<THREE.Mesh>(null);
  const catHeadRef = useRef<THREE.Group>(null);

  const cars = useMemo<TrafficCar[]>(
    () => [
      { id: 0, axis: 'x', lane: 2.7, dir: 1, pos: -72, min: -92, max: 56, maxSpeed: 8.6, currentSpeed: 8.6, wheelAngle: 0, lastHornAt: -10, color: '#e4e0d8' },
      { id: 1, axis: 'x', lane: -2.7, dir: -1, pos: 42, min: -92, max: 56, maxSpeed: 8.2, currentSpeed: 8.2, wheelAngle: 0, lastHornAt: -10, color: '#3b536b' },
      { id: 2, axis: 'x', lane: 2.7, dir: 1, pos: 18, min: -92, max: 56, maxSpeed: 8.8, currentSpeed: 8.8, wheelAngle: 0, lastHornAt: -10, color: '#964438' },
      { id: 3, axis: 'z', lane: 2.7, dir: 1, pos: -46, min: -58, max: 42, maxSpeed: 7.8, currentSpeed: 7.8, wheelAngle: 0, lastHornAt: -10, color: '#454f59' },
      { id: 4, axis: 'z', lane: -2.7, dir: -1, pos: 28, min: -58, max: 42, maxSpeed: 8.2, currentSpeed: 8.2, wheelAngle: 0, lastHornAt: -10, color: '#baa07b' },
      { id: 5, axis: 'z', lane: 64 + 2.2, dir: 1, pos: -48, min: -58, max: 54, maxSpeed: 8.4, currentSpeed: 8.4, wheelAngle: 0, lastHornAt: -10, color: '#344c49' },
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
          if (forwardDist > -1.4 && forwardDist < 9.2 && lateralDist < 2.35) {
            shouldStop = true;
            blockedByPlayer = forwardDist > 1.2;
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
            if (ahead > 0 && ahead < 8.5) shouldStop = true;
          }
          if (other.axis !== car.axis && Math.abs(other.lane) < 6 && Math.abs(car.lane) < 6) {
            const otherInCenter = Math.abs(other.pos) < 7.5;
            const approachCenter = car.dir === 1 ? -8.2 - car.pos : car.pos - 8.2;
            if (otherInCenter && approachCenter >= -0.5 && approachCenter < 4.5) shouldStop = true;
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
        if (brakeMat) {
          const braking = shouldStop || car.currentSpeed < car.maxSpeed * 0.45;
          brakeMat.emissiveIntensity = braking ? 5.2 : isLit ? 1.8 : 0.35;
        }

        const carWheels = wheelRefs.current[i];
        if (carWheels) {
          for (const w of carWheels) {
            if (w) w.rotation.x = car.wheelAngle;
          }
        }

        const halfX = car.axis === 'x' ? 2.12 : 1.05;
        const halfZ = car.axis === 'x' ? 1.05 : 2.12;
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

    // === 2. KERETA KOMUTER STASIUN SENJA ===
    if (trainRef.current) {
      const cycle = ((t * 11) % 240) - 120;
      trainRef.current.position.set(94.3, 1.35, cycle);
      playerRuntime.trainZ = cycle;
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
      {/* Mobil Modern Detail */}
      <group ref={carsGroupRef}>
        {cars.map((car, i) => {
          if (!wheelRefs.current[i]) wheelRefs.current[i] = [];
          return (
            <group key={`car-${i}`}>
              <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.1, 4.3]} />
                <meshBasicMaterial color="#090b0f" transparent opacity={0.42} depthWrite={false} />
              </mesh>
              <mesh position={[0, 0.56, 0]} castShadow>
                <boxGeometry args={[1.88, 0.58, 4.05]} />
                <meshStandardMaterial color={car.color} roughness={0.28} metalness={0.45} />
              </mesh>
              <mesh position={[0, 1.05, -0.18]} castShadow>
                <boxGeometry args={[1.56, 0.52, 2.05]} />
                <meshStandardMaterial color="#1d2530" roughness={0.14} metalness={0.65} />
              </mesh>
              {[
                [-0.92, 0.3, 1.25],
                [0.92, 0.3, 1.25],
                [-0.92, 0.3, -1.25],
                [0.92, 0.3, -1.25],
              ].map(([wx, wy, wz], wi) => (
                <group
                  key={`w-${wi}`}
                  ref={(el) => {
                    if (el) wheelRefs.current[i][wi] = el;
                  }}
                  position={[wx, wy, wz]}
                >
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.22, 12]} />
                    <meshStandardMaterial color="#1b1e23" roughness={0.85} />
                  </mesh>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.24, 8]} />
                    <meshStandardMaterial color="#9ea6b2" metalness={0.7} roughness={0.3} />
                  </mesh>
                </group>
              ))}
              {[-0.62, 0.62].map((hx, hi) => (
                <group key={`hl-${hi}`} position={[hx, 0.58, 2.05]}>
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
              <mesh position={[0, 0.58, -2.04]}>
                <boxGeometry args={[1.54, 0.16, 0.05]} />
                <meshStandardMaterial
                  ref={(el) => {
                    brakeMatRefs.current[i] = el;
                  }}
                  color="#ff3d33"
                  emissive="#ff2a1f"
                  emissiveIntensity={isLit ? 1.8 : 0.35}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Kereta Komuter */}
      <group ref={trainRef} position={[94.3, 1.35, -80]}>
        {[-13, 0, 13].map((cz, idx) => (
          <group key={`coach-${idx}`} position={[0, 0, cz]}>
            <mesh castShadow>
              <boxGeometry args={[2.75, 2.55, 12.2]} />
              <meshStandardMaterial color="#e0dcd2" roughness={0.35} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.58, 0]}>
              <boxGeometry args={[2.79, 0.48, 12.26]} />
              <meshStandardMaterial color="#b24438" roughness={0.4} />
            </mesh>
            <mesh position={[-1.39, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[10.5, 0.92]} />
              <meshStandardMaterial
                color="#ffebb8"
                emissive="#ffc266"
                emissiveIntensity={isLit ? 2.1 : 0.15}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6 Pejalan Kaki Trotoar Lengkap Berwajah, Berambut & Responsif */}
      {PEDESTRIAN_CONFIGS.map((cfg, idx) => (
        <AnimatedPedestrian
          key={cfg.id}
          cfg={cfg}
          index={idx}
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

      {/* Bonus Suasana Hidup: Burung Kota & Percikan Hujan */}
      <CityBirds visible={timeOfDay === 'morning' || timeOfDay === 'sunset'} />
      <RainGroundSplashes active={timeOfDay === 'rain_dusk' && settings.particleDensity !== 'low'} />
    </group>
  );
};
