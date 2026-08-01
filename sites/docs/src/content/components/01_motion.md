---
title: motion
description: The motion proxy drives most animations in Motion Start.
section: Components
---

<script>
	import { Callout, PropField, DemoContainer } from "@svecodocs/kit";
	import GestureDemo from "$lib/components/demos/gesture-demo.svelte";
</script>

`motion` is a proxy: every HTML and SVG element is available on it as `motion.div`, `motion.button`,
`motion.circle`, and so on. A motion component behaves exactly like its plain counterpart — same
attributes, same events — plus animation props.

```svelte
<script>
	import { motion } from "motion-start";
</script>

<motion.div
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	exit={{ opacity: 0 }}
	whileHover={{ scale: 1.05 }}
	transition={{ type: "spring" }}
/>
```

<DemoContainer class="flex justify-center py-10">
	<GestureDemo />
</DemoContainer>

## Animation props

<PropField name="initial" type="Target | VariantLabels | false">
The state the component mounts in. `false` skips the mount animation.
</PropField>

<PropField name="animate" type="Target | VariantLabels | AnimationControls">
The state to animate towards whenever it changes.
</PropField>

<PropField name="exit" type="Target | VariantLabels">
The state to animate to before unmounting. Requires an `AnimatePresence` ancestor.
</PropField>

<PropField name="transition" type="Transition">
How values animate. See [Transitions](/docs/animation/transitions).
</PropField>

<PropField name="variants" type="Variants">
Named animation targets, so labels can be used instead of objects — and inherited by children.
</PropField>

<PropField name="style" type="MotionStyle">
Like `style`, but transform shorthands (`x`, `y`, `scale`, `rotate`) and `MotionValue`s are
accepted.
</PropField>

## Server rendering and pre-hydration animation

Motion components include their resolved `initial` styles in server-rendered HTML. This prevents the
element from flashing its unanimated state before Svelte hydrates.

Set `appear` to start eligible entrance animations as the browser parses the HTML, without waiting
for Svelte hydration:

```svelte
<motion.div
	appear
	initial={{ opacity: 0, y: 20 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
/>
```

`appear` is a Motion Start extension. It applies to HTML elements whose target and transition can be
resolved on the server, with an explicit `tween` or `keyframes` transition. Every value in `animate`
must also be present in `initial`, since there is no computed style to read from before hydration.

Springs, dynamic variant functions, `transformTemplate`, SVG elements, custom components,
per-value transitions, repeats, orchestration options (`when`, `delayChildren`, `staggerChildren`)
and client-side navigations all fall back to the normal hydration-time animation. The parser-time
animation hands off to Motion during hydration without restarting.

Omitting `ease` is supported: the parser-time animation uses Motion's default `easeOut` curve.
`MotionConfig` reduced-motion settings are respected; `"user"` suppresses parser-time transform
animations when the visitor prefers reduced motion.

For a Content Security Policy that requires nonces, pass the nonce through `appear`:

```svelte
<motion.div
	appear={{ nonce }}
	initial={{ opacity: 0 }}
	animate={{ opacity: 1 }}
	transition={{ type: "tween", duration: 0.3 }}
/>
```

## Gesture props

`whileHover`, `whileTap`, `whileFocus`, `whileDrag` and `whileInView`, plus their event handlers.
See [Gestures](/docs/animation/gestures).

## Layout props

`layout`, `layoutId`, `layoutDependency`, `layoutRoot` and `layoutScroll`. See
[Layout animations](/docs/animation/layout).

## Lifecycle events

<PropField name="onAnimationStart" type="(definition) => void" />
<PropField name="onAnimationComplete" type="(definition) => void" />
<PropField name="onUpdate" type="(latest: ResolvedValues) => void" />

## Transform shorthands

Transforms are independent values, so they can be animated separately and composed without fighting
over a single `transform` string.

```svelte
<motion.div style={{ x: 100, rotate: 45, scale: 1.2 }} />
```

Available: `x`, `y`, `z`, `translateX/Y/Z`, `scale`, `scaleX/Y`, `rotate`, `rotateX/Y/Z`,
`skew`, `skewX/Y`, `originX/Y/Z`, `perspective`.

## SVG

SVG elements work the same way, including `pathLength`, `pathSpacing` and `pathOffset`, which are
normalised to `0`–`1`.

```svelte
<motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
```

## The `m` component

`m` is the same component with no features bundled in. Paired with
[`LazyMotion`](/docs/components/lazy-motion) it keeps the initial bundle small.

```svelte
<script>
	import { m } from "motion-start/m";
</script>

<m.div animate={{ opacity: 1 }} />
```

<Callout type="note" title="Spreading props">

Motion components forward unknown props to the underlying element, so `{...rest}` works as expected.

</Callout>
