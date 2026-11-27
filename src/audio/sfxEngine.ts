import { SfxType, SurfaceType } from '../types/game';
import { getAudioContext } from './audioContext';

class SfxEngine {
  private volume = 0.72;
  private noiseBuffer: AudioBuffer | null = null;
  private scooterOsc: OscillatorNode | null = null;
  private scooterGain: GainNode | null = null;

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  /**
   * Suara mesin motor matic lembut (frekuensi naik halus mengikuti kecepatan berkendara).
   */
  public setScooterEngine(active: boolean, speedRatio = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (!active || this.volume <= 0.01) {
      if (this.scooterGain) {
        this.scooterGain.gain.setTargetAtTime(0.0001, now, 0.12);
      }
      return;
    }

    if (!this.scooterOsc || !this.scooterGain) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 54;
      filter.type = 'lowpass';
      filter.frequency.value = 185;
      gain.gain.value = 0.0001;
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start();
      this.scooterOsc = osc;
      this.scooterGain = gain;
    }

    const clamped = Math.max(0, Math.min(1, speedRatio));
    const targetFreq = 52 + clamped * 68;
    const targetGain = (0.045 + clamped * 0.04) * this.volume;
    this.scooterOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.scooterGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  /**
   * Klakson motor skuter khas Indonesia ("tin-tin!" lembut & sopan).
   */
  public playScooterHorn() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;
    [0, 0.13].forEach((offset) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now + offset);
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
      g.gain.setValueAtTime(0.001, now + offset);
      g.gain.linearRampToValueAtTime(0.055 * v, now + offset + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
      osc.connect(filter).connect(g).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });
  }

  /**
   * Bel sepeda klasik nyaring & ceria ("KRING-KRING!").
   */
  public playBicycleBell() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Dua dentingan cepat khas bel sepeda kuningan
    [0, 0.145].forEach((offset) => {
      [
        { freq: 2140, gain: 0.095, dur: 0.42 },
        { freq: 3210, gain: 0.055, dur: 0.34 },
        { freq: 4480, gain: 0.032, dur: 0.22 },
      ].forEach((part) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(part.freq, now + offset);
        g.gain.setValueAtTime(0.0008, now + offset);
        g.gain.linearRampToValueAtTime(part.gain * v, now + offset + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0005, now + offset + part.dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + part.dur + 0.03);
      });
    });
  }

  /**
   * Suara desis wajan & didihan sup hangat di dapur Rumah Jl. Melati No. 14.
   */
  public playKitchenSizzle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Desis lembut minyak/kuah hangat (filtered white noise)
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.linearRampToValueAtTime(1650, now + 0.75);
    filter.Q.value = 0.85;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.085 * v, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.82);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(now, 0.05, 0.85);

    // Denting sendok/mangkuk hangat tanda masakan siap
    this.softTone(ctx, 1320, now + 0.35, 0.25, 0.055 * v, 'sine');
    this.softTone(ctx, 1760, now + 0.46, 0.35, 0.05 * v, 'sine');
  }

  /**
   * Suara kepakan sayap lembut burung merpati taman saat terbang melintas.
   */
  public playPigeonFlutter() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    [0, 0.09, 0.18, 0.28].forEach((offset, idx) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 520 + idx * 75;
      filter.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + offset);
      g.gain.linearRampToValueAtTime(0.065 * v, now + offset + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.075);
      src.connect(filter).connect(g).connect(ctx.destination);
      src.start(now + offset, (idx * 0.13) % 0.6, 0.085);
    });
  }

  /**
   * Bel peron Stasiun Senja (khas stasiun komuter Indonesia: melodi 3 nada kedatangan & bel peringatan keberangkatan).
   */
  public playStationBell(kind: 'arrive' | 'depart', distanceFactor = 1) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume * Math.max(0.18, Math.min(1, distanceFactor));

    if (kind === 'arrive') {
      // Melodi ramah 3 nada kedatangan peron ("ding-dong-ding" hangat)
      const chimeNotes = [
        { freq: 659.25, t: 0.0, dur: 0.48 },
        { freq: 523.25, t: 0.28, dur: 0.48 },
        { freq: 783.99, t: 0.56, dur: 0.85 },
      ];
      chimeNotes.forEach((n) => {
        this.softTone(ctx, n.freq, now + n.t, n.dur, 0.095 * v, 'sine');
        this.softTone(ctx, n.freq * 2, now + n.t, n.dur * 0.6, 0.028 * v, 'triangle');
      });
    } else {
      // Bel pintu akan ditutup / kereta berangkat ("ting-ting-ting" tegas lembut)
      [0, 0.24, 0.48].forEach((offset) => {
        this.softTone(ctx, 880, now + offset, 0.22, 0.085 * v, 'sine');
        this.softTone(ctx, 1318.5, now + offset, 0.18, 0.04 * v, 'triangle');
      });
    }
  }

  /**
   * Bunyi melodi bel penjual roti keliling pagi khas perumahan Indonesia!
   */
  public playBreadVendorBell(distanceFactor = 1) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume * Math.max(0.16, Math.min(1, distanceFactor));
    // Melodi ceria 5 nada ala bel roti pagi (C5 - E5 - G5 - E5 - C6)
    const notes = [
      { freq: 523.25, t: 0.0, dur: 0.16 },
      { freq: 659.25, t: 0.16, dur: 0.16 },
      { freq: 783.99, t: 0.32, dur: 0.18 },
      { freq: 659.25, t: 0.52, dur: 0.16 },
      { freq: 1046.5, t: 0.68, dur: 0.36 },
    ];
    notes.forEach((n) => {
      this.softTone(ctx, n.freq, now + n.t, n.dur, 0.072 * v, 'triangle');
      this.softTone(ctx, n.freq * 2, now + n.t, n.dur * 0.7, 0.022 * v, 'sine');
    });
  }

  /**
   * Bunyi kentongan bambu berongga khas Pos Kamling Indonesia ("tok-tok... tok-tok-tok!").
   */
  public playKentongan() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Pola ketukan ronda malam yang ramah & berwibawa
    const hits = [0.0, 0.2, 0.52, 0.68, 0.84];
    hits.forEach((offset, idx) => {
      const pitch = idx % 2 === 0 ? 355 : 388;
      // Resonansi rongga bambu
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch * 1.12, now + offset);
      osc.frequency.exponentialRampToValueAtTime(pitch, now + offset + 0.065);
      filter.type = 'bandpass';
      filter.frequency.value = pitch * 2.1;
      filter.Q.value = 3.2;
      g.gain.setValueAtTime(0.001, now + offset);
      g.gain.linearRampToValueAtTime(0.22 * v, now + offset + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0008, now + offset + 0.14);
      osc.connect(filter).connect(g).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.16);

      // Tambahan nada dasar hangat kayu bambu
      this.softTone(ctx, pitch, now + offset, 0.11, 0.085 * v, 'sine');
    });
  }

  /**
   * Suara desis lembut bara arang & bumbu kacang sate yang dipanggang di Gerobak Cak Mat.
   */
  public playCharcoalSizzle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    [0, 0.28].forEach((offset, idx) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2900 - idx * 450, now + offset);
      filter.frequency.linearRampToValueAtTime(1750, now + offset + 0.45);
      filter.Q.value = 1.2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + offset);
      g.gain.linearRampToValueAtTime(0.075 * v, now + offset + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.5);
      src.connect(filter).connect(g).connect(ctx.destination);
      src.start(now + offset, idx * 0.2, 0.52);
    });
  }

  /**
   * Bunyi peluit kayu mainan lembut ("tut-tut!") saat kereta kayu Kira dinyalakan di ruang tamu.
   */
  public playToyTrainWhistle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Dua tiupan peluit kayu manis (F5 + A5 lembut)
    [
      { t: 0, dur: 0.16 },
      { t: 0.22, dur: 0.26 },
    ].forEach((b) => {
      this.softTone(ctx, 698.46, now + b.t, b.dur, 0.068 * v, 'triangle');
      this.softTone(ctx, 880.0, now + b.t, b.dur, 0.048 * v, 'sine');
    });
  }

  /**
   * Bunyi tepokan kok bulu tangkis yang renyah ("plok!") saat rally di Lapangan Gang Melati.
   */
  public playBadmintonHit(distanceFactor = 1) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume * Math.max(0.2, Math.min(1, distanceFactor));

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(640 + Math.random() * 75, now);
    osc.frequency.exponentialRampToValueAtTime(195, now + 0.055);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.14 * v, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.075);
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.085);

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1850;
    filter.Q.value = 2.0;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.001, now);
    ng.gain.linearRampToValueAtTime(0.07 * v, now + 0.004);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    src.connect(filter).connect(ng).connect(ctx.destination);
    src.start(now, Math.random() * 0.3, 0.055);
  }

  /**
   * Bunyi khas ketukan sendok pada mangkuk porselen gerobak bakso keliling ("ting-ting... ting-ting-ting!").
   */
  public playBaksoClink(distanceFactor = 1) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume * Math.max(0.16, Math.min(1, distanceFactor));
    // Pola ritmis khas tukang bakso malam Indonesia
    const hits = [0.0, 0.16, 0.42, 0.56, 0.7];
    hits.forEach((offset, idx) => {
      const base = idx % 2 === 0 ? 1880 : 1940;
      this.softTone(ctx, base, now + offset, 0.14, 0.068 * v, 'sine');
      this.softTone(ctx, base * 1.82, now + offset, 0.09, 0.032 * v, 'triangle');
    });
  }

  /**
   * Suara gemericik lembut air dari gembor saat menyiram pot bunga Nadia di halaman rumah.
   */
  public playWateringSpray() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 3 pancuran lembut beruntun seperti air mengalir dari corong gembor
    [0, 0.42, 0.85].forEach((offset, idx) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1950 + idx * 180, now + offset);
      filter.frequency.linearRampToValueAtTime(1400, now + offset + 0.48);
      filter.Q.value = 1.1;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + offset);
      g.gain.linearRampToValueAtTime(0.085 * v, now + offset + 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.52);
      src.connect(filter).connect(g).connect(ctx.destination);
      src.start(now + offset, (idx * 0.21) % 0.5, 0.55);
    });

    // Denting halus menyegarkan di akhir siraman
    this.softTone(ctx, 880, now + 0.72, 0.26, 0.038 * v, 'sine');
    this.softTone(ctx, 1174.66, now + 0.86, 0.36, 0.042 * v, 'sine');
  }

  /**
   * Denting hangat lonceng angin bambu berongga (nada pentatonis kayu alami) di teras Rumah Jl. Melati.
   */
  public playBambooWindChime(intensity = 1) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume * Math.max(0.18, Math.min(1, intensity));

    // 5 tabung bambu bertala pentatonis hangat (D5, E5, G5, A5, C6) dengan karakter kayu berongga
    const notes = [587.33, 659.25, 783.99, 880.0, 1046.5];
    const pattern = intensity > 0.7 ? [0, 2, 1, 4, 3, 2] : [0, 3, 1];
    pattern.forEach((nIdx, i) => {
      const t = now + i * (0.12 + (i % 2) * 0.05);
      const base = notes[nIdx];
      // Nada dasar kayu bambu (triangle teredam hangat) + resonansi rongga pendek
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * 0.985, t + 0.24);
      filter.type = 'bandpass';
      filter.frequency.value = base * 1.15;
      filter.Q.value = 4.2;
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.095 * v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.36);
      osc.connect(filter).connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);

      // Harmoni sinus lembut beresonansi
      this.softTone(ctx, base, t, 0.32, 0.036 * v, 'sine');
    });
  }

  /**
   * Bunyi "BIP-BIP!" khas gerbang tap kartu elektronik KRL komuter Indonesia saat saldo terbaca & pintu terbuka.
   */
  public playStationTapBeep() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Dua nada pendek jernih 1760 Hz -> 2349 Hz (khas tap kartu KMT / e-Money berhasil)
    this.softTone(ctx, 1760, now, 0.075, 0.072 * v, 'sine');
    this.softTone(ctx, 2349.3, now + 0.085, 0.11, 0.082 * v, 'sine');
    // Desis mekanik halus daun pintu kaca terbuka
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, now + 0.06);
    filter.Q.value = 2.0;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now + 0.06);
    g.gain.linearRampToValueAtTime(0.028 * v, now + 0.11);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(now + 0.06, 0.1, 0.25);
  }

  /**
   * Suara pantulan bola tenis meja berongga "tik-tok... tik-tok!" saat main ping-pong di Kompleks Melati.
   */
  public playPingPongRally() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 6 pasang pantulan bet + meja yang renyah dan berirama
    const hits = [0, 0.24, 0.56, 0.8, 1.12, 1.36, 1.66, 1.9, 2.22, 2.46, 2.78, 3.02];
    hits.forEach((offset, idx) => {
      const isTableBounce = idx % 2 === 1;
      const freq = isTableBounce ? 1180 + (idx % 3) * 45 : 740 + (idx % 2) * 35;
      const t = now + offset;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = isTableBounce ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t + 0.045);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime((isTableBounce ? 0.085 : 0.068) * v, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.055);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.065);
    });
  }

  /**
   * Suara ketukan palu kayu kecil & gosokan sikat semir sepatu Pak Ujang yang rapi.
   */
  public playShoeCobblerTap() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 3 ketukan palu kayu lembut "tok-tok-tok"
    [0, 0.16, 0.34].forEach((offset, i) => {
      this.softTone(ctx, 290 + i * 24, now + offset, 0.065, 0.075 * v, 'triangle');
      this.softTone(ctx, 640 + i * 30, now + offset, 0.035, 0.035 * v, 'sine');
    });
    // Sapuan sikat semir singkat + denting kinclong ramah
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1850;
    filter.Q.value = 1.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now + 0.5);
    g.gain.linearRampToValueAtTime(0.048 * v, now + 0.56);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.82);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(now + 0.5, 0.05, 0.34);
    this.softTone(ctx, 1046.5, now + 0.82, 0.24, 0.042 * v, 'sine');
  }

  /**
   * Suara tombol keypad ATM "bip-bip-bip" diikuti desis halus mesin penghitung uang tunai.
   */
  public playAtmBeepAndCash() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 3 bunyi tombol keypad jernih
    [0, 0.11, 0.22].forEach((offset, i) => {
      this.softTone(ctx, 1680 + i * 140, now + offset, 0.06, 0.058 * v, 'sine');
    });
    // Desis cepat mesin penghitung uang kertas (krrrr-cek!)
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now + 0.38);
    filter.frequency.linearRampToValueAtTime(2100, now + 0.72);
    filter.Q.value = 3.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now + 0.38);
    g.gain.linearRampToValueAtTime(0.055 * v, now + 0.44);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.78);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(now + 0.38, 0.12, 0.42);

    // Nada konfirmasi transaksi selesai
    this.softTone(ctx, 1318.5, now + 0.82, 0.12, 0.055 * v, 'sine');
    this.softTone(ctx, 1760.0, now + 0.94, 0.18, 0.062 * v, 'sine');
  }

  /**
   * Suara koin jatuh "kling!" + nada dial-tone hangat telepon umum retro 90-an Indonesia.
   */
  public playRetroPayphoneDial() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Suara koin logam masuk ke celah telepon umum
    this.softTone(ctx, 2480, now, 0.09, 0.062 * v, 'sine');
    this.softTone(ctx, 3120, now + 0.06, 0.11, 0.048 * v, 'sine');

    // Nada dial-tone klasik (425 Hz halus) lalu 3 nada DTMF pendek penuh nostalgia
    this.softTone(ctx, 425, now + 0.24, 0.42, 0.042 * v, 'sine');
    const dtmf: [number, number][] = [
      [697, 1209],
      [770, 1336],
      [852, 1477],
    ];
    dtmf.forEach(([f1, f2], idx) => {
      const t = now + 0.72 + idx * 0.14;
      this.softTone(ctx, f1, t, 0.09, 0.036 * v, 'sine');
      this.softTone(ctx, f2, t, 0.09, 0.036 * v, 'sine');
    });
  }

  /**
   * Denting ceria ringan saat membeli balon gas warna-warni dari Mang Dedi untuk Kira.
   */
  public playBalloonCheer() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Arpeggio ceria mengapung ke atas (C5 -> E5 -> G5 -> C6)
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      this.softTone(ctx, freq, now + i * 0.075, 0.22, 0.06 * v, 'triangle');
    });
  }

  /**
   * Petikan gitar akustik lembut dari pemusik jalanan tepi sungai.
   */
  public playBuskerStrum(distanceFactor = 1, celebrate = false) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume * Math.max(0.14, Math.min(1, distanceFactor));
    const progressions: number[][] = [
      [196.0, 246.94, 293.66, 369.99, 493.88], // Gmaj7
      [164.81, 246.94, 293.66, 392.0, 493.88], // Em9
      [130.81, 196.0, 246.94, 329.63, 392.0], // Cmaj7
      [146.83, 220.0, 293.66, 369.99, 440.0], // D6
    ];
    const chord = progressions[Math.floor(Date.now() / 4000) % progressions.length];
    const step = celebrate ? 0.055 : 0.11;
    chord.forEach((freq, idx) => {
      this.pluckedNote(ctx, freq, now + idx * step, celebrate ? 2.2 : 1.7, (celebrate ? 0.075 : 0.048) * v);
    });
  }

  /**
   * Memetik 6 akor gitar akustik hangat untuk mini-game gitar di Kedai Kopi Bima.
   */
  public playGuitarChord(chordIdx: number) {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const chords: number[][] = [
      [146.83, 220.0, 293.66, 369.99, 440.0, 554.37], // 0: Dmaj7
      [123.47, 185.0, 246.94, 293.66, 369.99, 440.0], // 1: Bm7
      [98.0, 196.0, 246.94, 293.66, 369.99, 493.88], // 2: Gmaj7
      [110.0, 220.0, 277.18, 329.63, 369.99, 440.0], // 3: A6
      [82.41, 164.81, 246.94, 293.66, 329.63, 392.0], // 4: Em7
      [146.83, 220.0, 293.66, 329.63, 369.99, 587.33], // 5: Dadd9
    ];
    const notes = chords[chordIdx % chords.length];
    const now = ctx.currentTime;
    notes.forEach((freq, i) => {
      this.pluckedNote(ctx, freq, now + i * 0.042, 2.3, 0.08 * this.volume);
    });
  }

  /**
   * Arpeggio penutup hangat Dmaj9 saat Damar menuntaskan konser mini "Track 4 — Pulang".
   */
  public playTrack4Finale() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;
    const arpeggio = [146.83, 220.0, 293.66, 369.99, 440.0, 554.37, 659.25, 880.0];
    arpeggio.forEach((freq, i) => {
      this.pluckedNote(ctx, freq, now + i * 0.11, 3.0, 0.072 * v);
    });
    this.softTone(ctx, 587.33, now + 0.92, 1.8, 0.045 * v, 'sine');
    this.softTone(ctx, 880.0, now + 1.05, 1.9, 0.04 * v, 'sine');
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

  /**
   * Bunyi khas ketukan bidak catur kayu ("tok!") saat meletakkan bidak di papan catur Pos Ronda.
   */
  public playChessTap() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Resonansi kayu pendek tajam seperti pion/kuda diletakkan mantap di papan jati
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.052);
    filter.type = 'bandpass';
    filter.frequency.value = 920;
    filter.Q.value = 2.4;
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.18 * v, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.068);
    osc.connect(filter).connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    // Sedikit gesekan papan kayu lembut sebelum ketukan
    this.softTone(ctx, 290, now + 0.015, 0.05, 0.045 * v, 'sine');
  }

  /**
   * Nada informatif dua nada lembut papan LED KRL Commuter Line Stasiun Senja ("ting-tong!").
   */
  public playKrlBoardChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;
    this.softTone(ctx, 659.25, now, 0.24, 0.075 * v, 'sine');
    this.softTone(ctx, 1318.5, now, 0.14, 0.025 * v, 'triangle');
    this.softTone(ctx, 880.0, now + 0.18, 0.34, 0.08 * v, 'sine');
    this.softTone(ctx, 1760.0, now + 0.18, 0.18, 0.024 * v, 'triangle');
  }

  /**
   * Suara gemericik air tenang & kepak halus di hamparan daun teratai Danau Senja.
   */
  public playLotusPondRipple() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 2 tetesan air lembut + 1 suara katak mungil halus bernada hangat
    const dropA = ctx.createOscillator();
    const gA = ctx.createGain();
    dropA.type = 'sine';
    dropA.frequency.setValueAtTime(520, now);
    dropA.frequency.exponentialRampToValueAtTime(980, now + 0.09);
    gA.gain.setValueAtTime(0.001, now);
    gA.gain.linearRampToValueAtTime(0.08 * v, now + 0.015);
    gA.gain.exponentialRampToValueAtTime(0.0008, now + 0.14);
    dropA.connect(gA).connect(ctx.destination);
    dropA.start(now);
    dropA.stop(now + 0.16);

    const dropB = ctx.createOscillator();
    const gB = ctx.createGain();
    dropB.type = 'sine';
    dropB.frequency.setValueAtTime(640, now + 0.15);
    dropB.frequency.exponentialRampToValueAtTime(1240, now + 0.25);
    gB.gain.setValueAtTime(0.001, now + 0.15);
    gB.gain.linearRampToValueAtTime(0.065 * v, now + 0.165);
    gB.gain.exponentialRampToValueAtTime(0.0008, now + 0.3);
    dropB.connect(gB).connect(ctx.destination);
    dropB.start(now + 0.15);
    dropB.stop(now + 0.32);

    this.softTone(ctx, 587.33, now + 0.28, 0.35, 0.04 * v, 'sine');
    this.softTone(ctx, 880.0, now + 0.42, 0.42, 0.036 * v, 'sine');
  }

  /**
   * Melodi kicauan burung kenari & perkutut pagi/sore yang merdu dari sangkar kayu Jl. Melati.
   */
  public playBirdcageChirp() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 4 frasa kicau bernada tinggi meluncur halus khas burung kenari peliharaan
    const chirps: [number, number, number, number][] = [
      [0.0, 2250, 2980, 0.095],
      [0.12, 2640, 3250, 0.085],
      [0.24, 3120, 2480, 0.11],
      [0.4, 2420, 3420, 0.13],
    ];
    chirps.forEach(([offset, fStart, fEnd, dur]) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fStart, now + offset);
      osc.frequency.exponentialRampToValueAtTime(fEnd, now + offset + dur * 0.72);
      osc.frequency.exponentialRampToValueAtTime(fStart * 1.06, now + offset + dur);
      g.gain.setValueAtTime(0.0008, now + offset);
      g.gain.linearRampToValueAtTime(0.068 * v, now + offset + 0.016);
      g.gain.exponentialRampToValueAtTime(0.0008, now + offset + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + dur + 0.02);
    });
  }

  /**
   * Suara gemericik pancuran air minum taman siap minum yang jernih & menyegarkan.
   */
  public playWaterFountain() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Aliran air tersaring lembut (bandpass noise 1.4kHz -> 2.1kHz)
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1450, now);
    filter.frequency.linearRampToValueAtTime(2150, now + 0.35);
    filter.frequency.linearRampToValueAtTime(1600, now + 0.95);
    filter.Q.value = 1.9;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0008, now);
    g.gain.linearRampToValueAtTime(0.085 * v, now + 0.08);
    g.gain.setValueAtTime(0.075 * v, now + 0.62);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 1.05);
    src.connect(filter).connect(g).connect(ctx.destination);
    src.start(now, 0.05, 1.08);

    // 3 kilau gelembung air jernih lembut
    const bubbles: [number, number, number][] = [
      [0.06, 780, 1280],
      [0.24, 920, 1480],
      [0.48, 860, 1360],
    ];
    bubbles.forEach(([off, f0, f1]) => {
      const osc = ctx.createOscillator();
      const bg = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0, now + off);
      osc.frequency.exponentialRampToValueAtTime(f1, now + off + 0.09);
      bg.gain.setValueAtTime(0.0008, now + off);
      bg.gain.linearRampToValueAtTime(0.05 * v, now + off + 0.018);
      bg.gain.exponentialRampToValueAtTime(0.0008, now + off + 0.11);
      osc.connect(bg).connect(ctx.destination);
      osc.start(now + off);
      osc.stop(now + off + 0.13);
    });
  }

  /**
   * Melodi bel musik ceria gerobak es krim keliling sore hari (8 nada kotak musik lembut).
   */
  public playIceCreamJingle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Frasa melodi ceria bergaya glockenspiel / kotak musik es krim keliling
    const melody: [number, number, number][] = [
      [0.0, 1046.5, 0.16], // C6
      [0.14, 1318.5, 0.16], // E6
      [0.28, 1568.0, 0.16], // G6
      [0.42, 1318.5, 0.14], // E6
      [0.54, 1760.0, 0.24], // A6
      [0.76, 1568.0, 0.28], // G6
      [1.0, 1318.5, 0.16], // E6
      [1.15, 1046.5, 0.34], // C6
    ];
    melody.forEach(([off, freq, dur]) => {
      this.softTone(ctx, freq, now + off, dur, 0.068 * v, 'sine');
      this.softTone(ctx, freq * 2, now + off, dur * 0.55, 0.018 * v, 'triangle');
    });
  }

  /**
   * Bunyi klik besi & engsel palang portal pintu masuk perumahan Jl. Melati.
   */
  public playPortalGateCreak() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.24);
    osc.frequency.exponentialRampToValueAtTime(195, now + 0.42);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.08 * v, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.45);
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);

    // Bunyi kunci kait besi mantap
    this.softTone(ctx, 880, now + 0.02, 0.09, 0.055 * v, 'sine');
  }

  /**
   * Bunyi khas gunting pangkas rambut ("krik-krik-krik") diikuti semprotan halus di Kios Rapi Jaya.
   */
  public playBarberSnip() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 3 jepitan gunting baja tajam namun lembut
    [0.0, 0.14, 0.28].forEach((off) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const hp = ctx.createBiquadFilter();
      hp.type = 'bandpass';
      hp.frequency.setValueAtTime(4200, now + off);
      hp.Q.value = 3.2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime(0.095 * v, now + off + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + 0.065);
      src.connect(hp).connect(g).connect(ctx.destination);
      src.start(now + off, 0.2, 0.08);

      this.softTone(ctx, 2850, now + off, 0.045, 0.03 * v, 'triangle');
    });

    // Semprotan botol air rambut singkat ("cssht!")
    const spr = ctx.createBufferSource();
    spr.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'highpass';
    bp.frequency.setValueAtTime(2900, now + 0.44);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.001, now + 0.44);
    sg.gain.linearRampToValueAtTime(0.055 * v, now + 0.47);
    sg.gain.exponentialRampToValueAtTime(0.0008, now + 0.62);
    spr.connect(bp).connect(sg).connect(ctx.destination);
    spr.start(now + 0.44, 0.35, 0.2);
  }

  /**
   * Suara "kwek-kwek-kwek" kawanan bebek Danau Senja yang lembut & riang saat diberi remah roti.
   */
  public playDuckQuack() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 3 suara kwek dengan formant bandpass khas bebek air
    const quacks: [number, number, number][] = [
      [0.0, 560, 0.12],
      [0.16, 610, 0.11],
      [0.34, 520, 0.15],
    ];
    quacks.forEach(([off, baseFreq, dur]) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now + off);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.72, now + off + dur);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1180, now + off);
      filter.frequency.exponentialRampToValueAtTime(760, now + off + dur);
      filter.Q.value = 3.6;

      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime(0.11 * v, now + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + dur);

      osc.connect(filter).connect(g).connect(ctx.destination);
      osc.start(now + off);
      osc.stop(now + off + dur + 0.03);
    });
  }

  /**
   * Gema lembut & syahdu bedug kulit kayu Mushola kompleks saat senja/sore.
   */
  public playSoftBedug() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 2 ketukan lembut beresonansi hangat (rendah, tenang, membumi)
    [0.0, 0.42].forEach((off, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 112 : 104, now + off);
      osc.frequency.exponentialRampToValueAtTime(56, now + off + 0.48);

      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime((idx === 0 ? 0.22 : 0.16) * v, now + off + 0.016);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + 0.62);

      osc.connect(g).connect(ctx.destination);
      osc.start(now + off);
      osc.stop(now + off + 0.66);

      // Harmonik kayu lembut
      this.softTone(ctx, idx === 0 ? 168 : 156, now + off, 0.28, 0.04 * v, 'triangle');
    });
  }

  /**
   * Bunyi peluit uap merdu khas gerobak Kue Putu Bambu malam hari ("ngiiiiing~").
   */
  public playKuePutuWhistle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Nada peluit uap khas (~1520 Hz -> 1680 Hz bergetar halus) + desis uap tipis
    const osc = ctx.createOscillator();
    const harm = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1440, now);
    osc.frequency.linearRampToValueAtTime(1640, now + 0.25);
    osc.frequency.setValueAtTime(1620, now + 0.72);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 1.05);

    harm.type = 'triangle';
    harm.frequency.setValueAtTime(2880, now);
    harm.frequency.linearRampToValueAtTime(3280, now + 0.25);
    harm.frequency.exponentialRampToValueAtTime(2640, now + 1.05);

    const hg = ctx.createGain();
    hg.gain.value = 0.14;

    g.gain.setValueAtTime(0.0008, now);
    g.gain.linearRampToValueAtTime(0.065 * v, now + 0.16);
    g.gain.setValueAtTime(0.058 * v, now + 0.74);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 1.12);

    osc.connect(g);
    harm.connect(hg).connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    harm.start(now);
    osc.stop(now + 1.15);
    harm.stop(now + 1.15);

    // Desis uap putih lembut
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3400;
    bp.Q.value = 1.6;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0008, now);
    sg.gain.linearRampToValueAtTime(0.032 * v, now + 0.14);
    sg.gain.exponentialRampToValueAtTime(0.0008, now + 1.0);
    src.connect(bp).connect(sg).connect(ctx.destination);
    src.start(now, 0.1, 1.05);
  }

  /**
   * Suara desis angin kompresor bengkel tambal ban ("pssshh—tss!").
   */
  public playTireAirHiss() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 2 semburan angin bertekanan
    [
      [0.0, 0.34],
      [0.44, 0.24],
    ].forEach(([off, dur]) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(2400, now + off);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime(0.11 * v, now + off + 0.03);
      g.gain.setValueAtTime(0.09 * v, now + off + dur * 0.72);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + dur);
      src.connect(hp).connect(g).connect(ctx.destination);
      src.start(now + off, 0.05, dur + 0.04);
    });
  }

  /**
   * Suara desis wajan minyak hangat saat menggulung telur gulung & cilok sore ("cssshhh—krk!").
   */
  public playFryingSizzle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(3600, now);
    bp.frequency.linearRampToValueAtTime(4800, now + 0.25);
    bp.frequency.linearRampToValueAtTime(3200, now + 0.85);
    bp.Q.value = 1.4;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.088 * v, now + 0.06);
    g.gain.setValueAtTime(0.072 * v, now + 0.55);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.92);

    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(now, 0.12, 0.95);
  }

  /**
   * Suara bel sepeda kota jernih ("kring-kring!") + bunyi kunci dock stasiun sepeda sewa.
   */
  public playBikeShareBell() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 2 dering bel sepeda nyaring + harmoni logam tipis
    [0.0, 0.19].forEach((off) => {
      this.softTone(ctx, 2180, now + off, 0.22, 0.075 * v, 'sine');
      this.softTone(ctx, 4360, now + off, 0.14, 0.028 * v, 'triangle');
    });
    // Bip QR dock hijau ramah
    this.softTone(ctx, 1175, now + 0.42, 0.09, 0.045 * v, 'sine');
    this.softTone(ctx, 1568, now + 0.52, 0.14, 0.05 * v, 'sine');
  }

  /**
   * Detak mekanis halus jam tangan & denting kecil lapak reparasi Pak Karto ("tik-tok-tik-tok-ting!").
   */
  public playWatchTickChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 4 detak halus mekanis bergantian tik-tok
    [0.0, 0.16, 0.32, 0.48].forEach((off, idx) => {
      const freq = idx % 2 === 0 ? 3100 : 2550;
      this.softTone(ctx, freq, now + off, 0.028, 0.052 * v, 'triangle');
    });
    // Denting halus penutup jam selesai diperiksa
    this.softTone(ctx, 1760, now + 0.64, 0.28, 0.048 * v, 'sine');
  }

  /**
   * Suara kecipak air lembut kincir perahu bebek kayuh di tepi Danau Senja.
   */
  public playPedalBoatSplash() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 3 kecipak air ritmis kincir kayuh
    [0.0, 0.24, 0.48].forEach((off) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(720, now + off);
      bp.frequency.linearRampToValueAtTime(1420, now + off + 0.14);
      bp.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime(0.092 * v, now + off + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + 0.2);
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start(now + off, 0.08, 0.22);
    });
    // Nada riak air lembut
    this.softTone(ctx, 523.25, now + 0.56, 0.3, 0.036 * v, 'sine');
  }

  /**
   * Suara tuangan bandrek/bajigur hangat ke cangkir enamel diikuti denting sendok lembut.
   */
  public playWarmPourChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(980, now);
    bp.frequency.linearRampToValueAtTime(1850, now + 0.55);
    bp.Q.value = 2.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.072 * v, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.62);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(now, 0.15, 0.65);

    this.softTone(ctx, 1318.5, now + 0.52, 0.24, 0.045 * v, 'sine');
    this.softTone(ctx, 1760.0, now + 0.64, 0.28, 0.038 * v, 'sine');
  }

  /**
   * Kilau harmoni lembut saat rangkaian lampu gantung hangat Alun-Alun Taman Kota berkedip syahdu.
   */
  public playFairyLightsChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Arpeggio 5 nada hangat berkilau
    const notes = [523.25, 659.25, 783.99, 987.77, 1318.5];
    notes.forEach((freq, idx) => {
      this.softTone(ctx, freq, now + idx * 0.085, 0.42, 0.048 * v, 'sine');
    });
  }

  /**
   * Denting timbangan kuningan & kresek segar gerobak sayur keliling pagi hari.
   */
  public playMarketScaleClink() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    this.softTone(ctx, 1840, now, 0.14, 0.055 * v, 'triangle');
    this.softTone(ctx, 2320, now + 0.12, 0.16, 0.048 * v, 'sine');

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.setValueAtTime(3400, now + 0.22);
    hp.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now + 0.22);
    g.gain.linearRampToValueAtTime(0.058 * v, now + 0.26);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.56);
    src.connect(hp).connect(g).connect(ctx.destination);
    src.start(now + 0.22, 0.1, 0.38);
  }

  /**
   * Derit ritmis halus mesin jahit klasik ("trrrrrr—krik!") di Kios Penjahit Sari Jahit.
   */
  public playSewingMachineWhir() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 7 jahitan cepat ritmis lembut
    for (let i = 0; i < 7; i++) {
      const off = i * 0.075;
      this.softTone(ctx, 420 + (i % 2) * 55, now + off, 0.045, 0.05 * v, 'triangle');
      this.softTone(ctx, 1950, now + off, 0.024, 0.022 * v, 'sine');
    }
    // Gunting benang penutup ("krik!")
    this.softTone(ctx, 3200, now + 0.58, 0.06, 0.045 * v, 'triangle');
  }

  /**
   * Lonceng besi khas pintu pelintasan kereta api Indonesia ("teng-teng-teng-teng!").
   */
  public playRailCrossingBell() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // 4 ketukan lonceng logam nyaring namun tidak memekakkan
    [0.0, 0.36, 0.72, 1.08].forEach((off) => {
      this.softTone(ctx, 1396.9, now + off, 0.34, 0.078 * v, 'sine');
      this.softTone(ctx, 2793.8, now + off, 0.22, 0.032 * v, 'triangle');
      this.softTone(ctx, 3520.0, now + off, 0.14, 0.016 * v, 'sine');
    });
  }

  /**
   * Bel pintu otomatis lembut Apotek 24 Jam "Sehat Melati" ("ting-tong~" bersih menenangkan).
   */
  public playPharmacyChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    this.softTone(ctx, 880.0, now, 0.26, 0.062 * v, 'sine');
    this.softTone(ctx, 1174.66, now + 0.16, 0.34, 0.058 * v, 'sine');
    this.softTone(ctx, 1760.0, now + 0.16, 0.22, 0.02 * v, 'triangle');
  }

  /**
   * Suara serutan es batu renyah gerobak Es Teler Bang Daud ("kresss—kresss!").
   */
  public playIceShaverCrunch() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    [0.0, 0.28].forEach((off) => {
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer(ctx);
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2800, now + off);
      bp.frequency.linearRampToValueAtTime(4200, now + off + 0.18);
      bp.Q.value = 1.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime(0.095 * v, now + off + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + 0.24);
      src.connect(bp).connect(g).connect(ctx.destination);
      src.start(now + off, 0.06, 0.26);
    });
    this.softTone(ctx, 1318.5, now + 0.56, 0.22, 0.042 * v, 'sine');
  }

  /**
   * Melodi kotak mainan kayu ceria saat membuka Kotak Donasi Buku & Mainan Anak.
   */
  public playToyBoxChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const notes = [659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => {
      this.softTone(ctx, freq, now + i * 0.09, 0.28, 0.056 * v, 'sine');
      this.softTone(ctx, freq * 2, now + i * 0.09, 0.16, 0.014 * v, 'triangle');
    });
  }

  /**
   * Bunyi notifikasi transaksi pulsa/token listrik sukses di Konter Berkah ("bip-bip-tring!").
   */
  public playKonterBeepChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    this.softTone(ctx, 1174.66, now, 0.09, 0.055 * v, 'sine');
    this.softTone(ctx, 1567.98, now + 0.11, 0.09, 0.058 * v, 'sine');
    this.softTone(ctx, 2093.0, now + 0.24, 0.26, 0.062 * v, 'sine');
  }

  /**
   * Suara tuangan jamu tradisional dari botol kaca ke gelas belimbing.
   */
  public playJamuPourChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1150, now);
    bp.frequency.linearRampToValueAtTime(2050, now + 0.45);
    bp.Q.value = 2.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.068 * v, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.52);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(now, 0.12, 0.55);

    this.softTone(ctx, 1480.0, now + 0.48, 0.24, 0.044 * v, 'sine');
  }

  /**
   * Klik fokus lensa kuningan teropong pengamat burung diikuti kicau burung air Danau Senja.
   */
  public playBirdScopeChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Klik mekanis fokus teropong
    this.softTone(ctx, 1950, now, 0.04, 0.048 * v, 'triangle');
    // 2 kicauan burung air jernih di kejauhan danau
    [
      [0.14, 2100, 2750, 0.12],
      [0.32, 2450, 1980, 0.14],
    ].forEach(([off, f0, f1, dur]) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0, now + off);
      osc.frequency.exponentialRampToValueAtTime(f1, now + off + dur);
      g.gain.setValueAtTime(0.001, now + off);
      g.gain.linearRampToValueAtTime(0.052 * v, now + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, now + off + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(now + off);
      osc.stop(now + off + dur + 0.02);
    });
  }

  /**
   * Suara gorengan pempek renyah di wajan diikuti tuangan kuah cuko segar.
   */
  public playPempekFryChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(3200, now);
    bp.frequency.linearRampToValueAtTime(4400, now + 0.35);
    bp.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.082 * v, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.65);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(now, 0.08, 0.68);

    this.softTone(ctx, 1396.9, now + 0.52, 0.22, 0.042 * v, 'sine');
  }

  /**
   * Lonceng pintu kuningan manis Toko Kue Tradisional "Dapur Manis" ("ting-ling~").
   */
  public playBakeryShopBell() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    this.softTone(ctx, 1567.98, now, 0.32, 0.064 * v, 'sine');
    this.softTone(ctx, 2093.0, now + 0.12, 0.36, 0.056 * v, 'sine');
    this.softTone(ctx, 3135.96, now + 0.12, 0.22, 0.02 * v, 'triangle');
  }

  /**
   * Bip telemetri digital sensor pengukur tinggi air & cuaca Pos Pantau Sungai Kota.
   */
  public playHydroSensorBeep() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    this.softTone(ctx, 1046.5, now, 0.08, 0.048 * v, 'sine');
    this.softTone(ctx, 1318.5, now + 0.11, 0.08, 0.048 * v, 'sine');
    this.softTone(ctx, 1760.0, now + 0.22, 0.18, 0.052 * v, 'sine');
  }

  /**
   * Desis lembut adonan santan serabi dituang ke wajan tanah liat panas ("csssssh~").
   */
  public playSerabiSizzle() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2400, now);
    bp.frequency.linearRampToValueAtTime(3400, now + 0.35);
    bp.Q.value = 1.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.074 * v, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.72);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(now, 0.1, 0.75);
  }

  /**
   * Harmoni piano-chime hangat bernostalgia saat membuka adegan memori sejarah / taman kupu-kupu.
   */
  public playMemoryChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const notes = [440.0, 554.37, 659.25, 880.0];
    notes.forEach((freq, i) => {
      this.softTone(ctx, freq, now + i * 0.12, 0.55, 0.048 * v, 'sine');
    });
  }

  /**
   * Alunan harmonik bambu Angklung Angin & gemericik pancuran Kincir Air Sawah Senja.
   */
  public playBambooAngklung() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Tangga nada pentatonis Sunda/Jawa hangat (D5 - E5 - F#5 - A5 - B5)
    const bambooNotes = [587.33, 659.25, 739.99, 880.0, 987.77];
    bambooNotes.forEach((freq, idx) => {
      const start = now + idx * 0.11;
      this.softTone(ctx, freq, start, 0.42, 0.062 * v, 'triangle');
      this.softTone(ctx, freq * 2, start + 0.02, 0.28, 0.026 * v, 'sine');
    });
  }

  public playBambooWaterwheel() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    // Gemericik air pancuran bambu + ketukan halus tabung bambu ("kluk-kluk")
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1150, now);
    bp.frequency.linearRampToValueAtTime(1750, now + 0.55);
    bp.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(0.078 * v, now + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.68);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(now, 0.15, 0.72);

    [0.08, 0.28, 0.48].forEach((off, i) => {
      this.softTone(ctx, 310 + i * 38, now + off, 0.12, 0.068 * v, 'triangle');
    });
  }

  /**
   * Denting kristal lembut penuh harap saat menghanyutkan Lentera Air Teratai di Sungai / Danau.
   */
  public playWaterLanternChime() {
    if (this.volume <= 0.01) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const v = this.volume;

    const chord = [523.25, 659.25, 783.99, 987.77, 1318.5];
    chord.forEach((freq, idx) => {
      this.softTone(ctx, freq, now + idx * 0.13, 0.85, 0.052 * v, 'sine');
      this.softTone(ctx, freq * 2, now + idx * 0.13 + 0.02, 0.45, 0.018 * v, 'triangle');
    });
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
