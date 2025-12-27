/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("Unit conversion", () => {
    it("animates height: auto correctly", () => {
        cy.visit("?test=animate-height")
            .wait(200)
            .get("#test")
            .should(([$element]: any) => {
                expect($element.innerText).not.to.equal("Error")
            })
    })

    it("animates translation from px to percent", () => {
        cy.visit("?test=animate-x-percent")
            .wait(200)
            .get("#test")
            .should(([$element]: any) => {
                expect($element.innerText).not.to.equal("Error")
            })
    })
})
