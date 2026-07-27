---
title: Scroll
description: Scroll-linked and scroll-triggered animations.
section: Animation
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

There are two kinds of scroll animation. **Scroll-linked** animations are tied directly to scroll
position, and **scroll-triggered** animations start when an element enters the viewport.

## Scroll-triggered

Use `whileInView`. See [Gestures](/docs/animation/gestures#viewport) for the full `viewport` options.

```svelte
<motion.section
	initial={{ opacity: 0, y: 40 }}
	whileInView={{ opacity: 1, y: 0 }}
	viewport={{ once: true, amount: 0.4 }}
/>
```

For non-visual work — lazy loading, analytics — use `useInView` with an element ref.

```svelte
<script>
	import { useInView } from "motion-start";

	const ref = { current: null };
	const isInView = useInView(ref, { once: true, amount: 0.5 });
</script>

<section bind:this={ref.current}>
	{#if isInView()}
		<Expensive />
	{/if}
</section>
```

## Scroll-linked

`useScroll` returns four motion values that update as the page or a container scrolls.

```svelte
<script>
	import { motion, useScroll } from "motion-start";

	const { scrollYProgress } = useScroll();
</script>

<motion.div class="progress-bar" style={{ scaleX: scrollYProgress }} />
```

| Value             | Description                                        |
| ----------------- | -------------------------------------------------- |
| `scrollX`         | Horizontal scroll offset in pixels.                |
| `scrollY`         | Vertical scroll offset in pixels.                  |
| `scrollXProgress` | Horizontal progress, `0`–`1`.                      |
| `scrollYProgress` | Vertical progress, `0`–`1`.                        |

### Tracking an element

Pass a `target` ref to track a specific element, and `offset` to define when tracking starts and
ends.

```svelte
<script>
	import { motion, useScroll, useTransform } from "motion-start";

	const ref = { current: null };
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"]
	});
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
</script>

<section bind:this={ref.current}>
	<motion.div style={{ opacity }} />
</section>
```

`useScroll` also accepts a `container` ref to track a scrollable element instead of the window.

<Callout type="note" title="Refs">

`useScroll` expects a ref *object* (`{ current: element }`), not a bare element, so it can pick the
element up once Svelte has bound it.

</Callout>

## Imperative scroll

For animations outside of components, `scroll()` from `motion-start/dom` drives any animation with
scroll progress:

```ts
import { animate, scroll } from "motion-start/dom";

scroll(animate("#header", { backgroundColor: ["#fff", "#000"] }, { ease: "linear" }));
```
