import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface CilokBikeShareAndWatchmakerProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MANG_DEDI_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mang Dedi',
  role: 'Penjual Cilok & Telur Gulung Sore Jl. Kenangan',
  accentColor: '#f97316',
  voice: { pitch: 0.96, rate: 1.02, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.69,
    shirtColor: '#ea580c',
    pantsColor: '#1f2937',
    skinColor: '#c99770',
    hairColor: '#1c1917',
    accentProp: 'apron',
  },
};

const PAK_KARTO_PROFILE: CharacterProfile = {
  id: 'pak_darman',
  name: 'Pak Karto',
  role: 'Tukang Reparasi Jam Tangan Stasiun Senja',
  accentColor: '#eab308',
  voice: { pitch: 0.88, rate: 0.94, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.66,
    shirtColor: '#f8fafc',
    pantsColor: '#334155',
    skinColor: '#c6936c',
    hairColor: '#78716c',
    accentProp: 'vest',
  },
};

function createCilokBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#9a3412');
  grad.addColorStop(0.5, '#ea580c');
  grad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CILOK & TELUR GULUNG', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('MANG DEDI · GORENG DADAKAN HANGAT SORE', 320, 96);

  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('CILOK BUMBU KACANG · TELUR GULUNG SOSIS · CILOR PEDAS MANIS', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createBikeShareKioskTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.35, '#134e4a');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 384, 512);

  // Header pita toska cerah
  ctx.fillStyle = '#14b8a6';
  ctx.fillRect(0, 0, 384, 86);
  ctx.fillStyle = '#042f2e';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SEPEDA SENJA', 192, 34);
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('STASIUN SEPEDA SEWA KOTA', 192, 66);

  // Status 4/4 Tersedia
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(28, 108, 328, 56);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 108, 328, 56);
  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('4 / 4 UNIT SIAP GOWES', 192, 136);

  // Kotak QR Code bergaya modern
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(102, 186, 180, 180);
  ctx.fillStyle = '#0f172a';
  const cell = 15;
  const pattern = [
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
    [0, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 1, 1, 1],
    [0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  ];
  for (let r = 0; r < 10; r++) {
    for (let col = 0; col < 10; col++) {
      if (pattern[r][col]) {
        ctx.fillRect(117 + col * cell, 201 + r * cell, cell - 2, cell - 2);
      }
    }
  }

  // Tarif & Info Jalur
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('TARIF: Rp 3.000 / 30 MNT', 192, 404);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('SCAN QR · TEKAN [E] CEK UNIT', 192, 440);
  ctx.fillStyle = '#99f6e4';
  ctx.font = '15px sans-serif';
  ctx.fillText('Jalur Ramah Gowes: Plaza -> Danau Senja', 192, 476);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createWatchmakerSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 640, 176);
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SERVICE JAM TANGAN', 320, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('PAK KARTO · HALAMAN STASIUN SENJA · SEJAK 1994', 320, 94);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('GANTI BATERAI · TALI KULIT · SERVIS MESIN & KACA JAM', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 1 — Riuh Akrab Sudut Kota & Stasiun:
 * 1. Gerobak Cilok & Telur Gulung Sore Mang Dedi ([-28.8, 0, -14.0]) di Trotoar Jl. Kenangan Barat
 * 2. Stasiun Sepeda Sewa Kota "Sepeda Senja" ([19.8, 0, -14.6]) di Plaza Depan Menara Nusantara
 * 3. Lapak Reparasi Jam Tangan Pak Karto ([71.8, 0, 12.6]) di Halaman Selatan Stasiun Senja
 */
export const CilokBikeShareAndWatchmaker: React.FC<CilokBikeShareAndWatchmakerProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const cilokBannerTex = useMemo(() => createCilokBannerTexture(), []);
  const bikeKioskTex = useMemo(() => createBikeShareKioskTexture(), []);
  const watchSignTex = useMemo(() => createWatchmakerSignTexture(), []);

  useEffect(() => {
    return () => {
      cilokBannerTex.dispose();
      bikeKioskTex.dispose();
      watchSignTex.dispose();
    };
  }, [cilokBannerTex, bikeKioskTex, watchSignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const dediHeadRef = useRef<THREE.Group>(null);
  const dediRightArmRef = useRef<THREE.Group>(null);
  const twirlSkewerRef = useRef<THREE.Group>(null);
  const cilokSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  const bikeUnitRefs = useRef<(THREE.Group | null)[]>([]);
  const dockLedRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const kartoHeadRef = useRef<THREE.Group>(null);
  const kartoRightArmRef = useRef<THREE.Group>(null);
  const clockSecondRefs = useRef<(THREE.Mesh | null)[]>([]);
  const clockMinuteRefs = useRef<(THREE.Mesh | null)[]>([]);
  const deskLampMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Gerobak Cilok & Telur Gulung Mang Dedi (gulung tusuk telur & uap dandang cilok!)
    if (playerRuntime.cilokFryTimer > 0) {
      playerRuntime.cilokFryTimer = Math.max(0, playerRuntime.cilokFryTimer - dt);
    }
    if (!shouldSkipPerfFrame(-28.8, -14.0, 50)) {
      const distDedi = py > 4 ? 99 : Math.hypot(px - -28.8, pz - -14.0);
      const frying = playerRuntime.cilokFryTimer > 0;
      if (dediHeadRef.current) {
        dediHeadRef.current.rotation.y = Math.sin(t * 0.95) * 0.24;
      }
      if (dediRightArmRef.current) {
        dediRightArmRef.current.rotation.x =
          distDedi < 5.5
            ? -1.52 + Math.sin(t * 5.6) * 0.22
            : -0.82 + Math.sin(t * (frying ? 9.5 : 3.2)) * 0.16;
      }
      if (twirlSkewerRef.current) {
        twirlSkewerRef.current.rotation.y += dt * (frying ? 12.5 : 4.2);
        twirlSkewerRef.current.position.y = 0.18 + Math.sin(t * (frying ? 8.0 : 2.8)) * 0.018;
      }
      if (!playerRuntime.perf.isPotato) {
        const riseRate = frying ? 1.05 : 0.58;
        for (let i = 0; i < 4; i++) {
          const m = cilokSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * riseRate + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * (frying ? 0.78 : 0.52);
          m.position.x = Math.sin(t * 2.6 + i * 1.7) * 0.045 * p;
          const s = (frying ? 0.65 : 0.45) + p * 1.15;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * (frying ? 0.36 : 0.22);
        }
      }
    }

    // 2. Stasiun Sepeda Sewa Kota Depan Menara Nusantara (LED dock berdenyut & sepeda bergoyang ringan saat [E])
    if (playerRuntime.bikeShareRingTimer > 0) {
      playerRuntime.bikeShareRingTimer = Math.max(0, playerRuntime.bikeShareRingTimer - dt);
    }
    if (!shouldSkipPerfFrame(19.8, -14.6, 52)) {
      const ringing = playerRuntime.bikeShareRingTimer > 0;
      for (let i = 0; i < 4; i++) {
        const b = bikeUnitRefs.current[i];
        if (b) {
          b.rotation.z = ringing ? Math.sin(t * 18 + i * 1.4) * 0.045 : 0;
        }
        const led = dockLedRefs.current[i];
        if (led) {
          led.emissiveIntensity = ringing
            ? 2.4 + Math.sin(t * 14 + i) * 0.8
            : isEveningOrNight
              ? 1.65 + Math.sin(t * 2.2 + i * 0.8) * 0.35
              : 0.75;
        }
      }
    }

    // 3. Lapak Reparasi Jam Tangan Pak Karto (3 jarum jam dinding berputar real-time & lampu sorot kerja)
    if (playerRuntime.watchRepairTimer > 0) {
      playerRuntime.watchRepairTimer = Math.max(0, playerRuntime.watchRepairTimer - dt);
    }
    if (!shouldSkipPerfFrame(71.8, 12.6, 50)) {
      const distKarto = py > 4 ? 99 : Math.hypot(px - 71.8, pz - 12.6);
      const repairing = playerRuntime.watchRepairTimer > 0;
      if (kartoHeadRef.current) {
        kartoHeadRef.current.rotation.y = Math.sin(t * 0.75) * 0.18;
        kartoHeadRef.current.rotation.x = distKarto < 4.5 ? 0.05 : 0.24;
      }
      if (kartoRightArmRef.current) {
        kartoRightArmRef.current.rotation.x =
          distKarto < 4.8
            ? -1.48 + Math.sin(t * 4.8) * 0.2
            : -0.92 + Math.sin(t * (repairing ? 7.0 : 2.1)) * 0.09;
      }
      for (let i = 0; i < 3; i++) {
        const sec = clockSecondRefs.current[i];
        if (sec) {
          sec.rotation.z = -(t * (Math.PI * 2) / 12 + i * 1.1);
        }
        const min = clockMinuteRefs.current[i];
        if (min) {
          min.rotation.z = -(t * 0.08 + i * 1.8);
        }
      }
      if (deskLampMatRef.current) {
        deskLampMatRef.current.emissiveIntensity = repairing
          ? 3.2
          : isEveningOrNight
            ? 2.4
            : 0.85;
      }
    }
  });

  const bikeSlots = useMemo(
    () => [
      { x: -0.78, color: '#0d9488' },
      { x: 0.04, color: '#f59e0b' },
      { x: 0.86, color: '#0d9488' },
      { x: 1.68, color: '#f59e0b' },
    ],
    [],
  );

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK CILOK & TELUR GULUNG SORE MANG DEDI ([-28.8, 0, -14.0])   */}
      {/* ==================================================================== */}
      <group position={[-28.8, 0, -14.0]}>
        {/* Badan Gerobak Kayu Oranye-Merah Hangat */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#c2410c" roughness={0.74} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#9c663a" roughness={0.68} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`cw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "CILOK & TELUR GULUNG · MANG DEDI" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={cilokBannerTex}
            emissiveMap={cilokBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.64 : 0.14}
          />
        </mesh>

        {/* Wajan Minyak Penggorengan Telur Gulung + Tusuk Telur Berputar (Kiri Counter) */}
        <group position={[-0.64, 1.08, 0.04]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.18, 0.16, 14]} />
            <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.38} />
          </mesh>
          {/* Minyak Goreng Keemasan Panas */}
          <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.24, 14]} />
            <meshStandardMaterial color="#d97706" roughness={0.22} metalness={0.18} />
          </mesh>
          {/* Tusuk Telur Gulung Sedang Digulung di Wajan */}
          <group ref={twirlSkewerRef} position={[0.02, 0.18, 0]}>
            <mesh position={[0, 0.07, 0]} rotation={[0.25, 0, 0.18]}>
              <cylinderGeometry args={[0.008, 0.008, 0.28, 6]} />
              <meshStandardMaterial color="#d6b27d" roughness={0.78} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <capsuleGeometry args={[0.032, 0.065, 5, 8]} />
              <meshStandardMaterial color="#facc15" roughness={0.55} />
            </mesh>
          </group>
        </group>

        {/* Dandang Stainless Cilok Panas + Uap Putih & 3 Botol Saus (Tengah Counter) */}
        <group position={[-0.02, 1.08, 0.02]}>
          <mesh position={[0, 0.17, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.21, 0.34, 14]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.24} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.23, 0.23, 0.03, 14]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.22} />
          </mesh>
          {/* Semburan Uap Dandang Cilok */}
          <group position={[0, 0.38, 0]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`cst-${si}`}
                ref={(el) => {
                  cilokSteamRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.052, 8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Etalase Kaca Tusuk Telur Gulung Siap Santap & 3 Botol Saus Kacang/Sambal/Kecap (Kanan Counter) */}
        <group position={[0.58, 1.32, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.78, 0.44, 0.44]} />
            <meshStandardMaterial color="#fef3c7" transparent opacity={0.32} roughness={0.14} />
          </mesh>
          {/* Deretan Tusuk Telur Gulung Emas di Dalam Etalase */}
          {[-0.22, -0.1, 0.02].map((sx, si) => (
            <group key={`etsk-${si}`} position={[sx, -0.06, 0]}>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
                <meshStandardMaterial color="#d6b27d" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.04, 0]}>
                <capsuleGeometry args={[0.026, 0.075, 5, 8]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.6} />
              </mesh>
            </group>
          ))}
          {/* 3 Botol Saus Remas (Bumbu Kacang, Saus Sambal Merah, Kecap Manis) */}
          {[
            { x: 0.16, col: '#9a5c2a' },
            { x: 0.24, col: '#dc2626' },
            { x: 0.32, col: '#292524' },
          ].map((bt, bi) => (
            <mesh key={`sbot-${bi}`} position={[bt.x, -0.1, 0.12]}>
              <cylinderGeometry args={[0.022, 0.028, 0.18, 8]} />
              <meshStandardMaterial color={bt.col} roughness={0.42} />
            </mesh>
          ))}
        </group>

        {/* Payung Kanopi Merah-Kuning Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.65} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#facc15" roughness={0.65} />
        </mesh>

        {/* Bohlam Hangat Gerobak Sore-Malam */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.14}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.22]} scale={[1.7, 1.7, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.62 : 0.44}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Mang Dedi Ramah di Belakang Gerobak (world [-28.8, 0, -15.02]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={MANG_DEDI_PROFILE}
            headRef={dediHeadRef}
            rightArmRef={dediRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [-28.8, 0, -12.15]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`clb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. STASIUN SEPEDA SEWA KOTA DEPAN MENARA NUSANTARA ([19.8, 0, -14.6]) */}
      {/* ==================================================================== */}
      <group position={[19.8, 0, -14.6]}>
        {/* Landasan Beton & Rel Pengunci Sepeda Modern */}
        <mesh position={[0, 0.045, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.16, 0.09, 1.38]} />
          <meshStandardMaterial color="#334155" roughness={0.82} />
        </mesh>
        <mesh position={[0.45, 0.14, -0.42]} castShadow>
          <boxGeometry args={[3.2, 0.14, 0.18]} />
          <meshStandardMaterial color="#0f766e" metalness={0.45} roughness={0.38} />
        </mesh>

        {/* Kios Totem QR Scan & Tarif "SEPEDA SENJA" di Sisi Kiri */}
        <group position={[-1.68, 0, 0.02]}>
          <mesh position={[0, 1.04, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.64, 2.02, 0.28]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.38} />
          </mesh>
          <mesh position={[0, 1.18, 0.15]}>
            <planeGeometry args={[0.56, 0.76]} />
            <meshStandardMaterial
              map={bikeKioskTex}
              emissiveMap={bikeKioskTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.78 : 0.28}
            />
          </mesh>
          {/* Panel Surya Mini di Atas Totem */}
          <mesh position={[0, 2.09, 0]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.68, 0.06, 0.36]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.22} />
          </mesh>
        </group>

        {/* Atap Kanopi Kaca & Baja Pelindung Hujan Stasiun Sepeda */}
        {[-1.94, 1.94].map((px, pi) => (
          <mesh key={`bkp-${pi}`} position={[px, 1.24, -0.46]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 2.42, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.68} roughness={0.32} />
          </mesh>
        ))}
        <mesh position={[0, 2.46, 0.02]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[4.3, 0.07, 1.72]} />
          <meshStandardMaterial color="#134e4a" metalness={0.5} roughness={0.32} />
        </mesh>
        <mesh position={[0, 2.42, 0.05]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[4.0, 0.04, 1.48]} />
          <meshStandardMaterial color="#ccfbf1" transparent opacity={0.38} roughness={0.14} />
        </mesh>

        {/* 4 Unit Sepeda Kota Modern Terparkir Rapi di Dock dengan Lampu Status Hijau */}
        {bikeSlots.map((slot, bi) => (
          <group key={`bslot-${bi}`} position={[slot.x, 0, 0]}>
            {/* Tiang Dock + Lampu LED Hijau Tersedia */}
            <mesh position={[0, 0.42, -0.42]} castShadow>
              <boxGeometry args={[0.14, 0.58, 0.14]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.68, -0.34]}>
              <sphereGeometry args={[0.036, 8, 8]} />
              <meshStandardMaterial
                ref={(el) => {
                  dockLedRefs.current[bi] = el;
                }}
                color="#34d399"
                emissive="#10b981"
                emissiveIntensity={1.4}
              />
            </mesh>

            {/* Unit Sepeda Kota 3D */}
            <group
              ref={(el) => {
                bikeUnitRefs.current[bi] = el;
              }}
              position={[0, 0.09, 0.08]}
            >
              {/* Roda Depan (-Z ke dock) & Roda Belakang (+Z ke plaza) */}
              {[-0.36, 0.36].map((wz, wi) => (
                <group key={`bw-${wi}`} position={[0, 0.28, wz]} rotation={[0, Math.PI / 2, 0]}>
                  <mesh castShadow>
                    <torusGeometry args={[0.25, 0.036, 8, 16]} />
                    <meshStandardMaterial color="#18181b" roughness={0.86} />
                  </mesh>
                  <mesh>
                    <torusGeometry args={[0.21, 0.015, 6, 14]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
                  </mesh>
                </group>
              ))}
              {/* Rangka Sepeda Warna Khas Kota (Toska / Kuning Cerah) */}
              <mesh position={[0, 0.46, 0]} rotation={[0.16, 0, 0]} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.72, 8]} />
                <meshStandardMaterial color={slot.color} roughness={0.36} metalness={0.25} />
              </mesh>
              <mesh position={[0, 0.56, -0.3]} rotation={[-0.22, 0, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.022, 0.64, 8]} />
                <meshStandardMaterial color={slot.color} roughness={0.36} metalness={0.25} />
              </mesh>
              <mesh position={[0, 0.54, 0.16]} rotation={[0.25, 0, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.56, 8]} />
                <meshStandardMaterial color={slot.color} roughness={0.36} metalness={0.25} />
              </mesh>
              {/* Stang Sepeda + Bel Mini */}
              <mesh position={[0, 0.86, -0.37]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.44, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Keranjang Kawat Depan */}
              <mesh position={[0, 0.72, -0.5]} castShadow>
                <boxGeometry args={[0.26, 0.18, 0.22]} />
                <meshStandardMaterial color="#475569" roughness={0.62} metalness={0.45} />
              </mesh>
              {/* Sadel Hitam Nyaman */}
              <mesh position={[0, 0.79, 0.2]} castShadow>
                <boxGeometry args={[0.15, 0.055, 0.24]} />
                <meshStandardMaterial color="#1f2937" roughness={0.78} />
              </mesh>
              {/* Reflektor Merah Belakang */}
              <mesh position={[0, 0.52, 0.52]}>
                <boxGeometry args={[0.05, 0.05, 0.025]} />
                <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={isEveningOrNight ? 1.4 : 0.1} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 3. LAPAK REPARASI JAM TANGAN PAK KARTO ([71.8, 0, 12.6], hadap -X)   */}
      {/* ==================================================================== */}
      <group position={[71.8, 0, 12.6]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Lemari Etalase Kayu Mahoni Klasik */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.12, 1.04, 1.04]} />
          <meshStandardMaterial color="#451a03" roughness={0.76} />
        </mesh>
        {/* Etalase Kaca Pajangan Jam Tangan di Atas Meja */}
        <group position={[0, 1.18, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[1.88, 0.28, 0.62]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.3} roughness={0.12} />
          </mesh>
          {/* Bantalan Beludru Merah Marun + 6 Miniatur Jam Tangan Rapi */}
          <mesh position={[0, -0.12, 0]}>
            <boxGeometry args={[1.76, 0.03, 0.52]} />
            <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
          </mesh>
          {[-0.65, -0.39, -0.13, 0.13, 0.39, 0.65].map((wx, wi) => (
            <group key={`wtc-${wi}`} position={[wx, -0.08, 0]}>
              {/* Tali Kulit / Rantai Jam */}
              <mesh>
                <boxGeometry args={[0.055, 0.02, 0.24]} />
                <meshStandardMaterial color={wi % 2 === 0 ? '#1c1917' : '#78350f'} roughness={0.68} />
              </mesh>
              {/* Dial Jam Emas / Perak */}
              <mesh position={[0, 0.018, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.022, 12]} />
                <meshStandardMaterial
                  color={wi % 2 === 0 ? '#facc15' : '#e2e8f0'}
                  metalness={0.75}
                  roughness={0.22}
                />
              </mesh>
              <mesh position={[0, 0.031, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.036, 12]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Lampu Meja Sorot Kerja + Kaca Pembesar Pak Karto (Sisi Kiri Counter) */}
        <group position={[-0.78, 1.05, -0.28]}>
          <mesh position={[0, 0.22, 0]} rotation={[0.25, 0, 0.12]} castShadow>
            <cylinderGeometry args={[0.018, 0.022, 0.44, 8]} />
            <meshStandardMaterial color="#b45309" metalness={0.72} roughness={0.3} />
          </mesh>
          <mesh position={[0.06, 0.42, 0.12]} rotation={[0.55, 0, -0.2]}>
            <coneGeometry args={[0.11, 0.14, 12]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.48} />
          </mesh>
          <mesh position={[0.06, 0.37, 0.14]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial
              ref={deskLampMatRef}
              color="#fffbeb"
              emissive="#fde047"
              emissiveIntensity={2.2}
            />
          </mesh>
        </group>

        {/* Dinding Papan Belakang + Papan Nama HD + 3 Jam Dinding Berdetak Real-Time! */}
        <mesh position={[0, 1.86, -0.52]} castShadow>
          <boxGeometry args={[2.16, 1.56, 0.1]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
        <mesh position={[0, 2.34, -0.46]}>
          <planeGeometry args={[2.02, 0.56]} />
          <meshStandardMaterial
            map={watchSignTex}
            emissiveMap={watchSignTex}
            emissive="#fef9c3"
            emissiveIntensity={isEveningOrNight ? 0.66 : 0.14}
          />
        </mesh>

        {/* 3 Jam Dinding Klasik dengan Jarum Menit & Detik Berputar Real-Time */}
        {[-0.64, 0, 0.64].map((cx, ci) => (
          <group key={`wclk-${ci}`} position={[cx, 1.68, -0.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.05, 18]} />
              <meshStandardMaterial color={ci === 1 ? '#b45309' : '#1e293b'} metalness={0.5} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <circleGeometry args={[0.185, 18]} />
              <meshStandardMaterial
                color="#fffbeb"
                emissive="#fef3c7"
                emissiveIntensity={isEveningOrNight ? 0.42 : 0.05}
              />
            </mesh>
            {/* Jarum Menit Hitam */}
            <mesh
              ref={(el) => {
                clockMinuteRefs.current[ci] = el;
              }}
              position={[0, 0, 0.034]}
            >
              <boxGeometry args={[0.014, 0.12, 0.004]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Jarum Detik Merah Berputar Halus */}
            <mesh
              ref={(el) => {
                clockSecondRefs.current[ci] = el;
              }}
              position={[0, 0, 0.038]}
            >
              <boxGeometry args={[0.008, 0.15, 0.004]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        ))}

        {/* Kanopi Atap Biru-Krem Teduh Melindungi dari Hujan */}
        {[-1.02, 1.02].map((px, pi) => (
          <mesh key={`wcp-${pi}`} position={[px, 1.38, 0.46]} castShadow>
            <cylinderGeometry args={[0.036, 0.04, 2.66, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 2.74, 0.04]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[2.38, 0.1, 1.88]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.62} />
        </mesh>
        <mesh position={[0, 2.64, 0.96]}>
          <boxGeometry args={[2.38, 0.18, 0.05]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Lapak Pak Karto */}
        <mesh position={[0, 2.48, 0.24]}>
          <sphereGeometry args={[0.068, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.12}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.48, 0.24]} scale={[1.65, 1.65, 1]}>
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

        {/* Pak Karto Teliti di Belakang Meja Kerja (world [72.75, 0, 12.6]) */}
        <group position={[0, 0, -0.95]}>
          <HumanModel
            profile={PAK_KARTO_PROFILE}
            headRef={kartoHeadRef}
            rightArmRef={kartoRightArmRef}
          />
        </group>
      </group>
    </group>
  );
};
