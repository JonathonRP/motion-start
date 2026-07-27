---
title: useTransform
description: Map one or more motion values into a new one.
section: Motion values
---

<script>
	import { Callout, DemoContainer } from "@svecodocs/kit";
	import MotionValueDemo from "$lib/components/demos/motion-value-demo.svelte";
</script>

`useTransform` creates a motion value derived from others. It has two forms: range mapping and a
transformer function.

<DemoContainer class="py-8">
	<MotionValueDemo />
</DemoContainer>

## Range mapping

```ts
const x = useMotionValue(0);
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
```

The input range must be a linear series — all increasing or all decreasing. The output range can be
numbers, colours, shadows or any other value type Motion Start can interpolate, as long as every
entry is the same type and format.

```ts
const background = useTransform(
	x,
	[-140, 0, 140],
	["#e11d48", "#a855f7", "#10b981"]
);
```

Options are passed as a fourth argument:

```ts
const opacity = useTransform(x, [0, 100], [0, 1], { clamp: false, ease: easeOut });
```

## Transformer functions

```ts
const time = useTime();
const wobble = useTransform(time, (t) => Math.sin(t / 1000) * 10);
```

Multiple inputs are supported — the transformer receives an array:

```ts
const x = useMotionValue(0);
const y = useMotionValue(0);
const distance = useTransform([x, y], ([latestX, latestY]) =>
	Math.hypot(latestX, latestY)
);
```

<Callout type="tip" title="Chain freely">

Transformed values are themselves motion values, so they can feed `useSpring`, `useMotionTemplate`
or another `useTransform`.

</Callout>
