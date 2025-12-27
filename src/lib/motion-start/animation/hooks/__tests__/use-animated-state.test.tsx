/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/animation/hooks/__tests__/use-animated-state.test.tsx
 *
 * Adapted for motion-start (Svelte 5)
 *
 * TODO: Adapt React components and hooks to Svelte 5 equivalents
 */

import { render } from "../../../../jest.setup"
import { useEffect } from "react"
import { useAnimatedState } from "../use-animated-state"

describe("useAnimatedState", () => {
    test("animates values", async () => {
        const promise = new Promise((resolve) => {
            const Component = () => {
                const [state, setState] = useAnimatedState({ foo: 0 })

                useEffect(() => {
                    setState({
                        foo: 100,
                        transition: { duration: 0.05 },
                    })
                }, [])

                useEffect(() => {
                    if (state.foo === 100) resolve(state.foo)
                }, [state.foo])

                return <div />
            }

            render(<Component />)
        })

        await expect(promise).resolves.toEqual(100)
    })
})
