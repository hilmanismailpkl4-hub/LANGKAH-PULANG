import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface MusholaTehPociAndAngkotBoardProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const KANG_RIDWAN_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Kang Ridwan',
  role: 'Penjual Es Teh Poci & Tahu Gejrot Plaza',
  accentColor: '#d97706',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.7,
    shirtColor: '#9a3412',
    pantsColor: '#272c36',
    skinColor: '#c99770',
    hairColor: '#1f1c1a',
    accentProp: 'apron',
  },
};

function createMusholaSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 160);
  grad.addColorStop(0, '#064e3b');
  grad.addColorStop(0.5, '#065f46');
  grad.addColorStop(1, '#047857');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 160);

  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 7;
  ctx.strokeRect(8, 8, 624, 144);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MUSHOLA AL-IKHLAS', 320, 56);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = '600 22px sans-serif';
  ctx.fillText('RT 04 PERUMAHAN JL. MELATI · TEDUH & DAMAI', 320, 112);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createTehPociBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#78350f');
  grad.addColorStop(0.5, '#92400e');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ES TEH POCI & TAHU GEJROT', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('KANG RIDWAN · PLAZA MENARA NUSANTARA', 320, 96);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('TEH MELATI GULA BATU · TAHU PONG COBEK · KUAH GULA ASAM', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createAngkotRouteTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 420;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 640, 420);

  // Header biru-kuning resmi angkutan kota
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(0, 0, 640, 92);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(0, 92, 640, 10);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('INFO TRAYEK ANGKOT & BUS KOTA', 320, 38);
  ctx.fillStyle = '#fde68a';
  ctx.font = '600 18px sans-serif';
  ctx.fillText('POS CEK JL. KENANGAN · KOTA SENJA', 320, 72);

  const routes = [
    {
      code: 'K-01',
      badge: '#0284c7',
      title: 'Stasiun Senja ↔ Menara ↔ Taman Danau',
      note: 'Lewat Jl. Kenangan · Setiap 6 menit · Rp 4.000',
    },
    {
      code: 'K-02',
      badge: '#0d9488',
      title: 'Jl. Melati RT 04 ↔ Kios Harmoni ↔ Cempaka',
      note: 'Lewat Jl. Cempaka · Setiap 8 menit · Rp 4.000',
    },
    {
      code: 'TS-1',
      badge: '#d97706',
      title: 'Bus Trans Senja Koridor 1 (Halte Jl. Kenangan)',
      note: 'AC & Nyaman · Berhenti di Halte Barat · Rp 3.500',
    },
  ];

  routes.forEach((r, idx) => {
    const y = 128 + idx * 88;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(24, y, 592, 72);

    ctx.fillStyle = r.badge;
    ctx.fillRect(34, y + 12, 86, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(r.code, 77, y + 37);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 21px sans-serif';
    ctx.fillText(r.title, 138, y + 27);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 16px sans-serif';
    ctx.fillText(r.note, 138, y + 54);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#7dd3fc';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillText('Tekan [E] untuk cek estimasi kedatangan & info rute', 320, 400);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 3 — Kehangatan Sore Kompleks & Plaza Kota:
 * 1. Mushola Kecil Kompleks "Al-Ikhlas" ([44.5, 0, 64.8]) di Tepi Timur Perumahan Melati
 * 2. Gerobak Es Teh Poci & Tahu Gejrot Kang Ridwan ([32.8, 0, -14.0]) di Plaza Menara Nusantara
 * 3. Pos Cek Trayek & Papan Rute Angkot Jl. Kenangan ([31.6, 0, 11.6]) di Tepi Koridor Angkot
 */
export const MusholaTehPociAndAngkotBoard: React.FC<MusholaTehPociAndAngkotBoardProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const musholaSignTex = useMemo(() => createMusholaSignTexture(), []);
  const tehPociBannerTex = useMemo(() => createTehPociBannerTexture(), []);
  const angkotRouteTex = useMemo(() => createAngkotRouteTexture(), []);

  useEffect(() => {
    return () => {
      musholaSignTex.dispose();
      tehPociBannerTex.dispose();
      angkotRouteTex.dispose();
    };
  }, [musholaSignTex, tehPociBannerTex, angkotRouteTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const bedugRef = useRef<THREE.Group>(null);
  const ridwanHeadRef = useRef<THREE.Group>(null);
  const ridwanRightArmRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Gema Ayunan Lembut Bedug Mushola Al-Ikhlas
    if (playerRuntime.bedugRingTimer > 0) {
      playerRuntime.bedugRingTimer = Math.max(0, playerRuntime.bedugRingTimer - dt);
    }
    if (!shouldSkipPerfFrame(44.5, 64.8, 52) && bedugRef.current) {
      const ringing = playerRuntime.bedugRingTimer > 0;
      bedugRef.current.rotation.z = ringing
        ? Math.sin(t * 7.2) * 0.075 * (playerRuntime.bedugRingTimer / 4.2)
        : Math.sin(t * 1.1) * 0.012;
    }

    // 2. Animasi Kang Ridwan Es Teh Poci & Tahu Gejrot
    if (!shouldSkipPerfFrame(32.8, -14.0, 48)) {
      const distRidwan = py > 4 ? 99 : Math.hypot(px - 32.8, pz - -14.0);
      if (ridwanHeadRef.current) {
        ridwanHeadRef.current.rotation.y = Math.sin(t * 0.92) * 0.24;
      }
      if (ridwanRightArmRef.current) {
        ridwanRightArmRef.current.rotation.x =
          distRidwan < 5.5
            ? -1.58 + Math.sin(t * 5.2) * 0.22
            : -0.78 + Math.sin(t * 2.4) * 0.14;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. MUSHOLA KECIL KOMPLEKS "AL-IKHLAS" ([44.5, 0, 64.8], hadap -Z)    */}
      {/* ==================================================================== */}
      <group position={[44.5, 0, 64.8]} rotation={[0, Math.PI, 0]}>
        {/* Lantai Teras & Serambi Keramik Krem Hangat */}
        <mesh position={[0, 0.08, 0.65]} receiveShadow castShadow>
          <boxGeometry args={[5.5, 0.16, 5.9]} />
          <meshStandardMaterial color="#e7dfd1" roughness={0.78} />
        </mesh>

        {/* Bangunan Utama Mushola Kayu-Bata Teduh */}
        <mesh position={[0, 1.72, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[4.85, 3.16, 3.7]} />
          <meshStandardMaterial color="#f5efe4" roughness={0.82} />
        </mesh>
        {/* Lis Bawah Bata Terakota Hangat */}
        <mesh position={[0, 0.62, -0.35]}>
          <boxGeometry args={[4.92, 0.92, 3.76]} />
          <meshStandardMaterial color="#9c5a3c" roughness={0.88} />
        </mesh>

        {/* Pintu Kayu Jati Ganda & 2 Jendela Lengkung Bercahaya Hangat */}
        <mesh position={[0, 1.38, 1.52]}>
          <boxGeometry args={[1.38, 2.26, 0.08]} />
          <meshStandardMaterial color="#593a24" roughness={0.74} />
        </mesh>
        {[-1.56, 1.56].map((wx, wi) => (
          <group key={`mw-${wi}`} position={[wx, 1.85, 1.53]}>
            <mesh>
              <boxGeometry args={[0.82, 1.18, 0.06]} />
              <meshStandardMaterial color="#4a301e" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0, 0.035]}>
              <planeGeometry args={[0.68, 1.02]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fde68a' : '#cbd5e1'}
                emissive="#ffbe5c"
                emissiveIntensity={isEveningOrNight ? 1.1 : 0.08}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}

        {/* Atap Limasan 2 Tingkat + Kubah Mini Hijau-Emas */}
        <mesh position={[0, 3.92, 0.35]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[4.55, 1.5, 4]} />
          <meshStandardMaterial color="#7c3a25" roughness={0.84} />
        </mesh>
        <mesh position={[0, 4.92, -0.1]} castShadow>
          <sphereGeometry args={[0.78, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshStandardMaterial color="#047857" metalness={0.35} roughness={0.35} />
        </mesh>
        {/* Mustaka / Puncak Emas Kubah */}
        <mesh position={[0, 5.82, -0.1]}>
          <cylinderGeometry args={[0.025, 0.06, 0.48, 10]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0, 6.1, -0.1]}>
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Serambi Depan Beratap + 2 Tiang Kayu Jati + Papan Nama "MUSHOLA AL-IKHLAS" */}
        {[-2.35, 2.35].map((px, pi) => (
          <mesh key={`mp-${pi}`} position={[px, 1.66, 3.25]} castShadow>
            <cylinderGeometry args={[0.11, 0.13, 3.05, 10]} />
            <meshStandardMaterial color="#593c26" roughness={0.78} />
          </mesh>
        ))}
        <mesh position={[0, 3.16, 3.25]} castShadow>
          <boxGeometry args={[5.1, 0.22, 0.22]} />
          <meshStandardMaterial color="#4a3120" roughness={0.78} />
        </mesh>
        <mesh position={[0, 2.78, 3.38]}>
          <planeGeometry args={[2.95, 0.72]} />
          <meshStandardMaterial
            map={musholaSignTex}
            emissiveMap={musholaSignTex}
            emissive="#fef3c7"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.1}
          />
        </mesh>

        {/* 2 Lentera Teras Serambi Hangat */}
        {[-1.7, 1.7].map((lx, li) => (
          <group key={`ml-${li}`} position={[lx, 2.78, 2.65]}>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.36, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.12, 0.09, 0.24, 6]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fff3cc' : '#dce4ec'}
                emissive={isEveningOrNight ? '#ffba52' : '#000000'}
                emissiveIntensity={isEveningOrNight ? 2.5 : 0}
                roughness={0.28}
              />
            </mesh>
            {isEveningOrNight && settings.cinematicGlow && (
              <sprite position={[0, 0, 0]} scale={[1.8, 1.8, 1]}>
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

        {/* Bedug Kayu Tergantung di Serambi (world [42.65, 0, 62.35]) */}
        <group position={[1.85, 0.16, 2.45]}>
          {/* Rangka Kayu Penyangga Bedug */}
          {[-0.48, 0.48].map((bx, bi) => (
            <mesh key={`bf-${bi}`} position={[bx, 0.68, 0]} castShadow>
              <boxGeometry args={[0.1, 1.36, 0.12]} />
              <meshStandardMaterial color="#4a2e1b" roughness={0.82} />
            </mesh>
          ))}
          <mesh position={[0, 1.34, 0]} castShadow>
            <boxGeometry args={[1.12, 0.1, 0.14]} />
            <meshStandardMaterial color="#4a2e1b" roughness={0.82} />
          </mesh>
          {/* Tabung Bedug Kayu Kulit Mengayun Halus saat Ditabuh [E] */}
          <group ref={bedugRef} position={[0, 1.24, 0]}>
            <mesh position={[0, -0.44, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.24, 0.86, 14]} />
              <meshStandardMaterial color="#784221" roughness={0.78} />
            </mesh>
            <mesh position={[-0.435, -0.44, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.26, 14]} />
              <meshStandardMaterial color="#f5e6c8" roughness={0.86} />
            </mesh>
            <mesh position={[0.435, -0.44, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.23, 14]} />
              <meshStandardMaterial color="#f5e6c8" roughness={0.86} />
            </mesh>
          </group>
        </group>

        {/* Tempat Wudhu Batu Alam & 3 Keran Krom di Sisi Barat Luar Mushola */}
        <group position={[2.68, 0, 0.2]}>
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.52, 0.44, 2.2]} />
            <meshStandardMaterial color="#78716c" roughness={0.9} />
          </mesh>
          {[-0.65, 0, 0.65].map((tz, ti) => (
            <mesh key={`wtap-${ti}`} position={[0.18, 0.72, tz]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. GEROBAK ES TEH POCI & TAHU GEJROT KANG RIDWAN ([32.8, 0, -14.0])  */}
      {/* ==================================================================== */}
      <group position={[32.8, 0, -14.0]}>
        {/* Badan Gerobak Kayu Cokelat Hangat */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#78350f" roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#b47b47" roughness={0.68} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`tpw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "ES TEH POCI & TAHU GEJROT · KANG RIDWAN" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={tehPociBannerTex}
            emissiveMap={tehPociBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
          />
        </mesh>

        {/* Teko Tanah Liat Poci + Boks Es Kristal + Toples Gula Batu (Sisi Kiri Counter) */}
        <group position={[-0.56, 1.1, 0.04]}>
          {/* 2 Teko Poci Tanah Liat Khas Tegal */}
          {[-0.22, 0.12].map((px, pi) => (
            <group key={`poci-${pi}`} position={[px, 0.14, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.14, 12, 10]} />
                <meshStandardMaterial color="#b4532a" roughness={0.82} />
              </mesh>
              <mesh position={[0, 0.14, 0]}>
                <cylinderGeometry args={[0.06, 0.075, 0.05, 10]} />
                <meshStandardMaterial color="#9a3412" roughness={0.82} />
              </mesh>
            </group>
          ))}
          {/* Boks Pendingin Es Batu Biru */}
          <mesh position={[-0.08, 0.12, -0.28]} castShadow>
            <boxGeometry args={[0.42, 0.24, 0.24]} />
            <meshStandardMaterial color="#0284c7" roughness={0.45} />
          </mesh>
        </group>

        {/* Cobek Tanah Liat Tahu Gejrot, Tumpukan Tahu Pong & Botol Kuah Gula Asam (Sisi Kanan Counter) */}
        <group position={[0.48, 1.1, 0.04]}>
          {/* Cobek Tanah Liat Lebar */}
          <mesh position={[-0.14, 0.05, 0.06]} castShadow>
            <cylinderGeometry args={[0.2, 0.14, 0.09, 14]} />
            <meshStandardMaterial color="#8c4a2e" roughness={0.88} />
          </mesh>
          {/* Potongan Tahu Pong Keemasan di Atas Cobek */}
          {[-0.2, -0.1, -0.14].map((tx, ti) => (
            <mesh key={`tahu-${ti}`} position={[tx, 0.11, 0.03 + ti * 0.04]}>
              <boxGeometry args={[0.07, 0.055, 0.07]} />
              <meshStandardMaterial color="#d97706" roughness={0.74} />
            </mesh>
          ))}
          {/* Keranjang Anyaman Tahu Pong & Botol Kuah Gula Aren */}
          <mesh position={[0.26, 0.11, -0.06]} castShadow>
            <cylinderGeometry args={[0.16, 0.12, 0.2, 12]} />
            <meshStandardMaterial color="#b4834c" roughness={0.88} />
          </mesh>
          <mesh position={[0.26, 0.23, -0.06]}>
            <sphereGeometry args={[0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#eab308" roughness={0.78} />
          </mesh>
          <mesh position={[0.22, 0.16, 0.22]} castShadow>
            <cylinderGeometry args={[0.048, 0.055, 0.3, 10]} />
            <meshStandardMaterial color="#451a03" roughness={0.28} />
          </mesh>
        </group>

        {/* Payung Kanopi Cokelat-Kuning Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#9a3412" roughness={0.68} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Gerobak Sore-Malam */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.7 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.22]} scale={[1.65, 1.65, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.58 : 0.42}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Kang Ridwan Ramah di Belakang Gerobak (world [32.8, 0, -15.02]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={KANG_RIDWAN_PROFILE}
            headRef={ridwanHeadRef}
            rightArmRef={ridwanRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [32.8, 0, -12.15]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`tpb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. POS CEK TRAYEK & PAPAN RUTE ANGKOT JL. KENANGAN ([31.6, 0, 11.6]) */}
      {/* ==================================================================== */}
      <group position={[31.6, 0, 11.6]} rotation={[0, Math.PI, 0]}>
        {/* Rangka Besi Biru-Kuning & Kanopi Teduh Pos Trayek Angkot */}
        {[-1.35, 1.35].map((px, pi) => (
          <mesh key={`ap-${pi}`} position={[px, 1.38, -0.25]} castShadow>
            <cylinderGeometry args={[0.05, 0.055, 2.74, 10]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.55} roughness={0.38} />
          </mesh>
        ))}
        <mesh position={[0, 2.74, 0.12]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[3.15, 0.1, 1.56]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.4} roughness={0.45} />
        </mesh>
        <mesh position={[0, 2.66, 0.9]}>
          <boxGeometry args={[3.15, 0.1, 0.06]} />
          <meshStandardMaterial color="#facc15" roughness={0.45} />
        </mesh>

        {/* Papan Rute & Jadwal Angkot HD Bercahaya Halus Malam Hari */}
        <group position={[-0.45, 1.58, -0.22]}>
          <mesh castShadow>
            <boxGeometry args={[1.66, 1.12, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.45} roughness={0.42} />
          </mesh>
          <mesh position={[0, 0, 0.058]}>
            <planeGeometry args={[1.56, 1.02]} />
            <meshStandardMaterial
              map={angkotRouteTex}
              emissiveMap={angkotRouteTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.85 : 0.16}
            />
          </mesh>
        </group>

        {/* Bangku Tunggu Tambahan Kayu-Besi di Sisi Kanan Papan Trayek */}
        <group position={[0.82, 0, 0.08]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 0.07, 0.44]} />
            <meshStandardMaterial color="#9c663a" roughness={0.78} />
          </mesh>
          {[-0.42, 0.42].map((bx, bi) => (
            <mesh key={`ab-${bi}`} position={[bx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.07, 0.44, 0.38]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Tiang Rambu Bulat Biru "STOP ANGKOT" di Sisi Barat (world [29.85, 0, 11.5]) */}
        <group position={[1.75, 0, 0.1]}>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.036, 0.042, 2.3, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 2.28, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.05, 16]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.28, 0.028]}>
            <ringGeometry args={[0.14, 0.21, 16]} />
            <meshBasicMaterial color="#facc15" />
          </mesh>
        </group>

        {/* Lampu Strip LED Hangat di Bawah Kanopi Pos Trayek */}
        <mesh position={[0, 2.66, 0.24]}>
          <boxGeometry args={[2.1, 0.04, 0.08]} />
          <meshStandardMaterial
            color="#fff9db"
            emissive="#ffe09e"
            emissiveIntensity={isEveningOrNight ? 2.4 : 0.08}
          />
        </mesh>
      </group>
    </group>
  );
};
