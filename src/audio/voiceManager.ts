import { CHARACTERS } from '../data/characters';
import { CharacterId } from '../types/game';

class VoiceDialogueManager {
  private availableFiles = new Set<string>();
  private manifestLoaded = false;
  private currentAudio: HTMLAudioElement | null = null;
  private volume = 0.9;
  private enabled = true;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private speakingListeners = new Set<(speaking: boolean) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadManifest();
      this.refreshVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => this.refreshVoices();
      }
    }
  }

  private async loadManifest() {
    if (this.manifestLoaded) return;
    this.manifestLoaded = true;
    try {
      const res = await fetch('/voices/manifest.json', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as { files?: string[] };
        if (Array.isArray(data.files)) {
          data.files.forEach((f) => this.availableFiles.add(f.replace(/\.mp3$/i, '')));
        }
      }
    } catch {
      // Gunakan fallback Web Speech API secara senyap
    }
  }

  private refreshVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.cachedVoices = window.speechSynthesis.getVoices();
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.stop();
  }

  public onSpeakingChange(cb: (speaking: boolean) => void): () => void {
    this.speakingListeners.add(cb);
    return () => {
      this.speakingListeners.delete(cb);
    };
  }

  private notifySpeaking(state: boolean) {
    this.speakingListeners.forEach((cb) => cb(state));
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notifySpeaking(false);
  }

  /**
   * Memutar dialog suara: prioritas file rekaman asli `/voices/{dialogId}.mp3`,
   * dengan fallback otomatis ke Web Speech API (suara neural Bahasa Indonesia alami per karakter).
   */
  public speak(dialogId: string, speaker: CharacterId, text: string) {
    this.stop();
    if (!this.enabled || this.volume <= 0.01) return;

    const cleanText = text.replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    // 1. Cek file rekaman suara asli jika terdaftar di manifest
    if (this.availableFiles.has(dialogId)) {
      const audio = new Audio(`/voices/${dialogId}.mp3`);
      audio.volume = this.volume * (CHARACTERS[speaker]?.voice.volumeScale ?? 1);
      this.currentAudio = audio;
      this.notifySpeaking(true);
      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.notifySpeaking(false);
        }
      };
      audio.onerror = () => {
        this.currentAudio = null;
        this.speakWithSpeechSynthesis(speaker, cleanText);
      };
      audio.play().catch(() => {
        this.currentAudio = null;
        this.speakWithSpeechSynthesis(speaker, cleanText);
      });
      return;
    }

    // 2. Fallback cerdas ke Web Speech API Bahasa Indonesia
    this.speakWithSpeechSynthesis(speaker, cleanText);
  }

  private selectIndonesianVoice(preferGender: 'male' | 'female' | 'child'): SpeechSynthesisVoice | null {
    if (this.cachedVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
    const idVoices = this.cachedVoices.filter((v) => v.lang.toLowerCase().startsWith('id'));
    if (idVoices.length === 0) return null;

    // Prioritaskan suara neural / natural (Microsoft Ardi/Gadis Online Natural, Google Bahasa Indonesia)
    const maleHints = ['ardi', 'male', 'pria', 'damar', 'andika'];
    const femaleHints = ['gadis', 'female', 'wanita', 'google', 'siti'];

    const matchGender = (v: SpeechSynthesisVoice) => {
      const lower = v.name.toLowerCase();
      if (preferGender === 'male') return maleHints.some((h) => lower.includes(h));
      return femaleHints.some((h) => lower.includes(h));
    };

    const naturalPreferred = idVoices.find(
      (v) => (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google')) && matchGender(v),
    );
    if (naturalPreferred) return naturalPreferred;

    const genderMatch = idVoices.find(matchGender);
    if (genderMatch) return genderMatch;

    const anyNatural = idVoices.find(
      (v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('google'),
    );
    return anyNatural ?? idVoices[0];
  }

  private speakWithSpeechSynthesis(speaker: CharacterId, text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const profile = CHARACTERS[speaker] ?? CHARACTERS.damar;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.pitch = profile.voice.pitch;
    utterance.rate = profile.voice.rate;
    utterance.volume = Math.min(1, this.volume * profile.voice.volumeScale);

    const chosenVoice = this.selectIndonesianVoice(profile.voice.preferGender);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => this.notifySpeaking(true);
    utterance.onend = () => this.notifySpeaking(false);
    utterance.onerror = () => this.notifySpeaking(false);

    window.speechSynthesis.speak(utterance);
  }
}

export const voiceManager = new VoiceDialogueManager();
