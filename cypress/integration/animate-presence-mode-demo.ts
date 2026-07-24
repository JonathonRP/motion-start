function readTopAt(index: number) {
	const element = Cypress.$('ul li')[index] as HTMLElement | undefined;
	if (!element) throw new Error(`Missing item at index ${index}`);
	return element.getBoundingClientRect().top;
}

function readWidth(label: string) {
	const element = Cypress.$(`ul li[aria-label="${label}"]`)[0] as HTMLElement | undefined;
	if (!element) throw new Error(`Missing item: ${label}`);
	return element.getBoundingClientRect().width;
}

function expectAnimating(value: number, initial: number, final: number) {
	expect(Math.abs(value - initial)).to.be.greaterThan(1);
	expect(Math.abs(value - final)).to.be.greaterThan(1);
}

describe('AnimatePresenceMode demo', () => {
	beforeEach(() => {
		cy.visit('?test=animate-presence-mode-demo');
		cy.get('html').should('have.attr', 'data-fixture-ready', 'animate-presence-mode-demo');
		cy.wait(150);
		cy.contains('button', 'Add item').click();
		cy.contains('button', 'Add item').click();
		cy.contains('button', 'Add item').click();
		cy.wait(200);
	});

	it('animates lower siblings in default sync mode when a middle card exits', () => {
		const initial2 = readTopAt(2);
		const initial3 = readTopAt(3);

		cy.get('ul li').eq(1).click();
		cy.wait(550);

		cy.then(() => {
			expectAnimating(readTopAt(1), initial2, initial2 - 100);
			expectAnimating(readTopAt(2), initial3, initial3 - 100);
		});
	});

	it('keeps the fixed list viewport from clipping spring travel at its top edge', () => {
		const initialWidth = readWidth('Remove item 2');

		cy.get('ul[aria-label="Animated items"]').then(([$list]) => {
			const style = getComputedStyle($list);
			expect(style.overflowY).to.equal('visible');
			expect($list.clientHeight).to.equal(300);
			expect($list.scrollHeight).to.be.greaterThan($list.clientHeight);
		});

		cy.get('ul li[aria-label="Remove item 1"]').click();
		cy.get('ul li').should('have.length', 3);
		cy.wait(900);

		cy.then(() => {
			expect(readWidth('Remove item 2')).to.be.closeTo(initialWidth, 0.5);
		});
	});

	it('does not restore an exiting item styles before removing it', () => {
		let reachedExitFrame = false;
		let reboundedBeforeRemoval = false;
		let clearedFinalOpacity = false;

		cy.get('ul li[aria-label="Remove item 1"]').then(([$item]) => {
			const item = $item as HTMLElement;
			const observer = new MutationObserver(() => {
				const opacity = Number.parseFloat(item.style.opacity);
				if (Number.isFinite(opacity) && opacity < 0.1) {
					reachedExitFrame = true;
				} else if (reachedExitFrame && item.style.opacity === '') {
					clearedFinalOpacity = true;
				}
			});
			observer.observe(item, { attributeFilter: ['style'] });

			const sampleFrame = () => {
				if (!item.isConnected) {
					observer.disconnect();
					return;
				}

				const opacity = Number.parseFloat(getComputedStyle(item).opacity);
				if (opacity < 0.1) {
					reachedExitFrame = true;
				} else if (reachedExitFrame && opacity > 0.5) {
					reboundedBeforeRemoval = true;
				}

				requestAnimationFrame(sampleFrame);
			};

			requestAnimationFrame(sampleFrame);
		});

		cy.get('ul li[aria-label="Remove item 1"]').click();
		cy.get('ul li[aria-label="Remove item 1"]', { timeout: 3000 }).should('not.exist');
		cy.then(() => {
			expect(reachedExitFrame).to.equal(true);
			expect(reboundedBeforeRemoval).to.equal(false);
			expect(clearedFinalOpacity).to.equal(false);
		});
	});
});
