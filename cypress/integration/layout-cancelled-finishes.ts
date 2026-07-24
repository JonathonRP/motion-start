describe("Cancelled Animation", () => {
    it("Allows the animation to be marked complete", () => {
        cy.visit("?test=layout-cancelled-finishes")
            .get("[data-testid='cancellable']")
            .trigger("click")

        cy.get("[data-testid='cancellable']").should("not.exist")
    })
})
