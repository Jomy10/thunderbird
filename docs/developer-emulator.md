# Starting a local developer emulator

It is possible to develop for the console without having a local emulator.
However, it will be easier to develop with one.

## Prerequisites

To start the development server, you will need:

- Node.js
- A node package manager (npm / pnpm / yarn)
- [wat2wasm from the wabt](https://github.com/WebAssembly/wabt)

## Building the emulator

**Clone the repository.**

```sh
git clone https://github.com/jomy10/thunderbird
```

**Install dependencies**

<!-- tabs:start -->

#### **npm**

```sh
cd thunderbird
npm i
```

#### **pnpm**

```sh
cd thunderbird
pnpm i
```

#### **yarn**

```sh
cd thunderbird
yarn add
```

<!-- tabs:end -->

## Running the emulator

Inside of the `thunderbird-emulator` directory, run the following:

<!-- tabs:start -->

#### **npm**

```sh
npm run game-dev
```

#### **pnpm**

```sh
pnpm run game-dev
```

#### **yarn**

```sh
yarn run game-dev
```

<!-- tabs:end -->

Now visit the specified localhost address in your favourite browser.

## Running your game

You now have a development emulator. Copy your game file into
`thunderbirb-emulator/game/game.wasm` to start it and reload the webpage.

In the next chapters we will discuss how to make a game for the emulator.
There are 2 way to build a game. The easiest way is using the [developer API](developer-api),
this provides an easy abstraction over the console's queue. The other way is using
the [queue](queue) directly. Here you manually queue instructions for the console to execute.
