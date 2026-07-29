/**
 * A `layoutId` element that unmounts from one parent and mounts into another in
 * the same update should animate between the two positions rather than
 * teleporting. Sampling per animation frame is the only way to tell a fast
 * animation apart from no animation at all.
 *
 * The click has to be dispatched from inside the sampling task rather than as a
 * separate Cypress command: on a loaded machine the gap between two commands can
 * exceed the animation's duration, so the sampler would only ever see the
 * resting position and a genuine animation would look like a teleport.
 */
const variants = ['plain', 'xy', 'reorder'] as const;

const MAX_FRAMES = 120;
const SETTLED_FRAMES = 8;

function measureLeft(win: Window) {
	const el = win.document.getElementById('box');
	return el ? Math.round(el.getBoundingClientRect().left) : null;
}

function clickAndSample(win: Window): Promise<number[]> {
	return new Promise((resolve) => {
		const samples: number[] = [];
		let settled = 0;

		const tick = () => {
			const left = measureLeft(win);
			if (left !== null) {
				settled = left === samples[samples.length - 1] ? settled + 1 : 0;
				samples.push(left);
			}

			if (samples.length >= MAX_FRAMES || settled >= SETTLED_FRAMES) {
				resolve(samples);
			} else {
				win.requestAnimationFrame(tick);
			}
		};

		win.document.getElementById('move')?.click();
		win.requestAnimationFrame(tick);
	});
}

describe('Shared layoutId across parents', () => {
	for (const variant of variants) {
		it(`animates a ${variant} element between two parents`, () => {
			cy.visit(`?test=layout-shared-cross-parent&variant=${variant}`);
			cy.get('html').should('have.attr', 'data-fixture-ready', 'layout-shared-cross-parent');
			cy.get('#box').should('exist');

			cy.window()
				.then((win) => {
					const start = measureLeft(win) as number;
					return clickAndSample(win).then((samples) => ({ start, samples }));
				})
				.then(({ start, samples }) => {
					const end = samples[samples.length - 1];
					const detail = `start=${start} samples=${JSON.stringify(samples)}`;

					expect(end, `element reaches the other column: ${detail}`).to.be.greaterThan(start + 100);

					const distinct = new Set(samples.filter((left) => left > start && left < end));

					expect(distinct.size, `expected intermediate frames, got ${detail}`).to.be.greaterThan(2);
				});
		});
	}
});
