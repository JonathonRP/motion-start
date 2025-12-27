/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("AnimatePresence", () => {
    it("Ensures all elements are removed", () => {
        cy.visit("?test=animate-presence-remove")
            .wait(50)
            .get("#remove")
            .trigger("click", 1, 1, { force: true })
            .wait(100)
            .trigger("click", 1, 1, { force: true })
            .wait(700)
            .get(".box")
            .should((results) => {
                expect(results.length).to.equal(1)
            })
    })
})
