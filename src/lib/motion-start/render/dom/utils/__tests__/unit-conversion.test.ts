/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/render/dom/utils/__tests__/unit-conversion.test.ts"
 */

import { positionalValues } from "../unit-conversion"

describe("Unit conversion", () => {
    test("Correctly factors in padding when measuring width/height", () => {
        const testDimensions = {
            x: { min: 0, max: 100 },
            y: { min: 0, max: 300 },
        }
        expect(
            positionalValues.width(testDimensions, { paddingLeft: "50px" })
        ).toBe(50)

        expect(
            positionalValues.width(testDimensions, { paddingRight: "25px" })
        ).toBe(75)

        expect(
            positionalValues.height(testDimensions, { paddingTop: "50px" })
        ).toBe(250)

        expect(
            positionalValues.height(testDimensions, { paddingBottom: "25px" })
        ).toBe(275)
    })
})
