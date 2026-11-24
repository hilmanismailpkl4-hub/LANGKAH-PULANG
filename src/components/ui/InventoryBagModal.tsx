import React, { useMemo, useState } from 'react';
import { Backpack, Gift, Navigation, Sparkles, Volume2, Waves, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import { ALL_BAG_ITEMS, BagItemDef } from '../../data/bagItems';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const ItemArtwork: React.FC<{ iconType: BagItemDef['iconType']; large?: boolean }> = ({
  iconType,
  large = false,
}) => {
  const cls = large ? 'h-28 w-28' : 'h-11 w-11';
  switch (iconType) {
    case 'wallet':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="10" y="18" width="60" height="44" rx="8" fill="#5c3d28" stroke="#c99a6b" strokeWidth="2" />
          <rect x="44" y="32" width="26" height="16" rx="4" fill="#3e281a" />
          <circle cx="53" cy="40" r="3" fill="#e7b87d" />
          <rect x="17" y="25" width="22" height="28" rx="3" fill="#f7eedd" />
          <circle cx="28" cy="34" r="5" fill="#d9aa86" />
          <rect x="21" y="40" width="14" height="10" rx="3" fill="#4a647d" />
        </svg>
      );
    case 'keys':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <circle cx="28" cy="30" r="11" fill="none" stroke="#d4dbe3" strokeWidth="4" />
          <path d="M36 38 L58 60 M52 54 L58 48 M46 48 L52 42" stroke="#d4dbe3" strokeWidth="4" strokeLinecap="round" />
          <polygon points="55,14 58,22 67,22 60,27 62,36 55,31 48,36 50,27 43,22 52,22" fill="#f5c64c" />
        </svg>
      );
    case 'pick':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <path d="M40 12 C62 12 66 36 40 68 C14 36 18 12 40 12 Z" fill="#8f5129" stroke="#f0be7a" strokeWidth="2.5" />
          <text x="40" y="41" textAnchor="middle" fill="#fce8c5" fontSize="16" fontFamily="Georgia, serif" fontWeight="bold">
            DP
          </text>
        </svg>
      );
    case 'notebook':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="16" y="10" width="48" height="60" rx="5" fill="#6b442b" stroke="#d9a566" strokeWidth="2" />
          <rect x="22" y="10" width="6" height="60" fill="#472c1b" />
          <line x1="33" y1="28" x2="56" y2="28" stroke="#f5dfba" strokeWidth="2" />
          <line x1="33" y1="38" x2="56" y2="38" stroke="#f5dfba" strokeWidth="2" />
          <line x1="33" y1="48" x2="48" y2="48" stroke="#f5dfba" strokeWidth="2" />
        </svg>
      );
    case 'icecream':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <circle cx="30" cy="28" r="14" fill="#f48ca3" />
          <polygon points="18,34 42,34 30,66" fill="#d9a362" />
          <rect x="48" y="24" width="20" height="40" rx="4" fill="#3a7ab8" stroke="#a6d2fa" strokeWidth="2" />
          <circle cx="58" cy="36" r="5" fill="#77c3ff" />
          <circle cx="58" cy="50" r="5" fill="#ffd166" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <path d="M40 70 Q38 48 42 32" stroke="#4d8c57" strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="52" rx="9" ry="4" fill="#5da366" transform="rotate(-25 32 52)" />
          <circle cx="42" cy="22" r="8" fill="#fffaf0" />
          <circle cx="50" cy="30" r="8" fill="#fffaf0" />
          <circle cx="34" cy="30" r="8" fill="#fffaf0" />
          <circle cx="42" cy="36" r="8" fill="#fffaf0" />
          <circle cx="42" cy="29" r="5" fill="#f5c64c" />
        </svg>
      );
    case 'ginger':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="16" y="24" width="48" height="42" rx="10" fill="#7a4e2d" stroke="#e0ad6e" strokeWidth="2" />
          <path d="M26 24 L32 14 L48 14 L54 24" fill="#a86d3b" />
          <circle cx="35" cy="46" r="8" fill="#c95b42" />
          <circle cx="46" cy="48" r="7" fill="#d97a54" />
          <circle cx="41" cy="39" r="6" fill="#e09a63" />
        </svg>
      );
    case 'capo':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <path d="M20 26 L60 26 L60 36 L34 36 L44 62 L33 65 L20 36 Z" fill="#2c3340" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="24" y="29" width="32" height="5" rx="2" fill="#e7b87d" />
          <circle cx="28" cy="36" r="4" fill="#94a3b8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="16" y="16" width="48" height="48" rx="10" fill="#2c374a" stroke="#e7b87d" strokeWidth="2" />
          <circle cx="40" cy="40" r="12" fill="#e7b87d" opacity="0.85" />
        </svg>
      );
  }
};

export const InventoryBagModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isBagOpen);
  const setBagOpen = useGameStore((s) => s.setBagOpen);
  const flags = useGameStore((s) => s.flags);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const startDialogue = useGameStore((s) => s.startDialogue);
  const setCustomWaypoint = useGameStore((s) => s.setCustomWaypoint);

  const [filter, setFilter] = useState<'all' | 'kenangan' | 'hadiah' | 'misi'>('all');
  const [selectedId, setSelectedId] = useState<string>('item_wallet_photo');

  const ownedItems = useMemo(() => {
    const owned: BagItemDef[] = [];
    const has = (id: string) => {
      const def = ALL_BAG_ITEMS.find((x) => x.id === id);
      if (def) owned.push(def);
    };

    // Selalu dibawa Damar
    has('item_wallet_photo');
    has('item_house_keys');

    if (flags.includes('kept_guitar_pick')) has('item_guitar_pick');
    if (flags.includes('found_rooftop_notebook') || discoveredEasterEggs.includes('ee_buku_rooftop')) {
      has('item_rooftop_notebook');
    }

    // Hadiah kejutan untuk keluarga (hilang dari tas setelah diberikan)
    if (flags.includes('has_gift_kira') && !flags.includes('gave_gift_kira')) {
      has('item_gift_kira');
    }
    if (flags.includes('has_gift_nadia') && !flags.includes('gave_gift_nadia')) {
      has('item_gift_nadia');
    }

    // Barang titipan misi sampingan aktif
    if (flags.includes('has_darman_bookmark') && sideQuests.sq_pak_darman?.status !== 'completed') {
      has('item_darman_bookmark');
    }
    if (flags.includes('has_nenek_tea') && sideQuests.sq_nenek_sari?.status !== 'completed') {
      has('item_nenek_tea');
    }
    if (flags.includes('has_raka_coffee') && sideQuests.sq_mas_raka?.status !== 'completed') {
      has('item_raka_coffee');
    }
    if (flags.includes('has_bagas_key') && sideQuests.sq_mas_bagas?.status !== 'completed') {
      has('item_bagas_key');
    }
    if (flags.includes('has_lilis_book') && sideQuests.sq_mbak_lilis?.status !== 'completed') {
      has('item_lilis_book');
    }
    if (flags.includes('has_slamet_ginger') && sideQuests.sq_pak_slamet?.status !== 'completed') {
      has('item_slamet_ginger');
    }
    if (flags.includes('has_ari_capo') && sideQuests.sq_bang_ari?.status !== 'completed') {
      has('item_ari_capo');
    }

    return owned;
  }, [flags, sideQuests, discoveredEasterEggs]);

  if (!isOpen) return null;

  const filtered = filter === 'all' ? ownedItems : ownedItems.filter((i) => i.category === filter);
  const selected = ownedItems.find((i) => i.id === selectedId) ?? ownedItems[0];

  const [px, py, pz] = playerRuntime.position;
  const distKira = py > 10 ? 999 : Math.round(Math.hypot(px - -18.7, pz - 65.0));
  const distNadia = py > 10 ? 999 : Math.round(Math.hypot(px - -16.2, pz - 66.2));

  // Deteksi suasana suara spasial 3D aktif di sekitar Damar
  const activeSoundTags: string[] = [];
  if (py > 14) activeSoundTags.push('Angin Ketinggian Rooftop');
  else {
    if (Math.min(Math.abs(px - -48), Math.hypot(px - -84, pz - -28) - 10) < 24) {
      activeSoundTags.push('Gemericik Air Sungai & Danau');
    }
    if (Math.hypot(px - -20, pz - 20.5) < 16) activeSoundTags.push('Uap Espresso Kedai Bima');
    if (Math.hypot(px - 94.3, pz - playerRuntime.trainZ) < 44) activeSoundTags.push('Dengung Kereta Komuter');
    if (px < -56 || (pz > 46 && px > -36 && px < 46)) activeSoundTags.push('Suasana Alam & Lingkungan');
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 p-4 backdrop-blur-md"
        onClick={() => setBagOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-warm-300/25 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-100/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300">
                <Backpack className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-warm-50">Tas Selempang Damar</h2>
                <p className="text-xs text-warm-200/65">
                  {ownedItems.length} benda tersimpan · Periksa kenangan & berikan hadiah kecil ke keluarga
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBagOpen(false)}
              className="rounded-lg p-1.5 text-warm-200/70 hover:bg-warm-100/10 hover:text-warm-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Konten 2 Kolom */}
          <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-12">
            {/* Kolom Kiri: Daftar Benda */}
            <div className="flex flex-col border-b border-warm-100/10 md:col-span-5 md:border-b-0 md:border-r">
              <div className="flex gap-1.5 border-b border-warm-100/10 px-4 py-3 text-[11px]">
                {(
                  [
                    { id: 'all', label: 'Semua' },
                    { id: 'kenangan', label: 'Kenangan' },
                    { id: 'hadiah', label: 'Hadiah' },
                    { id: 'misi', label: 'Titipan' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      filter === f.id
                        ? 'bg-warm-400 font-semibold text-dusk-950'
                        : 'bg-dusk-950/60 text-warm-200/75 hover:text-warm-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto subtle-scroll p-4">
                {filtered.length === 0 ? (
                  <p className="py-8 text-center text-xs text-warm-200/55">
                    Belum ada benda pada kategori ini. Jelajahi Kios Harmoni & tepi Taman Kota untuk mencari hadiah kecil bagi keluarga!
                  </p>
                ) : (
                  filtered.map((item) => {
                    const active = selected?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          sfxEngine.play('interact');
                          setSelectedId(item.id);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                          active
                            ? 'border-warm-300/60 bg-warm-400/15'
                            : 'border-warm-100/10 bg-dusk-950/60 hover:border-warm-200/30'
                        }`}
                      >
                        <div className="shrink-0">
                          <ItemArtwork iconType={item.iconType} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-warm-50">{item.name}</p>
                          <p className="truncate text-[11px] text-warm-200/60">{item.subtitle}</p>
                        </div>
                        {item.category === 'hadiah' && (
                          <Gift className="h-4 w-4 shrink-0 text-pink-300" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kolom Kanan: Inspeksi Detail Benda */}
            <div className="flex flex-col justify-between overflow-y-auto subtle-scroll p-6 md:col-span-7">
              {selected && (
                <div className="space-y-5">
                  <div className="flex flex-col items-center rounded-2xl border border-warm-200/15 bg-gradient-to-b from-dusk-950/90 to-dusk-900/60 py-6">
                    <ItemArtwork iconType={selected.iconType} large />
                    <span className="mt-3 rounded-full bg-warm-400/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                      {selected.category === 'hadiah'
                        ? 'Hadiah untuk Keluarga'
                        : selected.category === 'misi'
                          ? 'Titipan Warga Kota'
                          : 'Benda Kenangan'}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-warm-50 text-center px-4">
                      {selected.name}
                    </h3>
                    <p className="text-xs text-warm-200/65">{selected.subtitle}</p>
                  </div>

                  <p className="text-sm leading-relaxed text-warm-100/85">{selected.description}</p>

                  <div className="rounded-xl border border-warm-200/15 bg-dusk-950/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-warm-300">
                        <Sparkles className="h-3.5 w-3.5" /> Batin Damar
                      </span>
                      <button
                        type="button"
                        onClick={() => voiceManager.speak(`bag_${selected.id}`, 'damar_batin', selected.monologue)}
                        className="flex items-center gap-1 rounded-lg bg-warm-400/15 px-2.5 py-1 text-[11px] text-warm-200 hover:bg-warm-400/25"
                      >
                        <Volume2 className="h-3 w-3" /> Dengarkan
                      </button>
                    </div>
                    <p className="mt-2 font-serif italic text-sm leading-relaxed text-warm-100/90">
                      "{selected.monologue}"
                    </p>
                  </div>

                  {/* Aksi Pemberian Hadiah ke Kira atau Nadia */}
                  {selected.giftTarget && selected.giftDialogueId && (
                    <div className="rounded-xl border border-pink-300/25 bg-pink-950/20 p-4">
                      {((selected.giftTarget === 'kira' && distKira <= 5.5) ||
                        (selected.giftTarget === 'nadia' && distNadia <= 5.5)) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue(selected.giftDialogueId!);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-warm-400 py-3 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-warm-300"
                        >
                          <Gift className="h-4 w-4" />
                          <span>
                            Berikan Sekarang kepada {selected.giftTarget === 'kira' ? 'Kira' : 'Nadia'}!
                          </span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-warm-200/80">
                            Pulang ke Rumah Jl. Melati No. 14 ({selected.giftTarget === 'kira' ? distKira : distNadia} m lagi) untuk memberikannya kepada{' '}
                            <strong>{selected.giftTarget === 'kira' ? 'Kira' : 'Nadia'}</strong>.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomWaypoint({
                                label: 'Rumah Keluarga Damar',
                                position: [-18.0, 0.08, 65.5],
                              });
                              setBagOpen(false);
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 font-semibold text-dusk-950 hover:bg-cyan-300"
                          >
                            <Navigation className="h-3 w-3" /> Pasang GPS Pulang
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Indikator Audio Lingkungan Spasial 3D */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-warm-100/10 pt-3 text-[11px] text-warm-200/60">
                <span className="flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-warm-300" />
                  <span>Audio Spasial 3D Aktif:</span>
                </span>
                <span className="text-warm-200/85">
                  {activeSoundTags.length > 0 ? activeSoundTags.join(' · ') : 'Suasana Jalanan Kota'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
