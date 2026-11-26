import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface KonterJamuAndLakeBirdScopeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MAS_FAJAR_PROFILE: CharacterProfile = {
  id: 'mas_raka',
  name: 'Mas Fajar',
  role: 'Penjaga Konter Pulsa & Token Listrik Berkah',
  accentColor: '#3b82f6',
  voice: { pitch: 1.0, rate: 1.02, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#1d4ed8',
    pantsColor: '#1e293b',
    skinColor: '#cfa07b',
    hairColor: '#1c1917',
    accentProp: 'vest',
  },
};

const MBAK_YEM_PROFILE: CharacterProfile = {
  id: 'bu_wati',
  name: 'Mbak Yem',
  role: 'Penjual Jamu Tradisional Sepeda',
  accentColor: '#eab308',
  voice: { pitch: 1.04, rate: 0.96, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.59,
    shirtColor: '#b45309',
    pantsColor: '#451a03',
    skinColor: '#c99770',
    hairColor: '#241b17',
    accentProp: 'apron',
  },
};

function createKonterSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.55, '#1d4ed8');
  grad.addColorStop(1, '#0284c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KONTER "BERKAH"', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('PULSA ALL OPERATOR · PAKET DATA · TOKEN PLN', 320, 96);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('TOP UP E-WALLET · BAYAR PDAM · AKSESORIS HP · CEPAT & AMAN', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createJamuSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 448;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, 0, 448, 176);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 7;
  ctx.strokeRect(8, 8, 432, 160);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JAMU MBAK YEM', 224, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('BERAS KENCUR · KUNYIT ASAM', 224, 98);

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('SEGAR ALAMI · RACIKAN TRADISIONAL', 224, 138);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createFloraFaunaBoardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 360;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(0, 0, 512, 360);
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 512, 68);
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 352);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FLORA & FAUNA DANAU SENJA', 256, 36);

  const entries = [
    { x: 24, y: 84, color: '#f97316', title: 'Ikan Koi & Nila', desc: 'Hidup dekat dermaga kayu' },
    { x: 264, y: 84, color: '#eab308', title: 'Bebek Danau', desc: 'Berenang di pesisir selatan' },
    { x: 24, y: 204, color: '#ec4899', title: 'Teratai Merah Muda', desc: 'Mekar pagi hingga senja' },
    { x: 264, y: 204, color: '#0284c7', title: 'Burung Kuntul & Capung', desc: 'Amati lewat teropong [E]' },
  ];

  entries.forEach((e) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(e.x, e.y, 224, 102);
    ctx.strokeStyle = e.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(e.x, e.y, 224, 102);

    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.x + 26, e.y + 34, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#14532d';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(e.title, e.x + 48, e.y + 36);

    ctx.fillStyle = '#475569';
    ctx.font = '15px sans-serif';
    ctx.fillText(e.desc, e.x + 16, e.y + 76);
  });

  ctx.fillStyle = '#15803d';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Jaga Kebersihan Air & Habitat Alam Kota Senja', 256, 332);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 3 — Sentuhan Sungai, Pagi Sehat & Kios Pulsa:
 * 1. Kios Pulsa, Paket Data & Token Listrik "Konter Berkah" ([49.6, 0, 13.4], hadap -Z) di Jl. Kenangan Timur
 * 2. Sepeda Jamu Tradisional Mbak Yem ([-59.2, 0, 20.4], hadap -X) di Tepi Sungai & Taman Kota
 * 3. Papan Edukasi Flora & Fauna Danau Senja ([-68.6, 0, -33.8]) + Teropong Pengamat Burung ([-68.8, 0, -32.2])
 */
export const KonterJamuAndLakeBirdScope: React.FC<KonterJamuAndLakeBirdScopeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const konterSignTex = useMemo(() => createKonterSignTexture(), []);
  const jamuSignTex = useMemo(() => createJamuSignTexture(), []);
  const floraBoardTex = useMemo(() => createFloraFaunaBoardTexture(), []);

  useEffect(() => {
    return () => {
      konterSignTex.dispose();
      jamuSignTex.dispose();
      floraBoardTex.dispose();
    };
  }, [konterSignTex, jamuSignTex, floraBoardTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const fajarHeadRef = useRef<THREE.Group>(null);
  const fajarRightArmRef = useRef<THREE.Group>(null);
  const konterLedMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const yemHeadRef = useRef<THREE.Group>(null);
  const yemRightArmRef = useRef<THREE.Group>(null);

  const birdScopeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Kios Pulsa "Konter Berkah" (LED strip berjalan menyala terang!)
    if (playerRuntime.konterPulseTimer > 0) {
      playerRuntime.konterPulseTimer = Math.max(0, playerRuntime.konterPulseTimer - dt);
    }
    if (!shouldSkipPerfFrame(49.6, 13.4, 52)) {
      const distFajar = py > 4 ? 99 : Math.hypot(px - 51.45, pz - 12.4);
      if (fajarHeadRef.current) {
        fajarHeadRef.current.rotation.y = Math.sin(t * 0.94) * 0.24;
      }
      if (fajarRightArmRef.current) {
        fajarRightArmRef.current.rotation.x =
          distFajar < 5.5
            ? -1.56 + Math.sin(t * 5.2) * 0.22
            : -0.48 + Math.sin(t * 1.6) * 0.1;
      }
      if (konterLedMatRef.current) {
        const active = playerRuntime.konterPulseTimer > 0;
        const base = active ? 2.9 : isEveningOrNight ? 2.1 : 0.7;
        konterLedMatRef.current.emissiveIntensity = base + Math.sin(t * (active ? 9.0 : 3.2)) * 0.4;
      }
    }

    // 2. Sepeda Jamu Mbak Yem
    if (playerRuntime.jamuPourTimer > 0) {
      playerRuntime.jamuPourTimer = Math.max(0, playerRuntime.jamuPourTimer - dt);
    }
    if (!shouldSkipPerfFrame(-59.2, 20.4, 50)) {
      const distYem = py > 4 ? 99 : Math.hypot(px - -59.2, pz - 20.4);
      if (yemHeadRef.current) {
        yemHeadRef.current.rotation.y = Math.sin(t * 0.86) * 0.22;
      }
      if (yemRightArmRef.current) {
        yemRightArmRef.current.rotation.x =
          distYem < 5.5
            ? -1.52 + Math.sin(t * 4.8) * 0.22
            : -0.68 + Math.sin(t * 1.8) * 0.12;
      }
    }

    // 3. Teropong Pengamat Burung Danau Senja (berputar halus mengamati danau saat [E]!)
    if (playerRuntime.birdScopeTimer > 0) {
      playerRuntime.birdScopeTimer = Math.max(0, playerRuntime.birdScopeTimer - dt);
    }
    if (!shouldSkipPerfFrame(-68.8, -32.2, 50)) {
      if (birdScopeRef.current) {
        const scanning = playerRuntime.birdScopeTimer > 0;
        const targetYaw = scanning ? Math.sin(t * 1.6) * 0.48 : Math.sin(t * 0.25) * 0.08;
        birdScopeRef.current.rotation.y = THREE.MathUtils.lerp(
          birdScopeRef.current.rotation.y,
          targetYaw,
          Math.min(1, dt * 4.0),
        );
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. KIOS PULSA & TOKEN LISTRIK "KONTER BERKAH" ([49.6, 0, 13.4], -Z)  */}
      {/* ==================================================================== */}
      <group position={[49.6, 0, 13.4]} rotation={[0, Math.PI, 0]}>
        {/* Badan Kios Biru-Putih Modern */}
        <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.88, 1.82]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.46, 0.02]}>
          <boxGeometry args={[3.08, 0.92, 1.84]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.56} />
        </mesh>
        {/* Atap Kanopi Biru Gelap Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 2.86, 0.56]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[3.32, 0.14, 2.95]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.58} />
        </mesh>

        {/* Papan Nama HD "KONTER BERKAH · PULSA · KUOTA · TOKEN PLN" */}
        <mesh position={[0, 2.52, 0.94]}>
          <planeGeometry args={[2.86, 0.64]} />
          <meshStandardMaterial
            map={konterSignTex}
            emissiveMap={konterSignTex}
            emissive="#fef08a"
            emissiveIntensity={isEveningOrNight ? 0.72 : 0.16}
          />
        </mesh>

        {/* Pita LED Running-Text Merah-Kuning di Atas Etalase HP */}
        <mesh position={[0.18, 2.1, 0.94]}>
          <boxGeometry args={[2.22, 0.12, 0.06]} />
          <meshStandardMaterial
            ref={konterLedMatRef}
            color="#facc15"
            emissive="#f59e0b"
            emissiveIntensity={isEveningOrNight ? 2.0 : 0.7}
          />
        </mesh>

        {/* Etalase Kaca Bercahaya Isi Dus HP, Aksesoris & Layar Kasir */}
        <group position={[0.18, 1.38, 0.84]}>
          <mesh position={[0, 0, -0.14]}>
            <boxGeometry args={[2.2, 1.22, 0.34]} />
            <meshStandardMaterial
              color="#eff6ff"
              emissive="#bae6fd"
              emissiveIntensity={isEveningOrNight ? 0.72 : 0.12}
            />
          </mesh>
          {/* 2 Rak Dus Ponsel & Kartu Perdana */}
          {[-0.24, 0.18].map((ry, ri) => (
            <group key={`ksh-${ri}`} position={[0, ry, -0.06]}>
              <mesh position={[0, -0.07, 0]}>
                <boxGeometry args={[1.98, 0.03, 0.2]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.35} />
              </mesh>
              {[-0.72, -0.36, 0.0, 0.36, 0.72].map((bx, bi) => (
                <mesh key={`phb-${ri}-${bi}`} position={[bx, 0.04, 0]}>
                  <boxGeometry args={[0.18, 0.2, 0.1]} />
                  <meshStandardMaterial
                    color={['#0f172a', '#ef4444', '#facc15', '#38bdf8', '#22c55e'][(ri * 2 + bi) % 5]}
                    roughness={0.38}
                  />
                </mesh>
              ))}
            </group>
          ))}
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[2.22, 1.24]} />
            <meshStandardMaterial color="#dbeafe" transparent opacity={0.22} roughness={0.1} />
          </mesh>
        </group>

        {/* Mas Fajar Ramah di Sisi Depan Kios (world [51.45, 0, 12.4]) */}
        <group position={[-1.85, 0, 1.0]}>
          <HumanModel
            profile={MAS_FAJAR_PROFILE}
            headRef={fajarHeadRef}
            rightArmRef={fajarRightArmRef}
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. SEPEDA JAMU TRADISIONAL MBAK YEM ([-59.2, 0, 20.4], hadap -X)     */}
      {/* ==================================================================== */}
      <group position={[-59.2, 0, 20.4]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Sepeda Klasik Mbak Yem (Roda, Rangka Hijau Mint, Stang & Keranjang Depan) */}
        <group position={[0, 0, 0]}>
          {[-0.64, 0.64].map((wx, wi) => (
            <group key={`jbw-${wi}`} position={[wx, 0.36, 0]}>
              <mesh castShadow>
                <torusGeometry args={[0.32, 0.042, 8, 18]} />
                <meshStandardMaterial color="#18181b" roughness={0.86} />
              </mesh>
              <mesh>
                <torusGeometry args={[0.27, 0.016, 6, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.24} />
              </mesh>
            </group>
          ))}
          {/* Rangka Sepeda Klasik & Sadel */}
          <mesh position={[0, 0.54, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 1.18, 8]} />
            <meshStandardMaterial color="#0d9488" roughness={0.38} metalness={0.25} />
          </mesh>
          <mesh position={[-0.56, 0.72, 0]} rotation={[0, 0, -0.22]} castShadow>
            <cylinderGeometry args={[0.024, 0.026, 0.72, 8]} />
            <meshStandardMaterial color="#0d9488" roughness={0.38} metalness={0.25} />
          </mesh>
          {/* Stang & Keranjang Depan Sepeda */}
          <mesh position={[-0.64, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.48, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[-0.82, 0.84, 0]} castShadow>
            <boxGeometry args={[0.32, 0.24, 0.34]} />
            <meshStandardMaterial color="#b45309" roughness={0.82} />
          </mesh>
          {/* Sadel Cokelat Klasik */}
          <mesh position={[0.16, 0.84, 0]} castShadow>
            <boxGeometry args={[0.26, 0.065, 0.18]} />
            <meshStandardMaterial color="#451a03" roughness={0.78} />
          </mesh>

          {/* Bakul Rotan Jamu Besar di Boncengan Belakang + 6 Botol Kaca Jamu Warna-Warni! */}
          <group position={[0.56, 0.86, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.66, 0.44, 0.56]} />
              <meshStandardMaterial color="#a16207" roughness={0.88} />
            </mesh>
            {/* 6 Botol Kaca Jamu (Kunyit Asam, Beras Kencur, Temulawak, Sinom, Pahitan) */}
            {[
              { x: -0.18, z: -0.12, col: '#f59e0b' },
              { x: 0.0, z: -0.12, col: '#fef3c7' },
              { x: 0.18, z: -0.12, col: '#d97706' },
              { x: -0.18, z: 0.12, col: '#eab308' },
              { x: 0.0, z: 0.12, col: '#65a30d' },
              { x: 0.18, z: 0.12, col: '#78350f' },
            ].map((bt, bi) => (
              <mesh key={`jbt-${bi}`} position={[bt.x, 0.28, bt.z]} castShadow>
                <cylinderGeometry args={[0.042, 0.048, 0.28, 10]} />
                <meshStandardMaterial color={bt.col} roughness={0.28} metalness={0.08} />
              </mesh>
            ))}
          </group>

          {/* Ember Kecil Bilas Gelas & Papan Nama "JAMU MBAK YEM" */}
          <mesh position={[-0.08, 0.2, 0.28]} castShadow>
            <cylinderGeometry args={[0.14, 0.11, 0.24, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.68} roughness={0.3} />
          </mesh>
          <mesh position={[0.22, 0.86, 0.3]}>
            <planeGeometry args={[0.88, 0.36]} />
            <meshStandardMaterial
              map={jamuSignTex}
              emissiveMap={jamuSignTex}
              emissive="#fef08a"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.12}
            />
          </mesh>
        </group>

        {/* Payung Kanopi Hijau-Emas Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.1, 1.82, -0.12]} castShadow>
          <cylinderGeometry args={[0.04, 0.045, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.1, 2.94, -0.12]} castShadow>
          <coneGeometry args={[1.56, 0.42, 10]} />
          <meshStandardMaterial color="#15803d" roughness={0.66} />
        </mesh>
        <mesh position={[0.1, 2.95, -0.12]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.57, 0.42, 5]} />
          <meshStandardMaterial color="#eab308" roughness={0.66} />
        </mesh>

        {/* Bohlam Hangat Sepeda Jamu */}
        <mesh position={[0.1, 2.38, 0.2]}>
          <sphereGeometry args={[0.068, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.5 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && !playerRuntime.perf.isPotato && (
          <sprite position={[0.1, 2.38, 0.2]} scale={[1.6, 1.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.58 : 0.4}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Mbak Yem Ramah di Sisi Timur Sepeda (world [-58.25, 0, 20.4]) */}
        <group position={[0, 0, -0.95]}>
          <HumanModel
            profile={MBAK_YEM_PROFILE}
            headRef={yemHeadRef}
            rightArmRef={yemRightArmRef}
            isFemale
          />
        </group>

        {/* Bangku Rendah Pelanggan di Sisi Barat (world [-60.85, 0, 20.4]) */}
        <group position={[0, 0, 1.65]}>
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.42, 0.08, 0.42]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.54, 0.54].map((lx, li) => (
            <mesh key={`jmb-${li}`} position={[lx, 0.19, 0]} castShadow>
              <boxGeometry args={[0.08, 0.38, 0.34]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. PAPAN EDUKASI FLORA & FAUNA DANAU SENJA + TEROPONG BURUNG         */}
      {/*    Papan: [-68.6, 0, -33.8] · Teropong Tripod: [-68.8, 0, -32.2]     */}
      {/* ==================================================================== */}
      <group>
        {/* Papan Edukasi Flora & Fauna Kayu Jati Beratap Mini */}
        <group position={[-68.6, 0, -33.8]} rotation={[0, Math.PI / 2, 0]}>
          {[-0.64, 0.64].map((px, pi) => (
            <mesh key={`flp-${pi}`} position={[px, 1.12, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.068, 2.24, 8]} />
              <meshStandardMaterial color="#5c3d28" roughness={0.88} />
            </mesh>
          ))}
          <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.44, 1.02, 0.09]} />
            <meshStandardMaterial color="#3b2618" roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.48, 0.052]}>
            <planeGeometry args={[1.34, 0.92]} />
            <meshStandardMaterial
              map={floraBoardTex}
              emissiveMap={floraBoardTex}
              emissive="#fefce8"
              emissiveIntensity={isEveningOrNight ? 0.52 : 0.08}
            />
          </mesh>
          {/* Atap Pelana Mini Pelindung Papan */}
          <mesh position={[0, 2.18, 0.16]} rotation={[0.32, 0, 0]} castShadow>
            <boxGeometry args={[1.66, 0.07, 0.56]} />
            <meshStandardMaterial color="#15803d" roughness={0.72} />
          </mesh>
          <mesh position={[0, 2.18, -0.16]} rotation={[-0.32, 0, 0]} castShadow>
            <boxGeometry args={[1.66, 0.07, 0.56]} />
            <meshStandardMaterial color="#15803d" roughness={0.72} />
          </mesh>
        </group>

        {/* Teropong Pengamat Burung Kuningan & Tripod Kayu Menghadap Danau Senja ([-68.8, 0, -32.2]) */}
        <group position={[-68.8, 0, -32.2]}>
          {/* 3 Kaki Tripod Kayu */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((ang, ti) => (
            <mesh
              key={`trp-${ti}`}
              position={[Math.cos(ang) * 0.18, 0.66, Math.sin(ang) * 0.18]}
              rotation={[Math.sin(ang) * 0.26, 0, -Math.cos(ang) * 0.26]}
              castShadow
            >
              <cylinderGeometry args={[0.025, 0.032, 1.38, 8]} />
              <meshStandardMaterial color="#5c3d28" roughness={0.82} />
            </mesh>
          ))}
          {/* Dudukan Poros Kuningan */}
          <mesh position={[0, 1.32, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.12, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.72} roughness={0.28} />
          </mesh>
          {/* Tabung Teropong Pengamat Burung Berputar Halus Menghadap Barat (-X ke Danau!) */}
          <group ref={birdScopeRef} position={[0, 1.44, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.072, 0.048, 0.62, 14]} />
              <meshStandardMaterial color="#ca8a04" metalness={0.76} roughness={0.24} />
            </mesh>
            {/* Lensa Depan Kaca Kebiruan */}
            <mesh position={[-0.315, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.064, 14]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.85} roughness={0.12} />
            </mesh>
            {/* Karet Intip Mata Belakang */}
            <mesh position={[0.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.038, 0.042, 0.06, 12]} />
              <meshStandardMaterial color="#18181b" roughness={0.75} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
