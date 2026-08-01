---
"motion-start": patch
---

Fix cross-list `layoutId` drag handoffs and target-column reordering.

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
