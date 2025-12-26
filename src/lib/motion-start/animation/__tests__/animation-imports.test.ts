/**
 * Phase 2: Animation System Reorganization Tests
 *
 * Tests that animation imports work correctly after reorganization
 * into subdirectories (animators, generators, hooks, animate, interfaces)
 */

import { describe, it, expect } from 'vitest';

describe('Phase 2: Animation System Imports', () => {
	describe('Animators subdirectory', () => {
		it('should import BaseAnimation from animators/', async () => {
			const { BaseAnimation } = await import('../animators/BaseAnimation.js');
			expect(BaseAnimation).toBeDefined();
			expect(typeof BaseAnimation).toBe('function');
		});

		it('should import MainThreadAnimation from animators/', async () => {
			const { MainThreadAnimation } = await import('../animators/MainThreadAnimation.js');
			expect(MainThreadAnimation).toBeDefined();
			expect(typeof MainThreadAnimation).toBe('function');
		});

		it('should import AcceleratedAnimation from animators/', async () => {
			const { AcceleratedAnimation } = await import('../animators/AcceleratedAnimation.js');
			expect(AcceleratedAnimation).toBeDefined();
			expect(typeof AcceleratedAnimation).toBe('function');
		});
	});

	describe('Generators subdirectory', () => {
		it('should import spring generator from generators/spring/', async () => {
			const { spring } = await import('../generators/spring/index.js');
			expect(spring).toBeDefined();
			expect(typeof spring).toBe('function');
		});

		it('should import keyframes generator from generators/', async () => {
			const { keyframes } = await import('../generators/keyframes.js');
			expect(keyframes).toBeDefined();
			expect(typeof keyframes).toBe('function');
		});

		it('should import inertia generator from generators/', async () => {
			const { inertia } = await import('../generators/inertia.js');
			expect(inertia).toBeDefined();
			expect(typeof inertia).toBe('function');
		});
	});

	describe('Hooks subdirectory', () => {
		it('should import useAnimation from hooks/', async () => {
			const { useAnimation } = await import('../hooks/use-animation.svelte.js');
			expect(useAnimation).toBeDefined();
			expect(typeof useAnimation).toBe('function');
		});

		it('should import useAnimationControls from hooks/', async () => {
			const { useAnimationControls } = await import('../hooks/use-animation.svelte.js');
			expect(useAnimationControls).toBeDefined();
			expect(typeof useAnimationControls).toBe('function');
		});

		it.skip('should export UseAnimatedState from hooks/', async () => {
			// Skipped: UseAnimatedState requires browser environment (axisBox)
			const { UseAnimatedState } = await import('../hooks/use-animated-state.js');
			expect(UseAnimatedState).toBeDefined();
		});

		it('should have hooks index.ts barrel export', async () => {
			const hooks = await import('../hooks/index.js');
			expect(hooks.useAnimation).toBeDefined();
			expect(hooks.useAnimationControls).toBeDefined();
			// UseAnimatedState requires browser environment - tested in browser tests
		});
	});

	describe('Animate subdirectory', () => {
		it('should import animate from animate/', async () => {
			const { animate } = await import('../animate/index.js');
			expect(animate).toBeDefined();
			expect(typeof animate).toBe('function');
		});

		it('should export AnimationPlaybackControls interface from animate/', async () => {
			const animateModule = await import('../animate/index.js');
			// Interface types are erased at runtime, so we just check the module structure
			expect(animateModule).toBeDefined();
		});
	});

	describe('Interfaces subdirectory', () => {
		it('should have interfaces/index.ts', async () => {
			const interfaces = await import('../interfaces/index.js');
			expect(interfaces).toBeDefined();
		});
	});

	describe('Backward compatibility', () => {
		it('should maintain backward compatibility for animate import', async () => {
			// Main index should re-export animate from the new location
			const { animate } = await import('../../index.js');
			expect(animate).toBeDefined();
			expect(typeof animate).toBe('function');
		});

		it('should maintain backward compatibility for useAnimation import', async () => {
			const { useAnimation } = await import('../../index.js');
			expect(useAnimation).toBeDefined();
			expect(typeof useAnimation).toBe('function');
		});
	});
});
