---
"motion-start": patch
---

Fix three independent correctness bugs ported from framer-motion v11.11.11.

- `useSpring` dropped upstream's sub-frame sampling. When a spring was retargeted before its
  previous animation had rendered a frame, the replacement animation started from the stale
  position instead of the interpolated one. The previous animation is now sampled with
  `frameData.delta` before being replaced, matching upstream.
- Reading `MotionValue.current` reactively registered a real `change` listener, and the number
  of `change` listeners is what decides whether an animation is auto-stopped once the last
  consumer goes away. Destroying the last component that reactively read a standalone
  `MotionValue` therefore cancelled an in-flight animation. Svelte's signal subscriber is now
  tracked separately from user `on('change')` subscribers, so it no longer participates in that
  refcount. Reactive behaviour of `.current` is unchanged.
- `PresenceChild` wrapped its registered-children `Map` in `$state`, which is a no-op - Svelte 5
  only proxies plain objects and arrays. The wrapper has been dropped since the map's contents
  are only read imperatively and were never meant to drive reactivity.
