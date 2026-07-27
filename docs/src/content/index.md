---
title: Introduction
description: A production-ready declarative motion library for Svelte.
section: Getting Started
---

<script>
	import { Callout, Card, CardGrid, DemoContainer } from "@svecodocs/kit";
	import GestureDemo from "$lib/components/demos/gesture-demo.svelte";
</script>

**Motion Start** is a declarative animation library for Svelte 5, built as a port of
[Framer Motion](https://motion.dev) `11.11.11`. You describe the state you want an element to be in
and Motion Start works out how to get there — including layout changes, gestures, scroll, and
enter/exit animations.

<DemoContainer class="flex justify-center py-10">
	<GestureDemo />
</DemoContainer>

Every animation above is just a prop:

```svelte
<script>
	import { motion } from "motion-start";
</script>

<motion.div
	whileHover={{ scale: 1.12 }}
	whileTap={{ scale: 0.92 }}
	transition={{ type: "spring", stiffness: 400, damping: 20 }}
/>
```

<Callout type="warning" title="Alpha">

Motion Start is currently in alpha. APIs may still change and you should expect bugs — please
[report them](https://github.com/JonathonRP/motion-start/issues) or open a PR.

</Callout>

## What's new in 0.2

`0.2.0-next.0` is a rewrite against `framer-motion@11.11.11` (previously `4.0.3`) on Svelte 5 runes.

**New**

- `Reorder.Group` / `Reorder.Item` for drag-to-reorder lists.
- `LayoutGroup` and the full projection engine, replacing `AnimateSharedLayout`.
- `AnimatePresence` `mode` (`sync` | `wait` | `popLayout`) and `usePresenceData`.
- WAAPI-accelerated animations, `animate()` sequences, and `stagger()`.
- Scroll (`useScroll`), viewport (`whileInView`) and `useInView` support.
- Motion value hooks: `useTime`, `useVelocity`, `useWillChange`, `useAnimate`, `useAnimateMini`.
- Subpath entries: `motion-start/dom`, `/mini`, `/m`, `/client`, `/projection`.

**Changed**

- Components and hooks are runes-based; the renderless `Use*.svelte` wrappers are gone in favour of
  plain functions and classes.
- `motion` and `m` are proxies, so any element is available as `motion.<tag>`.
- Gestures are rewritten onto the shared `Feature` pipeline (hover, press, pan, drag, focus).

**Removed**

- `AnimateSharedLayout` — use `LayoutGroup` with `layoutId`.
- `MotionDiv` — use `motion.div`.

## Explore

<CardGrid>
	<Card title="Getting Started" href="/docs/getting-started">
		Install Motion Start and write your first animation.
	</Card>
	<Card title="Animation" href="/docs/animation/overview">
		Props, variants, keyframes and orchestration.
	</Card>
	<Card title="Gestures" href="/docs/animation/gestures">
		Hover, press, pan, drag and viewport.
	</Card>
	<Card title="Layout animations" href="/docs/animation/layout">
		Animate between any two layouts with a single prop.
	</Card>
	<Card title="Components" href="/docs/components/motion">
		motion, AnimatePresence, LayoutGroup, Reorder and more.
	</Card>
	<Card title="Motion values" href="/docs/motion-values/overview">
		Track, transform and compose values outside of Svelte state.
	</Card>
</CardGrid>
