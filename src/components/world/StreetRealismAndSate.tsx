import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface StreetRealismAndSateProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const CAK_MAT_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Cak Mat',
  role: 'Penjual Sate Ayam Madura',
  accentColor: '#f97316',
  voice: { pitch: 0.92, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#b91c1c',
    pantsColor: '#1f2937',
    skinColor: '#c99771',
    hairColor: '#1e1b19',
    accentProp: 'apron',
  },
};

const RECYCLING_BIN_POSITIONS: [number, number, number, number][] = [
  [25.3, 0, 11.4, Math.PI], // Dekat Halte Bus Jl. Kenangan
  [-11.8, 0, 12.6, Math.PI], // Dekat Kedai Kopi Bima
  [-14.0, 0, -18.5, 0], // Dekat Toko Musik Nada Lama
  [15.8, 0, -19.5, 0], // Depan Menara Nusantara (Barat)
  [-62.8, 0, 8.2, Math.PI / 2], // Gerbang Taman Kota & Air Mancur
  [74.8, 0.1, 3.2, Math.PI / 2], // Peron Stasiun Senja
];

const RAIN_PUDDLE_SPECS: { x: number; y: number; z: number; sx: number; sz: number; rot: number }[] = [
  // Di jalan aspal & tepi trotoar persimpangan utama, Kedai Bima, Kios Harmoni, Menara & Jl. Melati
  { x: -15.5, y: 0.052, z: 4.1, sx: 2.2, sz: 1.35, rot: 0.18 },
  { x: 14.2, y: 0.052, z: 3.9, sx: 2.5, sz: 1.45, rot: -0.12 },
  { x: 24.5, y: 0.052, z: -3.6, sx: 2.3, sz: 1.3, rot: 0.25 },
  { x: -24.0, y: 0.052, z: -3.8, sx: 2.1, sz: 1.2, rot: -0.22 },
  { x: 3.4, y: 0.052, z: 16.5, sx: 1.4, sz: 2.3, rot: 0.08 },
  { x: -3.6, y: 0.052, z: 31.0, sx: 1.45, sz: 2.4, rot: -0.1 },
  { x: 20.5, y: 0.028, z: 12.6, sx: 1.7, sz: 1.15, rot: 0.3 },
  { x: -18.2, y: 0.028, z: 11.4, sx: 1.8, sz: 1.1, rot: -0.28 },
  { x: 26.5, y: 0.028, z: -16.8, sx: 2.2, sz: 1.25, rot: 0.15 },
  { x: -20.2, y: 0.052, z: 50.8, sx: 2.0, sz: 1.2, rot: 0.05 },
  { x: -37.2, y: 0.028, z: 16.2, sx: 1.65, sz: 1.25, rot: -0.35 },
  { x: 6.8, y: 0.052, z: -15.4, sx: 1.5, sz: 2.1, rot: 0.14 },
];

function createSateBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#7f1d1d');
  grad.addColorStop(0.5, '#991b1b');
  grad.addColorStop(1, '#7c2d12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SATE AYAM MADURA', 320, 56);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 25px sans-serif';
  ctx.fillText('CAK MAT · ASLI MADURA', 320, 98);

  ctx.fillStyle = '#7f1d1d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('SATE AYAM · SATE KAMBING · LONTONG HANGAT', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const SateGrillSmoke: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 6; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = ((t * 0.42 + i / 6) % 1 + 1) % 1;
      m.position.y = p * 1.45;
      m.position.x = Math.sin(t * 1.5 + i * 1.3) * 0.16 * p - p * 0.18;
      m.position.z = Math.cos(t * 1.3 + i * 1.7) * 0.14 * p;
      const s = 0.55 + p * 1.85;
      m.scale.set(s, s * 0.85, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.3;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`smk-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ede8e0" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Detail Jalanan & Kuliner Malam:
 * 1. Gerobak Sate Ayam Madura Cak Mat ([13.4, 0, 29.5]) — bara arang merah menyala, kipas bambu & asap panggang
 * 2. 5 Set Garis Zebra Cross Putih Tegas di Persimpangan Jl. Kenangan × Jl. Cempaka & Depan Halte Bus
 * 3. 6 Pasang Tempat Sampah Pilah Organik–Anorganik di Tepi Trotoar & Taman
 * 4. 12 Genangan Air Hujan Berkilau dengan Riak Halus Saat Hujan Sore (rain_dusk)
 */
export const StreetRealismAndSate: React.FC<StreetRealismAndSateProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const sateBannerTex = useMemo(() => createSateBannerTexture(), []);

  const emberMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const emberLightRef = useRef<THREE.PointLight>(null);
  const fanGroupRef = useRef<THREE.Group>(null);
  const cakMatHeadRef = useRef<THREE.Group>(null);
  const cakMatRightArmRef = useRef<THREE.Group>(null);
  const puddleRippleRefs = useRef<(THREE.Mesh | null)[]>([]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Denyut bara arang & gerakan mengipas sate ritmis Cak Mat
    const fanWave = Math.sin(t * 7.8);
    if (fanGroupRef.current) {
      fanGroupRef.current.rotation.z = -0.35 + fanWave * 0.45;
      fanGroupRef.current.rotation.y = 0.2 + Math.cos(t * 7.8) * 0.18;
    }
    if (cakMatRightArmRef.current) {
      cakMatRightArmRef.current.rotation.x = -0.92 + fanWave * 0.24;
    }
    if (cakMatHeadRef.current) {
      cakMatHeadRef.current.rotation.x = 0.12 + Math.sin(t * 1.4) * 0.04;
      cakMatHeadRef.current.rotation.y = Math.sin(t * 0.7) * 0.2;
    }
    if (emberMatRef.current) {
      emberMatRef.current.emissiveIntensity = (isEveningOrNight ? 2.8 : 1.7) + Math.max(0, fanWave) * 1.1;
    }
    if (emberLightRef.current) {
      emberLightRef.current.intensity = (isEveningOrNight ? 7.5 : 2.5) + Math.max(0, fanWave) * 2.5;
    }

    // 2. Riak rintik hujan lembut pada 12 genangan air saat rain_dusk
    if (isRain) {
      for (let i = 0; i < RAIN_PUDDLE_SPECS.length; i++) {
        const rip = puddleRippleRefs.current[i];
        if (!rip) continue;
        const life = ((t * 1.45 + i * 0.27) % 1 + 1) % 1;
        const s = 0.2 + life * 1.5;
        rip.scale.set(s, s, 1);
        const mat = rip.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - life) * 0.45;
      }
    }
  });

  const stripeOffsets = [-4.0, -2.4, -0.8, 0.8, 2.4, 4.0];

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK SATE AYAM MADURA CAK MAT ([13.4, 0, 29.5], hadap -X)      */}
      {/* ==================================================================== */}
      <group position={[13.4, 0, 29.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Badan Kayu Gerobak Sate Khas Bentuk Perahu Madura */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.18, 0.84, 0.92]} />
          <meshStandardMaterial color="#7a4626" roughness={0.78} />
        </mesh>
        {/* Ujung Lunas Perahu Melengkung Khas Gerobak Sate Madura */}
        <mesh position={[-1.24, 0.85, 0]} rotation={[0, 0, 0.48]} castShadow>
          <boxGeometry args={[0.45, 0.62, 0.88]} />
          <meshStandardMaterial color="#8c4e28" roughness={0.76} />
        </mesh>
        <mesh position={[1.24, 0.85, 0]} rotation={[0, 0, -0.48]} castShadow>
          <boxGeometry args={[0.45, 0.62, 0.88]} />
          <meshStandardMaterial color="#8c4e28" roughness={0.76} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[2.28, 0.07, 1.02]} />
          <meshStandardMaterial color="#a86a3c" roughness={0.68} />
        </mesh>

        {/* Spanduk Depan "SATE AYAM MADURA · CAK MAT" */}
        <mesh position={[0, 0.68, 0.47]}>
          <planeGeometry args={[2.04, 0.56]} />
          <meshStandardMaterial
            map={sateBannerTex}
            emissiveMap={sateBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.68 : 0.1}
          />
        </mesh>

        {/* Panggangan Arang Baja + Bara Merah Menyala + Deretan Tusuk Sate */}
        <mesh position={[-0.45, 1.24, 0.06]} castShadow>
          <boxGeometry args={[1.05, 0.2, 0.42]} />
          <meshStandardMaterial color="#27272a" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[-0.45, 1.35, 0.06]}>
          <boxGeometry args={[0.96, 0.04, 0.34]} />
          <meshStandardMaterial
            ref={emberMatRef}
            color="#ff5a1f"
            emissive="#ff3b0a"
            emissiveIntensity={2.6}
            roughness={0.6}
          />
        </mesh>
        {/* 8 Tusuk Sate Ayam Sedang Dibakar */}
        {[-0.82, -0.71, -0.6, -0.49, -0.38, -0.27, -0.16, -0.05].map((sx, si) => (
          <mesh key={`grs-${si}`} position={[sx, 1.4, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.32, 6]} />
            <meshStandardMaterial color="#6e3214" roughness={0.55} />
          </mesh>
        ))}
        <SateGrillSmoke position={[-0.45, 1.46, 0.06]} />
        <pointLight
          ref={emberLightRef}
          position={[-0.45, 1.55, 0.15]}
          color="#ff6b2b"
          intensity={isEveningOrNight ? 7.5 : 2.5}
          distance={9}
          decay={1.9}
        />

        {/* Kipas Anyaman Bambu yang Mengipas Bara secara Ritmis */}
        <group ref={fanGroupRef} position={[-0.25, 1.52, -0.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.24, 0.018]} />
            <meshStandardMaterial color="#d4a76a" roughness={0.85} />
          </mesh>
        </group>

        {/* Etalase Kaca Kanan Berisi Sate Mentah, Lontong & Bumbu Kacang */}
        <mesh position={[0.62, 1.46, 0]}>
          <boxGeometry args={[0.82, 0.64, 0.72]} />
          <meshPhysicalMaterial
            color="#fff7ed"
            transparent
            opacity={0.34}
            roughness={0.12}
            clearcoat={0.85}
          />
        </mesh>
        <mesh position={[0.58, 1.24, 0.05]} castShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.14, 12]} />
          <meshStandardMaterial color="#854d27" roughness={0.65} />
        </mesh>
        <mesh position={[0.84, 1.24, 0.05]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 0.2, 10]} />
          <meshStandardMaterial color="#4d7c43" roughness={0.8} />
        </mesh>

        {/* Tiang, Atap Merah-Kuning & Bohlam Hangat */}
        {[
          [-1.02, 1.65, 0.42],
          [1.02, 1.65, 0.42],
          [-1.02, 1.65, -0.42],
          [1.02, 1.65, -0.42],
        ].map(([tx, ty, tz], ti) => (
          <mesh key={`st-${ti}`} position={[tx, ty, tz]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.25, 6]} />
            <meshStandardMaterial color="#4a2e1a" roughness={0.78} />
          </mesh>
        ))}
        <mesh position={[0, 2.32, 0]} castShadow>
          <boxGeometry args={[2.52, 0.1, 1.32]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.68} />
        </mesh>
        <mesh position={[0, 2.16, 0.14]}>
          <sphereGeometry args={[0.095, 10, 10]} />
          <meshStandardMaterial
            color="#fff2c6"
            emissive="#ffb84d"
            emissiveIntensity={isEveningOrNight ? 3.2 : 0.45}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.16, 0.14]} scale={[2.5, 2.5, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc76b"
              transparent
              opacity={0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight position={[0, 2.08, 0.55]} color="#ffbf66" intensity={11} distance={15} decay={1.8} />
        )}

        {/* 2 Roda Gerobak */}
        {[-0.48, 0.48].map((rz, ri) => (
          <mesh key={`srw-${ri}`} position={[0, 0.34, rz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.08, 16]} />
            <meshStandardMaterial color="#1f2329" roughness={0.85} />
          </mesh>
        ))}

        {/* Cak Mat Berdiri Mengipas Sate di Belakang Gerobak */}
        <group position={[-0.25, 0, -1.12]} rotation={[0, 0, 0]}>
          <HumanModel
            profile={CAK_MAT_PROFILE}
            headRef={cakMatHeadRef}
            rightArmRef={cakMatRightArmRef}
          />
        </group>
      </group>

      {/* Meja Makan Kayu & Bangku Sate di Sisi Selatan Gerobak ([13.4, 0, 32.1]) */}
      <group position={[13.4, 0, 31.8]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.42, 0.08, 0.74]} />
          <meshStandardMaterial color="#875a36" roughness={0.76} />
        </mesh>
        {[
          [-0.6, 0.36, -0.28],
          [0.6, 0.36, -0.28],
          [-0.6, 0.36, 0.28],
          [0.6, 0.36, 0.28],
        ].map(([lx, ly, lz], li) => (
          <mesh key={`stl-${li}`} position={[lx, ly, lz]} castShadow>
            <boxGeometry args={[0.07, 0.72, 0.07]} />
            <meshStandardMaterial color="#593a21" roughness={0.85} />
          </mesh>
        ))}
        {/* Botol Kecap Manis & Toples Kerupuk di Atas Meja Sate */}
        <mesh position={[0.42, 0.85, -0.1]}>
          <cylinderGeometry args={[0.032, 0.035, 0.2, 8]} />
          <meshStandardMaterial color="#271a14" roughness={0.3} />
        </mesh>
        {/* Bangku Kayu Panjang di Sisi Selatan Meja */}
        <mesh position={[0, 0.42, 0.75]} castShadow receiveShadow>
          <boxGeometry args={[1.48, 0.08, 0.42]} />
          <meshStandardMaterial color="#7d5333" roughness={0.8} />
        </mesh>
        {[-0.58, 0.58].map((bx, bi) => (
          <mesh key={`sbk-${bi}`} position={[bx, 0.21, 0.75]} castShadow>
            <boxGeometry args={[0.09, 0.42, 0.36]} />
            <meshStandardMaterial color="#4f331e" roughness={0.86} />
          </mesh>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 2. 5 SET GARIS ZEBRA CROSS PUTIH TEGAS DI PERSIMPANGAN & HALTE BUS   */}
      {/* ==================================================================== */}
      <group>
        {/* Zebra Cross Utara & Selatan (Melintasi Jl. Cempaka di z = -7.6 & +7.6) */}
        {[-7.6, 7.6].map((zz, zi) =>
          stripeOffsets.map((sx, si) => (
            <mesh key={`zns-${zi}-${si}`} position={[sx, 0.048, zz]} receiveShadow>
              <boxGeometry args={[0.8, 0.012, 2.55]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.78} />
            </mesh>
          )),
        )}
        {/* Zebra Cross Barat & Timur (Melintasi Jl. Kenangan di x = -7.6 & +7.6) + Depan Halte Bus (x = 16.5) */}
        {[-7.6, 7.6, 16.5].map((zx, zi) =>
          stripeOffsets.map((sz, si) => (
            <mesh key={`zew-${zi}-${si}`} position={[zx, 0.048, sz]} receiveShadow>
              <boxGeometry args={[2.55, 0.012, 0.8]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.78} />
            </mesh>
          )),
        )}
      </group>

      {/* ==================================================================== */}
      {/* 3. 6 PASANG TEMPAT SAMPAH PILAH ORGANIK–ANORGANIK TEPI TROTOAR       */}
      {/* ==================================================================== */}
      {RECYCLING_BIN_POSITIONS.map(([bx, by, bz, rotY], idx) => (
        <group key={`rbin-${idx}`} position={[bx, by, bz]} rotation={[0, rotY, 0]}>
          {/* Tiang Dudukan Besi Kembar */}
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.78, 0.05, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.45} />
          </mesh>
          {/* Tong Hijau (Organik) */}
          <group position={[-0.22, 0, 0]}>
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.17, 0.145, 0.68, 12]} />
              <meshStandardMaterial color="#15803d" roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <sphereGeometry args={[0.172, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#166534" roughness={0.48} />
            </mesh>
          </group>
          {/* Tong Kuning (Anorganik) */}
          <group position={[0.22, 0, 0]}>
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.17, 0.145, 0.68, 12]} />
              <meshStandardMaterial color="#ca8a04" roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <sphereGeometry args={[0.172, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#a16207" roughness={0.48} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ==================================================================== */}
      {/* 4. 12 GENANGAN AIR HUJAN BERKILAU DENGAN RIAK HALUS (rain_dusk)      */}
      {/* ==================================================================== */}
      {isRain &&
        RAIN_PUDDLE_SPECS.map((pd, pi) => (
          <group key={`pud-${pi}`} position={[pd.x, pd.y, pd.z]} rotation={[0, pd.rot, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[pd.sx, pd.sz, 1]}>
              <circleGeometry args={[1, 20]} />
              <meshStandardMaterial
                color="#334c66"
                emissive="#6d8fb3"
                emissiveIntensity={0.22}
                roughness={0.04}
                metalness={0.88}
                transparent
                opacity={0.76}
              />
            </mesh>
            <mesh
              ref={(el) => {
                puddleRippleRefs.current[pi] = el;
              }}
              position={[0, 0.004, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.22, 0.27, 16]} />
              <meshBasicMaterial color="#d8edff" transparent opacity={0.35} depthWrite={false} />
            </mesh>
          </group>
        ))}
    </group>
  );
};
