# Implementation Plan: Element Attachment Refactor

## Overview

Refactor useVisualElement and useRenderer to support non-action element handling for better composability and lifecycle control.

**Goal**: Allow VisualElement attachment directly to elements without Svelte action pattern, enabling better element lifecycle management and feature composition.

## Current State

### Current Approach (Actions)
```svelte
<motion.div use:motionAction={{...props}}>
  Content
</motion.div>
```

### Limitation
- Action pattern limits composition
- Element lifecycle hidden
- Difficult to coordinate multiple features
- Hard to manage cleanup

### What Works
- Svelte 5 action directive
- VisualElement creation
- Basic animation rendering

## Proposed Solution

### Architecture: Direct Element Attachment

```
VisualElement (Svelte 5 rune-based)
    ↓ manages
Element
    ↓ has
Features
    ↓ manage
Subscriptions & Cleanup
```

## Implementation Plan

### Phase 1: Create Element Manager

**New File**: `src/lib/motion-start/render/element-manager.ts`

```typescript
import { type Box } from '../dom';

export interface ElementManager {
  element: HTMLElement | SVGElement;
  attach(element: HTMLElement | SVGElement): void;
  detach(): void;
  measure(): Box;
  setBoundingBox(box: Box): void;
  setupCleanup(cleanup: () => void): void;
}

export function createElementManager(): ElementManager {
  let element: HTMLElement | SVGElement | null = null;
  const cleanupFunctions: Set<() => void> = new Set();

  return {
    get element() {
      if (!element) throw new Error('Element not attached');
      return element;
    },

    attach(el) {
      element = el;
    },

    detach() {
      cleanupFunctions.forEach((fn) => fn());
      cleanupFunctions.clear();
      element = null;
    },

    measure() {
      return element?.getBoundingClientRect() ?? {};
    },

    setBoundingBox(box) {
      if (!element) return;
      Object.assign(element.style, {
        left: box.x + 'px',
        top: box.y + 'px',
        width: box.width + 'px',
        height: box.height + 'px',
      });
    },

    setupCleanup(fn) {
      cleanupFunctions.add(fn);
    },
  };
}
```

### Phase 2: Refactor VisualElement

**Modified**: `src/lib/motion-start/render/visual-element.ts`

```typescript
import { writable, derived, type Readable, type Writable } from 'svelte/store';
import type { ElementManager } from './element-manager';

export interface VisualElementConfig {
  element: HTMLElement | SVGElement;
  props: MotionProps;
  features?: Feature[];
}

export class VisualElement {
  #elementManager: ElementManager;
  #isVisible = writable(true);
  #animationState = writable<'idle' | 'animating'>('idle');
  #features: Feature[] = [];

  // Derived state
  isActive: Readable<boolean>;

  constructor(config: VisualElementConfig) {
    this.#elementManager = createElementManager();
    this.#elementManager.attach(config.element);
    this.#features = config.features ?? [];

    this.isActive = derived(
      [this.#isVisible, this.#animationState],
      ([$visible, $state]) => $visible && $state === 'animating'
    );

    this.setupFeatures(config.props);
  }

  private setupFeatures(props: MotionProps) {
    this.#features.forEach((feature) => {
      const cleanup = feature.setup?.(this.#elementManager.element, props);
      if (cleanup) {
        this.#elementManager.setupCleanup(cleanup);
      }
    });
  }

  get element() {
    return this.#elementManager.element;
  }

  setVisible(visible: boolean) {
    this.#isVisible.set(visible);
  }

  setAnimating(animating: boolean) {
    this.#animationState.set(animating ? 'animating' : 'idle');
  }

  measure() {
    return this.#elementManager.measure();
  }

  destroy() {
    this.#elementManager.detach();
  }
}
```

### Phase 3: Create Element Binding

**New File**: `src/lib/motion-start/render/element-binding.svelte.ts`

```typescript
import { VisualElement } from './visual-element';
import { getContext } from 'svelte';
import type { MotionProps } from '../types';

export function bindElement(
  element: HTMLElement | SVGElement,
  props: MotionProps
): VisualElement {
  const config = getContext('motionConfig') ?? {};
  const features = getContext('features') ?? [];

  const visualElement = new VisualElement({
    element,
    props,
    features,
  });

  return visualElement;
}

export function useElement(element: HTMLElement | SVGElement, props: MotionProps) {
  const visualElement = bindElement(element, props);

  return {
    visualElement,
    destroy() {
      visualElement.destroy();
    },
  };
}
```

### Phase 4: Update Motion Components

**Modified**: `src/lib/motion-start/motion/index.svelte.ts`

Convert from action-based to element-binding approach:

```typescript
import { useElement } from '../render/element-binding.svelte';
import type { MotionProps } from '../types';

export function createMotionComponent(tag: string) {
  return function MotionComponent(props: MotionProps) {
    let element: HTMLElement | SVGElement;
    let visualElement: VisualElement;

    return {
      get element() {
        return element;
      },

      mount(el: HTMLElement | SVGElement) {
        element = el;
        const { visualElement: ve } = useElement(element, props);
        visualElement = ve;
      },

      unmount() {
        visualElement?.destroy();
      },

      update(newProps: Partial<MotionProps>) {
        Object.assign(props, newProps);
      },
    };
  };
}

// Usage in .svelte file:
// <script>
//   import { motion } from 'motion-start';
//   let divElement;
//   
//   onMount(() => {
//     divElement.motionElement = motion.div({ ... });
//     divElement.motionElement.mount(divElement);
//   });
//   
//   onDestroy(() => {
//     divElement.motionElement.unmount();
//   });
// </script>
//
// <div bind:this={divElement} />
```

### Phase 5: Create Lifecycle Hooks

**New File**: `src/lib/motion-start/hooks/use-visual-element.svelte.ts`

```typescript
import { onMount, onDestroy } from 'svelte';
import { VisualElement } from '../render/visual-element';
import { useElement } from '../render/element-binding.svelte';

export function useVisualElement(props: MotionProps) {
  let element: HTMLElement | SVGElement;
  let visualElement: VisualElement;

  onMount(() => {
    if (!element) {
      throw new Error('Element must be set before mount');
    }
    const { visualElement: ve } = useElement(element, props);
    visualElement = ve;
  });

  onDestroy(() => {
    visualElement?.destroy();
  });

  return {
    setElement(el: HTMLElement | SVGElement) {
      element = el;
    },
    get visualElement() {
      return visualElement;
    },
  };
}
```

## Integration with Other Tasks

### Depends On
- Task 1: Gesture Refactor (optional, features pattern)
- Task 2: Event Handlers (optional, handler integration)
- Task 3: Reactive Contexts (recommended, for state management)

### Enables
- Cleaner component composition
- Better lifecycle management
- Feature extensibility

## Implementation Steps

### Step 1: Create Element Manager (2-3 hours)
- Implement ElementManager interface
- Handle attachment/detachment
- Implement cleanup registry

### Step 2: Refactor VisualElement (4-5 hours)
- Convert to class-based API
- Add state management (visibility, animation)
- Implement feature setup
- Add measurement capabilities

### Step 3: Create Element Binding (2-3 hours)
- Implement bindElement function
- Implement useElement hook
- Wire context retrieval

### Step 4: Update Motion Components (3-4 hours)
- Create createMotionComponent factory
- Update motion.div, motion.button, etc.
- Test basic rendering
- Update type definitions

### Step 5: Create Lifecycle Hooks (2-3 hours)
- Implement useVisualElement hook
- Add onMount/onDestroy handling
- Document usage patterns

### Step 6: Testing (8-10 hours)
- Unit tests for element manager
- Integration tests for VisualElement
- E2E tests for component lifecycle
- Test cleanup and memory management

**Total Estimated Time**: 21-28 hours

## Files to Create/Modify

### Create
```
src/lib/motion-start/render/
  ├── element-manager.ts         (new)
  └── element-binding.svelte.ts  (new)

src/lib/motion-start/hooks/
  └── use-visual-element.svelte.ts (new)
```

### Modify
```
src/lib/motion-start/
  ├── types.ts                   (ElementManager, VisualElement types)
  ├── render/
  │   └── visual-element.ts      (class-based refactor)
  ├── motion/
  │   ├── index.svelte.ts        (use element binding)
  │   └── features/              (update feature interface)
  └── components/                (update component examples)
```

## Migration Strategy

### Phase 1: Introduce New APIs (non-breaking)
- Add ElementManager, useElement alongside existing actions
- Keep actions working
- Deprecate actions

### Phase 2: Migrate Internals
- Update motion components to use new APIs
- Update examples
- Update documentation

### Phase 3: Deprecation Cycle
- Keep actions for backward compatibility
- Add deprecation warnings
- Document migration path

## Success Criteria

1. ✅ VisualElement works without actions
2. ✅ Element lifecycle properly managed
3. ✅ Cleanup functions execute reliably
4. ✅ No memory leaks
5. ✅ Features compose properly
6. ✅ Type-safe API
7. ✅ Backward compatible during migration

## Testing Strategy

### Unit Tests (15 tests)
```
element-manager.ts (6)
  - Attach/detach
  - Measure
  - Cleanup execution
  - Multiple cleanups

visual-element.ts (6)
  - Creation
  - Feature setup
  - Visibility tracking
  - Animation state
  - Derived state

element-binding.ts (3)
  - bindElement
  - useElement
  - Context integration
```

### Integration Tests (12 tests)
```
Full lifecycle (4)
  - Mount → update → unmount
  - Feature setup/teardown
  - Multiple features
  - Context propagation

Element + Features (4)
  - Drag feature
  - Hover feature
  - Multiple features
  - Feature cleanup

Component hierarchy (4)
  - Parent → child
  - Multiple levels
  - Context inheritance
```

### E2E Tests (8 tests)
```
Basic animation
Gesture interaction
Feature interaction
Rapid mount/unmount
```

## Risk Mitigation

**Risk**: Breaking existing action-based components
**Mitigation**: Maintain action APIs during transition, provide migration guide

**Risk**: Complex element lifecycle edge cases
**Mitigation**: Comprehensive lifecycle tests, use Svelte lifecycle conventions

**Risk**: Performance regression from class-based approach
**Mitigation**: Profile rendering performance, optimize store subscriptions

## Timeline

- Previous Tasks: ~20-30 days (can parallelize)
- This Task: ~3-4 days
- **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 (optimal sequence)
- **Can Parallelize**: Task 2, Task 3 with Task 1

## Related Tasks

- Task 1: Gesture Refactor (optional dependency)
- Task 2: Event Handlers (optional dependency)
- Task 3: Reactive Contexts (recommended dependency)

## References

- [PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) - Render system
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Design patterns
- [TESTING.md](../docs/TESTING.md) - Testing approach
- [GESTURE_REFACTOR.md](GESTURE_REFACTOR.md) - Feature system
- [EVENT_HANDLERS.md](EVENT_HANDLERS.md) - Handler integration
- [REACTIVE_CONTEXTS.md](REACTIVE_CONTEXTS.md) - State management
