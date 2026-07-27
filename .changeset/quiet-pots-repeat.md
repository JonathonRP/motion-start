---
'motion-start': patch
---

Fix `AnimatePresence mode="wait"` laying the incoming child out while the outgoing one is still exiting.

The incoming child was kept out of flow by a `display: none` CSS transition delayed by
`context.remaining()`, which reads a duration published by the outgoing child's outro. Svelte
builds the incoming keyed block *before* tearing the outgoing one down, so the intro almost
always read `0`, emitted no CSS at all, and both children shared the layout for the whole exit.

The incoming child is now taken out of flow imperatively at intro time and restored once
`waitForExit()` resolves, which removes the ordering dependency entirely. A finished exit also
drops its node out of flow immediately, rather than lingering until Svelte's own outro timer
elapses, which previously left a short window where both children were laid out.

`mode="sync"` and `mode="popLayout"` are unaffected.
