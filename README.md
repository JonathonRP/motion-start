<p align="center">
 <!-- <img align="center" src="https://raw.githubusercontent.com/huntabyte/shadcn-svelte/main/sites/docs/static/android-chrome-192x192.png" height="96" /> -->
 <h1 align="center">
  Motion Start
 </h1>
</p>

<div align="center">

An animation library inspired by [framer-motion](https://www.framer.com/motion/)

[![Join discord server](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FTBdTdu6hmW%3Fwith_counts%3Dtrue&query=%24.approximate_member_count&logo=discord&logoColor=9656CE&label=motion-start&labelColor=light-gray&color=9656CE&link=https%3A%2F%2Fdiscord.gg%2FTBdTdu6hmW)](https://discord.gg/TBdTdu6hmW)
[![CI](https://github.com/JonathonRP/motion-start/actions/workflows/main.yaml/badge.svg)](https://github.com/JonathonRP/motion-start/actions/workflows/main.yaml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/JonathonRP/motion-start/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/motion-start.svg)](https://badge.fury.io/js/motion-start)

</div>

> **Note** <br> this is in alpha expect bugs and please report or make PRs to fix bugs. <br> this is svelte-motion ported to typescript currently. plan is to evolve it to include modern features in framer-motion and to use svelte/motion to implement animations in the future.

## Installation

```bash
npm install --save-dev motion-start
```

```bash
pnpm install --save-dev motion-start
```

```bash
yarn install --save-dev motion-start
```

```bash
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


## Community

Join the Discord server to ask questions, find collaborators, or just say hi!

<a href="https://discord.gg/TBdTdu6hmW" alt="Svecosystem Discord community">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://invidget.switchblade.xyz/TBdTdu6hmW">
  <img alt="Svecosystem Discord community" src="https://invidget.switchblade.xyz/TBdTdu6hmW?theme=light">
</picture>
</a>