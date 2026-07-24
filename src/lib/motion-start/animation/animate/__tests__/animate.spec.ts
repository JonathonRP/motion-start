/**
 * Ported from framer-motion@11.11.11
 * packages/framer-motion/src/animation/animate/__tests__/animate.test.tsx
 */

import { describe, expect, test } from 'vitest';
import type { MotionValue } from '../../../value/index.js';
import { motionValue } from '../../../value/index.js';
import { syncDriver } from '../../animators/__tests__/utils.js';
import { animate } from '../index.js';

describe('animate', () => {
	test('accepts value and motion value overloads', () => {
		animate(0, 100, { duration: 0.01 });
		animate('#fff', '#000', { duration: 0.01 });
		animate('#fff', ['#000'], { duration: 0.01 });

		animate(motionValue(0), 100, { duration: 0.01 });
		animate(motionValue(0), [null, 100], { duration: 0.01 });
		animate(motionValue(0), [0, 100], { duration: 0.01 });
		animate(motionValue('#fff'), '#000', { duration: 0.01 });
		animate(motionValue('#fff'), [null, '#000'], { duration: 0.01 });
		animate(motionValue('#fff'), ['#fff', '#000'], { duration: 0.01 });

		function animateType<V extends string | number>(value: V | MotionValue<V>, target: V | V[]) {
			animate(value, target, { duration: 0.01 });
		}

		animateType(motionValue<number>(0), 100);
		animateType(motionValue<number>(0), [100]);
		animateType(motionValue<string>('#fff'), '#000');
	});

	test('animates a motion value in sequence', async () => {
		const a = motionValue(0);
		const aOutput: number[] = [];

		a.on('change', (v) => aOutput.push(Math.round(v)));

		const animation = animate(
			[
				[a, 2, { duration: 0.2 }],
				[a, 0, { duration: 0.2 }],
			],
			{
				defaultTransition: {
					ease: 'linear',
					driver: syncDriver(20),
				},
			}
		);

		await animation;

		expect(aOutput).toEqual([0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0]);
	});

	test('animates motion values in sequence', async () => {
		const a = motionValue(0);
		const b = motionValue(100);

		const aOutput: number[] = [];
		const bOutput: number[] = [];

		a.on('change', (v) => aOutput.push(Math.round(v)));
		b.on('change', (v) => bOutput.push(Math.round(v)));

		const animation = animate(
			[
				[a, [50, 100]],
				[b, 0],
			],
			{
				defaultTransition: {
					ease: 'linear',
					duration: 0.05,
					driver: syncDriver(20),
				},
			}
		);

		await animation;

		expect(aOutput).toEqual([50, 70, 90, 100]);
		expect(bOutput).toEqual([80, 40, 0]);
	});
});

describe('animate: Objects', () => {
	test('accepts object overloads', () => {
		animate({ x: 100 }, { x: 200 }, { duration: 0.01 });
		animate({ x: 100, y: 0 }, { x: 200 }, { duration: 0.01 });
		animate({ x: 100 }, { x: 200 }, { x: { duration: 0.01 } });
		animate([[{ x: 100 }, { x: 200 }, { duration: 0.01 }]]);
		animate([[{ x: 100 }, { x: 200 }, { x: { duration: 0.01 } }]]);
	});

	test('animates an object', async () => {
		const obj = { x: 100 };

		await animate(obj, { x: 200 }, { duration: 0.01 });

		expect(obj.x).toBe(200);
	});

	test('animates an object in sequence', async () => {
		const obj = { x: 100 };

		await animate([[obj, { x: 200 }, { duration: 0.01 }]]);

		expect(obj.x).toBe(200);
	});
});
