# TDD Agents

This directory contains agents used to enforce Test-Driven Development (TDD) workflows in Motion Start.

## Agents

- **tdd-red.agent.md** — RED phase: write failing tests first. Do not modify implementation code.
- **tdd-green.agent.md** — GREEN phase: implement the minimum code required to pass the failing tests.
- **tdd-refactor.agent.md** — REFACTOR phase: improve code quality while keeping all tests green; do not change behavior.

## Recommended Workflow

1. **Red**: Add failing tests for the new behavior (happy path, edges, errors). Confirm they fail.
2. **Green**: Implement the smallest change necessary to pass the tests. Keep scope tight.
3. **Refactor**: Clean up the implementation with tests staying green. Small, safe steps.
4. **Land the Plane**:
   - `npx sv check`
   - `npx cypress run` (or targeted specs)
   - Update/close bd issues (`bd update`, `bd close --json`)
   - Format with Biome (`npx @biomejs/biome format --write .`)
   - Commit code changes together with `.beads/issues.jsonl`
   - Provide a concise summary of changes, test results, and follow-ups

## Notes

- See `AGENTS.md` for project-wide guidance and conventions.
- Follow existing test patterns (see `docs/TESTING.md`).
- Prefer incremental, test-backed commits.
