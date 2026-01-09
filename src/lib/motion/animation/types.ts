/**
 * Animation Types
 */

// All easing names available from svelte/easing + our custom ones
export type EasingName =
	// Svelte built-ins
	| 'linear'
	| 'sineIn'
	| 'sineOut'
	| 'sineInOut'
	| 'quadIn'
	| 'quadOut'
	| 'quadInOut'
	| 'cubicIn'
	| 'cubicOut'
	| 'cubicInOut'
	| 'quartIn'
	| 'quartOut'
	| 'quartInOut'
	| 'quintIn'
	| 'quintOut'
	| 'quintInOut'
	| 'expoIn'
	| 'expoOut'
	| 'expoInOut'
	| 'circIn'
	| 'circOut'
	| 'circInOut'
	| 'backIn'
	| 'backOut'
	| 'backInOut'
	| 'elasticIn'
	| 'elasticOut'
	| 'elasticInOut'
	| 'bounceIn'
	| 'bounceOut'
	| 'bounceInOut'
	// CSS standard cubic-bezier presets
	| 'easeIn'
	| 'easeOut'
	| 'easeInOut'
	// Aliases
	| 'anticipate'; // alias for backInOut

export type Easing =
	| EasingName
	| [number, number, number, number]; // cubic-bezier

export type SpringOptions = {
	type: 'spring';
	/** Stiffness of the spring. Higher = snappier. Default: 100 */
	stiffness?: number;
	/** Damping of the spring. Higher = less oscillation. Default: 10 */
	damping?: number;
	/** Mass of the object. Higher = more momentum. Default: 1 */
	mass?: number;
	/** Initial velocity. Default: current velocity */
	velocity?: number;
	/** Rest delta threshold. Default: 0.01 */
	restDelta?: number;
	/** Rest velocity threshold. Default: 0.01 */
	restSpeed?: number;
};

export type TweenOptions = {
	type?: 'tween';
	/** Duration in seconds. Default: 0.3 */
	duration?: number;
	/** Easing function. Default: 'easeOut' */
	ease?: Easing;
	/** Delay before starting in seconds. Default: 0 */
	delay?: number;
	/** Number of times to repeat. Default: 0 */
	repeat?: number;
	/** Repeat type. Default: 'loop' */
	repeatType?: 'loop' | 'reverse' | 'mirror';
	/** Delay between repeats in seconds. Default: 0 */
	repeatDelay?: number;
};

export type InertiaOptions = {
	type: 'inertia';
	/** Initial velocity */
	velocity?: number;
	/** Rate of deceleration. Default: 0.35 */
	power?: number;
	/** End value to snap to */
	modifyTarget?: (target: number) => number;
	/** Minimum constraint */
	min?: number;
	/** Maximum constraint */
	max?: number;
	/** Bounce stiffness when hitting constraints. Default: 500 */
	bounceStiffness?: number;
	/** Bounce damping when hitting constraints. Default: 10 */
	bounceDamping?: number;
	/** Rest delta threshold. Default: 0.01 */
	restDelta?: number;
};

export type KeyframeOptions = {
	type: 'keyframes';
	/** Keyframe values */
	values: number[];
	/** Times for each keyframe (0-1). Default: evenly spaced */
	times?: number[];
	/** Easing between keyframes */
	ease?: Easing | Easing[];
	/** Total duration in seconds */
	duration?: number;
	/** Delay before starting in seconds */
	delay?: number;
	/** Number of times to repeat */
	repeat?: number;
	/** Repeat type */
	repeatType?: 'loop' | 'reverse' | 'mirror';
};

export type TransitionOptions = SpringOptions | TweenOptions | InertiaOptions | KeyframeOptions;

export type AnimationControls = {
	/** Stop the animation */
	stop: () => void;
	/** Promise that resolves when animation completes */
	finished: Promise<void>;
	/** Current animation time (0-1 for tweens) */
	time: number;
	/** Animation playback speed */
	speed: number;
};

export type AnimationPlaybackControls = {
	stop: () => void;
	finished: Promise<void>;
	then: (onResolve: () => void, onReject?: () => void) => Promise<void>;
};

/** Target value or keyframes for a property */
export type AnimationTarget = number | string | number[] | string[];

/** Animation definition for a single property */
export type PropertyAnimation = {
	[key: string]: AnimationTarget | TransitionOptions;
	transition?: TransitionOptions;
};
