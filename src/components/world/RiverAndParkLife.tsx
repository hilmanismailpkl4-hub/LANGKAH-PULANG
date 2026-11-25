import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface RiverAndParkLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const PAK_HASAN_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Pak Hasan',
  role: 'Penjual Es Kelapa Muda',
  accentColor: '#4ade80',
  voice: { pitch: 0.94, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.7,
    shirtColor: '#f5f0e1',
    pantsColor: '#364152',
    skinColor: '#c99771',
    hairColor: '#262321',
    accentProp: 'apron',
  },
};

const PAK_KARNO_PROFILE: CharacterProfile = {
  id: 'pak_budi',
  name: 'Pak Karno',
  role: 'Pemancing Bantaran Sungai',
  accentColor: '#38bdf8',
  voice: { pitch: 0.9, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#4d7c8a',
    pantsColor: '#3a352f',
    skinColor: '#c79672',
    hairColor: '#52525b',
    accentProp: 'vest',
  },
};

const MAS_YUDI_PROFILE: CharacterProfile = {
  id: 'mas_raka',
  name: 'Mas Yudi',
  role: 'Pemancing Tepi Sungai',
  accentColor: '#60a5fa',
  voice: { pitch: 1.0, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.73,
    shirtColor: '#5b6d5b',
    pantsColor: '#2b3240',
    skinColor: '#d1a17b',
    hairColor: '#1f1c1a',
  },
};

const PADLOCK_COLORS = ['#d4a34a', '#c96f4b', '#d95353', '#5294c9', '#e2b958', '#60a87b', '#c78352'];

function createCoconutBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#165a38');
  grad.addColorStop(0.5, '#1e7348');
  grad.addColorStop(1, '#145232');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#f3d37a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef6e0';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#fff9e6';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ES KELAPA MUDA', 320, 56);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('PAK HASAN · TEPI DANAU SENJA', 320, 98);

  ctx.fillStyle = '#165a38';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KELAPA UTUH · KELAPA JERUK · PISANG GORENG', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface AnglerUnitProps {
  position: [number, number, number];
  rotationY: number;
  profile: CharacterProfile;
  showUmbrella: boolean;
  phaseOffset: number;
}

/**
 * Warga pemancing santai di bantaran Sungai Kota: duduk di kursi lipat memegang joran,
 * lengkap dengan benang pancing, pelampung merah-putih berayun di air, riak air & ember ikan.
 */
const RiverbankAngler: React.FC<AnglerUnitProps> = ({
  position,
  rotationY,
  profile,
  showUmbrella,
  phaseOffset,
}) => {
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rodRef = useRef<THREE.Group>(null);
  const bobberRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;
    const dist = py > 4 ? 99 : Math.hypot(px - position[0], pz - position[2]);

    // Postur duduk santai di kursi lipat
    if (leftLegRef.current) leftLegRef.current.rotation.x = -1.25;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -1.25;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -0.62;

    // Sentakan pelan alami pada joran & pelampung
    const nibble = Math.sin(t * 2.1 + phaseOffset) > 0.82 ? Math.sin(t * 14 + phaseOffset) * 0.045 : 0;
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -0.95 + Math.sin(t * 1.1 + phaseOffset) * 0.04 + nibble * 1.8;
    }
    if (rodRef.current) {
      rodRef.current.rotation.x = 0.28 + Math.sin(t * 1.2 + phaseOffset) * 0.025 + nibble;
    }
    if (headRef.current) {
      headRef.current.rotation.x = 0.1 + Math.sin(t * 0.8 + phaseOffset) * 0.04;
      headRef.current.rotation.y = dist < 5.5 ? Math.sin(t * 1.4) * 0.25 : Math.sin(t * 0.45 + phaseOffset) * 0.14;
    }
    if (bobberRef.current) {
      bobberRef.current.position.y = 0.03 + Math.sin(t * 2.6 + phaseOffset) * 0.035 - Math.abs(nibble) * 1.2;
    }
    if (rippleRef.current) {
      const rp = ((t * 0.55 + phaseOffset * 0.2) % 1 + 1) % 1;
      const sc = 0.4 + rp * 2.3;
      rippleRef.current.scale.set(sc, sc, 1);
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - rp) * 0.34;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Kursi Lipat Kanvas Pemancing */}
      <mesh position={[0, 0.42, -0.05]} castShadow>
        <boxGeometry args={[0.52, 0.06, 0.46]} />
        <meshStandardMaterial color="#2f527a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.72, -0.25]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[0.52, 0.54, 0.05]} />
        <meshStandardMaterial color="#2f527a" roughness={0.85} />
      </mesh>
      {[
        [-0.22, 0.21, 0.14],
        [0.22, 0.21, 0.14],
        [-0.22, 0.21, -0.22],
        [0.22, 0.21, -0.22],
      ].map(([lx, ly, lz], i) => (
        <mesh key={`fl-${i}`} position={[lx, ly, lz]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.42, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      {/* Figur Warga Pemancing Duduk Santai */}
      <group position={[0, -0.18, 0.04]}>
        <HumanModel
          profile={profile}
          headRef={headRef}
          leftLegRef={leftLegRef}
          rightLegRef={rightLegRef}
          leftArmRef={leftArmRef}
          rightArmRef={rightArmRef}
        />
      </group>

      {/* Joran Pancing Melengkung Menjulur ke Sungai (+Z lokal) */}
      <group ref={rodRef} position={[0.25, 0.92, 0.38]} rotation={[0.28, 0, 0]}>
        <mesh position={[0, 0.52, 0.72]} rotation={[0.92, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.022, 1.85, 8]} />
          <meshStandardMaterial color="#382c24" roughness={0.55} />
        </mesh>
        <mesh position={[0, 1.05, 1.98]} rotation={[1.22, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.01, 1.15, 6]} />
          <meshStandardMaterial color="#5c493b" roughness={0.5} />
        </mesh>
      </group>

      {/* Benang Pancing Tipis Menurun ke Pelampung */}
      <mesh position={[0.25, 0.68, 3.22]} rotation={[0.22, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 1.48, 4]} />
        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.5} />
      </mesh>

      {/* Pelampung Merah-Putih Mengapung di Air Sungai */}
      <group ref={bobberRef} position={[0.25, 0.03, 3.45]}>
        <mesh position={[0, 0.03, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#ef4444" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.015, 0]}>
          <sphereGeometry args={[0.042, 8, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} />
        </mesh>
      </group>
      {/* Riak Air Halus di Sekitar Pelampung */}
      <mesh ref={rippleRef} position={[0.25, 0.02, 3.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.13, 16]} />
        <meshBasicMaterial color="#e2f4ff" transparent opacity={0.3} depthWrite={false} />
      </mesh>

      {/* Ember Ikan Biru, Kotak Umpan & Termos Kopi di Samping Kursi */}
      <group position={[-0.58, 0, 0.12]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.135, 0.32, 12]} />
          <meshStandardMaterial color="#2563eb" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 12]} />
          <meshStandardMaterial color="#4c8fb8" roughness={0.2} />
        </mesh>
        <mesh position={[0.28, 0.09, 0.16]} castShadow>
          <boxGeometry args={[0.26, 0.16, 0.18]} />
          <meshStandardMaterial color="#d97706" roughness={0.6} />
        </mesh>
        <mesh position={[-0.22, 0.14, 0.14]} castShadow>
          <cylinderGeometry args={[0.045, 0.048, 0.26, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.65} roughness={0.28} />
        </mesh>
      </group>

      {/* Payung Peneduh Pemancing saat Hujan atau Pagi Terik */}
      {showUmbrella && (
        <group position={[-0.36, 0, -0.25]}>
          <mesh position={[0, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.022, 2.1, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 2.12, 0]} castShadow>
            <coneGeometry args={[1.08, 0.36, 12]} />
            <meshStandardMaterial color="#1f7a53" roughness={0.72} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * Kehidupan Tepi Sungai & Taman:
 * 1. Lapak Es Kelapa Muda & Camilan Segar Pak Hasan bertenda payung di tepi Taman Danau ([-84.5, 0, -9.8]) + Meja Payung Santai
 * 2. Barisan 32 Gembok Kenangan & 40 Lampu Senar Hangat di kedua pagar Jembatan Sungai ([-48, 0.14, 0])
 * 3. Dua Warga Pemancing Santai di Bantaran Sungai (Pak Karno Utara & Mas Yudi Selatan)
 */
export const RiverAndParkLife: React.FC<RiverAndParkLifeProps> = ({ timeOfDay, settings }) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const coconutBannerTex = useMemo(() => createCoconutBannerTexture(), []);

  const hasanHeadRef = useRef<THREE.Group>(null);
  const hasanRightArmRef = useRef<THREE.Group>(null);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';
  const showAnglerUmbrella = timeOfDay === 'rain_dusk' || timeOfDay === 'morning';

  // 32 gembok kenangan sepanjang pagar Utara & Selatan Jembatan Tepi Sungai
  const bridgePadlocks = useMemo(() => {
    const items: { x: number; y: number; z: number; col: string; rotZ: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const u = i / 15;
      const x = THREE.MathUtils.lerp(-53.6, -42.4, u);
      const yOff = i % 2 === 0 ? 0.56 : 0.82;
      items.push({
        x,
        y: yOff,
        z: 6.46,
        col: PADLOCK_COLORS[i % PADLOCK_COLORS.length],
        rotZ: ((i % 3) - 1) * 0.12,
      });
      items.push({
        x: x + 0.18,
        y: i % 2 === 0 ? 0.82 : 0.56,
        z: -6.46,
        col: PADLOCK_COLORS[(i + 3) % PADLOCK_COLORS.length],
        rotZ: ((i % 3) - 1) * -0.1,
      });
    }
    return items;
  }, []);

  // 40 bohlam lampu senar hangat (fairy string lights) melengkung lembut sepanjang kedua pagar jembatan
  const bridgeFairyBulbs = useMemo(() => {
    const bulbs: { x: number; y: number; z: number }[] = [];
    const anchors = [-57.2, -54.5, -48.0, -41.5, -38.8];
    ([-6.52, 6.52] as number[]).forEach((rz) => {
      for (let s = 0; s < anchors.length - 1; s++) {
        const x0 = anchors[s];
        const x1 = anchors[s + 1];
        for (let b = 1; b <= 5; b++) {
          const u = b / 6;
          const x = THREE.MathUtils.lerp(x0, x1, u);
          const sag = Math.sin(u * Math.PI) * 0.24;
          bulbs.push({ x, y: 1.06 - sag, z: rz });
        }
      }
    });
    return bulbs;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;
    const distHasan = py > 4 ? 99 : Math.hypot(px - -84.5, pz - -9.8);
    if (hasanHeadRef.current) {
      hasanHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.28;
    }
    if (hasanRightArmRef.current) {
      hasanRightArmRef.current.rotation.x = distHasan < 6.5 ? -2.05 + Math.sin(t * 7.5) * 0.2 : -0.35;
      hasanRightArmRef.current.rotation.z = distHasan < 6.5 ? 0.3 + Math.cos(t * 7.5) * 0.14 : 0;
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. LAPAK ES KELAPA MUDA PAK HASAN + MEJA PAYUNG TEPI DANAU SENJA     */}
      {/* ==================================================================== */}
      <group position={[-84.5, 0, -9.8]}>
        {/* Meja Kayu Lapak Kelapa Muda */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.25, 0.92, 1.05]} />
          <meshStandardMaterial color="#7d5636" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.96, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.38, 0.07, 1.18]} />
          <meshStandardMaterial color="#a67c52" roughness={0.68} />
        </mesh>

        {/* Spanduk Depan "ES KELAPA MUDA · PAK HASAN" */}
        <mesh position={[0, 0.56, 0.54]}>
          <planeGeometry args={[2.08, 0.58]} />
          <meshStandardMaterial
            map={coconutBannerTex}
            emissiveMap={coconutBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.52 : 0.08}
          />
        </mesh>

        {/* Tumpukan Kelapa Muda Hijau Segar di Kiri & Atas Meja */}
        {[
          [-0.75, 1.12, 0.16],
          [-0.5, 1.12, 0.18],
          [-0.63, 1.12, -0.06],
          [-0.62, 1.32, 0.08],
          [-0.86, 1.12, -0.08],
          [-0.35, 1.12, -0.05],
          [-1.38, 0.16, 0.18],
          [-1.38, 0.16, -0.14],
          [-1.22, 0.34, 0.02],
        ].map(([cx, cy, cz], ci) => (
          <mesh key={`coco-${ci}`} position={[cx, cy, cz]} castShadow>
            <sphereGeometry args={[0.135, 10, 10]} />
            <meshStandardMaterial color={ci % 2 === 0 ? '#3f8c46' : '#4fa150'} roughness={0.68} />
          </mesh>
        ))}

        {/* Kelapa Terkupas Siap Saji dengan Sedotan Merah di Tengah Meja */}
        <group position={[0.08, 1.0, 0.14]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial color="#48994d" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.072, 0.085, 0.03, 10]} />
            <meshStandardMaterial color="#f5efe2" roughness={0.75} />
          </mesh>
          <mesh position={[0.02, 0.26, 0]} rotation={[0.15, 0, -0.25]}>
            <cylinderGeometry args={[0.009, 0.009, 0.18, 6]} />
            <meshStandardMaterial color="#e8534a" roughness={0.4} />
          </mesh>
        </group>

        {/* Kotak Pendingin Es Batu Biru-Putih & Botol Sirup Cocopandan */}
        <mesh position={[0.68, 1.18, -0.08]} castShadow>
          <boxGeometry args={[0.62, 0.38, 0.42]} />
          <meshStandardMaterial color="#2563eb" roughness={0.45} />
        </mesh>
        <mesh position={[0.68, 1.38, -0.08]}>
          <boxGeometry args={[0.64, 0.06, 0.44]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0.28, 1.14, -0.22]} castShadow>
          <cylinderGeometry args={[0.042, 0.045, 0.28, 10]} />
          <meshStandardMaterial color="#e11d48" roughness={0.25} transparent opacity={0.88} />
        </mesh>
        <mesh position={[0.14, 1.14, -0.24]} castShadow>
          <cylinderGeometry args={[0.042, 0.045, 0.28, 10]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.25} transparent opacity={0.88} />
        </mesh>

        {/* Payung Tenda Besar Hijau-Krem Menaungi Lapak + Bohlam Hangat */}
        <mesh position={[0, 1.48, -0.18]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 2.95, 10]} />
          <meshStandardMaterial color="#593e28" roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.95, -0.18]} castShadow>
          <coneGeometry args={[2.15, 0.68, 12]} />
          <meshStandardMaterial color="#1f7a4c" roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.52, 0.18]}>
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshStandardMaterial
            color="#fff2c6"
            emissive="#ffb84d"
            emissiveIntensity={isEveningOrNight ? 3.0 : 0.25}
          />
        </mesh>
        {isEveningOrNight && (
          <pointLight position={[0, 2.4, 0.2]} color="#ffc872" intensity={10} distance={14} decay={1.8} />
        )}

        {/* Pak Hasan Berdiri Ramah di Balik Lapak */}
        <group position={[0, 0, -1.05]} rotation={[0, 0, 0]}>
          <HumanModel
            profile={PAK_HASAN_PROFILE}
            headRef={hasanHeadRef}
            rightArmRef={hasanRightArmRef}
          />
        </group>
      </group>

      {/* Meja Payung Santai & Bangku Kayu Menghadap Danau Senja ([-81.6, 0, -9.6]) */}
      <group position={[-81.6, 0, -9.6]}>
        {/* Meja Bundar Kayu */}
        <mesh position={[0, 0.36, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.72, 10]} />
          <meshStandardMaterial color="#5c3e26" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.62, 0.07, 16]} />
          <meshStandardMaterial color="#966c44" roughness={0.68} />
        </mesh>
        {/* Payung Parasol Krem-Hijau di Tengah Meja */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.035, 2.2, 8]} />
          <meshStandardMaterial color="#6e4d30" roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.62, 0]} castShadow>
          <coneGeometry args={[1.45, 0.45, 12]} />
          <meshStandardMaterial color="#efe3c8" roughness={0.78} />
        </mesh>
        {/* Bangku Kayu Santai di Sisi Selatan Meja (menghadap Utara ke Danau Senja) */}
        <mesh position={[0, 0.42, 1.05]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.09, 0.44]} />
          <meshStandardMaterial color="#875d39" roughness={0.78} />
        </mesh>
        {[-0.65, 0.65].map((bx, bi) => (
          <mesh key={`cb-${bi}`} position={[bx, 0.21, 1.05]} castShadow>
            <boxGeometry args={[0.1, 0.42, 0.38]} />
            <meshStandardMaterial color="#4f3520" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 2. BARISAN GEMBOK KENANGAN & LAMPU SENAR HANGAT PAGAR JEMBATAN       */}
      {/* ==================================================================== */}
      <group position={[-48, 0.14, 0]}>
        {/* 32 Gembok Kenangan Warna-Warni Metalik di Pagar Utara & Selatan */}
        {bridgePadlocks.map((lk, idx) => (
          <group
            key={`padlock-${idx}`}
            position={[lk.x - -48, lk.y, lk.z]}
            rotation={[0, 0, lk.rotZ]}
          >
            {/* Lengkungan Kunci (Shackle) */}
            <mesh position={[0, 0.055, 0]}>
              <torusGeometry args={[0.026, 0.007, 6, 12, Math.PI]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
            {/* Badan Gembok Metalik */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.068, 0.082, 0.032]} />
              <meshStandardMaterial color={lk.col} metalness={0.58} roughness={0.36} />
            </mesh>
          </group>
        ))}

        {/* Gembok Tembaga Spesial "D & N — 2019" di Pagar Selatan ([-44.5, 0.84, 6.45]) */}
        <group position={[3.5, 0.72, 6.44]}>
          <mesh position={[0, 0.075, 0]}>
            <torusGeometry args={[0.036, 0.009, 8, 14, Math.PI]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.095, 0.115, 0.042]} />
            <meshStandardMaterial
              color="#d48c46"
              emissive={isEveningOrNight ? '#d98236' : '#000000'}
              emissiveIntensity={isEveningOrNight ? 0.35 : 0}
              metalness={0.72}
              roughness={0.28}
            />
          </mesh>
          <mesh position={[0, 0.005, -0.024]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.4} />
          </mesh>
        </group>

        {/* Untaian 40 Bohlam Lampu Senar Hangat di Kedua Pagar Jembatan */}
        {bridgeFairyBulbs.map((b, bi) => (
          <group key={`bfairy-${bi}`} position={[b.x - -48, b.y, b.z]}>
            <mesh>
              <sphereGeometry args={[0.042, 8, 8]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fff2c2' : '#cfd6de'}
                emissive={isEveningOrNight ? '#ffba52' : '#000000'}
                emissiveIntensity={isDarkNight ? 3.2 : isEveningOrNight ? 2.1 : 0}
                roughness={0.25}
              />
            </mesh>
            {isEveningOrNight && settings.cinematicGlow && bi % 2 === 0 && (
              <sprite scale={isDarkNight ? [0.68, 0.68, 1] : [0.5, 0.5, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffc870"
                  transparent
                  opacity={isDarkNight ? 0.55 : 0.35}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        ))}

        {/* Garis Kabel Senar Tipis Sepanjang Pagar Utara & Selatan */}
        {[-6.52, 6.52].map((rz, ci) => (
          <mesh key={`bcab-${ci}`} position={[0, 1.01, rz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 18.6, 6]} />
            <meshStandardMaterial color="#252c36" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 3. DUA WARGA PEMANCING SANTAI DI BANTARAN SUNGAI KOTA                */}
      {/* ==================================================================== */}
      {/* Pak Karno di Tanggul Timur Utara Jembatan (menghadap Barat ke sungai) */}
      <RiverbankAngler
        position={[-38.8, 0, -14.8]}
        rotationY={-Math.PI / 2}
        profile={PAK_KARNO_PROFILE}
        showUmbrella={showAnglerUmbrella}
        phaseOffset={0.5}
      />

      {/* Mas Yudi di Tanggul Barat Selatan (menghadap Timur ke sungai) */}
      {settings.graphicsQuality !== 'low' && (
        <RiverbankAngler
          position={[-57.4, 0, 25.2]}
          rotationY={Math.PI / 2}
          profile={MAS_YUDI_PROFILE}
          showUmbrella={showAnglerUmbrella}
          phaseOffset={2.7}
        />
      )}
    </group>
  );
};
