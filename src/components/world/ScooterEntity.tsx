import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface ScooterEntityProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

/**
 * Merender:
 * 1. Motor Skuter Damar 3D yang bisa dikendarai & diparkir di seluruh kota
 * 2. Perahu kertas origami 3D yang mengapung & hanyut di atas Danau Senja
 * 3. Mangkuk makanan & partikel hati 3D saat memberi makan kucing "Sore"
 * 4. Meja & cangkir kopi mengepul di Kedai Kopi Bima
 */
export const ScooterEntity: React.FC<ScooterEntityProps> = ({ timeOfDay, settings }) => {
  const isLit = timeOfDay !== 'morning';
  const textures = useMemo(() => getProceduralTextures(), []);
  const catFed = useGameStore((s) => s.catFed);
  const paperBoatsCount = useGameStore((s) => s.paperBoatsLaunched);

  const rootRef = useRef<THREE.Group>(null);
  const bodyLeanRef = useRef<THREE.Group>(null);
  const handleRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);
  const brakeMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const boatsGroupRef = useRef<THREE.Group>(null);
  const heartsGroupRef = useRef<THREE.Group>(null);
  const steamGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const sc = playerRuntime.scooter;

    // 1. Update transformasi Motor Skuter Damar
    if (rootRef.current) {
      rootRef.current.position.set(sc.pos[0], sc.pos[1], sc.pos[2]);
      rootRef.current.rotation.y = sc.yaw;
    }
    if (bodyLeanRef.current) {
      bodyLeanRef.current.rotation.z = THREE.MathUtils.lerp(bodyLeanRef.current.rotation.z, sc.roll, dt * 8);
    }
    if (handleRef.current) {
      handleRef.current.rotation.y = THREE.MathUtils.lerp(handleRef.current.rotation.y, sc.steer * 0.45, dt * 10);
    }
    if (frontWheelRef.current) frontWheelRef.current.rotation.x = sc.wheelAngle;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x = sc.wheelAngle;
    if (brakeMatRef.current) {
      brakeMatRef.current.emissiveIntensity = sc.isBraking ? 5.2 : sc.isRiding || isLit ? 2.0 : 0.35;
    }

    // 2. Update perahu kertas yang mengapung pelan di atas Danau Senja
    if (boatsGroupRef.current && playerRuntime.paperBoats.length > 0) {
      playerRuntime.paperBoats.forEach((boat, idx) => {
        // Mengapung lembut ke tengah danau sambil tetap di dalam batas danau
        boat.x = Math.max(-95, Math.min(-76.5, boat.x + boat.vx * dt));
        boat.z = Math.max(-41, Math.min(-15, boat.z + boat.vz * dt));
        boat.vx *= 0.996;
        boat.vz *= 0.996;

        const node = boatsGroupRef.current!.children[idx];
        if (!node) return;
        node.position.set(boat.x, -0.04 + Math.sin(t * 2.2 + boat.id) * 0.04, boat.z);
        node.rotation.y = boat.rotY + Math.sin(t * 0.8 + boat.id) * 0.14;
        node.rotation.z = Math.sin(t * 2.6 + boat.id) * 0.08;
      });
    }

    // 3. Partikel hati hangat melayang di atas kucing "Sore" saat diberi makan
    if (playerRuntime.catHeartTimer > 0) {
      playerRuntime.catHeartTimer = Math.max(0, playerRuntime.catHeartTimer - dt);
    }
    if (heartsGroupRef.current) {
      const active = playerRuntime.catHeartTimer > 0;
      heartsGroupRef.current.visible = active;
      if (active) {
        heartsGroupRef.current.children.forEach((child, i) => {
          const p = ((t * 1.1 + i * 0.33) % 1);
          child.position.set(
            Math.sin(t * 3 + i * 2) * 0.22,
            0.55 + p * 0.95,
            Math.cos(t * 2.5 + i) * 0.18,
          );
          const s = (1 - p) * 0.9 + 0.2;
          child.scale.set(s, s, s);
        });
      }
    }

    // 4. Uap kopi hangat di meja teras Kedai Kopi Bima
    if (steamGroupRef.current) {
      steamGroupRef.current.children.forEach((child, i) => {
        const p = (t * 0.55 + i * 0.34) % 1;
        child.position.set(Math.sin(t * 2 + i) * 0.04, 0.96 + p * 0.38, Math.cos(t * 2 + i) * 0.03);
        const s = 0.6 + p * 0.7;
        child.scale.set(s, s, s);
      });
    }
  });

  return (
    <group>
      {/* === 1. MOTOR SKUTER DAMAR (MATIC MODERN INDONESIA) === */}
      <group ref={rootRef} position={[-15.2, 0.04, 57.5]} rotation={[0, -0.45, 0]}>
        <group ref={bodyLeanRef}>
          {/* Bayangan kolong skuter */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 1.9]} />
            <meshBasicMaterial color="#090b10" transparent opacity={0.42} depthWrite={false} />
          </mesh>

          {/* Roda Belakang */}
          <group ref={rearWheelRef} position={[0, 0.28, -0.58]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.16, 14]} />
              <meshStandardMaterial color="#1d2026" roughness={0.88} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.14, 0.14, 0.18, 10]} />
              <meshStandardMaterial color="#adb5c0" metalness={0.75} roughness={0.28} />
            </mesh>
          </group>

          {/* Roda Depan */}
          <group ref={frontWheelRef} position={[0, 0.28, 0.62]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.15, 14]} />
              <meshStandardMaterial color="#1d2026" roughness={0.88} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.14, 0.14, 0.17, 10]} />
              <meshStandardMaterial color="#adb5c0" metalness={0.75} roughness={0.28} />
            </mesh>
          </group>

          {/* Dek Kaki (Floorboard) */}
          <mesh position={[0, 0.36, 0.05]} castShadow>
            <boxGeometry args={[0.48, 0.12, 0.95]} />
            <meshStandardMaterial color="#272c33" roughness={0.75} />
          </mesh>

          {/* Bodi Belakang Metalik Navy */}
          <mesh position={[0, 0.64, -0.32]} castShadow>
            <boxGeometry args={[0.5, 0.42, 0.96]} />
            <meshStandardMaterial color="#344e69" metalness={0.45} roughness={0.28} />
          </mesh>

          {/* Jok Kulit Cokelat Hangat */}
          <mesh position={[0, 0.89, -0.3]} castShadow>
            <boxGeometry args={[0.42, 0.14, 0.82]} />
            <meshStandardMaterial color="#5c4230" roughness={0.82} />
          </mesh>

          {/* Lampu Belakang / Rem */}
          <mesh position={[0, 0.72, -0.82]}>
            <boxGeometry args={[0.26, 0.12, 0.05]} />
            <meshStandardMaterial
              ref={brakeMatRef}
              color="#ff4136"
              emissive="#ff2a1f"
              emissiveIntensity={isLit ? 2.0 : 0.35}
            />
          </mesh>
          {/* Plat Nomor Kecil */}
          <mesh position={[0, 0.54, -0.82]}>
            <boxGeometry args={[0.24, 0.11, 0.03]} />
            <meshStandardMaterial color="#181a1f" />
          </mesh>

          {/* Batok Depan & Setang Kemudi */}
          <group ref={handleRef} position={[0, 0.92, 0.48]}>
            {/* Tameng Depan */}
            <mesh position={[0, -0.22, 0.08]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.46, 0.62, 0.24]} />
              <meshStandardMaterial color="#344e69" metalness={0.45} roughness={0.28} />
            </mesh>
            {/* Kepala Setang */}
            <mesh position={[0, 0.18, -0.02]} castShadow>
              <boxGeometry args={[0.42, 0.18, 0.24]} />
              <meshStandardMaterial color="#2c4157" metalness={0.45} roughness={0.3} />
            </mesh>
            {/* Stang Kiri & Kanan */}
            <mesh position={[0, 0.18, -0.04]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.76, 8]} />
              <meshStandardMaterial color="#23262c" roughness={0.7} />
            </mesh>
            {/* Spion Kiri & Kanan */}
            <mesh position={[-0.28, 0.32, -0.04]}>
              <boxGeometry args={[0.14, 0.08, 0.04]} />
              <meshStandardMaterial color="#1d2026" />
            </mesh>
            <mesh position={[0.28, 0.32, -0.04]}>
              <boxGeometry args={[0.14, 0.08, 0.04]} />
              <meshStandardMaterial color="#1d2026" />
            </mesh>
            {/* Lampu Depan LED + Halo */}
            <mesh position={[0, 0.16, 0.11]}>
              <boxGeometry args={[0.24, 0.13, 0.05]} />
              <meshStandardMaterial
                color="#fff9e3"
                emissive="#ffebb3"
                emissiveIntensity={isLit || playerRuntime.scooter.isRiding ? 3.4 : 0.4}
              />
            </mesh>
            {(isLit || playerRuntime.scooter.isRiding) && settings.cinematicGlow && (
              <sprite position={[0, 0.16, 0.24]} scale={[1.5, 1.5, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffeaad"
                  transparent
                  opacity={0.75}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        </group>
      </group>

      {/* === 2. MEJA & CANGKIR KOPI MENGEPUL DI KEDAI KOPI BIMA === */}
      <group position={[-25.0, 0.08, 17.5]}>
        <mesh position={[0, 0.76, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.08, 16]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.07, 0.16, 0.76, 10]} />
          <meshStandardMaterial color="#2c2927" metalness={0.5} />
        </mesh>
        {/* Kursi Kayu Kafe */}
        <mesh position={[0, 0.44, 0.95]} castShadow>
          <boxGeometry args={[0.52, 0.08, 0.48]} />
          <meshStandardMaterial color="#6e4b32" />
        </mesh>
        {/* Cangkir Keramik Kopi Hangat */}
        <mesh position={[0.12, 0.87, 0.08]} castShadow>
          <cylinderGeometry args={[0.075, 0.06, 0.13, 12]} />
          <meshStandardMaterial color="#f5ede0" roughness={0.25} />
        </mesh>
        <group ref={steamGroupRef}>
          {[0, 1, 2].map((i) => (
            <mesh key={`st-${i}`} position={[0.12, 1.0, 0.08]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.24} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>

      {/* === 3. MANGKUK MAKANAN & PARTIKEL HATI KUCING "SORE" === */}
      {catFed && (
        <group position={[10.15, 0.04, 56.75]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.08, 12]} />
            <meshStandardMaterial color="#c95b49" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.03, 10]} />
            <meshStandardMaterial color="#704a2e" roughness={0.9} />
          </mesh>
        </group>
      )}
      <group ref={heartsGroupRef} position={[9.5, 0.2, 56.5]} visible={false}>
        {[0, 1, 2].map((i) => (
          <mesh key={`ht-${i}`}>
            <octahedronGeometry args={[0.09, 0]} />
            <meshStandardMaterial color="#ff8aa1" emissive="#ff5e7e" emissiveIntensity={2.2} />
          </mesh>
        ))}
      </group>

      {/* === 4. PERAHU KERTAS ORIGAMI MENGAPUNG DI DANAU SENJA === */}
      <group ref={boatsGroupRef}>
        {Array.from({ length: paperBoatsCount }).map((_, idx) => (
          <group key={`pboat-${idx}`} position={[-77.5, -0.04, -28]}>
            {/* Lambung Perahu Kertas */}
            <mesh castShadow>
              <boxGeometry args={[0.42, 0.1, 0.22]} />
              <meshStandardMaterial color="#faf6ee" roughness={0.85} />
            </mesh>
            {/* Layar Segitiga Origami */}
            <mesh position={[0, 0.16, 0]} castShadow>
              <coneGeometry args={[0.14, 0.24, 3]} />
              <meshStandardMaterial color="#fffcf5" emissive="#ffe9b8" emissiveIntensity={0.2} roughness={0.85} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
