import { TimeOfDay } from '../types/game';
import { getAudioContext } from './audioContext';

export type MusicMood = 'title' | 'home' | 'cafe' | 'office' | 'park' | 'city' | 'rooftop' | 'ending';

interface ChordStep {
  bass: number;
  notes: number[];
}

// Progresi akor lembut & emosional (D mayor / B minor / G maj7 — hangat, reflektif, tidak melelahkan)
const PROGRESSIONS: Record<MusicMood, ChordStep[]> = {
  title: [
    { bass: 146.83, notes: [293.66, 369.99, 440.0, 554.37] }, // Dmaj7
    { bass: 123.47, notes: [246.94, 293.66, 369.99, 440.0] }, // Bm7
    { bass: 98.0, notes: [246.94, 293.66, 369.99, 493.88] }, // Gmaj7
    { bass: 110.0, notes: [220.0, 277.18, 329.63, 440.0] }, // A6
  ],
  home: [
    { bass: 130.81, notes: [261.63, 329.63, 392.0, 493.88] }, // Cmaj7
    { bass: 110.0, notes: [261.63, 329.63, 392.0, 523.25] }, // Am7
    { bass: 87.31, notes: [220.0, 261.63, 329.63, 392.0] }, // Fmaj7
    { bass: 98.0, notes: [246.94, 293.66, 392.0, 440.0] }, // G6
  ],
  cafe: [
    { bass: 146.83, notes: [293.66, 349.23, 440.0, 523.25] }, // Dm7
    { bass: 98.0, notes: [246.94, 293.66, 349.23, 440.0] }, // G9
    { bass: 130.81, notes: [261.63, 329.63, 392.0, 493.88] }, // Cmaj7
    { bass: 110.0, notes: [220.0, 261.63, 329.63, 392.0] }, // Am7
  ],
  office: [
    { bass: 110.0, notes: [220.0, 261.63, 329.63] }, // Am
    { bass: 98.0, notes: [196.0, 246.94, 293.66] }, // G
    { bass: 87.31, notes: [174.61, 220.0, 261.63] }, // F
    { bass: 82.41, notes: [164.81, 246.94, 329.63] }, // Em
  ],
  park: [
    { bass: 146.83, notes: [293.66, 369.99, 440.0, 587.33] }, // Dadd9
    { bass: 123.47, notes: [246.94, 329.63, 369.99, 493.88] }, // Bm11
    { bass: 98.0, notes: [196.0, 293.66, 369.99, 440.0] }, // Gmaj9
    { bass: 110.0, notes: [220.0, 293.66, 329.63, 440.0] }, // Asus4
  ],
  city: [
    { bass: 123.47, notes: [246.94, 293.66, 369.99, 440.0] },
    { bass: 98.0, notes: [196.0, 246.94, 293.66, 369.99] },
    { bass: 146.83, notes: [293.66, 369.99, 440.0, 554.37] },
    { bass: 110.0, notes: [220.0, 277.18, 329.63, 392.0] },
  ],
  rooftop: [
    { bass: 98.0, notes: [246.94, 293.66, 369.99, 554.37] },
    { bass: 110.0, notes: [220.0, 293.66, 369.99, 493.88] },
    { bass: 123.47, notes: [246.94, 293.66, 369.99, 587.33] },
    { bass: 146.83, notes: [293.66, 369.99, 440.0, 659.25] },
  ],
  ending: [
    { bass: 146.83, notes: [293.66, 369.99, 440.0, 554.37, 659.25] },
    { bass: 123.47, notes: [246.94, 293.66, 369.99, 440.0, 587.33] },
    { bass: 98.0, notes: [196.0, 246.94, 293.66, 369.99, 493.88] },
    { bass: 110.0, notes: [220.0, 277.18, 329.63, 440.0, 554.37] },
  ],
};

class AmbientMusicEngine {
  private isRunning = false;
  private isPausedByRadio = false;
  private overrideMood: MusicMood | null = null;
  private volume = 0.55;
  private mood: MusicMood = 'title';
  private timeOfDay: TimeOfDay = 'morning';
  private timerId: number | null = null;
  private stepIdx = 0;

  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private breezeGain: GainNode | null = null;
  private breezeSource: AudioBufferSourceNode | null = null;

  public start() {
    if (this.isRunning) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.65, ctx.currentTime + 2.0);
    this.masterGain.connect(ctx.destination);

    this.initAmbientNoise(ctx);
    this.isRunning = true;
    this.scheduleLoop();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    try {
      this.rainSource?.stop();
      this.breezeSource?.stop();
    } catch {
      // Abaikan jika sudah berhenti
    }
    this.rainSource = null;
    this.breezeSource = null;
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    const ctx = getAudioContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.65, ctx.currentTime, 0.25);
    }
  }

  public setContext(mood: MusicMood, timeOfDay: TimeOfDay) {
    this.mood = mood;
    this.timeOfDay = timeOfDay;
    this.updateAmbientLayers();
  }

  public setRadioOverride(mood: MusicMood | null) {
    this.overrideMood = mood;
  }

  public setRadioPaused(paused: boolean) {
    this.isPausedByRadio = paused;
  }

  private initAmbientNoise(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Buat pink-ish noise halus untuk suara hujan lembut & angin kota
    const seconds = 4;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const out = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < out.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      out[i] = (b0 + b1 + b2 + white * 0.1848) * 0.06;
    }

    // Lapisan hujan lembut (aktif saat rain_dusk)
    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = buf;
    rainSrc.loop = true;
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'bandpass';
    rainFilter.frequency.value = 1350;
    rainFilter.Q.value = 0.65;
    const rGain = ctx.createGain();
    rGain.gain.value = 0.0001;
    rainSrc.connect(rainFilter).connect(rGain).connect(this.masterGain);
    rainSrc.start();
    this.rainSource = rainSrc;
    this.rainGain = rGain;

    // Lapisan angin/kota tenang
    const breezeSrc = ctx.createBufferSource();
    breezeSrc.buffer = buf;
    breezeSrc.loop = true;
    const breezeFilter = ctx.createBiquadFilter();
    breezeFilter.type = 'lowpass';
    breezeFilter.frequency.value = 340;
    const bGain = ctx.createGain();
    bGain.gain.value = 0.05;
    breezeSrc.connect(breezeFilter).connect(bGain).connect(this.masterGain);
    breezeSrc.start();
    this.breezeSource = breezeSrc;
    this.breezeGain = bGain;

    this.updateAmbientLayers();
  }

  private updateAmbientLayers() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (this.rainGain) {
      const targetRain = this.timeOfDay === 'rain_dusk' ? 0.34 : 0.0001;
      this.rainGain.gain.setTargetAtTime(targetRain, ctx.currentTime, 1.4);
    }
    if (this.breezeGain) {
      const targetBreeze =
        this.mood === 'rooftop' ? 0.14 : this.mood === 'park' ? 0.09 : this.mood === 'home' ? 0.025 : 0.06;
      this.breezeGain.gain.setTargetAtTime(targetBreeze, ctx.currentTime, 1.2);
    }
  }

  private scheduleLoop() {
    this.playBar();
    this.timerId = window.setInterval(() => {
      if (!this.isRunning) return;
      this.playBar();
    }, 4600);
  }

  private playBar() {
    const ctx = getAudioContext();
    if (!ctx || !this.masterGain || ctx.state !== 'running' || this.isPausedByRadio) return;

    const now = ctx.currentTime + 0.05;
    const activeMood = this.overrideMood ?? this.mood;
    const prog = PROGRESSIONS[activeMood] || PROGRESSIONS.city;
    const chord = prog[this.stepIdx % prog.length];
    this.stepIdx++;

    // 1. Cello / Warm Pad Bass lembut
    this.playWarmCello(ctx, chord.bass, now, 4.5, activeMood === 'office' ? 0.055 : 0.085);

    // 2. Felt Piano lembut pada ketukan 1 dan 3
    this.playFeltPiano(ctx, chord.notes[0], now, 3.4, 0.075);
    this.playFeltPiano(ctx, chord.notes[2 % chord.notes.length], now + 0.35, 3.0, 0.055);

    // 3. Petikan gitar akustik / melodi piano arpeggio bergantian
    const arpeggioTimes = [1.1, 1.85, 2.65, 3.45];
    arpeggioTimes.forEach((offset, idx) => {
      if (Math.random() > 0.22) {
        const freq = chord.notes[(idx + this.stepIdx) % chord.notes.length];
        const octave = idx === 3 && Math.random() > 0.5 ? 2 : 1;
        if (activeMood === 'cafe' || activeMood === 'park' || activeMood === 'ending') {
          this.playAcousticGuitar(ctx, freq * octave, now + offset, 2.1, 0.048);
        } else {
          this.playFeltPiano(ctx, freq * octave, now + offset, 2.4, 0.045);
        }
      }
    });
  }

  private playWarmCello(ctx: AudioContext, freq: number, start: number, dur: number, peak: number) {
    if (!this.masterGain) return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, start);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.003, start);

    filter.type = 'lowpass';
    filter.frequency.value = 420;

    g.gain.setValueAtTime(0.0005, start);
    g.gain.linearRampToValueAtTime(peak, start + 1.1);
    g.gain.setValueAtTime(peak * 0.88, start + dur - 1.2);
    g.gain.exponentialRampToValueAtTime(0.0005, start + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(g).connect(this.masterGain);
    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + dur + 0.08);
    osc2.stop(start + dur + 0.08);
  }

  private playFeltPiano(ctx: AudioContext, freq: number, start: number, dur: number, peak: number) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, start);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1150, start);
    filter.frequency.exponentialRampToValueAtTime(360, start + dur);

    g.gain.setValueAtTime(0.0005, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.045);
    g.gain.exponentialRampToValueAtTime(0.0006, start + dur);

    const overGain = ctx.createGain();
    overGain.gain.value = 0.22;

    osc.connect(filter);
    overtone.connect(overGain).connect(filter);
    filter.connect(g).connect(this.masterGain);
    osc.start(start);
    overtone.start(start);
    osc.stop(start + dur + 0.06);
    overtone.stop(start + dur + 0.06);
  }

  private playAcousticGuitar(ctx: AudioContext, freq: number, start: number, dur: number, peak: number) {
    if (!this.masterGain) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, start);
    filter.frequency.exponentialRampToValueAtTime(340, start + dur);

    g.gain.setValueAtTime(0.0005, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0005, start + dur);

    osc.connect(filter).connect(g).connect(this.masterGain);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }
}

export const musicEngine = new AmbientMusicEngine();
