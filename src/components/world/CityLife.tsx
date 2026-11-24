import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from '../../types/game';

interface CityLifeProps {
  timeOfDay: TimeOfDay;
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

export const CityLife: React.FC<CityLifeProps> = ({ timeOfDay }) => {
  const isLit = timeOfDay !== 'morning';
  const carsGroupRef = useRef<THREE.Group>(null);
  const trainRef = useRef<THREE.Group>(null);
  const walkersRef = useRef<THREE.Group>(null);
  const catTailRef = useRef<THREE.Mesh>(null);

  const cars = useMemo<TrafficCar[]>(
    () => [
      { axis: 'x', lane: 2.6, dir: 1, pos: -70, min: -92, max: 58, speed: 9.2, color: '#d9d5cc' },
      { axis: 'x', lane: -2.6, dir: -1, pos: 45, min: -92, max: 58, speed: 8.5, color: '#455b70' },
      { axis: 'x', lane: 2.6, dir: 1, pos: 15, min: -92, max: 58, speed: 9.8, color: '#8f483d' },
      { axis: 'z', lane: 2.6, dir: 1, pos: -45, min: -58, max: 44, speed: 8.0, color: '#4a545e' },
      { axis: 'z', lane: -2.6, dir: -1, pos: 28, min: -58, max: 44, speed: 8.6, color: '#b59d7a' },
      { axis: 'z', lane: 64 + 2.2, dir: 1, pos: -50, min: -58, max: 56, speed: 9.0, color: '#3b4e4c' },
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

    // Update mobil lalu-lalang
    if (carsGroupRef.current) {
      cars.forEach((car, i) => {
        car.pos += car.dir * car.speed * dt;
        if (car.dir === 1 && car.pos > car.max) car.pos = car.min;
        if (car.dir === -1 && car.pos < car.min) car.pos = car.max;

        const mesh = carsGroupRef.current!.children[i];
        if (!mesh) return;
        const y = car.axis === 'x' && car.pos > -57 && car.pos < -39 ? 0.34 : 0.1;
        if (car.axis === 'x') {
          mesh.position.set(car.pos, y, car.lane);
          mesh.rotation.y = car.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          mesh.position.set(car.lane, y, car.pos);
          mesh.rotation.y = car.dir === 1 ? 0 : Math.PI;
        }
      });
    }

    // Update kereta komuter Stasiun Tua
    if (trainRef.current) {
      const cycle = ((t * 11) % 240) - 120;
      trainRef.current.position.set(94.3, 1.35, cycle);
    }

    // Update pejalan kaki ringan di trotoar
    if (walkersRef.current) {
      walkers.forEach((w, i) => {
        const node = walkersRef.current!.children[i];
        if (!node) return;
        const p = ((t * w.speed * 0.025 + w.phase) % 2);
        const f = p <= 1 ? p : 2 - p;
        const x = THREE.MathUtils.lerp(w.x0, w.x1, f);
        const z = THREE.MathUtils.lerp(w.z0, w.z1, f);
        const bob = Math.abs(Math.sin(t * 5.2 + i)) * 0.06;
        node.position.set(x, bob, z);
        const dx = (w.x1 - w.x0) * (p <= 1 ? 1 : -1);
        const dz = (w.z1 - w.z0) * (p <= 1 ? 1 : -1);
        node.rotation.y = Math.atan2(dx, dz);
      });
    }

    // Ekor kucing oranye "Sore" bergoyang lembut
    if (catTailRef.current) {
      catTailRef.current.rotation.z = Math.sin(t * 2.6) * 0.35;
    }
  });

  return (
    <group>
      {/* Mobil Lalu-Lalang Modern */}
      <group ref={carsGroupRef}>
        {cars.map((car, i) => (
          <group key={`car-${i}`}>
            {/* Badan mobil */}
            <mesh position={[0, 0.52, 0]} castShadow>
              <boxGeometry args={[1.85, 0.62, 3.85]} />
              <meshStandardMaterial color={car.color} roughness={0.42} metalness={0.25} />
            </mesh>
            {/* Kabin */}
            <mesh position={[0, 1.02, -0.15]} castShadow>
              <boxGeometry args={[1.58, 0.52, 2.0]} />
              <meshStandardMaterial color="#2a323d" roughness={0.25} metalness={0.4} />
            </mesh>
            {/* Lampu Depan & Belakang */}
            <mesh position={[-0.6, 0.55, 1.94]}>
              <boxGeometry args={[0.35, 0.16, 0.05]} />
              <meshStandardMaterial
                color="#fff6d6"
                emissive="#ffeaab"
                emissiveIntensity={isLit ? 2.6 : 0.2}
              />
            </mesh>
            <mesh position={[0.6, 0.55, 1.94]}>
              <boxGeometry args={[0.35, 0.16, 0.05]} />
              <meshStandardMaterial
                color="#fff6d6"
                emissive="#ffeaab"
                emissiveIntensity={isLit ? 2.6 : 0.2}
              />
            </mesh>
            <mesh position={[0, 0.55, -1.94]}>
              <boxGeometry args={[1.45, 0.14, 0.05]} />
              <meshStandardMaterial color="#e0483d" emissive="#e0483d" emissiveIntensity={isLit ? 1.8 : 0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Kereta Komuter Stasiun Senja */}
      <group ref={trainRef} position={[94.3, 1.35, -80]}>
        {[-13, 0, 13].map((cz, idx) => (
          <group key={`coach-${idx}`} position={[0, 0, cz]}>
            <mesh castShadow>
              <boxGeometry args={[2.7, 2.5, 12.2]} />
              <meshStandardMaterial color="#dcd8cf" roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.55, 0]}>
              <boxGeometry args={[2.74, 0.48, 12.25]} />
              <meshStandardMaterial color="#b24438" />
            </mesh>
            <mesh position={[-1.37, 0.28, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[10.5, 0.9]} />
              <meshStandardMaterial
                color="#ffe7b3"
                emissive="#ffc266"
                emissiveIntensity={isLit ? 1.6 : 0.15}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Pejalan Kaki Ringan */}
      <group ref={walkersRef}>
        {walkers.map((w, i) => (
          <group key={`walker-${i}`}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.36, 0.82, 0.24]} />
              <meshStandardMaterial color="#2e333c" />
            </mesh>
            <mesh position={[0, 1.12, 0]} castShadow>
              <boxGeometry args={[0.42, 0.62, 0.28]} />
              <meshStandardMaterial color={w.shirt} />
            </mesh>
            <mesh position={[0, 1.62, 0]} castShadow>
              <sphereGeometry args={[0.17, 10, 10]} />
              <meshStandardMaterial color="#d8aa85" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Kucing Oranye "Sore" di Perumahan Melati */}
      <group position={[9.5, 0.18, 56.5]} rotation={[0, -0.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.24, 0.52]} />
          <meshStandardMaterial color="#d9863b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0.28]} castShadow>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color="#e09248" roughness={0.9} />
        </mesh>
        <mesh ref={catTailRef} position={[0, 0.14, -0.28]} rotation={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.34, 6]} />
          <meshStandardMaterial color="#c9742c" />
        </mesh>
      </group>
    </group>
  );
};
