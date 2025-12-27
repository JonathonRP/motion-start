/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/wrap.test.ts
 */

import { wrap } from "../wrap"

test("wrap", () => {
    expect(wrap(-100, 100, -100)).toBe(-100)
    expect(wrap(-100, 100, 0)).toBe(0)
    expect(wrap(-100, 100, -200)).toBe(0)
    expect(wrap(-100, 100, 101)).toBe(-99)
})
