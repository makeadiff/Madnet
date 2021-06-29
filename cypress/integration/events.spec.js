import { app_url, fellow_email, fellow_password, user_email, user_name } from '../secrets/config.js';

describe('Events Page', () => {

  it('Login to app', () => {
    Cypress.config('defaultCommandTimeout', 10000)
    cy.visit(app_url)
    cy.waitForReact(1000, '#root')
    cy.get('ion-input#email>input').type(fellow_email)
    cy.get('ion-input#password>input')
      .type(fellow_password)
      .should('have.value', fellow_password)
    cy.contains('Sign In').click()
  })

  it('Link to display Events Page', () => {
    cy.contains('Events').click()
    cy.url().should('include', '/events')
  })

  it('Checks all invitation & city link', () => {
    cy.get('[value="in-city"]').click()
    cy.get('[value="invitations"]').click()
  })

  it('Add a new event page loads', () => {
    cy.get('.fab-horizontal-start > .ion-activatable').click()
    cy.contains('Add/Edit Event Details')
  })
})