import type { Component } from 'svelte';
import { describe, expect, test } from 'vitest';
import { isMotionComponent } from '../is-motion-component.js';
import { motionComponentSymbol } from '../symbol.js';

describe('isMotionComponent', () => {
	test('recognizes callable Svelte motion components', () => {
		const component = (() => {}) as unknown as Component & {
			[motionComponentSymbol]?: Component | string;
		};

		expect(isMotionComponent(component)).toBe(false);

		component[motionComponentSymbol] = 'div';

		expect(isMotionComponent(component)).toBe(true);
	});

	test('rejects invalid runtime values without throwing', () => {
		expect(isMotionComponent(null as unknown as Component)).toBe(false);
		expect(isMotionComponent(undefined as unknown as Component)).toBe(false);
		expect(isMotionComponent('div')).toBe(false);
	});
});
