# Testing Strategy and Implementation Guide

## Overview

Motion-start uses a three-tier testing approach:
1. **Unit Tests**: Individual functions and utilities
2. **Integration Tests**: Component workflows and feature interactions
3. **E2E Tests**: User interactions and visual verification

## Unit Testing

### Purpose
Verify isolated functionality without side effects.

### Coverage Areas

#### 1. Value Type Handling
**Location**: `src/lib/motion-start/value/types/`

Test files:
- `color.test.ts`: Color parsing and interpolation
- `complex.test.ts`: Complex value handling (arrays, objects)
- `number.test.ts`: Number interpolation
- `transform.test.ts`: Transform value parsing

Example:
```typescript
describe('color interpolation', () => {
  it('interpolates between hex colors', () => {
    const result = interpolateColor('#FF0000', '#0000FF', 0.5);
    expect(result).toBe('#800080'); // Purple
  });
});
```

#### 2. Utilities
**Location**: Tests for `src/lib/motion-start/utils/`

Test files:
- `mix.test.ts`: Value mixing functions
- `transform.test.ts`: Transform utilities
- `easing.test.ts`: Easing function calculations

#### 3. Animation Generators
**Location**: Tests for `src/lib/motion-start/animation/generators/`

Test files:
- `spring.test.ts`: Spring physics
- `tween.test.ts`: Linear interpolation
- `keyframes.test.ts`: Keyframe generation

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
- `animation-start.test.ts`: Starting animations
- `animation-complete.test.ts`: Animation completion
- `animation-interrupt.test.ts`: Interrupting animations

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
- `feature-loading.test.ts`: Feature initialization
- `feature-composition.test.ts`: Multiple features
- `feature-cleanup.test.ts`: Feature cleanup

#### 3. Context Management
**Location**: Tests for Svelte contexts

Test files:
- `motion-context.test.ts`: Motion context
- `layout-group-context.test.ts`: Layout grouping
- `presence-context.test.ts`: Presence tracking

#### 4. VisualElement
**Location**: Tests for element handling

Test files:
- `visual-element-mount.test.ts`: Element mounting
- `visual-element-style.test.ts`: Style application
- `visual-element-feature.test.ts`: Feature integration

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
