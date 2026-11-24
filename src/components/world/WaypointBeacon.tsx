import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';

export const WaypointBeacon: React.FC = () => {
  const mainStepId = useGameStore((s) => s.mainStepId);
  const customWaypoint = useGameStore((s) => s.customWaypoint);
  const showWaypoint = useGameStore((s) => s.settings.showWaypoint);
  const screen = useGameStore((s) => s.screen);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);

  const beamRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const customBeamRef = useRef<THREE.Mesh>(null);
  const customRingRef = useRef<THREE.Mesh>(null);

  const step = MAIN_STEP_BY_ID[mainStepId];

  useFrame(({ clock }) => {
    const [px, , pz] = playerRuntime.position;
    const t = clock.getElapsedTime();

    if (step && beamRef.current && ringRef.current) {
      const [wx, wy, wz] = step.waypoint;
      const dist = Math.hypot(px - wx, pz - wz);
      const opacity = THREE.MathUtils.clamp((dist - 3.5) / 10, 0.08, 0.4);
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      const pulse = 1 + Math.sin(t * 2.2) * 0.14;
      ringRef.current.scale.set(pulse, pulse, 1);
      ringRef.current.position.y = wy + 1.4 + Math.sin(t * 1.8) * 0.22;
    }

    if (customWaypoint && customBeamRef.current && customRingRef.current) {
      const [cx, cy, cz] = customWaypoint.position;
      const dist = Math.hypot(px - cx, pz - cz);
      const opacity = THREE.MathUtils.clamp((dist - 3.0) / 10, 0.1, 0.42);
      (customBeamRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      const pulse = 1 + Math.cos(t * 2.4) * 0.14;
      customRingRef.current.scale.set(pulse, pulse, 1);
      customRingRef.current.position.y = cy + 1.6 + Math.sin(t * 2.0) * 0.2;
    }
  });

  if (screen !== 'playing' || isPhotoMode) return null;

  return (
    <group>
      {/* Penanda Misi Utama (Emas) */}
      {showWaypoint && step && (
        <group>
          <mesh ref={beamRef} position={[step.waypoint[0], step.waypoint[1] + 7.5, step.waypoint[2]]}>
            <cylinderGeometry args={[0.12, 0.48, 16, 12, 1, true]} />
            <meshBasicMaterial color="#f5cf86" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh ref={ringRef} position={[step.waypoint[0], step.waypoint[1] + 1.4, step.waypoint[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.45, 0.65, 24]} />
            <meshBasicMaterial color="#ffe3a8" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Penanda GPS Kustom dari Peta Kota (Toska/Biru Langit) */}
      {customWaypoint && (
        <group>
          <mesh
            ref={customBeamRef}
            position={[customWaypoint.position[0], customWaypoint.position[1] + 8.0, customWaypoint.position[2]]}
          >
            <cylinderGeometry args={[0.14, 0.5, 17, 12, 1, true]} />
            <meshBasicMaterial color="#5ad6e6" transparent opacity={0.32} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          <mesh
            ref={customRingRef}
            position={[customWaypoint.position[0], customWaypoint.position[1] + 1.6, customWaypoint.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.5, 0.72, 24]} />
            <meshBasicMaterial color="#8ae9f5" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};
