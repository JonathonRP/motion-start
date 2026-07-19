# Framer Motion 11.11.11 compatibility

Motion Start targets the behavior of `framer-motion@11.11.11`, adapted to
Svelte 5 ownership, snippets, transitions, and reactivity. This page records
intentional public API differences and known limitations. It is not a list of
features that may silently diverge from upstream behavior.

## AnimatePresence and Svelte blocks

`AnimatePresence` works directly with keyed `{#each}`, `{#if}`, and `{#key}`
blocks. Svelte owns those blocks' lifetimes, so Motion Start bridges Motion's
exit animation into a Svelte outro. There is no React-style `values` prop.

- `mode="sync"` starts entrances and exits together.
- `mode="wait"` keeps an entrant out of layout and delays its first Motion
  animation until active exits complete.
- `mode="popLayout"` removes the exiting element from normal layout while its
  exit animation plays.

## `useCycle`

React rerenders when hook state changes. The Svelte port instead returns a
getter so reads remain reactive without a component rerender:

```svelte
<script lang="ts">
import { useCycle } from 'motion-start';

const [current, cycle] = useCycle('closed', 'open');
</script>

<button onclick={() => cycle()}>{current()}</button>
```

Known limitation: `cycle(0)` currently advances instead of selecting index
zero. Non-zero explicit indices work. Use ordinary `$state` when arbitrary
indexed selection, including an explicit reset to index zero, is required.

## Deprecated upstream APIs

### `AnimateSharedLayout`

Motion Start does not export `AnimateSharedLayout`. Framer Motion 11.11.11
already marks that component as deprecated and implements it as a compatibility
wrapper around `LayoutGroup`. Use `LayoutGroup` directly:

```svelte
<script lang="ts">
import { LayoutGroup, motion } from 'motion-start';
</script>

<LayoutGroup>
	<motion.div layoutId="shared" />
</LayoutGroup>
```

### React-oriented element prop types

Framer Motion's root `HTMLMotionProps` type is React-oriented. For a Svelte
motion element, derive the actual component props with Svelte's
`ComponentProps` utility:

```ts
import type { ComponentProps } from 'svelte';
import { motion } from 'motion-start';

type MotionDivProps = ComponentProps<typeof motion.div>;
```

`MotionProps` remains available when only Motion-specific properties are
needed.
