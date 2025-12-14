/**
 * Unit tests for runes-based reactive contexts.
 * These tests verify the functionality of contexts using Svelte 5 runes.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
	createPresenceContext,
	createMotionConfigContext,
	createLayoutGroupContext,
	defaultMotionConfig,
} from '../context/index.svelte';

describe('createPresenceContext', () => {
	it('should initialize with empty children', () => {
		const ctx = createPresenceContext();
		expect(ctx.visibleChildren).toEqual([]);
	});

	it('should add child to visible children', () => {
		const ctx = createPresenceContext();
		ctx.addChild('child-1');
		expect(ctx.visibleChildren).toEqual(['child-1']);
	});

	it('should remove child from visible children', () => {
		const ctx = createPresenceContext();
		ctx.addChild('child-1');
		ctx.addChild('child-2');
		ctx.removeChild('child-1');
		expect(ctx.visibleChildren).toEqual(['child-2']);
	});

	it('should initialize with isExiting as false', () => {
		const ctx = createPresenceContext();
		expect(ctx.isExiting).toBe(false);
	});

	it('should register exit animations and set isExiting to true', () => {
		const ctx = createPresenceContext();

		const animation = new Promise<void>((resolve) => setTimeout(resolve, 10));
		ctx.registerExitAnimation('child-1', animation);

		expect(ctx.isExiting).toBe(true);
	});

	it('should wait for all exit animations and set isExiting to false', async () => {
		const ctx = createPresenceContext();

		let resolved = false;
		const animation = new Promise<void>((resolve) => {
			setTimeout(() => {
				resolved = true;
				resolve();
			}, 50);
		});

		ctx.registerExitAnimation('child-1', animation);
		expect(ctx.isExiting).toBe(true);

		await ctx.waitForExitAnimations();

		expect(resolved).toBe(true);
		expect(ctx.isExiting).toBe(false);
	});

	it('should handle multiple exit animations', async () => {
		const ctx = createPresenceContext();

		let count = 0;
		const animation1 = new Promise<void>((resolve) => {
			setTimeout(() => {
				count++;
				resolve();
			}, 20);
		});
		const animation2 = new Promise<void>((resolve) => {
			setTimeout(() => {
				count++;
				resolve();
			}, 30);
		});

		ctx.registerExitAnimation('child-1', animation1);
		ctx.registerExitAnimation('child-2', animation2);

		await ctx.waitForExitAnimations();

		expect(count).toBe(2);
		expect(ctx.isExiting).toBe(false);
	});
});

describe('createMotionConfigContext', () => {
	it('should initialize with default config', () => {
		const ctx = createMotionConfigContext();
		expect(ctx.config).toEqual(defaultMotionConfig);
	});

	it('should initialize with custom config', () => {
		const customConfig = {
			...defaultMotionConfig,
			reducedMotion: 'always' as const,
		};
		const ctx = createMotionConfigContext(customConfig);
		expect(ctx.config.reducedMotion).toBe('always');
	});

	it('should set partial config', () => {
		const ctx = createMotionConfigContext();
		ctx.setConfig({ reducedMotion: 'always' });
		expect(ctx.config.reducedMotion).toBe('always');
		expect(ctx.config.isStatic).toBe(false); // Other properties preserved
	});

	it('should update config via function', () => {
		const ctx = createMotionConfigContext();
		ctx.updateConfig((config) => ({
			...config,
			isStatic: true,
		}));
		expect(ctx.config.isStatic).toBe(true);
	});

	it('should merge multiple partial configs', () => {
		const ctx = createMotionConfigContext();
		ctx.setConfig({ reducedMotion: 'always' });
		ctx.setConfig({ isStatic: true });
		expect(ctx.config.reducedMotion).toBe('always');
		expect(ctx.config.isStatic).toBe(true);
	});
});

describe('createLayoutGroupContext', () => {
	it('should initialize with empty dimensions', () => {
		const ctx = createLayoutGroupContext();
		expect(ctx.dimensions.size).toBe(0);
	});

	it('should register element dimensions', () => {
		const ctx = createLayoutGroupContext();
		const rect = new DOMRect(0, 0, 100, 100);

		ctx.registerElement('el-1', rect);

		expect(ctx.dimensions.get('el-1')).toBe(rect);
		expect(ctx.layoutChanged).toBe(true);
	});

	it('should unregister element dimensions', () => {
		const ctx = createLayoutGroupContext();
		const rect = new DOMRect(0, 0, 100, 100);

		ctx.registerElement('el-1', rect);
		expect(ctx.dimensions.size).toBe(1);

		ctx.unregisterElement('el-1');
		expect(ctx.dimensions.size).toBe(0);
		expect(ctx.layoutChanged).toBe(false);
	});

	it('should track isAnimating state', () => {
		const ctx = createLayoutGroupContext();

		expect(ctx.isAnimating).toBe(false);

		ctx.startAnimation();
		expect(ctx.isAnimating).toBe(true);

		ctx.finishAnimation();
		expect(ctx.isAnimating).toBe(false);
	});

	it('should handle multiple concurrent animations', () => {
		const ctx = createLayoutGroupContext();

		ctx.startAnimation();
		ctx.startAnimation();
		expect(ctx.isAnimating).toBe(true);

		ctx.finishAnimation();
		expect(ctx.isAnimating).toBe(true); // Still animating (1 left)

		ctx.finishAnimation();
		expect(ctx.isAnimating).toBe(false); // All animations complete
	});

	it('should derive layoutChanged from dimensions', () => {
		const ctx = createLayoutGroupContext();

		expect(ctx.layoutChanged).toBe(false);

		ctx.registerElement('el-1', new DOMRect(0, 0, 100, 100));
		expect(ctx.layoutChanged).toBe(true);

		ctx.unregisterElement('el-1');
		expect(ctx.layoutChanged).toBe(false);
	});

	it('should not go below 0 animation count', () => {
		const ctx = createLayoutGroupContext();

		ctx.finishAnimation();
		ctx.finishAnimation();

		expect(ctx.isAnimating).toBe(false);

		ctx.startAnimation();
		expect(ctx.isAnimating).toBe(true);
	});
});
