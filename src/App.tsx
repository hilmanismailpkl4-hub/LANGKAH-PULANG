import React, { useEffect } from 'react';
import { ChapterTransition } from './components/ui/ChapterTransition';
import { DialogueOverlay } from './components/ui/DialogueOverlay';
import { EndingScreen } from './components/ui/EndingScreen';
import { GameHUD } from './components/ui/GameHUD';
import { GraphicsSettingsModal } from './components/ui/GraphicsSettingsModal';
import { MapJournalModal } from './components/ui/MapJournalModal';
import { PauseSettingsModal } from './components/ui/PauseSettingsModal';
import { PhoneNotification } from './components/ui/PhoneNotification';
import { PhotoModeOverlay } from './components/ui/PhotoModeOverlay';
import { TitleScreen } from './components/ui/TitleScreen';
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
    <main className="relative h-screen w-screen overflow-hidden bg-dusk-950">
      {/* Dunia Kota 3D Modern */}
      <GameCanvas />

      {/* Seluruh UI dirender lewat React Portal dengan z-index tertinggi */}
      <TitleScreen />
      <GameHUD />
      <PhotoModeOverlay />
      <PhoneNotification />
      <DialogueOverlay />
      <MapJournalModal />
      <PauseSettingsModal />
      <GraphicsSettingsModal />
      <ChapterTransition />
      <EndingScreen />
    </main>
  );
}

export default App;
