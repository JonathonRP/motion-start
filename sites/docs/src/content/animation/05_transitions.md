---
title: Transitions
description: Springs, tweens, inertia and orchestration options.
section: Animation
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import TransitionDemo from "$lib/components/demos/transition-demo.svelte";
</script>

A `transition` describes *how* a value animates. Transforms and other numeric values default to a
spring; colours, opacity and non-physical values default to a tween.

<DemoContainer class="py-8">
	<TransitionDemo />
</DemoContainer>

## Spring

```svelte
<motion.div animate={{ x: 100 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
```

| Option      | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| `stiffness` | Spring strength. Higher is snappier. Defaults to `100`.              |
| `damping`   | Opposing force. `0` never settles. Defaults to `10`.                 |
| `mass`      | Mass of the moving object. Defaults to `1`.                          |
| `bounce`    | `0`–`1` bounciness, as an alternative to `stiffness`/`damping`.       |
| `duration`  | Approximate duration in seconds, used with `bounce`.                 |
| `restSpeed` / `restDelta` | Thresholds at which the animation is considered done.  |
| `velocity`  | Initial velocity.                                                    |

## Tween

```svelte
<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeInOut" }} />
```

`ease` accepts a named easing (`"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`, `"circIn"`,
`"backOut"`, `"anticipate"`, …), a cubic bezier array such as `[0.17, 0.67, 0.83, 0.67]`, or a
custom function.

Other tween options: `delay`, `repeat`, `repeatType` (`"loop"` | `"reverse"` | `"mirror"`),
`repeatDelay`, and `times` for keyframe positions.

## Inertia

Inertia decelerates a value from its current velocity, optionally snapping into bounds. This is what
`drag` uses on release.

```svelte
<motion.div
	drag
	dragTransition={{ power: 0.3, timeConstant: 200, bounceStiffness: 500, bounceDamping: 40 }}
/>
```

## Per-value transitions

```svelte
<motion.div
	animate={{ x: 100, opacity: 1 }}
	transition={{
		default: { type: "spring", stiffness: 260 },
		opacity: { duration: 0.2, ease: "linear" }
	}}
/>
```

## Orchestration

Applied to a parent with `variants`:

```svelte
<motion.ul
	variants={{
		visible: {
			opacity: 1,
			transition: { when: "beforeChildren", staggerChildren: 0.08, delayChildren: 0.2 }
		}
	}}
/>
```

## Global defaults

[`MotionConfig`](/docs/components/motion-config) sets a default transition for every descendant.

```svelte
<MotionConfig transition={{ type: "spring", stiffness: 240, damping: 24 }}>
	<App />
</MotionConfig>
```

<Callout type="tip" title="Instant transitions">

`transition={{ duration: 0 }}` jumps straight to the target. To disable *all* animations for a
subtree — including layout animations — use `useInstantTransition` or
`MotionConfig reducedMotion="always"`.

</Callout>
