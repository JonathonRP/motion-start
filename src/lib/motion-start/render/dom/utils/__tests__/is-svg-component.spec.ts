/** Ported from framer-motion/packages/framer-motion/src/render/dom/utils/__tests__/is-svg-component.test.ts */
import type { Component } from 'svelte';
import { describe, test, expect } from 'vitest';
import { isSVGComponent } from '../is-svg-component.js';

describe('isSVGComponent', () => {
	test('Correctly identifies SVG components', () => {
		expect(isSVGComponent('circle')).toBe(true);
		expect(isSVGComponent('div')).toBe(false);
		expect(isSVGComponent('feGaussian')).toBe(true);
		expect(isSVGComponent('test-element')).toBe(false);
		const Component = (() => ({})) as Component;
		expect(isSVGComponent(Component)).toBe(false);
	});
});
