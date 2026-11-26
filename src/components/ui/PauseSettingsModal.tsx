import React, { useState } from 'react';
import { Home, Keyboard, Play, Save, Sliders, Smartphone, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { GraphicsQuality } from '../../types/game';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

const DESKTOP_CONTROLS: [string, string][] = [
  ['W A S D / Panah', 'Berjalan santai menyusuri rumah dan kota'],
  ['Tahan Shift', 'Berjalan lebih cepat'],
  ['Klik & Geser Mouse', 'Memutar sudut kamera secara halus (nyaman di trackpad)'],
  ['Klik 2x pada Layar 3D', 'Kunci kursor kamera penuh (tekan Esc untuk lepas)'],
  ['Scroll Mouse', 'Mendekatkan atau menjauhkan jarak kamera'],
  ['E', 'Berbicara dengan tokoh, memeriksa benda, atau naik lift Rooftop'],
  ['F', 'Melambaikan tangan menyapa warga sekitar (NPC akan melambai balik!)'],
  ['G', 'Ajak Nadia & Kira jalan sore bersama berkeliling kota (atau antar pulang)'],
  ['T', 'Ajak Nadia & Kira mengobrol santai saat sedang berjalan bersama'],
  ['H', 'Membuka Ponsel Damar (Pesan, Telepon & Suara, Galeri, Nada FM, Catatan)'],
  ['I', 'Membuka Tas Selempang Damar (Inspeksi Kenangan & Beri Hadiah Keluarga)'],
  ['U', 'Buka / lipat Payung Hujan Bening saat sedang hujan di luar ruangan'],
  ['P', 'Mode Foto Sinematik (kamera bebas & simpan tangkapan layar PNG)'],
  ['M / Tab / J', 'Membuka Peta Kota, Daftar Misi, & Catatan Harian'],
  ['Spasi / Enter / Klik', 'Melanjutkan baris dialog'],
  ['Esc', 'Membuka atau menutup Menu Jeda'],
];

const MOBILE_CONTROLS: [string, string][] = [
  ['Joystick Kiri (360°)', 'Berjalan santai; dorong penuh ke tepi untuk otomatis berlari'],
  ['Geser Layar Kanan', 'Memutar sudut kamera bebas ke segala arah dengan halus'],
  ['Cubit 2 Jari (Pinch)', 'Mendekatkan atau menjauhkan jarak kamera dari Damar'],
  ['Tombol Aksi Utama (✦)', 'Berbicara, memeriksa benda, duduk santai, atau naik kendaraan'],
  ['Tombol Lari / Gas', 'Berlari cepat saat jalan kaki, atau klakson / bel saat berkendara'],
  ['Tombol Sapa / Ngobrol', 'Melambaikan tangan ke warga atau ngobrol dengan Nadia & Kira'],
  ['Bar Pintasan Kanan Atas', 'Buka HP Damar, Ajak Keluarga, Tas, Peta, Foto & Pengaturan Grafis'],
  ['Ikon Layar Penuh', 'Mengaktifkan mode fullscreen landscape agar ruang sentuh maksimal'],
];

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
  const { isMobile, isCompactLandscape } = useMobileViewport();

  const [section, setSection] = useState<'main' | 'settings' | 'controls'>('main');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const compact = isMobile || isCompactLandscape;
  const controlList = isMobile ? MOBILE_CONTROLS : DESKTOP_CONTROLS;

  const handleSave = async () => {
    setSaving(true);
    sfxEngine.play('chime');
    await saveCurrentGame(false);
    setSaving(false);
  };

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9997] flex items-center justify-center bg-dusk-950/80 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
      >
        <div
          className={`flex w-full flex-col overflow-hidden rounded-2xl border border-warm-200/20 bg-dusk-900/95 text-warm-50 shadow-2xl animate-fadeIn ${
            compact
              ? 'max-h-[94dvh] max-w-3xl p-3.5'
              : 'max-h-[90vh] max-w-lg p-6'
          }`}
        >
          {/* Header */}
          <div
            className={`flex shrink-0 items-center justify-between border-b border-warm-100/10 ${
              compact ? 'pb-2.5' : 'pb-4'
            }`}
          >
            <div>
              {!compact && <p className="text-[10px] uppercase tracking-[0.2em] text-warm-300/80">Menu Jeda</p>}
              <h2 className={`font-serif text-warm-50 ${compact ? 'text-base leading-tight' : 'text-xl'}`}>
                {section === 'main'
                  ? 'LANGKAH PULANG · Menu Jeda'
                  : section === 'settings'
                    ? 'Pengaturan Audio & Grafis'
                    : isMobile
                      ? 'Panduan Kontrol Layar HP'
                      : 'Panduan Kontrol Laptop'}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              {compact && section !== 'main' && (
                <button
                  type="button"
                  onClick={() => setSection('main')}
                  className="rounded-lg border border-warm-200/25 px-2.5 py-1 text-[11px] text-warm-100 hover:bg-warm-100/10"
                >
                  Kembali
                </button>
              )}
              <button
                type="button"
                onClick={() => setPauseOpen(false)}
                className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto subtle-scroll">
            {section === 'main' && (
              <div className={compact ? 'mt-3 grid grid-cols-2 gap-2.5' : 'mt-5 space-y-2.5'}>
                {/* Kolom Kiri (atau Atas di Desktop): Aksi Utama */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPauseOpen(false)}
                    className={`flex w-full items-center gap-3 rounded-xl bg-warm-400 font-semibold text-dusk-950 transition hover:bg-warm-300 ${
                      compact ? 'px-3.5 py-3 text-xs' : 'px-4 py-3 text-sm'
                    }`}
                  >
                    <Play className="h-4 w-4 fill-current shrink-0" />
                    <span>Lanjutkan Permainan</span>
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSave}
                    className={`flex w-full items-center justify-between rounded-xl border border-warm-200/20 bg-dusk-950/60 text-warm-100 transition hover:border-warm-300/50 ${
                      compact ? 'px-3.5 py-2.5 text-xs' : 'px-4 py-3 text-sm'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Save className="h-4 w-4 shrink-0 text-warm-300" />
                      <span>{saving ? 'Menyimpan...' : 'Simpan Progres Sekarang'}</span>
                    </span>
                    {lastSaveStatus && <span className="text-[10px] text-warm-300/80">{lastSaveStatus}</span>}
                  </button>

                  {compact && (
                    <button
                      type="button"
                      onClick={() => {
                        setPauseOpen(false);
                        setQuickGraphicsOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl border border-emerald-300/25 bg-emerald-950/25 px-3.5 py-2.5 text-xs text-emerald-100 transition hover:border-emerald-300/55"
                    >
                      <Sliders className="h-4 w-4 shrink-0 text-emerald-300" />
                      <span>Grafis Live &amp; Mode 60 FPS</span>
                    </button>
                  )}
                </div>

                {/* Kolom Kanan (atau Bawah di Desktop): Pengaturan, Kontrol & Keluar */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSection('settings')}
                    className={`flex w-full items-center gap-2.5 rounded-xl border border-warm-200/20 bg-dusk-950/60 text-warm-100 transition hover:border-warm-300/50 ${
                      compact ? 'px-3.5 py-2.5 text-xs' : 'px-4 py-3 text-sm'
                    }`}
                  >
                    <Sliders className="h-4 w-4 shrink-0 text-warm-300" />
                    <span>Pengaturan Suara, Musik &amp; Grafis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSection('controls')}
                    className={`flex w-full items-center gap-2.5 rounded-xl border border-warm-200/20 bg-dusk-950/60 text-warm-100 transition hover:border-warm-300/50 ${
                      compact ? 'px-3.5 py-2.5 text-xs' : 'px-4 py-3 text-sm'
                    }`}
                  >
                    {isMobile ? (
                      <Smartphone className="h-4 w-4 shrink-0 text-warm-300" />
                    ) : (
                      <Keyboard className="h-4 w-4 shrink-0 text-warm-300" />
                    )}
                    <span>{isMobile ? 'Panduan Kontrol HP' : 'Panduan Kontrol'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await saveCurrentGame(true);
                      returnToTitle();
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl border border-red-400/20 bg-red-950/20 text-red-200 transition hover:bg-red-950/40 ${
                      compact ? 'px-3.5 py-2.5 text-xs' : 'px-4 py-3 text-sm'
                    }`}
                  >
                    <Home className="h-4 w-4 shrink-0" />
                    <span>Simpan &amp; Kembali ke Layar Judul</span>
                  </button>
                </div>
              </div>
            )}

            {section === 'settings' && (
              <div className={compact ? 'mt-3 grid grid-cols-2 gap-3.5' : 'mt-5 space-y-4'}>
                {/* Kolom Kiri: Volume + Preset Grafis */}
                <div className={compact ? 'space-y-2.5' : 'space-y-4'}>
                  {(
                    [
                      { key: 'musicVolume', label: 'Volume Musik & Suasana Kota' },
                      { key: 'voiceVolume', label: 'Volume Suara Bicara Karakter' },
                      { key: 'sfxVolume', label: 'Volume Efek Suara (Langkah & Objek)' },
                    ] as const
                  ).map((item) => (
                    <div key={item.key}>
                      <div className={`flex justify-between text-warm-200 ${compact ? 'text-[11px]' : 'text-xs'}`}>
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
                        className="mt-1 w-full accent-warm-400"
                      />
                    </div>
                  ))}

                  {/* Sensitivitas Kamera (Mouse & Sentuh Layar HP) */}
                  <div className="rounded-xl border border-warm-300/20 bg-warm-400/5 p-2.5">
                    <div className={`flex items-center justify-between text-warm-200 ${compact ? 'text-[11px]' : 'text-xs'}`}>
                      <span className="font-medium text-warm-100">Sensitivitas Kamera (Mouse &amp; Sentuh)</span>
                      <span className="font-mono font-semibold text-warm-300">
                        {Math.round(settings.mouseSensitivity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.25}
                      max={2.5}
                      step={0.05}
                      value={settings.mouseSensitivity}
                      onChange={(e) => updateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
                      className="mt-1.5 w-full accent-warm-400"
                    />
                    <div className="mt-1.5 grid grid-cols-3 gap-1">
                      {(
                        [
                          { val: 0.6, label: 'Pelan (60%)' },
                          { val: 1.0, label: 'Normal (100%)' },
                          { val: 1.65, label: 'Cepat (165%)' },
                        ] as const
                      ).map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => updateSettings({ mouseSensitivity: preset.val })}
                          className={`rounded-lg py-1 text-[10px] font-medium transition ${
                            Math.abs(settings.mouseSensitivity - preset.val) < 0.06
                              ? 'bg-warm-400 font-semibold text-dusk-950'
                              : 'border border-warm-200/20 bg-dusk-950/60 text-warm-200 hover:border-warm-300/45'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preset Grafis */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-warm-200 ${compact ? 'text-[11px]' : 'text-xs'}`}>Preset Grafis 3D</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPauseOpen(false);
                          setQuickGraphicsOpen(true);
                        }}
                        className="text-[10.5px] text-warm-300 underline hover:text-warm-100"
                      >
                        Grafis Lanjutan (Live)
                      </button>
                    </div>
                    <div className="mt-1.5 grid grid-cols-5 gap-1">
                      {(
                        [
                          { id: 'potato', label: '60 FPS' },
                          { id: 'low', label: 'Hemat' },
                          { id: 'medium', label: 'Sedang' },
                          { id: 'high', label: 'Tinggi' },
                          { id: 'ultra', label: 'Ultra' },
                        ] as { id: GraphicsQuality; label: string }[]
                      ).map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => applyGraphicsPreset(q.id)}
                          className={`rounded-xl py-1.5 text-[10.5px] font-medium transition ${
                            settings.graphicsQuality === q.id
                              ? q.id === 'potato'
                                ? 'bg-emerald-400 font-semibold text-dusk-950'
                                : 'bg-warm-400 text-dusk-950'
                              : 'border border-warm-200/20 bg-dusk-950/60 text-warm-200 hover:border-warm-300/45'
                          }`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Toggles */}
                <div className={`flex flex-col justify-between ${compact ? 'space-y-1.5 text-[11px]' : 'space-y-2.5 pt-1 text-xs'}`}>
                  <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
                    <label className={`flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}>
                      <span>Aktifkan Suara Bicara Karakter</span>
                      <input
                        type="checkbox"
                        checked={settings.voiceEnabled}
                        onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
                        className="h-4 w-4 accent-warm-400"
                      />
                    </label>
                    <label className={`flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}>
                      <span>Penunjuk Arah Misi Utama</span>
                      <input
                        type="checkbox"
                        checked={settings.showWaypoint}
                        onChange={(e) => updateSettings({ showWaypoint: e.target.checked })}
                        className="h-4 w-4 accent-warm-400"
                      />
                    </label>
                    <label className={`flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}>
                      <span>Tampilkan Subtitle Dialog</span>
                      <input
                        type="checkbox"
                        checked={settings.showSubtitles}
                        onChange={(e) => updateSettings({ showSubtitles: e.target.checked })}
                        className="h-4 w-4 accent-warm-400"
                      />
                    </label>
                    <label className={`flex items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-950/50 ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}>
                      <span>Mini-Map Radar di HUD</span>
                      <input
                        type="checkbox"
                        checked={settings.showMinimap}
                        onChange={(e) => updateSettings({ showMinimap: e.target.checked })}
                        className="h-4 w-4 accent-warm-400"
                      />
                    </label>
                    <label className={`flex items-center justify-between rounded-xl border border-emerald-300/15 bg-emerald-950/20 ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2.5'}`}>
                      <span>Indikator FPS &amp; Performa</span>
                      <input
                        type="checkbox"
                        checked={settings.showFps}
                        onChange={(e) => updateSettings({ showFps: e.target.checked })}
                        className="h-4 w-4 accent-emerald-400"
                      />
                    </label>
                  </div>

                  {!compact && (
                    <button
                      type="button"
                      onClick={() => setSection('main')}
                      className="mt-2 w-full rounded-xl border border-warm-200/25 py-2.5 text-xs text-warm-100 hover:bg-warm-100/10"
                    >
                      Kembali ke Menu Jeda
                    </button>
                  )}
                </div>
              </div>
            )}

            {section === 'controls' && (
              <div className={compact ? 'mt-3' : 'mt-5 space-y-3 text-xs text-warm-200'}>
                <div className={compact ? 'grid grid-cols-2 gap-2 text-[11px] text-warm-200' : 'space-y-2.5'}>
                  {controlList.map(([k, desc]) => (
                    <div
                      key={k}
                      className={`flex items-center justify-between gap-3 rounded-lg border border-warm-100/10 bg-dusk-950/55 ${
                        compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
                      }`}
                    >
                      <span className="shrink-0 font-semibold text-warm-300">{k}</span>
                      <span className="text-right text-warm-100/80">{desc}</span>
                    </div>
                  ))}
                </div>
                {!compact && (
                  <button
                    type="button"
                    onClick={() => setSection('main')}
                    className="mt-3 w-full rounded-xl border border-warm-200/25 py-2.5 text-xs text-warm-100 hover:bg-warm-100/10"
                  >
                    Kembali ke Menu Jeda
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};
