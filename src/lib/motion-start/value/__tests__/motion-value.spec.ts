/**
 * Based on framer-motion tests
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { motionValue, MotionValue } from '../index';
import { frame } from '../../frameloop';

describe('MotionValue', () => {
	test('can create a motion value', () => {
		const value = motionValue(0);
		expect(value).toBeInstanceOf(MotionValue);
		expect(value.get()).toBe(0);
	});

	test('can set and get value', () => {
		const value = motionValue(0);
		value.set(10);
		expect(value.get()).toBe(10);
	});

	test('can get previous value', () => {
		const value = motionValue(0);
		value.set(10);
		value.set(20);
		expect(value.getPrevious()).toBe(10);
	});

	test('fires change event on value change', () => {
		const value = motionValue(0);
		const callback = vi.fn();

		value.on('change', callback);
		value.set(10);

		// The callback receives the value and potentially other args from SubscriptionManager
		expect(callback).toHaveBeenCalled();
		expect(callback.mock.calls[0][0]).toBe(10);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	test('does not fire change event when value is same', () => {
		const value = motionValue(0);
		const callback = vi.fn();

		value.on('change', callback);
		value.set(0);

		expect(callback).not.toHaveBeenCalled();
	});

	test('can unsubscribe from change event', () => {
		const value = motionValue(0);
		const callback = vi.fn();

		const unsubscribe = value.on('change', callback);
		value.set(10);
		expect(callback).toHaveBeenCalledTimes(1);

		unsubscribe();
		value.set(20);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	test('jump sets value without animation', () => {
		const value = motionValue(0);
		value.jump(100);
		expect(value.get()).toBe(100);
		expect(value.getPrevious()).toBe(100);
	});

	test('returns velocity of 0 for non-numerical values', () => {
		const value = motionValue('test');
		expect(value.getVelocity()).toBe(0);
	});

	test('isAnimating returns false when not animating', () => {
		const value = motionValue(0);
		expect(value.isAnimating()).toBe(false);
	});

	test('destroy clears all listeners', () => {
		const value = motionValue(0);
		const callback = vi.fn();

		value.on('change', callback);
		value.destroy();
		value.set(10);

		expect(callback).not.toHaveBeenCalled();
	});
});

describe('resolveMotionValue', () => {
	test('returns the unwrapped value from a MotionValue', () => {
		const mv = motionValue(42);
		expect(mv.get()).toBe(42);
	});

	test('handles string values', () => {
		const mv = motionValue('test');
		expect(mv.get()).toBe('test');
	});

	test('handles object values', () => {
		const obj = { test: 'value' };
		const mv = motionValue(obj);
		expect(mv.get()).toBe(obj);
	});
});
