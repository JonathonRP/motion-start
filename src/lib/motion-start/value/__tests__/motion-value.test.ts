/**
 * MotionValue unit tests
 * Based on framer-motion@11.11.11
 */

import { describe, it, expect, vi } from 'vitest';
import { motionValue } from '../index.js';

describe('MotionValue', () => {
	describe('creation', () => {
		it('should create a motion value with initial value', () => {
			const value = motionValue(5);
			expect(value.get()).toBe(5);
		});

		it('should create a motion value with string value', () => {
			const value = motionValue('test');
			expect(value.get()).toBe('test');
		});

		it('should create a motion value with object value', () => {
			const obj = { x: 100 };
			const value = motionValue(obj);
			expect(value.get()).toEqual(obj);
		});
	});

	describe('get/set', () => {
		it('should get current value', () => {
			const value = motionValue(10);
			expect(value.get()).toBe(10);
		});

		it('should set new value', () => {
			const value = motionValue(10);
			value.set(20);
			expect(value.get()).toBe(20);
		});

		it('should update value multiple times', () => {
			const value = motionValue(0);
			value.set(10);
			expect(value.get()).toBe(10);
			value.set(20);
			expect(value.get()).toBe(20);
			value.set(30);
			expect(value.get()).toBe(30);
		});
	});

	describe('subscriptions', () => {
		it('should notify subscribers on value change', () => {
			const value = motionValue(0);
			const callback = vi.fn();

			value.onChange(callback);
			value.set(10);

			expect(callback).toHaveBeenCalled();
			expect(callback.mock.calls[0][0]).toBe(10); // First arg is new value
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should notify multiple subscribers', () => {
			const value = motionValue(0);
			const callback1 = vi.fn();
			const callback2 = vi.fn();

			value.onChange(callback1);
			value.onChange(callback2);
			value.set(10);

			expect(callback1).toHaveBeenCalled();
			expect(callback2).toHaveBeenCalled();
			expect(callback1.mock.calls[0][0]).toBe(10);
			expect(callback2.mock.calls[0][0]).toBe(10);
		});

		it('should allow unsubscribing', () => {
			const value = motionValue(0);
			const callback = vi.fn();

			const unsubscribe = value.onChange(callback);
			value.set(10);
			expect(callback).toHaveBeenCalledTimes(1);

			unsubscribe();
			value.set(20);
			expect(callback).toHaveBeenCalledTimes(1); // Should not be called again
		});

		it('should work with subscribe (Svelte store compatible)', () => {
			const value = motionValue(0);
			const callback = vi.fn();

			// @ts-expect-error - subscribe has special 'this' binding for Svelte
			const unsubscribe = value.subscribe(callback);
			value.set(10);

			expect(callback).toHaveBeenCalled();
			expect(callback.mock.calls[0][0]).toBe(10);

			unsubscribe();
		});
	});

	describe('velocity tracking', () => {
		it('should track velocity', () => {
			const value = motionValue(0);
			value.set(10);

			// Velocity should be tracked
			const velocity = value.getVelocity();
			expect(typeof velocity).toBe('number');
		});

		it('should update velocity on rapid changes', () => {
			const value = motionValue(0);
			value.set(10);
			value.set(20);
			value.set(30);

			const velocity = value.getVelocity();
			expect(typeof velocity).toBe('number');
		});
	});

	describe('render subscriptions', () => {
		it('should notify render subscribers', () => {
			const value = motionValue(0);
			const callback = vi.fn();

			// Render subscribers are internal, onChange is the public API
			value.onChange(callback);
			value.set(10);

			expect(callback).toHaveBeenCalled();
		});
	});

	describe('destroy', () => {
		it('should clean up on destroy', () => {
			const value = motionValue(0);
			const callback = vi.fn();

			value.onChange(callback);
			value.destroy();
			value.set(10);

			// Callback should not be called after destroy
			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe('isAnimating', () => {
		it('should report animation state', () => {
			const value = motionValue(0);

			// Not animating initially
			expect(value.isAnimating()).toBe(false);
		});
	});

	describe('stop', () => {
		it('should have a stop method', () => {
			const value = motionValue(0);
			expect(typeof value.stop).toBe('function');

			// Should be callable
			value.stop();
		});
	});

	describe('value types', () => {
		it('should handle number values', () => {
			const value = motionValue(42);
			expect(value.get()).toBe(42);
			value.set(100);
			expect(value.get()).toBe(100);
		});

		it('should handle string values', () => {
			const value = motionValue('hello');
			expect(value.get()).toBe('hello');
			value.set('world');
			expect(value.get()).toBe('world');
		});

		it('should handle complex string values (CSS)', () => {
			const value = motionValue('rgb(255, 0, 0)');
			expect(value.get()).toBe('rgb(255, 0, 0)');
			value.set('rgb(0, 255, 0)');
			expect(value.get()).toBe('rgb(0, 255, 0)');
		});

		it('should handle array values', () => {
			const value = motionValue([1, 2, 3]);
			expect(value.get()).toEqual([1, 2, 3]);
			value.set([4, 5, 6]);
			expect(value.get()).toEqual([4, 5, 6]);
		});
	});
});
