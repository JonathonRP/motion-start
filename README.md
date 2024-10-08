<p align="center">
 <img align="center" src="https://cdn.discordapp.com/attachments/1288125624317382677/1288132876793020448/icon.png?ex=6705363a&is=6703e4ba&hm=a9dd121a4b4cac11a7ae3f206e5f5f2728f75a897ea3b5e5180fa4b94aa0e655&" height="96" />
 <h1 align="center">
  Motion Start
 </h1>
</p>

<div align="center">

An animation library inspired by [framer-motion](https://www.framer.com/motion/)

[![Build Status](https://img.shields.io/github/actions/workflow/status/JonathonRP/motion-start/main.yaml)](https://github.com/JonathonRP/motion-start/actions)
[![License](https://img.shields.io/npm/l/motion-start.svg?color=blue)](https://github.com/JonathonRP/motion-start/blob/main/LICENSE.md)
[![Latest Release](https://img.shields.io/npm/v/motion-start.svg)](https://github.com/JonathonRP/motion-start/releases)
[![Total Downloads](https://img.shields.io/npm/dt/motion-start.svg)](https://www.npmjs.com/package/motion-start)
[![Discord Server](https://img.shields.io/discord/1288125623570530334?logo=discord&logoColor=white&label=community&labelColor=5865F2")](https://discord.gg/bTa32kj9T3)
</div>

---

Work in progress.

> **Note**: The library is  in alpha expect bugs and please report or make PRs to fix bugs. This is svelte-motion ported to typescript currently. We have plans to evolve it to include modern features in framer-motion and to use svelte/motion to implement animations in the future.

## Installation

```sh
npm install --save-dev motion-start
```

```sh
pnpm install --save-dev motion-start
```

```sh
yarn install --save-dev motion-start
```

```sh
bun install --save-dev motion-start
```

## Usage

Corresponding to a `MotionDiv` in framer-motion is this:

```javascript

import { Motion } from 'motion-start'

<Motion let:motion><div use:motion/></Motion>
```
For svg elements like 'g', 'path' or 'circle', use:

```javascript
<Motion let:motion isSVG><g use:motion/></Motion>
```


# Community
Join the Discord server to ask questions, find collaborators, or say hi!

<a href="https://discord.gg/bTa32kj9T3" alt="Motion Start">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://invidget.switchblade.xyz/bTa32kj9T3">
  <img alt="Motion Start Discord Community" src="https://invidget.switchblade.xyz/bTa32kj9T3?theme=light">
</picture>
</a>
