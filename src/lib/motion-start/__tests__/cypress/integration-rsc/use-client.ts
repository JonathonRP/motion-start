/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("use client", () => {
    it("Correctly renders components", () => {
        cy.visit("/")
            .wait(100)
            .get("#test")
            .should("exist")
            .get("#m-test")
            .should("exist")
    })
})
