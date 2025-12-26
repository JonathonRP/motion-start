/**
 * Native Animation Wrapper
 *
 * Based on framer-motion@11.11.11
 * Copyright (c) 2018 Framer B.V.
 *
 * Adapted for Svelte 5 and motion-start
 *
 * Wrapper around the native Web Animations API (WAAPI) Animation object.
 * Provides a normalized interface for controlling native animations.
 */

/**
 * Native animation playback state
 */
export type NativeAnimationState = 'idle' | 'running' | 'paused' | 'finished';

/**
 * Wrapper around native Web Animation
 *
 * Provides methods for controlling playback and accessing state.
 */
export class NativeAnimation {
	/**
	 * The underlying native Animation object
	 */
	private animation: Animation;

	/**
	 * Cached finished promise
	 */
	private finishedPromise?: Promise<void>;

	constructor(animation: Animation) {
		this.animation = animation;
	}

	/**
	 * Play or resume the animation
	 */
	play(): void {
		try {
			this.animation.play();
		} catch (e) {
			// Some browsers may throw if animation is already playing
			console.warn('Failed to play animation:', e);
		}
	}

	/**
	 * Pause the animation
	 */
	pause(): void {
		try {
			this.animation.pause();
		} catch (e) {
			console.warn('Failed to pause animation:', e);
		}
	}

	/**
	 * Stop and reset the animation
	 */
	stop(): void {
		try {
			this.animation.cancel();
		} catch (e) {
			console.warn('Failed to stop animation:', e);
		}
	}

	/**
	 * Complete the animation immediately
	 */
	complete(): void {
		try {
			this.animation.finish();
		} catch (e) {
			console.warn('Failed to complete animation:', e);
		}
	}

	/**
	 * Cancel the animation
	 */
	cancel(): void {
		try {
			this.animation.cancel();
		} catch (e) {
			console.warn('Failed to cancel animation:', e);
		}
	}

	/**
	 * Get current playback time (ms)
	 */
	get time(): number {
		return (this.animation.currentTime as number) || 0;
	}

	/**
	 * Set playback time (ms)
	 */
	set time(value: number) {
		this.animation.currentTime = value;
	}

	/**
	 * Get playback speed
	 */
	get speed(): number {
		return this.animation.playbackRate;
	}

	/**
	 * Set playback speed
	 */
	set speed(value: number) {
		this.animation.playbackRate = value;
	}

	/**
	 * Get animation duration (ms)
	 */
	get duration(): number {
		const timing = this.animation.effect?.getTiming();
		return (timing?.duration as number) || 0;
	}

	/**
	 * Get current playback state
	 */
	get state(): NativeAnimationState {
		return this.animation.playState as NativeAnimationState;
	}

	/**
	 * Get the underlying native Animation object
	 */
	get native(): Animation {
		return this.animation;
	}

	/**
	 * Get finished promise
	 */
	get finished(): Promise<void> {
		if (!this.finishedPromise) {
			this.finishedPromise = this.animation.finished
				.then(() => {})
				.catch(() => {
					// Ignore cancellation errors
				});
		}
		return this.finishedPromise;
	}

	/**
	 * Attach to a scroll timeline (if supported)
	 */
	attachTimeline(timeline: any): void {
		if ('timeline' in this.animation) {
			(this.animation as any).timeline = timeline;
		}
	}
}
