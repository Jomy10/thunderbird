import type { Component } from 'solid-js';
import { onMount } from 'solid-js';

import Emulator from '../emulator/main';
import emLoader from '../emulator/loader';

import styles from '../App.module.css';

const Canvas: Component = () => {
  let emulator: Emulator;

  let canvasEl: HTMLCanvasElement | undefined;
  onMount(async () => {
    await emLoader.load(canvasEl as HTMLCanvasElement)
  });

  const canvasResolution = 10; // 10x 256 pixels
  const cres = canvasResolution * 255;

  return (
    <canvas class={styles.display} width={cres} height={cres} ref={canvasEl}></canvas>
  );
};

export default Canvas;
