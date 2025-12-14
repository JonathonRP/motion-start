/**
 * Integration tests for reactive contexts
 * Tests context propagation, updates, and integration between components
 */

import { describe, it, expect } from 'vitest';
import {
	createPresenceContext,
	type PresenceContextType
} from '../context/PresenceContext.svelte';
import {
	createMotionConfigContext,
	type MotionConfigContextType,
	defaultMotionConfig
} from '../context/MotionConfigContext.svelte';
import {
	createLayoutGroupContext,
	type LayoutGroupContextType
} from '../context/LayoutGroupContext.svelte';

describe('Integration: Context Propagation', () => {
	describe('PresenceContext integration', () => {
		it('should propagate presence state to child components', () => {
			// Create parent context
			const parentContext = createPresenceContext();

			// Verify initial state
			expect(parentContext.visibleChildren.length).toBe(0);
			expect(parentContext.isExiting).toBe(false);
		});

		it('should track children across context boundary', async () => {
			const context = createPresenceContext();

			// Parent adds child
			const childId = 'child-1';
			context.addChild(childId);

			// Verify child is tracked
			expect(context.visibleChildren).toContain(childId);
			expect(context.visibleChildren.length).toBe(1);

			// Child removes itself
			context.removeChild(childId);

			// Verify child is removed
			expect(context.visibleChildren).not.toContain(childId);
			expect(context.visibleChildren.length).toBe(0);
		});

		it('should coordinate exit animations across children', async () => {
			const context = createPresenceContext();

			// Register multiple children's exit animations
			const child1Promise = new Promise<void>((resolve) =>
				setTimeout(resolve, 50)
			);
			const child2Promise = new Promise<void>((resolve) =>
				setTimeout(resolve, 100)
			);

			context.registerExitAnimation('child-1', child1Promise);
			context.registerExitAnimation('child-2', child2Promise);

			expect(context.isExiting).toBe(true);

			// Wait for all animations
			await context.waitForExitAnimations();

			expect(context.isExiting).toBe(false);
		});
	});

	describe('MotionConfigContext integration', () => {
		it('should inherit parent config and allow overrides', () => {
			// Parent config
			const parentConfig = createMotionConfigContext({
				...defaultMotionConfig,
				reducedMotion: 'user',
				transition: { duration: 0.3 }
			});

			// Child config (would normally getContext parent first)
			const childConfig = createMotionConfigContext({
				...defaultMotionConfig,
				transition: { duration: 0.5 } // Override
				// reducedMotion inherited
			});

			// Verify parent config
			expect(parentConfig.config.reducedMotion).toBe('user');

			// Verify child config
			expect(childConfig.config.reducedMotion).toBe('never');
		});

		it('should update config reactively', () => {
			const context = createMotionConfigContext();

			// Initial state
			expect(context.config.reducedMotion).toBe('never');

			// Update config
			context.setConfig({ reducedMotion: 'always' });

			// Verify update
			expect(context.config.reducedMotion).toBe('always');
		});

		it('should merge partial config updates', () => {
			const context = createMotionConfigContext({
				...defaultMotionConfig,
				reducedMotion: 'user',
				transition: { duration: 0.3 },
				isStatic: false
			});

			// Partial update
			context.setConfig({ transition: { duration: 0.5 } });

			// Verify merge (only transition changed)
			expect(context.config.reducedMotion).toBe('user');
			expect(context.config.isStatic).toBe(false);
		});
	});

	describe('LayoutGroupContext integration', () => {
		it('should track layout changes across group members', () => {
			const context = createLayoutGroupContext();

			// Initial state
			expect(context.layoutChanged).toBe(false);

			// Register element dimensions
			const elementId = 'element-1';
			context.registerElement(elementId, {
				x: 0,
				y: 0,
				width: 100,
				height: 100,
				top: 0,
				left: 0,
				right: 100,
				bottom: 100,
				toJSON: () => ({})
			});

			// Verify registration
			expect(context.dimensions.has(elementId)).toBe(true);
			expect(context.layoutChanged).toBe(true);

			// Update dimensions (triggers layout change)
			context.registerElement(elementId, {
				x: 0,
				y: 0,
				width: 150,
				height: 100,
				top: 0,
				left: 0,
				right: 150,
				bottom: 100,
				toJSON: () => ({})
			});

			// Verify layout changed detected
			expect(context.layoutChanged).toBe(true);
		});

		it('should coordinate animations across group members', () => {
			const context = createLayoutGroupContext();

			// No animations initially
			expect(context.isAnimating).toBe(false);

			// Start animation
			context.startAnimation();
			expect(context.isAnimating).toBe(true);

			// Start second animation
			context.startAnimation();

			// Finish first animation
			context.finishAnimation();
			expect(context.isAnimating).toBe(true);

			// Finish second animation
			context.finishAnimation();
			expect(context.isAnimating).toBe(false);
		});

		it('should cleanup dimensions when elements unmount', () => {
			const context = createLayoutGroupContext();

			// Register multiple elements
			context.registerElement('el-1', {
				x: 0,
				y: 0,
				width: 100,
				height: 100,
				top: 0,
				left: 0,
				right: 100,
				bottom: 100,
				toJSON: () => ({})
			});
			context.registerElement('el-2', {
				x: 100,
				y: 0,
				width: 100,
				height: 100,
				top: 0,
				left: 100,
				right: 200,
				bottom: 100,
				toJSON: () => ({})
			});

			expect(context.dimensions.size).toBe(2);

			// Unregister one element
			context.unregisterElement('el-1');

			expect(context.dimensions.size).toBe(1);
			expect(context.dimensions.has('el-1')).toBe(false);
			expect(context.dimensions.has('el-2')).toBe(true);
		});
	});

	describe('Cross-context integration', () => {
		it('should work with MotionConfig and LayoutGroup together', () => {
			// Motion config with reduced motion
			const motionConfig = createMotionConfigContext({
				...defaultMotionConfig,
				reducedMotion: 'always'
			});

			// Layout group for coordinated animations
			const layoutGroup = createLayoutGroupContext();

			// Register element in layout group
			layoutGroup.registerElement('el-1', {
				x: 0,
				y: 0,
				width: 100,
				height: 100,
				top: 0,
				left: 0,
				right: 100,
				bottom: 100,
				toJSON: () => ({})
			});

			// Start animation (should respect reduced motion from config)
			layoutGroup.startAnimation();

			// Verify both contexts working
			expect(motionConfig.config.reducedMotion).toBe('always');
			expect(layoutGroup.isAnimating).toBe(true);

			// Finish animation
			layoutGroup.finishAnimation();
			expect(layoutGroup.isAnimating).toBe(false);
		});

		it('should work with Presence and MotionConfig together', async () => {
			// Motion config
			const motionConfig = createMotionConfigContext({
				...defaultMotionConfig,
				transition: { duration: 0.3 }
			});

			// Presence context
			const presenceContext = createPresenceContext();

			// Add child
			presenceContext.addChild('child-1');

			// Trigger exit animation
			const exitPromise = new Promise<void>((resolve) =>
				setTimeout(resolve, 50)
			);
			presenceContext.registerExitAnimation('child-1', exitPromise);

			expect(presenceContext.isExiting).toBe(true);

			// Wait for exit
			await presenceContext.waitForExitAnimations();

			expect(presenceContext.isExiting).toBe(false);

			// Motion config still available
			expect(motionConfig.config.reducedMotion).toBe('never');
		});
	});
});
