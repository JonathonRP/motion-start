---
name: agentic-jumpstart-architecture
description: "Architecture patterns for Svelte 5 animation libraries based on framer-motion. Use when understanding codebase structure, adding features, working with VisualElement, MotionValue, context patterns, or when the user asks about architecture, design patterns, or code organization."
---

# Architecture of motion-start

This skill documents the architecture of motion-start, a Svelte 5 animation library inspired by framer-motion.

## Directory Structure

```
src/lib/motion-start/
├── animation/           # Animation engine
│   ├── animators/       # WAAPI and main thread animators
│   ├── generators/      # Spring, keyframe generators
│   ├── hooks/           # useAnimate, useAnimation
│   ├── interfaces/      # Visual element animation
│   └── sequence/        # Animation sequencing
├── components/          # High-level components
│   ├── AnimatePresence/ # Exit animations
│   ├── LayoutGroup/     # Layout animation grouping
│   ├── LazyMotion/      # Code splitting
│   ├── MotionConfig/    # Global configuration
│   └── Reorder/         # Drag-to-reorder
├── context/             # Svelte 5 context system
├── events/              # DOM event handling
├── frameloop/           # requestAnimationFrame management
├── gestures/            # Pan, tap, hover, drag handlers
│   ├── drag/
│   ├── pan/
│   └── ...
├── motion/              # Core Motion component
│   ├── features/        # Animation, layout, gestures
│   └── utils/           # Visual state, refs
├── projection/          # FLIP layout animations
│   ├── geometry/
│   ├── node/
│   └── styles/
├── render/              # Rendering abstraction
│   ├── components/      # motion/m proxies
│   ├── dom/             # DOM-specific rendering
│   ├── html/            # HTML element rendering
│   └── svg/             # SVG element rendering
├── types/               # Shared type definitions
├── utils/               # Utility functions
└── value/               # MotionValue system
    ├── scroll/
    ├── types/
    └── use-will-change/
```

## Core Abstractions

### VisualElement

The central abstraction managing animations outside Svelte's render cycle:

```typescript
// render/VisualElement.svelte.ts
abstract class VisualElement<Instance, RenderState, Options> {
  // Element reference
  current: Instance | null;

  // Animation state
  latestValues: ResolvedValues;
  animationState?: AnimationState;

  // Parent-child hierarchy
  parent?: VisualElement;
  children: Set<VisualElement>;

  // Layout projection
  projection?: IProjectionNode;

  // Core methods
  abstract type: string;
  abstract measureInstanceViewportBox(instance, props): Box;
  abstract readValueFromInstance(instance, key, options): string | number;

  // Lifecycle
  mount(element: Instance): void;
  unmount(): void;
  update(props, presenceContext): void;
}
```

### MotionValue

Reactive values for animations, operating outside Svelte's reactivity:

```typescript
// value/index.ts
class MotionValue<T> {
  private current: T;
  private prev: T;

  // Subscribe to changes
  on(event: 'change' | 'velocityChange', callback): () => void;

  // Get/set
  get(): T;
  set(value: T, render?: boolean): void;

  // Animation
  getVelocity(): number;
  stop(): void;
}
```

### Feature System

Features are loaded dynamically for tree-shaking:

```typescript
// motion/features/types.ts
interface FeatureDefinitions {
  animation?: Feature<unknown>;
  exit?: Feature<unknown>;
  drag?: Feature<unknown>;
  tap?: Feature<unknown>;
  focus?: Feature<unknown>;
  hover?: Feature<unknown>;
  pan?: Feature<unknown>;
  inView?: Feature<unknown>;
  layout?: Feature<unknown>;
}

// Feature base class
abstract class Feature<I> {
  node: VisualElement<I>;

  abstract mount(): void;
  abstract unmount(): void;
  update(): void {}
}
```

### Feature Bundles

```typescript
// Minimal bundle
export const domMin: FeatureBundle = {
  renderer: createDomVisualElement,
};

// Animation features
export const domAnimation: FeatureBundle = {
  ...domMin,
  animation: AnimationFeature,
  exit: ExitFeature,
};

// Full bundle
export const domMax: FeatureBundle = {
  ...domAnimation,
  drag: DragFeature,
  gesture: GestureFeature,
  layout: LayoutFeature,
};
```

## Component Factory

### Motion Component Creation

```typescript
// motion/index.svelte.ts
export const createRendererMotionComponent = <Props, Instance, RenderState>({
  preloadedFeatures,
  createVisualElement,
  useRender,
  useVisualState,
  Component,
}: MotionComponentConfig) => {
  preloadedFeatures && loadFeatures(preloadedFeatures);

  // Returns a Svelte component
  const MotionComponent: Component<MotionProps> = (anchor, props) => {
    // Component implementation using Motion.svelte
  };

  return MotionComponent;
};
```

### Proxy Pattern

```typescript
// render/components/motion/proxy.ts
import { createDOMMotionComponentProxy } from '../create-proxy';

export const motion = createDOMMotionComponentProxy(createMotionComponent);

// Usage: motion.div, motion.button, motion.svg
```

## Context System

### Pattern: MutableRefObject

The library uses a React-like ref pattern for context:

```typescript
// utils/safe-react-types.ts
interface MutableRefObject<T> {
  current: T;
}

// context/PresenceContext.svelte.ts
const [getPresenceContext, setPresenceContext] =
  createContext<MutableRefObject<PresenceContext | null>>();

function usePresenceContext() {
  try {
    return getPresenceContext();
  } catch {
    return setPresenceContext({ current: null });
  }
}
```

### Context Types

| Context | Purpose |
|---------|---------|
| MotionContext | Parent VisualElement reference |
| PresenceContext | AnimatePresence state |
| MotionConfigContext | Global animation config |
| LayoutGroupContext | Layout animation grouping |
| LazyContext | Lazy-loaded renderer |
| ReorderContext | Reorder group state |
| SwitchLayoutGroupContext | Layout ID coordination |

## Rendering Pipeline

### 1. Props Processing

```typescript
// render/html/use-props.svelte.ts
function useHTMLProps(props, visualState, isStatic, ref) {
  // Filter motion props from DOM props
  // Build style object
  // Return clean HTML props
}
```

### 2. Visual State

```typescript
// motion/utils/use-visual-state.svelte.ts
interface VisualState<Instance, RenderState> {
  renderState: RenderState;
  latestValues: ResolvedValues;
  mount?: (instance: Instance) => void;
}
```

### 3. DOM Rendering

```typescript
// render/dom/UseRender.svelte
// Applies computed styles and transforms to DOM element
<svelte:element
  this={Component}
  bind:this={ref}
  {...visualProps}
  style={styleAttr}
/>
```

## Projection System (FLIP)

### Layout Animation Flow

1. **Measure**: Record element positions before layout change
2. **Layout**: Apply new layout
3. **Invert**: Calculate transforms to return to old position
4. **Play**: Animate transforms to identity

```typescript
// projection/node/create-projection-node.svelte.ts
interface IProjectionNode {
  // Measurement
  measure(): Box;
  layout?: Box;
  targetLayout?: Box;

  // Transform calculation
  calcProjection(): void;

  // Animation
  animationProgress: number;
  setAnimationOrigin(delta: Delta): void;
}
```

## Frame Loop

### Microtask and Frame Scheduling

```typescript
// frameloop/index.ts
export const frame = {
  read: createRenderStep(scheduleNextFrame),
  update: createRenderStep(scheduleNextFrame),
  preRender: createRenderStep(scheduleNextFrame),
  render: createRenderStep(scheduleNextFrame),
  postRender: createRenderStep(scheduleNextFrame),
};

// Schedule work
frame.render(() => visualElement.render());
```

### Render Step Pattern

```typescript
// frameloop/render-step.ts
function createRenderStep(runNextFrame: () => void): Step {
  let thisFrame = new Set<Process>();
  let nextFrame = new Set<Process>();

  return {
    schedule: (callback, keepAlive, immediate) => {
      const queue = immediate && isProcessing ? thisFrame : nextFrame;
      queue.add(callback);
      return callback;
    },
    cancel: (callback) => nextFrame.delete(callback),
    process: (frameData) => {
      // Swap buffers and execute
    },
  };
}
```

## Animation System

### Animation Types

```typescript
// animation/types.ts
type AnimationType = 'animate' | 'exit' | 'hover' | 'tap' | 'focus' | 'drag';

interface Transition {
  type?: 'spring' | 'tween' | 'keyframes' | 'inertia';
  duration?: number;
  delay?: number;
  ease?: Easing;
  // Spring-specific
  stiffness?: number;
  damping?: number;
  mass?: number;
}
```

### Animation Pipeline

```typescript
// animation/interfaces/visual-element.ts
export function animateVisualElement(
  visualElement: VisualElement,
  definition: AnimationDefinition,
  options?: AnimationOptions
): Promise<void> {
  // Resolve variants
  // Create animations for each value
  // Return promise that resolves when all complete
}
```

## Key Design Decisions

### 1. Imperative Animation Core

Animations run outside Svelte's reactive system for performance:

```typescript
// VisualElement manages animations imperatively
visualElement.animationState?.animateChanges();
```

### 2. Prop Functions Pattern

Props are passed as functions to defer evaluation:

```typescript
function useVisualElement(
  Component: string,
  visualState: () => VisualState,  // Function
  props: () => MotionProps,        // Function
  ...
) {
  // Access via props() when needed
}
```

### 3. WeakMap for Element Storage

Prevents memory leaks when elements are removed:

```typescript
export const visualElementStore = new WeakMap<any, VisualElement>();
```

### 4. Double-Buffered Frame Queue

Avoids garbage collection during animations:

```typescript
let thisFrame = new Set<Process>();
let nextFrame = new Set<Process>();
[thisFrame, nextFrame] = [nextFrame, thisFrame];
```

## Adding New Features

### 1. Create Feature Class

```typescript
// motion/features/my-feature.ts
class MyFeature extends Feature<HTMLElement> {
  mount() {
    // Setup when element mounts
  }

  unmount() {
    // Cleanup when element unmounts
  }

  update() {
    // Handle prop changes
  }
}
```

### 2. Register Feature

```typescript
// motion/features/definitions.ts
export const featureDefinitions: FeatureDefinitions = {
  // ...existing
  myFeature: {
    isEnabled: (props) => Boolean(props.myProp),
    Feature: MyFeature,
  },
};
```

### 3. Add to Bundle

```typescript
// render/dom/features-animation.ts
export const domAnimation: FeatureBundle = {
  // ...existing
  myFeature: MyFeature,
};
```
