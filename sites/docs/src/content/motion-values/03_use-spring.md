---
title: useSpring
description: A motion value that springs towards its target.
section: Motion values
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

`useSpring` creates a motion value that animates towards whatever it is set to, using spring physics.

```svelte
<script>
	import { motion, useSpring } from "motion-start";

	const x = useSpring(0, { stiffness: 300, damping: 30 });
</script>

<motion.div style={{ x }} onclick={() => x.set(200)} />
```

## Following another value

Pass a motion value as the first argument and the spring will follow it — the classic way to smooth
out a scroll or pointer value.

```ts
const { scrollYProgress } = useScroll();
const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
```

## Options

Any [spring transition option](/docs/animation/transitions#spring) is accepted: `stiffness`,
`damping`, `mass`, `bounce`, `duration`, `restSpeed` and `restDelta`.

```ts
const gentle = useSpring(0, { bounce: 0.1, duration: 0.6 });
```

<Callout type="tip" title="Jumping without animating">

Use `spring.jump(value)` to move to a value instantly and reset velocity — useful when resetting
state between interactions.

</Callout>
