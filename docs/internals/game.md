# A game for the thunderbird console

A game for the Thunderbird console is a WebAssembly library that exports 3 functions:

- `__init`: called once when the cartridge is inserted
  - `(func (export "__init"))`
- `__main`: called every 60 seconds
  - `(func (export "__main"))`
- `__deinit`: called when the cartridge is removed
  - `(func (export "__deinit"))`
  
The game can import all [functions that the console provides](https://github.com/Jomy10/thunderbird/blob/426a25ef5f3047859bc97eaad504397a83ebdded/thunderbird-emulator/src/emulator/main.ts#L159-L176).
