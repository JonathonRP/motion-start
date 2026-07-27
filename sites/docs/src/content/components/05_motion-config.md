---
title: MotionConfig
description: Set defaults for every motion component beneath it.
section: Components
---

<script>
	import { Callout } from "@svecodocs/kit";
</script>

`MotionConfig` provides configuration to all descendant motion components — most usefully a default
transition and a reduced-motion policy.

```svelte
<script>
	import { MotionConfig } from "motion-start";
</script>

<MotionConfig transition={{ type: "spring", stiffness: 240, damping: 24 }}>
	{@render children()}
</MotionConfig>
```

## Props

| Prop            | Type                                     | Description                                                                 |
| --------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `transition`    | `Transition`                             | Default transition for descendants that don't define their own.             |
| `reducedMotion` | `"user" \| "always" \| "never"`           | How to respond to the OS reduced-motion setting. `"user"` follows the system. |
| `nonce`         | `string`                                 | CSP nonce for injected styles.                                              |
| `isValidProp`   | `(key: string) => boolean`               | Override which props are forwarded to the DOM element.                      |

## Reduced motion

With `reducedMotion="user"`, transform and layout animations are disabled when the user has asked
for reduced motion, while opacity and colour animations continue.

```svelte
<MotionConfig reducedMotion="user">
	<App />
</MotionConfig>
```

<Callout type="tip" title="Set it once">

Put `MotionConfig` in your root layout so the whole app shares one motion language — then override
per component only where it matters.

</Callout>
