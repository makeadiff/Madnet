describe('Dashboard', function () {
  beforeAll(async function () {
    await browser.waitForAngularEnabled(false)
    await browser.get('http://localhost:8100/#/dashboard')
    await browser.waitForReact()
  })

  it('should render properly', async function () {
    expect(await browser.getTitle()).toEqual('MADNet')
  })

  it('it should show credits', async function () {
    expect(await element(by.css('.infoDisc ion-text')).getText()).toBe('1.5')
  })

  it('it should show CPP Alert', async function () {
    let EC = protractor.ExpectedConditions
    await browser.wait(EC.visibilityOf($('.alert-card')), 6000)

    expect(await element(by.css('.alert-card.danger h4')).getText()).toBe(
      'CPP Not Signed'
    )
  })
})

/*
Sample Code that you can use...
await element(by.css('ion-input[name="email"] input')).clear().sendKeys("data.simulation@makeadiff.in");
expect(await element(by.css('ion-input[name="email"] input')).getAttribute("validationMessage")).toBe("")
await element(by.id("login")).click();
await browser.sleep(3000)
expect(await browser.getCurrentUrl()).toContain("#/dashboard");
*/
