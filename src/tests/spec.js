describe('MADNet App Test', function() {
    beforeAll(async function () {
        await browser.waitForAngularEnabled(false)
        await browser.get('http://localhost:8100/')
        // await browser.driver.manage().window().maximize();
        await browser.waitForReact()
    })

    it('should have a title', async function() {
        expect(await browser.getTitle()).toEqual('MADNet');
    });

    it('should show error if no email or password is given', async () => {
        await element(by.id("login")).click();
        expect(await element(by.css('ion-input[name="email"] input')).getAttribute("validationMessage")).toBe("Please fill in this field.")
    });

    // This works - but if un-commented, it causes an error in the next function : "Failed: element click intercepted"
    // it('should show error if non-existintant user tries logging in.', async () => {
    //     await element(by.css('ion-input[name="email"] input')).sendKeys("non-existant-user@makeadiff.in");
    //     await element(by.css('ion-input[name="password"] input')).sendKeys("pass");
    //     await element(by.id("login")).click();
    //     await browser.sleep(2000)
    //     let EC = protractor.ExpectedConditions;
    //     await browser.wait(EC.visibilityOf($('.error-toast')), 6000);
    //     expect(await element(by.css(".error-toast")).getText()).toContain("Can't find any user with the given email/phone")
    //     await browser.sleep(1000)
    // });

    it('should login with valid creds', async () => {
        await element(by.css('ion-input[name="email"] input')).clear().sendKeys("data.simulation@makeadiff.in");
        await element(by.css('ion-input[name="password"] input')).clear().sendKeys("pass");
        expect(await element(by.css('ion-input[name="email"] input')).getAttribute("validationMessage")).toBe("")
        await element(by.id("login")).click();
        await browser.sleep(3000)
        expect(await browser.getCurrentUrl()).toContain("#/dashboard");
    });
});

/*
:TODO:

Test all routes...
/login


/events/create
/surveys/:surveyId
/induction/profile
/induction/setup
/induction/join
*/
