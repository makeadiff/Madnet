import {
  app_url,
  fellow_email,
  fellow_password,
  user_email,
  user_name
} from '../secrets/config.js'

describe('Shelter Page', () => {
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

  it('Link to display all Shelters should work', () => {
    cy.contains('Shelters').click()
    cy.url().should('include', '/shelters')
  })

  it('Contents of 1st Shelter should load', () => {
    cy.get(
      '.dark > ion-grid.md > .ion-justify-content-start > :nth-child(1)'
    ).click()
    cy.contains('Batch(es)')
    cy.contains('Class Section(s)')
    cy.contains('Students')
  })
})
