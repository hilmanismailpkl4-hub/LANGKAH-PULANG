import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MAIN_STEP_BY_ID } from '../../data/dialogues';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';

export const WaypointBeacon: React.FC = () => {
  const mainStepId = useGameStore((s) => s.mainStepId);
  const showWaypoint = useGameStore((s) => s.settings.showWaypoint);
  const screen = useGameStore((s) => s.screen);
  const beamRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const step = MAIN_STEP_BY_ID[mainStepId];

  useFrame(({ clock }) => {
    if (!step || !beamRef.current || !ringRef.current) return;
    const [wx, wy, wz] = step.waypoint;
    const [px, , pz] = playerRuntime.position;
    const dist = Math.hypot(px - wx, pz - wz);

    // Memudar lembut saat pemain sudah sangat dekat agar tidak mengganggu adegan
    const opacity = THREE.MathUtils.clamp((dist - 3.5) / 10, 0.08, 0.42);
    const beamMat = beamRef.current.material as THREE.MeshBasicMaterial;
    beamMat.opacity = opacity;

    const pulse = 1 + Math.sin(clock.getElapsedTime() * 2.2) * 0.14;
    ringRef.current.scale.set(pulse, pulse, 1);
    ringRef.current.position.y = wy + 1.4 + Math.sin(clock.getElapsedTime() * 1.8) * 0.22;
  });

  if (screen !== 'playing' || !showWaypoint || !step) return null;

  const [wx, wy, wz] = step.waypoint;

  return (
    <group>
      <mesh ref={beamRef} position={[wx, wy + 7.5, wz]}>
        <cylinderGeometry args={[0.12, 0.48, 16, 12, 1, true]} />
        <meshBasicMaterial color="#f5cf86" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ringRef} position={[wx, wy + 1.4, wz]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.65, 24]} />
        <meshBasicMaterial color="#ffe3a8" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
