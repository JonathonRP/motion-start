describe('AnimatePresence Reactivity Debug', () => {
	beforeEach(() => {
		cy.visit('/animate-presence-debug', { timeout: 15000 });
		// Wait for hydration - check for actual page content instead of flag
		cy.contains('AnimatePresence Reactivity Debug', { timeout: 15000 }).should('be.visible');
		// Then wait for the ready flag
		cy.window().its('__debugReady', { timeout: 5000 }).should('eq', true);
	});

	it('verifies parent component reactivity works', () => {
		// Check initial state
		cy.contains('Show state: false').should('be.visible');
		cy.contains('Click count: 0').should('be.visible');
		cy.get('#debug-item').should('not.exist');

		// Click to toggle
		cy.get('#debug-toggle').click();

		// Verify parent state updated
		cy.contains('Show state: true').should('be.visible');
		cy.contains('Click count: 1').should('be.visible');

		// Verify AnimatePresence child appeared
		cy.get('#debug-item', { timeout: 5000 }).should('exist').and('be.visible');
		cy.get('#debug-item').should('contain', 'I am visible!');

		// Click again to hide
		cy.get('#debug-toggle').click();

		// Verify parent state updated again
		cy.contains('Show state: false').should('be.visible');
		cy.contains('Click count: 2').should('be.visible');

		// Verify element exits (should disappear after animation)
		cy.get('#debug-item').should('not.exist');
	});

	it('captures console logs for analysis', () => {
		const logs: any[] = [];
		
		cy.window().then((win) => {
			// Intercept console.log
			cy.stub(win.console, 'log').callsFake((...args) => {
				logs.push(args);
			});
		});

		// Perform actions
		cy.get('#debug-toggle').click();
		cy.wait(500);
		cy.get('#debug-toggle').click();
		cy.wait(500);

		// Export logs
		cy.then(() => {
			cy.writeFile('/tmp/debug-console-logs.json', logs);
			cy.log('Captured logs', logs.length);
		});
	});
});
