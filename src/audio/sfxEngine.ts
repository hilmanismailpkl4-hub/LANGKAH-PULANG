import { SfxType, SurfaceType } from '../types/game';
import { getAudioContext } from './audioContext';

class SfxEngine {
  private volume = 0.72;
  private noiseBuffer: AudioBuffer | null = null;

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const len = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public playFootstep(surface: SurfaceType, running = false) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainScale = (running ? 0.24 : 0.16) * this.volume;

    // Noise burst tersaring sesuai tekstur permukaan
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (surface === 'wood') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(240 + Math.random() * 60, now);
      filter.Q.value = 2.6;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainScale * 1.15, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.11);

      // Resonansi lembut lantai kayu
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(115 + Math.random() * 18, now);
      thud.frequency.exponentialRampToValueAtTime(55, now + 0.08);
      thudGain.gain.setValueAtTime(gainScale * 0.55, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      thud.connect(thudGain).connect(ctx.destination);
      thud.start(now);
      thud.stop(now + 0.1);
    } else if (surface === 'grass') {
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1100 + Math.random() * 400, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gainScale * 0.65, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.16);
    } else {
      // Aspal / trotoar halus
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(680 + Math.random() * 190, now);
      filter.Q.value = 1.4;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gainScale * 0.9, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.085);
    }

    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now, Math.random() * 0.4, 0.18);
  }

  public play(type: SfxType) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const v = this.volume;

    switch (type) {
      case 'interact': {
        this.softTone(ctx, 523.25, now, 0.12, 0.09 * v, 'sine');
        this.softTone(ctx, 659.25, now + 0.05, 0.18, 0.07 * v, 'sine');
        break;
      }
      case 'chime': {
        this.softTone(ctx, 440, now, 0.35, 0.08 * v, 'triangle');
        this.softTone(ctx, 554.37, now + 0.1, 0.42, 0.08 * v, 'sine');
        this.softTone(ctx, 659.25, now + 0.22, 0.65, 0.09 * v, 'sine');
        break;
      }
      case 'phone': {
        // Notifikasi pesan HP realistis lembut (dua nada hangat)
        this.softTone(ctx, 784, now, 0.14, 0.1 * v, 'sine');
        this.softTone(ctx, 1046.5, now + 0.12, 0.28, 0.1 * v, 'sine');
        break;
      }
      case 'page': {
        // Kertas buku harian dibalik
        const src = ctx.createBufferSource();
        src.buffer = this.getNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1750, now);
        filter.frequency.linearRampToValueAtTime(950, now + 0.22);
        filter.Q.value = 1.2;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.11 * v, now + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        src.connect(filter).connect(g).connect(ctx.destination);
        src.start(now, 0.1, 0.26);
        break;
      }
      case 'door': {
        // Pintu kayu/kafe halus
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(72, now + 0.14);
        g.gain.setValueAtTime(0.16 * v, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
        this.softTone(ctx, 880, now + 0.07, 0.35, 0.045 * v, 'sine');
        break;
      }
      case 'coffee': {
        // Denting lembut cangkir keramik
        this.softTone(ctx, 2150, now, 0.14, 0.06 * v, 'sine');
        this.softTone(ctx, 3220, now + 0.015, 0.1, 0.03 * v, 'sine');
        break;
      }
      case 'cat': {
        // Suara ngeong halus kucing
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(760, now + 0.16);
        osc.frequency.linearRampToValueAtTime(480, now + 0.42);
        filter.type = 'lowpass';
        filter.frequency.value = 1400;
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.11 * v, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(filter).connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
        break;
      }
      case 'guitar': {
        // Petikan lembut akor Dmaj9 akustik
        const notes = [293.66, 369.99, 440.0, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          this.pluckedNote(ctx, freq, now + idx * 0.085, 1.8, 0.085 * v);
        });
        break;
      }
      case 'switch': {
        this.softTone(ctx, 420, now, 0.05, 0.08 * v, 'triangle');
        this.softTone(ctx, 620, now + 0.04, 0.07, 0.06 * v, 'sine');
        break;
      }
      case 'horn': {
        // Klakson mobil kota pendek & sopan (dual-tone F4 + A4 terfilter hangat)
        const freqs = [349.23, 440.0];
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const g = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, now);
          filter.type = 'lowpass';
          filter.frequency.value = 950;
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(0.055 * v, now + 0.02);
          g.gain.setValueAtTime(0.05 * v, now + 0.16);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc.connect(filter).connect(g).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
        });
        break;
      }
    }
  }

  private softTone(
    ctx: AudioContext,
    freq: number,
    start: number,
    duration: number,
    peakGain: number,
    type: OscillatorType,
  ) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0008, start);
    g.gain.linearRampToValueAtTime(peakGain, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0008, start + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private pluckedNote(ctx: AudioContext, freq: number, start: number, duration: number, peakGain: number) {
    const osc = ctx.createOscillator();
    const harm = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    harm.type = 'sine';
    harm.frequency.setValueAtTime(freq * 2, start);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, start);
    filter.frequency.exponentialRampToValueAtTime(480, start + duration);

    g.gain.setValueAtTime(0.0008, start);
    g.gain.linearRampToValueAtTime(peakGain, start + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0008, start + duration);

    osc.connect(filter);
    harm.connect(filter);
    filter.connect(g).connect(ctx.destination);
    osc.start(start);
    harm.start(start);
    osc.stop(start + duration + 0.05);
    harm.stop(start + duration + 0.05);
  }
}

export const sfxEngine = new SfxEngine();
