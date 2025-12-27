/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/subscription-manager.test.ts
 */

import { SubscriptionManager } from "../subscription-manager"

describe("SubscriptionManager", () => {
    test("Adds a subscription", () => {
        const manager = new SubscriptionManager()
        const callback = jest.fn()
        manager.add(callback)
        manager.notify(2)
        expect(callback).toBeCalledTimes(1)
        expect(callback).toBeCalledWith(2, undefined, undefined)
    })

    test("Removes a subscription", () => {
        const manager = new SubscriptionManager()
        const callback = jest.fn()
        const remove = manager.add(callback)
        remove()
        manager.notify(2)
        expect(callback).toBeCalledTimes(0)
    })

    test("Clears all subscription", () => {
        const manager = new SubscriptionManager()
        const callback = jest.fn()
        manager.add(callback)
        manager.clear()
        manager.notify(2)
        expect(callback).toBeCalledTimes(0)
    })
})
