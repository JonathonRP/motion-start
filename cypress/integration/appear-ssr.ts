describe('SSR appear animation', () => {
	it('starts from server-rendered styles before any framework script loads', () => {
		cy.visit('/appear-ssr');

		cy.get('#appear-ssr').should('have.attr', 'style').and('include', 'opacity: 0').and('include', 'translateX(20px)');
		cy.get('script[data-motion-appear]')
			.should('have.attr', 'nonce', 'appear-e2e-nonce')
			.and('have.attr', 'data-motion-appear');
		cy.get('script[src]').should('not.exist');

		cy.get('#appear-ssr').should(($element) => {
			const element = $element[0] as HTMLElement;
			const browserWindow = element.ownerDocument.defaultView;
			const appearId = element.dataset.framerAppearId;
			const opacity = Number.parseFloat(getComputedStyle(element).opacity);
			const store = browserWindow?.__MotionAppearAnimations;

			expect(appearId).to.be.a('string').and.not.be.empty;
			expect(browserWindow?.MotionHasOptimisedAnimation?.(appearId, 'opacity')).to.equal(true);
			expect(store?.get(`${appearId}: opacity`)?.startTime).to.be.a('number');
			expect(opacity).to.be.greaterThan(0);
			expect(opacity).to.be.lessThan(1);
		});
	});
});
