import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface ParkPlaygroundAndKoiProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

interface KoiFishState {
  x: number;
  z: number;
  yaw: number;
  baseAngle: number;
  orbitR: number;
  speed: number;
  bodyColor: string;
  spotColor: string;
  scale: number;
  phase: number;
}

const KOI_PALETTES: [string, string][] = [
  ['#f26a2e', '#fff7ee'], // Kohaku Oranye-Putih
  ['#f7c548', '#fff4cc'], // Yamabuki Emas
  ['#fff8f0', '#e03e2d'], // Tancho Putih-Merah
  ['#eb5e28', '#252422'], // Hi Utsuri
  ['#f59f38', '#ffffff'],
];

/**
 * Taman Bermain Anak (Ayunan Ganda Bergerak + Perosotan + Bangku),
 * Kawanan 9 Ikan Koi Danau Senja (reaktif terhadap pelet pakan!),
 * dan Layang-Layang Sore yang terbang tinggi dengan benang & ekor pita meliuk.
 */
export const ParkPlaygroundAndKoi: React.FC<ParkPlaygroundAndKoiProps> = ({
  timeOfDay,
  settings,
}) => {
  const isEveningOrNight = timeOfDay !== 'morning';
  const isFlyingKite = useGameStore((s) => s.isFlyingKite);
  const textures = useMemo(() => getProceduralTextures(), []);

  // === 1. REFS AYUNAN GANDA ===
  const swingLeftRef = useRef<THREE.Group>(null);
  const swingRightRef = useRef<THREE.Group>(null);

  // === 2. REFS KAWANAN 9 IKAN KOI + RIAK AIR ===
  const koiDataRef = useRef<KoiFishState[]>(
    Array.from({ length: 9 }, (_, i) => {
      const [bodyColor, spotColor] = KOI_PALETTES[i % KOI_PALETTES.length];
      const angle = (i / 9) * Math.PI * 2;
      const orbitR = 1.6 + (i % 3) * 0.95;
      return {
        x: -73.4 + Math.cos(angle) * orbitR,
        z: -23.3 + Math.sin(angle) * orbitR,
        yaw: angle + Math.PI / 2,
        baseAngle: angle,
        orbitR,
        speed: 0.65 + (i % 4) * 0.14,
        bodyColor,
        spotColor,
        scale: 0.85 + (i % 3) * 0.16,
        phase: i * 1.3,
      };
    }),
  );
  const koiGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const koiTailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const rippleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pelletGroupRef = useRef<THREE.Group>(null);

  // === 3. REFS LAYANG-LAYANG & BENANG ===
  const kiteRef = useRef<THREE.Group>(null);
  const kiteTailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const kiteStringRef = useRef<THREE.Mesh>(null);
  const tmpStart = useMemo(() => new THREE.Vector3(), []);
  const tmpEnd = useMemo(() => new THREE.Vector3(), []);
  const tmpMid = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);
  const tmpUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();
    const store = useGameStore.getState();

    // --- A. ANIMASI AYUNAN GANDA TAMAN BERMAIN ---
    if (playerRuntime.swingBoostTimer > 0) {
      playerRuntime.swingBoostTimer = Math.max(0, playerRuntime.swingBoostTimer - dt);
    }
    const boostFactor = Math.min(1, playerRuntime.swingBoostTimer / 2.2);
    const ampL = 0.08 + boostFactor * 0.68;
    const ampR = 0.06 + boostFactor * 0.42;
    if (swingLeftRef.current) {
      swingLeftRef.current.rotation.x = Math.sin(t * (boostFactor > 0.05 ? 2.85 : 1.45)) * ampL;
    }
    if (swingRightRef.current) {
      swingRightRef.current.rotation.x = Math.sin(t * 2.1 + 1.3) * ampR;
    }

    // --- B. ANIMASI KAWANAN 9 IKAN KOI & PELET PAKAN ---
    if (playerRuntime.koiFeedTimer > 0) {
      playerRuntime.koiFeedTimer = Math.max(0, playerRuntime.koiFeedTimer - dt);
    }
    const feeding = playerRuntime.koiFeedTimer > 0;
    const [feedX, feedZ] = playerRuntime.koiFeedPoint;

    koiDataRef.current.forEach((fish, i) => {
      const grp = koiGroupRefs.current[i];
      if (!grp) return;

      let targetX: number;
      let targetZ: number;
      let moveSpd: number;

      if (feeding) {
        // Semua koi berkerumun ceria di sekitar titik pelet!
        const swarmAng = t * 1.45 + fish.phase;
        const swarmR = 0.32 + (i % 3) * 0.28;
        targetX = feedX + Math.cos(swarmAng) * swarmR;
        targetZ = feedZ + Math.sin(swarmAng) * swarmR;
        moveSpd = 2.45;
      } else {
        fish.baseAngle += dt * fish.speed * 0.35;
        targetX = -73.4 + Math.cos(fish.baseAngle) * fish.orbitR;
        targetZ = -23.1 + Math.sin(fish.baseAngle) * (fish.orbitR * 0.72);
        moveSpd = 0.95;
      }

      const dx = targetX - fish.x;
      const dz = targetZ - fish.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 0.04) {
        const step = Math.min(dist, moveSpd * dt);
        fish.x += (dx / dist) * step;
        fish.z += (dz / dist) * step;

        const desiredYaw = Math.atan2(dx, dz);
        let diff = desiredYaw - fish.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        fish.yaw += diff * Math.min(1, dt * 6.5);
      }

      // Batasi selalu di dalam air selatan dermaga
      fish.x = THREE.MathUtils.clamp(fish.x, -77.0, -70.6);
      fish.z = THREE.MathUtils.clamp(fish.z, -25.4, -19.2);

      grp.position.set(
        fish.x,
        feeding ? -0.15 + Math.sin(t * 7 + fish.phase) * 0.025 : -0.22 + Math.sin(t * 2 + fish.phase) * 0.015,
        fish.z,
      );
      grp.rotation.y = fish.yaw;

      const tail = koiTailRefs.current[i];
      if (tail) {
        tail.rotation.y = Math.sin(t * (feeding ? 15 : 8.5) + fish.phase) * 0.38;
      }
    });

    if (pelletGroupRef.current) {
      pelletGroupRef.current.visible = feeding;
      if (feeding) {
        pelletGroupRef.current.position.set(feedX, -0.11, feedZ);
        pelletGroupRef.current.rotation.y = t * 0.4;
      }
    }

    rippleRefs.current.forEach((rm, idx) => {
      if (!rm) return;
      rm.visible = feeding;
      if (!feeding) return;
      const p = ((t * 0.9 + idx * 0.33) % 1 + 1) % 1;
      const sc = 0.35 + p * 2.4;
      rm.position.set(feedX + (idx - 1) * 0.25, -0.11, feedZ + (idx % 2 === 0 ? 0.15 : -0.15));
      rm.scale.set(sc, sc, 1);
      const mat = rm.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - p) * 0.55;
    });

    // --- C. ANIMASI LAYANG-LAYANG TERBANG + BENANG KE TANGAN DAMAR ---
    if (playerRuntime.kitePullBoost > 0) {
      playerRuntime.kitePullBoost = Math.max(0, playerRuntime.kitePullBoost - dt * 0.85);
    }

    if (kiteRef.current) {
      if (store.isFlyingKite) {
        const targetH = 8.5 + playerRuntime.kitePullBoost * 5.2 + Math.sin(t * 0.9) * 1.1;
        playerRuntime.kiteHeight = THREE.MathUtils.lerp(playerRuntime.kiteHeight, targetH, dt * 2.5);

        const [px, py, pz] = playerRuntime.position;
        const kx = px - 7.8 + Math.sin(t * 0.85) * 2.6;
        const ky = py + playerRuntime.kiteHeight;
        const kz = pz - 6.5 + Math.cos(t * 0.65) * 2.2;

        kiteRef.current.position.set(kx, ky, kz);
        kiteRef.current.rotation.set(
          -0.42 + Math.sin(t * 2.1) * 0.12,
          0.65 + Math.cos(t * 1.1) * 0.2,
          Math.sin(t * 1.7) * 0.28,
        );

        // Ekor 5 pita menari bergelombang mengikuti angin
        kiteTailRefs.current.forEach((tm, idx) => {
          if (!tm) return;
          const seg = idx + 1;
          tm.position.set(
            Math.sin(t * 4.5 - seg * 0.65) * 0.16 * seg,
            -0.68 - seg * 0.42,
            Math.cos(t * 3.6 - seg * 0.55) * 0.1 * seg,
          );
          tm.rotation.z = Math.sin(t * 5.0 - seg * 0.7) * 0.45;
        });

        // Hubungkan benang tipis persis dari tangan kanan Damar ke rangka layang-layang!
        if (kiteStringRef.current) {
          kiteStringRef.current.visible = true;
          const handX = px + Math.cos(playerRuntime.rotationY) * -0.25 + Math.sin(playerRuntime.rotationY) * 0.35;
          const handZ = pz - Math.sin(playerRuntime.rotationY) * -0.25 + Math.cos(playerRuntime.rotationY) * 0.35;
          tmpStart.set(handX, py + 1.52, handZ);
          tmpEnd.set(kx, ky, kz);
          tmpMid.addVectors(tmpStart, tmpEnd).multiplyScalar(0.5);
          tmpDir.subVectors(tmpEnd, tmpStart);
          const len = Math.max(0.1, tmpDir.length());
          tmpDir.divideScalar(len);
          tmpQuat.setFromUnitVectors(tmpUp, tmpDir);

          kiteStringRef.current.position.copy(tmpMid);
          kiteStringRef.current.quaternion.copy(tmpQuat);
          kiteStringRef.current.scale.set(1, len, 1);
        }
      } else {
        // Bersandar santai di patok lapangan taman saat tidak diterbangkan
        kiteRef.current.position.set(-87.5, 0.72, 22.5);
        kiteRef.current.rotation.set(-0.25, 0.5, 0.12);
        kiteTailRefs.current.forEach((tm, idx) => {
          if (!tm) return;
          const seg = idx + 1;
          tm.position.set(seg * 0.12, -0.58 + seg * 0.02, 0.08 * seg);
          tm.rotation.z = 0.25;
        });
        if (kiteStringRef.current) {
          kiteStringRef.current.visible = false;
        }
      }
    }
  });

  return (
    <group>
      {/* ================================================================= */}
      {/* 1. SUDUT TAMAN BERMAIN ANAK (SELATAN TAMAN KOTA: [-80.5, 0, 22])  */}
      {/* ================================================================= */}
      <group>
        {/* Alas Pasir Lembut Taman Bermain + Bingkai Kayu */}
        <mesh position={[-80.4, 0.02, 22.2]} receiveShadow>
          <boxGeometry args={[11.6, 0.05, 8.8]} />
          <meshStandardMaterial color="#d8c39b" roughness={0.95} />
        </mesh>

        {/* === AYUNAN GANDA BERGERAK ([-81.8, 0, 20.5]) === */}
        <group position={[-81.8, 0, 20.5]}>
          {/* Tiang A-Frame Kiri & Kanan */}
          {[-1.9, 1.9].map((ax, ai) => (
            <group key={`af-${ai}`} position={[ax, 0, 0]}>
              <mesh position={[0, 1.48, -0.52]} rotation={[0.28, 0, 0]} castShadow>
                <cylinderGeometry args={[0.075, 0.085, 3.1, 10]} />
                <meshStandardMaterial color="#3b7ca5" roughness={0.45} metalness={0.35} />
              </mesh>
              <mesh position={[0, 1.48, 0.52]} rotation={[-0.28, 0, 0]} castShadow>
                <cylinderGeometry args={[0.075, 0.085, 3.1, 10]} />
                <meshStandardMaterial color="#3b7ca5" roughness={0.45} metalness={0.35} />
              </mesh>
            </group>
          ))}
          {/* Palang Atas Horizontal */}
          <mesh position={[0, 2.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.085, 0.085, 4.2, 12]} />
            <meshStandardMaterial color="#e8b84b" roughness={0.4} metalness={0.35} />
          </mesh>

          {/* Kursi Ayunan Kiri (pivot di palang atas y=2.9) */}
          <group ref={swingLeftRef} position={[-0.78, 2.9, 0]}>
            <mesh position={[-0.32, -1.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 2.1, 6]} />
              <meshStandardMaterial color="#c4ccd6" metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0.32, -1.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 2.1, 6]} />
              <meshStandardMaterial color="#c4ccd6" metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0, -2.12, 0]} castShadow>
              <boxGeometry args={[0.78, 0.08, 0.36]} />
              <meshStandardMaterial color="#d96b52" roughness={0.6} />
            </mesh>
          </group>

          {/* Kursi Ayunan Kanan (pivot di palang atas y=2.9) */}
          <group ref={swingRightRef} position={[0.78, 2.9, 0]}>
            <mesh position={[-0.32, -1.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 2.1, 6]} />
              <meshStandardMaterial color="#c4ccd6" metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0.32, -1.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 2.1, 6]} />
              <meshStandardMaterial color="#c4ccd6" metalness={0.75} roughness={0.3} />
            </mesh>
            <mesh position={[0, -2.12, 0]} castShadow>
              <boxGeometry args={[0.78, 0.08, 0.36]} />
              <meshStandardMaterial color="#eab949" roughness={0.6} />
            </mesh>
          </group>
        </group>

        {/* === PEROSOTAN WARNA-WARNI ANAK ([-77.2, 0, 23.2]) === */}
        <group position={[-77.2, 0, 23.2]}>
          {/* 4 Tiang Menara Kayu + Platform */}
          {[
            [-0.55, 1.3, -0.55],
            [0.55, 1.3, -0.55],
            [-0.55, 1.3, 0.55],
            [0.55, 1.3, 0.55],
          ].map(([tx, ty, tz], idx) => (
            <mesh key={`slp-${idx}`} position={[tx, ty, tz]} castShadow>
              <boxGeometry args={[0.12, 2.6, 0.12]} />
              <meshStandardMaterial color="#8c5c38" roughness={0.82} />
            </mesh>
          ))}
          <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.12, 1.35]} />
            <meshStandardMaterial color="#a67249" roughness={0.78} />
          </mesh>
          {/* Atap Segitiga Kuning Ceria */}
          <mesh position={[0, 2.95, 0]} castShadow>
            <coneGeometry args={[1.15, 0.85, 4]} />
            <meshStandardMaterial color="#e8b84b" roughness={0.72} />
          </mesh>
          {/* Papan Luncur Koral-Merah */}
          <mesh position={[0, 0.84, -1.22]} rotation={[-0.68, 0, 0]} castShadow>
            <boxGeometry args={[0.78, 0.1, 2.15]} />
            <meshStandardMaterial color="#de624e" roughness={0.32} metalness={0.12} />
          </mesh>
          {/* Tangga Belakang */}
          {[0.38, 0.72, 1.06, 1.38].map((sy, si) => (
            <mesh key={`st-${si}`} position={[0, sy, 0.76 - si * 0.08]}>
              <boxGeometry args={[0.68, 0.06, 0.14]} />
              <meshStandardMaterial color="#4ca68a" roughness={0.6} />
            </mesh>
          ))}
        </group>

        {/* === BANGKU ORANG TUA + LAMPU TAMAN BERMAIN === */}
        <group position={[-83.7, 0, 25.0]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.12, 0.65]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.8, -0.26]} rotation={[-0.14, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 0.42, 0.08]} />
            <meshStandardMaterial map={textures.woodFloor} roughness={0.8} />
          </mesh>
          <mesh position={[-0.9, 0.22, 0]} castShadow>
            <boxGeometry args={[0.1, 0.44, 0.58]} />
            <meshStandardMaterial color="#2a313b" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0.9, 0.22, 0]} castShadow>
            <boxGeometry args={[0.1, 0.44, 0.58]} />
            <meshStandardMaterial color="#2a313b" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
        {/* Lampu Taman Hangat */}
        <group position={[-85.4, 0, 24.4]}>
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 3.8, 8]} />
            <meshStandardMaterial color="#28303b" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0, 3.85, 0]}>
            <sphereGeometry args={[0.22, 10, 10]} />
            <meshStandardMaterial
              color={isEveningOrNight ? '#ffefbd' : '#d8dee6'}
              emissive={isEveningOrNight ? '#ffba52' : '#000000'}
              emissiveIntensity={isEveningOrNight ? 2.8 : 0}
            />
          </mesh>
          {isEveningOrNight && settings.cinematicGlow && (
            <sprite position={[0, 3.85, 0]} scale={[3.4, 3.4, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffc76e"
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
          {isEveningOrNight && (
            <pointLight position={[0, 3.8, 0]} color="#ffca75" intensity={14} distance={20} decay={1.7} />
          )}
        </group>
      </group>

      {/* ================================================================= */}
      {/* 2. KAWANAN 9 IKAN KOI WARNA-WARNI DI DANAU SENJA + PELET & RIAK   */}
      {/* ================================================================= */}
      <group>
        {koiDataRef.current.map((fish, i) => (
          <group
            key={`koi-${i}`}
            ref={(el) => {
              koiGroupRefs.current[i] = el;
            }}
            position={[fish.x, -0.22, fish.z]}
            scale={fish.scale}
          >
            {/* Badan Ikan Koi */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <capsuleGeometry args={[0.085, 0.28, 6, 10]} />
              <meshStandardMaterial
                color={fish.bodyColor}
                emissive={fish.bodyColor}
                emissiveIntensity={0.25}
                roughness={0.3}
              />
            </mesh>
            {/* Corak Punggung Koi */}
            <mesh position={[0, 0.055, 0.03]}>
              <sphereGeometry args={[0.072, 8, 8]} />
              <meshStandardMaterial color={fish.spotColor} roughness={0.35} />
            </mesh>
            {/* Sirip Samping */}
            <mesh position={[-0.09, -0.01, 0.04]} rotation={[0, 0.45, 0]}>
              <boxGeometry args={[0.1, 0.015, 0.08]} />
              <meshStandardMaterial color={fish.spotColor} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0.09, -0.01, 0.04]} rotation={[0, -0.45, 0]}>
              <boxGeometry args={[0.1, 0.015, 0.08]} />
              <meshStandardMaterial color={fish.spotColor} transparent opacity={0.85} />
            </mesh>
            {/* Sirip Ekor Bergoyang */}
            <mesh
              ref={(el) => {
                koiTailRefs.current[i] = el;
              }}
              position={[0, 0, -0.24]}
            >
              <boxGeometry args={[0.02, 0.14, 0.18]} />
              <meshStandardMaterial color={fish.spotColor} transparent opacity={0.9} />
            </mesh>
          </group>
        ))}

        {/* Butiran Pelet Mengapung saat Diberi Makan */}
        <group ref={pelletGroupRef} visible={false}>
          {[
            [0, 0, 0],
            [0.18, 0, 0.12],
            [-0.16, 0, 0.1],
            [0.08, 0, -0.18],
            [-0.14, 0, -0.12],
          ].map(([px, py, pz], idx) => (
            <mesh key={`pel-${idx}`} position={[px, py, pz]}>
              <sphereGeometry args={[0.035, 6, 6]} />
              <meshStandardMaterial color="#b37b42" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Riak Cincin Air saat Koi Menyambar Pelet */}
        {[0, 1, 2].map((rIdx) => (
          <mesh
            key={`rip-${rIdx}`}
            ref={(el) => {
              rippleRefs.current[rIdx] = el;
            }}
            rotation={[-Math.PI / 2, 0, 0]}
            visible={false}
          >
            <ringGeometry args={[0.22, 0.27, 24]} />
            <meshBasicMaterial color="#e6f7ff" transparent opacity={0.45} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 3. LAYANG-LAYANG SORE INDONESIA DI LAPANGAN TAMAN ([-87.5, 22.5]) */}
      {/* ================================================================= */}
      <group>
        {/* Patok & Gulungan Benang di Lapangan Taman */}
        <group position={[-87.5, 0, 22.5]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.5, 8]} />
            <meshStandardMaterial color="#6e4b2e" roughness={0.88} />
          </mesh>
          <mesh position={[0.28, 0.14, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.26, 12]} />
            <meshStandardMaterial color="#f5efe6" roughness={0.7} />
          </mesh>
        </group>

        {/* Layang-Layang Berlian Warna-Warni + 5 Ekor Pita */}
        <group ref={kiteRef} position={[-87.5, 0.72, 22.5]}>
          {/* Sayap Berlian Kertas Minyak 4 Panel Warna */}
          <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.82, 0.82, 0.025]} />
            <meshStandardMaterial
              color="#e64e3d"
              emissive={isFlyingKite ? '#ff7b47' : '#000000'}
              emissiveIntensity={isFlyingKite ? 0.22 : 0}
              roughness={0.55}
            />
          </mesh>
          <mesh position={[0, 0.18, 0.016]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.42, 0.42, 0.018]} />
            <meshStandardMaterial color="#f6c644" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.18, 0.016]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.38, 0.38, 0.018]} />
            <meshStandardMaterial color="#3b82c4" roughness={0.5} />
          </mesh>
          {/* Rangka Bambu Silang */}
          <mesh position={[0, 0, 0.022]}>
            <boxGeometry args={[0.03, 1.18, 0.02]} />
            <meshStandardMaterial color="#b38a52" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.08, 0.022]}>
            <boxGeometry args={[1.12, 0.03, 0.02]} />
            <meshStandardMaterial color="#b38a52" roughness={0.85} />
          </mesh>

          {/* 5 Simpul Pita Ekor Warna-Warni */}
          {[0, 1, 2, 3, 4].map((ti) => (
            <mesh
              key={`kt-${ti}`}
              ref={(el) => {
                kiteTailRefs.current[ti] = el;
              }}
              position={[0, -0.7 - ti * 0.42, 0]}
            >
              <boxGeometry args={[0.24, 0.12, 0.015]} />
              <meshStandardMaterial
                color={['#f6c644', '#ffffff', '#e64e3d', '#3b82c4', '#52b788'][ti]}
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>

        {/* Benang Layang-Layang Tipis dari Tangan Damar ke Langit */}
        <mesh ref={kiteStringRef} visible={false}>
          <cylinderGeometry args={[0.007, 0.007, 1, 6]} />
          <meshBasicMaterial color="#f8f4ec" transparent opacity={0.72} />
        </mesh>
      </group>
    </group>
  );
};
