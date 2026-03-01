# motion-start

## 0.1.20

### Patch Changes

- 84d3657: fix: resolve bare dot and extension-less imports in value/ for Svelte REPL

  The Svelte playground CDN resolves ESM imports without a bundler, requiring explicit file extensions and no bare directory imports. Bare dot imports like `from '.'` compiled to JS caused the REPL to fail resolving `dist/value/` as a directory path.

  Fixed by replacing all `from '.'`, `from '..'`, and extension-less relative imports within the value/ directory with explicit `./index.js` paths and proper `.js` extensions.

## 0.1.19

### Patch Changes

- e036a76: Remove `sideEffects: false` from `package.json` to fix module resolution in the Svelte REPL playground.

  Bundlers honour this flag by tree-shaking modules that are imported only for their side effects. In the Svelte playground this caused the module that resolves the `"."` bare specifier to be dropped entirely, producing:

  > error occurred while trying to resolve `.` within `npm://$/motion-start@0.1.18/dist/value/use-motion-template.js`

## 0.1.18

### Patch Changes

- ff1a37e: add layout animation helper

## 0.1.17

### Patch Changes

- 9e4b5cf: fix motion svg
- 456528a: fix motion svg namespace

## 0.1.16

### Patch Changes

- f8dd358: allow spreading props

## 0.1.15

### Patch Changes

- 1f07118: revert

## 0.1.14

### Patch Changes

- a1f2c47: fix svg not appearing with motion use

## 0.1.13

### Patch Changes

- 39d3b8b: improve import consistancy and fix svelte repl

## 0.1.12

### Patch Changes

- f8ab887: fix svelte repl usage

## 0.1.11

### Patch Changes

- 6101a3b: remove main from package.json

## 0.1.10

### Patch Changes

- b4fe2aa: correct exports to export svelte and js

## 0.1.9

### Patch Changes

- c21ab29: export correct extensions

## 0.1.8

### Patch Changes

- 071b96d: move dist files to src for import use

## 0.1.7

### Patch Changes

- d8212b9: fix usage in svelte repl

## 0.1.6

### Patch Changes

- b6f6602: add all files in dist to files property package.json

## 0.1.5

### Patch Changes

- 2996dae: add back style-value-types just incase

## 0.1.4

### Patch Changes

- 7f6010b: fix peer deps including melt-ui because of bits-ui dep

## 0.1.3

### Patch Changes

- 61bcd64: fix export path for svelte comp

## 0.1.2

### Patch Changes

- 25f1b6e: export MotionSSR

## 0.1.1

### Patch Changes

- 98cfaba: chore: 🤖 release
- 4f1b2e7: enable layout animation feature
- 9f5a69c: fix layout animations

## 0.1.0

### Minor Changes

- passing tests, handle minimal-motion for lazymotion,update API for motion to align more with framer-motion API usage

## 0.0.3

### Patch Changes

- fix package source

## 0.0.2

### Patch Changes

- 5492e7b: fix animations
