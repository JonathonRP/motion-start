/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/use-motion-value-event.test.tsx
 */

// TODO: Svelte 5 migration needed

import { render } from "../../../jest.setup"
import { useMotionValue } from "../../value/use-motion-value"
import { useMotionValueEvent } from "../use-motion-value-event"

describe("useMotionValueEvent", () => {
    test("useMotionValueEvent infers type for change callback", () => {
        const Component = () => {
            const x = useMotionValue(0)
            useMotionValueEvent(x, "change", (latest) => latest / 2)
            return null
        }

        render(<Component />)
    })
})
