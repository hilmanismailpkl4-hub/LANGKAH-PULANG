import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Battery,
  Camera,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  CloudRain,
  CloudSun,
  Film,
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
  Sparkles,
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
  ReplyToneLabel,
  VOICE_NOTES,
} from '../../data/phoneContent';
import { LOCATION_BY_ID } from '../../data/worldLocations';
import { useGameStore } from '../../store/useGameStore';
import { useMobileViewport } from '../../utils/mobileUtils';
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
  if (theme === 'dinner_quiet') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
        <defs>
          <radialGradient id="lampGlow" cx="50%" cy="18%" r="72%">
            <stop offset="0%" stopColor="#f5c97a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#121015" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="240" height="140" fill="url(#lampGlow)" />
        {/* Lampu gantung kuning ruang makan */}
        <line x1="120" y1="0" x2="120" y2="24" stroke="#3a3028" strokeWidth="2" />
        <polygon points="104,24 136,24 144,36 96,36" fill="#d4a056" />
        <ellipse cx="120" cy="36" rx="18" ry="4" fill="#ffe6a8" />
        {/* Jam dinding 22:15 */}
        <circle cx="42" cy="34" r="14" fill="#231c18" stroke="#8a745c" strokeWidth="2" />
        <line x1="42" y1="34" x2="35" y2="30" stroke="#f5e6cc" strokeWidth="1.8" />
        <line x1="42" y1="34" x2="51" y2="34" stroke="#f5e6cc" strokeWidth="1.4" />
        {/* Meja kayu */}
        <rect x="0" y="92" width="240" height="48" fill="#3a271d" />
        {/* Mangkuk sup ayam dingin di sisi kiri */}
        <path d="M52 84 Q72 104 92 84 Z" fill="#e8dfd2" />
        <ellipse cx="72" cy="84" rx="20" ry="4.5" fill="#d9b26a" />
        {/* Laptop terbuka menyala dingin biru-putih di sisi kanan */}
        <polygon points="146,56 196,56 190,90 140,90" fill="#9bc2e6" stroke="#2c3442" strokeWidth="2.5" />
        <rect x="132" y="90" width="66" height="5" rx="2" fill="#3c4554" />
      </svg>
    );
  }
  if (theme === 'moving_boxes') {
    return (
      <svg viewBox="0 0 240 140" className={`w-full ${h} rounded-lg`}>
        <defs>
          <radialGradient id="bulb2019" cx="50%" cy="22%" r="72%">
            <stop offset="0%" stopColor="#ffe08a" stopOpacity="0.58" />
            <stop offset="55%" stopColor="#3b2b1e" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#1b1512" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="240" height="140" fill="url(#bulb2019)" />
        {/* Jendela ditutup lembaran koran & selotip kertas */}
        <rect x="24" y="26" width="46" height="50" rx="2" fill="#dfd3bc" stroke="#5a4938" strokeWidth="2.5" />
        <line x1="29" y1="36" x2="64" y2="36" stroke="#9e8f77" strokeWidth="1.5" />
        <line x1="29" y1="44" x2="62" y2="44" stroke="#9e8f77" strokeWidth="1.5" />
        <line x1="29" y1="56" x2="65" y2="56" stroke="#9e8f77" strokeWidth="1.5" />
        <rect x="20" y="23" width="12" height="4" fill="#f3e5ab" transform="rotate(-22 26 25)" />
        <rect x="61" y="23" width="12" height="4" fill="#f3e5ab" transform="rotate(24 67 25)" />
        {/* Bohlam 5 watt telanjang di kabel hitam melintir */}
        <path d="M120 0 Q123 12 120 24" stroke="#231c18" strokeWidth="2" fill="none" />
        <rect x="117" y="23" width="6" height="5" fill="#7c7369" />
        <circle cx="120" cy="33" r="6.5" fill="#fff3b0" />
        {/* Lantai keramik ruang tamu kosong */}
        <rect x="0" y="96" width="240" height="44" fill="#cfc5b4" />
        <line x1="0" y1="116" x2="240" y2="116" stroke="#b3a793" strokeWidth="1" />
        <line x1="60" y1="96" x2="42" y2="140" stroke="#b3a793" strokeWidth="1" />
        <line x1="120" y1="96" x2="120" y2="140" stroke="#b3a793" strokeWidth="1" />
        <line x1="180" y1="96" x2="198" y2="140" stroke="#b3a793" strokeWidth="1" />
        {/* Dua kardus buku pindahan */}
        <rect x="154" y="68" width="52" height="34" rx="2" fill="#b8844c" stroke="#7d552c" strokeWidth="1.5" />
        <rect x="162" y="46" width="38" height="22" rx="2" fill="#c8945a" stroke="#7d552c" strokeWidth="1.5" />
        <line x1="154" y1="78" x2="206" y2="78" stroke="#e8d6b3" strokeWidth="2.5" />
        {/* Dua bungkus kertas nasi goreng & satu sendok plastik putih */}
        <polygon points="84,108 106,102 114,114 90,118" fill="#b97a45" />
        <polygon points="118,106 140,102 146,114 122,118" fill="#b97a45" />
        <line x1="108" y1="114" x2="123" y2="105" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="124.5" cy="104" rx="3" ry="2" fill="#ffffff" />
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

const TONE_BADGE_CLASS: Record<ReplyToneLabel, string> = {
  Jujur: 'border-amber-300/45 bg-amber-500/20 text-amber-200',
  Hangat: 'border-rose-300/45 bg-rose-500/20 text-rose-200',
  Tenang: 'border-sky-300/45 bg-sky-500/20 text-sky-200',
  Defensif: 'border-slate-300/35 bg-slate-500/20 text-slate-200',
  'Fokus Kerja': 'border-indigo-300/35 bg-indigo-500/20 text-indigo-200',
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
  const autoTimeCycle = useGameStore((s) => s.autoTimeCycle);
  const toggleAutoTimeCycle = useGameStore((s) => s.toggleAutoTimeCycle);
  const setZenMode = useGameStore((s) => s.setZenMode);
  const setCustomWaypoint = useGameStore((s) => s.setCustomWaypoint);
  const rainbowActiveUntil = useGameStore((s) => s.rainbowActiveUntil);
  const umbrellaForcedOff = useGameStore((s) => s.umbrellaForcedOff);
  const toggleUmbrella = useGameStore((s) => s.toggleUmbrella);
  const isFamilyWalkActive = useGameStore((s) => s.isFamilyWalkActive);
  const toggleFamilyWalk = useGameStore((s) => s.toggleFamilyWalk);
  const flags = useGameStore((s) => s.flags);
  const startDialogue = useGameStore((s) => s.startDialogue);

  const [typingThread, setTypingThread] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ contact: PhoneContactThread; line: string; seconds: number } | null>(null);
  const [galleryTab, setGalleryTab] = useState<'memories' | 'captures'>('memories');
  const [selectedMemory, setSelectedMemory] = useState<MemoryPhotoItem | null>(null);
  const [selectedCaptureUrl, setSelectedCaptureUrl] = useState<{ url: string; title: string; caption: string } | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const { isCompactLandscape } = useMobileViewport();

  useEffect(() => {
    if (app === 'chat' && threadId && chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [app, threadId, repliedPhonePrompts, typingThread]);

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

  const isPromptUnlocked = (p: { chapterMin: number; requiredFlag?: string }) =>
    p.chapterMin <= chapter && (!p.requiredFlag || flags.includes(p.requiredFlag));

  // Hitung total chat yang memiliki prompt balasan belum dijawab pada bab/progres saat ini
  const pendingReplyCount = PHONE_THREADS.reduce((sum, th) => {
    const unanswered = th.prompts.filter(
      (p) => isPromptUnlocked(p) && !repliedPhonePrompts[p.id],
    ).length;
    return sum + unanswered;
  }, 0);

  const flashbacksCompletedCount = [
    'flashback_2018_done',
    'flashback_bridge_2019_done',
    'flashback_melati_2019_done',
    'flashback_2020_done',
    'flashback_dinner_done',
  ].filter((f) => flags.includes(f)).length;

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
      label: 'Balas pesan hangat dari Nadia, Kira, Bima, atau Mas Bagas di aplikasi Pesan',
      done: Object.keys(repliedPhonePrompts).length > 0,
    },
    {
      label: `Hidupkan Kilas Balik Memori Sinematik di Galeri HP atau Album Rumah (${flashbacksCompletedCount}/5)`,
      done: flashbacksCompletedCount > 0,
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
        className={`fixed inset-0 z-[9996] flex items-center justify-center bg-dusk-950/72 backdrop-blur-sm ${
          isCompactLandscape ? 'p-2' : 'p-4'
        }`}
        onClick={closePhone}
      >
        {/* Bingkai Smartphone Modern — otomatis melebar 2-kolom pada layar Landscape HP! */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative flex flex-col overflow-hidden border-[#242a36] bg-dusk-950 text-warm-50 shadow-[0_25px_70px_rgba(0,0,0,0.75)] animate-fadeIn ${
            isCompactLandscape
              ? 'h-[94dvh] max-h-[380px] w-[min(94vw,680px)] rounded-[24px] border-[4px]'
              : 'h-[640px] max-h-[90vh] w-[356px] max-w-[94vw] rounded-[40px] border-[6px]'
          }`}
        >
          {/* Status Bar Realistis */}
          <div
            className={`z-20 flex items-center justify-between bg-black/35 text-[11px] font-medium text-warm-100/90 ${
              isCompactLandscape ? 'px-5 py-1.5' : 'px-6 pt-3 pb-2'
            }`}
          >
            <span>{meta.time}</span>
            <div className={`rounded-full bg-black/80 ${isCompactLandscape ? 'h-2.5 w-14' : 'h-4 w-20'}`} />
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
              <div
                className={`absolute inset-0 z-30 flex bg-dusk-950/95 text-center backdrop-blur-xl animate-fadeIn ${
                  isCompactLandscape
                    ? 'flex-row items-center justify-between gap-4 px-6 py-4'
                    : 'flex-col items-center justify-between p-6'
                }`}
              >
                <div className={isCompactLandscape ? 'shrink-0 space-y-1.5' : 'mt-6 space-y-2'}>
                  <div
                    className={`mx-auto flex items-center justify-center rounded-full font-bold text-white shadow-xl ${
                      isCompactLandscape ? 'h-14 w-14 text-lg' : 'h-20 w-20 text-2xl'
                    }`}
                    style={{ backgroundColor: activeCall.contact.avatarColor }}
                  >
                    {activeCall.contact.initials}
                  </div>
                  <h3 className={`font-serif text-warm-50 ${isCompactLandscape ? 'text-base' : 'text-xl'}`}>
                    {activeCall.contact.name}
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Tersambung · 00:{String(activeCall.seconds).padStart(2, '0')}
                  </p>
                </div>

                <div className="flex-1 rounded-2xl border border-warm-200/20 bg-dusk-900/90 p-3.5 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-warm-300/80">Suara Panggilan</p>
                  <p className={`mt-1 font-serif leading-relaxed text-warm-100 ${isCompactLandscape ? 'text-xs' : 'text-sm'}`}>
                    "{activeCall.line}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={endQuickCall}
                  className={`flex shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-400 ${
                    isCompactLandscape ? 'h-12 w-12' : 'mb-4 h-14 w-14'
                  }`}
                  title="Tutup Panggilan"
                >
                  <PhoneOff className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* === 0. HOME SCREEN PONSEL === */}
            {app === 'home' &&
              (isCompactLandscape ? (
                /* Tata Letak 2-Kolom Mendatar Khusus HP Landscape (Semua Muat Tanpa Scroll!) */
                <div className="grid h-full grid-cols-12 gap-3 p-3.5">
                  {/* Kolom Kiri (5/12): Widget Cuaca, Ajak Keluarga & Dock Cepat */}
                  <div className="col-span-5 flex flex-col justify-between gap-2">
                    <div className="rounded-2xl border border-white/15 bg-black/30 p-3 backdrop-blur-md">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="truncate text-[10px] text-warm-200/75">{loc.name}</p>
                          <p className="font-serif text-2xl font-medium text-warm-50">{meta.temp}</p>
                          <p className="text-[11px] text-warm-200/80">{meta.desc}</p>
                        </div>
                        <div className="rounded-xl bg-warm-400/20 p-2 text-warm-300">
                          {timeOfDay === 'morning' ? (
                            <Sun className="h-5 w-5" />
                          ) : timeOfDay === 'sunset' ? (
                            <Sunset className="h-5 w-5" />
                          ) : timeOfDay === 'rain_dusk' ? (
                            <CloudRain className="h-5 w-5" />
                          ) : (
                            <Moon className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[10px] text-warm-200/80">
                        <span className="flex items-center gap-1">
                          <Footprints className="h-3 w-3 text-warm-300" />
                          {stepCount.toLocaleString('id-ID')} langkah
                        </span>
                        <span className="text-warm-300">Bab {chapter}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        closePhone();
                        toggleFamilyWalk();
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[11px] transition ${
                        isFamilyWalkActive
                          ? 'border-rose-300/45 bg-rose-500/20 text-rose-100'
                          : 'border-white/15 bg-black/30 text-warm-100'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <Heart className={`h-3.5 w-3.5 text-rose-300 ${isFamilyWalkActive ? 'fill-rose-300' : ''}`} />
                        <span>{isFamilyWalkActive ? 'Antar Keluarga Pulang' : 'Ajak Keluarga Jalan'}</span>
                      </span>
                    </button>

                    <div className="flex items-center justify-around rounded-xl border border-white/10 bg-black/35 px-2 py-1.5 backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => {
                          closePhone();
                          setPhotoMode(true);
                        }}
                        className="flex items-center gap-1 text-[10px] text-warm-200 hover:text-warm-50"
                      >
                        <Camera className="h-4 w-4 text-warm-300" />
                        <span>Kamera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closePhone();
                          toggleMapJournal('map');
                        }}
                        className="flex items-center gap-1 text-[10px] text-warm-200 hover:text-warm-50"
                      >
                        <MapIcon className="h-4 w-4 text-sky-300" />
                        <span>Peta</span>
                      </button>
                      <button
                        type="button"
                        onClick={closePhone}
                        className="flex items-center gap-1 text-[10px] text-warm-200 hover:text-warm-50"
                      >
                        <X className="h-4 w-4 text-warm-200/75" />
                        <span>Tutup</span>
                      </button>
                    </div>
                  </div>

                  {/* Kolom Kanan (7/12): Grid 6 Aplikasi Lega 3x2 */}
                  <div className="col-span-7 grid grid-cols-3 content-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
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
                          className="group flex flex-col items-center gap-1 active:scale-95"
                        >
                          <div
                            className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} text-white shadow-lg transition group-hover:scale-105`}
                          >
                            <Icon className="h-5 w-5" />
                            {item.badge > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-warm-100/90">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
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
              ))}

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
                    const visibleMsgs = th.messages.filter((m) => isPromptUnlocked(m));
                    const lastMsg = visibleMsgs[visibleMsgs.length - 1];
                    const pendingCount = th.prompts.filter(
                      (p) => isPromptUnlocked(p) && !repliedPhonePrompts[p.id],
                    ).length;
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
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow"
                          style={{ backgroundColor: th.avatarColor }}
                        >
                          {th.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-warm-50">{th.name}</p>
                            <span className="shrink-0 text-[10px] text-warm-200/50">{lastMsg?.time}</span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-warm-200/70">
                            {lastMsg?.text}
                          </p>
                        </div>
                        {pendingCount > 0 && (
                          <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-dusk-950 shadow">
                            {pendingCount}
                          </span>
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
                <div ref={chatScrollRef} className="flex-1 space-y-2.5 overflow-y-auto subtle-scroll p-3.5 text-xs">
                  {activeThread.messages
                    .filter((m) => isPromptUnlocked(m))
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
                    .filter((p) => isPromptUnlocked(p) && repliedPhonePrompts[p.id])
                    .map((p, idx, arr) => {
                      const chosen = p.options.find((o) => o.id === repliedPhonePrompts[p.id]);
                      if (!chosen) return null;
                      const isLatestTyping = typingThread === activeThread.id && idx === arr.length - 1;
                      return (
                        <React.Fragment key={p.id}>
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-700/85 px-3.5 py-2.5 text-white shadow">
                              <p className="leading-relaxed">{chosen.text}</p>
                              <div className="mt-1 flex items-center justify-end gap-1.5 text-[9px] text-emerald-100/75">
                                <span className="opacity-80">{chosen.toneLabel}</span>
                                <span>·</span>
                                <span className="text-sky-200">Dibaca ✓✓</span>
                              </div>
                            </div>
                          </div>
                          {!isLatestTyping && (
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
                    <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-dusk-800/90 px-3.5 py-2 text-[11px] italic text-emerald-200/90">
                      <span>sedang mengetik</span>
                      <span className="inline-flex gap-0.5">
                        <span className="h-1 w-1 animate-bounce rounded-full bg-emerald-300" />
                        <span className="h-1 w-1 animate-bounce rounded-full bg-emerald-300 [animation-delay:120ms]" />
                        <span className="h-1 w-1 animate-bounce rounded-full bg-emerald-300 [animation-delay:240ms]" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Pilihan Balasan Cepat */}
                {(() => {
                  const nextPrompt = activeThread.prompts.find(
                    (p) => isPromptUnlocked(p) && !repliedPhonePrompts[p.id],
                  );
                  if (!nextPrompt) {
                    return (
                      <div className="border-t border-white/10 bg-dusk-900/80 px-4 py-2.5 text-center text-[11px] text-warm-200/50">
                        Semua pesan di obrolan ini sudah kamu balas.
                      </div>
                    );
                  }
                  return (
                    <div className="max-h-[46%] space-y-1.5 overflow-y-auto subtle-scroll border-t border-white/10 bg-dusk-900/95 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-warm-300">
                          Pilih Balasan Damar
                        </p>
                        {nextPrompt.contextHint && (
                          <span className="truncate text-[9.5px] italic text-warm-200/60">
                            {nextPrompt.contextHint}
                          </span>
                        )}
                      </div>
                      {nextPrompt.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSendReply(nextPrompt.id, opt, activeThread)}
                          className="group flex w-full items-start justify-between gap-2 rounded-xl border border-emerald-400/25 bg-emerald-950/35 px-3 py-2 text-left text-[11px] text-warm-50 transition hover:border-emerald-300/60 hover:bg-emerald-900/50"
                        >
                          <div className="space-y-1">
                            <span
                              className={`inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-semibold leading-none ${
                                TONE_BADGE_CLASS[opt.toneLabel]
                              }`}
                            >
                              {opt.toneLabel}
                            </span>
                            <p className="leading-snug">{opt.text}</p>
                          </div>
                          <Send className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-300 transition group-hover:translate-x-0.5" />
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
                    {VOICE_NOTES.filter(
                      (v) => v.chapterMin <= chapter && (!v.requiredFlag || flags.includes(v.requiredFlag)),
                    ).map((vn) => {
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
                      {selectedMemory.flashbackDialogueId && (
                        <button
                          type="button"
                          onClick={() => {
                            const fbId = selectedMemory.flashbackDialogueId!;
                            setSelectedMemory(null);
                            closePhone();
                            startDialogue(fbId);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-gradient-to-r from-amber-500/85 to-warm-400 px-4 py-2.5 text-xs font-semibold text-dusk-950 shadow-lg transition hover:brightness-105"
                        >
                          <Film className="h-4 w-4" />
                          <span>
                            {selectedMemory.flashbackFlag && flags.includes(selectedMemory.flashbackFlag)
                              ? 'Putar Ulang Kilas Balik Sinematik'
                              : 'Hidupkan Kilas Balik Sinematik'}
                          </span>
                        </button>
                      )}
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
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between rounded-xl border border-amber-300/25 bg-amber-500/10 px-3 py-2 text-[10.5px] text-amber-100/90">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                          <span>Foto bertanda <strong>Kilas Balik</strong> dapat dihidupkan!</span>
                        </span>
                        <span className="font-mono text-amber-300">{flashbacksCompletedCount}/4</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {MEMORY_PHOTOS.filter((m) => m.chapterMin <= chapter).map((m) => {
                          const hasFb = Boolean(m.flashbackDialogueId);
                          const fbDone = Boolean(m.flashbackFlag && flags.includes(m.flashbackFlag));
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                sfxEngine.play('interact');
                                setSelectedMemory(m);
                              }}
                              className={`relative overflow-hidden rounded-xl border p-1.5 text-left transition ${
                                hasFb
                                  ? 'border-amber-300/35 bg-dusk-900/80 hover:border-amber-300/80'
                                  : 'border-white/10 bg-dusk-900/70 hover:border-warm-300/50'
                              }`}
                            >
                              <div className="relative">
                                <MemoryIllustration theme={m.theme} />
                                {hasFb && (
                                  <span
                                    className={`absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold shadow ${
                                      fbDone
                                        ? 'bg-emerald-500/90 text-dusk-950'
                                        : 'bg-amber-400/95 text-dusk-950'
                                    }`}
                                  >
                                    <Film className="h-2.5 w-2.5" />
                                    {fbDone ? 'Terkenang' : m.flashbackBadge ?? 'Kilas Balik'}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1.5 truncate text-[11px] font-medium text-warm-100">{m.title}</p>
                              <p className="truncate text-[9px] text-warm-200/55">{m.dateLabel}</p>
                            </button>
                          );
                        })}
                      </div>
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
                    <button
                      type="button"
                      onClick={toggleAutoTimeCycle}
                      className={`mt-2 flex w-full items-center justify-between rounded-xl border px-3 py-1.5 text-[11px] transition ${
                        autoTimeCycle
                          ? 'border-emerald-300/45 bg-emerald-500/20 text-emerald-100'
                          : 'border-white/15 bg-white/5 text-warm-200/80 hover:bg-white/10'
                      }`}
                    >
                      <span>Siklus Langit & Pelangi Otomatis</span>
                      <span className="font-semibold">{autoTimeCycle ? 'AKTIF' : 'MANUAL'}</span>
                    </button>
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
                    {rainbowActiveUntil > Date.now() && (timeOfDay === 'morning' || timeOfDay === 'sunset') ? (
                      <p className="mt-2.5 rounded-xl border border-amber-300/35 bg-gradient-to-r from-rose-500/15 via-amber-400/15 to-sky-400/15 px-3 py-1.5 text-[10px] leading-relaxed text-warm-100">
                        Pelangi tipis sedang melengkung di langit barat di atas Danau Senja!
                      </p>
                    ) : timeOfDay === 'rain_dusk' ? (
                      <p className="mt-2 text-[10px] leading-relaxed text-warm-200/65">
                        Tips: Ubah cuaca ke Pagi atau Senja setelah hujan untuk melihat pelangi tipis di langit barat.
                      </p>
                    ) : null}
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

                  {/* Kompas Cepat Sudut Teduh & Baru Kota Senja */}
                  <div className="rounded-2xl border border-cyan-300/25 bg-black/35 p-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                      Pasang GPS Cepat ke Sudut Istimewa Kota
                    </p>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                      {[
                        { label: 'Saung Bambu Lembah Sawah Senja', pos: [-68.5, 0, 54.4] as [number, number, number] },
                        { label: 'Paviliun Bambu Teduh Utara Danau', pos: [-77.5, 0.16, -49.5] as [number, number, number] },
                        { label: 'Koridor Bunga Tabebuya Stasiun', pos: [58.5, 0, 28.2] as [number, number, number] },
                        { label: 'Taman Saku & Saron Sungai Utara', pos: [-33.2, 0, -37.2] as [number, number, number] },
                        { label: 'Lift Sky Garden Rooftop Menara', pos: [19.5, 0.08, -24.1] as [number, number, number] },
                      ].map((spot) => (
                        <button
                          key={spot.label}
                          type="button"
                          onClick={() => {
                            sfxEngine.play('interact');
                            setCustomWaypoint({ label: spot.label, position: spot.pos });
                            closePhone();
                          }}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-left text-warm-100 hover:border-cyan-300/50 hover:bg-cyan-500/15"
                        >
                          <span>{spot.label}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-cyan-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      toggleMapJournal('map');
                    }}
                    className="rounded-xl border border-white/20 bg-black/40 py-2.5 text-[11px] font-medium hover:bg-black/60"
                  >
                    Peta [M]
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      setZenMode(true);
                    }}
                    className="rounded-xl border border-amber-300/35 bg-amber-500/15 py-2.5 text-[11px] font-medium text-amber-200 hover:bg-amber-500/25"
                  >
                    Sinema [Z]
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closePhone();
                      setPhotoMode(true);
                    }}
                    className="rounded-xl bg-warm-400 py-2.5 text-[11px] font-semibold text-dusk-950 hover:bg-warm-300"
                  >
                    Foto [P]
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bar Navigasi Bawah Smartphone */}
          <div
            className={`flex items-center justify-around border-t border-white/10 bg-[#0d111a] text-warm-200/70 ${
              isCompactLandscape ? 'py-1.5' : 'py-2.5'
            }`}
          >
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
