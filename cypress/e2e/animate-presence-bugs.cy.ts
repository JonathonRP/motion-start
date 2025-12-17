/// <reference types="cypress" />

describe('AnimatePresence - Bug Fixes', () => {
	beforeEach(() => {
		cy.visit('/animate-presence-basics');
	});

	describe('Infinite Loop Bug', () => {
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
					subtree: true
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

	describe('list/values Children Rendering', () => {
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
	});

	describe('Conditional Rendering', () => {
		it('should render children when using conditional items', () => {
			// Check conditional item is not present initially
			cy.get('#conditional-item').should('not.exist');
			
			// Toggle to show
			cy.get('#conditional-toggle').click();
			cy.wait(200);
			
			// Should now be visible
			cy.get('#conditional-item').should('exist').and('be.visible');
		});

		it('should pass item data to conditional children', () => {
			cy.get('#conditional-toggle').click();
			cy.wait(200);
			
			cy.get('#conditional-item').should('contain', 'Conditional Item');
		});
	});
});
