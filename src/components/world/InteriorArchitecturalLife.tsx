import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface InteriorArchitecturalLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createListeningBoothSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#261710';
  ctx.fillRect(0, 0, 320, 96);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, 310, 86);
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BILIK DENGAR ANALOG', 160, 36);
  ctx.fillStyle = '#fdba74';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('HEADPHONE STUDIO · KASET DEMO', 160, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createScaleModelPlaqueTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 80;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 384, 80);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 376, 72);
  ctx.fillStyle = '#e0f2fe';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MAKET TATA KOTA SENJA · SKALA 1:250', 192, 40);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Upgrade Detail Arsitektur Interior di 5 Bangunan Utama Kota Senja:
 * 1. Rumah Keluarga Damar: Kipas Angin Plafon Kayu Berputar, Rak Sepatu 3 Pasang Keluarga,
 *    Galeri Bingkai Foto Dinding Timur, & Rak Piring + Jendela Dapur.
 * 2. Kedai Kopi Sudut Bima: Mesin Sangrai Kopi Tembaga Berputar (Artisanal Roaster), Karung Goni
 *    Kopi Gayo/Toraja, & Rak Dinding Back-Bar Barista Bercahaya.
 * 3. Toko Musik "Nada Lama": Bilik Dengar Headphone Analog & VU Meter Bergerak + Plakat Vinyl Emas.
 * 4. Kios 24 Jam Harmoni: Konter Steamer Bakpao Hangat, Dispenser Mie Cup, & Microwave 24 Jam.
 * 5. Lobi Menara Nusantara: Meja Maket Kaca Arsitektur "Kota Senja Miniatur" Bercahaya.
 */
export const InteriorArchitecturalLife: React.FC<InteriorArchitecturalLifeProps> = ({
  timeOfDay,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const boothSignTex = useMemo(() => createListeningBoothSignTexture(), []);
  const modelPlaqueTex = useMemo(() => createScaleModelPlaqueTexture(), []);
  const isEveningOrNight = timeOfDay !== 'morning';

  const ceilingFanRef = useRef<THREE.Group>(null);
  const roasterPaddleRef = useRef<THREE.Group>(null);
  const vuLeftRef = useRef<THREE.Mesh>(null);
  const vuRightRef = useRef<THREE.Mesh>(null);
  const tapeReelLRef = useRef<THREE.Mesh>(null);
  const tapeReelRRef = useRef<THREE.Mesh>(null);
  const modelBeaconRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (playerRuntime.roasterSpinTimer > 0) {
      playerRuntime.roasterSpinTimer = Math.max(0, playerRuntime.roasterSpinTimer - dt);
    }
    if (playerRuntime.listeningBoothTimer > 0) {
      playerRuntime.listeningBoothTimer = Math.max(0, playerRuntime.listeningBoothTimer - dt);
    }

    // 1. Kipas angin plafon kayu di ruang tengah Rumah Damar
    if (ceilingFanRef.current && !shouldSkipPerfFrame(-20, 67, 36)) {
      ceilingFanRef.current.rotation.y += dt * 3.1;
    }

    // 2. Putaran pengaduk pendingin biji kopi di Kedai Bima
    if (roasterPaddleRef.current && !shouldSkipPerfFrame(-15, 25, 36)) {
      const speed = 1.25 + (playerRuntime.roasterSpinTimer > 0 ? 3.2 : 0);
      roasterPaddleRef.current.rotation.y += dt * speed;
    }

    // 3. Jarum VU Meter & Reel Kaset di Bilik Dengar Toko Musik Nada Lama
    if (!shouldSkipPerfFrame(-27, -21, 36)) {
      const active = playerRuntime.listeningBoothTimer > 0;
      if (vuLeftRef.current && vuRightRef.current) {
        const swingL = active ? Math.sin(t * 9.5) * 0.45 : Math.sin(t * 1.8) * 0.08;
        const swingR = active ? Math.cos(t * 8.7) * 0.42 : Math.cos(t * 1.6) * 0.08;
        vuLeftRef.current.rotation.z = swingL;
        vuRightRef.current.rotation.z = swingR;
      }
      if (active && tapeReelLRef.current && tapeReelRRef.current) {
        tapeReelLRef.current.rotation.z -= dt * 4.5;
        tapeReelRRef.current.rotation.z -= dt * 4.5;
      }
    }

    // 4. Denyut halus lampu maket Menara Nusantara
    if (modelBeaconRef.current && !shouldSkipPerfFrame(23.5, -22.6, 36)) {
      modelBeaconRef.current.emissiveIntensity = 1.6 + Math.sin(t * 3.2) * 0.6;
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. RUMAH KELUARGA DAMAR: KIPAS PLAFON, RAK SEPATU & GALERI DINDING   */}
      {/* ==================================================================== */}
      <group>
        {/* Kipas Angin Gantung Kayu Klasik di Plafon Ruang Keluarga ([-20.2, 3.92, 66.5]) */}
        <group position={[-20.2, 3.92, 66.5]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
            <meshStandardMaterial color="#785032" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.18, 0.16, 0.1, 14]} />
            <meshStandardMaterial color="#b4834b" metalness={0.65} roughness={0.35} />
          </mesh>
          <group ref={ceilingFanRef}>
            {[0, 1, 2, 3].map((bi) => (
              <mesh key={`cfan-${bi}`} rotation={[0, (bi * Math.PI) / 2, 0]} position={[0, -0.02, 0]}>
                <boxGeometry args={[1.45, 0.018, 0.16]} />
                <meshStandardMaterial color="#5c3a21" roughness={0.68} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Rak Sepatu Kayu Keluarga & Tempat Payung di Dekat Pintu Masuk ([-14.1, 0.08, 63.05]) */}
        <group position={[-14.1, 0.08, 63.05]}>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 0.56, 0.42]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.72} />
          </mesh>
          {/* Sepatu Kerja Cokelat Damar, Flat Shoes Krem Nadia, & Sepatu Kuning Kecil Kira */}
          {[
            { x: -0.34, col: '#3e2723', sz: 0.22 },
            { x: -0.18, col: '#3e2723', sz: 0.22 },
            { x: 0.02, col: '#d6c2a8', sz: 0.19 },
            { x: 0.16, col: '#d6c2a8', sz: 0.19 },
            { x: 0.34, col: '#facc15', sz: 0.14 },
            { x: 0.45, col: '#facc15', sz: 0.14 },
          ].map((sh, si) => (
            <mesh key={`shoe-${si}`} position={[sh.x, 0.59, 0]} castShadow>
              <boxGeometry args={[0.09, 0.07, sh.sz]} />
              <meshStandardMaterial color={sh.col} roughness={0.65} />
            </mesh>
          ))}
          {/* Tabung Tempat Payung Keramik di Samping Rak Sepatu */}
          <mesh position={[-0.72, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.1, 0.48, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.45} />
          </mesh>
        </group>

        {/* 3 Bingkai Foto Keluarga di Dinding Timur Ruang Tamu ([-13.24, 2.08, 64.9]) */}
        {[-0.65, 0, 0.65].map((fz, fi) => (
          <group key={`hframe-${fi}`} position={[-13.23, 2.08 + (fi === 1 ? 0.12 : 0), 64.9 + fz]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.46, 0.56, 0.04]} />
              <meshStandardMaterial color="#5c3d28" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.36, 0.46]} />
              <meshStandardMaterial
                color={['#fde68a', '#fed7aa', '#bae6fd'][fi]}
                roughness={0.6}
              />
            </mesh>
          </group>
        ))}

        {/* Rak Piring Gantung & Jendela Ventilasi Kayu di Atas Meja Dapur ([-16.9, 2.15, 73.72]) */}
        <group position={[-16.9, 2.15, 73.72]}>
          <mesh castShadow>
            <boxGeometry args={[2.1, 0.58, 0.34]} />
            <meshStandardMaterial color="#785032" roughness={0.74} />
          </mesh>
          {[-0.7, -0.45, -0.2, 0.25, 0.55].map((px, pi) => (
            <mesh key={`plate-${pi}`} position={[px, -0.04, -0.06]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.02, 12]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Papan Congklak Kayu Jati Ukiran & Tikar Lesehan Bersama Kira di Ruang Tengah ([-21.55, 0.08, 68.55]) */}
        <group position={[-21.55, 0.08, 68.55]} rotation={[0, 0.18, 0]}>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1.15, 0.72]} />
            <meshStandardMaterial color="#c4a46d" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.042, 0]} castShadow>
            <boxGeometry args={[0.74, 0.065, 0.2]} />
            <meshStandardMaterial color="#5c3317" roughness={0.62} />
          </mesh>
          {[-0.3, 0.3].map((lx, li) => (
            <mesh key={`cgk-s-${li}`} position={[lx, 0.078, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.012, 10]} />
              <meshStandardMaterial color="#fef3c7" roughness={0.5} />
            </mesh>
          ))}
          {[-0.18, -0.09, 0, 0.09, 0.18].map((px, pi) =>
            [-0.045, 0.045].map((pz, pzi) => (
              <mesh key={`cgk-p-${pi}-${pzi}`} position={[px, 0.078, pz]}>
                <cylinderGeometry args={[0.024, 0.024, 0.01, 8]} />
                <meshStandardMaterial color="#fde68a" roughness={0.55} />
              </mesh>
            )),
          )}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. KEDAI KOPI SUDUT BIMA: MESIN SANGRAI KOPI TEMBAGA & BACK-BAR      */}
      {/* ==================================================================== */}
      <group>
        {/* Mesin Sangrai Kopi Artisanal Tembaga & Karung Goni ([-14.4, 0.08, 25.1]) */}
        <group position={[-14.4, 0.08, 25.1]}>
          {/* Kaki Baja & Badan Silinder Sangrai Tembaga */}
          <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.92, 0.96]} />
            <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.16, -0.08]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.88, 16]} />
            <meshStandardMaterial color="#b45309" metalness={0.72} roughness={0.28} />
          </mesh>
          {/* Corong Hopper Biji Kopi Hijau di Atas */}
          <mesh position={[0, 1.68, -0.08]} castShadow>
            <coneGeometry args={[0.26, 0.42, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.75} roughness={0.25} />
          </mesh>
          {/* Baki Pendingin Bundar Depan + Lengan Pengaduk Berputar */}
          <mesh position={[0, 0.82, 0.48]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.16, 18]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.91, 0.48]}>
            <cylinderGeometry args={[0.37, 0.37, 0.02, 16]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
          </mesh>
          <group ref={roasterPaddleRef} position={[0, 0.94, 0.48]}>
            <mesh>
              <boxGeometry args={[0.66, 0.03, 0.05]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
          {/* 2 Karung Goni Biji Kopi Nusantara di Samping Mesin */}
          {[-0.78, -0.72].map((sx, si) => (
            <mesh key={`sack-${si}`} position={[sx, 0.26, -0.22 + si * 0.46]} rotation={[0.12, si * 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.26, 0.52, 10]} />
              <meshStandardMaterial color="#a18058" roughness={0.94} />
            </mesh>
          ))}
        </group>

        {/* Rak Dinding Back-Bar Barista Bercahaya di Belakang Bima ([-21.0, 2.25, 26.8]) */}
        <group position={[-21.0, 2.25, 26.8]}>
          {[0, 0.62].map((ry, ri) => (
            <group key={`cshelf-${ri}`} position={[0, ry, 0]}>
              <mesh castShadow>
                <boxGeometry args={[4.8, 0.07, 0.34]} />
                <meshStandardMaterial color="#4a2e1b" roughness={0.7} />
              </mesh>
              <mesh position={[0, -0.05, 0.12]}>
                <boxGeometry args={[4.6, 0.02, 0.03]} />
                <meshStandardMaterial
                  color="#fde68a"
                  emissive="#f59e0b"
                  emissiveIntensity={isEveningOrNight ? 2.2 : 0.7}
                />
              </mesh>
              {/* Toples Kaca Biji Kopi & Teko Leher Angsa */}
              {[-1.8, -1.0, -0.2, 0.6, 1.4].map((jx, ji) => (
                <mesh key={`cjar-${ji}`} position={[jx, 0.17, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.1, 0.26, 10]} />
                  <meshStandardMaterial
                    color={ji % 2 === 0 ? '#78350f' : '#d6d3d1'}
                    metalness={ji % 2 === 1 ? 0.65 : 0.1}
                    roughness={0.35}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. TOKO MUSIK NADA LAMA: BILIK DENGAR HEADPHONE ANALOG & VU METER    */}
      {/* ==================================================================== */}
      <group position={[-27.95, 0.08, -21.4]} rotation={[0, Math.PI / 2, 0]}>
        {/* Meja Kayu Kenari Bilik Dengar */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.55, 0.96, 0.72]} />
          <meshStandardMaterial color="#4a2e1d" roughness={0.72} />
        </mesh>
        {/* Panel Dek Kaset & 2 Layar VU Meter Kuning Hangat */}
        <mesh position={[0, 1.12, -0.14]} castShadow>
          <boxGeometry args={[1.32, 0.34, 0.36]} />
          <meshStandardMaterial color="#1e293b" metalness={0.55} roughness={0.38} />
        </mesh>
        {[-0.36, 0.36].map((vx, vi) => (
          <group key={`vu-${vi}`} position={[vx, 1.14, 0.045]}>
            <mesh>
              <planeGeometry args={[0.32, 0.18]} />
              <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.25} />
            </mesh>
            <mesh
              ref={vi === 0 ? vuLeftRef : vuRightRef}
              position={[0, -0.05, 0.006]}
            >
              <boxGeometry args={[0.014, 0.13, 0.005]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        ))}
        {/* Reel Kaset Berputar di Tengah Panel */}
        <mesh ref={tapeReelLRef} position={[-0.06, 1.14, 0.048]}>
          <ringGeometry args={[0.018, 0.042, 8]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>
        <mesh ref={tapeReelRRef} position={[0.06, 1.14, 0.048]}>
          <ringGeometry args={[0.018, 0.042, 8]} />
          <meshBasicMaterial color="#e2e8f0" />
        </mesh>

        {/* Dudukan Kuningan & Headphone Studio Analog di Atas Meja */}
        <group position={[0.42, 0.98, 0.16]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.015, 0.06, 0.24, 8]} />
            <meshStandardMaterial color="#d97706" metalness={0.75} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.23, 0]}>
            <torusGeometry args={[0.1, 0.018, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#1f2937" roughness={0.6} />
          </mesh>
          {[-0.1, 0.1].map((ex, ei) => (
            <mesh key={`ear-${ei}`} position={[ex, 0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
          ))}
        </group>

        {/* Papan Petunjuk "BILIK DENGAR ANALOG" & Plakat Piringan Emas di Dinding */}
        <mesh position={[0, 1.72, -0.32]}>
          <planeGeometry args={[1.38, 0.42]} />
          <meshStandardMaterial map={boothSignTex} roughness={0.5} />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 4. KIOS 24 JAM HARMONI: KONTER BAKPAO KUKUS & MIE CUP AIR PANAS      */}
      {/* ==================================================================== */}
      <group position={[18.52, 0.08, 22.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.96, 0.82]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.98, 0]}>
          <boxGeometry args={[2.68, 0.06, 0.88]} />
          <meshStandardMaterial color="#277363" roughness={0.4} />
        </mesh>

        {/* Etalase Kaca Steamer Bakpao Hangat Bercahaya */}
        <group position={[-0.72, 1.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.68, 0.62, 0.56]} />
            <meshStandardMaterial color="#fde68a" transparent opacity={0.34} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.33, 0]}>
            <boxGeometry args={[0.72, 0.06, 0.6]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          {/* 6 Bakpao Putih, Pandan & Cokelat di Rak Kukus */}
          {[-0.16, 0.16].map((bx, bi) =>
            [-0.14, 0.14].map((bz, bzi) => (
              <mesh key={`bun-${bi}-${bzi}`} position={[bx, -0.08 + bi * 0.18, bz]}>
                <sphereGeometry args={[0.075, 10, 8]} />
                <meshStandardMaterial color={bi === 0 ? '#fffbeb' : bzi === 0 ? '#bbf7d0' : '#d6b499'} roughness={0.7} />
              </mesh>
            )),
          )}
        </group>

        {/* Microwave Digital & Dispenser Air Panas Mie Cup */}
        <mesh position={[0.15, 1.2, -0.04]} castShadow>
          <boxGeometry args={[0.62, 0.36, 0.46]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0.1, 1.2, 0.195]}>
          <planeGeometry args={[0.38, 0.22]} />
          <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={0.9} />
        </mesh>
        {/* Tumpukan Cup Mie Instan Warna-Warni */}
        {[0.72, 0.92, 1.1].map((cx, ci) => (
          <mesh key={`mcup-${ci}`} position={[cx, 1.12, 0.08]} castShadow>
            <cylinderGeometry args={[0.075, 0.06, 0.16, 10]} />
            <meshStandardMaterial color={['#ef4444', '#f59e0b', '#22c55e'][ci]} roughness={0.55} />
          </mesh>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 5. LOBI MENARA NUSANTARA: MEJA MAKET ARSITEKTUR KOTA SENJA 1:250     */}
      {/* ==================================================================== */}
      <group position={[23.5, 0.08, -22.6]}>
        {/* Pedestal Marmer Gelap */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.88, 1.32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.45} roughness={0.32} />
        </mesh>
        {/* Pelat Nama Maket */}
        <mesh position={[0, 0.68, 0.668]}>
          <planeGeometry args={[1.24, 0.26]} />
          <meshStandardMaterial map={modelPlaqueTex} emissiveMap={modelPlaqueTex} emissive="#ffffff" emissiveIntensity={0.65} />
        </mesh>
        {/* Alas Peta Miniatur Hijau-Sungai */}
        <mesh position={[0, 0.89, 0]}>
          <boxGeometry args={[1.44, 0.03, 1.2]} />
          <meshStandardMaterial color="#1e3a2f" roughness={0.7} />
        </mesh>
        {/* Sungai Miniatur & Danau Miniatur */}
        <mesh position={[-0.32, 0.908, 0]}>
          <boxGeometry args={[0.14, 0.01, 1.16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
        {/* Miniatur Menara Nusantara, Rumah Melati & Gedung Sekitar */}
        <mesh position={[0.22, 1.08, -0.18]} castShadow>
          <boxGeometry args={[0.2, 0.36, 0.16]} />
          <meshStandardMaterial
            ref={modelBeaconRef}
            color="#bae6fd"
            emissive="#38bdf8"
            emissiveIntensity={1.6}
          />
        </mesh>
        <mesh position={[-0.12, 0.94, 0.36]}>
          <boxGeometry args={[0.14, 0.09, 0.12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.42, 1.0, -0.22]}>
          <boxGeometry args={[0.12, 0.2, 0.16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* Kubah Kaca Akrilik Bening Pelindung Maket */}
        <mesh position={[0, 1.08, 0]}>
          <boxGeometry args={[1.5, 0.36, 1.26]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.22} roughness={0.08} metalness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
