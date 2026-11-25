import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { GameSettings, TimeOfDay } from '../../types/game';
import { HumanModel } from './HumanModel';
import { getProceduralTextures } from './proceduralTextures';

interface AfternoonAndCreativeLifeProps {
  timeOfDay: TimeOfDay;
  settings: GameSettings;
}

const MANG_ASEP_PROFILE: CharacterProfile = {
  id: 'pak_slamet',
  name: 'Mang Asep',
  role: 'Penjual Siomay Bandung',
  accentColor: '#38bdf8',
  voice: { pitch: 0.96, rate: 1.0, preferGender: 'male', volumeScale: 1 },
  appearance: {
    height: 1.68,
    shirtColor: '#2563eb',
    pantsColor: '#27303f',
    skinColor: '#cfa07a',
    hairColor: '#1f1c19',
    accentProp: 'apron',
  },
};

function createSiomayBannerTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 176;
  const ctx = c.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 640, 176);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.5, '#1d4ed8');
  grad.addColorStop(1, '#1e40af');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 176);

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 624, 160);

  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(14, 122, 612, 40);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SIOMAY BANDUNG', 320, 54);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('MANG ASEP · ASLI IKAN TENGGIRI', 320, 96);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText('SIOMAY · BATAGOR · TAHU · KENTANG · JERUK LIMAU', 320, 142);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createCoffeeDeliveryBoxTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 320;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#3b2f26';
  ctx.fillRect(0, 0, 384, 320);

  // Bingkai krem hangat khas boks kurir kedai kopi artisanal
  ctx.fillStyle = '#f5e8d3';
  ctx.fillRect(18, 22, 348, 232);
  ctx.strokeStyle = '#b47b44';
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 28, 336, 220);

  // Ikon cangkir sederhana
  ctx.fillStyle = '#4a3120';
  ctx.fillRect(156, 62, 72, 44);
  ctx.strokeStyle = '#4a3120';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(232, 84, 13, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  ctx.fillStyle = '#2e1f16';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOPI SUDUT', 192, 144);

  ctx.fillStyle = '#9a5822';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ANTAR HANGAT · BIMA', 192, 182);

  ctx.fillStyle = '#475569';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('RACIKAN MANUAL · SEDUH SEGAR', 192, 218);

  // Strip reflektor keselamatan di bawah
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(18, 272, 348, 24);
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('HATI-HATI · BAWA KOPI PANAS', 192, 284);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createBikeRackSignTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#e6c28b';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 112);
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PARKIR SEPEDA', 128, 48);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('KOPI SUDUT BIMA', 128, 88);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createLicensePlateTexture(plate: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 96;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 6;
  ctx.strokeRect(5, 5, 246, 86);
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 38px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(plate, 128, 42);
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('08 · 28', 128, 74);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createWovenMatTexture(accentA: string, accentB: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f3e5c8';
  ctx.fillRect(0, 0, 256, 256);

  // Pola anyaman tikar plastik khas acara warga Indonesia
  for (let y = 0; y < 256; y += 16) {
    ctx.fillStyle = y % 32 === 0 ? accentA : accentB;
    ctx.globalAlpha = 0.34;
    ctx.fillRect(0, y, 256, 6);
  }
  for (let x = 0; x < 256; x += 24) {
    ctx.fillStyle = accentA;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(x, 0, 8, 256);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accentA;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 244, 244);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Menggambar bingkai animasi film proyektor warga RT 04 secara prosedural (~9 fps ala proyektor klasik 16mm).
 */
function drawProjectorFrame(
  ctx: CanvasRenderingContext2D,
  reel: 0 | 1 | 2 | 3,
  isActive: boolean,
  t: number,
) {
  const W = 512;
  const H = 288;

  if (!isActive || reel === 0) {
    // Kain layar putih lembut dalam mode siaga / siang hari
    ctx.fillStyle = '#ece6da';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120, 100, 80, 0.22)';
    ctx.lineWidth = 4;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.fillStyle = 'rgba(71, 85, 105, 0.62)';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LAYAR WARGA RT 04 · PERUMAHAN MELATI', W / 2, H / 2 - 14);
    ctx.font = '16px sans-serif';
    ctx.fillText('Nobar Malam Minggu · Tekan [E] di Proyektor untuk Memutar Film', W / 2, H / 2 + 20);
    return;
  }

  // Flicker halus proyektor film klasik
  const flicker = 0.96 + Math.sin(t * 23) * 0.03;

  if (reel === 1) {
    // REEL 1: Film Pendek Warga "Sore di Kota Senja" — siluet kereta melintasi jembatan, pesepeda & langit senja hangat
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#2e1d3b');
    sky.addColorStop(0.55, '#b85c38');
    sky.addColorStop(1, '#f4b860');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Matahari senja besar hangat
    ctx.fillStyle = `rgba(255, 232, 168, ${0.88 * flicker})`;
    ctx.beginPath();
    ctx.arc(365, 152, 46, 0, Math.PI * 2);
    ctx.fill();

    // Awan bergerak pelan
    ctx.fillStyle = 'rgba(255, 224, 180, 0.26)';
    for (let i = 0; i < 3; i++) {
      const cx = ((t * (14 + i * 5) + i * 190) % (W + 140)) - 70;
      ctx.beginPath();
      ctx.ellipse(cx, 62 + i * 24, 52, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Siluet jembatan & tiang kabel
    ctx.fillStyle = '#241824';
    ctx.fillRect(0, 206, W, 82);
    ctx.fillRect(92, 118, 12, 92);
    ctx.fillRect(280, 118, 12, 92);
    ctx.strokeStyle = '#241824';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(98, 124);
    ctx.quadraticCurveTo(186, 198, 286, 124);
    ctx.stroke();

    // Siluet Kereta Komuter Senja meluncur mulus melintasi jembatan
    const trainX = ((t * 58) % (W + 260)) - 220;
    ctx.fillStyle = '#1b111d';
    for (let c = 0; c < 3; c++) {
      const gx = trainX + c * 68;
      ctx.fillRect(gx, 180, 62, 24);
      ctx.fillStyle = '#ffe599';
      for (let w = 0; w < 4; w++) {
        ctx.fillRect(gx + 7 + w * 13, 186, 8, 8);
      }
      ctx.fillStyle = '#1b111d';
    }

    // Siluet pesepeda kecil di depan
    const bikeX = W - (((t * 28) % (W + 80)) - 40);
    ctx.strokeStyle = '#120a14';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bikeX - 10, 238, 8, 0, Math.PI * 2);
    ctx.arc(bikeX + 10, 238, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#120a14';
    ctx.beginPath();
    ctx.arc(bikeX, 218, 6, 0, Math.PI * 2);
    ctx.fill();

    // Subjudul film klasik di bawah
    ctx.fillStyle = 'rgba(20, 12, 20, 0.55)';
    ctx.fillRect(0, H - 36, W, 36);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('“Sore di Kota Senja” — Film Pendek Warga RT 04', W / 2, H - 18);
  } else if (reel === 2) {
    // REEL 2: Wayang Bayangan & Dongeng Malam — kelir kuning-emas hangat dengan siluet Gunungan & tokoh wayang
    const rad = ctx.createRadialGradient(W / 2, H * 0.48, 20, W / 2, H * 0.48, 280);
    rad.addColorStop(0, `rgba(255, 240, 186, ${flicker})`);
    rad.addColorStop(0.6, '#d98a36');
    rad.addColorStop(1, '#4a2511');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);

    // Gunungan berayun lembut di tengah layar kelir
    const sway = Math.sin(t * 1.6) * 0.12;
    ctx.save();
    ctx.translate(W / 2, 235);
    ctx.rotate(sway);
    ctx.fillStyle = '#231309';
    ctx.beginPath();
    ctx.moveTo(0, -158);
    ctx.quadraticCurveTo(68, -72, 54, 0);
    ctx.lineTo(-54, 0);
    ctx.quadraticCurveTo(-68, -72, 0, -158);
    ctx.fill();
    // Lubang ornamen bercahaya di tengah Gunungan
    ctx.fillStyle = '#ffdf8c';
    ctx.beginPath();
    ctx.arc(0, -76, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-4, -52, 8, 38);
    ctx.restore();

    // Dua siluet tokoh bayangan kiri & kanan berbincang lembut
    const talkL = Math.sin(t * 3.1) * 6;
    const talkR = Math.cos(t * 2.7) * 6;
    ctx.fillStyle = '#1f1007';
    // Kiri
    ctx.beginPath();
    ctx.ellipse(122, 212 + talkL * 0.3, 22, 42, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(128, 158 + talkL * 0.3, 16, 0, Math.PI * 2);
    ctx.fill();
    // Kanan
    ctx.beginPath();
    ctx.ellipse(390, 212 + talkR * 0.3, 22, 42, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(384, 158 + talkR * 0.3, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(30, 14, 6, 0.58)';
    ctx.fillRect(0, H - 36, W, 36);
    ctx.fillStyle = '#fde68a';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('“Wayang Bayangan & Dongeng Sebelum Tidur” — Spesial Anak Melati', W / 2, H - 18);
  } else {
    // REEL 3: Dokumentasi Kerja Bakti & 17-an RT 04 (Nuansa Sepia Hangat + Bendera Merah Putih)
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#543c2a');
    bg.addColorStop(1, '#c99c68');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Rangkaian bendera merah putih berkibar di atas
    for (let i = 0; i < 12; i++) {
      const fx = 22 + i * 42;
      const sag = Math.sin((i / 11) * Math.PI) * 28 + Math.sin(t * 3 + i) * 3;
      ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(fx, 28 + sag);
      ctx.lineTo(fx + 26, 28 + sag);
      ctx.lineTo(fx + 13, 56 + sag);
      ctx.closePath();
      ctx.fill();
    }

    // Siluet warga bergotong-royong & anak-anak berlari gembira
    ctx.fillStyle = '#2d1c11';
    ctx.fillRect(0, 214, W, 74);
    for (let p = 0; p < 5; p++) {
      const px = 85 + p * 84 + Math.sin(t * 2 + p) * 5;
      const hop = Math.abs(Math.sin(t * 3.8 + p * 1.2)) * 9;
      ctx.beginPath();
      ctx.arc(px, 168 - hop, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(px - 10, 180 - hop, 20, 36);
    }

    // Kartu judul vintage sepia
    ctx.fillStyle = 'rgba(35, 22, 14, 0.72)';
    ctx.fillRect(76, 86, W - 152, 54);
    ctx.strokeStyle = '#f5d08a';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, 90, W - 160, 46);
    ctx.fillStyle = '#fffbeb';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PERUMAHAN MELATI · GUYUB RUKUN', W / 2, 113);

    ctx.fillStyle = 'rgba(28, 16, 8, 0.58)';
    ctx.fillRect(0, H - 36, W, 36);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('“Arsip Kerja Bakti & 17-an RT 04” — Putar Ulang', W / 2, H - 18);
  }

  // Garis bingkai proyektor film & sedikit butiran debu retro
  ctx.strokeStyle = 'rgba(20, 14, 10, 0.65)';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, W - 10, H - 10);
}

const SiomaySteam: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < 4; i++) {
      const m = puffs.current[i];
      if (!m) continue;
      const p = (((t * 0.52 + i * 0.25) % 1) + 1) % 1;
      m.position.y = p * 0.72;
      m.position.x = Math.sin(t * 2.1 + i * 1.5) * 0.08 * p;
      m.position.z = Math.cos(t * 1.7 + i * 1.8) * 0.07 * p;
      const s = 0.48 + p * 1.3;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(p * Math.PI) * 0.36;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={`sm-${i}`}
          ref={(el) => {
            puffs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.075, 8, 8]} />
          <meshBasicMaterial color="#fffbf5" transparent opacity={0.26} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Sepeda kota parkir realistis di rak depan Kedai Kopi Bima.
 */
const ParkedCityBike: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  leanZ?: number;
  frameColor: string;
  withBasket?: boolean;
  isLit: boolean;
}> = ({ position, rotationY = 0, leanZ = 0.08, frameColor, withBasket = false, isLit }) => (
  <group position={position} rotation={[0, rotationY, leanZ]}>
    {/* Roda Depan & Belakang berjari-jari */}
    {[-0.5, 0.5].map((rz, wi) => (
      <group key={`bw-${wi}`} position={[0, 0.33, rz]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.31, 0.036, 8, 20]} />
          <meshStandardMaterial color="#1f232a" roughness={0.85} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.27, 0.014, 6, 18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        {[0, 1, 2, 3].map((s) => (
          <mesh key={`sp-${s}`} rotation={[(s * Math.PI) / 4, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.54, 5]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.3} />
          </mesh>
        ))}
      </group>
    ))}

    {/* Rangka Sepeda Tubular */}
    <mesh position={[0, 0.58, -0.15]} rotation={[-0.2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.022, 0.54, 8]} />
      <meshStandardMaterial color={frameColor} metalness={0.45} roughness={0.32} />
    </mesh>
    <mesh position={[0, 0.49, 0.14]} rotation={[0.88, 0, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.02, 0.62, 8]} />
      <meshStandardMaterial color={frameColor} metalness={0.45} roughness={0.32} />
    </mesh>
    <mesh position={[0, 0.66, 0.12]} rotation={[1.4, 0, 0]} castShadow>
      <cylinderGeometry args={[0.018, 0.018, 0.58, 8]} />
      <meshStandardMaterial color={frameColor} metalness={0.45} roughness={0.32} />
    </mesh>
    {/* Garpu Depan & Stang */}
    <mesh position={[0, 0.62, 0.45]} rotation={[-0.24, 0, 0]} castShadow>
      <cylinderGeometry args={[0.02, 0.02, 0.64, 8]} />
      <meshStandardMaterial color={frameColor} metalness={0.45} roughness={0.32} />
    </mesh>
    <mesh position={[0, 0.94, 0.36]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.014, 0.014, 0.52, 8]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.22} />
    </mesh>
    {/* Grip Kulit Cokelat */}
    {[-0.23, 0.23].map((gx, gi) => (
      <mesh key={`gr-${gi}`} position={[gx, 0.94, 0.36]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.11, 8]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.75} />
      </mesh>
    ))}
    {/* Sadel Kulit */}
    <mesh position={[0, 0.87, -0.22]} castShadow>
      <boxGeometry args={[0.14, 0.06, 0.26]} />
      <meshStandardMaterial color="#5c3a21" roughness={0.72} />
    </mesh>
    {/* Keranjang Rotan Depan + Koran Gulung (khusus sepeda vintage) */}
    {withBasket && (
      <group position={[0, 0.78, 0.56]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.22, 0.24]} />
          <meshStandardMaterial color="#b68752" roughness={0.88} />
        </mesh>
        <mesh position={[-0.04, 0.12, 0]} rotation={[0.2, 0.3, 0.25]}>
          <cylinderGeometry args={[0.032, 0.032, 0.24, 8]} />
          <meshStandardMaterial color="#f5efe6" roughness={0.85} />
        </mesh>
      </group>
    )}
    {/* Reflektor Merah Belakang */}
    <mesh position={[0, 0.55, -0.68]}>
      <boxGeometry args={[0.05, 0.06, 0.025]} />
      <meshStandardMaterial
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={isLit ? 1.8 : 0.25}
      />
    </mesh>
  </group>
);

/**
 * Opsi 3 — Kehidupan Sore & Sudut Kreatif:
 * 1. Gerobak Siomay Bandung Mang Asep di Tepi Taman Kota ([-79.0, 0, 12.6]) — panci kukus mengepul & kuliner [E]
 * 2. Layar Proyektor Warga Malam ("Nobar RT 04 Perumahan Melati", [16.2, 0, 62.2]) — 3 film siluet animasi real-time
 * 3. Rak Parkir Sepeda Kota ([-23.6, 0, 11.4]) & Motor Kurir Kopi "Kopi Sudut Express" ([-16.2, 0, 11.2]) depan Kedai Bima
 */
export const AfternoonAndCreativeLife: React.FC<AfternoonAndCreativeLifeProps> = ({
  timeOfDay,
  settings,
}) => {
  const textures = useMemo(() => getProceduralTextures(), []);
  const siomayBannerTex = useMemo(() => createSiomayBannerTexture(), []);
  const deliveryBoxTex = useMemo(() => createCoffeeDeliveryBoxTexture(), []);
  const bikeSignTex = useMemo(() => createBikeRackSignTexture(), []);
  const scooterPlateTex = useMemo(() => createLicensePlateTexture('B 4128 KOP'), []);
  const matTex1 = useMemo(() => createWovenMatTexture('#2563eb', '#f59e0b'), []);
  const matTex2 = useMemo(() => createWovenMatTexture('#dc2626', '#16a34a'), []);

  const melatiProjectorReel = useGameStore((s) => s.melatiProjectorReel);
  const melatiProjectorManualOn = useGameStore((s) => s.melatiProjectorManualOn);

  const isEveningOrNight = timeOfDay !== 'morning';
  const isDarkNight = timeOfDay === 'night' || timeOfDay === 'rain_dusk';
  const isProjectorLit =
    melatiProjectorReel > 0 && (isEveningOrNight || melatiProjectorManualOn);

  // Canvas & Texture animasi Layar Proyektor Warga RT 04
  const { screenCanvas, screenCtx, screenTex } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 288;
    const ctx = c.getContext('2d')!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    drawProjectorFrame(ctx, 0, false, 0);
    return { screenCanvas: c, screenCtx: ctx, screenTex: tex };
  }, []);

  useEffect(() => {
    return () => {
      screenTex.dispose();
    };
  }, [screenTex]);

  useEffect(() => {
    drawProjectorFrame(screenCtx, melatiProjectorReel, isProjectorLit, performance.now() / 1000);
    screenTex.needsUpdate = true;
  }, [screenCtx, screenTex, melatiProjectorReel, isProjectorLit, screenCanvas]);

  const asepHeadRef = useRef<THREE.Group>(null);
  const asepRightArmRef = useRef<THREE.Group>(null);
  const reelTopARef = useRef<THREE.Mesh>(null);
  const reelTopBRef = useRef<THREE.Mesh>(null);
  const lastDrawRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const [px, py, pz] = playerRuntime.position;

    // 1. Animasi ramah Mang Asep menyapa & memotong siomay hangat
    const distAsep = py > 4 ? 99 : Math.hypot(px - -79.0, pz - 12.6);
    if (asepHeadRef.current) {
      asepHeadRef.current.rotation.y = Math.sin(t * 0.9) * 0.25;
    }
    if (asepRightArmRef.current) {
      asepRightArmRef.current.rotation.x =
        distAsep < 6.5 ? -1.45 + Math.sin(t * 6.5) * 0.22 : -0.62 + Math.sin(t * 1.6) * 0.08;
      asepRightArmRef.current.rotation.z = distAsep < 6.5 ? 0.18 : 0;
    }

    // 2. Putaran rol film & pembaruan layar proyektor warga (~9 fps ala proyektor klasik)
    if (isProjectorLit) {
      if (reelTopARef.current) reelTopARef.current.rotation.z = -t * 2.4;
      if (reelTopBRef.current) reelTopBRef.current.rotation.z = -t * 2.4;

      const distScreen = py > 4 ? 99 : Math.hypot(px - 16.2, pz - 60.0);
      if (distScreen < 52 && t - lastDrawRef.current > 0.11) {
        lastDrawRef.current = t;
        drawProjectorFrame(screenCtx, melatiProjectorReel, true, t);
        screenTex.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* ==================================================================== */}
      {/* 1. GEROBAK SIOMAY BANDUNG MANG ASEP — TEPI TAMAN KOTA ([-79.0,0,12.6]) */}
      {/* ==================================================================== */}
      <group position={[-79.0, 0, 12.6]}>
        {/* Alas Batu Paving & Bayangan Lembut */}
        <mesh position={[0, 0.02, -0.55]} receiveShadow>
          <boxGeometry args={[2.9, 0.04, 3.2]} />
          <meshStandardMaterial map={textures.paving} roughness={0.88} />
        </mesh>

        {/* Badan Gerobak Kayu Biru-Krem Khas Siomay Bandung */}
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.95, 0.78, 0.96]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.62} />
        </mesh>
        {/* Lis Kayu Krem & Meja Racik Atas */}
        <mesh position={[0, 1.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.08, 0.08, 1.08]} />
          <meshStandardMaterial color="#f5ebd6" roughness={0.55} />
        </mesh>
        {/* Roda Kiri & Kanan Berjari-Jari + Standar Kaki Depan */}
        {[-0.98, 0.98].map((wx, wi) => (
          <group key={`sw-${wi}`} position={[wx, 0.34, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.31, 0.042, 8, 20]} />
              <meshStandardMaterial color="#1f232a" roughness={0.86} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.26, 0.015, 6, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.28} />
            </mesh>
            {[0, 1, 2].map((sp) => (
              <mesh key={`ssp-${sp}`} rotation={[(sp * Math.PI) / 3, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.52, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Etalase Kaca Display Siomay, Tahu, Kentang & Telur Rebus */}
        <group position={[-0.45, 1.38, -0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.88, 0.6, 0.78]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.28} roughness={0.12} metalness={0.15} />
          </mesh>
          {/* Bingkai Aluminium Etalase */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.92, 0.04, 0.82]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.28} />
          </mesh>
          {/* Tumpukan Siomay, Tahu Kuning & Kentang di Nampan Dalam */}
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.76, 0.04, 0.64]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.6} roughness={0.35} />
          </mesh>
          {[
            [-0.22, -0.14, -0.14, '#efe4cc'],
            [-0.08, -0.14, -0.12, '#e8d7b7'],
            [0.08, -0.14, -0.15, '#e5b84b'],
            [0.22, -0.14, -0.1, '#d97706'],
            [-0.18, -0.14, 0.12, '#86b868'],
            [0.02, -0.14, 0.14, '#efe4cc'],
            [0.2, -0.14, 0.12, '#fef08a'],
          ].map(([ix, iy, iz, col], ii) => (
            <mesh key={`si-${ii}`} position={[ix as number, iy as number, iz as number]}>
              <sphereGeometry args={[0.068, 8, 8]} />
              <meshStandardMaterial color={col as string} roughness={0.75} />
            </mesh>
          ))}
        </group>

        {/* Panci Kukus Aluminium Besar (Dandang Siomay) + Uap Panas Mengepul */}
        <group position={[0.48, 1.34, 0.04]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.31, 0.29, 0.54, 18]} />
            <meshStandardMaterial color="#d4dce6" metalness={0.85} roughness={0.22} />
          </mesh>
          {/* Tutup Kerucut Aluminium Sedikit Miring Melepas Uap */}
          <mesh position={[0.03, 0.33, -0.02]} rotation={[0.08, 0, -0.12]} castShadow>
            <coneGeometry args={[0.33, 0.16, 18]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0.05, 0.42, -0.02]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#1f2937" roughness={0.7} />
          </mesh>
          <SiomaySteam position={[0.04, 0.38, -0.04]} />
        </group>

        {/* Toples Bumbu Kacang, Botol Kecap Manis & Saus Sambal */}
        <mesh position={[0.04, 1.2, -0.34]} castShadow>
          <cylinderGeometry args={[0.09, 0.085, 0.24, 12]} />
          <meshStandardMaterial color="#9a4e21" roughness={0.45} />
        </mesh>
        <mesh position={[0.2, 1.18, -0.36]}>
          <cylinderGeometry args={[0.038, 0.042, 0.22, 10]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
        <mesh position={[0.3, 1.18, -0.36]}>
          <cylinderGeometry args={[0.038, 0.042, 0.22, 10]} />
          <meshStandardMaterial color="#2b1b12" roughness={0.32} />
        </mesh>

        {/* Tiang & Atap Kanopi Biru-Kuning + Spanduk "SIOMAY BANDUNG MANG ASEP" */}
        {[
          [-0.94, 1.56, -0.46],
          [0.94, 1.56, -0.46],
          [-0.94, 1.56, 0.46],
          [0.94, 1.56, 0.46],
        ].map(([px, py, pz], pi) => (
          <mesh key={`sp-${pi}`} position={[px, py, pz]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 1.05, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.32} />
          </mesh>
        ))}
        {/* Atap Tenda Biru-Kuning Lebar Penahan Hujan & Matahari */}
        <mesh position={[0, 2.16, -0.05]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[2.55, 0.09, 1.75]} />
          <meshStandardMaterial color="#1e40af" roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.11, -0.92]}>
          <boxGeometry args={[2.55, 0.12, 0.04]} />
          <meshStandardMaterial color="#facc15" roughness={0.75} />
        </mesh>

        {/* Spanduk Depan Gerobak Menghadap Utara (-Z) */}
        <mesh position={[0, 0.62, -0.5]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.82, 0.56]} />
          <meshStandardMaterial
            map={siomayBannerTex}
            emissiveMap={siomayBannerTex}
            emissive="#ffffff"
            emissiveIntensity={isEveningOrNight ? 0.55 : 0.08}
          />
        </mesh>

        {/* Bohlam Hangat Gantung Gerobak */}
        <mesh position={[0, 1.98, -0.18]}>
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshStandardMaterial
            color={isEveningOrNight ? '#fff3c4' : '#e2e8f0'}
            emissive={isEveningOrNight ? '#ffbe55' : '#000000'}
            emissiveIntensity={isEveningOrNight ? 2.6 : 0}
          />
        </mesh>
        {isEveningOrNight && (
          <>
            <pointLight position={[0, 1.92, -0.45]} color="#ffcb78" intensity={10} distance={11} decay={1.8} />
            {settings.cinematicGlow && (
              <sprite position={[0, 1.98, -0.18]} scale={[1.45, 1.45, 1]}>
                <spriteMaterial
                  map={textures.glowSprite}
                  color="#ffd27a"
                  transparent
                  opacity={0.7}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </sprite>
            )}
          </>
        )}

        {/* Bangku Kayu Pengunjung di Depan Gerobak (z = -1.65 -> world z = 10.95) */}
        <group position={[0, 0, -1.65]}>
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.55, 0.09, 0.44]} />
            <meshStandardMaterial map={textures.woodFloor} color="#9e7147" roughness={0.78} />
          </mesh>
          {[-0.64, 0.64].map((lx, li) => (
            <mesh key={`sbl-${li}`} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.1, 0.44, 0.36]} />
              <meshStandardMaterial color="#5c3d24" roughness={0.85} />
            </mesh>
          ))}
        </group>

        {/* Mang Asep Berdiri Ramah di Belakang Gerobak (Menghadap Utara -Z) */}
        <group position={[0, 0, 1.15]} rotation={[0, Math.PI, 0]}>
          <HumanModel
            profile={MANG_ASEP_PROFILE}
            headRef={asepHeadRef}
            rightArmRef={asepRightArmRef}
          />
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 2. LAYAR PROYEKTOR WARGA MALAM — NOBAR RT 04 MELATI ([16.2, 0, 62.2]) */}
      {/* ==================================================================== */}
      <group position={[16.2, 0, 62.2]}>
        {/* Rangka Tiang Bambu / Kayu Kokoh Layar Tancap */}
        {[-1.92, 1.92].map((px, pi) => (
          <group key={`lp-${pi}`} position={[px, 0, 0]}>
            <mesh position={[0, 1.52, 0]} castShadow>
              <cylinderGeometry args={[0.068, 0.082, 3.04, 10]} />
              <meshStandardMaterial color="#6e5032" roughness={0.85} />
            </mesh>
            {/* Penopang Kaki Segitiga di Tanah */}
            <mesh position={[0, 0.35, 0.38]} rotation={[-0.7, 0, 0]} castShadow>
              <cylinderGeometry args={[0.036, 0.042, 0.92, 8]} />
              <meshStandardMaterial color="#594028" roughness={0.88} />
            </mesh>
          </group>
        ))}
        {/* Palang Atas & Bawah Bingkai Layar */}
        <mesh position={[0, 2.86, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.048, 0.048, 4.15, 8]} />
          <meshStandardMaterial color="#6e5032" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.68, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.042, 0.042, 3.92, 8]} />
          <meshStandardMaterial color="#6e5032" roughness={0.85} />
        </mesh>

        {/* Rangkaian Bendera Hias Merah-Putih-Kuning di Atas Layar */}
        {[-1.55, -1.16, -0.78, -0.39, 0, 0.39, 0.78, 1.16, 1.55].map((bx, bi) => (
          <mesh key={`bn-${bi}`} position={[bx, 2.94, -0.06]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.11, 0.22, 3]} />
            <meshStandardMaterial
              color={bi % 3 === 0 ? '#dc2626' : bi % 3 === 1 ? '#f8fafc' : '#facc15'}
              roughness={0.8}
            />
          </mesh>
        ))}

        {/* Kain Layar Proyeksi + Permukaan Film Beranimasi Real-Time Menghadap Utara (-Z) */}
        <mesh position={[0, 1.77, 0.04]} castShadow>
          <boxGeometry args={[3.68, 2.12, 0.05]} />
          <meshStandardMaterial color="#2b2623" roughness={0.88} />
        </mesh>
        <mesh position={[0, 1.77, -0.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.52, 1.98]} />
          <meshStandardMaterial
            map={screenTex}
            emissiveMap={screenTex}
            emissive="#fff6e0"
            emissiveIntensity={isProjectorLit ? (isDarkNight ? 1.25 : 0.85) : 0.04}
            roughness={0.82}
          />
        </mesh>

        {/* Cahaya Pantul Hangat dari Layar ke Tikar Penonton */}
        {isProjectorLit && (
          <pointLight
            position={[0, 1.85, -1.15]}
            color={melatiProjectorReel === 2 ? '#ffca6b' : '#ffe0a8'}
            intensity={isDarkNight ? 13 : 6.5}
            distance={12}
            decay={1.8}
          />
        )}

        {/* 2 Tikar Anyaman Warna-Warni + Bantal Duduk & Nampan Pisang Goreng / Kerupuk */}
        <mesh position={[-1.15, 0.025, -2.05]} rotation={[-Math.PI / 2, 0, 0.04]} receiveShadow>
          <planeGeometry args={[2.0, 1.65]} />
          <meshStandardMaterial map={matTex1} roughness={0.92} />
        </mesh>
        <mesh position={[1.15, 0.025, -2.05]} rotation={[-Math.PI / 2, 0, -0.03]} receiveShadow>
          <planeGeometry args={[2.0, 1.65]} />
          <meshStandardMaterial map={matTex2} roughness={0.92} />
        </mesh>
        {/* Bantal Lesehan & Camilan Nobar */}
        {[
          [-1.55, 0.09, -1.9, '#f59e0b'],
          [-0.78, 0.09, -2.25, '#38bdf8'],
          [0.95, 0.09, -2.18, '#fb7185'],
          [1.62, 0.09, -1.85, '#34d399'],
        ].map(([cx, cy, cz, col], ci) => (
          <mesh key={`cu-${ci}`} position={[cx as number, cy as number, cz as number]} castShadow>
            <boxGeometry args={[0.42, 0.12, 0.42]} />
            <meshStandardMaterial color={col as string} roughness={0.9} />
          </mesh>
        ))}
        {/* Nampan Gorengan & Termos Teh Manis di Tikar */}
        <group position={[0.1, 0.05, -2.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.24, 0.22, 0.035, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.65} roughness={0.3} />
          </mesh>
          {[-0.08, 0, 0.09].map((gx, gi) => (
            <mesh key={`fg-${gi}`} position={[gx, 0.05, (gi - 1) * 0.04]} rotation={[0.2, gi, 0.4]}>
              <capsuleGeometry args={[0.032, 0.07, 4, 6]} />
              <meshStandardMaterial color="#c97a2b" roughness={0.78} />
            </mesh>
          ))}
          <mesh position={[0.38, 0.14, 0.05]} castShadow>
            <cylinderGeometry args={[0.072, 0.078, 0.28, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.45} />
          </mesh>
        </group>

        {/* Meja Bangku Kecil & Proyektor Film Klasik (world [16.2, 0, 58.35]) */}
        <group position={[0, 0, -3.85]}>
          {/* Bangku Penopang Kayu */}
          <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.07, 0.56]} />
            <meshStandardMaterial color="#6e4b30" roughness={0.78} />
          </mesh>
          {[
            [-0.24, 0.34, -0.2],
            [0.24, 0.34, -0.2],
            [-0.24, 0.34, 0.2],
            [0.24, 0.34, 0.2],
          ].map(([lx, ly, lz], li) => (
            <mesh key={`pl-${li}`} position={[lx, ly, lz]} castShadow>
              <cylinderGeometry args={[0.028, 0.032, 0.68, 8]} />
              <meshStandardMaterial color="#4a311e" roughness={0.82} />
            </mesh>
          ))}

          {/* Bodi Proyektor Klasik + Lensa & 2 Rol Film Berputar */}
          <mesh position={[0, 0.86, 0]} castShadow>
            <boxGeometry args={[0.34, 0.26, 0.4]} />
            <meshStandardMaterial color="#27313d" metalness={0.55} roughness={0.42} />
          </mesh>
          {/* Lensa Proyektor Menghadap Layar (+Z) */}
          <mesh position={[0, 0.87, 0.24]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.068, 0.14, 14]} />
            <meshStandardMaterial color="#111827" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.87, 0.312]}>
            <circleGeometry args={[0.048, 12]} />
            <meshStandardMaterial
              color={isProjectorLit ? '#fff9db' : '#475569'}
              emissive={isProjectorLit ? '#ffd880' : '#000000'}
              emissiveIntensity={isProjectorLit ? 3.2 : 0}
            />
          </mesh>
          {/* 2 Rol Film Berputar di Atas Proyektor */}
          <mesh ref={reelTopARef} position={[-0.12, 1.08, -0.06]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.095, 0.022, 8, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.72} roughness={0.32} />
          </mesh>
          <mesh ref={reelTopBRef} position={[0.12, 1.06, 0.08]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.082, 0.02, 8, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.72} roughness={0.32} />
          </mesh>

          {/* Berkas Cahaya Volumetrik Kerucut Proyektor Menuju Layar */}
          {isProjectorLit && (
            <mesh position={[0, 1.32, 2.04]} rotation={[-Math.PI / 2 + 0.23, 0, 0]}>
              <coneGeometry args={[1.38, 3.65, 20, 1, true]} />
              <meshBasicMaterial
                color={melatiProjectorReel === 2 ? '#ffe094' : '#fff2cf'}
                transparent
                opacity={isDarkNight ? 0.11 : 0.05}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>

        {/* Bangku Panjang Kayu Penonton di Belakang Proyektor (world [16.2, 0, 56.7]) */}
        <group position={[0, 0, -5.5]}>
          <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.65, 0.1, 0.52]} />
            <meshStandardMaterial map={textures.woodFloor} color="#8c623d" roughness={0.78} />
          </mesh>
          <mesh position={[0, 0.82, -0.24]} castShadow>
            <boxGeometry args={[2.65, 0.26, 0.08]} />
            <meshStandardMaterial color="#755030" roughness={0.8} />
          </mesh>
          {[-1.12, 0, 1.12].map((blx, bli) => (
            <mesh key={`nbl-${bli}`} position={[blx, 0.23, 0]} castShadow>
              <boxGeometry args={[0.12, 0.46, 0.44]} />
              <meshStandardMaterial color="#4a311e" roughness={0.84} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================== */}
      {/* 3A. RAK PARKIR SEPEDA KOTA DEPAN KEDAI KOPI BIMA ([-23.6, 0, 11.4])  */}
      {/* ==================================================================== */}
      <group position={[-23.6, 0, 11.4]}>
        {/* Rel Dasar Besi Tertanam di Paving */}
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.68, 0.06, 0.52]} />
          <meshStandardMaterial color="#334155" metalness={0.68} roughness={0.38} />
        </mesh>
        {/* 3 Lengkung U-Rack Baja Parkir Sepeda */}
        {[-0.92, 0, 0.92].map((rx, ri) => (
          <group key={`rack-${ri}`} position={[rx, 0, 0]}>
            <mesh position={[0, 0.36, -0.22]} castShadow>
              <cylinderGeometry args={[0.026, 0.026, 0.68, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.72} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.36, 0.22]} castShadow>
              <cylinderGeometry args={[0.026, 0.026, 0.68, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.72} roughness={0.34} />
            </mesh>
            <mesh position={[0, 0.7, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <torusGeometry args={[0.22, 0.026, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#1e293b" metalness={0.72} roughness={0.34} />
            </mesh>
          </group>
        ))}

        {/* Plang Mungil "PARKIR SEPEDA · KOPI SUDUT BIMA" di Sisi Kiri */}
        <group position={[-1.25, 0, -0.2]}>
          <mesh position={[0, 0.52, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.024, 1.04, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.02, 0]} castShadow>
            <boxGeometry args={[0.56, 0.3, 0.04]} />
            <meshStandardMaterial color="#1f2937" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.02, -0.024]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.52, 0.26]} />
            <meshStandardMaterial map={bikeSignTex} roughness={0.5} />
          </mesh>
        </group>

        {/* Sepeda 1: Sepeda Kota Vintage Krem Berkeranjang Rotan */}
        <ParkedCityBike
          position={[-0.74, 0.02, 0.06]}
          rotationY={0.14}
          leanZ={0.07}
          frameColor="#e8d8be"
          withBasket
          isLit={isEveningOrNight}
        />
        {/* Sepeda 2: Sepeda Komuter Terakota-Merah Bata */}
        <ParkedCityBike
          position={[0.18, 0.02, -0.04]}
          rotationY={-0.18}
          leanZ={-0.06}
          frameColor="#b84a39"
          withBasket={false}
          isLit={isEveningOrNight}
        />
      </group>

      {/* ==================================================================== */}
      {/* 3B. MOTOR KURIR KOPI "KOPI SUDUT EXPRESS" ([-16.2, 0, 11.2])         */}
      {/* ==================================================================== */}
      <group position={[-16.2, 0.02, 11.2]} rotation={[0, -0.35, 0]}>
        {/* Bayangan Kolong Motor */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.92, 1.88]} />
          <meshBasicMaterial color="#090b10" transparent opacity={0.4} depthWrite={false} />
        </mesh>

        {/* Bodi Miring Halus Bertumpu Standar Samping */}
        <group rotation={[0, 0, 0.09]}>
          {/* Standar Samping Logam */}
          <mesh position={[-0.18, 0.16, -0.12]} rotation={[0, 0, 0.45]}>
            <cylinderGeometry args={[0.016, 0.014, 0.34, 6]} />
            <meshStandardMaterial color="#1f2937" metalness={0.75} roughness={0.35} />
          </mesh>

          {/* Roda Depan & Belakang Matic */}
          {[-0.56, 0.58].map((wz, wi) => (
            <group key={`mw-${wi}`} position={[0, 0.27, wz]}>
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                <torusGeometry args={[0.22, 0.075, 10, 18]} />
                <meshStandardMaterial color="#181b20" roughness={0.86} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.16, 0.16, 0.09, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.28} />
              </mesh>
            </group>
          ))}

          {/* Dek Kaki & Sayap Bodi Hijau Zaitun Espresso + Krem */}
          <mesh position={[0, 0.34, 0.02]} castShadow>
            <boxGeometry args={[0.42, 0.14, 0.92]} />
            <meshStandardMaterial color="#1f2937" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.56, -0.38]} castShadow>
            <boxGeometry args={[0.48, 0.34, 0.78]} />
            <meshStandardMaterial color="#3f5946" metalness={0.35} roughness={0.36} />
          </mesh>
          <mesh position={[0, 0.64, 0.52]} rotation={[-0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.44, 0.58, 0.24]} />
            <meshStandardMaterial color="#efe3cc" metalness={0.25} roughness={0.38} />
          </mesh>
          {/* Jok Kulit Cokelat Tua */}
          <mesh position={[0, 0.76, -0.22]} castShadow>
            <boxGeometry args={[0.38, 0.12, 0.66]} />
            <meshStandardMaterial color="#3b2618" roughness={0.75} />
          </mesh>
          {/* Setang, Lampu Depan Retro & Spion Krom */}
          <mesh position={[0, 0.96, 0.42]} castShadow>
            <boxGeometry args={[0.56, 0.1, 0.16]} />
            <meshStandardMaterial color="#3f5946" metalness={0.35} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.96, 0.52]}>
            <sphereGeometry args={[0.075, 10, 10]} />
            <meshStandardMaterial
              color="#fff9db"
              emissive="#ffe29a"
              emissiveIntensity={isEveningOrNight ? 0.5 : 0.08}
            />
          </mesh>
          {[-0.26, 0.26].map((mx, mi) => (
            <group key={`mir-${mi}`} position={[mx, 1.08, 0.42]}>
              <mesh position={[0, -0.04, 0]} rotation={[0, 0, mi === 0 ? 0.2 : -0.2]}>
                <cylinderGeometry args={[0.01, 0.01, 0.16, 6]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[mi === 0 ? -0.03 : 0.03, 0.05, 0]}>
                <sphereGeometry args={[0.05, 10, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          ))}

          {/* Helm Kurir Kopi Half-Face Krem-Zaitun Menggantung di Spion Kiri */}
          <group position={[-0.31, 1.05, 0.44]} rotation={[0.25, 0.4, -0.35]}>
            <mesh castShadow>
              <sphereGeometry args={[0.135, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.68]} />
              <meshStandardMaterial color="#e8d8be" roughness={0.35} metalness={0.15} />
            </mesh>
            <mesh position={[0, -0.02, 0.12]}>
              <boxGeometry args={[0.18, 0.06, 0.04]} />
              <meshStandardMaterial color="#1e293b" transparent opacity={0.78} roughness={0.18} />
            </mesh>
          </group>

          {/* Plat Nomor Depan & Belakang "B 4128 KOP" */}
          <mesh position={[0, 0.54, 0.66]}>
            <planeGeometry args={[0.24, 0.09]} />
            <meshStandardMaterial map={scooterPlateTex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.46, -0.78]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.24, 0.09]} />
            <meshStandardMaterial map={scooterPlateTex} roughness={0.5} />
          </mesh>

          {/* Lampu Reflektor Belakang */}
          <mesh position={[0, 0.64, -0.78]}>
            <boxGeometry args={[0.16, 0.08, 0.03]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#ef4444"
              emissiveIntensity={isEveningOrNight ? 1.5 : 0.25}
            />
          </mesh>

          {/* Boks Termal Kurir Kopi Besar di Rak Belakang ("KOPI SUDUT · ANTAR HANGAT") */}
          <group position={[0, 1.06, -0.62]}>
            {/* Rak Besi Penopang Boks */}
            <mesh position={[0, -0.27, 0.04]} castShadow>
              <boxGeometry args={[0.48, 0.05, 0.48]} />
              <meshStandardMaterial color="#1f2937" metalness={0.65} roughness={0.4} />
            </mesh>
            {/* Boks Termal Kain Tebal Berbingkai Rapi */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.46, 0.46]} />
              <meshStandardMaterial color="#3b2f26" roughness={0.78} />
            </mesh>
            {/* Tutup Atas Ritsleting */}
            <mesh position={[0, 0.235, 0]} castShadow>
              <boxGeometry args={[0.5, 0.05, 0.48]} />
              <meshStandardMaterial color="#2a2019" roughness={0.75} />
            </mesh>
            {/* Logo Boks Kiri, Kanan & Belakang */}
            <mesh position={[-0.244, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[0.42, 0.36]} />
              <meshStandardMaterial map={deliveryBoxTex} roughness={0.6} />
            </mesh>
            <mesh position={[0.244, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.42, 0.36]} />
              <meshStandardMaterial map={deliveryBoxTex} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, -0.234]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[0.44, 0.36]} />
              <meshStandardMaterial
                map={deliveryBoxTex}
                emissiveMap={deliveryBoxTex}
                emissive="#ffdf9e"
                emissiveIntensity={isEveningOrNight ? 0.22 : 0}
                roughness={0.6}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
