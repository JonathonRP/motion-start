/**
 * Spring Animation Tests
 *
 * Tests for both Svelte-based and physics-based springs
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock requestAnimationFrame for physics springs
let rafCallbacks: ((time: number) => void)[] = [];
let rafId = 0;

beforeEach(() => {
	rafCallbacks = [];
	rafId = 0;

	vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => {
		rafCallbacks.push(cb);
		return ++rafId;
	});

	vi.stubGlobal('cancelAnimationFrame', (id: number) => {
		// No-op for tests
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

function runAnimationFrames(count: number, timeStep = 16.67) {
	let time = 0;
	for (let i = 0; i < count && rafCallbacks.length > 0; i++) {
		const callbacks = [...rafCallbacks];
		rafCallbacks = [];
		time += timeStep;
		callbacks.forEach((cb) => cb(time));
	}
}

describe('spring module exports', () => {
	it('should export Svelte-based spring functions', async () => {
		const module = await import('./spring.svelte.js');

		expect(module.spring).toBeDefined();
		expect(module.springFrom).toBeDefined();
		expect(module.springObject).toBeDefined();
		expect(module.SvelteSpring).toBeDefined();
	});

	it('should export physics-based spring functions', async () => {
		const module = await import('./spring.svelte.js');

		expect(module.physicsSpring).toBeDefined();
		expect(module.physicsSpringFrom).toBeDefined();
		expect(module.momentumSpring).toBeDefined();
		expect(module.springWithMomentum).toBeDefined();
	});

	it('should have springWithMomentum as alias for momentumSpring', async () => {
		const module = await import('./spring.svelte.js');

		expect(module.springWithMomentum).toBe(module.momentumSpring);
	});
});

describe('physicsSpring', () => {
	it('should create a spring with initial value', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(100);

		expect(spring.current).toBe(100);
		expect(spring.target).toBe(100);
		expect(spring.velocity).toBe(0);
	});

	it('should accept physics parameters', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		// Should not throw with physics-scale parameters
		const spring = physicsSpring(0, {
			stiffness: 300,
			damping: 20,
			mass: 1
		});

		expect(spring.current).toBe(0);
	});

	it('should animate towards target', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(0, {
			stiffness: 300,
			damping: 30,
			mass: 1
		});

		spring.target = 100;

		// Run animation frames
		runAnimationFrames(60); // ~1 second at 60fps

		// Should have moved towards target
		expect(spring.current).toBeGreaterThan(0);
	});

	it('should track velocity during animation', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(0, {
			stiffness: 100,
			damping: 10
		});

		spring.target = 100;

		// Run a few frames
		runAnimationFrames(5);

		// Should have non-zero velocity while moving
		expect(spring.velocity).not.toBe(0);
	});

	it('should snap to value immediately', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(0);
		spring.target = 100;
		runAnimationFrames(5); // Start animating

		spring.snap(50);

		expect(spring.current).toBe(50);
		expect(spring.target).toBe(50);
		expect(spring.velocity).toBe(0);
	});

	it('should stop animation', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(0);
		spring.target = 100;
		runAnimationFrames(5);

		spring.stop();
		const currentAfterStop = spring.current;

		// Clear any pending callbacks and run more frames
		rafCallbacks = [];
		runAnimationFrames(10);

		// Should not have moved after stop
		expect(spring.current).toBe(currentAfterStop);
	});

	it('should accept initial velocity with set()', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(0);
		spring.set(100, 500); // target=100, velocity=500

		expect(spring.target).toBe(100);
		expect(spring.velocity).toBe(500);
	});

	it('should use default physics parameters', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		// Default: stiffness=100, damping=10, mass=1
		const spring = physicsSpring(0);
		spring.target = 100;

		runAnimationFrames(30);

		// With low damping, should overshoot
		// Just verify it animates
		expect(spring.current).not.toBe(0);
	});
});

describe('momentumSpring', () => {
	it('should create a momentum-preserving spring', async () => {
		const { momentumSpring } = await import('./spring.svelte.js');

		const spring = momentumSpring(0, {
			stiffness: 200,
			damping: 20,
			momentumDuration: 800
		});

		expect(spring.current).toBe(0);
		expect(spring.release).toBeDefined();
	});

	it('should release with velocity', async () => {
		const { momentumSpring } = await import('./spring.svelte.js');

		const spring = momentumSpring(0, {
			stiffness: 200,
			damping: 20
		});

		spring.release({ velocity: 500 });

		// Should have set target based on projected landing
		expect(spring.target).not.toBe(0);
		expect(spring.velocity).toBe(500);
	});

	it('should release towards specific target', async () => {
		const { momentumSpring } = await import('./spring.svelte.js');

		const spring = momentumSpring(0);

		spring.release(100);

		expect(spring.target).toBe(100);
	});
});

describe('spring physics behavior', () => {
	it('should settle at target with high damping (critically damped)', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		// Critical damping: c = 2 * sqrt(k * m)
		// For k=100, m=1: c = 20 (critically damped)
		const spring = physicsSpring(0 as number, {
			stiffness: 100,
			damping: 20,
			mass: 1
		});

		spring.target = 100;
		runAnimationFrames(300); // Many frames

		// Should have settled near target
		expect(spring.current).toBeCloseTo(100, 0);
	});

	it('should overshoot with low damping (underdamped)', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const spring = physicsSpring(0 as number, {
			stiffness: 100,
			damping: 5, // Low damping = bouncy
			mass: 1
		});

		spring.target = 100;

		let maxValue = 0;
		for (let i = 0; i < 100; i++) {
			runAnimationFrames(1);
			maxValue = Math.max(maxValue, spring.current);
		}

		// Underdamped should overshoot past 100
		expect(maxValue).toBeGreaterThan(100);
	});

	it('should move slower with higher mass', async () => {
		const { physicsSpring } = await import('./spring.svelte.js');

		const lightSpring = physicsSpring(0 as number, { mass: 1, stiffness: 100, damping: 10 });
		const heavySpring = physicsSpring(0 as number, { mass: 5, stiffness: 100, damping: 10 });

		lightSpring.target = 100;
		heavySpring.target = 100;

		runAnimationFrames(10);

		// Light spring should move faster (be further along)
		expect(lightSpring.current).toBeGreaterThan(heavySpring.current);
	});
});
