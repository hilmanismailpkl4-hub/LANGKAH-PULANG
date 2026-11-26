import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface ParkJasukeWaterAndWayfinderProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const BANG_RONI_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Bang Roni',
  role: 'Penjual Jasuke & Jagung Bakar Taman Kota',
  accentColor: '#facc15',
  voice: { pitch: 0.98, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#b91c1c',
    pantsColor: '#1f2937',
    skinColor: '#ca9871',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

const GARDEN_LAMP_POSITIONS: [number, number, number][] = [
  [-59.2, 0, -11.5],
  [-59.2, 0, -19.2],
  [-63.2, 0, -12.6],
  [-63.2, 0, 18.8],
  [-63.4, 0, 23.6],
  [-71.6, 0, 14.8],
];

interface WayfinderBlade {
  label: string;
  sub: string;
  arrow: 'left' | 'right';
  rotY: number;
  y: number;
  accent: string;
}

const WAYFINDER_BLADES: WayfinderBlade[] = [
  { label: 'DANAU SENJA', sub: '38 m · Dermaga & Teratai', arrow: 'left', rotY: -0.68, y: 2.48, accent: '#38bdf8' },
  { label: 'TOKO MUSIK NADA LAMA', sub: '55 m · Seberang Jembatan', arrow: 'right', rotY: 0.72, y: 2.16, accent: '#fbbf24' },
  { label: 'STASIUN SENJA', sub: '140 m · Jl. Kenangan Timur', arrow: 'right', rotY: 0.08, y: 1.84, accent: '#4ade80' },
  { label: 'JASUKE & TAMAN BERMAIN', sub: '15 m · Gazebo & Kuliner', arrow: 'left', rotY: -0.18, y: 1.52, accent: '#fb923c' },
];

function createJasukeBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#991b1b');
  grad.addColorStop(0.5, '#b91c1c');
  grad.addColorStop(1, '#dc2626');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JASUKE & JAGUNG BAKAR', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('BANG RONI · TEPI TAMAN KOTA SENJA', 320, 96);

  ctx.fillStyle = '#991b1b';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KEJU PARUT · SUSU KENTAL · MENTEGA · PEDAS MANIS BARA ARANG', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createDrinkingWaterSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 192;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0f3c5c';
  ctx.fillRect(0, 0, 384, 192);
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 368, 176);

  // Ikon tetes air biru cerah
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(56, 48);
  ctx.bezierCurveTo(32, 92, 32, 134, 56, 134);
  ctx.bezierCurveTo(80, 134, 80, 92, 56, 48);
  ctx.fill();

  ctx.fillStyle = '#e0f2fe';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('AIR SIAP MINUM', 100, 66);

  ctx.fillStyle = '#7dd3fc';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('TAMAN KOTA SENJA', 100, 108);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillText('Segar & Terfilter · Tekan [E]', 100, 146);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createWayfinderBladeTexture(label: string, sub: string, arrow: 'left' | 'right', accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 112;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#3f2a1d';
  ctx.fillRect(0, 0, 512, 112);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 100);

  ctx.fillStyle = '#fff8eb';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(arrow === 'left' ? `◀  ${label}` : `${label}  ▶`, 256, 42);

  ctx.fillStyle = accent;
  ctx.font = '600 18px sans-serif';
  ctx.fillText(sub, 256, 80);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 3 — Kehangatan Kaki Lima & Taman Kota:
 * 1. Gerobak Jasuke & Jagung Bakar Sore Bang Roni ([-74.2, 0, 16.4]) di Tepi Taman Kota
 * 2. Pos Air Minum Taman ([-58.4, 0, -13.2]) & 2 Bangku Batu Alami Tepi Sungai ([-57.8, 0, -15.4] & [-57.8, 0, -17.6])
 * 3. Tiang Penunjuk Arah Kayu Interaktif ([-63.2, 0, 14.4]) & Rangkaian 6 Lampu Taman Hias Jalur Pejalan Kaki
 */
export const ParkJasukeWaterAndWayfinder: React.FC<ParkJasukeWaterAndWayfinderProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const jasukeBannerTex = useMemo(() => createJasukeBannerTexture(), []);
  const waterSignTex = useMemo(() => createDrinkingWaterSignTexture(), []);
  const wayfinderTextures = useMemo(
    () => WAYFINDER_BLADES.map((b) => createWayfinderBladeTexture(b.label, b.sub, b.arrow, b.accent)),
    [],
  );

  useEffect(() => {
    return () => {
      jasukeBannerTex.dispose();
      waterSignTex.dispose();
      wayfinderTextures.forEach((t) => t.dispose());
    };
  }, [jasukeBannerTex, waterSignTex, wayfinderTextures]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const roniHeadRef = useRef<THREE.Group>(null);
  const roniRightArmRef = useRef<THREE.Group>(null);
  const emberMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const grillSmokeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const fountainDropRefs = useRef<(THREE.Mesh | null)[]>([]);
  const fountainRippleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Gerobak Jasuke & Jagung Bakar Bang Roni (bara arang berdenyut, kipas bambu & asap tipis)
    if (!shouldSkipPerfFrame(-74.2, 16.4, 48)) {
      const distRoni = py > 4 ? 99 : Math.hypot(px - -74.2, pz - 16.4);
      if (roniHeadRef.current) {
        roniHeadRef.current.rotation.y = Math.sin(t * 0.95) * 0.22;
      }
      if (roniRightArmRef.current) {
        // Saat Damar dekat menyapa hangat, saat jauh mengipas bara arang jagung bakar!
        roniRightArmRef.current.rotation.x =
          distRoni < 5.0
            ? -1.6 + Math.sin(t * 5.0) * 0.22
            : -0.82 + Math.sin(t * 5.8) * 0.24;
      }
      if (emberMatRef.current) {
        emberMatRef.current.emissiveIntensity = (isEveningOrNight ? 2.1 : 1.25) + Math.sin(t * 4.2) * 0.35;
      }
      if (!playerRuntime.perf.isPotato) {
        for (let i = 0; i < 4; i++) {
          const m = grillSmokeRefs.current[i];
          if (!m) continue;
          const p = ((t * 0.42 + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * 0.62;
          m.position.x = Math.sin(t * 1.7 + i * 2.1) * 0.075 * p;
          m.position.z = Math.cos(t * 1.3 + i * 1.6) * 0.055 * p;
          const s = 0.55 + p * 1.35;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.26;
        }
      }
    }

    // 2. Animasi Pancuran Air Siap Minum Taman (mengalir lengkung jernih saat ditekan [E])
    if (playerRuntime.fountainDrinkTimer > 0) {
      playerRuntime.fountainDrinkTimer = Math.max(0, playerRuntime.fountainDrinkTimer - dt);
    }
    if (!shouldSkipPerfFrame(-58.4, -13.2, 42)) {
      const activeSpray = playerRuntime.fountainDrinkTimer > 0;
      for (let i = 0; i < 6; i++) {
        const drop = fountainDropRefs.current[i];
        if (!drop) continue;
        drop.visible = activeSpray;
        if (!activeSpray) continue;
        const u = ((t * 2.3 + i / 6) % 1 + 1) % 1;
        // Lengkungan parabolik dari cerat krom ke tengah bak stainless
        drop.position.set(
          -0.11 + u * 0.16,
          1.06 + Math.sin(u * Math.PI) * 0.16,
          0,
        );
        const sc = 0.75 + Math.sin(u * Math.PI) * 0.4;
        drop.scale.set(sc, sc, sc);
      }
      if (fountainRippleRef.current) {
        fountainRippleRef.current.visible = activeSpray;
        if (activeSpray) {
          const rp = ((t * 1.9) % 1 + 1) % 1;
          const s = 0.4 + rp * 1.45;
          fountainRippleRef.current.scale.set(s, s, 1);
          (fountainRippleRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - rp) * 0.55;
        }
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK JASUKE & JAGUNG BAKAR SORE BANG RONI ([-74.2, 0, 16.4])   */}
      {/* ==================================================================== */}
      <group position={[-74.2, 0, 16.4]}>
        {/* Badan Gerobak Kayu-Besi Merah Kuning */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.72} />
        </mesh>
        {/* Meja Counter Stainless & Lis Kuning Hangat */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.55} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[1.98, 0.08, 0.86]} />
          <meshStandardMaterial color="#4a3121" roughness={0.84} />
        </mesh>

        {/* 2 Roda Karet Gerobak di Sisi Kiri & Kanan + Kaki Penopang */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`jw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#facc15" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "JASUKE & JAGUNG BAKAR · BANG RONI" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={jasukeBannerTex}
            emissiveMap={jasukeBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.12}
          />
        </mesh>

        {/* TUNGKU BARA ARANG JAGUNG BAKAR (Sisi Kiri Counter) */}
        <group position={[-0.52, 1.12, 0.04]}>
          {/* Bak Besi Tungku Arang */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <boxGeometry args={[0.84, 0.14, 0.44]} />
            <meshStandardMaterial color="#27272a" metalness={0.5} roughness={0.62} />
          </mesh>
          {/* Hamparan Bara Arang Menyala Kemerahan */}
          <mesh position={[0, 0.125, 0]}>
            <boxGeometry args={[0.74, 0.03, 0.34]} />
            <meshStandardMaterial
              ref={emberMatRef}
              color="#7c2d12"
              emissive="#ff5412"
              emissiveIntensity={isEveningOrNight ? 2.1 : 1.25}
              roughness={0.85}
            />
          </mesh>
          {/* 4 Tongkol Jagung Bakar Keemasan di Atas Kisi Pemanggang */}
          {[-0.25, -0.08, 0.09, 0.26].map((cx, ci) => (
            <group key={`corn-${ci}`} position={[cx, 0.185, 0]} rotation={[Math.PI / 2, 0, (ci % 2 === 0 ? 0.08 : -0.06)]}>
              <mesh castShadow>
                <capsuleGeometry args={[0.036, 0.18, 6, 10]} />
                <meshStandardMaterial color={ci % 2 === 0 ? '#eab308' : '#d97706'} roughness={0.55} />
              </mesh>
              {/* Tusuk Kayu Jagung */}
              <mesh position={[0, 0.16, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.12, 6]} />
                <meshStandardMaterial color="#d6b27d" roughness={0.85} />
              </mesh>
            </group>
          ))}
          {/* Asap Tipis Aroma Mentega & Bara Arang */}
          <group position={[0, 0.24, 0]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`gsm-${si}`}
                ref={(el) => {
                  grillSmokeRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.065, 8, 8]} />
                <meshBasicMaterial color="#fff3dc" transparent opacity={0.2} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* DANDANG JAGUNG MANIS PIPIL + TOPLES KEJU PARUT, SKM & CUP JASUKE (Sisi Kanan Counter) */}
        <group position={[0.48, 1.09, 0.04]}>
          {/* Dandang Stainless Jagung Pipil Kukus */}
          <mesh position={[-0.22, 0.14, -0.06]} castShadow>
            <cylinderGeometry args={[0.16, 0.15, 0.28, 14]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.72} roughness={0.25} />
          </mesh>
          <mesh position={[-0.22, 0.285, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.14, 12]} />
            <meshStandardMaterial color="#facc15" roughness={0.5} />
          </mesh>
          {/* Toples Kaca Keju Parut & Mesis Cokelat */}
          <mesh position={[0.12, 0.11, -0.08]} castShadow>
            <cylinderGeometry args={[0.085, 0.085, 0.2, 12]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.35} />
          </mesh>
          <mesh position={[0.12, 0.22, -0.08]}>
            <cylinderGeometry args={[0.088, 0.088, 0.03, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.45} />
          </mesh>
          {/* Kaleng Susu Kental Manis & Mangkuk Mentega */}
          <mesh position={[0.31, 0.08, -0.04]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.14, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0.08, 0.06, 0.14]} castShadow>
            <cylinderGeometry args={[0.075, 0.06, 0.09, 10]} />
            <meshStandardMaterial color="#fde047" roughness={0.4} />
          </mesh>
          {/* Tumpukan Cup Kertas Jasuke Kuning */}
          <mesh position={[0.32, 0.12, 0.14]} castShadow>
            <cylinderGeometry args={[0.055, 0.045, 0.22, 12]} />
            <meshStandardMaterial color="#fef08a" roughness={0.6} />
          </mesh>
        </group>

        {/* Payung Kanopi Merah-Kuning Teduh (Melindungi dari Hujan!) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.68, 0.44, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.65} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.69, 0.44, 5]} />
          <meshStandardMaterial color="#eab308" roughness={0.65} />
        </mesh>

        {/* Bohlam Kuning Hangat Gerobak Sore-Malam */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.072, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffbf59"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.22]} scale={[1.7, 1.7, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc76b"
              transparent
              opacity={isDarkNight ? 0.62 : 0.46}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Bang Roni Berdiri Ramah Mengipas Bara di Belakang Gerobak */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={BANG_RONI_PROFILE}
            headRef={roniHeadRef}
            rightArmRef={roniRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak ([-74.2, 0, 18.25]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`jb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. POS AIR MINUM TAMAN & 2 BANGKU BATU ALAMI TEPI SUNGAI             */}
      {/* ==================================================================== */}
      {/* 2A. Pos Air Minum Siap Minum Taman Kota ([-58.4, 0, -13.2]) */}
      <group position={[-58.4, 0, -13.2]}>
        {/* Landasan Batu Bulat & Kisi Drainase */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <cylinderGeometry args={[0.62, 0.66, 0.05, 16]} />
          <meshStandardMaterial color="#6b7280" roughness={0.9} />
        </mesh>
        {/* Pedestal Batu Andesit & Aksen Kayu Jati Modern */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.31, 0.88, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.52, 0.24]} castShadow>
          <boxGeometry args={[0.24, 0.72, 0.06]} />
          <meshStandardMaterial color="#7c5032" roughness={0.78} />
        </mesh>
        {/* Bak Cekung Stainless Steel Air Minum */}
        <mesh position={[0, 0.94, 0]} castShadow>
          <cylinderGeometry args={[0.31, 0.24, 0.12, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.22} />
        </mesh>
        <mesh position={[0, 1.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.28} />
        </mesh>
        {/* Cerat Keran Krom Melengkung + Tombol Tekan Biru */}
        <mesh position={[-0.16, 1.05, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.026, 0.12, 10]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.16} />
        </mesh>
        <mesh position={[-0.12, 1.09, 0]} rotation={[0, 0, -0.7]}>
          <cylinderGeometry args={[0.015, 0.018, 0.09, 8]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.24, 0.96, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.06, 10]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Papan Info Mini "AIR SIAP MINUM · TAMAN KOTA SENJA" */}
        <group position={[0, 1.38, -0.22]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.56, 0.28, 0.035]} />
            <meshStandardMaterial color="#0f3c5c" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[0.52, 0.25]} />
            <meshStandardMaterial
              map={waterSignTex}
              emissiveMap={waterSignTex}
              emissive="#bae6fd"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
            />
          </mesh>
        </group>

        {/* Pancuran Air Melengkung Berkilau & Riak Bak saat Ditekan [E] */}
        {[0, 1, 2, 3, 4, 5].map((di) => (
          <mesh
            key={`fdrop-${di}`}
            ref={(el) => {
              fountainDropRefs.current[di] = el;
            }}
            visible={false}
          >
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#bae6fd" emissive="#7dd3fc" emissiveIntensity={0.65} transparent opacity={0.88} roughness={0.1} />
          </mesh>
        ))}
        <mesh
          ref={fountainRippleRef}
          position={[0.05, 1.012, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <ringGeometry args={[0.035, 0.055, 14]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      </group>

      {/* 2B. Deretan 2 Bangku Batu Alami Menghadap Sungai Kota ([-57.8, 0, -15.4] & [-57.8, 0, -17.6]) */}
      {[-15.4, -17.6].map((bz, bi) => (
        <group key={`sbench-${bi}`} position={[-57.8, 0, bz]}>
          {/* Alas Pijakan Batu Pipih */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[1.05, 0.04, 1.85]} />
            <meshStandardMaterial color="#78716c" roughness={0.92} />
          </mesh>
          {/* Dudukan Batu Andesit Tebal Alami */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.56, 0.14, 1.58]} />
            <meshStandardMaterial color="#94928c" roughness={0.86} />
          </mesh>
          {/* 2 Kaki Balok Batu Pahat */}
          {[-0.52, 0.52].map((lz, li) => (
            <mesh key={`sleg-${bi}-${li}`} position={[0, 0.21, lz]} castShadow receiveShadow>
              <boxGeometry args={[0.46, 0.36, 0.26]} />
              <meshStandardMaterial color="#686662" roughness={0.9} />
            </mesh>
          ))}
          {/* Batu Kali Hias & Rumpun Pakis Kecil di Ujung Bangku */}
          <mesh position={[-0.36, 0.14, bi === 0 ? 0.88 : -0.88]} castShadow>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#73716b" roughness={0.94} />
          </mesh>
          <mesh position={[-0.4, 0.22, bi === 0 ? 0.68 : -0.68]} castShadow>
            <icosahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color="#3f7a44" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ==================================================================== */}
      {/* 3. TIANG PENUNJUK ARAH KAYU & 6 LAMPU TAMAN HIAS JALUR PEJALAN KAKI  */}
      {/* ==================================================================== */}
      {/* 3A. Tiang Penunjuk Arah Kayu Interaktif Taman Kota ([-63.2, 0, 14.4]) */}
      <group position={[-63.2, 0, 14.4]}>
        {/* Bak Batu Melingkar & Semak Rendah di Dasar Tiang */}
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.44, 0.32, 12]} />
          <meshStandardMaterial color="#6b7075" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.32, 0.34, 0.08, 10]} />
          <meshStandardMaterial color="#3f7344" roughness={0.88} />
        </mesh>
        {/* Tiang Kayu Jati Ukir */}
        <mesh position={[0, 1.56, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.085, 0.11, 2.86, 10]} />
          <meshStandardMaterial color="#593c26" roughness={0.82} />
        </mesh>

        {/* 4 Papan Panah Penunjuk Arah Destinasi Kota */}
        {WAYFINDER_BLADES.map((blade, idx) => (
          <group key={`wf-${idx}`} position={[0, blade.y, 0]} rotation={[0, blade.rotY, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.66, 0.3, 0.06]} />
              <meshStandardMaterial color="#422c1d" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0, 0.034]}>
              <planeGeometry args={[1.58, 0.27]} />
              <meshStandardMaterial
                map={wayfinderTextures[idx]}
                emissiveMap={wayfinderTextures[idx]}
                emissive="#ffe3b3"
                emissiveIntensity={isEveningOrNight ? 0.42 : 0.05}
              />
            </mesh>
            <mesh position={[0, 0, -0.034]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.58, 0.27]} />
              <meshStandardMaterial
                map={wayfinderTextures[idx]}
                emissiveMap={wayfinderTextures[idx]}
                emissive="#ffe3b3"
                emissiveIntensity={isEveningOrNight ? 0.42 : 0.05}
              />
            </mesh>
          </group>
        ))}

        {/* Lentera Klasik Hangat di Puncak Tiang Penunjuk Arah */}
        <mesh position={[0, 3.08, 0]}>
          <cylinderGeometry args={[0.14, 0.11, 0.26, 6]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff2c2' : '#d1d8e0'}
            emissive={isEveningOrNight ? '#ffb952' : '#000000'}
            emissiveIntensity={isEveningOrNight ? 2.5 : 0}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, 3.28, 0]} castShadow>
          <coneGeometry args={[0.21, 0.16, 6]} />
          <meshStandardMaterial color="#2c241d" roughness={0.7} />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 3.08, 0]} scale={[2.1, 2.1, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc76b"
              transparent
              opacity={isDarkNight ? 0.65 : 0.45}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
      </group>

      {/* 3B. Rangkaian 6 Lampu Taman Hias Hangat Sepanjang Jalur Pejalan Kaki */}
      {GARDEN_LAMP_POSITIONS.map(([lx, ly, lz], idx) => (
        <group key={`glamp-${idx}`} position={[lx, ly, lz]} rotation={[0, idx * 0.65, 0]}>
          {/* Umpak Besi Tempa & Tiang Ramping */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.15, 0.28, 8]} />
            <meshStandardMaterial color="#1f2937" metalness={0.58} roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.042, 0.062, 1.95, 8]} />
            <meshStandardMaterial color="#1e242c" metalness={0.62} roughness={0.4} />
          </mesh>
          {/* Ornamen Sayap Lengkung Perunggu Antik di Leher Lampu */}
          {[-0.14, 0.14].map((sx, si) => (
            <mesh
              key={`orn-${idx}-${si}`}
              position={[sx, 1.92, 0]}
              rotation={[0, 0, si === 0 ? 0.42 : -0.42]}
            >
              <boxGeometry args={[0.22, 0.045, 0.03]} />
              <meshStandardMaterial color="#b48a46" metalness={0.65} roughness={0.35} />
            </mesh>
          ))}
          {/* Lentera Kaca Frosted Hangat */}
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.125, 0.09, 0.26, 8]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fff3cc' : '#dce4ec'}
              emissive={isEveningOrNight ? '#ffba52' : '#000000'}
              emissiveIntensity={isEveningOrNight ? (isDarkNight ? 2.7 : 2.1) : 0}
              roughness={0.26}
            />
          </mesh>
          {/* Topi Lentera Klasik */}
          <mesh position={[0, 2.38, 0]} castShadow>
            <coneGeometry args={[0.19, 0.14, 8]} />
            <meshStandardMaterial color="#1f2937" metalness={0.55} roughness={0.45} />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && (
            <sprite position={[0, 2.2, 0]} scale={[1.85, 1.85, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffc970"
                transparent
                opacity={isDarkNight ? 0.56 : 0.38}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      ))}
    </group>
  );
};
