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
	 * Regression test for motion 11.18.2:
	 * "Animations with `transformTemplate` not hardware accelerated."
	 */
	describe('supports', () => {
		function createOptions(props: Record<string, unknown>) {
			const element = document.createElement('div');
			Element.prototype.animate = vi.fn(() => ({}) as Animation);

			return {
				name: 'opacity',
				motionValue: motionValue(1, {
					owner: {
						current: element,
						getProps: () => props,
					},
				}),
				keyframes: [1, 0],
				duration: 100,
			} as any;
		}

		test('supports a plain element', () => {
			expect(AcceleratedAnimation.supports(createOptions({}))).toBe(true);
		});

		test('does not support elements with a transformTemplate', () => {
			expect(AcceleratedAnimation.supports(createOptions({ transformTemplate: () => 'none' }))).toBe(false);
		});
	});
});
