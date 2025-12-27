/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("CSS variables", () => {
    it("Numerical CSS var values are resolved and animated correctly", () => {
        cy.visit("?test=css-vars")
            .wait(100)
            .get("#test")
            .should(([$element]: any) => {
                expect($element.textContent).to.equal("Success")
            })
    })

    it("CSS vars are set as value at the end of an animation", () => {
        cy.visit("?test=css-vars")
            .wait(200)
            .get("#test")
            .should(([$element]: any) => {
                expect($element.style.backgroundColor).to.equal("var(--a)")
                expect($element.style.opacity).to.equal("var(--d)")
            })
    })
})
