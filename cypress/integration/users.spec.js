import { app_url, fellow_email, fellow_password, user_email, user_name } from '../secrets/config.js';

describe('Donation Page', () => {
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

//   it('Add new donation page should work', () => {
//     cy.get("ion-fab-button").click();
//     cy.url().should('include', "/donations/0");

//     cy.get("ion-input#donor_name>input").type("Test Donor").should('have.value', "Test Donor");
//     cy.get("ion-input#donor_email>input").type("donor.email@gmail.com").should('have.value',"donor.email@gmail.com");
//     cy.get("ion-input#donor_phone>input").type("9886768565").should('have.value',"9886768565");
//     cy.get("ion-input#amount>input").type("13").should('have.value',"13");

//     // :TODO: Test differnt source, different dates, form validation

//     cy.contains("Save").click();

//     cy.get(".toast-message").should('include.text', "Donation details saved. Donation ID:");
//     // Test if Tost goes away?
//   });

//   it('Shows added donation in listing page', () => {
//     cy.contains("Donations").click();
//     cy.url().should('include', "/donations");
//     cy.contains("Test Donor") // There will be older donations from this donor. 
//   })

})
