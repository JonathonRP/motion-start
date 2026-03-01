/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { mixColor, mixLinearColor } from '../color';

describe('mixLinearColor', () => {
	test('mixes color component values in linear color space', () => {
		// Linear color space mixing uses squared values
		expect(mixLinearColor(0, 255, 0)).toBe(0);
		expect(mixLinearColor(0, 255, 1)).toBe(255);
	});

	test('returns 0 for negative results', () => {
		expect(mixLinearColor(0, 0, -1)).toBe(0);
	});
});

describe('mixColor', () => {
	test('mixes hex colors', () => {
		const mixer = mixColor('#000000', '#ffffff');
		expect(mixer(0)).toBe('rgba(0, 0, 0, 1)');
		expect(mixer(1)).toBe('rgba(255, 255, 255, 1)');
	});

	test('mixes rgba colors', () => {
		const mixer = mixColor('rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)');
		expect(mixer(0)).toBe('rgba(0, 0, 0, 1)');
		expect(mixer(1)).toBe('rgba(255, 255, 255, 1)');
	});

	test('mixes rgb colors', () => {
		const mixer = mixColor('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
		expect(mixer(0)).toBe('rgba(0, 0, 0, 1)');
		expect(mixer(1)).toBe('rgba(255, 255, 255, 1)');
	});

	test('interpolates alpha values linearly', () => {
		const mixer = mixColor('rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)');
		expect(mixer(0)).toBe('rgba(0, 0, 0, 0)');
		expect(mixer(0.5)).toBe('rgba(0, 0, 0, 0.5)');
		expect(mixer(1)).toBe('rgba(0, 0, 0, 1)');
	});
});
