/**
 * Mirrored from framer-motion@11.11.11
 * Source: https://github.com/motiondivision/motion/tree/v11.11.11
 * Original path: packages/framer-motion/src/animation/animators/waapi/__tests__/easing.test.ts
 *
 * Adapted for motion-start (Svelte 5)
 */

import { isWaapiSupportedEasing } from "../easing"
import { supportsFlags } from "../utils/supports-flags"

test("isWaapiSupportedEasing", () => {
    expect(isWaapiSupportedEasing()).toEqual(true)
    expect(isWaapiSupportedEasing("linear")).toEqual(true)
    expect(isWaapiSupportedEasing("easeIn")).toEqual(true)
    expect(isWaapiSupportedEasing("anticipate")).toEqual(false)
    expect(isWaapiSupportedEasing("backInOut")).toEqual(false)
    expect(isWaapiSupportedEasing([0, 1, 2, 3])).toEqual(true)
    supportsFlags.linearEasing = true
    expect(isWaapiSupportedEasing((v) => v)).toEqual(true)
    supportsFlags.linearEasing = false
    expect(isWaapiSupportedEasing((v) => v)).toEqual(false)
    expect(isWaapiSupportedEasing(["linear", "easeIn"])).toEqual(true)
    expect(isWaapiSupportedEasing(["linear", "easeIn", [0, 1, 2, 3]])).toEqual(
        true
    )
    expect(isWaapiSupportedEasing(["linear", "easeIn", "anticipate"])).toEqual(
        false
    )
    supportsFlags.linearEasing = true
    expect(isWaapiSupportedEasing(["linear", "easeIn", (v) => v])).toEqual(true)
    supportsFlags.linearEasing = false
    expect(isWaapiSupportedEasing(["linear", "easeIn", (v) => v])).toEqual(
        false
    )
})
