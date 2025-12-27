/**
 * Test for motion[stringKey] dynamic component access
 * Verifies that motion components can be accessed via string keys
 */

import { describe, it, expect } from 'vitest';
import { motion } from '../motion.js';

describe('motion[stringKey] support', () => {
	it('should allow access via string literal key', () => {
		const DivComponent = motion['div'];
		expect(DivComponent).toBeDefined();
	});

	it('should allow access via variable string key', () => {
		const tagName = 'button';
		const ButtonComponent = motion[tagName];
		expect(ButtonComponent).toBeDefined();
	});

	it('should work with HTML element names', () => {
		const elements = ['div', 'span', 'button', 'a', 'input', 'form'];

		elements.forEach(tag => {
			const Component = motion[tag];
			expect(Component).toBeDefined();
		});
	});

	it('should work with SVG element names', () => {
		const svgElements = ['circle', 'path', 'rect', 'line', 'svg'];

		svgElements.forEach(tag => {
			const Component = motion[tag];
			expect(Component).toBeDefined();
		});
	});

	it('should be equivalent to dot notation', () => {
		const DivViaDot = motion.div;
		const DivViaBracket = motion['div'];

		// Both should create motion components
		expect(typeof DivViaDot).toBe(typeof DivViaBracket);
	});
});
