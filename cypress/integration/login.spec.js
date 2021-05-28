// binny.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('https://makeadiff.in/madnet/')
  	cy.waitForReact(1000, '#root');
  })

  it('Login page should render', () => {
    // cy.get("ion-card-title").should('be.visible');
    cy.contains("Login to MADNet").should('be.visible');
  })

  it('Login should not work with wrong password', () => {
  	cy.get("ion-input#email>input").type("ideal.teacher.1@makeadiff.in").should('have.value', "ideal.teacher.1@makeadiff.in");
  	cy.get("ion-input#password>input").type("wrong-password").should('have.value', "wrong-password");

  	cy.contains("Sign In").click();
  	cy.get(".toast-message").should('have.text', "Incorrect password provided")
  })

  it('Login should work', () => {
  	cy.get("ion-input#email>input").type("ideal.teacher.1@makeadiff.in");
  	cy.get("ion-input#password>input").type("pass").should('have.value', "pass");
  	cy.contains("Sign In").click();
  	cy.url().should('include', "/dashboard")
  })
})
