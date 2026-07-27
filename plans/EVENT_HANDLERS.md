# Implementation Plan: Gesture Event Handlers in UseRenderer

Project context: motion-start is a Svelte port of GitHub project `motiondivision/motion` v11.11.11 (separate from upstream motion) and aims to preserve event behavior parity.

## Overview

Enable all feature event handlers (gesture and non-gesture) to work as standard element event handlers in the rendering layer without intermediary stores.

**Goal**: Allow `onDragStart`, `onHoverStart`, `onPointerDown`, `onKeyDown`, etc. to flow directly to feature instances using DOM event listeners.

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

### Architecture: Feature-Centric Event Dispatch

```
User Code (onXXX props)
  ↓
Motion Component Props
  ↓
UseRenderer attaches DOM listeners (no stores)
  ↓
Feature instances derived from Feature/Gesture base
  ↓
Per-feature onFeatureEvent/on<Type> handlers
  ↓
Animation & gesture pipelines
```

## Implementation Plan

### Phase 1: Extend Feature/Gesture base for general DOM events

- Keep `Gesture` (or a renamed `EventFeature`) as the base for attaching DOM listeners via `addEventListener` with the instance as the listener (object form).
- Allow a feature to declare the events it wants (pointer, mouse, touch, key, focus, wheel, custom) and register them in its constructor.
- Dispatch through a single `onFeatureEvent(event: Event)` method on each feature; optionally support per-type helpers like `onpointerdown`, `onpointermove`, etc. when defined.

### Phase 2: Wire UseRenderer without stores

- In `render/dom/use-renderer.svelte.ts`, when creating features, pass the element and props to the feature constructors; let the feature attach listeners directly via the base class.
- No writable stores or handler bridges—DOM listener objects are sufficient.
- Ensure cleanup removes all listeners on destroy.

### Phase 3: Update features to consume props directly

- Drag, hover, tap, focus, and key features read the relevant handler props directly from `MotionProps` at construction.
- Each feature implements `onFeatureEvent(event)` (or per-event methods) to call user-supplied handlers and internal gesture logic.
- Support multiple handlers per event by composing user callbacks with internal behavior.

### Phase 4: Broaden MotionProps event coverage

- Ensure `MotionProps` includes the DOM events we expose (pointer, mouse, touch, keyboard, focus/blur, wheel, form events as needed).
- Keep handler signatures aligned with upstream `motiondivision/motion` v11.11.11 for parity where applicable.

### Phase 5: Tests

- Unit: base class dispatch to `onFeatureEvent` and per-event overrides; listener registration/unregistration.
- Integration: UseRenderer creates features, features attach/detach listeners, user handlers fire once per event, internal logic still runs.
- E2E: Pointer/hover/tap/keyboard flows exercising user callbacks and internal animations.

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

### Unit Tests (target ~12)
- Base dispatch to `onFeatureEvent`
- Per-event override dispatch (`onpointerdown`, `onclick`, etc.)
- Multiple events registered by a feature
- Listener cleanup on destroy

### Integration Tests (target ~10)
- UseRenderer creates features and attaches listeners (no stores)
- User handlers invoked once alongside internal gesture logic
- Drag/hover/tap feature callbacks exercised with real events

### E2E Tests (target ~6)
- Pointer/hover/tap flows trigger user callbacks
- Keyboard/focus flows trigger user callbacks
- Mixed gesture + keyboard scenarios

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
