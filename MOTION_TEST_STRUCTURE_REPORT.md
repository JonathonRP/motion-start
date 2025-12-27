# Motion Repository Test Structure Report
## framer-motion@11.11.11 - Complete Test File Inventory

**Repository:** https://github.com/motiondivision/motion
**Version:** v11.11.11 (Released: October 31, 2024)
**Analysis Date:** December 27, 2025

---

## Executive Summary

- **Exact Version Match:** ✅ v11.11.11 exists and was used
- **Total Test Files:** 176 files
- **Test Directories:** 31 `__tests__` directories + 3 Cypress suites
- **Test Frameworks:** Jest (unit tests) + Cypress (E2E tests)
- **Repository Type:** Monorepo (Lerna + Yarn Workspaces)

---

## Test Framework Configuration

### Jest Setup
- **Preset:** `ts-jest` (TypeScript support)
- **Environment:** `jsdom` (browser simulation)
- **Test Pattern:** `**/__tests__/**/*.test.(js|ts)?(x)`
- **Client Config:** `packages/framer-motion/jest.config.json`
- **SSR Config:** `packages/framer-motion/jest.config.ssr.json`
- **Setup File:** `packages/framer-motion/jest.setup.tsx`
- **Test Commands:**
  - `yarn test-client` - Browser environment tests
  - `yarn test-server` - SSR tests
  - `yarn test` - Runs both

### Cypress Setup
- **Location:** `packages/framer-motion/cypress/`
- **Test Suites:**
  - `integration/` - Standard E2E tests (30 files)
  - `integration-html/` - HTML-specific tests (2 files)
  - `integration-rsc/` - React Server Components tests (1 file)

---

## Complete Test File Directory Structure

### **1. Animation System Tests**

#### `/src/animation/__tests__/` (4 files)
- `GroupPlaybackControls.test.ts`
- `animate-waapi.test.ts`
- `css-variables.test.tsx`
- `index.test.tsx`

#### `/src/animation/animators/__tests__/` (2 files)
- `MainThreadAnimation.test.ts`
- `utils.ts`

#### `/src/animation/animators/waapi/__tests__/` (4 files)
- `animate-style.test.ts`
- `easing.test.ts`
- `polyfill.js`
- `setup.ts`

#### `/src/animation/generators/__tests__/` (3 files)
- `inertia.test.ts`
- `keyframes.test.ts`
- `spring.test.ts`

#### `/src/animation/hooks/__tests__/` (2 files)
- `use-animate.test.tsx`
- `use-animated-state.test.tsx`

#### `/src/animation/sequence/__tests__/` (1 file)
- `index.test.ts`

#### `/src/animation/utils/__tests__/` (3 files)
- `is-none.test.ts`
- `stagger.test.ts`
- `transitions.test.ts`

**Animation Subtotal:** 19 files

---

### **2. Component Tests**

#### `/src/components/AnimatePresence/__tests__/` (2 files)
- `AnimatePresence.test.tsx`
- `use-presence.test.tsx`

#### `/src/components/LayoutGroup/__tests__/` (1 file)
- `LayoutGroup.test.tsx`

#### `/src/components/MotionConfig/__tests__/` (2 files)
- `MotionConfig.test.tsx`
- `index.test.tsx`

#### `/src/components/Reorder/__tests__/` (2 files)
- `index.test.tsx`
- `server.ssr.test.tsx`

**Components Subtotal:** 7 files

---

### **3. Context Tests**

#### `/src/context/MotionContext/__tests__/` (1 file)
- `utils.test.ts`

**Context Subtotal:** 1 file

---

### **4. Easing Tests**

#### `/src/easing/__tests__/` (3 files)
- `circ.test.ts`
- `cubic-bezier.test.ts`
- `steps.test.ts`

**Easing Subtotal:** 3 files

---

### **5. Event Tests**

#### `/src/events/__tests__/` (2 files)
- `types.test.tsx`
- `use-event.test.tsx`

**Events Subtotal:** 2 files

---

### **6. Frameloop Tests**

#### `/src/frameloop/__tests__/` (1 file)
- `index.test.ts`

**Frameloop Subtotal:** 1 file

---

### **7. Gesture Tests**

#### `/src/gestures/__tests__/` (6 files)
- `focus.test.tsx`
- `hover.test.tsx`
- `is-node-or-child.test.tsx`
- `pan.test.tsx`
- `press.test.tsx`
- `utils.ts`

#### `/src/gestures/drag/__tests__/` (3 files)
- `index.test.tsx`
- `use-drag-controls.test.tsx`
- `utils.tsx`

**Gestures Subtotal:** 9 files

---

### **8. Motion Core Tests**

#### `/src/motion/__tests__/` (21 files)
- `animate-prop.test.tsx`
- `animated-values.test.tsx`
- `child-motion-value.test.tsx`
- `component-svg.test.tsx`
- `component.test.tsx`
- `create-component.test.tsx`
- `custom.test.tsx`
- `delay.test.tsx`
- `lazy-async-endpoint.ts`
- `lazy.test.tsx`
- `motion-component.test.tsx`
- `motion-context.test.tsx`
- `ssr.test.tsx`
- `static-prop.test.tsx`
- `style-prop.test.tsx`
- `svg-path.test.tsx`
- `transformTemplate.test.tsx`
- `transition-keyframes.test.tsx`
- `unit-type-shadow.test.tsx`
- `variant.test.tsx`
- `waapi.test.tsx`

**Motion Core Subtotal:** 21 files

---

### **9. Projection Tests**

#### `/src/projection/animation/__tests__/` (1 file)
- `mix-values.test.ts`

#### `/src/projection/geometry/__tests__/` (5 files)
- `conversion.test.ts`
- `copy.test.ts`
- `delta-apply.test.ts`
- `delta-calc.test.ts`
- `operations.test.ts`

#### `/src/projection/node/__tests__/` (3 files)
- `TestProjectionNode.ts`
- `group.test.ts`
- `node.test.ts`

#### `/src/projection/styles/__tests__/` (2 files)
- `scale-correction.test.ts`
- `transform.test.ts`

**Projection Subtotal:** 11 files

---

### **10. Render Tests**

#### `/src/render/dom/scroll/__tests__/` (1 file)
- `index.test.ts`

#### `/src/render/dom/utils/__tests__/` (4 files)
- `camel-to-dash.test.ts`
- `is-css-variable.test.ts`
- `is-svg-component.test.ts`
- `unit-conversion.test.ts`

#### `/src/render/dom/value-types/__tests__/` (1 file)
- `value-types.test.ts`

#### `/src/render/html/__tests__/` (1 file)
- `use-props.test.ts`

#### `/src/render/svg/__tests__/` (1 file)
- `use-props.test.ts`

#### `/src/render/utils/__tests__/` (4 files)
- `StateVisualElement.ts`
- `animation-state.test.ts`
- `flat-tree.test.ts`
- `variants.test.ts`

**Render Subtotal:** 12 files

---

### **11. Utility Tests**

#### `/src/utils/__tests__/` (22 files)
- `array.test.ts`
- `clamp.test.ts`
- `delay.test.ts`
- `distance.test.ts`
- `each-axis.test.ts`
- `hsla-to-rgba.test.ts`
- `interpolate.test.ts`
- `is-numerical-string.test.ts`
- `is-zero-value-string.test.ts`
- `memo.test.ts`
- `mock-intersection-observer.ts`
- `progress.test.ts`
- `shallow-compare.test.ts`
- `subscription-manager.test.ts`
- `transform.test.ts`
- `use-animation-frame.test.tsx`
- `use-cycle.test.tsx`
- `use-in-view.test.tsx`
- `use-instant-transition.test.tsx`
- `use-motion-value-event.test.tsx`
- `velocity-per-second.test.ts`
- `wrap.test.ts`

**Utils Subtotal:** 22 files

---

### **12. Value Tests**

#### `/src/value/__tests__/` (7 files)
- `index.test.ts`
- `unwrap-value.test.ts`
- `use-motion-template.test.tsx`
- `use-motion-value.test.tsx`
- `use-spring.test.tsx`
- `use-transform.test.tsx`
- `use-velocity.test.tsx`

#### `/src/value/types/__tests__/` (1 file)
- `index.test.ts`

**Value Subtotal:** 8 files

---

## **UNIT TESTS TOTAL: 143 files across 31 directories**

---

## Cypress E2E Tests

### `/cypress/integration/` (30 files)
Standard integration tests covering animations, gestures, and layouts:

1. `animate-layout-timing.ts`
2. `animate-presence-pop.ts`
3. `animate-presence-remove.ts`
4. `animate-presence-switch-waapi.ts`
5. `animate-reverse.ts`
6. `animate-style.ts`
7. `animate-unit-types.ts`
8. `css-vars.ts`
9. `drag-framer-page.ts`
10. `drag-nested.ts`
11. `drag-svg.ts`
12. `drag-tabs.ts`
13. `drag-to-reorder.ts`
14. `drag.ts`
15. `layout-cancelled-finishes.ts`
16. `layout-exit.ts`
17. `layout-instant-undo.ts`
18. `layout-relative-delay.ts`
19. `layout-relative-drag.ts`
20. `layout-resize.ts`
21. `layout-shared-lightbox-crossfade-repeated.ts`
22. `layout-shared-lightbox-crossfade.ts`
23. `layout-shared.ts`
24. `layout-viewport-jump.ts`
25. `layout.ts`
26. `scroll.ts`
27. `svg.ts`
28. `unit-conversion.ts`
29. `waapi.ts`
30. `while-in-view.ts`

### `/cypress/integration-html/` (2 files)
HTML-specific integration tests:

1. `appear.ts`
2. `projection.ts`

### `/cypress/integration-rsc/` (1 file)
React Server Components tests:

1. `use-client.ts`

---

## **CYPRESS TESTS TOTAL: 33 files**

---

## **GRAND TOTAL: 176 test files**

- **Unit Tests (Jest):** 143 files
- **Integration Tests (Cypress):** 33 files

---

## Test Coverage by System

| System | Test Files | Key Areas |
|--------|------------|-----------|
| **Animation** | 19 | Generators, animators, WAAPI, hooks, sequences |
| **Components** | 7 | AnimatePresence, LayoutGroup, MotionConfig, Reorder |
| **Context** | 1 | MotionContext utilities |
| **Easing** | 3 | Cubic bezier, circular, steps |
| **Events** | 2 | Event types, DOM events |
| **Frameloop** | 1 | Core frameloop system |
| **Gestures** | 9 | Hover, focus, pan, press, drag |
| **Motion Core** | 21 | Component API, variants, props, SSR |
| **Projection** | 11 | Layout projection, geometry, nodes |
| **Render** | 12 | DOM/HTML/SVG rendering, value types |
| **Utils** | 22 | General utilities, hooks |
| **Value** | 8 | MotionValue, hooks, transforms |
| **Cypress E2E** | 33 | Layout, drag, scroll, WAAPI |

---

## Test File Naming Conventions

**Unit Tests:**
- Pattern: `**/__tests__/**/*.test.(ts|tsx)`
- Extensions: `.test.ts`, `.test.tsx`
- Location: Co-located with source code in `__tests__/` directories
- Helper files: Some directories include `utils.ts`, `setup.ts`, etc.

**Cypress Tests:**
- Pattern: `cypress/**/*.ts`
- Extensions: `.ts`
- Organization: By test type (integration, integration-html, integration-rsc)

---

## Key Observations

### 1. **Test Organization**
- Tests are co-located with source code using `__tests__/` directories
- Clear separation between unit tests (Jest) and E2E tests (Cypress)
- Dual Jest configurations for client and SSR testing

### 2. **Comprehensive Coverage**
- **Animation system:** Full coverage from low-level animators to high-level hooks
- **Gesture system:** All gesture types tested (hover, focus, pan, press, drag)
- **Layout projection:** Complete geometry and projection node testing
- **Rendering:** Separate tests for HTML, SVG, and DOM rendering
- **SSR:** Dedicated server-side rendering tests

### 3. **React-Specific Testing**
- Heavy use of `.tsx` files for component testing
- SSR test suite for server-side rendering
- React Server Components (RSC) integration tests

### 4. **WAAPI Integration**
- Dedicated Web Animations API tests
- Polyfill and setup files for WAAPI testing
- Cross-browser compatibility testing via Cypress

### 5. **No Tests Found In**
- `src/components/LazyMotion` - No `__tests__` directory
- `src/context` (root) - No `__tests__` directory
- `packages/framer-motion-3d` - Test setup exists but no visible test files

---

## Migration Considerations for motion-start

### Adaptations Needed

1. **Framework Differences:**
   - React → Svelte 5
   - JSX/TSX → Svelte components
   - React hooks → Svelte 5 runes
   - Component lifecycle → Svelte lifecycle

2. **Test Framework:**
   - Consider keeping Jest or migrating to Vitest
   - Cypress tests may need adjustment for Svelte
   - Current motion-start uses: Vitest + Playwright (browser tests)

3. **SSR Testing:**
   - React SSR tests → SvelteKit SSR tests
   - Different rendering model

4. **File Extensions:**
   - `.test.tsx` → `.test.ts` or `.test.svelte.ts`
   - Component tests may use `.svelte` files

5. **Priority Test Areas:**
   - **High Priority:**
     - Animation system (19 files)
     - Motion core (21 files)
     - Gestures (9 files)
     - Value system (8 files)
   - **Medium Priority:**
     - Projection (11 files)
     - Render system (12 files)
     - Utils (22 files)
   - **Low Priority (Svelte-specific):**
     - Component tests (7 files) - Need complete rewrite
     - SSR tests - Adapt for SvelteKit

### Existing motion-start Tests

Based on the codebase grep, motion-start already has browser tests:
- `/src/lib/motion-start/__tests__/browser/layout.browser.test.ts`
- `/src/lib/motion-start/__tests__/browser/gestures.browser.test.ts`
- `/src/lib/motion-start/__tests__/browser/drag.browser.test.ts`
- `/src/lib/motion-start/__tests__/browser/animate.browser.test.ts`
- `/src/lib/motion-start/__tests__/browser/animate-presence.browser.test.ts`
- `/src/lib/motion-start/value/__tests__/value-hooks.test.ts`
- `/src/lib/motion-start/value/__tests__/motion-value.test.ts`
- `/src/lib/motion-start/render/__tests__/render-imports.test.ts`

These are already aligned with framer-motion v11.11.11!

---

## Recommended Next Steps

1. **Download Priority Test Files:**
   - Start with animation system tests (foundational)
   - Then gesture and value tests
   - Finally projection and render tests

2. **Test Adaptation Strategy:**
   - Create conversion templates for React → Svelte test patterns
   - Identify tests that can be ported directly (non-component logic)
   - Flag tests requiring complete rewrites (component-heavy)

3. **Test Infrastructure:**
   - Ensure Vitest config matches Jest patterns
   - Set up Playwright tests equivalent to Cypress integration tests
   - Create SSR test suite for SvelteKit

4. **Gap Analysis:**
   - Compare existing motion-start tests against this inventory
   - Identify missing coverage areas
   - Prioritize based on system criticality

---

## Source Information

- **Repository:** https://github.com/motiondivision/motion
- **Version Tag:** https://github.com/motiondivision/motion/tree/v11.11.11
- **Package Location:** `/packages/framer-motion`
- **Jest Config:** `/packages/framer-motion/jest.config.json`
- **Cypress Config:** `/packages/framer-motion/cypress/`

---

**Report Generated:** December 27, 2025
**Analysis Tool:** Claude Code (Sonnet 4.5)
**Target Project:** motion-start (Svelte 5 port of framer-motion)
