describe('Kanban cross-column reorder', () => {
	it('previews and commits cross-column reorder on hover', () => {
		cy.visit('/demo/kanban-board');
		cy.contains('.card', 'Order Pym Particles (bulk)', { timeout: 15000 }).should('exist');

		cy.contains('.card', 'Order Pym Particles (bulk)').as('dragged');
		cy.contains('.card', 'Stop Thanos (deprioritised)').as('target');

		cy.get('@target').then(([$target]) => {
			const targetRect = $target.getBoundingClientRect();

			cy.get('@dragged')
				.then(([$dragged]) => {
					const draggedRect = $dragged.getBoundingClientRect();
					const startX = draggedRect.left + draggedRect.width / 2;
					const startY = draggedRect.top + draggedRect.height / 2;
					const hoverX = targetRect.left + targetRect.width / 2;
					const hoverY = targetRect.top + targetRect.height / 4;

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
							clientY: startY + 10,
							pageX: startX + 10,
							pageY: startY + 10,
							force: true,
						})
						.wait(50)
						.trigger('pointermove', {
							clientX: hoverX,
							clientY: hoverY,
							pageX: hoverX,
							pageY: hoverY,
							force: true,
						})
						.wait(100);
				})
				.get('.drop-ghost')
				.should('exist')
				.get('.column')
				.eq(1)
				.find('.card')
				.then(($cards) => {
					const titles = [...$cards].map((card) => card.textContent?.trim());
					expect(titles).to.deep.equal([
						'Order Pym Particles (bulk)',
						'Stop Thanos (deprioritised)',
						'Refactor Vibranium service',
					]);
				})
				.get('@dragged')
				.trigger('pointerup', {
					clientX: targetRect.left + 20,
					clientY: targetRect.top + 20,
					pageX: targetRect.left + 20,
					pageY: targetRect.top + 20,
					force: true,
				})
				.get('.column')
				.eq(1)
				.find('.card')
				.then(($cards) => {
					const titles = [...$cards].map((card) => card.textContent?.trim());
					expect(titles).to.deep.equal([
						'Order Pym Particles (bulk)',
						'Stop Thanos (deprioritised)',
						'Refactor Vibranium service',
					]);
				});
		});
	});
});
