import React, { useEffect, useMemo, useRef } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface AtmosphereProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const TIME_PRESETS: Record<
  TimeOfDay,
  {
    zenith: string;
    horizon: string;
    ground: string;
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
    sunGlow: string;
  }
> = {
  morning: {
    zenith: '#4a8ec9',
    horizon: '#f7d8b5',
    ground: '#b8c4c9',
    fog: '#d8e3ea',
    fogNear: 58,
    fogFar: 235,
    sunColor: '#ffeed1',
    sunIntensity: 2.1,
    sunPos: [68, 56, 48],
    hemiSky: '#c6e4ff',
    hemiGround: '#7a6957',
    hemiIntensity: 0.9,
    ambientIntensity: 0.36,
    sunGlow: '#fff4d4',
  },
  sunset: {
    zenith: '#25264f',
    horizon: '#f58653',
    ground: '#47303c',
    fog: '#c97257',
    fogNear: 46,
    fogFar: 215,
    sunColor: '#ff964f',
    sunIntensity: 2.4,
    sunPos: [-92, 22, -16],
    hemiSky: '#ffb885',
    hemiGround: '#3d2d3d',
    hemiIntensity: 0.85,
    ambientIntensity: 0.3,
    sunGlow: '#ffb76b',
  },
  rain_dusk: {
    zenith: '#1a2333',
    horizon: '#4e5d73',
    ground: '#1d2430',
    fog: '#3b485c',
    fogNear: 28,
    fogFar: 155,
    sunColor: '#8ea8cc',
    sunIntensity: 0.85,
    sunPos: [-45, 42, -24],
    hemiSky: '#6a82a6',
    hemiGround: '#1c222e',
    hemiIntensity: 0.72,
    ambientIntensity: 0.34,
    sunGlow: '#9cb3cf',
  },
  night: {
    zenith: '#070b18',
    horizon: '#1e2c48',
    ground: '#0c101a',
    fog: '#121b2e',
    fogNear: 36,
    fogFar: 195,
    sunColor: '#9ab7e6',
    sunIntensity: 0.65,
    sunPos: [-58, 62, -45],
    hemiSky: '#39517d',
    hemiGround: '#1a1514',
    hemiIntensity: 0.56,
    ambientIntensity: 0.28,
    sunGlow: '#d7e6ff',
  },
};

const SkyDome: React.FC<{ zenith: string; horizon: string; ground: string }> = ({
  zenith,
  horizon,
  ground,
}) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uZenith: { value: new THREE.Color(zenith) },
      uHorizon: { value: new THREE.Color(horizon) },
      uGround: { value: new THREE.Color(ground) },
    }),
    [],
  );

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uZenith.value.set(zenith);
    matRef.current.uniforms.uHorizon.value.set(horizon);
    matRef.current.uniforms.uGround.value.set(ground);
  }, [zenith, horizon, ground]);

  return (
    <mesh scale={[-1, 1, 1]} frustumCulled={false}>
      <sphereGeometry args={[215, 28, 20]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={`
          uniform vec3 uZenith;
          uniform vec3 uHorizon;
          uniform vec3 uGround;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;
            vec3 col;
            if (h >= 0.0) {
              float t = pow(clamp(h, 0.0, 1.0), 0.52);
              col = mix(uHorizon, uZenith, t);
            } else {
              float t = clamp(-h * 3.5, 0.0, 1.0);
              col = mix(uHorizon, uGround, t);
            }
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
};

const RainEffect: React.FC<{ density: GameSettings['particleDensity'] }> = ({ density }) => {
  const count = density === 'low' ? 320 : density === 'medium' ? 750 : 1300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        ox: (Math.random() - 0.5) * 56,
        oy: Math.random() * 24 + 1,
        oz: (Math.random() - 0.5) * 56,
        speed: 16 + Math.random() * 9,
      })),
    [count],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const [px, py, pz] = playerRuntime.position;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      const d = drops[i];
      d.oy -= d.speed * dt;
      if (d.oy < -0.5) {
        d.oy = 23 + Math.random() * 5;
        d.ox = (Math.random() - 0.5) * 56;
        d.oz = (Math.random() - 0.5) * 56;
      }
      dummy.position.set(px + d.ox, py + d.oy, pz + d.oz);
      dummy.rotation.set(0.11, 0, 0.07);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.02, 0.95, 0.02]} />
      <meshBasicMaterial color="#cde0f7" transparent opacity={0.44} depthWrite={false} />
    </instancedMesh>
  );
};

const AmbientParticles: React.FC<{
  timeOfDay: TimeOfDay;
  density: GameSettings['particleDensity'];
}> = ({ timeOfDay, density }) => {
  const count = density === 'low' ? 40 : density === 'medium' ? 95 : 170;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 165;
      arr[i * 3 + 1] = 0.8 + Math.random() * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 145;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.65) * 0.35;
  });

  if (timeOfDay === 'rain_dusk') return null;

  const color =
    timeOfDay === 'night' ? '#ffe082' : timeOfDay === 'sunset' ? '#ffd194' : '#fff7db';

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={timeOfDay === 'night' ? 0.32 : 0.24}
        transparent
        opacity={timeOfDay === 'night' ? 0.85 : 0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const DriftingClouds: React.FC<{ timeOfDay: TimeOfDay }> = ({ timeOfDay }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cloudColor =
    timeOfDay === 'morning'
      ? '#ffffff'
      : timeOfDay === 'sunset'
        ? '#ffad85'
        : timeOfDay === 'rain_dusk'
          ? '#4f5c70'
          : '#212d47';

  const clouds = useMemo(
    () => [
      { x: -85, y: 52, z: -68, s: 1.5 },
      { x: -12, y: 58, z: -92, s: 2.1 },
      { x: 64, y: 54, z: -42, s: 1.6 },
      { x: 28, y: 60, z: 42, s: 1.8 },
      { x: -62, y: 56, z: 50, s: 1.4 },
      { x: 95, y: 50, z: 18, s: 1.7 },
      { x: -35, y: 53, z: 4, s: 1.3 },
    ],
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      child.position.x += delta * (0.7 + (idx % 3) * 0.25);
      if (child.position.x > 155) child.position.x = -155;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, idx) => (
        <group key={idx} position={[c.x, c.y, c.z]} scale={c.s}>
          <mesh>
            <sphereGeometry args={[6.2, 10, 8]} />
            <meshBasicMaterial
              color={cloudColor}
              transparent
              opacity={timeOfDay === 'night' ? 0.24 : 0.58}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[5.8, -0.8, 0.8]} scale={[1.15, 0.62, 0.85]}>
            <sphereGeometry args={[5.2, 10, 8]} />
            <meshBasicMaterial
              color={cloudColor}
              transparent
              opacity={timeOfDay === 'night' ? 0.24 : 0.58}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-5.4, -0.9, -0.6]} scale={[1.1, 0.58, 0.8]}>
            <sphereGeometry args={[4.8, 10, 8]} />
            <meshBasicMaterial
              color={cloudColor}
              transparent
              opacity={timeOfDay === 'night' ? 0.24 : 0.58}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const StarField: React.FC = () => {
  const positions = useMemo(() => {
    const arr = new Float32Array(380 * 3);
    for (let i = 0; i < 380; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.42;
      const r = 185;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={380} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#fff7e3" size={1.15} transparent opacity={0.9} fog={false} />
    </points>
  );
};

export const Atmosphere: React.FC<AtmosphereProps> = ({ timeOfDay, settings }) => {
  const { scene, gl } = useThree();
  const preset = TIME_PRESETS[timeOfDay];
  const textures = useMemo(() => getProceduralTextures(), []);

  const fogScale =
    settings.drawDistance === 'near' ? 0.72 : settings.drawDistance === 'medium' ? 1.0 : 1.32;

  useEffect(() => {
    scene.background = new THREE.Color(preset.horizon);
    scene.fog = new THREE.Fog(preset.fog, preset.fogNear * fogScale, preset.fogFar * fogScale);
    gl.toneMappingExposure = settings.exposure;
  }, [scene, gl, preset, fogScale, settings.exposure]);

  const castShadow = settings.shadowQuality !== 'off';
  const shadowSize = settings.shadowQuality === 'sharp' ? 2048 : 1024;

  return (
    <>
      <SkyDome zenith={preset.zenith} horizon={preset.horizon} ground={preset.ground} />

      {/* Real-time Image-Based Lighting (IBL) untuk pantulan realistis kaca gedung, mobil & aspal basah */}
      {settings.waterReflections && (
        <Environment resolution={256} frames={1} key={`env-${timeOfDay}`}>
          <Lightformer
            form="ring"
            intensity={timeOfDay === 'night' ? 0.8 : 2.2}
            color={preset.sunGlow}
            scale={18}
            position={preset.sunPos}
            target={[0, 0, 0]}
          />
          <Lightformer
            form="rect"
            intensity={timeOfDay === 'night' ? 0.6 : 1.4}
            color={preset.horizon}
            scale={[50, 14, 1]}
            position={[0, 10, -40]}
          />
          <Lightformer
            form="rect"
            intensity={timeOfDay === 'night' ? 0.45 : 1.0}
            color={preset.zenith}
            scale={[60, 60, 1]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 35, 0]}
          />
          <Lightformer
            form="rect"
            intensity={timeOfDay === 'night' ? 0.55 : 0.7}
            color="#ffba6b"
            scale={[40, 8, 1]}
            position={[0, 4, 40]}
          />
        </Environment>
      )}

      <ambientLight intensity={preset.ambientIntensity} color={preset.hemiSky} />
      <hemisphereLight args={[preset.hemiSky, preset.hemiGround, preset.hemiIntensity]} />
      <directionalLight
        position={preset.sunPos}
        intensity={preset.sunIntensity}
        color={preset.sunColor}
        castShadow={castShadow}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={5}
        shadow-camera-far={240}
        shadow-camera-left={-105}
        shadow-camera-right={105}
        shadow-camera-top={105}
        shadow-camera-bottom={-105}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      {/* Matahari / Bulan + Halo Sinematik */}
      <group position={preset.sunPos}>
        <mesh>
          <sphereGeometry args={[timeOfDay === 'night' ? 3.5 : 6.0, 20, 20]} />
          <meshBasicMaterial color={preset.sunGlow} fog={false} />
        </mesh>
        {settings.cinematicGlow && (
          <sprite scale={[timeOfDay === 'sunset' ? 42 : 28, timeOfDay === 'sunset' ? 42 : 28, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color={preset.sunGlow}
              transparent
              opacity={timeOfDay === 'sunset' ? 0.78 : 0.48}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog={false}
            />
          </sprite>
        )}
      </group>

      <DriftingClouds timeOfDay={timeOfDay} />
      {timeOfDay === 'night' && <StarField />}
      {timeOfDay === 'rain_dusk' && <RainEffect density={settings.particleDensity} />}
      <AmbientParticles timeOfDay={timeOfDay} density={settings.particleDensity} />
    </>
  );
};
