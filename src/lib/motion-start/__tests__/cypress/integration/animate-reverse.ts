/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("animate() x layout prop in reverse speed", () => {
    it("animate() plays as expected when layout prop is present", () => {
        cy.visit("?test=animate-reverse")
            .wait(1000)
            .get("#action")
            .trigger("click", 1, 1, { force: true })
            .wait(600)
            .get("#result")
            .should(([$element]: any) => {
                expect($element.value).to.equal("Success")
            })
    })
})
