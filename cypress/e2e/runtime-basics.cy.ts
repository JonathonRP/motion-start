/**
 * Phase A: Runtime basics smoke tests
 * Coverage: animate-style, css-vars, waapi interruption, unit-conversion
 */

import { expectBox } from '../support/expect-box'

describe('Runtime basics', () => {
  describe('animate-style', () => {
    it('correctly runs a basic width animation', () => {
      cy.visit('/tests/animate-style')
        .get('#animate-style-box', { timeout: 10000 })
        .should('be.visible')
        .should(($box: any) => {
          const rect = $box[0].getBoundingClientRect();
          expectBox(rect).to.be.visible();
          expect(rect.width).to.be.greaterThan(150);
          expect(rect.width).to.be.at.most(220);
        });
    });
  });

  describe('CSS variables', () => {
    it('correctly resolves and animates CSS var values', () => {
      cy.visit('/tests/css-vars')
        .get('#css-vars-box', { timeout: 10000 })
        .should('be.visible')
        .should(($box: any) => {
          const rect = $box[0].getBoundingClientRect();
          expectBox(rect).to.be.visible();
          expect(rect.width).to.be.closeTo(150, 1);
          expect(rect.height).to.be.closeTo(150, 1);
          expect($box.text()).to.equal('Success');
        });
    });
  });

  describe('WAAPI interruption', () => {
    it('correctly interrupts and resumes animations', () => {
      cy.visit('/tests/waapi')
        .get('#waapi-box', { timeout: 10000 })
        .should('be.visible')
        .should(($box: any) => {
          const { width, opacity } = window.getComputedStyle($box[0]);
          expect(parseFloat(width)).to.be.closeTo(120, 5);
          expect(parseFloat(opacity) || 1).to.be.closeTo(1, 0.2);
        });
    });
  });

  describe('Unit conversion', () => {
    it('correctly animates and resolves em units to px', () => {
      cy.visit('/tests/unit-conversion')
        .get('#unit-box', { timeout: 10000 })
        .should('be.visible')
        .should(($box: any) => {
          const { width } = window.getComputedStyle($box[0]);
          expect(parseFloat(width)).to.be.greaterThan(150);
          expect(parseFloat(width)).to.be.at.most(170);
        });
    });
  });
});
