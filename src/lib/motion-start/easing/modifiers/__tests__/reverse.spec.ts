/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */
import { describe, test, expect } from 'vitest';
import { reverseEasing } from '../reverse';
import { easeOut } from '../../ease';

describe('reverseEasing', () => {
	test('correctly reverses an easing curve', () => {
		expect(reverseEasing(easeOut)(0.25)).toEqual(1 - easeOut(0.75));
	});
});
