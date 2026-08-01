import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { appearAnimationStore, appearComplete } from '../../../animation/optimized-appear/store.js';
import { appearStoreId } from '../../../animation/optimized-appear/store-id.js';
import type { Batcher } from '../../../frameloop/types.js';
import { type AppearAnimationPayload, appearBootstrapSource } from '../appear-bootstrap.js';

type FakeAnimation = {
	keyframes: PropertyIndexedKeyframes;
	options: KeyframeAnimationOptions;
	cancelled: boolean;
	played: boolean;
	playState: AnimationPlayState;
	startTime: number | null;
	onfinish: (() => void) | null;
	ready?: Promise<unknown>;
	cancel(): void;
	play(): void;
};

/**
 * Runs every batched callback immediately, which is enough to observe whether
 * the bootstrap cancelled or suspended an animation.
 */
const immediateFrame = {
	postRender: (callback: () => void) => callback(),
	render: (callback: () => void) => callback(),
} as unknown as Batcher;

function createAppearElement(elementId: string, placeholderReady?: Promise<unknown>, throwAtAnimation?: number) {
	const element = document.createElement('div');
	element.dataset.framerAppearId = elementId;
	document.body.append(element);

	const animations: FakeAnimation[] = [];
	element.animate = ((keyframes: PropertyIndexedKeyframes, options: KeyframeAnimationOptions) => {
		if (animations.length === throwAtAnimation) throw new Error('WAAPI rejected the keyframes');
		const animation: FakeAnimation = {
			keyframes,
			options,
			cancelled: false,
			played: false,
			playState: 'running',
			startTime: null,
			onfinish: null,
			// Only the 10s paint-ready placeholder is given a `ready` promise.
			ready: animations.length === 0 ? placeholderReady : undefined,
			cancel() {
				this.cancelled = true;
			},
			play() {
				this.played = true;
			},
		};
		animations.push(animation);
		return animation as unknown as Animation;
	}) as Element['animate'];

	return { element, animations, elementId };
}

function runBootstrap(element: HTMLElement, payload: AppearAnimationPayload[]) {
	const script = document.createElement('script');
	script.dataset.motionAppear = encodeURIComponent(JSON.stringify(payload));
	element.after(script);

	Object.defineProperty(document, 'currentScript', { configurable: true, value: script });
	try {
		new Function(appearBootstrapSource)();
	} finally {
		Object.defineProperty(document, 'currentScript', { configurable: true, value: null });
	}
}

const opacityAndTransform: AppearAnimationPayload[] = [
	{
		name: 'transform',
		keyframes: { transform: ['translateX(20px)', 'translateX(0px)'] },
		options: { delay: 0, duration: 400, easing: 'ease-in-out', fill: 'both' },
	},
	{
		name: 'opacity',
		keyframes: { opacity: [0, 1] as unknown as string[] },
		options: { delay: 0, duration: 400, easing: 'linear', fill: 'both' },
	},
];

beforeEach(() => {
	appearAnimationStore.clear();
	appearComplete.clear();
	window.__MotionAppearReady = undefined;
	window.__MotionAppearStartTime = undefined;
	window.MotionHandoffAnimation = undefined;
	window.MotionHandoffIsComplete = undefined;
	window.MotionHandoffMarkAsComplete = undefined;
	window.MotionHasOptimisedAnimation = undefined;
	window.MotionCancelOptimisedAnimation = undefined;
	window.MotionCheckAppearSync = undefined;
	window.MotionIsMounted = undefined;
	document.body.innerHTML = '';
});

afterEach(() => {
	window.MotionIsMounted = undefined;
});

describe('appear bootstrap source', () => {
	it('serializes to a self-contained, parseable IIFE', () => {
		expect(appearBootstrapSource.startsWith('(function')).toBe(true);
		expect(() => new Function(appearBootstrapSource)).not.toThrow();
		// A serialized function can only reference globals, so anything a bundler
		// or an instrumenter would rewrite must not appear in the output.
		expect(appearBootstrapSource).not.toMatch(/\b(import|require|cov_|__vite|__values|__assign)\b/);
		expect(appearBootstrapSource).not.toMatch(/@__[A-Z_]+__/);
		// It is inlined verbatim into an HTML <script>, so it must not contain
		// anything that ends or comments out that element.
		expect(appearBootstrapSource).not.toMatch(/<\/script/i);
		expect(appearBootstrapSource).not.toContain('<!--');
		// The compaction pass leaves no comments or indentation to inline per element.
		expect(appearBootstrapSource).not.toMatch(/^[ \t]*\/\//m);
		expect(appearBootstrapSource).not.toMatch(/^[ \t]+/m);
		expect(appearBootstrapSource.length).toBeLessThan(6000);
	});
});

describe('appear bootstrap handoff bridge', () => {
	it('registers values under the same store keys Motion looks them up with', () => {
		const { element, elementId } = createAppearElement('el-1');

		runBootstrap(element, opacityAndTransform);

		// The store must be the one `store.ts` created, not a second window map.
		expect(window.__MotionAppearAnimations).toBe(appearAnimationStore);
		expect(appearAnimationStore.has(appearStoreId(elementId, 'x'))).toBe(true);
		expect(appearAnimationStore.has(appearStoreId(elementId, 'scaleX'))).toBe(true);
		expect(appearAnimationStore.has(appearStoreId(elementId, 'opacity'))).toBe(true);
		expect(window.MotionHasOptimisedAnimation?.(elementId, 'rotateZ')).toBe(true);
		expect(window.MotionHasOptimisedAnimation?.(elementId, 'width')).toBe(false);
		expect(window.MotionHasOptimisedAnimation?.(elementId)).toBe(true);
		expect(appearComplete.get(elementId)).toBe(false);
	});

	it('starts the real animations on a shared start time once the browser can paint', async () => {
		const first = createAppearElement('el-1', Promise.resolve());
		runBootstrap(first.element, opacityAndTransform);
		const second = createAppearElement('el-2');
		runBootstrap(second.element, opacityAndTransform);

		await window.__MotionAppearReady;
		await Promise.resolve();

		expect(first.animations[0]?.options.duration).toBe(10000);
		expect(first.animations[0]?.cancelled).toBe(true);
		expect(first.animations).toHaveLength(3);
		expect(second.animations).toHaveLength(3);

		const startTime = window.__MotionAppearStartTime;
		expect(typeof startTime).toBe('number');
		for (const animation of [...first.animations.slice(1), ...second.animations.slice(1)]) {
			expect(animation.startTime).toBe(startTime);
		}
		expect(appearAnimationStore.get(appearStoreId('el-2', 'y'))?.startTime).toBe(startTime);
	});

	it('does not start a competing animation when Motion hydrates before paint', async () => {
		let resolveReady: () => void = () => undefined;
		const ready = new Promise<void>((resolve) => {
			resolveReady = resolve;
		});
		const { element, animations } = createAppearElement('el-1', ready);

		runBootstrap(element, opacityAndTransform);
		window.MotionIsMounted = true;
		resolveReady();
		await ready;
		await Promise.resolve();

		expect(animations).toHaveLength(1);
		expect(animations[0]?.cancelled).toBe(true);
	});

	it('drops the paint-ready placeholder when the shared ready promise rejects', async () => {
		const rejected = Promise.reject(new Error('cancelled before paint'));
		const first = createAppearElement('el-1', rejected);
		runBootstrap(first.element, opacityAndTransform);
		const second = createAppearElement('el-2');
		runBootstrap(second.element, opacityAndTransform);

		await window.__MotionAppearReady;
		await Promise.resolve();
		await Promise.resolve();

		// The interrupted element falls back to hydration-time Motion, but its
		// rejected readiness signal doesn't suppress later elements.
		expect(first.animations).toHaveLength(1);
		expect(second.animations).toHaveLength(3);
		expect(first.animations[0]?.cancelled).toBe(true);
		expect(second.animations[0]?.cancelled).toBe(true);
	});

	it('clears completion state when the paint-ready animation cannot be created', () => {
		const element = document.createElement('div');
		const elementId = 'el-1';
		element.dataset.framerAppearId = elementId;
		element.animate = (() => {
			throw new Error('WAAPI unavailable');
		}) as Element['animate'];
		document.body.append(element);

		expect(() => runBootstrap(element, opacityAndTransform)).not.toThrow();
		expect(appearComplete.has(elementId)).toBe(false);
		expect(window.MotionHasOptimisedAnimation?.(elementId)).toBe(false);
	});

	it('hands the start time to Motion and cancels once the handoff is complete', async () => {
		const { element, elementId } = createAppearElement('el-1', Promise.resolve());
		runBootstrap(element, opacityAndTransform);
		await window.__MotionAppearReady;
		await Promise.resolve();

		expect(window.MotionHandoffAnimation?.(elementId, 'opacity', immediateFrame)).toBe(window.__MotionAppearStartTime);

		window.MotionHandoffMarkAsComplete?.(elementId);
		expect(window.MotionHandoffIsComplete?.(elementId)).toBe(true);
		expect(window.MotionHandoffAnimation?.(elementId, 'x', immediateFrame)).toBeNull();
		expect(appearAnimationStore.has(appearStoreId(elementId, 'x'))).toBe(false);
	});

	it('preserves a finished transform until every transform value can hand off', async () => {
		const { element, elementId, animations } = createAppearElement('el-1', Promise.resolve());
		const postRenderCallbacks: Array<() => void> = [];
		const deferredFrame = {
			postRender: (callback: () => void) => postRenderCallbacks.push(callback),
			render: (callback: () => void) => callback(),
		} as unknown as Batcher;
		runBootstrap(element, opacityAndTransform);
		await window.__MotionAppearReady;
		await Promise.resolve();

		const transformAnimation = animations[1];
		expect(transformAnimation).toBeDefined();
		if (!transformAnimation) throw new Error('Expected the transform animation to start');
		transformAnimation.playState = 'finished';
		const startTime = window.__MotionAppearStartTime;

		expect(window.MotionHandoffAnimation?.(elementId, 'x', deferredFrame)).toBe(startTime);
		expect(window.MotionHandoffAnimation?.(elementId, 'scale', deferredFrame)).toBe(startTime);
		expect(animations[1]?.cancelled).toBe(false);
		expect(appearAnimationStore.has(appearStoreId(elementId, 'x'))).toBe(true);

		window.MotionHandoffMarkAsComplete?.(elementId);
		expect(animations[1]?.cancelled).toBe(false);
		while (postRenderCallbacks.length) postRenderCallbacks.shift()?.();

		expect(animations[1]?.cancelled).toBe(true);
		expect(appearAnimationStore.has(appearStoreId(elementId, 'x'))).toBe(false);
	});

	it('isolates a rejected real animation and keeps valid values available for handoff', async () => {
		const payload = [...opacityAndTransform].reverse();
		const { element, elementId } = createAppearElement('el-1', Promise.resolve(), 2);

		runBootstrap(element, payload);
		await window.__MotionAppearReady;
		await Promise.resolve();
		await Promise.resolve();

		expect(appearAnimationStore.has(appearStoreId(elementId, 'opacity'))).toBe(true);
		expect(appearAnimationStore.has(appearStoreId(elementId, 'x'))).toBe(false);
		expect(window.MotionHasOptimisedAnimation?.(elementId)).toBe(true);
	});

	it('skips transform animations when the user prefers reduced motion', async () => {
		const matchMedia = window.matchMedia;
		const noop = () => undefined;
		window.matchMedia = (query) => ({
			matches: true,
			media: query,
			onchange: null,
			addListener: noop,
			removeListener: noop,
			addEventListener: noop,
			removeEventListener: noop,
			dispatchEvent: () => true,
		});
		const payload = opacityAndTransform.map((animation) =>
			animation.name === 'transform' ? { ...animation, skipOnReducedMotion: true } : animation
		);
		const { element, animations } = createAppearElement('el-1', Promise.resolve());

		try {
			runBootstrap(element, payload);
			await window.__MotionAppearReady;
			await Promise.resolve();
		} finally {
			window.matchMedia = matchMedia;
		}

		expect(animations.some((animation) => animation.keyframes.transform)).toBe(false);
		expect(animations.some((animation) => animation.keyframes.opacity)).toBe(true);
	});

	it('cancels a not-yet-started animation on handoff and skips it once paint-ready resolves', async () => {
		let resolveReady: () => void = () => undefined;
		const ready = new Promise<void>((resolve) => {
			resolveReady = resolve;
		});
		const { element, elementId, animations } = createAppearElement('el-1', ready);
		runBootstrap(element, opacityAndTransform);

		// startTime is still null, so this is the paint-ready placeholder.
		expect(window.MotionHandoffAnimation?.(elementId, 'opacity', immediateFrame)).toBeNull();
		expect(appearAnimationStore.has(appearStoreId(elementId, 'opacity'))).toBe(false);

		resolveReady();
		await ready;
		await Promise.resolve();

		// The placeholder animates the first payload entry; only the still-registered
		// transform animation is started for real.
		expect(animations.map((animation) => animation.keyframes.transform)).toEqual([
			['translateX(20px)', 'translateX(20px)'],
			['translateX(20px)', 'translateX(0px)'],
		]);
		expect(animations.some((animation) => animation.keyframes.opacity)).toBe(false);
	});

	it('stops advertising itself once every optimised animation is cancelled', async () => {
		const { element, elementId } = createAppearElement('el-1', Promise.resolve());
		runBootstrap(element, opacityAndTransform);
		await window.__MotionAppearReady;
		await Promise.resolve();

		window.MotionCancelOptimisedAnimation?.(elementId, 'opacity');
		expect(window.MotionCancelOptimisedAnimation).toBeDefined();
		window.MotionCancelOptimisedAnimation?.(elementId, 'x');

		expect(appearAnimationStore.size).toBe(0);
		expect(window.MotionCancelOptimisedAnimation).toBeUndefined();
	});

	it('resumes rather than deletes a transform animation suspended for layout measurement', async () => {
		const { element, elementId } = createAppearElement('el-1', Promise.resolve());
		runBootstrap(element, opacityAndTransform);
		await window.__MotionAppearReady;
		await Promise.resolve();

		const entry = appearAnimationStore.get(appearStoreId(elementId, 'x'));
		expect(entry).toBeDefined();
		if (!entry) throw new Error('Expected the transform appear animation to be registered');
		window.MotionCancelOptimisedAnimation?.(elementId, 'x', immediateFrame, true);

		expect(appearAnimationStore.has(appearStoreId(elementId, 'x'))).toBe(true);
		expect((entry.animation as unknown as FakeAnimation).played).toBe(true);
		expect(entry.animation.startTime).toBe(entry.startTime);
	});
});
