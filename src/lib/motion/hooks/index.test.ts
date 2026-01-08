/**
 * Motion Hooks Tests
 *
 * Unit tests for motion hooks
 * Note: Some hooks require browser environment for full testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Svelte runes for testing
vi.mock('svelte', () => ({
	untrack: (fn: () => any) => fn()
}));

describe('useMotionValue', () => {
	// We need to test this in a way that doesn't require actual Svelte runtime
	it('should be defined', async () => {
		const { useMotionValue } = await import('./index.svelte.js');
		expect(useMotionValue).toBeDefined();
		expect(typeof useMotionValue).toBe('function');
	});
});

describe('useTransform', () => {
	it('should be defined', async () => {
		const { useTransform } = await import('./index.svelte.js');
		expect(useTransform).toBeDefined();
		expect(typeof useTransform).toBe('function');
	});
});

describe('useSpring', () => {
	it('should be defined', async () => {
		const { useSpring } = await import('./index.svelte.js');
		expect(useSpring).toBeDefined();
		expect(typeof useSpring).toBe('function');
	});
});

describe('useAnimate', () => {
	it('should be defined', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		expect(useAnimate).toBeDefined();
		expect(typeof useAnimate).toBe('function');
	});

	it('should return a function', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		const animate = useAnimate(() => null);
		expect(typeof animate).toBe('function');
	});

	it('should return noop controls when scope is null', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		const animate = useAnimate(() => null);

		const controls = animate('.box', { x: 100 });

		expect(controls.stop).toBeDefined();
		expect(controls.finished).toBeInstanceOf(Promise);
	});
});

describe('useInView', () => {
	it('should be defined', async () => {
		const { useInView } = await import('./index.svelte.js');
		expect(useInView).toBeDefined();
		expect(typeof useInView).toBe('function');
	});
});

describe('useReducedMotion', () => {
	it('should be defined', async () => {
		const { useReducedMotion } = await import('./index.svelte.js');
		expect(useReducedMotion).toBeDefined();
		expect(typeof useReducedMotion).toBe('function');
	});
});

describe('useDragControls', () => {
	it('should be defined', async () => {
		const { useDragControls } = await import('./index.svelte.js');
		expect(useDragControls).toBeDefined();
		expect(typeof useDragControls).toBe('function');
	});

	it('should return object with start method', async () => {
		const { useDragControls } = await import('./index.svelte.js');
		const controls = useDragControls();

		expect(controls.start).toBeDefined();
		expect(typeof controls.start).toBe('function');
	});

	it('should call registered handler on start', async () => {
		const { useDragControls } = await import('./index.svelte.js');
		const controls = useDragControls();

		const mockHandler = vi.fn();
		controls._setStartHandler(mockHandler);

		const mockEvent = { clientX: 100, clientY: 100 } as PointerEvent;
		controls.start(mockEvent);

		expect(mockHandler).toHaveBeenCalledWith(mockEvent);
	});

	it('should not throw when start called without handler', async () => {
		const { useDragControls } = await import('./index.svelte.js');
		const controls = useDragControls();

		const mockEvent = { clientX: 100, clientY: 100 } as PointerEvent;

		expect(() => controls.start(mockEvent)).not.toThrow();
	});
});
