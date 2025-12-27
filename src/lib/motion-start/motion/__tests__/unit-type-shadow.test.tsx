/**
 * @file Mirrored from framer-motion@11.11.11
 * @source https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/motion/__tests__/unit-type-shadow.test.tsx
 *
 * TODO: Port to Svelte 5 runes API
 * - Replace React component patterns with Svelte component patterns
 * - Convert hooks to Svelte 5 runes ($state, $derived, $effect)
 * - Adapt testing utilities for Svelte testing library
 */

import { render } from "../../../jest.setup"
import { motion } from "../.."

describe("box-shadow support", () => {
    test("box-shadow should animate correctly, even with no initial set", async () => {
        const promise = new Promise(resolve => {
            const Component = () => (
                <motion.div
                    animate={{ boxShadow: "5px 5px 50px #000" }}
                    transition={{ duration: 0.05 }}
                    onAnimationComplete={resolveContainer}
                    // It'd be preferable for `boxShadow` to be read implicitly as "none" JSDom doesn't have this default
                    style={{ boxShadow: "none" }}
                />
            )

            const resolveContainer = () => {
                requestAnimationFrame(() => {
                    resolve(container.firstChild as Element)
                })
            }

            const { container, rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toHaveStyle(
            "box-shadow: 5px 5px 50px rgba(0, 0, 0, 1)"
        )
    })

    test("box-shadow should animate correctly, even when read from browser in weird format", async () => {
        const promise = new Promise(resolve => {
            const Component = () => (
                <motion.div
                    animate={{ boxShadow: "5px 5px 0px #fff" }}
                    transition={{ duration: 0.05 }}
                    onAnimationComplete={resolveContainer}
                    style={{ boxShadow: "rgb(0, 0, 0) 5px 5px 50px 0px" }}
                />
            )

            const resolveContainer = () => {
                requestAnimationFrame(() => {
                    resolve(container.firstChild as Element)
                })
            }

            const { container, rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toHaveStyle(
            "box-shadow: 5px 5px 0px rgba(255, 255, 255, 1)"
        )
    })
})
