/**
 * Motion Attachment Tests
 *
 * Browser/jsdom tests for the motion attachment
 * Ported from motiondivision/motion test patterns
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { motion, createMotion } from './motion.svelte.js';

describe('motion attachment', () => {
	let element: HTMLDivElement;

	beforeEach(() => {
		// Create test element
		element = document.createElement('div');
		document.body.appendChild(element);

		// Mock requestAnimationFrame
		vi.useFakeTimers();
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			setTimeout(() => cb(performance.now()), 16);
			return 1;
		});
	});

	afterEach(() => {
		document.body.removeChild(element);
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe('initial state', () => {
		it('should apply initial styles immediately', () => {
			const cleanup = motion({
				initial: { opacity: 0, x: 100 }
			})(element);

			expect(element.style.opacity).toBe('0');
			expect(element.style.transform).toContain('translateX(100px)');

			cleanup();
		});

		it('should not animate when initial is same as animate', () => {
			const onAnimationStart = vi.fn();

			const cleanup = motion({
				initial: { opacity: 1 },
				animate: { opacity: 1 },
				onAnimationStart
			})(element);

			vi.advanceTimersByTime(100);

			expect(onAnimationStart).not.toHaveBeenCalled();

			cleanup();
		});

		it('should skip initial styles when initial is false', () => {
			const cleanup = motion({
				initial: false,
				animate: { opacity: 0.5 }
			})(element);

			// Should not have initial styles applied
			expect(element.style.opacity).toBe('');

			cleanup();
		});
	});

	describe('animation', () => {
		it('should animate from initial to animate', async () => {
			const onAnimationStart = vi.fn();
			const onAnimationComplete = vi.fn();

			const cleanup = motion({
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { type: 'tween', duration: 0.1 },
				onAnimationStart,
				onAnimationComplete
			})(element);

			// Initial state
			expect(element.style.opacity).toBe('0');

			// Advance to trigger animation
			await vi.advanceTimersByTimeAsync(50);
			expect(onAnimationStart).toHaveBeenCalled();

			// Advance to complete animation
			await vi.advanceTimersByTimeAsync(200);
			expect(onAnimationComplete).toHaveBeenCalled();

			cleanup();
		});

		it('should use spring transition by default', () => {
			const cleanup = motion({
				initial: { x: 0 },
				animate: { x: 100 }
			})(element);

			// Animation should start
			vi.advanceTimersByTime(50);

			cleanup();
		});
	});

	describe('variants', () => {
		it('should resolve variant names', () => {
			const variants = {
				hidden: { opacity: 0, x: -100 },
				visible: { opacity: 1, x: 0 }
			};

			const cleanup = motion({
				variants,
				initial: 'hidden',
				animate: 'visible'
			})(element);

			// Initial state from variant
			expect(element.style.opacity).toBe('0');
			expect(element.style.transform).toContain('translateX(-100px)');

			cleanup();
		});

		it('should support custom prop for dynamic variants', () => {
			const variants = {
				custom: (custom: number) => ({ opacity: custom })
			};

			const cleanup = motion({
				variants,
				initial: 'custom',
				custom: 0.5
			})(element);

			expect(element.style.opacity).toBe('0.5');

			cleanup();
		});
	});

	describe('gesture: whileHover', () => {
		it('should animate on pointer enter', async () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();

			const cleanup = motion({
				animate: { scale: 1 },
				whileHover: { scale: 1.1 },
				onHoverStart,
				onHoverEnd
			})(element);

			// Trigger hover
			element.dispatchEvent(new PointerEvent('pointerenter'));
			await vi.advanceTimersByTimeAsync(50);

			expect(onHoverStart).toHaveBeenCalled();

			// End hover
			element.dispatchEvent(new PointerEvent('pointerleave'));
			await vi.advanceTimersByTimeAsync(50);

			expect(onHoverEnd).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('gesture: whileTap', () => {
		it('should animate on pointer down/up', async () => {
			const onTapStart = vi.fn();
			const onTap = vi.fn();

			const cleanup = motion({
				animate: { scale: 1 },
				whileTap: { scale: 0.95 },
				onTapStart,
				onTap
			})(element);

			// Mock getBoundingClientRect
			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				right: 100,
				top: 0,
				bottom: 100
			});

			// Trigger tap start
			element.dispatchEvent(new PointerEvent('pointerdown'));
			await vi.advanceTimersByTimeAsync(50);

			expect(onTapStart).toHaveBeenCalled();

			// Trigger tap end (inside element)
			window.dispatchEvent(
				new PointerEvent('pointerup', {
					clientX: 50,
					clientY: 50
				})
			);
			await vi.advanceTimersByTimeAsync(50);

			expect(onTap).toHaveBeenCalled();

			cleanup();
		});

		it('should call onTapCancel when released outside', async () => {
			const onTapCancel = vi.fn();

			const cleanup = motion({
				whileTap: { scale: 0.95 },
				onTapCancel
			})(element);

			element.getBoundingClientRect = vi.fn().mockReturnValue({
				left: 0,
				right: 100,
				top: 0,
				bottom: 100
			});

			element.dispatchEvent(new PointerEvent('pointerdown'));
			await vi.advanceTimersByTimeAsync(50);

			// Release outside element
			window.dispatchEvent(
				new PointerEvent('pointerup', {
					clientX: 200,
					clientY: 200
				})
			);
			await vi.advanceTimersByTimeAsync(50);

			expect(onTapCancel).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('gesture: whileFocus', () => {
		it('should animate on focus/blur', async () => {
			const onFocusStart = vi.fn();
			const onFocusEnd = vi.fn();

			const cleanup = motion({
				whileFocus: { scale: 1.02 },
				onFocusStart,
				onFocusEnd
			})(element);

			// Element should be focusable
			expect(element.hasAttribute('tabindex')).toBe(true);

			// Trigger focus
			element.dispatchEvent(new FocusEvent('focus'));
			await vi.advanceTimersByTimeAsync(50);

			expect(onFocusStart).toHaveBeenCalled();

			// Trigger blur
			element.dispatchEvent(new FocusEvent('blur'));
			await vi.advanceTimersByTimeAsync(50);

			expect(onFocusEnd).toHaveBeenCalled();

			cleanup();
		});
	});

	describe('gesture: whileInView', () => {
		it('should setup IntersectionObserver', () => {
			const mockObserve = vi.fn();
			const mockDisconnect = vi.fn();

			vi.stubGlobal(
				'IntersectionObserver',
				vi.fn().mockImplementation(() => ({
					observe: mockObserve,
					disconnect: mockDisconnect,
					unobserve: vi.fn()
				}))
			);

			const cleanup = motion({
				whileInView: { opacity: 1 },
				viewport: { once: true }
			})(element);

			expect(mockObserve).toHaveBeenCalledWith(element);

			cleanup();

			expect(mockDisconnect).toHaveBeenCalled();

			vi.unstubAllGlobals();
		});

		it('should call viewport callbacks', () => {
			const onViewportEnter = vi.fn();
			const onViewportLeave = vi.fn();
			let observerCallback: (entries: IntersectionObserverEntry[]) => void;

			vi.stubGlobal(
				'IntersectionObserver',
				vi.fn().mockImplementation((callback) => {
					observerCallback = callback;
					return {
						observe: vi.fn(),
						disconnect: vi.fn(),
						unobserve: vi.fn()
					};
				})
			);

			const cleanup = motion({
				whileInView: { opacity: 1 },
				onViewportEnter,
				onViewportLeave
			})(element);

			// Simulate entering viewport
			observerCallback!([{ isIntersecting: true, target: element } as IntersectionObserverEntry]);
			expect(onViewportEnter).toHaveBeenCalled();

			// Simulate leaving viewport
			observerCallback!([{ isIntersecting: false, target: element } as IntersectionObserverEntry]);
			expect(onViewportLeave).toHaveBeenCalled();

			cleanup();
			vi.unstubAllGlobals();
		});
	});

	describe('cleanup', () => {
		it('should stop all animations on cleanup', async () => {
			const cleanup = motion({
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { type: 'tween', duration: 1 }
			})(element);

			await vi.advanceTimersByTimeAsync(50);

			// Cleanup while animation is running
			cleanup();

			// Should not throw or continue animating
			await vi.advanceTimersByTimeAsync(100);
		});

		it('should remove event listeners on cleanup', () => {
			const removeEventListener = vi.spyOn(element, 'removeEventListener');

			const cleanup = motion({
				whileHover: { scale: 1.1 },
				whileTap: { scale: 0.95 },
				whileFocus: { scale: 1.02 }
			})(element);

			cleanup();

			expect(removeEventListener).toHaveBeenCalled();
		});
	});
});

describe('createMotion', () => {
	it('should be defined', () => {
		expect(createMotion).toBeDefined();
		expect(typeof createMotion).toBe('function');
	});

	it('should return an attachment function', () => {
		const attachment = createMotion(() => ({
			animate: { opacity: 1 }
		}));

		expect(typeof attachment).toBe('function');
	});
});
