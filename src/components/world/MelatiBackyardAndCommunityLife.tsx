import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface MelatiBackyardAndCommunityLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createTogaSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 448;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 448, 128);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 436, 116);

  ctx.fillStyle = '#fefce8';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KEBUN TOGA PKK RT 04', 224, 44);

  ctx.fillStyle = '#bbf7d0';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('JAHE MERAH · KUNYIT · SERAI · LIDAH BUAYA', 224, 86);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Upgrade Lingkungan Halaman Belakang Rumah Damar & Kebun Warga Jl. Melati:
 * 1. Jalan Setapak Batu Samping Rumah menuju Halaman Belakang (x = -11.4, z = 56..77.5)
 * 2. Ayunan Ban Gantung Klasik di Dahan Pohon Rindang Belakang Rumah ([-25.6, 0, 79.0])
 * 3. Bedeng Kayu Kebun Bumbu Dapur Nadia (Pandan, Serai, Kemangi & Cabai Rawit: [-17.2, 0, 76.2])
 *    + Gentong Terakota Penampung Air Hujan ([-14.2, 0, 77.6])
 * 4. Kebun TOGA (Tanaman Obat Keluarga) Ibu-Ibu PKK RT 04 & Bale-Bale Bambu ([5.2, 0, 79.8])
 */
export const MelatiBackyardAndCommunityLife: React.FC<MelatiBackyardAndCommunityLifeProps> = ({
  timeOfDay,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const togaSignTex = useMemo(() => createTogaSignTexture(), []);
  const isEveningOrNight = timeOfDay !== 'morning';

  const tireSwingRef = useRef<THREE.Group>(null);
  const herbLeavesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (playerRuntime.herbRustleTimer > 0) {
      playerRuntime.herbRustleTimer = Math.max(0, playerRuntime.herbRustleTimer - dt);
    }

    if (shouldSkipPerfFrame(-12, 78, 56)) return;

    if (tireSwingRef.current) {
      const amp = playerRuntime.sitState?.label === 'Ayunan Ban Pohon Halaman Belakang' ? 0.14 : 0.045;
      tireSwingRef.current.rotation.x = Math.sin(t * 1.65) * amp;
    }

    if (herbLeavesRef.current) {
      const rustle = playerRuntime.herbRustleTimer > 0 ? Math.sin(t * 14) * 0.14 : Math.sin(t * 1.9) * 0.03;
      herbLeavesRef.current.rotation.z = rustle;
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. JALAN SETAPAK BATU SAMPING KANAN RUMAH MENUJU HALAMAN BELAKANG    */}
      {/* ==================================================================== */}
      {[56.5, 59.0, 61.5, 64.0, 66.5, 69.0, 71.5, 74.0, 76.2].map((sz, si) => (
        <mesh
          key={`bpath-${si}`}
          position={[-11.3 + (si % 2) * 0.18, 0.02, sz]}
          receiveShadow
        >
          <cylinderGeometry args={[0.42, 0.45, 0.04, 10]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
      ))}

      {/* ==================================================================== */}
      {/* 2. AYUNAN BAN GANTUNG DI POHON BELAKANG RUMAH ([-25.6, 0, 79.0])     */}
      {/* ==================================================================== */}
      <group position={[-28.0, 0, 79.0]}>
        {/* Dahan Kayu Kuat Menjulur ke Timur dari Pohon [-28, 79] */}
        <mesh position={[1.45, 3.35, 0]} rotation={[0, 0, -Math.PI / 2 + 0.08]} castShadow>
          <cylinderGeometry args={[0.11, 0.18, 3.1, 8]} />
          <meshStandardMaterial color="#59402e" roughness={0.92} />
        </mesh>

        {/* Tali Tambang & Ban Karet Klasik Mengayun di [-25.6, *, 79.0] */}
        <group ref={tireSwingRef} position={[2.4, 3.32, 0]}>
          <mesh position={[0, -1.25, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 2.5, 6]} />
            <meshStandardMaterial color="#c29b61" roughness={0.9} />
          </mesh>
          <mesh position={[0, -2.68, 0]} castShadow>
            <torusGeometry args={[0.34, 0.12, 10, 18]} />
            <meshStandardMaterial color="#1f2937" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. KEBUN BUMBU DAPUR NADIA & GENTONG TERAKOTA ([-17.2, 0, 76.2])     */}
      {/* ==================================================================== */}
      <group position={[-17.2, 0, 76.2]}>
        {/* Kotak Kayu Raised-Bed */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.4, 0.96]} />
          <meshStandardMaterial map={textures.woodSlat} color="#6e472b" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <boxGeometry args={[2.38, 0.04, 0.8]} />
          <meshStandardMaterial color="#3b2618" roughness={0.95} />
        </mesh>

        {/* Rumpun Pandan Wangi, Serai, Kemangi & Cabai Rawit Merah */}
        <group ref={herbLeavesRef} position={[0, 0.42, 0]}>
          {[-0.85, -0.3, 0.28, 0.82].map((hx, hi) => (
            <group key={`herb-${hi}`} position={[hx, 0, 0]}>
              <mesh position={[0, 0.22, 0]} castShadow>
                <dodecahedronGeometry args={[0.26, 0]} />
                <meshStandardMaterial
                  color={['#15803d', '#4d7c0f', '#16a34a', '#166534'][hi]}
                  roughness={0.8}
                />
              </mesh>
              {/* Buah cabai rawit merah mungil di rumpun ke-4 */}
              {hi === 3 &&
                [-0.08, 0.06, 0.02].map((cx, ci) => (
                  <mesh key={`chl-${ci}`} position={[cx, 0.34, (ci - 1) * 0.06]}>
                    <coneGeometry args={[0.022, 0.075, 6]} />
                    <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.25} />
                  </mesh>
                ))}
            </group>
          ))}
        </group>

        {/* Lampu Taman Surya Kecil Belakang Rumah */}
        {isEveningOrNight && (
          <pointLight position={[0, 1.4, 0.8]} color="#ffcf85" intensity={8} distance={10} decay={1.8} />
        )}
      </group>

      {/* Gentong Terakota Air Hujan & Gayung Kelapa ([-14.2, 0, 77.6]) */}
      <group position={[-14.2, 0, 77.6]}>
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.32, 0.88, 14]} />
          <meshStandardMaterial color="#9a4429" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.89, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 0.04, 14]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.82} />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 4. KEBUN TOGA PKK RT 04 & BALE-BALE BAMBU BELAKANG GANG ([5.2,0,79.8]) */}
      {/* ==================================================================== */}
      <group position={[5.2, 0, 79.8]}>
        {/* Papan Nama Kebun TOGA */}
        <group position={[-2.6, 0, -0.4]}>
          <mesh position={[-0.65, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
            <meshStandardMaterial color="#4a301d" />
          </mesh>
          <mesh position={[0.65, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
            <meshStandardMaterial color="#4a301d" />
          </mesh>
          <mesh position={[0, 1.32, 0]} castShadow>
            <boxGeometry args={[1.65, 0.48, 0.08]} />
            <meshStandardMaterial map={togaSignTex} roughness={0.6} />
          </mesh>
          {/* Deretan 6 Pot Terakota TOGA */}
          {[-0.6, -0.2, 0.2, 0.6].map((px, pi) => (
            <group key={`toga-${pi}`} position={[px, 0, 0.55]}>
              <mesh position={[0, 0.16, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.11, 0.32, 10]} />
                <meshStandardMaterial color="#b45338" roughness={0.85} />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <coneGeometry args={[0.16, 0.34, 6]} />
                <meshStandardMaterial color={pi % 2 === 0 ? '#15803d' : '#65a30d'} roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Bale-Bale Bambu Santai Warga */}
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.1, 1.1]} />
          <meshStandardMaterial color="#a37c48" roughness={0.82} />
        </mesh>
        {[
          [-0.98, -0.44],
          [0.98, -0.44],
          [-0.98, 0.44],
          [0.98, 0.44],
        ].map(([lx, lz], li) => (
          <mesh key={`blg-${li}`} position={[lx, 0.21, lz]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.42, 8]} />
            <meshStandardMaterial color="#78582e" roughness={0.85} />
          </mesh>
        ))}
        {/* Tiang Lampu Taman Surya Kebun TOGA */}
        <group position={[1.55, 0, -0.35]}>
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 2.1, 8]} />
            <meshStandardMaterial color="#292524" metalness={0.5} />
          </mesh>
          <mesh position={[0, 2.15, 0]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#f59e0b"
              emissiveIntensity={isEveningOrNight ? 2.6 : 0.2}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
