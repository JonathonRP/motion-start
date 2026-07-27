---
title: Overview
description: Track and compose animating values outside of Svelte state.
section: Motion values
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import MotionValueDemo from "$lib/components/demos/motion-value-demo.svelte";
</script>

Motion components create motion values internally for every animating value. Creating them yourself
lets you read velocity, chain values together, and drive animations without triggering a re-render.

<DemoContainer class="py-8">
	<MotionValueDemo />
</DemoContainer>

```svelte
<script>
	import { motion, useMotionValue, useTransform } from "motion-start";

	const x = useMotionValue(0);
	const rotate = useTransform(x, [-140, 140], [-24, 24]);
</script>

<motion.div drag="x" style={{ x, rotate }} />
```

## The MotionValue API

| Method              | Description                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `get()`             | The current value.                                              |
| `set(v)`            | Set the value, without animating.                               |
| `jump(v)`           | Set the value and reset velocity.                               |
| `getVelocity()`     | Velocity per second.                                            |
| `on("change", cb)`  | Subscribe to changes. Returns an unsubscribe function.          |
| `isAnimating()`     | Whether an animation is currently driving the value.            |
| `stop()`            | Stop the active animation.                                      |

Because updates bypass Svelte's reactivity, changing a motion value re-renders nothing — it writes
straight to the DOM on the next frame.

## Available hooks

| Hook                    | Description                                                             |
| ----------------------- | ------------------------------------------------------------------------ |
| `useMotionValue`        | Create a motion value.                                                  |
| `useTransform`          | Map one or more values into a new one.                                   |
| `useSpring`             | A value that springs towards its target.                                 |
| `useMotionTemplate`     | Compose values into a string, e.g. a `filter` or `background`.           |
| `useScroll`             | Scroll offset and progress values.                                       |
| `useTime`               | Milliseconds elapsed, updated every frame.                               |
| `useVelocity`           | The velocity of another motion value.                                    |
| `useMotionValueEvent`   | Subscribe to a motion value event, with automatic cleanup.               |
| `useWillChange`         | A `will-change` string that tracks the values being animated.            |

<Callout type="note" title="Passing values in">

Motion values are passed to a component through `style`. Transform shorthands like `x`, `rotate` and
`scale` accept them directly, as do regular CSS properties.

</Callout>
