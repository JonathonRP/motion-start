/**
 * Unit tests for complex value mixing utilities
 */

import { describe, it, expect } from 'vitest';
import { mixComplex } from './complex';

describe('mixComplex', () => {
	it('should mix complex values with numbers', () => {
		const mixer = mixComplex('0px 0px', '100px 50px');
		const result = mixer(0.5);
		expect(result).toBe('50px 25px');
	});

	it('should return from value at progress 0', () => {
		const mixer = mixComplex('0px 0px', '100px 50px');
		const result = mixer(0);
		expect(result).toBe('0px 0px');
	});

	it('should return to value at progress 1', () => {
		const mixer = mixComplex('0px 0px', '100px 50px');
		const result = mixer(1);
		expect(result).toBe('100px 50px');
	});

	it('should handle transform values', () => {
		const mixer = mixComplex('translateX(0px) scale(1)', 'translateX(100px) scale(2)');
		const result = mixer(0.5);
		expect(result).toContain('50px');
		expect(result).toContain('1.5');
	});

	it('should preserve non-numeric parts', () => {
		const mixer = mixComplex('rotate(0deg)', 'rotate(90deg)');
		const result = mixer(0.5);
		expect(result).toBe('rotate(45deg)');
	});

	it('should handle mixed units', () => {
		const mixer = mixComplex('0px', '100%');
		const result = mixer(0.5);
		// Should preserve the pattern with interpolated number
		expect(result).toMatch(/\d+/);
	});

	it('should handle colors within complex values', () => {
		const mixer = mixComplex('0px solid #FF0000', '100px solid #0000FF');
		const result = mixer(0.5);
		expect(result).toContain('50px');
		expect(result).toContain('solid');
	});
});
