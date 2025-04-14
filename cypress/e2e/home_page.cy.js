describe('Top Level Animations', () => {
  it('successfully play', () => {
    cy.visit('/tests')
    cy.url().should('include', '/tests')
    // check tweened box
    cy.get('#tweenedbox').then(($el) => {
      const initialTransform = $el.css('transform');
      cy.get($el).should(($elAfter) => {
        const newTransform = $elAfter.css('transform');
        expect(newTransform).to.not.equal(initialTransform);
      });
    });

    // check springed box
    cy.get('#springbox').then(($el) => {
      const initialTransform = $el.css('transform');
      cy.get($el).should(($elAfter) => {
        const newTransform = $elAfter.css('transform');
        expect(newTransform).to.not.equal(initialTransform);
      });
    });

    // check repeatbox box
    cy.get('#repeatbox').then(($el) => {
      const initialTransform = $el.css('transform');
      cy.get($el).should(($elAfter) => {
        const newTransform = $elAfter.css('transform');
        expect(newTransform).to.not.equal(initialTransform);
      });
    });

    // check reverse box
    cy.get('#reversebox').then(($el) => {
      const initialTransform = $el.css('transform');
      cy.get($el).should(($elAfter) => {
        const newTransform = $elAfter.css('transform');
        expect(newTransform).to.not.equal(initialTransform);
      });
    });
    
    // check hover scale

    cy.get('#whilehoverscale').then((el) => {
      const initWidth = el.css('width')
      cy.get(el).realHover().wait(500)
      .should((elAf) => {
        const newWidth = elAf.css('width')
        expect(initWidth).to.not.equal(newWidth)
      })
      
    })

    // check hover rotate
    cy.get('#whilehoverrotate').then((el) => {
      // const initWidth = el.css('width')
      const initTransform = el.css('transform')
      cy.get(el).realHover().wait(500)
      .should((elAf) => {
        // const newWidth = elAf.css('width')
        const newTransform = elAf.css('transform')
        // expect(initWidth).to.not.equal(newWidth)
        expect(initTransform).to.not.equal(newTransform)
      })
      
    })
    // check hover color
    cy.get('#whilehovercolor').then((el) => {
      // const initWidth = el.css('width')
      const initColor = el.css('background-color')
      cy.get(el).realHover()
      cy.wait(500)
      cy.get(el).realMouseUp().should((elAf) => {
        // const newWidth = elAf.css('width')
        const newColor = elAf.css('background-color')
        // expect(initWidth).to.not.equal(newWidth)
        expect(initColor).to.not.equal(newColor)
      })
      
    })

    // check tap rotate
    cy.get('#whiletaprotate').then((el) => {
      cy.get(el).realMouseDown()
      const initTransform = el.css('transform')
      cy.wait(500)
      cy.get(el).realMouseUp().should((elAf) => {
        const newTransform = elAf.css('transform')
        expect(initTransform).to.not.equal(newTransform)
      }) 
    })

    // check tap scale
    cy.get('#whiletapscale').then((el) => {
      cy.get(el).realMouseDown()
      const initWidth = el.css('width')
      cy.wait(500)
      cy.get(el).realMouseUp().should((elAf) => {
        const newWidth = elAf.css('width')
        expect(initWidth).to.not.equal(newWidth)
      }) 
    })
    
    // check if drag effect works
    cy.get('#drageffect').then((el) => {
      const initTransform = el.css('transform')
      cy.get(el).realMouseDown().wait(500).realMouseMove(5, 1)
      .wait(500)
      .realMouseUp().should((elAf) => {
        const newTransform = elAf.css('transform')
        expect(initTransform).to.not.equal(newTransform)
      })
    })

    // check ucecycle
    cy.get('#usecycle').then((el) => {
      const initColor = el.css('background-color')
      cy.get(el).realClick()
      .wait(500)
      .realClick().should((elAf) => {
        const newColor = elAf.css('background-color')
        expect(initColor).to.not.equal(newColor)
      })

    })

    // drag constraint
    cy.get('#dragconstraint').then((el) => {
      const initTransform = el.css('transform')
      cy.get(el).realSwipe('toLeft')
      .wait(500)
      .should((elAf) => {
        const newTransform = elAf.css('transform')
        expect(initTransform).to.not.equal(newTransform)
      })
    })

    // drag direction lock
    cy.get('#dragdirlock').then((el) => {
      const initTransform = el.css('transform')
      cy.get(el).realMouseDown().wait(500).realMouseMove(5, 1)
      .wait(500)
      .realMouseUp().should((elAf) => {
        const newTransform = elAf.css('transform')
        expect(initTransform).to.not.equal(newTransform)
      })
    })

    // check drag transform
    cy.get('#dragtransform').then((el) => {
      const initTransform = el.css('transform')
      cy.get(el).realMouseDown().wait(500).realMouseMove(5, 1)
      .wait(500)
      .realMouseUp().should((elAf) => {
        const newTransform = elAf.css('transform')
        expect(initTransform).to.not.equal(newTransform)
      })
    })
    // check drag 3d transform
    cy.get('#drag3dtransform').then((el) => {
      const initTransform = el.css('transform')
      cy.get(el).realMouseDown().wait(500).realMouseMove(20, 10)
      .wait(500)
      .realMouseUp().should((elAf) => {
        const newTransform = elAf.css('transform')
        expect(initTransform).to.not.equal(newTransform)
      })
    })

    cy.get('#dragcolor').then((el) => {
      const initTransform = el.css('background')
      cy.get(el).realMouseDown().wait(500).realMouseMove(5, 1)
      .wait(500)
      .realMouseUp().should((elAf) => {
        const newTransform = elAf.css('background')
        expect(initTransform).to.not.equal(newTransform)
      })
    })

    cy.get('#morphsvg').then(($el) => {
      const initialTransform = $el.css('width');
      cy.get($el).should(($elAfter) => {
        const newTransform = $elAfter.css('width');
        expect(newTransform).to.not.equal(initialTransform);
      });
    });
  })
})