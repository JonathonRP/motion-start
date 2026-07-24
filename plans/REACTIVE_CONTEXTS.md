# Implementation Plan: Reactive Contexts & AnimatePresence (Runes-Based)

## Overview

Make Svelte contexts reactive using Svelte 5 runes and enable AnimatePresence to properly track mounted components.

**Goal**: Use Svelte 5 runes ($state, $derived, $effect) with native createContext/getContext API for reactive context updates and ensure AnimatePresence can detect component exit animations.

## Current State

### What Exists (Store-Based - NEEDS REPLACEMENT)
- ❌ Store-based reactive contexts (reactive.ts with writable/derived)
- ❌ PresenceContext using Svelte stores
- ❌ MotionConfigContext using Svelte stores  
- ❌ LayoutGroupContext using Svelte stores
- ❌ Tests expecting store-based API

### What We Need (Runes-Based)
- ✅ Contexts created with native Svelte createContext
- ✅ State managed with $state runes
- ✅ Derived values with $derived runes
- ✅ Effects with $effect runes
- ✅ AnimatePresence component integration

### Root Cause of Needed Change
- Store-based approach doesn't leverage Svelte 5's native reactivity
- setContext can accept objects with $state runes directly
- $derived provides better performance than derived stores
- Runes are the future of Svelte 5, stores are legacy compatibility

## Proposed Solution

### Architecture: Runes-Based Reactive Context System

```
AnimatePresence (root)
    ↓ setContext with $state runes
    ↓
Child Components
    ↓ getContext to access reactive state
    ↓ $effect to watch changes
    ↓ trigger exit animations
```

**Key Pattern**: 
```typescript
// Provider component
const context = setContext(PRESENCE_KEY, {
  visibleChildren: $state([]),
  addChild: (id) => { context.visibleChildren.push(id); }
});

// Consumer component  
const presence = getContext(PRESENCE_KEY);
$effect(() => {
  console.log(presence.visibleChildren); // Reactive!
});
```

## Implementation Plan

### Phase 1: Define Runes-Based Context Patterns

**New File**: `src/lib/motion-start/context/reactive.ts`

```typescript
/**
 * Reactive context factory using Svelte 5 runes.
 * 
 * Usage:
 *   const ctx = createReactiveContext({ count: 0 });
 *   setContext('myKey', ctx);
 *   
 *   // In child:
 *   const ctx = getContext('myKey');
 *   $effect(() => console.log(ctx.count)); // Reactive!
 */

export interface ReactiveContextOptions {
  /**
   * Enable debug logging for context changes
   */
  debug?: boolean;
}

/**
 * Creates a reactive context object that can be used with setContext.
 * All properties are reactive and can be watched with $effect.
 */
export function createReactiveContext<T extends object>(
  initialValue: T,
  options?: ReactiveContextOptions
): T {
  // In Svelte 5, objects with $state properties are automatically reactive
  // when passed through context. We just need to ensure the object is
  // constructed in a reactive scope (component or .svelte.ts file).
  
  if (options?.debug) {
    console.log('[ReactiveContext] Creating context with:', initialValue);
  }
  
  return initialValue; // Svelte 5 handles reactivity automatically
}
```

### Phase 2: Update PresenceContext with $state Runes

**Modified**: `src/lib/motion-start/context/PresenceContext.ts`

```typescript
/**
 * Presence context for AnimatePresence component.
 * Tracks which children are visible and manages exit animations.
 */

export interface PresenceContextType {
  // Reactive state (accessed directly, no .subscribe needed)
  visibleChildren: string[];
  isExiting: boolean;
  
  // Methods
  addChild: (id: string) => void;
  removeChild: (id: string) => void;
  registerExitAnimation: (id: string, animation: Promise<void>) => void;
  waitForExitAnimations: () => Promise<void>;
}

/**
 * Create a presence context for use with setContext.
 * Must be called within a component or .svelte.ts file with runes enabled.
 */
export function createPresenceContext(): PresenceContextType {
  let visibleChildren = $state<string[]>([]);
  let isExiting = $state<boolean>(false);
  const exitAnimations = new Map<string, Promise<void>>();

  return {
    get visibleChildren() { return visibleChildren; },
    set visibleChildren(value) { visibleChildren = value; },
    
    get isExiting() { return isExiting; },
    set isExiting(value) { isExiting = value; },
    
    addChild: (id: string) => {
      visibleChildren = [...visibleChildren, id];
    },
    
    removeChild: (id: string) => {
      visibleChildren = visibleChildren.filter((c) => c !== id);
    },
    
    registerExitAnimation: (id: string, animation: Promise<void>) => {
      exitAnimations.set(id, animation);
      isExiting = exitAnimations.size > 0;
    },
    
    waitForExitAnimations: async () => {
      const animations = Array.from(exitAnimations.values());
      await Promise.all(animations);
      exitAnimations.clear();
      isExiting = false;
    },
  };
}

// Context key for getContext/setContext
export const PRESENCE_CONTEXT_KEY = Symbol('PresenceContext');
```

### Phase 3: Update MotionConfigContext with $state Runes

**Modified**: `src/lib/motion-start/context/MotionConfigContext.ts`

Convert to runes pattern:

```typescript
export interface MotionConfig {
  skipAnimationOnReducedMotion?: boolean;
  skipAnimation?: boolean;
  reducedMotionConfig?: 'auto' | 'user' | 'never';
}

export interface MotionConfigContextType {
  config: MotionConfig;
  setConfig: (config: Partial<MotionConfig>) => void;
  updateConfig: (fn: (config: MotionConfig) => MotionConfig) => void;
}

export const defaultMotionConfig: MotionConfig = {
  skipAnimationOnReducedMotion: false,
  skipAnimation: false,
  reducedMotionConfig: 'auto',
};

/**
 * Create a motion config context with $state runes.
 * Must be called within a component or .svelte.ts file.
 */
export function createMotionConfigContext(
  initialConfig: MotionConfig = defaultMotionConfig
): MotionConfigContextType {
  let config = $state<MotionConfig>(initialConfig);

  return {
    get config() { return config; },
    
    setConfig: (newConfig: Partial<MotionConfig>) => {
      config = { ...config, ...newConfig };
    },
    
    updateConfig: (fn: (config: MotionConfig) => MotionConfig) => {
      config = fn(config);
    },
  };
}

// Context key
export const MOTION_CONFIG_CONTEXT_KEY = Symbol('MotionConfigContext');
```

### Phase 4: Update LayoutGroupContext with $state/$derived

**Modified**: `src/lib/motion-start/context/LayoutGroupContext.ts`

Use $state and $derived runes:

```typescript
export interface LayoutGroupContextType {
  // Reactive state
  dimensions: Map<string, DOMRect>;
  isAnimating: boolean;
  layoutChanged: boolean; // Derived from dimensions
  
  // Methods
  registerElement: (id: string, rect: DOMRect) => void;
  unregisterElement: (id: string) => void;
  startAnimation: () => void;
  finishAnimation: () => void;
}

/**
 * Create a layout group context with $state and $derived runes.
 * Must be called within a component or .svelte.ts file.
 */
export function createLayoutGroupContext(): LayoutGroupContextType {
  let dimensions = $state<Map<string, DOMRect>>(new Map());
  let animationCount = $state<number>(0);
  
  // Derived state
  let isAnimating = $derived(animationCount > 0);
  let layoutChanged = $derived(dimensions.size > 0);

  return {
    get dimensions() { return dimensions; },
    get isAnimating() { return isAnimating; },
    get layoutChanged() { return layoutChanged; },
    
    registerElement: (id: string, rect: DOMRect) => {
      // Create new Map to trigger reactivity
      dimensions = new Map(dimensions).set(id, rect);
    },
    
    unregisterElement: (id: string) => {
      const newDimensions = new Map(dimensions);
      newDimensions.delete(id);
      dimensions = newDimensions;
    },
    
    startAnimation: () => {
      animationCount++;
    },
    
    finishAnimation: () => {
      animationCount = Math.max(0, animationCount - 1);
    },
  };
}

// Context key
export const LAYOUT_GROUP_CONTEXT_KEY = Symbol('LayoutGroupContext');
```

### Phase 5: Update AnimatePresence Component

**Modified**: `src/lib/motion-start/components/AnimatePresence/AnimatePresence.svelte`

Use the new runes-based presence context:

```svelte
<script lang="ts">
  import { setContext } from 'svelte';
  import { createPresenceContext, PRESENCE_CONTEXT_KEY } from '../../context/PresenceContext';
  
  interface Props {
    mode?: 'wait' | 'sync' | 'popLayout';
    initial?: boolean;
    custom?: any;
  }
  
  let { mode = 'sync', initial = true, custom, children }: Props = $props();
  
  // Create reactive presence context
  const presenceContext = createPresenceContext();
  setContext(PRESENCE_CONTEXT_KEY, presenceContext);
  
  // Track children with $effect
  $effect(() => {
    // When visibleChildren changes, this effect re-runs
    console.log('Visible children:', presenceContext.visibleChildren);
  });
  
  // Handle exit animations based on mode
  async function handleExit(childId: string) {
    if (mode === 'wait') {
      await presenceContext.waitForExitAnimations();
    }
    presenceContext.removeChild(childId);
  }
</script>

{@render children?.()}
```

## Testing Strategy

### Unit Tests - Runes-Based Approach

**File**: `src/lib/motion-start/__tests__/reactive-contexts.test.ts`

Tests must be in `.svelte.ts` file or use component wrapper to access runes:

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from 'svelte';
import { 
  createPresenceContext, 
  createMotionConfigContext,
  createLayoutGroupContext 
} from '../context';

describe('createPresenceContext', () => {
  it('should track children reactively', () => {
    // Need component context for $state
    const TestWrapper = () => {
      const ctx = createPresenceContext();
      ctx.addChild('child-1');
      return ctx;
    };
    
    const context = TestWrapper();
    expect(context.visibleChildren).toEqual(['child-1']);
  });
  
  it('should handle exit animations', async () => {
    const TestWrapper = () => createPresenceContext();
    const ctx = TestWrapper();
    
    let resolved = false;
    const animation = new Promise<void>(resolve => {
      setTimeout(() => {
        resolved = true;
        resolve();
      }, 50);
    });
    
    ctx.registerExitAnimation('child-1', animation);
    expect(ctx.isExiting).toBe(true);
    
    await ctx.waitForExitAnimations();
    expect(resolved).toBe(true);
    expect(ctx.isExiting).toBe(false);
  });
});

describe('createMotionConfigContext', () => {
  it('should update config reactively', () => {
    const TestWrapper = () => createMotionConfigContext();
    const ctx = TestWrapper();
    
    ctx.setConfig({ skipAnimation: true });
    expect(ctx.config.skipAnimation).toBe(true);
  });
});

describe('createLayoutGroupContext', () => {
  it('should track dimensions with DOMRect', () => {
    // DOMRect now provided by happy-dom environment
    const TestWrapper = () => createLayoutGroupContext();
    const ctx = TestWrapper();
    
    const rect = new DOMRect(0, 0, 100, 100);
    ctx.registerElement('el-1', rect);
    
    expect(ctx.dimensions.get('el-1')).toBe(rect);
    expect(ctx.layoutChanged).toBe(true);
  });
  
  it('should track animation state with $derived', () => {
    const TestWrapper = () => createLayoutGroupContext();
    const ctx = TestWrapper();
    
    expect(ctx.isAnimating).toBe(false);
    
    ctx.startAnimation();
    expect(ctx.isAnimating).toBe(true);
    
    ctx.finishAnimation();
    expect(ctx.isAnimating).toBe(false);
  });
});
```

### Integration Tests

**File**: `src/lib/motion-start/__tests__/reactive-contexts-integration.test.ts`

Test context reactivity in component hierarchy:

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from 'svelte';
import { setContext, getContext } from 'svelte';
import { PRESENCE_CONTEXT_KEY, createPresenceContext } from '../context/PresenceContext';

// Test component that provides context
const ProviderComponent = `
  <script>
    import { setContext } from 'svelte';
    import { createPresenceContext, PRESENCE_CONTEXT_KEY } from '../context/PresenceContext';
    
    const presence = createPresenceContext();
    setContext(PRESENCE_CONTEXT_KEY, presence);
    
    // Expose for testing
    export { presence };
  </script>
  
  <slot />
`;

// Test component that consumes context
const ConsumerComponent = `
  <script>
    import { getContext } from 'svelte';
    import { PRESENCE_CONTEXT_KEY } from '../context/PresenceContext';
    
    const presence = getContext(PRESENCE_CONTEXT_KEY);
    
    $effect(() => {
      // Reactively log changes
      console.log('Children changed:', presence.visibleChildren);
    });
  </script>
  
  <div data-testid="consumer">
    {presence.visibleChildren.length} children
  </div>
`;

describe('Presence Context Integration', () => {
  it('should propagate changes through context', async () => {
    const provider = mount(ProviderComponent);
    
    provider.presence.addChild('child-1');
    await tick();
    
    expect(provider.presence.visibleChildren).toEqual(['child-1']);
  });
});
```

## Success Criteria

1. ✅ All contexts use $state/$derived runes (no stores)
2. ✅ Context changes propagate reactively via $effect
3. ✅ AnimatePresence can detect child visibility changes
4. ✅ Exit animations complete before removal  
5. ✅ No memory leaks from effects
6. ✅ Type-safe context access
7. ✅ Backward compatible (gradual migration)
8. ✅ DOMRect available in tests via happy-dom
9. ✅ All tests passing with runes-based API

## Migration Notes

### Differences from Store-Based Approach

| Store-Based | Runes-Based |
|-------------|-------------|
| `writable(value)` | `$state(value)` |
| `derived(store, fn)` | `$derived(fn())` |
| `store.subscribe(fn)` | `$effect(() => fn(value))` |
| `store.update(fn)` | `value = fn(value)` |
| `get(store)` | Direct access: `value` |

### Benefits of Runes

- **Performance**: $derived is lazily evaluated, stores always compute
- **Simplicity**: No subscribe/unsubscribe management
- **Type Safety**: Direct property access, no generic wrappers
- **Future-Proof**: Runes are Svelte 5's primary reactive system
- **Debugging**: Easier to trace with DevTools

### Breaking Changes

The store-based implementation (reactive.ts using writable/derived) will be replaced.
Components using the old API will need updates:

```typescript
// OLD (stores)
const presence = createPresenceContext();
presence.visibleChildren.subscribe(children => { /* ... */ });

// NEW (runes)  
const presence = createPresenceContext();
$effect(() => {
  console.log(presence.visibleChildren); // Direct access, reactive!
});
```

## Estimated Timeline

- **Phase 1** (Reactive patterns): 3-4 hours
- **Phase 2** (PresenceContext): 4-6 hours  
- **Phase 3** (MotionConfigContext): 3-4 hours
- **Phase 4** (LayoutGroupContext): 4-6 hours
- **Phase 5** (AnimatePresence): 5-7 hours
- **Testing & Documentation**: 3-4 hours

**Total**: 22-31 hours (accounting for runes learning curve and debugging)

## Files to Create

1. `src/lib/motion-start/context/reactive.ts` - Runes pattern helpers (or delete if not needed)

## Files to Modify

1. `src/lib/motion-start/context/PresenceContext.ts` - $state runes
2. `src/lib/motion-start/context/MotionConfigContext.ts` - $state runes
3. `src/lib/motion-start/context/LayoutGroupContext.ts` - $state/$derived runes
4. `src/lib/motion-start/context/index.svelte.ts` - Export context keys
5. `src/lib/motion-start/components/AnimatePresence/AnimatePresence.svelte` - Use new context
6. `vite.config.ts` - Add happy-dom environment ✅ DONE

## Files to Delete (Store-Based Implementation)

1. `src/lib/motion-start/__tests__/reactive-contexts.test.ts` - Rewrite for runes
2. `src/lib/motion-start/__tests__/reactive-contexts-integration.test.ts` - Rewrite for runes
3. `docs/REACTIVE_CONTEXTS_TESTS.md` - Outdated test documentation

## References

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/$state)
- [Svelte 5 Context API](https://svelte.dev/docs/svelte/context)
- [Vitest happy-dom](https://github.com/capricorn86/happy-dom)
  isAnimating: Readable<boolean>;
  startAnimation: () => void;
  finishAnimation: () => void;
  
  // Derived state
  layoutChanged: Readable<boolean>;
}

export function createLayoutGroupContext(): LayoutGroupContextType {
  const dimensions = writable<Map<string, DOMRect>>(new Map());
  const isAnimating = writable<boolean>(false);
  const animationCount = writable<number>(0);

  const layoutChanged = derived(dimensions, ($dimensions) => {
    return $dimensions.size > 0;
  });

  return {
    dimensions,
    registerElement: (id: string, rect: DOMRect) => {
      dimensions.update((map) => new Map(map).set(id, rect));
    },
    unregisterElement: (id: string) => {
      dimensions.update((map) => {
        const newMap = new Map(map);
        newMap.delete(id);
        return newMap;
      });
    },
    isAnimating,
    startAnimation: () => {
      animationCount.update((count) => count + 1);
      isAnimating.set(true);
    },
    finishAnimation: () => {
      animationCount.update((count) => {
        const newCount = Math.max(0, count - 1);
        if (newCount === 0) {
          isAnimating.set(false);
        }
        return newCount;
      });
    },
    layoutChanged,
  };
}
```

### Phase 5: Update AnimatePresence Component

**Modified**: `src/lib/motion-start/components/AnimatePresence/AnimatePresence.svelte`

```svelte
<script lang="ts" module>
  export interface AnimatePresenceProps {
    mode?: 'sync' | 'popLayout' | 'wait';
    initial?: boolean;
  }
</script>

<script lang="ts">
  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import type { PresenceContextType } from '../../context/PresenceContext';
  import { createPresenceContext } from '../../context/PresenceContext';

  let { mode = 'sync', initial = true, children } = $props();

  const presenceContext = createPresenceContext();
  let exitAnimations: Promise<void>[] = [];

  $effect(() => {
    // Set context for children
    setContext('presence', presenceContext);
  });

  const handleExit = async () => {
    presenceContext.isExiting.set(true);
    await presenceContext.waitForExitAnimations();
    presenceContext.isExiting.set(false);
  };

  const onVisibleChildrenChange = (children: string[]) => {
    if (children.length === 0 && mode !== 'sync') {
      handleExit();
    }
  };

  // Subscribe to visible children changes
  $effect(() => {
    presenceContext.visibleChildren.subscribe(onVisibleChildrenChange);
  });
</script>

<div>
  {#key presenceContext}
    {@render children?.()}
  {/key}
</div>
```

## Implementation Steps

### Step 1: Create Reactive Context Utilities (2-3 hours)
- Implement ReactiveContext interface
- Create context factory
- Add type definitions

### Step 2: Update PresenceContext (3-4 hours)
- Convert to writable stores
- Implement child tracking
- Implement exit animation registry
- Update context provider

### Step 3: Update Other Contexts (4-5 hours)
- Update MotionConfigContext
- Update LayoutGroupContext
- Verify all context implementations

### Step 4: Update AnimatePresence (4-5 hours)
- Implement reactive presence tracking
- Add exit animation support
- Update component lifecycle
- Test integration

### Step 5: Testing (6-8 hours)
- Unit tests for reactive contexts
- Integration tests for context propagation
- E2E tests for AnimatePresence behavior

**Total Estimated Time**: 19-25 hours

## Integration Points

### Depends On
- Phase 1: Gesture Refactor (optional, for complete system)
- Phase 2: Event Handlers (optional, for gesture-triggered presence)

### Enables
- Phase 4: Element Attachment (builds on reactive state)
- Exit animations with proper sequencing
- Context-aware component features

## Success Criteria

1. ✅ All contexts are reactive to changes
2. ✅ Context value changes propagate to subscribers
3. ✅ AnimatePresence detects child visibility changes
4. ✅ Exit animations complete before removal
5. ✅ No memory leaks from subscriptions
6. ✅ Type-safe context access
7. ✅ Backward compatible

## Testing Strategy

### Unit Tests (18 tests)
```
reactive.ts (6)
  - Context creation
  - Subscribe
  - Update
  - Set
  - Multiple subscribers

PresenceContext (6)
  - Add/remove children
  - Exit animation registry
  - Wait for animations
  - Visibility tracking

MotionConfigContext (3)
  - Config setting
  - Config updates
  - Config subscription

LayoutGroupContext (3)
  - Dimension registration
  - Animation state
  - Layout changed derivation
```

### Integration Tests (14 tests)
```
Context propagation (4)
  - Parent → child
  - Multiple levels
  - Concurrent updates

AnimatePresence (6)
  - Child addition
  - Child removal
  - Exit animations
  - Animation sequencing
  - Mode: sync
  - Mode: wait

Feature + Context (4)
  - Drag with presence
  - Hover with layout
  - Multiple features
```

### E2E Tests (8 tests)
```
AnimatePresence exit animations
Child visibility tracking
Context updates from DOM events
Rapid presence changes
```

## Risk Mitigation

**Risk**: Memory leaks from subscriptions
**Mitigation**: Proper cleanup in component destroy lifecycle

**Risk**: Stale closures in subscribers
**Mitigation**: Use store subscriptions with effect cleanup

**Risk**: Performance impact from context updates
**Mitigation**: Batch updates, use derived stores for selectors

## Files to Create/Modify

### Create
```
src/lib/motion-start/context/
  └── reactive.ts                (new)
```

### Modify
```
src/lib/motion-start/context/
  ├── PresenceContext.ts         (reactive implementation)
  ├── MotionConfigContext.ts     (reactive implementation)
  ├── LayoutGroupContext.ts      (reactive implementation)
  └── index.svelte.ts            (export reactive contexts)

src/lib/motion-start/components/
  └── AnimatePresence/
      └── AnimatePresence.svelte (use reactive context)
```

## Timeline

- Phase 1-2 (Prerequisite): ~15-20 days (can parallelize with Task 2)
- Phase 3 (This Task): ~2-3 days
- **Parallel with**: Task 2, Task 4

## Related Tasks

- Task 1: Gesture Refactor (optional dependency)
- Task 2: Event Handlers (independent)
- Task 4: Element Attachment (builds on this)

## References

- [PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) - Context system
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Pattern docs
- [TESTING.md](../docs/TESTING.md) - Testing strategy
