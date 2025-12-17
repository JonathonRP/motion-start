import { expectBox } from '../support/expect-box'

describe('Gestures basics', () => {
  it('drags the box within constraints', () => {
    cy.visit('/gestures-basics');
    cy.get('#draggable', { timeout: 10000 }).should('be.visible').should(($el) => {
      const rect = $el[0].getBoundingClientRect();
      expectBox(rect).to.be.visible();
    });
    cy.get('#drag-area', { timeout: 10000 }).then(($area) => {
      const rect = $area[0].getBoundingClientRect();
      const start = { x: rect.left + 60, y: rect.top + 60 };
      const end = { x: rect.right - 60, y: rect.bottom - 60 };
      cy.get('#draggable')
        .trigger('pointerdown', { clientX: start.x, clientY: start.y, pointerId: 1 })
        .trigger('pointermove', { clientX: end.x, clientY: end.y, pointerId: 1 })
        .trigger('pointerup', { clientX: end.x, clientY: end.y, pointerId: 1 });

      cy.get('#draggable')
        .invoke('attr', 'style')
        .should('match', /translate\(\d+px, \d+px\)/);
    });
  });

  it('applies whileHover styles on hover', () => {
    cy.visit('/gestures-basics');
    cy.get('#hover-box', { timeout: 10000 }).should('be.visible').should(($el) => {
      expectBox($el[0].getBoundingClientRect()).to.be.visible();
    }).trigger('mouseenter');
    cy.get('#hover-box').should('have.class', 'hovered');
    cy.get('#hover-box').trigger('mouseleave');
    cy.get('#hover-box').should('not.have.class', 'hovered');
  });

  it('applies whileTap styles on tap', () => {
    cy.visit('/gestures-basics');
    cy.get('#tap-box', { timeout: 10000 }).should('be.visible').should(($el) => {
      expectBox($el[0].getBoundingClientRect()).to.be.visible();
    }).trigger('mousedown');
    cy.get('#tap-box').should('have.class', 'tapped');
    cy.get('#tap-box').trigger('mouseup');
    cy.get('#tap-box').should('not.have.class', 'tapped');
  });
});
