import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface StationWarkopBirdsAndMusicBenchProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MANG_DADANG_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mang Dadang',
  role: 'Penjual Warkop & Kue Pasar Stasiun',
  accentColor: '#f59e0b',
  voice: { pitch: 0.94, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#15803d',
    pantsColor: '#272c36',
    skinColor: '#c99770',
    hairColor: '#2d2825',
    accentProp: 'apron',
  },
};

function createWarkopBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(0.5, '#166534');
  grad.addColorStop(1, '#15803d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WARKOP & KUE PASAR', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('MANG DADANG · GERBANG STASIUN SENJA', 320, 96);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KOPI TUBRUK · TEH TARIK · KLEPON · KUE LUMPUR · LEMPER', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createMusicPostersTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 384;
  const ctx = c.getContext('2d')!;

  // Papan kayu tua hangat
  ctx.fillStyle = '#4a3222';
  ctx.fillRect(0, 0, 512, 384);
  ctx.strokeStyle = '#2d1c12';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 374);

  // 4 Poster Konser Akustik & Kaset Indie Klasik Tertempel Rapi
  const posters = [
    {
      x: 24,
      y: 22,
      w: 220,
      h: 162,
      bg: '#fef3c7',
      accent: '#b45309',
      title: "SENJA AKUSTIK '98",
      sub: 'Live Gazebo Taman Kota',
      note: 'Gitar · Kaset · Kopi',
    },
    {
      x: 266,
      y: 26,
      w: 222,
      h: 158,
      bg: '#1e293b',
      accent: '#38bdf8',
      title: 'MALAM KASET LAMA',
      sub: 'Toko Musik Nada Lama',
      note: 'Piringan Hitam & Indie',
    },
    {
      x: 28,
      y: 202,
      w: 218,
      h: 158,
      bg: '#ffe4e6',
      accent: '#be123c',
      title: 'GIG TEPI DANAU',
      sub: 'Sabtu Senja · Gratis',
      note: 'Bawa Gitar & Teman!',
    },
    {
      x: 264,
      y: 200,
      w: 224,
      h: 160,
      bg: '#dcfce7',
      accent: '#15803d',
      title: 'KELAS GITAR SORE',
      sub: 'Bersama Bang Ari',
      note: 'Pemula & Akustik Santai',
    },
  ];

  posters.forEach((p) => {
    ctx.fillStyle = p.bg;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(p.x + 6, p.y + 6, p.w - 12, p.h - 12);

    // Paku pin kecil di atas poster
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + 12, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.bg === '#1e293b' ? '#f8fafc' : '#1f2937';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.title, p.x + p.w / 2, p.y + 56);

    ctx.fillStyle = p.accent;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(p.sub, p.x + p.w / 2, p.y + 98);

    ctx.fillStyle = p.bg === '#1e293b' ? '#cbd5e1' : '#475569';
    ctx.font = 'italic 13px Georgia, serif';
    ctx.fillText(p.note, p.x + p.w / 2, p.y + 132);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 3 — Hangatnya Sudut Stasiun & Perumahan:
 * 1. Warung Kopi Tubruk & Kue Pasar Mang Dadang ([71.6, 0, -10.8]) di Gerbang Barat Stasiun Senja
 * 2. 2 Sangkar Burung Kicau Gantung Teras Tetangga Jl. Melati ([-2.4, 0, 64.9] & [1.8, 0, 64.9])
 * 3. Sudut Bangku Pohon Teduh & Papan Poster Konser Klasik Samping Toko Musik Nada Lama ([-12.2, 0, -24.6])
 */
export const StationWarkopBirdsAndMusicBench: React.FC<StationWarkopBirdsAndMusicBenchProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const warkopBannerTex = useMemo(() => createWarkopBannerTexture(), []);
  const musicPostersTex = useMemo(() => createMusicPostersTexture(), []);

  useEffect(() => {
    return () => {
      warkopBannerTex.dispose();
      musicPostersTex.dispose();
    };
  }, [warkopBannerTex, musicPostersTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';
  const isRain = timeOfDay === 'rain_dusk';

  const dadangHeadRef = useRef<THREE.Group>(null);
  const dadangRightArmRef = useRef<THREE.Group>(null);
  const kettleSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  const cageLeftRef = useRef<THREE.Group>(null);
  const cageRightRef = useRef<THREE.Group>(null);
  const canaryBirdRef = useRef<THREE.Group>(null);
  const greenBirdRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi Mang Dadang Warkop Stasiun & Uap Teko Kopi Tubruk
    if (!shouldSkipPerfFrame(71.6, -10.8, 46)) {
      const distDadang = py > 4 ? 99 : Math.hypot(px - 71.6, pz - -10.8);
      if (dadangHeadRef.current) {
        dadangHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.24;
      }
      if (dadangRightArmRef.current) {
        dadangRightArmRef.current.rotation.x =
          distDadang < 5.5
            ? -1.55 + Math.sin(t * 5.2) * 0.22
            : -0.78 + Math.sin(t * 2.4) * 0.14;
      }
      if (!playerRuntime.perf.isPotato) {
        for (let i = 0; i < 3; i++) {
          const m = kettleSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * 0.55 + i * 0.33) % 1 + 1) % 1;
          m.position.y = p * 0.42;
          m.position.x = Math.sin(t * 2.0 + i * 1.9) * 0.045 * p;
          const s = 0.5 + p * 1.1;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.28;
        }
      }
    }

    // 2. Animasi 2 Sangkar Burung Gantung Mengayun Pelan & Burung Kenari Melompat Berkicau
    if (playerRuntime.birdcageChirpTimer > 0) {
      playerRuntime.birdcageChirpTimer = Math.max(0, playerRuntime.birdcageChirpTimer - dt);
    }
    if (!shouldSkipPerfFrame(-0.3, 64.9, 44)) {
      const windAmp = isRain ? 0.08 : 0.032;
      const chirping = playerRuntime.birdcageChirpTimer > 0;
      if (cageLeftRef.current) {
        cageLeftRef.current.rotation.z = Math.sin(t * 1.4) * windAmp;
      }
      if (cageRightRef.current) {
        cageRightRef.current.rotation.z = Math.cos(t * 1.25 + 0.9) * windAmp;
      }
      if (canaryBirdRef.current) {
        const hopFreq = chirping ? 8.5 : 2.1;
        const hopY = Math.abs(Math.sin(t * hopFreq)) * (chirping ? 0.055 : 0.018);
        canaryBirdRef.current.position.y = -0.26 + hopY;
        canaryBirdRef.current.rotation.y = Math.sin(t * (chirping ? 5.0 : 1.3)) * 0.65;
      }
      if (greenBirdRef.current) {
        const hopFreq = chirping ? 7.2 : 1.7;
        const hopY = Math.abs(Math.sin(t * hopFreq + 1.2)) * (chirping ? 0.048 : 0.014);
        greenBirdRef.current.position.y = -0.27 + hopY;
        greenBirdRef.current.rotation.y = Math.cos(t * (chirping ? 4.4 : 1.1)) * 0.55;
      }
    }
  });

  const bambooBarAngles = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), []);

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. WARKOP & KUE PASAR MANG DADANG ([71.6, 0, -10.8])                 */}
      {/* ==================================================================== */}
      <group position={[71.6, 0, -10.8]}>
        {/* Meja Counter Kayu Hijau-Oranye Warkop Stasiun */}
        <mesh position={[0, 0.54, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.04, 1.0, 0.96]} />
          <meshStandardMaterial color="#166534" roughness={0.74} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[2.14, 0.07, 1.06]} />
          <meshStandardMaterial color="#a67443" roughness={0.68} />
        </mesh>

        {/* Spanduk Depan "WARKOP & KUE PASAR · MANG DADANG" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.92, 0.56]} />
          <meshStandardMaterial
            map={warkopBannerTex}
            emissiveMap={warkopBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
          />
        </mesh>

        {/* Etalase Kaca Kue Pasar (Klepon Hijau, Kue Lumpur Kuning, Lemper & Pastel) */}
        <group position={[0.42, 1.28, 0.12]}>
          <mesh castShadow>
            <boxGeometry args={[0.92, 0.36, 0.44]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.38} roughness={0.14} />
          </mesh>
          {/* Nampan Daun Pisang & Kue Pasar Warna-Warni */}
          <mesh position={[-0.26, -0.14, 0]}>
            <cylinderGeometry args={[0.14, 0.12, 0.02, 12]} />
            <meshStandardMaterial color="#2f6f3e" roughness={0.78} />
          </mesh>
          {[-0.31, -0.24, -0.21].map((kx, ki) => (
            <mesh key={`klp-${ki}`} position={[kx, -0.1, (ki - 1) * 0.05]}>
              <sphereGeometry args={[0.036, 8, 8]} />
              <meshStandardMaterial color="#4ade80" roughness={0.65} />
            </mesh>
          ))}
          {/* Kue Lumpur Kuning */}
          {[0.02, 0.12].map((lx, li) => (
            <mesh key={`klm-${li}`} position={[lx, -0.11, 0.02]}>
              <cylinderGeometry args={[0.044, 0.042, 0.032, 10]} />
              <meshStandardMaterial color="#facc15" roughness={0.55} />
            </mesh>
          ))}
          {/* Lemper Daun Pisang */}
          {[0.28, 0.34].map((rx, ri) => (
            <mesh key={`lmp-${ri}`} position={[rx, -0.11, -0.02 + ri * 0.06]} rotation={[0, 0.2, Math.PI / 2]}>
              <capsuleGeometry args={[0.022, 0.08, 5, 8]} />
              <meshStandardMaterial color="#4d7c0f" roughness={0.78} />
            </mesh>
          ))}
        </group>

        {/* Termos Air Panas Besar Stainless + Teko Kopi Tubruk Mengepul */}
        <mesh position={[-0.64, 1.32, -0.06]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.46, 14]} />
          <meshStandardMaterial color="#dc2626" roughness={0.38} metalness={0.3} />
        </mesh>
        <mesh position={[-0.64, 1.58, -0.06]}>
          <cylinderGeometry args={[0.09, 0.12, 0.08, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[-0.32, 1.2, 0.06]} castShadow>
          <cylinderGeometry args={[0.095, 0.11, 0.22, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.22} />
        </mesh>
        <group position={[-0.32, 1.34, 0.06]}>
          {[0, 1, 2].map((si) => (
            <mesh
              key={`kst-${si}`}
              ref={(el) => {
                kettleSteamRefs.current[si] = el;
              }}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#fff9ed" transparent opacity={0.2} depthWrite={false} />
            </mesh>
          ))}
        </group>

        {/* Gantungan Renceng Sachet Kopi & Teh di Atas Counter */}
        <mesh position={[-0.95, 1.68, -0.32]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.32, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[0.95, 1.68, -0.32]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.32, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh position={[0, 2.28, -0.32]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.022, 0.022, 1.94, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.45} />
        </mesh>
        {[-0.65, -0.35, -0.05, 0.25, 0.55].map((sx, si) => (
          <mesh key={`sac-${si}`} position={[sx, 2.02, -0.3]}>
            <boxGeometry args={[0.14, 0.42, 0.025]} />
            <meshStandardMaterial
              color={['#b91c1c', '#f59e0b', '#15803d', '#0284c7', '#78350f'][si]}
              roughness={0.55}
            />
          </mesh>
        ))}

        {/* Payung Kanopi Oranye-Hijau Teduh */}
        <mesh position={[0.05, 1.78, -0.15]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.05, 2.9, -0.15]} castShadow>
          <coneGeometry args={[1.65, 0.44, 10]} />
          <meshStandardMaterial color="#ea580c" roughness={0.68} />
        </mesh>
        <mesh position={[0.05, 2.91, -0.15]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.66, 0.44, 5]} />
          <meshStandardMaterial color="#166534" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Warkop Stasiun */}
        <mesh position={[0, 2.38, 0.16]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.16]} scale={[1.6, 1.6, 1]}>
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

        {/* Mang Dadang Berdiri Ramah di Belakang Warkop */}
        <group position={[0.08, 0, -1.05]}>
          <HumanModel
            profile={MANG_DADANG_PROFILE}
            headRef={dadangHeadRef}
            rightArmRef={dadangRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Warkop */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.48, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5f3a" roughness={0.78} />
          </mesh>
          {[-0.56, 0.56].map((lx, li) => (
            <mesh key={`wbl-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.09, 0.42, 0.36]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. SANGKAR BURUNG KICAU TERAS TETANGGA JL. MELATI                    */}
      {/*    ([-2.4, 0, 64.9] & [1.8, 0, 64.9])                                */}
      {/* ==================================================================== */}
      <group>
        {/* Sangkar Kiri: Sangkar Bambu Kubah Bulat + Burung Kenari Kuning */}
        <group position={[-2.4, 0, 64.9]}>
          {/* Tiang Gantungan Kayu Melengkung + Pot Tanaman Pakis */}
          <mesh position={[0, 1.25, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.048, 2.5, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.84} />
          </mesh>
          <mesh position={[0.22, 2.48, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.52, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.84} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.16, 0.32, 10]} />
            <meshStandardMaterial color="#a85538" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color="#3f7d44" roughness={0.88} />
          </mesh>

          {/* Sangkar Bambu Gantung Mengayun */}
          <group ref={cageLeftRef} position={[0.45, 2.46, 0]}>
            {/* Tali & Kubah Sangkar */}
            <mesh position={[0, -0.09, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.22, 0]} castShadow>
              <sphereGeometry args={[0.21, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#c89d63" roughness={0.78} />
            </mesh>
            {/* 10 Jeruji Bambu Halus */}
            {bambooBarAngles.map((ang, bi) => (
              <mesh key={`bb-${bi}`} position={[Math.cos(ang) * 0.195, -0.44, Math.sin(ang) * 0.195]}>
                <cylinderGeometry args={[0.006, 0.006, 0.44, 5]} />
                <meshStandardMaterial color="#d9b37a" roughness={0.75} />
              </mesh>
            ))}
            {/* Alas Kayu Sangkar & Tangkringan */}
            <mesh position={[0, -0.66, 0]} castShadow>
              <cylinderGeometry args={[0.215, 0.205, 0.075, 14]} />
              <meshStandardMaterial color="#8c5a32" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.009, 0.009, 0.36, 6]} />
              <meshStandardMaterial color="#6e4526" roughness={0.85} />
            </mesh>

            {/* Burung Kenari Kuning Cerah di Atas Tangkringan */}
            <group ref={canaryBirdRef} position={[0, -0.26, 0]}>
              <mesh position={[0, -0.2, 0]} scale={[0.85, 0.9, 1.3]}>
                <sphereGeometry args={[0.044, 10, 8]} />
                <meshStandardMaterial color="#facc15" roughness={0.55} />
              </mesh>
              <mesh position={[0, -0.155, 0.045]}>
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshStandardMaterial color="#fde047" roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.158, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.009, 0.025, 6]} />
                <meshStandardMaterial color="#f97316" roughness={0.5} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Sangkar Kanan: Sangkar Jati Persegi + Burung Cucak Ijo */}
        <group position={[1.8, 0, 64.9]}>
          <mesh position={[0, 1.25, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.048, 2.5, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.84} />
          </mesh>
          <mesh position={[-0.22, 2.48, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.52, 8]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.84} />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.16, 0.32, 10]} />
            <meshStandardMaterial color="#a85538" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color="#2f6f3e" roughness={0.88} />
          </mesh>

          <group ref={cageRightRef} position={[-0.45, 2.46, 0]}>
            <mesh position={[0, -0.09, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
            </mesh>
            {/* Atap Limas Sangkar Jati */}
            <mesh position={[0, -0.22, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[0.26, 0.16, 4]} />
              <meshStandardMaterial color="#6e4124" roughness={0.8} />
            </mesh>
            {/* 4 Tiang Sudut Sangkar */}
            {[
              [-0.17, -0.17],
              [0.17, -0.17],
              [-0.17, 0.17],
              [0.17, 0.17],
            ].map(([cx, cz], ci) => (
              <mesh key={`sc-${ci}`} position={[cx, -0.48, cz]}>
                <boxGeometry args={[0.024, 0.44, 0.024]} />
                <meshStandardMaterial color="#7a4928" roughness={0.78} />
              </mesh>
            ))}
            <mesh position={[0, -0.68, 0]} castShadow>
              <boxGeometry args={[0.38, 0.075, 0.38]} />
              <meshStandardMaterial color="#5e361c" roughness={0.82} />
            </mesh>
            <mesh position={[0, -0.51, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.009, 0.009, 0.34, 6]} />
              <meshStandardMaterial color="#7a4928" roughness={0.82} />
            </mesh>

            {/* Burung Cucak Ijo Mungil */}
            <group ref={greenBirdRef} position={[0, -0.27, 0]}>
              <mesh position={[0, -0.2, 0]} scale={[0.85, 0.9, 1.32]}>
                <sphereGeometry args={[0.045, 10, 8]} />
                <meshStandardMaterial color="#22c55e" roughness={0.55} />
              </mesh>
              <mesh position={[0, -0.155, 0.045]}>
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshStandardMaterial color="#16a34a" roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.158, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.009, 0.024, 6]} />
                <meshStandardMaterial color="#1f2937" roughness={0.45} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. SUDUT BANGKU POHON TEDUH & PAPAN POSTER KONSER NADA LAMA          */}
      {/*    ([-12.2, 0, -24.6], Samping Timur Toko Musik Nada Lama)           */}
      {/* ==================================================================== */}
      <group position={[-12.2, 0, -24.6]}>
        {/* Papan Poster Konser Akustik & Kaset Indie Klasik ([-13.45, 0, -24.6]) */}
        <group position={[-1.25, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {[-0.96, 0.96].map((tx, ti) => (
            <mesh key={`mpp-${ti}`} position={[tx, 1.08, 0]} castShadow>
              <boxGeometry args={[0.1, 2.16, 0.1]} />
              <meshStandardMaterial color="#4a301f" roughness={0.86} />
            </mesh>
          ))}
          {/* Atap Kayu Mini Pelindung Poster */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[2.16, 0.09, 0.42]} />
            <meshStandardMaterial color="#382316" roughness={0.84} />
          </mesh>
          {/* Badan Papan & Kolase 4 Poster Konser */}
          <mesh position={[0, 1.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 1.38, 0.09]} />
            <meshStandardMaterial color="#593a24" roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.42, 0.05]}>
            <planeGeometry args={[1.76, 1.24]} />
            <meshStandardMaterial
              map={musicPostersTex}
              emissiveMap={musicPostersTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.34 : 0.06}
              roughness={0.72}
            />
          </mesh>
          <mesh position={[0, 1.42, -0.05]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.76, 1.24]} />
            <meshStandardMaterial map={musicPostersTex} roughness={0.75} />
          </mesh>
          {/* Lampu Sorot Kecil Atas Papan Poster */}
          <mesh position={[0, 2.1, 0.24]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#fff6d6"
              emissive="#ffbf5c"
              emissiveIntensity={isEveningOrNight ? 2.4 : 0.1}
            />
          </mesh>
        </group>

        {/* Bangku Kayu Besi Tempa Teduh Menghadap Jl. Cempaka ([-11.8, 0, -24.6]) */}
        <group position={[0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.86, 0.08, 0.52]} />
            <meshStandardMaterial map={textures.woodFloor} color="#96663d" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0.78, -0.22]} rotation={[-0.14, 0, 0]} castShadow>
            <boxGeometry args={[1.86, 0.38, 0.07]} />
            <meshStandardMaterial map={textures.woodFloor} color="#8a5c36" roughness={0.8} />
          </mesh>
          {[-0.78, 0.78].map((bx, bi) => (
            <group key={`mbl-${bi}`} position={[bx, 0, 0]}>
              <mesh position={[0, 0.23, 0]} castShadow>
                <boxGeometry args={[0.08, 0.46, 0.52]} />
                <meshStandardMaterial color="#1f2937" metalness={0.62} roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.58, 0]} castShadow>
                <boxGeometry args={[0.07, 0.06, 0.5]} />
                <meshStandardMaterial color="#1f2937" metalness={0.62} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Pohon Teduh dalam Bak Bata Terakota di Utara Bangku ([-12.6, 0, -27.2]) */}
        <group position={[-0.4, 0, -2.6]}>
          <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.64, 0.58, 0.48, 12]} />
            <meshStandardMaterial color="#9c4f38" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.46, 0]}>
            <cylinderGeometry args={[0.56, 0.56, 0.06, 12]} />
            <meshStandardMaterial color="#4a3828" roughness={0.95} />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.17, 2.2, 8]} />
            <meshStandardMaterial color="#5c422e" roughness={0.92} />
          </mesh>
          <mesh position={[0, 3.05, 0]} castShadow>
            <icosahedronGeometry args={[1.38, 1]} />
            <meshStandardMaterial color="#3b6e41" roughness={0.85} />
          </mesh>
          <mesh position={[0.62, 2.75, 0.45]} castShadow>
            <icosahedronGeometry args={[0.92, 1]} />
            <meshStandardMaterial color="#4e824c" roughness={0.84} />
          </mesh>
          <mesh position={[-0.55, 2.82, -0.38]} castShadow>
            <icosahedronGeometry args={[0.88, 1]} />
            <meshStandardMaterial color="#2f5a36" roughness={0.86} />
          </mesh>
        </group>

        {/* Lampu Taman Kuningan Hangat di Selatan Bangku ([-12.6, 0, -22.2]) */}
        <group position={[-0.4, 0, 2.4]}>
          <mesh position={[0, 1.38, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.068, 2.76, 8]} />
            <meshStandardMaterial color="#1f2937" metalness={0.62} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.82, 0]}>
            <sphereGeometry args={[0.15, 12, 10]} />
            <meshStandardMaterial
              color="#fff8dc"
              emissive="#ffbf5c"
              emissiveIntensity={isEveningOrNight ? 2.6 : 0.14}
            />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && (
            <sprite position={[0, 2.82, 0]} scale={[2.0, 2.0, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffd082"
                transparent
                opacity={0.48}
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
