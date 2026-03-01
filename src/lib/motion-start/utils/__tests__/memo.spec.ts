/**
 * Based on framer-motion@11.11.11
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect, vi } from 'vitest';
import { memo } from '../memo';

describe('memo', () => {
	test('Only fires callback once', () => {
		const callback = vi.fn();

		const testFn = () => {
			callback();
			return 0;
		};

		const memoized = memo(testFn);

		expect(memoized()).toEqual(0);
		expect(memoized()).toEqual(0);
		expect(callback).toBeCalledTimes(1);
	});
});
