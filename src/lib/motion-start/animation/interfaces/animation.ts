/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Animation playback controls interface
 * Provides standardized control methods for all animation types
 */
export interface AnimationPlaybackControls {
	/**
	 * Stops the animation and resets to initial state
	 */
	stop(): void;

	/**
	 * Returns a Promise that resolves when the animation completes
	 */
	then(resolve: VoidFunction, reject?: VoidFunction): Promise<void>;

	/**
	 * Returns the current time of the animation in milliseconds
	 */
	time: number;

	/**
	 * Returns the current playback speed multiplier
	 */
	speed: number;

	/**
	 * Returns the animation duration in milliseconds
	 */
	readonly duration: number;
}

/**
 * Animation playback lifecycle callbacks
 */
export interface AnimationPlaybackLifecycles<V> {
	onUpdate?: (latest: V) => void;
	onPlay?: () => void;
	onComplete?: () => void;
	onRepeat?: () => void;
	onStop?: () => void;
}

/**
 * Extended animation playback options
 */
export interface AnimationPlaybackOptions {
	repeat?: number;
	repeatType?: 'loop' | 'reverse' | 'mirror';
	repeatDelay?: number;
}
