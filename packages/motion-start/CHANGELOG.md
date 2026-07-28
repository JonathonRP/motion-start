# motion-start

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
