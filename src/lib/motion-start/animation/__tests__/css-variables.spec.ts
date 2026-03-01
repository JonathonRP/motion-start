/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 * Ported from packages/framer-motion/src/animation/__tests__/css-variables.test.tsx
 *
 * Note: This file ports the non-React tests from the original.
 * The React component tests (motion.div with animate, etc.) would require
 * Svelte component testing setup which is out of scope for this port.
 * The CSS variable parsing utility tests are fully ported.
 */

import { describe, test, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { parseCSSVariable } from '../../render/dom/utils/css-variables-conversion';
// Import directly from animate module to avoid dependency chain issues
import { animate } from '../animate';
import { animateMini } from '../../animation/animators/waapi/animate-style';

const fromName = '--from';
const toName = '--to';
const fromValue = '#09F';
const toValue = '#F00';

// Stub getPropertyValue because CSS variables aren't supported by happy-dom/jsdom

const originalGetComputedStyle = typeof window !== 'undefined' ? window.getComputedStyle : undefined;

function getComputedStyleStub() {
	return {
		background: fromValue,
		getPropertyValue(variableName: 'background' | '--from' | '--to' | '--a' | '--color') {
			switch (variableName) {
				case fromName:
					return fromValue;
				case toName:
					return toValue;
				case '--a':
					return undefined;
				case '--color':
					return '  #fff ';
				default:
					throw Error('Should never happen');
			}
		},
	};
}

function stubGetComputedStyles() {
	if (typeof window !== 'undefined') {
		(window as any).getComputedStyle = getComputedStyleStub;
	}
}

function resetComputedStyles() {
	if (typeof window !== 'undefined' && originalGetComputedStyle) {
		window.getComputedStyle = originalGetComputedStyle;
	}
}

// Setup WAAPI mock for tests that use animate
function setupWaapi() {
	if (typeof Element === 'undefined') return;
	Element.prototype.animate = (() => {}) as any;

	vi.spyOn(Element.prototype, 'animate').mockImplementation(() => {
		const animation = {
			cancel: () => {},
			finished: {
				then: (resolve: VoidFunction) => {
					resolve();
					return Promise.resolve();
				},
			},
		} as any;
		return animation;
	});
}

function restoreWaapi() {
	if (typeof Element === 'undefined') return;
	Element.prototype.animate = undefined as any;
	vi.restoreAllMocks();
}

describe('css variables', () => {
	beforeAll(stubGetComputedStyles);
	afterAll(resetComputedStyles);
	beforeEach(setupWaapi);
	afterEach(restoreWaapi);

	test('animate accepts css variable syntax', () => {
		// This test verifies that the animate function accepts CSS variable syntax
		// without throwing type errors
		if (typeof document === 'undefined') return;
		const div = document.createElement('div');
		const controls = animate(div, { x: 0, '--color': '#f00' });
		expect(controls).toBeDefined();
		controls.cancel();
	});

	test('animateMini accepts css variable syntax', () => {
		// This test verifies that animateMini accepts CSS variable syntax
		if (typeof document === 'undefined') return;
		const div = document.createElement('div');
		const controls = animateMini(div, {
			transform: 'none',
			'--color': '#f00',
		});
		expect(controls).toBeDefined();
		controls.cancel();
	});

	test('css variable parsing', () => {
		expect(parseCSSVariable('var(--ID-123)')).toEqual(['--ID-123', undefined]);
	});

	test('css variable parsing fallback', () => {
		expect(parseCSSVariable('var(--ID-123, red)')).toEqual(['--ID-123', 'red']);
	});

	test('css variable parsing nested fallback', () => {
		expect(parseCSSVariable('var(--ID-123, var(--ID-234, cyan))')).toEqual(['--ID-123', 'var(--ID-234, cyan)']);
	});

	test('css variable parsing ignores metadata', () => {
		expect(parseCSSVariable('var(--ID-123) /* { "name": "whatever" } */')).toEqual(['--ID-123', undefined]);
	});

	test('css variable detects fallback values with decimal', () => {
		expect(parseCSSVariable('var(--foo, rgba(255, 204, 0, 0.35)) /* {"name":"Whaa"} */')).toEqual([
			'--foo',
			'rgba(255, 204, 0, 0.35)',
		]);
	});
});
