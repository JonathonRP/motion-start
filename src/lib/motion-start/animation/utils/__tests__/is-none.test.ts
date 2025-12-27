/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/animation/utils/__tests__/is-none.test.ts
 *
 * Adapted for motion-start (Svelte 5)
 */

import { isNone } from "../is-none"

describe("isNone", () => {
    test("Detects zero/none values", () => {
        expect(isNone(0)).toBe(true)
        expect(isNone(1)).toBe(false)
        expect(isNone("0")).toBe(true)
        expect(isNone("0px")).toBe(true)
        expect(isNone("0%")).toBe(true)
        expect(isNone("100")).toBe(false)
        expect(isNone("100px")).toBe(false)
        expect(isNone("100%")).toBe(false)
        expect(isNone("none")).toBe(true)
    })
})
