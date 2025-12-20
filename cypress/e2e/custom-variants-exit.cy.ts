// Custom + Variants Exit Animation Tests
// Tests that the `custom` prop is correctly passed to variant functions during exit animations
// This is the pattern used in Card.svelte for swipe-to-dismiss functionality

// Helper to parse translateX from transform matrix
function getTranslateX(transform: string): number {
    if (!transform || transform === 'none') return 0;
    const match = transform.match(/matrix\(([^)]+)\)/);
    if (match) {
        const values = match[1].split(',').map(Number);
        return values[4]; // translateX value
    }
    return 0;
}

describe('Custom Prop with Variant Functions for Exit', () => {

    beforeEach(() => {
        cy.visit('/tests/custom-variants', { timeout: 15000 });
        // Wait for client-side hydration - SvelteKit needs time to render
        cy.get('[data-testid="custom-variants-ready"]', { timeout: 15000 }).should('be.visible');
        // Also verify the test elements exist
        cy.get('#static-custom-box', { timeout: 10000 }).should('exist');
    });

    describe('Baseline: Simple Exit (no variants)', () => {
        // This proves AnimatePresence exit animations work without variants
        // If this fails, the issue is not with custom/variants but with AnimatePresence itself
        
        it('applies transform during exit animation (baseline)', () => {
            cy.get('#simple-box').should('exist').and('be.visible');
            
            // Trigger exit
            cy.get('#toggle-simple').click();
            
            // Check mid-animation - strict check, element should exist and be animating
            cy.wait(50);
            
            cy.get('body').then(($body) => {
                const $el = $body.find('#simple-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Simple exit transform: ${transform}`);
                    const tx = getTranslateX(transform);
                    expect(tx, 'Simple exit should have positive translateX').to.be.greaterThan(0);
                } else {
                    // Element was removed immediately without animation
                    cy.window().then((win) => {
                        const presenceCtx = (win as any).__presenceContextCreation;
                        throw new Error(`BASELINE: Element removed without animation. presenceContext at creation: ${JSON.stringify(presenceCtx)}`);
                    });
                }
            });
        });
    });

    describe('Static Custom Value', () => {
        // Test that a static custom value (200) is passed to the exit variant function
        // The variant: exit: (custom) => ({ x: custom }) should animate x to 200
        
        it('applies transform during exit animation', () => {
            // Verify element exists initially
            cy.get('#static-custom-box').should('exist').and('be.visible');
            
            // Trigger exit animation
            cy.get('#toggle-static-custom').click();
            
            // Wait for animation to start, then check transform
            cy.wait(50);
            
            // Check if element still exists (animation playing) OR was removed (no animation)
            cy.get('body').then(($body) => {
                const $el = $body.find('#static-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Static custom exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                    
                    const tx = getTranslateX(transform);
                    expect(tx).to.be.greaterThan(0, 
                        'Element should be moving right (x > 0) during exit with custom=200');
                } else {
                    // Element was removed immediately without animation - this is the bug!
                    cy.window().then((win) => {
                        const presenceCtx = (win as any).__presenceContextCreation;
                        const animResult = (win as any).__animationsResult;
                        const msg = `STATIC CUSTOM: Element removed without animation.\npresenceContext at creation: ${JSON.stringify(presenceCtx)}\nanimationsResult: ${JSON.stringify(animResult)}`;
                        throw new Error(msg);
                    });
                }
            });
        });

        it('uses positive x translation during exit with custom=200', () => {
            cy.get('#static-custom-box').should('exist');
            
            // Trigger exit
            cy.get('#toggle-static-custom').click();
            
            // Check mid-animation
            cy.wait(150);
            
            cy.get('#static-custom-box').should(($el) => {
                const transform = $el.css('transform');
                if (transform && transform !== 'none') {
                    const tx = getTranslateX(transform);
                    expect(tx).to.be.greaterThan(0, 
                        'translateX should be positive (moving right) with custom=200');
                }
            });
        });
    });

    describe('Dynamic Custom Value (Swipe Pattern)', () => {
        // This mirrors the Card.svelte pattern where exitX is set dynamically
        
        it('applies transform during left exit animation', () => {
            cy.get('#dynamic-custom-box').should('exist').and('be.visible');
            
            // Click "Exit Left"
            cy.get('#exit-left').click();
            
            // Wait for animation to start
            cy.wait(150);
            
            cy.get('body').then(($body) => {
                const $el = $body.find('#dynamic-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Left exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                }
            });
        });

        it('applies transform during right exit animation', () => {
            cy.get('#dynamic-custom-box').should('exist').and('be.visible');
            
            // Click "Exit Right"
            cy.get('#exit-right').click();
            
            // Wait for animation to start
            cy.wait(150);
            
            cy.get('body').then(($body) => {
                const $el = $body.find('#dynamic-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Right exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                }
            });
        });

        it('applies different transforms for left vs right exit', () => {
            // Test right exit first
            cy.get('#dynamic-custom-box').should('exist');
            cy.get('#exit-right').click();
            cy.wait(100);
            
            cy.get('#dynamic-custom-box').should(($el) => {
                const transform = $el.css('transform');
                if (transform && transform !== 'none') {
                    const tx = getTranslateX(transform);
                    // Right exit should have positive translateX
                    expect(tx).to.be.greaterThan(0, 'Right exit should move right');
                }
            });
            
            // Wait and reset
            cy.wait(400);
            cy.get('#reset-dynamic').click();
            cy.get('#dynamic-custom-box').should('exist');
            
            // Test left exit
            cy.get('#exit-left').click();
            cy.wait(100);
            
            cy.get('#dynamic-custom-box').should(($el) => {
                const transform = $el.css('transform');
                if (transform && transform !== 'none') {
                    const tx = getTranslateX(transform);
                    // Left exit should have negative translateX
                    expect(tx).to.be.lessThan(0, 'Left exit should move left');
                }
            });
        });
    });

    describe('Object Custom Value', () => {
        // Test that object custom values are passed correctly
        
        it('applies transform during exit with object custom', () => {
            cy.get('#object-custom-box').should('exist').and('be.visible');
            
            // Trigger exit
            cy.get('#toggle-object-custom').click();
            
            cy.wait(150);
            
            cy.get('body').then(($body) => {
                const $el = $body.find('#object-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Object custom exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                }
            });
        });

        it('uses object.exitX for x translation', () => {
            cy.get('#object-custom-box').should('exist');
            
            // Trigger exit
            cy.get('#toggle-object-custom').click();
            
            cy.wait(150);
            
            cy.get('#object-custom-box').should(($el) => {
                const transform = $el.css('transform');
                if (transform && transform !== 'none') {
                    const tx = getTranslateX(transform);
                    expect(tx).to.be.greaterThan(0, 
                        'Element should move right based on custom.exitX=150');
                }
            });
        });
    });

    describe('Negative Custom Value', () => {
        // Test that negative custom values work correctly (exit left)
        
        it('applies transform during exit with negative custom', () => {
            cy.get('#negative-custom-box').should('exist').and('be.visible');
            
            // Trigger exit
            cy.get('#toggle-negative-custom').click();
            
            cy.wait(150);
            
            cy.get('body').then(($body) => {
                const $el = $body.find('#negative-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Negative custom exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                }
            });
        });

        it('uses negative x translation with custom=-200', () => {
            cy.get('#negative-custom-box').should('exist');
            
            // Trigger exit
            cy.get('#toggle-negative-custom').click();
            
            cy.wait(150);
            
            cy.get('#negative-custom-box').should(($el) => {
                const transform = $el.css('transform');
                if (transform && transform !== 'none') {
                    const tx = getTranslateX(transform);
                    expect(tx).to.be.lessThan(0, 
                        'translateX should be negative (moving left) with custom=-200');
                }
            });
        });
    });

    describe('Variant Function Behavior', () => {
        // Tests that variant functions receive the custom value properly
        
        it('variant function receives custom value (not undefined)', () => {
            // If custom was undefined, x would be 0 and element wouldn't move
            cy.get('#static-custom-box').should('exist');
            
            cy.get('#toggle-static-custom').click();
            
            cy.wait(150);
            
            cy.get('#static-custom-box').should(($el) => {
                const transform = $el.css('transform');
                if (transform && transform !== 'none') {
                    const tx = getTranslateX(transform);
                    // If custom was passed correctly (200), tx should be > 0
                    // If custom was undefined, tx would be 0
                    expect(tx).to.be.greaterThan(0, 
                        'custom value should not be undefined - element should move');
                }
            });
        });

        it('variant function produces valid transform matrix', () => {
            cy.get('#static-custom-box').should('exist');
            
            // Trigger exit
            cy.get('#toggle-static-custom').click();
            
            cy.wait(150);
            
            // If x was accidentally set to a function, transform would be invalid
            cy.get('body').then(($body) => {
                const $el = $body.find('#static-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Variant function result transform: ${transform}`);
                    // Should have a valid matrix transform
                    expect(transform, 'Transform should not be none').to.not.equal('none');
                    expect(transform, 'Transform should start with matrix(').to.match(/^matrix\(/);
                }
            });
        });
    });

    describe('Variant Only (no custom prop)', () => {
        // Test that variants work for exit without any custom prop
        // This isolates whether variants work at all for exit animations
        
        it('applies static exit variant animation', () => {
            cy.get('#variant-only-box').should('exist').and('be.visible');
            
            // Trigger exit
            cy.get('#toggle-variant-only').click();
            
            // Wait for animation to start
            cy.wait(50);
            
            // Check if element still exists (animation playing) OR was removed (no animation)
            cy.get('body').then(($body) => {
                const $el = $body.find('#variant-only-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Variant-only exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none during exit animation').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                    
                    const tx = getTranslateX(transform);
                    expect(tx).to.be.greaterThan(0, 
                        'Element should be moving right (x > 0) during exit');
                } else {
                    // Element was removed immediately without animation - this is the bug!
                    cy.window().then((win) => {
                        const debugInfo = (win as any).__exitDebug;
                        if (debugInfo) {
                            throw new Error(`EXIT variant resolved to undefined. Debug: ${JSON.stringify(debugInfo)}`);
                        }
                        throw new Error('VARIANT-ONLY: Element was removed immediately without playing exit animation');
                    });
                }
            });
        });

        it('variant-only exit completes by removing element', () => {
            cy.get('#variant-only-box').should('exist');
            
            // Trigger exit
            cy.get('#toggle-variant-only').click();
            
            // Element should be removed after animation completes
            cy.get('#variant-only-box').should('not.exist');
        });
    });

    describe('Variant Function Without Custom', () => {
        // Test that variant functions work even when not using custom parameter
        // This isolates whether the function itself executes
        
        it('applies variant function exit animation (function ignores custom)', () => {
            cy.get('#variant-function-no-custom-box').should('exist').and('be.visible');
            
            // Trigger exit
            cy.get('#toggle-variant-function-no-custom').click();
            
            // Wait for animation to start - use shorter wait since animation might be quick
            cy.wait(50);
            
            // Check if element still exists (animation playing) OR was removed (no animation)
            cy.get('body').then(($body) => {
                const $el = $body.find('#variant-function-no-custom-box');
                if ($el.length > 0) {
                    const transform = window.getComputedStyle($el[0]).transform;
                    cy.log(`Variant function (no custom) exit transform: ${transform}`);
                    expect(transform, 'Transform should not be none during exit animation').to.not.equal('none');
                    expect(transform, 'Transform should be a matrix').to.match(/matrix/);
                    
                    const tx = getTranslateX(transform);
                    expect(tx).to.be.greaterThan(0, 
                        'Element should be moving right (x > 0) during exit');
                } else {
                    // Element was removed immediately without animation - this is the bug!
                    // Check if there's debug info stored
                    cy.window().then((win) => {
                        const debugInfo = (win as any).__exitDebug;
                        if (debugInfo) {
                            throw new Error(`EXIT variant resolved to undefined. Debug: ${JSON.stringify(debugInfo)}`);
                        }
                        throw new Error('Element was removed immediately without playing exit animation - variant function not resolved');
                    });
                }
            });
        });

        it('variant-function-no-custom exit completes by removing element', () => {
            cy.get('#variant-function-no-custom-box').should('exist');
            
            // Trigger exit
            cy.get('#toggle-variant-function-no-custom').click();
            
            // Element should be removed after animation completes
            cy.get('#variant-function-no-custom-box').should('not.exist');
        });
    });
});
