/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/velocity-per-second.test.ts
 */

import { velocityPerSecond } from "../velocity-per-second"

test("velocityPerSecond", () => {
    expect(velocityPerSecond(0.835, 16.7)).toBe(50)
    expect(velocityPerSecond(0.835, 0)).toBe(0)
})
