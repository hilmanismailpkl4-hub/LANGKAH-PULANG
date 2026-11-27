import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { LocationId, TimeOfDay } from '../../types/game';
import { Portal } from './Portal';

const ZEN_MONOLOGUES: Record<LocationId, string> = {
  rumah_damar:
    'Di antara dinding hangat ini, tidak ada gelar yang perlu dibuktikan—cukup hadir seutuhnya.',
  perumahan:
    'Lampu-lampu teras Jl. Melati menyala satu per satu; setiap rumah menyimpan cara pulangnya sendiri.',
  kedai_bima:
    'Aroma kopi hangat dan kayu tua mengingatkan bahwa persahabatan sejati tak pernah menghitung waktu.',
  minimarket:
    'Bahkan di sudut kota yang terjaga 24 jam, selalu ada ruang kecil untuk berhenti menarik napas.',
  toko_musik:
    'Nada-nada lama tidak pernah benar-benar hilang; ia hanya menunggu jari yang kembali jujur memetiknya.',
  perkantoran:
    'Gedung setinggi apa pun hanyalah tempat bekerja—bukan tempat seluruh hidup harus dihabiskan.',
  rooftop:
    'Dari atas angin malam Menara Nusantara, semua cemas yang tadi tampak raksasa mengecil jadi titik cahaya.',
  stasiun_tua:
    'Kereta datang dan pergi tepat waktu, tetapi hati manusia butuh jeda untuk tahu ke mana harus pulang.',
  jembatan_sungai:
    'Air di bawah jembatan terus mengalir tenang, membawa pergi kalimat-kalimat lelah yang tak sempat terucap.',
  taman_danau:
    'Riak Danau Senja memantulkan langit apa adanya—mengajarkan betapa indahnya hati yang tidak tergesa.',
};

const SAWAH_ZEN_LINE =
  'Hamparan padi bergelombang pelan mengikuti angin lembah; yang tumbuh paling bernas selalu merunduk tenang.';

const NEXT_AUTO_TIME: Record<TimeOfDay, TimeOfDay> = {
  morning: 'rain_dusk',
  rain_dusk: 'sunset', // Memicu pelangi otomatis setelah hujan reda!
  sunset: 'night',
  night: 'morning',
};

/**
 * 1. Mode Renungan Sinematik [Z] — menyembunyikan HUD, menampilkan bar film 2.39:1 + kutipan batin
 *    puitis Damar yang memudar lembut agar pemain leluasa menikmati atmosfer 3D & musik akustik.
 * 2. Penggerak Siklus Langit Otomatis (Auto-Cycle Waktu) saat diaktifkan pemain di HUD.
 */
export const ZenCinemaOverlay: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const isZenMode = useGameStore((s) => s.isZenMode);
  const setZenMode = useGameStore((s) => s.setZenMode);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const autoTimeCycle = useGameStore((s) => s.autoTimeCycle);
  const setFreeTimeOfDay = useGameStore((s) => s.setFreeTimeOfDay);
  const activeDialogue = useGameStore((s) => s.activeDialogue);
  const isPauseOpen = useGameStore((s) => s.isPauseOpen);

  const [captionVisible, setCaptionVisible] = useState(true);

  // Tampilkan kutipan batin puitis selama 7.5 detik setiap kali masuk Mode Sinematik atau pindah lokasi
  useEffect(() => {
    if (!isZenMode) return;
    setCaptionVisible(true);
    const id = window.setTimeout(() => {
      setCaptionVisible(false);
    }, 7500);
    return () => window.clearTimeout(id);
  }, [isZenMode, currentLocation, timeOfDay]);

  // Siklus Waktu Otomatis Hidup setiap 95 detik saat mode jelajah aktif
  useEffect(() => {
    if (screen !== 'playing' || !autoTimeCycle) return;
    const id = window.setInterval(() => {
      const st = useGameStore.getState();
      if (st.screen !== 'playing' || st.activeDialogue || st.isPauseOpen) return;
      const next = NEXT_AUTO_TIME[st.timeOfDay];
      setFreeTimeOfDay(next);
    }, 95000);
    return () => window.clearInterval(id);
  }, [screen, autoTimeCycle, setFreeTimeOfDay]);

  if (screen !== 'playing' || !isZenMode || activeDialogue || isPauseOpen) {
    return null;
  }

  const [px, , pz] = playerRuntime.position;
  const inPaddyValley = px < -58 && pz > 45;
  const locTitle = inPaddyValley ? 'Lembah Sawah Senja' : LOCATION_BY_ID[currentLocation].name;
  const poeticLine = inPaddyValley ? SAWAH_ZEN_LINE : ZEN_MONOLOGUES[currentLocation];

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[9991] flex flex-col justify-between select-none">
        {/* Letterbox Sinematik Atas */}
        <div className="flex h-[10vh] min-h-[48px] items-center justify-between bg-gradient-to-b from-black/95 via-black/85 to-transparent px-6">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-warm-200/70">
            <Sparkles className="h-3 w-3 text-warm-300" />
            <span>Mode Renungan Sinematik · {locTitle}</span>
          </div>
          <button
            type="button"
            onClick={() => setZenMode(false)}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-warm-200/20 bg-dusk-950/70 px-3 py-1 text-[10px] text-warm-200/85 backdrop-blur-md transition hover:border-warm-300/60 hover:text-warm-50"
          >
            <X className="h-3 w-3" />
            <span>Tutup [Z / Esc]</span>
          </button>
        </div>

        {/* Letterbox Sinematik Bawah + Kutipan Batin Kontekstual */}
        <div className="flex h-[12vh] min-h-[62px] flex-col items-center justify-center bg-gradient-to-t from-black/95 via-black/88 to-transparent px-6 text-center">
          <p
            className={`max-w-2xl font-serif text-xs sm:text-sm italic text-warm-100/95 transition-opacity duration-1000 ${
              captionVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            "{poeticLine}"
          </p>
        </div>
      </div>
    </Portal>
  );
};
