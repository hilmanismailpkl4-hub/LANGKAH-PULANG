import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface FloatingWaterLanternsProps {
  settings: GameSettings;
}

/**
 * Lentera Air Teratai Harapan (Floating Lotus Water Lanterns) yang dihanyutkan Damar & Keluarga
 * di Sungai Kota maupun Danau Senja — lengkap dengan kelopak teratai warna hangat, inti lilin
 * berkedip lembut, dan pantulan cahaya keemasan di permukaan air.
 */
export const FloatingWaterLanterns: React.FC<FloatingWaterLanternsProps> = ({ settings }) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const flameRefs = useRef<(THREE.Mesh | null)[]>([]);
  const MAX_LANTERNS = 8;

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const list = playerRuntime.waterLanterns;

    for (let i = 0; i < MAX_LANTERNS; i++) {
      const grp = groupRefs.current[i];
      if (!grp) continue;
      const item = list[i];
      if (!item) {
        grp.visible = false;
        continue;
      }

      grp.visible = true;
      item.x += item.vx * dt + Math.sin(t * 0.7 + i) * 0.05 * dt;
      item.z += item.vz * dt + Math.cos(t * 0.65 + i) * 0.06 * dt;
      item.rotY += 0.24 * dt;

      // Jaga agar lentera tetap berada di dalam batas perairan Sungai atau Danau Senja
      if (item.zone === 'river') {
        item.x = THREE.MathUtils.clamp(item.x, -54.2, -41.6);
        if (item.z > 42) item.vz = -Math.abs(item.vz);
        if (item.z < -38) item.vz = Math.abs(item.vz);
      } else {
        item.x = THREE.MathUtils.clamp(item.x, -96.5, -77.8);
        item.z = THREE.MathUtils.clamp(item.z, -41.5, -14.5);
      }

      const bobY = item.baseY + Math.sin(t * 2.1 + i * 1.3) * 0.025;
      grp.position.set(item.x, bobY, item.z);
      grp.rotation.set(
        Math.sin(t * 1.6 + i) * 0.06,
        item.rotY,
        Math.cos(t * 1.4 + i) * 0.06,
      );

      const fl = flameRefs.current[i];
      if (fl) {
        const flicker = 0.88 + Math.sin(t * 11.5 + i * 2.1) * 0.16;
        fl.scale.set(1, flicker, 1);
      }
    }
  });

  const petalAngles = [0, 1, 2, 3, 4, 5].map((k) => (k / 6) * Math.PI * 2);

  return (
    <group userData={{ noCull: true }}>
      {Array.from({ length: MAX_LANTERNS }).map((_, idx) => {
        const petalColor = ['#fda4af', '#fde047', '#fdba74', '#f9a8d4'][idx % 4];
        return (
          <group
            key={`wlan-${idx}`}
            ref={(el) => {
              groupRefs.current[idx] = el;
            }}
            visible={false}
          >
            {/* Alas Daun Teratai Hijau Mengapung */}
            <mesh position={[0, 0.015, 0]}>
              <cylinderGeometry args={[0.24, 0.2, 0.025, 12]} />
              <meshStandardMaterial color="#2f6f44" roughness={0.78} />
            </mesh>
            {/* 6 Kelopak Bunga Teratai Kertas Bercahaya Lembut */}
            {petalAngles.map((ang, pi) => (
              <group key={`pt-${pi}`} rotation={[0, ang, 0]}>
                <mesh position={[0.13, 0.075, 0]} rotation={[0, 0, -0.45]}>
                  <coneGeometry args={[0.075, 0.16, 4]} />
                  <meshStandardMaterial
                    color={petalColor}
                    emissive={petalColor}
                    emissiveIntensity={0.65}
                    roughness={0.55}
                  />
                </mesh>
              </group>
            ))}
            {/* Inti Lilin Hangat Berkedip */}
            <mesh
              ref={(el) => {
                flameRefs.current[idx] = el;
              }}
              position={[0, 0.11, 0]}
            >
              <coneGeometry args={[0.04, 0.11, 8]} />
              <meshBasicMaterial color="#fffbeb" />
            </mesh>
            {settings.cinematicGlow && (
              <sprite position={[0, 0.14, 0]} scale={[1.35, 1.35, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffc266"
                  transparent
                  opacity={0.76}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        );
      })}
    </group>
  );
};
