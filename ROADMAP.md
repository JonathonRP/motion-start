# Roadmap

motion-start is a Svelte 5 animation library ported from framer-motion. This roadmap captures the major feature work ahead, ordered roughly by priority and dependency.

~~motionValue - participate in svelte reactivity (.current).~~

use svelte ease for easing/custom easing?

use svelte effect instead of RAF in batcher or compeletely replace frame with runed AnimationFrame.

~~is there a way to allow raw component work with $effects without using svelte template? because svelte allows getting and setting context in raw function components in newer versions.~~ yes, use later versions then 5.49.0? but do we get a benefit, currently everything works fine.

~~why does animatePresence need layout group if motion elements have layout and they each have their own measure component?~~ fundamental difference between react and svelte - didUpdate can be called and snapshot (react doesn't change dom until after reconcile so snapshotting during didUpdate works), but svelte needs snapshot then didUpdate (snapshot - needs willUpdate called in advance, didUpdate is too late)

---

## In Progress / Blocked

### Gesture System Refactor
The current gesture system needs a unified interface before it can be wired up fully. Two large pieces of work, each dependent on the other:

1. **Gesture abstraction layer** — Refactor gesture system into a unified interface with detached detectors. Creates a `GestureHandle` abstraction, new gesture detector files, and integrates with the feature-loading system. Planned phases: Gesture Abstraction, Detectors, Feature Integration, Event Props, Testing. (~10 days)

2. **Wire gesture handlers into UseRenderer** — Once the abstraction exists, connect gesture event handlers into the rendering layer via an event store. Phases: Event Store, UseRenderer, Handler Bridge, Feature Integration, Testing. (~16–22 hours on top of above)

### AnimatePresence: Children as Implicit List
Currently `AnimatePresence` requires explicit child management. A planned feature allows motion elements to register themselves as children automatically, so they can be used as an implicit list — simplifying usage patterns where you don't want to pass an explicit `list` prop.

---

## Up Next

### `whileInView` and Scroll Animations
Port framer-motion's viewport-aware animation API:
- `whileInView` — animate when an element enters the viewport
- `useScroll` / `useTransform` — scroll-linked animations
- Scroll progress tracking with `MotionValue`

E2E test coverage planned under Phase D.

### AnimatePresence: Mode Reliability (`mode="wait"`, `mode="popLayout"`)
Exit animations and mode switching (`wait`, `sync`, `popLayout`) are currently partially broken. Exit animation sequencing needs to be solid before `mode` variants can be considered stable. Phase E E2E tests exist but are skipped pending fixes.

### Reorder (Drag-to-Reorder Lists)
The `Reorder.Group` / `Reorder.Item` component is implemented but needs:
- Stable drag-to-reorder behavior
- E2E test coverage (Phase F)
- Correct layout projection during drag

---

## Feature Backlog

### SVG Motion Components
`motion.path`, `motion.circle`, etc. SVG-specific VisualElement rendering is partially implemented but needs proper path morphing, `pathLength`, `pathOffset`, and `pathSpacing` support.

### `LazyMotion` / Code Splitting
`LazyMotion` exists for loading animation features on demand (tree-shaking). Needs end-to-end validation that features load correctly and that bundle splitting actually works in a production build.

### Variants System
`variants` prop for defining named animation states and orchestrating children with `staggerChildren`, `delayChildren`, `when`. Currently supported at a basic level but not battle-tested across nested layouts and presence transitions.

### Spring / Inertia Physics Completeness
Spring generator is implemented. Needs:
- Full `inertia` animation type (momentum-based with min/max bounds)
- `useSpring` hook for reactive spring values
- Comprehensive spring physics unit tests

### `useMotionValue` / `useTransform` API
Expose reactive `MotionValue` primitives as a user-facing API similar to framer-motion:
```svelte
<script>
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
</script>
```

### Server-Side Rendering (SSR)
Ensure motion components hydrate correctly in SvelteKit SSR contexts. Currently `$effect`-based animation startup may cause hydration mismatches. Needs audit and a `isStatic` / reduced-motion SSR path.

### `AnimateSharedLayout` / Shared Element Transitions
Layout projection enables FLIP animations within a single tree. Cross-component shared element transitions (elements that animate between different parts of the DOM) require `layoutId` matching across `AnimatePresence` boundaries.

---

## Ongoing / Foundation

### TypeScript Strictness
Working toward zero `as any` casts and zero `svelte-check` errors. Major categories:
- VisualElement / MotionValue type alignment
- Component prop interfaces
- AcceleratedAnimation / WAAPI types

### E2E Test Coverage Expansion
Cypress E2E suite is in place. Expand coverage to match upstream motion v11 test scenarios:
- Complex AnimatePresence patterns
- Drag constraints and velocity
- Layout animation edge cases
- Scroll and viewport triggers

### Svelte 5 Runes Migration
All library-internal components should use `runes={true}`. Remaining legacy `runes={false}` components need incremental migration without breaking the public API.
