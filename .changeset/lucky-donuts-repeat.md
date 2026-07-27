---
"motion-start": patch
---

Declare `runed` as a runtime dependency.

`runed` is imported by six shipped files - `MotionConfig.svelte`,
`motion/index.svelte.ts`, `value/use-spring.ts`, `MeasureLayoutWithContext.svelte`,
`motion/utils/use-visual-element.svelte.ts` and `render/dom/UseRender.svelte` - but was
only ever listed in the repo's own devDependencies, where it resolved by accident. Any
consumer who did not already have `runed` installed would fail to resolve it.
