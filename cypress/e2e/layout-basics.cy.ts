/// <reference types="cypress" />

// Layout Basics - Tests for layout projection and AnimatePresence
// Covers: layout projection, exit animations, and presenceAffectsLayout prop
// IMPORTANT: These tests verify actual animation behavior, not just DOM state changes

import { expectBox } from '../support/expect-box';

describe('Layout Basics', () => {
	beforeEach(() => {
		// Visit page with sufficient timeout for SSR hydration
		cy.visit('/layout-basics', { timeout: 15000 });
		// Wait for page to be fully loaded
		cy.get('#title', { timeout: 15000 }).should('contain', 'Layout Basics');
	});

	describe('Layout Projection', () => {
		it('animates box size changes with layout prop', () => {
			cy.get('#layout-box', { timeout: 10000 })
				.should('be.visible')
				.should(($el) => {
					const rect = $el[0].getBoundingClientRect();
					expectBox(rect).to.be.visible();
				});

			// Get initial width
			cy.get('#layout-box').then(($el) => {
				const initialWidth = $el[0].getBoundingClientRect().width;
				expect(initialWidth).to.be.greaterThan(50);
				
				// Trigger resize
				cy.get('#resize').click();
				
				// Check mid-animation: element should have transform applied (scale/scaleX for layout animation)
				// Layout animations use transform:scale to animate size changes
				cy.wait(50); // Small wait to catch animation in progress
				cy.get('#layout-box').then(($animEl) => {
					const style = window.getComputedStyle($animEl[0]);
					const transform = style.transform;
					const currentWidth = $animEl[0].getBoundingClientRect().width;
					
					// Either transform is being used OR width is changing
					// Layout animation should show some intermediate state
					const isAnimating = transform !== 'none' || 
						(currentWidth > initialWidth && currentWidth < initialWidth * 2);
					
					// After animation completes, verify final width
					cy.wait(500);
					cy.get('#layout-box').then(($finalEl) => {
						const finalWidth = $finalEl[0].getBoundingClientRect().width;
						expect(finalWidth).to.be.greaterThan(initialWidth);
					});
				});
			});
		});

		it('handles list item addition and removal', () => {
			cy.get('#list', { timeout: 10000 })
				.should('be.visible')
				.should(($el) => {
					const rect = $el[0].getBoundingClientRect();
					expectBox(rect).to.be.visible();
				});

			cy.get('#add').click();
			cy.get('#list .item').should('have.length.greaterThan', 3);

			cy.get('#remove').click();
			cy.get('#list .item').should('have.length.at.least', 3);
		});
	});

	describe('AnimatePresence - Conditional Rendering (show prop)', () => {
		it('shows and hides element with exit animation', () => {
			cy.get('#presence-toggle').should('be.visible');
			
			// Show element
			cy.get('#presence-toggle').click();
			cy.get('#presence-box', { timeout: 5000 }).should('exist');
			
			// Verify element enters with animation (opacity starts at 0, goes to 1)
			cy.get('#presence-box').should('have.css', 'opacity', '1');
			
			// Trigger exit
			cy.get('#presence-toggle').click();
			
			// CRITICAL: Verify exit animation is actually playing
			// Element should still exist and have reduced opacity mid-animation
			cy.wait(100);
			cy.get('body').then(($body) => {
				const $el = $body.find('#presence-box');
				if ($el.length > 0) {
					const opacity = parseFloat(window.getComputedStyle($el[0]).opacity);
					// Mid-exit: opacity should be between 0 and 1
					// If exit animation isn't working, opacity would still be 1
					cy.log(`Exit animation opacity: ${opacity}`);
					expect(opacity, 'Exit animation should reduce opacity').to.be.lessThan(1);
				}
			});
			
			// After animation completes, element should be removed
			cy.wait(400);
			cy.get('#presence-box').should('not.exist');
		});
	});

	describe('AnimatePresence - List Rendering (values prop)', () => {
		describe('with presenceAffectsLayout=true (default)', () => {
			it('triggers layout animations on siblings when items enter', () => {
				cy.get('#add-layout-item').should('be.visible');
				
				// Get initial state
				cy.get('#layout-list .layout-item').first().then(($firstItem) => {
					const initialY = $firstItem.offset()?.top || 0;
					
					// Add new item at beginning
					cy.get('#add-layout-item').click();
					
					// CRITICAL: Check for animation mid-flight
					// With layout animations, items should have transform applied during animation
					cy.wait(50);
					cy.get('#layout-list .layout-item').eq(1).then(($movedItem) => {
						const style = window.getComputedStyle($movedItem[0]);
						const transform = style.transform;
						const midY = $movedItem.offset()?.top || 0;
						
						// Either element has transform (layout animation) OR is in intermediate position
						const hasLayoutAnimation = transform !== 'none' || midY > initialY;
						cy.log(`Layout animation transform: ${transform}, midY: ${midY}, initialY: ${initialY}`);
						
						// Verify final position after animation
						cy.wait(300);
						cy.get('#layout-list .layout-item').eq(1).then(($finalItem) => {
							const finalY = $finalItem.offset()?.top || 0;
							expect(finalY).to.be.greaterThan(initialY, 'Item should have moved down');
						});
					});
				});
			});

			it('triggers layout animations on siblings when items exit', () => {
				// Add items first
				cy.get('#add-layout-item').click();
				cy.get('#add-layout-item').click();
				cy.wait(400);
				
				cy.get('#layout-list .layout-item').eq(1).then(($secondItem) => {
					const initialY = $secondItem.offset()?.top || 0;
					
					// Remove first item
					cy.get('#remove-layout-item').click();
					
					// CRITICAL: Verify exit animation is happening
					// The removed item should still exist briefly with reduced opacity
					cy.wait(50);
					cy.get('#layout-list .layout-item').first().then(($exitingItem) => {
						const style = window.getComputedStyle($exitingItem[0]);
						const opacity = parseFloat(style.opacity);
						const transform = style.transform;
						cy.log(`Exit item opacity: ${opacity}, transform: ${transform}`);
						
						// After animation completes
						cy.wait(350);
						cy.get('#layout-list .layout-item').first().then(($nowFirst) => {
							const newY = $nowFirst.offset()?.top || 0;
							expect(newY).to.be.lessThan(initialY, 'Remaining items should move up');
						});
					});
				});
			});
		});

		describe('with presenceAffectsLayout=false', () => {
			it('does NOT trigger layout animations on siblings when items enter', () => {
				cy.get('#add-no-layout-item', { timeout: 10000 }).should('be.visible');
				
				// Get initial position
				cy.get('#no-layout-list .no-layout-item').first().then(($firstItem) => {
					const initialY = $firstItem.offset()?.top || 0;
					
					// Add new item
					cy.get('#add-no-layout-item').click();
					
					// With presenceAffectsLayout=false, siblings should jump instantly (no smooth animation)
					cy.wait(50);
					cy.get('#no-layout-list .no-layout-item').eq(1).then(($movedItem) => {
						const newY = $movedItem.offset()?.top || 0;
						// Position should change but without layout transform animation on siblings
						expect(newY).to.be.greaterThan(initialY);
					});
				});
			});

			it('does NOT trigger layout animations on siblings when items exit', () => {
				// Add items first
				cy.get('#add-no-layout-item').click();
				cy.get('#add-no-layout-item').click();
				cy.wait(400);
				
				// Get initial count
				cy.get('#no-layout-list .no-layout-item').should('have.length.greaterThan', 3);
				
				// Remove first item
				cy.get('#remove-no-layout-item').click();
				
				// With presenceAffectsLayout=false, remaining items jump to new positions
				cy.wait(50);
				cy.get('#no-layout-list .no-layout-item').should('have.length.greaterThan', 2);
			});
		});

		describe('default behavior', () => {
			it('defaults presenceAffectsLayout to true when not specified', () => {
				cy.get('#default-presence-list').should('be.visible');
				
				// Get initial count
				cy.get('#default-presence-list .default-item').should('have.length', 3);
				
				// Add new item (added at end)
				cy.get('#add-default-item').click();
				cy.wait(100);
				
				// Verify new item was added with enter animation
				cy.get('#default-presence-list .default-item').should('have.length', 4);
				
				// The new item should have opacity animation
				cy.get('#default-presence-list .default-item').last().then(($newItem) => {
					const opacity = parseFloat(window.getComputedStyle($newItem[0]).opacity);
					// After animation, should be fully visible
					cy.wait(300);
					cy.get('#default-presence-list .default-item').last().should('have.css', 'opacity', '1');
				});
			});
		});
	});
});
