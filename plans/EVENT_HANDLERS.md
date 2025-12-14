# Implementation Plan: Gesture Event Handlers in UseRenderer

## Overview

Enable gesture event handlers to work as standard element event handlers in the rendering layer.

**Goal**: Allow `onDragStart`, `onHoverStart`, etc. to work seamlessly with standard DOM event handling.

## Current State

### Current Limitation
- Event handlers defined but not fully integrated with rendering
- Gesture detection happens in features, not accessible as element props
- No unified path for event handler execution

### What Works
- Feature-based gesture detection
- Animation triggering on gestures
- Basic drag/hover functionality

### What Needs Work
- Event handler props not wired to rendering
- No standard way to attach gesture handlers
- Manual feature loading required

## Proposed Solution

### Architecture: Event Handler Bridge

```
User Code (onDragStart prop)
    ↓
Motion Component Props
    ↓
UseRenderer (rendering layer)
    ↓
Gesture Detectors (from Phase 1)
    ↓
Feature System
    ↓
Animation Triggers
```

## Implementation Plan

### Phase 1: Create Event Handler Store

**New File**: `src/lib/motion-start/render/event-handlers.ts`

```typescript
export interface EventHandlerStore {
  onDragStart?: (e: DragEvent, info: DragInfo) => void;
  onDrag?: (e: DragEvent, info: DragInfo) => void;
  onDragEnd?: (e: DragEvent, info: DragInfo) => void;
  onHoverStart?: (e: MouseEvent) => void;
  onHoverEnd?: (e: MouseEvent) => void;
  onTapStart?: (e: PointerEvent) => void;
  onTapEnd?: (e: PointerEvent) => void;
  [key: string]: any;
}

export function createEventHandlerStore(): Writable<EventHandlerStore> {
  return writable({});
}
```

### Phase 2: Update UseRenderer

**Modified**: `src/lib/motion-start/render/dom/use-renderer.svelte.ts`

```typescript
export function useRenderer(element: HTMLElement, props: MotionProps) {
  const handlers = createEventHandlerStore();
  
  // Extract gesture handlers from props
  const gestureHandlers = {
    onDragStart: props.onDragStart,
    onDrag: props.onDrag,
    onDragEnd: props.onDragEnd,
    onHoverStart: props.onHoverStart,
    onHoverEnd: props.onHoverEnd,
    onTapStart: props.onTapStart,
    onTapEnd: props.onTapEnd,
  };
  
  // Store handlers
  handlers.set(gestureHandlers);
  
  // Setup gesture detectors with handler bridge
  setupGestureDetectors(element, handlers);
  
  return {
    update(newProps) { /* ... */ },
    destroy() { /* ... */ }
  };
}
```

### Phase 3: Create Handler Bridge

**New File**: `src/lib/motion-start/render/handler-bridge.ts`

```typescript
export function createHandlerBridge(
  store: Readable<EventHandlerStore>
) {
  return {
    onGestureStart(type: string, event: Event, info: any) {
      const handler = get(store)[`on${capitalize(type)}Start`];
      handler?.(event, info);
    },
    
    onGestureMove(type: string, event: Event, info: any) {
      const handler = get(store)[`on${capitalize(type)}`];
      handler?.(event, info);
    },
    
    onGestureEnd(type: string, event: Event, info: any) {
      const handler = get(store)[`on${capitalize(type)}End`];
      handler?.(event, info);
    }
  };
}
```

### Phase 4: Integrate with Features

**Modified**: Feature system setup

```typescript
export function setupFeatureWithHandlers(
  element: Element,
  feature: Feature,
  bridge: HandlerBridge
) {
  // Feature setup
  const cleanup = feature.setup?.(element);
  
  // Wire handlers
  if (feature.gestures) {
    Object.entries(feature.gestures).forEach(([type, handle]) => {
      const originalOnStart = handle.onStart;
      handle.onStart = (info) => {
        originalOnStart?.(info);
        bridge.onGestureStart(type, info.event, info);
      };
      // ... similar for onMove, onEnd
    });
  }
  
  return cleanup;
}
```

### Phase 5: Add Type Definitions

**Modified**: `src/lib/motion-start/types.ts`

```typescript
// Event info types
export interface DragEventInfo {
  point: { x: number; y: number };
  delta: { x: number; y: number };
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

export interface TapEventInfo {
  point: { x: number; y: number };
}

// Update MotionProps
export interface MotionProps {
  // Drag
  onDragStart?: (event: DragEvent, info: DragEventInfo) => void;
  onDrag?: (event: DragEvent, info: DragEventInfo) => void;
  onDragEnd?: (event: DragEvent, info: DragEventInfo) => void;
  
  // Hover
  onHoverStart?: (event: MouseEvent) => void;
  onHoverEnd?: (event: MouseEvent) => void;
  
  // Tap
  onTapStart?: (event: PointerEvent, info: TapEventInfo) => void;
  onTapEnd?: (event: PointerEvent, info: TapEventInfo) => void;
}
```

## Integration with Phase 1

This plan depends on completing the Gesture Refactor (Phase 1):

1. ✅ Gesture detectors must implement GestureHandle interface
2. ✅ GestureInfo must contain event reference
3. ✅ Features must support handler composition

## Files to Create/Modify

### Create
```
src/lib/motion-start/render/
  ├── event-handlers.ts          (new)
  └── handler-bridge.ts          (new)
```

### Modify
```
src/lib/motion-start/
  ├── types.ts                   (MotionProps, event info types)
  ├── render/dom/
  │   └── use-renderer.svelte.ts (handler setup)
  └── motion/
      └── features/              (handler wiring)
```

## Implementation Steps

### Step 1: Create EventHandlerStore (2-3 hours)
- Define store interface
- Implement Svelte store
- Add type safety

### Step 2: Create HandlerBridge (2-3 hours)
- Implement bridge pattern
- Wire handler execution
- Test handler execution flow

### Step 3: Update UseRenderer (3-4 hours)
- Extract gesture handlers from props
- Initialize handler store
- Setup gesture detectors
- Wire bridge to detectors

### Step 4: Update Features (3-4 hours)
- Update drag feature
- Update gesture feature
- Test feature + handler integration

### Step 5: Testing (6-8 hours)
- Unit tests for store and bridge
- Integration tests for renderer + handlers
- E2E tests for user events

**Total Estimated Time**: 16-22 hours

## Success Criteria

1. ✅ Event handler props are functional
2. ✅ Handlers receive correct event objects
3. ✅ Handlers receive correct info objects
4. ✅ Multiple handlers can coexist
5. ✅ Type safety verified
6. ✅ No performance regression
7. ✅ Backward compatible

## Testing Strategy

### Unit Tests (15 tests)
```
event-handlers.ts (5)
  - Store creation
  - Handler setting
  - Handler retrieval
  - Store updates
  
handler-bridge.ts (10)
  - Bridge creation
  - Gesture start routing
  - Gesture move routing
  - Gesture end routing
  - Multiple handlers
```

### Integration Tests (12 tests)
```
use-renderer.ts (6)
  - Handler extraction
  - Handler storage
  - Detector setup
  - Handler lifecycle
  
Feature + Handlers (6)
  - Drag + handler
  - Hover + handler
  - Tap + handler
  - Multiple features
```

### E2E Tests (8 tests)
```
Drag with handler
Hover with handler
Tap with handler
Multiple gestures + handlers
```

## Risk Mitigation

**Risk**: Event handler execution timing
**Mitigation**: Ensure handlers execute after internal processing

**Risk**: Memory leaks from stored handlers
**Mitigation**: Proper cleanup in destroy hooks

**Risk**: Performance impact
**Mitigation**: Profile and optimize handler bridge

## Timeline

- Phase 1 (Prerequisite): ~10 days
- Phase 2 (This Task): ~2-3 days
- **Dependency Chain**: Must complete after Phase 1

## Related Tasks

- Task 1: Gesture Refactor (dependency)
- Task 3: Reactive Contexts (independent)
- Task 4: Element Attachment (builds on this)

## References

- [GESTURE_REFACTOR.md](GESTURE_REFACTOR.md) - Phase 1 details
- [PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) - Rendering layer
- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Feature system
