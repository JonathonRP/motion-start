# Testing Strategy and Implementation Guide

## Overview

Motion-start uses a three-tier testing approach:
1. **Unit Tests**: Individual functions and utilities
2. **Integration Tests**: Component workflows and feature interactions
3. **E2E Tests**: User interactions and visual verification

**Naming convention**: colocate tests with source using `.spec.ts`. Use `-integration.spec.ts` for integration tests; avoid `.test.ts`.

Context: motion-start is a Svelte port of the GitHub project `motiondivision/motion` at version 11.11.11. It is not part of the upstream motion package. Where practical, reuse or adapt the upstream motion tests instead of rebuilding them from scratch.

## Philosophy: Hybrid Testing Strategy

**Goal**: Balance lightweight functionality verification with selective comprehensive coverage.

### Current State
- ✅ 88 passing tests across 10 files
- ✅ Core functionality verified (mixing, transforms, generators, easing)
- ✅ Basic edge cases and boundary conditions covered
- ✅ All tests passing in happy-dom environment

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

### Coverage Areas

#### 1. Animation Workflows
**Location**: Tests for animation flows

Test files:
- `animation-start-integration.spec.ts`: Starting animations
- `animation-complete-integration.spec.ts`: Animation completion
- `animation-interrupt-integration.spec.ts`: Interrupting animations

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

#### 2. Feature Interactions
**Location**: Tests for feature system

Test files:
- `feature-loading-integration.spec.ts`: Feature initialization
- `feature-composition-integration.spec.ts`: Multiple features
- `feature-cleanup-integration.spec.ts`: Feature cleanup

#### 3. Context Management
**Location**: Tests for Svelte contexts

Test files:
- `motion-context-integration.spec.ts`: Motion context
- `layout-group-context-integration.spec.ts`: Layout grouping
- `presence-context-integration.spec.ts`: Presence tracking

#### 4. VisualElement
**Location**: Tests for element handling

Test files:
- `visual-element-mount.spec.ts`: Element mounting
- `visual-element-style.spec.ts`: Style application
- `visual-element-feature.spec.ts`: Feature integration

## E2E Testing

### Purpose
Verify user interactions and complete user flows.

### Location
`cypress/e2e/`

### Test Categories

#### 1. Gesture Tests
**File**: `gestures.cy.ts`

```typescript
describe('Drag Gesture', () => {
  it('should drag element to position', () => {
    cy.visit('/drag-example');
    cy.get('[data-testid="draggable"]')
      .trigger('mousedown', { buttons: 1 })
      .trigger('mousemove', { clientX: 100, clientY: 100 })
      .trigger('mouseup');
    
    cy.get('[data-testid="draggable"]')
      .should('have.css', 'transform', /translate/);
  });
});
```

#### 2. Animation Tests
**File**: `animations.cy.ts`

```typescript
describe('Animation Execution', () => {
  it('should animate opacity from 0 to 1', () => {
    cy.visit('/opacity-animation');
    cy.get('[data-testid="animated"]')
      .should('have.css', 'opacity', '0');
    
    cy.get('[data-testid="trigger"]').click();
    
    cy.get('[data-testid="animated"]')
      .should('have.css', 'opacity', '1');
  });
});
```

#### 3. Presence Tests
**File**: `presence.cy.ts`

```typescript
describe('AnimatePresence', () => {
  it('should animate exit before removing element', () => {
    cy.visit('/presence-example');
    cy.get('[data-testid="item"]').should('be.visible');
    
    cy.get('[data-testid="remove"]').click();
    
    cy.get('[data-testid="item"]')
      .should('have.css', 'opacity', '0');
    
    cy.get('[data-testid="item"]').should('not.exist');
  });
});
```

#### 4. Interaction Tests
**File**: `interactions.cy.ts`

```typescript
describe('Hover Animations', () => {
  it('should trigger on hover', () => {
    cy.visit('/hover-example');
    cy.get('[data-testid="hoverable"]')
      .trigger('mouseenter')
      .should('have.css', 'transform', /scale/);
  });
});
```

## Test Data and Fixtures

### Mock Data
**Location**: `cypress/fixtures/`

```json
{
  "animationOptions": {
    "duration": 500,
    "delay": 0,
    "ease": "easeInOut"
  },
  "dragOptions": {
    "constraints": { "left": 0, "right": 100 }
  }
}
```

### Test Utilities
**Location**: `cypress/support/`

```typescript
// Custom commands
cy.animateTo(element, target, duration);
cy.dragElement(element, x, y);
cy.waitForAnimation(element);
```

## Test Execution

### Unit Tests
```bash
npm run test:unit
# or
vitest
```

### Integration Tests
```bash
npm run test:integration
# or
vitest --config vitest.integration.config.ts
```

### E2E Tests
```bash
npm run test:e2e
# or
cypress open
```

### All Tests
```bash
npm run test
```

## Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Unit | 80%+ | TBD |
| Integration | 70%+ | TBD |
| Critical Paths E2E | 100% | TBD |

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

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm run test
      - run: pnpm run test:e2e
      - uses: codecov/codecov-action@v3
```

## See Also

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Codebase organization
- [ARCHITECTURE.md](ARCHITECTURE.md) - Design patterns and principles
