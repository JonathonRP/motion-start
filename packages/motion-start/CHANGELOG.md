# motion-start

## 0.2.0-next.6

### Patch Changes

- cd0a456: Prevent `Reorder.Group` and `Reorder.Item` development assertions from rendering `true` in production output.

## 0.2.0-next.5

### Patch Changes

- 500a082: Fix three `AnimatePresence mode="popLayout"` bugs that made exiting children shove the
  page around and leak stylesheets.

  - The pop-layout rule was released from the Svelte transition's `tick(0)`, but Svelte keeps
    the node mounted past the end of its transition. A tall exiting child therefore dropped
    back into its parent's flow for the trailing window and re-stretched it. The rule is now
    dropped when the node is actually detached.
  - If an exit was torn down without completing, its injected `<style>` element was never
    removed. These accumulated in `<head>` for the life of the page.
  - Motion elements _nested inside_ an exiting subtree were each pulled out of flow as well,
    even though they have no exit of their own and the ancestor is pinned and removed whole.
    Only the outermost exiting node leaves the flow now, matching the existing behaviour of
    `mode="wait"`.

- 996afe6: Render resolved initial motion styles during SSR so animated elements display their first frame before hydration. Add an opt-in `appear` prop for supported tween and keyframes animations to begin while HTML is parsed and hand off to Motion when Svelte hydrates.
- b648ab3: Expose explicit reactive `MotionValue.current` reads and replace layout version counters with reusable Svelte invalidation signals.
- 500a082: Accept plain numbers for CSS length and SVG geometry values in `animate`, `initial` and friends.

  `TargetProperties` built its CSS half from csstype's `Properties` without supplying a
  `TLength`, so it fell back to csstype's default of `string | 0`. That rejected `width: 100`,
  and - because csstype also models `cx`, `cy`, `r`, `rx` and `ry` as CSS properties - the
  intersection with `SVGAttributes` narrowed those SVG geometry attributes to `string` too, so
  `animate={{ r: [30, 33] }}` on a `motion.radialGradient` failed to type-check even though
  numbers are exactly what the runtime animates. Numeric strings were not a workaround: they
  type-check but snap straight to the final keyframe.

  `Properties` is now instantiated as `Properties<string | number>`, matching framer-motion,
  whose CSS properties come from React's `string | number`. This is a types-only change and
  strictly widens what is accepted.

- 500a082: Fix cross-list `layoutId` drag handoffs and target-column reordering.

  Cross-list kanban moves now preserve the active gesture, animate displaced siblings, and
  keep the dragged item anchored to the pointer while it changes parents and target slots.

  - A snapshot taken when a drag begins was never invalidated, because a drag moves an
    element through its motion values without re-rendering it. The handover then animated
    from where the element was picked up. A node now retakes its snapshot when its own
    transform has moved on from the one the snapshot was taken under. A node that has
    already been detached is exempt - it cannot move again, and its values carry on
    settling, so re-measuring would overwrite the origin the handover needs.
  - An exiting element waited for its own drag inertia to come to rest before it was
    released, holding the outgoing node on screen for the best part of a second.
    `inertia` animations are no longer counted towards an exit's duration.
  - `whileDrag` made the same thing happen again by a different route: activating `exit`
    implicitly deactivates the drag gesture, and the springs that unwind `scale`/`rotate`
    back to their base values were counted as part of the exit. Those gesture animations
    are now started explicitly before the exit and excluded from its duration, while
    anything the exit itself starts is still counted.
  - Svelte commits more often than React renders, so a projection pass a frame or two
    after a layout animation started could see no further layout change and finish the
    animation before it had drawn a single frame. That guard now leaves an animation that
    has not yet advanced alone; it only cleans up animations that really are stale.
  - `Reorder.Group` published its reactive layout invalidation before the drag frame had
    settled. Stable object values could consume their pre-layout snapshot before keyed
    children moved, making displaced siblings snap instead of animate. The invalidation is
    now flushed immediately before `onReorder` commits the keyed children.
  - A same-`layoutId` element mounted in another parent now adopts the active pan session
    and rebases its drag origin to the new layout, so it stays under the pointer and emits
    one drag end while being re-parented mid-gesture.
  - Reactive sorting triggered by `onDrag` could move the active item after its constrained
    drag position had rendered. Drag controls now compensate only for that post-callback
    visual shift, measured in Motion's transformed coordinate space, so target-column slot
    changes remain under the pointer without bypassing drag constraints.
  - `Reorder.Item` now unregisters its measured geometry when it unmounts. Groups that
    share a full values array can conditionally render list membership without stale
    entries influencing later reorders.

- 0d5eaaf: Keep sequenced exit animations mounted until the whole sequence finishes.

  An exiting element whose exit variant used `when: 'beforeChildren'` or
  `when: 'afterChildren'` could be torn down mid-sequence, which silently dropped
  the remaining `onAnimationComplete` callbacks — an `afterChildren` parent would
  never report completion even though its child did.

  The retained exit window now budgets a scheduling frame for every start point in
  the sequence instead of a single frame for the whole tree, and corrects for the
  time the current frame had already spent before Svelte created the outro (whose
  clock is back-dated to the start of that frame). Nested exit completions now fire
  in order, and the element is removed only once the last one has run.

- 376cf41: Stop `Reorder.Item` discarding a caller-supplied `layoutDependency`.

  `Reorder.Item` set `layoutDependency={orderVersion}` _after_ the `{...props}` spread, so any
  `layoutDependency` passed by the caller was silently overwritten by the group's internal order
  version. That is also redundant: `MeasureLayout` already folds the group's `orderVersion` into an
  _ambient_ layout version, which adds snapshot opportunities rather than replacing the user's own
  dependency. A board that moves items between groups needs its own `layoutDependency` to reach the
  item, so the prop is now left alone.

  Also adds regression coverage for a shared `layoutId` element that unmounts from one parent and
  mounts into another in the same update: unit tests for the projection handover in both commit
  orders (outgoing destroyed first, incoming created first), and a Cypress spec that samples the
  element's position per animation frame to assert it animates between the two parents instead of
  teleporting.

## 0.2.0-next.4

### Patch Changes

- 183c0fe: Declare `runed` as a runtime dependency.

  `runed` is imported by six shipped files - `MotionConfig.svelte`,
  `motion/index.svelte.ts`, `value/use-spring.ts`, `MeasureLayoutWithContext.svelte`,
  `motion/utils/use-visual-element.svelte.ts` and `render/dom/UseRender.svelte` - but was
  only ever listed in the repo's own devDependencies, where it resolved by accident. Any
  consumer who did not already have `runed` installed would fail to resolve it.

  Stop `AnimatePresence mode="wait"` collapsing nested motion elements mid-exit.

  A motion element inside an exiting subtree normally has no `exit` of its own, so its exit
  animation resolved immediately and the node was pulled out of flow while the ancestor that
  actually owns the presence child was still animating out. The outgoing content visibly
  collapsed and everything below it jumped. Only the outermost exiting node now leaves the
  flow - the ancestor is removed as a whole regardless.
