/**
 * @file Mirrored from framer-motion@11.11.11
 * @source https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/motion/__tests__/child-motion-value.test.tsx
 *
 * TODO: Port to Svelte 5 runes API
 * - Replace React component patterns with Svelte component patterns
 * - Convert hooks to Svelte 5 runes ($state, $derived, $effect)
 * - Adapt testing utilities for Svelte testing library
 */

import { render } from "../../../jest.setup"
import { motion } from "../../render/components/motion"
import { motionValue } from "../../value"
import { frame } from "../../frameloop"

describe("child as motion value", () => {
    test("accepts motion values as children", async () => {
        const promise = new Promise<HTMLDivElement>((resolve) => {
            const child = motionValue(1)
            const Component = () => <motion.div>{child}</motion.div>

            const { container, rerender } = render(<Component />)
            rerender(<Component />)

            resolve(container.firstChild as HTMLDivElement)
        })

        return expect(promise).resolves.toHaveTextContent("1")
    })

    test("updates textContent when motion value changes", async () => {
        const promise = new Promise<HTMLDivElement>((resolve) => {
            const child = motionValue(1)
            const Component = () => <motion.div>{child}</motion.div>

            const { container, rerender } = render(<Component />)
            rerender(<Component />)

            frame.postRender(() => {
                child.set(2)
                frame.postRender(() => {
                    resolve(container.firstChild as HTMLDivElement)
                })
            })
        })

        return expect(promise).resolves.toHaveTextContent("2")
    })
})
