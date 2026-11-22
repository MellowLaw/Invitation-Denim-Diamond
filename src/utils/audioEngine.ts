/**
 * Vinyl music controller:
 * Automatically plays `/audio/reunion-theme.mp3` if placed in `public/audio/reunion-theme.mp3`.
 * Falls back cleanly to a warm sparkling Web Audio API disco-lounge chord & chime groove.
 */

class ReunionAudioEngine {
  private mp3Audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private active = false;
  private step = 0;
  private hasCustomMp3: boolean | null = null;

  // Warm dreamy Maj9 / Min9 reunion lounge progression (Fmaj9 -> Em7 -> Dm9 -> Cmaj9)
  private readonly chords: number[][] = [
    [174.61, 220.0, 261.63, 329.63, 392.0],
    [164.81, 196.0, 246.94, 293.66, 392.0],
    [146.83, 174.61, 220.0, 261.63, 329.63],
    [130.81, 164.81, 196.0, 246.94, 293.66],
  ];

  private readonly chimes = [523.25, 659.25, 783.99, 987.77, 1046.5];

  public async toggle(): Promise<boolean> {
    if (this.active) {
      this.stop();
      return false;
    }
    await this.start();
    return this.active;
  }

  public async start(): Promise<void> {
    if (this.active) return;

    // Check once if user placed a custom MP3 in public/audio/reunion-theme.mp3
    if (this.hasCustomMp3 === null) {
      try {
        const probe = await fetch('/audio/reunion-theme.mp3', { method: 'HEAD' });
        const ct = probe.headers.get('content-type') || '';
        this.hasCustomMp3 = probe.ok && (ct.includes('audio') || ct.includes('octet-stream'));
      } catch {
        this.hasCustomMp3 = false;
      }
    }

    if (this.hasCustomMp3) {
      try {
        this.mp3Audio = new Audio('/audio/reunion-theme.mp3');
        this.mp3Audio.loop = true;
        this.mp3Audio.volume = 0.55;
        await this.mp3Audio.play();
        this.active = true;
        return;
      } catch {
        // Fall back cleanly if browser blocks playback
      }
    }

    this.startSynth();
  }

  private startSynth(): void {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    this.masterGain?.gain.cancelScheduledValues(now);
    this.masterGain?.gain.setValueAtTime(0.0001, now);
    this.masterGain?.gain.exponentialRampToValueAtTime(0.14, now + 0.6);

    this.active = true;
    this.step = 0;
    this.playStep();
    this.loopTimer = window.setInterval(() => this.playStep(), 1600);
  }

  private playStep(): void {
    if (!this.ctx || !this.masterGain || !this.active) return;
    const now = this.ctx.currentTime;
    const chord = this.chords[this.step % this.chords.length];

    // Warm electric-piano style lowpass pad chord
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.22 : 0.12, now + 0.08 + idx * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.6);
    });

    // Soft diamond sparkle bell arpeggio accents
    const bellFreq = this.chimes[(this.step * 2) % this.chimes.length];
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(bellFreq, now + 0.4);
    bellGain.gain.setValueAtTime(0.0001, now + 0.4);
    bellGain.gain.linearRampToValueAtTime(0.08, now + 0.44);
    bellGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.45);
    bellOsc.connect(bellGain);
    bellGain.connect(this.masterGain);
    bellOsc.start(now + 0.4);
    bellOsc.stop(now + 1.5);

    this.step += 1;
  }

  public stop(): void {
    this.active = false;
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.mp3Audio) {
      this.mp3Audio.pause();
      this.mp3Audio.currentTime = 0;
      this.mp3Audio = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    }
  }

  public isPlaying(): boolean {
    return this.active;
  }
}

export const reunionAudio = new ReunionAudioEngine();
