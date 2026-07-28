import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import type { Box } from '../../../projection/geometry/types.js';
import type { ReorderContext } from '../types.js';
import ReorderGroupFixture from './ReorderGroupFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

function box(min: number, max: number): Box {
	return { x: { min: 0, max: 0 }, y: { min, max } };
}

describe('Reorder.Group order reconciliation', () => {
	it('ignores items removed from values when picking the next reorder target', async () => {
		const reorders: string[][] = [];
		const captured: { context: ReorderContext<string> | null } = { context: null };

		instance = mount(ReorderGroupFixture, {
			target: document.body,
			props: {
				onReorder: (values: string[]) => reorders.push(values),
				oncontext: (context: ReorderContext<string> | null) => {
					captured.context = context;
				},
			},
		});
		flushSync();

		const context = captured.context;
		if (!context) throw new Error('Reorder.Group did not provide a context');

		// Initial measurement of a contiguous vertical list.
		context.registerItem('a', box(0, 50));
		context.registerItem('b', box(50, 150));
		context.registerItem('c', box(150, 200));
		context.registerItem('d', box(200, 350));

		(document.querySelector('[data-testid="remove-c"]') as HTMLButtonElement).click();
		flushSync();

		// Removing "c" shifts the survivors up, and they re-measure via
		// onLayoutMeasure. "c" is gone, so it never re-registers.
		context.registerItem('a', box(0, 50));
		context.registerItem('b', box(50, 150));
		context.registerItem('d', box(150, 300));

		// Drag "b" past the centre of "d" at its real, post-removal position (225).
		// A stale entry for "c" would be treated as the next target instead, so the
		// swap would resolve back to the current values and the drag would stick.
		context.updateOrder('b', 90, 1);
		await tick();
		await tick();

		expect(reorders.at(-1)).toEqual(['a', 'd', 'b']);
	});
});
