/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/easing/__tests__/circ.test.ts
 *
 * Adapted for motion-start (Svelte 5)
 */

import { circIn, circOut, circInOut } from "../circ"

describe("circ easing", () => {
    test("circInOut is correct", () => {
        expect(circInOut(0.25)).toBe(circIn(0.5) / 2)
        expect(circInOut(0.75)).toBe(0.5 + circOut(0.5) / 2)
    })
})
