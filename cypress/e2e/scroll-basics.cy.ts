import { expectBox } from '../support/expect-box'

describe('Scroll basics', () => {
	it('animates element when entering viewport with whileInView', () => {
		cy.visit('/scroll-basics', { timeout: 10000 });
		
		// Element should start invisible/transformed
		cy.get('#while-in-view-box', { timeout: 10000 }).should('exist').should(($el) => {
			expectBox($el[0].getBoundingClientRect()).to.be.visible();
		});
		
		// Initially out of viewport, should have initial opacity
		cy.get('#while-in-view-box').should('have.css', 'opacity', '0');
		
		// Scroll element into view
		cy.get('#while-in-view-box').scrollIntoView({ duration: 500 });
		
		// Wait for animation and verify it's visible
		cy.wait(600);
		cy.get('#while-in-view-box').should('have.css', 'opacity', '1');
	});

	it('tracks scroll progress', () => {
		cy.visit('/scroll-basics', { timeout: 10000 });
		
		cy.get('#scroll-progress', { timeout: 10000 }).should('exist');
		
		// At top, progress should be near 0
		cy.get('#scroll-progress').invoke('text').then(text => {
			const progress = parseFloat(text);
			expect(progress).to.be.lessThan(0.1);
		});
		
		// Scroll to middle
		cy.scrollTo('center');
		cy.wait(300);
		
		cy.get('#scroll-progress').invoke('text').then(text => {
			const progress = parseFloat(text);
			expect(progress).to.be.greaterThan(0.3);
			expect(progress).to.be.lessThan(0.7);
		});
		
		// Scroll to bottom
		cy.scrollTo('bottom');
		cy.wait(300);
		
		cy.get('#scroll-progress').invoke('text').then(text => {
			const progress = parseFloat(text);
			expect(progress).to.be.greaterThan(0.9);
		});
	});

	it('animates based on scroll position', () => {
		cy.visit('/scroll-basics', { timeout: 10000 });
		
		cy.get('#scroll-animated-box', { timeout: 10000 }).should('exist').should(($el) => {
			expectBox($el[0].getBoundingClientRect()).to.be.visible();
		});
		
		// Get initial transform
		cy.get('#scroll-animated-box').then($el => {
			const initialTransform = $el.css('transform');
			
			// Scroll down
			cy.scrollTo(0, 500);
			cy.wait(200);
			
			// Transform should change
			cy.get('#scroll-animated-box').should($newEl => {
				const newTransform = $newEl.css('transform');
				expect(newTransform).not.to.equal(initialTransform);
			});
		});
	});
});
