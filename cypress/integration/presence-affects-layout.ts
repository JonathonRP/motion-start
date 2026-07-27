describe('presenceAffectsLayout=true (default)', () => {
	beforeEach(() => {
		cy.visit('?test=presence-affects-layout').wait(50);
		cy.get('#add-with-layout').click();
		cy.get('#add-with-layout').click();
		cy.wait(400);
	});

	it('items are present after entering', () => {
		cy.get('.item-with-layout').should('have.length', 2);
	});

	it('all items removed after removal sequence', () => {
		cy.get('#remove-with-layout').click();
		cy.get('#remove-with-layout').click();
		cy.wait(500);
		cy.get('.item-with-layout').should('have.length', 0);
	});

	it('layout sibling reflows in default sync mode while an exiting child remains present', () => {
		let initialTop = 0;
		let finalTop = 0;

		cy.visit('?test=presence-affects-layout')
			.wait(100)
			.get('#reflow-sibling')
			.then(([$sibling]: any) => {
				initialTop = $sibling.getBoundingClientRect().top;
				finalTop = initialTop - 44;
			})
			.get('#remove-reflow-item')
			.click()
			.wait(50)
			.get('#reflow-sibling')
			.should(([$sibling]: any) => {
				const top = $sibling.getBoundingClientRect().top;
				expect(top).to.be.lessThan(initialTop - 1);
				expect(top).to.be.greaterThan(finalTop + 1);
			})
			.wait(350)
			.get('#reflow-sibling')
			.should(([$sibling]: any) => {
				expect($sibling.getBoundingClientRect().top).to.be.closeTo(finalTop, 1);
			});
	});
});

describe('presenceAffectsLayout=false', () => {
	beforeEach(() => {
		cy.visit('?test=presence-affects-layout').wait(50);
		cy.get('#add-without-layout').click();
		cy.get('#add-without-layout').click();
		cy.wait(400);
	});

	it('items are present after entering', () => {
		cy.get('.item-without-layout').should('have.length', 2);
	});

	it('all items removed after removal sequence', () => {
		cy.get('#remove-without-layout').click();
		cy.get('#remove-without-layout').click();
		cy.wait(500);
		cy.get('.item-without-layout').should('have.length', 0);
	});

	it('does not animate the sibling layout shift when presence does not affect layout', () => {
		let initialTop = 0;
		let finalTop = 0;

		cy.visit('?test=presence-affects-layout')
			.wait(100)
			.get('#non-affecting-presence')
			.uncheck()
			.get('#non-affecting-reflow-sibling')
			.then(([$sibling]: JQuery<HTMLElement>) => {
				initialTop = $sibling.getBoundingClientRect().top;
				finalTop = initialTop - 44;
			})
			.get('#remove-non-affecting-reflow-item')
			.click()
			.wait(100)
			.get('#non-affecting-reflow-sibling')
			.should(([$sibling]: JQuery<HTMLElement>) => {
				expect($sibling.getBoundingClientRect().top).to.be.closeTo(initialTop, 1);
			})
			.get('#non-affecting-reflow-item')
			.should('not.exist')
			.wait(50)
			.get('#non-affecting-reflow-sibling')
			.should(([$sibling]: JQuery<HTMLElement>) => {
				expect($sibling.getBoundingClientRect().top).to.be.closeTo(finalTop, 1);
			});
	});
});
