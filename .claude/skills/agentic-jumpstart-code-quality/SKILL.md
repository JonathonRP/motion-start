---
name: agentic-jumpstart-code-quality
description: "Code quality standards for Svelte 5 animation libraries using TypeScript and Biome. Use when writing clean code, following linting rules, formatting code, type checking, or when the user mentions code quality, linting, formatting, TypeScript, or best practices."
---

# Code Quality Standards for motion-start

This skill provides code quality guidelines for the motion-start Svelte 5 animation library.

## Linting and Formatting: Biome

### Configuration (biome.jsonc)

```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineEnding": "lf",
    "lineWidth": 120
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSpacing": true
    }
  }
}
```

### Key Rules

```json
{
  "linter": {
    "rules": {
      "complexity": {
        "noExtraBooleanCast": "error"
      },
      "correctness": {
        "noConstAssign": "error",
        "noUnreachable": "error",
        "noUnusedVariables": "error",
        "useValidTypeof": "error"
      },
      "suspicious": {
        "noDebugger": "error",
        "noDuplicateCase": "error",
        "noEmptyBlockStatements": "error"
      }
    }
  }
}
```

### Commands

```bash
# Lint
bun run lint

# Format
npx @biomejs/biome format --write .

# Check without modifying
npx @biomejs/biome check .
```

## TypeScript Configuration

### Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "verbatimModuleSyntax": true
  }
}
```

### Type Checking

```bash
# Svelte type check
npx sv check

# Run before commits
npx sv check --tsconfig ./tsconfig.json
```

## Code Style Patterns

### Import Organization

```typescript
// 1. External packages
import { type Component } from 'svelte';
import type { Properties } from 'csstype';

// 2. Internal absolute imports
import { motion } from '$lib/motion-start';

// 3. Relative imports
import type { MotionProps } from './types';
import { useMotionContext } from '../context/MotionContext';
```

### Type-Only Imports

```typescript
// Use 'type' keyword for type-only imports
import type { MotionValue } from '../value';
import { motionValue, type MotionValueOptions } from '../value';
```

### Function Declarations

```typescript
// Prefer function declarations for top-level functions
export function useMotionValue<T>(initial: T): MotionValue<T> {
  const value = motionValue(initial);
  return value;
}

// Arrow functions for callbacks and closures
const handler = (e: Event) => {
  // ...
};
```

### Class Patterns

```typescript
// Abstract classes for base implementations
export abstract class VisualElement<Instance, RenderState, Options> {
  abstract type: string;
  abstract measureInstanceViewportBox(instance: Instance): Box;

  // Protected for subclass access
  protected latestValues: ResolvedValues = {};

  // Private for internal use
  private subscriptions: Set<() => void> = new Set();
}
```

### Interface vs Type

```typescript
// Interfaces for object shapes (extendable)
export interface MotionProps extends AnimationProps, GestureProps {
  initial?: Target | VariantLabels | boolean;
  animate?: Target | VariantLabels;
}

// Types for unions, primitives, mapped types
export type VariantLabels = string | string[];
export type MakeMotion<T> = { [K in keyof T]: T[K] | MotionValue<T[K]> };
```

## Svelte 5 Patterns

### Runes Usage

```svelte
<script lang="ts">
  // Props with defaults
  let {
    animate,
    initial = true,
    exit,
    ...restProps
  }: Props = $props();

  // Reactive state
  let isAnimating = $state(false);

  // Derived values
  const isVisible = $derived(opacity > 0);

  // Effects with cleanup
  $effect(() => {
    const unsubscribe = value.on('change', handler);
    return () => unsubscribe();
  });
</script>
```

### Component Options

```svelte
<svelte:options runes />

<script lang="ts" module>
  // Module-level exports
  export function helperFunction() {}
</script>

<script lang="ts">
  // Component logic
</script>
```

## Error Handling

### Assertion Functions

```typescript
// From utils/errors.ts
export function invariant(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

// Usage
invariant(element !== null, 'Element must exist');
```

### Warning Patterns

```typescript
// From utils/warn-once.ts
export function warnOnce(condition: boolean, message: string) {
  if (condition || warned.has(message)) return;
  console.warn(message);
  warned.add(message);
}

// Usage
warnOnce(!exitBeforeEnter, "Replace exitBeforeEnter with mode='wait'");
```

## Documentation Standards

### JSDoc for Public APIs

```typescript
/**
 * Creates a `MotionValue` to track the state and velocity of a value.
 *
 * @param initial - The initial state.
 * @returns A new MotionValue instance
 *
 * @example
 * ```tsx
 * const scale = useMotionValue(1);
 * <motion.div style={{ scale }} />
 * ```
 *
 * @public
 */
export function useMotionValue<T>(initial: T): MotionValue<T> {
  // ...
}
```

### Internal Documentation

```typescript
/**
 * @internal
 */
export function internalHelper() {}
```

## File Organization

### File Naming

| Pattern | Purpose |
|---------|---------|
| `ComponentName.svelte` | Svelte components |
| `use-feature.svelte.ts` | Reactive modules with runes |
| `feature-name.ts` | Pure TypeScript modules |
| `index.ts` | Barrel exports |
| `types.ts` | Type definitions |

### Barrel Exports

```typescript
// index.ts
export { useMotionValue } from './use-motion-value.svelte';
export { motionValue } from './motion-value';
export type { MotionValue, MotionValueOptions } from './types';
```

## Pre-commit Checks

```bash
# Run all checks
bun run lint && npx sv check && bun test
```

### Recommended Script

```json
{
  "scripts": {
    "check": "bun run lint && npx sv check",
    "precommit": "bun run check && bun test"
  }
}
```

## Code Review Guidelines

### Before Submitting

- [ ] Code formatted with Biome
- [ ] No TypeScript errors
- [ ] No unused imports/variables
- [ ] Public APIs have JSDoc
- [ ] Tests pass
- [ ] No `console.log` (use `warnOnce` for warnings)
- [ ] Effects have cleanup functions
- [ ] No memory leaks (subscriptions cleaned up)

### Review Focus Areas

1. **Type Safety**: Proper types, no `any` abuse
2. **Reactivity**: Correct use of runes
3. **Cleanup**: All subscriptions/listeners removed
4. **Performance**: No unnecessary re-renders
5. **Accessibility**: Motion respects reduced motion

## Common Anti-Patterns

### Avoid

```typescript
// BAD: any type
const value: any = getValue();

// BAD: Missing cleanup
$effect(() => {
  element.addEventListener('click', handler);
  // No cleanup!
});

// BAD: Unused variables
const unused = computeValue(); // Never used

// BAD: console.log in production
console.log('Debug:', value);
```

### Prefer

```typescript
// GOOD: Proper type
const value: MotionValue<number> = getValue();

// GOOD: With cleanup
$effect(() => {
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
});

// GOOD: Use warning utility
if (process.env.NODE_ENV !== 'production') {
  warnOnce(condition, 'Warning message');
}
```

## Quality Checklist

- [ ] `bun run lint` passes
- [ ] `npx sv check` passes
- [ ] `bun test` passes
- [ ] No TypeScript `any` types without justification
- [ ] All effects return cleanup functions
- [ ] Public APIs documented with JSDoc
- [ ] Imports organized (external, internal, relative)
- [ ] Type-only imports use `type` keyword
