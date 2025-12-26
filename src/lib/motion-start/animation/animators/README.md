# Animation Animators System

Based on framer-motion@11.11.11, adapted for Svelte 5 and motion-start.

## Overview

The animator system is the core of all animations in motion-start. It provides a flexible, high-performance architecture for creating and controlling animations.

## Architecture

### Base Classes

#### BaseAnimation

Abstract base class that provides:
- Promise-based completion tracking
- Lifecycle callbacks (onUpdate, onPlay, onComplete, onRepeat, onStop)
- Timing and delay management
- Repeat logic coordination
- State management

All animator implementations extend this class.

#### MainThreadAnimation

JavaScript-based animation implementation that:
- Runs on the main thread using the frameloop system
- Supports multiple animation types:
  - **Keyframes**: Tween animations with custom easing
  - **Spring**: Physics-based spring animations
  - **Inertia/Decay**: Momentum-based animations
- Provides full playback controls (play, pause, stop, scrub)
- Handles repeat logic with multiple repeat types (loop, reverse, mirror)

#### AcceleratedAnimation

Hardware-accelerated animation using WAAPI:
- Leverages GPU acceleration for transform and opacity
- Falls back gracefully when WAAPI is unavailable
- Supports scroll-timeline integration (where supported)
- Minimal CPU overhead for supported properties

### Drivers

Drivers handle animation scheduling:

- **frameloopDriver**: Integrates with the frameloop system
  - Schedules updates through the 'update' step
  - Provides timestamp and delta time
  - Uses keepAlive to maintain the loop while animating

### WAAPI Integration

Web Animations API utilities:

- **NativeAnimation**: Wrapper around native Animation objects
- **createAcceleratedAnimation**: Factory for WAAPI animations
- **Support detection**: Checks for WAAPI and linear() easing
- **Easing conversion**: Converts easing definitions to CSS strings

### Utilities

Helper functions for animation calculations:

- **elapsed.ts**: Time and progress calculations
- **interpolate.ts**: Keyframe interpolation with easing

## Usage

### Creating a Main Thread Animation

```typescript
import { MainThreadAnimation } from './animators';

const animation = new MainThreadAnimation(
  [0, 100], // keyframes
  {
    duration: 1000,
    ease: 'easeInOut',
    onUpdate: (value) => console.log(value),
    onComplete: () => console.log('Done!'),
  }
);

animation.play();
```

### Creating an Accelerated Animation

```typescript
import { AcceleratedAnimation } from './animators';

const element = document.querySelector('.box');
const animation = new AcceleratedAnimation(
  element,
  'opacity', // property to animate
  [0, 1], // keyframes
  {
    duration: 500,
    ease: 'easeOut',
  }
);

animation.play();
```

### Using with MotionValue

The animators integrate seamlessly with MotionValue:

```typescript
import { motionValue } from '../value';
import { MainThreadAnimation } from './animators';

const x = motionValue(0);

const animation = new MainThreadAnimation([0, 100], {
  duration: 1000,
  onUpdate: (value) => x.set(value),
});

animation.play();
```

## Animation Types

### Keyframes

Interpolate through a series of values:

```typescript
const animation = new MainThreadAnimation([0, 50, 100], {
  duration: 1000,
  ease: ['easeIn', 'easeOut'], // Different easing per segment
  offset: [0, 0.3, 1], // Custom timing for each keyframe
});
```

### Spring

Physics-based spring animation:

```typescript
const animation = new MainThreadAnimation([0, 100], {
  type: 'spring',
  stiffness: 100,
  damping: 10,
  mass: 1,
});
```

### Inertia

Momentum-based decay:

```typescript
const animation = new MainThreadAnimation([0], {
  type: 'inertia',
  velocity: 500, // Initial velocity
  power: 0.8, // Deceleration
  timeConstant: 350,
});
```

## Playback Controls

All animators implement `AnimationPlaybackControls`:

```typescript
// Play or resume
animation.play();

// Pause
animation.pause();

// Stop and reset
animation.stop();

// Complete immediately
animation.complete();

// Scrub to specific time
animation.time = 500; // 500ms into animation

// Change speed
animation.speed = 2; // 2x speed

// Use as promise
await animation;
console.log('Animation complete!');
```

## Repeat Logic

Animations support three repeat types:

- **loop**: Restart from beginning
- **reverse**: Alternate between forward and backward
- **mirror**: Reverse the progress on alternate iterations

```typescript
const animation = new MainThreadAnimation([0, 100], {
  duration: 1000,
  repeat: Infinity,
  repeatType: 'reverse',
  repeatDelay: 200, // 200ms pause between repeats
});
```

## Integration with Frameloop

The animator system uses the frameloop from Phase 1:

```
frameloop
  ↓
  update step (with keepAlive)
  ↓
  driver.start()
  ↓
  animation.tick()
  ↓
  interpolate/generator
  ↓
  onUpdate callback
  ↓
  MotionValue.set()
```

This ensures:
- Proper batching with other animations
- Optimal performance through RAF scheduling
- Consistent timing across all animations
- Easy integration with other frameloop consumers

## Hardware Acceleration

AcceleratedAnimation automatically uses GPU acceleration for:
- `transform` (x, y, scale, rotate, etc.)
- `opacity`
- `filter`

For other properties, it gracefully falls back to MainThreadAnimation.

## Best Practices

1. **Use AcceleratedAnimation for transform/opacity** when animating DOM elements
2. **Use MainThreadAnimation for springs/inertia** or non-accelerated properties
3. **Prefer keyframes for choreographed sequences** with multiple values
4. **Use springs for natural, physics-based motion**
5. **Clean up animations** by calling `.stop()` when component unmounts

## Performance

- MainThreadAnimation runs at ~60fps through the frameloop
- AcceleratedAnimation offloads to GPU, minimal CPU usage
- Both support scrubbing for timeline controls
- Repeat logic handled efficiently without creating new animations
