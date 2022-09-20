/** The console which can be printe to */
export default class Console {
  memArr: Uint8Array;
  decoder: TextDecoder;

  constructor(ma: Uint8Array) {
    this.memArr = ma;
    this.decoder = new TextDecoder();
  }

  /** Log the string stored in wasm memory starting at byte `memStart` through
   `memStart` + `length`*/
  log(memStart: number, length: number) {
    const slice = this.memArr.slice(memStart, memStart + length);
    console.log(String.fromCharCode(... slice));
  }

  logErr(memStart: number, length: number) {
    const slice = this.memArr.slice(memStart, memStart + length);
    console.error(String.fromCharCode(...slice));
  }

  /** Log the number `n` */
  logN(n: number) {
    console.log(n);
  }
}
