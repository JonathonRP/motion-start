/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionValue } from './index.js';
import { useMotionValue } from './use-motion-value.svelte.js';
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
	let val = value;
	let cleanup: () => void;

	const reset = (value: MotionValue<number>) => {
		cleanup?.();
		val = value;
		cleanup = val.velocityUpdateSubscribers.add((newVelocity) => {
			velocity.set(newVelocity);
		});
	};

	const velocity = useMotionValue(value.getVelocity()) as MotionValue<number> & { reset: typeof reset };

	// Set up subscription to velocity updates
	cleanup = val.velocityUpdateSubscribers.add((newVelocity) => {
		velocity.set(newVelocity);
	});

	velocity.reset = reset;

	return velocity;
};
