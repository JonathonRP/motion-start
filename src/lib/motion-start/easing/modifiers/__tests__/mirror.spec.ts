/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */
import { describe, test, expect } from 'vitest';
import { mirrorEasing } from '../mirror';

const testEase = (p: number) => p * p;

describe('mirrorEasing', () => {
	test('correctly mirrors an easing curve', () => {
		expect(mirrorEasing(testEase)(0.25)).toEqual(0.125);
		expect(mirrorEasing(testEase)(0.75)).toEqual(0.875);
	});
});
