---
"motion-start": patch
---

Target `ES2022` in `tsconfig.json` so packaged output keeps native class fields instead of downlevelled `Object.defineProperty` assignments, which broke subclass field initialisation in consumers.
