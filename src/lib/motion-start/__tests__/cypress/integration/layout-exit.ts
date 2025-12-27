/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("Layout exit animations", () => {
    it("Allows the animation to be marked complete", () => {
        cy.visit("?test=layout-exit")
            .get("#box")
            .wait(500)
            .should(($box: any) => {
                const box = $box[0] as HTMLDivElement
                expect(box).to.not.exist
            })
    })
})
