# Testing Strategy and Implementation Guide

## Overview

Motion-start uses a three-tier testing approach:
1. **Unit Tests**: Individual functions and utilities (Vitest)
2. **Integration Tests**: Component workflows and feature interactions (Vitest)
3. **E2E Tests**: User interactions and visual verification (Cypress)

**Naming convention**:
- Unit/integration tests: colocate with source using `.spec.ts` (or `__tests__/` folder)
- E2E tests: `cypress/integration/*.ts`

**Context**: motion-start is a Svelte 5 port of `motiondivision/motion` v11.11.11. The Cypress E2E tests are ported directly from upstream to maintain test parity.

## Philosophy: Hybrid Testing Strategy

**Goal**: Balance lightweight functionality verification with selective comprehensive coverage.

### Current State
- ✅ 240+ passing tests across 15+ files
  - Unit tests: 88 tests (10 files)
  - Integration tests: 103 tests (3 files + others)
  - E2E tests: 50+ tests (3 files)
- ✅ Core functionality verified (mixing, transforms, generators, easing, contexts, UI interactions)
- ✅ Gesture interactions tested (drag, hover, tap)
- ✅ Animation sequences tested (tweened, spring, keyframes, repeat)
- ✅ Presence and layout animations tested
- ✅ All tests passing in happy-dom environment and Cypress

### Upstream Comparison (motiondivision/motion v11.11.11)
- 30+ test files with hundreds of tests
- Comprehensive physics tests (underdamped/overdamped/critically damped springs)
- Extensive color space conversion tests
- Integration tests for type routing and complex workflows
- Test categories: array mixing, object mixing, visibility mixing

### Strategy
1. **Keep Current Tests**: Lightweight tests verify Svelte port functionality
2. **Add Depth Incrementally**: Port upstream tests when issues arise or features need validation
3. **Prioritize Pragmatically**: Focus on high-impact areas and actual bug sources

### Tracked Gaps (P2-P3 Backlog)
- **Missing Categories**: Array mixing, object mixing, visibility mixing
- **Missing Depth**: Comprehensive spring damping modes, extensive color conversions
- **Missing Integration**: mix() type router tests
- See issues: motion-start-8w9, motion-start-4pt, motion-start-hwd, motion-start-cit, motion-start-zfz, motion-start-67j

## Unit Testing

### Purpose
Verify isolated functionality without side effects.

### Coverage Areas

#### 1. Value Type Handling
### Coverage Areas

#### 1. Value Type Mixing (88 tests total)
**Location**: `src/lib/motion-start/utils/mix/`

**Implemented Tests**:
- `color.spec.ts` (11 tests): Linear color interpolation, hex/rgba/hsla formats, alpha channels
- `number.spec.ts` (8 tests): Numeric interpolation, extrapolation, precision handling
- `complex.spec.ts` (7 tests): Complex values with units, transforms, mixed formats

**Backlog** (incremental additions):
- `array.spec.ts`: Array mixing `[0, '100px', '#fff']` (motion-start-8w9, P2)
- `object.spec.ts`: Object property mixing `{x, y, color}` (motion-start-4pt, P2)
- `visibility.spec.ts`: Visibility transitions `'visible'/'hidden'` (motion-start-hwd, P2)
- Expanded color tests: Out-of-bounds RGB, color space conversions (motion-start-67j, P3)
- Integration: mix() type router tests (motion-start-zfz, P3)

Example:
```typescript
describe('mixColor', () => {
  it('should interpolate between hex colors', () => {
    const result = mixColor('#FF0000', '#0000FF', 0.5);
    expect(result).toMatch(/^#[0-9A-F]{6}$/i);
  });
  
  it('should handle alpha channel interpolation', () => {
    const result = mixColor('rgba(255,0,0,0)', 'rgba(0,0,255,1)', 0.5);
    expect(result).toContain('0.5'); // Alpha at midpoint
  });
});
```

#### 2. Utilities
**Location**: `src/lib/motion-start/utils/`

**Implemented Tests**:
- `clamp.spec.ts` (7 tests): Range clamping, boundary conditions, negative ranges
- `interpolate.spec.ts` (9 tests): Range mapping, multi-segment, easing, custom mixers
- `transform.spec.ts` (8 tests): Value transformation, clamping, easing, reverse ranges

Example:
```typescript
describe('interpolate', () => {
  it('should interpolate between numeric ranges', () => {
    const fn = interpolate([0, 100], [0, 1]);
    expect(fn(50)).toBe(0.5);
  });
  
  it('should handle multi-segment ranges', () => {
    const fn = interpolate([0, 50, 100], [0, 1, 0]);
    expect(fn(25)).toBeCloseTo(0.5);
    expect(fn(75)).toBeCloseTo(0.5);
  });
});
```

#### 3. Easing Functions
**Location**: `src/lib/motion-start/easing/`

**Implemented Tests**:
- `ease.spec.ts` (10 tests): easeIn, easeOut, easeInOut, cubicBezier, monotonicity

Example:
```typescript
describe('easeInOut', () => {
  it('should be symmetric', () => {
    expect(easeInOut(0.25)).toBeCloseTo(1 - easeInOut(0.75));
  });
  
  it('should be monotonically increasing', () => {
    for (let i = 0; i <= 10; i++) {
      const t1 = i / 10;
      const t2 = (i + 1) / 10;
      expect(easeInOut(t2)).toBeGreaterThanOrEqual(easeInOut(t1));
    }
  });
});
```

#### 4. Animation Generators
**Location**: `src/lib/motion-start/animation/generators/`

**Implemented Tests**:
- `spring.spec.ts` (8 tests): Physics-based animations, stiffness, damping, velocity, duration-based config
- `keyframes.spec.ts` (11 tests): Multi-value sequences, custom timing, easing per segment
- `inertia.spec.ts` (9 tests): Velocity decay, boundaries, power curves, modifyTarget

**Backlog**:
- Comprehensive spring physics: Underdamped/overdamped/critically damped modes (motion-start-cit, P3)

Example:
```typescript
describe('spring generator', () => {
  it('should animate from origin to target', () => {
    const generator = spring({ from: 0, to: 100 });
    
    // Should start at origin
    const start = generator.next(0);
    expect(start.value).toBe(0);
    
    // Should be moving toward target
    const mid = generator.next(500);
    expect(mid.value).toBeGreaterThan(0);
    expect(mid.value).toBeLessThan(100);
    
    // Should eventually settle
    const end = generator.next(5000);
    expect(end.value).toBeCloseTo(100, 1);
    expect(end.done).toBe(true);
  });
  
  it('should respect stiffness parameter', () => {
    const soft = spring({ from: 0, to: 100, stiffness: 50 });
    const stiff = spring({ from: 0, to: 100, stiffness: 500 });
    
    // Stiffer spring should move faster initially
    expect(stiff.next(100).value).toBeGreaterThan(soft.next(100).value);
  });
});

### Test Structure
```typescript
describe('Unit: <Module>', () => {
  describe('<Function>', () => {
    it('should <expected behavior>', () => {
      // Arrange
      const input = createTestData();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

## Integration Testing

### Purpose
Verify component workflows and interactions between systems.

### Test Infrastructure

**Test Utilities** (`src/lib/motion-start/test-utils/component-test-utils.ts`):
- `nextTick()`, `waitTicks()`: Svelte reactive updates
- `nextFrame()`, `waitFrames()`: Animation frame handling
- `waitForAnimation()`: Poll MotionValue until complete
- `waitFor()`: Generic condition waiting
- `createMockDOMRect()`: Mock DOMRect objects
- `createTestContainer()`: DOM test environment

### Coverage Areas

#### 1. Context Integration (`context/context-integration.spec.ts`)
**Status**: ✅ 11 tests passing

Tests context propagation and interaction:
- **PresenceContext**: Child tracking, exit animation coordination
- **MotionConfigContext**: Config inheritance, reactive updates, partial merges
- **LayoutGroupContext**: Dimension tracking, animation coordination, cleanup
- **Cross-context**: MotionConfig + LayoutGroup, Presence + MotionConfig

Example:
```typescript
describe('Integration: Context Propagation', () => {
  it('should coordinate exit animations across children', async () => {
    const context = createPresenceContext();
    
    context.registerExitAnimation('child-1', promise1);
    context.registerExitAnimation('child-2', promise2);
    
    expect(context.isExiting).toBe(true);
    await context.waitForExitAnimations();
    expect(context.isExiting).toBe(false);
  });
});
```

#### 2. Animation Workflows
**Location**: Tests for animation flows

Test files:
- `animation-start-integration.spec.ts`: Starting animations (Backlog)
- `animation-complete-integration.spec.ts`: Animation completion (Backlog)
- `animation-interrupt-integration.spec.ts`: Interrupting animations (Backlog)

Example:
```typescript
describe('Integration: Animation Workflow', () => {
  it('should complete animation and fire callback', async () => {
    const motionValue = new MotionValue(0);
    const onComplete = vi.fn();
    
    const animation = startAnimation({
      keyframes: [0, 100],
      motionValue,
      onComplete
    });
    
    await waitForAnimation(animation);
    expect(onComplete).toHaveBeenCalled();
  });
});
```

#### 2. VisualElement
**Location**: Tests for element handling

Test files:
- `visual-element-mount-integration.spec.ts`: Element mounting (Backlog)
- `visual-element-style-integration.spec.ts`: Style application (Backlog)
- `visual-element-feature-integration.spec.ts`: Feature integration (Backlog)

#### 3. MotionValue and Animation System
**Status**: Backlog (API investigation needed)

Planned tests:
- MotionValue change detection and subscribers
- Spring/keyframes/inertia generator integration with MotionValue
- Animation interruption and state management
- Velocity tracking during animations

**Note**: Initial implementation revealed API differences that need investigation before implementing these tests.

### Test Structure
```typescript
describe('Integration: <System>', () => {
  it('should <expected behavior across components>', async () => {
    // Arrange: Set up multiple components/systems
    const context1 = createContext1();
    const context2 = createContext2();
    
    // Act: Trigger interaction
    context1.action();
    await waitFor(() => context2.hasUpdated());
    
    // Assert: Verify cross-system behavior
    expect(context2.state).toBe(expectedState);
  });
});
```

## E2E Testing (Cypress)

### Overview

E2E tests are ported from upstream `motiondivision/motion` v11.11.11 to maintain test parity. The test structure mirrors the upstream repository exactly.

### Upstream Reference

- **Source**: `motiondivision/motion/packages/framer-motion/cypress/integration/`
- **React fixtures**: `motiondivision/motion/dev/react/src/tests/`
- **Version**: v11.11.11

### Directory Structure

```
cypress/
├── integration/           # Cypress test files (mirrors upstream)
│   ├── animate-cancel.ts
│   ├── animate-layout-timing.ts
│   ├── animate-presence-layout.ts
│   ├── animate-presence-pop.ts
│   ├── animate-presence-pop-ref.ts
│   ├── animate-presence-pop-shadow-root.ts
│   ├── animate-presence-radix-dialog.ts
│   ├── animate-presence-remove.ts
│   ├── animate-presence-reorder.ts
│   ├── animate-presence-switch-waapi.ts
│   ├── animate-read-transform.ts
│   ├── animate-reverse.ts
│   ├── animate-style.ts
│   ├── animate-unit-types.ts
│   ├── css-vars.ts
│   ├── drag.ts
│   ├── drag-framer-page.ts
│   ├── drag-input-propagation.ts
│   ├── drag-nested.ts
│   ├── drag-scroll-while-drag.ts
│   ├── drag-svg.ts
│   ├── drag-tabs.ts
│   ├── drag-to-reorder.ts
│   ├── layout.ts
│   ├── layout-cancelled-finishes.ts
│   ├── layout-exit.ts
│   ├── layout-group.ts
│   ├── layout-instant-undo.ts
│   ├── layout-read-transform.ts
│   ├── layout-relative-delay.ts
│   ├── layout-relative-drag.ts
│   ├── layout-resize.ts
│   ├── layout-shared.ts
│   ├── layout-shared-lightbox-crossfade.ts
│   ├── layout-viewport-jump.ts
│   ├── motion-ref-forwarding.ts
│   ├── reorder-auto-scroll.ts
│   ├── scroll.ts
│   ├── svg.ts
│   ├── unit-conversion.ts
│   ├── waapi.ts
│   └── while-in-view.ts
├── fixtures/              # Test data
└── support/
    ├── commands.js        # Custom commands (template, matches upstream)
    └── index.js           # Support file imports
```

### Svelte Test Fixtures

Test fixtures are Svelte 5 components that mirror upstream React fixtures.

**Location**: `src/routes/tests/`

```
src/routes/tests/
├── +page.svelte                    # Router: handles ?test=<fixture-name> param
├── animate-cancel.svelte
├── animate-presence-pop.svelte
├── animate-presence-pop-ref.svelte
├── drag.svelte
├── drag-nested.svelte
├── layout.svelte
├── layout-shared.svelte
├── scroll.svelte
├── svg.svelte
├── ... (97 fixture components total)
```

### URL Pattern

Tests access fixtures via URL parameter: `http://localhost:5000/tests?test=<fixture-name>`

Example:
- `?test=drag` → Loads `drag.svelte`
- `?test=animate-presence-pop` → Loads `animate-presence-pop.svelte`
- `?test=layout-shared` → Loads `layout-shared.svelte`

### Test Categories (42 Tests)

| Category | Count | Files |
|----------|-------|-------|
| AnimatePresence | 8 | `animate-presence-*.ts` |
| Layout | 13 | `layout*.ts`, `animate-layout-timing.ts` |
| Drag/Gestures | 9 | `drag*.ts`, `reorder-auto-scroll.ts` |
| Animation Core | 8 | `animate-*.ts`, `waapi.ts`, `css-vars.ts`, `unit-conversion.ts` |
| Scroll/Viewport | 2 | `scroll.ts`, `while-in-view.ts` |
| SVG/Misc | 2 | `svg.ts`, `motion-ref-forwarding.ts` |

### Configuration

**File**: `cypress.config.ts`

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000/tests',
    specPattern: 'cypress/integration/**/*.ts',
    supportFile: 'cypress/support/index.js',
    video: true,
    screenshotOnRunFailure: false,
    retries: 2,
  },
});
```

### Running E2E Tests

```bash
# Start dev server first (in separate terminal)
bun dev

# Run all E2E tests
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/integration/drag.ts"

# Run by category
npx cypress run --spec "cypress/integration/animate-presence-*.ts"
npx cypress run --spec "cypress/integration/layout*.ts"
npx cypress run --spec "cypress/integration/drag*.ts"

# Open Cypress UI
npx cypress open
```

### Porting Pattern: React → Svelte

When porting fixtures from upstream React to Svelte 5:

| React Pattern | Svelte 5 Equivalent |
|--------------|---------------------|
| `useState()` | `$state()` |
| `useRef()` | `let ref = $state()` |
| `onClick={() => {}}` | `onclick={() => {}}` |
| `{condition && <Component>}` | `{#if condition}<Component>{/if}` |
| `{items.map(item => <Item key={item.id} />)}` | `{#each items as item (item.id)}<Item />{/each}` |
| `<motion.div>` | `<motion.div>` (same API) |

**Critical**: Keep element IDs identical to upstream for Cypress selectors to work.

### Adding New Tests

1. **Fetch upstream test** from:
   `https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/cypress/integration/<test>.ts`

2. **Fetch upstream fixture(s)** from:
   `https://github.com/motiondivision/motion/blob/v11.11.11/dev/react/src/tests/<fixture>.tsx`

3. **Create Svelte fixture** at `src/routes/tests/<fixture-name>.svelte`

4. **Copy Cypress test** to `cypress/integration/<test>.ts`

5. **Verify**: `npx cypress run --spec "cypress/integration/<test>.ts"`

### Support Files

**`cypress/support/commands.js`**: Template file matching upstream structure. Add custom commands here as needed.

**`cypress/support/index.js`**: Imports commands file.

### Inline Test Helpers

Tests define helpers inline (matching upstream pattern):

```typescript
// Example from layout tests
const expectBbox = (
  element: HTMLElement,
  expected: { top: number; left: number; width: number; height: number }
) => {
  const bbox = element.getBoundingClientRect();
  expect(bbox.top).to.equal(expected.top);
  expect(bbox.left).to.equal(expected.left);
  expect(bbox.width).to.equal(expected.width);
  expect(bbox.height).to.equal(expected.height);
};
```

## TDD Checklist

Use Test-Driven Development for new tasks, features, and bug fixes to keep scope tight and ensure regressions are caught.

- **Red**: Write a failing test first. Prefer the most specific level (unit/integration/E2E) that expresses the behavior.
- **Green**: Implement the smallest change needed to pass. Avoid broad refactors while red.
- **Refactor**: Improve code structure and readability while tests stay green. Keep changes incremental.

### Quick Commands

```bash
# Type checks
npx sv check

# Run unit tests
bun test

# Run a single E2E spec
npx cypress run --spec "cypress/integration/drag.ts"

# Run all E2E specs
npx cypress run

# Format the codebase
npx @biomejs/biome format --write .

```

### Notes
- Keep tests colocated where practical (`.spec.ts` for unit/integration)
- E2E tests go in `cypress/integration/` to match upstream structure
- Update docs when behavior changes

## Test Execution Summary

### Unit/Integration Tests (Vitest)

```bash
# Run all unit tests
bun test

# Run specific test file
bun test src/lib/motion-start/utils/mix/color.spec.ts

# Run with UI
bun run test:ui

# Run with watch mode
bun test --watch
```

### E2E Tests (Cypress)

```bash
# Start dev server first
bun dev

# Run all E2E tests (headless)
npx cypress run

# Run specific test
npx cypress run --spec "cypress/integration/drag.ts"

# Open Cypress UI
npx cypress open
```

### Type Checking

```bash
npx sv check
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Clean up after tests
- Use fixtures for consistent data

### 2. Meaningful Assertions
- Test behavior, not implementation
- Use descriptive assertion messages
- Test both happy and sad paths

### 3. Performance
- Keep unit tests fast (<100ms each)
- Use mocks for external dependencies
- Batch related tests

### 4. Maintainability
- Follow AAA pattern (Arrange, Act, Assert)
- Use descriptive test names
- Document complex test scenarios

## See Also

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Codebase organization
- [ARCHITECTURE.md](ARCHITECTURE.md) - Design patterns and principles
