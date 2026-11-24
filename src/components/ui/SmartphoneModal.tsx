import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Battery,
  Camera,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  CloudRain,
  CloudSun,
  Footprints,
  Heart,
  Home,
  Image as ImageIcon,
  Map as MapIcon,
  MessageCircle,
  Mic,
  Moon,
  Music,
  Pause,
  Phone,
  PhoneCall,
  PhoneOff,
  Play,
  Plus,
  Send,
  Sun,
  Sunset,
  Trash2,
  Umbrella,
  Wifi,
  X,
} from 'lucide-react';
import { sfxEngine } from '../../audio/sfxEngine';
import { voiceManager } from '../../audio/voiceManager';
import {
  ChatReplyOption,
  MEMORY_PHOTOS,
  MemoryPhotoItem,
  PHONE_THREADS,
  PhoneContactThread,
  RADIO_STATIONS,
  VOICE_NOTES,
} from '../../data/phoneContent';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { useGameStore } from '../../store/useGameStore';
import { Portal } from './Portal';

const CLOCK_BY_TIME = {
  morning: { time: '08:24', temp: '26°C', desc: 'Pagi Cerah Berawan', humidity: '72%', wind: '8 km/j' },
  sunset: { time: '17:18', temp: '28°C', desc: 'Senja Keemasan', humidity: '68%', wind: '11 km/j' },
  rain_dusk: { time: '17:54', temp: '23°C', desc: 'Hujan Ringan Merata', humidity: '89%', wind: '16 km/j' },
  night: { time: '20:42', temp: '22°C', desc: 'Malam Tenang Berbintang', humidity: '81%', wind: '6 km/j' },
};

/**
 * Ilustrasi artistik SVG untuk 6 foto kenangan keluarga Damar di Galeri HP.
 */
const MemoryIllustration: React.FC<{ theme: MemoryPhotoItem['theme']; large?: boolean }> = ({
  theme,
  large = false,
}) => {
  const h = large ? 'h-44' : 'h-24';
  if (theme === 'stage') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg object-cover`}>
        <defs>
          <linearGradient id="stBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b38" />
            <stop offset="100%" stopColor="#5e3633" />
          </linearGradient>
        </defs>
        <rect width="240" height="140" fill="url(#stBg)" />
        <circle cx="65" cy="30" r="18" fill="#ffd27d" opacity="0.28" />
        <circle cx="175" cy="30" r="18" fill="#ffb86b" opacity="0.28" />
        <rect x="0" y="102" width="240" height="38" fill="#2c1d18" />
        <circle cx="98" cy="64" r="10" fill="#d9aa86" />
        <rect x="86" y="75" width="24" height="30" rx="6" fill="#486078" />
        <ellipse cx="105" cy="90" rx="13" ry="8" fill="#b87138" transform="rotate(-18 105 90)" />
        <circle cx="145" cy="66" r="10" fill="#cfa07b" />
        <rect x="133" y="77" width="24" height="28" rx="6" fill="#7d6755" />
      </svg>
    );
  }
  if (theme === 'bridge') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
        <defs>
          <linearGradient id="brBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c2a54" />
            <stop offset="60%" stopColor="#f08a58" />
            <stop offset="100%" stopColor="#264059" />
          </linearGradient>
        </defs>
        <rect width="240" height="140" fill="url(#brBg)" />
        <circle cx="120" cy="64" r="24" fill="#ffd282" opacity="0.85" />
        <rect x="0" y="96" width="240" height="44" fill="#1e344d" />
        <rect x="0" y="86" width="240" height="8" fill="#2b313d" />
        <line x1="65" y1="25" x2="65" y2="86" stroke="#d8dde6" strokeWidth="4" />
        <line x1="175" y1="25" x2="175" y2="86" stroke="#d8dde6" strokeWidth="4" />
        <line x1="65" y1="30" x2="120" y2="86" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="175" y1="30" x2="120" y2="86" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="108" y="72" width="24" height="18" rx="4" fill="#d9a14a" />
        <text x="120" y="84" fontSize="8" fill="#2b1e10" textAnchor="middle" fontWeight="bold">D&amp;N</text>
      </svg>
    );
  }
  if (theme === 'baby') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
        <rect width="240" height="140" fill="#f5e6d3" />
        <circle cx="120" cy="70" r="54" fill="#edd3b4" />
        <ellipse cx="120" cy="88" rx="42" ry="28" fill="#f9d88c" />
        <circle cx="120" cy="64" r="19" fill="#e6be9e" />
        <path d="M112 62 Q115 65 118 62 M122 62 Q125 65 128 62" stroke="#3a2a20" strokeWidth="2" fill="none" />
        <path d="M116 70 Q120 74 124 70" stroke="#9e5c4a" strokeWidth="2" fill="none" />
      </svg>
    );
  }
  if (theme === 'cafe') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
        <rect width="240" height="140" fill="#2d2018" />
        <rect x="0" y="96" width="240" height="44" fill="#593d2b" />
        {[35, 80, 120, 160, 205].map((x) => (
          <circle key={x} cx={x} cy="24" r="6" fill="#ffdf94" />
        ))}
        <rect x="78" y="64" width="28" height="34" rx="5" fill="#f2eadc" />
        <rect x="134" y="64" width="28" height="34" rx="5" fill="#f2eadc" />
        <text x="120" y="52" fontSize="13" fill="#f3cf8a" textAnchor="middle" fontFamily="Georgia, serif">KOPI SUDUT</text>
      </svg>
    );
  }
  if (theme === 'crayon') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
        <rect width="240" height="140" fill="#fcf8ee" />
        <circle cx="195" cy="30" r="18" fill="#f6c344" />
        <rect x="0" y="102" width="240" height="38" fill="#77b6db" />
        <polygon points="35,72 62,46 89,72" fill="#b34d3b" />
        <rect x="42" y="72" width="40" height="30" fill="#e08972" />
        <circle cx="128" cy="70" r="7" stroke="#2c3540" strokeWidth="2.5" fill="none" />
        <line x1="128" y1="77" x2="128" y2="99" stroke="#2c3540" strokeWidth="2.5" />
        <circle cx="152" cy="78" r="6" stroke="#2c3540" strokeWidth="2.5" fill="none" />
        <line x1="152" y1="84" x2="152" y2="99" stroke="#2c3540" strokeWidth="2.5" />
        <circle cx="176" cy="72" r="7" stroke="#2c3540" strokeWidth="2.5" fill="none" />
        <line x1="176" y1="79" x2="176" y2="99" stroke="#2c3540" strokeWidth="2.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
      <rect width="240" height="140" fill="#10182b" />
      <circle cx="48" cy="28" r="1.5" fill="#fff6d6" />
      <circle cx="185" cy="24" r="1.8" fill="#fff6d6" />
      <circle cx="145" cy="40" r="1.2" fill="#fff6d6" />
      <polygon points="62,68 120,34 178,68" fill="#733c2e" />
      <rect x="74" y="68" width="92" height="58" fill="#2c3442" />
      <rect x="92" y="82" width="24" height="22" rx="2" fill="#ffd98a" />
      <rect x="128" y="82" width="24" height="22" rx="2" fill="#ffca70" />
      <rect x="0" y="124" width="240" height="16" fill="#18202c" />
    </svg>
  );
};

export const SmartphoneModal: React.FC = () => {
  const isOpen = useGameStore((s) => s.isPhoneOpen);
  const app = useGameStore((s) => s.phoneApp);
  const threadId = useGameStore((s) => s.phoneThreadId);
  const openPhone = useGameStore((s) => s.openPhone);
  const closePhone = useGameStore((s) => s.closePhone);
  const chapter = useGameStore((s) => s.chapter);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const currentLocation = useGameStore((s) => s.currentLocation);
  const sideQuests = useGameStore((s) => s.sideQuests);
  const discoveredEasterEggs = useGameStore((s) => s.discoveredEasterEggs);
  const repliedPhonePrompts = useGameStore((s) => s.repliedPhonePrompts);
  const replyToPhonePrompt = useGameStore((s) => s.replyToPhonePrompt);
  const markPhoneThreadRead = useGameStore((s) => s.markPhoneThreadRead);
  const playerNotes = useGameStore((s) => s.playerNotes);
  const addPlayerNote = useGameStore((s) => s.addPlayerNote);
  const deletePlayerNote = useGameStore((s) => s.deletePlayerNote);
  const playerPhotos = useGameStore((s) => s.playerPhotos);
  const radioStation = useGameStore((s) => s.radioStation);
  const radioPaused = useGameStore((s) => s.radioPaused);
  const setRadioStation = useGameStore((s) => s.setRadioStation);
  const setRadioPaused = useGameStore((s) => s.setRadioPaused);
  const stepCount = useGameStore((s) => s.stepCount);
  const setPhotoMode = useGameStore((s) => s.setPhotoMode);
  const toggleMapJournal = useGameStore((s) => s.toggleMapJournal);
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const setFreeTimeOfDay = useGameStore((s) => s.setFreeTimeOfDay);
  const umbrellaForcedOff = useGameStore((s) => s.umbrellaForcedOff);
  const toggleUmbrella = useGameStore((s) => s.toggleUmbrella);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const toggleFamilyWalk = useGameStore((s) => s.toggleFamilyWalk);

  const [typingThread, setTypingThread] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ contact: PhoneContactThread; line: string; seconds: number } | null>(null);
  const [galleryTab, setGalleryTab] = useState<'memories' | 'captures'>('memories');
  const [selectedMemory, setSelectedMemory] = useState<MemoryPhotoItem | null>(null);
  const [selectedCaptureUrl, setSelectedCaptureUrl] = useState<{ url: string; title: string; caption: string } | null>(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    if (!activeCall) return;
    const id = window.setInterval(() => {
      setActiveCall((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null));
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeCall]);

  useEffect(() => {
    return voiceManager.onSpeakingChange((speaking) => {
      if (!speaking) setPlayingVoiceId(null);
    });
  }, []);

  if (!isOpen) return null;

  const meta = CLOCK_BY_TIME[timeOfDay];
  const loc = LOCATION_BY_ID[currentLocation];
  const activeThread = PHONE_THREADS.find((t) => t.id === threadId) ?? null;

  // Hitung total chat yang memiliki prompt balasan belum dijawab pada bab saat ini
  const pendingReplyCount = PHONE_THREADS.reduce((sum, th) => {
    const unanswered = th.prompts.filter(
      (p) => p.chapterMin <= chapter && !repliedPhonePrompts[p.id],
    ).length;
    return sum + unanswered;
  }, 0);

  const handleSendReply = (promptId: string, option: ChatReplyOption, thread: PhoneContactThread) => {
    sfxEngine.play('interact');
    replyToPhonePrompt(promptId, option.id, option.effects);
    setTypingThread(thread.id);
    window.setTimeout(() => {
      setTypingThread((cur) => (cur === thread.id ? null : cur));
      sfxEngine.play('phone');
    }, 1150);
  };

  const startQuickCall = (contact: PhoneContactThread) => {
    sfxEngine.play('phone');
    const line = contact.quickCallLines[chapter];
    setActiveCall({ contact, line, seconds: 0 });
    voiceManager.speak(`call_${contact.id}_ch${chapter}`, contact.speakerId, line);
  };

  const endQuickCall = () => {
    voiceManager.stop();
    sfxEngine.play('switch');
    setActiveCall(null);
  };

  const completedSideCount = Object.values(sideQuests).filter((q) => q.status === 'completed').length;

  const promiseChecklist = [
    {
      label: 'Dengarkan cerita gambar Kira di meja makan pagi ini',
      done: useGameStore.getState().mainStepId !== 'ch1_1_sarapan',
    },
    {
      label: 'Mampir menyapa Bima di Kedai Kopi Sudut',
      done: !['ch1_1_sarapan', 'ch1_2_kedai_bima'].includes(useGameStore.getState().mainStepId),
    },
    {
      label: 'Bantu warga kota yang sedang bercerita (minimal 3 kisah)',
      done: completedSideCount >= 3,
    },
    {
      label: 'Temukan kenangan masa lalu di sudut kota (minimal 5 fragmen)',
      done: discoveredEasterEggs.length >= 5,
    },
    {
      label: 'Balas pesan hangat dari Nadia atau Kira di aplikasi Pesan',
      done: Object.keys(repliedPhonePrompts).length > 0,
    },
  ];

  const wallpaperClass =
    timeOfDay === 'sunset'
      ? 'from-[#281e3d] via-[#5c3340] to-[#171b28]'
      : timeOfDay === 'morning'
        ? 'from-[#223d59] via-[#3d5b73] to-[#161e2b]'
        : timeOfDay === 'rain_dusk'
          ? 'from-[#172230] via-[#26354a] to-[#0f141e]'
          : 'from-[#0d1424] via-[#1b2740] to-[#0a0f1a]';

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/72 p-4 backdrop-blur-sm"
        onClick={closePhone}
      >
        {/* Bingkai Smartphone Modern */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[640px] max-h-[90vh] w-[356px] max-w-[94vw] flex-col overflow-hidden rounded-[40px] border-[6px] border-[#242a36] bg-dusk-950 text-warm-50 shadow-[0_25px_70px_rgba(0,0,0,0.75)] animate-fadeIn"
        >
          {/* Status Bar Realistis */}
          <div className="z-20 flex items-center justify-between bg-black/35 px-6 pt-3 pb-2 text-[11px] font-medium text-warm-100/90">
            <span>{meta.time}</span>
            <div className="h-4 w-20 rounded-full bg-black/80" />
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3" />
              <span className="text-[10px]">74%</span>
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Layar Utama Aplikasi */}
          <div className={`relative flex-1 overflow-hidden bg-gradient-to-b ${wallpaperClass}`}>
            {/* === LAYAR PANGGILAN AKTIF === */}
            {activeCall && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-between bg-dusk-950/95 p-6 text-center backdrop-blur-xl animate-fadeIn">
                <div className="mt-6 space-y-2">
                  <div
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-xl"
                    style={{ backgroundColor: activeCall.contact.avatarColor }}
                  >
                    {activeCall.contact.initials}
                  </div>
                  <h3 className="font-serif text-xl text-warm-50">{activeCall.contact.name}</h3>
                  <p className="text-xs text-emerald-300">
                    Tersambung · 00:{String(activeCall.seconds).padStart(2, '0')}
                  </p>
                </div>

                <div className="rounded-2xl border border-warm-200/20 bg-dusk-900/90 p-4 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-warm-300/80">Suara Panggilan</p>
                  <p className="mt-1.5 font-serif text-sm leading-relaxed text-warm-100">
                    "{activeCall.line}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={endQuickCall}
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-400"
                  title="Tutup Panggilan"
                >
                  <PhoneOff className="h-6 w-6" />
                </button>
              </div>
            )}

            {/* === 0. HOME SCREEN PONSEL === */}
            {app === 'home' && (
              <div className="flex h-full flex-col justify-between p-5">
                <div className="space-y-4">
                  {/* Widget Cuaca & Pedometer */}
                  <div className="rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] text-warm-200/75">{loc.name}</p>
                        <p className="mt-0.5 font-serif text-3xl font-medium text-warm-50">{meta.temp}</p>
                        <p className="text-xs text-warm-200/80">{meta.desc}</p>
                      </div>
                      <div className="rounded-xl bg-warm-400/20 p-2.5 text-warm-300">
                        {timeOfDay === 'morning' ? (
                          <Sun className="h-6 w-6" />
                        ) : timeOfDay === 'sunset' ? (
                          <Sunset className="h-6 w-6" />
                        ) : timeOfDay === 'rain_dusk' ? (
                          <CloudRain className="h-6 w-6" />
                        ) : (
                          <Moon className="h-6 w-6" />
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[11px] text-warm-200/80">
                      <span className="flex items-center gap-1.5">
                        <Footprints className="h-3.5 w-3.5 text-warm-300" />
                        {stepCount.toLocaleString('id-ID')} langkah hari ini
                      </span>
                      <span className="text-warm-300">Bab {chapter}</span>
                    </div>
                  </div>

                  {/* Tombol Cepat Jalan Sore Bersama Nadia & Kira */}
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      toggleFamilyWalk();
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left text-xs transition ${
                      isFamilyWalkActive
                        ? 'border-rose-300/45 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30'
                        : 'border-white/15 bg-black/30 text-warm-100 hover:border-rose-300/45 hover:bg-rose-500/15'
                    }`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Heart className={`h-4 w-4 text-rose-300 ${isFamilyWalkActive ? 'fill-rose-300' : ''}`} />
                      <span>
                        {isFamilyWalkActive ? 'Antar Nadia & Kira Pulang' : 'Ajak Nadia & Kira Jalan Sore'}
                      </span>
                    </span>
                    <span className="text-[10px] font-semibold text-rose-200/80">[G]</span>
                  </button>

                  {/* Grid 6 Aplikasi Interaktif */}
                  <div className="grid grid-cols-3 gap-3.5 pt-1">
                    {(
                      [
                        { id: 'chat', label: 'Pesan', icon: MessageCircle, bg: 'bg-emerald-500/85', badge: pendingReplyCount },
                        { id: 'calls', label: 'Telepon', icon: Phone, bg: 'bg-sky-500/85', badge: 0 },
                        { id: 'gallery', label: 'Galeri', icon: ImageIcon, bg: 'bg-amber-500/85', badge: playerPhotos.length },
                        { id: 'radio', label: 'Nada FM', icon: Music, bg: 'bg-violet-500/85', badge: 0 },
                        { id: 'notes', label: 'Catatan', icon: CheckSquare, bg: 'bg-orange-500/85', badge: 0 },
                        { id: 'weather', label: 'Kota', icon: CloudSun, bg: 'bg-teal-500/85', badge: 0 },
                      ] as const
                    ).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => openPhone(item.id, undefined)}
                          className="group flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} text-white shadow-lg transition group-hover:scale-105`}
                          >
                            <Icon className="h-6 w-6" />
                            {item.badge > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium text-warm-100/90">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dock Pintasan Cepat Bawah */}
                <div className="flex items-center justify-around rounded-2xl border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      setPhotoMode(true);
                    }}
                    className="flex flex-col items-center gap-0.5 text-[10px] text-warm-200 hover:text-warm-50"
                  >
                    <Camera className="h-5 w-5 text-warm-300" />
                    <span>Kamera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      toggleMapJournal('map');
                    }}
                    className="flex flex-col items-center gap-0.5 text-[10px] text-warm-200 hover:text-warm-50"
                  >
                    <MapIcon className="h-5 w-5 text-sky-300" />
                    <span>Peta</span>
                  </button>
                  <button
                    type="button"
                    onClick={closePhone}
                    className="flex flex-col items-center gap-0.5 text-[10px] text-warm-200 hover:text-warm-50"
                  >
                    <X className="h-5 w-5 text-warm-200/75" />
                    <span>Simpan HP</span>
                  </button>
                </div>
              </div>
            )}

            {/* === 1. APLIKASI PESAN (WHATSAPP-STYLE INTERAKTIF) === */}
            {app === 'chat' && !activeThread && (
              <div className="flex h-full flex-col bg-dusk-950/92">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <h3 className="font-serif text-base text-warm-50">Pesan Masuk</h3>
                  <span className="text-[10px] text-emerald-300">
                    {pendingReplyCount > 0 ? `${pendingReplyCount} perlu dibalas` : 'Semua terbaca'}
                  </span>
                </div>
                <div className="flex-1 divide-y divide-white/5 overflow-y-auto subtle-scroll">
                  {PHONE_THREADS.map((th) => {
                    const visibleMsgs = th.messages.filter((m) => m.chapterMin <= chapter);
                    const lastMsg = visibleMsgs[visibleMsgs.length - 1];
                    const hasPending = th.prompts.some(
                      (p) => p.chapterMin <= chapter && !repliedPhonePrompts[p.id],
                    );
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => {
                          sfxEngine.play('interact');
                          markPhoneThreadRead(th.id);
                          openPhone('chat', th.id);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/5"
                      >
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: th.avatarColor }}
                        >
                          {th.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-warm-50">{th.name}</p>
                            <span className="text-[10px] text-warm-200/50">{lastMsg?.time}</span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-warm-200/70">
                            {lastMsg?.text}
                          </p>
                        </div>
                        {hasPending && (
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DETAIL CHAT THREAD + BALASAN INTERAKTIF */}
            {app === 'chat' && activeThread && (
              <div className="flex h-full flex-col bg-[#0e141f]">
                <div className="flex items-center justify-between border-b border-white/10 bg-dusk-900/90 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => openPhone('chat', '')}
                      className="rounded-lg p-1 text-warm-200 hover:bg-white/10"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: activeThread.avatarColor }}
                    >
                      {activeThread.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-warm-50">{activeThread.name}</p>
                      <p className="text-[10px] text-emerald-300/80">
                        {typingThread === activeThread.id ? 'sedang mengetik...' : activeThread.relation}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startQuickCall(activeThread)}
                    className="rounded-full bg-emerald-500/20 p-2 text-emerald-300 hover:bg-emerald-500/30"
                    title="Telepon langsung"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Daftar Balon Pesan */}
                <div className="flex-1 space-y-2.5 overflow-y-auto subtle-scroll p-3.5 text-xs">
                  {activeThread.messages
                    .filter((m) => m.chapterMin <= chapter)
                    .map((m) => (
                      <div key={m.id} className="flex justify-start">
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-dusk-800/95 px-3.5 py-2.5 text-warm-100 shadow">
                          <p className="leading-relaxed">{m.text}</p>
                          <p className="mt-1 text-right text-[9px] text-warm-200/45">{m.time}</p>
                        </div>
                      </div>
                    ))}

                  {/* Balasan yang Sudah Dikirim Damar + Balasan Otomatis Mereka */}
                  {activeThread.prompts
                    .filter((p) => p.chapterMin <= chapter && repliedPhonePrompts[p.id])
                    .map((p) => {
                      const chosen = p.options.find((o) => o.id === repliedPhonePrompts[p.id]);
                      if (!chosen) return null;
                      return (
                        <React.Fragment key={p.id}>
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-700/85 px-3.5 py-2.5 text-white shadow">
                              <p className="leading-relaxed">{chosen.text}</p>
                              <p className="mt-1 text-right text-[9px] text-emerald-100/70">Terkirim ✓✓</p>
                            </div>
                          </div>
                          {typingThread !== activeThread.id && (
                            <div className="flex justify-start animate-fadeIn">
                              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-dusk-800/95 px-3.5 py-2.5 text-warm-100 shadow">
                                <p className="leading-relaxed">{chosen.replyFromThem}</p>
                                <p className="mt-1 text-right text-[9px] text-warm-200/45">{chosen.replyTime}</p>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}

                  {typingThread === activeThread.id && (
                    <div className="inline-block rounded-2xl bg-dusk-800/80 px-3 py-2 text-[11px] italic text-warm-300">
                      sedang mengetik...
                    </div>
                  )}
                </div>

                {/* Pilihan Balasan Cepat */}
                {(() => {
                  const nextPrompt = activeThread.prompts.find(
                    (p) => p.chapterMin <= chapter && !repliedPhonePrompts[p.id],
                  );
                  if (!nextPrompt) {
                    return (
                      <div className="border-t border-white/10 bg-dusk-900/80 px-4 py-2.5 text-center text-[11px] text-warm-200/50">
                        Belum ada pesan baru yang perlu dibalas saat ini.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-1.5 border-t border-white/10 bg-dusk-900/95 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                        Pilih Balasan Damar:
                      </p>
                      {nextPrompt.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSendReply(nextPrompt.id, opt, activeThread)}
                          className="flex w-full items-center justify-between gap-2 rounded-xl border border-emerald-400/30 bg-emerald-950/35 px-3 py-2 text-left text-[11px] text-warm-50 transition hover:bg-emerald-900/50"
                        >
                          <span className="leading-snug">{opt.text}</span>
                          <Send className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* === 2. APLIKASI TELEPON & PESAN SUARA (VOICE NOTES) === */}
            {app === 'calls' && (
              <div className="flex h-full flex-col bg-dusk-950/92">
                <div className="border-b border-white/10 px-4 py-3">
                  <h3 className="font-serif text-base text-warm-50">Telepon & Pesan Suara</h3>
                  <p className="text-[11px] text-warm-200/60">
                    Dengarkan pesan suara keluarga atau telepon kontak langsung
                  </p>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto subtle-scroll p-4">
                  {/* Voice Notes */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                      Pesan Suara Tersimpan
                    </p>
                    {VOICE_NOTES.filter((v) => v.chapterMin <= chapter).map((vn) => {
                      const playing = playingVoiceId === vn.id;
                      return (
                        <div
                          key={vn.id}
                          className="rounded-xl border border-white/10 bg-dusk-900/80 p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (playing) {
                                    voiceManager.stop();
                                    setPlayingVoiceId(null);
                                  } else {
                                    setPlayingVoiceId(vn.id);
                                    voiceManager.speak(vn.id, vn.speakerId, vn.transcript);
                                  }
                                }}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-400 text-dusk-950 hover:bg-warm-300"
                              >
                                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                              </button>
                              <div>
                                <p className="text-xs font-semibold text-warm-50">{vn.title}</p>
                                <p className="text-[10px] text-warm-200/60">
                                  {vn.senderName} · {vn.duration}
                                </p>
                              </div>
                            </div>
                            <Mic className={`h-3.5 w-3.5 ${playing ? 'text-warm-300 animate-pulse' : 'text-warm-200/40'}`} />
                          </div>
                          {playing && (
                            <p className="mt-2 border-t border-white/10 pt-2 font-serif text-[11px] italic leading-relaxed text-warm-100/90 animate-fadeIn">
                              "{vn.transcript}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Panggilan Cepat */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                      Panggilan Cepat
                    </p>
                    {PHONE_THREADS.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-dusk-900/65 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: c.avatarColor }}
                          >
                            {c.initials}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-warm-50">{c.name}</p>
                            <p className="text-[10px] text-warm-200/55">{c.relation}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => startQuickCall(c)}
                          className="rounded-full bg-emerald-500/20 p-2 text-emerald-300 hover:bg-emerald-500/35"
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === 3. APLIKASI GALERI KENANGAN & JEPRETAN FOTO === */}
            {app === 'gallery' && (
              <div className="flex h-full flex-col bg-dusk-950/92">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <h3 className="font-serif text-base text-warm-50">Galeri Foto</h3>
                  <div className="flex gap-1 rounded-lg bg-dusk-900 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setGalleryTab('memories')}
                      className={`rounded-md px-2 py-1 ${
                        galleryTab === 'memories' ? 'bg-warm-400 font-semibold text-dusk-950' : 'text-warm-200/70'
                      }`}
                    >
                      Kenangan
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryTab('captures')}
                      className={`rounded-md px-2 py-1 ${
                        galleryTab === 'captures' ? 'bg-warm-400 font-semibold text-dusk-950' : 'text-warm-200/70'
                      }`}
                    >
                      Jepretan ({playerPhotos.length})
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto subtle-scroll p-3.5">
                  {selectedMemory ? (
                    <div className="space-y-3 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => setSelectedMemory(null)}
                        className="flex items-center gap-1 text-xs text-warm-300"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Album
                      </button>
                      <MemoryIllustration theme={selectedMemory.theme} large />
                      <div>
                        <h4 className="font-serif text-base text-warm-50">{selectedMemory.title}</h4>
                        <p className="text-[10px] text-warm-300/80">
                          {selectedMemory.dateLabel} · {selectedMemory.locationLabel}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-warm-100/85">
                          {selectedMemory.caption}
                        </p>
                      </div>
                    </div>
                  ) : selectedCaptureUrl ? (
                    <div className="space-y-3 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => setSelectedCaptureUrl(null)}
                        className="flex items-center gap-1 text-xs text-warm-300"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Jepretan
                      </button>
                      <img
                        src={selectedCaptureUrl.url}
                        alt={selectedCaptureUrl.title}
                        className="w-full rounded-xl border border-white/15"
                      />
                      <div>
                        <h4 className="font-serif text-sm text-warm-50">{selectedCaptureUrl.title}</h4>
                        <p className="mt-1 text-xs text-warm-200/75">{selectedCaptureUrl.caption}</p>
                      </div>
                    </div>
                  ) : galleryTab === 'memories' ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {MEMORY_PHOTOS.filter((m) => m.chapterMin <= chapter).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            sfxEngine.play('interact');
                            setSelectedMemory(m);
                          }}
                          className="overflow-hidden rounded-xl border border-white/10 bg-dusk-900/70 p-1.5 text-left transition hover:border-warm-300/50"
                        >
                          <MemoryIllustration theme={m.theme} />
                          <p className="mt-1.5 truncate text-[11px] font-medium text-warm-100">{m.title}</p>
                          <p className="truncate text-[9px] text-warm-200/55">{m.dateLabel}</p>
                        </button>
                      ))}
                    </div>
                  ) : playerPhotos.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-3 py-10 text-center">
                      <Camera className="h-9 w-9 text-warm-300/50" />
                      <p className="text-xs text-warm-200/70">
                        Belum ada foto jepretanmu. Tekan <strong>[P]</strong> untuk membuka Mode Foto dan abadikan sudut kota!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          closePhone();
                          setPhotoMode(true);
                        }}
                        className="rounded-xl bg-warm-400 px-4 py-2 text-xs font-semibold text-dusk-950"
                      >
                        Buka Kamera Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {playerPhotos.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setSelectedCaptureUrl({ url: p.dataUrl, title: p.locationName, caption: p.caption })
                          }
                          className="overflow-hidden rounded-xl border border-white/10 bg-dusk-900/70 p-1.5 text-left hover:border-warm-300/50"
                        >
                          <img src={p.dataUrl} alt={p.locationName} className="h-20 w-full rounded-lg object-cover" />
                          <p className="mt-1 truncate text-[10px] font-medium text-warm-100">{p.locationName}</p>
                          <p className="text-[9px] text-warm-200/55">{p.timeLabel}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* === 4. APLIKASI NADA & RADIO KOTA (PEMUTAR MUSIK LIVE) === */}
            {app === 'radio' && (
              <div className="flex h-full flex-col bg-dusk-950/92">
                <div className="border-b border-white/10 px-4 py-3">
                  <h3 className="font-serif text-base text-warm-50">Nada & Radio Kota</h3>
                  <p className="text-[11px] text-warm-200/60">
                    Pilih suasana musik latar sambil menjelajahi kota
                  </p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto subtle-scroll p-4">
                  {/* Kartu Now Playing */}
                  <div className="rounded-2xl border border-violet-300/25 bg-gradient-to-br from-violet-950/60 to-dusk-900 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-violet-300">
                          {radioPaused ? 'Dijeda' : 'Sedang Diputar'}
                        </p>
                        <p className="mt-0.5 font-serif text-sm text-warm-50">
                          {RADIO_STATIONS.find((r) => r.id === radioStation)?.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sfxEngine.play('switch');
                          setRadioPaused(!radioPaused);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-400 text-dusk-950 hover:bg-warm-300"
                      >
                        {radioPaused ? <Play className="h-4 w-4 ml-0.5" /> : <Pause className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-warm-200/70">
                        <span>Volume Musik</span>
                        <span>{Math.round(settings.musicVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={settings.musicVolume}
                        onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
                        className="mt-1 w-full accent-warm-400"
                      />
                    </div>
                  </div>

                  {/* Daftar Stasiun / Kaset */}
                  <div className="space-y-2">
                    {RADIO_STATIONS.map((st) => {
                      const active = radioStation === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            sfxEngine.play('switch');
                            setRadioStation(st.id);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition ${
                            active
                              ? 'border-warm-300/60 bg-warm-400/15'
                              : 'border-white/10 bg-dusk-900/65 hover:border-white/25'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-warm-50">{st.name}</p>
                            <p className="text-[10px] text-warm-200/60">{st.subtitle}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-warm-300/70" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* === 5. APLIKASI CATATAN & JANJI KECIL === */}
            {app === 'notes' && (
              <div className="flex h-full flex-col bg-dusk-950/92">
                <div className="border-b border-white/10 px-4 py-3">
                  <h3 className="font-serif text-base text-warm-50">Catatan & Janji Kecil</h3>
                  <p className="text-[11px] text-warm-200/60">Tulis pengingat pribadimu di HP Damar</p>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto subtle-scroll p-4 text-xs">
                  {/* Daftar Janji Otomatis */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                      Pengingat Hari Ini
                    </p>
                    {promiseChecklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 rounded-xl border border-white/10 bg-dusk-900/60 px-3 py-2"
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                            item.done ? 'text-emerald-400' : 'text-warm-200/30'
                          }`}
                        />
                        <span className={item.done ? 'line-through text-warm-200/50' : 'text-warm-100'}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Catatan Pribadi yang Bisa Ditulis Pemain */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                      Catatan Pribadimu
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!noteInput.trim()) return;
                        sfxEngine.play('page');
                        addPlayerNote(noteInput);
                        setNoteInput('');
                      }}
                      className="flex gap-1.5"
                    >
                      <input
                        type="text"
                        maxLength={90}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Tulis catatan kecil..."
                        className="flex-1 rounded-xl border border-white/15 bg-dusk-900 px-3 py-2 text-xs text-warm-50 placeholder-warm-200/40 focus:border-warm-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-warm-400 px-3 text-dusk-950 hover:bg-warm-300"
                        title="Simpan catatan"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </form>

                    <div className="space-y-1.5">
                      {playerNotes.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-start justify-between gap-2 rounded-xl border border-warm-200/15 bg-warm-400/10 px-3 py-2"
                        >
                          <div>
                            <p className="text-warm-50">{n.text}</p>
                            <p className="mt-0.5 text-[9px] text-warm-300/70">{n.createdAt}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deletePlayerNote(n.id)}
                            className="text-warm-200/45 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === 6. APLIKASI CUACA, GANTI WAKTU BEBAS & PEDOMETER KOTA === */}
            {app === 'weather' && (
              <div className="flex h-full flex-col justify-between overflow-y-auto subtle-scroll p-5 text-warm-50">
                <div className="space-y-3.5">
                  <div className="text-center pt-1">
                    <p className="text-xs text-warm-200/75">{loc.name}</p>
                    <p className="mt-0.5 font-serif text-4xl font-light">{meta.temp}</p>
                    <p className="mt-0.5 text-xs text-warm-200">{meta.desc}</p>
                  </div>

                  {/* Mode Ganti Waktu & Cuaca Bebas */}
                  <div className="rounded-2xl border border-warm-300/30 bg-black/35 p-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                      Ganti Suasana Waktu & Cuaca Bebas
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { id: 'morning', label: 'Pagi', icon: Sun },
                          { id: 'sunset', label: 'Senja', icon: Sunset },
                          { id: 'rain_dusk', label: 'Hujan', icon: CloudRain },
                          { id: 'night', label: 'Malam', icon: Moon },
                        ] as const
                      ).map(({ id, label, icon: Icon }) => {
                        const active = timeOfDay === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setFreeTimeOfDay(id)}
                            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition ${
                              active
                                ? 'bg-warm-400 font-semibold text-dusk-950 shadow'
                                : 'bg-white/5 text-warm-200 hover:bg-white/15'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {timeOfDay === 'rain_dusk' && (
                      <button
                        type="button"
                        onClick={toggleUmbrella}
                        className="mt-2.5 flex w-full items-center justify-between rounded-xl border border-sky-300/30 bg-sky-500/15 px-3 py-1.5 text-[11px] text-sky-100 hover:bg-sky-500/25"
                      >
                        <span className="flex items-center gap-1.5">
                          <Umbrella className="h-3.5 w-3.5 text-sky-300" />
                          <span>Payung Hujan Bening [U]</span>
                        </span>
                        <span className="font-semibold text-sky-300">
                          {umbrellaForcedOff ? 'Dilipat' : 'Otomatis Aktif'}
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-2xl border border-white/15 bg-black/30 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-warm-200/60">Kelembapan</p>
                      <p className="mt-1 font-serif text-lg">{meta.humidity}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-black/30 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-warm-200/60">Angin Kota</p>
                      <p className="mt-1 font-serif text-lg">{meta.wind}</p>
                    </div>
                  </div>

                  {/* Pedometer Real-Time */}
                  <div className="rounded-2xl border border-warm-300/25 bg-black/35 p-3.5">
                    <div className="flex items-center gap-2 text-warm-300">
                      <Footprints className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Langkah Damar Hari Ini
                      </span>
                    </div>
                    <p className="mt-1.5 font-serif text-2xl text-warm-50">
                      {stepCount.toLocaleString('id-ID')}{' '}
                      <span className="text-xs font-sans text-warm-200/65">langkah</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-warm-200/70">
                      Estimasi jarak tempuh: ~{Math.round(stepCount * 0.65)} meter menyusuri kota.
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      toggleMapJournal('map');
                    }}
                    className="rounded-xl border border-white/20 bg-black/40 py-2.5 text-xs font-medium hover:bg-black/60"
                  >
                    Buka Peta Kota
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      setPhotoMode(true);
                    }}
                    className="rounded-xl bg-warm-400 py-2.5 text-xs font-semibold text-dusk-950 hover:bg-warm-300"
                  >
                    Ambil Foto [P]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bar Navigasi Bawah Smartphone */}
          <div className="flex items-center justify-around border-t border-white/10 bg-[#0d111a] py-2.5 text-warm-200/70">
            <button
              type="button"
              onClick={() => {
                if (activeThread) openPhone('chat', '');
                else if (selectedMemory) setSelectedMemory(null);
                else if (selectedCaptureUrl) setSelectedCaptureUrl(null);
                else if (app !== 'home') openPhone('home');
                else closePhone();
              }}
              className="rounded-lg px-4 py-1 hover:bg-white/10 hover:text-warm-50"
              title="Kembali"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMemory(null);
                setSelectedCaptureUrl(null);
                openPhone('home', '');
              }}
              className="rounded-full bg-white/15 px-6 py-1.5 hover:bg-white/25"
              title="Layar Utama HP"
            >
              <Home className="h-4 w-4 text-warm-50" />
            </button>
            <button
              type="button"
              onClick={closePhone}
              className="rounded-lg px-4 py-1 hover:bg-white/10 hover:text-warm-50"
              title="Tutup HP [H / Esc]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};
