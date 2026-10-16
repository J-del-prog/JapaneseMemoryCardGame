// Arcade Retro Sound Synthesizer (Web Audio API)
// Authentic 8-bit / 16-bit coin-op audio synthesis without external files

class ArcadeAudio {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.bgmEnabled = false;
    this.bgmInterval = null;
    this.bgmStep = 0;
    this.voiceEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCoin() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';

    osc1.frequency.setValueAtTime(987.77, now); // B5
    osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    osc2.frequency.setValueAtTime(987.77 * 1.005, now);
    osc2.frequency.setValueAtTime(1318.51 * 1.005, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  playFlip() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.07);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playMatch(combo = 1) {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const basePitch = Math.min(combo - 1, 3);
    
    [0, 1, 2].forEach((offset, idx) => {
      const noteFreq = notes[basePitch + offset] || 1046.50;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(noteFreq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.14, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  playMismatch() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.18);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playHint() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    [0, 1, 2, 3].forEach((i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.05);
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.2);
    });
  }

  playVictory() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // Chiptune victory fanfare
    const fanfare = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.50, d: 0.28 },
      { f: 880.00, d: 0.14 },
      { f: 1046.50, d: 0.45 }
    ];
    let timeAcc = now;
    fanfare.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, timeAcc);
      gain.gain.setValueAtTime(0.16, timeAcc);
      gain.gain.exponentialRampToValueAtTime(0.001, timeAcc + note.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(timeAcc);
      osc.stop(timeAcc + note.d);
      timeAcc += note.d * 0.95;
    });
  }

  playGameOver() {
    if (!this.sfxEnabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [440, 415.3, 392, 369.99, 329.63];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.12, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.3);
    });
  }

  toggleBGM() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  startBGM() {
    this.init();
    this.stopBGM();
    // Catchy Japanese Arcade Pentatonic 8-bit loop
    const melody = [
      { f: 440, d: 0.2 }, { f: 523.25, d: 0.2 }, { f: 587.33, d: 0.2 }, { f: 659.25, d: 0.3 },
      { f: 587.33, d: 0.2 }, { f: 523.25, d: 0.2 }, { f: 440, d: 0.3 }, { f: 0, d: 0.1 },
      { f: 392, d: 0.2 }, { f: 440, d: 0.2 }, { f: 523.25, d: 0.3 }, { f: 587.33, d: 0.3 },
      { f: 659.25, d: 0.2 }, { f: 783.99, d: 0.2 }, { f: 880, d: 0.4 }, { f: 0, d: 0.2 }
    ];

    let noteIdx = 0;
    this.bgmInterval = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx) return;
      const note = melody[noteIdx];
      noteIdx = (noteIdx + 1) % melody.length;
      if (note.f > 0) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f * 0.5, now); // Bass chime
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + note.d);
      }
    }, 240);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  speakJapanese(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis not supported or blocked", e);
    }
  }
}

window.arcadeAudio = new ArcadeAudio();
