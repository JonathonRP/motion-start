---
'motion-start': patch
---

Backport seven behavioural bug fixes from upstream Motion (this port is based on
framer-motion 11.11.11).

- **Reduced motion now blocks positional values, not just transforms** (upstream
  11.16.6). `shouldReduceMotion` was gated on `transformProps`, so `height`, `width`,
  `top`, `left` and friends still animated for users who asked for reduced motion. The
  gate now uses `positionalKeys`.
- **`width`/`height` unit conversion respects `box-sizing: border-box`** (upstream
  12.36.0). Padding was always subtracted from the measured box, which made
  `width`/`height: auto` animations start and end at the wrong size on border-box
  elements.
- **`calc()` divisors are no longer zeroed when building an animatable `none`**
  (upstream 12.35.2). `complex.getAnimatableNone('calc(var(--gap) / 5)')` zeroed every
  number it found, producing `calc(var(--gap) / 0)` and therefore `NaN`. Numbers directly
  following a `/` are now preserved.
- **`anticipate` easing is clamped at `p >= 1`** (upstream 12.36.0). It previously
  overshot past `1` for progress values at or beyond the end of the animation.
- **WAAPI `linear()` easing points are rounded to four decimal places** (upstream
  12.17.0). Unrounded floats produced needlessly long easing strings with spurious
  precision.
- **Elements with a `transformTemplate` no longer take the WAAPI path** (upstream
  11.18.2). `AcceleratedAnimation.supports()` did not check for `transformTemplate`, so a
  hardware-accelerated animation would drop the user's custom transform ordering for its
  duration.
- **Time-defined springs ignore inherited velocity** (upstream 12.34.3). Velocity carried
  over from an interrupted animation leaked into `findSpring()`, producing wildly
  different spring parameters and massive oscillation on small-range `duration`/`bounce`
  springs.
