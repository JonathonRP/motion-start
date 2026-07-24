# Framer Motion 11.11.11 skipped-test parity

Compared against the source tree for `framer-motion@11.11.11`.

## Skips that match upstream

| Motion Start test | Upstream status |
| --- | --- |
| `projection/node/__tests__/group.svelte.spec.ts` grouped-node notification | `test.skip` upstream |
| `cypress/integration/layout-shared.ts` `layout={true}` completion case | `it.skip` upstream |
| `cypress/integration/layout-shared.ts` `layout="position"` case | `it.skip` upstream |
| `cypress/integration/layout-shared-lightbox-crossfade-repeated.ts` suite and switch case | `describe.skip` and `it.skip` upstream |
| `cypress/integration/while-in-view.ts` margin case | `it.skip` upstream |

## Previously local skips that are active upstream

These gaps are now closed. The three projection-node tests and four MotionValue
lifecycle tests are enabled and pass in Vitest. The prior rune-context and
`Element`/happy-dom skip explanations no longer apply to the current test setup.

The `skipIf` calls used for DOM/WAAPI environment detection are conditional
test-runner guards rather than known behavioral parity skips.
