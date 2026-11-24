import React from 'react';
import { Bloom, EffectComposer, HueSaturation, Vignette } from '@react-three/postprocessing';
import { GameSettings, TimeOfDay } from '../../types/game';

interface PostEffectsProps {
  settings: GameSettings;
  timeOfDay: TimeOfDay;
}

/**
 * Pipeline Post-Processing Sinematik:
 * - True HDR Mipmap Bloom (lampu jalan, neon toko, jendela kota, matahari senja berpendar lembut)
 * - Penyesuaian saturasi film hangat (nuansa Firewatch / GTA 6 Sunset)
 * - Vignette lensa halus
 */
export const PostEffects: React.FC<PostEffectsProps> = ({ settings, timeOfDay }) => {
  if (!settings.cinematicGlow || settings.bloomIntensity <= 0.02) {
    return null;
  }

  const timeBoost = timeOfDay === 'night' ? 1.15 : timeOfDay === 'sunset' ? 1.05 : 0.72;
  const intensity = Math.max(0.1, settings.bloomIntensity * timeBoost);
  const saturation = timeOfDay === 'sunset' ? 0.12 : timeOfDay === 'rain_dusk' ? -0.05 : 0.06;

  return (
    <EffectComposer multisampling={settings.graphicsQuality === 'ultra' ? 4 : 0}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.86}
        luminanceSmoothing={0.35}
        intensity={intensity}
        radius={0.72}
      />
      <HueSaturation saturation={saturation} hue={0} />
      <Vignette eskil={false} offset={0.26} darkness={0.42} />
    </EffectComposer>
  );
};
