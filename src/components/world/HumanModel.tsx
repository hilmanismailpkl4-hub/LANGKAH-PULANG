import React from 'react';
import { CharacterProfile } from '../../data/characters';

interface HumanModelProps {
  profile: CharacterProfile;
  leftLegRef?: React.RefObject<THREE.Group>;
  rightLegRef?: React.RefObject<THREE.Group>;
  leftArmRef?: React.RefObject<THREE.Group>;
  rightArmRef?: React.RefObject<THREE.Group>;
  isChild?: boolean;
  isFemale?: boolean;
}

import * as THREE from 'three';

/**
 * Model manusia 3D stylized semi-realistis (proporsi halus, sendi lembut, pakaian berlapis,
 * sepatu, kerah, rambut bertekstur, dan aksesori khas tiap karakter).
 */
export const HumanModel: React.FC<HumanModelProps> = ({
  profile,
  leftLegRef,
  rightLegRef,
  leftArmRef,
  rightArmRef,
  isChild = false,
  isFemale = false,
}) => {
  const { shirtColor, pantsColor, skinColor, hairColor, accentProp } = profile.appearance;
  const scale = profile.appearance.height / 1.74;

  return (
    <group scale={scale}>
      {/* Bayangan kontak lembut di tanah agar karakter menapak realistis */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 16]} />
        <meshBasicMaterial color="#0b0d12" transparent opacity={0.32} depthWrite={false} />
      </mesh>

      {/* Kaki Kiri */}
      <group ref={leftLegRef} position={[-0.12, 0.82, 0]}>
        <mesh position={[0, -0.34, 0]} castShadow>
          <capsuleGeometry args={[0.082, 0.56, 6, 10]} />
          <meshStandardMaterial color={pantsColor} roughness={0.86} />
        </mesh>
        {/* Sepatu */}
        <mesh position={[0, -0.74, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.11, 0.27]} />
          <meshStandardMaterial color="#231f1d" roughness={0.65} />
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
          <meshStandardMaterial color="#231f1d" roughness={0.65} />
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

      {/* Tubuh / Kemeja / Gaun Halus */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <capsuleGeometry args={[isFemale ? 0.18 : 0.205, 0.34, 8, 14]} />
        <meshStandardMaterial color={shirtColor} roughness={0.78} />
      </mesh>
      {/* Kerah Baju */}
      <mesh position={[0, 1.44, 0.02]}>
        <torusGeometry args={[0.095, 0.028, 8, 16]} />
        <meshStandardMaterial color="#efeae1" roughness={0.8} />
      </mesh>

      {/* Aksesori Karakter */}
      {accentProp === 'backpack' && (
        <group position={[0, 1.18, -0.2]}>
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
        <mesh position={[0, 1.04, 0.18]} castShadow>
          <boxGeometry args={[0.32, 0.56, 0.05]} />
          <meshStandardMaterial color="#4a3629" roughness={0.85} />
        </mesh>
      )}
      {accentProp === 'tie' && (
        <mesh position={[0, 1.24, 0.205]}>
          <boxGeometry args={[0.06, 0.32, 0.03]} />
          <meshStandardMaterial color="#263854" roughness={0.5} />
        </mesh>
      )}
      {accentProp === 'cardigan' && (
        <group>
          <mesh position={[-0.14, 1.14, 0.14]}>
            <boxGeometry args={[0.1, 0.48, 0.08]} />
            <meshStandardMaterial color="#b36d5d" roughness={0.88} />
          </mesh>
          <mesh position={[0.14, 1.14, 0.14]}>
            <boxGeometry args={[0.1, 0.48, 0.08]} />
            <meshStandardMaterial color="#b36d5d" roughness={0.88} />
          </mesh>
        </group>
      )}
      {accentProp === 'vest' && (
        <mesh position={[0, 1.18, 0.01]}>
          <cylinderGeometry args={[0.215, 0.215, 0.42, 12]} />
          <meshStandardMaterial color="#3d4b4f" roughness={0.82} />
        </mesh>
      )}
      {accentProp === 'scarf' && (
        <mesh position={[0, 1.43, 0.02]}>
          <torusGeometry args={[0.13, 0.05, 8, 16]} />
          <meshStandardMaterial color="#b99cc7" roughness={0.9} />
        </mesh>
      )}

      {/* Lengan Kiri */}
      <group ref={leftArmRef} position={[-0.27, 1.38, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.062, 0.24, 6, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.052, 0.18, 6, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.75} />
        </mesh>
      </group>

      {/* Lengan Kanan */}
      <group ref={rightArmRef} position={[0.27, 1.38, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.062, 0.24, 6, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.052, 0.18, 6, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.75} />
        </mesh>
      </group>

      {/* Leher */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 0.12, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.75} />
      </mesh>

      {/* Kepala & Wajah Halus */}
      <group position={[0, 1.67, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.175, 18, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.72} />
        </mesh>
        {/* Mata halus */}
        <mesh position={[-0.058, 0.02, 0.155]}>
          <sphereGeometry args={[0.017, 8, 8]} />
          <meshStandardMaterial color="#1a1715" roughness={0.2} />
        </mesh>
        <mesh position={[0.058, 0.02, 0.155]}>
          <sphereGeometry args={[0.017, 8, 8]} />
          <meshStandardMaterial color="#1a1715" roughness={0.2} />
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
  );
};
