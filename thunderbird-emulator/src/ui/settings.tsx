import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';

import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, DrawerHeader, Divider, VStack, createDisclosure } from '@hope-ui/solid';

import KeySettings from './settings_keys';

import * as localForage from 'localforage';

const Settings: Component<{isOpen: Boolean, onClose: () => void}> = (props) => {
  const { isOpen, onOpen, onClose } = createDisclosure();

  createEffect(() => {
    if (props.isOpen) { onOpen(); }
  });
  
  async function clearRoms() {
    await localForage.clear();
    window.location.reload();
  }

  return (<>
    <Drawer
      opened={isOpen()}
      placement="right"
      onClose={() => {onClose(); props.onClose();}}
    >
      <DrawerOverlay />
      <DrawerContent bg={"#2b3036"}>
        <DrawerCloseButton icon={<i class="nes-icon close"></i>} />
        <DrawerHeader>Settings</DrawerHeader>
        <DrawerBody>
          <VStack spacing="10px">
            <h2>Local roms</h2>
            <button class="nes-btn is-error" onClick={clearRoms}>Remove all local roms</button>
            <Divider/>
            <h2>Remap keys</h2>
            <KeySettings/>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  </>);
};

export default Settings;
