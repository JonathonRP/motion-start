---
title: useMotionValueEvent
description: Subscribe to motion value events with automatic cleanup.
section: Motion values
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

Motion values emit events. `useMotionValueEvent` subscribes to one and unsubscribes automatically
when the component is destroyed.

```svelte
<script>
	import { motion, useMotionValue, useMotionValueEvent } from "motion-start";

	const x = useMotionValue(0);

	useMotionValueEvent(x, "change", (latest) => {
		console.log(latest);
	});
</script>

<motion.div drag="x" style={{ x }} />
```

## Events

| Event               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `change`            | The value changed. Receives the latest value.        |
| `animationStart`    | An animation started driving the value.              |
| `animationComplete` | The animation finished.                              |
| `animationCancel`   | The animation was interrupted.                       |

## Without the hook

Outside of a component, subscribe directly and clean up yourself:

```ts
const unsubscribe = x.on("change", (latest) => console.log(latest));
```

<Callout type="note" title="No re-renders">

Motion value changes don't trigger Svelte reactivity. If you need a change to update the UI, copy it
into `$state` inside the handler — but prefer driving the DOM with motion values where you can.

</Callout>
