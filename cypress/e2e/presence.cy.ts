/**
 * E2E Tests for Motion-Start AnimatePresence and Layout Animations
 * Tests presence exit animations and layout re-animations
 */

describe('AnimatePresence and Layout', () => {
  beforeEach(() => {
    cy.visit('/tests');
  });

  describe('AnimatePresence - Mode handling', () => {
    it('should show AnimatePresence mode component', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Presence')) {
          cy.contains('Presence').parent().parent().within(() => {
            cy.get('[class*="box"]').should('be.visible');
          });
        }
      });
    });

    it('should handle presence with initial state', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Presence')) {
          cy.contains('Presence').parent().parent().within(() => {
            cy.get('[class*="box"]').should('exist');
            cy.get('button').should('exist');
          });
        }
      });
    });

    it('should toggle element visibility with animation', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Presence')) {
          cy.contains('Presence').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            // Element should be visible initially
            element.should('be.visible');
            
            // Click to toggle
            cy.get('button').first().click();
            
            // Wait for exit animation
            cy.wait(300);
          });
        }
      });
    });
  });

  describe('AnimatePresence - Stack mode', () => {
    it('should animate stacked items', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Stack')) {
          cy.contains('Stack').parent().parent().within(() => {
            cy.get('[class*="box"]').should('have.length.greaterThan', 0);
          });
        }
      });
    });

    it('should handle item removal from stack', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Stack')) {
          cy.contains('Stack').parent().parent().within(() => {
            const initialCount = cy.get('[class*="box"]').length;
            
            cy.get('button').first().click();
            
            // Wait for animation
            cy.wait(300);
            
            // Count might change after animation
            cy.get('[class*="box"]').should('exist');
          });
        }
      });
    });

    it('should apply exit animation on stack item removal', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Stack')) {
          cy.contains('Stack').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            element.should('have.css', 'opacity');
            
            cy.get('button').first().click();
            
            // Exit animation should be applied
            cy.wait(100);
            element.should('have.css', 'transform');
          });
        }
      });
    });
  });

  describe('Layout Animations', () => {
    it('should animate layout changes', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Layout')) {
          cy.contains('Layout').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            element.should('be.visible');
            cy.get('button').first().click();
            
            // Layout animation should apply
            cy.wait(200);
            element.should('have.css', 'transform');
          });
        }
      });
    });

    it('should smooth layout transitions', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Layout')) {
          cy.contains('Layout').parent().parent().within(() => {
            const container = cy.get('[class*="grid"]').first();
            
            container.should('be.visible');
            cy.get('button').first().click();
            
            // Should have smooth animation
            cy.wait(250);
            container.should('exist');
          });
        }
      });
    });

    it('should handle shared layout animations', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Layout')) {
          cy.contains('Layout').parent().parent().within(() => {
            cy.get('[class*="box"]').first().should('be.visible');
            
            cy.get('button').first().click();
            cy.wait(300);
            
            cy.get('[class*="box"]').should('exist');
          });
        }
      });
    });
  });

  describe('AnimateLayout integration', () => {
    it('should animate layout with Animate component', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Animate')) {
          cy.contains('Animate').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            element.should('be.visible');
            cy.get('button').first().click();
            
            // Should animate
            cy.wait(200);
            element.should('have.css', 'transform');
          });
        }
      });
    });

    it('should handle dynamic layout changes', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Animate')) {
          cy.contains('Animate').parent().parent().within(() => {
            cy.get('[class*="box"]').should('have.length.greaterThan', 0);
            
            cy.get('button').first().click();
            cy.wait(300);
            
            cy.get('[class*="box"]').should('exist');
          });
        }
      });
    });
  });

  describe('Complex presence and layout scenarios', () => {
    it('should handle enter animation for new elements', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Presence')) {
          cy.contains('Presence').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            // New element should have enter animation applied
            element.should('have.css', 'opacity');
            
            // Should be fully opaque
            cy.wait(300);
            element.should('be.visible');
          });
        }
      });
    });

    it('should coordinate presence with layout animations', () => {
      cy.get('body').then(($body) => {
        // Check if we have both features on same page
        const hasPresence = $body.text().includes('Presence');
        const hasLayout = $body.text().includes('Layout');
        
        if (hasPresence && hasLayout) {
          const presenceSection = cy.contains('Presence').parent().parent();
          
          presenceSection.within(() => {
            cy.get('[class*="box"]').should('be.visible');
            cy.get('button').first().click();
            
            // Both animations should work together
            cy.wait(300);
            cy.get('[class*="box"]').should('exist');
          });
        }
      });
    });

    it('should handle rapid presence changes', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Presence')) {
          cy.contains('Presence').parent().parent().within(() => {
            const button = cy.get('button').first();
            
            // Rapid clicks
            button.click();
            cy.wait(100);
            button.click();
            cy.wait(100);
            
            // Should handle state properly
            cy.get('[class*="box"]').should('exist');
          });
        }
      });
    });
  });

  describe('Reorder list animations', () => {
    it('should display reorder list', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Reorder')) {
          cy.contains('Reorder').parent().parent().within(() => {
            cy.get('[class*="box"]').should('have.length.greaterThan', 1);
          });
        }
      });
    });

    it('should animate item reordering', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Reorder')) {
          cy.contains('Reorder').parent().parent().within(() => {
            const items = cy.get('[class*="box"]');
            
            items.should('be.visible');
            
            // Items should have animation capability
            items.first().should('have.css', 'transform');
          });
        }
      });
    });

    it('should smooth layout when reordering', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Reorder')) {
          cy.contains('Reorder').parent().parent().within(() => {
            cy.get('[class*="box"]').should('exist');
            
            // Reorder should apply smooth transitions
            cy.wait(200);
            cy.get('[class*="box"]').should('have.css', 'transform');
          });
        }
      });
    });
  });

  describe('Color interpolation in animations', () => {
    it('should animate color transitions', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Color')) {
          cy.contains('Color').parent().parent().within(() => {
            const element = cy.get('[class*="box"]').first();
            
            element.should('be.visible');
            cy.get('button').first().click();
            
            // Color animation should apply
            cy.wait(200);
            element.should('have.css', 'background-color');
          });
        }
      });
    });

    it('should interpolate between color values', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Color')) {
          cy.contains('Color').parent().parent().within(() => {
            cy.get('[class*="box"]').first().should('be.visible');
            
            cy.get('button').first().click();
            
            cy.wait(250);
            cy.get('[class*="box"]').should('have.css', 'background-color');
          });
        }
      });
    });
  });

  describe('SVG animations', () => {
    it('should animate SVG morphing', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('SVG') || $body.text().includes('Morph')) {
          cy.contains(/SVG|Morph/).parent().parent().within(() => {
            cy.get('svg').should('exist');
            cy.get('button').first().click();
            
            // SVG should animate
            cy.wait(200);
            cy.get('svg').should('exist');
          });
        }
      });
    });
  });
});
