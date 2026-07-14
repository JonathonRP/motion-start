/**
 * Ported from framer-motion@11.11.11
 * packages/framer-motion/src/animation/animators/waapi/__tests__/animate-style.test.ts
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { animateMini } from '../animate-style.js';

const duration = 0.001;
const originalAnimate = typeof Element !== 'undefined' ? Element.prototype.animate : undefined;

type MockAnimation = Omit<Animation, 'playState'> & {
	playState: AnimationPlayState;
	finishTimer?: ReturnType<typeof setTimeout>;
};

function createMockAnimation(options?: KeyframeAnimationOptions | number): MockAnimation {
	const animation = {
		currentTime: 0,
		playbackRate: 1,
		playState: 'running',
		startTime: 0,
		onfinish: null,
		play: vi.fn(() => {
			animation.playState = 'running';
			scheduleFinish(animation, options);
		}),
		pause: vi.fn(() => {
			animation.playState = 'paused';
			if (animation.finishTimer) clearTimeout(animation.finishTimer);
		}),
		finish: vi.fn(() => {
			animation.currentTime = Number(typeof options === 'object' ? options.duration : options) || 0;
			animation.playState = 'finished';
			animation.onfinish?.(new Event('finish') as AnimationPlaybackEvent);
		}),
		cancel: vi.fn(() => {
			animation.playState = 'idle';
			if (animation.finishTimer) clearTimeout(animation.finishTimer);
		}),
		commitStyles: vi.fn(),
	} as unknown as MockAnimation;

	scheduleFinish(animation, options);

	return animation;
}

function scheduleFinish(animation: MockAnimation, options?: KeyframeAnimationOptions | number) {
	const optionDuration = typeof options === 'object' ? options.duration : options;
	const delay = Math.max(0, Math.min(Number(optionDuration ?? 0), 5));

	animation.finishTimer = setTimeout(() => {
		if (animation.playState === 'running') {
			animation.finish();
		}
	}, delay);
}

function setupWaapi() {
	Element.prototype.animate = vi.fn((_keyframes, options) => createMockAnimation(options));
}

function restoreWaapi() {
	vi.restoreAllMocks();

	if (originalAnimate) {
		Element.prototype.animate = originalAnimate;
	} else {
		Element.prototype.animate = undefined as unknown as typeof Element.prototype.animate;
	}
}

describe.skipIf(typeof Element === 'undefined')('animateMini', () => {
	beforeEach(setupWaapi);
	afterEach(restoreWaapi);

	test('accepts css variable options without type errors', async () => {
		const div = document.createElement('div');

		const animation = animateMini(
			div,
			{ opacity: 0.6, '--css-var': 2 },
			{
				duration,
				'--css-var': {
					repeatType: 'mirror',
				},
				repeat: 0,
				ease: 'easeOut',
				times: [0],
			}
		);

		animation.cancel();
	});

	test('applies target keyframe when animation has finished', async () => {
		const div = document.createElement('div');
		const animation = animateMini(div, { opacity: 0.6 }, { duration, x: {}, '--css-var': {} });

		await animation;

		expect(div.style.opacity).toBe('0.6');
	});

	test('applies final target keyframe when animation has finished', async () => {
		const div = document.createElement('div');
		const animation = animateMini(div, { opacity: [0.2, 0.5] }, { duration });

		await animation;

		expect(div.style.opacity).toBe('0.5');
	});

	test('time sets and gets time', async () => {
		const div = document.createElement('div');
		const animation = animateMini(div, { opacity: 0.5 }, { duration: 10 });

		expect(animation.time).toBe(0);
		animation.time = 5;
		expect(animation.time).toBe(5);

		animation.cancel();
	});

	test('autoplay false pauses animation', async () => {
		const div = document.createElement('div');
		const animation = animateMini(div, { opacity: 0.5 }, { duration: 0.1, autoplay: false });
		let hasFinished = false;

		animation.then(() => {
			hasFinished = true;
		});

		await new Promise((resolve) => setTimeout(resolve, 20));

		expect(hasFinished).toBe(false);
		animation.cancel();
	});

	test('time can be set to duration', async () => {
		const div = document.createElement('div');
		div.style.opacity = '0';
		const animation = animateMini(div, { opacity: 0.5 }, { duration: 1 });
		animation.pause();
		animation.time = 1;
		animation.complete();

		expect(div.style.opacity).toBe('0.5');
	});

	test('duration gets the duration of the animation', async () => {
		const div = document.createElement('div');
		const animation = animateMini(div, { opacity: 0.5 }, { duration: 10 });

		expect(animation.duration).toBe(10);

		animation.cancel();
	});
});
