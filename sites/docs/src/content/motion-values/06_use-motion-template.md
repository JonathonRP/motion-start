---
title: useMotionTemplate
description: Compose motion values into a single string value.
section: Motion values
---

Some CSS properties take a string built from several values — `filter`, `background`, `clip-path`,
`box-shadow`. `useMotionTemplate` builds that string from motion values as a tagged template, and
returns a new motion value that updates whenever any input changes.

```svelte
<script>
	import { motion, useMotionValue, useMotionTemplate } from "motion-start";

	const blur = useMotionValue(0);
	const brightness = useMotionValue(1);
	const filter = useMotionTemplate`blur(${blur}px) brightness(${brightness})`;
</script>

<motion.img style={{ filter }} src="/photo.jpg" alt="" />
```

It composes with `useTransform`, so any derived value can be interpolated in:

```ts
const { scrollYProgress } = useScroll();
const spread = useTransform(scrollYProgress, [0, 1], [0, 40]);
const boxShadow = useMotionTemplate`0 0 ${spread}px rgba(168, 85, 247, 0.6)`;
```

Static text and numbers can be mixed in freely — only the interpolated motion values are tracked.
