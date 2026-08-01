/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { describe, expect, test, vi } from 'vitest';
import { nextFrame } from '../../../test-utils/component-test-utils.js';
import { cleanDirtyNodes, propagateDirtyNodes } from '../create-projection-node.svelte.js';
import type { IProjectionNode, LayoutUpdateData } from '../types.js';
import { createTestNode } from './TestProjectionNode.svelte.js';

function nextMicrotask(): Promise<void> {
	return new Promise((resolve) => queueMicrotask(resolve));
}

function createInstance(id: string, max: number) {
	return {
		id,
		resetTransform: vi.fn(),
		box: {
			x: { min: 0, max },
			y: { min: 0, max },
		},
	};
}

describe('node', () => {
	test('If a child updates layout, and parent has scale, parent resetsTransform during measurement', async () => {
		const parent = createTestNode(undefined, {}, { scale: 2 });
		const parentInstance = createInstance('parent', 100);
		parent.mount(parentInstance);
		parent.addEventListener('didUpdate', ({ delta }: LayoutUpdateData) => parent.setTargetDelta(delta));

		const child = createTestNode(parent);
		const childInstance = createInstance('child', 50);
		child.mount(childInstance);
		child.addEventListener('didUpdate', ({ delta }: LayoutUpdateData) => child.setTargetDelta(delta));

		parent.willUpdate();
		child.willUpdate();
		parentInstance.box = {
			x: { min: 100, max: 200 },
			y: { min: 100, max: 200 },
		};
		childInstance.box = {
			x: { min: 150, max: 200 },
			y: { min: 150, max: 200 },
		};

		child.root.didUpdate();
		await nextFrame();

		expect(parentInstance.resetTransform).toBeCalledTimes(1);
		expect(childInstance.resetTransform).toBeCalledTimes(0);

		child.willUpdate();
		childInstance.box = {
			x: { min: 0, max: 150 },
			y: { min: 0, max: 150 },
		};
		child.root.didUpdate();
		await nextFrame();
		await nextMicrotask();

		expect(parentInstance.resetTransform).toBeCalledTimes(2);
		expect(childInstance.resetTransform).toBeCalledTimes(0);
	});

	test("If a child updates layout, parent doesn't resetsTransform during measurement if it has no projection transform", async () => {
		const parent = createTestNode();
		const parentInstance = createInstance('parent', 100);
		parent.mount(parentInstance);
		parent.addEventListener('didUpdate', ({ delta }: LayoutUpdateData) => parent.setTargetDelta(delta));

		const child = createTestNode(parent);
		const childInstance = createInstance('child', 50);
		child.mount(childInstance);
		child.addEventListener('didUpdate', ({ delta }: LayoutUpdateData) => child.setTargetDelta(delta));

		parent.willUpdate();
		child.willUpdate();
		childInstance.box = {
			x: { min: 150, max: 200 },
			y: { min: 150, max: 200 },
		};
		child.root.didUpdate();
		await nextFrame();

		expect(parentInstance.resetTransform).toBeCalledTimes(0);
		expect(childInstance.resetTransform).toBeCalledTimes(0);

		child.willUpdate();
		child.projectionDelta = {
			x: { translate: 100, scale: 1, originPoint: 60, origin: 0.4 },
			y: { translate: 0, scale: 1, originPoint: 60, origin: 0.4 },
		};
		childInstance.box = {
			x: { min: 0, max: 150 },
			y: { min: 0, max: 150 },
		};
		child.root.didUpdate();
		await nextFrame();

		expect(parentInstance.resetTransform).toBeCalledTimes(0);
		expect(childInstance.resetTransform).toBeCalledTimes(1);
	});

	describe('snapshotting a detached node', () => {
		function detachedNode(latestValues: Record<string, number>, target?: IProjectionNode<unknown>['target']) {
			const node = createTestNode(undefined, {}, latestValues);
			node.mount({ ...createInstance('detached', 50), isConnected: false });
			node.layout = {
				animationId: 0,
				measuredBox: { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } },
				layoutBox: { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } },
				latestValues: {},
				source: node.id,
			};
			node.target = target;
			node.updateSnapshot();
			return node.snapshot!;
		}

		test('keeps the transform in measuredBox so a handover animates from where the element was', () => {
			const snapshot = detachedNode({ x: 100, y: 20 });

			expect(snapshot.measuredBox.x).toEqual({ min: 100, max: 150 });
			expect(snapshot.measuredBox.y).toEqual({ min: 20, max: 70 });
			expect(snapshot.layoutBox.x).toEqual({ min: 0, max: 50 });
			expect(snapshot.layoutBox.y).toEqual({ min: 0, max: 50 });
		});

		test('leaves both boxes alone when there is no transform', () => {
			const snapshot = detachedNode({});

			expect(snapshot.measuredBox.x).toEqual({ min: 0, max: 50 });
			expect(snapshot.layoutBox.x).toEqual({ min: 0, max: 50 });
		});

		test('keeps the static layout box while snapshotting an in-flight target', () => {
			const snapshot = detachedNode({ x: 20 }, { x: { min: 100, max: 150 }, y: { min: 100, max: 150 } });

			expect(snapshot.measuredBox.x).toEqual({ min: 120, max: 170 });
			expect(snapshot.layoutBox.x).toEqual({ min: 0, max: 50 });
		});
	});

	describe('a projection pass that finds no layout change', () => {
		function nodeWithLayoutAnimation(animationProgress: number) {
			const visualElement = {
				current: {},
				mount: vi.fn(),
				getDefaultTransition: () => undefined,
				getProps: () => ({}),
				scheduleRender: vi.fn(),
				shouldReduceMotion: false,
				latestValues: {},
			};
			const node = createTestNode(undefined, { layout: true, visualElement: visualElement as any });
			node.mount(createInstance('animating', 50));

			const box = { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } };
			node.layout = {
				animationId: 0,
				measuredBox: box,
				layoutBox: box,
				latestValues: {},
				source: node.id,
			};
			node.targetLayout = box;

			node.currentAnimation = { stop: vi.fn() } as any;
			node.animationProgress = animationProgress;
			node.mixTargetDelta = vi.fn();

			node.notifyListeners('didUpdate', {
				layout: box,
				snapshot: node.layout,
				delta: {
					x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
					y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
				},
				layoutDelta: {
					x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
					y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
				},
				hasLayoutChanged: false,
				hasRelativeTargetChanged: false,
			} as LayoutUpdateData);

			node.unmount();

			return node;
		}

		test('leaves a layout animation that has not rendered a frame yet alone', () => {
			const node = nodeWithLayoutAnimation(0);

			expect(node.mixTargetDelta).not.toHaveBeenCalled();
			expect(node.currentAnimation).toBeDefined();
		});

		test('still finishes an animation that is already under way', () => {
			const node = nodeWithLayoutAnimation(0.5);

			expect(node.mixTargetDelta).toHaveBeenCalledWith(1000);
		});
	});

	describe('snapshotting a node that is being dragged', () => {
		function draggedNode({ attached }: { attached: boolean }) {
			const latestValues: Record<string, number> = { x: 0, y: 0 };
			const node = createTestNode(undefined, {}, latestValues);
			const instance = createInstance('dragged', 50);
			node.mount({ ...instance, isConnected: attached });
			node.layout = {
				animationId: 0,
				measuredBox: { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } },
				layoutBox: { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } },
				latestValues: {},
				source: node.id,
			};
			return { node, latestValues };
		}

		test('does not treat a non-DOM projection instance as detached', () => {
			const latestValues: Record<string, number> = { x: 0, y: 0 };
			const node = createTestNode(undefined, {}, latestValues);
			node.mount(createInstance('non-dom', 50));
			node.layout = {
				animationId: 0,
				measuredBox: { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } },
				layoutBox: { x: { min: 0, max: 50 }, y: { min: 0, max: 50 } },
				latestValues: {},
				source: node.id,
			};

			node.updateSnapshot();
			const first = node.snapshot;
			latestValues.x = 200;
			node.updateSnapshot();

			expect(node.snapshot).not.toBe(first);
		});

		test('retakes the snapshot once the element has been dragged away from it', () => {
			const { node, latestValues } = draggedNode({ attached: true });

			node.updateSnapshot();
			const first = node.snapshot;

			// A drag moves the element through its motion values without
			// re-rendering it, so nothing else invalidates the snapshot.
			latestValues.x = 200;
			node.updateSnapshot();

			expect(node.snapshot).not.toBe(first);
		});

		test('keeps the existing snapshot while the transform is unchanged', () => {
			const { node } = draggedNode({ attached: true });

			node.updateSnapshot();
			const first = node.snapshot;
			node.updateSnapshot();

			expect(node.snapshot).toBe(first);
		});

		test('keeps a detached node\u2019s first snapshot even as its values settle', () => {
			const { node, latestValues } = draggedNode({ attached: false });

			latestValues.x = 200;
			node.updateSnapshot();
			expect(node.snapshot!.measuredBox.x).toEqual({ min: 200, max: 250 });

			// The removed element cannot move again, but its motion values carry
			// on settling. Re-measuring on those would overwrite the origin a
			// `layoutId` handover animates from.
			latestValues.x = 40;
			node.updateSnapshot();

			expect(node.snapshot!.measuredBox.x).toEqual({ min: 200, max: 250 });
		});

		test('clearSnapshot forgets the transform the snapshot was taken under', () => {
			const { node, latestValues } = draggedNode({ attached: false });

			latestValues.x = 200;
			node.updateSnapshot();
			node.clearSnapshot();
			latestValues.x = 40;
			node.updateSnapshot();

			expect(node.snapshot!.measuredBox.x).toEqual({ min: 40, max: 90 });
		});
	});

	test('Subtrees with updated targets propagate isProjectionDirty to children', async () => {
		const a = createTestNode(undefined, {});
		const aInstance = createInstance('a', 100);
		a.mount(aInstance);

		const b = createTestNode(a);
		const bInstance = createInstance('b', 50);
		b.mount(bInstance);

		const c = createTestNode(b);
		const cInstance = createInstance('c', 50);
		c.mount(cInstance);

		const d = createTestNode(c);
		const dInstance = createInstance('d', 50);
		d.mount(dInstance);

		a.willUpdate();
		b.willUpdate();
		c.willUpdate();
		d.willUpdate();
		aInstance.box = {
			x: { min: 100, max: 200 },
			y: { min: 100, max: 200 },
		};
		bInstance.box = {
			x: { min: 150, max: 200 },
			y: { min: 150, max: 200 },
		};
		cInstance.box = {
			x: { min: 150, max: 200 },
			y: { min: 150, max: 200 },
		};
		dInstance.box = {
			x: { min: 100, max: 200 },
			y: { min: 100, max: 200 },
		};

		b.root.didUpdate();
		await nextFrame();
		b.setTargetDelta({
			x: { translate: 200, scale: 2, origin: 0.5, originPoint: 100 },
			y: { translate: 200, scale: 2, origin: 0.5, originPoint: 100 },
		});
		c.relativeTarget = { x: { min: 0, max: 100 }, y: { min: 0, max: 100 } };

		propagateDirtyNodes(a as IProjectionNode<unknown>);
		propagateDirtyNodes(b as IProjectionNode<unknown>);
		propagateDirtyNodes(c as IProjectionNode<unknown>);
		propagateDirtyNodes(d as IProjectionNode<unknown>);

		expect(a.isProjectionDirty).toEqual(false);
		expect(a.isSharedProjectionDirty).toEqual(false);
		expect(b.isProjectionDirty).toEqual(true);
		expect(b.isSharedProjectionDirty).toEqual(true);
		expect(c.isProjectionDirty).toEqual(false);
		expect(c.isSharedProjectionDirty).toEqual(true);
		expect(d.isProjectionDirty).toEqual(false);
		expect(d.isSharedProjectionDirty).toEqual(true);

		a.resolveTargetDelta();
		b.resolveTargetDelta();
		c.resolveTargetDelta();
		d.resolveTargetDelta();
		a.calcProjection();
		b.calcProjection();
		c.calcProjection();
		d.calcProjection();

		cleanDirtyNodes(a as IProjectionNode<unknown>);
		cleanDirtyNodes(b as IProjectionNode<unknown>);
		cleanDirtyNodes(c as IProjectionNode<unknown>);
		cleanDirtyNodes(d as IProjectionNode<unknown>);

		expect(
			a.isProjectionDirty ||
				a.isSharedProjectionDirty ||
				b.isProjectionDirty ||
				b.isSharedProjectionDirty ||
				c.isProjectionDirty ||
				c.isSharedProjectionDirty ||
				d.isProjectionDirty ||
				d.isSharedProjectionDirty
		).toEqual(false);
	});
});
