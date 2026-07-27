describe('AnimatePresenceStack exit', () => {
	it('keeps the front card at its terminal opacity until removal', () => {
		let reachedExitFrame = false;
		let reboundedComputedOpacity = false;
		let observer: MutationObserver | undefined;
		const opacityHistory: string[] = [];

		cy.visit('?test=animate-presence-stack');
		cy.get('html').should('have.attr', 'data-fixture-ready', 'animate-presence-stack');
		cy.wait(150);

		cy.get('#presswipe-0').then(([$item]) => {
			const item = $item as HTMLElement;
			observer = new MutationObserver((records) => {
				for (const record of records) {
					if (record.oldValue != null) opacityHistory.push(record.oldValue);
				}
				opacityHistory.push(item.getAttribute('style') ?? '');
			});
			observer.observe(item, {
				attributeFilter: ['style'],
				attributeOldValue: true,
			});

			const sampleFrame = () => {
				if (!item.isConnected) return;

				const opacity = Number.parseFloat(getComputedStyle(item).opacity);
				if (opacity <= 0.001) {
					reachedExitFrame = true;
				} else if (reachedExitFrame && opacity > 0.005) {
					reboundedComputedOpacity = true;
				}

				requestAnimationFrame(sampleFrame);
			};

			requestAnimationFrame(sampleFrame);
		});

		cy.get('#dismiss-front-card').click();
		cy.get('#presswipe-0', { timeout: 3000 }).should('not.exist');
		cy.then(() => {
			for (const record of observer?.takeRecords() ?? []) {
				if (record.oldValue != null) opacityHistory.push(record.oldValue);
			}
			observer?.disconnect();

			let reachedTerminalOpacity = false;
			let restoredOpacity = false;
			for (const style of opacityHistory) {
				const match = style.match(/(?:^|;\s*)opacity:\s*([^;]+)/);
				const opacity = match ? Number.parseFloat(match[1]) : Number.NaN;
				if (Number.isFinite(opacity) && opacity <= 0.001) {
					reachedTerminalOpacity = true;
				} else if (reachedTerminalOpacity && Number.isFinite(opacity) && opacity > 0.01) {
					restoredOpacity = true;
				}
			}
			expect(reachedExitFrame).to.equal(true);
			expect(reboundedComputedOpacity).to.equal(false);
			expect(reachedTerminalOpacity, opacityHistory.join('\n')).to.equal(true);
			expect(restoredOpacity, opacityHistory.join('\n')).to.equal(false);
		});
	});
});
