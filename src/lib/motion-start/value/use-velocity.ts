/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { MotionValue } from './index.svelte';
import { frame } from '../frameloop';
import { useMotionValueEvent } from '../utils/use-motion-value-event.svelte';
import { useMotionValue } from './use-motion-value.svelte';

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
	const velocity = useMotionValue(value.getVelocity());

	const updateVelocity = () => {
		const latest = value.getVelocity();
		velocity.set(latest);

		/**
		 * If we still have velocity, schedule an update for the next frame
		 * to keep checking until it is zero.
		 */
		if (latest) frame.update(updateVelocity);
	};

	useMotionValueEvent(value, 'change', () => {
		// Schedule an update to this value at the end of the current frame.
		frame.update(updateVelocity, false, true);
	});

	return velocity;
};
