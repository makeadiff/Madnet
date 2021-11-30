import { app_url, user_email, user_password } from '../secrets/config.js';

describe('Donation Page', () => {
  // beforeEach(() => {
  // })

  it('Login to app', () => {
    cy.visit(app_url);
    cy.waitForReact(1000, '#root');
    cy.get("ion-input#email>input").type(user_email);
    cy.get("ion-input#password>input").type(user_password).should('have.value', user_password);
    cy.contains("Sign In").click();

  })

  it('Link to Donation Page should work', () => {
    // cy.get("ion-card-title").should('be.visible');
    cy.contains("Donations").click();
    cy.url().should('include', "/donations");
  })

  it('Add new donation page should work', () => {
    cy.get("ion-fab-button").click();
    cy.url().should('include', "/donations/0");

    cy.get("ion-input#donor_name>input").type("Test Donor").should('have.value', "Test Donor");
    cy.get("ion-input#donor_email>input").type("donor.email@gmail.com").should('have.value',"donor.email@gmail.com");
    cy.get("ion-input#donor_phone>input").type("9886768565").should('have.value',"9886768565");
    cy.get("ion-input#amount>input").type("13").should('have.value',"13");

    // :TODO: Test differnt source, different dates, form validation

    cy.contains("Save").click();

    cy.get(".toast-message").should('include.text', "Donation details saved. Donation ID:");
    // :TODO: Test if Toast goes away?
  });

  it('Shows added donation in listing page', () => {
    cy.contains("Donations").click();
    cy.url().should('include', "/donations");
    cy.contains("Test Donor") // There will be older donations from this donor. 
  })

})
