# UI E2E merge plan (motiondivision/motion v11.11.11 -> motion-start)

## Source suite notes
- Location: motiondivision/motion packages/framer-motion/cypress/integration (plus integration-html and integration-rsc)
- Coverage axes: layout/shared layouts (crossfade/resize/relative delay/viewport jump), AnimatePresence (pop, remove, layout), drag (constraints, nested, reorder, framer-page), scroll (progress callbacks, parallax, while-in-view), WAAPI/animate-style, unit-conversion, CSS vars, lightbox crossfade, HTML fixtures (optimized-appear, projection)
- Infra: Cypress config per target (react/html/rsc), helper `expectBbox`, fixtures collected via dev/inc/collect-html-tests.js

## Porting strategy for motion-start (Svelte 5)
1) **Test harness**: keep Cypress; add Svelte routes under src/routes/tests mirroring motion demos (layout, drag, scroll, presence). Provide data-testid hooks and deterministic sizes to match bbox assertions.
2) **Core scenarios to import first** (high-value regressions):
   - Layout & shared layout: layout.ts, layout-shared.ts (subset), layout-resize.ts, layout-relative-delay.ts, layout-viewport-jump.ts
   - AnimatePresence: animate-presence-pop.ts, animate-presence-remove.ts, animate-presence-layout.ts
   - Drag & reorder: drag.ts, drag-nested.ts, drag-to-reorder.ts, drag-framer-page.ts
   - Scroll/visibility: scroll.ts (callbacks/parallax), while-in-view.ts
   - Motion runtime basics: animate-style.ts, waapi.ts, unit-conversion.ts, css-vars.ts
3) **Adapting assertions**: convert `expectBbox` helpers to shared Cypress support util; use viewport 1000x660 defaults; allow small tolerance (±2px) for Svelte render differences.
4) **Fixtures/routes**: map each test to a Svelte page under `src/routes/tests/<name>/+page.svelte`; keep CSS inline for determinism; ensure fonts/layouts match original pixel values.
5) **Config**: add cypress.config.ts entries for grouped specs (ui smoke vs full); reuse existing `cypress/e2e` path; add task scripts in package.json for `e2e:ui`.
6) **Phased import**:
   - Phase A: smoke (animate-style, css-vars, waapi, unit-conversion)
   - Phase B: layout basics (layout, layout-resize, viewport-jump, relative-delay)
   - Phase C: AnimatePresence suites
   - Phase D: drag + reorder suites
   - Phase E: scroll/while-in-view/parallax
   - Phase F: optional HTML fixture equivalents (optimized-appear/projection) if time
7) **Stabilization**: add helpers to normalize transforms/rounding; use `cy.wait` minimal values; prefer deterministic transitions (spring to fixed durations when needed).
8) **Tracking**: Work under bd task motion-start-b9u; record imported spec list and gaps in this plan; update as phases land.

## Task description (bd motion-start-b9u)
Improve UI E2E coverage by porting Cypress scenarios from motiondivision/motion v11.11.11 to motion-start. Focus on layout/shared layout, AnimatePresence, drag/reorder, scroll/whileInView, runtime basics. Add Svelte test routes, shared bbox helper with tolerance, and cypress task wiring. Phased import A–F above; document progress here.

---

## Phase A Progress

### ✅ Completed (motion-start-b9u.1)

**Routes added:**
- `/tests/animate-style` – validates `animateMini()` basic width animation
- `/tests/css-vars` – validates CSS variable resolution and updates
- `/tests/waapi` – validates WAAPI interruption and resumption of animations
- `/tests/unit-conversion` – validates em-to-px unit resolution during animation

**Cypress spec:**
- `cypress/e2e/phase-a-runtime-basics.cy.ts` – 4 smoke tests covering animate-style, css-vars, WAAPI interrupt, unit-conversion

**Helpers:**
- `cypress/support/expect-bbox.ts` – shared bounding box assertion with configurable tolerance (±2px default)

**Config:**
- Updated `cypress.config.ts` baseUrl from 5000 to 5173 (SvelteKit dev default)

### To run Phase A tests
```bash
npm run dev &                # Start dev server
npx cypress open             # Open Cypress UI
# or
npx cypress run --spec "cypress/e2e/phase-a-runtime-basics.cy.ts"
```

### Next phases
- Phase B: Layout basics (layout, layout-resize, viewport-jump, relative-delay)
- Phase C: AnimatePresence suites
- Phase D: Drag + reorder
- Phase E: Scroll / whileInView / parallax
- Phase F: HTML fixtures (optimized-appear, projection)
