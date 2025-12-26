/**
 * Phase 2: Animation System Functionality Tests
 *
 * Tests that animation functionality works correctly after reorganization
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Phase 2: Animation System Functionality', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Spring Generator', () => {
		it('should generate spring animation values', async () => {
			const { spring } = await import('../generators/spring/index.js');

			const springGen = spring({
				keyframes: [0, 100],
				stiffness: 100,
				damping: 10,
				mass: 1,
			});

			expect(springGen).toBeDefined();
			expect(typeof springGen.next).toBe('function');

			// First value should be the starting value
			const firstResult = springGen.next(0);
			expect(firstResult.value).toBe(0);
			expect(firstResult.done).toBe(false);
		});

		it('should accept duration and bounce options', async () => {
			const { spring } = await import('../generators/spring/index.js');

			const springGen = spring({
				keyframes: [0, 100],
				duration: 1000,
				bounce: 0.3,
			});

			expect(springGen).toBeDefined();
			const result = springGen.next(0);
			expect(result.value).toBe(0);
		});
	});

	describe('Keyframes Generator', () => {
		it('should generate keyframe animation values', async () => {
			const { keyframes } = await import('../generators/keyframes.js');

			const keyframesGen = keyframes({
				keyframes: [0, 50, 100],
				duration: 1000,
				ease: 'easeInOut',
			});

			expect(keyframesGen).toBeDefined();
			expect(typeof keyframesGen.next).toBe('function');

			const firstResult = keyframesGen.next(0);
			expect(firstResult.value).toBe(0);
			expect(firstResult.done).toBe(false);
		});
	});

	describe('Inertia Generator', () => {
		it('should generate inertia animation values', async () => {
			const { inertia } = await import('../generators/inertia.js');

			const inertiaGen = inertia({
				keyframes: [0],
				velocity: 100,
				power: 0.8,
			});

			expect(inertiaGen).toBeDefined();
			expect(typeof inertiaGen.next).toBe('function');

			const firstResult = inertiaGen.next(0);
			expect(firstResult.value).toBe(0);
			expect(firstResult.done).toBe(false);
		});
	});

	describe('Animation Controls', () => {
		it('should create animation controls', async () => {
			const { animationControls } = await import('../animation-controls.js');

			const controls = animationControls();

			expect(controls).toBeDefined();
			expect(typeof controls.start).toBe('function');
			expect(typeof controls.stop).toBe('function');
			expect(typeof controls.set).toBe('function');
		});
	});

	describe('Animate Function', () => {
		it.skip('should return animation playback controls', async () => {
			// Skipped: Requires DOM (NodeList) - covered by browser tests
			const { animate } = await import('../animate/index.js');
			const { motionValue } = await import('../../value/index.js');

			const value = motionValue(0);
			const animation = animate(value, 100, { duration: 1000 });

			expect(animation).toBeDefined();
			expect(typeof animation.stop).toBe('function');
		});
	});

	describe('Type Safety', () => {
		it.skip('should maintain AnimationPlaybackControls interface', async () => {
			// Skipped: Requires DOM (NodeList) - covered by browser tests
			const { animate } = await import('../animate/index.js');
			const { motionValue } = await import('../../value/index.js');

			const value = motionValue(0);
			const controls = animate(value, 100);

			// Check that the controls have the expected shape
			expect(controls).toHaveProperty('stop');
			expect(typeof controls.stop).toBe('function');
		});
	});
});
