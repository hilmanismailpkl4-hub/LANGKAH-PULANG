import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerRuntime, shouldSkipPerfFrame } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface SoutheastHeritageSquareAndRukoProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

function createSignCanvasTexture(
  bg: string,
  border: string,
  title: string,
  subtitle: string,
  titleColor = '#fef3c7',
  subColor = '#fde68a',
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = border;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);

  ctx.fillStyle = titleColor;
  ctx.font = 'bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 46);

  ctx.fillStyle = subColor;
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(subtitle, 256, 88);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createBatikClothTexture(primary: string, accent: string, dot: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = primary;
  ctx.fillRect(0, 0, 128, 256);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  for (let y = -64; y < 300; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y + 64);
    ctx.stroke();
  }
  ctx.fillStyle = dot;
  for (let y = 16; y < 248; y += 28) {
    for (let x = 16; x < 120; x += 28) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Upgrade Lingkungan & Arsitektur Distrik Tenggara–Stasiun Selatan:
 * 1. Taman Heritage Roda Lokomotif & Lonceng Stasiun 1928 ([79.5, 0, 35.5]) di sisi timur Koridor Tabebuya:
 *    Plaza bata melingkar, monumen roda besi lokomotif uap antik, lonceng perunggu berayun,
 *    2 bangku besi tempa (menghadap Tabebuya & menghadap perlintasan KRL), lampu kolonial kembar, & 6 burung merpati.
 * 2. Fasad Lantai Dasar Ruko "Galeri Batik & Tenun Senja" pada Gedung Tenggara 1 ([46.0, 0, 16.3]).
 * 3. Fasad Lantai Dasar "Kantor Pos & Filateli Senja Selatan" + Bis Surat Oranye pada Gedung Tenggara 2 ([52.8, 0, 54.0]).
 */
export const SoutheastHeritageSquareAndRuko: React.FC<SoutheastHeritageSquareAndRukoProps> = ({
  timeOfDay,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const isEveningOrNight = timeOfDay !== 'morning';

  const heritagePlaqueTex = useMemo(
    () =>
      createSignCanvasTexture(
        '#291d14',
        '#d97706',
        'MONUMEN JALUR SELATAN · 1928',
        'RODA LOKOMOTIF SERI C-28 & LONCENG PERON LAMA',
      ),
    [],
  );
  const batikSignTex = useMemo(
    () =>
      createSignCanvasTexture(
        '#3b1d11',
        '#f59e0b',
        'GALERI BATIK & TENUN SENJA',
        'KAIN TULIS NUSANTARA · PARANG · MEGA MENDUNG · KAWUNG',
      ),
    [],
  );
  const posSignTex = useMemo(
    () =>
      createSignCanvasTexture(
        '#c2410c',
        '#fde047',
        'KANTOR POS & FILATELI SENJA',
        'SURAT KILAT · KARTU POS · PAKET NUSANTARA',
        '#ffffff',
        '#fef08a',
      ),
    [],
  );

  const batikTex1 = useMemo(() => createBatikClothTexture('#7c2d12', '#fbbf24', '#fef3c7'), []);
  const batikTex2 = useMemo(() => createBatikClothTexture('#1e3a8a', '#38bdf8', '#e0f2fe'), []);
  const batikTex3 = useMemo(() => createBatikClothTexture('#14532d', '#eab308', '#fef9c3'), []);

  const bellPivotRef = useRef<THREE.Group>(null);
  const pigeonsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    if (playerRuntime.stationBellTimer > 0) {
      playerRuntime.stationBellTimer = Math.max(0, playerRuntime.stationBellTimer - dt);
    }

    if (shouldSkipPerfFrame(79.5, 35.5, 58)) return;

    if (bellPivotRef.current) {
      const bellAmp = playerRuntime.stationBellTimer > 0 ? Math.sin(t * 11.5) * 0.36 : Math.sin(t * 1.4) * 0.025;
      bellPivotRef.current.rotation.z = bellAmp;
    }

    if (pigeonsRef.current) {
      const startled = playerRuntime.stationBellTimer > 1.8;
      pigeonsRef.current.children.forEach((child, idx) => {
        const angle = idx * ((Math.PI * 2) / 6) + t * 0.22;
        const rad = 2.6 + Math.sin(t * 0.7 + idx) * 0.45;
        const hopY = startled
          ? 0.45 + Math.abs(Math.sin(t * 9 + idx)) * 0.55
          : Math.max(0, Math.sin(t * 4.5 + idx * 1.7)) * 0.06;
        child.position.set(Math.cos(angle) * rad, hopY, Math.sin(angle) * rad);
        child.rotation.y = -angle + Math.PI / 2;
      });
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. TAMAN HERITAGE RODA LOKOMOTIF & LONCENG STASIUN 1928 ([79.5,0,35.5]) */}
      {/* ==================================================================== */}
      <group position={[79.5, 0, 35.5]}>
        {/* Lantai Bundar Bata Terakota & Cincin Batu Andesit */}
        <mesh position={[0, 0.016, 0]} receiveShadow>
          <cylinderGeometry args={[5.4, 5.5, 0.032, 28]} />
          <meshStandardMaterial map={textures.paving} color="#9ca3af" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.026, 0]} receiveShadow>
          <cylinderGeometry args={[3.9, 3.95, 0.024, 24]} />
          <meshStandardMaterial color="#7c3f2c" roughness={0.85} />
        </mesh>

        {/* Jalan Setapak Penghubung ke Trotoar Jl. Stasiun Timur */}
        {[-7.8, -6.4, -5.0].map((px, pi) => (
          <mesh key={`hstep-${pi}`} position={[px, 0.018, 0]} receiveShadow>
            <boxGeometry args={[1.1, 0.03, 1.65]} />
            <meshStandardMaterial map={textures.paving} roughness={0.88} />
          </mesh>
        ))}

        {/* Pedestal Bata & Sepasang Roda Besi Lokomotif Uap 1928 */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.56, 1.45]} />
            <meshStandardMaterial map={textures.brick} color="#8c4633" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.58, 0]} castShadow>
            <boxGeometry args={[2.66, 0.07, 1.6]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
          {/* Dua Batang Rel Pendek Pajangan */}
          {[-0.42, 0.42].map((rz, ri) => (
            <mesh key={`drail-${ri}`} position={[0, 0.64, rz]}>
              <boxGeometry args={[2.3, 0.06, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.35} />
            </mesh>
          ))}
          {/* Dua Pasang Roda Besi Lokomotif & Batang Penggerak */}
          {[-0.58, 0.58].map((wx, wi) => (
            <group key={`lwheel-${wi}`} position={[wx, 1.12, 0]}>
              {[-0.42, 0.42].map((wz, wzi) => (
                <mesh key={`lw-${wzi}`} position={[0, 0, wz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.46, 0.46, 0.09, 18]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.72} roughness={0.35} />
                </mesh>
              ))}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.96, 10]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          ))}
          {/* Batang Kopel Merah Klasik Lokomotif */}
          <mesh position={[0, 1.02, -0.49]} castShadow>
            <boxGeometry args={[1.32, 0.08, 0.04]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.02, 0.49]} castShadow>
            <boxGeometry args={[1.32, 0.08, 0.04]} />
            <meshStandardMaterial color="#b91c1c" metalness={0.5} roughness={0.4} />
          </mesh>

          {/* Tiang Gantungan Lengkung & Lonceng Perunggu Stasiun 1928 */}
          <mesh position={[0.92, 1.48, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.065, 1.85, 10]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0.62, 2.36, 0]}>
            <boxGeometry args={[0.68, 0.07, 0.07]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.35} />
          </mesh>
          <group ref={bellPivotRef} position={[0.36, 2.33, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <coneGeometry args={[0.19, 0.32, 14]} />
              <meshStandardMaterial color="#d97706" metalness={0.78} roughness={0.26} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial color="#fef08a" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          {/* Plakat Kuningan Sejarah 1928 Menghadap Barat */}
          <mesh position={[-1.27, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.25, 0.34]} />
            <meshStandardMaterial map={heritagePlaqueTex} roughness={0.45} />
          </mesh>
        </group>

        {/* Bangku Besi Tempa Barat (Menghadap Koridor Bunga Tabebuya: [75.8, 0, 35.5]) */}
        <group position={[-3.7, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 0.08, 0.56]} />
            <meshStandardMaterial map={textures.woodSlat} color="#784b2a" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.74, -0.24]} castShadow>
            <boxGeometry args={[2.1, 0.48, 0.07]} />
            <meshStandardMaterial map={textures.woodSlat} color="#784b2a" roughness={0.75} />
          </mesh>
          {[-0.85, 0.85].map((lx, li) => (
            <mesh key={`hbw-${li}`} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.52]} />
              <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Bangku Besi Tempa Timur (Spot Nonton Kereta KRL Lewat: [83.2, 0, 35.5]) */}
        <group position={[3.7, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 0.08, 0.56]} />
            <meshStandardMaterial map={textures.woodSlat} color="#784b2a" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.74, -0.24]} castShadow>
            <boxGeometry args={[2.1, 0.48, 0.07]} />
            <meshStandardMaterial map={textures.woodSlat} color="#784b2a" roughness={0.75} />
          </mesh>
          {[-0.85, 0.85].map((lx, li) => (
            <mesh key={`hbe-${li}`} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.52]} />
              <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* 2 Tiang Lampu Taman Kolonial Bola Kembar (Utara & Selatan Monumen) */}
        {[-4.2, 4.2].map((lz, li) => (
          <group key={`hlamp-${li}`} position={[0, 0, lz]}>
            <mesh position={[0, 1.55, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.1, 3.1, 8]} />
              <meshStandardMaterial color="#1f2937" metalness={0.65} roughness={0.38} />
            </mesh>
            <mesh position={[0, 3.05, 0]}>
              <boxGeometry args={[0.72, 0.06, 0.06]} />
              <meshStandardMaterial color="#1f2937" metalness={0.65} roughness={0.38} />
            </mesh>
            {[-0.32, 0.32].map((gx, gi) => (
              <mesh key={`hgl-${gi}`} position={[gx, 3.22, 0]}>
                <sphereGeometry args={[0.15, 10, 10]} />
                <meshStandardMaterial
                  color="#fef3c7"
                  emissive="#f59e0b"
                  emissiveIntensity={isEveningOrNight ? 2.6 : 0.15}
                />
              </mesh>
            ))}
          </group>
        ))}

        {isEveningOrNight && (
          <pointLight position={[0, 3.4, 0]} color="#ffca7a" intensity={15} distance={18} decay={1.7} />
        )}

        {/* 6 Burung Merpati Taman Mematuk & Mengepak di Sekeliling Plaza */}
        <group ref={pigeonsRef}>
          {[0, 1, 2, 3, 4, 5].map((pi) => (
            <group key={`hpig-${pi}`}>
              <mesh position={[0, 0.1, 0]} castShadow>
                <sphereGeometry args={[0.085, 8, 8]} />
                <meshStandardMaterial color={pi % 2 === 0 ? '#cbd5e1' : '#94a3b8'} roughness={0.75} />
              </mesh>
              <mesh position={[0, 0.16, 0.07]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#64748b" roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. FASAD LANTAI DASAR RUKO "GALERI BATIK & TENUN SENJA" ([46,0,16.3]) */}
      {/* ==================================================================== */}
      <group position={[46.0, 0, 16.25]}>
        {/* Kanopi Kayu Jati & Genteng Terakota Menghadap Utara */}
        <mesh position={[0, 3.35, -0.55]} rotation={[0.16, 0, 0]} castShadow>
          <boxGeometry args={[12.4, 0.16, 1.35]} />
          <meshStandardMaterial map={textures.roofTile} color="#7c2d12" roughness={0.78} />
        </mesh>
        {/* Papan Nama Bercahaya Galeri Batik */}
        <mesh position={[0, 3.92, -0.12]} castShadow>
          <boxGeometry args={[7.2, 0.92, 0.14]} />
          <meshStandardMaterial
            map={batikSignTex}
            emissiveMap={batikSignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.85 : 0.18}
            roughness={0.35}
          />
        </mesh>
        {/* Etalase Kaca Hangat Menampilkan 3 Kain Batik Tulis */}
        <mesh position={[0, 1.55, -0.08]}>
          <boxGeometry args={[8.6, 2.5, 0.12]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fde68a' : '#fef3c7'}
            emissive="#f59e0b"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.12}
            roughness={0.25}
          />
        </mesh>
        {[
          { x: -2.4, tex: batikTex1 },
          { x: 0, tex: batikTex2 },
          { x: 2.4, tex: batikTex3 },
        ].map((bt, bi) => (
          <mesh key={`btk-${bi}`} position={[bt.x, 1.58, -0.16]}>
            <planeGeometry args={[1.45, 1.95]} />
            <meshStandardMaterial map={bt.tex} roughness={0.65} />
          </mesh>
        ))}
        {/* 4 Pilar Kayu Ukir Pembingkai Ruko */}
        {[-5.6, -3.9, 3.9, 5.6].map((px, pi) => (
          <mesh key={`bpil-${pi}`} position={[px, 1.65, -0.18]} castShadow>
            <boxGeometry args={[0.28, 3.3, 0.28]} />
            <meshStandardMaterial color="#5c3317" roughness={0.72} />
          </mesh>
        ))}
      </group>

      {/* ==================================================================== */}
      {/* 3. FASAD "KANTOR POS & FILATELI SENJA" & BIS SURAT ([52.8, 0, 54.0])  */}
      {/* ==================================================================== */}
      <group position={[52.78, 0, 54.0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Kanopi Oranye Khas Pos Indonesia Menghadap Barat */}
        <mesh position={[0, 3.32, 0.55]} rotation={[-0.14, 0, 0]} castShadow>
          <boxGeometry args={[11.6, 0.16, 1.28]} />
          <meshStandardMaterial color="#ea580c" roughness={0.55} />
        </mesh>
        <mesh position={[0, 3.9, 0.12]} castShadow>
          <boxGeometry args={[6.8, 0.88, 0.14]} />
          <meshStandardMaterial
            map={posSignTex}
            emissiveMap={posSignTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.9 : 0.2}
            roughness={0.35}
          />
        </mesh>
        {/* Jendela Loket & Etalase Prangko Filateli */}
        {[-2.5, 2.5].map((wx, wi) => (
          <mesh key={`pwin-${wi}`} position={[wx, 1.62, 0.08]}>
            <boxGeometry args={[3.2, 1.95, 0.1]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fb923c"
              emissiveIntensity={isEveningOrNight ? 0.65 : 0.15}
              roughness={0.25}
            />
          </mesh>
        ))}
      </group>

      {/* Bis Surat Tabung Oranye Klasik di Depan Kantor Pos Selatan ([51.85, 0, 54.0]) */}
      <group position={[51.85, 0, 54.0]}>
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.28, 1.24, 14]} />
          <meshStandardMaterial color="#ea580c" roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh position={[0, 1.26, 0]} castShadow>
          <sphereGeometry args={[0.27, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#c2410c" roughness={0.45} />
        </mesh>
        <mesh position={[-0.25, 0.95, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.26]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    </group>
  );
};
