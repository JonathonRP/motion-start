describe('Docs kanban live interaction', () => {
	const visitKanban = () => {
		cy.visit(Cypress.env('KANBAN_DOCS_URL') || '?test=kanban-docs');
		cy.get('[data-kanban-board]', { timeout: 30000 }).should('have.attr', 'data-kanban-ready', 'true');
	};

	it('animates displaced siblings during a within-column reorder', () => {
		visitKanban();
		cy.window().then((window) => window.scrollTo(0, 0));

		cy.get('#villain-card-glowing-rock').then(([$dragged]) => {
			cy.get('#villain-card-blot-out-sun').then(([$displaced]) => {
				const draggedRect = $dragged.getBoundingClientRect();
				const displacedRect = $displaced.getBoundingClientRect();
				const startX = draggedRect.left + draggedRect.width / 2;
				const startY = draggedRect.top + draggedRect.height / 2;
				const reorderY = displacedRect.top + displacedRect.height * 0.75;

				cy.wrap($dragged)
					.trigger('pointerdown', {
						clientX: startX,
						clientY: startY,
						pageX: startX,
						pageY: startY,
						force: true,
						scrollBehavior: false,
					})
					.trigger('pointermove', {
						clientX: startX,
						clientY: startY + 8,
						pageX: startX,
						pageY: startY + 8,
						force: true,
						scrollBehavior: false,
					})
					.wait(40)
					.trigger('pointermove', {
						clientX: startX,
						clientY: reorderY,
						pageX: startX,
						pageY: reorderY,
						force: true,
						scrollBehavior: false,
					});

				cy.window()
					.then(
						(window) =>
							new Cypress.Promise<string[]>((resolve) => {
								const transforms: string[] = [];
								const sample = () => {
									transforms.push(window.getComputedStyle($displaced).transform);
									if (transforms.length === 14) resolve(transforms);
									else window.requestAnimationFrame(sample);
								};
								window.requestAnimationFrame(sample);
							})
					)
					.then((transforms) => {
						const animated = transforms.filter((transform) => transform !== 'none');
						expect(animated.length, `expected projection transforms, got ${transforms.join(' -> ')}`).to.be.greaterThan(
							2
						);
						expect(new Set(animated).size, 'displaced card should move across multiple frames').to.be.greaterThan(2);
					});

				cy.wrap($dragged).trigger('pointerup', {
					clientX: startX,
					clientY: reorderY,
					pageX: startX,
					pageY: reorderY,
					force: true,
					scrollBehavior: false,
				});
			});
		});
	});

	it('reparents the active li into the target ul without reordering its source column', () => {
		visitKanban();
		cy.window().then((window) => window.scrollTo(0, 0));

		cy.get("[data-kanban-column='scheming'] ul").should('have.prop', 'tagName', 'UL');
		cy.get('#villain-card-glowing-rock').should('have.prop', 'tagName', 'LI');

		cy.get("[data-kanban-column='scheming'] li").then(($sourceCards) => {
			const sourceOrder = [...$sourceCards].map((card) => card.id);

			cy.get('#villain-card-glowing-rock').then(([$dragged]) => {
				cy.get("[data-kanban-column='in-motion'] ul").then(([$targetList]) => {
					const draggedRect = $dragged.getBoundingClientRect();
					const targetRect = $targetList.getBoundingClientRect();
					const startX = draggedRect.left + draggedRect.width / 2;
					const startY = draggedRect.top + draggedRect.height / 2;
					const targetX = targetRect.left + targetRect.width / 2;
					const targetY = targetRect.top + 16;
					const followY = targetY + 20;

					cy.wrap($dragged)
						.trigger('pointerdown', {
							clientX: startX,
							clientY: startY,
							pageX: startX,
							pageY: startY,
							force: true,
							scrollBehavior: false,
						})
						.trigger('pointermove', {
							clientX: startX + 8,
							clientY: startY,
							pageX: startX + 8,
							pageY: startY,
							force: true,
							scrollBehavior: false,
						})
						.wait(50)
						.trigger('pointermove', {
							clientX: targetX,
							clientY: targetY,
							pageX: targetX,
							pageY: targetY,
							force: true,
							scrollBehavior: false,
						});

					cy.get("[data-kanban-column='in-motion'] ul #villain-card-glowing-rock")
						.should('exist')
						.and('have.prop', 'tagName', 'LI');
					cy.get("[data-kanban-column='scheming'] #villain-card-glowing-rock").should('not.exist');

					cy.get("[data-kanban-column='scheming'] li").then(($remainingCards) => {
						expect(
							[...$remainingCards].map((card) => card.id),
							'source order should remain stable after the card crosses columns'
						).to.deep.equal(sourceOrder.filter((id) => id !== 'villain-card-glowing-rock'));
					});

					cy.get("[data-kanban-column='in-motion'] ul li")
						.first()
						.should('have.attr', 'id', 'villain-card-glowing-rock');

					cy.get('#villain-card-glowing-rock')
						.trigger('pointermove', {
							clientX: targetX,
							clientY: followY,
							pageX: targetX,
							pageY: followY,
							force: true,
							scrollBehavior: false,
						})
						.should(($card) => {
							const rect = $card[0].getBoundingClientRect();
							expect(targetX, 'pointer x should stay inside the card after handoff').to.be.within(
								rect.left,
								rect.right
							);
							expect(followY, 'pointer y should stay inside the card after handoff').to.be.within(
								rect.top,
								rect.bottom
							);
						})
						.trigger('pointerup', {
							clientX: targetX,
							clientY: followY,
							pageX: targetX,
							pageY: followY,
							force: true,
							scrollBehavior: false,
						});

					cy.get("[data-kanban-column='in-motion'] #villain-card-glowing-rock").should('exist');
				});
			});
		});
	});
});
