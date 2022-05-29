import { app_url, user_password, user_email } from '../secrets/config.js';

describe('Batch Page', () => {

  it('Login to app', () => {
    cy.visit(app_url);
    cy.waitForReact(1000, '#root');
    cy.get("ion-input#email>input").type(user_email);
    cy.get("ion-input#password>input").type(user_password).should('have.value', user_password);
    cy.contains("Sign In").click();

  })

  it('Link to Shelters Page should work', () => {
    cy.contains("Shelters").click();
    cy.url().should('include', "/shelters");
  })
  it('Link to Sacred Games TR Page should work', () => {
    cy.contains("Sacred Games TR").click();
    cy.url().should('include', "/243");
  })
  it('List of batches should appear', () => {
    cy.contains("Batch(es)").click();
    cy.url().should('include', "/batches");
  })
  it('Add batch page should appear', () => {
    cy.get("ion-fab-button").click();
    cy.url().should('include', "/batches/0");
    cy.contains("Save").click();
  })
  it('New batch should appear', () => {
    cy.contains("Shelters").click();
    cy.contains("Sacred Games TR").click();
    cy.contains("Batch(es)").click();
    cy.url().should('include', "/batches");
    cy.contains("Sunday 04:00 PM")
  })
  //I got an issue when loading the existing batches, 
  //I don't know if the reason of this error was my internet connection
  it('Edit the first element on the list ', () => {
    cy.get(".ion-content > .ion-list").first().click();
    cy.get("ion-fab-button").click();
    cy.contains('Save')
  })
  it('Delete the first element on the page ', () => {
    cy.get(".ion-content > .ion-list").first().click();
    cy.get("delete this batch").click();
    cy.contains('delete')
  })
})