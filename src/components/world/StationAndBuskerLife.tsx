import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sfxEngine } from '../../audio/sfxEngine';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface StationAndBuskerLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MAS_SENO_PROFILE: CharacterProfile = {
  id: 'bang_ari',
  name: 'Mas Seno',
  role: 'Pemusik Akustik Tepi Sungai',
  accentColor: '#f5b867',
  voice: { pitch: 0.95, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.72,
    shirtColor: '#6d4c3d',
    pantsColor: '#272c36',
    skinColor: '#d1a17b',
    hairColor: '#211c19',
    accentProp: 'scarf',
  },
};

function createNewsstandBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1b4332';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#e9c46a';
  ctx.lineWidth = 7;
  ctx.strokeRect(7, 7, 498, 114);
  ctx.fillStyle = '#fefae0';
  ctx.font = 'bold 38px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KIOS WARTA SENJA', 256, 52);
  ctx.fillStyle = '#f4d58d';
  ctx.font = '600 19px sans-serif';
  ctx.fillText('KORAN PAGI · MAJALAH · KABAR KOTA', 256, 94);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createPlatformBoardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 144;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 144);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 6;
  ctx.strokeRect(5, 5, 502, 134);
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('STASIUN SENJA · JALUR 1 KOMUTER', 24, 38);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 32px monospace';
  ctx.fillText('KRL LINTAS KOTA', 24, 82);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 18px monospace';
  ctx.fillText('PERHATIKAN SINYAL REL & GARIS AMAN', 24, 118);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 1. Sinyal Rel Kereta Berkedip & Papan Status Peron Real-Time (tersinkron 100% dengan kereta komuter!)
 * 2. Kios Koran & Majalah "Warta Senja" di Peron Stasiun Senja ([75.4, 0.1, 8.8])
 * 3. Sudut Pemusik Jalanan Akustik Tepi Sungai — Mas Seno ([-58.0, 0, 14.5])
 */
export const StationAndBuskerLife: React.FC<StationAndBuskerLifeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const newsBannerTex = useMemo(() => createNewsstandBannerTexture(), []);
  const boardTex = useMemo(() => createPlatformBoardTexture(), []);

  const sigLeftMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const sigRightMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const sigHaloLeft = useRef<(THREE.Sprite | null)[]>([]);
  const sigHaloRight = useRef<(THREE.Sprite | null)[]>([]);
  const boardLedMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const buskerHeadRef = useRef<THREE.Group>(null);
  const buskerRightArmRef = useRef<THREE.Group>(null);
  const buskerLeftArmRef = useRef<THREE.Group>(null);
  const buskerNoteRef = useRef<THREE.Group>(null);
  const lastStrumRef = useRef(0);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const trainZ = playerRuntime.trainZ;
    const atPlatform = playerRuntime.trainAtPlatform;
    // Kereta berada di zona sinyal stasiun (mendekat, berhenti di peron, atau sedang berangkat keluar)
    const trainInZone = trainZ > -76 && trainZ < 44;
    const blinkA = Math.sin(t * 9.5) > 0;

    // === 1. LAMPU SINYAL REL STASIUN BERKEDIP BERGANTIAN MERAH / HIJAU AMAN ===
    for (let i = 0; i < 2; i++) {
      const mL = sigLeftMats.current[i];
      const mR = sigRightMats.current[i];
      const hL = sigHaloLeft.current[i];
      const hR = sigHaloRight.current[i];

      if (trainInZone) {
        const leftOn = blinkA;
        const rightOn = !blinkA;
        if (mL) {
          mL.color.set(leftOn ? '#ff3b30' : '#4a1816');
          mL.emissive.set('#ff2a1f');
          mL.emissiveIntensity = leftOn ? 4.8 : 0.15;
        }
        if (mR) {
          mR.color.set(rightOn ? '#ff3b30' : '#4a1816');
          mR.emissive.set('#ff2a1f');
          mR.emissiveIntensity = rightOn ? 4.8 : 0.15;
        }
        if (hL) hL.visible = leftOn && settings.cinematicGlow;
        if (hR) hR.visible = rightOn && settings.cinematicGlow;
      } else {
        // Jalur aman — lampu hijau tenang lembut di kiri, redup di kanan
        if (mL) {
          mL.color.set('#34d399');
          mL.emissive.set('#10b981');
          mL.emissiveIntensity = 2.2;
        }
        if (mR) {
          mR.color.set('#1f2937');
          mR.emissive.set('#000000');
          mR.emissiveIntensity = 0;
        }
        if (hL) hL.visible = false;
        if (hR) hR.visible = false;
      }
    }

    // LED Status Papan Informasi Peron (Hijau saat berhenti, Oranye berkedip saat mendekat, Biru tenang saat aman)
    if (boardLedMatRef.current) {
      if (atPlatform) {
        boardLedMatRef.current.color.set('#34d399');
        boardLedMatRef.current.emissive.set('#10b981');
        boardLedMatRef.current.emissiveIntensity = 3.2;
      } else if (trainInZone) {
        boardLedMatRef.current.color.set('#fbbf24');
        boardLedMatRef.current.emissive.set('#f59e0b');
        boardLedMatRef.current.emissiveIntensity = blinkA ? 3.8 : 0.6;
      } else {
        boardLedMatRef.current.color.set('#60a5fa');
        boardLedMatRef.current.emissive.set('#3b82f6');
        boardLedMatRef.current.emissiveIntensity = 1.6;
      }
    }

    // === 2. ANIMASI PEMUSIK JALANAN AKUSTIK TEPI SUNGAI (MAS SENO) ===
    if (!isRain) {
      if (buskerHeadRef.current) {
        buskerHeadRef.current.rotation.x = 0.08 + Math.sin(t * 2.4) * 0.08;
        buskerHeadRef.current.rotation.y = Math.sin(t * 0.85) * 0.22;
      }
      if (buskerRightArmRef.current) {
        // Gerakan memetik senar gitar akustik pelan berirama
        buskerRightArmRef.current.rotation.x = -0.82 + Math.sin(t * 4.8) * 0.14;
        buskerRightArmRef.current.rotation.z = -0.22;
      }
      if (buskerLeftArmRef.current) {
        buskerLeftArmRef.current.rotation.x = -0.95 + Math.cos(t * 1.4) * 0.06;
        buskerLeftArmRef.current.rotation.z = 0.25;
      }
      if (buskerNoteRef.current) {
        const p = ((t * 0.5) % 1 + 1) % 1;
        buskerNoteRef.current.position.y = 1.65 + p * 0.55;
        buskerNoteRef.current.position.x = 0.28 + Math.sin(t * 2.4) * 0.12;
        buskerNoteRef.current.rotation.y = t * 1.5;
        const sc = 0.55 + Math.sin(p * Math.PI) * 0.5;
        buskerNoteRef.current.scale.set(sc, sc, sc);
      }

      // Petikan gitar akustik lembut otomatis saat Damar melintas dekat tepi sungai barat
      const [px, py, pz] = playerRuntime.position;
      const distBusker = py > 4 ? 99 : Math.hypot(px - -58.0, pz - 14.5);
      if (distBusker < 14.5 && useGameStore.getState().screen === 'playing') {
        const nowMs = Date.now();
        if (nowMs - lastStrumRef.current > 4600) {
          lastStrumRef.current = nowMs;
          sfxEngine.playBuskerStrum(Math.max(0.2, 1 - distBusker / 15.5), false);
        }
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. DUA TIANG SINYAL REL BERKEDIP & PAPAN STATUS PERON STASIUN SENJA  */}
      {/* ==================================================================== */}
      {([-18.5, 12.5] as number[]).map((sz, idx) => (
        <group key={`rail-sig-${idx}`} position={[88.65, 0.1, sz]}>
          {/* Tiang Sinyal Belang Hitam-Putih Khas Kereta Api Indonesia */}
          {[0, 1, 2, 3, 4, 5].map((seg) => (
            <mesh key={`rsg-${seg}`} position={[0, 0.32 + seg * 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.075, 0.085, 0.62, 10]} />
              <meshStandardMaterial color={seg % 2 === 0 ? '#1e242e' : '#f1f5f9'} roughness={0.55} />
            </mesh>
          ))}
          {/* Palang X Sinyal Rel (Kuning-Hitam) */}
          <group position={[-0.14, 2.75, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.92, 0.14, 0.05]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.92, 0.14, 0.05]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.5} />
            </mesh>
          </group>
          {/* Kotak Lampu Sinyal Kembar Menghadap Peron (-X) */}
          <mesh position={[-0.12, 3.65, 0]}>
            <boxGeometry args={[0.18, 0.44, 0.98]} />
            <meshStandardMaterial color="#181c24" roughness={0.45} />
          </mesh>
          {/* Lampu Sinyal Kiri */}
          <mesh position={[-0.22, 3.65, -0.26]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 12]} />
            <meshStandardMaterial
              ref={(el) => {
                sigLeftMats.current[idx] = el;
              }}
              color="#34d399"
              emissive="#10b981"
              emissiveIntensity={2.0}
            />
          </mesh>
          <sprite
            ref={(el) => {
              sigHaloLeft.current[idx] = el;
            }}
            position={[-0.36, 3.65, -0.26]}
            scale={[1.8, 1.8, 1]}
            visible={false}
          >
            <spriteMaterial
              map={textures.glowSprite}
              color="#ff3b30"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
          {/* Lampu Sinyal Kanan */}
          <mesh position={[-0.22, 3.65, 0.26]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.14, 12]} />
            <meshStandardMaterial
              ref={(el) => {
                sigRightMats.current[idx] = el;
              }}
              color="#1f2937"
              emissive="#000000"
              emissiveIntensity={0}
            />
          </mesh>
          <sprite
            ref={(el) => {
              sigHaloRight.current[idx] = el;
            }}
            position={[-0.36, 3.65, 0.26]}
            scale={[1.8, 1.8, 1]}
            visible={false}
          >
            <spriteMaterial
              map={textures.glowSprite}
              color="#ff3b30"
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        </group>
      ))}

      {/* Papan Status Peron Gantung Bercahaya di Tengah Kanopi Stasiun Senja */}
      <group position={[81.5, 3.35, -1.0]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.78, 2.65]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-0.13, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.5, 0.68]} />
          <meshStandardMaterial
            map={boardTex}
            emissiveMap={boardTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.95 : 0.35}
          />
        </mesh>
        <mesh position={[0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.5, 0.68]} />
          <meshStandardMaterial
            map={boardTex}
            emissiveMap={boardTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.95 : 0.35}
          />
        </mesh>
        {/* Strip Indikator Status Kereta Real-Time di Bawah Papan */}
        <mesh position={[0, -0.43, 0]}>
          <boxGeometry args={[0.26, 0.08, 2.2]} />
          <meshStandardMaterial
            ref={boardLedMatRef}
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={1.6}
          />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 2. KIOS KORAN & MAJALAH "WARTA SENJA" ([75.4, 0.1, 8.8])             */}
      {/* ==================================================================== */}
      <group position={[75.4, 0.1, 8.8]} rotation={[0, Math.PI / 2, 0]}>
        {/* Bodi Kios Kayu Hijau Tua & Jati */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.35, 1.1, 1.48]} />
          <meshStandardMaterial color="#1f4738" roughness={0.78} />
        </mesh>
        {/* Meja Counter Kayu Display Koran */}
        <mesh position={[0, 1.14, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.08, 1.72]} />
          <meshStandardMaterial color="#7d5636" roughness={0.68} />
        </mesh>

        {/* Tumpukan Koran Broadsheet & Majalah Warna-Warni di Meja Counter */}
        {[-0.78, -0.28, 0.24, 0.74].map((nx, ni) => (
          <group key={`np-${ni}`} position={[nx, 1.24, 0.42]}>
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.12, 0.3]} />
              <meshStandardMaterial color={['#f4efe4', '#e8dfd0', '#f7f3eb', '#efe6d5'][ni]} roughness={0.86} />
            </mesh>
            {/* Header Judul Koran */}
            <mesh position={[0, 0.065, -0.07]}>
              <boxGeometry args={[0.32, 0.01, 0.07]} />
              <meshStandardMaterial color={['#1e3a5f', '#9b2c2c', '#1b4332', '#b45309'][ni]} />
            </mesh>
          </group>
        ))}

        {/* Tiang Penopang & Atap Kanopi Miring */}
        {[
          [-1.12, 1.78, -0.68],
          [1.12, 1.78, -0.68],
          [-1.12, 1.78, 0.68],
          [1.12, 1.78, 0.68],
        ].map(([px, py, pz], pi) => (
          <mesh key={`np-p-${pi}`} position={[px, py, pz]} castShadow>
            <boxGeometry args={[0.09, 1.32, 0.09]} />
            <meshStandardMaterial color="#4a3322" roughness={0.85} />
          </mesh>
        ))}
        {/* Dinding Belakang & Rak Majalah Gantung */}
        <mesh position={[0, 1.72, -0.68]} castShadow>
          <boxGeometry args={[2.3, 1.28, 0.08]} />
          <meshStandardMaterial color="#274f3f" roughness={0.82} />
        </mesh>
        {[-0.68, -0.22, 0.24, 0.7].map((mx, mi) => (
          <mesh key={`mag-${mi}`} position={[mx, 1.76, -0.61]}>
            <boxGeometry args={[0.32, 0.44, 0.04]} />
            <meshStandardMaterial
              color={['#dc6b5a', '#4f82a8', '#e5b84f', '#6ca67c'][mi]}
              roughness={0.6}
            />
          </mesh>
        ))}

        {/* Atap Kios & Papan Nama Bercahaya "KIOS WARTA SENJA" */}
        <mesh position={[0, 2.48, 0.04]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[2.75, 0.12, 1.98]} />
          <meshStandardMaterial color="#2c3e35" roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.22, 0.78]}>
          <planeGeometry args={[2.28, 0.56]} />
          <meshStandardMaterial
            map={newsBannerTex}
            emissiveMap={newsBannerTex}
            emissive="#ffebbc"
            emissiveIntensity={isEveningOrNight ? 0.85 : 0.14}
          />
        </mesh>

        {/* Bohlam Hangat di Dalam Kios Koran */}
        <mesh position={[0, 2.24, 0.15]}>
          <sphereGeometry args={[0.085, 8, 8]} />
          <meshStandardMaterial
            color="#fff2c4"
            emissive="#ffbd59"
            emissiveIntensity={isEveningOrNight ? 2.8 : 0.35}
          />
        </mesh>
        {isEveningOrNight && (
          <pointLight position={[0, 2.05, 0.45]} color="#ffc875" intensity={10} distance={12} decay={1.8} />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 3. SUDUT PEMUSIK AKUSTIK TEPI SUNGAI — MAS SENO ([-58.0, 0, 14.5])   */}
      {/* ==================================================================== */}
      {!isRain && (
        <group position={[-58.0, 0, 14.5]} rotation={[0, Math.PI / 2, 0]}>
          {/* Kotak Kayu Duduk Pemusik */}
          <mesh position={[0, 0.24, -0.06]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.48, 0.44]} />
            <meshStandardMaterial color="#6e4a2e" roughness={0.85} />
          </mesh>

          {/* Mas Seno Bermain Gitar Akustik */}
          <group position={[0, -0.06, 0]}>
            <HumanModel
              profile={MAS_SENO_PROFILE}
              headRef={buskerHeadRef}
              leftArmRef={buskerLeftArmRef}
              rightArmRef={buskerRightArmRef}
            />
          </group>

          {/* Gitar Akustik di Pangkuan Mas Seno */}
          <group position={[0.06, 0.94, 0.28]} rotation={[0.18, 0.1, -1.12]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.09, 14]} />
              <meshStandardMaterial color="#bd7538" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.145, 0.145, 0.09, 14]} />
              <meshStandardMaterial color="#bd7538" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.02, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 12]} />
              <meshBasicMaterial color="#1f120a" />
            </mesh>
            <mesh position={[0, 0.42, 0.01]} castShadow>
              <boxGeometry args={[0.058, 0.58, 0.042]} />
              <meshStandardMaterial color="#3c2618" roughness={0.6} />
            </mesh>
          </group>

          {/* Kotak Gitar Terbuka di Depan Pemusik + Lentera Portabel Hangat */}
          <group position={[0, 0.04, 0.82]} rotation={[0, 0.14, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.92, 0.08, 0.38]} />
              <meshStandardMaterial color="#2b2420" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <boxGeometry args={[0.84, 0.02, 0.3]} />
              <meshStandardMaterial color="#7d2e2e" roughness={0.9} />
            </mesh>
            {/* Lentera Kecil Hangat di Samping Kotak Gitar */}
            <group position={[0.62, 0.12, -0.08]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.095, 0.24, 10]} />
                <meshStandardMaterial
                  color="#ffefc2"
                  emissive="#ffb64d"
                  emissiveIntensity={isEveningOrNight ? 2.8 : 0.4}
                />
              </mesh>
              {isEveningOrNight && settings.cinematicGlow && (
                <pointLight position={[0, 0.2, 0]} color="#ffc56e" intensity={8} distance={10} decay={1.8} />
              )}
            </group>
          </group>

          {/* Nada Akustik Kecil Mengapung Lembut */}
          <group ref={buskerNoteRef} position={[0.28, 1.7, 0.2]}>
            <mesh>
              <octahedronGeometry args={[0.048, 0]} />
              <meshStandardMaterial color="#ffe49e" emissive="#ffb84d" emissiveIntensity={2.2} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
