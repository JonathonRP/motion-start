---
"motion-start": patch
---

fix: resolve bare dot and extension-less imports in value/ for Svelte REPL

The Svelte playground CDN resolves ESM imports without a bundler, requiring explicit file extensions and no bare directory imports. Bare dot imports like `from '.'` compiled to JS caused the REPL to fail resolving `dist/value/` as a directory path.

Fixed by replacing all `from '.'`, `from '..'`, and extension-less relative imports within the value/ directory with explicit `./index.js` paths and proper `.js` extensions.
