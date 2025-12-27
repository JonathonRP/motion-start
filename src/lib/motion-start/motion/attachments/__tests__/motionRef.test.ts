/**
 * Tests for motionRef attachment (Svelte 5 {@attach} pattern)
 */

import { describe, it, expect, vi } from 'vitest';
import { motionRef, createMotionRef } from '../motionRef';
import type { VisualElement } from '../../../render/types';

describe('motionRef attachment', () => {
	it('should return an attachment function', () => {
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		const attachment = motionRef(visualElement);

		expect(typeof attachment).toBe('function');
	});

	it('should mount visual element when attachment is called', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		const attachment = motionRef(visualElement);
		attachment(element);

		expect(visualElement.mount).toHaveBeenCalledWith(element);
	});

	it('should return cleanup function that unmounts', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		const attachment = motionRef(visualElement);
		const cleanup = attachment(element);

		expect(typeof cleanup).toBe('function');
		cleanup?.();

		expect(visualElement.unmount).toHaveBeenCalled();
	});

	it('should call external ref if provided', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;
		const externalRef = vi.fn();

		const attachment = motionRef(visualElement, { externalRef });
		attachment(element);

		expect(externalRef).toHaveBeenCalledWith(element);
	});

	it('should handle external ref being null', () => {
		const element = document.createElement('div');
		const visualElement = {
			mount: vi.fn(),
			unmount: vi.fn(),
		} as unknown as VisualElement;

		expect(() => {
			const attachment = motionRef(visualElement, { externalRef: null });
			attachment(element);
		}).not.toThrow();
	});

	describe('createMotionRef', () => {
		it('should create a factory function', () => {
			const createRef = createMotionRef();

			expect(typeof createRef).toBe('function');
		});

		it('should create attachments with factory', () => {
			const element = document.createElement('div');
			const visualElement = {
				mount: vi.fn(),
				unmount: vi.fn(),
			} as unknown as VisualElement;

			const createRef = createMotionRef();
			const attachment = createRef(visualElement);
			const cleanup = attachment(element);

			expect(visualElement.mount).toHaveBeenCalledWith(element);

			cleanup?.();
			expect(visualElement.unmount).toHaveBeenCalled();
		});

		it('should create attachments with shared options', () => {
			const element = document.createElement('div');
			const visualElement = {
				mount: vi.fn(),
				unmount: vi.fn(),
			} as unknown as VisualElement;
			const externalRef = vi.fn();

			const createRef = createMotionRef({ externalRef });
			const attachment = createRef(visualElement);
			attachment(element);

			expect(externalRef).toHaveBeenCalledWith(element);
		});
	});
});
