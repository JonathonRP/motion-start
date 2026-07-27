// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
	return originalFn(url, options).then((window) => {
		if (typeof url !== 'string' || !url.startsWith('?test=')) return;

		return new Cypress.Promise((resolve, reject) => {
			const started = Date.now();
			const checkReady = () => {
				if (window.document.documentElement.dataset.fixtureReady) {
					resolve(window);
				} else if (Date.now() - started > 30000) {
					reject(new Error('Timed out waiting for the Svelte fixture to become ready'));
				} else {
					setTimeout(checkReady, 10);
				}
			};
			checkReady();
		});
	});
});
