import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface BicycleEntityProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

/**
 * Sepeda Kota Klasik 3D (gaya city bike hijau-sage dengan keranjang rotan,
 * roda berjari-jari berputar, engkol & pedal berputar sinkron, bel kuningan & lampu depan retro).
 */
export const BicycleEntity: React.FC<BicycleEntityProps> = ({ timeOfDay, settings }) => {
  const isLit = timeOfDay !== 'morning';
  const textures = useMemo(() => getProceduralTextures(), []);

  const rootRef = useRef<THREE.Group>(null);
  const leanRef = useRef<THREE.Group>(null);
  const forkSteerRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);
  const crankRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const bk = playerRuntime.bicycle;

    if (rootRef.current) {
      rootRef.current.position.set(bk.pos[0], bk.pos[1], bk.pos[2]);
      rootRef.current.rotation.y = bk.yaw;
    }
    if (leanRef.current) {
      // Saat terparkir sedikit miring santai di standar samping; saat dikayuh miring mengikuti belokan
      const targetRoll = bk.isRiding ? bk.roll : 0.11;
      leanRef.current.rotation.z = THREE.MathUtils.lerp(leanRef.current.rotation.z, targetRoll, dt * 8);
    }
    if (forkSteerRef.current) {
      forkSteerRef.current.rotation.y = THREE.MathUtils.lerp(
        forkSteerRef.current.rotation.y,
        bk.steer * 0.48,
        dt * 10,
      );
    }
    if (frontWheelRef.current) frontWheelRef.current.rotation.x = bk.wheelAngle;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x = bk.wheelAngle;
    if (crankRef.current) crankRef.current.rotation.x = bk.pedalAngle;
  });

  const renderSpokedWheel = (ref: React.RefObject<THREE.Group>, pos: [number, number, number]) => (
    <group ref={ref} position={pos}>
      {/* Ban Luar Hitam Ramping */}
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.34, 0.042, 10, 22]} />
        <meshStandardMaterial color="#1d2026" roughness={0.85} />
      </mesh>
      {/* Velg Perak Mengkilap */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.3, 0.016, 8, 20]} />
        <meshStandardMaterial color="#cfd6e0" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* 4 Pasang Jari-Jari Silang (kelihatan jelas berputar!) */}
      {[0, 1, 2, 3].map((s) => (
        <mesh key={`sp-${s}`} rotation={[(s * Math.PI) / 4, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.6, 6]} />
          <meshStandardMaterial color="#b8c2cf" metalness={0.75} roughness={0.3} />
        </mesh>
      ))}
      {/* Poros Roda */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.036, 0.036, 0.12, 10]} />
        <meshStandardMaterial color="#8f98a6" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );

  return (
    <group ref={rootRef} position={[-68.8, 0.02, -8.5]} rotation={[0, 0.7, 0]}>
      <group ref={leanRef}>
        {/* Bayangan kontak lembut di tanah */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.55, 1.85]} />
          <meshBasicMaterial color="#090b10" transparent opacity={0.36} depthWrite={false} />
        </mesh>

        {/* Roda Belakang */}
        {renderSpokedWheel(rearWheelRef, [0, 0.36, -0.58])}

        {/* === RANGKA TUBULAR SEPEDAH HIJAU-SAGE VINTAGE === */}
        {/* Seat Tube (Tabung Sadel) */}
        <mesh position={[0, 0.65, -0.18]} rotation={[-0.22, 0, 0]} castShadow>
          <cylinderGeometry args={[0.024, 0.026, 0.62, 10]} />
          <meshStandardMaterial color="#458574" metalness={0.42} roughness={0.32} />
        </mesh>
        {/* Down Tube (Tabung Bawah ke Depan) */}
        <mesh position={[0, 0.54, 0.16]} rotation={[0.88, 0, 0]} castShadow>
          <cylinderGeometry args={[0.024, 0.024, 0.72, 10]} />
          <meshStandardMaterial color="#458574" metalness={0.42} roughness={0.32} />
        </mesh>
        {/* Top Tube Klasik */}
        <mesh position={[0, 0.72, 0.14]} rotation={[1.38, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.66, 10]} />
          <meshStandardMaterial color="#458574" metalness={0.42} roughness={0.32} />
        </mesh>
        {/* Chainstay & Seatstay Belakang */}
        {[-0.06, 0.06].map((sx, i) => (
          <React.Fragment key={`rs-${i}`}>
            <mesh position={[sx, 0.36, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.48, 8]} />
              <meshStandardMaterial color="#458574" metalness={0.4} roughness={0.35} />
            </mesh>
            <mesh position={[sx, 0.58, -0.4]} rotation={[-0.68, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.62, 8]} />
              <meshStandardMaterial color="#458574" metalness={0.4} roughness={0.35} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Rak Boncengan Belakang Krom & Reflektor Merah */}
        <mesh position={[0, 0.76, -0.58]} castShadow>
          <boxGeometry args={[0.22, 0.035, 0.46]} />
          <meshStandardMaterial color="#c4ccd6" metalness={0.75} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.74, -0.82]}>
          <boxGeometry args={[0.1, 0.07, 0.04]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={isLit ? 2.2 : 0.4} />
        </mesh>

        {/* Sadel Kulit Cokelat Klasik */}
        <mesh position={[0, 0.96, -0.26]} castShadow>
          <boxGeometry args={[0.24, 0.09, 0.34]} />
          <meshStandardMaterial color="#6e4429" roughness={0.78} />
        </mesh>

        {/* === ENGKOL & 2 PEDAL BERPUTAR SINKRON === */}
        <group ref={crankRef} position={[0, 0.36, -0.1]}>
          {/* Gir Rantai */}
          <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 14]} />
            <meshStandardMaterial color="#b8c2cf" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Lengan Engkol & Pedal Kanan */}
          <mesh position={[0.09, 0.09, 0]}>
            <boxGeometry args={[0.025, 0.18, 0.03]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0.15, 0.17, 0]}>
            <boxGeometry args={[0.11, 0.03, 0.08]} />
            <meshStandardMaterial color="#1f2329" roughness={0.8} />
          </mesh>
          {/* Lengan Engkol & Pedal Kiri (Berlawanan 180 derajat) */}
          <mesh position={[-0.09, -0.09, 0]}>
            <boxGeometry args={[0.025, 0.18, 0.03]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[-0.15, -0.17, 0]}>
            <boxGeometry args={[0.11, 0.03, 0.08]} />
            <meshStandardMaterial color="#1f2329" roughness={0.8} />
          </mesh>
        </group>

        {/* === GARPU DEPAN, SETANG, KERANJANG ROTAN, BEL KUNINGAN & LAMPU RETRO === */}
        <group ref={forkSteerRef} position={[0, 0.72, 0.46]}>
          {/* Roda Depan */}
          {renderSpokedWheel(frontWheelRef, [0, -0.36, 0.12])}
          {/* Garpu Depan Kiri & Kanan */}
          {[-0.06, 0.06].map((fx, i) => (
            <mesh key={`fk-${i}`} position={[fx, -0.16, 0.05]} rotation={[-0.25, 0, 0]} castShadow>
              <cylinderGeometry args={[0.018, 0.016, 0.48, 8]} />
              <meshStandardMaterial color="#458574" metalness={0.42} roughness={0.32} />
            </mesh>
          ))}
          {/* Tiang Leher Setang Krom */}
          <mesh position={[0, 0.22, -0.03]} rotation={[-0.18, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.022, 0.42, 10]} />
            <meshStandardMaterial color="#d4dbe3" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Setang Lengkung Klasik + Pegangan Kulit */}
          <mesh position={[0, 0.41, -0.08]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.68, 10]} />
            <meshStandardMaterial color="#d4dbe3" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[-0.31, 0.41, -0.08]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.026, 0.14, 8]} />
            <meshStandardMaterial color="#6e4429" roughness={0.8} />
          </mesh>
          <mesh position={[0.31, 0.41, -0.08]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.026, 0.14, 8]} />
            <meshStandardMaterial color="#6e4429" roughness={0.8} />
          </mesh>
          {/* Bel Sepeda Kuningan Mungil */}
          <mesh position={[0.17, 0.45, -0.07]}>
            <sphereGeometry args={[0.036, 10, 10]} />
            <meshStandardMaterial color="#eab949" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Keranjang Rotan Depan + Bunga Kuning Kecil */}
          <group position={[0, 0.22, 0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.36, 0.24, 0.26]} />
              <meshStandardMaterial color="#b5834a" roughness={0.88} />
            </mesh>
            <mesh position={[0, 0.125, 0]}>
              <boxGeometry args={[0.38, 0.03, 0.28]} />
              <meshStandardMaterial color="#8f6132" roughness={0.85} />
            </mesh>
            {/* Setangkai Bunga Kuning & Daun di Dalam Keranjang */}
            <mesh position={[0.06, 0.16, 0.02]}>
              <dodecahedronGeometry args={[0.065, 0]} />
              <meshStandardMaterial color="#4b854e" roughness={0.85} />
            </mesh>
            <mesh position={[0.08, 0.21, 0.04]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#f6c644" roughness={0.6} />
            </mesh>
          </group>

          {/* Lampu Depan Bundar Retro + Halo */}
          <mesh position={[0, 0.06, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.045, 0.09, 12]} />
            <meshStandardMaterial color="#cfd6e0" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.06, 0.21]}>
            <circleGeometry args={[0.05, 12]} />
            <meshStandardMaterial
              color="#fff8d6"
              emissive="#ffe294"
              emissiveIntensity={isLit || playerRuntime.bicycle.isRiding ? 3.2 : 0.35}
            />
          </mesh>
          {(isLit || playerRuntime.bicycle.isRiding) && settings.cinematicGlow && (
            <sprite position={[0, 0.06, 0.32]} scale={[1.25, 1.25, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffeaad"
                transparent
                opacity={0.68}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      </group>
    </group>
  );
};
