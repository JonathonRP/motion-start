# Browser Tests for motion-start

This directory contains browser-based tests using Vitest browser mode, compatible with the testing approach used in motiondivision/motion v11.11.11's Cypress tests.

## Overview

These tests run in a real browser environment (Chromium via Playwright) to accurately test:
- DOM interactions
- Animation behaviors
- Gesture recognition
- Layout calculations
- Visual changes

## Test Files

### `animate.browser.test.ts`
Tests core animation functionality:
- Basic animations (opacity, position)
- Spring physics animations
- Keyframe animations
- Animation timing and completion

### `gestures.browser.test.ts`
Tests gesture interactions:
- **Tap**: Click detection, pointer events
- **Hover**: Enter/leave detection
- **Focus**: Focus/blur events
- **Drag**: Pointer tracking and movement

### `animate-presence.browser.test.ts`
Tests enter/exit animations:
- Mount animations
- Unmount animations
- Multiple element transitions
- Staggered animations
- Animation timing synchronization

### `layout.browser.test.ts`
Tests layout animations:
- Layout change animations
- Position transitions
- Shared layout transitions
- Aspect ratio preservation
- Layout groups and reordering
- Border radius animations

### `drag.browser.test.ts`
Tests drag functionality:
- Basic dragging
- Drag constraints
- Momentum/velocity tracking
- Axis locking (x-only, y-only)

## Running Tests

**Important:** Browser tests require Playwright to be installed and configured:

```bash
# Install Playwright browsers (first time only)
bunx playwright install chromium
```

### Run browser tests
```bash
# Using the dedicated npm script
bun run test:browser

# Or manually with environment variable
VITEST_BROWSER=true bun test

# Watch mode
VITEST_BROWSER=true bun test --watch
```

### Run with UI
```bash
bun run test:browser:ui
```

### Run specific test file
```bash
VITEST_BROWSER=true bun test animate.browser.test.ts
```

### Run regular tests (excludes browser tests)
```bash
# This runs only type tests, not browser tests
bun test
```

## Configuration

Browser testing is configured in `vite.config.ts`:

```typescript
test: {
  browser: {
    enabled: true,
    name: 'chromium',
    provider: 'playwright',
    headless: true,
  }
}
```

## Test Approach

These tests are designed to be similar to framer-motion's Cypress tests but using Vitest browser mode:

1. **Direct DOM Manipulation**: Tests create and manipulate DOM elements directly
2. **Real Browser Context**: Tests run in actual Chromium browser
3. **Animation Timing**: Tests use `setTimeout` and `requestAnimationFrame` for timing
4. **Event Simulation**: Tests dispatch real browser events

## Differences from Cypress

| Cypress | Vitest Browser Mode |
|---------|-------------------|
| `cy.get()` | `document.querySelector()` |
| `cy.click()` | `element.click()` or `element.dispatchEvent()` |
| `cy.trigger()` | `element.dispatchEvent()` |
| `cy.wait()` | `await new Promise(resolve => setTimeout(resolve, ms))` |
| `cy.should()` | `expect()` |

## Notes on `getContext()` in Svelte 5

The user correctly noted that `getContext()` **does work** when called from functions in component script tags. Our earlier analysis was overly conservative - functions that call `getContext()` are fine as long as they're invoked during component initialization or within the component's reactive scope.

For example:
```svelte
<script>
  function useLayoutIdFromContext() {
    const layoutGroupId = getContext(LayoutGroupContext);
    return computed => layoutGroupId + '-' + computed;
  }

  // This works because it's called in component scope
  const getFullLayoutId = useLayoutIdFromContext();
</script>
```

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Test with real motion-start components (not just DOM)
- [ ] Add performance benchmarks
- [ ] Test cross-browser compatibility (Firefox, Safari)
- [ ] Add accessibility tests (reduced motion)

## References

- [Vitest Browser Mode Docs](https://vitest.dev/guide/browser.html)
- [Playwright Docs](https://playwright.dev/)
- [motiondivision/motion Cypress Tests](https://github.com/motiondivision/motion/tree/main/packages/framer-motion/cypress)
- [Framer Motion v11.11.11 Changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)
