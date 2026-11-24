import React, { useState } from 'react';
import { Home, Keyboard, Play, Save, Sliders, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { GraphicsQuality } from '../../types/game';
import { Portal } from './Portal';

export const PauseSettingsModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isPauseOpen);
  const setPauseOpen = useGameStore((s) => s.setPauseOpen);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const applyGraphicsPreset = useGameStore((s) => s.applyGraphicsPreset);
  const setQuickGraphicsOpen = useGameStore((s) => s.setQuickGraphicsOpen);
  const saveCurrentGame = useGameStore((s) => s.saveCurrentGame);
  const returnToTitle = useGameStore((s) => s.returnToTitle);
  const lastSaveStatus = useGameStore((s) => s.lastSaveStatus);

  const [section, setSection] = useState<'main' | 'settings' | 'controls'>('main');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    sfxEngine.play('chime');
    await saveCurrentGame(false);
    setSaving(false);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-dusk-950/80 p-4 backdrop-blur-md">
        <div className="w-full max-w-lg rounded-2xl border border-warm-200/20 bg-dusk-900/95 p-6 text-warm-50 shadow-2xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-100/10 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-warm-300/80">Menu Jeda</p>
              <h2 className="font-serif text-xl text-warm-50">
                {section === 'main'
                  ? 'LANGKAH PULANG'
                  : section === 'settings'
                    ? 'Pengaturan Audio & Grafis'
                    : 'Panduan Kontrol Laptop'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPauseOpen(false)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {section === 'main' && (
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => setPauseOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl bg-warm-400 px-4 py-3 text-sm font-semibold text-dusk-950 transition hover:bg-warm-300"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Lanjutkan Permainan</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="flex w-full items-center justify-between rounded-xl border border-warm-200/20 bg-dusk-950/60 px-4 py-3 text-sm text-warm-100 transition hover:border-warm-300/50"
              >
                <span className="flex items-center gap-3">
                  <Save className="h-4 w-4 text-warm-300" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Progres Sekarang'}</span>
                </span>
                {lastSaveStatus && <span className="text-[11px] text-warm-300/80">{lastSaveStatus}</span>}
              </button>

              <button
                type="button"
                onClick={() => setSection('settings')}
                className="flex w-full items-center gap-3 rounded-xl border border-warm-200/20 bg-dusk-950/60 px-4 py-3 text-sm text-warm-100 transition hover:border-warm-300/50"
              >
                <Sliders className="h-4 w-4 text-warm-300" />
                <span>Pengaturan Suara, Musik & Grafis</span>
              </button>

              <button
                type="button"
                onClick={() => setSection('controls')}
                className="flex w-full items-center gap-3 rounded-xl border border-warm-200/20 bg-dusk-950/60 px-4 py-3 text-sm text-warm-100 transition hover:border-warm-300/50"
              >
                <Keyboard className="h-4 w-4 text-warm-300" />
                <span>Panduan Kontrol</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await saveCurrentGame(true);
                  returnToTitle();
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-red-400/20 bg-red-950/20 px-4 py-3 text-sm text-red-200 transition hover:bg-red-950/40"
              >
                <Home className="h-4 w-4" />
                <span>Simpan & Kembali ke Layar Judul</span>
              </button>
            </div>
          )}

          {section === 'settings' && (
            <div className="mt-5 space-y-4">
              {/* Volume Sliders */}
              {(
                [
                  { key: 'musicVolume', label: 'Volume Musik & Suasana Kota' },
                  { key: 'voiceVolume', label: 'Volume Suara Bicara Karakter' },
                  { key: 'sfxVolume', label: 'Volume Efek Suara (Langkah & Objek)' },
                ] as const
              ).map((item) => (
                <div key={item.key}>
                  <div className="flex justify-between text-xs text-warm-200">
                    <span>{item.label}</span>
                    <span>{Math.round(settings[item.key] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={settings[item.key]}
                    onChange={(e) => updateSettings({ [item.key]: parseFloat(e.target.value) })}
                    className="mt-1.5 w-full accent-warm-400"
                  />
                </div>
              ))}

              {/* Preset Grafis */}
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-warm-200">Preset Grafis 3D</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPauseOpen(false);
                      setQuickGraphicsOpen(true);
                    }}
                    className="text-[11px] text-warm-300 underline hover:text-warm-100"
                  >
                    Buka Pengaturan Grafis Lanjutan (Live)
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: 'low', label: 'Rendah' },
                      { id: 'medium', label: 'Sedang' },
                      { id: 'high', label: 'Tinggi' },
                      { id: 'ultra', label: 'Ultra' },
                    ] as { id: GraphicsQuality; label: string }[]
                  ).map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => applyGraphicsPreset(q.id)}
                      className={`rounded-xl py-2 text-xs font-medium transition ${
                        settings.graphicsQuality === q.id
                          ? 'bg-warm-400 text-dusk-950'
                          : 'border border-warm-200/20 bg-dusk-950/60 text-warm-200 hover:border-warm-300/45'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-1 text-xs">
                <label className="flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 px-3.5 py-2.5">
                  <span>Aktifkan Suara Bicara Karakter</span>
                  <input
                    type="checkbox"
                    checked={settings.voiceEnabled}
                    onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
                    className="h-4 w-4 accent-warm-400"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 px-3.5 py-2.5">
                  <span>Tampilkan Penunjuk Arah Misi Utama</span>
                  <input
                    type="checkbox"
                    checked={settings.showWaypoint}
                    onChange={(e) => updateSettings({ showWaypoint: e.target.checked })}
                    className="h-4 w-4 accent-warm-400"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 px-3.5 py-2.5">
                  <span>Tampilkan Subtitle Dialog</span>
                  <input
                    type="checkbox"
                    checked={settings.showSubtitles}
                    onChange={(e) => updateSettings({ showSubtitles: e.target.checked })}
                    className="h-4 w-4 accent-warm-400"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 px-3.5 py-2.5">
                  <span>Tampilkan Mini-Map Radar di HUD</span>
                  <input
                    type="checkbox"
                    checked={settings.showMinimap}
                    onChange={(e) => updateSettings({ showMinimap: e.target.checked })}
                    className="h-4 w-4 accent-warm-400"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => setSection('main')}
                className="mt-2 w-full rounded-xl border border-warm-200/25 py-2.5 text-xs text-warm-100 hover:bg-warm-100/10"
              >
                Kembali ke Menu Jeda
              </button>
            </div>
          )}

          {section === 'controls' && (
            <div className="mt-5 space-y-3 text-xs text-warm-200">
              {[
                ['W A S D / Panah', 'Berjalan santai menyusuri rumah dan kota'],
                ['Tahan Shift', 'Berjalan lebih cepat'],
                ['Klik & Geser Mouse', 'Memutar sudut kamera secara halus (nyaman di trackpad)'],
                ['Klik 2x pada Layar 3D', 'Kunci kursor kamera penuh (tekan Esc untuk lepas)'],
                ['Scroll Mouse', 'Mendekatkan atau menjauhkan jarak kamera'],
                ['E', 'Berbicara dengan tokoh, memeriksa benda, atau naik lift Rooftop'],
                ['F', 'Melambaikan tangan menyapa warga sekitar (NPC akan melambai balik!)'],
                ['P', 'Mode Foto Sinematik (kamera bebas & simpan tangkapan layar PNG)'],
                ['M / Tab / J', 'Membuka Peta Kota, Daftar Misi, & Catatan Harian'],
                ['Spasi / Enter / Klik', 'Melanjutkan baris dialog'],
                ['Esc', 'Membuka atau menutup Menu Jeda'],
              ].map(([k, desc]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-4 rounded-lg border border-warm-100/10 bg-dusk-950/55 px-3.5 py-2"
                >
                  <span className="font-semibold text-warm-300">{k}</span>
                  <span className="text-right text-warm-100/80">{desc}</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSection('main')}
                className="mt-3 w-full rounded-xl border border-warm-200/25 py-2.5 text-xs text-warm-100 hover:bg-warm-100/10"
              >
                Kembali ke Menu Jeda
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};
