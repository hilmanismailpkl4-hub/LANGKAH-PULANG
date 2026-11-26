import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface LakeBoatsBandrekAndParkLightsProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const ABAH_UDIN_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Abah Udin',
  role: 'Penjual Bandrek & Bajigur Hangat Jl. Cempaka',
  accentColor: '#d97706',
  voice: { pitch: 0.9, rate: 0.95, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.67,
    shirtColor: '#78350f',
    pantsColor: '#1f2937',
    skinColor: '#c6936c',
    hairColor: '#57534e',
    accentProp: 'vest',
  },
};

function createBoatDockSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 448;
  c.height = 200;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(0, 0, 448, 200);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 7;
  ctx.strokeRect(8, 8, 432, 184);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 31px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PERAHU BEBEK KAYUH', 224, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('DERMAGA SELATAN DANAU SENJA', 224, 96);

  ctx.fillStyle = '#7dd3fc';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Rp 15.000 / 20 MNT · TEKAN [E]', 224, 146);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createBandrekBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#451a03');
  grad.addColorStop(0.5, '#92400e');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde68a';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fefce8';
  ctx.fillRect(14, 120, 612, 42);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BANDREK & BAJIGUR', 320, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px sans-serif';
  ctx.fillText('ABAH UDIN · HANGAT ASLI JL. CEMPAKA', 320, 96);

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('JAHE MERAH SUSU · KOLANG-KALING · KACANG · PISANG & UBI REBUS', 320, 141);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createParkLightsSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#292524';
  ctx.fillRect(0, 0, 384, 160);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 6;
  ctx.strokeRect(7, 7, 370, 146);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ALUN-ALUN LAMPU SENJA', 192, 52);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('Tekan [E] · Kilau Lampu Gantung', 192, 108);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface BulbCoord {
  x: number;
  y: number;
  z: number;
  phase: number;
}

/**
 * Membangun 24 posisi bohlam gantung melengkung (catenary) antar 4 tiang alun-alun taman (5.6m x 4.4m).
 */
function buildHangingBulbCoords(): BulbCoord[] {
  const strands: [[number, number], [number, number], number][] = [
    [[-2.8, -2.2], [2.8, -2.2], 4],
    [[-2.8, 2.2], [2.8, 2.2], 4],
    [[-2.8, -2.2], [-2.8, 2.2], 3],
    [[2.8, -2.2], [2.8, 2.2], 3],
    [[-2.8, -2.2], [2.8, 2.2], 5],
    [[2.8, -2.2], [-2.8, 2.2], 5],
  ];
  const out: BulbCoord[] = [];
  let idx = 0;
  strands.forEach(([a, b, count]) => {
    for (let i = 1; i <= count; i++) {
      const u = i / (count + 1);
      const sag = Math.sin(u * Math.PI) * 0.42;
      out.push({
        x: a[0] + (b[0] - a[0]) * u,
        y: 3.45 - sag,
        z: a[1] + (b[1] - a[1]) * u,
        phase: idx * 0.48,
      });
      idx++;
    }
  });
  return out;
}

/**
 * Opsi 2 — Suasana Malam & Pesisir Danau:
 * 1. Dermaga Kecil + 2 Perahu Bebek Kayuh Tambat di Tepi Selatan Danau Senja ([-92.8, 0, -13.0])
 * 2. Gerobak Bandrek & Bajigur Hangat Abah Udin ([-11.2, 0, -35.2]) di Tepi Jl. Cempaka Utara
 * 3. Deretan Lampu Taman Gantung Hangat & Bangku Alun-Alun Taman Kota ([-85.4, 0, 11.8])
 */
export const LakeBoatsBandrekAndParkLights: React.FC<LakeBoatsBandrekAndParkLightsProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const boatSignTex = useMemo(() => createBoatDockSignTexture(), []);
  const bandrekBannerTex = useMemo(() => createBandrekBannerTexture(), []);
  const parkLightsSignTex = useMemo(() => createParkLightsSignTexture(), []);
  const hangingBulbs = useMemo(() => buildHangingBulbCoords(), []);

  useEffect(() => {
    return () => {
      boatSignTex.dispose();
      bandrekBannerTex.dispose();
      parkLightsSignTex.dispose();
    };
  }, [boatSignTex, bandrekBannerTex, parkLightsSignTex]);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night';
  const isRain = timeOfDay === 'rain_dusk';

  const boatARef = useRef<THREE.Group>(null);
  const boatBRef = useRef<THREE.Group>(null);
  const paddleARef = useRef<THREE.Group>(null);
  const paddleBRef = useRef<THREE.Group>(null);
  const boatRippleRefs = useRef<(THREE.Mesh | null)[]>([]);

  const udinHeadRef = useRef<THREE.Group>(null);
  const udinRightArmRef = useRef<THREE.Group>(null);
  const bandrekSteamRefs = useRef<(THREE.Mesh | null)[]>([]);

  const bulbMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const lightsCanopyRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. 2 Perahu Bebek Kayuh Tambat Bergoyang Pelan di Riak Danau Senja
    if (playerRuntime.pedalBoatWaveTimer > 0) {
      playerRuntime.pedalBoatWaveTimer = Math.max(0, playerRuntime.pedalBoatWaveTimer - dt);
    }
    if (!shouldSkipPerfFrame(-92.8, -14.5, 56)) {
      const activeSplash = playerRuntime.pedalBoatWaveTimer > 0;
      const waveAmp = activeSplash ? 0.055 : 0.022;
      const tiltAmp = activeSplash ? 0.068 : 0.028;

      if (boatARef.current) {
        boatARef.current.position.y = -0.11 + Math.sin(t * 1.65) * waveAmp;
        boatARef.current.rotation.z = Math.sin(t * 1.35 + 0.4) * tiltAmp;
        boatARef.current.rotation.x = Math.cos(t * 1.15) * (tiltAmp * 0.6);
      }
      if (boatBRef.current) {
        boatBRef.current.position.y = -0.11 + Math.sin(t * 1.5 + 1.8) * waveAmp;
        boatBRef.current.rotation.z = Math.cos(t * 1.25 + 1.1) * tiltAmp;
        boatBRef.current.rotation.x = Math.sin(t * 1.05 + 0.7) * (tiltAmp * 0.6);
      }

      const paddleSpeed = activeSplash ? 6.5 : 0.55;
      if (paddleARef.current) paddleARef.current.rotation.x -= dt * paddleSpeed;
      if (paddleBRef.current) paddleBRef.current.rotation.x -= dt * (paddleSpeed * 0.92);

      if (!playerRuntime.perf.isPotato) {
        for (let i = 0; i < 2; i++) {
          const rip = boatRippleRefs.current[i];
          if (!rip) continue;
          const rp = ((t * (activeSplash ? 0.95 : 0.36) + i * 0.5) % 1 + 1) % 1;
          const sc = 0.8 + rp * (activeSplash ? 1.8 : 1.15);
          rip.scale.set(sc, sc, 1);
          (rip.material as THREE.MeshBasicMaterial).opacity = (1 - rp) * (activeSplash ? 0.42 : 0.22);
        }
      }
    }

    // 2. Gerobak Bandrek & Bajigur Abah Udin (uap jahe merah naik hangat!)
    if (playerRuntime.bandrekSteamTimer > 0) {
      playerRuntime.bandrekSteamTimer = Math.max(0, playerRuntime.bandrekSteamTimer - dt);
    }
    if (!shouldSkipPerfFrame(-11.2, -35.2, 50)) {
      const distUdin = py > 4 ? 99 : Math.hypot(px - -11.2, pz - -35.2);
      const pouring = playerRuntime.bandrekSteamTimer > 0;
      if (udinHeadRef.current) {
        udinHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.22;
      }
      if (udinRightArmRef.current) {
        udinRightArmRef.current.rotation.x =
          distUdin < 5.5
            ? -1.55 + Math.sin(t * 4.8) * 0.22
            : -0.78 + Math.sin(t * 2.0) * 0.14;
      }
      if (!playerRuntime.perf.isPotato) {
        const riseRate = pouring ? 0.95 : 0.52;
        for (let i = 0; i < 4; i++) {
          const m = bandrekSteamRefs.current[i];
          if (!m) continue;
          const p = ((t * riseRate + i * 0.25) % 1 + 1) % 1;
          m.position.y = p * (pouring ? 0.84 : 0.56);
          m.position.x = Math.sin(t * 2.1 + i * 1.8) * 0.045 * p;
          const s = (pouring ? 0.62 : 0.45) + p * 1.15;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * (pouring ? 0.36 : 0.24);
        }
      }
    }

    // 3. Deretan Lampu Taman Gantung Hangat Alun-Alun Taman Kota (berayun halus & berkilau gelombang saat [E]!)
    if (playerRuntime.parkLightsPulseTimer > 0) {
      playerRuntime.parkLightsPulseTimer = Math.max(0, playerRuntime.parkLightsPulseTimer - dt);
    }
    if (!shouldSkipPerfFrame(-85.4, 11.8, 56)) {
      const pulsing = playerRuntime.parkLightsPulseTimer > 0;
      if (lightsCanopyRef.current) {
        const swayAmp = isRain ? 0.028 : 0.01;
        lightsCanopyRef.current.rotation.z = Math.sin(t * 1.45) * swayAmp;
      }
      const baseInt = isDarkNight ? 2.6 : isEveningOrNight ? 2.1 : pulsing ? 1.9 : 0.32;
      for (let i = 0; i < hangingBulbs.length; i++) {
        const mat = bulbMatRefs.current[i];
        if (!mat) continue;
        const wave = pulsing
          ? Math.sin(t * 6.5 - i * 0.45) * 1.25
          : Math.sin(t * 1.8 + hangingBulbs[i].phase) * 0.22;
        mat.emissiveIntensity = Math.max(0.18, baseInt + wave);
      }
    }
  });

  const renderPedalBoat = (
    refObj: React.RefObject<THREE.Group>,
    paddleRef: React.RefObject<THREE.Group>,
    pos: [number, number, number],
    rotY: number,
    hullColor: string,
    canopyColor: string,
    rippleIndex: number,
  ) => (
    <group position={[pos[0], 0, pos[2]]}>
      {/* Riak Air Melingkar di Sekeliling Perahu Bebek */}
      <mesh
        ref={(el) => {
          boatRippleRefs.current[rippleIndex] = el;
        }}
        position={[0, -0.125, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.92, 1.08, 22]} />
        <meshBasicMaterial color="#e0f2fe" transparent opacity={0.22} depthWrite={false} />
      </mesh>

      <group ref={refObj} position={[0, pos[1], 0]} rotation={[0, rotY, 0]}>
        {/* Lambung Perahu Fiberglass Oval */}
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.18, 0.32, 1.95]} />
          <meshStandardMaterial color={hullColor} roughness={0.34} metalness={0.1} />
        </mesh>
        {/* Haluan Depan & Dek Dalam */}
        <mesh position={[0, 0.18, -0.95]} castShadow>
          <cylinderGeometry args={[0.42, 0.54, 0.34, 12]} />
          <meshStandardMaterial color={hullColor} roughness={0.34} />
        </mesh>
        {/* Lis Pinggir Perahu */}
        <mesh position={[0, 0.31, 0]}>
          <boxGeometry args={[1.24, 0.06, 2.02]} />
          <meshStandardMaterial color={canopyColor} roughness={0.45} />
        </mesh>

        {/* Leher & Kepala Bebek / Angsa Ikonik di Depan */}
        <mesh position={[0, 0.62, -0.98]} rotation={[0.18, 0, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.2, 0.68, 12]} />
          <meshStandardMaterial color={hullColor} roughness={0.36} />
        </mesh>
        <mesh position={[0, 0.96, -1.04]} castShadow>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color={hullColor} roughness={0.36} />
        </mesh>
        {/* Paruh Oranye Cerah & 2 Mata Hitam */}
        <mesh position={[0, 0.93, -1.26]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.095, 0.22, 8]} />
          <meshStandardMaterial color="#f97316" roughness={0.42} />
        </mesh>
        {[-0.12, 0.12].map((ex, ei) => (
          <mesh key={`be-${ei}`} position={[ex, 1.0, -1.17]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} />
          </mesh>
        ))}

        {/* 2 Kursi Kayuh & Setir Kemudi Tengah */}
        <mesh position={[0, 0.42, 0.22]} castShadow>
          <boxGeometry args={[0.92, 0.18, 0.42]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.62, 0.4]} castShadow>
          <boxGeometry args={[0.92, 0.34, 0.08]} />
          <meshStandardMaterial color="#334155" roughness={0.75} />
        </mesh>

        {/* Kanopi Payung Mini Berwarna Cerah di Atas Perahu */}
        {[
          [-0.48, -0.42],
          [0.48, -0.42],
          [-0.48, 0.56],
          [0.48, 0.56],
        ].map(([px, pz], pi) => (
          <mesh key={`bcp-${pi}`} position={[px, 0.86, pz]}>
            <cylinderGeometry args={[0.018, 0.018, 1.12, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 1.44, 0.08]} castShadow>
          <boxGeometry args={[1.14, 0.07, 1.24]} />
          <meshStandardMaterial color={canopyColor} roughness={0.55} />
        </mesh>

        {/* Kincir Kayuh Belakang Berputar */}
        <group ref={paddleRef} position={[0, 0.16, 1.08]}>
          {[0, 1, 2, 3].map((bi) => (
            <mesh key={`pad-${bi}`} rotation={[(bi * Math.PI) / 2, 0, 0]}>
              <boxGeometry args={[0.56, 0.04, 0.34]} />
              <meshStandardMaterial color="#1e293b" roughness={0.65} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. DERMAGA KECIL + 2 PERAHU BEBEK KAYUH TAMBAT ([-92.8, 0, -13.0])   */}
      {/* ==================================================================== */}
      <group>
        {/* Dermaga Kayu Mini Menjorok ke Air Danau Senja */}
        <group position={[-92.8, 0, -13.5]}>
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.18, 0.14, 3.05]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.82} />
          </mesh>
          {/* 4 Tiang Pancang Dermaga & Tali Tambat */}
          {[
            [-0.95, -1.35],
            [0.95, -1.35],
            [-0.95, 1.25],
            [0.95, 1.25],
          ].map(([tx, tz], ti) => (
            <mesh key={`dp-${ti}`} position={[tx, 0.36, tz]} castShadow>
              <cylinderGeometry args={[0.09, 0.11, 0.96, 8]} />
              <meshStandardMaterial color="#5c3d28" roughness={0.9} />
            </mesh>
          ))}
          {/* 2 Tali Tambat dari Tiang Dermaga ke Perahu Bebek */}
          <mesh position={[-1.4, 0.24, -1.55]} rotation={[0.12, 0.25, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 1.35, 6]} />
            <meshStandardMaterial color="#d6b27d" roughness={0.9} />
          </mesh>
          <mesh position={[1.4, 0.24, -1.55]} rotation={[0.12, -0.25, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 1.35, 6]} />
            <meshStandardMaterial color="#d6b27d" roughness={0.9} />
          </mesh>
          {/* Pelampung Keselamatan Oranye-Putih di Tiang Dermaga */}
          <mesh position={[0.98, 0.56, 1.32]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.24, 0.065, 8, 16]} />
            <meshStandardMaterial color="#f97316" roughness={0.55} />
          </mesh>
        </group>

        {/* Tiang Lentera Dermaga Selatan (world [-91.6, 0, -12.2]) */}
        <group position={[-91.6, 0, -12.2]}>
          <mesh position={[0, 1.18, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.07, 2.36, 8]} />
            <meshStandardMaterial color="#3b2618" roughness={0.85} />
          </mesh>
          <mesh position={[0, 2.42, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshStandardMaterial
              color="#fff7d6"
              emissive="#ffba52"
              emissiveIntensity={isEveningOrNight ? 2.6 : 0.15}
            />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && (
            <sprite position={[0, 2.42, 0]} scale={[2.2, 2.2, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffc973"
                transparent
                opacity={isDarkNight ? 0.65 : 0.45}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>

        {/* Papan Tarif Kayu "PERAHU BEBEK KAYUH · DANAU SENJA" (world [-94.1, 0, -12.15]) */}
        <group position={[-94.1, 0, -12.15]} rotation={[0, 0.22, 0]}>
          <mesh position={[0, 0.78, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.065, 1.56, 8]} />
            <meshStandardMaterial color="#4a3121" roughness={0.88} />
          </mesh>
          <mesh position={[0, 1.48, 0]} castShadow>
            <boxGeometry args={[1.18, 0.56, 0.07]} />
            <meshStandardMaterial color="#3b2618" roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.48, 0.042]}>
            <planeGeometry args={[1.1, 0.48]} />
            <meshStandardMaterial
              map={boatSignTex}
              emissiveMap={boatSignTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 0.58 : 0.12}
            />
          </mesh>
        </group>

        {/* 2 Perahu Bebek Kayuh Tambat di Kiri & Kanan Dermaga */}
        {renderPedalBoat(boatARef, paddleARef, [-94.8, -0.11, -15.3], 0.34, '#f8fafc', '#0284c7', 0)}
        {renderPedalBoat(boatBRef, paddleBRef, [-90.8, -0.11, -15.4], -0.28, '#fde047', '#0d9488', 1)}
      </group>

      {/* ==================================================================== */}
      {/* 2. GEROBAK BANDREK & BAJIGUR HANGAT ABAH UDIN ([-11.2, 0, -35.2], +X) */}
      {/* ==================================================================== */}
      <group position={[-11.2, 0, -35.2]} rotation={[0, Math.PI / 2, 0]}>
        {/* Badan Gerobak Kayu Cokelat Hangat Klasik */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.88, 0.96]} />
          <meshStandardMaterial color="#78350f" roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[2.16, 0.07, 1.04]} />
          <meshStandardMaterial color="#b45309" roughness={0.68} />
        </mesh>

        {/* 2 Roda Gerobak */}
        {[-1.08, 1.08].map((wx, wi) => (
          <group key={`bw-${wi}`} position={[wx, 0.34, 0]}>
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

        {/* Spanduk Depan HD "BANDREK & BAJIGUR · ABAH UDIN" */}
        <mesh position={[0, 0.62, 0.495]}>
          <planeGeometry args={[1.96, 0.56]} />
          <meshStandardMaterial
            map={bandrekBannerTex}
            emissiveMap={bandrekBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.64 : 0.14}
          />
        </mesh>

        {/* 2 Dandang Kuningan/Stainless Bandrek & Bajigur Mengepul (Sisi Kiri Counter) */}
        <group position={[-0.56, 1.08, 0.02]}>
          <mesh position={[-0.18, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.17, 0.44, 14]} />
            <meshStandardMaterial color="#d97706" metalness={0.72} roughness={0.28} />
          </mesh>
          <mesh position={[0.2, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.17, 0.16, 0.4, 14]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.78} roughness={0.24} />
          </mesh>
          {/* Kepulan Uap Jahe & Santan Hangat */}
          <group position={[-0.18, 0.48, 0]}>
            {[0, 1, 2, 3].map((si) => (
              <mesh
                key={`bst-${si}`}
                ref={(el) => {
                  bandrekSteamRefs.current[si] = el;
                }}
              >
                <sphereGeometry args={[0.052, 8, 8]} />
                <meshBasicMaterial color="#fffbeb" transparent opacity={0.24} depthWrite={false} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Etalase Kaca Rebusan (Kacang, Pisang Kepok, Ubi) & Tumpukan Cangkir Enamel (Kanan Counter) */}
        <group position={[0.45, 1.32, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.92, 0.44, 0.46]} />
            <meshStandardMaterial color="#fef3c7" transparent opacity={0.32} roughness={0.14} />
          </mesh>
          {/* Kacang Rebus, Pisang Kepok Kuning & Ubi Rebus */}
          <mesh position={[-0.24, -0.14, 0]}>
            <sphereGeometry args={[0.12, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color="#a16207" roughness={0.85} />
          </mesh>
          <mesh position={[0.04, -0.14, 0]} rotation={[0, 0.2, Math.PI / 2]}>
            <capsuleGeometry args={[0.045, 0.14, 5, 8]} />
            <meshStandardMaterial color="#eab308" roughness={0.7} />
          </mesh>
          {/* Tumpukan 3 Cangkir Enamel Hijau Klasik */}
          {[0, 1, 2].map((mi) => (
            <mesh key={`emg-${mi}`} position={[0.3, -0.14 + mi * 0.085, 0.02]}>
              <cylinderGeometry args={[0.042, 0.038, 0.08, 10]} />
              <meshStandardMaterial color="#15803d" roughness={0.38} />
            </mesh>
          ))}
        </group>

        {/* Payung Kanopi Cokelat-Kuning Teduh (Melindungi dari Hujan) */}
        <mesh position={[0.04, 1.82, -0.1]} castShadow>
          <cylinderGeometry args={[0.042, 0.046, 2.25, 10]} />
          <meshStandardMaterial color="#64748b" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.04, 2.94, -0.1]} castShadow>
          <coneGeometry args={[1.66, 0.44, 10]} />
          <meshStandardMaterial color="#92400e" roughness={0.68} />
        </mesh>
        <mesh position={[0.04, 2.95, -0.1]} rotation={[0, Math.PI / 10, 0]}>
          <coneGeometry args={[1.67, 0.44, 5]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.68} />
        </mesh>

        {/* Bohlam Hangat Gerobak Bandrek Malam */}
        <mesh position={[0, 2.38, 0.22]}>
          <sphereGeometry args={[0.072, 10, 10]} />
          <meshStandardMaterial
            color="#fff7d6"
            emissive="#ffca6b"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.14}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.38, 0.22]} scale={[1.75, 1.75, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffd280"
              transparent
              opacity={isDarkNight ? 0.65 : 0.46}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Abah Udin Ramah di Belakang Gerobak (world [-12.22, 0, -35.2]) */}
        <group position={[0, 0, -1.02]}>
          <HumanModel
            profile={ABAH_UDIN_PROFILE}
            headRef={udinHeadRef}
            rightArmRef={udinRightArmRef}
          />
        </group>

        {/* Bangku Kayu Pelanggan Depan Gerobak (world [-9.35, 0, -35.2]) */}
        <group position={[0, 0, 1.85]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.52, 0.08, 0.44]} />
            <meshStandardMaterial color="#8c5a34" roughness={0.82} />
          </mesh>
          {[-0.58, 0.58].map((lx, li) => (
            <mesh key={`bdb-${li}`} position={[lx, 0.21, 0]} castShadow>
              <boxGeometry args={[0.08, 0.42, 0.36]} />
              <meshStandardMaterial color="#3b2618" roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. DERETAN LAMPU TAMAN GANTUNG HANGAT ALUN-ALUN ([-85.4, 0, 11.8])   */}
      {/* ==================================================================== */}
      <group position={[-85.4, 0, 11.8]}>
        {/* Lantai Paving Alun-Alun Taman (flush + polygonOffset agar nol Z-fighting!) */}
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[6.4, 5.2]} />
          <meshStandardMaterial
            map={textures.paving}
            color="#d6cfc2"
            roughness={0.88}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>

        {/* 4 Tiang Besi Tempa Sudut Penyangga Untaian Lampu Gantung */}
        {[
          [-2.8, -2.2],
          [2.8, -2.2],
          [-2.8, 2.2],
          [2.8, 2.2],
        ].map(([px, pz], pi) => (
          <group key={`plp-${pi}`} position={[px, 0, pz]}>
            <mesh position={[0, 1.82, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.08, 3.64, 10]} />
              <meshStandardMaterial color="#27272a" metalness={0.62} roughness={0.4} />
            </mesh>
            {/* Ring Aksen Kuningan di Puncak Tiang */}
            <mesh position={[0, 3.64, 0]}>
              <sphereGeometry args={[0.09, 10, 10]} />
              <meshStandardMaterial color="#d97706" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Untaian Kabel & 24 Bohlam Taman Gantung Hangat (Syahdu di Senja & Malam!) */}
        <group ref={lightsCanopyRef}>
          {/* 4 Kabel Tepi + 2 Kabel Diagonal Silang */}
          <mesh position={[0, 3.45, -2.2]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 5.6, 6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0, 3.45, 2.2]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 5.6, 6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[-2.8, 3.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 4.4, 6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[2.8, 3.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 4.4, 6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0, 3.42, 0]} rotation={[0, Math.atan2(5.6, 4.4), Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 7.12, 6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0, 3.42, 0]} rotation={[0, -Math.atan2(5.6, 4.4), Math.PI / 2]}>
            <cylinderGeometry args={[0.009, 0.009, 7.12, 6]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>

          {/* 24 Bohlam Kaca Edison Gantung Berkilau Hangat */}
          {hangingBulbs.map((b, bi) => (
            <group key={`hb-${bi}`} position={[b.x, b.y, b.z]}>
              <mesh position={[0, 0.075, 0]}>
                <cylinderGeometry args={[0.012, 0.014, 0.08, 6]} />
                <meshStandardMaterial color="#27272a" />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.056, 8, 8]} />
                <meshStandardMaterial
                  ref={(el) => {
                    bulbMatRefs.current[bi] = el;
                  }}
                  color="#fff8dc"
                  emissive="#ffb84d"
                  emissiveIntensity={isEveningOrNight ? 2.2 : 0.3}
                />
              </mesh>
              {isEveningOrNight && settings.cinematicGlow && bi % 2 === 0 && !playerRuntime.perf.isPotato && (
                <sprite scale={[1.15, 1.15, 1]}>
                  <spriteMaterial
                    map={textures.glowSprite}
                    color="#ffc86b"
                    transparent
                    opacity={isDarkNight ? 0.56 : 0.38}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </sprite>
              )}
            </group>
          ))}
        </group>

        {/* Bangku Jati Santai di Tengah Alun-Alun Lampu Gantung (world [-85.4, 0, 12.0]) */}
        <group position={[0, 0, 0.2]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 0.1, 0.62]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.78, 0.25]} rotation={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[2.1, 0.4, 0.07]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
          </mesh>
          {[-0.86, 0.86].map((lx, li) => (
            <mesh key={`plb-${li}`} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.56]} />
              <meshStandardMaterial color="#27272a" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
        </group>

        {/* Tiang Sakelar & Papan Kecil "ALUN-ALUN LAMPU SENJA" (world [-85.4, 0, 9.6]) */}
        <group position={[0, 0, -2.2]}>
          <mesh position={[0, 0.68, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.068, 1.36, 8]} />
            <meshStandardMaterial color="#27272a" metalness={0.6} roughness={0.42} />
          </mesh>
          <mesh position={[0, 1.32, 0]} castShadow>
            <boxGeometry args={[0.96, 0.42, 0.07]} />
            <meshStandardMaterial color="#3b2618" roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.32, 0.042]}>
            <planeGeometry args={[0.88, 0.34]} />
            <meshStandardMaterial
              map={parkLightsSignTex}
              emissiveMap={parkLightsSignTex}
              emissive="#fef08a"
              emissiveIntensity={isEveningOrNight ? 0.6 : 0.12}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
