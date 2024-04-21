/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionValue } from ".";

import { useCombineMotionValues } from "./use-combine-values"

/**
 * Combine multiple motion values into a new one using a string template literal.
 *
 * ```jsx
 * import {
 *   motion,
 *   useSpring,
 *   useMotionValue,
 *   useMotionTemplate
 * } from "framer-motion"
 *
 * function Component() {
 *   const shadowX = useSpring(0)
 *   const shadowY = useMotionValue(0)
 *   const shadow = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3))`
 *
 *   return <MotionDiv style={{ filter: shadow }} />
 * }
 * ```
 *
 * @public
 */

export const useMotionTemplate = (fragments: TemplateStringsArray, ...values: MotionValue[]) => {
    /**
    * Create a function that will build a string from the latest motion values.
    */
    let numFragments = fragments.length;
    const buildValue = () => {
        let output = ``

        for (let i = 0; i < numFragments; i++) {
            output += fragments[i]
            const value = values[i]
            if (value) output += values[i].get()
        }

        return output
    }
    const value = useCombineMotionValues(values, buildValue) as any;
    value.resetInner = value.reset;

    value.reset = (f: TemplateStringsArray, ...vs: MotionValue[]) => {
        numFragments = f.length;
        value.resetInner(vs,buildValue)
    }

    return value as MotionValue<string> & { reset: (fragments: TemplateStringsArray, ...values: MotionValue[]) => void };
}