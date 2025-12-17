# Agent Instructions

## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Auto-syncs to JSONL for version control
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**
```bash
bd ready --json
```

**Create new issues:**
```bash
bd create "Issue title" -t bug|feature|task -p 0-4 --json
bd create "Issue title" -p 1 --deps discovered-from:bd-123 --json
bd create "Subtask" --parent <epic-id> --json  # Hierarchical subtask (gets ID like epic-id.1)
```

**Claim and update:**
```bash
bd update bd-42 --status in_progress --json
bd close bd-42 --reason "Completed" --json
```

**Complete work:**
```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task**: `bd update <id> --status in_progress`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`
6. **Commit together**: Always commit the `.beads/issues.jsonl` file together with the code changes so issue state stays in sync with code state

### Auto-Sync

bd automatically syncs with git:
- Exports to `.beads/issues.jsonl` after changes (5s debounce)
- Imports from JSONL when newer (e.g., after `git pull`)
- No manual export/import needed!

### GitHub Copilot Integration

If using GitHub Copilot, also create `.github/copilot-instructions.md` for automatic instruction loading.
Run `bd onboard` to get the content, or see step 2 of the onboard instructions.

### MCP Server (Recommended)

If using Claude or MCP-compatible clients, install the beads MCP server:

```bash
pip install beads-mcp
```

Add to MCP config (e.g., `~/.config/claude/config.json`):
```json
{
  "beads": {
    "command": "beads-mcp",
    "args": []
  }
}
```

Then use `mcp__beads__*` functions instead of CLI commands.

### Managing AI-Generated Planning Documents

AI assistants often create planning and design documents during development:
- PLAN.md, IMPLEMENTATION.md, ARCHITECTURE.md
- DESIGN.md, CODEBASE_SUMMARY.md, INTEGRATION_PLAN.md
- TESTING_GUIDE.md, TECHNICAL_DESIGN.md, and similar files

**Best Practice: Use a dedicated directory for these ephemeral files**

**Recommended approach:**
- Create a `history/` directory in the project root
- Store ALL AI-generated planning/design docs in `history/`
- Keep the repository root clean and focused on permanent project files
- Only access `history/` when explicitly asked to review past planning

**Example .gitignore entry (optional):**
```
# AI planning documents (ephemeral)
history/
```

**Benefits:**
- ✅ Clean repository root
- ✅ Clear separation between ephemeral and permanent documentation
- ✅ Easy to exclude from version control if desired
- ✅ Preserves planning history for archeological research
- ✅ Reduces noise when browsing the project

### CLI Help

Run `bd <command> --help` to see all available flags for any command.
For example: `bd create --help` shows `--parent`, `--deps`, `--assignee`, etc.

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ✅ Store AI planning docs in `history/` directory
- ✅ Run `bd <cmd> --help` to discover available flags
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems
- ❌ Do NOT clutter repo root with planning documents

## Project Snapshot
- Motion Start: Svelte 5 port of framer-motion. Animations, gestures, layout projection, TypeScript-first.
- Tech: SvelteKit + Svelte 5 runes, TypeScript, TailwindCSS, Biome formatter, Cypress E2E.
- Key paths: src/lib/motion-start for core library; src/routes for examples/demos; history/ for AI planning docs.

## Non-Negotiable Rules
- Track ALL work in bd (beads). Never create markdown TODO lists or other trackers.
- Default to ASCII for edits. Only add non-ASCII if already present and necessary.
- Keep planning docs in history/ (avoid cluttering repo root).
- Follow Svelte 5 runes for new components; legacy components may still use runes={false} during migration.

## Issue Tracking with bd (beads)
- Ready work: `bd ready --json`
- Create: `bd create "Title" -t bug|feature|task -p 0-4 --json`
- Link discovered work: `bd create "Found bug" -p 1 --deps discovered-from:<parent-id> --json`
- Claim: `bd update <id> --status in_progress --json`
- Close: `bd close <id> --reason "Done" --json`
- Always commit `.beads/issues.jsonl` with code changes; bd auto-syncs (exports after changes, imports if newer after pull).

## Working Style (TDD-first)
- For new tasks/features/bugs, run a full TDD loop:
  - **Red:** Add failing tests only (no implementation). Cover happy path, edges, and error cases. Match existing test style.
  - **Green:** Implement the minimum code to pass the new tests. Keep scope tight.
  - **Refactor:** Clean up with tests staying green; prefer small safe steps.
- When tests already exist, still aim for incremental red→green→refactor changes rather than large untested edits.

## Day-to-Day Development
- Before coding: check `bd ready`, claim the issue, and skim relevant files in src/lib/motion-start and docs/.
- Code style: run Biome formatter when changing TS/JS/Svelte (`npx @biomejs/biome format --write .` if needed).
- Types: prefer precise types; avoid `any`; fix svelte-check issues incrementally.
- Components: prefer runes patterns (`<svelte:options runes={true} />`, $state/$derived/$effect) for new work.

## Landing the Plane
When the user says "land the plane", complete these steps before handing off:
1) File/close/update bd issues so state matches the work done.
2) Run all quality gates when code changed: `npx sv check`, relevant unit/E2E suites (`pnpm test` or targeted Cypress specs), and ensure they pass or file bd issues for failures.
3) Ensure formatting/linting is clean (Biome, etc.) and working tree is tidy.
4) Summarize what changed, test results, and bd status; highlight any follow-ups.

## Useful Reminders
- Use `bd <cmd> --help` to see flags (e.g., parent/deps/assignee).
- Keep AI-generated plans in history/; only access when asked.
- If unsure about a change, ask questions early and prefer smaller, test-backed commits.

#Important Files
- docs/ARCHITECTURE.md - Project architecture
- docs/PROJECT_STRUCTURE.md - Project structure
- docs/TESTING.md - Project testing
- README.md - Main documentation