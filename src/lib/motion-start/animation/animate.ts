/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { ResolvedValueTarget, Spring, Tween } from '../types';
import type { MotionValue } from '../value/index.js';
/**
 * @public
 */
export interface AnimationPlaybackControls {
	stop: () => void;
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
		delay?: number;
		type?: 'tween' | 'spring';
	};

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { motionValue } from '../value/index.js';
import { isMotionValue } from '../value/utils/is-motion-value.js';
import { startAnimation } from './utils/transitions.js';

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
function animate<V>(from: MotionValue<V> | V, to: ResolvedValueTarget, transition?: AnimationOptions<V>) {
	if (transition === void 0) {
		transition = {};
	}
	var value = isMotionValue(from) ? from : motionValue(from);
	startAnimation('', value, to, transition);
	return {
		stop: () => value.stop(),
	} as AnimationPlaybackControls;
}

export { animate };
