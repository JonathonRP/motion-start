/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/components/LayoutGroup/__tests__/LayoutGroup.test.tsx
 *
 * Adapted for motion-start (Svelte 5)
 *
 * TODO: Adapt React components and hooks to Svelte 5 equivalents
 */

import { render } from "@testing-library/react"
import { useContext } from "react";
import { LayoutGroup } from "../index"
import { LayoutGroupContext } from "../../../context/LayoutGroupContext"

const Consumer = ({ id = "1" }: any) => {
    const value = useContext(LayoutGroupContext)
    return <div data-testid={id}>{value.id}</div>
}
it("if it's the first LayoutGroup it sets the group id", () => {
    const tree = (
        <LayoutGroup id={"a"}>
            <Consumer />
        </LayoutGroup>
    )

    const { getByTestId } = render(tree)

    expect(getByTestId("1").textContent).toBe("a")
})

it("if it's a nested LayoutGroup it appends to the group id", () => {
    const tree = (
        <LayoutGroup id={"a"}>
            <LayoutGroup id={"b"}>
                <Consumer />
            </LayoutGroup>
        </LayoutGroup>
    )

    const { getByTestId } = render(tree)

    expect(getByTestId("1").textContent).toBe("a-b")
})

it("if the value of id is undefined, it doesn't change the group id", () => {
    const tree = (
        <LayoutGroup id={"a"}>
            <LayoutGroup id={undefined}>
                <Consumer />
            </LayoutGroup>
        </LayoutGroup>
    )

    const { getByTestId } = render(tree)

    expect(getByTestId("1").textContent).toBe("a")
})

it("if the parent group id is undefined, child LayoutGroups still append the group id", () => {
    const tree = (
        <LayoutGroup id={"a"}>
            <LayoutGroup id={undefined}>
                <LayoutGroup id={"b"}>
                    <Consumer />
                </LayoutGroup>
            </LayoutGroup>
        </LayoutGroup>
    )

    const { getByTestId } = render(tree)

    expect(getByTestId("1").textContent).toBe("a-b")
})
