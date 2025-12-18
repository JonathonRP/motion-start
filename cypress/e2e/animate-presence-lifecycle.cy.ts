// AnimatePresence - Exit Animations and Lifecycle
// Tests that AnimatePresence properly handles element removal with exit animations
// Coverage: Exit animation timing, opacity changes, DOM removal after animation completes
describe('AnimatePresence - Exit Animations', () => {

	beforeEach(() => {
		// Verify page loads with success message indicating bug is fixed
		cy.visit('/animate-presence-basics', { timeout: 15000 });
		// Wait for client-side hydration to complete (ssr=false means client-only rendering)
		// Poll for the readiness flag with an extended timeout instead of fixed waits
		cy.window().its('__apReady', { timeout: 15000 }).should('eq', true);
		cy.get('[data-testid="ap-ready"]').should('be.visible');
		// Log DOM snapshot for debugging hydration issues
		cy.get('body').then(($body) => {
			cy.log('body length', $body.html().length);
			cy.log('has wait1', $body.find('#wait-item-1').length);
			cy.log('has wait2', $body.find('#wait-item-2').length);
			cy.log('has conditional', $body.find('#conditional-item').length);
			cy.log('has animated-item', $body.find('#animated-item').length);
		});
		cy.window().then((win) => {
			cy.log('__apRenderedCount', win.__apRenderedCount ?? 'undefined');
			cy.writeFile('/tmp/ap-render-log.json', win.__apRenderLog ?? []);
		});
	});

	describe('Exit Animation', () => {
		it('shows exit animation when element is removed', () => {
			// Verify element doesn't exist initially
			cy.get('#animated-item').should('not.exist');

			// Capture initial window state
			cy.window().then((win) => {
				cy.log('Before click - showItem should be false');
			});

			// Click to show element - should enter with opacity animation (0 -> 1)
			cy.get('#toggle-btn').click();

			// Wait a moment for state propagation
			cy.wait(200);

			// Check if element appeared
			cy.get('body').then(($body) => {
				cy.log('After first click - has animated-item:', $body.find('#animated-item').length);
			});

			cy.window().then((win) => {
				cy.log('After click - render log length:', ((win as any).__apRenderLog || []).length);
				cy.writeFile('/tmp/ap-after-first-click.json', (win as any).__apRenderLog || []);
			});

			cy.get('#animated-item').should('exist').and('be.visible');

			// Verify element is fully opaque after enter animation
			cy.get('#animated-item').should('have.css', 'opacity', '1');

			// Click to hide - should start exit animation
			cy.get('#toggle-btn').click();

			// Element should still exist during exit animation
			cy.get('#animated-item').should('exist');

			// Opacity should be animating (check at 100ms - should be less than 1)
			cy.wait(100);
			cy.get('#animated-item').then(($el) => {
				const opacity = window.getComputedStyle($el[0]).opacity;
				// Should be animating out (opacity reducing from 1)
				expect(parseFloat(opacity)).to.be.lessThan(1);
			});

			// Wait for animation to complete
			cy.wait(400);

			// Element should be removed from DOM after animation completes
			cy.get('#animated-item').should('not.exist');
		});

		it('verifies exit animation completes before DOM removal', () => {
			cy.get('#toggle-btn').click();
			cy.get('#animated-item').should('be.visible');

			// Trigger exit
			cy.get('#toggle-btn').click();
			cy.get('#animated-item').should('exist');

			// Check opacity mid-animation (around 250ms)
			cy.wait(250);
			cy.get('#animated-item').then(($el) => {
				const opacity = window.getComputedStyle($el[0]).opacity;
				// Should be in middle of exit (between 0 and 1, closer to 0)
				expect(parseFloat(opacity)).to.be.greaterThan(0);
				expect(parseFloat(opacity)).to.be.lessThan(1);
			});

			// Wait for completion
			cy.wait(250);
			cy.get('#animated-item').should('not.exist');
		});
	});

	describe('Mode Wait - Sequential Animations', () => {
		it('exits current item before entering new item with mode="wait"', () => {
			// Verify initial state
			cy.get('#wait-item-1').should('exist').and('be.visible');
			cy.get('#wait-item-2').should('not.exist');

			// Click to switch items
			cy.get('#mode-wait-toggle').click();

			// Item 1 should be exiting (still in DOM)
			cy.get('#wait-item-1').should('exist');

			// Item 2 should NOT appear yet (waiting for Item 1 to exit)
			cy.get('#wait-item-2').should('not.exist');

			// Check Item 1 is animating out
			cy.wait(100);
			cy.get('#wait-item-1').then(($el) => {
				const transform = window.getComputedStyle($el[0]).transform;
				// Should have transform applied (x: 100px in exit animation)
				expect(transform).to.not.equal('none');
			});

			// Wait for Item 1 exit to complete
			cy.wait(500);
			cy.get('#wait-item-1').should('not.exist');

			// Now Item 2 should appear and be visible
			cy.get('#wait-item-2').should('exist').and('be.visible');
		});

		it('prevents overlapping animations with mode="wait"', () => {
			// Start toggle
			cy.get('#mode-wait-toggle').click();

			// Capture the exact moment of switch
			cy.get('#wait-item-1').should('exist');
			cy.get('#wait-item-2').should('not.exist');

			// At no point should both items be fully visible
			cy.wait(300);
			cy.get('body').then(() => {
				const item1 = Cypress.$('#wait-item-1');
				const item2 = Cypress.$('#wait-item-2');

				// Either item1 is exiting OR item2 hasn't entered yet
				const item1Visible = item1.length > 0;
				const item2Visible = item2.length > 0;

				if (item1Visible && item2Visible) {
					// Both exist, but they shouldn't both be fully opaque
					const op1 = window.getComputedStyle(item1[0]).opacity;
					const op2 = window.getComputedStyle(item2[0]).opacity;
					expect(parseFloat(op1) + parseFloat(op2)).to.be.lessThan(2);
				}
			});
		});
	});

	describe('Conditional Rendering', () => {
		it('handles conditional rendering with AnimatePresence', () => {
			// Initially hidden
			cy.get('#conditional-item').should('not.exist');

			// Click to show - should enter with scale animation (0 -> 1)
			cy.get('#conditional-toggle').click();
			cy.get('#conditional-item').should('exist').and('be.visible');

			// Verify scale animation completed (should be at scale: 1)
			cy.get('#conditional-item').then(($el) => {
				const transform = window.getComputedStyle($el[0]).transform;
				// Should have identity or scaled transform
				expect(transform).to.not.equal('none');
			});

			// Click to hide
			cy.get('#conditional-toggle').click();

			// Should still exist during exit animation
			cy.get('#conditional-item').should('exist');

			// Check scale is animating down (mid-animation)
			cy.wait(250);
			cy.get('#conditional-item').then(($el) => {
				const transform = window.getComputedStyle($el[0]).transform;
				// Should have scale < 1 in exit animation
				expect(transform).to.not.equal('none');
			});

			// Wait for animation to complete
			cy.wait(250);
			cy.get('#conditional-item').should('not.exist');
		});
	});

	describe('AnimatePresence Component Usage', () => {
		it('wraps conditional content correctly', () => {
			// Verify page structure - AnimatePresence should be rendering children
			cy.get('#toggle-btn').should('exist');
			cy.get('#conditional-toggle').should('exist');

			// All sections should be present
			cy.contains('Exit Animation').should('exist');
			cy.contains('Mode Wait (Exit Before Enter)').should('exist');
			cy.contains('Conditional Show/Hide').should('exist');
		});

		it('properly maintains DOM during transition', () => {
			// Show item
			cy.get('#toggle-btn').click();
			cy.get('#animated-item').should('exist');

			// During exit, element stays in DOM
			cy.get('#toggle-btn').click();
			cy.get('#animated-item').should('exist');

			// Container should stay intact
			cy.get('section').should('have.length.greaterThan', 0);

			// Wait for exit
			cy.wait(500);

			// After exit, container still intact, just element removed
			cy.get('section').should('have.length.greaterThan', 0);
			cy.get('#animated-item').should('not.exist');
		});

		it('respects AnimatePresence initial prop', () => {
			// Page should load without animations on initial render
			// (if initial={true}, items enter with animation on first load)
			cy.get('#animated-item').should('not.exist');
			cy.get('#wait-item-1').should('exist');
			cy.get('#conditional-item').should('not.exist');

			// Triggering changes should animate
			cy.get('#toggle-btn').click();
			cy.get('#animated-item').should('exist');
		});
	});

	describe('Bug Regression - Infinite Loop Prevention', () => {
		it('should not cause infinite loop when toggling show prop', () => {
			// Monitor console for excessive logs
			let logCount = 0;
			cy.window().then((win) => {
				const originalLog = win.console.log;
				win.console.log = (...args) => {
					logCount++;
					originalLog.apply(win.console, args);
				};
			});

			// Toggle the item multiple times
			cy.get('#toggle-btn').click();
			cy.wait(100);
			cy.get('#toggle-btn').click();
			cy.wait(100);
			cy.get('#toggle-btn').click();
			cy.wait(100);

			// Should not have excessive console logs (> 50 would indicate a loop)
			cy.wrap(logCount).should('be.lessThan', 50);
		});

		it('should not cause infinite loop when toggling mode=wait items', () => {
			// Monitor for infinite loops by checking DOM mutation count
			let mutationCount = 0;

			cy.get('#mode-wait-toggle').then(($toggle) => {
				const observer = new MutationObserver(() => {
					mutationCount++;
				});
				observer.observe($toggle[0].parentElement!, {
					childList: true,
					subtree: true,
				});

				// Toggle multiple times
				cy.get('#mode-wait-toggle').click();
				cy.wait(200);
				cy.get('#mode-wait-toggle').click();
				cy.wait(200);

				observer.disconnect();
			});

			// Should have reasonable number of mutations (not hundreds)
			cy.wrap(mutationCount).should('be.lessThan', 100);
		});
	});

	describe('Values Prop - List/Array Rendering', () => {
		it('should render children when using values prop', () => {
			// Mode wait uses values={waitItems}
			cy.get('#wait-item-1').should('exist').and('be.visible');
		});

		it('should expose item to slot when using values prop', () => {
			// Should render the correct item based on conditional
			cy.get('#wait-item-1').should('contain', 'Wait Item 1');

			// Toggle to second item
			cy.get('#mode-wait-toggle').click();
			cy.wait(600); // Wait for exit animation

			cy.get('#wait-item-2').should('exist').and('contain', 'Wait Item 2');
		});

		it('should conditionally render children from values array', () => {
			// Initially should show item 1
			cy.get('#wait-item-1').should('exist');
			cy.get('#wait-item-2').should('not.exist');

			// After toggle, should show item 2 (after item 1 exits with mode=wait)
			cy.get('#mode-wait-toggle').click();
			cy.wait(600); // Wait for exit

			cy.get('#wait-item-1').should('not.exist');
			cy.get('#wait-item-2').should('exist');
		});

		it('should pass item data to conditional children', () => {
			cy.get('#conditional-toggle').click();
			cy.wait(200);

			cy.get('#conditional-item').should('contain', 'Conditional Item');
		});
	});
});
