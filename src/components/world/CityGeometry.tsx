import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from '../../types/game';

interface CityGeometryProps {
  timeOfDay: TimeOfDay;
  buWatiLampFixed: boolean;
}

// Koordinat pepohonan kota & taman (instanced, ringan, dan bergoyang halus)
const TREE_POSITIONS: [number, number, number, number][] = [
  // Taman Kota & Danau Senja
  [-65, 0, -4, 1.15],
  [-74, 0, -4, 1.3],
  [-86, 0, -6, 1.1],
  [-98, 0, -14, 1.35],
  [-102, 0, -28, 1.25],
  [-99, 0, -44, 1.3],
  [-84, 0, -49, 1.2],
  [-68, 0, -45, 1.15],
  [-63, 0, -34, 1.05],
  [-64, 0, -16, 1.1],
  [-74, 0, 12, 1.2],
  [-90, 0, 10, 1.3],
  [-66, 0, 28, 1.15],
  [-78, 0, 38, 1.25],
  // Perumahan Melati & Rumah Damar
  [-31, 0, 56, 1.05],
  [-10, 0, 56, 1.1],
  [5, 0, 56, 1.0],
  [21, 0, 56, 1.15],
  [39, 0, 58, 1.2],
  [-28, 0, 79, 1.2],
  [-8, 0, 81, 1.15],
  [16, 0, 81, 1.1],
  // Sepanjang jalan utama & tepi sungai
  [-36, 0, -14, 1.05],
  [-36, 0, 16, 1.05],
  [-36, 0, 32, 1.1],
  [-10, 0, -11, 0.95],
  [11, 0, -11, 0.95],
  [11, 0, 11, 0.95],
  [-11, 0, 36, 1.0],
  [11, 0, 36, 1.0],
  [54, 0, -10, 1.05],
  [54, 0, 14, 1.05],
  [70, 0, 22, 1.1],
  [72, 0, -32, 1.2],
];

// Lampu jalan kota (instanced tiang + bola lampu menyala hangat saat senja/malam)
const LAMP_POSITIONS: [number, number, number][] = [
  [-56, 0, -7],
  [-48, 0.2, -7],
  [-40, 0, -7],
  [-56, 0, 7],
  [-48, 0.2, 7],
  [-40, 0, 7],
  [-26, 0, -8],
  [-10, 0, -8],
  [10, 0, -8],
  [28, 0, -8],
  [48, 0, -8],
  [-26, 0, 8],
  [-10, 0, 8],
  [10, 0, 8],
  [28, 0, 8],
  [48, 0, 8],
  [-8, 0, 26],
  [8, 0, 26],
  [-8, 0, 44],
  [8, 0, 44],
  [-22, 0, 52],
  [22, 0, 52],
  [60, 0, -24],
  [60, 0, 10],
  [-68, 0, -19],
  [-78, 0, -9],
];

const SwayingTrees: React.FC = () => {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const foliageRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  React.useEffect(() => {
    if (!trunkRef.current || !foliageRef.current) return;
    TREE_POSITIONS.forEach(([x, y, z, s], i) => {
      dummy.position.set(x, y + 1.45 * s, z);
      dummy.rotation.set(0, i * 0.7, 0);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 3.6 * s, z);
      dummy.updateMatrix();
      foliageRef.current!.setMatrixAt(i, dummy.matrix);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    const foliage = foliageRef.current;
    if (!foliage) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < TREE_POSITIONS.length; i++) {
      const [x, y, z, s] = TREE_POSITIONS[i];
      const sway = Math.sin(t * 1.15 + i * 0.9) * 0.045;
      dummy.position.set(x + sway * 1.4, y + 3.6 * s, z);
      dummy.rotation.set(sway * 0.6, i * 0.7, sway);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      foliage.setMatrixAt(i, dummy.matrix);
    }
    foliage.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.34, 2.9, 6]} />
        <meshStandardMaterial color="#654b38" roughness={0.92} />
      </instancedMesh>
      <instancedMesh ref={foliageRef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.95, 0]} />
        <meshStandardMaterial color="#426948" roughness={0.85} flatShading />
      </instancedMesh>
    </>
  );
};

const StreetLamps: React.FC<{ lit: boolean }> = ({ lit }) => {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const bulbRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  React.useEffect(() => {
    if (!poleRef.current || !bulbRef.current) return;
    LAMP_POSITIONS.forEach(([x, y, z], i) => {
      dummy.position.set(x, y + 2.7, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      poleRef.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 5.5, z);
      dummy.updateMatrix();
      bulbRef.current!.setMatrixAt(i, dummy.matrix);
    });
    poleRef.current.instanceMatrix.needsUpdate = true;
    bulbRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <>
      <instancedMesh ref={poleRef} args={[undefined, undefined, LAMP_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 5.4, 6]} />
        <meshStandardMaterial color="#2c313b" metalness={0.4} roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={bulbRef} args={[undefined, undefined, LAMP_POSITIONS.length]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial
          color={lit ? '#ffdfa0' : '#cfd5de'}
          emissive={lit ? '#ffae42' : '#000000'}
          emissiveIntensity={lit ? 2.4 : 0}
        />
      </instancedMesh>
      {/* Beberapa point light hangat terpilih agar performa tetap ringan di laptop */}
      {lit && (
        <>
          <pointLight position={[-48, 5.4, 0]} color="#ffb963" intensity={16} distance={26} decay={1.8} />
          <pointLight position={[-20, 4.6, 18]} color="#ffc175" intensity={14} distance={24} decay={1.8} />
          <pointLight position={[24, 5.2, 16]} color="#e8f7ff" intensity={14} distance={22} decay={1.8} />
          <pointLight position={[27, 5.2, -22]} color="#dce8ff" intensity={14} distance={24} decay={1.8} />
          <pointLight position={[-20, 4.2, 65]} color="#ffcb80" intensity={14} distance={22} decay={1.8} />
          <pointLight position={[78, 5.0, -4]} color="#ffc47a" intensity={12} distance={22} decay={1.8} />
          <pointLight position={[-70, 5.0, -18]} color="#ffbe72" intensity={12} distance={22} decay={1.8} />
          <pointLight position={[28, 25.5, -31]} color="#ffd28a" intensity={16} distance={28} decay={1.7} />
        </>
      )}
    </>
  );
};

export const CityGeometry: React.FC<CityGeometryProps> = ({ timeOfDay, buWatiLampFixed }) => {
  const isEveningOrNight = timeOfDay === 'sunset' || timeOfDay === 'rain_dusk' || timeOfDay === 'night';
  const isWet = timeOfDay === 'rain_dusk';
  const roadRoughness = isWet ? 0.24 : 0.86;
  const roadMetalness = isWet ? 0.32 : 0.05;
  const windowEmissive = isEveningOrNight ? '#ffca78' : '#7a9ab8';
  const windowEmissiveInt = timeOfDay === 'night' ? 1.2 : isEveningOrNight ? 0.75 : 0.05;

  const waterRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.roughness = 0.16 + Math.sin(clock.getElapsedTime() * 1.4) * 0.04;
    }
  });

  return (
    <group>
      {/* === TANAH DASAR & TAMAN RUMPUT === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[280, 260]} />
        <meshStandardMaterial color="#586b4e" roughness={0.95} />
      </mesh>

      {/* Area Perkotaan Beton / Trotoar Utama */}
      <mesh position={[12, -0.01, -4]} receiveShadow>
        <boxGeometry args={[92, 0.04, 108]} />
        <meshStandardMaterial color="#8f8c86" roughness={0.9} />
      </mesh>

      {/* === JALAN ASPAL MODERN === */}
      {/* Jl. Kenangan (Barat - Timur, z=0) */}
      <mesh position={[-5, 0.01, 0]} receiveShadow>
        <boxGeometry args={[186, 0.04, 11.2]} />
        <meshStandardMaterial color="#30343b" roughness={roadRoughness} metalness={roadMetalness} />
      </mesh>
      {/* Jl. Cempaka (Utara - Selatan, x=0) */}
      <mesh position={[0, 0.012, 10]} receiveShadow>
        <boxGeometry args={[11.2, 0.04, 148]} />
        <meshStandardMaterial color="#30343b" roughness={roadRoughness} metalness={roadMetalness} />
      </mesh>
      {/* Jl. Melati Perumahan (z=48) */}
      <mesh position={[-12, 0.011, 48]} receiveShadow>
        <boxGeometry args={[124, 0.04, 7.6]} />
        <meshStandardMaterial color="#3a3e45" roughness={roadRoughness} metalness={roadMetalness} />
      </mesh>
      {/* Jl. Stasiun Timur (x=64) */}
      <mesh position={[64, 0.011, 0]} receiveShadow>
        <boxGeometry args={[9.4, 0.04, 128]} />
        <meshStandardMaterial color="#33373f" roughness={roadRoughness} metalness={roadMetalness} />
      </mesh>

      {/* Marka Jalan Putih Sederhana */}
      {[-30, -18, 16, 30, 44].map((x) => (
        <mesh key={`mkx-${x}`} position={[x, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 0.28]} />
          <meshBasicMaterial color="#d8d4c8" />
        </mesh>
      ))}
      {[-34, -18, 18, 34].map((z) => (
        <mesh key={`mkz-${z}`} position={[0, 0.04, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.28, 5.5]} />
          <meshBasicMaterial color="#d8d4c8" />
        </mesh>
      ))}

      {/* === SUNGAI KOTA & DANAU SENJA === */}
      <mesh position={[-48, -0.22, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15.6, 200]} />
        <meshStandardMaterial
          ref={waterRef}
          color={timeOfDay === 'sunset' ? '#7b6c7a' : timeOfDay === 'night' ? '#17263d' : '#3a6f8c'}
          roughness={0.18}
          metalness={0.45}
        />
      </mesh>
      {/* Tanggul Sungai */}
      <mesh position={[-56.2, -0.05, 10]}>
        <boxGeometry args={[1.0, 0.5, 200]} />
        <meshStandardMaterial color="#7b7873" roughness={0.9} />
      </mesh>
      <mesh position={[-39.8, -0.05, 10]}>
        <boxGeometry args={[1.0, 0.5, 200]} />
        <meshStandardMaterial color="#7b7873" roughness={0.9} />
      </mesh>

      {/* Danau Senja di Taman Kota */}
      <mesh position={[-84, -0.14, -28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 30]} />
        <meshStandardMaterial
          color={timeOfDay === 'sunset' ? '#9c7873' : timeOfDay === 'night' ? '#1a2c47' : '#3f7c99'}
          roughness={0.14}
          metalness={0.5}
        />
      </mesh>
      {/* Dermaga Kayu Danau Senja */}
      <mesh position={[-73, 0.06, -28]} receiveShadow castShadow>
        <boxGeometry args={[9.5, 0.16, 4.4]} />
        <meshStandardMaterial color="#7e5b3e" roughness={0.85} />
      </mesh>
      {/* Bangku Taman Kota */}
      {[
        [-68, 0.4, -18, 0.3],
        [-78, 0.4, -8.5, 0],
        [-69.5, 0.4, -14.2, -0.2],
      ].map(([bx, by, bz, rot], idx) => (
        <group key={`bench-${idx}`} position={[bx, by, bz]} rotation={[0, rot, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.15, 0.7]} />
            <meshStandardMaterial color="#7b5538" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.35, -0.28]} castShadow>
            <boxGeometry args={[2.2, 0.45, 0.1]} />
            <meshStandardMaterial color="#7b5538" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* === JEMBATAN TEPI SUNGAI (UTAMA & PEJALAN KAKI SELATAN) === */}
      <group position={[-48, 0.14, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[19.5, 0.24, 13.6]} />
          <meshStandardMaterial color="#51565e" roughness={roadRoughness} metalness={roadMetalness} />
        </mesh>
        {/* Pagar Besi Jembatan Utara & Selatan */}
        <mesh position={[0, 0.72, -6.5]} castShadow>
          <boxGeometry args={[19.5, 0.95, 0.22]} />
          <meshStandardMaterial color="#38404c" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.72, 6.5]} castShadow>
          <boxGeometry args={[19.5, 0.95, 0.22]} />
          <meshStandardMaterial color="#38404c" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Lengkungan / Pilar Dekoratif Jembatan */}
        {[-7, 0, 7].map((px) => (
          <React.Fragment key={`bp-${px}`}>
            <mesh position={[px, 1.4, -6.5]} castShadow>
              <boxGeometry args={[0.35, 2.2, 0.35]} />
              <meshStandardMaterial color="#3d4654" />
            </mesh>
            <mesh position={[px, 1.4, 6.5]} castShadow>
              <boxGeometry args={[0.35, 2.2, 0.35]} />
              <meshStandardMaterial color="#3d4654" />
            </mesh>
          </React.Fragment>
        ))}
      </group>
      {/* Jembatan Perumahan Selatan (z=48) */}
      <group position={[-48, 0.14, 48]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[19.2, 0.24, 7.6]} />
          <meshStandardMaterial color="#68645d" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.6, -3.6]}>
          <boxGeometry args={[19.2, 0.85, 0.18]} />
          <meshStandardMaterial color="#4c4842" />
        </mesh>
        <mesh position={[0, 0.6, 3.6]}>
          <boxGeometry args={[19.2, 0.85, 0.18]} />
          <meshStandardMaterial color="#4c4842" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 1. RUMAH KELUARGA DAMAR (INTERIOR WALKABLE + HALAMAN DEPAN)  */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Lantai Kayu Hangat Interior */}
        <mesh position={[-20, 0.04, 68]} receiveShadow>
          <boxGeometry args={[14.2, 0.08, 12.2]} />
          <meshStandardMaterial color="#9c7552" roughness={0.78} />
        </mesh>
        {/* Dinding Belakang, Kiri, Kanan, dan Depan (dengan pintu masuk lebar x:-21.6..-18.4) */}
        <mesh position={[-20, 2.0, 74]} castShadow receiveShadow>
          <boxGeometry args={[14.2, 4.0, 0.4]} />
          <meshStandardMaterial color="#ede4d5" roughness={0.9} />
        </mesh>
        <mesh position={[-27, 2.0, 68]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 4.0, 12.2]} />
          <meshStandardMaterial color="#e8decb" roughness={0.9} />
        </mesh>
        <mesh position={[-13, 2.0, 68]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 4.0, 12.2]} />
          <meshStandardMaterial color="#e8decb" roughness={0.9} />
        </mesh>
        <mesh position={[-24.4, 2.0, 62]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 4.0, 0.4]} />
          <meshStandardMaterial color="#f2eadc" roughness={0.88} />
        </mesh>
        <mesh position={[-15.6, 2.0, 62]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 4.0, 0.4]} />
          <meshStandardMaterial color="#f2eadc" roughness={0.88} />
        </mesh>
        {/* Balok Pintu Depan & Atap Teras Tinggi (tidak menghalangi kamera) */}
        <mesh position={[-20, 3.6, 62]} castShadow>
          <boxGeometry args={[3.6, 0.8, 0.45]} />
          <meshStandardMaterial color="#73533b" />
        </mesh>
        {/* Atap Pelana Terbuka di sisi kamera belakang agar interior terang & lapang */}
        <mesh position={[-20, 4.2, 68]} castShadow>
          <boxGeometry args={[15.2, 0.35, 13.0]} />
          <meshStandardMaterial color="#8c4c38" roughness={0.82} transparent opacity={0.92} />
        </mesh>
        {/* Lampu Ruang Makan Hangat */}
        <pointLight position={[-18.5, 3.4, 66.5]} color="#ffd38c" intensity={11} distance={15} decay={1.6} />

        {/* Meja Makan & Kursi */}
        <mesh position={[-17.5, 0.82, 65.9]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.12, 1.4]} />
          <meshStandardMaterial color="#6e4a32" roughness={0.7} />
        </mesh>
        <mesh position={[-17.5, 0.42, 65.9]}>
          <boxGeometry args={[2.1, 0.75, 0.9]} />
          <meshStandardMaterial color="#583a26" roughness={0.8} />
        </mesh>
        {/* Meja Kerja Damar di sudut kiri belakang */}
        <mesh position={[-25.0, 0.8, 72.1]} castShadow>
          <boxGeometry args={[2.2, 0.12, 1.0]} />
          <meshStandardMaterial color="#5c4230" roughness={0.75} />
        </mesh>
        {/* Kulkas di sudut dapur kanan belakang */}
        <mesh position={[-14.5, 1.1, 72.4]} castShadow>
          <boxGeometry args={[1.1, 2.1, 1.0]} />
          <meshStandardMaterial color="#dfe6ea" roughness={0.4} />
        </mesh>
        {/* Sofa Ruang Tamu */}
        <mesh position={[-24.2, 0.55, 65.6]} castShadow>
          <boxGeometry args={[1.2, 0.75, 2.8]} />
          <meshStandardMaterial color="#5e726b" roughness={0.9} />
        </mesh>
        {/* Pagar Depan Rumah & Jalur Masuk */}
        <mesh position={[-20, 0.02, 58]} receiveShadow>
          <boxGeometry args={[3.4, 0.04, 8.2]} />
          <meshStandardMaterial color="#b9b1a5" roughness={0.9} />
        </mesh>
        <mesh position={[-24.6, 0.55, 54]} castShadow>
          <boxGeometry args={[5.2, 1.1, 0.25]} />
          <meshStandardMaterial color="#c9bfb0" />
        </mesh>
        <mesh position={[-15.4, 0.55, 54]} castShadow>
          <boxGeometry args={[5.2, 1.1, 0.25]} />
          <meshStandardMaterial color="#c9bfb0" />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. KAWASAN PERUMAHAN MELATI (TERMASUK RUMAH BU WATI)         */}
      {/* ============================================================ */}
      {[
        { x: -0.5, z: 71.5, w: 10.5, d: 10.5, h: 4.5, wall: '#e4d5c3', roof: '#7d4a3a', isWati: false },
        { x: 15.5, z: 71.0, w: 10.5, d: 11.0, h: 4.8, wall: '#d8ddd4', roof: '#4a5562', isWati: false },
        { x: 31.0, z: 71.0, w: 11.2, d: 11.0, h: 4.6, wall: '#e8d8c8', roof: '#854e3c', isWati: true },
      ].map((h, i) => (
        <group key={`neigh-${i}`} position={[h.x, 0, h.z]}>
          <mesh position={[0, h.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[h.w, h.h, h.d]} />
            <meshStandardMaterial color={h.wall} roughness={0.88} />
          </mesh>
          <mesh position={[0, h.h + 1.1, 0]} castShadow>
            <coneGeometry args={[h.w * 0.76, 2.4, 4]} />
            <meshStandardMaterial color={h.roof} roughness={0.85} />
          </mesh>
          {/* Jendela Rumah Tetangga */}
          <mesh position={[-2.2, 2.1, -h.d / 2 - 0.04]}>
            <planeGeometry args={[2.2, 1.5]} />
            <meshStandardMaterial
              color="#ffe2a8"
              emissive={windowEmissive}
              emissiveIntensity={windowEmissiveInt}
            />
          </mesh>
          <mesh position={[2.2, 2.1, -h.d / 2 - 0.04]}>
            <planeGeometry args={[2.2, 1.5]} />
            <meshStandardMaterial
              color="#ffe2a8"
              emissive={windowEmissive}
              emissiveIntensity={windowEmissiveInt}
            />
          </mesh>
        </group>
      ))}
      {/* Lampu Teras Bu Wati (menyala terang setelah Misi Sampingan selesai!) */}
      <mesh position={[24.0, 2.8, 64.9]}>
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshStandardMaterial
          color={buWatiLampFixed ? '#ffe49e' : '#5e5c57'}
          emissive={buWatiLampFixed ? '#ffba52' : '#000000'}
          emissiveIntensity={buWatiLampFixed ? 2.8 : 0}
        />
      </mesh>
      {buWatiLampFixed && (
        <pointLight position={[24.0, 2.7, 64.2]} color="#ffc76b" intensity={12} distance={15} decay={1.8} />
      )}

      {/* ============================================================ */}
      {/* 3. KEDAI KOPI SUDUT (BIMA) — INTERIOR & TERAS WALKABLE       */}
      {/* ============================================================ */}
      <group>
        <mesh position={[-20, 0.04, 20.5]} receiveShadow>
          <boxGeometry args={[16.2, 0.08, 13.4]} />
          <meshStandardMaterial color="#7d583c" roughness={0.76} />
        </mesh>
        {/* Dinding Kayu & Bata Hangat */}
        <mesh position={[-20, 2.2, 27.1]} castShadow receiveShadow>
          <boxGeometry args={[16.2, 4.4, 0.45]} />
          <meshStandardMaterial color="#594032" roughness={0.86} />
        </mesh>
        <mesh position={[-27.9, 2.2, 20.5]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 4.4, 13.4]} />
          <meshStandardMaterial color="#674938" roughness={0.86} />
        </mesh>
        <mesh position={[-12.4, 2.2, 20.5]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 4.4, 13.4]} />
          <meshStandardMaterial color="#674938" roughness={0.86} />
        </mesh>
        {/* Kanopi Atap Kedai Kopi */}
        <mesh position={[-20, 4.5, 20.5]} castShadow>
          <boxGeometry args={[17.2, 0.35, 14.4]} />
          <meshStandardMaterial color="#2f2a27" roughness={0.8} />
        </mesh>
        {/* Papan Nama Hangat "KOPI SUDUT" */}
        <mesh position={[-20, 4.95, 13.4]}>
          <boxGeometry args={[6.8, 1.0, 0.25]} />
          <meshStandardMaterial
            color="#3b2b22"
            emissive="#ffaa4c"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.1}
          />
        </mesh>
        {/* Meja Bar Espresso Bima */}
        <mesh position={[-21, 0.65, 22.6]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 1.15, 1.3]} />
          <meshStandardMaterial color="#422f23" roughness={0.7} />
        </mesh>
        {/* Mesin Espresso & Lampu Gantung String Lights */}
        <mesh position={[-22.2, 1.5, 22.6]} castShadow>
          <boxGeometry args={[1.1, 0.65, 0.7]} />
          <meshStandardMaterial color="#c4c8cc" metalness={0.7} roughness={0.25} />
        </mesh>
        {[-25, -22, -19, -16, -14].map((lx) => (
          <mesh key={`sl-${lx}`} position={[lx, 3.65, 16.5]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#ffe5a3" emissive="#ffb84d" emissiveIntensity={2.0} />
          </mesh>
        ))}
        {/* Gitar Akustik Dekorasi di Dinding Kafe */}
        <mesh position={[-15.2, 2.3, 26.75]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.55, 1.35, 0.14]} />
          <meshStandardMaterial color="#b4713a" roughness={0.55} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 4. KIOS 24 JAM HARMONI (MINIMARKET SUDUT)                    */}
      {/* ============================================================ */}
      <group>
        <mesh position={[24.5, 2.3, 23]} castShadow receiveShadow>
          <boxGeometry args={[13.8, 4.6, 10.8]} />
          <meshStandardMaterial color="#eef1f3" roughness={0.8} />
        </mesh>
        {/* Garis Identitas Minimarket Modern */}
        <mesh position={[24.5, 4.35, 17.55]}>
          <boxGeometry args={[14.0, 0.65, 0.18]} />
          <meshStandardMaterial color="#2f8572" emissive="#2f8572" emissiveIntensity={isEveningOrNight ? 0.8 : 0.1} />
        </mesh>
        <mesh position={[24.5, 3.85, 17.55]}>
          <boxGeometry args={[14.0, 0.3, 0.18]} />
          <meshStandardMaterial color="#e08938" emissive="#e08938" emissiveIntensity={isEveningOrNight ? 0.9 : 0.15} />
        </mesh>
        {/* Jendela Kaca Terang */}
        <mesh position={[24.5, 1.8, 17.52]}>
          <planeGeometry args={[10.5, 2.6]} />
          <meshStandardMaterial
            color="#e7f5ff"
            emissive="#cceeff"
            emissiveIntensity={isEveningOrNight ? 0.95 : 0.25}
          />
        </mesh>
        {/* Meja Teras Plastik Minimarket */}
        <mesh position={[20.5, 0.72, 14.2]} castShadow>
          <boxGeometry args={[1.4, 0.1, 1.0]} />
          <meshStandardMaterial color="#d8dde2" roughness={0.6} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. TOKO MUSIK & BARANG ANTIK "NADA LAMA"                     */}
      {/* ============================================================ */}
      <group>
        <mesh position={[-22, 2.5, -25.5]} castShadow receiveShadow>
          <boxGeometry args={[14.8, 5.0, 11.8]} />
          <meshStandardMaterial color="#875a45" roughness={0.86} />
        </mesh>
        {/* Kanopi Bergaris Vintage */}
        <mesh position={[-22, 3.6, -18.8]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[13.6, 0.22, 2.4]} />
          <meshStandardMaterial color="#9e3d35" roughness={0.85} />
        </mesh>
        {/* Etalase Kaca Hangat */}
        <mesh position={[-22, 1.7, -19.52]}>
          <planeGeometry args={[11.2, 2.5]} />
          <meshStandardMaterial
            color="#ffdfad"
            emissive="#ffb45c"
            emissiveIntensity={isEveningOrNight ? 1.1 : 0.28}
          />
        </mesh>
        {/* Dinding Gang Sempit Belakang (Grafiti) */}
        <mesh position={[-31.2, 1.8, -25]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.2, 2.2]} />
          <meshStandardMaterial color="#4b4744" roughness={0.95} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 6 & 7. MENARA NUSANTARA (KANTOR + ROOFTOP Y=22 PLAYABLE)     */}
      {/* ============================================================ */}
      <group>
        {/* Lantai Lobi Terbuka (z=-26..-19) */}
        <mesh position={[29, 0.04, -22.5]} receiveShadow>
          <boxGeometry args={[24.5, 0.08, 7.2]} />
          <meshStandardMaterial color="#c8ced6" roughness={0.38} metalness={0.1} />
        </mesh>
        {/* Pilar Lobi */}
        <mesh position={[17.2, 2.8, -22.5]} castShadow>
          <boxGeometry args={[1.4, 5.6, 6.2]} />
          <meshStandardMaterial color="#4c5766" roughness={0.6} />
        </mesh>
        <mesh position={[40.8, 2.8, -22.5]} castShadow>
          <boxGeometry args={[1.4, 5.6, 6.2]} />
          <meshStandardMaterial color="#4c5766" roughness={0.6} />
        </mesh>
        {/* Inti Menara Kaca 22 Meter */}
        <mesh position={[29, 11.0, -34.6]} castShadow receiveShadow>
          <boxGeometry args={[24.6, 22.0, 17.5]} />
          <meshStandardMaterial color="#344559" roughness={0.32} metalness={0.48} />
        </mesh>
        {/* Bagian Kanopi atas Lobi yang menyatu ke Rooftop (y=5.6..22) */}
        <mesh position={[29, 13.8, -22.5]} castShadow receiveShadow>
          <boxGeometry args={[24.6, 16.4, 6.8]} />
          <meshStandardMaterial color="#3b4d63" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Garis Jendela Bertingkat Menara Nusantara */}
        {[8, 11.5, 15, 18.5].map((wy) => (
          <mesh key={`ow-${wy}`} position={[29, wy, -19.04]}>
            <planeGeometry args={[21.5, 1.5]} />
            <meshStandardMaterial
              color="#cce0f5"
              emissive={windowEmissive}
              emissiveIntensity={windowEmissiveInt * 0.9}
            />
          </mesh>
        ))}
        {/* Pintu Lift Lobi */}
        <mesh position={[19.5, 1.6, -25.6]}>
          <boxGeometry args={[2.0, 3.0, 0.25]} />
          <meshStandardMaterial
            color="#a3b0be"
            metalness={0.7}
            roughness={0.25}
            emissive="#f6d17a"
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Meja Kerja di sudut Lobi (Sticky Note EE) */}
        <mesh position={[34.2, 0.82, -23.4]} castShadow>
          <boxGeometry args={[2.2, 0.12, 1.1]} />
          <meshStandardMaterial color="#d4d9df" roughness={0.5} />
        </mesh>

        {/* === DEK ROOFTOP (Y = 22) === */}
        <group position={[0, 22, 0]}>
          <mesh position={[28.8, -0.1, -32]} receiveShadow>
            <boxGeometry args={[23.6, 0.2, 22.8]} />
            <meshStandardMaterial color="#4b5058" roughness={0.85} />
          </mesh>
          {/* Pagar Kaca Pengaman 4 Sisi */}
          <mesh position={[28.8, 0.65, -20.8]}>
            <boxGeometry args={[23.6, 1.25, 0.16]} />
            <meshStandardMaterial color="#9cc0dc" transparent opacity={0.45} roughness={0.15} />
          </mesh>
          <mesh position={[28.8, 0.65, -43.2]}>
            <boxGeometry args={[23.6, 1.25, 0.16]} />
            <meshStandardMaterial color="#9cc0dc" transparent opacity={0.45} roughness={0.15} />
          </mesh>
          <mesh position={[17.1, 0.65, -32]}>
            <boxGeometry args={[0.16, 1.25, 22.6]} />
            <meshStandardMaterial color="#9cc0dc" transparent opacity={0.45} roughness={0.15} />
          </mesh>
          <mesh position={[40.5, 0.65, -32]}>
            <boxGeometry args={[0.16, 1.25, 22.6]} />
            <meshStandardMaterial color="#9cc0dc" transparent opacity={0.45} roughness={0.15} />
          </mesh>
          {/* Kabin Lift Rooftop */}
          <mesh position={[19.8, 1.8, -25.4]} castShadow>
            <boxGeometry args={[3.4, 3.6, 3.2]} />
            <meshStandardMaterial color="#3c4654" roughness={0.65} />
          </mesh>
          {/* Bangku Santai Rooftop & Lampu Kecil */}
          <mesh position={[28.5, 0.42, -23.0]} castShadow>
            <boxGeometry args={[3.2, 0.16, 0.85]} />
            <meshStandardMaterial color="#7d593e" roughness={0.82} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 8. STASIUN KERETA TUA SENJA                                  */}
      {/* ============================================================ */}
      <group>
        {/* Peron Beton */}
        <mesh position={[80.5, 0.05, -4]} receiveShadow>
          <boxGeometry args={[16.5, 0.12, 42]} />
          <meshStandardMaterial color="#a6a198" roughness={0.88} />
        </mesh>
        {/* Atap Kanopi Heritage */}
        <mesh position={[81.5, 4.4, -4]} castShadow>
          <boxGeometry args={[11.5, 0.35, 34]} />
          <meshStandardMaterial color="#6e3f32" roughness={0.85} />
        </mesh>
        {/* Tiang Penyangga Kanopi */}
        {[-16, -6, 4, 14].map((tz) => (
          <mesh key={`st-${tz}`} position={[81.5, 2.2, tz]} castShadow>
            <cylinderGeometry args={[0.2, 0.24, 4.4, 8]} />
            <meshStandardMaterial color="#4f4944" />
          </mesh>
        ))}
        {/* Ruang Tiket Lama */}
        <mesh position={[76, 2.2, -18]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 4.4, 11.5]} />
          <meshStandardMaterial color="#e0d6c2" roughness={0.88} />
        </mesh>
        {/* Lapak Buku Pak Darman */}
        <mesh position={[75.8, 0.55, -2.5]} castShadow>
          <boxGeometry args={[2.6, 0.9, 1.4]} />
          <meshStandardMaterial color="#704d34" roughness={0.85} />
        </mesh>
        {/* Rel Kereta Api */}
        <mesh position={[93.2, 0.04, 0]}>
          <boxGeometry args={[0.22, 0.12, 180]} />
          <meshStandardMaterial color="#585a5e" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[95.4, 0.04, 0]}>
          <boxGeometry args={[0.22, 0.12, 180]} />
          <meshStandardMaterial color="#585a5e" metalness={0.65} roughness={0.45} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* GEDUNG KOTA SILUET MODERN SEKITAR (ATMOSFER KOTA HIDUP)      */}
      {/* ============================================================ */}
      {[
        { x: 51, z: -33, w: 9.5, d: 21, h: 16, col: '#4e5968' },
        { x: 46, z: 25, w: 15, d: 17, h: 12, col: '#69625d' },
        { x: -21, z: -47, w: 14, d: 13, h: 14, col: '#5a6069' },
        { x: -5, z: -54, w: 13, d: 12, h: 18, col: '#475363' },
        { x: 64, z: -54, w: 16, d: 14, h: 15, col: '#565c66' },
        { x: 60, z: 54, w: 14, d: 18, h: 10, col: '#786e66' },
      ].map((b, idx) => (
        <group key={`bg-${idx}`} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.col} roughness={0.78} />
          </mesh>
          {/* Jendela berpendar lembut saat senja & malam */}
          {isEveningOrNight && (
            <mesh position={[0, 1.2, b.d / 2 + 0.05]}>
              <planeGeometry args={[b.w * 0.72, b.h * 0.55]} />
              <meshStandardMaterial
                color="#ffdf9e"
                emissive="#ffb85c"
                emissiveIntensity={timeOfDay === 'night' ? 0.65 : 0.35}
                transparent
                opacity={0.72}
              />
            </mesh>
          )}
        </group>
      ))}

      <SwayingTrees />
      <StreetLamps lit={isEveningOrNight} />
    </group>
  );
};
