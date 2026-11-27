import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface ArchitecturalAndRooftopUpgradeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const CLOCK_HOURS: Record<TimeOfDay, [number, number]> = {
  morning: [8, 24],
  sunset: [17, 18],
  rain_dusk: [17, 54],
  night: [20, 42],
};

function createHouseNumberTexture(numText: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 192;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#292524';
  ctx.fillRect(0, 0, 192, 96);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 182, 86);
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numText, 96, 42);
  ctx.fillStyle = '#d6d3d1';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('JL. MELATI RT 04', 96, 74);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWelcomeMatTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#855836';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#4a2f1b';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 244, 116);
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SELAMAT DATANG', 128, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTicketWindowSignTexture(label: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 56);
  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 128, 33);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSkyVendingTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 384;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 256, 384);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(14, 16, 228, 58);
  ctx.fillStyle = '#fffbeb';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SKY DECK CAFE', 128, 42);
  ctx.font = 'bold 13px monospace';
  ctx.fillText('HOT COFFEE & COCOA', 128, 62);

  // Display cangkir hangat bercahaya
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(20, 88, 216, 178);
  ['#f59e0b', '#a16207', '#ef4444', '#10b981'].forEach((col, i) => {
    const x = 36 + (i % 2) * 98;
    const y = 104 + Math.floor(i / 2) * 78;
    ctx.fillStyle = col;
    ctx.fillRect(x, y, 76, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(['ARABICA', 'COKELAT', 'TEH REMPAH', 'MATCHA'][i], x + 38, y + 36);
  });

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(36, 286, 184, 72);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 286, 184, 72);
  ctx.fillStyle = '#7dd3fc';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('AMBIL GELAS HANGAT', 128, 326);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Upgrade Arsitektur Bangunan, Fasad, Stasiun Kolonial & Rooftop Sky Garden:
 * 1. Rooftop Sky Garden Pergola, Sofa Lounge, Meja Api Bio-Ethanol, Mesin Kopi Koin & HVAC Berputar (Y = 22.02)
 * 2. Fasad Rumah Tetangga Jl. Melati (Pintu Jati, Kanopi Teras, Nomor Rumah, Lampu Dinding & AC Outdoor) + Teras Rumah Damar
 * 3. Kanopi Awning Bergaris & Cerobong Sangrai Kopi di Kedai Kopi Sudut Bima
 * 4. Fasad Kolonial Stasiun Kereta Tua Senja (Jam Bundar Real-Time, Jendela Loket Lengkung & Bangku Tunggu Peron)
 * 5. Mahkota LED Arsitektur & Helipad Puncak Gedung Pencakar Langit Kota Senja
 */
export const ArchitecturalAndRooftopUpgrade: React.FC<ArchitecturalAndRooftopUpgradeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const houseSign16 = useMemo(() => createHouseNumberTexture('NO. 16'), []);
  const houseSign18 = useMemo(() => createHouseNumberTexture('NO. 18'), []);
  const houseSign20 = useMemo(() => createHouseNumberTexture('NO. 20'), []);
  const welcomeMatTex = useMemo(() => createWelcomeMatTexture(), []);
  const loketTex = useMemo(() => createTicketWindowSignTexture('LOKET KARCIS'), []);
  const kepalaStTex = useMemo(() => createTicketWindowSignTexture('KEPALA STASIUN'), []);
  const skyVendingTex = useMemo(() => createSkyVendingTexture(), []);

  const hvacFan1Ref = useRef<THREE.Group>(null);
  const hvacFan2Ref = useRef<THREE.Group>(null);
  const fireFlameRef = useRef<THREE.Group>(null);
  const antennaBeaconMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const stationSecRef = useRef<THREE.Group>(null);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isNight = timeOfDay === 'night';
  const [hr, min] = CLOCK_HOURS[timeOfDay];
  const hourAngle = -(((hr % 12) + min / 60) / 12) * Math.PI * 2;
  const minAngle = -(min / 60) * Math.PI * 2;

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // Jarum detik jam Stasiun Senja
    if (stationSecRef.current && !shouldSkipPerfFrame(78.9, -16.5, 58)) {
      stationSecRef.current.rotation.z = -((t % 60) / 60) * Math.PI * 2;
    }

    // Animasi kipas HVAC, api hias & suar antena Rooftop
    if (hvacFan1Ref.current) hvacFan1Ref.current.rotation.y += dt * 6.5;
    if (hvacFan2Ref.current) hvacFan2Ref.current.rotation.y -= dt * 5.8;
    if (fireFlameRef.current) {
      const f = 0.92 + Math.sin(t * 9.5) * 0.14;
      fireFlameRef.current.scale.set(1, f, 1);
    }
    if (antennaBeaconMatRef.current && isEveningOrNight) {
      const blink = Math.sin(t * 4.2) > 0.15;
      antennaBeaconMatRef.current.emissiveIntensity = blink ? 4.2 : 0.4;
    }
  });

  const neighborFacades = [
    { x: -0.5, frontZ: 66.18, roofCol: '#874836', sign: houseSign16 },
    { x: 15.5, frontZ: 65.48, roofCol: '#445261', sign: houseSign18 },
    { x: 31.0, frontZ: 65.48, roofCol: '#8a4c39', sign: houseSign20 },
  ];

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. ROOFTOP SKY GARDEN, FIRE-PIT LOUNGE, VENDING & HVAC (Y = 22.02)   */}
      {/* ==================================================================== */}
      <group position={[0, 22.02, 0]} userData={{ noCull: true }}>
        {/* --- 1A. SKY GARDEN PERGOLA & BIO-ETHANOL FIRE LOUNGE ([34.5, 0, -35.8]) --- */}
        <group position={[34.5, 0, -35.8]}>
          {/* Karpet Dek Luar Ruangan Tenun Hangat */}
          <mesh position={[0, 0.015, 0.3]} receiveShadow>
            <boxGeometry args={[5.4, 0.03, 5.2]} />
            <meshStandardMaterial color="#334155" roughness={0.88} />
          </mesh>
          {/* 4 Tiang Baja-Kayu Pergola Sky Garden */}
          {[
            [-2.6, -2.4],
            [2.6, -2.4],
            [-2.6, 2.6],
            [2.6, 2.6],
          ].map(([px, pz], pi) => (
            <mesh key={`rperg-${pi}`} position={[px, 1.48, pz]} castShadow>
              <boxGeometry args={[0.16, 2.96, 0.16]} />
              <meshStandardMaterial color="#3e2c20" roughness={0.7} />
            </mesh>
          ))}
          {/* Kisi-Kisi Kayu Atap Pergola + Tanaman Rambat Hijau */}
          {[-2.1, -1.25, -0.4, 0.45, 1.3, 2.15].map((rz, ri) => (
            <mesh key={`rslat-${ri}`} position={[0, 2.98, rz]} castShadow>
              <boxGeometry args={[5.65, 0.1, 0.14]} />
              <meshStandardMaterial color="#6e4b30" roughness={0.75} />
            </mesh>
          ))}
          {[-1.6, 0, 1.6].map((vx, vi) => (
            <mesh key={`rvine-${vi}`} position={[vx, 3.06, 0.1]} castShadow>
              <dodecahedronGeometry args={[0.48, 1]} />
              <meshStandardMaterial color={vi === 1 ? '#db2777' : '#3d7a47'} roughness={0.82} />
            </mesh>
          ))}

          {/* Sofa Lounge Lebar Menghadap Selatan (Panorama Kota) */}
          <mesh position={[0, 0.28, -1.65]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.42, 1.05]} />
            <meshStandardMaterial color="#475569" roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.68, -2.08]} castShadow>
            <boxGeometry args={[3.2, 0.56, 0.24]} />
            <meshStandardMaterial color="#334155" roughness={0.85} />
          </mesh>
          {/* Bantal Aksentuasi Hangat */}
          {[-1.05, 0, 1.05].map((cx, ci) => (
            <mesh key={`rcush-${ci}`} position={[cx, 0.58, -1.82]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.46, 0.32, 0.14]} />
              <meshStandardMaterial color={ci === 1 ? '#f59e0b' : '#e2e8f0'} roughness={0.85} />
            </mesh>
          ))}

          {/* Meja Api Bio-Ethanol Modern di Depan Sofa */}
          <group position={[0, 0, 0.55]}>
            <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.0, 0.52, 0.92]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
            </mesh>
            {/* Kaca Pelindung Api & Nyala Api Hangat */}
            <mesh position={[0, 0.66, 0]}>
              <boxGeometry args={[1.25, 0.24, 0.36]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} />
            </mesh>
            <group ref={fireFlameRef} position={[0, 0.56, 0]}>
              {[-0.36, -0.12, 0.12, 0.36].map((fx, fi) => (
                <mesh key={`flm-${fi}`} position={[fx, 0.1, 0]}>
                  <coneGeometry args={[0.075, 0.24, 7]} />
                  <meshStandardMaterial
                    color="#fde047"
                    emissive="#f97316"
                    emissiveIntensity={3.2}
                  />
                </mesh>
              ))}
            </group>
            {isEveningOrNight && (
              <pointLight position={[0, 0.95, 0]} color="#ff9e44" intensity={14} distance={12} decay={1.8} />
            )}
          </group>

          {/* 2 Pot Palem Hias Sky Garden */}
          {[-2.35, 2.35].map((px, pi) => (
            <group key={`rpot-${pi}`} position={[px, 0, 2.1]}>
              <mesh position={[0, 0.32, 0]} castShadow>
                <cylinderGeometry args={[0.28, 0.22, 0.64, 12]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.95, 0]} castShadow>
                <dodecahedronGeometry args={[0.46, 1]} />
                <meshStandardMaterial color="#3f7d4c" roughness={0.82} />
              </mesh>
            </group>
          ))}
        </group>

        {/* --- 1B. MESIN KOPI & COKELAT HANGAT KOIN SKY DECK ([38.45, 0, -27.2]) --- */}
        <group position={[38.45, 0, -27.2]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.18, 2.1, 0.88]} />
            <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.08, 0.448]}>
            <planeGeometry args={[1.04, 1.86]} />
            <meshStandardMaterial
              map={skyVendingTex}
              emissiveMap={skyVendingTex}
              emissive="#ffffff"
              emissiveIntensity={isEveningOrNight ? 1.05 : 0.45}
            />
          </mesh>
        </group>

        {/* --- 1C. UNIT CHILLER HVAC BERPUTAR & MENARA ANTENA ROOFTOP ([21.2, 0, -38.5]) --- */}
        <group position={[21.2, 0, -38.5]}>
          <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.7, 1.76, 2.9]} />
            <meshStandardMaterial color="#475569" metalness={0.52} roughness={0.45} />
          </mesh>
          {[-0.95, 0.95].map((fx, fi) => (
            <group key={`hvacf-${fi}`} position={[fx, 1.79, 0]}>
              <mesh>
                <cylinderGeometry args={[0.68, 0.68, 0.08, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
              </mesh>
              <group ref={fi === 0 ? hvacFan1Ref : hvacFan2Ref} position={[0, 0.02, 0]}>
                {[0, 1, 2].map((bi) => (
                  <mesh key={`bl-${bi}`} rotation={[0, (bi * Math.PI) / 1.5, 0]}>
                    <boxGeometry args={[1.18, 0.02, 0.16]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.28} />
                  </mesh>
                ))}
              </group>
            </group>
          ))}
          {/* Tiang Antena Telekomunikasi & Lampu Suar Penerbangan Merah */}
          <mesh position={[-1.2, 4.2, -0.8]} castShadow>
            <cylinderGeometry args={[0.05, 0.16, 6.2, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-1.2, 7.4, -0.8]}>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshStandardMaterial
              ref={antennaBeaconMatRef}
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={isEveningOrNight ? 3.5 : 0.3}
            />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. UPGRADE FASAD RUMAH DAMAR & 3 RUMAH TETANGGA JL. MELATI           */}
      {/* ==================================================================== */}
      <group>
        {/* Kanopi Teras Kayu, Keset Selamat Datang & Unit AC Rumah Damar (Jl. Melati No. 14) */}
        <mesh position={[-20, 3.32, 61.05]} rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[4.4, 0.14, 1.75]} />
          <meshStandardMaterial map={textures.roofTile} roughness={0.78} />
        </mesh>
        <mesh position={[-20, 0.052, 61.28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[1.55, 0.78]} />
          <meshStandardMaterial map={welcomeMatTex} roughness={0.92} />
        </mesh>
        {/* Unit AC Outdoor di Dinding Samping Kamar Rumah Damar */}
        <group position={[-27.28, 3.05, 70.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.58, 0.84]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.45} metalness={0.25} />
          </mesh>
          <mesh position={[-0.19, 0, -0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 12]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
        </group>

        {/* Pintu Jati, Kanopi Teras, Nomor Rumah & Lampu Teras untuk 3 Rumah Tetangga */}
        {neighborFacades.map((nf, idx) => (
          <group key={`nfac-${idx}`} position={[nf.x, 0, nf.frontZ]}>
            {/* Pintu Kayu Panel Jati */}
            <mesh position={[0, 1.18, -0.05]} castShadow>
              <boxGeometry args={[1.18, 2.32, 0.1]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.7} />
            </mesh>
            <mesh position={[0.42, 1.12, -0.12]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.25} />
            </mesh>
            {/* Undakan Teras & Kanopi Genteng */}
            <mesh position={[0, 0.05, -0.55]} receiveShadow>
              <boxGeometry args={[2.6, 0.1, 1.1]} />
              <meshStandardMaterial map={textures.paving} roughness={0.85} />
            </mesh>
            <mesh position={[0, 2.75, -0.58]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[2.95, 0.14, 1.28]} />
              <meshStandardMaterial map={textures.roofTile} color={nf.roofCol} roughness={0.8} />
            </mesh>
            {/* Plakat Nomor Rumah & Lampu Dinding Teras */}
            <mesh position={[0.92, 1.72, -0.06]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.46, 0.24]} />
              <meshStandardMaterial map={nf.sign} roughness={0.5} />
            </mesh>
            <mesh position={[-0.88, 2.18, -0.12]}>
              <sphereGeometry args={[0.11, 8, 8]} />
              <meshStandardMaterial
                color={isEveningOrNight ? '#fff0c2' : '#cbd5e1'}
                emissive={isEveningOrNight ? '#ffad42' : '#000000'}
                emissiveIntensity={isEveningOrNight ? 2.4 : 0}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 3. KANOPI AWNING ARTISANAL & CEROBONG ROASTERY KEDAI KOPI BIMA       */}
      {/* ==================================================================== */}
      <group>
        {[-25.2, -22.6, -20.0, -17.4, -14.8].map((ax, ai) => (
          <mesh
            key={`cawn-${ai}`}
            position={[ax, 3.88, 12.92]}
            rotation={[-0.32, 0, 0]}
            castShadow
          >
            <boxGeometry args={[2.56, 0.1, 1.85]} />
            <meshStandardMaterial
              color={ai % 2 === 0 ? '#9a3412' : '#fef3c7'}
              roughness={0.82}
            />
          </mesh>
        ))}
        {/* Cerobong Sangrai Kopi Baja di Atap Kedai Bima */}
        <mesh position={[-23.5, 5.45, 23.5]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 1.5, 10]} />
          <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.35} />
        </mesh>
        <mesh position={[-23.5, 6.28, 23.5]}>
          <coneGeometry args={[0.38, 0.22, 10]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 4. FASAD KOLONIAL STASIUN SENJA: JAM BESAR, LOKET & BANGKU PERON     */}
      {/* ==================================================================== */}
      <group>
        {/* Jam Bundar Klasik Stasiun Senja Menghadap Peron Timur ([78.95, 3.55, -16.8]) */}
        <group position={[78.95, 3.55, -16.8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.58, 0.58, 0.12, 24]} />
            <meshStandardMaterial color="#422817" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0, 0.068]}>
            <circleGeometry args={[0.49, 24]} />
            <meshStandardMaterial
              color="#fffbeb"
              emissive="#fef3c7"
              emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
            />
          </mesh>
          <group position={[0, 0, 0.075]} rotation={[0, 0, hourAngle]}>
            <mesh position={[0, 0.13, 0]}>
              <boxGeometry args={[0.036, 0.26, 0.01]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
          <group position={[0, 0, 0.08]} rotation={[0, 0, minAngle]}>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.025, 0.36, 0.01]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
          <group ref={stationSecRef} position={[0, 0, 0.085]}>
            <mesh position={[0, 0.19, 0]}>
              <boxGeometry args={[0.014, 0.38, 0.01]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          </group>
        </group>

        {/* 2 Jendela Loket Kolonial Lengkung di Dinding Kantor Stasiun */}
        {[
          { z: -20.2, tex: loketTex },
          { z: -14.5, tex: kepalaStTex },
        ].map((win, wi) => (
          <group key={`stwin-${wi}`} position={[78.94, 1.68, win.z]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[1.65, 1.55, 0.12]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.72} />
            </mesh>
            <mesh position={[0, 0.02, 0.068]}>
              <planeGeometry args={[1.38, 1.24]} />
              <meshStandardMaterial
                color="#fde68a"
                emissive="#fbbf24"
                emissiveIntensity={isEveningOrNight ? 0.95 : 0.2}
                roughness={0.25}
              />
            </mesh>
            <mesh position={[0, 1.02, 0.05]}>
              <planeGeometry args={[1.55, 0.36]} />
              <meshStandardMaterial map={win.tex} roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Bangku Tunggu Peron Klasik Besi Tempa Menghadap Rel Kereta ([83.2, 0.1, -11.5]) */}
        <group position={[83.2, 0.1, -11.5]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.3, 0.1, 0.65]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.78, -0.26]} rotation={[-0.14, 0, 0]} castShadow>
            <boxGeometry args={[2.3, 0.44, 0.08]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.72} />
          </mesh>
          {[-0.92, 0.92].map((lx, li) => (
            <mesh key={`stbl-${li}`} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.58]} />
              <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.4} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 5. MAHKOTA LED ARSITEKTUR & HELIPAD PUNCAK GEDUNG SKYLINE KOTA       */}
      {/* ==================================================================== */}
      <group userData={{ noCull: true }}>
        {[
          { x: 51, z: -33, w: 10.7, d: 21.2, h: 19, col: '#38bdf8' },
          { x: 46, z: 25, w: 15.2, d: 17.2, h: 14, col: '#fbbf24' },
          { x: -21, z: -47, w: 14.7, d: 13.7, h: 17, col: '#f59e0b' },
          { x: -5, z: -54, w: 13.7, d: 12.7, h: 24, col: '#60a5fa' },
          { x: 64, z: -54, w: 16.2, d: 14.2, h: 21, col: '#34d399' },
          { x: -48, z: -60, w: 18.2, d: 14.2, h: 22, col: '#fbbf24' },
        ].map((cr, ci) => (
          <group key={`crown-${ci}`} position={[cr.x, cr.h, cr.z]}>
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[cr.w, 0.24, cr.d]} />
              <meshStandardMaterial
                color={isEveningOrNight ? cr.col : '#64748b'}
                emissive={isEveningOrNight ? cr.col : '#000000'}
                emissiveIntensity={isNight ? 2.1 : isEveningOrNight ? 1.15 : 0}
              />
            </mesh>
          </group>
        ))}
        {/* Lingkaran Helipad di Puncak Menara Utara Tertinggi ([-5, 24.32, -54]) */}
        <group position={[-5, 24.32, -54]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.4, 3.85, 28]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fbbf24"
              emissiveIntensity={isEveningOrNight ? 1.6 : 0.2}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
