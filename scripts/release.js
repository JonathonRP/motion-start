#!/usr/bin/env bun
import { $ } from 'bun';
import { getNpmTag } from './get-npm-tag.js';

const tag = getNpmTag();

await $`npm publish --access public --tag ${tag}`;
await $`npx changeset tag`;
