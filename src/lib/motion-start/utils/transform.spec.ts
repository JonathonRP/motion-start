/**
 * Unit tests for transform utility
 */

import { describe, it, expect } from 'vitest';
import { transform } from './transform';

describe('transform', () => {
	it('should transform value from one range to another', () => {
		const t = transform([0, 100], [0, 1]);
		expect(t(50)).toBe(0.5);
	});

	it('should clamp output by default', () => {
		const t = transform([0, 100], [0, 1]);
		expect(t(150)).toBe(1);
		expect(t(-50)).toBe(0);
	});

	it('should allow disabling clamp', () => {
		const t = transform([0, 100], [0, 1], { clamp: false });
		expect(t(150)).toBe(1.5);
		expect(t(-50)).toBe(-0.5);
	});

	it('should apply easing function', () => {
		const easeIn = (t: number) => t * t;
		const t = transform([0, 1], [0, 100], { ease: easeIn });
		const result = t(0.5);
		expect(result).toBeCloseTo(25, 1);
	});

	it('should handle multi-segment transforms', () => {
		const t = transform([0, 50, 100], [0, 1, 0]);
		expect(t(0)).toBe(0);
		expect(t(50)).toBe(1);
		expect(t(100)).toBe(0);
	});

	it('should use custom mixer', () => {
		const stringMixer = (from: string, to: string) => {
			return (v: number) => v < 0.5 ? from : to;
		};
		const t = transform([0, 1], ['start', 'end'], { mixer: stringMixer });
		expect(t(0.3)).toBe('start');
		expect(t(0.7)).toBe('end');
	});

	it('should handle negative input ranges', () => {
		const t = transform([-100, 0], [0, 100]);
		expect(t(-100)).toBe(0);
		expect(t(-50)).toBe(50);
		expect(t(0)).toBe(100);
	});

	it('should handle reverse output ranges', () => {
		const t = transform([0, 100], [100, 0]);
		expect(t(0)).toBe(100);
		expect(t(50)).toBe(50);
		expect(t(100)).toBe(0);
	});
});
