import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shouldSkipPerfFrame } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';

interface HomeWarmthAndButterfliesProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

interface ButterflySeed {
  homeX: number;
  homeY: number;
  homeZ: number;
  ampX: number;
  ampY: number;
  ampZ: number;
  speed: number;
  flapSpeed: number;
  phase: number;
  wingColor: string;
  accentColor: string;
}

const BUTTERFLY_SEEDS: ButterflySeed[] = [
  // 5 kupu-kupu lembut mengitari pot bunga melati & mawar Nadia di halaman Rumah Jl. Melati No. 14
  { homeX: -24.8, homeY: 1.35, homeZ: 60.2, ampX: 1.4, ampY: 0.35, ampZ: 1.1, speed: 0.72, flapSpeed: 14.5, phase: 0.2, wingColor: '#fde047', accentColor: '#92400e' },
  { homeX: -23.8, homeY: 1.15, homeZ: 59.5, ampX: 1.1, ampY: 0.28, ampZ: 0.9, speed: 0.85, flapSpeed: 15.8, phase: 1.7, wingColor: '#fb923c', accentColor: '#431407' },
  { homeX: -25.4, homeY: 1.5, homeZ: 60.6, ampX: 1.2, ampY: 0.32, ampZ: 1.0, speed: 0.66, flapSpeed: 13.8, phase: 3.1, wingColor: '#fef9c3', accentColor: '#854d0e' },
  { homeX: -22.3, homeY: 1.25, homeZ: 61.0, ampX: 1.0, ampY: 0.26, ampZ: 0.8, speed: 0.78, flapSpeed: 15.0, phase: 4.4, wingColor: '#f9a8d4', accentColor: '#831843' },
  { homeX: -17.6, homeY: 1.2, homeZ: 60.9, ampX: 1.1, ampY: 0.28, ampZ: 0.85, speed: 0.7, flapSpeed: 14.2, phase: 5.2, wingColor: '#7dd3fc', accentColor: '#1e3a8a' },

  // 9 kupu-kupu tropis di semak bunga Danau Senja & Taman Kota
  { homeX: -67.2, homeY: 1.3, homeZ: -24.2, ampX: 1.8, ampY: 0.42, ampZ: 1.5, speed: 0.68, flapSpeed: 14.0, phase: 0.9, wingColor: '#fb923c', accentColor: '#451a03' },
  { homeX: -67.4, homeY: 1.5, homeZ: -30.5, ampX: 1.7, ampY: 0.38, ampZ: 1.4, speed: 0.76, flapSpeed: 15.2, phase: 2.3, wingColor: '#fde047', accentColor: '#713f12' },
  { homeX: -69.0, homeY: 1.2, homeZ: -27.2, ampX: 1.5, ampY: 0.35, ampZ: 1.6, speed: 0.64, flapSpeed: 13.6, phase: 3.8, wingColor: '#7dd3fc', accentColor: '#1d4ed8' },
  { homeX: -82.8, homeY: 1.35, homeZ: -11.4, ampX: 1.6, ampY: 0.35, ampZ: 1.2, speed: 0.8, flapSpeed: 15.4, phase: 1.1, wingColor: '#f9a8d4', accentColor: '#9d174d' },
  { homeX: -76.5, homeY: 1.4, homeZ: -10.2, ampX: 1.5, ampY: 0.32, ampZ: 1.3, speed: 0.71, flapSpeed: 14.6, phase: 4.9, wingColor: '#fef08a', accentColor: '#78350f' },
  { homeX: -72.0, homeY: 1.25, homeZ: 29.6, ampX: 1.9, ampY: 0.36, ampZ: 1.5, speed: 0.69, flapSpeed: 14.1, phase: 2.7, wingColor: '#fdba74', accentColor: '#7c2d12' },
  { homeX: -70.6, homeY: 1.45, homeZ: 28.4, ampX: 1.4, ampY: 0.3, ampZ: 1.3, speed: 0.82, flapSpeed: 16.0, phase: 5.6, wingColor: '#bae6fd', accentColor: '#0369a1' },
  { homeX: -65.8, homeY: 1.15, homeZ: -11.5, ampX: 1.3, ampY: 0.32, ampZ: 1.1, speed: 0.75, flapSpeed: 14.8, phase: 0.5, wingColor: '#fef9c3', accentColor: '#854d0e' },
  { homeX: -83.5, homeY: 1.35, homeZ: 33.4, ampX: 1.8, ampY: 0.38, ampZ: 1.4, speed: 0.67, flapSpeed: 13.9, phase: 3.3, wingColor: '#fde047', accentColor: '#92400e' },
];

function createLaptopScreenTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 160;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0f1d30';
  ctx.fillRect(0, 0, 256, 160);
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(10, 10, 236, 26);
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('LAPORAN Q4 · MENARA NUSANTARA', 18, 28);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(10, 44, 150, 104);
  ctx.fillRect(168, 44, 78, 104);
  // Grafik batang mini & daftar email
  ['#38bdf8', '#fbbf24', '#34d399', '#f87171'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(24 + i * 30, 128 - (28 + i * 16), 18, 28 + i * 16);
  });
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px sans-serif';
  ctx.fillText('Inbox (14)', 176, 64);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('• Revisi...', 176, 86);
  ctx.fillText('• Rapat...', 176, 104);
  ctx.fillText('• Tenggat', 176, 122);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Detail Hangat Dalam Rumah & Taman:
 * 1. Mainan Kereta Api Kayu Mungil Kira di karpet Rumah Jl. Melati ([-19.9, 0.095, 70.35]) yang melaju memutar [E]
 * 2. Laptop Kantor & Lampu Belajar Meja Kerja Damar ([-24.45, 0.86, 72.05]) yang bisa ditutup [E] saat pulang
 * 3. 14 Kupu-Kupu Tropis Warna-Warni terbang lembut di atas pot bunga rumah & taman bunga Danau Senja (pagi & sore cerah)
 */
export const HomeWarmthAndButterflies: React.FC<HomeWarmthAndButterfliesProps> = ({
  timeOfDay,
  settings,
}) => {
  const kiraToyTrainOn = useGameStore((s) => s.kiraToyTrainOn);
  const workLaptopClosed = useGameStore((s) => s.workLaptopClosed);

  const laptopTex = useMemo(() => createLaptopScreenTexture(), []);
  const trainAngleRef = useRef(0.4);
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const laptopLidRef = useRef<THREE.Group>(null);
  const deskLampGlowRef = useRef<THREE.PointLight>(null);

  const butterflyRefs = useRef<(THREE.Group | null)[]>([]);
  const wingLRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wingRRefs = useRef<(THREE.Mesh | null)[]>([]);

  const showButterflies = timeOfDay === 'morning' || timeOfDay === 'sunset';
  const butterflyCount =
    settings.particleDensity === 'low' ? 7 : settings.particleDensity === 'medium' ? 10 : BUTTERFLY_SEEDS.length;

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // 1. Animasi Kereta Mainan Kayu Kira (Lokomotif + 2 Gerbong di rel bundar radius 0.56m)
    if (kiraToyTrainOn) {
      trainAngleRef.current += dt * 1.65;
    }
    const radius = 0.56;
    const offsets = [0, -0.34, -0.66];
    for (let i = 0; i < 3; i++) {
      const car = carRefs.current[i];
      if (!car) continue;
      const a = trainAngleRef.current + offsets[i];
      const cx = Math.cos(a) * radius;
      const cz = Math.sin(a) * radius;
      const chugBob = kiraToyTrainOn ? Math.abs(Math.sin(t * 11 + i)) * 0.008 : 0;
      car.position.set(cx, 0.055 + chugBob, cz);
      // Tangensial mengikuti arah laju bundar
      car.rotation.y = -a;
    }

    // 2. Animasi Tutup / Buka Layar Laptop Kantor Damar & Lampu Meja Kerja
    if (laptopLidRef.current) {
      const targetRot = workLaptopClosed ? 0 : -1.82;
      laptopLidRef.current.rotation.x = THREE.MathUtils.lerp(laptopLidRef.current.rotation.x, targetRot, dt * 6.5);
    }
    if (deskLampGlowRef.current) {
      const desiredInt = workLaptopClosed ? 0 : 4.2;
      deskLampGlowRef.current.intensity = THREE.MathUtils.lerp(deskLampGlowRef.current.intensity, desiredInt, dt * 5.5);
    }

    // 3. Animasi Kupu-Kupu Warna-Warni Mengepakkan Sayap di Lintasan Angka-8
    if (showButterflies) {
      for (let i = 0; i < butterflyCount; i++) {
        const seed = BUTTERFLY_SEEDS[i];
        const grp = butterflyRefs.current[i];
        if (!grp) continue;
        if (shouldSkipPerfFrame(seed.homeX, seed.homeZ, 36)) continue;

        const u = t * seed.speed + seed.phase;
        const x = seed.homeX + Math.sin(u) * seed.ampX;
        const z = seed.homeZ + Math.sin(u * 2) * seed.ampZ * 0.55;
        const y = seed.homeY + Math.sin(u * 1.7 + 0.6) * seed.ampY;

        const vx = Math.cos(u) * seed.ampX * seed.speed;
        const vz = Math.cos(u * 2) * 2 * seed.ampZ * 0.55 * seed.speed;

        grp.position.set(x, y, z);
        grp.rotation.y = Math.atan2(vx, vz);

        const flap = Math.sin(t * seed.flapSpeed + seed.phase * 3) * 0.92;
        const wL = wingLRefs.current[i];
        const wR = wingRRefs.current[i];
        if (wL) wL.rotation.z = flap;
        if (wR) wR.rotation.z = -flap;
      }
    }
  });

  const trackTieAngles = useMemo(() => Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2), []);

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. KERETA MAINAN KAYU KIRA DI KARPET RUMAH ([-19.9, 0.095, 70.35])   */}
      {/* ==================================================================== */}
      <group position={[-19.9, 0.095, 70.35]}>
        {/* Rel Kayu Bundar (Cincin Luar & Dalam + 18 Bantalan Kayu) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0.49, 0.63, 32]} />
          <meshStandardMaterial color="#d8b589" roughness={0.8} />
        </mesh>
        {trackTieAngles.map((ang, ti) => (
          <mesh
            key={`tie-${ti}`}
            position={[Math.cos(ang) * 0.56, 0.006, Math.sin(ang) * 0.56]}
            rotation={[0, -ang, 0]}
          >
            <boxGeometry args={[0.14, 0.008, 0.025]} />
            <meshStandardMaterial color="#a67c52" roughness={0.85} />
          </mesh>
        ))}

        {/* Dekorasi Tengah Rel: 2 Pohon Kayu Mainan Mungil & Rumah Kayu Mini */}
        {[
          [-0.18, 0.14],
          [0.2, -0.12],
        ].map(([px, pz], pi) => (
          <group key={`ttree-${pi}`} position={[px, 0, pz]}>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.018, 0.022, 0.1, 6]} />
              <meshStandardMaterial color="#8c5e3c" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.15, 0]} castShadow>
              <coneGeometry args={[0.075, 0.15, 8]} />
              <meshStandardMaterial color={pi === 0 ? '#52b788' : '#74c69d'} roughness={0.78} />
            </mesh>
          </group>
        ))}
        {/* Stasiun Kayu Mainan Mungil di Tepi Rel */}
        <group position={[0, 0, 0.78]}>
          <mesh position={[0, 0.075, 0]} castShadow>
            <boxGeometry args={[0.24, 0.15, 0.14]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.19, 0]} castShadow>
            <coneGeometry args={[0.17, 0.1, 4]} />
            <meshStandardMaterial color="#e05a47" roughness={0.72} />
          </mesh>
        </group>

        {/* Lokomotif Kayu Merah-Biru + 2 Gerbong Warna-Warni Berjalan di Rel! */}
        {[
          { bodyCol: '#dc4c42', roofCol: '#2b598a', isLoco: true },
          { bodyCol: '#eab308', roofCol: '#f59e0b', isLoco: false },
          { bodyCol: '#38bdf8', roofCol: '#0284c7', isLoco: false },
        ].map((car, ci) => (
          <group
            key={`tcar-${ci}`}
            ref={(el) => {
              carRefs.current[ci] = el;
            }}
          >
            {/* Badan Kereta Kayu */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.095, 0.075, 0.165]} />
              <meshStandardMaterial color={car.bodyCol} roughness={0.62} />
            </mesh>
            {car.isLoco ? (
              <>
                {/* Kabin & Cerobong Lokomotif */}
                <mesh position={[0, 0.075, -0.035]} castShadow>
                  <boxGeometry args={[0.09, 0.065, 0.075]} />
                  <meshStandardMaterial color={car.roofCol} roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.085, 0.045]} castShadow>
                  <cylinderGeometry args={[0.02, 0.015, 0.065, 8]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.5} />
                </mesh>
                {/* Lampu Depan Mungil Menyala Saat Kereta Jalan */}
                <mesh position={[0, 0.03, 0.086]}>
                  <sphereGeometry args={[0.016, 8, 8]} />
                  <meshStandardMaterial
                    color={kiraToyTrainOn ? '#fef08a' : '#94a3b8'}
                    emissive={kiraToyTrainOn ? '#f59e0b' : '#000000'}
                    emissiveIntensity={kiraToyTrainOn ? 2.5 : 0}
                  />
                </mesh>
              </>
            ) : (
              <mesh position={[0, 0.072, 0]} castShadow>
                <boxGeometry args={[0.082, 0.04, 0.135]} />
                <meshStandardMaterial color={car.roofCol} roughness={0.65} />
              </mesh>
            )}
            {/* 4 Roda Kayu Kuning */}
            {[
              [-0.052, -0.022, 0.048],
              [0.052, -0.022, 0.048],
              [-0.052, -0.022, -0.048],
              [0.052, -0.022, -0.048],
            ].map(([wx, wy, wz], wi) => (
              <mesh key={`tw-${wi}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.024, 0.024, 0.016, 8]} />
                <meshStandardMaterial color="#facc15" roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 2. LAPTOP KANTOR, KALENDER & LAMPU MEJA KERJA DAMAR ([-24.45, 0.86]) */}
      {/* ==================================================================== */}
      <group position={[-24.45, 0.865, 72.05]}>
        {/* Alas Laptop Perak Tipis */}
        <mesh position={[0, 0.012, 0]} castShadow>
          <boxGeometry args={[0.42, 0.02, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.65} roughness={0.28} />
        </mesh>
        {/* Area Keyboard Gelap */}
        <mesh position={[0, 0.024, 0.02]}>
          <boxGeometry args={[0.36, 0.004, 0.16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>
        {/* Engsel & Layar Laptop (Beranimasi Menutup Rapat Saat Damar Memilih Istirahat!) */}
        <group ref={laptopLidRef} position={[0, 0.022, 0.14]} rotation={[-1.82, 0, 0]}>
          <mesh position={[0, 0.008, -0.14]} castShadow>
            <boxGeometry args={[0.42, 0.015, 0.28]} />
            <meshStandardMaterial color="#b8c4d0" metalness={0.68} roughness={0.26} />
          </mesh>
          <mesh position={[0, 0.0, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.38, 0.24]} />
            <meshStandardMaterial
              map={laptopTex}
              emissiveMap={laptopTex}
              emissive="#ffffff"
              emissiveIntensity={workLaptopClosed ? 0 : 1.15}
              roughness={0.18}
            />
          </mesh>
        </group>

        {/* Kalender Meja Kayu & Mug Kopi di Samping Kanan Laptop */}
        <group position={[0.42, 0, 0.08]} rotation={[0, -0.35, 0]}>
          <mesh position={[0, 0.075, 0]} rotation={[0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.15, 0.04]} />
            <meshStandardMaterial color="#faf6ed" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.125, -0.022]} rotation={[0.25, 0, 0]}>
            <boxGeometry args={[0.182, 0.038, 0.01]} />
            <meshStandardMaterial color="#c95b49" roughness={0.6} />
          </mesh>
        </group>
        {/* Lampu Belajar Hangat Meja Kerja (Meredup Mati Saat Laptop Ditutup!) */}
        <pointLight
          ref={deskLampGlowRef}
          position={[-1.25, 0.42, 0.18]}
          color="#ffd58c"
          intensity={workLaptopClosed ? 0 : 4.2}
          distance={5.5}
          decay={2}
        />
      </group>

      {/* ==================================================================== */}
      {/* 3. 14 KUPU-KUPU TROPIS WARNA-WARNI TERBANG LEMBUT (PAGI & SORE)      */}
      {/* ==================================================================== */}
      {showButterflies &&
        BUTTERFLY_SEEDS.slice(0, butterflyCount).map((seed, idx) => (
          <group
            key={`bfly-${idx}`}
            ref={(el) => {
              butterflyRefs.current[idx] = el;
            }}
            position={[seed.homeX, seed.homeY, seed.homeZ]}
          >
            {/* Badan Kupu-Kupu Mungil */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.075, 6]} />
              <meshBasicMaterial color={seed.accentColor} />
            </mesh>
            {/* Sayap Kiri Mengepak */}
            <mesh
              ref={(el) => {
                wingLRefs.current[idx] = el;
              }}
              position={[-0.045, 0.004, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.052, 8]} />
              <meshBasicMaterial color={seed.wingColor} side={THREE.DoubleSide} />
            </mesh>
            {/* Sayap Kanan Mengepak */}
            <mesh
              ref={(el) => {
                wingRRefs.current[idx] = el;
              }}
              position={[0.045, 0.004, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <circleGeometry args={[0.052, 8]} />
              <meshBasicMaterial color={seed.wingColor} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
    </group>
  );
};
