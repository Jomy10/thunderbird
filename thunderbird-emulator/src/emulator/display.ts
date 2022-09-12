import type { Queue } from './main';

// Color constants //
// mul for bit position
const bit1 = Math.pow(2, 0);
const bit2 = Math.pow(2, 1);
const bit3 = Math.pow(2, 2);

// Amount of possible combinations for different amount of bits
const byteSize = Math.pow(2, 8);

const size2bit = bit1 + bit2;
const size3bit = bit1 + bit2 + bit3;

type Rgb8bitColor = {
  r: number;
  g: number;
  b: number;
};

export type DisplayFunctions = {
  __draw: (x: number, y: number, c: number) => number;
  __drawRect: (x: number, y: number, w: number, h: number, c: number) => number;
  __fill: (c: number) => number;
};

export default class Display {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  queue: Queue;
  /** Functions that push to the stack instead of executing them directly */
  displayFunctions: DisplayFunctions;

  constructor(canvas: HTMLCanvasElement, queue: Queue, df: DisplayFunctions) {
    this.canvas = canvas;
    let ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      console.error("Could not create 2d context.");
    }
    this.ctx = ctx as CanvasRenderingContext2D;
    this.queue = queue;
    this.displayFunctions = df;
    // this.displayFunctions = {
    //   __draw: this.__draw.bind(this),
    //   __drawRect: this.__drawRect.bind(this),
    //   __fill: this.__fill.bind(this)
    // }
  }

  __draw(x, y, c): number {
    if (this.queue.enqueue(1) == 1) {
      console.log("Failed to enqueue draw");
    }
    if (this.queue.enqueue(x) == 1) {
      console.log("Failed to enqueue draw", x, y, c);
    }
    if (this.queue.enqueue(y) == 1) {
      console.log("Failed to enqueue draw", x, y, c);
    }
    if (this.queue.enqueue(c) == 1) {
      console.log("Failed to enqueue draw", x, y, c);
    }
    return 0;
  }
  
  __drawRect(x, y, w, h, c): number {
    if (this.queue.enqueue(2) == 1) {
      console.log("Failed to enqueue drawRect", x, y, w, h, c);
    }
    if (this.queue.enqueue(x) == 1) {
      console.log("Failed to enqueue drawRect", x, y, w, h, c);
    }
    if (this.queue.enqueue(y) == 1) {
      console.log("Failed to enqueue drawRect", x, y, w, h, c);
    }
    if (this.queue.enqueue(w) == 1) {
      console.log("Failed to enqueue drawRect", x, y, w, h, c);
    }
    if (this.queue.enqueue(h) == 1) {
      console.log("Failed to enqueue drawRect", x, y, w, h, c);
    }
    if (this.queue.enqueue(c) == 1) {
      console.log("Failed to enqueue drawRect", x, y, w, h, c);
    }
    return 0;
  }

  __fill(c): number {
    if (this.queue.enqueue(3) == 1) {
      console.log("Failed to enqueue fill", c, "- queue count:", this.queue.getQueueCount());
    }
    if (this.queue.enqueue(c) == 1) {
      console.log("Failed to enqueue fill", c, "- queue count:", this.queue.getQueueCount());
    }

    return 0;
  }
  

  // Convert an 8bit color to rgb values
  // 0b00000000
  //   ---===--
  //    r  g  b
  private static __convertColorToRgb(color: number): Rgb8bitColor {
    let r3 = (color & 0b10000000) > 0 ? 1 : 0;
    let r2 = (color & 0b01000000) > 0 ? 1 : 0;
    let r1 = (color & 0b00100000) > 0 ? 1 : 0;

    let rVal = r3 * bit3 + r2 * bit2 + r1 * bit1; // val between 0 and 7
    let r = Math.floor((byteSize / size3bit) * rVal); // convert to val between 0 and 256

    let g3 = (color & 0b00010000) > 0 ? 1 : 0;
    let g2 = (color & 0b00001000) > 0 ? 1 : 0;
    let g1 = (color & 0b00000100) > 0 ? 1 : 0;

    let gVal = g3 * bit3 + g2 * bit2 + g1 * bit1;
    let g = Math.floor((byteSize / size3bit) * gVal);

    let b2 = (color & 0b00000010) > 0 ? 1 : 0;
    let b1 = (color & 0b00000001) > 0 ? 1 : 0;

    let bVal = b2 * bit2 + b1 * bit1;
    let b = Math.floor((byteSize / size2bit) * bVal);

    return { r: r, g: g, b: b };
  }

  // Draw instructions //
  fill(color: number) {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

    let rgb = Display.__convertColorToRgb(color);
    this.ctx.fillStyle = `rgb(
      ${rgb.r},
      ${rgb.g},
      ${rgb.b}
    )`;
    this.ctx.fill();
  }

  draw(x: number, y: number, color: number) {
    this.ctx.beginPath();
    const pixelSize = (this.canvas.width / 255);

    let rgb = Display.__convertColorToRgb(color);
    this.ctx.fillStyle = `rgb(
      ${rgb.r},
      ${rgb.g},
      ${rgb.b}
    )`;

    this.ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }

  drawRect(x: number, y: number, width: number, height: number, color: number) {
    this.ctx.beginPath();
    const pixelSize = (this.canvas.width / 255);
    this.ctx.rect(x * pixelSize, y * pixelSize, width * pixelSize, height * pixelSize);

    let rgb = Display.__convertColorToRgb(color);
    this.ctx.fillStyle = `rgb(
      ${rgb.r},
      ${rgb.g},
      ${rgb.b}
    )`;
    this.ctx.fill();
  }
}
