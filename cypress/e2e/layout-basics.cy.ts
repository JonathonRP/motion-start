/// <reference types="cypress" />

// Phase B: Layout basics
// Covers: layout projection, basic AnimatePresence exit, and simple layout transitions

import { expectBox } from '../support/expect-box'

describe('Layout basics', () => {
  it('projects layout changes for a resizing box', () => {
    cy.visit('/layout-basics');
    cy.get('#layout-box', { timeout: 10000 }).should('be.visible').should(($el) => {
      const rect = $el[0].getBoundingClientRect();
      expectBox(rect).to.be.visible();
    });

    // Initial width
    cy.get('#layout-box').invoke('outerWidth').then((w1) => {
      expect(w1).to.be.greaterThan(50);
      // Trigger resize
      cy.get('#resize').click();
      cy.wait(300);
      cy.get('#layout-box').invoke('outerWidth').then((w2) => {
        expect(w2).to.be.greaterThan(w1 as number);
      });
    });
  });

  it('animates layout on list add/remove', () => {
    cy.visit('/layout-basics');
    cy.get('#list', { timeout: 10000 }).should('be.visible').should(($el) => {
      const rect = $el[0].getBoundingClientRect();
      expectBox(rect).to.be.visible();
    });

    cy.get('#add').click();
    cy.get('#list .item').should('have.length.greaterThan', 3);

    cy.get('#remove').click();
    cy.get('#list .item').should('have.length.at.least', 3);
  });

  it('AnimatePresence exits element with fade/scale', () => {
    cy.visit('/layout-basics');
    cy.get('#presence-toggle').should('be.visible');
    cy.get('#presence-toggle').click();
    // element should appear
    cy.get('#presence-box').should('exist');
    // hide and ensure it exits
    cy.get('#presence-toggle').click();
    cy.wait(400);
    cy.get('#presence-box').should('not.exist');
  });
});
