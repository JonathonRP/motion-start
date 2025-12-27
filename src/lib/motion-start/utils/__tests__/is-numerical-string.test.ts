/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/is-numerical-string.test.ts
 */

import { isNumericalString } from "../is-numerical-string"

describe("isNumericalString", () => {
    test("should correctly identify numerical strings", () => {
        expect(isNumericalString("10")).toBe(true)
        expect(isNumericalString("10.1")).toBe(true)
        expect(isNumericalString("-10.1")).toBe(true)
        expect(isNumericalString("10px")).toBe(false)
        expect(isNumericalString("10%")).toBe(false)
        expect(isNumericalString("10.1%")).toBe(false)
        expect(isNumericalString("rgb(0,0,0)")).toBe(false)
    })
})
