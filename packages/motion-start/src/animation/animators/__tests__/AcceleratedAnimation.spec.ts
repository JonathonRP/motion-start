/**
 * Based on Motion's post-v11 WAAPI completion behavior.
 * https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/animation/NativeAnimation.ts
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { motionValue } from '../../../value/index.js';
import { AcceleratedAnimation } from '../AcceleratedAnimation.js';

const originalAnimateDescriptor =
	typeof Element !== 'undefined' ? Object.getOwnPropertyDescriptor(Element.prototype, 'animate') : undefined;

function restoreWaapi() {
	vi.restoreAllMocks();

	if (originalAnimateDescriptor) {
		Object.defineProperty(Element.prototype, 'animate', originalAnimateDescriptor);
	} else {
		Reflect.deleteProperty(Element.prototype, 'animate');
	}
}

describe.skipIf(typeof Element === 'undefined')('AcceleratedAnimation', () => {
	afterEach(restoreWaapi);

	function createMockAnimation() {
		let playState: AnimationPlayState = 'running';

		const nativeAnimation = {
			currentTime: 0,
			playbackRate: 1,
			get playState() {
				return playState;
			},
			startTime: 0,
			onfinish: null as ((event: AnimationPlaybackEvent) => void) | null,
			play: vi.fn(),
			pause: vi.fn(),
			finish: vi.fn(() => {
				playState = 'finished';
				nativeAnimation.onfinish?.(new Event('finish') as AnimationPlaybackEvent);
			}),
			cancel: vi.fn(() => {
				playState = 'idle';
			}),
		} as unknown as Animation;

		return nativeAnimation;
	}

	test('commits the final style before cancelling a finished WAAPI animation', () => {
		const element = document.createElement('div');
		element.style.opacity = '1';
		let playState: AnimationPlayState = 'running';

		const nativeAnimation = {
			currentTime: 0,
			playbackRate: 1,
			get playState() {
				return playState;
			},
			startTime: 0,
			onfinish: null as ((event: AnimationPlaybackEvent) => void) | null,
			play: vi.fn(),
			pause: vi.fn(),
			finish: vi.fn(() => {
				playState = 'finished';
				nativeAnimation.onfinish?.(new Event('finish') as AnimationPlaybackEvent);
			}),
			cancel: vi.fn(() => {
				expect(element.style.opacity).toBe('0');
				playState = 'idle';
			}),
		} as unknown as Animation;

		Element.prototype.animate = vi.fn(() => nativeAnimation);

		const opacity = motionValue(1, {
			owner: {
				current: element,
				getProps: () => ({}),
			},
		});
		const animation = new AcceleratedAnimation({
			name: 'opacity',
			motionValue: opacity,
			keyframes: [1, 0],
			duration: 100,
		});

		animation.complete();

		expect(opacity.get()).toBe(0);
		expect(element.style.opacity).toBe('0');
		expect(nativeAnimation.cancel).toHaveBeenCalledOnce();
	});

	/**
	 * Regression test for https://github.com/motiondivision/motion/issues/3113
	 * and https://github.com/motiondivision/motion/issues/2947
	 */
	test('commits the first keyframe when a WAAPI animation finishes in reverse', () => {
		const element = document.createElement('div');
		element.style.opacity = '1';

		const nativeAnimation = createMockAnimation();
		Element.prototype.animate = vi.fn(() => nativeAnimation);

		const opacity = motionValue(1, {
			owner: { current: element, getProps: () => ({}) },
		});

		const animation = new AcceleratedAnimation({
			name: 'opacity',
			motionValue: opacity,
			keyframes: [1, 0],
			duration: 100,
		});

		animation.speed = -1;
		expect(animation.speed).toBe(-1);

		animation.complete();

		expect(opacity.get()).toBe(1);
		expect(element.style.opacity).toBe('1');
	});

	test('commits the final keyframe when a WAAPI animation finishes at a non-default speed', () => {
		const element = document.createElement('div');
		element.style.opacity = '1';

		const nativeAnimation = createMockAnimation();
		Element.prototype.animate = vi.fn(() => nativeAnimation);

		const opacity = motionValue(1, {
			owner: { current: element, getProps: () => ({}) },
		});

		const animation = new AcceleratedAnimation({
			name: 'opacity',
			motionValue: opacity,
			keyframes: [1, 0],
			duration: 100,
		});

		animation.speed = 2;

		animation.complete();

		expect(opacity.get()).toBe(0);
		expect(element.style.opacity).toBe('0');
	});
});
