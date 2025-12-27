/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/is-zero-value-string.test.ts
 */

import { isZeroValueString } from "../is-zero-value-string"

describe("isZeroValueString", () => {
    test("should correctly identify numerical strings", () => {
        expect(isZeroValueString("0px")).toBe(true)
        expect(isZeroValueString("0%")).toBe(true)
        expect(isZeroValueString("0.5%")).toBe(false)
        expect(isZeroValueString("10.1%")).toBe(false)
        expect(isZeroValueString("0")).toBe(false)
        expect(isZeroValueString("10.1")).toBe(false)
        expect(isZeroValueString("rgb(0,0,0)")).toBe(false)
        expect(isZeroValueString("0px 0px rgba(0,0,0,0)")).toBe(false)
    })
})
