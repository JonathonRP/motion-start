/**
 * Based on framer-motion@11.11.11
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect } from 'vitest';
import { addUniqueItem, removeItem } from '../array';

describe('addUniqueItem', () => {
	test('Adds a unique item', () => {
		const array = [0, 1, 2, 3];
		addUniqueItem(array, 4);
		expect(array).toEqual([0, 1, 2, 3, 4]);
	});

	test("Doesn't add a duplicate item", () => {
		const array = [0, 1, 2, 3];
		addUniqueItem(array, 3);
		expect(array).toEqual([0, 1, 2, 3]);
	});
});

describe('removeItem', () => {
	test('Removes an item', () => {
		const array = [0, 1, 2, 3];
		removeItem(array, 2);
		expect(array).toEqual([0, 1, 3]);
	});

	test('Does nothing if item not in array', () => {
		const array = [0, 1, 2, 3];
		removeItem(array, 4);
		expect(array).toEqual([0, 1, 2, 3]);
	});
});
