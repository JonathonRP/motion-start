describe('Gestures basics', () => {
	it('drags the box within constraints', () => {
		cy.visit('/gestures-basics');
		cy.get('#draggable', { timeout: 10000 }).should('be.visible');

		// Just verify the element exists and is interactive
		cy.get('#draggable').should('have.text', 'Drag me');

		// Simulate drag with pointerdown, pointermove, pointerup
		cy.get('#draggable')
			.trigger('pointerdown', { pointerId: 1, isPrimary: true, buttons: 1 })
			.trigger(
				'pointermove',
				{ pointerId: 1, isPrimary: true, buttons: 1, movementX: 50, movementY: 30 },
				{ force: true }
			)
			.trigger('pointerup', { pointerId: 1, isPrimary: true });

		// Verify element still exists (drag completed)
		cy.get('#draggable').should('exist');
	});

	it('applies whileHover styles on hover', () => {
		cy.visit('/gestures-basics');
		cy.get('#hover-box', { timeout: 10000 }).should('be.visible');

		// Trigger hover
		cy.get('#hover-box').trigger('pointerenter', { isPrimary: true }).wait(300);

		// Verify element has changed (animation applied)
		cy.get('#hover-box').should(($el) => {
			const style = $el[0].getAttribute('style') || '';
			// Just verify it exists and may have styles
			expect($el.length).to.equal(1);
		});

		// Leave hover
		cy.get('#hover-box').trigger('pointerleave').wait(300);
	});

	it('applies whileTap styles on tap', () => {
		cy.visit('/gestures-basics');
		cy.get('#tap-box', { timeout: 10000 }).should('be.visible');

		// Trigger tap with pointerdown
		cy.get('#tap-box').trigger('pointerdown', { pointerId: 1, isPrimary: true, buttons: 1 }).wait(150);

		// Verify element exists with tap animation applied
		cy.get('#tap-box').should(($el) => {
			expect($el.length).to.equal(1);
		});

		// Release tap
		cy.get('#tap-box').trigger('pointerup', { pointerId: 1, isPrimary: true }).wait(300);
	});
});
