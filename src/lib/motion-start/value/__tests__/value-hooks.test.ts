/**
 * Value Hooks Tests
 * Tests for Phase 4: Value system hooks
 * Based on framer-motion@11.11.11
 */

import { describe, it, expect } from 'vitest';

describe('Phase 4: Value System Hooks', () => {
	describe('Hook imports', () => {
		it('should import useMotionValue', async () => {
			const { useMotionValue } = await import('../use-motion-value.svelte.js');
			expect(useMotionValue).toBeDefined();
			expect(typeof useMotionValue).toBe('function');
		});

		it('should import useTransform', async () => {
			const { useTransform } = await import('../use-transform.js');
			expect(useTransform).toBeDefined();
			expect(typeof useTransform).toBe('function');
		});

		it('should import useSpring', async () => {
			const { useSpring } = await import('../use-spring.svelte.js');
			expect(useSpring).toBeDefined();
			expect(typeof useSpring).toBe('function');
		});

		it('should import useVelocity', async () => {
			const { useVelocity } = await import('../use-velocity.js');
			expect(useVelocity).toBeDefined();
			expect(typeof useVelocity).toBe('function');
		});

		it('should import useScroll', async () => {
			const { useScroll } = await import('../use-scroll.svelte.js');
			expect(useScroll).toBeDefined();
			expect(typeof useScroll).toBe('function');
		});

		it('should import useAnimate', async () => {
			const { useAnimate } = await import('../use-animate.svelte.js');
			expect(useAnimate).toBeDefined();
			expect(typeof useAnimate).toBe('function');
		});

		it('should import useMotionTemplate', async () => {
			const { useMotionTemplate } = await import('../use-motion-template.js');
			expect(useMotionTemplate).toBeDefined();
			expect(typeof useMotionTemplate).toBe('function');
		});

		it('should import useCombineMotionValues', async () => {
			const { useCombineMotionValues } = await import('../use-combine-values.js');
			expect(useCombineMotionValues).toBeDefined();
			expect(typeof useCombineMotionValues).toBe('function');
		});

		it('should import useInView', async () => {
			const { useInView } = await import('../use-in-view.svelte.js');
			expect(useInView).toBeDefined();
			expect(typeof useInView).toBe('function');
		});

		it('should import useTime', async () => {
			const { useTime } = await import('../use-time.svelte.js');
			expect(useTime).toBeDefined();
			expect(typeof useTime).toBe('function');
		});

		it('should import useAnimationFrame', async () => {
			const { useAnimationFrame } = await import('../use-animation-frame.svelte.js');
			expect(useAnimationFrame).toBeDefined();
			expect(typeof useAnimationFrame).toBe('function');
		});

		it('should import useMotionValueEvent', async () => {
			const { useMotionValueEvent } = await import('../use-motion-value-event.svelte.js');
			expect(useMotionValueEvent).toBeDefined();
			expect(typeof useMotionValueEvent).toBe('function');
		});

		it('should import useWillChange', async () => {
			const { useWillChange } = await import('../use-will-change.svelte.js');
			expect(useWillChange).toBeDefined();
			expect(typeof useWillChange).toBe('function');
		});
	});

	describe('Scroll hooks', () => {
		it('should import useElementScroll', async () => {
			const { useElementScroll } = await import('../scroll/use-element-scroll.js');
			expect(useElementScroll).toBeDefined();
			expect(typeof useElementScroll).toBe('function');
		});

		it('should import useViewportScroll', async () => {
			const { useViewportScroll } = await import('../scroll/use-viewport-scroll.js');
			expect(useViewportScroll).toBeDefined();
			expect(typeof useViewportScroll).toBe('function');
		});
	});

	describe('Utility functions', () => {
		it('should import isMotionValue', async () => {
			const { isMotionValue } = await import('../utils/is-motion-value.js');
			expect(isMotionValue).toBeDefined();
			expect(typeof isMotionValue).toBe('function');
		});

		it('should import resolveMotionValue', async () => {
			const { resolveMotionValue } = await import('../utils/resolve-motion-value.js');
			expect(resolveMotionValue).toBeDefined();
			expect(typeof resolveMotionValue).toBe('function');
		});
	});

	describe('Main index exports', () => {
		it('should export motionValue from main index', async () => {
			const { motionValue } = await import('../index.js');
			expect(motionValue).toBeDefined();
			expect(typeof motionValue).toBe('function');
		});

		it('should export MotionValue class from main index', async () => {
			const { MotionValue } = await import('../index.js');
			expect(MotionValue).toBeDefined();
			expect(typeof MotionValue).toBe('function');
		});
	});

	describe('Backward compatibility', () => {
		it('should maintain motionValue export from root', async () => {
			const { motionValue } = await import('../../index.js');
			expect(motionValue).toBeDefined();
			expect(typeof motionValue).toBe('function');
		});

		it('should maintain useMotionValue export from root', async () => {
			const { useMotionValue } = await import('../../index.js');
			expect(useMotionValue).toBeDefined();
			expect(typeof useMotionValue).toBe('function');
		});

		it('should maintain useTransform export from root', async () => {
			const { useTransform } = await import('../../index.js');
			expect(useTransform).toBeDefined();
			expect(typeof useTransform).toBe('function');
		});

		it('should maintain useSpring export from root', async () => {
			const { useSpring } = await import('../../index.js');
			expect(useSpring).toBeDefined();
			expect(typeof useSpring).toBe('function');
		});

		it('should maintain useScroll export from root', async () => {
			const { useScroll } = await import('../../index.js');
			expect(useScroll).toBeDefined();
			expect(typeof useScroll).toBe('function');
		});

		it('should maintain useAnimate export from root', async () => {
			const { useAnimate } = await import('../../index.js');
			expect(useAnimate).toBeDefined();
			expect(typeof useAnimate).toBe('function');
		});
	});
});
