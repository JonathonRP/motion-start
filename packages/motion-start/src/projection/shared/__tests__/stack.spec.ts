import { describe, expect, it, vi } from 'vitest';
import type { IProjectionNode, Measurements } from '../../node/types.js';
import { NodeStack } from '../stack.js';

function createNode(id: string) {
	const node = {
		instance: document.createElement('div'),
		isPresent: true,
		latestValues: { id },
		options: {},
		scheduleRender: vi.fn(),
		show: vi.fn(),
	} as unknown as IProjectionNode<HTMLElement>;

	return node;
}

describe('NodeStack', () => {
	it('does not synthesize an exiting lead snapshot from its static layout', () => {
		const stack = new NodeStack<HTMLElement>();
		const previous = createNode('previous');
		const next = createNode('next');
		previous.isPresent = false;
		previous.layout = {
			animationId: 1,
			layoutBox: { x: { min: 100, max: 300 }, y: { min: 100, max: 300 } },
			measuredBox: { x: { min: 100, max: 300 }, y: { min: 100, max: 300 } },
			latestValues: {},
			source: 1,
		} as Measurements;

		stack.add(previous);
		stack.add(next);
		stack.promote(previous);
		stack.promote(next);

		expect(next.resumeFrom).toBe(previous);
		expect(next.snapshot).toBeUndefined();
	});

	it('supplies the missing pre-commit snapshot when a present Svelte sibling does not rerender', () => {
		const stack = new NodeStack<HTMLElement>();
		const previous = createNode('previous');
		const next = createNode('next');
		previous.layout = {
			animationId: 1,
			layoutBox: { x: { min: 100, max: 300 }, y: { min: 100, max: 300 } },
			measuredBox: { x: { min: 100, max: 300 }, y: { min: 100, max: 300 } },
			latestValues: {},
			source: 1,
		} as Measurements;

		stack.add(previous);
		stack.add(next);
		stack.promote(previous);
		stack.promote(next);

		expect(next.snapshot).toEqual({
			...previous.layout,
			layoutBox: { x: { min: 100, max: 300 }, y: { min: 100, max: 300 } },
			measuredBox: { x: { min: 100, max: 300 }, y: { min: 100, max: 300 } },
			latestValues: { id: 'previous' },
		});
		expect(next.snapshot).not.toBe(previous.layout);
	});

	it('transfers an existing snapshot and current animation values', () => {
		const stack = new NodeStack<HTMLElement>();
		const previous = createNode('previous');
		const next = createNode('next');
		const snapshot = {
			animationId: 1,
			layoutBox: { x: { min: 0, max: 100 }, y: { min: 0, max: 100 } },
			measuredBox: { x: { min: 0, max: 100 }, y: { min: 0, max: 100 } },
			latestValues: {},
			source: 1,
		} as Measurements;
		previous.snapshot = snapshot;
		previous.animationValues = { opacity: 0.5 };

		stack.add(previous);
		stack.add(next);
		stack.promote(previous);
		stack.promote(next);

		expect(next.snapshot).toBe(snapshot);
		expect(next.snapshot?.latestValues).toBe(previous.animationValues);
	});
});
