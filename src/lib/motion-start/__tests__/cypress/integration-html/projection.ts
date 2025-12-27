/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

Cypress.config({
    baseUrl: "http://localhost:8000/projection/",
})

describe("Project the element to its original box", () => {
    const tests = require("../fixtures/projection-tests.json")

    tests.forEach((test) => {
        it(test, () => {
            cy.visit(test)
            cy.wait(250)
                .get('[data-layout-correct="false"]')
                .should("not.exist")
        })
    })
})
