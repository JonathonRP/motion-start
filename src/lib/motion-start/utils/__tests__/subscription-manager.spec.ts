/**
 * Based on framer-motion@11.11.11
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect, vi } from 'vitest';
import { SubscriptionManager } from '../subscription-manager';

describe('SubscriptionManager', () => {
	test('Adds a subscription', () => {
		const manager = new SubscriptionManager();
		const callback = vi.fn();
		manager.add(callback);
		manager.notify(2);
		expect(callback).toBeCalledTimes(1);
		expect(callback).toBeCalledWith(2, undefined, undefined);
	});

	test('Removes a subscription', () => {
		const manager = new SubscriptionManager();
		const callback = vi.fn();
		const remove = manager.add(callback);
		remove();
		manager.notify(2);
		expect(callback).toBeCalledTimes(0);
	});

	test('Clears all subscription', () => {
		const manager = new SubscriptionManager();
		const callback = vi.fn();
		manager.add(callback);
		manager.clear();
		manager.notify(2);
		expect(callback).toBeCalledTimes(0);
	});
});
