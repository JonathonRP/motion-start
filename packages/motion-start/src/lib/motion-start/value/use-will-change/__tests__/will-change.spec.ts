import { describe, expect, test } from 'vitest';
import { MotionValue } from '../../index.js';
import { addValueToWillChange } from '../add-will-change.js';
import { useWillChange } from '../index.js';
import { WillChangeMotionValue } from '../WillChangeMotionValue.js';

type WillChangeVisualElement = Parameters<typeof addValueToWillChange>[0];

describe('WillChangeMotionValue', () => {
	test('can manage transform alongside independent transforms', () => {
		const willChange = new WillChangeMotionValue('auto');
		willChange.add('transform');
		expect(willChange.get()).toBe('transform');

		const willChange2 = new WillChangeMotionValue('auto');
		willChange2.add('x');
		willChange2.add('y');
		expect(willChange2.get()).toBe('transform');
	});

	test('adds accelerated values without duplicates', () => {
		const willChange = new WillChangeMotionValue('auto');

		willChange.add('opacity');
		willChange.add('opacity');
		willChange.add('filter');
		willChange.add('--color');
		willChange.add('background');

		expect(willChange.get()).toBe('opacity, filter');
	});
});

describe('useWillChange', () => {
	test('creates a will-change motion value initialized to auto', () => {
		const willChange = useWillChange();

		expect(willChange).toBeInstanceOf(WillChangeMotionValue);
		expect(willChange.get()).toBe('auto');
	});
});

describe('addValueToWillChange', () => {
	test('adds to WillChangeMotionValue values only', () => {
		const willChange = new WillChangeMotionValue('auto');
		const visualElement = {
			getValue: (key: string) => (key === 'willChange' ? willChange : undefined),
		};

		addValueToWillChange(visualElement as WillChangeVisualElement, 'x');
		expect(willChange.get()).toBe('transform');
	});

	test('ignores regular MotionValue willChange values', () => {
		const willChange = new MotionValue('opacity');
		const visualElement = {
			getValue: (key: string) => (key === 'willChange' ? willChange : undefined),
		};

		addValueToWillChange(visualElement as WillChangeVisualElement, 'x');
		expect(willChange.get()).toBe('opacity');
	});
});
