---
title: useScroll
description: Motion values that track scroll offset and progress.
section: Motion values
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

`useScroll` returns four motion values that update as the page, a container, or a target element
scrolls.

```svelte
<script>
	import { motion, useScroll } from "motion-start";

	const { scrollYProgress } = useScroll();
</script>

<motion.div class="progress" style={{ scaleX: scrollYProgress, transformOrigin: "0%" }} />
```

## Returned values

| Value             | Description                    |
| ----------------- | ------------------------------ |
| `scrollX`         | Horizontal offset in pixels.   |
| `scrollY`         | Vertical offset in pixels.     |
| `scrollXProgress` | Horizontal progress, `0`–`1`.  |
| `scrollYProgress` | Vertical progress, `0`–`1`.    |

## Options

| Option         | Type                  | Description                                                            |
| -------------- | --------------------- | ---------------------------------------------------------------------- |
| `container`    | `RefObject<HTMLElement>` | Scrollable element to track instead of the window.                  |
| `target`       | `RefObject<Element>`  | Element whose position within the scroll container is tracked.          |
| `offset`       | `ScrollOffset`        | When tracking starts and ends, e.g. `["start end", "end start"]`.       |
| `axis`         | `"x" \| "y"`           | Axis for `offset` calculations. Defaults to `"y"`.                     |
| `layoutEffect` | `boolean`             | Set up before paint (`true`, the default) or after.                    |

## Tracking an element

```svelte
<script>
	import { motion, useScroll, useTransform } from "motion-start";

	const ref = { current: null };
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
	const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
</script>

<section bind:this={ref.current}>
	<motion.img style={{ y }} src="/parallax.jpg" alt="" />
</section>
```

Offsets are pairs of intersection points, where the first word refers to the target and the second
to the container: `"start end"` means "the start of the target meets the end of the container".

<Callout type="warning" title="Ref hydration">

Pass a ref object created in the same component as the element. If `useScroll` runs before the ref
is bound, set `layoutEffect: false` so setup happens after the DOM is ready.

</Callout>
