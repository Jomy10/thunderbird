import type { Component } from 'solid-js';

import { VStack } from '@hope-ui/solid';

import emLoader from '../emulator/loader';

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

export const DefaultRom: Component<{file: string, name: string}> = (props) => {
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
  
  return <Rom loadRom={loadRom} name={props.name} />
}

export const UserRom: Component<{}> = () => {
  return <div>TODO</div>;
}
