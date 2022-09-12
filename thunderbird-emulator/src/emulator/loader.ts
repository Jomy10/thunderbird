// Forms a link between the ui and the backend emulator

import Emulator from './main';

class EmulatorLoader {
  emulator: Emulator | undefined

  constructor() {
    this.emulator = undefined;
  }

  async load(canvas: HTMLCanvasElement) {
    this.emulator = await Emulator.init(canvas);
    this.emulator.display.fill(0b11111111);
  }
}

const emLoader = new EmulatorLoader();
export default emLoader;
