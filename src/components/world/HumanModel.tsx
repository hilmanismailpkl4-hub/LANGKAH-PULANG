import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterProfile } from '../../data/characters';
import { HeldDrinkVisual } from '../../data/culinaryMenu';

/**
 * Kepulan uap asap tipis yang naik perlahan dari gelas wedang, kopi, atau teh hangat.
 */
const CupSteam: React.FC<{ position?: [number, number, number] }> = ({ position = [0, 0.12, 0] }) => {
  const puffsRef = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
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
              {holdingDrink === 'icecream' ? (
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
