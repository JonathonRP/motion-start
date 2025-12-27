/**
 * @file Mirrored from framer-motion@11.11.11
 * @source https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/motion/__tests__/lazy.test.tsx
 *
 * TODO: Port to Svelte 5 runes API
 * - Replace React component patterns with Svelte component patterns
 * - Convert hooks to Svelte 5 runes ($state, $derived, $effect)
 * - Adapt testing utilities for Svelte testing library
 */

import { render } from "../../../jest.setup"
import { m, motion, LazyMotion, domAnimation, domMax } from "../.."
import { motionValue } from "../../value"

describe("Lazy feature loading", () => {
    test("Doesn't animate without loaded features", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <m.div
                    animate={{ x: 20 }}
                    transition={{ duration: 0.01 }}
                    style={{ x }}
                    onAnimationComplete={onComplete}
                />
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
            setTimeout(() => resolve(x.get()), 50)
        })

        return expect(promise).resolves.not.toBe(20)
    })

    test("Does animate with synchronously-loaded domAnimation", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <LazyMotion features={domAnimation}>
                    <m.div
                        animate={{ x: 20 }}
                        transition={{ duration: 0.01 }}
                        style={{ x }}
                        onAnimationComplete={onComplete}
                    />
                </LazyMotion>
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toBe(20)
    })

    test("Does animate with synchronously-loaded domMax", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <LazyMotion features={domMax}>
                    <m.div
                        animate={{ x: 20 }}
                        transition={{ duration: 0.01 }}
                        style={{ x }}
                        onAnimationComplete={onComplete}
                    />
                </LazyMotion>
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toBe(20)
    })

    test("Supports nested feature sets", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <LazyMotion features={domMax}>
                    <m.div
                        animate={{ x: 20 }}
                        transition={{ duration: 0.01 }}
                        style={{ x }}
                        onAnimationComplete={onComplete}
                    />
                </LazyMotion>
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toBe(20)
    })

    test("Doesn't throw without strict mode", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <LazyMotion features={domMax}>
                    <motion.div
                        animate={{ x: 20 }}
                        transition={{ duration: 0.01 }}
                        style={{ x }}
                        onAnimationComplete={onComplete}
                    />
                </LazyMotion>
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toBe(20)
    })

    test("Throws in strict mode", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <LazyMotion features={domMax} strict>
                    <motion.div
                        animate={{ x: 20 }}
                        transition={{ duration: 0.01 }}
                        style={{ x }}
                        onAnimationComplete={onComplete}
                    />
                </LazyMotion>
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).rejects.toThrowError()
    })

    test("Animates after async loading", async () => {
        const promise = new Promise((resolve) => {
            const x = motionValue(0)
            const onComplete = () => resolve(x.get())

            const Component = () => (
                <LazyMotion
                    features={() =>
                        import("./lazy-async-endpoint").then(
                            ({ domAnimation: features }: any) => features
                        )
                    }
                    strict
                >
                    <m.div
                        animate={{ x: 20 }}
                        transition={{ duration: 0.01 }}
                        style={{ x }}
                        onAnimationComplete={onComplete}
                    />
                </LazyMotion>
            )

            const { rerender } = render(<Component />)
            rerender(<Component />)
        })

        return expect(promise).resolves.toBe(20)
    })
})
