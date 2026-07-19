describe('AnimatePresence Svelte outro bridge', () => {
	it('retains raw if blocks for Motion exit and uses the latest custom value', () => {
		cy.visit('?test=animate-presence-outro');
		cy.get('#conditional').should('exist');
		cy.get('#direction').click();
		cy.get('#conditional').should('exist');
		cy.get('#toggle').click();
		cy.get('#conditional').should('exist');
		cy.wait(150)
			.get('#conditional')
			.should(($element) => {
				expect($element[0].getBoundingClientRect().left).to.be.lessThan(0);
			});
		cy.wait(250).get('#conditional').should('not.exist');
		cy.get('#completed').should('have.text', '1');
	});

	it('retains removed keyed each items until their exit completes', () => {
		cy.visit('?test=animate-presence-outro');
		cy.get('#remove').click();
		cy.get('#item-1').should('exist');
		cy.wait(150).get('#item-1').should('not.exist');
		cy.get('#item-0').should('exist');
	});

	it('retains an exit for the duration resolved from its exit definition', () => {
		cy.visit('?test=animate-presence-outro');
		cy.get('#remove-long').click();
		cy.wait(600).get('#long-exit').should('exist');
		cy.wait(300).get('#long-exit').should('not.exist');
	});

	it('keeps wait-mode entrants out of layout until the exit completes', () => {
		cy.visit('?test=animate-presence-outro');
		cy.get('#wait-a').should('be.visible');
		cy.get('#switch-wait').click();
		cy.get('#wait-a').should('exist');
		cy.get('#wait-b').should('not.be.visible');
		cy.wait(850).get('#wait-a').should('not.exist');
		cy.get('#wait-b').should('be.visible');
	});

	it('retains custom component roots until their exit completes', () => {
		cy.visit('?test=animate-presence-outro');
		cy.get('#remove-custom').click();
		cy.get('#custom-exit').should('exist');
		cy.wait(150).get('#custom-exit').should('have.css', 'opacity').and('not.equal', '1');
		cy.wait(200).get('#custom-exit').should('not.exist');
	});

	it('finishes nested child variants before an afterChildren parent exit', () => {
		cy.visit('?test=animate-presence-outro');
		cy.get('#remove-nested').click();
		cy.get('#nested-exit-parent').should('exist');
		cy.get('#nested-exit-child').should('exist');
		cy.get('#nested-exit-order', { timeout: 1000 }).should('have.text', 'child,parent');
		cy.get('#nested-exit-parent').should('not.exist');
		cy.get('#nested-exit-child').should('not.exist');
	});
});
