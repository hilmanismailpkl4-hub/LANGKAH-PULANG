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
