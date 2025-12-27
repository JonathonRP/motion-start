/**
 * Tests for motionRef attachment
 */

import { describe, it, expect, vi } from 'vitest';
import { motionRef, createMotionRef } from '../motionRef';
import type { VisualElement } from '../../../render/types';

describe('motionRef attachment', () => {
	it('should mount visual element to DOM node', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		motionRef(element, visualElement);

		expect(visualElement.mount).toHaveBeenCalledWith(element);
	});

	it('should return cleanup function that unmounts', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		const cleanup = motionRef(element, visualElement);
		cleanup();

		expect(visualElement.unmount).toHaveBeenCalled();
	});

	it('should call external ref if provided', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;
		const externalRef = vi.fn();

		motionRef(element, visualElement, { externalRef });

		expect(externalRef).toHaveBeenCalledWith(element);
	});

	it('should handle external ref being null', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		expect(() => {
			motionRef(element, visualElement, { externalRef: null });
		}).not.toThrow();
	});

	describe('createMotionRef', () => {
		it('should create a bound attachment function', () => {
			const element = document.createElement('div');
			const visualElement = {
				mount: vi.fn(),
				unmount: vi.fn(),
			} as unknown as VisualElement;

			const attachMotion = createMotionRef(visualElement);
			const cleanup = attachMotion(element);

			expect(visualElement.mount).toHaveBeenCalledWith(element);

			cleanup();
			expect(visualElement.unmount).toHaveBeenCalled();
		});

		it('should create a bound attachment with options', () => {
			const element = document.createElement('div');
			const visualElement = {
				mount: vi.fn(),
				unmount: vi.fn(),
			} as unknown as VisualElement;
			const externalRef = vi.fn();

			const attachMotion = createMotionRef(visualElement, { externalRef });
			attachMotion(element);

			expect(externalRef).toHaveBeenCalledWith(element);
		});
	});
});
