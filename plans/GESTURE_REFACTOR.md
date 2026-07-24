# Implementation Plan: Gesture and Event Handling Refactor

Project context: motion-start ports `motiondivision/motion` v11.11.11 to Svelte and aims to preserve gesture behavior parity.

## Overview

Refactor the gesture and event handling system to improve:
- Feature architecture clarity
- Event handling flexibility  
- Type safety for gesture events
- Integration with motion system

## Current State Analysis

### Gesture System (Current)
**Location**: `src/lib/motion-start/gestures/`

Current approach:
- Separate handlers for drag, hover, tap
- Features manually add event listeners
- Events tied to specific DOM properties
- No unified event interface

Problems:
- Gesture logic scattered across features
- Difficult to compose gestures
- Type safety issues with event data
- No clear event flow architecture

## Proposed Solution: Gesture-First Architecture

### Phase 1: Create Gesture Abstraction

**Goal**: Unify gesture handling with consistent interface

```typescript
// New: src/lib/motion-start/gestures/types.ts
export interface GestureInfo {
  type: 'drag' | 'hover' | 'tap' | 'custom';
  target: EventTarget;
  timestamp: number;
  metadata: Record<string, any>;
}

export interface GestureHandle {
  onStart?: (info: GestureInfo) => void;
  onMove?: (info: GestureInfo) => void;
  onEnd?: (info: GestureInfo) => void;
  onCancel?: (info: GestureInfo) => void;
}

export interface GestureDetector {
  type: string;
  setup(element: Element, handle: GestureHandle): VoidFunction;
  teardown(): void;
}
```

### Phase 2: Implement Gesture Detectors

**Files to create**:
- `src/lib/motion-start/gestures/detectors/drag-detector.ts`
- `src/lib/motion-start/gestures/detectors/hover-detector.ts`
- `src/lib/motion-start/gestures/detectors/tap-detector.ts`

```typescript
// Example: DragDetector
export class DragDetector implements GestureDetector {
  type = 'drag';
  
  setup(element: Element, handle: GestureHandle): VoidFunction {
    const handleMouseDown = (e: MouseEvent) => {
      handle.onStart?.({ type: 'drag', target: e.target, ... });
    };
    
    element.addEventListener('mousedown', handleMouseDown);
    return () => element.removeEventListener('mousedown', handleMouseDown);
  }
}
```

### Phase 3: Integrate with Features

**Modified**: `src/lib/motion-start/motion/features/`

Features use gesture handlers:

```typescript
// Drag feature
export function createDragFeature() {
  return {
    gestures: {
      drag: {
        onStart: (info) => { /* start drag animation */ },
        onMove: (info) => { /* update position */ },
        onEnd: (info) => { /* finalize position */ }
      }
    },
    onRender: (context) => { /* apply styles */ }
  };
}
```

### Phase 4: Add Event Handler Props

**Modified**: Gesture event callback types

```typescript
export interface MotionProps {
  // Drag events
  onDragStart?: (event: DragEvent, info: DragInfo) => void;
  onDrag?: (event: DragEvent, info: DragInfo) => void;
  onDragEnd?: (event: DragEvent, info: DragInfo) => void;
  
  // Hover events
  onHoverStart?: (event: MouseEvent) => void;
  onHoverEnd?: (event: MouseEvent) => void;
  
  // Tap events
  onTapStart?: (event: PointerEvent) => void;
  onTapEnd?: (event: PointerEvent) => void;
}
```

## Implementation Details

### Step 1: Create GestureHandle Interface
- Define unified event structure
- Support all gesture types
- Type-safe metadata passing

**Estimated effort**: 2-4 hours

### Step 2: Create Gesture Detectors
- Implement drag detector (mouse + touch)
- Implement hover detector
- Implement tap detector
- Create detector registry

**Estimated effort**: 6-8 hours

### Step 3: Refactor Features
- Update drag feature to use detectors
- Update gesture feature to use detectors
- Update layout feature if needed
- Ensure backward compatibility

**Estimated effort**: 8-10 hours

### Step 4: Add Event Handler Props
- Update MotionProps interface
- Wire event handlers to detectors
- Add type definitions for event data
- Document event prop usage

**Estimated effort**: 4-6 hours

### Step 5: Testing
- Unit tests for each detector
- Integration tests for feature + gesture
- E2E tests for user interactions
- Regression testing

**Estimated effort**: 8-10 hours

## Files to Create/Modify

### Create
```
src/lib/motion-start/gestures/
  ├── types.ts                    (new)
  ├── gesture-handle.ts           (new)
  ├── gesture-registry.ts         (new)
  └── detectors/
      ├── drag-detector.ts        (new)
      ├── hover-detector.ts       (new)
      └── tap-detector.ts         (new)
```

### Modify
```
src/lib/motion-start/
  ├── types.ts                    (MotionProps)
  ├── motion/features/            (all features)
  └── motion/index.svelte.ts      (feature setup)
```

## Success Criteria

1. ✅ GestureHandle interface implemented
2. ✅ All gesture detectors working
3. ✅ Features updated to use detectors
4. ✅ Event handler props functional
5. ✅ Type safety verified with tests
6. ✅ Backward compatibility maintained
7. ✅ All tests passing

## Testing Plan

### Unit Tests (20 tests)
- Gesture detector initialization
- Gesture detector event triggering
- Event data construction
- Detector cleanup

### Integration Tests (15 tests)
- Feature + gesture interaction
- Multiple gestures on one element
- Gesture cancellation
- Event handler execution

### E2E Tests (10 tests)
- Drag interaction
- Hover interaction
- Tap interaction
- Gesture + animation combo

## Risk Mitigation

**Risk**: Breaking existing gesture behavior
**Mitigation**: Keep old interfaces during transition, add deprecation warnings

**Risk**: Performance regression
**Mitigation**: Profile before/after, optimize event listener setup

**Risk**: Type safety gaps
**Mitigation**: Comprehensive type tests, strict TypeScript validation

## Timeline Estimate

- Phase 1-2: 2-3 days
- Phase 3-4: 3-4 days  
- Phase 5: 2-3 days
- **Total**: ~10 days (can parallelize some work)

## Related Tasks

- Task 2: Use gesture handles in UseRenderer
- Task 3: Make contexts reactive
- Task 4: Refactor element attachment

## References

- [ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Feature system
- [PROJECT_STRUCTURE.md](../docs/PROJECT_STRUCTURE.md) - Gesture layer
