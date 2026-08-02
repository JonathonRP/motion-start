/**
 * Regression test for motion 12.36.0:
 * "Ensure `anticipate` easing returns `1` at `p === 1`."
 */

import { describe, expect, test } from 'vitest';
import { anticipate } from '../anticipate.js';

describe('anticipate easing', () => {
	test('returns 0 at progress 0', () => {
		expect(anticipate(0)).toBe(0);
	});

	test('is clamped to 1 at progress >= 1', () => {
		expect(anticipate(1)).toBe(1);
		expect(anticipate(1.5)).toBe(1);
		expect(anticipate(2)).toBe(1);
	});

	test('anticipates backwards before moving forwards', () => {
		expect(anticipate(0.1)).toBeLessThan(0);
		expect(anticipate(0.9)).toBeGreaterThan(0.9);
	});
});
