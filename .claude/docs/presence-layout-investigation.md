# PresenceChild Context Reactivity Investigation

## Problem Statement

In `PresenceChild.svelte`, the presenceContext needs to:
1. **Trigger exit animations** when `isPresent` changes to `false`
2. **Keep layout animations stable** - the layout system breaks when context object reference churns

These two requirements conflict with Svelte 5's reactivity model.

## Key Files

- `src/lib/motion-start/components/AnimatePresence/PresenceChild/PresenceChild.svelte` - Creates and provides presenceContext
- `src/lib/motion-start/components/AnimatePresence/use-presence.svelte.ts` - Consumes context for exit animations
- `src/lib/motion-start/motion/features/layout/MeasureLayout.svelte` - Consumes context for layout
- `src/lib/motion-start/motion/features/layout/MeasureLayoutWithContext.svelte` - Detects `isPresent` changes for layout snapshots

## Failed Approaches

### 1. `$derived.by()` with `_v` version signaling

```typescript
const getContext = $derived.by(() => ({
    id, initial, isPresent, custom,
    _v: presenceAffectsLayout || !isReusedContext ? 0 : untrack(() => version++),
}));

setPresenceContext({
    get current() { return getContext; },
});
```

**Why it failed**: `$derived.by()` creates a **new object** every time dependencies change. Layout animations need stable object reference.

---

### 2. Inverting `_v` logic

Changed `!presenceAffectsLayout` to `presenceAffectsLayout` in the version signaling.

**Why it failed**: The underlying issue is object churning, not version signaling direction.

---

### 3. `$state()` + `$effect.pre()` mutation

```typescript
const context = $state<PresenceContext>({
    id, initial, isPresent, custom,
    onExitComplete: ...,
    register: ...,
});

$effect.pre(() => {
    context.isPresent = isPresent;
    context.custom = custom;
});

setPresenceContext({
    get current() { return context; },
});
```

**Why it failed**: Svelte warned that `initial`, `isPresent`, `custom` "only capture initial value". Mutations in `$effect.pre` didn't propagate reactivity correctly through the proxy.

---

### 4. `$state()` with getter accessors

```typescript
const context = $state<PresenceContext>({
    id,
    get initial() { return untrack(() => initial); },
    get isPresent() { return isPresent; },
    get custom() { return custom; },
    onExitComplete: ...,
    register: ...,
});

setPresenceContext({
    current: context,  // Direct reference
});
```

**Why it failed**: Still doesn't work. Getters don't establish proper reactive dependencies for consumers.

---

## The Core Tension

| Requirement | Needs |
|-------------|-------|
| Layout animations | Stable object reference (no churning) |
| Exit animations | Reactive access to `isPresent` changes |

Svelte 5's reactivity model:
- `$derived.by()` creates new objects (breaks layout)
- `$state()` creates stable proxy, but reactivity through getters is tricky
- Consumer patterns in use-presence.svelte.ts may not be reacting correctly

## React's Approach (framer-motion)

React framer-motion uses:
1. `useMemo` for context object (stable reference)
2. Context comparison with `Object.is()` to detect changes
3. `useForceUpdate` + `frame.postRender()` for coordinated timing
4. Copying context object to force React rerenders when needed

## Next Investigation Areas

1. **Consumer side** - How do use-presence.svelte.ts and MeasureLayoutWithContext.svelte read and react to context?
2. **Timing coordination** - React's `frame.postRender()` defers updates. Svelte 5 may need similar coordination.
3. **Separate concerns** - Perhaps split "stable for layout" from "reactive for exit" into different mechanisms.

## Current State (as of investigation)

File: `PresenceChild.svelte`
```typescript
const context = $state<PresenceContext>({
    id,
    get initial() { return untrack(() => initial); },
    get isPresent() { return isPresent; },
    get custom() { return custom; },
    onExitComplete: (childId) => { ... },
    register: (childId) => { ... },
});

setPresenceContext({
    current: context,
});
```

This is the getter-based approach (attempt #4) which does not work.
