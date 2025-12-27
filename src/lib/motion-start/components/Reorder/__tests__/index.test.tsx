/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/components/Reorder/__tests__/index.test.tsx
 *
 * Adapted for motion-start (Svelte 5)
 *
 * TODO: Adapt React components and hooks to Svelte 5 equivalents
 */

import { render } from "../../../../jest.setup"
import { useRef, useLayoutEffect } from "react"
import { Reorder } from ".."

describe("Reorder", () => {
    it("Correctly hydrates ref", () => {
        let groupRefPass = false
        let itemRefPass = false

        const Component = () => {
            const groupRef = useRef<HTMLElement>(null)
            const itemRef = useRef<HTMLElement>(null)

            useLayoutEffect(() => {
                if (groupRef.current !== null) {
                    groupRefPass = true
                }

                if (itemRef.current !== null) {
                    itemRefPass = true
                }
            })

            return (
                <Reorder.Group
                    as="article"
                    ref={groupRef}
                    onReorder={() => {}}
                    values={[]}
                >
                    <Reorder.Item as="main" ref={itemRef} value={0} />
                </Reorder.Group>
            )
        }

        render(<Component />)
        expect(groupRefPass).toBe(true)
        expect(itemRefPass).toBe(true)
    })
})
