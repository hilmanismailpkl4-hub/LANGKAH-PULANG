import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface PutuWorkshopAndLaundryProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MANG_ODING_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mang Oding',
  role: 'Penjual Kue Putu Bambu Malam',
  accentColor: '#22c55e',
  voice: { pitch: 0.94, rate: 0.98, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.68,
    shirtColor: '#15803d',
    pantsColor: '#1f2937',
    skinColor: '#c99770',
    hairColor: '#292524',
    accentProp: 'apron',
  },
};

const MAS_BUDI_PROFILE: CharacterProfile = {
  id: 'mas_raka',
  name: 'Mas Budi',
  role: 'Montir Bengkel Tambal Ban Jl. Kenangan',
  accentColor: '#eab308',
  voice: { pitch: 0.95, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#1e3a8a',
    pantsColor: '#18181b',
    skinColor: '#c6936c',
    hairColor: '#1c1917',
    accentProp: 'apron',
  },
};

const MBAK_RINI_PROFILE: CharacterProfile = {
  id: 'mbak_lilis',
  name: 'Mbak Rini',
  role: 'Penjaga Laundry Kiloan Harum Melati',
  accentColor: '#a855f7',
  voice: { pitch: 1.08, rate: 1.0, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.61,
    shirtColor: '#9333ea',
    pantsColor: '#1e293b',
    skinColor: '#dbaf8c',
    hairColor: '#241b17',
    accentProp: 'apron',
  },
};

function createPutuBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#14532d');
  grad.addColorStop(0.5, '#15803d');
  grad.addColorStop(1, '#16a34a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KUE PUTU BAMBU ASLI', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('MANG ODING · PELUIT UAP KHAS MALAM', 320, 96);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('PUTU PANDAN GULA MERAH · KLEPON · LUPIS KETAN · KELAPA PARUT', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createWorkshopSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 640, 176);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(0, 0, 640, 18);
  ctx.fillRect(0, 158, 640, 18);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 22, 620, 132);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAMBAL BAN & ISI ANGIN', 320, 66);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('MAS BUDI · MOTOR & SEPEDA · CEPAT & RAPI', 320, 118);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createLaundrySignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#6b21a8');
  grad.addColorStop(0.55, '#9333ea');
  grad.addColorStop(1, '#c084fc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#faf5ff';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LAUNDRY "HARUM MELATI"', 320, 52);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('CUCI · KERING · SETRIKA UAP WANGI LAVENDER', 320, 96);

  ctx.fillStyle = '#6b21a8';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KILOAN & SATUAN · SEHARI JADI · ANTAR JEMPUT JL. MELATI', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 2 — Sentuhan Bengkel, Laundry & Kue Putu Malam:
 * 1. Gerobak Kue Putu Bambu Beruap + Peluit Malam Mang Oding ([-36.6, 0, -22.6]) di Promenade Sungai Utara
 * 2. Bengkel Tambal Ban & Pompa Angin Mas Budi ([49.2, 0, -14.6]) di Pinggir Jl. Kenangan Timur
 * 3. Kios Laundry Kiloan Wangi "Harum Melati" ([33.8, 0, 39.2]) di Tepi Perumahan Jl. Melati
 */
export const PutuWorkshopAndLaundry: React.FC<PutuWorkshopAndLaundryProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const putuBannerTex = useMemo(() => createPutuBannerTexture(), []);
  const workshopSignTex = useMemo(() => createWorkshopSignTexture(), []);
  const laundrySignTex = useMemo(() => createLaundrySignTexture(), []);

  useEffect(() => {
    return () => {
      putuBannerTex.dispose();
      workshopSignTex.dispose();
      laundrySignTex.dispose();
    };
  }, [putuBannerTex, workshopSignTex, laundrySignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const odingHeadRef = useRef<THREE.Group>(null);
  const odingRightArmRef = useRef<THREE.Group>(null);
  const putuSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  const budiHeadRef = useRef<THREE.Group>(null);
  const budiRightArmRef = useRef<THREE.Group>(null);
  const compressorRef = useRef<THREE.Group>(null);

  const riniHeadRef = useRef<THREE.Group>(null);
  const riniRightArmRef = useRef<THREE.Group>(null);
  const washerDrumARef = useRef<THREE.Group>(null);
  const washerDrumBRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Gerobak Kue Putu Bambu Mang Oding (semburan uap peluit bambu vertikal!)
    if (playerRuntime.putuWhistleTimer > 0) {
      playerRuntime.putuWhistleTimer = Math.max(0, playerRuntime.putuWhistleTimer - dt);
    }
    if (!shouldSkipPerfFrame(-36.6, -22.6, 50)) {
      const distOding = py > 4 ? 99 : Math.hypot(px - -36.6, pz - -22.6);
      if (odingHeadRef.current) {
        odingHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.24;
      }
      if (odingRightArmRef.current) {
        odingRightArmRef.current.rotation.x =
          distOding < 5.5
            ? -1.58 + Math.sin(t * 5.2) * 0.22
            : -0.76 + Math.sin(t * 2.2) * 0.14;
      }
      if (!playerRuntime.perf.isPotato) {
        const whistling = playerRuntime.putuWhistleTimer > 0;
        const riseRate = whistling ? 1.15 : 0.62;
        for (let i = 0; i < 4; i++) {
          const m = putuSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * riseRate + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * (whistling ? 1.15 : 0.72);
          m.position.x = Math.sin(t * 2.4 + i * 1.9) * 0.045 * p;
          const s = (whistling ? 0.68 : 0.45) + p * 1.35;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * (whistling ? 0.42 : 0.26);
        }
      }
    }

    // 2. Bengkel Tambal Ban Mas Budi (kompresor kuning bergetar saat mengisi angin!)
    if (playerRuntime.tirePumpTimer > 0) {
      playerRuntime.tirePumpTimer = Math.max(0, playerRuntime.tirePumpTimer - dt);
    }
    if (!shouldSkipPerfFrame(49.2, -14.6, 50)) {
      const distBudi = py > 4 ? 99 : Math.hypot(px - 47.2, pz - -13.6);
      if (budiHeadRef.current) {
        budiHeadRef.current.rotation.y = Math.sin(t * 0.88) * 0.22;
      }
      if (budiRightArmRef.current) {
        budiRightArmRef.current.rotation.x =
          distBudi < 5.5
            ? -1.55 + Math.sin(t * 5.0) * 0.22
            : -0.5 + Math.sin(t * 1.6) * 0.1;
      }
      if (compressorRef.current) {
        const pumping = playerRuntime.tirePumpTimer > 0;
        compressorRef.current.position.y = pumping ? Math.abs(Math.sin(t * 36)) * 0.018 : 0;
      }
    }

    // 3. Kios Laundry Kiloan "Harum Melati" (2 drum mesin cuci bukaan depan berputar!)
    if (playerRuntime.laundrySpinTimer > 0) {
      playerRuntime.laundrySpinTimer = Math.max(0, playerRuntime.laundrySpinTimer - dt);
    }
    if (!shouldSkipPerfFrame(33.8, 39.2, 50)) {
      const distRini = py > 4 ? 99 : Math.hypot(px - 31.95, pz - 40.2);
      if (riniHeadRef.current) {
        riniHeadRef.current.rotation.y = Math.sin(t * 0.94) * 0.24;
      }
      if (riniRightArmRef.current) {
        riniRightArmRef.current.rotation.x =
          distRini < 5.5
            ? -1.58 + Math.sin(t * 5.2) * 0.22
            : -0.45 + Math.sin(t * 1.5) * 0.08;
      }
      const spinSpd = playerRuntime.laundrySpinTimer > 0 ? 5.8 : 2.1;
      if (washerDrumARef.current) {
        washerDrumARef.current.rotation.z -= dt * spinSpd;
      }
      if (washerDrumBRef.current) {
        washerDrumBRef.current.rotation.z += dt * (spinSpd * 0.88);
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK KUE PUTU BAMBU MANG ODING ([-36.6, 0, -22.6], hadap -X)   */}
      {/* ==================================================================== */}
      <group position={[-36.6, 0, -22.6]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Badan Gerobak Kayu Hijau Pandan Klasik */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#15803d" roughness={0.74} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#9c663a" roughness={0.68} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`pw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <meshStandardMaterial color="#1f242d" roughness={0.85} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.11, 10]} />
              <meshStandardMaterial color="#fde047" roughness={0.45} />
            </mesh>
          </group>
        ))}

        {/* Spanduk Depan HD "KUE PUTU BAMBU ASLI · MANG ODING" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={putuBannerTex}
            emissiveMap={putuBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.12}
          />
        </mesh>

        {/* Pengukus Uap Berpeluit + 4 Tabung Bambu Kue Putu & Semburan Uap Putih (Sisi Kiri Counter) */}
        <group position={[-0.56, 1.1, 0.02]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.48, 0.28, 0.42]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.74} roughness={0.26} />
          </mesh>
          {/* 4 Tabung Bambu Kukus Vertikal */}
          {[-0.14, -0.04, 0.06, 0.16].map((bx, bi) => (
            <mesh key={`btub-${bi}`} position={[bx, 0.36, 0]} castShadow>
              <cylinderGeometry args={[0.028, 0.03, 0.16, 8]} />
              <meshStandardMaterial color="#84a955" roughness={0.78} />
            </mesh>
          ))}
          {/* Cerobong Peluit Uap Kuningan */}
          <mesh position={[-0.16, 0.42, -0.12]}>
            <cylinderGeometry args={[0.022, 0.032, 0.22, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.75} roughness={0.28} />
          </mesh>
          {/* Semburan Uap Putih Peluit Kue Putu */}
          <group position={[-0.16, 0.56, -0.12]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`pst-${si}`}
                ref={(el) => {
                  putuSteamRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.055, 8, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.24} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Etalase Kaca Kue Putu Pandan, Kelapa Parut, Klepon & Lupis (Sisi Kanan Counter) */}
        <group position={[0.42, 1.32, 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[0.96, 0.44, 0.46]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.34} roughness={0.14} />
          </mesh>
          {/* Gunungan Kelapa Parut Putih & Kue Putu Hijau */}
          <mesh position={[-0.24, -0.14, 0]}>
            <sphereGeometry args={[0.14, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.88} />
          </mesh>
          <mesh position={[0.2, -0.14, 0]}>
            <cylinderGeometry args={[0.15, 0.13, 0.08, 12]} />
            <meshStandardMaterial color="#22c55e" roughness={0.72} />
          </mesh>
        </group>

        {/* Payung Kanopi Hijau-Kuning Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#15803d" roughness={0.65} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#eab308" roughness={0.65} />
        </mesh>

        {/* Bohlam Hangat Malam Gerobak Kue Putu */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.12}
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

        {/* Mang Oding Ramah di Belakang Gerobak (world [-35.58, 0, -22.6]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={MANG_ODING_PROFILE}
            headRef={odingHeadRef}
            rightArmRef={odingRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [-38.45, 0, -22.6]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`ptb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. BENGKEL TAMBAL BAN & POMPA ANGIN MAS BUDI ([49.2, 0, -14.6], +Z)  */}
      {/* ==================================================================== */}
      <group position={[49.2, 0, -14.6]}>
        {/* Lantai Semen Bengkel & Rangka Tiang Besi */}
        <mesh position={[0, 0.04, 0.2]} receiveShadow>
          <boxGeometry args={[3.2, 0.08, 2.4]} />
          <meshStandardMaterial color="#64748b" roughness={0.92} />
        </mesh>
        {/* Dinding Belakang & Meja Perkakas Bengkel */}
        <mesh position={[0, 1.32, -0.78]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.56, 0.14]} />
          <meshStandardMaterial color="#334155" roughness={0.82} />
        </mesh>
        <mesh position={[0.45, 0.52, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.96, 0.56]} />
          <meshStandardMaterial color="#784c2a" roughness={0.84} />
        </mesh>
        {/* Kotak Perkakas Merah & Kunci Bengkel di Atas Meja */}
        <mesh position={[0.35, 1.12, -0.45]} castShadow>
          <boxGeometry args={[0.48, 0.24, 0.26]} />
          <meshStandardMaterial color="#dc2626" roughness={0.45} metalness={0.35} />
        </mesh>
        {/* Bak Air Hitam Cek Bocor Ban */}
        <mesh position={[-0.1, 0.18, 0.35]} castShadow>
          <cylinderGeometry args={[0.32, 0.26, 0.3, 14]} />
          <meshStandardMaterial color="#1f2937" roughness={0.75} />
        </mesh>
        <mesh position={[-0.1, 0.31, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.28, 14]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.18} />
        </mesh>

        {/* Atap Seng Miring Bengkel (Melindungi dari Hujan) */}
        {[-1.46, 1.46].map((px, pi) => (
          <mesh key={`wkp-${pi}`} position={[px, 1.32, 0.85]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 2.6, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.45} />
          </mesh>
        ))}
        <mesh position={[0, 2.68, 0.15]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[3.35, 0.1, 2.45]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Papan Nama Depan HD "TAMBAL BAN & ISI ANGIN · MAS BUDI" */}
        <mesh position={[0, 2.44, 1.36]}>
          <planeGeometry args={[2.86, 0.68]} />
          <meshStandardMaterial
            map={workshopSignTex}
            emissiveMap={workshopSignTex}
            emissive="#fef08a"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.12}
          />
        </mesh>

        {/* Kompresor Angin Kuning Ikonik (Bergetar saat Mengisi Angin [E]!) */}
        <group ref={compressorRef} position={[-0.88, 0, 0.24]}>
          <mesh position={[0, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.22, 0.54, 8, 14]} />
            <meshStandardMaterial color="#eab308" metalness={0.35} roughness={0.38} />
          </mesh>
          {/* Kepala Motor Kompresor & Manometer */}
          <mesh position={[-0.12, 0.64, 0]} castShadow>
            <boxGeometry args={[0.26, 0.22, 0.22]} />
            <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.18, 0.62, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.03, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* 2 Roda Kecil Kompresor */}
          {[-0.24, 0.24].map((cx, ci) => (
            <mesh key={`cmw-${ci}`} position={[cx, 0.14, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
              <meshStandardMaterial color="#18181b" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Tumpukan 4 Ban Motor & Sepeda Hitam di Sisi Kanan */}
        {[0, 1, 2, 3].map((ti) => (
          <mesh key={`tir-${ti}`} position={[1.08, 0.14 + ti * 0.22, 0.38]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.28, 0.1, 8, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.88} />
          </mesh>
        ))}

        {/* Bohlam Hangat Bengkel Malam */}
        <mesh position={[0, 2.38, 0.35]}>
          <sphereGeometry args={[0.072, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.1}
          />
        </mesh>

        {/* Mas Budi Ramah di Sisi Kiri Bengkel (world [47.2, 0, -13.6]) */}
        <group position={[-2.0, 0, 1.0]}>
          <HumanModel
            profile={MAS_BUDI_PROFILE}
            headRef={budiHeadRef}
            rightArmRef={budiRightArmRef}
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. KIOS LAUNDRY KILOAN WANGI "HARUM MELATI" ([33.8, 0, 39.2], +Z)    */}
      {/* ==================================================================== */}
      <group position={[33.8, 0, 39.2]}>
        {/* Badan Kios Putih-Ungu Lavender Bersih */}
        <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.88, 1.82]} />
          <meshStandardMaterial color="#faf5ff" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.48, 0.02]}>
          <boxGeometry args={[3.08, 0.96, 1.84]} />
          <meshStandardMaterial color="#9333ea" roughness={0.62} />
        </mesh>
        {/* Atap Kanopi Ungu-Putih Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 2.86, 0.56]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[3.32, 0.14, 2.95]} />
          <meshStandardMaterial color="#7e22ce" roughness={0.62} />
        </mesh>

        {/* Spanduk Depan HD "LAUNDRY HARUM MELATI" */}
        <mesh position={[0, 2.52, 0.94]}>
          <planeGeometry args={[2.86, 0.64]} />
          <meshStandardMaterial
            map={laundrySignTex}
            emissiveMap={laundrySignTex}
            emissive="#f3e8ff"
            emissiveIntensity={isEveningOrNight ? 0.65 : 0.12}
          />
        </mesh>

        {/* Etalase Kaca Lebar + 2 Mesin Cuci Bukaan Depan Berputar + Rak Baju Terlipat Rapi! */}
        <group position={[0.25, 1.4, 0.84]}>
          {/* Ruang Dalam Kios Cerah */}
          <mesh position={[0, 0, -0.14]}>
            <boxGeometry args={[2.16, 1.24, 0.34]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#f3e8ff' : '#ede9fe'}
              emissive="#e9d5ff"
              emissiveIntensity={isEveningOrNight ? 0.62 : 0.08}
            />
          </mesh>

          {/* 2 Mesin Cuci Bukaan Depan dengan Drum Berputar */}
          {[
            { x: -0.62, ref: washerDrumARef, clothA: '#f472b6', clothB: '#38bdf8' },
            { x: 0.04, ref: washerDrumBRef, clothA: '#facc15', clothB: '#4ade80' },
          ].map((wm, wi) => (
            <group key={`wm-${wi}`} position={[wm.x, -0.22, -0.04]}>
              <mesh castShadow>
                <boxGeometry args={[0.56, 0.72, 0.24]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.35} />
              </mesh>
              {/* Bingkai Pintu Bundar Mesin Cuci */}
              <mesh position={[0, -0.04, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.17, 0.028, 8, 16]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.22} />
              </mesh>
              {/* Drum Kaca + Baju Warna-Warni Berputar di Dalamnya! */}
              <group ref={wm.ref} position={[0, -0.04, 0.125]}>
                <mesh position={[0.055, 0.04, 0]}>
                  <sphereGeometry args={[0.068, 8, 8]} />
                  <meshStandardMaterial color={wm.clothA} roughness={0.75} />
                </mesh>
                <mesh position={[-0.055, -0.04, 0]}>
                  <sphereGeometry args={[0.064, 8, 8]} />
                  <meshStandardMaterial color={wm.clothB} roughness={0.75} />
                </mesh>
              </group>
            </group>
          ))}

          {/* Rak Tumpukan Baju Terlipat Rapi Wangi (Sisi Kanan Etalase) */}
          <group position={[0.72, -0.06, -0.06]}>
            {[
              { y: -0.34, col: '#f9a8d4' },
              { y: -0.1, col: '#93c5fd' },
              { y: 0.14, col: '#86efac' },
              { y: 0.36, col: '#fde68a' },
            ].map((b, bi) => (
              <mesh key={`lnd-${bi}`} position={[0, b.y, 0]}>
                <boxGeometry args={[0.42, 0.16, 0.2]} />
                <meshStandardMaterial color={b.col} roughness={0.72} />
              </mesh>
            ))}
          </group>

          {/* Kaca Depan Bening */}
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[2.18, 1.26]} />
            <meshStandardMaterial color="#e0e7ff" transparent opacity={0.24} roughness={0.1} />
          </mesh>
        </group>

        {/* Mbak Rini Ramah di Sisi Barat Kios (world [31.95, 0, 40.2]) */}
        <group position={[-1.85, 0, 1.0]}>
          <HumanModel
            profile={MBAK_RINI_PROFILE}
            headRef={riniHeadRef}
            rightArmRef={riniRightArmRef}
            isFemale
          />
        </group>
      </group>
    </group>
  );
};

