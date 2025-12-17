describe('Debug Hydration', () => {
  it('checks if JavaScript executes at all', () => {
    cy.visit('/animate-presence-basics', { timeout: 15000 });
    
    // Check body immediately
    cy.get('body').invoke('prop', 'innerHTML').then((html) => {
      cy.log(`Initial body HTML length: ${html.length}`);
    });
    
    // Wait for hydration
    cy.wait(5000);
    
    // Check again after wait
    cy.get('body').invoke('prop', 'innerHTML').then((html) => {
      cy.log(`After 5s body HTML length: ${html.length}`);
      // If hydration worked, there should be more content
      expect(html.length).to.be.greaterThan(1000);
    });
    
    // Check for window ready flag
    cy.window().its('__apReady').then((ready) => {
      cy.log(`__apReady: ${ready}`);
      expect(ready).to.eq(true);
    });
    
    // Check for test elements
    cy.get('[data-testid="ap-ready"]').should('be.visible');
  });
});
