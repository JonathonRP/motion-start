---
'motion-start': patch
---

Accept plain numbers for CSS length and SVG geometry values in `animate`, `initial` and friends.

`TargetProperties` built its CSS half from csstype's `Properties` without supplying a
`TLength`, so it fell back to csstype's default of `string | 0`. That rejected `width: 100`,
and - because csstype also models `cx`, `cy`, `r`, `rx` and `ry` as CSS properties - the
intersection with `SVGAttributes` narrowed those SVG geometry attributes to `string` too, so
`animate={{ r: [30, 33] }}` on a `motion.radialGradient` failed to type-check even though
numbers are exactly what the runtime animates. Numeric strings were not a workaround: they
type-check but snap straight to the final keyframe.

`Properties` is now instantiated as `Properties<string | number>`, matching framer-motion,
whose CSS properties come from React's `string | number`. This is a types-only change and
strictly widens what is accepted.
