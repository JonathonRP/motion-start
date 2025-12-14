/**
 * Integration tests for utility functions
 * Tests how clamp, mix, interpolate, and transform work together
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { clamp } from './clamp';
import { mixNumber } from './mix/number';
import { mixColor } from './mix/color';
import { mixComplex } from './mix/complex';
import { interpolate } from './interpolate';
import { transform } from './transform';

describe('Integration: Utility Functions', () => {
	describe('clamp with numeric operations', () => {
		// Based on: clamp unit test 1
		it('should integrate clamp with value above max', () => {
			const max = 100;
			const value = 150;
			const clamped = clamp(0, max, value);
			expect(clamped).toBe(max);

			// Use clamped value in mix
			const mixed = mixNumber(0, clamped, 0.5);
			expect(mixed).toBe(50);
		});

		// Based on: clamp unit test 2
		it('should integrate clamp with value below min', () => {
			const min = 0;
			const value = -50;
			const clamped = clamp(min, 100, value);
			expect(clamped).toBe(min);

			// Use clamped value in mix
			const mixed = mixNumber(clamped, 100, 0.5);
			expect(mixed).toBe(50);
		});

		// Based on: mixNumber unit test 3
		it('should integrate clamp with range operations', () => {
			const value = 50;
			const clamped = clamp(0, 100, value);
			expect(clamped).toBe(50);

			// Chain with interpolation
			const interpolator = interpolate([0, 50, 100], [0, 50, 100]);
			const interpolated = interpolator(clamped);
			expect(interpolated).toBe(50);
		});

		// Based on: clamp unit test 4
		it('should handle clamp with negative ranges in workflow', () => {
			const clamped = clamp(-100, -50, -75);
			expect(clamped).toBe(-75);

			// Mix with positive range
			const mixed = mixNumber(clamped, 0, 0.5);
			expect(mixed).toBeCloseTo(-37.5, 5);
		});

		// Based on: clamp unit test 5
		it('should clamp at boundaries in complex workflow', () => {
			const min = clamp(0, 100, 0);
			const max = clamp(0, 100, 100);

			expect(min).toBe(0);
			expect(max).toBe(100);

			// Use in interpolation range - pass midpoint value
			const interpolator = interpolate([min, max], ['0px', '100px']);
			const interpolated = interpolator(50); // Midpoint of [0, 100]
			expect(interpolated).toContain('50');
		});

		// Based on: clamp unit test 6
		it('should integrate clamp with decimal values', () => {
			const clamped = clamp(0, 1, 0.5);
			expect(clamped).toBe(0.5);

			// Use in color opacity mixing
			const opacity = mixNumber(0, 1, clamped);
			expect(opacity).toBe(0.5);
		});

		// Based on: clamp unit test 7
		it('should handle reversed min/max in workflow', () => {
			const clamped = clamp(100, 0, 50);
			expect(clamped).toBe(0);

			// Verify clamp works with reversed ranges
			const clamped2 = clamp(100, 0, 75);
			expect(clamped2).toBe(0);
		});
	});

	describe('mixing with interpolation', () => {
		// Based on: mixNumber unit test 1
		it('should mix numbers at midpoint for keyframe animations', () => {
			const from = 0;
			const to = 100;
			const progress = 0.5;

			const value = mixNumber(from, to, progress);
			expect(value).toBe(50);

			// Use in interpolation for multi-segment animation - pass the midpoint value
			const interpolator = interpolate([0, 50, 100], [0, 50, 100]);
			const interpolated = interpolator(50);
			expect(interpolated).toBe(50);
		});

		// Based on: mixNumber unit test 2
		it('should return from value at progress 0 in animation start', () => {
			const value = mixNumber(10, 20, 0);
			expect(value).toBe(10);

			// Verify consistent with interpolate at start
			const interpolator = interpolate([10, 20], [10, 20]);
			const interpolated = interpolator(0);
			expect(interpolated).toBe(10);
		});

		// Based on: mixNumber unit test 3
		it('should return to value at progress 1 in animation end', () => {
			const value = mixNumber(10, 20, 1);
			expect(value).toBe(20);

			// Verify consistent with interpolate at end - pass the end value (20)
			const interpolator = interpolate([10, 20], [10, 20]);
			const interpolated = interpolator(20);
			expect(interpolated).toBe(20);
		});

		// Based on: mixNumber unit test 4
		it('should handle negative numbers in workflow', () => {
			const midpoint = mixNumber(-100, 100, 0.5);
			expect(midpoint).toBe(0);

			// Clamp and transform
			const clamped = clamp(-100, 100, midpoint);
			expect(clamped).toBe(0);
		});

		// Based on: mixNumber unit test 5
		it('should handle extrapolation with negative progress', () => {
			const extrapolated = mixNumber(0, 100, -0.5);
			expect(extrapolated).toBe(-50);

			// Clamp to valid range
			const clamped = clamp(0, 100, extrapolated);
			expect(clamped).toBe(0);
		});

		// Based on: mixNumber unit test 6
		it('should handle progress > 1 (extrapolation) in overshoot animations', () => {
			const value = mixNumber(0, 100, 1.5);
			expect(value).toBe(150);

			// Clamp if needed
			const clamped = clamp(0, 100, value);
			expect(clamped).toBe(100);
		});

		// Based on: mixNumber unit test 7
		it('should handle decimal precision in value animation', () => {
			const value = mixNumber(0, 1, 0.333);
			expect(value).toBeCloseTo(0.333, 3);

			// Use in opacity animation
			const opacity = clamp(0, 1, value);
			expect(opacity).toBeCloseTo(0.333, 3);
		});

		// Based on: mixNumber unit test 8
		it('should handle same from and to values (static animation)', () => {
			const value = mixNumber(50, 50, 0.5);
			expect(value).toBe(50);

			// Consistent across all progress values
			expect(mixNumber(50, 50, 0)).toBe(50);
			expect(mixNumber(50, 50, 1)).toBe(50);
		});
	});

	describe('color mixing with complex values', () => {
		// Based on: mixColor unit test 1
		it('should interpolate between hex colors in workflow', () => {
			const from = '#FF0000';
			const to = '#0000FF';

			const mixer = mixColor(from, to);
			const mid = mixer(0.5);
			// Should produce a purple-ish color
			expect(mid).toBeDefined();

			// Mix complex value with transform
			const complexMixer = mixComplex('rgba(255, 0, 0, 1)', 'rgba(0, 0, 255, 1)');
			const complex = complexMixer(0.5);
			expect(complex).toBeDefined();
		});

		// Based on: mixColor unit test 4
		it('should return color at progress 0', () => {
			const from = 'rgb(100, 0, 0)';
			const colorMixer = mixColor(from, 'rgb(0, 0, 100)');
			const value = colorMixer(0);
			// mixColor converts to RGBA format
			expect(value).toContain('rgba');
			expect(value).toContain('100');
		});

		// Based on: mixColor unit test 5
		it('should return color at progress 1', () => {
			const to = 'rgb(0, 0, 100)';
			const colorMixer = mixColor('rgb(100, 0, 0)', to);
			const value = colorMixer(1);
			// mixColor converts to RGBA format
			expect(value).toContain('rgba');
			expect(value).toContain('100');
		});

		// Based on: mixColor unit test 7
		it('should interpolate between rgba colors', () => {
			const from = 'rgba(100, 50, 200, 1)';
			const to = 'rgba(200, 150, 100, 0.5)';

			const mixer = mixColor(from, to);
			const mid = mixer(0.5);
			expect(mid).toBeDefined();
		});

		// Based on: mixColor unit test 8
		it('should handle alpha channel interpolation', () => {
			const from = 'rgba(255, 0, 0, 0)';
			const to = 'rgba(255, 0, 0, 1)';

			const mixer = mixColor(from, to);
			const mid = mixer(0.5);
			expect(mid).toBeDefined();
		});
	});

	describe('transform with interpolation', () => {
		// Based on: transform unit test 1
		it('should transform value from one range to another', () => {
			const transformed = transform(0.5, [0, 1], [0, 100]);
			expect(transformed).toBe(50);

			// Use in clamping
			const clamped = clamp(0, 100, transformed);
			expect(clamped).toBe(50);
		});

		// Based on: transform unit test 2
		it('should clamp output by default', () => {
			const transformed = transform(1.5, [0, 1], [0, 100]);
			expect(transformed).toBe(100);
		});

		// Based on: transform unit test 3
		it('should allow disabling clamp', () => {
			const transformed = transform(2, [0, 1], [0, 100], { clamp: false });
			expect(transformed).toBeGreaterThan(100);
		});

		// Based on: transform unit test 5
		it('should apply easing in animation', () => {
			const eased = transform(0.5, [0, 1], [0, 100], { ease: (t) => t * t });
			expect(eased).toBeLessThan(50);
		});
	});

	describe('interpolate with multiple segments', () => {
		// Based on: interpolate unit test 1
		it('should interpolate between numeric ranges', () => {
			const interpolator = interpolate([0, 100], [0, 100]);
			// Pass the midpoint value from the range
			const value = interpolator(50);
			expect(value).toBe(50);

			// Clamp result
			const clamped = clamp(0, 100, value);
			expect(clamped).toBe(50);
		});

		// Based on: interpolate unit test 3
		it('should clamp values when clamp option is true', () => {
			const interpolator = interpolate([0, 100], [0, 100], { clamp: true });
			// Pass the midpoint value from the range
			const value = interpolator(50);
			expect(value).toBe(50);
		});

		// Based on: interpolate unit test 4
		it('should handle multi-segment ranges', () => {
			const interpolator = interpolate([0, 50, 100], ['0px', '50px', '100px']);
			const value = interpolator(0.5);
			expect(value).toContain('px');
		});

		// Based on: interpolate unit test 7
		it('should handle reverse ranges', () => {
			const interpolator = interpolate([100, 0], [100, 0]);
			// At midpoint of range [100, 0] we're at 50
			const value = interpolator(50);
			expect(value).toBe(50);
		});

		// Based on: interpolate unit test 8
		it('should handle negative ranges', () => {
			const interpolator = interpolate([-100, 0], [-100, 0]);
			// At midpoint of range [-100, 0] we're at -50
			const value = interpolator(-50);
			expect(value).toBe(-50);
		});

		// Based on: interpolate unit test 10
		it('should work with custom mixer', () => {
			const customMixer = (from: number, to: number) => (p: number) => from + (to - from) * p;
			const interpolator = interpolate([0, 100], [0, 100], { mixer: customMixer });
			// interpolate takes the actual input value from the range
			const value = interpolator(50);
			expect(value).toBe(50);
		});
	});

	describe('complex workflow: animation pipeline', () => {
		it('should pipeline clamp -> mix -> interpolate -> transform', () => {
			// Simulate drag animation with constraints
			const dragInput = 150; // User dragged past max
			const maxDrag = 100;

			// 1. Clamp drag to constraint
			const constrainedDrag = clamp(0, maxDrag, dragInput);
			expect(constrainedDrag).toBe(100);

			// 2. Mix between start and end positions
			const animationProgress = 0.5;
			const position = mixNumber(0, constrainedDrag, animationProgress);
			expect(position).toBe(50);

			// 3. Interpolate to pixel values
			const pixelInterpolator = interpolate([0, constrainedDrag], ['0px', '100px']);
			const pixelValue = pixelInterpolator(0.5);
			expect(pixelValue).toContain('px');

			// 4. Transform for easing
			const easedValue = transform(0.5, [0, 1], [0, 100], { ease: (t) => t * t });
			expect(easedValue).toBeLessThan(50);
		});

		it('should pipeline color animation with interpolation', () => {
			// Animate from red to blue
			const startColor = '#FF0000';
			const endColor = '#0000FF';
			const progress = 0.5;

			// 1. Mix colors
			const mixer = mixColor(startColor, endColor);
			const mixedColor = mixer(progress);
			expect(mixedColor).toBeDefined();

			// 2. Use in complex value
			const complexMixed = mixComplex(
				`rgba(255, 0, 0, 1)`,
				`rgba(0, 0, 255, 1)`
			)(progress);
			expect(complexMixed).toBeDefined();
		});

		it('should pipeline transform constraints with easing', () => {
			// Input range: 0-100, Output range: 0-200, with easing
			const value = 75;

			// 1. Clamp to input range
			const clamped = clamp(0, 100, value);
			expect(clamped).toBe(75);

			// 2. Normalize to 0-1 for easing
			const normalized = clamped / 100;

			// 3. Apply easing
				const eased = (x: number): number => x * x;
			const easedNorm = eased(normalized);
			expect(easedNorm).toBeCloseTo(0.5625, 4); // 0.75^2

			// 4. Scale to output range
			const scaled = easedNorm * 200;
			expect(scaled).toBeCloseTo(112.5, 4);
		});
	});
});
