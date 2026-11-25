import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface HomeKitchenAndParkNatureProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const PIGEON_CENTER: [number, number] = [-81.5, 12.2];

interface PigeonState {
  x: number;
  y: number;
  z: number;
  homeX: number;
  homeZ: number;
  targetX: number;
  targetZ: number;
  yaw: number;
  mode: 'idle' | 'walk' | 'peck' | 'fly';
  timer: number;
  flyAngle: number;
  flyHeight: number;
  bodyColor: string;
  wingColor: string;
}

interface FireflySeed {
  baseX: number;
  baseY: number;
  baseZ: number;
  ampX: number;
  ampY: number;
  ampZ: number;
  freqX: number;
  freqY: number;
  freqZ: number;
  pulseFreq: number;
  phase: number;
}

/**
 * Uap tipis mengepul dari panci sup / teko teh melati di dapur Rumah Jl. Melati No. 14.
 */
const KitchenSteam: React.FC<{ position: [number, number, number]; active: boolean; scale?: number }> = ({
  position,
  active,
  scale = 1,
}) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 4; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      m.visible = active;
      if (!active) continue;
      const p = (((t * 0.52 + i * 0.25) % 1) + 1) % 1;
      m.position.y = p * 0.58 * scale;
      m.position.x = Math.sin(t * 1.9 + i * 1.8) * 0.06 * p * scale;
      m.position.z = Math.cos(t * 1.6 + i * 1.5) * 0.05 * p * scale;
      const s = (0.4 + p * 1.15) * scale;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.34;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`kst-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshBasicMaterial color="#fffaf0" transparent opacity={0.26} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * 1. Dapur Hangat Rumah Jl. Melati No. 14 (kompor gas menyala, panci sup mengepul, teko teh & rak bumbu)
 * 2. Kawanan 7 Burung Merpati Jinak di Taman Kota (mematuk rumput, mendekati remah roti & terbang melingkar bila didekati)
 * 3. 38 Kunang-Kunang Lembut yang menari di sekitar Danau Senja & Dermaga saat Senja–Malam
 */
export const HomeKitchenAndParkNature: React.FC<HomeKitchenAndParkNatureProps> = ({
  timeOfDay,
  settings,
}) => {
  const stoveLit = useGameStore((s) => s.homeStoveLit);
  const radioStation = useGameStore((s) => s.radioStation);
  const radioPaused = useGameStore((s) => s.radioPaused);
  const textures = useMemo(() => getProceduralTextures(), []);

  const flameRef = useRef<THREE.Mesh>(null);
  const radioNoteRef = useRef<THREE.Group>(null);
  const pigeonGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const pigeonHeadRefs = useRef<(THREE.Group | null)[]>([]);
  const pigeonWingLRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pigeonWingRRefs = useRef<(THREE.Mesh | null)[]>([]);
  const crumbsGroupRef = useRef<THREE.Group>(null);
  const lastFlutterSfxRef = useRef(0);

  const fireflyGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const fireflySpriteMats = useRef<(THREE.SpriteMaterial | null)[]>([]);
  const fireflyCoreMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  // Inisialisasi 7 burung merpati jinak dengan variasi bulu abu-abu, putih & cokelat krem
  const pigeonsRef = useRef<PigeonState[] | null>(null);
  if (!pigeonsRef.current) {
    const palette: [string, string][] = [
      ['#9ca3af', '#6b7280'],
      ['#d1d5db', '#94a3b8'],
      ['#e5e7eb', '#a8a29e'],
      ['#8b95a3', '#4b5563'],
      ['#c7beb4', '#8c7a6b'],
      ['#cbd5e1', '#64748b'],
      ['#e7e2da', '#9c8f82'],
    ];
    pigeonsRef.current = palette.map(([bodyColor, wingColor], idx) => {
      const ang = (idx / palette.length) * Math.PI * 2 + 0.4;
      const rad = 1.1 + (idx % 3) * 0.85;
      const hx = PIGEON_CENTER[0] + Math.cos(ang) * rad;
      const hz = PIGEON_CENTER[1] + Math.sin(ang) * rad;
      return {
        x: hx,
        y: 0,
        z: hz,
        homeX: hx,
        homeZ: hz,
        targetX: hx,
        targetZ: hz,
        yaw: ang + Math.PI,
        mode: idx % 2 === 0 ? 'peck' : 'idle',
        timer: 1.5 + idx * 0.65,
        flyAngle: ang,
        flyHeight: 3.1 + (idx % 3) * 0.75,
        bodyColor,
        wingColor,
      };
    });
  }

  // 38 titik benih kunang-kunang di sekitar Danau Senja, Dermaga & Taman Bunga
  const fireflyCount = settings.particleDensity === 'low' ? 16 : settings.particleDensity === 'medium' ? 26 : 38;
  const fireflySeeds = useMemo<FireflySeed[]>(() => {
    const arr: FireflySeed[] = [];
    for (let i = 0; i < 38; i++) {
      // Pseudo-random deterministik agar posisi konsisten rapi di sekitar tepi danau & dermaga
      const s1 = Math.sin(i * 12.9898 + 1.3) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const s2 = Math.sin(i * 78.233 + 4.7) * 43758.5453;
      const r2 = s2 - Math.floor(s2);
      const s3 = Math.sin(i * 39.425 + 2.1) * 43758.5453;
      const r3 = s3 - Math.floor(s3);

      // Sebagian di atas air & dermaga, sebagian di tepi taman & bunga
      const ang = r1 * Math.PI * 2;
      const rad = 4.5 + r2 * 15.5;
      const baseX = -80.5 + Math.cos(ang) * rad;
      const baseZ = -26.5 + Math.sin(ang) * (rad * 0.92);

      arr.push({
        baseX: Math.max(-96, Math.min(-64.5, baseX)),
        baseY: 0.55 + r3 * 2.05,
        baseZ: Math.max(-41.5, Math.min(-10.5, baseZ)),
        ampX: 0.7 + r2 * 1.5,
        ampY: 0.25 + r3 * 0.45,
        ampZ: 0.7 + r1 * 1.4,
        freqX: 0.26 + r1 * 0.3,
        freqY: 0.55 + r2 * 0.45,
        freqZ: 0.24 + r3 * 0.32,
        pulseFreq: 1.15 + r2 * 1.65,
        phase: i * 1.37,
      });
    }
    return arr;
  }, []);

  const showFireflies = timeOfDay === 'night' || timeOfDay === 'sunset';
  const showPigeons = timeOfDay !== 'rain_dusk';
  const isEveningOrNight = timeOfDay !== 'morning';

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // 1. Kelap-kelip halus api biru-oranye kompor dapur & denyut lembut radio dapur saat menyala
    if (flameRef.current && stoveLit) {
      const s = 0.92 + Math.sin(t * 22) * 0.09 + Math.cos(t * 15) * 0.06;
      flameRef.current.scale.set(s, 0.85 + Math.sin(t * 19) * 0.16, s);
    }
    if (radioNoteRef.current) {
      const playing = !radioPaused && radioStation !== 'auto';
      radioNoteRef.current.visible = playing;
      if (playing) {
        const p = ((t * 0.55) % 1 + 1) % 1;
        radioNoteRef.current.position.y = 0.24 + p * 0.34;
        radioNoteRef.current.position.x = Math.sin(t * 2.6) * 0.06;
        radioNoteRef.current.rotation.y = t * 1.4;
        const sc = 0.65 + Math.sin(p * Math.PI) * 0.45;
        radioNoteRef.current.scale.set(sc, sc, sc);
      }
    }

    // 2. Timer remah roti merpati & AI 7 burung merpati taman
    if (playerRuntime.pigeonFeedTimer > 0) {
      playerRuntime.pigeonFeedTimer = Math.max(0, playerRuntime.pigeonFeedTimer - dt);
    }
    if (crumbsGroupRef.current) {
      crumbsGroupRef.current.visible = playerRuntime.pigeonFeedTimer > 0;
    }

    if (showPigeons && pigeonsRef.current) {
      const [px, py, pz] = playerRuntime.position;
      const feeding = playerRuntime.pigeonFeedTimer > 0;
      const feedX = playerRuntime.pigeonFeedPoint[0];
      const feedZ = playerRuntime.pigeonFeedPoint[1];
      const playerCloseFast =
        py < 3 && (playerRuntime.isRunning || playerRuntime.bicycle.isRiding || playerRuntime.scooter.isRiding);

      for (let i = 0; i < pigeonsRef.current.length; i++) {
        const pg = pigeonsRef.current[i];
        const grp = pigeonGroupRefs.current[i];
        if (!grp) continue;

        const distPlayer = py > 3 ? 99 : Math.hypot(px - pg.x, pz - pg.z);
        const scareRadius = feeding ? 1.35 : playerCloseFast ? 4.8 : 2.95;

        // Terbang kaget melingkar bila Damar melangkah terlalu dekat atau melintas cepat!
        if (pg.mode !== 'fly' && distPlayer < scareRadius) {
          pg.mode = 'fly';
          pg.timer = 4.2 + (i % 3) * 0.9;
          pg.flyAngle = Math.atan2(pg.z - pz, pg.x - px) + (i - 3) * 0.28;
          const nowMs = Date.now();
          if (nowMs - lastFlutterSfxRef.current > 1800) {
            lastFlutterSfxRef.current = nowMs;
            sfxEngine.playPigeonFlutter();
          }
        }

        let wingFlap = 0;
        let headNod = 0;

        if (pg.mode === 'fly') {
          pg.timer -= dt;
          pg.flyAngle += dt * (1.25 + (i % 2) * 0.22);
          const orbitRad = 4.6 + (i % 3) * 1.4;
          const desiredX = PIGEON_CENTER[0] + Math.cos(pg.flyAngle) * orbitRad;
          const desiredZ = PIGEON_CENTER[1] + Math.sin(pg.flyAngle) * orbitRad;
          const desiredY = pg.timer > 1.2 ? pg.flyHeight + Math.sin(t * 2.5 + i) * 0.35 : Math.max(0, pg.timer * 2.4);

          const dx = desiredX - pg.x;
          const dz = desiredZ - pg.z;
          pg.x += dx * Math.min(1, dt * 3.1);
          pg.z += dz * Math.min(1, dt * 3.1);
          pg.y = THREE.MathUtils.lerp(pg.y, desiredY, dt * 3.8);
          pg.yaw = Math.atan2(dx, dz);
          wingFlap = Math.sin(t * 24 + i * 1.4) * 1.05;

          if (pg.timer <= 0 && pg.y < 0.14) {
            pg.y = 0;
            pg.mode = 'idle';
            pg.timer = 1.6 + (i % 3) * 0.6;
          }
        } else {
          pg.y = THREE.MathUtils.lerp(pg.y, 0, dt * 8);
          pg.timer -= dt;

          if (feeding) {
            // Berkumpul ceria menuju remah roti yang ditebar Damar!
            const slotAng = (i / pigeonsRef.current.length) * Math.PI * 2;
            const slotR = 0.55 + (i % 2) * 0.38;
            pg.targetX = feedX + Math.cos(slotAng) * slotR;
            pg.targetZ = feedZ + Math.sin(slotAng) * slotR;
            const dFeed = Math.hypot(pg.targetX - pg.x, pg.targetZ - pg.z);
            pg.mode = dFeed > 0.25 ? 'walk' : 'peck';
          } else if (pg.timer <= 0) {
            const roll = (Math.sin(t * 3.1 + i * 5.7) + 1) * 0.5;
            if (roll < 0.48) {
              pg.mode = 'walk';
              const a = t * 0.7 + i * 2.1;
              pg.targetX = PIGEON_CENTER[0] + Math.cos(a) * (1.2 + (i % 3) * 1.05);
              pg.targetZ = PIGEON_CENTER[1] + Math.sin(a * 1.3) * (1.2 + (i % 2) * 1.15);
              pg.timer = 2.4 + (i % 3) * 0.8;
            } else if (roll < 0.82) {
              pg.mode = 'peck';
              pg.timer = 1.8 + (i % 2) * 0.9;
            } else {
              pg.mode = 'idle';
              pg.timer = 1.5 + (i % 3) * 0.5;
            }
          }

          if (pg.mode === 'walk') {
            const dx = pg.targetX - pg.x;
            const dz = pg.targetZ - pg.z;
            const dist = Math.hypot(dx, dz);
            if (dist > 0.12) {
              const spd = feeding ? 1.55 : 0.72;
              const step = Math.min(dist, spd * dt);
              pg.x += (dx / dist) * step;
              pg.z += (dz / dist) * step;
              pg.yaw = Math.atan2(dx, dz);
              pg.y = Math.abs(Math.sin(t * (feeding ? 15 : 10) + i)) * 0.032;
              headNod = Math.sin(t * 11 + i) * 0.22;
            } else {
              pg.mode = 'peck';
            }
          } else if (pg.mode === 'peck') {
            headNod = 0.42 + Math.max(0, Math.sin(t * 7.8 + i * 2.3)) * 0.48;
          } else {
            headNod = Math.sin(t * 2.1 + i) * 0.08;
          }
        }

        grp.position.set(pg.x, pg.y, pg.z);
        grp.rotation.y = pg.yaw;
        grp.rotation.x = pg.mode === 'fly' ? -0.14 : 0;

        if (pigeonHeadRefs.current[i]) {
          pigeonHeadRefs.current[i]!.rotation.x = headNod;
        }
        if (pigeonWingLRefs.current[i]) {
          pigeonWingLRefs.current[i]!.rotation.z = pg.mode === 'fly' ? wingFlap : 0.06;
        }
        if (pigeonWingRRefs.current[i]) {
          pigeonWingRRefs.current[i]!.rotation.z = pg.mode === 'fly' ? -wingFlap : -0.06;
        }
      }
    }

    // 3. Animasi melayang & pendar bioluminesen Kunang-Kunang Danau Senja
    if (showFireflies) {
      const intensityMul = timeOfDay === 'night' ? 1.0 : 0.48;
      for (let i = 0; i < fireflyCount; i++) {
        const g = fireflyGroupRefs.current[i];
        const seed = fireflySeeds[i];
        if (!g || !seed) continue;

        g.position.set(
          seed.baseX + Math.sin(t * seed.freqX + seed.phase) * seed.ampX,
          seed.baseY + Math.sin(t * seed.freqY + seed.phase * 1.4) * seed.ampY,
          seed.baseZ + Math.cos(t * seed.freqZ + seed.phase * 0.8) * seed.ampZ,
        );

        const blink = 0.22 + Math.pow((Math.sin(t * seed.pulseFreq + seed.phase) + 1) * 0.5, 2.2) * 0.78;
        const glowAlpha = blink * intensityMul;

        const spMat = fireflySpriteMats.current[i];
        if (spMat) spMat.opacity = glowAlpha * 0.82;
        const coreMat = fireflyCoreMats.current[i];
        if (coreMat) coreMat.opacity = Math.min(1, 0.35 + glowAlpha * 0.65);
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. DAPUR HANGAT RUMAH JL. MELATI NO. 14 ([-16.9, 0.08, 73.05])       */}
      {/* ==================================================================== */}
      <group position={[-16.9, 0.08, 73.05]}>
        {/* Kabinet Dapur Bawah Kayu & Krem */}
        <mesh position={[0, 0.43, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.52, 0.86, 0.78]} />
          <meshStandardMaterial color="#e8decb" roughness={0.78} />
        </mesh>
        {/* Garis Pintu Kabinet Bawah & Gagang Kayu */}
        {[-0.82, 0, 0.82].map((cx, ci) => (
          <group key={`kc-${ci}`} position={[cx, 0.44, -0.398]}>
            <mesh>
              <boxGeometry args={[0.74, 0.72, 0.02]} />
              <meshStandardMaterial color="#dfd3be" roughness={0.76} />
            </mesh>
            <mesh position={[0.24, 0.08, -0.02]}>
              <boxGeometry args={[0.03, 0.14, 0.03]} />
              <meshStandardMaterial color="#6e4a2d" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Meja Counter Kayu Jati Hangat */}
        <mesh position={[0, 0.88, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[2.62, 0.07, 0.86]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.55} />
        </mesh>

        {/* Backsplash Keramik Dinding Dapur */}
        <mesh position={[0, 1.48, 0.42]}>
          <boxGeometry args={[2.58, 1.15, 0.06]} />
          <meshStandardMaterial color="#f2ece0" roughness={0.45} />
        </mesh>

        {/* Kompor Gas 2 Tungku Stainless + Panci Sup & Teko Teh Melati */}
        <group position={[-0.36, 0.94, 0.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.88, 0.08, 0.52]} />
            <meshStandardMaterial color="#343a44" metalness={0.62} roughness={0.35} />
          </mesh>
          {/* Tungku Kiri & Kanan */}
          <mesh position={[-0.22, 0.055, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.03, 14]} />
            <meshStandardMaterial color="#1f2329" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0.22, 0.055, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.03, 14]} />
            <meshStandardMaterial color="#1f2329" metalness={0.7} roughness={0.4} />
          </mesh>

          {/* Nyala Api Biru-Oranye Kompor Saat Memasak / Menghangatkan Sup */}
          {stoveLit && (
            <>
              <mesh ref={flameRef} position={[-0.22, 0.082, 0]}>
                <cylinderGeometry args={[0.095, 0.115, 0.045, 12]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.85} />
              </mesh>
              <pointLight position={[-0.22, 0.25, -0.15]} color="#ffbe6b" intensity={4.5} distance={5} decay={2} />
            </>
          )}

          {/* Panci Sup Stainless Hangat di Tungku Kiri */}
          <group position={[-0.22, 0.17, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.145, 0.135, 0.19, 16]} />
              <meshStandardMaterial color="#c9d1db" metalness={0.78} roughness={0.25} />
            </mesh>
            {/* Kuah Sup & Wortel di Dalam Panci */}
            <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.13, 14]} />
              <meshStandardMaterial color="#e09d48" roughness={0.25} />
            </mesh>
            <KitchenSteam position={[0, 0.12, 0]} active={stoveLit} scale={0.95} />
          </group>

          {/* Teko Teh Melati Krem di Tungku Kanan */}
          <group position={[0.22, 0.16, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.095, 0.12, 0.17, 14]} />
              <meshStandardMaterial color="#d46e52" roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#2b2623" roughness={0.5} />
            </mesh>
            <KitchenSteam position={[0, 0.14, 0]} active={stoveLit || isEveningOrNight} scale={0.58} />
          </group>
        </group>

        {/* Talenan Kayu, Wortel Oranye & Mangkuk Sayur di Sisi Kanan Counter */}
        <group position={[0.66, 0.93, -0.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.032, 0.34]} />
            <meshStandardMaterial color="#b38252" roughness={0.72} />
          </mesh>
          {/* Wortel & Sayuran Segar */}
          <mesh position={[-0.08, 0.035, 0.02]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.018, 0.028, 0.18, 8]} />
            <meshStandardMaterial color="#e87a35" roughness={0.75} />
          </mesh>
          <mesh position={[0.12, 0.055, -0.05]} castShadow>
            <dodecahedronGeometry args={[0.065, 0]} />
            <meshStandardMaterial color="#4a8c50" roughness={0.85} />
          </mesh>
          {/* Mangkuk Keramik Siap Saji */}
          <mesh position={[0.38, 0.05, 0.04]} castShadow>
            <cylinderGeometry args={[0.1, 0.065, 0.09, 14]} />
            <meshStandardMaterial color="#f7f2e8" roughness={0.32} />
          </mesh>
        </group>

        {/* Rak Kayu Atas Dinding + Toples Bumbu + Wajan Gantung + Lampu Strip Dapur */}
        <group position={[0, 1.98, 0.24]}>
          <mesh castShadow>
            <boxGeometry args={[2.35, 0.07, 0.32]} />
            <meshStandardMaterial color="#6e4a2e" roughness={0.74} />
          </mesh>
          {/* 5 Toples Bumbu & Gelas Kaca di Atas Rak */}
          {[-0.85, -0.58, -0.32, 0.28, 0.56].map((jx, ji) => (
            <mesh key={`jar-${ji}`} position={[jx, 0.13, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.055, 0.18, 10]} />
              <meshStandardMaterial
                color={['#d99c4e', '#c95a42', '#e8d8b7', '#557d57', '#e3b25d'][ji]}
                roughness={0.35}
              />
            </mesh>
          ))}
          {/* Wajan Penggorengan Hitam Tergantung di Bawah Rak */}
          <mesh position={[0.85, -0.26, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.13, 0.04, 14]} />
            <meshStandardMaterial color="#272b33" metalness={0.68} roughness={0.4} />
          </mesh>
          {/* Lampu Strip Hangat Bawah Rak Dapur */}
          <mesh position={[0, -0.045, 0.02]}>
            <boxGeometry args={[1.95, 0.025, 0.06]} />
            <meshStandardMaterial
              color="#fff4d4"
              emissive="#ffca75"
              emissiveIntensity={isEveningOrNight || stoveLit ? 2.4 : 0.45}
            />
          </mesh>
        </group>

        {/* === RADIO KAYU RETRO DAPUR (KIRI COUNTER: [-18.02, 0.99, 73.05]) === */}
        <group position={[-1.12, 1.02, -0.02]} rotation={[0, 0.22, 0]}>
          {/* Bodi Kayu Kenari Klasik */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.2, 0.16]} />
            <meshStandardMaterial color="#6b4228" roughness={0.62} />
          </mesh>
          {/* Kisi Speaker Kain Krem */}
          <mesh position={[-0.055, 0, -0.082]}>
            <boxGeometry args={[0.17, 0.135, 0.012]} />
            <meshStandardMaterial color="#e8dec9" roughness={0.9} />
          </mesh>
          {/* Layar Skala Frekuensi Radio (Menyala Kuning Hangat Saat Aktif!) */}
          <mesh position={[0.092, 0.032, -0.082]}>
            <boxGeometry args={[0.095, 0.042, 0.012]} />
            <meshStandardMaterial
              color={!radioPaused && radioStation !== 'auto' ? '#ffebad' : '#3a342e'}
              emissive={!radioPaused && radioStation !== 'auto' ? '#ffb74d' : '#000000'}
              emissiveIntensity={!radioPaused && radioStation !== 'auto' ? 2.6 : 0}
            />
          </mesh>
          {/* Dua Kenop Putar Kuningan */}
          <mesh position={[0.068, -0.036, -0.088]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
            <meshStandardMaterial color="#d4a759" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.118, -0.036, -0.088]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.02, 10]} />
            <meshStandardMaterial color="#d4a759" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Antena Perak Tipis */}
          <mesh position={[0.12, 0.24, 0.04]} rotation={[0, 0, -0.25]}>
            <cylinderGeometry args={[0.005, 0.007, 0.34, 6]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Partikel Nada Musik Kecil Mengapung Saat Radio Dapur Menyala */}
          <group ref={radioNoteRef} position={[0, 0.28, 0]} visible={false}>
            <mesh>
              <octahedronGeometry args={[0.038, 0]} />
              <meshStandardMaterial color="#ffe29a" emissive="#ffb74d" emissiveIntensity={2.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 1B. GITAR AKUSTIK RUANG TAMU ([-24.2, 0.08, 63.1])                   */}
      {/* ==================================================================== */}
      <group position={[-24.2, 0.08, 63.1]} rotation={[0, 0.62, 0]}>
        {/* Stand Kayu A-Frame */}
        <mesh position={[-0.14, 0.26, -0.08]} rotation={[0.22, 0, -0.14]} castShadow>
          <boxGeometry args={[0.045, 0.56, 0.045]} />
          <meshStandardMaterial color="#2b231d" roughness={0.72} />
        </mesh>
        <mesh position={[0.14, 0.26, -0.08]} rotation={[0.22, 0, 0.14]} castShadow>
          <boxGeometry args={[0.045, 0.56, 0.045]} />
          <meshStandardMaterial color="#2b231d" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.12, 0.08]} castShadow>
          <boxGeometry args={[0.32, 0.04, 0.24]} />
          <meshStandardMaterial color="#2b231d" roughness={0.72} />
        </mesh>
        {/* Gitar Akustik Mahoni Kesayangan Damar */}
        <group position={[0, 0.58, 0.04]} rotation={[-0.16, 0, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 18]} />
            <meshStandardMaterial color="#b86f34" roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 18]} />
            <meshStandardMaterial color="#b86f34" roughness={0.38} />
          </mesh>
          <mesh position={[0, -0.03, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.068, 14]} />
            <meshBasicMaterial color="#1f120a" />
          </mesh>
          <mesh position={[0, 0.44, 0.01]} castShadow>
            <boxGeometry args={[0.065, 0.64, 0.048]} />
            <meshStandardMaterial color="#3c2618" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.81, 0.01]}>
            <boxGeometry args={[0.1, 0.16, 0.048]} />
            <meshStandardMaterial color="#2c1c12" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 1C. MEJA TAMU & BUKU ALBUM FOTO KELUARGA ([-22.35, 0.08, 65.6])      */}
      {/* ==================================================================== */}
      <group position={[-22.35, 0.08, 65.6]}>
        {/* Meja Tamu Kayu Jati Rendah di Depan Sofa */}
        <mesh position={[0, 0.39, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.065, 1.38]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.58} />
        </mesh>
        {[
          [-0.3, 0.19, -0.58],
          [0.3, 0.19, -0.58],
          [-0.3, 0.19, 0.58],
          [0.3, 0.19, 0.58],
        ].map(([lx, ly, lz], li) => (
          <mesh key={`ctl-${li}`} position={[lx, ly, lz]} castShadow>
            <cylinderGeometry args={[0.032, 0.026, 0.38, 8]} />
            <meshStandardMaterial color="#593a23" roughness={0.75} />
          </mesh>
        ))}

        {/* Buku Album Foto Keluarga Bersampul Kulit Cokelat Hangat + Pita Emas */}
        <group position={[0.02, 0.452, -0.14]} rotation={[0, 0.14, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.36, 0.055, 0.46]} />
            <meshStandardMaterial color="#7a3e2c" roughness={0.72} />
          </mesh>
          {/* Tepi Halaman Kertas Krem */}
          <mesh position={[0.012, 0, 0]}>
            <boxGeometry args={[0.34, 0.042, 0.435]} />
            <meshStandardMaterial color="#f5ebd6" roughness={0.88} />
          </mesh>
          {/* Bingkai Garis Emas di Sampul Album */}
          <mesh position={[0, 0.029, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.095, 0.115, 24]} />
            <meshStandardMaterial color="#e6be6c" metalness={0.55} roughness={0.35} />
          </mesh>
        </group>

        {/* Vas Bunga Melati Kecil di Ujung Meja Tamu */}
        <group position={[-0.06, 0.425, 0.44]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.065, 0.16, 12]} />
            <meshStandardMaterial color="#e8dfd1" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <dodecahedronGeometry args={[0.075, 0]} />
            <meshStandardMaterial color="#4e8050" roughness={0.82} />
          </mesh>
          <mesh position={[0.03, 0.24, 0.02]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#fff9ed" roughness={0.5} />
          </mesh>
          <mesh position={[-0.03, 0.23, -0.02]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#fff9ed" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. KAWANAN 7 BURUNG MERPATI JINAK TAMAN KOTA ([-81.5, 0, 12.2])      */}
      {/* ==================================================================== */}
      {/* Lingkaran batu taman kecil penanda sudut merpati & remah roti */}
      <mesh position={[PIGEON_CENTER[0], 0.015, PIGEON_CENTER[1]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.1, 20]} />
        <meshStandardMaterial map={textures.paving} roughness={0.9} transparent opacity={0.55} />
      </mesh>

      {/* Taburan Remah Roti Emas Saat Damar Memberi Makan Merpati */}
      <group ref={crumbsGroupRef} position={[PIGEON_CENTER[0], 0.04, PIGEON_CENTER[1]]} visible={false}>
        {[
          [-0.22, 0.14],
          [0.18, -0.16],
          [0.04, 0.25],
          [-0.14, -0.2],
          [0.28, 0.08],
          [-0.05, 0.02],
        ].map(([cx, cz], ci) => (
          <mesh key={`crm-${ci}`} position={[cx, 0, cz]}>
            <dodecahedronGeometry args={[0.032, 0]} />
            <meshStandardMaterial color="#e8be72" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {showPigeons &&
        pigeonsRef.current?.map((pg, idx) => (
          <group
            key={`pg-${idx}`}
            ref={(el) => {
              pigeonGroupRefs.current[idx] = el;
            }}
            position={[pg.x, pg.y, pg.z]}
          >
            {/* Tubuh Oval Merpati */}
            <mesh position={[0, 0.14, 0]} rotation={[0.18, 0, 0]} scale={[0.85, 0.85, 1.35]} castShadow>
              <sphereGeometry args={[0.105, 10, 8]} />
              <meshStandardMaterial color={pg.bodyColor} roughness={0.82} />
            </mesh>
            {/* Ekor Merpati */}
            <mesh position={[0, 0.12, -0.15]} rotation={[-0.25, 0, 0]} castShadow>
              <boxGeometry args={[0.095, 0.022, 0.13]} />
              <meshStandardMaterial color={pg.wingColor} roughness={0.85} />
            </mesh>
            {/* Sayap Kiri & Kanan Berartikulasi */}
            <mesh
              ref={(el) => {
                pigeonWingLRefs.current[idx] = el;
              }}
              position={[-0.095, 0.15, -0.01]}
              castShadow
            >
              <boxGeometry args={[0.13, 0.022, 0.18]} />
              <meshStandardMaterial color={pg.wingColor} roughness={0.82} />
            </mesh>
            <mesh
              ref={(el) => {
                pigeonWingRRefs.current[idx] = el;
              }}
              position={[0.095, 0.15, -0.01]}
              castShadow
            >
              <boxGeometry args={[0.13, 0.022, 0.18]} />
              <meshStandardMaterial color={pg.wingColor} roughness={0.82} />
            </mesh>
            {/* Kepala & Paruh yang Mengangguk Saat Mematuk */}
            <group
              ref={(el) => {
                pigeonHeadRefs.current[idx] = el;
              }}
              position={[0, 0.22, 0.095]}
            >
              <mesh castShadow>
                <sphereGeometry args={[0.056, 8, 8]} />
                <meshStandardMaterial color={pg.bodyColor} roughness={0.78} />
              </mesh>
              {/* Paruh Kecil */}
              <mesh position={[0, -0.008, 0.065]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.015, 0.048, 6]} />
                <meshStandardMaterial color="#d99a4a" roughness={0.6} />
              </mesh>
            </group>
            {/* Dua Kaki Oranye Kecil */}
            <mesh position={[-0.032, 0.04, 0.01]}>
              <cylinderGeometry args={[0.008, 0.008, 0.08, 5]} />
              <meshStandardMaterial color="#d97757" roughness={0.7} />
            </mesh>
            <mesh position={[0.032, 0.04, 0.01]}>
              <cylinderGeometry args={[0.008, 0.008, 0.08, 5]} />
              <meshStandardMaterial color="#d97757" roughness={0.7} />
            </mesh>
          </group>
        ))}

      {/* ==================================================================== */}
      {/* 3. KUNANG-KUNANG LEMBUT DANAU SENJA & DERMAGA (SENJA–MALAM HARI)     */}
      {/* ==================================================================== */}
      {showFireflies &&
        fireflySeeds.slice(0, fireflyCount).map((seed, idx) => (
          <group
            key={`ff-${idx}`}
            ref={(el) => {
              fireflyGroupRefs.current[idx] = el;
            }}
            position={[seed.baseX, seed.baseY, seed.baseZ]}
          >
            <mesh>
              <sphereGeometry args={[0.034, 6, 6]} />
              <meshBasicMaterial
                ref={(el) => {
                  fireflyCoreMats.current[idx] = el;
                }}
                color="#f7ff9c"
                transparent
                opacity={0.9}
              />
            </mesh>
            {settings.cinematicGlow && (
              <sprite scale={[0.75, 0.75, 1]}>
                <spriteMaterial
                  ref={(el) => {
                    fireflySpriteMats.current[idx] = el;
                  }}
                  map={textures.glowSprite}
                  color="#d9f96b"
                  transparent
                  opacity={0.7}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        ))}
    </group>
  );
};
