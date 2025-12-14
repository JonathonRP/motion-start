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

## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Essential Commands

```bash
# Find work
bd ready --json                    # Unblocked issues
bd list --status open --json       # All open issues

# Create and manage
bd create "Title" -t bug|feature|task -p 0-4 --json
bd create "Subtask" --parent <epic-id> --json  # Hierarchical subtask
bd update <id> --status in_progress --json
bd close <id> --reason "Done" --json

# Search
bd show <id> --json
```

### Workflow

1. **Check ready work**: `bd ready --json`
2. **Claim task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** `bd create "Found bug" -p 1 --deps discovered-from:<parent-id> --json`
5. **Complete**: `bd close <id> --reason "Done" --json`
6. **Commit together**: Always commit `.beads/issues.jsonl` with code changes

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

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
└── .beads/
    └── issues.jsonl           # Git-synced issue storage
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

## CLI Help

Run `bd <command> --help` to see all available flags for any command.
For example: `bd create --help` shows `--parent`, `--deps`, `--assignee`, etc.

## Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Run `npx sv check` before committing
- ✅ Test in browser when changing components
- ✅ Run `bd <cmd> --help` to discover available flags
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT commit type errors without documenting reason

---

**For detailed workflows and advanced features, see [AGENTS.md](../AGENTS.md)**
