/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { ResolvedValueTarget, Spring, Tween } from '../../types';
import type { MotionValue } from '../../value/index.js';
/**
 * Animation playback controls
 * Matches Motion v11.11.11 API
 *
 * @public
 */
export interface AnimationPlaybackControls {
	/**
	 * Stop the animation
	 */
	stop: () => void;

	/**
	 * Play or resume the animation
	 */
	play?: () => void;

	/**
	 * Pause the animation
	 */
	pause?: () => void;

	/**
	 * Current time of the animation (ms)
	 * Can be set to scrub the animation
	 */
	time?: number;

	/**
	 * Playback speed multiplier
	 * 1 = normal, 2 = double speed, 0.5 = half speed
	 */
	speed?: number;

	/**
	 * Total duration of the animation (ms)
	 * Read-only
	 */
	duration?: number;

	/**
	 * Promise-based completion handler
	 * Allows chaining animations with .then()
	 */
	then?(onResolve: VoidFunction, onReject?: VoidFunction): Promise<void>;
}
/**
 * @public
 */
export interface AnimationPlaybackLifecycles<V> {
	onUpdate?: (latest: V) => void;
	onPlay?: () => void;
	onComplete?: () => void;
	onRepeat?: () => void;
	onStop?: () => void;
}
/**
 * @public
 */
export type AnimationOptions<V> = (Tween | Spring) &
	AnimationPlaybackLifecycles<V> & {
		delay?: number | ((index: number, total: number) => number);
		type?: 'tween' | 'spring';
	};

/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { motionValue } from '../../value/index.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';
import { MainThreadAnimation, type MainThreadAnimationOptions } from '../animators/MainThreadAnimation.js';
import { secondsToMilliseconds } from '../../utils/time-conversion.js';

/**
 * Convert AnimationOptions to MainThreadAnimationOptions
 */
const convertToAnimatorOptions = <V>(
	from: V,
	to: ResolvedValueTarget,
	transition: AnimationOptions<V>
): MainThreadAnimationOptions<V> => {
	const { delay, type, onUpdate, onPlay, onComplete, onRepeat, onStop, ...rest } = transition;

	// Convert delay from seconds to milliseconds if provided
	const delayMs = delay ? (typeof delay === 'number' ? secondsToMilliseconds(delay) : 0) : 0;

	// Build keyframes array
	const keyframes = Array.isArray(to) ? [from, ...to] : [from, to];

	// Map animation type
	const animType = type === 'spring' ? 'spring' : 'keyframes';

	return {
		type: animType,
		delay: delayMs,
		onUpdate,
		onPlay,
		onComplete,
		onRepeat,
		onStop,
		...rest,
	} as MainThreadAnimationOptions<V>;
};

/**
 * Animate a single value or a `MotionValue`.
 *
 * The first argument is either a `MotionValue` to animate, or an initial animation value.
 *
 * The second is either a value to animate to, or an array of keyframes to animate through.
 *
 * The third argument can be either tween or spring options, and optional lifecycle methods: `onUpdate`, `onPlay`, `onComplete`, `onRepeat` and `onStop`.
 *
 * Returns `AnimationPlaybackControls`, currently just a `stop` method.
 *
 * ```javascript
 * const x = useMotionValue(0)
 *
 * useEffect(() => {
 *   const controls = animate(x, 100, {
 *     type: "spring",
 *     stiffness: 2000,
 *     onComplete: v => {}
 *   })
 *
 *   return controls.stop
 * })
 * ```
 *
 * @public
 */
function animate<V>(
	from: MotionValue<V> | V,
	to: ResolvedValueTarget,
	transition?: AnimationOptions<V>
): AnimationPlaybackControls;

/**
 * Animate multiple elements with optional staggered delays.
 *
 * @example
 * ```javascript
 * import { animate, stagger } from "motion-start"
 *
 * const elements = document.querySelectorAll(".item")
 * animate(elements, { opacity: 1 }, {
 *   delay: stagger(0.1)
 * })
 * ```
 *
 * @public
 */
function animate<V>(
	from: MotionValue<V>[] | V[] | NodeListOf<Element> | Element[],
	to: ResolvedValueTarget,
	transition?: AnimationOptions<V>
): AnimationPlaybackControls;

function animate<V>(
	from: MotionValue<V> | V | MotionValue<V>[] | V[] | NodeListOf<Element> | Element[],
	to: ResolvedValueTarget,
	transition?: AnimationOptions<V>
): AnimationPlaybackControls {
	if (transition === void 0) {
		transition = {};
	}

	// Handle array of elements/values
	if (Array.isArray(from) || from instanceof NodeList) {
		const elements = Array.from(from as any);
		const animations: MainThreadAnimation<V>[] = [];

		elements.forEach((element, index) => {
			const value = isMotionValue(element) ? element : motionValue(element);
			const currentValue = value.get() as V;

			// Calculate delay for staggered animations
			const delayValue = transition?.delay ?? 0;
			const resolvedDelay: number =
				typeof delayValue === 'function'
					? (delayValue as (index: number, total: number) => number)(index, elements.length)
					: (delayValue as number);

			const elementTransition = {
				...transition,
				delay: resolvedDelay,
			};

			// Convert options and create animator
			const animatorOptions = convertToAnimatorOptions(currentValue, to, elementTransition);

			// Build keyframes
			const keyframes = (Array.isArray(to) ? [currentValue, ...to] : [currentValue, to]) as V[];

			// Create animation with updated onUpdate that sets the MotionValue
			const animation = new MainThreadAnimation(keyframes, {
				...animatorOptions,
				onUpdate: (v: V) => {
					value.set(v);
					transition?.onUpdate?.(v);
				},
			});

			animation.play();
			animations.push(animation);
		});

		// Return combined controls
		return {
			stop: () => animations.forEach((anim) => anim.stop()),
			play: () => animations.forEach((anim) => anim.play()),
			pause: () => animations.forEach((anim) => anim.pause()),
			then: (onResolve: VoidFunction, onReject?: VoidFunction) => {
				return Promise.all(animations.map((anim) => anim.then(onResolve, onReject))).then(
					() => {},
					() => {}
				);
			},
		};
	}

	// Single value animation
	const value = isMotionValue(from) ? from : motionValue(from as V);
	const currentValue = value.get() as V;

	const delayValue = transition?.delay ?? 0;
	const resolvedDelay: number =
		typeof delayValue === 'function'
			? (delayValue as (index: number, total: number) => number)(0, 1)
			: (delayValue as number);

	const finalTransition = {
		...transition,
		delay: resolvedDelay,
	};

	// Convert options and create animator
	const animatorOptions = convertToAnimatorOptions(currentValue, to, finalTransition);

	// Build keyframes
	const keyframes = (Array.isArray(to) ? [currentValue, ...to] : [currentValue, to]) as V[];

	// Create animation with updated onUpdate that sets the MotionValue
	const animation = new MainThreadAnimation(keyframes, {
		...animatorOptions,
		onUpdate: (v: V) => {
			value.set(v);
			transition?.onUpdate?.(v);
		},
	});

	animation.play();

	return animation as AnimationPlaybackControls;
}

export { animate };
