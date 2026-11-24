import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { getTrafficSignalState, playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
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

interface AmbientWalker {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
  speed: number;
  progress: number;
  dir: 1 | -1;
  stride: number;
  shirt: string;
}

export const CityLife: React.FC<CityLifeProps> = ({ timeOfDay, settings }) => {
  const isLit = timeOfDay !== 'morning';
  const textures = useMemo(() => getProceduralTextures(), []);
  const carsGroupRef = useRef<THREE.Group>(null);
  const brakeMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const wheelRefs = useRef<THREE.Group[][]>([]);
  const trainRef = useRef<THREE.Group>(null);
  const walkersGroupRef = useRef<THREE.Group>(null);
  const walkerLimbsRef = useRef<
    { leftLeg: THREE.Mesh | null; rightLeg: THREE.Mesh | null; leftArm: THREE.Mesh | null; rightArm: THREE.Mesh | null }[]
  >([]);
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

  const walkers = useMemo<AmbientWalker[]>(
    () => [
      { x0: -30, z0: 7.6, x1: 36, z1: 7.6, speed: 1.55, progress: 0.15, dir: 1, stride: 0, shirt: '#6f8596' },
      { x0: 36, z0: -7.6, x1: -28, z1: -7.6, speed: 1.4, progress: 0.45, dir: 1, stride: 0, shirt: '#b87b69' },
      { x0: -7.6, z0: 14, x1: -7.6, z1: 42, speed: 1.45, progress: 0.6, dir: 1, stride: 0, shirt: '#7d8a68' },
      { x0: -64, z0: -38, x1: -64, z1: -10, speed: 1.25, progress: 0.3, dir: 1, stride: 0, shirt: '#a89274' },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const signal = getTrafficSignalState(t);
    const [px, py, pz] = playerRuntime.position;
    const playerOnGround = py < 10;

    // === 1. AI MOBIL BERHENTI HALUS & KOLISI SOLID ===
    if (carsGroupRef.current) {
      const nextBoxes: typeof playerRuntime.dynamicCarBoxes = [];

      cars.forEach((car, i) => {
        const carX = car.axis === 'x' ? car.pos : car.lane;
        const carZ = car.axis === 'x' ? car.lane : car.pos;

        let shouldStop = false;
        let blockedByPlayer = false;

        // A. Cek apakah Damar berada di depan mobil / di jalur penyeberangan
        if (playerOnGround) {
          const forwardDist =
            car.axis === 'x' ? (px - carX) * car.dir : (pz - carZ) * car.dir;
          const lateralDist =
            car.axis === 'x' ? Math.abs(pz - carZ) : Math.abs(px - carX);

          // Berhenti jauh sebelum menyentuh Damar (0m..9.2m di depan, lebar 2.35m)
          if (forwardDist > -1.4 && forwardDist < 9.2 && lateralDist < 2.35) {
            shouldStop = true;
            blockedByPlayer = forwardDist > 1.2;
          }
        }

        // B. Cek lampu lalu lintas persimpangan pusat (x = 0, z = 0)
        const isMainCrossroadCar =
          (car.axis === 'x' && Math.abs(car.lane) < 6) ||
          (car.axis === 'z' && Math.abs(car.lane) < 6);
        if (isMainCrossroadCar) {
          const myLight = car.axis === 'x' ? signal.ew : signal.ns;
          // Zona garis berhenti tepat sebelum zebra cross (-12..-8.4 jika dir=1, atau 8.4..12 jika dir=-1)
          const distToStopLine = car.dir === 1 ? -8.6 - car.pos : car.pos - 8.6;
          if (myLight !== 'green' && distToStopLine >= -0.4 && distToStopLine < 5.5) {
            shouldStop = true;
          }
        }

        // C. Cek jarak aman dengan mobil lain di jalur yang sama (anti tabrakan/tembus)
        for (const other of cars) {
          if (other.id === car.id) continue;
          if (other.axis === car.axis && Math.abs(other.lane - car.lane) < 1.2) {
            const ahead = (other.pos - car.pos) * car.dir;
            if (ahead > 0 && ahead < 8.5) {
              shouldStop = true;
            }
          }
          // Cegah tabrakan silang di tengah persimpangan utama
          if (other.axis !== car.axis && Math.abs(other.lane) < 6 && Math.abs(car.lane) < 6) {
            const otherInCenter = Math.abs(other.pos) < 7.5;
            const approachCenter = car.dir === 1 ? -8.2 - car.pos : car.pos - 8.2;
            if (otherInCenter && approachCenter >= -0.5 && approachCenter < 4.5) {
              shouldStop = true;
            }
          }
        }

        // Klakson sopan singkat jika Damar mendadak melangkah ke depan mobil yang sedang melaju
        if (blockedByPlayer && car.currentSpeed > 3.2 && t - car.lastHornAt > 6.5) {
          car.lastHornAt = t;
          sfxEngine.play('horn');
        }

        // Akselerasi & pengereman realistis
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

        // Lampu rem menyala terang saat mengerem / berhenti
        const brakeMat = brakeMatRefs.current[i];
        if (brakeMat) {
          const braking = shouldStop || car.currentSpeed < car.maxSpeed * 0.45;
          brakeMat.emissiveIntensity = braking ? 5.2 : isLit ? 1.8 : 0.35;
        }

        // Putar 4 roda sesuai kecepatan aktual mobil
        const carWheels = wheelRefs.current[i];
        if (carWheels) {
          for (const w of carWheels) {
            if (w) w.rotation.x = car.wheelAngle;
          }
        }

        // Daftarkan kotak kolisi solid mobil agar Damar tidak pernah menembus mobil!
        const halfX = car.axis === 'x' ? 2.12 : 1.05;
        const halfZ = car.axis === 'x' ? 1.05 : 2.12;
        nextBoxes.push({
          id: car.id,
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
    }

    // === 3. PEJALAN KAKI TROTOAR (BERGERAK ALAMI & BERHENTI SOPAN JIKA DEKAT DAMAR) ===
    if (walkersGroupRef.current) {
      walkers.forEach((w, i) => {
        const node = walkersGroupRef.current!.children[i];
        if (!node) return;
        const pathLen = Math.hypot(w.x1 - w.x0, w.z1 - w.z0);
        const curX = THREE.MathUtils.lerp(w.x0, w.x1, w.progress);
        const curZ = THREE.MathUtils.lerp(w.z0, w.z1, w.progress);

        // Berhenti sopan jika Damar berdiri tepat di depannya
        const distPlayer = playerOnGround ? Math.hypot(px - curX, pz - curZ) : 99;
        const paused = distPlayer < 2.0;

        if (!paused) {
          w.progress += (w.dir * w.speed * dt) / Math.max(1, pathLen);
          if (w.progress >= 1) {
            w.progress = 1;
            w.dir = -1;
          } else if (w.progress <= 0) {
            w.progress = 0;
            w.dir = 1;
          }
          w.stride += dt * 7.2;
        }

        const nx = THREE.MathUtils.lerp(w.x0, w.x1, w.progress);
        const nz = THREE.MathUtils.lerp(w.z0, w.z1, w.progress);
        const bob = paused ? Math.sin(t * 2.0 + i) * 0.01 : Math.abs(Math.sin(w.stride)) * 0.05;
        node.position.set(nx, bob, nz);

        const targetYaw = paused
          ? Math.atan2(px - nx, pz - nz)
          : Math.atan2((w.x1 - w.x0) * w.dir, (w.z1 - w.z0) * w.dir);
        let diff = targetYaw - node.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        node.rotation.y += diff * Math.min(1, dt * 6);

        const limbs = walkerLimbsRef.current[i];
        if (limbs) {
          const swing = paused ? 0 : Math.sin(w.stride) * 0.45;
          if (limbs.leftLeg) limbs.leftLeg.rotation.x = swing;
          if (limbs.rightLeg) limbs.rightLeg.rotation.x = -swing;
          if (limbs.leftArm) limbs.leftArm.rotation.x = -swing * 0.7;
          if (limbs.rightArm) limbs.rightArm.rotation.x = swing * 0.7;
        }
      });
    }

    // === 4. KUCING ORANYE "SORE" BEREAKSI SAAT DAMAR MENDEKAT ===
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
      {/* Mobil Modern Detail dengan AI Rem & Kolisi Solid */}
      <group ref={carsGroupRef}>
        {cars.map((car, i) => {
          if (!wheelRefs.current[i]) wheelRefs.current[i] = [];
          return (
            <group key={`car-${i}`}>
              {/* Bayangan kontak kolong mobil */}
              <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.1, 4.3]} />
                <meshBasicMaterial color="#090b0f" transparent opacity={0.42} depthWrite={false} />
              </mesh>
              {/* Badan Mobil */}
              <mesh position={[0, 0.56, 0]} castShadow>
                <boxGeometry args={[1.88, 0.58, 4.05]} />
                <meshStandardMaterial color={car.color} roughness={0.28} metalness={0.45} />
              </mesh>
              {/* Kabin Kaca Gelap */}
              <mesh position={[0, 1.05, -0.18]} castShadow>
                <boxGeometry args={[1.56, 0.52, 2.05]} />
                <meshStandardMaterial color="#1d2530" roughness={0.14} metalness={0.65} />
              </mesh>
              {/* 4 Roda Berputar Dinamis */}
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
              {/* Lampu Depan + Glow */}
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
              {/* Lampu Rem Merah Dinamis */}
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

      {/* Kereta Komuter Stasiun Senja */}
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

      {/* Pejalan Kaki Trotoar Terartikulasi */}
      <group ref={walkersGroupRef}>
        {walkers.map((w, i) => {
          if (!walkerLimbsRef.current[i]) {
            walkerLimbsRef.current[i] = { leftLeg: null, rightLeg: null, leftArm: null, rightArm: null };
          }
          return (
            <group key={`walker-${i}`}>
              <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.32, 12]} />
                <meshBasicMaterial color="#0b0d12" transparent opacity={0.3} depthWrite={false} />
              </mesh>
              <mesh
                ref={(el) => {
                  walkerLimbsRef.current[i].leftLeg = el;
                }}
                position={[-0.1, 0.46, 0]}
                castShadow
              >
                <capsuleGeometry args={[0.075, 0.52, 6, 8]} />
                <meshStandardMaterial color="#2c323b" roughness={0.88} />
              </mesh>
              <mesh
                ref={(el) => {
                  walkerLimbsRef.current[i].rightLeg = el;
                }}
                position={[0.1, 0.46, 0]}
                castShadow
              >
                <capsuleGeometry args={[0.075, 0.52, 6, 8]} />
                <meshStandardMaterial color="#2c323b" roughness={0.88} />
              </mesh>
              <mesh position={[0, 1.15, 0]} castShadow>
                <capsuleGeometry args={[0.19, 0.34, 6, 10]} />
                <meshStandardMaterial color={w.shirt} roughness={0.8} />
              </mesh>
              <mesh
                ref={(el) => {
                  walkerLimbsRef.current[i].leftArm = el;
                }}
                position={[-0.25, 1.12, 0]}
                castShadow
              >
                <capsuleGeometry args={[0.055, 0.36, 6, 8]} />
                <meshStandardMaterial color={w.shirt} roughness={0.8} />
              </mesh>
              <mesh
                ref={(el) => {
                  walkerLimbsRef.current[i].rightArm = el;
                }}
                position={[0.25, 1.12, 0]}
                castShadow
              >
                <capsuleGeometry args={[0.055, 0.36, 6, 8]} />
                <meshStandardMaterial color={w.shirt} roughness={0.8} />
              </mesh>
              <mesh position={[0, 1.62, 0]} castShadow>
                <sphereGeometry args={[0.165, 12, 12]} />
                <meshStandardMaterial color="#d8aa85" roughness={0.75} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Kucing Oranye "Sore" Responsif */}
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
    </group>
  );
};
