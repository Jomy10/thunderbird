/** Maps to the wasm exports of a game */
export type Cartridge = {
  __init: () => void;
  __main: () => void;
  __deinit: () => void;
}

/** Reads and stores cartridges */
export default class CartridgeReader {
  cartridge: Cartridge | undefined;
  init: () => void;
  main: () => void;
  deinit: () => void;

  constructor() {
    this.init = () => {};
    this.main = () => {};
    this.deinit = () => {};
    this.cartridge = undefined;
  }

  /** Remove the cartridge */
  eject() {
    this.init = () => {};
    this.main = () => {};
    this.deinit = () => {};
    this.cartridge = undefined;
  }

  /** Load a rom from cartridge object */
  insertCartridge(cart: Cartridge) {
    this.init = cart.__init;
    this.main = cart.__main;
    this.deinit = cart.__deinit;
    this.cartridge = cart;
  }

  /** Executes the main function
   * used for passing function to wasm using bind */
  execMain() {
    this?.main();
  }

  /** Load a rom from bytes */
  async __loadRom(bytes: Uint8Array, env: Object) {
    let obj = await WebAssembly.instantiate(
      bytes,
      // Object passed to the game
      env as WebAssembly.Imports
    )
    let exports = obj.instance.exports;
    this.insertCartridge(exports as Cartridge);
  }
}
