type Bounds = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

type Point = {
	x: number;
	y: number;
};

type TargetReorderFrame = {
	activeCard: Bounds;
	displacedTop: number;
	displacedTransform: string;
};

const POINTER_TOLERANCE = 8;

function getBounds(element: HTMLElement): Bounds {
	const { left, right, top, bottom } = element.getBoundingClientRect();
	return { left, right, top, bottom };
}

function sampleAnimationFrames<T>(window: Window, frameCount: number, capture: () => T): Cypress.Promise<T[]> {
	return new Cypress.Promise<T[]>((resolve, reject) => {
		const frames: T[] = [];
		const sample = () => {
			try {
				frames.push(capture());
			} catch (error) {
				reject(error);
				return;
			}

			if (frames.length === frameCount) resolve(frames);
			else window.requestAnimationFrame(sample);
		};
		window.requestAnimationFrame(sample);
	});
}

function expectPointerAnchored(bounds: Bounds, pointer: Point, phase: string) {
	expect(pointer.x, `${phase}: pointer x should remain inside or close to the active card`).to.be.within(
		bounds.left - POINTER_TOLERANCE,
		bounds.right + POINTER_TOLERANCE
	);
	expect(pointer.y, `${phase}: pointer y should remain inside or close to the active card`).to.be.within(
		bounds.top - POINTER_TOLERANCE,
		bounds.bottom + POINTER_TOLERANCE
	);
}

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
					.then((window) => sampleAnimationFrames(window, 14, () => window.getComputedStyle($displaced).transform))
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

	it('keeps the active card under the pointer while reordering through target-column slots', () => {
		visitKanban();
		cy.window().then((window) => window.scrollTo(0, 0));

		cy.get("[data-kanban-column='scheming'] li").then(($sourceCards) => {
			const sourceOrder = [...$sourceCards].map((card) => card.id);

			cy.get("[data-kanban-column='in-motion'] li").then(($targetCards) => {
				const targetOrder = [...$targetCards].map((card) => card.id);

				cy.get('#villain-card-glowing-rock').then(([$dragged]) => {
					cy.get("[data-kanban-column='in-motion'] ul").then(([$targetList]) => {
						cy.get('#villain-card-bribe-parliament').then(([$middleCard]) => {
							cy.get('#villain-card-henchmen').then(([$displaced]) => {
								const draggedRect = $dragged.getBoundingClientRect();
								const targetRect = $targetList.getBoundingClientRect();
								const middleRect = $middleCard.getBoundingClientRect();
								const displacedRect = $displaced.getBoundingClientRect();
								const startX = draggedRect.left + draggedRect.width / 2;
								const startY = draggedRect.top + draggedRect.height / 2;
								const targetX = targetRect.left + targetRect.width / 2;
								// Cross between the second and third target cards, rather
								// than exercising only the target column's first slot.
								const crossY =
									(middleRect.top + middleRect.height / 2 + displacedRect.top + displacedRect.height / 2) / 2;

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
										clientX: targetX,
										clientY: crossY,
										pageX: targetX,
										pageY: crossY,
										force: true,
										scrollBehavior: false,
									});

								cy.get("[data-kanban-column='in-motion'] ul #villain-card-glowing-rock")
									.should('have.prop', 'tagName', 'LI')
									.then(([$card]) => {
										expectPointerAnchored(getBounds($card), { x: targetX, y: crossY }, 'middle-slot handoff');
									});
								cy.get("[data-kanban-column='scheming'] #villain-card-glowing-rock").should('not.exist');
								cy.get("[data-kanban-column='scheming'] li").then(($remainingCards) => {
									expect(
										[...$remainingCards].map((card) => card.id),
										'source order should remain stable during the target-column preview'
									).to.deep.equal(sourceOrder.filter((id) => id !== 'villain-card-glowing-rock'));
								});
								cy.get("[data-kanban-column='in-motion'] ul li").then(($cards) => {
									expect(
										[...$cards].map((card) => card.id),
										'crossing near the lower-middle slot should preview the card before the third target'
									).to.deep.equal([...targetOrder.slice(0, 2), 'villain-card-glowing-rock', targetOrder[2]]);
								});

								// Follow the handoff across several frames. A shared-layout
								// animation must not visually leave the held card behind.
								cy.window()
									.then((window) =>
										sampleAnimationFrames(window, 14, () => {
											const card = window.document.getElementById('villain-card-glowing-rock');
											if (!card) throw new Error('active card disappeared during the middle-slot handoff');
											return getBounds(card);
										})
									)
									.then((frames) => {
										frames.forEach((rect, index) => {
											expectPointerAnchored(rect, { x: targetX, y: crossY }, `middle-slot handoff frame ${index + 1}`);
										});
									});

								cy.get('#villain-card-henchmen').then(([$settledDisplaced]) => {
									const settledRect = $settledDisplaced.getBoundingClientRect();
									const beforeReorderTop = settledRect.top;
									// Move beyond the third card's midpoint so the preview
									// advances from slot 2 to slot 3.
									const reorderY = settledRect.bottom - 2;

									cy.get('#villain-card-glowing-rock').trigger('pointermove', {
										clientX: targetX,
										clientY: reorderY,
										pageX: targetX,
										pageY: reorderY,
										force: true,
										scrollBehavior: false,
									});

									cy.get("[data-kanban-column='in-motion'] ul li").should(($cards) => {
										expect(
											[...$cards].map((card) => card.id),
											'vertical movement should reorder the preview through a target-column slot'
										).to.deep.equal([...targetOrder, 'villain-card-glowing-rock']);
									});

									cy.window()
										.then((window) =>
											sampleAnimationFrames<TargetReorderFrame>(window, 18, () => {
												const card = window.document.getElementById('villain-card-glowing-rock');
												const displaced = window.document.getElementById('villain-card-henchmen');
												if (!card || !displaced) {
													throw new Error('card disappeared during the target-column reorder');
												}
												return {
													activeCard: getBounds(card),
													displacedTop: displaced.getBoundingClientRect().top,
													displacedTransform: window.getComputedStyle(displaced).transform,
												};
											})
										)
										.then((frames) => {
											frames.forEach(({ activeCard }, index) => {
												expectPointerAnchored(
													activeCard,
													{ x: targetX, y: reorderY },
													`target-slot reorder frame ${index + 1}`
												);
											});

											const displacedTops = frames.map(({ displacedTop }) => Math.round(displacedTop * 10) / 10);
											expect(
												new Set(displacedTops).size,
												`target sibling should animate across multiple frames from ${beforeReorderTop}; ` +
													`tops: ${displacedTops.join(' -> ')}; transforms: ${frames
														.map(({ displacedTransform }) => displacedTransform)
														.join(' -> ')}`
											).to.be.greaterThan(2);
										});

									cy.get('#villain-card-glowing-rock').trigger('pointerup', {
										clientX: targetX,
										clientY: reorderY,
										pageX: targetX,
										pageY: reorderY,
										force: true,
										scrollBehavior: false,
									});
								});
							});
						});
					});
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
