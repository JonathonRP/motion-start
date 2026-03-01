/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 * Ported from packages/framer-motion/src/animation/__tests__/index.test.tsx
 *
 * Note: The original tests used React components and hooks.
 * This adaptation focuses on testing the core animationControls functionality
 * that can be tested without a component rendering framework.
 *
 * For full integration tests with Svelte components, use Cypress E2E tests.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { animationControls, setValues } from '../hooks/animation-controls';
import type { VisualElement } from '../../render/VisualElement.svelte';

// Create a mock VisualElement for testing
function createMockVisualElement(options?: {
	variants?: Record<string, any>;
	variantChildren?: Set<VisualElement<unknown>>;
}): VisualElement<unknown> {
	const values = new Map();
	const latestValues: Record<string, any> = {};

	const mockVE = {
		values,
		latestValues,
		variantChildren: options?.variantChildren,
		getVariant: vi.fn((key: string) => options?.variants?.[key]),
		getValue: vi.fn((key: string) => values.get(key)),
		addValue: vi.fn((key: string, value: any) => {
			values.set(key, value);
		}),
		removeValue: vi.fn((key: string) => {
			values.delete(key);
		}),
		// Add other VisualElement methods as needed for tests
	} as unknown as VisualElement<unknown>;

	return mockVE;
}

describe('animationControls', () => {
	test('creates controls with subscribe, start, set, stop, and mount methods', () => {
		const controls = animationControls();

		expect(controls).toHaveProperty('subscribe');
		expect(controls).toHaveProperty('start');
		expect(controls).toHaveProperty('set');
		expect(controls).toHaveProperty('stop');
		expect(controls).toHaveProperty('mount');

		expect(typeof controls.subscribe).toBe('function');
		expect(typeof controls.start).toBe('function');
		expect(typeof controls.set).toBe('function');
		expect(typeof controls.stop).toBe('function');
		expect(typeof controls.mount).toBe('function');
	});

	test('mount returns an unmount function', () => {
		const controls = animationControls();
		const unmount = controls.mount();

		expect(typeof unmount).toBe('function');
	});

	test('subscribe returns an unsubscribe function', () => {
		const controls = animationControls();
		const mockVE = createMockVisualElement();

		const unsubscribe = controls.subscribe(mockVE);

		expect(typeof unsubscribe).toBe('function');
	});

	test('start throws before mount', () => {
		const controls = animationControls();

		expect(() => controls.start({ x: 100 })).toThrow();
	});

	test('set throws before mount', () => {
		const controls = animationControls();

		expect(() => controls.set({ x: 100 })).toThrow();
	});

	test('start does not throw after mount', () => {
		const controls = animationControls();
		controls.mount();

		// Should not throw
		expect(() => controls.start({ x: 100 })).not.toThrow();
	});

	test('set does not throw after mount', () => {
		const controls = animationControls();
		controls.mount();

		// Should not throw
		expect(() => controls.set({ x: 100 })).not.toThrow();
	});

	test('stop can be called at any time', () => {
		const controls = animationControls();

		// Should not throw
		expect(() => controls.stop()).not.toThrow();

		controls.mount();

		// Should still not throw
		expect(() => controls.stop()).not.toThrow();
	});

	test('unmount function prevents further start/set calls', () => {
		const controls = animationControls();
		const unmount = controls.mount();

		// Should work after mount
		expect(() => controls.start({ x: 100 })).not.toThrow();

		unmount();

		// Should throw after unmount
		expect(() => controls.start({ x: 100 })).toThrow();
	});

	test('start returns a promise', async () => {
		const controls = animationControls();
		controls.mount();

		const result = controls.start({ x: 100 });

		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toEqual([]);
	});
});

describe('setValues', () => {
	test('handles string variant definition', () => {
		const variants = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
		};
		const mockVE = createMockVisualElement({ variants });

		// The setValues function will call getVariant internally,
		// but requires getProps which we can't easily mock.
		// This test verifies the function accepts string definitions
		// and calls getVariant (the actual impl requires a full VisualElement).
		// For integration tests, see Cypress E2E tests.

		// We need to add getProps to make setValues work
		(mockVE as any).getProps = vi.fn(() => ({
			variants,
			custom: undefined,
		}));
		(mockVE as any).hasValue = vi.fn(() => false);
		(mockVE as any).addValue = vi.fn();

		setValues(mockVE, 'hidden');

		expect(mockVE.getVariant).toHaveBeenCalledWith('hidden');
	});

	test('handles array of variant definitions', () => {
		const variants = {
			hidden: { opacity: 0 },
			visible: { opacity: 1 },
		};
		const mockVE = createMockVisualElement({ variants });

		// Add required methods for the mock
		(mockVE as any).getProps = vi.fn(() => ({
			variants,
			custom: undefined,
		}));
		(mockVE as any).hasValue = vi.fn(() => false);
		(mockVE as any).addValue = vi.fn();

		setValues(mockVE, ['hidden', 'visible']);

		// Both variants should be looked up (in reverse order)
		expect(mockVE.getVariant).toHaveBeenCalledWith('visible');
		expect(mockVE.getVariant).toHaveBeenCalledWith('hidden');
	});
});
