import * as Tone from 'tone';
import type { Queue } from './main';

const pulseOptions = {
  oscillator: {
    type: "pulse"
  },
  envelope: {
    release: 0.07
  }
} as Tone.SynthOptions;

const squareOptions = {
  oscillator: {
    type: "square"
  },
  envelope: {
    release: 0.07
  }
} as Tone.SynthOptions;

const triangleOptions = {
  oscillator: {
    type: "triangle",
  },
  envelope: {
    release: 0.07
  }, volume: 10
} as Tone.SynthOptions;

class Instruments {
  pulseSynth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
  squareSynth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
  triangleSynth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;

  ready: boolean = false;

  constructor() {
    document.querySelector('body')?.addEventListener('click', async () => {
      if (!this.ready) {
        await Tone.start();
        console.info("Audio is ready");
        this.ready = true;
      }
    });
    this.pulseSynth = new Tone.PolySynth(Tone.Synth, pulseOptions).toDestination();
    this.squareSynth = new Tone.PolySynth(Tone.Synth, squareOptions).toDestination();
    this.triangleSynth = new Tone.PolySynth(Tone.Synth, triangleOptions).toDestination();
  }
}

export default class SoundEngine {
  instruments: Instruments
  queue: Queue;

  /** @constructor */
  constructor(q: Queue) {
    this.instruments = new Instruments();
    this.queue = q;
  }
  /**
  * Plays a `note` using `instrument` of length `length`
  * @param {number} instrument: { 0, 1, 2 }
  * @param {string} note: "{note}x"
  * @param {string} length: "x{n, t, m}"
  */
  play(instrument: number, note: string, length: string | number) {
    // console.log("playing", instrument, note, length);
    let instr: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
    switch (instrument) {
      case 0: instr = this.instruments.pulseSynth; break;
      case 1: instr = this.instruments.squareSynth; break;
      case 2: instr = this.instruments.triangleSynth; break;
      default: console.error("Unknown instrument id", instrument); return;
    }
    const now = Tone.now();
    instr.triggerAttackRelease(note, length, now);
  }

  // Caled by the processor
  __playLinkFunction0(note: number, length: number) {
    let [ noteF, lengthF ] = this.__linkFuncConvert(note, length);
    this.play(0, noteF, lengthF);
  }
  __playLinkFunction1(note: number, length: number) {
    let [ noteF, lengthF ] = this.__linkFuncConvert(note, length);
    this.play(1, noteF, lengthF);
  }
  __playLinkFunction2(note: number, length: number) {
    let [ noteF, lengthF ] = this.__linkFuncConvert(note, length);
    this.play(2, noteF, lengthF);
  }

  private __linkFuncConvert(_note: number, _length: number): [string, number | string] {
    const note: string = String.fromCharCode(((_note & 0b11100000) >>> 5) + 65);
    const octave: number = _note & 0b00011111;
    const noteF: string = note + octave;

    const length: number = (_length & 0b11111100) >>> 2;
    const time: number = (_length & 0b00000011);
    let lengthF: string | number;
    switch (time) {
      case 0:
        const mantissa = (length & 0b00111100) >>> 2;
        const shift = (length & 0b00000011);
        const outcome = mantissa / (10**shift);
        lengthF = outcome as number;
        break;
      case 1: lengthF = `${length}n`; break;
      case 2: lengthF = `${length}t`; break;
      case 3: lengthF = `${length}m`; break;
      default: console.error("Unknown time", time); throw "Unknown time";
    }
    return [noteF, lengthF];
  }

  // TODO: move to wat
  /**
  * Pushes the playing of this instrument with the given note and length ono the stack
  * @param instrument: {0, 1, 2} -> determines the instruction call
  * @param
  * note: 0b00000000;
  *         ---=====
  *          1   2
  * 1. Note: A = 000, B = 001, C = 010, D = 011, E = 100, F = 101, G = 110
  * 2. octave: 0 = 00000, 1 = 00001, etc.
  *
  * @param
  * length: 0b00000000;
  *           ------==
  *             1    2
  * 1. Length: number
  * 2. second = 00, n (note) = 01, t (triplet) = 10, m (measure) = 11
  *
  * ----------------------------
  * For the second measure (00):
  * 000000
  * ----==
  *   1  2
  * 1. A number (between 0 and 15)
  * 2. A number (between 0 and 3)
  * The second argument determines the amount of places to shift the floating point.
  *
  * - Examples:
  * 000101 = 0.1
  * 001000 = 2
  * 001111 = 0.003
  */
  __playInstrument(instrument: number, note: number, length: number) {
    this.queue.enqueue(4 + instrument);
    this.queue.enqueue(note);
    this.queue.enqueue(length);
  }
}
