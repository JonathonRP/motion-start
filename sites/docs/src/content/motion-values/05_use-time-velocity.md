---
title: useTime & useVelocity
description: Frame-driven time and the velocity of any motion value.
section: Motion values
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

## useTime

`useTime` returns a motion value that updates every frame with the milliseconds elapsed since it was
created. It's the simplest way to drive a perpetual animation.

```svelte
<script>
	import { motion, useTime, useTransform } from "motion-start";

	const time = useTime();
	const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false });
</script>

<motion.div style={{ rotate }} />
```

## useVelocity

`useVelocity` tracks the velocity of another motion value, in units per second.

```svelte
<script>
	import { motion, useScroll, useVelocity, useTransform } from "motion-start";

	const { scrollY } = useScroll();
	const scrollVelocity = useVelocity(scrollY);
	const skewY = useTransform(scrollVelocity, [-1000, 1000], [-5, 5], { clamp: true });
</script>

<motion.div style={{ skewY }} />
```

Velocity is itself a motion value, so it can be smoothed with `useSpring` before use:

```ts
const smoothVelocity = useSpring(scrollVelocity, { stiffness: 400, damping: 40 });
```

<Callout type="tip" title="Acceleration">

`useVelocity` can be applied to a velocity value to get acceleration — handy for elastic,
physical-feeling UI.

</Callout>
