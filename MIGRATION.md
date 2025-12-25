# Migration Guide: Svelte 5 Refactoring

This guide covers the breaking changes introduced in the Svelte 5 refactoring of motion-start.

## Overview

The library has been comprehensively refactored to use Svelte 5 patterns:
- ✅ All contexts now use `createContext` API
- ✅ Use* components converted to runes-based functions
- ✅ Modern TypeScript with `.svelte.ts` files
- ✅ Improved type safety and developer experience

---

## Context System Changes

### Before (Symbol-based contexts)

```svelte
<script>
  import { getContext } from 'svelte';
  import { MOTION_CONTEXT_KEY } from 'motion-start';

  const context = getContext(MOTION_CONTEXT_KEY);
</script>
```

### After (createContext API)

```svelte
<script>
  import { motionContext, useMotionContext } from 'motion-start/context';

  // Option 1: Direct context access
  const context = motionContext.get();

  // Option 2: Use helper function (recommended)
  const context = useMotionContext();
</script>
```

### Migration Steps

1. **Update imports:**
   ```diff
   - import { MOTION_CONTEXT_KEY, MotionContext } from 'motion-start';
   + import { motionContext, useMotionContext } from 'motion-start/context';
   ```

2. **Replace getContext calls:**
   ```diff
   - const context = getContext(MOTION_CONTEXT_KEY);
   + const context = useMotionContext();
   ```

3. **Replace setContext calls:**
   ```diff
   - setContext(MOTION_CONTEXT_KEY, value);
   + motionContext.set(value);
   ```

### Context Renaming

| Old Name | New Name | Import Path |
|----------|----------|-------------|
| `MOTION_CONTEXT_KEY` | `motionContext` | `motion-start/context` |
| `PRESENCE_CONTEXT_KEY` | `presenceContext` | `motion-start/context` |
| `MOTION_CONFIG_CONTEXT_KEY` | `motionConfigContext` | `motion-start/context` |
| `LAYOUT_GROUP_CONTEXT_KEY` | `layoutGroupContext` | `motion-start/context` |
| `LAZY_CONTEXT_KEY` | `lazyContext` | `motion-start/context` |

---

## Use* Components → Functions

Many `Use*` components have been converted to runes-based functions for better ergonomics.

### UseUnmountEffect

**Before:**
```svelte
<UseUnmountEffect callback={() => console.log('unmounting')} />
```

**After:**
```svelte
<script>
  import { useUnmountEffect } from 'motion-start/utils';

  useUnmountEffect(() => {
    console.log('unmounting');
  });
</script>
```

### UseLayoutId

**Before:**
```svelte
<UseLayoutId props={{ layoutId: 'my-id' }} isCustom={false} let:layoutId>
  <!-- content -->
</UseLayoutId>
```

**After:**
```svelte
<script>
  import { useLayoutId } from 'motion-start/utils';

  let props = $props();
  const computedLayoutId = useLayoutId(() => props.layoutId);
</script>
```

### UseDomEvent

**Before:**
```svelte
<UseDomEvent
  ref={{ current: divRef }}
  eventName="wheel"
  handler={onWheel}
  options={{ passive: false }}
/>
<div bind:this={divRef} />
```

**After:**
```svelte
<script>
  import { useDomEvent } from 'motion-start/utils';

  let divRef = $state<HTMLDivElement>();

  useDomEvent(
    () => divRef,
    'wheel',
    onWheel,
    { passive: false }
  );
</script>

<div bind:this={divRef} />
```

### Gesture Hooks

**Before (UseTapGesture):**
```svelte
<UseTapGesture props={props} visualElement={visualElement}>
  <slot />
</UseTapGesture>
```

**After:**
```svelte
<script>
  import { useTapGesture } from 'motion-start/utils';

  let props = $props();
  let visualElement = $state();

  useTapGesture(
    () => visualElement,
    () => props
  );
</script>
```

**Other gesture hooks follow the same pattern:**
- `useHoverGesture` - Mouse hover detection
- `useFocusGesture` - Focus state tracking
- `usePanGesture` - Pan/swipe gestures with velocity
- `useDrag` - Full drag support with constraints

### UseAnimation

**Before:**
```svelte
<UseAnimation let:controls>
  <Motion.div animate={controls} />
  <button onclick={() => controls.start({ x: 100 })}>Animate</button>
</UseAnimation>
```

**After:**
```svelte
<script>
  import { useAnimation } from 'motion-start/utils';
  import { Motion } from 'motion-start';

  const controls = useAnimation();

  function handleClick() {
    controls.start({ x: 100 });
  }
</script>

<Motion.div animate={controls} />
<button onclick={handleClick}>Animate</button>
```

---

## Helper Functions

New helper functions have been added for common patterns:

### Context Helpers

```svelte
<script>
  import {
    useMotionContext,
    usePresence,
    useMotionConfig,
    useLayoutGroup,
    isPresent,
  } from 'motion-start/context';

  // Get motion context with defaults
  const motion = useMotionContext();

  // Check if element is present (AnimatePresence)
  const present = isPresent();

  // Get motion config
  const config = useMotionConfig();

  // Get layout group ID
  const groupId = useLayoutGroup();
</script>
```

---

## Removed APIs

### getDomContext

The `getDomContext` and `setDomContext` functions have been removed. Use the new context system instead.

**Before:**
```typescript
import { getDomContext } from 'motion-start';
const context = getDomContext('Motion', element);
```

**After:**
```svelte
<script>
  import { motionContext } from 'motion-start/context';
  const context = motionContext.get();
</script>
```

### isCustom Pattern

The `isCustom` parameter pattern has been removed. All contexts now work consistently without needing DOM-based context fallbacks.

**Before:**
```svelte
<UseLayoutId props={props} isCustom={false} />
```

**After:**
```svelte
<script>
  import { useLayoutId } from 'motion-start/utils';
  const layoutId = useLayoutId(() => props.layoutId);
</script>
```

---

## Type Changes

### MotionContextProps → MotionContextValue

Context type interfaces have been renamed for consistency:

```diff
- import type { MotionContextProps } from 'motion-start';
+ import type { MotionContextValue } from 'motion-start/context';
```

| Old Type | New Type |
|----------|----------|
| `MotionContextProps` | `MotionContextValue` |
| `PresenceContextProps` | `PresenceContextValue` |
| `MotionConfigContextObject` | `MotionConfigContextValue` |
| `LazyContextProps` | `LazyContextValue` |

---

## Benefits of Migration

### Better Type Safety

```svelte
<script>
  import { motionContext, type MotionContextValue } from 'motion-start/context';

  // Full type inference
  const context: MotionContextValue = motionContext.get();
</script>
```

### Simpler API

```svelte
<script>
  // Before: Multiple imports and verbose usage
  import { getContext } from 'svelte';
  import { MOTION_CONTEXT_KEY } from 'motion-start';
  const context = getContext(MOTION_CONTEXT_KEY) || {};

  // After: Single import, clear helper
  import { useMotionContext } from 'motion-start/context';
  const context = useMotionContext();
</script>
```

### Better Tree-Shaking

Functions are now in `.svelte.ts` files, improving tree-shaking and bundle size.

---

## Gradual Migration

You can migrate gradually:

1. **Phase 1**: Update context imports (use new `createContext` APIs)
2. **Phase 2**: Convert `Use*` components to function calls
3. **Phase 3**: Update type imports

Each phase is independent and can be done incrementally.

---

## Codemods

We provide automated codemods to help with migration:

```bash
# Coming soon - automated migration scripts
npx motion-start-migrate ./src
```

---

## Need Help?

- Check the [API documentation](./docs/API.md)
- See [examples](./examples/) for updated patterns
- Open an issue on [GitHub](https://github.com/JonathonRP/motion-start/issues)
