import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface CraftAndPingPongLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const PAK_UJANG_PROFILE: CharacterProfile = {
  id: 'pak_darman',
  name: 'Pak Ujang',
  role: 'Tukang Sol Sepatu Pinggir Jalan',
  accentColor: '#d97706',
  voice: { pitch: 0.9, rate: 0.96, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.66,
    shirtColor: '#6b7d65',
    pantsColor: '#2d333d',
    skinColor: '#c79670',
    hairColor: '#52525b',
    accentProp: 'apron',
  },
};

const MBAK_YUNI_PROFILE: CharacterProfile = {
  id: 'mbak_lilis',
  name: 'Mbak Yuni',
  role: 'Penjual Gorengan Hangat Sore',
  accentColor: '#f59e0b',
  voice: { pitch: 1.06, rate: 1.0, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.6,
    shirtColor: '#d97746',
    pantsColor: '#272c36',
    skinColor: '#d6a682',
    hairColor: '#211b18',
    accentProp: 'apron',
  },
};

function createCobblerSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 256;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(0, 0, 384, 256);
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 10;
  ctx.strokeRect(8, 8, 368, 240);

  ctx.fillStyle = '#78350f';
  ctx.fillRect(14, 14, 356, 62);
  ctx.fillStyle = '#fefce8';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SOL SEPATU', 192, 46);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('PAK UJANG', 192, 118);

  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('JAHIT TANGAN · SEMIR · LEM', 192, 166);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('RAPI · KUAT · BISA DITUNGGU', 192, 206);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createGorenganBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#b45309');
  grad.addColorStop(0.5, '#d97706');
  grad.addColorStop(1, '#92400e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GORENGAN HANGAT', 320, 54);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('MBAK YUNI · BARU ANGKAT DARI WAJAN', 320, 96);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('TAHU ISI · TEMPE MENDOAN · PISANG GORENG · BAKWAN', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createPingPongSurfaceTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 288;
  const ctx = c.getContext('2d')!;

  // Permukaan meja tenis meja biru tua matte standar turnamen RT
  ctx.fillStyle = '#1b4372';
  ctx.fillRect(0, 0, 512, 288);

  // Garis tepi putih tegas
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 492, 268);

  // Garis tengah pembagi nomor ganda
  ctx.fillStyle = 'rgba(248, 250, 252, 0.92)';
  ctx.fillRect(10, 142, 492, 4);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createScoreboardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 246, 118);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TENIS MEJA RT 04', 128, 28);

  // Kartu angka kiri & kanan
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(28, 44, 78, 66);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(150, 44, 78, 66);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText('05', 67, 78);
  ctx.fillText('04', 189, 78);
  ctx.fillText(':', 128, 76);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const GorenganSteam: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 4; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = (((t * 0.56 + i * 0.25) % 1) + 1) % 1;
      m.position.y = p * 0.68;
      m.position.x = Math.sin(t * 2.2 + i * 1.4) * 0.08 * p;
      m.position.z = Math.cos(t * 1.8 + i * 1.7) * 0.06 * p;
      const s = 0.42 + p * 1.2;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.34;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`gs-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.072, 8, 8]} />
          <meshBasicMaterial color="#fff8e8" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Opsi 2 — Sudut Santai & Kerajinan Warga:
 * 1. Lapak Sol Sepatu Pak Ujang ([11.2, 0, 21.8]) — payung lapak, kotak sol kayu, paron & ketukan palu lembut
 * 2. Lapak Gorengan Hangat Sore Mbak Yuni ([-11.2, 0, 31.4]) — wajan mengepul, tahu isi/mendoan/pisang goreng & kuliner [E]
 * 3. Meja Ping-Pong Kompleks Perumahan Melati ([33.2, 0, 58.6]) — animasi reli bola & bet "tik-tok!" [E]
 */
export const CraftAndPingPongLife: React.FC<CraftAndPingPongLifeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const cobblerSignTex = useMemo(() => createCobblerSignTexture(), []);
  const gorenganBannerTex = useMemo(() => createGorenganBannerTexture(), []);
  const tableTex = useMemo(() => createPingPongSurfaceTexture(), []);
  const scoreTex = useMemo(() => createScoreboardTexture(), []);

  const isEveningOrNight = timeOfDay !== 'morning';

  // Refs Pak Ujang
  const ujangHeadRef = useRef<THREE.Group>(null);
  const ujangRightArmRef = useRef<THREE.Group>(null);

  // Refs Mbak Yuni
  const yuniHeadRef = useRef<THREE.Group>(null);
  const yuniRightArmRef = useRef<THREE.Group>(null);

  // Refs Reli Ping-Pong Kompleks Melati
  const ballRef = useRef<THREE.Mesh>(null);
  const paddleLRef = useRef<THREE.Group>(null);
  const paddleRRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // === 1. ANIMASI PAK UJANG MENJAHIT & MENGETUK SOL SEPATU ===
    const distUjang = py > 4 ? 99 : Math.hypot(px - 11.2, pz - 21.8);
    if (ujangHeadRef.current) {
      ujangHeadRef.current.rotation.x = distUjang < 4.5 ? 0.05 : 0.22;
      ujangHeadRef.current.rotation.y = distUjang < 4.5 ? Math.sin(t * 1.1) * 0.16 : Math.sin(t * 0.7) * 0.08;
    }
    if (ujangRightArmRef.current) {
      // Gerakan tangan terampil menjahit/mengetuk halus sol sepatu
      ujangRightArmRef.current.rotation.x = -0.95 + Math.sin(t * 5.2) * 0.18;
      ujangRightArmRef.current.rotation.z = -0.12;
    }

    // === 2. ANIMASI MBAK YUNI MENIRIKAN GORENGAN HANGAT ===
    const distYuni = py > 4 ? 99 : Math.hypot(px - -11.2, pz - 31.4);
    if (yuniHeadRef.current) {
      yuniHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.24;
    }
    if (yuniRightArmRef.current) {
      yuniRightArmRef.current.rotation.x =
        distYuni < 6.0 ? -1.45 + Math.sin(t * 5.8) * 0.2 : -0.78 + Math.sin(t * 2.2) * 0.12;
      yuniRightArmRef.current.rotation.z = distYuni < 6.0 ? 0.2 : 0;
    }

    // === 3. ANIMASI RELI PING-PONG KOMPLEKS MELATI ("TIK-TOK-TIK-TOK!") ===
    if (playerRuntime.pingPongRallyTimer > 0) {
      playerRuntime.pingPongRallyTimer = Math.max(0, playerRuntime.pingPongRallyTimer - dt);
    }
    const rallying = playerRuntime.pingPongRallyTimer > 0;

    if (ballRef.current && paddleLRef.current && paddleRRef.current) {
      if (rallying) {
        // Siklus 1.12 detik bolak-balik kiri -> kanan -> kiri dengan pantulan parabola nyata di atas meja!
        const cyc = (t * 1.75) % 2;
        const goingRight = cyc < 1;
        const p = goingRight ? cyc : cyc - 1;
        const bx = goingRight ? THREE.MathUtils.lerp(-1.24, 1.24, p) : THREE.MathUtils.lerp(1.24, -1.24, p);
        const bz = Math.sin(t * 2.4) * 0.34;
        // Pantulan nyata: melewati net di p=0.45, memantul tepat di permukaan meja (y=0.79) pada p=0.76!
        let by: number;
        if (p < 0.76) {
          const arcP = p / 0.76;
          by = 0.79 + Math.sin(arcP * Math.PI) * 0.34;
        } else {
          const bP = (p - 0.76) / 0.24;
          by = 0.79 + Math.sin(bP * Math.PI * 0.78) * 0.22;
        }
        ballRef.current.position.set(bx, by, bz);

        // Kedua bet terangkat dan mengayun menyongsong bola secara bergantian!
        paddleLRef.current.position.set(-1.38, 0.96 + (goingRight ? 0.05 : 0), bz * 0.65);
        paddleLRef.current.rotation.set(0.15, 0, -0.35 + (goingRight && p < 0.25 ? 0.55 : 0));

        paddleRRef.current.position.set(1.38, 0.96 + (!goingRight ? 0.05 : 0), bz * 0.65);
        paddleRRef.current.rotation.set(0.15, Math.PI, -0.35 + (!goingRight && p < 0.25 ? 0.55 : 0));
      } else {
        // Posisi istirahat rapi di permukaan meja
        ballRef.current.position.set(0.32, 0.792, 0.28);
        paddleLRef.current.position.set(-1.02, 0.785, -0.36);
        paddleLRef.current.rotation.set(Math.PI / 2, 0, 0.45);
        paddleRRef.current.position.set(1.04, 0.785, 0.32);
        paddleRRef.current.rotation.set(Math.PI / 2, 0, -0.55);
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. LAPAK SOL SEPATU PAK UJANG — TROTOAR JL. CEMPAKA ([11.2, 0, 21.8]) */}
      {/* ==================================================================== */}
      <group position={[11.2, 0, 21.8]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Payung Tenda Lapak Lebar Belang Biru-Krem Penahan Panas & Hujan */}
        <mesh position={[0.25, 1.25, -0.45]} castShadow>
          <cylinderGeometry args={[0.032, 0.036, 2.5, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.65} roughness={0.38} />
        </mesh>
        <mesh position={[0.25, 2.52, -0.45]} castShadow>
          <coneGeometry args={[1.48, 0.52, 8]} />
          <meshStandardMaterial color="#1e3a5f" roughness={0.78} />
        </mesh>
        <mesh position={[0.25, 2.54, -0.45]} rotation={[0, Math.PI / 8, 0]}>
          <coneGeometry args={[1.49, 0.5, 4]} />
          <meshStandardMaterial color="#f5e9d3" roughness={0.82} />
        </mesh>

        {/* Kotak Kayu Alat Sol Sepatu Klasik (Workbench) + Paron, Lem & Semir */}
        <group position={[0, 0, 0.25]}>
          <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.78, 0.46, 0.48]} />
            <meshStandardMaterial color="#784f2d" roughness={0.82} />
          </mesh>
          {/* Tutup Kotak Terbuka di Sisi Kanan */}
          <mesh position={[0.42, 0.54, 0]} rotation={[0, 0, -1.25]} castShadow>
            <boxGeometry args={[0.46, 0.04, 0.48]} />
            <meshStandardMaterial color="#664123" roughness={0.84} />
          </mesh>
          {/* Paron Besi Sol Sepatu + Sepatu Kulit Cokelat Sedang Dijahit */}
          <mesh position={[-0.14, 0.54, 0]} castShadow>
            <boxGeometry args={[0.14, 0.14, 0.24]} />
            <meshStandardMaterial color="#374151" metalness={0.78} roughness={0.35} />
          </mesh>
          <mesh position={[-0.14, 0.65, 0.02]} castShadow>
            <boxGeometry args={[0.11, 0.09, 0.26]} />
            <meshStandardMaterial color="#4a2b18" roughness={0.55} />
          </mesh>
          {/* Kaleng Lem Kuning, Kaleng Semir Hitam & Gulungan Benang Nilon */}
          <mesh position={[0.18, 0.53, -0.1]}>
            <cylinderGeometry args={[0.048, 0.048, 0.12, 10]} />
            <meshStandardMaterial color="#eab308" roughness={0.45} />
          </mesh>
          <mesh position={[0.26, 0.5, 0.08]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 10]} />
            <meshStandardMaterial color="#18181b" roughness={0.35} />
          </mesh>
          <mesh position={[0.08, 0.52, 0.12]}>
            <cylinderGeometry args={[0.028, 0.028, 0.09, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
        </group>

        {/* Bangku Kayu Pelanggan Menunggu (sisi depan kanan) */}
        <group position={[0.72, 0, 0.85]}>
          <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.06, 0.36]} />
            <meshStandardMaterial color="#9c6a3b" roughness={0.78} />
          </mesh>
          {[-0.15, 0.15].map((lx, li) => (
            <mesh key={`csl-${li}`} position={[lx, 0.18, 0]} castShadow>
              <boxGeometry args={[0.06, 0.36, 0.3]} />
              <meshStandardMaterial color="#5c3d24" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Papan Kayu "SOL SEPATU PAK UJANG" Bersandar Rapi di Kiri */}
        <group position={[-0.74, 0.44, 0.42]} rotation={[-0.22, 0.25, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.72, 0.5, 0.045]} />
            <meshStandardMaterial color="#6e472b" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0, 0.026]}>
            <planeGeometry args={[0.66, 0.44]} />
            <meshStandardMaterial
              map={cobblerSignTex}
              emissiveMap={cobblerSignTex}
              emissive="#fff6e0"
              emissiveIntensity={isEveningOrNight ? 0.32 : 0.04}
            />
          </mesh>
        </group>

        {/* Bohlam Kecil Teduh di Bawah Payung Saat Sore/Malam */}
        {isEveningOrNight && (
          <>
            <mesh position={[0.15, 2.24, -0.25]}>
              <sphereGeometry args={[0.065, 8, 8]} />
              <meshStandardMaterial color="#fff3c4" emissive="#ffbe55" emissiveIntensity={2.4} />
            </mesh>
            <pointLight position={[0.1, 2.1, 0.1]} color="#ffcb78" intensity={7} distance={8} decay={2} />
          </>
        )}

        {/* Pak Ujang Duduk/Membungkuk Ramah Menjahit Sepatu Menghadap Jl. Cempaka (+Z lokal -> -X dunia) */}
        <group position={[0, -0.18, -0.32]}>
          <HumanModel
            profile={PAK_UJANG_PROFILE}
            headRef={ujangHeadRef}
            rightArmRef={ujangRightArmRef}
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. LAPAK GORENGAN HANGAT MBAK YUNI — JL. CEMPAKA ([-11.2, 0, 31.4])  */}
      {/* ==================================================================== */}
      <group position={[-11.2, 0, 31.4]} rotation={[0, Math.PI / 2, 0]}>
        {/* Badan Gerobak Kayu Kuning-Cokelat Hangat */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.95, 0.78, 0.94]} />
          <meshStandardMaterial color="#b45309" roughness={0.68} />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.06, 0.08, 1.04]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.55} />
        </mesh>
        {/* 2 Roda Gerobak */}
        {[-0.96, 0.96].map((wx, wi) => (
          <mesh key={`gw-${wi}`} position={[wx, 0.32, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.28, 0.04, 8, 18]} />
            <meshStandardMaterial color="#1f232a" roughness={0.85} />
          </mesh>
        ))}

        {/* Etalase Kaca Penuh Gorengan Keemasan (Tahu Isi, Mendoan, Pisang Goreng, Bakwan) */}
        <group position={[-0.4, 1.34, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.98, 0.6, 0.76]} />
            <meshStandardMaterial color="#fffbeb" transparent opacity={0.28} roughness={0.14} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.02, 0.04, 0.8]} />
            <meshStandardMaterial color="#78350f" roughness={0.75} />
          </mesh>
          {/* Rak Nampan Gorengan Bertingkat */}
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.88, 0.035, 0.64]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.55} roughness={0.35} />
          </mesh>
          {[
            [-0.28, -0.12, -0.14, '#d98a2b'],
            [-0.1, -0.12, -0.14, '#c97222'],
            [0.12, -0.12, -0.12, '#e09f3e'],
            [0.28, -0.12, -0.14, '#b8621b'],
            [-0.22, -0.12, 0.14, '#d98a2b'],
            [0.02, -0.12, 0.14, '#e5a93c'],
            [0.24, -0.12, 0.12, '#c97222'],
          ].map(([gx, gy, gz, col], gi) => (
            <mesh key={`gr-${gi}`} position={[gx as number, gy as number, gz as number]} rotation={[0, gi * 0.4, 0]}>
              <boxGeometry args={[0.14, 0.08, 0.12]} />
              <meshStandardMaterial color={col as string} roughness={0.78} />
            </mesh>
          ))}
          {/* Keranjang Mungil Cabai Rawit Hijau di Samping Etalase */}
          <mesh position={[0.38, -0.22, 0.24]}>
            <cylinderGeometry args={[0.09, 0.075, 0.08, 10]} />
            <meshStandardMaterial color="#16a34a" roughness={0.6} />
          </mesh>
        </group>

        {/* Wajan Penggorengan Besi Besar + Api Biru Kompor + Uap Harum Mengepul */}
        <group position={[0.52, 1.12, 0.02]}>
          {/* Tungku Kompor & Pijar Api Biru Halus */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.24, 0.26, 0.08, 12]} />
            <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2.2} />
          </mesh>
          {/* Wajan Cekung Besi Hitam */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <sphereGeometry args={[0.34, 16, 10, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45]} />
            <meshStandardMaterial color="#1f2329" metalness={0.65} roughness={0.42} side={THREE.DoubleSide} />
          </mesh>
          {/* Minyak Goreng Keemasan + 3 Gorengan di Dalam Wajan */}
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.27, 14]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.22} metalness={0.15} />
          </mesh>
          {[-0.08, 0.08, 0].map((fx, fi) => (
            <mesh key={`fw-${fi}`} position={[fx, 0.1, (fi - 1) * 0.07]}>
              <boxGeometry args={[0.09, 0.035, 0.07]} />
              <meshStandardMaterial color="#d97706" roughness={0.65} />
            </mesh>
          ))}
          <GorenganSteam position={[0, 0.16, 0]} />
        </group>

        {/* Tiang & Atap Kanopi Oranye-Krem + Spanduk "GORENGAN HANGAT MBAK YUNI" */}
        {[
          [-0.92, 1.54, -0.44],
          [0.92, 1.54, -0.44],
          [-0.92, 1.54, 0.44],
          [0.92, 1.54, 0.44],
        ].map(([px, py, pz], pi) => (
          <mesh key={`gp-${pi}`} position={[px, py, pz]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 1.08, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 2.14, 0.06]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[2.52, 0.09, 1.72]} />
          <meshStandardMaterial color="#c2410c" roughness={0.76} />
        </mesh>
        <mesh position={[0, 2.09, 0.91]}>
          <boxGeometry args={[2.52, 0.12, 0.04]} />
          <meshStandardMaterial color="#fef08a" roughness={0.75} />
        </mesh>

        {/* Spanduk Depan Gerobak Menghadap Jl. Cempaka (+Z lokal -> +X dunia) */}
        <mesh position={[0, 0.58, 0.49]}>
          <planeGeometry args={[1.82, 0.56]} />
          <meshStandardMaterial
            map={gorenganBannerTex}
            emissiveMap={gorenganBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.08}
          />
        </mesh>

        {/* Bohlam Hangat Gerobak */}
        <mesh position={[0, 1.96, 0.18]}>
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff3c4' : '#e2e8f0'}
            emissive={isEveningOrNight ? '#ffb84d' : '#000000'}
            emissiveIntensity={isEveningOrNight ? 2.6 : 0}
          />
        </mesh>
        {isEveningOrNight && (
          <>
            <pointLight position={[0, 1.9, 0.48]} color="#ffcb78" intensity={10} distance={11} decay={1.8} />
            {settings.cinematicGlow && (
              <sprite position={[0, 1.96, 0.18]} scale={[1.4, 1.4, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffd27a"
                  transparent
                  opacity={0.7}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </>
        )}

        {/* Bangku Kayu Pengunjung di Depan Gerobak (local +1.65 -> world [-9.55, 0, 31.4]) */}
        <group position={[0, 0, 1.65]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.09, 0.44]} />
            <meshStandardMaterial map={textures.woodFloor} color="#9e7147" roughness={0.78} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`gbl-${li}`} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.36]} />
              <meshStandardMaterial color="#5c3d24" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Mbak Yuni Berdiri Ramah di Belakang Gerobak (Menghadap +Z lokal -> +X dunia) */}
        <group position={[0, 0, -1.1]}>
          <HumanModel
            profile={MBAK_YUNI_PROFILE}
            isFemale
            headRef={yuniHeadRef}
            rightArmRef={yuniRightArmRef}
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. MEJA PING-PONG KOMPLEKS PERUMAHAN MELATI ([33.2, 0, 58.6])        */}
      {/* ==================================================================== */}
      <group position={[33.2, 0, 58.6]}>
        {/* Lantai Paving Beton Rapi Lapangan Ping-Pong RT 04 */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <boxGeometry args={[4.4, 0.05, 3.0]} />
          <meshStandardMaterial map={textures.paving} roughness={0.88} />
        </mesh>

        {/* Papan Meja Tenis Meja Standar Biru-Putih (2.74m x 1.52m, tinggi 0.76m) */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.74, 0.045, 1.52]} />
          <meshStandardMaterial color="#0f294a" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.775, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.72, 1.5]} />
          <meshStandardMaterial map={tableTex} roughness={0.5} />
        </mesh>

        {/* Rangka Baja Bawah & 4 Kaki Lipat Kokoh */}
        <mesh position={[0, 0.69, 0]}>
          <boxGeometry args={[2.4, 0.06, 1.24]} />
          <meshStandardMaterial color="#1f2937" metalness={0.65} roughness={0.4} />
        </mesh>
        {[
          [-1.12, 0.36, -0.58],
          [1.12, 0.36, -0.58],
          [-1.12, 0.36, 0.58],
          [1.12, 0.36, 0.58],
        ].map(([lx, ly, lz], li) => (
          <mesh key={`ppl-${li}`} position={[lx, ly, lz]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 0.72, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.68} roughness={0.38} />
          </mesh>
        ))}

        {/* Net Jaring Putih Tengah + Penjepit Baja Kiri & Kanan */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.014, 0.15, 1.62]} />
          <meshStandardMaterial color="#f8fafc" transparent opacity={0.78} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.922, 0]}>
          <boxGeometry args={[0.018, 0.016, 1.62]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        {[-0.81, 0.81].map((nz, ni) => (
          <mesh key={`nc-${ni}`} position={[0, 0.84, nz]} castShadow>
            <boxGeometry args={[0.04, 0.2, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
          </mesh>
        ))}

        {/* 2 Bet Ping-Pong Merah-Hitam + Bola Putih Beranimasi Reli */}
        {[paddleLRef, paddleRRef].map((ref, pi) => (
          <group key={`pad-${pi}`} ref={ref} position={[pi === 0 ? -1.02 : 1.04, 0.785, pi === 0 ? -0.36 : 0.32]}>
            {/* Daun Bet Kayu + Karet Merah/Hitam */}
            <mesh castShadow>
              <cylinderGeometry args={[0.088, 0.088, 0.016, 14]} />
              <meshStandardMaterial color={pi === 0 ? '#dc2626' : '#18181b'} roughness={0.6} />
            </mesh>
            {/* Gagang Kayu Bet */}
            <mesh position={[0, 0, 0.125]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.016, 0.02, 0.11, 8]} />
              <meshStandardMaterial color="#c99a62" roughness={0.75} />
            </mesh>
          </group>
        ))}
        {/* Bola Tenis Meja Putih Cerah */}
        <mesh ref={ballRef} position={[0.32, 0.792, 0.28]} castShadow>
          <sphereGeometry args={[0.024, 10, 10]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fffbeb"
            emissiveIntensity={isEveningOrNight ? 0.85 : 0.2}
          />
        </mesh>

        {/* Tiang Papan Skor RT 04 & Lampu Penerang Meja Malam (sisi selatan z=+1.45 -> world 60.05) */}
        <group position={[0, 0, 1.45]}>
          <mesh position={[0, 1.38, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.044, 2.76, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.45} />
          </mesh>
          {/* Papan Skor "05 : 04" Menghadap Utara (-Z) */}
          <mesh position={[0, 1.24, -0.06]} castShadow>
            <boxGeometry args={[0.56, 0.3, 0.05]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.24, -0.088]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.52, 0.26]} />
            <meshStandardMaterial
              map={scoreTex}
              emissiveMap={scoreTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
            />
          </mesh>
          {/* Lengan Lampu & Bohlam Hangat di Atas Meja Ping-Pong */}
          <mesh position={[0, 2.72, -0.58]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 1.2, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.66, -1.16]}>
            <coneGeometry args={[0.16, 0.12, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.58, -1.16]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#fff3c4' : '#cbd5e1'}
              emissive={isEveningOrNight ? '#ffcb72' : '#000000'}
              emissiveIntensity={isEveningOrNight ? 2.6 : 0}
            />
          </mesh>
          {isEveningOrNight && (
            <pointLight position={[0, 2.45, -1.16]} color="#ffe2a8" intensity={11} distance={12} decay={1.8} />
          )}
        </group>
      </group>
    </group>
  );
};
