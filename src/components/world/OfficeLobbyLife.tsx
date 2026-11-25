import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameSettings, TimeOfDay } from '../../types/game';
import { getProceduralTextures } from './proceduralTextures';

interface OfficeLobbyLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const LOBBY_BOARD_META: Record<
  TimeOfDay,
  { time: string; temp: string; weather: string; traffic: string; accent: string; note: string }
> = {
  morning: {
    time: '08:24 WIB',
    temp: '26°C',
    weather: 'PAGI CERAH BERAWAN',
    traffic: 'JL. KENANGAN: RAMAI LANCAR · KRL STASIUN SENJA: ON TIME',
    accent: '#38bdf8',
    note: 'Selamat bekerja — jangan lupa jeda sejenak menikmati kopi pagi.',
  },
  sunset: {
    time: '17:18 WIB',
    temp: '28°C',
    weather: 'SENJA KEEMASAN',
    traffic: 'PROMENADE SUNGAI: LAMPION MENYALA · TAMAN DANAU: SEJUK',
    accent: '#fbbf24',
    note: 'Jam pulang kerja tiba — rumah di Jl. Melati No. 14 menunggumu.',
  },
  rain_dusk: {
    time: '17:54 WIB',
    temp: '23°C',
    weather: 'SORE BERHUJAN MERATA',
    traffic: 'SEDIAKAN PAYUNG [U] · HALTE JL. KENANGAN TEDUH DI SEBERANG',
    accent: '#7dd3fc',
    note: 'Hati-hati jalanan licin — hangatkan diri dulu dengan secangkir teh.',
  },
  night: {
    time: '20:42 WIB',
    temp: '22°C',
    weather: 'MALAM TENANG BERBINTANG',
    traffic: 'ROOFTOP SKY DECK TERBUKA · MARTABAK TEPI SUNGAI BUKA',
    accent: '#c4b5fd',
    note: 'Kota mulai tenang — terima kasih telah berjuang hari ini, Damar.',
  },
};

function createLobbyInfoDisplayTexture(timeOfDay: TimeOfDay): THREE.CanvasTexture {
  const meta = LOBBY_BOARD_META[timeOfDay];
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 288;
  const ctx = c.getContext('2d')!;

  // Latar layar kaca gelap modern Menara Nusantara
  const grad = ctx.createLinearGradient(0, 0, 768, 288);
  grad.addColorStop(0, '#0d1626');
  grad.addColorStop(1, '#16243d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 768, 288);

  // Garis aksen atas
  ctx.fillStyle = meta.accent;
  ctx.fillRect(0, 0, 768, 8);

  // Header
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('MENARA NUSANTARA · PAPAN INFO KOTA & CUACA DIGITAL', 28, 44);

  // Jam & Suhu Besar
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText(meta.temp, 28, 122);

  ctx.fillStyle = meta.accent;
  ctx.font = 'bold 28px monospace';
  ctx.fillText(meta.time, 178, 98);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 22px sans-serif';
  ctx.fillText(meta.weather, 178, 130);

  // Garis pemisah
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.fillRect(28, 158, 712, 2);

  // Status Lalu Lintas & Landmark Kota
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(meta.traffic, 28, 196);

  // Pesan Kesejahteraan Hangat
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText(meta.note, 28, 244);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

const PantrySteam: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 3; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = ((t * 0.55 + i * 0.33) % 1 + 1) % 1;
      m.position.y = p * 0.36;
      m.position.x = Math.sin(t * 2.1 + i * 1.9) * 0.035 * p;
      const s = 0.45 + p * 0.9;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.28;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={`pst-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.045, 7, 7]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Kehidupan Lobi Kantor Menara Nusantara:
 * 1. Sudut Pantry Mesin Kopi & Cokelat Hangat Lobi ([37.8, 0.08, -24.85])
 * 2. Layar Informasi Cuaca & Berita Kota Digital Real-Time ([23.5, 2.55, -25.62])
 * 3. Sudut Duduk Jendela Lobi Menghadap Jl. Kenangan ([31.2, 0.08, -20.2]) + Tanaman Indoor
 */
export const OfficeLobbyLife: React.FC<OfficeLobbyLifeProps> = ({ timeOfDay, settings }) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const infoTextures = useMemo(
    () => ({
      morning: createLobbyInfoDisplayTexture('morning'),
      sunset: createLobbyInfoDisplayTexture('sunset'),
      rain_dusk: createLobbyInfoDisplayTexture('rain_dusk'),
      night: createLobbyInfoDisplayTexture('night'),
    }),
    [],
  );

  const activeDisplayTex = infoTextures[timeOfDay];
  const isEveningOrNight = timeOfDay !== 'morning';

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. LAYAR INFORMASI CUACA & KOTA DIGITAL ([23.5, 2.55, -25.62])       */}
      {/* ==================================================================== */}
      <group position={[23.5, 2.55, -25.62]}>
        {/* Bingkai Aluminium Tipis */}
        <mesh castShadow>
          <boxGeometry args={[4.45, 1.72, 0.12]} />
          <meshStandardMaterial color="#181f2c" metalness={0.65} roughness={0.32} />
        </mesh>
        {/* Layar LED Bercahaya Tajam */}
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[4.28, 1.56]} />
          <meshStandardMaterial
            map={activeDisplayTex}
            emissiveMap={activeDisplayTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 1.1 : 0.65}
            roughness={0.2}
          />
        </mesh>
        {settings.cinematicGlow && (
          <pointLight position={[0, 0, 0.85]} color="#b8dcff" intensity={isEveningOrNight ? 8 : 3.5} distance={10} decay={1.8} />
        )}
      </group>

      {/* ==================================================================== */}
      {/* 2. SUDUT PANTRY & MESIN KOPI LOBI ([37.8, 0.08, -24.85])             */}
      {/* ==================================================================== */}
      <group position={[37.8, 0.08, -24.85]}>
        {/* Kabinet Pantry Modern Kayu Gelap & Marmer Putih */}
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.88, 0.82]} />
          <meshStandardMaterial color="#363c47" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.07, 0.9]} />
          <meshStandardMaterial color="#eef2f6" roughness={0.25} metalness={0.1} />
        </mesh>

        {/* Mesin Kopi Espresso Otomatis Stainless + Layar LED */}
        <group position={[-0.42, 1.24, -0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.58, 0.64, 0.5]} />
            <meshStandardMaterial color="#272c35" metalness={0.65} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.14, 0.258]}>
            <planeGeometry args={[0.36, 0.18]} />
            <meshStandardMaterial color="#a8e4ff" emissive="#38bdf8" emissiveIntensity={1.6} />
          </mesh>
          {/* Cangkir di Bawah Nozzle + Kepulan Uap */}
          <mesh position={[0, -0.2, 0.22]}>
            <cylinderGeometry args={[0.05, 0.04, 0.11, 10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} />
          </mesh>
          <PantrySteam position={[0, -0.1, 0.22]} />
        </group>

        {/* Dispenser Air Panas/Dingin + Tumpukan Gelas Kertas & Kotak Teh */}
        <group position={[0.45, 1.18, -0.06]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.5, 0.36]} />
            <meshStandardMaterial color="#dce4ed" metalness={0.35} roughness={0.32} />
          </mesh>
          {/* Galon Air Transparan di Atas Dispenser */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.15, 0.4, 14]} />
            <meshPhysicalMaterial color="#bfe5ff" transparent opacity={0.58} roughness={0.12} clearcoat={0.9} />
          </mesh>
        </group>
        {/* Tumpukan Gelas Kertas & Organizer Gula */}
        <mesh position={[0.02, 1.04, 0.16]} castShadow>
          <cylinderGeometry args={[0.055, 0.048, 0.22, 12]} />
          <meshStandardMaterial color="#f5efe6" roughness={0.5} />
        </mesh>
        <mesh position={[0.16, 1.0, 0.16]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.14]} />
          <meshStandardMaterial color="#7a5436" roughness={0.68} />
        </mesh>
      </group>

      {/* ==================================================================== */}
      {/* 3. SUDUT DUDUK JENDELA LOBI MENGHADAP JL. KENANGAN ([31.2, 0.08, -20.2]) */}
      {/* ==================================================================== */}
      <group position={[31.2, 0.08, -20.2]}>
        {/* Rangka Bangku Kayu Modern + Bantalan Kulit Abu-Abu Hangat */}
        <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.45, 0.12, 0.68]} />
          <meshStandardMaterial map={textures.woodFloor} roughness={0.52} />
        </mesh>
        <mesh position={[0, 0.47, 0]} castShadow>
          <boxGeometry args={[2.32, 0.08, 0.6]} />
          <meshStandardMaterial color="#3c4654" roughness={0.82} />
        </mesh>
        {/* Kaki Baja Hitam Minimalis */}
        {[-1.08, 1.08].map((lx, li) => (
          <mesh key={`lleg-${li}`} position={[lx, 0.19, 0]} castShadow>
            <boxGeometry args={[0.08, 0.38, 0.56]} />
            <meshStandardMaterial color="#1f242c" metalness={0.65} roughness={0.35} />
          </mesh>
        ))}
        {/* Meja Samping Marmer Mungil + Majalah Arsitektur */}
        <group position={[1.62, 0, 0.02]}>
          <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.05, 16]} />
            <meshStandardMaterial color="#eef2f6" roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <cylinderGeometry args={[0.04, 0.14, 0.48, 10]} />
            <meshStandardMaterial color="#2a303b" metalness={0.65} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.52, 0]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.24, 0.025, 0.32]} />
            <meshStandardMaterial color="#d4954a" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 4. DUA TANAMAN HIAS INDOOR & LAMPU PLAFON HANGAT LOBI                */}
      {/* ==================================================================== */}
      {(
        [
          [39.45, 0.08, -24.6],
          [18.65, 0.08, -20.1],
        ] as [number, number, number][]
      ).map(([px, py, pz], idx) => (
        <group key={`lplant-${idx}`} position={[px, py, pz]}>
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.2, 0.56, 12]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.78, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.055, 0.7, 8]} />
            <meshStandardMaterial color="#59402e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.28, 0]} castShadow>
            <dodecahedronGeometry args={[0.45, 1]} />
            <meshStandardMaterial color="#3c7348" roughness={0.8} />
          </mesh>
          <mesh position={[0.16, 1.56, 0.08]}>
            <dodecahedronGeometry args={[0.28, 1]} />
            <meshStandardMaterial color="#4e8755" roughness={0.78} />
          </mesh>
        </group>
      ))}

      {/* Lampu Downlight Lobi Hangat saat Senja & Malam */}
      {isEveningOrNight && (
        <pointLight position={[31.5, 4.4, -22.2]} color="#ffe2b8" intensity={14} distance={22} decay={1.7} />
      )}
    </group>
  );
};
