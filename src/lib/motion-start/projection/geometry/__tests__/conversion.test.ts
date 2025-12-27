/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/projection/geometry/__tests__/conversion.test.ts"
 */

import { convertBoundingBoxToBox } from "../conversion"

describe("convertBoundingBoxToBox", () => {
    it("Correctly converts a bounding box into a box", () => {
        expect(
            convertBoundingBoxToBox({ top: 1, right: 4, bottom: 3, left: 2 })
        ).toEqual({
            x: { min: 2, max: 4 },
            y: { min: 1, max: 3 },
        })
    })
})
