# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Your context window will be automatically compacted as it approaches its limit, allowing you to continue working indefinitely from where you left off. Therefore, do not stop tasks early due to token budget concerns. As you approach your token budget limit, save your current progress and state to memory before the context window refreshes. Always be as persistent and autonomous as possible and complete tasks fully, even if the end of your budget is approaching. Never artificially stop any task early regardless of the context remaining.

Only delegate to subagents when the task clearly benefits from a separate agent with a new context window.

<use_parallel_tool_calls>
If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. Prioritize calling tools simultaneously whenever the actions can be done in parallel rather than sequentially. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. Maximize use of parallel tool calls where possible to increase speed and efficiency. However, if some tool calls depend on previous calls to inform dependent values like the parameters, do NOT call these tools in parallel and instead call them sequentially. Never use placeholders or guess missing parameters in tool calls.
</use_parallel_tool_calls>

ALWAYS read and understand relevant files before proposing code edits. Do not speculate about code you have not inspected. If the user references a specific file/path, you MUST open and inspect it before explaining or proposing fixes. Be rigorous and persistent in searching code for key facts. Thoroughly review the style, conventions, and abstractions of the codebase before implementing new features or abstractions.

<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer - give grounded and hallucination-free answers.
</investigate_before_answering>

Please write a high-quality, general-purpose solution using the standard tools available. Do not create helper scripts or workarounds to accomplish the task more efficiently. Implement a solution that works correctly for all valid inputs, not just the test cases. Do not hard-code values or create solutions that only work for specific test inputs. Instead, implement the actual logic that solves the problem generally.

Focus on understanding the problem requirements and implementing the correct algorithm. Tests are there to verify correctness, not to define the solution. Provide a principled implementation that follows best practices and software design principles.

If the task is unreasonable or infeasible, or if any of the tests are incorrect, please inform me rather than working around them. The solution should be robust, maintainable, and extendable.

## Project Overview

**motion-start** is a Svelte 5 animation library inspired by framer-motion (React). It provides motion components (`Motion.div`, `Motion.button`, etc.), AnimatePresence for exit animations, layout animations, and gesture handling. Currently in alpha and actively being migrated to Svelte 5 with runes.

## Commands

```bash
# Development
bun dev                     # Start dev server on localhost:5000

# Build
bun run build              # Build the library (svelte-package + publint)
bun run package            # Sync and package the library

# Testing
bun test                   # Run Vitest unit tests
bun test <pattern>         # Run specific tests matching pattern
bun run test:ui            # Open Vitest UI
bun run cypress            # Open Cypress for E2E tests
npx cypress run            # Run Cypress headless
npx cypress run --spec "cypress/e2e/<name>.cy.ts"  # Run single E2E test

# Type checking and linting
npx sv check               # Svelte type checking (run before commits)
bun run lint               # Biome linting
npx @biomejs/biome format --write .  # Format code
```

## Architecture

### Core Library (`src/lib/motion-start/`)

The library mirrors framer-motion's architecture adapted for Svelte 5:

- **motion/**: Core `Motion.svelte` component and `createRendererMotionComponent` factory. Components are created via proxies (`motion.div`, `m.div`).
- **render/**: VisualElement system - the abstraction layer between components and DOM/SVG rendering. `VisualElement.svelte.ts` manages animations outside React's render cycle.
- **components/**: Higher-order components:
  - `AnimatePresence/` - Manages exit animations for unmounting children
  - `LayoutGroup/` - Groups layout animations
  - `Reorder/` - Drag-to-reorder functionality
  - `LazyMotion/` - Code-splitting for features
- **context/**: Svelte 5 context system using `$state` for reactivity. Key contexts: `PresenceContext`, `MotionConfigContext`, `LayoutGroupContext`.
- **animation/**: Animation engine including generators (spring), WAAPI integration, and animation controls.
- **gestures/**: Pan, tap, hover, focus, and drag handlers.
- **projection/**: Layout projection system for FLIP animations.
- **value/**: MotionValue system for reactive animation values.

### Key Patterns

**Component API**: Uses Svelte 5's component API with runes (`$state`, `$derived`, `$effect`):
```svelte
<Motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
  Content
</Motion.div>
```

**Context System**: Uses Svelte built in createContext, but wraps getContext with a useContext for handing initial/default value.

**Feature Loading**: Features (animations, gestures, layout) are loaded via `loadFeatures()` for tree-shaking support.

### Demo Routes (`src/routes/`)

Example pages demonstrating features: `animate-presence-basics`, `layout-basics`, `reorder-basics`, `gestures-basics`, etc. These are also used by Cypress E2E tests.

## Technical Investigations

Active investigations and documentation are in `.claude/docs/`:
- `presence-layout-investigation.md` - PresenceChild context reactivity issue (exit + layout animations conflict)

## Issue Tracking

Uses **bd (beads)** for issue tracking. Key commands:
```bash
bd ready --json              # Find unblocked issues
bd create "Title" -t bug|feature|task -p 0-4 --json
bd update <id> --status in_progress --json
bd close <id> --reason "Done" --json
```
Always commit `.beads/issues.jsonl` with code changes.

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
