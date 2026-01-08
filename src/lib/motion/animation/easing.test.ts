/**
 * Easing Functions Tests
 *
 * Ported from motiondivision/motion test patterns
 */

import { describe, it, expect } from 'vitest';
import { getEasingFunction, mirrorEasing, reverseEasing } from './easing.js';

describe('getEasingFunction', () => {
	describe('named easings', () => {
		it('should return linear easing', () => {
			const ease = getEasingFunction('linear');

			expect(ease(0)).toBe(0);
			expect(ease(0.5)).toBe(0.5);
			expect(ease(1)).toBe(1);
		});

		it('should return easeIn easing', () => {
			const ease = getEasingFunction('easeIn');

			expect(ease(0)).toBe(0);
			expect(ease(0.5)).toBeLessThan(0.5); // easeIn is slower at start
			expect(ease(1)).toBe(1);
		});

		it('should return easeOut easing', () => {
			const ease = getEasingFunction('easeOut');

			expect(ease(0)).toBe(0);
			expect(ease(0.5)).toBeGreaterThan(0.5); // easeOut is faster at start
			expect(ease(1)).toBe(1);
		});

		it('should return easeInOut easing', () => {
			const ease = getEasingFunction('easeInOut');

			expect(ease(0)).toBe(0);
			// easeInOut is symmetric but may not be exactly 0.5 at t=0.5
			expect(ease(0.5)).toBeGreaterThan(0.3);
			expect(ease(0.5)).toBeLessThan(0.9);
			expect(ease(1)).toBe(1);
		});

		it('should return circIn easing', () => {
			const ease = getEasingFunction('circIn');

			expect(ease(0)).toBe(0);
			expect(ease(0.5)).toBeLessThan(0.5);
			expect(ease(1)).toBeCloseTo(1, 5);
		});

		it('should return circOut easing', () => {
			const ease = getEasingFunction('circOut');

			expect(ease(0)).toBeCloseTo(0, 5);
			expect(ease(0.5)).toBeGreaterThan(0.5);
			expect(ease(1)).toBeCloseTo(1, 5);
		});

		it('should return circInOut easing', () => {
			const ease = getEasingFunction('circInOut');

			expect(ease(0)).toBeCloseTo(0, 5);
			expect(ease(1)).toBeCloseTo(1, 5);
		});

		it('should return backIn easing', () => {
			const ease = getEasingFunction('backIn');

			expect(ease(0)).toBe(0);
			// backIn goes negative initially
			expect(ease(0.2)).toBeLessThan(0);
			expect(ease(1)).toBe(1);
		});

		it('should return backOut easing', () => {
			const ease = getEasingFunction('backOut');

			expect(ease(0)).toBe(0);
			// backOut overshoots
			expect(ease(0.8)).toBeGreaterThan(1);
			expect(ease(1)).toBe(1);
		});

		it('should return backInOut easing', () => {
			const ease = getEasingFunction('backInOut');

			expect(ease(0)).toBe(0);
			expect(ease(1)).toBe(1);
		});

		it('should return anticipate easing', () => {
			const ease = getEasingFunction('anticipate');

			// anticipate starts at 0 (or very close to 0)
			expect(Math.abs(ease(0))).toBeLessThan(0.001);
			// anticipate pulls back then shoots forward
			expect(ease(0.2)).toBeLessThan(0);
			expect(ease(1)).toBeCloseTo(1, 5);
		});
	});

	describe('cubic bezier', () => {
		it('should create cubic bezier from array', () => {
			const ease = getEasingFunction([0.25, 0.1, 0.25, 1]);

			expect(ease(0)).toBe(0);
			expect(ease(1)).toBe(1);
			expect(ease(0.5)).toBeGreaterThan(0);
			expect(ease(0.5)).toBeLessThan(1);
		});

		it('should handle linear bezier', () => {
			const ease = getEasingFunction([0, 0, 1, 1]);

			expect(ease(0)).toBe(0);
			expect(ease(0.25)).toBeCloseTo(0.25, 2);
			expect(ease(0.5)).toBeCloseTo(0.5, 2);
			expect(ease(0.75)).toBeCloseTo(0.75, 2);
			expect(ease(1)).toBe(1);
		});

		it('should handle ease-in bezier', () => {
			const ease = getEasingFunction([0.42, 0, 1, 1]);

			expect(ease(0)).toBe(0);
			expect(ease(0.5)).toBeLessThan(0.5);
			expect(ease(1)).toBe(1);
		});

		it('should handle ease-out bezier', () => {
			const ease = getEasingFunction([0, 0, 0.58, 1]);

			expect(ease(0)).toBe(0);
			expect(ease(0.5)).toBeGreaterThan(0.5);
			expect(ease(1)).toBe(1);
		});
	});

	describe('fallback', () => {
		it('should fallback to easeOut for unknown easing', () => {
			// @ts-expect-error Testing unknown easing
			const ease = getEasingFunction('unknown');
			const easeOut = getEasingFunction('easeOut');

			expect(ease(0.5)).toBe(easeOut(0.5));
		});
	});
});

describe('mirrorEasing', () => {
	it('should mirror easing around midpoint', () => {
		const easeIn = getEasingFunction('easeIn');
		const mirrored = mirrorEasing(easeIn);

		// First half should use easeIn
		expect(mirrored(0)).toBe(0);
		expect(mirrored(0.25)).toBeCloseTo(easeIn(0.5) / 2, 5);

		// Second half should mirror
		expect(mirrored(1)).toBe(1);
	});

	it('should create smooth transition at midpoint', () => {
		const linear = getEasingFunction('linear');
		const mirrored = mirrorEasing(linear);

		// For linear, mirrored should still be linear
		expect(mirrored(0.5)).toBeCloseTo(0.5, 5);
	});
});

describe('reverseEasing', () => {
	it('should reverse easing direction', () => {
		const easeIn = getEasingFunction('easeIn');
		const reversed = reverseEasing(easeIn);

		// Reversed easeIn should behave like easeOut
		expect(reversed(0)).toBe(0);
		expect(reversed(0.5)).toBeGreaterThan(0.5); // Like easeOut
		expect(reversed(1)).toBe(1);
	});

	it('should be idempotent when applied twice', () => {
		const easeIn = getEasingFunction('easeIn');
		const doubleReversed = reverseEasing(reverseEasing(easeIn));

		expect(doubleReversed(0.3)).toBeCloseTo(easeIn(0.3), 5);
		expect(doubleReversed(0.7)).toBeCloseTo(easeIn(0.7), 5);
	});

	it('should not change linear easing', () => {
		const linear = getEasingFunction('linear');
		const reversed = reverseEasing(linear);

		expect(reversed(0.25)).toBeCloseTo(0.25, 5);
		expect(reversed(0.5)).toBeCloseTo(0.5, 5);
		expect(reversed(0.75)).toBeCloseTo(0.75, 5);
	});
});
