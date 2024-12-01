/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { motionValue, type MotionValue } from '.';
import { frame } from '../frameloop';
import { useMotionValueEvent } from '../utils/use-motion-value-event.svelte';

/**
 * Creates a `MotionValue` that updates when the velocity of the provided `MotionValue` changes.
 *
 * ```javascript
 * const x = useMotionValue(0)
 * const xVelocity = useVelocity(x)
 * const xAcceleration = useVelocity(xVelocity)
 * ```
 *
 * @public
 */
export const useVelocity = (value: MotionValue<number>) => {
	let latest: number;
	let cleanup: () => void;
	const updateVelocity = () => {
		latest = value.getVelocity();
		velocity.set(latest);

		/**
		 * If we still have velocity, schedule an update for the next frame
		 * to keep checking until it is zero.
		 */
		if (latest) frame.update(updateVelocity);
	};

	const reset = (_value: MotionValue<number>) => {
		updateVelocity?.();
		latest = _value.getVelocity();
		cleanup = updateVelocity;
	};

	const velocity = motionValue(value.getVelocity(), {
		startStopNotifier: () => {
			updateVelocity?.();
			cleanup = updateVelocity;
			return () => {
				cleanup?.();
			};
		},
	}) as MotionValue<number> & { reset: typeof reset };

	// do we need this reset or cleanup and startStopNotifier?

	velocity.reset = reset;

	useMotionValueEvent(value, 'change', () => {
		// Schedule an update to this value at the end of the current frame.
		frame.update(updateVelocity, false, true);
	});

	return velocity;
};
