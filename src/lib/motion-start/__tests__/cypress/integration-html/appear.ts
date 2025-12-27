/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

Cypress.config({
    baseUrl: "http://localhost:8000/optimized-appear/",
})

describe("Correctly plays and resumes from optimized appear animations", () => {
    const tests = require("../fixtures/appear-tests.json")

    tests.forEach((test) => {
        it(test, () => {
            cy.visit(test)
            cy.wait(1000)
                .get('[data-layout-correct="false"]')
                .should("not.exist")
        })
    })
})
