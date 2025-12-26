# Animator System Examples

Practical examples showing how to use the animation animator system.

## Basic Keyframe Animation

```typescript
import { MainThreadAnimation } from './animators';

// Simple 0 to 100 animation
const animation = new MainThreadAnimation([0, 100], {
  duration: 1000,
  ease: 'easeInOut',
  onUpdate: (value) => {
    console.log('Current value:', value);
  },
  onComplete: () => {
    console.log('Animation complete!');
  },
});

animation.play();

// Use as promise
await animation;
console.log('Done!');
```

## Spring Animation

```typescript
import { MainThreadAnimation } from './animators';

const springAnim = new MainThreadAnimation([0, 100], {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 1,
  onUpdate: (value) => {
    element.style.transform = `translateX(${value}px)`;
  },
});

springAnim.play();
```

## Hardware Accelerated Animation

```typescript
import { AcceleratedAnimation } from './animators';

const element = document.querySelector('.box');

const accelAnim = new AcceleratedAnimation(
  element,
  'opacity',
  [0, 1],
  {
    duration: 500,
    ease: 'easeOut',
  }
);

accelAnim.play();
```

## With MotionValue

```typescript
import { motionValue } from '../value';
import { MainThreadAnimation } from './animators';

const x = motionValue(0);

// Subscribe to updates
x.onChange((value) => {
  element.style.transform = `translateX(${value}px)`;
});

// Animate the MotionValue
const animation = new MainThreadAnimation([0, 100], {
  duration: 1000,
  onUpdate: (value) => x.set(value),
});

animation.play();
```

## Repeating Animation

```typescript
import { MainThreadAnimation } from './animators';

// Infinite loop
const loopAnim = new MainThreadAnimation([0, 100], {
  duration: 1000,
  repeat: Infinity,
  repeatType: 'loop',
  onRepeat: () => {
    console.log('Animation repeated!');
  },
});

// Reverse back and forth
const reverseAnim = new MainThreadAnimation([0, 100], {
  duration: 1000,
  repeat: 3,
  repeatType: 'reverse',
  repeatDelay: 200, // Pause 200ms between iterations
});

// Mirror (alternate)
const mirrorAnim = new MainThreadAnimation([0, 100], {
  duration: 1000,
  repeat: Infinity,
  repeatType: 'mirror',
});
```

## Playback Controls

```typescript
import { MainThreadAnimation } from './animators';

const anim = new MainThreadAnimation([0, 100], {
  duration: 2000,
  autoplay: false, // Don't start automatically
});

// Play/pause
anim.play();
setTimeout(() => anim.pause(), 500);
setTimeout(() => anim.play(), 1000);

// Speed control
anim.speed = 2; // 2x speed
anim.speed = 0.5; // Half speed

// Scrubbing
anim.time = 1000; // Jump to 1 second

// Complete immediately
anim.complete();

// Stop and reset
anim.stop();
```

## Multi-Segment Keyframes

```typescript
import { MainThreadAnimation } from './animators';

const multiSegment = new MainThreadAnimation([0, 50, 100], {
  duration: 2000,
  ease: ['easeIn', 'easeOut'], // Different easing per segment
  offset: [0, 0.3, 1], // 0% at 0, 30% at 50, 100% at 100
});
```

## Custom Easing

```typescript
import { MainThreadAnimation } from './animators';

const customEasing = new MainThreadAnimation([0, 100], {
  duration: 1000,
  ease: [0.42, 0, 0.58, 1], // Cubic bezier
});

// Named easings
const named = new MainThreadAnimation([0, 100], {
  duration: 1000,
  ease: 'backOut', // Overshoots and settles
});
```

## Inertia/Decay Animation

```typescript
import { MainThreadAnimation } from './animators';

const inertiaAnim = new MainThreadAnimation([startValue], {
  type: 'inertia',
  velocity: 1000, // Initial velocity
  power: 0.8, // Deceleration rate
  timeConstant: 350,
  onUpdate: (value) => {
    element.scrollTop = value;
  },
});
```

## Svelte 5 Component Example

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { MainThreadAnimation } from '$lib/motion-start/animation/animators';

  let element: HTMLDivElement;
  let animation: MainThreadAnimation | undefined;

  onMount(() => {
    animation = new MainThreadAnimation([0, 100], {
      duration: 1000,
      repeat: Infinity,
      repeatType: 'reverse',
      onUpdate: (value) => {
        if (element) {
          element.style.transform = `translateX(${value}px)`;
        }
      },
    });

    animation.play();
  });

  onDestroy(() => {
    animation?.stop();
  });

  function handleClick() {
    if (animation?.state === 'playing') {
      animation.pause();
    } else {
      animation?.play();
    }
  }
</script>

<div
  bind:this={element}
  onclick={handleClick}
  class="box"
>
  Click to toggle
</div>

<style>
  .box {
    width: 100px;
    height: 100px;
    background: blue;
    cursor: pointer;
  }
</style>
```

## Svelte 5 Runes Example

```svelte
<script lang="ts">
  import { MainThreadAnimation } from '$lib/motion-start/animation/animators';

  let element = $state<HTMLDivElement>();
  let animation = $state<MainThreadAnimation>();
  let isPlaying = $state(false);

  $effect(() => {
    if (element) {
      animation = new MainThreadAnimation([0, 100], {
        duration: 1000,
        onUpdate: (value) => {
          element!.style.transform = `translateX(${value}px)`;
        },
      });

      return () => animation?.stop();
    }
  });

  function toggle() {
    if (animation) {
      if (isPlaying) {
        animation.pause();
      } else {
        animation.play();
      }
      isPlaying = !isPlaying;
    }
  }
</script>

<div
  bind:this={element}
  onclick={toggle}
  class="box"
>
  {isPlaying ? 'Playing' : 'Paused'}
</div>
```

## Staggered Animations

```typescript
import { MainThreadAnimation } from './animators';

const elements = document.querySelectorAll('.item');

elements.forEach((element, index) => {
  const animation = new MainThreadAnimation([0, 100], {
    duration: 500,
    delay: index * 100, // Stagger by 100ms
    onUpdate: (value) => {
      element.style.opacity = value / 100;
      element.style.transform = `translateY(${100 - value}px)`;
    },
  });

  animation.play();
});
```

## Sequential Animations

```typescript
import { MainThreadAnimation } from './animators';

async function sequence() {
  // Animate 1
  const anim1 = new MainThreadAnimation([0, 100], {
    duration: 500,
    onUpdate: (v) => element1.style.opacity = v / 100,
  });
  anim1.play();
  await anim1;

  // Animate 2 (after 1 completes)
  const anim2 = new MainThreadAnimation([0, 100], {
    duration: 500,
    onUpdate: (v) => element2.style.opacity = v / 100,
  });
  anim2.play();
  await anim2;

  console.log('Sequence complete!');
}

sequence();
```

## Parallel Animations

```typescript
import { MainThreadAnimation } from './animators';

const anim1 = new MainThreadAnimation([0, 100], {
  duration: 1000,
  onUpdate: (v) => element.style.opacity = v / 100,
});

const anim2 = new MainThreadAnimation([0, 360], {
  duration: 1000,
  onUpdate: (v) => element.style.transform = `rotate(${v}deg)`,
});

// Start both at once
anim1.play();
anim2.play();

// Wait for both
await Promise.all([anim1, anim2]);
console.log('Both complete!');
```

## Checking Hardware Acceleration Support

```typescript
import { AcceleratedAnimation } from './animators';

const element = document.querySelector('.box');

if (AcceleratedAnimation.supports(element, 'opacity')) {
  // Use hardware acceleration
  const anim = new AcceleratedAnimation(element, 'opacity', [0, 1], {
    duration: 500,
  });
  anim.play();
} else {
  // Fallback to main thread
  const anim = new MainThreadAnimation([0, 1], {
    duration: 500,
    onUpdate: (v) => element.style.opacity = v,
  });
  anim.play();
}
```

## Instant Animation (Zero Duration)

```typescript
import { instantAnimation } from './animators';

// Immediately set value without animation
const controls = instantAnimation(
  () => element.style.opacity = '0',
  () => console.log('Set instantly!')
);
```

## Animation State Checking

```typescript
import { MainThreadAnimation, AnimationState } from './animators';

const anim = new MainThreadAnimation([0, 100], { duration: 1000 });

anim.play();

console.log(anim.state); // 'playing'

anim.pause();
console.log(anim.state); // 'paused'

anim.complete();
console.log(anim.state); // 'finished'
```

## Complex Color Animation

```typescript
import { MainThreadAnimation } from './animators';
import { interpolate } from 'popmotion';

// Define color interpolator
const colors = ['#ff0000', '#00ff00', '#0000ff'];

const colorAnim = new MainThreadAnimation([0, 1], {
  duration: 2000,
  onUpdate: (progress) => {
    const index = Math.floor(progress * (colors.length - 1));
    const nextIndex = Math.min(index + 1, colors.length - 1);
    const segmentProgress = (progress * (colors.length - 1)) % 1;

    // Interpolate between colors (simplified)
    element.style.background = colors[index];
  },
});
```

## Scroll-Based Animation (Future)

```typescript
import { AcceleratedAnimation } from './animators';

const element = document.querySelector('.parallax');
const anim = new AcceleratedAnimation(element, 'transform', [
  'translateY(0px)',
  'translateY(100px)',
], {
  duration: 1000,
  autoplay: false,
});

// When scroll timelines are supported:
if ('ScrollTimeline' in window) {
  const scrollTimeline = new ScrollTimeline({
    source: document.scrollingElement,
  });

  anim.attachTimeline(scrollTimeline);
}
```

## Best Practices

1. **Clean up on unmount:**
   ```typescript
   onDestroy(() => {
     animation?.stop();
   });
   ```

2. **Use AcceleratedAnimation for transforms:**
   ```typescript
   // Good: GPU accelerated
   new AcceleratedAnimation(element, 'transform', [...]);

   // Less optimal: Main thread
   new MainThreadAnimation([...], {
     onUpdate: (v) => element.style.left = `${v}px`,
   });
   ```

3. **Prefer springs for natural motion:**
   ```typescript
   new MainThreadAnimation([0, 100], {
     type: 'spring',
     stiffness: 300,
     damping: 25,
   });
   ```

4. **Use promises for sequencing:**
   ```typescript
   await animation1;
   animation2.play();
   ```

5. **Check state before operations:**
   ```typescript
   if (anim.state === AnimationState.Playing) {
     anim.pause();
   }
   ```
