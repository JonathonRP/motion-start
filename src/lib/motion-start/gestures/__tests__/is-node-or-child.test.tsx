/**
 * @file Mirrored from framer-motion@11.11.11
 * @source https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/gestures/__tests__/is-node-or-child.test.tsx
 *
 * TODO: Port to Svelte 5 runes API
 * - Replace React component patterns with Svelte component patterns
 * - Convert hooks to Svelte 5 runes ($state, $derived, $effect)
 * - Adapt testing utilities for Svelte testing library
 */

import { render } from "../../../jest.setup"
import { isNodeOrChild } from "../utils/is-node-or-child"

describe("isNodeOrChild", () => {
    test("tap event listeners fire", () => {
        const Component = () => (
            <div>
                <div data-testid="a">
                    <div data-testid="b" />
                </div>
                <div data-testid="c">
                    <div data-testid="d" />
                </div>
            </div>
        )

        const { container, getByTestId } = render(<Component />)

        expect(
            isNodeOrChild(
                container.firstChild as Element,
                container.firstChild as Element
            )
        ).toBe(true)
        expect(isNodeOrChild(getByTestId("a"), getByTestId("b"))).toBe(true)
        expect(isNodeOrChild(getByTestId("b"), getByTestId("a"))).toBe(false)
        expect(isNodeOrChild(getByTestId("c"), getByTestId("a"))).toBe(false)
    })
})
