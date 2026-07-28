#!/usr/bin/env bun
import { $ } from 'bun';
import { fileURLToPath } from 'node:url';
import { getNpmTag } from './get-npm-tag.js';

const tag = getNpmTag();

// `npm publish` publishes whatever is in cwd, and cwd here is the private
// workspace root - so it has to be pointed at the package explicitly.
const pkgDir = fileURLToPath(new URL('../packages/motion-start', import.meta.url));

await $`npm publish --access public --tag ${tag}`.cwd(pkgDir);
// `changeset tag` reads the changesets config, which lives at the root.
await $`npx changeset tag`;
