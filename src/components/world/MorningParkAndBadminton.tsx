import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface MorningParkAndBadmintonProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const STRETCH_PARTICIPANTS: {
  id: string;
  offset: [number, number];
  isFemale: boolean;
  matColor: string;
  profile: CharacterProfile;
}[] = [
  {
    id: 'stretch_leader',
    offset: [0, -1.65],
    isFemale: true,
    matColor: '#60a5fa',
    profile: {
      id: 'bu_wati',
      name: 'Ibu Ratna',
      role: 'Instruktur Senam Taman',
      accentColor: '#38bdf8',
      voice: { pitch: 1.05, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: {
        height: 1.62,
        shirtColor: '#2a9d8f',
        pantsColor: '#1e293b',
        skinColor: '#d9ad8a',
        hairColor: '#261e1a',
      },
    },
  },
  {
    id: 'stretch_member_1',
    offset: [-1.45, 0.45],
    isFemale: false,
    matColor: '#34d399',
    profile: {
      id: 'pak_budi',
      name: 'Pak Hendri',
      role: 'Warga Senam Taman',
      accentColor: '#34d399',
      voice: { pitch: 0.92, rate: 1, preferGender: 'male', volumeScale: 1 },
      appearance: {
        height: 1.71,
        shirtColor: '#f1f5f9',
        pantsColor: '#334155',
        skinColor: '#c99974',
        hairColor: '#475569',
      },
    },
  },
  {
    id: 'stretch_member_2',
    offset: [1.45, 0.45],
    isFemale: true,
    matColor: '#f472b6',
    profile: {
      id: 'mbak_lilis',
      name: 'Mbak Sari',
      role: 'Warga Senam Taman',
      accentColor: '#f472b6',
      voice: { pitch: 1.08, rate: 1, preferGender: 'female', volumeScale: 1 },
      appearance: {
        height: 1.61,
        shirtColor: '#e07a5f',
        pantsColor: '#272c38',
        skinColor: '#e0b594',
        hairColor: '#211917',
      },
    },
  },
];

function createSignBladeTexture(label: string, arrow: 'left' | 'right', accent: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 96;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#4a3220';
  ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 84);

  ctx.fillStyle = '#fff7e6';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const text = arrow === 'left' ? `◀  ${label}` : `${label}  ▶`;
  ctx.fillText(text, 256, 49);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Warga senam / peregangan santai bergerak serempak pelan mengikuti irama napas taman.
 */
const ParkStretchMember: React.FC<{
  cfg: (typeof STRETCH_PARTICIPANTS)[number];
  isLeader: boolean;
}> = ({ cfg, isLeader }) => {
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Siklus 12 detik peregangan lembut: angkat tangan -> rentang samping -> tunduk ringan
    const phase = (t % 12) / 12;
    const raiseWave = Math.sin(phase * Math.PI * 2);
    const sideWave = Math.max(0, Math.sin((phase - 0.25) * Math.PI * 2));

    if (leftArmRef.current && rightArmRef.current) {
      const armUp = -1.35 - raiseWave * 1.15;
      leftArmRef.current.rotation.x = armUp;
      rightArmRef.current.rotation.x = armUp;
      leftArmRef.current.rotation.z = -0.22 - sideWave * 0.72;
      rightArmRef.current.rotation.z = 0.22 + sideWave * 0.72;
    }
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.92 - Math.abs(raiseWave) * 0.04;
      torsoRef.current.rotation.z = Math.sin(t * 0.65) * 0.09;
    }
    if (headRef.current) {
      headRef.current.rotation.x = -raiseWave * 0.14;
    }
    if (leftLegRef.current && rightLegRef.current) {
      const kneeBend = Math.max(0, -raiseWave) * 0.12;
      leftLegRef.current.rotation.x = -kneeBend;
      rightLegRef.current.rotation.x = -kneeBend;
    }
  });

  return (
    <group position={[cfg.offset[0], 0, cfg.offset[1]]} rotation={[0, isLeader ? 0 : Math.PI, 0]}>
      {/* Matras Senam Pastel Tipis di Rumput */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[0.78, 0.02, 1.65]} />
        <meshStandardMaterial color={cfg.matColor} roughness={0.9} />
      </mesh>
      <HumanModel
        profile={cfg.profile}
        torsoRef={torsoRef}
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
        leftLegRef={leftLegRef}
        rightLegRef={rightLegRef}
        headRef={headRef}
        isFemale={cfg.isFemale}
      />
    </group>
  );
};

interface SignBladeDef {
  label: string;
  arrow: 'left' | 'right';
  rotY: number;
  y: number;
  accent: string;
}

const WoodenSignpost: React.FC<{
  position: [number, number, number];
  blades: SignBladeDef[];
  isLit: boolean;
  glow: boolean;
}> = ({ position, blades, isLit, glow }) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const bladeTextures = useMemo(
    () => blades.map((b) => createSignBladeTexture(b.label, b.arrow, b.accent)),
    [blades],
  );

  return (
    <group position={position}>
      {/* Umpak Batu & Tiang Kayu Jati Klasik */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.28, 8]} />
        <meshStandardMaterial color="#6e737b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.085, 0.105, 2.7, 10]} />
        <meshStandardMaterial color="#593c26" roughness={0.82} />
      </mesh>

      {/* Papan Panah Kayu Bertingkat */}
      {blades.map((b, idx) => (
        <group key={`sb-${idx}`} position={[0, b.y, 0]} rotation={[0, b.rotY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.55, 0.26, 0.055]} />
            <meshStandardMaterial color="#4a3220" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[1.48, 0.23]} />
            <meshStandardMaterial
              map={bladeTextures[idx]}
              emissiveMap={bladeTextures[idx]}
              emissive="#ffe3b3"
              emissiveIntensity={isLit ? 0.35 : 0.04}
            />
          </mesh>
          <mesh position={[0, 0, -0.032]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.48, 0.23]} />
            <meshStandardMaterial
              map={bladeTextures[idx]}
              emissiveMap={bladeTextures[idx]}
              emissive="#ffe3b3"
              emissiveIntensity={isLit ? 0.35 : 0.04}
            />
          </mesh>
        </group>
      ))}

      {/* Lentera Kayu Hangat di Puncak Tiang Penunjuk Arah */}
      <mesh position={[0, 2.94, 0]}>
        <boxGeometry args={[0.24, 0.28, 0.24]} />
        <meshStandardMaterial
          color={isLit ? '#fff1c2' : '#cad2dc'}
          emissive={isLit ? '#ffb952' : '#000000'}
          emissiveIntensity={isLit ? 2.5 : 0}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 3.14, 0]} castShadow>
        <coneGeometry args={[0.24, 0.18, 4]} />
        <meshStandardMaterial color="#3b2718" roughness={0.75} />
      </mesh>
      {isLit && glow && (
        <sprite position={[0, 2.94, 0]} scale={[2.0, 2.0, 1]}>
          <spriteMaterial
            map={textures.glowSprite}
            color="#ffc870"
            transparent
            opacity={0.62}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}
    </group>
  );
};

/**
 * Kehidupan Pagi & Taman Kota:
 * 1. Lapangan Bulu Tangkis Gang Melati ([38.5, 0, 49.8]) + net, lampu sorot RT & animasi rally kok interaktif [E]
 * 2. Kelompok 3 Warga Senam / Peregangan Santai di Rumput Taman Kota ([-83.5, 0, 33.8])
 * 3. Dua Tiang Penunjuk Arah Kayu Klasik (Gerbang Taman Kota & Persimpangan Jl. Kenangan)
 */
export const MorningParkAndBadminton: React.FC<MorningParkAndBadmintonProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const shuttleRef = useRef<THREE.Group>(null);
  const rallyCycleRef = useRef(-1);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';

  const parkSignBlades = useMemo<SignBladeDef[]>(
    () => [
      { label: 'DANAU SENJA', arrow: 'left', rotY: 0.28, y: 2.52, accent: '#7dd3fc' },
      { label: 'LAPAK KELAPA MUDA', arrow: 'left', rotY: 0.12, y: 2.2, accent: '#86efac' },
      { label: 'JEMBATAN & KEDAI BIMA', arrow: 'right', rotY: -0.15, y: 1.88, accent: '#fcd34d' },
    ],
    [],
  );

  const junctionSignBlades = useMemo<SignBladeDef[]>(
    () => [
      { label: 'KEDAI KOPI BIMA', arrow: 'left', rotY: 0.22, y: 2.52, accent: '#f5b963' },
      { label: 'RUMAH JL. MELATI', arrow: 'left', rotY: Math.PI / 2 - 0.15, y: 2.2, accent: '#fda4af' },
      { label: 'MENARA & STASIUN SENJA', arrow: 'right', rotY: -0.18, y: 1.88, accent: '#93c5fd' },
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (playerRuntime.badmintonRallyTimer > 0) {
      playerRuntime.badmintonRallyTimer = Math.max(0, playerRuntime.badmintonRallyTimer - dt);
    }

    const activeRally = playerRuntime.badmintonRallyTimer > 0;
    if (shuttleRef.current) {
      if (activeRally) {
        // Kok melambung parabolik melintasi net (kiri <-> kanan setiap 1.15 detik)
        const period = 1.15;
        const cycleIdx = Math.floor(t / period);
        const u = (t % period) / period;
        const goingRight = cycleIdx % 2 === 0;
        const localX = goingRight ? THREE.MathUtils.lerp(-3.5, 3.5, u) : THREE.MathUtils.lerp(3.5, -3.5, u);
        const arcY = 1.15 + Math.sin(u * Math.PI) * 2.45;
        const driftZ = Math.sin(t * 1.4) * 0.55;

        shuttleRef.current.position.set(localX, arcY, driftZ);
        shuttleRef.current.rotation.z = goingRight ? -0.65 + u * 1.3 : 0.65 - u * 1.3;

        // Bunyi "plok!" renyah setiap kok memantul balik di sisi lapangan
        if (cycleIdx !== rallyCycleRef.current) {
          rallyCycleRef.current = cycleIdx;
          const [px, py, pz] = playerRuntime.position;
          const dist = py > 4 ? 99 : Math.hypot(px - 38.5, pz - 49.8);
          if (dist < 22) {
            sfxEngine.playBadmintonHit(Math.max(0.25, 1 - dist / 24));
          }
        }
      } else {
        rallyCycleRef.current = -1;
        // Kok beristirahat rapi di sisi bangku lapangan saat tidak rally
        shuttleRef.current.position.set(-4.05, 0.54, -3.1);
        shuttleRef.current.rotation.z = 0.25;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. LAPANGAN BULU TANGKIS GANG MELATI ([38.5, 0, 49.8])               */}
      {/* ==================================================================== */}
      <group position={[38.5, 0, 49.8]}>
        {/* Permukaan Semen Lapangan Hijau-Abu Tipis */}
        <mesh position={[0, 0.015, 0]} receiveShadow>
          <boxGeometry args={[10.8, 0.03, 5.6]} />
          <meshStandardMaterial color="#3c6652" roughness={0.88} />
        </mesh>

        {/* Garis Cat Putih Lapangan Bulu Tangkis (Keliling, Servis & Tengah) */}
        {[
          { pos: [0, 0.034, -2.55], size: [10.1, 0.008, 0.08] },
          { pos: [0, 0.034, 2.55], size: [10.1, 0.008, 0.08] },
          { pos: [-5.0, 0.034, 0], size: [0.08, 0.008, 5.18] },
          { pos: [5.0, 0.034, 0], size: [0.08, 0.008, 5.18] },
          { pos: [-1.55, 0.034, 0], size: [0.07, 0.008, 5.1] },
          { pos: [1.55, 0.034, 0], size: [0.07, 0.008, 5.1] },
          { pos: [-3.28, 0.034, 0], size: [3.44, 0.008, 0.07] },
          { pos: [3.28, 0.034, 0], size: [3.44, 0.008, 0.07] },
        ].map((line, li) => (
          <mesh key={`bl-${li}`} position={line.pos as [number, number, number]}>
            <boxGeometry args={line.size as [number, number, number]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.85} />
          </mesh>
        ))}

        {/* Dua Tiang Net Besi + Jaring Net Bulu Tangkis Putih-Hitam */}
        {[-2.8, 2.8].map((nz, ni) => (
          <mesh key={`np-${ni}`} position={[0, 0.82, nz]} castShadow>
            <cylinderGeometry args={[0.035, 0.042, 1.64, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.62} roughness={0.38} />
          </mesh>
        ))}
        {/* Pita Putih Atas Net */}
        <mesh position={[0, 1.54, 0]}>
          <boxGeometry args={[0.04, 0.075, 5.62]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} />
        </mesh>
        {/* Jaring Net Transparan Bergaris Halus */}
        <mesh position={[0, 1.18, 0]}>
          <boxGeometry args={[0.015, 0.68, 5.56]} />
          <meshStandardMaterial color="#1f2937" transparent opacity={0.38} roughness={0.9} />
        </mesh>

        {/* Dua Lampu Sorot Tiang Lapangan RT (Menyala Terang Otomatis saat Senja–Malam!) */}
        {[-2.9, 2.9].map((lz, li) => (
          <group key={`clmp-${li}`} position={[0, 0, lz]}>
            <mesh position={[0, 2.35, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.045, 4.7, 8]} />
              <meshStandardMaterial color="#27313d" metalness={0.55} roughness={0.45} />
            </mesh>
            <mesh position={[0, 4.68, lz < 0 ? 0.22 : -0.22]} rotation={[lz < 0 ? 0.45 : -0.45, 0, 0]}>
              <boxGeometry args={[0.42, 0.16, 0.24]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fff8df' : '#cbd5e1'}
                emissive={isEveningOrNight ? '#ffdf96' : '#000000'}
                emissiveIntensity={isEveningOrNight ? 2.8 : 0}
              />
            </mesh>
            {isEveningOrNight && settings.cinematicGlow && (
              <sprite position={[0, 4.55, lz < 0 ? 0.26 : -0.26]} scale={[2.6, 2.6, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffe4a3"
                  transparent
                  opacity={0.62}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        ))}
        {isEveningOrNight && (
          <pointLight position={[0, 4.2, 0]} color="#fff1cc" intensity={15} distance={19} decay={1.7} />
        )}

        {/* Bangku Kayu Tepi Lapangan + 2 Raket Bulu Tangkis & Tabung Kok */}
        <group position={[-4.2, 0, -3.25]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.09, 0.44]} />
            <meshStandardMaterial color="#875d39" roughness={0.8} />
          </mesh>
          {[-0.55, 0.55].map((bx, bi) => (
            <mesh key={`bbl-${bi}`} position={[bx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.1, 0.42, 0.36]} />
              <meshStandardMaterial color="#4f3520" roughness={0.85} />
            </mesh>
          ))}
          {/* Raket Bulu Tangkis Bersandar */}
          <group position={[-0.3, 0.52, 0.22]} rotation={[-0.25, 0.2, 0.15]}>
            <mesh position={[0, -0.18, 0]}>
              <cylinderGeometry args={[0.012, 0.014, 0.36, 6]} />
              <meshStandardMaterial color="#1d4ed8" roughness={0.45} />
            </mesh>
            <mesh position={[0, 0.14, 0]} scale={[0.85, 1.15, 1]}>
              <torusGeometry args={[0.12, 0.011, 6, 16]} />
              <meshStandardMaterial color="#ef4444" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
          {/* Tabung Kok Putih-Biru */}
          <mesh position={[0.42, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.32, 10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0.42, 0.72, 0]}>
            <cylinderGeometry args={[0.047, 0.047, 0.07, 10]} />
            <meshStandardMaterial color="#2563eb" roughness={0.5} />
          </mesh>
        </group>

        {/* Kok Bulu Tangkis (Melambung Bolak-Balik Realistis Saat Rally [E]!) */}
        <group ref={shuttleRef} position={[-4.05, 0.54, -3.1]}>
          <mesh position={[0, -0.025, 0]}>
            <sphereGeometry args={[0.026, 8, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <coneGeometry args={[0.055, 0.095, 10, 1, true]} />
            <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. WARGA SENAM / PEREGANGAN SANTAI DI RUMPUT TAMAN KOTA              */}
      {/* ==================================================================== */}
      {!isRain && (
        <group position={[-83.5, 0, 33.8]}>
          {/* Speaker Bluetooth Portabel Kecil di Depan Instruktur */}
          <mesh position={[0.68, 0.12, -1.65]} castShadow>
            <boxGeometry args={[0.28, 0.18, 0.14]} />
            <meshStandardMaterial color="#1f2937" roughness={0.5} />
          </mesh>
          <mesh position={[0.68, 0.12, -1.575]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={2.0} />
          </mesh>

          {STRETCH_PARTICIPANTS.map((p, idx) => (
            <ParkStretchMember key={p.id} cfg={p} isLeader={idx === 0} />
          ))}
        </group>
      )}

      {/* ==================================================================== */}
      {/* 3. DUA TIANG PENUNJUK ARAH KAYU KLASIK (TAMAN KOTA & JL. KENANGAN)   */}
      {/* ==================================================================== */}
      <WoodenSignpost
        position={[-62.2, 0, -6.2]}
        blades={parkSignBlades}
        isLit={isEveningOrNight}
        glow={settings.cinematicGlow}
      />
      <WoodenSignpost
        position={[-10.4, 0, 10.8]}
        blades={junctionSignBlades}
        isLit={isEveningOrNight}
        glow={settings.cinematicGlow}
      />
    </group>
  );
};
