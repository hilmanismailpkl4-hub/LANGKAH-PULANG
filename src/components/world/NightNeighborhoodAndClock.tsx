import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface NightNeighborhoodAndClockProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const STATION_CLOCK_HOURS: Record<TimeOfDay, [number, number]> = {
  morning: [8, 24],
  sunset: [17, 18],
  rain_dusk: [17, 54],
  night: [20, 42],
};

function createPosKamlingSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 512, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 16, 512, 14);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 502, 118);

  ctx.fillStyle = '#fefce8';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POS KAMLING RT 04', 256, 66);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('PERUMAHAN MELATI · AMAN & GUYUB', 256, 102);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createChessboardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#5c3d28';
  ctx.fillRect(0, 0, 256, 256);

  const sq = 28;
  const pad = 16;
  for (let r = 0; r < 8; r++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (r + col) % 2 === 0 ? '#f5ebd6' : '#3b281c';
      ctx.fillRect(pad + col * sq, pad + r * sq, sq, sq);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createStationClockDialTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 512);
  ctx.fillStyle = '#faf3e0';
  ctx.beginPath();
  ctx.arc(256, 256, 244, 0, Math.PI * 2);
  ctx.fill();

  // Lingkaran bingkai klasik stasiun heritage Indonesia
  ctx.strokeStyle = '#2b241c';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(256, 256, 236, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#8c6d46';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 212, 0, Math.PI * 2);
  ctx.stroke();

  // 60 garis menit & 12 angka Romawi tegas
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const r0 = isHour ? 188 : 200;
    const r1 = 210;
    ctx.strokeStyle = '#2b241c';
    ctx.lineWidth = isHour ? 6 : 2;
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(a) * r0, 256 + Math.sin(a) * r0);
    ctx.lineTo(256 + Math.cos(a) * r1, 256 + Math.sin(a) * r1);
    ctx.stroke();
  }

  const romans = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.fillStyle = '#1f1a14';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  romans.forEach((lbl, idx) => {
    const a = (idx / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.fillText(lbl, 256 + Math.cos(a) * 158, 256 + Math.sin(a) * 158);
  });

  ctx.fillStyle = '#735b3c';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.fillText('STASIUN SENJA', 256, 336);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * 1. Pos Kamling / Pos Ronda Kayu RT 04 Perumahan Melati ([27.2, 0, 56.8]):
 *    Bale-bale kayu, papan catur & bidak, termos kopi, lampu malam & kentongan bambu interaktif [E].
 * 2. Jam Bundar Besar Bercahaya di Menara Fasad Stasiun Kereta Tua Senja ([76.0, 5.55, -12.08])
 *    + Jam Gantung Peron Real-Time sinkron dengan waktu kota!
 */
export const NightNeighborhoodAndClock: React.FC<NightNeighborhoodAndClockProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const posSignTex = useMemo(() => createPosKamlingSignTexture(), []);
  const chessTex = useMemo(() => createChessboardTexture(), []);
  const clockDialTex = useMemo(() => createStationClockDialTexture(), []);

  const kentonganRef = useRef<THREE.Group>(null);
  const bigSecHandRef = useRef<THREE.Group>(null);
  const hangSecHandRef = useRef<THREE.Group>(null);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';

  const [hr, min] = STATION_CLOCK_HOURS[timeOfDay];
  const hourAngle = -(((hr % 12) + min / 60) / 12) * Math.PI * 2;
  const minAngle = -(min / 60) * Math.PI * 2;

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // 1. Animasi ayunan & getaran kentongan bambu saat dipukul [E]
    if (playerRuntime.kentonganSwingTimer > 0) {
      playerRuntime.kentonganSwingTimer = Math.max(0, playerRuntime.kentonganSwingTimer - dt);
    }
    if (kentonganRef.current) {
      const swingPow = playerRuntime.kentonganSwingTimer / 2.4;
      const idleSway = Math.sin(t * 1.4) * 0.025;
      kentonganRef.current.rotation.z = idleSway + Math.sin(t * 17) * 0.24 * swingPow;
      kentonganRef.current.rotation.x = Math.cos(t * 14) * 0.14 * swingPow;
    }

    // 2. Jarum detik jam Stasiun Senja berputar real-time
    const secAngle = -((t % 60) / 60) * Math.PI * 2;
    if (bigSecHandRef.current) bigSecHandRef.current.rotation.z = secAngle;
    if (hangSecHandRef.current) hangSecHandRef.current.rotation.z = secAngle;
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. POS KAMLING / POS RONDA RT 04 JL. MELATI ([27.2, 0, 56.8])        */}
      {/* ==================================================================== */}
      <group position={[27.2, 0, 56.8]}>
        {/* Pondasi Bata & Panggung Bale-Bale Kayu Jati Terangkat */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.1, 0.36, 2.4]} />
          <meshStandardMaterial color="#6e4a2e" roughness={0.84} />
        </mesh>
        <mesh position={[0, 0.39, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.22, 0.08, 2.52]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.72} />
        </mesh>

        {/* Pagar Sandaran Kayu Sisi Belakang (+Z), Kiri (-X) & Kanan (+X) */}
        <mesh position={[0, 0.78, 1.18]} castShadow>
          <boxGeometry args={[3.05, 0.72, 0.1]} />
          <meshStandardMaterial color="#593a22" roughness={0.82} />
        </mesh>
        <mesh position={[-1.52, 0.78, 0]} castShadow>
          <boxGeometry args={[0.1, 0.72, 2.42]} />
          <meshStandardMaterial color="#593a22" roughness={0.82} />
        </mesh>
        <mesh position={[1.52, 0.78, 0]} castShadow>
          <boxGeometry args={[0.1, 0.72, 2.42]} />
          <meshStandardMaterial color="#593a22" roughness={0.82} />
        </mesh>

        {/* 4 Tiang Kayu Penopang + Atap Limas Genteng Terakota */}
        {[
          [-1.46, 1.45, -1.12],
          [1.46, 1.45, -1.12],
          [-1.46, 1.45, 1.12],
          [1.46, 1.45, 1.12],
        ].map(([tx, ty, tz], ti) => (
          <mesh key={`pkt-${ti}`} position={[tx, ty, tz]} castShadow>
            <boxGeometry args={[0.14, 2.25, 0.14]} />
            <meshStandardMaterial color="#4a311e" roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 2.64, 0]} castShadow>
          <boxGeometry args={[3.72, 0.14, 3.02]} />
          <meshStandardMaterial color="#523622" roughness={0.82} />
        </mesh>
        <mesh position={[0, 3.18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.55, 0.96, 4]} />
          <meshStandardMaterial map={textures.roofTile} color="#8c4734" roughness={0.82} />
        </mesh>

        {/* Papan Nama Depan "POS KAMLING RT 04" Menghadap Utara (-Z) */}
        <mesh position={[0, 2.38, -1.24]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.4, 0.56]} />
          <meshStandardMaterial
            map={posSignTex}
            emissiveMap={posSignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
          />
        </mesh>

        {/* Kentongan Bambu Gantung di Tiang Kiri Depan + Pemukul Kayu */}
        <group ref={kentonganRef} position={[-1.42, 1.88, -1.18]}>
          {/* Tali Gantungan */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.34, 6]} />
            <meshStandardMaterial color="#3b2f26" roughness={0.9} />
          </mesh>
          {/* Tabung Bambu Kuning-Cokelat Tua Berongga */}
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.095, 0.68, 12]} />
            <meshStandardMaterial color="#b08246" roughness={0.72} />
          </mesh>
          {/* Celah Rongga Kentongan di Sisi Depan */}
          <mesh position={[0, -0.22, -0.088]}>
            <boxGeometry args={[0.042, 0.38, 0.025]} />
            <meshStandardMaterial color="#21160d" roughness={0.95} />
          </mesh>
          {/* Pemukul Kayu Bergantung di Samping */}
          <mesh position={[0.14, -0.26, -0.02]} rotation={[0, 0, -0.18]} castShadow>
            <cylinderGeometry args={[0.022, 0.026, 0.34, 8]} />
            <meshStandardMaterial color="#6e472b" roughness={0.8} />
          </mesh>
        </group>

        {/* Meja Rendah Papan Catur + Bidak Catur + Termos Kopi & 2 Gelas di Tengah Bale-Bale */}
        <group position={[0.15, 0.43, 0.12]}>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.08, 0.06, 0.72]} />
            <meshStandardMaterial color="#7d5333" roughness={0.76} />
          </mesh>
          {[
            [-0.45, 0.14, -0.28],
            [0.45, 0.14, -0.28],
            [-0.45, 0.14, 0.28],
            [0.45, 0.14, 0.28],
          ].map(([lx, ly, lz], li) => (
            <mesh key={`tml-${li}`} position={[lx, ly, lz]}>
              <boxGeometry args={[0.06, 0.28, 0.06]} />
              <meshStandardMaterial color="#4f331e" roughness={0.85} />
            </mesh>
          ))}
          {/* Papan Catur 8x8 */}
          <mesh position={[-0.14, 0.316, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.52, 0.52]} />
            <meshStandardMaterial map={chessTex} roughness={0.6} />
          </mesh>
          {/* 6 Bidak Catur Mungil Hitam & Putih */}
          {[
            [-0.28, -0.14, '#f8fafc'],
            [-0.12, -0.06, '#f8fafc'],
            [-0.02, -0.16, '#f8fafc'],
            [-0.24, 0.14, '#1e293b'],
            [-0.1, 0.08, '#1e293b'],
            [0.02, 0.15, '#1e293b'],
          ].map(([cx, cz, col], ci) => (
            <mesh key={`chp-${ci}`} position={[cx as number, 0.355, cz as number]}>
              <cylinderGeometry args={[0.018, 0.024, 0.075, 8]} />
              <meshStandardMaterial color={col as string} roughness={0.5} />
            </mesh>
          ))}
          {/* Termos Kopi Stainless & 2 Gelas Kopi Hitam Ronda */}
          <mesh position={[0.34, 0.44, -0.12]} castShadow>
            <cylinderGeometry args={[0.055, 0.06, 0.28, 10]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.72} roughness={0.28} />
          </mesh>
          <mesh position={[0.32, 0.36, 0.14]}>
            <cylinderGeometry args={[0.036, 0.03, 0.095, 10]} />
            <meshStandardMaterial color="#f5efe6" roughness={0.35} />
          </mesh>
          <mesh position={[0.42, 0.36, 0.08]}>
            <cylinderGeometry args={[0.036, 0.03, 0.095, 10]} />
            <meshStandardMaterial color="#f5efe6" roughness={0.35} />
          </mesh>
        </group>

        {/* Bohlam Kuning Hangat Pos Ronda Menyala Otomatis Saat Senja–Malam */}
        <mesh position={[0, 2.42, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff2c2' : '#cfd6de'}
            emissive={isEveningOrNight ? '#ffba52' : '#000000'}
            emissiveIntensity={isDarkNight ? 3.2 : isEveningOrNight ? 2.1 : 0}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.4, 0]} scale={[2.6, 2.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc76b"
              transparent
              opacity={isDarkNight ? 0.72 : 0.48}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight
            position={[0, 2.25, -0.2]}
            color="#ffc870"
            intensity={isDarkNight ? 12.5 : 8}
            distance={15}
            decay={1.8}
          />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 2. MENARA JAM BUNDAR BESAR BERCAHAYA DI FASAD STASIUN SENJA          */}
      {/* ==================================================================== */}
      <group position={[76.0, 4.5, -12.35]}>
        {/* Pedimen / Menara Jam Klasik di Atas Kantor Stasiun */}
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.45, 2.1, 0.85]} />
          <meshStandardMaterial map={textures.stucco} color="#e5dac6" roughness={0.85} />
        </mesh>
        <mesh position={[0, 2.38, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.95, 0.82, 4]} />
          <meshStandardMaterial map={textures.roofTile} color="#7d4030" roughness={0.82} />
        </mesh>
        {/* Puncak Finial Besi Klasik */}
        <mesh position={[0, 2.95, 0]}>
          <cylinderGeometry args={[0.025, 0.04, 0.45, 8]} />
          <meshStandardMaterial color="#3b332b" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Bingkai Kuningan & Piringan Jam Besar Bercahaya Menghadap Peron (+Z) */}
        <group position={[0, 1.05, 0.44]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.78, 0.8, 0.1, 24]} />
            <meshStandardMaterial color="#59422a" metalness={0.55} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.056]}>
            <circleGeometry args={[0.72, 28]} />
            <meshStandardMaterial
              map={clockDialTex}
              emissiveMap={clockDialTex}
              emissive="#ffe2a3"
              emissiveIntensity={isDarkNight ? 1.35 : isEveningOrNight ? 0.85 : 0.12}
              roughness={0.35}
            />
          </mesh>
          {/* Jarum Jam */}
          <group position={[0, 0, 0.07]} rotation={[0, 0, hourAngle]}>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.052, 0.38, 0.015]} />
              <meshStandardMaterial color="#1f1a14" />
            </mesh>
          </group>
          {/* Jarum Menit */}
          <group position={[0, 0, 0.078]} rotation={[0, 0, minAngle]}>
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[0.036, 0.54, 0.014]} />
              <meshStandardMaterial color="#1f1a14" />
            </mesh>
          </group>
          {/* Jarum Detik Merah Real-Time */}
          <group ref={bigSecHandRef} position={[0, 0, 0.086]}>
            <mesh position={[0, 0.24, 0]}>
              <boxGeometry args={[0.016, 0.56, 0.01]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
          <mesh position={[0, 0, 0.094]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#b4834b" metalness={0.75} roughness={0.25} />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && (
            <sprite position={[0, 0, 0.14]} scale={[2.8, 2.8, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffe09e"
                transparent
                opacity={isDarkNight ? 0.52 : 0.34}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      </group>

      {/* Jam Gantung Klasik Dua Sisi di Bawah Kanopi Peron Stasiun ([79.2, 3.6, -9.5]) */}
      <group position={[79.2, 3.65, -9.5]}>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.85, 8]} />
          <meshStandardMaterial color="#2b2f38" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.12, 20]} />
          <meshStandardMaterial color="#2d2620" metalness={0.5} roughness={0.45} />
        </mesh>
        {[0.066, -0.066].map((oz, oi) => (
          <group key={`hcd-${oi}`} position={[0, 0, oz]} rotation={[0, oi === 0 ? 0 : Math.PI, 0]}>
            <mesh>
              <circleGeometry args={[0.34, 20]} />
              <meshStandardMaterial
                map={clockDialTex}
                emissiveMap={clockDialTex}
                emissive="#ffe2a3"
                emissiveIntensity={isDarkNight ? 1.25 : isEveningOrNight ? 0.8 : 0.12}
              />
            </mesh>
            <group position={[0, 0, 0.01]} rotation={[0, 0, hourAngle]}>
              <mesh position={[0, 0.09, 0]}>
                <boxGeometry args={[0.026, 0.18, 0.008]} />
                <meshStandardMaterial color="#1f1a14" />
              </mesh>
            </group>
            <group position={[0, 0, 0.015]} rotation={[0, 0, minAngle]}>
              <mesh position={[0, 0.12, 0]}>
                <boxGeometry args={[0.018, 0.25, 0.008]} />
                <meshStandardMaterial color="#1f1a14" />
              </mesh>
            </group>
            {oi === 0 && (
              <group ref={hangSecHandRef} position={[0, 0, 0.02]}>
                <mesh position={[0, 0.11, 0]}>
                  <boxGeometry args={[0.01, 0.25, 0.006]} />
                  <meshStandardMaterial color="#dc2626" />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  );
};
