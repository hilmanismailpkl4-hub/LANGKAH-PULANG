import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PHOTO_FILTER_BY_ID } from '../../data/photoFilters';
import { useGameStore } from '../../store/useGameStore';
import { detectIsMobileDevice } from '../../utils/mobileUtils';
import { AfternoonAndCreativeLife } from './AfternoonAndCreativeLife';
import { ArtisticAndStationDetails } from './ArtisticAndStationDetails';
import { Atmosphere } from './Atmosphere';
import { BarberNurseryAndGallonDepot } from './BarberNurseryAndGallonDepot';
import { BicycleEntity } from './BicycleEntity';
import { CafeAndNightStreetLife } from './CafeAndNightStreetLife';
import { CilokBikeShareAndWatchmaker } from './CilokBikeShareAndWatchmaker';
import { CityDetails } from './CityDetails';
import { CityGeometry } from './CityGeometry';
import { CityLife } from './CityLife';
import { CraftAndPingPongLife } from './CraftAndPingPongLife';
import { DogerChessAndKrlBoard } from './DogerChessAndKrlBoard';
import { FishingAndFlowerLibrary } from './FishingAndFlowerLibrary';
import { HomeKitchenAndParkNature } from './HomeKitchenAndParkNature';
import { HomeLivingAndBusStop } from './HomeLivingAndBusStop';
import { HomeWarmthAndButterflies } from './HomeWarmthAndButterflies';
import { HomeYardLife } from './HomeYardLife';
import { KetoprakLotusAndWeatherPlaza } from './KetoprakLotusAndWeatherPlaza';
import { LakeBoatsBandrekAndParkLights } from './LakeBoatsBandrekAndParkLights';
import { MorningDucksFlowersAndBubur } from './MorningDucksFlowersAndBubur';
import { MorningParkAndBadminton } from './MorningParkAndBadminton';
import { MusholaTehPociAndAngkotBoard } from './MusholaTehPociAndAngkotBoard';
import { MusicAndKiosLife } from './MusicAndKiosLife';
import { NatureAndRainbow } from './NatureAndRainbow';
import { NeighborhoodIceCreamFruitAndPortal } from './NeighborhoodIceCreamFruitAndPortal';
import { NeighborhoodMorningAndFridge } from './NeighborhoodMorningAndFridge';
import { NightDiningAtmAndOpang } from './NightDiningAtmAndOpang';
import { NightNeighborhoodAndClock } from './NightNeighborhoodAndClock';
import { OfficeLobbyLife } from './OfficeLobbyLife';
import { ParkFountainPicnicAndJoggers } from './ParkFountainPicnicAndJoggers';
import { ParkJasukeWaterAndWayfinder } from './ParkJasukeWaterAndWayfinder';
import { ParkPlaygroundAndKoi } from './ParkPlaygroundAndKoi';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { PlayerController } from './PlayerController';
import { PostEffects } from './PostEffects';
import { PutuWorkshopAndLaundry } from './PutuWorkshopAndLaundry';
import { RetroStreetAndParkSwing } from './RetroStreetAndParkSwing';
import { RiverAndParkLife } from './RiverAndParkLife';
import { RiversideNightMarket } from './RiversideNightMarket';
import { RooftopLakeAndRtBoard } from './RooftopLakeAndRtBoard';
import { ScooterEntity } from './ScooterEntity';
import { StationAndBuskerLife } from './StationAndBuskerLife';
import { StationWarkopBirdsAndMusicBench } from './StationWarkopBirdsAndMusicBench';
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
  const isMobile = detectIsMobileDevice();
  const isPotato = settings.graphicsQuality === 'potato';
  const maxDpr = isPotato
    ? 0.72
    : isMobile
      ? settings.graphicsQuality === 'low'
        ? 0.95
        : 1.15
      : 2.0;
  const dpr = Math.max(0.55, Math.min(maxDpr, settings.resolutionScale));
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
          shadows={!isPotato && (!isMobile && settings.shadowQuality !== 'off' ? true : settings.shadowQuality === 'sharp')}
          dpr={dpr}
          camera={{ fov: isMobile ? 58 : 52, near: 0.42, far: isPotato ? 96 : isMobile ? 132 : 300, position: [-20, 4, 73] }}
          gl={{
            antialias: !isMobile && !isPotato && settings.graphicsQuality !== 'low',
            powerPreference: isMobile || isPotato ? 'default' : 'high-performance',
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: settings.exposure,
          }}
        >
          <Suspense fallback={null}>
            <PerformanceOptimizer settings={settings} timeOfDay={effectiveTime} />
            <Atmosphere timeOfDay={effectiveTime} settings={settings} />
            <NatureAndRainbow timeOfDay={effectiveTime} settings={settings} />
            <CityGeometry
              timeOfDay={effectiveTime}
              buWatiLampFixed={buWatiLampFixed}
              settings={settings}
            />
            <CityDetails timeOfDay={effectiveTime} settings={settings} pierLampFixed={pierLampFixed} />

            {/* Grup Detail Distrik yang dikelola otomatis oleh Distance Culler pada mode Hemat HP / HP Kentang */}
            <group name="__district_detail_root__">
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
              <NightDiningAtmAndOpang timeOfDay={effectiveTime} settings={settings} />
              <RetroStreetAndParkSwing timeOfDay={effectiveTime} settings={settings} />
              <DogerChessAndKrlBoard timeOfDay={effectiveTime} settings={settings} />
              <KetoprakLotusAndWeatherPlaza timeOfDay={effectiveTime} settings={settings} />
              <StationWarkopBirdsAndMusicBench timeOfDay={effectiveTime} settings={settings} />
              <ParkJasukeWaterAndWayfinder timeOfDay={effectiveTime} settings={settings} />
              <NeighborhoodIceCreamFruitAndPortal timeOfDay={effectiveTime} settings={settings} />
              <BarberNurseryAndGallonDepot timeOfDay={effectiveTime} settings={settings} />
              <MorningDucksFlowersAndBubur timeOfDay={effectiveTime} settings={settings} />
              <MusholaTehPociAndAngkotBoard timeOfDay={effectiveTime} settings={settings} />
              <PutuWorkshopAndLaundry timeOfDay={effectiveTime} settings={settings} />
              <CilokBikeShareAndWatchmaker timeOfDay={effectiveTime} settings={settings} />
              <LakeBoatsBandrekAndParkLights timeOfDay={effectiveTime} settings={settings} />
              <FishingAndFlowerLibrary timeOfDay={effectiveTime} settings={settings} />
            </group>

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
