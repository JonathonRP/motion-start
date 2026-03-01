/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { copyBoxInto, copyAxisInto, copyAxisDeltaInto } from '../copy';
import { createBox, createAxisDelta } from '../models';

describe('copyAxisInto', () => {
	test('copies one axis into an existing axis', () => {
		const a = { min: 0, max: 0 };
		const b = { min: 10, max: 20 };

		copyAxisInto(a, b);

		expect(a).toEqual(b);
		expect(a).not.toBe(b);
	});
});

describe('copyBoxInto', () => {
	test('copies one box into an existing box', () => {
		const a = createBox();
		const b = {
			x: { min: 1, max: 2 },
			y: { min: 3, max: 4 },
		};

		copyBoxInto(a, b);

		expect(a).toEqual(b);
		expect(a).not.toBe(b);
	});
});

describe('copyAxisDeltaInto', () => {
	test('copies one axis delta into an existing axis delta', () => {
		const a = createAxisDelta();
		const b = {
			translate: 100,
			scale: 2,
			origin: 0.5,
			originPoint: 50,
		};

		copyAxisDeltaInto(a, b);

		expect(a).toEqual(b);
		expect(a).not.toBe(b);
	});
});
