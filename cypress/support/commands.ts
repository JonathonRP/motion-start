/// <reference types="cypress" />

/**
 * Custom Cypress Commands for Motion-Start E2E Testing
 * Commands for testing animations, gestures, and interactions
 */

/**
 * Drag element from current position to target coordinates
 * Usage: cy.get('.element').dragElement(100, 100);
 */
Cypress.Commands.add('dragElement', { prevSubject: 'element' }, (subject, x: number, y: number, options: any = {}) => {
  const { duration = 500, steps = 10 } = options;
  const rect = (subject[0] as HTMLElement).getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  
  cy.wrap(subject)
    .trigger('mousedown', { buttons: 1, force: true });
  
  // Animate drag with multiple steps for smooth motion
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const currentX = startX + (x - startX) * progress;
    const currentY = startY + (y - startY) * progress;
    
    cy.get('body').trigger('mousemove', { 
      clientX: currentX, 
      clientY: currentY, 
      force: true 
    });
    
    if (i < steps) {
      cy.wait(duration / steps);
    }
  }
  
  cy.get('body').trigger('mouseup', { force: true });
  return cy.wrap(subject);
});

/**
 * Wait for animation to complete (element has stable transform)
 */
Cypress.Commands.add('waitForAnimation', { prevSubject: 'element' }, (subject, timeout: number = 1000) => {
  let lastTransform = '';
  let stableCount = 0;
  const requiredStable = 3;
  
  return cy.wrap(subject).should(() => {
    const currentTransform = window.getComputedStyle((subject[0] as HTMLElement)).transform;
    
    if (currentTransform === lastTransform) {
      stableCount++;
    } else {
      stableCount = 0;
    }
    
    lastTransform = currentTransform;
    expect(stableCount).to.be.at.least(requiredStable);
  }, { timeout });
});

/**
 * Verify animation property exists
 */
Cypress.Commands.add('shouldAnimate', { prevSubject: 'element' }, (subject) => {
  return cy.wrap(subject)
    .should('have.css', 'transform')
    .should(() => {
      const currentTransform = window.getComputedStyle((subject[0] as HTMLElement)).transform;
      expect(currentTransform).to.not.equal('none');
    });
});

/**
 * Get transform translate values
 */
Cypress.Commands.add('getTranslate', { prevSubject: 'element' }, (subject) => {
  const transform = window.getComputedStyle((subject[0] as HTMLElement)).transform;
  
  let x = 0, y = 0;
  
  if (transform !== 'none') {
    const matrix = transform.match(/matrix\((.*)\)/);
    if (matrix) {
      const values = matrix[1].split(', ').map(Number);
      x = values[4] || 0;
      y = values[5] || 0;
    }
  }
  
  return cy.wrap({ x, y });
});

/**
 * Wait for element to have specific CSS value
 */
Cypress.Commands.add('waitForCss', { prevSubject: 'element' }, (subject, property: string, value: string, timeout: number = 1000) => {
  return cy.wrap(subject).should(($el) => {
    const computed = window.getComputedStyle(($el[0] as HTMLElement))[property as any];
    expect(computed).to.equal(value);
  }, { timeout });
});

/**
 * Trigger hover interaction
 */
Cypress.Commands.add('hoverOn', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('mouseenter', { force: true });
  return cy.wrap(subject);
});

Cypress.Commands.add('hoverOff', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('mouseleave', { force: true });
  return cy.wrap(subject);
});

/**
 * Trigger tap/click interaction
 */
Cypress.Commands.add('tapOn', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('mousedown', { buttons: 1, force: true });
  cy.wait(50);
  cy.wrap(subject).trigger('mouseup', { force: true });
  return cy.wrap(subject);
});

/**
 * Verify element has animation property
 */
Cypress.Commands.add('shouldHaveAnimation', { prevSubject: 'element' }, (subject, property: string) => {
  const transform = window.getComputedStyle((subject[0] as HTMLElement)).transform;
  expect(transform).to.include(property.toLowerCase());
  return cy.wrap(subject);
});

/**
 * Get animation opacity value
 */
Cypress.Commands.add('getOpacity', { prevSubject: 'element' }, (subject) => {
  const opacity = window.getComputedStyle((subject[0] as HTMLElement)).opacity;
  return cy.wrap(parseFloat(opacity));
});

declare global {
  namespace Cypress {
    interface Chainable {
      dragElement(x: number, y: number, options?: any): Chainable<Element>;
      waitForAnimation(timeout?: number): Chainable<Element>;
      shouldAnimate(): Chainable<Element>;
      getTranslate(): Chainable<{ x: number; y: number }>;
      waitForCss(property: string, value: string, timeout?: number): Chainable<Element>;
      hoverOn(): Chainable<Element>;
      hoverOff(): Chainable<Element>;
      tapOn(): Chainable<Element>;
      shouldHaveAnimation(property: string): Chainable<Element>;
      getOpacity(): Chainable<number>;
    }
  }
}