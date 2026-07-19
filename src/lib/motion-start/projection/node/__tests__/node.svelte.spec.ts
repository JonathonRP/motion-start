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

	test('Subtrees with updated targets propagate isProjectionDirty to children', async () => {
		const a = createTestNode(undefined, {});
		const aInstance = createInstance('a', 100);
		a.mount(aInstance);

		const b = createTestNode(a);
		const bInstance = createInstance('b', 50);
		b.mount(bInstance);

		const c = createTestNode(b);
		const cInstance = createInstance('c', 50);
		c.mount(bInstance);

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
