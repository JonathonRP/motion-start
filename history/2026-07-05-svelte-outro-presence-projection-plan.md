# Svelte Outro Presence/Projection Plan - 2026-07-05

## Current conclusion

Svelte owns DOM lifetime for raw `{#if}` and `{#each}` blocks. Trying to make Motion retain arbitrary unmounted descendants through the VisualElement children set would fight that ownership and likely introduce flicker. The supported direction should use Svelte's outro/transition mechanism, because Svelte keeps an outroing block in the DOM until transitions complete.

This is a Svelte-specific feature/design layer, not a direct Framer Motion v11.11.11 parity patch. Framer's React implementation can rely on React render retention and lifecycle ordering. In Svelte, raw blocks need explicit transition/outro coordination.

## Evidence so far

- `layout-shared.ts` currently reports `26 passing, 2 failing, 2 pending`.
- `layout-preserve-ratio.svelte` matches upstream structurally, but child `#a` has projection parent root, path `[root]`, and no parent tree scale. The parent visually scales to about `matrix(1.97..., 0, 0, 1, ...)`; the child remains `transform: none` and about `195-197px` wide instead of `100px`.
- Eager projection-node creation in `useVisualElement` did not improve the result and was reverted.
- `layout-group-unmount.svelte` is valid upstream behavior, but Svelte teardown timing means `#b` is measured after `#a` has already left layout. `group.remove(#a)` dirties `#b`, but `#b` snapshots at `top=20` instead of cached `top=160`.
- Svelte docs state that when a block is transitioning out, all elements inside it remain in the DOM until transitions in that block complete. That is the right ownership boundary for raw Svelte blocks.

## Existing architecture to preserve

- `ExitAnimationFeature.update()` reads `presenceContext.isPresent`, calls `animationState.setActive('exit', !isPresent)`, and calls `onExitComplete` after the returned promise.
- `animationState.setActive('exit', true)` routes through `animateChanges('exit')` and `animateVisualElement`; this preserves variant resolution, dynamic variants, `custom`, transition config, and render scheduling.
- `UseRender.svelte` owns the actual element and attachments. It is the likely location for any Svelte `out:` transition function because it has both the DOM node and `visualElement`.
- `MeasureLayoutWithContext.svelte` and projection nodes own layout measurement/projection transactions. Projection outro support should coordinate here or through a sibling transition helper, not hidden DOM retention.

## Proposed direction

### Presence/outro

Add an explicit Svelte outro bridge that can be attached to motion elements when enabled by `AnimatePresence` or a future prop.

Possible shape:

- `AnimatePresence` provides a context flag/config for Svelte outro mode.
- `UseRender.svelte` conditionally attaches `out:motionExitOutro` to the rendered element.
- `motionExitOutro(node, params, { direction })` triggers the existing feature path rather than direct style animation:
  - mark presence as not present, or call a helper on `visualElement` that updates `presenceContext`
  - call `visualElement.animationState?.setActive('exit', true)`
  - keep Svelte's outro pending until the animation promise resolves
- Avoid duplicating variant resolution or manually applying keyframes outside `animationState`.

Open implementation question: Svelte transition functions expect a transition config synchronously. If the exit animation promise is asynchronous and duration is not known upfront, we may need a custom transition that uses `tick` and a controlled duration, or a wrapper transition that delays completion until Motion resolves. This needs a spike/probe before production implementation.

### Projection/outro

For projection cases like LayoutGroup unmount, add explicit pre-teardown/outro coordination rather than retaining DOM invisibly.

Possible shape:

- A projection-aware outro transition triggers a pre-teardown snapshot before Svelte removes layout participation.
- During outro, Svelte keeps the DOM node in place long enough for group siblings to snapshot and animate.
- `MeasureLayoutWithContext` may need a hook to call `projection.willUpdate()` and `projection.root.didUpdate()` at the correct transition phase.

## TDD plan

Red tests first:

1. Raw `{#if}` + motion element inside proposed outro-enabled presence should remain in DOM during exit and animate through existing `exit` prop.
2. Dynamic exit variant should receive latest `custom` from `AnimatePresence`.
3. `mode=wait` or equivalent should not mount entering element until outro exit completes.
4. LayoutGroup sibling unmount with projection-aware outro should animate `#b` from `top=160` toward `top=20`, hitting midpoint `top=90` at the deterministic test frame.
5. Existing list/`values` AnimatePresence behavior should remain green.

Green implementation should be minimal and keep all animation execution routed through `animationState`/features.

Refactor after green:

- Deduplicate presence completion paths between list-managed `PresenceChild` and Svelte outro bridge.
- Keep naming clear to avoid collision with Framer/Motion `transition` prop. Prefer terms like `outro`, `exitOutro`, or `svelteOutro` for Svelte-specific API.

## Non-goals

- Do not make the VisualElement children set own arbitrary Svelte block DOM lifetime.
- Do not bypass `animationState` by directly setting styles for exit variants.
- Do not remove Framer-valid Cypress expectations just because the current Svelte port lacks the outro bridge.
- Do not treat this as a tiny Framer parity patch; it is a Svelte integration feature and needs focused tests.
