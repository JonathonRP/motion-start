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
Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
    return originalFn(url, options).then(() => {
        // SvelteKit has SSR disabled so the page starts blank.
        // Wait for JS to render #loading, then wait for it to finish loading.
        cy.get('#loading', { timeout: 10000 }).should('exist')
        cy.get('#loading', { timeout: 10000 }).should('not.exist')
    })
})
