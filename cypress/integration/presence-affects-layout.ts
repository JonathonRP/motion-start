describe("presenceAffectsLayout=true (default)", () => {
    beforeEach(() => {
        cy.visit("?test=presence-affects-layout").wait(50)
        cy.get("#add-with-layout").click()
        cy.get("#add-with-layout").click()
        cy.wait(400)
    })

    it("items are present after entering", () => {
        cy.get(".item-with-layout").should("have.length", 2)
    })

    it("exiting item stays in DOM during exit animation then is removed", () => {
        cy.get("#remove-with-layout").click()
        cy.get(".item-with-layout").should("have.length", 2)
        cy.wait(500)
        cy.get(".item-with-layout").should("have.length", 1)
    })

    it("all items removed after removal sequence", () => {
        cy.get("#remove-with-layout").click()
        cy.get("#remove-with-layout").click()
        cy.wait(500)
        cy.get(".item-with-layout").should("have.length", 0)
    })

    it("sibling triggers layout animation when peer exits", () => {
        cy.get("#item-with-layout-0").then(($el) => {
            const before = $el[0].getBoundingClientRect().top
            cy.get("#remove-with-layout").click()
            cy.wait(50)
            cy.get("#item-with-layout-0").should(([$el2]: any) => {
                const after = ($el2 as HTMLElement).getBoundingClientRect().top
                expect(after).not.to.equal(before)
            })
        })
    })
})

describe("presenceAffectsLayout=false", () => {
    beforeEach(() => {
        cy.visit("?test=presence-affects-layout").wait(50)
        cy.get("#add-without-layout").click()
        cy.get("#add-without-layout").click()
        cy.wait(400)
    })

    it("items are present after entering", () => {
        cy.get(".item-without-layout").should("have.length", 2)
    })

    it("exiting item stays in DOM during exit animation then is removed", () => {
        cy.get("#remove-without-layout").click()
        cy.get(".item-without-layout").should("have.length", 2)
        cy.wait(500)
        cy.get(".item-without-layout").should("have.length", 1)
    })

    it("all items removed after removal sequence", () => {
        cy.get("#remove-without-layout").click()
        cy.get("#remove-without-layout").click()
        cy.wait(500)
        cy.get(".item-without-layout").should("have.length", 0)
    })

    it("sibling does not shift position when peer exits", () => {
        cy.get("#item-without-layout-0").then(($el) => {
            const before = $el[0].getBoundingClientRect().top
            cy.get("#remove-without-layout").click()
            cy.wait(50)
            cy.get("#item-without-layout-0").should(([$el2]: any) => {
                const after = ($el2 as HTMLElement).getBoundingClientRect().top
                expect(after).to.equal(before)
            })
        })
    })
})
