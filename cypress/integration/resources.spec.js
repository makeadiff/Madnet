import {
    app_url,
    fellow_email,
    fellow_password,
    user_id
} from '../secrets/config.js'

describe('Resources page', () => {

    it('Login to app', () => {
        Cypress.config('defaultCommandTimeout', 10000)
        cy.visit(app_url);
        cy.waitForReact(1000, '#root');
        cy.get("ion-input#email>input").type(fellow_email);
        cy.get("ion-input#password>input").type(fellow_password).should('have.value', fellow_password);
        cy.contains("Sign In").click();
    
      })

    it('Link to display Resources Page', () => {
        cy.contains('Resources').click()
        cy.url().should('include', '/links')
    })

    it('Display list of Resources ', () => {
        cy.contains('Website')
        cy.contains('Make a Difference Website')

        cy.contains('Personal Fundraising Link')
        cy.contains('All the donations made using this link will automatically be tagged to you.')

        cy.contains('CFR Leaderboard')
        cy.contains('Community Fund Raising Status Dashboard / Leaderboard')
    })

    it('Validate Resources href', () => {
        cy.contains("a", "Website")
            .should($a => {
            const message = $a.parent().parent().text();
            expect($a, message).to.not.have.attr("href", "#undefined");
        });

        cy.contains("a", "Personal Fundraising Link")
            .should($a => {
            const message = $a.parent().parent().text();
            expect($a, message).to.not.have.attr("href", "#undefined");
        });

        cy.contains("a", "CFR Leaderboard")
            .should($a => {
            const message = $a.parent().parent().text();
            expect($a, message).to.not.have.attr("href", "#undefined");
        });
    })

    it('URL of personal fundraising URL match the user id', () => {
        cy.contains("a", "Personal Fundraising Link")
            .should($a => {
            const message = $a.parent().parent().text();
            expect($a, message).to.have.attr("href").contain(user_id);
        });
    })
})
  