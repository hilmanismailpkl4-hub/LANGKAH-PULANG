import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface KetoprakLotusAndWeatherPlazaProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const BANG_JAJA_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Bang Jaja',
  role: 'Penjual Ketoprak Jakarta',
  accentColor: '#38bdf8',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.7,
    shirtColor: '#2563eb',
    pantsColor: '#1f2937',
    skinColor: '#c99770',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

function createKetoprakBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.5, '#1d4ed8');
  grad.addColorStop(1, '#1e40af');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KETOPRAK JAKARTA', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('BANG JAJA · ULEK COBEK SEGAR', 320, 96);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KETUPAT · TAHU · BIHUN · TELUR DADAR · KERUPUK', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const WEATHER_INFO: Record<
  TimeOfDay,
  {
    baseHour: number;
    baseMin: number;
    temp: string;
    label: string;
    humidity: string;
    wind: string;
    aqi: string;
    accent: string;
    bgTop: string;
    bgBottom: string;
  }
> = {
  morning: {
    baseHour: 7,
    baseMin: 42,
    temp: '26°C',
    label: 'Pagi Cerah Berembun',
    humidity: '68%',
    wind: '8 km/j',
    aqi: 'AQI 31 · Segar',
    accent: '#fbbf24',
    bgTop: '#0f2942',
    bgBottom: '#0b1526',
  },
  sunset: {
    baseHour: 17,
    baseMin: 38,
    temp: '29°C',
    label: 'Senja Hangat Keemasan',
    humidity: '62%',
    wind: '11 km/j',
    aqi: 'AQI 36 · Baik',
    accent: '#fb923c',
    bgTop: '#2c1824',
    bgBottom: '#0f1320',
  },
  rain_dusk: {
    baseHour: 18,
    baseMin: 14,
    temp: '23°C',
    label: 'Sore Berhujan Sejuk',
    humidity: '88%',
    wind: '19 km/j',
    aqi: 'AQI 22 · Bersih',
    accent: '#38bdf8',
    bgTop: '#102033',
    bgBottom: '#09111c',
  },
  night: {
    baseHour: 20,
    baseMin: 46,
    temp: '24°C',
    label: 'Malam Tenang Berbintang',
    humidity: '76%',
    wind: '6 km/j',
    aqi: 'AQI 29 · Baik',
    accent: '#a5b4fc',
    bgTop: '#0b1024',
    bgBottom: '#070a14',
  },
};

function drawWeatherTotemScreen(
  ctx: CanvasRenderingContext2D,
  timeOfDay: TimeOfDay,
  elapsedSec: number,
) {
  const W = 512;
  const H = 860;
  const info = WEATHER_INFO[timeOfDay];

  // Latar kaca gelap modern bertema waktu kota
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, info.bgTop);
  grad.addColorStop(1, info.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, W - 20, H - 20);

  // Header Plaza Menara Nusantara
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillRect(22, 24, W - 44, 92);

  ctx.fillStyle = info.accent;
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PLAZA MENARA NUSANTARA', W / 2, 52);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 17px monospace';
  ctx.fillText('MONITOR CUACA & UDARA · KOTA SENJA', W / 2, 86);

  // Jam Digital Berjalan Real-Time (detik terus bergerak!)
  const totalSec = Math.floor(elapsedSec);
  const sec = totalSec % 60;
  const min = (info.baseMin + Math.floor(totalSec / 60)) % 60;
  const hr = (info.baseHour + Math.floor((info.baseMin + Math.floor(totalSec / 60)) / 60)) % 24;
  const clockStr = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')} WIB`;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px monospace';
  ctx.fillText(clockStr, W / 2, 168);

  // Ikon Cuaca Vektor Tajam
  const cx = W / 2;
  const cy = 285;
  if (timeOfDay === 'morning') {
    ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
    ctx.beginPath();
    ctx.arc(cx, cy, 66, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fcd34d';
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.fill();
  } else if (timeOfDay === 'sunset') {
    ctx.fillStyle = 'rgba(251, 146, 60, 0.25)';
    ctx.beginPath();
    ctx.arc(cx, cy + 8, 68, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(cx, cy + 12, 44, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 72, cy + 16);
    ctx.lineTo(cx + 72, cy + 16);
    ctx.stroke();
  } else if (timeOfDay === 'rain_dusk') {
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx - 26, cy - 6, 30, 0, Math.PI * 2);
    ctx.arc(cx + 12, cy - 16, 36, 0, Math.PI * 2);
    ctx.arc(cx + 42, cy - 2, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 24, cy + 28);
      ctx.lineTo(cx + i * 24 - 8, cy + 54);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx - 4, cy, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = info.bgTop;
    ctx.beginPath();
    ctx.arc(cx + 16, cy - 10, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    [
      [cx + 52, cy - 36],
      [cx - 60, cy - 28],
      [cx + 46, cy + 26],
    ].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Suhu Besar & Deskripsi Cuaca
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 88px sans-serif';
  ctx.fillText(info.temp, W / 2, 422);

  ctx.fillStyle = info.accent;
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(info.label, W / 2, 488);

  // 3 Kotak Metrik Lingkungan (Kelembapan, Angin, Kualitas Udara AQI)
  const cards = [
    { title: 'KELEMBAPAN', value: info.humidity, dot: '#38bdf8' },
    { title: 'KECEPATAN ANGIN', value: info.wind, dot: '#fbbf24' },
    { title: 'KUALITAS UDARA', value: info.aqi, dot: '#34d399' },
  ];
  cards.forEach((card, idx) => {
    const y = 538 + idx * 78;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(34, y, W - 68, 62);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 2;
    ctx.strokeRect(34, y, W - 68, 62);

    ctx.fillStyle = card.dot;
    ctx.beginPath();
    ctx.arc(62, y + 31, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(card.title, 86, y + 31);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(card.value, W - 52, y + 31);
  });

  // Footer Slogan Ramah Kota Senja
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(253, 230, 138, 0.85)';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('“Berjalanlah pelan — kota ini menunggumu pulang.”', W / 2, H - 46);
}

// 16 Daun Teratai Organik di Sudut Tenggara Danau Senja (center [-75.5, -0.105, -17.8])
const LOTUS_PADS: {
  x: number;
  z: number;
  r: number;
  rot: number;
  shade: string;
  phase: number;
  flower?: 'pink' | 'white' | 'bud';
}[] = [
  { x: 2.3, z: 2.3, r: 0.52, rot: 0.4, shade: '#2d6a3e', phase: 0.2, flower: 'pink' },
  { x: 1.4, z: 3.1, r: 0.42, rot: 1.9, shade: '#3a7d44', phase: 1.1 },
  { x: 0.6, z: 1.8, r: 0.56, rot: 2.7, shade: '#245934', phase: 2.0, flower: 'white' },
  { x: 2.9, z: 0.8, r: 0.46, rot: 4.1, shade: '#347441', phase: 2.8, flower: 'bud' },
  { x: 1.7, z: -0.2, r: 0.58, rot: 0.9, shade: '#296339', phase: 3.5, flower: 'pink' },
  { x: -0.4, z: 2.9, r: 0.44, rot: 3.3, shade: '#3c8046', phase: 4.2 },
  { x: -1.3, z: 1.6, r: 0.54, rot: 5.1, shade: '#2a623a', phase: 0.8, flower: 'pink' },
  { x: -0.6, z: 0.3, r: 0.48, rot: 1.5, shade: '#33713f', phase: 1.9, flower: 'bud' },
  { x: -2.2, z: 2.5, r: 0.4, rot: 2.2, shade: '#3a7a44', phase: 2.6 },
  { x: -2.7, z: 0.7, r: 0.52, rot: 4.6, shade: '#265c36', phase: 3.9, flower: 'white' },
  { x: -1.6, z: -0.9, r: 0.48, rot: 0.2, shade: '#357441', phase: 4.8, flower: 'pink' },
  { x: 0.3, z: -1.4, r: 0.5, rot: 2.9, shade: '#2d6a3e', phase: 5.4 },
  { x: 1.9, z: -1.8, r: 0.46, rot: 5.6, shade: '#3d8248', phase: 0.5, flower: 'white' },
  { x: 3.1, z: -0.9, r: 0.38, rot: 1.2, shade: '#296038', phase: 1.6 },
  { x: -0.8, z: -2.5, r: 0.45, rot: 3.7, shade: '#32703f', phase: 2.4, flower: 'bud' },
  { x: -2.9, z: -1.8, r: 0.44, rot: 4.9, shade: '#275d37', phase: 3.3 },
];

/**
 * Opsi 3 — Kehidupan Tepi Sungai & Plaza Kota:
 * 1. Gerobak Ketoprak Jakarta Bang Jaja ([-36.5, 0, 36.2]) di Promenade Tepi Sungai Timur
 * 2. Hamparan Kolam Teratai Mekar Danau Senja ([-75.5, -0.105, -17.8]) + 2 Katak Hijau Mungil
 * 3. Tugu Papan Cuaca, Suhu & Jam Digital Modern Plaza Menara Nusantara ([24.4, 0, -15.2])
 */
export const KetoprakLotusAndWeatherPlaza: React.FC<KetoprakLotusAndWeatherPlazaProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const ketoprakBannerTex = useMemo(() => createKetoprakBannerTexture(), []);

  const weatherCanvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 860;
    const ctx = c.getContext('2d')!;
    drawWeatherTotemScreen(ctx, 'morning', 0);
    return { canvas: c, ctx };
  }, []);

  const weatherTex = useMemo(() => {
    const t = new THREE.CanvasTexture(weatherCanvas.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [weatherCanvas]);

  useEffect(() => {
    return () => {
      ketoprakBannerTex.dispose();
      weatherTex.dispose();
    };
  }, [ketoprakBannerTex, weatherTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';
  const isRain = timeOfDay === 'rain_dusk';

  const jajaHeadRef = useRef<THREE.Group>(null);
  const jajaRightArmRef = useRef<THREE.Group>(null);
  const lotusGroupRef = useRef<THREE.Group>(null);
  const frogRef = useRef<THREE.Group>(null);
  const anemometerRef = useRef<THREE.Group>(null);
  const lastWeatherDrawRef = useRef(-10);
  const lastWeatherTimeOfDayRef = useRef<TimeOfDay>(timeOfDay);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Bang Jaja Ketoprak (mengulek cobek bumbu kacang & menyapa)
    if (!shouldSkipPerfFrame(-36.5, 36.2, 46)) {
      const distJaja = py > 4 ? 99 : Math.hypot(px - -36.5, pz - 36.2);
      if (jajaHeadRef.current) {
        jajaHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.22;
      }
      if (jajaRightArmRef.current) {
        // Gerakan melingkar halus seperti mengulek bumbu kacang di cobek batu!
        jajaRightArmRef.current.rotation.x =
          distJaja < 5.5
            ? -1.45 + Math.sin(t * 7.5) * 0.24
            : -0.92 + Math.sin(t * 4.4) * 0.16;
        jajaRightArmRef.current.rotation.z = Math.cos(t * 4.4) * 0.12;
      }
    }

    // 2. Animasi Hamparan Teratai Mengapung Tenang & Katak Kecil Melompat
    if (playerRuntime.lotusFrogHopTimer > 0) {
      playerRuntime.lotusFrogHopTimer = Math.max(0, playerRuntime.lotusFrogHopTimer - dt);
    }
    if (!shouldSkipPerfFrame(-75.5, -17.8, 52)) {
      if (lotusGroupRef.current) {
        for (let i = 0; i < LOTUS_PADS.length; i++) {
          const child = lotusGroupRef.current.children[i];
          if (!child) continue;
          const pad = LOTUS_PADS[i];
          child.position.y = Math.sin(t * 1.45 + pad.phase) * 0.014;
          child.rotation.z = Math.sin(t * 1.1 + pad.phase) * 0.025;
        }
      }
      if (frogRef.current) {
        const hopping = playerRuntime.lotusFrogHopTimer > 0;
        if (hopping) {
          const cycle = ((t * 2.2) % 1 + 1) % 1;
          const arc = Math.sin(cycle * Math.PI);
          frogRef.current.position.set(1.4 + (cycle - 0.5) * 0.22, 0.03 + arc * 0.24, 3.1);
          frogRef.current.rotation.x = -arc * 0.35;
        } else {
          frogRef.current.position.set(1.4, 0.03 + Math.sin(t * 1.45 + 1.1) * 0.014, 3.1);
          frogRef.current.rotation.x = 0;
        }
      }
    }

    // 3. Animasi Kincir Angin Anemometer & Update Jam Digital Papan Cuaca Plaza Nusantara
    if (!shouldSkipPerfFrame(24.4, -15.2, 54)) {
      if (anemometerRef.current) {
        const spinSpeed = isRain ? 6.2 : timeOfDay === 'sunset' ? 3.2 : 1.9;
        anemometerRef.current.rotation.y += dt * spinSpeed;
      }
      if (t - lastWeatherDrawRef.current >= 1.0 || lastWeatherTimeOfDayRef.current !== timeOfDay) {
        lastWeatherDrawRef.current = t;
        lastWeatherTimeOfDayRef.current = timeOfDay;
        drawWeatherTotemScreen(weatherCanvas.ctx, timeOfDay, t);
        weatherTex.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK KETOPRAK JAKARTA BANG JAJA ([-36.5, 0, 36.2])             */}
      {/* ==================================================================== */}
      <group position={[-36.5, 0, 36.2]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Bodi Gerobak Kayu Biru-Kuning Klasik Ketoprak Jakarta */}
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.02, 0.84, 0.98]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.68} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[2.12, 0.07, 1.08]} />
          <meshStandardMaterial color="#b9864f" roughness={0.72} />
        </mesh>

        {/* Spanduk Depan "KETOPRAK JAKARTA · BANG JAJA" */}
        <mesh position={[0, 0.64, 0.505]}>
          <planeGeometry args={[1.9, 0.56]} />
          <meshStandardMaterial
            map={ketoprakBannerTex}
            emissiveMap={ketoprakBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
          />
        </mesh>

        {/* Cobek Batu Besar & Ulekan Bumbu Kacang di Tengah Meja Gerobak */}
        <group position={[-0.22, 1.13, 0.06]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.17, 0.09, 16]} />
            <meshStandardMaterial color="#475569" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.18, 0.16, 0.02, 14]} />
            <meshStandardMaterial color="#9a5c2a" roughness={0.65} />
          </mesh>
          <mesh position={[0.07, 0.09, 0.02]} rotation={[0.2, 0.4, -0.55]} castShadow>
            <capsuleGeometry args={[0.026, 0.14, 5, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.88} />
          </mesh>
        </group>

        {/* Kaleng Kerupuk Kaca Biru Klasik Berisi Kerupuk Putih & Oranye */}
        <group position={[0.62, 1.32, 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.44, 0.36]} />
            <meshStandardMaterial color="#0284c7" roughness={0.42} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.182]}>
            <planeGeometry args={[0.26, 0.28]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.05, 14]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>

        {/* Nampan Tahu Goreng, Bihun & Botol Kecap Manis */}
        <mesh position={[-0.72, 1.13, 0.08]} castShadow>
          <boxGeometry args={[0.42, 0.06, 0.34]} />
          <meshStandardMaterial color="#eab308" roughness={0.72} />
        </mesh>
        <mesh position={[0.18, 1.21, -0.18]} castShadow>
          <cylinderGeometry args={[0.036, 0.04, 0.22, 10]} />
          <meshStandardMaterial color="#271a14" roughness={0.28} />
        </mesh>

        {/* 3 Ketupat Janur Tergantung di Tiang Etalase */}
        <mesh position={[-0.75, 1.56, -0.12]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.94, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-0.45, 2.02, -0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.64, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.4} />
        </mesh>
        {[-0.64, -0.46, -0.28].map((kx, ki) => (
          <mesh key={`ktp-${ki}`} position={[kx, 1.88, -0.12]} rotation={[0, ki * 0.4, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.11, 0.11, 0.065]} />
            <meshStandardMaterial color={ki % 2 === 0 ? '#a3e635' : '#bef264'} roughness={0.75} />
          </mesh>
        ))}

        {/* 2 Roda Gerobak + Kaki Penyangga */}
        {[-0.68, 0.68].map((wx, wi) => (
          <group key={`kw-${wi}`} position={[wx, 0.28, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.07, 16]} />
              <meshStandardMaterial color="#1f2937" roughness={0.86} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.17, 0.17, 0.078, 12]} />
              <meshStandardMaterial color="#facc15" metalness={0.35} roughness={0.45} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.78, 0.14, -0.36]}>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
          <meshStandardMaterial color="#374151" roughness={0.8} />
        </mesh>
        <mesh position={[0.78, 0.14, -0.36]}>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
          <meshStandardMaterial color="#374151" roughness={0.8} />
        </mesh>

        {/* Payung Tenda Biru-Krem Penahan Panas & Hujan */}
        <mesh position={[0.08, 1.8, -0.16]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.28, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.08, 2.94, -0.16]} castShadow>
          <coneGeometry args={[1.64, 0.44, 10]} />
          <meshStandardMaterial color="#2563eb" roughness={0.65} />
        </mesh>
        <mesh position={[0.08, 2.95, -0.16]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.65, 0.44, 5]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Gerobak Sore & Malam */}
        <mesh position={[0, 2.4, 0.18]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.4, 0.18]} scale={[1.6, 1.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd080"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight
            position={[0, 2.2, 0.35]}
            color="#ffd185"
            intensity={isDarkNight ? 9.5 : 6.0}
            distance={11}
            decay={2}
          />
        )}

        {/* Bang Jaja Ramah Mengulek Bumbu Kacang di Belakang Gerobak */}
        <group position={[0.1, 0, -1.1]}>
          <HumanModel
            profile={BANG_JAJA_PROFILE}
            headRef={jajaHeadRef}
            rightArmRef={jajaRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan di Depan Gerobak */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.48, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5f3a" roughness={0.78} />
          </mesh>
          {[-0.56, 0.56].map((lx, li) => (
            <mesh key={`kbl-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.09, 0.42, 0.36]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. HAMPARAN KOLAM TERATAI MEKAR DANAU SENJA ([-75.5, -0.105, -17.8]) */}
      {/* ==================================================================== */}
      <group position={[-75.5, -0.105, -17.8]}>
        <group ref={lotusGroupRef}>
          {LOTUS_PADS.map((pad, idx) => (
            <group key={`lpad-${idx}`} position={[pad.x, 0, pad.z]} rotation={[0, pad.rot, 0]}>
              {/* Daun Teratai Bulat Berbelah Alami */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[pad.r, 18, 0, Math.PI * 1.86]} />
                <meshStandardMaterial
                  color={pad.shade}
                  roughness={0.62}
                  side={THREE.DoubleSide}
                  polygonOffset
                  polygonOffsetFactor={-1}
                  polygonOffsetUnits={-1}
                />
              </mesh>

              {/* Bunga Teratai Mekar Berlapis Kelopak (Merah Muda / Putih Gading) */}
              {(pad.flower === 'pink' || pad.flower === 'white') && (
                <group position={[0, 0.025, 0]}>
                  {/* Putik Kuning Keemasan di Tengah */}
                  <mesh position={[0, 0.04, 0]}>
                    <sphereGeometry args={[0.045, 10, 8]} />
                    <meshStandardMaterial color="#facc15" roughness={0.5} />
                  </mesh>
                  {/* 6 Kelopak Luar Terbuka */}
                  {[0, 1, 2, 3, 4, 5].map((pi) => {
                    const ang = (pi / 6) * Math.PI * 2;
                    return (
                      <mesh
                        key={`po-${pi}`}
                        position={[Math.cos(ang) * 0.09, 0.03, Math.sin(ang) * 0.09]}
                        rotation={[Math.sin(ang) * 0.65, -ang, -Math.cos(ang) * 0.65]}
                        scale={[1.25, 0.45, 0.72]}
                      >
                        <sphereGeometry args={[0.075, 8, 6]} />
                        <meshStandardMaterial
                          color={pad.flower === 'pink' ? '#f472b6' : '#fff7ed'}
                          emissive={pad.flower === 'pink' ? '#ec4899' : '#fef3c7'}
                          emissiveIntensity={isEveningOrNight ? 0.22 : 0.06}
                          roughness={0.42}
                        />
                      </mesh>
                    );
                  })}
                  {/* 5 Kelopak Dalam Tegak Lembut */}
                  {[0, 1, 2, 3, 4].map((pi) => {
                    const ang = (pi / 5) * Math.PI * 2 + 0.3;
                    return (
                      <mesh
                        key={`pi-${pi}`}
                        position={[Math.cos(ang) * 0.052, 0.058, Math.sin(ang) * 0.052]}
                        rotation={[Math.sin(ang) * 0.35, -ang, -Math.cos(ang) * 0.35]}
                        scale={[0.85, 0.55, 0.58]}
                      >
                        <sphereGeometry args={[0.06, 8, 6]} />
                        <meshStandardMaterial
                          color={pad.flower === 'pink' ? '#fbcfe8' : '#ffffff'}
                          roughness={0.38}
                        />
                      </mesh>
                    );
                  })}
                </group>
              )}

              {/* Kuncup Teratai Merah Muda */}
              {pad.flower === 'bud' && (
                <mesh position={[0, 0.065, 0]}>
                  <coneGeometry args={[0.055, 0.13, 8]} />
                  <meshStandardMaterial color="#f472b6" roughness={0.45} />
                </mesh>
              )}
            </group>
          ))}
        </group>

        {/* Katak Hijau Mungil Duduk di Daun Teratai Tepi (Melompat Ceria Saat Diamati!) */}
        <group ref={frogRef} position={[1.4, 0.03, 3.1]} rotation={[0, -0.6, 0]}>
          <mesh scale={[1.1, 0.78, 1.35]}>
            <sphereGeometry args={[0.058, 10, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.48} />
          </mesh>
          <mesh position={[-0.028, 0.042, 0.045]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          <mesh position={[0.028, 0.042, 0.045]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
        </group>

        {/* Katak Kedua Santai di Daun Barat */}
        <group position={[-0.4, 0.03, 2.9]} rotation={[0, 0.9, 0]}>
          <mesh scale={[1.05, 0.76, 1.28]}>
            <sphereGeometry args={[0.052, 10, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. TUGU PAPAN CUACA & JAM DIGITAL PLAZA MENARA NUSANTARA             */}
      {/*    ([24.4, 0, -15.2], Dua Sisi + Kincir Anemometer Berputar)         */}
      {/* ==================================================================== */}
      <group position={[24.4, 0, -15.2]}>
        {/* Umpak Granit Gelap Modern */}
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.64, 0.28, 0.62]} />
          <meshStandardMaterial color="#1e293b" roughness={0.55} metalness={0.25} />
        </mesh>

        {/* Bodi Monolit Aluminium & Kaca Tempered */}
        <mesh position={[0, 1.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.42, 2.68, 0.26]} />
          <meshStandardMaterial color="#0f172a" roughness={0.32} metalness={0.62} />
        </mesh>

        {/* Lis LED Vertikal Tipis Kiri & Kanan */}
        {[-0.72, 0.72].map((lx, li) => (
          <mesh key={`wled-${li}`} position={[lx, 1.62, 0]}>
            <boxGeometry args={[0.035, 2.52, 0.275]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive={isRain ? '#38bdf8' : '#f59e0b'}
              emissiveIntensity={isEveningOrNight ? 2.2 : 0.75}
            />
          </mesh>
        ))}

        {/* Layar Digital Depan (+Z Menghadap Jl. Kenangan) */}
        <mesh position={[0, 1.64, 0.136]}>
          <planeGeometry args={[1.26, 2.18]} />
          <meshStandardMaterial
            map={weatherTex}
            emissiveMap={weatherTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 1.05 : 0.72}
            roughness={0.14}
          />
        </mesh>
        {/* Layar Digital Belakang (-Z Menghadap Lobi Menara Nusantara) */}
        <mesh position={[0, 1.64, -0.136]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.26, 2.18]} />
          <meshStandardMaterial
            map={weatherTex}
            emissiveMap={weatherTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 1.05 : 0.72}
            roughness={0.14}
          />
        </mesh>

        {/* Sensor Angin Anemometer 3-Cangkir Berputar di Puncak Tugu */}
        <mesh position={[0, 3.12, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.032, 0.34, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
        </mesh>
        <group ref={anemometerRef} position={[0, 3.28, 0]}>
          {[0, 1, 2].map((ai) => {
            const ang = (ai / 3) * Math.PI * 2;
            return (
              <group key={`anm-${ai}`} rotation={[0, ang, 0]}>
                <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.28, 6]} />
                  <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0.28, 0, 0]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.35} metalness={0.4} />
                </mesh>
              </group>
            );
          })}
        </group>

        {isEveningOrNight && (
          <pointLight
            position={[0, 1.9, 0.55]}
            color={isRain ? '#7dd3fc' : '#fde68a'}
            intensity={isDarkNight ? 7.5 : 4.5}
            distance={9}
            decay={2}
          />
        )}
      </group>
    </group>
  );
};
