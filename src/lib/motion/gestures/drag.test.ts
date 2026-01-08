/**
 * Drag Gesture Tests
 *
 * Browser/jsdom tests for drag and pan gestures
 * Ported from motiondivision/motion test patterns
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { draggable, pan } from './drag.svelte.js';

describe('draggable attachment', () => {
	let element: HTMLDivElement;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		vi.useFakeTimers();
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			setTimeout(() => cb(performance.now()), 16);
			return 1;
		});

		// Mock setPointerCapture and releasePointerCapture
		element.setPointerCapture = vi.fn();
		element.releasePointerCapture = vi.fn();
	});

	afterEach(() => {
		document.body.removeChild(element);
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('initialization', () => {
		it('should set touch-action to none by default', () => {
			const cleanup = draggable({ drag: true })(element);

			expect(element.style.touchAction).toBe('none');

			cleanup();
		});

		it('should set touch-action to pan-y for x-only drag', () => {
			const cleanup = draggable({ drag: 'x' })(element);

			expect(element.style.touchAction).toBe('pan-y');

			cleanup();
		});

		it('should set touch-action to pan-x for y-only drag', () => {
			const cleanup = draggable({ drag: 'y' })(element);

			expect(element.style.touchAction).toBe('pan-x');

			cleanup();
		});
	});

	describe('drag events', () => {
		it('should call onDragStart on pointer down', () => {
			const onDragStart = vi.fn();

			const cleanup = draggable({
				onDragStart
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			expect(onDragStart).toHaveBeenCalled();
			expect(element.setPointerCapture).toHaveBeenCalledWith(1);

			cleanup();
		});

		it('should call onDrag during pointer move', () => {
			const onDrag = vi.fn();

			const cleanup = draggable({
				onDrag
			})(element);

			// Start drag
			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			// Move
			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 150,
					clientY: 120,
					pointerId: 1
				})
			);

			expect(onDrag).toHaveBeenCalled();
			const info = onDrag.mock.calls[0][1];
			expect(info.delta.x).toBe(50);
			expect(info.delta.y).toBe(20);

			cleanup();
		});

		it('should call onDragEnd on pointer up', () => {
			const onDragEnd = vi.fn();

			const cleanup = draggable({
				onDragEnd
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			element.dispatchEvent(
				new PointerEvent('pointerup', {
					clientX: 150,
					clientY: 120,
					pointerId: 1
				})
			);

			expect(onDragEnd).toHaveBeenCalled();
			expect(element.releasePointerCapture).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('axis constraints', () => {
		it('should only allow x movement when drag="x"', () => {
			const onUpdate = vi.fn();

			const cleanup = draggable({
				drag: 'x',
				onUpdate
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 150,
					clientY: 150,
					pointerId: 1
				})
			);

			expect(onUpdate).toHaveBeenCalledWith({ x: 50, y: undefined });

			cleanup();
		});

		it('should only allow y movement when drag="y"', () => {
			const onUpdate = vi.fn();

			const cleanup = draggable({
				drag: 'y',
				onUpdate
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 150,
					clientY: 150,
					pointerId: 1
				})
			);

			expect(onUpdate).toHaveBeenCalledWith({ x: undefined, y: 50 });

			cleanup();
		});
	});

	describe('direction lock', () => {
		it('should lock to dominant axis when dragDirectionLock is true', () => {
			const onDirectionLock = vi.fn();
			const onUpdate = vi.fn();

			const cleanup = draggable({
				dragDirectionLock: true,
				onDirectionLock,
				onUpdate
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			// Move more in X direction
			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 110,
					clientY: 102,
					pointerId: 1
				})
			);

			expect(onDirectionLock).toHaveBeenCalledWith('x');

			cleanup();
		});
	});

	describe('constraints', () => {
		it('should apply box constraints', () => {
			const onUpdate = vi.fn();

			const cleanup = draggable({
				dragConstraints: {
					left: -50,
					right: 50,
					top: -50,
					bottom: 50
				},
				dragElastic: 0,
				onUpdate
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 0,
					clientY: 0,
					pointerId: 1
				})
			);

			// Try to move beyond constraints
			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			// Should be clamped to constraints
			const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
			expect(lastCall.x).toBe(50);
			expect(lastCall.y).toBe(50);

			cleanup();
		});

		it('should apply elasticity during drag', () => {
			const onUpdate = vi.fn();

			const cleanup = draggable({
				dragConstraints: {
					left: -50,
					right: 50,
					top: -50,
					bottom: 50
				},
				dragElastic: 0.5,
				onUpdate
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 0,
					clientY: 0,
					pointerId: 1
				})
			);

			// Try to move beyond constraints
			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 100,
					clientY: 0,
					pointerId: 1
				})
			);

			// Should be stretched beyond constraint with elasticity
			const lastCall = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
			expect(lastCall.x).toBeGreaterThan(50);
			expect(lastCall.x).toBeLessThan(100);

			cleanup();
		});
	});

	describe('snapToOrigin', () => {
		it('should animate back to origin when dragSnapToOrigin is true', async () => {
			const onUpdate = vi.fn();

			const cleanup = draggable({
				dragSnapToOrigin: true,
				onUpdate
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 0,
					clientY: 0,
					pointerId: 1
				})
			);

			element.dispatchEvent(
				new PointerEvent('pointermove', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			element.dispatchEvent(
				new PointerEvent('pointerup', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			// Let animation run
			await vi.advanceTimersByTimeAsync(500);

			// Should have called onUpdate
			expect(onUpdate).toHaveBeenCalled();

			// Get last call that has x value
			const calls = onUpdate.mock.calls;
			const xValues = calls.map(c => c[0].x).filter(x => typeof x === 'number' && !isNaN(x));

			// If we have x values, the last one should be close to 0
			if (xValues.length > 0) {
				const lastX = xValues[xValues.length - 1];
				expect(Math.abs(lastX)).toBeLessThan(10);
			}

			cleanup();
		});
	});

	describe('cleanup', () => {
		it('should remove event listeners on cleanup', () => {
			const removeEventListener = vi.spyOn(element, 'removeEventListener');

			const cleanup = draggable({})(element);
			cleanup();

			expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function));
			expect(removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
			expect(removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function));
		});

		it('should stop active animation on cleanup', async () => {
			const cleanup = draggable({
				dragSnapToOrigin: true
			})(element);

			element.dispatchEvent(
				new PointerEvent('pointerdown', {
					clientX: 0,
					clientY: 0,
					pointerId: 1
				})
			);

			element.dispatchEvent(
				new PointerEvent('pointerup', {
					clientX: 100,
					clientY: 100,
					pointerId: 1
				})
			);

			// Cleanup while animation is running
			cleanup();

			// Should not throw
			await vi.advanceTimersByTimeAsync(500);
		});
	});
});

describe('pan gesture', () => {
	let element: HTMLDivElement;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		element.setPointerCapture = vi.fn();
		element.releasePointerCapture = vi.fn();
	});

	afterEach(() => {
		document.body.removeChild(element);
	});

	it('should call onPanStart on pointer down', () => {
		const onPanStart = vi.fn();

		const cleanup = pan({ onPanStart })(element);

		element.dispatchEvent(
			new PointerEvent('pointerdown', {
				clientX: 100,
				clientY: 100,
				pointerId: 1
			})
		);

		expect(onPanStart).toHaveBeenCalled();
		const info = onPanStart.mock.calls[0][1];
		expect(info.point.x).toBe(100);
		expect(info.point.y).toBe(100);

		cleanup();
	});

	it('should call onPan during pointer move', () => {
		const onPan = vi.fn();

		const cleanup = pan({ onPan })(element);

		element.dispatchEvent(
			new PointerEvent('pointerdown', {
				clientX: 100,
				clientY: 100,
				pointerId: 1
			})
		);

		element.dispatchEvent(
			new PointerEvent('pointermove', {
				clientX: 150,
				clientY: 120,
				pointerId: 1
			})
		);

		expect(onPan).toHaveBeenCalled();
		const info = onPan.mock.calls[0][1];
		expect(info.delta.x).toBe(50);
		expect(info.delta.y).toBe(20);
		expect(info.offset.x).toBe(50);
		expect(info.offset.y).toBe(20);

		cleanup();
	});

	it('should call onPanEnd on pointer up', () => {
		const onPanEnd = vi.fn();

		const cleanup = pan({ onPanEnd })(element);

		element.dispatchEvent(
			new PointerEvent('pointerdown', {
				clientX: 100,
				clientY: 100,
				pointerId: 1
			})
		);

		element.dispatchEvent(
			new PointerEvent('pointerup', {
				clientX: 150,
				clientY: 120,
				pointerId: 1
			})
		);

		expect(onPanEnd).toHaveBeenCalled();

		cleanup();
	});

	it('should not trigger events when not panning', () => {
		const onPan = vi.fn();

		const cleanup = pan({ onPan })(element);

		// Move without starting pan
		element.dispatchEvent(
			new PointerEvent('pointermove', {
				clientX: 150,
				clientY: 120
			})
		);

		expect(onPan).not.toHaveBeenCalled();

		cleanup();
	});

	it('should remove event listeners on cleanup', () => {
		const removeEventListener = vi.spyOn(element, 'removeEventListener');

		const cleanup = pan({})(element);
		cleanup();

		expect(removeEventListener).toHaveBeenCalledWith('pointerdown', expect.any(Function));
		expect(removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
		expect(removeEventListener).toHaveBeenCalledWith('pointerup', expect.any(Function));
	});
});
