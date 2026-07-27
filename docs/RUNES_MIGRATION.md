# Reactive Contexts: Store-Based → Runes-Based Migration

## Overview

The initial implementation of reactive contexts used Svelte stores (writable, derived, readable). This needs to be replaced with Svelte 5 runes ($state, $derived, $effect) for better performance and alignment with Svelte 5's native reactivity system.

## Why Migrate?

### Store-Based Issues
- ❌ Legacy compatibility layer (stores are Svelte 4 pattern)
- ❌ Manual subscription management
- ❌ Performance overhead from store wrappers
- ❌ Verbose API (subscribe/unsubscribe, get() helpers)
- ❌ Not idiomatic for Svelte 5

### Runes-Based Benefits
- ✅ Native Svelte 5 reactivity (no wrappers)
- ✅ Automatic reactivity with $effect
- ✅ Better performance ($derived is lazy)
- ✅ Simpler API (direct property access)
- ✅ Type-safe without generic wrappers
- ✅ Future-proof (runes are the future)

## DOMRect Testing Setup

### Problem
DOMRect is a browser API not available in Node.js test environments.

### Previous Solution (Manual Mock)
```typescript
// In test file
beforeAll(() => {
  global.DOMRect = class DOMRect {
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
    // ... manual implementation
  };
});
```

### New Solution (happy-dom Environment)
```typescript
// vite.config.ts
test: {
  globals: true,
  environment: 'happy-dom', // Provides DOMRect automatically
  typecheck: { enabled: true }
}
```

**Benefits**:
- ✅ No manual mocking needed
- ✅ Full DOM API support
- ✅ Matches browser behavior more accurately
- ✅ Maintained by happy-dom team

## API Changes

### Pattern Comparison

#### Store-Based (OLD - Being Replaced)
```typescript
// Creating context
const visibleChildren = writable<string[]>([]);
const context = {
  visibleChildren, // Store object
  addChild: (id) => visibleChildren.update(arr => [...arr, id])
};

// Using context
const ctx = getContext('key');
ctx.visibleChildren.subscribe(children => {
  console.log(children);
});
```

#### Runes-Based (NEW - Target Implementation)
```typescript
// Creating context
let visibleChildren = $state<string[]>([]);
const context = {
  get visibleChildren() { return visibleChildren; }, // Direct access
  addChild: (id) => { visibleChildren = [...visibleChildren, id]; }
};

// Using context  
const ctx = getContext('key');
$effect(() => {
  console.log(ctx.visibleChildren); // Automatically reactive!
});
```

### Context Creation Patterns

#### PresenceContext

**OLD (Stores)**:
```typescript
export function createPresenceContext() {
  const visibleChildren = writable<string[]>([]);
  return {
    visibleChildren, // Store
    addChild: (id) => visibleChildren.update(arr => [...arr, id])
  };
}
```

**NEW (Runes)**:
```typescript
export function createPresenceContext() {
  let visibleChildren = $state<string[]>([]);
  return {
    get visibleChildren() { return visibleChildren; },
    addChild: (id) => { visibleChildren = [...visibleChildren, id]; }
  };
}
```

#### MotionConfigContext

**OLD (Stores)**:
```typescript
export function createMotionConfigContext(initial: MotionConfig) {
  const config = writable(initial);
  return {
    config, // Store
    setConfig: (partial) => config.update(c => ({ ...c, ...partial }))
  };
}
```

**NEW (Runes)**:
```typescript
export function createMotionConfigContext(initial: MotionConfig) {
  let config = $state(initial);
  return {
    get config() { return config; },
    setConfig: (partial) => { config = { ...config, ...partial }; }
  };
}
```

#### LayoutGroupContext

**OLD (Stores + Derived)**:
```typescript
export function createLayoutGroupContext() {
  const dimensions = writable(new Map());
  const animationCount = writable(0);
  const isAnimating = derived(animationCount, $count => $count > 0);
  
  return { dimensions, isAnimating };
}
```

**NEW (Runes + $derived)**:
```typescript
export function createLayoutGroupContext() {
  let dimensions = $state(new Map());
  let animationCount = $state(0);
  let isAnimating = $derived(animationCount > 0); // Lazy evaluation!
  
  return {
    get dimensions() { return dimensions; },
    get isAnimating() { return isAnimating; }
  };
}
```

## Test Migration

### Store-Based Tests (DELETE)
```typescript
// OLD - reactive-contexts.test.ts
import { get } from 'svelte/store';

it('should track children', () => {
  const ctx = createPresenceContext();
  ctx.addChild('child-1');
  expect(get(ctx.visibleChildren)).toEqual(['child-1']); // get() needed
});
```

### Runes-Based Tests (NEW)
```typescript
// NEW - reactive-contexts.test.ts
import { mount } from 'svelte';

it('should track children reactively', () => {
  // Must run in component context for runes
  const TestWrapper = () => {
    const ctx = createPresenceContext();
    ctx.addChild('child-1');
    return ctx;
  };
  
  const ctx = TestWrapper();
  expect(ctx.visibleChildren).toEqual(['child-1']); // Direct access
});
```

### Integration Test Pattern
```typescript
// Test reactive propagation through $effect
const TestComponent = `
  <script>
    import { getContext } from 'svelte';
    const ctx = getContext('presence');
    
    let renderCount = $state(0);
    
    $effect(() => {
      // This re-runs when ctx.visibleChildren changes
      renderCount++;
    });
  </script>
  
  <div>{renderCount}</div>
`;

it('should trigger effects on changes', async () => {
  const component = mount(TestComponent);
  const ctx = component.getContext('presence');
  
  ctx.addChild('child-1');
  await tick();
  
  // Effect should have run twice (initial + update)
  expect(component.querySelector('div').textContent).toBe('2');
});
```

## Files to Update

### Delete (Store-Based Implementation)
1. ✅ `src/lib/motion-start/context/reactive.ts` - Store wrapper (not needed with runes)
2. ✅ `src/lib/motion-start/__tests__/reactive-contexts.test.ts` - Rewrite
3. ✅ `src/lib/motion-start/__tests__/reactive-contexts-integration.test.ts` - Rewrite
4. ✅ `docs/REACTIVE_CONTEXTS_TESTS.md` - Outdated documentation

### Rewrite (Runes-Based)
1. ⏳ `src/lib/motion-start/context/PresenceContext.ts`
2. ⏳ `src/lib/motion-start/context/MotionConfigContext.ts`
3. ⏳ `src/lib/motion-start/context/LayoutGroupContext.ts`
4. ⏳ `src/lib/motion-start/context/index.svelte.ts` - Export context keys
5. ⏳ `src/lib/motion-start/components/AnimatePresence/AnimatePresence.svelte`

### Update (Configuration)
1. ✅ `vite.config.ts` - Added happy-dom environment

## Migration Checklist

- [x] Update vite.config.ts with happy-dom
- [x] Update plans/REACTIVE_CONTEXTS.md with runes approach
- [x] Update bd task description
- [x] Create migration documentation (this file)
- [ ] Delete store-based reactive.ts
- [ ] Rewrite PresenceContext with runes
- [ ] Rewrite MotionConfigContext with runes
- [ ] Rewrite LayoutGroupContext with runes
- [ ] Update context index exports
- [ ] Update AnimatePresence component
- [ ] Rewrite unit tests for runes
- [ ] Rewrite integration tests for runes
- [ ] Delete outdated test documentation
- [ ] Verify 0 TypeScript errors
- [ ] Verify all tests passing
- [ ] Update bd task with new test results

## Task Status

**BD Task**: `motion-start-fca` - Make Contexts Reactive & Fix AnimatePresence

**Status**: `open` (reopened for runes migration)

**Updated Description**: Convert contexts to use Svelte 5 runes ($state, $derived) with native createContext/getContext API. Store-based implementation needs replacement with runes for proper reactivity.

See `plans/REACTIVE_CONTEXTS.md` for detailed implementation plan.

## Timeline

Estimated: 22-31 hours (including runes learning curve)

1. Delete old implementations: 1 hour
2. Implement runes-based contexts: 15-20 hours
3. Rewrite tests: 4-6 hours
4. Integration & verification: 2-4 hours

## References

- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Svelte 5 $derived](https://svelte.dev/docs/svelte/$derived)
- [Svelte 5 $effect](https://svelte.dev/docs/svelte/$effect)
- [Svelte 5 Context API](https://svelte.dev/docs/svelte/context)
- [Happy-DOM](https://github.com/capricorn86/happy-dom)
- [Vitest Environment](https://vitest.dev/config/#environment)
