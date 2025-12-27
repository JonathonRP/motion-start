/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/render/dom/utils/__tests__/camel-to-dash.test.ts"
 */

import "../../../../../jest.setup"
import { camelToDash } from "../camel-to-dash"

describe("camelToDash", () => {
    it("Converts camel case to dash case", () => {
        expect(camelToDash("camelCase")).toBe("camel-case")
    })
})
