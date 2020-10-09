// References
// https://blog.bitsrc.io/testing-your-react-app-with-puppeteer-and-jest-c72b3dfcde59
// https://github.com/puppeteer/puppeteer
// https://pptr.dev/

const puppeteer = require('puppeteer')
const {  QueryHandler } = require("query-selector-shadow-dom/plugins/puppeteer");

const isDebugging = () => {
    const debugging_mode = {
        headless: false,
        slowMo: 20,
        // devtools: true,
    }
    return process.env.NODE_ENV === 'debug' ? debugging_mode : {}
}
jest.setTimeout(20 * 1000)

let browser
let page
beforeAll(async () => { 
    await puppeteer.__experimental_registerCustomQueryHandler('shadow', QueryHandler);
    browser = await puppeteer.launch(isDebugging()) 
    page = await browser.newPage() 
    await page.goto('http://localhost:8100/') 
    // page.setViewport({ width: 500, height: 2400 })
})
afterAll(() => {     
    // if (isDebugging()) {
    browser.close()     
    // } 
})

describe('Login Page', () => {
    test('Title is correct', async() => {
        const html = await page.$eval('ion-card-title', e => e.innerHTML);
        expect(html).toBe('Login to MADNet');
    })

    test('login form - with incorrect details', async () => {
        await page.click('#email')
        await page.type('#email', "ideal.teacher.1@makeadiff.in")
        await page.click('#password')
        await page.type('#password', "wrong-password")
        
        await page.click('[type="submit"]')
        try {
            await page.waitForSelector('shadow/.toast-message', {timeout: 5000})
            const message = await page.$eval('shadow/.toast-message', e => e.innerHTML);
            expect(message).toBe('Incorrect password provided');
        } catch (err) {
            expect("Show Toast message").toBe("NOT WORKING")
        }
    })

    test('login form - succussful login', async () => {
        // await page.click('#email') // Already given earlier. Else it will enter it again
        // await page.type('#email', "ideal.teacher.1@makeadiff.in")
        await page.click('#password')
        await page.type('#password', "pass")
        
        await page.click('[type="submit"]')

        try {
            await page.waitForSelector('shadow/ion-title', {timeout: 5000})
            const message = await page.$eval('shadow/ion-title', e => e.innerHTML);
            expect(message).toBe('Dashboard');
        } catch (err) {
            expect("Page Title Change to Dashboard").toBe("NOT WORKING")
        }

        let new_url = page.url()
        expect(new_url).toMatch("/dashboard")

        try {
            const message = await page.$eval('shadow/#greeting-title', e => e.innerHTML);
            expect(message).toBe('Hello, Ideal Teacher 1');
        } catch (err) {
            expect("Page Title Change to Dashboard").toBe("NOT WORKING")
        }
    })
})

/**
 * Node REPL
 * $ node
 * > const puppeteer = require('puppeteer')
 * > const {  QueryHandler } = require("query-selector-shadow-dom/plugins/puppeteer");
 * > let browser; (async () => { browser  = await puppeteer.launch({ headless: false }); })();
 * > let page; browser.newPage().then((p) => { page = p })
 * > page.goto("http://localhost:8100")
 */