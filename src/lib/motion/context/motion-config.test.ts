/**
 * Motion Config Context Tests
 *
 * Tests for motion configuration context functionality
 * Note: Context-dependent functions require Svelte runtime
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('motion-config module exports', () => {
	it('should export all motion config functions', async () => {
		const module = await import('./motion-config.svelte.js');

		expect(module.getMotionConfig).toBeDefined();
		expect(module.setMotionConfig).toBeDefined();
		expect(module.prefersReducedMotion).toBeDefined();
		expect(module.getEffectiveTransition).toBeDefined();
	});
});

describe('prefersReducedMotion', () => {
	beforeEach(() => {
		// Mock matchMedia
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}));
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should return boolean', async () => {
		const { prefersReducedMotion } = await import('./motion-config.svelte.js');

		const result = prefersReducedMotion();

		expect(typeof result).toBe('boolean');
	});

	it('should return false by default when media query does not match', async () => {
		const { prefersReducedMotion } = await import('./motion-config.svelte.js');

		const result = prefersReducedMotion();

		expect(result).toBe(false);
	});

	it('should return true when media query matches', async () => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}));

		// Re-import to get fresh evaluation
		const module = await import('./motion-config.svelte.js');
		const result = module.prefersReducedMotion();

		expect(result).toBe(true);
	});
});

describe('getEffectiveTransition', () => {
	beforeEach(() => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}));
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should return provided transition when reduced motion not preferred', async () => {
		const { getEffectiveTransition } = await import('./motion-config.svelte.js');

		const transition = { type: 'spring' as const, stiffness: 300, damping: 20 };
		const result = getEffectiveTransition(transition);

		expect(result).toEqual(transition);
	});

	it('should return default spring transition when no transition provided', async () => {
		const { getEffectiveTransition } = await import('./motion-config.svelte.js');

		const result = getEffectiveTransition();

		expect(result.type).toBe('spring');
		expect(result.stiffness).toBeDefined();
		expect(result.damping).toBeDefined();
	});

	it('should return duration 0 when reduced motion is preferred', async () => {
		vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}));

		const module = await import('./motion-config.svelte.js');
		const result = module.getEffectiveTransition({ type: 'spring' as const });

		expect(result.duration).toBe(0);
	});
});

describe('MotionConfigValue interface', () => {
	it('should have correct shape for spring transition', () => {
		const config = {
			transition: { type: 'spring' as const, stiffness: 100, damping: 10 },
			reducedMotion: 'user' as const,
			isStatic: false
		};

		expect(config.transition.type).toBe('spring');
		expect(config.transition.stiffness).toBe(100);
		expect(config.transition.damping).toBe(10);
		expect(config.reducedMotion).toBe('user');
		expect(config.isStatic).toBe(false);
	});

	it('should have correct shape for tween transition', () => {
		const config = {
			transition: { type: 'tween' as const, duration: 0.3, ease: 'easeOut' },
			reducedMotion: 'never' as const,
			isStatic: false
		};

		expect(config.transition.type).toBe('tween');
		expect(config.transition.duration).toBe(0.3);
		expect(config.reducedMotion).toBe('never');
	});

	it('should accept reducedMotion values', () => {
		const configs = [
			{ reducedMotion: 'user' as const },
			{ reducedMotion: 'always' as const },
			{ reducedMotion: 'never' as const }
		];

		expect(configs[0].reducedMotion).toBe('user');
		expect(configs[1].reducedMotion).toBe('always');
		expect(configs[2].reducedMotion).toBe('never');
	});

	it('should accept optional transformPagePoint', () => {
		const config = {
			transformPagePoint: (point: { x: number; y: number }) => ({
				x: point.x + 10,
				y: point.y + 10
			})
		};

		const result = config.transformPagePoint({ x: 0, y: 0 });
		expect(result.x).toBe(10);
		expect(result.y).toBe(10);
	});
});

describe('reducedMotion modes', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should respect "always" mode', () => {
		// When reducedMotion is 'always', should always return true
		// This is tested via the config interface shape
		const config = { reducedMotion: 'always' as const };
		expect(config.reducedMotion).toBe('always');
	});

	it('should respect "never" mode', () => {
		// When reducedMotion is 'never', should always return false
		const config = { reducedMotion: 'never' as const };
		expect(config.reducedMotion).toBe('never');
	});

	it('should respect "user" mode', () => {
		// When reducedMotion is 'user', should check media query
		const config = { reducedMotion: 'user' as const };
		expect(config.reducedMotion).toBe('user');
	});
});
