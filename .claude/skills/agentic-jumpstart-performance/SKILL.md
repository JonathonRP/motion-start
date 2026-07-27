---
name: agentic-jumpstart-performance
description: "Performance optimization patterns for Svelte 5 animation libraries. Use when optimizing animations, reducing layout thrashing, improving gesture performance, implementing lazy loading, or when the user mentions performance, speed, memory leaks, or animation smoothness."
---

# Performance Optimization for motion-start

This skill provides performance guidelines for the motion-start Svelte 5 animation library.

## Animation Performance

### Web Animations API (WAAPI)

The library uses WAAPI for hardware-accelerated animations:

```typescript
// From animation/animators/AcceleratedAnimation.ts
// WAAPI animations run on the compositor thread
element.animate(keyframes, {
  duration,
  easing,
  fill: 'both'
});
```

### requestAnimationFrame Patterns

Use the frameloop for synchronized updates:

```typescript
// From frameloop/render-step.ts
import { frame, cancelFrame } from '../frameloop';

// Schedule work for the next frame
frame.render(() => {
  visualElement.render();
});

// Cancel scheduled work
cancelFrame(callback);
```

### Frame Queue Optimization

The library uses double-buffering to avoid GC:

```typescript
// Pattern from render-step.ts
let thisFrame = new Set<Process>();
let nextFrame = new Set<Process>();

// Swap frames to avoid creating new Sets
[thisFrame, nextFrame] = [nextFrame, thisFrame];
nextFrame.clear();
```

## Layout Thrashing Prevention

### Batch Read/Write Operations

Never interleave reads and writes:

```typescript
// BAD - causes layout thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.height = height * 2;   // Write
});

// GOOD - batch reads, then writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2;
});
```

### Use CSS Transforms

Prefer transforms over layout-triggering properties:

```typescript
// BAD - triggers layout
element.style.left = `${x}px`;
element.style.top = `${y}px`;

// GOOD - compositor-only
element.style.transform = `translate(${x}px, ${y}px)`;
```

### will-change Optimization

The library manages will-change automatically:

```typescript
// From value/use-will-change/WillChangeMotionValue.ts
class WillChangeMotionValue extends MotionValue {
  add(name: string) {
    const styleName = getWillChangeName(name);
    if (styleName) {
      addUniqueItem(this.values, styleName);
      this.set(this.values.join(', '));
    }
  }
}
```

Use sparingly - excessive will-change increases memory usage.

## MotionValue Optimization

### Subscription Management

Use the subscription manager pattern:

```typescript
// From utils/subscription-manager.ts
class SubscriptionManager<Handler> {
  subscriptions: Handler[] = [];

  add = (handler: Handler) => {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  };

  // Optimized notify for single subscriber
  notify = (a, b, c) => {
    if (this.subscriptions.length === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      // Loop for multiple
    }
  };
}
```

### Avoid Unnecessary Updates

Use `untrack` to prevent reactive loops:

```typescript
// From use-visual-element.svelte.ts
$effect.pre(() => {
  props();
  if (visualElement && isMounted.current) {
    // Untrack to prevent infinite loops
    untrack(() => visualElement.update(props(), presenceContext));
  }
});
```

## Gesture Performance

### Event Throttling

For high-frequency events like pointermove:

```typescript
// Use frame scheduling instead of raw throttle
let pendingUpdate = false;

function onPointerMove(e: PointerEvent) {
  if (pendingUpdate) return;
  pendingUpdate = true;

  frame.render(() => {
    // Process movement
    pendingUpdate = false;
  });
}
```

### Passive Event Listeners

Use passive listeners for scroll/touch when not preventing default:

```typescript
element.addEventListener('touchmove', handler, { passive: true });
```

## Tree-Shaking and Code Splitting

### Feature Loading

Use LazyMotion for code splitting:

```svelte
<!-- Async feature loading -->
<LazyMotion features={() => import('./features')}>
  <m.div animate={{ scale: 2 }} />
</LazyMotion>
```

### Feature Bundles

Choose the right bundle:

```typescript
// Minimal - just animations
import { domMin } from 'motion-start';

// Standard - animations + gestures
import { domAnimation } from 'motion-start';

// Full - everything including layout
import { domMax } from 'motion-start';
```

## Memory Leak Prevention

### Effect Cleanup

Always return cleanup functions:

```typescript
$effect(() => {
  const unsubscribe = value.on('change', handler);
  const rafId = requestAnimationFrame(update);

  return () => {
    unsubscribe();
    cancelAnimationFrame(rafId);
  };
});
```

### WeakMap for Element References

The library uses WeakMap to prevent leaks:

```typescript
// From render/store.ts
export const visualElementStore = new WeakMap<any, VisualElement>();
```

### Animation Cleanup

Cancel animations on unmount:

```typescript
$effect(() => {
  const animation = element.animate(keyframes, options);

  return () => {
    animation.cancel();
  };
});
```

## Render Optimization

### Avoid Unnecessary Re-renders

Use $derived for computed values:

```typescript
// Memoized computation
const isVisible = $derived(opacity > 0 && scale > 0);
```

### Batch State Updates

Use microtask scheduling:

```typescript
// From frameloop/microtask.ts
import { microtask } from '../frameloop/microtask';

microtask.render(() => {
  // Batched render updates
});
```

## Projection Performance

### FLIP Animation Optimization

The projection system uses FLIP for performant layout animations:

1. **First**: Record initial position
2. **Last**: Apply final styles, record final position
3. **Invert**: Calculate delta, apply inverse transform
4. **Play**: Animate transform to identity

```typescript
// Measurement is cached to avoid layout reads during animation
const box = visualElement.measureInstanceViewportBox(element, props);
```

## Performance Checklist

- [ ] Use WAAPI for animations when possible
- [ ] Batch DOM reads and writes
- [ ] Use transforms instead of position properties
- [ ] Clean up all subscriptions and animations
- [ ] Use WeakMap for element references
- [ ] Choose appropriate feature bundle (domMin/domAnimation/domMax)
- [ ] Use passive event listeners where applicable
- [ ] Avoid unnecessary reactive updates with untrack
- [ ] Use frame scheduling for high-frequency updates
- [ ] Profile with Chrome DevTools Performance tab

## Debugging Performance

```bash
# Run with render scanning enabled
# Add svelte-render-scan for development
import 'svelte-render-scan';
```

Use Chrome DevTools:
- Performance tab for frame timing
- Memory tab for leak detection
- Layers panel for compositor layers
