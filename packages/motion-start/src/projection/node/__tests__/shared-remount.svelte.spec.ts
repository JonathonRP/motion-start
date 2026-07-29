import { describe, expect, test, vi } from 'vitest';
import { nextFrame } from '../../../test-utils/component-test-utils.js';
import type { Box } from '../../geometry/types.js';
import { createTestNode } from './TestProjectionNode.svelte.js';

function createInstance(id: string, min: number, max: number) {
	const instance = {
		id,
		resetTransform: vi.fn(),
		box: {
			x: { min, max },
			y: { min: 0, max: 50 },
		} as Box,
	};

	const visualElement = {
		current: instance,
		mount: vi.fn(),
		notify: vi.fn(),
		render: vi.fn(),
		scheduleRender: vi.fn(),
		setStaticValue: vi.fn(),
		getProps: () => ({}),
		getDefaultTransition: () => undefined,
		shouldReduceMotion: false,
		latestValues: {},
		measureViewportBox: () => ({
			x: { ...instance.box.x },
			y: { ...instance.box.y },
		}),
	};

	return { instance, visualElement };
}

function createNode(parent: any, min: number, max: number, options: Record<string, unknown> = {}) {
	const { instance, visualElement } = createInstance(`${min}-${max}`, min, max);
	const node = createTestNode(parent, {
		// The animation path needs a full VisualElement; these tests only care
		// about the layout handover, so measurement is all that's wired up.
		animate: false,
		visualElement: visualElement as any,
		...options,
	});
	node.mount(instance);
	return node;
}

/**
 * A `layoutId` element that unmounts from one parent and mounts into another in
 * the same update - the "magic motion" handover. Svelte, unlike React, does not
 * rerender the outgoing element before the incoming one mounts, and the two
 * branches can commit in either order depending on where they sit in the tree.
 * Both orders have to leave the incoming node with a snapshot of where the
 * outgoing one was, otherwise the element teleports with `transform: none`.
 */
describe('shared layoutId across parents', () => {
	async function setup(layoutId: string) {
		const parentA = createNode(undefined, 0, 100);
		const parentB = createNode(undefined, 200, 300);
		const outgoing = createNode(parentA, 0, 50, { layoutId, layout: true });

		parentA.willUpdate();
		parentB.willUpdate();
		outgoing.willUpdate();
		outgoing.root.didUpdate();
		await nextFrame();

		expect(outgoing.layout?.layoutBox.x).toEqual({ min: 0, max: 50 });

		return { parentB, outgoing };
	}

	test('hands the layout over when the outgoing branch is destroyed first', async () => {
		const layoutId = 'card-destroy-first';
		const { parentB, outgoing } = await setup(layoutId);

		outgoing.unmount();

		const incoming = createNode(parentB, 200, 250, { layoutId, layout: true });

		expect(incoming.resumeFrom).toBe(outgoing);
		expect(incoming.snapshot?.layoutBox.x).toEqual({ min: 0, max: 50 });
	});

	test('hands the layout over when the incoming branch is created first', async () => {
		const layoutId = 'card-create-first';
		const { parentB, outgoing } = await setup(layoutId);

		const incoming = createNode(parentB, 200, 250, { layoutId, layout: true });

		expect(incoming.resumeFrom).toBe(outgoing);
		expect(incoming.snapshot?.layoutBox.x).toEqual({ min: 0, max: 50 });

		outgoing.unmount();

		expect(incoming.snapshot?.layoutBox.x).toEqual({ min: 0, max: 50 });
	});

	test('leaves the incoming node with an origin that differs from its new layout', async () => {
		const layoutId = 'card-origin';
		const { parentB, outgoing } = await setup(layoutId);

		outgoing.unmount();

		const incoming = createNode(parentB, 200, 250, { layoutId, layout: true });

		incoming.willUpdate();
		incoming.root.didUpdate();
		await nextFrame();

		expect(incoming.layout?.layoutBox.x).toEqual({ min: 200, max: 250 });
		expect(incoming.snapshot?.layoutBox.x).not.toEqual(incoming.layout?.layoutBox.x);
	});
});
