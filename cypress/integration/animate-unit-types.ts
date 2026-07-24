describe("Unit conversion", () => {
    it("animates height: auto correctly", () => {
        cy.visit("?test=animate-height")
            .get("#test")
            .should(([$element]: any) => {
                expect($element.innerText).not.to.equal("Error")
                expect($element.style.height).to.equal("auto")
            })
    })

    it("animates translation from px to percent", () => {
        cy.visit("?test=animate-x-percent")
            .get("#test")
            .should(([$element]: any) => {
                expect($element.innerText).not.to.equal("Error")
                expect($element.style.transform).to.include("translateX(100%)")
                expect($element.style.transform).to.include("translateY(100%)")
                expect($element.style.transform).to.include("rotate(-30deg)")
            })
    })
})
