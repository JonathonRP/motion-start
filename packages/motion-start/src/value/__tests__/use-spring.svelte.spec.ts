import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Driver } from '../../animation/animators/drivers/types.js';
import type { SpringOptions } from '../../animation/types.js';
import { frame, frameData } from '../../frameloop/index.js';
import { time } from '../../frameloop/sync-time.js';
import UseSpringFixture from './UseSpringFixture.svelte';

const startedKeyframes: number[][] = [];

vi.mock('../../animation/animators/MainThreadAnimation.js', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../../animation/animators/MainThreadAnimation.js')>();

	return {
		...actual,
		animateValue: (options: Parameters<typeof actual.animateValue>[0]) => {
			startedKeyframes.push([...options.keyframes]);
			return actual.animateValue(options);
		},
	};
});

/**
 * A driver that never ticks, so the animation it drives stays at `time === 0`.
 * This reproduces the case the sampling behaviour exists for: a spring that is
 * retargeted before its previous animation rendered a frame.
 */
const idleDriver: Driver = () => {
	const doNothing = () => undefined;

	return {
		start: doNothing,
		stop: doNothing,
		now: () => (frameData.isProcessing ? frameData.timestamp : time.now()),
	};
};

const nextFrame = () => new Promise<void>((resolve) => frame.postRender(() => resolve()));

let instance: ReturnType<typeof mount> | undefined;

beforeEach(() => {
	startedKeyframes.length = 0;
});

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('useSpring', () => {
	it('samples the in-flight spring when retargeted before it has rendered a frame', async () => {
		const component = mount(UseSpringFixture, {
			target: document.body,
			props: {
				config: { stiffness: 200, damping: 10, driver: idleDriver } as SpringOptions,
			},
		});
		instance = component;
		flushSync();

		const { spring } = component;

		spring.set(100);
		await nextFrame();

		expect(startedKeyframes).toEqual([[0, 100]]);
		expect(spring.get()).toBe(0);

		// The first animation has not rendered a frame yet, so retargeting must
		// sample it forward and start the replacement from that position.
		spring.set(50);
		await nextFrame();

		expect(startedKeyframes).toHaveLength(2);

		const [, retargetKeyframes] = startedKeyframes;

		expect(retargetKeyframes[1]).toBe(50);
		expect(retargetKeyframes[0]).toBeGreaterThan(0);
		expect(retargetKeyframes[0]).toBe(spring.get());
	});
});
