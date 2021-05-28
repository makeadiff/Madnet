import { app_url, user_email, user_password } from '../secrets/config.js';

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit(app_url);
  	cy.waitForReact(1000, '#root');
  })

  it('Login page should render', () => {
    cy.wait(5000)
    cy.contains("Login to MADNet").should('be.visible');
  })

  it('Login should not work with wrong password', () => {
  	cy.get("ion-input#email>input").type(user_email).should('have.value', user_email);
  	cy.get("ion-input#password>input").type("wrong-password").should('have.value', "wrong-password");

  	cy.contains("Sign In").click();
  	cy.get(".toast-message").should('have.text', "Incorrect password provided")
  })

  it('Login should work', () => {
  	cy.get("ion-input#email>input").type(user_email);
  	cy.get("ion-input#password>input").type(user_password).should('have.value', user_password);
  	cy.contains("Sign In").click();
  	cy.url().should('include', "/dashboard")
  })
})
