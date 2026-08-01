---
"motion-start": patch
---

Fix three `AnimatePresence mode="popLayout"` bugs that made exiting children shove the
page around and leak stylesheets.

- The pop-layout rule was released from the Svelte transition's `tick(0)`, but Svelte keeps
  the node mounted past the end of its transition. A tall exiting child therefore dropped
  back into its parent's flow for the trailing window and re-stretched it. The rule is now
  dropped when the node is actually detached.
- If an exit was torn down without completing, its injected `<style>` element was never
  removed. These accumulated in `<head>` for the life of the page.
- Motion elements *nested inside* an exiting subtree were each pulled out of flow as well,
  even though they have no exit of their own and the ancestor is pinned and removed whole.
  Only the outermost exiting node leaves the flow now, matching the existing behaviour of
  `mode="wait"`.
