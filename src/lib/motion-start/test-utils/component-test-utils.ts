/**
 * Test utilities for component and integration testing
 */

import { tick } from 'svelte';
import type { MotionValue } from '../value/index';

/**
 * Wait for next Svelte tick (reactive updates)
 */
export async function nextTick(): Promise<void> {
	await tick();
}

/**
 * Wait for multiple ticks (for multi-step reactive updates)
 */
export async function waitTicks(count = 1): Promise<void> {
	for (let i = 0; i < count; i++) {
		await tick();
	}
}

/**
 * Wait for animation frame
 */
export function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Wait for multiple animation frames
 */
export async function waitFrames(count = 1): Promise<void> {
	for (let i = 0; i < count; i++) {
		await nextFrame();
	}
}

/**
 * Wait for animation to complete (polls MotionValue.isAnimating)
 */
export async function waitForAnimation(
	motionValue: MotionValue,
	timeout = 5000
): Promise<void> {
	const startTime = Date.now();

	while (motionValue.isAnimating()) {
		if (Date.now() - startTime > timeout) {
			throw new Error('Animation timeout');
		}
		await nextFrame();
	}
}

/**
 * Wait for condition to be true
 */
export async function waitFor(
	condition: () => boolean,
	timeout = 5000
): Promise<void> {
	const startTime = Date.now();

	while (!condition()) {
		if (Date.now() - startTime > timeout) {
			throw new Error('Condition timeout');
		}
		await nextFrame();
	}
}

/**
 * Simulate passage of time for testing
 */
export async function advanceTime(ms: number): Promise<void> {
	const frames = Math.ceil(ms / 16); // ~60fps
	await waitFrames(frames);
}

/**
 * Create mock DOMRect for testing
 */
export function createMockDOMRect(
	x = 0,
	y = 0,
	width = 100,
	height = 100
): DOMRect {
	return {
		x,
		y,
		width,
		height,
		top: y,
		right: x + width,
		bottom: y + height,
		left: x,
		toJSON: () => ({ x, y, width, height, top: y, right: x + width, bottom: y + height, left: x })
	};
}

/**
 * Mock element.getBoundingClientRect()
 */
export function mockGetBoundingClientRect(
	element: HTMLElement,
	rect: DOMRect
): void {
	element.getBoundingClientRect = () => rect;
}

/**
 * Create test container and mount point
 */
export function createTestContainer(): HTMLDivElement {
	const container = document.createElement('div');
	container.setAttribute('data-testid', 'test-container');
	document.body.appendChild(container);
	return container;
}

/**
 * Cleanup test container
 */
export function cleanupTestContainer(container: HTMLDivElement): void {
	document.body.removeChild(container);
}

/**
 * Spy on function calls (simple vitest-compatible spy)
 */
export function createSpy<T extends (...args: any[]) => any>(): {
	fn: T;
	calls: Array<Parameters<T>>;
	callCount: number;
	reset: () => void;
} {
	const calls: Array<Parameters<T>> = [];

	const fn = ((...args: Parameters<T>) => {
		calls.push(args);
	}) as T;

	return {
		fn,
		calls,
		get callCount() {
			return calls.length;
		},
		reset() {
			calls.length = 0;
		}
	};
}
