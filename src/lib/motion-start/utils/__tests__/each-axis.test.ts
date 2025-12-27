/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/each-axis.test.ts
 */

import { eachAxis } from "../each-axis"

describe("eachAxis", () => {
    test("Fires the callback once for each axis and returns an array with the results", () => {
        expect(eachAxis(axis => axis)).toEqual(["x", "y"])
    })
})
