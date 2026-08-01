---
"motion-start": patch
---

Render resolved initial motion styles during SSR so animated elements display their first frame before hydration. Add an opt-in `appear` prop for supported tween and keyframes animations to begin while HTML is parsed and hand off to Motion when Svelte hydrates.
