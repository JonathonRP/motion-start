# Cypress Test Organization

## Overview

The Cypress E2E test suite for motion-start has been consolidated and reorganized for clarity. Duplicate, overlapping, and debug-only test files have been removed.

**Total Active Test Files**: 8
**Total Tests**: 50+ passing tests across all suites

## Active Test Files

### 1. **layout-basics.cy.ts** ⭐ (8 passing)
- **Purpose**: Tests layout projection animations and presenceAffectsLayout feature
- **Coverage**:
  - Layout prop on motion components (box resize, list item add/remove)
  - AnimatePresence conditional rendering (show prop)
  - AnimatePresence list rendering (values prop)
  - presenceAffectsLayout={true} (siblings animate when items enter/exit)
  - presenceAffectsLayout={false} (siblings do NOT animate)
  - Default behavior (presenceAffectsLayout defaults to true)
- **Status**: ✅ All tests passing
- **Route**: `/layout-basics`

### 2. **animate-presence-lifecycle.cy.ts** (formerly animate-presence.cy.ts)
- **Purpose**: Comprehensive AnimatePresence testing - exit animations, mode handling, infinite loop prevention
- **Coverage**:
  - Exit animation timing and opacity changes
  - DOM removal after animation completes
  - Mode=wait sequential animations (exit before enter)
  - Conditional rendering with AnimatePresence
  - Bug regression: infinite loop prevention (consolidated from animate-presence-bugs.cy.ts)
  - Values prop with list/array rendering
- **Status**: All bug regression tests consolidated into this file
- **Route**: `/animate-presence-basics`

### 3. **animations.cy.ts** (17 passing)
- **Purpose**: Tests different animation types and transition properties
- **Coverage**:
  - Duration-based spring animations
  - Spring physics animations
  - Keyframes with position/color
  - Animation repetition
  - Reverse effect
  - Tweened animations
- **Status**: ✅ All tests passing
- **Routes**: Various animation demo pages

### 4. **animation-primitives.cy.ts** (formerly home_page.cy.js)
- **Purpose**: Tests basic animation primitives and core functionality
- **Coverage**:
  - Color interpolation
  - SVG morphing
  - Animation sequences
  - Basic motion component behavior
- **Status**: Needs verification after rename
- **Routes**: Home page and animation demo pages

### 5. **gestures-basics.cy.ts** (4 passing)
- **Purpose**: Tests gesture interactions (drag, hover, tap)
- **Coverage**:
  - Drag transform
  - Drag constraints
  - Drag direction locking
  - 3D transform on drag
  - While-hover effects
  - While-tap effects
  - While-drag effects
- **Status**: ✅ All tests passing
- **Route**: `/gestures-basics`

### 6. **scroll-basics.cy.ts**
- **Purpose**: Tests scroll-triggered animations and scroll progress
- **Coverage**:
  - Scroll progress tracking
  - Scroll-linked animations
- **Status**: Needs investigation
- **Route**: `/scroll-basics`

### 7. **reorder-basics.cy.ts** (1 passing)
- **Purpose**: Tests drag-to-reorder list functionality
- **Coverage**:
  - Reorder list component
  - Item dragging within lists
  - List item reordering
- **Status**: ✅ Passing (minimal coverage, could be expanded)
- **Route**: `/reorder-basics`

### 8. **runtime-basics.cy.ts**
- **Purpose**: Tests core animation runtime and engine
- **Coverage**:
  - Animation runtime initialization
  - Core animation loop
  - Performance characteristics
- **Status**: Needs fixes (3 failing tests)
- **Route**: `/runtime-basics`

## Consolidation Summary

The following files have been removed to eliminate duplication and improve maintainability:

### Deleted - Duplicates
- ✅ **presence-affects-layout.cy.ts** → Consolidated into `layout-basics.cy.ts`
  - All presenceAffectsLayout tests are now in layout-basics.cy.ts with better coverage

### Deleted - Overlapping
- ✅ **presence.cy.ts** → Removed (20 tests, but all generic/overlapping)
  - Generic mode handling covered in animate-presence-lifecycle.cy.ts
  - Layout integration covered in layout-basics.cy.ts

### Deleted - Consolidated
- ✅ **animate-presence-bugs.cy.ts** → Consolidated into `animate-presence-lifecycle.cy.ts`
  - Infinite loop regression tests moved to "Bug Regression" section
  - Values prop tests moved to "Values Prop" section

### Deleted - Debug Files
- ✅ **animate-presence-debug.cy.ts** → Removed (debug only)
- ✅ **debug-hydration.cy.ts** → Removed (debug only)

### Deleted - External Tests
- ✅ **ui.cy.ts** → Removed (tested external Cypress website, not motion-start)

## Test File Naming Conventions

Test files follow a descriptive naming pattern:
- `[feature]-basics.cy.ts` - Basic/core functionality for a feature (layout, gestures, scroll, etc.)
- `[component]-lifecycle.cy.ts` - Component lifecycle behavior (mount, update, unmount, animations)
- `[feature].cy.ts` - General feature tests (animations, primitives)

## Running Tests

### Run All Tests
```bash
npx cypress run --headless
```

### Run Specific Suite
```bash
npx cypress run --spec cypress/e2e/layout-basics.cy.ts
npx cypress run --spec cypress/e2e/animate-presence-lifecycle.cy.ts
```

### Run in Interactive Mode
```bash
npx cypress open
```

## CI/CD Recommendations

For CI/CD pipelines, run these test files in the following order (prioritizing critical features):

1. **layout-basics.cy.ts** (core layout + presenceAffectsLayout)
2. **animate-presence-lifecycle.cy.ts** (AnimatePresence behavior)
3. **animations.cy.ts** (animation types)
4. **gestures-basics.cy.ts** (gesture interactions)
5. **animation-primitives.cy.ts** (basic primitives)
6. **reorder-basics.cy.ts** (reorder functionality)
7. **scroll-basics.cy.ts** (scroll animations)
8. **runtime-basics.cy.ts** (runtime engine)

## Maintenance Notes

- All test files now have clear, descriptive names indicating what they test
- No duplicate coverage between files
- Debug tests have been removed (create a separate `debug/` folder if needed)
- Bug regression tests are integrated into main test suites with clear labeling
- Each test file maps to a specific route/page for easy debugging

## Next Steps

1. ✅ Consolidate duplicate tests
2. ✅ Remove debug-only files
3. ✅ Rename files for clarity
4. ⏳ Fix failing tests in animation-primitives.cy.ts
5. ⏳ Verify animate-presence-lifecycle.cy.ts after consolidation
6. ⏳ Fix failing tests in runtime-basics.cy.ts
7. ⏳ Investigate scroll-basics.cy.ts failures
8. ⏳ Expand coverage in reorder-basics.cy.ts

---

**Last Updated**: December 18, 2025
**Consolidation**: Reduced from 14 files to 8 active test files
