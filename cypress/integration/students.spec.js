import {
  app_url,
  fellow_email,
  fellow_password,
  user_email,
  user_name
} from '../secrets/config.js'

describe('Student Page', () => {

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

  it('Link to display Students Page', () => {
    cy.contains('Students').click()
    cy.url().should('include', '/students')
  })

  it('Content of Ellipsis should load', () => {
    cy.get(':nth-child(1) > ion-grid.md > ion-row.md > [size-md="2"] > .userEditButton').click()
    cy.contains('More')
    cy.contains('Delete')
    cy.root().type('{esc}')
  })

  it('Contents of 1st Student should load', () => {
    cy.get(':nth-child(2) > a > .noPadding > .ion-inherit-color > p').click()
    cy.contains('View/Edit')
  })

  it('Contents of Student can be edited', () => {
    cy.get('.fab-horizontal-end > .ion-activatable').click()
    cy.contains('View/Edit')
    cy.get('#name > .native-input').type(" Test");
    cy.get('.native-textarea').type(" Test");
    cy.get('#birthday > .native-input').type("2000-05-01")
    cy.get(':nth-child(2) > .ios').click();
    cy.get(':nth-child(3) > .ios').click();
    cy.contains('Save')
  })
})
