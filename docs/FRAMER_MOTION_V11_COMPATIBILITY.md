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

Explicit indices, including `cycle(0)`, select that index. Calling `cycle()`
without an index advances to the next value.

## Deprecated upstream APIs

### `ConditionalGeneric`

Motion Start does not export the legacy `ConditionalGeneric` helper from its
older list-prop-based `AnimatePresence`. Framer Motion had already removed this
type before v11.11.11. Svelte block identity replaces that older list contract;
use keyed `{#each}` blocks and ordinary generic constraints for application
types.

### `DragControls.updateConstraints`

Motion Start's `DragControls` matches Framer Motion v11.11.11 and exposes
`start`; it does not expose the older `updateConstraints` method. Pass reactive
pixel bounds or a Svelte-compatible element ref through `dragConstraints`.
Ref-based constraints are measured by the drag feature and updated on viewport
resize.

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
