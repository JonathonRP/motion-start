/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/components/MotionConfig/__tests__/index.test.tsx
 *
 * Adapted for motion-start (Svelte 5)
 *
 * TODO: Adapt React components and hooks to Svelte 5 equivalents
 */

import { useContext } from "react";
import { render } from "@testing-library/react"
import { MotionConfig } from ".."
import { MotionConfigContext } from "../../../context/MotionConfigContext"

const consumerId = "consumer"

const Consumer = () => {
    const value = useContext(MotionConfigContext)
    return <div data-testid={consumerId}>{value.transition!.type}</div>
}

const App = ({ type }: { type: string }) => (
    <MotionConfig transition={{ type }}>
        <Consumer />
    </MotionConfig>
)

it("Passes down transition", () => {
    const { getByTestId } = render(<App type="spring" />)

    expect(getByTestId(consumerId).textContent).toBe("spring")
})

it("Passes down transition changes", () => {
    const { getByTestId, rerender } = render(<App type="spring" />)
    rerender(<App type="tween" />)

    expect(getByTestId(consumerId).textContent).toBe("tween")
})
