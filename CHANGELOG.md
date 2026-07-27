# motion-start

## 0.2.0-next.3

### Patch Changes

- 7e0fcae: Fix `AnimatePresence mode="wait"` laying the incoming child out while the outgoing one is still exiting.

  The incoming child was kept out of flow by a `display: none` CSS transition delayed by
  `context.remaining()`, which reads a duration published by the outgoing child's outro. Svelte
  builds the incoming keyed block _before_ tearing the outgoing one down, so the intro almost
  always read `0`, emitted no CSS at all, and both children shared the layout for the whole exit.

  The incoming child is now taken out of flow imperatively at intro time and restored once
  `waitForExit()` resolves, which removes the ordering dependency entirely. A finished exit also
  drops its node out of flow immediately, rather than lingering until Svelte's own outro timer
  elapses, which previously left a short window where both children were laid out.

  This applies to `SVGElement` children as well as `HTMLElement` ones. Children that are already
  out of flow (`position: absolute` / `fixed`) are left alone, since they cannot share layout with
  a sibling and hiding them would zero out the box read by projection and `onLayoutMeasure`.

  `mode="sync"` and `mode="popLayout"` are unaffected.

## 0.2.0-next.2

### Patch Changes

- e83c2c7: Fix variant staggering and self-resizing `layout` animations.

  **Sibling motion components shared a context scope**

  `motion` components are hand-written component functions rather than compiled
  `.svelte` modules, so Svelte never opened a component context for them and
  `setContext` wrote into the nearest compiled ancestor's context map — which every
  sibling motion component shares. Contexts leaked sideways in mount order, so a
  variant parent adopted only its first child and each later child parented to its
  previous sibling, forming a chain instead of a fan-out.

  The visible symptom was that `staggerChildren` and `staggerDirection` did nothing:
  with one variant child per level there was nothing to stagger across, and every
  child received the same `delayChildren`. Anything relying on parent/child motion
  relationships between siblings was affected.

  **Plain `layout` animations snapped instead of animating**

  Framer-motion takes a pre-commit measurement on every render, so any prop that
  changes layout is covered. A Svelte effect only re-runs for the sources it reads,
  and the pre-pass tracked `layoutDependency` alone — so an element that resized
  itself (for example via `style`) never snapshotted and jumped straight to its new
  size.

  `layoutDependency` also absorbed the ambient `AnimatePresence` and `Reorder`
  version counters. Any element under a presence boundary therefore saw a constant
  dependency and suppressed its own snapshots entirely. Those counters are now
  tracked separately and add snapshot opportunities rather than replacing the
  user's own `layoutDependency`, restoring framer-motion's semantics.

  `layoutId` shared-layout animations, exit animations, and `Reorder` are
  unaffected.

## 0.2.0-next.1

### Patch Changes

- ed7a87c: Target `ES2022` in `tsconfig.json` so packaged output keeps native class fields instead of downlevelled `Object.defineProperty` assignments, which broke subclass field initialisation in consumers.

## 0.2.0-next.0

### Minor Changes

- 5013e2b: Rewrite the library against `framer-motion@11.11.11` (previously `4.0.3`) on Svelte 5 runes.

  **New**

  - `Reorder.Group` / `Reorder.Item` for drag-to-reorder lists.
  - `LayoutGroup` and the full projection engine, replacing `AnimateSharedLayout`.
  - `AnimatePresence` `mode` (`sync` | `wait` | `popLayout`) and `usePresenceData`.
  - WAAPI-accelerated animations, `animate()` sequences, and `stagger()`.
  - Scroll (`useScroll`), viewport (`whileInView`), and `useInView` support.
  - Motion value hooks: `useTime`, `useVelocity`, `useWillChange`, `useAnimate`, `useAnimateMini`.
  - Subpath entries: `motion-start/dom`, `/mini`, `/m`, `/client`, `/projection`.

  **Changed**

  - Components and hooks are Svelte 5 runes-based; renderless `Use*.svelte` wrappers are gone in favour of plain functions and classes.
  - `motion` / `m` are proxies, so any element is available as `motion.<tag>`.
  - Gestures rewritten onto the shared `Feature` pipeline (hover, press, pan, drag, focus).

  **Removed**

  - `AnimateSharedLayout` — use `LayoutGroup` with `layoutId`.
  - `MotionDiv` — use `motion.div`.

## 0.1.21

### Patch Changes

- 39bf8bf: Fix AnimatePresence `presenceAffectsLayout` no-op, `isPresent` race condition with framesync batcher, and double `safeToRemove` guard

## 0.1.20

### Patch Changes

- 84d3657: fix: resolve bare dot and extension-less imports in value/ for Svelte REPL

  The Svelte playground CDN resolves ESM imports without a bundler, requiring explicit file extensions and no bare directory imports. Bare dot imports like `from '.'` compiled to JS caused the REPL to fail resolving `dist/value/` as a directory path.

  Fixed by replacing all `from '.'`, `from '..'`, and extension-less relative imports within the value/ directory with explicit `./index.js` paths and proper `.js` extensions.

## 0.1.19

### Patch Changes

- e036a76: Remove `sideEffects: false` from `package.json` to fix module resolution in the Svelte REPL playground.

  Bundlers honour this flag by tree-shaking modules that are imported only for their side effects. In the Svelte playground this caused the module that resolves the `"."` bare specifier to be dropped entirely, producing:

  > error occurred while trying to resolve `.` within `npm://$/motion-start@0.1.18/dist/value/use-motion-template.js`

## 0.1.18

### Patch Changes

- ff1a37e: add layout animation helper

## 0.1.17

### Patch Changes

- 9e4b5cf: fix motion svg
- 456528a: fix motion svg namespace

## 0.1.16

### Patch Changes

- f8dd358: allow spreading props

## 0.1.15

### Patch Changes

- 1f07118: revert

## 0.1.14

### Patch Changes

- a1f2c47: fix svg not appearing with motion use

## 0.1.13

### Patch Changes

- 39d3b8b: improve import consistancy and fix svelte repl

## 0.1.12

### Patch Changes

- f8ab887: fix svelte repl usage

## 0.1.11

### Patch Changes

- 6101a3b: remove main from package.json

## 0.1.10

### Patch Changes

- b4fe2aa: correct exports to export svelte and js

## 0.1.9

### Patch Changes

- c21ab29: export correct extensions

## 0.1.8

### Patch Changes

- 071b96d: move dist files to src for import use

## 0.1.7

### Patch Changes

- d8212b9: fix usage in svelte repl

## 0.1.6

### Patch Changes

- b6f6602: add all files in dist to files property package.json

## 0.1.5

### Patch Changes

- 2996dae: add back style-value-types just incase

## 0.1.4

### Patch Changes

- 7f6010b: fix peer deps including melt-ui because of bits-ui dep

## 0.1.3

### Patch Changes

- 61bcd64: fix export path for svelte comp

## 0.1.2

### Patch Changes

- 25f1b6e: export MotionSSR

## 0.1.1

### Patch Changes

- 98cfaba: chore: 🤖 release
- 4f1b2e7: enable layout animation feature
- 9f5a69c: fix layout animations

## 0.1.0

### Minor Changes

- passing tests, handle minimal-motion for lazymotion,update API for motion to align more with framer-motion API usage

## 0.0.3

### Patch Changes

- fix package source

## 0.0.2

### Patch Changes

- 5492e7b: fix animations
