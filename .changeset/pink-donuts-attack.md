---
'motion-start': patch
---

Keep sequenced exit animations mounted until the whole sequence finishes.

An exiting element whose exit variant used `when: 'beforeChildren'` or
`when: 'afterChildren'` could be torn down mid-sequence, which silently dropped
the remaining `onAnimationComplete` callbacks — an `afterChildren` parent would
never report completion even though its child did.

The retained exit window now budgets a scheduling frame for every start point in
the sequence instead of a single frame for the whole tree, and corrects for the
time the current frame had already spent before Svelte created the outro (whose
clock is back-dated to the start of that frame). Nested exit completions now fire
in order, and the element is removed only once the last one has run.
