---
"motion-start": patch
---

Fix two reactivity misuses in the motion component body.

- The merged config/props object was built with `$state` inside a `$derived`. The derived
  already recomputes on dependency changes, so the inner `$state` added no reactivity — it
  only allocated a fresh deep proxy over the whole props graph (`style`, `variants`,
  `animate`, ...) on every recomputation. That churned the identity of structures
  `VisualElement` holds by reference and made user objects reactive that never asked to be.
  It is now a plain object.
- The visual element was assigned onto the object a `$derived` owns. Any variant or tracked
  prop change rebuilt that object, so `context.visualElement` momentarily read as
  `undefined` — dropping the element's listeners and measure props for that window. It now
  lives in init-time state that the context reads through a getter.
