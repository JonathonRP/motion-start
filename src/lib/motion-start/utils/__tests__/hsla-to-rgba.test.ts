/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/hsla-to-rgba.test.ts
 */

import { hslaToRgba } from "../hsla-to-rgba"

describe("hslaToRgba", () => {
    test("Correctly converts hsla to rgba", () => {
        expect(
            hslaToRgba({
                hue: 190,
                saturation: 100,
                lightness: 80,
                alpha: 1,
            })
        ).toEqual({ red: 153, green: 238, blue: 255, alpha: 1 })
    })
})
