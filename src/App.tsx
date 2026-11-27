import React, { useEffect } from 'react';
import { BookStallModal } from './components/ui/BookStallModal';
import { ChapterTransition } from './components/ui/ChapterTransition';
import { CongklakMinigameModal } from './components/ui/CongklakMinigameModal';
import { CulinaryModal } from './components/ui/CulinaryModal';
import { DialogueOverlay } from './components/ui/DialogueOverlay';
import { EndingScreen } from './components/ui/EndingScreen';
import { FamilyPhotoAlbumModal } from './components/ui/FamilyPhotoAlbumModal';
import { FpsOverlay } from './components/ui/FpsOverlay';
import { FridgeNotesModal } from './components/ui/FridgeNotesModal';
import { GameHUD } from './components/ui/GameHUD';
import { GraphicsSettingsModal } from './components/ui/GraphicsSettingsModal';
import { GuitarMinigameModal } from './components/ui/GuitarMinigameModal';
import { HomeKitchenModal } from './components/ui/HomeKitchenModal';
import { InventoryBagModal } from './components/ui/InventoryBagModal';
import { LittleLibraryModal } from './components/ui/LittleLibraryModal';
import { LoadingScreenOverlay } from './components/ui/LoadingScreenOverlay';
import { MailboxModal } from './components/ui/MailboxModal';
import { MapJournalModal } from './components/ui/MapJournalModal';
import { MobileLandscapeOverlay } from './components/ui/MobileLandscapeOverlay';
import { MobileTouchControls } from './components/ui/MobileTouchControls';
import { NadiaLetterModal } from './components/ui/NadiaLetterModal';
import { NewsstandModal } from './components/ui/NewsstandModal';
import { PauseSettingsModal } from './components/ui/PauseSettingsModal';
import { PhoneNotification } from './components/ui/PhoneNotification';
import { PhotoModeOverlay } from './components/ui/PhotoModeOverlay';
import { RtBoardModal } from './components/ui/RtBoardModal';
import { SmartphoneModal } from './components/ui/SmartphoneModal';
import { TelescopeOverlay } from './components/ui/TelescopeOverlay';
import { TitleScreen } from './components/ui/TitleScreen';
import { WardrobeModal } from './components/ui/WardrobeModal';
import { ZenCinemaOverlay } from './components/ui/ZenCinemaOverlay';
import { GameCanvas } from './components/world/GameCanvas';
import { useGameStore } from './store/useGameStore';

export function App() {
  const initApp = useGameStore((s) => s.initApp);
  const tickPlayTime = useGameStore((s) => s.tickPlayTime);
  const saveCurrentGame = useGameStore((s) => s.saveCurrentGame);

  useEffect(() => {
    void initApp();
  }, [initApp]);

  // Penghitung durasi bermain & auto-save senyap berkala setiap 60 detik
  useEffect(() => {
    const playTimer = window.setInterval(() => {
      tickPlayTime();
    }, 1000);

    const autoSaveTimer = window.setInterval(() => {
      const state = useGameStore.getState();
      if (state.screen === 'playing' && state.activeSlotId) {
        void saveCurrentGame(true);
      }
    }, 60000);

    return () => {
      window.clearInterval(playTimer);
      window.clearInterval(autoSaveTimer);
    };
  }, [tickPlayTime, saveCurrentGame]);

  return (
    <main className="relative h-[100dvh] w-[100dvw] overflow-hidden bg-dusk-950">
      {/* Dunia Kota 3D Modern */}
      <GameCanvas />

      {/* Seluruh UI dirender lewat React Portal dengan z-index tertinggi */}
      <TitleScreen />
      <GameHUD />
      <FpsOverlay />
      <MobileTouchControls />
      <MobileLandscapeOverlay />
      <ZenCinemaOverlay />
      <PhotoModeOverlay />
      <SmartphoneModal />
      <GuitarMinigameModal />
      <CongklakMinigameModal />
      <NadiaLetterModal />
      <CulinaryModal />
      <HomeKitchenModal />
      <FamilyPhotoAlbumModal />
      <FridgeNotesModal />
      <WardrobeModal />
      <LittleLibraryModal />
      <BookStallModal />
      <NewsstandModal />
      <MailboxModal />
      <RtBoardModal />
      <TelescopeOverlay />
      <InventoryBagModal />
      <PhoneNotification />
      <DialogueOverlay />
      <MapJournalModal />
      <PauseSettingsModal />
      <GraphicsSettingsModal />
      <ChapterTransition />
      <EndingScreen />
      <LoadingScreenOverlay />
    </main>
  );
}

export default App;
