import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';

interface NatureAndRainbowProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

interface LeafInstance {
  originX: number;
  originZ: number;
  x: number;
  y: number;
  z: number;
  fallSpeed: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  scale: number;
  restTimer: number;
}

// Titik kanopi pohon utama di Taman Kota, Tepi Danau & Perumahan Melati
const LEAF_CANOPY_ZONES: [number, number][] = [
  [-65, -4],
  [-74, -4],
  [-86, -6],
  [-68, -45],
  [-63, -34],
  [-64, -16],
  [-74, 12],
  [-90, 10],
  [-66, 28],
  [-78, 38],
  [-31, 56],
  [-10, 56],
  [5, 56],
  [21, 56],
  [-36, 16],
  [-36, 32],
];

const LEAF_COLORS = ['#d4903b', '#b85d38', '#e5bc5b', '#8c9648', '#a85f32', '#cf9c4a'];

/**
 * 1. Daun Kering Gugur Melayang Tertiup Angin (InstancedMesh ringan 1 draw call)
 * 2. Pelangi Tipis Pastel di Langit Barat (Danau Senja) yang muncul lembut setelah hujan reda!
 */
export const NatureAndRainbow: React.FC<NatureAndRainbowProps> = ({ timeOfDay, settings }) => {
  const rainbowActiveUntil = useGameStore((s) => s.rainbowActiveUntil);
  const isPotato = settings.graphicsQuality === 'potato';
  const leafCount = isPotato ? 0 : settings.particleDensity === 'low' ? 24 : settings.particleDensity === 'medium' ? 46 : 64;

  const leafMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rainbowMatRef = useRef<THREE.ShaderMaterial>(null);
  const outerRainbowMatRef = useRef<THREE.ShaderMaterial>(null);
  const rainbowOpacityRef = useRef(0);

  const leavesRef = useRef<LeafInstance[] | null>(null);
  if (!leavesRef.current) {
    leavesRef.current = Array.from({ length: 64 }, (_, i) => {
      const [zx, zz] = LEAF_CANOPY_ZONES[i % LEAF_CANOPY_ZONES.length];
      const ang = (i * 2.39996) % (Math.PI * 2);
      const rad = 0.8 + ((i * 17) % 10) * 0.45;
      const ox = zx + Math.cos(ang) * rad;
      const oz = zz + Math.sin(ang) * rad;
      return {
        originX: ox,
        originZ: oz,
        x: ox,
        y: 0.4 + ((i * 13) % 100) * 0.056,
        z: oz,
        fallSpeed: 0.42 + (i % 5) * 0.11,
        swayAmp: 0.75 + (i % 4) * 0.35,
        swayFreq: 1.15 + (i % 5) * 0.28,
        phase: i * 1.17,
        rotSpeedX: 1.2 + (i % 4) * 0.55,
        rotSpeedY: 0.9 + (i % 3) * 0.65,
        rotSpeedZ: 1.5 + (i % 5) * 0.45,
        scale: 0.75 + (i % 4) * 0.18,
        restTimer: 0,
      };
    });
  }

  // Warna organik tiap helai daun kering pada InstancedMesh
  useEffect(() => {
    const mesh = leafMeshRef.current;
    if (!mesh) return;
    const c = new THREE.Color();
    for (let i = 0; i < leafCount; i++) {
      c.set(LEAF_COLORS[i % LEAF_COLORS.length]);
      mesh.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [leafCount]);

  // Shader Pelangi Pastel Transparan Halus (tanpa garis patah kartun, menyatu lembut dengan langit!)
  const rainbowUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uInnerRatio: { value: 62 / 75 },
    }),
    [],
  );
  const outerRainbowUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uInnerRatio: { value: 79 / 88 },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // === 1. ANIMASI DAUN GUGUR MELAYANG TERTIUP ANGIN ===
    const mesh = leafMeshRef.current;
    const leaves = leavesRef.current;
    const skipLeafFrame = playerRuntime.perf.isLowPerf && (playerRuntime.perf.frameIndex & 1) === 1;
    if (mesh && leaves && leafCount > 0 && !skipLeafFrame) {
      const leafDt = playerRuntime.perf.isLowPerf ? dt * 2 : dt;
      const windX = timeOfDay === 'rain_dusk' ? 1.55 : timeOfDay === 'sunset' ? 0.92 : 0.48;
      const windZ = timeOfDay === 'rain_dusk' ? 0.65 : 0.28;

      for (let i = 0; i < leafCount; i++) {
        const lf = leaves[i];
        if (lf.restTimer > 0) {
          lf.restTimer -= leafDt;
          if (lf.restTimer <= 0) {
            lf.x = lf.originX + Math.sin(t + i) * 1.4;
            lf.z = lf.originZ + Math.cos(t + i) * 1.4;
            lf.y = 4.9 + (i % 4) * 0.55;
          }
          dummy.position.set(lf.x, 0.035, lf.z);
          dummy.rotation.set(Math.PI / 2, lf.phase, 0);
          dummy.scale.set(lf.scale, lf.scale, lf.scale);
        } else {
          lf.y -= lf.fallSpeed * leafDt;
          lf.x += (windX + Math.cos(t * lf.swayFreq + lf.phase) * lf.swayAmp) * leafDt;
          lf.z += (windZ + Math.sin(t * lf.swayFreq * 0.8 + lf.phase) * lf.swayAmp * 0.6) * leafDt;

          if (lf.y <= 0.04) {
            lf.y = 0.035;
            lf.restTimer = 1.6 + (i % 3) * 0.7;
          }

          dummy.position.set(lf.x, lf.y, lf.z);
          dummy.rotation.set(
            t * lf.rotSpeedX + lf.phase,
            t * lf.rotSpeedY + lf.phase * 0.7,
            t * lf.rotSpeedZ,
          );
          dummy.scale.set(lf.scale, lf.scale, lf.scale);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // === 2. FADE IN / OUT PELANGI TIPIS SETELAH HUJAN REDA ===
    const now = Date.now();
    const canShowRainbow =
      (timeOfDay === 'morning' || timeOfDay === 'sunset') && rainbowActiveUntil > now;
    const remainingSec = Math.max(0, (rainbowActiveUntil - now) / 1000);
    const endFade = remainingSec < 8 ? remainingSec / 8 : 1;
    const targetOp = canShowRainbow ? (timeOfDay === 'sunset' ? 0.5 : 0.44) * endFade : 0;

    rainbowOpacityRef.current = THREE.MathUtils.lerp(rainbowOpacityRef.current, targetOp, Math.min(1, dt * 1.35));

    if (rainbowMatRef.current) {
      rainbowMatRef.current.uniforms.uOpacity.value = rainbowOpacityRef.current;
    }
    if (outerRainbowMatRef.current) {
      outerRainbowMatRef.current.uniforms.uOpacity.value = rainbowOpacityRef.current * 0.34;
    }
  });

  const rainbowFragShader = `
    uniform float uOpacity;
    uniform float uInnerRatio;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      float r = length(p);
      float band = clamp((r - uInnerRatio) / max(0.01, 1.0 - uInnerRatio), 0.0, 1.0);
      // Sudut lengkungan (0 di kaki kanan, PI di kaki kiri) -> memudar halus dekat cakrawala
      float ang = atan(p.y, p.x);
      float horizonFade = smoothstep(0.02, 0.28, ang) * smoothstep(3.12, 2.86, ang);
      float edgeSoft = smoothstep(0.0, 0.16, band) * smoothstep(1.0, 0.84, band);

      // Gradien spektral pastel realistis: ungu lembut -> biru -> hijau -> kuning -> jingga -> merah muda
      vec3 cViolet = vec3(0.58, 0.48, 0.92);
      vec3 cBlue   = vec3(0.36, 0.72, 0.98);
      vec3 cGreen  = vec3(0.45, 0.86, 0.58);
      vec3 cYellow = vec3(0.99, 0.88, 0.42);
      vec3 cOrange = vec3(0.98, 0.62, 0.32);
      vec3 cRed    = vec3(0.95, 0.40, 0.38);

      vec3 col = mix(cViolet, cBlue, smoothstep(0.05, 0.25, band));
      col = mix(col, cGreen, smoothstep(0.25, 0.46, band));
      col = mix(col, cYellow, smoothstep(0.46, 0.66, band));
      col = mix(col, cOrange, smoothstep(0.66, 0.82, band));
      col = mix(col, cRed, smoothstep(0.82, 0.96, band));

      float alpha = uOpacity * edgeSoft * horizonFade;
      if (alpha < 0.004) discard;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  const rainbowVertShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  return (
    <group>
      {/* Daun Kering Gugur di Taman Kota & Perumahan */}
      {leafCount > 0 && (
        <instancedMesh ref={leafMeshRef} args={[undefined, undefined, leafCount]} frustumCulled={false}>
          <planeGeometry args={[0.16, 0.1]} />
          <meshStandardMaterial
            roughness={0.85}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </instancedMesh>
      )}

      {/* Pelangi Tipis Melengkung di Langit Barat Atas Danau Senja (Setelah Hujan Reda) */}
      <group position={[-86, -4, -56]} rotation={[0, 0.54, 0]}>
        {/* Busur Pelangi Utama */}
        <mesh frustumCulled={false}>
          <ringGeometry args={[62, 75, 64, 1, 0, Math.PI]} />
          <shaderMaterial
            ref={rainbowMatRef}
            uniforms={rainbowUniforms}
            vertexShader={rainbowVertShader}
            fragmentShader={rainbowFragShader}
            transparent
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Busur Sekunder Sangat Tipis di Luar Pelangi Utama */}
        <mesh frustumCulled={false}>
          <ringGeometry args={[79, 88, 64, 1, 0, Math.PI]} />
          <shaderMaterial
            ref={outerRainbowMatRef}
            uniforms={outerRainbowUniforms}
            vertexShader={rainbowVertShader}
            fragmentShader={rainbowFragShader}
            transparent
            depthWrite={false}
            fog={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};
