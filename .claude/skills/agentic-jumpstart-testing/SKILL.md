---
name: agentic-jumpstart-testing
description: "Testing patterns for Svelte 5 animation libraries using Vitest and Cypress. Use when writing unit tests, E2E tests, testing animations, testing gestures, mocking APIs, or when the user mentions testing, test coverage, TDD, or debugging."
---

# Testing Patterns for motion-start

This skill provides testing guidelines for the motion-start Svelte 5 animation library.

## Test Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit testing with globals enabled |
| happy-dom | DOM environment for unit tests |
| Cypress | E2E testing |
| cypress-real-events | Realistic gesture simulation |

## Vitest Configuration

From `vite.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    typecheck: { enabled: true },
  },
});
```

## Unit Testing Patterns

### Testing Svelte 5 Components

```typescript
import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import MyComponent from './MyComponent.svelte';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(MyComponent, { props: { value: 'test' } });
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Testing Reactive State

```typescript
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';

it('updates state correctly', async () => {
  const { component } = render(Counter);

  component.increment();
  await tick(); // Wait for Svelte to update

  expect(component.count).toBe(1);
});
```

### Testing MotionValues

```typescript
import { motionValue } from 'motion-start';

describe('MotionValue', () => {
  it('tracks value changes', () => {
    const value = motionValue(0);
    const changes: number[] = [];

    value.on('change', (v) => changes.push(v));

    value.set(1);
    value.set(2);

    expect(changes).toEqual([1, 2]);
  });

  it('calculates velocity', async () => {
    const value = motionValue(0);

    value.set(100);
    await new Promise(r => setTimeout(r, 100));

    expect(value.getVelocity()).toBeGreaterThan(0);
  });
});
```

### Testing Context

```typescript
import { render } from '@testing-library/svelte';
import ContextWrapper from './test-utils/ContextWrapper.svelte';

it('provides context correctly', () => {
  render(ContextWrapper, {
    props: {
      contextValue: { isStatic: false },
      Component: ChildComponent,
    },
  });

  // Assert child received context
});
```

## Mocking Patterns

### Mocking Web Animations API

```typescript
const mockAnimate = vi.fn().mockReturnValue({
  finished: Promise.resolve(),
  cancel: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
});

beforeEach(() => {
  Element.prototype.animate = mockAnimate;
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### Mocking requestAnimationFrame

```typescript
let frameCallback: FrameRequestCallback | null = null;

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    frameCallback = cb;
    return 1;
  });
});

function advanceFrame(timestamp = 16) {
  frameCallback?.(timestamp);
}
```

### Mocking getBoundingClientRect

```typescript
beforeEach(() => {
  Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    top: 0,
    right: 100,
    bottom: 100,
    left: 0,
  });
});
```

### Mocking getComputedStyle

```typescript
vi.spyOn(window, 'getComputedStyle').mockReturnValue({
  transform: 'none',
  opacity: '1',
} as CSSStyleDeclaration);
```

## E2E Testing with Cypress

### Basic Animation Test

```typescript
// cypress/e2e/animations.cy.ts
describe('Animation', () => {
  beforeEach(() => {
    cy.visit('/animate-presence-basics');
  });

  it('animates element on mount', () => {
    cy.get('[data-testid="motion-element"]')
      .should('have.css', 'opacity', '1');
  });

  it('animates exit', () => {
    cy.get('[data-testid="toggle-button"]').click();

    // Wait for exit animation
    cy.get('[data-testid="motion-element"]')
      .should('not.exist');
  });
});
```

### Testing Gestures with cypress-real-events

```typescript
// cypress/e2e/gestures-basics.cy.ts
import 'cypress-real-events';

describe('Gestures', () => {
  it('handles drag gesture', () => {
    cy.get('[data-testid="draggable"]')
      .realMouseDown()
      .realMouseMove(100, 0)
      .realMouseUp();

    cy.get('[data-testid="draggable"]')
      .should('have.css', 'transform')
      .and('include', 'translate');
  });

  it('handles tap gesture', () => {
    cy.get('[data-testid="tappable"]')
      .realClick();

    cy.get('[data-testid="tap-count"]')
      .should('have.text', '1');
  });

  it('handles hover gesture', () => {
    cy.get('[data-testid="hoverable"]')
      .realHover();

    cy.get('[data-testid="hoverable"]')
      .should('have.class', 'hovered');
  });
});
```

### Testing Layout Animations

```typescript
describe('Layout Animations', () => {
  it('animates layout changes', () => {
    cy.visit('/layout-basics');

    // Get initial position
    cy.get('[data-testid="layout-item"]')
      .then($el => {
        const initialRect = $el[0].getBoundingClientRect();

        // Trigger layout change
        cy.get('[data-testid="toggle-layout"]').click();

        // Verify animation occurred
        cy.get('[data-testid="layout-item"]')
          .should($newEl => {
            const newRect = $newEl[0].getBoundingClientRect();
            expect(newRect.x).not.to.equal(initialRect.x);
          });
      });
  });
});
```

### Testing Reorder

```typescript
describe('Reorder', () => {
  it('reorders items via drag', () => {
    cy.visit('/reorder-basics');

    cy.get('[data-testid="item-0"]')
      .realMouseDown()
      .realMouseMove(0, 100)
      .realMouseUp();

    // Verify order changed
    cy.get('[data-testid="items"]')
      .children()
      .first()
      .should('not.have.attr', 'data-testid', 'item-0');
  });
});
```

## Animation Timing Tests

### Using Fake Timers

```typescript
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('completes animation after duration', async () => {
  const onComplete = vi.fn();

  render(AnimatedComponent, {
    props: {
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      onAnimationComplete: onComplete,
    },
  });

  vi.advanceTimersByTime(500);
  await tick();

  expect(onComplete).toHaveBeenCalled();
});
```

### Testing Animation States

```typescript
it('shows correct animation state', async () => {
  const states: string[] = [];

  render(AnimatedComponent, {
    props: {
      onAnimationStart: () => states.push('start'),
      onAnimationComplete: () => states.push('complete'),
    },
  });

  await waitFor(() => {
    expect(states).toEqual(['start', 'complete']);
  });
});
```

## Test Commands

```bash
# Run all unit tests
bun test

# Run specific test file
bun test <pattern>

# Run with UI
bun run test:ui

# Type checking tests only
bun run test:types

# Open Cypress
bun run cypress

# Run Cypress headless
npx cypress run

# Run specific E2E test
npx cypress run --spec "cypress/e2e/<name>.cy.ts"
```

## Test Organization

```
src/
├── lib/
│   └── motion-start/
│       ├── value/
│       │   ├── index.ts
│       │   └── __tests__/
│       │       └── motion-value.test.ts
│       └── animation/
│           └── __tests__/
cypress/
├── e2e/
│   ├── animate-presence-basics.cy.ts
│   ├── gestures-basics.cy.ts
│   ├── layout-basics.cy.ts
│   └── reorder-basics.cy.ts
└── support/
    ├── commands.ts
    └── e2e.ts
```

## Demo Routes for Testing

Create demo pages for E2E tests:

```
src/routes/
├── animate-presence-basics/+page.svelte
├── gestures-basics/+page.svelte
├── layout-basics/+page.svelte
└── reorder-basics/+page.svelte
```

Each demo page should have clear test hooks (data-testid attributes).

## Testing Checklist

- [ ] Unit test core utilities (MotionValue, animations)
- [ ] Mock browser APIs (WAAPI, RAF, getBoundingClientRect)
- [ ] Test context providers with wrapper components
- [ ] E2E test user interactions (gestures, clicks)
- [ ] Use cypress-real-events for gesture simulation
- [ ] Test animation start/complete callbacks
- [ ] Test accessibility (reduced motion)
- [ ] Test edge cases (unmount during animation)
- [ ] Run type checks with tests
