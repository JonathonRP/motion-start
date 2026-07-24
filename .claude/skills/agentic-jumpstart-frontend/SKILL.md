---
name: agentic-jumpstart-frontend
description: "Svelte 5 frontend patterns for animation libraries. Use when building components with runes, implementing motion components, handling events, using context, styling with Tailwind, or when the user mentions Svelte 5, runes, components, or UI development."
---

# Svelte 5 Frontend Patterns for motion-start

This skill provides frontend development guidelines for the motion-start Svelte 5 animation library.

## Svelte 5 Runes

### $state - Reactive State

```svelte
<script lang="ts">
  // Simple state
  let isAnimating = $state(false);

  // Object state
  let position = $state({ x: 0, y: 0 });

  // Array state
  let items = $state<Item[]>([]);
</script>
```

### $derived - Computed Values

```svelte
<script lang="ts">
  let scale = $state(1);
  let opacity = $state(1);

  // Computed from other state
  const isVisible = $derived(opacity > 0 && scale > 0);

  // Complex derivation
  const transform = $derived(`scale(${scale}) translateX(${position.x}px)`);
</script>
```

### $effect - Side Effects

```svelte
<script lang="ts">
  let element: HTMLElement;

  // Effect with cleanup
  $effect(() => {
    const handler = () => { /* ... */ };
    element.addEventListener('click', handler);

    return () => {
      element.removeEventListener('click', handler);
    };
  });

  // Pre-effect (runs before DOM updates)
  $effect.pre(() => {
    // Measure before render
  });
</script>
```

### $props - Component Props

```svelte
<script lang="ts">
  import type { MotionProps } from './types';

  interface Props extends MotionProps {
    animate?: Target;
    initial?: Target | false;
    exit?: Target;
  }

  let {
    animate,
    initial = true,
    exit,
    children,
    ...restProps
  }: Props = $props();
</script>
```

## Motion Component API

### Basic Usage

```svelte
<script>
  import { motion } from 'motion-start';
</script>

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Content
</motion.div>
```

### With Variants

```svelte
<script>
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
</script>

<motion.div
  {variants}
  initial="hidden"
  animate="visible"
/>
```

### Using m for LazyMotion

```svelte
<script>
  import { LazyMotion, m, domAnimation } from 'motion-start';
</script>

<LazyMotion features={domAnimation}>
  <m.div animate={{ scale: 1.2 }} />
</LazyMotion>
```

## Context System

### Creating Context

The library uses Svelte's createContext with MutableRefObject pattern:

```typescript
// Pattern from context files
import { createContext } from 'svelte';
import type { MutableRefObject } from '../utils/safe-react-types';

interface MyContext {
  value: number;
  update: (v: number) => void;
}

const [getMyContext, setMyContext] = createContext<MutableRefObject<MyContext>>();

// Safe accessor with fallback
export function useMyContext() {
  try {
    return getMyContext();
  } catch {
    return setMyContext({ current: defaultValue });
  }
}
```

### Using Context

```svelte
<script lang="ts">
  import { useMotionConfigContext } from 'motion-start';

  const config = $derived(useMotionConfigContext().current);
  const { reducedMotion, isStatic } = config;
</script>
```

### Setting Context

```svelte
<script lang="ts">
  import { setPresenceContext } from './context/PresenceContext.svelte';

  setPresenceContext({
    get current() {
      return {
        id: uniqueId,
        isPresent: true,
        register: (id) => () => {},
      };
    }
  });
</script>
```

## Component Composition

### Using Snippets

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet<[{ item: any }]>;
  }

  let { children }: Props = $props();
</script>

{#each items as item}
  {@render children({ item })}
{/each}
```

### Forwarding Props

```svelte
<script lang="ts">
  let { class: className, style, ...restProps } = $props();
</script>

<div class={className} {style} {...restProps}>
  <slot />
</div>
```

## Event Handling

### DOM Events

```svelte
<script lang="ts">
  import { useDomEvent } from 'motion-start';

  let element: HTMLElement;

  // Using the library's event helper
  useDomEvent(element, 'pointerdown', (e) => {
    // Handle event
  });
</script>
```

### Gesture Events

```svelte
<motion.div
  onPan={(e, info) => {
    console.log('Panning:', info.offset);
  }}
  onTap={(e, info) => {
    console.log('Tapped at:', info.point);
  }}
  onHoverStart={() => console.log('Hover start')}
  onHoverEnd={() => console.log('Hover end')}
/>
```

### Drag Events

```svelte
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300 }}
  onDragStart={(e, info) => {}}
  onDrag={(e, info) => {}}
  onDragEnd={(e, info) => {}}
/>
```

## Styling with Tailwind

### Using cn() Utility

```typescript
// From src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Styling

```svelte
<script lang="ts">
  import { cn } from '$lib/utils';

  let { class: className } = $props();
</script>

<motion.div
  class={cn(
    "rounded-lg p-4 transition-colors",
    "hover:bg-gray-100 dark:hover:bg-gray-800",
    className
  )}
/>
```

### Tailwind Variants

```typescript
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'px-4 py-2 rounded-lg font-medium',
  variants: {
    color: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
```

## Accessibility

### Reduced Motion

```svelte
<script>
  import { useReducedMotion } from 'motion-start';

  const prefersReduced = useReducedMotion();
</script>

<motion.div
  animate={prefersReduced ? {} : { scale: 1.2 }}
/>
```

### MotionConfig for Global Settings

```svelte
<script>
  import { MotionConfig } from 'motion-start';
</script>

<MotionConfig reducedMotion="user">
  <!-- Children respect user's preference -->
</MotionConfig>
```

### Focus Management

```svelte
<motion.button
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}
  whileFocus={{ scale: 1.05 }}
>
  Click me
</motion.button>
```

## AnimatePresence Patterns

### Exit Animations

```svelte
<script>
  import { AnimatePresence, motion } from 'motion-start';

  let isVisible = $state(true);
</script>

<AnimatePresence>
  {#if isVisible}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  {/if}
</AnimatePresence>
```

### List Animations

```svelte
<AnimatePresence values={items}>
  {#snippet children({ item })}
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {item.name}
    </motion.li>
  {/snippet}
</AnimatePresence>
```

### Presence Hooks

```svelte
<script>
  import { usePresence, useIsPresent } from 'motion-start';

  const [isPresent, safeToRemove] = usePresence();
  const isCurrentlyPresent = useIsPresent();

  $effect(() => {
    if (!isPresent) {
      // Perform exit animation
      setTimeout(safeToRemove, 300);
    }
  });
</script>
```

## TypeScript Patterns

### Component Types

```typescript
import type { Component } from 'svelte';
import type { MotionProps } from './motion/types';

type MotionComponent = Component<MotionProps & HTMLAttributes<HTMLDivElement>>;
```

### Ref Types

```typescript
import type { Ref } from './utils/safe-react-types';

interface Props {
  ref?: Ref<HTMLDivElement>;
}
```

### Motion Value Types

```typescript
import type { MotionValue } from 'motion-start';

function useScale(): MotionValue<number> {
  return useMotionValue(1);
}
```

## File Naming Conventions

| Pattern | Use Case |
|---------|----------|
| `*.svelte` | Svelte components |
| `*.svelte.ts` | Reactive modules using runes |
| `*.ts` | Pure TypeScript modules |
| `index.ts` | Barrel exports |
