/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/clamp.test.ts
 */

import { clamp } from "../clamp"

test("clamp", () => {
    expect(clamp(100, 200, 99)).toBe(100)
    expect(clamp(100, 200, 201)).toBe(200)
    expect(clamp(100, 200, 150)).toBe(150)
})
