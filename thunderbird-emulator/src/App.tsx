import type { Component } from 'solid-js';
import { Switch, Match, createSignal } from 'solid-js';

import {
  HopeThemeConfig, HopeProvider, NotificationsProvider,
  HStack, VStack, Center, Drawer, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, createDisclosure } from '@hope-ui/solid';

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
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [ winWidth, setWinWidth ] = createSignal(window.innerWidth);
  window.addEventListener('resize', (_e) => {
    setWinWidth(window.innerWidth);
  });
  
  const canvas = <Canvas/>
    
  return <>
      <Settings isOpen={props.open() === Opened.Settings} onClose={() => { props.setOpen(Opened.None); }} />
      <Center w="94vw" h="100%">
        <Switch fallback={<>
          <VStack w="fit-content" spacing="24px">
            <button class="nes-btn" onClick={onOpen}>Open library</button>
            {canvas}
          </VStack>
          <Drawer
            opened={isOpen()}
            placement="right"
            onClose={onClose}
          >
            <DrawerContent bg={"#2b3036"}>
              <DrawerCloseButton icon={<i class="nes-icon close"></i>}/>
              <DrawerHeader>Rom library</DrawerHeader>
              <DrawerBody>
                <RomLib includeContainer={false}/>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>}>
          <Match when={winWidth() > 605}>
            <HStack w="fit-content" spacing="24px">
              {canvas}
              <RomLib/>
            </HStack>
          </Match>
        </Switch>
      </Center>
  </>;
};

const App: Component = () => {
  let [ screen, setScreen ] = createSignal(Screen.Emulator);
  let [ open, setOpen ] = createSignal(Opened.None);
  
  return <>
    <div style="display: flex; flex-flow: column; height: 100%;">
      <HopeProvider config={hopeConfig}>
        <NotificationsProvider>
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
        </NotificationsProvider>
      </HopeProvider>
    </div>
  </>;
};

export default App;
