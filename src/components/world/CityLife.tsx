import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface CityLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

interface TrafficCar {
  axis: 'x' | 'z';
  lane: number;
  dir: 1 | -1;
  pos: number;
  min: number;
  max: number;
  speed: number;
  color: string;
}

export const CityLife: React.FC<CityLifeProps> = ({ timeOfDay, settings }) => {
  const isLit = timeOfDay !== 'morning';
  const textures = useMemo(() => getProceduralTextures(), []);
  const carsGroupRef = useRef<THREE.Group>(null);
  const trainRef = useRef<THREE.Group>(null);
  const walkersRef = useRef<THREE.Group>(null);
  const catTailRef = useRef<THREE.Mesh>(null);

  const cars = useMemo<TrafficCar[]>(
    () => [
      { axis: 'x', lane: 2.6, dir: 1, pos: -70, min: -92, max: 58, speed: 9.2, color: '#e4e0d8' },
      { axis: 'x', lane: -2.6, dir: -1, pos: 45, min: -92, max: 58, speed: 8.5, color: '#3b536b' },
      { axis: 'x', lane: 2.6, dir: 1, pos: 15, min: -92, max: 58, speed: 9.8, color: '#964438' },
      { axis: 'z', lane: 2.6, dir: 1, pos: -45, min: -58, max: 44, speed: 8.0, color: '#454f59' },
      { axis: 'z', lane: -2.6, dir: -1, pos: 28, min: -58, max: 44, speed: 8.6, color: '#baa07b' },
      { axis: 'z', lane: 64 + 2.2, dir: 1, pos: -50, min: -58, max: 56, speed: 9.0, color: '#344c49' },
    ],
    [],
  );

  const walkers = useMemo(
    () => [
      { x0: -30, z0: 7.5, x1: 36, z1: 7.5, speed: 1.5, phase: 0.1, shirt: '#6f8596' },
      { x0: 36, z0: -7.5, x1: -28, z1: -7.5, speed: 1.35, phase: 0.45, shirt: '#b87b69' },
      { x0: -7.5, z0: 12, x1: -7.5, z1: 44, speed: 1.4, phase: 0.7, shirt: '#7d8a68' },
      { x0: -64, z0: -38, x1: -64, z1: -10, speed: 1.2, phase: 0.25, shirt: '#a89274' },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (carsGroupRef.current) {
      cars.forEach((car, i) => {
        car.pos += car.dir * car.speed * dt;
        if (car.dir === 1 && car.pos > car.max) car.pos = car.min;
        if (car.dir === -1 && car.pos < car.min) car.pos = car.max;

        const mesh = carsGroupRef.current!.children[i];
        if (!mesh) return;
        const y = car.axis === 'x' && car.pos > -57 && car.pos < -39 ? 0.28 : 0.04;
        if (car.axis === 'x') {
          mesh.position.set(car.pos, y, car.lane);
          mesh.rotation.y = car.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          mesh.position.set(car.lane, y, car.pos);
          mesh.rotation.y = car.dir === 1 ? 0 : Math.PI;
        }
      });
    }

    if (trainRef.current) {
      const cycle = ((t * 11) % 240) - 120;
      trainRef.current.position.set(94.3, 1.35, cycle);
    }

    if (walkersRef.current) {
      walkers.forEach((w, i) => {
        const node = walkersRef.current!.children[i];
        if (!node) return;
        const p = (t * w.speed * 0.025 + w.phase) % 2;
        const f = p <= 1 ? p : 2 - p;
        const x = THREE.MathUtils.lerp(w.x0, w.x1, f);
        const z = THREE.MathUtils.lerp(w.z0, w.z1, f);
        const bob = Math.abs(Math.sin(t * 5.2 + i)) * 0.05;
        node.position.set(x, bob, z);
        const dx = (w.x1 - w.x0) * (p <= 1 ? 1 : -1);
        const dz = (w.z1 - w.z0) * (p <= 1 ? 1 : -1);
        node.rotation.y = Math.atan2(dx, dz);
      });
    }

    if (catTailRef.current) {
      catTailRef.current.rotation.z = Math.sin(t * 2.6) * 0.35;
    }
  });

  return (
    <group>
      {/* Mobil Modern Detail dengan 4 Roda & Halo Lampu */}
      <group ref={carsGroupRef}>
        {cars.map((car, i) => (
          <group key={`car-${i}`}>
            {/* Badan Mobil Berkilau */}
            <mesh position={[0, 0.56, 0]} castShadow>
              <boxGeometry args={[1.88, 0.58, 4.05]} />
              <meshStandardMaterial color={car.color} roughness={0.28} metalness={0.45} />
            </mesh>
            {/* Kabin Kaca Gelap */}
            <mesh position={[0, 1.05, -0.18]} castShadow>
              <boxGeometry args={[1.56, 0.52, 2.05]} />
              <meshStandardMaterial color="#1d2530" roughness={0.14} metalness={0.65} />
            </mesh>
            {/* 4 Roda */}
            {[
              [-0.92, 0.3, 1.25],
              [0.92, 0.3, 1.25],
              [-0.92, 0.3, -1.25],
              [0.92, 0.3, -1.25],
            ].map(([wx, wy, wz], wi) => (
              <mesh key={`w-${wi}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.22, 12]} />
                <meshStandardMaterial color="#1b1e23" roughness={0.85} />
              </mesh>
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
            {/* Lampu Rem Merah */}
            <mesh position={[0, 0.58, -2.04]}>
              <boxGeometry args={[1.54, 0.14, 0.05]} />
              <meshStandardMaterial color="#e84035" emissive="#e84035" emissiveIntensity={isLit ? 2.4 : 0.3} />
            </mesh>
          </group>
        ))}
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

      {/* Pejalan Kaki Stylized Halus */}
      <group ref={walkersRef}>
        {walkers.map((w, i) => (
          <group key={`walker-${i}`}>
            <mesh position={[0, 0.48, 0]} castShadow>
              <capsuleGeometry args={[0.16, 0.52, 6, 10]} />
              <meshStandardMaterial color="#2c323b" roughness={0.88} />
            </mesh>
            <mesh position={[0, 1.15, 0]} castShadow>
              <capsuleGeometry args={[0.19, 0.34, 6, 10]} />
              <meshStandardMaterial color={w.shirt} roughness={0.8} />
            </mesh>
            <mesh position={[0, 1.62, 0]} castShadow>
              <sphereGeometry args={[0.165, 12, 12]} />
              <meshStandardMaterial color="#d8aa85" roughness={0.75} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Kucing Oranye "Sore" Detail */}
      <group position={[9.5, 0.18, 56.5]} rotation={[0, -0.6, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.13, 0.32, 6, 10]} />
          <meshStandardMaterial color="#db883d" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.15, 0.25]} castShadow>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#e3944a" roughness={0.88} />
        </mesh>
        <mesh position={[-0.07, 0.27, 0.26]}>
          <coneGeometry args={[0.045, 0.09, 6]} />
          <meshStandardMaterial color="#d98236" />
        </mesh>
        <mesh position={[0.07, 0.27, 0.26]}>
          <coneGeometry args={[0.045, 0.09, 6]} />
          <meshStandardMaterial color="#d98236" />
        </mesh>
        <mesh ref={catTailRef} position={[0, 0.16, -0.26]} rotation={[0.6, 0, 0]}>
          <capsuleGeometry args={[0.03, 0.28, 6, 8]} />
          <meshStandardMaterial color="#c9742c" />
        </mesh>
      </group>
    </group>
  );
};
