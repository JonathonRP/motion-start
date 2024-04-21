
/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionValue } from "./index.js";
import { useMotionValue } from "./use-motion-value.js"
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
export const useVelocity = (value : MotionValue<number>) => {
    let val = value;
    let cleanup: () => void;

    const reset = (value: MotionValue<number>) => {
        cleanup?.();
        val = value
        cleanup = val.velocityUpdateSubscribers.add((newVelocity) => {
            velocity.set(newVelocity);
        })
    }
    
    const velocity = useMotionValue(value.getVelocity(), () => {
        cleanup?.();
        cleanup = val.velocityUpdateSubscribers.add((newVelocity) => {
            velocity.set(newVelocity);
        })
        return () => {
            cleanup?.()     
        }
    }) as MotionValue<number> & { reset: typeof reset };

    velocity.reset = reset;

    return velocity;
}