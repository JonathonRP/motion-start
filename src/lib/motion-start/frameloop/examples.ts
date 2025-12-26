/**
 * Frameloop Usage Examples
 *
 * This file demonstrates common patterns and use cases for the frameloop system.
 * These examples can be used as reference for implementing animations and
 * coordinating DOM updates.
 */

import { frame, cancelFrame, frameData } from './index.js';
import { time } from './sync-time.js';
import { microtask } from './microtask.js';
import type { Process } from './types.js';

/**
 * Example 1: Simple one-time animation update
 */
export function simpleAnimationExample() {
	frame.render((data) => {
		console.log('Rendering at timestamp:', data.timestamp);
		console.log('Time since last frame:', data.delta, 'ms');
	});
}

/**
 * Example 2: Persistent animation with keepAlive
 */
export function persistentAnimationExample(element: HTMLElement) {
	let position = 0;
	const velocity = 100; // pixels per second
	const target = 500;

	const animationCallback: Process = (data) => {
		// Update position based on time delta
		position += velocity * (data.delta / 1000);

		// Apply to DOM
		element.style.transform = `translateX(${position}px)`;

		// Stop when target is reached
		if (position >= target) {
			cancelFrame(animationCallback);
			console.log('Animation complete!');
		}
	};

	// Schedule with keepAlive = true to run every frame
	frame.update(animationCallback, true);
}

/**
 * Example 3: Batching DOM reads and writes
 * This prevents layout thrashing by separating reads from writes
 */
export function batchedDOMExample(element: HTMLElement) {
	// First, read from the DOM
	frame.read(() => {
		const height = element.offsetHeight;
		const width = element.offsetWidth;

		// Then, write to the DOM in the render step
		frame.render(() => {
			element.style.height = `${height * 2}px`;
			element.style.width = `${width * 2}px`;
		});
	});
}

/**
 * Example 4: Using synchronized time
 * Ensures all animations started in the same frame use the same timestamp
 */
export function synchronizedTimeExample() {
	const t1 = time.now();

	// Do some work...
	for (let i = 0; i < 1000; i++) {
		Math.random();
	}

	const t2 = time.now();

	// Within the same synchronous context, both calls return the same time
	console.log('Time difference:', t2 - t1); // Should be 0
}

/**
 * Example 5: Using microtask batching
 * Useful for batching state updates before the next frame
 */
export function microtaskBatchingExample() {
	const updates: Array<() => void> = [];

	// Schedule multiple updates
	for (let i = 0; i < 10; i++) {
		microtask.update(() => {
			console.log(`Update ${i}`);
		});
	}

	// All updates will run in a single microtask before the next frame
}

/**
 * Example 6: Multi-step animation pipeline
 * Shows how to use different steps for different operations
 */
export function multiStepPipelineExample(element: HTMLElement) {
	let scrollY = 0;

	frame.read(() => {
		// 1. Read scroll position
		scrollY = window.scrollY;

		frame.update(() => {
			// 2. Calculate new transform
			const scale = 1 + scrollY / 1000;

			frame.preRender(() => {
				// 3. Prepare will-change
				element.style.willChange = 'transform';

				frame.render(() => {
					// 4. Apply transform
					element.style.transform = `scale(${scale})`;

					frame.postRender(() => {
						// 5. Clean up will-change
						element.style.willChange = 'auto';
					});
				});
			});
		});
	});
}

/**
 * Example 7: Immediate scheduling during processing
 * Adds a callback to the current frame if already processing
 */
export function immediateSchedulingExample() {
	frame.render((data) => {
		console.log('First callback');

		// This will run in the same frame because immediate = true
		frame.render(
			() => {
				console.log('Second callback (same frame)');
			},
			false,
			true
		); // immediate = true
	});
}

/**
 * Example 8: Canceling a scheduled callback
 */
export function cancelExample() {
	const callback: Process = (data) => {
		console.log('This might not run');
	};

	// Schedule the callback
	frame.render(callback);

	// Cancel it before it runs
	cancelFrame(callback);
}

/**
 * Example 9: Access frame data directly
 */
export function frameDataExample() {
	console.log('Current frame delta:', frameData.delta);
	console.log('Current frame timestamp:', frameData.timestamp);
	console.log('Is processing?', frameData.isProcessing);
}

/**
 * Example 10: Complex animation with multiple elements
 */
export function complexAnimationExample(elements: HTMLElement[]) {
	let animationProgress = 0;
	const duration = 2000; // 2 seconds
	const startTime = performance.now();

	const animationLoop: Process = (data) => {
		const elapsed = data.timestamp - startTime;
		animationProgress = Math.min(elapsed / duration, 1);

		// Update all elements
		elements.forEach((element, index) => {
			const delay = index * 0.1;
			const elementProgress = Math.max(0, Math.min((animationProgress - delay) / (1 - delay), 1));

			// Ease out cubic
			const eased = 1 - Math.pow(1 - elementProgress, 3);

			element.style.transform = `translateY(${eased * 100}px)`;
			element.style.opacity = String(eased);
		});

		// Continue animation if not complete
		if (animationProgress < 1) {
			frame.render(animationLoop, true);
		}
	};

	// Start the animation
	frame.render(animationLoop, true);
}
