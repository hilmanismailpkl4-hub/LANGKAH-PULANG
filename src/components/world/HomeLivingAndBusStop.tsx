import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface HomeLivingAndBusStopProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createTvChannelTexture(channel: 1 | 2 | 3): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 288;
  const ctx = c.getContext('2d')!;

  if (channel === 1) {
    // Saluran 1: Kartun Sore Kesukaan Kira
    const grad = ctx.createLinearGradient(0, 0, 0, 288);
    grad.addColorStop(0, '#78c6f7');
    grad.addColorStop(0.68, '#d9f2ff');
    grad.addColorStop(1, '#79c267');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 288);

    // Pelangi ceria
    ['#f26b5b', '#f7b84b', '#66c78c', '#4fa3e0'].forEach((col, i) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(256, 210, 145 - i * 12, Math.PI, 0);
      ctx.stroke();
    });

    // Kucing kartun oranye lucu
    ctx.fillStyle = '#f28c38';
    ctx.beginPath();
    ctx.arc(256, 175, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(242, 168, 5, 0, Math.PI * 2);
    ctx.arc(270, 168, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(20,25,35,0.75)';
    ctx.fillRect(16, 16, 175, 32);
    ctx.fillStyle = '#ffea94';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('KARTUN SORE · CH 1', 26, 38);
  } else if (channel === 2) {
    // Saluran 2: Berita Cuaca & Lalu Lintas Kota
    ctx.fillStyle = '#142c4c';
    ctx.fillRect(0, 0, 512, 288);
    ctx.fillStyle = '#1f4e82';
    ctx.fillRect(24, 52, 220, 155);
    ctx.fillStyle = '#f7c548';
    ctx.beginPath();
    ctx.arc(96, 122, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText('27°C', 142, 138);

    ctx.fillStyle = '#cfe8ff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('INFO KOTA HARI INI', 268, 92);
    ctx.font = '17px sans-serif';
    ctx.fillText('• Jl. Kenangan: Ramai Lancar', 268, 130);
    ctx.fillText('• Taman Danau: Sejuk Sore', 268, 160);
    ctx.fillText('• Stasiun Senja: Tepat Waktu', 268, 190);

    ctx.fillStyle = '#d93829';
    ctx.fillRect(0, 232, 512, 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 19px sans-serif';
    ctx.fillText('BERITA KOTA · JAGA KESEHATAN & SELAMAT PULANG KERJA', 18, 266);
  } else {
    // Saluran 3: Panggung Akustik Senja Nusantara
    const grad = ctx.createLinearGradient(0, 0, 0, 288);
    grad.addColorStop(0, '#1f162b');
    grad.addColorStop(1, '#5e352c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 288);

    ctx.fillStyle = 'rgba(255, 206, 120, 0.25)';
    ctx.beginPath();
    ctx.arc(170, 80, 75, 0, Math.PI * 2);
    ctx.arc(345, 80, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffdfa3';
    ctx.font = 'italic bold 32px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('AKUSTIK MALAM NUSANTARA', 256, 140);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#f2b872';
    ctx.fillText('♪ Petikan Gitar Hangat untuk Mengantar Istirahat ♪', 256, 186);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBusStopMapTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#132238';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, 0, 512, 76);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('HALTE JL. KENANGAN', 26, 48);

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('PETA RUTE & PENUNJUK KOTA', 26, 114);

  // Garis rute koridor bus
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(56, 165);
  ctx.lineTo(56, 445);
  ctx.stroke();

  const stops = [
    'Taman Kota & Danau Senja (Barat)',
    'Jembatan Sungai & Toko Nada Lama',
    'Halte Jl. Kenangan / Kios Harmoni ★',
    'Menara Nusantara (Seberang Jalan)',
    'Stasiun Kereta Tua Senja (Timur)',
    'Angkringan Pak Slamet & Jl. Melati',
  ];

  stops.forEach((label, idx) => {
    const y = 165 + idx * 54;
    ctx.fillStyle = idx === 2 ? '#34d399' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(56, y, idx === 2 ? 12 : 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = idx === 2 ? '#a7f3d0' : '#f1f5f9';
    ctx.font = idx === 2 ? 'bold 20px sans-serif' : '19px sans-serif';
    ctx.fillText(label, 84, y + 6);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBusStopHeaderTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(0, 0, 512, 96);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 78, 512, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HALTE BUS · JL. KENANGAN', 256, 52);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const CLOCK_HOURS: Record<TimeOfDay, [number, number]> = {
  morning: [8, 24],
  sunset: [17, 18],
  rain_dusk: [17, 54],
  night: [20, 42],
};

/**
 * Ruang Tamu Rumah Lebih Hidup (Lemari Pakaian Damar, TV 3 Saluran & Jam Dinding Real-Time)
 * serta Halte Bus Kota Modern di tepi Jl. Kenangan (tempat berteduh hujan & papan rute).
 */
export const HomeLivingAndBusStop: React.FC<HomeLivingAndBusStopProps> = ({ timeOfDay, settings }) => {
  const tvChannel = useGameStore((s) => s.livingRoomTvChannel);
  const isEveningOrNight = timeOfDay !== 'morning';
  const textures = useMemo(() => getProceduralTextures(), []);

  const secondHandRef = useRef<THREE.Group>(null);
  const tvGlowRef = useRef<THREE.PointLight>(null);

  const mediaTextures = useMemo(
    () => ({
      tv1: createTvChannelTexture(1),
      tv2: createTvChannelTexture(2),
      tv3: createTvChannelTexture(3),
      busMap: createBusStopMapTexture(),
      busHeader: createBusStopHeaderTexture(),
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (secondHandRef.current) {
      // Jarum detik berputar halus secara real-time
      const secAngle = -((t % 60) / 60) * Math.PI * 2;
      secondHandRef.current.rotation.z = secAngle;
    }
    if (tvGlowRef.current && tvChannel > 0) {
      tvGlowRef.current.intensity = 5.5 + Math.sin(t * 6.5) * 0.65;
    }
  });

  const [hr, min] = CLOCK_HOURS[timeOfDay];
  const hourAngle = -(((hr % 12) + min / 60) / 12) * Math.PI * 2;
  const minAngle = -(min / 60) * Math.PI * 2;

  const activeTvTex =
    tvChannel === 1 ? mediaTextures.tv1 : tvChannel === 2 ? mediaTextures.tv2 : mediaTextures.tv3;
  const tvLightColor =
    tvChannel === 1 ? '#a8e6ff' : tvChannel === 2 ? '#93c5fd' : '#ffd18c';

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. LEMARI PAKAIAN KAYU DAMAR (RUMAH JL. MELATI: [-26.35, 69.25])  */}
      {/* ================================================================= */}
      <group position={[-26.35, 0.08, 69.25]}>
        {/* Badan Lemari Jati Hangat */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 2.2, 1.62]} />
          <meshStandardMaterial color="#6e472d" roughness={0.72} />
        </mesh>
        {/* Garis Pintu Kembar & Gagang Kuningan */}
        <mesh position={[0.42, 1.1, 0]}>
          <boxGeometry args={[0.02, 2.08, 0.03]} />
          <meshStandardMaterial color="#422817" />
        </mesh>
        <mesh position={[0.44, 1.12, -0.1]}>
          <cylinderGeometry args={[0.016, 0.016, 0.2, 8]} />
          <meshStandardMaterial color="#e0b86b" metalness={0.75} roughness={0.28} />
        </mesh>
        <mesh position={[0.44, 1.12, 0.1]}>
          <cylinderGeometry args={[0.016, 0.016, 0.2, 8]} />
          <meshStandardMaterial color="#e0b86b" metalness={0.75} roughness={0.28} />
        </mesh>
        {/* Cermin Panjang di Pintu Kanan Lemari */}
        <mesh position={[0.425, 1.18, 0.44]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.52, 1.48]} />
          <meshStandardMaterial color="#dbe7f2" metalness={0.85} roughness={0.12} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 2. MEJA & TV KELUARGA RUANG TAMU (RUMAH JL. MELATI: [-13.68, 68.9])*/}
      {/* ================================================================= */}
      <group position={[-13.68, 0.08, 68.9]}>
        {/* Rak Konsol TV Kayu */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.58, 1.88]} />
          <meshStandardMaterial color="#5c3d28" roughness={0.72} />
        </mesh>
        {/* Kaki Penyangga TV & Bingkai TV Datar */}
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.2, 0.14, 0.42]} />
          <meshStandardMaterial color="#1f242c" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.18, 0]} castShadow>
          <boxGeometry args={[0.1, 0.96, 1.56]} />
          <meshStandardMaterial color="#181b21" roughness={0.35} metalness={0.4} />
        </mesh>
        {/* Layar TV (Menyala 3 Saluran / Mati) */}
        <mesh position={[-0.056, 1.18, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.46, 0.86]} />
          {tvChannel > 0 ? (
            <meshStandardMaterial
              map={activeTvTex}
              emissiveMap={activeTvTex}
              emissive="#ffffff"
              emissiveIntensity={1.15}
              roughness={0.2}
            />
          ) : (
            <meshStandardMaterial color="#10141c" roughness={0.12} metalness={0.5} />
          )}
        </mesh>
        {/* Lampu Indikator Power TV */}
        <mesh position={[-0.055, 0.72, 0.68]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshStandardMaterial
            color={tvChannel > 0 ? '#4ade80' : '#ef4444'}
            emissive={tvChannel > 0 ? '#4ade80' : '#ef4444'}
            emissiveIntensity={2.0}
          />
        </mesh>
        {tvChannel > 0 && (
          <pointLight
            ref={tvGlowRef}
            position={[-0.85, 1.25, 0]}
            color={tvLightColor}
            intensity={5.5}
            distance={9}
            decay={1.8}
          />
        )}
      </group>

      {/* ================================================================= */}
      {/* 3. JAM DINDING KAYU RUMAH (BERGERAK REAL-TIME: [-20.0, 2.75, 73.7])*/}
      {/* ================================================================= */}
      <group position={[-20.0, 2.75, 73.72]} rotation={[0, Math.PI, 0]}>
        {/* Bingkai Kayu Bundar */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 24]} />
          <meshStandardMaterial color="#5c3a24" roughness={0.65} />
        </mesh>
        {/* Muka Jam Putih Krem */}
        <mesh position={[0, 0, 0.045]}>
          <circleGeometry args={[0.31, 24]} />
          <meshStandardMaterial color="#fcf8ee" roughness={0.6} />
        </mesh>
        {/* 4 Tanda Utama 12, 3, 6, 9 */}
        {[0, 1, 2, 3].map((q) => {
          const ang = (q * Math.PI) / 2;
          return (
            <mesh key={`ck-${q}`} position={[Math.sin(ang) * 0.25, Math.cos(ang) * 0.25, 0.05]}>
              <boxGeometry args={[0.024, 0.06, 0.01]} />
              <meshStandardMaterial color="#2b2623" />
            </mesh>
          );
        })}
        {/* Jarum Jam */}
        <group position={[0, 0, 0.055]} rotation={[0, 0, hourAngle]}>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.026, 0.16, 0.01]} />
            <meshStandardMaterial color="#1f1c1a" />
          </mesh>
        </group>
        {/* Jarum Menit */}
        <group position={[0, 0, 0.06]} rotation={[0, 0, minAngle]}>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.018, 0.23, 0.01]} />
            <meshStandardMaterial color="#1f1c1a" />
          </mesh>
        </group>
        {/* Jarum Detik Merah Bergerak Real-Time */}
        <group ref={secondHandRef} position={[0, 0, 0.065]}>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.01, 0.24, 0.008]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* 4. HALTE BUS KOTA MODERN (TEPI JL. KENANGAN: [21.5, 0, 10.8])     */}
      {/* ================================================================= */}
      <group position={[21.5, 0, 10.8]}>
        {/* Lantai Peron Halte */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[6.0, 0.08, 2.5]} />
          <meshStandardMaterial color="#b8c0c9" roughness={0.82} />
        </mesh>
        {/* 4 Tiang Baja Halte */}
        {[
          [-2.75, 1.5, 1.05],
          [0, 1.5, 1.05],
          [2.75, 1.5, 1.05],
          [2.75, 1.5, -0.95],
        ].map(([px, py, pz], idx) => (
          <mesh key={`bsp-${idx}`} position={[px, py, pz]} castShadow>
            <boxGeometry args={[0.14, 3.0, 0.14]} />
            <meshStandardMaterial color="#2c3e55" metalness={0.6} roughness={0.38} />
          </mesh>
        ))}

        {/* Atap Kanopi Pelindung Hujan */}
        <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.1, 0.18, 2.65]} />
          <meshStandardMaterial color="#25364a" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Papan Nama Bercahaya "HALTE BUS · JL. KENANGAN" */}
        <mesh position={[0, 3.05, -1.35]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[5.2, 0.62]} />
          <meshStandardMaterial
            map={mediaTextures.busHeader}
            emissiveMap={mediaTextures.busHeader}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.95 : 0.2}
          />
        </mesh>

        {/* Dinding Kaca Belakang Halte */}
        <mesh position={[0, 1.52, 1.05]}>
          <boxGeometry args={[5.4, 2.65, 0.08]} />
          <meshStandardMaterial color="#d9efff" transparent opacity={0.32} roughness={0.08} metalness={0.2} />
        </mesh>

        {/* Bangku Panjang Halte */}
        <mesh position={[-0.35, 0.5, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.1, 0.55]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.65} />
        </mesh>
        <mesh position={[-1.7, 0.25, 0.4]}>
          <boxGeometry args={[0.12, 0.5, 0.45]} />
          <meshStandardMaterial color="#374151" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[1.0, 0.25, 0.4]}>
          <boxGeometry args={[0.12, 0.5, 0.45]} />
          <meshStandardMaterial color="#374151" metalness={0.65} roughness={0.35} />
        </mesh>

        {/* Papan Info Peta Rute Bus Kota Bercahaya (Sisi Kanan Halte) */}
        <group position={[2.75, 1.55, 0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 2.25, 1.78]} />
            <meshStandardMaterial color="#1f2937" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[-0.11, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.6, 2.02]} />
            <meshStandardMaterial
              map={mediaTextures.busMap}
              emissiveMap={mediaTextures.busMap}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.95 : 0.25}
            />
          </mesh>
          <mesh position={[0.11, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.6, 2.02]} />
            <meshStandardMaterial
              map={mediaTextures.busMap}
              emissiveMap={mediaTextures.busMap}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.95 : 0.25}
            />
          </mesh>
        </group>

        {/* Lampu LED Plafon Halte (Hangat Terang Saat Sore/Hujan/Malam) */}
        <mesh position={[0, 2.92, 0]}>
          <boxGeometry args={[4.4, 0.07, 0.22]} />
          <meshStandardMaterial
            color="#fff5e0"
            emissive="#ffd48a"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.35}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <pointLight position={[0, 2.65, -0.2]} color="#ffe2a8" intensity={14} distance={15} decay={1.7} />
        )}
      </group>
    </group>
  );
};
