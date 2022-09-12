type KeyLayout = {
  up: string; down: string;
  left: string; right: string;
  a: string; b: string;
  lb: string; rb: string;
};

export default class KeyboardManager {
  player2Registered: Boolean;
  keys: KeyLayout;
  eventListener: (event: KeyboardEvent) => void;
  
  constructor() {
    this.player2Registered = false;
    this.keys = {
      up: "KeyW", down: "KeyS",
      left: "KeyA", right: "KeyD",
      a: "KeyH", b: "KeyU",
      lb: "KeyN", rb: "KeyI",
    };
    this.eventListener = () => {};
  }

  registerKeyboardEvents(arr: Uint8Array) {
    arr[0] = 0; // Initialize the first byte of the array to be 0
    let keys = this.keys;

    // Set the key bit to 1
    document.addEventListener('keydown', function(event) {
      // up
      if (event.code == keys.up || event.code == "ArrowUp") arr[0] |= 0b10000000;
      // down
      if (event.code == keys.down || event.code == "ArrowDown") arr[0] |= 0b01000000;
      // left
      if (event.code == keys.left || event.code == "ArrowLeft") arr[0] |= 0b00100000;
      // right
      if (event.code == keys.right || event.code == "ArrowRight") arr[0] |= 0b00010000;
      // A
      if (event.code == keys.a) arr[0] |= 0b00001000;
      // B
      if (event.code == keys.b) arr[0] |= 0b00000100;
      // L
      if (event.code == keys.lb) arr[0] |= 0b00000010;
      // R
      if (event.code == keys.rb) arr[0] |= 0b00000001;
    });

    // Set the key bit to 0
    document.addEventListener('keyup', function(event) {
      // up
      if (event.code == keys.up || event.code == "ArrowUp") arr[0] &= 0b01111111;
      // down
      if (event.code == keys.down || event.code == "ArrowDown") arr[0] &= 0b10111111;
      // left
      if (event.code == keys.left || event.code == "ArrowLeft") arr[0] &= 0b11011111;
      // right
      if (event.code == keys.right || event.code == "ArrowRight") arr[0] &= 0b11101111;
      // A
      if (event.code == keys.a) arr[0] &= 0b11110111;
      // B
      if (event.code == keys.b) arr[0] &= 0b11111011;
      // L
      if (event.code == keys.lb) arr[0] &= 0b11111101;
      // R
      if (event.code == keys.rb) arr[0] &= 0b11111110;
    });
  }
}
