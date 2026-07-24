# GitHub Copilot Instructions for motion-start

## Project Overview

**motion-start** is a Svelte 5 port of framer-motion, providing powerful animation capabilities for Svelte applications.

**Key Features:**
- Svelte 5 runes-based architecture
- Motion components (motion.div, motion.button, etc.)
- AnimatePresence for exit animations
- Layout animations and gestures
- TypeScript support

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript
- **Build**: Vite
- **Testing**: Cypress
- **Styling**: TailwindCSS + Biome for formatting

## Project Structure

```
motion-start/
├── src/
│   ├── lib/
│   │   ├── motion-start/       # Core motion library
│   │   │   ├── animation/      # Animation engine
│   │   │   ├── components/     # AnimatePresence, LayoutGroup, etc.
│   │   │   ├── gestures/       # Drag, hover, tap handlers
│   │   │   ├── motion/         # Motion component creation
│   │   │   ├── projection/     # Layout projection
│   │   │   ├── render/         # DOM/SVG rendering
│   │   │   └── value/          # MotionValue system
│   │   └── components/         # Example components
│   └── routes/                 # SvelteKit routes
├── cypress/                    # E2E tests
```

## Coding Guidelines

### Type Safety
- Fix TypeScript errors incrementally
- Use proper type annotations
- Avoid `any` when possible (use narrowing/guards)
- Current focus: Reducing svelte-check errors

### Svelte 5 Patterns
- Use runes ($state, $derived, $effect) for new code
- Components with `<svelte:options runes={true} />` for new components
- Legacy components use `runes={false}` during migration

### Testing
- Run `npx sv check` before committing
- Test examples in browser during development
- Add E2E tests for critical user flows

### Code Style
- Run Biome formatter: `npx @biomejs/biome format --write .`
- Follow existing patterns in motion-start library
- Keep components focused and composable

## Current Work

The project is actively being migrated to Svelte 5 and fixing type errors:
- Reduced from 60 to 16 TypeScript errors
- Focus areas: MotionValue types, component interfaces, type predicates
- See [AGENTS.md](../AGENTS.md) for workflow details

## Important Rules

- ✅ Run `npx sv check` before committing
- ✅ Test in browser when changing components
- ❌ Do NOT commit type errors without documenting reason

---

**For detailed workflows and advanced features, see [AGENTS.md](../AGENTS.md)**

## Landing the Plane

When finishing a session or when asked to "land the plane":
- Run all checks and tests:
    - `npx sv check` (Svelte type checks)
    - `npx cypress run` (E2E tests; or target a spec with `--spec` for scoped changes)
- Ensure formatting is clean: `npx @biomejs/biome format --write .`
- Provide a concise summary: changes made, test results, and any follow-ups.
