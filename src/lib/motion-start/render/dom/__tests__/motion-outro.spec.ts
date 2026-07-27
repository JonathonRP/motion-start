import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MotionOutroContext } from '../../../context/OutroContext.svelte.js';
import type { IProjectionNode } from '../../../projection/node/types.js';
import type { VisualElement } from '../../VisualElement.svelte.js';
import { flushPendingMotionExitLayout, motionEnterIntro, motionExitOutro } from '../motion-outro.js';

afterEach(() => {
	document.body.innerHTML = '';
});

function createContext(presenceAffectsLayout = true) {
	const complete = vi.fn();
	const reserve = vi.fn();
	const context: MotionOutroContext = {
		custom: undefined,
		mode: 'sync',
		presenceAffectsLayout,
		begin: () => complete,
		reserve,
		remaining: () => 0,
		waitForExit: () => Promise.resolve(),
	};

	return { complete, context, reserve };
}

function createVisualElement(node: HTMLElement, transition: Record<string, unknown>) {
	const update = vi.fn();
	const didUpdate = vi.fn();
	const root = {
		didUpdate,
		isUpdating: true,
		nodes: undefined,
		update,
	} as unknown as IProjectionNode<unknown>;
	const projection = {
		root,
		options: {
			layoutId: 'box',
			transition,
		},
		isPresent: true,
		promote: vi.fn(),
		willUpdate: vi.fn(),
	} as unknown as IProjectionNode<unknown>;
	const visualElement = {
		current: node,
		projection,
		presenceContext: null,
		prevPresenceContext: undefined,
		animationState: {
			setActive: vi.fn(() => Promise.resolve()),
		},
		values: new Map(),
		children: new Set(),
		getProps: () => ({}),
		getDefaultTransition: () => transition,
	} as unknown as VisualElement<HTMLElement>;

	return { didUpdate, projection, root, update, visualElement };
}

describe('motionExitOutro', () => {
	it('retains an afterChildren parent through its child and parent animation durations', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context, reserve } = createContext();
		const child = {
			children: new Set(),
			values: new Map([
				[
					'opacity',
					{
						animation: {
							duration: 0.1,
							options: {},
						},
					},
				],
			]),
		};
		const visualElement = {
			animationState: {
				setActive: vi.fn(() => new Promise(() => undefined)),
			},
			children: new Set([child]),
			current: node,
			getDefaultTransition: () => undefined,
			getProps: () => ({
				exit: {
					opacity: 0,
					transition: { duration: 0.1, when: 'afterChildren' },
				},
			}),
			presenceContext: null,
			prevPresenceContext: undefined,
			values: new Map(),
		} as unknown as VisualElement<HTMLElement>;

		const config = motionExitOutro(node, { context, visualElement });

		expect(config.duration).toBe(241);
		expect(reserve).toHaveBeenCalledWith(241);
	});

	it('retains an afterChildren parent through a configured child exit variant before it starts running', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context, reserve } = createContext();
		const child = {
			children: new Set(),
			getDefaultTransition: () => undefined,
			getProps: () => ({
				variants: {
					exit: {
						opacity: 0,
						transition: { duration: 0.1 },
					},
				},
			}),
			getVariant: (name: string) =>
				name === 'exit'
					? {
							opacity: 0,
							transition: { duration: 0.1 },
						}
					: undefined,
			values: new Map(),
			variantChildren: new Set(),
		} as unknown as VisualElement<HTMLElement>;
		const visualElement = {
			animationState: {
				setActive: vi.fn(() => new Promise(() => undefined)),
			},
			children: new Set(),
			current: node,
			getDefaultTransition: () => undefined,
			getProps: () => ({
				exit: {
					opacity: 0,
					transition: { duration: 0.1, when: 'afterChildren' },
				},
			}),
			presenceContext: null,
			prevPresenceContext: undefined,
			values: new Map(),
			variantChildren: new Set([child]),
		} as unknown as VisualElement<HTMLElement>;

		const config = motionExitOutro(node, { context, visualElement });

		expect(config.duration).toBe(241);
		expect(reserve).toHaveBeenCalledWith(241);
	});

	it('retains a layoutId-only node for its configured layout transition', async () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context, reserve } = createContext();
		const { visualElement } = createVisualElement(node, { duration: 1 });

		const config = motionExitOutro(node, { context, visualElement });

		expect(config.duration).toBe(1001);
		expect(reserve).toHaveBeenCalledWith(1001);
	});

	it('keeps presence active until a retained layout outro finishes', async () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { complete, context } = createContext();
		const { visualElement } = createVisualElement(node, { duration: 1 });

		const config = motionExitOutro(node, { context, visualElement });
		await Promise.resolve();

		expect(complete).not.toHaveBeenCalled();
		config.tick?.(0, 1);
		expect(complete).toHaveBeenCalledTimes(1);
	});

	it('captures an interrupted shared-layout target before Svelte keyed teardown', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const { projection, root, visualElement } = createVisualElement(node, { duration: 1 });
		projection.instance = node;
		projection.layout = {
			animationId: 1,
			layoutBox: { x: { min: 200, max: 500 }, y: { min: 150, max: 450 } },
			measuredBox: { x: { min: 200, max: 500 }, y: { min: 150, max: 450 } },
			latestValues: {},
			source: 1,
		};
		projection.target = {
			x: { min: 150, max: 350 },
			y: { min: 125, max: 375 },
		};
		projection.currentAnimation = {} as IProjectionNode<unknown>['currentAnimation'];
		projection.measure = vi.fn(() => projection.layout!);
		root.isUpdateBlocked = () => false;
		root.nodes = { forEach: (callback: (node: IProjectionNode<unknown>) => void) => callback(projection) } as never;

		motionExitOutro(node, { context, visualElement });

		expect(projection.snapshot?.layoutBox).toEqual(projection.target);
		expect(projection.snapshot?.measuredBox).toEqual(projection.target);
		expect(projection.snapshot?.layoutBox).not.toBe(projection.target);
	});

	it('restores and remeasures presence when Svelte aborts an outro and reuses the keyed node', async () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const { didUpdate, projection, visualElement } = createVisualElement(node, { duration: 1 });
		const originalPresence = {
			id: 'original',
			isPresent: true,
			register: () => () => undefined,
		};
		visualElement.presenceContext = originalPresence;

		motionExitOutro(node, { context, visualElement });
		expect(visualElement.presenceContext?.isPresent).toBe(false);

		motionEnterIntro(node, { context, visualElement });

		expect(visualElement.presenceContext).toBe(originalPresence);
		expect(visualElement.prevPresenceContext).toBeUndefined();
		expect(projection.isPresent).toBe(true);
		expect(projection.willUpdate).toHaveBeenCalledTimes(2);
		expect(projection.promote).toHaveBeenCalledTimes(1);
		expect(didUpdate).not.toHaveBeenCalled();
		await new Promise<void>((resolve) => queueMicrotask(resolve));
		expect(didUpdate).toHaveBeenCalledTimes(1);
	});

	it('releases the leaked exit completion when Svelte aborts a layout outro before tick(0)', async () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { complete, context } = createContext();
		const { visualElement } = createVisualElement(node, { duration: 1 });
		const originalPresence = {
			id: 'original',
			isPresent: true,
			register: () => () => undefined,
		};
		visualElement.presenceContext = originalPresence;

		motionExitOutro(node, { context, visualElement });
		await Promise.resolve();

		expect(complete).not.toHaveBeenCalled();
		motionEnterIntro(node, { context, visualElement });

		expect(complete).toHaveBeenCalledTimes(1);
		expect(complete).toHaveBeenCalledWith(expect.any(String), false);
	});

	it('flushes the final layout after outro cleanup instead of styling the mounted exit node', async () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const { update, visualElement } = createVisualElement(node, { duration: 1 });

		const config = motionExitOutro(node, { context, visualElement });
		config.tick?.(0, 1);
		flushPendingMotionExitLayout(node);

		expect(update).not.toHaveBeenCalled();
		await new Promise<void>((resolve) => queueMicrotask(resolve));
		expect(update).toHaveBeenCalledTimes(1);
	});

	it('updates only the exiting projection when presence does not affect layout', async () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext(false);
		const { projection, root, update, visualElement } = createVisualElement(node, { duration: 1 });
		const siblingWillUpdate = vi.fn();
		const sibling = {
			options: { layout: true },
			willUpdate: siblingWillUpdate,
		} as unknown as IProjectionNode<unknown>;
		root.nodes = {
			forEach(callback: (projectionNode: IProjectionNode<unknown>) => void) {
				callback(projection);
				callback(sibling);
			},
		} as never;

		const config = motionExitOutro(node, { context, visualElement });
		config.tick?.(0, 1);
		flushPendingMotionExitLayout(node);
		await new Promise<void>((resolve) => queueMicrotask(resolve));

		expect(projection.willUpdate).toHaveBeenCalledTimes(2);
		expect(siblingWillUpdate).not.toHaveBeenCalled();
		expect(update).toHaveBeenCalledTimes(1);
	});
});
