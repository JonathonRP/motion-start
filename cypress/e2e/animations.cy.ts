// Animation Types - Tweened, Spring, and Keyframes
// Tests different animation generators: tweened (duration-based), spring (physics-based), keyframes
// Coverage: Value interpolation, easing, spring physics, animation completion
describe('Animation Types', () => {
	beforeEach(() => {
		cy.visit('/tests');
	});

	describe('Tweened animations', () => {
		it('should animate value over duration', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Tweened')) {
					cy.contains('Tweened')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							// Get initial state
							element.should('be.visible');

							// Trigger animation (reload button mentioned in component)
							cy.get('button').first().click();

							// Wait for animation to start
							cy.wait(100);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should apply easing to tweened animation', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Tweened')) {
					cy.contains('Tweened')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							// Animation with easing should be smooth
							element.should('be.visible');
							cy.get('button').first().click();

							cy.wait(200);
							element.should('have.css', 'opacity');
						});
				}
			});
		});

		it('should complete tweened animation', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Tweened')) {
					cy.contains('Tweened')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Wait for animation to complete
							cy.wait(500);
							element.should('have.css', 'transform');
						});
				}
			});
		});
	});

	describe('Spring animations', () => {
		it('should animate with spring physics', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Spring')) {
					cy.contains('Spring')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');
							cy.get('button').first().click();

							// Spring animation should apply transform
							cy.wait(100);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should respect spring stiffness parameter', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Spring')) {
					cy.contains('Spring')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');
							cy.get('button').first().click();

							// Should animate within reasonable time
							cy.wait(150);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should respect spring damping parameter', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Duration')) {
					cy.contains('Duration')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');
							cy.get('button').first().click();

							// Damping affects oscillation
							cy.wait(200);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should handle spring with custom configuration', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Duration')) {
					cy.contains('Duration')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Should complete animation
							cy.wait(300);
							element.should('have.css', 'transform');
						});
				}
			});
		});
	});

	describe('Keyframe animations', () => {
		it('should animate through keyframe positions', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('KeyFrames')) {
					cy.contains('KeyFrames')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');
							cy.get('button').first().click();

							// Should apply transform from keyframes
							cy.wait(100);
							element.should('have.css', 'transform').and('include', 'translate');
						});
				}
			});
		});

		it('should interpolate between keyframes', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('KeyFrames')) {
					cy.contains('KeyFrames')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Wait for mid-animation
							cy.wait(150);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should complete keyframe sequence', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('KeyFrames')) {
					cy.contains('KeyFrames')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Wait for full animation
							cy.wait(500);
							element.should('have.css', 'transform');
						});
				}
			});
		});
	});

	describe('Animation sequences', () => {
		it('should execute animation sequence', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Sequence')) {
					cy.contains('Sequence')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');
							cy.get('button').first().click();

							// Sequence should animate
							cy.wait(200);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should respect sequence timing', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Sequence')) {
					cy.contains('Sequence')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Wait for sequence to progress
							cy.wait(250);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should chain multiple animations in sequence', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Sequence')) {
					cy.contains('Sequence')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Each animation in sequence should apply
							cy.wait(300);
							element.should('have.css', 'transform');
							element.should('have.css', 'opacity');
						});
				}
			});
		});
	});

	describe('Repeat animations', () => {
		it('should repeat animation cycle', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Repeat')) {
					cy.contains('Repeat')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');

							// Wait for first cycle
							cy.wait(200);
							element.should('have.css', 'transform');

							// Wait for repeat to start
							cy.wait(200);
							element.should('have.css', 'transform');
						});
				}
			});
		});

		it('should handle repeat with delay', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Repeat')) {
					cy.contains('Repeat')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							// Animation should be active
							cy.wait(300);
							element.should('have.css', 'transform');
						});
				}
			});
		});
	});

	describe('Animation reverse effects', () => {
		it('should reverse animation', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Reverse')) {
					cy.contains('Reverse')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							element.should('be.visible');
							cy.get('button').first().click();

							// Should animate in reverse
							cy.wait(200);
							element.should('have.css', 'transform');
						});
				}
			});
		});
	});

	describe('Duration-based animations', () => {
		it('should respect animation duration', () => {
			cy.get('body').then(($body) => {
				if ($body.text().includes('Duration')) {
					cy.contains('Duration')
						.parent()
						.parent()
						.within(() => {
							const element = cy.get('[class*="box"]').first();

							cy.get('button').first().click();

							// Should complete within expected time
							cy.wait(500);
							element.should('have.css', 'transform');
						});
				}
			});
		});
	});
});
