import type { Component } from 'solid-js';
import { For } from 'solid-js';

import { VStack, Divider } from '@hope-ui/solid';

import * as localForage from 'localforage';

import emLoader from '../emulator/loader';

/** A single rom in the Rom library */
const Rom: Component<{loadRom: () => void, name: string, romImageLink?: string}> = (props) => {
  return (
    <a onclick={props.loadRom}>
      <VStack>
        <img width="100vw" src={`/rom-covers/${props.romImageLink || "__default.png"}`} style="image-rendering: pixelated;"></img>
        <p style="overflow-wrap: break-word; hyphens: auto;">{props.name}</p>
      </VStack>
    </a>
  );
};

export const DefaultRom: Component<{file: string, name: string, img?: string}> = (props) => {
  function loadRom() {
    let req = new XMLHttpRequest();
    req.open('GET', `/wasm/${props.file}`);
    req.responseType = "arraybuffer";
    req.onload = (_) => {
      const arrayBuffer = req.response;
      const byteBuffer = new Uint8Array(arrayBuffer);
      emLoader?.emulator?.loadRom(byteBuffer);
    }
    req.send(null);
  }

  return <Rom loadRom={loadRom} name={props.name} romImageLink={props.img} />
}

export const UserRom: Component<{key: string}> = (props) => {
  async function loadRom() {
    const romBytes: Uint8Array = (await localForage.getItem(props.key))!;
    emLoader?.emulator?.loadRom(romBytes);
  }

  return <Rom loadRom={loadRom} name={props.key}></Rom>;
}

export const UserRoms: Component<{keys: string[]}> = (props) => {
  console.log("keys", props.keys);
  return <For each={props.keys}>{(rom, _i) => <>
    <Divider/>
    <UserRom key={rom}/>
  </>}</For>;
}
