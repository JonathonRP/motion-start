/**
 * @file Mirrored from framer-motion@11.11.11
 * @source https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/motion/__tests__/motion-context.test.tsx
 *
 * TODO: Port to Svelte 5 runes API
 * - Replace React component patterns with Svelte component patterns
 * - Convert hooks to Svelte 5 runes ($state, $derived, $effect)
 * - Adapt testing utilities for Svelte testing library
 */

import { render } from "../../../jest.setup"
import { motion, MotionConfig } from "../../"
import { motionValue } from "../../value"

describe("MotionConfig.transition", () => {
    test("Can define a default transition for an entire tree", async () => {
        const promise = new Promise<[number, number]>((resolve) => {
            const x = motionValue(0)
            const y = motionValue(0)
            const Component = () => (
                <MotionConfig
                    transition={{ x: { type: false }, y: { duration: 1 } }}
                >
                    <motion.div
                        animate={{ x: 100, y: 100 }}
                        style={{ x, y }}
                        onUpdate={() => {
                            resolve([x.get(), y.get()])
                        }}
                    />
                </MotionConfig>
            )
            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        const [x, y] = await promise

        expect(x).toBe(100)
        expect(y).not.toBe(100)
    })

    test("transition is overridden by component prop", async () => {
        const promise = new Promise<[number, number]>((resolve) => {
            const x = motionValue(0)
            const y = motionValue(0)
            const Component = () => (
                <MotionConfig
                    transition={{ x: { type: false }, y: { duration: 1 } }}
                >
                    <motion.div
                        animate={{ x: 100, y: 100 }}
                        style={{ x, y }}
                        transition={{ y: { type: false }, x: { duration: 1 } }}
                        onUpdate={() => {
                            resolve([x.get(), y.get()])
                        }}
                    />
                </MotionConfig>
            )
            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        const [x, y] = await promise

        expect(x).not.toBe(100)
        expect(y).toBe(100)
    })
})
