/**
 * Unit tests for color mixing utilities
 */

import { describe, it, expect } from 'vitest';
import { mixColor, mixLinearColor } from './color';

describe('mixLinearColor', () => {
	it('should mix colors in linear color space', () => {
		// Test linear interpolation at midpoint
		const result = mixLinearColor(0, 255, 0.5);
		expect(result).toBeCloseTo(180.31, 1);
	});

	it('should return from value at progress 0', () => {
		const result = mixLinearColor(100, 200, 0);
		expect(result).toBe(100);
	});

	it('should return to value at progress 1', () => {
		const result = mixLinearColor(100, 200, 1);
		expect(result).toBe(200);
	});

	it('should handle negative inputs', () => {
		const result = mixLinearColor(-100, -50, 0.5);
		// Negative squared is positive, so sqrt gives positive result
		expect(result).toBeGreaterThanOrEqual(0);
	});
});

describe('mixColor', () => {
	it('should interpolate between hex colors at midpoint', () => {
		const mixer = mixColor('#FF0000', '#0000FF');
		const result = mixer(0.5);
		// Returns rgba format, not hex
		expect(result).toContain('rgba');
		expect(result).toContain('180'); // Purple-ish
	});

	it('should return from color at progress 0', () => {
		const mixer = mixColor('#FF0000', '#0000FF');
		const result = mixer(0);
		expect(result).toBe('rgba(255, 0, 0, 1)');
	});

	it('should return to color at progress 1', () => {
		const mixer = mixColor('#FF0000', '#0000FF');
		const result = mixer(1);
		expect(result).toBe('rgba(0, 0, 255, 1)');
	});

	it('should interpolate between rgba colors', () => {
		const mixer = mixColor('rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)');
		const result = mixer(0.5);
		expect(result).toContain('rgba');
	});

	it('should interpolate between hsla colors', () => {
		const mixer = mixColor('hsla(0, 100%, 50%, 1)', 'hsla(120, 100%, 50%, 1)');
		const result = mixer(0.5);
		expect(result).toContain('rgba');
	});

	it('should handle alpha channel interpolation', () => {
		const mixer = mixColor('rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 1)');
		const result = mixer(0.5);
		expect(result).toContain('0.5');
	});

	it('should fallback to immediate mix for non-color values', () => {
		const mixer = mixColor('not-a-color', 'also-not-a-color');
		const result = mixer(0);
		expect(result).toBe('not-a-color');
	});
});
