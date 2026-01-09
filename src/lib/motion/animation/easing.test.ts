/**
 * Easing Functions Tests
 *
 * Tests for easing functions, Svelte re-exports, and composition utilities
 */

import { describe, it, expect } from 'vitest';
import {
	getEasingFunction,
	mirrorEasing,
	reverseEasing,
	sequenceEasing,
	blendEasing,
	clampEasing,
	scaleEasing,
	// Svelte re-exports
	linear,
	quadIn,
	quadOut,
	cubicIn,
	elasticOut,
	bounceOut
} from './easing.js';

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

			expect(ease(0)).toBeCloseTo(0, 10);
			// backIn goes negative initially
			expect(ease(0.2)).toBeLessThan(0);
			expect(ease(1)).toBeCloseTo(1, 10);
		});

		it('should return backOut easing', () => {
			const ease = getEasingFunction('backOut');

			expect(ease(0)).toBeCloseTo(0, 10);
			// backOut overshoots
			expect(ease(0.8)).toBeGreaterThan(1);
			expect(ease(1)).toBeCloseTo(1, 10);
		});

		it('should return backInOut easing', () => {
			const ease = getEasingFunction('backInOut');

			expect(ease(0)).toBeCloseTo(0, 10);
			expect(ease(1)).toBeCloseTo(1, 10);
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
		const lin = getEasingFunction('linear');
		const reversed = reverseEasing(lin);

		expect(reversed(0.25)).toBeCloseTo(0.25, 5);
		expect(reversed(0.5)).toBeCloseTo(0.5, 5);
		expect(reversed(0.75)).toBeCloseTo(0.75, 5);
	});
});

describe('Svelte easing re-exports', () => {
	it('should export linear directly', () => {
		expect(linear(0.5)).toBe(0.5);
	});

	it('should export quadIn directly', () => {
		expect(quadIn(0)).toBe(0);
		expect(quadIn(0.5)).toBeLessThan(0.5);
		expect(quadIn(1)).toBe(1);
	});

	it('should export quadOut directly', () => {
		expect(quadOut(0)).toBe(0);
		expect(quadOut(0.5)).toBeGreaterThan(0.5);
		expect(quadOut(1)).toBe(1);
	});

	it('should export elasticOut directly', () => {
		expect(elasticOut(0)).toBeCloseTo(0, 5);
		// Elastic overshoots
		expect(elasticOut(0.7)).toBeGreaterThan(1);
		expect(elasticOut(1)).toBeCloseTo(1, 5);
	});

	it('should export bounceOut directly', () => {
		expect(bounceOut(0)).toBeCloseTo(0, 5);
		expect(bounceOut(1)).toBeCloseTo(1, 5);
	});

	it('should allow using Svelte easings with getEasingFunction', () => {
		const elastic = getEasingFunction('elasticOut');
		expect(elastic(0.5)).toBeDefined();
		expect(typeof elastic(0.5)).toBe('number');
	});

	it('should allow using bounce easings with getEasingFunction', () => {
		const bounce = getEasingFunction('bounceInOut');
		expect(bounce(0)).toBeCloseTo(0, 5);
		expect(bounce(1)).toBeCloseTo(1, 5);
	});
});

describe('sequenceEasing', () => {
	it('should combine easings at breakpoints', () => {
		const seq = sequenceEasing([linear, linear, linear], [0.3, 0.7]);

		expect(seq(0)).toBeCloseTo(0, 5);
		expect(seq(0.3)).toBeCloseTo(0.3, 5);
		expect(seq(0.5)).toBeCloseTo(0.5, 5);
		expect(seq(0.7)).toBeCloseTo(0.7, 5);
		expect(seq(1)).toBeCloseTo(1, 5);
	});

	it('should throw if easings and breakpoints mismatch', () => {
		expect(() => sequenceEasing([linear, linear], [0.3, 0.7])).toThrow();
	});
});

describe('blendEasing', () => {
	it('should blend two easings by weight', () => {
		const blended = blendEasing(linear, quadIn, 0.5);

		// At t=0.5, linear gives 0.5, quadIn gives 0.25
		// Blend should be (0.5 + 0.25) / 2 = 0.375
		expect(blended(0.5)).toBeCloseTo(0.375, 5);
	});

	it('should return first easing when weight is 0', () => {
		const blended = blendEasing(linear, quadIn, 0);
		expect(blended(0.5)).toBeCloseTo(0.5, 5);
	});

	it('should return second easing when weight is 1', () => {
		const blended = blendEasing(linear, quadIn, 1);
		expect(blended(0.5)).toBeCloseTo(quadIn(0.5), 5);
	});
});

describe('clampEasing', () => {
	it('should clamp easing to specified range', () => {
		const clamped = clampEasing(linear, 0.2, 0.8);

		expect(clamped(0)).toBe(0);
		expect(clamped(0.1)).toBe(0);
		expect(clamped(0.2)).toBeCloseTo(0, 5);
		expect(clamped(0.5)).toBeCloseTo(0.5, 5);
		expect(clamped(0.8)).toBeCloseTo(1, 5);
		expect(clamped(1)).toBe(1);
	});
});

describe('scaleEasing', () => {
	it('should scale easing intensity', () => {
		const scaled = scaleEasing(linear, 2);

		// linear(0.5) = 0.5, scaled = 0.5^2 = 0.25
		expect(scaled(0.5)).toBeCloseTo(0.25, 5);
	});

	it('should preserve endpoints', () => {
		const scaled = scaleEasing(quadIn, 1.5);

		expect(scaled(0)).toBe(0);
		expect(scaled(1)).toBe(1);
	});
});
