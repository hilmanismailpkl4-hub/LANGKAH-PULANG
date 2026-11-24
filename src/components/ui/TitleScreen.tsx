import React, { useEffect, useState } from 'react';
import { BookOpen, Cloud, CloudOff, Play, Sparkles, Trash2, User as UserIcon, X } from 'lucide-react';
import { unlockAudio } from '../../audio/audioContext';
import { musicEngine } from '../../audio/musicEngine';
import { sfxEngine } from '../../audio/sfxEngine';
import { EASTER_EGGS } from '../../data/easterEggs';
import { ENDINGS } from '../../data/endings';
import {
  getCurrentCloudUser,
  isCloudEnabled,
  signInCloud,
  signOutCloud,
  signUpCloud,
} from '../../services/supabase';
import { useGameStore } from '../../store/useGameStore';
import { EndingId } from '../../types/game';
import { Portal } from './Portal';

const SLOT_IDS = ['slot_1', 'slot_2', 'slot_3'];

function formatPlayTime(sec: number): string {
  const mins = Math.floor(sec / 60);
  if (mins < 60) return `${mins} mnt`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs} jam ${rem} mnt`;
}

export const TitleScreen: React.FC = () => {
  const screen = useGameStore((s) => s.screen);
  const slots = useGameStore((s) => s.slots);
  const unlockedEndings = useGameStore((s) => s.unlockedEndings);
  const cloudUserEmail = useGameStore((s) => s.cloudUserEmail);
  const startNewSlot = useGameStore((s) => s.startNewSlot);
  const loadSlot = useGameStore((s) => s.loadSlot);
  const deleteSlot = useGameStore((s) => s.deleteSlot);
  const setCloudUserEmail = useGameStore((s) => s.setCloudUserEmail);
  const refreshSlotsFromCloud = useGameStore((s) => s.refreshSlotsFromCloud);

  const [showSlotPanel, setShowSlotPanel] = useState(false);
  const [creatingSlotId, setCreatingSlotId] = useState<string | null>(null);
  const [journalInput, setJournalInput] = useState('');
  const [showEndingsModal, setShowEndingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const cloudReady = isCloudEnabled();

  useEffect(() => {
    if (!cloudReady) return;
    getCurrentCloudUser().then((u) => {
      if (u?.email) {
        setCloudUserEmail(u.email);
        void refreshSlotsFromCloud();
      }
    });
  }, [cloudReady, setCloudUserEmail, refreshSlotsFromCloud]);

  if (screen !== 'title') return null;

  const existingSlots = SLOT_IDS.map((id) => slots[id]).filter(Boolean);
  const latestSlot = existingSlots.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0];

  const handleStartInteraction = () => {
    unlockAudio();
    musicEngine.start();
    musicEngine.setContext('title', 'sunset');
    sfxEngine.play('interact');
  };

  const handleCreateSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingSlotId) return;
    unlockAudio();
    sfxEngine.play('chime');
    await startNewSlot(creatingSlotId, journalInput.trim() || 'Catatan Langkahku');
    setCreatingSlotId(null);
    setJournalInput('');
    setShowSlotPanel(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthFeedback(null);
    if (authMode === 'login') {
      const res = await signInCloud(email.trim(), password);
      if (res.error) {
        setAuthFeedback(res.error);
      } else if (res.user?.email) {
        setCloudUserEmail(res.user.email);
        await refreshSlotsFromCloud();
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
      }
    } else {
      const res = await signUpCloud(email.trim(), password);
      if (res.error) {
        setAuthFeedback(res.error);
      } else if (res.info) {
        setAuthFeedback(res.info);
      } else if (res.user?.email) {
        setCloudUserEmail(res.user.email);
        await refreshSlotsFromCloud();
        setShowAuthModal(false);
      }
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await signOutCloud();
    setCloudUserEmail(null);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9992] flex flex-col justify-between bg-gradient-to-t from-dusk-950/92 via-dusk-950/55 to-dusk-950/45 p-8 md:p-14 text-warm-50"
        onClick={() => {
          unlockAudio();
          musicEngine.start();
        }}
      >
        {/* Baris Atas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-warm-200/80">
            <span className="h-2 w-2 rounded-full bg-warm-400 animate-gentlePulse" />
            <span>Cerita Solo 3D · Laptop & Desktop</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                handleStartInteraction();
                setShowEndingsModal(true);
              }}
              className="flex items-center gap-2 rounded-full border border-warm-200/20 bg-dusk-900/70 px-4 py-2 text-xs text-warm-100 backdrop-blur-md transition hover:border-warm-300/50 hover:bg-dusk-800/80"
            >
              <Sparkles className="h-3.5 w-3.5 text-warm-300" />
              <span>Akhir Cerita ({unlockedEndings.length}/4)</span>
            </button>

            {cloudReady ? (
              cloudUserEmail ? (
                <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-dusk-900/75 px-3.5 py-2 text-xs text-emerald-200 backdrop-blur-md">
                  <Cloud className="h-3.5 w-3.5" />
                  <span className="max-w-[150px] truncate">{cloudUserEmail}</span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="ml-1 text-warm-200/70 underline hover:text-warm-50"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleStartInteraction();
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-2 rounded-full border border-warm-200/20 bg-dusk-900/70 px-4 py-2 text-xs text-warm-100 backdrop-blur-md transition hover:border-warm-300/50"
                >
                  <UserIcon className="h-3.5 w-3.5 text-warm-300" />
                  <span>Sinkronisasi Akun</span>
                </button>
              )
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-warm-200/15 bg-dusk-900/60 px-3.5 py-2 text-xs text-warm-200/75 backdrop-blur-md">
                <CloudOff className="h-3.5 w-3.5 text-warm-300/70" />
                <span>Penyimpanan Lokal Aktif</span>
              </div>
            )}
          </div>
        </div>

        {/* Bagian Tengah: Judul Sinematik */}
        <div className="max-w-2xl space-y-6 animate-fadeIn">
          <div className="space-y-3">
            <p className="font-serif italic text-warm-300/95 text-base md:text-lg tracking-wide">
              Steps Home
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-warm-50 drop-shadow-lg">
              LANGKAH PULANG
            </h1>
            <p className="max-w-xl text-sm md:text-base leading-relaxed text-warm-100/80">
              Kisah tentang Damar Pratama—seorang ayah muda yang berjalan menyusuri kota modern demi
              menemukan kembali kejujuran, jati diri, dan arti sebuah rumah yang menunggunya pulang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {latestSlot && (
              <button
                type="button"
                onClick={() => {
                  handleStartInteraction();
                  loadSlot(latestSlot.slotId);
                }}
                className="flex items-center gap-3 rounded-xl bg-warm-400 px-6 py-3.5 text-sm font-semibold text-dusk-950 shadow-lg shadow-warm-500/20 transition hover:bg-warm-300"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Lanjutkan · {latestSlot.journalName} (Bab {latestSlot.chapter})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                handleStartInteraction();
                setShowSlotPanel(true);
              }}
              className={`flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-medium transition backdrop-blur-md ${
                latestSlot
                  ? 'border border-warm-200/30 bg-dusk-900/70 text-warm-50 hover:border-warm-300/60 hover:bg-dusk-800/80'
                  : 'bg-warm-400 text-dusk-950 font-semibold shadow-lg shadow-warm-500/20 hover:bg-warm-300'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>{latestSlot ? 'Pilih / Buat Arsip Cerita' : 'Mulai Perjalanan'}</span>
            </button>
          </div>
        </div>

        {/* Baris Bawah: Panduan Kontrol Ringkas */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-warm-100/10 pt-5 text-xs text-warm-200/70">
          <div className="flex flex-wrap items-center gap-5">
            <span>
              <strong className="text-warm-100">WASD</strong> Berjalan
            </span>
            <span>
              <strong className="text-warm-100">Shift</strong> Jalan Cepat
            </span>
            <span>
              <strong className="text-warm-100">Mouse Drag / Klik 2x</strong> Kamera
            </span>
            <span>
              <strong className="text-warm-100">E</strong> Bicara & Periksa
            </span>
            <span>
              <strong className="text-warm-100">M / Tab</strong> Peta & Catatan
            </span>
          </div>
          <span className="font-serif italic text-warm-200/60">
            Disarankan menggunakan headphone untuk suasana paling hangat.
          </span>
        </div>

        {/* MODAL PILIH / BUAT SAVE SLOT (CUSTOM NAMA CATATAN HARIAN) */}
        {showSlotPanel && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-dusk-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-2xl border border-warm-200/20 bg-dusk-900/95 p-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-warm-100/10 pb-4">
                <div>
                  <h2 className="font-serif text-xl text-warm-50">Arsip Catatan Harian</h2>
                  <p className="mt-0.5 text-xs text-warm-200/70">
                    Nama arsip dapat disesuaikan. Nama tokoh cerita (Damar, Nadia, Kira) tetap konsisten demi akting suara.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSlotPanel(false);
                    setCreatingSlotId(null);
                  }}
                  className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {creatingSlotId ? (
                <form onSubmit={handleCreateSlotSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-warm-300">
                      Nama Profil / Catatan Harian
                    </label>
                    <input
                      type="text"
                      maxLength={48}
                      autoFocus
                      value={journalInput}
                      onChange={(e) => setJournalInput(e.target.value)}
                      placeholder="Misal: Catatan Harian Senja, Arsip Budi, Langkah Pertama..."
                      className="mt-2 w-full rounded-xl border border-warm-200/25 bg-dusk-950/90 px-4 py-3 text-sm text-warm-50 placeholder-warm-200/35 focus:border-warm-400 focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-warm-200/60">
                      Judul ini akan tampil di sampul Catatan Harian milikmu dan riwayat perjalanan.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setCreatingSlotId(null)}
                      className="rounded-xl border border-warm-200/20 px-4 py-2.5 text-xs text-warm-200 hover:bg-warm-100/5"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-warm-400 px-5 py-2.5 text-xs font-semibold text-dusk-950 hover:bg-warm-300"
                    >
                      Mulai Bab 1
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-5 space-y-3">
                  {SLOT_IDS.map((slotId, index) => {
                    const data = slots[slotId];
                    return (
                      <div
                        key={slotId}
                        className="flex items-center justify-between gap-4 rounded-xl border border-warm-200/15 bg-dusk-950/65 p-4 transition hover:border-warm-300/35"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-warm-400/15 px-2 py-0.5 text-[11px] font-medium text-warm-300">
                              Slot {index + 1}
                            </span>
                            <h3 className="truncate font-serif text-base text-warm-50">
                              {data ? data.journalName : 'Arsip Kosong'}
                            </h3>
                          </div>
                          {data ? (
                            <p className="mt-1 text-xs text-warm-200/65">
                              Bab {data.chapter} · {formatPlayTime(data.playTimeSeconds)} ·{' '}
                              {data.discoveredEasterEggs.length}/{EASTER_EGGS.length} Fragmen Memori
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-warm-200/45">
                              Belum ada perjalanan tersimpan di slot ini.
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {data ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  sfxEngine.play('interact');
                                  loadSlot(slotId);
                                }}
                                className="rounded-lg bg-warm-400 px-4 py-2 text-xs font-semibold text-dusk-950 hover:bg-warm-300"
                              >
                                Lanjutkan
                              </button>
                              <button
                                type="button"
                                title="Hapus arsip"
                                onClick={() => void deleteSlot(slotId)}
                                className="rounded-lg border border-red-400/25 p-2 text-red-300/80 hover:bg-red-500/15"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setCreatingSlotId(slotId);
                                setJournalInput('');
                              }}
                              className="rounded-lg border border-warm-300/40 bg-warm-400/15 px-4 py-2 text-xs font-medium text-warm-200 hover:bg-warm-400/25"
                            >
                              Buat Baru
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL GALERI ENDING */}
        {showEndingsModal && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-dusk-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-2xl rounded-2xl border border-warm-200/20 bg-dusk-900/95 p-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-warm-100/10 pb-4">
                <div>
                  <h2 className="font-serif text-xl text-warm-50">4 Akhir Perjalanan</h2>
                  <p className="mt-0.5 text-xs text-warm-200/70">
                    Setiap pilihan kejujuran, kepedulian pada warga kota, dan kenangan yang kamu temukan membentuk akhir kisah Damar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEndingsModal(false)}
                  className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(['good', 'true', 'bad', 'secret'] as EndingId[]).map((eid) => {
                  const def = ENDINGS[eid];
                  const unlocked = unlockedEndings.includes(eid);
                  return (
                    <div
                      key={eid}
                      className={`rounded-xl border p-4 ${
                        unlocked
                          ? 'border-warm-300/35 bg-dusk-950/70'
                          : 'border-warm-100/10 bg-dusk-950/40 opacity-75'
                      }`}
                    >
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: unlocked ? def.accentColor : '#8892a4' }}
                      >
                        {def.label}
                      </span>
                      <h3 className="mt-1 font-serif text-base text-warm-50">
                        {unlocked ? def.title : '??? (Belum Terbuka)'}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-warm-200/65">
                        {unlocked ? def.subtitle : def.unlockHint}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL AKUN CLOUD OPSIONAL */}
        {showAuthModal && cloudReady && (
          <div className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md rounded-2xl border border-warm-200/20 bg-dusk-900/95 p-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-warm-100/10 pb-3.5">
                <h2 className="font-serif text-lg text-warm-50">
                  {authMode === 'login' ? 'Masuk Sinkronisasi Akun' : 'Daftar Akun Baru'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="rounded-lg p-1 text-warm-200/70 hover:bg-warm-100/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-xs text-warm-200/70">
                Masuk untuk menyinkronkan progres ceritamu lintas perangkat. Kamu juga tetap bisa bermain penuh secara offline tanpa akun.
              </p>
              <form onSubmit={handleAuthSubmit} className="mt-4 space-y-3.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Alamat email"
                  className="w-full rounded-xl border border-warm-200/20 bg-dusk-950 px-3.5 py-2.5 text-sm text-warm-50 focus:border-warm-400 focus:outline-none"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi (minimal 6 karakter)"
                  className="w-full rounded-xl border border-warm-200/20 bg-dusk-950 px-3.5 py-2.5 text-sm text-warm-50 focus:border-warm-400 focus:outline-none"
                />
                {authFeedback && <p className="text-xs text-warm-300">{authFeedback}</p>}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-xl bg-warm-400 py-2.5 text-sm font-semibold text-dusk-950 hover:bg-warm-300 disabled:opacity-60"
                >
                  {authLoading ? 'Memproses...' : authMode === 'login' ? 'Masuk' : 'Buat Akun'}
                </button>
              </form>
              <div className="mt-4 text-center text-xs text-warm-200/70">
                {authMode === 'login' ? (
                  <button type="button" onClick={() => setAuthMode('register')} className="underline hover:text-warm-100">
                    Belum punya akun? Daftar di sini
                  </button>
                ) : (
                  <button type="button" onClick={() => setAuthMode('login')} className="underline hover:text-warm-100">
                    Sudah punya akun? Masuk di sini
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Portal>
  );
};
