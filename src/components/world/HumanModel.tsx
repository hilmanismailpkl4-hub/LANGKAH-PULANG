import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { HeldDrinkVisual } from '../../data/culinaryMenu';
import { playerRuntime } from '../../store/playerRuntime';

/**
 * Kepulan uap asap tipis yang naik perlahan dari gelas wedang, kopi, atau teh hangat.
 */
const CupSteam: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 0.12, 0] }) => {
  const puffsRef = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    if (playerRuntime.perf.isPotato) return;
    if (playerRuntime.perf.isLowPerf && (playerRuntime.perf.frameIndex & 1) === 1) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < 3; i++) {
      const m = puffsRef.current[i];
      if (!m) continue;
      const phase = ((t * 0.65 + i * 0.33) % 1 + 1) % 1;
      m.position.y = phase * 0.24;
      m.position.x = Math.sin(t * 2.2 + i * 2.1) * 0.028 * phase;
      const s = 0.55 + phase * 1.1;
      m.scale.set(s, s, s);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(phase * Math.PI) * 0.36;
    }
  });
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh
          key={`st-${i}`}
          ref={(el) => {
            puffsRef.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshBasicMaterial color="#fff9f0" transparent opacity={0.25} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

interface HumanModelProps {
  profile: CharacterProfile;
  leftLegRef?: React.RefObject<THREE.Group>;
  rightLegRef?: React.RefObject<THREE.Group>;
  leftArmRef?: React.RefObject<THREE.Group>;
  rightArmRef?: React.RefObject<THREE.Group>;
  headRef?: React.RefObject<THREE.Group>;
  torsoRef?: React.RefObject<THREE.Group>;
  isChild?: boolean;
  isFemale?: boolean;
  holdingUmbrella?: boolean;
  holdingDrink?: HeldDrinkVisual | null;
}

/**
 * Model manusia 3D stylized semi-realistis dengan kepala, bahu, torso, lengan, dan kaki
 * terartikulasi penuh untuk kontak mata, napas alami, melambai, payung hujan, minuman hangat, dan gestur berbicara.
 */
export const HumanModel: React.FC<HumanModelProps> = ({
  profile,
  leftLegRef,
  rightLegRef,
  leftArmRef,
  rightArmRef,
  headRef,
  torsoRef,
  isChild = false,
  isFemale = false,
  holdingUmbrella = false,
  holdingDrink = null,
}) => {
  const { shirtColor, pantsColor, skinColor, hairColor, accentProp } = profile.appearance;
  const scale = profile.appearance.height / 1.74;

  return (
    <group scale={scale}>
      {/* Bayangan kontak lembut di tanah */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#0b0d12" transparent opacity={0.34} depthWrite={false} />
      </mesh>

      {/* Kaki Kiri */}
      <group ref={leftLegRef} position={[-0.12, 0.82, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.082, 0.56, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.74, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.11, 0.27]} />
          <meshStandardMaterial color="#231f1d" roughness={0.62} />
        </mesh>
      </group>

      {/* Kaki Kanan */}
      <group ref={rightLegRef} position={[0.12, 0.82, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.082, 0.56, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.86} />
        </mesh>
        <mesh position={[0, -0.74, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.11, 0.27]} />
          <meshStandardMaterial color="#231f1d" roughness={0.62} />
        </mesh>
      </group>

      {/* Pinggul & Sabuk */}
      <mesh position={[0, 0.86, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.2, 0.14, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <cylinderGeometry args={[0.196, 0.196, 0.045, 12]} />
        <meshStandardMaterial color="#2e231c" roughness={0.55} />
      </mesh>

      {/* Grup Tubuh Atas (Napas, Condong Jalan, Lengan & Kepala Terartikulasi) */}
      <group ref={torsoRef} position={[0, 0.92, 0]}>
        {/* Torso / Kemeja / Gaun */}
        <mesh position={[0, 0.26, 0]} castShadow>
          <capsuleGeometry args={[isFemale ? 0.18 : 0.205, 0.34, 8, 14]} />
          <meshStandardMaterial color={shirtColor} roughness={0.78} />
        </mesh>
        {/* Kerah Baju */}
        <mesh position={[0, 0.52, 0.02]}>
          <torusGeometry args={[0.095, 0.028, 8, 16]} />
          <meshStandardMaterial color="#efeae1" roughness={0.8} />
        </mesh>

        {/* Aksesori Karakter */}
        {accentProp === 'backpack' && (
          <group position={[0, 0.26, -0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.42, 0.14]} />
              <meshStandardMaterial color="#3c332c" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.08, -0.075]}>
              <boxGeometry args={[0.24, 0.16, 0.03]} />
              <meshStandardMaterial color="#59493b" roughness={0.7} />
            </mesh>
          </group>
        )}
        {accentProp === 'apron' && (
          <mesh position={[0, 0.12, 0.18]} castShadow>
            <boxGeometry args={[0.32, 0.56, 0.05]} />
            <meshStandardMaterial color="#4a3629" roughness={0.85} />
          </mesh>
        )}
        {accentProp === 'tie' && (
          <mesh position={[0, 0.32, 0.205]}>
            <boxGeometry args={[0.06, 0.32, 0.03]} />
            <meshStandardMaterial color="#263854" roughness={0.5} />
          </mesh>
        )}
        {accentProp === 'cardigan' && (
          <group>
            <mesh position={[-0.14, 0.22, 0.14]}>
              <boxGeometry args={[0.1, 0.48, 0.08]} />
              <meshStandardMaterial color="#b36d5d" roughness={0.88} />
            </mesh>
            <mesh position={[0.14, 0.22, 0.14]}>
              <boxGeometry args={[0.1, 0.48, 0.08]} />
              <meshStandardMaterial color="#b36d5d" roughness={0.88} />
            </mesh>
          </group>
        )}
        {accentProp === 'vest' && (
          <mesh position={[0, 0.26, 0.01]}>
            <cylinderGeometry args={[0.215, 0.215, 0.42, 12]} />
            <meshStandardMaterial color="#3d4b4f" roughness={0.82} />
          </mesh>
        )}
        {accentProp === 'scarf' && (
          <mesh position={[0, 0.51, 0.02]}>
            <torusGeometry args={[0.13, 0.05, 8, 16]} />
            <meshStandardMaterial color="#b99cc7" roughness={0.9} />
          </mesh>
        )}

        {/* Lengan Kiri (pivot dari bahu — juga memegang Payung Hujan Bening saat hujan!) */}
        <group ref={leftArmRef} position={[-0.27, 0.46, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <capsuleGeometry args={[0.062, 0.24, 6, 10]} />
            <meshStandardMaterial color={shirtColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.18, 6, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>

          {/* Payung Hujan Bening Realistis (terbuka otomatis di luar ruangan saat hujan / tombol [U]) */}
          {holdingUmbrella && (
            <group position={[0.04, -0.48, 0.04]} rotation={[1.28, 0, 0.06]}>
              {/* Gagang J & Batang Logam Payung */}
              <mesh position={[0, -0.05, -0.04]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.045, 0.014, 8, 12, Math.PI]} />
                <meshStandardMaterial color="#e8eef5" roughness={0.35} />
              </mesh>
              <mesh position={[0, 0.42, 0]} castShadow>
                <cylinderGeometry args={[0.011, 0.012, 0.94, 8]} />
                <meshStandardMaterial color="#cfd7e3" metalness={0.75} roughness={0.28} />
              </mesh>
              {/* Ujung Atas Payung */}
              <mesh position={[0, 0.95, 0]}>
                <cylinderGeometry args={[0.008, 0.016, 0.11, 8]} />
                <meshStandardMaterial color="#d8e0eb" metalness={0.6} roughness={0.35} />
              </mesh>
              {/* Kubah Payung Bening Transparan */}
              <mesh position={[0, 0.64, 0]} castShadow>
                <sphereGeometry args={[0.66, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.44]} />
                <meshPhysicalMaterial
                  color="#e6f3ff"
                  transparent
                  opacity={0.44}
                  roughness={0.14}
                  metalness={0.05}
                  clearcoat={0.9}
                  clearcoatRoughness={0.12}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
              {/* Lis Putih Tepi Payung */}
              <mesh position={[0, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.648, 0.009, 6, 24]} />
                <meshStandardMaterial color="#eef4fa" roughness={0.4} />
              </mesh>
              {/* 8 Rusuk Logam Dalam Payung */}
              {[0, 1, 2, 3].map((rIdx) => (
                <mesh
                  key={`rib-${rIdx}`}
                  position={[0, 0.8, 0]}
                  rotation={[0, (rIdx * Math.PI) / 4, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.005, 0.005, 1.22, 6]} />
                  <meshStandardMaterial color="#aeb9c7" metalness={0.7} roughness={0.35} />
                </mesh>
              ))}
            </group>
          )}
        </group>

        {/* Lengan Kanan (pivot dari bahu — melambai, gestur bicara & memegang minuman/jajan hangat!) */}
        <group ref={rightArmRef} position={[0.27, 0.46, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <capsuleGeometry args={[0.062, 0.24, 6, 10]} />
            <meshStandardMaterial color={shirtColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.052, 0.18, 6, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>

          {/* Visual Gelas Hangat / Es Krim / Jajanan Martabak & Kacang Rebus di Tangan Kanan */}
          {holdingDrink && (
            <group position={[0, -0.48, 0.05]} rotation={[0.92, 0, 0]}>
              {holdingDrink === 'ketoprak' ? (
                <group>
                  {/* Piring Ketoprak Jakarta + Bumbu Kacang, Tahu, Ketupat & Kerupuk Renyah */}
                  <mesh position={[0, 0.028, 0.02]} castShadow>
                    <cylinderGeometry args={[0.105, 0.08, 0.024, 14]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.42} />
                  </mesh>
                  {/* Bumbu Kacang Cokelat Gurih & Bihun */}
                  <mesh position={[0, 0.048, 0.02]}>
                    <sphereGeometry args={[0.056, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                    <meshStandardMaterial color="#9a5c2a" roughness={0.62} />
                  </mesh>
                  {/* Potongan Tahu Goreng & Ketupat */}
                  <mesh position={[-0.028, 0.062, 0.015]} castShadow>
                    <boxGeometry args={[0.032, 0.024, 0.032]} />
                    <meshStandardMaterial color="#eab308" roughness={0.7} />
                  </mesh>
                  {/* 2 Kerupuk Oranye-Putih Renyah Menancap Miring */}
                  <mesh position={[0.036, 0.072, 0.028]} rotation={[0.25, 0.3, -0.42]}>
                    <cylinderGeometry args={[0.028, 0.028, 0.009, 10]} />
                    <meshStandardMaterial color="#fb923c" roughness={0.65} />
                  </mesh>
                  <mesh position={[0.015, 0.076, -0.015]} rotation={[-0.2, -0.4, 0.35]}>
                    <cylinderGeometry args={[0.026, 0.026, 0.009, 10]} />
                    <meshStandardMaterial color="#fef3c7" roughness={0.68} />
                  </mesh>
                  <CupSteam position={[0, 0.1, 0.02]} />
                </group>
              ) : holdingDrink === 'doger' ? (
                <group>
                  {/* Gelas Es Doger Merah Muda Segar + Alpukat, Mutiara & Sendok Plastik */}
                  <mesh position={[0, 0.058, 0]} castShadow>
                    <cylinderGeometry args={[0.044, 0.032, 0.115, 14]} />
                    <meshStandardMaterial color="#f472b6" roughness={0.32} />
                  </mesh>
                  {/* Gunungan Es Serut Santan Merah Muda Lembut */}
                  <mesh position={[0, 0.122, 0]}>
                    <sphereGeometry args={[0.042, 12, 10]} />
                    <meshStandardMaterial color="#fbcfe8" roughness={0.45} />
                  </mesh>
                  {/* Topping Potongan Alpukat Hijau & Mutiara Merah */}
                  <mesh position={[-0.015, 0.145, 0.012]}>
                    <boxGeometry args={[0.02, 0.014, 0.02]} />
                    <meshStandardMaterial color="#84cc16" roughness={0.5} />
                  </mesh>
                  <mesh position={[0.016, 0.146, -0.008]}>
                    <sphereGeometry args={[0.012, 8, 8]} />
                    <meshStandardMaterial color="#e11d48" roughness={0.35} />
                  </mesh>
                  {/* Sendok Plastik Putih Menancap Miring */}
                  <mesh position={[0.02, 0.155, 0]} rotation={[0, 0, -0.32]}>
                    <boxGeometry args={[0.011, 0.095, 0.004]} />
                    <meshStandardMaterial color="#fffbeb" roughness={0.4} />
                  </mesh>
                </group>
              ) : holdingDrink === 'pecel_lele' ? (
                <group>
                  {/* Piring Anyaman Rotan / Kertas Minyak Pecel Lele + Nasi Uduk, Lalapan Kemangi & Sambal */}
                  <mesh position={[0, 0.032, 0.02]} castShadow>
                    <cylinderGeometry args={[0.105, 0.082, 0.024, 14]} />
                    <meshStandardMaterial color="#b98a55" roughness={0.82} />
                  </mesh>
                  {/* Nasi Uduk Putih Pulen */}
                  <mesh position={[-0.032, 0.056, 0.012]} castShadow>
                    <sphereGeometry args={[0.036, 10, 8]} />
                    <meshStandardMaterial color="#faf8f3" roughness={0.78} />
                  </mesh>
                  {/* Lele / Ayam Goreng Keemasan */}
                  <mesh position={[0.032, 0.054, 0.014]} rotation={[0, 0.35, Math.PI / 2]} castShadow>
                    <capsuleGeometry args={[0.018, 0.068, 5, 8]} />
                    <meshStandardMaterial color="#9e501c" roughness={0.65} />
                  </mesh>
                  {/* Sambal Terasi Merah + Lalapan Timun & Kemangi */}
                  <mesh position={[0.008, 0.05, 0.06]}>
                    <sphereGeometry args={[0.018, 8, 6]} />
                    <meshStandardMaterial color="#dc2626" roughness={0.55} />
                  </mesh>
                  <mesh position={[-0.028, 0.05, 0.058]}>
                    <sphereGeometry args={[0.017, 8, 6]} />
                    <meshStandardMaterial color="#22c55e" roughness={0.7} />
                  </mesh>
                  <CupSteam position={[0, 0.1, 0.02]} />
                </group>
              ) : holdingDrink === 'gorengan' ? (
                <group>
                  {/* Kantong Kertas Cokelat Gorengan Hangat Berisi Pisang Goreng, Tahu Isi & Cabai Rawit */}
                  <mesh position={[0, 0.065, 0.01]} castShadow>
                    <boxGeometry args={[0.12, 0.13, 0.072]} />
                    <meshStandardMaterial color="#c49a6c" roughness={0.88} />
                  </mesh>
                  {/* Gorengan Keemasan Mengintip di Atas Kantong */}
                  <mesh position={[-0.024, 0.135, 0.008]} rotation={[0.1, 0.2, 0.25]} castShadow>
                    <boxGeometry args={[0.042, 0.048, 0.032]} />
                    <meshStandardMaterial color="#d98a2b" roughness={0.76} />
                  </mesh>
                  <mesh position={[0.025, 0.138, 0.012]} rotation={[-0.1, -0.15, -0.2]} castShadow>
                    <capsuleGeometry args={[0.018, 0.038, 5, 8]} />
                    <meshStandardMaterial color="#c97222" roughness={0.78} />
                  </mesh>
                  {/* Cabai Rawit Hijau Kecil */}
                  <mesh position={[0.004, 0.145, 0.03]} rotation={[0.3, 0, 0.55]}>
                    <capsuleGeometry args={[0.0065, 0.028, 4, 6]} />
                    <meshStandardMaterial color="#22c55e" roughness={0.5} />
                  </mesh>
                  <CupSteam position={[0, 0.17, 0.01]} />
                </group>
              ) : holdingDrink === 'siomay' ? (
                <group>
                  {/* Piring Melamin Siomay Bandung Bumbu Kacang & Jeruk Limau Mengepul */}
                  <mesh position={[0, 0.032, 0.02]} castShadow>
                    <cylinderGeometry args={[0.095, 0.072, 0.024, 14]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.35} />
                  </mesh>
                  {/* Siraman Bumbu Kacang Kental */}
                  <mesh position={[0, 0.048, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.074, 12]} />
                    <meshStandardMaterial color="#a15826" roughness={0.62} />
                  </mesh>
                  {/* 2 Butir Siomay Ikan + Potongan Tahu Kuning + Gulungan Kol */}
                  <mesh position={[-0.026, 0.064, 0.015]} castShadow>
                    <sphereGeometry args={[0.024, 8, 8]} />
                    <meshStandardMaterial color="#efe4cc" roughness={0.7} />
                  </mesh>
                  <mesh position={[0.024, 0.064, 0.008]} castShadow>
                    <sphereGeometry args={[0.023, 8, 8]} />
                    <meshStandardMaterial color="#e8d8b8" roughness={0.7} />
                  </mesh>
                  <mesh position={[0.004, 0.064, 0.044]} castShadow>
                    <boxGeometry args={[0.036, 0.026, 0.03]} />
                    <meshStandardMaterial color="#e5b84b" roughness={0.72} />
                  </mesh>
                  <mesh position={[-0.03, 0.062, 0.045]}>
                    <sphereGeometry args={[0.018, 8, 8]} />
                    <meshStandardMaterial color="#86b868" roughness={0.75} />
                  </mesh>
                  {/* Garpu Tusuk Kecil */}
                  <mesh position={[0.045, 0.088, 0.03]} rotation={[0.25, 0, -0.45]}>
                    <cylinderGeometry args={[0.0045, 0.0045, 0.095, 6]} />
                    <meshStandardMaterial color="#d4b483" roughness={0.8} />
                  </mesh>
                  <CupSteam position={[0, 0.1, 0.02]} />
                </group>
              ) : holdingDrink === 'dawet' ? (
                <group>
                  {/* Gelas Tinggi Bening Es Dawet Ayu (Gula Aren, Santan & Cendol Hijau + Sedotan) */}
                  <mesh position={[0, 0.035, 0]} castShadow>
                    <cylinderGeometry args={[0.044, 0.038, 0.055, 12]} />
                    <meshStandardMaterial color="#6e3614" roughness={0.28} />
                  </mesh>
                  <mesh position={[0, 0.088, 0]} castShadow>
                    <cylinderGeometry args={[0.049, 0.044, 0.06, 12]} />
                    <meshStandardMaterial color="#f5efe2" roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 0.122, 0]}>
                    <cylinderGeometry args={[0.047, 0.047, 0.022, 12]} />
                    <meshStandardMaterial color="#4da85b" roughness={0.45} />
                  </mesh>
                  <mesh position={[0.014, 0.175, 0.01]} rotation={[0.16, 0, -0.2]}>
                    <cylinderGeometry args={[0.0065, 0.0065, 0.12, 6]} />
                    <meshStandardMaterial color="#22c55e" roughness={0.35} />
                  </mesh>
                </group>
              ) : holdingDrink === 'sate' ? (
                <group>
                  {/* Piring Berisi Tusuk Sate Ayam Bumbu Kacang Mengepul */}
                  <mesh position={[0, 0.035, 0.02]} castShadow>
                    <cylinderGeometry args={[0.095, 0.075, 0.025, 12]} />
                    <meshStandardMaterial color="#f5efe6" roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 0.052, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.078, 12]} />
                    <meshStandardMaterial color="#8c4e24" roughness={0.65} />
                  </mesh>
                  {[-0.03, 0, 0.03].map((sx, si) => (
                    <mesh key={`skw-${si}`} position={[sx, 0.068, 0.02]} rotation={[0.15, 0.25, Math.PI / 2]}>
                      <cylinderGeometry args={[0.011, 0.011, 0.14, 6]} />
                      <meshStandardMaterial color="#5c2d16" roughness={0.55} />
                    </mesh>
                  ))}
                  <CupSteam position={[0, 0.1, 0.02]} />
                </group>
              ) : holdingDrink === 'coconut' ? (
                <group>
                  {/* Kelapa Muda Hijau Utuh dengan Puncak Kupas Putih & Sedotan Merah */}
                  <mesh position={[0, 0.06, 0]} castShadow>
                    <sphereGeometry args={[0.075, 12, 10]} />
                    <meshStandardMaterial color="#3c8a45" roughness={0.62} />
                  </mesh>
                  <mesh position={[0, 0.115, 0]}>
                    <cylinderGeometry args={[0.048, 0.056, 0.022, 12]} />
                    <meshStandardMaterial color="#f5efe2" roughness={0.75} />
                  </mesh>
                  <mesh position={[0.015, 0.17, 0.01]} rotation={[0.18, 0, -0.22]}>
                    <cylinderGeometry args={[0.007, 0.007, 0.13, 6]} />
                    <meshStandardMaterial color="#e8534a" roughness={0.4} />
                  </mesh>
                </group>
              ) : holdingDrink === 'icecream' ? (
                <group>
                  <mesh position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]} castShadow>
                    <coneGeometry args={[0.045, 0.14, 10]} />
                    <meshStandardMaterial color="#d9a15b" roughness={0.8} />
                  </mesh>
                  <mesh position={[0, 0.11, 0]} castShadow>
                    <sphereGeometry args={[0.055, 10, 10]} />
                    <meshStandardMaterial color="#f598ad" roughness={0.5} />
                  </mesh>
                </group>
              ) : holdingDrink === 'martabak' ? (
                <group>
                  {/* Kotak Kertas Martabak Manis Hangat Terbuka Sebagian */}
                  <mesh position={[0, 0.04, 0.03]} castShadow>
                    <boxGeometry args={[0.16, 0.055, 0.16]} />
                    <meshStandardMaterial color="#f5ede0" roughness={0.78} />
                  </mesh>
                  <mesh position={[0, 0.068, 0.03]}>
                    <boxGeometry args={[0.13, 0.02, 0.13]} />
                    <meshStandardMaterial color="#e6ad49" roughness={0.68} />
                  </mesh>
                  <mesh position={[0, 0.078, 0.03]}>
                    <boxGeometry args={[0.1, 0.01, 0.1]} />
                    <meshStandardMaterial color="#4f2a18" roughness={0.7} />
                  </mesh>
                  <CupSteam position={[0, 0.1, 0.03]} />
                </group>
              ) : holdingDrink === 'peanuts' ? (
                <group>
                  {/* Kantong Kertas Cokelat Kacang Rebus Hangat */}
                  <mesh position={[0, 0.055, 0]} castShadow>
                    <cylinderGeometry args={[0.062, 0.048, 0.14, 8]} />
                    <meshStandardMaterial color="#b58352" roughness={0.9} />
                  </mesh>
                  <mesh position={[0, 0.125, 0]} castShadow>
                    <sphereGeometry args={[0.052, 8, 8]} />
                    <meshStandardMaterial color="#cfa578" roughness={0.88} />
                  </mesh>
                  <CupSteam position={[0, 0.14, 0]} />
                </group>
              ) : holdingDrink === 'soup' ? (
                <group>
                  {/* Mangkuk Keramik Sup Hangat / Masakan Rumah Mengepul */}
                  <mesh position={[0, 0.045, 0.02]} castShadow>
                    <cylinderGeometry args={[0.082, 0.052, 0.085, 14]} />
                    <meshStandardMaterial color="#f5efe6" roughness={0.32} />
                  </mesh>
                  <mesh position={[0, 0.082, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.072, 14]} />
                    <meshStandardMaterial color="#d98c3f" roughness={0.28} />
                  </mesh>
                  <CupSteam position={[0, 0.11, 0.02]} />
                </group>
              ) : holdingDrink === 'roti' ? (
                <group>
                  {/* Roti Panggang Hangat dalam Bungkus Kertas Krem */}
                  <mesh position={[0, 0.04, 0.01]} castShadow>
                    <boxGeometry args={[0.11, 0.11, 0.075]} />
                    <meshStandardMaterial color="#f5ebd6" roughness={0.85} />
                  </mesh>
                  <mesh position={[0, 0.105, 0.01]} scale={[1.1, 0.72, 0.85]} castShadow>
                    <sphereGeometry args={[0.056, 10, 8]} />
                    <meshStandardMaterial color="#c9843b" roughness={0.72} />
                  </mesh>
                  <CupSteam position={[0, 0.14, 0.01]} />
                </group>
              ) : (
                <group>
                  <mesh position={[0, 0.05, 0]} castShadow>
                    <cylinderGeometry args={[0.052, 0.044, 0.12, 12]} />
                    <meshStandardMaterial
                      color={
                        holdingDrink === 'wedang'
                          ? '#f0d7a8'
                          : holdingDrink === 'coffee'
                            ? '#f2ece1'
                            : holdingDrink === 'cocoa'
                              ? '#8a5942'
                              : '#e8e4d8'
                      }
                      transparent={holdingDrink === 'wedang'}
                      opacity={holdingDrink === 'wedang' ? 0.72 : 1}
                      roughness={holdingDrink === 'wedang' ? 0.18 : 0.45}
                    />
                  </mesh>
                  <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.046, 12]} />
                    <meshStandardMaterial
                      color={
                        holdingDrink === 'wedang'
                          ? '#b56727'
                          : holdingDrink === 'coffee'
                            ? '#3d2517'
                            : holdingDrink === 'cocoa'
                              ? '#663c27'
                              : '#a67b3c'
                      }
                      roughness={0.25}
                    />
                  </mesh>
                  <CupSteam position={[0, 0.12, 0]} />
                </group>
              )}
            </group>
          )}
        </group>

        {/* Leher */}
        <mesh position={[0, 0.58, 0]}>
          <cylinderGeometry args={[0.065, 0.075, 0.12, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.75} />
        </mesh>

        {/* Kepala & Wajah Ekspresif (terhubung ke headRef untuk menoleh / kontak mata!) */}
        <group ref={headRef} position={[0, 0.75, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.175, 18, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.72} />
          </mesh>
          {/* Telinga halus */}
          <mesh position={[-0.17, 0, 0]}>
            <sphereGeometry args={[0.036, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          <mesh position={[0.17, 0, 0]}>
            <sphereGeometry args={[0.036, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          {/* Mata & Alis */}
          <mesh position={[-0.058, 0.02, 0.156]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#1a1715" roughness={0.2} />
          </mesh>
          <mesh position={[0.058, 0.02, 0.156]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#1a1715" roughness={0.2} />
          </mesh>
          <mesh position={[-0.058, 0.055, 0.155]}>
            <boxGeometry args={[0.045, 0.012, 0.01]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.058, 0.055, 0.155]}>
            <boxGeometry args={[0.045, 0.012, 0.01]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          {/* Senyum hangat tipis */}
          <mesh position={[0, -0.055, 0.158]}>
            <boxGeometry args={[0.055, 0.012, 0.01]} />
            <meshStandardMaterial color="#9c5e4e" roughness={0.7} />
          </mesh>
          {/* Rambut Sculpted */}
          <mesh position={[0, 0.045, -0.02]} castShadow>
            <sphereGeometry args={[0.186, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            <meshStandardMaterial color={hairColor} roughness={0.88} />
          </mesh>
          {isFemale && !isChild && (
            <mesh position={[0, -0.06, -0.1]} castShadow>
              <capsuleGeometry args={[0.13, 0.18, 8, 12]} />
              <meshStandardMaterial color={hairColor} roughness={0.88} />
            </mesh>
          )}
          {isChild && (
            <>
              <mesh position={[-0.17, 0.02, -0.05]} castShadow>
                <sphereGeometry args={[0.075, 10, 10]} />
                <meshStandardMaterial color={hairColor} roughness={0.88} />
              </mesh>
              <mesh position={[0.17, 0.02, -0.05]} castShadow>
                <sphereGeometry args={[0.075, 10, 10]} />
                <meshStandardMaterial color={hairColor} roughness={0.88} />
              </mesh>
            </>
          )}
        </group>
      </group>
    </group>
  );
};
