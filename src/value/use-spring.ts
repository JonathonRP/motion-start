/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { SpringOptions } from "popmotion";
import { MotionValue } from "../value";

/** 
based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V.
*/

import { fixed } from '../utils/fix-process-env';
import { getContext } from "svelte"
import { MotionConfigContext, type MotionConfigContextObject } from "../context/MotionConfigContext"
import { get, type Writable } from 'svelte/store';
import { useMotionValue } from "./use-motion-value";
import { isMotionValue } from "./utils/is-motion-value";
import { animate } from "popmotion"

/**
 * Creates a `MotionValue` that, when `set`, will use a spring animation to animate to its new state.
 *
 * It can either work as a stand-alone `MotionValue` by initialising it with a value, or as a subscriber
 * to another `MotionValue`.
 *
 * @remarks
 *
 * ```jsx
 * const x = useSpring(0, { stiffness: 300 })
 * const y = useSpring(x, { damping: 10 })
 * ```
 *
 * @param inputValue - `MotionValue` or number. If provided a `MotionValue`, when the input `MotionValue` changes, the created `MotionValue` will spring towards that value.
 * @param springConfig - Configuration options for the spring.
 * @returns `MotionValue`
 *
 * @public
 */
export const useSpring = (source: MotionValue | number, config: SpringOptions = {}, isCustom = false) => {

    const mcc: Writable<MotionConfigContextObject> = getContext(MotionConfigContext) || MotionConfigContext(isCustom);

    let activeSpringAnimation: { stop: () => void } | null = null;

    let value = useMotionValue(isMotionValue(source) ? source.get() : source) as MotionValue<any> & { reset: (_: any, config: SpringOptions) => void };

    let cleanup: () => void;
    const update = (_source: typeof source, _config: typeof config) => {
        value.attach((v, set) => {


            const { isStatic } = get(mcc);

            if (isStatic) {
                return set(v);
            }
            if (activeSpringAnimation) {
                activeSpringAnimation.stop();
            }
            activeSpringAnimation = animate({
                from: value.get(),
                to: v,
                velocity: value.getVelocity(),
                ..._config,
                onUpdate: set,
            })

            return value.get();
        })
        cleanup?.()
        return isMotionValue(_source) ?
            _source.onChange(v => value.set(parseFloat(v))) :
            undefined
    }

    update(source, config);

    value.reset = update;
    
    return value;
}

//export { default as UseSpring } from './UseSpring.svelte';
