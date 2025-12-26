/**
 * Accelerated Animation
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Hardware-accelerated animation implementation using Web Animations API (WAAPI).
 * Falls back to MainThreadAnimation if WAAPI is not supported or animation
 * cannot be accelerated.
 */

import {
	BaseAnimation,
	AnimationState,
	type BaseAnimationOptions,
	type ResolvedAnimationData,
} from './BaseAnimation.js';
import {
	createAcceleratedAnimation,
	canAccelerateProperty,
	type AcceleratedAnimationOptions as WaapiAcceleratedOptions,
	type WaapiKeyframe,
} from './waapi/index.js';
import { NativeAnimation } from './waapi/NativeAnimation.js';
import { getSupportsWaapi } from './waapi/utils/supports-waapi.js';

/**
 * Accelerated animation options
 */
export interface AcceleratedAnimationOptions<V = any> extends BaseAnimationOptions<V> {
	/**
	 * Duration in milliseconds
	 * @default 300
	 */
	duration?: number;

	/**
	 * Easing function
	 */
	ease?: any;

	/**
	 * Property name being animated
	 */
	property?: string;

	/**
	 * Direction of playback
	 */
	direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

	/**
	 * Fill mode
	 */
	fill?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Resolved data for accelerated animations
 */
export interface AcceleratedResolvedData<V = any> extends ResolvedAnimationData<V> {
	/**
	 * Duration in milliseconds
	 */
	duration: number;

	/**
	 * Whether this can be hardware accelerated
	 */
	canAccelerate: boolean;
}

/**
 * Accelerated animation implementation
 *
 * Uses WAAPI when possible for GPU-accelerated animations.
 * Provides controls for the underlying native animation.
 */
export class AcceleratedAnimation<V = any> extends BaseAnimation<V, AcceleratedResolvedData<V>> {
	/**
	 * Animation options
	 */
	protected options: AcceleratedAnimationOptions<V>;

	/**
	 * DOM element to animate
	 */
	protected element: Element;

	/**
	 * Native animation wrapper
	 */
	protected nativeAnimation?: NativeAnimation;

	/**
	 * Current animation state
	 */
	protected _state: AnimationState = AnimationState.Idle;

	/**
	 * Interval for polling animation state (fallback)
	 */
	protected pollInterval?: ReturnType<typeof setInterval>;

	constructor(
		element: Element,
		protected property: string,
		protected keyframes: V[],
		options: AcceleratedAnimationOptions<V> = {}
	) {
		super(options);

		this.element = element;
		this.options = {
			duration: 300,
			fill: 'both',
			...options,
		};

		// Resolve immediately
		this.resolveKeyframes();
	}

	/**
	 * Resolve keyframes and check if animation can be accelerated
	 */
	protected resolveKeyframes(): void {
		const canAccelerate =
			getSupportsWaapi() &&
			this.keyframes.length > 0 &&
			canAccelerateProperty(this.property);

		const resolvedData: AcceleratedResolvedData<V> = {
			canAnimate: this.keyframes.length > 0,
			keyframes: this.keyframes,
			duration: this.options.duration || 300,
			canAccelerate,
		};

		this.onKeyframesResolved(resolvedData);
	}

	/**
	 * Create WAAPI animation
	 */
	protected createNativeAnimation(): NativeAnimation | null {
		if (!this.resolved.canAccelerate) {
			return null;
		}

		// Convert keyframes to WAAPI format
		const waapiKeyframes: WaapiKeyframe[] = this.keyframes.map((value) => ({
			[this.property]: value as any,
		}));

		// Create accelerated animation
		const waapiOptions: WaapiAcceleratedOptions = {
			duration: this.resolved.duration,
			delay: this.options.delay,
			ease: this.options.ease,
			iterations:
				this.options.repeat === Infinity
					? Infinity
					: (this.options.repeat || 0) + 1,
			direction: this.getDirection(),
			fill: this.options.fill,
		};

		const nativeAnim = createAcceleratedAnimation(this.element, waapiKeyframes, waapiOptions);

		if (nativeAnim) {
			// Set up finish handler
			nativeAnim.native.onfinish = () => {
				this._state = AnimationState.Finished;
				this.notifyComplete();
			};
		}

		return nativeAnim;
	}

	/**
	 * Get animation direction based on repeat type
	 */
	protected getDirection(): 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' {
		const repeatType = this.options.repeatType || 'loop';

		switch (repeatType) {
			case 'reverse':
				return 'reverse';
			case 'mirror':
				return 'alternate';
			default:
				return this.options.direction || 'normal';
		}
	}

	/**
	 * Start polling for animation updates
	 */
	protected startPolling(): void {
		// Poll at 60fps to trigger onUpdate callbacks
		this.pollInterval = setInterval(() => {
			if (this.nativeAnimation && this._state === AnimationState.Playing) {
				// Calculate current value (simplified - just use progress)
				const progress = this.nativeAnimation.time / this.resolved.duration;
				const index = Math.min(
					Math.floor(progress * (this.keyframes.length - 1)),
					this.keyframes.length - 1
				);
				const value = this.keyframes[index];

				this.notifyUpdate(value);
			}
		}, 1000 / 60);
	}

	/**
	 * Stop polling
	 */
	protected stopPolling(): void {
		if (this.pollInterval) {
			clearInterval(this.pollInterval);
			this.pollInterval = undefined;
		}
	}

	/**
	 * Play or resume the animation
	 */
	play(): void {
		if (this._state === AnimationState.Playing) return;

		// Create native animation if needed
		if (!this.nativeAnimation) {
			this.nativeAnimation = this.createNativeAnimation();

			if (!this.nativeAnimation) {
				// Fallback: can't create WAAPI animation
				console.warn('Failed to create accelerated animation, property:', this.property);
				this._state = AnimationState.Idle;
				return;
			}
		}

		this._state = AnimationState.Playing;
		this.nativeAnimation.play();
		this.notifyPlay();

		// Start polling for updates
		if (this.options.onUpdate) {
			this.startPolling();
		}
	}

	/**
	 * Pause the animation
	 */
	pause(): void {
		if (!this.nativeAnimation || this._state !== AnimationState.Playing) {
			return;
		}

		this._state = AnimationState.Paused;
		this.nativeAnimation.pause();
		this.stopPolling();
	}

	/**
	 * Stop the animation
	 */
	stop(): void {
		if (!this.nativeAnimation) return;

		this._state = AnimationState.Idle;
		this.nativeAnimation.stop();
		this.stopPolling();
		this.notifyStop();
	}

	/**
	 * Cancel the animation
	 */
	cancel(): void {
		if (!this.nativeAnimation) return;

		this._state = AnimationState.Cancelled;
		this.nativeAnimation.cancel();
		this.stopPolling();
	}

	/**
	 * Complete the animation immediately
	 */
	complete(): void {
		if (!this.nativeAnimation) return;

		this._state = AnimationState.Finished;
		this.nativeAnimation.complete();
		this.stopPolling();

		// Notify with final value
		const finalValue = this.keyframes[this.keyframes.length - 1];
		this.notifyUpdate(finalValue);
		this.notifyComplete();
	}

	/**
	 * Get playback speed
	 */
	get speed(): number {
		return this.nativeAnimation?.speed || 1;
	}

	/**
	 * Set playback speed
	 */
	set speed(value: number) {
		if (this.nativeAnimation) {
			this.nativeAnimation.speed = value;
		}
	}

	/**
	 * Get current time (ms)
	 */
	get time(): number {
		return this.nativeAnimation?.time || 0;
	}

	/**
	 * Set current time (scrub to position)
	 */
	set time(value: number) {
		if (this.nativeAnimation) {
			this.nativeAnimation.time = value;
		}
	}

	/**
	 * Get duration (ms)
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

	/**
	 * Check if this animation type supports hardware acceleration
	 */
	static supports(element: Element, property: string): boolean {
		return getSupportsWaapi() && canAccelerateProperty(property);
	}

	/**
	 * Attach to a scroll timeline (if supported)
	 */
	attachTimeline(timeline: any): void {
		if (this.nativeAnimation) {
			this.nativeAnimation.attachTimeline(timeline);
		}
	}
}
