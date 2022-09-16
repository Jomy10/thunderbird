// Forms a link between the ui and the backend emulator

import Emulator from './main';
import envStr from '/game/env.txt?raw';

class EmulatorLoader {
  emulator: Emulator | undefined

  constructor() {
    this.emulator = undefined;
  }

  async load(canvas: HTMLCanvasElement) {
    this.emulator = await Emulator.init(canvas);
    this.emulator.display.fill(0b11111111);
    
    switch (envStr.toLowerCase().trim()) {
      case 'prod':
        break;
      case 'dev':
        console.log("Welcome to the Thunderbird developer console.");
        let req = new XMLHttpRequest();
        req.open("GET", "/game/game.wasm");
        req.responseType = "arraybuffer";
        req.onload = (_) => {
          const arrayBuffer = req.response;
          const byteBuffer = new Uint8Array(arrayBuffer);
          this.emulator!.loadRom(byteBuffer);
        };
        req.send(null);
        break;
      default:
        console.error("Unknown environment", envStr);
    }
  }
}

const emLoader = new EmulatorLoader();
export default emLoader;
