import { app_url, fellow_email, fellow_password, user_email, user_name } from '../secrets/config.js';

describe('User Page', () => {
  // beforeEach(() => {
  // })

  it('Login to app', () => {
    Cypress.config('defaultCommandTimeout', 10000);
    cy.visit(app_url);
    cy.waitForReact(1000, '#root');
    cy.get("ion-input#email>input").type(fellow_email);
    cy.get("ion-input#password>input").type(fellow_password).should('have.value', fellow_password);
    cy.contains("Sign In").click();

  })

  it('Link to Volunteers Page should work', () => {
    cy.contains("Volunteers").click();
    cy.url().should('include', "/users");
  })

  it('Sample Volunteers present in listing', () => {
    cy.contains(user_email);
  })

  it('Search Page should load', () => {
    cy.get("ion-segment-button[value='search']").click();
    cy.contains("Search Volunteer(s)");
  })

  it('Volunteer Search by email should work', () => {
    cy.get("ion-input#any_email>input").type(user_email);
    cy.get("#action").click();
    cy.contains(user_name)
  })

  // :TODO: 
  // - Test Pagination
  // - Needs Attention Section
  // - Search by UserGroup


})