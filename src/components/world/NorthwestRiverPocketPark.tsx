import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface NorthwestRiverPocketParkProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createBackMuralTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 320;
  const ctx = c.getContext('2d')!;

  // Gradien senja mural jalanan artistik
  const grad = ctx.createLinearGradient(0, 0, 768, 320);
  grad.addColorStop(0, '#1e293b');
  grad.addColorStop(0.5, '#7c2d12');
  grad.addColorStop(1, '#312e81');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 768, 320);

  // Bingkai ornamen emas tipis
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 748, 300);

  // Matahari senja & siluet gelombang sungai
  ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
  ctx.beginPath();
  ctx.arc(610, 120, 68, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  for (let w = 0; w < 3; w++) {
    ctx.beginPath();
    ctx.moveTo(24, 248 + w * 18);
    ctx.bezierCurveTo(220, 228 + w * 18, 520, 268 + w * 18, 744, 244 + w * 18);
    ctx.stroke();
  }

  // Siluet gitar akustik & burung terbang
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(128, 165, 42, 0, Math.PI * 2);
  ctx.arc(168, 148, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(146, 156, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d97706';
  ctx.fillRect(190, 118, 86, 10);

  // Kutipan puitis mural
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('"Setiap lagu yang jujur selalu tahu jalan pulangnya."', 428, 142);

  ctx.fillStyle = '#fed7aa';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('MURAL KOMUNITAS MUSISI KOTA SENJA · BELAKANG TOKO NADA LAMA', 428, 192);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Upgrade Lingkungan Barat Laut & Seni Publik:
 * 1. Mural Dinding Bata "Senandung Kota Senja" di dinding belakang Toko Musik Nada Lama + 3 lampu sorot galeri
 * 2. Taman Saku Tepi Sungai Utara ([-36.5, 0, -39.5]): Pergola Teduh, Bangku Menghadap Sungai & Lampu Taman
 * 3. Instrumen Taman Publik 7 Bilah Perunggu "Saron Senja" ([-32.5, 0, -37.2]) yang bergetar saat dimainkan
 */
export const NorthwestRiverPocketPark: React.FC<NorthwestRiverPocketParkProps> = ({
  timeOfDay,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const muralTex = useMemo(() => createBackMuralTexture(), []);
  const isEveningOrNight = timeOfDay !== 'morning';
  const saronBarsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    if (playerRuntime.saronRippleTimer > 0) {
      playerRuntime.saronRippleTimer = Math.max(0, playerRuntime.saronRippleTimer - dt);
    }
    if (saronBarsRef.current && !shouldSkipPerfFrame(-32.5, -37.2, 48)) {
      const active = playerRuntime.saronRippleTimer > 0;
      saronBarsRef.current.children.forEach((bar, idx) => {
        bar.position.y = active
          ? 0.78 + Math.abs(Math.sin(t * 14 - idx * 0.7)) * 0.028
          : 0.78;
      });
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. MURAL DINDING BELAKANG TOKO MUSIK NADA LAMA ([-22, 2.38, -31.54]) */}
      {/* ==================================================================== */}
      <group position={[-22.0, 2.38, -31.54]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <planeGeometry args={[8.6, 3.4]} />
          <meshStandardMaterial
            map={muralTex}
            emissiveMap={muralTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
            roughness={0.82}
          />
        </mesh>
        {/* 3 Lampu Sorot Dinding Mural */}
        {[-2.8, 0, 2.8].map((lx, li) => (
          <group key={`mspot-${li}`} position={[lx, 1.9, 0.18]}>
            <mesh>
              <boxGeometry args={[0.24, 0.1, 0.28]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.06, 0.06]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#f59e0b"
                emissiveIntensity={isEveningOrNight ? 2.8 : 0.3}
              />
            </mesh>
          </group>
        ))}
        {isEveningOrNight && (
          <pointLight position={[0, 0.8, 1.4]} color="#ffc875" intensity={11} distance={12} decay={1.7} />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 2. TAMAN SAKU TEPI SUNGAI UTARA & PERGOLA TEDUH ([-36.5, 0, -39.5])  */}
      {/* ==================================================================== */}
      <group position={[-36.5, 0, -39.5]}>
        {/* Alas Paving Bundar Taman Saku */}
        <mesh position={[0.4, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[2.6, 2.7, 0.04, 20]} />
          <meshStandardMaterial map={textures.paving} roughness={0.86} />
        </mesh>

        {/* 4 Tiang Pergola Kayu-Besi */}
        {[
          [-1.05, -1.45],
          [1.05, -1.45],
          [-1.05, 1.45],
          [1.05, 1.45],
        ].map(([px, pz], pi) => (
          <mesh key={`nwp-${pi}`} position={[px, 1.35, pz]} castShadow>
            <boxGeometry args={[0.12, 2.7, 0.12]} />
            <meshStandardMaterial color="#3e2723" roughness={0.75} />
          </mesh>
        ))}
        {/* Atap Teduh Pergola + Sulur Bunga */}
        <mesh position={[0, 2.74, 0]} castShadow>
          <boxGeometry args={[2.5, 0.1, 3.3]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        {[-0.85, 0, 0.85].map((vz, vi) => (
          <mesh key={`nwv-${vi}`} position={[-0.2, 2.84, vz]} castShadow>
            <dodecahedronGeometry args={[0.42, 1]} />
            <meshStandardMaterial color={vi === 1 ? '#f472b6' : '#3f7d47'} roughness={0.84} />
          </mesh>
        ))}

        {/* Bangku Kayu Menghadap Barat (Aliran Sungai Utara) */}
        <group rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.0, 0.1, 0.62]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.76} />
          </mesh>
          <mesh position={[0, 0.76, -0.26]} rotation={[-0.14, 0, 0]} castShadow>
            <boxGeometry args={[2.0, 0.38, 0.08]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.76} />
          </mesh>
          {[-0.8, 0.8].map((lx, li) => (
            <mesh key={`nwbl-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.1, 0.42, 0.56]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Lampu Gantung Hangat Pergola */}
        <mesh position={[0, 2.48, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#f59e0b"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.3}
          />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 3. INSTRUMEN TAMAN PUBLIK "SARON PERUNGGU SENJA" ([-32.5, 0, -37.2]) */}
      {/* ==================================================================== */}
      <group position={[-32.5, 0, -37.2]}>
        {/* Rangka Kayu Ukir Resonator Saron Taman */}
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.18, 0.68, 0.54]} />
          <meshStandardMaterial color="#6e3b1e" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.73, 0]}>
          <boxGeometry args={[1.26, 0.06, 0.6]} />
          <meshStandardMaterial color="#92400e" roughness={0.65} />
        </mesh>
        {/* 7 Bilah Perunggu Mengilap Nada Pentatonis */}
        <group ref={saronBarsRef}>
          {[-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((bx, bi) => (
            <mesh key={`sbar-${bi}`} position={[bx, 0.78, 0]} castShadow>
              <boxGeometry args={[0.11, 0.03, 0.44 - bi * 0.022]} />
              <meshStandardMaterial color="#eab308" metalness={0.82} roughness={0.22} />
            </mesh>
          ))}
        </group>
        {/* Pemukul Kayu Tabuh Saron */}
        <mesh position={[0.42, 0.82, 0.22]} rotation={[0, 0.5, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.24, 6]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
