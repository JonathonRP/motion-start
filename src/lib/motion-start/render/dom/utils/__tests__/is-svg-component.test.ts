/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/render/dom/utils/__tests__/is-svg-component.test.ts"
 */

import { isSVGComponent } from "../is-svg-component"

describe("isSVGComponent", () => {
    test("Correctly identifies SVG components", () => {
        expect(isSVGComponent("circle")).toBe(true)
        expect(isSVGComponent("div")).toBe(false)
        expect(isSVGComponent("feGaussian")).toBe(true)
        expect(isSVGComponent("test-element")).toBe(false)
        expect(isSVGComponent(() => null)).toBe(false)
    })
})
