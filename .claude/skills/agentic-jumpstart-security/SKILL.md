---
name: agentic-jumpstart-security
description: "Security best practices for Svelte 5 animation libraries. Use when writing secure DOM manipulation, event handlers, dynamic styles, or when the user mentions security, XSS prevention, input sanitization, or safe animation patterns."
---

# Security Best Practices for motion-start

This skill provides security guidelines for the motion-start Svelte 5 animation library.

## Overview

motion-start is an animation library that directly manipulates the DOM, handles user gestures, and applies dynamic styles. Security considerations are critical to prevent XSS, injection attacks, and other vulnerabilities.

## DOM Manipulation Security

### Safe Element Access

The library uses `visualElementStore` (WeakMap) for secure element references:

```typescript
// Safe pattern - uses WeakMap to avoid memory leaks and reference issues
import { visualElementStore } from './render/store';
visualElementStore.set(element, visualElement);
```

### Avoid innerHTML

Never use innerHTML with user-provided content:

```typescript
// BAD - XSS vulnerability
element.innerHTML = userContent;

// GOOD - Use textContent for text
element.textContent = userContent;

// GOOD - Use DOM APIs for structure
const span = document.createElement('span');
span.textContent = userContent;
element.appendChild(span);
```

### Safe Attribute Setting

When setting attributes dynamically:

```typescript
// Safe pattern from the codebase
element.style.setProperty(key, value);

// For CSS variables
if (isCSSVariableName(key)) {
  element.style.setProperty(key, value);
}
```

## Dynamic Style Security

### CSS Property Validation

The library validates CSS properties before applying:

```typescript
// Pattern from transformProps
import { transformProps } from './html/utils/transform';

if (transformProps.has(key)) {
  // Apply transform safely
}
```

### CSS Variable Naming

Validate CSS variable names:

```typescript
// From render/dom/utils/is-css-variable.ts
export function isCSSVariableName(name: string): boolean {
  return name.startsWith('--');
}
```

### Prevent Style Injection

Never interpolate user input directly into style strings:

```typescript
// BAD - potential injection
element.style.cssText = `transform: ${userInput}`;

// GOOD - use setProperty with validated values
element.style.setProperty('transform', sanitizedValue);
```

## Event Handler Security

### Gesture Event Validation

The library handles pan, tap, hover, focus, and drag events:

```typescript
// Pattern: Always validate event targets
const target = event.target as HTMLElement;
if (!element.contains(target)) {
  return; // Ignore events outside our scope
}
```

### Event Listener Cleanup

Always clean up event listeners to prevent memory leaks:

```typescript
// Pattern from the codebase
$effect(() => {
  const handler = (e: Event) => { /* ... */ };
  element.addEventListener('pointermove', handler);

  return () => {
    element.removeEventListener('pointermove', handler);
  };
});
```

## Context Isolation

### Safe Context Usage

The library uses Svelte's createContext for isolation:

```typescript
// Pattern from context files
import { createContext } from 'svelte';

const [getContext, setContext] = createContext<MutableRefObject<ContextType>>();

function useContext() {
  try {
    return getContext();
  } catch {
    return setContext({ current: defaultValue });
  }
}
```

### Prevent Context Leakage

Never expose internal context data to consumers:

```typescript
// Export only public interfaces
export type { PresenceContext }; // Type only
export { usePresenceContext };   // Safe accessor
```

## Animation Value Security

### MotionValue Validation

When creating motion values with external input:

```typescript
// Validate numeric inputs
function useMotionValue<T>(initial: T): MotionValue<T> {
  // The library creates values safely
  const value = motionValue(initial);
  return value;
}
```

### Transform Template Safety

When using custom transform templates:

```typescript
// transformTemplate receives controlled values
interface MotionProps {
  transformTemplate?: (
    transform: TransformProperties,
    generatedTransform: string
  ) => string;
}

// Values passed are already validated by the library
```

## Library Distribution Security

### Package Exports

The library uses explicit exports to control public API:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    }
  }
}
```

### No Dynamic Imports of User Content

Never dynamically import user-provided paths:

```typescript
// BAD - code injection risk
const module = await import(userPath);

// GOOD - use static feature loading
import { domAnimation } from 'motion-start';
loadFeatures(domAnimation);
```

## Trusted Dependencies

The project specifies trusted dependencies for postinstall scripts:

```json
{
  "trustedDependencies": [
    "@biomejs/biome",
    "@sveltejs/kit",
    "cypress",
    "esbuild"
  ]
}
```

Only add packages from reputable sources.

## Security Checklist

When writing code for motion-start:

- [ ] Never use innerHTML with dynamic content
- [ ] Validate all CSS property names before applying
- [ ] Always clean up event listeners in $effect returns
- [ ] Use WeakMap for element references
- [ ] Never interpolate user input into style strings
- [ ] Validate event targets before processing
- [ ] Use type-only exports for internal interfaces
- [ ] Never dynamically import user-provided paths
- [ ] Sanitize any values that become part of CSS

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly through GitHub Security Advisories.
