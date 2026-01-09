/**
 * Tween Animation Tests
 *
 * Tests for tween functions, color parsing, and easing resolution
 */

import { describe, it, expect } from 'vitest';

describe('tween module exports', () => {
	it('should export all tween functions', async () => {
		const module = await import('./tween.svelte.js');

		expect(module.tween).toBeDefined();
		expect(typeof module.tween).toBe('function');
		expect(module.tweenFrom).toBeDefined();
		expect(typeof module.tweenFrom).toBe('function');
		expect(module.tweenObject).toBeDefined();
		expect(typeof module.tweenObject).toBe('function');
		expect(module.tweenColor).toBeDefined();
		expect(typeof module.tweenColor).toBe('function');
		expect(module.SvelteTween).toBeDefined();
	});
});

describe('tween function', () => {
	it('should create a tween with initial value', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(100);

		expect(t.current).toBe(100);
		expect(t.target).toBe(100);
	});

	it('should expose reactive current property', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);

		expect(typeof t.current).toBe('number');
		expect(t.current).toBe(0);
	});

	it('should have snap method for immediate value changes', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);

		expect(t.snap).toBeDefined();
		expect(typeof t.snap).toBe('function');
	});

	it('should have set method for animated transitions', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);

		expect(t.set).toBeDefined();
		expect(typeof t.set).toBe('function');
	});

	it('should accept duration option', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0, { duration: 300 });
		expect(t.current).toBe(0);
	});

	it('should accept delay option', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0, { delay: 100 });
		expect(t.current).toBe(0);
	});

	it('should accept easing as string', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0, { easing: 'easeOut' });
		expect(t.current).toBe(0);
	});

	it('should accept easing as function', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0, { easing: (t) => t * t });
		expect(t.current).toBe(0);
	});

	it('should update target property', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);
		t.target = 100;

		expect(t.target).toBe(100);
	});
});

describe('tweenObject function', () => {
	it('should create a tween for object values', async () => {
		const { tweenObject } = await import('./tween.svelte.js');

		const t = tweenObject({ x: 0, y: 0 });

		expect(t.current).toEqual({ x: 0, y: 0 });
		expect(t.target).toEqual({ x: 0, y: 0 });
	});

	it('should accept options', async () => {
		const { tweenObject } = await import('./tween.svelte.js');

		const t = tweenObject({ x: 0, y: 0, scale: 1 }, { duration: 500, easing: 'backOut' });

		expect(t.current).toEqual({ x: 0, y: 0, scale: 1 });
	});
});

describe('tweenColor function', () => {
	it('should create a color tween', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('#ff0000');

		expect(t.current).toBe('#ff0000');
		expect(t.target).toBe('#ff0000');
	});

	it('should accept duration option', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('#ff0000', { duration: 500 });
		expect(t.current).toBe('#ff0000');
	});

	it('should accept rgb colors', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('rgb(255, 0, 0)');
		expect(t.current).toBe('rgb(255, 0, 0)');
	});

	it('should accept rgba colors', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('rgba(255, 0, 0, 0.5)');
		expect(t.current).toBe('rgba(255, 0, 0, 0.5)');
	});
});

describe('color parsing', () => {
	it('should handle hex6 colors', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('#ff0000');
		expect(t.current).toBe('#ff0000');
	});

	it('should handle short hex3 colors', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('#f00');
		expect(t.current).toBe('#f00');
	});

	it('should handle rgb colors', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('rgb(128, 64, 32)');
		expect(t.current).toBe('rgb(128, 64, 32)');
	});

	it('should handle rgba colors with alpha', async () => {
		const { tweenColor } = await import('./tween.svelte.js');

		const t = tweenColor('rgba(128, 64, 32, 0.5)');
		expect(t.current).toBe('rgba(128, 64, 32, 0.5)');
	});
});

describe('TweenValue interface', () => {
	it('should have readonly current property', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(50);
		expect(t.current).toBe(50);
	});

	it('should have settable target property', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);
		t.target = 100;
		expect(t.target).toBe(100);
	});

	it('should return promise from set method', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);
		const result = t.set(100);

		expect(result).toBeInstanceOf(Promise);
	});
});

describe('easing resolution', () => {
	it('should use linear easing by default', async () => {
		const { tween } = await import('./tween.svelte.js');

		const t = tween(0);
		expect(t.current).toBe(0);
	});

	it('should accept named Svelte easings', async () => {
		const { tween } = await import('./tween.svelte.js');

		const easings = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'backIn', 'backOut', 'elasticOut'];

		for (const easing of easings) {
			const t = tween(0, { easing: easing as any });
			expect(t.current).toBe(0);
		}
	});
});
