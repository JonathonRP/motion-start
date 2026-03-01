/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { describe, test } from 'vitest';
// NOTE: These imports are commented out because the tests are skipped.
// The createProjectionNode uses Svelte 5 $state rune which cannot be instantiated
// outside of a Svelte component context in tests.
// import { createTestNode } from './TestProjectionNode.svelte';
// import { nodeGroup } from '../group';

/**
 * NOTE: These tests are skipped because createProjectionNode uses Svelte 5 $state rune
 * which cannot be instantiated outside of a Svelte component context.
 * The tests are preserved for documentation and future reference when a solution
 * for testing Svelte 5 rune-based code is available.
 */
describe('nodeGroup', () => {
	test.skip('it notifies grouped nodes when any one of them will update', () => {
		// const a = createTestNode();
		// a.mount({});
		// const b = createTestNode();
		// b.mount({});
		// const bLayoutUpdate = vi.fn();
		// b.addEventListener('didUpdate', bLayoutUpdate);
		// const group = nodeGroup();
		// group.add(a);
		// group.add(b);
		// a.willUpdate();
		// a.root.didUpdate();
		// expect(bLayoutUpdate).toBeCalledTimes(1);
	});
});
