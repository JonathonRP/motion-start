---
"motion-start": patch
---

Remove `sideEffects: false` from `package.json` to fix module resolution in the Svelte REPL playground.

Bundlers honour this flag by tree-shaking modules that are imported only for their side effects. In the Svelte playground this caused the module that resolves the `"."` bare specifier to be dropped entirely, producing:

> error occurred while trying to resolve `.` within `npm://$/motion-start@0.1.18/dist/value/use-motion-template.js`
