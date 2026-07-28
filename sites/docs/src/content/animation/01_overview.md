---
title: Overview
description: How animations are described in Motion Start.
section: Animation
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import StaggerDemo from "$lib/components/demos/stagger-demo.svelte";
</script>

Motion Start scales from simple prop-based animations up to full orchestration. Animations are
declarative: you set a target and the library animates from wherever the value currently is.

## Animating props

Any value in `animate` is animated whenever it changes.

```svelte
<motion.div animate={{ x: 100, backgroundColor: "#f0f" }} />
```

`initial` defines the mount state. Set `initial={false}` to skip the mount animation and start at
the `animate` values.

```svelte
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
<motion.div initial={false} animate={{ opacity: 1 }} />
```

## Transitions

`transition` controls how a value animates. Numeric and transform values default to a spring;
everything else defaults to a tween.

```svelte
<motion.div animate={{ x: 100 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} />
```

Per-value transitions are supported too:

```svelte
<motion.div
	animate={{ x: 100, opacity: 1 }}
	transition={{
		default: { type: "spring" },
		opacity: { duration: 0.2, ease: "linear" }
	}}
/>
```

See [Transitions](/docs/animation/transitions) for every option.

## Keyframes

Pass an array to animate through a series of values. The first entry can be `null` to start from the
current value.

```svelte
<motion.div
	animate={{ x: [0, 100, 50, 0] }}
	transition={{ duration: 1.4, times: [0, 0.3, 0.7, 1], repeat: Infinity }}
/>
```

## Variants

Variants are named animation targets. Naming them lets a parent orchestrate its children — a child
automatically inherits the variant label of its parent unless it defines its own.

<DemoContainer class="flex justify-center py-10">
	<StaggerDemo />
</DemoContainer>

```svelte
<script>
	import { motion } from "motion-start";

	const container = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.08, delayChildren: 0.1 }
		}
	};

	const item = {
		hidden: { opacity: 0, y: 16 },
		visible: { opacity: 1, y: 0 }
	};
</script>

<motion.ul variants={container} initial="hidden" animate="visible">
	{#each items as n (n)}
		<motion.li variants={item} />
	{/each}
</motion.ul>
```

Orchestration options available on a parent transition:

| Option            | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `staggerChildren` | Delay between each child's animation, in seconds.                  |
| `staggerDirection` | `1` to stagger forwards, `-1` backwards.                          |
| `delayChildren`   | Delay before the first child animates.                             |
| `when`            | `"beforeChildren"` or `"afterChildren"`.                           |

## Animation lifecycle

```svelte
<motion.div
	animate={{ x: 100 }}
	onAnimationStart={() => console.log("start")}
	onAnimationComplete={(definition) => console.log("done", definition)}
	onUpdate={(latest) => console.log(latest.x)}
/>
```

## Reduced motion

Respect the user's system preference with `useReducedMotion`, or configure it globally with
[`MotionConfig`](/docs/components/motion-config).

```svelte
<script>
	import { useReducedMotion } from "motion-start";

	const shouldReduceMotion = useReducedMotion();
</script>

<motion.div animate={{ x: shouldReduceMotion() ? 0 : 100 }} />
```

<Callout type="note" title="Getters, not values">

Hooks that track reactive state — `useReducedMotion`, `useInView` — return a *getter*. Call it from
reactive code (a `$derived`, a template expression) so the read stays tracked.

</Callout>

<Callout type="note" title="Imperative animations">

For animations that aren't tied to a component's state, the DOM API is available from
`motion-start/dom`: `animate()`, `scroll()`, `inView()` and `stagger()`.

</Callout>
