import React from 'react';
import { CloudRain, Moon, Sliders, Sparkles, Sun, Sunset, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { useGameStore } from '../../store/useGameStore';
import { GraphicsQuality, ParticleDensity, ShadowQuality, TimeOfDay } from '../../types/game';
import { Portal } from './Portal';

const PRESET_LIST: { id: GraphicsQuality; label: string; desc: string }[] = [
  { id: 'low', label: 'Hemat HP / Anti-Lag', desc: 'Super lancar untuk HP & baterai hemat' },
  { id: 'medium', label: 'Sedang', desc: 'Seimbang untuk HP flagship & laptop' },
  { id: 'high', label: 'Tinggi', desc: 'Bayangan tajam & refleksi penuh (PC)' },
  { id: 'ultra', label: 'Ultra', desc: 'Ketajaman maksimum & sinematik (PC)' },
];

const TIME_PREVIEW_LIST: { id: TimeOfDay; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'morning', label: 'Pagi', icon: Sun },
  { id: 'sunset', label: 'Senja', icon: Sunset },
  { id: 'rain_dusk', label: 'Hujan', icon: CloudRain },
  { id: 'night', label: 'Malam', icon: Moon },
];

export const GraphicsSettingsModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isQuickGraphicsOpen);
  const setOpen = useGameStore((s) => s.setQuickGraphicsOpen);
  const screen = useGameStore((s) => s.screen);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const applyGraphicsPreset = useGameStore((s) => s.applyGraphicsPreset);
  const titlePreviewTime = useGameStore((s) => s.titlePreviewTime);
  const setTitlePreviewTime = useGameStore((s) => s.setTitlePreviewTime);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const setFreeTimeOfDay = useGameStore((s) => s.setFreeTimeOfDay);

  if (!isOpen) return null;

  const activeTime = screen === 'title' ? titlePreviewTime : timeOfDay;

  return (
    <Portal>
      {/* Panel geser kanan dengan latar tipis agar perubahan grafik 3D terlihat LIVE di kiri */}
      <div className="pointer-events-none fixed inset-0 z-[9998] flex justify-end p-4 md:p-6">
        <div className="pointer-events-auto flex h-full max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-warm-200/25 bg-dusk-950/88 text-warm-50 shadow-2xl backdrop-blur-xl animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-100/10 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg text-warm-50">Pengaturan Grafis 3D</h2>
                <p className="text-[11px] text-warm-200/65">
                  Perubahan langsung diterapkan secara real-time
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Konten Scrollable */}
          <div className="flex-1 space-y-5 overflow-y-auto subtle-scroll px-5 py-4 text-xs">
            {/* Preset Cepat */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-warm-300">
                Preset Kualitas
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LIST.map((p) => {
                  const active = settings.graphicsQuality === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        sfxEngine.play('switch');
                        applyGraphicsPreset(p.id);
                      }}
                      className={`rounded-xl border p-2.5 text-left transition ${
                        active
                          ? 'border-warm-300 bg-warm-400/20 text-warm-50'
                          : 'border-warm-100/15 bg-dusk-900/60 text-warm-200/80 hover:border-warm-300/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{p.label}</span>
                        {p.id === 'ultra' && <Sparkles className="h-3.5 w-3.5 text-warm-300" />}
                      </div>
                      <p className="mt-0.5 text-[10px] text-warm-200/60">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Ganti Waktu & Cuaca Kota Bebas (Aktif baik di Layar Judul maupun Saat Bermain!) */}
            <div className="rounded-xl border border-warm-300/20 bg-warm-400/5 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-warm-300">
                {screen === 'title' ? 'Pratinjau Cuaca & Waktu Kota' : 'Mode Ganti Waktu & Cuaca Bebas'}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_PREVIEW_LIST.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (screen === 'title') {
                        sfxEngine.play('switch');
                        setTitlePreviewTime(id);
                      } else {
                        setFreeTimeOfDay(id);
                      }
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] transition ${
                      activeTime === id
                        ? 'bg-warm-400 font-semibold text-dusk-950'
                        : 'bg-dusk-900/75 text-warm-200 hover:bg-dusk-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              {screen === 'playing' && (
                <p className="mt-2 text-[10px] text-warm-200/65">
                  Cocok untuk Mode Foto [P] atau mencoba Payung Hujan Bening [U] kapan saja!
                </p>
              )}
            </div>

            {/* Resolusi Render */}
            <div>
              <div className="flex justify-between text-warm-200">
                <span>Ketajaman Resolusi (Render Scale)</span>
                <span className="font-semibold text-warm-300">
                  {Math.round(settings.resolutionScale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.55}
                max={2.0}
                step={0.05}
                value={settings.resolutionScale}
                onChange={(e) => updateSettings({ resolutionScale: parseFloat(e.target.value) })}
                className="mt-1.5 w-full accent-warm-400"
              />
            </div>

            {/* Kecerahan / Exposure */}
            <div>
              <div className="flex justify-between text-warm-200">
                <span>Kecerahan Sinematik (Exposure)</span>
                <span className="font-semibold text-warm-300">{settings.exposure.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.85}
                max={1.35}
                step={0.05}
                value={settings.exposure}
                onChange={(e) => updateSettings({ exposure: parseFloat(e.target.value) })}
                className="mt-1.5 w-full accent-warm-400"
              />
            </div>

            {/* Intensitas HDR Bloom */}
            <div>
              <div className="flex justify-between text-warm-200">
                <span>Intensitas HDR Bloom (Pendar Film)</span>
                <span className="font-semibold text-warm-300">
                  {Math.round(settings.bloomIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1.4}
                step={0.05}
                value={settings.bloomIntensity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  updateSettings({ bloomIntensity: val, cinematicGlow: val > 0 });
                }}
                className="mt-1.5 w-full accent-warm-400"
              />
            </div>

            {/* Kualitas Bayangan */}
            <div>
              <p className="mb-1.5 text-warm-200">Kualitas Bayangan Real-Time</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'off', label: 'Mati' },
                    { id: 'soft', label: 'Halus' },
                    { id: 'sharp', label: 'Tajam (HD)' },
                  ] as { id: ShadowQuality; label: string }[]
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => updateSettings({ shadowQuality: s.id })}
                    className={`rounded-lg py-2 text-[11px] font-medium transition ${
                      settings.shadowQuality === s.id
                        ? 'bg-warm-400 text-dusk-950'
                        : 'border border-warm-100/15 bg-dusk-900/70 text-warm-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kepadatan Partikel */}
            <div>
              <p className="mb-1.5 text-warm-200">Partikel Cuaca (Hujan, Debu Senja, Kunang-kunang)</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'low', label: 'Ringan' },
                    { id: 'medium', label: 'Sedang' },
                    { id: 'high', label: 'Penuh' },
                  ] as { id: ParticleDensity; label: string }[]
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => updateSettings({ particleDensity: d.id })}
                    className={`rounded-lg py-2 text-[11px] font-medium transition ${
                      settings.particleDensity === d.id
                        ? 'bg-warm-400 text-dusk-950'
                        : 'border border-warm-100/15 bg-dusk-900/70 text-warm-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Jarak Pandang */}
            <div>
              <p className="mb-1.5 text-warm-200">Jarak Pandang Kota (Draw Distance)</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'near', label: 'Dekat' },
                    { id: 'medium', label: 'Sedang' },
                    { id: 'far', label: 'Jauh' },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => updateSettings({ drawDistance: d.id })}
                    className={`rounded-lg py-2 text-[11px] font-medium transition ${
                      settings.drawDistance === d.id
                        ? 'bg-warm-400 text-dusk-950'
                        : 'border border-warm-100/15 bg-dusk-900/70 text-warm-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sakelar Efek Visual */}
            <div className="space-y-2 pt-1">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-900/65 px-3.5 py-2.5">
                <span>Pendar Cahaya Lampu & Matahari (Cinematic Glow)</span>
                <input
                  type="checkbox"
                  checked={settings.cinematicGlow}
                  onChange={(e) => updateSettings({ cinematicGlow: e.target.checked })}
                  className="h-4 w-4 accent-warm-400"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-warm-100/10 bg-dusk-900/65 px-3.5 py-2.5">
                <span>Refleksi Sungai, Danau & Aspal Basah</span>
                <input
                  type="checkbox"
                  checked={settings.waterReflections}
                  onChange={(e) => updateSettings({ waterReflections: e.target.checked })}
                  className="h-4 w-4 accent-warm-400"
                />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-warm-100/10 px-5 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-warm-400 py-2.5 text-xs font-semibold text-dusk-950 transition hover:bg-warm-300"
            >
              Selesai & Terapkan
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
