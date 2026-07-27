---
"motion-start": patch
---

Fix variant staggering and self-resizing `layout` animations.

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
