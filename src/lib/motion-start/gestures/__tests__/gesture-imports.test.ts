/**
 * Phase 3: Gestures System Reorganization Tests
 *
 * Tests that gesture imports work correctly after reorganization
 * into subdirectories (focus, hover, pan, press, drag)
 *
 * Updated to test modern function-based API only (breaking changes applied)
 */

import { describe, it, expect } from 'vitest';

describe('Phase 3: Gestures System Imports', () => {
	describe('Focus gesture subdirectory', () => {
		it('should import useFocusGesture from focus/', async () => {
			const { useFocusGesture } = await import('../focus/use-focus-gesture.svelte.js');
			expect(useFocusGesture).toBeDefined();
			expect(typeof useFocusGesture).toBe('function');
		});

		it('should import UseFocusGesture component from focus/', async () => {
			const { default: UseFocusGesture } = await import('../focus/UseFocusGesture.svelte');
			expect(UseFocusGesture).toBeDefined();
		});

		it('should have focus index.ts barrel export', async () => {
			const focus = await import('../focus/index.js');
			expect(focus.useFocusGesture).toBeDefined();
			// Legacy component export removed - modern function-based API only
		});
	});

	describe('Hover gesture subdirectory', () => {
		it('should import useHoverGesture from hover/', async () => {
			const { useHoverGesture } = await import('../hover/use-hover-gesture.svelte.js');
			expect(useHoverGesture).toBeDefined();
			expect(typeof useHoverGesture).toBe('function');
		});

		it('should import UseHoverGesture component from hover/', async () => {
			const { default: UseHoverGesture } = await import('../hover/UseHoverGesture.svelte');
			expect(UseHoverGesture).toBeDefined();
		});

		it('should have hover index.ts barrel export', async () => {
			const hover = await import('../hover/index.js');
			expect(hover.useHoverGesture).toBeDefined();
			// Legacy component export removed - modern function-based API only
		});
	});

	describe('Pan gesture subdirectory', () => {
		it('should import usePanGesture from pan/', async () => {
			const { usePanGesture } = await import('../pan/use-pan-gesture.svelte.js');
			expect(usePanGesture).toBeDefined();
			expect(typeof usePanGesture).toBe('function');
		});

		it('should import UsePanGesture component from pan/', async () => {
			const { default: UsePanGesture } = await import('../pan/UsePanGesture.svelte');
			expect(UsePanGesture).toBeDefined();
		});

		it('should import PanSession from pan/', async () => {
			const { PanSession } = await import('../pan/PanSession.js');
			expect(PanSession).toBeDefined();
			expect(typeof PanSession).toBe('function');
		});

		it('should have pan index.ts barrel export', async () => {
			const pan = await import('../pan/index.js');
			expect(pan.usePanGesture).toBeDefined();
			expect(pan.PanSession).toBeDefined();
			// Legacy component export removed - modern function-based API only
		});
	});

	describe('Press gesture subdirectory', () => {
		it('should import useTapGesture from press/', async () => {
			const { useTapGesture } = await import('../press/use-tap-gesture.svelte.js');
			expect(useTapGesture).toBeDefined();
			expect(typeof useTapGesture).toBe('function');
		});

		it('should import UseTapGesture component from press/', async () => {
			const { default: UseTapGesture } = await import('../press/UseTapGesture.svelte');
			expect(UseTapGesture).toBeDefined();
		});

		it('should have press index.ts barrel export', async () => {
			const press = await import('../press/index.js');
			expect(press.useTapGesture).toBeDefined();
			// Legacy component export removed - modern function-based API only
		});
	});

	describe('Drag gesture subdirectory', () => {
		it('should import drag controls from drag/', async () => {
			const { useDragControls } = await import('../drag/use-drag-controls.js');
			expect(useDragControls).toBeDefined();
			expect(typeof useDragControls).toBe('function');
		});

		it('should import useDrag from drag/', async () => {
			const { useDrag } = await import('../drag/use-drag.svelte.js');
			expect(useDrag).toBeDefined();
			expect(typeof useDrag).toBe('function');
		});
	});

	describe('Modern API exports', () => {
		it('should export PanSession from main index', async () => {
			const { PanSession } = await import('../../index.js');
			expect(PanSession).toBeDefined();
			expect(typeof PanSession).toBe('function');
		});

		it('should export usePanGesture from main index', async () => {
			const { usePanGesture } = await import('../../index.js');
			expect(usePanGesture).toBeDefined();
			expect(typeof usePanGesture).toBe('function');
		});

		it('should export useTapGesture from main index', async () => {
			const { useTapGesture } = await import('../../index.js');
			expect(useTapGesture).toBeDefined();
			expect(typeof useTapGesture).toBe('function');
		});

		it('should export useHoverGesture from main index', async () => {
			const { useHoverGesture } = await import('../../index.js');
			expect(useHoverGesture).toBeDefined();
			expect(typeof useHoverGesture).toBe('function');
		});

		it('should export useFocusGesture from main index', async () => {
			const { useFocusGesture } = await import('../../index.js');
			expect(useFocusGesture).toBeDefined();
			expect(typeof useFocusGesture).toBe('function');
		});

		it('should export useDrag from main index', async () => {
			const { useDrag } = await import('../../index.js');
			expect(useDrag).toBeDefined();
			expect(typeof useDrag).toBe('function');
		});
	});

	describe('Cross-gesture dependencies', () => {
		it('should allow pan gesture to import from drag utilities', async () => {
			// Pan gesture uses drag utilities - verify this works
			const { PanSession } = await import('../pan/PanSession.js');
			expect(PanSession).toBeDefined();
		});

		it('should maintain gesture utils accessibility', async () => {
			// Verify shared utils are still accessible
			const utils = await import('../utils/event-type.js');
			expect(utils).toBeDefined();
		});
	});
});
