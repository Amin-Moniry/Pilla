/**
 * Super Brilliant Web Audio Engine for "Pilla" (پیلا)
 * 
 * Features:
 * - 100% offline, procedural audio synthesis (zero external audio files or latency).
 * - Dynamics compressor & master limiter to ensure pristine, distortion-free audio even at 160+ WPM.
 * - Pre-allocated white/pink noise buffers for instant, zero-garbage-collection key transients.
 * - 7 Master Sound Themes:
 *    1. 'royal-santoor': 13th-century Royal Persian classical plucked string (Dastgah Mahur & Shur)
 *    2. 'thock': Deep, warm lubed custom mechanical keyboard (Gateron Oil King / Topre)
 *    3. 'cherry-mx': Crisp, tactile clicky switch with dual clack & spring ping
 *    4. 'creamy-linear': Silky, poppy lubed NovelKeys Cream / POM switch
 *    5. 'typewriter': Vintage mechanical typewriter with metallic strike & platen impact
 *    6. 'crystal-drop': Celestial crystal bell chime & water droplets
 *    7. 'soft-bubble': Gentle organic water bubble pop
 * - Specialized key acoustics: Spacebar (deep stabilizer thud), Backspace (tactile slide), Enter (triumphant carriage return)
 * - Micro-pitch jitter (±3%) for natural, non-fatiguing organic acoustic realism
 * - Milestone streak shimmers (ascending dopamine reward at 10, 25, 50, 100 streak)
 * - Refined, non-jarring error feedback
 * - Royal Persian metamorphosis fanfare, aerodynamic silk butterfly wing swoosh & victory chords
 */

import { SoundTheme } from '../types/typing';

// Persian Classical Modal Scales (Dastgah Mahur & Nava / Homayoun intervals)
const SANTOOR_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  698.46, // F5
  783.99, // G5
  880.00, // A5
  1046.50 // C6
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // Cached Noise Buffers for zero-lag transient playback
  private whiteNoiseBuffer: AudioBuffer | null = null;
  private pinkNoiseBuffer: AudioBuffer | null = null;

  // Santoor melody step tracker for fluid musical typing
  private melodyIndex: number = 0;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupAudioGraph();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private setupAudioGraph() {
    if (!this.ctx) return;

    // Master Compressor prevents clipping when typing very fast
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    // Audio Graph: Source -> Compressor -> MasterGain -> Destination
    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Pre-create Noise Buffers (1 second each)
    this.initNoiseBuffers();
  }

  private initNoiseBuffers() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate; // 1 second

    // White Noise
    const whiteBuffer = this.ctx.createBuffer(1, length, sampleRate);
    const whiteData = whiteBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      whiteData[i] = Math.random() * 2 - 1;
    }
    this.whiteNoiseBuffer = whiteBuffer;

    // Pink Noise (1/f approximation for natural mechanical textures)
    const pinkBuffer = this.ctx.createBuffer(1, length, sampleRate);
    const pinkData = pinkBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pinkData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.pinkNoiseBuffer = pinkBuffer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Quiet, original interface tones inspired by familiar mobile UI feedback.
   * These are synthesized locally rather than copying branded device sounds.
   */
  public playInterfaceTone(style: 'ios' | 'galaxy' = 'ios') {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    const now = ctx.currentTime;
    const notes =
      style === 'ios'
        ? [
            { frequency: 740, delay: 0, duration: 0.045, level: 0.12 },
            { frequency: 1110, delay: 0.014, duration: 0.055, level: 0.045 },
          ]
        : [
            { frequency: 587.33, delay: 0, duration: 0.06, level: 0.1 },
            { frequency: 880, delay: 0.026, duration: 0.07, level: 0.045 },
          ];

    notes.forEach(({ frequency, delay, duration, level }) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + delay;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(this.compressor!);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
    });
  }

  /**
   * Main Keystroke Audio Dispatcher with key-specific acoustics
   */
  public playKeyClick(
    theme: SoundTheme = 'cherry-mx',
    keyType: 'alpha' | 'space' | 'backspace' | 'enter' = 'alpha'
  ) {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;
      const jitter = (Math.random() - 0.5) * 0.06; // subtle organic pitch variation

      switch (theme) {
        case 'royal-santoor':
          this.synthesizeRoyalSantoor(ctx, now, keyType, jitter);
          break;
        case 'thock':
          this.synthesizeThock(ctx, now, keyType, jitter);
          break;
        case 'cherry-mx':
          this.synthesizeCherryMx(ctx, now, keyType, jitter);
          break;
        case 'creamy-linear':
          this.synthesizeCreamyLinear(ctx, now, keyType, jitter);
          break;
        case 'typewriter':
          this.synthesizeTypewriter(ctx, now, keyType, jitter);
          break;
        case 'crystal-drop':
          this.synthesizeCrystalDrop(ctx, now, keyType, jitter);
          break;
        case 'soft-bubble':
        default:
          this.synthesizeSoftBubble(ctx, now, keyType, jitter);
          break;
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 1. ROYAL SANTOOR (Persian Classical Plucked Wire Instrument)
  // ══════════════════════════════════════════════════════════════
  private synthesizeRoyalSantoor(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    // Pick note based on key type or melody progression
    let baseFreq = SANTOOR_SCALE[this.melodyIndex % SANTOOR_SCALE.length];
    if (keyType === 'space') {
      baseFreq = SANTOOR_SCALE[0] * 0.5; // Deep tonic root C3
    } else if (keyType === 'backspace') {
      baseFreq = SANTOOR_SCALE[2] * 0.75;
      this.melodyIndex = Math.max(0, this.melodyIndex - 1);
    } else if (keyType === 'enter') {
      baseFreq = SANTOOR_SCALE[7]; // High Octave C5
    } else {
      this.melodyIndex = (this.melodyIndex + 1) % SANTOOR_SCALE.length;
    }

    const freq = baseFreq * (1 + jitter);

    // Primary wire string fundamental
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // 2nd Harmonic (metallic bridge overtone)
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    // 3rd Harmonic shimmer
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3.02, now);

    // Mallet (Mezrab) felt strike transient
    const mezrab = ctx.createOscillator();
    const mezrabGain = ctx.createGain();
    mezrab.type = 'sine';
    mezrab.frequency.setValueAtTime(freq * 4.5, now);
    mezrab.frequency.exponentialRampToValueAtTime(100, now + 0.015);
    mezrabGain.gain.setValueAtTime(0.18, now);
    mezrabGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    // String decay envelope
    const decayDuration = keyType === 'space' ? 0.38 : 0.22;
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decayDuration);

    // Routing
    mezrab.connect(mezrabGain);
    mezrabGain.connect(this.compressor!);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(this.compressor!);

    mezrab.start(now);
    mezrab.stop(now + 0.02);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + decayDuration + 0.02);
    osc2.stop(now + decayDuration + 0.02);
    osc3.stop(now + decayDuration + 0.02);
  }

  // ══════════════════════════════════════════════════════════════
  // 2. TACTILE THOCK (Deep Lubed Custom Mechanical Switches)
  // ══════════════════════════════════════════════════════════════
  private synthesizeThock(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    const isSpace = keyType === 'space';
    const isEnter = keyType === 'enter';

    // Deep fundamental body thump
    const basePitch = isSpace ? 85 : isEnter ? 110 : 138;
    const freq = basePitch * (1 + jitter);

    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();

    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(freq * 1.8, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.045);

    const bodyVol = isSpace ? 0.55 : 0.42;
    bodyGain.gain.setValueAtTime(bodyVol, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.08 : 0.055));

    // Lubed POM stem bottom-out noise impact
    if (this.pinkNoiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = this.pinkNoiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(isSpace ? 380 : 560, now);
      noiseFilter.Q.setValueAtTime(2.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(isSpace ? 0.35 : 0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.compressor!);

      noiseSource.start(now);
      noiseSource.stop(now + 0.04);
    }

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.compressor!);

    bodyOsc.start(now);
    bodyOsc.stop(now + (isSpace ? 0.085 : 0.06));
  }

  // ══════════════════════════════════════════════════════════════
  // 3. CHERRY MX (Crisp Tactile Click + Bottom-Out Clack + Ping)
  // ══════════════════════════════════════════════════════════════
  private synthesizeCherryMx(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    const isSpace = keyType === 'space';

    // Click leaf transient (crisp high bandpass snap)
    if (this.whiteNoiseBuffer) {
      const clickSource = ctx.createBufferSource();
      clickSource.buffer = this.whiteNoiseBuffer;

      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime((isSpace ? 2200 : 3400) * (1 + jitter), now);
      clickFilter.Q.setValueAtTime(4.0, now);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.4, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.compressor!);

      clickSource.start(now);
      clickSource.stop(now + 0.015);
    }

    // Bottom-out clack
    const clackOsc = ctx.createOscillator();
    const clackGain = ctx.createGain();
    const clackFreq = (isSpace ? 520 : 920) * (1 + jitter);

    clackOsc.type = 'triangle';
    clackOsc.frequency.setValueAtTime(clackFreq, now + 0.004);
    clackOsc.frequency.exponentialRampToValueAtTime(clackFreq * 0.4, now + 0.035);

    clackGain.gain.setValueAtTime(0.3, now + 0.004);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    // Subtle metal spring ping
    const pingOsc = ctx.createOscillator();
    const pingGain = ctx.createGain();
    pingOsc.type = 'sine';
    pingOsc.frequency.setValueAtTime(2250 * (1 + jitter), now);
    pingGain.gain.setValueAtTime(0.04, now);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    clackOsc.connect(clackGain);
    clackGain.connect(this.compressor!);

    pingOsc.connect(pingGain);
    pingGain.connect(this.compressor!);

    clackOsc.start(now + 0.004);
    clackOsc.stop(now + 0.042);

    pingOsc.start(now);
    pingOsc.stop(now + 0.065);
  }

  // ══════════════════════════════════════════════════════════════
  // 4. CREAMY LINEAR (Silky Poppy NovelKeys Cream / POM Switch)
  // ══════════════════════════════════════════════════════════════
  private synthesizeCreamyLinear(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    const isSpace = keyType === 'space';
    const baseFreq = (isSpace ? 340 : 540) * (1 + jitter);

    // Creamy pop bubble envelope
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.4, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.035);

    gain.gain.setValueAtTime(isSpace ? 0.48 : 0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSpace ? 0.05 : 0.038));

    // Lowpass nylon housing body
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isSpace ? 650 : 880, now);
    filter.Q.setValueAtTime(1.5, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor!);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  // ══════════════════════════════════════════════════════════════
  // 5. VINTAGE TYPEWRITER (Metallic Typebar Strike + Platen)
  // ══════════════════════════════════════════════════════════════
  private synthesizeTypewriter(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    if (keyType === 'enter') {
      // Carriage Return Bell!
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(1864.66, now); // A#6 carriage bell
      bellGain.gain.setValueAtTime(0.35, now);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      bell.connect(bellGain);
      bellGain.connect(this.compressor!);
      bell.start(now);
      bell.stop(now + 0.38);
      return;
    }

    const isSpace = keyType === 'space';

    // Metallic striker tap
    const strike = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strike.type = 'square';
    strike.frequency.setValueAtTime((isSpace ? 720 : 1450) * (1 + jitter), now);
    strike.frequency.exponentialRampToValueAtTime(220, now + 0.025);

    strikeGain.gain.setValueAtTime(0.24, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.028);

    // Heavy rubber platen clack
    const platen = ctx.createOscillator();
    const platenGain = ctx.createGain();
    platen.type = 'triangle';
    platen.frequency.setValueAtTime(isSpace ? 110 : 210, now + 0.003);
    platen.frequency.exponentialRampToValueAtTime(60, now + 0.045);

    platenGain.gain.setValueAtTime(0.35, now + 0.003);
    platenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    strike.connect(strikeGain);
    strikeGain.connect(this.compressor!);

    platen.connect(platenGain);
    platenGain.connect(this.compressor!);

    strike.start(now);
    strike.stop(now + 0.03);

    platen.start(now + 0.003);
    platen.stop(now + 0.052);
  }

  // ══════════════════════════════════════════════════════════════
  // 6. CRYSTAL DROP (Celestial Glass & Resonant Droplets)
  // ══════════════════════════════════════════════════════════════
  private synthesizeCrystalDrop(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    const note = SANTOOR_SCALE[(this.melodyIndex * 2 + 4) % SANTOOR_SCALE.length] * (1 + jitter);
    this.melodyIndex = (this.melodyIndex + 1) % SANTOOR_SCALE.length;

    // Harmonic ratios for glass chime
    const freqs = [note, note * 2.756, note * 5.404];
    const vols = [0.28, 0.12, 0.06];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(vols[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 / (idx + 1));

      osc.connect(gain);
      gain.connect(this.compressor!);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 7. SOFT BUBBLE (Organic Water Bubble Pop)
  // ══════════════════════════════════════════════════════════════
  private synthesizeSoftBubble(
    ctx: AudioContext,
    now: number,
    keyType: 'alpha' | 'space' | 'backspace' | 'enter',
    jitter: number
  ) {
    const isSpace = keyType === 'space';
    const startFreq = (isSpace ? 320 : 460) * (1 + jitter);
    const endFreq = (isSpace ? 650 : 920) * (1 + jitter);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.038);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.compressor!);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // ══════════════════════════════════════════════════════════════
  // MILESTONE STREAK SHIMMER (Ascending Dopamine Reward)
  // ══════════════════════════════════════════════════════════════
  public playStreakMilestone(combo: number) {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;
      // Elegant ascending Persian chord: Eb5 -> G5 -> Bb5 -> Eb6
      const notes = [622.25, 783.99, 932.33, 1244.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.045;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);

        osc.connect(gain);
        gain.connect(this.compressor!);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ELEGANT ERROR SOUND (Muted Wooden Thud, Non-Jarring)
  // ══════════════════════════════════════════════════════════════
  public playError() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;

      // Soft muted wooden hollow click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.055);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      // Gentle lowpass filter to prevent any harshness
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // ignore
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ROYAL PERSIAN METAMORPHOSIS & LEVEL-UP FANFARE
  // ══════════════════════════════════════════════════════════════
  public playLevelUp() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;
      // Majestic Royal Dastgah Mahur Fanfare: D4, G4, B4, D5, G5, B5, D6
      const fanfare = [293.66, 392.00, 493.88, 587.33, 783.99, 987.77, 1174.66];

      fanfare.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.07;
        const dur = idx === fanfare.length - 1 ? 0.85 : 0.42;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(freq * 2, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(this.compressor!);

        osc.start(start);
        oscHarmonic.start(start);

        osc.stop(start + dur + 0.02);
        oscHarmonic.stop(start + dur + 0.02);
      });
    } catch {
      // ignore
    }
  }

  // ══════════════════════════════════════════════════════════════
  // BUTTERFLY WING FLUTTER (Organic Silk Whoosh + Stardust Sparkle)
  // ══════════════════════════════════════════════════════════════
  public playFlap() {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;

      // Layer 1: Aerodynamic Silk Breeze (Filtered Pink Noise Sweep)
      if (this.pinkNoiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = this.pinkNoiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(260, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
        filter.frequency.exponentialRampToValueAtTime(320, now + 0.24);
        filter.Q.setValueAtTime(1.8, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.26, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        noise.start(now);
        noise.stop(now + 0.3);
      }

      // Layer 2: Metamorphosis Stardust Sparkles (Crystal Bell Overtone Chimes)
      const sparkleFreqs = [1567.98, 1975.53, 2349.32, 3135.96]; // G6, B6, D7, G7
      sparkleFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + 0.05 + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);

        osc.connect(gain);
        gain.connect(this.compressor!);

        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {
      // ignore
    }
  }

  // ══════════════════════════════════════════════════════════════
  // VICTORY STARS FANFARE (1, 2, or 3 Stars)
  // ══════════════════════════════════════════════════════════════
  public playVictory(stars: number = 3) {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;
      let notes: number[] = [];

      if (stars === 1) {
        // Uplifting resolution (C5, G5, C6)
        notes = [523.25, 783.99, 1046.5];
      } else if (stars === 2) {
        // Grand two-part cadence (C5, E5, G5, B5, C6)
        notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      } else {
        // Royal 3-Star Coronation Fanfare: C5, G5, C6, E6, G6, C7
        notes = [523.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
      }

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.08;
        const dur = idx === notes.length - 1 ? 0.9 : 0.35;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.compressor!);

        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    } catch {
      // ignore
    }
  }

  // ══════════════════════════════════════════════════════════════
  // COUNTDOWN TICKS & RACE START
  // ══════════════════════════════════════════════════════════════
  public playCountdownTick(isFinal: boolean = false) {
    if (this.isMuted || this.volume <= 0) return;
    const ctx = this.initContext();
    if (!ctx || !this.compressor) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isFinal) {
        // High triumphant GO chime (C6)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1046.5, now);
        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.48);
      } else {
        // Woodblock tick (800Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.035);
      }

      osc.connect(gain);
      gain.connect(this.compressor);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
