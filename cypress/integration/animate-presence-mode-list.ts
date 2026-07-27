function expectAnimating(value: number, initial: number, final: number) {
	expect(Math.abs(value - initial)).to.be.greaterThan(1);
	expect(Math.abs(value - final)).to.be.greaterThan(1);
}

function readTop(selector: string) {
	const element = Cypress.$(selector)[0] as HTMLElement | undefined;
	if (!element) throw new Error(`Missing element: ${selector}`);
	return element.getBoundingClientRect().top;
}

describe('AnimatePresence mode list layout', () => {
	beforeEach(() => {
		cy.visit('?test=animate-presence-mode-list');
		cy.get('html').should('have.attr', 'data-fixture-ready', 'animate-presence-mode-list');
		cy.wait(150);
	});

	it('animates every remaining sibling layout shift in popLayout mode', () => {
		const initialTops: number[] = [];
		const shiftedBy = 100;

		cy.get('#pop-layout').check();
		cy.get('#mode-item-1').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#mode-item-2').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#mode-item-3').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#remove-first').click();
		cy.wait(16);

		cy.then(() => {
			const samples = [readTop('#mode-item-1'), readTop('#mode-item-2'), readTop('#mode-item-3')];
			expectAnimating(samples[0], initialTops[0], initialTops[0] - shiftedBy);
			expectAnimating(samples[1], initialTops[1], initialTops[1] - shiftedBy);
			expectAnimating(samples[2], initialTops[2], initialTops[2] - shiftedBy);
		});
	});

	it('animates every remaining sibling layout shift in default sync mode after exit completes', () => {
		const initialTops: number[] = [];
		const shiftedBy = 100;

		cy.get('#mode-item-1').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#mode-item-2').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#mode-item-3').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#remove-first').click();
		cy.get('#mode-item-0').should('not.exist');
		// Svelte removes the keyed outro block before the projection update is
		// committed. Sample the following layout frame rather than the teardown
		// frame, which can contain less than one pixel of spring movement.
		cy.wait(50);

		cy.then(() => {
			const samples = [readTop('#mode-item-1'), readTop('#mode-item-2'), readTop('#mode-item-3')];
			expectAnimating(samples[0], initialTops[0], initialTops[0] - shiftedBy);
			expectAnimating(samples[1], initialTops[1], initialTops[1] - shiftedBy);
			expectAnimating(samples[2], initialTops[2], initialTops[2] - shiftedBy);
		});
	});

	it('animates lower siblings when a middle item exits in default sync mode', () => {
		const initialTops: number[] = [];
		const shiftedBy = 100;

		cy.get('#mode-item-2').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#mode-item-3').then(([$element]) => initialTops.push($element.getBoundingClientRect().top));
		cy.get('#mode-item-1').click();
		cy.get('#mode-item-1').should('not.exist');
		cy.wait(50);

		cy.then(() => {
			const samples = [readTop('#mode-item-2'), readTop('#mode-item-3')];
			expectAnimating(samples[0], initialTops[0], initialTops[0] - shiftedBy);
			expectAnimating(samples[1], initialTops[1], initialTops[1] - shiftedBy);
		});
	});
});
