import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTrafficSignalState } from '../../store/playerRuntime';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface CityDetailsProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
  pierLampFixed?: boolean;
}

/**
 * Generator tekstur papan nama / mural / gambar krayon HD via HTML5 Canvas.
 */
function createSignTexture(
  title: string,
  subtitle: string,
  bg: string,
  border: string,
  textColor: string,
  accent: string,
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 160);
  ctx.strokeStyle = border;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 144);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 46px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 66);

  if (subtitle) {
    ctx.fillStyle = accent;
    ctx.font = '600 22px sans-serif';
    ctx.fillText(subtitle, 256, 118);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createKiraDrawingTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fcf8ee';
  ctx.fillRect(0, 0, 256, 256);

  // Matahari kuning krayon
  ctx.fillStyle = '#f5c242';
  ctx.beginPath();
  ctx.arc(200, 52, 28, 0, Math.PI * 2);
  ctx.fill();

  // Danau biru di bawah
  ctx.fillStyle = '#6db2d9';
  ctx.fillRect(0, 175, 256, 81);

  // Rumah kecil
  ctx.fillStyle = '#d97a66';
  ctx.fillRect(26, 110, 62, 58);
  ctx.fillStyle = '#9c4536';
  ctx.beginPath();
  ctx.moveTo(18, 112);
  ctx.lineTo(57, 74);
  ctx.lineTo(96, 112);
  ctx.closePath();
  ctx.fill();

  // Tiga figur krayon (Ayah, Kira, Bunda)
  ctx.strokeStyle = '#2d3540';
  ctx.lineWidth = 4;
  [125, 162, 196].forEach((x, idx) => {
    const h = idx === 1 ? 142 : 124;
    ctx.beginPath();
    ctx.arc(x, h - 12, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, h - 2);
    ctx.lineTo(x, 168);
    ctx.stroke();
  });

  // Tulisan kecil "AYAH + KIRA + BUNDA"
  ctx.fillStyle = '#4a433d';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AYAH · KIRA · BUNDA', 128, 224);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGraffitiTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#47413d';
  ctx.fillRect(0, 0, 512, 256);

  // Tekstur bata latar
  ctx.fillStyle = 'rgba(25, 18, 14, 0.25)';
  for (let y = 0; y < 256; y += 22) {
    ctx.fillRect(0, y, 512, 2);
  }

  ctx.fillStyle = '#f2e8d8';
  ctx.font = 'italic 30px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('"Kapan terakhir kali kamu', 256, 95);
  ctx.fillStyle = '#f5bf6b';
  ctx.font = 'bold italic 32px Georgia, serif';
  ctx.fillText('merasa hatimu benar-benar hidup?"', 256, 152);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Koordinat Pohon Palem Tropis (Atmosfer Kota Modern Indonesia / GTA 6 Sunset!)
const PALM_POSITIONS: [number, number, number, number][] = [
  [-34, 0, -9.5, 1.1],
  [-15, 0, -9.5, 1.05],
  [14, 0, -9.5, 1.15],
  [36, 0, -9.5, 1.08],
  [-34, 0, 9.5, 1.12],
  [-14, 0, 9.5, 1.0],
  [14, 0, 9.5, 1.14],
  [36, 0, 9.5, 1.06],
  [-60, 0, -10, 1.2],
  [-60, 0, 10, 1.18],
  [-60, 0, 26, 1.15],
  [-60, 0, -28, 1.22],
  [58, 0, -18, 1.1],
  [58, 0, 16, 1.1],
];

// Semak & Bunga Bougainvillea Tepi Jalan & Perumahan
const BUSH_POSITIONS: [number, number, number, string][] = [
  [-26, 0.35, 53.3, '#c94c72'],
  [-14, 0.35, 53.3, '#d96b43'],
  [-22.5, 0.35, 61.2, '#4a7a48'],
  [-17.5, 0.35, 61.2, '#4a7a48'],
  [12, 0.35, 63.5, '#c94c72'],
  [26.5, 0.35, 63.5, '#e09648'],
  [-27.5, 0.35, 13.5, '#4c7c4a'],
  [-12.5, 0.35, 13.5, '#d46a4a'],
  [16.5, 0.35, -18.5, '#467346'],
  [41.5, 0.35, -18.5, '#467346'],
  [-67, 0.35, -24, '#c95c78'],
  [-67, 0.35, -31, '#e09e48'],
];

const PalmTree: React.FC<{ position: [number, number, number]; scale: number; phase: number }> = ({
  position,
  scale,
  phase,
}) => {
  const crownRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!crownRef.current) return;
    const t = clock.getElapsedTime();
    crownRef.current.rotation.z = Math.sin(t * 1.1 + phase) * 0.06;
    crownRef.current.rotation.x = Math.cos(t * 0.9 + phase) * 0.04;
  });

  return (
    <group position={position} scale={scale}>
      {/* Batang Palem Melengkung Halus */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0.04]} castShadow>
        <cylinderGeometry args={[0.17, 0.24, 2.7, 8]} />
        <meshStandardMaterial color="#735b46" roughness={0.92} />
      </mesh>
      <mesh position={[0.14, 3.8, 0]} rotation={[0, 0, 0.08]} castShadow>
        <cylinderGeometry args={[0.12, 0.17, 2.6, 8]} />
        <meshStandardMaterial color="#7c634d" roughness={0.92} />
      </mesh>
      {/* Pelepah Daun Palem 6 Arah */}
      <group ref={crownRef} position={[0.26, 5.05, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const ang = (i / 6) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, ang, 0]}>
              <mesh position={[1.15, 0.12, 0]} rotation={[0, 0, -0.35]} castShadow>
                <boxGeometry args={[2.3, 0.08, 0.52]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#3f7344' : '#4f854e'} roughness={0.8} />
              </mesh>
              <mesh position={[2.2, -0.45, 0]} rotation={[0, 0, -0.82]} castShadow>
                <boxGeometry args={[1.1, 0.07, 0.36]} />
                <meshStandardMaterial color="#36633b" roughness={0.82} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

export const CityDetails: React.FC<CityDetailsProps> = ({ timeOfDay, settings, pierLampFixed = false }) => {
  const isEveningOrNight = timeOfDay !== 'morning';
  const isRain = timeOfDay === 'rain_dusk';
  const textures = useMemo(() => getProceduralTextures(), []);

  const signs = useMemo(
    () => ({
      cafe: createSignTexture('KOPI SUDUT', 'BIMA BREW · SEJAK 2019', '#2b1d16', '#e6a85c', '#fff3db', '#e7b87d'),
      kios: createSignTexture('HARMONI 24 JAM', 'MINIMARKET & MINUMAN HANGAT', '#1d6658', '#f0a24a', '#ffffff', '#ffdf9e'),
      music: createSignTexture('NADA LAMA', 'GITAR · KASET · BARANG ANTIK', '#4a2620', '#d99a59', '#fdebd0', '#e8b97c'),
      office: createSignTexture('MENARA NUSANTARA', 'PERKANTORAN & SKY DECK', '#1f2b3a', '#9eb3c9', '#eef4fa', '#a9c0d9'),
      station: createSignTexture('STASIUN SENJA', 'JALUR KOMUTER KOTA', '#1f3654', '#e8be6b', '#ffffff', '#f5d48e'),
      house: createSignTexture('JL. MELATI NO. 14', 'KEL. DAMAR PRATAMA', '#3b2b22', '#d9b584', '#fff5e4', '#d9b584'),
      angkringan: createSignTexture('ANGKRINGAN PAK SLAMET', 'WEDANG JAHE · SEGO KUCING', '#6e281d', '#f5c258', '#fff5de', '#ffd88a'),
      kira: createKiraDrawingTexture(),
      graffiti: createGraffitiTexture(),
    }),
    [],
  );

  // Lampu Lalu Lintas Persimpangan Utama sinkron 100% dengan AI mobil (Hijau -> Kuning -> Merah)
  const nsMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const ewMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  useFrame(({ clock }) => {
    const sig = getTrafficSignalState(clock.getElapsedTime());
    const colorOf = (s: 'green' | 'yellow' | 'red') =>
      s === 'green' ? '#3ae882' : s === 'yellow' ? '#ffd24c' : '#ff4740';

    const nsCol = colorOf(sig.ns);
    const ewCol = colorOf(sig.ew);
    nsMatRefs.current.forEach((m) => {
      if (m) {
        m.color.set(nsCol);
        m.emissive.set(nsCol);
      }
    });
    ewMatRefs.current.forEach((m) => {
      if (m) {
        m.color.set(ewCol);
        m.emissive.set(ewCol);
      }
    });
  });

  const showRichDetails = settings.graphicsQuality !== 'low';

  return (
    <group>
      {/* === 1. CINCIN PERBUKITAN & CAKRAWALA KOTA JAUH (ANTI TEPI DUNIA KOSONG!) === */}
      <group position={[0, -0.5, 0]}>
        {Array.from({ length: 24 }).map((_, i) => {
          const ang = (i / 24) * Math.PI * 2;
          const dist = 152;
          const h = 16 + ((i * 19) % 24);
          const w = 26 + ((i * 11) % 16);
          const isCitySide = Math.sin(ang) < 0.25;
          return (
            <mesh
              key={`hor-${i}`}
              position={[Math.cos(ang) * dist, h / 2 - 2, Math.sin(ang) * dist]}
              rotation={[0, -ang + Math.PI / 2, 0]}
            >
              {isCitySide ? (
                <boxGeometry args={[w, h * 1.35, 14]} />
              ) : (
                <coneGeometry args={[w * 0.9, h * 1.25, 5]} />
              )}
              <meshStandardMaterial
                color={
                  timeOfDay === 'sunset'
                    ? '#4d3a4f'
                    : timeOfDay === 'night'
                      ? '#111a2e'
                      : timeOfDay === 'rain_dusk'
                        ? '#2b3648'
                        : '#6c8599'
                }
                roughness={0.95}
              />
            </mesh>
          );
        })}
      </group>

      {/* === 2. PAPAN NAMA 3D TAJAM DI SETIAP LANDMARK === */}
      {/* Kedai Kopi Bima */}
      <mesh position={[-20, 5.1, 13.14]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[7.0, 1.05]} />
        <meshStandardMaterial
          map={signs.cafe}
          emissiveMap={signs.cafe}
          emissive="#ffffff"
          emissiveIntensity={isEveningOrNight ? 0.95 : 0.15}
        />
      </mesh>
      {/* Kios Harmoni */}
      <mesh position={[24.5, 4.45, 17.3]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6.4, 0.96]} />
        <meshStandardMaterial
          map={signs.kios}
          emissiveMap={signs.kios}
          emissive="#ffffff"
          emissiveIntensity={isEveningOrNight ? 0.9 : 0.15}
        />
      </mesh>
      {/* Toko Musik Nada Lama */}
      <mesh position={[-22, 4.45, -19.36]}>
        <planeGeometry args={[6.4, 1.1]} />
        <meshStandardMaterial
          map={signs.music}
          emissiveMap={signs.music}
          emissive="#ffffff"
          emissiveIntensity={isEveningOrNight ? 0.85 : 0.15}
        />
      </mesh>
      {/* Poster Konser Akustik di Dalam Dinding Toko Musik Nada Lama */}
      <mesh position={[-15.0, 2.35, -27.2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.6, 1.1]} />
        <meshStandardMaterial
          map={signs.music}
          emissiveMap={signs.music}
          emissive="#ffdfa8"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Menara Nusantara */}
      <mesh position={[29, 5.2, -19.0]}>
        <planeGeometry args={[8.5, 1.35]} />
        <meshStandardMaterial
          map={signs.office}
          emissiveMap={signs.office}
          emissive="#ffffff"
          emissiveIntensity={isEveningOrNight ? 0.75 : 0.1}
        />
      </mesh>
      {/* Stasiun Senja */}
      <mesh position={[75.6, 3.8, -12.15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4.6, 0.85]} />
        <meshStandardMaterial
          map={signs.station}
          emissiveMap={signs.station}
          emissive="#ffffff"
          emissiveIntensity={isEveningOrNight ? 0.85 : 0.12}
        />
      </mesh>
      {/* Plakat Alamat Rumah Damar */}
      <mesh position={[-22.8, 0.88, 53.84]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.6, 0.48]} />
        <meshStandardMaterial map={signs.house} roughness={0.5} />
      </mesh>
      {/* Gambar Krayon Kira di Pintu Kulkas */}
      <mesh position={[-14.5, 1.45, 71.88]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial map={signs.kira} roughness={0.8} />
      </mesh>
      {/* Gambar Krayon Kira di Meja Gambar Sudut Kira */}
      <mesh position={[-19.98, 0.665, 72.32]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <planeGeometry args={[0.48, 0.36]} />
        <meshStandardMaterial map={signs.kira} roughness={0.82} />
      </mesh>
      {/* Mural Grafiti di Gang Belakang Nada Lama */}
      <mesh position={[-31.18, 1.85, -25]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[4.2, 2.1]} />
        <meshStandardMaterial
          map={signs.graffiti}
          emissiveMap={signs.graffiti}
          emissive="#ffd699"
          emissiveIntensity={isEveningOrNight ? 0.35 : 0.05}
        />
      </mesh>

      {/* === 3. POHON PALEM TROPIS & SEMAK BUNGA (ATMOSFER MODERN INDONESIA) === */}
      {showRichDetails &&
        PALM_POSITIONS.map(([x, y, z, s], idx) => (
          <PalmTree key={`palm-${idx}`} position={[x, y, z]} scale={s} phase={idx * 0.7} />
        ))}

      {showRichDetails &&
        BUSH_POSITIONS.map(([x, y, z, flowerCol], idx) => (
          <group key={`bush-${idx}`} position={[x, y, z]}>
            <mesh castShadow>
              <dodecahedronGeometry args={[0.58, 1]} />
              <meshStandardMaterial color="#3c6b3f" roughness={0.88} />
            </mesh>
            <mesh position={[0.25, 0.18, 0.15]}>
              <dodecahedronGeometry args={[0.28, 0]} />
              <meshStandardMaterial color={flowerCol} roughness={0.75} />
            </mesh>
          </group>
        ))}

      {/* === 4. LAMPU LALU LINTAS PERSIMPANGAN UTAMA === */}
      {showRichDetails && (
        <group>
          {[
            { pos: [6.8, 0, 6.8] as [number, number, number], rot: 0, isNS: true },
            { pos: [-6.8, 0, -6.8] as [number, number, number], rot: Math.PI, isNS: true },
            { pos: [-6.8, 0, 6.8] as [number, number, number], rot: Math.PI / 2, isNS: false },
            { pos: [6.8, 0, -6.8] as [number, number, number], rot: -Math.PI / 2, isNS: false },
          ].map((tl, idx) => (
            <group key={`tl-${idx}`} position={tl.pos} rotation={[0, tl.rot, 0]}>
              <mesh position={[0, 2.5, 0]} castShadow>
                <cylinderGeometry args={[0.09, 0.12, 5.0, 8]} />
                <meshStandardMaterial color="#2a3038" metalness={0.6} roughness={0.4} />
              </mesh>
              <mesh position={[0, 4.6, 0.25]}>
                <boxGeometry args={[0.42, 1.05, 0.35]} />
                <meshStandardMaterial color="#1a1e24" roughness={0.5} />
              </mesh>
              <mesh position={[0, 4.6, 0.44]}>
                <sphereGeometry args={[0.14, 10, 10]} />
                <meshStandardMaterial
                  ref={(el) => {
                    if (tl.isNS) nsMatRefs.current[idx] = el;
                    else ewMatRefs.current[idx] = el;
                  }}
                  color={tl.isNS ? '#3ae882' : '#ff4740'}
                  emissive={tl.isNS ? '#3ae882' : '#ff4740'}
                  emissiveIntensity={3.0}
                />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* === 5. BERKAS CAHAYA MATAHARI VOLUMETRIK (MORNING & SUNSET GODRAYS) === */}
      {settings.cinematicGlow && (timeOfDay === 'sunset' || timeOfDay === 'morning') && (
        <group>
          {[
            [-32, 11, -6],
            [-8, 12, 12],
            [18, 13, -14],
            [-68, 10, -24],
          ].map(([gx, gy, gz], idx) => (
            <mesh
              key={`ray-${idx}`}
              position={[gx, gy, gz]}
              rotation={[0.15, timeOfDay === 'sunset' ? 0.55 : -0.45, timeOfDay === 'sunset' ? -0.58 : 0.48]}
            >
              <coneGeometry args={[7.5, 34, 12, 1, true]} />
              <meshBasicMaterial
                color={timeOfDay === 'sunset' ? '#ffaa61' : '#fff0c4'}
                transparent
                opacity={timeOfDay === 'sunset' ? 0.055 : 0.04}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* === 6. GENANGAN AIR REFLEKTIF DI ASPAL SAAT HUJAN (BAB 2) === */}
      {isRain && settings.waterReflections && (
        <group>
          {[
            [-26, 0.05, 2.2, 3.6, 2.0],
            [-12, 0.05, -2.5, 4.2, 2.2],
            [14, 0.05, 1.8, 3.8, 2.1],
            [26, 0.05, -14, 4.5, 2.5],
            [-20, 0.05, 11.5, 3.4, 2.0],
            [-48, 0.29, -2.0, 4.6, 2.4],
          ].map(([px, py, pz, sx, sz], idx) => (
            <mesh key={`pud-${idx}`} position={[px, py, pz]} rotation={[-Math.PI / 2, 0, idx * 0.4]}>
              <circleGeometry args={[sx * 0.5, 18]} />
              <meshStandardMaterial
                color="#4d627d"
                roughness={0.04}
                metalness={0.88}
                transparent
                opacity={0.72}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* === 7. LAMPU HIAS GANG PERUMAHAN MELATI === */}
      {showRichDetails &&
        [-28, -20, -12, -4, 4, 12, 20, 28].map((lx, idx) => (
          <group key={`ml-${idx}`} position={[lx, 4.4 - Math.abs((idx % 2) - 0.5) * 0.25, 51.8]}>
            <mesh>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color="#ffe5a3"
                emissive="#ffb852"
                emissiveIntensity={isEveningOrNight ? 2.6 : 0.1}
              />
            </mesh>
            {isEveningOrNight && settings.cinematicGlow && (
              <sprite scale={[1.6, 1.6, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffc86e"
                  transparent
                  opacity={0.55}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </group>
        ))}

      {/* === 8. GEROBAK ANGKRINGAN KHAS INDONESIA — PAK SLAMET (SUDUT JL. MELATI) === */}
      <group position={[-15.2, 0, 39.8]}>
        {/* Roda Gerobak Kiri & Kanan */}
        <mesh position={[-0.95, 0.42, 0.56]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
          <meshStandardMaterial color="#23252a" roughness={0.85} />
        </mesh>
        <mesh position={[0.95, 0.42, 0.56]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
          <meshStandardMaterial color="#23252a" roughness={0.85} />
        </mesh>
        <mesh position={[-0.95, 0.42, -0.56]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
          <meshStandardMaterial color="#23252a" roughness={0.85} />
        </mesh>
        <mesh position={[0.95, 0.42, -0.56]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
          <meshStandardMaterial color="#23252a" roughness={0.85} />
        </mesh>

        {/* Badan Kayu Gerobak & Meja Etalase */}
        <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.35, 0.88, 1.12]} />
          <meshStandardMaterial color="#6e472b" roughness={0.86} />
        </mesh>
        <mesh position={[0, 1.34, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.46, 0.08, 1.24]} />
          <meshStandardMaterial color="#875a38" roughness={0.78} />
        </mesh>

        {/* Tiang Penopang Atap & Kanopi Terpal Hangat */}
        {[
          [-1.12, 1.92, -0.52],
          [1.12, 1.92, -0.52],
          [-1.12, 1.92, 0.52],
          [1.12, 1.92, 0.52],
        ].map(([tx, ty, tz], idx) => (
          <mesh key={`ang-p-${idx}`} position={[tx, ty, tz]} castShadow>
            <boxGeometry args={[0.08, 1.18, 0.08]} />
            <meshStandardMaterial color="#593822" roughness={0.88} />
          </mesh>
        ))}
        <mesh position={[0, 2.58, 0]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[2.75, 0.1, 1.65]} />
          <meshStandardMaterial color="#8f3224" roughness={0.84} />
        </mesh>

        {/* Kain Spanduk Angkringan Pak Slamet di Depan Atap */}
        <mesh position={[0, 2.28, 0.62]}>
          <planeGeometry args={[2.35, 0.54]} />
          <meshStandardMaterial
            map={signs.angkringan}
            emissiveMap={signs.angkringan}
            emissive="#ffdf9e"
            emissiveIntensity={isEveningOrNight ? 0.68 : 0.1}
          />
        </mesh>
        <mesh position={[0, 2.28, -0.62]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.35, 0.54]} />
          <meshStandardMaterial
            map={signs.angkringan}
            emissiveMap={signs.angkringan}
            emissive="#ffdf9e"
            emissiveIntensity={isEveningOrNight ? 0.68 : 0.1}
          />
        </mesh>

        {/* Teko Wedang Jahe, Angin Bara & Toples Sate */}
        <mesh position={[-0.65, 1.54, 0.08]} castShadow>
          <cylinderGeometry args={[0.16, 0.19, 0.34, 12]} />
          <meshStandardMaterial color="#a8adb5" metalness={0.7} roughness={0.32} />
        </mesh>
        <mesh position={[0.15, 1.5, 0.12]} castShadow>
          <boxGeometry args={[0.62, 0.24, 0.42]} />
          <meshStandardMaterial color="#e6dbc8" roughness={0.5} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.78, 1.48, 0.05]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.24, 10]} />
          <meshStandardMaterial color="#d4a259" roughness={0.4} />
        </mesh>

        {/* Bohlam Kuning Hangat Menggantung di Tengah Gerobak */}
        <mesh position={[0, 2.26, 0]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial
            color="#fff0c2"
            emissive="#ffb647"
            emissiveIntensity={isEveningOrNight ? 3.2 : 0.5}
          />
        </mesh>
        {isEveningOrNight && settings.cinematicGlow && (
          <sprite position={[0, 2.24, 0]} scale={[2.6, 2.6, 1]}>
            <spriteMaterial
              map={textures.glowSprite}
              color="#ffc366"
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
        {isEveningOrNight && (
          <pointLight position={[0, 2.15, 0.45]} color="#ffbe63" intensity={12} distance={15} decay={1.8} />
        )}

        {/* Bangku Kayu Panjang Angkringan di Belakang */}
        <mesh position={[0, 0.46, -1.42]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.1, 0.48]} />
          <meshStandardMaterial color="#6e4a2e" roughness={0.88} />
        </mesh>
        <mesh position={[-0.85, 0.23, -1.42]} castShadow>
          <boxGeometry args={[0.12, 0.46, 0.42]} />
          <meshStandardMaterial color="#4f331e" roughness={0.9} />
        </mesh>
        <mesh position={[0.85, 0.23, -1.42]} castShadow>
          <boxGeometry args={[0.12, 0.46, 0.42]} />
          <meshStandardMaterial color="#4f331e" roughness={0.9} />
        </mesh>
      </group>

      {/* === 9. LAMPU DERMAGA DANAU SENJA (MENYALA HANGAT SETELAH MISI PAK BUDI!) === */}
      <group>
        {(
          [
            [-70.5, 0.12, -26.2],
            [-73.8, 0.12, -26.2],
            [-76.8, 0.12, -26.2],
            [-70.5, 0.12, -29.8],
            [-76.8, 0.12, -29.8],
          ] as [number, number, number][]
        ).map(([px, py, pz], idx) => {
          const lit = pierLampFixed || (isEveningOrNight && idx === 0);
          return (
            <group key={`pier-lamp-${idx}`} position={[px, py, pz]}>
              <mesh position={[0, 0.72, 0]} castShadow>
                <cylinderGeometry args={[0.055, 0.07, 1.44, 8]} />
                <meshStandardMaterial color="#473324" roughness={0.9} />
              </mesh>
              <mesh position={[0, 1.52, 0]}>
                <boxGeometry args={[0.2, 0.26, 0.2]} />
                <meshStandardMaterial
                  color={lit ? '#ffefbd' : '#737c87'}
                  emissive={lit ? '#ffae42' : '#000000'}
                  emissiveIntensity={lit ? 2.8 : 0}
                  roughness={0.35}
                />
              </mesh>
              {lit && settings.cinematicGlow && (
                <sprite position={[0, 1.52, 0]} scale={[2.4, 2.4, 1]}>
                  <spriteMaterial
                    map={textures.glowSprite}
                    color="#ffc56b"
                    transparent
                    opacity={0.72}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </sprite>
              )}
            </group>
          );
        })}
        {pierLampFixed && (
          <pointLight position={[-73.8, 2.4, -28.0]} color="#ffbe6b" intensity={18} distance={22} decay={1.6} />
        )}
      </group>
    </group>
  );
};
