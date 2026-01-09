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
	it('should be defined', async () => {
		const { useMotionValue } = await import('./index.svelte.js');
		expect(useMotionValue).toBeDefined();
		expect(typeof useMotionValue).toBe('function');
	});

	it('should create a motion value with initial value', async () => {
		const { useMotionValue } = await import('./index.svelte.js');

		const value = useMotionValue(100);

		expect(value.current).toBe(100);
	});

	it('should expose set method', async () => {
		const { useMotionValue } = await import('./index.svelte.js');

		const value = useMotionValue(0);

		expect(typeof value.set).toBe('function');
	});

	it('should expose get method', async () => {
		const { useMotionValue } = await import('./index.svelte.js');

		const value = useMotionValue(50);

		expect(typeof value.get).toBe('function');
		expect(value.get()).toBe(50);
	});

	it('should update current when set is called', async () => {
		const { useMotionValue } = await import('./index.svelte.js');

		const value = useMotionValue(0 as number);
		value.set(100);

		expect(value.current).toBe(100);
	});

	it('should track velocity', async () => {
		const { useMotionValue } = await import('./index.svelte.js');

		const value = useMotionValue(0);

		expect(typeof value.velocity).toBe('number');
	});

	it('should allow setting current directly', async () => {
		const { useMotionValue } = await import('./index.svelte.js');

		const value = useMotionValue(0 as number);
		value.current = 50;

		expect(value.current).toBe(50);
	});
});

describe('useTransform', () => {
	it('should be defined', async () => {
		const { useTransform } = await import('./index.svelte.js');
		expect(useTransform).toBeDefined();
		expect(typeof useTransform).toBe('function');
	});

	it('should transform input to output range', async () => {
		const { useTransform, useMotionValue } = await import('./index.svelte.js');

		const x = useMotionValue(50);
		const opacity = useTransform(x, [0, 100], [0, 1]);

		// At 50 input, should be 0.5 output
		expect(opacity.current).toBeCloseTo(0.5, 5);
	});

	it('should clamp values by default', async () => {
		const { useTransform, useMotionValue } = await import('./index.svelte.js');

		const x = useMotionValue(150); // Beyond input range
		const opacity = useTransform(x, [0, 100], [0, 1]);

		// Should be clamped to 1
		expect(opacity.current).toBe(1);
	});

	it('should allow disabling clamping', async () => {
		const { useTransform, useMotionValue } = await import('./index.svelte.js');

		const x = useMotionValue(150);
		const opacity = useTransform(x, [0, 100], [0, 1], { clamp: false });

		// Should extrapolate beyond 1
		expect(opacity.current).toBeGreaterThan(1);
	});

	it('should handle multiple segment ranges', async () => {
		const { useTransform, useMotionValue } = await import('./index.svelte.js');

		const x = useMotionValue(75);
		const scale = useTransform(x, [0, 50, 100], [1, 1.5, 1]);

		// At 75 (between 50-100), should interpolate from 1.5 to 1
		expect(scale.current).toBeCloseTo(1.25, 5);
	});

	it('should handle at start of range', async () => {
		const { useTransform, useMotionValue } = await import('./index.svelte.js');

		const x = useMotionValue(0);
		const opacity = useTransform(x, [0, 100], [0, 1]);

		expect(opacity.current).toBe(0);
	});

	it('should handle at end of range', async () => {
		const { useTransform, useMotionValue } = await import('./index.svelte.js');

		const x = useMotionValue(100);
		const opacity = useTransform(x, [0, 100], [0, 1]);

		expect(opacity.current).toBe(1);
	});
});

describe('useSpring', () => {
	it('should be defined', async () => {
		const { useSpring } = await import('./index.svelte.js');
		expect(useSpring).toBeDefined();
		expect(typeof useSpring).toBe('function');
	});

	it('should accept source and config', async () => {
		const { useSpring, useMotionValue } = await import('./index.svelte.js');

		const source = useMotionValue(0);
		const springValue = useSpring(source, { stiffness: 0.3, damping: 0.8 });

		expect(springValue.current).toBeDefined();
	});

	it('should have snap method', async () => {
		const { useSpring, useMotionValue } = await import('./index.svelte.js');

		const source = useMotionValue(0);
		const springValue = useSpring(source);

		expect(typeof springValue.snap).toBe('function');
	});
});

describe('usePhysicsSpring', () => {
	it('should be defined', async () => {
		const { usePhysicsSpring } = await import('./index.svelte.js');
		expect(usePhysicsSpring).toBeDefined();
		expect(typeof usePhysicsSpring).toBe('function');
	});

	it('should accept physics-based parameters', async () => {
		const { usePhysicsSpring, useMotionValue } = await import('./index.svelte.js');

		const source = useMotionValue(0);
		const springValue = usePhysicsSpring(source, {
			stiffness: 300,
			damping: 20,
			mass: 1
		});

		expect(springValue.current).toBeDefined();
	});

	it('should track velocity', async () => {
		const { usePhysicsSpring, useMotionValue } = await import('./index.svelte.js');

		const source = useMotionValue(0);
		const springValue = usePhysicsSpring(source);

		expect(typeof springValue.velocity).toBe('number');
	});
});

describe('useTween', () => {
	it('should be defined', async () => {
		const { useTween } = await import('./index.svelte.js');
		expect(useTween).toBeDefined();
		expect(typeof useTween).toBe('function');
	});

	it('should accept source and config', async () => {
		const { useTween, useMotionValue } = await import('./index.svelte.js');

		const source = useMotionValue(0);
		const tweenValue = useTween(source, { duration: 300, easing: 'easeOut' });

		expect(tweenValue.current).toBeDefined();
	});

	it('should have snap method', async () => {
		const { useTween, useMotionValue } = await import('./index.svelte.js');

		const source = useMotionValue(0);
		const tweenValue = useTween(source);

		expect(typeof tweenValue.snap).toBe('function');
	});
});

describe('useAnimate', () => {
	it('should be defined', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		expect(useAnimate).toBeDefined();
		expect(typeof useAnimate).toBe('function');
	});

	it('should return an animate function', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		const animate = useAnimate(() => null);
		expect(typeof animate).toBe('function');
	});

	it('should return noop controls when scope is null', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		const animate = useAnimate(() => null);

		const controls = animate('.box', { x: 100 });

		expect(controls.stop).toBeDefined();
		expect(typeof controls.stop).toBe('function');
		expect(controls.finished).toBeInstanceOf(Promise);
	});

	it('should return controls with then method', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		const animate = useAnimate(() => null);

		const controls = animate('.box', { x: 100 });

		expect(controls.then).toBeDefined();
		expect(typeof controls.then).toBe('function');
	});

	it('should resolve finished promise immediately when no elements', async () => {
		const { useAnimate } = await import('./index.svelte.js');
		const animate = useAnimate(() => null);

		const controls = animate('.nonexistent', { x: 100 });

		await expect(controls.finished).resolves.toBeUndefined();
	});
});

describe('useInView', () => {
	it('should be defined', async () => {
		const { useInView } = await import('./index.svelte.js');
		expect(useInView).toBeDefined();
		expect(typeof useInView).toBe('function');
	});

	it('should return object with current property', async () => {
		const { useInView } = await import('./index.svelte.js');
		const inView = useInView(() => null);

		expect(typeof inView.current).toBe('boolean');
	});

	it('should default to false when element is null', async () => {
		const { useInView } = await import('./index.svelte.js');
		const inView = useInView(() => null);

		expect(inView.current).toBe(false);
	});
});

describe('useReducedMotion', () => {
	it('should be defined', async () => {
		const { useReducedMotion } = await import('./index.svelte.js');
		expect(useReducedMotion).toBeDefined();
		expect(typeof useReducedMotion).toBe('function');
	});

	it('should return object with current property', async () => {
		const { useReducedMotion } = await import('./index.svelte.js');
		const reduced = useReducedMotion();

		expect(typeof reduced.current).toBe('boolean');
	});

	it('should default to false in test environment', async () => {
		const { useReducedMotion } = await import('./index.svelte.js');
		const reduced = useReducedMotion();

		// In jsdom without media query, should be false
		expect(reduced.current).toBe(false);
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

	it('should have _setStartHandler method for internal use', async () => {
		const { useDragControls } = await import('./index.svelte.js');
		const controls = useDragControls();

		expect(controls._setStartHandler).toBeDefined();
		expect(typeof controls._setStartHandler).toBe('function');
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

	it('should pass pointer event to handler', async () => {
		const { useDragControls } = await import('./index.svelte.js');
		const controls = useDragControls();

		const mockHandler = vi.fn();
		controls._setStartHandler(mockHandler);

		const mockEvent = {
			clientX: 150,
			clientY: 200,
			pointerId: 1,
			pointerType: 'mouse'
		} as PointerEvent;

		controls.start(mockEvent);

		expect(mockHandler).toHaveBeenCalledWith(mockEvent);
		expect(mockHandler.mock.calls[0][0].clientX).toBe(150);
		expect(mockHandler.mock.calls[0][0].clientY).toBe(200);
	});
});
