# Frameloop System

The frameloop system is the core animation scheduling infrastructure for motion-start, coordinating all animation frame updates, batching DOM operations, and synchronizing timing across components.

## Overview

Based on framer-motion@11.11.11's frameloop implementation, this system has been adapted for Svelte 5 while maintaining API compatibility with the original.

## Architecture

### Pipeline Stages

The frameloop processes callbacks through six sequential stages on every frame:

1. **read** - Read from DOM (measurements, layouts, scroll positions)
2. **resolveKeyframes** - Resolve dynamic keyframes (e.g., "auto" values)
3. **update** - Update animation state and values
4. **preRender** - Prepare values for rendering
5. **render** - Apply changes to DOM
6. **postRender** - Cleanup and post-processing

This ordering prevents layout thrashing by batching all DOM reads before writes.

### Key Components

#### Types (`types.ts`)
- `Process` - Function type that accepts FrameData
- `Step` - Interface for scheduling and processing callbacks
- `StepId` - Union type of pipeline stages
- `FrameData` - Frame timing information (delta, timestamp, isProcessing)
- `Batcher` - Maps step IDs to schedule functions
- `Steps` - Maps step IDs to Step interfaces

#### Render Step (`render-step.ts`)
- Manages callback execution for a single pipeline stage
- Maintains two queues (current frame and next frame)
- Supports keepAlive for persistent callbacks
- Handles immediate scheduling during processing

#### Batcher (`batcher.ts`)
- Orchestrates the complete pipeline
- Creates steps for each stage
- Manages frame timing and delta calculation
- Caps delta at 40ms to prevent "spiral of death"
- Supports manual timing for testing

#### Frame (`frame.ts`)
- Main frameloop using requestAnimationFrame
- Exports: `frame`, `cancelFrame`, `frameData`, `frameSteps`
- SSR-safe with noop fallback

#### Microtask (`microtask.ts`)
- Microtask-based batcher for synchronous updates
- Runs before next frame but after current execution
- No keepAlive support (one-shot execution)

#### Sync Time (`sync-time.ts`)
- Synchronized time utility
- Ensures consistent timestamps within synchronous context
- Automatically clears via microtask

#### Legacy API (`index-legacy.ts`)
- Backward-compatible deprecated exports
- `sync` - Alias for `frame`
- `cancelSync` - Object with cancel methods per step

## Usage

### Basic Animation Scheduling

```typescript
import { frame } from '$lib/motion-start/frameloop';

// Schedule a callback for the render step
frame.render((frameData) => {
  console.log('Delta:', frameData.delta);
  console.log('Timestamp:', frameData.timestamp);

  // Apply DOM changes
  element.style.transform = `translateX(${x}px)`;
});
```

### KeepAlive Callbacks

```typescript
import { frame, cancelFrame } from '$lib/motion-start/frameloop';

// Schedule a persistent callback that runs every frame
const callback = frame.update((frameData) => {
  // Update animation state
  position += velocity * (frameData.delta / 1000);

  if (position > target) {
    // Stop when done
    cancelFrame(callback);
  }
}, true); // keepAlive = true
```

### Reading and Writing DOM

```typescript
import { frame } from '$lib/motion-start/frameloop';

// Proper batching to prevent layout thrashing
frame.read(() => {
  // Read from DOM
  const height = element.offsetHeight;

  frame.render(() => {
    // Write to DOM
    element.style.height = `${height * 2}px`;
  });
});
```

### Immediate Scheduling

```typescript
import { frame } from '$lib/motion-start/frameloop';

frame.render((frameData) => {
  // This callback is already running

  // Schedule another callback to run in this same frame
  frame.render(() => {
    console.log('Runs in same frame');
  }, false, true); // immediate = true
});
```

### Synchronized Time

```typescript
import { time } from '$lib/motion-start/frameloop/sync-time';

// All calls within same synchronous context return same value
const t1 = time.now(); // e.g., 100.5
const t2 = time.now(); // 100.5 (same)

// After microtask, new value
queueMicrotask(() => {
  const t3 = time.now(); // e.g., 101.2 (different)
});
```

### Microtask Batching

```typescript
import { microtask } from '$lib/motion-start/frameloop/microtask';

// Batch state updates before next frame
microtask.update(() => {
  // Update state synchronously
  state.value = newValue;
});
```

## Integration with Animation System

The frameloop integrates with the existing animation system through:

1. **popmotion/framesync** - The frameloop can work alongside the existing framesync dependency
2. **MotionValue** - Animation values use the frameloop for updates
3. **Visual Elements** - DOM updates are batched through the render step
4. **Gesture System** - Drag and pan gestures schedule updates via the frameloop
5. **Layout Animations** - Layout measurements use the read step, updates use render

## Global Configuration

```typescript
import { MotionGlobalConfig } from '$lib/motion-start/utils/GlobalConfig';

// Skip all animations (e.g., for testing or accessibility)
MotionGlobalConfig.skipAnimations = true;

// Use manual timing (e.g., for testing)
MotionGlobalConfig.useManualTiming = true;
frameData.timestamp = 16.67; // Set manual timestamp
```

## Performance Considerations

### Delta Capping
The frameloop caps delta at 40ms to prevent animations from jumping too far when tabs are backgrounded or the browser is overloaded. This prevents the "spiral of death" where slow frames cause more work, causing slower frames.

### Queue Swapping
Instead of clearing and rebuilding queues, the frameloop swaps queue references. This is more efficient and allows garbage collection of completed callbacks.

### WeakSet for KeepAlive
Using WeakSet for keepAlive tracking allows garbage collection when callbacks are no longer referenced elsewhere, preventing memory leaks.

### SSR Safety
All frameloop code is SSR-safe with proper fallbacks:
- `requestAnimationFrame` falls back to `noop`
- `performance.now()` checks are guarded
- No global state pollution

## Testing

```typescript
import { MotionGlobalConfig } from '$lib/motion-start/utils/GlobalConfig';
import { frameData, frameSteps } from '$lib/motion-start/frameloop';

// Enable manual timing
MotionGlobalConfig.useManualTiming = true;

// Schedule callbacks
frame.update((data) => {
  console.log('Update:', data.timestamp);
});

// Manually advance time
frameData.timestamp = 16.67;
frameSteps.update.process(frameData);

frameData.timestamp = 33.34;
frameSteps.update.process(frameData);
```

## Differences from Framer Motion

This Svelte 5 adaptation maintains the same core functionality with these differences:

1. **No React Dependencies** - Removed all React-specific code
2. **Svelte 5 Compatibility** - Works with Svelte 5 reactive primitives
3. **TypeScript Paths** - Uses `.js` extensions for ESM compatibility
4. **SSR First** - Enhanced SSR safety for SvelteKit
5. **Documentation** - Enhanced comments and examples for Svelte developers

## Files

- `types.ts` - TypeScript type definitions
- `render-step.ts` - Single step implementation
- `batcher.ts` - Pipeline orchestration
- `frame.ts` - Main frameloop with requestAnimationFrame
- `microtask.ts` - Microtask-based batcher
- `sync-time.ts` - Synchronized time utility
- `index.ts` - Main exports
- `index-legacy.ts` - Deprecated backward-compatible API

## Credits

Based on framer-motion@11.11.11
Copyright (c) 2018 Framer B.V.
Adapted for Svelte 5 and motion-start
