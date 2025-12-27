/**
 * @source https://github.com/motiondivision/motion/tree/v11.11.11/packages/framer-motion
 * @description Mirrored from framer-motion v11.11.11 Cypress E2E tests
 * @note Cypress tests should be migrated to Playwright for Svelte implementation
 */

describe("AnimatePresence with WAAPI animations", () => {
    it("Interrupting exiting animation doesn't break exit", () => {
        cy.visit("?test=animate-presence-switch-waapi")
            .wait(50)
            .get(".item")
            .should((items: any) => {
                expect(items.length).to.equal(1)
                expect(items[0].textContent).to.equal("0")
            })
            .get("#switch")
            .trigger("click", 10, 10, { force: true })
            .wait(50)
            .get(".item")
            .should((items: any) => {
                expect(items.length).to.equal(2)
                expect(items[0].textContent).to.equal("0")
                expect(items[1].textContent).to.equal("1")
            })
            .wait(200)
            .get(".item")
            .should((items: any) => {
                expect(items.length).to.equal(1)
                expect(items[0].textContent).to.equal("1")
            })
            .get("#switch")
            .trigger("click", 10, 10, { force: true })
            .wait(20)
            .get("#switch")
            .trigger("click", 10, 10, { force: true })
            .wait(20)
            .get("#switch")
            .trigger("click", 10, 10, { force: true })
            .wait(300)
            .get(".item")
            .should((items: any) => {
                expect(items.length).to.equal(1)
                expect(items[0].textContent).to.equal("0")
            })
    })

    it("Interrupting exiting animation fire more animations than expected", () => {
        cy.visit("?test=animate-presence-switch-waapi")
            .wait(50)
            .get(".item")
            .should((items: any) => {
                expect(items.length).to.equal(1)
                expect(items[0].textContent).to.equal("0")
            })
            .get("#switch")
            .trigger("click", 10, 10, { force: true })
            .wait(20)
            .get("#switch")
            .trigger("click", 10, 10, { force: true })
            .wait(300)
            .get("#count")
            .should((count: any) => {
                expect(count[0].textContent).to.equal("4")
            })
    })
})
