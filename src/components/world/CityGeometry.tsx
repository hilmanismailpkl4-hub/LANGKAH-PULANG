import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';
import { WaterSurface } from './WaterSurface';

interface CityGeometryProps {
  timeOfDay: TimeOfDay;
  buWatiLampFixed: boolean;
  settings: GameSettings;
}

const TREE_POSITIONS: [number, number, number, number][] = [
  [-65, 0, -4, 1.15],
  [-74, 0, -4, 1.3],
  [-86, 0, -6, 1.15],
  [-98, 0, -14, 1.35],
  [-102, 0, -28, 1.25],
  [-99, 0, -44, 1.3],
  [-84, 0, -49, 1.2],
  [-68, 0, -45, 1.15],
  [-63, 0, -34, 1.1],
  [-64, 0, -16, 1.1],
  [-74, 0, 12, 1.25],
  [-90, 0, 10, 1.3],
  [-66, 0, 28, 1.15],
  [-78, 0, 38, 1.25],
  [-31, 0, 56, 1.05],
  [-10, 0, 56, 1.12],
  [5, 0, 56, 1.02],
  [21, 0, 56, 1.15],
  [39, 0, 58, 1.22],
  [-28, 0, 79, 1.2],
  [-8, 0, 81, 1.15],
  [16, 0, 81, 1.12],
  [-36, 0, -14, 1.08],
  [-36, 0, 16, 1.08],
  [-36, 0, 32, 1.12],
  [-10, 0, -11, 0.98],
  [11, 0, -11, 0.98],
  [11, 0, 11, 0.98],
  [-11, 0, 36, 1.05],
  [11, 0, 36, 1.05],
  [54, 0, -10, 1.08],
  [54, 0, 14, 1.08],
  [70, 0, 22, 1.12],
  [72, 0, -32, 1.25],
];

const LAMP_POSITIONS: [number, number, number][] = [
  [-56, 0, -7],
  [-48, 0.24, -7],
  [-40, 0, -7],
  [-56, 0, 7],
  [-48, 0.24, 7],
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

/**
 * Pepohonan tropis berlapis (batang meruncing + 3 kanopi daun organik berbeda nuansa hijau).
 */
const SwayingTrees: React.FC = () => {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const crownARef = useRef<THREE.InstancedMesh>(null);
  const crownBRef = useRef<THREE.InstancedMesh>(null);
  const crownCRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  React.useEffect(() => {
    if (!trunkRef.current) return;
    TREE_POSITIONS.forEach(([x, y, z, s], i) => {
      dummy.position.set(x, y + 1.65 * s, z);
      dummy.rotation.set(0, i * 0.8, 0);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(i, dummy.matrix);
    });
    trunkRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    const cA = crownARef.current;
    const cB = crownBRef.current;
    const cC = crownCRef.current;
    if (!cA || !cB || !cC) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < TREE_POSITIONS.length; i++) {
      const [x, y, z, s] = TREE_POSITIONS[i];
      const sway = Math.sin(t * 1.15 + i * 0.85) * 0.055;

      dummy.position.set(x + sway * 1.6, y + 3.85 * s, z);
      dummy.rotation.set(sway * 0.5, i * 0.7, sway);
      dummy.scale.set(s * 1.25, s * 0.92, s * 1.25);
      dummy.updateMatrix();
      cA.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x + 0.95 * s + sway * 1.8, y + 3.2 * s, z + 0.65 * s);
      dummy.scale.set(s * 0.88, s * 0.72, s * 0.88);
      dummy.updateMatrix();
      cB.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x - 0.85 * s + sway * 1.7, y + 3.35 * s, z - 0.55 * s);
      dummy.scale.set(s * 0.82, s * 0.68, s * 0.82);
      dummy.updateMatrix();
      cC.setMatrixAt(i, dummy.matrix);
    }
    cA.instanceMatrix.needsUpdate = true;
    cB.instanceMatrix.needsUpdate = true;
    cC.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.34, 3.3, 8]} />
        <meshStandardMaterial color="#59402e" roughness={0.94} />
      </instancedMesh>
      <instancedMesh ref={crownARef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.65, 1]} />
        <meshStandardMaterial color="#3c6640" roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={crownBRef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.38, 1]} />
        <meshStandardMaterial color="#4e7d4b" roughness={0.82} />
      </instancedMesh>
      <instancedMesh ref={crownCRef} args={[undefined, undefined, TREE_POSITIONS.length]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.28, 1]} />
        <meshStandardMaterial color="#2f5436" roughness={0.88} />
      </instancedMesh>
    </>
  );
};

const StreetLamps: React.FC<{ lit: boolean; glow: boolean }> = ({ lit, glow }) => {
  const poleRef = useRef<THREE.InstancedMesh>(null);
  const armRef = useRef<THREE.InstancedMesh>(null);
  const bulbRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const textures = useMemo(() => getProceduralTextures(), []);

  React.useEffect(() => {
    if (!poleRef.current || !armRef.current || !bulbRef.current) return;
    LAMP_POSITIONS.forEach(([x, y, z], i) => {
      dummy.position.set(x, y + 2.85, z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      poleRef.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 5.65, z);
      dummy.updateMatrix();
      armRef.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y + 5.45, z);
      dummy.updateMatrix();
      bulbRef.current!.setMatrixAt(i, dummy.matrix);
    });
    poleRef.current.instanceMatrix.needsUpdate = true;
    armRef.current.instanceMatrix.needsUpdate = true;
    bulbRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <>
      <instancedMesh ref={poleRef} args={[undefined, undefined, LAMP_POSITIONS.length]} castShadow>
        <cylinderGeometry args={[0.07, 0.13, 5.7, 8]} />
        <meshStandardMaterial color="#252b34" metalness={0.55} roughness={0.45} />
      </instancedMesh>
      <instancedMesh ref={armRef} args={[undefined, undefined, LAMP_POSITIONS.length]}>
        <boxGeometry args={[0.95, 0.14, 0.34]} />
        <meshStandardMaterial color="#2f3642" metalness={0.6} roughness={0.4} />
      </instancedMesh>
      <instancedMesh ref={bulbRef} args={[undefined, undefined, LAMP_POSITIONS.length]}>
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshStandardMaterial
          color={lit ? '#ffebb8' : '#d2d8e0'}
          emissive={lit ? '#ffae42' : '#000000'}
          emissiveIntensity={lit ? 2.8 : 0}
        />
      </instancedMesh>

      {/* Halo Cahaya Sinematik pada tiap lampu jalan */}
      {lit && glow &&
        LAMP_POSITIONS.map(([x, y, z], i) => (
          <sprite key={`lg-${i}`} position={[x, y + 5.45, z]} scale={[4.4, 4.4, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc26e"
              transparent
              opacity={0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}

      {lit && (
        <>
          <pointLight position={[-48, 5.6, 0]} color="#ffbe6b" intensity={20} distance={30} decay={1.7} />
          <pointLight position={[-20, 4.8, 18]} color="#ffc47a" intensity={18} distance={26} decay={1.7} />
          <pointLight position={[24, 5.2, 16]} color="#e8f7ff" intensity={16} distance={24} decay={1.7} />
          <pointLight position={[27, 5.2, -22]} color="#dce8ff" intensity={18} distance={26} decay={1.7} />
          <pointLight position={[-20, 4.4, 65]} color="#ffcf85" intensity={16} distance={24} decay={1.7} />
          <pointLight position={[78, 5.2, -4]} color="#ffc67d" intensity={16} distance={24} decay={1.7} />
          <pointLight position={[-70, 5.2, -18]} color="#ffbe72" intensity={16} distance={24} decay={1.7} />
          <pointLight position={[28, 25.5, -31]} color="#ffd591" intensity={20} distance={30} decay={1.6} />
        </>
      )}
    </>
  );
};

/**
 * Model 3D Gitar Akustik Detail (dinding kafe & etalase toko musik)
 */
const DetailedGuitar: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, -0.22, 0]} castShadow>
      <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
      <meshStandardMaterial color="#b36c34" roughness={0.42} />
    </mesh>
    <mesh position={[0, 0.04, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
      <meshStandardMaterial color="#b36c34" roughness={0.42} />
    </mesh>
    <mesh position={[0, -0.04, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.065, 14]} />
      <meshBasicMaterial color="#23140b" />
    </mesh>
    <mesh position={[0, 0.45, 0.01]} castShadow>
      <boxGeometry args={[0.065, 0.65, 0.05]} />
      <meshStandardMaterial color="#3c2618" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.82, 0.01]}>
      <boxGeometry args={[0.1, 0.16, 0.05]} />
      <meshStandardMaterial color="#2c1c12" roughness={0.5} />
    </mesh>
  </group>
);

export const CityGeometry: React.FC<CityGeometryProps> = ({ timeOfDay, buWatiLampFixed, settings }) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const isEveningOrNight = timeOfDay === 'sunset' || timeOfDay === 'rain_dusk' || timeOfDay === 'night';
  const isWet = timeOfDay === 'rain_dusk';

  const roadRoughness = isWet && settings.waterReflections ? 0.16 : isWet ? 0.34 : 0.82;
  const roadMetalness = isWet && settings.waterReflections ? 0.48 : isWet ? 0.25 : 0.06;
  const windowEmissive = isEveningOrNight ? '#ffcb7a' : '#7a9ab8';
  const windowEmissiveInt = timeOfDay === 'night' ? 1.45 : isEveningOrNight ? 0.85 : 0.06;

  // Animasi aliran riak air sungai & danau
  useFrame((_, delta) => {
    textures.waterBump.offset.y -= delta * 0.14;
    textures.waterBump.offset.x += delta * 0.035;
  });

  const waterColor =
    timeOfDay === 'sunset'
      ? '#8a686e'
      : timeOfDay === 'night'
        ? '#122238'
        : timeOfDay === 'rain_dusk'
          ? '#2a3c4f'
          : '#2f6f8f';

  return (
    <group>
      {/* === TANAH RUMPUT BERTEKSTUR ORGANIK === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[300, 280]} />
        <meshStandardMaterial map={textures.grass} roughness={0.94} />
      </mesh>

      {/* Trotoar Paving Block Area Kota */}
      <mesh position={[12, -0.01, -4]} receiveShadow>
        <boxGeometry args={[94, 0.05, 110]} />
        <meshStandardMaterial
          map={textures.paving}
          roughness={isWet ? 0.42 : 0.88}
          metalness={isWet ? 0.15 : 0.02}
        />
      </mesh>

      {/* === JALAN ASPAL BERTEKSTUR PBR === */}
      <mesh position={[-5, 0.015, 0]} receiveShadow>
        <boxGeometry args={[186, 0.05, 11.2]} />
        <meshStandardMaterial
          map={textures.asphalt}
          bumpMap={textures.asphaltBump}
          bumpScale={0.04}
          roughness={roadRoughness}
          metalness={roadMetalness}
        />
      </mesh>
      <mesh position={[0, 0.017, 10]} receiveShadow>
        <boxGeometry args={[11.2, 0.05, 148]} />
        <meshStandardMaterial
          map={textures.asphalt}
          bumpMap={textures.asphaltBump}
          bumpScale={0.04}
          roughness={roadRoughness}
          metalness={roadMetalness}
        />
      </mesh>
      <mesh position={[-12, 0.016, 48]} receiveShadow>
        <boxGeometry args={[124, 0.05, 7.6]} />
        <meshStandardMaterial
          map={textures.asphalt}
          bumpMap={textures.asphaltBump}
          bumpScale={0.035}
          roughness={roadRoughness}
          metalness={roadMetalness}
        />
      </mesh>
      <mesh position={[64, 0.016, 0]} receiveShadow>
        <boxGeometry args={[9.4, 0.05, 128]} />
        <meshStandardMaterial
          map={textures.asphalt}
          bumpMap={textures.asphaltBump}
          bumpScale={0.035}
          roughness={roadRoughness}
          metalness={roadMetalness}
        />
      </mesh>

      {/* Marka Jalan & Zebra Cross */}
      {[-30, -18, 16, 30, 44].map((x) => (
        <mesh key={`mkx-${x}`} position={[x, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 0.24]} />
          <meshBasicMaterial color="#e0dbd0" />
        </mesh>
      ))}
      {[-34, -18, 18, 34].map((z) => (
        <mesh key={`mkz-${z}`} position={[0, 0.045, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.24, 5.5]} />
          <meshBasicMaterial color="#e0dbd0" />
        </mesh>
      ))}
      {/* Zebra Cross Persimpangan Utama */}
      {[-3.6, -2.1, -0.6, 0.9, 2.4, 3.9].map((offset, i) => (
        <React.Fragment key={`zc-${i}`}>
          <mesh position={[offset, 0.046, 7.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.7, 2.2]} />
            <meshBasicMaterial color="#e6e2d8" />
          </mesh>
          <mesh position={[offset, 0.046, -7.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.7, 2.2]} />
            <meshBasicMaterial color="#e6e2d8" />
          </mesh>
        </React.Fragment>
      ))}

      {/* === SUNGAI KOTA & DANAU SENJA BERIAK SHADER FRESNEL === */}
      <WaterSurface
        position={[-48, -0.22, 10]}
        size={[15.8, 210]}
        timeOfDay={timeOfDay}
        highQuality={settings.waterReflections}
      />
      <mesh position={[-56.2, -0.02, 10]} receiveShadow>
        <boxGeometry args={[1.1, 0.58, 210]} />
        <meshStandardMaterial map={textures.paving} roughness={0.85} />
      </mesh>
      <mesh position={[-39.8, -0.02, 10]} receiveShadow>
        <boxGeometry args={[1.1, 0.58, 210]} />
        <meshStandardMaterial map={textures.paving} roughness={0.85} />
      </mesh>

      {/* Danau Senja */}
      <WaterSurface
        position={[-84, -0.14, -28]}
        size={[28, 30]}
        timeOfDay={timeOfDay}
        highQuality={settings.waterReflections}
      />
      {/* Dermaga Kayu & Tiang Lampu Dermaga */}
      <group>
        <mesh position={[-73, 0.07, -28]} receiveShadow castShadow>
          <boxGeometry args={[9.6, 0.18, 4.4]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
        </mesh>
        {[
          [-77.4, -26.1],
          [-77.4, -29.9],
          [-73.0, -26.1],
          [-73.0, -29.9],
        ].map(([px, pz], idx) => (
          <group key={`pier-p-${idx}`} position={[px, 0.45, pz]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.14, 1.15, 8]} />
              <meshStandardMaterial color="#4e3623" roughness={0.9} />
            </mesh>
            {isEveningOrNight && idx < 2 && (
              <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#ffe5a3" emissive="#ffb85c" emissiveIntensity={2.5} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Bangku Taman Kayu & Besi Tempa */}
      {[
        [-68, 0, -18, 0.3],
        [-78, 0, -8.5, 0],
        [-69.5, 0, -14.2, -0.2],
      ].map(([bx, by, bz, rot], idx) => (
        <group key={`bench-${idx}`} position={[bx, by, bz]} rotation={[0, rot, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.12, 0.68]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.78, -0.28]} rotation={[-0.15, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 0.42, 0.08]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
          </mesh>
          <mesh position={[-0.9, 0.22, 0]} castShadow>
            <boxGeometry args={[0.1, 0.44, 0.62]} />
            <meshStandardMaterial color="#252930" metalness={0.6} roughness={0.45} />
          </mesh>
          <mesh position={[0.9, 0.22, 0]} castShadow>
            <boxGeometry args={[0.1, 0.44, 0.62]} />
            <meshStandardMaterial color="#252930" metalness={0.6} roughness={0.45} />
          </mesh>
        </group>
      ))}

      {/* === JEMBATAN GANTUNG MODERN TEPI SUNGAI === */}
      <group position={[-48, 0.14, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[19.8, 0.26, 13.8]} />
          <meshStandardMaterial
            map={textures.asphalt}
            roughness={roadRoughness}
            metalness={roadMetalness}
          />
        </mesh>
        {/* Pagar Jembatan */}
        {[-6.6, 6.6].map((rz, idx) => (
          <group key={`rail-${idx}`} position={[0, 0.75, rz]}>
            <mesh castShadow>
              <boxGeometry args={[19.8, 0.14, 0.24]} />
              <meshStandardMaterial color="#3c4654" metalness={0.65} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <boxGeometry args={[19.8, 0.08, 0.16]} />
              <meshStandardMaterial color="#2d3540" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Menara Pylon Jembatan Gantung & Kabel Baja */}
        {[-6.8, 6.8].map((pz, pi) => (
          <group key={`pylon-${pi}`} position={[0, 0, pz]}>
            <mesh position={[-6.5, 5.2, 0]} castShadow>
              <boxGeometry args={[0.75, 10.4, 0.75]} />
              <meshStandardMaterial color="#d8dde4" roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh position={[6.5, 5.2, 0]} castShadow>
              <boxGeometry args={[0.75, 10.4, 0.75]} />
              <meshStandardMaterial color="#d8dde4" roughness={0.35} metalness={0.3} />
            </mesh>
            {/* Lampu Puncak Pylon */}
            {isEveningOrNight && (
              <>
                <mesh position={[-6.5, 10.55, 0]}>
                  <sphereGeometry args={[0.24, 10, 10]} />
                  <meshStandardMaterial color="#ffdf9e" emissive="#ffae42" emissiveIntensity={2.8} />
                </mesh>
                <mesh position={[6.5, 10.55, 0]}>
                  <sphereGeometry args={[0.24, 10, 10]} />
                  <meshStandardMaterial color="#ffdf9e" emissive="#ffae42" emissiveIntensity={2.8} />
                </mesh>
              </>
            )}
            {/* Kabel Baja Miring */}
            {[-2.2, 0, 2.2].map((cx, ci) => (
              <React.Fragment key={`cab-${ci}`}>
                <mesh position={[-3.2 + cx * 0.45, 5.2 - ci * 0.8, 0]} rotation={[0, 0, -0.62 - ci * 0.14]}>
                  <cylinderGeometry args={[0.04, 0.04, 8.6, 6]} />
                  <meshStandardMaterial color="#aeb6c2" metalness={0.75} roughness={0.25} />
                </mesh>
                <mesh position={[3.2 - cx * 0.45, 5.2 - ci * 0.8, 0]} rotation={[0, 0, 0.62 + ci * 0.14]}>
                  <cylinderGeometry args={[0.04, 0.04, 8.6, 6]} />
                  <meshStandardMaterial color="#aeb6c2" metalness={0.75} roughness={0.25} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        ))}
        {/* Palang Penghubung Atas Pylon */}
        <mesh position={[-6.5, 9.6, 0]} castShadow>
          <boxGeometry args={[0.6, 0.65, 14.2]} />
          <meshStandardMaterial color="#cdd4de" roughness={0.4} />
        </mesh>
        <mesh position={[6.5, 9.6, 0]} castShadow>
          <boxGeometry args={[0.6, 0.65, 14.2]} />
          <meshStandardMaterial color="#cdd4de" roughness={0.4} />
        </mesh>
      </group>

      {/* Jembatan Perumahan Selatan */}
      <group position={[-48, 0.14, 48]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[19.2, 0.24, 7.6]} />
          <meshStandardMaterial map={textures.paving} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.65, -3.6]} castShadow>
          <boxGeometry args={[19.2, 0.85, 0.2]} />
          <meshStandardMaterial color="#594a3f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 3.6]} castShadow>
          <boxGeometry args={[19.2, 0.85, 0.2]} />
          <meshStandardMaterial color="#594a3f" roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 1. RUMAH KELUARGA DAMAR (ARSITEKTUR TROPIS MODERN HANGAT)    */}
      {/* ============================================================ */}
      <group>
        <mesh position={[-20, 0.04, 68]} receiveShadow>
          <boxGeometry args={[14.2, 0.08, 12.2]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.68} />
        </mesh>
        {/* Dinding Stucco Hangat */}
        <mesh position={[-20, 2.05, 74]} castShadow receiveShadow>
          <boxGeometry args={[14.2, 4.1, 0.42]} />
          <meshStandardMaterial map={textures.stucco} roughness={0.88} />
        </mesh>
        <mesh position={[-27, 2.05, 68]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 4.1, 12.2]} />
          <meshStandardMaterial map={textures.stucco} roughness={0.88} />
        </mesh>
        <mesh position={[-13, 2.05, 68]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 4.1, 12.2]} />
          <meshStandardMaterial map={textures.stucco} roughness={0.88} />
        </mesh>
        <mesh position={[-24.4, 2.05, 62]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 4.1, 0.42]} />
          <meshStandardMaterial map={textures.stucco} roughness={0.88} />
        </mesh>
        <mesh position={[-15.6, 2.05, 62]} castShadow receiveShadow>
          <boxGeometry args={[5.2, 4.1, 0.42]} />
          <meshStandardMaterial map={textures.stucco} roughness={0.88} />
        </mesh>
        {/* Kusen Jendela Kayu & Kaca Depan Rumah */}
        {[-24.4, -15.6].map((wx) => (
          <group key={`hw-${wx}`} position={[wx, 2.0, 61.75]}>
            <mesh>
              <boxGeometry args={[2.5, 1.75, 0.14]} />
              <meshStandardMaterial color="#5c402c" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[2.2, 1.45]} />
              <meshStandardMaterial
                color="#fff0cc"
                emissive="#ffca78"
                emissiveIntensity={isEveningOrNight ? 1.15 : 0.18}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
        {/* Lis Plang Kayu & Atap Genteng Terakota */}
        <mesh position={[-20, 3.65, 62]} castShadow>
          <boxGeometry args={[3.8, 0.85, 0.48]} />
          <meshStandardMaterial color="#6e4b32" roughness={0.75} />
        </mesh>
        <mesh position={[-20, 4.25, 68]} castShadow>
          <boxGeometry args={[15.8, 0.32, 13.8]} />
          <meshStandardMaterial map={textures.roofTile} roughness={0.78} transparent opacity={0.93} />
        </mesh>
        <mesh position={[-20, 5.2, 68]} castShadow>
          <coneGeometry args={[9.8, 2.1, 4]} />
          <meshStandardMaterial map={textures.roofTile} roughness={0.78} transparent opacity={0.88} />
        </mesh>
        {/* Lampu Gantung Meja Makan Hangat */}
        <mesh position={[-17.5, 3.1, 65.9]}>
          <coneGeometry args={[0.38, 0.28, 12]} />
          <meshStandardMaterial color="#3b3029" roughness={0.6} />
        </mesh>
        <mesh position={[-17.5, 2.95, 65.9]}>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color="#fff1cc" emissive="#ffc66b" emissiveIntensity={2.6} />
        </mesh>
        <pointLight position={[-18.2, 3.1, 66.2]} color="#ffd594" intensity={15} distance={18} decay={1.6} />

        {/* Meja Makan, Kursi & Cangkir Kopi */}
        <mesh position={[-17.5, 0.84, 65.9]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.12, 1.45]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.55} />
        </mesh>
        {[-1.1, 1.1].map((lx) =>
          [-0.55, 0.55].map((lz) => (
            <mesh key={`leg-${lx}-${lz}`} position={[-17.5 + lx, 0.42, 65.9 + lz]} castShadow>
              <cylinderGeometry args={[0.055, 0.055, 0.82, 8]} />
              <meshStandardMaterial color="#4a3120" />
            </mesh>
          )),
        )}
        {/* Cangkir & Piring Sarapan */}
        <mesh position={[-17.1, 0.96, 65.8]}>
          <cylinderGeometry args={[0.08, 0.07, 0.14, 10]} />
          <meshStandardMaterial color="#f5efe6" roughness={0.3} />
        </mesh>
        <mesh position={[-18.0, 0.92, 65.7]}>
          <cylinderGeometry args={[0.24, 0.2, 0.04, 14]} />
          <meshStandardMaterial color="#f0ebe3" roughness={0.25} />
        </mesh>

        {/* Meja Kerja & Lampu Belajar Damar */}
        <mesh position={[-25.0, 0.8, 72.1]} castShadow>
          <boxGeometry args={[2.3, 0.12, 1.05]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.65} />
        </mesh>
        <mesh position={[-25.8, 1.18, 72.3]}>
          <coneGeometry args={[0.18, 0.2, 10]} />
          <meshStandardMaterial color="#2f5745" emissive="#ffd080" emissiveIntensity={0.4} />
        </mesh>
        {/* Kulkas + Foto/Gambar di Pintu */}
        <mesh position={[-14.5, 1.12, 72.4]} castShadow>
          <boxGeometry args={[1.12, 2.15, 1.02]} />
          <meshStandardMaterial color="#d8e0e6" metalness={0.35} roughness={0.3} />
        </mesh>
        {/* Sofa Ruang Tamu + Bantal */}
        <mesh position={[-24.2, 0.45, 65.6]} castShadow>
          <boxGeometry args={[1.2, 0.55, 2.9]} />
          <meshStandardMaterial color="#556b65" roughness={0.9} />
        </mesh>
        <mesh position={[-24.65, 0.92, 65.6]} castShadow>
          <boxGeometry args={[0.32, 0.65, 2.9]} />
          <meshStandardMaterial color="#4a5e59" roughness={0.9} />
        </mesh>

        {/* === SUDUT MEJA GAMBAR & MAINAN KIRA (RUMAH JL. MELATI NO. 14) === */}
        <group position={[-19.8, 0.08, 72.1]}>
          {/* Karpet Bulat Pastel Lembut */}
          <mesh position={[0, 0.015, -0.35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[1.65, 24]} />
            <meshStandardMaterial color="#c9dde8" roughness={0.94} />
          </mesh>
          <mesh position={[0, 0.018, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.38, 1.52, 24]} />
            <meshStandardMaterial color="#f2cf7e" roughness={0.9} />
          </mesh>

          {/* Meja Gambar Kayu Mungil Kira */}
          <mesh position={[0, 0.52, 0.25]} castShadow receiveShadow>
            <boxGeometry args={[1.62, 0.08, 0.92]} />
            <meshStandardMaterial color="#e6cda8" roughness={0.62} />
          </mesh>
          {[
            [-0.7, 0.26, -0.14],
            [0.7, 0.26, -0.14],
            [-0.7, 0.26, 0.64],
            [0.7, 0.26, 0.64],
          ].map(([lx, ly, lz], idx) => (
            <mesh key={`kl-${idx}`} position={[lx, ly, lz]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.52, 8]} />
              <meshStandardMaterial color="#a67c52" roughness={0.75} />
            </mesh>
          ))}
          {/* Kursi Kuning Mungil Kira */}
          <mesh position={[-0.3, 0.31, -0.45]} castShadow>
            <boxGeometry args={[0.42, 0.06, 0.42]} />
            <meshStandardMaterial color="#eab949" roughness={0.6} />
          </mesh>
          <mesh position={[-0.3, 0.52, -0.64]} castShadow>
            <boxGeometry args={[0.42, 0.38, 0.06]} />
            <meshStandardMaterial color="#eab949" roughness={0.6} />
          </mesh>
          <mesh position={[-0.3, 0.15, -0.45]}>
            <cylinderGeometry args={[0.14, 0.18, 0.3, 8]} />
            <meshStandardMaterial color="#b38858" roughness={0.75} />
          </mesh>

          {/* Buku Gambar, Kotak Krayon & Gelas Cat Air di Atas Meja */}
          <mesh position={[-0.18, 0.575, 0.22]} rotation={[-Math.PI / 2, 0, 0.08]}>
            <planeGeometry args={[0.56, 0.42]} />
            <meshStandardMaterial color="#fcf8ee" roughness={0.85} />
          </mesh>
          <mesh position={[0.42, 0.59, 0.15]} castShadow>
            <boxGeometry args={[0.34, 0.06, 0.22]} />
            <meshStandardMaterial color="#d96b6b" roughness={0.55} />
          </mesh>
          {['#f2c14e', '#4ea8de', '#52b788', '#f28482'].map((col, ci) => (
            <mesh key={`cr-${ci}`} position={[0.3 + ci * 0.07, 0.58, 0.42]} rotation={[0, 0.25, Math.PI / 2]}>
              <cylinderGeometry args={[0.014, 0.014, 0.14, 6]} />
              <meshStandardMaterial color={col} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[-0.6, 0.62, 0.42]}>
            <cylinderGeometry args={[0.06, 0.05, 0.12, 10]} />
            <meshStandardMaterial color="#72b6e0" transparent opacity={0.8} roughness={0.2} />
          </mesh>

          {/* Rak Buku Cerita & Kotak Mainan di Dinding Belakang */}
          <mesh position={[0, 0.68, 1.38]} castShadow receiveShadow>
            <boxGeometry args={[2.05, 1.36, 0.42]} />
            <meshStandardMaterial color="#f2e6d5" roughness={0.72} />
          </mesh>
          {/* Buku Cerita Warna-Warni + Boneka Beruang Mungil */}
          {[-0.68, -0.45, -0.22, 0.02].map((bx, bi) => (
            <mesh key={`kb-${bi}`} position={[bx, 1.02, 1.34]} castShadow>
              <boxGeometry args={[0.16, 0.34, 0.26]} />
              <meshStandardMaterial color={['#e07a5f', '#3d7ea6', '#f2cc8f', '#81b29a'][bi]} roughness={0.75} />
            </mesh>
          ))}
          <group position={[0.58, 1.0, 1.34]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 10, 10]} />
              <meshStandardMaterial color="#9c6b43" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.19, 0.02]} castShadow>
              <sphereGeometry args={[0.11, 10, 10]} />
              <meshStandardMaterial color="#a8754b" roughness={0.9} />
            </mesh>
            <mesh position={[-0.08, 0.28, 0.02]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#8f5f38" roughness={0.9} />
            </mesh>
            <mesh position={[0.08, 0.28, 0.02]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#8f5f38" roughness={0.9} />
            </mesh>
          </group>
          {/* Lampu Tidur Bintang Hangat & Bendera Hias Dinding */}
          <mesh position={[-0.66, 1.5, 1.38]}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial color="#fff3b0" emissive="#ffd166" emissiveIntensity={2.0} />
          </mesh>
          {[-0.8, -0.4, 0, 0.4, 0.8].map((fx, fi) => (
            <mesh key={`flag-${fi}`} position={[fx, 2.45, 1.66]} rotation={[0, 0, Math.PI]}>
              <coneGeometry args={[0.16, 0.24, 3]} />
              <meshStandardMaterial color={['#f4a261', '#e76f51', '#e9c46a', '#2a9d8f', '#6096ba'][fi]} roughness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Halaman, Jalan Setapak, Pagar & Motor Matic Parkir */}
        <mesh position={[-20, 0.025, 58]} receiveShadow>
          <boxGeometry args={[3.4, 0.05, 8.2]} />
          <meshStandardMaterial map={textures.paving} roughness={0.85} />
        </mesh>
        <mesh position={[-24.6, 0.58, 54]} castShadow>
          <boxGeometry args={[5.2, 1.15, 0.28]} />
          <meshStandardMaterial map={textures.stucco} />
        </mesh>
        <mesh position={[-15.4, 0.58, 54]} castShadow>
          <boxGeometry args={[5.2, 1.15, 0.28]} />
          <meshStandardMaterial map={textures.stucco} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 2. KAWASAN PERUMAHAN MELATI                                  */}
      {/* ============================================================ */}
      {[
        { x: -0.5, z: 71.5, w: 10.6, d: 10.6, h: 4.6, wall: '#e5d6c5', roof: '#874836' },
        { x: 15.5, z: 71.0, w: 10.6, d: 11.0, h: 4.9, wall: '#d6dcd4', roof: '#445261' },
        { x: 31.0, z: 71.0, w: 11.2, d: 11.0, h: 4.7, wall: '#e8d8c8', roof: '#8a4c39' },
      ].map((h, i) => (
        <group key={`neigh-${i}`} position={[h.x, 0, h.z]}>
          <mesh position={[0, h.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[h.w, h.h, h.d]} />
            <meshStandardMaterial map={textures.stucco} color={h.wall} roughness={0.88} />
          </mesh>
          <mesh position={[0, h.h + 1.25, 0]} castShadow>
            <coneGeometry args={[h.w * 0.78, 2.7, 4]} />
            <meshStandardMaterial map={textures.roofTile} color={h.roof} roughness={0.82} />
          </mesh>
          {[-2.3, 2.3].map((wx) => (
            <group key={`nw-${wx}`} position={[wx, 2.15, -h.d / 2 - 0.04]}>
              <mesh>
                <boxGeometry args={[2.3, 1.65, 0.1]} />
                <meshStandardMaterial color="#4e3828" />
              </mesh>
              <mesh position={[0, 0, -0.06]}>
                <planeGeometry args={[2.0, 1.38]} />
                <meshStandardMaterial
                  color="#ffe4ad"
                  emissive={windowEmissive}
                  emissiveIntensity={windowEmissiveInt}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* Lampu Teras Bu Wati */}
      <mesh position={[24.0, 2.8, 64.9]}>
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshStandardMaterial
          color={buWatiLampFixed ? '#ffe9ad' : '#5e5c57'}
          emissive={buWatiLampFixed ? '#ffba52' : '#000000'}
          emissiveIntensity={buWatiLampFixed ? 3.0 : 0}
        />
      </mesh>
      {buWatiLampFixed && (
        <>
          <pointLight position={[24.0, 2.7, 64.2]} color="#ffc76b" intensity={15} distance={16} decay={1.7} />
          {settings.cinematicGlow && (
            <sprite position={[24.0, 2.8, 64.9]} scale={[2.6, 2.6, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffd280"
                transparent
                opacity={0.75}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 3. KEDAI KOPI SUDUT (BIMA) — KAFE KAYU HANGAT ARTISANAL      */}
      {/* ============================================================ */}
      <group>
        <mesh position={[-20, 0.04, 20.5]} receiveShadow>
          <boxGeometry args={[16.2, 0.08, 13.4]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.68} />
        </mesh>
        <mesh position={[-20, 2.25, 27.1]} castShadow receiveShadow>
          <boxGeometry args={[16.2, 4.5, 0.45]} />
          <meshStandardMaterial map={textures.woodSlat} roughness={0.82} />
        </mesh>
        <mesh position={[-27.9, 2.25, 20.5]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 4.5, 13.4]} />
          <meshStandardMaterial map={textures.woodSlat} roughness={0.82} />
        </mesh>
        <mesh position={[-12.4, 2.25, 20.5]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 4.5, 13.4]} />
          <meshStandardMaterial map={textures.woodSlat} roughness={0.82} />
        </mesh>
        {/* Atap Kanopi Industrial */}
        <mesh position={[-20, 4.6, 20.5]} castShadow>
          <boxGeometry args={[17.4, 0.36, 14.6]} />
          <meshStandardMaterial color="#272422" roughness={0.72} metalness={0.25} />
        </mesh>
        {/* Papan Nama Backlit "KOPI SUDUT" */}
        <mesh position={[-20, 5.1, 13.3]}>
          <boxGeometry args={[7.2, 1.1, 0.28]} />
          <meshStandardMaterial
            color="#2b1f19"
            emissive="#ffaa4c"
            emissiveIntensity={isEveningOrNight ? 0.95 : 0.15}
          />
        </mesh>
        {/* Bar Espresso & Mesin Kopi Krom */}
        <mesh position={[-21, 0.65, 22.6]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 1.18, 1.35]} />
          <meshStandardMaterial map={textures.woodSlat} color="#5e4332" roughness={0.65} />
        </mesh>
        <mesh position={[-21, 1.26, 22.6]} castShadow>
          <boxGeometry args={[7.0, 0.1, 1.5]} />
          <meshStandardMaterial color="#d8d2c7" roughness={0.35} />
        </mesh>
        <mesh position={[-22.2, 1.58, 22.6]} castShadow>
          <boxGeometry args={[1.15, 0.62, 0.68]} />
          <meshStandardMaterial color="#d6dade" metalness={0.85} roughness={0.18} />
        </mesh>
        {/* String Lights Edison Hangat + Glow */}
        {[-25.5, -23.0, -20.5, -18.0, -15.5, -13.5].map((lx, idx) => {
          const ly = 3.72 - Math.sin((idx / 5) * Math.PI) * 0.28;
          return (
            <group key={`sl-${lx}`} position={[lx, ly, 15.8]}>
              <mesh>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color="#ffebb3" emissive="#ffb84d" emissiveIntensity={2.8} />
              </mesh>
              {settings.cinematicGlow && (
                <sprite scale={[1.8, 1.8, 1]}>
                  <spriteMaterial
                    map={textures.glowSprite}
                    color="#ffc66b"
                    transparent
                    opacity={isEveningOrNight ? 0.8 : 0.35}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </sprite>
              )}
            </group>
          );
        })}
        {/* Gitar Akustik Detail di Dinding Kafe */}
        <DetailedGuitar position={[-15.2, 2.25, 26.72]} rotation={[0, Math.PI, 0.18]} />
      </group>

      {/* ============================================================ */}
      {/* 4. KIOS 24 JAM HARMONI — INTERIOR MINIMARKET BISA DIMASUKI   */}
      {/* ============================================================ */}
      <group>
        {/* Lantai Keramik Bersih Mengkilap */}
        <mesh position={[24.5, 0.04, 23]} receiveShadow>
          <boxGeometry args={[13.8, 0.08, 10.8]} />
          <meshStandardMaterial color="#e8edf2" roughness={0.28} metalness={0.08} />
        </mesh>
        {/* Dinding Belakang, Kiri & Kanan */}
        <mesh position={[24.5, 2.35, 28.25]} castShadow receiveShadow>
          <boxGeometry args={[13.8, 4.7, 0.36]} />
          <meshStandardMaterial map={textures.stucco} color="#f2f4f6" roughness={0.78} />
        </mesh>
        <mesh position={[17.72, 2.35, 23]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 4.7, 10.8]} />
          <meshStandardMaterial map={textures.stucco} color="#f2f4f6" roughness={0.78} />
        </mesh>
        <mesh position={[31.28, 2.35, 23]} castShadow receiveShadow>
          <boxGeometry args={[0.36, 4.7, 10.8]} />
          <meshStandardMaterial map={textures.stucco} color="#f2f4f6" roughness={0.78} />
        </mesh>
        {/* Dinding Depan Kiri & Kanan dengan Kaca Etalase Bening + Pintu Masuk Lebar di Tengah (x=22.7..26.3) */}
        <mesh position={[20.15, 0.62, 17.68]} castShadow receiveShadow>
          <boxGeometry args={[5.1, 1.24, 0.32]} />
          <meshStandardMaterial map={textures.stucco} color="#f2f4f6" roughness={0.78} />
        </mesh>
        <mesh position={[28.85, 0.62, 17.68]} castShadow receiveShadow>
          <boxGeometry args={[5.1, 1.24, 0.32]} />
          <meshStandardMaterial map={textures.stucco} color="#f2f4f6" roughness={0.78} />
        </mesh>
        <mesh position={[20.15, 2.4, 17.68]}>
          <boxGeometry args={[4.85, 2.35, 0.08]} />
          <meshStandardMaterial color="#d8f0ff" transparent opacity={0.28} roughness={0.08} metalness={0.25} />
        </mesh>
        <mesh position={[28.85, 2.4, 17.68]}>
          <boxGeometry args={[4.85, 2.35, 0.08]} />
          <meshStandardMaterial color="#d8f0ff" transparent opacity={0.28} roughness={0.08} metalness={0.25} />
        </mesh>
        {/* Kusen Pintu Kaca Otomatis & Bagian Atas Pintu */}
        <mesh position={[24.5, 4.05, 17.68]} castShadow>
          <boxGeometry args={[13.8, 1.3, 0.36]} />
          <meshStandardMaterial map={textures.stucco} color="#f2f4f6" roughness={0.75} />
        </mesh>
        <mesh position={[22.66, 1.7, 17.68]}>
          <boxGeometry args={[0.14, 3.4, 0.24]} />
          <meshStandardMaterial color="#3c4957" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[26.34, 1.7, 17.68]}>
          <boxGeometry args={[0.14, 3.4, 0.24]} />
          <meshStandardMaterial color="#3c4957" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Atap Plafon + Strip Ikonik Hijau-Oranye Harmoni */}
        <mesh position={[24.5, 4.72, 23]} castShadow>
          <boxGeometry args={[14.3, 0.28, 11.4]} />
          <meshStandardMaterial color="#dce3ea" roughness={0.7} />
        </mesh>
        <mesh position={[24.5, 4.45, 17.46]}>
          <boxGeometry args={[14.2, 0.68, 0.24]} />
          <meshStandardMaterial color="#27826f" emissive="#27826f" emissiveIntensity={isEveningOrNight ? 1.15 : 0.15} />
        </mesh>
        <mesh position={[24.5, 3.92, 17.46]}>
          <boxGeometry args={[14.2, 0.3, 0.24]} />
          <meshStandardMaterial color="#e88a35" emissive="#e88a35" emissiveIntensity={isEveningOrNight ? 1.25 : 0.2} />
        </mesh>

        {/* Lampu LED Plafon Minimarket 24 Jam */}
        {[-2.4, 2.4].map((ox, i) => (
          <mesh key={`kled-${i}`} position={[24.5 + ox, 4.5, 23]}>
            <boxGeometry args={[0.28, 0.08, 6.8]} />
            <meshStandardMaterial color="#ffffff" emissive="#e3f4ff" emissiveIntensity={2.3} />
          </mesh>
        ))}
        <pointLight position={[24.5, 3.9, 23]} color="#eef8ff" intensity={18} distance={18} decay={1.6} />

        {/* Deretan 4 Lemari Es Minuman Bercahaya di Dinding Belakang */}
        <group position={[24.5, 0.08, 27.45]}>
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[9.4, 2.3, 1.05]} />
            <meshStandardMaterial color="#2a3542" roughness={0.4} metalness={0.4} />
          </mesh>
          {[-3.4, -1.15, 1.15, 3.4].map((fx, fi) => (
            <group key={`fr-${fi}`} position={[fx, 1.18, -0.53]}>
              <mesh>
                <planeGeometry args={[1.95, 1.88]} />
                <meshStandardMaterial
                  color="#d8f2ff"
                  emissive="#a8e2ff"
                  emissiveIntensity={1.25}
                  roughness={0.15}
                />
              </mesh>
              {/* Deretan Baris Minuman Berwarna di Dalam Kulkas */}
              {[-0.55, -0.1, 0.35].map((ry, ri) => (
                <mesh key={`dr-${ri}`} position={[0, ry, 0.02]}>
                  <boxGeometry args={[1.7, 0.22, 0.06]} />
                  <meshStandardMaterial
                    color={['#f48ca3', '#60a5fa', '#4ade80', '#fbbf24'][(fi + ri) % 4]}
                    roughness={0.4}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* 2 Lorong Rak Gondola Snack & Kebutuhan Harian */}
        {[21.3, 25.0].map((gx, gi) => (
          <group key={`gondola-${gi}`} position={[gx, 0.08, 23.1]}>
            <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.15, 1.76, 3.4]} />
              <meshStandardMaterial color="#e5e9ee" roughness={0.55} />
            </mesh>
            {[0.45, 0.92, 1.38].map((sy, si) => (
              <mesh key={`snk-${si}`} position={[0, sy, 0]}>
                <boxGeometry args={[1.22, 0.22, 3.15]} />
                <meshStandardMaterial
                  color={['#e07a5f', '#f2cc8f', '#5fa8d3', '#81b29a', '#f4a261', '#c77dff'][(gi * 3 + si) % 6]}
                  roughness={0.65}
                />
              </mesh>
            ))}
          </group>
        ))}

        {/* Meja Kasir Kanan + Monitor Kasir & Dispenser Teh Melati Hangat */}
        <group position={[29.3, 0.08, 22.6]}>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 1.04, 3.75]} />
            <meshStandardMaterial color="#277363" roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.07, 0]} castShadow>
            <boxGeometry args={[1.55, 0.08, 3.85]} />
            <meshStandardMaterial color="#f2f4f7" roughness={0.35} />
          </mesh>
          {/* Layar Kasir */}
          <mesh position={[-0.2, 1.34, -0.55]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.42, 0.34, 0.08]} />
            <meshStandardMaterial color="#1f2937" emissive="#60a5fa" emissiveIntensity={0.9} />
          </mesh>
          {/* Dispenser Teh Melati & Kopi Hangat */}
          <mesh position={[-0.2, 1.38, 0.95]} castShadow>
            <boxGeometry args={[0.48, 0.58, 0.52]} />
            <meshStandardMaterial color="#d4dbe3" metalness={0.65} roughness={0.28} />
          </mesh>
          <mesh position={[-0.45, 1.48, 0.95]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2.2} />
          </mesh>
        </group>

        {/* Meja Teras Depan Kios */}
        <mesh position={[20.5, 0.72, 14.2]} castShadow>
          <cylinderGeometry args={[0.72, 0.72, 0.08, 16]} />
          <meshStandardMaterial color="#e0e5ea" roughness={0.5} />
        </mesh>
        <mesh position={[20.5, 0.36, 14.2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.72, 8]} />
          <meshStandardMaterial color="#3c434d" metalness={0.6} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 5. TOKO MUSIK "NADA LAMA" — INTERIOR HANGAT BISA DIMASUKI    */}
      {/* ============================================================ */}
      <group>
        {/* Lantai Kayu Antik + Karpet Tenun Hangat */}
        <mesh position={[-22, 0.04, -25.5]} receiveShadow>
          <boxGeometry args={[14.8, 0.08, 11.8]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.66} />
        </mesh>
        <mesh position={[-21.8, 0.095, -24.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[5.4, 3.8]} />
          <meshStandardMaterial color="#7d3b32" roughness={0.95} />
        </mesh>
        <mesh position={[-21.8, 0.098, -24.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.55, 24]} />
          <meshStandardMaterial color="#d9a866" roughness={0.9} />
        </mesh>

        {/* Dinding Bata Hangat (Belakang, Kiri, Kanan) */}
        <mesh position={[-22, 2.6, -31.3]} castShadow receiveShadow>
          <boxGeometry args={[14.8, 5.2, 0.42]} />
          <meshStandardMaterial map={textures.brick} roughness={0.88} />
        </mesh>
        <mesh position={[-29.28, 2.6, -25.5]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 5.2, 11.8]} />
          <meshStandardMaterial map={textures.brick} roughness={0.88} />
        </mesh>
        <mesh position={[-14.72, 2.6, -25.5]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 5.2, 11.8]} />
          <meshStandardMaterial map={textures.brick} roughness={0.88} />
        </mesh>

        {/* Dinding Depan Kiri & Kanan dengan Kaca Etalase Bening + Pintu Masuk Lebar di Tengah (x=-23.8..-20.2) */}
        <mesh position={[-26.6, 0.62, -19.62]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 1.24, 0.36]} />
          <meshStandardMaterial map={textures.brick} roughness={0.88} />
        </mesh>
        <mesh position={[-17.4, 0.62, -19.62]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 1.24, 0.36]} />
          <meshStandardMaterial map={textures.brick} roughness={0.88} />
        </mesh>
        <mesh position={[-26.6, 2.45, -19.62]}>
          <boxGeometry args={[5.1, 2.4, 0.08]} />
          <meshStandardMaterial color="#ffecd1" transparent opacity={0.25} roughness={0.1} metalness={0.2} />
        </mesh>
        <mesh position={[-17.4, 2.45, -19.62]}>
          <boxGeometry args={[5.1, 2.4, 0.08]} />
          <meshStandardMaterial color="#ffecd1" transparent opacity={0.25} roughness={0.1} metalness={0.2} />
        </mesh>
        <mesh position={[-22, 4.4, -19.62]} castShadow>
          <boxGeometry args={[14.8, 1.6, 0.4]} />
          <meshStandardMaterial map={textures.brick} roughness={0.88} />
        </mesh>
        {/* Kusen Kayu Pintu Masuk */}
        <mesh position={[-23.82, 1.85, -19.62]}>
          <boxGeometry args={[0.16, 3.7, 0.38]} />
          <meshStandardMaterial color="#4a2e1f" roughness={0.7} />
        </mesh>
        <mesh position={[-20.18, 1.85, -19.62]}>
          <boxGeometry args={[0.16, 3.7, 0.38]} />
          <meshStandardMaterial color="#4a2e1f" roughness={0.7} />
        </mesh>
        {/* Atap & Kanopi Merah Klasik */}
        <mesh position={[-22, 5.2, -25.5]} castShadow>
          <boxGeometry args={[15.4, 0.3, 12.4]} />
          <meshStandardMaterial color="#382720" roughness={0.82} />
        </mesh>
        <mesh position={[-22, 3.68, -18.7]} rotation={[0.28, 0, 0]} castShadow>
          <boxGeometry args={[13.8, 0.24, 2.5]} />
          <meshStandardMaterial color="#9c3830" roughness={0.85} />
        </mesh>

        {/* Lampu Gantung Vintage & Cahaya Keemasan Interior */}
        {[-25.0, -19.0].map((lx, i) => (
          <group key={`mlamp-${i}`} position={[lx, 4.05, -25.4]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
              <meshStandardMaterial color="#2b231e" />
            </mesh>
            <mesh>
              <coneGeometry args={[0.42, 0.3, 12]} />
              <meshStandardMaterial color="#4a3122" roughness={0.55} />
            </mesh>
            <mesh position={[0, -0.14, 0]}>
              <sphereGeometry args={[0.15, 10, 10]} />
              <meshStandardMaterial color="#ffefc2" emissive="#ffb852" emissiveIntensity={2.8} />
            </mesh>
          </group>
        ))}
        <pointLight position={[-22, 3.85, -25.5]} color="#ffcb7a" intensity={20} distance={20} decay={1.5} />

        {/* Deretan 4 Gitar Akustik & Klasik Tergantung di Dinding Belakang */}
        <DetailedGuitar position={[-27.2, 2.15, -30.88]} rotation={[0, 0, -0.05]} />
        <DetailedGuitar position={[-25.4, 2.15, -30.88]} rotation={[0, 0, 0.04]} />
        <DetailedGuitar position={[-23.6, 2.15, -30.88]} rotation={[0, 0, -0.03]} />
        <DetailedGuitar position={[-21.8, 2.15, -30.88]} rotation={[0, 0, 0.05]} />

        {/* Gitar Pajangan Etalase Luar Depan */}
        <DetailedGuitar position={[-25.6, 1.65, -19.3]} rotation={[0, 0, -0.1]} />
        <DetailedGuitar position={[-18.4, 1.65, -19.3]} rotation={[0, 0, 0.08]} />

        {/* Meja Kasir Vintage & Pemutar Vinyl / Tape Deck di Kanan Belakang */}
        <group position={[-18.0, 0.08, -28.6]}>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.4, 1.04, 1.25]} />
            <meshStandardMaterial map={textures.woodSlat} color="#593a27" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.07, 0]} castShadow>
            <boxGeometry args={[4.55, 0.08, 1.38]} />
            <meshStandardMaterial color="#7c5338" roughness={0.5} />
          </mesh>
          {/* Turntable Piringan Hitam */}
          <mesh position={[-0.95, 1.18, 0.05]} castShadow>
            <boxGeometry args={[0.78, 0.14, 0.62]} />
            <meshStandardMaterial color="#38251a" roughness={0.6} />
          </mesh>
          <mesh position={[-0.95, 1.26, 0.05]}>
            <cylinderGeometry args={[0.24, 0.24, 0.03, 18]} />
            <meshStandardMaterial color="#14161a" roughness={0.22} metalness={0.4} />
          </mesh>
          <mesh position={[-0.95, 1.28, 0.05]}>
            <cylinderGeometry args={[0.07, 0.07, 0.035, 12]} />
            <meshStandardMaterial color="#d97746" roughness={0.4} />
          </mesh>
          {/* Tape Deck Kaset dengan Lampu Indikator Hangat */}
          <mesh position={[0.75, 1.24, 0]} castShadow>
            <boxGeometry args={[0.85, 0.28, 0.45]} />
            <meshStandardMaterial color="#2a2f38" metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[0.75, 1.26, 0.23]}>
            <planeGeometry args={[0.42, 0.1]} />
            <meshStandardMaterial color="#ffdf9e" emissive="#ffb84d" emissiveIntensity={1.8} />
          </mesh>
        </group>

        {/* Rak Kayu Kaset & Vinyl Lawas di Sisi Kiri */}
        <group position={[-26.4, 0.08, -25.4]}>
          <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.25, 1.56, 4.35]} />
            <meshStandardMaterial color="#5c3d28" roughness={0.78} />
          </mesh>
          {[-1.5, -0.5, 0.5, 1.5].map((rz, ri) => (
            <mesh key={`cas-${ri}`} position={[0.52, 1.12, rz]} castShadow>
              <boxGeometry args={[0.28, 0.34, 0.72]} />
              <meshStandardMaterial color={['#c96a4a', '#487699', '#d9a84e', '#5d8a68'][ri]} roughness={0.65} />
            </mesh>
          ))}
          {[-1.4, 0, 1.4].map((rz, ri) => (
            <mesh key={`vin-${ri}`} position={[0.52, 0.55, rz]} castShadow>
              <boxGeometry args={[0.3, 0.42, 0.92]} />
              <meshStandardMaterial color={['#e6d5b8', '#9e4738', '#3c526b'][ri]} roughness={0.7} />
            </mesh>
          ))}
        </group>

        {/* Sofa Kulit Vintage & Amplifier Gitar di Sisi Kanan */}
        <group position={[-16.8, 0.08, -23.4]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.25, 0.52, 2.3]} />
            <meshStandardMaterial color="#6e3f2a" roughness={0.72} />
          </mesh>
          <mesh position={[0.48, 0.82, 0]} castShadow>
            <boxGeometry args={[0.3, 0.62, 2.3]} />
            <meshStandardMaterial color="#5e3422" roughness={0.75} />
          </mesh>
          {/* Amplifier Gitar Hitam Klasik */}
          <mesh position={[0.05, 0.42, -1.65]} castShadow>
            <boxGeometry args={[0.72, 0.84, 0.58]} />
            <meshStandardMaterial color="#1f2329" roughness={0.7} />
          </mesh>
          <mesh position={[-0.32, 0.42, -1.65]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.46, 0.58]} />
            <meshStandardMaterial color="#4a4038" roughness={0.9} />
          </mesh>
        </group>

        {/* Dinding Gang Grafiti Luar Kiri */}
        <mesh position={[-31.2, 1.85, -25]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.4, 2.3]} />
          <meshStandardMaterial map={textures.brick} color="#635c56" roughness={0.95} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* 6 & 7. MENARA NUSANTARA (SKYSCRAPER KACA + ROOFTOP SKY DECK) */}
      {/* ============================================================ */}
      <group>
        {/* Lantai Marmer Lobi */}
        <mesh position={[29, 0.04, -22.5]} receiveShadow>
          <boxGeometry args={[24.6, 0.08, 7.2]} />
          <meshStandardMaterial color="#d4dae2" roughness={0.18} metalness={0.2} />
        </mesh>
        {/* Pilar Baja & Beton Lobi */}
        <mesh position={[17.2, 2.8, -22.5]} castShadow>
          <boxGeometry args={[1.4, 5.6, 6.2]} />
          <meshStandardMaterial color="#3c4757" metalness={0.45} roughness={0.4} />
        </mesh>
        <mesh position={[40.8, 2.8, -22.5]} castShadow>
          <boxGeometry args={[1.4, 5.6, 6.2]} />
          <meshStandardMaterial color="#3c4757" metalness={0.45} roughness={0.4} />
        </mesh>
        {/* Menara Kaca Curtain-Wall Bertekstur PBR */}
        <mesh position={[29, 11.0, -34.6]} castShadow receiveShadow>
          <boxGeometry args={[24.6, 22.0, 17.5]} />
          <meshStandardMaterial
            map={isEveningOrNight ? textures.officeGlassNight : textures.officeGlassDay}
            emissiveMap={isEveningOrNight ? textures.officeGlassNight : undefined}
            emissive={isEveningOrNight ? '#ffd599' : '#000000'}
            emissiveIntensity={timeOfDay === 'night' ? 0.95 : isEveningOrNight ? 0.55 : 0}
            roughness={0.2}
            metalness={0.55}
          />
        </mesh>
        <mesh position={[29, 13.8, -22.5]} castShadow receiveShadow>
          <boxGeometry args={[24.6, 16.4, 6.8]} />
          <meshStandardMaterial
            map={isEveningOrNight ? textures.officeGlassNight : textures.officeGlassDay}
            emissiveMap={isEveningOrNight ? textures.officeGlassNight : undefined}
            emissive={isEveningOrNight ? '#ffd599' : '#000000'}
            emissiveIntensity={timeOfDay === 'night' ? 0.95 : isEveningOrNight ? 0.55 : 0}
            roughness={0.2}
            metalness={0.55}
          />
        </mesh>
        {/* Sirip Arsitektur Vertikal Modern */}
        {[19, 24, 29, 34, 39].map((fx) => (
          <mesh key={`fin-${fx}`} position={[fx, 13.8, -19.0]}>
            <boxGeometry args={[0.32, 16.4, 0.45]} />
            <meshStandardMaterial color="#9aa6b5" metalness={0.65} roughness={0.3} />
          </mesh>
        ))}
        {/* Pintu Lift Lobi */}
        <mesh position={[19.5, 1.65, -25.6]}>
          <boxGeometry args={[2.1, 3.1, 0.28]} />
          <meshStandardMaterial
            color="#b6c2cf"
            metalness={0.8}
            roughness={0.18}
            emissive="#f6d17a"
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* Meja Kerja Lobi */}
        <mesh position={[34.2, 0.82, -23.4]} castShadow>
          <boxGeometry args={[2.3, 0.12, 1.12]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.5} />
        </mesh>

        {/* === ROOFTOP SKY DECK (Y = 22) === */}
        <group position={[0, 22, 0]}>
          <mesh position={[28.8, -0.1, -32]} receiveShadow>
            <boxGeometry args={[23.6, 0.2, 22.8]} />
            <meshStandardMaterial map={textures.paving} color="#686d75" roughness={0.82} />
          </mesh>
          {/* Dek Kayu Lounge Rooftop */}
          <mesh position={[29.0, 0.02, -25.5]} receiveShadow>
            <boxGeometry args={[12.5, 0.08, 7.2]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.7} />
          </mesh>
          {/* Pagar Kaca Pengaman + Tiang Baja */}
          <mesh position={[28.8, 0.65, -20.8]}>
            <boxGeometry args={[23.6, 1.25, 0.14]} />
            <meshStandardMaterial color="#a6cde8" transparent opacity={0.38} roughness={0.1} metalness={0.4} />
          </mesh>
          <mesh position={[28.8, 0.65, -43.2]}>
            <boxGeometry args={[23.6, 1.25, 0.14]} />
            <meshStandardMaterial color="#a6cde8" transparent opacity={0.38} roughness={0.1} metalness={0.4} />
          </mesh>
          <mesh position={[17.1, 0.65, -32]}>
            <boxGeometry args={[0.14, 1.25, 22.6]} />
            <meshStandardMaterial color="#a6cde8" transparent opacity={0.38} roughness={0.1} metalness={0.4} />
          </mesh>
          <mesh position={[40.5, 0.65, -32]}>
            <boxGeometry args={[0.14, 1.25, 22.6]} />
            <meshStandardMaterial color="#a6cde8" transparent opacity={0.38} roughness={0.1} metalness={0.4} />
          </mesh>
          {/* Lampu String Light Rooftop */}
          {[24, 27, 30, 33, 36].map((rx) => (
            <group key={`rl-${rx}`} position={[rx, 2.8, -22.2]}>
              <mesh>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial color="#ffebb3" emissive="#ffc061" emissiveIntensity={2.8} />
              </mesh>
              {settings.cinematicGlow && isEveningOrNight && (
                <sprite scale={[2.1, 2.1, 1]}>
                  <spriteMaterial
                    map={textures.glowSprite}
                    color="#ffca75"
                    transparent
                    opacity={0.78}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </sprite>
              )}
            </group>
          ))}
          {/* Kabin Lift Rooftop */}
          <mesh position={[19.8, 1.85, -25.4]} castShadow>
            <boxGeometry args={[3.4, 3.7, 3.2]} />
            <meshStandardMaterial color="#364150" roughness={0.55} metalness={0.3} />
          </mesh>
          {/* Bangku Santai Rooftop */}
          <mesh position={[28.5, 0.44, -23.0]} castShadow>
            <boxGeometry args={[3.4, 0.16, 0.85]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.75} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 8. STASIUN KERETA TUA SENJA                                  */}
      {/* ============================================================ */}
      <group>
        <mesh position={[80.5, 0.05, -4]} receiveShadow>
          <boxGeometry args={[16.5, 0.12, 42]} />
          <meshStandardMaterial map={textures.paving} roughness={0.88} />
        </mesh>
        <mesh position={[81.5, 4.45, -4]} castShadow>
          <boxGeometry args={[11.8, 0.36, 34.4]} />
          <meshStandardMaterial map={textures.roofTile} roughness={0.82} />
        </mesh>
        {[-16, -6, 4, 14].map((tz) => (
          <mesh key={`st-${tz}`} position={[81.5, 2.2, tz]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 4.4, 10]} />
            <meshStandardMaterial color="#46413c" metalness={0.45} roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[76, 2.25, -18]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 4.5, 11.5]} />
          <meshStandardMaterial map={textures.stucco} color="#e5dac6" roughness={0.88} />
        </mesh>
        {/* Lapak Buku Warna-warni Pak Darman */}
        <mesh position={[75.8, 0.52, -2.5]} castShadow>
          <boxGeometry args={[2.7, 0.92, 1.45]} />
          <meshStandardMaterial map={textures.woodSlat} roughness={0.8} />
        </mesh>
        {[-0.8, -0.3, 0.2, 0.7].map((bx, bi) => (
          <mesh key={`bk-${bi}`} position={[75.8 + bx, 1.06, -2.5]} castShadow>
            <boxGeometry args={[0.38, 0.22, 0.6]} />
            <meshStandardMaterial color={['#9e4738', '#3c637a', '#b58d43', '#4f7358'][bi]} roughness={0.8} />
          </mesh>
        ))}
        {/* Rel Kereta + Bantalan Kayu */}
        <mesh position={[93.2, 0.05, 0]}>
          <boxGeometry args={[0.22, 0.14, 190]} />
          <meshStandardMaterial color="#676b72" metalness={0.78} roughness={0.32} />
        </mesh>
        <mesh position={[95.4, 0.05, 0]}>
          <boxGeometry args={[0.22, 0.14, 190]} />
          <meshStandardMaterial color="#676b72" metalness={0.78} roughness={0.32} />
        </mesh>
      </group>

      {/* ============================================================ */}
      {/* SKYLINE KOTA MODERN DENGAN JENDELA MENYALA                   */}
      {/* ============================================================ */}
      {[
        { x: 51, z: -33, w: 10.5, d: 21, h: 19 },
        { x: 46, z: 25, w: 15, d: 17, h: 14 },
        { x: -21, z: -47, w: 14.5, d: 13.5, h: 17 },
        { x: -5, z: -54, w: 13.5, d: 12.5, h: 24 },
        { x: 64, z: -54, w: 16, d: 14, h: 21 },
        { x: 60, z: 54, w: 14, d: 18, h: 13 },
        { x: -48, z: -60, w: 18, d: 14, h: 22 },
      ].map((b, idx) => (
        <group key={`bg-${idx}`} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              map={isEveningOrNight ? textures.officeGlassNight : textures.officeGlassDay}
              emissiveMap={isEveningOrNight ? textures.officeGlassNight : undefined}
              emissive={isEveningOrNight ? '#ffce85' : '#000000'}
              emissiveIntensity={timeOfDay === 'night' ? 0.8 : isEveningOrNight ? 0.45 : 0}
              roughness={0.32}
              metalness={0.42}
            />
          </mesh>
          {/* Lampu suar merah di puncak gedung tinggi */}
          {b.h >= 20 && isEveningOrNight && (
            <mesh position={[0, b.h / 2 + 0.6, 0]}>
              <sphereGeometry args={[0.28, 8, 8]} />
              <meshStandardMaterial color="#ff5544" emissive="#ff2a1f" emissiveIntensity={3.0} />
            </mesh>
          )}
        </group>
      ))}

      <SwayingTrees />
      <StreetLamps lit={isEveningOrNight} glow={settings.cinematicGlow} />
    </group>
  );
};
