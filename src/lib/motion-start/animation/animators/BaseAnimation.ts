/**
 * Base Animation Class
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Abstract base class for all animation implementations.
 * Provides core lifecycle management, promise handling, and timing coordination.
 */

import type { AnimationPlaybackControls } from '../animate/index.js';

/**
 * Animation state enum
 */
export enum AnimationState {
	Idle = 'idle',
	Playing = 'playing',
	Paused = 'paused',
	Finished = 'finished',
	Cancelled = 'cancelled',
}

/**
 * Base animation options
 */
export interface BaseAnimationOptions<V = any> {
	/**
	 * Whether to automatically start the animation
	 * @default true
	 */
	autoplay?: boolean;

	/**
	 * Delay before starting the animation (ms)
	 * @default 0
	 */
	delay?: number;

	/**
	 * Number of times to repeat the animation
	 * @default 0
	 */
	repeat?: number;

	/**
	 * How to repeat: 'loop', 'reverse', or 'mirror'
	 * @default 'loop'
	 */
	repeatType?: 'loop' | 'reverse' | 'mirror';

	/**
	 * Delay between repetitions (ms)
	 * @default 0
	 */
	repeatDelay?: number;

	/**
	 * Callback when animation updates
	 */
	onUpdate?: (latest: V) => void;

	/**
	 * Callback when animation starts playing
	 */
	onPlay?: () => void;

	/**
	 * Callback when animation completes
	 */
	onComplete?: () => void;

	/**
	 * Callback when animation repeats
	 */
	onRepeat?: () => void;

	/**
	 * Callback when animation is stopped
	 */
	onStop?: () => void;
}

/**
 * Resolved animation data - used after keyframes are resolved
 */
export interface ResolvedAnimationData<V = any> {
	/**
	 * Whether this animation can proceed
	 */
	canAnimate: boolean;

	/**
	 * Resolved keyframes
	 */
	keyframes: V[];
}

/**
 * Abstract base class for all animations
 *
 * Provides:
 * - Promise-based completion tracking
 * - Lifecycle callbacks
 * - Timing and delay management
 * - Repeat logic coordination
 * - State management
 *
 * Subclasses must implement:
 * - play(), pause(), stop(), cancel(), complete()
 * - Getters/setters for: speed, time, duration, state
 */
export abstract class BaseAnimation<
	V = any,
	ResolvedData extends ResolvedAnimationData<V> = ResolvedAnimationData<V>
> implements AnimationPlaybackControls
{
	/**
	 * Animation options with defaults applied
	 */
	protected options: BaseAnimationOptions<V>;

	/**
	 * Promise resolve function for completion
	 */
	protected resolveFinishedPromise?: () => void;

	/**
	 * Current finished promise
	 */
	protected currentFinishedPromise?: Promise<void>;

	/**
	 * Whether keyframes have been resolved
	 */
	protected hasResolvedKeyframes = false;

	/**
	 * Resolved animation data
	 */
	protected resolvedData?: ResolvedData;

	/**
	 * Timestamp when animation was created
	 */
	protected readonly createdAt: number;

	/**
	 * Timestamp when keyframes were resolved
	 */
	protected resolvedAt?: number;

	constructor(options: BaseAnimationOptions<V> = {}) {
		// Apply default options
		this.options = {
			autoplay: true,
			delay: 0,
			repeat: 0,
			repeatType: 'loop',
			repeatDelay: 0,
			...options,
		};

		this.createdAt = performance.now();
		this.makeFinishedPromise();
	}

	/**
	 * Create a new finished promise
	 */
	protected makeFinishedPromise(): void {
		this.currentFinishedPromise = new Promise((resolve) => {
			this.resolveFinishedPromise = resolve;
		});
	}

	/**
	 * Calculate the start time for the animation
	 *
	 * Prefers using the creation time unless there's a significant delay (>40ms)
	 * This helps with timing consistency for quickly-started animations
	 */
	protected calcStartTime(): number {
		const now = performance.now();
		const delay = this.options.delay ?? 0;

		if (!this.resolvedAt) {
			// Keyframes not resolved yet
			return now + delay;
		}

		// If resolved quickly (< 40ms), use creation time for better consistency
		const resolveDelay = this.resolvedAt - this.createdAt;
		if (resolveDelay < 40) {
			return this.createdAt + delay;
		}

		// Otherwise use current time
		return now + delay;
	}

	/**
	 * Called when keyframes are resolved
	 *
	 * @param data - Resolved animation data
	 */
	protected onKeyframesResolved(data: ResolvedData): void {
		this.resolvedAt = performance.now();
		this.resolvedData = data;
		this.hasResolvedKeyframes = true;

		// If the animation can't proceed, complete immediately
		if (!data.canAnimate) {
			this.complete();
			return;
		}

		// Start if autoplay is enabled
		if (this.options.autoplay) {
			this.play();
		}
	}

	/**
	 * Get resolved data, ensuring keyframes are resolved first
	 *
	 * NOTE: This will synchronously flush any pending keyframe resolvers
	 * This is a performance trade-off for API simplicity
	 */
	protected get resolved(): ResolvedData {
		if (!this.resolvedData) {
			throw new Error('Animation data not yet resolved');
		}
		return this.resolvedData;
	}

	/**
	 * Trigger onUpdate callback
	 */
	protected notifyUpdate(value: V): void {
		this.options.onUpdate?.(value);
	}

	/**
	 * Trigger onPlay callback
	 */
	protected notifyPlay(): void {
		this.options.onPlay?.();
	}

	/**
	 * Trigger onComplete callback
	 */
	protected notifyComplete(): void {
		this.options.onComplete?.();
		this.resolveFinishedPromise?.();
	}

	/**
	 * Trigger onRepeat callback
	 */
	protected notifyRepeat(): void {
		this.options.onRepeat?.();
	}

	/**
	 * Trigger onStop callback
	 */
	protected notifyStop(): void {
		this.options.onStop?.();
		this.resolveFinishedPromise?.();
	}

	// ==========================================
	// Abstract methods - must be implemented by subclasses
	// ==========================================

	/**
	 * Start or resume the animation
	 */
	abstract play(): void;

	/**
	 * Pause the animation
	 */
	abstract pause(): void;

	/**
	 * Stop the animation and reset
	 */
	abstract stop(): void;

	/**
	 * Cancel the animation without triggering callbacks
	 */
	abstract cancel(): void;

	/**
	 * Complete the animation immediately
	 */
	abstract complete(): void;

	/**
	 * Get current playback speed
	 */
	abstract get speed(): number;

	/**
	 * Set playback speed
	 */
	abstract set speed(value: number);

	/**
	 * Get current animation time (ms)
	 */
	abstract get time(): number;

	/**
	 * Set animation time (ms) - scrub to specific point
	 */
	abstract set time(value: number);

	/**
	 * Get total duration (ms)
	 */
	abstract get duration(): number;

	/**
	 * Get current animation state
	 */
	abstract get state(): AnimationState;

	// ==========================================
	// Promise interface for AnimationPlaybackControls
	// ==========================================

	/**
	 * Allows using animation as a promise
	 * Resolves when animation completes or is stopped
	 */
	then(onResolve?: VoidFunction, onReject?: VoidFunction): Promise<void> {
		return this.currentFinishedPromise!.then(onResolve, onReject);
	}
}
