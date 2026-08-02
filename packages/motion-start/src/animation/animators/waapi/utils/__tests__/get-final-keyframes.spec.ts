/** Ported from framer-motion/packages/framer-motion/src/animation/animators/waapi/utils/__tests__/get-final-keyframes.test.ts */
import { describe, test, expect } from 'vitest';
import { getFinalKeyframe } from '../get-final-keyframe.js';

describe('getFinalKeyframe', () => {
	test('returns final keyframe', () => {
		expect(getFinalKeyframe([0, 1], {})).toEqual(1);
		expect(getFinalKeyframe([0, 1], { repeat: 1 })).toEqual(1);
		expect(getFinalKeyframe([0, 1], { repeat: 2 })).toEqual(1);
		expect(getFinalKeyframe([0, 1], { repeat: 1, repeatType: 'loop' })).toEqual(1);
		expect(getFinalKeyframe([0, 1], { repeat: 2, repeatType: 'loop' })).toEqual(1);
		expect(getFinalKeyframe([0, 1], { repeat: 1, repeatType: 'reverse' })).toEqual(0);
		expect(getFinalKeyframe([0, 1], { repeat: 2, repeatType: 'reverse' })).toEqual(1);
		expect(getFinalKeyframe([0, 1], { repeat: 1, repeatType: 'mirror' })).toEqual(0);
		expect(getFinalKeyframe([0, 1], { repeat: 2, repeatType: 'mirror' })).toEqual(1);
	});

	test('returns the first keyframe when playing in reverse', () => {
		expect(getFinalKeyframe([0, 1], {}, undefined, -1)).toEqual(0);
		expect(getFinalKeyframe([0, 1], {}, 2, -1)).toEqual(0);
		expect(getFinalKeyframe([0, 1], { repeat: 1, repeatType: 'reverse' }, undefined, -1)).toEqual(0);
		expect(getFinalKeyframe([0, 1], { repeat: 2, repeatType: 'reverse' }, undefined, -1)).toEqual(0);
	});

	test('returns the final keyframe for positive speeds', () => {
		expect(getFinalKeyframe([0, 1], {}, undefined, 1)).toEqual(1);
		expect(getFinalKeyframe([0, 1], {}, undefined, 2)).toEqual(1);
		expect(getFinalKeyframe([0, 1], {}, 2, 2)).toEqual(2);
	});
});
