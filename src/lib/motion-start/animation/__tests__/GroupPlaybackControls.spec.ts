/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 * Ported from packages/framer-motion/src/animation/__tests__/GroupPlaybackControls.test.ts
 */

import { describe, test, expect, vi } from 'vitest';
import { GroupPlaybackControls } from '../GroupPlaybackControls';
import type { AnimationPlaybackControls } from '../types';

function createTestAnimationControls(
	partialControls?: Partial<AnimationPlaybackControls>
): AnimationPlaybackControls {
	return {
		time: 1,
		speed: 1,
		duration: 10,
		startTime: 0,
		stop: () => {},
		play: () => {},
		pause: () => {},
		then: (resolve: VoidFunction) => {
			return Promise.resolve().then(resolve);
		},
		complete: () => {},
		cancel: () => {},
		...partialControls,
	};
}

describe('GroupPlaybackControls', () => {
	test('Filters undefined animations', () => {
		const a: AnimationPlaybackControls = createTestAnimationControls();

		const controls = new GroupPlaybackControls([undefined, a]);

		expect(controls.animations[0]).toBe(a);
	});

	test('Gets time', () => {
		const a: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
		});

		const controls = new GroupPlaybackControls([a]);

		expect(controls.time).toBe(5);
	});

	test('Sets time', () => {
		const a: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
		});

		const b: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
		});

		const controls = new GroupPlaybackControls([a, b]);

		controls.time = 1;

		expect(a.time).toBe(1);
		expect(b.time).toBe(1);
	});

	test('Calls play on all animations', () => {
		const a: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
			play: vi.fn(),
		});

		const b: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
			play: vi.fn(),
		});

		const controls = new GroupPlaybackControls([a, b]);

		controls.play();

		expect(a.play).toHaveBeenCalledTimes(1);
		expect(b.play).toHaveBeenCalledTimes(1);
	});

	test('Calls pause on all animations', () => {
		const a: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
			pause: vi.fn(),
		});

		const b: AnimationPlaybackControls = createTestAnimationControls({
			time: 5,
			pause: vi.fn(),
		});

		const controls = new GroupPlaybackControls([a, b]);

		controls.pause();

		expect(a.pause).toHaveBeenCalledTimes(1);
		expect(b.pause).toHaveBeenCalledTimes(1);
	});

	test('.then() returns Promise', () => {
		const controls = new GroupPlaybackControls([]);
		controls.then(() => {}).then(() => {});
	});

	test('Resolves if all promises are already resolved', async () => {
		const aOnComplete = vi.fn();
		const a: AnimationPlaybackControls = createTestAnimationControls({});

		const bOnComplete = vi.fn();
		const b: AnimationPlaybackControls = createTestAnimationControls({});

		a.then(() => aOnComplete());
		b.then(() => bOnComplete());

		const controls = new GroupPlaybackControls([a, b]);

		await controls;

		expect(aOnComplete).toHaveBeenCalled();
		expect(bOnComplete).toHaveBeenCalled();
	});

	test('Resolves when all promises are resolved', async () => {
		const aOnComplete = vi.fn();
		const a: AnimationPlaybackControls = createTestAnimationControls({});

		const bOnComplete = vi.fn();
		const b: AnimationPlaybackControls = createTestAnimationControls({});

		a.then(() => aOnComplete());
		b.then(() => bOnComplete());

		const controls = new GroupPlaybackControls([a, b]);

		await controls;

		expect(aOnComplete).toHaveBeenCalled();
		expect(bOnComplete).toHaveBeenCalled();
	});

	test('Calls cancel on all animations', async () => {
		const a = createTestAnimationControls({
			cancel: vi.fn(),
		});
		const b = createTestAnimationControls({
			cancel: vi.fn(),
		});

		const controls = new GroupPlaybackControls([a, b]);

		controls.cancel();

		expect(a.cancel).toHaveBeenCalled();
		expect(b.cancel).toHaveBeenCalled();
	});

	test('Calls complete on all animations', async () => {
		const a = createTestAnimationControls({
			complete: vi.fn(),
		});
		const b = createTestAnimationControls({
			complete: vi.fn(),
		});

		const controls = new GroupPlaybackControls([a, b]);

		controls.complete();

		expect(a.complete).toHaveBeenCalled();
		expect(b.complete).toHaveBeenCalled();
	});

	test('Gets speed on all animations', async () => {
		const a = createTestAnimationControls({
			speed: 2,
		});
		const b = createTestAnimationControls({
			speed: 2,
		});

		const controls = new GroupPlaybackControls([a, b]);

		expect(controls.speed).toEqual(2);
	});

	test('Sets speed on all animations', async () => {
		const a = createTestAnimationControls({
			speed: 2,
		});
		const b = createTestAnimationControls({
			speed: 2,
		});

		const controls = new GroupPlaybackControls([a, b]);

		controls.speed = -1;
		expect(a.speed).toEqual(-1);
		expect(b.speed).toEqual(-1);
	});

	test('Gets correct startTime', async () => {
		const a = createTestAnimationControls({
			startTime: 2,
		});
		const b = createTestAnimationControls({
			startTime: 2,
		});

		const controls = new GroupPlaybackControls([a, b]);

		expect(controls.startTime).toEqual(2);
	});

	test('Gets max duration', async () => {
		const a = createTestAnimationControls({
			duration: 3,
		});
		const b = createTestAnimationControls({
			duration: 2,
		});
		const c = createTestAnimationControls({
			duration: 1,
		});

		const controls = new GroupPlaybackControls([a, b, c]);

		expect(controls.duration).toEqual(3);
	});

	test('Returns zero for no animations', async () => {
		const controls = new GroupPlaybackControls([]);

		expect(controls.duration).toEqual(0);
	});
});
