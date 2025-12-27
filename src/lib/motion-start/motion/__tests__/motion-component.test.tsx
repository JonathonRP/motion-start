/**
 * @file Mirrored from framer-motion@11.11.11
 * @source https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/motion/__tests__/motion-component.test.tsx
 *
 * TODO: Port to Svelte 5 runes API
 * - Replace React component patterns with Svelte component patterns
 * - Convert hooks to Svelte 5 runes ($state, $derived, $effect)
 * - Adapt testing utilities for Svelte testing library
 */

import { isMotionComponent, motion, unwrapMotionComponent } from "../.."
import { forwardRef } from "react"

const CustomComp = forwardRef(() => <div />)

describe("isMotionComponent", () => {
    it("returns true for motion components", () => {
        expect(isMotionComponent(motion.div)).toBe(true)
        expect(isMotionComponent(motion.create(CustomComp))).toBe(true)
    })

    it("returns false for other components", () => {
        expect(isMotionComponent("div")).toBe(false)
        expect(isMotionComponent(CustomComp)).toBe(false)
    })
})

describe("unwrapMotionComponent", () => {
    it("returns the wrapped component for motion components", () => {
        expect(unwrapMotionComponent(motion.div)).toBe("div")
        expect(unwrapMotionComponent(motion.create(CustomComp))).toBe(
            CustomComp
        )
    })

    it("returns undefined for other components", () => {
        expect(unwrapMotionComponent("div")).toBe(undefined)
        expect(unwrapMotionComponent(CustomComp)).toBe(undefined)
    })
})
