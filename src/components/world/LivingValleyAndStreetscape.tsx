import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';
import { WaterSurface } from './WaterSurface';

interface LivingValleyAndStreetscapeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createValleySignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#3f2a18';
  ctx.fillRect(0, 0, 512, 160);
  ctx.strokeStyle = '#e7b968';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 144);

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEMBAH SAWAH SENJA', 256, 58);

  ctx.fillStyle = '#bbf7d0';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('◀ SAUNG BAMBU · KINCIR AIR · PEMATANG PADI', 256, 112);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

interface RiceTuftSpec {
  x: number;
  z: number;
  scale: number;
  phase: number;
  goldenMix: number;
}

/**
 * Upgrade Lingkungan Hidup Menyeluruh (Kota + Alam Pedesaan Tepian Kota Senja):
 * 1. Lembah Pematang Sawah Senja (Seberang Barat Jembatan Perumahan Selatan):
 *    - 3 Petak Sawah Berair Berkilau + Pematang Rumput Bisa Dijelajahi
 *    - 168 Rumpun Padi Hijau-Menguning (1 InstancedMesh hemat GPU) berayun mengikuti angin
 *    - Saung Bambu beratap ijuk + lentera hangat + Angklung Angin Bambu
 *    - Kincir Air Irigasi Bambu berputar mulus + Pancuran Air Bambu
 *    - Orang-Orangan Sawah (Memedi Sawah) bertopi caping + tali kaleng pengusir pipit
 *    - 5 Burung Kuntul Putih Sawah (White Egrets) mematuk tenang di petak padi
 * 2. Ekosistem Kunang-Kunang Malam Lintas-Zona (Sawah, Sungai & Danau Senja) + Capung Sore
 * 3. Zebra Cross Tambahan (Simpang Jl. Stasiun Timur & Simpang T Jl. Melati) + Bollard Trotoar Menara
 */
export const LivingValleyAndStreetscape: React.FC<LivingValleyAndStreetscapeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const valleySignTex = useMemo(() => createValleySignTexture(), []);
  const isEveningOrNight = timeOfDay !== 'morning';
  const isNight = timeOfDay === 'night';
  const isPotato = settings.graphicsQuality === 'potato';

  const riceStalkRef = useRef<THREE.InstancedMesh>(null);
  const ricePanicleRef = useRef<THREE.InstancedMesh>(null);
  const waterwheelRef = useRef<THREE.Group>(null);
  const waterStreamRef = useRef<THREE.Mesh>(null);
  const scarecrowGroupRef = useRef<THREE.Group>(null);
  const angklungGroupRef = useRef<THREE.Group>(null);
  const egretGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const fireflyMatRef = useRef<THREE.PointsMaterial>(null);
  const dragonflyGroupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastRiceAnimRef = useRef(-1);

  // 168 Rumpun Padi tersebar rapi di 3 petak sawah terasering
  const riceTufts = useMemo<RiceTuftSpec[]>(() => {
    const list: RiceTuftSpec[] = [];
    // Petak 1: Barat Utara (-90.. -76, 51.3.. 59.7) -> 8 x 6 = 48
    for (let ix = 0; ix < 8; ix++) {
      for (let iz = 0; iz < 6; iz++) {
        list.push({
          x: -89.8 + ix * 1.95 + ((iz % 2) * 0.25),
          z: 51.4 + iz * 1.62,
          scale: 0.88 + ((ix * 7 + iz * 3) % 5) * 0.07,
          phase: ix * 0.55 + iz * 0.42,
          goldenMix: ((ix + iz) % 3) * 0.35,
        });
      }
    }
    // Petak 2: Barat Selatan (-90.. -76, 65.3.. 74.7) -> 8 x 6 = 48
    for (let ix = 0; ix < 8; ix++) {
      for (let iz = 0; iz < 6; iz++) {
        list.push({
          x: -89.8 + ix * 1.95 + ((iz % 2) * 0.22),
          z: 65.4 + iz * 1.82,
          scale: 0.9 + ((ix * 5 + iz * 11) % 5) * 0.065,
          phase: 1.4 + ix * 0.5 + iz * 0.48,
          goldenMix: 0.3 + ((ix * 2 + iz) % 3) * 0.3,
        });
      }
    }
    // Petak 3: Timur Selatan (-71.2.. -63.8, 65.3.. 74.7) -> 5 x 6 = 30
    for (let ix = 0; ix < 5; ix++) {
      for (let iz = 0; iz < 6; iz++) {
        list.push({
          x: -71.1 + ix * 1.82,
          z: 65.4 + iz * 1.82,
          scale: 0.86 + ((ix * 3 + iz * 7) % 4) * 0.08,
          phase: 2.6 + ix * 0.6 + iz * 0.4,
          goldenMix: 0.2 + ((ix + iz) % 4) * 0.22,
        });
      }
    }
    return list;
  }, []);

  useEffect(() => {
    const stalkMesh = riceStalkRef.current;
    const panMesh = ricePanicleRef.current;
    if (!stalkMesh || !panMesh) return;
    const cStalk = new THREE.Color();
    const cPan = new THREE.Color();
    for (let i = 0; i < riceTufts.length; i++) {
      const g = riceTufts[i].goldenMix;
      cStalk.setRGB(0.28 + g * 0.22, 0.54 + g * 0.08, 0.22);
      cPan.setRGB(0.76 + g * 0.18, 0.68 + g * 0.12, 0.26);
      stalkMesh.setColorAt(i, cStalk);
      panMesh.setColorAt(i, cPan);
    }
    if (stalkMesh.instanceColor) stalkMesh.instanceColor.needsUpdate = true;
    if (panMesh.instanceColor) panMesh.instanceColor.needsUpdate = true;
    lastRiceAnimRef.current = -1;
  }, [riceTufts]);

  // 5 Burung Kuntul Putih Sawah
  const egrets = useMemo(
    () => [
      { x: -86.2, z: 54.8, rot: 0.7, phase: 0.3 },
      { x: -78.6, z: 57.6, rot: -1.1, phase: 1.9 },
      { x: -84.5, z: 68.8, rot: 2.1, phase: 3.4 },
      { x: -77.8, z: 72.4, rot: -0.4, phase: 4.8 },
      { x: -66.8, z: 68.4, rot: 1.2, phase: 2.7 },
    ],
    [],
  );

  // 56 Kunang-Kunang Malam melayang lembut di Sawah, Bantaran Sungai, & Tepi Danau Senja
  const fireflyPositions = useMemo(() => {
    const zones: [number, number, number][] = [
      [-82, 1.1, 56],
      [-82, 1.1, 70],
      [-68, 1.2, 62],
      [-41, 1.2, 18],
      [-57, 1.2, -14],
      [-74, 1.2, -24],
      [-88, 1.2, -16],
    ];
    const count = 56;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const z = zones[i % zones.length];
      const ang = (i * 2.39996) % (Math.PI * 2);
      const rad = 1.8 + ((i * 13) % 9) * 1.15;
      arr[i * 3] = z[0] + Math.cos(ang) * rad;
      arr[i * 3 + 1] = z[1] + ((i * 7) % 5) * 0.34;
      arr[i * 3 + 2] = z[2] + Math.sin(ang) * rad;
    }
    return arr;
  }, []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (playerRuntime.waterwheelBoostTimer > 0) {
      playerRuntime.waterwheelBoostTimer = Math.max(0, playerRuntime.waterwheelBoostTimer - dt);
    }
    if (playerRuntime.scarecrowRattleTimer > 0) {
      playerRuntime.scarecrowRattleTimer = Math.max(0, playerRuntime.scarecrowRattleTimer - dt);
    }

    // Kunang-kunang malam berkedip halus
    if (isNight && fireflyMatRef.current) {
      fireflyMatRef.current.opacity = 0.58 + Math.sin(t * 2.6) * 0.28;
    }

    // Hemat CPU bila Damar jauh dari Lembah Sawah Barat Daya
    if (shouldSkipPerfFrame(-76, 62, 62)) return;

    // 1. Putaran Kincir Air Irigasi Bambu
    if (waterwheelRef.current) {
      const wheelSpeed = 0.85 + (playerRuntime.waterwheelBoostTimer > 0 ? 1.55 : 0);
      waterwheelRef.current.rotation.z -= wheelSpeed * dt;
    }
    if (waterStreamRef.current) {
      const boost = playerRuntime.waterwheelBoostTimer > 0 ? 1.35 : 1.0;
      waterStreamRef.current.scale.set(boost, 1, boost);
    }

    // 2. Goyangan Orang-Orangan Sawah & Angklung Angin Saung
    if (scarecrowGroupRef.current) {
      const rattle =
        playerRuntime.scarecrowRattleTimer > 0
          ? Math.sin(t * 15) * 0.16 * Math.min(1, playerRuntime.scarecrowRattleTimer)
          : Math.sin(t * 1.7) * 0.035;
      scarecrowGroupRef.current.rotation.z = rattle;
    }
    if (angklungGroupRef.current) {
      const chimeWave =
        playerRuntime.windChimeTimer > 0
          ? Math.sin(t * 11) * 0.18
          : Math.sin(t * 2.1) * 0.05;
      angklungGroupRef.current.rotation.z = chimeWave;
    }

    // 3. Animasi patukan leher Burung Kuntul Putih Sawah
    for (let i = 0; i < egrets.length; i++) {
      const grp = egretGroupRefs.current[i];
      if (!grp) continue;
      const cycle = Math.sin(t * 1.35 + egrets[i].phase);
      const neck = grp.children[1];
      if (neck) {
        neck.rotation.x = cycle > 0.55 ? (cycle - 0.55) * 1.45 : Math.sin(t * 0.8 + i) * 0.06;
      }
    }

    // 4. Capung menari di atas pancuran sawah saat Pagi / Senja
    if (dragonflyGroupRef.current && (timeOfDay === 'morning' || timeOfDay === 'sunset')) {
      dragonflyGroupRef.current.children.forEach((df, idx) => {
        const a = t * (1.8 + idx * 0.35) + idx * 2.1;
        df.position.set(
          Math.cos(a) * (1.4 + idx * 0.45),
          0.95 + Math.sin(t * 3.4 + idx) * 0.22,
          Math.sin(a * 1.3) * (1.2 + idx * 0.35),
        );
        df.rotation.y = -a;
      });
    }

    // 5. Gelombang Angin Hamparan Rumpun Padi (InstancedMesh)
    const stalkMesh = riceStalkRef.current;
    const panMesh = ricePanicleRef.current;
    if (!stalkMesh || !panMesh) return;
    if (isPotato && lastRiceAnimRef.current >= 0) return;
    if (playerRuntime.perf.isLowPerf && lastRiceAnimRef.current >= 0 && t - lastRiceAnimRef.current < 0.09) {
      return;
    }
    lastRiceAnimRef.current = t;

    const windStrength = timeOfDay === 'rain_dusk' ? 0.16 : 0.095;
    for (let i = 0; i < riceTufts.length; i++) {
      const r = riceTufts[i];
      const sway = Math.sin(t * 1.85 + r.x * 0.18 + r.phase) * windStrength;
      dummy.position.set(r.x, 0.32 * r.scale, r.z);
      dummy.rotation.set(sway * 0.65, r.phase, -sway);
      dummy.scale.set(r.scale, r.scale, r.scale);
      dummy.updateMatrix();
      stalkMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(r.x + sway * 0.42, 0.68 * r.scale, r.z + sway * 0.24);
      dummy.rotation.set(0.32 + sway * 0.9, r.phase, -sway * 1.3);
      dummy.scale.set(r.scale, r.scale, r.scale);
      dummy.updateMatrix();
      panMesh.setMatrixAt(i, dummy.matrix);
    }
    stalkMesh.instanceMatrix.needsUpdate = true;
    panMesh.instanceMatrix.needsUpdate = true;
  });

  const zebraOffsets = [-3.2, -1.6, 0, 1.6, 3.2];

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. ZEBRA CROSS TAMBAHAN & BOLLARD TROTOAR KOTA MODERN                */}
      {/* ==================================================================== */}
      <group userData={{ noCull: true }}>
        {/* Zebra Cross Simpang T Jl. Melati (x = 0, z = 43.4) */}
        {zebraOffsets.map((sx, idx) => (
          <mesh
            key={`zm-${idx}`}
            position={[sx, 0.056, 43.4]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.72, 2.35]} />
            <meshStandardMaterial
              color="#f1f5f9"
              roughness={0.78}
              polygonOffset
              polygonOffsetFactor={-4}
              polygonOffsetUnits={-4}
              depthWrite={false}
            />
          </mesh>
        ))}
        {/* Zebra Cross Simpang Stasiun Timur Utara & Selatan (x = 64, z = -7.6 & +7.6) */}
        {[-7.6, 7.6].map((zz, zi) =>
          [-3.0, -1.5, 0, 1.5, 3.0].map((sx, si) => (
            <mesh
              key={`zst-${zi}-${si}`}
              position={[64 + sx, 0.056, zz]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.7, 2.3]} />
              <meshStandardMaterial
                color="#f1f5f9"
                roughness={0.78}
                polygonOffset
                polygonOffsetFactor={-4}
                polygonOffsetUnits={-4}
                depthWrite={false}
              />
            </mesh>
          )),
        )}
        {/* Bollard Pembatas Trotoar Kuning-Hitam Modern Depan Plaza Menara Nusantara */}
        {[20.5, 25.5, 30.5, 35.5, 40.5].map((bx, bi) => (
          <group key={`bol-${bi}`} position={[bx, 0, -6.35]}>
            <mesh position={[0, 0.34, 0]} castShadow>
              <cylinderGeometry args={[0.075, 0.09, 0.68, 10]} />
              <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.56, 0]}>
              <cylinderGeometry args={[0.078, 0.078, 0.11, 10]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={isEveningOrNight ? 1.4 : 0.15}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 2. GERBANG PENANDA & JALAN SETAPAK PEMATANG SAWAH SENJA              */}
      {/* ==================================================================== */}
      <group position={[-59.2, 0, 45.2]} rotation={[0, 0.38, 0]}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2.3, 8]} />
          <meshStandardMaterial color="#593a22" roughness={0.88} />
        </mesh>
        <mesh position={[0, 1.88, 0]} castShadow>
          <boxGeometry args={[1.82, 0.58, 0.1]} />
          <meshStandardMaterial color="#4a2f1a" roughness={0.82} />
        </mesh>
        <mesh position={[0, 1.88, 0.058]}>
          <planeGeometry args={[1.7, 0.48]} />
          <meshStandardMaterial
            map={valleySignTex}
            emissiveMap={valleySignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
          />
        </mesh>
        <mesh position={[0, 1.88, -0.058]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.7, 0.48]} />
          <meshStandardMaterial
            map={valleySignTex}
            emissiveMap={valleySignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
          />
        </mesh>
        {/* Lentera Bambu Hangat di Puncak Tiang Penunjuk */}
        <mesh position={[0, 2.36, 0]}>
          <cylinderGeometry args={[0.11, 0.13, 0.26, 8]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff0c2' : '#d6c7b2'}
            emissive={isEveningOrNight ? '#ffad3b' : '#000000'}
            emissiveIntensity={isEveningOrNight ? 2.6 : 0}
          />
        </mesh>
      </group>

      {/* Batu Pijakan Jalan Setapak dari Jembatan Selatan ke Saung Bambu */}
      {[
        [-59.5, 48.2],
        [-61.4, 49.4],
        [-63.3, 50.8],
        [-65.2, 52.3],
        [-67.0, 53.6],
        [-68.5, 54.4],
      ].map(([sx, sz], idx) => (
        <mesh key={`step-${idx}`} position={[sx, 0.018, sz]} rotation={[0, idx * 0.5, 0]} receiveShadow>
          <cylinderGeometry args={[0.58, 0.64, 0.04, 8]} />
          <meshStandardMaterial map={textures.paving} color="#9ca3af" roughness={0.9} />
        </mesh>
      ))}

      {/* ==================================================================== */}
      {/* 3. TIGA PETAK SAWAH BERAIR BERKILAU & PEMATANG TANAH RUMPUT          */}
      {/* ==================================================================== */}
      {[
        { cx: -83.0, cz: 55.5, w: 15.8, d: 9.8 },
        { cx: -83.0, cz: 70.0, w: 15.8, d: 10.8 },
        { cx: -67.5, cz: 70.0, w: 8.8, d: 10.8 },
      ].map((pad, pi) => (
        <group key={`paddy-${pi}`} position={[pad.cx, 0, pad.cz]}>
          {/* Permukaan Air Sawah Dangkal Memantulkan Langit Senja */}
          <WaterSurface
            position={[0, 0.015, 0]}
            size={[pad.w - 0.3, pad.d - 0.3]}
            timeOfDay={timeOfDay}
            highQuality={settings.waterReflections}
            potatoMode={isPotato}
          />
          {/* Bibir Pematang Tanah Rumput Mengelilingi Petak Sawah */}
          <mesh position={[0, 0.09, -pad.d / 2]} receiveShadow castShadow>
            <boxGeometry args={[pad.w + 0.45, 0.18, 0.48]} />
            <meshStandardMaterial color="#4d6b3c" roughness={0.94} />
          </mesh>
          <mesh position={[0, 0.09, pad.d / 2]} receiveShadow castShadow>
            <boxGeometry args={[pad.w + 0.45, 0.18, 0.48]} />
            <meshStandardMaterial color="#4d6b3c" roughness={0.94} />
          </mesh>
          <mesh position={[-pad.w / 2, 0.09, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.48, 0.18, pad.d]} />
            <meshStandardMaterial color="#4d6b3c" roughness={0.94} />
          </mesh>
          <mesh position={[pad.w / 2, 0.09, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.48, 0.18, pad.d]} />
            <meshStandardMaterial color="#4d6b3c" roughness={0.94} />
          </mesh>
        </group>
      ))}

      {/* 168 Rumpun Batang Padi & Bulir Padi Merunduk (2 InstancedMesh super-ringan!) */}
      <instancedMesh
        ref={riceStalkRef}
        args={[undefined, undefined, riceTufts.length]}
        castShadow={!isPotato}
      >
        <coneGeometry args={[0.24, 0.68, 5]} />
        <meshStandardMaterial roughness={0.86} />
      </instancedMesh>
      <instancedMesh ref={ricePanicleRef} args={[undefined, undefined, riceTufts.length]}>
        <dodecahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial roughness={0.78} />
      </instancedMesh>

      {/* ==================================================================== */}
      {/* 4. SAUNG BAMBU TEPIAN SAWAH SENJA ([-68.5, 0, 56.5])                 */}
      {/* ==================================================================== */}
      <group position={[-68.5, 0, 56.5]}>
        {/* Umpak Batu Kali & Bale-Bale Bambu Hangat */}
        {[
          [-1.55, -1.05],
          [1.55, -1.05],
          [-1.55, 1.05],
          [1.55, 1.05],
        ].map(([px, pz], idx) => (
          <group key={`spost-${idx}`} position={[px, 0, pz]}>
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.2, 0.24, 8]} />
              <meshStandardMaterial color="#57534e" roughness={0.92} />
            </mesh>
            <mesh position={[0, 1.42, 0]} castShadow>
              <cylinderGeometry args={[0.085, 0.095, 2.6, 8]} />
              <meshStandardMaterial color="#b58d4c" roughness={0.72} />
            </mesh>
          </group>
        ))}
        {/* Lantai Panggung Bale-Bale Bambu + Tikar Pandan */}
        <mesh position={[0, 0.42, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[3.35, 0.12, 2.25]} />
          <meshStandardMaterial color="#c29b59" roughness={0.76} />
        </mesh>
        <mesh position={[0, 0.49, 0.1]} receiveShadow>
          <boxGeometry args={[2.55, 0.025, 1.65]} />
          <meshStandardMaterial color="#d9be82" roughness={0.88} />
        </mesh>
        {/* Sandaran Bambu Belakang & Samping */}
        <mesh position={[0, 0.86, 1.16]} castShadow>
          <boxGeometry args={[3.25, 0.09, 0.09]} />
          <meshStandardMaterial color="#a88042" roughness={0.75} />
        </mesh>
        {/* Termos Teh Panas & 2 Cangkir Enamel Lurik Hijau di Sudut Bale */}
        <mesh position={[1.18, 0.64, 0.45]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.32, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0.92, 0.56, 0.42]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.11, 10]} />
          <meshStandardMaterial color="#dcfce7" roughness={0.45} />
        </mesh>

        {/* Atap Limasan Ijuk / Rumbia Tradisional Teduh */}
        <mesh position={[0, 2.98, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
          <coneGeometry args={[2.95, 1.38, 4]} />
          <meshStandardMaterial color="#5c4228" roughness={0.94} />
        </mesh>

        {/* Angklung Angin Bambu Tergantung di Sudut Depan Saung */}
        <group ref={angklungGroupRef} position={[-1.42, 2.38, -1.02]}>
          {[-0.12, -0.04, 0.04, 0.12].map((bx, bi) => (
            <mesh key={`angk-${bi}`} position={[bx, -0.18 - bi * 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.024, 0.28 + bi * 0.06, 7]} />
              <meshStandardMaterial color="#d4ab63" roughness={0.68} />
            </mesh>
          ))}
        </group>

        {/* Lentera Gantung Saung Menyala Hangat saat Senja & Malam */}
        <mesh position={[0, 2.34, 0]}>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff1c2' : '#cbd5e1'}
            emissive={isEveningOrNight ? '#ffae3d' : '#000000'}
            emissiveIntensity={isEveningOrNight ? 2.9 : 0}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.34, 0]} scale={[2.8, 2.8, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc76b"
              transparent
              opacity={0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight position={[0, 2.15, 0]} color="#ffc36b" intensity={13} distance={16} decay={1.7} />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 5. KINCIR AIR IRIGASI BAMBU & PANCURAN SAWAH ([-62.4, 0, 54.2])      */}
      {/* ==================================================================== */}
      <group position={[-62.4, 0, 54.2]}>
        {/* Bak Air Batu Kali Kecil */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.95, 0.36, 1.55]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.68, 1.28]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.18} metalness={0.45} />
        </mesh>
        {/* Dua Tiang Penyangga Poros Kincir Bambu */}
        {[-0.36, 0.36].map((pz, pi) => (
          <mesh key={`wwp-${pi}`} position={[0, 0.95, pz]} castShadow>
            <cylinderGeometry args={[0.06, 0.075, 1.65, 8]} />
            <meshStandardMaterial color="#8c6836" roughness={0.8} />
          </mesh>
        ))}
        {/* Roda Kincir Air Bambu 8 Sudu Berputar Real-Time */}
        <group ref={waterwheelRef} position={[0, 1.18, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.68, 10]} />
            <meshStandardMaterial color="#6e4f28" roughness={0.82} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.78, 0.035, 8, 20]} />
            <meshStandardMaterial color="#b58d4c" roughness={0.72} />
          </mesh>
          {Array.from({ length: 8 }).map((_, bi) => {
            const ang = (bi / 8) * Math.PI * 2;
            return (
              <group key={`sp-${bi}`} rotation={[0, 0, ang]}>
                <mesh position={[0, 0.39, 0]}>
                  <boxGeometry args={[0.04, 0.78, 0.42]} />
                  <meshStandardMaterial color="#a37c40" roughness={0.78} />
                </mesh>
                {/* Tabung Bambu Penampung Air di Ujung Jari-Jari */}
                <mesh position={[0.08, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.055, 0.055, 0.46, 8]} />
                  <meshStandardMaterial color="#c9a259" roughness={0.7} />
                </mesh>
              </group>
            );
          })}
        </group>
        {/* Talang Pancuran Bambu & Aliran Air Jernih */}
        <mesh position={[0.78, 1.62, 0]} rotation={[0, 0, 0.28]} castShadow>
          <cylinderGeometry args={[0.065, 0.065, 1.35, 8]} />
          <meshStandardMaterial color="#9e7b42" roughness={0.76} />
        </mesh>
        <mesh ref={waterStreamRef} position={[0.22, 0.96, 0]}>
          <cylinderGeometry args={[0.035, 0.06, 1.24, 8]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={0.68} />
        </mesh>

        {/* Capung Sore Menari di Atas Pancuran Air */}
        {(timeOfDay === 'morning' || timeOfDay === 'sunset') && !isPotato && (
          <group ref={dragonflyGroupRef} position={[0, 0.6, 0]}>
            {[0, 1, 2].map((di) => (
              <group key={`df-${di}`}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.012, 0.008, 0.16, 5]} />
                  <meshBasicMaterial color={di === 0 ? '#38bdf8' : '#fbbf24'} />
                </mesh>
                <mesh>
                  <boxGeometry args={[0.22, 0.008, 0.05]} />
                  <meshBasicMaterial color="#e0f2fe" transparent opacity={0.75} />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>

      {/* ==================================================================== */}
      {/* 6. ORANG-ORANGAN SAWAH (MEMEDI SAWAH CAPING BAMBU) ([-83.0, 0, 62.5]) */}
      {/* ==================================================================== */}
      <group position={[-83.0, 0, 62.5]}>
        <mesh position={[0, 0.95, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.065, 1.9, 8]} />
          <meshStandardMaterial color="#6e4f28" roughness={0.88} />
        </mesh>
        <group ref={scarecrowGroupRef} position={[0, 1.38, 0]}>
          {/* Palang Tangan Bambu & Baju Kotak-Kotak Petani */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.48, 7]} />
            <meshStandardMaterial color="#8c6836" roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.52, 0.62, 0.24]} />
            <meshStandardMaterial color="#b45309" roughness={0.88} />
          </mesh>
          {/* Kepala Jerami & Topi Caping Kerucut Khas Petani Indonesia */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <sphereGeometry args={[0.17, 10, 10]} />
            <meshStandardMaterial color="#dfc27d" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.44, 0]} castShadow>
            <coneGeometry args={[0.42, 0.26, 12]} />
            <meshStandardMaterial color="#c89f56" roughness={0.82} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 7. LIMA BURUNG KUNTUL PUTIH SAWAH (WHITE PADDY EGRETS)               */}
      {/* ==================================================================== */}
      {!isPotato &&
        egrets.map((eg, ei) => (
          <group
            key={`egret-${ei}`}
            ref={(el) => {
              egretGroupRefs.current[ei] = el;
            }}
            position={[eg.x, 0.04, eg.z]}
            rotation={[0, eg.rot, 0]}
          >
            {/* Badan & Kaki Ramping */}
            <group>
              <mesh position={[-0.04, 0.2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.4, 5]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
              <mesh position={[0.04, 0.2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.4, 5]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
              <mesh position={[0, 0.42, 0]} scale={[0.85, 0.85, 1.35]} castShadow>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
            </group>
            {/* Leher Panjang & Paruh Kuning */}
            <group position={[0, 0.48, 0.1]}>
              <mesh position={[0, 0.16, 0.03]} rotation={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.035, 0.32, 6]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.31, 0.06]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.3, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.02, 0.14, 6]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.5} />
              </mesh>
            </group>
          </group>
        ))}

      {/* ==================================================================== */}
      {/* 8. KUNANG-KUNANG MALAM LINTAS-ZONA (SAWAH, SUNGAI & DANAU SENJA)     */}
      {/* ==================================================================== */}
      {isNight && !isPotato && (
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={56}
              array={fireflyPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={fireflyMatRef}
            color="#d9f99d"
            size={0.34}
            transparent
            opacity={0.78}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
