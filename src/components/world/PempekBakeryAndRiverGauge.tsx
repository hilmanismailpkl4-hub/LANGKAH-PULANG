import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface PempekBakeryAndRiverGaugeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const CEK_ANI_PROFILE: CharacterProfile = {
  id: 'bu_wati',
  name: 'Cek Ani',
  role: 'Penjual Pempek Palembang Promenade Sungai',
  accentColor: '#f97316',
  voice: { pitch: 1.05, rate: 1.0, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.61,
    shirtColor: '#be123c',
    pantsColor: '#1f2937',
    skinColor: '#cfa07b',
    hairColor: '#241b17',
    accentProp: 'apron',
  },
};

const IBU_DEWI_PROFILE: CharacterProfile = {
  id: 'mbak_lilis',
  name: 'Ibu Dewi',
  role: 'Pemilik Toko Kue Tradisional "Dapur Manis"',
  accentColor: '#f472b6',
  voice: { pitch: 1.08, rate: 0.99, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.6,
    shirtColor: '#db2777',
    pantsColor: '#1e293b',
    skinColor: '#dbaf8c',
    hairColor: '#29211d',
    accentProp: 'apron',
  },
};

function createPempekBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#881337');
  grad.addColorStop(0.5, '#be123c');
  grad.addColorStop(1, '#d97706');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fffbeb';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PEMPEK PALEMBANG ASLI', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('CEK ANI · IKAN TENGGIRI & CUKO GULA BATOK', 320, 96);

  ctx.fillStyle = '#881337';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KAPAL SELAM · LENJER · ADAAN · ES KACANG MERAH SEGAR', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createBakerySignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#9d174d');
  grad.addColorStop(0.55, '#db2777');
  grad.addColorStop(1, '#f472b6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fef3c7';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fff1f2';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOKO KUE "DAPUR MANIS"', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('IBU DEWI · BOLU KUKUS · KUE LAPIS · BROWNIES', 320, 96);

  ctx.fillStyle = '#9d174d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('JAJANAN PASAR HANGAT · RISOLES MAYO · KUE ULANG TAHUN', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createRiverRulerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  // Pita warna TMA (Merah atas Awas, Kuning tengah Siaga, Biru bawah Normal)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 128, 120);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(0, 120, 128, 140);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 260, 128, 252);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(12, 0, 104, 512);

  // Skala penggaris Peilschaal (200 cm turun ke 20 cm)
  const marks = ['200', '160', '120', '80', '40'];
  marks.forEach((label, idx) => {
    const y = 44 + idx * 104;
    ctx.fillStyle = idx === 0 ? '#dc2626' : idx <= 2 ? '#ca8a04' : '#0284c7';
    ctx.fillRect(12, y - 16, 104, 14);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 64, y + 24);
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createHydroPanelTexture(isRain: boolean): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 448;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 384, 448);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 384, 78);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POS PANTAU SUNGAI', 192, 30);
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText('TELEMETRI TMA & CUACA KOTA', 192, 58);

  // Status Tinggi Muka Air
  ctx.fillStyle = isRain ? '#78350f' : '#064e3b';
  ctx.fillRect(26, 104, 332, 92);
  ctx.strokeStyle = isRain ? '#facc15' : '#34d399';
  ctx.lineWidth = 4;
  ctx.strokeRect(26, 104, 332, 92);

  ctx.fillStyle = isRain ? '#fde047' : '#6ee7b7';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(isRain ? 'STATUS: WASPADA HUJAN' : 'STATUS: AMAN NORMAL', 192, 134);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(isRain ? 'TMA 112 cm' : 'TMA 68 cm', 192, 174);

  // Info Angin & Debit
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(26, 218, 332, 146);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(isRain ? 'Curah Hujan : Sedang–Deras' : 'Cuaca       : Cerah Teduh', 192, 254);
  ctx.fillText(isRain ? 'Kecep. Angin: 18 km/jam' : 'Kecep. Angin: 7 km/jam', 192, 294);
  ctx.fillText('Debit Sungai: Mengalir Lancar', 192, 334);

  ctx.fillStyle = '#7dd3fc';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Tekan [E] · Cek Pembacaan Sensor', 192, 404);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 3 — Riuh Sore Kompleks & Tepi Sungai:
 * 1. Gerobak Pempek Palembang & Es Kacang Merah Cek Ani ([-36.6, 0, -30.8], hadap -X) di Promenade Sungai Utara
 * 2. Kios Toko Kue & Jajanan Tradisional "Dapur Manis" ([49.2, 0, 39.2], hadap +Z) di Jl. Melati Timur
 * 3. Pos Pantau Tinggi Air (Peilschaal TMA) & Sensor Cuaca Sungai Kota ([-38.85, 0, -11.0]) di Tepi Jembatan
 */
export const PempekBakeryAndRiverGauge: React.FC<PempekBakeryAndRiverGaugeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const pempekBannerTex = useMemo(() => createPempekBannerTexture(), []);
  const bakerySignTex = useMemo(() => createBakerySignTexture(), []);
  const riverRulerTex = useMemo(() => createRiverRulerTexture(), []);
  const isRain = timeOfDay === 'rain_dusk';
  const hydroPanelTex = useMemo(() => createHydroPanelTexture(isRain), [isRain]);

  useEffect(() => {
    return () => {
      pempekBannerTex.dispose();
      bakerySignTex.dispose();
      riverRulerTex.dispose();
    };
  }, [pempekBannerTex, bakerySignTex, riverRulerTex]);

  useEffect(() => {
    return () => {
      hydroPanelTex.dispose();
    };
  }, [hydroPanelTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const aniHeadRef = useRef<THREE.Group>(null);
  const aniRightArmRef = useRef<THREE.Group>(null);
  const pempekSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  const dewiHeadRef = useRef<THREE.Group>(null);
  const dewiRightArmRef = useRef<THREE.Group>(null);
  const cakeTurntableRef = useRef<THREE.Group>(null);

  const anemometerRef = useRef<THREE.Group>(null);
  const hydroLedMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Gerobak Pempek Cek Ani (uap gorengan & pempek hangat!)
    if (playerRuntime.pempekFryTimer > 0) {
      playerRuntime.pempekFryTimer = Math.max(0, playerRuntime.pempekFryTimer - dt);
    }
    if (!shouldSkipPerfFrame(-36.6, -30.8, 50)) {
      const distAni = py > 4 ? 99 : Math.hypot(px - -36.6, pz - -30.8);
      const frying = playerRuntime.pempekFryTimer > 0;
      if (aniHeadRef.current) {
        aniHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.24;
      }
      if (aniRightArmRef.current) {
        aniRightArmRef.current.rotation.x =
          distAni < 5.5
            ? -1.56 + Math.sin(t * 5.2) * 0.22
            : -0.76 + Math.sin(t * 2.3) * 0.14;
      }
      if (!playerRuntime.perf.isPotato) {
        const riseRate = frying ? 1.05 : 0.56;
        for (let i = 0; i < 4; i++) {
          const m = pempekSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * riseRate + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * (frying ? 0.78 : 0.52);
          m.position.x = Math.sin(t * 2.4 + i * 1.8) * 0.045 * p;
          const s = (frying ? 0.65 : 0.45) + p * 1.15;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * (frying ? 0.36 : 0.22);
        }
      }
    }

    // 2. Kios Toko Kue "Dapur Manis" (meja putar kue tart di etalase berputar halus!)
    if (playerRuntime.bakeryBellTimer > 0) {
      playerRuntime.bakeryBellTimer = Math.max(0, playerRuntime.bakeryBellTimer - dt);
    }
    if (!shouldSkipPerfFrame(49.2, 39.2, 50)) {
      const distDewi = py > 4 ? 99 : Math.hypot(px - 47.35, pz - 40.2);
      if (dewiHeadRef.current) {
        dewiHeadRef.current.rotation.y = Math.sin(t * 0.92) * 0.22;
      }
      if (dewiRightArmRef.current) {
        dewiRightArmRef.current.rotation.x =
          distDewi < 5.5
            ? -1.56 + Math.sin(t * 5.0) * 0.22
            : -0.46 + Math.sin(t * 1.5) * 0.08;
      }
      if (cakeTurntableRef.current) {
        const speed = playerRuntime.bakeryBellTimer > 0 ? 2.8 : 0.75;
        cakeTurntableRef.current.rotation.y += dt * speed;
      }
    }

    // 3. Pos Pantau TMA & Sensor Cuaca Sungai Kota (anemometer & lampu LED reaktif cuaca!)
    if (playerRuntime.hydroSensorTimer > 0) {
      playerRuntime.hydroSensorTimer = Math.max(0, playerRuntime.hydroSensorTimer - dt);
    }
    if (!shouldSkipPerfFrame(-38.85, -11.0, 52)) {
      const active = playerRuntime.hydroSensorTimer > 0;
      if (anemometerRef.current) {
        const windSpd = isRain ? 7.8 : active ? 6.2 : 2.6;
        anemometerRef.current.rotation.y += dt * windSpd;
      }
      if (hydroLedMatRef.current) {
        const pulse = Math.sin(t * (isRain || active ? 6.5 : 2.2)) * 0.6;
        hydroLedMatRef.current.emissiveIntensity = Math.max(0.4, (isRain ? 2.4 : 1.7) + pulse);
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK PEMPEK PALEMBANG CEK ANI ([-36.6, 0, -30.8], hadap -X)    */}
      {/* ==================================================================== */}
      <group position={[-36.6, 0, -30.8]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Badan Gerobak Merah Marun & Kuning Emas Palembang */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#9f1239" roughness={0.74} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#b45309" roughness={0.68} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`pmw-${wi}`} position={[wx, 0.34, 0]}>
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

        {/* Spanduk Depan HD "PEMPEK PALEMBANG ASLI · CEK ANI" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={pempekBannerTex}
            emissiveMap={pempekBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.64 : 0.14}
          />
        </mesh>

        {/* Wajan Penggorengan Pempek Panas + Uap Putih (Sisi Kiri Counter) */}
        <group position={[-0.6, 1.08, 0.04]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.19, 0.16, 14]} />
            <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.24, 14]} />
            <meshStandardMaterial color="#d97706" roughness={0.22} metalness={0.18} />
          </mesh>
          {/* 2 Pempek Kapal Selam Sedang Digoreng */}
          <mesh position={[-0.07, 0.16, 0.04]} rotation={[0, 0.4, Math.PI / 2]}>
            <capsuleGeometry args={[0.032, 0.075, 5, 8]} />
            <meshStandardMaterial color="#eab308" roughness={0.55} />
          </mesh>
          <mesh position={[0.08, 0.16, -0.04]} rotation={[0, -0.3, Math.PI / 2]}>
            <capsuleGeometry args={[0.03, 0.07, 5, 8]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.55} />
          </mesh>
          <group position={[0, 0.22, 0]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`pmst-${si}`}
                ref={(el) => {
                  pempekSteamRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.052, 8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Etalase Kaca Isi Pempek Lenjer, Kapal Selam, Botol Kuah Cuko & Es Kacang Merah (Sisi Kanan Counter) */}
        <group position={[0.42, 1.32, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[1.02, 0.46, 0.46]} />
            <meshStandardMaterial color="#fef3c7" transparent opacity={0.32} roughness={0.14} />
          </mesh>
          {/* Tumpukan Pempek Emas & Potongan Timun */}
          <mesh position={[-0.28, -0.14, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.26]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.62} />
          </mesh>
          <mesh position={[0.04, -0.14, 0]}>
            <cylinderGeometry args={[0.11, 0.09, 0.08, 12]} />
            <meshStandardMaterial color="#22c55e" roughness={0.58} />
          </mesh>
          {/* 2 Botol Kaca Kuah Cuko Palembang Gelap */}
          {[0.26, 0.37].map((bx, bi) => (
            <mesh key={`cko-${bi}`} position={[bx, -0.06, 0.04]}>
              <cylinderGeometry args={[0.032, 0.036, 0.24, 10]} />
              <meshStandardMaterial color="#3b1d0a" roughness={0.24} />
            </mesh>
          ))}
        </group>

        {/* Payung Kanopi Merah-Emas Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#be123c" roughness={0.65} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#eab308" roughness={0.65} />
        </mesh>

        {/* Bohlam Hangat Gerobak Pempek */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.14}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && !playerRuntime.perf.isPotato && (
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

        {/* Cek Ani Ramah di Belakang Gerobak (world [-35.58, 0, -30.8]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={CEK_ANI_PROFILE}
            headRef={aniHeadRef}
            rightArmRef={aniRightArmRef}
            isFemale
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [-38.45, 0, -30.8]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`pmb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. KIOS TOKO KUE TRADISIONAL "DAPUR MANIS" ([49.2, 0, 39.2], +Z)     */}
      {/* ==================================================================== */}
      <group position={[49.2, 0, 39.2]}>
        {/* Badan Kios Krem-Merah Muda Pastel Manis */}
        <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.88, 1.82]} />
          <meshStandardMaterial color="#fff1f2" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.46, 0.02]}>
          <boxGeometry args={[3.08, 0.92, 1.84]} />
          <meshStandardMaterial color="#db2777" roughness={0.58} />
        </mesh>
        {/* Atap Kanopi Rose-Krem Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 2.86, 0.56]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[3.32, 0.14, 2.95]} />
          <meshStandardMaterial color="#9d174d" roughness={0.6} />
        </mesh>

        {/* Papan Nama HD "TOKO KUE 'DAPUR MANIS'" */}
        <mesh position={[0, 2.52, 0.94]}>
          <planeGeometry args={[2.86, 0.64]} />
          <meshStandardMaterial
            map={bakerySignTex}
            emissiveMap={bakerySignTex}
            emissive="#fce7f3"
            emissiveIntensity={isEveningOrNight ? 0.68 : 0.14}
          />
        </mesh>

        {/* Etalase Kaca Toko Kue + Meja Putar Kue Tart + Nampan Bolu Kukus & Kue Lapis! */}
        <group position={[0.25, 1.4, 0.84]}>
          <mesh position={[0, 0, -0.14]}>
            <boxGeometry args={[2.16, 1.24, 0.34]} />
            <meshStandardMaterial
              color="#fffbeb"
              emissive="#fde68a"
              emissiveIntensity={isEveningOrNight ? 0.68 : 0.1}
            />
          </mesh>

          {/* Meja Putar Kue Tart Cokelat Stroberi (Kiri Etalase — Berputar Halus!) */}
          <group ref={cakeTurntableRef} position={[-0.64, -0.34, -0.02]}>
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.24, 0.2, 0.08, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.28} />
            </mesh>
            {/* Kue Tart Cokelat Berlapis Krim & Ceri Merah */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
              <meshStandardMaterial color="#5c2d16" roughness={0.55} />
            </mesh>
            <mesh position={[0, 0.29, 0]}>
              <cylinderGeometry args={[0.185, 0.185, 0.03, 16]} />
              <meshStandardMaterial color="#fffbeb" roughness={0.45} />
            </mesh>
            {[0, 1, 2, 3].map((ci) => {
              const ang = (ci * Math.PI) / 2;
              return (
                <mesh key={`chr-${ci}`} position={[Math.cos(ang) * 0.11, 0.32, Math.sin(ang) * 0.11]}>
                  <sphereGeometry args={[0.025, 8, 8]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.35} />
                </mesh>
              );
            })}
          </group>

          {/* Rak Nampan Kue Lapis Pelangi, Bolu Kukus Mekar & Risoles (Tengah & Kanan Etalase) */}
          <group position={[0.36, -0.04, -0.04]}>
            {[-0.28, 0.16].map((ry, ri) => (
              <group key={`bksh-${ri}`} position={[0, ry, 0]}>
                <mesh position={[0, -0.06, 0]}>
                  <boxGeometry args={[1.18, 0.03, 0.24]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.35} />
                </mesh>
                {[-0.4, -0.14, 0.14, 0.4].map((kx, ki) => (
                  <mesh key={`kue-${ri}-${ki}`} position={[kx, 0.03, 0]}>
                    <cylinderGeometry args={[0.08, 0.07, 0.1, 10]} />
                    <meshStandardMaterial
                      color={['#f472b6', '#4ade80', '#facc15', '#d97706'][(ri + ki) % 4]}
                      roughness={0.62}
                    />
                  </mesh>
                ))}
              </group>
            ))}
          </group>

          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[2.18, 1.26]} />
            <meshStandardMaterial color="#fce7f3" transparent opacity={0.22} roughness={0.1} />
          </mesh>
        </group>

        {/* Ibu Dewi Ramah di Sisi Barat Kios (world [47.35, 0, 40.2]) */}
        <group position={[-1.85, 0, 1.0]}>
          <HumanModel
            profile={IBU_DEWI_PROFILE}
            headRef={dewiHeadRef}
            rightArmRef={dewiRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. POS PANTAU TMA & SENSOR CUACA SUNGAI KOTA ([-38.85, 0, -11.0])    */}
      {/* ==================================================================== */}
      <group>
        {/* Papan Penggaris Pengukur Tinggi Air (Peilschaal TMA) Menempel di Tanggul Sungai */}
        <mesh position={[-39.95, 0.36, -11.0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.32, 1.56, 0.05]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
        <mesh position={[-39.99, 0.36, -11.0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.28, 1.48]} />
          <meshStandardMaterial
            map={riverRulerTex}
            emissiveMap={riverRulerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.35 : 0.06}
          />
        </mesh>

        {/* Tiang Telemetri Digital, Panel Surya, Lampu Status & Anemometer Berputar */}
        <group position={[-38.85, 0, -11.0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Pedestal Baja & Layar Digital Info Tinggi Air */}
          <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.64, 1.84, 0.28]} />
            <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.38} />
          </mesh>
          <mesh position={[0, 1.18, 0.148]}>
            <planeGeometry args={[0.56, 0.66]} />
            <meshStandardMaterial
              map={hydroPanelTex}
              emissiveMap={hydroPanelTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.78 : 0.26}
            />
          </mesh>
          {/* Panel Surya Mini di Atas Pedestal */}
          <mesh position={[0, 1.9, 0]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.68, 0.06, 0.4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.72} roughness={0.22} />
          </mesh>

          {/* Tiang Sensor Angin & Lampu Status Siaga Sungai */}
          <mesh position={[0, 2.38, -0.04]} castShadow>
            <cylinderGeometry args={[0.032, 0.038, 0.92, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Lampu Status Beacon (Hijau saat Aman, Kuning-Amber saat Hujan!) */}
          <mesh position={[0.18, 2.24, 0.02]}>
            <sphereGeometry args={[0.062, 10, 10]} />
            <meshStandardMaterial
              ref={hydroLedMatRef}
              color={isRain ? '#facc15' : '#34d399'}
              emissive={isRain ? '#f59e0b' : '#10b981'}
              emissiveIntensity={1.8}
            />
          </mesh>

          {/* Anemometer 3 Mangkuk Pengukur Kecepatan Angin Berputar Real-Time! */}
          <group ref={anemometerRef} position={[0, 2.86, -0.04]}>
            <mesh>
              <cylinderGeometry args={[0.035, 0.035, 0.08, 10]} />
              <meshStandardMaterial color="#1e293b" metalness={0.6} />
            </mesh>
            {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((ang, ai) => (
              <group key={`anc-${ai}`} rotation={[0, ang, 0]}>
                <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.28, 6]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.75} />
                </mesh>
                <mesh position={[0.28, 0, 0]}>
                  <sphereGeometry args={[0.048, 8, 8]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.42} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
};
