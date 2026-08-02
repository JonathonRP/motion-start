---
"motion-start": patch
---

Harden `LayoutGroup` id resolution for `motion` components.

- `motion` components now resolve their enclosing `LayoutGroup` id once, during component
  initialisation, instead of re-entering `getContext` from inside the `$derived` that builds
  their props. `getContext` is an initialisation-only API, so keeping it out of a value that
  recomputes on every props change removes the risk of the `LayoutGroup` prefix silently
  disappearing from `layoutId` and breaking shared-layout animations.
- `useLayoutGroupContext` no longer wraps its context read in a blanket `try`/`catch`. A
  missing `LayoutGroup` provider is an expected `null` and is now detected with `hasContext`;
  every other failure, including calling it outside component initialisation, throws
  instead of quietly degrading.
- Removed the unused, never-imported `createLayoutGroupContext` rune store and its
  `LayoutGroupContextType` interface.
- Internal: `useLayoutId(props)` is replaced by the pure helper
  `getLayoutId(props, layoutGroupId)`.
