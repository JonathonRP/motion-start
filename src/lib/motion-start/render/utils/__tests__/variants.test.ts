/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * Original file: src/render/utils/__tests__/variants.test.ts"
 */

import { resolveVariantFromProps } from "../resolve-variants"

describe("resolveVariantFromProps", () => {
    test("Resolves string", () => {
        const resolved = resolveVariantFromProps(
            { variants: { hidden: { opacity: 0 } } },
            "hidden"
        )

        expect(resolved).toEqual({ opacity: 0 })
    })

    test("Resolves function that returns object", () => {
        const resolved = resolveVariantFromProps(
            { variants: { hidden: { opacity: 0 } } },
            () => ({ opacity: 1 })
        )

        expect(resolved).toEqual({ opacity: 1 })
    })

    test("Resolves function that returns string", () => {
        const resolved = resolveVariantFromProps(
            { variants: { hidden: { opacity: 0 } } },
            () => "hidden"
        )

        expect(resolved).toEqual({ opacity: 0 })
    })
})
