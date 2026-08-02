type MotionFrame = {
	opacity: number;
	translateY: number;
};

type StaggerUpdate = {
	opacity: number;
	time: number;
	y: number;
};

type StaggerWindow = Window & {
	__staggerUpdates?: Record<number, StaggerUpdate[]>;
};

const staggerItems = [1, 2, 3, 4, 5];

function readMotionFrame(window: Window, element: HTMLElement): MotionFrame {
	const style = window.getComputedStyle(element);
	return {
		opacity: Number.parseFloat(style.opacity),
		translateY: style.transform === 'none' ? 0 : new window.DOMMatrix(style.transform).m42,
	};
}

describe('whileInView', () => {
	it('Animates when an element enters the viewport', () => {
		cy.visit('?test=while-in-view')
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
				expect($element.innerText).to.equal('Out');
			});

		cy.scrollTo(0, 50)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(0, 255, 0)');
				expect($element.innerText).to.equal('In');
			});
	});

	it('Animates when an element leaves the viewport', () => {
		cy.visit('?test=while-in-view').wait(50);

		cy.scrollTo(0, 0)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
				expect($element.innerText).to.equal('Out');
			});
	});

	it("Animates only when all an element enters the viewport and amount='all'", () => {
		cy.visit('?test=while-in-view&amount=all')
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
			});

		cy.scrollTo(0, 50)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
			});

		cy.scrollTo(0, 150)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(0, 255, 0)');
			});
	});

	it('Animates when an element enters the viewport once', () => {
		cy.visit('?test=while-in-view&once=true')
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
				expect($element.innerText).to.equal('Out');
			});

		cy.scrollTo(0, 50)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(0, 255, 0)');
				expect($element.innerText).to.equal('In');
			});

		cy.scrollTo(0, 0)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(0, 255, 0)');
				expect($element.innerText).to.equal('In');
			});
	});

	it('Animates when entering a custom root', () => {
		cy.visit('?test=while-in-view-custom-root')
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
			})
			.get('#container')
			.scrollTo(500, 0)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(0, 255, 0)');
			})
			.get('#container')
			.scrollTo(0, 0)
			.wait(50)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(255, 0, 0)');
			});
	});

	it('keeps staggered children hidden until intersecting and then reveals them in staggered order', () => {
		cy.visit('/?test=while-in-view&staggeredChildren=true');
		cy.get('html', { timeout: 30000 }).should('have.attr', 'data-fixture-ready', 'while-in-view');
		cy.window().then((window) => window.scrollTo(0, 0));

		cy.get('#staggered-list').then(([$list]) => {
			cy.window().then((window) => {
				expect($list.getBoundingClientRect().top).to.be.greaterThan(window.innerHeight);
			});
		});

		cy.get('[data-stagger-item]').should('have.length', 5);
		cy.get('[data-stagger-item]').then(($items) => {
			cy.window().then((window) => {
				for (const item of [...$items] as HTMLElement[]) {
					const frame = readMotionFrame(window, item);
					expect(frame.opacity).to.be.closeTo(0, 0.02);
					expect(frame.translateY).to.be.closeTo(16, 1);
				}
			});
		});

		cy.get('#staggered-list').then(([$list]) => {
			cy.window().then((window) => {
				const rect = $list.getBoundingClientRect();
				const targetY = Math.max(window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2, 0);
				window.scrollTo(0, targetY);
			});
		});

		cy.get('[data-stagger-item]', { timeout: 10000 }).should(($items) => {
			for (const item of [...$items] as HTMLElement[]) {
				const frame = readMotionFrame(item.ownerDocument.defaultView!, item);
				expect(frame.opacity).to.be.closeTo(1, 0.05);
				expect(frame.translateY).to.be.closeTo(0, 1);
			}
		});

		cy.window().then((window) => {
			const updates = (window as StaggerWindow).__staggerUpdates ?? {};
			const startTimes = staggerItems.map((number) => {
				const itemUpdates = updates[number] ?? [];
				expect(
					itemUpdates.some((update) => update.y > 1 && update.y < 15),
					`child ${number} should animate y through intermediate values; updates=${JSON.stringify(itemUpdates)}`
				).to.equal(true);
				expect(
					itemUpdates.some((update) => update.opacity > 0.05 && update.opacity < 0.95),
					`child ${number} should animate opacity through intermediate values; updates=${JSON.stringify(itemUpdates)}`
				).to.equal(true);

				const firstIntermediate = itemUpdates.find((update) => update.opacity > 0.05 && update.opacity < 0.95);
				return firstIntermediate ? firstIntermediate.time - firstIntermediate.opacity * 1000 : -1;
			});

			expect(startTimes[0]).to.be.greaterThan(-1);
			for (let index = 1; index < startTimes.length; index++) {
				expect(startTimes[index], `child ${index + 1} should start after child ${index}`).to.be.greaterThan(
					startTimes[index - 1] + 40
				);
			}
		});
	});

	/**
	 * Manually verified this does work but headless browser not respecting margin
	 */
	it.skip('Respects margin', () => {
		cy.visit('?test=while-in-view&margin=100px')
			.wait(100)
			.get('#box')
			.should(([$element]: any) => {
				expect($element.style.backgroundColor).to.equal('rgb(0, 255, 0)');
				expect($element.innerText).to.equal('In');
			});
	});
});
