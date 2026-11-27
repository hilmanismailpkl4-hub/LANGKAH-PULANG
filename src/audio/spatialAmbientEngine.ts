import { playerRuntime } from '../store/playerRuntime';
import { TimeOfDay } from '../types/game';
import { getAudioContext } from './audioContext';

/**
 * Mesin Audio Lingkungan Spasial 3D:
 * Menghasilkan 5 lapisan suasana realistis yang intensitasnya berubah mulus mengikuti jarak Damar
 * terhadap Danau/Sungai, Kedai Kopi Bima, Rooftop Menara Nusantara, Kereta Komuter, dan Taman Kota.
 */
class SpatialAmbientEngine {
  private initialized = false;
  private masterVolume = 0.65;

  private masterGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private cafeGain: GainNode | null = null;
  private rooftopGain: GainNode | null = null;
  private trainGain: GainNode | null = null;
  private natureTimer: number | null = null;
  private lastNaturePos: [number, number, number] = [0, 0, 0];
  private lastTimeOfDay: TimeOfDay = 'morning';

  public setVolume(v: number) {
    this.masterVolume = Math.max(0, Math.min(1, v));
    const ctx = getAudioContext();
    if (ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume * 0.75, ctx.currentTime, 0.25);
    }
  }

  private ensureInit() {
    if (this.initialized) return;
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    this.initialized = true;

    const master = ctx.createGain();
    master.gain.value = this.masterVolume * 0.75;
    master.connect(ctx.destination);
    this.masterGain = master;

    // Pink-noise buffer 4 detik halus untuk lapisan spasial
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const out = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + w * 0.09;
      b1 = 0.96 * b1 + w * 0.28;
      b2 = 0.57 * b2 + w * 0.95;
      out[i] = (b0 + b1 + b2 + w * 0.15) * 0.08;
    }

    const createLayer = (filterType: BiquadFilterType, freq: number, q: number): GainNode => {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = freq;
      filter.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      src.connect(filter).connect(g).connect(master);
      src.start();
      return g;
    };

    // 1. Gemericik air danau & aliran sungai
    this.waterGain = createLayer('bandpass', 620, 0.9);
    // 2. Hangat uap espresso & ruang kafe Bima
    this.cafeGain = createLayer('bandpass', 1850, 1.4);
    // 3. Embusan angin lega di ketinggian Rooftop
    this.rooftopGain = createLayer('lowpass', 420, 1.2);
    // 4. Dengung rendah kereta komuter lewat di rel Stasiun Senja
    this.trainGain = createLayer('lowpass', 180, 2.2);

    // 5. Kicau burung pagi / jangkrik malam lembut di area taman & perumahan
    this.natureTimer = window.setInterval(() => {
      this.triggerNatureDetail();
    }, 3400);
  }

  private triggerNatureDetail() {
    if (!this.initialized || this.masterVolume <= 0.04) return;
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running' || !this.masterGain) return;

    const [px, py, pz] = this.lastNaturePos;
    if (py > 10) return;

    // Cek kedekatan dengan Taman Kota, Lembah Sawah Barat Daya, atau Perumahan
    const inPark = px < -56;
    const inNeighborhood = pz > 46 && px > -36 && px < 46;
    if (!inPark && !inNeighborhood) return;
    if (Math.random() > 0.58) return;

    const now = ctx.currentTime;
    if (this.lastTimeOfDay === 'morning' || this.lastTimeOfDay === 'sunset') {
      // Kicau burung kota halus (dua nada lembut tinggi)
      const base = 2400 + Math.random() * 900;
      [0, 0.14].forEach((off, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base + idx * 320, now + off);
        osc.frequency.exponentialRampToValueAtTime(base * 1.18, now + off + 0.08);
        g.gain.setValueAtTime(0.0005, now + off);
        g.gain.linearRampToValueAtTime(0.018 * this.masterVolume, now + off + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0004, now + off + 0.11);
        osc.connect(g).connect(this.masterGain!);
        osc.start(now + off);
        osc.stop(now + off + 0.12);
      });
    } else if (this.lastTimeOfDay === 'night') {
      // Suara jangkrik malam lembut singkat
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4150, now);
      g.gain.setValueAtTime(0.0003, now);
      g.gain.linearRampToValueAtTime(0.011 * this.masterVolume, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0003, now + 0.24);
      osc.connect(g).connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    }
  }

  /**
   * Dipanggil berkala (~6x/detik) untuk memperbarui mixing spasial 3D sesuai posisi Damar & kereta.
   */
  public updateSpatialMix(
    playerPos: [number, number, number],
    trainZ: number,
    timeOfDay: TimeOfDay,
    active: boolean,
  ) {
    this.lastNaturePos = playerPos;
    this.lastTimeOfDay = timeOfDay;

    if (!active) {
      const ctx = getAudioContext();
      if (ctx && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
      }
      return;
    }

    this.ensureInit();
    const ctx = getAudioContext();
    if (!ctx || !this.initialized || !this.masterGain) return;

    const now = ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(this.masterVolume * 0.75, now, 0.25);

    const [px, py, pz] = playerPos;

    // 1. Air: jarak terdekat ke Sungai (x=-48), Danau Senja (-84, -28), atau Kincir Sawah (-62.4, 54.2)
    const distRiver = Math.abs(px - -48);
    const distLake = Math.max(0, Math.hypot(px - -84, pz - -28) - 12);
    const distPaddy = Math.max(0, Math.hypot(px - -74, pz - 60) - 10);
    const minWaterDist = py > 10 ? 99 : Math.min(distRiver, distLake, distPaddy);
    const waterLevel = Math.max(0.0001, (1 - Math.min(1, minWaterDist / 26)) * 0.28);
    this.waterGain?.gain.setTargetAtTime(waterLevel, now, 0.35);

    // 2. Kafe Bima: dekat Kedai Kopi Sudut (-20, 20)
    const distCafe = py > 10 ? 99 : Math.hypot(px - -20, pz - 20.5);
    const cafeLevel = Math.max(0.0001, (1 - Math.min(1, distCafe / 16)) * 0.16);
    this.cafeGain?.gain.setTargetAtTime(cafeLevel, now, 0.35);

    // 3. Angin Rooftop: aktif saat berada di Rooftop Menara Nusantara (y > 14)
    const roofLevel = py > 14 ? 0.34 : 0.0001;
    this.rooftopGain?.gain.setTargetAtTime(roofLevel, now, 0.45);

    // 4. Kereta Komuter: jarak 3D real-time & kecepatan gerak (tenang saat berhenti di peron!)
    const distTrain = Math.hypot(px - 94.3, pz - trainZ);
    const speedFactor = Math.max(0.08, Math.min(1, playerRuntime.trainSpeed / 12.5));
    const trainLevel = Math.max(0.0001, (1 - Math.min(1, distTrain / 46)) * 0.36 * speedFactor);
    this.trainGain?.gain.setTargetAtTime(trainLevel, now, 0.25);
  }

  public dispose() {
    if (this.natureTimer !== null) {
      window.clearInterval(this.natureTimer);
      this.natureTimer = null;
    }
  }
}

export const spatialAmbientEngine = new SpatialAmbientEngine();
