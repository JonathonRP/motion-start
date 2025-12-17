import { expectBox } from '../support/expect-box'

describe('Reorder basics', () => {
	it('renders reorder list and items', () => {
		cy.visit('/reorder-basics', { timeout: 10000 });

		// Ensure page rendered
		cy.contains('h1', 'Phase F: Reorder Basics', { timeout: 10000 }).should('exist');
		// Ensure list rendered
		cy.get('[data-testid="reorder-group"]', { timeout: 10000 }).should('exist');
		cy.get('[data-testid="item-Alpha"]').should('exist');
		cy.get('[data-testid="item-Bravo"]').should('exist');

		// Validate item boxes are visible and sized
		cy.get('[data-testid^="item-"]').each(($el) => {
			const rect = $el[0].getBoundingClientRect();
			expectBox(rect).to.be.visible();
		});

		// Initial order indicator
		cy.get('[data-testid="order"]').should('contain.text', 'Alpha,Bravo,Charlie,Delta');
	});

	it.skip('reorders via drag and updates DOM order', () => {
		cy.visit('/reorder-basics', { timeout: 10000 });
		cy.get('[data-testid="item-Alpha"]').should('exist').trigger('pointerdown', { pointerId: 1, clientY: 0, button: 0 });
		cy.get('body').trigger('pointermove', { pointerId: 1, clientY: 300 });
		cy.get('body').trigger('pointerup', { pointerId: 1 });
		cy.get('[data-testid="order"]').invoke('text').should((text) => {
			expect(text.trim()).to.not.equal('Alpha,Bravo,Charlie,Delta');
		});
	});
});
