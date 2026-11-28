import React, { useMemo, useState } from 'react';
import { Backpack, Gift, Navigation, Play, Sparkles, Volume2, Waves, X } from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import { ALL_BAG_ITEMS, BagItemDef } from '../../data/bagItems';
import { playerRuntime } from '../../store/playerRuntime';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
import { Portal } from './Portal';

const ItemArtwork: React.FC<{ iconType: BagItemDef['iconType']; size?: 'sm' | 'md' | 'lg' }> = ({
  iconType,
  size = 'sm',
}) => {
  const cls = size === 'lg' ? 'h-28 w-28' : size === 'md' ? 'h-16 w-16' : 'h-10 w-10';
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
    case 'cassette_1997':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="10" y="20" width="60" height="40" rx="5" fill="#4e3222" stroke="#e5b578" strokeWidth="2" />
          <rect x="15" y="24" width="50" height="19" rx="2.5" fill="#f5e6c8" />
          <line x1="18" y1="29" x2="62" y2="29" stroke="#3b5b8c" strokeWidth="1.5" opacity="0.75" />
          <rect x="21" y="34" width="38" height="12" rx="6" fill="#2a1a12" stroke="#c8965e" strokeWidth="1.2" />
          <circle cx="29" cy="40" r="4.2" fill="#f5e6c8" />
          <circle cx="29" cy="40" r="1.8" fill="#2a1a12" />
          <circle cx="51" cy="40" r="4.2" fill="#f5e6c8" />
          <circle cx="51" cy="40" r="1.8" fill="#2a1a12" />
          <polygon points="22,60 26,51 54,51 58,60" fill="#382216" stroke="#c8965e" strokeWidth="1.2" />
          <text x="40" y="28.5" textAnchor="middle" fill="#2c446e" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
            NOV 1997
          </text>
        </svg>
      );
    case 'draft_letter':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="17" y="10" width="46" height="60" rx="3" fill="#f7eedb" stroke="#c8a97e" strokeWidth="2" />
          <line x1="17" y1="40" x2="63" y2="40" stroke="#e2d2b5" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="24" y1="22" x2="54" y2="22" stroke="#64748b" strokeWidth="2" />
          <line x1="23" y1="22" x2="55" y2="22" stroke="#2563eb" strokeWidth="1.8" />
          <line x1="24" y1="31" x2="56" y2="31" stroke="#94a3b8" strokeWidth="1.6" />
          <path d="M24 49 Q34 46 44 50 T56 48" stroke="#1d4ed8" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M24 58 Q32 55 48 58" stroke="#1d4ed8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'sewing_letter':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <circle cx="34" cy="42" r="22" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="2" />
          <circle cx="34" cy="42" r="17" fill="none" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="30" y="16" width="38" height="28" rx="3" fill="#dbeafe" stroke="#60a5fa" strokeWidth="1.8" />
          <path d="M31 18 L49 31 L67 18" fill="none" stroke="#3b82f6" strokeWidth="1.6" />
          <circle cx="52" cy="54" r="6" fill="#fffaf0" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="50.5" cy="52.5" r="1" fill="#64748b" />
          <circle cx="53.5" cy="55.5" r="1" fill="#64748b" />
          <circle cx="63" cy="49" r="5" fill="#fffaf0" stroke="#cbd5e1" strokeWidth="1.5" />
        </svg>
      );
    case 'paddy_seed':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <path d="M22 30 Q40 20 58 30 L54 64 Q40 70 26 64 Z" fill="#d6c3a5" stroke="#92734b" strokeWidth="2" />
          <path d="M26 32 Q40 36 54 32" stroke="#3b82f6" strokeWidth="2.5" fill="none" />
          <path d="M40 56 Q38 34 48 16" stroke="#65a30d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="45" cy="24" rx="4" ry="2.2" fill="#eab308" transform="rotate(-30 45 24)" />
          <ellipse cx="49" cy="20" rx="4" ry="2.2" fill="#facc15" transform="rotate(-25 49 20)" />
          <ellipse cx="42" cy="30" rx="4" ry="2.2" fill="#eab308" transform="rotate(-35 42 30)" />
        </svg>
      );
    case 'tabebuya_petal':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="16" y="14" width="48" height="52" rx="4" fill="#f7efe1" stroke="#b48a5a" strokeWidth="2" />
          <path d="M34 52 C22 40 24 24 35 22 C43 24 44 40 34 52 Z" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
          <path d="M47 56 C37 44 40 28 50 26 C58 29 57 44 47 56 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <text x="40" y="62" textAnchor="middle" fill="#78350f" fontSize="6.5" fontFamily="Georgia, serif" fontWeight="bold">
            22 MEI 22·23
          </text>
        </svg>
      );
    case 'recipe_card':
      return (
        <svg viewBox="0 0 80 80" className={cls}>
          <rect x="15" y="14" width="50" height="54" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <circle cx="56" cy="24" r="8" fill="#f59e0b" opacity="0.35" />
          <line x1="23" y1="28" x2="48" y2="28" stroke="#92400e" strokeWidth="2" />
          <line x1="23" y1="37" x2="55" y2="37" stroke="#b45309" strokeWidth="1.6" />
          <line x1="23" y1="45" x2="50" y2="45" stroke="#b45309" strokeWidth="1.6" />
          <path d="M26 58 Q36 50 48 56" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="47" cy="54" rx="5" ry="2.6" fill="#16a34a" transform="rotate(-20 47 54)" />
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
  const { isMobile, isCompactLandscape } = useMobileViewport();

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
    if (flags.includes('has_father_cassette_1997')) {
      has('item_kaset_bapak_1997');
    }
    if (flags.includes('rewrote_midnight_draft') || flags.includes('shared_midnight_draft_nadia')) {
      has('item_midnight_draft');
    }
    if (flags.includes('has_mother_letter_2016')) {
      has('item_mother_letter_2016');
    }
    if (flags.includes('kept_mother_rice_seed_2015')) {
      has('item_mother_paddy_seed');
    }
    if (flags.includes('kept_pressed_tabebuya_2022')) {
      has('item_pressed_tabebuya_2022');
    }
    if (flags.includes('kept_turmeric_recipe_card')) {
      has('item_turmeric_recipe_card');
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
  const kiraPos = playerRuntime.companions.kira.pos;
  const nadiaPos = playerRuntime.companions.nadia.pos;
  const distKira = Math.abs(py - kiraPos[1]) > 5 ? 999 : Math.round(Math.hypot(px - kiraPos[0], pz - kiraPos[2]));
  const distNadia = Math.abs(py - nadiaPos[1]) > 5 ? 999 : Math.round(Math.hypot(px - nadiaPos[0], pz - nadiaPos[2]));
  const distKitchenRadio = Math.abs(py - 0.08) > 4 ? 999 : Math.round(Math.hypot(px - -17.42, pz - 71.95));

  // Deteksi suasana suara spasial 3D aktif di sekitar Damar
  const activeSoundTags: string[] = [];
  if (py > 14) activeSoundTags.push('Angin Ketinggian Rooftop');
  else {
    if (Math.min(Math.abs(px - -48), Math.hypot(px - -84, pz - -28) - 10) < 24) {
      activeSoundTags.push('Gemericik Air Sungai & Danau');
    }
    if (Math.hypot(px - -20, pz - 20.5) < 16) activeSoundTags.push('Uap Espresso Kedai Bima');
    if (Math.hypot(px - -77.5, pz - -51.5) < 20) activeSoundTags.push('Desir Rimba Bambu Utara');
    if (Math.hypot(px - 79.5, pz - 35.5) < 18) activeSoundTags.push('Dekut Merpati Taman Lokomotif');
    if (Math.hypot(px - 94.3, pz - playerRuntime.trainZ) < 44) activeSoundTags.push('Dengung Kereta Komuter');
    if (px < -56 || (pz > 46 && px > -36 && px < 46)) activeSoundTags.push('Suasana Alam & Lingkungan');
  }

  const compact = isMobile || isCompactLandscape;

  return (
    <Portal>
      <div
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/82 backdrop-blur-md ${
          compact ? 'p-2' : 'p-4'
        }`}
        onClick={() => setBagOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-warm-300/25 bg-dusk-900/96 text-warm-50 shadow-2xl animate-fadeIn ${
            compact ? 'h-[94dvh]' : 'h-[80vh]'
          }`}
        >
          {/* Header */}
          <div
            className={`flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-warm-100/10 ${
              compact ? 'px-4 py-2' : 'px-6 py-4'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex shrink-0 items-center justify-center rounded-xl bg-warm-400/20 text-warm-300 ${
                  compact ? 'h-8 w-8' : 'h-9 w-9'
                }`}
              >
                <Backpack className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </div>
              <div>
                <h2 className={`font-serif text-warm-50 ${compact ? 'text-base leading-tight' : 'text-xl'}`}>
                  Tas Selempang Damar
                </h2>
                <p className={`text-warm-200/65 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                  {ownedItems.length} benda tersimpan · Periksa kenangan &amp; berikan hadiah kecil ke keluarga
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

          {/* Konten 2 Kolom (selalu berdampingan 12-kolom di layar mendatar HP!) */}
          <div className={`grid min-h-0 flex-1 overflow-hidden ${compact ? 'grid-cols-12' : 'grid-cols-1 md:grid-cols-12'}`}>
            {/* Kolom Kiri: Daftar Benda */}
            <div
              className={`flex min-h-0 flex-col border-warm-100/10 ${
                compact ? 'col-span-5 border-r' : 'border-b md:col-span-5 md:border-b-0 md:border-r'
              }`}
            >
              <div
                className={`flex shrink-0 flex-wrap gap-1 border-b border-warm-100/10 ${
                  compact ? 'px-2.5 py-2 text-[10px]' : 'px-4 py-3 text-[11px]'
                }`}
              >
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
                    className={`rounded-lg transition ${compact ? 'px-2 py-1' : 'px-2.5 py-1'} ${
                      filter === f.id
                        ? 'bg-warm-400 font-semibold text-dusk-950'
                        : 'bg-dusk-950/60 text-warm-200/75 hover:text-warm-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className={`min-h-0 flex-1 overflow-y-auto subtle-scroll ${compact ? 'space-y-1.5 p-2.5' : 'space-y-2 p-4'}`}>
                {filtered.length === 0 ? (
                  <p className="py-6 text-center text-xs text-warm-200/55">
                    Belum ada benda pada kategori ini. Jelajahi Kios Harmoni &amp; tepi Taman Kota untuk mencari hadiah kecil bagi keluarga!
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
                        className={`flex w-full items-center rounded-xl border text-left transition ${
                          compact ? 'gap-2 p-2' : 'gap-3 p-3'
                        } ${
                          active
                            ? 'border-warm-300/60 bg-warm-400/15'
                            : 'border-warm-100/10 bg-dusk-950/60 hover:border-warm-200/30'
                        }`}
                      >
                        <div className="shrink-0">
                          <ItemArtwork iconType={item.iconType} size="sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate font-medium text-warm-50 ${compact ? 'text-xs' : 'text-sm'}`}>{item.name}</p>
                          <p className={`truncate text-warm-200/60 ${compact ? 'text-[10px]' : 'text-[11px]'}`}>{item.subtitle}</p>
                        </div>
                        {item.category === 'hadiah' && (
                          <Gift className="h-3.5 w-3.5 shrink-0 text-pink-300" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Kolom Kanan: Inspeksi Detail Benda */}
            <div
              className={`flex min-h-0 flex-col justify-between overflow-y-auto subtle-scroll ${
                compact ? 'col-span-7 p-3.5' : 'p-6 md:col-span-7'
              }`}
            >
              {selected && (
                <div className={compact ? 'space-y-2.5' : 'space-y-5'}>
                  <div
                    className={`rounded-2xl border border-warm-200/15 bg-gradient-to-b from-dusk-950/90 to-dusk-900/60 ${
                      compact ? 'flex items-center gap-3 p-3' : 'flex flex-col items-center py-6'
                    }`}
                  >
                    <div className="shrink-0">
                      <ItemArtwork iconType={selected.iconType} size={compact ? 'md' : 'lg'} />
                    </div>
                    <div className={compact ? 'min-w-0 flex-1 text-left' : 'flex flex-col items-center text-center'}>
                      <span
                        className={`rounded-full bg-warm-400/15 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-warm-300 ${
                          compact ? 'inline-block' : 'mt-3'
                        }`}
                      >
                        {selected.category === 'hadiah'
                          ? 'Hadiah untuk Keluarga'
                          : selected.category === 'misi'
                            ? 'Titipan Warga Kota'
                            : 'Benda Kenangan'}
                      </span>
                      <h3 className={`font-serif text-warm-50 ${compact ? 'mt-1 text-base leading-tight' : 'mt-2 px-4 text-2xl'}`}>
                        {selected.name}
                      </h3>
                      <p className={`text-warm-200/65 ${compact ? 'text-[10.5px]' : 'text-xs'}`}>{selected.subtitle}</p>
                    </div>
                  </div>

                  <p className={`leading-relaxed text-warm-100/85 ${compact ? 'text-xs' : 'text-sm'}`}>
                    {selected.description}
                  </p>

                  <div className={`rounded-xl border border-warm-200/15 bg-dusk-950/70 ${compact ? 'p-3' : 'p-4'}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-warm-300">
                        <Sparkles className="h-3.5 w-3.5" /> Batin Damar
                      </span>
                      <button
                        type="button"
                        onClick={() => voiceManager.speak(`bag_${selected.id}`, 'damar_batin', selected.monologue)}
                        className="flex items-center gap-1 rounded-lg bg-warm-400/15 px-2.5 py-1 text-[10.5px] text-warm-200 hover:bg-warm-400/25"
                      >
                        <Volume2 className="h-3 w-3" /> Dengarkan
                      </button>
                    </div>
                    <p className={`mt-1.5 font-serif italic leading-relaxed text-warm-100/90 ${compact ? 'text-xs' : 'text-sm'}`}>
                      "{selected.monologue}"
                    </p>
                  </div>

                  {/* Aksi Khusus Kaset Pita C-60 Bapak (1997) */}
                  {selected.id === 'item_kaset_bapak_1997' && (
                    <div className={`rounded-xl border border-amber-300/30 bg-amber-950/25 ${compact ? 'p-2.5' : 'p-4'}`}>
                      {flags.includes('played_father_cassette_1997') ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue('flashback_kaset_bapak_1997');
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-amber-300 ${
                            compact ? 'py-2' : 'py-3'
                          }`}
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Putar Ulang Rekaman Kaset Suara Bapak (1997)</span>
                        </button>
                      ) : distKitchenRadio <= 5.5 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue('flashback_kaset_bapak_1997');
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-amber-300 ${
                            compact ? 'py-2' : 'py-3'
                          }`}
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Masukkan Kaset ke Radio Kayu Dapur Sekarang!</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-warm-200/85">
                            Bawa ke <strong>Radio Kayu Dapur</strong> di Rumah Jl. Melati No. 14 ({distKitchenRadio} m lagi) untuk memutar ujung pitanya.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomWaypoint({
                                label: 'Radio Kayu Dapur (Putar Kaset Bapak 1997)',
                                position: [-17.42, 0.08, 71.95],
                              });
                              setBagOpen(false);
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 font-semibold text-dusk-950 hover:bg-cyan-300"
                          >
                            <Navigation className="h-3 w-3" /> Pasang GPS Radio Dapur
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Aksi Khusus Lembar Draf Pukul 02.14 WIB */}
                  {selected.id === 'item_midnight_draft' && (
                    <div className={`rounded-xl border border-sky-300/30 bg-sky-950/25 ${compact ? 'p-2.5' : 'p-4'}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setBagOpen(false);
                          startDialogue('story_midnight_draft_drawer');
                        }}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-sky-300 ${
                          compact ? 'py-2' : 'py-3'
                        }`}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Baca Ulang Lembar Draf Pukul 02.14 WIB</span>
                      </button>
                    </div>
                  )}

                  {/* Aksi Khusus Surat Biru & Kancing Kebaya Ibu (2016) */}
                  {selected.id === 'item_mother_letter_2016' && (
                    <div className={`rounded-xl border border-blue-300/30 bg-blue-950/25 ${compact ? 'p-2.5' : 'p-4'}`}>
                      {!flags.includes('shared_mother_letter_with_nadia') && distNadia <= 5.5 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue('story_share_mother_letter_nadia');
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-amber-300 ${
                            compact ? 'py-2' : 'py-3'
                          }`}
                        >
                          <Gift className="h-4 w-4" />
                          <span>Bacakan Surat Ibu (2016) Bersama Nadia Sekarang!</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-warm-200/85">
                            {flags.includes('shared_mother_letter_with_nadia')
                              ? 'Sudah dibacakan bersama Nadia — kamu tetap bisa membuka kembali surat Ibu kapan saja.'
                              : `Dekati Nadia (${distNadia} m lagi) untuk membacakan surat Ibu bersama, atau baca ulang sekarang.`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setBagOpen(false);
                              startDialogue('story_mother_sewing_tin_2016');
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-sky-400 px-3 py-1.5 font-semibold text-dusk-950 hover:bg-sky-300"
                          >
                            <Play className="h-3 w-3 fill-current" /> Baca Ulang Surat Ibu
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Aksi Khusus Sepasang Kelopak Tabebuya Kering (2022 & 2023) */}
                  {selected.id === 'item_pressed_tabebuya_2022' && (
                    <div className={`rounded-xl border border-pink-300/30 bg-pink-950/25 ${compact ? 'p-2.5' : 'p-4'}`}>
                      {!flags.includes('shared_tabebuya_2022_with_nadia') && distNadia <= 5.5 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue('story_share_tabebuya_nadia');
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-amber-300 ${
                            compact ? 'py-2' : 'py-3'
                          }`}
                        >
                          <Gift className="h-4 w-4" />
                          <span>Serahkan Dua Kelopak Tabebuya (2022–2023) kepada Nadia!</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-warm-200/85">
                            {flags.includes('shared_tabebuya_2022_with_nadia')
                              ? 'Sudah diserahkan dengan penuh haru kepada Nadia — kenangan halaman 47 tetap bisa dibaca ulang.'
                              : `Dekati Nadia (${distNadia} m lagi) untuk menunjukkan sepasang kelopak Tabebuya dari Paviliun Utara.`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setBagOpen(false);
                              startDialogue('story_bamboo_guestbook_2022');
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-pink-400 px-3 py-1.5 font-semibold text-dusk-950 hover:bg-pink-300"
                          >
                            <Play className="h-3 w-3 fill-current" /> Baca Ulang Halaman 47
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Aksi Khusus Kartu Resep Noda Kunyit Ibu & Nadia */}
                  {selected.id === 'item_turmeric_recipe_card' && (
                    <div className={`rounded-xl border border-amber-300/30 bg-amber-950/25 ${compact ? 'p-2.5' : 'p-4'}`}>
                      {!flags.includes('shared_recipe_book_with_nadia') && distNadia <= 5.5 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue('story_share_recipe_book_nadia');
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-amber-300 ${
                            compact ? 'py-2' : 'py-3'
                          }`}
                        >
                          <Gift className="h-4 w-4" />
                          <span>Ucapkan Terima Kasih pada Nadia Soal Buku Resep &amp; Kebun Belakang!</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-warm-200/85">
                            {flags.includes('shared_recipe_book_with_nadia')
                              ? 'Sudah dibicarakan hangat dengan Nadia — masakan kemangi & wedang serai siap diseduh di kompor dapur!'
                              : `Dekati Nadia (${distNadia} m lagi) untuk mengobrol soal buku resep Ibu & kebun bumbu belakang rumah.`}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setBagOpen(false);
                              startDialogue('story_kitchen_turmeric_notebook');
                            }}
                            className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 font-semibold text-dusk-950 hover:bg-amber-300"
                          >
                            <Play className="h-3 w-3 fill-current" /> Baca Ulang Buku Resep
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Aksi Pemberian Hadiah ke Kira atau Nadia */}
                  {selected.giftTarget && selected.giftDialogueId && (
                    <div className={`rounded-xl border border-pink-300/25 bg-pink-950/20 ${compact ? 'p-2.5' : 'p-4'}`}>
                      {((selected.giftTarget === 'kira' && distKira <= 5.5) ||
                        (selected.giftTarget === 'nadia' && distNadia <= 5.5)) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBagOpen(false);
                            startDialogue(selected.giftDialogueId!);
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-warm-400 text-xs font-semibold text-dusk-950 shadow-lg hover:bg-warm-300 ${
                            compact ? 'py-2' : 'py-3'
                          }`}
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
              <div
                className={`flex flex-wrap items-center justify-between gap-2 border-t border-warm-100/10 text-warm-200/60 ${
                  compact ? 'mt-2.5 pt-2 text-[10px]' : 'mt-5 pt-3 text-[11px]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-warm-300" />
                  <span>Audio Spasial 3D:</span>
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
