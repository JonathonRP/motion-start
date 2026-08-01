import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MotionOutroContext } from '../../../context/OutroContext.svelte.js';
import type { IProjectionNode } from '../../../projection/node/types.js';
import type { VisualElement } from '../../VisualElement.svelte.js';
import { flushPendingMotionExitLayout, motionEnterIntro, motionExitOutro } from '../motion-outro.js';

const originalTimeline = Object.getOwnPropertyDescriptor(document, 'timeline');

afterEach(() => {
	document.body.innerHTML = '';
	vi.restoreAllMocks();
	if (originalTimeline) {
		Object.defineProperty(document, 'timeline', originalTimeline);
	} else {
		delete (document as unknown as { timeline?: unknown }).timeline;
	}
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

/**
 * Builds a chain of exiting variant children, where `durations[0]` is the
 * outermost element's own exit duration and every level that has a descendant
 * sequences it with `when: 'afterChildren'`.
 */
function createSequencedExitElement(node: HTMLElement, durations: number[]) {
	let child: VisualElement<HTMLElement> | undefined;

	for (let index = durations.length - 1; index >= 0; index--) {
		const exit = {
			opacity: 0,
			transition: child ? { duration: durations[index], when: 'afterChildren' } : { duration: durations[index] },
		};

		child = {
			animationState: {
				setActive: vi.fn(() => new Promise(() => undefined)),
			},
			children: new Set(),
			current: node,
			getDefaultTransition: () => undefined,
			getProps: () => ({ exit }),
			getVariant: (name: string) => (name === 'exit' ? exit : undefined),
			presenceContext: null,
			prevPresenceContext: undefined,
			sortNodePosition: () => 0,
			values: new Map(),
			variantChildren: child ? new Set([child]) : new Set(),
		} as unknown as VisualElement<HTMLElement>;
	}

	return child as VisualElement<HTMLElement>;
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

		// 100ms child + 100ms parent, plus a scheduling frame for each of the two
		// points at which Motion starts an animation, plus the completion margin.
		expect(config.duration).toBe(281);
		expect(reserve).toHaveBeenCalledWith(281);
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

		expect(config.duration).toBe(281);
		expect(reserve).toHaveBeenCalledWith(281);
	});

	/**
	 * Regression guard for the `when: 'afterChildren'` ordering contract: the
	 * parent's own exit animation is only queued once the child animations have
	 * settled, so the retained block has to outlive both steps *and* the frame
	 * each of them loses to keyframe resolution. Retaining for less unmounts the
	 * visual element mid-sequence, which clears its event subscriptions and drops
	 * the parent's `onAnimationComplete` entirely.
	 */
	it('budgets a scheduling frame for every start point of a sequenced exit', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const visualElement = createSequencedExitElement(node, [0.1, 0.1]);

		const config = motionExitOutro(node, { context, visualElement });
		const [childDuration, parentDuration] = [100, 100];
		const startPoints = 2;

		expect(config.duration).toBeGreaterThan(childDuration + parentDuration);
		expect(config.duration).toBe(childDuration + parentDuration + startPoints * 40 + 1);
	});

	it('compounds the scheduling budget for each nested afterChildren boundary', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const visualElement = createSequencedExitElement(node, [0.1, 0.1, 0.1]);

		// Three sequenced 100ms steps, so three start points to pay for.
		expect(motionExitOutro(node, { context, visualElement }).duration).toBe(300 + 3 * 40 + 1);
	});

	it('retains a concurrent exit past the frame its animation loses to scheduling', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const visualElement = createSequencedExitElement(node, [0.1]);

		expect(motionExitOutro(node, { context, visualElement }).duration).toBe(100 + 40 + 1);
	});

	/**
	 * Svelte back-dates the outro's WAAPI clock to the start of the current
	 * frame, so a frame that spent 60ms before reaching the outro hands back a
	 * retained window 60ms shorter than the one that was requested.
	 */
	it('extends the retained window by the frame time the outro clock has already spent', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context, reserve } = createContext();
		const visualElement = createSequencedExitElement(node, [0.1]);
		const frameStart = performance.now();
		vi.spyOn(performance, 'now').mockReturnValue(frameStart + 60);
		Object.defineProperty(document, 'timeline', {
			configurable: true,
			value: { currentTime: frameStart },
		});

		expect(motionExitOutro(node, { context, visualElement }).duration).toBe(100 + 40 + 60 + 1);
		expect(reserve).toHaveBeenCalledWith(100 + 40 + 60 + 1);
	});

	/**
	 * The document timeline pauses while the page is hidden but
	 * `performance.now()` does not, so a backgrounded tab reports an unbounded
	 * skew that must not be mistaken for frame time.
	 */
	it('caps the frame-time correction so a stalled timeline cannot over-retain', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context } = createContext();
		const visualElement = createSequencedExitElement(node, [0.1]);
		const frameStart = performance.now();
		vi.spyOn(performance, 'now').mockReturnValue(frameStart + 30_000);
		Object.defineProperty(document, 'timeline', {
			configurable: true,
			value: { currentTime: frameStart },
		});

		expect(motionExitOutro(node, { context, visualElement }).duration).toBe(100 + 40 + 1000 + 1);
	});

	it('leaves a node with nothing to animate unretained regardless of frame time', () => {
		const node = document.createElement('div');
		document.body.appendChild(node);
		const { context, reserve } = createContext();
		const visualElement = {
			animationState: { setActive: vi.fn(() => Promise.resolve()) },
			children: new Set(),
			current: node,
			getDefaultTransition: () => undefined,
			getProps: () => ({}),
			presenceContext: null,
			prevPresenceContext: undefined,
			values: new Map(),
		} as unknown as VisualElement<HTMLElement>;
		const frameStart = performance.now();
		vi.spyOn(performance, 'now').mockReturnValue(frameStart + 60);
		Object.defineProperty(document, 'timeline', {
			configurable: true,
			value: { currentTime: frameStart },
		});

		expect(motionExitOutro(node, { context, visualElement }).duration).toBe(0);
		expect(reserve).not.toHaveBeenCalled();
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
