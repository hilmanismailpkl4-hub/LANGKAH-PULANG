import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

// Indeks papan 12 lubang cepat (ramah 1–2 menit sesi santai):
// 0..4  : 5 lubang sisi Ayah (bawah, bergerak kanan -> lumbung Ayah di indeks 5)
// 5     : Lumbung Besar Ayah (kanan)
// 6..10 : 5 lubang sisi Kira (atas, bergerak kiri -> lumbung Kira di indeks 11)
// 11    : Lumbung Besar Kira (kiri)
const INITIAL_BOARD = [4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 0];

const KIRA_QUIPS = {
  start: 'Kira: "Ayo Ayah jalan duluan! Pilih salah satu lubang kerang di sisi bawah ya!"',
  freeTurn: 'Kira: "Waaah!! Biji terakhir Ayah jatuh pas di Lumbung Besar! Ayah boleh jalan sekali lagi!"',
  capture: 'Kira: "AAA!! Kerang Kira ditembak Ayah masuk ke lumbung Ayah semua!! Hebat banget!"',
  kiraTurn: 'Kira: "Sekarang giliran Kira ya... satu, dua, tiga, klotak-klotak!"',
  kiraFree: 'Kira: "YEEEY!! Jatuh di lumbung Kira! Kira jalan lagi yaa, Ayah!"',
  kiraCapture: 'Kira: "HIHIHI!! Kena tembak!! Kerang Ayah pindah ke lumbung Kira deh!"',
};

export const CongklakMinigameModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isCongklakOpen);
  const setCongklakOpen = useGameStore((s) => s.setCongklakOpen);
  const flags = useGameStore((s) => s.flags);
  const chapter = useGameStore((s) => s.chapter);
  const applyEffect = useGameStore((s) => s.applyEffect);
  const showToast = useGameStore((s) => s.showToast);
  const { isMobile, isCompactLandscape } = useMobileViewport();
  const compact = isMobile || isCompactLandscape;

  const [pits, setPits] = useState<number[]>([...INITIAL_BOARD]);
  const [turn, setTurn] = useState<'damar' | 'kira'>('damar');
  const [isAnimating, setIsAnimating] = useState(false);
  const [activePit, setActivePit] = useState<number | null>(null);
  const [handCount, setHandCount] = useState(0);
  const [statusLine, setStatusLine] = useState(KIRA_QUIPS.start);
  const [gameOver, setGameOver] = useState(false);

  const timersRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const resetGame = () => {
    clearAllTimers();
    setPits([...INITIAL_BOARD]);
    setTurn('damar');
    setIsAnimating(false);
    setActivePit(null);
    setHandCount(0);
    setGameOver(false);
    setStatusLine(KIRA_QUIPS.start);
  };

  useEffect(() => {
    if (isOpen) {
      resetGame();
    } else {
      clearAllTimers();
    }
    return () => clearAllTimers();
  }, [isOpen]);

  const finishIfBoardEmpty = (board: number[], nextTurn: 'damar' | 'kira') => {
    const damarSide = board.slice(0, 5).reduce((a, b) => a + b, 0);
    const kiraSide = board.slice(6, 11).reduce((a, b) => a + b, 0);

    if (damarSide === 0 || kiraSide === 0) {
      const finalBoard = [...board];
      finalBoard[5] += damarSide;
      finalBoard[11] += kiraSide;
      for (let i = 0; i < 5; i++) finalBoard[i] = 0;
      for (let i = 6; i < 11; i++) finalBoard[i] = 0;
      setPits(finalBoard);
      setGameOver(true);
      setIsAnimating(false);
      setActivePit(null);
      setHandCount(0);
      sfxEngine.play('chime');

      if (!flags.includes('played_congklak_with_kira')) {
        applyEffect({
          kehadiranKeluarga: 1,
          kejujuranDiri: 1,
          setFlags: ['played_congklak_with_kira'],
          journalEntry: {
            id: 'je_congklak_with_kira',
            title: 'Klotak Kerang Congklak di Lantai Ruang Keluarga',
            body: 'Duduk bersila berhadapan dengan Kira memainkan papan congklak kayu jati di ruang tengah mengajarkanku satu hal sederhana: membagi satu per satu dengan sabar selalu kembali mengisi lumbung hati kita sendiri.',
            chapter,
          },
        });
      }

      if (finalBoard[5] > finalBoard[11]) {
        setStatusLine('Kira: "Waaah Lumbung Ayah penuh banget!! Seru banget main congklak bareng Ayah malam ini!"');
      } else if (finalBoard[11] > finalBoard[5]) {
        setStatusLine('Kira: "HOREEE KIRA MENANG!! Nadia: Lihat tuh Mas, bahagia banget muka anakmu menang lawan Ayahnya!"');
      } else {
        setStatusLine('Kira: "SERI!! Kerang kita sama banyaknya, Ayah!! Kita kompak banget!"');
      }
      return;
    }

    setTurn(nextTurn);
    setIsAnimating(false);
    setActivePit(null);
    setHandCount(0);

    if (nextTurn === 'kira') {
      setStatusLine(KIRA_QUIPS.kiraTurn);
      const tId = window.setTimeout(() => {
        // Pilih lubang Kira yang bisa mencapai lumbung 11 dulu, kalau tidak pilih lubang terbanyak
        let chosen = -1;
        for (let i = 10; i >= 6; i--) {
          if (board[i] > 0 && i + board[i] === 11) {
            chosen = i;
            break;
          }
        }
        if (chosen === -1) {
          let bestSeeds = -1;
          for (let i = 6; i <= 10; i++) {
            if (board[i] > bestSeeds && board[i] > 0) {
              bestSeeds = board[i];
              chosen = i;
            }
          }
        }
        if (chosen !== -1) {
          runMove(board, chosen, 'kira');
        }
      }, 650);
      timersRef.current.push(tId);
    } else {
      setStatusLine('Giliran Damar — pilih lubang kerang di sisi bawah papan.');
    }
  };

  const runMove = (startBoard: number[], startIdx: number, actor: 'damar' | 'kira') => {
    if (startBoard[startIdx] <= 0) return;
    setIsAnimating(true);

    // Simulasikan langkah beruntun (termasuk lanjut otomatis bila jatuh di lubang berisi, maks 36 langkah aman)
    const frames: { board: number[]; pit: number; inHand: number; note?: string }[] = [];
    const sim = [...startBoard];
    let cur = startIdx;
    let hand = sim[cur];
    sim[cur] = 0;
    const ownStore = actor === 'damar' ? 5 : 11;
    const oppStore = actor === 'damar' ? 11 : 5;
    let safety = 0;
    let extraTurn = false;

    while (hand > 0 && safety < 42) {
      safety += 1;
      cur = (cur + 1) % 12;
      if (cur === oppStore) continue; // Lewati lumbung lawan
      sim[cur] += 1;
      hand -= 1;
      frames.push({ board: [...sim], pit: cur, inHand: hand });

      if (hand === 0) {
        if (cur === ownStore) {
          extraTurn = true;
          frames[frames.length - 1].note = actor === 'damar' ? KIRA_QUIPS.freeTurn : KIRA_QUIPS.kiraFree;
          break;
        }
        // Lanjut estafet ("mikul") bila jatuh di lubang kecil yang sudah ada isinya (maks 2 putaran agar cepat & seru)
        if (sim[cur] > 1 && safety < 26) {
          hand = sim[cur];
          sim[cur] = 0;
          continue;
        }
        // Aturan Tembak: jatuh di lubang kosong milik sendiri & seberangnya berisi!
        const isOwnPit = actor === 'damar' ? cur >= 0 && cur <= 4 : cur >= 6 && cur <= 10;
        if (isOwnPit && sim[cur] === 1) {
          const opposite = 10 - cur;
          if (sim[opposite] > 0) {
            const captured = sim[opposite] + sim[cur];
            sim[opposite] = 0;
            sim[cur] = 0;
            sim[ownStore] += captured;
            frames.push({
              board: [...sim],
              pit: ownStore,
              inHand: 0,
              note: actor === 'damar' ? KIRA_QUIPS.capture : KIRA_QUIPS.kiraCapture,
            });
          }
        }
        break;
      }
    }

    frames.forEach((fr, idx) => {
      const id = window.setTimeout(() => {
        setPits(fr.board);
        setActivePit(fr.pit);
        setHandCount(fr.inHand);
        sfxEngine.playCongklakShellDrop(idx);
        if (fr.note) setStatusLine(fr.note);
        if (idx === frames.length - 1) {
          const endId = window.setTimeout(() => {
            const nextActor = extraTurn ? actor : actor === 'damar' ? 'kira' : 'damar';
            finishIfBoardEmpty(fr.board, nextActor);
          }, 340);
          timersRef.current.push(endId);
        }
      }, idx * 145);
      timersRef.current.push(id);
    });
  };

  if (!isOpen) return null;

  const handleClose = () => {
    clearAllTimers();
    setCongklakOpen(false);
    if (flags.includes('played_congklak_with_kira')) {
      showToast('Papan congklak dirapikan kembali di atas tikar ruang keluarga.');
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/85 p-3 backdrop-blur-md">
        <div
          className={`w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-300/30 bg-[#1c140e]/96 text-warm-50 shadow-2xl animate-fadeIn ${
            compact ? 'p-3.5' : 'p-6'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-amber-200/15 pb-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300/85">
                Permainan Tradisional Nusantara · Ruang Keluarga Jl. Melati
              </p>
              <h2 className={`font-serif text-warm-50 ${compact ? 'text-base' : 'text-xl'}`}>
                Congklak Kayu Jati & Kerang Kuuck bersama Kira
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={resetGame}
                className="flex items-center gap-1 rounded-xl border border-warm-200/20 bg-dusk-900/80 px-2.5 py-1.5 text-xs text-warm-200 hover:border-amber-300/50"
                title="Ulangi Permainan"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {!compact && <span>Main Lagi</span>}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-1.5 text-warm-200/75 hover:bg-warm-100/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Indikator Giliran & Komentar Kira */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300/20 bg-amber-950/30 px-3.5 py-2 text-xs">
            <span className="italic text-amber-100/95">{statusLine}</span>
            {handCount > 0 && (
              <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-dusk-950">
                Di Genggaman: {handCount} kerang
              </span>
            )}
          </div>

          {/* Papan Congklak Kayu Jati Ukiran */}
          <div className="mt-4 rounded-[42px] border-2 border-amber-500/40 bg-gradient-to-b from-[#5e371e] via-[#4a2a16] to-[#381e0f] p-3.5 sm:p-5 shadow-inner">
            <div className="grid grid-cols-7 items-center gap-2 sm:gap-3">
              {/* Lumbung Kira (Kiri - Indeks 11) */}
              <div
                className={`flex h-28 sm:h-36 flex-col items-center justify-center rounded-3xl border-2 bg-[#2b160b]/90 shadow-inner transition ${
                  activePit === 11 ? 'border-amber-300 ring-2 ring-amber-300/50' : 'border-amber-700/50'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300">Kira</span>
                <span className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-warm-50">{pits[11]}</span>
                <span className="text-[9px] text-warm-300/70">kerang</span>
              </div>

              {/* 5 Kolom Tengah (Atas: Kira 10..6, Bawah: Ayah 0..4) */}
              <div className="col-span-5 flex flex-col gap-3 sm:gap-4">
                {/* Baris Atas: Lubang Kira (10 ke 6 dari kiri ke kanan) */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
                  {[10, 9, 8, 7, 6].map((idx) => (
                    <div
                      key={`pit-k-${idx}`}
                      className={`flex h-12 sm:h-16 flex-col items-center justify-center rounded-full border bg-[#2c170c]/85 shadow-inner transition ${
                        activePit === idx
                          ? 'border-rose-300 bg-rose-950/60 scale-105'
                          : 'border-amber-700/45'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-bold text-rose-100">{pits[idx]}</span>
                      <div className="mt-0.5 flex gap-0.5">
                        {Array.from({ length: Math.min(4, pits[idx]) }).map((_, si) => (
                          <span key={si} className="h-1.5 w-1.5 rounded-full bg-amber-100/85" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Label Arah Putaran */}
                <div className="flex items-center justify-between px-2 text-[9px] uppercase tracking-[0.18em] text-amber-200/55">
                  <span>◀ Arah Kira</span>
                  <span>{gameOver ? 'Permainan Selesai' : turn === 'damar' ? 'Giliran Ayah' : 'Giliran Kira...'}</span>
                  <span>Arah Ayah ▶</span>
                </div>

                {/* Baris Bawah: Lubang Ayah / Damar (0 ke 4 dari kiri ke kanan, Bisa Diklik!) */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const clickable = !isAnimating && !gameOver && turn === 'damar' && pits[idx] > 0;
                    return (
                      <button
                        key={`pit-d-${idx}`}
                        type="button"
                        disabled={!clickable}
                        onClick={() => runMove(pits, idx, 'damar')}
                        className={`flex h-12 sm:h-16 flex-col items-center justify-center rounded-full border shadow-inner transition ${
                          activePit === idx
                            ? 'border-amber-200 bg-amber-500/35 scale-105'
                            : clickable
                              ? 'border-amber-300/75 bg-[#361d0f] hover:border-amber-200 hover:bg-amber-800/50 active:scale-95 cursor-pointer'
                              : 'border-amber-800/40 bg-[#25130a]/75 opacity-65'
                        }`}
                      >
                        <span className="text-sm sm:text-base font-bold text-amber-100">{pits[idx]}</span>
                        <div className="mt-0.5 flex gap-0.5">
                          {Array.from({ length: Math.min(4, pits[idx]) }).map((_, si) => (
                            <span key={si} className="h-1.5 w-1.5 rounded-full bg-amber-200" />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lumbung Ayah / Damar (Kanan - Indeks 5) */}
              <div
                className={`flex h-28 sm:h-36 flex-col items-center justify-center rounded-3xl border-2 bg-[#2b160b]/90 shadow-inner transition ${
                  activePit === 5 ? 'border-amber-300 ring-2 ring-amber-300/50' : 'border-amber-600/60'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">Ayah</span>
                <span className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-warm-50">{pits[5]}</span>
                <span className="text-[9px] text-warm-300/70">kerang</span>
              </div>
            </div>
          </div>

          {/* Footer Aturan Singkat */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-warm-200/75">
            <span className="flex items-center gap-1.5">
              {gameOver ? (
                <>
                  <Trophy className="h-3.5 w-3.5 text-amber-300" />
                  <span>Skor Akhir — Ayah {pits[5]} : {pits[11]} Kira</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Jatuh di Lumbung Kanan = Jalan Lagi · Jatuh di Lubang Kosong Sendiri = Tembak Seberang!</span>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-warm-400 px-3.5 py-1.5 text-xs font-semibold text-dusk-950 hover:bg-warm-300"
            >
              Selesai [Esc]
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
