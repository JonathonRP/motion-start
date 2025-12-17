# Research: svelte-motion AnimatePresence Pattern

## Key Findings

### Architecture Difference: Stores vs Runes

**svelte-motion (Svelte 3/4 pattern):**
- Uses Svelte **stores** (`writable`) for PresenceContext
- Reactive statements (`$:`) automatically trigger when store values change
- `afterUpdate()` lifecycle hook calls `animateChanges()` after reactive updates

**motion-start (current Svelte 5 runes pattern):**
- Uses **runes** (`$state`, `$derived`) for PresenceContext
- Requires explicit `$effect` blocks to trigger on changes
- No automatic re-triggering of feature methods when context changes

## svelte-motion Implementation Pattern

### 1. PresenceContext as Store
```typescript
// context/PresenceContext.ts
export const PresenceContext = (): Writable<PresenceContextProps | null> => 
    getDomContext("Presence") || writable(null);
```

### 2. PresenceChild Updates Store
```svelte
<!-- PresenceChild.svelte -->
<script lang="ts">
    let context = PresenceContext();
    
    const memoContext = (flag?: boolean) => ({
        id,
        initial,
        isPresent,
        custom,
        onExitComplete: (childId) => { /* ... */ },
        register: (childId) => { /* ... */ }
    });
    
    // Updates store when isPresent changes
    $effect(() => context.set(memoContext(refresh)));
</script>
```

### 3. Visual Element Reacts to Store Changes
```svelte
<!-- UseVisualElement.svelte -->
<script lang="ts">
    const presenceContext = getContext(PresenceContext) || PresenceContext();
    
    // Reactive statement - runs whenever $presenceContext changes
    $: if (visualElement) {
        visualElement.setProps({ ...$config, ...props, layoutId });
        visualElement.isPresent = isPresent($presenceContext);
        visualElement.syncRender();
    }
    
    // Triggers animations after any reactive update
    afterUpdate(() => {
        tick().then(() => {
            visualElement?.animationState?.animateChanges();
        });
    });
</script>
```

### 4. Helper Function for isPresent
```typescript
// use-presence.ts
export function isPresent(context: PresenceContextProps | null) {
    return context === null ? true : context.isPresent;
}
```

## Why svelte-motion Works

1. **Store subscription**: When `context.set()` is called in PresenceChild, the store emits a change
2. **Reactive statement triggers**: `$: if (visualElement)` runs because `$presenceContext` changed
3. **Visual element updates**: `visualElement.isPresent` is set to new value
4. **afterUpdate hook**: Calls `animateChanges()` which triggers exit animations
5. **Feature system reacts**: ExitAnimationFeature checks `isPresent` during `animateChanges()`

## Why motion-start (Current) Fails

1. **No store subscription**: PresenceContext is a plain object (runes pattern)
2. **$effect.pre runs**: Updates `visualElement.presenceContext` via `update(props, () => presenceContext)`
3. **Features not notified**: `updateFeatures()` only called once on mount
4. **No animateChanges()**: Exit animation feature never gets its `update()` method called again
5. **Previous tracking unused**: `prevPresenceContext` is tracked but nothing reads it

## Solution Paths for motion-start

### Option 1: Hybrid Store Pattern (Easiest)
Keep runes for component state, but use a store for PresenceContext specifically:
```typescript
// Convert PresenceContext back to a store
export const PresenceContext = (): Writable<PresenceContextProps | null> => 
    writable(null);

// In UseVisualElement:
$: if (visualElement && $presenceContext) {
    visualElement.presenceContext = $presenceContext;
    // Trigger exit feature update
    const exitFeature = visualElement.features['animation'];
    exitFeature?.update();
}
```

### Option 2: Call animateChanges() in Effect (Current Attempt)
Add effect that calls `animateChanges()` when presence changes:
```typescript
$effect(() => {
    if (!visualElement || !isMounted.current) return;
    presenceContext; // Create dependency
    
    queueMicrotask(() => {
        visualElement.animationState?.animateChanges();
    });
});
```
**Issue**: May cause other side effects, needs careful testing.

### Option 3: Redesign Feature System for Runes
Create a runes-native reactive feature system:
```typescript
// Instead of calling feature.update(), make features reactive
class ExitAnimationFeature {
    $effect(() => {
        const { isPresent } = this.node.presenceContext || {};
        const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
        
        if (isPresent !== prevIsPresent) {
            this.node.animationState.setActive('exit', !isPresent);
        }
    });
}
```
**Issue**: Major architectural change, features aren't Svelte components.

### Option 4: Manual State Tracking Outside Features
Don't rely on feature system for exit animations:
```typescript
// In UseVisualElement:
let prevIsPresent = $state<boolean | undefined>();

$effect(() => {
    const currentIsPresent = presenceContext?.isPresent;
    
    if (prevIsPresent === true && currentIsPresent === false) {
        visualElement?.animationState?.setActive('exit', true);
    }
    
    prevIsPresent = currentIsPresent;
});
```
**Issue**: Bypasses feature system, duplicates logic.

## Recommendation

**Option 1 (Hybrid Store Pattern)** is the most pragmatic:
- Minimal code changes
- Proven pattern from svelte-motion
- Aligns with how Svelte's reactivity works best
- Only PresenceContext needs to be a store, rest can stay runes

**Implementation:**
1. Convert PresenceContext back to `writable` store
2. Update PresenceChild to use `context.set()`
3. Add reactive statement in use-visual-element that responds to `$presenceContext`
4. Call `animateChanges()` or specific feature updates in response

This leverages Svelte's store reactivity system for cross-component communication while keeping runes for local component state.

## Code Comparison

### svelte-motion (Working)
```svelte
<!-- Store-based reactivity -->
let context = PresenceContext(); // writable store

$effect(() => context.set(memoContext(isPresent)));

// In consumer:
$: if (visualElement) {
    visualElement.isPresent = isPresent($presenceContext);
}

afterUpdate(() => {
    visualElement?.animationState?.animateChanges();
});
```

### motion-start (Current - Broken)
```svelte
<!-- Runes-based, no auto-triggering -->
const presenceContext = $derived(usePresenceContext().current);

$effect.pre(() => {
    presenceContext; // tracks changes
    untrack(() => visualElement.update(props, () => presenceContext));
    // But updateFeatures() never called again!
});
```

### motion-start (Proposed Fix)
```svelte
<!-- Hybrid: Store for context, runes for state -->
const presenceStore = PresenceContext(); // writable
const presenceContext = $derived($presenceStore);

$effect(() => {
    if (visualElement && $presenceStore) {
        visualElement.presenceContext = $presenceStore;
        visualElement.animationState?.animateChanges();
    }
});
```

## Conclusion

The root issue is **architectural**: motion-start tried to port framer-motion's React patterns directly to Svelte 5 runes, but Svelte's reactivity model requires different mechanisms for cross-component state propagation.

svelte-motion succeeded because it used **Svelte stores** which have built-in reactivity and subscription mechanisms that automatically notify consumers when values change.

The solution is to use stores for context (cross-component communication) while keeping runes for local component state.
