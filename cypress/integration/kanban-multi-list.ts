describe('Kanban multi-list mid-gesture reparenting', () => {
	it('keeps following the pointer and fires exactly one drag end after being reparented into another Reorder.Group mid-drag', () => {
		cy.visit('?test=kanban-multi-list');

		cy.get('[data-testid="list-list-a"]', { timeout: 15000 }).should('exist');
		cy.get('[data-testid="list-list-b"]').should('exist');

		cy.get('#multi-item-alpha').then(([$dragged]) => {
			cy.get('[data-testid="list-list-b"]').then(([$targetList]) => {
				const draggedRect = $dragged.getBoundingClientRect();
				const targetRect = $targetList.getBoundingClientRect();
				const startX = draggedRect.left + draggedRect.width / 2;
				const startY = draggedRect.top + draggedRect.height / 2;
				const insideTargetX = targetRect.left + targetRect.width / 2;
				const insideTargetY = targetRect.top + targetRect.height / 2;
				const furtherInsideTargetX = insideTargetX;
				const furtherInsideTargetY = insideTargetY + 20;

				cy.wrap($dragged)
					.trigger('pointerdown', {
						clientX: startX,
						clientY: startY,
						pageX: startX,
						pageY: startY,
						force: true,
					})
					.wait(50)
					.trigger('pointermove', {
						clientX: startX + 10,
						clientY: startY,
						pageX: startX + 10,
						pageY: startY,
						force: true,
					})
					.wait(50)
					// Cross into the other list's bounds while the pointer is still
					// down: this must reparent the card into the other Reorder.Group
					// during the *same* gesture, not on drop.
					.trigger('pointermove', {
						clientX: insideTargetX,
						clientY: insideTargetY,
						pageX: insideTargetX,
						pageY: insideTargetY,
						force: true,
					})
					.wait(50);

				// The dragged card keeps its DOM identity (same id) but must now
				// live inside the *other* list's DOM subtree - proving it was
				// reparented mid-gesture rather than only on release.
				cy.get('[data-testid="list-list-b"] #multi-item-alpha').should('exist');
				cy.get('[data-testid="list-list-a"] #multi-item-alpha').should('not.exist');

				cy.get('[data-testid="drag-count"]')
					.invoke('text')
					.then((countAfterReparent) => {
						const dragCountAfterReparent = Number(countAfterReparent);

						// Keep moving the pointer *after* the reparent: the newly
						// mounted, same-layoutId copy must immediately continue to
						// receive and react to pointer moves from the same gesture.
						cy.get('#multi-item-alpha')
							.trigger('pointermove', {
								clientX: furtherInsideTargetX,
								clientY: furtherInsideTargetY,
								pageX: furtherInsideTargetX,
								pageY: furtherInsideTargetY,
								force: true,
							})
							.wait(50)
							.get('[data-testid="drag-count"]')
							.invoke('text')
							.then((countAfterFollowUpMove) => {
								expect(
									Number(countAfterFollowUpMove),
									'drag count should keep increasing after the reparented copy takes over the gesture'
								).to.be.greaterThan(dragCountAfterReparent);
							});
					});

				cy.get('#multi-item-alpha').should(($card) => {
					const rect = $card[0].getBoundingClientRect();
					expect(rect.left + rect.width / 2, 'reparented card should remain under the pointer on x').to.be.closeTo(
						furtherInsideTargetX,
						8
					);
					expect(rect.top + rect.height / 2, 'reparented card should remain under the pointer on y').to.be.closeTo(
						furtherInsideTargetY,
						8
					);
				});

				cy.get('[data-testid="dragend-count"]')
					.invoke('text')
					.then((countBeforeRelease) => {
						expect(
							Number(countBeforeRelease),
							'drag end must not have fired while the pointer is still down, even across the reparent'
						).to.equal(0);
					});

				cy.get('#multi-item-alpha').trigger('pointerup', {
					clientX: furtherInsideTargetX,
					clientY: furtherInsideTargetY,
					pageX: furtherInsideTargetX,
					pageY: furtherInsideTargetY,
					force: true,
				});

				cy.get('[data-testid="dragend-count"]').should(
					'have.text',
					'1',
					'exactly one drag end should fire for the whole gesture, even though the card was reparented mid-drag'
				);
			});
		});
	});
});
