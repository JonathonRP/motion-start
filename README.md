
# Motion Start

this is in alpha expect bugs and please report or make PRs to fix bugs.

fyi this is svelte-motion ported to typescript currently.

plan is to evolve it to include modern features in framer-motion and to use svelte/motion to implement animations in the future

An animation library based on [framer-motion](https://www.framer.com/motion/).

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
import { Motion } from 'motion-start'

<Motion let:motion><div use:motion/></Motion>
```
For svg elements like 'g', 'path' or 'circle', use:

```javascript
<Motion let:motion isSVG><g use:motion/></Motion>
```

