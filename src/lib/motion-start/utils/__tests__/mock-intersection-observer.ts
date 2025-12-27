/**
 * Mirrored from framer-motion v11.11.11
 * Source: https://github.com/motiondivision/motion/blob/v11.11.11/packages/framer-motion/src/utils/__tests__/mock-intersection-observer.ts
 */

export type MockIntersectionObserverEntry = {
    isIntersecting: boolean
    target: Element
}

export type MockIntersectionObserverCallback = (
    entries: MockIntersectionObserverEntry[]
) => void

let activeIntersectionObserver: MockIntersectionObserverCallback | undefined

export const getActiveObserver = () => activeIntersectionObserver

window.IntersectionObserver = class MockIntersectionObserver {
    callback: MockIntersectionObserverCallback

    constructor(callback: MockIntersectionObserverCallback) {
        this.callback = callback
    }

    observe(_element: Element) {
        activeIntersectionObserver = this.callback
    }

    unobserve(_element: Element) {
        activeIntersectionObserver = undefined
    }

    disconnect() {
        activeIntersectionObserver = undefined
    }
} as any
