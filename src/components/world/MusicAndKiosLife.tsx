import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface MusicAndKiosLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const VINYL_LABEL_COLORS = ['#d96b3b', '#3b82b8', '#d4a23d'];

function createKiosVerticalNeonTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 192;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0e2824';
  ctx.fillRect(0, 0, 192, 512);

  // Bingkai neon hijau toska & aksen oranye hangat
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 172, 492);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(18, 22, 156, 72);
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('24 JAM', 96, 60);

  ctx.fillStyle = '#ecfdf5';
  ctx.font = 'bold 34px sans-serif';
  const letters = ['H', 'A', 'R', 'M', 'O', 'N', 'I'];
  letters.forEach((ch, idx) => {
    ctx.fillText(ch, 96, 134 + idx * 44);
  });

  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('KOPI · ES · SNACK', 96, 466);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createWindowNeonTexture(title: string, subtitle: string, accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0c1c26';
  ctx.fillRect(0, 0, 384, 128);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 368, 112);

  ctx.fillStyle = accent;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 192, 52);

  ctx.fillStyle = '#e0f2fe';
  ctx.font = '600 22px sans-serif';
  ctx.fillText(subtitle, 192, 96);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 1. Pemutar Piringan Hitam Hidup (Spinning Vinyl Turntable + Tonearm + Hi-Fi Speakers) di Toko Musik "Nada Lama"
 * 2. Papan Neon Vertikal 24 Jam, Neon Etalase & Mesin Minuman Kaleng Dingin Bercahaya di Kios 24 Jam Harmoni
 */
export const MusicAndKiosLife: React.FC<MusicAndKiosLifeProps> = ({ timeOfDay, settings }) => {
  const vinylPlaying = useGameStore((s) => s.vinylPlaying);
  const vinylTrackIdx = useGameStore((s) => s.vinylTrackIdx);
  const textures = useMemo(() => getProceduralTextures(), []);

  const kiosSigns = useMemo(
    () => ({
      vertical: createKiosVerticalNeonTexture(),
      open24: createWindowNeonTexture('BUKA 24 JAM', 'MINUMAN DINGIN & TEH HANGAT', '#38bdf8'),
      freshDrink: createWindowNeonTexture('KOPI & ES KRIM', 'MAMPIR SEBENTAR SEBELUM PULANG', '#fbbf24'),
    }),
    [],
  );

  const vinylDiscRef = useRef<THREE.Group>(null);
  const tonearmRef = useRef<THREE.Group>(null);
  const wooferLRef = useRef<THREE.Mesh>(null);
  const wooferRRef = useRef<THREE.Mesh>(null);
  const musicNoteRef = useRef<THREE.Group>(null);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // 1. Piringan Hitam Berputar Halus + Lengan Jarum Turun ke Alur Piringan
    if (vinylDiscRef.current && vinylPlaying) {
      vinylDiscRef.current.rotation.y -= dt * 2.35;
    }
    if (tonearmRef.current) {
      const targetAngle = vinylPlaying ? 0.42 : 0.02;
      tonearmRef.current.rotation.y = THREE.MathUtils.lerp(tonearmRef.current.rotation.y, targetAngle, dt * 4.5);
    }

    // Denyut bass lembut pada kedua speaker lantai kayu Hi-Fi saat piringan hitam berputar
    const pulse = vinylPlaying ? 1 + Math.abs(Math.sin(t * 7.2)) * 0.065 : 1;
    if (wooferLRef.current) wooferLRef.current.scale.set(pulse, pulse, 1);
    if (wooferRRef.current) wooferRRef.current.scale.set(pulse, pulse, 1);

    if (musicNoteRef.current) {
      musicNoteRef.current.visible = vinylPlaying;
      if (vinylPlaying) {
        const p = ((t * 0.48) % 1 + 1) % 1;
        musicNoteRef.current.position.y = 0.2 + p * 0.45;
        musicNoteRef.current.position.x = Math.sin(t * 2.3) * 0.08;
        musicNoteRef.current.rotation.y = t * 1.4;
        const sc = 0.55 + Math.sin(p * Math.PI) * 0.5;
        musicNoteRef.current.scale.set(sc, sc, sc);
      }
    }
  });

  const labelColor = VINYL_LABEL_COLORS[vinylTrackIdx % VINYL_LABEL_COLORS.length];

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. PEMUTAR PIRINGAN HITAM HIDUP & HI-FI SPEAKERS DI "NADA LAMA"      */}
      {/* ==================================================================== */}
      {/* Piringan Hitam Berputar + Tonearm tepat di atas meja turntable kasir ([-18.95, 1.35, -28.55]) */}
      <group position={[-18.95, 1.365, -28.55]}>
        {/* Piringan Hitam 12-inci Mengilap yang Berputar */}
        <group ref={vinylDiscRef}>
          <mesh>
            <cylinderGeometry args={[0.255, 0.255, 0.014, 24]} />
            <meshStandardMaterial color="#121418" roughness={0.18} metalness={0.55} />
          </mesh>
          {/* Alur Pantulan Ring Vinyl */}
          <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.14, 0.23, 24]} />
            <meshStandardMaterial color="#232830" roughness={0.22} metalness={0.65} />
          </mesh>
          {/* Label Tengah Berwarna + Marka Garis Putaran agar Putaran Terlihat Jelas! */}
          <mesh position={[0, 0.009, 0]}>
            <cylinderGeometry args={[0.078, 0.078, 0.006, 16]} />
            <meshStandardMaterial color={labelColor} roughness={0.45} />
          </mesh>
          <mesh position={[0.036, 0.013, 0]}>
            <boxGeometry args={[0.048, 0.003, 0.012]} />
            <meshStandardMaterial color="#fff8e7" roughness={0.5} />
          </mesh>
        </group>

        {/* Lengan Jarum Logam (Tonearm) yang Bergeser Masuk Saat Memutar */}
        <group ref={tonearmRef} position={[0.28, 0.045, -0.18]}>
          <mesh>
            <cylinderGeometry args={[0.028, 0.032, 0.05, 10]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.22} />
          </mesh>
          <mesh position={[-0.08, 0.022, 0.14]} rotation={[Math.PI / 2, 0, 0.45]}>
            <cylinderGeometry args={[0.007, 0.007, 0.34, 6]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[-0.15, 0.012, 0.28]} rotation={[0, 0.45, 0]}>
            <boxGeometry args={[0.035, 0.02, 0.055]} />
            <meshStandardMaterial color="#1f2937" roughness={0.4} />
          </mesh>
        </group>

        {/* Lampu Indikator Hangat Turntable */}
        <mesh position={[-0.31, 0.01, 0.24]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial
            color={vinylPlaying ? '#fde68a' : '#475569'}
            emissive={vinylPlaying ? '#f59e0b' : '#000000'}
            emissiveIntensity={vinylPlaying ? 3.2 : 0}
          />
        </mesh>

        {/* Notasi Cahaya Hangat Mengapung Saat Vinyl Berputar */}
        <group ref={musicNoteRef} visible={false}>
          <mesh>
            <octahedronGeometry args={[0.048, 0]} />
            <meshStandardMaterial color="#ffdf91" emissive="#f59e0b" emissiveIntensity={2.4} />
          </mesh>
        </group>
      </group>

      {/* Sepasang Speaker Lantai Kayu Hi-Fi Vintage Mengapit Meja Kasir "Nada Lama" */}
      {[
        { x: -20.72, ref: wooferLRef },
        { x: -15.32, ref: wooferRRef },
      ].map((sp, idx) => (
        <group key={`hifi-${idx}`} position={[sp.x, 0.08, -28.6]}>
          <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.52, 1.24, 0.48]} />
            <meshStandardMaterial color="#4a2e1d" roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.62, 0.245]}>
            <planeGeometry args={[0.42, 1.12]} />
            <meshStandardMaterial color="#1c1917" roughness={0.88} />
          </mesh>
          {/* Woofer Bawah (Berdenyut Halus Saat Vinyl Menyala!) */}
          <mesh ref={sp.ref} position={[0, 0.44, 0.252]}>
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial color="#2e2a27" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.44, 0.256]}>
            <circleGeometry args={[0.045, 12]} />
            <meshStandardMaterial color="#b4834b" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Tweeter Atas */}
          <mesh position={[0, 0.88, 0.252]}>
            <circleGeometry args={[0.075, 14]} />
            <meshStandardMaterial color="#383431" roughness={0.55} />
          </mesh>
        </group>
      ))}

      {/* ==================================================================== */}
      {/* 2. LAMPU NEON DINGIN & MESIN MINUMAN BERCAHAYA KIOS 24 JAM HARMONI   */}
      {/* ==================================================================== */}
      {/* Papan Neon Vertikal 2 Sisi "24 JAM · HARMONI" Menonjol di Sudut Fasad Kanan */}
      <group position={[31.55, 3.15, 17.52]}>
        {/* Braket Besi Penopang ke Dinding */}
        <mesh position={[-0.28, 0.62, 0]}>
          <boxGeometry args={[0.42, 0.08, 0.08]} />
          <meshStandardMaterial color="#2d3748" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[-0.28, -0.62, 0]}>
          <boxGeometry args={[0.42, 0.08, 0.08]} />
          <meshStandardMaterial color="#2d3748" metalness={0.65} roughness={0.35} />
        </mesh>
        {/* Kotak Lampu Neon Vertikal */}
        <mesh castShadow>
          <boxGeometry args={[0.14, 1.95, 0.72]} />
          <meshStandardMaterial color="#132a25" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.37]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.66, 1.86]} />
          <meshStandardMaterial
            map={kiosSigns.vertical}
            emissiveMap={kiosSigns.vertical}
            emissive="#ffffff"
            emissiveIntensity={isDarkNight ? 1.55 : isEveningOrNight ? 1.15 : 0.22}
          />
        </mesh>
        <mesh position={[0, 0, 0.37]}>
          <planeGeometry args={[0.66, 1.86]} />
          <meshStandardMaterial
            map={kiosSigns.vertical}
            emissiveMap={kiosSigns.vertical}
            emissive="#ffffff"
            emissiveIntensity={isDarkNight ? 1.55 : isEveningOrNight ? 1.15 : 0.22}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0.12, 0, 0]} scale={[2.4, 3.2, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#5eead4"
              transparent
              opacity={isDarkNight ? 0.52 : 0.34}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
      </group>

      {/* Papan Neon Etalase Kaca Kiri & Kanan ("BUKA 24 JAM" & "KOPI & ES KRIM") */}
      <mesh position={[20.15, 2.95, 17.86]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.1, 0.68]} />
        <meshStandardMaterial
          map={kiosSigns.open24}
          emissiveMap={kiosSigns.open24}
          emissive="#ffffff"
          emissiveIntensity={isDarkNight ? 1.45 : isEveningOrNight ? 1.05 : 0.25}
        />
      </mesh>
      <mesh position={[28.85, 2.95, 17.86]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.1, 0.68]} />
        <meshStandardMaterial
          map={kiosSigns.freshDrink}
          emissiveMap={kiosSigns.freshDrink}
          emissive="#ffffff"
          emissiveIntensity={isDarkNight ? 1.45 : isEveningOrNight ? 1.05 : 0.25}
        />
      </mesh>

      {/* Strip LED Biru-Dingin Etalase Depan Kios 24 Jam */}
      {[20.15, 28.85].map((kx, ki) => (
        <mesh key={`kstrip-${ki}`} position={[kx, 3.5, 17.64]}>
          <boxGeometry args={[4.75, 0.06, 0.06]} />
          <meshStandardMaterial
            color="#e0f7ff"
            emissive="#38bdf8"
            emissiveIntensity={isDarkNight ? 2.6 : isEveningOrNight ? 1.7 : 0.3}
          />
        </mesh>
      ))}

      {/* Mesin Minuman Kaleng Dingin Bercahaya di Teras Kanan Kios Harmoni ([28.9, 0, 16.95]) */}
      <group position={[28.9, 0, 16.95]}>
        {/* Badan Mesin Chiller Putih-Toska */}
        <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 2.04, 0.78]} />
          <meshStandardMaterial color="#e8f1f5" roughness={0.35} metalness={0.22} />
        </mesh>
        {/* Lis Sisi Toska Harmoni */}
        <mesh position={[0, 1.92, -0.395]}>
          <boxGeometry args={[1.16, 0.22, 0.03]} />
          <meshStandardMaterial
            color="#1d806c"
            emissive="#2dd4bf"
            emissiveIntensity={isEveningOrNight ? 0.95 : 0.15}
          />
        </mesh>
        {/* Etalase Kaca Bercahaya Biru Dingin */}
        <mesh position={[-0.14, 1.24, -0.396]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.74, 1.06]} />
          <meshStandardMaterial
            color="#d8f4ff"
            emissive="#7dd3fc"
            emissiveIntensity={isDarkNight ? 1.45 : isEveningOrNight ? 1.15 : 0.45}
            roughness={0.14}
          />
        </mesh>
        {/* 4 Baris Kaleng Minuman Dingin Warna-Warni */}
        {[1.58, 1.36, 1.14, 0.92].map((ry, ri) => (
          <mesh key={`vrow-${ri}`} position={[-0.14, ry, -0.405]}>
            <boxGeometry args={[0.64, 0.12, 0.03]} />
            <meshStandardMaterial
              color={['#f43f5e', '#3b82f6', '#22c55e', '#f59e0b'][ri]}
              roughness={0.35}
            />
          </mesh>
        ))}
        {/* Panel Tombol Pilihan Bercahaya di Kanan + Lubang Ambil Bawah */}
        <mesh position={[0.38, 1.22, -0.4]}>
          <boxGeometry args={[0.2, 0.62, 0.03]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#38bdf8"
            emissiveIntensity={isEveningOrNight ? 0.8 : 0.2}
          />
        </mesh>
        <mesh position={[-0.08, 0.36, -0.398]}>
          <boxGeometry args={[0.82, 0.26, 0.04]} />
          <meshStandardMaterial color="#18202b" roughness={0.6} />
        </mesh>
        {/* Pendaran Biru-Dingin ke Trotoar Malam */}
        {isEveningOrNight && (
          <pointLight
            position={[0, 1.35, -0.95]}
            color="#a5e8ff"
            intensity={isDarkNight ? 6.5 : 3.8}
            distance={8.5}
            decay={1.8}
          />
        )}
      </group>

      {/* Pendaran Tambahan Lemari Es Minuman Dalam Kios Harmoni */}
      {isEveningOrNight && (
        <pointLight position={[24.5, 1.85, 25.8]} color="#b8ecff" intensity={7.5} distance={10} decay={1.8} />
      )}
    </group>
  );
};
