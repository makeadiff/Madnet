exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['login.js', 'dashboard.js'],
    plugins: [  
        { 
            package: "protractor-react-selector"
        },
        {
            package: 'protractor-testability-plugin'
        }
    ],
    onPrepare: async () => {
        // await browser.waitForAngularEnabled(false);
    },
    capabilities: {
        browserName: 'firefox'
    }
}

/*
 Note - both plugins has to be installed globally for this to work
 sudo npm i -g --save-dev protractor-testability-plugin protractor-react-selector
 */