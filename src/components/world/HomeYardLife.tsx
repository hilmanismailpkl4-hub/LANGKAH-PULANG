import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HOME_MAILBOX_LETTERS } from '../../data/homeMailboxData';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface HomeYardLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const SOLAR_BOLLARD_POSITIONS: [number, number, number][] = [
  // 6 lampu tenaga surya berjajar rapi mengapit jalan setapak utama Rumah Jl. Melati No. 14
  [-21.88, 0, 56.1],
  [-21.88, 0, 58.0],
  [-21.88, 0, 59.9],
  [-18.12, 0, 56.1],
  [-18.12, 0, 58.0],
  [-18.12, 0, 59.9],
  // 2 lampu tenaga surya aksen mengapit sudut taman pot bunga Nadia
  [-26.25, 0, 59.5],
  [-23.5, 0, 59.5],
];

const WATER_DROP_COUNT = 22;

function createMailboxFrontTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#1f4d3a';
  ctx.fillRect(0, 0, 256, 192);

  // Bingkai garis emas tipis khas kotak surat rumah Indonesia klasik
  ctx.strokeStyle = '#d4af64';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 236, 172);

  // Celah surat gelap
  ctx.fillStyle = '#0e1d16';
  ctx.fillRect(36, 30, 184, 18);
  ctx.strokeStyle = '#d4af64';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 30, 184, 18);

  // Tulisan "KOTAK SURAT"
  ctx.fillStyle = '#f8efd9';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('KOTAK SURAT', 128, 96);

  ctx.fillStyle = '#e8c97e';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('JL. MELATI NO. 14', 128, 134);

  ctx.fillStyle = '#b9d8c7';
  ctx.font = '600 15px sans-serif';
  ctx.fillText('KEL. DAMAR PRATAMA', 128, 162);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Halaman Rumah Jl. Melati No. 14 Lebih Hidup:
 * 1. Rak & Pot Tanaman Bunga Nadia yang bisa disiram [E] (animasi gembor terangkat, 22 butiran air & bunga mekar segar)
 * 2. Kotak Surat Klasik di Pagar Kanan Rumah (bendera merah & amplop mengintip bila ada surat belum dibaca)
 * 3. 8 Lampu Taman Tenaga Surya Otomatis yang menyala keemasan hangat saat senja, hujan sore, dan malam
 */
export const HomeYardLife: React.FC<HomeYardLifeProps> = ({ timeOfDay, settings }) => {
  const gardenWatered = useGameStore((s) => s.gardenWatered);
  const readMailIds = useGameStore((s) => s.readMailIds);
  const textures = useMemo(() => getProceduralTextures(), []);
  const mailboxFrontTex = useMemo(() => createMailboxFrontTexture(), []);

  const wateringCanRef = useRef<THREE.Group>(null);
  const dropletsRef = useRef<(THREE.Mesh | null)[]>([]);
  const bloomGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const flagRef = useRef<THREE.Group>(null);
  const envelopePeekRef = useRef<THREE.Mesh>(null);
  const dewGroupRef = useRef<THREE.Group>(null);

  const hasUnreadMail = readMailIds.length < HOME_MAILBOX_LETTERS.length;
  const isSolarLit = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';
  const isFresh = gardenWatered || timeOfDay === 'rain_dusk';

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    // 1. Timer & Animasi Gembor Menyiram + 22 Butiran Air Melengkung ke Pot Bunga Nadia
    if (playerRuntime.gardenWaterTimer > 0) {
      playerRuntime.gardenWaterTimer = Math.max(0, playerRuntime.gardenWaterTimer - dt);
    }
    const watering = playerRuntime.gardenWaterTimer > 0;

    if (wateringCanRef.current) {
      if (watering) {
        // Gembor melayang lembut menyapu ke kiri-kanan di atas rak pot bunga Nadia
        const sweepX = Math.sin(t * 2.2) * 0.72;
        wateringCanRef.current.position.x = THREE.MathUtils.lerp(wateringCanRef.current.position.x, sweepX, dt * 6);
        wateringCanRef.current.position.y = THREE.MathUtils.lerp(
          wateringCanRef.current.position.y,
          1.45 + Math.sin(t * 4.5) * 0.04,
          dt * 6,
        );
        wateringCanRef.current.position.z = THREE.MathUtils.lerp(wateringCanRef.current.position.z, -0.45, dt * 6);
        wateringCanRef.current.rotation.x = THREE.MathUtils.lerp(wateringCanRef.current.rotation.x, 0.62, dt * 7);
        wateringCanRef.current.rotation.z = THREE.MathUtils.lerp(
          wateringCanRef.current.rotation.z,
          Math.cos(t * 2.2) * 0.14,
          dt * 6,
        );
      } else {
        // Kembali terparkir rapi di samping kanan rak bunga
        wateringCanRef.current.position.x = THREE.MathUtils.lerp(wateringCanRef.current.position.x, 1.38, dt * 5);
        wateringCanRef.current.position.y = THREE.MathUtils.lerp(wateringCanRef.current.position.y, 0.16, dt * 5);
        wateringCanRef.current.position.z = THREE.MathUtils.lerp(wateringCanRef.current.position.z, -0.18, dt * 5);
        wateringCanRef.current.rotation.x = THREE.MathUtils.lerp(wateringCanRef.current.rotation.x, 0, dt * 6);
        wateringCanRef.current.rotation.z = THREE.MathUtils.lerp(wateringCanRef.current.rotation.z, 0, dt * 6);
      }
    }

    // 22 butiran air berkilau jatuh parabola dari corong gembor
    const canX = wateringCanRef.current ? wateringCanRef.current.position.x : 0;
    const canY = wateringCanRef.current ? wateringCanRef.current.position.y : 1.4;
    for (let i = 0; i < WATER_DROP_COUNT; i++) {
      const m = dropletsRef.current[i];
      if (!m) continue;
      m.visible = watering;
      if (!watering) continue;
      const phase = ((t * 2.35 + i / WATER_DROP_COUNT) % 1 + 1) % 1;
      const spreadX = (((i * 37) % 11) - 5) * 0.035;
      const spreadZ = (((i * 19) % 7) - 3) * 0.04;
      m.position.set(
        canX + spreadX * (0.4 + phase * 1.4),
        canY - 0.12 - phase * phase * 1.15,
        -0.18 + phase * 0.42 + spreadZ * phase,
      );
      const sc = 0.65 + Math.sin(phase * Math.PI) * 0.55;
      m.scale.set(sc * 0.8, sc * 1.45, sc * 0.8);
    }

    // 2. Kelopak bunga mekar mengembang lembut & bergoyang tertiup angin saat segar/disiram
    const targetBloom = isFresh ? 1.24 : 0.92;
    for (let i = 0; i < bloomGroupRefs.current.length; i++) {
      const grp = bloomGroupRefs.current[i];
      if (!grp) continue;
      const pulse = isFresh ? Math.sin(t * 2.4 + i * 1.1) * 0.035 : 0;
      const s = THREE.MathUtils.lerp(grp.scale.x, targetBloom + pulse, dt * 2.8);
      grp.scale.set(s, s, s);
      grp.rotation.z = Math.sin(t * 1.6 + i * 1.3) * 0.055;
    }

    if (dewGroupRef.current) {
      dewGroupRef.current.visible = isFresh;
      if (isFresh) {
        dewGroupRef.current.position.y = Math.sin(t * 2.6) * 0.012;
      }
    }

    // 3. Animasi Bendera Penanda Merah Kotak Surat (tegak bila ada surat belum dibaca, turun saat sudah dibaca semua)
    if (flagRef.current) {
      const targetRot = hasUnreadMail ? 0 : Math.PI * 0.46;
      flagRef.current.rotation.x = THREE.MathUtils.lerp(flagRef.current.rotation.x, targetRot, dt * 6);
    }
    if (envelopePeekRef.current) {
      envelopePeekRef.current.visible = hasUnreadMail;
      if (hasUnreadMail) {
        envelopePeekRef.current.position.z = -0.175 + Math.sin(t * 2.2) * 0.004;
      }
    }
  });

  const leafBright = isFresh ? '#3f8a48' : '#4a6b48';
  const leafDark = isFresh ? '#2e703a' : '#3a573c';
  const soilColor = isFresh ? '#382518' : '#634832';

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. RAK & POT TANAMAN BUNGA NADIA (TERAS KIRI RUMAH: [-25.0, 0, 60.85])*/}
      {/* ==================================================================== */}
      <group position={[-25.0, 0, 60.85]}>
        {/* Rangka Rak Kayu Jati 2 Tingkat */}
        {[-1.02, 1.02].map((lx, idx) => (
          <React.Fragment key={`rl-${idx}`}>
            <mesh position={[lx, 0.46, 0.24]} castShadow>
              <boxGeometry args={[0.06, 0.92, 0.06]} />
              <meshStandardMaterial color="#6b472d" roughness={0.78} />
            </mesh>
            <mesh position={[lx, 0.46, -0.24]} castShadow>
              <boxGeometry args={[0.06, 0.92, 0.06]} />
              <meshStandardMaterial color="#6b472d" roughness={0.78} />
            </mesh>
          </React.Fragment>
        ))}
        {/* Papan Rak Bawah & Atas */}
        <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.18, 0.055, 0.54]} />
          <meshStandardMaterial color="#825838" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.18, 0.055, 0.54]} />
          <meshStandardMaterial color="#8c603e" roughness={0.72} />
        </mesh>

        {/* --- 3 POT BUNGA RAK ATAS (MELATI PUTIH, MAWAR PINK, MATAHARI MINI KIRA) --- */}
        {[
          { x: -0.72, potCol: '#b35c3d', flowerCol: '#fffaf0', centerCol: '#f6d55c', count: 5 }, // Melati Putih
          { x: 0.0, potCol: '#a65038', flowerCol: '#f47296', centerCol: '#ffe5ec', count: 5 }, // Mawar Pink Nadia
          { x: 0.72, potCol: '#bc6a44', flowerCol: '#f5b82e', centerCol: '#59331c', count: 4 }, // Matahari Mini Kira
        ].map((p, idx) => (
          <group key={`top-pot-${idx}`} position={[p.x, 0.85, 0]}>
            {/* Pot Terakota + Tanah */}
            <mesh position={[0, 0.13, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.115, 0.26, 12]} />
              <meshStandardMaterial color={p.potCol} roughness={0.86} />
            </mesh>
            <mesh position={[0, 0.255, 0]}>
              <cylinderGeometry args={[0.145, 0.145, 0.02, 12]} />
              <meshStandardMaterial color={soilColor} roughness={0.95} />
            </mesh>
            {/* Rimbunan Daun */}
            <mesh position={[0, 0.36, 0]} castShadow>
              <dodecahedronGeometry args={[0.2, 1]} />
              <meshStandardMaterial color={idx % 2 === 0 ? leafBright : leafDark} roughness={0.82} />
            </mesh>
            {/* Kelompok Kelopak Bunga Mekar Animasi */}
            <group
              ref={(el) => {
                bloomGroupRefs.current[idx] = el;
              }}
              position={[0, 0.48, 0]}
            >
              {Array.from({ length: p.count }).map((_, fi) => {
                const ang = (fi / p.count) * Math.PI * 2 + idx * 0.5;
                const r = fi === 0 ? 0 : 0.11;
                return (
                  <group key={`fl-${fi}`} position={[Math.cos(ang) * r, fi === 0 ? 0.07 : 0.01, Math.sin(ang) * r]}>
                    <mesh castShadow>
                      <sphereGeometry args={[0.055, 8, 8]} />
                      <meshStandardMaterial
                        color={p.flowerCol}
                        emissive={isFresh ? p.flowerCol : '#000000'}
                        emissiveIntensity={isFresh ? 0.14 : 0}
                        roughness={0.5}
                      />
                    </mesh>
                    <mesh position={[0, 0.032, 0]}>
                      <sphereGeometry args={[0.022, 6, 6]} />
                      <meshStandardMaterial color={p.centerCol} roughness={0.5} />
                    </mesh>
                  </group>
                );
              })}
            </group>
          </group>
        ))}

        {/* --- 2 POT DAUN RAK BAWAH (LIDAH MERTUA & KEMANGI DAPUR) --- */}
        <group position={[-0.55, 0.29, 0]}>
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.11, 0.22, 12]} />
            <meshStandardMaterial color="#d8cfc2" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.215, 0]}>
            <cylinderGeometry args={[0.135, 0.135, 0.02, 10]} />
            <meshStandardMaterial color={soilColor} roughness={0.95} />
          </mesh>
          {/* Helai Lidah Mertua Tegak */}
          {[-0.05, 0, 0.05, -0.02, 0.03].map((ox, li) => (
            <mesh
              key={`lm-${li}`}
              position={[ox, 0.37, (li % 2 === 0 ? 1 : -1) * 0.03]}
              rotation={[0, li * 0.5, (li - 2) * 0.08]}
              castShadow
            >
              <boxGeometry args={[0.045, 0.34, 0.012]} />
              <meshStandardMaterial color={li % 2 === 0 ? leafBright : '#6ca65b'} roughness={0.72} />
            </mesh>
          ))}
        </group>

        <group position={[0.55, 0.29, 0]}>
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.12, 0.22, 12]} />
            <meshStandardMaterial color="#b0593c" roughness={0.84} />
          </mesh>
          <mesh position={[0, 0.215, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.02, 10]} />
            <meshStandardMaterial color={soilColor} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.32, 0]} castShadow>
            <dodecahedronGeometry args={[0.19, 1]} />
            <meshStandardMaterial color={leafBright} roughness={0.82} />
          </mesh>
        </group>

        {/* --- 2 POT BESAR TERAKOTA DI SAMPING KIRI & KANAN RAK (BOUGAINVILLEA & MELATI) --- */}
        {[
          { x: -1.35, z: -0.62, bloomCol: '#e05382', bIdx: 3 },
          { x: 1.35, z: -0.66, bloomCol: '#fff7de', bIdx: 4 },
        ].map((fp, fi) => (
          <group key={`flank-pot-${fi}`} position={[fp.x, 0, fp.z]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.16, 0.4, 12]} />
              <meshStandardMaterial color="#a85338" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.395, 0]}>
              <cylinderGeometry args={[0.195, 0.195, 0.02, 12]} />
              <meshStandardMaterial color={soilColor} roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.56, 0]} castShadow>
              <dodecahedronGeometry args={[0.27, 1]} />
              <meshStandardMaterial color={leafDark} roughness={0.84} />
            </mesh>
            <group
              ref={(el) => {
                bloomGroupRefs.current[fp.bIdx] = el;
              }}
              position={[0, 0.68, 0]}
            >
              {[
                [0.09, 0.06, 0.08],
                [-0.1, 0.04, 0.05],
                [0.04, 0.11, -0.07],
                [-0.07, 0.02, -0.09],
              ].map(([bx, by, bz], bi) => (
                <mesh key={`fb-${bi}`} position={[bx, by, bz]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial
                    color={fp.bloomCol}
                    emissive={isFresh ? fp.bloomCol : '#000000'}
                    emissiveIntensity={isFresh ? 0.12 : 0}
                    roughness={0.55}
                  />
                </mesh>
              ))}
            </group>
          </group>
        ))}

        {/* Kilau Embun Halus pada Tanaman Setelah Disiram */}
        <group ref={dewGroupRef} visible={isFresh}>
          {[
            [-0.72, 1.36, -0.06],
            [0.0, 1.38, -0.08],
            [0.72, 1.35, -0.05],
            [-1.35, 0.78, -0.58],
            [1.35, 0.76, -0.62],
          ].map(([dx, dy, dz], di) => (
            <mesh key={`dew-${di}`} position={[dx, dy, dz]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshStandardMaterial
                color="#e0f7ff"
                emissive="#9be7ff"
                emissiveIntensity={0.85}
                roughness={0.12}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>

        {/* Gembor Penyiram Tanaman Hijau Sage (terangkat & menyiram otomatis saat [E] ditekan!) */}
        <group ref={wateringCanRef} position={[1.38, 0.16, -0.18]}>
          {/* Badan Gembor */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.28, 12]} />
            <meshStandardMaterial color="#4e8c68" roughness={0.42} metalness={0.18} />
          </mesh>
          {/* Tutup Atas */}
          <mesh position={[0, 0.145, -0.02]}>
            <cylinderGeometry args={[0.115, 0.115, 0.02, 12]} />
            <meshStandardMaterial color="#3c7353" roughness={0.45} />
          </mesh>
          {/* Gagang Pegangan Belakang */}
          <mesh position={[0, 0.04, -0.14]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.09, 0.016, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#3c7353" roughness={0.45} />
          </mesh>
          {/* Corong Pancuran Depan */}
          <mesh position={[0, 0.05, 0.18]} rotation={[0.92, 0, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.036, 0.28, 8]} />
            <meshStandardMaterial color="#4e8c68" roughness={0.4} />
          </mesh>
          {/* Kepala Shower Kuningan */}
          <mesh position={[0, 0.13, 0.3]} rotation={[0.92, 0, 0]}>
            <cylinderGeometry args={[0.052, 0.026, 0.05, 10]} />
            <meshStandardMaterial color="#d9b25f" metalness={0.68} roughness={0.3} />
          </mesh>
        </group>

        {/* 22 Butiran Air Berkilau saat Menyiram */}
        {Array.from({ length: WATER_DROP_COUNT }).map((_, wi) => (
          <mesh
            key={`wd-${wi}`}
            ref={(el) => {
              dropletsRef.current[wi] = el;
            }}
            visible={false}
          >
            <sphereGeometry args={[0.024, 6, 6]} />
            <meshBasicMaterial color="#bfefff" transparent opacity={0.85} />
          </mesh>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 2. KOTAK SURAT KLASIK DI PAGAR KANAN RUMAH ([-16.9, 1.05, 53.72])    */}
      {/* ==================================================================== */}
      <group position={[-16.9, 1.05, 53.72]}>
        {/* Braket Besi Dudukan Menempel ke Dinding Pagar */}
        <mesh position={[0, -0.14, 0.14]} castShadow>
          <boxGeometry args={[0.38, 0.08, 0.14]} />
          <meshStandardMaterial color="#272f38" metalness={0.6} roughness={0.45} />
        </mesh>
        {/* Badan Kotak Surat Besi Hijau Tua Klasik */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.34, 0.24]} />
          <meshStandardMaterial color="#1f4d3a" metalness={0.35} roughness={0.48} />
        </mesh>
        {/* Atap Miring Anti-Hujan */}
        <mesh position={[0, 0.2, -0.02]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.47, 0.045, 0.32]} />
          <meshStandardMaterial color="#15382a" metalness={0.4} roughness={0.42} />
        </mesh>
        {/* Muka Depan Bertekstur "KOTAK SURAT · JL. MELATI NO. 14" */}
        <mesh position={[0, 0, -0.123]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.38, 0.29]} />
          <meshStandardMaterial map={mailboxFrontTex} roughness={0.5} />
        </mesh>
        {/* Amplop Krem Mengintip dari Celah Surat bila Ada Surat Belum Dibaca */}
        <mesh ref={envelopePeekRef} position={[0, 0.095, -0.175]} rotation={[0.25, 0, 0.04]}>
          <boxGeometry args={[0.22, 0.015, 0.12]} />
          <meshStandardMaterial color="#fdf6e3" roughness={0.85} />
        </mesh>
        {/* Bendera Penanda Surat Merah di Sisi Kanan Kotak */}
        <group ref={flagRef} position={[0.225, 0.02, -0.02]}>
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.22, 6]} />
            <meshStandardMaterial color="#d4af64" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.2, -0.045]}>
            <boxGeometry args={[0.015, 0.075, 0.1]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive={hasUnreadMail ? '#ef4444' : '#000000'}
              emissiveIntensity={hasUnreadMail ? 0.55 : 0}
              roughness={0.45}
            />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3. 8 LAMPU TAMAN TENAGA SURYA OTOMATIS DI HALAMAN RUMAH              */}
      {/* ==================================================================== */}
      {SOLAR_BOLLARD_POSITIONS.map(([sx, sy, sz], idx) => (
        <group key={`solar-${idx}`} position={[sx, sy, sz]}>
          {/* Alas Tanam */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.075, 0.09, 0.06, 8]} />
            <meshStandardMaterial color="#1f242b" metalness={0.55} roughness={0.5} />
          </mesh>
          {/* Tiang Baja Hitam Matte */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.028, 0.032, 0.42, 8]} />
            <meshStandardMaterial color="#272e38" metalness={0.62} roughness={0.42} />
          </mesh>
          {/* Lentera Kaca LED Tenaga Surya */}
          <mesh position={[0, 0.51, 0]}>
            <cylinderGeometry args={[0.056, 0.05, 0.13, 10]} />
            <meshStandardMaterial
              color={isSolarLit ? '#fff1cc' : '#d6dfe8'}
              emissive={isSolarLit ? '#ffb347' : '#000000'}
              emissiveIntensity={isDarkNight ? 2.9 : isSolarLit ? 1.85 : 0}
              roughness={0.22}
              transparent={!isSolarLit}
              opacity={isSolarLit ? 1 : 0.72}
            />
          </mesh>
          {/* Topi & Panel Surya Biru Tua di Puncak */}
          <mesh position={[0, 0.59, 0]} castShadow>
            <cylinderGeometry args={[0.078, 0.088, 0.032, 10]} />
            <meshStandardMaterial color="#1d232b" metalness={0.55} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.608, 0]}>
            <boxGeometry args={[0.075, 0.006, 0.075]} />
            <meshStandardMaterial color="#1b3a66" metalness={0.75} roughness={0.22} />
          </mesh>
          {/* Halo Cahaya Lembut Otomatis saat Senja–Malam */}
          {isSolarLit && settings.graphicsQuality !== 'low' && (
            <sprite position={[0, 0.51, 0]} scale={isDarkNight ? [0.95, 0.95, 1] : [0.72, 0.72, 1]}>
              <spriteMaterial
                map={textures.glowSprite}
                color="#ffc76e"
                transparent
                opacity={isDarkNight ? 0.62 : 0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          )}
        </group>
      ))}

      {/* Dua Cahaya Hangat Ground-Level Menyusuri Jalan Setapak & Taman Bunga saat Senja–Malam */}
      {isSolarLit && (
        <>
          <pointLight
            position={[-20.0, 0.95, 58.0]}
            color="#ffc875"
            intensity={isDarkNight ? 5.2 : 3.2}
            distance={10.5}
            decay={1.8}
          />
          <pointLight
            position={[-24.9, 1.05, 59.8]}
            color="#ffcf82"
            intensity={isDarkNight ? 3.8 : 2.3}
            distance={7.5}
            decay={1.8}
          />
        </>
      )}
    </group>
  );
};
