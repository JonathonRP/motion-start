# Motion Start

An animation library based on [framer-motion](https://www.framer.com/motion/). 

[Visit Project Page](https://svelte-motion.gradientdescent.de)

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

