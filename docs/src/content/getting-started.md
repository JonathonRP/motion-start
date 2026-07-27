---
title: Getting Started
description: Install Motion Start and write your first animation.
section: Overview
---

<script>
	import { Callout, Steps, DemoContainer } from "@svecodocs/kit";
	import PresenceDemo from "$lib/components/demos/presence-demo.svelte";
</script>

## Requirements

Motion Start requires **Svelte 5**. Runes are used throughout the library, so a Svelte 4 project
will need to migrate first.

## Install

```bash
npm install motion-start
```

While the rewrite is in alpha, install the `next` tag explicitly:

```bash
npm install motion-start@next
```

## Import

Everything is exported from the package root:

```ts
import { motion, AnimatePresence, useMotionValue } from "motion-start";
```

Smaller entry points are available when you only need part of the library:

| Entry                    | Contents                                                    |
| ------------------------ | ----------------------------------------------------------- |
| `motion-start`           | Everything — components, hooks, values, projection.          |
| `motion-start/m`         | The `m` component only, for use with `LazyMotion`.           |
| `motion-start/dom`       | The imperative DOM API — `animate`, `scroll`, `inView`.      |
| `motion-start/mini`      | The mini animation API, backed by WAAPI.                     |
| `motion-start/dom/mini`  | The mini DOM API.                                            |
| `motion-start/projection` | The projection engine, for advanced layout work.            |

## Your first animation

Any HTML or SVG element is available on the `motion` proxy. Give it an `animate` prop and it will
animate to that state whenever the values change.

```svelte
<script>
	import { motion } from "motion-start";
</script>

<motion.div
	initial={{ opacity: 0, y: 20 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ type: "spring", stiffness: 300, damping: 24 }}
/>
```

- `initial` — the state the element mounts in.
- `animate` — the state to animate towards.
- `transition` — how to get there.

## Animating elements out

Svelte removes elements from the DOM immediately, so exit animations need `AnimatePresence` to keep
them alive until the animation finishes.

<DemoContainer class="py-8">
	<PresenceDemo />
</DemoContainer>

```svelte
<script>
	import { motion, AnimatePresence } from "motion-start";

	let visible = $state(true);
</script>

<AnimatePresence>
	{#if visible}
		<motion.div
			initial={{ opacity: 0, scale: 0.6 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.6 }}
		/>
	{/if}
</AnimatePresence>
```

<Callout type="tip" title="Keyed blocks">

Inside `{#each}` blocks, always use a keyed block (`{#each items as item (item.id)}`) so
`AnimatePresence` can tell which element is leaving.

</Callout>

## Next steps

- [Animation overview](/docs/animation/overview) — variants, keyframes and orchestration.
- [Gestures](/docs/animation/gestures) — hover, press, drag and viewport.
- [Layout animations](/docs/animation/layout) — the `layout` prop and shared elements.
- [Motion values](/docs/motion-values/overview) — composing values outside of Svelte state.
