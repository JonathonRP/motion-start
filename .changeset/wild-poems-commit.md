---
"motion-start": patch
---

Fix WAAPI animations of multi-word CSS properties snapping back when they finish.

`setStyle` committed the final keyframe with `element.style.setProperty(name, value)`. CSSOM
lowercases the property name it is given but does not convert camelCase to kebab-case, so
`setProperty("clipPath", ...)` became `"clippath"` and was silently discarded. Every
`acceleratedValues` entry with more than one word - `clipPath`, `backgroundColor`, `borderRadius`
and friends - therefore lost its end state the moment the animation was cancelled, producing the
flash the commit is there to prevent. Only `opacity` and other single-word properties worked.

The final keyframe is now assigned through the camelCase indexer, matching upstream, while CSS
custom properties keep going through `setProperty`.
