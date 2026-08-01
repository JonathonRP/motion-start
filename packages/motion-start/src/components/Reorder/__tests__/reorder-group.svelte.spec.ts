import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import type { Box } from '../../../projection/geometry/types.js';
import type { ReorderContext } from '../types.js';
import ReorderGroupFixture from './ReorderGroupFixture.svelte';
import ReorderGroupInvariantFixture from './ReorderGroupInvariantFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

function box(min: number, max: number): Box {
	return { x: { min: 0, max: 0 }, y: { min, max } };
}

function getRenderedItems() {
	return Array.from(document.querySelectorAll('[data-testid^="item-"]'), (item) => item.textContent);
}

describe('Reorder.Group order reconciliation', () => {
	it('throws if values becomes missing in development', () => {
		instance = mount(ReorderGroupInvariantFixture, {
			target: document.body,
		});
		flushSync();

		const removeValues = document.querySelector('[data-testid="remove-values"]');
		if (!(removeValues instanceof HTMLButtonElement)) {
			throw new Error('Missing remove-values button');
		}

		expect(() => {
			flushSync(() => removeValues.click());
		}).toThrowError('Reorder.Group must be provided a values prop');
	});

	it('publishes layout invalidation before updating keyed children', async () => {
		const captured: { context: ReorderContext<string> | null } = { context: null };
		const reorderSnapshots: Array<{
			token: unknown;
			renderedItems: (string | null)[];
		}> = [];

		instance = mount(ReorderGroupFixture, {
			target: document.body,
			props: {
				onReorder: () => {
					reorderSnapshots.push({
						token: captured.context?.layoutInvalidation.current,
						renderedItems: getRenderedItems(),
					});
				},
				oncontext: (context: ReorderContext<string> | null) => {
					captured.context = context;
				},
			},
		});
		flushSync();

		const context = captured.context;
		if (!context) throw new Error('Reorder.Group did not provide a context');

		expect(context.layoutInvalidation).toBeDefined();

		context.registerItem('a', box(0, 50));
		context.registerItem('b', box(50, 150));
		context.registerItem('c', box(150, 200));
		context.registerItem('d', box(200, 350));

		const initialToken = context.layoutInvalidation.current;

		context.updateOrder('b', 0, 1);
		expect(context.layoutInvalidation.current).toBe(initialToken);

		context.updateOrder('b', 30, 1);
		expect(context.layoutInvalidation.current).toBe(initialToken);
		expect(reorderSnapshots).toEqual([]);

		await tick();

		const updatedToken = context.layoutInvalidation.current;
		expect(updatedToken).not.toBe(initialToken);
		expect(reorderSnapshots).toEqual([
			{
				token: updatedToken,
				renderedItems: ['a', 'b', 'c', 'd'],
			},
		]);
		expect(getRenderedItems()).toEqual(['a', 'c', 'b', 'd']);
	});

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

	it('unregisters conditionally rendered items even when values still contains them', async () => {
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

		context.registerItem('a', box(0, 50));
		context.registerItem('b', box(50, 150));
		context.registerItem('c', box(150, 200));
		context.registerItem('d', box(200, 350));
		context.unregisterItem('c');
		context.registerItem('d', box(150, 300));

		context.updateOrder('b', 90, 1);
		await tick();
		await tick();

		expect(reorders.at(-1)).toEqual(['a', 'd', 'b']);
	});
});
