/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/use-animation-frame.test.tsx
 */

// TODO: Svelte 5 migration needed

import { render } from "../../../jest.setup"
import { useAnimationFrame } from "../use-animation-frame"

describe("useAnimationFrame", () => {
    test("Fires every animation frame", async () => {
        const totalFrameCount = await new Promise((resolve) => {
            let frameCount = 0
            const Component = () => {
                useAnimationFrame((timeSinceStart) => {
                    frameCount++
                    if (frameCount > 2) resolve(timeSinceStart)
                })

                return null
            }
            const { rerender } = render(<Component />)
            rerender(<Component />)
        })
        expect(totalFrameCount).toBeGreaterThan(25)
        expect(totalFrameCount).toBeLessThan(50)
    })

    test("Updates callback", async () => {
        const totalOutput = await new Promise<number[]>((resolve) => {
            const output: number[] = [0]
            const Component = ({ increment }: any) => {
                useAnimationFrame(() => {
                    output.push(output[output.length - 1] + increment)
                    if (output[output.length - 1] > 4) resolve(output)
                })

                return null
            }
            const { rerender } = render(<Component increment={1} />)
            rerender(<Component increment={2} />)
        })

        expect(totalOutput).toEqual([0, 2, 4, 6])
    })
})
