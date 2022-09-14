import CartridgeReader from './cartridgeReader';

/** Takes care of running the game and executing instruction */
export default class Processor {
  tick: () => number;
  cartridgeLink: CartridgeReader;
  memArr: Uint8Array;
  isRunning: Boolean;
  onExit: () => void;

  constructor(tick: () => number, link: CartridgeReader, memArr: Uint8Array) {
    this.tick = tick;
    this.cartridgeLink = link;
    this.memArr = memArr;
    this.isRunning = false;
    this.onExit = () => {};
 }

  /** Starts the game loop and calls the init and deinit funcs when appropriate */
  startGame() {
    this.isRunning = true;
    this.memArr[0] = 0;
    this.cartridgeLink.init();
    window.requestAnimationFrame(this.__mainFunc.bind(this));
  }

  /** the previous time stamps where the last tick was executed */
  private __prevTime: number = 0;
  private fps: number = 60;
  private async __mainFunc(timestamp: number) {
    let secondsPassed = (timestamp - this.__prevTime) / 1000;
    let quit = this.cartridgeLink.cartridge == undefined; // if no cartridge present, quit the game

    if (secondsPassed >= 1 / this.fps) {
      this.__prevTime = timestamp;
      let returnCode = this.tick();
      quit = returnCode != 0;
    }

    if (!quit) window.requestAnimationFrame(this.__mainFunc.bind(this));
    else {
      this.cartridgeLink.deinit();
      this.isRunning = false;
      this.onExit();
    }
  }
}
