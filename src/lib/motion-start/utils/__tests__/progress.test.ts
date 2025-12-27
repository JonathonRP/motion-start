/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/progress.test.ts
 */

import { progress } from "../progress"

test("progress", () => {
    expect(progress(0, 100, 50)).toBe(0.5)
    expect(progress(100, -100, 50)).toBe(0.25)
    expect(progress(100, -100, -300)).toBe(2)
})
