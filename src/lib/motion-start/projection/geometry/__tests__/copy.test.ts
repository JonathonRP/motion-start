/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/projection/geometry/__tests__/copy.test.ts"
 */

import { copyBoxInto } from "../copy"
import { createBox } from "../models"

describe("copyBoxInto", () => {
    it("copies one box into an existing box", () => {
        const a = createBox()
        const b = {
            x: { min: 1, max: 2 },
            y: { min: 3, max: 4 },
        }

        copyBoxInto(a, b)

        expect(a).toEqual(b)
        expect(a).not.toBe(b)
    })
})
