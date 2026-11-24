import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { Atmosphere } from './Atmosphere';
import { CityGeometry } from './CityGeometry';
import { CityLife } from './CityLife';
import { PlayerController } from './PlayerController';
import { WaypointBeacon } from './WaypointBeacon';
import { WorldInteractables } from './WorldInteractables';

export const GameCanvas: React.FC = () => {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const screen = useGameStore((s) => s.screen);
  const quality = useGameStore((s) => s.settings.graphicsQuality);
  const flags = useGameStore((s) => s.flags);

  const effectiveTime = screen === 'title' ? 'sunset' : timeOfDay;
  const dpr: [number, number] =
    quality === 'low' ? [0.75, 1] : quality === 'medium' ? [1, 1.5] : [1, 2];
  const buWatiLampFixed = flags.includes('bu_wati_lamp_fixed');

  return (
    <div className="fixed inset-0 w-full h-full select-none">
      <Canvas
        shadows={quality !== 'low'}
        dpr={dpr}
        camera={{ fov: 54, near: 0.2, far: 260, position: [-20, 4, 73] }}
        gl={{
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Atmosphere timeOfDay={effectiveTime} quality={quality} />
          <CityGeometry timeOfDay={effectiveTime} buWatiLampFixed={buWatiLampFixed} />
          <CityLife timeOfDay={effectiveTime} />
          <PlayerController />
          <WorldInteractables />
          <WaypointBeacon />
        </Suspense>
      </Canvas>
      {/* Vignette film lembut */}
      <div className="pointer-events-none fixed inset-0 film-vignette" />
    </div>
  );
};
