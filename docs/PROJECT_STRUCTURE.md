# Motion-Start Project Structure

## Overview

**motion-start** is a Svelte 5 port of framer-motion, providing powerful animation capabilities for Svelte applications with a runes-based reactive architecture.

## Directory Structure

```
motion-start/
├── src/
│   ├── lib/
│   │   ├── motion-start/              # Core animation library
│   │   │   ├── animation/             # Animation engine
│   │   │   │   ├── animators/         # Animation implementations (WAAPI, MainThread)
│   │   │   │   ├── generators/        # Animation generators (spring, tween, etc)
│   │   │   │   ├── hooks/             # Animation hooks and controls
│   │   │   │   ├── interfaces/        # Animation type interfaces
│   │   │   │   ├── sequence/          # Animation sequencing
│   │   │   │   ├── utils/             # Animation utilities
│   │   │   │   └── types.ts           # Core animation types
│   │   │   ├── components/            # Layout and presence components
│   │   │   │   ├── AnimatePresence/   # Exit animations and presence control
│   │   │   │   ├── LayoutGroup/       # Layout animation grouping
│   │   │   │   ├── LazyMotion/        # Feature lazy loading
│   │   │   │   ├── MotionConfig/      # Global configuration
│   │   │   │   ├── Reorder/           # Reorderable lists
│   │   │   │   └── utils/             # Component utilities
│   │   │   ├── context/               # Svelte contexts
│   │   │   │   ├── LayoutGroupContext.ts
│   │   │   │   ├── MotionContext/     # Motion context management
│   │   │   │   ├── PresenceContext.ts
│   │   │   │   └── LazyContext.ts
│   │   │   ├── easing/                # Easing functions
│   │   │   ├── events/                # Event types and utilities
│   │   │   ├── frameloop/             # Frame synchronization
│   │   │   │   ├── frame.ts
│   │   │   │   ├── sync-time.ts
│   │   │   │   └── animation-frame.ts
│   │   │   ├── gestures/              # Gesture handlers
│   │   │   │   ├── drag/              # Drag gesture system
│   │   │   │   ├── hover.ts           # Hover animations
│   │   │   │   ├── tap.ts             # Tap/click animations
│   │   │   │   └── event.ts           # Event handling
│   │   │   ├── motion/                # Motion component factory
│   │   │   │   ├── index.svelte.ts    # Motion component creation
│   │   │   │   ├── features/          # Feature plugins system
│   │   │   │   └── utils/
│   │   │   ├── projection/            # Layout projection system
│   │   │   ├── render/                # Rendering layer
│   │   │   │   ├── dom/               # DOM-specific rendering
│   │   │   │   │   ├── DOMKeyframesResolver.ts
│   │   │   │   │   └── utils/
│   │   │   │   ├── svg/               # SVG-specific rendering
│   │   │   │   ├── html/              # HTML rendering
│   │   │   │   ├── VisualElement.svelte.ts  # Core visual element
│   │   │   │   └── utils/
│   │   │   ├── utils/                 # Shared utilities
│   │   │   │   ├── mix/               # Value mixing/interpolation
│   │   │   │   ├── transform.ts       # Transform utilities
│   │   │   │   └── ...
│   │   │   ├── value/                 # MotionValue system
│   │   │   │   ├── index.ts           # MotionValue class
│   │   │   │   ├── types/             # Value type handlers
│   │   │   │   └── ...
│   │   │   ├── dom.ts                 # DOM utilities
│   │   │   ├── types.ts               # Main library types
│   │   │   └── index.ts               # Public API
│   │   ├── components/                # Example components
│   │   │   ├── motion/                # Motion feature examples
│   │   │   └── ui/                    # UI components
│   │   └── hooks/                     # Utility hooks
│   ├── routes/                        # SvelteKit routes
│   ├── app.html                       # HTML template
│   └── app.css                        # Global styles
├── cypress/                           # E2E tests
│   ├── e2e/                          # Feature tests
│   └── support/                       # Test utilities
├── .beads/                            # Beads issue tracking
├── docs/                              # Project documentation (NEW)
├── plans/                             # AI planning documents (NEW)
├── vite.config.ts                     # Vite configuration
├── svelte.config.ts                   # Svelte configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind configuration
└── package.json                       # Dependencies
```

## Core Concepts

### 1. MotionValue System

**Files**: `src/lib/motion-start/value/`

The `MotionValue` class is the foundation of motion-start:
- Tracks animated values with velocity calculation
- Supports multiple value types (number, string, color, transform)
- Subscribes/unsubscribes from animation updates
- Provides passive effects for custom value transformations

```typescript
new MotionValue(initialValue, options)
  .set(newValue)
  .get()
  .subscribe(callback)
```

### 2. Animation Engine

**Files**: `src/lib/motion-start/animation/`

Two-tier animation system:
- **WAAPI (AcceleratedAnimation)**: GPU-accelerated CSS animations via Web Animations API
- **MainThreadAnimation**: JavaScript-based animation for complex cases

Animation flow:
1. Create animation with keyframes and options
2. Resolve keyframes (handle null values, CSS variables)
3. Generate animation frames using generators
4. Update MotionValues at each frame
5. Trigger lifecycle callbacks (onStart, onComplete, etc)

### 3. VisualElement System

**Files**: `src/lib/motion-start/render/VisualElement.svelte.ts`

Wraps DOM elements with animation capabilities:
- Manages MotionValues for CSS properties
- Handles style application and updates
- Manages features (gestures, layout, animations)
- Tracks element state for projection/layout

### 4. Features System

**Files**: `src/lib/motion-start/motion/features/`

Plugin architecture for extending motion components:
- Load features dynamically (lazy loading)
- Each feature adds animation capabilities
- Features can be configured globally or per-component
- Examples: drag, gestures, layout animations

### 5. Gesture System

**Files**: `src/lib/motion-start/gestures/`

Handles user interactions:
- **Drag**: Draggable elements with constraints
- **Hover**: Animate on hover/unhover
- **Tap**: Animate on click/tap
- **Event**: Generic event handling

### 6. Rendering Layer

**Files**: `src/lib/motion-start/render/`

Separates rendering concerns:
- **DOM**: HTML element rendering
- **SVG**: SVG element rendering  
- **Utils**: Shared rendering utilities (unit conversion, CSS variables)

## Key Type Definitions

### Props Interface

```typescript
interface MotionProps {
  animate?: Transition;
  initial?: Transition;
  exit?: Transition;
  transition?: Transition;
  drag?: DragConfig;
  onDragStart?: (event, info) => void;
  onHoverStart?: () => void;
  onTapStart?: () => void;
  [key: string]: any;
}
```

### Transition Type

```typescript
type Transition = {
  type?: AnimationGeneratorType;
  duration?: number;
  delay?: number;
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
  ease?: Easing;
  [key: string]: any;
};
```

### MotionValue Generics

```typescript
class MotionValue<V = any> {
  get(): V;
  set(v: V): void;
  subscribe(callback: (v: V) => void): Unsubscriber;
  getVelocity(): number;
}
```

## Data Flow

### Animation Flow

```
User Action / animate() call
    ↓
ValueAnimationOptions prepared
    ↓
Choose animator (WAAPI or MainThread)
    ↓
Resolve keyframes (handle CSS variables, null values)
    ↓
Create KeyframeGenerator (spring, tween, etc)
    ↓
Generate animation frames
    ↓
Update MotionValue at each frame
    ↓
Apply style to element
    ↓
Trigger onComplete / callbacks
```

### Component Mount Flow

```
<motion.div>
    ↓
MotionComponent created
    ↓
Load features (drag, layout, etc)
    ↓
Create VisualElement
    ↓
Mount element with features
    ↓
Apply initial style
    ↓
Ready for animations
```

### Event Handling Flow

```
User gesture (hover, drag, tap)
    ↓
Gesture handler in feature
    ↓
Trigger event handler callback
    ↓
Update animation state
    ↓
Start new animation if needed
```

## Important Patterns

### 1. Svelte 5 Runes

- `$state()`: Mutable reactive state
- `$derived`: Computed derived state
- `$effect()`: Side effects that run when dependencies change
- `$props()`: Component property destructuring

### 2. Context Management

Contexts use Svelte's context API:
```typescript
const context = getContext<T>(key);
setContext<T>(key, value);
```

### 3. Type Guards

Used throughout for safe type narrowing:
```typescript
function isMotionValue<T>(v: unknown): v is MotionValue<T> {
  return v instanceof MotionValue;
}
```

## Performance Considerations

1. **WAAPI Acceleration**: Use for simple CSS-driven animations (transforms, opacity)
2. **Frame Syncing**: Animations synchronize via requestAnimationFrame
3. **MotionValue Subscriptions**: Minimal subscribers = better performance
4. **Lazy Features**: Only load needed features to reduce bundle size
5. **Layout Measurements**: Batched and optimized with write/read passes

## Testing Strategy

- **Unit Tests**: Individual utilities, value types, generators
- **Integration Tests**: Animation flows, feature interactions
- **E2E Tests**: User interactions, gesture responses

See `TESTING.md` for detailed test structure.
