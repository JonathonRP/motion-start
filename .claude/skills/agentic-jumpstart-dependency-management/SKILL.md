---
name: agentic-jumpstart-dependency-management
description: "Dependency management best practices for Svelte 5 libraries using Bun. Use when managing dependencies, updating packages, configuring exports, optimizing bundle size, or when the user mentions dependencies, packages, npm, bun, or library distribution."
---

# Dependency Management for motion-start

This skill provides dependency management guidelines for the motion-start Svelte 5 animation library.

## Package Manager: Bun

```json
{
  "engines": {
    "bun": ">=1.0.0",
    "node": ">=20"
  }
}
```

### Common Commands

```bash
# Install dependencies
bun install

# Add dependency
bun add <package>

# Add dev dependency
bun add -d <package>

# Add peer dependency
bun add --peer <package>

# Remove dependency
bun remove <package>

# Update all
bun update

# Update specific package
bun update <package>
```

## Dependency Categories

### Runtime Dependencies (Minimal)

```json
{
  "dependencies": {
    "csstype": "^3.2.3"
  }
}
```

Keep runtime dependencies minimal for smaller bundle size.

### Peer Dependencies

```json
{
  "peerDependencies": {
    "svelte": "^5.46.1"
  }
}
```

Use peer dependencies for:
- Framework dependencies (Svelte)
- Packages consumers should control versions of

### Dev Dependencies

| Category | Packages |
|----------|----------|
| **Build** | @sveltejs/kit, @sveltejs/package, vite, @sveltejs/vite-plugin-svelte |
| **Types** | typescript, svelte-check, @tsconfig/svelte, @types/node |
| **Testing** | vitest, cypress, cypress-real-events, happy-dom |
| **Linting** | @biomejs/biome |
| **Publishing** | @changesets/cli, publint |
| **Styling** | tailwindcss, @tailwindcss/vite, tailwind-merge |

## Package Exports

### Exports Configuration

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json",
    "./src/context/MotionContext": {
      "types": "./dist/context/MotionContext/index.d.ts",
      "svelte": "./dist/context/MotionContext/index.js",
      "import": "./dist/context/MotionContext/index.js",
      "default": "./dist/context/MotionContext/index.js"
    }
  }
}
```

### Export Conditions Order

1. `types` - TypeScript definitions (first for tooling)
2. `svelte` - Svelte-specific entry
3. `import` - ESM import
4. `default` - Fallback

### Wildcard Exports

```json
{
  "./src/*.js": {
    "types": "./dist/*.d.ts",
    "svelte": "./dist/*.js",
    "import": "./dist/*.js",
    "default": "./dist/*.js"
  },
  "./src/*.svelte": {
    "types": "./dist/*.d.ts",
    "svelte": "./dist/*.svelte",
    "default": "./dist/*.svelte"
  }
}
```

## Versioning Strategy

### Semantic Versioning with Caret

```json
{
  "typescript": "^5.9.3",
  "@sveltejs/kit": "^2.49.2"
}
```

- Allows minor and patch updates
- Prevents breaking changes

### Latest Tag (Use Sparingly)

```json
{
  "@types/bun": "latest",
  "vitest": "latest"
}
```

Only for dev dependencies with stable APIs.

## Trusted Dependencies

```json
{
  "trustedDependencies": [
    "@biomejs/biome",
    "@sveltejs/kit",
    "@swc/core",
    "@tailwindcss/oxide",
    "cypress",
    "esbuild",
    "sharp",
    "svelte-preprocess",
    "workerd"
  ]
}
```

Only add packages that:
- Require native binaries
- Are from reputable sources
- Need postinstall scripts

## Bundle Optimization

### Files Field

```json
{
  "files": [
    "dist",
    "!dist/**/*.test.*",
    "!dist/**/*.spec.*"
  ]
}
```

Excludes test files from published package.

### Build Scripts

```json
{
  "scripts": {
    "build": "bun --bun package",
    "package": "svelte-kit sync && svelte-package --input ./src/lib/motion-start && publint --strict"
  }
}
```

### Tree-Shaking

Feature bundles enable tree-shaking:

```typescript
// Consumers choose what to include
import { domMin } from 'motion-start';      // Minimal
import { domAnimation } from 'motion-start'; // Standard
import { domMax } from 'motion-start';       // Full
```

## Type Generation

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

## Changesets Workflow

```bash
# Create a changeset
bunx changeset

# Version packages
bunx changeset version

# Publish
bun run release
# runs: bun --bun run build && bun --bun changeset publish
```

## Update Workflow

```bash
# Check outdated
bun outdated

# Update all
bun update

# Update specific
bun update <package>

# Validate
bun test
npx sv check
bunx publint --strict
```

## Publint Validation

```bash
bunx publint --strict
```

Validates:
- Correct exports configuration
- Proper type definitions
- Package.json standards
- Module resolution

## Module Configuration

```json
{
  "type": "module",
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

TypeScript module settings:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "verbatimModuleSyntax": true
  }
}
```

## Adding Dependencies Checklist

When adding a new dependency:

- [ ] Evaluate if truly needed
- [ ] Check bundle size impact
- [ ] Prefer dev over runtime where possible
- [ ] Use appropriate version constraint
- [ ] Run `bun run build` to verify
- [ ] Run `bun test` to check compatibility
- [ ] Run `bunx publint --strict` for exports

## Security

```bash
# Audit (use npm for audit)
npm audit --omit=dev

# Regular updates for security patches
bun update
```
