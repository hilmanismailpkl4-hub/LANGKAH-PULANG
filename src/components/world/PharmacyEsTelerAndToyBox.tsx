import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface PharmacyEsTelerAndToyBoxProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MBAK_NITA_PROFILE: CharacterProfile = {
  id: 'mbak_lilis',
  name: 'Mbak Nita',
  role: 'Apoteker Apotek 24 Jam Sehat Melati',
  accentColor: '#10b981',
  voice: { pitch: 1.07, rate: 0.99, preferGender: 'female', volumeScale: 1 },
  appearance: {
    height: 1.62,
    shirtColor: '#f8fafc',
    pantsColor: '#065f46',
    skinColor: '#dbaf8c',
    hairColor: '#241b17',
    accentProp: 'cardigan',
  },
};

const BANG_DAUD_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Bang Daud',
  role: 'Penjual Es Teler Alpukat & Kelapa Muda',
  accentColor: '#84cc16',
  voice: { pitch: 0.96, rate: 1.01, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.71,
    shirtColor: '#16a34a',
    pantsColor: '#1e293b',
    skinColor: '#c99770',
    hairColor: '#1c1917',
    accentProp: 'apron',
  },
};

function createPharmacySignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#065f46');
  grad.addColorStop(0.55, '#059669');
  grad.addColorStop(1, '#10b981');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#ecfdf5';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('APOTEK "SEHAT MELATI"', 320, 52);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('BUKA 24 JAM · OBAT RESEP · VITAMIN KELUARGA', 320, 96);

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('KONSULTASI APOTEKER · BALSEM HANGAT · P3K · ALAT KESEHATAN', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createEsTelerBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#15803d');
  grad.addColorStop(0.5, '#65a30d');
  grad.addColorStop(1, '#eab308');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ES TELER ALPUKAT SEGAR', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('BANG DAUD · KELAPA MUDA & NANGKA HARUM', 320, 96);

  ctx.fillStyle = '#14532d';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('ALPUKAT MENTEGA · KELAPA MUDA · NANGKA · CINCAU · SUSU', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createToyBoxSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 448;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, 0, 448, 160);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 7;
  ctx.strokeRect(7, 7, 434, 146);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOTAK BERBAGI ANAK', 224, 48);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('BUKU CERITA & MAINAN TAMAN', 224, 92);

  ctx.fillStyle = '#bae6fd';
  ctx.font = 'italic 16px Georgia, serif';
  ctx.fillText('Ambil Seperlunya · Titip Seikhlasnya [E]', 224, 128);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Opsi 3 — Klinik Warga, Apotek Malam & Es Teler Segar:
 * 1. Apotek 24 Jam "Sehat Melati" ([-30.2, 0, 39.2]) dengan Palang Hijau LED Lembut
 * 2. Gerobak Es Teler Alpukat & Kelapa Muda Bang Daud ([-17.6, 0, -13.4]) di Tepi Jl. Kenangan
 * 3. Kotak Donasi Buku & Mainan Anak "Berbagi Senja" ([-79.6, 0, 25.8]) di Tepi Taman Bermain
 */
export const PharmacyEsTelerAndToyBox: React.FC<PharmacyEsTelerAndToyBoxProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const pharmacySignTex = useMemo(() => createPharmacySignTexture(), []);
  const esTelerBannerTex = useMemo(() => createEsTelerBannerTexture(), []);
  const toyBoxSignTex = useMemo(() => createToyBoxSignTexture(), []);

  useEffect(() => {
    return () => {
      pharmacySignTex.dispose();
      esTelerBannerTex.dispose();
      toyBoxSignTex.dispose();
    };
  }, [pharmacySignTex, esTelerBannerTex, toyBoxSignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';

  const nitaHeadRef = useRef<THREE.Group>(null);
  const nitaRightArmRef = useRef<THREE.Group>(null);
  const crossMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const daudHeadRef = useRef<THREE.Group>(null);
  const daudRightArmRef = useRef<THREE.Group>(null);
  const iceCrankRef = useRef<THREE.Group>(null);

  const toyDoorRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Apotek 24 Jam "Sehat Melati" (palang hijau LED berdenyut lembut saat senja/malam!)
    if (playerRuntime.pharmacyPulseTimer > 0) {
      playerRuntime.pharmacyPulseTimer = Math.max(0, playerRuntime.pharmacyPulseTimer - dt);
    }
    if (!shouldSkipPerfFrame(-30.2, 39.2, 52)) {
      const distNita = py > 4 ? 99 : Math.hypot(px - -28.35, pz - 40.2);
      if (nitaHeadRef.current) {
        nitaHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.22;
      }
      if (nitaRightArmRef.current) {
        nitaRightArmRef.current.rotation.x =
          distNita < 5.5
            ? -1.56 + Math.sin(t * 5.0) * 0.22
            : -0.45 + Math.sin(t * 1.5) * 0.08;
      }
      if (crossMatRef.current) {
        const active = playerRuntime.pharmacyPulseTimer > 0;
        const base = active ? 2.8 : isDarkNight ? 2.4 : isEveningOrNight ? 1.85 : 0.65;
        crossMatRef.current.emissiveIntensity = base + Math.sin(t * (active ? 6.0 : 2.1)) * 0.35;
      }
    }

    // 2. Gerobak Es Teler Bang Daud (engkol mesin serut es batu berputar!)
    if (playerRuntime.estelerShaveTimer > 0) {
      playerRuntime.estelerShaveTimer = Math.max(0, playerRuntime.estelerShaveTimer - dt);
    }
    if (!shouldSkipPerfFrame(-17.6, -13.4, 50)) {
      const distDaud = py > 4 ? 99 : Math.hypot(px - -17.6, pz - -13.4);
      const shaving = playerRuntime.estelerShaveTimer > 0;
      if (daudHeadRef.current) {
        daudHeadRef.current.rotation.y = Math.sin(t * 0.92) * 0.24;
      }
      if (daudRightArmRef.current) {
        daudRightArmRef.current.rotation.x =
          distDaud < 5.5
            ? -1.54 + Math.sin(t * 5.2) * 0.22
            : -0.78 + Math.sin(t * (shaving ? 8.5 : 2.4)) * 0.16;
      }
      if (iceCrankRef.current) {
        iceCrankRef.current.rotation.z -= dt * (shaving ? 11.5 : 1.8);
      }
    }

    // 3. Kotak Donasi Buku & Mainan Anak (pintu kaca terbuka halus saat berdonasi / memeriksa!)
    if (playerRuntime.toyBoxOpenTimer > 0) {
      playerRuntime.toyBoxOpenTimer = Math.max(0, playerRuntime.toyBoxOpenTimer - dt);
    }
    if (!shouldSkipPerfFrame(-79.6, 25.8, 46)) {
      if (toyDoorRef.current) {
        const targetOpen = playerRuntime.toyBoxOpenTimer > 0 ? -1.12 : 0;
        toyDoorRef.current.rotation.y = THREE.MathUtils.lerp(
          toyDoorRef.current.rotation.y,
          targetOpen,
          Math.min(1, dt * 5.5),
        );
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. APOTEK 24 JAM "SEHAT MELATI" ([-30.2, 0, 39.2], hadap +Z)         */}
      {/* ==================================================================== */}
      <group position={[-30.2, 0, 39.2]}>
        {/* Badan Apotek Putih Bersih & Lis Hijau Zamrud */}
        <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.04, 2.88, 1.82]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.46, 0.02]}>
          <boxGeometry args={[3.08, 0.92, 1.84]} />
          <meshStandardMaterial color="#059669" roughness={0.56} />
        </mesh>
        {/* Atap Kanopi Hijau Zamrud Teduh (Melindungi dari Hujan) */}
        <mesh position={[0, 2.86, 0.56]} rotation={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[3.32, 0.14, 2.95]} />
          <meshStandardMaterial color="#065f46" roughness={0.58} />
        </mesh>

        {/* Papan Nama Depan HD "APOTEK SEHAT MELATI · BUKA 24 JAM" */}
        <mesh position={[0, 2.52, 0.94]}>
          <planeGeometry args={[2.86, 0.64]} />
          <meshStandardMaterial
            map={pharmacySignTex}
            emissiveMap={pharmacySignTex}
            emissive="#d1fae5"
            emissiveIntensity={isEveningOrNight ? 0.72 : 0.14}
          />
        </mesh>

        {/* Tanda Palang Hijau LED 24 Jam (+) Menjorok di Sisi Kiri Fasad */}
        <group position={[-1.72, 2.28, 0.62]}>
          {/* Braket Logam */}
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.26, 0.08, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
          {/* Bingkai Kotak Hitam + Palang Hijau Menyala Lembut */}
          <mesh>
            <boxGeometry args={[0.48, 0.48, 0.12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.13, 0.36, 0.145]} />
            <meshStandardMaterial
              ref={crossMatRef}
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={1.8}
            />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.36, 0.13, 0.145]} />
            <meshStandardMaterial
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={isEveningOrNight ? 2.1 : 0.75}
            />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && !playerRuntime.perf.isPotato && (
            <sprite position={[0, 0, 0.14]} scale={[1.85, 1.85, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#34d399"
                transparent
                opacity={isDarkNight ? 0.64 : 0.42}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>

        {/* Etalase Kaca Apotek Bersih dengan Rak Vitamin & Obat Tersusun Rapi */}
        <group position={[-0.18, 1.4, 0.84]}>
          <mesh position={[0, 0, -0.14]}>
            <boxGeometry args={[2.24, 1.24, 0.34]} />
            <meshStandardMaterial
              color="#ecfdf5"
              emissive="#d1fae5"
              emissiveIntensity={isEveningOrNight ? 0.72 : 0.12}
            />
          </mesh>
          {/* 3 Baris Rak Botol Vitamin & Kotak P3K */}
          {[-0.3, 0.04, 0.36].map((ry, ri) => (
            <group key={`phsh-${ri}`} position={[0, ry, -0.06]}>
              <mesh position={[0, -0.07, 0]}>
                <boxGeometry args={[2.0, 0.03, 0.2]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
              </mesh>
              {[-0.75, -0.35, 0.05, 0.45, 0.8].map((bx, bi) => (
                <mesh key={`med-${ri}-${bi}`} position={[bx, 0.03, 0]}>
                  <boxGeometry args={[0.22, 0.16, 0.12]} />
                  <meshStandardMaterial
                    color={['#ffffff', '#38bdf8', '#fbbf24', '#34d399', '#fb7185'][(ri + bi) % 5]}
                    roughness={0.45}
                  />
                </mesh>
              ))}
            </group>
          ))}
          <mesh position={[0, 0, 0.12]}>
            <planeGeometry args={[2.26, 1.26]} />
            <meshStandardMaterial color="#d1fae5" transparent opacity={0.22} roughness={0.1} />
          </mesh>
        </group>

        {/* Mbak Nita Apoteker Ramah di Sisi Timur Kios (world [-28.35, 0, 40.2]) */}
        <group position={[1.85, 0, 1.0]}>
          <HumanModel
            profile={MBAK_NITA_PROFILE}
            headRef={nitaHeadRef}
            rightArmRef={nitaRightArmRef}
            isFemale
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. GEROBAK ES TELER ALPUKAT & KELAPA MUDA BANG DAUD ([-17.6,0,-13.4])*/}
      {/* ==================================================================== */}
      <group position={[-17.6, 0, -13.4]}>
        {/* Badan Gerobak Hijau-Kuning Tropis Segar */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#15803d" roughness={0.72} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#facc15" roughness={0.55} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`etw-${wi}`} position={[wx, 0.34, 0]}>
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

        {/* Spanduk Depan HD "ES TELER ALPUKAT SEGAR · BANG DAUD" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={esTelerBannerTex}
            emissiveMap={esTelerBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.64 : 0.14}
          />
        </mesh>

        {/* Mesin Serut Es Batu Manual dengan Engkol Berputar (Sisi Kiri Counter) */}
        <group position={[-0.62, 1.08, 0.02]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[0.34, 0.46, 0.32]} />
            <meshStandardMaterial color="#0284c7" metalness={0.42} roughness={0.38} />
          </mesh>
          {/* Balok Es Bening di Atas Serutan */}
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[0.24, 0.16, 0.24]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.78} roughness={0.12} />
          </mesh>
          {/* Roda Engkol Serut Es Berputar */}
          <group ref={iceCrankRef} position={[0.22, 0.34, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.13, 0.018, 8, 14]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
            </mesh>
            <mesh position={[0.04, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.09, 6]} />
              <meshStandardMaterial color="#dc2626" roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* Etalase Kaca Isi Alpukat Hijau, Nangka Kuning, Kelapa Muda & Kaleng Susu (Sisi Kanan Counter) */}
        <group position={[0.38, 1.34, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[1.08, 0.48, 0.46]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.32} roughness={0.14} />
          </mesh>
          {/* Baskom Alpukat Hijau */}
          <mesh position={[-0.32, -0.14, 0]}>
            <sphereGeometry args={[0.13, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color="#65a30d" roughness={0.55} />
          </mesh>
          {/* Baskom Nangka Kuning Harum */}
          <mesh position={[-0.02, -0.14, 0]}>
            <sphereGeometry args={[0.13, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color="#facc15" roughness={0.52} />
          </mesh>
          {/* Baskom Daging Kelapa Muda Putih */}
          <mesh position={[0.28, -0.14, 0]}>
            <sphereGeometry args={[0.13, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.62} />
          </mesh>
        </group>

        {/* Payung Kanopi Hijau-Kuning Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#16a34a" roughness={0.65} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#facc15" roughness={0.65} />
        </mesh>

        {/* Bohlam Hangat Gerobak Es Teler */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.6 : 0.12}
          />
        </mesh>

        {/* Bang Daud Ramah di Belakang Gerobak (world [-17.6, 0, -14.42]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={BANG_DAUD_PROFILE}
            headRef={daudHeadRef}
            rightArmRef={daudRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [-17.6, 0, -11.55]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`etb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. KOTAK DONASI BUKU & MAINAN ANAK ([-79.6, 0, 25.8], hadap -Z)      */}
      {/* ==================================================================== */}
      <group position={[-79.6, 0, 25.8]} rotation={[0, Math.PI, 0]}>
        {/* 4 Kaki Kayu Penyangga Lemari Berbagi */}
        {[
          [-0.46, -0.22],
          [0.46, -0.22],
          [-0.46, 0.22],
          [0.46, 0.22],
        ].map(([lx, lz], li) => (
          <mesh key={`tbl-${li}`} position={[lx, 0.36, lz]} castShadow>
            <boxGeometry args={[0.09, 0.72, 0.09]} />
            <meshStandardMaterial color="#784c2a" roughness={0.82} />
          </mesh>
        ))}

        {/* Badan Rumah-Rumahan Lemari Berbagi Biru Langit Pastel & Kayu Madu */}
        <mesh position={[0, 1.12, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[1.14, 0.88, 0.56]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.62} />
        </mesh>
        {/* Ruang Dalam Lemari Terang Hangat */}
        <mesh position={[0, 1.12, 0.06]}>
          <boxGeometry args={[1.0, 0.76, 0.42]} />
          <meshStandardMaterial
            color="#fef9c3"
            emissive="#fde68a"
            emissiveIntensity={isEveningOrNight ? 0.75 : 0.08}
          />
        </mesh>
        {/* Rak Tengah */}
        <mesh position={[0, 1.1, 0.08]}>
          <boxGeometry args={[1.0, 0.04, 0.4]} />
          <meshStandardMaterial color="#b45309" roughness={0.74} />
        </mesh>

        {/* Isi Rak Atas: Deretan Buku Cerita Anak Warna-Warni */}
        {[-0.36, -0.24, -0.12, 0.0, 0.14].map((bx, bi) => (
          <mesh key={`kbk-${bi}`} position={[bx, 1.24, 0.08]} rotation={[0, 0, bi === 4 ? -0.18 : 0]}>
            <boxGeometry args={[0.075, 0.22, 0.2]} />
            <meshStandardMaterial
              color={['#f43f5e', '#facc15', '#4ade80', '#a855f7', '#fb923c'][bi]}
              roughness={0.65}
            />
          </mesh>
        ))}
        {/* Boneka Kelinci Pink Mini di Sudut Rak Atas */}
        <group position={[0.34, 1.2, 0.08]}>
          <mesh>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshStandardMaterial color="#f472b6" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.095, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#f472b6" roughness={0.82} />
          </mesh>
        </group>

        {/* Isi Rak Bawah: Truk Mainan Kuning & Balok Susun Kayu */}
        <group position={[-0.22, 0.84, 0.08]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.26, 0.1, 0.14]} />
            <meshStandardMaterial color="#facc15" roughness={0.5} />
          </mesh>
          <mesh position={[0.08, 0.12, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.13]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
          </mesh>
        </group>
        {[
          { x: 0.16, y: 0.82, col: '#ef4444' },
          { x: 0.28, y: 0.82, col: '#3b82f6' },
          { x: 0.22, y: 0.92, col: '#22c55e' },
        ].map((bl, bli) => (
          <mesh key={`tblk-${bli}`} position={[bl.x, bl.y, 0.08]}>
            <boxGeometry args={[0.095, 0.095, 0.095]} />
            <meshStandardMaterial color={bl.col} roughness={0.62} />
          </mesh>
        ))}

        {/* Pintu Akrilik Bening Berengsel (Terbuka Halus saat Interaksi [E]!) */}
        <group ref={toyDoorRef} position={[-0.51, 1.12, 0.28]}>
          <mesh position={[0.51, 0, 0]}>
            <boxGeometry args={[1.02, 0.78, 0.03]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.34} roughness={0.12} />
          </mesh>
          {/* Pegangan Pintu Bulat Kuning */}
          <mesh position={[0.94, 0, 0.035]}>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshStandardMaterial color="#facc15" roughness={0.38} />
          </mesh>
        </group>

        {/* Atap Pelana Terakota Pelindung Hujan + Papan Nama "KOTAK BERBAGI ANAK" */}
        <mesh position={[-0.35, 1.72, 0]} rotation={[0, 0, 0.42]} castShadow>
          <boxGeometry args={[0.82, 0.08, 0.82]} />
          <meshStandardMaterial color="#c2410c" roughness={0.72} />
        </mesh>
        <mesh position={[0.35, 1.72, 0]} rotation={[0, 0, -0.42]} castShadow>
          <boxGeometry args={[0.82, 0.08, 0.82]} />
          <meshStandardMaterial color="#c2410c" roughness={0.72} />
        </mesh>
        <mesh position={[0, 2.06, 0.02]} castShadow>
          <boxGeometry args={[1.08, 0.4, 0.06]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.65} />
        </mesh>
        <mesh position={[0, 2.06, 0.056]}>
          <planeGeometry args={[1.0, 0.34]} />
          <meshStandardMaterial
            map={toyBoxSignTex}
            emissiveMap={toyBoxSignTex}
            emissive="#fef08a"
            emissiveIntensity={isEveningOrNight ? 0.62 : 0.14}
          />
        </mesh>
      </group>
    </group>
  );
};

