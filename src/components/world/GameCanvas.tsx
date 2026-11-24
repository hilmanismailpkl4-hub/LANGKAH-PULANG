import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { Atmosphere } from './Atmosphere';
import { CityDetails } from './CityDetails';
import { CityGeometry } from './CityGeometry';
import { CityLife } from './CityLife';
import { PlayerController } from './PlayerController';
import { PostEffects } from './PostEffects';
import { ScooterEntity } from './ScooterEntity';
import { WaypointBeacon } from './WaypointBeacon';
import { WorldInteractables } from './WorldInteractables';

export const GameCanvas: React.FC = () => {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const titlePreviewTime = useGameStore((s) => s.titlePreviewTime);
  const screen = useGameStore((s) => s.screen);
  const settings = useGameStore((s) => s.settings);
  const flags = useGameStore((s) => s.flags);

  const effectiveTime = screen === 'title' ? titlePreviewTime : timeOfDay;
  const dpr = Math.max(0.7, Math.min(2, settings.resolutionScale));
  const buWatiLampFixed = flags.includes('bu_wati_lamp_fixed');
  const pierLampFixed = flags.includes('pier_lamp_fixed');

  return (
    <div className="fixed inset-0 w-full h-full select-none">
      <Canvas
        shadows={settings.shadowQuality !== 'off'}
        dpr={dpr}
        camera={{ fov: 52, near: 0.2, far: 300, position: [-20, 4, 73] }}
        gl={{
          antialias: settings.graphicsQuality !== 'low',
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: settings.exposure,
        }}
      >
        <Suspense fallback={null}>
          <Atmosphere timeOfDay={effectiveTime} settings={settings} />
          <CityGeometry
            timeOfDay={effectiveTime}
            buWatiLampFixed={buWatiLampFixed}
            settings={settings}
          />
          <CityDetails timeOfDay={effectiveTime} settings={settings} pierLampFixed={pierLampFixed} />
          <CityLife timeOfDay={effectiveTime} settings={settings} />
          <ScooterEntity timeOfDay={effectiveTime} settings={settings} />
          <PlayerController />
          <WorldInteractables />
          <WaypointBeacon />
          <PostEffects settings={settings} timeOfDay={effectiveTime} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none fixed inset-0 film-vignette" />
    </div>
  );
};
