/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/memo.test.ts
 */

import { memo } from "../memo"

describe("memo", () => {
    test("Only fires callback once", () => {
        const callback = jest.fn()

        const test = () => {
            callback()
            return 0
        }

        const memoized = memo(test)

        expect(memoized()).toEqual(0)
        expect(memoized()).toEqual(0)
        expect(callback).toBeCalledTimes(1)
    })
})
