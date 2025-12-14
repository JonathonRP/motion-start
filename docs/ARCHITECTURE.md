# Architecture and Design Patterns

## Core Architecture Principles

### 1. Separation of Concerns

The codebase is organized in clean layers:

| Layer | Responsibility | Key Files |
|-------|-----------------|-----------|
| **Value Layer** | Reactive value tracking and interpolation | `value/`, `utils/mix/` |
| **Animation Layer** | Animation generation and execution | `animation/` |
| **Rendering Layer** | Element styling and DOM updates | `render/` |
| **Component Layer** | High-level motion components | `motion/`, `components/` |
| **Feature Layer** | Plugin-based extensions | `motion/features/` |
| **Gesture Layer** | User interaction handling | `gestures/` |

### 2. Type Safety Strategy

**Current Status**: 0 TypeScript errors, type-safe implementation

Patterns used:
- **Type Guards**: Validate types at runtime boundaries
- **Discriminated Unions**: Use literal types for exhaustive matching
- **Generic Constraints**: Proper type parameter bounds
- **Readonly Types**: Prevent accidental mutations

Example:
```typescript
function isMotionValue<T>(v: unknown): v is MotionValue<T> {
  return (
    typeof v === 'object' &&
    v !== null &&
    'owner' in v &&
    typeof (v as any).get === 'function'
  );
}
```

### 3. Reactivity Model

Svelte 5 runes-based reactive system:

```typescript
// Mutable state
let count = $state(0);

// Derived state
let doubled = $derived(count * 2);

// Side effects
$effect(() => {
  console.log(`Count changed to ${count}`);
});
```

## Design Patterns

### Pattern 1: Feature Plugin System

**Location**: `src/lib/motion-start/motion/features/`

Features extend motion components with specific capabilities:

```typescript
interface Feature {
  getDefaultOptions?: () => FeatureOptions;
  onRender?: (context) => void;
  onAnimationComplete?: (context) => void;
}
```

**Benefit**: Modular, lazy-loadable, composable

**Examples**: 
- Drag feature adds dragging capability
- Gesture feature adds hover/tap handlers
- Layout feature adds layout animations

### Pattern 2: MotionValue as State Container

**Location**: `src/lib/motion-start/value/index.ts`

MotionValue acts as a mini state management system:
- Wraps any value (number, string, color, transform)
- Subscribers notified of changes
- Velocity tracking for physics-based animations
- Passive effects for value transformations

### Pattern 3: VisualElement as Element Wrapper

**Location**: `src/lib/motion-start/render/VisualElement.svelte.ts`

VisualElement wraps DOM elements to add animation capabilities:
- Manages MotionValues for CSS properties
- Applies styles via direct DOM manipulation
- Handles feature lifecycle
- Tracks projection/layout state

### Pattern 4: Two-Tier Animation System

**Locations**: 
- `src/lib/motion-start/animation/animators/AcceleratedAnimation.ts`
- `src/lib/motion-start/animation/animators/MainThreadAnimation.ts`

Choose animator based on capabilities:

```
┌─ Can use WAAPI? ─────────────────┐
│  (GPU acceleration available)     │
│                                   │
├─ Yes ──→ AcceleratedAnimation    │
│          (WAAPI + GPU)            │
│                                   │
└─ No  ──→ MainThreadAnimation     │
           (JavaScript + CPU)       │
```

### Pattern 5: Context for Global State

**Location**: `src/lib/motion-start/context/`

Use Svelte contexts for component tree communication:

```typescript
const context = getContext<MotionContext>(MOTION_CONTEXT);
if (context) {
  // Use context values
}
```

## Component Architecture

### Motion Component Creation

```typescript
// motion.div is created by factory function
const motion = createMotionComponent('div');

// Returns a Svelte component with:
// - Props handling via $props()
// - Feature loading
// - VisualElement creation
// - Animation setup
```

### Feature Loading Flow

```
Component mount
    ↓
Load features (lazy if configured)
    ↓
Create VisualElement
    ↓
Initialize each feature
    ↓
Setup event handlers
    ↓
Apply initial values
    ↓
Ready for animations
```

## Data Flow Architecture

### Animation Data Flow

```
Props (animate, transition)
    ↓
Parse animation config
    ↓
Create MotionValue for each property
    ↓
Start animation (WAAPI or MainThread)
    ↓
Generate keyframes
    ↓
Update MotionValue at each frame
    ↓
Subscribe to MotionValue updates
    ↓
Apply styles to DOM
```

### Event Data Flow

```
User gesture (drag, hover, tap)
    ↓
Event handler in feature
    ↓
Extract interaction info
    ↓
Call onDragStart/onHoverStart/etc
    ↓
Update component props
    ↓
Trigger new animation
```

## Testing Architecture

### Three-Layer Testing

**Unit Tests**:
- Individual utilities (mix, transform, easing)
- Value type handling
- Animation generators

**Integration Tests**:
- Animation workflows
- Feature interactions
- Value subscription chains

**E2E Tests**:
- User gestures
- Visual verification
- Component interactions

## Performance Optimizations

### 1. WAAPI Acceleration

Offload to GPU when possible:
```typescript
if (AcceleratedAnimation.supports(options)) {
  return new AcceleratedAnimation(options);
}
```

### 2. Frame Synchronization

All animations sync to single RAF:
```typescript
export const frame = {
  update(callback: (time: number) => void) {
    scheduleCallback(callback);
  }
};
```

### 3. Lazy Feature Loading

Load features only when needed:
```typescript
const features = await loadFeatures(['drag', 'layout']);
```

### 4. Value Subscription Management

Minimal subscriptions = better performance:
```typescript
const unsubscribe = motionValue.subscribe(updateStyle);
// Later...
unsubscribe(); // Clean up
```

## Future Architecture Considerations

1. **Events as First-Class Citizens**: Make event handling more reactive
2. **Reactive Contexts**: Context values that update reactively
3. **Gesture as Features**: Unify gesture handling into feature system
4. **Element Attachment**: Support non-action element handling

See `plans/` directory for detailed implementation plans.
