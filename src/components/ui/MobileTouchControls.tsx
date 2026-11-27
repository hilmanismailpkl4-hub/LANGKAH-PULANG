import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpFromLine,
  Bell,
  Bike,
  Footprints,
  Hand,
  LogOut,
  MessageSquareHeart,
  Sparkles,
  Umbrella,
  Wind,
} from 'lucide-react';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

function dispatchVirtualKey(code: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true, cancelable: true }));
  window.setTimeout(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }));
  }, 40);
}

/**
 * Kontrol Sentuh Ergonomis untuk Versi Landscape HP:
 * - Kiri Bawah: Virtual Analog Joystick 360° (berjalan, lari, kemudi skuter & sepeda) + toggle Lari.
 * - Area Layar Kosong: Geser jari untuk putar kamera 360° & cubit 2 jari untuk zoom (ditangani PlayerController).
 * - Kanan Bawah: Tombol Aksi Utama kontekstual (Interaksi [E], Berdiri, Turun Motor/Sepeda, Klakson/Bel, Tarik Kail/Layangan)
 *   + tombol cepat Sapa, Ngobrol Keluarga & Payung Hujan.
 */
export const MobileTouchControls: React.FC = () => {
  const { isMobile } = useMobileViewport();

  const screen = useGameStore((s) => s.screen);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const isMapJournalOpen = useGameStore((s) => s.isMapJournalOpen);
  const isPauseOpen = useGameStore((s) => s.isPauseOpen);
  const isQuickGraphicsOpen = useGameStore((s) => s.isQuickGraphicsOpen);
  const isPhotoMode = useGameStore((s) => s.isPhotoMode);
  const isPhoneOpen = useGameStore((s) => s.isPhoneOpen);
  const isGuitarOpen = useGameStore((s) => s.isGuitarOpen);
  const isNadiaLetterOpen = useGameStore((s) => s.isNadiaLetterOpen);
  const isBagOpen = useGameStore((s) => s.isBagOpen);
  const activeCulinarySpot = useGameStore((s) => s.activeCulinarySpot);
  const isWardrobeOpen = useGameStore((s) => s.isWardrobeOpen);
  const isLittleLibraryOpen = useGameStore((s) => s.isLittleLibraryOpen);
  const isBookStallOpen = useGameStore((s) => s.isBookStallOpen);
  const isKitchenOpen = useGameStore((s) => s.isKitchenOpen);
  const isPhotoAlbumOpen = useGameStore((s) => s.isPhotoAlbumOpen);
  const isFridgeNotesOpen = useGameStore((s) => s.isFridgeNotesOpen);
  const isNewsstandOpen = useGameStore((s) => s.isNewsstandOpen);
  const isMailboxOpen = useGameStore((s) => s.isMailboxOpen);
  const isRtBoardOpen = useGameStore((s) => s.isRtBoardOpen);
  const isTelescopeOpen = useGameStore((s) => s.isTelescopeOpen);

  const isRidingScooter = useGameStore((s) => s.isRidingScooter);
  const isRidingBicycle = useGameStore((s) => s.isRidingBicycle);
  const isSitting = useGameStore((s) => s.isSitting);
  const isFlyingKite = useGameStore((s) => s.isFlyingKite);
  const isFishing = useGameStore((s) => s.isFishing);
  const fishingBiteReady = useGameStore((s) => s.fishingBiteReady);
  const reelFishingCatch = useGameStore((s) => s.reelFishingCatch);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const triggerCasualFamilyChat = useGameStore((s) => s.triggerCasualFamilyChat);
  const toggleUmbrella = useGameStore((s) => s.toggleUmbrella);
  const umbrellaForcedOff = useGameStore((s) => s.umbrellaForcedOff);
  const interactPrompt = useGameStore((s) => s.interactPrompt);

  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [sprintLocked, setSprintLocked] = useState(false);

  const stickBaseRef = useRef<HTMLDivElement>(null);
  const activeTouchIdRef = useRef<number | null>(null);
  const maxRadius = 40;

  const isBlocked =
    !isMobile ||
    screen !== 'playing' ||
    Boolean(activeDialogue) ||
    isMapJournalOpen ||
    isPauseOpen ||
    isQuickGraphicsOpen ||
    isPhotoMode ||
    isPhoneOpen ||
    isGuitarOpen ||
    isNadiaLetterOpen ||
    isBagOpen ||
    Boolean(activeCulinarySpot) ||
    isWardrobeOpen ||
    isLittleLibraryOpen ||
    isBookStallOpen ||
    isKitchenOpen ||
    isPhotoAlbumOpen ||
    isFridgeNotesOpen ||
    isNewsstandOpen ||
    isMailboxOpen ||
    isRtBoardOpen ||
    isTelescopeOpen;

  // Pastikan joystick kembali ke posisi netral jika modal terbuka tiba-tiba
  useEffect(() => {
    if (isBlocked) {
      activeTouchIdRef.current = null;
      setKnobOffset({ x: 0, y: 0 });
      playerRuntime.touchInput.moveX = 0;
      playerRuntime.touchInput.moveZ = 0;
    }
  }, [isBlocked]);

  useEffect(() => {
    playerRuntime.touchInput.sprint = sprintLocked;
  }, [sprintLocked]);

  if (isBlocked) return null;

  const updateStickFromPoint = (clientX: number, clientY: number) => {
    const el = stickBaseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }
    setKnobOffset({ x: dx, y: dy });
    playerRuntime.touchInput.moveX = dx / maxRadius;
    playerRuntime.touchInput.moveZ = dy / maxRadius;

    // Jika sedang duduk/memancing/layangan lalu menggeser joystick jauh, otomatis berdiri seperti WASD
    if ((isSitting || isFishing || isFlyingKite) && dist > maxRadius * 0.55) {
      dispatchVirtualKey('KeyW');
    }
  };

  const resetStick = () => {
    activeTouchIdRef.current = null;
    setKnobOffset({ x: 0, y: 0 });
    playerRuntime.touchInput.moveX = 0;
    playerRuntime.touchInput.moveZ = 0;
  };

  const handleStickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (activeTouchIdRef.current !== null) return;
    const t = e.changedTouches[0];
    if (!t) return;
    activeTouchIdRef.current = t.identifier;
    updateStickFromPoint(t.clientX, t.clientY);
  };

  const handleStickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (activeTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === activeTouchIdRef.current) {
        updateStickFromPoint(t.clientX, t.clientY);
        break;
      }
    }
  };

  const handleStickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (activeTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        resetStick();
        break;
      }
    }
  };

  const inVehicle = isRidingScooter || isRidingBicycle;
  const inActivity = isSitting || isFishing || isFlyingKite;

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9992] select-none">
        {/* === KIRI BAWAH: VIRTUAL ANALOG JOYSTICK + TOMBOL LARI === */}
        <div
          className="pointer-events-auto fixed flex flex-col items-center gap-2"
          style={{
            left: 'max(14px, env(safe-area-inset-left))',
            bottom: 'max(14px, env(safe-area-inset-bottom))',
          }}
        >
          {!inVehicle && !inActivity && (
            <button
              type="button"
              onTouchStart={(e) => e.stopPropagation()}
              onClick={() => setSprintLocked((prev) => !prev)}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold backdrop-blur-md transition active:scale-95 ${
                sprintLocked
                  ? 'border-warm-300 bg-warm-400 text-dusk-950 shadow-lg'
                  : 'border-warm-100/20 bg-dusk-950/65 text-warm-100/85'
              }`}
            >
              <Footprints className="h-3 w-3" />
              <span>{sprintLocked ? 'Lari Aktif' : 'Lari'}</span>
            </button>
          )}

          {/* Basis Joystick 112px (touch-none agar multi-touch kamera kanan bebas digeser bersamaan!) */}
          <div
            ref={stickBaseRef}
            onTouchStart={handleStickTouchStart}
            onTouchMove={handleStickTouchMove}
            onTouchEnd={handleStickTouchEnd}
            onTouchCancel={handleStickTouchEnd}
            style={{ touchAction: 'none' }}
            className="relative flex h-[112px] w-[112px] touch-none items-center justify-center rounded-full border-2 border-warm-200/25 bg-dusk-950/45 shadow-2xl backdrop-blur-sm"
          >
            {/* Penanda Arah Halus */}
            <span className="pointer-events-none absolute top-1.5 text-[9px] font-bold text-warm-200/45">
              {inVehicle ? 'GAS' : '▲'}
            </span>
            <span className="pointer-events-none absolute bottom-1.5 text-[9px] font-bold text-warm-200/45">
              {inVehicle ? 'REM' : '▼'}
            </span>
            <span className="pointer-events-none absolute left-2 text-[9px] font-bold text-warm-200/40">◀</span>
            <span className="pointer-events-none absolute right-2 text-[9px] font-bold text-warm-200/40">▶</span>

            {/* Knob Thumbstick */}
            <div
              className="pointer-events-none h-11 w-11 rounded-full border-2 border-warm-200/70 bg-warm-300/75 shadow-lg"
              style={{
                transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
              }}
            />
          </div>
        </div>

        {/* === KANAN BAWAH: CLUSTER TOMBOL AKSI KONTEKSTUAL + LOMPAT === */}
        <div
          className="pointer-events-auto fixed flex items-end gap-2.5 touch-none"
          style={{
            right: 'max(14px, env(safe-area-inset-right))',
            bottom: 'max(14px, env(safe-area-inset-bottom))',
            touchAction: 'none',
          }}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Tombol Sekunder Pendamping (Kiri dari Tombol Utama) */}
          <div className="flex flex-col items-end gap-2">
            {/* Baris Kecil: Payung saat Hujan / Ngobrol saat Jalan Keluarga / Sapa */}
            <div className="flex items-center gap-1.5">
              {timeOfDay === 'rain_dusk' && !inVehicle && (
                <button
                  type="button"
                  onClick={toggleUmbrella}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md active:scale-90 ${
                    umbrellaForcedOff
                      ? 'border-warm-100/20 bg-dusk-950/65 text-warm-200/80'
                      : 'border-sky-300/70 bg-sky-900/75 text-sky-200 shadow'
                  }`}
                  aria-label="Payung Hujan"
                >
                  <Umbrella className="h-4 w-4" />
                </button>
              )}

              {isFamilyWalkActive && !inVehicle && (
                <button
                  type="button"
                  onClick={triggerCasualFamilyChat}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-300/50 bg-rose-950/75 text-rose-200 shadow backdrop-blur-md active:scale-90"
                  aria-label="Ngobrol Keluarga"
                >
                  <MessageSquareHeart className="h-4 w-4" />
                </button>
              )}

              {!inVehicle && !inActivity && (
                <button
                  type="button"
                  onClick={() => dispatchVirtualKey('KeyF')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-warm-100/25 bg-dusk-950/65 text-warm-100 shadow backdrop-blur-md active:scale-90"
                  aria-label="Lambaikan Tangan"
                >
                  <Hand className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Tombol Lompat Saat Jalan Kaki / Lari */}
            {!inVehicle && !inActivity && (
              <button
                type="button"
                onTouchStart={(e) => {
                  e.stopPropagation();
                  playerRuntime.touchInput.jumpQueued = true;
                }}
                onClick={() => {
                  playerRuntime.touchInput.jumpQueued = true;
                }}
                className="flex h-[52px] w-[52px] flex-col items-center justify-center rounded-full border-2 border-warm-200/45 bg-dusk-950/75 text-warm-100 shadow-xl backdrop-blur-md active:scale-90"
                aria-label="Lompat"
              >
                <ArrowUpFromLine className="h-4 w-4 text-warm-300" />
                <span className="text-[9px] font-bold">Lompat</span>
              </button>
            )}

            {/* Tombol Aksi Khusus Kendaraan / Memancing / Layangan */}
            {inVehicle && (
              <button
                type="button"
                onClick={() => dispatchVirtualKey('Space')}
                className="flex items-center gap-1.5 rounded-full border border-amber-300/55 bg-dusk-950/80 px-3.5 py-2 text-[11px] font-semibold text-amber-200 shadow-lg backdrop-blur-md active:scale-95"
              >
                <Bell className="h-3.5 w-3.5" />
                <span>{isRidingBicycle ? 'Bel Kring' : 'Klakson'}</span>
              </button>
            )}

            {isFishing && (
              <button
                type="button"
                onClick={reelFishingCatch}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold shadow-lg active:scale-95 ${
                  fishingBiteReady
                    ? 'border-emerald-300 bg-emerald-400 text-dusk-950 animate-pulse'
                    : 'border-sky-300/45 bg-dusk-950/80 text-sky-200'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{fishingBiteReady ? 'Tarik Kail!' : 'Tunggu...'}</span>
              </button>
            )}

            {isFlyingKite && (
              <button
                type="button"
                onClick={() => dispatchVirtualKey('Space')}
                className="flex items-center gap-1.5 rounded-full border border-amber-300/65 bg-amber-400 px-4 py-2 text-xs font-bold text-dusk-950 shadow-lg active:scale-95"
              >
                <Wind className="h-3.5 w-3.5" />
                <span>Tarik Layangan</span>
              </button>
            )}
          </div>

          {/* Tombol Aksi Utama Besar Kanan Bawah (68px) */}
          {inVehicle ? (
            <button
              type="button"
              onClick={() => dispatchVirtualKey('KeyE')}
              className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border-2 border-warm-300/70 bg-dusk-950/82 text-warm-100 shadow-2xl backdrop-blur-md active:scale-95"
            >
              <Bike className="h-5 w-5 text-warm-300" />
              <span className="mt-0.5 text-[10px] font-bold">Parkir</span>
            </button>
          ) : inActivity ? (
            <button
              type="button"
              onClick={() => dispatchVirtualKey('KeyE')}
              className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border-2 border-warm-300/75 bg-warm-400/90 text-dusk-950 shadow-2xl active:scale-95"
            >
              <LogOut className="h-5 w-5" />
              <span className="mt-0.5 text-[10px] font-bold">
                {isSitting ? 'Berdiri' : 'Selesai'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled={!interactPrompt}
              onClick={() => playerRuntime.nearestInteractable?.onInteract()}
              className={`flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border-2 shadow-2xl backdrop-blur-md transition active:scale-95 ${
                interactPrompt
                  ? 'border-warm-200 bg-warm-400/95 text-dusk-950 ring-4 ring-warm-300/30'
                  : 'border-warm-100/20 bg-dusk-950/55 text-warm-200/45'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span className="mt-0.5 text-[10px] font-bold">
                {interactPrompt ? 'Aksi' : 'Dekati'}
              </span>
            </button>
          )}
        </div>
      </div>
    </Portal>
  );
};
