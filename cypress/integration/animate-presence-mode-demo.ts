function readTopAt(index: number) {
	const element = Cypress.$('ul li')[index] as HTMLElement | undefined;
	if (!element) throw new Error(`Missing item at index ${index}`);
	return element.getBoundingClientRect().top;
}

function expectAnimating(value: number, initial: number, final: number) {
	expect(Math.abs(value - initial)).to.be.greaterThan(1);
	expect(Math.abs(value - final)).to.be.greaterThan(1);
}

describe('AnimatePresenceMode demo', () => {
	beforeEach(() => {
		cy.visit('?test=animate-presence-mode-demo');
		cy.get('html').should('have.attr', 'data-fixture-ready', 'animate-presence-mode-demo');
		cy.wait(150);
		cy.contains('button', 'Add item').click();
		cy.contains('button', 'Add item').click();
		cy.contains('button', 'Add item').click();
		cy.wait(200);
	});

	it('animates lower siblings in default sync mode when a middle card exits', () => {
		const initial2 = readTopAt(2);
		const initial3 = readTopAt(3);

		cy.get('ul li').eq(1).click();
		cy.wait(550);

		cy.then(() => {
			expectAnimating(readTopAt(1), initial2, initial2 - 100);
			expectAnimating(readTopAt(2), initial3, initial3 - 100);
		});
	});
});
