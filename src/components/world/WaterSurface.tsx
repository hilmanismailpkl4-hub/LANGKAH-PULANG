import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDay } from '../../types/game';

interface WaterSurfaceProps {
  position: [number, number, number];
  size: [number, number];
  timeOfDay: TimeOfDay;
  highQuality: boolean;
}

const WATER_PALETTES: Record<
  TimeOfDay,
  { deep: string; shallow: string; skyReflect: string; sunColor: string; sunDir: [number, number, number] }
> = {
  morning: {
    deep: '#1b4d6b',
    shallow: '#3f8da8',
    skyReflect: '#c8e4f5',
    sunColor: '#fff3cf',
    sunDir: [0.62, 0.55, 0.45],
  },
  sunset: {
    deep: '#242b47',
    shallow: '#594a63',
    skyReflect: '#f5955d',
    sunColor: '#ffbe6b',
    sunDir: [-0.88, 0.24, -0.18],
  },
  rain_dusk: {
    deep: '#172330',
    shallow: '#2a3e52',
    skyReflect: '#5c708a',
    sunColor: '#9fb8d9',
    sunDir: [-0.55, 0.52, -0.3],
  },
  night: {
    deep: '#0a1426',
    shallow: '#142642',
    skyReflect: '#283d63',
    sunColor: '#ffcb78',
    sunDir: [-0.55, 0.45, -0.35],
  },
};

/**
 * Permukaan air GLSL shader dengan riak multi-gelombang, refleksi Fresnel langit/senja,
 * kilau matahari/lampu kota, dan buih tepian halus.
 */
export const WaterSurface: React.FC<WaterSurfaceProps> = ({
  position,
  size,
  timeOfDay,
  highQuality,
}) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const palette = WATER_PALETTES[timeOfDay];

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(palette.deep) },
      uShallow: { value: new THREE.Color(palette.shallow) },
      uSky: { value: new THREE.Color(palette.skyReflect) },
      uSunCol: { value: new THREE.Color(palette.sunColor) },
      uSunDir: { value: new THREE.Vector3(...palette.sunDir).normalize() },
      uReflectStrength: { value: highQuality ? 1.0 : 0.45 },
      uRainRipple: { value: timeOfDay === 'rain_dusk' ? 1.0 : 0.0 },
    }),
    [],
  );

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uDeep.value.set(palette.deep);
    matRef.current.uniforms.uShallow.value.set(palette.shallow);
    matRef.current.uniforms.uSky.value.set(palette.skyReflect);
    matRef.current.uniforms.uSunCol.value.set(palette.sunColor);
    matRef.current.uniforms.uSunDir.value.set(...palette.sunDir).normalize();
    matRef.current.uniforms.uReflectStrength.value = highQuality ? 1.0 : 0.45;
    matRef.current.uniforms.uRainRipple.value = timeOfDay === 'rain_dusk' ? 1.0 : 0.0;
  }, [palette, highQuality, timeOfDay]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += Math.min(delta, 0.05);
    }
  });

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size[0], size[1], 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uDeep;
          uniform vec3 uShallow;
          uniform vec3 uSky;
          uniform vec3 uSunCol;
          uniform vec3 uSunDir;
          uniform float uReflectStrength;
          uniform float uRainRipple;

          varying vec3 vWorldPos;
          varying vec2 vUv;

          float wave(vec2 p, float t) {
            float w = 0.0;
            w += sin(p.x * 0.85 + t * 1.45 + sin(p.y * 0.4)) * 0.45;
            w += sin(p.y * 1.15 - t * 1.85 + cos(p.x * 0.65)) * 0.35;
            w += sin((p.x + p.y) * 2.1 + t * 2.3) * 0.18;
            if (uRainRipple > 0.5) {
              w += sin(length(fract(p * 0.45) - 0.5) * 32.0 - t * 9.5) * 0.22;
            }
            return w;
          }

          void main() {
            vec2 wp = vWorldPos.xz;
            float e = 0.18;
            float hC = wave(wp, uTime);
            float hX = wave(wp + vec2(e, 0.0), uTime);
            float hZ = wave(wp + vec2(0.0, e), uTime);
            vec3 N = normalize(vec3((hC - hX) * 0.42, 1.0, (hC - hZ) * 0.42));

            vec3 V = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2);
            fresnel = clamp(fresnel * 0.88 + 0.08, 0.0, 0.95) * uReflectStrength;

            // Kedalaman tepian halus
            float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
            float shoreMix = smoothstep(0.0, 0.14, edge);
            vec3 waterBase = mix(uShallow, uDeep, shoreMix);

            // Campur refleksi langit Fresnel
            vec3 col = mix(waterBase, uSky, fresnel);

            // Kilau spekular matahari / lampu kota di puncak riak
            vec3 H = normalize(uSunDir + V);
            float spec = pow(max(dot(N, H), 0.0), 96.0) * 1.35 * uReflectStrength;
            float softGlint = pow(max(dot(N, H), 0.0), 18.0) * 0.28 * uReflectStrength;
            col += uSunCol * (spec + softGlint);

            // Pantulan hangat lampu jembatan di dekat z = 0
            float bridgeGlow = exp(-abs(vWorldPos.z) * 0.14) * exp(-abs(vWorldPos.x + 48.0) * 0.08);
            col += vec3(1.0, 0.72, 0.36) * bridgeGlow * (0.22 + 0.18 * max(hC, 0.0)) * uReflectStrength;

            // Buih tepian super tipis
            float foam = (1.0 - smoothstep(0.0, 0.025, edge)) * (0.45 + 0.35 * sin(uTime * 2.0 + wp.y * 2.5));
            col = mix(col, vec3(0.92, 0.95, 0.98), clamp(foam * 0.35, 0.0, 0.4));

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
};
