/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/components/Reorder/__tests__/server.ssr.test.tsx
 *
 * Adapted for motion-start (Svelte 5)
 *
 * TODO: Adapt React components and hooks to Svelte 5 equivalents
 */

import { renderToString, renderToStaticMarkup } from "react-dom/server"
import { useState } from "react"
import { Reorder } from ".."

describe("Reorder", () => {
    it("Correctly renders HTML", () => {
        const Component = () => (
            <Reorder.Group as="article" onReorder={() => {}} values={[]}>
                <Reorder.Item as="main" value={0} />
            </Reorder.Group>
        )

        const staticMarkup = renderToStaticMarkup(<Component />)
        const string = renderToString(<Component />)

        const expectedMarkup = `<article><main style="z-index:unset;transform:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:pan-x" draggable="false"></main></article>`

        expect(staticMarkup).toBe(expectedMarkup)
        expect(string).toBe(expectedMarkup)
    })

    it("onReorder is typed correctly", () => {
        const Component = () => {
            const [_items, setItems] = useState(["a"])
            return (
                <Reorder.Group as="article" onReorder={setItems} values={[]}>
                    <Reorder.Item as="main" value={0} />
                </Reorder.Group>
            )
        }

        const staticMarkup = renderToStaticMarkup(<Component />)
        const string = renderToString(<Component />)

        const expectedMarkup = `<article><main style="z-index:unset;transform:none;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:pan-x" draggable="false"></main></article>`

        expect(staticMarkup).toBe(expectedMarkup)
        expect(string).toBe(expectedMarkup)
    })
})
