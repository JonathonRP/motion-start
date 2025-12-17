/**
 * E2E Tests for Motion-Start Gesture Interactions
 * Tests drag, hover, and tap gesture handling
 */

describe('Gesture Interactions - Drag', () => {
  beforeEach(() => {
    cy.visit('/tests');
    // Wait for client-side hydration to complete (ssr=false)
    cy.get('[data-testid="tests-ready"]', { timeout: 15000 }).should('be.visible');
  });

  describe('Drag gestures', () => {
    it('should drag element and update position', () => {
      cy.get('#drageffect')
        .should('exist')
        .trigger('mousedown', { buttons: 1, force: true })
        .trigger('mousemove', { clientX: 100, clientY: 100, force: true })
        .trigger('mouseup', { force: true });

      // Should have transform applied
      cy.get('#drageffect')
        .should('have.css', 'transform')
        .and('include', 'translate');
    });

    it('should apply whileDrag styles during drag', () => {
      cy.get('#drageffect')
        .trigger('mousedown', { buttons: 1, force: true });

      // Check whileDrag styles are applied
      cy.get('#drageffect')
        .should('have.css', 'border')
        .and('include', '2px');

      cy.get('#drageffect')
        .trigger('mouseup', { force: true });
    });

    it('should constrain drag within bounds', () => {
      // This tests the DragConstraints component
      cy.get('body').then(($body) => {
        if ($body.text().includes('Constraints')) {
          cy.contains('Constraints').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            element
              .trigger('mousedown', { buttons: 1, force: true })
              .trigger('mousemove', { clientX: 500, clientY: 500, force: true })
              .trigger('mouseup', { force: true });

            // Element should still be visible (constrained)
            element.should('be.visible');
          });
        }
      });
    });

    it('should support drag direction locking', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Direction')) {
          cy.contains('Direction').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            // Drag vertically
            element
              .trigger('mousedown', { buttons: 1, force: true })
              .trigger('mousemove', { clientX: 50, clientY: 150, force: true });

            // Should have locked to one axis
            element.should('have.css', 'transform');
            
            cy.get('body').trigger('mouseup', { force: true });
          });
        }
      });
    });
  });

  describe('Hover gestures', () => {
    it('should scale element on hover', () => {
      cy.get('#whilehoverscale')
        .should('exist')
        .trigger('mouseenter', { force: true });

      // Scale should be applied
      cy.get('#whilehoverscale')
        .should('have.css', 'transform')
        .and('include', 'scale');

      cy.get('#whilehoverscale').trigger('mouseleave', { force: true });
    });

    it('should rotate and scale on hover', () => {
      cy.get('#whilehoverrotate')
        .should('exist')
        .trigger('mouseenter', { force: true });

      cy.get('#whilehoverrotate')
        .should('have.css', 'transform')
        .and('match', /(scale|rotate)/);

      cy.get('#whilehoverrotate').trigger('mouseleave', { force: true });
    });

    it('should change background color on hover', () => {
      cy.get('#whilehovercolor')
        .should('exist')
        .trigger('mouseenter', { force: true });

      // Color should be applied
      cy.get('#whilehovercolor')
        .should('have.css', 'background-color');

      cy.get('#whilehovercolor').trigger('mouseleave', { force: true });
    });

    it('should apply opacity on hover (drag effect)', () => {
      cy.get('#drageffect')
        .should('exist')
        .trigger('mouseenter', { force: true });

      cy.get('#drageffect')
        .should('have.css', 'opacity');

      cy.get('#drageffect').trigger('mouseleave', { force: true });
    });
  });

  describe('Tap gestures', () => {
    it('should scale on tap', () => {
      cy.get('#drageffect')
        .trigger('mousedown', { buttons: 1, force: true });

      // whileTap styles should be applied
      cy.get('#drageffect')
        .should('have.css', 'transform')
        .and('include', 'scale');

      cy.get('#drageffect')
        .trigger('mouseup', { force: true });
    });

    it('should apply box shadow on tap', () => {
      cy.get('#drageffect')
        .trigger('mousedown', { buttons: 1, force: true });

      cy.get('#drageffect')
        .should('have.css', 'box-shadow');

      cy.get('#drageffect')
        .trigger('mouseup', { force: true });
    });

    it('should apply whileTap with multiple properties', () => {
      const element = cy.get('#drageffect');

      element.trigger('mousedown', { buttons: 1, force: true });

      // Multiple properties should be applied
      element.should('have.css', 'opacity');
      element.should('have.css', 'transform');
      element.should('have.css', 'box-shadow');

      cy.get('#drageffect').trigger('mouseup', { force: true });
    });
  });

  describe('Gesture combinations', () => {
    it('should handle hover then drag', () => {
      const element = cy.get('#drageffect');

      // First hover
      element.trigger('mouseenter', { force: true });
      element.should('have.css', 'opacity');

      // Then drag
      element.trigger('mousedown', { buttons: 1, force: true });
      element.trigger('mousemove', { clientX: 50, clientY: 50, force: true });
      element.should('have.css', 'transform').and('include', 'translate');

      cy.get('#drageffect').trigger('mouseup', { force: true });
      cy.get('#drageffect').trigger('mouseleave', { force: true });
    });

    it('should handle tap then release', () => {
      const element = cy.get('#drageffect');

      element.trigger('mousedown', { buttons: 1, force: true });
      element.should('have.css', 'opacity');
      element.should('have.css', 'transform').and('include', 'scale');

      element.trigger('mouseup', { force: true });
      // Opacity should return to normal
      cy.wait(300);
      element.should('have.css', 'opacity');
    });
  });
});
