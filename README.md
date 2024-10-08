<p align="center">
 <img align="center" src="https://cdn.discordapp.com/attachments/1288125624317382677/1288132876793020448/icon.png?ex=6705363a&is=6703e4ba&hm=a9dd121a4b4cac11a7ae3f206e5f5f2728f75a897ea3b5e5180fa4b94aa0e655&" height="96" />
 <h1 align="center">
  Motion Start
 </h1>
</p>

<div align="center">

An animation library inspired by [framer-motion](https://www.framer.com/motion/)

<a href="https://github.com/tailwindlabs/tailwindcss/actions"><img src="https://img.shields.io/github/actions/workflow/status/JonathonRP/motion-start/main.yaml" alt="Build Status"></a>
<a href="https://github.com/JonathonRP/motion-start/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/motion-start.svg" alt="License"></a>
<a href="https://github.com/JonathonRP/motion-start/releases"><img src="https://img.shields.io/npm/v/motion-start.svg" alt="Latest Release"></a>
<a href="https://www.npmjs.com/package/motion-start"><img src="https://img.shields.io/npm/dt/motion-start.svg" alt="Total Downloads"></a>
<a
href="https://discord.gg/TBdTdu6hmW"><img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FTBdTdu6hmW%3Fwith_counts%3Dtrue&query=%24.approximate_member_count&logo=discord&logoColor=white&label=chat&color=discord" alt="Discord Server Invite"></a>

</div>

---

> **Note** - this is in alpha expect bugs and please report or make PRs to fix bugs. This is svelte-motion ported to typescript currently. I have plans to evolve it to include modern features in framer-motion and to use svelte/motion to implement animations in the future.



## Documentation

For full documentation, visit ...coming soon.


### Installation

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

### Usage

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