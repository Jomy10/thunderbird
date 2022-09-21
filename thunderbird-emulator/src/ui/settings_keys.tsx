import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

import { VStack } from '@hope-ui/solid';

import emLoader from '../emulator/loader';

enum Key {
  Up, Down, Left, Right,
  A, B, LBtn, RBtn,
}

const KeySettings: Component = () => {
  let [up, setUp] = createSignal(emLoader?.emulator?.keyboardManager.keys.up.replace("Key", ""));
  let [down, setDown] = createSignal(emLoader?.emulator?.keyboardManager.keys.down.replace("Key", ""));
  let [left, setLeft] = createSignal(emLoader?.emulator?.keyboardManager.keys.left.replace("Key", ""));
  let [right, setRight] = createSignal(emLoader?.emulator?.keyboardManager.keys.right.replace("Key", ""));
  let [a, setA] = createSignal(emLoader?.emulator?.keyboardManager.keys.a.replace("Key", ""));
  let [b, setB] = createSignal(emLoader?.emulator?.keyboardManager.keys.b.replace("Key", ""));
  let [lBtn, setLBtn] = createSignal(emLoader?.emulator?.keyboardManager.keys.lb.replace("Key", ""));
  let [rBtn, setRBtn] = createSignal(emLoader?.emulator?.keyboardManager.keys.rb.replace("Key", ""));
  
  let key: Key | null = null;
  function register(_key: Key) {
    key = _key;
  }
  
  function keyHandle(event: KeyboardEvent) {
    if (key == null) return;
    
    switch (key) {
      case Key.Up:
        emLoader!.emulator!.keyboardManager.keys.up = event.code;
        setUp(event.key.toUpperCase());
        break;
      case Key.Down:
        emLoader!.emulator!.keyboardManager.keys.down = event.code;
        setDown(event.key.toUpperCase());
        break;
      case Key.Left:
        emLoader!.emulator!.keyboardManager.keys.left= event.code;
        setLeft(event.key.toUpperCase());
        break;
      case Key.Right:
        emLoader!.emulator!.keyboardManager.keys.right = event.code;
        setRight(event.key.toUpperCase());
        break;
      case Key.A:
        emLoader!.emulator!.keyboardManager.keys.a = event.code;
        setA(event.key.toUpperCase());
        break;
      case Key.B:
        emLoader!.emulator!.keyboardManager.keys.b = event.code;
        setB(event.key.toUpperCase());
        break;
      case Key.LBtn:
        emLoader!.emulator!.keyboardManager.keys.lb = event.code;
        setLBtn(event.key.toUpperCase());
        break;
      case Key.RBtn:
        emLoader!.emulator!.keyboardManager.keys.rb = event.code;
        setRBtn(event.key.toUpperCase());
        break;
    }
    
    key = null;
  }
  
  document.addEventListener('keydown', keyHandle);
  
  // <span class="nes-text is-primary">Player 1</span>
  return <VStack>
    <button type="button" onclick={() => { register(Key.Up)}} class="nes-btn">Up {up()}</button>
    <button type="button" onclick={() => { register(Key.Down)}} class="nes-btn">Down {down()}</button>
    <button type="button" onclick={() => { register(Key.Left)}} class="nes-btn">Left {left()}</button>
    <button type="button" onclick={() => { register(Key.Right)}} class="nes-btn">Right {right()}</button>
    <button type="button" onclick={() => { register(Key.A)}} class="nes-btn">A {a()}</button>
    <button type="button" onclick={() => { register(Key.B)}} class="nes-btn">B {b()}</button>
    <button type="button" onclick={() => { register(Key.LBtn)}} class="nes-btn">Left Button {lBtn()}</button>
    <button type="button" onclick={() => { register(Key.RBtn)}} class="nes-btn">Right Button {rBtn()}</button>
  </VStack>;
};

export default KeySettings;
