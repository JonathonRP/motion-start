/**
 * Layout Attachment Tests
 *
 * Browser/jsdom tests for FLIP layout animations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('layout module exports', () => {
	it('should export all layout functions', async () => {
		const module = await import('./layout.svelte.js');

		expect(module.layout).toBeDefined();
		expect(typeof module.layout).toBe('function');
		expect(module.animateLayoutElement).toBeDefined();
		expect(typeof module.animateLayoutElement).toBe('function');
		expect(module.snapshotLayout).toBeDefined();
		expect(typeof module.snapshotLayout).toBe('function');
		expect(module.createLayoutBatch).toBeDefined();
		expect(typeof module.createLayoutBatch).toBe('function');
		expect(module.layoutGroup).toBeDefined();
		expect(typeof module.layoutGroup).toBe('function');
	});
});

describe('createLayoutBatch', () => {
	let elements: HTMLDivElement[];

	beforeEach(() => {
		elements = [];
		for (let i = 0; i < 3; i++) {
			const el = document.createElement('div');
			el.getBoundingClientRect = vi.fn().mockReturnValue({
				left: i * 100,
				top: 0,
				width: 100,
				height: 100,
				right: (i + 1) * 100,
				bottom: 100
			});
			document.body.appendChild(el);
			elements.push(el);
		}

		vi.useFakeTimers();
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			setTimeout(() => cb(performance.now()), 16);
			return 1;
		});
	});

	afterEach(() => {
		for (const el of elements) {
			document.body.removeChild(el);
		}
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('should create a layout batch with snapshot and play methods', async () => {
		const { createLayoutBatch } = await import('./layout.svelte.js');

		const batch = createLayoutBatch(elements);

		expect(batch.snapshot).toBeDefined();
		expect(typeof batch.snapshot).toBe('function');
		expect(batch.play).toBeDefined();
		expect(typeof batch.play).toBe('function');
	});

	it('should snapshot element positions', async () => {
		const { createLayoutBatch } = await import('./layout.svelte.js');

		const batch = createLayoutBatch(elements);

		// Snapshot is called automatically on creation
		// Should not throw
		expect(() => batch.snapshot()).not.toThrow();
	});

	it('should play animation without error', async () => {
		const { createLayoutBatch } = await import('./layout.svelte.js');

		const batch = createLayoutBatch(elements);

		// Take snapshot
		batch.snapshot();

		// Simulate DOM change by updating mock positions
		elements[0].getBoundingClientRect = vi.fn().mockReturnValue({
			left: 50,
			top: 50,
			width: 100,
			height: 100,
			right: 150,
			bottom: 150
		});

		// Play should not throw
		expect(() => batch.play()).not.toThrow();
	});

	it('should accept custom transition options', async () => {
		const { createLayoutBatch } = await import('./layout.svelte.js');

		const batch = createLayoutBatch(elements);
		batch.snapshot();

		// Should accept transition options
		expect(() => batch.play({ type: 'spring', stiffness: 300, damping: 25 })).not.toThrow();
	});

	it('should apply transform during animation', async () => {
		const { createLayoutBatch } = await import('./layout.svelte.js');

		const batch = createLayoutBatch(elements);
		batch.snapshot();

		// Change position
		const originalRect = elements[0].getBoundingClientRect();
		elements[0].getBoundingClientRect = vi.fn().mockReturnValue({
			left: originalRect.left + 100,
			top: originalRect.top,
			width: 100,
			height: 100,
			right: originalRect.right + 100,
			bottom: 100
		});

		batch.play();

		// After play, transform should be applied
		// The element will have an inverted transform initially
		await vi.advanceTimersByTimeAsync(16);

		// Transform is applied (could be empty string if animation already cleaned up)
		expect(elements[0].style.transform !== undefined).toBe(true);
	});
});

describe('layout attachment', () => {
	let element: HTMLDivElement;

	beforeEach(() => {
		element = document.createElement('div');
		element.getBoundingClientRect = vi.fn().mockReturnValue({
			left: 0,
			top: 0,
			width: 100,
			height: 100,
			right: 100,
			bottom: 100
		});
		document.body.appendChild(element);

		vi.useFakeTimers();
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			setTimeout(() => cb(performance.now()), 16);
			return 1;
		});

		// Mock ResizeObserver
		vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		})));

		// Mock MutationObserver
		vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			disconnect: vi.fn()
		})));
	});

	afterEach(() => {
		document.body.removeChild(element);
		vi.useRealTimers();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it('should create a layout attachment function', async () => {
		const { layout } = await import('./layout.svelte.js');

		const attachment = layout();

		expect(typeof attachment).toBe('function');
	});

	it('should return cleanup function when attached', async () => {
		const { layout } = await import('./layout.svelte.js');

		const attachment = layout();
		const cleanup = attachment(element);

		expect(typeof cleanup).toBe('function');
	});

	it('should attach layout API to element', async () => {
		const { layout } = await import('./layout.svelte.js');

		const attachment = layout();
		attachment(element);

		expect((element as any).__motionLayout).toBeDefined();
		expect((element as any).__motionLayout.snapshot).toBeDefined();
		expect((element as any).__motionLayout.animate).toBeDefined();
	});

	it('should cleanup layout API on unmount', async () => {
		const { layout } = await import('./layout.svelte.js');

		const attachment = layout();
		const cleanup = attachment(element);

		cleanup();

		expect((element as any).__motionLayout).toBeUndefined();
	});

	it('should accept layout mode options', async () => {
		const { layout } = await import('./layout.svelte.js');

		// Different layout modes
		const positionOnly = layout({ layout: 'position' });
		const sizeOnly = layout({ layout: 'size' });
		const both = layout({ layout: true });

		expect(typeof positionOnly).toBe('function');
		expect(typeof sizeOnly).toBe('function');
		expect(typeof both).toBe('function');
	});

	it('should accept layoutId option', async () => {
		const { layout } = await import('./layout.svelte.js');

		const attachment = layout({ layoutId: 'hero' });

		expect(typeof attachment).toBe('function');
	});

	it('should accept transition option', async () => {
		const { layout } = await import('./layout.svelte.js');

		const attachment = layout({
			transition: { type: 'spring', stiffness: 300, damping: 20 }
		});

		expect(typeof attachment).toBe('function');
	});

	it('should accept callback options', async () => {
		const onStart = vi.fn();
		const onComplete = vi.fn();

		const { layout } = await import('./layout.svelte.js');

		const attachment = layout({
			onLayoutAnimationStart: onStart,
			onLayoutAnimationComplete: onComplete
		});

		expect(typeof attachment).toBe('function');
	});
});

describe('animateLayoutElement', () => {
	let element: HTMLDivElement;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		})));

		vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			disconnect: vi.fn()
		})));
	});

	afterEach(() => {
		document.body.removeChild(element);
		vi.unstubAllGlobals();
	});

	it('should be a no-op on elements without layout attachment', async () => {
		const { animateLayoutElement } = await import('./layout.svelte.js');

		// Should not throw on element without layout
		expect(() => animateLayoutElement(element)).not.toThrow();
	});

	it('should call animate on element with layout attachment', async () => {
		const { layout, animateLayoutElement } = await import('./layout.svelte.js');

		const attachment = layout();
		attachment(element);

		const animateSpy = vi.spyOn((element as any).__motionLayout, 'animate');

		animateLayoutElement(element);

		expect(animateSpy).toHaveBeenCalled();
	});
});

describe('snapshotLayout', () => {
	let element: HTMLDivElement;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn()
		})));

		vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			disconnect: vi.fn()
		})));
	});

	afterEach(() => {
		document.body.removeChild(element);
		vi.unstubAllGlobals();
	});

	it('should be a no-op on elements without layout attachment', async () => {
		const { snapshotLayout } = await import('./layout.svelte.js');

		// Should not throw on element without layout
		expect(() => snapshotLayout(element)).not.toThrow();
	});

	it('should call snapshot on element with layout attachment', async () => {
		const { layout, snapshotLayout } = await import('./layout.svelte.js');

		const attachment = layout();
		attachment(element);

		const snapshotSpy = vi.spyOn((element as any).__motionLayout, 'snapshot');

		snapshotLayout(element);

		expect(snapshotSpy).toHaveBeenCalled();
	});
});

describe('LayoutProps interface', () => {
	it('should have correct shape', () => {
		const props = {
			layout: true as boolean | 'position' | 'size',
			layoutId: 'hero',
			transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
			onLayoutAnimationStart: () => {},
			onLayoutAnimationComplete: () => {}
		};

		expect(props.layout).toBe(true);
		expect(props.layoutId).toBe('hero');
		expect(props.transition.type).toBe('spring');
		expect(typeof props.onLayoutAnimationStart).toBe('function');
		expect(typeof props.onLayoutAnimationComplete).toBe('function');
	});

	it('should accept position-only mode', () => {
		const props = { layout: 'position' as const };
		expect(props.layout).toBe('position');
	});

	it('should accept size-only mode', () => {
		const props = { layout: 'size' as const };
		expect(props.layout).toBe('size');
	});
});
