/**
 * Tests for measurePop attachment
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { measurePop, createMeasurePop } from '../measurePop';

describe('measurePop attachment', () => {
	let container: HTMLElement;
	let child: HTMLElement;

	beforeEach(() => {
		container = document.createElement('div');
		child = document.createElement('div');
		child.style.width = '100px';
		child.style.height = '100px';
		container.appendChild(child);
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it('should return cleanup and update functions', () => {
		const { cleanup, update } = measurePop(container, { isPresent: true });

		expect(typeof cleanup).toBe('function');
		expect(typeof update).toBe('function');
	});

	it('should not apply styles when present', () => {
		measurePop(container, { isPresent: true });

		expect(child.dataset.motionPopId).toBeUndefined();
	});

	it('should apply exit styles when not present', () => {
		const { update } = measurePop(container, { isPresent: true });

		// Transition from present to not present
		update({ isPresent: false });

		// Check that child has pop ID
		expect(child.dataset.motionPopId).toBeDefined();
	});

	it('should clean up styles on cleanup', () => {
		const { update, cleanup } = measurePop(container, { isPresent: true });

		update({ isPresent: false });
		const popId = child.dataset.motionPopId;

		cleanup();

		expect(child.dataset.motionPopId).toBeUndefined();
	});

	it('should support CSP nonce', () => {
		const { update } = measurePop(container, {
			isPresent: true,
			nonce: 'test-nonce',
		});

		update({ isPresent: false });

		// Find the injected style element
		const styles = document.head.querySelectorAll('style');
		const popStyle = Array.from(styles).find((style) =>
			style.innerHTML.includes('data-motion-pop-id')
		);

		expect(popStyle?.nonce).toBe('test-nonce');

		// Cleanup
		measurePop(container, { isPresent: true }).cleanup();
	});

	describe('createMeasurePop', () => {
		it('should create a bound attachment with nonce', () => {
			const attachMeasurePop = createMeasurePop('bound-nonce');
			const { update } = attachMeasurePop(container, { isPresent: true });

			update({ isPresent: false });

			const styles = document.head.querySelectorAll('style');
			const popStyle = Array.from(styles).find((style) =>
				style.innerHTML.includes('data-motion-pop-id')
			);

			expect(popStyle?.nonce).toBe('bound-nonce');

			// Cleanup
			measurePop(container, { isPresent: true }).cleanup();
		});
	});
});
