---
"motion-start": patch
---

Remove `sideEffects: false` from package.json to fix Svelte playground module resolution. The flag was causing bundlers to drop modules imported for their side effects, breaking resolution of bare specifiers in the published dist files.
