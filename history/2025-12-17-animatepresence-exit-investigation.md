# AnimatePresence Exit Animation Investigation
**Date**: 2025-12-17  
**Issue**: motion-start-kpr  
**Status**: Root cause identified, solution unclear

## Problem Summary

AnimatePresence exit animations are not working correctly:
- **Baseline (5/8 passing)**: Elements stay visible but have `transform='none'` (no animation styles applied)
- **With exit feature triggered (2/8 passing)**: Elements disappear immediately instead of animating out

## Architecture Understanding

### Feature System Flow

```
1. updateFeatures()
   ↓ Creates/mounts features based on isEnabled(props)
   ↓ Calls feature.mount() or feature.update()

2. ExitAnimationFeature.update()
   ↓ Checks if isPresent !== prevIsPresent
   ↓ Calls animationState.setActive('exit', !isPresent)

3. animationState.setActive('exit', false)
   ↓ Sets state[type].isActive = isActive
   ↓ Calls animateChanges('exit')
   ↓ Executes exit animations

4. onExitComplete callback
   ↓ Notifies PresenceChild animation is done
   ↓ PresenceChild removes element from DOM
```

### Current Code (Baseline)

```typescript
// src/lib/motion-start/motion/utils/use-visual-element.svelte.ts:75-96
$effect.pre(() => {
  props();
  presenceContext;
  if (visualElement && isMounted.current) {
    untrack(() => {
      visualElement.update(props, () => presenceContext);  
      // Only updates animation feature (for animate prop changes)
      if (visualElement.features.animation) {
        visualElement.features.animation.update();  // ❌ Doesn't handle exits
      }
    });
  }
});
```

## All Attempted Fixes

**Result**: All attempts made tests WORSE (2/8 passing vs 5/8 baseline)

1. ❌ `visualElement.features.exit.update()`
2. ❌ `visualElement.updateFeatures()`
3. ❌ `features.animation.update() + features.exit.update()`
4. ❌ Separate `$effect(() => features.exit.update())`
5. ❌ Manual `animationState.setActive('exit', !currentIsPresent)`

### Why These Failed

When exit feature is triggered, elements are removed before tests can observe them:
- **Expected**: Element visible with exit animation styles, then slowly animates out
- **Actual**: Element disappears immediately
- **Error**: `Expected to find element #animated-item, but never found it`

## Root Cause Analysis

The issue is NOT "exit animations not triggering" - it's a timing/sequencing problem:

### Without Exit Feature (Baseline - 5/8 passing)
- ✅ Elements stay in DOM
- ❌ No exit animation styles applied (`transform='none'`)
- ❌ Element just disappears when condition changes
- **Symptom**: No visible animation

### With Exit Feature Triggered (2/8 passing)
- ✅ Exit animation IS triggered
- ❌ Element removed too quickly (instantly or before animation completes)
- ❌ Tests can't find element to verify styles
- **Symptom**: Element disappears before tests can observe

## Key Insights

### Previous() Timing Issue

```typescript
// VisualElement.svelte.ts:247
prevPresenceContext?: PresenceContext | null = $derived(
  new Previous(() => this.presenceContext).current
);
```

The `Previous()` rune from runed tracks values across reactive cycles. When we call `features.exit.update()` in the same `$effect.pre` that updates presenceContext:

1. `visualElement.update()` sets `this.presenceContext`
2. `features.exit.update()` compares `isPresent === prevIsPresent`
3. But `prevPresenceContext` may not have updated yet (Same cycle)
4. Check returns true → exit early, no animation triggered

### updateFeatures() Issues

```typescript
// VisualElement.svelte.ts:468-497
updateFeatures() {
  for (key in featureDefinitions) {
    const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
    
    // Creates new feature if enabled but not exists
    if (!this.features[key] && FeatureConstructor && isEnabled(props)) {
      this.features[key] = new FeatureConstructor(this);
    }
    
    // Mounts or updates existing feature
    if (this.features[key]) {
      if (feature.isMounted) {
        feature.update();
      } else {
        feature.mount();
        feature.isMounted = true;
      }
    }
  }
}
```

Calling `updateFeatures()` might:
- Re-create features at wrong time
- Call features in wrong order
- Not respect lifecycle properly

### Animation Duration/Timing

Possible causes for instant removal:
1. Exit animation has `duration: 0`
2. `onExitComplete` called too early
3. PresenceChild removes element before animation done
4. AnimatePresence doesn't wait for exit in `mode="wait"`

## Test Results

### Passing (5/8)
- ✅ shows exit animation when element is removed
- ✅ prevents overlapping animations with mode=wait
- ✅ wraps conditional content correctly
- ✅ properly maintains DOM during transition
- ✅ respects AnimatePresence initial prop

### Failing (3/8)
- ❌ verifies exit animation completes before DOM removal (opacity still 1 at 250ms)
- ❌ exits current item before entering with mode=wait (transform='none')
- ❌ handles conditional rendering (transform='none')

## Next Investigation Steps

1. **Check Animation Duration**
   - Verify exit animations have proper duration (not 0)
   - Check if transition config is being applied to exits
   - Look at animation variants/targets

2. **onExitComplete Timing**
   - When is it called?
   - Does it wait for animation promise?
   - Is it being called multiple times?

3. **PresenceChild Lifecycle**
   - How does it decide when to remove from DOM?
   - Does it respect animation completion?
   - Check mode='wait' logic

4. **Compare with Framer Motion**
   - How does original handle exit feature updates?
   - When is ExitAnimationFeature.update() called?
   - Is there a different mechanism for triggering exits?

5. **AnimationState.setActive**
   - Does calling it directly bypass necessary setup?
   - Should it only be called from feature.update()?
   - What does animateChanges('exit') actually do?

## Key Files

- **Feature Trigger**: `src/lib/motion-start/motion/utils/use-visual-element.svelte.ts:75-96`
- **Exit Feature**: `src/lib/motion-start/motion/features/animation/exit.ts`
- **VisualElement**: `src/lib/motion-start/render/VisualElement.svelte.ts:247,468-497`
- **Animation State**: `src/lib/motion-start/render/utils/animation-state.ts:335-352`
- **PresenceChild**: `src/lib/motion-start/components/AnimatePresence/PresenceChild/PresenceChild.svelte`
- **AnimatePresence**: `src/lib/motion-start/components/AnimatePresence/AnimatePresence.svelte`

## Conclusion

The exit animation system IS working when triggered, but there's a fundamental timing/sequencing issue:
- Either animations complete instantly (duration problem)
- Or elements are removed before animations can run (lifecycle problem)
- Or we're triggering exits at the wrong time (reactive timing problem)

Need to investigate animation duration configuration and PresenceChild's DOM removal logic before attempting more fixes to the feature update mechanism.
