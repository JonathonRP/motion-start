# Agent Instructions

## Project Overview
- Motion Start: Svelte 5 port of framer-motion. Animations, gestures, layout projection, TypeScript-first.
- Tech: SvelteKit + Svelte 5 runes, TypeScript, TailwindCSS, Biome, Cypress E2E.
- Key paths: `src/lib/motion-start` (core), `src/routes` (examples), `cypress/` (tests), `docs/` (project docs), `history/` (investigations/plans).
- See `.github/copilot-instructions.md` for quick-start commands and conventions.

## Non-Negotiable Rules
- Prefer Svelte 5 runes for new code; legacy components may temporarily use `runes={false}` during migration.
- Fix TypeScript and `svelte-check` issues incrementally; avoid `any` unless absolutely necessary.
- Default to ASCII for edits. Only add non-ASCII if already present and necessary.
- Keep planning docs in history/; avoid cluttering repo root.

## TDD Workflow (for new tasks/features/bugs)
- Red: Write failing tests first (Cypress E2E under `cypress/e2e/`, or targeted tests), no implementation yet.
- Green: Implement the smallest change necessary to pass.
- Refactor: Improve code with tests staying green.
- Prefer incremental, test-backed commits; avoid large untested edits.

Common test commands:
```bash
# Svelte type checks
npx sv check

# Run a specific Cypress spec
npx cypress run --spec cypress/e2e/animate-presence.cy.ts

# Run all Cypress specs
npx cypress run
```

## TDD Agents (Red → Green → Refactor)

To standardize TDD, the repo includes three agents under `.github/agents/`:

- `tdd-red.agent.md` – Writes failing tests first (no implementation edits)
- `tdd-green.agent.md` – Implements the minimum code to pass those tests
- `tdd-refactor.agent.md` – Refactors with all tests green, no behavior changes

**Recommended flow for new tasks/features/bugs:**
1. Start with Red agent to author failing tests aligning with the requirement.
2. Handoff to Green agent to implement the minimal solution and get tests passing.
3. Handoff to Refactor agent for cleanup while keeping tests green.
4. Land the plane: run `npx sv check`, `npx cypress run`, format, commit, and provide a concise session summary.

## Landing the Plane (Complete Sessions)
When asked to "land the plane", you MUST run all tests and finalize work:
1. Run all quality gates:
   - `npx sv check`
   - `npx cypress run` (or targeted specs if scoped changes)
2. Ensure formatting/linting are clean: `npx @biomejs/biome format --write .`
3. Ensure working tree is tidy (no untracked files).
4. Provide a concise summary: what changed, test results, and any follow-ups.

## Day-to-Day Development
- Code style: run Biome formatter when changing TS/JS/Svelte (`npx @biomejs/biome format --write .` if needed).
- Types: prefer precise types; avoid `any`; fix svelte-check issues incrementally.
- Components: prefer runes patterns (`<svelte:options runes={true} />`, $state/$derived/$effect) for new work.
- If unsure about a change, ask questions early and prefer smaller, test-backed commits.

## Documentation & References
- `.github/copilot-instructions.md` – runtime commands, project structure.
- `docs/ARCHITECTURE.md` – architectural overview.
- `docs/PROJECT_STRUCTURE.md` – directory layout.
- `docs/RUNES_MIGRATION.md` – Svelte 5 migration notes.
- `docs/TESTING.md` – testing strategy.
- `history/` – investigation and planning documents.

## Important Files
- docs/ARCHITECTURE.md - Project architecture
- docs/PROJECT_STRUCTURE.md - Project structure
- docs/TESTING.md - Project testing
- README.md - Main documentation

## Available MCP Tools

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation.

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
