---
"motion-start": patch
---

Fix a dragged element teleporting instead of animating when it is dropped into another list.

Five separate faults conspired to make a cross-list `layoutId` handover snap to its
destination, and all five are fixed here.

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
- `Reorder.Group` published its ambient layout version one commit before calling
  `onReorder`. Stable object values could therefore consume their pre-layout snapshot
  before the keyed children moved, making displaced siblings snap instead of animate.
  The version is now flushed immediately before the reorder commit.
