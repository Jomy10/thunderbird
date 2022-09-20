import type { DisplayFunctions } from './display';
import Display from './display';
import SoundEngine from './sound';
import CartridgeReader from './cartridgeReader';
import Processor from './processor';
import Console from './console';
import KeyboardManager from './keyboardManager';
import type { Allocator } from "../internals/alloc_load";
import loadAlloc from '../internals/alloc_load';

import fetchWasm from '../util/fetchWasm';

export type Queue = {
  init: () => void;
  enqueue: (val: number) => number;
  dequeue: () => [number, number];
  unsafeDequeue: () => number;
  availableSize: () => number;
};

/** Holds all components of the emulator */
export default class Emulator {
  display: Display;
  soundEngine: SoundEngine;
  cartridgeReader: CartridgeReader;
  processor: Processor;
  game_memory: WebAssembly.Memory;
  __memArr: Uint8Array;
  queue: Queue;
  _console: Console;
  allocator: Allocator;
  keyboardManager: KeyboardManager;

  /** Do not call directly */
  private constructor(
    d: Display,
    se: SoundEngine,
    cr: CartridgeReader,
    p: Processor,
    m: WebAssembly.Memory,
    _mA: Uint8Array,
    q: Queue,
    con: Console,
    alloc: Allocator,
    km: KeyboardManager,
  ) {
    this.display = d;
    this.soundEngine = se;
    this.cartridgeReader = cr;
    this.processor = p;
    this.game_memory = m;
    this.__memArr = _mA;
    this.queue = q;
    this._console = con
    this.allocator = alloc;
    this.keyboardManager = km;

    let req = new XMLHttpRequest();
    req.open('GET', `/wasm/start-screen.wasm`);
    req.responseType = "arraybuffer";
    req.onload = (_) => {
      const arrayBuffer = req.response;
      const byteBuffer = new Uint8Array(arrayBuffer);
      this.loadRom(byteBuffer);
    }
    req.send(null);
  }

  /** @constructor */
  static async init(canvas: HTMLCanvasElement): Promise<Emulator> {
    let queue_memory = new WebAssembly.Memory({
      initial: 1,
      maximum: 1
    });
    let game_memory = new WebAssembly.Memory({
      initial: 3,
      maximum: 3
    })
    let __memArr = new Uint8Array(game_memory.buffer);

    const _console = new Console(__memArr);
    let queue = await fetchWasm('/wasm/queue.wasm', {
      env: {
        memory: queue_memory,
        logN: _console.logN.bind(_console),
      }
    }) as Queue;
    queue.init();
    // registerKeyboardEvents(__memArr);
    let keyboardManager = new KeyboardManager();
    keyboardManager.registerKeyboardEvents(__memArr);

    let display = new Display(canvas, queue, await fetchWasm('/wasm/display.wasm', { queue }) as DisplayFunctions, );
    let soundEngine = new SoundEngine(queue);
    let cartridgeReader = new CartridgeReader();

    let processor = new Processor((await fetchWasm(
      '/wasm/processor.wasm',
      // Import object for processor
      {
        queue: {
          enqueue: queue.enqueue,
          dequeue: queue.dequeue,
          unsafeDequeue: queue.unsafeDequeue
        },
        game: {
          main_func: cartridgeReader.execMain.bind(cartridgeReader),
        },
        emulator: {
          draw: display.draw.bind(display),
          drawRect: display.drawRect.bind(display),
          fill: display.fill.bind(display),
          play0: soundEngine.__playLinkFunction0.bind(soundEngine),
          play1: soundEngine.__playLinkFunction1.bind(soundEngine),
          play2: soundEngine.__playLinkFunction2.bind(soundEngine),
        },
        console: {
          log: _console.log.bind(_console),
          logN: _console.logN.bind(_console)
        }
      })).tick as () => number,
      cartridgeReader,
      __memArr,
    );

    const allocator = await loadAlloc(game_memory);

    return new Emulator(
      display,
      soundEngine,
      cartridgeReader,
      processor,
      game_memory,
      __memArr,
      queue,
      _console,
      allocator,
      keyboardManager,
    );
  }

  /** gets the first byte in game memory */
  getKeys(): number {
    return this.__memArr[0];
  }

  /** Loads a rom from bytes into the cartridge reader */
  async loadRom(bytes: Uint8Array) {
    // Load rom function
    let fn = async () => {
      // Set screen to white
      this.queue.enqueue(3);
      this.queue.enqueue(255);
      await this.cartridgeReader.__loadRom(bytes, {
        env: {
          draw: this.display.displayFunctions.__draw,
          drawRect: this.display.displayFunctions.__drawRect,
          fill: this.display.displayFunctions.__fill,
          play: this.soundEngine.__playInstrument.bind(this.soundEngine),
          memory: this.game_memory,
          alloc: this.allocator.alloc,
          dealloc: this.allocator.dealloc,
          setTo0: this.allocator.setTo0,
          memset: this.allocator.memSet,
          memSetByte: this.allocator.memSetByte,
          getKeys: this.getKeys.bind(this),
          getTimestamp: function(): number { return Date.now(); },
          print: this._console.log.bind(this._console),
          printErr: this._console.logErr.bind(this._console),
          printN: this._console.logN.bind(this._console),
          enqueue: this.queue.enqueue,
          __dequeue_result: this.__dequeue_result.bind(this),
          availableQueueSize: this.queue.availableSize,
        },
        queue: this.queue,
      });
      this.processor.startGame();
      // Remove callback again
      this.processor.onExit = () => {};
    }; // fn

    if (this.processor.isRunning) {
      this.processor.onExit = () => {
        (async () => { fn() } )();
      };
      // Quit the currently running game
      this.queue.enqueue(0);
    } else {
      await fn();
    }
  }

  /** internal dequeue function */
  __dequeue_result(): number {
    let [res, _val] = this.queue.dequeue();
    return res;
  }
}
