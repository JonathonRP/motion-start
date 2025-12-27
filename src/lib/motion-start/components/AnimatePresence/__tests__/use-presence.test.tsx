/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/components/AnimatePresence/__tests__/use-presence.test.tsx
 *
 * Adapted for motion-start (Svelte 5)
 *
 * TODO: Adapt React components and hooks to Svelte 5 equivalents
 */

import { render } from "../../../../jest.setup"
import { act, useEffect } from "react"
import { AnimatePresence } from ".."
import { usePresence } from "../use-presence"

type CB = () => void

describe("usePresence", () => {
    test("Can defer unmounting", async () => {
        const promise = new Promise<void>((resolve) => {
            let remove: CB

            const Child = () => {
                const [isPresent, safeToRemove] = usePresence()

                useEffect(() => {
                    if (safeToRemove) remove = safeToRemove
                }, [isPresent, safeToRemove])

                return <div />
            }

            const Parent = ({ isVisible }: { isVisible: boolean }) => (
                <AnimatePresence>{isVisible && <Child />}</AnimatePresence>
            )

            const { container, rerender } = render(<Parent isVisible />)

            rerender(<Parent isVisible={false} />)

            expect(container.firstChild).toBeTruthy()

            act(() => remove())

            setTimeout(() => {
                expect(container.firstChild).toBeFalsy()

                resolve()
            }, 150)
        })

        await promise
    })

    test("Multiple children can exit", async () => {
        const promise = new Promise<void>((resolve) => {
            let removeA: CB
            let removeB: CB

            const ChildA = () => {
                const [isPresent, safeToRemove] = usePresence()

                useEffect(() => {
                    if (safeToRemove) removeA = safeToRemove
                }, [isPresent, safeToRemove])

                return <div />
            }

            const ChildB = () => {
                const [isPresent, safeToRemove] = usePresence()

                useEffect(() => {
                    if (safeToRemove) removeB = safeToRemove
                }, [isPresent, safeToRemove])

                return <div />
            }

            const Parent = ({ isVisible }: { isVisible: boolean }) => (
                <AnimatePresence>
                    {isVisible && (
                        <div>
                            <ChildA />
                            <ChildB />
                        </div>
                    )}
                </AnimatePresence>
            )

            const { container, rerender } = render(<Parent isVisible />)
            rerender(<Parent isVisible={false} />)

            expect(container.firstChild).toBeTruthy()

            act(() => removeA())

            setTimeout(() => {
                expect(container.firstChild).toBeTruthy()

                act(() => removeB())

                setTimeout(() => {
                    expect(container.firstChild).toBeFalsy()

                    resolve()
                }, 100)
            }, 100)
        })

        await promise
    })

    test("Multiple children can exit over multiple rerenders", async () => {
        const promise = new Promise<void>((resolve) => {
            let removeA: CB
            let removeB: CB

            const ChildA = () => {
                const [isPresent, safeToRemove] = usePresence()

                useEffect(() => {
                    if (safeToRemove) removeA = safeToRemove
                }, [isPresent, safeToRemove])

                return <div />
            }

            const ChildB = () => {
                const [isPresent, safeToRemove] = usePresence()

                useEffect(() => {
                    if (safeToRemove) removeB = safeToRemove
                }, [isPresent, safeToRemove])

                return <div />
            }

            const Parent = ({ isVisible }: { isVisible: boolean }) => (
                <AnimatePresence>
                    {isVisible && (
                        <div>
                            <ChildA />
                            <ChildB />
                        </div>
                    )}
                </AnimatePresence>
            )

            const { container, rerender } = render(<Parent isVisible />)
            rerender(<Parent isVisible={false} />)

            expect(container.firstChild).toBeTruthy()

            act(() => removeA())

            setTimeout(() => {
                rerender(<Parent isVisible={false} />)

                setTimeout(() => {
                    expect(container.firstChild).toBeTruthy()
                    rerender(<Parent isVisible={false} />)
                    act(() => removeB())

                    setTimeout(() => {
                        expect(container.firstChild).toBeFalsy()

                        resolve()
                    }, 100)
                }, 100)
            }, 100)
        })

        await promise
    })
})
