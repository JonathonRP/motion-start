/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/value/__tests__/use-motion-value.test.tsx
 */

// TODO: Svelte 5 migration needed

import { render } from "../../../jest.setup"
import { motion } from "../../"
import { useMotionValue } from "../use-motion-value"
import { motionValue, MotionValue } from ".."
import { nextMicrotask } from "../../gestures/__tests__/utils"

describe("useMotionValue", () => {
    test("sets initial value", async () => {
        const Component = () => {
            const x = useMotionValue(100)
            return <motion.div style={{ x }} />
        }

        const { container } = render(<Component />)
        expect(container.firstChild).toHaveStyle("transform: translateX(100px)")
    })

    test("can be set manually", async () => {
        const Component = () => {
            const x = useMotionValue(100)

            x.set(500)

            return <motion.div style={{ x }} />
        }

        const { container } = render(<Component />)
        expect(container.firstChild).toHaveStyle("transform: translateX(500px)")
    })

    test("accepts new motion values", async () => {
        const a = motionValue(0)
        const b = motionValue(5)
        const Component = ({ x }: { x: MotionValue<number> }) => {
            return <motion.div style={{ x }} />
        }

        const { container, rerender } = render(<Component x={a} />)
        expect(container.firstChild).toHaveStyle("transform: none")

        rerender(<Component x={b} />)

        await nextMicrotask()

        expect(container.firstChild).toHaveStyle("transform: translateX(5px)")
    })

    test("fires callbacks", async () => {
        const onChange = jest.fn()
        const onRenderRequest = jest.fn()
        const Component = () => {
            const x = useMotionValue(100)
            x.on("change", onChange)
            x.on("renderRequest", onRenderRequest)

            x.set(500)

            return <motion.div style={{ x }} />
        }

        render(<Component />)
        expect(onChange).toHaveBeenCalled()
        expect(onRenderRequest).toHaveBeenCalled()
    })

    test("is typed", async () => {
        const Component = () => {
            const x = useMotionValue(100)
            return <motion.div style={{ x }} />
        }

        const { container } = render(<Component />)
        expect(container.firstChild).toHaveStyle("transform: translateX(100px)")
    })
})
