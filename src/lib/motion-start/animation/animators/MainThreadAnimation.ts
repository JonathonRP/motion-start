/**
 * Main Thread Animation
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * JavaScript-based animation implementation that runs on the main thread.
 * Uses the frameloop for scheduling and supports various animation types:
 * - Keyframes (with easing)
 * - Spring physics
 * - Inertia/decay
 * - Custom generators
 */

// Removed popmotion import - using internal generators
// Using internal types
import { spring } from '../generators/spring/index.js';
import { inertia } from '../generators/inertia.js';
import {
	BaseAnimation,
	AnimationState,
	type BaseAnimationOptions,
	type ResolvedAnimationData,
} from './BaseAnimation.js';
import { frameloopDriver, type Driver, type DriverUpdateCallback } from './drivers/driver-frameloop.js';
import { interpolateKeyframes } from './utils/interpolate.js';
import {
	calcElapsedTime,
	calcProgress,
	calcIteration,
	calcIterationProgress,
	applyRepeatType,
} from './utils/elapsed.js';
import type { Easing } from '../../types.js';
import { easingDefinitionToFunction } from '../utils/easing.js';

/**
 * Animation type
 */
export type AnimationType = 'keyframes' | 'spring' | 'inertia' | 'decay';

/**
 * Main thread animation options
 */
export interface MainThreadAnimationOptions<V = any> extends BaseAnimationOptions<V> {
	/**
	 * Animation type
	 * @default 'keyframes'
	 */
	type?: AnimationType;

	/**
	 * Duration in milliseconds (for keyframes)
	 * @default 300
	 */
	duration?: number;

	/**
	 * Easing function(s)
	 */
	ease?: Easing | Easing[];

	/**
	 * Custom offset values (0-1) for keyframes
	 */
	offset?: number[];

	/**
	 * Spring stiffness (for spring animations)
	 * @default 100
	 */
	stiffness?: number;

	/**
	 * Spring damping (for spring animations)
	 * @default 10
	 */
	damping?: number;

	/**
	 * Spring mass (for spring animations)
	 * @default 1
	 */
	mass?: number;

	/**
	 * Initial velocity (for spring/inertia)
	 * @default 0
	 */
	velocity?: number;

	/**
	 * Power for inertia (affects deceleration rate)
	 * @default 0.8
	 */
	power?: number;

	/**
	 * Time constant for decay
	 * @default 350
	 */
	timeConstant?: number;

	/**
	 * Bounce amount for spring
	 * @default 0
	 */
	bounce?: number;

	/**
	 * Rest delta - threshold for spring settling
	 * @default 0.01
	 */
	restDelta?: number;

	/**
	 * Rest speed - velocity threshold for spring settling
	 * @default 0.01
	 */
	restSpeed?: number;
}

/**
 * Resolved data for main thread animations
 */
export interface MainThreadResolvedData<V = any> extends ResolvedAnimationData<V> {
	/**
	 * Total duration in milliseconds
	 */
	duration: number;

	/**
	 * Animation type
	 */
	type: AnimationType;
}

/**
 * Animation generator - produces values over time
 */
export type AnimationGenerator<V = any> = Generator<V, void, number>;

/**
 * Main thread animation implementation
 *
 * Handles JavaScript-based animations using the frameloop system.
 * Supports keyframes, springs, and inertia with full playback controls.
 */
export class MainThreadAnimation<V = any> extends BaseAnimation<V, MainThreadResolvedData<V>> {
	/**
	 * Animation options
	 */
	protected options: MainThreadAnimationOptions<V>;

	/**
	 * Animation driver
	 */
	protected driver: Driver;

	/**
	 * Current animation state
	 */
	protected _state: AnimationState = AnimationState.Idle;

	/**
	 * Playback speed multiplier
	 */
	protected playbackSpeed = 1;

	/**
	 * Time when animation started (accounting for speed)
	 */
	protected startTime: number | null = null;

	/**
	 * Time when animation was paused
	 */
	protected holdTime: number | null = null;

	/**
	 * Current time in the animation
	 */
	protected currentTime = 0;

	/**
	 * Stop function from driver
	 */
	protected stopDriver?: () => void;

	/**
	 * Current value being animated
	 */
	protected currentValue?: V;

	/**
	 * Current iteration count
	 */
	protected currentIteration = 0;

	/**
	 * Animation generator (for spring/inertia)
	 */
	protected generator?: AnimationGenerator<V>;

	/**
	 * Interpolator function (for keyframes)
	 */
	protected interpolator?: (progress: number) => V;

	constructor(
		protected keyframes: V[],
		options: MainThreadAnimationOptions<V> = {}
	) {
		super(options);

		this.options = {
			type: 'keyframes',
			duration: 300,
			...options,
		};

		this.driver = frameloopDriver;

		// Resolve immediately for main thread animations
		this.resolveKeyframes();
	}

	/**
	 * Resolve keyframes and determine animation type
	 */
	protected resolveKeyframes(): void {
		const canAnimate = this.keyframes.length > 0;
		const type = this.options.type || 'keyframes';

		// Calculate duration based on type
		let duration = this.options.duration || 300;

		if (type === 'spring') {
			// Springs don't have a fixed duration - estimate based on stiffness/damping
			// This is used for progress calculation
			duration = this.estimateSpringDuration();
		} else if (type === 'inertia' || type === 'decay') {
			// Inertia duration depends on velocity and power
			duration = this.estimateInertiaDuration();
		}

		const resolvedData: MainThreadResolvedData<V> = {
			canAnimate,
			keyframes: this.keyframes,
			duration,
			type,
		};

		this.onKeyframesResolved(resolvedData);
	}

	/**
	 * Estimate spring animation duration
	 */
	protected estimateSpringDuration(): number {
		const stiffness = this.options.stiffness || 100;
		const damping = this.options.damping || 10;

		// Rough estimation: higher stiffness = faster, higher damping = faster settling
		const naturalFreq = Math.sqrt(stiffness);
		const dampingRatio = damping / (2 * Math.sqrt(stiffness));

		// Underdamped: oscillates before settling
		if (dampingRatio < 1) {
			return (4 / (naturalFreq * (1 - dampingRatio))) * 1000;
		}

		// Overdamped or critically damped
		return (4 / naturalFreq) * 1000;
	}

	/**
	 * Estimate inertia animation duration
	 */
	protected estimateInertiaDuration(): number {
		const velocity = Math.abs(this.options.velocity || 0);
		const power = this.options.power || 0.8;
		const timeConstant = this.options.timeConstant || 350;

		if (velocity === 0) return 0;

		// Inertia decays exponentially
		return timeConstant * (1 / power) * Math.log(velocity / 0.01);
	}

	/**
	 * Create animation generator based on type
	 */
	protected createGenerator(): AnimationGenerator<V> | null {
		const { type } = this.resolved;
		const from = this.keyframes[0];
		const to = this.keyframes[this.keyframes.length - 1];

		switch (type) {
			case 'spring':
				return this.createSpringGenerator(from, to);

			case 'inertia':
			case 'decay':
				return this.createInertiaGenerator(from);

			case 'keyframes':
			default:
				// Keyframes use interpolator, not generator
				return null;
		}
	}

	/**
	 * Create spring animation generator
	 */
	protected *createSpringGenerator(from: V, to: V): AnimationGenerator<V> {
		const options = {
			from: from as any,
			to: to as any,
			velocity: this.options.velocity as any,
			stiffness: this.options.stiffness,
			damping: this.options.damping,
			mass: this.options.mass,
			restDelta: this.options.restDelta,
			restSpeed: this.options.restSpeed,
		} as any;

		const animation = spring(options);
		let lastTime = 0;

		while (true) {
			const time: number = yield this.currentValue!;
			const delta = time - lastTime;
			lastTime = time;

			const result = animation.next(delta);

			if (result.done) {
				return;
			}

			this.currentValue = result.value as V;
		}
	}

	/**
	 * Create inertia animation generator
	 */
	protected *createInertiaGenerator(from: V): AnimationGenerator<V> {
		const options = {
			from: from as any,
			velocity: this.options.velocity as any,
			power: this.options.power,
			timeConstant: this.options.timeConstant,
			restDelta: this.options.restDelta,
		} as any;

		const animation = inertia(options);
		let lastTime = 0;

		while (true) {
			const time: number = yield this.currentValue!;
			const delta = time - lastTime;
			lastTime = time;

			const result = animation.next(delta);

			if (result.done) {
				return;
			}

			this.currentValue = result.value as V;
		}
	}

	/**
	 * Create keyframe interpolator
	 */
	protected createInterpolator(): (progress: number) => V {
		return interpolateKeyframes(
			this.keyframes,
			this.options.ease,
			this.options.offset
		);
	}

	/**
	 * Animation tick - called on each frame
	 */
	protected tick = (timestamp: number): void => {
		if (this._state !== AnimationState.Playing) {
			return;
		}

		// Initialize start time on first tick
		if (this.startTime === null) {
			this.startTime = timestamp;
		}

		// Calculate elapsed time
		const elapsed = calcElapsedTime(
			this.startTime,
			timestamp,
			this.holdTime,
			this.playbackSpeed
		);

		this.currentTime = elapsed;

		// Calculate which iteration we're in
		const { duration } = this.resolved;
		const repeatDelay = this.options.repeatDelay || 0;
		const repeat = this.options.repeat || 0;

		const iteration = calcIteration(elapsed, duration, repeatDelay);
		const iterationProgress = calcIterationProgress(elapsed, duration, repeatDelay);

		// Check if we've exceeded repeat count
		if (repeat !== Infinity && iteration > repeat) {
			this.complete();
			return;
		}

		// Trigger repeat callback if we started a new iteration
		if (iteration !== this.currentIteration && iteration > 0) {
			this.currentIteration = iteration;
			this.notifyRepeat();
		}

		// Apply repeat type transformation
		const repeatType = this.options.repeatType || 'loop';
		const progress = applyRepeatType(iterationProgress, iteration, repeatType);

		// Get value at current progress
		let value: V | undefined;

		if (this.generator) {
			// Use generator for spring/inertia
			const result = this.generator.next(elapsed);
			if (result.done) {
				this.complete();
				return;
			}
			value = result.value as V;
		} else {
			// Use interpolator for keyframes
			if (!this.interpolator) {
				this.interpolator = this.createInterpolator();
			}
			value = this.interpolator(progress);
		}

		if (value !== undefined) {
			this.currentValue = value;
			this.notifyUpdate(value);
		}

		// Check if animation is complete (for non-repeating)
		if (repeat === 0 && iterationProgress >= 1) {
			this.complete();
		}
	};

	/**
	 * Play or resume the animation
	 */
	play(): void {
		if (this._state === AnimationState.Playing) return;

		// Create generator if needed
		if (!this.generator && this.resolved.type !== 'keyframes') {
			this.generator = this.createGenerator()!;
		}

		if (this._state === AnimationState.Paused) {
			// Resume from pause
			this.startTime = performance.now() - (this.holdTime || 0);
			this.holdTime = null;
		} else {
			// Start fresh
			this.startTime = this.calcStartTime();
			this.currentTime = 0;
			this.currentIteration = 0;

			// Reset generator
			if (this.generator) {
				this.generator = this.createGenerator()!;
			}
		}

		this._state = AnimationState.Playing;
		this.notifyPlay();

		// Start driver
		this.stopDriver = this.driver.start(this.tick);
	}

	/**
	 * Pause the animation
	 */
	pause(): void {
		if (this._state !== AnimationState.Playing) return;

		this._state = AnimationState.Paused;
		this.holdTime = this.currentTime;

		// Stop driver
		this.stopDriver?.();
		this.stopDriver = undefined;
	}

	/**
	 * Stop the animation
	 */
	stop(): void {
		if (this._state === AnimationState.Idle || this._state === AnimationState.Finished) {
			return;
		}

		this._state = AnimationState.Idle;
		this.startTime = null;
		this.holdTime = null;
		this.currentTime = 0;
		this.currentIteration = 0;

		// Stop driver
		this.stopDriver?.();
		this.stopDriver = undefined;

		this.notifyStop();
	}

	/**
	 * Cancel the animation without callbacks
	 */
	cancel(): void {
		this._state = AnimationState.Cancelled;
		this.stopDriver?.();
		this.stopDriver = undefined;
	}

	/**
	 * Complete the animation immediately
	 */
	complete(): void {
		if (this._state === AnimationState.Finished) return;

		this._state = AnimationState.Finished;

		// Set to final value
		const finalValue = this.keyframes[this.keyframes.length - 1];
		this.currentValue = finalValue;
		this.notifyUpdate(finalValue);

		// Stop driver
		this.stopDriver?.();
		this.stopDriver = undefined;

		this.notifyComplete();
	}

	/**
	 * Get playback speed
	 */
	get speed(): number {
		return this.playbackSpeed;
	}

	/**
	 * Set playback speed
	 */
	set speed(value: number) {
		if (value === this.playbackSpeed) return;

		this.playbackSpeed = value;

		// Adjust start time to maintain current position
		if (this.startTime !== null && this._state === AnimationState.Playing) {
			this.startTime = performance.now() - this.currentTime / value;
		}
	}

	/**
	 * Get current time (ms)
	 */
	get time(): number {
		return this.currentTime;
	}

	/**
	 * Set current time (scrub to position)
	 */
	set time(value: number) {
		this.currentTime = value;
		this.holdTime = value;

		if (this.startTime !== null) {
			this.startTime = performance.now() - value / this.playbackSpeed;
		}

		// Update value at this time
		if (this._state !== AnimationState.Idle) {
			const { duration } = this.resolved;
			const repeatDelay = this.options.repeatDelay || 0;
			const iterationProgress = calcIterationProgress(value, duration, repeatDelay);
			const iteration = calcIteration(value, duration, repeatDelay);
			const repeatType = this.options.repeatType || 'loop';
			const progress = applyRepeatType(iterationProgress, iteration, repeatType);

			if (!this.interpolator && this.resolved.type === 'keyframes') {
				this.interpolator = this.createInterpolator();
			}

			if (this.interpolator) {
				const newValue = this.interpolator(progress);
				this.currentValue = newValue;
				this.notifyUpdate(newValue);
			}
		}
	}

	/**
	 * Get duration
	 */
	get duration(): number {
		return this.resolved.duration;
	}

	/**
	 * Get current state
	 */
	get state(): AnimationState {
		return this._state;
	}
}
