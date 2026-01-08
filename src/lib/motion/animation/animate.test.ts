/**
 * Animation Engine Tests
 *
 * Ported from motiondivision/motion test patterns
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { animate, animateValues, createAnimationGenerator } from './animate.js';
import type { TransitionOptions } from './types.js';

describe('createAnimationGenerator', () => {
	describe('spring', () => {
		it('should create a spring generator with default values', () => {
			const generator = createAnimationGenerator(0, 100, { type: 'spring' });

			const state = generator.next(16);

			expect(state.value).toBeGreaterThan(0);
			expect(state.value).toBeLessThan(100);
			expect(state.done).toBe(false);
		});

		it('should reach target value when done', () => {
			const generator = createAnimationGenerator(0, 100, {
				type: 'spring',
				stiffness: 500,
				damping: 30
			});

			let state = { value: 0, velocity: 0, done: false };

			// Run until complete
			for (let i = 0; i < 1000 && !state.done; i++) {
				state = generator.next(16);
			}

			expect(state.done).toBe(true);
			expect(state.value).toBe(100);
			expect(state.velocity).toBe(0);
		});

		it('should respect stiffness option', () => {
			const stiffGenerator = createAnimationGenerator(0, 100, {
				type: 'spring',
				stiffness: 1000,
				damping: 30
			});

			const softGenerator = createAnimationGenerator(0, 100, {
				type: 'spring',
				stiffness: 100,
				damping: 30
			});

			const stiffState = stiffGenerator.next(16);
			const softState = softGenerator.next(16);

			// Stiffer spring should move faster initially
			expect(stiffState.value).toBeGreaterThan(softState.value);
		});

		it('should respect damping option', () => {
			const dampedGenerator = createAnimationGenerator(0, 100, {
				type: 'spring',
				stiffness: 200,
				damping: 50
			});

			const underdampedGenerator = createAnimationGenerator(0, 100, {
				type: 'spring',
				stiffness: 200,
				damping: 5
			});

			// Run both for longer to allow underdamped to overshoot
			let dampedState = { value: 0, velocity: 0, done: false };
			let underdampedState = { value: 0, velocity: 0, done: false };
			let underdampedMaxValue = 0;

			for (let i = 0; i < 100; i++) {
				dampedState = dampedGenerator.next(16);
				underdampedState = underdampedGenerator.next(16);
				underdampedMaxValue = Math.max(underdampedMaxValue, underdampedState.value);
			}

			// Underdamped spring should overshoot at some point
			expect(underdampedMaxValue).toBeGreaterThan(100);
		});

		it('should handle initial velocity', () => {
			const withVelocity = createAnimationGenerator(
				0,
				100,
				{ type: 'spring', stiffness: 200, damping: 20 },
				500
			);

			const withoutVelocity = createAnimationGenerator(0, 100, {
				type: 'spring',
				stiffness: 200,
				damping: 20
			});

			const stateWithV = withVelocity.next(16);
			const stateWithoutV = withoutVelocity.next(16);

			// Initial velocity should make it move faster
			expect(stateWithV.value).toBeGreaterThan(stateWithoutV.value);
		});

		it('should flip target correctly', () => {
			const generator = createAnimationGenerator(0, 100, { type: 'spring' });

			// Move forward a bit
			generator.next(16);
			generator.next(16);

			// Flip target
			generator.flipTarget();

			// Should now head back toward 0
			let state = generator.next(16);
			for (let i = 0; i < 100 && !state.done; i++) {
				state = generator.next(16);
			}

			expect(state.value).toBe(0);
		});
	});

	describe('tween', () => {
		it('should create a tween generator with default values', () => {
			const generator = createAnimationGenerator(0, 100, { type: 'tween' });

			const state = generator.next(16);

			expect(state.value).toBeGreaterThan(0);
			expect(state.done).toBe(false);
		});

		it('should complete at duration', () => {
			const generator = createAnimationGenerator(0, 100, {
				type: 'tween',
				duration: 0.3
			});

			// Run for 300ms
			let state = { value: 0, velocity: 0, done: false };
			for (let elapsed = 0; elapsed < 320; elapsed += 16) {
				state = generator.next(16);
			}

			expect(state.done).toBe(true);
			expect(state.value).toBe(100);
		});

		it('should respect duration option', () => {
			const shortGenerator = createAnimationGenerator(0, 100, {
				type: 'tween',
				duration: 0.1
			});

			const longGenerator = createAnimationGenerator(0, 100, {
				type: 'tween',
				duration: 1
			});

			// After 100ms, short should be done
			let shortState = { value: 0, velocity: 0, done: false };
			let longState = { value: 0, velocity: 0, done: false };

			for (let elapsed = 0; elapsed < 120; elapsed += 16) {
				shortState = shortGenerator.next(16);
				longState = longGenerator.next(16);
			}

			expect(shortState.done).toBe(true);
			expect(longState.done).toBe(false);
		});

		it('should apply easing function', () => {
			const linearGenerator = createAnimationGenerator(0, 100, {
				type: 'tween',
				duration: 1,
				ease: 'linear'
			});

			const easeOutGenerator = createAnimationGenerator(0, 100, {
				type: 'tween',
				duration: 1,
				ease: 'easeOut'
			});

			// At 50% progress
			let linearState = { value: 0, velocity: 0, done: false };
			let easeOutState = { value: 0, velocity: 0, done: false };

			for (let elapsed = 0; elapsed < 500; elapsed += 16) {
				linearState = linearGenerator.next(16);
				easeOutState = easeOutGenerator.next(16);
			}

			// easeOut should be ahead of linear at 50%
			expect(easeOutState.value).toBeGreaterThan(linearState.value);
		});
	});

	describe('keyframes', () => {
		it('should animate through keyframe values', () => {
			const generator = createAnimationGenerator(0, 100, {
				type: 'keyframes',
				values: [0, 50, 100],
				duration: 0.3
			});

			// At ~50% should be around middle keyframe (with some tolerance)
			let state = { value: 0, velocity: 0, done: false };
			for (let elapsed = 0; elapsed < 150; elapsed += 16) {
				state = generator.next(16);
			}

			// Allow wider range due to timing precision
			expect(state.value).toBeGreaterThan(40);
			expect(state.value).toBeLessThan(75);
		});

		it('should respect custom times', () => {
			const generator = createAnimationGenerator(0, 100, {
				type: 'keyframes',
				values: [0, 80, 100],
				times: [0, 0.2, 1], // Reach 80 at 20% of duration
				duration: 1
			});

			// At ~20% (200ms) - should be around 80
			let state = { value: 0, velocity: 0, done: false };
			for (let elapsed = 0; elapsed < 200; elapsed += 16) {
				state = generator.next(16);
			}

			// Allow tolerance for timing precision
			expect(state.value).toBeGreaterThan(75);
			expect(state.value).toBeLessThan(90);
		});
	});

	describe('inertia', () => {
		it('should decay based on initial velocity', () => {
			const generator = createAnimationGenerator(
				0,
				0, // target not used for inertia
				{ type: 'inertia', velocity: 1000, power: 0.8 },
				1000
			);

			const state = generator.next(16);

			expect(state.value).toBeGreaterThan(0);
			expect(state.velocity).toBeLessThan(1000);
		});

		it('should respect min/max constraints', () => {
			const generator = createAnimationGenerator(
				50,
				0,
				{
					type: 'inertia',
					velocity: -500,
					min: 0,
					max: 100,
					bounceStiffness: 500,
					bounceDamping: 20
				},
				-500
			);

			// Run until done
			let state = { value: 50, velocity: -500, done: false };
			for (let i = 0; i < 500 && !state.done; i++) {
				state = generator.next(16);
			}

			expect(state.value).toBeGreaterThanOrEqual(0);
		});
	});
});

describe('animate', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should call onUpdate with animated values', async () => {
		const updates: number[] = [];

		animate(0, 100, {
			type: 'tween',
			duration: 0.1,
			onUpdate: (v) => updates.push(v)
		});

		// Advance time
		for (let i = 0; i < 10; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(updates.length).toBeGreaterThan(0);
		expect(updates[0]).toBeGreaterThan(0);
	});

	it('should call onComplete when done', async () => {
		const onComplete = vi.fn();

		animate(0, 100, {
			type: 'tween',
			duration: 0.1,
			onComplete
		});

		// Advance past duration
		for (let i = 0; i < 15; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(onComplete).toHaveBeenCalled();
	});

	it('should respect delay option', async () => {
		const updates: number[] = [];

		animate(0, 100, {
			type: 'tween',
			duration: 0.1,
			delay: 0.1,
			onUpdate: (v) => updates.push(v)
		});

		// First 100ms should have no updates
		for (let i = 0; i < 6; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		// Updates should still be at initial during delay
		expect(updates.length).toBe(0);

		// After delay, updates should occur
		for (let i = 0; i < 10; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(updates.length).toBeGreaterThan(0);
	});

	it('should handle repeat option', async () => {
		let completions = 0;
		const updates: number[] = [];

		animate(0, 100, {
			type: 'tween',
			duration: 0.1,
			repeat: 2,
			onUpdate: (v) => updates.push(v),
			onComplete: () => completions++
		});

		// Run for 3x duration
		for (let i = 0; i < 40; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(completions).toBe(1); // Only fires once at end
	});

	it('should stop when stop() is called', async () => {
		const updates: number[] = [];

		const controls = animate(0, 100, {
			type: 'tween',
			duration: 1,
			onUpdate: (v) => updates.push(v)
		});

		// Advance a bit
		for (let i = 0; i < 5; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		const countBeforeStop = updates.length;
		controls.stop();

		// Advance more
		for (let i = 0; i < 10; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		// Should not have more updates after stop
		expect(updates.length).toBe(countBeforeStop);
	});

	it('should resolve finished promise when complete', async () => {
		const controls = animate(0, 100, {
			type: 'tween',
			duration: 0.1
		});

		let resolved = false;
		controls.finished.then(() => {
			resolved = true;
		});

		// Advance past duration
		for (let i = 0; i < 15; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		await Promise.resolve();
		expect(resolved).toBe(true);
	});
});

describe('animateValues', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should animate multiple values in parallel', async () => {
		const updates: Record<string, number>[] = [];

		animateValues(
			{
				x: { from: 0, to: 100 },
				y: { from: 0, to: 200 }
			},
			{
				type: 'tween',
				duration: 0.1,
				onUpdate: (values) => updates.push({ ...values })
			}
		);

		// Advance time
		for (let i = 0; i < 15; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(updates.length).toBeGreaterThan(0);

		const lastUpdate = updates[updates.length - 1];
		expect(lastUpdate.x).toBeCloseTo(100, 0);
		expect(lastUpdate.y).toBeCloseTo(200, 0);
	});

	it('should call onComplete when all animations finish', async () => {
		const onComplete = vi.fn();

		animateValues(
			{
				x: { from: 0, to: 100 },
				y: { from: 0, to: 200 }
			},
			{
				type: 'tween',
				duration: 0.1,
				onComplete
			}
		);

		// Advance past duration
		for (let i = 0; i < 15; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(onComplete).toHaveBeenCalled();
	});

	it('should stop all animations when stop() is called', async () => {
		const updates: Record<string, number>[] = [];

		const controls = animateValues(
			{
				x: { from: 0, to: 100 },
				y: { from: 0, to: 200 }
			},
			{
				type: 'tween',
				duration: 1,
				onUpdate: (values) => updates.push({ ...values })
			}
		);

		// Advance a bit
		for (let i = 0; i < 5; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		const countBeforeStop = updates.length;
		controls.stop();

		// Advance more
		for (let i = 0; i < 10; i++) {
			vi.advanceTimersByTime(16);
			await Promise.resolve();
		}

		expect(updates.length).toBe(countBeforeStop);
	});
});
