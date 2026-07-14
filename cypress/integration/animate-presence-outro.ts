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
});
