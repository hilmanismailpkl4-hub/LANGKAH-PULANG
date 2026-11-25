import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface RiversideNightMarketProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const BANG_UDIN_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Bang Udin',
  role: 'Penjual Martabak & Kacang Rebus',
  accentColor: '#f5b963',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#2d596b',
    pantsColor: '#282d36',
    skinColor: '#cfa07a',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

const LANTERN_PALETTE = ['#ffb44c', '#e85d3f', '#ffe09e', '#f2843a'];

interface LanternPlacement {
  x: number;
  y: number;
  z: number;
  color: string;
  phase: number;
  scale: number;
}

interface CableSegment {
  pos: [number, number, number];
  quat: THREE.Quaternion;
  length: number;
}

function createMartabakBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  // Latar biru dongker hangat khas gerobak martabak malam Indonesia
  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#13314a');
  grad.addColorStop(0.5, '#194261');
  grad.addColorStop(1, '#122b40');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  // Garis bingkai kuning keemasan
  ctx.strokeStyle = '#f7c454';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  // Pita aksen merah bata di bawah
  ctx.fillStyle = '#c44530';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#ffdf78';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MARTABAK MANIS', 320, 56);

  ctx.fillStyle = '#fff5de';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('& KACANG REBUS BANG UDIN', 320, 98);

  ctx.fillStyle = '#fff4d4';
  ctx.font = '600 20px sans-serif';
  ctx.fillText('COKELAT KEJU · KACANG HANGAT · TEPI SUNGAI', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Uap tipis mengepul hangat dari dandang kacang rebus & loyang martabak manis.
 */
const CartSteamPlume: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 4; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = (((t * 0.48 + i * 0.25) % 1) + 1) % 1;
      m.position.y = p * 0.72 * scale;
      m.position.x = Math.sin(t * 1.9 + i * 1.6) * 0.08 * p * scale;
      m.position.z = Math.cos(t * 1.5 + i * 2.1) * 0.07 * p * scale;
      const s = (0.45 + p * 1.3) * scale;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.3;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`cs-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#fff8eb" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Membangun untaian titik catenary halus antara dua titik 3D + segmen kabel penghubung.
 */
function buildCatenarySpan(
  start: [number, number, number],
  end: [number, number, number],
  sag: number,
  lanternCount: number,
  phaseOffset: number,
  scale = 1,
): { lanterns: LanternPlacement[]; cables: CableSegment[] } {
  const lanterns: LanternPlacement[] = [];
  const cables: CableSegment[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const segCount = Math.max(4, lanternCount + 1);
  const pts: THREE.Vector3[] = [];

  for (let i = 0; i <= segCount; i++) {
    const u = i / segCount;
    const x = THREE.MathUtils.lerp(start[0], end[0], u);
    const z = THREE.MathUtils.lerp(start[2], end[2], u);
    const baseY = THREE.MathUtils.lerp(start[1], end[1], u);
    const drop = Math.sin(u * Math.PI) * sag;
    pts.push(new THREE.Vector3(x, baseY - drop, z));
  }

  for (let i = 0; i < segCount; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dir = new THREE.Vector3().subVectors(b, a);
    const length = dir.length();
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.normalize());
    cables.push({ pos: [mid.x, mid.y, mid.z], quat, length });
  }

  for (let i = 1; i <= lanternCount; i++) {
    const u = i / (lanternCount + 1);
    const x = THREE.MathUtils.lerp(start[0], end[0], u);
    const z = THREE.MathUtils.lerp(start[2], end[2], u);
    const baseY = THREE.MathUtils.lerp(start[1], end[1], u);
    const drop = Math.sin(u * Math.PI) * sag;
    lanterns.push({
      x,
      y: baseY - drop - 0.24 * scale,
      z,
      color: LANTERN_PALETTE[(i + phaseOffset) % LANTERN_PALETTE.length],
      phase: (i + phaseOffset) * 0.77,
      scale,
    });
  }

  return { lanterns, cables };
}

/**
 * Suasana Malam Tepi Sungai & Dermaga:
 * 1. Untaian lampion kertas hangat bergoyang lembut sepanjang tanggul sungai & melengkung di atas air + Dermaga Danau Senja.
 * 2. Gerobak Martabak Manis & Kacang Rebus Bang Udin lengkap dengan loyang, panci dandang mengepul, & bangku santai tepi sungai.
 */
export const RiversideNightMarket: React.FC<RiversideNightMarketProps> = ({ timeOfDay, settings }) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const martabakBanner = useMemo(() => createMartabakBannerTexture(), []);
  const lanternRefs = useRef<(THREE.Group | null)[]>([]);
  const udinHeadRef = useRef<THREE.Group>(null);
  const udinRightArmRef = useRef<THREE.Group>(null);
  const udinLeftArmRef = useRef<THREE.Group>(null);

  const isNight = timeOfDay === 'night';
  const isEveningOrNight = timeOfDay !== 'morning';
  const showRichDetails = settings.graphicsQuality !== 'low';

  // Tiang besi ramping sepanjang tepi tanggul timur & barat Sungai Kota
  const riverPoles = useMemo<[number, number, number][]>(
    () => [
      // Tanggul Timur (x = -39.75) — Selatan Jembatan (Promenade Utama)
      [-39.75, 0, 9.5],
      [-39.75, 0, 19.5],
      [-39.75, 0, 29.5],
      [-39.75, 0, 39.5],
      // Tanggul Timur — Utara Jembatan
      [-39.75, 0, -9.5],
      [-39.75, 0, -19.5],
      [-39.75, 0, -29.5],
      // Tanggul Barat (x = -56.25) — Selatan Jembatan
      [-56.25, 0, 9.5],
      [-56.25, 0, 19.5],
      [-56.25, 0, 29.5],
      [-56.25, 0, 39.5],
      // Tanggul Barat — Utara Jembatan
      [-56.25, 0, -9.5],
      [-56.25, 0, -19.5],
      [-56.25, 0, -29.5],
    ],
    [],
  );

  // Tiang kayu tipis tambahan di 4 sudut Dermaga Danau Senja untuk untaian lampion dermaga
  const pierArchPosts = useMemo<[number, number, number][]>(
    () => [
      [-77.4, 0.14, -26.05],
      [-73.0, 0.14, -26.05],
      [-73.0, 0.14, -29.95],
      [-77.4, 0.14, -29.95],
    ],
    [],
  );

  // Seluruh untaian kabel & lampion kertas (tepi sungai, melintas atas sungai, & dermaga danau)
  const { allLanterns, allCables } = useMemo(() => {
    const lanterns: LanternPlacement[] = [];
    const cables: CableSegment[] = [];
    const addSpan = (
      a: [number, number, number],
      b: [number, number, number],
      sag: number,
      count: number,
      phase: number,
      scale = 1,
    ) => {
      const built = buildCatenarySpan(a, b, sag, count, phase, scale);
      lanterns.push(...built.lanterns);
      cables.push(...built.cables);
    };

    const poleTopY = 4.65;
    // 1. Untaian sejajar Tanggul Timur (Promenade selatan & utara)
    addSpan([-39.75, poleTopY, 9.5], [-39.75, poleTopY, 19.5], 0.55, 3, 1);
    addSpan([-39.75, poleTopY, 19.5], [-39.75, poleTopY, 29.5], 0.55, 3, 4);
    addSpan([-39.75, poleTopY, 29.5], [-39.75, poleTopY, 39.5], 0.55, 3, 7);
    addSpan([-39.75, poleTopY, -9.5], [-39.75, poleTopY, -19.5], 0.55, 3, 10);
    addSpan([-39.75, poleTopY, -19.5], [-39.75, poleTopY, -29.5], 0.55, 3, 13);

    // 2. Untaian sejajar Tanggul Barat
    addSpan([-56.25, poleTopY, 9.5], [-56.25, poleTopY, 19.5], 0.55, 3, 2);
    addSpan([-56.25, poleTopY, 19.5], [-56.25, poleTopY, 29.5], 0.55, 3, 5);
    addSpan([-56.25, poleTopY, 29.5], [-56.25, poleTopY, 39.5], 0.55, 3, 8);
    addSpan([-56.25, poleTopY, -9.5], [-56.25, poleTopY, -19.5], 0.55, 3, 11);
    addSpan([-56.25, poleTopY, -19.5], [-56.25, poleTopY, -29.5], 0.55, 3, 14);

    // 3. Untaian melengkung melintasi atas permukaan air Sungai Kota (pemandangan sinematik dari jembatan!)
    addSpan([-56.25, poleTopY + 0.1, 19.5], [-39.75, poleTopY + 0.1, 19.5], 0.92, 5, 3, 1.08);
    addSpan([-56.25, poleTopY + 0.1, 29.5], [-39.75, poleTopY + 0.1, 29.5], 0.92, 5, 6, 1.08);
    addSpan([-56.25, poleTopY + 0.1, -19.5], [-39.75, poleTopY + 0.1, -19.5], 0.92, 5, 9, 1.08);

    // 4. Untaian Lampion Kertas Hangat di Dermaga Kayu Danau Senja (tinggi 3.35m, lega dilewati!)
    addSpan([-77.4, 3.35, -26.05], [-73.0, 3.35, -26.05], 0.34, 3, 15, 0.88);
    addSpan([-77.4, 3.35, -29.95], [-73.0, 3.35, -29.95], 0.34, 3, 18, 0.88);
    addSpan([-77.4, 3.35, -26.05], [-77.4, 3.35, -29.95], 0.3, 2, 21, 0.88);

    return { allLanterns: lanterns, allCables: cables };
  }, []);

  // Animasi goyangan angin lembut pada lampion & aktivitas Bang Udin mengolah martabak
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const windStrength = timeOfDay === 'rain_dusk' ? 0.14 : 0.075;

    for (let i = 0; i < lanternRefs.current.length; i++) {
      const grp = lanternRefs.current[i];
      if (!grp) continue;
      const meta = allLanterns[i];
      if (!meta) continue;
      grp.rotation.z = Math.sin(t * 1.45 + meta.phase) * windStrength;
      grp.rotation.x = Math.cos(t * 1.15 + meta.phase * 1.3) * (windStrength * 0.7);
    }

    if (udinHeadRef.current) {
      udinHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.24;
      udinHeadRef.current.rotation.x = -0.1 + Math.sin(t * 1.6) * 0.04;
    }
    if (udinRightArmRef.current) {
      // Gerakan santai menaburkan topping / membalik spatula martabak
      udinRightArmRef.current.rotation.x = -0.68 + Math.sin(t * 2.6) * 0.16;
      udinRightArmRef.current.rotation.z = 0.08 + Math.cos(t * 2.2) * 0.08;
    }
    if (udinLeftArmRef.current) {
      udinLeftArmRef.current.rotation.x = -0.42 + Math.cos(t * 1.9) * 0.08;
    }
  });

  const lanternEmissiveInt = isNight ? 3.1 : isEveningOrNight ? 2.25 : 0.08;
  const glowOpacity = isNight ? 0.68 : isEveningOrNight ? 0.5 : 0;

  return (
    <group>
      {/* === 1. TIANG & UNTAIAN LAMPION KERTAS TEPI SUNGAI + DERMAGA DANAU === */}
      {riverPoles.map(([px, py, pz], idx) => (
        <group key={`rl-pole-${idx}`} position={[px, py, pz]}>
          <mesh position={[0, 2.38, 0]} castShadow={showRichDetails}>
            <cylinderGeometry args={[0.048, 0.072, 4.76, 8]} />
            <meshStandardMaterial color="#2b313a" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0, 4.78, 0]}>
            <sphereGeometry args={[0.085, 8, 8]} />
            <meshStandardMaterial color="#d4a456" metalness={0.65} roughness={0.32} />
          </mesh>
        </group>
      ))}

      {/* Tiang Kayu Tinggi Dermaga Danau Senja untuk Lampion Gantung */}
      {pierArchPosts.map(([px, py, pz], idx) => (
        <mesh key={`pier-lp-${idx}`} position={[px, py + 1.62, pz]} castShadow={showRichDetails}>
          <cylinderGeometry args={[0.055, 0.075, 3.24, 8]} />
          <meshStandardMaterial color="#4a3322" roughness={0.88} />
        </mesh>
      ))}

      {/* Kabel Untaian Hitam Tipis */}
      {allCables.map((seg, idx) => (
        <mesh key={`lcab-${idx}`} position={seg.pos} quaternion={seg.quat}>
          <cylinderGeometry args={[0.012, 0.012, seg.length, 5]} />
          <meshStandardMaterial color="#1f2329" roughness={0.8} />
        </mesh>
      ))}

      {/* Lampion Kertas Hangat Bergoyang Pelan + Rumbai Bawah + Halo Cahaya */}
      {allLanterns.map((ln, idx) => (
        <group
          key={`lantern-${idx}`}
          ref={(el) => {
            lanternRefs.current[idx] = el;
          }}
          position={[ln.x, ln.y + 0.22 * ln.scale, ln.z]}
          scale={ln.scale}
        >
          {/* Tali gantung tipis */}
          <mesh position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 5]} />
            <meshStandardMaterial color="#23201e" roughness={0.8} />
          </mesh>
          {/* Tutup bambu atas & bawah */}
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.035, 10]} />
            <meshStandardMaterial color="#3b2618" roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.035, 10]} />
            <meshStandardMaterial color="#3b2618" roughness={0.75} />
          </mesh>
          {/* Badan Lampion Kertas Berpendar Hangat */}
          <mesh position={[0, -0.38, 0]} scale={[1, 1.24, 1]}>
            <sphereGeometry args={[0.19, 12, 10]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fff2d1' : ln.color}
              emissive={ln.color}
              emissiveIntensity={lanternEmissiveInt}
              roughness={0.55}
            />
          </mesh>
          {/* Rumbai benang emas/merah di bawah lampion */}
          <mesh position={[0, -0.69, 0]}>
            <cylinderGeometry args={[0.016, 0.008, 0.18, 6]} />
            <meshStandardMaterial color="#d4452f" roughness={0.85} />
          </mesh>
          {/* Halo Cahaya Hangat pada Lampion saat Senja & Malam */}
          {isEveningOrNight && settings.cinematicGlow && (showRichDetails || idx % 2 === 0) && (
            <sprite position={[0, -0.38, 0]} scale={[2.35, 2.35, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color={ln.color}
                transparent
                opacity={glowOpacity}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      ))}

      {/* Pantulan Cahaya Hangat Lampion di Tepi Sungai & Dermaga saat Senja/Malam */}
      {isEveningOrNight && (
        <>
          <pointLight
            position={[-48.0, 4.1, 20.0]}
            color="#ffaf52"
            intensity={isNight ? 24 : 15}
            distance={28}
            decay={1.6}
          />
          <pointLight
            position={[-48.0, 4.1, 31.5]}
            color="#ff9947"
            intensity={isNight ? 20 : 12}
            distance={26}
            decay={1.6}
          />
          <pointLight
            position={[-48.0, 4.1, -19.5]}
            color="#ffae54"
            intensity={isNight ? 18 : 11}
            distance={26}
            decay={1.6}
          />
          <pointLight
            position={[-75.2, 3.0, -28.0]}
            color="#ffbe68"
            intensity={isNight ? 18 : 11}
            distance={20}
            decay={1.65}
          />
        </>
      )}

      {/* === 2. GEROBAK MARTABAK MANIS & KACANG REBUS BANG UDIN (PROMENADE TEPI SUNGAI) === */}
      <group position={[-36.6, 0, 23.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Roda Karet Gerobak */}
        {[
          [-0.95, 0.36, 0.56],
          [0.95, 0.36, 0.56],
          [-0.95, 0.36, -0.56],
          [0.95, 0.36, -0.56],
        ].map(([wx, wy, wz], idx) => (
          <mesh key={`mw-${idx}`} position={[wx, wy, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.08, 16]} />
            <meshStandardMaterial color="#1f2329" roughness={0.85} />
          </mesh>
        ))}

        {/* Badan Bawah Gerobak Biru Tua Khas Martabak Indonesia */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.45, 0.88, 1.14]} />
          <meshStandardMaterial color="#1e4d6b" roughness={0.72} />
        </mesh>
        {/* Lis Garis Kuning Cerah di Badan Gerobak */}
        <mesh position={[0, 0.82, 0.578]}>
          <boxGeometry args={[2.42, 0.14, 0.02]} />
          <meshStandardMaterial color="#f5be49" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.82, -0.578]}>
          <boxGeometry args={[2.42, 0.14, 0.02]} />
          <meshStandardMaterial color="#f5be49" roughness={0.5} />
        </mesh>
        {/* Meja Counter Aluminium / Stainless Steel */}
        <mesh position={[0, 1.27, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.56, 0.07, 1.24]} />
          <meshStandardMaterial color="#cfd6de" metalness={0.62} roughness={0.28} />
        </mesh>

        {/* Etalase Kaca Transparan Sisi Kanan (Susunan Topping: Susu Kental Manis, Mesis, Keju, Kotak Martabak) */}
        <group position={[0.56, 1.62, 0.02]}>
          <mesh>
            <boxGeometry args={[1.08, 0.64, 0.78]} />
            <meshPhysicalMaterial
              color="#eaf5ff"
              transparent
              opacity={0.34}
              roughness={0.12}
              metalness={0.05}
              clearcoat={0.85}
            />
          </mesh>
          {/* Tumpukan Kotak Kertas Martabak */}
          <mesh position={[0.28, -0.22, 0]} castShadow>
            <boxGeometry args={[0.32, 0.18, 0.32]} />
            <meshStandardMaterial color="#f7efe1" roughness={0.78} />
          </mesh>
          {/* Kaleng Susu Kental Manis & Toples Mesis Cokelat */}
          <mesh position={[-0.25, -0.22, 0.16]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.15, 10]} />
            <meshStandardMaterial color="#f2eadc" roughness={0.35} />
          </mesh>
          <mesh position={[-0.08, -0.22, 0.16]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.16, 10]} />
            <meshStandardMaterial color="#4a2818" roughness={0.4} />
          </mesh>
          <mesh position={[-0.18, -0.24, -0.12]} castShadow>
            <boxGeometry args={[0.2, 0.12, 0.14]} />
            <meshStandardMaterial color="#f5d56c" roughness={0.55} />
          </mesh>
        </group>

        {/* Kompor & Loyang Besi Cor Martabak Manis (Tengah) */}
        <group position={[-0.28, 1.33, 0.08]}>
          {/* Tungku Kompor Bulat */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.28, 0.1, 16]} />
            <meshStandardMaterial color="#2a2d33" metalness={0.65} roughness={0.45} />
          </mesh>
          {/* Loyang Martabak Tebal + Adonan Kuning Emas + Taburan Cokelat */}
          <mesh position={[0, 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.23, 0.08, 18]} />
            <meshStandardMaterial color="#1f2126" metalness={0.7} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.165, 0]}>
            <cylinderGeometry args={[0.215, 0.215, 0.03, 16]} />
            <meshStandardMaterial color="#ebb852" roughness={0.65} />
          </mesh>
          <mesh position={[0.03, 0.182, 0.02]}>
            <cylinderGeometry args={[0.14, 0.14, 0.012, 12]} />
            <meshStandardMaterial color="#4f2c1b" roughness={0.7} />
          </mesh>
          <CartSteamPlume position={[0, 0.22, 0]} scale={0.65} />
        </group>

        {/* Panci Dandang Kacang Rebus Mengepul + Bakul Bambu Penuh Kacang (Kiri) */}
        <group position={[-0.92, 1.32, 0.02]}>
          <mesh position={[0, 0.19, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.2, 0.36, 16]} />
            <meshStandardMaterial color="#b4bcc7" metalness={0.75} roughness={0.28} />
          </mesh>
          {/* Tumpukan Kacang Rebus Hangat di Atas Dandang */}
          <mesh position={[0, 0.38, 0]} castShadow>
            <sphereGeometry args={[0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#c49a6c" roughness={0.9} />
          </mesh>
          <CartSteamPlume position={[0, 0.44, 0]} scale={0.95} />
        </group>

        {/* 4 Tiang Rangka Atas & Atap Gerobak */}
        {[
          [-1.18, 1.88, -0.54],
          [1.18, 1.88, -0.54],
          [-1.18, 1.88, 0.54],
          [1.18, 1.88, 0.54],
        ].map(([tx, ty, tz], idx) => (
          <mesh key={`mp-${idx}`} position={[tx, ty, tz]} castShadow>
            <boxGeometry args={[0.07, 1.24, 0.07]} />
            <meshStandardMaterial color="#d4dbe3" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        {/* Atap Kanopi Miring */}
        <mesh position={[0, 2.56, 0]} rotation={[0.07, 0, 0]} castShadow>
          <boxGeometry args={[2.86, 0.1, 1.66]} />
          <meshStandardMaterial color="#274c6b" roughness={0.75} />
        </mesh>

        {/* Spanduk Backlit Martabak Manis & Kacang Rebus Depan & Belakang */}
        <mesh position={[0, 2.26, 0.62]}>
          <planeGeometry args={[2.46, 0.62]} />
          <meshStandardMaterial
            map={martabakBanner}
            emissiveMap={martabakBanner}
            emissive="#ffe2a8"
            emissiveIntensity={isEveningOrNight ? 0.85 : 0.14}
          />
        </mesh>
        <mesh position={[0, 2.26, -0.62]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.46, 0.62]} />
          <meshStandardMaterial
            map={martabakBanner}
            emissiveMap={martabakBanner}
            emissive="#ffe2a8"
            emissiveIntensity={isEveningOrNight ? 0.85 : 0.14}
          />
        </mesh>

        {/* Lampu Neon Hangat & Bohlam Gerobak */}
        <mesh position={[0, 2.34, 0.08]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial
            color="#fff2c9"
            emissive="#ffbd59"
            emissiveIntensity={isEveningOrNight ? 3.2 : 0.45}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.32, 0.08]} scale={[2.8, 2.8, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc970"
              transparent
              opacity={0.78}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight position={[0, 2.2, 0.55]} color="#ffc873" intensity={14} distance={16} decay={1.7} />
        )}
      </group>

      {/* Penjual Ramah: Bang Udin di Balik Gerobak Martabak */}
      <group position={[-37.55, 0, 23.8]} rotation={[0, Math.PI / 2, 0]}>
        <HumanModel
          profile={BANG_UDIN_PROFILE}
          headRef={udinHeadRef}
          leftArmRef={udinLeftArmRef}
          rightArmRef={udinRightArmRef}
        />
      </group>

      {/* === 3. BANGKU KAYU & MEJA KECIL TEPI SUNGAI (MENGHADAP PANTULAN LAMPION AIR SUNGAI!) === */}
      <group position={[-38.2, 0, 20.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Bangku Kayu Panjang */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.1, 0.52]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.82} />
        </mesh>
        <mesh position={[-0.86, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.46]} />
          <meshStandardMaterial color="#30353d" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.86, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.46]} />
          <meshStandardMaterial color="#30353d" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Meja Kayu Rendah di Depan Bangku (Sisi Sungai) */}
        <mesh position={[0, 0.52, 0.72]} castShadow receiveShadow>
          <boxGeometry args={[1.22, 0.07, 0.54]} />
          <meshStandardMaterial color="#7d5434" roughness={0.78} />
        </mesh>
        <mesh position={[-0.5, 0.26, 0.72]} castShadow>
          <boxGeometry args={[0.08, 0.52, 0.46]} />
          <meshStandardMaterial color="#4f341f" roughness={0.88} />
        </mesh>
        <mesh position={[0.5, 0.26, 0.72]} castShadow>
          <boxGeometry args={[0.08, 0.52, 0.46]} />
          <meshStandardMaterial color="#4f341f" roughness={0.88} />
        </mesh>
      </group>
    </group>
  );
};
