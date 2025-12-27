/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/render/dom/utils/__tests__/is-css-variable.test.ts"
 */

import { isCSSVariableToken } from "../is-css-variable"

describe("isCSSVariableToken", () => {
    test("returns true for a CSS variable", () => {
        expect(isCSSVariableToken("--foo")).toBe(false)
        expect(isCSSVariableToken("rgba(0, 0, 0, .4)")).toBe(false)
        expect(isCSSVariableToken("var(--foo)")).toBe(true)
        expect(
            isCSSVariableToken(
                `var(--token-31a8b72b-4f05-4fb3-b778-63a7fb0d9454, hsl(224, 78%, 54%)) /* {"name":"Midnight Blue"} */`
            )
        ).toBe(true)
    })
})
