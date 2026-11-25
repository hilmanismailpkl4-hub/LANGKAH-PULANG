import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PHOTO_FILTER_BY_ID } from '../../data/photoFilters';
import { useGameStore } from '../../store/useGameStore';
import { AfternoonAndCreativeLife } from './AfternoonAndCreativeLife';
import { ArtisticAndStationDetails } from './ArtisticAndStationDetails';
import { Atmosphere } from './Atmosphere';
import { BicycleEntity } from './BicycleEntity';
import { CafeAndNightStreetLife } from './CafeAndNightStreetLife';
import { CityDetails } from './CityDetails';
import { CityGeometry } from './CityGeometry';
import { CityLife } from './CityLife';
import { CraftAndPingPongLife } from './CraftAndPingPongLife';
import { FishingAndFlowerLibrary } from './FishingAndFlowerLibrary';
import { HomeKitchenAndParkNature } from './HomeKitchenAndParkNature';
import { HomeLivingAndBusStop } from './HomeLivingAndBusStop';
import { HomeWarmthAndButterflies } from './HomeWarmthAndButterflies';
import { HomeYardLife } from './HomeYardLife';
import { MorningParkAndBadminton } from './MorningParkAndBadminton';
import { MusicAndKiosLife } from './MusicAndKiosLife';
import { NatureAndRainbow } from './NatureAndRainbow';
import { NeighborhoodMorningAndFridge } from './NeighborhoodMorningAndFridge';
import { NightNeighborhoodAndClock } from './NightNeighborhoodAndClock';
import { OfficeLobbyLife } from './OfficeLobbyLife';
import { ParkFountainPicnicAndJoggers } from './ParkFountainPicnicAndJoggers';
import { ParkPlaygroundAndKoi } from './ParkPlaygroundAndKoi';
import { PlayerController } from './PlayerController';
import { PostEffects } from './PostEffects';
import { RiverAndParkLife } from './RiverAndParkLife';
import { RiversideNightMarket } from './RiversideNightMarket';
import { RooftopLakeAndRtBoard } from './RooftopLakeAndRtBoard';
import { ScooterEntity } from './ScooterEntity';
import { StationAndBuskerLife } from './StationAndBuskerLife';
import { StreetRealismAndSate } from './StreetRealismAndSate';
import { TropicalLandmarkAndDawet } from './TropicalLandmarkAndDawet';
import { WaypointBeacon } from './WaypointBeacon';
import { WorldInteractables } from './WorldInteractables';

export const GameCanvas: React.FC = () => {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const titlePreviewTime = useGameStore((s) => s.titlePreviewTime);
  const screen = useGameStore((s) => s.screen);
  const settings = useGameStore((s) => s.settings);
  const flags = useGameStore((s) => s.flags);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const photoFilter = useGameStore((s) => s.photoFilter);

  const effectiveTime = screen === 'title' ? titlePreviewTime : timeOfDay;
  const dpr = Math.max(0.7, Math.min(2, settings.resolutionScale));
  const buWatiLampFixed = flags.includes('bu_wati_lamp_fixed');
  const pierLampFixed = flags.includes('pier_lamp_fixed');

  const activeFilter = isPhotoMode ? PHOTO_FILTER_BY_ID[photoFilter] : null;

  return (
    <div className="fixed inset-0 w-full h-full select-none">
      <div
        className="w-full h-full transition-[filter] duration-200"
        style={activeFilter && activeFilter.cssFilter !== 'none' ? { filter: activeFilter.cssFilter } : undefined}
      >
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
            <NatureAndRainbow timeOfDay={effectiveTime} settings={settings} />
            <CityGeometry
              timeOfDay={effectiveTime}
              buWatiLampFixed={buWatiLampFixed}
              settings={settings}
            />
            <CityDetails timeOfDay={effectiveTime} settings={settings} pierLampFixed={pierLampFixed} />
            <RiversideNightMarket timeOfDay={effectiveTime} settings={settings} />
            <RiverAndParkLife timeOfDay={effectiveTime} settings={settings} />
            <RooftopLakeAndRtBoard timeOfDay={effectiveTime} settings={settings} />
            <HomeKitchenAndParkNature timeOfDay={effectiveTime} settings={settings} />
            <NeighborhoodMorningAndFridge timeOfDay={effectiveTime} settings={settings} />
            <NightNeighborhoodAndClock timeOfDay={effectiveTime} settings={settings} />
            <OfficeLobbyLife timeOfDay={effectiveTime} settings={settings} />
            <MusicAndKiosLife timeOfDay={effectiveTime} settings={settings} />
            <CafeAndNightStreetLife timeOfDay={effectiveTime} settings={settings} />
            <HomeLivingAndBusStop timeOfDay={effectiveTime} settings={settings} />
            <HomeWarmthAndButterflies timeOfDay={effectiveTime} settings={settings} />
            <HomeYardLife timeOfDay={effectiveTime} settings={settings} />
            <ParkPlaygroundAndKoi timeOfDay={effectiveTime} settings={settings} />
            <ParkFountainPicnicAndJoggers timeOfDay={effectiveTime} settings={settings} />
            <MorningParkAndBadminton timeOfDay={effectiveTime} settings={settings} />
            <StationAndBuskerLife timeOfDay={effectiveTime} settings={settings} />
            <StreetRealismAndSate timeOfDay={effectiveTime} settings={settings} />
            <TropicalLandmarkAndDawet timeOfDay={effectiveTime} settings={settings} />
            <AfternoonAndCreativeLife timeOfDay={effectiveTime} settings={settings} />
            <ArtisticAndStationDetails timeOfDay={effectiveTime} settings={settings} />
            <CraftAndPingPongLife timeOfDay={effectiveTime} settings={settings} />
            <FishingAndFlowerLibrary timeOfDay={effectiveTime} settings={settings} />
            <CityLife timeOfDay={effectiveTime} settings={settings} />
            <ScooterEntity timeOfDay={effectiveTime} settings={settings} />
            <BicycleEntity timeOfDay={effectiveTime} settings={settings} />
            <PlayerController />
            <WorldInteractables />
            <WaypointBeacon />
            <PostEffects settings={settings} timeOfDay={effectiveTime} />
          </Suspense>
        </Canvas>
      </div>

      {/* Lapisan Warna Film Hangat Real-Time khusus saat Mode Foto [P] */}
      {activeFilter?.tintColor && (
        <div
          className="pointer-events-none fixed inset-0 transition-opacity duration-200"
          style={{ backgroundColor: activeFilter.tintColor }}
        />
      )}
      <div className="pointer-events-none fixed inset-0 film-vignette" />
    </div>
  );
};
