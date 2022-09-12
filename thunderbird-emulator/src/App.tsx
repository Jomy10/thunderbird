import type { Component } from 'solid-js';
import { Switch, Match, createSignal } from 'solid-js';

import {
  HopeThemeConfig, HopeProvider,
  HStack, Center } from '@hope-ui/solid';

import styles from './App.module.css';

import Canvas from "./ui/canvas";
import RomLib from "./ui/romLib";
import Nav from './ui/nav';
import Settings from './ui/settings';
import DeveloperTools from './ui/developer';

const hopeConfig: HopeThemeConfig = {
  initialColorMode: "dark"
}

/** What is opened in the sidebar */
enum Opened {
  None,
  Settings,
}

/** What main screen is opened*/
enum Screen {
  Emulator,
  Developer,
}

const EmulatorScreen: Component<{ open: () => Opened, setOpen: (o: Opened) => void }> = (props) => {

  return <>
      <Settings isOpen={props.open() === Opened.Settings} onClose={() => { props.setOpen(Opened.None); }} />
      <Center w="94vw" h="100vh">
        <HStack w="fit-content" spacing="24px">
          <Canvas/>
          <RomLib/>
        </HStack>
      </Center>
  </>;
};

const App: Component = () => {
  let [ screen, setScreen ] = createSignal(Screen.Emulator);
  let [ open, setOpen ] = createSignal(Opened.None);
  
  return (<>
    <div style="overflow: hidden;">
      <HopeProvider config={hopeConfig}>
        <Nav 
          onSettings={() => { setOpen(Opened.Settings); }}
          onDev={() => { setScreen(screen() === Screen.Emulator ? Screen.Developer : Screen.Emulator) }}
          isDev={screen() === Screen.Developer}
        />
        <div class={styles.App}>
          <Switch>
            <Match when={screen() === Screen.Emulator}>
              <EmulatorScreen open={open} setOpen={setOpen} />
            </Match>
            <Match when={screen() === Screen.Developer}>
              <DeveloperTools/>
            </Match>
          </Switch>
        </div>
      </HopeProvider>
    </div>
  </>);
};

export default App;
