/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/projection/node/__tests__/group.test.ts"
 */

import { createTestNode } from "./TestProjectionNode"
import { nodeGroup } from "../group"

describe("nodeGroup", () => {
    test.skip("it notifies grouped nodes when any one of them will update", () => {
        const a = createTestNode()

        a.mount({})
        const b = createTestNode()
        b.mount({})

        const bLayoutUpdate = jest.fn()
        b.addEventListener("didUpdate", bLayoutUpdate)

        const group = nodeGroup()
        group.add(a)
        group.add(b)

        a.willUpdate()
        a.root.didUpdate()

        expect(bLayoutUpdate).toBeCalledTimes(1)
    })
})
