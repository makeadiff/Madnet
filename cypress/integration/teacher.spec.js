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
  it('Link to Central Perk Page should work', () => {
    cy.visit('https://makeadiff.in/madnet/#/shelters');
    cy.contains("Central Perk").click();
    cy.url().should('include', "/244");
  })
  it('Link of teacher assignments should work', () => {
    cy.contains("Teacher Assignments").click();
    cy.url().should('include', "/view-teachers");
  })
  it('Add new teacher should appear', () => {
    cy.contains("ADD NEW TEACHER").click();
    cy.contains("Data").click();
    cy.contains("Batch").click();
    cy.contains("Sunday").click();
    cy.contains("Ok").click();
    cy.contains("Class Section").click();
    cy.contains("6 A").click();
    cy.contains("Ok").click();
    cy.contains("Save assignment").click();
    cy.url().should('include', "/assign-teachers/");
    cy.contains("Save").click();
  })
  it('New teacher should appear', () => {
    cy.contains("Shelters").click();
    cy.contains("Central Perk").click();
    cy.contains("Teacher Assignments").click();
    cy.url().should('include', "/view-teachers");
    cy.contains("Sunday 04:00 PM")
  })
  it('Edit the existing teacher ', () => {
    cy.contains("ADD NEW TEACHER").click();
    cy.contains("Data").click();
    cy.contains("Batch").click();
    cy.contains("Sunday").click();
    cy.contains("Ok").click();
    cy.contains("Class Section").click();
    cy.contains("6 A").click();
    cy.contains("Ok").click();
    cy.contains("Save assignment").click();
    cy.url().should('include', "/assign-teachers/");
    cy.contains("Save").click();
  })
  it('Delete the first element on the page ', () => {
    cy.contains("Shelters").click();
    cy.contains("Central Perk").click();
    cy.contains("Teacher Assignments").click();
    cy.contains('delete').click();
  })
})