import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { GraphicsQuality, TimeOfDay } from '../../types/game';

interface AtmosphereProps {
  timeOfDay: TimeOfDay;
  quality: GraphicsQuality;
}

const TIME_PRESETS: Record<
  TimeOfDay,
  {
    sky: string;
    fog: string;
    fogNear: number;
    fogFar: number;
    sunColor: string;
    sunIntensity: number;
    sunPos: [number, number, number];
    hemiSky: string;
    hemiGround: string;
    hemiIntensity: number;
    ambientIntensity: number;
  }
> = {
  morning: {
    sky: '#bcd8ee',
    fog: '#d7e4ec',
    fogNear: 55,
    fogFar: 210,
    sunColor: '#fff1d0',
    sunIntensity: 1.55,
    sunPos: [55, 68, 42],
    hemiSky: '#d4ecff',
    hemiGround: '#8d7d69',
    hemiIntensity: 0.72,
    ambientIntensity: 0.35,
  },
  sunset: {
    sky: '#d9835b',
    fog: '#c47664',
    fogNear: 48,
    fogFar: 195,
    sunColor: '#ff9b54',
    sunIntensity: 1.75,
    sunPos: [-75, 24, -18],
    hemiSky: '#ffbe8a',
    hemiGround: '#4a3d49',
    hemiIntensity: 0.68,
    ambientIntensity: 0.28,
  },
  rain_dusk: {
    sky: '#364359',
    fog: '#3d4a60',
    fogNear: 32,
    fogFar: 145,
    sunColor: '#8ba4c7',
    sunIntensity: 0.65,
    sunPos: [-40, 38, -20],
    hemiSky: '#6b82a4',
    hemiGround: '#242b38',
    hemiIntensity: 0.58,
    ambientIntensity: 0.32,
  },
  night: {
    sky: '#101728',
    fog: '#141c2e',
    fogNear: 38,
    fogFar: 175,
    sunColor: '#89a8d8',
    sunIntensity: 0.45,
    sunPos: [-45, 55, -35],
    hemiSky: '#31446b',
    hemiGround: '#16141a',
    hemiIntensity: 0.46,
    ambientIntensity: 0.28,
  },
};

const RainEffect: React.FC<{ quality: GraphicsQuality }> = ({ quality }) => {
  const count = quality === 'low' ? 280 : quality === 'medium' ? 560 : 950;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(() => {
    return Array.from({ length: count }, () => ({
      ox: (Math.random() - 0.5) * 52,
      oy: Math.random() * 24 + 1,
      oz: (Math.random() - 0.5) * 52,
      speed: 14 + Math.random() * 8,
    }));
  }, [count]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const [px, py, pz] = playerRuntime.position;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const d = drops[i];
      d.oy -= d.speed * dt;
      if (d.oy < -1) {
        d.oy = 23 + Math.random() * 4;
        d.ox = (Math.random() - 0.5) * 52;
        d.oz = (Math.random() - 0.5) * 52;
      }
      dummy.position.set(px + d.ox, py + d.oy, pz + d.oz);
      dummy.rotation.set(0.08, 0, 0.06);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.024, 0.85, 0.024]} />
      <meshBasicMaterial color="#bfd4f0" transparent opacity={0.42} depthWrite={false} />
    </instancedMesh>
  );
};

const DriftingClouds: React.FC<{ timeOfDay: TimeOfDay }> = ({ timeOfDay }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cloudColor =
    timeOfDay === 'morning'
      ? '#f7f9fc'
      : timeOfDay === 'sunset'
        ? '#f5b08c'
        : timeOfDay === 'rain_dusk'
          ? '#5b677c'
          : '#25314b';

  const clouds = useMemo(
    () => [
      { x: -70, y: 46, z: -60, s: 1.4 },
      { x: -10, y: 52, z: -85, s: 1.8 },
      { x: 55, y: 48, z: -40, s: 1.5 },
      { x: 25, y: 54, z: 35, s: 1.6 },
      { x: -55, y: 50, z: 45, s: 1.3 },
      { x: 85, y: 45, z: 20, s: 1.5 },
    ],
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      child.position.x += delta * (0.65 + (idx % 3) * 0.25);
      if (child.position.x > 135) child.position.x = -135;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, idx) => (
        <group key={idx} position={[c.x, c.y, c.z]} scale={c.s}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[14, 2.8, 6.5]} />
            <meshBasicMaterial color={cloudColor} transparent opacity={timeOfDay === 'night' ? 0.35 : 0.72} />
          </mesh>
          <mesh position={[4.5, 1.3, 0.8]}>
            <boxGeometry args={[8.5, 2.6, 5.2]} />
            <meshBasicMaterial color={cloudColor} transparent opacity={timeOfDay === 'night' ? 0.35 : 0.72} />
          </mesh>
          <mesh position={[-4.8, 0.9, -0.6]}>
            <boxGeometry args={[7.2, 2.2, 4.8]} />
            <meshBasicMaterial color={cloudColor} transparent opacity={timeOfDay === 'night' ? 0.35 : 0.72} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const StarField: React.FC = () => {
  const positions = useMemo(() => {
    const arr = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 320;
      arr[i * 3 + 1] = 48 + Math.random() * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 320;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={260} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#fff6df" size={0.85} transparent opacity={0.85} sizeAttenuation />
    </points>
  );
};

export const Atmosphere: React.FC<AtmosphereProps> = ({ timeOfDay, quality }) => {
  const { scene } = useThree();
  const preset = TIME_PRESETS[timeOfDay];

  React.useEffect(() => {
    scene.background = new THREE.Color(preset.sky);
    scene.fog = new THREE.Fog(preset.fog, preset.fogNear, preset.fogFar);
  }, [scene, preset]);

  const shadowMapSize = quality === 'low' ? 512 : quality === 'medium' ? 1024 : 2048;

  return (
    <>
      <ambientLight intensity={preset.ambientIntensity} color={preset.hemiSky} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, preset.hemiIntensity]} />
      <directionalLight
        position={preset.sunPos}
        intensity={preset.sunIntensity}
        color={preset.sunColor}
        castShadow={quality !== 'low'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={5}
        shadow-camera-far={220}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={95}
        shadow-camera-bottom={-95}
        shadow-bias={-0.0005}
      />

      {/* Matahari / Bulan Visual */}
      <mesh position={preset.sunPos}>
        <sphereGeometry args={[timeOfDay === 'night' ? 3.2 : 5.2, 16, 16]} />
        <meshBasicMaterial
          color={timeOfDay === 'sunset' ? '#ffbc73' : timeOfDay === 'night' ? '#eef4ff' : '#fff7dc'}
          fog={false}
        />
      </mesh>

      <DriftingClouds timeOfDay={timeOfDay} />
      {timeOfDay === 'night' && <StarField />}
      {timeOfDay === 'rain_dusk' && <RainEffect quality={quality} />}
    </>
  );
};
